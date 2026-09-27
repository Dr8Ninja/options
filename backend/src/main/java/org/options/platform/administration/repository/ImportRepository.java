package org.options.platform.administration.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ImportRepository {
  private final JdbcTemplate jdbc;

  public ImportRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  /** Call after applying validated proposals, within that same transaction. Never publishes. */
  @Transactional(propagation = Propagation.MANDATORY)
  public void markApplied(long batch, long expectedGeneration) {
    jdbc.queryForList(
        "select pg_advisory_xact_lock(hashtextextended(manifest_sha256,809)) from import_batch where id=?",
        batch);
    jdbc.queryForList("select pg_advisory_xact_lock(8042026)");
    var pointers =
        jdbc.queryForList(
            "select generation from active_publication where singleton=1 for update", Long.class);
    long actual = pointers.isEmpty() ? 0 : pointers.getFirst();
    if (actual != expectedGeneration)
      throw new IllegalStateException("Import base generation changed");
    if (jdbc.update(
            """
   update import_batch set state='APPLIED',applied_at=transaction_timestamp(),lock_version=lock_version+1,updated_at=transaction_timestamp()
   where id=? and state='STAGED' and base_publication_id is not distinct from (select publication_id from active_publication where singleton=1)
   """,
            batch)
        != 1) throw new IllegalStateException("Import state or base conflict");
  }
}
