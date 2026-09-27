#!/usr/bin/env python3
"""Verify immutable inputs and local Markdown links without network access."""
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


def main():
    manifest = json.loads((ROOT / "sources/manifest.json").read_text())
    inputs = []
    failures = []
    for record in manifest["files"]:
        payload = (ROOT / record["path"]).read_bytes()
        digest = hashlib.sha256(payload).hexdigest()
        valid = digest == record["sha256"] and len(payload) == record["bytes"]
        inputs.append({"path": record["path"], "bytes": len(payload),
                       "sha256": digest, "matches_manifest": valid})
        if not valid:
            failures.append({"source": record["path"], "problem": "source drift"})

    documents = [ROOT / "README.md"]
    for folder in ("docs", "data", "research"):
        documents.extend((ROOT / folder).rglob("*.md"))
    checked = 0
    for document in sorted(set(documents)):
        # Code examples are not document navigation.
        content = re.sub(r"```.*?```|`[^`]*`", "", document.read_text(), flags=re.S)
        for match in re.finditer(r"\[[^\]\n]*\]\(([^)\n]+)\)", content):
            target = match.group(1).strip()
            if target.startswith("<"):
                target = target[1:target.index(">")]
            else:
                target = re.split(r'\s+[\"\']', target, maxsplit=1)[0]
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            path = re.sub(r":\d+$", "", unquote(parsed.path))
            checked += 1
            resolved = (document.parent / path).resolve()
            if not resolved.exists():
                failures.append({"document": str(document.relative_to(ROOT)),
                                 "target": target, "problem": "missing local link target"})

    result = {"result": "PASS" if not failures else "FAIL",
              "scope": "All five source-manifest hashes and byte counts; local Markdown link targets. External links and heading anchors are outside this offline check.",
              "sources": inputs, "markdown_documents": len(set(documents)),
              "local_links_checked": checked, "failures": failures}
    (ROOT / "research/final-audit-p01.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))
    raise SystemExit(bool(failures))


if __name__ == "__main__":
    main()
