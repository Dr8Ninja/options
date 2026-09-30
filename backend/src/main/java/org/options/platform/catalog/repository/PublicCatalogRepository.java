package org.options.platform.catalog.repository;

import java.util.*;
import org.options.platform.catalog.api.PublicDtos.ContentVersion;
import org.options.platform.catalog.service.PublicQuery;
import org.options.platform.ops.web.ApiFailure;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * Explicit SQL projections. No entity, draft head, raw package or answer-bearing section is
 * returned.
 */
@Repository
public class PublicCatalogRepository {
  private final NamedParameterJdbcTemplate jdbc;

  public PublicCatalogRepository(NamedParameterJdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public record Snapshot(long id, ContentVersion version, java.time.Instant safetyCutoff) {}

  public Snapshot snapshot() {
    var rows =
        jdbc.query(
            "select a.publication_id,p.public_id,a.generation,a.updated_at,(select min(deadline) from (select w.starts_at deadline from content_withdrawal w join publication_entry e on e.object_id=w.object_id and e.publication_id=a.publication_id where w.reinstated_at is null union all select v.next_due_at from verification_event v join publication_entry e on e.revision_id=v.subject_revision_id and e.publication_id=a.publication_id union all select x.deadline from rule_certification c join rule_subject rs on rs.id=c.subject_id join publication_entry e on e.revision_id=c.rule_revision_id and e.publication_id=a.publication_id cross join lateral (values (c.review_due_at),(lower(c.valid_dates)::timestamp at time zone rs.market_zone),(upper(c.valid_dates)::timestamp at time zone rs.market_zone)) x(deadline) where c.status='ACTIVE') deadlines where deadline>statement_timestamp()) safety_cutoff from active_publication a join publication p on p.id=a.publication_id",
            Map.of(),
            (r, n) ->
                new Snapshot(
                    r.getLong(1),
                    new ContentVersion(
                        "pub-" + r.getString(2),
                        r.getString(3),
                        r.getTimestamp(4).toInstant().toString(),
                        "1.0.0"),
                    r.getTimestamp(5) == null ? null : r.getTimestamp(5).toInstant()));
    if (rows.isEmpty()) throw ApiFailure.unavailable();
    return rows.getFirst();
  }

  public void prepareRead() {
    jdbc.getJdbcTemplate().execute("set local jit=off");
  }

  public ContentVersion currentVersion() {
    var rows =
        jdbc.query(
            "select p.public_id,a.generation,a.updated_at from active_publication a join publication p on p.id=a.publication_id",
            Map.of(),
            (r, n) ->
                new ContentVersion(
                    "pub-" + r.getString(1),
                    r.getString(2),
                    r.getTimestamp(3).toInstant().toString(),
                    "1.0.0"));
    if (rows.isEmpty()) throw ApiFailure.unavailable();
    return rows.getFirst();
  }

  public byte[] cursorKey() {
    return jdbc.queryForObject(
        "select secret from public_cursor_key where singleton", Map.of(), byte[].class);
  }

  private static final String ELIGIBLE = "c.retired_at is null and not c.withdrawn";
  private static final String PUBLIC_KINDS =
      "('PROGRAM','PHASE','MODULE','TOPIC','SUBTOPIC','RESOURCE','PATH','PROJECT','EXERCISE','QUIZ','CAPSTONE')";
  private static final String COLUMNS =
      "c.object_id,c.revision_id,c.external_id,c.kind,c.content_hash,c.title,c.title_key,c.visibility,(select e.indexable from publication_entry e where e.publication_id=c.publication_id and e.object_id=c.object_id) indexable,c.readiness,c.summary,c.difficulty,c.priority,c.hours_min,c.hours_max,c.estimate_basis,c.canonical_path,c.tags,c.verified_on,c.priority_order,c.verification_status,coalesce((select n.notices::text from public_rule_notice n where n.publication_id=c.publication_id and n.dependent_revision_id=c.revision_id),'[]') rule_notices";
  private static final String QUERY_KEY = "public_text_key(:q)";
  private static final String EXACT =
      "case when public_text_key(c.external_id)="
          + QUERY_KEY
          + " then 0 when c.title_key="
          + QUERY_KEY
          + " then 1 else 2 end";

  private record Selection(String from, String where, Map<String, Object> args) {}

  private Selection selection(Snapshot s, PublicQuery q) {
    Map<String, Object> args = new HashMap<>();
    args.put("pid", s.id());
    args.put("q", q.q());
    String from =
        " from (with catalog as materialized (select * from public_catalog_entry where publication_id=:pid) select * from catalog) c join public_search_document s on s.publication_id=c.publication_id and s.object_id=c.object_id";
    StringBuilder where =
        new StringBuilder(
            " where c.publication_id=:pid and " + ELIGIBLE + " and c.kind in " + PUBLIC_KINDS);
    if (!q.entity().equals("search")) {
      where.append(" and c.kind=:kind");
      args.put("kind", PublicQuery.KINDS.get(q.entity()));
    }
    if (!q.q().isEmpty())
      where.append(
          " and (s.search_vector @@ websearch_to_tsquery('english',:q) or public_text_key(c.external_id)="
              + QUERY_KEY
              + " or c.title_key="
              + QUERY_KEY
              + ")");
    int i = 0;
    for (var f : q.filters().entrySet()) {
      String name = "fn" + i, value = "fv" + i++;
      args.put(name, f.getKey());
      args.put(value, f.getValue());
      if (Set.of("kind", "visibility", "readiness").contains(f.getKey())) {
        // Fixed known columns avoid joining membership rows for scalar publication metadata.
        where.append(" and c.").append(f.getKey()).append(" in (:").append(value).append(")");
        continue;
      }
      where
          .append(
              " and exists(select 1 from public_catalog_filter f where f.publication_id=c.publication_id and f.object_id=c.object_id and f.filter_name=:")
          .append(name)
          .append(" and f.value in (:")
          .append(value)
          .append("))");
    }
    return new Selection(from, where.toString(), args);
  }

  private static final Map<String, List<String>> ENUMS =
      Map.of(
          "kind",
          List.copyOf(PublicQuery.KINDS.values()),
          "cost",
          List.of("free", "mixed", "paid", "unknown"),
          "visibility",
          List.of("MAP", "LESSON"),
          "readiness",
          List.of(
              "scope_outline",
              "teaching_brief",
              "learning_design",
              "project_specification",
              "reviewed_lesson"),
          "verificationStatus",
          List.of(
              "access_or_inherited_metadata_only", "limited_review", "selected_sections_reviewed"));

  public void validateFilters(Snapshot snapshot, PublicQuery query) {
    if (query.filters().isEmpty()) return;
    // Enum filters are closed contract values and need no taxonomy scan.
    var names = query.filters().keySet().stream().filter(name -> !ENUMS.containsKey(name)).toList();
    List<Map<String, Object>> valid =
        names.isEmpty()
            ? List.of()
            : jdbc.queryForList(
                "with eligible as materialized (select publication_id,object_id from public_catalog_entry c where c.publication_id=:pid and "
                    + ELIGIBLE
                    + " and c.kind in "
                    + PUBLIC_KINDS
                    + ") select distinct f.filter_name,f.value from public_catalog_filter f join eligible c on c.publication_id=f.publication_id and c.object_id=f.object_id where f.filter_name in (:names)",
                Map.of("pid", snapshot.id(), "names", names));
    Map<String, Set<String>> values = new HashMap<>();
    for (var r : valid)
      values
          .computeIfAbsent((String) r.get("filter_name"), k -> new HashSet<>())
          .add((String) r.get("value"));
    for (var f : query.filters().entrySet()) {
      Set<String> available = new HashSet<>(ENUMS.getOrDefault(f.getKey(), List.of()));
      if (!ENUMS.containsKey(f.getKey()))
        available.addAll(values.getOrDefault(f.getKey(), Set.of()));
      if (!available.containsAll(f.getValue()))
        throw new ApiFailure(422, "INVALID_FILTER_VALUE", "Choose an available filter value.");
    }
  }

  private static List<String> keys(String sort) {
    return switch (sort) {
      case "duration" -> List.of("coalesce(c.hours_min,1e100)", "c.external_id COLLATE \"C\"");
      case "priority" ->
          List.of(
              "coalesce(c.priority_order,99)",
              "c.title_key COLLATE \"C\"",
              "c.external_id COLLATE \"C\"");
      case "-verified" ->
          List.of(
              "coalesce(-extract(epoch from c.verified_on),1e100)",
              "c.title_key COLLATE \"C\"",
              "c.external_id COLLATE \"C\"");
      default -> List.of("c.title_key COLLATE \"C\"", "c.external_id COLLATE \"C\"");
    };
  }

  private static String order(PublicQuery q) {
    if (q.sort().equals("relevance") && !q.q().isEmpty())
      return EXACT
          + ",ts_rank_cd('{0.1,0.2,0.4,1.0}'::real[],s.search_vector,websearch_to_tsquery('english',:q),32) desc,c.title_key COLLATE \"C\",c.external_id COLLATE \"C\"";
    List<String> k = keys(q.sort());
    return k.getFirst()
        + (q.sort().equals("-title") ? " desc" : " asc")
        + ","
        + String.join(",", k.subList(1, k.size()));
  }

  public List<Map<String, Object>> page(Snapshot snapshot, PublicQuery q, String last) {
    var selection = selection(snapshot, q);
    var args = selection.args();
    args.put("take", q.limit() + 1);
    String seek = "";
    if (last != null) {
      args.put("last", last);
      var keys = keys(q.sort());
      List<String> disjunction = new ArrayList<>();
      for (int i = 0; i < keys.size(); i++) {
        List<String> clause = new ArrayList<>();
        for (int j = 0; j <= i; j++) {
          String k = keys.get(j),
              previous =
                  "(select "
                      + k
                      + " from public_catalog_entry c where c.publication_id=:pid and c.external_id=:last)";
          clause.add(
              k + (j < i ? " = " : q.sort().equals("-title") && i == 0 ? " < " : " > ") + previous);
        }
        disjunction.add("(" + String.join(" and ", clause) + ")");
      }
      seek = " and (" + String.join(" or ", disjunction) + ")";
    }
    if (q.entity().equals("search")) args.put("offset", q.page() * q.limit());
    // Bound the ordered candidate set before evaluating resource/rule projections. In particular,
    // OFFSET must not execute correlated notice lookups for every skipped row.
    return jdbc.queryForList(
        "select "
            + COLUMNS
            + ",rr.author_organization,rr.resource_type,rr.cost,rr.rationale,c.exact_match from (select c.*, ("
            + EXACT
            + ") exact_match,row_number() over(order by "
            + order(q)
            + ") result_position"
            + selection.from()
            + selection.where()
            + seek
            + " order by "
            + order(q)
            + " limit :take"
            + (q.entity().equals("search") ? " offset :offset" : "")
            + ") c left join resource_revision rr on rr.revision_id=c.revision_id order by c.result_position",
        args);
  }

  public long total(Snapshot snapshot, PublicQuery q) {
    var s = selection(snapshot, q);
    return jdbc.queryForObject("select count(*)" + s.from() + s.where(), s.args(), Long.class);
  }

  public List<Map<String, Object>> facets(Snapshot snapshot, PublicQuery q) {
    var s = selection(snapshot, q);
    return jdbc.queryForList(
        "with matched as (select c.object_id"
            + s.from()
            + s.where()
            + "), counts as (select f.filter_name,f.value,count(*) count from matched m join public_catalog_filter f on f.object_id=m.object_id and f.publication_id=:pid group by f.filter_name,f.value), ranked as (select *,row_number() over(partition by filter_name order by count desc,value COLLATE \"C\") position from counts) select filter_name,value,count from ranked where position<=100 order by filter_name,count desc,value COLLATE \"C\"",
        s.args());
  }

  public Map<String, Object> detail(Snapshot snapshot, String kind, String id) {
    var args = Map.<String, Object>of("pid", snapshot.id(), "kind", kind, "id", id);
    var rows =
        jdbc.queryForList(
            "select "
                + COLUMNS
                + ",c.retired_at,c.withdrawn from public_catalog_entry c where c.publication_id=:pid and c.external_id=:id and c.kind=:kind",
            args);
    if (rows.isEmpty()) {
      var historical =
          jdbc.queryForList(
              "select c.retired_at,c.withdrawn from public_catalog_entry c join publication_activation_history h on h.publication_id=c.publication_id where c.external_id=:id and c.kind=:kind order by h.generation desc limit 1",
              args);
      if (!historical.isEmpty()) state(historical.getFirst());
      throw ApiFailure.missing();
    }
    state(rows.getFirst());
    return rows.getFirst();
  }

  private static void state(Map<String, Object> row) {
    if (Boolean.TRUE.equals(row.get("withdrawn")))
      throw new ApiFailure(
          409, "CONTENT_WITHDRAWN", "This content has been withdrawn from public access.");
    if (row.get("retired_at") != null)
      throw new ApiFailure(409, "CONTENT_RETIRED", "This content has been retired.");
  }

  public Map<String, Object> lesson(long revision) {
    return jdbc.queryForMap(
        "select scope_outline,lesson_markdown,format_version from catalog_revision where id=:rid",
        Map.of("rid", revision));
  }

  public List<Map<String, Object>> sections(long revision) {
    return jdbc.queryForList(
        "select section,body from revision_section where revision_id=:rid and section in ('why_it_matters','common_mistake','qualification','objective','data_plan','deliverables','audience','entry','original_brief','step','limitations','noncoding_route','exit_statement','milestone') order by section,ordinal",
        Map.of("rid", revision));
  }

  public List<Map<String, Object>> references(Snapshot s, long revision, long object) {
    return jdbc.queryForList(
        """
      with edges as (
      select relation,target_object_id target,ordinal,annotation rationale from catalog_link where owner_revision_id=:rid
      union all select 'exercise_topic',c.object_id,l.ordinal,null from catalog_link l join public_catalog_entry c on c.revision_id=l.owner_revision_id and c.publication_id=:pid where l.target_object_id=:oid and l.relation='lesson_practice'
      union all select 'HARD',requires_object_id,ordinal,rationale from hard_prerequisite where owner_revision_id=:rid
      union all select 'RECOMMENDED',requires_object_id,ordinal,rationale from recommended_preparation where owner_revision_id=:rid
      union all select 'OPTIONAL',target_object_id,ordinal,rationale from optional_enrichment where owner_revision_id=:rid
      union all select 'parent_'||l.relation,c.object_id,l.ordinal,null from catalog_link l join public_catalog_entry c on c.revision_id=l.owner_revision_id and c.publication_id=:pid where l.target_object_id=:oid and l.relation in ('program_phase','topic_subtopic','phase_module','module_topic')
      union all select 'path_gate',r.object_id,g.ordinal,null from course_gate g join catalog_revision r on r.id=g.quiz_revision_id where g.path_revision_id=:rid
      union all select 'path_project',r.object_id,p.ordinal,null from course_project p join catalog_revision r on r.id=p.project_revision_id where p.path_revision_id=:rid and p.required
      )
      select e.relation,e.ordinal,e.rationale,c.external_id,c.kind,c.title,c.content_hash,
      case when c.retired_at is not null then 'RETIRED' when c.withdrawn or c.publication_id<>:pid then 'UNAVAILABLE' else c.visibility end availability
      from edges e join lateral (
       select c.* from public_catalog_entry c where c.object_id=e.target and
       (c.publication_id=:pid or exists(select 1 from publication_activation_history h where h.publication_id=c.publication_id))
       order by (c.publication_id=:pid) desc,c.revision_id desc limit 1
      ) c on true order by e.relation,e.ordinal,c.external_id COLLATE "C"
      """,
        Map.of("pid", s.id(), "rid", revision, "oid", object));
  }

  public List<Map<String, Object>> assignments(
      Snapshot s, long revision, long object, String kind) {
    return jdbc.queryForList(
        """
      with eligible as materialized (
       select object_id,revision_id,external_id,kind,title,content_hash,visibility,priority
       from public_catalog_entry where publication_id=:pid and retired_at is null and not withdrawn
      )
      select a0.external_id,a.reading_scope,a.purpose,a.verification_state,
      resource.external_id resource_id,resource.kind resource_kind,resource.title resource_title,resource.content_hash resource_hash,resource.visibility resource_visibility,
      competency.external_id competency_id,resource.priority,rr.cost,locator.original_url,
      coalesce((select array_agg(t.external_id order by l.ordinal) from catalog_link l join eligible t on t.object_id=l.target_object_id where l.owner_revision_id=a.revision_id and l.relation='assignment_topic'),'{}') topic_ids
      from eligible a0 join assignment_revision a on a.revision_id=a0.revision_id
      join eligible resource on resource.object_id=a.resource_object_id
      join eligible competency on competency.object_id=a.competency_object_id
      join resource_revision rr on rr.revision_id=resource.revision_id
      join external_locator locator on locator.id=rr.canonical_locator_id
      join competency_revision cr on cr.revision_id=competency.revision_id
      where
      ((:kind='RESOURCE' and a.resource_object_id=:oid) or (:kind='MODULE' and cr.module_object_id=:oid) or
      (:kind='TOPIC' and exists(select 1 from catalog_link l where l.owner_revision_id=a.revision_id and l.relation='assignment_topic' and l.target_object_id=:oid)))
      order by a0.external_id COLLATE "C"
      """,
        Map.of("pid", s.id(), "rid", revision, "oid", object, "kind", kind));
  }

  public Map<String, Object> resource(long revision) {
    return jdbc.queryForMap(
        """
      select r.author_organization,l.original_url,r.resource_type,r.cost,r.access_limitations,r.prerequisites_text,r.rationale,r.geography,r.publication_date_raw,r.publication_precision,r.rights,
      v.checked_on,v.scope,v.next_due_at,v.outcome
      from resource_revision r join external_locator l on l.id=r.canonical_locator_id
      left join lateral(select checked_on,scope,next_due_at,outcome from verification_event where subject_revision_id=r.revision_id and method in ('selected_sections','technical_review','rule_chain') order by checked_on desc,id desc limit 1) v on true where r.revision_id=:rid
      """,
        Map.of("rid", revision));
  }

  public List<String> rubric(long revision) {
    return jdbc.queryForList(
        "select replace(code,'_',' ') || ' — ' || weight::text || '%' from rubric_criterion where owner_revision_id=:rid order by ordinal",
        Map.of("rid", revision), String.class);
  }

  public Map<String, Object> exercise(long revision) {
    return jdbc.queryForMap(
        "select case when exercise_type='transfer' then 'practical' else exercise_type end exercise_type from exercise_revision where revision_id=:rid",
        Map.of("rid", revision));
  }

  public Map<String, Object> quiz(long revision) {
    return jdbc.queryForMap(
        "select purpose,expected_items,pass_score,critical_required,max_fresh_forms from quiz_revision where revision_id=:rid",
        Map.of("rid", revision));
  }

  public Map<String, Object> route(Snapshot s, String path) {
    var rows =
        jdbc.queryForList(
            """
      select c.external_id,c.canonical_path,c.retired_at,c.withdrawn,
      (select successor.external_id from catalog_object o join public_catalog_entry successor on successor.object_id=o.successor_id and successor.publication_id=:pid and successor.retired_at is null and not successor.withdrawn where o.id=c.object_id) successor_id
      from public_catalog_entry c where (c.canonical_path=:path or exists(select 1 from public_route_snapshot r where r.object_id=c.object_id and r.canonical_path=:path and exists(select 1 from publication_activation_history h where h.publication_id=r.publication_id)) or :path='/' || case c.kind when 'PATH' then 'paths' when 'QUIZ' then 'quizzes' else lower(c.kind)||'s' end || '/' || c.external_id)
      and c.kind in ('PROGRAM','PHASE','MODULE','TOPIC','SUBTOPIC','RESOURCE','PATH','PROJECT','EXERCISE','QUIZ','CAPSTONE')
      and (c.publication_id=:pid or exists(select 1 from publication_activation_history h where h.publication_id=c.publication_id))
      order by (c.publication_id=:pid) desc,c.revision_id desc limit 1
      """,
            Map.of("pid", s.id(), "path", path));
    if (rows.isEmpty()) throw ApiFailure.missing();
    if (Boolean.TRUE.equals(rows.getFirst().get("withdrawn"))) state(rows.getFirst());
    return rows.getFirst();
  }
}
