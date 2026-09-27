ALTER TABLE auth_challenge DROP CONSTRAINT auth_challenge_session_primary_id_fk;
ALTER TABLE auth_challenge ADD CONSTRAINT auth_challenge_session_primary_id_fk FOREIGN KEY(session_primary_id) REFERENCES spring_session(primary_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalog_route ADD CONSTRAINT route_segment_length_ck CHECK(path_key ~ '^/[a-z0-9]([a-z0-9-]{0,158}[a-z0-9])?(/[a-z0-9]([a-z0-9-]{0,158}[a-z0-9])?)*$');

-- Database revision body hash v1: deterministic jsonb, common fields + every owned child.
-- Internal IDs make this a database revision digest; interchange has its separate package hash.
CREATE FUNCTION revision_body_hash(rid bigint, common_body jsonb) RETURNS text LANGUAGE plpgsql STABLE AS $$
DECLARE item record; body jsonb; rows_json jsonb;
BEGIN
 body=jsonb_build_object('codec','p08-db-jsonb-v1','common',common_body-ARRAY['id','created_at','sealed_at','content_hash']);
 FOR item IN
  SELECT * FROM (VALUES
   ('competency_revision','revision_id'),('resource_revision','revision_id'),('assignment_revision','revision_id'),('exercise_revision','revision_id'),('blueprint_revision','revision_id'),('project_revision','revision_id'),('path_revision','revision_id'),('decision_revision','revision_id'),('policy_revision','revision_id'),('rule_revision','revision_id'),('archive_revision','revision_id'),('quiz_revision','revision_id'),('question_revision','revision_id'),
   ('revision_tag','revision_id'),('revision_section','revision_id'),('catalog_link','owner_revision_id'),('hard_prerequisite','owner_revision_id'),('recommended_preparation','owner_revision_id'),('optional_enrichment','owner_revision_id'),('resource_locator','resource_revision_id'),('resource_unknown','resource_revision_id'),('resource_segment','resource_revision_id'),('blueprint_item','blueprint_revision_id'),('rubric_criterion','owner_revision_id'),('revision_provenance','revision_id'),('assignment_claim','assignment_revision_id'),('question_choice','question_revision_id'),('quiz_form','quiz_revision_id'),('course_gate','path_revision_id'),('course_project','path_revision_id'),('path_topic_prerequisite','path_revision_id'),('assessment_competency','assessment_revision_id'),('project_field','project_revision_id'),('quiz_remediation_requirement','quiz_revision_id'),('rule_dependency','dependent_revision_id')
  ) AS owned(table_name,column_name) ORDER BY table_name
 LOOP
  EXECUTE format('SELECT coalesce(jsonb_agg(to_jsonb(c)-''created_at'' ORDER BY to_jsonb(c)::text),''[]''::jsonb) FROM %I c WHERE %I=$1',item.table_name,item.column_name) INTO rows_json USING rid;
  IF rows_json<>'[]'::jsonb THEN body=body||jsonb_build_object(item.table_name,rows_json); END IF;
 END LOOP;
 SELECT coalesce(jsonb_agg(to_jsonb(i) ORDER BY i.form_id,i.ordinal),'[]'::jsonb) INTO rows_json FROM quiz_form_item i JOIN quiz_form f ON f.id=i.form_id WHERE f.quiz_revision_id=rid;
 body=body||jsonb_build_object('quiz_form_item',rows_json);
 RETURN encode(sha256(convert_to(body::text,'UTF8')),'hex');
END $$;
CREATE FUNCTION hash_at_sealing() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='INSERT' AND NEW.sealed_at IS NOT NULL THEN RAISE EXCEPTION 'assemble revision before sealing' USING ERRCODE='23514',CONSTRAINT='revision_assembly'; END IF;
 IF TG_OP='UPDATE' AND OLD.sealed_at IS NULL AND NEW.sealed_at IS NOT NULL THEN NEW.content_hash=revision_body_hash(NEW.id,to_jsonb(NEW)); END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER hash_at_sealing BEFORE INSERT OR UPDATE ON catalog_revision FOR EACH ROW EXECUTE FUNCTION hash_at_sealing();
-- Keep previously accepted revision hashes untouched; this is a forward codec transition.
CREATE FUNCTION check_certification_effective_dates() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM rule_revision WHERE revision_id=NEW.rule_revision_id AND effective_from IS NOT NULL AND lower(NEW.valid_dates)>=effective_from AND (effective_to IS NULL OR upper(NEW.valid_dates)<=effective_to)) THEN
  RAISE EXCEPTION 'certification cannot exceed known effective dates or invent an unknown start' USING ERRCODE='23514',CONSTRAINT='certification_effective_dates'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER certification_effective_dates AFTER INSERT OR UPDATE ON rule_certification DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_certification_effective_dates();
REVOKE ALL ON FUNCTION revision_body_hash(bigint,jsonb),hash_at_sealing(),check_certification_effective_dates() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION revision_body_hash(bigint,jsonb),hash_at_sealing(),check_certification_effective_dates() TO otr_runtime,otr_import,otr_privacy;
