# Phase 1 — Inventory of the supplied curriculum

Reviewed 21 September 2026. Status: complete for the three supplied files. This is an inventory and readiness assessment, not a claim that the curriculum or application is complete.

## What was read and how it was reconciled

All three files were read in full through their distinct content: all module and topic records, all resource annotations, and all roadmap prose, tables, assessments and appendices. Repeated content was reconciled field by field rather than counted as independent research. The JSON was parsed in full; every topic's classification and scope sentence was compared with the Markdown. The inventory script also rejects unexplained text between the knowledge map's module records.

| Supplied file | Role | Size | Logical lines |
|---|---|---:|---:|
| [options-master-knowledge-map.md](../../sources/roadmaps/options-master-knowledge-map.md) | Taxonomy, reference library, learning design and source self-audits | 280,774 bytes | 4,926 |
| [options-learning-roadmap.md](../../sources/roadmaps/options-learning-roadmap.md) | Companion learning sequence, dependencies, assessment briefs and mastery expectations | 64,252 bytes | 444 |
| [options-curriculum-catalog.json](../../sources/roadmaps/options-curriculum-catalog.json) | Machine-readable subset of the same curriculum | 712,027 bytes | 24,282 |

The JSON's last line has no terminating newline, so `wc -l` reports one fewer line. The files declare a research checkpoint of **17 September 2026**. That is an inherited statement, not a new verification date. Original files remain unchanged. Exact SHA-256 digests are in [the source manifest](../../research/inventory/summary.json).

The workspace initially contained only these three files, with no application, build configuration, database, tests, deployment files, or Git repository. No applicable `AGENTS.md` was found in the directory or its ancestors.

## Verified quantities

| Existing structure | Count | What the count means |
|---|---:|---|
| Knowledge domains | 14 | Taxonomy groups, not learning phases |
| Modules | 67 | Stable IDs M01–M67 |
| Topic entries | 1,019 | Named scope specifications, not authored lessons |
| Subtopic scope strings | 1,019 | Unstructured descriptions containing multiple concepts; no independently identified subtopic records |
| Learning stages | 17 | Stages 0–16, with gates and estimated effort ranges |
| Module prerequisite edges | 186 | Entry dependencies qualified by prose about selected competency depth |
| Annotated resources | 70 | R01–R12 and R16–R73; R13–R15 are unused identifiers |
| Module/resource associations | 239 | Broad teaching and coverage anchors |
| Topic/resource associations | 3,656 | All inherited from modules; not 3,656 independently researched citations |
| Module exercise/mastery pairs | 67 | One broad exercise brief and one checkpoint per module |
| Integrated capstone briefs | 7 | Descriptions of work products; no deliverable packs or detailed scoring rubrics |
| Specialization branches | 7 | Module ranges and depth guidance; no formal executable path definitions |
| Decision-card questions | 23 | Reusable trade-analysis questions, not a scored quiz bank |
| Existing self-audits | 2 | Supplied role review and reasoning review; not external certification |

[Complete module inventory](../../research/inventory/MODULES.md) lists every module, its topic count, stage, prerequisites, source IDs and source link. [Topics](../../research/inventory/topics.json) preserves every topic and subtopic scope verbatim, with JSON pointers and Markdown line provenance. [Resources](../../research/inventory/resources.json) preserves every original resource record and its reverse module associations.

## Domain inventory

| Domain | Modules | Topics | Existing emphasis |
|---|---|---:|---|
| Financial and market foundations | M01–M05 | 72 | Arithmetic, instruments, clearing, order handling, financing and costs |
| Fundamentals, macro and events | M06–M09 | 52 | Statements, policy, intermarket effects, event timing and conditional outcomes |
| Mathematics and inference | M10–M14 | 71 | Probability, inference, time series, calculus, numerical foundations, stochastic finance |
| Price behavior and technical methods | M15–M20 | 102 | Charts, candles, patterns, indicators, volume and interpretation limits |
| Option contracts and structures | M21–M28 | 117 | Contracts, assignment, chains, single/multi-leg positions, synthetics and financing |
| Pricing, Greeks and hedging | M29–M34 | 84 | No arbitrage, BSM/trees, numerical methods, primary/higher Greeks, hedge accounting |
| Volatility and volatility trading | M35–M41 | 101 | Realized estimators, premiums, surfaces, events, VIX, models, dispersion and relative value |
| Futures and cross-asset derivatives | M42–M44 | 46 | Futures lifecycle, rates/FX/commodity conventions, exotics, OTC terms and XVA |
| Risk and portfolio construction | M45–M49 | 79 | Sizing, ruin, stress, collateral, portfolio effects, model and operational controls |
| Microstructure, execution and management | M50–M53 | 62 | Adverse selection, inventory, queues, dealer inference, execution and adjustment policies |
| Research, data and software | M54–M58 | 78 | Point-in-time data, falsification, backtesting, statistical learning, Python and automation |
| Decision practice and professional development | M59–M61 | 58 | Complete systems, behavioral controls, journaling, attribution and uncertainty |
| Rules, operations and market-specific practice | M62–M64 | 46 | US, India and other jurisdictions; contract/rule worksheets |
| Evidence, failure analysis and professional practice | M65–M67 | 51 | Myths, documented failures, mandates, risk reporting and model governance |

Difficulty: **142 Beginner, 438 Intermediate, 361 Advanced, 78 Professional/Quantitative**. Importance: **183 Essential, 702 Very Important, 95 Useful, 39 Specialized**. These are source classifications, not externally validated priorities.

Evidence labels: **608 definition/conditional-theory entries, 96 rule/specification entries, 9 empirical-research entries, 298 practitioner-method entries, 8 folklore/overstated-inference entries**. These labels classify topics; they do not count papers or establish evidence quality. The nine empirical labels occur in the psychology module, while empirical material also appears elsewhere under other labels. Evidence evaluation therefore cannot be inferred solely from this code.

## Learning sequence already present

The supplied stages move through financial orientation; market/account mechanics; probability and core mathematics; underlying/macro/time-series context; chart literacy; options/local operations; pricing/Greeks; realized/implied volatility; risk/funding/behavior; structures/surfaces; execution/management; research/software; hedging/futures/portfolios; empirical specialization; quantitative models; cross-asset/exotics; and professional integration.

The declared module order satisfies all 186 prerequisite edges, including ordering within a stage. The graph is acyclic, with no missing prerequisite IDs or forward-stage dependencies. The documents explicitly distinguish entry competencies from every advanced extension in a module. That distinction is currently prose, not structured dependency logic.

Risk, journaling and operational discipline are introduced in an initial safety briefing, then revisited in full. Mathematical depth is similarly revisited. All-stage effort ranges must not be summed into a promise for a beginner path; the source explicitly treats specialist branches and cumulative mastery estimates differently.

Existing branches:

1. Discretionary directional options.
2. Systematic option strategies.
3. Volatility relative value.
4. Options market making.
5. Portfolio hedging and overlays.
6. Quantitative derivatives/modeling.
7. Rates/FX/commodity/OTC specialization.

An absolute-beginner path, a distinct retail path, and an explicit India-focused path are not defined as path records. Their component material exists. The source sentence declining to infer an India focus reflects its original context; the current project brief explicitly requires India and global coverage.

## Existing practice and assessment design

Every module has an exercise brief and mastery checkpoint. Examples include a cash-flow ledger, assignment cases, numerical pricing convergence, a synchronized volatility surface, a hedge replay, a funding ladder, a preregistered falsification project and an outage drill. The 67 complete pairs are preserved in [modules.json](../../research/inventory/modules.json).

The seven capstones are: contract/operations examination; pricing/risk notebook; volatility research report; strategy laboratory; portfolio stress/funding report; research falsification project; simulated trading desk.

Shared standards require explanation, an unfamiliar calculation or reconstruction, assumptions/failure analysis and application. A proposed written-quiz threshold of 85% is coupled with no unresolved errors in units, cash obligations, assignment, leverage or loss bounds. The source correctly describes this as a proposed educational standard, not a validated certification threshold.

The strategy dossier has ten areas: exact construction, economic thesis, payoff/profit, probability/value, dynamic risk, environment, selection, management, operations and validation. Separate specifications govern indicators and chart patterns. An eleven-step lesson format is described. These are **requirements for future material**, not already completed dossiers or lessons.

No authored quiz bank, choices, answer explanations, worked numerical lesson sequence, supplied exercise dataset, runnable notebook, reference solution, detailed grading rubric or learner submission system exists in the three files. Common mistakes and failure modes occur inside topic scopes and shared guidance, but not as complete per-module lesson packages.

## Resource inventory and metadata readiness

The library contains textbooks, university courses, primary papers, regulatory/exchange material, software documentation, empirical datasets and practitioner references. Named anchors include Hull, Natenberg, Sinclair, Gatheral, Shreve, Harris, MIT OCW, OCC, Cboe, CME, FINRA, SEC, CFTC, SEBI, NSE, BSE and QuantLib. There are no separately cataloged YouTube/video lesson records; university course pages may contain videos.

All 70 resources contain exactly seven fields: `id`, `title`, `url`, `level`, `kind`, `why`, `access`. Their URLs are unique and every resource is used by at least one module. The 46 distinct `kind` strings and ten level strings have not been normalized into a product taxonomy.

| Requested metadata | Present state |
|---|---|
| Title, URL, type, difficulty, rationale | Present, with broad free-text type/level values |
| Author/organization | Often embedded in title, not a separate field |
| Free/paid | Not explicit; `access` describes research access and cannot safely stand in for cost |
| Study duration | No resource-level estimates |
| Covered topics | Inherited module anchors; no precise section/page/lecture or claim mapping |
| Prerequisites | No resource-specific competency requirements |
| Essential/Recommended/Advanced/Optional/Reference | No resource priority field; topic importance is a different dimension |
| Publication date/edition | Sometimes embedded in titles or notes; not consistently structured |
| Foundational/optional status and geography | Not explicit |
| Last verified date and verification evidence | No per-resource fields; only an overall checkpoint and access claims |
| Rights/licensing | No permission record for redistribution, excerpts, datasets or exercises |

Examples requiring fresh investigation include R01's ODD edition note, R45's model-risk guidance claim, R56's 2026 SEBI study, R59's tax legislation and R61's margin rule. R60 explicitly says its BSE file-format document is not current product-specification verification. R44 is a publisher catalog PDF and R49 a publications directory rather than a direct reading assignment. These are verification tasks; no link is declared false merely because it needs checking.

## Duplication, consistency and import loss

- **Three companion representations:** all module metadata, all topic records, all resource records, all 67 exercise/mastery pairs and all stage rows reconcile. Roadmap Parts B, C, D, F, G and H match the knowledge map after local-link normalization. This is repeated representation, not three independent corroborating sources.
- **Four repeated topic titles:** Corporate actions (M03.12/M54.06), Auctions (M04.12/M50.10), Expected value (M10.06/M45.04), Position reconciliation (M22.15/M49.05). Their contexts differ; title equality is not grounds for deletion.
- **Intentional concept recurrence:** parity in M24/M28/M29; volatility in M20/M35; data bias in M11/M54–M56; dealer inference in M23/M51/M65; sizing and cash risk in M05/M45/M47. These support increasing depth, but need explicit cross-links in authored lessons.
- **Inherited topic metadata:** all 1,019 topic rows repeat their module's category, source set, prerequisite set and stage. This is not topic-specific dependency or source review.
- **JSON omissions:** capstones, specialization branches, decision card, assessment policy, strategy/pattern specifications, lesson format, role audits, resource-domain recommendations and currency protocol exist only in Markdown. They are preserved verbatim in [supplemental.json](../../research/inventory/supplemental.json).
- **No factual divergence found between copies:** this establishes consistency, not correctness or present-day currency of external claims.
- **Unused IDs:** R13–R15 are unreferenced gaps in the numbering. Preserve existing IDs; the files do not explain why those numbers are absent.

## Readiness conclusion

The supplied material has broad, thoughtful **taxonomy coverage**, particularly in volatility, risk, operations and evidence discipline. The largest observable shortfall is the distance between a scope map and a usable learning system: lesson depth, precise reading assignments, assessable competencies, worked exercises, feedback, authored paths and content maintenance.

Professional coverage still needs independent gap research. Named inclusion of Heston, dispersion, market making or stress testing is not evidence of mastery-level teaching. No claim of curriculum completeness follows from these counts or from the supplied self-audits.

The next evidence questions are recorded in [the initial gap review](reviews/phase-1-gaps.md), with project sequencing in [TODO.md](../project/TODO.md).

## Reproduce the audit

```sh
python3 scripts/inventory_sources.py
python3 scripts/inventory_sources.py --check
```

The first command regenerates seven inventory artifacts. The second validates all comparisons and detects artifact drift without writes. Both read the original files without modifying them. This is a content-integrity check, not an application test suite or an external-link verification tool.
