-- P08 aggregate guards and measured-access candidates.

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON source_artifact FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON provenance_anchor FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON source_record FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON source_mapping FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON mapping_anchor FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON mapping_target FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON evidence_claim FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON verification_event FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON official_notice FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON review_decision FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON editorial_event FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON recovery_journal FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON assessment_exposure_group FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON revision_equivalence FOR EACH ROW EXECUTE FUNCTION reject_immutable();

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON competency_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON resource_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON assignment_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON exercise_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON blueprint_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON project_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON path_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON decision_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON policy_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON archive_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON rule_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON quiz_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON question_revision FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON revision_tag FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON revision_section FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON catalog_link FOR EACH ROW EXECUTE FUNCTION protect_revision_child('owner_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON hard_prerequisite FOR EACH ROW EXECUTE FUNCTION protect_revision_child('owner_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON recommended_preparation FOR EACH ROW EXECUTE FUNCTION protect_revision_child('owner_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON optional_enrichment FOR EACH ROW EXECUTE FUNCTION protect_revision_child('owner_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON resource_locator FOR EACH ROW EXECUTE FUNCTION protect_revision_child('resource_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON resource_unknown FOR EACH ROW EXECUTE FUNCTION protect_revision_child('resource_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON resource_segment FOR EACH ROW EXECUTE FUNCTION protect_revision_child('resource_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON blueprint_item FOR EACH ROW EXECUTE FUNCTION protect_revision_child('blueprint_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON rubric_criterion FOR EACH ROW EXECUTE FUNCTION protect_revision_child('owner_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON revision_provenance FOR EACH ROW EXECUTE FUNCTION protect_revision_child('revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON assignment_claim FOR EACH ROW EXECUTE FUNCTION protect_revision_child('assignment_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON question_choice FOR EACH ROW EXECUTE FUNCTION protect_revision_child('question_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON quiz_form FOR EACH ROW EXECUTE FUNCTION protect_revision_child('quiz_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON course_gate FOR EACH ROW EXECUTE FUNCTION protect_revision_child('path_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON course_project FOR EACH ROW EXECUTE FUNCTION protect_revision_child('path_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON path_topic_prerequisite FOR EACH ROW EXECUTE FUNCTION protect_revision_child('path_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON assessment_competency FOR EACH ROW EXECUTE FUNCTION protect_revision_child('assessment_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON project_field FOR EACH ROW EXECUTE FUNCTION protect_revision_child('project_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON quiz_remediation_requirement FOR EACH ROW EXECUTE FUNCTION protect_revision_child('quiz_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON rule_dependency FOR EACH ROW EXECUTE FUNCTION protect_revision_child('dependent_revision_id','revision');

CREATE TRIGGER sealed_child BEFORE INSERT OR UPDATE OR DELETE ON quiz_form_item FOR EACH ROW EXECUTE FUNCTION protect_revision_child('form_id','form');

CREATE UNIQUE INDEX route_canonical ON catalog_route (object_id) WHERE canonical;

CREATE UNIQUE INDEX authoring_active ON authoring_task (topic_object_id) WHERE status NOT IN ('COMPLETE','CANCELLED');

CREATE UNIQUE INDEX import_once ON import_batch (manifest_sha256) WHERE state='APPLIED';

CREATE UNIQUE INDEX current_enrollment ON enrollment (account_id,path_object_id) WHERE state IN ('CURRENT','COMPLETED','BLOCKED');

CREATE UNIQUE INDEX open_assessment_request ON assessment_request (account_id,quiz_revision_id) WHERE state IN ('OPEN','TRIAGED');

CREATE UNIQUE INDEX project_draft ON project_work (account_id,project_revision_id) WHERE state='DRAFT';

CREATE UNIQUE INDEX active_withdrawal ON content_withdrawal (object_id,revision_id) NULLS NOT DISTINCT WHERE reinstated_at IS NULL;

CREATE  INDEX link_reverse ON catalog_link (target_object_id,relation,owner_revision_id) ;

CREATE  INDEX verification_latest ON verification_event (subject_revision_id,method,checked_on DESC,id DESC) ;

CREATE  INDEX review_latest ON review_decision (revision_id,review_type,decided_at DESC,id DESC) ;

CREATE  INDEX search_browse ON public_search_document (publication_id,kind,title_key,object_id) ;

CREATE  INDEX search_duration ON public_search_document (publication_id,hours_min,object_id) ;

CREATE  INDEX notes_owner_recent ON private_note (account_id,updated_at DESC,id DESC) ;

CREATE  INDEX evidence_owner ON mastery_evidence (account_id,competency_revision_id,awarded_at DESC) ;

CREATE  INDEX job_ready ON job (due_at,id) WHERE state='READY';

CREATE  INDEX job_lease ON job (lease_until,id) WHERE state='RUNNING';

CREATE  INDEX privacy_queue ON privacy_request (state,requested_at) ;

CREATE  INDEX issue_queue ON content_issue (status,created_at) ;

CREATE INDEX search_terms ON public_search_document USING gin(search_vector);

CREATE INDEX auth_token_expiry ON auth_token(expires_at);

CREATE INDEX auth_challenge_expiry ON auth_challenge(expires_at);

CREATE INDEX auth_throttle_expiry ON auth_throttle(expires_at);

CREATE INDEX security_event_expiry ON security_event(expires_at);

CREATE INDEX privacy_request_expiry ON privacy_request(expires_at);

CREATE INDEX recovery_journal_expiry ON recovery_journal(expires_at);

CREATE INDEX command_receipt_expiry ON command_receipt(expiry_at);

DO $$ DECLARE r record; key_sql text; BEGIN
 FOR r IN SELECT c.oid,c.conrelid,c.conkey,c.conname,n.nspname,t.relname FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid JOIN pg_namespace n ON n.oid=t.relnamespace
 WHERE c.contype='f' AND n.nspname=current_schema() AND NOT EXISTS(SELECT 1 FROM pg_index i WHERE i.indrelid=c.conrelid AND i.indisvalid AND i.indpred IS NULL AND (i.indkey::smallint[])[0:cardinality(c.conkey)-1] @> c.conkey)
 LOOP
  SELECT string_agg(quote_ident(a.attname),',' ORDER BY k.ord) INTO key_sql FROM unnest(r.conkey) WITH ORDINALITY k(num,ord) JOIN pg_attribute a ON a.attrelid=r.conrelid AND a.attnum=k.num;
  EXECUTE format('CREATE INDEX %I ON %I.%I (%s)',left(r.conname,55)||'_idx',r.nspname,r.relname,key_sql);
 END LOOP;
END $$;
