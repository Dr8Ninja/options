-- Native SQL and JPA both advance versions; old tabs cannot overwrite a security/admin edit.
CREATE FUNCTION advance_lock_version() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.lock_version NOT IN (OLD.lock_version,OLD.lock_version+1) THEN
  RAISE EXCEPTION 'invalid optimistic version transition' USING ERRCODE='23514',CONSTRAINT='lock_version_transition'; END IF;
 NEW.lock_version=OLD.lock_version+1;
 NEW.updated_at=transaction_timestamp();
 RETURN NEW;
END $$;
DO $$ DECLARE r record; BEGIN
 FOR r IN SELECT table_name FROM information_schema.columns WHERE table_schema=current_schema() AND column_name='lock_version' AND table_name NOT IN ('command_receipt') LOOP
  EXECUTE format('CREATE TRIGGER zz_advance_version BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION advance_lock_version()',r.table_name);
 END LOOP;
END $$;
REVOKE ALL ON FUNCTION advance_lock_version() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION advance_lock_version() TO otr_runtime,otr_import,otr_privacy;
