-- Recovery checkpoints must reference versions of their own stable object.
ALTER TABLE import_head_change ADD CONSTRAINT import_before_owner_fk
 FOREIGN KEY(before_revision_id,object_id) REFERENCES catalog_revision(id,object_id) ON DELETE RESTRICT;
ALTER TABLE import_head_change ADD CONSTRAINT import_after_owner_fk
 FOREIGN KEY(after_revision_id,object_id) REFERENCES catalog_revision(id,object_id) ON DELETE RESTRICT;
CREATE INDEX import_head_change_before_owner_idx ON import_head_change(before_revision_id,object_id);
CREATE INDEX import_head_change_after_owner_idx ON import_head_change(after_revision_id,object_id);
