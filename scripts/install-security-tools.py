#!/usr/bin/env python3
"""Download checksum-pinned scanners into ignored .local/tools; no system installation."""
import hashlib, json, platform, tarfile, urllib.request
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
pins = json.loads((ROOT / "infrastructure/security-tools.json").read_text())
system, arch = platform.system(), platform.machine()
if (system, arch) not in [("Darwin", "arm64"), ("Linux", "x86_64")]:
    raise SystemExit("Use reviewed scanner binaries for this platform; no unverified fallback")
suffixes = ("darwin_arm64.tar.gz", "macOS-ARM64.tar.gz") if system == "Darwin" else ("linux_x64.tar.gz", "Linux-64bit.tar.gz")
for name, pin in pins.items():
    if not name.endswith(suffixes):
        continue
    target = ROOT / ".local/tools" / name.split("_")[0]
    target.mkdir(parents=True, exist_ok=True)
    archive = target / name
    with urllib.request.urlopen(pin["url"], timeout=60) as response:
        raw = response.read()
    if hashlib.sha256(raw).hexdigest() != pin["sha256"]:
        raise SystemExit("Scanner checksum mismatch")
    archive.write_bytes(raw)
    with tarfile.open(archive) as files:
        files.extractall(target, filter="data")
    archive.unlink()
    print("Installed verified", name)
