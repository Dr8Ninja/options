#!/usr/bin/env python3
"""Offline privilege ceremony. Uses an operator connection; never an HTTP self-promotion path."""

import argparse
import os
import uuid
import psycopg

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("action", choices=["invite", "activate", "recover"])
parser.add_argument("--account", type=uuid.UUID, required=True)
parser.add_argument(
    "--operator-record",
    required=True,
    help="Reference to the verified operator custody/authorization record, not a secret",
)
parser.add_argument(
    "--role", choices=["ADMIN", "EDITOR", "REVIEWER_PUBLISHER"], default="ADMIN"
)
parser.add_argument("--independent-keys-confirmed", action="store_true")
a = parser.parse_args()
if not a.operator_record.strip() or len(a.operator_record) > 200:
    parser.error("Supply a bounded operator record reference")
if a.action == "activate" and not a.independent_keys_confirmed:
    parser.error("Verify two separately recoverable authenticators before activation")
# Password/DSN supplied through the operator environment, never command-line arguments or output.
with psycopg.connect(os.environ["IDENTITY_OPERATOR_DSN"]) as connection:
    with connection.cursor() as c:
        c.execute(
            "select id,status from account where public_id=%s for update", (a.account,)
        )
        row = c.fetchone()
        if not row or row[1] != "ACTIVE":
            raise SystemExit("An active verified account is required")
        account = row[0]
        if a.action == "recover":
            c.execute("delete from account_role where account_id=%s", (account,))
            c.execute("delete from identity_invitation where account_id=%s", (account,))
            c.execute(
                "update webauthn_credential set revoked_at=now(),lock_version=lock_version+1,updated_at=now() where account_id=%s and revoked_at is null",
                (account,),
            )
            c.execute(
                "update account set auth_generation=auth_generation+1,lock_version=lock_version+1,updated_at=now() where id=%s",
                (account,),
            )
        elif a.action == "invite":
            c.execute(
                "insert into editorial_actor(actor_ref,account_id,label) values(gen_random_uuid(),%s,'Registered operator') on conflict(account_id) do update set updated_at=now(),lock_version=editorial_actor.lock_version+1 returning id",
                (account,),
            )
            actor = c.fetchone()[0]
            c.execute(
                "insert into identity_invitation(account_id,role_code,actor_id,operator_record,expires_at) values(%s,%s,%s,%s,now()+interval '24 hours') on conflict(account_id) do update set role_code=excluded.role_code,operator_record=excluded.operator_record,expires_at=excluded.expires_at",
                (account, a.role, actor, a.operator_record),
            )
        else:
            c.execute(
                "select role_code,actor_id from identity_invitation where account_id=%s and operator_record=%s and expires_at>now() for update",
                (account, a.operator_record),
            )
            invitation = c.fetchone()
            c.execute(
                "select count(*) from webauthn_credential where account_id=%s and revoked_at is null and uv_initialized",
                (account,),
            )
            if not invitation or c.fetchone()[0] < 2:
                raise SystemExit(
                    "A current invitation and two verified authenticators are required"
                )
            c.execute(
                "insert into role(code) values(%s) on conflict(code) do nothing",
                (invitation[0],),
            )
            c.execute(
                "insert into account_role(account_id,role_id,granted_at,granted_by_actor_id) select %s,id,now(),%s from role where code=%s on conflict do nothing",
                (account, invitation[1], invitation[0]),
            )
            c.execute("delete from identity_invitation where account_id=%s", (account,))
        c.execute(
            "insert into security_event(actor_account_id,event_type,request_id,outcome,occurred_at,expires_at) values(%s,%s,%s,'OFFLINE_OPERATOR',now(),now()+interval '90 days')",
            (account, "PRIVILEGE_" + a.action.upper(), str(uuid.uuid4())),
        )
print(
    "Operator ceremony recorded. Existing sessions are revoked when privileges or factors change."
)
