-- FK erasure actions may null surviving historical references during account cascades.
CREATE OR REPLACE FUNCTION protect_owner() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE owner_id bigint;
BEGIN
 owner_id=(to_jsonb(NEW)->>'account_id')::bigint;
 IF TG_OP='UPDATE' AND (to_jsonb(OLD)->>'account_id') IS DISTINCT FROM (to_jsonb(NEW)->>'account_id') THEN
  RAISE EXCEPTION 'owner identity cannot change' USING ERRCODE='23514',CONSTRAINT='owner_immutable'; END IF;
 IF TG_OP='UPDATE' AND NOT EXISTS(SELECT 1 FROM account WHERE id=owner_id) THEN RETURN NEW; END IF;
 PERFORM 1 FROM account WHERE id=owner_id AND status='ACTIVE' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'owned write requires active verified account' USING ERRCODE='23514',CONSTRAINT='active_owner'; END IF;
 RETURN NEW;
END $$;
CREATE FUNCTION protect_credential() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.account_id<>OLD.account_id OR NEW.credential_id<>OLD.credential_id OR NEW.user_handle<>OLD.user_handle OR NEW.public_key<>OLD.public_key OR NEW.sign_count<OLD.sign_count OR NEW.backup_eligible<>OLD.backup_eligible OR (OLD.revoked_at IS NOT NULL AND NEW.revoked_at IS DISTINCT FROM OLD.revoked_at) THEN
  RAISE EXCEPTION 'credential identity, key, counter or revocation cannot be reset' USING ERRCODE='23514',CONSTRAINT='credential_identity'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER credential_identity BEFORE UPDATE ON webauthn_credential FOR EACH ROW EXECUTE FUNCTION protect_credential();
CREATE FUNCTION resource_identity_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'resource edition identity cannot be reassigned; retain the old object and record a reviewed replacement' USING ERRCODE='23514',CONSTRAINT='resource_identity'; END $$;
CREATE TRIGGER resource_identity BEFORE UPDATE OR DELETE ON resource_identifier FOR EACH ROW EXECUTE FUNCTION resource_identity_immutable();
REVOKE ALL ON FUNCTION protect_credential(),resource_identity_immutable() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION protect_credential(),resource_identity_immutable() TO otr_runtime,otr_import,otr_privacy;
