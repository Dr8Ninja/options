package org.options.platform;

import static org.assertj.core.api.Assertions.*;

import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.junit.jupiter.*;
import org.testcontainers.postgresql.PostgreSQLContainer;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

@Testcontainers
@org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {
      "app.public-origin=https://localhost:8443",
      "app.environment=TEST",
      "management.server.port=0"
    })
class PublicCatalogIT {
  @Container
  static final PostgreSQLContainer POSTGRES =
      new PostgreSQLContainer(
              org.testcontainers.utility.DockerImageName.parse(
                      "postgres@sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae")
                  .asCompatibleSubstituteFor("postgres"))
          .withCommand(
              "postgres",
              "-c",
              "shared_preload_libraries=pg_stat_statements",
              "-c",
              "pg_stat_statements.track=all");

  @DynamicPropertySource
  static void database(DynamicPropertyRegistry r) {
    POSTGRES.start();
    r.add("spring.datasource.url", POSTGRES::getJdbcUrl);
    r.add("spring.datasource.username", POSTGRES::getUsername);
    r.add("spring.datasource.password", POSTGRES::getPassword);
    r.add("spring.flyway.enabled", () -> true);
  }

  @LocalServerPort int port;
  @Autowired JdbcTemplate db;
  @Autowired org.springframework.test.web.servlet.MockMvc mvc;
  @Autowired PlatformTransactionManager manager;
  final JsonMapper json = JsonMapper.builder().build();
  final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
  final List<Map<String, Object>> examples = new ArrayList<>();
  long actor, publication;
  String quizId;
  PublicReadFixtures.Ids adversarial;
  long activationMillis;

  HttpResponse<String> response(String path) throws Exception {
    var res =
        http.send(
            HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/v1" + path))
                .timeout(Duration.ofSeconds(15))
                .GET()
                .build(),
            HttpResponse.BodyHandlers.ofString());
    assertThat(res.headers().firstValue("Cache-Control")).contains("no-store");
    assertThat(res.headers().firstValue("Set-Cookie")).isEmpty();
    examples.add(
        Map.of(
            "path",
            path,
            "status",
            res.statusCode(),
            "headers",
            res.headers().map(),
            "body",
            json.readTree(res.body())));
    return res;
  }

  JsonNode get(String path) throws Exception {
    var r = response(path);
    assertThat(r.statusCode()).withFailMessage(path + ": " + r.body()).isEqualTo(200);
    return json.readTree(r.body());
  }

  void error(String path, int status, String code) throws Exception {
    var r = response(path);
    assertThat(r.statusCode()).withFailMessage(r.body()).isEqualTo(status);
    assertThat(r.headers().firstValue("Content-Type").orElseThrow())
        .startsWith("application/problem+json");
    assertThat(json.readTree(r.body()).get("code").asText()).isEqualTo(code);
  }

  String enc(String s) {
    return URLEncoder.encode(s, java.nio.charset.StandardCharsets.UTF_8);
  }

  @BeforeAll
  void canonicalFixture() throws Exception {
    error("/programs", 503, "TEMPORARILY_UNAVAILABLE");
    var seedSource =
        new org.springframework.jdbc.datasource.DriverManagerDataSource(
            POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword());
    var db = new JdbcTemplate(seedSource);
    db.execute("create extension pg_stat_statements");
    String password = UUID.randomUUID().toString();
    db.execute(
        "create role fixture_public_import login password '"
            + password
            + "' nosuperuser nocreatedb nocreaterole");
    db.execute("grant otr_import to fixture_public_import");
    var root = Path.of("..").toAbsolutePath().normalize();
    var pb =
        new ProcessBuilder(
            System.getenv()
                .getOrDefault("CONTENT_IMPORT_PYTHON", root.resolve(".venv/bin/python").toString()),
            root.resolve("scripts/seed-public-api-test.py").toString());
    pb.directory(root.toFile());
    pb.environment()
        .put(
            "CONTENT_IMPORT_DSN",
            "host="
                + POSTGRES.getHost()
                + " port="
                + POSTGRES.getMappedPort(5432)
                + " dbname="
                + POSTGRES.getDatabaseName()
                + " user=fixture_public_import password="
                + password);
    pb.redirectErrorStream(true);
    var process = pb.start();
    String output =
        new String(
            process.getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
    assertThat(process.waitFor()).withFailMessage(output).isZero();
    assertThat(db.queryForObject("select count(*) from catalog_object", Integer.class))
        .isEqualTo(2851);
    error("/topics/M01.01", 503, "TEMPORARILY_UNAVAILABLE");
    var tx =
        new TransactionTemplate(
            new org.springframework.jdbc.datasource.DataSourceTransactionManager(seedSource));
    tx.execute(
        status -> {
          actor =
              db.queryForObject(
                  "insert into editorial_actor(actor_ref,label) values (?,'P10 TEST ONLY — synthetic approvals, never publish externally') returning id",
                  Long.class,
                  UUID.randomUUID());
          publication =
              db.queryForObject(
                  "insert into publication(public_id,label,created_by_actor_id,manifest_hash,status) values (?,'P10 TEST ONLY canonical MAP fixture',?,repeat('a',64),'BUILDING') returning id",
                  Long.class,
                  UUID.randomUUID(),
                  actor);
          db.update(
              "insert into review_decision(revision_id,review_type,actor_id,outcome,reviewed_hash,findings,decided_at) select id,'rights',?,'APPROVE',content_hash,'Synthetic disposable API fixture approval',now() from catalog_revision",
              actor);
          db.update(
              "insert into publication_entry(publication_id,object_id,revision_id,visibility,indexable,display_order) select ?,object_id,id,case when kind='ARCHIVE' then 'ARCHIVE' else 'MAP' end,false,1 from catalog_revision",
              publication);
          var f = new PersistenceFixtures(db, actor);
          var quiz = f.quiz(publication, null, null);
          adversarial = PublicReadFixtures.add(f, publication);
          quizId =
              db.queryForObject(
                  "select external_id from catalog_object where id=?", String.class, quiz.object());
          db.update(
              "update publication set status='SEALED',validated_at=now() where id=?", publication);
          db.execute("select pg_stat_statements_reset()");
          long started = System.nanoTime();
          db.update(
              "insert into active_publication(singleton,publication_id,generation) values (1,?,1)",
              publication);
          activationMillis = (System.nanoTime() - started) / 1_000_000;
          return null;
        });
    Files.createDirectories(Path.of("target/p10-evidence"));
    Files.writeString(
        Path.of("target/p10-evidence/activation-queries.json"),
        json.writerWithDefaultPrettyPrinter()
            .writeValueAsString(
                db.queryForList(
                    "select query,calls,total_exec_time from pg_stat_statements where query not like '%pg_stat_statements%' order by total_exec_time desc limit 12")));
    String migration =
        Files.readString(
            Path.of("src/main/resources/db/migration/V0021__public_catalog_projection.sql"));
    int begin = migration.indexOf(" INSERT INTO public_catalog_filter\n WITH");
    int end = migration.indexOf("END $$;", begin);
    String membership =
        migration.substring(begin, end).strip().replaceAll("\\bpid\\b", Long.toString(publication));
    db.execute("set jit=off");
    db.execute("set enable_nestloop=off");
    Files.writeString(
        Path.of("target/p10-evidence/activation-membership-plan.json"),
        db.queryForObject("explain(analyze,buffers,format json) " + membership, String.class));
    db.execute("reset enable_nestloop");
    db.execute("reset jit");
    db.execute("analyze");
  }

  @Test
  @Order(1)
  void representativeDetailsAndHierarchyUseImportedRows() throws Exception {
    for (String route :
        List.of(
            "programs/OPT",
            "phases/P0",
            "modules/M01",
            "topics/M01.01",
            "subtopics/M01.01.S01",
            "resources/R01",
            "paths/PATH-BEGINNER",
            "projects/PR01",
            "capstones/C01",
            "exercises/EX-M01-C")) {
      var detail = get("/" + route);
      assertThat(detail.get("id").asText()).isEqualTo(route.split("/")[1]);
      assertThat(detail.get("visibility").asText()).isEqualTo("MAP");
    }
    var quiz = get("/quizzes/" + quizId);
    assertThat(quiz.get("itemCount").asInt()).isEqualTo(10);
    assertThat(quiz.get("attemptAvailable").asBoolean()).isFalse();
    assertThat(quiz.toString())
        .doesNotContain("Synthetic protected key", "questions", "choices", "forms");
    var module = get("/modules/M01");
    assertThat(module.get("topics").size()).isPositive();
    assertThat(module.get("competencies").size()).isPositive();
    assertThat(module.get("assignments").size()).isPositive();
    assertThat(get("/modules/M02").get("prerequisites").size()).isPositive();
    assertThat(get("/topics/M01.01").get("lessonMarkdown").isNull()).isTrue();
    var ex = get("/exercises/EX-M01-C");
    assertThat(ex.get("prompt").isNull()).isTrue();
    assertThat(ex.get("practiceAvailable").asBoolean()).isFalse();
    assertThat(get("/paths/PATH-BEGINNER").get("enrollmentAvailable").asBoolean()).isFalse();
    assertThat(get("/resources/R01").get("freshness").get("currentOperationalEligible").asBoolean())
        .isFalse();
  }

  @Test
  @Order(2)
  void collectionsUseDeterministicKeysetsAndBoundedPagination() throws Exception {
    for (String route :
        List.of(
            "programs",
            "phases",
            "modules",
            "topics",
            "resources",
            "paths",
            "projects",
            "capstones")) assertThat(get("/" + route).get("items").size()).isPositive();
    for (String sort : List.of("title", "-title", "duration", "priority", "-verified")) {
      Set<String> seen = new LinkedHashSet<>();
      String cursor = null;
      do {
        var page =
            get(
                "/resources?sort="
                    + sort
                    + "&limit=17"
                    + (cursor == null ? "" : "&cursor=" + enc(cursor)));
        for (var item : page.get("items")) assertThat(seen.add(item.get("id").asText())).isTrue();
        cursor = page.get("nextCursor").isNull() ? null : page.get("nextCursor").asText();
      } while (cursor != null);
      assertThat(seen).hasSize(96);
    }
    var p = get("/topics?limit=1");
    String c = p.get("nextCursor").asText();
    error("/topics?limit=2&cursor=" + enc(c), 400, "INVALID_CURSOR");
    error(
        "/topics?limit=1&cursor=" + enc(c.substring(0, c.length() - 3) + "XYZ"),
        400,
        "INVALID_CURSOR");
    error("/topics?limit=0", 400, "INVALID_QUERY");
    error("/topics?limit=51", 400, "INVALID_QUERY");
    error("/topics?limit=-1", 400, "INVALID_QUERY");
  }

  @Test
  @Order(3)
  void intersectionFacetsAndCanonicalLabelsAgree() throws Exception {
    var facets = get("/discovery-facets");
    assertThat(facets.get("difficulty").size()).isPositive();
    String value = facets.get("difficulty").get(0).get("value").asText();
    var all = get("/search?kind=RESOURCE&limit=50&difficulty=" + enc(value));
    for (var row : all.get("items")) assertThat(row.get("difficulty").asText()).isEqualTo(value);
    var f = get("/discovery-facets?difficulty=" + enc(value));
    assertThat(f.get("difficulty").size()).isEqualTo(1);
    assertThat(f.get("difficulty").get(0).get("count").asInt()).isEqualTo(all.get("total").asInt());
    String phase = "P0";
    var resource = get("/resources?phase=" + phase + "&cost=free&limit=50");
    for (var row : resource.get("items")) {
      var detail = get("/resources/" + row.get("id").asText());
      assertThat(detail.get("cost").asText()).isEqualTo("free");
      assertThat(detail.get("assignments").size()).isPositive();
    }
    var empty = get("/search?kind=MODULE&cost=free");
    assertThat(empty.get("items").size()).isZero();
    assertThat(empty.get("total").asInt()).isZero();
    assertThat(get("/topics?module=M01").get("items").size()).isPositive();
    assertThat(get("/modules?program=OPT&phase=P0&path=PATH-BEGINNER").get("items").size())
        .isPositive();
    var duplicate = get("/resources?cost=free&cost=free");
    assertThat(duplicate.get("items")).isEqualTo(get("/resources?cost=free").get("items"));
  }

  @Test
  @Order(4)
  void searchRanksIdsTitlesAndTextWithGenerationBoundary() throws Exception {
    assertThat(get("/search?q=M01.01").get("items").get(0).get("match").asText())
        .isEqualTo("EXACT_ID");
    String title = get("/modules/M01").get("title").asText();
    assertThat(get("/search?q=" + enc(title)).get("items").get(0).get("match").asText())
        .isEqualTo("EXACT_TITLE");
    assertThat(get("/search?q=volatility").get("total").asInt()).isPositive();
    assertThat(get("/search?q=" + enc("!!!")).get("items").size()).isZero();
    String gen = get("/content-version").get("generation").asText();
    assertThat(get("/search?q=volatility&page=99&generation=" + gen).get("items").size()).isZero();
    error("/search?page=1", 400, "INVALID_QUERY");
    error("/search?page=100&generation=" + gen, 400, "INVALID_QUERY");
    error("/search?page=1&generation=0", 409, "CONTENT_VERSION_CHANGED");
    assertThat(get("/search?q=" + enc("\"implied volatility\" -surface")).has("total")).isTrue();
  }

  @Test
  @Order(5)
  void malformedFiltersAndPrivateEndpointsFailClosed() throws Exception {
    for (String path :
        List.of(
            "/topics?limit=2&limit=3",
            "/modules?sort=title;drop",
            "/programs?difficulty=Beginner",
            "/topics?include=answers",
            "/topics/M01.01?preview=true",
            "/search?q=" + "a".repeat(201),
            "/discovery-facets?entity=resources&q=x",
            "/routes?path=https://evil.invalid")) error(path, 400, "INVALID_QUERY");
    error("/resources?cost=FREE", 422, "INVALID_FILTER_VALUE");
    error("/topics?module=UNKNOWN", 422, "INVALID_FILTER_VALUE");
    error("/topics/NO-SUCH-ID", 404, "NOT_FOUND");
    error("/quizzes/QZ-M01", 404, "NOT_FOUND");
    error("/routes?path=/modules/unknown", 404, "NOT_FOUND");
    for (String path :
        List.of(
            "/me/notes",
            "/admin/drafts",
            "/admin/imports",
            "/quiz-attempts/00000000-0000-0000-0000-000000000000"))
      error(path, 401, "AUTHENTICATION_REQUIRED");
    var tx = new TransactionTemplate(manager);
    tx.execute(
        status -> {
          long o =
              db.queryForObject(
                  "insert into catalog_object(external_id,kind) values ('DRAFT-ONLY','TOPIC') returning id",
                  Long.class);
          db.update(
              "insert into catalog_revision(object_id,kind,revision_no,title,readiness,author_actor_id,format_version,content_hash) values (?,'TOPIC',1,'NEVERPUBLICSENTINEL','scope_outline',?,'v1',repeat('f',64))",
              o,
              actor);
          db.update("update catalog_revision set sealed_at=now() where object_id=?", o);
          return null;
        });
    tx.execute(
        status -> {
          long existing =
              db.queryForObject(
                  "select id from catalog_object where external_id='M01.01'", Long.class);
          var f = new PersistenceFixtures(db, actor);
          long revision = f.revision(existing, "TOPIC", 2);
          db.update(
              "update catalog_revision set title='UNPUBLISHEDREVISIONSECRET' where id=?", revision);
          f.seal(revision);
          db.update("update draft_head set revision_id=? where object_id=?", revision, existing);
          return null;
        });
    assertThat(get("/topics/M01.01").get("title").asText())
        .isNotEqualTo("UNPUBLISHEDREVISIONSECRET");
    assertThat(get("/search?q=UNPUBLISHEDREVISIONSECRET").get("total").asInt()).isZero();
    error("/topics/DRAFT-ONLY", 404, "NOT_FOUND");
    assertThat(get("/search?q=NEVERPUBLICSENTINEL").get("total").asInt()).isZero();
    for (var example : examples)
      assertThat(json.writeValueAsString(example.get("body")))
          .doesNotContain(
              "reference_behavior",
              "expectedNumeric",
              "correctChoices",
              "diagnostic_pass",
              "author_actor_id",
              "NEVERPUBLICSENTINEL");
  }

  @Test
  @Order(6)
  void publicReadsAreReadOnlyAndHeadMatchesGet() throws Exception {
    int before = db.queryForObject("select count(*) from editorial_event", Integer.class);
    get("/topics");
    get("/search?q=option");
    var r =
        http.send(
            HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/v1/topics/M01.01"))
                .method("HEAD", HttpRequest.BodyPublishers.noBody())
                .build(),
            HttpResponse.BodyHandlers.ofString());
    assertThat(r.statusCode()).isEqualTo(200);
    assertThat(r.body()).isEmpty();
    assertThat(r.headers().firstValue("X-Content-Version")).isPresent();
    assertThat(db.queryForObject("select count(*) from editorial_event", Integer.class))
        .isEqualTo(before);
    assertThat(db.queryForObject("select count(*) from spring_session", Integer.class)).isZero();
  }

  @Test
  @Order(6)
  void expiredCursorAndGenerationChangeAreDistinct() throws Exception {
    var page = get("/topics?limit=1");
    String cursor = page.get("nextCursor").asText();
    String[] parts = cursor.split("\\.");
    var payload =
        (tools.jackson.databind.node.ObjectNode)
            json.readTree(Base64.getUrlDecoder().decode(parts[0]));
    payload.put("expires", 0);
    byte[] bytes = json.writeValueAsBytes(payload);
    var mac = javax.crypto.Mac.getInstance("HmacSHA256");
    mac.init(
        new javax.crypto.spec.SecretKeySpec(
            db.queryForObject("select secret from public_cursor_key", byte[].class), "HmacSHA256"));
    String expired =
        Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
            + "."
            + Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(bytes));
    error("/topics?limit=1&cursor=" + enc(expired), 409, "CURSOR_EXPIRED");
    db.update("update active_publication set generation=generation+1,updated_at=now()");
    error("/topics?limit=1&cursor=" + enc(cursor), 409, "CONTENT_VERSION_CHANGED");
    var response =
        http.send(
            HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/v1/topics"))
                .POST(HttpRequest.BodyPublishers.ofString("{}"))
                .build(),
            HttpResponse.BodyHandlers.ofString());
    assertThat(response.statusCode()).isEqualTo(405);
    assertThat(response.headers().firstValue("Allow")).contains("GET, HEAD");
  }

  @Test
  @Order(6)
  void hiddenRelationshipsKeysAndStaleRulesRemainProtected() throws Exception {
    var topic = get("/topics/" + adversarial.topic());
    assertThat(topic.get("prerequisites").size()).isZero();
    assertThat(topic.get("ruleNotices").get(0).get("status").asText()).isEqualTo("DUE");
    assertThat(topic.get("ruleNotices").get(0).get("currentOperationalEligible").asBoolean())
        .isFalse();
    error("/topics/" + adversarial.hidden(), 404, "NOT_FOUND");
    for (String term :
        List.of(
            "HIDDENRELATIONSENTINEL",
            "PROTECTEDSCOPESENTINEL",
            "PROTECTEDRULEVALUESENTINEL",
            "ANSWERKEYSENTINEL"))
      assertThat(get("/search?q=" + term).get("total").asInt()).isZero();
    var project = get("/projects/" + adversarial.project());
    assertThat(project.toString()).doesNotContain("ANSWERKEYSENTINEL");
    assertThat(
            get("/projects?topic=" + adversarial.topic() + "&path=" + adversarial.path())
                .get("items")
                .size())
        .isEqualTo(1);
    assertThat(get("/paths/" + adversarial.path()).get("projects").get(0).get("id").asText())
        .isEqualTo(adversarial.project());
  }

  @Test
  @Order(8)
  void withdrawalInvalidatesCursorsAndEveryPublicRead() throws Exception {
    String cursor = get("/resources?limit=1").get("nextCursor").asText();
    db.update(
        "insert into content_withdrawal(object_id,reason_code,public_message,actor_id,starts_at) select id,'TEST','Synthetic public withdrawal notice',?,now() from catalog_object where external_id='R01'",
        actor);
    error("/resources/R01", 409, "CONTENT_WITHDRAWN");
    error("/routes?path=/resources/R01", 409, "CONTENT_WITHDRAWN");
    error("/resources?limit=1&cursor=" + enc(cursor), 409, "CONTENT_VERSION_CHANGED");
    assertThat(get("/search?q=R01").get("items").toString()).doesNotContain("\"id\":\"R01\"");
    assertThat(get("/modules/M02").get("assignments").toString()).doesNotContain("\"id\":\"R01\"");
    for (var example : examples)
      assertThat(json.writeValueAsString(example.get("body")))
          .doesNotContain(
              "ANSWERKEYSENTINEL",
              "HIDDENRELATIONSENTINEL",
              "PROTECTEDSCOPESENTINEL",
              "PROTECTEDRULEVALUESENTINEL",
              "Synthetic protected key");
  }

  @Test
  @Order(6)
  void publicProjectionIgnoresIdentityAndStaffCannotOpenProtectedRoutes() throws Exception {
    var anonymous = get("/topics/M01.01");
    var authenticated =
        mvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/v1/topics/M01.01")
                    .with(
                        org.springframework.security.test.web.servlet.request
                            .SecurityMockMvcRequestPostProcessors.user("fixture")
                            .roles("ADMIN", "EDITOR")))
            .andReturn()
            .getResponse();
    assertThat(authenticated.getStatus()).isEqualTo(200);
    assertThat(json.readTree(authenticated.getContentAsString())).isEqualTo(anonymous);
    for (String path : List.of("/api/v1/admin/drafts", "/api/v1/me/notes", "/api/v1/admin/imports"))
      mvc.perform(
              org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(path)
                  .with(
                      org.springframework.security.test.web.servlet.request
                          .SecurityMockMvcRequestPostProcessors.user("fixture")
                          .roles("ADMIN", "EDITOR")))
          .andExpect(
              org.springframework.test.web.servlet.result.MockMvcResultMatchers.status()
                  .isForbidden());
    var resource = get("/resources/RX01");
    assertThat(resource.get("assignments").toString()).contains("REVIEWED");
  }

  @Test
  @Order(7)
  void renamesResolveAndRetirementOverridesSearchAndReferences() throws Exception {
    String old = get("/modules/M01").get("canonicalPath").asText();
    long object =
        db.queryForObject("select id from catalog_object where external_id='M01'", Long.class);
    var tx = new TransactionTemplate(manager);
    tx.execute(
        status -> {
          db.update("update catalog_route set canonical=false where object_id=?", object);
          db.update(
              "insert into catalog_route(path_key,object_id,canonical) values ('/modules/p10-renamed-fixture',?,true)",
              object);
          return null;
        });
    assertThat(get("/modules/M01").get("canonicalPath").asText()).isEqualTo(old);
    error("/routes?path=/modules/p10-renamed-fixture", 404, "NOT_FOUND");
    var source =
        new org.springframework.jdbc.datasource.DriverManagerDataSource(
            POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword());
    var seed = new JdbcTemplate(source);
    new TransactionTemplate(
            new org.springframework.jdbc.datasource.DataSourceTransactionManager(source))
        .execute(
            status -> {
              long next =
                  seed.queryForObject(
                      "insert into publication(public_id,label,created_by_actor_id,manifest_hash,status) values (?,'P10 approved rename fixture',?,repeat('b',64),'BUILDING') returning id",
                      Long.class,
                      UUID.randomUUID(),
                      actor);
              seed.update(
                  "insert into publication_entry(publication_id,object_id,revision_id,visibility,indexable,display_order) select ?,object_id,revision_id,visibility,indexable,display_order from publication_entry where publication_id=?",
                  next,
                  publication);
              seed.update(
                  "update publication set status='SEALED',validated_at=now() where id=?", next);
              seed.update(
                  "update active_publication set publication_id=?,generation=generation+1,updated_at=now()",
                  next);
              return null;
            });
    assertThat(get("/routes?path=" + enc(old)).get("status").asText()).isEqualTo("RENAMED");
    db.update("update catalog_object set retired_at=now() where id=?", object);
    error("/modules/M01", 409, "CONTENT_RETIRED");
    assertThat(get("/search?q=M01").get("items").toString()).doesNotContain("\"id\":\"M01\"");
    assertThat(get("/routes?path=" + enc(old)).get("status").asText()).isEqualTo("RETIRED");
    assertThat(get("/phases/P0").get("modules").toString()).contains("RETIRED");
  }

  @Test
  @Order(6)
  void canonicalScaleQueriesHaveConstantRoundTrips() throws Exception {
    db.execute("select pg_stat_statements_reset()");
    get("/topics?limit=1");
    long small = publicSelectCount();
    db.execute("select pg_stat_statements_reset()");
    long started = System.nanoTime();
    get("/topics?limit=50");
    long largeMs = (System.nanoTime() - started) / 1_000_000;
    long large = publicSelectCount();
    assertThat(large).isEqualTo(small).isLessThanOrEqualTo(5);
    var timings = new LinkedHashMap<String, Object>();
    for (String path :
        List.of(
            "/search?q=volatility&limit=50",
            "/resources?cost=free&phase=P0&limit=50",
            "/discovery-facets?entity=search&q=volatility",
            "/modules/M01")) {
      started = System.nanoTime();
      get(path);
      timings.put(path, (System.nanoTime() - started) / 1_000_000);
    }
    var plans = new LinkedHashMap<String, Object>();
    plans.put(
        "search",
        json.readTree(
            db.queryForObject(
                "explain(analyze,buffers,format json) select c.external_id from public_catalog_entry c join public_search_document s on s.publication_id=c.publication_id and s.object_id=c.object_id where c.publication_id=? and c.retired_at is null and not c.withdrawn and (s.search_vector @@ websearch_to_tsquery('english','volatility') or c.title_key=public_text_key('volatility') or public_text_key(c.external_id)=public_text_key('volatility')) order by ts_rank_cd('{0.1,0.2,0.4,1.0}'::real[],s.search_vector,websearch_to_tsquery('english','volatility'),32) desc,c.title_key COLLATE \"C\",c.external_id COLLATE \"C\" limit 50",
                String.class,
                publication)));
    plans.put(
        "filter",
        json.readTree(
            db.queryForObject(
                "explain(analyze,buffers,format json) select c.external_id from public_catalog_entry c where c.publication_id=? and c.kind='RESOURCE' and c.retired_at is null and not c.withdrawn and exists(select 1 from public_catalog_filter f where f.publication_id=c.publication_id and f.object_id=c.object_id and f.filter_name='cost' and f.value='free') and exists(select 1 from public_catalog_filter f where f.publication_id=c.publication_id and f.object_id=c.object_id and f.filter_name='phase' and f.value='P0') order by c.title_key COLLATE \"C\",c.external_id COLLATE \"C\" limit 50",
                String.class,
                publication)));
    var evidence = new LinkedHashMap<String, Object>();
    evidence.put("canonicalObjects", 2851);
    evidence.put(
        "publicSearchRows",
        db.queryForObject("select count(*) from public_search_document", Integer.class));
    evidence.put("activationMillis", activationMillis);
    evidence.put("selectsLimit1", small);
    evidence.put("selectsLimit50", large);
    evidence.put("list50Millis", largeMs);
    evidence.put("requestMillis", timings);
    evidence.put("plans", plans);
    Files.createDirectories(Path.of("target/p10-evidence"));
    Files.writeString(
        Path.of("target/p10-evidence/query-behavior.json"),
        json.writerWithDefaultPrettyPrinter().writeValueAsString(evidence));
  }

  long publicSelectCount() {
    return db.queryForObject(
        "select coalesce(sum(calls),0) from pg_stat_statements where toplevel and query not like '%pg_stat_statements%' and (query like '%public_catalog_entry%' or query like '%active_publication%' or query like '%public_cursor_key%')",
        Long.class);
  }

  @AfterAll
  void evidence() throws Exception {
    var dir = Path.of("target/p10-evidence");
    Files.createDirectories(dir);
    Files.writeString(
        dir.resolve("examples.json"),
        json.writerWithDefaultPrettyPrinter().writeValueAsString(examples));
    var root = Path.of("..").toAbsolutePath().normalize();
    var check =
        new ProcessBuilder(
                System.getenv()
                    .getOrDefault(
                        "CONTENT_IMPORT_PYTHON", root.resolve(".venv/bin/python").toString()),
                root.resolve("scripts/check-public-api.py").toString())
            .directory(root.toFile())
            .redirectErrorStream(true)
            .start();
    var output =
        new String(check.getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
    assertThat(check.waitFor()).withFailMessage(output).isZero();
  }
}
