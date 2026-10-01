# Options Trading Learning Platform

P01 research and curriculum design is complete as a bounded design snapshot, with publication exclusions recorded. The original 67 modules and 1,019 topics are preserved; canonical learning designs, seven paths, twelve projects, resource records and deterministic validation are available. **No fully authored reviewed lessons or production deployment are claimed.** P07 provides secured application foundations; P08 adds tested PostgreSQL persistence; P09 imports the complete canonical design as unpublished drafts. P10 adds public catalog/search APIs that serve only approved publication snapshots.

Start with the [curriculum](docs/curriculum/CURRICULUM.md), [research findings](docs/research/RESEARCH.md) and [reconciliation/exit gate](docs/research/RECONCILIATION.md). The [module index](docs/curriculum/MODULE_INDEX.md) opens all 70 design dossiers, including three bridges. [Resources](docs/curriculum/RESOURCES.md) records verification scope and access limitations.

[P02's product requirements](docs/product/PRODUCT_REQUIREMENTS.md), [content release plan](docs/product/CONTENT_RELEASE_PLAN.md) and [traceability matrix](docs/product/REQUIREMENTS_TRACEABILITY.md) now define R1: a 36-topic foundation course, six assessment gates, a manual cash-flow dossier and the complete labeled curriculum map. The documents specify future behavior; no lessons or application features have been implemented by P02.

[P03's architecture](docs/engineering/ARCHITECTURE.md), [initial security design](docs/engineering/SECURITY.md) and six linked decision records select Java 25/Spring Boot 4.1, PostgreSQL 18/Flyway, Next.js 16, Spring sessions and a single editorial authority. The hosting topology is a costed reference, not a purchased or deployed service. P07 now verifies baseline runtime integration; capacity and release readiness remain untested.

[P04's relational design](docs/engineering/DATABASE.md) now specifies the schema/ERD, canonical mapping, content/import lifecycle, ownership, versioned assessments and query/migration investigation plan. The offline design gate passes. P08 implements the domain schema with Flyway, PostgreSQL constraints and tested ownership/retention repositories. See the [P08 review](docs/engineering/evidence/p08/REVIEW.md).

[P05's API contract](docs/engineering/API.md), [OpenAPI](docs/engineering/openapi/openapi.json), [authorization matrix](docs/engineering/api/AUTHORIZATION_MATRIX.md), examples and contract-test plan now define all 17 journeys. The offline contract gate passes. P07 implements and tests the CSRF foundation and infrastructure health; P10 implements public content/search; identity, learner/editor workflows and scoring await later stages.

[P06’s frontend design contract](docs/engineering/FRONTEND.md), [responsive prototype and review guide](design/README.md), tokens, component/state specifications and accessibility checklist now cover all 17 journeys. Light/dark design checks pass. P11 implements the public reading slice; broader product journeys and full assistive-technology acceptance remain later work.

[P09’s operator workflow](data/README.md#p09-operator-import-workflow) provides validated packages, dry-run/diffs, version-aware imports, restricted editorial exports and content-version recovery. Real PostgreSQL tests verify all 11,452 records, replay, conflict rejection and preserved learner history; see the [P09 review](docs/engineering/evidence/p09/REVIEW.md). P11 now provides live server-rendered public reading pages. Without an approved publication the local browser shows an honest unavailable state.

[P11 implementation and validation](docs/engineering/evidence/p11/REVIEW.md) covers home → curriculum → phase → module → topic, safe authored rendering and public SEO. Its renderer lesson is synthetic test-only content; persistent local imports remain drafts.

[P12 discovery and validation](docs/engineering/evidence/p12/REVIEW.md) adds the live resource library, intersecting URL filters, global search, shared-module paths and project preparation/detail pages. Resource review scope, access limits and planned assessment gates remain explicit. Public next links follow authored order; personalization and ratings remain deferred.

[PROMPTS.md](PROMPTS.md) remains the shared execution guide. **P07 provides application foundations**, including PostgreSQL-backed sessions, a secured API boundary and an honest preparation shell. P08 implements the domain schema, and P17 later authors/reviews lesson batches. Public catalog/search APIs, reading and discovery interfaces are implemented. Learner, assessment execution and editorial HTTP features remain later work. All seven full canonical paths require later authoring; completing R1 will not imply completing those paths.

| Location | Purpose |
|---|---|
| sources/ | Byte-preserved originals, archived prompts and hashes |
| research/inventory/ | Checked source extraction |
| research/evidence/ and registers/ | Source, claim, search, coverage, gap and case records |
| research/design/ | Authored design inputs for reproducible exports |
| docs/curriculum/ | Curriculum, individual module dossiers, tracks, paths and practice |
| docs/research/ | Research method, reconciliation and three canonical reviews |
| docs/product/ | Product scope, exact initial content slice, acceptance criteria, traceability and gate evidence |
| docs/engineering/ | Architecture, security, seven decision records, relational/lifecycle design and dated evidence |
| data/v1/ and schemas/ | Versioned editorial interchange, archival mappings and structural schemas |
| design/ | P06 standalone responsive prototype, tokens, route/journey mappings, specifications and review evidence |
| scripts/ | Contract/data validation, local setup and foundation verification utilities |
| backend/ | Java 25 / Spring Boot 4.1 modular monolith, security, domain/session migrations and real PostgreSQL tests |
| frontend/ | Next 16 / React shell, P06 tokens, typed API boundary and component/browser tests |
| infrastructure/ | Digest-pinned local PostgreSQL, mail sink, Caddy HTTPS and application containers |
| .github/ | Least-privilege CI and reviewed dependency update proposals |

Run `python3 scripts/inventory_sources.py --check` and `python3 scripts/validate_canonical.py --as-of 2026-09-22 --negative-tests` from this directory. The complete deterministic rebuild sequence and field meanings are in [data/README.md](data/README.md). These checks validate the curriculum records; they do not certify live market rules or unimplemented projects.

[Project status](docs/project/TODO.md) · [Decisions](docs/project/DECISIONS.md) · [Execution log](docs/project/EXECUTION_LOG.md) · [Original inventory](docs/research/INVENTORY.md)

Validate the P02 document contract with `python3 scripts/validate_product_contract.py`. This checks requirement/source coverage, canonical lesson references, prerequisite order, links and reference arithmetic; it does not run application acceptance tests.

Validate the P03 design package with `python3 scripts/validate_architecture.py`. This checks upstream integrity, requirement allocation, decision/threat IDs, dependency directions, local links and cost arithmetic; it does not compile or test the future application.

Validate P04 with `python3 scripts/validate_database_design.py`. It checks the P03/inventory gates, all 22 canonical collections and 245 fields, dictionary/ERD references, 17 journey allocations and deliberately corrupted mapping rejection. P08 tests domain migrations and repositories on PostgreSQL and records measured query plans. P09 proves canonical import and content-version recovery; independent operational backup/restore remains P21.

Validate P05 in an isolated Python environment with `pip install -r scripts/requirements-api-contract.txt` then `python scripts/validate_api_contract.py`. It checks OpenAPI, DTO examples, authorization/CSRF inventory, canonical example fields and deliberate contract-corruption rejection; P07 separately checks its implemented API subset and security foundation.

Validate P06 with `python scripts/validate_frontend_design.py` in the P05 validation environment. Reproduce browser checks using [design/README.md](design/README.md); the design validator checks the hashes of tested prototype files. This does not run real account, scoring, publishing or screen-reader tests.

## P07 local application foundations

The application renders responsive light/dark reading and discovery pages from approved public snapshots. It exposes health, session-backed CSRF and P10 public read endpoints. With no approved publication, catalog reads return 503. All unimplemented API routes are denied, even for an authenticated staff principal. There are no default accounts or production credentials. Reviewed lessons, learning progress, authentication journeys and editorial tools remain later-stage work.

Use Temurin JDK 25.0.4.1+1 (the runtime image remains pinned to 25.0.4+7), Node 26.10.0/npm 11.19.1 and running Docker/Compose. From a fresh checkout:

```sh
python3 -m venv .venv
.venv/bin/pip install -r scripts/requirements-api-contract.txt
.venv/bin/pip install --require-hashes -r scripts/requirements-content-import.txt
python3 scripts/dev-env.py
docker compose -f infrastructure/compose.yml up -d --wait postgres mailpit
python3 scripts/provision-local-db.py
cp frontend/.env.example frontend/.env.local
npm --prefix frontend ci
./backend/mvnw -f backend/pom.xml -B verify
npm --prefix frontend run check
npm --prefix frontend run build
docker compose -f infrastructure/compose.yml -f infrastructure/compose.full.yml up -d --build
python3 scripts/export-local-ca.py
python3 scripts/wait-ready.py
```

The browser origin is `https://localhost:8443`; ordinary browsers need deliberate trust of the local CA. See [complete setup/shutdown and troubleshooting](docs/operations/DEPLOYMENT.md), [testing and CI](docs/engineering/TESTING.md), [dependency policy](docs/engineering/DEPENDENCIES.md), [compatibility amendments](docs/engineering/adr/007-foundation-compatibility.md) and [P07 verification evidence](docs/engineering/evidence/p07/REVIEW.md). Run `docker compose -f infrastructure/compose.yml -f infrastructure/compose.full.yml down` to stop the stack while keeping local volumes.

The Maven Wrapper and npm lockfile pin reproducible builds; CI checks contracts, preservation, format/lint/types, Java/PostgreSQL tests, frontend tests/build, generated DTOs/tokens, secrets/dependencies and real HTTPS browser behavior. The isolated WebAuthn probe uses the test classpath only. No hosted CI run or deployment is claimed in this local repository.

## P08 persistence

Flyway V0001–V0015 creates 100 domain tables, two framework session tables and its history table. The actual schema, differences from P04, constraints, ownership, immutable assessment/publication versions, retirement and erasure boundaries are in [DATABASE.md](docs/engineering/DATABASE.md). The local runtime uses a restricted database login, with a separate migration owner. Production must apply migrations separately before starting the restricted application.

Run `python3 scripts/check-migration-history.py` and the backend verification command above. The real PostgreSQL suite covers empty migration, retained V0001 sessions and upgrades from every intermediate version, foreign keys, concurrency, private ownership and retention. [P08 evidence](docs/engineering/evidence/p08/REVIEW.md) records the executed checks and scale experiment. Test fixtures are confined to disposable databases. P09 adds V0016–V0020 (107 total tables) and imports canonical drafts locally through the separate operator workflow; there are no seeded accounts or published lessons. At the end of P09, the shell and public API surface were unchanged; P10 adds the public read surface described below.


## P10 public catalog and search

Public program/phase/module/topic/subtopic hierarchy, prerequisites/competencies, resource assignments/library, paths, project/capstone/exercise/quiz descriptions, route resolution, facets and search now read approved PostgreSQL snapshots. Filters are intersected exactly; collection cursors are signed and bounded; full-text search has deterministic relevance and bounded paging. Drafts, protected answers and learner/admin data remain excluded, and every dynamic response is no-store.

Run backend `verify`, `python scripts/check-implemented-api.py`, `python scripts/check-public-api.py`, and `npm --prefix frontend run check` using the pinned runtimes above. [API contract](docs/engineering/API.md), [actual P10 evidence](docs/engineering/evidence/p10/REVIEW.md) and generated frontend contracts describe the boundary. The persistent local canonical catalog is still unpublished; its 503 bootstrap response is intentional. Disposable integration fixtures demonstrate populated API behavior without publishing drafts. P11 is a separate UI assignment after this gate; P17 still owns authored/reviewed lesson release.
