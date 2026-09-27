package org.options.platform.ops.persistence;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class JobRepository {
  public record Lease(long id, String kind, UUID token, Instant until) {}

  private final JdbcTemplate jdbc;

  public JobRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Transactional
  public List<Lease> claim(int limit) {
    if (limit < 1 || limit > 10) throw new IllegalArgumentException("Lease batch must be 1 to 10");
    return jdbc.query(
        """
   with candidates as (select id from job where attempts<10 and
     ((state='READY' and due_at<=transaction_timestamp()) or (state='RUNNING' and lease_until<=transaction_timestamp()))
     order by due_at,id for update skip locked limit ?)
   update job j set state='RUNNING',lease_token=gen_random_uuid(),lease_until=transaction_timestamp()+interval '1 minute',
     attempts=attempts+1,lock_version=lock_version+1,updated_at=transaction_timestamp()
   from candidates c where j.id=c.id returning j.id,j.kind,j.lease_token,j.lease_until
   """,
        (r, n) ->
            new Lease(
                r.getLong(1),
                r.getString(2),
                r.getObject(3, UUID.class),
                r.getTimestamp(4).toInstant()),
        limit);
  }

  @Transactional
  public boolean complete(long id, UUID token) {
    return jdbc.update(
            "update job set state='DONE',lease_token=null,lease_until=null,lock_version=lock_version+1,updated_at=transaction_timestamp() where id=? and state='RUNNING' and lease_token=? and lease_until>transaction_timestamp()",
            id,
            token)
        == 1;
  }
}
