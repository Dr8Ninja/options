#!/usr/bin/env python3
"""Create a separate local operator login; never add importer credentials to web containers."""

from pathlib import Path
import os
import secrets
import subprocess

ROOT = Path(__file__).resolve().parents[1]
cfg = dict(
    line.split("=", 1)
    for line in (ROOT / "infrastructure/.env").read_text().splitlines()
    if line and not line.startswith("#")
)
if (
    cfg.get("POSTGRES_DB") != "options_local"
    or cfg.get("POSTGRES_USER") != "options_local"
):
    raise SystemExit("Only the documented local database is supported")
out = ROOT / ".local/import.env"
if out.exists():
    raise SystemExit(
        "Existing import.env retained; use it rather than rotating credentials silently"
    )
password = secrets.token_urlsafe(32)
statement = (
    """DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='options_import') THEN CREATE ROLE options_import LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION; END IF;
END $$;
ALTER ROLE options_import PASSWORD '"""
    + password
    + """';
GRANT otr_import TO options_import;
ALTER ROLE options_import SET timezone='UTC';
ALTER ROLE options_import SET statement_timeout='30s';
ALTER ROLE options_import SET lock_timeout='1s';
"""
)
command = [
    "docker",
    "compose",
    "-f",
    str(ROOT / "infrastructure/compose.yml"),
    "exec",
    "-T",
    "postgres",
    "psql",
    "-U",
    cfg["POSTGRES_USER"],
    "-d",
    cfg["POSTGRES_DB"],
    "-v",
    "ON_ERROR_STOP=1",
]
r = subprocess.run(command, input=statement, text=True, capture_output=True)
if r.returncode:
    raise SystemExit(
        "Import role provisioning failed; run migrations first. No credentials logged."
    )
fd = os.open(out, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, "w") as stream:
    stream.write(
        "CONTENT_IMPORT_DSN='host=127.0.0.1 port=55432 dbname=options_local user=options_import password="
        + password
        + "'\n"
    )
print("Created restricted options_import login and ignored .local/import.env (0600).")
