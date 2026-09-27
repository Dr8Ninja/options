-- Group roles contain no login/password. Login provisioning is operator-owned.
-- A production DBA precreates these roles and btree_gist; local migrations can create them.
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='otr_runtime') THEN CREATE ROLE otr_runtime NOLOGIN; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='otr_import') THEN CREATE ROLE otr_import NOLOGIN; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='otr_privacy') THEN CREATE ROLE otr_privacy NOLOGIN; END IF;
END $$;
DO $$ DECLARE s text=current_schema(); t text; BEGIN
 EXECUTE format('REVOKE CREATE ON SCHEMA %I FROM PUBLIC',s);
 EXECUTE format('GRANT USAGE ON SCHEMA %I TO otr_runtime,otr_import,otr_privacy',s);
 EXECUTE format('GRANT SELECT ON ALL TABLES IN SCHEMA %I TO otr_runtime,otr_privacy',s);
 EXECUTE format('GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA %I TO otr_runtime,otr_import,otr_privacy',s);
 -- Runtime owns application writes; append-only bodies are enforced by immutable triggers.
 EXECUTE format('GRANT INSERT,UPDATE ON ALL TABLES IN SCHEMA %I TO otr_runtime',s);
 EXECUTE format('REVOKE ALL ON %I.flyway_schema_history FROM otr_runtime,otr_import,otr_privacy',s);
 FOREACH t IN ARRAY ARRAY['spring_session','spring_session_attributes','auth_token','auth_challenge','auth_throttle','bookmark','private_note','practice_response','project_work','project_response','command_receipt','account_role','attempt_answer','answer_choice'] LOOP
  EXECUTE format('GRANT DELETE ON %I.%I TO otr_runtime',s,t);
 END LOOP;
 -- Private account erasure is a distinct connection role. It cannot edit catalog bodies.
 FOREACH t IN ARRAY ARRAY['account','private_note','project_work','command_receipt','privacy_request','security_event','auth_token','auth_challenge','auth_throttle','content_issue','spring_session','spring_session_attributes'] LOOP
  EXECUTE format('GRANT DELETE ON %I.%I TO otr_privacy',s,t);
 END LOOP;
 FOREACH t IN ARRAY ARRAY['account','privacy_request','job'] LOOP EXECUTE format('GRANT UPDATE ON %I.%I TO otr_privacy',s,t); END LOOP;
 FOREACH t IN ARRAY ARRAY['recovery_journal','security_event'] LOOP EXECUTE format('GRANT INSERT ON %I.%I TO otr_privacy',s,t); END LOOP;
 -- Import creates catalog drafts/provenance only: no identity, learner, assessment execution or publication activation access.
 FOREACH t IN ARRAY ARRAY['catalog_object','catalog_revision','draft_head','catalog_route','tag','revision_tag','revision_section','catalog_link','hard_prerequisite','recommended_preparation','optional_enrichment','competency_revision','resource_revision','external_locator','resource_identifier','resource_locator','resource_unknown','resource_segment','assignment_revision','exercise_revision','blueprint_revision','blueprint_item','project_revision','rubric_criterion','path_revision','decision_revision','policy_revision','source_artifact','provenance_anchor','revision_provenance','source_record','source_mapping','mapping_anchor','mapping_target','archive_revision','evidence_claim','assignment_claim','verification_event','authoring_task','authoring_step','rule_subject','official_notice','notice_supersession','rule_revision','rule_supersession','rule_dependency','import_batch','import_proposal'] LOOP
  EXECUTE format('GRANT SELECT,INSERT,UPDATE ON %I.%I TO otr_import',s,t);
 END LOOP;
 FOREACH t IN ARRAY ARRAY['publication','publication_entry','editorial_actor','question_revision','quiz_revision','review_decision'] LOOP
  EXECUTE format('GRANT SELECT ON %I.%I TO otr_import',s,t);
 END LOOP;
 EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA %I FROM PUBLIC',s);
 EXECUTE format('GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA %I TO otr_runtime,otr_import,otr_privacy',s);
END $$;
