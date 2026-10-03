#!/usr/bin/env python3
"""P13 disposable PostgreSQL + mail sink + real authentication browser gate."""

import os
import signal
import ssl
import sys
import subprocess
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
runtime = ROOT / ".local/p13-runtime"
runtime.mkdir(exist_ok=True)
(runtime / "ready.json").unlink(missing_ok=True)
control = runtime / "control"
for suffix in ["", ".ready", ".ack"]:
    Path(str(control) + suffix).unlink(missing_ok=True)
env = os.environ.copy()
for name in [
    "DB_URL",
    "DB_USER",
    "DB_PASSWORD",
    "MIGRATION_DB_URL",
    "MIGRATION_DB_USER",
    "MIGRATION_DB_PASSWORD",
    "MIGRATIONS_ENABLED",
]:
    env.pop(name, None)
env.update(
    {
        "APP_ENVIRONMENT": "TEST",
        "PUBLIC_ORIGIN": "https://localhost:18445",
        "API_INTERNAL_ORIGIN": "http://127.0.0.1:18084",
        "SERVER_PORT": "18084",
        "MANAGEMENT_SERVER_PORT": "18085",
        "P13_CONTROL_FILE": str(control),
        "P13_RUNTIME": str(runtime),
        "NEXT_TELEMETRY_DISABLED": "1",
        "IDENTITY_OPERATOR_PYTHON": sys.executable,
    }
)
subprocess.run(
    [
        "openssl",
        "req",
        "-x509",
        "-newkey",
        "rsa:2048",
        "-nodes",
        "-keyout",
        str(runtime / "key.pem"),
        "-out",
        str(runtime / "cert.pem"),
        "-days",
        "2",
        "-subj",
        "/CN=localhost",
    ],
    check=True,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)
processes = []
logs = []


def start(command, cwd, name):
    log = (runtime / f"{name}.log").open("w")
    logs.append(log)
    child = subprocess.Popen(
        command, cwd=cwd, env=env, stdout=log, stderr=log, start_new_session=True
    )
    processes.append(child)
    return child


try:
    api = start(
        [
            str(ROOT / "backend/mvnw"),
            "-f",
            str(ROOT / "backend/pom.xml"),
            "-B",
            "spring-boot:test-run",
            "-Dspring-boot.run.main-class=org.options.platform.IdentityFixture",
        ],
        ROOT,
        "backend",
    )
    deadline = time.monotonic() + 150
    while not (runtime / "ready.json").exists():
        if api.poll() is not None or time.monotonic() > deadline:
            raise RuntimeError(
                "Fixture import/start failed; see .local/p13-runtime/backend.log"
            )
        time.sleep(1)
    start(
        ["npm", "run", "start", "--", "--port", "3102"], ROOT / "frontend", "frontend"
    )
    start(["node", str(ROOT / "scripts/p13-proxy.mjs")], ROOT, "proxy")
    deadline = time.monotonic() + 45
    while True:
        try:
            with urllib.request.urlopen(
                "https://localhost:18445/",
                context=ssl._create_unverified_context(),
                timeout=10,
            ) as response:
                if (
                    response.status == 200
                    and b"Learning content is temporarily unavailable"
                    in response.read()
                ):
                    break
        except Exception:
            pass
        if time.monotonic() > deadline:
            raise RuntimeError("Production frontend readiness failed")
        time.sleep(1)
    subprocess.run(
        [
            "npx",
            "playwright",
            "test",
            "--config",
            "playwright.identity.config.ts",
        ],
        cwd=ROOT / "frontend",
        env=env,
        check=True,
    )
finally:
    for child in reversed(processes):
        if child.poll() is None:
            os.killpg(child.pid, signal.SIGTERM)
            try:
                child.wait(timeout=15)
            except subprocess.TimeoutExpired:
                os.killpg(child.pid, signal.SIGKILL)
                child.wait()
    for log in logs:
        log.close()
    for name in ["key.pem", "cert.pem", "ready.json"]:
        (runtime / name).unlink(missing_ok=True)
