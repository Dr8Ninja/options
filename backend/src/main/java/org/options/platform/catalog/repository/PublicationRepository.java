package org.options.platform.catalog.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class PublicationRepository {
  private final JdbcTemplate jdbc;

  public PublicationRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Transactional
  public long activate(long publication, long expectedGeneration) {
    jdbc.queryForList("select pg_advisory_xact_lock(8042026)");
    int changed =
        expectedGeneration == 0
            ? jdbc.update(
                "insert into active_publication(singleton,publication_id,generation) values (1,?,1) on conflict do nothing",
                publication)
            : jdbc.update(
                "update active_publication set publication_id=?,generation=generation+1,lock_version=lock_version+1,updated_at=transaction_timestamp() where singleton=1 and generation=?",
                publication,
                expectedGeneration);
    if (changed != 1) throw new IllegalStateException("Publication generation conflict");
    return expectedGeneration + 1;
  }
}
