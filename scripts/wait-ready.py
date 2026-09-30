#!/usr/bin/env python3
"""Wait for the local-only management probe and TLS ingress; fail after two minutes."""
import json, time, urllib.request, ssl
from pathlib import Path
root=Path(__file__).resolve().parents[1]
# Export the local proxy CA before running this probe; never disable its TLS verification.
ca=root/".local/caddy-root.crt"
if not ca.exists():raise SystemExit("Export the Caddy local root certificate to .local/caddy-root.crt first")
context=ssl.create_default_context(cafile=str(ca))
deadline=time.monotonic()+120
while time.monotonic()<deadline:
    try:
        with urllib.request.urlopen("http://127.0.0.1:8081/actuator/health/readiness",timeout=5) as r:
            assert json.load(r)=={"status":"UP"}
        with urllib.request.urlopen("https://localhost:8443/api/health",context=context,timeout=5) as r:
            assert json.load(r)=={"status":"UP"}
        with urllib.request.urlopen("https://localhost:8443/",context=context,timeout=5) as r:
            body=r.read()
            assert b"Understand the contract" in body or b"Learning content is temporarily unavailable" in body
        print("PASS: database readiness, HTTPS ingress and rendered shell")
        break
    except Exception:
        time.sleep(2)
else:
    raise SystemExit("Local stack did not become ready in 120 seconds")
