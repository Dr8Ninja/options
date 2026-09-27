# P09 — canonical import review

26–27 September 2026. P09 local exit gate passes. P10 requires a new user assignment; publication remains closed.

## Delivered boundary

The [operator workflow](../../../../data/README.md#p09-operator-import-workflow) consumes reviewed `data/v1`, preserving P03 database editorial authority. It implements a versioned, hash-checked package, strict duplicate-key/schema/path/size validation, stable-ID proposals, graph/reference/order checks, dry-run/diff, atomic typed PostgreSQL application, explicit retirement, three-way conflicts, immutable source provenance, restricted editorial export and guarded content-version recovery. No URLs are fetched and no import endpoint or generic CRUD controller is exposed. Separate random local importer credentials are unavailable to the web process; privileged or learner-reading connections are refused.

V0016–V0020 add import provenance/checkpoints, typed canonical numeric/rate values, partial-date precision, bounded deferred graph validation and checkpoint ownership keys. The actual schema has 107 base tables. V0001–V0015 remain byte-identical. See [DATABASE](../../DATABASE.md), [migration hashes](migrations-sha256.json) and [entry fingerprints](entry.json). The only change to a P07 preserved input is the explicitly requested append to `data/README.md`; its exact old prefix is retained in `data-readme-p08.txt` and verified against the original SHA-256. All other 84 preserved inputs remain exact.

## Executed checks

- `./backend/mvnw -f backend/pom.xml -B spotless:apply verify`: **35 tests**, zero failures/errors/skips, 3 minutes 04 seconds. This includes 25 persistence tests across empty/intermediate migrations and concurrent graph/ownership behavior, seven foundation tests, two unit/boundary tests and the canonical import integration bridge. [Suite results](backend-tests.json).
- The bridge drives **14 substantive checks** using PostgreSQL 18.6/Testcontainers and a restricted importer login: empty import, concurrent identical import, exact replay, every-field/relationship export, independent empty-schema restoration, malformed references/cycles/duplicates/versions/paths/readiness, duplicate JSON keys, actual database constraint rollback, safe update/conflict, retirement/recovery, addition/absent retention, preserved submitted attempts/answers/results/exposure/enrollment and denied private-record reads. [Integration results and baseline counts](integration.json); Python check duration 159.742 seconds. No H2 or skipped PostgreSQL gate.
- The first import reconciles 11,452 records/22 collections into 2,851 catalog objects and revisions, 5,100 catalog links, 6,402 source mappings, 10,550 mapping targets and 12,626 source records (canonical wrappers plus 1,174 original inventory snapshots). All 28 archive structures, seven capstones, seven specializations, 23 decision cards, 96 resources, 27 rules and 70 quiz blueprints round-trip. Blueprints do not become executable quizzes. No active publication, review decision or rule certification is created.
- Python hash-locked installation, Ruff format/lint and byte-compilation pass. Recursive P02–P06 contract checks, source preservation, all 20 migration checksums, dependency policy and implemented API subset pass. Frontend format/lint/types/generated API/tokens and all 12 component tests pass. No frontend source changed.

## Local rollout and security evidence

The documented backend rebuild upgraded the existing local volume from V0015 to V0020. `wait-ready.py` verified real database readiness, HTTPS ingress and rendered shell. The separate local importer dry-ran/applied the reviewed package, replayed batch 1 and exported all 11,452 records with every canonical field equal. Actual local counts and privilege checks are in [runtime evidence](local-runtime.json): 107 tables, ten restricted runtime connections at inspection, zero accounts/publications/reviews/certifications/attempts; importer cannot create schema objects or read private notes. The JAR includes V0020 and contains no test fixtures. Four desktop/mobile Playwright shell/security checks pass after upgrade.

Executed local commands (repository root, pinned runtimes on PATH):

```sh
docker compose -f infrastructure/compose.yml -f infrastructure/compose.full.yml up -d --build backend
python3 scripts/wait-ready.py
python3 scripts/provision-local-import.py
set -a
. .local/import.env
set +a
.venv/bin/python scripts/import-content.py validate --package .local/p09-bootstrap
.venv/bin/python scripts/import-content.py dry-run --package .local/p09-bootstrap
.venv/bin/python scripts/import-content.py apply --package .local/p09-bootstrap
.venv/bin/python scripts/import-content.py apply --package .local/p09-bootstrap
.venv/bin/python scripts/import-content.py export --output .local/p09-editorial-export --package-id local-editorial-export-001
npm --prefix frontend run check
npm --prefix frontend run test:e2e
```

The prepared package is the byte-preserved `data/v1` plus allowlisted archives, ID `canonical-design-bootstrap`. Reports and random credentials remain in ignored private local directories. PostgreSQL 18.6, Docker 29.6.2/Compose 5.3.1, Java 25.0.4.1+1, Node 24.21.0/npm 11.19.0 and Python 3.14.5 were used. Gitleaks 8.30.1 reports [no leaks](secret-scan.json); Trivy 0.74.0 reports zero HIGH/CRITICAL findings in the [resolved Java SBOM](java-dependencies.json) and [installed Python closure](operator-dependencies.json). One new generic-key finding was the verified V0020 SHA-256, suppressed only at its exact evidence line. CI now runs the Python dependency scan as well; hosted CI has not run.

## Findings and repairs

Initial full-import runs exposed canonical null labels, numeric/rate-pair rule values, month-only notice dates and repeated deferred graph scans. Null labels retain their archived null without an invalid SQL section; V0017/V0018 retain typed values/date precision without inventing dates. V0019 validates a transaction's final graph once using a private transaction marker under the existing advisory lock, rearming on subsequent mutations. The old stalled scratch query was canceled; final graph concurrency/cycle tests still pass. No constraints were disabled.

Fixture/codec repairs retained negative assertions for duplicate JSON, traversal, malformed references and actual SQL constraint failure. The documentation validator previously treated the new package envelope as a canonical API DTO; it now excludes that explicit envelope while checking all record DTOs. The archived README prefix uses `.txt` so its historical relative links are not interpreted as current evidence-directory links. Earlier failures are recorded here rather than counted as passes.

## Limits and handoff

The codec supports `1.0.0-design`; new archive/source formats need reviewed codec changes. Authoring-task conflicts reject rather than overwrite editor work. An `IMPORT_EXPORT` job intent is recorded, but no automatic worker is claimed: operators run the tested export command explicitly. Statement/lock timeouts are 30 seconds/one second; no automatic retry or whole-transaction deadline is implemented. Same-manifest replay is safe after a lost response.

Recovery restores prior draft heads/retirement states only when they still match the selected batch, retains new identities as retired, and leaves publications and learner transactions intact. This is not independent encrypted backup or deletion-ledger restoration (P21). Editorial exports contain protected source/reference material and must remain private. V0017 targets the supported empty-rule P08 state; a manually populated pre-import numeric-rule database requires the documented preflight intervention before migration, not an edited applied migration.

No lesson authoring, public catalog/learner/editor workflows, default admin account, production deployment, remote push, hosted CI run, real screen-reader journey or production recovery is claimed. P10 is the next eligible assignment only when the user requests it.
