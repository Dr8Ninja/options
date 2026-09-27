#!/usr/bin/env python3
"""Generate isolated development credentials once; never overwrite an existing environment."""
from pathlib import Path
import secrets
ROOT = Path(__file__).resolve().parents[1]
compose = ROOT / "infrastructure/.env"
backend = ROOT / ".local/backend.env"
if compose.exists() or backend.exists():
    raise SystemExit("Local environment already exists; refusing to replace credentials.")
password = secrets.token_urlsafe(32)
runtime_password = secrets.token_urlsafe(32)
backend.parent.mkdir(exist_ok=True)
for path, content in [(compose, f"POSTGRES_DB=options_local\nPOSTGRES_USER=options_local\nPOSTGRES_PASSWORD={password}\nDB_RUNTIME_PASSWORD={runtime_password}\n"), (backend, f"APP_ENVIRONMENT=LOCAL\nSPRING_PROFILES_ACTIVE=local\nPUBLIC_ORIGIN=https://localhost:8443\nDB_URL=jdbc:postgresql://127.0.0.1:55432/options_local\nDB_USER=options_runtime\nDB_PASSWORD={runtime_password}\nMIGRATION_DB_USER=options_local\nMIGRATION_DB_PASSWORD={password}\n")]:
    with path.open("x") as stream:
        path.chmod(0o600)
        stream.write(content)
print("Created infrastructure/.env and .local/backend.env (0600). No credentials printed.")
