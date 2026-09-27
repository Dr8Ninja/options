#!/usr/bin/env python3
"""Read public resource URLs once; reachability is NOT content verification.

Research utility only. No credentials, browser cookies, paywall bypass or data API.
Downloads are temporary and excluded from the distributable interchange files.
Use --input FILE for a list of {id,url}; --output for the metadata report.
"""
import argparse
import concurrent.futures
import datetime
import hashlib
import json
from pathlib import Path
import urllib.request
import urllib.error

ROOT = Path(__file__).resolve().parents[1]


def check(item):
    result = {"id": item["id"], "requested_url": item["url"],
              "checked_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
              "verification_scope": "transport_only_not_content_review"}
    try:
        request = urllib.request.Request(item["url"], headers={"User-Agent": "OptionsCurriculumResearch/1.0"})
        with urllib.request.urlopen(request, timeout=20) as response:
            raw = response.read(12_000_001)
            if len(raw) > 12_000_000:
                raise ValueError("research download limit exceeded")
            result.update(http_status=response.status, final_url=response.url,
                          content_type=response.headers.get("Content-Type"), bytes=len(raw),
                          sha256=hashlib.sha256(raw).hexdigest(), status="retrieved")
        suffix = ".pdf" if raw.startswith(b"%PDF") else ".html"
        cache = Path("/tmp/options-p01")
        cache.mkdir(exist_ok=True)
        (cache / (item["id"] + suffix)).write_bytes(raw)
    except (urllib.error.URLError, TimeoutError, ValueError, OSError) as error:
        result.update(status="unavailable", error=str(error))
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", default=str(ROOT / "research/inventory/resources.json"))
    parser.add_argument("--output", default=str(ROOT / "research/evidence/resource-access-p01.json"))
    args = parser.parse_args()
    items = json.loads(Path(args.input).read_text())
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        records = list(pool.map(check, items))
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n")
    for row in records:
        print(row["id"], row["status"], row.get("http_status", row.get("error")), row.get("bytes", ""))


if __name__ == "__main__":
    main()
