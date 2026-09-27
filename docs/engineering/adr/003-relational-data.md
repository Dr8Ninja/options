# ADR-003 — PostgreSQL, Flyway and a modular monolith

Accepted for design, 23 September 2026. Detailed ERD, constraints and migrations are P04/P08 work. [Architecture](../ARCHITECTURE.md).

## Decision

Use one PostgreSQL 18 database per environment. Use relational records and explicit foreign keys for hierarchy, competency edges, resource assignments, release membership, versions, ownership and assessment evidence. JSON/YAML in `data/v1` remains an editorial interchange contract. A document body or bounded typed snapshot may be stored as text/JSON where appropriate, but a curriculum JSON blob is not the application's relational model.

Flyway owns all schema changes, including the PostgreSQL-specific Spring Session tables. Disable Hibernate schema creation/update and session automatic schema initialization; Hibernate validates mappings. Use a separate migration credential in a single pre-release job; runtime credentials cannot run DDL. Development/test/production use the same migrations. Use forward-only corrections; destructive changes require a separately reviewed migration and compatible deployment sequence. Content publication rollback does not roll back database migrations.

Spring Data JPA persists owned aggregates; services define transaction boundaries and authorization, repositories use explicit owner predicates. DTO projections, pagination and deliberate fetch plans prevent unbounded graphs/N+1 behavior. Parameterized Spring JDBC handles search and measured bulk queries. Avoid a repository-of-repositories framework, a generic entity API, JPA inheritance for every content type and hidden cascade deletion across learner history.

## Discovery and consistency

Use PostgreSQL full-text search with a GIN index over an explicit **public projection**: titles, permitted descriptions, authors, tags, hierarchy labels and allowed publication metadata. Exact stable ID and normalized title matches outrank text relevance; ties use title then stable ID. Apply REQ-10/11 filters and sort rules, allowlisted query construction, maximum 200 query characters and 50 results per page. Search does not inspect drafts, notes, account records, quiz answers, private feedback or inaccessible book text. SQL ranking tests use P02's named queries and facet combinations. pg_trgm may be enabled later only if typo search becomes a requirement; no initial search service is necessary.

Publication transaction builds/replaces the small public projection and advances one release pointer with its related content set. All public reads use a single selected release and active withdrawal checks. A request must not combine page data from release A with prerequisites from release B: use one catalog read DTO/transaction, or propagate a server-chosen revision token to subsequent reads. A concurrent withdrawal overrides a pinned release and can return a correction status. Search and sitemap read the same eligibility rules as pages. Freshness is computed at request time, so a failed overnight scheduler cannot keep an expired rule marked current.

Optimistic versions protect notes, progress and editorial edits. Requests carry an expected revision; stale writes return a conflict with the current owner-visible state, never silently replace it. Unique constraints and idempotency receipts protect bookmark toggles, assessment submissions and publication jobs. An attempt is immutable after submission and binds content, form, rubric and scoring versions. Real timestamps use UTC instants; financial examples carry explicit unit/currency/date conventions rather than machine-local defaults.

## Work and scale

Use a small durable jobs/outbox mechanism in PostgreSQL for mail, export, deletion, freshness review and publication audit/export tasks. Claim jobs transactionally with leases, bounded retries and deduplication; expired leases permit recovery. Keep external I/O outside the content/write transaction. Do not add a broker or distributed workflow platform for this volume. A failed notification never converts an unpublished draft into a public record or loses a deletion request.

Reference pool: maximum 10 application JDBC connections per Spring instance, short query timeouts, separate bounded migration/backup connections. The reference DB plan allows 100 connections; leave headroom for maintenance and doubled replicas. This is a starting budget, not a measured tuning result. Index owner/version/status and job due-time predicates; bound all admin list/import/export operations. P20 uses the full REQ-33 learner dataset, not just 36 lesson records.

## Alternatives

MongoDB/file-only storage loses useful referential/transaction guarantees for shared content and learner versions. SQLite does not match planned concurrent hosting and PostgreSQL-specific validation. MySQL could work but no requirement justifies departing from the preferred PostgreSQL ecosystem. jOOQ offers strong SQL typing but adds code generation/licensing/version considerations with little benefit for the initial CRUD workload; adopt only after a concrete query need. Elasticsearch/Redis add synchronization and operations before measured need. Microservices introduce distributed publication/auth consistency problems without independent team/scale requirements. Spring Modulith is optional later; initial package boundaries and ArchUnit are enough.
