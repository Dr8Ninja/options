package org.options.platform.catalog.service;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.*;
import org.options.platform.ops.web.ApiFailure;
import org.springframework.util.MultiValueMap;

/** A closed query grammar: only server-owned names and ordering expressions reach SQL. */
public record PublicQuery(
    String entity,
    @Min(1) @Max(50) int limit,
    @Min(0) @Max(99) int page,
    String sort,
    String q,
    String generation,
    String cursor,
    SortedMap<String, List<String>> filters) {
  public static final Map<String, String> KINDS =
      Map.ofEntries(
          Map.entry("programs", "PROGRAM"),
          Map.entry("phases", "PHASE"),
          Map.entry("modules", "MODULE"),
          Map.entry("topics", "TOPIC"),
          Map.entry("subtopics", "SUBTOPIC"),
          Map.entry("resources", "RESOURCE"),
          Map.entry("paths", "PATH"),
          Map.entry("projects", "PROJECT"),
          Map.entry("capstones", "CAPSTONE"),
          Map.entry("exercises", "EXERCISE"),
          Map.entry("quizzes", "QUIZ"));
  private static final Map<String, Set<String>> FILTERS =
      Map.of(
          "programs",
          Set.of(),
          "phases",
          Set.of("program"),
          "modules",
          Set.of("program", "phase", "difficulty", "tag", "path"),
          "topics",
          Set.of("module", "phase", "difficulty", "priority", "tag", "path"),
          "paths",
          Set.of("difficulty", "tag"),
          "projects",
          Set.of("difficulty", "topic", "tag", "path"),
          "capstones",
          Set.of("difficulty", "topic", "tag", "path"),
          "resources",
          Set.of(
              "resourceType",
              "difficulty",
              "cost",
              "priority",
              "topic",
              "tag",
              "phase",
              "source",
              "path",
              "geography",
              "verificationStatus",
              "readiness",
              "visibility"),
          "search",
          Set.of(
              "kind",
              "difficulty",
              "resourceType",
              "cost",
              "priority",
              "topic",
              "tag",
              "phase",
              "module",
              "source",
              "path",
              "geography",
              "verificationStatus",
              "readiness",
              "visibility"));

  public static PublicQuery parse(String route, MultiValueMap<String, String> raw) {
    boolean facets = route.equals("discovery-facets");
    String entity = facets ? scalar(raw, "entity", "resources") : route;
    if (facets && !Set.of("resources", "search").contains(entity)) throw ApiFailure.query();
    Set<String> supported = FILTERS.get(entity);
    if (supported == null) throw ApiFailure.query();
    Set<String> allowed = new HashSet<>(supported);
    if (facets) {
      allowed.add("entity");
      if (entity.equals("search")) allowed.add("q");
    } else {
      allowed.addAll(Set.of("limit", "sort"));
      if (entity.equals("search")) allowed.addAll(Set.of("page", "generation", "q"));
      else allowed.add("cursor");
    }
    if (!allowed.containsAll(raw.keySet())) throw ApiFailure.query();
    int limit = integer(scalar(raw, "limit", "20")), page = integer(scalar(raw, "page", "0"));
    String sort =
        scalar(
            raw,
            "sort",
            entity.equals("resources")
                ? "priority"
                : entity.equals("search") ? "relevance" : "title");
    Set<String> sorts = new HashSet<>(Set.of("title", "-title", "duration"));
    if (entity.equals("resources") || entity.equals("search"))
      sorts.addAll(Set.of("priority", "-verified"));
    if (entity.equals("search")) sorts.add("relevance");
    if (!sorts.contains(sort)) throw ApiFailure.query();
    String q = scalar(raw, "q", "").strip();
    if (q.codePointCount(0, q.length()) > 200) throw ApiFailure.query();
    String generation = scalar(raw, "generation", null), cursor = scalar(raw, "cursor", null);
    if (generation != null && !generation.matches("[0-9]{1,20}")) throw ApiFailure.query();
    if (cursor != null && (cursor.isEmpty() || cursor.length() > 2048))
      throw new ApiFailure(400, "INVALID_CURSOR", "Restart from the first page.");
    if (page > 0 && generation == null) throw ApiFailure.query();
    SortedMap<String, List<String>> filters = new TreeMap<>();
    for (String name : supported)
      if (raw.containsKey(name)) {
        var values = new TreeSet<String>();
        for (String value : raw.get(name)) {
          value = value.strip();
          int max = Set.of("source", "geography").contains(name) ? 2000 : 160;
          if (value.isEmpty() || value.codePointCount(0, value.length()) > max)
            throw ApiFailure.query();
          values.add(value);
        }
        if (values.size() > 10) throw ApiFailure.query();
        filters.put(name, List.copyOf(values));
      }
    return new PublicQuery(entity, limit, page, sort, q, generation, cursor, filters);
  }

  public static String scalar(MultiValueMap<String, String> raw, String name, String fallback) {
    var v = raw.get(name);
    if (v == null) return fallback;
    if (v.size() != 1 || v.getFirst() == null) throw ApiFailure.query();
    return v.getFirst();
  }

  private static int integer(String value) {
    if (!value.matches("[0-9]{1,4}")) throw ApiFailure.query();
    try {
      return Integer.parseInt(value);
    } catch (NumberFormatException e) {
      throw ApiFailure.query();
    }
  }
}
