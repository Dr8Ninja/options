package org.options.platform;

import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;

/** Synthetic relational fixtures, created only inside isolated test transactions. */
final class PersistenceFixtures {
  final JdbcTemplate db;
  final long actor;

  PersistenceFixtures(JdbcTemplate db, long actor) {
    this.db = db;
    this.actor = actor;
  }

  long object(String kind) {
    return db.queryForObject(
        "insert into catalog_object(external_id,kind) values (?,?) returning id",
        Long.class,
        "TEST-" + UUID.randomUUID(),
        kind);
  }

  long revision(long object, String kind, int n) {
    return db.queryForObject(
        "insert into catalog_revision(object_id,kind,revision_no,title,readiness,author_actor_id,format_version,content_hash) values (?,?,?,'Synthetic fixture','scope_outline',?,'v1',repeat('a',64)) returning id",
        Long.class,
        object,
        kind,
        n,
        actor);
  }

  void seal(long r) {
    db.update("update catalog_revision set sealed_at=now() where id=?", r);
  }

  void review(long r, String type) {
    db.update(
        "insert into review_decision(revision_id,review_type,actor_id,outcome,reviewed_hash,findings,decided_at) select ?,?,?,'APPROVE',content_hash,'Synthetic test review',now() from catalog_revision where id=?",
        r,
        type,
        actor,
        r);
  }

  void entry(long p, long r, String visibility) {
    db.update(
        "insert into publication_entry(publication_id,object_id,revision_id,visibility,indexable,display_order) select ?,object_id,id,?,false,revision_no from catalog_revision where id=?",
        p,
        visibility,
        r);
    review(r, "rights");
    if (visibility.equals("PROTECTED")) review(r, "assessment");
    if (visibility.equals("LESSON"))
      for (String t : List.of("technical", "pedagogy", "accessibility")) review(r, t);
  }

  long publication() {
    return db.queryForObject(
        "insert into publication(public_id,label,created_by_actor_id,manifest_hash,status) values (?,'Synthetic test manifest',?,repeat('b',64),'BUILDING') returning id",
        Long.class,
        UUID.randomUUID(),
        actor);
  }

  record Quiz(long object, long revision, long firstForm, long secondForm, List<Long> questions) {}

  Quiz quiz(long publication, Long topicRevision, Long exerciseRevision) {
    long po = object("POLICY"), pr = revision(po, "POLICY", 1);
    db.update(
        "insert into policy_revision(revision_id,kind,policy_version,pass_score) values (?,'POLICY',1,85)",
        pr);
    seal(pr);
    entry(publication, pr, "MAP");
    long qo = object("QUIZ"), qr = revision(qo, "QUIZ", 1);
    db.update(
        "insert into quiz_revision(revision_id,kind,purpose,policy_revision_id,pass_score,scoring_version,critical_required,expected_items,max_fresh_forms) values (?,'QUIZ','GATE',?,85,'score-v1',true,10,2)",
        qr,
        pr);
    List<Long> questions = new ArrayList<>();
    long[] forms = new long[2];
    for (int f = 0; f < 2; f++) {
      UUID exposure = UUID.randomUUID();
      db.update(
          "insert into assessment_exposure_group(id,reason) values (?,'Synthetic disjoint form')",
          exposure);
      forms[f] =
          db.queryForObject(
              "insert into quiz_form(quiz_revision_id,form_code,exposure_group,variant_note) values (?,?,?,'Synthetic new inputs') returning id",
              Long.class,
              qr,
              "form-" + f,
              exposure);
      for (int i = 1; i <= 10; i++) {
        long o = object("QUESTION"), r = revision(o, "QUESTION", 1);
        db.update(
            "insert into question_revision(revision_id,kind,question_type,prompt,explanation,critical,expected_numeric,abs_tolerance,rel_tolerance,expected_unit) values (?,'QUESTION','NUMERIC','Synthetic calculation','Synthetic protected key',?,10,0,0,'units')",
            r,
            i <= 3);
        seal(r);
        entry(publication, r, "PROTECTED");
        db.update(
            "insert into quiz_form_item(form_id,ordinal,question_revision_id,weight) values (?,?,?,10)",
            forms[f],
            i,
            r);
        if (f == 0) questions.add(r);
      }
    }
    if (exerciseRevision != null)
      db.update(
          "insert into quiz_remediation_requirement(quiz_revision_id,question_revision_id,topic_revision_id,exercise_revision_id) values (?,?,?,?)",
          qr,
          questions.getFirst(),
          topicRevision,
          exerciseRevision);
    seal(qr);
    entry(publication, qr, "PROTECTED");
    return new Quiz(qo, qr, forms[0], forms[1], questions);
  }

  record Course(
      long path,
      long pathRevision,
      long publication,
      List<Long> topics,
      List<Long> topicRevisions,
      Quiz quiz,
      Long exerciseRevision) {}

  Course course(int topicCount, boolean withQuiz) {
    return course(topicCount, withQuiz, false);
  }

  Course course(int topicCount, boolean withQuiz, boolean withRemediation) {
    long p = publication();
    List<Long> topics = new ArrayList<>(), revisions = new ArrayList<>();
    for (int i = 0; i < topicCount; i++) {
      long o = object("TOPIC"), r = revision(o, "TOPIC", 1);
      db.update(
          "update catalog_revision set readiness='reviewed_lesson',lesson_markdown='Synthetic test-only lesson' where id=?",
          r);
      seal(r);
      entry(p, r, "LESSON");
      topics.add(o);
      revisions.add(r);
    }
    Long exercise = withRemediation ? transferExercise(p) : null;
    Quiz q = withQuiz ? quiz(p, revisions.getFirst(), exercise) : null;
    long path = object("PATH"), r = revision(path, "PATH", 1);
    db.update(
        "insert into path_revision(revision_id,kind,path_type) values (?,'PATH','foundation_course')",
        r);
    for (int i = 0; i < topics.size(); i++)
      db.update(
          "insert into catalog_link(owner_revision_id,owner_kind,relation,target_object_id,target_kind,ordinal) values (?,'PATH','path_topic',?,'TOPIC',?)",
          r,
          topics.get(i),
          i + 1);
    if (q != null)
      db.update(
          "insert into course_gate(path_revision_id,ordinal,quiz_revision_id,after_topic_id) values (?,1,?,?)",
          r,
          q.revision(),
          topics.getLast());
    seal(r);
    entry(p, r, "MAP");
    db.update("update publication set status='SEALED',validated_at=now() where id=?", p);
    return new Course(path, r, p, topics, revisions, q, exercise);
  }

  long enroll(long owner, Course c) {
    long e =
        db.queryForObject(
            "insert into enrollment(public_id,account_id,path_revision_id,path_object_id,publication_id,state) values (?,?,?,?,?,'CURRENT') returning id",
            Long.class,
            UUID.randomUUID(),
            owner,
            c.pathRevision(),
            c.path(),
            c.publication());
    for (int i = 0; i < c.topics().size(); i++)
      db.update(
          "insert into enrollment_requirement(enrollment_id,ordinal,object_id,revision_id,kind,required) values (?,?,?,?,'TOPIC',true)",
          e,
          i + 1,
          c.topics().get(i),
          c.topicRevisions().get(i));
    if (c.quiz() != null)
      db.update(
          "insert into enrollment_requirement(enrollment_id,ordinal,object_id,revision_id,kind,required) values (?,?,?,?,'QUIZ',true)",
          e,
          c.topics().size() + 1,
          c.quiz().object(),
          c.quiz().revision());
    db.update("update enrollment set sealed_at=now() where id=?", e);
    return e;
  }

  long attempt(long owner, long enrollment, Quiz q, boolean fresh) {
    long a =
        db.queryForObject(
            "insert into quiz_attempt(public_id,account_id,enrollment_id,quiz_revision_id,form_id,ordinal,purpose,state,started_at,exposed_at,request_key) values (?,?,?,?,?,(select coalesce(max(ordinal),0)+1 from quiz_attempt where enrollment_id=? and quiz_revision_id=?),?,'STARTED',now(),now(),?) returning id",
            Long.class,
            UUID.randomUUID(),
            owner,
            enrollment,
            q.revision(),
            q.firstForm(),
            enrollment,
            q.revision(),
            fresh ? "FRESH" : "PRACTICE",
            UUID.randomUUID());
    db.update(
        "insert into form_exposure(account_id,exposure_group,first_attempt_id,first_seen_at,purpose) select ?,exposure_group,?,now(),'PROMPTS' from quiz_form where id=? on conflict do nothing",
        owner,
        a,
        q.firstForm());
    return a;
  }

  void submit(long attempt, Quiz q, int wrong) {
    for (int i = 1; i <= 10; i++)
      db.update(
          "insert into attempt_answer(attempt_id,form_id,item_ordinal,question_revision_id,numeric_value,submitted_unit,awarded_score,critical_error,feedback) values (?,?,?,?,?,'units',?,?,'Synthetic feedback')",
          attempt,
          q.firstForm(),
          i,
          q.questions().get(i - 1),
          i == wrong ? 11 : 10,
          i == wrong ? 0 : 100,
          i == wrong && i <= 3);
    boolean critical = wrong > 0 && wrong <= 3;
    db.update(
        "insert into attempt_result(attempt_id,total_score,critical_failures,passed,fresh_evidence,scoring_version,finalized_at) values (?,?,?,?,true,'score-v1',now())",
        attempt,
        wrong == 0 ? 100 : 90,
        critical ? 1 : 0,
        !critical);
    db.update(
        "update quiz_attempt set state='SUBMITTED',submitted_at=now(),request_hash=repeat('c',64) where id=?",
        attempt);
  }

  long transferExercise(long publication) {
    long domain = object("DOMAIN"), dr = revision(domain, "DOMAIN", 1);
    seal(dr);
    entry(publication, dr, "MAP");
    long module = object("MODULE"), mr = revision(module, "MODULE", 1);
    long competency = object("COMPETENCY"), cr = revision(competency, "COMPETENCY", 1);
    db.update(
        "insert into competency_revision(revision_id,kind,module_object_id,outcome,diagnostic_prompt,diagnostic_bridge_id,diagnostic_pass) values (?,'COMPETENCY',?,'Synthetic outcome','Synthetic prompt',?,'Synthetic pass')",
        cr,
        module,
        module);
    seal(cr);
    entry(publication, cr, "MAP");
    long blueprint = object("BLUEPRINT"), br = revision(blueprint, "BLUEPRINT", 1);
    db.update(
        "insert into blueprint_revision(revision_id,kind,module_object_id,pass_score,critical_error_policy,retries) values (?,'BLUEPRINT',?,85,'Synthetic critical','Synthetic retry')",
        br,
        module);
    db.update(
        "insert into blueprint_item(blueprint_revision_id,ordinal,item_kind,question_text,weight) values (?,1,'transfer','Synthetic transfer brief',100)",
        br);
    seal(br);
    entry(publication, br, "MAP");
    db.update(
        "insert into catalog_link(owner_revision_id,owner_kind,relation,target_object_id,target_kind,ordinal) values (?,'MODULE','module_domain',?,'DOMAIN',1),(?,'MODULE','outcome',?,'COMPETENCY',1),(?,'MODULE','assessment',?,'BLUEPRINT',1)",
        mr,
        domain,
        mr,
        competency,
        mr,
        blueprint);
    seal(mr);
    entry(publication, mr, "MAP");
    long exercise = object("EXERCISE"), er = revision(exercise, "EXERCISE", 1);
    db.update(
        "insert into exercise_revision(revision_id,kind,module_object_id,exercise_type,prompt,reference_behavior,data_plan,deliverable,pass_score,tolerance_text,fresh_variant,noncoding_route) values (?,'EXERCISE',?,'transfer','Changed input synthetic task','Protected reference','Synthetic data','Self explanation',85,'Exact','Changed inputs','Plain text')",
        er,
        module);
    db.update(
        "insert into rubric_criterion(owner_revision_id,code,ordinal,weight,description) values (?,'explanation',1,100,'Synthetic rubric')",
        er);
    seal(er);
    entry(publication, er, "PROTECTED");
    return er;
  }
}
