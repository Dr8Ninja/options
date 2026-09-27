#!/usr/bin/env python3
"""Real browser/framework compatibility probe with disposable PostgreSQL and a test-only app."""
import os,secrets,signal,ssl,subprocess,time,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
local=ROOT/".local";local.mkdir(exist_ok=True)
env=os.environ.copy();password=secrets.token_urlsafe(32)
for key in ["DB_URL","DB_USER","DB_PASSWORD","MIGRATION_DB_URL","MIGRATION_DB_USER","MIGRATION_DB_PASSWORD","MIGRATIONS_ENABLED"]:
    env.pop(key,None)
env.update({"FIXTURE_PASSWORD":password,"SERVER_SSL_KEY_STORE_PASSWORD":password,"SERVER_SSL_KEY_STORE":str(local/"fixture.p12"),"SERVER_SSL_KEY_STORE_TYPE":"PKCS12","SERVER_PORT":"18443","MANAGEMENT_SERVER_PORT":"18081","APP_ENVIRONMENT":"TEST","PUBLIC_ORIGIN":"https://localhost:18443"})
keytool=str(Path(env["JAVA_HOME"])/"bin/keytool")
cert=local/"fixture.p12"
if cert.exists():cert.unlink()
subprocess.run([keytool,"-genkeypair","-alias","fixture","-keyalg","RSA","-storetype","PKCS12","-keystore",str(cert),"-storepass:env","SERVER_SSL_KEY_STORE_PASSWORD","-dname","CN=localhost","-ext","SAN=dns:localhost","-validity","2"],env=env,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
with (local/"webauthn-fixture.log").open("w") as log:
    process=subprocess.Popen([str(ROOT/"backend/mvnw"),"-f",str(ROOT/"backend/pom.xml"),"-B","spring-boot:test-run","-Dspring-boot.run.main-class=org.options.platform.identity.security.WebAuthnFixture"],cwd=ROOT,env=env,stdout=log,stderr=log,start_new_session=True)
    try:
        deadline=time.monotonic()+120
        while time.monotonic()<deadline:
            if process.poll() is not None:raise RuntimeError("Fixture startup failed; see .local/webauthn-fixture.log")
            try:
                with urllib.request.urlopen("https://localhost:18443/fixture",context=ssl._create_unverified_context(),timeout=2) as response:
                    if response.status==200:break
            except Exception:time.sleep(1)
        else:raise RuntimeError("Fixture readiness timed out")
        result=subprocess.run(["npx","playwright","test","--config","playwright.webauthn.config.ts"],cwd=ROOT/"frontend",env=env)
        if result.returncode:raise SystemExit(result.returncode)
    finally:
        os.killpg(process.pid,signal.SIGTERM)
        try:process.wait(timeout=15)
        except subprocess.TimeoutExpired:os.killpg(process.pid,signal.SIGKILL);process.wait()
        cert.unlink(missing_ok=True)
