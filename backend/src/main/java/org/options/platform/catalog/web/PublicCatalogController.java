package org.options.platform.catalog.web;

import jakarta.validation.constraints.Pattern;
import org.options.platform.catalog.api.PublicDtos;
import org.options.platform.catalog.service.PublicCatalog;
import org.options.platform.ops.web.ApiFailure;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class PublicCatalogController {
  private final PublicCatalog service;

  public PublicCatalogController(PublicCatalog service) {
    this.service = service;
  }

  private static <T> ResponseEntity<T> respond(PublicCatalog.Result<T> result) {
    return ResponseEntity.ok()
        .header("Cache-Control", "no-store")
        .header(
            "X-Content-Version",
            result.version().publicationId() + ":" + result.version().generation())
        .body(result.body());
  }

  private static void empty(MultiValueMap<String, String> query) {
    if (!query.isEmpty()) throw ApiFailure.query();
  }

  @GetMapping("/content-version")
  public ResponseEntity<PublicDtos.ContentVersion> getContentVersion(
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    var r = service.version();
    return ResponseEntity.ok()
        .header("Cache-Control", "no-store")
        .header("X-Content-Version", r.version().publicationId() + ":" + r.version().generation())
        .header("ETag", "\"" + r.version().publicationId() + ":" + r.version().generation() + "\"")
        .body(r.body());
  }

  @GetMapping("/search")
  public ResponseEntity<PublicDtos.SearchPage> searchCatalog(
      @RequestParam MultiValueMap<String, String> query) {
    return respond(service.search(query));
  }

  @GetMapping("/discovery-facets")
  public ResponseEntity<PublicDtos.DiscoveryFacets> getDiscoveryFacets(
      @RequestParam MultiValueMap<String, String> query) {
    return respond(service.facets(query));
  }

  @GetMapping("/routes")
  public ResponseEntity<PublicDtos.RouteResolution> resolveRoute(
      @RequestParam MultiValueMap<String, String> query) {
    if (!query.keySet().equals(java.util.Set.of("path")) || query.get("path").size() != 1)
      throw ApiFailure.query();
    return respond(service.route(query.getFirst("path")));
  }

  @GetMapping("/programs")
  public ResponseEntity<PublicDtos.CatalogPage> listPrograms(
      @RequestParam MultiValueMap<String, String> query) {
    return respond(service.list("programs", query));
  }

  @GetMapping("/programs/{id}")
  public ResponseEntity<PublicDtos.Program> getProgram(
      @PathVariable @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9._:-]{0,159}") String id,
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    return respond(service.detail("programs", id, PublicDtos.Program.class));
  }

  @GetMapping("/phases")
  public ResponseEntity<PublicDtos.CatalogPage> listPhases(
      @RequestParam MultiValueMap<String, String> query) {
    return respond(service.list("phases", query));
  }

  @GetMapping("/phases/{id}")
  public ResponseEntity<PublicDtos.Phase> getPhase(
      @PathVariable @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9._:-]{0,159}") String id,
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    return respond(service.detail("phases", id, PublicDtos.Phase.class));
  }

  @GetMapping("/modules")
  public ResponseEntity<PublicDtos.CatalogPage> listModules(
      @RequestParam MultiValueMap<String, String> query) {
    return respond(service.list("modules", query));
  }

  @GetMapping("/modules/{id}")
  public ResponseEntity<PublicDtos.Module> getModule(
      @PathVariable @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9._:-]{0,159}") String id,
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    return respond(service.detail("modules", id, PublicDtos.Module.class));
  }

  @GetMapping("/topics")
  public ResponseEntity<PublicDtos.CatalogPage> listTopics(
      @RequestParam MultiValueMap<String, String> query) {
    return respond(service.list("topics", query));
  }

  @GetMapping("/topics/{id}")
  public ResponseEntity<PublicDtos.Topic> getTopic(
      @PathVariable @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9._:-]{0,159}") String id,
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    return respond(service.detail("topics", id, PublicDtos.Topic.class));
  }

  @GetMapping("/subtopics/{id}")
  public ResponseEntity<PublicDtos.Subtopic> getSubtopic(
      @PathVariable @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9._:-]{0,159}") String id,
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    return respond(service.detail("subtopics", id, PublicDtos.Subtopic.class));
  }

  @GetMapping("/resources")
  public ResponseEntity<PublicDtos.CatalogPage> listResources(
      @RequestParam MultiValueMap<String, String> query) {
    return respond(service.list("resources", query));
  }

  @GetMapping("/resources/{id}")
  public ResponseEntity<PublicDtos.Resource> getResource(
      @PathVariable @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9._:-]{0,159}") String id,
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    return respond(service.detail("resources", id, PublicDtos.Resource.class));
  }

  @GetMapping("/paths")
  public ResponseEntity<PublicDtos.CatalogPage> listPaths(
      @RequestParam MultiValueMap<String, String> query) {
    return respond(service.list("paths", query));
  }

  @GetMapping("/paths/{id}")
  public ResponseEntity<PublicDtos.Path> getPath(
      @PathVariable @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9._:-]{0,159}") String id,
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    return respond(service.detail("paths", id, PublicDtos.Path.class));
  }

  @GetMapping("/projects")
  public ResponseEntity<PublicDtos.CatalogPage> listProjects(
      @RequestParam MultiValueMap<String, String> query) {
    return respond(service.list("projects", query));
  }

  @GetMapping("/projects/{id}")
  public ResponseEntity<PublicDtos.Project> getProject(
      @PathVariable @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9._:-]{0,159}") String id,
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    return respond(service.detail("projects", id, PublicDtos.Project.class));
  }

  @GetMapping("/capstones")
  public ResponseEntity<PublicDtos.CatalogPage> listCapstones(
      @RequestParam MultiValueMap<String, String> query) {
    return respond(service.list("capstones", query));
  }

  @GetMapping("/capstones/{id}")
  public ResponseEntity<PublicDtos.Capstone> getCapstone(
      @PathVariable @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9._:-]{0,159}") String id,
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    return respond(service.detail("capstones", id, PublicDtos.Capstone.class));
  }

  @GetMapping("/exercises/{id}")
  public ResponseEntity<PublicDtos.Exercise> getExercise(
      @PathVariable @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9._:-]{0,159}") String id,
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    return respond(service.detail("exercises", id, PublicDtos.Exercise.class));
  }

  @GetMapping("/quizzes/{id}")
  public ResponseEntity<PublicDtos.Quiz> getQuiz(
      @PathVariable @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9._:-]{0,159}") String id,
      @RequestParam MultiValueMap<String, String> query) {
    empty(query);
    return respond(service.detail("quizzes", id, PublicDtos.Quiz.class));
  }
}
