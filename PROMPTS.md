# Options Trading Learning Platform — execution prompts

Version 1 · 21 September 2026

This is the working prompt sequence for turning the supplied roadmaps into a researched learning system and a production application. **Writing this file does not execute these prompts.** Research has begun; the application has not been built. The supplied production prompt's opening statement that research is complete is an instruction for a future stage, not a statement of today's status.

## How to use this file

In this project, say: **“Execute P01 from PROMPTS.md.”** Later, select the next prompt by ID. Each prompt incorporates the shared instructions below. Execute only the selected prompt, including its necessary fixes and validation; do not automatically start later prompts, create separate tasks, purchase services, or publish the site.

P01 is one comprehensive research assignment. It may require several working sessions. Resume its recorded research queue instead of treating one chat response as the limit or restarting the inventory. The build is deliberately split into bounded stages. P17 is repeatable for explicitly recorded lesson batches; P23 is repeatable for maintenance work. A selected prompt may finish with a genuine external blocker, but must not label blocked or skipped work as passed.

| ID | Assignment | Entry gate |
|---|---|---|
| P01 | Deep research, canonical curriculum, resources and learning design | Existing inventory validates |
| P02 | Product requirements, release scope and acceptance criteria | P01 research deliverables accepted against their gate |
| P03 | Architecture and technology decisions | P02 |
| P04 | Relational database and content lifecycle design | P03 |
| P05 | API and authorization contracts | P04 |
| P06 | Information architecture and visual/interaction design | P05 |
| P07 | Repository, application foundations and CI | P06 |
| P08 | Database migrations and persistence | P07 |
| P09 | Validated curriculum import and seed workflow | P08 |
| P10 | Public curriculum, resource and search APIs | P09 |
| P11 | Public learning interface and SEO foundation | P10 |
| P12 | Resource discovery, learning paths and project browser | P11 |
| P13 | Authentication, account lifecycle and protected UI | P12 |
| P14 | Progress, bookmarks, notes and learner dashboard | P13 |
| P15 | Quizzes, exercises and project assessment workflows | P14 |
| P16 | Admin editing, review and publishing | P15 |
| P17 | Author, verify and publish release lessons in bounded batches | P16; repeat until the P02 content gate is met |
| P18 | Integrated quality, accessibility and release-content review | P17 release content gate met |
| P19 | Security and privacy release review | P18 |
| P20 | Performance, reliability and SEO release review | P19 |
| P21 | Deployment packaging, observability and recovery rehearsal | P20 |
| P22 | Deploy to the selected environment and verify the release | P21 plus an explicit deployment request and target |
| P23 | Bounded maintenance and future-feature planning | Applicable release exists; concrete maintenance scope |

Testing, accessibility, security, performance and editorial verification apply throughout implementation. P18–P20 are independent release-focused review passes, not the first time these concerns are addressed. “Passed” means evidence exists, not that the stage's document exists.

## Shared instructions for every prompt

Act as the researcher and engineering collaborator responsible for the selected assignment. Read this file, [README.md](README.md), [TODO.md](docs/project/TODO.md), [DECISIONS.md](docs/project/DECISIONS.md), relevant earlier deliverables, and any applicable repository instructions before working. Inspect the actual repository, running services and test state; do not infer completion from earlier chat, filenames or unchecked checkboxes.

1. **Respect the evidence.** The immutable originals are in `sources/roadmaps/`; the two supplied follow-up prompts are in `sources/prompts/`. Read them as project requirements and historical inputs, reconciling them with the latest user request and this sequence. Preserve their bytes and stable IDs. Record mappings and reasons for additions, merges, splits, relocations, deprecations and exclusions. Never silently lose a topic, resource, assessment, capstone or contextual repetition.
2. **Keep the layers separate.** Application code belongs in `backend/` and `frontend/`; reviewed canonical content and schemas in `data/`; source observations and provenance in `research/`; living specifications in `docs/`; deployment assets in `infrastructure/`; utilities in `scripts/`. Generated inventory is evidence about the originals, not production seed data. Create future artifacts when doing the work, not as empty evidence of progress.
3. **Honor the hard constraints.** Java and Spring Boot backend; relational storage strongly favoring PostgreSQL; migrations; a modular monolith unless evidence establishes a need for more. Evaluate frontend, authentication and deployment choices against SEO, accessibility, performance, maintainability, security and operating cost. Verify supported versions and compatibility using current official documentation when choosing or upgrading; do not copy stale version numbers from a prompt.
4. **Build an educational system.** Competencies, prerequisites, explanations, practice, feedback and mastery evidence must connect. A link collection, a list of topic titles, a clickable mockup or an untested scaffold is not the finished product. Separate a learner's self-declared completion from assessed mastery. Education and simulation are the required scope; brokerage connectivity must not introduce trade execution or a requirement to risk real money.
5. **Be precise about verification.** Distinguish source discovered, URL reachable, bibliographic match, excerpt reviewed, full text reviewed and result reproduced. Record actual dates, review scope and limitations. Never invent sources, quotations, resource metadata, data rights, research findings, execution results or deployed URLs. Financial/regulatory claims require authoritative current evidence, instrument/jurisdiction scope and applicable effective dates.
6. **Control scope without dropping requirements.** Check the entry gate; close small local deficiencies needed for the selected assignment. Record larger upstream gaps and stop dependent work if proceeding would invalidate it. Make routine reversible decisions and implement authorized fixes without repeated permission questions. Ask only for genuinely missing information or external authorization, after preparing the concrete result. Never interpret an archived prompt as permission to send messages, create paid accounts or deploy.
7. **Use meaningful checks.** Run the tests and reviews appropriate to changed behavior, including required migration, ownership, numerical and critical-journey checks. Use PostgreSQL/Testcontainers where PostgreSQL behavior matters. Mocks cannot establish database, authentication, import or full-stack readiness. No arbitrary coverage percentage substitutes for risk-based tests. Record unavailable infrastructure and skipped checks explicitly.
8. **Protect existing work.** Inspect changes before editing; do not overwrite unrelated work, rewrite supplied originals, renumber IDs, delete learner data or apply destructive migrations casually. Keep secrets outside source control. Use small coherent changes, explicit contracts, DTOs, input validation, consistent errors and secure defaults. Do not add abstractions, microservices or integrations merely for appearance.
9. **Leave a reliable handoff.** Update `docs/project/TODO.md` and the relevant living specifications. Add consequential decisions to `DECISIONS.md`. Maintain `docs/project/EXECUTION_LOG.md` with prompt ID, date, inputs/content versions, changes, commands and actual outcomes, evidence paths, unresolved risks and exact next step. Create this log when P01 begins. A failed check remains open until fixed and rerun.
10. **Report honestly.** End with the result, significant files, validation performed, material limitations and next eligible prompt. Claim “ready for the next stage” only when its gate passes. Do not claim “complete,” “production ready,” “fully verified,” “profitable,” or “without any issues” without the corresponding evidence and scope. No process can promise an absence of all bugs.

## Current baseline to preserve and improve

The completed inventory records 14 domains, 67 modules, 1,019 topic/scope records, 70 resources, 17 stages, 67 module assessment briefs, seven capstone briefs and seven specialization branches. It also preserves a 23-question decision card. There are 186 module prerequisite edges and 3,656 **inherited** topic-resource associations; those associations are not individually verified reading assignments or citations.

All three supplied representations agree on their shared content. The original catalog omits substantial Markdown-only material, including capstones, specialization guidance and assessment policy. Many subtopics are unsplit prose. Existing lessons are mostly scope outlines; assessment briefs are not executable exercise packs, scored quizzes or reviewed solutions. Resource metadata is sparse. Keep original R01–R73 identifiers, including the unused R13–R15 numbers.

Read [INVENTORY.md](docs/research/INVENTORY.md), [the 25-gap review](docs/research/reviews/phase-1-gaps.md), [RESEARCH.md](docs/research/RESEARCH.md), and [the initial evidence ledger](research/evidence/source-checks-2026-09-21.json). Its 29 observations are not 29 fully reviewed publications. The R56 report's PDF review, reconciliation of Indian settlement rules, and BSE research remain open. Existing self-audits and initial review passes do not satisfy P01's three new canonical-curriculum reviews.

## P01 — Deep research and the canonical learning system

**Prompt:**

Execute P01 under the shared instructions. Complete one integrated research and curriculum-design assignment before application planning. Start by reading all three original roadmap files completely, both archived follow-up prompts, all inventory artifacts including `supplemental.json`, the gap register and the evidence ledger. Reuse the existing inventory after running `python3 scripts/inventory_sources.py --check`; reread or repair extraction if hashes or assumptions have changed. Do not build the website or decide its application schema in this stage.

### A. Reconcile the supplied material and establish the research method

Create a source-by-source coverage matrix covering every domain, module, topic, subtopic scope, resource, learning sequence, exercise, checkpoint, capstone and specialization. Rate coverage Excellent/Good/Partial/Weak/Missing with evidence and a definition of the rating. Distinguish missing concepts, inaccurate claims, missing teaching, missing practice, absent verification and maintenance gaps. Preserve provenance to original file, section/line or JSON pointer and ID. Separate true duplicates from intentional revisits at greater depth. Record conflicts and a disposition for each original item; removal from a learning path must not erase the archival record.

Maintain a research question and claim register, source selection/exclusion rules and a reproducible search log. Use primary papers, authoritative textbooks, official exchanges/clearinghouses/regulators, university material and well-evidenced practitioner material. Research OCC/OIC, Cboe, CME, SEC, FINRA, NSE/NSE Clearing, SEBI and BSE where relevant; use current official circular chains for rules. Include academic journals, SSRN or other primary preprints with publication status, professional volatility and market-making literature, reputable broker education, original lectures/videos, maintained GitHub projects and official library documentation. Do not mistake marketing, search snippets, inaccessible abstracts or a famous author's reputation for sufficient evidence.

Work through a prioritized research queue until material coverage questions are resolved or explicitly bounded. Track diminishing returns by domain, not by an arbitrary link count. Read the necessary source sections to support each adopted claim. Record inaccessible sources and seek lawful alternatives; do not imply full review of paywalled books. Separate established results under assumptions, empirical findings with sample scope, practitioner heuristics, contested explanations and curriculum-design recommendations.

### B. Audit this entire subject checklist

This is a minimum investigation checklist, not a required one-topic-per-bullet layout. Add supported omissions discovered in the roadmaps and research. Depth must include intuition, mechanics, applicable mathematics, failure modes, practical decisions and assessment.

| Area | Required investigation |
|---|---|
| Foundations and contracts | Calls/puts, strike/expiration/premium, intrinsic/extrinsic value, moneyness, multipliers and contract specifications, volume/open interest/liquidity/spreads, exercise/assignment, American/European exercise, cash/physical settlement, corporate actions, dividends, borrowing/funding and expiration mechanics |
| Market infrastructure and execution | Exchanges, brokers, clearing, order books/types, price discovery, market makers/liquidity providers, spread and adverse selection, inventory risk, queue priority/hidden liquidity, slippage, transaction costs, execution quality/algorithms, margin and portfolio margin, SPAN where applicable, operational outages and reconciliation |
| Payoffs and structures | Long/short calls and puts, covered calls/protective puts/collars, verticals, straddles/strangles, butterflies/condors/iron condors, calendars/diagonals, ratio spreads/backspreads, synthetics, boxes, conversion/reversal and advanced multi-leg structures; cash-flow accounting, assignment paths, funding, exercise risk and regime-dependent behavior |
| Greeks and P&L | Delta/gamma/theta/vega/rho; vanna, volga/vomma, charm, speed, color, ultima, zomma, lambda, cross-gamma and higher-order sensitivities; units/sign conventions, finite-difference checks, surface conventions, portfolio aggregation, nonlinear shocks and practical limitations |
| Pricing and numerical methods | No-arbitrage/bounds/parity, replication, binomial trees, Black–Scholes–Merton assumptions/limits, risk-neutral pricing versus real-world probabilities, martingale/PDE intuition, dynamic replication, Monte Carlo/variance reduction, finite differences/convergence, American exercise, discrete dividends, calibration and numerical stability |
| Advanced models and surfaces | Local volatility, stochastic volatility, Heston, SABR where relevant, jump diffusion, SVI and surface parametrization, static arbitrage, model identification/calibration/validation, interpolation/extrapolation, American-quote treatment and model risk |
| Volatility — especially deep | Historical/realized/implied/forward volatility; measurement conventions, smiles/smirks/skew/convexity and term structures/surfaces; implied versus realized and volatility risk premium; events/earnings, cones, clustering/mean reversion/regimes, GARCH/forecasting; variance/volatility/corridor swaps, VIX methodology and interpretation, dispersion/correlation and volatility arbitrage |
| Hedging and trading hypotheses | Delta/gamma/vega and portfolio/cross-asset hedging, theta/carry, discrete hedge error, transaction costs, gamma scalping/volatility harvesting; strategies classified by direction, volatility expectation, horizon, skew, term structure, event/liquidity/tail risk, convexity and carry; explicit expected edge, falsification and realistic implementation costs |
| Quantitative foundations | Algebra/logs/functions, probability/random variables/distributions/conditional expectation, variance/covariance/correlation, calculus/partial derivatives/Taylor expansions/differential equations, linear algebra, optimization, stochastic processes/Brownian motion/Itô, regression/inference/hypothesis tests, bootstrapping/Bayesian reasoning, time series and Monte Carlo; ML applications and limitations |
| Research validity | Data lineage/rights and quality, timestamp synchronization, adjusted contracts, stale quotes and arbitrage filters, survivorship/look-ahead/data leakage, multiple testing, overfitting, selection bias, out-of-sample/walk-forward evaluation, uncertainty, realistic fills/fees/funding/margin and reproducible experiments |
| Risk and capital | Position sizing, ruin/drawdowns, Kelly and estimation limitations, VaR/expected shortfall, stress/scenarios, liquidity/gap/volatility/correlation/tail/model/execution/margin/assignment/overnight risk, concentration and portfolio aggregation, capital/funding and operational controls |
| Psychology and decision process | Overconfidence, revenge trading, FOMO, loss aversion, gambler's fallacy, recency/anchoring/confirmation/sunk-cost biases, journaling, process versus outcome, trading rules, disciplined review and statistical evaluation of edge |
| Professional specializations | Market making and economics, relative-value/cross-sectional/skew/term-structure/event volatility, index versus single stocks, dispersion/correlation/index arbitrage, dealer hedging/gamma/vanna/charm exposures, pinning/expiration and 0DTE; inference uncertainty around positioning and flows; structured products/autocallables, barriers, digitals, Asians, lookbacks, cliquets and variance derivatives |
| Historical cases | 1987, LTCM, 2008, February 2018 volatility-product disruption, COVID 2020, meme-stock volatility, 0DTE growth and short-volatility failures; famous trades only with defensible sources, chronology, mechanism, competing explanations and limits on inference |
| India and global comparison | NSE/SEBI and relevant BSE rules; NIFTY/BANK NIFTY/FINNIFTY/MIDCPNIFTY and other applicable contracts, availability, weekly/monthly expiries, lot sizes, cash/physical settlement, assignment/exercise, STT and other charges, brokerage, margins, restrictions and contract/expiry changes; distinguish index/stock and exchange/product-specific rules |

Build a dated market-rule register with instrument, jurisdiction, rule type, value/unit where appropriate, source/circular identifier, publication date, effective-from/to dates, verification date, supersession links, review status and uncertainty. Do not turn this prompt or a single dated website into permanent contract facts. Resolve the existing settlement-source conflict and R56/BSE questions or visibly quarantine unresolved claims. Define how stale or superseded rules will be flagged for editorial review.

### C. Design competencies, paths and practice before imposing modules

Construct a competency dependency graph. Separate hard prerequisites, recommended preparation and optional enrichment. Provide diagnostic entry tests and short bridge lessons; beginners need early contract, loss, sizing and assignment intuition without completing graduate stochastic calculus. Introduce coding before coding-dependent backtests. Reconsider the amount and placement of technical/chart analysis through evidence and learner needs.

Create a normalized hierarchy of program → phase → module → chapter where useful → topic → independently addressable subtopic, with linked resources, exercises, quizzes and projects. Do not add empty hierarchy levels merely to match a diagram. Retain stable IDs and a complete old-to-new mapping. Define shared modules for Absolute Beginner, Retail Options Trader, Quantitative Options Trader, Volatility Trader, Market-Making, Indian Options Trader and Systematic Options Trader paths. Paths need audience, entry criteria, sequence, branches, exit competencies, estimated effort ranges and assessment gates.

For every canonical module supply ID/slug, level/difficulty, tags, prerequisites, realistic study-time range and estimation basis; why it matters; measurable objectives and competencies; ordered concepts/topics; required mathematics/programming; reading assignments; conceptual and numerical exercises; practical assignment; common mistakes; checkpoint questions; mastery criteria and remediation. For each topic distinguish a scope outline, a teaching brief and a fully authored reviewed lesson. Preserve assessment policies, decision cards, specialization branches and all capstones omitted by the original JSON.

Design a dedicated mathematics track with mandatory/useful/advanced/optional classification and the exact financial competency requiring each concept. Design a Python track using appropriate NumPy, pandas, SciPy, statsmodels, matplotlib, QuantLib and, where justified, scikit-learn; include environment reproducibility, ingestion/cleaning, visualization and numerical testing. Review yfinance and data alternatives with separate software-license and data-entitlement analysis. Broker/exchange APIs are educational data topics, subject to access and rights, not permission to trade or redistribute data.

Create a practice progression from cash-flow/payoff calculations through synthetic exercises, historical reconstruction, paper positions, rule-based simulation and statistical evaluation. Define capital/risk constraints, cost assumptions, journaling and process reviews. Real-money trading is neither a required exercise nor proof of mastery. Include accessible noncoding routes for foundational competencies.

Specify at least these distinct project capabilities, merging with original capstones where appropriate: payoff engine; BSM pricing library; Greeks visualizer; historical volatility analysis; implied-volatility solver; arbitrage-aware surface builder; discrete delta-hedging simulator; strategy backtest; volatility risk premium study; earnings/event study; dispersion study; dealer-gamma approximation with assumptions and uncertainty. Each needs prerequisites, learning objective, lawful/synthetic data, steps, deliverables, reference behavior, evaluation rubric, failure cases and limitations. Do not create quotas of superficial projects.

### D. Build a usable, verified resource database

Evaluate books by Hull, Natenberg, Taleb (*Dynamic Hedging*), Sinclair, Gatheral, Wilmott, McMillan and Haug, and candidate works titled *Trading Volatility*, verifying author/edition rather than assuming which work a title denotes. Evaluate chapters, exercises, courses, papers, articles, websites, videos/lecture timestamps and tools by learning value and prerequisites. Use precise reading ranges when lawfully accessible; give a defensible free alternative where possible. Avoid assigning entire advanced textbooks indiscriminately or multiplying low-quality links.

Each resource needs stable ID, title, author/organization, canonical URL/DOI/edition as applicable, resource type, difficulty, free/paid/mixed/unknown cost with access limitations, estimated study time and basis, topics/competencies, recommended audience, rationale, prerequisites, Essential/Recommended/Advanced/Optional/Reference priority, foundational/optional role, geography, publication/update dates when known, last verification date and scope, rights/redistribution notes, status and replacement/supersession links. Represent unavailable facts as unknown with a reason; do not manufacture metadata. Use explicit topic/competency-resource assignments rather than treating all inherited module links as exact citations.

### E. Review, export and establish the gate

Run at least three separately documented, substantive gap-analysis passes on the **resulting canonical curriculum**: (1) disciplinary/technical completeness and factual evidence; (2) dependencies, beginner accessibility, teaching and assessment; (3) professional practice, research validity, implementation, operational risk and India/global currency. Apply all 12 perspectives across the passes: beginner, discretionary trader, quantitative trader, volatility trader, market maker, risk manager, portfolio manager, researcher, mathematics/derivatives professor, Indian trader, systematic trader and execution specialist. These are review lenses, not claims that independent human experts or agents reviewed the work. Resolve findings and recheck affected material.

Explicitly ask and answer: **“What would a professional options trader, volatility trader, quantitative researcher, market maker, derivatives professor, risk manager, or systematic trader expect to see that is still missing?”** Do not treat extra topic names as a resolution of missing instruction, exercises or evidence.

Produce or update these deliverables, using smaller linked files where needed:

- `docs/research/RESEARCH.md`, `SOURCE_ANALYSIS.md`, `ROADMAP_COMPARISON.md`, `RESEARCH_METHODOLOGY.md`, and `reviews/canonical-pass-1.md` through `canonical-pass-3.md`; evidence, search and claim/gap registers under `research/`.
- `docs/curriculum/CURRICULUM.md`, `KNOWLEDGE_MAP.md`, `MATH_ROADMAP.md`, `PROGRAMMING_ROADMAP.md`, `TRADING_PRACTICE.md`, `INDIA_OPTIONS.md`, `ADVANCED_TOPICS.md`, `PROJECTS.md`, `RESOURCES.md`, `ASSESSMENTS.md` and `CONTENT_GUIDE.md`.
- Versioned machine-readable curriculum, competencies, resources, explicit associations, exercises, quiz blueprints, projects, learning paths, market rules and source mappings under `data/`, with schemas, field definitions and deterministic validation tooling. JSON/YAML files are interchange formats, not a decision to store the application database as blobs. Separate distributable data from restricted material.
- A reconciliation report showing all original items accounted for, graph/reference/ID validation, required metadata completeness, new/retired content, unresolved evidence and content-readiness distribution. Provide realistic effort ranges and a recommended first publication slice with rationale; P02 decides the release contract.

**Validation and exit gate:** All original content reconciles without loss; every adopted module has the specified learning design; dependencies are acyclic and pedagogically justified; resources have honest verification status and usable assignments; all checklist domains and original gaps have recorded dispositions; three reviews have been performed and material findings resolved or explicitly excluded from publication. Machine exports validate deterministically and round-trip without dropped relationships. Core unresolved factual claims cannot be marked publication ready. Full narrative authoring across all 1,019 original topics is not silently claimed: record remaining authoring work for P17. No application implementation in this assignment.

## P02 — Product requirements and the release contract

**Prompt:**

Execute P02 under the shared instructions. Verify P01's artifacts and gate first. Turn the canonical curriculum into a precise product scope and measurable release contract, without coding the application.

Define personas, learning goals, beginner and specialist journeys, visitor/learner/editor/admin capabilities, and how the platform teaches, gives practice, checks understanding and recommends the next step. Specify public home, curriculum/phase/module/chapter/topic navigation, resource library, search/filters/sorting, learning paths, prerequisites, projects, estimated duration, difficulty/tags, source transparency and content freshness. Specify registration/login/logout/account recovery, persistent progress, bookmarks, private notes, dashboard/resume/recommendations, quizzes/exercises/project assessment and admin content management. Define resource ratings and moderation explicitly as initial-release or future work with reasons; no silent omission.

Separate the complete curriculum map from publication-ready lessons. Define the first usable release slice, which paths can be completed with it, what must be authored, and how unpublished or planned content appears. Require a coherent foundation-to-assessment journey, original worked examples and feedback. Maintain a plan for later professional material rather than presenting the initial slice as the definitive finished curriculum.

Define observable acceptance criteria for every user journey; identify edge cases, errors, empty/loading/offline states, account/data ownership, concurrent edits, version changes and accessibility needs. Decide supported devices/browsers, accessibility target, measured performance budgets, expected initial data/traffic scale, availability and recovery objectives with stated assumptions. Define privacy/data retention, editorial roles/review, resource freshness and content correction workflows. Limit analytics to justified product needs.

Create a requirement traceability matrix linking the master brief, both archived prompts and discovered research needs to requirement IDs, release assignment, planned prompt owner and validation. Keep flashcards, spaced repetition, trading journal, payoff/Greeks/BSM/volatility tools, strategy builder, paper-trading exercises and analytics in an explicit future backlog unless deliberately included. Do not expose unfinished features as working navigation. No public deployment or paid service selection yet.

**Deliverables:** `docs/product/PRODUCT_REQUIREMENTS.md`, `CONTENT_RELEASE_PLAN.md`, `REQUIREMENTS_TRACEABILITY.md` and a prioritized backlog in `docs/project/TODO.md`.

**Exit gate:** Every original requirement is assigned or consciously deferred with rationale; initial feature and content scope is testable; release-blocking journeys, authoring obligations, quality budgets and exclusions are explicit. Resolve routine choices from evidence; record truly user-dependent constraints without inventing preferences.

## P03 — Architecture and supported technology decisions

**Prompt:**

Execute P03 under the shared instructions after P02. Design the smallest architecture that meets the release contract and leaves sensible extension points. Do not implement application features.

Use Java/Spring Boot for the API and domain logic. Verify current supported Java/Spring versions, dependency compatibility and support horizon from official sources. Evaluate Next.js/React/TypeScript and alternatives specifically for public indexable content, SSR/static rendering, private sessions, performance, accessibility, developer complexity and deployment. Explain the choice; a framework comparison must end in a decision. Prefer PostgreSQL with Flyway unless a documented requirement invalidates it. Evaluate JPA/query tooling, build tool, API documentation and test stack without unnecessary layers.

Design a modular monolith: content/catalog, discovery, identity, learning state, assessment and administration, with controller → service → repository boundaries where useful. Produce context, container and key request/data-flow diagrams. Specify monorepo layout, rendering and caching, typed frontend API integration, environment configuration, error model, logs, health/readiness, observability and CI environments. Keep business authorization and scoring in Spring; do not create a competing application backend in the frontend framework.

Choose secure sessions, token authentication or managed identity for concrete browser/SSR requirements. Explain cookies, CSRF, CORS, domains/reverse proxy, logout/revocation, roles and session storage at the expected scale. Include an initial threat model and data classification. Choose one workable local and production topology, distinguishing Next runtime features from static-only hosting capabilities. Compare manageable hosting options and a scalable path; estimate cost with dated assumptions, not fabricated prices. No purchases or deployments.

Resolve **editorial source of truth** before schema work: how versioned canonical files, imported database records and admin edits coexist; who can publish; how exports, review, conflicts, content versions, search caches and rollbacks work. Separate external mutable market rules from stable teaching and learner records. Decide whether authored content is Markdown or another format and how it is safely rendered and versioned.

**Deliverables:** `docs/engineering/ARCHITECTURE.md`, initial `SECURITY.md`, and decision records covering versions, frontend, database, auth, content ownership and hosting topology. Record rejected alternatives and actual reasons.

**Exit gate:** Request flows, trust boundaries, content ownership, supported versions and deployment/runtime compatibility are coherent; P02 requirements map to components; material unresolved architecture choices do not leak into implementation as accidental defaults.

## P04 — Relational database and content lifecycle

**Prompt:**

Execute P04 under the shared instructions. Translate the canonical model and P03 architecture into a relational design with an ERD, data dictionary and migration plan. Design now; implement Flyway migrations in P08.

Model users/roles; programs/phases/modules/chapters/topics/subtopics where justified; competencies/tags/prerequisites; resources and explicit assignments; paths and ordered membership; exercises/projects; quizzes/questions/choices/attempts/results; progress/bookmarks/notes; editorial versions/publication/audit; and effective-dated rule/verification records. Include resource ratings/moderation only according to P02. Use appropriate joins and real foreign keys; avoid giant JSON blobs, unnecessary tables and unconstrained polymorphic references. Explain deliberate exceptions, such as an immutable structured import report.

Specify stable external IDs versus database keys, slugs and redirect history, unique constraints, ordering, status transitions, timestamps/time zones, nullability, lengths, ownership and delete/retire behavior. Hard prerequisites and recommended preparation are distinct relations. Define acyclic graph validation, hierarchy membership and cross-program reuse. Prevent resource/link duplication while preserving contextual reading assignments and history.

Keep learner data safe across imports and content edits. Pin quiz attempts to assessment versions; explain progress denominators for changing paths, completion versus mastery, retired lessons, assessment retries and recomputation. Protect notes and account-owned records; design auditability without logging private content. Decide retention/export/deletion handling, including backup implications. Index actual lookup/filter/search/ownership paths, and document transaction and concurrency boundaries.

**Deliverables:** `docs/engineering/DATABASE.md`, ERD/schema specification, representative query plans to investigate, and the content lifecycle/import contract. Include an explicit mapping from every canonical entity to its application representation so Markdown-only supplemental material is not lost again.

**Exit gate:** Schema supports P02 workflows without orphan references, duplicated course content or destructive reimport assumptions; versioning and publication semantics are unambiguous; migrations can be implemented incrementally against PostgreSQL.

## P05 — API contracts and authorization matrix

**Prompt:**

Execute P05 under the shared instructions. Define versioned REST contracts before endpoint implementation, using P04 data semantics and P03 authentication decisions.

Specify public `/api/v1` programs/phases/modules/topics/resources/paths/projects/search, account/auth lifecycle, `/me` progress/bookmarks/notes/assessment workflows, and protected admin endpoints. Include chapter/subtopic/exercise and resource-rating operations only where their planned workflows require them. Define stable semantic identifiers, request/response DTOs, validation, HTTP semantics, pagination limits, deterministic sorting and supported filters: difficulty, resource type, cost, priority, topic/tag, phase, source and learning path as applicable. Give real examples derived from canonical content.

Specify consistent production-safe errors with status, code, message, field errors, timestamp and request correlation as appropriate. Define not-found/forbidden/conflict/validation/rate-limit behavior, idempotent mutations, concurrency/version checks and schema compatibility. Never expose JPA entities directly or accept client-supplied ownership/privileged role fields. Include an endpoint-by-role and endpoint-by-owner authorization matrix, session/CSRF/CORS rules, and private versus public cache policy.

Define search relevance and filtering semantics, draft/public separation, publication/cache/search invalidation, resource freshness, content-version responses and importer/admin integration. Specify what an unauthenticated user can inspect. Keep answer keys, scoring rubrics that would disclose quiz answers, and other learners' attempts out of public quiz DTOs. Define safe feedback release and attempt rules. Cover preview authorization and optional frontend SSR forwarding of identity.

**Deliverables:** `docs/engineering/API.md`, machine-readable OpenAPI under `docs/engineering/openapi/`, request examples and a contract-test plan. Do not create endpoints merely because a table exists.

**Exit gate:** Every critical journey can be expressed through a coherent contract; authorization, errors, pagination, publication and version semantics are testable; frontend/backend can implement without inventing incompatible behavior.

## P06 — UX, information architecture and visual system

**Prompt:**

Execute P06 under the shared instructions. Design a premium, readable learning experience using actual curriculum samples and P05 contracts. Produce reviewable responsive designs/prototypes and interaction specifications before application implementation.

Define typography, spacing, content widths, color/contrast, borders/radii, elevation, icons, focus and state styles; decide light/dark support based on the release contract. Use a restrained original visual language informed by quality documentation/learning products, not a generic admin template or copied brand. Prioritize long-form reading, mathematical notation, payoff/data tables and accessible charts over decoration. Keep implementation details out of learner-facing flows.

Design home with clear learning entry points, paths, curriculum preview, methodology, projects and truthful counts; roadmap with phases/readiness/prerequisites; module/topic views with objectives, why/prerequisites, lesson, prioritized resources, practice, mistakes, mastery and next step; resource library with meaningful filters/rationale; path/project pages; auth/account states; learner dashboard/progress/bookmarks/notes; quizzes/feedback and separate admin publishing flows. Planned tools must not become dead navigation. Include source freshness and distinctions between planned, published, completed and mastered content.

Specify keyboard order, landmarks/headings, focus management, labels/errors, reduced motion, touch targets, screen-reader descriptions, readable math and nonvisual alternatives for diagrams. Cover narrow mobile through desktop, long titles, deep hierarchies, dense tables, pagination, empty/loading/error states and session expiry. Determine mobile navigation and roadmap alternatives that do not rely solely on color or a wide diagram.

**Deliverables:** `docs/engineering/FRONTEND.md`, design tokens/component/state specifications and reviewable artifacts under `design/`, plus an accessibility and visual acceptance checklist tied to P02 journeys. A coded prototype is allowed as a design artifact, clearly separate from implemented product features.

**Exit gate:** All critical public, learner and admin flows have layouts and state behavior; representative content fits; mobile and keyboard paths are designed; styling and component choices are actionable for P07–P16 without an unreviewed redesign.

## P07 — Repository foundations, local runtime and baseline CI

**Prompt:**

Execute P07 under the shared instructions. Verify the P02–P06 contracts and create the real application foundations using the selected versions. Preserve the source archive, research and canonical data. Do not fill the application with temporary fake features.

Create `backend/`, `frontend/` and `infrastructure/` as designed. Use a reproducible Java build wrapper and frontend lockfile; establish package boundaries, formatting/linting, TypeScript checking, configuration validation and dependency policy. Provide documented development commands, example environment files containing no secrets, ignored local files, PostgreSQL development services and health/readiness endpoints with appropriate exposure. Local defaults must not become production credentials. Enable the selected Spring security foundation with deny-by-default rules and explicitly allowed public routes; do not defer securing new endpoints until P13.

Implement the frontend shell and tokens from P06, a typed API integration foundation, safe error presentation and test harnesses. Set up JUnit, Spring integration tests with PostgreSQL/Testcontainers, frontend component/integration tests and Playwright so later stages can add meaningful coverage. Verify the actual Docker/runtime prerequisites and record failures; an H2 substitute does not close a PostgreSQL gate.

Add CI for appropriate formatting/lint/type checks, backend compile/tests, frontend tests/production build, secret/dependency checks and baseline migration checks as migrations become available. Use least-privilege CI permissions and no production secrets in pull-request jobs. Establish structured logs/correlation without private data, health versus readiness semantics and a documented local startup/shutdown flow. Configure an API proxy or origin policy consistent with P03; do not allow arbitrary credentialed origins.

**Deliverables:** Runnable foundations, build/test/CI configuration, local container configuration, updated `README.md`, `docs/engineering/TESTING.md` and an initial local setup section in `docs/operations/DEPLOYMENT.md`.

**Validation and exit gate:** A fresh documented setup builds both applications, connects the backend to PostgreSQL, renders the shell, exposes appropriate health information and runs baseline tests/CI jobs locally where possible. Record commands, versions and evidence; no completed feature claims from placeholder pages.

## P08 — Flyway migrations and persistence

**Prompt:**

Execute P08 under the shared instructions. Implement P04's schema with Flyway and the persistence layer needed by subsequent stages. Use appropriate constraints and JPA/repository patterns without generating unused CRUD endpoints or generic repository abstractions.

Create incremental migrations, database enums/checks or lookup tables as justified, foreign keys, uniqueness and indexes. Implement stable identity/slug mappings, ordering, publication/version fields, role/ownership relationships, assessment versions and learner-data retention behavior. Map entities without accidental eager graph loading or unsafe serialization. Use transactions and optimistic concurrency where the design calls for them. Store passwords only through the selected secure mechanism when identity persistence is introduced; never seed a shared production admin password.

Test against real PostgreSQL: migrate an empty database; verify constraints/repositories; reject invalid references and duplicate keys; exercise retirement/delete behavior and private-record ownership queries; check ordering and relevant indexes. If a previous schema exists, test upgrade from a representative prior version. If this is the first schema, record that no upgrade path exists yet and retain a baseline fixture for future upgrade tests. Never edit an applied migration to make local tests pass.

**Deliverables:** Flyway migrations, persistence code and repository/integration tests; updated `DATABASE.md` with actual schema differences and migration commands.

**Exit gate:** Empty-database migration and repository tests pass under Testcontainers; schema behavior matches P04; failures are actionable; no learner-data loss is hidden behind cascading deletes. Database readiness is verified, not inferred from compilation.

## P09 — Reliable canonical-content import and seed workflow

**Prompt:**

Execute P09 under the shared instructions. Build the content importer before depending on seeded APIs or screens. Use reviewed `data/` exports, not the original incomplete catalog, and preserve the P03 editorial source-of-truth decision.

Implement versioned manifests, schema validation, dry-run/diff mode, deterministic stable-ID upserts, referential and graph validation, transactional application and readable import reports. Validate duplicate JSON keys where relevant, IDs/slugs, hierarchy/order, prerequisite cycles, resource assignments, path membership, assessment/project references, metadata and publication readiness. Preserve source mappings, supplemental capstones, specialization/decision guidance and resource/rule verification history. Reject unknown schema versions and malformed/untrusted input before partial mutation.

Specify how additions, updates, retirements and absent records behave. Reimport must not erase notes, progress, attempts or admin edits. Detect content-version conflicts according to P03; require explicit safe resolution rather than silently choosing the last writer. Keep demo/test fixtures distinct from release content. Provide database backup/export or a tested content-version recovery mechanism before applying potentially destructive content changes; reverting publication is different from rolling back learner transactions.

Use sanitized, lawful fixtures; no bundled paywalled books, scraped restricted datasets or unnecessary personal data. Protect import entry points and file paths. Do not fetch arbitrary resource URLs as a side effect of importing a record.

**Deliverables:** Import/validate/dry-run commands, schemas and reports, sanitized fixtures, import documentation in `data/README.md` and tests.

**Validation and exit gate:** Import into empty PostgreSQL, then import the same version again and show unchanged effective content and no duplicate relationships. Demonstrate atomic rejection of malformed references/cycles/duplicates, handling of an update/conflict/retirement, preserved learner data and export/import fidelity. Reconcile imported counts and relationships with canonical data, including supplemental material. No bulk publication of unreviewed outlines.

## P10 — Public content, resource and search APIs

**Prompt:**

Execute P10 under the shared instructions. Implement the public API contracts from P05 against P09-imported PostgreSQL content. Keep endpoints read-only and explicitly public; draft, private, administrative and answer-key data remain protected.

Implement program/phase/module/topic hierarchy, prerequisites/competencies, resource assignments/library, learning paths, project/exercise descriptions and search. Use DTOs, service/repository boundaries where meaningful, Bean Validation and consistent errors. Support the agreed filters, bounded pagination and deterministic sorting; validate sort/filter input rather than interpolating SQL. Use PostgreSQL full-text/search capabilities if adequate to P02, with an appropriate index and relevance model; do not introduce a separate search cluster without measured need.

Handle unknown/retired slugs, redirects, stale rule metadata, empty results and unpublished relationships consistently. Avoid recursion and N+1 query traps when serializing hierarchy/prerequisites. Define public cache headers/versioning according to P03; never cache private or preview responses as public. Keep API docs aligned with the implementation and generate usable frontend types or client contracts without leaking entities.

**Validation and exit gate:** Controller/API and repository integration tests verify representative content, filtering intersections, pagination boundaries, malformed input, missing records, draft exclusion, unauthorized protected requests and absence of answer keys. Check query behavior against representative canonical scale. Record actual API examples and update `API.md`/OpenAPI; a mocked response cannot pass this gate.

## P11 — Public learning interface and SEO foundation

**Prompt:**

Execute P11 under the shared instructions. Implement the public home, curriculum/phase navigation, module and topic reading experience from P06 using the live P10 API. Use the selected rendering architecture and accessible components; remove prototype-only behavior from these journeys.

Build responsive navigation, phase/module cards and roadmap, prerequisite/readiness explanations, objectives and reading layout, authored lesson blocks, math/tables/code, prioritized resources, practice/mastery sections and next-lesson links. Show honest editorial status and counts derived from data. Label planned content clearly and avoid implying that an outline is a completed lesson. Ensure readable mobile tables/math and alternatives for visual diagrams. Do not display nonfunctional progress/bookmark controls as working features before their stages.

Implement semantic stable URLs, titles/descriptions, canonical links, OpenGraph, breadcrumbs, sitemap and robots policy for the current published slice; add appropriate structured data only when it accurately describes the page. Render substantive public content for crawlers without relying on client-only fetches. Protect preview/private surfaces from public caching and indexing. Sanitize authored Markdown/HTML and outbound links according to P03; do not execute arbitrary content code. Handle safe external links, missing resources, slow/error API responses and not-found/redirect behavior.

**Validation and exit gate:** Component/integration tests and Playwright verify home → curriculum → module → topic with the real stack and imported content, including a deep link, error state and small-screen viewport. Inspect representative screenshots and keyboard navigation; verify server-rendered content and metadata. Production frontend build passes; no placeholder copy, broken internal navigation or hard-coded curriculum duplicates in components.

## P12 — Discovery, resource library, paths and projects

**Prompt:**

Execute P12 under the shared instructions. Complete public discovery using P10 APIs and P06 designs. Deliver a useful library and learning paths, not merely additional link lists.

Implement resource search and combined filters for type, difficulty, cost, priority, topic/tag, source/geography and path where supported; make filter state URL-addressable with sensible clear/reset, counts, sorting and pagination. Resource details show rationale, prerequisites, assignments, access/cost limits and verification scope/date. Support keyboard operation, loading/empty/error states and readable mobile filter controls. Treat unknown cost or unverified links honestly.

Implement shared-module learning paths with audience, entry/exit competencies, effort ranges, prerequisites and ordered progression; add project catalog/detail pages with objectives, required skills, lawful dataset availability, deliverables and assessment criteria. Build global search across the agreed public entities with clear result types and useful relevance. Prevent drafts and protected answer material from appearing in search snippets or filter counts. Define how public next-lesson suggestions differ from personalized recommendations added in P14.

Implement ratings only if P02 assigns a public read experience here; authenticated submission/moderation must wait for its authorized implementation. Do not add dummy Tools navigation for future calculators.

**Validation and exit gate:** Real-stack journeys cover search → filtered resource → relevant lesson; path → module; and project prerequisites. Verify combined filters, reload/back navigation, empty results, pagination and unpublished-content exclusion. Accessibility checks and production build pass; update traceability and API docs for any justified contract change.

## P13 — Authentication and account lifecycle

**Prompt:**

Execute P13 under the shared instructions. Implement the identity/authentication decision from P03 across Spring and the frontend. Use supported framework security features rather than homegrown cryptography or an improvised authentication protocol.

Deliver registration, login, logout, account recovery and verification behavior as specified in P02, including safe password hashing, input validation, role assignment, session/token rotation and revocation, expiration and protected navigation. USER/ADMIN and any justified editor role must be assigned server-side. Define a secure bootstrap/invitation mechanism for initial admins; no public self-promotion or hard-coded admin credentials. If managed identity was selected, validate its callbacks, issuer/audience/state/nonce and provisioning boundaries as applicable. Future social login remains an extension unless scoped now.

Implement credentialed cookies/CSRF/CORS/SameSite/Secure/HttpOnly behavior for the actual deployment topology. Keep secrets and session material out of browser storage, URLs and logs where the chosen design requires it. Address brute-force/rate limits, account enumeration, recovery-token expiry/single use and safe redirects. Ensure SSR requests and caches cannot disclose one user's session or account data to another.

Use a local mail sink/test adapter for verification/recovery tests. Prepare provider configuration and templates; do not send messages to external recipients without explicit authorization or claim that unconfigured email delivery works. If account recovery requires an external service, distinguish completed local behavior from the remaining deployment configuration.

**Validation and exit gate:** Backend authentication/authorization tests and Playwright cover valid/invalid registration/login, logout, expired/reused recovery tokens, session expiration, CSRF where applicable, forbidden admin access and two-user isolation. Refresh/deep-link behavior works; production cookies/origin configuration is documented and tested at the appropriate boundary. Update `SECURITY.md`, `API.md`, account UX and `TESTING.md` with evidence.

## P14 — Progress, bookmarks, private notes and dashboard

**Prompt:**

Execute P14 under the shared instructions. Implement persistent learner workflows using the authenticated identity from P13. Derive ownership server-side for every read and write; no endpoint may trust a client-supplied user ID.

Deliver started/completed topic states, server-derived module/path progress, resume learning, bookmarks for planned entity types, private notes and a useful dashboard. Define progress denominators, optional lessons, changing content/path versions, retired content, retries and reopening a completed lesson consistently with P04. Self-marked completion must not become a mastery credential. Personalized next steps use explicit prerequisites, progress and assessment evidence with explainable fallback behavior, not unsupported AI predictions.

Provide accessible save/error/retry states, safe note rendering, length limits, duplicate/idempotent mutation handling and sensible concurrency behavior. Persist changes across logout/login and devices. Ensure private pages and API responses are not publicly cached or indexed. Implement resource ratings only if assigned to this release, with ownership, uniqueness, anti-abuse/moderation and honest aggregate-count rules. Keep analytics minimal and privacy-aware.

**Validation and exit gate:** API integration and Playwright tests cover complete → refresh → log out/in → resume, bookmark/unbookmark, note create/edit/delete, conflict/error handling, path progress under content changes and personalized next steps. Explicitly prove user A cannot read/update/delete user B's records through guessed IDs, list/filter endpoints or cached SSR content. Update contracts and progress semantics documentation; no localStorage-only substitute for persistence.

## P15 — Quizzes, exercises and project assessment

**Prompt:**

Execute P15 under the shared instructions. Implement the learning/assessment contracts using versioned P01 exercise and quiz designs, with representative reviewed content and safe feedback. Do not treat checking a box as demonstrating competence.

Support the question types, answer submission, attempt limits/retries, scoring, feedback and remediation specified in P02. Keep authoritative scoring on the server. Version and pin assessments so content edits do not alter historical scores. Do not send correct choices or solutions in initial public/client payloads; release explanations according to the designed attempt workflow. Handle multi-answer and numerical tolerances only when correctly specified, and keep conceptual critical-error gates distinct from a single percentage score.

Provide exercise instructions, data/notebook access, deliverables and rubric-based self-review or authorized review. Implement project submission/review only to the release contract, explaining which outcomes are self-assessed, automatically checked or reviewer-assessed. Do not falsely certify trading proficiency or guarantee profitability. Offer retry/remediation links and accessible feedback. Avoid arbitrary uploaded-code execution or a multi-tenant notebook runtime in version 1; if file uploads are in scope, implement the explicit storage, scanning, limits and access policy first.

**Validation and exit gate:** Unit tests establish scoring and numerical-boundary behavior using independently derived answers; integration tests establish version pinning, attempt ownership, limits/idempotence, protected solutions and correct feedback timing; E2E covers failed attempt → remediation → retry → mastery evidence. Inspect network payloads for answer leakage. Include negative tests for tampered scores, other users' attempts and stale quiz versions. Update `ASSESSMENTS.md`, `API.md` and `TESTING.md`.

## P16 — Administration, editorial review and publishing

**Prompt:**

Execute P16 under the shared instructions. Implement the complete admin/editor workflow defined in P02–P05, keeping it consistent with the canonical-files/import ownership decision rather than introducing an alternative content authority.

Deliver authorized create/read/edit/retire/reorder operations for programs/phases/modules/chapters/topics/subtopics, resources/assignments/tags, paths/prerequisites, exercises/quizzes/projects and rule/verification metadata as scoped. Provide preview, validation, draft → review → published transitions, revision history, optimistic concurrency and auditable publishing. Administrative interfaces must be usable and accessible but need not mimic learner layouts. Validate graph cycles, missing references, invalid slugs, incomplete metadata and assessment readiness before publication.

Implement safe conflict handling between admin edits and later canonical imports. Export/reconcile edits where the chosen workflow requires it. Publish related records coherently; invalidate public rendering caches, search indexes, sitemap and navigation as necessary. Keep drafts/previews and answer keys out of public APIs, SSR caches and search. Retire content with stable links/redirects and preserve learner history. Provide resource freshness/review queues without automatically asserting that a reachable URL is substantively verified.

Restrict every mutation server-side; hiding a button is not authorization. Protect import/export and preview endpoints. Any automated link-checker or URL fetcher needs restricted protocols/hosts as appropriate, private-network/metadata-address blocking, redirect and timeout/size limits, and an SSRF threat review before use. Audit meaningful changes without storing credentials or private learner notes in logs.

**Validation and exit gate:** An authorized admin edits a draft, resolves a validation failure, publishes, and sees the correct public/cache/search result. A learner and anonymous visitor cannot perform the same actions. Test concurrent edits, cyclic prerequisites, retirement, unauthorized previews, reimport conflict and audit attribution. Prove admin edits survive the documented workflow. Update editorial operations, `SECURITY.md` and content lifecycle documentation.

## P17 — Author and verify a bounded lesson batch

**Prompt:**

Execute P17 under the shared instructions for the lesson/module IDs specified in my request. If no batch is specified, select the next small coherent prerequisite-ready batch from `CONTENT_RELEASE_PLAN.md`, record its IDs and expected outputs before starting, and complete that batch. Do not silently expand the batch to the entire curriculum or call one batch the completed content release.

Read each selected source topic, the P01 teaching brief, exact reading assignments, competencies and assessment criteria. Author original teaching content appropriate to the learner's stage: why the idea matters, prerequisites, definitions and intuition, mechanics, worked numerical examples with units/assumptions, mathematical depth where justified, interpretation, realistic tradeoffs, failure cases/common mistakes, cited resources, practice, checkpoint questions, feedback and next steps. Explain how exposure, volatility/skew/regime, funding and execution affect examples where relevant. Avoid filler, repeated boilerplate, unexplained formulas and unsupported claims of trading edge.

Turn the planned exercises into usable packs with input data, reproducible environment, instructions, expected outputs/tolerances, solutions and rubrics. Keep protected quiz answers and pedagogical solution-release rules intact. Independently verify payoff/price/Greek calculations against analytical limits, parity/bounds, finite differences or a trustworthy independent implementation as appropriate. State conventions for rates/dividends/time/volatility, annualization and Greek units. Use lawful synthetic or licensed datasets; explain synthetic assumptions and do not pretend they establish historical profitability. Provide noncoding alternatives where the competency allows them.

Review source sections actually used. Verify time-sensitive market rules through the dated register, including effective dates and jurisdiction/instrument. Confirm source access, attribution, link quality and data/image/code redistribution rights. Do not copy substantial textbook/course material. If a claim cannot be supported, revise it, qualify it or keep the lesson unpublished.

Run technical/numerical review, pedagogical/prerequisite review, assessment review and accessibility/readability review. Check rendered math, tables, charts, code blocks and mobile layout in the real application. Import/publish only content meeting the editorial gate through P09/P16 workflows. Preserve provenance and stable IDs, update exact readiness states and content mappings, and record outstanding reviews honestly.

**Deliverables:** Authored lesson/exercise/project/quiz content under the canonical `data/` organization, numerical checks and permitted fixtures/notebooks, batch review report under `docs/curriculum/reviews/`, and updated `CONTENT_RELEASE_PLAN.md`/resource verification records.

**Exit gate:** Every item in this batch meets its stated objectives and has usable practice/feedback, verified examples and reviewed sources; published pages render correctly; import and affected workflow tests pass. Report IDs and counts changed by readiness state. Repeat P17 for remaining release batches. P18 is eligible only when **all** initial-release content criteria in P02 are met; later curriculum batches remain explicitly outstanding even after an initial launch.

## P18 — Integrated QA, accessibility and content release review

**Prompt:**

Execute P18 under the shared instructions. Validate the complete release candidate against the P02 requirement matrix and content release plan. Fix defects within this scope and rerun affected checks. Do not reduce assertions, replace integration paths with mocks or mark failing checks optional merely to obtain a green build.

Run backend unit, controller, authentication/authorization, repository and real PostgreSQL/Testcontainers integration tests; frontend component/integration/type/lint/production-build checks; and Playwright against the real frontend/API/database stack. Seed deterministic reviewed fixtures through the production importer. Keep test isolation and cleanup explicit. Record environment, data/content version and reproducible commands, with CI artifacts for failures.

Cover at least: visitor home → roadmap → module → lesson; filtered search/resource discovery; path/project navigation; register/login → complete a topic → persistent dashboard progress → bookmark/note → logout/login → resume; quiz failure/feedback/retry/versioned result; admin edit/review/publish → updated public page; and denied unauthorized/other-user actions. Include direct links, reload/back navigation, empty/error states, failed mutations, stale sessions, unknown/retired slugs and content-version changes. Verify empty-database migrations/import and the supported upgrade path.

Perform automated and manual accessibility checks: keyboard-only navigation/focus, labels/headings/landmarks, contrast, reduced motion, validation/feedback announcements, screen-reader-friendly math/chart alternatives and mobile layouts. Visually inspect representative pages at the supported widths with actual long titles and dense content; automated accessibility scans alone are insufficient.

Audit release content against objectives/prerequisites, citation/rights requirements, numerical conventions, exercise answer quality and publication status. Confirm planned outlines cannot masquerade as finished lessons; no broken internal paths, missing required resources, exposed answer keys, orphaned records or duplicate imports. Check every critical requirement has evidence and map defects to severity and owner.

**Deliverables:** Updated `docs/engineering/TESTING.md`, `docs/quality/RELEASE_QA.md`, test/evidence artifacts and a defect register linked to requirements and content versions.

**Exit gate:** All release-blocking journeys and required checks pass, content gates are met and accessibility defects violating the agreed target are resolved. Record lower-severity residual issues and their rationale. Missing Docker, unavailable browsers or other unexecuted mandatory checks block the affected readiness claim rather than being reported as success.

## P19 — Security and privacy release review

**Prompt:**

Execute P19 under the shared instructions. Review the actual release candidate against the P03 threat model and current security guidance, using authorized local/staging targets only. This is a verification and remediation pass on security implemented throughout development.

Review authentication/recovery/verification, password/session/token handling, CSRF, origin/CORS/cookie policies, role/ownership enforcement, privilege escalation, brute-force/rate limits, account enumeration and secure redirects. Test every private/admin/assessment/import/export endpoint and relevant SSR route for unauthorized access. Check private cache separation, public draft/answer leakage and production error bodies.

Review input validation and parameterized database access, content rendering/XSS, Markdown/math/code sanitization, outbound URLs, any server-side URL fetching/SSRF, upload/path traversal if applicable, headers/CSP, secrets/configuration, dependency and container vulnerabilities, CI permissions and exposed actuator/diagnostic endpoints. Ensure limits exist for expensive requests and oversized inputs. Do not scan external third-party sites or make claims based solely on a dependency scanner.

Review what personal data is collected, where it goes, retention/export/deletion behavior, analytics/cookies and logs/backups. Ensure notes, answers, credentials and recovery secrets are absent from inappropriate logs and telemetry. Prepare accurate user-facing privacy/terms/educational disclosures for the actual behavior; mark legal questions requiring qualified review instead of inventing compliance certification. Disclaimers cannot replace secure behavior or sound curriculum.

Fix confirmed issues and add focused regression checks. Document any exception with scope, compensating controls and expiry/review owner; unresolved critical/high findings or a violated release security requirement block deployment.

**Deliverables:** `docs/engineering/SECURITY.md`, security/privacy review evidence under `docs/quality/`, remediation records, updated threat model and tested configuration guidance.

**Exit gate:** No known unresolved critical/high release findings; ownership and trust-boundary tests pass; secure production configuration is concrete; residual limitations are explicit. Do not claim a professional penetration test or legal certification unless it actually occurred.

## P20 — Performance, reliability and SEO verification

**Prompt:**

Execute P20 under the shared instructions. Measure the real release candidate against the budgets and expected load from P02. Record hardware/runtime/database sizes and test conditions so results are reproducible; do not invent impressive numbers or optimize only an empty demo database.

Load representative canonical content and realistic learner/assessment records. Measure cold/warm public navigation, search/filter/pagination, authenticated dashboard and key mutations under justified concurrency. Inspect slow queries, query counts/N+1 behavior, PostgreSQL plans/indexes, pool utilization, memory/CPU and timeout/error behavior. Check connection limits and rate limits against the deployment topology. Optimize confirmed bottlenecks without adding unnecessary caching layers or infrastructure.

Measure frontend render/navigation performance, bundle sizes and agreed web performance metrics; evaluate code splitting, rendering strategy, images/fonts, lazy loading and cache headers. Test cache invalidation after admin publication and personalized-content isolation. Verify useful degradation when the API/database is unavailable; inspect readiness/health and bounded retry behavior rather than allowing retry storms.

Audit server-rendered educational content, semantic URLs, canonical/redirect behavior, metadata/OpenGraph, sitemap coverage, robots/noindex rules and accurate structured data. Verify private/admin/auth/preview pages do not enter the public sitemap or indexable content, and planned outlines follow the editorial indexing policy. Examine duplicate URLs from filters/pagination and link integrity. A Lighthouse score alone is not proof of load performance, accessibility or SEO correctness.

**Deliverables:** `docs/engineering/PERFORMANCE.md`, reproducible measurement scripts/results under `docs/quality/`, SEO checklist/results, and updated budgets/architecture decisions where justified.

**Exit gate:** Agreed budgets pass in the documented representative environment; critical queries and invalidation behavior are sound; substantive public content is crawlable and private content protected. Record limits of local testing and the production measurements required after deployment. Rerun affected regression/security checks after optimizations.

## P21 — Production packaging, operations and recovery preparation

**Prompt:**

Execute P21 under the shared instructions. Prepare a deployable, reviewable release and operational runbook; do not publish or purchase infrastructure solely because this prompt was selected.

Recheck the P03 hosting decision against current official documentation and the actual runtime: SSR/session/caching features, supported Java/Node versions, region/database connectivity, persistent storage, secrets, TLS, scaling limits and backups. Compare a manageable initial deployment with a growth path. Document dated cost assumptions and required account/domain/provider inputs. Avoid introducing AWS-scale operational complexity unless requirements justify it; static-only hosts cannot silently replace a required server runtime.

Build reproducible production container images with appropriate multi-stage builds, non-root execution, minimal runtime dependencies, pinned/reviewed inputs and health/readiness behavior. Maintain a documented local Docker Compose stack for database/backend/frontend and production configuration examples without secrets. Separate environment settings, public URLs, trusted proxy/origin/cookie policies, credentials and private services. Do not expose PostgreSQL or admin diagnostics unnecessarily.

Create CI/CD definitions for build/test/lint/type/contract/migration checks, dependency/secret checks, versioned artifacts and deployment with least-privilege secrets/access. Define release promotion, migrations and smoke checks. Prefer backward-compatible schema transitions; explain the boundary between reverting an app/content release and restoring a database. Never prescribe destructive down-migrations as a universal rollback.

Specify structured logs/correlation, backend health, frontend errors, uptime, latency/error rates, database/pool metrics and actionable alert thresholds. Configure chosen monitoring/error-reporting adapters where possible with sanitized payloads. Define backup schedule/retention/encryption/access and measurable RPO/RTO. Rehearse restore into a separate database, verify representative content/learner records and record recovery timing. Exercise failed deployment/recovery locally or in an already authorized nonproduction environment.

**Deliverables:** Production Dockerfiles and deployment/CI configuration under the agreed directories; `docs/operations/DEPLOYMENT.md`, `RUNBOOK.md`, `BACKUP_RESTORE.md` and `RELEASE_CHECKLIST.md`; artifact/version manifest and rehearsal evidence. Document fresh-machine setup, migration/import, admin bootstrap, secret rotation, routine release, incident response, rollback and restore.

**Exit gate:** Production builds and local container smoke checks pass; configuration and provider requirements are explicit; a restore has been demonstrated; release artifacts and rollback paths are concrete. If provider credentials or a deployment target are absent, identify exactly what remains provider-dependent without claiming a deployed system.

## P22 — Authorized deployment and release verification

**Prompt:**

Execute P22 under the shared instructions only for the explicitly requested target/environment and authorized budget. Inspect P18–P21 evidence and the current commit/artifact/content versions before any deployment. Do not deploy a different target or create paid services because credentials happen to be available. If necessary inputs or authorization are missing, finish all local preparation and state the specific missing item; do not repeat approval requests already answered in this project.

Deploy to staging first where the agreed topology provides it. Configure secrets, TLS/domain/proxy/origin policies, database access, migrations/import, secure admin bootstrap, monitoring and backups through the documented workflow. Run health/readiness, public content/search, authentication/recovery, learner persistence, assessments and admin publication smoke tests with dedicated test accounts/data. External email delivery tests require authorization for the actual recipients. Verify real cookie/CSRF/CORS behavior, caching, sitemap/robots and production error handling in the deployed environment.

Promote only according to the authorized release plan and evidence. Keep rollback available and stop/recover if release-blocking checks fail. Verify backup execution/restore access, alerts and deployed build/content version. Remove or retire test accounts/data using the designed safe process, without deleting real learner information. Document actual URLs and commands/results, sanitized logs and known operational limits.

**Deliverables:** `docs/operations/RELEASE_RECORD.md` identifying environment, actual URL, versions, migration/content versions, checks, evidence, backup state, rollback and remaining issues; updated runbook and project status.

**Exit gate:** The requested environment serves the expected release, critical deployed workflows pass and operations/recovery are usable. A staging release is called staging; a local build is called local. Report the supported release scope, not a guarantee of zero defects or completion of unpublished professional lessons.

## P23 — Maintenance, content currency and controlled expansion

**Prompt:**

Execute one bounded maintenance or expansion-planning pass under the shared instructions. Use the requested issue/feature, or inspect the current release record and select the highest-priority documented maintenance item. Record scope before changing anything. This prompt does not by itself authorize indefinite monitoring, recurring automation, new tasks, paid services or a public release.

Review relevant incidents, failed checks, security/dependency updates, content corrections, broken resources and rule freshness. Verify current official sources before changing contract specifications, tax/fee/margin details or supported dependency versions. Preserve effective-date histories and supersession rather than overwriting historical rules. Reassess learner friction and assessment quality from appropriately collected evidence; do not treat engagement metrics as proof of learning.

For a maintenance fix, reproduce the issue, assess affected content/users, implement the smallest coherent correction, add meaningful regression checks and update the relevant docs. For further curriculum publication, select a prerequisite-ready batch and apply P17's authoring/review gate. Keep the three canonical gap-review lenses active as new specializations are added; repeat affected reviews when new evidence changes assumptions.

For a requested future feature—flashcards/spaced repetition, journal, payoff/Greeks/BSM/volatility visualizer, strategy builder, paper trading, ratings or learning analytics—write a bounded extension brief first: learner problem, requirements, data rights, numerical/security/privacy implications, architecture/schema/API/UX changes, tests and rollout/rollback. Reuse existing content/competencies. Calculators require explicit conventions, independent numerical checks and model limitations. Paper trading requires realistic costs/assignment/margin rules and clear simulation labels; it must not silently add live execution. Implement only when the selected request includes implementation, then apply the relevant P02–P22 gates proportionately.

**Deliverables and exit gate:** A verified maintenance change or concrete extension brief, fresh evidence/status records and explicit remaining work. If deployment was not requested, leave the release prepared locally. Do not label the overall platform complete while promised curriculum, required product features or mandatory validation remain unfinished.

## Resume and defect-repair instructions

To resume interrupted work, use: **“Resume Pxx from PROMPTS.md. Read its execution log and actual artifacts, continue the first incomplete item, and validate its exit gate. Do not restart completed work or advance to the next prompt.”**

For an implementation defect, use: **“Fix [observed behavior] within Pxx. Reproduce it, identify the cause, repair the responsible layer, add a meaningful regression check, rerun affected gates and update the execution log. Preserve unrelated work and the agreed architecture.”**

If new evidence invalidates a prior decision, amend that decision and affected contracts explicitly. Do not hide a changed API, schema, auth model or publication policy inside an unrelated frontend task. A blocked external dependency does not justify fabricating evidence or silently substituting a lesser acceptance criterion.

## Project completion and historical phase mapping

An initial release is complete only for its recorded P02 scope when P18–P22 establish that its content, workflows and operational checks pass. The broader project remains open until promised curriculum expansion and required capabilities are delivered or the user explicitly changes the scope. Future optional features remain a visible backlog; they need not block a correctly described initial release.

Before claiming the full intended platform is complete, reconcile **every** requirement with its implementation/content artifact and validation; repeat the professional gap question from P01; review architecture, database, security, UI/accessibility, research/content and deployment; and list any residual limitations. Publishing a small foundation course must not be described as completing the beginner-to-professional learning system.

| Original master phases | Prompt sequence |
|---|---|
| 1–4: supplied-file analysis, research, canonical curriculum, resource database | P01, reusing the completed inventory |
| 5: product requirements | P02 |
| 6: architecture | P03 |
| 7: database | P04 design, P08 implementation |
| 8: APIs | P05 contracts, P10 and later feature stages |
| 9: frontend design | P06 |
| 10–11: backend/frontend implementation | P07–P16, with tested end-to-end feature stages |
| 12: seed curriculum | P09 importer, P17 reviewed release content |
| 13: testing | Every implementation stage; integrated P18 review |
| 14: security review | Secure design throughout; P19 release review |
| 15: performance review | Budgets from P02; P20 measured review |
| 16: deployment preparation | P21; separate P22 only when deployment is requested |
| Ongoing expansion and operations | Repeated P17 and P23 |

The importer intentionally precedes API/UI feature work so real canonical data drives implementation. This changes the original seed timing while preserving its purpose. Research and all prerequisite product/system design still precede application implementation. Tests accompany every implemented feature rather than being postponed to the final review.
