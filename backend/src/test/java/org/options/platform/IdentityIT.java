package org.options.platform;

import static org.assertj.core.api.Assertions.*;

import java.net.*;
import java.net.http.*;
import java.time.*;
import java.util.*;
import org.junit.jupiter.api.*;
import org.options.platform.identity.service.IdentityMail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.*;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.*;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;
import tools.jackson.databind.*;
import tools.jackson.databind.json.JsonMapper;

@Testcontainers
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {
      "app.public-origin=https://localhost:8443",
      "app.environment=TEST",
      "management.server.port=0",
      "IDENTITY_MAIL_MODE=LOCAL",
      "identity.mail.poll-ms=3600000"
    })
class IdentityIT {
  @Container
  static final PostgreSQLContainer DB =
      new PostgreSQLContainer(
          DockerImageName.parse(
                  "postgres@sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae")
              .asCompatibleSubstituteFor("postgres"));

  @Container
  static final GenericContainer<?> MAIL =
      new GenericContainer<>(
              DockerImageName.parse(
                  "axllent/mailpit@sha256:74d609a42ec279aa63c6b4622a6fa9b5408d1ad5b1d76a1c4be40a265ce0863d"))
          .withExposedPorts(1025, 8025);

  @DynamicPropertySource
  static void properties(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url", DB::getJdbcUrl);
    r.add("spring.datasource.username", DB::getUsername);
    r.add("spring.datasource.password", DB::getPassword);
    r.add("IDENTITY_MAIL_PORT", () -> MAIL.getMappedPort(1025));
  }

  @LocalServerPort int port;
  @Autowired JdbcTemplate db;
  @Autowired IdentityMail mail;
  @Autowired org.springframework.session.jdbc.JdbcIndexedSessionRepository sessions;
  final JsonMapper json = JsonMapper.builder().build();
  final HttpClient http = HttpClient.newHttpClient();
  static final List<Map<String, Object>> captures = new ArrayList<>();

  @AfterAll
  static void saveCaptures() throws Exception {
    var out = java.nio.file.Path.of("target/p13-evidence");
    java.nio.file.Files.createDirectories(out);
    java.nio.file.Files.writeString(
        out.resolve("examples.json"),
        JsonMapper.builder().build().writerWithDefaultPrettyPrinter().writeValueAsString(captures));
  }

  final String password = "A river of 7 quiet lanterns";

  @BeforeEach
  void budgets() {
    db.update("delete from auth_throttle");
  }

  class Browser {
    String cookie = "";

    HttpResponse<String> request(String method, String path, Object body, boolean csrf)
        throws Exception {
      String token = null;
      if (csrf)
        token =
            json.readTree(request("GET", "/auth/csrf", null, false).body()).get("token").asText();
      var b =
          HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/v1" + path))
              .timeout(Duration.ofSeconds(10));
      if (!cookie.isEmpty()) b.header("Cookie", cookie);
      if (!method.equals("GET")) b.header("Origin", "https://localhost:8443");
      if (token != null) b.header("X-CSRF-TOKEN", token);
      b.header("Content-Type", "application/json");
      b.method(
          method,
          body == null
              ? HttpRequest.BodyPublishers.noBody()
              : HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body)));
      var response = http.send(b.build(), HttpResponse.BodyHandlers.ofString());
      response.headers().firstValue("Set-Cookie").ifPresent(c -> cookie = c.split(";", 2)[0]);
      assertThat(response.headers().firstValue("Cache-Control")).contains("no-store");
      if (!path.equals("/auth/csrf") && response.statusCode() != 204)
        captures.add(
            Map.of(
                "method",
                method.toLowerCase(),
                "path",
                path,
                "status",
                response.statusCode(),
                "body",
                json.readTree(response.body()),
                "cacheControl",
                response.headers().firstValue("Cache-Control").orElse("")));
      return response;
    }

    int post(String path, Object body) throws Exception {
      return request("POST", path, body, true).statusCode();
    }
  }

  String address() {
    return UUID.randomUUID() + "@example.invalid";
  }

  void register(Browser b, String address) throws Exception {
    assertThat(
            b.post(
                "/auth/register",
                Map.of("email", address, "password", password, "eligibilityAttested", true)))
        .isEqualTo(202);
  }

  String token(String address) throws Exception {
    for (int i = 0; i < 10; i++) {
      mail.deliver();
      var messages =
          json.readTree(
                  http.send(
                          HttpRequest.newBuilder(
                                  URI.create(
                                      "http://127.0.0.1:"
                                          + MAIL.getMappedPort(8025)
                                          + "/api/v1/search?query="
                                          + URLEncoder.encode(
                                              "to:" + address,
                                              java.nio.charset.StandardCharsets.UTF_8)))
                              .GET()
                              .build(),
                          HttpResponse.BodyHandlers.ofString())
                      .body())
              .get("messages");
      if (messages != null && !messages.isEmpty()) {
        String id = messages.get(0).get("ID").asText();
        var text =
            json.readTree(
                    http.send(
                            HttpRequest.newBuilder(
                                    URI.create(
                                        "http://127.0.0.1:"
                                            + MAIL.getMappedPort(8025)
                                            + "/api/v1/message/"
                                            + id))
                                .GET()
                                .build(),
                            HttpResponse.BodyHandlers.ofString())
                        .body())
                .get("Text")
                .asText();
        var m = java.util.regex.Pattern.compile("#token=([A-Za-z0-9_-]{43})").matcher(text);
        if (m.find()) return m.group(1);
      }
      Thread.sleep(100);
    }
    throw new AssertionError("Local verification message missing");
  }

  void verified(Browser b, String address) throws Exception {
    register(b, address);
    assertThat(b.post("/auth/verification-confirmations", Map.of("token", token(address))))
        .isEqualTo(200);
  }

  void login(Browser b, String address) throws Exception {
    assertThat(b.post("/auth/login", Map.of("email", address, "password", password)))
        .isEqualTo(200);
  }

  @Test
  void registrationVerificationGenericDuplicateAndPasswordPolicy() throws Exception {
    var b = new Browser();
    String email = address();
    assertThat(
            b.post(
                "/auth/register",
                Map.of("email", email, "password", "short", "eligibilityAttested", true)))
        .isEqualTo(422);
    assertThat(
            b.post(
                "/auth/register",
                Map.of("email", email, "password", password, "eligibilityAttested", false)))
        .isEqualTo(400);
    assertThat(
            b.post(
                "/auth/register",
                Map.of(
                    "email",
                    email,
                    "password",
                    password,
                    "eligibilityAttested",
                    true,
                    "roles",
                    List.of("ADMIN"))))
        .isEqualTo(400);
    register(b, email);
    register(b, email);
    login(b, email);
    assertThat(b.request("GET", "/me", null, false).statusCode()).isEqualTo(401);
    String secret = token(email);
    assertThat(b.post("/auth/verification-confirmations", Map.of("token", secret))).isEqualTo(200);
    assertThat(b.post("/auth/verification-confirmations", Map.of("token", secret))).isEqualTo(400);
    assertThat(
            db.queryForObject(
                "select password_hash from account where email_key=?", String.class, email))
        .startsWith("{argon2id}$argon2id$");
    assertThat(
            db.queryForObject(
                "select count(*) from account_role where account_id=(select id from account where email_key=?)",
                Integer.class,
                email))
        .isZero();
  }

  @Test
  void loginRotationCsrfLogoutAndTwoUserIsolation() throws Exception {
    var a = new Browser();
    var b = new Browser();
    String one = address(), two = address();
    verified(a, one);
    verified(b, two);
    assertThat(a.post("/auth/login", Map.of("email", one, "password", "incorrect password")))
        .isEqualTo(401);
    a.request("GET", "/auth/csrf", null, false);
    String previous = a.cookie;
    login(a, one);
    assertThat(a.cookie).isNotEqualTo(previous);
    login(b, two);
    assertThat(json.readTree(a.request("GET", "/me", null, false).body()).get("email").asText())
        .isEqualTo(one);
    assertThat(b.request("GET", "/me", null, false).body()).contains(two).doesNotContain(one);
    assertThat(a.request("POST", "/auth/logout", null, false).statusCode()).isEqualTo(403);
    assertThat(a.request("GET", "/admin/content", null, false).statusCode()).isEqualTo(403);
    var old = new Browser();
    old.cookie = previous;
    assertThat(old.request("GET", "/me", null, false).statusCode()).isEqualTo(401);
    assertThat(a.post("/auth/logout", null)).isEqualTo(204);
    assertThat(a.request("GET", "/me", null, false).statusCode()).isEqualTo(401);
    assertThat(b.request("GET", "/me", null, false).statusCode()).isEqualTo(200);
  }

  @Test
  void resetIsSingleUseExpiresAndRevokesEverySession() throws Exception {
    var a = new Browser();
    String email = address();
    verified(a, email);
    login(a, email);
    var b = new Browser();
    login(b, email);
    assertThat(a.post("/auth/password-reset-requests", Map.of("email", email))).isEqualTo(202);
    String secret = token(email);
    db.update(
        "update auth_token set expires_at=now()-interval '1 minute',created_at=now()-interval '1 hour' where purpose='RESET'");
    assertThat(
            a.post(
                "/auth/password-reset-confirmations",
                Map.of("token", secret, "newPassword", "Different river of 8 lanterns")))
        .isEqualTo(400);
    assertThat(a.post("/auth/password-reset-requests", Map.of("email", email))).isEqualTo(202);
    String next = token(email);
    assertThat(next).isNotEqualTo(secret);
    assertThat(
            a.post(
                "/auth/password-reset-confirmations",
                Map.of("token", next, "newPassword", "Different river of 8 lanterns")))
        .isEqualTo(200);
    assertThat(
            a.post(
                "/auth/password-reset-confirmations",
                Map.of("token", next, "newPassword", "Different river of 8 lanterns")))
        .isEqualTo(400);
    assertThat(b.request("GET", "/me", null, false).statusCode()).isEqualTo(401);
    assertThat(a.request("GET", "/me", null, false).statusCode()).isEqualTo(401);
  }

  @Test
  void sessionExpiryGenerationAndThrottleAreAuthoritative() throws Exception {
    var a = new Browser();
    String email = address();
    verified(a, email);
    login(a, email);
    db.update(
        "update spring_session set expiry_time=0,last_access_time=0,max_inactive_interval=1 where principal_name=(select public_id::text from account where email_key=?)",
        email);
    assertThat(a.request("GET", "/me", null, false).statusCode()).isEqualTo(401);
    login(a, email);
    db.update(
        "update account set auth_generation=auth_generation+1,lock_version=lock_version+1,updated_at=now() where email_key=?",
        email);
    assertThat(a.request("GET", "/me", null, false).statusCode()).isEqualTo(401);
    db.update("delete from auth_throttle");
    for (int i = 0; i < 10; i++)
      assertThat(a.post("/auth/login", Map.of("email", email, "password", "wrong password value")))
          .isEqualTo(401);
    assertThat(a.post("/auth/login", Map.of("email", email, "password", password))).isEqualTo(429);
  }

  void ageSessions(String email, String attribute, long seconds) {
    var ids =
        db.queryForList(
            "select session_id from spring_session where principal_name=(select public_id::text from account where email_key=?)",
            String.class,
            email);
    for (String id : ids) {
      org.springframework.session.SessionRepository<org.springframework.session.Session>
          repository = (org.springframework.session.SessionRepository) sessions;
      var session = repository.findById(id);
      session.setAttribute(attribute, Instant.now().getEpochSecond() - seconds);
      repository.save(session);
    }
  }

  @Test
  void recentAuthenticationAbsoluteExpiryAndPasswordRevocation() throws Exception {
    var a = new Browser();
    var b = new Browser();
    String email = address();
    verified(a, email);
    login(a, email);
    login(b, email);
    ageSessions(email, "identity.passwordAt", 301);
    assertThat(a.post("/me/password", Map.of("newPassword", password))).isEqualTo(403);
    assertThat(a.post("/auth/reauthentication", Map.of("password", password))).isEqualTo(200);
    assertThat(a.post("/me/password", Map.of("newPassword", password + " again"))).isEqualTo(202);
    assertThat(b.request("GET", "/me", null, false).statusCode()).isEqualTo(401);
    assertThat(a.post("/auth/login", Map.of("email", email, "password", password + " again")))
        .isEqualTo(200);
    ageSessions(email, "identity.started", 604801);
    assertThat(a.request("GET", "/me", null, false).statusCode()).isEqualTo(401);
  }

  @Test
  void emailChangeRetainsOldAddressUntilConfirmedAndNotifiesIt() throws Exception {
    var a = new Browser();
    String old = address(), next = address();
    verified(a, old);
    login(a, old);
    assertThat(a.post("/me/email-change", Map.of("email", next))).isEqualTo(202);
    String first = token(next);
    assertThat(a.request("GET", "/me", null, false).body()).contains(old).doesNotContain(next);
    assertThat(a.request("DELETE", "/me/email-change", null, true).statusCode()).isEqualTo(204);
    assertThat(a.post("/auth/email-change-confirmations", Map.of("token", first))).isEqualTo(400);
    assertThat(a.post("/me/email-change", Map.of("email", next))).isEqualTo(202);
    String second = token(next);
    assertThat(second).isNotEqualTo(first);
    assertThat(a.post("/auth/email-change-confirmations", Map.of("token", second))).isEqualTo(200);
    assertThat(a.request("GET", "/me", null, false).statusCode()).isEqualTo(401);
    login(a, next);
    assertThat(a.request("GET", "/me", null, false).body()).contains(next).doesNotContain(old);
    assertThat(
            db.queryForObject(
                "select count(*) from identity_mail_notice where recipient=?", Integer.class, old))
        .isEqualTo(1);
    mail.deliver();
    assertThat(
            db.queryForObject(
                "select count(*) from identity_mail_notice where recipient=?", Integer.class, old))
        .isZero();
  }

  @Test
  void logoutAllCookiesGenericRecoveryAndBoundedBodies() throws Exception {
    var a = new Browser();
    var b = new Browser();
    String email = address();
    verified(a, email);
    login(a, email);
    login(b, email);
    var csrf = a.request("GET", "/auth/csrf", null, false);
    var fresh = new Browser().request("GET", "/auth/csrf", null, false);
    assertThat(fresh.headers().firstValue("Set-Cookie").orElseThrow())
        .contains("Secure", "HttpOnly", "SameSite=Lax", "Path=/")
        .doesNotContain("Domain=");
    var known = a.request("POST", "/auth/password-reset-requests", Map.of("email", email), true);
    var unknown =
        a.request("POST", "/auth/password-reset-requests", Map.of("email", address()), true);
    assertThat(unknown.statusCode()).isEqualTo(known.statusCode());
    assertThat(unknown.body()).isEqualTo(known.body());
    assertThat(
            a.post(
                "/auth/register",
                Map.of("email", email, "password", "x".repeat(66000), "eligibilityAttested", true)))
        .isEqualTo(413);
    assertThat(a.post("/auth/logout-all", null)).isEqualTo(204);
    assertThat(b.request("GET", "/me", null, false).statusCode()).isEqualTo(401);
  }

  @Test
  void abandonedRegistrationCleanupDoesNotEraseVerifiedAccounts() throws Exception {
    var pending = new Browser();
    var active = new Browser();
    String abandoned = address(), verified = address();
    register(pending, abandoned);
    login(pending, abandoned);
    verified(active, verified);
    db.update(
        "update account set created_at=now()-interval '8 days' where email_key in (?,?)",
        abandoned,
        verified);
    // Execute the exact maintenance capability under the restricted runtime role.
    try (var c = DB.createConnection("");
        var stmt = c.createStatement()) {
      stmt.execute("set role otr_runtime");
      try (var rows = stmt.executeQuery("select expire_unverified_accounts()")) {
        rows.next();
        assertThat(rows.getInt(1)).isEqualTo(1);
      }
      assertThatThrownBy(() -> stmt.executeUpdate("delete from account"))
          .isInstanceOf(java.sql.SQLException.class);
      assertThatThrownBy(() -> stmt.executeUpdate("insert into role(code) values('ADMIN')"))
          .isInstanceOf(java.sql.SQLException.class);
    }
    assertThat(
            db.queryForObject(
                "select count(*) from account where email_key=?", Integer.class, abandoned))
        .isZero();
    assertThat(
            db.queryForObject(
                "select count(*) from account where email_key=?", Integer.class, verified))
        .isEqualTo(1);
    assertThat(
            json.readTree(pending.request("GET", "/auth/session", null, false).body())
                .get("authenticated")
                .asBoolean())
        .isFalse();
    register(pending, abandoned);
  }

  @Test
  void passiveSessionChecksDoNotKeepAnIdleAccountAlive() throws Exception {
    var browser = new Browser();
    String email = address();
    verified(browser, email);
    login(browser, email);
    ageSessions(email, "identity.activityAt", 86380);
    var before =
        json.readTree(browser.request("GET", "/auth/session", null, false).body())
            .get("idleExpiresAt")
            .asText();
    Thread.sleep(1100);
    var after =
        json.readTree(browser.request("GET", "/auth/session", null, false).body())
            .get("idleExpiresAt")
            .asText();
    assertThat(after).isEqualTo(before);
    ageSessions(email, "identity.activityAt", 86401);
    assertThat(
            json.readTree(browser.request("GET", "/auth/session", null, false).body())
                .get("authenticated")
                .asBoolean())
        .isFalse();
  }
}
