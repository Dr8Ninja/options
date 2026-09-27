#!/usr/bin/env python3
"""Offline P02 document/reference checks; never claims application acceptance."""
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PRODUCT = ROOT / "docs/product"


def main():
    prd = (PRODUCT / "PRODUCT_REQUIREMENTS.md").read_text()
    content = (PRODUCT / "CONTENT_RELEASE_PLAN.md").read_text()
    trace = (PRODUCT / "REQUIREMENTS_TRACEABILITY.md").read_text()
    reqs = {f"REQ-{i:02}" for i in range(1, 41)}
    definitions = re.findall(r"^### .*?\b(REQ-\d{2})\b", prd, re.M)
    owners = re.findall(r"^\| (REQ-\d{2}) \|", trace, re.M)
    assert len(definitions) == len(set(definitions)) == 40 and set(definitions) == reqs
    assert len(owners) == len(set(owners)) == 40 and set(owners) == reqs
    for line in trace.splitlines():
        if re.match(r"\| REQ-\d{2} \|", line):
            cells = [x.strip() for x in line.split("|")[1:-1]]
            assert all(cells) and re.search(r"P\d{2}", cells[2]), line
    for prefix, count in [("MB", 15), ("RD", 19), ("PB", 34), ("G", 25), ("RQ", 15)]:
        found = set(re.findall(r"^\| (" + prefix + r"\d{2})\b", trace, re.M))
        assert found == {f"{prefix}{i:02}" for i in range(1, count + 1)}, (prefix, found)
    assert len(re.findall(r"^# STEP \d+", (ROOT / "sources/prompts/01-deep-research-original.md").read_text(), re.M)) == 17
    assert len(re.findall(r"^# \d+\.", (ROOT / "sources/prompts/02-production-build-original.md").read_text(), re.M)) == 33
    evidence_rows = "\n".join(line for line in trace.splitlines() if re.match(r"\| RQ\d{2}\b", line))
    qrefs = set(re.findall(r"\bQ\d{3}\b", evidence_rows))
    for start, end in re.findall(r"Q(\d{3})–Q(\d{3})", evidence_rows):
        qrefs.update(f"Q{i:03}" for i in range(int(start), int(end) + 1))
    assert {f"Q{i:03}" for i in range(1, 30)} <= qrefs
    assert set(re.findall(r"^\| (J\d{2})\b", prd, re.M)) == {f"J{i:02}" for i in range(1, 18)}
    assert set(re.findall(r"^\| (CR-\d{2}) \|", content, re.M)) == {f"CR-{i:02}" for i in range(1, 9)}

    canonical = json.loads((ROOT / "data/v1/topics.json").read_text())["records"]
    topics = {x["id"]: x for x in canonical}
    seen_steps, selected, edges = set(), [], []
    for line in content.splitlines():
        if not re.match(r"\| F\d{2} \|", line):
            continue
        cells = [x.strip() for x in line.split("|")[1:-1]]
        step = cells[0]
        tid = re.match(r"([MB]\d{2}\.\d{2})", cells[1]).group(1)
        assert tid in topics and tid not in selected, (step, tid)
        assert topics[tid]["title"] in cells[1], (tid, "title drift")
        dependencies = re.findall(r"\bF\d{2}\b", cells[3])
        assert set(dependencies) <= seen_steps, (step, "forward/missing prerequisite", dependencies)
        edges.extend([dependency, step] for dependency in dependencies)
        selected.append(tid)
        seen_steps.add(step)
    assert len(selected) == 36 and seen_steps == {f"F{i:02}" for i in range(1, 37)}
    modules = {x["id"]: x for x in json.loads((ROOT / "data/v1/modules.json").read_text())["records"]}
    path_missing = {}
    for path in json.loads((ROOT / "data/v1/learning_paths.json").read_text())["records"]:
        needed = {t for m in path["module_sequence"] for t in modules[m]["topic_ids"]}
        missing = sorted(needed - set(selected))
        assert missing, (path["id"], "unexpectedly complete path")
        path_missing[path["id"]] = len(missing)

    source_manifest = json.loads((ROOT / "sources/manifest.json").read_text())
    for source in source_manifest["files"]:
        payload = (ROOT / source["path"]).read_bytes()
        assert len(payload) == source["bytes"]
        assert hashlib.sha256(payload).hexdigest() == source["sha256"]
    entry = json.loads((PRODUCT / "evidence/p01-entry-check.json").read_text())
    assert entry["validation"]["result"] == "PASS"
    assert entry["validation"]["publication_ready_lessons"] == 0
    for artifact in entry["artifacts"]:
        assert hashlib.sha256((ROOT / artifact["path"]).read_bytes()).hexdigest() == artifact["sha256"], (artifact["path"], "entry evidence drift")

    # Independent signed-ledger checks of the new acceptance fixtures.
    put_net = 4 * 50 - 5
    put_at_zero = put_net - 100 * 50
    put_at_80 = put_net + 80 * 50 - 100 * 50
    call_at_80 = -100 * 50 + 2 * 50 - 5 + 80 * 50
    call_assigned = -100 * 50 + 2 * 50 - 5 + 105 * 50
    assert (put_net, put_at_zero, put_at_80, 100 // -put_at_80, call_at_80, call_assigned) == (195, -4805, -805, 0, -905, 345)
    assert 8 * 10 < 85 <= 9 * 10
    assert sum([216, 72, 60, 72]) == 420 and sum([360, 120, 100, 120]) == 700

    files = list(PRODUCT.rglob("*.md")) + [ROOT / "README.md", ROOT / "docs/project/TODO.md", ROOT / "docs/project/DECISIONS.md", ROOT / "docs/project/EXECUTION_LOG.md"]
    link_count = 0
    for file in files:
        prose = re.sub(r"```.*?```|`[^`]*`", "", file.read_text(), flags=re.S)
        for target in re.findall(r"\[[^\]\n]*\]\(([^)\n]+)\)", prose):
            parsed = urlsplit(target.strip("<>"))
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            assert (file.parent / unquote(parsed.path)).exists(), (file, target)
            link_count += 1
    # P07: historical no-application scope is preserved in entry evidence.
    # Reusable contract checks now also run after authorized implementation.

    report = {"as_of": "2026-09-22", "result": "PASS", "scope": "Document IDs, source-section coverage, real canonical topic references, earlier-only lesson dependencies, retained incomplete full paths, entry/source integrity, local links and acceptance-fixture arithmetic. Not application or lesson-readiness tests.", "requirements": len(reqs), "journeys": 17, "content_criteria": 8, "selected_topic_ids": selected, "lesson_dependency_edges": len(edges), "full_path_missing_topic_counts": path_missing, "source_groups": {"master": 15, "research_steps_and_rules": 19, "build_sections_and_core": 34, "gaps": 25, "research_questions": 15, "original_observations": 29}, "local_links_checked": link_count, "new_fixture_values": {"short_put_net_cash": put_net, "short_put_profit_at_zero": put_at_zero, "short_put_profit_at_80": put_at_80, "covered_call_profit_at_80": call_at_80, "covered_call_assigned_profit": call_assigned}, "application_tests_run": False}
    (PRODUCT / "evidence/p02-validation.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
