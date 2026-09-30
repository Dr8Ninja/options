#!/usr/bin/env python3
"""P11 real PostgreSQL import + Spring + production Next + HTTPS browser gate."""

import argparse
import os
import signal
import ssl
import subprocess
import time
import urllib.request
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--stage", choices=["p11", "p12"], default="p11")
stage = parser.parse_args().stage

ROOT = Path(__file__).resolve().parents[1]
runtime = ROOT / ".local/p11-runtime"
runtime.mkdir(exist_ok=True)
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
        "PUBLIC_ORIGIN": "https://localhost:18444",
        "API_INTERNAL_ORIGIN": "http://127.0.0.1:18082",
        "SERVER_PORT": "18082",
        "MANAGEMENT_SERVER_PORT": "18083",
        "P11_CONTROL_FILE": str(control),
        "P11_RUNTIME": str(runtime),
        "NEXT_TELEMETRY_DISABLED": "1",
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
            "-Dspring-boot.run.main-class=org.options.platform.PublicLearningFixture",
        ],
        ROOT,
        "backend",
    )
    deadline = time.monotonic() + 150
    while not Path(str(control) + ".ready").exists():
        if api.poll() is not None or time.monotonic() > deadline:
            raise RuntimeError(
                "Fixture import/start failed; see .local/p11-runtime/backend.log"
            )
        time.sleep(1)
    start(
        ["npm", "run", "start", "--", "--port", "3101"], ROOT / "frontend", "frontend"
    )
    start(["node", str(ROOT / "scripts/p11-proxy.mjs")], ROOT, "proxy")
    deadline = time.monotonic() + 45
    while True:
        try:
            with urllib.request.urlopen(
                "https://localhost:18444/",
                context=ssl._create_unverified_context(),
                timeout=10,
            ) as response:
                if (
                    response.status == 200
                    and b"Explore the curriculum" in response.read()
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
            "playwright.discovery.config.ts"
            if stage == "p12"
            else "playwright.learning.config.ts",
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
    for name in ["key.pem", "cert.pem"]:
        (runtime / name).unlink(missing_ok=True)
