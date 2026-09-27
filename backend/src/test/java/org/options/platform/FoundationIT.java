package org.options.platform;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalManagementPort;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;
import tools.jackson.databind.json.JsonMapper;

@Testcontainers
@org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {
      "app.public-origin=https://localhost:8443",
      "app.environment=TEST",
      "management.server.port=0",
      "springdoc.api-docs.enabled=true"
    })
class FoundationIT {
  @Container
  static final PostgreSQLContainer POSTGRES =
      new PostgreSQLContainer(
          org.testcontainers.utility.DockerImageName.parse(
                  "postgres@sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae")
              .asCompatibleSubstituteFor("postgres"));

  @DynamicPropertySource
  static void database(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
    registry.add("spring.datasource.username", POSTGRES::getUsername);
    registry.add("spring.datasource.password", POSTGRES::getPassword);
    registry.add("spring.flyway.url", POSTGRES::getJdbcUrl);
    registry.add("spring.flyway.user", POSTGRES::getUsername);
    registry.add("spring.flyway.password", POSTGRES::getPassword);
    registry.add("spring.flyway.enabled", () -> true);
  }

  @LocalServerPort int port;
  @LocalManagementPort int managementPort;
  @Autowired JdbcTemplate jdbc;
  @Autowired org.springframework.test.web.servlet.MockMvc mvc;
  @Autowired Flyway flyway;
  final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
  final JsonMapper json = JsonMapper.builder().build();

  HttpResponse<String> get(int target, String path, String... headers) throws Exception {
    var request =
        HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + target + path))
            .timeout(Duration.ofSeconds(10));
    if (headers.length > 0) request.headers(headers);
    return http.send(request.GET().build(), HttpResponse.BodyHandlers.ofString());
  }

  @Test
  void realPostgresMigrationsAreValidAndRepeatable() {
    assertThat(jdbc.queryForObject("show server_version", String.class)).startsWith("18.");
    flyway.validate();
    assertThat(flyway.migrate().migrationsExecuted).isZero();
    assertThat(
            jdbc.queryForObject(
                "select count(*) from flyway_schema_history where success", Integer.class))
        .isGreaterThanOrEqualTo(1);
  }

  @Test
  void livenessCreatesNoSessionAndReadinessIncludesDatabase() throws Exception {
    var health = get(port, "/api/health");
    assertThat(health.statusCode()).isEqualTo(200);
    assertThat(json.readTree(health.body()).size()).isEqualTo(1);
    assertThat(health.headers().firstValue("Set-Cookie")).isEmpty();
    assertThat(get(managementPort, "/actuator/health/readiness").statusCode()).isEqualTo(200);
    assertThat(get(port, "/actuator/health/readiness").statusCode()).isNotEqualTo(200);
    assertThat(get(managementPort, "/actuator/env").statusCode()).isNotEqualTo(200);
  }

  @Test
  void csrfIsMaskedSessionBackedAndUnknownRoutesRemainDenied() throws Exception {
    var first = get(port, "/api/v1/auth/csrf", "X-Request-ID", "caller-controlled");
    assertThat(first.statusCode()).isEqualTo(200);
    assertThat(first.headers().firstValue("Cache-Control")).contains("no-store");
    assertThat(first.headers().firstValue("X-Request-ID").orElseThrow()).matches("[a-f0-9-]{36}");
    String cookie = first.headers().firstValue("Set-Cookie").orElseThrow();
    assertThat(cookie)
        .contains("__Host-OTRSESSION=", "Secure", "HttpOnly", "SameSite=Lax", "Path=/")
        .doesNotContain("Domain=");
    cookie = cookie.split(";", 2)[0];
    var second = get(port, "/api/v1/auth/csrf", "Cookie", cookie);
    String token = json.readTree(first.body()).get("token").asText();
    assertThat(json.readTree(second.body()).get("token").asText()).isNotEqualTo(token);
    assertThat(jdbc.queryForObject("select count(*) from spring_session_attributes", Integer.class))
        .isPositive();
    assertThat(get(port, "/api/v1/me", "Cookie", cookie).statusCode()).isEqualTo(401);
    for (String origin : new String[] {"https://localhost:8443", "https://hostile.invalid"}) {
      var req =
          HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/v1/future-endpoint"))
              .header("Cookie", cookie)
              .header("Origin", origin)
              .header("X-CSRF-TOKEN", token)
              .POST(HttpRequest.BodyPublishers.noBody())
              .build();
      var res = http.send(req, HttpResponse.BodyHandlers.ofString());
      assertThat(res.statusCode()).isEqualTo(origin.contains("hostile") ? 403 : 401);
      assertThat(json.readTree(res.body()).has("requestId")).isTrue();
    }
    var missing =
        HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/v1/future-endpoint"))
            .header("Origin", "https://localhost:8443")
            .POST(HttpRequest.BodyPublishers.noBody())
            .build();
    assertThat(http.send(missing, HttpResponse.BodyHandlers.ofString()).statusCode())
        .isEqualTo(403);
    assertThat(
            get(port, "/api/v1/me", "Origin", "https://hostile.invalid")
                .headers()
                .firstValue("Access-Control-Allow-Origin"))
        .isEmpty();
  }

  @Test
  void springdocGeneratesOnlyImplementedRoutes() throws Exception {
    var result = get(port, "/v3/api-docs");
    assertThat(result.statusCode()).isEqualTo(200);
    java.nio.file.Files.writeString(
        java.nio.file.Path.of("target/generated-openapi.json"), result.body());
    var paths = json.readTree(result.body()).get("paths");
    assertThat(paths.has("/api/v1/auth/csrf")).isTrue();
    assertThat(paths.has("/api/v1/topics")).isTrue();
    assertThat(paths.get("/api/v1/auth/csrf").get("get").has("responses")).isTrue();
  }

  @Test
  void checksumDriftFailsAndBrokenMigrationRollsBack(
      @org.junit.jupiter.api.io.TempDir java.nio.file.Path temp) throws Exception {
    var source =
        java.nio.file.Path.of("src/main/resources/db/migration/V0001__spring_jdbc_sessions.sql");
    var copy = temp.resolve(source.getFileName());
    java.nio.file.Files.copy(source, copy);
    var probe =
        Flyway.configure()
            .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
            .schemas("migration_probe")
            .locations("filesystem:" + temp)
            .cleanDisabled(true)
            .load();
    probe.migrate();
    probe.validate();
    java.nio.file.Files.writeString(
        copy, "\n-- changed checksum", java.nio.file.StandardOpenOption.APPEND);
    org.assertj.core.api.Assertions.assertThatThrownBy(probe::validate)
        .isInstanceOf(org.flywaydb.core.api.exception.FlywayValidateException.class);
    java.nio.file.Files.copy(source, copy, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
    java.nio.file.Files.writeString(
        temp.resolve("V0002__deliberate_failure.sql"),
        "CREATE TABLE must_rollback(id integer); SELECT missing_column FROM missing_table;");
    org.assertj.core.api.Assertions.assertThatThrownBy(probe::migrate)
        .isInstanceOf(org.flywaydb.core.api.FlywayException.class);
    assertThat(
            jdbc.queryForObject(
                "select to_regclass('migration_probe.must_rollback')", String.class))
        .isNull();
    assertThat(
            jdbc.queryForObject(
                "select count(*) from migration_probe.flyway_schema_history where success and type = 'SQL'",
                Integer.class))
        .isEqualTo(1);
  }

  @Test
  void readinessFailsDuringDatabaseOutageButProcessStaysLive() throws Exception {
    String id = POSTGRES.getContainerId();
    var docker = org.testcontainers.DockerClientFactory.instance().client();
    docker.pauseContainerCmd(id).exec();
    try {
      assertThat(get(port, "/api/health").statusCode()).isEqualTo(200);
      assertThat(get(managementPort, "/actuator/health/readiness").statusCode()).isEqualTo(503);
    } finally {
      docker.unpauseContainerCmd(id).exec();
    }
    assertThat(get(managementPort, "/actuator/health/readiness").statusCode()).isEqualTo(200);
  }

  @Test
  void unknownRoutesDenyEvenAnAuthenticatedStaffPrincipal() throws Exception {
    mvc.perform(
            org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                    "/api/v1/future-endpoint")
                .with(
                    org.springframework.security.test.web.servlet.request
                        .SecurityMockMvcRequestPostProcessors.user("fixture")
                        .roles("ADMIN", "EDITOR")))
        .andExpect(
            org.springframework.test.web.servlet.result.MockMvcResultMatchers.status()
                .isForbidden());
  }
}
