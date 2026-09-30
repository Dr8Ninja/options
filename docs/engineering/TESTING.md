# Testing the P07 foundations

The prerequisite is [local setup](../operations/DEPLOYMENT.md). Run from the repository root. These checks establish foundations, not J01–J17 feature completion, lesson readiness or production release acceptance.

## Required checks

```sh
.venv/bin/python scripts/validate_frontend_design.py
python3 scripts/verify-preservation.py
npm --prefix frontend ci
python3 scripts/check-dependency-policy.py
./backend/mvnw -f backend/pom.xml -B verify
python3 scripts/check-implemented-api.py
npm --prefix frontend run check
npm --prefix frontend run build
```

The recursive P06 validator reruns P02–P05 contracts. P07 removed only historical “application directories must not exist” checks and scoped the P03 ADR count to its original six records. Source/reference/field/negative-case assertions remain. The immutable entry snapshot and source/research/canonical hashes are in `evidence/p07/`. Validators can update derived validation reports; they never certify application behavior by themselves.

`mvnw verify` runs Spotless, Maven version/JDK/dependency policy, compilation, JUnit configuration and ArchUnit boundary tests, JAR packaging/SBOM generation, and Failsafe `*IT` tests. Testcontainers starts digest-pinned **PostgreSQL 18.6**; absence of Docker is a failure, never a skip. H2 is banned. `mvnw test` is a narrower unit gate and must not be presented as PostgreSQL acceptance. Format Java with `mvnw -f backend/pom.xml spotless:apply`.

The PostgreSQL integration tests exercise V0001 on an empty DB, validate/reapply without changes, reject a changed checksum, prove transactional rollback of broken DDL in a separate disposable schema, persist CSRF session attributes, check Secure/HttpOnly/host-only cookies, reject cross-origin or tokenless writes, deny unknown routes, generate springdoc output, and distinguish liveness from readiness during a real DB pause/recovery. P08 appends domain migrations and constraint/ownership/upgrade cases described below; never edit applied migrations or turn on Flyway clean/baseline to hide drift. Canonical importer tests remain P09.

ArchUnit enforces the P03 module DAG and forbids web/flow code from depending directly on repositories. Only identity and shared operations have implementation today; `catalog`, `discovery`, `learning`, `assessment`, `administration` and `flow` are reserved package boundaries with no empty pretend services. New controllers need an explicit security matcher and negative authorization tests before they can serve any user. No blanket `/api/** permitAll` rule is allowed.

`npm run check` runs Prettier, ESLint, strict TypeScript, generated OpenAPI checksum/type drift, generated P06 token drift and Vitest/Testing Library tests. The schema is the complete **contract**, not an assertion that its operations exist. Client tests check typed CSRF integration, no-store/same-origin behavior, refusal of unsafe calls without tokens, safe errors, deliberate retry and theme state. SSR calls go to a fixed internal origin, are read-only, reject redirects and forward only the named session cookie for owner reads. Anonymous reads strip all caller identity.

## Browser and security framework compatibility

Start the full HTTPS stack as documented, then:

```sh
cd frontend
npx playwright install chromium
npm run test:e2e
cd ..
python3 scripts/test-webauthn.py
```

On Linux CI use `npx playwright install --with-deps chromium`. Standard browser tests run at desktop and mobile sizes against the actual production-build Next container, Spring and PostgreSQL via Caddy. They cover both themes, persisted appearance, keyboard skip access, horizontal overflow, axe accessibility checks, uncached HTML, health, a real JDBC CSRF pre-session and proxy denial of management/spec paths. Passing axe is not screen-reader or full WCAG acceptance; P18 owns real assistive-technology/full-journey checks.

The WebAuthn probe starts `WebAuthnFixture` from **test sources only**, on loopback HTTPS 18443 with management 18081 and a disposable Testcontainers DB. It generates a random test password and two-day certificate, then removes the certificate and stops the process/database. No test user is packaged into production. Its credential repository is in memory for the protocol probe, while session/challenge serialization uses real JDBC. P08 stores durable credential identity/counters and tests revocation; P13 must still implement the framework adapter, dual authenticator enrollment, recovery, absolute session lifetime and factor-recency journeys; this compatibility probe does not claim those features.

The probe uses Chromium's virtual authenticator for registration/assertion and negative verification/replay checks. It is not a physical-authenticator/platform matrix. Fixed test ports must be free. Environment values, tokens and test passwords are never committed. Its failure is a failed compatibility gate, not permission to allow a privileged endpoint with one factor.

## Dependency and secret checks

```sh
python3 scripts/install-security-tools.py
.local/tools/gitleaks/gitleaks dir --redact --config .gitleaks.toml .
npm --prefix frontend audit --audit-level=high
.local/tools/trivy/trivy sbom --severity HIGH,CRITICAL --exit-code 1 backend/target/classes/META-INF/sbom/application.cdx.json
```

Scanner downloads are checksum-pinned for macOS ARM64 and Linux x86-64. A failed feed/download is not a clean scan. All production and development npm dependencies are audited. Java's CycloneDX BOM records resolved dependencies, licenses and hashes. `.gitleaksignore` contains ten reviewed exact-line false positives: three documented idempotency UUIDs, five file digests and two preserved ISBN descriptions. Generated local environments, caches and builds are excluded; no live secret exception is allowed. New suppressions require inspection, explanation and review.

See [dependency policy](DEPENDENCIES.md) and [ADR-007](adr/007-foundation-compatibility.md) for the TypeScript/ESLint compatibility decisions and Tomcat security patch exception. Supported version labels are not substitutes for scanning and testing resolved artifacts.

## CI and evidence

`.github/workflows/ci.yml` runs the same gates on pushes to main and pull requests with **contents: read**, pinned action revisions and checkout credentials disabled. PR jobs consume no production secrets, deploy nothing and use only ephemeral generated test credentials. Reports have seven-day retention. Dependabot opens reviewed update proposals; no automatic merge/deploy is configured. A hosted run is not claimed until a remote exists and the workflow actually executes.

JUnit/Failsafe reports and the SBOM are under `backend/target/`; browser reports/screenshots are under `frontend/playwright-report/` and `frontend/test-results/`; the isolated probe uses `frontend/test-results-webauthn/`. Build outputs and private `.local/` logs are ignored. The committed [P07 review](evidence/p07/REVIEW.md) records commands, actual results, initial failures and their resolution. Do not copy raw request bodies, cookies, fixture credentials or full application logs into public evidence.


## P08 persistence gates

`mvnw verify` now also runs `PersistenceIT`: empty PostgreSQL migration, V0001 session preservation, seeded upgrades from every intermediate version, real role privileges, all-FK index coverage, stable routes/ordering, sealed aggregate hashes and immutability, Argon2id/JPA optimistic updates, owner-safe notes, retirement, erasure, receipts, graph/publication/import races, pinned denominators, assessment membership/grading/exposure, finite rule certifications, remediation transfer and project self-review. Tests use isolated synthetic records only. A failed negative case must have a constraint/privilege SQLSTATE or the intended domain conflict, not an unrelated SQL syntax failure.

The immutable [migration checksum manifest](evidence/p08/migrations-sha256.json) is checked by `python3 scripts/check-migration-history.py`; append new versions rather than editing accepted files. `backend/target/p08-evidence/schema-audit.json` contains actual constraints/indexes without learner values. P08 appends no endpoint; rerun `scripts/check-implemented-api.py` and the existing HTTPS/CSRF browser tests after the local upgrade.

The separate [query-plan experiment](DATABASE.md#p08-migration-commands) loads the P04 planning-scale private tables with all PostgreSQL constraints/triggers enabled. Its synthetic public bodies and canonical identity-only inventory are not a P09 import. Real canonical body/relationship round-trip and public mixed-filter query shapes are tested when the importer/APIs exist; P20 still owns concurrent request latency and cold-cache capacity. The [P08 evidence](evidence/p08/REVIEW.md) records exact scale, timings, limits and failures.


## P09 canonical interchange

Install `scripts/requirements-content-import.txt` into `.venv` with `--require-hashes` before Maven verification. CI selects the installed runner Python through `CONTENT_IMPORT_PYTHON`; a missing driver/interpreter is a failed test, never a skip. `CanonicalImportIT` starts digest-pinned PostgreSQL, runs Flyway in two initially empty schemas, creates a separate restricted importer login and invokes the real operator package code. Temporary data mutations, files, accounts and assessment fixtures remain outside application resources.

The suite compares every canonical record after relational export, restores it into the second empty schema, checks same-manifest idempotence, and rejects malformed packages and genuine PostgreSQL constraint failures atomically. It exercises three-version updates/conflicts, additions/absence/retirement and guarded content recovery, with snapshots of private notes, progress and submitted assessment state. Existing graph-concurrency tests still run after the once-per-transaction graph optimization. The negative driver requires the expected validation code or integrity SQLSTATE; a Python or SQL syntax failure cannot pass as a rejected input.

Format/lint checks: `.venv/bin/ruff format --check scripts/content_import scripts/import-content.py scripts/test-content-import.py scripts/provision-local-import.py` and `.venv/bin/ruff check --select E4,E7,E9,F` on those same paths. Compile the scripts with `python -m compileall -q`. Reports are under `backend/target/p09-evidence`; never copy raw credential environments or learner contents into review artifacts.


P09 dependency scanning also runs `pip freeze` from the installed isolated environment into `.local/operator-scan/requirements.txt`, then `.local/tools/trivy/trivy fs --scanners vuln --severity HIGH,CRITICAL --exit-code 1 .local/operator-scan`. This includes transitive Python dependencies and Ruff; a failed vulnerability feed is a failure. [P09 final evidence](evidence/p09/REVIEW.md) records the 35 backend tests, 14 importer scenarios, local canonical replay/export and four browser checks.


## P10 public API gate

`PublicCatalogIT` uses the real P09 package/importer, PostgreSQL 18.6 and the actual HTTP/security stack. It imports all 2,851 canonical objects, adds adversarial test-only protected content and synthetic approval records, activates a complete MAP manifest, and captures responses. No fixture is packaged in the application or published in the persistent local database.

The suite covers every public endpoint, exact filter intersections, facets, all collection sort/keyset variants, cursor authentication/expiry/generation changes, bounded search paging, exact-ID/title ranking, malformed/unknown input, draft and protected relationship exclusion, stale rule metadata, no answer-key fields/text, method/HEAD behavior, draft versus approved renames, withdrawal and retirement. Actual responses undergo OpenAPI schema/format validation. `pg_stat_statements` compares query round trips at limit 1 versus 50; representative search/filter EXPLAIN ANALYZE plans and measured request/activation timings are saved under `backend/target/p10-evidence`.

Run `python scripts/check-public-api.py` and `python scripts/check-implemented-api.py` after Maven verification. CI runs both. Public DTOs regenerate with `python scripts/generate-public-dtos.py` followed by Maven formatting; frontend types regenerate with `npm --prefix frontend run generate:api`. Input parsing uses Bean Validation bounds plus explicit scalar/array/filter/sort allowlists, independently tested through HTTP. Read [P10 evidence](evidence/p10/REVIEW.md) for actual results and limits; these are local correctness/scale checks, not P20 concurrent-load acceptance.

## P11 public learning gate

After backend verification and a production frontend build, run:

```sh
.venv/bin/python scripts/test-public-learning.py
```

The runner requires the configured Java/Node runtimes, Docker, Python import dependencies, OpenSSL and installed Playwright Chromium. It starts disposable PostgreSQL, runs the real canonical importer, starts Spring on 18082 and the production frontend on 3101 behind test HTTPS on 18444. Synthetic publication approval and one renderer specimen are test-classpath-only. No persistent local content is published. Temporary TLS keys are removed on exit.

Five browser cases cover keyboard home-to-topic navigation, deep canonical redirects, server HTML/metadata/math/tables, sanitized adversarial content, mobile/dark/no-JavaScript reading, actual withdrawal and actual backend shutdown. Axe checks run on representative rendered pages. Current P11 rerun screenshots go to `.local/p11-runtime/reading-screenshots` (copy reviewed captures into the current stage’s evidence; preserve historical P11 captures); the JSON result is in `frontend/test-results/p11-results.json`. The test controls use an ignored local file, never production HTTP mutation hooks. Component/adapter tests additionally verify safe links, renderer limits and generation coherence; they supplement rather than replace the real stack.

## P12 discovery gate

After the production frontend build and isolated backend verification, run `.venv/bin/python scripts/test-public-learning.py --stage p12`. This reuses the real P09-imported disposable PostgreSQL/Spring/production-Next fixture; it is not mocked. Six journeys exercise filtered resource-to-topic reading, URL/back/reload state, pages and stale generations, empty/malformed input, never-published sentinel exclusion, path-to-module and project prerequisites, mobile/keyboard/axe/no-JavaScript rendering, and actual API shutdown. JSON evidence is `frontend/test-results/p12-results.json`; screenshots are in `docs/engineering/evidence/p12/screenshots`. Run P11 separately to retain its withdrawal checks. Do not run concurrent Maven compilations or Playwright jobs against the same output directories.
