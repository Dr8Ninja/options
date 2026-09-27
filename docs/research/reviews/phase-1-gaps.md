# Initial gap review — coverage, teaching depth and delivery

Date: 21 September 2026. Baseline: [Phase 1 inventory](../INVENTORY.md). Status: two new review passes completed against the supplied material; independent literature and rule verification remains in progress. The supplied documents' two self-audits are preserved separately and do not close these gaps.

The review question is: **What would a professional options trader, volatility trader, quantitative researcher, market maker, derivatives professor, risk manager, or systematic trader expect to see that is still missing?**

“Present” below means named and scoped. It does not mean a lesson has been written, a derivation verified, a dataset licensed, or an assessment validated. “Missing” is used for absent artifacts or explicit material, not for topics that already occur under a different name.

## Pass 1 — Professional competence

| Lens | What is already present | What remains to demonstrate | Work product that could close the gap |
|---|---|---|---|
| Options trader | M21–M28, M32, M45, M52–M53: contract literacy, structures, risk and execution | No completed strategy dossier; no realistic quote/fee/assignment case with answer and changing Greeks | A dossier per supported structure, exact signed legs, multiple spot/IV/time scenarios, cash ledger, operational traps and alternatives |
| Volatility trader | M34–M41: realized estimators, forecasts, surface dynamics, event variance, carry, dispersion | No replicable forecast-to-trade study, gamma-weighted hedge replay, strip replication or dispersion hedge ledger | Surface and hedging labs with synchronized inputs, uncertainty, costs, finite strikes, jumps and a reconciliation of residual P&L |
| Quantitative researcher | M11–M14, M31, M40, M54–M58: inference, calibration, point-in-time data and validation | No benchmark dataset, independent price checks, convergence runs, experiment registry or held-out results | Versioned synthetic fixtures and a legally usable historical sample; convergence reports, leakage counterexamples and reproducible rejection criteria |
| Market maker | M49–M52, M58, M67: quotes, inventory, queues, cost, dealer-sign ambiguity and incidents | No coherent quoting/risk simulation or order-event replay; inferred dealer exposure remains a scope brief | Replay with quote/fill/cancel races, inventory limits, surface constraints, hedge costs and markout analysis; opposing dealer-sign scenarios |
| Derivatives professor | Replication → trees → BSM → stochastic finance; mathematical conventions and specialist depth | No topic-level entry competencies, worked derivations, diagnostic placement or graded transfer problems | Concept/derivation/example sequences, unit conventions, unfamiliar variants, correct solutions, common-error feedback and remediation |
| Risk manager | M45–M49: ruin, sizing, full revaluation, tails, collateral, liquidity and model controls | No portfolio stress book or cash-call timeline proving survival through the path | Dated funding ladder, reverse stress, changing margin/borrow assumptions, escalation triggers and realistic inability-to-exit cases |
| Systematic trader | M54–M59/M61: research design, lifecycle accounting, holdouts, capacity and monitoring | No event-driven reference backtest, attribution checks, data contract or promotion/retirement record | Hand-reconciled trade fixtures, delayed/partial fills, expiry and corporate-action cases, trial registry and a paper-only operational run |
| India specialist | M63's 19 entries, plus M22/M47/M54: contracts, taxes, physical delivery, margin, API rules | No effective-dated contract or rule records; no India path; no precise circular-to-lesson mapping | Dated NSE/BSE contract comparisons, tax-base cases, expiry/holiday transitions, delivery obligations and rule-conflict resolution |

These are depth and evidence gaps. Adding more module names would not close them.

## Requested-content crosswalk

| Requested area | Existing locations | Assessment of supplied coverage |
|---|---|---|
| Calls, puts, strike, expiry, premium, moneyness, intrinsic/extrinsic, styles and settlement | M21.01–17, M22 | Broad scope present; numerical examples and operational cases absent |
| Orders, exchanges, clearing, spreads, volume/OI, slippage, financing and margin | M03–M05, M23, M47, M50–M52 | Broad scope present; venue-specific simulations and dated specifications absent |
| Single-leg, stock-linked, vertical, volatility, time, ratio, synthetic and box structures | M24–M28 | Required structures represented; classifications by direction/vol/skew/carry are dossier requirements, not populated fields |
| Primary/higher-order Greeks and cross-gamma | M32–M34, M41.16 | All requested names represented, with sign/unit cautions; analytic/numerical verification and scenario teaching absent |
| No arbitrage, parity, BSM, trees, measures, replication, PDE, Monte Carlo, finite difference | M13–M14, M29–M31 | Broad scope present; substantial mathematical teaching and reproducible implementations remain |
| Local/stochastic volatility, jumps, Heston, SABR and calibration | M40, M31 | Present, including SVI/SSVI, rough volatility and model-risk limitations; primary reading assignments and experiments incomplete |
| Realized/implied/forward volatility, surface, skew, cones, events, regimes and forecasting | M12, M35–M38 | Broad scope present; detailed estimator comparisons, event clock conventions and empirical evaluation are still briefs |
| Dispersion, correlation, variance/volatility swaps, VIX and volatility relative value | M39–M41, M44.09 | Present; direct methodologies, term-sheet exercises and replication/hedge cases need authoring |
| Delta/gamma/vega hedging, discrete error, costs, gamma scalping, portfolios | M34, M41, M48 | Present, including self-financing accounting; no runnable hedge replay or reconciled P&L example |
| Probability, statistics, calculus, linear algebra, stochastic processes, optimization, inference and ML | M10–M14, M55–M57 | Present; beginner bridges and selected-track competencies require finer sequencing |
| Python scientific stack and QuantLib | M58, R33/R52/R55, M12/M57 | NumPy/pandas/SciPy are named; plotting and statistical learning are general. No dedicated statsmodels/scikit-learn/matplotlib assignments or notebooks |
| Data providers and broker/exchange APIs | M54, M58, R18/R51 | Provenance and licensing are recognized; no accessible reproducible dataset plan or provider entitlement review. yfinance is not cataloged |
| Sizing, ruin, Kelly, VaR/ES, tail/correlation/liquidity/model/margin/assignment risk | M45–M49, M22, M61 | Broad coverage with good failure awareness; stress fixtures and validation of measures absent |
| Psychology, decision bias, journaling, rules, process/outcome and statistical edge | M60–M61, M55, M65 | Requested themes present; repeated practice, feedback and scored competency evidence absent |
| Dealer positioning, flows, pinning, 0DTE, market making and execution economics | M23, M38, M50–M52 | Present with inference caveats; no data-backed comparison of competing explanations |
| Barriers, Asians, digitals, lookbacks, cliquets, structured products, exotics | M43–M44 | Present at specialist scope; no term sheets, numerical labs or mandate-specific depth |
| 1987, LTCM, 2008, 2018, COVID, meme stocks and short-vol failures | M66.10–16, R42/R47/R67/R68 | Some dedicated case anchors; 1987/2008/2018/March 2020 are grouped into one topic, without individual evidence packs |
| India versus global markets | M62–M64 | Explicit branches exist; MIDCPNIFTY is not individually named in M63, which uses “other live index” coverage. Current product universe must be sourced, not frozen from a name checklist |

## Pass 2 — Can a learner and an application use this correctly?

| Gap ID | Finding | Severity for publication | Required resolution |
|---|---|---|---|
| G01 | 1,019 topic descriptions are scope statements, not teaching units | Blocking | Define lesson depth and publication status; write and review the lessons being released |
| G02 | Module objectives, “why it matters,” checkpoint questions and durations are not explicit module fields | Blocking | Author measurable objectives and estimates tied to actual assignments; retain stage estimates separately |
| G03 | The graph is valid, but dependencies refer to whole modules while prose permits partial competencies | Blocking for recommendations | Specify entry/core/specialist competencies and soft versus mandatory dependencies; prove path reachability |
| G04 | Python is formally in stage 11 after backtesting, while earlier exercises involve implementation | High | Separate elementary coding preparation from production automation; preserve manual alternatives where appropriate |
| G05 | Six chart/indicator modules precede options in the general roadmap; most are already marked reference/practitioner material | High | Research and define an options-first core path with chart material available by interest; do not silently delete the reference taxonomy |
| G06 | Beginner, retail and India learning paths are not explicit data | Blocking for those paths | Define ordered, prerequisite-complete paths that reuse canonical content, with entry and exit competencies |
| G07 | The JSON drops capstones, branch guidance and shared assessment standards | Blocking for import | Promote all learning structures into canonical content with stable IDs and provenance; test a lossless import |
| G08 | Subtopics are prose strings, and chapters do not exist | High | Split into authored learning units only where useful; do not mechanically split every comma into a database record |
| G09 | Topic source associations are uniformly inherited, without precise reading assignments | Blocking | Map source sections/pages/lectures to competencies and claims; record what a source does not support |
| G10 | All resources lack explicit cost, time, priority, prerequisite, geography and per-source verification fields | Blocking for library quality | Research and populate verified metadata; preserve unknown values without invention |
| G11 | Abstract/contents checks and full-text checks are mixed in access prose | Blocking for evidence claims | Separate discovery, access, bibliographic review, content review, claim verification and numerical replication |
| G12 | No worked exercises, datasets, answer keys, fresh variants or scoring rubrics | Blocking | Author original exercise packs, numerical reference answers, tolerances and feedback linked to competencies |
| G13 | The 85% threshold and no-critical-error rule are descriptive only | Blocking for mastery claims | Define critical-error tags, scoring, retries, remediation, rubric versions and evidence of transfer |
| G14 | No licensing records for course materials, market data or redistribution | Blocking for hosted third-party assets | Prefer links; review rights before copying content/data; distinguish software license from data entitlement |
| G15 | Rule currency is described, but there is no governed versioned register | Blocking for current-rule lessons | Record jurisdiction, instrument, issuing body, publication/effective/check dates, supersession, scope, review owner and conflicts |
| G16 | BSE specification verification was explicitly incomplete in supplied research | High | Locate operative BSE product notices and contract master; retain unresolved status until reconciled |
| G17 | Historical crash episodes lack individual case files | High for case-study release | Separate timelines, primary evidence, competing explanations, exposure/cash accounting and control limits |
| G18 | Greek formulas and conventions are named but not a unified numerical contract | Blocking for calculators | Specify units, time signs, dividends, carry, exercise model, edge cases and independent benchmarks |
| G19 | Model calibration from American quotes is only implicit in broad exercise-model/surface topics | Advanced research candidate | Investigate early-exercise premium removal, discrete dividends and de-Americanization error; decide whether to add an explicit subtopic |
| G20 | Study-time estimates exist only for stages/mastery levels | Medium | Estimate assigned readings and work per lesson; mark editorial estimates and revise with observed learner data |
| G21 | No product, database, API, UX or engineering artifacts exist | Blocking for application | Complete phases 5–9 before implementation; keep research records distinct from production content |
| G22 | No author/reviewer workflow, content revisions or correction history | Blocking for public maintenance | Define draft/review/publish/retire states, verification ownership, editorial checks and migration of learner progress |
| G23 | No accessible mathematical presentation or low-bandwidth/noncoding alternative | High | Design semantic formulas, keyboard support, textual graph equivalents, accessible examples and manual exercise variants |
| G24 | Resource titles/types/evidence labels have different semantics and granularity | High | Use explicit controlled vocabularies; do not treat the three-letter classification code as searchable topical tags |
| G25 | Bookmarking/completion are not evidence of skill; no learner model exists | Blocking for progress claims | Separate viewed, self-completed, attempted and demonstrated mastery with versioned assessment evidence |

## Proposals to investigate, not established curriculum decisions

Retain the substantial volatility/risk/operations backbone. Test a shorter core route into contracts and payoffs, with just-in-time mathematics and coding, while preserving rigorous specialist paths. Treat chart-pattern material as searchable reference unless a selected path justifies deeper study. Expand worked examples, assessment feedback and precise readings before chasing a larger topic count.

Investigate explicit American-quote surface calibration and benchmark replication. Neither warrants a new top-level module solely because it lacks a named topic. Their fit within M30/M37/M40 and M48/M56 should be decided from actual teaching requirements and literature.

## Closure rule

Every gap must have an owner, disposition (retain/expand/resequence/merge/reference/defer), supporting evidence, target content IDs and a checkable acceptance condition before it is marked closed. These two passes establish a research agenda; they do not certify professional completeness. Repeat the role review after canonical curriculum design and again against the material actually published.
