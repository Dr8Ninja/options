#!/usr/bin/env python3
"""Provision a local runtime login without exposing or replacing existing DB credentials."""
from pathlib import Path
import os, secrets, subprocess
ROOT=Path(__file__).resolve().parents[1]
compose=ROOT/'infrastructure/.env'
backend=ROOT/'.local/backend.env'
def read(path):
    return dict(line.split('=',1) for line in path.read_text().splitlines() if line and not line.startswith('#'))
cfg=read(compose)
if cfg.get('POSTGRES_DB')!='options_local' or cfg.get('POSTGRES_USER')!='options_local':
    raise SystemExit('This helper is restricted to the documented local database')
password=cfg.get('DB_RUNTIME_PASSWORD') or secrets.token_urlsafe(32)
# Values go over stdin to a local container, never command arguments/logs.
if any(ch not in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-' for ch in password):
    raise SystemExit('Unexpected local generated password encoding')
sql="""DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='otr_runtime') THEN CREATE ROLE otr_runtime NOLOGIN; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='otr_import') THEN CREATE ROLE otr_import NOLOGIN; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='otr_privacy') THEN CREATE ROLE otr_privacy NOLOGIN; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='options_runtime') THEN CREATE ROLE options_runtime LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION; END IF;
END $$;
ALTER ROLE options_runtime PASSWORD '"""+password+"""';
GRANT otr_runtime TO options_runtime;
ALTER ROLE options_runtime SET timezone='UTC';
ALTER ROLE options_runtime SET statement_timeout='5s';
ALTER ROLE options_runtime SET lock_timeout='1s';
"""
command=['docker','compose','-f',str(ROOT/'infrastructure/compose.yml'),'exec','-T','postgres','psql','-U',cfg['POSTGRES_USER'],'-d',cfg['POSTGRES_DB'],'-v','ON_ERROR_STOP=1']
result=subprocess.run(command,input=sql,text=True,capture_output=True)
if result.returncode:
    raise SystemExit('Local role provisioning failed; confirm the PostgreSQL service is ready. Credentials were not logged.')
if 'DB_RUNTIME_PASSWORD' not in cfg:
    with compose.open('a') as stream:stream.write('DB_RUNTIME_PASSWORD='+password+'\n')
    compose.chmod(0o600)
env=read(backend)
env.update({'DB_USER':'options_runtime','DB_PASSWORD':password,'MIGRATION_DB_USER':cfg['POSTGRES_USER'],'MIGRATION_DB_PASSWORD':cfg['POSTGRES_PASSWORD']})
temporary=backend.with_suffix('.pending')
fd=os.open(temporary,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
with os.fdopen(fd,'w') as stream:stream.write(''.join(k+'='+v+'\n' for k,v in env.items()))
os.replace(temporary,backend)
print('Provisioned local runtime login and separate migration credentials (0600); no secrets printed.')
