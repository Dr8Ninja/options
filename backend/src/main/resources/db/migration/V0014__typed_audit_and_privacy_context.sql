-- Close polymorphic audit references without adding generic JSON or dispatch tables.
CREATE FUNCTION typed_audit_context() RETURNS trigger LANGUAGE plpgsql AS $$
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
 ELSIF TG_TABLE_NAME='content_withdrawal' AND NEW.reinstated_at IS NOT NULL THEN
  SELECT * INTO d FROM review_decision WHERE id=NEW.reinstatement_review_id;
  SELECT * INTO r FROM catalog_revision WHERE id=d.revision_id;
  IF d.id IS NOT NULL AND (d.outcome<>'APPROVE' OR d.decided_at<NEW.starts_at OR d.decided_at>NEW.reinstated_at OR r.object_id<>NEW.object_id OR (NEW.revision_id IS NOT NULL AND d.revision_id<>NEW.revision_id)) THEN
   RAISE EXCEPTION 'reinstatement requires fresh approving review of the withdrawn subject' USING ERRCODE='23514',CONSTRAINT='reinstatement_review'; END IF;
 ELSIF TG_TABLE_NAME='job' AND NEW.kind IN ('EXPORT','ERASE') THEN
  SELECT * INTO p FROM privacy_request WHERE id=NEW.privacy_request_id;
  IF p.id IS NOT NULL AND (p.kind<>CASE NEW.kind WHEN 'EXPORT' THEN 'EXPORT' ELSE 'DELETE' END OR NEW.account_id IS DISTINCT FROM p.account_id) THEN
   RAISE EXCEPTION 'privacy job must match request kind and owner' USING ERRCODE='23514',CONSTRAINT='privacy_job_context'; END IF;
 END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER verification_subject_kind AFTER INSERT ON verification_event DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION typed_audit_context();
CREATE CONSTRAINT TRIGGER assessment_owner_kind AFTER INSERT OR UPDATE ON assessment_competency DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION typed_audit_context();
CREATE CONSTRAINT TRIGGER review_exact_hash AFTER INSERT ON review_decision DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION typed_audit_context();
CREATE CONSTRAINT TRIGGER reinstatement_review AFTER INSERT OR UPDATE ON content_withdrawal DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION typed_audit_context();
CREATE CONSTRAINT TRIGGER privacy_job_context AFTER INSERT OR UPDATE ON job DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION typed_audit_context();
REVOKE ALL ON FUNCTION typed_audit_context() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION typed_audit_context() TO otr_runtime,otr_import,otr_privacy;
