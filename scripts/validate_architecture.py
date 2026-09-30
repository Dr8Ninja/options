#!/usr/bin/env python3
"""Offline P03 document/reference/decision audit, not application tests."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import sys
from decimal import Decimal
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
ENG = ROOT / "docs/engineering"


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    # An entry claim is insufficient when current source/product integrity drifts.
    upstream = subprocess.run(
        [sys.executable, str(ROOT / "scripts/validate_product_contract.py")],
        cwd=ROOT, text=True, capture_output=True, check=True,
    )
    p02 = json.loads(upstream.stdout)
    require(p02["result"] == "PASS", "P02 entry gate failed")
    entry = json.loads((ENG / "evidence/p02-entry-check.json").read_text())
    amendments = {}
    for record in sorted((ENG / "evidence").glob("p*/product-document-amendments.json")):
        for amendment in json.loads(record.read_text())["amendments"]:
            path = amendment["path"]
            prior = amendments.get(path, next((x["sha256"] for x in entry["files"] if x["path"] == path), None))
            require(prior == amendment["previous_sha256"], f"Broken product amendment chain: {path}")
            body = (ROOT / path).read_bytes()
            require(hashlib.sha256(body[:amendment["preserved_prefix_bytes"]]).hexdigest() == prior,
                    f"Product amendment modified its historical prefix: {path}")
            require(amendment["reason"].strip() and (ROOT / amendment["decision"].split("#")[0]).is_file(),
                    f"Missing product amendment decision: {path}")
            amendments[path] = amendment["sha256"]
    for item in entry["files"]:
        checked_path = item.get("snapshot_path", item["path"])
        actual = hashlib.sha256((ROOT / checked_path).read_bytes()).hexdigest()
        require(actual == amendments.get(item["path"], item["sha256"]), f"Upstream artifact changed: {item['path']}")
        if item.get("verification_mode") == "generated_report_semantics_except_link_count":
            snapshot = json.loads((ROOT / checked_path).read_text())
            require({k: v for k, v in snapshot.items() if k != "local_links_checked"}
                    == {k: v for k, v in p02.items() if k != "local_links_checked"},
                    "P02 semantics drifted beyond the expected navigation link count")

    arch = (ENG / "ARCHITECTURE.md").read_text()
    rows = re.findall(r"^\| (REQ-\d{2}) \| ([^\n]+)$", arch, re.M)
    require(len(rows) == 40, "Expected exactly 40 allocation rows")
    require({x[0] for x in rows} == {f"REQ-{i:02}" for i in range(1, 41)},
            "Missing or repeated P02 allocation")
    for req, rest in rows:
        require(re.search(r"P\d{2}", rest), f"Missing verification owner: {req}")
    require(arch.count("```mermaid") == 5, "Missing context/container/request diagrams")

    adrs = sorted(p for p in (ENG / "adr").glob("*.md") if p.name[:3] in {f"{n:03}" for n in range(1, 7)})
    require(len(adrs) == 6, "Expected six decision records")
    for num, path in enumerate(adrs, 1):
        txt = path.read_text()
        require(txt.startswith(f"# ADR-{num:03}"), f"ADR identity mismatch: {path}")
        require("Accepted" in txt and "2026" in txt, f"Missing decision status/date: {path}")
        require(re.search(r"alternatives|Alternatives|Rejected|rejected", txt),
                f"Missing alternative disposition: {path}")

    sec = (ENG / "SECURITY.md").read_text()
    threats = re.findall(r"^\| (T\d{2}) ", sec, re.M)
    require(len(threats) == 17 and len(set(threats)) == 17, "Threat register IDs incomplete")

    # Design-only package directions, including the composition services that
    # prevent assessment/progress or privacy ownership from creating cycles.
    edges = {
        "OPS": [], "CAT": ["OPS"], "DSC": ["CAT"], "IDN": ["OPS"],
        "ASMT": ["CAT", "IDN", "OPS"],
        "LRN": ["CAT", "IDN", "ASMT", "OPS"],
        "ADM": ["CAT", "IDN", "ASMT", "LRN", "OPS"],
        "FLOW": ["CAT", "IDN", "ASMT", "LRN", "OPS"],
    }
    for component in edges:
        require(f"| {component} — " in arch, f"Undocumented component {component}")
    ordered, visiting = [], set()

    def visit(node):
        require(node not in visiting, f"Design dependency cycle at {node}")
        if node in ordered:
            return
        visiting.add(node)
        for target in edges[node]:
            require(target in edges, f"Unknown component {target}")
            visit(target)
        visiting.remove(node)
        ordered.append(node)

    for node in edges:
        visit(node)

    # Check actual file targets, without interpreting example layout paths as files.
    checked = 0
    for path in [*ENG.rglob("*.md"), ROOT / "README.md",
                 ROOT / "docs/project/TODO.md", ROOT / "docs/project/DECISIONS.md"]:
        body = re.sub(r"```.*?```", "", path.read_text(), flags=re.S)
        for target in re.findall(r"\]\(([^)]+)\)", body):
            target = target.strip().strip("<>")
            if target.startswith(("https://", "http://", "mailto:", "#")):
                continue
            local = unquote(target.split("#", 1)[0])
            require((path.parent / local).resolve().exists(),
                    f"Missing link in {path.relative_to(ROOT)}: {target}")
            checked += 1

    evidence = json.loads((ENG / "evidence/source-retrievals.json").read_text())
    require(evidence["as_of"] == "2026-09-23", "Unexpected source snapshot date")
    require(len({x["url"] for x in evidence["sources"]}) == len(evidence["sources"]),
            "Duplicate source retrievals")
    for source in evidence["sources"]:
        require(source["url"].startswith("https://"), "Non-HTTPS source reference")
        if source["status"] == 200:
            require(len(source["sha256"]) == 64 and source["bytes"] > 0,
                    "Incomplete source fingerprint")
    versions = (ENG / "adr/001-supported-platform.md").read_text()
    for source in evidence["sources"]:
        if "publisher_metadata" in source:
            require(source["publisher_metadata"]["version"] in versions,
                    f"Observed package version omitted: {source['url']}")

    # Independent Decimal arithmetic, not a claim about eventual invoices.
    base = sum(map(Decimal, ["25", "7", "25", "25", "40", "6", "1", "5"]))
    cost100 = base + (Decimal(100) - 25) * Decimal("0.15")
    cost250 = base + (Decimal(250) - 25) * Decimal("0.15")
    vm = Decimal(24) + Decimal("30.45") + 30 * Decimal("0.215") + 5
    require(cost100 == Decimal("145.25") and cost250 == Decimal("167.75"),
            "Reference hosting arithmetic mismatch")
    require(vm == Decimal("65.90"), "Alternative hosting arithmetic mismatch")
    require((ENG / "adr/006-hosting-topology.md").read_text().count("$145.25") == 1,
            "Missing reference subtotal")
    # P07: historical no-application scope is preserved in entry evidence.
    # Reusable contract checks now also run after authorized implementation.

    report = {
        "as_of": "2026-09-23", "result": "PASS",
        "scope": "P02/source integrity, document IDs and local file links, explicit design dependency DAG, primary-source retrieval metadata, observed package version inclusion and cost arithmetic. Semantic design review is separate; no application/runtime/security/load tests.",
        "upstream_product_gate": p02["result"], "requirements_allocated": len(rows),
        "adrs": len(adrs), "mermaid_diagrams_present": 5,
        "diagram_rendering_tested": False, "threats": len(threats),
        "component_dependency_order": ordered, "component_dependencies": edges,
        "local_file_links_checked": checked, "source_retrievals": len(evidence["sources"]),
        "reference_infrastructure_usd_month": str(cost100),
        "reference_high_egress_usd_month": str(cost250),
        "alternative_vm_db_storage_usd_month": f"{vm:.2f}",
        "application_tests_run": False, "deployment_performed": False,
    }
    (ENG / "evidence/p03-validation.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
