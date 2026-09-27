package org.options.platform;

import java.nio.file.*;
import java.util.*;
import org.flywaydb.core.Flyway;
import org.options.platform.identity.security.PasswordHashes;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.support.JdbcTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;
import tools.jackson.databind.json.JsonMapper;

/** Standalone, explicit planning-scale experiment; never loads data into the local application. */
public final class P08QueryPlan {
  public static void main(String[] args) throws Exception {
    var mapper = JsonMapper.builder().build();
    try (var pg =
        new PostgreSQLContainer(
            DockerImageName.parse(
                    "postgres@sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae")
                .asCompatibleSubstituteFor("postgres"))) {
      pg.start();
      Flyway.configure()
          .dataSource(pg.getJdbcUrl(), pg.getUsername(), pg.getPassword())
          .load()
          .migrate();
      var source = new DriverManagerDataSource(pg.getJdbcUrl(), pg.getUsername(), pg.getPassword());
      var db = new JdbcTemplate(source);
      var tx = new TransactionTemplate(new JdbcTransactionManager(source));
      long started = System.nanoTime();
      long actor =
          db.queryForObject(
              "insert into editorial_actor(actor_ref,label) values (gen_random_uuid(),'Synthetic scale actor') returning id",
              Long.class);
      var f = new PersistenceFixtures(db, actor);
      var course = tx.execute(s -> f.course(50, true));
      var large = tx.execute(s -> f.course(1000, false));
      long manifest =
          tx.execute(
              s -> {
                long p = f.publication();
                db.update(
                    "insert into publication_entry select ?,object_id,revision_id,visibility,indexable,display_order from publication_entry where publication_id in (?,?)",
                    p,
                    course.publication(),
                    large.publication());
                db.update(
                    "update publication set status='SEALED',validated_at=now() where id=?", p);
                db.update(
                    "insert into active_publication(singleton,publication_id,generation) values (1,?,1)",
                    p);
                return p;
              });
      // Inventory identity coverage is separate from synthetic authored test bodies; P09 owns
      // import.
      Map<String, String> kinds =
          Map.ofEntries(
              Map.entry("programs", "PROGRAM"),
              Map.entry("phases", "PHASE"),
              Map.entry("domains", "DOMAIN"),
              Map.entry("modules", "MODULE"),
              Map.entry("competencies", "COMPETENCY"),
              Map.entry("topics", "TOPIC"),
              Map.entry("subtopics", "SUBTOPIC"),
              Map.entry("resources", "RESOURCE"),
              Map.entry("associations", "ASSIGNMENT"),
              Map.entry("exercises", "EXERCISE"),
              Map.entry("quiz_blueprints", "BLUEPRINT"),
              Map.entry("projects", "PROJECT"),
              Map.entry("learning_paths", "PATH"),
              Map.entry("capstones", "CAPSTONE"),
              Map.entry("specializations", "SPECIALIZATION"),
              Map.entry("decision_cards", "DECISION"),
              Map.entry("assessment_policies", "POLICY"),
              Map.entry("market_rules", "RULE"),
              Map.entry("archival_structures", "ARCHIVE"));
      int canonicalCount = 0;
      for (var entry : kinds.entrySet())
        for (var record :
            mapper
                .readTree(Files.readString(Path.of("../data/v1/" + entry.getKey() + ".json")))
                .get("records")) {
          db.update(
              "insert into catalog_object(external_id,kind,identity_note) values (?,?,'Identity-only inventory coverage; no canonical content imported')",
              record.get("id").asText(),
              entry.getValue());
          canonicalCount++;
        }
      String hash = new PasswordHashes().encode("isolated scale fixture " + UUID.randomUUID());
      db.update(
          "insert into account(public_id,email,email_key,password_hash,status,verified_at,auth_generation,eligibility_attested_at,theme) select gen_random_uuid(),'load-'||n||'@example.invalid','load-'||n||'@example.invalid',?,'ACTIVE',now(),0,now(),'system' from generate_series(1,5000) n",
          hash);
      tx.execute(
          s -> {
            db.update(
                "insert into enrollment(public_id,account_id,path_revision_id,path_object_id,publication_id,state) select gen_random_uuid(),id,?,?,?,'CURRENT' from account",
                course.pathRevision(),
                course.path(),
                course.publication());
            db.update(
                "insert into enrollment_requirement(enrollment_id,ordinal,object_id,revision_id,kind,required) select e.id,l.ordinal,l.target_object_id,pe.revision_id,'TOPIC',true from enrollment e cross join catalog_link l join publication_entry pe on pe.publication_id=? and pe.object_id=l.target_object_id where l.owner_revision_id=? and l.relation='path_topic'",
                course.publication(),
                course.pathRevision());
            db.update(
                "insert into enrollment_requirement(enrollment_id,ordinal,object_id,revision_id,kind,required) select id,51,?,?,'QUIZ',true from enrollment",
                course.quiz().object(),
                course.quiz().revision());
            db.update("update enrollment set sealed_at=now()");
            return null;
          });
      tx.execute(
          s -> {
            db.update(
                "insert into learning_progress(account_id,topic_object_id,topic_revision_id,state,first_started_at,self_completed_at,last_confirmed_at) select e.account_id,r.object_id,r.revision_id,case when r.ordinal<=18 then 'SELF_COMPLETED' else 'STARTED' end,now(),case when r.ordinal<=18 then now() end,now() from enrollment e join enrollment_requirement r on r.enrollment_id=e.id and r.kind='TOPIC'");
            db.update(
                "insert into private_note(public_id,account_id,object_id,kind,text) select gen_random_uuid(),e.account_id,r.object_id,'TOPIC','Synthetic scale note' from enrollment e join enrollment_requirement r on r.enrollment_id=e.id and r.ordinal<=10");
            db.update(
                "insert into bookmark(account_id,object_id,kind,saved_at) select e.account_id,r.object_id,'TOPIC',now() from enrollment e join enrollment_requirement r on r.enrollment_id=e.id and r.ordinal<=20");
            return null;
          });
      System.out.println(
          "P08 scale: accounts, enrollment, progress, notes and bookmarks loaded; loading attempts/answers with all constraints enabled");
      // Per-owner batches bound the deferred-trigger queue without bypassing any constraint.
      for (int first = 1; first <= 5000; first += 100) {
        final int start = first;
        tx.execute(
            s -> {
              db.update(
                  "insert into quiz_attempt(public_id,account_id,enrollment_id,quiz_revision_id,form_id,ordinal,purpose,state,started_at,exposed_at,request_key) select gen_random_uuid(),e.account_id,e.id,?,?,n,case when n=1 then 'FRESH' else 'PRACTICE' end,'STARTED',now(),now(),gen_random_uuid() from enrollment e cross join generate_series(1,40) n where e.account_id between ? and ?",
                  course.quiz().revision(),
                  course.quiz().firstForm(),
                  start,
                  start + 99);
              db.update(
                  "insert into form_exposure(account_id,exposure_group,first_attempt_id,first_seen_at,purpose) select a.account_id,f.exposure_group,a.id,now(),'PROMPTS' from quiz_attempt a join quiz_form f on f.id=a.form_id where a.ordinal=1 and a.account_id between ? and ?",
                  start,
                  start + 99);
              db.update(
                  "insert into attempt_answer(attempt_id,form_id,item_ordinal,question_revision_id,numeric_value,submitted_unit) select a.id,a.form_id,i.ordinal,i.question_revision_id,10,'units' from quiz_attempt a join quiz_form_item i on i.form_id=a.form_id and i.ordinal<=5 where a.account_id between ? and ?",
                  start,
                  start + 99);
              return null;
            });
        if (first % 1000 == 1) System.out.println("P08 scale: completed owner batch " + first);
      }
      db.update(
          "insert into public_search_document(publication_id,object_id,kind,title,title_key,author_text,summary,search_vector,readiness) select pe.publication_id,o.id,o.kind,r.title,lower(r.title),'Synthetic author','Synthetic safe summary',to_tsvector('english',r.title||' options contract'),'scope_outline' from publication_entry pe join catalog_revision r on r.id=pe.revision_id join catalog_object o on o.id=pe.object_id where pe.publication_id=? and pe.visibility in ('MAP','LESSON')",
          manifest);
      db.update(
          "insert into catalog_route(path_key,object_id,canonical) values ('/topics/load-fixture',?,true)",
          course.topics().getFirst());
      db.execute("ANALYZE");
      var report = new LinkedHashMap<String, Object>();
      report.put("fixture_version", "p08-scale-v1");
      report.put("date", java.time.LocalDate.now(java.time.ZoneOffset.UTC).toString());
      report.put(
          "schema_version",
          db.queryForObject(
              "select version from flyway_schema_history where success order by installed_rank desc limit 1",
              String.class));
      report.put("canonical_identity_only_count", canonicalCount);
      report.put("canonical_import_claimed", false);
      report.put("triggers_or_constraints_disabled", false);
      report.put(
          "cache_condition",
          "warm after load and ANALYZE; not cold cache or concurrent request p95");
      report.put("postgres", db.queryForObject("show server_version", String.class));
      report.put("load_seconds", (System.nanoTime() - started) / 1_000_000_000.0);
      report.put(
          "runtime",
          Map.of(
              "java",
              System.getProperty("java.version"),
              "host_processors",
              Runtime.getRuntime().availableProcessors(),
              "postgres_memory",
              "Docker Desktop allocation; see runtime evidence"));
      var counts = new LinkedHashMap<String, Object>();
      for (String table :
          List.of(
              "account",
              "catalog_object",
              "catalog_revision",
              "enrollment_requirement",
              "learning_progress",
              "private_note",
              "bookmark",
              "quiz_attempt",
              "attempt_answer"))
        counts.put(table, db.queryForObject("select count(*) from " + table, Long.class));
      report.put("rows", counts);
      var queries = new LinkedHashMap<String, String>();
      queries.put(
          "Q01_route",
          "select o.external_id,pe.revision_id,r.title from catalog_route rt join catalog_object o on o.id=rt.object_id cross join active_publication ap join publication_entry pe on pe.publication_id=ap.publication_id and pe.object_id=o.id join catalog_revision r on r.id=pe.revision_id where rt.path_key='/topics/load-fixture' and not exists(select 1 from content_withdrawal w where w.object_id=o.id and w.reinstated_at is null)");
      queries.put(
          "Q02_search",
          "select object_id,ts_rank_cd(search_vector,websearch_to_tsquery('english','options contract')) rank from public_search_document where publication_id="
              + manifest
              + " and search_vector @@ websearch_to_tsquery('english','options contract') order by rank desc,object_id limit 20");
      queries.put(
          "Q03_notes",
          "select public_id,lock_version from private_note where account_id=1 order by updated_at desc,id desc limit 20");
      queries.put(
          "Q04_denominator",
          "select count(*) as denominator,count(*) filter(where p.state='SELF_COMPLETED') completed from enrollment e join enrollment_requirement r on r.enrollment_id=e.id left join learning_progress p on p.account_id=e.account_id and p.topic_revision_id=r.revision_id where e.account_id=1 and r.kind='TOPIC' and r.required");
      queries.put(
          "Q05_answers",
          "select item_ordinal,numeric_value from attempt_answer where attempt_id=(select min(id) from quiz_attempt where account_id=1) order by item_ordinal");
      var plans = new LinkedHashMap<String, Object>();
      for (var q : queries.entrySet())
        plans.put(
            q.getKey(),
            mapper.readTree(
                db.queryForObject(
                    "EXPLAIN (ANALYZE,BUFFERS,SETTINGS,FORMAT JSON) " + q.getValue(),
                    String.class)));
      report.put("plans", plans);
      report.put(
          "sizes",
          db.queryForList(
              "select relname,pg_table_size(relid) table_bytes,pg_indexes_size(relid) index_bytes from pg_stat_user_tables where schemaname='public' order by relname"));

      System.out.println(
          "P08 scale: baseline complete; checking 10-version history and 10x active-owner attempt skew");
      var allTopics = new ArrayList<Long>(course.topics());
      allTopics.addAll(large.topics());
      List<Long> tagIds = new ArrayList<>();
      for (int i = 0; i < 20; i++)
        tagIds.add(
            db.queryForObject(
                "insert into tag(slug,label) values (?,?) returning id",
                Long.class,
                "scale-tag-" + i,
                "Synthetic tag " + i));
      for (long topic : allTopics)
        tx.execute(
            status -> {
              for (int revision = 2; revision <= 10; revision++) {
                long r = f.revision(topic, "TOPIC", revision);
                if (revision == 10)
                  for (long tag : tagIds)
                    db.update("insert into revision_tag(revision_id,tag_id) values (?,?)", r, tag);
                f.seal(r);
              }
              return null;
            });
      tx.execute(
          status -> {
            db.update(
                "insert into quiz_attempt(public_id,account_id,enrollment_id,quiz_revision_id,form_id,ordinal,purpose,state,started_at,exposed_at,request_key) select gen_random_uuid(),e.account_id,e.id,?,?,n,'PRACTICE','STARTED',now(),now(),gen_random_uuid() from enrollment e cross join generate_series(41,400) n where e.account_id=1",
                course.quiz().revision(),
                course.quiz().firstForm());
            db.update(
                "insert into attempt_answer(attempt_id,form_id,item_ordinal,question_revision_id,numeric_value,submitted_unit) select a.id,a.form_id,i.ordinal,i.question_revision_id,10,'units' from quiz_attempt a join quiz_form_item i on i.form_id=a.form_id and i.ordinal<=5 where a.account_id=1 and a.ordinal>40");
            db.update("delete from learning_progress where account_id=5000");
            db.update(
                "update catalog_object set retired_at=now() where id=?", course.topics().get(1));
            db.update(
                "insert into content_withdrawal(object_id,revision_id,reason_code,public_message,actor_id,starts_at) values (?,?,'TEST','Synthetic withdrawal',?,now())",
                course.topics().getFirst(),
                course.topicRevisions().getFirst(),
                actor);
            return null;
          });
      db.execute("ANALYZE");
      var skew = new LinkedHashMap<String, Object>();
      skew.put("historical_revisions_per_topic", 10);
      skew.put("heavy_owner_attempts", 400);
      skew.put("zero_progress_owner", 5000);
      skew.put("tags_per_latest_revision", 20);
      var skewQueries = new LinkedHashMap<String, String>();
      skewQueries.put(
          "history",
          "select revision_no from catalog_revision where object_id="
              + course.topics().getFirst()
              + " order by revision_no desc limit 10");
      skewQueries.put(
          "heavy_owner",
          "select public_id,state from quiz_attempt where account_id=1 order by id desc limit 20");
      skewQueries.put(
          "zero_progress",
          queries.get("Q04_denominator").replace("e.account_id=1", "e.account_id=5000"));
      skewQueries.put("withdrawn_route", queries.get("Q01_route"));
      skewQueries.put(
          "many_matching_tags",
          "select r.id from catalog_revision r where exists(select 1 from revision_tag t where t.revision_id=r.id and t.tag_id in ("
              + tagIds.stream()
                  .map(Object::toString)
                  .collect(java.util.stream.Collectors.joining(","))
              + ")) order by r.id limit 50");
      var skewPlans = new LinkedHashMap<String, Object>();
      for (var query : skewQueries.entrySet())
        skewPlans.put(
            query.getKey(),
            mapper.readTree(
                db.queryForObject(
                    "EXPLAIN (ANALYZE,BUFFERS,SETTINGS,FORMAT JSON) " + query.getValue(),
                    String.class)));
      skew.put("plans", skewPlans);
      skew.put(
          "rows_after_skew",
          db.queryForMap(
              "select (select count(*) from catalog_revision) revisions,(select count(*) from quiz_attempt) attempts,(select count(*) from attempt_answer) answers,(select count(*) from learning_progress) progress"));
      report.put("skew", skew);
      Path output = Path.of("target/p08-evidence/query-plans.json");
      Files.createDirectories(output.getParent());
      Files.writeString(output, mapper.writerWithDefaultPrettyPrinter().writeValueAsString(report));
      System.out.println("PASS: planning-scale PostgreSQL measurements saved to " + output);
    }
  }
}
