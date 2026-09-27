-- Resolve table-specific record fields only inside the matching branch.
CREATE OR REPLACE FUNCTION typed_audit_context() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE k varchar(32); r catalog_revision; d review_decision; p privacy_request;
BEGIN
 IF TG_TABLE_NAME='verification_event' THEN
  SELECT kind INTO k FROM catalog_revision WHERE id=NEW.subject_revision_id;
  IF k NOT IN ('RESOURCE','ASSIGNMENT','RULE') THEN
   RAISE EXCEPTION 'verification subject must be a resource, assignment or rule' USING ERRCODE='23514',CONSTRAINT='verification_subject_kind'; END IF;
 ELSIF TG_TABLE_NAME='assessment_competency' THEN
  SELECT kind INTO k FROM catalog_revision WHERE id=NEW.assessment_revision_id;
  IF k NOT IN ('QUIZ','PROJECT') THEN
   RAISE EXCEPTION 'assessment attribution requires quiz or project' USING ERRCODE='23514',CONSTRAINT='assessment_owner_kind'; END IF;
 ELSIF TG_TABLE_NAME='review_decision' THEN
  SELECT * INTO r FROM catalog_revision WHERE id=NEW.revision_id;
  IF r.id IS NOT NULL AND (r.sealed_at IS NULL OR r.content_hash<>NEW.reviewed_hash) THEN
   RAISE EXCEPTION 'review must identify the exact sealed revision hash' USING ERRCODE='23514',CONSTRAINT='review_exact_hash'; END IF;
 ELSIF TG_TABLE_NAME='content_withdrawal' THEN
  IF NEW.reinstated_at IS NULL THEN RETURN NULL; END IF;
  SELECT * INTO d FROM review_decision WHERE id=NEW.reinstatement_review_id;
  SELECT * INTO r FROM catalog_revision WHERE id=d.revision_id;
  IF d.id IS NOT NULL AND (d.outcome<>'APPROVE' OR d.decided_at<NEW.starts_at OR d.decided_at>NEW.reinstated_at OR r.object_id<>NEW.object_id OR (NEW.revision_id IS NOT NULL AND d.revision_id<>NEW.revision_id)) THEN
   RAISE EXCEPTION 'reinstatement requires fresh approving review of the withdrawn subject' USING ERRCODE='23514',CONSTRAINT='reinstatement_review'; END IF;
 ELSIF TG_TABLE_NAME='job' THEN
  IF NEW.kind NOT IN ('EXPORT','ERASE') THEN RETURN NULL; END IF;
  SELECT * INTO p FROM privacy_request WHERE id=NEW.privacy_request_id;
  IF p.id IS NOT NULL AND (p.kind<>CASE NEW.kind WHEN 'EXPORT' THEN 'EXPORT' ELSE 'DELETE' END OR NEW.account_id IS DISTINCT FROM p.account_id) THEN
   RAISE EXCEPTION 'privacy job must match request kind and owner' USING ERRCODE='23514',CONSTRAINT='privacy_job_context'; END IF;
 END IF;
 RETURN NULL;
END $$;
