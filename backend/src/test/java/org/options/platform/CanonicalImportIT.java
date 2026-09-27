package org.options.platform;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import java.sql.DriverManager;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@Testcontainers
class CanonicalImportIT {
  @Container
  static final PostgreSQLContainer postgres =
      new PostgreSQLContainer(
          org.testcontainers.utility.DockerImageName.parse(
                  "postgres@sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae")
              .asCompatibleSubstituteFor("postgres"));

  @Test
  void canonicalImportIsAtomicRepeatableAndRecoverable() throws Exception {
    Flyway.configure()
        .dataSource(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword())
        .load()
        .migrate();
    Flyway.configure()
        .dataSource(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword())
        .schemas("roundtrip")
        .defaultSchema("roundtrip")
        .load()
        .migrate();
    String password = UUID.randomUUID().toString();
    try (var connection =
            DriverManager.getConnection(
                postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
        var statement = connection.createStatement()) {
      statement.execute(
          "create role fixture_import login password '"
              + password
              + "' nosuperuser nocreatedb nocreaterole");
      statement.execute("grant otr_import to fixture_import");
    }
    var root = Path.of("..").toAbsolutePath().normalize();
    var builder =
        new ProcessBuilder(
            System.getenv()
                .getOrDefault("CONTENT_IMPORT_PYTHON", root.resolve(".venv/bin/python").toString()),
            root.resolve("scripts/test-content-import.py").toString());
    builder.directory(root.toFile());
    builder
        .environment()
        .put(
            "CONTENT_TEST_HASH",
            new org.options.platform.identity.security.PasswordHashes()
                .encode(UUID.randomUUID().toString()));
    builder
        .environment()
        .put(
            "CONTENT_IMPORT_DSN",
            "host="
                + postgres.getHost()
                + " port="
                + postgres.getMappedPort(5432)
                + " dbname="
                + postgres.getDatabaseName()
                + " user=fixture_import password="
                + password);
    builder
        .environment()
        .put(
            "CONTENT_TEST_ADMIN_DSN",
            "host="
                + postgres.getHost()
                + " port="
                + postgres.getMappedPort(5432)
                + " dbname="
                + postgres.getDatabaseName()
                + " user="
                + postgres.getUsername()
                + " password="
                + postgres.getPassword());
    builder
        .environment()
        .put(
            "CONTENT_IMPORT_ROUNDTRIP_DSN",
            builder.environment().get("CONTENT_IMPORT_DSN")
                + " options='-c search_path=roundtrip'");
    builder.redirectErrorStream(true);
    var process = builder.start();
    var output = new StringBuilder();
    var watchdog =
        Thread.ofVirtual()
            .start(
                () -> {
                  try {
                    Thread.sleep(java.time.Duration.ofMinutes(8));
                    process.destroyForcibly();
                  } catch (InterruptedException ignored) {
                    Thread.currentThread().interrupt();
                  }
                });
    try (var reader = process.inputReader(java.nio.charset.StandardCharsets.UTF_8);
        var writer = new java.io.PrintWriter(process.getOutputStream(), true)) {
      for (String line; (line = reader.readLine()) != null; ) {
        if (line.equals("SEED_PRIVATE_ATTEMPT")) {
          seedPrivateAttempt();
          writer.println("PRIVATE_ATTEMPT_READY");
        } else {
          output.append(line).append('\n');
        }
      }
      assertThat(process.waitFor()).withFailMessage(output.toString()).isZero();
      System.out.println(output);
    } finally {
      watchdog.interrupt();
      if (process.isAlive()) process.destroyForcibly();
    }
  }

  private void seedPrivateAttempt() {
    var source =
        new org.springframework.jdbc.datasource.DriverManagerDataSource(
            postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
    var jdbc = new org.springframework.jdbc.core.JdbcTemplate(source);
    var tx =
        new org.springframework.transaction.support.TransactionTemplate(
            new org.springframework.jdbc.datasource.DataSourceTransactionManager(source));
    tx.execute(
        status -> {
          long actor =
              jdbc.queryForObject(
                  "insert into editorial_actor(actor_ref,label) values (?, 'Synthetic import retention test') returning id",
                  Long.class,
                  UUID.randomUUID());
          String email = UUID.randomUUID() + "@example.invalid";
          long account =
              jdbc.queryForObject(
                  "insert into account(public_id,email,email_key,password_hash,status,verified_at,auth_generation,eligibility_attested_at,theme) values (?,?,?,?,'ACTIVE',now(),0,now(),'system') returning id",
                  Long.class,
                  UUID.randomUUID(),
                  email,
                  email,
                  new org.options.platform.identity.security.PasswordHashes()
                      .encode(UUID.randomUUID().toString()));
          var f = new PersistenceFixtures(jdbc, actor);
          var course = f.course(1, true);
          long enrollment = f.enroll(account, course);
          long attempt = f.attempt(account, enrollment, course.quiz(), true);
          f.submit(attempt, course.quiz(), 10);
          return null;
        });
  }
}
