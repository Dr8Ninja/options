package org.options.platform;

import java.nio.file.*;
import java.sql.*;
import java.util.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;
import tools.jackson.databind.json.JsonMapper;

/** Disposable test infrastructure. No extra authentication endpoints or seeded identities. */
public final class IdentityFixture {
  public static void main(String[] args) throws Exception {
    var db =
        new PostgreSQLContainer(
            DockerImageName.parse(
                    "postgres@sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae")
                .asCompatibleSubstituteFor("postgres"));
    var mail =
        new GenericContainer<>(
                DockerImageName.parse(
                    "axllent/mailpit@sha256:74d609a42ec279aa63c6b4622a6fa9b5408d1ad5b1d76a1c4be40a265ce0863d"))
            .withExposedPorts(1025, 8025);
    db.start();
    mail.start();
    org.flywaydb.core.Flyway.configure()
        .dataSource(db.getJdbcUrl(), db.getUsername(), db.getPassword())
        .load()
        .migrate();
    String runtimePassword = UUID.randomUUID().toString();
    try (var connection =
            DriverManager.getConnection(db.getJdbcUrl(), db.getUsername(), db.getPassword());
        var statement = connection.createStatement()) {
      statement.execute(
          "create role identity_runtime login password '"
              + runtimePassword
              + "' in role otr_runtime");
    }
    System.setProperty("spring.flyway.url", db.getJdbcUrl());
    System.setProperty("spring.flyway.user", db.getUsername());
    System.setProperty("spring.flyway.password", db.getPassword());
    System.setProperty("spring.datasource.url", db.getJdbcUrl());
    System.setProperty("spring.datasource.username", "identity_runtime");
    System.setProperty("spring.datasource.password", runtimePassword);
    System.setProperty("IDENTITY_MAIL_MODE", "LOCAL");
    System.setProperty("IDENTITY_MAIL_HOST", "127.0.0.1");
    System.setProperty("IDENTITY_MAIL_PORT", mail.getMappedPort(1025).toString());
    System.setProperty("identity.mail.poll-ms", "250");
    var app = new SpringApplicationBuilder(PlatformApplication.class).run(args);
    var root = Path.of(System.getenv("P13_RUNTIME"));
    var json = JsonMapper.builder().build();
    Files.writeString(
        root.resolve("ready.json"),
        json.writeValueAsString(
            Map.of(
                "mailOrigin",
                "http://127.0.0.1:" + mail.getMappedPort(8025),
                "operatorDsn",
                "host=127.0.0.1 port="
                    + db.getMappedPort(5432)
                    + " dbname="
                    + db.getDatabaseName()
                    + " user="
                    + db.getUsername()
                    + " password="
                    + db.getPassword())));
    Runtime.getRuntime()
        .addShutdownHook(
            new Thread(
                () -> {
                  app.close();
                  mail.stop();
                  db.stop();
                }));
    while (true) {
      Thread.sleep(100);
      var control = root.resolve("control");
      if (!Files.exists(control)) continue;
      String command = Files.readString(control);
      Files.delete(control);
      try (var connection =
              DriverManager.getConnection(db.getJdbcUrl(), db.getUsername(), db.getPassword());
          var stmt = connection.createStatement()) {
        switch (command) {
          case "expire-recovery" ->
              stmt.executeUpdate(
                  "update auth_token set created_at=now()-interval '1 hour',expires_at=now()-interval '1 minute' where purpose='RESET'");
          case "expire-challenges" ->
              stmt.executeUpdate(
                  "update auth_challenge set created_at=now()-interval '10 minutes',expires_at=now()-interval '1 minute' where consumed_at is null");
          case "expire-sessions" ->
              stmt.executeUpdate(
                  "update spring_session set last_access_time=0,expiry_time=0,max_inactive_interval=1 where principal_name is not null");
          default -> throw new IllegalArgumentException("Unknown fixture control");
        }
      }
      Files.writeString(root.resolve("ack"), command);
    }
  }
}
