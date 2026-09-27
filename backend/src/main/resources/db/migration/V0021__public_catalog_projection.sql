-- Public read projection is rebuilt in the same transaction as publication activation.
-- Never reads draft_head, raw imports, protected sections or answer-bearing bodies.
CREATE FUNCTION public_text_key(value text) RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE
AS $$ SELECT casefold(normalize(value,NFC) COLLATE "pg_unicode_fast") COLLATE "C" $$;

CREATE TABLE public_route_snapshot (
 publication_id bigint NOT NULL,
 object_id bigint NOT NULL,
 canonical_path varchar(300) NOT NULL,
 PRIMARY KEY(publication_id,object_id),
 FOREIGN KEY(publication_id,object_id) REFERENCES publication_entry(publication_id,object_id)
);
CREATE INDEX public_route_snapshot_path ON public_route_snapshot(canonical_path,object_id);
GRANT SELECT,INSERT ON public_route_snapshot TO otr_runtime;

CREATE VIEW public_catalog_entry AS
SELECT e.publication_id,e.object_id,e.revision_id,o.external_id,o.kind,r.content_hash,
 r.title, public_text_key(r.title) COLLATE "C" title_key,
 CASE WHEN e.visibility='PROTECTED' THEN 'MAP' ELSE e.visibility END visibility,
 r.readiness,coalesce(nullif(left(r.scope_outline,16000),''),r.title) summary,
 r.difficulty,r.priority,r.hours_min,r.hours_max,
 coalesce(nullif(r.estimate_basis,''),'Study time has not been estimated.') estimate_basis,
 coalesce(frozen.canonical_path,route.path_key,'/' || CASE o.kind WHEN 'PATH' THEN 'paths' WHEN 'QUIZ' THEN 'quizzes' ELSE lower(o.kind)||'s' END || '/' || o.external_id) canonical_path,
 coalesce(tags.values,'{}'::text[]) tags,
 rr.author_organization,rr.resource_type,rr.cost,rr.geography,
 CASE WHEN o.kind='RESOURCE' THEN r.source_status END verification_status,
 verified.checked_on verified_on,
 array_position(ARRAY['Essential','Very Important','Recommended','Useful','Advanced','Specialized','Optional','Reference'],r.priority) priority_order,
 o.retired_at,
 EXISTS(SELECT 1 FROM content_withdrawal w WHERE w.object_id=o.id AND (w.revision_id IS NULL OR w.revision_id=r.id) AND w.starts_at<=statement_timestamp() AND w.reinstated_at IS NULL) withdrawn
FROM publication_entry e JOIN catalog_object o ON o.id=e.object_id
JOIN catalog_revision r ON r.id=e.revision_id
LEFT JOIN public_route_snapshot frozen ON frozen.publication_id=e.publication_id AND frozen.object_id=e.object_id
LEFT JOIN catalog_route route ON route.object_id=o.id AND route.canonical
LEFT JOIN resource_revision rr ON rr.revision_id=r.id
LEFT JOIN LATERAL (SELECT array_agg(t.slug ORDER BY t.slug COLLATE "C") values FROM revision_tag rt JOIN tag t ON t.id=rt.tag_id WHERE rt.revision_id=r.id) tags ON true
LEFT JOIN LATERAL (SELECT v.checked_on FROM verification_event v WHERE v.subject_revision_id=r.id AND v.method IN ('selected_sections','technical_review','rule_chain') ORDER BY v.checked_on DESC,v.id DESC LIMIT 1) verified ON true
WHERE e.visibility IN ('MAP','LESSON') OR (e.visibility='PROTECTED' AND o.kind IN ('QUIZ','EXERCISE'));

CREATE TABLE public_catalog_filter (
 publication_id bigint NOT NULL,
 object_id bigint NOT NULL,
 filter_name varchar(32) NOT NULL,
 value text COLLATE "C" NOT NULL,
 PRIMARY KEY(publication_id,object_id,filter_name,value),
 FOREIGN KEY(publication_id,object_id) REFERENCES publication_entry(publication_id,object_id)
);
CREATE INDEX public_filter_lookup ON public_catalog_filter(publication_id,filter_name,value,object_id);
CREATE TABLE publication_activation_history (
 generation bigint PRIMARY KEY,
 publication_id bigint NOT NULL REFERENCES publication(id),
 activated_at timestamptz NOT NULL
);
INSERT INTO publication_activation_history SELECT generation,publication_id,updated_at FROM active_publication;

CREATE FUNCTION rebuild_public_catalog(pid bigint) RETURNS void LANGUAGE plpgsql SET jit=off SET enable_nestloop=off AS $$
BEGIN
 INSERT INTO public_route_snapshot SELECT publication_id,object_id,canonical_path FROM public_catalog_entry WHERE publication_id=pid ON CONFLICT DO NOTHING;
 DELETE FROM public_search_document WHERE publication_id=pid;
 INSERT INTO public_search_document(publication_id,object_id,kind,title,title_key,author_text,summary,search_vector,difficulty,priority,readiness,hours_min)
 SELECT publication_id,object_id,kind,title,title_key,coalesce(author_organization,''),summary,
 setweight(to_tsvector('english',title),'A') || setweight(to_tsvector('english',coalesce(author_organization,'')),'B') ||
 setweight(to_tsvector('english',array_to_string(tags,' ')),'C') || setweight(to_tsvector('english',summary),'D'),
 difficulty,priority,readiness,hours_min FROM public_catalog_entry
 WHERE publication_id=pid AND kind IN ('PROGRAM','PHASE','MODULE','TOPIC','SUBTOPIC','RESOURCE','PATH','PROJECT','EXERCISE','QUIZ','CAPSTONE');
 DELETE FROM public_catalog_filter WHERE publication_id=pid;
 INSERT INTO public_catalog_filter
 SELECT pid,c.object_id,f.name,f.value FROM public_catalog_entry c
 CROSS JOIN LATERAL (VALUES ('kind',c.kind),('difficulty',c.difficulty),('priority',c.priority),('resourceType',c.resource_type),('cost',c.cost),('source',c.author_organization),('geography',c.geography),('verificationStatus',c.verification_status),('readiness',c.readiness),('visibility',c.visibility)) f(name,value)
 WHERE c.publication_id=pid AND f.value IS NOT NULL
 UNION SELECT pid,c.object_id,'tag',unnest(c.tags) FROM public_catalog_entry c WHERE c.publication_id=pid;
 -- Fixed-depth hierarchy; no recursive graph serialization or inferred resource assignment.
 INSERT INTO public_catalog_filter
 WITH c AS MATERIALIZED (SELECT publication_id,object_id,revision_id,external_id,kind FROM public_catalog_entry WHERE publication_id=pid),
 l AS MATERIALIZED (SELECT a.object_id owner,a.revision_id,l.relation,b.object_id target,b.external_id target_id,a.external_id owner_id FROM c a JOIN catalog_link l ON l.owner_revision_id=a.revision_id JOIN c b ON b.object_id=l.target_object_id),
 module_topic AS (SELECT owner module,target topic FROM l WHERE relation='module_topic'),
 phase_module AS (SELECT owner phase,target module FROM l WHERE relation='phase_module'),
 hierarchy AS (
 SELECT target object_id,'program' name,owner value FROM l WHERE relation='program_phase'
 UNION SELECT pm.module,'phase',pm.phase FROM phase_module pm
 UNION SELECT mt.topic,'module',mt.module FROM module_topic mt
 UNION SELECT mt.topic,'phase',pm.phase FROM module_topic mt JOIN phase_module pm USING(module)
 UNION SELECT pm.module,'program',p.owner FROM phase_module pm JOIN l p ON p.target=pm.phase AND p.relation='program_phase'
 UNION SELECT target,'path',owner FROM l WHERE relation IN ('path_module','path_topic')
 UNION SELECT mt.topic,'path',p.owner FROM l p JOIN module_topic mt ON mt.module=p.target WHERE p.relation='path_module'
 UNION SELECT project.object_id,'path',p.object_id FROM c p JOIN course_project cp ON cp.path_revision_id=p.revision_id JOIN c project ON project.revision_id=cp.project_revision_id WHERE cp.required
 ),
 assignments AS (SELECT a.resource_object_id resource,l.target topic FROM c a0 JOIN assignment_revision a ON a.revision_id=a0.revision_id JOIN l ON l.owner=a0.object_id AND l.relation='assignment_topic'),
 memberships AS (
 SELECT * FROM hierarchy
 UNION SELECT owner,'topic',target FROM l WHERE relation='project_topic'
 UNION SELECT target,'path',owner FROM l WHERE relation='path_project'
 UNION SELECT object_id,lower(kind),object_id FROM c WHERE kind IN ('TOPIC','MODULE','PHASE','PROGRAM','PATH')
 UNION SELECT resource,'topic',topic FROM assignments
 UNION SELECT a.resource,h.name,h.value FROM assignments a JOIN hierarchy h ON h.object_id=a.topic WHERE h.name IN ('phase','path','module')
 )
 SELECT DISTINCT pid,m.object_id,m.name,target.external_id FROM memberships m JOIN c target ON target.object_id=m.value
 ON CONFLICT DO NOTHING;
END $$;

CREATE FUNCTION activate_public_catalog() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 PERFORM rebuild_public_catalog(NEW.publication_id);
 INSERT INTO publication_activation_history VALUES(NEW.generation,NEW.publication_id,NEW.updated_at);
 RETURN NEW;
END $$;
CREATE TRIGGER public_catalog_activation AFTER INSERT OR UPDATE ON active_publication FOR EACH ROW EXECUTE FUNCTION activate_public_catalog();
SELECT rebuild_public_catalog(publication_id) FROM active_publication;
GRANT SELECT ON public_catalog_entry,public_catalog_filter,publication_activation_history TO otr_runtime;
GRANT INSERT,DELETE ON public_catalog_filter TO otr_runtime;
GRANT INSERT ON publication_activation_history TO otr_runtime;
REVOKE ALL ON FUNCTION rebuild_public_catalog(bigint),activate_public_catalog() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION rebuild_public_catalog(bigint),activate_public_catalog() TO otr_runtime;

-- Random database-local signing key, shared by application instances. It is not content.
CREATE TABLE public_cursor_key(singleton boolean PRIMARY KEY CHECK(singleton), secret bytea NOT NULL CHECK(octet_length(secret)=32));
INSERT INTO public_cursor_key VALUES(true,sha256(convert_to(gen_random_uuid()::text||gen_random_uuid()::text,'UTF8')));
REVOKE ALL ON public_cursor_key FROM PUBLIC;
GRANT SELECT ON public_cursor_key TO otr_runtime;
CREATE INDEX publication_activation_publication ON publication_activation_history(publication_id);

-- Safety overlays and routing changes invalidate cursors without republishing removed bodies.
CREATE OR REPLACE FUNCTION check_activation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'publication pointer cannot be deleted' USING ERRCODE='23514',CONSTRAINT='publication_pointer'; END IF;
 IF NOT EXISTS(SELECT 1 FROM publication WHERE id=NEW.publication_id AND status='SEALED') OR (TG_OP='UPDATE' AND NEW.generation<>OLD.generation+1) THEN
 RAISE EXCEPTION 'activation requires sealed manifest and next generation' USING ERRCODE='23514',CONSTRAINT='publication_generation'; END IF;
 IF TG_OP='INSERT' OR NEW.publication_id<>OLD.publication_id THEN PERFORM validate_publication(NEW.publication_id); END IF;
 RETURN NEW;
END $$;
CREATE OR REPLACE FUNCTION activate_public_catalog() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='INSERT' OR NEW.publication_id<>OLD.publication_id THEN PERFORM rebuild_public_catalog(NEW.publication_id); END IF;
 INSERT INTO publication_activation_history VALUES(NEW.generation,NEW.publication_id,NEW.updated_at);
 RETURN NEW;
END $$;
CREATE FUNCTION public_overlay_generation() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE oid bigint;
BEGIN
 PERFORM set_config('search_path',format('pg_catalog,%I,pg_temp',TG_TABLE_SCHEMA),true);
 IF TG_TABLE_NAME='catalog_object' THEN
  IF NEW.retired_at IS NOT DISTINCT FROM OLD.retired_at AND NEW.successor_id IS NOT DISTINCT FROM OLD.successor_id THEN RETURN NEW; END IF;
  oid=NEW.id;
 ELSIF TG_TABLE_NAME='rule_certification' THEN
  IF TG_OP='DELETE' THEN SELECT object_id INTO oid FROM catalog_revision WHERE id=OLD.rule_revision_id;
  ELSE SELECT object_id INTO oid FROM catalog_revision WHERE id=NEW.rule_revision_id; END IF;
 ELSIF TG_TABLE_NAME='verification_event' THEN
  SELECT object_id INTO oid FROM catalog_revision WHERE id=NEW.subject_revision_id;
 ELSIF TG_TABLE_NAME='rule_supersession' THEN
  IF TG_OP='DELETE' THEN oid=OLD.older_rule_id; ELSE oid=NEW.older_rule_id; END IF;
 ELSE
  IF TG_OP='DELETE' THEN oid=OLD.object_id; ELSE oid=NEW.object_id; END IF;
 END IF;
 UPDATE active_publication SET generation=generation+1,updated_at=transaction_timestamp(),lock_version=lock_version+1
 WHERE EXISTS(SELECT 1 FROM public_catalog_entry c WHERE c.publication_id=active_publication.publication_id AND c.object_id=oid);
 RETURN NULL;
END $$;
CREATE TRIGGER public_retirement_generation AFTER UPDATE ON catalog_object FOR EACH ROW EXECUTE FUNCTION public_overlay_generation();
CREATE TRIGGER public_withdrawal_generation AFTER INSERT OR UPDATE OR DELETE ON content_withdrawal FOR EACH ROW EXECUTE FUNCTION public_overlay_generation();
CREATE TRIGGER public_certification_generation AFTER INSERT OR UPDATE OR DELETE ON rule_certification FOR EACH ROW EXECUTE FUNCTION public_overlay_generation();
CREATE TRIGGER public_verification_generation AFTER INSERT ON verification_event FOR EACH ROW EXECUTE FUNCTION public_overlay_generation();
CREATE TRIGGER public_supersession_generation AFTER INSERT OR UPDATE OR DELETE ON rule_supersession FOR EACH ROW EXECUTE FUNCTION public_overlay_generation();
-- Draft route edits become public only through a new activated snapshot.
REVOKE ALL ON FUNCTION public_overlay_generation() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public_overlay_generation() TO otr_runtime,otr_import;
-- A restricted importer can retire a draft identity; the trigger alone may invalidate a public generation.
ALTER FUNCTION public_overlay_generation() SECURITY DEFINER;
ALTER FUNCTION public_overlay_generation() SET search_path=pg_catalog;

-- Add reviewed project/topic and path/project associations; no inferred prerequisite membership.
ALTER TABLE catalog_link DROP CONSTRAINT catalog_link_endpoints_ck;
ALTER TABLE catalog_link ADD CONSTRAINT catalog_link_endpoints_ck CHECK ((relation='program_phase' AND owner_kind IN ('PROGRAM') AND target_kind IN ('PHASE'))
    OR (relation='phase_module' AND owner_kind IN ('PHASE') AND target_kind IN ('MODULE'))
    OR (relation='module_topic' AND owner_kind IN ('MODULE') AND target_kind IN ('TOPIC'))
    OR (relation='topic_subtopic' AND owner_kind IN ('TOPIC') AND target_kind IN ('SUBTOPIC'))
    OR (relation='module_domain' AND owner_kind IN ('MODULE') AND target_kind IN ('DOMAIN'))
    OR (relation='outcome' AND owner_kind IN ('MODULE','SUBTOPIC','EXERCISE','BLUEPRINT') AND target_kind IN ('COMPETENCY'))
    OR (relation='assessment' AND owner_kind IN ('MODULE','COMPETENCY') AND target_kind IN ('EXERCISE','BLUEPRINT'))
    OR (relation='path_module' AND owner_kind IN ('PATH') AND target_kind IN ('MODULE'))
    OR (relation='path_target' AND owner_kind IN ('PATH') AND target_kind IN ('MODULE'))
    OR (relation='path_branch' AND owner_kind IN ('PATH') AND target_kind IN ('MODULE'))
    OR (relation='path_topic' AND owner_kind IN ('PATH') AND target_kind IN ('TOPIC'))
    OR (relation='path_diagnostic' AND owner_kind IN ('PATH') AND target_kind IN ('COMPETENCY'))
    OR (relation='path_exit' AND owner_kind IN ('PATH') AND target_kind IN ('COMPETENCY'))
    OR (relation='path_gate' AND owner_kind IN ('PATH') AND target_kind IN ('BLUEPRINT'))
    OR (relation='path_diagnostic_quiz' AND owner_kind IN ('PATH') AND target_kind IN ('QUIZ'))
    OR (relation='capability_project' AND owner_kind IN ('CAPSTONE') AND target_kind IN ('PROJECT'))
    OR (relation='capstone_policy' AND owner_kind IN ('CAPSTONE') AND target_kind IN ('POLICY'))
    OR (relation='decision_capstone' AND owner_kind IN ('DECISION') AND target_kind IN ('CAPSTONE'))
    OR (relation='candidate_competency' AND owner_kind IN ('RESOURCE') AND target_kind IN ('COMPETENCY'))
    OR (relation='assignment_topic' AND owner_kind IN ('ASSIGNMENT') AND target_kind IN ('TOPIC'))
    OR (relation='lesson_practice' AND owner_kind IN ('TOPIC') AND target_kind IN ('EXERCISE'))
    OR (relation='remediation_topic' AND owner_kind IN ('QUIZ','QUESTION','EXERCISE') AND target_kind IN ('TOPIC'))
    OR (relation='question_learning_topic' AND owner_kind IN ('QUESTION') AND target_kind IN ('TOPIC'))
    OR (relation='free_alternative' AND owner_kind IN ('RESOURCE') AND target_kind IN ('RESOURCE'))
    OR (relation='replaces' AND owner_kind IN ('RESOURCE') AND target_kind IN ('RESOURCE'))
    OR (relation='supersedes_resource' AND owner_kind IN ('RESOURCE') AND target_kind IN ('RESOURCE'))
    OR (relation='project_topic' AND owner_kind IN ('PROJECT','CAPSTONE') AND target_kind='TOPIC')
    OR (relation='path_project' AND owner_kind='PATH' AND target_kind='PROJECT')
    OR (relation='source_successor' AND owner_kind=target_kind AND annotation IS NOT NULL));

-- Only current approved rule identities and certification metadata, never rule values or keys.
CREATE VIEW public_rule_notice AS
 SELECT rule.publication_id,d.dependent_revision_id,coalesce(jsonb_agg(jsonb_build_object('ruleId',rule.external_id,
 'status',CASE WHEN rule.withdrawn OR rule.retired_at IS NOT NULL THEN 'UNAVAILABLE'
 WHEN EXISTS(SELECT 1 FROM rule_supersession x JOIN public_catalog_entry newer ON newer.publication_id=rule.publication_id AND newer.object_id=x.newer_rule_id WHERE x.older_rule_id=rule.object_id) THEN 'SUPERSEDED'
 WHEN cert.review_due_at<=statement_timestamp() OR cert.status IN ('REVOKED','EXPIRED') THEN 'DUE'
 WHEN cert.status='ACTIVE' AND cert.valid_dates @> (statement_timestamp() AT TIME ZONE subject.market_zone)::date AND cert.review_due_at>statement_timestamp() THEN 'WITHIN_REVIEW_WINDOW'
 ELSE 'UNKNOWN' END,
 'reviewDueAt',CASE WHEN cert.review_due_at IS NULL THEN NULL ELSE to_char(cert.review_due_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"') END,
 'currentOperationalEligible',coalesce(cert.status='ACTIVE' AND cert.valid_dates @> (statement_timestamp() AT TIME ZONE subject.market_zone)::date AND cert.review_due_at>statement_timestamp() AND NOT rule.withdrawn AND rule.retired_at IS NULL AND NOT EXISTS(SELECT 1 FROM rule_supersession x WHERE x.older_rule_id=rule.object_id),false)) ORDER BY rule.external_id COLLATE "C"),'[]'::jsonb) notices
 FROM (SELECT DISTINCT rule_object_id,dependent_revision_id FROM rule_dependency) d JOIN public_catalog_entry rule ON rule.object_id=d.rule_object_id
 JOIN rule_revision rr ON rr.revision_id=rule.revision_id JOIN rule_subject subject ON subject.id=rr.subject_id
 LEFT JOIN LATERAL(SELECT status,valid_dates,review_due_at FROM rule_certification WHERE rule_revision_id=rule.revision_id ORDER BY created_at DESC,id DESC LIMIT 1) cert ON true
 GROUP BY rule.publication_id,d.dependent_revision_id;
GRANT SELECT ON public_rule_notice TO otr_runtime;
