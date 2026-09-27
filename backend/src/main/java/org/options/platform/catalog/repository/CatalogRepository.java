package org.options.platform.catalog.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/** Explicit metadata projections. Protected revision bodies never leave through these reads. */
@Repository
public class CatalogRepository {
  public record Route(String externalId, String kind, String canonicalPath, boolean retired) {}

  public record Member(int ordinal, String externalId, String kind) {}

  private final JdbcTemplate jdbc;

  public CatalogRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Transactional(readOnly = true)
  public Optional<Route> resolve(String path) {
    return jdbc
        .query(
            "select o.external_id,o.kind,c.path_key,o.retired_at is not null from catalog_route r join catalog_object o on o.id=r.object_id left join catalog_route c on c.object_id=o.id and c.canonical where r.path_key=?",
            (r, n) -> new Route(r.getString(1), r.getString(2), r.getString(3), r.getBoolean(4)),
            path)
        .stream()
        .findFirst();
  }

  @Transactional(readOnly = true)
  public List<Member> orderedMembers(long revision, String relation) {
    return jdbc.query(
        "select l.ordinal,o.external_id,o.kind from catalog_link l join catalog_object o on o.id=l.target_object_id where l.owner_revision_id=? and l.relation=? order by l.ordinal",
        (r, n) -> new Member(r.getInt(1), r.getString(2), r.getString(3)),
        revision,
        relation);
  }
}
