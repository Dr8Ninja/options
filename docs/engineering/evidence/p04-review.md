# P04 design review and exit gate

23 September 2026. This is a documented design review performed in this task, not independent human/database-expert approval. [Database overview](../DATABASE.md), [schema](../database/SCHEMA.md), [mapping](../database/CANONICAL_MAPPING.md), [validation output](p04-validation.json).

## Entry evidence and scope

`python3 scripts/validate_architecture.py` passed on entry, including P02's document gate. P03 decisions remain Java/Spring domain services, PostgreSQL18/Flyway, database-authoritative revisions, Next presentation, same-origin sessions and deletion-aware recovery. P01 exports remain `1.0.0-design`, dated22 September2026, with zero reviewed lessons and no current operational rule certification. Shared instructions, source field definitions, actual export records, P02 course/journeys/privacy and relevant P03 decisions were inspected. Original files and canonical exports were not edited.

This stage specifies relational entities, typed keys, cardinalities, version/visibility/ownership, transaction boundaries and forward migration groups. It creates no database, application feature or Flyway SQL. Query examples are investigation plans; Mermaid diagrams have source-level checks only.

## Review findings and applied resolutions

| Finding | Resolution in the resulting design | Recheck / later proof |
|---|---|---|
| A single mutable curriculum row would invalidate old learner work | Stable catalog identity, immutable typed revisions, publication manifest and pinned enrollment requirements | Exact revision/object FK plus43 R1 requirements; P08 version-change fixture |
| Generic table-name/ID targets could orphan notes, links or answers | Real catalog supertype; closed kind matrix; composite question/form/owner FKs; typed evidence XOR | Dictionary/ERD target audit now; actual negative insert tests P08 |
| Empty capstone/specialization detail tables added no value | Common revision/sections/typed joins preserve them; no empty subtype tables | Field mapping covers all their records/fields |
| First validation rejected the inventory domain-selector provenance variant | Added explicit selector → provenance_anchor.locator_label mapping; kept strict unknown-field rejection | Rerun covers all actual source-mapping provenance keys; no assertion removed |
| Original count was informally described as23 collections | Enumerated actual files:22 collections plus manifest,11,452 records,245 distinct top-level fields | Validator compares actual glob, hashes, every ID and union of fields; prior count is corrected |
| Math/Python/practice and supplemental prose could again disappear | Explicit supplemental artifact manifest and ARCHIVE guide treatment;28 original archive IDs remain real mapping targets | P09 must compare guide prose to generated views and preserve unique text |
| A shared URL is not a book/edition identity | DOI/ISBN/provider uniqueness plus deduplicated locators and contextual resource assignments | Hash collision rejection and duplicate-work review cases assigned P08/P09 |
| Long URL/path keys could exceed btree entry limits | Bounded digest indexes plus exact-string collision rejection for long locator/anchor/artifact keys | Forced collision fixture; no truncation or unsafe merging |
| Rule unknown end dates looked like perpetual validity | Separate raw observation from finite verified-as-of certification window; unknown remains raw unknown | Clock-advance, overlap and supersession negative tests P08; all27 current flags remain false |
| Import report revalidation conflicted with one-row-per-hash uniqueness | Numbered immutable validation runs; partial one-APPLIED-per-hash; explicit revalidation versus retry | Concurrent replay/no-new-revision test P09 |
| Revised provenance/claim records could overwrite earlier assignments | Source mappings append per import batch; source records/claim editions unique per source artifact; exact assignment-claim FK | P09 two-version source/claim replay fixture |
| R1's99 lesson preparation edges could overwrite global topic prerequisites | Course-scoped path_topic_prerequisite; selected36topic view, separate canonical competency graph | Earlier-only membership audit; no broad module mastery implied |
| Four-item entry diagnostic was forced into10-item gate rules | Explicit DIAGNOSTIC purpose, path diagnostic reference and remediation topic links; six required gates remain separate | P15 public/transient and owned diagnostic routing; no diagnostic gate credit |
| Two exhausted forms had no honest repeated-practice state | Attempt purpose FRESH/PRACTICE/DIAGNOSTIC, exposure lineage, remediation and maintenance queue | Repeat practice cannot create fresh gate evidence; five-business-day operational target remains |
| Module exercise links were too broad for exact lesson practice | lesson_practice links, numeric question key optional on authored exercise, question-to-topic coverage and remediation links | P17's72 practice prompts and120 gate items separately authored/reviewed |
| A newer publication could resurrect deleted accounts or withdrawn lessons after rollback/restore | Independent withdrawal and deletion/revocation journal, current read checks, restore barrier and ephemeral-session exclusion | Actual timed recovery, journal outages and stale-export cleanup P21 |
| Unique-UUID shorthand accidentally constrained shared exposure groups and multiple privacy requests | Shared UUID references now use plain uuid with explicit composite keys; only object public IDs are globally unique | Dictionary review and later multiple-account/form/request fixtures |
| Recovery and mail intents omitted necessary bounded fields | Added typed pending-email purpose/generation/expiry and per-note/dossier erasure tombstones; no raw tokens or private bodies in jobs/journal | P13/P19/P21 retry, account change and individual deletion replay |
| Concurrent note save or grading could outlive account erasure | Short account lock/check before owner writes, same-owner FKs, generation/session revocation and cascade only on privacy erasure | Two-connection save/delete/submit/erase tests P08/P19 |

## P02 journey allocation

| Journey | Relational representation / integrity boundary | Required implementation proof |
|---|---|---|
| J01 | catalog_object/revision/route/link, publication_entry; planned versus reviewed visibility | P10/P11 navigation and retirement states |
| J02 | lesson_practice links, exercise_revision numeric key, question_revision, practice_response; anonymous state transient | P15/P17 original case, error-specific feedback and solution exposure |
| J03 | path_revision, scoped memberships/preparation, diagnostic reference, course gates/projects, enrollment | P12/P14 narrow R1 versus whole path and shared lesson semantics |
| J04 | resource_revision, identifiers/locators, assignment_revision/topic/claim joins, verification | P12 exact scopes, unknown cost and dead-link states |
| J05 | public_search_document keyed by manifest, safe fields/filters and typed tags | P10/P12/P20 no private/key/draft results, tied sort/pagination |
| J06 | account/email uniqueness, auth_token consumption, roles and generation | P13 race/verification/duplicate-safe response |
| J07 | framework sessions/challenges, account status/generation, credentials/throttle | P13/P19 logout all, WebAuthn, disabled principal |
| J08 | hashed purpose tokens with target email/generation, account lock | P13/P19 single consumption/reset race |
| J09 | enrollment_requirement/progress/equivalence/evidence_recheck; frozen denominator | P14/P18 18/36 under a37-topic version and explicit migration |
| J10 | bookmark owner/object unique key and retired stable identity | P14/P19 idempotence and other-owner rejection |
| J11 | private_note owner/object and optimistic lock; no audit body | P14/P19 conflict, deletion, private export and session changes |
| J12 | immutable quiz/question/form/exposure/attempt/answer/result, remediation and request queue | P15/P17 threshold/critical/freshness/forged question/duplicate submit |
| J13 | course_project, project_revision/fields/work/responses/rubric; distinct self-review evidence | P15/P17 partial save, signed ledger and no mastery upgrade |
| J14 | draft_head, review_decision hash, sealed revisions, active publication and safe search projection | P16/P18 reviewer authorization, atomicity, rejection and stale base |
| J15 | import runs/proposals, source mappings, verification/rules/withdrawal/impact/recheck | P09/P16 preservation, stale rules and rollback overrides |
| J16 | privacy_request, ownership FKs, retention jobs, minimal recovery journal | P13/P19/P21 owned-only exports, erase and restore without resurrection |
| J17 | plain/structured content and ordered semantic fields, accessible authored Markdown/versioned feedback; no DB-only accessibility claim | P06/P18 rendered keyboard/screen-reader/zoom/theme/offline journeys |

Ratings/moderation have no R1 schema because P02 consciously defers them to FUT-01. Chapters add no present learning value and are omitted; the extensible kind/membership migration path is documented. Public unfinished tools, brokerage credentials, live trading, code execution and file uploads remain absent.

## Official technical evidence read

Verified selected sections on23 September2026. These sources support PostgreSQL mechanics; the schema, retention policy and performance budgets are project design decisions, not vendor guarantees.

| Official PostgreSQL18 source | Read scope / use |
|---|---|
| [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) | Cross-row CHECK limitations, unique/null behavior, foreign keys and delete actions; informs typed FK/trigger split |
| [Recursive queries](https://www.postgresql.org/docs/18/queries-with.html) | Recursive traversal and cycle detection; informs candidate-graph validation |
| [Date/time](https://www.postgresql.org/docs/18/datatype-datetime.html) | timestamptz/zone behavior; explicit market zone separate from event instant |
| [Isolation](https://www.postgresql.org/docs/18/transaction-iso.html) | Concurrent snapshot/write behavior and retries; short locked transactions |
| [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html) | Row/advisory locks and deadlocks; graph serialization and common lock order |
| [EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) | Estimated versus actual execution, ANALYZE behavior; no invented plans |
| [Text-search indexes](https://www.postgresql.org/docs/18/textsearch-indexes.html) | GIN/GiST lookup tradeoffs; simple public search proposal |
| [Partial indexes](https://www.postgresql.org/docs/18/indexes-partial.html) | Predicate matching and query implications; active queues/withdrawals |
| [Range types](https://www.postgresql.org/docs/18/rangetypes.html) | Inclusive/exclusive/unbounded ranges and constraints; unknown validity is not infinity |
| [btree_gist](https://www.postgresql.org/docs/18/btree-gist.html) | Scalar operator classes with GiST exclusion, extension installation; current certification nonoverlap |

## Exit assessment

The design gate requires all of the following, checked by semantic review plus the offline validator:

- Every actual canonical collection/record/top-level field has an explicit application/archive disposition; full original artifacts preserve byte-level provenance and supplemental prose.
- Stable IDs, bounded typed relationships, ordering, temporal unknowns, retirement and owner erasure have consistent specifications; there are no unconstrained polymorphic business references.
- Publication is separate from editing/verification/learner evidence; imports cannot delete learner data or auto-publish; quiz attempts and progress denominators are version-pinned.
- P02's17 journeys have named persistence/transaction boundaries; edge cases have implementation-test owners. No future empirical proof is marked as passed.
- Migration groups can be applied incrementally after table/key targets exist, with late cross-group FKs before runtime grants. PostgreSQL-specific invariants have required real-database tests.

Final automated outcome is recorded in p04-validation.json. Passing it establishes design package/reference coverage, **not** database runtime readiness. P05 may define APIs against this contract after PASS. P08 must implement/test constraints/migrations; P09 proves real imports/round-trips; P15/P17 establish learning/scoring behavior; P19/P21 prove erasure/recovery. U01–U06 remain launch inputs rather than guessed operator preferences. No unresolved routine schema choice is deferred to an accidental implementation default.
