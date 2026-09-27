-- P08 / DB01–DB08: relational storage. V0001 remains byte-identical.

-- No accounts, catalog fixtures, lesson content or production credentials are seeded.

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE account (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id uuid UNIQUE NOT NULL,
    email varchar(320) NOT NULL CHECK (btrim(email) <> ''),
    email_key varchar(320) NOT NULL CHECK (btrim(email_key) <> ''),
    display_name varchar(100) CHECK (btrim(display_name) <> ''),
    password_hash varchar(512) NOT NULL,
    status varchar(24) NOT NULL,
    verified_at timestamptz,
    last_login_at timestamptz,
    auth_generation bigint NOT NULL,
    eligibility_attested_at timestamptz NOT NULL,
    theme varchar(8) NOT NULL,
    interest_path_id bigint,
    deletion_requested_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    UNIQUE (email_key)
);

CREATE TABLE role (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code varchar(24) NOT NULL UNIQUE CHECK (btrim(code) <> ''),
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE account_role (
    account_id bigint NOT NULL,
    role_id bigint NOT NULL,
    granted_at timestamptz NOT NULL,
    granted_by_actor_id bigint NOT NULL,
    PRIMARY KEY (account_id,role_id)
);

CREATE TABLE editorial_actor (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_ref uuid UNIQUE NOT NULL,
    account_id bigint,
    label varchar(100) NOT NULL CHECK (btrim(label) <> ''),
    retired_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    UNIQUE (account_id)
);

CREATE TABLE webauthn_credential (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id bigint NOT NULL,
    credential_id bytea NOT NULL UNIQUE,
    user_handle bytea NOT NULL,
    public_key bytea NOT NULL,
    sign_count bigint NOT NULL,
    label varchar(100) NOT NULL CHECK (btrim(label) <> ''),
    transports varchar(200) NOT NULL,
    backup_eligible boolean NOT NULL,
    backed_up boolean NOT NULL,
    revoked_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE auth_token (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id bigint NOT NULL,
    purpose varchar(24) NOT NULL,
    digest bytea NOT NULL UNIQUE,
    target_email varchar(320),
    created_generation bigint NOT NULL,
    expires_at timestamptz NOT NULL,
    consumed_at timestamptz,
    revoked_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE auth_challenge (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id bigint,
    session_primary_id varchar(36) NOT NULL,
    purpose varchar(24) NOT NULL,
    challenge bytea NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    consumed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE auth_throttle (
    bucket_hash bytea NOT NULL,
    purpose varchar(24) NOT NULL,
    window_start timestamptz NOT NULL,
    failure_count int NOT NULL,
    blocked_until timestamptz,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    PRIMARY KEY (bucket_hash,purpose,window_start)
);

CREATE TABLE catalog_object (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id varchar(160) NOT NULL UNIQUE CHECK (btrim(external_id) <> ''),
    kind varchar(32) NOT NULL,
    retired_at timestamptz,
    successor_id bigint,
    identity_note text CHECK (char_length(identity_note) <= 4000),
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    UNIQUE (id,kind)
);

CREATE TABLE catalog_revision (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    object_id bigint NOT NULL,
    kind varchar(32) NOT NULL,
    revision_no int NOT NULL CHECK (revision_no > 0),
    title varchar(500) NOT NULL CHECK (btrim(title) <> ''),
    difficulty varchar(80),
    priority varchar(24),
    readiness varchar(32) NOT NULL,
    scope_outline text CHECK (char_length(scope_outline) <= 100000),
    teaching_brief text CHECK (char_length(teaching_brief) <= 100000),
    lesson_markdown text CHECK (char_length(lesson_markdown) <= 500000),
    unknown_brief_reason text CHECK (char_length(unknown_brief_reason) <= 4000),
    hours_min numeric(18,6),
    hours_max numeric(18,6),
    estimate_basis text CHECK (char_length(estimate_basis) <= 8000),
    source_status varchar(160),
    author_actor_id bigint NOT NULL,
    format_version varchar(32) NOT NULL,
    renderer_version varchar(64),
    content_hash varchar(64) NOT NULL,
    sealed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    UNIQUE (object_id,revision_no),
    UNIQUE (id,object_id),
    UNIQUE (id,kind),
    UNIQUE (id,object_id,kind)
);

CREATE TABLE draft_head (
    object_id bigint NOT NULL PRIMARY KEY,
    revision_id bigint NOT NULL,
    workflow varchar(16) NOT NULL,
    requested_review_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE catalog_route (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    path_key varchar(300) NOT NULL UNIQUE CHECK (btrim(path_key) <> ''),
    object_id bigint NOT NULL,
    canonical boolean NOT NULL,
    retired_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE tag (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug varchar(80) NOT NULL UNIQUE,
    label varchar(100) NOT NULL CHECK (btrim(label) <> ''),
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE revision_tag (
    revision_id bigint NOT NULL,
    tag_id bigint NOT NULL,
    PRIMARY KEY (revision_id,tag_id)
);

CREATE TABLE revision_section (
    revision_id bigint NOT NULL,
    section varchar(40) NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    body text CHECK (char_length(body) <= 100000) NOT NULL,
    PRIMARY KEY (revision_id,section,ordinal)
);

CREATE TABLE catalog_link (
    owner_revision_id bigint NOT NULL,
    owner_kind varchar(32) NOT NULL,
    relation varchar(40) NOT NULL,
    target_object_id bigint NOT NULL,
    target_kind varchar(32) NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    annotation text CHECK (char_length(annotation) <= 8000),
    PRIMARY KEY (owner_revision_id,relation,target_object_id),
    UNIQUE (owner_revision_id,relation,ordinal)
);

CREATE TABLE hard_prerequisite (
    owner_revision_id bigint NOT NULL,
    owner_kind varchar(32) NOT NULL,
    requires_object_id bigint NOT NULL,
    requires_kind varchar(32) NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    rationale text CHECK (char_length(rationale) <= 8000) NOT NULL,
    supplied_skill text CHECK (char_length(supplied_skill) <= 8000),
    consumed_skill text CHECK (char_length(consumed_skill) <= 8000),
    PRIMARY KEY (owner_revision_id,requires_object_id),
    UNIQUE (owner_revision_id,ordinal)
);

CREATE TABLE recommended_preparation (
    owner_revision_id bigint NOT NULL,
    owner_kind varchar(32) NOT NULL,
    requires_object_id bigint NOT NULL,
    requires_kind varchar(32) NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    rationale text CHECK (char_length(rationale) <= 8000) NOT NULL,
    PRIMARY KEY (owner_revision_id,requires_object_id),
    UNIQUE (owner_revision_id,ordinal)
);

CREATE TABLE optional_enrichment (
    owner_revision_id bigint NOT NULL,
    owner_kind varchar(32) NOT NULL,
    target_object_id bigint NOT NULL,
    target_kind varchar(32) NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    rationale text CHECK (char_length(rationale) <= 8000) NOT NULL,
    PRIMARY KEY (owner_revision_id,target_object_id),
    UNIQUE (owner_revision_id,ordinal)
);

CREATE TABLE competency_revision (
    CONSTRAINT competency_revision_kind_ck CHECK (kind = 'COMPETENCY'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    module_object_id bigint NOT NULL,
    module_object_kind varchar(32) NOT NULL DEFAULT 'MODULE' CHECK (module_object_kind = 'MODULE'),
    outcome text CHECK (char_length(outcome) <= 8000) NOT NULL,
    diagnostic_prompt text CHECK (char_length(diagnostic_prompt) <= 16000) NOT NULL,
    diagnostic_bridge_id bigint NOT NULL,
    diagnostic_bridge_kind varchar(32) NOT NULL DEFAULT 'MODULE' CHECK (diagnostic_bridge_kind = 'MODULE'),
    diagnostic_pass text CHECK (char_length(diagnostic_pass) <= 8000) NOT NULL
);

CREATE TABLE resource_revision (
    CONSTRAINT resource_revision_kind_ck CHECK (kind = 'RESOURCE'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    author_organization varchar(500) NOT NULL,
    resource_type varchar(120) NOT NULL,
    canonical_locator_id bigint NOT NULL,
    doi varchar(255),
    edition varchar(255),
    cost varchar(16) NOT NULL,
    access_limitations text CHECK (char_length(access_limitations) <= 16000) NOT NULL,
    recommended_audience text CHECK (char_length(recommended_audience) <= 8000) NOT NULL,
    rationale text CHECK (char_length(rationale) <= 16000) NOT NULL,
    prerequisites_text text CHECK (char_length(prerequisites_text) <= 8000) NOT NULL,
    role varchar(24) NOT NULL,
    geography text CHECK (char_length(geography) <= 2000) NOT NULL,
    publication_date_raw varchar(80),
    publication_precision varchar(12) NOT NULL,
    updated_date_raw varchar(80),
    updated_precision varchar(12) NOT NULL,
    publication_status text CHECK (char_length(publication_status) <= 2000) NOT NULL,
    rights text CHECK (char_length(rights) <= 16000) NOT NULL,
    entitlement_status text CHECK (char_length(entitlement_status) <= 2000) NOT NULL,
    alternative_limit text CHECK (char_length(alternative_limit) <= 8000) NOT NULL,
    video_timestamp_reason text CHECK (char_length(video_timestamp_reason) <= 4000)
);

CREATE TABLE external_locator (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    original_url text CHECK (char_length(original_url) <= 4000) NOT NULL,
    normalized_url text CHECK (char_length(normalized_url) <= 4000) NOT NULL,
    normalization_version varchar(32) NOT NULL,
    url_hash varchar(64) NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE resource_identifier (
    resource_object_id bigint NOT NULL,
    resource_object_kind varchar(32) NOT NULL DEFAULT 'RESOURCE' CHECK (resource_object_kind = 'RESOURCE'),
    scheme varchar(16) NOT NULL,
    normalized_value varchar(500) NOT NULL,
    PRIMARY KEY (scheme,normalized_value),
    UNIQUE (resource_object_id,scheme,normalized_value)
);

CREATE TABLE resource_locator (
    resource_revision_id bigint NOT NULL,
    locator_id bigint NOT NULL,
    role varchar(24) NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    PRIMARY KEY (resource_revision_id,locator_id,role),
    UNIQUE (resource_revision_id,role,ordinal)
);

CREATE TABLE resource_unknown (
    resource_revision_id bigint NOT NULL,
    field varchar(40) NOT NULL,
    reason text CHECK (char_length(reason) <= 8000) NOT NULL,
    PRIMARY KEY (resource_revision_id,field)
);

CREATE TABLE resource_segment (
    resource_revision_id bigint NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    locator_id bigint,
    label varchar(500) NOT NULL CHECK (btrim(label) <> ''),
    start_seconds numeric(18,6),
    end_seconds numeric(18,6),
    section_locator text CHECK (char_length(section_locator) <= 2000),
    PRIMARY KEY (resource_revision_id,ordinal)
);

CREATE TABLE assignment_revision (
    CONSTRAINT assignment_revision_kind_ck CHECK (kind = 'ASSIGNMENT'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    resource_object_id bigint NOT NULL,
    resource_object_kind varchar(32) NOT NULL DEFAULT 'RESOURCE' CHECK (resource_object_kind = 'RESOURCE'),
    competency_object_id bigint NOT NULL,
    competency_object_kind varchar(32) NOT NULL DEFAULT 'COMPETENCY' CHECK (competency_object_kind = 'COMPETENCY'),
    reading_scope text CHECK (char_length(reading_scope) <= 16000) NOT NULL,
    purpose text CHECK (char_length(purpose) <= 16000) NOT NULL,
    verification_state varchar(32) NOT NULL
);

CREATE TABLE exercise_revision (
    CONSTRAINT exercise_revision_kind_ck CHECK (kind = 'EXERCISE'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    module_object_id bigint NOT NULL,
    module_object_kind varchar(32) NOT NULL DEFAULT 'MODULE' CHECK (module_object_kind = 'MODULE'),
    exercise_type varchar(32) NOT NULL,
    prompt text CHECK (char_length(prompt) <= 50000) NOT NULL,
    reference_behavior text CHECK (char_length(reference_behavior) <= 50000) NOT NULL,
    data_plan text CHECK (char_length(data_plan) <= 16000) NOT NULL,
    deliverable text CHECK (char_length(deliverable) <= 16000) NOT NULL,
    pass_score numeric(5,2) CHECK (pass_score BETWEEN 0 AND 100) NOT NULL,
    tolerance_text text CHECK (char_length(tolerance_text) <= 16000) NOT NULL,
    fresh_variant text CHECK (char_length(fresh_variant) <= 16000) NOT NULL,
    noncoding_route text CHECK (char_length(noncoding_route) <= 16000) NOT NULL,
    practice_question_revision_id bigint
);

CREATE TABLE blueprint_revision (
    CONSTRAINT blueprint_revision_kind_ck CHECK (kind = 'BLUEPRINT'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    module_object_id bigint NOT NULL,
    module_object_kind varchar(32) NOT NULL DEFAULT 'MODULE' CHECK (module_object_kind = 'MODULE'),
    pass_score numeric(5,2) CHECK (pass_score BETWEEN 0 AND 100) NOT NULL,
    critical_error_policy text CHECK (char_length(critical_error_policy) <= 8000) NOT NULL,
    retries text CHECK (char_length(retries) <= 8000) NOT NULL
);

CREATE TABLE blueprint_item (
    blueprint_revision_id bigint NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    item_kind varchar(24) NOT NULL,
    question_text text CHECK (char_length(question_text) <= 16000),
    exercise_object_id bigint,
    exercise_object_kind varchar(32) NOT NULL DEFAULT 'EXERCISE' CHECK (exercise_object_kind = 'EXERCISE'),
    weight numeric(5,2) CHECK (weight BETWEEN 0 AND 100) NOT NULL,
    PRIMARY KEY (blueprint_revision_id,ordinal)
);

CREATE TABLE project_revision (
    CONSTRAINT project_revision_kind_ck CHECK (kind = 'PROJECT'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    pass_score numeric(5,2) CHECK (pass_score BETWEEN 0 AND 100) NOT NULL,
    real_money_required boolean NOT NULL
);

CREATE TABLE rubric_criterion (
    owner_revision_id bigint NOT NULL,
    code varchar(80) NOT NULL CHECK (btrim(code) <> ''),
    ordinal int NOT NULL CHECK (ordinal > 0),
    weight numeric(5,2) CHECK (weight BETWEEN 0 AND 100) NOT NULL,
    description text CHECK (char_length(description) <= 8000) NOT NULL,
    PRIMARY KEY (owner_revision_id,code),
    UNIQUE (owner_revision_id,ordinal)
);

CREATE TABLE path_revision (
    CONSTRAINT path_revision_kind_ck CHECK (kind = 'PATH'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    path_type varchar(24) NOT NULL,
    diagnostic_quiz_revision_id bigint
);

CREATE TABLE decision_revision (
    CONSTRAINT decision_revision_kind_ck CHECK (kind = 'DECISION'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    question_text text CHECK (char_length(question_text) <= 16000) NOT NULL
);

CREATE TABLE policy_revision (
    CONSTRAINT policy_revision_kind_ck CHECK (kind = 'POLICY'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    policy_version int NOT NULL CHECK (policy_version > 0),
    pass_score numeric(5,2) CHECK (pass_score BETWEEN 0 AND 100) NOT NULL
);

CREATE TABLE source_artifact (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    repository_path text CHECK (char_length(repository_path) <= 2000) NOT NULL,
    path_hash varchar(64) NOT NULL,
    sha256 varchar(64) NOT NULL,
    byte_count bigint NOT NULL,
    media_type varchar(100) NOT NULL,
    rights_state varchar(24) NOT NULL,
    restricted_storage_key text CHECK (char_length(restricted_storage_key) <= 2000) NOT NULL,
    source_version varchar(160),
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE provenance_anchor (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    artifact_id bigint NOT NULL,
    json_pointer text CHECK (char_length(json_pointer) <= 4000),
    line_start int,
    line_end int,
    locator_label text CHECK (char_length(locator_label) <= 2000),
    locator_hash varchar(64) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE revision_provenance (
    revision_id bigint NOT NULL,
    anchor_id bigint NOT NULL,
    role varchar(24) NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    PRIMARY KEY (revision_id,anchor_id,role)
);

CREATE TABLE source_record (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id varchar(160) NOT NULL CHECK (btrim(external_id) <> ''),
    artifact_id bigint NOT NULL,
    pointer text CHECK (char_length(pointer) <= 4000) NOT NULL,
    source_kind varchar(80) NOT NULL,
    original_id varchar(160),
    disposition text CHECK (char_length(disposition) <= 8000) NOT NULL,
    original_payload jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    UNIQUE (external_id,artifact_id)
);

CREATE TABLE source_mapping (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id varchar(160) NOT NULL CHECK (btrim(external_id) <> ''),
    original_id varchar(500) NOT NULL,
    source_kind varchar(80) NOT NULL,
    disposition varchar(120) NOT NULL,
    note text CHECK (char_length(note) <= 16000) NOT NULL,
    import_batch_id bigint NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    UNIQUE (external_id,import_batch_id)
);

CREATE TABLE mapping_anchor (
    mapping_id bigint NOT NULL,
    anchor_id bigint NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    PRIMARY KEY (mapping_id,anchor_id)
);

CREATE TABLE mapping_target (
    mapping_id bigint NOT NULL,
    target_object_id bigint NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    PRIMARY KEY (mapping_id,target_object_id)
);

CREATE TABLE archive_revision (
    CONSTRAINT archive_revision_kind_ck CHECK (kind = 'ARCHIVE'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    archive_kind varchar(80) NOT NULL,
    artifact_id bigint NOT NULL,
    original_pointer text CHECK (char_length(original_pointer) <= 4000),
    markdown text CHECK (char_length(markdown) <= 500000),
    disposition text CHECK (char_length(disposition) <= 16000)
);

CREATE TABLE evidence_claim (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id varchar(160) NOT NULL CHECK (btrim(external_id) <> ''),
    artifact_id bigint NOT NULL,
    pointer text CHECK (char_length(pointer) <= 4000) NOT NULL,
    statement text CHECK (char_length(statement) <= 16000) NOT NULL,
    claim_class varchar(80) NOT NULL,
    status varchar(80) NOT NULL,
    limitations text CHECK (char_length(limitations) <= 16000) NOT NULL,
    verified_on date,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    UNIQUE (external_id,artifact_id)
);

CREATE TABLE assignment_claim (
    assignment_revision_id bigint NOT NULL,
    claim_id bigint NOT NULL,
    PRIMARY KEY (assignment_revision_id,claim_id)
);

CREATE TABLE verification_event (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    subject_revision_id bigint NOT NULL,
    checked_at timestamptz NOT NULL,
    checked_on date NOT NULL,
    reviewer_actor_id bigint NOT NULL,
    scope text CHECK (char_length(scope) <= 16000) NOT NULL,
    method varchar(40) NOT NULL,
    outcome varchar(40) NOT NULL,
    next_due_at timestamptz,
    source_anchor_id bigint,
    uncertainty text CHECK (char_length(uncertainty) <= 16000),
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE authoring_task (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id varchar(160) NOT NULL UNIQUE CHECK (btrim(external_id) <> ''),
    topic_object_id bigint NOT NULL,
    topic_object_kind varchar(32) NOT NULL DEFAULT 'TOPIC' CHECK (topic_object_kind = 'TOPIC'),
    owner_stage varchar(24) NOT NULL,
    status varchar(40) NOT NULL,
    hours_min numeric(18,6) NOT NULL,
    hours_max numeric(18,6) NOT NULL,
    estimate_basis text CHECK (char_length(estimate_basis) <= 8000) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE authoring_step (
    task_id bigint NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    description text CHECK (char_length(description) <= 8000) NOT NULL,
    completed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    PRIMARY KEY (task_id,ordinal)
);

CREATE TABLE rule_subject (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    jurisdiction varchar(100) NOT NULL,
    exchange varchar(100),
    instrument text CHECK (char_length(instrument) <= 1000) NOT NULL,
    instrument_key varchar(160) NOT NULL,
    product_scope text CHECK (char_length(product_scope) <= 4000) NOT NULL,
    market_zone varchar(80),
    unknown_zone_reason text CHECK (char_length(unknown_zone_reason) <= 4000),
    rule_type varchar(80) NOT NULL,
    scope_hash varchar(64) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE official_notice (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    identifier varchar(300) NOT NULL,
    issuing_body varchar(160) NOT NULL,
    revision_no int NOT NULL CHECK (revision_no > 0),
    locator_id bigint,
    publication_date date,
    unknown_date_reason text CHECK (char_length(unknown_date_reason) <= 8000),
    unknown_locator_reason text CHECK (char_length(unknown_locator_reason) <= 8000),
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    UNIQUE (issuing_body,identifier,revision_no)
);

CREATE TABLE notice_supersession (
    older_notice_id bigint NOT NULL,
    newer_notice_id bigint NOT NULL,
    scope text CHECK (char_length(scope) <= 4000) NOT NULL,
    recorded_on date NOT NULL,
    PRIMARY KEY (older_notice_id,newer_notice_id)
);

CREATE TABLE rule_revision (
    CONSTRAINT rule_revision_kind_ck CHECK (kind = 'RULE'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    subject_id bigint NOT NULL,
    notice_id bigint NOT NULL,
    value_text text CHECK (char_length(value_text) <= 16000) NOT NULL,
    value_numeric numeric(18,6),
    unit varchar(100),
    effective_from date,
    effective_to date,
    date_precision varchar(16) NOT NULL,
    unknown_date_reason text CHECK (char_length(unknown_date_reason) <= 8000),
    scope text CHECK (char_length(scope) <= 16000) NOT NULL,
    uncertainty text CHECK (char_length(uncertainty) <= 16000) NOT NULL,
    review_status varchar(80) NOT NULL,
    review_owner_label varchar(200) NOT NULL,
    review_interval_days int NOT NULL,
    historical_eligible boolean NOT NULL,
    historical_eligible_scope text CHECK (char_length(historical_eligible_scope) <= 8000) NOT NULL,
    imported_current_eligible boolean NOT NULL
);

CREATE TABLE rule_supersession (
    older_rule_id bigint NOT NULL,
    older_rule_kind varchar(32) NOT NULL DEFAULT 'RULE' CHECK (older_rule_kind = 'RULE'),
    newer_rule_id bigint NOT NULL,
    newer_rule_kind varchar(32) NOT NULL DEFAULT 'RULE' CHECK (newer_rule_kind = 'RULE'),
    scope text CHECK (char_length(scope) <= 4000) NOT NULL,
    PRIMARY KEY (older_rule_id,newer_rule_id)
);

CREATE TABLE rule_certification (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    subject_id bigint NOT NULL,
    rule_revision_id bigint NOT NULL,
    verification_id bigint NOT NULL,
    valid_dates daterange NOT NULL,
    status varchar(24) NOT NULL,
    review_due_at timestamptz NOT NULL,
    approved_by_actor_id bigint NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE rule_dependency (
    rule_object_id bigint NOT NULL,
    rule_object_kind varchar(32) NOT NULL DEFAULT 'RULE' CHECK (rule_object_kind = 'RULE'),
    dependent_revision_id bigint NOT NULL,
    use_type varchar(24) NOT NULL,
    rationale text CHECK (char_length(rationale) <= 8000) NOT NULL,
    PRIMARY KEY (rule_object_id,dependent_revision_id,use_type)
);

CREATE TABLE publication (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id uuid UNIQUE NOT NULL,
    label varchar(160) NOT NULL CHECK (btrim(label) <> ''),
    previous_id bigint,
    imported_package_version varchar(80),
    created_by_actor_id bigint NOT NULL,
    manifest_hash varchar(64) NOT NULL,
    status varchar(24) NOT NULL,
    validated_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE publication_entry (
    publication_id bigint NOT NULL,
    object_id bigint NOT NULL,
    revision_id bigint NOT NULL,
    visibility varchar(16) NOT NULL,
    indexable boolean NOT NULL,
    display_order int NOT NULL,
    PRIMARY KEY (publication_id,object_id)
);

CREATE TABLE active_publication (
    singleton smallint NOT NULL PRIMARY KEY,
    publication_id bigint NOT NULL,
    generation bigint NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE review_decision (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    revision_id bigint NOT NULL,
    review_type varchar(24) NOT NULL,
    actor_id bigint NOT NULL,
    outcome varchar(16) NOT NULL,
    reviewed_hash varchar(64) NOT NULL,
    findings text CHECK (char_length(findings) <= 16000) NOT NULL,
    decided_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE content_withdrawal (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    object_id bigint NOT NULL,
    revision_id bigint,
    reason_code varchar(40) NOT NULL,
    public_message text CHECK (char_length(public_message) <= 4000) NOT NULL,
    actor_id bigint NOT NULL,
    starts_at timestamptz NOT NULL,
    reinstated_at timestamptz,
    reinstatement_review_id bigint,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE editorial_event (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_id bigint NOT NULL,
    event_type varchar(40) NOT NULL,
    object_id bigint,
    revision_id bigint,
    publication_id bigint,
    import_batch_id bigint,
    request_id varchar(64) NOT NULL,
    reason_code varchar(80) NOT NULL,
    occurred_at timestamptz NOT NULL,
    actor_role varchar(24) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE import_batch (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    package_id varchar(160) NOT NULL,
    schema_version varchar(80) NOT NULL,
    manifest_sha256 varchar(64) NOT NULL,
    source_as_of date NOT NULL,
    run_no int NOT NULL CHECK (run_no > 0),
    base_publication_id bigint,
    actor_id bigint NOT NULL,
    artifact_id bigint NOT NULL,
    state varchar(24) NOT NULL,
    report jsonb NOT NULL,
    report_version varchar(32) NOT NULL,
    applied_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE import_proposal (
    batch_id bigint NOT NULL,
    object_id bigint NOT NULL,
    base_revision_id bigint,
    proposed_revision_id bigint NOT NULL,
    outcome varchar(24) NOT NULL,
    decision_reason text CHECK (char_length(decision_reason) <= 8000),
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    PRIMARY KEY (batch_id,object_id)
);

CREATE TABLE public_search_document (
    publication_id bigint NOT NULL,
    object_id bigint NOT NULL,
    kind varchar(32) NOT NULL,
    title varchar(500) NOT NULL CHECK (btrim(title) <> ''),
    title_key varchar(500) NOT NULL,
    author_text text CHECK (char_length(author_text) <= 2000) NOT NULL,
    summary text CHECK (char_length(summary) <= 16000) NOT NULL,
    search_vector tsvector NOT NULL,
    difficulty varchar(80),
    priority varchar(24),
    readiness varchar(32) NOT NULL,
    hours_min numeric(18,6),
    PRIMARY KEY (publication_id,object_id)
);

CREATE TABLE content_issue (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id uuid UNIQUE NOT NULL,
    account_id bigint NOT NULL,
    object_id bigint NOT NULL,
    revision_id bigint,
    message text CHECK (char_length(message) <= 2000) NOT NULL,
    status varchar(24) NOT NULL,
    closed_at timestamptz,
    assigned_actor_id bigint,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE job (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kind varchar(32) NOT NULL,
    dedupe_key varchar(200) NOT NULL UNIQUE,
    account_id bigint,
    publication_id bigint,
    import_batch_id bigint,
    privacy_request_id bigint,
    mail_purpose varchar(24),
    target_email varchar(320),
    requested_generation bigint,
    intent_expires_at timestamptz,
    state varchar(16) NOT NULL,
    due_at timestamptz NOT NULL,
    lease_until timestamptz,
    lease_token uuid UNIQUE,
    attempts int NOT NULL,
    last_error_code varchar(80),
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE recovery_journal (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sequence_no bigint NOT NULL UNIQUE,
    event_type varchar(32) NOT NULL,
    subject_public_id uuid,
    object_external_id varchar(160),
    owned_record_public_id uuid,
    publication_id bigint,
    digest varchar(64) NOT NULL,
    durable_at timestamptz,
    expires_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE security_event (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_account_id bigint,
    event_type varchar(40) NOT NULL,
    request_id varchar(64) NOT NULL,
    outcome varchar(40) NOT NULL,
    source_bucket_hash bytea,
    occurred_at timestamptz NOT NULL,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE quiz_revision (
    CONSTRAINT quiz_revision_kind_ck CHECK (kind = 'QUIZ'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    purpose varchar(16) NOT NULL,
    blueprint_object_id bigint,
    blueprint_object_kind varchar(32) NOT NULL DEFAULT 'BLUEPRINT' CHECK (blueprint_object_kind = 'BLUEPRINT'),
    policy_revision_id bigint NOT NULL,
    pass_score numeric(5,2) CHECK (pass_score BETWEEN 0 AND 100) NOT NULL,
    scoring_version varchar(80) NOT NULL,
    critical_required boolean NOT NULL,
    expected_items int NOT NULL,
    max_fresh_forms int NOT NULL
);

CREATE TABLE question_revision (
    CONSTRAINT question_revision_kind_ck CHECK (kind = 'QUESTION'),
    revision_id bigint NOT NULL PRIMARY KEY,
    kind varchar(32) NOT NULL,
    question_type varchar(16) NOT NULL,
    prompt text CHECK (char_length(prompt) <= 50000) NOT NULL,
    explanation text CHECK (char_length(explanation) <= 50000) NOT NULL,
    critical boolean NOT NULL,
    expected_numeric numeric(30,12),
    abs_tolerance numeric(30,12),
    rel_tolerance numeric(18,12),
    expected_unit varchar(100)
);

CREATE TABLE question_choice (
    question_revision_id bigint NOT NULL,
    choice_key varchar(32) NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    text text CHECK (char_length(text) <= 16000) NOT NULL,
    correct boolean NOT NULL,
    feedback text CHECK (char_length(feedback) <= 16000) NOT NULL,
    PRIMARY KEY (question_revision_id,choice_key),
    UNIQUE (question_revision_id,ordinal)
);

CREATE TABLE quiz_form (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    quiz_revision_id bigint NOT NULL,
    form_code varchar(40) NOT NULL,
    exposure_group uuid NOT NULL,
    variant_note text CHECK (char_length(variant_note) <= 8000) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    UNIQUE (quiz_revision_id,form_code),
    UNIQUE (id,quiz_revision_id)
);

CREATE TABLE quiz_form_item (
    form_id bigint NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    question_revision_id bigint NOT NULL,
    weight numeric(5,2) CHECK (weight BETWEEN 0 AND 100) NOT NULL,
    PRIMARY KEY (form_id,ordinal),
    UNIQUE (form_id,question_revision_id),
    UNIQUE (form_id,ordinal,question_revision_id)
);

CREATE TABLE course_gate (
    path_revision_id bigint NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    quiz_revision_id bigint NOT NULL,
    after_topic_id bigint NOT NULL,
    after_topic_kind varchar(32) NOT NULL DEFAULT 'TOPIC' CHECK (after_topic_kind = 'TOPIC'),
    PRIMARY KEY (path_revision_id,ordinal),
    UNIQUE (path_revision_id,quiz_revision_id)
);

CREATE TABLE course_project (
    path_revision_id bigint NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    project_revision_id bigint NOT NULL,
    required boolean NOT NULL,
    PRIMARY KEY (path_revision_id,ordinal),
    UNIQUE (path_revision_id,project_revision_id)
);

CREATE TABLE path_topic_prerequisite (
    path_revision_id bigint NOT NULL,
    topic_object_id bigint NOT NULL,
    topic_object_kind varchar(32) NOT NULL DEFAULT 'TOPIC' CHECK (topic_object_kind = 'TOPIC'),
    requires_topic_id bigint NOT NULL,
    requires_topic_kind varchar(32) NOT NULL DEFAULT 'TOPIC' CHECK (requires_topic_kind = 'TOPIC'),
    rationale text CHECK (char_length(rationale) <= 8000) NOT NULL,
    PRIMARY KEY (path_revision_id,topic_object_id,requires_topic_id)
);

CREATE TABLE assessment_competency (
    assessment_revision_id bigint NOT NULL,
    competency_revision_id bigint NOT NULL,
    evidence_level varchar(24) NOT NULL,
    rationale text CHECK (char_length(rationale) <= 8000) NOT NULL,
    PRIMARY KEY (assessment_revision_id,competency_revision_id)
);

CREATE TABLE assessment_exposure_group (
    id uuid PRIMARY KEY,
    reason text CHECK (char_length(reason) <= 4000) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE project_field (
    project_revision_id bigint NOT NULL,
    field_key varchar(80) NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    field_type varchar(16) NOT NULL,
    label text CHECK (char_length(label) <= 2000) NOT NULL CHECK (btrim(label) <> ''),
    required boolean NOT NULL,
    expected_numeric numeric(30,12),
    tolerance numeric(30,12),
    unit varchar(100),
    critical boolean NOT NULL,
    PRIMARY KEY (project_revision_id,field_key)
);

CREATE TABLE enrollment (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id uuid UNIQUE NOT NULL,
    account_id bigint NOT NULL,
    path_revision_id bigint NOT NULL,
    publication_id bigint NOT NULL,
    previous_enrollment_id bigint,
    state varchar(24) NOT NULL,
    completed_at timestamptz,
    path_object_id bigint NOT NULL,
    sealed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    UNIQUE (id,account_id),
    UNIQUE (id,path_revision_id),
    UNIQUE (id,account_id,path_object_id)
);

CREATE TABLE enrollment_requirement (
    enrollment_id bigint NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    object_id bigint NOT NULL,
    revision_id bigint NOT NULL,
    kind varchar(32) NOT NULL,
    required boolean NOT NULL,
    source_module_id bigint,
    source_module_kind varchar(32) NOT NULL DEFAULT 'MODULE' CHECK (source_module_kind = 'MODULE'),
    PRIMARY KEY (enrollment_id,ordinal),
    UNIQUE (enrollment_id,object_id,kind)
);

CREATE TABLE learning_progress (
    account_id bigint NOT NULL,
    topic_object_id bigint NOT NULL,
    topic_revision_id bigint NOT NULL,
    state varchar(16) NOT NULL,
    first_started_at timestamptz NOT NULL,
    self_completed_at timestamptz,
    last_confirmed_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    PRIMARY KEY (account_id,topic_revision_id)
);

CREATE TABLE bookmark (
    account_id bigint NOT NULL,
    object_id bigint NOT NULL,
    kind varchar(32) NOT NULL,
    saved_at timestamptz NOT NULL,
    PRIMARY KEY (account_id,object_id)
);

CREATE TABLE private_note (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id uuid UNIQUE NOT NULL,
    account_id bigint NOT NULL,
    object_id bigint NOT NULL,
    kind varchar(32) NOT NULL,
    text text CHECK (char_length(text) <= 10000) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    UNIQUE (account_id,object_id)
);

CREATE TABLE quiz_attempt (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id uuid UNIQUE NOT NULL,
    account_id bigint NOT NULL,
    enrollment_id bigint NOT NULL,
    quiz_revision_id bigint NOT NULL,
    form_id bigint NOT NULL,
    ordinal int NOT NULL CHECK (ordinal > 0),
    purpose varchar(16) NOT NULL,
    state varchar(16) NOT NULL,
    started_at timestamptz NOT NULL,
    submitted_at timestamptz,
    exposed_at timestamptz NOT NULL,
    solution_viewed_at timestamptz,
    request_key uuid NOT NULL,
    request_hash varchar(64),
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    UNIQUE (account_id,request_key),
    UNIQUE (enrollment_id,quiz_revision_id,ordinal),
    UNIQUE (id,account_id),
    UNIQUE (id,form_id)
);

CREATE TABLE attempt_answer (
    attempt_id bigint NOT NULL,
    form_id bigint NOT NULL,
    item_ordinal int NOT NULL,
    question_revision_id bigint NOT NULL,
    numeric_value numeric(30,12),
    submitted_unit varchar(100),
    raw_response text CHECK (char_length(raw_response) <= 20000),
    awarded_score numeric(5,2) CHECK (awarded_score BETWEEN 0 AND 100),
    critical_error boolean,
    feedback text CHECK (char_length(feedback) <= 16000),
    PRIMARY KEY (attempt_id,item_ordinal),
    UNIQUE (attempt_id,item_ordinal,question_revision_id)
);

CREATE TABLE answer_choice (
    attempt_id bigint NOT NULL,
    item_ordinal int NOT NULL,
    question_revision_id bigint NOT NULL,
    choice_key varchar(32) NOT NULL,
    PRIMARY KEY (attempt_id,item_ordinal,choice_key)
);

CREATE TABLE attempt_result (
    attempt_id bigint NOT NULL PRIMARY KEY,
    total_score numeric(5,2) CHECK (total_score BETWEEN 0 AND 100) NOT NULL,
    critical_failures int NOT NULL,
    passed boolean NOT NULL,
    fresh_evidence boolean NOT NULL,
    scoring_version varchar(80) NOT NULL,
    finalized_at timestamptz NOT NULL
);

CREATE TABLE form_exposure (
    account_id bigint NOT NULL,
    exposure_group uuid NOT NULL,
    first_attempt_id bigint NOT NULL,
    first_seen_at timestamptz NOT NULL,
    purpose varchar(24) NOT NULL,
    PRIMARY KEY (account_id,exposure_group)
);

CREATE TABLE remediation_record (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id bigint NOT NULL,
    failed_attempt_id bigint NOT NULL,
    topic_revision_id bigint NOT NULL,
    topic_revision_kind varchar(32) NOT NULL DEFAULT 'TOPIC' CHECK (topic_revision_kind = 'TOPIC'),
    completed_at timestamptz,
    self_explanation text CHECK (char_length(self_explanation) <= 10000),
    practice_response_id bigint,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE assessment_request (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id bigint NOT NULL,
    enrollment_id bigint NOT NULL,
    quiz_revision_id bigint NOT NULL,
    reason varchar(40) NOT NULL,
    state varchar(24) NOT NULL,
    resolved_quiz_revision_id bigint,
    assigned_actor_id bigint,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE practice_response (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id bigint NOT NULL,
    exercise_revision_id bigint NOT NULL,
    response_text text CHECK (char_length(response_text) <= 20000) NOT NULL,
    solution_viewed_at timestamptz,
    completed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    UNIQUE (id,account_id)
);

CREATE TABLE project_work (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id uuid UNIQUE NOT NULL,
    account_id bigint NOT NULL,
    project_revision_id bigint NOT NULL,
    state varchar(24) NOT NULL,
    submitted_at timestamptz,
    self_review_score numeric(5,2) CHECK (self_review_score BETWEEN 0 AND 100),
    critical_acknowledged boolean NOT NULL,
    submission_no int NOT NULL CHECK (submission_no > 0),
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    UNIQUE (account_id,project_revision_id,submission_no),
    UNIQUE (id,project_revision_id),
    UNIQUE (id,account_id)
);

CREATE TABLE project_response (
    work_id bigint NOT NULL,
    project_revision_id bigint NOT NULL,
    field_key varchar(80) NOT NULL,
    text_value text CHECK (char_length(text_value) <= 20000),
    numeric_value numeric(30,12),
    PRIMARY KEY (work_id,field_key)
);

CREATE TABLE mastery_evidence (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id bigint NOT NULL,
    competency_revision_id bigint NOT NULL,
    attempt_id bigint,
    project_work_id bigint,
    rubric_revision_id bigint NOT NULL,
    evidence_type varchar(24) NOT NULL,
    awarded_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    UNIQUE (id,account_id)
);

CREATE TABLE revision_equivalence (
    old_revision_id bigint NOT NULL,
    new_revision_id bigint NOT NULL,
    review_id bigint NOT NULL,
    rationale text CHECK (char_length(rationale) <= 8000) NOT NULL,
    PRIMARY KEY (old_revision_id,new_revision_id)
);

CREATE TABLE evidence_recheck (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id bigint NOT NULL,
    evidence_id bigint,
    attempt_id bigint,
    affected_revision_id bigint NOT NULL,
    correction_revision_id bigint,
    reason text CHECK (char_length(reason) <= 4000) NOT NULL,
    resolved_at timestamptz,
    resolving_attempt_id bigint,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE privacy_request (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id uuid UNIQUE NOT NULL,
    account_id bigint,
    subject_public_id uuid NOT NULL,
    kind varchar(16) NOT NULL,
    state varchar(24) NOT NULL,
    requested_at timestamptz NOT NULL,
    ready_at timestamptz,
    expires_at timestamptz,
    completed_at timestamptz,
    private_object_key text CHECK (char_length(private_object_key) <= 2000),
    receipt_code varchar(80),
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0)
);

CREATE TABLE command_receipt (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_account_id bigint NOT NULL,
    operation_id varchar(100) NOT NULL,
    route_key varchar(500) NOT NULL,
    request_key uuid NOT NULL,
    request_sha256 varchar(64) NOT NULL,
    response_status smallint NOT NULL,
    expiry_at timestamptz NOT NULL,
    result_account_id bigint,
    enrollment_id bigint,
    attempt_id bigint,
    remediation_id bigint,
    assessment_request_id bigint,
    project_work_id bigint,
    issue_id bigint,
    privacy_request_id bigint,
    import_batch_id bigint,
    revision_id bigint,
    review_id bigint,
    publication_id bigint,
    withdrawal_id bigint,
    job_id bigint,
    created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
    lock_version bigint NOT NULL DEFAULT 0 CHECK (lock_version >= 0),
    UNIQUE (actor_account_id,operation_id,route_key,request_key)
);

CREATE TABLE quiz_remediation_requirement (
    quiz_revision_id bigint NOT NULL,
    question_revision_id bigint NOT NULL,
    topic_revision_id bigint NOT NULL,
    topic_revision_kind varchar(32) NOT NULL DEFAULT 'TOPIC' CHECK (topic_revision_kind = 'TOPIC'),
    exercise_revision_id bigint NOT NULL,
    PRIMARY KEY (quiz_revision_id,question_revision_id,topic_revision_id,exercise_revision_id)
);
