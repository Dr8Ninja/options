ALTER TABLE job ADD CONSTRAINT job_context_ck CHECK (
 (kind='MAIL' AND account_id IS NOT NULL AND mail_purpose IS NOT NULL AND requested_generation>=0 AND intent_expires_at IS NOT NULL AND (mail_purpose='CHANGE_EMAIL')=(target_email IS NOT NULL) AND num_nonnulls(publication_id,import_batch_id,privacy_request_id)=0)
 OR (kind<>'MAIL' AND num_nonnulls(mail_purpose,target_email,requested_generation,intent_expires_at)=0 AND (
  (kind IN ('EXPORT','ERASE') AND privacy_request_id IS NOT NULL AND num_nonnulls(publication_id,import_batch_id)=0)
  OR (kind='PUBLISH_EXPORT' AND publication_id IS NOT NULL AND num_nonnulls(account_id,import_batch_id,privacy_request_id)=0)
  OR (kind='IMPORT_EXPORT' AND import_batch_id IS NOT NULL AND num_nonnulls(account_id,publication_id,privacy_request_id)=0)
  OR (kind IN ('FRESHNESS','BACKUP_CHECK') AND num_nonnulls(account_id,publication_id,import_batch_id,privacy_request_id)=0))));
ALTER TABLE recovery_journal ADD CONSTRAINT recovery_subject_ck CHECK (
 (event_type IN ('ACCOUNT_ERASE','SUSPENSION','ROLE_REVOCATION') AND subject_public_id IS NOT NULL AND num_nonnulls(object_external_id,owned_record_public_id,publication_id)=0)
 OR (event_type IN ('NOTE_ERASE','PROJECT_WRITING_ERASE') AND subject_public_id IS NOT NULL AND owned_record_public_id IS NOT NULL AND num_nonnulls(object_external_id,publication_id)=0)
 OR (event_type='WITHDRAWAL' AND object_external_id IS NOT NULL AND num_nonnulls(subject_public_id,owned_record_public_id,publication_id)=0)
 OR (event_type='PUBLICATION' AND publication_id IS NOT NULL AND num_nonnulls(subject_public_id,owned_record_public_id,object_external_id)=0));
ALTER TABLE command_receipt ADD CONSTRAINT receipt_operation_result_ck CHECK (
 (operation_id IN ('replaceProfile','changePassword','requestEmailChange','cancelEmailChange','registerCredential','revokeCredential','grantRole','revokeRole','setAccountStatus') AND result_account_id IS NOT NULL)
 OR (operation_id IN ('createEnrollment','migrateEnrollment') AND enrollment_id IS NOT NULL)
 OR (operation_id IN ('startOrResumeAttempt','submitAttempt','abandonAttempt','saveAttemptAnswers') AND attempt_id IS NOT NULL)
 OR (operation_id='completeRemediation' AND remediation_id IS NOT NULL)
 OR (operation_id IN ('requestFreshAssessment','resolveAssessmentMaintenanceRequest') AND assessment_request_id IS NOT NULL)
 OR (operation_id IN ('startProjectWork','saveProjectWork','selfReviewProject') AND project_work_id IS NOT NULL)
 OR (operation_id IN ('createIssue','triageIssue') AND issue_id IS NOT NULL)
 OR (operation_id IN ('requestOwnerExport','deleteAccount') AND privacy_request_id IS NOT NULL)
 OR (operation_id IN ('validateAndStageImport','revalidateImport','applyImport') AND import_batch_id IS NOT NULL)
 OR (operation_id IN ('saveDraft','requestDraftReview','proposeRetirement') AND revision_id IS NOT NULL)
 OR (operation_id='reviewDraft' AND review_id IS NOT NULL)
 OR (operation_id IN ('stagePublication','activatePublication','rollbackPublication') AND publication_id IS NOT NULL)
 OR (operation_id IN ('withdrawContent','reinstateContent') AND withdrawal_id IS NOT NULL)
 OR (operation_id='requestEditorialExport' AND job_id IS NOT NULL));

CREATE FUNCTION verify_receipt_owner() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF (NEW.enrollment_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM enrollment WHERE id=NEW.enrollment_id AND account_id=NEW.actor_account_id))
 OR (NEW.attempt_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM quiz_attempt WHERE id=NEW.attempt_id AND account_id=NEW.actor_account_id))
 OR (NEW.remediation_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM remediation_record WHERE id=NEW.remediation_id AND account_id=NEW.actor_account_id))
 OR (NEW.project_work_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM project_work WHERE id=NEW.project_work_id AND account_id=NEW.actor_account_id))
 OR (NEW.privacy_request_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM privacy_request WHERE id=NEW.privacy_request_id AND account_id=NEW.actor_account_id))
 OR (NEW.assessment_request_id IS NOT NULL AND NEW.operation_id='requestFreshAssessment' AND NOT EXISTS(SELECT 1 FROM assessment_request WHERE id=NEW.assessment_request_id AND account_id=NEW.actor_account_id))
 OR (NEW.issue_id IS NOT NULL AND NEW.operation_id='createIssue' AND NOT EXISTS(SELECT 1 FROM content_issue WHERE id=NEW.issue_id AND account_id=NEW.actor_account_id)) THEN
  RAISE EXCEPTION 'receipt result owner mismatch' USING ERRCODE='23514',CONSTRAINT='receipt_owner'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER receipt_owner BEFORE INSERT ON command_receipt FOR EACH ROW EXECUTE FUNCTION verify_receipt_owner();
CREATE TRIGGER receipt_immutable BEFORE UPDATE ON command_receipt FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE FUNCTION protect_import() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF OLD.state<>'VALIDATING' AND (NEW.report,NEW.report_version,NEW.package_id,NEW.manifest_sha256,NEW.run_no,NEW.base_publication_id) IS DISTINCT FROM (OLD.report,OLD.report_version,OLD.package_id,OLD.manifest_sha256,OLD.run_no,OLD.base_publication_id) THEN
  RAISE EXCEPTION 'validated import diagnostics and base are immutable' USING ERRCODE='23514',CONSTRAINT='import_report_immutable'; END IF;
 IF NEW.state='APPLIED' AND (OLD.state<>'STAGED' OR NEW.applied_at IS NULL) THEN
  RAISE EXCEPTION 'only staged import can be atomically applied' USING ERRCODE='23514',CONSTRAINT='import_state'; END IF;
 IF OLD.state IN ('REJECTED','CONFLICTED','APPLIED') AND NEW IS DISTINCT FROM OLD THEN
  RAISE EXCEPTION 'terminal import run is immutable' USING ERRCODE='23514',CONSTRAINT='import_terminal'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER import_integrity BEFORE UPDATE ON import_batch FOR EACH ROW EXECUTE FUNCTION protect_import();
CREATE FUNCTION protect_owner() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE owner_id bigint;
BEGIN
 owner_id=(to_jsonb(NEW)->>'account_id')::bigint;
 IF TG_OP='UPDATE' AND (to_jsonb(OLD)->>'account_id') IS DISTINCT FROM (to_jsonb(NEW)->>'account_id') THEN
  RAISE EXCEPTION 'owner identity cannot change' USING ERRCODE='23514',CONSTRAINT='owner_immutable'; END IF;
 PERFORM 1 FROM account WHERE id=owner_id AND status='ACTIVE' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'owned write requires active verified account' USING ERRCODE='23514',CONSTRAINT='active_owner'; END IF;
 RETURN NEW;
END $$;
CREATE FUNCTION limit_session_bytes() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 PERFORM 1 FROM spring_session WHERE primary_id=NEW.session_primary_id FOR UPDATE;
 IF (SELECT coalesce(sum(octet_length(attribute_bytes)),0) FROM spring_session_attributes WHERE session_primary_id=NEW.session_primary_id AND attribute_name<>NEW.attribute_name)+octet_length(NEW.attribute_bytes)>65536 THEN
  RAISE EXCEPTION 'session attribute limit exceeded' USING ERRCODE='23514',CONSTRAINT='session_size'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER session_size BEFORE INSERT OR UPDATE ON spring_session_attributes FOR EACH ROW EXECUTE FUNCTION limit_session_bytes();
CREATE FUNCTION role_generation() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE owner_id bigint;
BEGIN
 owner_id=CASE WHEN TG_OP='DELETE' THEN OLD.account_id ELSE NEW.account_id END;
 UPDATE account SET auth_generation=auth_generation+1,lock_version=lock_version+1,updated_at=transaction_timestamp() WHERE id=owner_id;
 DELETE FROM spring_session WHERE principal_name=(SELECT public_id::text FROM account WHERE id=owner_id);
 INSERT INTO security_event(actor_account_id,event_type,request_id,outcome,occurred_at,expires_at)
  SELECT owner_id,'ROLE_CHANGED',gen_random_uuid()::text,'GENERATION_REVOKED',transaction_timestamp(),transaction_timestamp()+interval '90 days' WHERE EXISTS(SELECT 1 FROM account WHERE id=owner_id);
 IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW;
END $$;
CREATE TRIGGER role_generation AFTER INSERT OR DELETE ON account_role FOR EACH ROW EXECUTE FUNCTION role_generation();
CREATE FUNCTION account_security_generation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF OLD.status='DELETING' AND NEW.status<>'DELETING' THEN RAISE EXCEPTION 'deleting account cannot be reactivated' USING ERRCODE='23514',CONSTRAINT='account_deleting'; END IF;
 IF (NEW.password_hash,NEW.status,NEW.email_key) IS DISTINCT FROM (OLD.password_hash,OLD.status,OLD.email_key) THEN NEW.auth_generation=OLD.auth_generation+1; END IF;
 IF NEW.auth_generation<OLD.auth_generation THEN RAISE EXCEPTION 'security generation cannot decrease' USING ERRCODE='23514',CONSTRAINT='auth_generation'; END IF;
 IF NEW.auth_generation>OLD.auth_generation THEN
  DELETE FROM spring_session WHERE principal_name=OLD.public_id::text;
  UPDATE auth_token SET revoked_at=transaction_timestamp() WHERE account_id=OLD.id AND revoked_at IS NULL;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER account_security_generation BEFORE UPDATE ON account FOR EACH ROW EXECUTE FUNCTION account_security_generation();
CREATE FUNCTION retire_account_sessions() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN DELETE FROM spring_session WHERE principal_name=OLD.public_id::text; RETURN OLD; END $$;
CREATE TRIGGER erase_sessions BEFORE DELETE ON account FOR EACH ROW EXECUTE FUNCTION retire_account_sessions();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON enrollment FOR EACH ROW EXECUTE FUNCTION protect_owner();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON learning_progress FOR EACH ROW EXECUTE FUNCTION protect_owner();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON bookmark FOR EACH ROW EXECUTE FUNCTION protect_owner();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON private_note FOR EACH ROW EXECUTE FUNCTION protect_owner();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON quiz_attempt FOR EACH ROW EXECUTE FUNCTION protect_owner();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON remediation_record FOR EACH ROW EXECUTE FUNCTION protect_owner();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON assessment_request FOR EACH ROW EXECUTE FUNCTION protect_owner();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON practice_response FOR EACH ROW EXECUTE FUNCTION protect_owner();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON project_work FOR EACH ROW EXECUTE FUNCTION protect_owner();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON mastery_evidence FOR EACH ROW EXECUTE FUNCTION protect_owner();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON evidence_recheck FOR EACH ROW EXECUTE FUNCTION protect_owner();

CREATE TRIGGER active_owner BEFORE INSERT OR UPDATE ON content_issue FOR EACH ROW EXECUTE FUNCTION protect_owner();
