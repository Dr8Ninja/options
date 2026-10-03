package org.options.platform.identity.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.*;
import org.options.platform.ops.web.ApiFailure;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.*;

@Component
public class IdentityThrottle {
  private final JdbcTemplate jdbc;

  public IdentityThrottle(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public static byte[] digest(String value) {
    try {
      return MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
    } catch (java.security.NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW, noRollbackFor = ApiFailure.class)
  public void take(String purpose, String key, int limit, int seconds) {
    var hash = digest(key);
    var start = Instant.ofEpochSecond((Instant.now().getEpochSecond() / seconds) * seconds);
    int count =
        jdbc.queryForObject(
            "insert into auth_throttle(bucket_hash,purpose,window_start,failure_count,expires_at) values(?,?,?,1,? ) on conflict(bucket_hash,purpose,window_start) do update set failure_count=auth_throttle.failure_count+1,updated_at=now(),lock_version=auth_throttle.lock_version+1 returning failure_count",
            Integer.class,
            hash,
            purpose,
            java.sql.Timestamp.from(start),
            java.sql.Timestamp.from(start.plusSeconds(seconds * 2L)));
    if (count > limit)
      throw new ApiFailure(429, "RATE_LIMITED", "Too many attempts. Wait before trying again.");
  }

  public void checkLogin(String email) {
    if (Boolean.TRUE.equals(
        jdbc.queryForObject(
            "select exists(select 1 from auth_throttle where bucket_hash=? and purpose='LOGIN' and blocked_until>now())",
            Boolean.class,
            digest("failures:" + email))))
      throw new ApiFailure(429, "RATE_LIMITED", "Too many attempts. Wait before trying again.");
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void failedLogin(String email) {
    jdbc.update(
        """
      insert into auth_throttle(bucket_hash,purpose,window_start,failure_count,expires_at) values(?,'LOGIN','1970-01-01',1,now()+interval '30 minutes')
      on conflict(bucket_hash,purpose,window_start) do update set
      failure_count=case when auth_throttle.updated_at<now()-interval '15 minutes' then 1 else auth_throttle.failure_count+1 end,
      blocked_until=case when auth_throttle.updated_at>=now()-interval '15 minutes' and auth_throttle.failure_count>=9 then now()+interval '15 minutes' else null end,
      expires_at=now()+interval '30 minutes',updated_at=now(),lock_version=auth_throttle.lock_version+1
      """,
        digest("failures:" + email));
  }

  public void successfulLogin(String email) {
    jdbc.update(
        "delete from auth_throttle where bucket_hash=? and purpose='LOGIN'",
        digest("failures:" + email));
  }

  public void request(String purpose, String email, String source) {
    take(purpose, "address:" + email, 5, 3600);
    take(purpose, "source:" + source, 20, 3600);
    take(purpose, "global", 200, 60);
  }
}
