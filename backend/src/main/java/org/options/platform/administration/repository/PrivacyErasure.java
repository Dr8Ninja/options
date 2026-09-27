package org.options.platform.administration.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/** Construct only with the privacy worker's connection, never the ordinary runtime pool. */
public final class PrivacyErasure {
  private final JdbcTemplate jdbc;

  public PrivacyErasure(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public void eraseAccount(long account) {
    if (!TransactionSynchronizationManager.isActualTransactionActive())
      throw new IllegalStateException("Erasure requires a transaction");
    if (!Boolean.TRUE.equals(
        jdbc.queryForObject(
            "select pg_has_role(current_user,'otr_privacy','USAGE')", Boolean.class)))
      throw new IllegalStateException("Privacy role required");
    jdbc.queryForList("select id from account where id=? for update", Long.class, account);
    jdbc.update("update account set status='DELETING' where id=?", account);
    jdbc.update(
        """
      insert into recovery_journal(sequence_no,event_type,subject_public_id,digest,expires_at)
      select nextval('recovery_journal_sequence'),'ACCOUNT_ERASE',public_id,
      encode(sha256(convert_to(public_id::text,'UTF8')),'hex'),transaction_timestamp()+interval '90 days'
      from account where id=?
      """,
        account);
    // An external export artifact still requires verified deletion by the privacy worker.
    // Retain its private key in the expired request so that work cannot be silently lost.
    jdbc.update(
        "update privacy_request set state='EXPIRED' where account_id=? and kind='EXPORT' and state in ('REQUESTED','RUNNING','READY')",
        account);
    jdbc.update("delete from account where id=?", account);
  }
}
