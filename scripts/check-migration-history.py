#!/usr/bin/env python3
"""Keep accepted Flyway migrations byte-stable; permit new forward migrations."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
record = root / 'docs/engineering/evidence/p08/migrations-sha256.json'
accepted = json.loads(record.read_text())
for supplement in sorted((root / "docs/engineering/evidence").glob("p*/migrations-sha256.json")):
    for name, sha in json.loads(supplement.read_text()).items():
        assert name not in accepted or accepted[name] == sha, "Contradictory accepted migration hash"
        accepted[name] = sha
for name, expected in accepted.items():
    path = root / name
    if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
        raise SystemExit(f'Applied migration changed or missing: {name}. Add a forward migration instead.')
entry = json.loads((root / 'docs/engineering/evidence/p08/entry.json').read_text())
original = 'backend/src/main/resources/db/migration/V0001__spring_jdbc_sessions.sql'
assert accepted[original] == entry['inputs'][original], 'P07 baseline changed'
versions = [int(p.name.split('__')[0][1:]) for p in (root / 'backend/src/main/resources/db/migration').glob('V*__*.sql')]
assert len(versions) == len(set(versions)), 'Duplicate migration version'
print(f'PASS: {len(accepted)} accepted migrations unchanged; {len(versions)} migrations present')
