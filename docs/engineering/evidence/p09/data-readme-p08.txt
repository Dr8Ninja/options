# Canonical editorial interchange

`v1/` contains the P01 design snapshot, with schemas in `schemas/` and semantics in [FIELD_DEFINITIONS.md](FIELD_DEFINITIONS.md). This is not an application database decision. Original material remains in `sources/`; exact archival snapshots and mappings preserve content and relationships.

Rebuild after checking unchanged sources:

```sh
python3 scripts/inventory_sources.py --check
python3 scripts/build_canonical.py
python3 scripts/build_supplement.py
python3 scripts/build_research.py
python3 scripts/build_cases.py
python3 scripts/finalize_canonical.py
python3 scripts/validate_canonical.py --as-of 2026-09-22 --negative-tests
python3 scripts/check_research_examples.py
python3 scripts/audit_p01_package.py
```

Run from the repository root. `--write-schemas` is reserved for reviewed structural changes, not routine validation. External research access checks require network and are separate from this deterministic pipeline. Source drift must be investigated before rebuilding.

Distributable content here is project-authored design, bibliographic metadata, mappings and supplied-source archival records. It contains no downloaded paid books, exchange historical dataset or broker credentials. Project-wide licensing and permission to redistribute the supplied originals must still be decided before public distribution; inclusion in a local interchange directory is not a license grant. Third-party research caches were temporary outside this directory. See resource-specific rights and data-entitlement notes.
