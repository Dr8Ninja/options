-- P13: privilege invitations are provisioned only by an offline operator.
CREATE TABLE identity_invitation (
 account_id bigint PRIMARY KEY REFERENCES account(id) ON DELETE CASCADE,
 role_code varchar(24) NOT NULL CHECK(role_code IN ('ADMIN','EDITOR','REVIEWER_PUBLISHER')),
 actor_id bigint NOT NULL REFERENCES editorial_actor(id),
 operator_record varchar(200) NOT NULL CHECK(length(btrim(operator_record))>0),
 expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE webauthn_credential ADD COLUMN public_id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE;
ALTER TABLE webauthn_credential ADD COLUMN uv_initialized boolean NOT NULL DEFAULT false;
ALTER TABLE webauthn_credential ADD COLUMN attestation_object bytea;
ALTER TABLE webauthn_credential ADD COLUMN attestation_client_data bytea;
ALTER TABLE webauthn_credential ADD COLUMN last_used_at timestamptz;
CREATE TABLE identity_webauthn_user (
 account_id bigint PRIMARY KEY REFERENCES account(id) ON DELETE CASCADE,
 user_handle bytea NOT NULL UNIQUE CHECK(octet_length(user_handle) BETWEEN 16 AND 64)
);
CREATE TABLE identity_mail_notice (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 account_id bigint NOT NULL REFERENCES account(id) ON DELETE CASCADE,
 recipient varchar(320) NOT NULL,
 attempts integer NOT NULL DEFAULT 0 CHECK(attempts BETWEEN 0 AND 10),
 due_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL DEFAULT now()+interval '24 hours'
);
DO $$ DECLARE s text=current_schema(); BEGIN
 EXECUTE format('REVOKE INSERT,UPDATE ON %I.account_role,%I.role FROM otr_runtime',s,s);
 EXECUTE format('GRANT SELECT,DELETE ON %I.identity_invitation TO otr_runtime',s);
 EXECUTE format('GRANT DELETE ON %I.job TO otr_runtime',s);
 EXECUTE format('GRANT SELECT,INSERT,UPDATE,DELETE ON %I.identity_webauthn_user,%I.identity_mail_notice TO otr_runtime',s,s);
 EXECUTE format('GRANT USAGE,SELECT ON SEQUENCE %I.identity_mail_notice_id_seq TO otr_runtime',s);
 EXECUTE format('REVOKE INSERT,UPDATE ON %I.account_role,%I.role FROM otr_runtime',s,s);
 EXECUTE format('GRANT SELECT,DELETE ON %I.identity_invitation,%I.identity_webauthn_user,%I.identity_mail_notice TO otr_privacy',s,s,s);
END $$;

CREATE INDEX identity_invitation_actor_idx ON identity_invitation(actor_id);
CREATE INDEX identity_mail_notice_account_idx ON identity_mail_notice(account_id);
CREATE INDEX identity_mail_notice_due_idx ON identity_mail_notice(due_at,id) WHERE attempts<10;
