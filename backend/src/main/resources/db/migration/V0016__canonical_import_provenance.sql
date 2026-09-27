-- P09 interchange metadata is not domain payload: bodies remain typed P04 rows.
CREATE TABLE canonical_revision_source (
 revision_id bigint PRIMARY KEY REFERENCES catalog_revision(id) ON DELETE RESTRICT,
 source_record_id bigint NOT NULL REFERENCES source_record(id) ON DELETE RESTRICT,
 collection varchar(80) NOT NULL,
 ordinal integer NOT NULL CHECK (ordinal>0),
 source_hash varchar(64) NOT NULL CHECK (source_hash ~ '^[a-f0-9]{64}$')
);
CREATE INDEX canonical_revision_source_record_idx ON canonical_revision_source(source_record_id);
CREATE TABLE import_member (
 batch_id bigint NOT NULL REFERENCES import_batch(id) ON DELETE RESTRICT,
 collection varchar(80) NOT NULL,
 external_id varchar(160) NOT NULL,
 ordinal integer NOT NULL CHECK(ordinal>0),
 source_record_id bigint NOT NULL REFERENCES source_record(id) ON DELETE RESTRICT,
 revision_id bigint REFERENCES catalog_revision(id) ON DELETE RESTRICT,
 mapping_id bigint REFERENCES source_mapping(id) ON DELETE RESTRICT,
 task_id bigint REFERENCES authoring_task(id) ON DELETE RESTRICT,
 PRIMARY KEY(batch_id,collection,external_id), UNIQUE(batch_id,collection,ordinal)
);
CREATE INDEX import_member_source_idx ON import_member(source_record_id);
CREATE INDEX import_member_revision_idx ON import_member(revision_id);
CREATE INDEX import_member_mapping_idx ON import_member(mapping_id);
CREATE INDEX import_member_task_idx ON import_member(task_id);
CREATE TRIGGER canonical_source_immutable BEFORE UPDATE OR DELETE ON canonical_revision_source FOR EACH ROW EXECUTE FUNCTION reject_immutable();
CREATE TRIGGER import_member_immutable BEFORE UPDATE OR DELETE ON import_member FOR EACH ROW EXECUTE FUNCTION reject_immutable();
GRANT SELECT,INSERT ON canonical_revision_source,import_member TO otr_import,otr_runtime;
GRANT SELECT ON active_publication TO otr_import;
-- An operator bootstrap actor has no account; runtime provisioning remains separate.
GRANT INSERT ON editorial_actor TO otr_import;
GRANT INSERT ON editorial_event,job TO otr_import;
CREATE TABLE import_head_change (
 batch_id bigint NOT NULL REFERENCES import_batch(id) ON DELETE RESTRICT,
 object_id bigint NOT NULL REFERENCES catalog_object(id) ON DELETE RESTRICT,
 before_revision_id bigint REFERENCES catalog_revision(id) ON DELETE RESTRICT,
 after_revision_id bigint NOT NULL REFERENCES catalog_revision(id) ON DELETE RESTRICT,
 before_retired_at timestamptz,
 after_retired_at timestamptz,
 PRIMARY KEY(batch_id,object_id)
);
CREATE INDEX import_head_change_object_idx ON import_head_change(object_id);
CREATE INDEX import_head_change_before_idx ON import_head_change(before_revision_id);
CREATE INDEX import_head_change_after_idx ON import_head_change(after_revision_id);
CREATE TRIGGER import_change_immutable BEFORE UPDATE OR DELETE ON import_head_change FOR EACH ROW EXECUTE FUNCTION reject_immutable();
GRANT SELECT,INSERT ON import_head_change TO otr_import,otr_runtime;
