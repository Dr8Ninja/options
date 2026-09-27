#!/usr/bin/env python3
"""Export only the public local CA, waiting for first-start certificate generation."""
import subprocess,time
from pathlib import Path
root=Path(__file__).resolve().parents[1]
target=root/".local/caddy-root.crt";target.parent.mkdir(exist_ok=True)
command=["docker","compose","-f","infrastructure/compose.yml","-f","infrastructure/compose.full.yml","exec","-T","proxy","cat","/data/caddy/pki/authorities/local/root.crt"]
for attempt in range(30):
    try:
        result=subprocess.run(command,cwd=root,text=True,capture_output=True,timeout=3)
        if result.returncode==0 and result.stdout.startswith("-----BEGIN CERTIFICATE-----"):
            target.write_text(result.stdout);print("Exported public local CA to .local/caddy-root.crt");break
    except subprocess.TimeoutExpired:pass
    time.sleep(1)
else:raise SystemExit("Proxy did not provide its local CA; inspect Compose status/logs")
