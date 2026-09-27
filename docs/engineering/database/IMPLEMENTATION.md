# P08 persistence implementation

26 September 2026. The [P04 dictionary](SCHEMA.md) remains the design contract. The executable SQL is in `backend/src/main/resources/db/migration/`; the [catalog audit](../evidence/p08/schema-audit.json) records actual PostgreSQL columns, constraints and indexes. There are 100 domain tables, two unchanged framework session tables and Flyway's history table. No application endpoints, accounts, catalog seed content or default administrator were added. Only the four allowed role codes are seeded.

## Migration allocation

| Version | Contents | P04 groups |
|---|---|---|
| V0001 | Original P07 Spring JDBC session DDL, byte unchanged | Framework part of DB01 |
| V0002 | All identity, typed catalog, provenance, rules, publication, import, assessment, learner, privacy and P05 receipt/remediation tables; btree_gist | DB01–DB08 table targets |
| V0003 | Explicit typed/composite FKs, account ownership, fixed vocabularies, bounded text/numeric/range checks, certification exclusion | DB01–DB08 relationships |
| V0004 | Revision completeness/immutability, dependency graph, route identity, publication validation and temporal certification consistency | DB02–DB06 |
| V0005 | Enrollment snapshots, pinned assessment membership/grading, project responses, evidence and remediation | DB07 |
| V0006 | Every sealed aggregate child guard, permanent source/review records, unique/partial/search/ownership indexes and FK index coverage | DB02–DB08 |
| V0007 | Typed job/receipt/journal checks, owner locks, security generation, token/session revocation and session size limit | DB01/DB06–DB08 |
| V0008 | NOLOGIN privilege groups; runtime, importer and privacy access separation | DB08 |
| V0009 | Forward fixes from role/upgrade tests; privacy token revocation, typed publication closure, receipt journal sequence and equivalence review | DB06–DB08 |
| V0010 | Erasure-safe nullable evidence links, immutable resource/credential identity and monotone authenticator counters | DB01/DB03/DB08 |
| V0011 | Database-side optimistic versions also cover native SQL updates | Mutable records |
| V0012 | Revision body hash computation, session/challenge cascade and bounded route segments/certification dates | DB01–DB05 |
| V0013 | Pinned project rubric scores, manifest digest and exact-question exposure lineage | DB06–DB07 |
| V0014 | Typed verification/assessment references, exact review hashes, reinstatement reviews and privacy job context | DB03/DB06–DB08 |
| V0015 | Forward repair: isolate table-specific trigger record access | DB03/DB06–DB08 |

Table creation and cross-table constraints are separate migrations because P04 contains forward references. This allocation replaces the illustrative one-file-per-design-group ordering without dropping a group. Versions are applied transactionally. The V0001-to-current upgrade is real: the initial schema already existed, so “no prior upgrade path” would be incorrect. The retained test fixture inserts a session before upgrading and confirms it survives. Tests also upgrade seeded identities from every intermediate migration boundary.

## Explicit schema differences and decisions

- `catalog_revision.sealed_at` is nullable **only while the creating transaction assembles the aggregate**. A deferred trigger refuses commit until it is sealed and complete. `enrollment.sealed_at` is the same transaction-local snapshot barrier. These are not publicly visible mutable content drafts; editorial workflow remains in `draft_head`.
- Stable object/revision FK targets materialize checked kind columns, including account interest, exact TOPIC progress, source modules and remediation topics. These columns implement P04's shorthand and prevent string-dispatched references. `enrollment.path_object_id` supplies the specified active-enrollment uniqueness and same-owner predecessor reference.
- Revision sections carry `owner_kind` with a composite FK and a migration-owned kind/section allowlist. Required fields are typed; the three documented archival/diagnostic JSON exceptions remain the only domain JSON payloads.
- `provenance_anchor.locator_hash` and `rule_subject.scope_hash` avoid oversized composite text indexes; the original strings remain intact. URL/path/scope/anchor hashes are checked from exact stored input. Uniqueness rejects a collision rather than silently merging identities.
- `editorial_event.actor_role` records the bounded role-at-event field required in P04 prose. It contains no copied profile, note, answer or request body.
- `command_receipt` and `quiz_remediation_requirement` implement P05's additions. Receipts have typed result FKs and an operation/result CHECK matrix; no cached response JSON. `remediation_record.practice_response_id` has a same-owner FK with column-specific SET NULL, preserving historical completion after explicit practice deletion.
- `revision_body_hash` computes SHA-256 at sealing over deterministic PostgreSQL jsonb containing common scalar fields, typed details, links, sections, keys and form items. Codec `p08-db-jsonb-v1` includes internal relational identities and excludes record/sealing timestamps. It is a **database revision digest**, separate from a canonical package/file hash. Prior accepted revision hashes are never rewritten. The importer must compare proposed source hashes separately and use the returned sealed revision digest for reviews.
- All persistent catalog identities and routes are retained. Runtime edits make new revisions; runtime privileges and triggers reject changing sealed bodies. Private account-owned cascades implement erasure only. Content retirement cannot delete notes, progress, requirements, attempts or evidence. Explicit note deletion records a minimal tombstone without note text.
- Exact duplicate semantic reading assignments are rejected. The current SQL gate requires an explicit distinct reading scope/purpose for an intentional revisit; it does not yet accept a free-form duplicate override. P09 must retain source intent and reject a conflicting package with an actionable diagnostic rather than silently merge it.
- NOLOGIN groups `otr_runtime`, `otr_import` and `otr_privacy` have no reusable credentials. A separate migration owner owns DDL. The importer cannot read or write learner-owned tables or activate publications. Ordinary runtime cannot delete accounts or alter schema/triggers. The privacy worker has a separate connection role. Production startup requires migrations to have run separately and checks actual runtime privileges before readiness.

## Persistence boundaries

`identity.persistence.Account` is a small JPA aggregate with `@Version`, scalar foreign keys, no eager associations and no password getter. Explicit repositories return bounded projections; no entities are returned by web controllers, no Spring Data REST endpoints exist, and no generic table CRUD layer was introduced. Parameterized JDBC handles ordered catalog projections, private ownership, pinned counts, receipts, publication compare-and-set, import application markers, leases and erasure. A repository exists for an actual tested access path, not for every table.

All owned writes lock/check the account first, then use owner predicates and expected versions. Native changes also increment database lock versions. Graph/publication operations acquire the same transaction advisory lock. Import application runs inside the caller's transaction and checks its base publication generation; P09 still owns parsing, staging and applying canonical proposals. Receipt replay returns the original identity without rerunning a committed operation. Expiry removes only the receipt, never enrollment uniqueness or assessment exposure.

Passwords use Spring's versioned DelegatingPasswordEncoder with Argon2id, 19 MiB memory, two iterations, parallelism one, random salt and two concurrent hashing workers. The database rejects plaintext/other formats. Bouncy Castle 1.86 is explicitly pinned because the Boot BOM does not manage that artifact; its current official release was checked and the resolved dependency is scanned. No password/account is seeded. Common-password enrollment policy, authentication routes and durable WebAuthn framework adapters remain P13; the stored COSE public-key/counter/handle columns do not claim an enabled account journey.

The protected assessment schema checks assigned form/question/choice membership, exact numeric tolerances, complete atomic submitted answers, server-derived scores, critical failures, durable first exposure and same-owner evidence. SQL records support the workflows; P15 still implements the user-facing orchestration, feedback/withdrawal policy and fresh-form allocation. Public API authorization remains deny-by-default.

## Retention and boundaries

An erased account leaves pseudonymous editorial actors, reviewed catalog bodies and minimal recovery tombstones. Account-owned data disappears through explicit FKs; finalized-answer guards allow these erasure cascades. `PrivacyErasure` must be constructed with the privacy worker connection and an active transaction. It expires pending exports while retaining their private storage key for verified external object deletion. It does not claim external object removal or independently acknowledged recovery-journal replication; those remain the privacy/operations workflow gates. Runtime has no account-delete privilege.

A live withdrawal survives publication selection changes. Historical requirement counts remain fixed, and self-completion stays separate from scored or self-reviewed evidence. Tests demonstrate 18/36 remaining 18/36 after later content revisions and retirement. No canonical import, reviewed lesson, account registration/login, assessment UI, cold-cache/request-p95 capacity, external backup restore or production deployment is claimed by P08.
