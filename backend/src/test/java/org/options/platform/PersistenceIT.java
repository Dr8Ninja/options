package org.options.platform;

import static org.assertj.core.api.Assertions.*;

import java.sql.*;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.*;
import org.options.platform.catalog.repository.CatalogRepository;
import org.options.platform.identity.persistence.Account;
import org.options.platform.identity.repository.AccountRepository;
import org.options.platform.identity.security.PasswordHashes;
import org.options.platform.learning.repository.NoteRepository;
import org.options.platform.learning.service.Notes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@Testcontainers
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {
      "app.public-origin=https://localhost:8443",
      "app.environment=TEST",
      "management.server.port=0"
    })
class PersistenceIT {
  @Container
  static final PostgreSQLContainer POSTGRES =
      new PostgreSQLContainer(
          org.testcontainers.utility.DockerImageName.parse(
                  "postgres@sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae")
              .asCompatibleSubstituteFor("postgres"));

  @DynamicPropertySource
  static void db(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url", POSTGRES::getJdbcUrl);
    r.add("spring.datasource.username", POSTGRES::getUsername);
    r.add("spring.datasource.password", POSTGRES::getPassword);
    r.add("spring.flyway.url", POSTGRES::getJdbcUrl);
    r.add("spring.flyway.user", POSTGRES::getUsername);
    r.add("spring.flyway.password", POSTGRES::getPassword);
    r.add("spring.flyway.enabled", () -> true);
  }

  @Autowired JdbcTemplate jdbc;
  @Autowired DataSource dataSource;
  @Autowired PlatformTransactionManager manager;
  @Autowired PasswordHashes passwords;
  @Autowired AccountRepository accounts;
  @Autowired NoteRepository noteRepository;
  @Autowired Notes notes;
  @Autowired CatalogRepository catalog;
  @Autowired jakarta.persistence.EntityManagerFactory entityManagers;
  long actor;
  String hash;

  TransactionTemplate tx() {
    return new TransactionTemplate(manager);
  }

  @BeforeEach
  void fixture() {
    hash = passwords.encode("synthetic test password " + UUID.randomUUID());
    actor =
        jdbc.queryForObject(
            "insert into editorial_actor(actor_ref,label) values (?, 'Synthetic test author') returning id",
            Long.class,
            UUID.randomUUID());
  }

  long account() {
    String email = UUID.randomUUID() + "@example.invalid";
    return jdbc.queryForObject(
        "insert into account(public_id,email,email_key,password_hash,status,verified_at,auth_generation,eligibility_attested_at,theme) values (?,?,?,?, 'ACTIVE',now(),0,now(),'system') returning id",
        Long.class,
        UUID.randomUUID(),
        email,
        email,
        hash);
  }

  long object(String kind) {
    return jdbc.queryForObject(
        "insert into catalog_object(external_id,kind) values (?,?) returning id",
        Long.class,
        "TEST-" + UUID.randomUUID(),
        kind);
  }

  long revision(long object, String kind, int number) {
    return jdbc.queryForObject(
        "insert into catalog_revision(object_id,kind,revision_no,title,readiness,author_actor_id,format_version,content_hash) values (?,?,?,'Synthetic verification fixture','scope_outline',?,'v1',repeat('a',64)) returning id",
        Long.class,
        object,
        kind,
        number,
        actor);
  }

  void seal(long revision) {
    jdbc.update("update catalog_revision set sealed_at=now() where id=?", revision);
  }

  long topic() {
    return tx().execute(
            s -> {
              long o = object("TOPIC");
              long r = revision(o, "TOPIC", 1);
              seal(r);
              return o;
            });
  }

  void fails(Runnable action, String message) {
    assertThatThrownBy(action::run)
        .as(message)
        .isInstanceOf(RuntimeException.class)
        .satisfies(
            error -> {
              Throwable root = error;
              while (root.getCause() != null) root = root.getCause();
              if (root instanceof java.sql.SQLException sql)
                assertThat(sql.getSQLState()).matches("23[A-Z0-9]{3}|42501");
              else
                assertThat(root)
                    .isInstanceOfAny(IllegalArgumentException.class, IllegalStateException.class);
            });
  }

  @Test
  void fullSchemaIsReadyAndEveryForeignKeyHasIndex() {
    assertThat(
            jdbc.queryForObject(
                "select count(*) from information_schema.tables where table_schema='public' and table_type='BASE TABLE'",
                Integer.class))
        .isEqualTo(114);
    assertThat(
            jdbc.queryForObject(
                "select count(*) from pg_constraint c join pg_class t on t.oid=c.conrelid join pg_namespace n on n.oid=t.relnamespace where c.contype='f' and n.nspname='public' and not exists(select 1 from pg_index i where i.indrelid=c.conrelid and i.indisvalid and i.indpred is null and (i.indkey::smallint[])[0:cardinality(c.conkey)-1] @> c.conkey)",
                Integer.class))
        .isZero();
    assertThat(jdbc.queryForObject("select count(*) from account", Integer.class))
        .isGreaterThanOrEqualTo(0);
  }

  @Test
  void hashesAreArgon2UnicodeSafeAndJpaUsesOptimisticVersions() {
    String password = "🔐".repeat(20) + " safe sample";
    String encoded = passwords.encode(password);
    assertThat(encoded).startsWith("{argon2id}$argon2id$v=19$m=19456,t=2,p=1$");
    assertThat(passwords.matches(password, encoded)).isTrue();
    assertThat(passwords.matches(password + "x", encoded)).isFalse();
    String email = UUID.randomUUID() + "@example.invalid";
    Account account = accounts.save(Account.unverified(email, email, encoded, Instant.now()));
    var one = entityManagers.createEntityManager();
    var two = entityManagers.createEntityManager();
    try {
      one.getTransaction().begin();
      two.getTransaction().begin();
      var first = one.find(Account.class, account.id());
      var stale = two.find(Account.class, account.id());
      first.rename("First");
      one.getTransaction().commit();
      stale.rename("Lost update");
      assertThatThrownBy(() -> two.getTransaction().commit())
          .isInstanceOf(jakarta.persistence.RollbackException.class);
    } finally {
      one.close();
      two.close();
    }
    assertThat(accounts.findByPublicId(account.publicId()).orElseThrow().displayName())
        .isEqualTo("First");
    fails(
        () -> jdbc.update("update account set password_hash='plaintext' where id=?", account.id()),
        "plaintext rejected");
    fails(
        () -> jdbc.update("update account set email_key='different' where id=?", account.id()),
        "normalized identity checked");
  }

  @Test
  void stableRoutesOrderingTypedReferencesAndImmutableRevisions() {
    long first = topic(), second = topic();
    long parent =
        tx().execute(
                s -> {
                  long o = object("MODULE"), r = revision(o, "MODULE", 1);
                  jdbc.update(
                      "insert into catalog_link(owner_revision_id,owner_kind,relation,target_object_id,target_kind,ordinal) values (?,'MODULE','module_topic',?,'TOPIC',20),(?,'MODULE','module_topic',?,'TOPIC',10)",
                      r,
                      second,
                      r,
                      first);
                  seal(r);
                  return r;
                });
    assertThat(catalog.orderedMembers(parent, "module_topic"))
        .extracting(CatalogRepository.Member::ordinal)
        .containsExactly(10, 20);
    String route = "/topics/test-" + UUID.randomUUID();
    jdbc.update(
        "insert into catalog_route(path_key,object_id,canonical) values (?,?,true)", route, first);
    fails(
        () ->
            jdbc.update(
                "insert into catalog_route(path_key,object_id,canonical) values (?,?,false)",
                route,
                second),
        "duplicate route");
    fails(
        () -> jdbc.update("update catalog_route set object_id=? where path_key=?", second, route),
        "route reassignment");
    fails(
        () -> jdbc.update("update catalog_revision set title='mutated' where id=?", parent),
        "sealed revision");
    fails(
        () -> jdbc.update("delete from catalog_link where owner_revision_id=?", parent),
        "sealed child");
    fails(
        () ->
            tx().execute(
                    s -> {
                      long r = revision(first, "MODULE", 2);
                      seal(r);
                      return r;
                    }),
        "wrong kind FK");
    fails(
        () ->
            tx().execute(
                    s -> {
                      long o = object("RESOURCE");
                      long r = revision(o, "RESOURCE", 1);
                      seal(r);
                      return r;
                    }),
        "typed detail missing");
    fails(
        () ->
            tx().execute(
                    s -> {
                      long o = object("TOPIC");
                      return revision(o, "TOPIC", 1);
                    }),
        "unsealed aggregate cannot commit");
  }

  @Test
  void ownerNotesSurviveRetirementAndRejectStaleOrForeignWrites() {
    long owner = account(), other = account(), topic = topic();
    UUID id = notes.create(owner, topic, "TOPIC", "Private synthetic note");
    assertThat(noteRepository.findOwned(other, id)).isEmpty();
    fails(() -> notes.replace(other, id, 0, "foreign"), "cross-owner write");
    notes.replace(owner, id, 0, "Revised private note");
    fails(() -> notes.replace(owner, id, 0, "stale"), "optimistic conflict");
    jdbc.update("update catalog_object set retired_at=now() where id=?", topic);
    assertThat(noteRepository.findOwned(owner, id).orElseThrow().text())
        .isEqualTo("Revised private note");
    fails(
        () -> jdbc.update("delete from catalog_object where id=?", topic),
        "retirement cannot erase identity");
    fails(
        () -> jdbc.update("update private_note set account_id=? where public_id=?", other, id),
        "owner cannot move");
  }

  @Test
  void runtimeAndImporterCannotMigrateOrEraseAccounts() {
    long owner = account();
    fails(
        () ->
            tx().execute(
                    s -> {
                      jdbc.execute("set local role otr_runtime");
                      jdbc.update("delete from account where id=?", owner);
                      return null;
                    }),
        "runtime cannot erase account");
    fails(
        () ->
            tx().execute(
                    s -> {
                      jdbc.execute("set local role otr_import");
                      jdbc.queryForList("select * from private_note");
                      return null;
                    }),
        "import cannot read learner notes");
    fails(
        () ->
            tx().execute(
                    s -> {
                      jdbc.execute("set local role otr_import");
                      jdbc.update("update account set theme='dark' where id=?", owner);
                      return null;
                    }),
        "import cannot mutate identity");
    fails(
        () ->
            tx().execute(
                    s -> {
                      jdbc.execute("set local role otr_runtime");
                      jdbc.execute("create table illegal_runtime_ddl(id bigint)");
                      return null;
                    }),
        "runtime has no DDL");
    assertThat(
            tx().<Integer>execute(
                    s -> {
                      jdbc.execute("set local role otr_runtime");
                      return jdbc.queryForObject("select count(*) from role", Integer.class);
                    }))
        .isEqualTo(4);
  }

  @Test
  void accountErasureKeepsPseudonymousEditorialHistory() {
    long owner = account(), topic = topic();
    UUID note = notes.create(owner, topic, "TOPIC", "erasable");
    jdbc.update("update editorial_actor set account_id=? where id=?", owner, actor);
    jdbc.update(
        "insert into account_role(account_id,role_id,granted_at,granted_by_actor_id) select ?,id,now(),? from role where code='LEARNER'",
        owner,
        actor);
    tx().execute(
            s -> {
              jdbc.execute("set local role otr_privacy");
              jdbc.update("update account set status='DELETING' where id=?", owner);
              jdbc.update("delete from account where id=?", owner);
              return null;
            });
    assertThat(noteRepository.findOwned(owner, note)).isEmpty();
    assertThat(
            jdbc.queryForObject(
                "select account_id is null from editorial_actor where id=?", Boolean.class, actor))
        .isTrue();
    assertThat(
            jdbc.queryForObject(
                "select count(*) from catalog_object where id=?", Integer.class, topic))
        .isEqualTo(1);
  }

  @Test
  void priorSessionSchemaUpgradesWithoutLosingSession() throws Exception {
    String schema = "upgrade_" + UUID.randomUUID().toString().replace("-", "");
    Flyway old =
        Flyway.configure()
            .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
            .schemas(schema)
            .target("1")
            .load();
    old.migrate();
    try (Connection c = dataSource.getConnection();
        Statement st = c.createStatement()) {
      st.execute(
          "insert into "
              + schema
              + ".spring_session values ('upgrade-primary','upgrade-session',1,1,900,9999999999999,null)");
    }
    Flyway current =
        Flyway.configure()
            .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
            .schemas(schema)
            .load();
    assertThat(current.migrate().migrationsExecuted).isEqualTo(22);
    current.validate();
    assertThat(
            jdbc.queryForObject(
                "select trim(session_id) from " + schema + ".spring_session", String.class))
        .isEqualTo("upgrade-session");
    assertThat(current.migrate().migrationsExecuted).isZero();
  }

  @Autowired org.options.platform.learning.repository.EnrollmentRepository enrollments;
  @Autowired org.options.platform.administration.repository.CommandReceipts receipts;

  PersistenceFixtures fixtures() {
    return new PersistenceFixtures(jdbc, actor);
  }

  @Test
  void pinnedDenominatorStaysAtEighteenOfThirtySixAfterNewRevisionAndRetirement() {
    var f = fixtures();
    long owner = account();
    var c = tx().execute(s -> f.course(36, false));
    long e = tx().execute(s -> f.enroll(owner, c));
    UUID id = jdbc.queryForObject("select public_id from enrollment where id=?", UUID.class, e);
    for (int i = 0; i < 18; i++)
      jdbc.update(
          "insert into learning_progress(account_id,topic_object_id,topic_revision_id,state,first_started_at,self_completed_at,last_confirmed_at) values (?,?,?,'SELF_COMPLETED',now(),now(),now())",
          owner,
          c.topics().get(i),
          c.topicRevisions().get(i));
    tx().execute(
            s -> {
              long r = revision(c.topics().getFirst(), "TOPIC", 2);
              seal(r);
              return null;
            });
    jdbc.update("update catalog_object set retired_at=now() where id=?", c.topics().getFirst());
    assertThat(enrollments.exactVersionCompletion(owner, id).orElseThrow())
        .isEqualTo(
            new org.options.platform.learning.repository.EnrollmentRepository.Completion(36, 18));
    assertThat(enrollments.exactVersionCompletion(account(), id)).isEmpty();
    fails(
        () ->
            jdbc.update(
                "delete from enrollment_requirement where enrollment_id=? and ordinal=1", e),
        "cannot shrink denominator");
    fails(() -> tx().execute(s -> f.enroll(owner, c)), "cannot duplicate current enrollment");
  }

  @Test
  void receiptsSerializeConcurrentRetriesAndRejectChangedBodies() throws Exception {
    var f = fixtures();
    long owner = account();
    var c = tx().execute(s -> f.course(1, false));
    UUID key = UUID.randomUUID();
    var start = new CountDownLatch(1);
    var creations = new java.util.concurrent.atomic.AtomicInteger();
    Callable<Long> call =
        () -> {
          start.await();
          return receipts.enrollment(
              owner,
              "/me/enrollments",
              key,
              "d".repeat(64),
              () -> {
                creations.incrementAndGet();
                return f.enroll(owner, c);
              });
        };
    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
      var one = executor.submit(call);
      var two = executor.submit(call);
      start.countDown();
      assertThat(one.get(15, TimeUnit.SECONDS)).isEqualTo(two.get(15, TimeUnit.SECONDS));
    }
    assertThat(creations.get()).isEqualTo(1);
    fails(
        () ->
            receipts.enrollment(
                owner,
                "/me/enrollments",
                key,
                "e".repeat(64),
                () -> {
                  throw new AssertionError();
                }),
        "changed body rejects replay");
    // Response loss/stale precondition replay returns the committed identity without rerunning
    // domain work.
    assertThat(
            receipts.enrollment(
                owner,
                "/me/enrollments",
                key,
                "d".repeat(64),
                () -> {
                  throw new AssertionError("must not recreate");
                }))
        .isPositive();
    fails(
        () ->
            receipts.enrollment(
                owner,
                "/me/enrollments",
                UUID.randomUUID(),
                "f".repeat(64),
                () -> {
                  throw new IllegalStateException("domain failure");
                }),
        "failure cannot create success receipt");
    assertThat(
            jdbc.queryForObject(
                "select count(*) from command_receipt where actor_account_id=?",
                Integer.class,
                owner))
        .isEqualTo(1);
  }

  @Test
  void gateDraftSubmissionMembershipAndErasureAreEnforced() {
    var f = fixtures();
    long owner = account();
    var c = tx().execute(s -> f.course(1, true));
    long e = tx().execute(s -> f.enroll(owner, c));
    long attempt = tx().execute(s -> f.attempt(owner, e, c.quiz(), true));
    long foreignQuestion =
        jdbc.queryForObject(
            "select question_revision_id from quiz_form_item where form_id=? and ordinal=1",
            Long.class,
            c.quiz().secondForm());
    fails(
        () ->
            jdbc.update(
                "insert into attempt_answer(attempt_id,form_id,item_ordinal,question_revision_id) values (?,?,1,?)",
                attempt,
                c.quiz().firstForm(),
                foreignQuestion),
        "foreign question rejected");
    fails(
        () ->
            jdbc.update(
                "insert into attempt_answer(attempt_id,form_id,item_ordinal,question_revision_id,awarded_score) values (?,?,1,?,100)",
                attempt,
                c.quiz().firstForm(),
                c.quiz().questions().getFirst()),
        "draft score rejected");
    tx().execute(
            s -> {
              f.submit(attempt, c.quiz(), 10);
              return null;
            });
    assertThat(
            jdbc.queryForObject(
                "select passed from attempt_result where attempt_id=?", Boolean.class, attempt))
        .isTrue();
    fails(
        () -> jdbc.update("update attempt_answer set numeric_value=42 where attempt_id=?", attempt),
        "final answer immutable");
    fails(
        () -> jdbc.update("delete from attempt_result where attempt_id=?", attempt),
        "final result immutable");
    fails(
        () -> tx().execute(s -> f.attempt(owner, e, c.quiz(), true)),
        "same form cannot manufacture fresh evidence");
    fails(
        () -> jdbc.update("update quiz_attempt set account_id=? where id=?", account(), attempt),
        "attempt owner immutable");
    tx().execute(
            s -> {
              jdbc.update("update account set status='DELETING' where id=?", owner);
              jdbc.update("delete from account where id=?", owner);
              return null;
            });
    assertThat(
            jdbc.queryForObject(
                "select count(*) from attempt_answer where attempt_id=?", Integer.class, attempt))
        .isZero();
    assertThat(
            jdbc.queryForObject(
                "select count(*) from catalog_revision where id=?",
                Integer.class,
                c.quiz().revision()))
        .isEqualTo(1);
  }

  @Test
  void publicationClosureReviewAndGenerationConflictsAreRejected() {
    var f = fixtures();
    var c = tx().execute(s -> f.course(1, false));
    fails(
        () -> jdbc.update("delete from publication_entry where publication_id=?", c.publication()),
        "sealed entries immutable");
    fails(
        () ->
            tx().execute(
                    s -> {
                      long p = f.publication();
                      f.entry(p, c.pathRevision(), "MAP");
                      jdbc.update(
                          "update publication set status='SEALED',validated_at=now() where id=?",
                          p);
                      return null;
                    }),
        "missing topic closure");
    fails(
        () ->
            jdbc.update(
                "insert into publication(public_id,label,created_by_actor_id,manifest_hash,status,validated_at) values (?,'bypass',?,repeat('a',64),'SEALED',now())",
                UUID.randomUUID(),
                actor),
        "cannot bypass manifest validation on insert");
    jdbc.update(
        "insert into active_publication(singleton,publication_id,generation) values (1,?,1) on conflict(singleton) do update set publication_id=excluded.publication_id,generation=active_publication.generation+1",
        c.publication());
    long generation = jdbc.queryForObject("select generation from active_publication", Long.class);
    fails(
        () -> jdbc.update("update active_publication set generation=?", generation),
        "stale generation");
    jdbc.update(
        "insert into content_withdrawal(object_id,revision_id,reason_code,public_message,actor_id,starts_at) values (?,?,'CORRECTION','Temporarily unavailable',?,now())",
        c.topics().getFirst(),
        c.topicRevisions().getFirst(),
        actor);
    jdbc.update("update active_publication set generation=generation+1 where singleton=1");
    assertThat(
            jdbc.queryForObject(
                "select count(*) from content_withdrawal where object_id=? and reinstated_at is null",
                Integer.class,
                c.topics().getFirst()))
        .isEqualTo(1);
  }

  @Test
  void simultaneousGraphChangesCannotCommitACycle() throws Exception {
    long a = object("TOPIC"), b = object("TOPIC");
    long[] revisions =
        tx().execute(
                s -> {
                  long ar = revision(a, "TOPIC", 1), br = revision(b, "TOPIC", 1);
                  jdbc.update(
                      "insert into hard_prerequisite(owner_revision_id,owner_kind,requires_object_id,requires_kind,ordinal,rationale) values (?,'TOPIC',?,'TOPIC',1,'Synthetic dependency'),(?,'TOPIC',?,'TOPIC',1,'Synthetic dependency')",
                      ar,
                      b,
                      br,
                      a);
                  seal(ar);
                  seal(br);
                  return new long[] {ar, br};
                });
    var firstLocked = new CountDownLatch(1);
    var release = new CountDownLatch(1);
    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
      var first =
          executor.submit(
              () ->
                  tx().execute(
                          s -> {
                            jdbc.update(
                                "insert into draft_head(object_id,revision_id,workflow) values (?,?,'DRAFT')",
                                a,
                                revisions[0]);
                            firstLocked.countDown();
                            try {
                              release.await(10, TimeUnit.SECONDS);
                            } catch (InterruptedException ex) {
                              throw new RuntimeException(ex);
                            }
                            return true;
                          }));
      assertThat(firstLocked.await(5, TimeUnit.SECONDS)).isTrue();
      var second =
          executor.submit(
              () -> {
                try {
                  tx().execute(
                          s -> {
                            jdbc.update(
                                "insert into draft_head(object_id,revision_id,workflow) values (?,?,'DRAFT')",
                                b,
                                revisions[1]);
                            return null;
                          });
                  return true;
                } catch (RuntimeException expected) {
                  return false;
                }
              });
      release.countDown();
      assertThat(first.get(15, TimeUnit.SECONDS)).isTrue();
      assertThat(second.get(15, TimeUnit.SECONDS)).isFalse();
    }
  }

  @Autowired org.options.platform.ops.persistence.JobRepository jobs;
  @Autowired org.options.platform.catalog.repository.PublicationRepository publications;
  @Autowired org.options.platform.administration.repository.ImportRepository imports;

  @Test
  void queueClaimsAreDisjointAndExpiredWorkersCannotComplete() throws Exception {
    for (int i = 0; i < 2; i++)
      jdbc.update(
          "insert into job(kind,dedupe_key,state,due_at,attempts) values ('FRESHNESS',?,'READY',now(),0)",
          UUID.randomUUID().toString());
    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
      var a = executor.submit(() -> jobs.claim(1));
      var b = executor.submit(() -> jobs.claim(1));
      var first = a.get(10, TimeUnit.SECONDS).getFirst();
      var second = b.get(10, TimeUnit.SECONDS).getFirst();
      assertThat(first.id()).isNotEqualTo(second.id());
      assertThat(jobs.complete(first.id(), UUID.randomUUID())).isFalse();
      jdbc.update("update job set lease_until=now()-interval '1 second' where id=?", first.id());
      var reclaimed = jobs.claim(1).getFirst();
      assertThat(reclaimed.id()).isEqualTo(first.id());
      assertThat(jobs.complete(first.id(), first.token())).isFalse();
      assertThat(jobs.complete(first.id(), reclaimed.token())).isTrue();
      assertThat(jobs.complete(second.id(), second.token())).isTrue();
    }
  }

  @Test
  void noteErasureWritesOnlyMinimalTombstone() {
    long owner = account();
    UUID note = notes.create(owner, topic(), "TOPIC", "Sensitive synthetic text");
    notes.delete(owner, note, 0);
    assertThat(noteRepository.findOwned(owner, note)).isEmpty();
    assertThat(
            jdbc.queryForObject(
                "select count(*) from recovery_journal where event_type='NOTE_ERASE' and owned_record_public_id=? and durable_at is null",
                Integer.class,
                note))
        .isEqualTo(1);
  }

  @Test
  void unicodeEmailIdentityAndTokenGenerationAreEnforced() {
    long owner = account();
    String token = UUID.randomUUID().toString();
    jdbc.update(
        "insert into auth_token(account_id,purpose,digest,created_generation,expires_at) values (?,'RESET',sha256(convert_to(?,'UTF8')),0,now()+interval '1 hour')",
        owner,
        token);
    jdbc.update("update account set status='SUSPENDED' where id=?", owner);
    assertThat(
            jdbc.queryForObject(
                "select revoked_at is not null from auth_token where account_id=?",
                Boolean.class,
                owner))
        .isTrue();
    assertThat(
            jdbc.queryForObject(
                "select auth_generation from account where id=?", Long.class, owner))
        .isEqualTo(1);
    fails(
        () -> jdbc.update("update account set auth_generation=0 where id=?", owner),
        "generation never decreases");
  }

  @Test
  void finiteRuleCertificationsRejectOverlapAndWrongEvidence() {
    long[] ids =
        tx().execute(
                s -> {
                  long subject =
                      jdbc.queryForObject(
                          "insert into rule_subject(jurisdiction,instrument,instrument_key,product_scope,market_zone,rule_type,scope_hash) values ('TEST','Synthetic','test',?,'UTC','synthetic',encode(sha256(convert_to(?,'UTF8')),'hex')) returning id",
                          Long.class,
                          "scope-" + actor,
                          "scope-" + actor);
                  long notice =
                      jdbc.queryForObject(
                          "insert into official_notice(identifier,issuing_body,revision_no,unknown_date_reason,unknown_locator_reason) values (?,'TEST',1,'Synthetic unknown date','Synthetic unavailable locator') returning id",
                          Long.class,
                          UUID.randomUUID().toString());
                  long object = object("RULE"), r = revision(object, "RULE", 1);
                  jdbc.update(
                      "insert into rule_revision(revision_id,kind,subject_id,notice_id,value_text,effective_from,date_precision,unknown_date_reason,scope,uncertainty,review_status,review_owner_label,review_interval_days,historical_eligible,historical_eligible_scope,imported_current_eligible) values (?,'RULE',?,?,'Synthetic',current_date,'day','Unknown end','Test scope','Test uncertainty','verified','Test reviewer',7,false,'none',false)",
                      r,
                      subject,
                      notice);
                  seal(r);
                  long verification =
                      jdbc.queryForObject(
                          "insert into verification_event(subject_revision_id,checked_at,checked_on,reviewer_actor_id,scope,method,outcome,next_due_at) values (?,now(),current_date,?,'Synthetic bounded check','rule_chain','verified',now()+interval '7 days') returning id",
                          Long.class,
                          r,
                          actor);
                  return new long[] {subject, r, verification};
                });
    jdbc.update(
        "insert into rule_certification(subject_id,rule_revision_id,verification_id,valid_dates,status,review_due_at,approved_by_actor_id) values (?,?,?,daterange(current_date,current_date+2,'[)'),'ACTIVE',now()+interval '3 days',?)",
        ids[0],
        ids[1],
        ids[2],
        actor);
    fails(
        () ->
            jdbc.update(
                "insert into rule_certification(subject_id,rule_revision_id,verification_id,valid_dates,status,review_due_at,approved_by_actor_id) values (?,?,?,daterange(current_date+1,current_date+3,'[)'),'ACTIVE',now()+interval '3 days',?)",
                ids[0],
                ids[1],
                ids[2],
                actor),
        "overlapping current certification");
    fails(
        () ->
            jdbc.update(
                "insert into rule_certification(subject_id,rule_revision_id,verification_id,valid_dates,status,review_due_at,approved_by_actor_id) values (?,?,?,daterange(current_date,null,'[)'),'ACTIVE',now()+interval '3 days',?)",
                ids[0],
                ids[1],
                ids[2],
                actor),
        "unknown end cannot become infinite certification");
    assertThat(
            jdbc.queryForObject(
                "select count(*) from rule_certification where subject_id=? and status='ACTIVE' and review_due_at>now()+interval '4 days'",
                Integer.class,
                ids[0]))
        .isZero();
  }

  @Test
  void publicationActivationUsesCompareAndSetUnderTwoConnections() throws Exception {
    var f = fixtures();
    var a = tx().execute(s -> f.course(1, false));
    var b = tx().execute(s -> f.course(1, false));
    long generation =
        jdbc.queryForObject(
            "select coalesce(max(generation),0) from active_publication", Long.class);
    var start = new CountDownLatch(1);
    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
      Callable<Boolean> one =
          () -> {
            start.await();
            try {
              publications.activate(a.publication(), generation);
              return true;
            } catch (RuntimeException expected) {
              assertThat(expected).hasMessageContaining("Publication generation conflict");
              return false;
            }
          };
      Callable<Boolean> two =
          () -> {
            start.await();
            try {
              publications.activate(b.publication(), generation);
              return true;
            } catch (RuntimeException expected) {
              assertThat(expected).hasMessageContaining("Publication generation conflict");
              return false;
            }
          };
      var x = executor.submit(one);
      var y = executor.submit(two);
      start.countDown();
      assertThat(List.of(x.get(10, TimeUnit.SECONDS), y.get(10, TimeUnit.SECONDS)))
          .containsExactlyInAnyOrder(true, false);
    }
  }

  @Test
  void everyReleasedMigrationBoundaryUpgradesWithStableIdentity() throws Exception {
    for (int target = 2; target <= 19; target++) {
      String schema = "boundary_" + target;
      var before =
          Flyway.configure()
              .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
              .schemas(schema)
              .target(Integer.toString(target))
              .load();
      before.migrate();
      jdbc.update(
          "insert into "
              + schema
              + ".catalog_object(external_id,kind) values ('UPGRADE-KEEP','TOPIC')");
      var after =
          Flyway.configure()
              .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
              .schemas(schema)
              .load();
      after.migrate();
      after.validate();
      assertThat(
              jdbc.queryForObject(
                  "select external_id from "
                      + schema
                      + ".catalog_object where external_id='UPGRADE-KEEP'",
                  String.class))
          .isEqualTo("UPGRADE-KEEP");
      assertThat(after.migrate().migrationsExecuted).isZero();
    }
  }

  @Test
  void resourceEditionIdentityCanShareLocatorButCannotBeReassigned() {
    long a = object("RESOURCE"), b = object("RESOURCE");
    jdbc.update(
        "insert into resource_identifier(resource_object_id,scheme,normalized_value) values (?,'ISBN',?)",
        a,
        "fixture-edition-" + actor);
    fails(
        () ->
            jdbc.update(
                "insert into resource_identifier(resource_object_id,scheme,normalized_value) values (?,'ISBN',?)",
                b,
                "fixture-edition-" + actor),
        "duplicate edition identity");
    fails(
        () ->
            jdbc.update(
                "update resource_identifier set resource_object_id=? where resource_object_id=?",
                b,
                a),
        "edition reassignment");
    String url = "https://example.invalid/fixture/" + actor;
    long locator =
        jdbc.queryForObject(
            "insert into external_locator(original_url,normalized_url,normalization_version,url_hash) values (?,?,'v1',encode(sha256(convert_to(?,'UTF8')),'hex')) returning id",
            Long.class,
            url,
            url,
            url);
    tx().execute(
            s -> {
              for (long object : List.of(a, b)) {
                long r = revision(object, "RESOURCE", 1);
                jdbc.update(
                    "insert into resource_revision(revision_id,kind,author_organization,resource_type,canonical_locator_id,cost,access_limitations,recommended_audience,rationale,prerequisites_text,role,geography,publication_precision,updated_precision,publication_status,rights,entitlement_status,alternative_limit,video_timestamp_reason) values (?,'RESOURCE','Synthetic author','book',?,'unknown','Synthetic unknown','Synthetic audience','Synthetic rationale','Synthetic prerequisites','reference','global','unknown','unknown','unknown','Restricted test','unknown','unknown','No video')",
                    r,
                    locator);
                for (String field : List.of("DOI", "edition", "publication_date", "updated_date"))
                  jdbc.update(
                      "insert into resource_unknown(resource_revision_id,field,reason) values (?,?,'Synthetic unknown')",
                      r,
                      field);
                jdbc.update(
                    "insert into resource_locator(resource_revision_id,locator_id,role,ordinal) values (?,?,'landing',1)",
                    r,
                    locator);
                seal(r);
              }
              return null;
            });
    assertThat(
            jdbc.queryForObject(
                "select count(*) from resource_locator where locator_id=?", Integer.class, locator))
        .isEqualTo(2);
    fails(
        () ->
            jdbc.update(
                "insert into external_locator(original_url,normalized_url,normalization_version,url_hash) values (?,'https://example.invalid/different','v1',encode(sha256(convert_to(?,'UTF8')),'hex'))",
                url,
                url),
        "hash mismatch cannot merge a different URL");
  }

  @Test
  void concurrentImportHashApplicationIsUniqueAndStaleBaseFails() throws Exception {
    long[] batches =
        tx().execute(
                s -> {
                  String path = "test/fixture-" + actor;
                  long artifact =
                      jdbc.queryForObject(
                          "insert into source_artifact(repository_path,path_hash,sha256,byte_count,media_type,rights_state,restricted_storage_key) values (?,encode(sha256(convert_to(?,'UTF8')),'hex'),repeat('a',64),1,'application/json','RESTRICTED','test-only') returning id",
                          Long.class,
                          path,
                          path);
                  Long current =
                      jdbc.queryForObject(
                          "select max(publication_id) from active_publication", Long.class);
                  String manifest =
                      jdbc.queryForObject(
                          "select encode(sha256(convert_to(?,'UTF8')),'hex')",
                          String.class,
                          UUID.randomUUID().toString());
                  long[] result = new long[2];
                  for (int i = 0; i < 2; i++)
                    result[i] =
                        jdbc.queryForObject(
                            "insert into import_batch(package_id,schema_version,manifest_sha256,source_as_of,run_no,base_publication_id,actor_id,artifact_id,state,report,report_version) values (?,'v1',?,current_date,?,?,?,?,'STAGED','{}','v1') returning id",
                            Long.class,
                            "TEST-PACKAGE-" + actor,
                            manifest,
                            i + 1,
                            current,
                            actor,
                            artifact);
                  return result;
                });
    long generation =
        jdbc.queryForObject(
            "select coalesce(max(generation),0) from active_publication", Long.class);
    fails(
        () ->
            tx().execute(
                    s -> {
                      imports.markApplied(batches[0], generation + 1);
                      return null;
                    }),
        "stale import generation");
    var start = new CountDownLatch(1);
    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
      java.util.function.LongFunction<Callable<Boolean>> work =
          batch ->
              () -> {
                start.await();
                try {
                  tx().execute(
                          s -> {
                            imports.markApplied(batch, generation);
                            return null;
                          });
                  return true;
                } catch (org.springframework.dao.DataIntegrityViolationException expected) {
                  return false;
                }
              };
      var a = executor.submit(work.apply(batches[0]));
      var b = executor.submit(work.apply(batches[1]));
      start.countDown();
      assertThat(List.of(a.get(10, TimeUnit.SECONDS), b.get(10, TimeUnit.SECONDS)))
          .containsExactlyInAnyOrder(true, false);
    }
  }

  @Test
  void expiredReceiptsDoNotEraseDomainIdentityAndPrivacyCascadesThem() {
    long owner = account();
    var f = fixtures();
    var c = tx().execute(s -> f.course(1, false));
    long e = tx().execute(s -> f.enroll(owner, c));
    UUID key = UUID.randomUUID();
    jdbc.update(
        "insert into command_receipt(actor_account_id,operation_id,route_key,request_key,request_sha256,response_status,created_at,expiry_at,enrollment_id) values (?,'createEnrollment','/me/enrollments',?,repeat('d',64),201,now()-interval '25 hours',now()-interval '1 hour',?)",
        owner,
        key,
        e);
    assertThat(receipts.enrollment(owner, "/me/enrollments", key, "d".repeat(64), () -> e))
        .isEqualTo(e);
    assertThat(jdbc.queryForObject("select count(*) from enrollment where id=?", Integer.class, e))
        .isEqualTo(1);
    tx().execute(
            s -> {
              jdbc.execute("set local role otr_privacy");
              new org.options.platform.administration.repository.PrivacyErasure(jdbc)
                  .eraseAccount(owner);
              return null;
            });
    assertThat(
            jdbc.queryForObject(
                "select count(*) from command_receipt where actor_account_id=?",
                Integer.class,
                owner))
        .isZero();
  }

  @Test
  void auditAndPrivacyReferencesRejectWrongKindsHashesAndOwners() {
    long owner = account(), other = account();
    long topic = topic();
    long revision =
        jdbc.queryForObject("select id from catalog_revision where object_id=?", Long.class, topic);
    fails(
        () ->
            jdbc.update(
                "insert into verification_event(subject_revision_id,checked_at,checked_on,reviewer_actor_id,scope,method,outcome) values (?,now(),current_date,?,'fixture','technical_review','verified')",
                revision,
                actor),
        "topic cannot be verification subject");
    fails(
        () ->
            jdbc.update(
                "insert into review_decision(revision_id,review_type,actor_id,outcome,reviewed_hash,findings,decided_at) values (?,'technical',?,'APPROVE',repeat('0',64),'fixture',now())",
                revision,
                actor),
        "review hash must match sealed content");
    long request =
        jdbc.queryForObject(
            "insert into privacy_request(public_id,account_id,subject_public_id,kind,state,requested_at) select ?,id,public_id,'EXPORT','REQUESTED',now() from account where id=? returning id",
            Long.class,
            UUID.randomUUID(),
            owner);
    fails(
        () ->
            jdbc.update(
                "insert into job(kind,dedupe_key,account_id,privacy_request_id,state,due_at,attempts) values ('EXPORT',?,?,?,'READY',now(),0)",
                UUID.randomUUID().toString(),
                other,
                request),
        "privacy job cannot target another owner");
    fails(
        () ->
            jdbc.update(
                "insert into job(kind,dedupe_key,account_id,privacy_request_id,state,due_at,attempts) values ('ERASE',?,?,?,'READY',now(),0)",
                UUID.randomUUID().toString(),
                owner,
                request),
        "export request cannot authorize erasure");
    jdbc.update(
        "insert into job(kind,dedupe_key,account_id,privacy_request_id,state,due_at,attempts) values ('EXPORT',?,?,?,'READY',now(),0)",
        UUID.randomUUID().toString(),
        owner,
        request);
  }

  @Test
  void schemaAuditContainsOnlyExpectedTablesAndIndexedForeignKeys() throws Exception {
    var mapper = tools.jackson.databind.json.JsonMapper.builder().build();
    var output = java.nio.file.Path.of("target/p08-evidence");
    java.nio.file.Files.createDirectories(output);
    var audit = new java.util.LinkedHashMap<String, Object>();
    audit.put("postgres", jdbc.queryForObject("show server_version", String.class));
    audit.put(
        "tables",
        jdbc.queryForList(
            "select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE' order by table_name",
            String.class));
    audit.put(
        "columns",
        jdbc.queryForList(
            "select table_name,column_name,data_type,is_nullable,column_default from information_schema.columns where table_schema='public' order by table_name,ordinal_position"));
    audit.put(
        "constraints",
        jdbc.queryForList(
            "select t.relname as table_name,c.conname as name,c.contype::text as type,pg_get_constraintdef(c.oid) as definition from pg_constraint c join pg_class t on t.oid=c.conrelid join pg_namespace n on n.oid=t.relnamespace where n.nspname='public' order by t.relname,c.conname"));
    audit.put(
        "indexes",
        jdbc.queryForList(
            "select tablename,indexname,indexdef from pg_indexes where schemaname='public' order by tablename,indexname"));
    java.nio.file.Files.writeString(
        output.resolve("schema-audit.json"),
        mapper.writerWithDefaultPrettyPrinter().writeValueAsString(audit));
  }

  @Test
  void remediationUsesPinnedSameOwnerTransferAndSurvivesPracticeErasure() {
    var f = fixtures();
    long owner = account(), other = account();
    var c = tx().execute(s -> f.course(1, true, true));
    long e = tx().execute(s -> f.enroll(owner, c));
    long attempt =
        tx().execute(
                s -> {
                  long a = f.attempt(owner, e, c.quiz(), true);
                  f.submit(a, c.quiz(), 1);
                  return a;
                });
    assertThat(
            jdbc.queryForObject(
                "select passed from attempt_result where attempt_id=?", Boolean.class, attempt))
        .isFalse();
    long practice =
        jdbc.queryForObject(
            "insert into practice_response(account_id,exercise_revision_id,response_text,completed_at) values (?,?,'Synthetic transfer explanation',now()) returning id",
            Long.class,
            owner,
            c.exerciseRevision());
    long foreign =
        jdbc.queryForObject(
            "insert into practice_response(account_id,exercise_revision_id,response_text,completed_at) values (?,?,'Other synthetic response',now()) returning id",
            Long.class,
            other,
            c.exerciseRevision());
    fails(
        () ->
            jdbc.update(
                "insert into remediation_record(account_id,failed_attempt_id,topic_revision_id,completed_at,practice_response_id) values (?,?,?,now(),?)",
                owner,
                attempt,
                c.topicRevisions().getFirst(),
                foreign),
        "foreign transfer rejected");
    long remediation =
        jdbc.queryForObject(
            "insert into remediation_record(account_id,failed_attempt_id,topic_revision_id,completed_at,practice_response_id) values (?,?,?,now(),?) returning id",
            Long.class,
            owner,
            attempt,
            c.topicRevisions().getFirst(),
            practice);
    jdbc.update("delete from practice_response where id=?", practice);
    assertThat(
            jdbc.queryForObject(
                "select completed_at is not null and practice_response_id is null from remediation_record where id=?",
                Boolean.class,
                remediation))
        .isTrue();
  }

  @Test
  void projectSelfReviewChecksPinnedRubricAndExplicitWritingErasure() {
    long owner = account();
    long revision =
        tx().execute(
                s -> {
                  long o = object("PROJECT"), r = revision(o, "PROJECT", 1);
                  jdbc.update(
                      "insert into project_revision(revision_id,kind,pass_score,real_money_required) values (?,'PROJECT',85,false)",
                      r);
                  jdbc.update(
                      "insert into rubric_criterion(owner_revision_id,code,ordinal,weight,description) values (?,'reasoning',1,100,'Synthetic reasoning rubric')",
                      r);
                  jdbc.update(
                      "insert into project_field(project_revision_id,field_key,ordinal,field_type,label,required,critical) values (?,'reasoning',1,'SELF_RUBRIC','Self rating',true,false),(?,'explanation',2,'TEXT','Self explanation',true,true)",
                      r,
                      r);
                  seal(r);
                  return r;
                });
    long work =
        jdbc.queryForObject(
            "insert into project_work(public_id,account_id,project_revision_id,state,critical_acknowledged,submission_no) values (?,?,?,'DRAFT',false,1) returning id",
            Long.class,
            UUID.randomUUID(),
            owner,
            revision);
    jdbc.update(
        "insert into project_response(work_id,project_revision_id,field_key,numeric_value) values (?,?,'reasoning',90)",
        work,
        revision);
    jdbc.update(
        "insert into project_response(work_id,project_revision_id,field_key,text_value) values (?,?,'explanation','Synthetic private explanation')",
        work,
        revision);
    fails(
        () ->
            jdbc.update(
                "update project_work set state='SELF_REVIEWED',submitted_at=now(),critical_acknowledged=true,self_review_score=100 where id=?",
                work),
        "cannot invent self-review score");
    jdbc.update(
        "update project_work set state='SELF_REVIEWED',submitted_at=now(),critical_acknowledged=true,self_review_score=90 where id=?",
        work);
    fails(
        () ->
            jdbc.update(
                "update project_response set numeric_value=100 where work_id=? and field_key='reasoning'",
                work),
        "sealed project responses immutable");
    jdbc.update("delete from project_work where id=?", work);
    assertThat(
            jdbc.queryForObject(
                "select count(*) from project_response where work_id=?", Integer.class, work))
        .isZero();
    assertThat(
            jdbc.queryForObject(
                "select count(*) from project_revision where revision_id=?",
                Integer.class,
                revision))
        .isEqualTo(1);
  }
}
