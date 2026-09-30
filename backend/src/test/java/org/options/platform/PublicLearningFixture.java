package org.options.platform;

import java.nio.file.*;
import java.util.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.server.context.WebServerApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.*;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

/** P11 real-stack fixture. Test classpath only; never connects to the persistent local database. */
public class PublicLearningFixture {
  public static void main(String[] args) throws Exception {
    var postgres =
        new PostgreSQLContainer(
            DockerImageName.parse(
                    "postgres@sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae")
                .asCompatibleSubstituteFor("postgres"));
    postgres.start();
    Runtime.getRuntime().addShutdownHook(new Thread(postgres::stop));
    System.setProperty("spring.datasource.url", postgres.getJdbcUrl());
    System.setProperty("spring.datasource.username", postgres.getUsername());
    System.setProperty("spring.datasource.password", postgres.getPassword());
    var app = new SpringApplicationBuilder(PlatformApplication.class).run(args);
    var source =
        new DriverManagerDataSource(
            postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
    var db = new JdbcTemplate(source);
    var root = Path.of("..").toAbsolutePath().normalize();
    String password = UUID.randomUUID().toString();
    db.execute(
        "create role fixture_learning_import login password '"
            + password
            + "' nosuperuser nocreatedb nocreaterole");
    db.execute("grant otr_import to fixture_learning_import");
    var process =
        new ProcessBuilder(
                System.getenv()
                    .getOrDefault(
                        "CONTENT_IMPORT_PYTHON", root.resolve(".venv/bin/python").toString()),
                root.resolve("scripts/seed-public-api-test.py").toString())
            .directory(root.toFile())
            .redirectErrorStream(true);
    process
        .environment()
        .put(
            "CONTENT_IMPORT_DSN",
            "host="
                + postgres.getHost()
                + " port="
                + postgres.getMappedPort(5432)
                + " dbname="
                + postgres.getDatabaseName()
                + " user=fixture_learning_import password="
                + password);
    var seed = process.start();
    String output =
        new String(seed.getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
    if (seed.waitFor() != 0) throw new IllegalStateException(output);
    if (db.queryForObject("select count(*) from catalog_object", Integer.class) != 2851)
      throw new IllegalStateException("Canonical import incomplete");
    long[] ids = new long[2];
    new TransactionTemplate(new DataSourceTransactionManager(source))
        .execute(
            status -> {
              long actor =
                  db.queryForObject(
                      "insert into editorial_actor(actor_ref,label) values (?,'P11 TEST ONLY synthetic review') returning id",
                      Long.class,
                      UUID.randomUUID());
              ids[0] = actor;
              long publication =
                  db.queryForObject(
                      "insert into publication(public_id,label,created_by_actor_id,manifest_hash,status) values (?,'P11 TEST ONLY canonical interface fixture',?,repeat('a',64),'BUILDING') returning id",
                      Long.class,
                      UUID.randomUUID(),
                      actor);
              long lesson =
                  db.queryForObject(
                      "insert into catalog_revision(object_id,kind,revision_no,title,difficulty,priority,readiness,scope_outline,lesson_markdown,author_actor_id,format_version,renderer_version,content_hash) select r.object_id,r.kind,2,title,difficulty,priority,'reviewed_lesson',scope_outline,?,?,'restricted-markdown-v1','restricted-markdown-1',repeat('c',64) from catalog_revision r join catalog_object o on o.id=r.object_id where o.external_id='M01.02' returning id",
                      Long.class,
                      readLesson(),
                      actor);
              db.update(
                  "insert into catalog_link(owner_revision_id,owner_kind,relation,target_object_id,target_kind,ordinal,annotation) select ?,l.owner_kind,l.relation,l.target_object_id,l.target_kind,l.ordinal,l.annotation from catalog_link l join catalog_revision r on r.id=l.owner_revision_id join catalog_object o on o.id=r.object_id where o.external_id='M01.02' and r.revision_no=1",
                  lesson);
              db.update("update catalog_revision set sealed_at=now() where id=?", lesson);
              db.update(
                  "insert into review_decision(revision_id,review_type,actor_id,outcome,reviewed_hash,findings,decided_at) select id,'rights',?,'APPROVE',content_hash,'Synthetic disposable review, not content approval',now() from catalog_revision",
                  actor);
              for (String type : List.of("technical", "pedagogy", "accessibility"))
                db.update(
                    "insert into review_decision(revision_id,review_type,actor_id,outcome,reviewed_hash,findings,decided_at) select id,?,?,'APPROVE',content_hash,'Synthetic renderer review',now() from catalog_revision where id=?",
                    type,
                    actor,
                    lesson);
              db.update(
                  "insert into publication_entry(publication_id,object_id,revision_id,visibility,indexable,display_order) select ?,object_id,id,case when id=? then 'LESSON' when kind='ARCHIVE' then 'ARCHIVE' else 'MAP' end,kind in ('PROGRAM','PHASE','MODULE') or id=?,1 from catalog_revision r where revision_no=(select max(r2.revision_no) from catalog_revision r2 where r2.object_id=r.object_id)",
                  publication,
                  lesson,
                  lesson);
              long object =
                  db.queryForObject(
                      "select object_id from catalog_revision where id=?", Long.class, lesson);
              ids[1] = object;
              db.update("update catalog_route set canonical=false where object_id=?", object);
              db.update(
                  "insert into catalog_route(path_key,object_id,canonical) values ('/topics/units-renderer-example',?,true)",
                  object);
              db.update(
                  "update publication set status='SEALED',validated_at=now() where id=?",
                  publication);
              db.update(
                  "insert into active_publication(singleton,publication_id,generation) values (1,?,1)",
                  publication);
              long hidden =
                  db.queryForObject(
                      "insert into catalog_object(external_id,kind) values ('P12-HIDDEN','TOPIC') returning id",
                      Long.class);
              db.update(
                  "insert into catalog_revision(object_id,kind,revision_no,title,difficulty,readiness,scope_outline,author_actor_id,format_version,renderer_version,content_hash) values (?,'TOPIC',1,'P12DRAFTSECRET','P12PRIVATEFACET','scope_outline','P12DRAFTSECRET',?,'restricted-markdown-v1','restricted-markdown-1',repeat('e',64))",
                  hidden,
                  actor);
              db.update("update catalog_revision set sealed_at=now() where object_id=?", hidden);
              return null;
            });
    Path control = Path.of(System.getenv("P11_CONTROL_FILE"));
    Files.writeString(
        Path.of(control + ".ready"),
        "READY " + ((WebServerApplicationContext) app).getWebServer().getPort());
    while (true) {
      if (Files.exists(control)) {
        String command = Files.readString(control).strip();
        Files.delete(control);
        if (command.equals("withdraw"))
          db.update(
              "insert into content_withdrawal(object_id,reason_code,public_message,actor_id,starts_at) values (?,'TEST','Synthetic fixture withdrawal',?,now())",
              ids[1],
              ids[0]);
        if (command.equals("stop-api")) app.close();
        Files.writeString(Path.of(control + ".ack"), command);
      }
      Thread.sleep(200);
    }
  }

  private static String readLesson() {
    try {
      return Files.readString(Path.of("src/test/resources/p11/renderer.md"));
    } catch (Exception e) {
      throw new IllegalStateException(e);
    }
  }
}
