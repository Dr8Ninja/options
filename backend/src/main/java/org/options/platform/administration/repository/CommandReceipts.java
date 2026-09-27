package org.options.platform.administration.repository;

import java.util.UUID;
import java.util.function.LongSupplier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/** Typed enrollment receipt primitive; future operations must add an equally typed method. */
@Repository
public class CommandReceipts {
  private final JdbcTemplate jdbc;

  public CommandReceipts(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Transactional
  public long enrollment(
      long owner, String route, UUID requestKey, String hash, LongSupplier create) {
    var state =
        jdbc.queryForList("select status from account where id=? for update", String.class, owner);
    if (state.size() != 1 || !state.getFirst().equals("ACTIVE"))
      throw new IllegalStateException("Account unavailable");
    jdbc.update(
        "delete from command_receipt where actor_account_id=? and expiry_at<=transaction_timestamp()",
        owner);
    var existing =
        jdbc.query(
            "select request_sha256,enrollment_id from command_receipt where actor_account_id=? and operation_id='createEnrollment' and route_key=? and request_key=?",
            (r, n) -> new Receipt(r.getString(1), r.getLong(2)),
            owner,
            route,
            requestKey);
    if (!existing.isEmpty()) {
      if (!existing.getFirst().hash().equals(hash))
        throw new IllegalArgumentException("Idempotency key reused with different command");
      return existing.getFirst().id();
    }
    long id = create.getAsLong();
    jdbc.update(
        "insert into command_receipt(actor_account_id,operation_id,route_key,request_key,request_sha256,response_status,expiry_at,enrollment_id) values (?,'createEnrollment',?,?,?,201,transaction_timestamp()+interval '24 hours',?)",
        owner,
        route,
        requestKey,
        hash,
        id);
    return id;
  }

  private record Receipt(String hash, long id) {}
}
