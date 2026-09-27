# Project capability specifications

All 12 specifications use synthetic data by default, with separately licensed real-data extensions only where appropriate. Project completion is not claimed in P01. Prerequisite PR IDs are earlier projects; M/B IDs are assessed modules. Each project has an 85% rubric threshold and a critical-error override.

## PR01 — Cash-flow and payoff engine

Prerequisites: M01, M21, M22, M24, M25, B03. Effort: 10–20 hours, assuming entry competencies.

Reconstruct arbitrary signed vanilla legs including fees and settlement obligations.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Define typed contracts and signed legs
2. compute per-unit then multiplier cash
3. sum stock and option cash flows
4. add assignment branch and manual comparison.

Deliverables: Executable functions, accessible payoff table, five independently worked cases and unit tests.

Reference: 100/105 call spread purchased for 2 pays 0/0/5 at spot 90/100/110; net -2/-2/3 per unit before fees. Long/short legs must cancel exactly absent costs.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: Wrong put sign;  double premium;  adjusted multiplier;  expired contract;  one-leg assignment.

Limitations: Terminal payoff is not margin, interim risk or guaranteed fill; calendars require dated valuation.

## PR02 — BSM pricing library

Prerequisites: M29, M30, M13, B03. Effort: 15–30 hours, assuming entry competencies.

Implement a conditional European pricing reference with explicit units and edge handling.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Write scalar normal CDF with documented implementation
2. handle T=0 and sigma=0
3. add carry q
4. compare put-call parity and tree convergence
5. record model assumptions.

Deliverables: Versioned library, derivation note, input contract and tolerance report.

Reference: S=K=100, r=.05, q=0, sigma=.2, T=1: C =10.45058357, P =5.57352602; C-P =4.87705755. Absolute tolerance 1e-7 for benchmark.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: Negative T/sigma;  percent-as-decimal;  cancellation deep ITM;  dividend mismatch.

Limitations: Not American pricing or an actual expected return; discrete dividends need a separate model.

## PR03 — Greeks visualizer and convention audit

Prerequisites: PR02, M32, M33. Effort: 12–25 hours, assuming entry competencies.

Connect derivative definitions with finite shocks and portfolio cash exposures.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Define analytic delta/gamma/vega/rho/theta
2. select central-difference steps over a convergence grid
3. add vanna/vomma/charm and full revaluation
4. label axes and textual equivalents.

Deliverables: Plots plus tabular alternatives, Greek dictionary, analytic/numerical comparisons and residual surface.

Reference: At PR02 benchmark delta .63683065, gamma .01876202, vega 37.52403469 per unit vol, theta -6.41402755 per year at fixed expiry; vega per point .37524035.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: Time-sign inversion;  raw-vega mixing;  unstable finite difference;  lambda near zero value.

Limitations: Local sensitivities degrade near expiry, jumps and large shocks; surface convention is a scenario assumption.

## PR04 — Historical realized-volatility analysis

Prerequisites: M11, M12, M35, B03, M54. Effort: 12–25 hours, assuming entry competencies.

Compare estimators against a declared forecast target and sampling scheme.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Generate seeded return paths and optional entitled closes
2. document adjustments/calendar
3. compute close-to-close, range and intraday estimators where inputs exist
4. separate overnight
5. bootstrap in blocks
6. compare forecasts.

Deliverables: Data dictionary, estimator notebook, uncertainty bands and leakage audit.

Reference: Daily sample SD .01 annualized sqrt 252 gives .15874508; constant log returns have zero demeaned sample variance when n >1. Zero-mean RV need not be zero.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: Insufficient samples;  microstructure noise;  using high-low without valid OHLC;  revised series.

Limitations: Synthetic behavior validates code, not empirical forecast edge; annualization is convention.

## PR05 — Implied-volatility solver

Prerequisites: PR02, M31. Effort: 10–20 hours, assuming entry competencies.

Invert only prices inside model-consistent bounds and expose ill conditioning.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Calculate bounds
2. bracket a monotone European price
3. use safeguarded root
4. report price residual and vega
5. reject out-of-bounds and expired ambiguous quotes
6. test bid/ask IV interval.

Deliverables: Solver, diagnostic statuses and edge-case test report.

Reference: PR02 call price recovers .2 within 1e-7; price above discounted spot rejected; zero-vega regions flagged despite small price residual.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: Unbracketed Newton;  negative vol;  false precision near expiry;  American quote fed to European engine.

Limitations: IV is model/convention dependent, not a forecast; some valid boundary prices imply zero or infinite limiting IV.

## PR06 — Arbitrage-aware volatility surface

Prerequisites: PR05, M37, M54. Effort: 25–50 hours, assuming entry competencies.

Construct a price/surface representation with explicit scope of arbitrage checks.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Generate European synthetic strikes/expiries
2. synchronized forwards and discounts
3. filter bad quotes
4. fit constraints
5. check strike bounds, monotonicity, convexity and calendar at fixed forward moneyness
6. stress tails and missing quotes
7. compare American quote treatment.

Deliverables: Clean chain, exclusion log, fit residuals within bid/ask where possible, arbitrage audit and extrapolation policy.

Reference: Flat 20% surface yields w=.04T; calls decrease and are convex in strike. Positive variance alone must not pass. Finite-grid pass is not a global proof.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: Crossed/stale quotes;  negative forward;  nonconvex interpolation;  mismatched dividends;  unexamined American quotes.

Limitations: No guarantee outside the grid without analytic conditions; calibration nonuniqueness and quote uncertainty remain.

## PR07 — Discrete delta-hedging simulator

Prerequisites: PR02, PR03, M34, M47. Effort: 20–40 hours, assuming entry competencies.

Reconcile hedge cash and residual error under costs, jumps and funding.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Simulate seeded GBM and jump stress
2. initialize option and hedge cash
3. accrue funding
4. rebalance at fixed times or bands
5. settle
6. compare frequencies and turnover
7. attribute P&L.

Deliverables: Path ledger, replication error distribution, cost sensitivity and independent hand path.

Reference: With option and hedge positions zero total P&L zero; self-financing cash changes offset share-trade cash before fees. Error generally narrows with finer hedging in ideal continuous model, not guaranteed pathwise or net of costs.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: Hindsight delta;  omitted initial premium;  wrong hedge sign;  missing interest;  perfect jump hedge.

Limitations: Model-world replication is not empirical volatility arbitrage; parameter and dividend uncertainty matter.

## PR08 — Lifecycle strategy backtest

Prerequisites: PR01, M54, M55, M56. Effort: 30–60 hours, assuming entry competencies.

Test a prespecified strategy under executable costs, corporate actions and capital constraints.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Freeze hypothesis and search log
2. chronological train/validation/holdout
3. create timestamped universe
4. delay orders
5. model package/non-fill/partial-fill
6. settle assignment
7. enforce cash/margin
8. compare baseline and cost stress.

Deliverables: Immutable configuration, event ledger, trial log, hand-reconciled sample, holdout report and reject/adopt memo.

Reference: A round trip across 2.00/2.20 costs .20 per unit before fees; net must fall as independent fees rise with fixed trades. Same input yields same ledger.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: Look-ahead;  survivorship;  stale IV;  unlimited funding;  optimistic midpoint fills;  repeated holdout access.

Limitations: Simulation cannot prove future profit; absent licensed chains use synthetic and make no claim of historical edge.

## PR09 — Variance risk premium study

Prerequisites: PR04, PR06, M36, M55. Effort: 20–45 hours, assuming entry competencies.

Distinguish priced variance from subsequent realized variance with uncertainty and costs.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Declare horizon and sampling
2. construct synthetic Q/P benchmark
3. optionally use entitled index options
4. align IV variance and future RV
5. handle overlap
6. block bootstrap
7. separate jump regimes
8. add replication costs.

Deliverables: Variance-unit report, uncertainty, sample coverage, model and selection caveats.

Reference: IV.20 versus RV.18 annualized variance difference .0076; do not subtract vol units or call gross spread arbitrage.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: Look-aheadRVusedasforecast;  overlap independence;  truncation bias;  omitted tail months.

Limitations: Q-minusP difference can compensate risk; index result not universal individual-option edge.

## PR10 — Earnings and event variance study

Prerequisites: PR04, PR06, M09, M38, M55. Effort: 18–35 hours, assuming entry competencies.

Estimate event contribution without claiming exact identification from two expiries.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Createknown syntheticevent jump
2. timestamp announcements
3. select pre/post expiries and control baseline
4. estimate total variance difference
5. stress baseline and skew
6. compare actual move with priced distribution.

Deliverables: Event calendar, sensitivity range, signed hypothesis and post-event attribution.

Reference: Known total variance .003288 minusbackground .002288 gives .001 event variance under the constructed example; negative estimate is diagnostic, not clipped silently.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: After-hours date error;  revised calendar;  overlapping macro event;  option close before announcement.

Limitations: Eventvariance separation depends on baseline, changing risk premium andsurface; sparse events limit inference.

## PR11 — Dispersion and correlation study

Prerequisites: PR06, PR07, M41, M48, M55. Effort: 25–50 hours, assuming entry competencies.

Separate index and constituent variance exposure, weighting and residual risks.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Build synthetic covariance matrix PSD
2. price index/constituent variance proxies
3. state weights/dividend/settlement conventions
4. shock correlation and individual jumps
5. model hedging, turnover and funding.

Deliverables: Exposure decomposition, hedge ledger, covariance checks and costed thesis.

Reference: Two equal 20% assets with rho.5 give index variance .03; rho 1 gives .04. Correlationmatrix must be symmetric with nonnegative eigenvalues within tolerance.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: Using average vol instead of variance;  weights not normalized;  realized/implied correlation mismatch;  corporate-action drift.

Limitations: Not a pure correlation trade with vanilla options; skew, jumps, vega and index construction create basis.

## PR12 — Dealer-gamma approximation under uncertainty

Prerequisites: PR03, M23, M51, M54. Effort: 15–30 hours, assuming entry competencies.

Show what public OI can and cannot identify about dealer hedges.

Data: Default: generated hypothetical/synthetic data with seed, parameter manifest and no third-party market observations. Optional real data requires written entitlement, retention/export terms and timestamped lineage.

Steps:

1. Use generated chain/OI
2. select pricing and surface assumptions
3. compute gamma units
4. run opposing sign/customer ownership scenarios
5. shift spot/time/vol
6. compare gross/net bounds
7. document missing OTC and trade flow.

Deliverables: Sensitivitydashboard with tables, assumption ledger, range—notpoint claim—and falsification memo.

Reference: 100 contracts*100 multiplier*.02 gamma =200 share-delta per 1 spot for uniform sign; cashgamma per 1% move convention adds S²*.01, stated explicitly.

Rubric: cash and numerical correctness 30%, assumptions and data lineage 20%, validation and failure cases 25%, decision and limitations 15%, reproducibility accessibility 10%. Units, cash, assignment, leaked evaluation or false entitlement claim blocks mastery regardless of score.

Failure cases: All calls dealer-short;  stale OI;  double counting;  wrong cash gamma;  positioning claimed observable.

Limitations: Not an actual dealer book, prediction of price pinning or causal 0DTE impact; sign often unidentified.

## Original capstone integration

- **C01 Contract and operations examination** — compare an equity option, cash-settled index option, futures option and selected local-market contract. Process a split, special dividend, early assignment and holiday-adjusted expiry. Produce positions and dated cash flows. Project capabilities: PR01.
- **C02 Pricing and risk notebook** — derive parity and binomial valuation; implement BSM and an American model; extract IV; calculate primary/higher Greeks; compare analytic and numerical results; flag invalid inputs. Project capabilities: PR02, PR03, PR05, PR07.
- **C03 Volatility research report** — estimate realized variance, forecast it, construct a clean surface, isolate an event where feasible and distinguish pricing probabilities from physical forecasts. Report uncertainty. Project capabilities: PR04, PR06, PR09, PR10.
- **C04 Strategy laboratory** — analyze one directional, one short-volatility, one long-volatility, one time-spread and one synthetic structure using the full dossier. Compare with simpler alternatives. Project capabilities: PR01, PR08.
- **C05 Portfolio stress and funding report** — aggregate Greeks and factors, perform full revaluation, shock liquidity and margin, construct a cash ladder and identify a path to failure. Project capabilities: PR07, PR11.
- **C06 Research falsification project** — predefine a testable edge, build point-in-time data, model fills and lifecycle cash flows, preserve a holdout, disclose every tried variant, and explain why the idea should be adopted or rejected. Project capabilities: PR08, PR09, PR10, PR11, PR12.
- **C07 Simulated trading desk** — run a written mandate with daily reconciliation, risk reporting, journal review, operational incident drills and a final independent-style challenge. A losing but correctly evaluated strategy may be a successful research project if the appropriate decision is to reject it. Project capabilities: PR08, PR12.
