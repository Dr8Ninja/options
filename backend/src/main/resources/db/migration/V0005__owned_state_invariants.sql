-- Owned rows may disappear on account erasure; catalog retirement never deletes them.
CREATE FUNCTION check_enrollment() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE e enrollment;
BEGIN
 SELECT * INTO e FROM enrollment WHERE id=NEW.id;
 IF e.sealed_at IS NULL OR NOT EXISTS(SELECT 1 FROM publication_entry pe JOIN publication p ON p.id=pe.publication_id
  WHERE pe.publication_id=e.publication_id AND pe.revision_id=e.path_revision_id AND pe.object_id=e.path_object_id AND p.status='SEALED') THEN
  RAISE EXCEPTION 'enrollment requires a sealed snapshot and published path version' USING ERRCODE='23514',CONSTRAINT='enrollment_snapshot'; END IF;
 IF NOT EXISTS(SELECT 1 FROM enrollment_requirement WHERE enrollment_id=e.id) OR EXISTS(SELECT 1 FROM enrollment_requirement r WHERE r.enrollment_id=e.id AND NOT EXISTS(
  SELECT 1 FROM publication_entry pe WHERE pe.publication_id=e.publication_id AND pe.object_id=r.object_id AND pe.revision_id=r.revision_id AND
   ((r.kind='TOPIC' AND pe.visibility='LESSON') OR (r.kind='QUIZ' AND pe.visibility='PROTECTED') OR (r.kind='PROJECT' AND pe.visibility IN ('MAP','PROTECTED'))))) THEN
  RAISE EXCEPTION 'requirements must resolve to eligible exact publication entries' USING ERRCODE='23514',CONSTRAINT='enrollment_requirement_publication'; END IF;
 IF EXISTS(
  (SELECT target_object_id FROM catalog_link WHERE owner_revision_id=e.path_revision_id AND relation='path_topic'
   EXCEPT SELECT object_id FROM enrollment_requirement WHERE enrollment_id=e.id AND kind='TOPIC' AND required)
  UNION ALL
  (SELECT object_id FROM enrollment_requirement WHERE enrollment_id=e.id AND kind='TOPIC' AND required
   EXCEPT SELECT target_object_id FROM catalog_link WHERE owner_revision_id=e.path_revision_id AND relation='path_topic')
 ) AND EXISTS(SELECT 1 FROM path_revision WHERE revision_id=e.path_revision_id AND path_type='foundation_course') THEN
  RAISE EXCEPTION 'course topic denominator must be exact' USING ERRCODE='23514',CONSTRAINT='course_requirement_set'; END IF;
 IF EXISTS(
  SELECT 1 FROM course_gate g WHERE g.path_revision_id=e.path_revision_id AND NOT EXISTS(SELECT 1 FROM enrollment_requirement r WHERE r.enrollment_id=e.id AND r.kind='QUIZ' AND r.revision_id=g.quiz_revision_id AND r.required)
 ) OR EXISTS(SELECT 1 FROM course_project p WHERE p.path_revision_id=e.path_revision_id AND p.required AND NOT EXISTS(SELECT 1 FROM enrollment_requirement r WHERE r.enrollment_id=e.id AND r.kind='PROJECT' AND r.revision_id=p.project_revision_id AND r.required)) THEN
  RAISE EXCEPTION 'required gates and projects must be frozen' USING ERRCODE='23514',CONSTRAINT='course_assessment_snapshot'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER enrollment_snapshot AFTER INSERT OR UPDATE ON enrollment DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_enrollment();
CREATE FUNCTION protect_enrollment() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='UPDATE' AND (NEW.account_id<>OLD.account_id OR NEW.path_revision_id<>OLD.path_revision_id OR NEW.publication_id<>OLD.publication_id OR NEW.path_object_id<>OLD.path_object_id OR (OLD.sealed_at IS NOT NULL AND NEW.sealed_at IS DISTINCT FROM OLD.sealed_at)) THEN
  RAISE EXCEPTION 'enrollment identity and denominator version are immutable' USING ERRCODE='23514',CONSTRAINT='enrollment_pinned'; END IF;
 IF TG_OP='DELETE' AND EXISTS(SELECT 1 FROM account WHERE id=OLD.account_id) THEN
  RAISE EXCEPTION 'enrollment retained until account erasure' USING ERRCODE='23514',CONSTRAINT='enrollment_retention'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW;
END $$;
CREATE TRIGGER enrollment_pinned BEFORE UPDATE OR DELETE ON enrollment FOR EACH ROW EXECUTE FUNCTION protect_enrollment();
CREATE FUNCTION protect_requirement() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM enrollment e WHERE e.id=CASE WHEN TG_OP='DELETE' THEN OLD.enrollment_id ELSE NEW.enrollment_id END AND e.sealed_at IS NOT NULL) THEN
  RAISE EXCEPTION 'enrollment requirements are immutable' USING ERRCODE='23514',CONSTRAINT='frozen_requirement'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW;
END $$;
CREATE TRIGGER frozen_requirement BEFORE INSERT OR UPDATE OR DELETE ON enrollment_requirement FOR EACH ROW EXECUTE FUNCTION protect_requirement();

CREATE FUNCTION check_course_structure() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM path_topic_prerequisite p LEFT JOIN catalog_link t ON t.owner_revision_id=p.path_revision_id AND t.relation='path_topic' AND t.target_object_id=p.topic_object_id
  LEFT JOIN catalog_link req ON req.owner_revision_id=p.path_revision_id AND req.relation='path_topic' AND req.target_object_id=p.requires_topic_id
  WHERE p.path_revision_id=NEW.id AND (t.ordinal IS NULL OR req.ordinal IS NULL OR req.ordinal>=t.ordinal)) THEN
  RAISE EXCEPTION 'course prerequisite must be an earlier member' USING ERRCODE='23514',CONSTRAINT='course_predecessor'; END IF;
 IF EXISTS(SELECT 1 FROM course_gate g WHERE g.path_revision_id=NEW.id AND NOT EXISTS(SELECT 1 FROM catalog_link l WHERE l.owner_revision_id=g.path_revision_id AND l.relation='path_topic' AND l.target_object_id=g.after_topic_id)) THEN
  RAISE EXCEPTION 'gate boundary must be a course member' USING ERRCODE='23514',CONSTRAINT='course_gate_boundary'; END IF;
 IF EXISTS(SELECT 1 FROM catalog_link l JOIN catalog_revision q ON q.object_id=l.target_object_id JOIN quiz_revision quiz ON quiz.revision_id=q.id
  WHERE l.owner_revision_id=NEW.id AND l.relation='path_diagnostic_quiz' AND quiz.purpose<>'DIAGNOSTIC') THEN
  RAISE EXCEPTION 'diagnostic relation requires diagnostic quiz' USING ERRCODE='23514',CONSTRAINT='diagnostic_purpose'; END IF;
 IF EXISTS(SELECT 1 FROM quiz_remediation_requirement m WHERE m.quiz_revision_id=NEW.id AND NOT EXISTS(
  SELECT 1 FROM quiz_form f JOIN quiz_form_item i ON i.form_id=f.id WHERE f.quiz_revision_id=m.quiz_revision_id AND i.question_revision_id=m.question_revision_id)) THEN
  RAISE EXCEPTION 'remediation question is not in the quiz' USING ERRCODE='23514',CONSTRAINT='remediation_membership'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER course_structure AFTER INSERT OR UPDATE ON catalog_revision DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_course_structure();

CREATE FUNCTION protect_attempt() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' THEN
  IF EXISTS(SELECT 1 FROM account WHERE id=OLD.account_id) THEN RAISE EXCEPTION 'attempts are retained until owner erasure' USING ERRCODE='23514',CONSTRAINT='attempt_retention'; END IF;
  RETURN OLD;
 END IF;
 IF (NEW.account_id,NEW.enrollment_id,NEW.quiz_revision_id,NEW.form_id,NEW.ordinal,NEW.purpose,NEW.request_key,NEW.exposed_at) IS DISTINCT FROM
    (OLD.account_id,OLD.enrollment_id,OLD.quiz_revision_id,OLD.form_id,OLD.ordinal,OLD.purpose,OLD.request_key,OLD.exposed_at)
 OR (OLD.state<>'STARTED' AND (NEW.state,NEW.submitted_at,NEW.request_hash) IS DISTINCT FROM (OLD.state,OLD.submitted_at,OLD.request_hash)) THEN
  RAISE EXCEPTION 'attempt identity and finalized state are immutable' USING ERRCODE='23514',CONSTRAINT='attempt_immutable'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER attempt_immutable BEFORE UPDATE OR DELETE ON quiz_attempt FOR EACH ROW EXECUTE FUNCTION protect_attempt();
CREATE FUNCTION protect_attempt_child() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE a quiz_attempt; aid bigint;
BEGIN
 aid=CASE WHEN TG_OP='DELETE' THEN OLD.attempt_id ELSE NEW.attempt_id END;
 SELECT * INTO a FROM quiz_attempt WHERE id=aid;
 IF TG_OP='DELETE' AND (a.id IS NULL OR NOT EXISTS(SELECT 1 FROM account WHERE id=a.account_id)) THEN RETURN OLD; END IF;
 IF a.state<>'STARTED' OR (TG_TABLE_NAME='attempt_result' AND TG_OP<>'INSERT') THEN
  RAISE EXCEPTION 'submitted/abandoned assessment data is immutable' USING ERRCODE='23514',CONSTRAINT='attempt_child_immutable'; END IF;
 IF TG_OP='UPDATE' AND NEW.attempt_id<>OLD.attempt_id THEN
  RAISE EXCEPTION 'answer ownership cannot change' USING ERRCODE='23514',CONSTRAINT='answer_owner'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW;
END $$;
CREATE TRIGGER attempt_child_immutable BEFORE INSERT OR UPDATE OR DELETE ON attempt_answer FOR EACH ROW EXECUTE FUNCTION protect_attempt_child();
CREATE TRIGGER attempt_child_immutable BEFORE INSERT OR UPDATE OR DELETE ON answer_choice FOR EACH ROW EXECUTE FUNCTION protect_attempt_child();
CREATE TRIGGER attempt_child_immutable BEFORE INSERT OR UPDATE OR DELETE ON attempt_result FOR EACH ROW EXECUTE FUNCTION protect_attempt_child();

CREATE FUNCTION validate_attempt(aid bigint) RETURNS void LANGUAGE plpgsql AS $$
DECLARE a quiz_attempt; q quiz_revision; result attempt_result; expected_score numeric; criticals integer;
BEGIN
 SELECT * INTO a FROM quiz_attempt WHERE id=aid;
 IF NOT FOUND THEN RETURN; END IF;
 SELECT * INTO q FROM quiz_revision WHERE revision_id=a.quiz_revision_id;
 IF (a.purpose='DIAGNOSTIC')<>(q.purpose='DIAGNOSTIC') THEN RAISE EXCEPTION 'attempt/quiz purpose mismatch' USING ERRCODE='23514',CONSTRAINT='attempt_purpose'; END IF;
 IF q.purpose='GATE' AND NOT EXISTS(SELECT 1 FROM enrollment_requirement WHERE enrollment_id=a.enrollment_id AND revision_id=a.quiz_revision_id AND kind='QUIZ') THEN
  RAISE EXCEPTION 'attempt requires its pinned gate requirement' USING ERRCODE='23514',CONSTRAINT='attempt_requirement'; END IF;
 IF NOT EXISTS(SELECT 1 FROM form_exposure e JOIN quiz_form f ON f.exposure_group=e.exposure_group WHERE f.id=a.form_id AND e.account_id=a.account_id)
  OR (a.purpose='FRESH' AND NOT EXISTS(SELECT 1 FROM form_exposure WHERE account_id=a.account_id AND first_attempt_id=a.id)) THEN
  RAISE EXCEPTION 'freshness must match durable first exposure' USING ERRCODE='23514',CONSTRAINT='attempt_exposure'; END IF;
 IF EXISTS(SELECT 1 FROM attempt_answer ans JOIN question_revision qr ON qr.revision_id=ans.question_revision_id WHERE ans.attempt_id=aid AND
  ((qr.question_type<>'NUMERIC' AND num_nonnulls(ans.numeric_value,ans.submitted_unit)>0)
   OR (qr.question_type='NUMERIC' AND EXISTS(SELECT 1 FROM answer_choice ac WHERE ac.attempt_id=aid AND ac.item_ordinal=ans.item_ordinal))
   OR (qr.question_type='SINGLE' AND (SELECT count(*) FROM answer_choice ac WHERE ac.attempt_id=aid AND ac.item_ordinal=ans.item_ordinal)>1))) THEN
  RAISE EXCEPTION 'answer type or choice count invalid' USING ERRCODE='23514',CONSTRAINT='answer_type'; END IF;
 IF a.state<>'SUBMITTED' THEN
  IF EXISTS(SELECT 1 FROM attempt_answer WHERE attempt_id=aid AND num_nonnulls(awarded_score,critical_error,feedback)>0) OR EXISTS(SELECT 1 FROM attempt_result WHERE attempt_id=aid) THEN
   RAISE EXCEPTION 'draft/abandoned answers cannot carry scores or feedback' USING ERRCODE='23514',CONSTRAINT='draft_no_score'; END IF;
  RETURN;
 END IF;
 SELECT * INTO result FROM attempt_result WHERE attempt_id=aid;
 IF result.attempt_id IS NULL OR a.request_hash IS NULL OR (SELECT count(*) FROM attempt_answer WHERE attempt_id=aid)<>q.expected_items
 OR EXISTS(SELECT 1 FROM attempt_answer WHERE attempt_id=aid AND (awarded_score IS NULL OR critical_error IS NULL OR feedback IS NULL)) THEN
  RAISE EXCEPTION 'submission requires complete finalized answers, hash and result' USING ERRCODE='23514',CONSTRAINT='submission_complete'; END IF;
 -- Recompute exact numeric/choice answers; explicit empty selections are incorrect skips.
 IF EXISTS(
  SELECT 1 FROM attempt_answer ans JOIN question_revision qr ON qr.revision_id=ans.question_revision_id
  CROSS JOIN LATERAL (SELECT CASE WHEN qr.question_type='NUMERIC' THEN
    coalesce(ans.submitted_unit IS NOT DISTINCT FROM qr.expected_unit AND abs(ans.numeric_value-qr.expected_numeric)<=greatest(qr.abs_tolerance,abs(qr.expected_numeric)*qr.rel_tolerance),false)
   ELSE NOT EXISTS((SELECT choice_key FROM question_choice WHERE question_revision_id=qr.revision_id AND correct EXCEPT SELECT choice_key FROM answer_choice WHERE attempt_id=aid AND item_ordinal=ans.item_ordinal)
    UNION ALL (SELECT choice_key FROM answer_choice WHERE attempt_id=aid AND item_ordinal=ans.item_ordinal EXCEPT SELECT choice_key FROM question_choice WHERE question_revision_id=qr.revision_id AND correct)) END correct) graded
  WHERE ans.attempt_id=aid AND (ans.awarded_score<>CASE WHEN graded.correct THEN 100 ELSE 0 END OR ans.critical_error<>(qr.critical AND NOT graded.correct))) THEN
  RAISE EXCEPTION 'stored answer grading differs from immutable key' USING ERRCODE='23514',CONSTRAINT='answer_grading'; END IF;
 SELECT sum(ans.awarded_score*i.weight/100),count(*) FILTER(WHERE ans.critical_error) INTO expected_score,criticals FROM attempt_answer ans JOIN quiz_form_item i ON i.form_id=a.form_id AND i.ordinal=ans.item_ordinal WHERE ans.attempt_id=aid;
 IF result.total_score<>expected_score OR result.critical_failures<>criticals OR result.passed<>(expected_score>=q.pass_score AND criticals=0)
  OR result.fresh_evidence<>(a.purpose='FRESH') OR result.scoring_version<>q.scoring_version THEN
  RAISE EXCEPTION 'result differs from pinned scoring policy' USING ERRCODE='23514',CONSTRAINT='result_grading'; END IF;
END $$;
CREATE FUNCTION check_attempt() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN PERFORM validate_attempt(CASE WHEN TG_TABLE_NAME='quiz_attempt' THEN (to_jsonb(NEW)->>'id')::bigint ELSE coalesce((to_jsonb(NEW)->>'attempt_id')::bigint,(to_jsonb(OLD)->>'attempt_id')::bigint) END); RETURN NULL; END $$;
CREATE CONSTRAINT TRIGGER attempt_consistency AFTER INSERT OR UPDATE ON quiz_attempt DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_attempt();
CREATE CONSTRAINT TRIGGER answer_consistency AFTER INSERT OR UPDATE OR DELETE ON attempt_answer DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_attempt();
CREATE CONSTRAINT TRIGGER choice_consistency AFTER INSERT OR UPDATE OR DELETE ON answer_choice DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_attempt();
CREATE CONSTRAINT TRIGGER result_consistency AFTER INSERT ON attempt_result DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_attempt();

CREATE FUNCTION check_evidence() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE assessment_id bigint; level_code text;
BEGIN
 IF NEW.attempt_id IS NOT NULL THEN
  SELECT a.quiz_revision_id,CASE WHEN a.purpose='DIAGNOSTIC' THEN 'DIAGNOSTIC' ELSE 'DEMONSTRATED' END INTO assessment_id,level_code
   FROM quiz_attempt a JOIN attempt_result r ON r.attempt_id=a.id WHERE a.id=NEW.attempt_id AND a.account_id=NEW.account_id AND a.state='SUBMITTED' AND (a.purpose='DIAGNOSTIC' OR (r.passed AND r.fresh_evidence));
 ELSE
  SELECT project_revision_id,'SELF_REVIEW' INTO assessment_id,level_code FROM project_work WHERE id=NEW.project_work_id AND account_id=NEW.account_id AND state='SELF_REVIEWED';
 END IF;
 IF assessment_id IS NULL OR NEW.rubric_revision_id<>assessment_id OR NEW.evidence_type<>level_code OR NOT EXISTS(
  SELECT 1 FROM assessment_competency WHERE assessment_revision_id=assessment_id AND competency_revision_id=NEW.competency_revision_id AND evidence_level=level_code) THEN
  RAISE EXCEPTION 'evidence requires eligible same-owner versioned assessment attribution' USING ERRCODE='23514',CONSTRAINT='evidence_attribution'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER evidence_attribution AFTER INSERT ON mastery_evidence DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_evidence();
CREATE TRIGGER immutable_evidence BEFORE UPDATE ON mastery_evidence FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE FUNCTION check_remediation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.practice_response_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM practice_response p JOIN quiz_attempt a ON a.id=NEW.failed_attempt_id
  JOIN attempt_result result ON result.attempt_id=a.id JOIN quiz_remediation_requirement m ON m.quiz_revision_id=a.quiz_revision_id AND m.topic_revision_id=NEW.topic_revision_id AND m.exercise_revision_id=p.exercise_revision_id
  WHERE p.id=NEW.practice_response_id AND p.account_id=NEW.account_id AND p.completed_at IS NOT NULL AND NOT result.passed) THEN
  RAISE EXCEPTION 'remediation must use the mapped same-owner completed transfer' USING ERRCODE='23514',CONSTRAINT='remediation_transfer'; END IF;
 IF NEW.completed_at IS NOT NULL AND NEW.practice_response_id IS NULL AND (TG_OP='INSERT' OR OLD.completed_at IS NULL) THEN
  RAISE EXCEPTION 'new remediation completion requires transfer evidence' USING ERRCODE='23514',CONSTRAINT='remediation_transfer'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER remediation_transfer AFTER INSERT OR UPDATE ON remediation_record DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_remediation();

CREATE FUNCTION protect_project() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='UPDATE' AND (OLD.state='SELF_REVIEWED' OR NEW.account_id<>OLD.account_id OR NEW.project_revision_id<>OLD.project_revision_id OR NEW.submission_no<>OLD.submission_no) THEN
  RAISE EXCEPTION 'self-reviewed project writing is immutable' USING ERRCODE='23514',CONSTRAINT='project_immutable'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW;
END $$;
CREATE TRIGGER project_immutable BEFORE UPDATE OR DELETE ON project_work FOR EACH ROW EXECUTE FUNCTION protect_project();
CREATE FUNCTION protect_project_response() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM project_work WHERE id=CASE WHEN TG_OP='DELETE' THEN OLD.work_id ELSE NEW.work_id END AND state='SELF_REVIEWED') THEN
  RAISE EXCEPTION 'self-reviewed responses are immutable' USING ERRCODE='23514',CONSTRAINT='project_response_immutable'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW;
END $$;
CREATE TRIGGER project_response_immutable BEFORE INSERT OR UPDATE OR DELETE ON project_response FOR EACH ROW EXECUTE FUNCTION protect_project_response();
CREATE FUNCTION check_project() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE w project_work;
BEGIN
 SELECT * INTO w FROM project_work WHERE id=CASE WHEN TG_TABLE_NAME='project_work' THEN (to_jsonb(NEW)->>'id')::bigint ELSE coalesce((to_jsonb(NEW)->>'work_id')::bigint,(to_jsonb(OLD)->>'work_id')::bigint) END;
 IF w.id IS NULL THEN RETURN NULL; END IF;
 IF EXISTS(SELECT 1 FROM project_response r JOIN project_field f ON f.project_revision_id=r.project_revision_id AND f.field_key=r.field_key WHERE r.work_id=w.id AND ((f.field_type='TEXT')<>(r.text_value IS NOT NULL))) THEN
  RAISE EXCEPTION 'project response type mismatch' USING ERRCODE='23514',CONSTRAINT='project_response_type'; END IF;
 IF w.state='SELF_REVIEWED' AND (w.submitted_at IS NULL OR w.self_review_score IS NULL OR NOT w.critical_acknowledged OR EXISTS(
  SELECT 1 FROM project_field f WHERE f.project_revision_id=w.project_revision_id AND f.required AND NOT EXISTS(SELECT 1 FROM project_response r WHERE r.work_id=w.id AND r.field_key=f.field_key))) THEN
  RAISE EXCEPTION 'self-review requires every required response and critical acknowledgment' USING ERRCODE='23514',CONSTRAINT='project_complete'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER project_complete AFTER INSERT OR UPDATE ON project_work DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_project();
CREATE CONSTRAINT TRIGGER project_response_type AFTER INSERT OR UPDATE OR DELETE ON project_response DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_project();
