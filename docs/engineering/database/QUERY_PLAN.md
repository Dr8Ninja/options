# P04 query and index investigation plan

23 September 2026. These are parameterized SQL **design examples**, not executed plans or migrations. Table/column meanings are in [SCHEMA](SCHEMA.md). P08 records `EXPLAIN (ANALYZE, BUFFERS, SETTINGS, FORMAT JSON)` from real PostgreSQL18 with representative synthetic data; P20 tests end-to-end budgets. PostgreSQL explains the distinction between estimates and measured execution in [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html).

## Dataset and measurement contract

Start with all canonical identities/revisions and relationships, not just 36 demo lessons. Add separately marked reviewed synthetic fixtures in a test database: 5,000 accounts, 250,000 progress rows, 200,000 attempts, 1,000,000 answers, 50,000 notes and 100,000 bookmarks, the P02 planning scale. Also test 10× historical revisions/attempt skew, one heavily active learner, a zero-progress learner, retired/withdrawn content and many matching tags. Do not call an invented performance number a result.

Use fixed seed/data-generation version and workload manifest; run ANALYZE after loading; report table/index bytes, rows, estimates versus actual rows, buffers, sorts/spills, execution/planning time, runtime/CPU/RAM/version and cold/warm conditions. EXPLAIN ANALYZE executes a statement: use isolated disposable databases for writes, or explicit rollback where the statement has no external side effects. Never run mutation benchmarks on real learner data.

Repository objectives supporting P02: public detail ≤3 bounded content queries plus one live withdrawal/generation check, public list/search ≤2 content queries plus that check, dashboard ≤6 bounded queries; eliminate per-row lazy-load queries. Starting DB-only p95 targets at planning scale are100ms for ordinary lookups/search and150ms for dashboard aggregation, within P02 API budgets. These are investigation budgets, not a substitute for P02 measurements or a promised SLA. At50 concurrent sessions/20 requests per second measure pool wait and locks as well as SQL; a fast isolated query can still fail the request budget.

## Q01 — public route, exact manifest and ordered topic membership

Resolve the route to a stable object, then use the current manifest. Old paths redirect directly to its current canonical route. Query the map only with an allowlist projection; LESSON bodies need additional readiness/rights checks.

```sql
SELECT o.external_id, o.kind, pe.revision_id, pe.visibility,
       cr.title, cr.readiness, ap.publication_id, ap.generation
FROM catalog_route rt
JOIN catalog_object o ON o.id = rt.object_id
CROSS JOIN active_publication ap
JOIN publication_entry pe
  ON pe.publication_id = ap.publication_id AND pe.object_id = o.id
JOIN catalog_revision cr ON cr.id = pe.revision_id
WHERE rt.path_key = :path AND ap.singleton = 1
  AND pe.visibility IN ('MAP','LESSON')
  AND NOT EXISTS (
    SELECT 1 FROM content_withdrawal w
    WHERE w.object_id = o.id AND w.reinstated_at IS NULL
      AND w.starts_at <= :request_instant
      AND (w.revision_id IS NULL OR w.revision_id = cr.id));

SELECT l.ordinal, o.external_id, r.title, pe.visibility, r.readiness
FROM catalog_link l
JOIN catalog_object o ON o.id = l.target_object_id
JOIN publication_entry pe
  ON pe.publication_id = :publication_id AND pe.object_id = o.id
JOIN catalog_revision r ON r.id = pe.revision_id
WHERE l.owner_revision_id = :module_revision AND l.relation = 'module_topic'
ORDER BY l.ordinal;
```

Investigate route unique index → singleton/PK joins, owner/relation/ordinal index and partial active-withdrawal index. The child query also needs a withdrawal anti-join/final bulk check before serialization; missing/withdrawn children produce an explicit unavailable state, not an invalid empty module. Never serialize a fetched entity recursively. Proposed publication-aware public views are optional SQL simplification, not extra persistence.

## Q02 — search and filters

Use PostgreSQL English full-text search for prose; exact case-folded external ID/title handling covers symbols and titles such as BSM/0DTE that tokenization may treat unexpectedly. Bind query text; `websearch_to_tsquery` is not SQL string interpolation. Search contains only approved public fields, never lesson answer keys, private notes or draft bodies.

```sql
WITH q AS (SELECT websearch_to_tsquery('english', :query) AS tsq)
SELECT d.object_id, d.title, d.kind, d.readiness,
       ts_rank_cd(d.search_vector, q.tsq) AS rank
FROM public_search_document d CROSS JOIN q
WHERE d.publication_id = :publication_id
  AND d.kind = ANY(:allowed_kinds)
  AND d.search_vector @@ q.tsq
  AND NOT EXISTS (
    SELECT 1 FROM content_withdrawal w
    JOIN publication_entry e
      ON e.publication_id = d.publication_id AND e.object_id = d.object_id
    WHERE w.object_id = d.object_id AND w.reinstated_at IS NULL
      AND w.starts_at <= :request_instant
      AND (w.revision_id IS NULL OR w.revision_id = e.revision_id))
ORDER BY rank DESC, d.object_id
LIMIT :page_size OFFSET :bounded_offset;
```

Add optional filters by choosing prepared query shapes, not `(:filter IS NULL OR ...)` everywhere. Difficulty/readiness/kind are scalar; tags use EXISTS with `revision_tag`; resource priority/cost/author use typed detail joins. Exact-ID results are a separate indexed candidate set unioned/deduplicated ahead of ranked results. Alphabetic and duration sorting use stable `(title_key,object_id)` or `(hours_min NULLS LAST,object_id)`; keyset pagination for long browsing, bounded page/offset for this small ranked corpus. P05 defines cursor shapes. Unknown duration comes last, never treated as zero. Empty query becomes browse; zero-token query gets helpful no-match/ID search, not a syntax error. Filters/counts use identical public visibility/withdrawal predicates.

Investigate a GIN `search_vector` index with btree publication/kind selection and exact/title indexes. PostgreSQL [full-text index guidance](https://www.postgresql.org/docs/18/textsearch-indexes.html) supports GIN for these inverted lookups; it does not guarantee a particular plan. At roughly1,000 topics a sequential scan can be correct and faster. Do not force indexes to satisfy a screenshot. Recheck rank sorts, selectivity and publication history growth before adding trigram/search infrastructure.

## Q03 — owner-safe notes and optimistic update

```sql
SELECT id, text, lock_version
FROM private_note
WHERE public_id = :note_public_id AND account_id = :authenticated_account;

UPDATE private_note
SET text = :plain_text, lock_version = lock_version + 1,
    updated_at = transaction_timestamp()
WHERE public_id = :note_public_id
  AND account_id = :authenticated_account
  AND lock_version = :expected_version
RETURNING public_id, lock_version, updated_at;
```

Take/check the account lock before the write as specified in lifecycle. Zero rows must not reveal another account's note. A owned lookup resolves a stale-version conflict; arbitrary public UUID cannot supply ownership. Test concurrent save/delete/erasure; no note body in SQL logging or conflict telemetry. Public UUID unique and owner/object unique indexes cover lookup; owner/updated_at supports a paginated private list if P05 includes it. Avoid indexing note text.

## Q04 — pinned denominator and current evidence

```sql
SELECT count(*) AS required_topics,
       count(*) FILTER (WHERE p.state = 'SELF_COMPLETED') AS exact_completed
FROM enrollment e
JOIN enrollment_requirement r ON r.enrollment_id = e.id
LEFT JOIN learning_progress p
  ON p.account_id = e.account_id AND p.topic_revision_id = r.revision_id
WHERE e.public_id = :enrollment_public_id
  AND e.account_id = :authenticated_account
  AND r.kind = 'TOPIC' AND r.required;
```

This example deliberately measures **exact-version self-completion only**, not mastery or approved equivalence. Full summary adds a separately bounded equivalence/recheck resolution and gate/dossier query; tests must prevent duplicate numerator rows from multiple attempts/equivalence paths. Use EXISTS rather than raw join counts. Return withdrawal/block/recheck status alongside historical count. At18/36, a new37-topic course publication leaves this query at18/36 for the old enrollment. Index PK(enrollment,ordinal), unique enrollment/object/kind and PK(account,topic_revision) should cover the small snapshot; inspect active-enrollment lookup and same-owner predicates.

## Q05 — gate eligibility, result and immutable answer membership

Start under account/enrollment lock, read previous gate results against frozen requirements, remediation and form exposure; choose a fresh group or return exhausted-bank/repeated-practice state. `quiz_attempt` lookup uses unique(owner,request_key); updates lock its row. Questions are loaded once by form/ordinal, with protected keys available only to the scoring service. Submission uses one transaction for answer rows, immutable result and attributed evidence; the composite FKs in SCHEMA reject forged question/choice membership even with a valid question elsewhere.

Measure both first submission and identical network retry; concurrent starts cannot allocate the same fresh group twice. Practice on an exposed form sets purpose PRACTICE and `fresh_evidence=false`, regardless of score. Exposure insertion during the current first attempt does not make that same attempt stale. Test this distinction explicitly. Diagnostics route to help and do not satisfy six required gate rows. Answer indexes should primarily be PK(attempt,item), not indexes on private response bodies.

## Q06 — resource assignments, freshness and rule impact

An exact reading query follows assignment revision → resource object → selected resource revision, with separate assignment_topic join or competency-level fallback clearly labeled. It never expands every module resource into topic citations. Use assignment(resource_object_id), assignment(competency_object_id) indexes and catalog_link(target_object_id,relation,owner_revision_id) for reverse relevance. Batched resource/verification retrieval prevents N+1 requests.

Freshness jobs read the latest verification per subject and method with `(subject_revision_id,method,checked_on DESC,id DESC)` and compare due times to a bound parameter. The source date checked_on and record timestamp checked_at have different meanings. Rule dependency reverse lookup is indexed `(rule_object_id,dependent_revision_id)`; impacted active manifest rows are joined explicitly. For current rule reads:

```sql
SELECT rc.rule_revision_id, rc.valid_dates, rc.review_due_at
FROM rule_certification rc
WHERE rc.subject_id = :subject_id AND rc.status = 'ACTIVE'
  AND rc.valid_dates @> CAST(:market_date AS date)
  AND rc.review_due_at > :request_instant;
```

This selects a candidate; service then checks withdrawal, superseding notices, scope and selected publication. It is not itself a complete current-fact authorization query. GiST exclusion handles active overlapping ranges; btree `(subject_id,status)` may help small lookups. No partial index or persisted eligibility CHECK uses `now()`: time advances without updating a row. PostgreSQL [partial-index predicates](https://www.postgresql.org/docs/18/indexes-partial.html) also require matching query conditions; verify prepared query behavior on actual plans.

## Q07 — durable worker claim and privacy cleanup

```sql
SELECT id, kind, lease_token
FROM job
WHERE state = 'READY' AND due_at <= :now
ORDER BY due_at, id
FOR UPDATE SKIP LOCKED
LIMIT 10;
```

In the same short claim transaction set RUNNING and new lease token/until, then commit before work. Completion requires matching current token; expired leases can be reclaimed with bounded retries. A stale worker cannot mark a newly claimed job complete. Investigate partial `(due_at,id) WHERE state='READY'` and `(lease_until,id) WHERE state='RUNNING'`. Cleanup uses `(expires_at,id)` or retained table's explicit timestamp, bounded batches and deletion ledger acknowledgment. Test erasure competing with job claims so no queued export recreates deleted private content.

## Minimal index allocation and investigation decisions

| Access path | Initial index/constraint | Required investigation |
|---|---|---|
| Identity/security | U(email_key), U(public_id), role PK; session framework indexes; token digest U; token/account and TTL; credential/account | Login collision handling; revoke all sessions without scanning attribute bytes |
| Stable content/addresses | U(external_id), U(path_key), partial U(object) canonical route, U(object,revision_no) | ID/slug redirects, historical revisions, retired identities |
| Manifest/hierarchy | PK(publication,object), index(revision_id), U(owner,relation,ordinal), reverse target/relation/owner | Bounded hierarchy fetch; inverse provenance/impact; candidate closures |
| Tags/dependencies | revision_tag PK + (tag_id,revision_id); prerequisite owner PK + (requires_object_id,owner_revision_id) | Filter EXISTS and reverse prerequisite impact; concurrent full DAG check costs |
| Resources/provenance | locator digest U; identifier PK; assignment resource/competency; mapping target + source mapping external U; anchor artifact | Duplicate URLs/identities and exact contextual reading; inspect long-key hash collisions with forced test hash |
| Public discovery | GIN(search_vector); (publication_id,kind,title_key,object_id); exact object ID lookup | Selectivity/rank sort; do not add all combinations of filters |
| Owners/learning | PK(account,topic_revision); note U(account,object); bookmark PK; enrollment partial U(account,path); attempt U(account,request_key) and (enrollment,quiz_revision,ordinal) | Cross-owner negatives, stable pagination, denominator/attempt skew |
| Assessment | form/item PK; choice PK; answer PK; exposure PK(account,group); evidence(account,competency_revision,awarded_at DESC) | Avoid duplicate evidence counts; grade without public key leakage |
| Editorial/temporal | draft head PK; review(revision_id,review_type,decided_at DESC); active withdrawal(object_id,revision_id); verification index above; certification exclusion | Publication conflict and withdrawal lookup; finite review deadlines |
| Queues/retention | job partial due/lease indexes; privacy_request(state,requested_at); issue(status,created_at); own-data account FK indexes | Backlogs, lock contention, bounded erase/export; retention batch time |

All other FK indexes should reuse leading columns of existing keys where possible. PostgreSQL does not automatically index referencing FK columns: P08 exports a catalog audit listing uncovered FKs with either an added index or a specific small-table scan rationale. The dictionary's many small typed joins need no individual cache or repository abstraction. No partitioning, Redis, Elasticsearch, materialized dashboard or table-per-topic is justified by this scale. Introduce a new index only with the measured query and write/storage tradeoff recorded; business uniqueness/exclusion indexes remain mandatory independently of speed.

P08 evidence must include duplicate/referential/check/immutability negatives, two-connection graph/publication/import/owner/attempt races and an upgrade rehearsal. P20 measures warm/cold request distributions with concurrent writes, no private-cache leakage, search visibility and query count. Neither stage may substitute the examples in this document for those results.


## P08 measured subset

[P08's review](../evidence/p08/REVIEW.md) and [actual plans](../evidence/p08/query-plans.json) record the implemented warm route/search/owner/denominator/answer queries and history/skew/withdrawal/tag cases on PostgreSQL with all constraints enabled. This is a measured subset, not closure of every query above: real canonical body/relationship loading is P09; actual mixed discovery filters are P10; cold-cache/concurrent HTTP capacity is P20. Reproduce with the isolated test-classpath command in [DATABASE](../DATABASE.md).
