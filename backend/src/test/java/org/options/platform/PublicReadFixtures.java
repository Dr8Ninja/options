package org.options.platform;

import java.util.UUID;

/** Adversarial authored content belongs only to disposable PostgreSQL fixtures. */
final class PublicReadFixtures {
  record Ids(String topic, String hidden, String project, String path) {}

  static Ids add(PersistenceFixtures f, long publication) {
    var db = f.db;
    long hidden = f.object("TOPIC"), hr = f.revision(hidden, "TOPIC", 1);
    db.update(
        "update catalog_revision set title='HIDDENRELATIONSENTINEL',scope_outline='PROTECTEDSCOPESENTINEL' where id=?",
        hr);
    f.seal(hr);
    f.entry(publication, hr, "PROTECTED");
    long topic = f.object("TOPIC"), tr = f.revision(topic, "TOPIC", 1);
    db.update(
        "insert into recommended_preparation(owner_revision_id,owner_kind,requires_object_id,requires_kind,ordinal,rationale) values (?,'TOPIC',?,'TOPIC',1,'Synthetic unpublished prerequisite')",
        tr,
        hidden);
    long subject =
        db.queryForObject(
            "insert into rule_subject(jurisdiction,instrument,instrument_key,product_scope,market_zone,rule_type,scope_hash) values ('TEST','Synthetic','test','P10 test','UTC','synthetic',encode(sha256(convert_to('P10 test','UTF8')),'hex')) returning id",
            Long.class);
    long notice =
        db.queryForObject(
            "insert into official_notice(identifier,issuing_body,revision_no,unknown_date_reason,unknown_locator_reason) values (?,'TEST',1,'Synthetic unknown date','Synthetic unavailable locator') returning id",
            Long.class,
            UUID.randomUUID().toString());
    long rule = f.object("RULE"), rr = f.revision(rule, "RULE", 1);
    db.update(
        "insert into rule_revision(revision_id,kind,subject_id,notice_id,value_text,effective_from,date_precision,unknown_date_reason,scope,uncertainty,review_status,review_owner_label,review_interval_days,historical_eligible,historical_eligible_scope,imported_current_eligible) values (?,'RULE',?,?,'PROTECTEDRULEVALUESENTINEL',current_date-10,'day','Unknown end','Test scope','Test uncertainty','verified','Test reviewer',7,false,'none',false)",
        rr,
        subject,
        notice);
    f.seal(rr);
    f.entry(publication, rr, "MAP");
    long verification =
        db.queryForObject(
            "insert into verification_event(subject_revision_id,checked_at,checked_on,reviewer_actor_id,scope,method,outcome,next_due_at) values (?,now()-interval '10 days',current_date-10,?,'Synthetic expired check','rule_chain','verified',now()-interval '1 day') returning id",
            Long.class,
            rr,
            f.actor);
    db.update(
        "insert into rule_certification(subject_id,rule_revision_id,verification_id,valid_dates,status,review_due_at,approved_by_actor_id) values (?,?,?,daterange(current_date-10,current_date-2,'[)'),'EXPIRED',now()-interval '2 days',?)",
        subject,
        rr,
        verification,
        f.actor);
    db.update(
        "insert into rule_dependency(rule_object_id,dependent_revision_id,use_type,rationale) values (?,?,'historical','Synthetic metadata only')",
        rule,
        tr);
    f.seal(tr);
    f.entry(publication, tr, "MAP");
    long project = f.object("PROJECT"), pr = f.revision(project, "PROJECT", 1);
    db.update(
        "insert into project_revision(revision_id,kind,pass_score,real_money_required) values (?,'PROJECT',85,false)",
        pr);
    db.update(
        "insert into rubric_criterion(owner_revision_id,code,ordinal,weight,description) values (?,'correctness',1,100,'ANSWERKEYSENTINEL')",
        pr);
    db.update(
        "insert into revision_section(revision_id,owner_kind,section,ordinal,body) values (?,'PROJECT','objective',1,'Explain the calculation.'),(?,'PROJECT','reference',1,'ANSWERKEYSENTINEL')",
        pr,
        pr);
    db.update(
        "insert into catalog_link(owner_revision_id,owner_kind,relation,target_object_id,target_kind,ordinal) values (?,'PROJECT','project_topic',?,'TOPIC',1)",
        pr,
        topic);
    f.seal(pr);
    f.entry(publication, pr, "MAP");
    long path = f.object("PATH"), par = f.revision(path, "PATH", 1);
    db.update(
        "insert into path_revision(revision_id,kind,path_type) values (?,'PATH','persona_path')",
        par);
    db.update(
        "insert into catalog_link(owner_revision_id,owner_kind,relation,target_object_id,target_kind,ordinal) values (?,'PATH','path_topic',?,'TOPIC',1),(?,'PATH','path_project',?,'PROJECT',1)",
        par,
        topic,
        par,
        project);
    f.seal(par);
    f.entry(publication, par, "MAP");
    return new Ids(id(f, topic), id(f, hidden), id(f, project), id(f, path));
  }

  private static String id(PersistenceFixtures f, long id) {
    return f.db.queryForObject(
        "select external_id from catalog_object where id=?", String.class, id);
  }
}
