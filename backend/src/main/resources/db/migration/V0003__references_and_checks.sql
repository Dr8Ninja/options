-- P08 typed references, ownership, finite ranges and fixed vocabularies.

ALTER TABLE account ADD CONSTRAINT account_interest_path_id_fk FOREIGN KEY (interest_path_id) REFERENCES catalog_object (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE account_role ADD CONSTRAINT account_role_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE account_role ADD CONSTRAINT account_role_role_id_fk FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE account_role ADD CONSTRAINT account_role_granted_by_actor_id_fk FOREIGN KEY (granted_by_actor_id) REFERENCES editorial_actor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE editorial_actor ADD CONSTRAINT editorial_actor_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE webauthn_credential ADD CONSTRAINT webauthn_credential_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE auth_token ADD CONSTRAINT auth_token_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE auth_challenge ADD CONSTRAINT auth_challenge_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE auth_challenge ADD CONSTRAINT auth_challenge_session_primary_id_fk FOREIGN KEY (session_primary_id) REFERENCES spring_session (primary_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE catalog_object ADD CONSTRAINT catalog_object_successor_id_fk FOREIGN KEY (successor_id) REFERENCES catalog_object (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE catalog_revision ADD CONSTRAINT catalog_revision_author_actor_id_fk FOREIGN KEY (author_actor_id) REFERENCES editorial_actor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE draft_head ADD CONSTRAINT draft_head_object_id_fk FOREIGN KEY (object_id) REFERENCES catalog_object (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE catalog_route ADD CONSTRAINT catalog_route_object_id_fk FOREIGN KEY (object_id) REFERENCES catalog_object (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE revision_tag ADD CONSTRAINT revision_tag_revision_id_fk FOREIGN KEY (revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE revision_tag ADD CONSTRAINT revision_tag_tag_id_fk FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE revision_section ADD CONSTRAINT revision_section_revision_id_fk FOREIGN KEY (revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE competency_revision ADD CONSTRAINT competency_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE competency_revision ADD CONSTRAINT competency_revision_module_object_id_module_object_kind_fk FOREIGN KEY (module_object_id,module_object_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE competency_revision ADD CONSTRAINT competency_revision_18_fk FOREIGN KEY (diagnostic_bridge_id,diagnostic_bridge_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE resource_revision ADD CONSTRAINT resource_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE resource_revision ADD CONSTRAINT resource_revision_canonical_locator_id_fk FOREIGN KEY (canonical_locator_id) REFERENCES external_locator (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE resource_identifier ADD CONSTRAINT resource_identifier_resource_object_id_resource_object_kind_fk FOREIGN KEY (resource_object_id,resource_object_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE resource_locator ADD CONSTRAINT resource_locator_resource_revision_id_fk FOREIGN KEY (resource_revision_id) REFERENCES resource_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE resource_locator ADD CONSTRAINT resource_locator_locator_id_fk FOREIGN KEY (locator_id) REFERENCES external_locator (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE resource_unknown ADD CONSTRAINT resource_unknown_resource_revision_id_fk FOREIGN KEY (resource_revision_id) REFERENCES resource_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE resource_segment ADD CONSTRAINT resource_segment_resource_revision_id_fk FOREIGN KEY (resource_revision_id) REFERENCES resource_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE resource_segment ADD CONSTRAINT resource_segment_locator_id_fk FOREIGN KEY (locator_id) REFERENCES external_locator (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assignment_revision ADD CONSTRAINT assignment_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assignment_revision ADD CONSTRAINT assignment_revision_resource_object_id_resource_object_kind_fk FOREIGN KEY (resource_object_id,resource_object_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assignment_revision ADD CONSTRAINT assignment_revision_29_fk FOREIGN KEY (competency_object_id,competency_object_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE exercise_revision ADD CONSTRAINT exercise_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE exercise_revision ADD CONSTRAINT exercise_revision_module_object_id_module_object_kind_fk FOREIGN KEY (module_object_id,module_object_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE exercise_revision ADD CONSTRAINT exercise_revision_practice_question_revision_id_fk FOREIGN KEY (practice_question_revision_id) REFERENCES question_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE blueprint_revision ADD CONSTRAINT blueprint_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE blueprint_revision ADD CONSTRAINT blueprint_revision_module_object_id_module_object_kind_fk FOREIGN KEY (module_object_id,module_object_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE blueprint_item ADD CONSTRAINT blueprint_item_blueprint_revision_id_fk FOREIGN KEY (blueprint_revision_id) REFERENCES blueprint_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE blueprint_item ADD CONSTRAINT blueprint_item_exercise_object_id_exercise_object_kind_fk FOREIGN KEY (exercise_object_id,exercise_object_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE project_revision ADD CONSTRAINT project_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rubric_criterion ADD CONSTRAINT rubric_criterion_owner_revision_id_fk FOREIGN KEY (owner_revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE path_revision ADD CONSTRAINT path_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE path_revision ADD CONSTRAINT path_revision_diagnostic_quiz_revision_id_fk FOREIGN KEY (diagnostic_quiz_revision_id) REFERENCES quiz_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE decision_revision ADD CONSTRAINT decision_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE policy_revision ADD CONSTRAINT policy_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE provenance_anchor ADD CONSTRAINT provenance_anchor_artifact_id_fk FOREIGN KEY (artifact_id) REFERENCES source_artifact (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE revision_provenance ADD CONSTRAINT revision_provenance_revision_id_fk FOREIGN KEY (revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE revision_provenance ADD CONSTRAINT revision_provenance_anchor_id_fk FOREIGN KEY (anchor_id) REFERENCES provenance_anchor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE source_record ADD CONSTRAINT source_record_artifact_id_fk FOREIGN KEY (artifact_id) REFERENCES source_artifact (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE source_mapping ADD CONSTRAINT source_mapping_import_batch_id_fk FOREIGN KEY (import_batch_id) REFERENCES import_batch (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE mapping_anchor ADD CONSTRAINT mapping_anchor_mapping_id_fk FOREIGN KEY (mapping_id) REFERENCES source_mapping (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE mapping_anchor ADD CONSTRAINT mapping_anchor_anchor_id_fk FOREIGN KEY (anchor_id) REFERENCES provenance_anchor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE mapping_target ADD CONSTRAINT mapping_target_mapping_id_fk FOREIGN KEY (mapping_id) REFERENCES source_mapping (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE mapping_target ADD CONSTRAINT mapping_target_target_object_id_fk FOREIGN KEY (target_object_id) REFERENCES catalog_object (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE archive_revision ADD CONSTRAINT archive_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE archive_revision ADD CONSTRAINT archive_revision_artifact_id_fk FOREIGN KEY (artifact_id) REFERENCES source_artifact (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE evidence_claim ADD CONSTRAINT evidence_claim_artifact_id_fk FOREIGN KEY (artifact_id) REFERENCES source_artifact (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assignment_claim ADD CONSTRAINT assignment_claim_assignment_revision_id_fk FOREIGN KEY (assignment_revision_id) REFERENCES assignment_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assignment_claim ADD CONSTRAINT assignment_claim_claim_id_fk FOREIGN KEY (claim_id) REFERENCES evidence_claim (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE verification_event ADD CONSTRAINT verification_event_subject_revision_id_fk FOREIGN KEY (subject_revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE verification_event ADD CONSTRAINT verification_event_reviewer_actor_id_fk FOREIGN KEY (reviewer_actor_id) REFERENCES editorial_actor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE verification_event ADD CONSTRAINT verification_event_source_anchor_id_fk FOREIGN KEY (source_anchor_id) REFERENCES provenance_anchor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE authoring_task ADD CONSTRAINT authoring_task_topic_object_id_topic_object_kind_fk FOREIGN KEY (topic_object_id,topic_object_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE authoring_step ADD CONSTRAINT authoring_step_task_id_fk FOREIGN KEY (task_id) REFERENCES authoring_task (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE official_notice ADD CONSTRAINT official_notice_locator_id_fk FOREIGN KEY (locator_id) REFERENCES external_locator (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE notice_supersession ADD CONSTRAINT notice_supersession_older_notice_id_fk FOREIGN KEY (older_notice_id) REFERENCES official_notice (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE notice_supersession ADD CONSTRAINT notice_supersession_newer_notice_id_fk FOREIGN KEY (newer_notice_id) REFERENCES official_notice (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rule_revision ADD CONSTRAINT rule_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rule_revision ADD CONSTRAINT rule_revision_subject_id_fk FOREIGN KEY (subject_id) REFERENCES rule_subject (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rule_revision ADD CONSTRAINT rule_revision_notice_id_fk FOREIGN KEY (notice_id) REFERENCES official_notice (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rule_supersession ADD CONSTRAINT rule_supersession_older_rule_id_older_rule_kind_fk FOREIGN KEY (older_rule_id,older_rule_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rule_supersession ADD CONSTRAINT rule_supersession_newer_rule_id_newer_rule_kind_fk FOREIGN KEY (newer_rule_id,newer_rule_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rule_certification ADD CONSTRAINT rule_certification_subject_id_fk FOREIGN KEY (subject_id) REFERENCES rule_subject (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rule_certification ADD CONSTRAINT rule_certification_rule_revision_id_fk FOREIGN KEY (rule_revision_id) REFERENCES rule_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rule_certification ADD CONSTRAINT rule_certification_verification_id_fk FOREIGN KEY (verification_id) REFERENCES verification_event (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rule_certification ADD CONSTRAINT rule_certification_approved_by_actor_id_fk FOREIGN KEY (approved_by_actor_id) REFERENCES editorial_actor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rule_dependency ADD CONSTRAINT rule_dependency_rule_object_id_rule_object_kind_fk FOREIGN KEY (rule_object_id,rule_object_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE rule_dependency ADD CONSTRAINT rule_dependency_dependent_revision_id_fk FOREIGN KEY (dependent_revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE publication ADD CONSTRAINT publication_previous_id_fk FOREIGN KEY (previous_id) REFERENCES publication (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE publication ADD CONSTRAINT publication_created_by_actor_id_fk FOREIGN KEY (created_by_actor_id) REFERENCES editorial_actor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE publication_entry ADD CONSTRAINT publication_entry_publication_id_fk FOREIGN KEY (publication_id) REFERENCES publication (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE active_publication ADD CONSTRAINT active_publication_publication_id_fk FOREIGN KEY (publication_id) REFERENCES publication (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE review_decision ADD CONSTRAINT review_decision_revision_id_fk FOREIGN KEY (revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE review_decision ADD CONSTRAINT review_decision_actor_id_fk FOREIGN KEY (actor_id) REFERENCES editorial_actor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE content_withdrawal ADD CONSTRAINT content_withdrawal_object_id_fk FOREIGN KEY (object_id) REFERENCES catalog_object (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE content_withdrawal ADD CONSTRAINT content_withdrawal_actor_id_fk FOREIGN KEY (actor_id) REFERENCES editorial_actor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE content_withdrawal ADD CONSTRAINT content_withdrawal_reinstatement_review_id_fk FOREIGN KEY (reinstatement_review_id) REFERENCES review_decision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE editorial_event ADD CONSTRAINT editorial_event_actor_id_fk FOREIGN KEY (actor_id) REFERENCES editorial_actor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE editorial_event ADD CONSTRAINT editorial_event_object_id_fk FOREIGN KEY (object_id) REFERENCES catalog_object (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE editorial_event ADD CONSTRAINT editorial_event_revision_id_fk FOREIGN KEY (revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE editorial_event ADD CONSTRAINT editorial_event_publication_id_fk FOREIGN KEY (publication_id) REFERENCES publication (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE editorial_event ADD CONSTRAINT editorial_event_import_batch_id_fk FOREIGN KEY (import_batch_id) REFERENCES import_batch (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE import_batch ADD CONSTRAINT import_batch_base_publication_id_fk FOREIGN KEY (base_publication_id) REFERENCES publication (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE import_batch ADD CONSTRAINT import_batch_actor_id_fk FOREIGN KEY (actor_id) REFERENCES editorial_actor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE import_batch ADD CONSTRAINT import_batch_artifact_id_fk FOREIGN KEY (artifact_id) REFERENCES source_artifact (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE import_proposal ADD CONSTRAINT import_proposal_batch_id_fk FOREIGN KEY (batch_id) REFERENCES import_batch (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE import_proposal ADD CONSTRAINT import_proposal_object_id_fk FOREIGN KEY (object_id) REFERENCES catalog_object (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE content_issue ADD CONSTRAINT content_issue_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE content_issue ADD CONSTRAINT content_issue_object_id_fk FOREIGN KEY (object_id) REFERENCES catalog_object (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE content_issue ADD CONSTRAINT content_issue_assigned_actor_id_fk FOREIGN KEY (assigned_actor_id) REFERENCES editorial_actor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE job ADD CONSTRAINT job_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE job ADD CONSTRAINT job_publication_id_fk FOREIGN KEY (publication_id) REFERENCES publication (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE job ADD CONSTRAINT job_import_batch_id_fk FOREIGN KEY (import_batch_id) REFERENCES import_batch (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE job ADD CONSTRAINT job_privacy_request_id_fk FOREIGN KEY (privacy_request_id) REFERENCES privacy_request (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE recovery_journal ADD CONSTRAINT recovery_journal_publication_id_fk FOREIGN KEY (publication_id) REFERENCES publication (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE security_event ADD CONSTRAINT security_event_actor_account_id_fk FOREIGN KEY (actor_account_id) REFERENCES account (id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_revision ADD CONSTRAINT quiz_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_revision ADD CONSTRAINT quiz_revision_blueprint_object_id_blueprint_object_kind_fk FOREIGN KEY (blueprint_object_id,blueprint_object_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_revision ADD CONSTRAINT quiz_revision_policy_revision_id_fk FOREIGN KEY (policy_revision_id) REFERENCES policy_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE question_revision ADD CONSTRAINT question_revision_revision_id_kind_fk FOREIGN KEY (revision_id,kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE question_choice ADD CONSTRAINT question_choice_question_revision_id_fk FOREIGN KEY (question_revision_id) REFERENCES question_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_form ADD CONSTRAINT quiz_form_quiz_revision_id_fk FOREIGN KEY (quiz_revision_id) REFERENCES quiz_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_form_item ADD CONSTRAINT quiz_form_item_form_id_fk FOREIGN KEY (form_id) REFERENCES quiz_form (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_form_item ADD CONSTRAINT quiz_form_item_question_revision_id_fk FOREIGN KEY (question_revision_id) REFERENCES question_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE course_gate ADD CONSTRAINT course_gate_path_revision_id_fk FOREIGN KEY (path_revision_id) REFERENCES path_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE course_gate ADD CONSTRAINT course_gate_quiz_revision_id_fk FOREIGN KEY (quiz_revision_id) REFERENCES quiz_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE course_gate ADD CONSTRAINT course_gate_after_topic_id_after_topic_kind_fk FOREIGN KEY (after_topic_id,after_topic_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE course_project ADD CONSTRAINT course_project_path_revision_id_fk FOREIGN KEY (path_revision_id) REFERENCES path_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE course_project ADD CONSTRAINT course_project_project_revision_id_fk FOREIGN KEY (project_revision_id) REFERENCES project_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE path_topic_prerequisite ADD CONSTRAINT path_topic_prerequisite_path_revision_id_fk FOREIGN KEY (path_revision_id) REFERENCES path_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE path_topic_prerequisite ADD CONSTRAINT path_topic_prerequisite_topic_object_id_topic_object_kind_fk FOREIGN KEY (topic_object_id,topic_object_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE path_topic_prerequisite ADD CONSTRAINT path_topic_prerequisite_119_fk FOREIGN KEY (requires_topic_id,requires_topic_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assessment_competency ADD CONSTRAINT assessment_competency_assessment_revision_id_fk FOREIGN KEY (assessment_revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assessment_competency ADD CONSTRAINT assessment_competency_competency_revision_id_fk FOREIGN KEY (competency_revision_id) REFERENCES competency_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE project_field ADD CONSTRAINT project_field_project_revision_id_fk FOREIGN KEY (project_revision_id) REFERENCES project_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE enrollment ADD CONSTRAINT enrollment_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE enrollment ADD CONSTRAINT enrollment_path_revision_id_fk FOREIGN KEY (path_revision_id) REFERENCES path_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE enrollment ADD CONSTRAINT enrollment_publication_id_fk FOREIGN KEY (publication_id) REFERENCES publication (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE enrollment_requirement ADD CONSTRAINT enrollment_requirement_enrollment_id_fk FOREIGN KEY (enrollment_id) REFERENCES enrollment (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE enrollment_requirement ADD CONSTRAINT enrollment_requirement_source_module_id_source_module_kind_fk FOREIGN KEY (source_module_id,source_module_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE learning_progress ADD CONSTRAINT learning_progress_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE bookmark ADD CONSTRAINT bookmark_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE private_note ADD CONSTRAINT private_note_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE attempt_result ADD CONSTRAINT attempt_result_attempt_id_fk FOREIGN KEY (attempt_id) REFERENCES quiz_attempt (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE form_exposure ADD CONSTRAINT form_exposure_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE remediation_record ADD CONSTRAINT remediation_record_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE remediation_record ADD CONSTRAINT remediation_record_topic_revision_id_topic_revision_kind_fk FOREIGN KEY (topic_revision_id,topic_revision_kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assessment_request ADD CONSTRAINT assessment_request_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assessment_request ADD CONSTRAINT assessment_request_quiz_revision_id_fk FOREIGN KEY (quiz_revision_id) REFERENCES quiz_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assessment_request ADD CONSTRAINT assessment_request_resolved_quiz_revision_id_fk FOREIGN KEY (resolved_quiz_revision_id) REFERENCES quiz_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assessment_request ADD CONSTRAINT assessment_request_assigned_actor_id_fk FOREIGN KEY (assigned_actor_id) REFERENCES editorial_actor (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE practice_response ADD CONSTRAINT practice_response_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE practice_response ADD CONSTRAINT practice_response_exercise_revision_id_fk FOREIGN KEY (exercise_revision_id) REFERENCES exercise_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE project_work ADD CONSTRAINT project_work_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE project_work ADD CONSTRAINT project_work_project_revision_id_fk FOREIGN KEY (project_revision_id) REFERENCES project_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE mastery_evidence ADD CONSTRAINT mastery_evidence_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE mastery_evidence ADD CONSTRAINT mastery_evidence_competency_revision_id_fk FOREIGN KEY (competency_revision_id) REFERENCES competency_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE mastery_evidence ADD CONSTRAINT mastery_evidence_rubric_revision_id_fk FOREIGN KEY (rubric_revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE revision_equivalence ADD CONSTRAINT revision_equivalence_old_revision_id_fk FOREIGN KEY (old_revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE revision_equivalence ADD CONSTRAINT revision_equivalence_new_revision_id_fk FOREIGN KEY (new_revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE revision_equivalence ADD CONSTRAINT revision_equivalence_review_id_fk FOREIGN KEY (review_id) REFERENCES review_decision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE evidence_recheck ADD CONSTRAINT evidence_recheck_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE evidence_recheck ADD CONSTRAINT evidence_recheck_affected_revision_id_fk FOREIGN KEY (affected_revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE evidence_recheck ADD CONSTRAINT evidence_recheck_correction_revision_id_fk FOREIGN KEY (correction_revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE privacy_request ADD CONSTRAINT privacy_request_account_id_fk FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_actor_account_id_fk FOREIGN KEY (actor_account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_result_account_id_fk FOREIGN KEY (result_account_id) REFERENCES account (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_enrollment_id_fk FOREIGN KEY (enrollment_id) REFERENCES enrollment (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_attempt_id_fk FOREIGN KEY (attempt_id) REFERENCES quiz_attempt (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_remediation_id_fk FOREIGN KEY (remediation_id) REFERENCES remediation_record (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_assessment_request_id_fk FOREIGN KEY (assessment_request_id) REFERENCES assessment_request (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_project_work_id_fk FOREIGN KEY (project_work_id) REFERENCES project_work (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_issue_id_fk FOREIGN KEY (issue_id) REFERENCES content_issue (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_privacy_request_id_fk FOREIGN KEY (privacy_request_id) REFERENCES privacy_request (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_import_batch_id_fk FOREIGN KEY (import_batch_id) REFERENCES import_batch (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_revision_id_fk FOREIGN KEY (revision_id) REFERENCES catalog_revision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_review_id_fk FOREIGN KEY (review_id) REFERENCES review_decision (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_publication_id_fk FOREIGN KEY (publication_id) REFERENCES publication (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_withdrawal_id_fk FOREIGN KEY (withdrawal_id) REFERENCES content_withdrawal (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_job_id_fk FOREIGN KEY (job_id) REFERENCES job (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_remediation_requirement ADD CONSTRAINT quiz_remediation_requirement_quiz_revision_id_fk FOREIGN KEY (quiz_revision_id) REFERENCES quiz_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_remediation_requirement ADD CONSTRAINT quiz_remediation_requirement_question_revision_id_fk FOREIGN KEY (question_revision_id) REFERENCES question_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_remediation_requirement ADD CONSTRAINT quiz_remediation_require_170_fk FOREIGN KEY (topic_revision_id,topic_revision_kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_remediation_requirement ADD CONSTRAINT quiz_remediation_requirement_exercise_revision_id_fk FOREIGN KEY (exercise_revision_id) REFERENCES exercise_revision (revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE account ADD COLUMN interest_path_kind varchar(32) NOT NULL DEFAULT 'PATH' CHECK (interest_path_kind='PATH');

ALTER TABLE account ADD CONSTRAINT account_interest_path_id_interest_path_kind_fk FOREIGN KEY (interest_path_id,interest_path_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE catalog_revision ADD CONSTRAINT catalog_revision_object_id_kind_fk FOREIGN KEY (object_id,kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE draft_head ADD CONSTRAINT draft_head_revision_id_object_id_fk FOREIGN KEY (revision_id,object_id) REFERENCES catalog_revision (id,object_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE catalog_link ADD CONSTRAINT catalog_link_owner_revision_id_owner_kind_fk FOREIGN KEY (owner_revision_id,owner_kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE catalog_link ADD CONSTRAINT catalog_link_target_object_id_target_kind_fk FOREIGN KEY (target_object_id,target_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE publication_entry ADD CONSTRAINT publication_entry_revision_id_object_id_fk FOREIGN KEY (revision_id,object_id) REFERENCES catalog_revision (id,object_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE content_withdrawal ADD CONSTRAINT content_withdrawal_revision_id_object_id_fk FOREIGN KEY (revision_id,object_id) REFERENCES catalog_revision (id,object_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE import_proposal ADD CONSTRAINT import_proposal_base_revision_id_object_id_fk FOREIGN KEY (base_revision_id,object_id) REFERENCES catalog_revision (id,object_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE import_proposal ADD CONSTRAINT import_proposal_proposed_revision_id_object_id_fk FOREIGN KEY (proposed_revision_id,object_id) REFERENCES catalog_revision (id,object_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public_search_document ADD CONSTRAINT public_search_document_publication_id_object_id_fk FOREIGN KEY (publication_id,object_id) REFERENCES publication_entry (publication_id,object_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public_search_document ADD CONSTRAINT public_search_document_object_id_kind_fk FOREIGN KEY (object_id,kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE content_issue ADD CONSTRAINT content_issue_revision_id_object_id_fk FOREIGN KEY (revision_id,object_id) REFERENCES catalog_revision (id,object_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_form ADD CONSTRAINT quiz_form_exposure_group_fk FOREIGN KEY (exposure_group) REFERENCES assessment_exposure_group (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE enrollment ADD CONSTRAINT enrollment_path_revision_id_path_object_id_fk FOREIGN KEY (path_revision_id,path_object_id) REFERENCES catalog_revision (id,object_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE enrollment ADD CONSTRAINT enrollment_previous_enrollment_id_account_id_path_object_id_fk FOREIGN KEY (previous_enrollment_id,account_id,path_object_id) REFERENCES enrollment (id,account_id,path_object_id) ON DELETE SET NULL (previous_enrollment_id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE enrollment_requirement ADD CONSTRAINT enrollment_requirement_revision_id_object_id_kind_fk FOREIGN KEY (revision_id,object_id,kind) REFERENCES catalog_revision (id,object_id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE learning_progress ADD COLUMN topic_kind varchar(32) NOT NULL DEFAULT 'TOPIC' CHECK (topic_kind='TOPIC');

ALTER TABLE learning_progress ADD CONSTRAINT learning_progress_190_fk FOREIGN KEY (topic_revision_id,topic_object_id,topic_kind) REFERENCES catalog_revision (id,object_id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE bookmark ADD CONSTRAINT bookmark_object_id_kind_fk FOREIGN KEY (object_id,kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE private_note ADD CONSTRAINT private_note_object_id_kind_fk FOREIGN KEY (object_id,kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_attempt ADD CONSTRAINT quiz_attempt_enrollment_id_account_id_fk FOREIGN KEY (enrollment_id,account_id) REFERENCES enrollment (id,account_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE quiz_attempt ADD CONSTRAINT quiz_attempt_form_id_quiz_revision_id_fk FOREIGN KEY (form_id,quiz_revision_id) REFERENCES quiz_form (id,quiz_revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE attempt_answer ADD CONSTRAINT attempt_answer_attempt_id_form_id_fk FOREIGN KEY (attempt_id,form_id) REFERENCES quiz_attempt (id,form_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE attempt_answer ADD CONSTRAINT attempt_answer_form_id_item_ordinal_question_revision_id_fk FOREIGN KEY (form_id,item_ordinal,question_revision_id) REFERENCES quiz_form_item (form_id,ordinal,question_revision_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE answer_choice ADD CONSTRAINT answer_choice_attempt_id_item_ordinal_question_revision_id_fk FOREIGN KEY (attempt_id,item_ordinal,question_revision_id) REFERENCES attempt_answer (attempt_id,item_ordinal,question_revision_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE answer_choice ADD CONSTRAINT answer_choice_question_revision_id_choice_key_fk FOREIGN KEY (question_revision_id,choice_key) REFERENCES question_choice (question_revision_id,choice_key) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE form_exposure ADD CONSTRAINT form_exposure_exposure_group_fk FOREIGN KEY (exposure_group) REFERENCES assessment_exposure_group (id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE form_exposure ADD CONSTRAINT form_exposure_first_attempt_id_account_id_fk FOREIGN KEY (first_attempt_id,account_id) REFERENCES quiz_attempt (id,account_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE remediation_record ADD CONSTRAINT remediation_record_failed_attempt_id_account_id_fk FOREIGN KEY (failed_attempt_id,account_id) REFERENCES quiz_attempt (id,account_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE remediation_record ADD CONSTRAINT remediation_record_practice_response_id_account_id_fk FOREIGN KEY (practice_response_id,account_id) REFERENCES practice_response (id,account_id) ON DELETE SET NULL (practice_response_id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE assessment_request ADD CONSTRAINT assessment_request_enrollment_id_account_id_fk FOREIGN KEY (enrollment_id,account_id) REFERENCES enrollment (id,account_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE project_response ADD CONSTRAINT project_response_work_id_project_revision_id_fk FOREIGN KEY (work_id,project_revision_id) REFERENCES project_work (id,project_revision_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE project_response ADD CONSTRAINT project_response_project_revision_id_field_key_fk FOREIGN KEY (project_revision_id,field_key) REFERENCES project_field (project_revision_id,field_key) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE mastery_evidence ADD CONSTRAINT mastery_evidence_attempt_id_account_id_fk FOREIGN KEY (attempt_id,account_id) REFERENCES quiz_attempt (id,account_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE mastery_evidence ADD CONSTRAINT mastery_evidence_project_work_id_account_id_fk FOREIGN KEY (project_work_id,account_id) REFERENCES project_work (id,account_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE evidence_recheck ADD CONSTRAINT evidence_recheck_evidence_id_account_id_fk FOREIGN KEY (evidence_id,account_id) REFERENCES mastery_evidence (id,account_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE evidence_recheck ADD CONSTRAINT evidence_recheck_attempt_id_account_id_fk FOREIGN KEY (attempt_id,account_id) REFERENCES quiz_attempt (id,account_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE evidence_recheck ADD CONSTRAINT evidence_recheck_resolving_attempt_id_account_id_fk FOREIGN KEY (resolving_attempt_id,account_id) REFERENCES quiz_attempt (id,account_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE hard_prerequisite ADD CONSTRAINT hard_prerequisite_owner_revision_id_owner_kind_fk FOREIGN KEY (owner_revision_id,owner_kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE hard_prerequisite ADD CONSTRAINT hard_prerequisite_requires_object_id_requires_kind_fk FOREIGN KEY (requires_object_id,requires_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE hard_prerequisite ADD CONSTRAINT hard_prerequisite_endpoints_ck CHECK ((owner_kind='MODULE' AND requires_kind='COMPETENCY') OR (owner_kind='COMPETENCY' AND requires_kind='COMPETENCY') OR (owner_kind='PROJECT' AND requires_kind IN ('MODULE','PROJECT')) OR (owner_kind='TOPIC' AND requires_kind='TOPIC') OR (owner_kind='PATH' AND requires_kind='COMPETENCY'));

ALTER TABLE recommended_preparation ADD CONSTRAINT recommended_preparation_owner_revision_id_owner_kind_fk FOREIGN KEY (owner_revision_id,owner_kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE recommended_preparation ADD CONSTRAINT recommended_preparation_requires_object_id_requires_kind_fk FOREIGN KEY (requires_object_id,requires_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE recommended_preparation ADD CONSTRAINT recommended_preparation_endpoints_ck CHECK ((owner_kind='MODULE' AND requires_kind='COMPETENCY') OR (owner_kind='COMPETENCY' AND requires_kind='COMPETENCY') OR (owner_kind='PROJECT' AND requires_kind IN ('MODULE','PROJECT')) OR (owner_kind='TOPIC' AND requires_kind='TOPIC') OR (owner_kind='PATH' AND requires_kind='COMPETENCY'));

ALTER TABLE optional_enrichment ADD CONSTRAINT optional_enrichment_owner_revision_id_owner_kind_fk FOREIGN KEY (owner_revision_id,owner_kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE optional_enrichment ADD CONSTRAINT optional_enrichment_target_object_id_target_kind_fk FOREIGN KEY (target_object_id,target_kind) REFERENCES catalog_object (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE optional_enrichment ADD CONSTRAINT optional_enrichment_endpoints_ck CHECK ((owner_kind='MODULE' AND target_kind='COMPETENCY') OR (owner_kind='COMPETENCY' AND target_kind='COMPETENCY') OR (owner_kind='PROJECT' AND target_kind IN ('MODULE','PROJECT')) OR (owner_kind='TOPIC' AND target_kind='TOPIC') OR (owner_kind='PATH' AND target_kind='COMPETENCY') OR (owner_kind IN ('MODULE','COMPETENCY') AND target_kind IN ('MODULE','COMPETENCY')));

ALTER TABLE account ADD CONSTRAINT account_status_ck CHECK (status IN ('UNVERIFIED','ACTIVE','SUSPENDED','DELETING'));

ALTER TABLE account ADD CONSTRAINT account_theme_ck CHECK (theme IN ('system','light','dark'));

ALTER TABLE role ADD CONSTRAINT role_code_ck CHECK (code IN ('LEARNER','EDITOR','REVIEWER_PUBLISHER','ADMIN'));

ALTER TABLE auth_token ADD CONSTRAINT auth_token_purpose_ck CHECK (purpose IN ('VERIFY','RESET','CHANGE_EMAIL'));

ALTER TABLE auth_challenge ADD CONSTRAINT auth_challenge_purpose_ck CHECK (purpose IN ('REGISTER','AUTHENTICATE'));

ALTER TABLE auth_throttle ADD CONSTRAINT auth_throttle_purpose_ck CHECK (purpose IN ('LOGIN','VERIFY','RESET','CHANGE_EMAIL','WEBAUTHN'));

ALTER TABLE catalog_object ADD CONSTRAINT catalog_object_kind_ck CHECK (kind IN ('PROGRAM','PHASE','DOMAIN','MODULE','TOPIC','SUBTOPIC','COMPETENCY','RESOURCE','ASSIGNMENT','EXERCISE','BLUEPRINT','PROJECT','PATH','CAPSTONE','SPECIALIZATION','DECISION','POLICY','RULE','ARCHIVE','QUIZ','QUESTION'));

ALTER TABLE catalog_revision ADD CONSTRAINT catalog_revision_readiness_ck CHECK (readiness IN ('scope_outline','teaching_brief','learning_design','project_specification','reviewed_lesson'));

ALTER TABLE draft_head ADD CONSTRAINT draft_head_workflow_ck CHECK (workflow IN ('DRAFT','IN_REVIEW','APPROVED'));

ALTER TABLE resource_revision ADD CONSTRAINT resource_revision_cost_ck CHECK (cost IN ('free','paid','mixed','unknown'));

ALTER TABLE resource_revision ADD CONSTRAINT resource_revision_publication_precision_ck CHECK (publication_precision IN ('day','month','year','unknown','verbatim'));

ALTER TABLE resource_revision ADD CONSTRAINT resource_revision_updated_precision_ck CHECK (updated_precision IN ('day','month','year','unknown','verbatim'));

ALTER TABLE resource_identifier ADD CONSTRAINT resource_identifier_scheme_ck CHECK (scheme IN ('DOI','ISBN','PROVIDER'));

ALTER TABLE resource_unknown ADD CONSTRAINT resource_unknown_field_ck CHECK (field IN ('DOI','edition','publication_date','updated_date','video_timestamps'));

ALTER TABLE assignment_revision ADD CONSTRAINT assignment_revision_verification_state_ck CHECK (verification_state IN ('assignment_candidate','selected_reading'));

ALTER TABLE blueprint_item ADD CONSTRAINT blueprint_item_item_kind_ck CHECK (item_kind IN ('explain','calculate','failure_case','transfer'));

ALTER TABLE path_revision ADD CONSTRAINT path_revision_path_type_ck CHECK (path_type IN ('persona_path','foundation_course'));

ALTER TABLE verification_event ADD CONSTRAINT verification_event_method_ck CHECK (method IN ('link_transport','bibliography','selected_sections','technical_review','rule_chain'));

ALTER TABLE rule_certification ADD CONSTRAINT rule_certification_status_ck CHECK (status IN ('ACTIVE','REVOKED','EXPIRED'));

ALTER TABLE publication ADD CONSTRAINT publication_status_ck CHECK (status IN ('BUILDING','SEALED'));

ALTER TABLE publication_entry ADD CONSTRAINT publication_entry_visibility_ck CHECK (visibility IN ('MAP','LESSON','PROTECTED','ARCHIVE'));

ALTER TABLE review_decision ADD CONSTRAINT review_decision_review_type_ck CHECK (review_type IN ('technical','pedagogy','assessment','accessibility','rights'));

ALTER TABLE review_decision ADD CONSTRAINT review_decision_outcome_ck CHECK (outcome IN ('APPROVE','REJECT'));

ALTER TABLE import_batch ADD CONSTRAINT import_batch_state_ck CHECK (state IN ('VALIDATING','REJECTED','CONFLICTED','STAGED','APPLIED'));

ALTER TABLE import_proposal ADD CONSTRAINT import_proposal_outcome_ck CHECK (outcome IN ('NEW','UNCHANGED','UPDATE','CONFLICT','RETIRE','ACCEPTED','REJECTED'));

ALTER TABLE content_issue ADD CONSTRAINT content_issue_status_ck CHECK (status IN ('OPEN','TRIAGED','RESOLVED'));

ALTER TABLE job ADD CONSTRAINT job_kind_ck CHECK (kind IN ('MAIL','EXPORT','ERASE','PUBLISH_EXPORT','IMPORT_EXPORT','FRESHNESS','BACKUP_CHECK'));

ALTER TABLE job ADD CONSTRAINT job_state_ck CHECK (state IN ('READY','RUNNING','DONE','FAILED'));

ALTER TABLE job ADD CONSTRAINT job_mail_purpose_ck CHECK (mail_purpose IN ('VERIFY','RESET','CHANGE_EMAIL'));

ALTER TABLE recovery_journal ADD CONSTRAINT recovery_journal_event_type_ck CHECK (event_type IN ('ACCOUNT_ERASE','NOTE_ERASE','PROJECT_WRITING_ERASE','SUSPENSION','ROLE_REVOCATION','WITHDRAWAL','PUBLICATION'));

ALTER TABLE quiz_revision ADD CONSTRAINT quiz_revision_purpose_ck CHECK (purpose IN ('GATE','DIAGNOSTIC'));

ALTER TABLE question_revision ADD CONSTRAINT question_revision_question_type_ck CHECK (question_type IN ('SINGLE','MULTI','NUMERIC'));

ALTER TABLE assessment_competency ADD CONSTRAINT assessment_competency_evidence_level_ck CHECK (evidence_level IN ('DEMONSTRATED','SELF_REVIEW','DIAGNOSTIC'));

ALTER TABLE project_field ADD CONSTRAINT project_field_field_type_ck CHECK (field_type IN ('TEXT','NUMERIC','SELF_RUBRIC'));

ALTER TABLE enrollment ADD CONSTRAINT enrollment_state_ck CHECK (state IN ('CURRENT','COMPLETED','SUPERSEDED','BLOCKED'));

ALTER TABLE enrollment_requirement ADD CONSTRAINT enrollment_requirement_kind_ck CHECK (kind IN ('TOPIC','QUIZ','PROJECT'));

ALTER TABLE learning_progress ADD CONSTRAINT learning_progress_state_ck CHECK (state IN ('STARTED','SELF_COMPLETED','REOPENED'));

ALTER TABLE bookmark ADD CONSTRAINT bookmark_kind_ck CHECK (kind IN ('MODULE','TOPIC','RESOURCE'));

ALTER TABLE private_note ADD CONSTRAINT private_note_kind_ck CHECK (kind IN ('MODULE','TOPIC','RESOURCE'));

ALTER TABLE quiz_attempt ADD CONSTRAINT quiz_attempt_purpose_ck CHECK (purpose IN ('FRESH','PRACTICE','DIAGNOSTIC'));

ALTER TABLE quiz_attempt ADD CONSTRAINT quiz_attempt_state_ck CHECK (state IN ('STARTED','SUBMITTED','ABANDONED'));

ALTER TABLE assessment_request ADD CONSTRAINT assessment_request_state_ck CHECK (state IN ('OPEN','TRIAGED','RESOLVED','CANCELLED'));

ALTER TABLE assessment_request ADD CONSTRAINT assessment_request_reason_ck CHECK (reason IN ('exhausted_forms'));

ALTER TABLE project_work ADD CONSTRAINT project_work_state_ck CHECK (state IN ('DRAFT','SELF_REVIEWED'));

ALTER TABLE mastery_evidence ADD CONSTRAINT mastery_evidence_evidence_type_ck CHECK (evidence_type IN ('DEMONSTRATED','SELF_REVIEW','DIAGNOSTIC'));

ALTER TABLE privacy_request ADD CONSTRAINT privacy_request_kind_ck CHECK (kind IN ('EXPORT','DELETE'));

ALTER TABLE privacy_request ADD CONSTRAINT privacy_request_state_ck CHECK (state IN ('REQUESTED','RUNNING','READY','COMPLETED','FAILED','EXPIRED'));

ALTER TABLE account ADD CONSTRAINT account_generation_ck CHECK (auth_generation >= 0);

ALTER TABLE account ADD CONSTRAINT account_hash_ck CHECK (password_hash ~ '^\{argon2id\}\$argon2id\$v=19\$m=[0-9]+,t=[0-9]+,p=[0-9]+\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$');

ALTER TABLE account ADD CONSTRAINT account_email_key_ck CHECK (email_key = casefold(btrim(email) COLLATE "pg_unicode_fast"));

ALTER TABLE account ADD CONSTRAINT account_verified_ck CHECK (status <> 'ACTIVE' OR verified_at IS NOT NULL);

ALTER TABLE webauthn_credential ADD CONSTRAINT webauthn_credential_bounds_ck CHECK (octet_length(credential_id) BETWEEN 1 AND 1024 AND octet_length(public_key) BETWEEN 1 AND 16384 AND octet_length(user_handle) BETWEEN 1 AND 64 AND sign_count >= 0 AND (NOT backed_up OR backup_eligible));

ALTER TABLE auth_token ADD CONSTRAINT auth_token_digest_ck CHECK (octet_length(digest)=32);

ALTER TABLE auth_token ADD CONSTRAINT auth_token_expiry_ck CHECK (expires_at>created_at AND created_generation>=0);

ALTER TABLE auth_token ADD CONSTRAINT auth_token_target_ck CHECK ((purpose='CHANGE_EMAIL')=(target_email IS NOT NULL));

ALTER TABLE auth_challenge ADD CONSTRAINT auth_challenge_bounds_ck CHECK (octet_length(challenge) BETWEEN 1 AND 65536 AND expires_at>created_at);

ALTER TABLE auth_throttle ADD CONSTRAINT auth_throttle_bounds_ck CHECK (octet_length(bucket_hash)=32 AND failure_count>=0 AND expires_at>window_start);

ALTER TABLE catalog_object ADD CONSTRAINT catalog_object_successor_ck CHECK (successor_id IS NULL OR successor_id <> id);

ALTER TABLE catalog_revision ADD CONSTRAINT catalog_revision_hours_ck CHECK ((hours_min IS NULL AND hours_max IS NULL) OR (hours_min IS NOT NULL AND hours_max IS NOT NULL AND hours_min>=0 AND hours_max>=hours_min AND estimate_basis IS NOT NULL));

ALTER TABLE catalog_revision ADD CONSTRAINT catalog_revision_hash_ck CHECK (content_hash ~ '^[a-f0-9]{64}$');

ALTER TABLE catalog_route ADD CONSTRAINT catalog_route_path_ck CHECK (path_key ~ '^/[a-z0-9]+(-[a-z0-9]+)*(/[a-z0-9]+(-[a-z0-9]+)*)*$');

ALTER TABLE external_locator ADD CONSTRAINT external_locator_url_ck CHECK (original_url ~ '^https?://' AND normalized_url ~ '^https?://');

ALTER TABLE external_locator ADD CONSTRAINT external_locator_hash_ck CHECK (url_hash=encode(sha256(convert_to(normalized_url,'UTF8')),'hex'));

ALTER TABLE resource_segment ADD CONSTRAINT resource_segment_times_ck CHECK ((start_seconds IS NULL AND end_seconds IS NULL) OR (start_seconds IS NOT NULL AND end_seconds IS NOT NULL AND start_seconds>=0 AND end_seconds>start_seconds));

ALTER TABLE blueprint_item ADD CONSTRAINT blueprint_item_exclusive_ck CHECK (num_nonnulls(question_text,exercise_object_id)=1);

ALTER TABLE project_revision ADD CONSTRAINT project_revision_no_money_ck CHECK (NOT real_money_required);

ALTER TABLE source_artifact ADD CONSTRAINT source_artifact_size_ck CHECK (byte_count>0);

ALTER TABLE source_artifact ADD CONSTRAINT source_artifact_hashes_ck CHECK (sha256 ~ '^[a-f0-9]{64}$' AND path_hash=encode(sha256(convert_to(repository_path,'UTF8')),'hex'));

ALTER TABLE provenance_anchor ADD CONSTRAINT provenance_anchor_location_ck CHECK (num_nonnulls(json_pointer,line_start,locator_label)>0 AND (line_start IS NULL OR line_start>=1) AND (line_end IS NULL OR (line_start IS NOT NULL AND line_end>=line_start)));

ALTER TABLE source_record ADD CONSTRAINT source_record_size_ck CHECK (octet_length(original_payload::text)<=1048576);

ALTER TABLE archive_revision ADD CONSTRAINT archive_revision_exclusive_ck CHECK (num_nonnulls(original_pointer,markdown)=1);

ALTER TABLE authoring_task ADD CONSTRAINT authoring_task_hours_ck CHECK (hours_min>=0 AND hours_max>=hours_min);

ALTER TABLE rule_subject ADD CONSTRAINT rule_subject_zone_ck CHECK (market_zone IS NOT NULL OR unknown_zone_reason IS NOT NULL);

ALTER TABLE rule_subject ADD CONSTRAINT rule_subject_hash_ck CHECK (scope_hash=encode(sha256(convert_to(product_scope,'UTF8')),'hex'));

ALTER TABLE official_notice ADD CONSTRAINT official_notice_unknown_ck CHECK ((publication_date IS NOT NULL OR unknown_date_reason IS NOT NULL) AND (locator_id IS NOT NULL OR unknown_locator_reason IS NOT NULL));

ALTER TABLE notice_supersession ADD CONSTRAINT notice_supersession_self_ck CHECK (older_notice_id<>newer_notice_id);

ALTER TABLE rule_supersession ADD CONSTRAINT rule_supersession_self_ck CHECK (older_rule_id<>newer_rule_id);

ALTER TABLE rule_revision ADD CONSTRAINT rule_revision_dates_ck CHECK ((effective_from IS NULL OR effective_to IS NULL OR effective_from<effective_to) AND review_interval_days>0 AND NOT imported_current_eligible);

ALTER TABLE rule_revision ADD CONSTRAINT rule_revision_unknown_ck CHECK ((effective_from IS NOT NULL AND effective_to IS NOT NULL) OR unknown_date_reason IS NOT NULL);

ALTER TABLE rule_certification ADD CONSTRAINT rule_certification_finite_ck CHECK (NOT isempty(valid_dates) AND NOT lower_inf(valid_dates) AND NOT upper_inf(valid_dates) AND lower_inc(valid_dates) AND NOT upper_inc(valid_dates));

ALTER TABLE publication ADD CONSTRAINT publication_previous_ck CHECK (previous_id IS NULL OR previous_id<id);

ALTER TABLE publication ADD CONSTRAINT publication_sealed_ck CHECK ((status='SEALED')=(validated_at IS NOT NULL));

ALTER TABLE publication_entry ADD CONSTRAINT publication_entry_indexable_ck CHECK (NOT indexable OR visibility IN ('MAP','LESSON'));

ALTER TABLE publication_entry ADD CONSTRAINT publication_entry_order_ck CHECK (display_order>0);

ALTER TABLE active_publication ADD CONSTRAINT active_publication_singleton_ck CHECK (singleton=1 AND generation>0);

ALTER TABLE content_withdrawal ADD CONSTRAINT content_withdrawal_review_ck CHECK ((reinstated_at IS NULL)=(reinstatement_review_id IS NULL));

ALTER TABLE editorial_event ADD CONSTRAINT editorial_event_context_ck CHECK (num_nonnulls(object_id,revision_id,publication_id,import_batch_id)>0);

ALTER TABLE import_batch ADD CONSTRAINT import_batch_report_ck CHECK (octet_length(report::text)<=2097152);

ALTER TABLE job ADD CONSTRAINT job_attempts_ck CHECK (attempts BETWEEN 0 AND 10);

ALTER TABLE job ADD CONSTRAINT job_lease_ck CHECK ((state='RUNNING')=(lease_token IS NOT NULL AND lease_until IS NOT NULL));

ALTER TABLE security_event ADD CONSTRAINT security_event_ttl_ck CHECK (expires_at>occurred_at AND expires_at<=occurred_at+interval '90 days');

ALTER TABLE quiz_revision ADD CONSTRAINT quiz_revision_shape_ck CHECK ((purpose='GATE' AND expected_items=10 AND max_fresh_forms=2 AND pass_score=85 AND critical_required) OR (purpose='DIAGNOSTIC' AND expected_items=4 AND max_fresh_forms>0));

ALTER TABLE question_revision ADD CONSTRAINT question_revision_numeric_ck CHECK ((question_type='NUMERIC' AND expected_numeric IS NOT NULL AND abs_tolerance IS NOT NULL AND rel_tolerance IS NOT NULL AND abs_tolerance>=0 AND rel_tolerance>=0) OR (question_type<>'NUMERIC' AND num_nonnulls(expected_numeric,abs_tolerance,rel_tolerance,expected_unit)=0));

ALTER TABLE path_topic_prerequisite ADD CONSTRAINT path_topic_prerequisite_self_ck CHECK (topic_object_id<>requires_topic_id);

ALTER TABLE project_field ADD CONSTRAINT project_field_numeric_ck CHECK ((field_type='NUMERIC' AND expected_numeric IS NOT NULL AND tolerance IS NOT NULL AND tolerance>=0) OR (field_type<>'NUMERIC' AND num_nonnulls(expected_numeric,tolerance,unit)=0));

ALTER TABLE learning_progress ADD CONSTRAINT learning_progress_complete_ck CHECK ((state='SELF_COMPLETED')=(self_completed_at IS NOT NULL));

ALTER TABLE quiz_attempt ADD CONSTRAINT quiz_attempt_submitted_ck CHECK ((state='SUBMITTED')=(submitted_at IS NOT NULL));

ALTER TABLE attempt_result ADD CONSTRAINT attempt_result_critical_ck CHECK (critical_failures>=0);

ALTER TABLE project_response ADD CONSTRAINT project_response_exclusive_ck CHECK (num_nonnulls(text_value,numeric_value)=1);

ALTER TABLE mastery_evidence ADD CONSTRAINT mastery_evidence_source_ck CHECK (num_nonnulls(attempt_id,project_work_id)=1);

ALTER TABLE revision_equivalence ADD CONSTRAINT revision_equivalence_direction_ck CHECK (old_revision_id<new_revision_id);

ALTER TABLE evidence_recheck ADD CONSTRAINT evidence_recheck_source_ck CHECK (num_nonnulls(evidence_id,attempt_id)=1);

ALTER TABLE privacy_request ADD CONSTRAINT privacy_request_ready_ck CHECK (state<>'READY' OR (kind='EXPORT' AND account_id IS NOT NULL AND ready_at IS NOT NULL AND expires_at=ready_at+interval '24 hours' AND private_object_key IS NOT NULL));

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_ttl_ck CHECK (expiry_at>created_at AND expiry_at<=created_at+interval '24 hours');

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_hash_ck CHECK (request_sha256 ~ '^[a-f0-9]{64}$');

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_status_ck CHECK (response_status BETWEEN 200 AND 299);

ALTER TABLE command_receipt ADD CONSTRAINT command_receipt_result_ck CHECK (num_nonnulls(result_account_id,enrollment_id,attempt_id,remediation_id,assessment_request_id,project_work_id,issue_id,privacy_request_id,import_batch_id,revision_id,review_id,publication_id,withdrawal_id,job_id)=1);

ALTER TABLE rule_certification ADD CONSTRAINT rule_certification_no_overlap EXCLUDE USING gist (subject_id WITH =, valid_dates WITH &&) WHERE (status='ACTIVE') DEFERRABLE INITIALLY DEFERRED;

CREATE UNIQUE INDEX rule_subject_identity ON rule_subject(jurisdiction,instrument_key,rule_type,scope_hash);

CREATE UNIQUE INDEX provenance_anchor_identity ON provenance_anchor(artifact_id,locator_hash);

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
    OR (relation='source_successor' AND owner_kind=target_kind AND annotation IS NOT NULL));

ALTER TABLE catalog_link ADD CONSTRAINT catalog_link_annotation_ck CHECK (relation<>'path_branch' OR annotation IS NOT NULL);

ALTER TABLE catalog_link ADD CONSTRAINT catalog_link_singleton_ck CHECK (relation NOT IN ('module_domain','capstone_policy') OR ordinal=1);

ALTER TABLE revision_section ADD COLUMN owner_kind varchar(32) NOT NULL;

ALTER TABLE revision_section ADD CONSTRAINT revision_section_revision_id_owner_kind_fk FOREIGN KEY (revision_id,owner_kind) REFERENCES catalog_revision (id,kind) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE revision_section ADD CONSTRAINT revision_section_sections_ck CHECK ((owner_kind='PROGRAM' AND section IN ('qualification')) OR (owner_kind='MODULE' AND section IN ('why_it_matters','objective','required_math','required_programming','reading_summary','practical_assignment','common_mistake','checkpoint','mastery_criterion','remediation','authoring_owner')) OR (owner_kind='TOPIC' AND section IN ('original_evidence_class','original_classification')) OR (owner_kind='SUBTOPIC' AND section IN ('granularity_note')) OR (owner_kind='COMPETENCY' AND section IN ('dependency_reason')) OR (owner_kind='PROJECT' AND section IN ('objective','data_plan','step','deliverables','reference','failure_case','limitations','noncoding_route','critical_failure')) OR (owner_kind='PATH' AND section IN ('audience','entry','exit_statement','milestone','assessment_gate_summary')) OR (owner_kind='POLICY' AND section IN ('critical_error','evidence','retry','calibration','state_label')) OR (owner_kind='EXERCISE' AND section IN ('critical_error')) OR (owner_kind='SPECIALIZATION' AND section IN ('original_module_scope','depth')) OR (owner_kind='CAPSTONE' AND section IN ('original_brief')));

INSERT INTO role(code) VALUES ('LEARNER'),('EDITOR'),('REVIEWER_PUBLISHER'),('ADMIN');
