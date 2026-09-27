package org.options.platform.identity;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/** Domain API for the shared account-first lock order; caller must already own a transaction. */
@Component
public class AccountAccess {
  private final JdbcTemplate jdbc;

  public AccountAccess(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Transactional(propagation = Propagation.MANDATORY)
  public void lockActive(long accountId) {
    var states =
        jdbc.queryForList(
            "select status from account where id=? for update", String.class, accountId);
    if (states.size() != 1 || !states.getFirst().equals("ACTIVE"))
      throw new IllegalStateException("Account unavailable");
  }
}
