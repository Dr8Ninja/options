-- P08 transactional invariants. Errors use stable constraint names, never private values.
CREATE FUNCTION reject_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'immutable record' USING ERRCODE='23514', CONSTRAINT='immutable_record'; END $$;

CREATE FUNCTION protect_catalog_object() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' OR NEW.external_id<>OLD.external_id OR NEW.kind<>OLD.kind THEN
  RAISE EXCEPTION 'stable catalog identity cannot be replaced or deleted' USING ERRCODE='23514',CONSTRAINT='stable_catalog_identity';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER stable_catalog_identity BEFORE UPDATE OR DELETE ON catalog_object FOR EACH ROW EXECUTE FUNCTION protect_catalog_object();

CREATE FUNCTION protect_revision() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' OR OLD.sealed_at IS NOT NULL THEN
  RAISE EXCEPTION 'sealed revision is immutable; create a new revision' USING ERRCODE='23514',CONSTRAINT='sealed_revision';
 END IF;
 IF NEW.object_id<>OLD.object_id OR NEW.kind<>OLD.kind OR NEW.revision_no<>OLD.revision_no THEN
  RAISE EXCEPTION 'revision identity is immutable' USING ERRCODE='23514',CONSTRAINT='revision_identity';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER sealed_revision BEFORE UPDATE OR DELETE ON catalog_revision FOR EACH ROW EXECUTE FUNCTION protect_revision();

CREATE FUNCTION protect_revision_child() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE rid bigint; oldrid bigint;
BEGIN
 IF TG_OP<>'INSERT' THEN oldrid=(to_jsonb(OLD)->>TG_ARGV[0])::bigint; END IF;
 IF TG_OP<>'DELETE' THEN rid=(to_jsonb(NEW)->>TG_ARGV[0])::bigint; END IF;
 IF TG_ARGV[1]='form' THEN
  SELECT quiz_revision_id INTO rid FROM quiz_form WHERE id=rid;
  SELECT quiz_revision_id INTO oldrid FROM quiz_form WHERE id=oldrid;
 END IF;
 IF EXISTS(SELECT 1 FROM catalog_revision WHERE id IN(rid,oldrid) AND sealed_at IS NOT NULL) THEN
  RAISE EXCEPTION 'sealed revision child is immutable' USING ERRCODE='23514',CONSTRAINT='sealed_revision_child';
 END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $$;

CREATE FUNCTION validate_revision() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE r catalog_revision; required_table text; present boolean; q question_revision; quiz quiz_revision;
BEGIN
 SELECT * INTO r FROM catalog_revision WHERE id=NEW.id;
 IF r.sealed_at IS NULL THEN RAISE EXCEPTION 'revision must be assembled and sealed in one transaction' USING ERRCODE='23514',CONSTRAINT='revision_complete'; END IF;
 required_table=CASE r.kind
 WHEN 'COMPETENCY' THEN 'competency_revision' WHEN 'RESOURCE' THEN 'resource_revision'
 WHEN 'ASSIGNMENT' THEN 'assignment_revision' WHEN 'EXERCISE' THEN 'exercise_revision'
 WHEN 'BLUEPRINT' THEN 'blueprint_revision' WHEN 'PROJECT' THEN 'project_revision'
 WHEN 'PATH' THEN 'path_revision' WHEN 'DECISION' THEN 'decision_revision'
 WHEN 'POLICY' THEN 'policy_revision' WHEN 'RULE' THEN 'rule_revision'
 WHEN 'ARCHIVE' THEN 'archive_revision' WHEN 'QUIZ' THEN 'quiz_revision'
 WHEN 'QUESTION' THEN 'question_revision' END;
 IF required_table IS NOT NULL THEN
  EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE revision_id=$1)',required_table) INTO present USING r.id;
  IF NOT present THEN RAISE EXCEPTION 'required typed revision detail is missing' USING ERRCODE='23514',CONSTRAINT='revision_detail_complete'; END IF;
 END IF;
 IF r.kind IN ('EXERCISE','PROJECT') AND (SELECT coalesce(sum(weight),0) FROM rubric_criterion WHERE owner_revision_id=r.id)<>100 THEN
  RAISE EXCEPTION 'rubric weights must total 100' USING ERRCODE='23514',CONSTRAINT='rubric_total'; END IF;
 IF r.kind='BLUEPRINT' AND (SELECT coalesce(sum(weight),0) FROM blueprint_item WHERE blueprint_revision_id=r.id)<>100 THEN
  RAISE EXCEPTION 'blueprint weights must total 100' USING ERRCODE='23514',CONSTRAINT='blueprint_total'; END IF;
 IF r.kind='QUESTION' THEN
  SELECT * INTO q FROM question_revision WHERE revision_id=r.id;
  IF (q.question_type='SINGLE' AND (SELECT count(*) FROM question_choice WHERE question_revision_id=r.id AND correct)<>1)
   OR (q.question_type='MULTI' AND NOT EXISTS(SELECT 1 FROM question_choice WHERE question_revision_id=r.id AND correct))
   OR (q.question_type='NUMERIC' AND EXISTS(SELECT 1 FROM question_choice WHERE question_revision_id=r.id)) THEN
   RAISE EXCEPTION 'question choice/type mismatch' USING ERRCODE='23514',CONSTRAINT='question_choices'; END IF;
 END IF;
 IF r.kind='QUIZ' THEN
  SELECT * INTO quiz FROM quiz_revision WHERE revision_id=r.id;
  IF (SELECT count(*) FROM quiz_form WHERE quiz_revision_id=r.id)<>quiz.max_fresh_forms OR EXISTS(
   SELECT 1 FROM quiz_form f LEFT JOIN quiz_form_item i ON i.form_id=f.id
    LEFT JOIN question_revision qr ON qr.revision_id=i.question_revision_id WHERE f.quiz_revision_id=r.id
   GROUP BY f.id HAVING count(i.ordinal)<>quiz.expected_items OR sum(i.weight)<>100
    OR (quiz.purpose='GATE' AND (count(*) FILTER(WHERE qr.critical)<>3 OR min(i.weight)<>10 OR max(i.weight)<>10))) THEN
   RAISE EXCEPTION 'quiz form cardinality, critical items or weights invalid' USING ERRCODE='23514',CONSTRAINT='quiz_form_complete'; END IF;
 END IF;
 IF r.kind='RESOURCE' AND EXISTS(SELECT 1 FROM resource_revision rr CROSS JOIN LATERAL
  (VALUES ('DOI',rr.doi),('edition',rr.edition),('publication_date',rr.publication_date_raw),('updated_date',rr.updated_date_raw),('video_timestamps',rr.video_timestamp_reason)) missing(field,value)
  WHERE rr.revision_id=r.id AND missing.value IS NULL AND NOT EXISTS(SELECT 1 FROM resource_unknown u WHERE u.resource_revision_id=r.id AND u.field=missing.field)) THEN
  RAISE EXCEPTION 'unknown resource metadata needs an explicit reason' USING ERRCODE='23514',CONSTRAINT='resource_unknown_reason'; END IF;
 IF EXISTS(SELECT 1 FROM rubric_criterion WHERE owner_revision_id=r.id) AND r.kind NOT IN ('EXERCISE','PROJECT') THEN
  RAISE EXCEPTION 'invalid rubric owner kind' USING ERRCODE='23514',CONSTRAINT='rubric_kind'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER revision_complete AFTER INSERT OR UPDATE ON catalog_revision DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION validate_revision();

CREATE FUNCTION protect_route() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' OR OLD.object_id<>NEW.object_id OR OLD.path_key<>NEW.path_key THEN
  RAISE EXCEPTION 'route reservations are permanent' USING ERRCODE='23514',CONSTRAINT='permanent_route'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER permanent_route BEFORE UPDATE OR DELETE ON catalog_route FOR EACH ROW EXECUTE FUNCTION protect_route();

CREATE FUNCTION catalog_graph_lock() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN PERFORM pg_advisory_xact_lock(8042026); IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW; END $$;
CREATE TRIGGER graph_lock BEFORE INSERT OR UPDATE OR DELETE ON draft_head FOR EACH STATEMENT EXECUTE FUNCTION catalog_graph_lock();
CREATE TRIGGER graph_lock BEFORE INSERT OR UPDATE OR DELETE ON catalog_object FOR EACH STATEMENT EXECUTE FUNCTION catalog_graph_lock();
CREATE TRIGGER graph_lock BEFORE INSERT OR UPDATE OR DELETE ON active_publication FOR EACH STATEMENT EXECUTE FUNCTION catalog_graph_lock();

CREATE FUNCTION validate_dependency_graph(manifest bigint DEFAULT NULL) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
 IF EXISTS(
  WITH RECURSIVE selected AS (
   SELECT object_id,revision_id FROM publication_entry WHERE publication_id=manifest
   UNION ALL SELECT object_id,revision_id FROM draft_head WHERE manifest IS NULL
  ), contracted AS (
   SELECT s.object_id,coalesce(c.module_object_id,s.object_id) node FROM selected s
   LEFT JOIN competency_revision c ON c.revision_id=s.revision_id
  ), edges AS (
   SELECT 'hard' graph,coalesce(a.node,s.object_id) src,coalesce(b.node,h.requires_object_id) dst
    FROM selected s JOIN hard_prerequisite h ON h.owner_revision_id=s.revision_id
    LEFT JOIN contracted a ON a.object_id=s.object_id LEFT JOIN contracted b ON b.object_id=h.requires_object_id
   UNION ALL SELECT 'recommended',coalesce(a.node,s.object_id),coalesce(b.node,h.requires_object_id)
    FROM selected s JOIN recommended_preparation h ON h.owner_revision_id=s.revision_id
    LEFT JOIN contracted a ON a.object_id=s.object_id LEFT JOIN contracted b ON b.object_id=h.requires_object_id
   UNION ALL SELECT 'successor',id,successor_id FROM catalog_object WHERE successor_id IS NOT NULL
   UNION ALL SELECT 'replacement',s.object_id,l.target_object_id FROM selected s JOIN catalog_link l ON l.owner_revision_id=s.revision_id WHERE l.relation IN ('replaces','supersedes_resource','source_successor')
   UNION ALL SELECT 'notice',older_notice_id,newer_notice_id FROM notice_supersession
   UNION ALL SELECT 'rule',older_rule_id,newer_rule_id FROM rule_supersession
  ), walk(graph,src,dst) AS (
   SELECT graph,src,dst FROM edges UNION SELECT w.graph,w.src,e.dst FROM walk w JOIN edges e ON e.graph=w.graph AND e.src=w.dst
  ) SELECT 1 FROM walk WHERE src=dst
 ) THEN RAISE EXCEPTION 'dependency or successor cycle' USING ERRCODE='23514',CONSTRAINT='acyclic_catalog_graph'; END IF;
 IF EXISTS(SELECT 1 FROM catalog_object a JOIN catalog_object b ON b.id=a.successor_id WHERE a.kind<>b.kind) THEN
  RAISE EXCEPTION 'successor kind mismatch' USING ERRCODE='23514',CONSTRAINT='successor_kind'; END IF;
END $$;
CREATE FUNCTION check_draft_graph() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN PERFORM validate_dependency_graph(NULL); RETURN NULL; END $$;
CREATE CONSTRAINT TRIGGER draft_graph AFTER INSERT OR UPDATE OR DELETE ON draft_head DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_draft_graph();
CREATE CONSTRAINT TRIGGER successor_graph AFTER INSERT OR UPDATE ON catalog_object DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_draft_graph();
CREATE TRIGGER graph_lock BEFORE INSERT OR UPDATE OR DELETE ON notice_supersession FOR EACH STATEMENT EXECUTE FUNCTION catalog_graph_lock();
CREATE TRIGGER graph_lock BEFORE INSERT OR UPDATE OR DELETE ON rule_supersession FOR EACH STATEMENT EXECUTE FUNCTION catalog_graph_lock();
CREATE CONSTRAINT TRIGGER notice_graph AFTER INSERT OR UPDATE ON notice_supersession DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_draft_graph();
CREATE CONSTRAINT TRIGGER rule_graph AFTER INSERT OR UPDATE ON rule_supersession DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_draft_graph();

CREATE FUNCTION validate_publication(pid bigint) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(8042026);
 PERFORM validate_dependency_graph(pid);
 IF NOT EXISTS(SELECT 1 FROM publication_entry WHERE publication_id=pid) THEN
  RAISE EXCEPTION 'empty publication' USING ERRCODE='23514',CONSTRAINT='publication_nonempty'; END IF;
 IF EXISTS(SELECT 1 FROM publication_entry e JOIN catalog_revision r ON r.id=e.revision_id JOIN catalog_object o ON o.id=e.object_id
  WHERE e.publication_id=pid AND (r.sealed_at IS NULL OR o.retired_at IS NOT NULL
   OR (r.kind IN ('QUIZ','QUESTION') AND e.visibility<>'PROTECTED')
   OR (r.kind='ARCHIVE' AND e.visibility<>'ARCHIVE')
   OR (e.visibility='LESSON' AND (r.kind NOT IN ('TOPIC','SUBTOPIC') OR r.readiness<>'reviewed_lesson' OR r.lesson_markdown IS NULL))
   OR NOT EXISTS(SELECT 1 FROM review_decision d WHERE d.revision_id=r.id AND d.reviewed_hash=r.content_hash AND d.review_type='rights' AND d.outcome='APPROVE'
     AND NOT EXISTS(SELECT 1 FROM review_decision later WHERE later.revision_id=d.revision_id AND later.review_type=d.review_type AND (later.decided_at,later.id)>(d.decided_at,d.id)))
   OR (e.visibility='LESSON' AND (SELECT count(DISTINCT d.review_type) FROM review_decision d WHERE d.revision_id=r.id AND d.reviewed_hash=r.content_hash AND d.outcome='APPROVE' AND d.review_type IN ('technical','pedagogy','accessibility','rights')
     AND NOT EXISTS(SELECT 1 FROM review_decision later WHERE later.revision_id=d.revision_id AND later.review_type=d.review_type AND (later.decided_at,later.id)>(d.decided_at,d.id)))<>4)
   OR (e.visibility='PROTECTED' AND NOT EXISTS(SELECT 1 FROM review_decision d WHERE d.revision_id=r.id AND d.reviewed_hash=r.content_hash AND d.outcome='APPROVE' AND d.review_type='assessment'
     AND NOT EXISTS(SELECT 1 FROM review_decision later WHERE later.revision_id=d.revision_id AND later.review_type=d.review_type AND (later.decided_at,later.id)>(d.decided_at,d.id)))))) THEN
  RAISE EXCEPTION 'publication visibility or exact revision review is invalid' USING ERRCODE='23514',CONSTRAINT='publication_review'; END IF;
 IF EXISTS(
  WITH required AS (
   SELECT l.owner_revision_id,l.target_object_id target FROM catalog_link l
   UNION ALL SELECT owner_revision_id,requires_object_id FROM hard_prerequisite
   UNION ALL SELECT owner_revision_id,requires_object_id FROM recommended_preparation
   UNION ALL SELECT owner_revision_id,target_object_id FROM optional_enrichment
  ) SELECT 1 FROM required x JOIN publication_entry owner ON owner.revision_id=x.owner_revision_id AND owner.publication_id=pid
    WHERE NOT EXISTS(SELECT 1 FROM publication_entry t WHERE t.publication_id=pid AND t.object_id=x.target)
 ) THEN RAISE EXCEPTION 'publication has an unresolved stable reference' USING ERRCODE='23514',CONSTRAINT='publication_closure'; END IF;
 IF EXISTS(SELECT 1 FROM catalog_link l JOIN publication_entry e ON e.revision_id=l.owner_revision_id WHERE e.publication_id=pid AND l.relation IN ('program_phase','topic_subtopic') GROUP BY l.relation,l.target_object_id HAVING count(*)>1)
 OR EXISTS(SELECT 1 FROM publication_entry p JOIN catalog_link phases ON phases.owner_revision_id=p.revision_id AND phases.relation='program_phase'
  JOIN publication_entry ph ON ph.publication_id=pid AND ph.object_id=phases.target_object_id
  JOIN catalog_link modules ON modules.owner_revision_id=ph.revision_id AND modules.relation='phase_module'
  WHERE p.publication_id=pid GROUP BY p.object_id,modules.target_object_id HAVING count(*)>1)
 OR EXISTS(SELECT 1 FROM catalog_link l JOIN publication_entry e ON e.revision_id=l.owner_revision_id WHERE e.publication_id=pid AND l.relation='module_topic'
  GROUP BY l.target_object_id HAVING count(*)>1 AND count(l.annotation)<count(*)-1) THEN
  RAISE EXCEPTION 'publication hierarchy placement or revisit is invalid' USING ERRCODE='23514',CONSTRAINT='publication_hierarchy'; END IF;
 IF EXISTS(SELECT 1 FROM publication_entry e JOIN catalog_revision r ON r.id=e.revision_id WHERE e.publication_id=pid AND r.kind='MODULE' AND
  ((SELECT count(*) FROM catalog_link WHERE owner_revision_id=r.id AND relation='module_domain')<>1 OR
   (SELECT count(*) FROM catalog_link WHERE owner_revision_id=r.id AND relation='outcome' AND ordinal=1)<>1 OR
   (SELECT count(*) FROM catalog_link WHERE owner_revision_id=r.id AND relation='assessment' AND target_kind='BLUEPRINT')<>1)) THEN
  RAISE EXCEPTION 'module primary domain, outcome or blueprint missing' USING ERRCODE='23514',CONSTRAINT='module_cardinality'; END IF;
 IF EXISTS(SELECT 1 FROM publication_entry e JOIN competency_revision c ON c.revision_id=e.revision_id
   JOIN publication_entry m ON m.publication_id=pid AND m.object_id=c.module_object_id
   WHERE e.publication_id=pid AND NOT EXISTS(SELECT 1 FROM catalog_link l WHERE l.owner_revision_id=m.revision_id AND l.relation='outcome' AND l.ordinal=1 AND l.target_object_id=e.object_id)) THEN
  RAISE EXCEPTION 'module/competency primary outcome mismatch' USING ERRCODE='23514',CONSTRAINT='primary_outcome_reciprocity'; END IF;
 IF EXISTS(SELECT 1 FROM publication_entry e JOIN assignment_revision a ON a.revision_id=e.revision_id WHERE e.publication_id=pid
  GROUP BY a.resource_object_id,a.competency_object_id,lower(btrim(a.reading_scope)),lower(btrim(a.purpose)),
   (SELECT coalesce(array_agg(l.target_object_id ORDER BY l.ordinal),'{}') FROM catalog_link l WHERE l.owner_revision_id=a.revision_id AND l.relation='assignment_topic') HAVING count(*)>1) THEN
  RAISE EXCEPTION 'duplicate semantic reading assignment requires a revised explicit scope' USING ERRCODE='23514',CONSTRAINT='assignment_semantic_duplicate'; END IF;
END $$;

CREATE FUNCTION protect_publication() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' OR OLD.status='SEALED' THEN RAISE EXCEPTION 'sealed manifest is immutable' USING ERRCODE='23514',CONSTRAINT='sealed_manifest'; END IF;
 IF NEW.status='SEALED' THEN PERFORM validate_publication(NEW.id); END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER sealed_manifest BEFORE UPDATE OR DELETE ON publication FOR EACH ROW EXECUTE FUNCTION protect_publication();
CREATE FUNCTION protect_manifest_entry() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM publication WHERE id IN(CASE WHEN TG_OP<>'DELETE' THEN NEW.publication_id END,CASE WHEN TG_OP<>'INSERT' THEN OLD.publication_id END) AND status='SEALED') THEN
  RAISE EXCEPTION 'sealed manifest entries cannot change' USING ERRCODE='23514',CONSTRAINT='sealed_manifest_entry'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW;
END $$;
CREATE TRIGGER sealed_manifest_entry BEFORE INSERT OR UPDATE OR DELETE ON publication_entry FOR EACH ROW EXECUTE FUNCTION protect_manifest_entry();
CREATE FUNCTION check_activation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'publication pointer cannot be deleted' USING ERRCODE='23514',CONSTRAINT='publication_pointer'; END IF;
 IF NOT EXISTS(SELECT 1 FROM publication WHERE id=NEW.publication_id AND status='SEALED') OR (TG_OP='UPDATE' AND NEW.generation<>OLD.generation+1) THEN
  RAISE EXCEPTION 'activation requires sealed manifest and next generation' USING ERRCODE='23514',CONSTRAINT='publication_generation'; END IF;
 PERFORM validate_publication(NEW.publication_id);
 RETURN NEW;
END $$;
CREATE TRIGGER publication_activation BEFORE INSERT OR UPDATE OR DELETE ON active_publication FOR EACH ROW EXECUTE FUNCTION check_activation();

CREATE FUNCTION check_rule_certification() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM rule_revision r JOIN rule_subject s ON s.id=r.subject_id JOIN verification_event v ON v.subject_revision_id=r.revision_id
  WHERE r.revision_id=NEW.rule_revision_id AND r.subject_id=NEW.subject_id AND v.id=NEW.verification_id AND v.method='rule_chain' AND v.outcome='verified'
   AND s.market_zone IS NOT NULL AND NEW.review_due_at<=v.next_due_at
   AND NEW.review_due_at>v.checked_at AND upper(NEW.valid_dates)<=((NEW.review_due_at AT TIME ZONE s.market_zone)::date+1)) THEN
  RAISE EXCEPTION 'certification must match the verified rule, subject and finite review window' USING ERRCODE='23514',CONSTRAINT='certification_consistency'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER certification_consistency AFTER INSERT OR UPDATE ON rule_certification DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_rule_certification();
