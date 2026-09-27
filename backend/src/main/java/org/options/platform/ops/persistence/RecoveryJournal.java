package org.options.platform.ops.persistence;

import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/** Local durable tombstone. Independent-copy acknowledgment is a later operations gate. */
@Component
public class RecoveryJournal {
  private final JdbcTemplate jdbc;

  public RecoveryJournal(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Transactional(propagation = Propagation.MANDATORY)
  public void noteErased(long owner, UUID record) {
    jdbc.update(
        """
      insert into recovery_journal(sequence_no,event_type,subject_public_id,owned_record_public_id,digest,expires_at)
      select nextval('recovery_journal_sequence'),'NOTE_ERASE',public_id,?,
      encode(sha256(convert_to(public_id::text||?::text,'UTF8')),'hex'),transaction_timestamp()+interval '90 days'
      from account where id=?
      """,
        record,
        record,
        owner);
  }
}
