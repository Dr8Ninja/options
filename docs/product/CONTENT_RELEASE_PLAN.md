# Content release plan

P02 · R1 Foundations · contract version 1.0 · 22 September 2026.

**Current state: 0 of 36 release lessons authored and reviewed; 0 of 6 release gate packs approved; the release project is a specification.** The counts below are obligations, not completed content. P01's 1,025 topics, seven paths and twelve capability projects remain the canonical map. This plan selects a coherent course without reducing that map to the initial offering.

The product behavior and acceptance suite are in [PRODUCT_REQUIREMENTS.md](PRODUCT_REQUIREMENTS.md). This file defines CR-01–CR-08, the content conditions tested before P18. Stable canonical IDs are retained; F01–F36 are sequence labels within this release contract, not replacement topic IDs or a proposed database key.

## Course outcome, entry and boundaries

The learner will read a hypothetical option contract, distinguish rights from obligations and premium from total cash exposure, calculate long/short and covered-call outcomes after specified costs, explain exercise/assignment and temporary funding risks, use a stated loss budget including the possibility of zero contracts, and reconcile positions with cash. This is a foundation outcome; it does not establish market forecasting, a trading edge, a valuation model or operational readiness to trade.

`R1-FND` is a new release-specific course view: **Foundations: contracts, cash and risk**. Entry requires reading a short table and elementary arithmetic. An untimed four-question diagnostic routes to worked arithmetic/percentage help in F01–F03. There is no coding, calculus, brokerage account, paid reading or real-money requirement. The full original scope of each selected topic remains the authoring obligation; short prerequisite explanations noted below are embedded where consumed. An editor may split an overly broad topic only with stable successor mappings and an explicit change to this release contract.

Estimated learner effort is **28–49 hours**: 36 lessons at roughly 35–60 minutes including practice (21–36 hours), six gates at 15–25 minutes (1.5–2.5 hours), a two-to-four-hour dossier and three-to-six hours of optional remediation. These are editorial planning estimates, not measured learner time or a proficiency guarantee. Diagnostics may reduce study time but not remove required fresh assessment evidence. P17 records actual estimates per authored lesson; a pilot must revise these ranges if the content is materially longer.

## Exact sequence and dependency audit

The table is the R1 authoring manifest. Its topic IDs must all resolve in `data/v1/topics.json`. Listed F dependencies are hard **lesson-level** preparation, always earlier in this sequence; other earlier lessons remain recommended context. Gates follow each six-lesson batch; the next batch's gate requires the previous gate, though public reading remains open. These narrow outcomes do not satisfy entire C-Mxx competencies. P04/P09 must represent the release view without overwriting the broader canonical graph.

| Step | Canonical topic | Assessable result | Hard preparation / necessary teaching bridge |
|---|---|---|---|
| F01 | M01.01 — Units and signs | Convert per-unit quotes to signed contract cash and distinguish points, percentages and basis points | None; reading a table and multiplication taught within the lesson |
| F02 | M01.02 — Percent change | Compute sequential loss/recovery percentages with the correct base | F01 |
| F03 | M01.06 — Profit and loss | Reconcile gross/net, realized/unrealized and cash versus accounting value | F01; define opening/closing ledger entries before using them |
| F04 | M01.07 — Capital and solvency | Separate available cash, account equity, collateral and liabilities | F03 |
| F05 | M01.11 — Risk capital | Identify money that is unavailable for an exercise budget and a finite learning budget | F04; hypothetical amounts, no prescribed personal allocation |
| F06 | B01.01 — Loss, sizing and assignment intuition | Explain in ordinary language why a small premium can accompany a large obligation | F01, F04, F05; introduce a right and a promise before formal option terminology |
| F07 | M21.01 — Calls | Identify buyer's right, writer's obligation, premium direction and exercise consequence | F06 |
| F08 | M21.02 — Puts | Distinguish a right to sell from the writer's purchase obligation | F07 |
| F09 | M21.04 — Contract specification | Read underlying, strike, expiry, multiplier, currency and deliverable without assuming a universal contract | F01, F07, F08 |
| F10 | M21.05 — Premium quotation | Translate quoted premium/ticks and quantity into debit or credit | F09 |
| F11 | M21.06 — Moneyness | Classify calls/puts and distinguish spot and forward references | F07, F08, F09; define forward as an agreed future delivery price, not a forecasting lesson |
| F12 | M21.07 — Intrinsic value | Calculate exercise value and explain why it differs from a tradable pre-expiry value | F10, F11 |
| F13 | M21.08 — Extrinsic and time value | Explain residual premium, model inputs and limits of the shorthand decomposition | F12; simple carry/discounting explanation before any example where residual intuition fails |
| F14 | M21.09 — Expiry terminology | Distinguish last trade, expiration, instruction deadline and settlement date | F09; all example dates are invented and explicitly labeled |
| F15 | M21.10 — Exercise styles | Distinguish when exercise is permitted, including Bermudan schedules, from geography | F07, F08, F14 |
| F16 | M21.11 — Settlement styles | Describe cash, physical and delivery-into-futures outcomes as different obligations | F04, F09, F15; introduce futures delivery concept without claiming futures-trading mastery |
| F17 | M03.06 — Trade lifecycle | Follow order, acknowledgment, execution, clearing and settlement, naming responsible parties | F09, F16; a short broker/exchange/clearing role explanation is embedded |
| F18 | M22.03 — Assignment mechanics | Trace a holder's choice through clearing/broker allocation to a writer's position | F15, F16, F17 |
| F19 | M22.04 — Early assignment | Explain why dividends, rates, borrow and remaining optionality can change exposure | F13, F15, F18; simple dividend, interest and stock-borrow primers precede their use |
| F20 | M22.09 — Expiration mismatch | Identify a resulting stock/futures position when only one leg exercises | F14, F16, F18, F19; two-leg signed ledger introduced, not a full vertical-strategy lesson |
| F21 | M22.12 — Physical delivery | Calculate required cash/shares and explain shortages, delivery margin and forced-action uncertainty | F04, F16, F18; no live deadline or margin percentage asserted |
| F22 | M22.15 — Position reconciliation | Reconcile exercise/assignment to resulting holdings, fees and next-session risk | F03, F17, F20, F21 |
| F23 | M04.01 — Bid and ask | Distinguish quoted spread/midpoint/size from an executable outcome | F09, F10 |
| F24 | M04.04 — Market orders | Explain fragmented fills, immediacy and unknown final price | F17, F23 |
| F25 | M04.05 — Limit orders | Explain price control, no-fill risk and adverse selection without promising a fill | F23, F24 |
| F26 | M05.01 — Explicit costs | Reconcile named charges on an explicitly hypothetical schedule | F03, F10, F17; charges are sample inputs, not current tax guidance |
| F27 | M05.02 — Implicit costs | Account for spread, slippage, impact and opportunity cost | F23, F24, F25, F26 |
| F28 | M05.07 — Margin is not maximum loss | Separate collateral requirement, loss, liquidation and residual debt | F04, F06, F21, F26 |
| F29 | M24.01 — Long call | Compute expiration profit/loss and explain qualitative pre-expiry volatility/time exposure | F07, F10, F13, F26, F27; no Greek calculation is assumed |
| F30 | M24.02 — Long put | Compute protection and premium loss, including qualitative convexity | F08, F10, F13, F26, F27 |
| F31 | M24.03 — Short call | Recognize unbounded uncovered upside loss, assignment and funding exposure | F18, F21, F28, F29 |
| F32 | M24.04 — Short put | Calculate downside obligation, gap loss and collateral/cash differences | F18, F21, F28, F30 |
| F33 | M24.05 — Covered call | Reconcile funded shares plus short call, capped upside and residual downside | F03, F29, F31; define stock ownership and share acquisition cash first |
| F34 | M10.06 — Expected value | Calculate weighted and conditional payoffs while distinguishing assumed from estimated probabilities | F01, F03, F26, F27; embedded probability bridge defines outcomes, weights summing to one and conditioning before calculations |
| F35 | M45.02 — Risk per trade | Apply a stated scenario-loss budget, contract-size rounding and zero-contract decision | F04, F05, F28, F31, F32, F34; no inference of personal risk tolerance |
| F36 | M49.05 — Position reconciliation | Find a mismatch across orders, fills, positions and cash and pause new exposure until reconciled | F17, F22, F26, F27, F33, F35; all required records supplied synthetically |

The order intentionally revisits reconciliation: F22 teaches assignment-related changes; F36 audits the complete record after fills/costs/sizing. This is not a duplicate to delete. F20 uses two signed obligations without requiring vertical-selection theory. F34 teaches the needed probability concepts in place rather than demanding all of M10. Early loss intuition does not require graduate mathematics. Optional M15–M20 chart material does not delay R1.

## Authoring batches and assessment coverage

P17 executes one requested batch at a time. If invoked without a batch, select the earliest incomplete row below after P16 and record its exact topic IDs before writing. The batch is not complete until its lesson, resource, assessment and rendered-accessibility checks pass. All six batches plus integration are required before P18. A rejected lesson keeps its old scope/brief state.

| Batch | Topics | Gate and mandatory critical checks | Required outputs / dependency |
|---|---|---|---|
| R1-B1 | F01–F06 | R1-G1: units/sign, profit versus cash, loss versus collateral | Six lessons, twelve practice/transfer cases, gate forms A/B; entry diagnostic and arithmetic help; no prior batch |
| R1-B2 | F07–F12 | R1-G2: right/obligation, multiplier/premium, call/put exercise value | Six lessons and cases, two forms; B1 gate evidence |
| R1-B3 | F13–F18 | R1-G3: trade/deadline distinction, exercise versus settlement, assignment direction | Six lessons and cases, two forms; B2; lifecycle and role diagrams with text |
| R1-B4 | F19–F24 | R1-G4: one-leg residual exposure, physical delivery cash, quote versus fill | Six lessons and cases, two forms; B3; dividend/borrow primers and event ledger |
| R1-B5 | F25–F30 | R1-G5: limit non-fill, costs in net loss, margin versus maximum loss | Six lessons and cases, two forms; B4; hypothetical charge schedule |
| R1-B6 | F31–F36 | R1-G6: short-call loss bound, uncovered cash obligation, minimum size/zero contracts | Six lessons and cases, two forms; B5; probability bridge and R1 dossier |
| R1-INTEGRATION | All 36 | Cross-batch retention, fresh numerical transfer, complete dossier and course outcome | End-to-end review, source/rights audit, cold-start pilot, all CR criteria and corrected estimates |

Each gate has ten items: three critical and seven other checks. All items carry ten points; ≥85% therefore means at least nine correct, with all critical items correct. Each form samples every lesson in the batch, including one changed-input calculation and one failure-case explanation expressed through a supported structured question. The authoring bank needs **120 reviewed gate items with separately checked reference answers** across six pairs of forms. Do not count reordered choices as a second form.

Each lesson needs one original numerical/structured practice case plus a transfer variant: **72 practice prompts**, reference answers and error-specific feedback. Each also has an original worked example separate from those prompts. These quantities follow the 36 learning outcomes and fresh-evidence policy; they are not a claim that more questions alone improve learning. After both gate forms fail, further attempts are labeled repeated practice; the editorial assessment queue must supply a reviewed new form before fresh mastery evidence can be earned. P17's integration review must exercise this exhausted-bank state, explain it to the learner and verify a staffed escalation route under U04. No hidden paywall or real-money task may resolve it.

## R1 project: cash and obligations dossier

`R1-CASE-01` is an educational worksheet and structured self-review, not one of the twelve coding projects. Prerequisites: F01–F36 and all six gates. Learning objective: reconstruct what a position can earn, lose, owe and leave behind after a specified event, including uncertainty that forces the decision to stop.

Supply an original synthetic contract sheet, order/fill records, fee schedule, exercise/assignment events and a broker-style position/cash statement. No real security identifier or current exchange rule is required. Steps:

1. Validate terms, timestamps, currency, multiplier and deliverable; identify missing facts before arithmetic.
2. Calculate signed premium, underlying purchase, explicit costs and scenario payoffs for a long option, short put and covered call.
3. Apply a one-leg assignment event; list resulting cash/securities requirements separately from terminal payoff limits.
4. Calculate allowed whole contracts under a provided stress-loss budget; reject the position when the minimum contract breaches it.
5. Reconcile fills with the final holdings/cash statement, locate a deliberate discrepancy and describe containment before further activity.
6. State assumptions, what cannot be inferred about real-market profitability and which current product rules would need verification before any operational use.

Deliverables are the ledger, scenario table, sizing decision, discrepancy explanation and rubric self-review. A text/table route supplies equivalent evidence to a locally completed spreadsheet; no file upload or code execution is needed.

Rubric: cash/positions and numerical correctness 35%; units/assumptions 25%; failure/assignment/funding analysis 25%; explanation and reconciliation trail 15%. Self-reviewed completion requires ≥85% and no acknowledged critical error. The product may check specified numeric fields, but it must label the qualitative judgment Self-reviewed. It awards no professional certification and does not mark C-M49 or any entire source module mastered.

Concrete reference fixtures for P17/P15 to independently verify:

- Hypothetical uncovered put: strike 100, premium 4, multiplier 50, one contract, total specified fee 5. Premium net cash is +195. Assignment requires 5,000 cash to acquire 50 shares. At zero terminal underlying, net loss is 4,805, distinct from any stated margin. At terminal 80, economic loss is 805 including that fee. With a hypothetical stress-loss budget of 100 against the 805 scenario loss per contract, allowed quantity is zero.
- Hypothetical covered call: buy 50 shares at 100, sell one 105-strike call at premium 2 with multiplier 50 and total fee 5. At terminal 80, net loss is 905. At 110 with physical assignment, deliver 50 shares for 5,250; total net profit is 345. These figures assume no other costs, dividends, interest or taxes; adding any requires a new calculation.
- The transfer case changes the multiplier, fee and event path. The same displayed numbers cannot serve as an unseen assessment. A deliberately missing fill requires the learner to identify uncertainty, not invent a balancing cash entry.

Failure cases include universal multiplier assumptions, premium mistaken for profit, margin mistaken for loss bound, omitted stock/cash after assignment, midpoint assumed executable, fee double-counting, incorrect denominator in risk sizing and silent reconciliation adjustments. The dossier does not model full market microstructure, operational cutoffs, portfolio margin, historical edge or personal suitability.

## Sources, evidence and publication presentation

R1 authoring starts from R01 (OCC ODD), R04 (FINRA education), RX01 (OIC exercise article) and the bounded payoff/lifecycle material in RX24 (MIT). These are source candidates for the named outcomes, not blanket citations for all 36 topics. P17 must read the exact sections used and create explicit topic/claim assignments. F34 probability teaching needs a lawful primary/university section reviewed before publication; a familiar expected-value formula does not certify the whole inherited reading list. Original worked arithmetic and independent reference checks can make the instructional route self-contained, while sources support factual claims.

Every required external reading must have a free, usable alternative or be replaced by original reviewed teaching that actually covers the outcome. Optional paid sources disclose edition/cost/access limits. Do not promote P01's 141 candidate assignments merely by importing them. Distinguish numerical verification of an original exercise from full review of a textbook.

The complete map is published as reviewed catalog metadata, not a download of private source archives. R1 may show the resource catalog's 96 records with honest verification labels after metadata/rights review, but only reviewed relevant assignments become required. The nine historical-rule records may support carefully dated historical discussion if the exact scope is needed; **R1 does not require a single current operational rule value**. All current-rule quarantines, R56 numerical headlines, R58 unresolved tax wording, uncertified BSE/NSE specifications and exact VIX methodology exclusions remain outside R1 teaching claims.

On partial module pages, show “Published in Foundations: x of y topics” beside the full module's estimated scope. Planned topics have informative metadata and a Planned label; no fake lesson body, completion button, quiz or launch date. A withdrawn lesson has a reason and replacement/remediation route, not a generic 404. Internal drafts, answers and reviewer notes are never public. Planned topic stubs are noindex; the full curriculum overview can be indexed. A bookmarked or self-completed topic cannot be mistaken for publication readiness.

## Path completion and later professional material

| Path/branch | What R1 enables | What remains before claiming completion |
|---|---|---|
| R1-FND | Complete 36 lessons, six gates and the self-reviewed dossier | All initial authoring, app and review gates; currently none is published |
| PATH-BEGINNER | A substantial first foundation subset | Remaining topics across M01/B01/M21/M03/M22/M04/M05/M24/M10/M45/M60 and full module assessments; R1 lacks all of M60 |
| PATH-RETAIL | Contract/cash foundation | Verticals, pricing/Greeks, volatility, execution, risk/behavioral/research work and its capstone |
| PATH-QUANT | Manual contract foundation and visible preparation map | Math/Python, pricing/numerics/calibration, empirical validity and reviewed project implementations |
| PATH-VOL | Definitions/obligations foundation | Realized/implied/forward variance, skew/surfaces, events, hedging, dispersion and costed research |
| PATH-MM | Quote/obligation/reconciliation introduction | Queue/fill economics, adverse selection, quoting/inventory, portfolio capital and incident simulations |
| PATH-INDIA | Generic mechanics and a clear rule-verification boundary | Operative NSE/NCL/SEBI/BSE master/circular chains, taxes/fees/margins, product differences and all required modules |
| PATH-SYSTEMATIC | Cash/risk foundation | Coding/data/rights, temporal validation, simulation/fills/costs, portfolio and operational controls |
| Original specialization branches and C01–C07 capstones | Read their retained scope and dependencies | Complete original competency/assessment requirements; no capstone is silently replaced by R1-CASE-01 |

Proposed publication waves, without promised dates:

1. **L1 full beginner and retail mechanics:** finish beginner modules, behavior/process, verticals and assignment/funding cases; complete prerequisite assessments before declaring PATH-BEGINNER available end to end.
2. **L2 pricing, math and Python:** bridges, probability/statistics, replication/BSM, Greeks, volatility measurement and reproducibility; author and verify PR01–PR05. A learning project is not automatically a hosted product calculator.
3. **L3 volatility and systematic research:** surfaces, hedging, VRP, events and costed backtests; PR06–PR10, statistical and data-entitlement checks, then eligible quantitative/volatility/systematic completions.
4. **L4 specialist desks and global/India practice:** relative value/dispersion/dealer inference, market making, execution/capital, exotics, historical cases and product-specific rule packs; PR11/PR12 and original capstones. India mechanics may be authored earlier when evidence allows, but current-rule claims require their own gate.

Each wave must take prerequisite closure from the canonical graph, rerun affected technical/teaching/practice reviews and use P17 batches. Do not infer that a wave label guarantees all seven paths complete: publish a path only when every required module and gate in its selected version is ready. Optional technical/chart analysis retains its evidence and testing requirements without becoming a beginner prerequisite. The twelve project capabilities and seven capstones remain fully itemized in [PROJECTS.md](../curriculum/PROJECTS.md) and the canonical exports.

## Release-blocking content criteria

| ID | Observable requirement | Evidence and owner |
|---|---|---|
| CR-01 | Exactly the 36 listed canonical topics have original reviewed instruction covering their declared scope; no placeholder prose or inherited outline labeled lesson | P17 per-topic review and content manifest; P18 ID/readiness reconciliation |
| CR-02 | Every lesson has an original worked example, practice and transfer variant, correct units/assumptions, independent numerical/reference review and specific misconception feedback | 36 example records, 72 practice prompts/solutions; P17 calculation reports and P15 scoring tests |
| CR-03 | Every adopted factual claim has an appropriate reviewed source section; all required resources are usable; rights and synthetic-data provenance are recorded; quarantines remain excluded | Topic/claim/resource associations, link/access review, rights checklist and evidence register; P17/P19 |
| CR-04 | R1's lesson prerequisites are acyclic, earlier or taught through the explicit embedded bridge; no unpublished lesson is a hidden requirement | Dependency audit below and cold-start walkthrough; P04/P09/P17/P18 |
| CR-05 | Six two-form gates, critical-error tags, protected solutions, tolerances, remediation and exhausted-bank behavior work as specified | 120 reviewed items and versioned gate blueprints; P15/P17/P18 including failed-attempt → unseen retry |
| CR-06 | R1 completion means 36 self-completed lessons + six passed gates with required fresh evidence + dossier self-review; labels separate self-review from scored evidence and from whole-module mastery | P14/P15 real-stack tests; screen/readout review in P18 |
| CR-07 | Noncoding/low-bandwidth, keyboard/screen-reader, math/table and print routes teach the same foundation outcome; no inaccessible mandatory resource | P06/P17 rendered checks and P18 full-process accessibility review |
| CR-08 | Separately recorded authoring and review events precede authorized approval, with same-person review explicitly labeled; complete course walkthrough, estimates, correction/version behavior and planned-content truthfulness are reviewed | P16 audit trail, P17 integration report, P18 release-content review; named U04 staffing resolved |

The P02 dependency audit only checks the designed order. It is not evidence that actual lessons are teachable: P17 must test the embedded primers and remove unexplained terms. No completion mark is awarded simply because the sequence validates as a graph.

## Effort, staffing and current blockers

Plan **420–700 editorial hours** for R1, subject to pilot revision: 216–360 for 36 lessons/examples, 72–120 for the practice/transfer cases, 60–100 for gate banks and feedback, and 72–120 for dossier, accessibility/source review and integration. Avoid double-counting where a reviewed lesson already includes its practice; track actual work by deliverable. This extends P01's provisional 180–360-hour slice estimate because P02 has now fixed a larger 36-topic scope and explicit assessment/review obligations. It excludes application development, operator legal/rights work and third-party access delays. One accountable operator may hold author/reviewer/publisher roles with explicit same-person attribution; assessment maintenance and additional review capacity remain unconfirmed, not assumed free labor.

Immediate blockers to R1 publication: all authoring and implementation remain undone; source-section/rights checks remain; reviewer staffing, operator/privacy/support inputs and authorized delivery/deployment configuration remain unresolved. These are planned stage obligations, not blockers to P03 design. No app or content publication occurs in P02. The full P17 queue remains 1,025 topic records; this plan selects 36 for the first course without erasing the rest.
