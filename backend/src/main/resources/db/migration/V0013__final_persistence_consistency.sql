CREATE FUNCTION project_rubric_consistency() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE w project_work; expected_score numeric; has_rubric boolean;
BEGIN
 SELECT * INTO w FROM project_work WHERE id=CASE WHEN TG_TABLE_NAME='project_work' THEN (to_jsonb(NEW)->>'id')::bigint ELSE coalesce((to_jsonb(NEW)->>'work_id')::bigint,(to_jsonb(OLD)->>'work_id')::bigint) END;
 IF w.id IS NULL THEN RETURN NULL; END IF;
 IF EXISTS(SELECT 1 FROM project_response r JOIN project_field f ON f.project_revision_id=r.project_revision_id AND f.field_key=r.field_key WHERE r.work_id=w.id AND f.field_type='SELF_RUBRIC' AND (r.numeric_value<0 OR r.numeric_value>100)) THEN
  RAISE EXCEPTION 'self rubric rating must be 0 to 100' USING ERRCODE='23514',CONSTRAINT='self_rubric_range'; END IF;
 IF w.state='SELF_REVIEWED' THEN
  SELECT EXISTS(SELECT 1 FROM project_field WHERE project_revision_id=w.project_revision_id AND field_type='SELF_RUBRIC') INTO has_rubric;
  SELECT sum(r.numeric_value*c.weight/100) INTO expected_score FROM project_response r JOIN rubric_criterion c ON c.owner_revision_id=r.project_revision_id AND c.code=r.field_key JOIN project_field f ON f.project_revision_id=r.project_revision_id AND f.field_key=r.field_key WHERE r.work_id=w.id AND f.field_type='SELF_RUBRIC';
  IF NOT has_rubric OR expected_score IS NULL OR w.self_review_score<>expected_score OR EXISTS(SELECT 1 FROM rubric_criterion c WHERE c.owner_revision_id=w.project_revision_id AND NOT EXISTS(SELECT 1 FROM project_response r WHERE r.work_id=w.id AND r.field_key=c.code)) THEN
   RAISE EXCEPTION 'self-review score must match every pinned weighted rubric rating' USING ERRCODE='23514',CONSTRAINT='self_rubric_score'; END IF;
 END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER self_rubric_score AFTER INSERT OR UPDATE ON project_work DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION project_rubric_consistency();
CREATE CONSTRAINT TRIGGER self_rubric_value AFTER INSERT OR UPDATE OR DELETE ON project_response DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION project_rubric_consistency();
CREATE FUNCTION project_field_rubric() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM project_field f WHERE f.project_revision_id=NEW.id AND f.field_type='SELF_RUBRIC' AND NOT EXISTS(SELECT 1 FROM rubric_criterion c WHERE c.owner_revision_id=f.project_revision_id AND c.code=f.field_key)) THEN
  RAISE EXCEPTION 'self rubric field must reference a pinned criterion' USING ERRCODE='23514',CONSTRAINT='project_rubric_field'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER project_rubric_field AFTER INSERT OR UPDATE ON catalog_revision DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION project_field_rubric();
REVOKE ALL ON FUNCTION project_rubric_consistency(),project_field_rubric() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION project_rubric_consistency(),project_field_rubric() TO otr_runtime,otr_import,otr_privacy;
-- A sealed manifest digest covers the actual selected entries, not caller-provided text.
CREATE OR REPLACE FUNCTION protect_publication() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' OR OLD.status='SEALED' THEN RAISE EXCEPTION 'sealed manifest is immutable' USING ERRCODE='23514',CONSTRAINT='sealed_manifest'; END IF;
 IF NEW.status='SEALED' THEN
  PERFORM validate_publication(NEW.id);
  SELECT encode(sha256(convert_to(coalesce(jsonb_agg(to_jsonb(e)-'publication_id' ORDER BY e.object_id),'[]'::jsonb)::text,'UTF8')),'hex') INTO NEW.manifest_hash FROM publication_entry e WHERE e.publication_id=NEW.id;
 END IF;
 RETURN NEW;
END $$;
ALTER TABLE quiz_form ADD CONSTRAINT quiz_distinct_exposure_groups UNIQUE(quiz_revision_id,exposure_group);
CREATE FUNCTION quiz_exact_exposure_lineage() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.kind='QUIZ' AND EXISTS(SELECT 1 FROM quiz_form mine JOIN quiz_form_item mi ON mi.form_id=mine.id
  JOIN quiz_form_item previous ON previous.question_revision_id=mi.question_revision_id JOIN quiz_form other ON other.id=previous.form_id
  WHERE mine.quiz_revision_id=NEW.id AND mine.exposure_group<>other.exposure_group) THEN
  RAISE EXCEPTION 'reusing an exact question cannot create a new exposure group' USING ERRCODE='23514',CONSTRAINT='question_exposure_lineage'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER question_exposure_lineage AFTER INSERT OR UPDATE ON catalog_revision DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION quiz_exact_exposure_lineage();
REVOKE ALL ON FUNCTION quiz_exact_exposure_lineage() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION quiz_exact_exposure_lineage() TO otr_runtime,otr_import,otr_privacy;
