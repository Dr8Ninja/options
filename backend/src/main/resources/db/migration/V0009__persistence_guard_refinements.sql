-- Forward refinements found by real role/upgrade tests. Earlier migrations stay unchanged.
DO $$ BEGIN
 EXECUTE format('GRANT UPDATE ON %I.auth_token TO otr_privacy',current_schema());
END $$;
CREATE SEQUENCE recovery_journal_sequence;
GRANT USAGE,SELECT ON SEQUENCE recovery_journal_sequence TO otr_runtime,otr_privacy;
CREATE FUNCTION publication_starts_building() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.status<>'BUILDING' THEN RAISE EXCEPTION 'publication must be built before sealing' USING ERRCODE='23514',CONSTRAINT='publication_initial_state'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER publication_initial_state BEFORE INSERT ON publication FOR EACH ROW EXECUTE FUNCTION publication_starts_building();
CREATE FUNCTION identity_collision_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_TABLE_NAME='provenance_anchor' AND NEW.locator_hash<>encode(sha256(convert_to(jsonb_build_array(NEW.json_pointer,NEW.line_start,NEW.line_end,NEW.locator_label)::text,'UTF8')),'hex') THEN
  RAISE EXCEPTION 'source locator hash mismatch' USING ERRCODE='23514',CONSTRAINT='anchor_hash'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER anchor_hash BEFORE INSERT ON provenance_anchor FOR EACH ROW EXECUTE FUNCTION identity_collision_guard();
CREATE FUNCTION check_revision_equivalence() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM catalog_revision a JOIN catalog_revision b ON a.object_id=b.object_id AND a.kind=b.kind
 JOIN review_decision r ON r.revision_id=b.id AND r.reviewed_hash=b.content_hash AND r.outcome='APPROVE'
 WHERE a.id=NEW.old_revision_id AND b.id=NEW.new_revision_id AND r.id=NEW.review_id) THEN
  RAISE EXCEPTION 'equivalence needs same object and exact approving review' USING ERRCODE='23514',CONSTRAINT='equivalence_review'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER equivalence_review AFTER INSERT ON revision_equivalence DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_revision_equivalence();
-- Import validation can inspect immutable assessment definitions, never learner answers.
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['quiz_form','quiz_form_item','question_choice','course_gate','course_project','path_topic_prerequisite','assessment_competency','assessment_exposure_group','project_field','quiz_remediation_requirement'] LOOP
  EXECUTE format('GRANT SELECT ON %I.%I TO otr_import',current_schema(),t);
 END LOOP;
END $$;
CREATE VIEW publication_required_reference AS
 SELECT revision_id owner_revision_id,module_object_id target_object_id,NULL::bigint exact_revision_id FROM competency_revision
 UNION ALL SELECT revision_id,diagnostic_bridge_id,NULL FROM competency_revision
 UNION ALL SELECT revision_id,resource_object_id,NULL FROM assignment_revision
 UNION ALL SELECT revision_id,competency_object_id,NULL FROM assignment_revision
 UNION ALL SELECT revision_id,module_object_id,NULL FROM exercise_revision
 UNION ALL SELECT revision_id,NULL,practice_question_revision_id FROM exercise_revision WHERE practice_question_revision_id IS NOT NULL
 UNION ALL SELECT revision_id,module_object_id,NULL FROM blueprint_revision
 UNION ALL SELECT blueprint_revision_id,exercise_object_id,NULL FROM blueprint_item WHERE exercise_object_id IS NOT NULL
 UNION ALL SELECT revision_id,NULL,diagnostic_quiz_revision_id FROM path_revision WHERE diagnostic_quiz_revision_id IS NOT NULL
 UNION ALL SELECT revision_id,blueprint_object_id,NULL FROM quiz_revision WHERE blueprint_object_id IS NOT NULL
 UNION ALL SELECT revision_id,NULL,policy_revision_id FROM quiz_revision
 UNION ALL SELECT f.quiz_revision_id,NULL,i.question_revision_id FROM quiz_form f JOIN quiz_form_item i ON i.form_id=f.id
 UNION ALL SELECT path_revision_id,NULL,quiz_revision_id FROM course_gate
 UNION ALL SELECT path_revision_id,NULL,project_revision_id FROM course_project
 UNION ALL SELECT assessment_revision_id,NULL,competency_revision_id FROM assessment_competency
 UNION ALL SELECT dependent_revision_id,rule_object_id,NULL FROM rule_dependency
 UNION ALL SELECT quiz_revision_id,NULL,topic_revision_id FROM quiz_remediation_requirement
 UNION ALL SELECT quiz_revision_id,NULL,exercise_revision_id FROM quiz_remediation_requirement;
ALTER FUNCTION validate_publication(bigint) RENAME TO validate_publication_basics;
CREATE FUNCTION validate_publication(pid bigint) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
 PERFORM validate_publication_basics(pid);
 IF EXISTS(SELECT 1 FROM publication_required_reference x JOIN publication_entry e ON e.revision_id=x.owner_revision_id AND e.publication_id=pid
  WHERE NOT EXISTS(SELECT 1 FROM publication_entry target WHERE target.publication_id=pid AND
   ((x.target_object_id IS NOT NULL AND target.object_id=x.target_object_id) OR (x.exact_revision_id IS NOT NULL AND target.revision_id=x.exact_revision_id)))) THEN
  RAISE EXCEPTION 'publication has an unresolved typed or exact-version reference' USING ERRCODE='23514',CONSTRAINT='publication_typed_closure'; END IF;
END $$;
GRANT SELECT ON publication_required_reference TO otr_runtime,otr_import,otr_privacy;
REVOKE ALL ON FUNCTION validate_publication(bigint),publication_starts_building(),identity_collision_guard(),check_revision_equivalence() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION validate_publication(bigint),publication_starts_building(),identity_collision_guard(),check_revision_equivalence() TO otr_runtime,otr_import,otr_privacy;
