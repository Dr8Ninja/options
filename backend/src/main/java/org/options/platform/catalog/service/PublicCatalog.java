package org.options.platform.catalog.service;

import jakarta.validation.Validator;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import org.options.platform.catalog.api.PublicDtos.*;
import org.options.platform.catalog.repository.PublicCatalogRepository;
import org.options.platform.catalog.repository.PublicCatalogRepository.Snapshot;
import org.options.platform.ops.web.ApiFailure;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.MultiValueMap;
import tools.jackson.databind.json.JsonMapper;

/** Identity-independent public service. Each response reads a single approved database snapshot. */
@Service
public class PublicCatalog {
  private final PublicCatalogRepository repository;
  private final TransactionTemplate reads;
  private final Validator validator;
  private final JsonMapper json = JsonMapper.builder().build();

  public record Result<T>(T body, ContentVersion version) {}

  public PublicCatalog(
      PublicCatalogRepository repository, PlatformTransactionManager manager, Validator validator) {
    this.repository = repository;
    this.validator = validator;
    reads = new TransactionTemplate(manager);
    reads.setReadOnly(true);
    reads.setIsolationLevel(TransactionDefinition.ISOLATION_REPEATABLE_READ);
    reads.setTimeout(5);
  }

  private <T> Result<T> read(Function<Snapshot, T> work) {
    for (int attempt = 0; attempt < 2; attempt++) {
      var cutoff = new java.util.concurrent.atomic.AtomicReference<Instant>();
      Result<T> result =
          reads.execute(
              status -> {
                repository.prepareRead();
                var s = repository.snapshot();
                cutoff.set(s.safetyCutoff());
                return new Result<>(work.apply(s), s.version());
              });
      if (repository.currentVersion().equals(result.version())
          && (cutoff.get() == null || Instant.now().isBefore(cutoff.get()))) return result;
    }
    throw ApiFailure.unavailable();
  }

  public Result<ContentVersion> version() {
    return read(Snapshot::version);
  }

  private PublicQuery query(String route, MultiValueMap<String, String> raw) {
    PublicQuery q = PublicQuery.parse(route, raw);
    if (!validator.validate(q).isEmpty()) throw ApiFailure.query();
    return q;
  }

  private void validate(Snapshot snapshot, PublicQuery q) {
    if (q.generation() != null && !q.generation().equals(snapshot.version().generation()))
      throw new ApiFailure(
          409, "CONTENT_VERSION_CHANGED", "Content changed; restart from the first page.");
    repository.validateFilters(snapshot, q);
  }

  public Result<CatalogPage> list(String route, MultiValueMap<String, String> raw) {
    var q = query(route, raw);
    return read(
        s -> {
          validate(s, q);
          byte[] key = repository.cursorKey();
          String last = PublicCursor.decode(q, s.version().generation(), key);
          var rows = repository.page(s, q, last);
          boolean more = rows.size() > q.limit();
          var selected = more ? rows.subList(0, q.limit()) : rows;
          var items =
              selected.stream().map(r -> json.convertValue(base(r, s), Card.class)).toList();
          String cursor =
              more
                  ? PublicCursor.encode(q, s.version().generation(), items.getLast().id(), key)
                  : null;
          return new CatalogPage(items, q.limit(), s.version(), cursor);
        });
  }

  public Result<SearchPage> search(MultiValueMap<String, String> raw) {
    var q = query("search", raw);
    return read(
        s -> {
          validate(s, q);
          long total = repository.total(s, q);
          var rows = repository.page(s, q, null);
          boolean more = rows.size() > q.limit();
          var selected = more ? rows.subList(0, q.limit()) : rows;
          var items =
              selected.stream()
                  .map(
                      r -> {
                        var dto = base(r, s);
                        for (var field :
                            Map.of(
                                    "authorOrganization",
                                    "author_organization",
                                    "resourceType",
                                    "resource_type",
                                    "cost",
                                    "cost",
                                    "rationale",
                                    "rationale",
                                    "verificationStatus",
                                    "verification_status")
                                .entrySet()) dto.put(field.getKey(), r.get(field.getValue()));
                        dto.put(
                            "verifiedOn",
                            r.get("verified_on") == null ? null : r.get("verified_on").toString());
                        String snippet = text(r, "summary").replaceAll("<[^>]*>", "");
                        dto.put(
                            "snippet",
                            snippet.substring(
                                0,
                                snippet.offsetByCodePoints(
                                    0,
                                    Math.min(400, snippet.codePointCount(0, snippet.length())))));
                        dto.put(
                            "match",
                            q.q().isEmpty()
                                ? "TEXT"
                                : switch (((Number) r.get("exact_match")).intValue()) {
                                  case 0 -> "EXACT_ID";
                                  case 1 -> "EXACT_TITLE";
                                  default -> "TEXT";
                                });
                        return json.convertValue(dto, SearchHit.class);
                      })
                  .toList();
          return new SearchPage(
              items, q.limit(), s.version(), q.page(), Math.toIntExact(total), more);
        });
  }

  public Result<DiscoveryFacets> facets(MultiValueMap<String, String> raw) {
    var q = query("discovery-facets", raw);
    return read(
        s -> {
          validate(s, q);
          Map<String, Object> dto = new LinkedHashMap<>();
          for (String name :
              List.of(
                  "difficulty",
                  "resourceType",
                  "cost",
                  "priority",
                  "tag",
                  "source",
                  "geography",
                  "verificationStatus",
                  "readiness",
                  "visibility",
                  "module",
                  "kind",
                  "phase",
                  "topic",
                  "path")) dto.put(name, new ArrayList<Facet>());
          for (var row : repository.facets(s, q)) {
            @SuppressWarnings("unchecked")
            var values = (List<Facet>) dto.get(text(row, "filter_name"));
            if (values != null)
              values.add(
                  new Facet(
                      text(row, "value"),
                      text(row, "value"),
                      ((Number) row.get("count")).intValue()));
          }
          dto.put("contentVersion", s.version());
          return json.convertValue(dto, DiscoveryFacets.class);
        });
  }

  public <T> Result<T> detail(String route, String id, Class<T> type) {
    return read(
        s -> {
          var row = repository.detail(s, PublicQuery.KINDS.get(route), id.strip());
          long rid = ((Number) row.get("revision_id")).longValue(),
              oid = ((Number) row.get("object_id")).longValue();
          var dto = base(row, s);
          var edges = repository.references(s, rid, oid);
          var sections = new HashMap<String, List<String>>();
          for (var section : repository.sections(rid))
            sections
                .computeIfAbsent(text(section, "section"), k -> new ArrayList<>())
                .add(text(section, "body"));
          switch (route) {
            case "programs" -> {
              dto.put("phases", refs(edges, "program_phase", 100));
              dto.put("qualification", section(sections, "qualification"));
            }
            case "phases" -> {
              dto.put("program", one(edges, "parent_program_phase"));
              dto.put("modules", refs(edges, "phase_module", 100));
            }
            case "modules" -> {
              dto.put(
                  "phase", refs(edges, "parent_phase_module", 1).stream().findFirst().orElse(null));
              dto.put("objectives", sections.getOrDefault("objective", List.of()));
              dto.put("whyItMatters", section(sections, "why_it_matters"));
              dto.put("commonMistakes", sections.getOrDefault("common_mistake", List.of()));
              dto.put("prerequisites", prerequisites(edges));
              dto.put("competencies", refs(edges, "outcome", 100));
              dto.put("topics", refs(edges, "module_topic", 200));
              dto.put("assignments", assignments(s, rid, oid, "MODULE", 200));
            }
            case "topics", "subtopics" -> {
              var lesson = repository.lesson(rid);
              dto.put(
                  "scopeOutline",
                  Optional.ofNullable(text(lesson, "scope_outline")).orElse(text(row, "summary")));
              dto.put(
                  "lessonMarkdown",
                  text(row, "visibility").equals("LESSON") ? lesson.get("lesson_markdown") : null);
              if (route.equals("topics")) {
                dto.put(
                    "module",
                    refs(edges, "parent_module_topic", 1).stream().findFirst().orElse(null));
                dto.put("formatVersion", lesson.get("format_version"));
                dto.put("subtopics", refs(edges, "topic_subtopic", 100));
                dto.put("exercises", refs(edges, "lesson_practice", 100));
                dto.put("assignments", assignments(s, rid, oid, "TOPIC", 100));
                dto.put("prerequisites", prerequisites(edges));
              } else dto.put("topic", one(edges, "parent_topic_subtopic"));
            }
            case "resources" -> {
              var r = repository.resource(rid);
              dto.put("authorOrganization", r.get("author_organization"));
              dto.put("url", safeUrl(text(r, "original_url")));
              dto.put("resourceType", r.get("resource_type"));
              dto.put("cost", r.get("cost"));
              dto.put("accessLimitations", r.get("access_limitations"));
              dto.put("prerequisitesText", r.get("prerequisites_text"));
              dto.put("rationale", r.get("rationale"));
              dto.put("geography", r.get("geography"));
              dto.put("rights", r.get("rights"));
              String precision = text(r, "publication_precision");
              boolean known = Set.of("year", "month", "day").contains(precision);
              dto.put("publicationDate", known ? r.get("publication_date_raw") : null);
              dto.put("datePrecision", known ? precision.toUpperCase(Locale.ROOT) : "UNKNOWN");
              String due = instant(r.get("next_due_at"));
              boolean overdue = due != null && !Instant.parse(due).isAfter(Instant.now());
              dto.put(
                  "freshness",
                  new Freshness(
                      null,
                      "UNKNOWN",
                      r.get("checked_on") == null ? null : r.get("checked_on").toString(),
                      Optional.ofNullable(text(r, "scope"))
                          .orElse("No substantive review has been recorded."),
                      due,
                      overdue ? "DUE" : due == null ? "UNKNOWN" : "WITHIN_REVIEW_WINDOW",
                      false));
              dto.put("assignments", assignments(s, rid, oid, "RESOURCE", 200));
              dto.put(
                  "alternativeIds",
                  refs(edges, "free_alternative", 100).stream()
                      .filter(x -> !Set.of("RETIRED", "UNAVAILABLE").contains(x.availability()))
                      .map(Reference::id)
                      .toList());
              dto.put("verificationStatus", row.get("verification_status"));
            }
            case "paths" -> {
              dto.put("audience", section(sections, "audience"));
              dto.put("branches", refs(edges, "path_branch", 100));
              dto.put("exitStatements", sections.getOrDefault("exit_statement", List.of()));
              dto.put("milestones", sections.getOrDefault("milestone", List.of()));
              dto.put("entryCriteria", section(sections, "entry"));
              dto.put("modules", refs(edges, "path_module", 100));
              dto.put("topics", refs(edges, "path_topic", 200));
              dto.put("gates", refs(edges, "path_gate", 100));
              dto.put("projects", refs(edges, "path_project", 100));
              dto.put("exitCompetencies", refs(edges, "path_exit", 100));
              dto.put("enrollmentAvailable", false);
              dto.put("unavailableReason", "Enrollment is not available in this release.");
            }
            case "projects" -> {
              dto.put("objective", section(sections, "objective"));
              dto.put("prerequisites", prerequisites(edges));
              dto.put("dataPlan", section(sections, "data_plan"));
              dto.put("deliverables", section(sections, "deliverables"));
              dto.put("assessmentCriteria", repository.rubric(rid));
              dto.put("steps", sections.getOrDefault("step", List.of()));
              dto.put("limitations", sections.getOrDefault("limitations", List.of()));
              dto.put("noncodingRoute", sections.getOrDefault("noncoding_route", List.of()));
              dto.put("selfReviewAvailable", false);
              dto.put("fields", List.of());
            }
            case "capstones" -> {
              dto.put("prerequisites", prerequisites(edges));
              dto.put("brief", section(sections, "original_brief"));
              dto.put(
                  "projectIds",
                  refs(edges, "capability_project", 100).stream().map(Reference::id).toList());
              dto.put("assessmentPolicyId", one(edges, "capstone_policy").id());
            }
            case "exercises" -> {
              dto.put("exerciseType", repository.exercise(rid).get("exercise_type"));
              dto.put("prompt", null);
              dto.put(
                  "topicIds",
                  refs(edges, "exercise_topic", 100).stream().map(Reference::id).toList());
              dto.put("responseUnit", null);
              dto.put("roundingInstructions", null);
              dto.put("practiceAvailable", false);
            }
            case "quizzes" -> {
              var quiz = repository.quiz(rid);
              dto.put("purpose", quiz.get("purpose"));
              dto.put("itemCount", quiz.get("expected_items"));
              dto.put("passScore", quiz.get("pass_score"));
              dto.put("criticalChecksRequired", quiz.get("critical_required"));
              dto.put("freshForms", quiz.get("max_fresh_forms"));
              dto.put("attemptAvailable", false);
            }
            default -> throw ApiFailure.missing();
          }
          return json.convertValue(dto, type);
        });
  }

  public Result<RouteResolution> route(String path) {
    if (path == null
        || path.length() > 300
        || !path.matches("/[A-Za-z0-9][A-Za-z0-9/._:-]*")
        || path.contains("..")
        || path.contains("//")) throw ApiFailure.query();
    return read(
        s -> {
          var r = repository.route(s, path);
          String canonical = text(r, "canonical_path");
          return new RouteResolution(
              text(r, "external_id"),
              canonical,
              r.get("retired_at") != null
                  ? "RETIRED"
                  : canonical.equals(path) ? "CURRENT" : "RENAMED",
              r.get("successor_id") == null ? List.of() : List.of(text(r, "successor_id")),
              s.version());
        });
  }

  private Map<String, Object> base(Map<String, Object> row, Snapshot s) {
    Map<String, Object> out = new LinkedHashMap<>();
    for (String name :
        List.of("kind", "title", "visibility", "readiness", "summary", "difficulty", "priority"))
      out.put(name, row.get(name));
    out.put("id", row.get("external_id"));
    out.put("revision", "rev-" + row.get("content_hash"));
    out.put("canonicalPath", row.get("canonical_path"));
    out.put("indexable", row.get("indexable"));
    out.put("tags", strings(row.get("tags")));
    out.put(
        "hours",
        new Hours(
            (BigDecimal) row.get("hours_min"),
            (BigDecimal) row.get("hours_max"),
            text(row, "estimate_basis")));
    out.put("contentVersion", s.version());
    var notices = json.readTree(text(row, "rule_notices"));
    if (notices.size() > 100) throw ApiFailure.unavailable();
    out.put("ruleNotices", notices);
    return out;
  }

  private List<Assignment> assignments(
      Snapshot s, long revision, long object, String kind, int bound) {
    var rows = repository.assignments(s, revision, object, kind);
    bounded(rows, bound);
    return rows.stream()
        .map(
            r -> {
              var topics = strings(r.get("topic_ids"));
              bounded(topics, 200);
              return new Assignment(
                  text(r, "external_id"),
                  new Reference(
                      text(r, "resource_id"),
                      text(r, "resource_kind"),
                      text(r, "resource_title"),
                      "rev-" + r.get("resource_hash"),
                      text(r, "resource_visibility"),
                      null,
                      null),
                  topics,
                  List.of(text(r, "competency_id")),
                  text(r, "reading_scope"),
                  text(r, "purpose"),
                  text(r, "verification_state").equals("selected_reading")
                      ? "REVIEWED"
                      : "CANDIDATE",
                  text(r, "verification_state").equals("selected_reading")
                      ? text(r, "reading_scope")
                      : null,
                  text(r, "priority"),
                  safeUrl(text(r, "original_url")),
                  text(r, "cost"));
            })
        .toList();
  }

  private static Reference reference(Map<String, Object> r) {
    String availability = text(r, "availability");
    boolean available = Set.of("MAP", "LESSON").contains(availability);
    return new Reference(
        text(r, "external_id"),
        text(r, "kind"),
        text(r, "title"),
        available ? "rev-" + r.get("content_hash") : null,
        availability,
        ((Number) r.get("ordinal")).intValue(),
        available ? text(r, "rationale") : "This approved reference is currently unavailable.");
  }

  private static List<Reference> refs(List<Map<String, Object>> edges, String relation, int bound) {
    var result =
        edges.stream()
            .filter(r -> relation.equals(r.get("relation")))
            .map(PublicCatalog::reference)
            .toList();
    bounded(result, bound);
    return result;
  }

  private static Reference one(List<Map<String, Object>> edges, String relation) {
    var items = refs(edges, relation, 1);
    if (items.isEmpty()) throw ApiFailure.unavailable();
    return items.getFirst();
  }

  private static List<Prerequisite> prerequisites(List<Map<String, Object>> edges) {
    var result =
        edges.stream()
            .filter(r -> Set.of("HARD", "RECOMMENDED", "OPTIONAL").contains(r.get("relation")))
            .map(r -> new Prerequisite(reference(r), text(r, "relation"), text(r, "rationale")))
            .toList();
    bounded(result, 100);
    return result;
  }

  private static String section(Map<String, List<String>> sections, String name) {
    return String.join("\n", sections.getOrDefault(name, List.of("Not yet specified.")));
  }

  private static String text(Map<String, Object> row, String key) {
    Object value = row.get(key);
    return value == null ? null : value.toString();
  }

  private static void bounded(List<?> values, int max) {
    if (values.size() > max) throw ApiFailure.unavailable();
  }

  private static String instant(Object value) {
    return value == null ? null : ((java.sql.Timestamp) value).toInstant().toString();
  }

  private static List<String> strings(Object value) {
    if (value == null) return List.of();
    try {
      return List.of((String[]) ((java.sql.Array) value).getArray());
    } catch (java.sql.SQLException e) {
      throw new IllegalStateException("Invalid array projection", e);
    }
  }

  private static String safeUrl(String value) {
    if (value == null) return null;
    try {
      var u = java.net.URI.create(value);
      return Set.of("https", "http").contains(u.getScheme()) && u.getHost() != null ? value : null;
    } catch (IllegalArgumentException e) {
      return null;
    }
  }
}
