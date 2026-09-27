#!/usr/bin/env python3
"""P04 offline specification audit. Does not execute a database/importer/SQL."""
from copy import deepcopy
from pathlib import Path
import hashlib
import json
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
ENG = ROOT / "docs/engineering"
DB = ENG / "database"


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def table_rows(text):
    rows = {}
    active = False
    for line in text.splitlines():
        if line.startswith("| Table |"):
            active = True
            continue
        if not line.startswith("|"):
            active = False
        match = re.match(r"^\| ([a-z][a-z0-9_]+) \| (.+)$", line)
        if active and match:
            require(match[1] not in rows, f"Duplicate table dictionary: {match[1]}")
            rows[match[1]] = match[2]
    return rows


def audit_mapping(mapping, tables):
    actual_files = sorted((ROOT / "data/v1").glob("*.json"))
    actual_records = {str(p.relative_to(ROOT)): json.loads(p.read_text())
                      for p in actual_files if p.stem != "manifest"}
    entries = {x["file"]: x for x in mapping["collections"]}
    require(len(entries) == len(mapping["collections"]), "Repeated collection profile")
    require(set(entries) == set(actual_records), "Missing/extra collection profile")
    require(set(mapping["envelope_fields"]) == {"version", "as_of", "records"},
            "Envelope disposition missing")
    manifest = ROOT / "data/v1/manifest.json"
    require(digest(manifest.read_bytes()) == mapping["manifest_sha256"], "Manifest changed")
    require(set(json.loads(manifest.read_text())) == set(mapping["manifest_fields"]),
            "Manifest field disposition missing")
    all_ids, catalog_ids = set(), set()
    counts, fields = {}, 0
    for file, data in actual_records.items():
        entry = entries[file]
        require(set(data) == set(mapping["envelope_fields"]), f"Unknown envelope: {file}")
        require(data["version"] == mapping["canonical_version"], f"Version mismatch: {file}")
        require(digest((ROOT / file).read_bytes()) == entry["sha256"], f"Source changed: {file}")
        records = data["records"]
        require(len(records) == entry["records"], f"Record count mismatch: {file}")
        ids = [r["id"] for r in records]
        require(digest(json.dumps(ids, separators=(",", ":")).encode())
                == entry["ordered_ids_sha256"], f"Record ID coverage changed: {file}")
        require(len(ids) == len(set(ids)) and not all_ids.intersection(ids),
                f"Duplicate canonical stable ID: {file}")
        all_ids.update(ids)
        if entry["kind"]:
            catalog_ids.update(ids)
        actual_fields = {k for record in records for k in record}
        require(set(entry["fields"]) == actual_fields, f"Field coverage mismatch: {file}")
        for name, field in entry["fields"].items():
            require(field["destination"].strip(), f"Blank disposition: {file}/{name}")
            require(field["tables"] and set(field["tables"]) <= tables,
                    f"Unknown destination table: {file}/{name}")
        for record in records:
            if "study_hours" in record:
                lo, hi = record["study_hours"]
                require(0 <= lo <= hi, f"Invalid mapped hours: {record['id']}")
        counts[Path(file).stem] = len(records)
        fields += len(actual_fields)
    # Actual references must resolve to catalog objects, not to a mapping/task ID.
    for record in actual_records["data/v1/source_mappings.json"]["records"]:
        require(set(record["canonical_ids"]) <= catalog_ids,
                f"Noncatalog mapping target: {record['id']}")
    claims = json.loads((ROOT / "research/registers/claims.json").read_text())["records"]
    claim_ids = {x["id"] for x in claims}
    for record in actual_records["data/v1/associations.json"]["records"]:
        require(set(record["evidence_claim_ids"]) <= claim_ids, "Dangling assignment claim")
    nested_shapes = {
        ("modules", "prerequisites"): {"hard", "recommended", "optional"},
        ("competencies", "diagnostic"): {"prompt", "bridge", "pass"},
        ("competencies", "hard_edge_justifications"): {"requires", "supplied_skill", "consumed_by"},
        ("learning_paths", "branches"): {"module_id", "rule"},
        ("quiz_blueprints", "items"): {"kind", "question", "exercise_id", "weight"},
        ("source_mappings", "provenance"): {"source", "json_pointer", "master_source", "master_line", "line", "selector"},
    }
    for (collection, field), allowed in nested_shapes.items():
        for record in actual_records[f"data/v1/{collection}.json"]["records"]:
            value = record[field]
            for item in value if isinstance(value, list) else [value]:
                require(set(item) <= allowed, f"Unmapped nested shape: {collection}/{field}")
    topics = actual_records["data/v1/topics.json"]["records"]
    require(all(r["reviewed_lesson"] is None for r in topics), "Readiness baseline changed")
    rules = actual_records["data/v1/market_rules.json"]["records"]
    require(all(r["current_operational_publication_eligible"] is False for r in rules),
            "Rule exclusion baseline changed")
    return counts, fields, len(all_ids)


def main():
    required_files = [ENG / "DATABASE.md", *(DB / name for name in (
        "SCHEMA.md", "ERD.md", "LIFECYCLE.md", "QUERY_PLAN.md", "CANONICAL_MAPPING.md",
        "canonical-mapping.json")), ENG / "evidence/p04-review.md"]
    require(all(p.exists() and p.stat().st_size for p in required_files), "Missing design file")
    rows = table_rows((DB / "SCHEMA.md").read_text())
    require(len(rows) > 0, "No dictionary tables")
    fk_targets = set()
    for name, row in rows.items():
        for target in re.findall(r"→\s*([a-z][a-z0-9_]+)", row):
            require(target in rows, f"Undocumented FK target {name} -> {target}")
            fk_targets.add((name, target))
    erd = (DB / "ERD.md").read_text()
    require(erd.count("```mermaid") == 3, "Missing ERD views")
    erd_relations = re.findall(r"^\s+([a-z_]+)\s+[|o}{]+--[|o}{]+\s+([a-z_]+)\s*:", erd, re.M)
    for left, right in erd_relations:
        require(left in rows and right in rows, f"Unknown ERD entity: {left}/{right}")
    mapping = json.loads((DB / "canonical-mapping.json").read_text())
    counts, fields, total = audit_mapping(mapping, set(rows))
    review = (ENG / "evidence/p04-review.md").read_text()
    journeys = re.findall(r"^\| (J\d{2}) \|", review, re.M)
    require(len(journeys) == 17 and set(journeys) == {f"J{i:02}" for i in range(1, 18)},
            "P02 journey coverage missing")
    lifecycle = (DB / "LIFECYCLE.md").read_text()
    groups = re.findall(r"^\| (DB\d{2}) \|", lifecycle, re.M)
    require(groups == [f"DB{i:02}" for i in range(1, 9)], "Migration sequence missing")
    negative_checks = []
    for label in ("missing_collection", "missing_field", "unknown_table", "changed_id_coverage"):
        broken = deepcopy(mapping)
        if label == "missing_collection":
            broken["collections"].pop()
        elif label == "missing_field":
            broken["collections"][0]["fields"].pop("id")
        elif label == "unknown_table":
            broken["collections"][0]["fields"]["id"]["tables"] = ["unconstrained_blob"]
        else:
            broken["collections"][0]["ordered_ids_sha256"] = "0" * 64
        try:
            audit_mapping(broken, set(rows))
        except AssertionError:
            negative_checks.append(label)
        else:
            raise AssertionError(f"Negative design check accepted: {label}")
    # Use the existing validators; do not mutate canonical/research exports.
    upstream = subprocess.run([sys.executable, str(ROOT / "scripts/validate_architecture.py")],
                              cwd=ROOT, text=True, capture_output=True, check=True)
    architecture = json.loads(upstream.stdout)
    inventory = subprocess.run([sys.executable, str(ROOT / "scripts/inventory_sources.py"), "--check"],
                               cwd=ROOT, text=True, capture_output=True, check=True)
    require(architecture["result"] == "PASS", "P03 prerequisite failed")
    require(inventory.returncode == 0, "Inventory drift")
    entry = json.loads((ENG / "evidence/p03-entry-check.json").read_text())
    accepted = {artifact["path"]: artifact["sha256"] for artifact in entry["files"]}
    # Living specifications may advance through explicit, hash-chained stage decisions.
    # Keep the original entry record intact and reject undocumented drift.
    for record in sorted((ENG / "evidence").glob("p*/document-amendments.json")):
        for amendment in json.loads(record.read_text())["amendments"]:
            path = amendment["path"]
            require(path in accepted and accepted[path] == amendment["previous_sha256"],
                    f"Broken document amendment chain: {path}")
            require(amendment["reason"].strip() and
                    (ROOT / amendment["decision"].split("#")[0]).is_file(),
                    f"Missing document amendment decision: {path}")
            accepted[path] = amendment["sha256"]
    for path, expected in accepted.items():
        require(digest((ROOT / path).read_bytes()) == expected,
                f"P03 decision changed without recorded amendment: {path}")
    # P07: historical no-application scope is preserved in entry evidence.
    # Reusable contract checks now also run after authorized implementation.
    report = {
        "as_of": "2026-09-23", "result": "PASS",
        "scope": "Offline design/file/reference coverage; semantic review in p04-review.md. No PostgreSQL, importer, query execution or rendering tests.",
        "upstream_architecture_gate": architecture["result"], "inventory_check": "PASS",
        "canonical_collections": len(counts), "canonical_records": total,
        "canonical_top_level_fields_mapped": fields, "manifest_fields_mapped": 6,
        "counts": counts, "dictionary_tables": len(rows),
        "documented_fk_table_pairs_checked": len(fk_targets),
        "erd_views": 3, "erd_relationships_checked": len(erd_relations),
        "product_journeys_allocated": len(journeys), "migration_design_groups": groups,
        "negative_design_checks_rejected": negative_checks,
        "upstream_local_links_checked": architecture["local_file_links_checked"],
        "postgresql_tests_run": False, "application_import_run": False,
        "query_plans_measured": False, "mermaid_rendered": False,
        "flyway_migrations_created": False, "deployment_performed": False,
    }
    (ENG / "evidence/p04-validation.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
