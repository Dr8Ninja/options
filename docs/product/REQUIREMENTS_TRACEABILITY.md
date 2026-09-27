# Requirements traceability

P02 · 22 September 2026 · contract 1.0. This is an assignment/verification matrix, not an implementation-completion report. Every REQ ID is defined in [PRODUCT_REQUIREMENTS.md](PRODUCT_REQUIREMENTS.md); CR IDs and the selected topics are in [CONTENT_RELEASE_PLAN.md](CONTENT_RELEASE_PLAN.md). R1 includes MAP and OPERATIONS obligations where indicated. LATER work remains visible in [TODO](../project/TODO.md).

## Source keys and interpretation

- **MB**: [master chat-brief record](../../sources/prompts/00-master-project-brief.md), a structured summary, not a verbatim transcript. Line numbers below refer to this preserved record.
- **RD**: [archived deep-research prompt](../../sources/prompts/01-deep-research-original.md), all 17 steps plus rules/final outcome.
- **PB**: [archived production-build prompt](../../sources/prompts/02-production-build-original.md), all 33 numbered sections plus core rule.
- **SP**: [shared working prompts](../../PROMPTS.md), Shared instructions and P01–P23. Latest P02 user instructions agree with the working P02 and govern this assignment.
- **G/RQ/Q**: [25 gaps](../../research/registers/gaps.json), [15 research questions](../../research/registers/questions.json), and the [29 original observations with P01 dispositions](../../research/evidence/p01-ledger.json). They retain evidence scope; one observation is not a fully verified source.

Rows group related source bullets without dropping them. Proposed technologies, entities and navigation in the archived build prompt are alternatives to evaluate, not already chosen implementations. “Inherited P01” means design evidence exists; lesson/publication work still belongs to P17. The original live-trading practice suggestion is consciously excluded under the newer P01/shared educational-only instruction. All promised advanced subject matter stays in the map and later authoring plan.

## Requirement ownership and planned validation

This is the forward implementation matrix. Each requirement appears here once; the source matrices below supply backward provenance. All validation is planned except the explicitly recorded P01/P02 document checks.

| Requirement | Release assignment | Planned prompt owner | Observable validation / evidence |
|---|---|---|---|
| REQ-01 | R1 educational scope | P06/P11/P17/P19 | J01/J13, copy and navigation audit, no broker/live-money dependency |
| REQ-02 | R1 MAP and publication separation | P04/P09/P11/P16/P17 | J01/J03, imported IDs/readiness, public payload and counts audit |
| REQ-03 | R1 roles and separation | P03/P05/P13/P16/P19 | Role/ownership matrix, missing-review denial and honest same-person attribution, privileged second-factor tests |
| REQ-04 | R1 home/navigation | P06/P11/P12 | J01, three-link entry, no nonworking tools/navigation |
| REQ-05 | R1 hierarchy/details | P04/P06/P10/P11 | J01/J03, deep links, list/diagram parity, retirement/redirect tests |
| REQ-06 | R1 teaching | P15/P17/P18 | J02, CR-01/02/07, independent example review and external-source outage |
| REQ-07 | R1 lesson prerequisites | P04/P09/P14/P17 | J03/J12, CR-04, placement/bridge tests and canonical graph preserved |
| REQ-08 | R1-FND + seven MAP paths | P04/P12/P14/P17 | J03, versioned denominator, no false full-path completion |
| REQ-09 | R1 dossier + project/capstone MAP | P12/P15/P17 | J13, twelve specs/seven capstones retained, readiness labels |
| REQ-10 | R1 library | P05/P10/P12/P17 | J04, metadata/unknowns/combined facets/order/pagination |
| REQ-11 | R1 search | P05/P10/P12/P20 | J05, relevance fixtures, shareable state, draft/private exclusion |
| REQ-12 | R1 evidence/rights | P09/P16/P17/P19 | J04, CR-03, assignment provenance and no restricted redistribution |
| REQ-13 | R1 all states | P05/P06/P10/P13/P14/P15/P16/P18 | J01–J17 error/offline/loading/conflict/expiry fixtures |
| REQ-14 | R1 accessibility | P06/P17/P18 | J17, WCAG matrix and manual full-process evidence |
| REQ-15 | R1 responsive/themes/browser support | P06/P11/P18 | Actual browser/version matrix, screenshots, keyboard/screen-reader review |
| REQ-16 | R1 signup/verification | P03/P13/P19 | J06, local mail tests, input/role/duplicate/token boundaries |
| REQ-17 | R1 login/logout/security | P03/P13/P19 | J07, two-device revocation, cache/expiry/throttle/privilege tests |
| REQ-18 | R1 recovery/account maintenance | P13/P19/P22 | J08, single-use expiry, mailbox failure, authorized deployed delivery |
| REQ-19 | R1 ownership/preferences | P04/P05/P13/P14/P15/P19 | Two-user read/list/count/write/delete/export and cache isolation |
| REQ-20 | R1 persistent progress | P04/P14/P15 | J09/J15, completion-versus-mastery and content migration fixtures |
| REQ-21 | R1 bookmarks | P14/P19 | J10, repeat requests, retired targets, ownership |
| REQ-22 | R1 private notes | P04/P14/P19 | J11, optimistic conflict, unsaved text, length/rendering/deletion |
| REQ-23 | R1 dashboard/recommendations | P14/P18 | J09, deterministic next-step reasons and complete/no-eligible states |
| REQ-24 | R1 scored gates | P04/P05/P15/P17/P18 | J12, independent scoring, critical override, protected/pinned answers |
| REQ-25 | R1 manual exercises | P15/P17/P18 | J02/J12, 72 practice/transfer cases and solution-view evidence labels |
| REQ-26 | R1 self-reviewed dossier; formal grading LATER | P15/P17; later P23 | J13, rubric labels, text/numeric submission, no upload/runtime |
| REQ-27 | R1 editorial workflow | P03/P05/P16/P17/P18 | J14, recorded review approval, publication validation and audit |
| REQ-28 | R1 import/concurrency/version recovery | P03/P04/P09/P16/P20 | J15, idempotent/atomic import, conflicts, learner preservation/invalidation |
| REQ-29 | R1 freshness/corrections | P16/P17/P21; ongoing P23 | J15, stale/conflicting/broken evidence, withdrawal and learner recheck |
| REQ-30 | R1 privacy/retention | P03/P04/P13/P19/P21 | Collection/log review, timed retention jobs, no resurrection after restore |
| REQ-31 | R1 export/deletion | P04/P13/P19/P21 | J16, isolated export, expiry, live/backups erasure and receipt |
| REQ-32 | R1 operational measurement; learning analytics LATER | P07/P19/P20/P21; later P23 | Network/log inspection, aggregate performance metrics only |
| REQ-33 | R1 performance/scale | P03/P10/P20 | Representative load and browser traces under stated conditions |
| REQ-34 | R1 OPERATIONS | P03/P21/P22 | Measured isolated restore, RPO/RTO, uptime/alert and deployed checks |
| REQ-35 | R1 security | P03/P07/P13/P16/P19 | Threat-boundary tests, sanitized errors, no known critical/high defects |
| REQ-36 | R1 SEO | P03/P06/P11/P20/P22 | Rendered content, canonical/OG/sitemap/robots, no private/stub indexing |
| REQ-37 | R1 engineering/quality/operations | P03–P22 | Real database/full-stack/build/CI/container/release evidence, six review lenses |
| REQ-38 | R1 exact content gate | P17/P18 | CR-01–CR-08, 36-topic and prerequisite/assessment reconciliation |
| REQ-39 | LATER features; R1 omission is deliberate | P02 scope; P23 extension briefs | No dead navigation, explicit TODO rows, no preemptive personal-data collection |
| REQ-40 | R1 decision/change control | P03/P06/P16/P19/P21/P22 as applicable | U01–U06 resolved at their named gates, written revisions rather than invented preferences |

## Master brief reconciliation

| Trace ID / source | Preserved requirement | Requirement IDs / disposition | Owner and validation |
|---|---|---|---|
| MB01 · MB L7 | Serious beginner-to-professional educational system: order, resources, exercises, understanding, eventual public production | REQ-01/06/08/38; R1 foundation + complete MAP + LATER professional instruction | P17/P18/P22; CR gates and honest path-completion audit |
| MB02 · MB L11 | Full original inventory, skepticism, coverage/conflicts/duplicates/sequence, removal with provenance | REQ-02/07/12/28; inherited P01, retained by R1 import | P09; source/ID/relationship parity and safe retirement |
| MB03 · MB L13 | Deep primary/academic/practitioner/video/library research and repeated professional reviews | REQ-12/29/38; P01 design, section review for R1 and later batches | P17/P18/P23; evidence/read-scope and affected review records |
| MB04 · MB L15 | All contract, microstructure, payoff, Greeks, pricing, volatility, hedging, math/Python, risk, psychology, professional/exotic and historical domains | REQ-02/08/09/38; complete MAP, selected R1, remainder LATER | P17 by wave; full canonical checklist retained, no false completeness |
| MB05 · MB L17 | Global and India contracts, changing expiry/lots/settlement/fees/margins/restrictions as dated facts | REQ-12/29/38; R1 principles, current-rule details excluded pending verification | P16/P17/P23; rule chain/effective-date/quarantine tests |
| MB06 · MB L19 | Useful hierarchy; module design/objectives/prerequisites/practice/mastery/time; seven shared paths | REQ-05/07/08/20/24/38; MAP + R1, no empty chapters | P04/P12/P17; reuse, graph and module detail checks |
| MB07 · MB L21 | Complete resource identity/access/effort/rationale/priority/geography/verification metadata; separate code/data/research; reliable seeds | REQ-10/12/28/37; R1 | P09/P12/P17; metadata and exact-assignment/import audit |
| MB08 · MB L25 | Browse/search/paths/progress/bookmarks/notes/quizzes/exercises/projects/next lesson/admin and explicit ratings | REQ-04–11/16–29/39; core R1, ratings LATER | J01–J16; P10–P18 and later P23 ratings contract |
| MB09 · MB L25 | Flashcards/spaced repetition, journal, calculators/visualizers, builder, paper trading and analytics | REQ-39; LATER except R1 fixed synthetic dossier and necessary progress metrics | P23 bounded briefs; TODO future-feature rows and no dead nav |
| MB10 · MB L27 | Java/Spring mandatory; justified frontend; favor PostgreSQL/Flyway, proper relational relationships; avoid microservices/JSON blobs | REQ-37/40; R1 engineering, selection remains P03/P04 | Architecture decision records and schema review, no P02 preselection |
| MB11 · MB L29 | Layering/DTO/validation/errors/pagination/security/log/config; evaluate listed Spring/OpenAPI/testing/container tools; secrets/CSRF/CORS/limits/health/CI/recovery | REQ-13/19/33–35/37; R1 | P03–P10/P19/P21; contract, negative-security and operations checks |
| MB12 · MB L31 | Premium accessible responsive design, mobile, typography, themes, meaningful public learning UX and SEO | REQ-04–06/14/15/36; both themes R1 | P06/P18/P20 visual, keyboard, rendering and indexing evidence |
| MB13 · MB L33 | Mandatory backend/frontend/PostgreSQL/integration/E2E, security/accessibility/performance, deployment preparation and recovery | REQ-33–37; R1 and OPERATIONS | P18–P22 with actual evidence, no mocked readiness claim |
| MB14 · MB L37 | Sixteen-phase order, prerequisite artifacts before dependent work | REQ-37/40; refined P01–P23 sequencing | Stage gates; importer deliberately before feature APIs/UI |
| MB15 · MB L39 | Living named documents, durable handoff, recurring professional-expectations question | REQ-12/27/37/40; R1 and later maintenance | Execution log/TODO/decisions, P17/P18/P23 review evidence |

## Archived research prompt reconciliation

| Trace ID / exact source section | Requirement retained or consciously refined | Requirement IDs / release | Planned owner / validation |
|---|---|---|---|
| RD01 · Step 1 L15–40 | Extract every source/section/module/topic/subtopic/resource/author/URL/difficulty/prerequisite/duplicate/note without information loss | REQ-02/12/28; inherited P01, R1 import | P09 source snapshots/mappings and round-trip |
| RD02 · Step 2 L41–65 | Source-by-domain coverage, ratings, missing/outdated/duplicate items and recommendations | REQ-02/12/38; P01 preserved | P17/P18 use coverage/readiness; no outline-to-lesson promotion |
| RD03 · Step 3 L66–97 | Authoritative exchanges/regulators, journals/textbooks/preprints/universities/practitioners/brokers/libraries; research until diminishing returns | REQ-12/29/38; selected R1 and later evidence | P17/P23 exact-section and exclusion logs |
| RD04 · Step 4 L98–120 | Twelve expert/learner review perspectives | REQ-38/37; P01 lenses preserved, affected reviews later | P17/P18; one agent is not twelve independent experts |
| RD05 · Step 5 L121–152 | Competency graph before modules; no unsupported prerequisites | REQ-07/08; R1 narrow graph, full MAP | CR-04 and P09 graph/reachability tests |
| RD06 · Step 6 L153–184 | Useful progression from foundation through professional topics without forcing ten levels | REQ-05/08; five existing phases, R1 view | P12/P17 map and progression audit |
| RD07 · Step 7 L185–261 | Module ID/title/level/time/prerequisites/tags; measurable objectives, concepts, math, prioritized readings, practical/computational exercises, mastery/mistakes | REQ-05/06/07/10/24/25/38; MAP + R1 | P17 CR-01/02/03/05; full module metadata retained |
| RD08 · Step 8 L262–323 | Evaluate named books, academic material, videos/courses/websites/tools by value, not fame | REQ-10/12/38; scoped resource MAP; R1 assignments reviewed | P17 access/edition/section scope; later advanced readings |
| RD09 · Step 9 L324–351 | Stable resource metadata, recommendation/priority/country/date, deduplication | REQ-10/12/28; R1 | P09/P12 metadata, unknowns and contextual-association checks |
| RD10 · Step 10 L352–392 | Dedicated math track with mandatory/useful/advanced/optional depth and financial use | REQ-07/08/38; embedded arithmetic/probability R1; full track LATER/MAP | P17 bridge checks and later math batches |
| RD11 · Step 11 L393–421 | Practical Python/libraries/ingestion/cleaning/pricing/Greeks/simulation/backtest/optimization exercises | REQ-08/09/38/39; MAP and LATER | P17 L2/L3; no claimed coding proficiency from R1 |
| RD12 · Step 12 L422–464 | Payoffs → paper/historical/simulation/statistical practice with sizing/costs/discipline; suggested small live stage | REQ-01/25/26/39; manual R1, richer simulation LATER; real-money requirement excluded by newer instructions | J13; later P23 simulation brief; no live execution |
| RD13 · Step 13 L465–497 | India contracts/rules/costs/timing/physical settlement; stable versus changing facts | REQ-12/29/38; principles R1, operational details LATER | Current circular/master gate, U03 and CR-03 |
| RD14 · Step 14 L498–538 | All listed advanced models, surfaces, vol/variance/correlation, exotics, flow/dealer, MM/execution/0DTE material | REQ-02/08/09/38; MAP + LATER L2–L4 | Canonical checklist and relevant professional review, not just new titles |
| RD15 · Step 15 L539–591 | All twelve distinct projects with prerequisites/objective/data/steps/outputs/evaluation | REQ-09/26/38; twelve MAP specs, LATER execution; R1 dossier separate | P12 retains all; P17 reviews actual implementations/assessment later |
| RD16 · Step 16 L592–617 | Three substantive completeness/duplication/dependency/practice/evidence reviews | REQ-38/37; P01 passes inspected, later affected reviews | P17/P18 records; independence interpreted as separate passes, not invented people |
| RD17 · Step 17 L618–656 | Named human documents and maintainable machine-readable exports | REQ-28/37; inherited P01, R1 validated import/export | P09 fidelity, documentation links; canonical folder names preserve intent |
| RD18 · Important rules L657–686 | No invented references, authority/uncertainty, learning quality, appropriate math, edge-versus-strategy, deep execution/risk/statistics/volatility | REQ-01/06/12/29/38; R1 and LATER | CR-01/02/03, claim/readiness and professional review |
| RD19 · Final outcome L687–690 | Researched canonical system before architecture | REQ-37/40; P01 bounded gate verified before P02 | Entry evidence; P03 next, no application built |

## Archived production prompt reconciliation

| Trace ID / exact source section | Requirement retained or refined | Requirement IDs / release | Planned owner / validation |
|---|---|---|---|
| PB01 · §1 L26–41 | Inspect repo/docs/content/resources/decisions and preserve good work | REQ-28/37/40; every stage | P01/P02 entry evidence; subsequent shared entry gates |
| PB02 · §2 L42–91 | MVP public home/explorer/paths/phases/modules/topics/resources/search/filters/prerequisites; accounts/progress/bookmarks/notes/dashboard/next lesson; manage programs/modules/topics/resources/tags/paths/prereqs | REQ-02–11/16–29/38; R1; advanced tools LATER | J01–J16 and CR gates |
| PB03 · §3 L92–140 | Supported Java/Spring; evaluate Spring Web/Data/Security, PostgreSQL/Flyway/validation/OpenAPI/Testcontainers/JUnit; Next/React/TS/Tailwind/shadcn alternatives; SEO and monolith rationale | REQ-37/40; R1 architecture decisions | P03 dated official compatibility/choice evidence; no tool selected merely because named |
| PB04 · §4 L141–196 | Organized monorepo: backend/frontend/data/docs/infrastructure/scripts and useful internal boundaries | REQ-37; R1 | P03 layout then P07 fresh setup; canonical/source boundaries preserved |
| PB05 · §5 L197–291 | Normalized user/role/content/hierarchy/resource/tag/prereq/path/exercise/quiz/progress/bookmark/note relationships, metadata, joins, constraints/indexes and ERD | REQ-05/10/19/20/24/27/28/37; R1, chapter layer only when useful | P04/P08 real PostgreSQL constraints, ownership and version tests |
| PB06 · §6 L292–319 | Repeatable validated import, duplicate/slugs/prerequisites/entities/relationships, no hardcoding or corruption | REQ-28/37; R1 | P09 dry-run, idempotence, atomic reject, conflict/retirement and learner preservation |
| PB07 · §7 L320–382 | Versioned public REST hierarchy/resources/paths/search, filters, private progress/bookmarks/notes and authorized admin | REQ-05/10/11/19–22/27/37; R1 | P05 contracts/P10+ implementation, authorization and pagination tests |
| PB08 · §8 L383–405 | DTOs not JPA entity exposure, clear mapping without meaningless layers | REQ-35/37; R1 | P05/P10 contract/payload review |
| PB09 · §9 L406–435 | Consistent validation/not-found/unauthorized/forbidden/conflict/malformed/server errors, no stack leakage | REQ-13/35/37; R1 | API negative tests and J01–J17 failure states |
| PB10 · §10 L436–468 | Evaluate secure sessions/JWT/identity, register/login/logout/hash/roles; future Google/GitHub OAuth | REQ-03/16–19/35/39; core R1, OAuth LATER | P03 decision, P13/P19 lifecycle and role tests |
| PB11 · §11 L469–495 | Appropriate password hashing, authorization/cookies/CSRF/CORS/input/SQL/XSS/rate/brute-force/secrets/headers/admin/dependency security | REQ-16–19/35/37; R1 | P03/P13/P19 actual trust-boundary review |
| PB12 · §12 L496–520 | Premium typography/spacing/containers/cards/borders/radii/shadows/states/accessibility and light/dark design | REQ-14/15; both themes R1 | P06 original design system and P18 actual content/contrast review |
| PB13 · §13 L521–547 | Public and user information architecture, separate admin; suggested Tools | REQ-04/23/27/39; working core R1, Tools intentionally absent until LATER | P06/P11/P18 navigation audit |
| PB14 · §14 L548–587 | Clear home hero/CTAs/tracks/counts/roadmap/modules/projects/method/progress/footer without crowding | REQ-01/02/04/15; R1 with honest partial-course copy | J01 and visual/copy review, no professional-mastery promise |
| PB15 · §15 L588–624 | Progression roadmap, readiness/prereqs/time/difficulty/expandability; optional locks | REQ-05/07/08/20; R1 open reading, assessment evidence gate | J03/J09, accessible list equivalent |
| PB16 · §16 L625–664 | Module metadata/status/why/objectives/prereqs/topics/prioritized resources/practice/mistakes/mastery/next | REQ-05/06/10/20/23–25; R1 and MAP | P11/P17 module scope/readiness/content checks |
| PB17 · §17 L665–690 | Resource facets/type/cost/priority/topic/path and useful card/detail metadata | REQ-10/11/12; R1 | J04 combined facets, unknown metadata, exact assignments |
| PB18 · §18 L691–709 | Intentional fast search across topics/modules/resources/authors/descriptions/tags; PostgreSQL FTS candidate, no unjustified cluster | REQ-11/33/37; R1; engine choice P03 | J05, relevance/load evidence rather than cluster by default |
| PB19 · §19 L710–725 | Start/complete topics/modules, percent and resume, durable server records | REQ-20/23; R1; module completion derived, partial modules cannot complete | J09/J15 cross-device and version tests |
| PB20 · §20 L726–739 | Module/topic/resource bookmarks and private notes with clean ownership | REQ-19/21/22; R1 | J10/J11 and two-user isolation |
| PB21 · §21 L740–755 | Semantic slugs, SSR/static rendering, metadata/canonical/OG/sitemap/robots/breadcrumb/justified educational schema | REQ-36/37; R1 | P20 rendered/index/privacy audit, P22 deployed checks |
| PB22 · §22 L756–778 | Efficient paginated/indexed queries, no N+1, measured fetches; splitting/rendering/images/caching/lazy-load and budgets | REQ-28/33/37; R1 | P20 representative query/browser measurements and invalidation |
| PB23 · §23 L779–830 | Backend unit/integration/repository/service/controller/auth/validation/import; frontend components/render/filter/progress/auth; real E2E | REQ-37; R1 | P07 onwards; P18 full-stack J01–J17, actual PostgreSQL |
| PB24 · §24 L831–848 | Production Docker and straightforward local database/backend/frontend setup | REQ-37/34; R1 OPERATIONS | P07 local runtime, P21 production builds/fresh-machine smoke |
| PB25 · §25 L849–869 | CI compile/test/lint/type/build and safe deployment/migrations | REQ-35/37; R1 OPERATIONS | P07/P21 pipelines, protected secrets, migration and artifact evidence |
| PB26 · §26 L870–900 | Compare manageable MVP and growth hosting, frontend runtime/backend/database compatibility; named vendors are candidates | REQ-34/37/40; design P03, deployment only P22 | Cost/topology alternatives with dated evidence; no P02 selection/spend |
| PB27 · §27 L901–919 | Health, structured logs, backend/frontend errors, uptime/database metrics; Actuator/Sentry candidates | REQ-30/32/34/37; R1 OPERATIONS | P07/P21 sanitized observability and actionable alerts, no provider mandated |
| PB28 · §28 L920–929 | Automated backups, restore and migration rollback considerations | REQ-28/31/34; R1 OPERATIONS | P21 timed restore, no destructive rollback or resurrected users |
| PB29 · §29 L930–987 | Bounded sequential milestones from foundations/import/APIs/UI to auth/admin/quality/deploy | REQ-37/40; refined P01–P23 stages | Gate evidence; tests throughout, importer before feature work |
| PB30 · §30 L988–1014 | Bounded tasks with objective/files/constraints/criteria/tests/nonchanges; review generated work | REQ-37/40; process | Shared instructions/recorded handoff; no unrequested task delegation |
| PB31 · §31 L1015–1041 | Done includes content/APIs/auth/progress/bookmarks/responsive/forms/authorization/tests/containers/build/migrations/accessibility/security/deploy/smoke/docs | REQ-01–38/40; R1 definition of done, full curriculum remains later | P18–P22 evidence; P02 documents alone do not pass |
| PB32 · §32 L1042–1096 | Six final architecture/database/security/UI/research/deployment reviews with listed failure modes | REQ-12/14/28/33–37; R1 | P18/P19/P20/P21/P22 review records and fixes |
| PB33 · §33 L1097–1119 | README and living product/architecture/database/API/frontend/security/testing/deployment/decision documentation; another developer can run it | REQ-37/40; R1 and ongoing | P03–P21 assigned docs, fresh setup/recovery walkthrough |
| PB34 · Core L1120–1127 | Maintainability, good UX, trustworthy curriculum and actual deployability over speed/demo appearance | REQ-06/12/15/34/37/38; R1 then broader completion | All gates, no untested or unpublished completion claim |

## Discovered gap dispositions

| Source ID | Product consequence and explicit disposition | Requirement IDs | Owner / validation |
|---|---|---|---|
| G01 | Original scopes cannot count as finished lessons; author exact R1 slice | REQ-02/06/38 | P17/P18 CR-01 |
| G02 | Objectives/rationale/checkpoints/durations must be visible and measurable | REQ-05/06/08 | P17 rendered module/lesson review |
| G03 | Whole-module graph is too coarse for a small entry course; retain it and justify lesson-level prerequisites without whole-module credit | REQ-07/08/20 | P04/P09/CR-04 and partial-competency tests |
| G04 | Coding before coding-dependent research, accessible manual foundation route | REQ-06/07/09/38 | R1 noncoding; L2 Python prerequisite checks |
| G05 | Chart modules optional rather than delaying contracts; no erasure | REQ-02/07/08 | R1 sequence and later optional specialization |
| G06 | Seven explicit shared-content paths, honest completion bounds | REQ-08/20 | J03/J09, CR-06 |
| G07 | Supplemental capstones/branches/assessment policy must survive import | REQ-02/09/24/28 | P09 lossless relationships and counts |
| G08 | No artificial chapter levels or comma-split subtopics | REQ-05/38 | P04/P09 hierarchy and stable successor mapping |
| G09 | Exact topic/claim reading assignments, not inherited links as citations | REQ-10/12 | CR-03 and association audit |
| G10 | Full resource metadata with unknowns and cost/access clarity | REQ-10/12 | J04/P17 metadata review |
| G11 | Retrieval/TOC/full text/replication must remain distinct | REQ-12/29 | Public labels and review history tests |
| G12 | Real examples, inputs, answers, variants, rubrics and feedback required | REQ-06/24/25/26/38 | CR-02/05, P15 numerical tests |
| G13 | 85% is a policy, critical errors override; version/retry/remediation explicit | REQ-24/26 | J12/J13, boundary/version/freshness tests |
| G14 | Software licensing differs from data entitlement; supplied rights unresolved | REQ-12/30/40 | U03/P17/P19 rights and export audit |
| G15 | Rules need dated governed records and stale/supersession handling | REQ-29 | J15, no current operational facts in R1 |
| G16 | BSE current specification gaps remain quarantine, not a guessed table | REQ-12/29/38 | L4 India gate, current masters/circulars |
| G17 | Historical cases need chronology/mechanisms/competing explanations | REQ-09/12/38 | MAP preserved; later case authoring including bounded 2020 evidence |
| G18 | Unified numerical conventions and independent checks | REQ-06/24/25/38 | R1 cash units; later Greek/pricing reference tests |
| G19 | American-quote calibration/discrete dividends/de-Americanization limits | REQ-02/12/38 | M37.P01 retained; L3 exact source/numerical review |
| G20 | Learner effort and authoring time have separate honest bases | REQ-05/08/38 | CR estimates and consented pilot revision |
| G21 | Product/architecture/database/API/UX precede implementation | REQ-37/40 | P02 then P03–P06, no application in this stage |
| G22 | Author/reviewer, versions, correction and learner migration required | REQ-20/27/28/29 | J14/J15 and P16 audit |
| G23 | Accessible math and low-bandwidth/noncoding routes | REQ-06/13/14/15 | CR-07/J17 |
| G24 | Controlled type/difficulty/priority/topical tags; no opaque inherited code as tag | REQ-05/10/11 | P09 vocabulary, P12 facet tests |
| G25 | Completion/bookmarks are not skill evidence | REQ-20/23/24/26 | J09/J12/J13 labels and pinned assessment evidence |

## Research questions and evidence findings carried forward

| Research scope | Release disposition and retained work | Requirement IDs / owner / validation |
|---|---|---|
| RQ01 foundations/contracts; Q001/Q008/Q009 | R1 original contract/lifecycle cases; exact OCC/OIC/FINRA sections rechecked before instruction publishes | REQ-06/12/38; P17 CR-01/03 |
| RQ02 infrastructure/execution; Q006 | R1 quote/fill/cash distinction, full margin/venue rules later; no present account threshold adopted | REQ-06/29/38; P17/P23 current-rule gate |
| RQ03 structures; Q022 | R1 four single legs and covered call; verticals/synthetics/complex structures later; methodology is not a profitability claim | REQ-06/09/38; P17 later practice/reference review |
| RQ04 Greeks/P&L | R1 cash/units, no Greek tool; higher derivatives/conventions retained for later instruction and numerical validation | REQ-09/38/39; P17 L2/L3 and P23 tool brief |
| RQ05 pricing/numerics; Q007/Q013/Q017 | BSM/tree/MC/FD/American methods and maintained libraries remain MAP and later projects, with direct verification | REQ-09/12/38; P17 L2/L3 |
| RQ06 advanced surfaces/models; Q021 | American quote treatment, dividends/model limitations and static arbitrage remain explicit later work | REQ-02/12/38; P17 advanced gate |
| RQ07 volatility; Q014/Q016/Q018/Q019 | Full variance/volatility/forecast/VIX program retained; exact current VIX methodology still excluded | REQ-08/12/29/38; later P17/P23 source-chain and numerical checks |
| RQ08 hedging/hypotheses | R1 costs and conditional examples, no claimed edge; hedging error and strategy falsification later | REQ-01/06/09/38; P17 costed hypothesis assessment |
| RQ09 quantitative foundations; Q010/Q011/Q012 | R1 embedded arithmetic/probability; full math/Python bridges before dependent coding | REQ-07/08/38; CR-04 then P17 L2 |
| RQ10 validity; Q015/Q023 | Data rights, leakage and software-license distinction retained; R1 synthetic data avoids false historical results | REQ-12/26/38; P17/P19, later entitled empirical projects |
| RQ11 risk/capital; Q002 | R1 stress-budget/zero-contract and cash distinction; full portfolio/model governance later, bank guidance not universal retail rule | REQ-01/06/38; CR numerical/risk review |
| RQ12 psychology | R1 process before outcome and no real-money requirement; full behavioral/journal instruction later | REQ-01/08/39; P17 L1 and later journal brief |
| RQ13 professional specializations | No observed dealer-sign certainty, toy-model or inference-to-edge overclaim; professional desks remain later | REQ-08/09/12/38; P17 L3/L4 reviews |
| RQ14 cases; Q020 | Seven case packs preserved; chronology/competing explanations/2020 evidence need later teaching review | REQ-02/12/38; later P17 case gate |
| RQ15 India/global; Q003/Q004/Q005/Q024–Q029 | R56 statistics/R58/current BSE/NSE/CAS/algo chains quarantined; stock physical-settlement principle retained only with scope; no permanent current constants | REQ-12/29/38; P16/P17/P23 rules gate |

All Q001–Q029 are represented in the rows above; grouping preserves their P01 individual records rather than pretending to repeat every underlying investigation. New P02 sources are limited to W3C accessibility, Web Vitals, NIST password guidance and OWASP recovery guidance, cited at the relevant requirement. They inform targets, not claims of implemented compliance.

## Conflicts, exclusions and gate result

1. The archived build prompt's “research is complete” premise is replaced by the measured P01 design gate and its publication exclusions. No current-rule or full-book certification is inferred.
2. The archived live-market practice stage is excluded by the newer explicit instruction. Educational simulation remains; no live order capability is planned.
3. Full-professional marketing copy is narrowed for R1. All canonical paths stay visible, but only the new foundation course can finish with the initial slice.
4. A module-complete button cannot override absent topics or assessment evidence. Derived completion and separately labeled self-completion preserve the original learner intent without false mastery.
5. Suggested Tools navigation, ratings and advanced calculators are postponed explicitly. No empty feature page is counted as implementation.
6. Suggested chapter tables/UI are conditional; P01 has no chapter layer. The canonical metadata is an interchange format, not a decision to persist the app as blobs.
7. P01's 180–360-hour provisional slice estimate is superseded for this chosen R1 by the itemized 420–700-hour editorial estimate, with a distinct 28–49-hour learner range.
8. Paid providers, identity architecture, framework versions and database schema remain P03–P05 decisions. Budget, operator/territories, rights, editorial staff, support/email and deployment identity are recorded as U01–U06 rather than invented.

P02 document gate: pass only after the recorded validation confirms all 40 requirements have owners/validation, all 17 research steps and 33 build sections plus master/gap findings are assigned, the 36-topic sequence references real IDs without future dependencies, and local links/entry integrity pass. This is not evidence that any application journey has run. P03 is the next eligible prompt; P17 and P18–P22 retain all content and release obligations.
