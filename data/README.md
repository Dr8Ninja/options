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

## P09 operator import workflow

The P03 authority rule remains: after bootstrap, PostgreSQL draft revisions are authoritative. This command proposes changes from the reviewed exports; it does not synchronize folders, import the original incomplete catalog as current lessons, fetch resource URLs or publish anything. The operator CLI is deliberately outside the web process. Spring continues to deny unimplemented import endpoints.

Use the Java/PostgreSQL setup in [DEPLOYMENT](../docs/operations/DEPLOYMENT.md), apply migrations, then install the isolated operator dependencies and provision its separate local login:

```sh
.venv/bin/pip install --require-hashes -r scripts/requirements-content-import.txt
python3 scripts/provision-local-import.py
set -a
. .local/import.env
set +a
.venv/bin/python scripts/import-content.py prepare \
  --source data/v1 --output .local/imports/bootstrap --package-id canonical-design-bootstrap
.venv/bin/python scripts/import-content.py validate --package .local/imports/bootstrap
.venv/bin/python scripts/import-content.py dry-run --package .local/imports/bootstrap \
  --report .local/import-reports/bootstrap-preview.json
.venv/bin/python scripts/import-content.py apply --package .local/imports/bootstrap \
  --report .local/import-reports/bootstrap-applied.json
```

The generated 0600 environment contains a random **local-only** credential for `options_import`; never add it to the backend/frontend container environment, a PR job or a production deployment. Provisioning refuses to overwrite an existing environment. Production operators must receive a separately provisioned login with only `otr_import` and verified PostgreSQL TLS. The CLI refuses elevated/schema-owning or learner-reading credentials. No credential can be supplied by a package.

A package is a directory with `package.json`, the 22 canonical collections and their manifest, plus the allowlisted original/inventory/claim artifacts. [The package schema](schemas/import-package.schema.json) fixes `otr-import-v1`, package identity, file SHA-256, explicit bases, retirements and expected publication generation. Paths are exact, relative and bounded; symlinked package members, traversal, unknown files/fields/versions, duplicate JSON keys, malformed references, duplicate relationships, cycles, invalid ordering and unsafe executable markup are rejected. Total input is limited to 100 MiB, a record to 1 MiB and reports to 2 MiB. Resource links are metadata only. Original supplied-file hashes must match the preserved archive.

`validate` runs offline and creates no database rows. `dry-run` reads current heads in a read-only transaction and reports additions, updates, unchanged/keep-current, explicit retirements, absent IDs and conflicts. `apply` repeats comparisons under the graph/import locks and commits all typed bodies, links, provenance, proposals and draft-head changes together. Any database constraint failure rolls everything back. Source files are stored privately by hash under `.local/content-archive`; a failed transaction can leave unreferenced immutable archive files, but no partial content. Reports contain IDs, hashes, field names and bounded codes, never learner values or database credentials.

### Updates, conflicts and absence

Export the current database state before making an update:

```sh
.venv/bin/python scripts/import-content.py export \
  --output .local/imports/editorial-export --package-id editorial-export-001
```

This **restricted editorial** package contains protected reference material and original-source archives; it is not a public-download bundle. It contains no account, session, note, progress or attempt records. The exporter reconstructs operational bodies and relationships from typed tables, preserving source-only shape/provenance from immutable archives. It validates the complete result and renames a private staging directory atomically; interrupted output is not presented as a completed package.

Copy the export to a new private proposal directory, edit the intended canonical fields, choose a **new package ID**, and recompute SHA-256 for each changed file in `package.json`. Preserve the `bases` and expected generation. Run validation and dry-run again. A package ID cannot identify different bytes. Bootstrap uses empty bases; all existing objects require an exact known base revision/hash. Comparing base B, current C and proposal P: P=B keeps C; C=P is unchanged; C=B permits an update; otherwise the entire application is rejected as a conflict. Resolve deliberately by exporting C, reviewing/merging the intended change, and making a new proposal based on C. There is no force/last-writer-wins switch.

An absent record is preserved, never implicitly deleted or retired. To retire a known object, include its unchanged body and exact base and list its ID in `retirements`. Combining a body edit with retirement is rejected; make separately reviewable proposals. Routes, historical revisions, verification history and learner references remain. Authoring-task differences currently reject explicitly as `AUTHORING_TASK_CONFLICT`; the importer never overwrites a task that an editor has changed. Make those task edits through the later editorial workflow. Source mappings and archives append editions rather than erase previous provenance. Exact same-manifest replay returns the original applied batch without adding any relationships or resetting learner state.

### Content-version recovery

Each applying transaction records the previous draft head and retirement state before switching it. Revisions and source archives are immutable, so recovery does not require reverting learner transactions:

```sh
.venv/bin/python scripts/import-content.py recover --batch 2
.venv/bin/python scripts/import-content.py recover --batch 2 --confirm-recovery
```

Use the actual batch ID from the report; the first command is a preview. Recovery requires current heads and retirement states to still match that batch's result. An intervening editor/import change rejects recovery. Existing objects regain their previous draft heads/state; newly added objects are retired while their identity/history remains. Recovery is audited and leaves publication and all learner rows untouched. It is **not** a publication rollback or a full operational backup/restore plan. The original import remains historical APPLIED, and replay does not undo subsequent recovery. Independent encrypted backup/deletion-ledger restoration remains P21.

To bootstrap an independently empty database from an editorial export, use `prepare --source <export>/data/v1` with a new package ID and empty bases. The currently supported `1.0.0-design` codec retains the reviewed archive/claim files from this repository; a new source/archive version needs a reviewed codec/package change. Do not clear bases to bypass conflicts on an existing database.

### Validation and evidence

`./backend/mvnw -f backend/pom.xml -B verify` runs the canonical-import integration driver against disposable PostgreSQL under Testcontainers. Install both documented Python requirement files first; CI uses `CONTENT_IMPORT_PYTHON=python`, while local tests default to `.venv/bin/python`. Synthetic mutations and learner records exist only inside temporary test directories/databases. The application JAR contains no importer fixtures or seeded accounts. Machine reports are written to `backend/target/p09-evidence`; final evidence and limitations are recorded in the P09 engineering review.


P09 records an `IMPORT_EXPORT` job intent after apply; no automatic export worker is implemented. Run `export` explicitly and retain its private output. PostgreSQL remains authoritative even if export fails. A statement is limited to 30 seconds and lock waits to one second; retry transient failures deliberately with the same manifest. There is no automatic retry or whole-transaction deadline. Final gate evidence: [P09 review](../docs/engineering/evidence/p09/REVIEW.md).
