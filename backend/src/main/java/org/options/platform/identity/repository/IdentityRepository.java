package org.options.platform.identity.repository;

import java.util.*;
import org.options.platform.identity.model.Identity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class IdentityRepository {
  private final JdbcTemplate jdbc;

  public IdentityRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public Identity byEmail(String email, boolean lock) {
    return find("email_key", email, lock);
  }

  public Identity byPublicId(String id, boolean lock) {
    try {
      return find("public_id", UUID.fromString(id), lock);
    } catch (IllegalArgumentException ex) {
      return null;
    }
  }

  public Identity byId(long id, boolean lock) {
    return find("id", id, lock);
  }

  private Identity find(String column, Object value, boolean lock) {
    var rows =
        jdbc.query(
            "select * from account where " + column + "=?" + (lock ? " for update" : ""),
            (r, n) ->
                new Identity(
                    r.getLong("id"),
                    r.getObject("public_id", UUID.class),
                    r.getString("email"),
                    r.getString("password_hash"),
                    r.getString("status"),
                    r.getLong("auth_generation"),
                    r.getTimestamp("created_at").toInstant(),
                    r.getString("display_name"),
                    r.getString("theme"),
                    r.getLong("lock_version"),
                    new ArrayList<>()),
            value);
    if (rows.isEmpty()) return null;
    var a = rows.getFirst();
    a.roles().add("LEARNER");
    a.roles()
        .addAll(
            jdbc.queryForList(
                "select r.code from account_role ar join role r on r.id=ar.role_id where account_id=? and r.code<>'LEARNER' order by r.code",
                String.class,
                a.id()));
    return a;
  }

  public Long register(String email, String hash, String name) {
    var rows =
        jdbc.queryForList(
            "insert into account(public_id,email,email_key,password_hash,display_name,status,auth_generation,eligibility_attested_at,theme) values(gen_random_uuid(),?,?,?,?,'UNVERIFIED',0,now(),'system') on conflict(email_key) do nothing returning id",
            Long.class,
            email,
            email,
            hash,
            name);
    return rows.isEmpty() ? null : rows.getFirst();
  }

  public void enqueue(Identity a, String purpose, String target) {
    jdbc.update(
        "update auth_token set revoked_at=now(),lock_version=lock_version+1,updated_at=now() where account_id=? and purpose=? and revoked_at is null",
        a.id(),
        purpose);
    jdbc.update(
        "update job set state='FAILED',lease_token=null,lease_until=null,last_error_code='REPLACED',lock_version=lock_version+1,updated_at=now() where kind='MAIL' and account_id=? and mail_purpose=? and state in ('READY','RUNNING')",
        a.id(),
        purpose);
    jdbc.update(
        "insert into job(kind,dedupe_key,account_id,mail_purpose,target_email,requested_generation,intent_expires_at,state,due_at,attempts) values('MAIL',?,?,?, ?,?,now()+interval '30 minutes','READY',now(),0)",
        "identity-" + UUID.randomUUID(),
        a.id(),
        purpose,
        target,
        a.generation());
  }

  public void audit(Long id, String event) {
    jdbc.update(
        "insert into security_event(actor_account_id,event_type,request_id,outcome,occurred_at,expires_at) values(?,?,?,'COMPLETED',now(),now()+interval '90 days')",
        id,
        event,
        UUID.randomUUID().toString());
  }

  public void revoke(long id) {
    jdbc.update(
        "update account set auth_generation=auth_generation+1,lock_version=lock_version+1,updated_at=now() where id=?",
        id);
  }

  public void login(long id) {
    jdbc.update(
        "update account set last_login_at=now(),lock_version=lock_version+1,updated_at=now() where id=?",
        id);
  }

  public void password(long id, String hash) {
    jdbc.update(
        "update account set password_hash=?,lock_version=lock_version+1,updated_at=now() where id=?",
        hash,
        id);
  }

  public void verify(long id) {
    jdbc.update(
        "update account set status='ACTIVE',verified_at=now(),lock_version=lock_version+1,updated_at=now() where id=? and status='UNVERIFIED'",
        id);
  }

  public void email(long id, String email) {
    jdbc.update(
        "insert into identity_mail_notice(account_id,recipient) select id,email from account where id=?",
        id);
    jdbc.update(
        "update account set email=?,email_key=?,lock_version=lock_version+1,updated_at=now() where id=?",
        email,
        email,
        id);
  }

  public void cancelEmail(long id) {
    jdbc.update(
        "update auth_token set revoked_at=now(),lock_version=lock_version+1,updated_at=now() where account_id=? and purpose='CHANGE_EMAIL' and revoked_at is null",
        id);
    jdbc.update(
        "update job set state='FAILED',lease_token=null,lease_until=null,lock_version=lock_version+1,updated_at=now() where account_id=? and mail_purpose='CHANGE_EMAIL' and state in ('READY','RUNNING')",
        id);
  }

  public void removePrivileges(long id) {
    jdbc.update(
        "delete from account_role where account_id=? and role_id in(select id from role where code<>'LEARNER')",
        id);
    jdbc.update("delete from identity_invitation where account_id=?", id);
  }

  public record Token(long id, long accountId, String purpose, String target, long generation) {}

  public Token token(byte[] digest) {
    var r =
        jdbc.query(
            "select * from auth_token where digest=? and consumed_at is null and revoked_at is null and expires_at>now()",
            (x, n) ->
                new Token(
                    x.getLong("id"),
                    x.getLong("account_id"),
                    x.getString("purpose"),
                    x.getString("target_email"),
                    x.getLong("created_generation")),
            digest);
    return r.isEmpty() ? null : r.getFirst();
  }

  public boolean consume(long id) {
    return jdbc.update(
            "update auth_token set consumed_at=now(),lock_version=lock_version+1,updated_at=now() where id=? and consumed_at is null and revoked_at is null and expires_at>now()",
            id)
        == 1;
  }

  public void profile(long id, String name, String theme, String path, long version) {
    if (path != null)
      throw new org.options.platform.ops.web.ApiFailure(
          422, "PATH_NOT_AVAILABLE", "Path preferences become available with learner enrollment.");
    if (jdbc.update(
            "update account set display_name=?,theme=?,lock_version=lock_version+1,updated_at=now() where id=? and lock_version=?",
            name,
            theme,
            id,
            version)
        != 1)
      throw new org.options.platform.ops.web.ApiFailure(
          412, "VERSION_CONFLICT", "Reload your account before editing.");
  }
}
