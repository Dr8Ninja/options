package org.options.platform.learning.repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class NoteRepository {
  public record Note(UUID publicId, long objectId, String text, long version, Instant updatedAt) {}

  private final JdbcTemplate jdbc;

  public NoteRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public Optional<Note> findOwned(long owner, UUID publicId) {
    return jdbc
        .query(
            "select public_id,object_id,text,lock_version,updated_at from private_note where account_id=? and public_id=?",
            (r, n) ->
                new Note(
                    r.getObject(1, UUID.class),
                    r.getLong(2),
                    r.getString(3),
                    r.getLong(4),
                    r.getTimestamp(5).toInstant()),
            owner,
            publicId)
        .stream()
        .findFirst();
  }

  public UUID insert(long owner, long object, String kind, String text) {
    UUID id = UUID.randomUUID();
    jdbc.update(
        "insert into private_note(public_id,account_id,object_id,kind,text) values (?,?,?,?,?)",
        id,
        owner,
        object,
        kind,
        text);
    return id;
  }

  public boolean replace(long owner, UUID id, long version, String text) {
    return jdbc.update(
            "update private_note set text=?,lock_version=lock_version+1,updated_at=transaction_timestamp() where account_id=? and public_id=? and lock_version=?",
            text,
            owner,
            id,
            version)
        == 1;
  }

  public boolean delete(long owner, UUID id, long version) {
    return jdbc.update(
            "delete from private_note where account_id=? and public_id=? and lock_version=?",
            owner,
            id,
            version)
        == 1;
  }
}
