# Prioritized project backlog

Updated 1 October 2026 after P12. P01–P06 design contracts and P07–P12 local foundation/persistence/import/public API/reading/discovery gates pass. **Public APIs serve approved snapshots; local canonical content remains unpublished drafts, with no reviewed public course or learner workflows.** Next eligible assignment: **P13**, only when requested. P17 must later author the release, and P22 is a separate authorized deployment.

The normative scope is [PRODUCT_REQUIREMENTS](../product/PRODUCT_REQUIREMENTS.md), [CONTENT_RELEASE_PLAN](../product/CONTENT_RELEASE_PLAN.md) and [REQUIREMENTS_TRACEABILITY](../product/REQUIREMENTS_TRACEABILITY.md). Priority means sequencing/impact, not permission to skip the prompt gates. An unchecked item is future work, not an implementation claim.

## Completed planning and evidence

- [x] P01: reconcile originals, canonical design, 70 module dossiers, seven paths, twelve project specifications, 96 resource records and three canonical review passes; preserve all 1,019 original topics.
- [x] P02 entry: rerun inventory/canonical/source/link checks and capture [P01 entry evidence](../product/evidence/p01-entry-check.json); preserve all publication exclusions.
- [x] P02: specify 40 product requirements, 17 observable journeys, exact 36-topic R1 foundation course, six gate packs, manual dossier, quality budgets and source dispositions. Readiness is specification only.
- [x] P03 / B01: [architecture](../engineering/ARCHITECTURE.md), [security](../engineering/SECURITY.md), six ADRs, current official-source evidence, five request/context diagrams, all 40 requirement allocations and a dated reference cost model. No runtime verification, purchase or deployment claimed.
- [x] P04 / B02: [relational design](../engineering/DATABASE.md), three ERD views/data dictionary, all 22 canonical collections/245 fields mapped, supplemental artifacts preserved, versioned assessments and owner privacy, lifecycle/import and eight migration groups; [design evidence](../engineering/evidence/p04-review.md). No database migration/import/query execution claimed.

- [x] P05 / B03: [API contract](../engineering/API.md), [OpenAPI](../engineering/openapi/openapi.json), exhaustive role/owner matrix, canonical request/response examples and 35 runtime contract-test cases mapped to J01–J17; offline schema/policy/negative gate passed. No endpoints or runtime tests implemented.

- [x] P06 / B04: [frontend contract](../engineering/FRONTEND.md), [responsive prototype](../../design/README.md), light/dark tokens, component/state specifications, J01–J17 accessibility/visual acceptance and passing browser/offline evidence. P05 prerelease 1.0.1 closes existing discovery/capstone gaps. No application or real AT conformance claimed.

- [x] P07 / B05: secured Spring/Next foundations, JDBC session migration, same-origin HTTPS local stack, reproducible builds, typed API/tokens, checks/CI and documented startup/shutdown. See [P07 review](../engineering/evidence/p07/REVIEW.md); no feature or production readiness claim.

- [x] P08 / B06: Flyway V0001–V0015, typed constraints, immutable versions, owner-scoped repositories, retention and role separation; 34 backend tests on real PostgreSQL plus query-plan evidence. See [P08 review](../engineering/evidence/p08/REVIEW.md). No canonical import or feature journey claimed.

- [x] P11: live server-rendered public reading and SEO; restricted authored rendering; real PostgreSQL browser gate, accessibility/screenshots, production build and protection checks pass. See [review](../engineering/evidence/p11/REVIEW.md).

- [x] P12: live filtered library/search, resource details, shared-module paths and project preparation; real-stack discovery and reading regression gates pass. [Review](../engineering/evidence/p12/REVIEW.md). P13 not started.

## P0 — Completed design prerequisites

| Backlog ID | Work and dependency | Owner prompt | Done when / requirements |
|---|---|---|---|
| B01 — complete design | Supported architecture, auth, rendering, tooling and editorial authority; [P03 evidence](../engineering/evidence/p03-review.md) | P03 | Documentary gate passed; runtime, capacity and recovery proof explicitly assigned to later prompts |
| B02 — complete design | Relational identity/content/version/assessment/ownership lifecycle, partial-course versus whole-module semantics, retention/export/deletion | P04 | Design gate passed; actual PostgreSQL constraints/transactions P08, import/round-trip P09, privacy/recovery P19/P21 |
| B03 — complete design | Public/private/admin/assessment contracts, safe DTOs, exact discovery, feedback, publication and owner policies | P05 | Offline contract gate passed; real enforcement and CT01–CT35 remain P07–P21; REQ-10/11/13/35 |
| B04 — complete design | Responsive learning/editor UX, both themes, full states and WCAG 2.2 AA plan | P06 | 35 route families map J01–J17; 380 responsive checks, 36 axe samples, 32 interrupted states and 20 interactions pass; real AT/full-process acceptance remains P18 |

## P0 — R1 implementation and authoring blockers

| Backlog ID | Work and dependency | Owner prompt | Done when / requirements |
|---|---|---|---|
| B05 — complete foundation | Reproducible repository/runtime/test/CI/security foundation; [P07 evidence](../engineering/evidence/p07/REVIEW.md) | P07 | Real PostgreSQL/HTTPS shell, 9 Java tests, 12 frontend tests, 4 stack browser cases and 1 WebAuthn compatibility case pass; version amendments recorded; hosted CI and feature journeys not claimed |
| B06 — complete persistence | Incremental migrations, persistence, constraints and ownership queries | P08 | Empty-database and real PostgreSQL tests pass; REQ-19/20/28/30 |
| B07 — complete import | Validated importer, dry-run/conflicts/retirement/export, stable references and all supplemental structures | P09 | 35 backend tests, 14 import scenarios and local replay/export pass; [P09 evidence](../engineering/evidence/p09/REVIEW.md); REQ-02/28 |
| B08 — P10–P12 complete | Public APIs, reading/SEO, filtered resource library, search, paths and projects | P10–P12 complete | [P12 evidence](../engineering/evidence/p12/REVIEW.md): 47 backend tests, 29 frontend tests, 6 discovery journeys, 5 reading regressions and 4 local smoke cases pass. No canonical drafts published; REQ-02/04–12/36 |
| B09 | Signup/verification/login/logout/recovery, privileged security, ownership and account lifecycle | P13 | J06–J08/J16 and isolation tests; local mail behavior verified; no unauthorized external messages |
| B10 | Progress/bookmarks/private notes/dashboard/recommendations and version-change behavior | P14 | J09–J11 pass across devices and failures; REQ-19–23 |
| B11 | Scored gates, practice/solution release, exhausted-bank request queue and self-reviewed dossier | P15 | J12/J13 pass; server scoring, pinned versions, clear evidence labels; REQ-24–26 |
| B12 | Editorial draft/review/preview/publish, role management, import conflicts, freshness/correction queues and version withdrawal | P16 | J14/J15 pass, author/reviewer attribution honest, review evidence mandatory; REQ-27–29 |
| B13 | R1-B1: F01–F06 plus diagnostic, worked cases and gate forms | P17 after P16 | Exact canonical IDs and CR-01–CR-07 for batch; no current topic is already a reviewed lesson |
| B14 | R1-B2: F07–F12, contract rights/units and gate | P17 after B13 | Same batch gate; current scope remains planned |
| B15 | R1-B3: F13–F18, styles/lifecycle/assignment and gate | P17 after B14 | Sources reviewed at exact section, embedded role/carry primers usable |
| B16 | R1-B4: F19–F24, early/mismatched assignment, cash and quotes | P17 after B15 | Safe synthetic events, no current operational cutoff assumed |
| B17 | R1-B5: F25–F30, execution costs/margin/long options | P17 after B16 | Independent numeric checks, non-fill and margin failure cases |
| B18 | R1-B6: F31–F36, short obligations, covered call, expectancy, sizing and reconciliation | P17 after B17 | Probability bridge, gate and original dossier complete |
| B19 | R1 integration: 36 lessons, 72 practice/transfer prompts, 120 gate items, dossier, sources/rights and accessible full journey | P17 after all batches | CR-01–CR-08 met; estimates reviewed; all existing exclusions retained or supported by new evidence |

## P0 — Release verification and operations

| Backlog ID | Work | Owner prompt | Done when |
|---|---|---|---|
| B20 | Integrated real-stack QA, content, browser and accessibility review | P18 after CR gate | J01–J17 and all required checks pass; no inaccessible required journey |
| B21 | Security/privacy, account/data isolation, retention/export/delete and actual processor review | P19 | No known critical/high findings; U02/U03 resolved for intended publication |
| B22 | Measure realistic load/browser budgets, SEO, private cache isolation and publication invalidation | P20 | REQ-33/36 targets met with reproducible evidence; no invented field metrics |
| B23 | Containers/CI/artifact manifest, trusted proxy chain, secrets/config, sanitized monitoring, independent encrypted backup/deletion ledger and timed restore | P21 | REQ-34 recovery rehearsed; ADR-006 prices/region/retention rechecked, support coverage and WebAuthn operator recovery explicit |
| B24 | Requested staging/production deployment and authorized delivery/smoke checks | P22 only with explicit target/budget | Actual release record/URL, critical flows, health/backups and rollback verified |

## P1 — Curriculum expansion retained after R1

| Backlog ID | Scope | Owner / dependency | Completion boundary |
|---|---|---|---|
| B25 | Finish full beginner path, behavioral/process lessons, retail mechanics/verticals and funding cases | Repeated P17 via L1 plan | PATH-BEGINNER complete only when every required module/assessment is ready |
| B26 | Math/Python, pricing/Greeks, volatility measurement and PR01–PR05 | Repeated P17 L2, prerequisite-ready batches | Reviewed implementations and numerical exercises; no automatic hosted tools |
| B27 | Volatility/surfaces/hedging/VRP/events/backtests and PR06–PR10 | Repeated P17 L3 after foundations/coding/data rights | Full methods, realistic costs, temporal validity and uncertainty; no edge guarantee |
| B28 | Market making/execution/portfolio capital, dispersion/dealer inference, exotics, historical cases, PR11/PR12 and C01–C07 | Repeated P17 L4 | Recheck professional lenses, implementations and transfer evidence |
| B29 | India/global operational lessons: NSE/NCL/SEBI/BSE masters, later circulars, fees/margins/restrictions, CAS/algo scope | P17/P23 exact rule chains | Current facts must be verified for instrument/date; no universal lot/expiry/tax constants |
| B30 | R56 headline conflict, R58 wording/primary-law chain, exact VIX methodology, detailed 2020 sources and inaccessible advanced sections | P17/P23 targeted lawful research | Resolve with appropriate evidence or retain exclusion; never substitute a lookalike/abstract |
| B31 | Reassess all topic authoring, resource sections, accessible alternatives and data entitlements | P17/P23 | Full canonical queue remains visible; R1 completion is not project completion |

## P2 — Explicit future feature backlog

No row below has a working R1 navigation item, API promise or collected personal dataset. Each requires a bounded P23 extension brief, then proportionate P02–P22 gates if implementation is requested.

| Backlog ID | Feature and reason for deferral | Required dependency / acceptance before inclusion |
|---|---|---|
| FUT-01 | Resource ratings/reviews and moderation: quality cannot be inferred from popularity; moderation capacity unknown | Verified-account uniqueness, editable ratings, honest aggregate counts, abuse limits, queue, appeals/removal and privacy; no stars in R1 |
| FUT-02 | Flashcards and spaced repetition: lesson and assessment quality comes first | Authored retrieval items, scheduling rationale, accessibility, version/retirement handling, opt-in reminders |
| FUT-03 | Trading journal: private financial records add sensitive scope beyond learning notes | Explicit fields/retention/export/ownership, process-versus-outcome labels; no brokerage import by default |
| FUT-04 | Payoff calculator/visualizer | Contract/cash/assignment conventions, multi-leg tests, accessibility and independent numeric checks; not just a terminal diagram |
| FUT-05 | Greeks and BSM tools | Verified model/units/time/dividend conventions, finite-difference/bound tests and limitations; no trade advice |
| FUT-06 | Historical/implied/forward volatility tools | Measurement conventions, solver/surface validation, lawful data and uncertainty; no yfinance entitlement assumption |
| FUT-07 | Strategy builder | Exposure/assignment/funding/cost modeling and usable teaching; no suitability or profitability promise |
| FUT-08 | Paper-trading workspace and historical simulation exercises | Realistic costs/fills/margin/assignment, rights, event-time controls and simulation labels; no live order routing |
| FUT-09 | Learning/trading analytics | Specific justified question, consent/minimization/retention/bias plan; R1 keeps only necessary progress and operational metrics |
| FUT-10 | Formal project submission/reviewer grading, uploads or hosted notebooks | Staffing, rubric calibration, storage/security/scanning/limits; arbitrary user code execution excluded from R1 |
| FUT-11 | Google/GitHub social login | Demonstrated learner need, identity linking/recovery/ownership and privacy review |
| FUT-12 | Translation, native apps and offline synchronization | Content/review capacity, accessibility and cross-device conflict/retention design |
| FUT-13 | Monetization/certificates/community features | Separate user-approved scope, credible claim/payment/privacy/moderation requirements; no invented business model |

## User-dependent inputs, not assumed preferences

U01 budget/operations/region; U02 operator/territories/eligibility/legal review; U03 supplied-material rights; U04 accountable editorial/assessment-maintenance roles; U05 support/email identity and authorized delivery recipients; U06 brand/domain/launch target. Their precise gates and safe planning positions are in REQ-40. They do not block local P03 exploration, but dependent launch decisions remain open. Do not create paid services, send external messages or deploy while merely filling this backlog.
