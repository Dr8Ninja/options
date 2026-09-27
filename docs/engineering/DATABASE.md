# Relational database and content lifecycle — P04

Design version 1, 23 September 2026. **P04 design implemented by P08 on PostgreSQL 18.6.** See [actual implementation and schema differences](database/IMPLEMENTATION.md), [migration commands](#p08-migration-commands) and [P08 evidence](evidence/p08/REVIEW.md). P03's architecture validator and its P02 prerequisite passed on entry. The canonical snapshot remains `1.0.0-design`, with zero reviewed lessons. This design implements the [product contract](../product/PRODUCT_REQUIREMENTS.md) and [P03 decisions](ARCHITECTURE.md); it does not expand R1 into ratings, trading, hosted code or formal project grading.

Read together:

- [Schema/data dictionary](database/SCHEMA.md): tables, columns, foreign keys, checks and ownership.
- [ERD](database/ERD.md): identity, catalog/publication and learning relationships.
- [Lifecycle/import contract](database/LIFECYCLE.md): transactions, publication, retries, privacy and migration sequence.
- [Query/index investigation plan](database/QUERY_PLAN.md): representative SQL and measurements required in P08/P20.
- [Canonical mapping](database/CANONICAL_MAPPING.md) and [field mapping register](database/canonical-mapping.json): every export collection and field has a destination or explicit archival treatment.
- [Design review and gate](evidence/p04-review.md), [validation](evidence/p04-validation.json).

## Identity, revisions and publication

Use internal `bigint GENERATED ALWAYS AS IDENTITY` keys for persistent entities, with separate immutable public/canonical external IDs. Preserve M01, M01.01, R01, C01, etc. verbatim. Newly authored content uses a registered kind prefix plus UUID; it never renumbers existing IDs. Account/attempt/export public IDs are random UUIDs, not sequential database IDs. UUID opacity is not authorization. Slugs are presentation addresses: each route permanently reserves its normalized path and resolves through an FK to a stable object. Renaming never changes bookmarks, notes or scores.

`catalog_object` is a **real supertype**, not a `(table_name, arbitrary_id)` reference. Its closed `kind` identifies supported content. `catalog_revision` holds immutable common metadata and authored text; typed detail tables hold type-specific searchable/operational attributes. Every typed child carries a checked constant kind and a composite FK back to `(revision_id, kind)`. Every revision has exactly the detail required by its kind, enforced by a deferred completeness trigger at sealing. Tables for relationships have real FKs and checked endpoint kinds. All objects/revisions are retained after ordinary retirement; learner references use RESTRICT, never cascade from content.

One global `publication` manifest selects **one revision per object** across programs. A singleton `active_publication` pointer advances atomically. `publication_entry` has a composite FK tying revision and object, so it cannot pair M21 with M22's revision. Every referenced target required for rendering/eligibility must exist in that manifest, checked transactionally before activation. Multi-step reads use a single manifest ID and repeatable snapshot; a final live withdrawal check overrides it. A rollback creates a new publication event selecting a previously approved manifest and does not restore private learner state or revoked rules.

Revisions are assembled and sealed in a single transaction. After sealing, their scalar fields, detail rows and links cannot be updated/deleted by runtime code. Editing copies the changed aggregate to a new revision; unchanged targets reuse their object identities and selected revisions. A mutable draft head and review/workflow records sit outside the immutable body. Content readiness (scope/brief/reviewed lesson), editorial workflow (draft/review/approved), public visibility (map/lesson/protected) and effective rule eligibility are separate states. A learning-design status never implies a published lesson.

## Hierarchy and reuse

R1 has programs → phases → modules → topics → independently addressable subtopics. **No chapter rows/table are needed now.** A later chapter requirement adds a reviewed kind and membership rule by migration; do not insert empty placeholders. Domains and tags are taxonomies, not hierarchy levels.

`catalog_link` is a bounded, typed join for named curriculum relationships, with a migration-owned relation/endpoint allowlist. It contains no arbitrary property/value pairs. Parent revision → child stable object preserves ordered membership without cloning content. Program-phase, phase-module, module-topic and topic-subtopic relations are explicit allowed pairs; nothing else can masquerade as containment. Within a manifest, a phase belongs to one program and a module has at most one placement in each program. A module may be reused by different programs with different sequence positions. Its topic definitions are shared. A topic reused intentionally in another module requires a revisit annotation; accidental duplicates in the same parent are rejected. Learner lesson evidence is keyed by object/revision, so reuse does not require rereading identical material merely to increment another path counter.

A path is a curated view, not a duplicate program. Seven canonical paths contain ordered module references and explicit branch/gate/exit links. R1-FND is a separately identified course/path whose exact 36-topic selection and 99 earlier-only hard edges are imported from the P02 release specification. The course contains six executable gates and the R1 dossier once authored. It does not replace the source module graph or confer whole-module mastery. Definitions may reference planned modules, but enrollment requires a fully publishable, coherent selected course revision; the full paths remain map-only.

## Prerequisites and graph safety

Hard prerequisites, recommended preparation and optional enrichment use **three separate FK tables**. The first two must be acyclic within each candidate publication; optional enrichment may revisit later material and is excluded from entry-blocking graphs. Endpoints are kind-constrained. Hard/recommended edges include a rationale and any supplied/consumed-skill explanation. Preserve source ordering for export; it is not an implicit dependency rank.

Module prerequisite arrays and competency prerequisite arrays describe the same source design from different perspectives. Preserve both owner revisions but validate their agreement for the module's primary competency; do not count them as two independently required skills. Validate the competency graph and project prerequisite graph, plus the resolved combined module/competency graph after contracting a module with its primary exit competency. Reject self/circular entry requirements introduced by that resolution. Topic-level R1 edges use `path_topic_prerequisite`, scoped to the course revision, and must all point earlier in its course order; they do not overwrite the shared topic graph. Recommended edges are validated separately, never silently converted to mandatory barriers.

Use a recursive CTE with path/cycle tracking or equivalent complete in-memory graph validation over the candidate manifest. Serialize changes to the draft dependency graph using a single transactional advisory lock for this small catalog; re-read under the lock before accepting graph changes. Activation also locks the publication pointer and revalidates the whole candidate. This prevents two independently valid concurrent edge additions from committing a cycle. Ordinary per-row CHECK constraints cannot prove a cross-row DAG. PostgreSQL's [constraint guidance](https://www.postgresql.org/docs/18/ddl-constraints.html) distinguishes row checks from FK/unique/trigger enforcement; [recursive CTEs](https://www.postgresql.org/docs/18/queries-with.html) support cycle inspection. These are design choices, not executed SQL tests.

## Resources, sources and rules

Resource identity is an edition/work/product identity, not simply a URL. A shared landing page can legitimately describe different editions. `resource_identifier` prevents duplicate normalized DOI/ISBN/provider identities; `external_locator` deduplicates normalized URLs while `resource_locator` permits contextual shared landing pages. URL normalization lowercases scheme/host, removes default ports and known tracking parameters only; preserve case-sensitive path, meaningful query and section fragment. Possible title/author duplicates enter editorial review, never automatic merging. A merged duplicate retains its original stable ID and a successor relation; old assignments/history remain valid.

Assignments are stable entities referencing a resource and competency; exact topic applicability is a separate typed link, never inherited wholesale from module readings. Reading scope, purpose, candidate/reviewed status and claim evidence are versioned. Two assignments to the same book are legitimate when chapter, purpose or competency differs. Enforce an active-manifest semantic duplicate check on `(resource, competency, normalized reading scope, purpose, ordered exact-topic set)`; warn for similar text, reject exact duplicates unless a recorded intentional revisit explains it. Do not impose uniqueness on resource alone.

Rules separate the subject/instrument/jurisdiction key from versioned observations, source notices, effective date ranges and verification events. Preserve unknown dates and precision; a null upper bound means unknown end, not infinite certified validity. Conflicting historical observations coexist. Only an explicitly verified active operational determination may occupy a nonoverlapping known scope/date interval; represent this as a separate `rule_certification`, with an exclusion constraint when ranges are known. No P01 rule creates such a certification. Current eligibility is computed from verification status, effective dates, review due time, uncertainty, source supersession and withdrawal; it is not a permanent boolean copied from JSON.

Source documents, locators, original records, mappings and external claim/circular references stay distinguishable from locally reviewed teaching. References to external circular IDs are real notice records with unknown-date reasons, not broken self-FKs to local rules. Supersession links between notices and between rules are separate relations. Original source JSON snapshots are deliberate immutable archival payloads: hash-verified and restricted, never the operational curriculum database.

## Completion, mastery and version changes

An enrollment pins a path/course revision and a publication. `enrollment_requirement` freezes its deduplicated exact topic/revision, gate-version and project-version requirements. They are relational references, not a JSON denominator. For a full module path, expand every required module/topic and its assessments, including unpublished requirements; such a path cannot be enrolled as a finishable release until all are eligible. For R1, create exactly 36 topic requirements, six gates and one dossier. Display lesson count, gate outcomes and self-review separately.

`learning_progress` represents started/self-completed/reopened state per owner and exact topic revision. It cannot award mastery. `mastery_evidence` records supported competency evidence tied to an actual attempt/project/diagnostic and rubric/competency revision, with an exclusive typed source constraint. Course gate passing does not infer mastery of every broader module competency. P17 must explicitly author the evidence association.

Editing a lesson/path does not change an existing denominator. At 18/36 completed, adding a 37th lesson to a new course revision leaves the old enrollment at 18/36 and offers a deliberate migration. A new enrollment revision gets a new requirement snapshot. Carry evidence forward only for identical revisions or an approved `revision_equivalence`; changed material is incomplete until reviewed. Retired/withdrawn required lessons remain in the old denominator with a blocked/replacement-needed status; never silently shrink the denominator to make completion rise. A correction adds a recheck marker without rewriting the original score. “Earned under version X” remains historical evidence; current mastery is withheld while critical recheck is unresolved.

Recomputation derives counts from pinned requirements, progress and immutable evidence plus recheck flags. Any cached summary records its algorithm version/input watermark and is disposable; no summary is the source of truth. Concurrency checks stop a stale tab from completing a topic that another tab deliberately reopened. Anonymous practice is transient; only authenticated verified users create owned persistent records.

## Design scope and next gate

P08 implements the staged schema and real PostgreSQL constraints/tests. P09 implements the validated importer; no production migration should silently turn source metadata into public lessons. P05 can now specify APIs against concrete ownership/version/conflict semantics. Ratings/moderation remain future work with **no R1 tables, role, API or collected ratings**. P04 changes neither the canonical JSON nor P02 requirements.

P04 validation checks specification references, complete canonical collection/field/record dispositions, stable keys and documented FK targets. It does not claim that PostgreSQL constraints, query plans, imports or recovery have been executed. The required database experiments and negative tests are assigned explicitly in the linked lifecycle and query documents.

## P05 implementation clarifications

The [P05 persistence supplement](api/PERSISTENCE_CLARIFICATIONS.md) adds bounded durable command receipts, specifies STARTED answer-save behavior and defines exact quiz-to-transfer remediation mapping for P08. P08 implements these additions with typed references and real ownership, retry, scoring immutability and erasure tests. Canonical interchange remains unchanged.


## P08 migration commands

Use the exact Java/Docker prerequisites and environment flow in [DEPLOYMENT](../operations/DEPLOYMENT.md). Hibernate remains `ddl-auto=validate`; it never creates or repairs the schema.

```sh
# Real PostgreSQL/Testcontainers: empty creation, upgrades, constraints, repositories and readiness.
./backend/mvnw -f backend/pom.xml -B verify
python3 scripts/check-migration-history.py

# Local runtime: keep the existing environment/volume when upgrading P07.
docker compose -f infrastructure/compose.yml up -d --wait postgres mailpit
python3 scripts/provision-local-db.py
docker compose -f infrastructure/compose.yml -f infrastructure/compose.full.yml up -d --build backend
python3 scripts/wait-ready.py

# Actual database version; use the local migration owner only for operator inspection.
docker compose -f infrastructure/compose.yml exec -T postgres \
  psql -U options_local -d options_local -c 'SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank'
```

For host development, source `.local/backend.env` and run the documented `spring-boot:run` command. Flyway uses the separate `MIGRATION_DB_USER/PASSWORD` pool; ordinary queries use `options_runtime`. The local helper preserves the original DB owner password, generates a distinct random runtime password and prints neither. No `clean`, `repair`, baseline reset or volume deletion is part of setup. A checksum mismatch fails startup: investigate the differing artifact and add a forward corrective migration. Do not rewrite a deployed file.

For production, a DBA precreates btree_gist and the three NOLOGIN groups. Run the same migration artifact with a schema-owning migration login before deploying the web process. Give the runtime login only `otr_runtime`, verified PostgreSQL TLS, and set `MIGRATIONS_ENABLED=false`; do not supply migration/erasure credentials to that process. Provisioning a production target remains P21/P22, not part of these local commands.

To reproduce the explicitly isolated query-plan experiment (larger than the ordinary CI suite):

```sh
./backend/mvnw -f backend/pom.xml -B test-compile spring-boot:test-run \
  -Dspring-boot.run.main-class=org.options.platform.P08QueryPlan
```

The command creates and removes a dedicated Testcontainers PostgreSQL instance and writes `backend/target/p08-evidence/query-plans.json`. It never connects to the application DB. Interpret its fixture scope and cache conditions from the report; it is not an end-to-end performance SLA.


## P09 canonical import

The operator commands and authority/conflict/recovery rules are documented in [data/README](../../data/README.md). V0016–V0020 add immutable canonical provenance/package membership, pre-change draft checkpoints, typed rule values, notice date precision, bounded deferred graph validation and same-object recovery keys. The baseline has 107 base tables: P08's 103 plus three import metadata tables and one internal transaction guard. These are no new HTTP endpoints or learner features.

P08 intentionally left the local domain tables empty. P09 upgrades that actual state before the first canonical import; the typed rule-value migration expects that supported pre-import state. An independently modified older database containing numeric rule observations must be investigated before upgrade; never erase observations or use Flyway repair to bypass its shape constraint. P09's tested content recovery restores draft versions without rolling back learner transactions or changing publication.


## P10 public projections

V0021 adds public route snapshots, exact membership-filter rows, activated-manifest history and a private cursor-signing key (111 total base tables including framework/Flyway tables). It adds public metadata/rule-notice views and activation/safety triggers. V0001–V0020 remain byte-identical. The cursor key is random per database and shared across application instances; it is neither canonical content nor an exported DTO. Import credentials cannot read it.

Search documents and filter membership are built transactionally when a new manifest is activated. Frozen public routes prevent draft imports from exposing unpublished renames; historical approved routes resolve through activation history. Retirement/withdrawal recheck eligibility at read time and advance the generation; no async worker is required to hide an unsafe body. Only explicit project-topic/path-project relationships supplement the P08 link allowlist.

Public reads project safe fields and bounded ordered references; protected reference behavior, prompts with embedded answers, rubric keys and raw source records never enter search or DTOs. PostgreSQL English full-text ranking uses weights A=1, B=.4, C=.2, D=.1 and normalization 32 with exact ID/title precedence. [P10 measurements](evidence/p10/REVIEW.md) cover canonical-scale SQL and request behavior. Publication/editor HTTP orchestration remains P16, and production capacity remains P20.
