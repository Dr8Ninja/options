# P10 — public catalog and search review

27 September 2026. **P10 exit gate passes locally.** The 23 public content operations execute against approved PostgreSQL publication snapshots. The persistent local import remains draft-only. P11 is next only when requested; this is not a public-course or production-release approval.

## Implemented boundary

Program/phase/module/topic/subtopic hierarchy, finite prerequisite and competency references, exact resource assignments/library, learning paths, project/capstone/exercise/quiz descriptions, search, facets, content version and route resolution use closed DTOs through a public service and explicit JDBC projections. No persistence entities, arbitrary revision override, draft switch, protected form/question/answer body, private learner record or administrative payload is serialized. Protected quiz/exercise entries have a description projection only; attempt/practice/enrollment/self-review remain unavailable.

V0021 adds frozen canonical routes, activation history, exact filter membership and a shared random cursor signing key, using the existing GIN-indexed public search table. Search weights are title 1, author .4, tags .2, summary .1, with exact ID/title precedence, rank normalization 32 and normalized title/ID ties. Browse sorts are allowlisted server expressions; user values are bound parameters. Repeated filter values OR within a name and AND across names; unsupported names/sorts, repetition, bounds and unavailable values fail consistently. Browsing uses signed, expiring, generation-bound keysets; ranked search is bounded to pages 0–99 and limits 1–50.

Only activated, approved versions feed reads. Draft slug changes cannot change public routes; previous approved URLs resolve through frozen publication history. Unknown/never-public content is 404, retired/withdrawn detail is 409, empty collections are 200, and no initial publication is 503 with Retry-After. Never-public relationship titles are omitted; prior public references can retain explicit unavailable/retired metadata. Safety changes invalidate generations and cursors; timed certification/withdrawal boundaries are rechecked after snapshot assembly. Rule notices reveal approved IDs and eligibility metadata, never rule values. Every dynamic response is no-store; public reads create no session and do not vary their content by principal.

## Executed gate

| Check | Actual outcome and evidence |
|---|---|
| Full Java verification | [47 tests](backend-tests.json): 2 unit/architecture plus 45 PostgreSQL integration, zero failures/errors/skips. PublicCatalogIT contributes 12 tests; prior importer/security/persistence suites remain passing. |
| Actual API contract | [140 captured HTTP responses](api-examples.json), all validated against OpenAPI including field closure, formats, errors, no-store and no session cookie. All 23 public operations are exercised. |
| Runtime generated contract | 24 public/CSRF operations match P05/P10 operation IDs and closed response DTO properties/required sets; health is separately documented. |
| Adversarial behavior | Malformed/unknown filters/sorts, intersections, empty results, all browse sort cursors, page limits, cursor tampering/expiry/version change, missing/draft/private records, hidden relationships, stale certification, retired/withdrawn records and approved URL changes pass. Protected key/scope sentinels never appear in responses/search. |
| Authorization | Real anonymous protected requests denied; public HEAD/read-only method handling passes. An authenticated ADMIN/EDITOR principal receives the same public DTO and cannot open protected unimplemented routes. This principal-injection test does not claim the P13 login workflow exists. |
| Canonical scale | [Query timings and EXPLAIN ANALYZE plans](query-behavior.json), [activation queries](activation-queries.json), [activation membership plan](activation-membership-plan.json). Actual P09 importer loads all 2,851 canonical identities; safe synthetic adversarial additions yield 2,462 indexed public test records. |
| Local runtime | [V0021 deployment to existing local backend](local-runtime.json): 111 tables, all 2,851 drafts preserved, zero publications/accounts/reviews/certifications/search rows. Trusted local-CA HTTPS public reads return 503, protected reads 401, health 200. JAR includes V0021 and excludes test fixtures. Four desktop/mobile browser cases pass. |
| Other checks | [Validation record](validation.json): recursive upstream contracts, 85 preserved inputs, all 21 migration checksums, frontend format/lint/types/generated contracts/12 tests, Python utility checks, dependency policy and Java/npm/secret scans pass. |

The API tests use real HTTP requests and disposable PostgreSQL 18.6, with the actual P09 importer and explicitly synthetic approvals. They do not use mocked catalog bodies or publish/certify persistent source content. The authenticated-principal comparison additionally uses Spring MockMvc against the real application and database. Full importer verification still checks its 14 substantive import/recovery scenarios.

Warm point measurements: publication activation **515 ms**; 50-topic response **18 ms**; search **55 ms**; filtered resources **73 ms**; facets **22 ms**; module detail **23 ms**. Topic limit 1 and limit 50 both execute **four top-level SELECTs**, plus one `SET LOCAL` setup statement. Relationship/assignment assembly uses batched queries, with no recursive entity serialization. EXPLAIN search/filter execution measured 19.197/51.118 ms. PostgreSQL can prefer a sequential scan at this small cardinality despite the available GIN index. These single-run local results establish representative canonical behavior, not concurrent production p95, availability or capacity; P20 retains that gate.

## Reproduction and findings resolved

Use pinned local tools in README/TESTING. Executed commands include:

```sh
./backend/mvnw -f backend/pom.xml -B spotless:apply verify
python scripts/check-implemented-api.py
python scripts/check-public-api.py
python scripts/validate_frontend_design.py
python scripts/verify-preservation.py
python scripts/check-migration-history.py
python scripts/check-dependency-policy.py
npm --prefix frontend run check
npm --prefix frontend audit --audit-level=high
docker compose -f infrastructure/compose.yml -f infrastructure/compose.full.yml up -d --build backend
python scripts/wait-ready.py
npm --prefix frontend run test:e2e
.local/tools/gitleaks/gitleaks dir --redact --config .gitleaks.toml .
.local/tools/trivy/trivy sbom --severity HIGH,CRITICAL --exit-code 1 backend/target/classes/META-INF/sbom/application.cdx.json
```

Actual outputs are summarized in this directory; full disposable reports/captures regenerate under backend/target. CI runs the contract validator and retains P10 evidence. No hosted CI execution is claimed.

Observed failures were fixed and rerun: PostgreSQL collation spelling; temporary-path resolution in the real importer fixture; test lifecycle/admin connection timeout assumptions; scalar enum validation and descriptive label schemas; exact assignment status/scope mapping; migration/table count expectations; draft route changes leaking into public navigation; stale-rule eligibility; and repeated expanded view plans causing slow activation and a post-publication assignment timeout. Activation and public reads avoid unnecessary JIT; assignment joins reuse a materialized safe eligible set. The complete final run passed after the timeout fix. No ignored test, H2 replacement, weakened answer-key assertion or persistent test publication closes this gate.

The upstream validator initially rejected the living SECURITY.md clarification as historical document drift. [The explicit amendment](document-amendments.json) preserves its original P03 hash and records the new hash/reason/decision; the validator now verifies that chain and still rejects undocumented drift. [Migration history](migrations-sha256.json) accepts only the new V0021; V0001–V0020 remain unchanged. Secret scanning reviewed only existing example UUIDs shifted by documentation lines and recorded file hashes; .gitleaksignore has exact fingerprints, no live credential exemptions.

## Remaining stage boundaries

The frontend remains the P07 preparation shell; generated types are ready for P11/P12 integration. Persistent drafts correctly produce 503 until a later authorized review/publication. P13 identity workflows, P15 scoring/practice, P16 publication/editor workflows and P17 reviewed lessons are not implemented by P10. Resource transport checks remain UNKNOWN when no separate transport evidence exists. Reference array overflow fails closed rather than truncating; future editorial publication UX must reject unsupported shapes before activation. Operational certification is not inferred from an imported rule observation. Full concurrency/load, assistive technology, privacy/security release review and independent recovery remain P18–P21. No external message, production deployment, lesson certification or remote push occurred.
