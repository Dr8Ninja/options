package org.options.platform.identity.service;

import java.security.SecureRandom;
import java.util.*;
import org.options.platform.identity.repository.IdentityRepository;
import org.options.platform.identity.security.IdentityThrottle;
import org.options.platform.ops.config.AppProperties;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IdentityMail {
  private final JdbcTemplate jdbc;
  private final IdentityRepository repo;
  private final JavaMailSenderImpl sender;
  private final AppProperties app;
  private final String from;

  public IdentityMail(
      JdbcTemplate jdbc, IdentityRepository repo, Environment env, AppProperties app) {
    this.jdbc = jdbc;
    this.repo = repo;
    this.app = app;
    String mode = env.getProperty("IDENTITY_MAIL_MODE", "DISABLED");
    from = env.getProperty("IDENTITY_MAIL_FROM", "accounts@localhost.invalid");
    if (mode.equals("DISABLED")) {
      sender = null;
      return;
    }
    if (!Set.of("LOCAL", "SMTP").contains(mode))
      throw new IllegalStateException("Invalid identity mail mode");
    sender = new JavaMailSenderImpl();
    sender.setHost(env.getProperty("IDENTITY_MAIL_HOST", "127.0.0.1"));
    sender.setPort(
        Integer.parseInt(
            env.getProperty("IDENTITY_MAIL_PORT", mode.equals("LOCAL") ? "1025" : "587")));
    var props = sender.getJavaMailProperties();
    props.put("mail.smtp.connectiontimeout", "3000");
    props.put("mail.smtp.timeout", "3000");
    props.put("mail.smtp.writetimeout", "3000");
    props.put("mail.debug", "false");
    if (mode.equals("LOCAL")) {
      if (app.environment() == AppProperties.Environment.PRODUCTION
          || !Set.of("127.0.0.1", "localhost", "mailpit").contains(sender.getHost()))
        throw new IllegalStateException("Local mail sink required");
    } else {
      if (from.endsWith(".invalid")) throw new IllegalStateException("Configured sender required");
      sender.setUsername(env.getRequiredProperty("IDENTITY_MAIL_USERNAME"));
      sender.setPassword(env.getRequiredProperty("IDENTITY_MAIL_PASSWORD"));
      props.put("mail.smtp.auth", "true");
      props.put("mail.smtp.starttls.enable", "true");
      props.put("mail.smtp.starttls.required", "true");
      props.put("mail.smtp.ssl.checkserveridentity", "true");
    }
  }

  public boolean enabled() {
    return sender != null;
  }

  @Transactional
  public void deliver() {
    if (sender == null) return;
    var pending =
        jdbc.queryForList(
            "select account_id,id from job where kind='MAIL' and state='READY' and due_at<=now() and attempts<10 order by id limit 1");
    if (!pending.isEmpty()) {
      var p = pending.getFirst();
      var a = repo.byId(((Number) p.get("account_id")).longValue(), true);
      var rows =
          jdbc.queryForList(
              "select * from job where id=? and state='READY' for update", p.get("id"));
      if (rows.isEmpty()) return;
      var j = rows.getFirst();
      String purpose = (String) j.get("mail_purpose");
      boolean eligible =
          a != null
              && a.generation() == ((Number) j.get("requested_generation")).longValue()
              && ((java.sql.Timestamp) j.get("intent_expires_at"))
                  .toInstant()
                  .isAfter(java.time.Instant.now())
              && ((purpose.equals("VERIFY") && a.status().equals("UNVERIFIED"))
                  || (!purpose.equals("VERIFY") && a.status().equals("ACTIVE")));
      if (!eligible) {
        finish(p.get("id"), "FAILED");
        return;
      }
      byte[] bytes = new byte[32];
      new SecureRandom().nextBytes(bytes);
      String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
      jdbc.update(
          "update auth_token set revoked_at=now(),lock_version=lock_version+1,updated_at=now() where account_id=? and purpose=? and revoked_at is null",
          a.id(),
          purpose);
      jdbc.update(
          "insert into auth_token(account_id,purpose,digest,target_email,created_generation,expires_at) values(?,?,?,?,?,now()+make_interval(secs=>?))",
          a.id(),
          purpose,
          IdentityThrottle.digest(token),
          j.get("target_email"),
          a.generation(),
          purpose.equals("VERIFY") ? 86400 : 1800);
      String page =
          switch (purpose) {
            case "VERIFY" -> "verify";
            case "RESET" -> "reset";
            default -> "confirm-email";
          };
      String recipient =
          purpose.equals("CHANGE_EMAIL") ? (String) j.get("target_email") : a.email();
      try {
        send(
            recipient,
            "Options learning — account confirmation",
            "An account action was requested. Use the latest message and confirm deliberately in your browser.\n\n"
                + app.publicOrigin()
                + "/account/"
                + page
                + "#token="
                + token
                + "\n\nThis link expires in "
                + (purpose.equals("VERIFY") ? "24 hours" : "30 minutes")
                + " and can be used once. If you did not request it, ignore this message. No account action happens merely by opening the link.");
      } catch (org.springframework.mail.MailException ex) {
        throw new DeliveryFailed(((Number) j.get("id")).longValue());
      }
      finish(j.get("id"), "DONE");
    } else {
      var notices =
          jdbc.queryForList(
              "select * from identity_mail_notice where expires_at>now() and due_at<=now() and attempts<10 order by id for update skip locked limit 1");
      if (!notices.isEmpty()) {
        var n = notices.getFirst();
        try {
          send(
              (String) n.get("recipient"),
              "Options learning — email address changed",
              "Your account email was changed. If you did not authorize this, contact the configured site operator using a previously trusted channel.");
        } catch (org.springframework.mail.MailException ex) {
          throw new DeliveryFailed(((Number) n.get("id")).longValue(), true);
        }
        jdbc.update("delete from identity_mail_notice where id=?", n.get("id"));
      }
    }
  }

  public static final class DeliveryFailed extends RuntimeException {
    public final long id;
    public final boolean notice;

    DeliveryFailed(long id) {
      this(id, false);
    }

    DeliveryFailed(long id, boolean notice) {
      super("Mail delivery unavailable");
      this.id = id;
      this.notice = notice;
    }
  }

  @Transactional
  public void retry(long id, boolean notice) {
    if (notice) {
      jdbc.update(
          "update identity_mail_notice set attempts=attempts+1,due_at=now()+interval '5 minutes' where id=?",
          id);
      return;
    }
    jdbc.update(
        "update job set attempts=attempts+1,state=case when attempts>=9 then 'FAILED' else 'READY' end,due_at=now()+interval '5 minutes',last_error_code='MAIL_UNAVAILABLE',updated_at=now(),lock_version=lock_version+1 where id=? and state='READY'",
        id);
  }

  private void send(String recipient, String subject, String body) {
    var message = new SimpleMailMessage();
    message.setFrom(from);
    message.setTo(recipient);
    message.setSubject(subject);
    message.setText(body);
    sender.send(message);
  }

  private void finish(Object id, String state) {
    jdbc.update(
        "update job set state=?,attempts=attempts+1,lock_version=lock_version+1,updated_at=now() where id=?",
        state,
        id);
  }

  @Transactional
  public void purge() {
    jdbc.queryForObject("select expire_unverified_accounts()", Integer.class);
    jdbc.update(
        "delete from auth_token where expires_at<now()-interval '24 hours' or consumed_at<now()-interval '24 hours' or revoked_at<now()-interval '24 hours'");
    jdbc.update("delete from auth_throttle where expires_at<now()");
    jdbc.update("delete from auth_challenge where expires_at<now()-interval '24 hours'");
    jdbc.update("delete from identity_mail_notice where expires_at<now()");
    jdbc.update(
        "delete from job where kind='MAIL' and intent_expires_at<now()-interval '24 hours'");
  }
}
