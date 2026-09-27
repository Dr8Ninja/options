package org.options.platform.learning.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class EnrollmentRepository {
  public record Completion(long requiredTopics, long selfCompleted) {}

  private final JdbcTemplate jdbc;

  public EnrollmentRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Transactional(readOnly = true)
  public Optional<Completion> exactVersionCompletion(long owner, UUID enrollment) {
    return jdbc
        .query(
            """
      select count(*) filter(where r.kind='TOPIC' and r.required),
        count(*) filter(where r.kind='TOPIC' and r.required and p.state='SELF_COMPLETED')
      from enrollment e join enrollment_requirement r on r.enrollment_id=e.id
      left join learning_progress p on p.account_id=e.account_id and p.topic_revision_id=r.revision_id
      where e.account_id=? and e.public_id=? group by e.id
      """,
            (r, n) -> new Completion(r.getLong(1), r.getLong(2)),
            owner,
            enrollment)
        .stream()
        .findFirst();
  }
}
