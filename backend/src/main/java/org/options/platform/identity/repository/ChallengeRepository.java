package org.options.platform.identity.repository;

import java.nio.charset.StandardCharsets;
import java.util.*;
import org.options.platform.identity.service.IdentityService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.*;

@Repository
public class ChallengeRepository {
  private final JdbcTemplate jdbc;

  public ChallengeRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Transactional
  public void save(long account, String session, String purpose, String options) {
    jdbc.update(
        "update auth_challenge set consumed_at=now(),lock_version=lock_version+1,updated_at=now() where session_primary_id=(select primary_id from spring_session where session_id=?) and consumed_at is null",
        session);
    int n =
        jdbc.update(
            "insert into auth_challenge(account_id,session_primary_id,purpose,challenge,expires_at) select ?,primary_id,?,?,now()+interval '5 minutes' from spring_session where session_id=?",
            account,
            purpose,
            options.getBytes(StandardCharsets.UTF_8),
            session);
    if (n != 1) throw IdentityService.denied();
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public String consume(long account, String session, String purpose) {
    var rows =
        jdbc.queryForList(
            "update auth_challenge set consumed_at=now(),lock_version=lock_version+1,updated_at=now() where account_id=? and session_primary_id=(select primary_id from spring_session where session_id=?) and purpose=? and consumed_at is null and expires_at>now() returning challenge",
            byte[].class,
            account,
            session,
            purpose);
    if (rows.size() != 1) throw IdentityService.invalidToken();
    return new String(rows.getFirst(), StandardCharsets.UTF_8);
  }
}
