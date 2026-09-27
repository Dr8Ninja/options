#!/usr/bin/env python3
"""Fail on any changed/missing source, research or canonical input from P07 entry."""
import hashlib,json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/"docs/engineering/evidence/p07/preserved-sha256.json").read_text())
for name,expected in manifest.items():
    path=root/name
    if name=='data/README.md':
        # P09 explicitly requires appending import instructions to this living document.
        prior=root/'docs/engineering/evidence/p09/data-readme-p08.txt'
        assert hashlib.sha256(prior.read_bytes()).hexdigest()==expected, name
        assert path.read_bytes().startswith(prior.read_bytes()), name
    else:
        assert path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest()==expected, name
print(f"PASS: {len(manifest)} preserved inputs (84 files plus the retained data/README.md prefix)")
