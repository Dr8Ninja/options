# Phase 1 validation record

Run date: 21 September 2026. Scope: research inventory and documentation only. No application or application test suite exists yet.

## Source and artifact checks

`python3 scripts/inventory_sources.py --check` passed. It checks:

- Duplicate JSON object keys and duplicate module/topic/resource IDs.
- Known fields and classification-code expansion.
- Every module's domain, title, category, stage, prerequisites, source anchors and advanced extension against the knowledge map.
- Every topic's title, tags and entire subtopic scope sentence against the knowledge map.
- All resource fields, resource ordering and reverse module associations.
- All 67 exercise/mastery pairs and all 17 stage records.
- Equality of shared roadmap/map sections after link normalization.
- No unexplained prose between knowledge-map topic/module records.
- Assessment coverage, prerequisite references, acyclicity and stage membership.
- Exact equality between regenerated content and the seven committed-to-workspace inventory artifacts.

The supplied graph's 186 edges satisfy the declared stage/module order. No duplicate resource URL or unused resource record was found. Original source hashes remained unchanged.

## Negative checks

Temporary copies were used; originals were not edited. The audit rejected each of the following:

| Deliberate fault | Result |
|---|---|
| Changed topic scope in the JSON without changing the Markdown | Rejected |
| Resource reference to R999 | Rejected |
| Duplicate module ID | Rejected |
| Changed generated stages artifact | Rejected |

These checks exercise content drift and reference failures rather than counting generated rows alone.

## Documentation and research ledger

Local Markdown file targets in the authored documentation and module index exist. The 29 research observation IDs are unique; their original resource IDs and module/topic references resolve. The research ledger parses as JSON. The source inventory reports 46 resource-type strings, matching the written inventory.

## Limits

These results establish source consistency and inventory integrity. They do not verify all external resource claims, assess learning effectiveness, reproduce pricing results or establish production readiness. The remaining research and engineering validation are tracked in [TODO.md](../../project/TODO.md).
