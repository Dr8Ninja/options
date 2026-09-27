# Python and reproducible research track

B03 precedes numerical pricing and data/backtest projects. M58 then supplies reliable analysis habits; production trading automation is outside this assignment. No brokerage credentials, live orders or redistribution rights are implied by studying an API.

| Step | Capability and assessment | Libraries and selected documentation |
|---|---|---|
|1. Reproducible basics, 8–20h | Create an isolated environment; record Python/OS, dependency lock, seeds and input hashes; pure functions, types, exceptions, tests and version control. Rerun from a clean process. | Python tutorial sections 3–8; standard-library venv, unittest, json, datetime. Pin versions when the teaching environment is actually built, not from a moving web label. |
|2. Arrays and charts, 10–20h | Compute a signed payoff grid; reject shape/unit errors; add labels, captions and a text/table equivalent. | NumPy arrays/indexing/broadcasting; matplotlib explicit figures/axes. Avoid silent broadcasting of contract multipliers. |
|3. Data engineering, 15–35h | Ingest a synthetic chain with identifiers, exchange time/UTC, snapshot time, quote flags and adjusted deliverables. Log rather than silently delete failures. | pandas IO, indexing, merges, timezone/time-series documentation. A merge key includes contract version and timestamp policy. |
|4. Numerical pricing, 20–50h | BSM benchmark, bracketed IV root, finite differences and error/convergence plots; compare an independent implementation. | SciPy optimize.brentq and statistics; QuantLib calendars/day counts, European/American engines and handle updates, with exact release/API verification at implementation. |
|5. Forecast and inference, 20–45h | Simple baseline, rolling forecasts, residual checks, confidence intervals and block bootstrap. | statsmodels regression/time-series; optional arch for GARCH, after verifying release and documentation. Report units and forecast horizon. |
|6. Lifecycle experiments, 30–70h | Event-driven cash/position ledger, delayed decisions, executable fills, corporate actions, exercise, funding and capital limits; immutable trial log. | Python/pandas/NumPy plus a small transparent simulator. Framework convenience does not excuse an unverified cash ledger. |
|7. Optional ML, 20–60h | Compare against the simple baseline; fit preprocessing only on training folds; use temporal evaluation and overlap controls. | scikit-learn common pitfalls 12.1–12.2 and Pipeline. Random train/test splitting is inappropriate for many time-dependent strategy questions. |

Every computational submission includes input provenance/rights, a small hand-worked fixture, an invalid-input case, an independent numerical comparison, precision/tolerance rationale, costs, and a limitation statement. Tests must reveal meaningful errors: a payoff sign, an invalid bound, a timing leak, a corporate-action mismatch or a funding shortfall. A library call compared only with itself is not independent validation.

Data and software are separate permissions:

| Candidate | Software access | Data access, limitations and disposition |
|---|---|---|
| Synthetic fixtures | Original project code/data; distributable once project license is chosen | Default for all 12 project specifications. Validate mechanics; never label results historical trading evidence. |
| yfinance | Repository identifies Apache 2.0; pin an actual release when used | README points to separate Yahoo terms and describes research/education use. It supplies no blanket commercial/redistribution entitlement or guaranteed historical option-chain coverage. Optional personal exploration only after terms review; excluded from a public downloadable data bundle. |
| Exchange/broker APIs | Client-library license varies | Account eligibility, market-data subscriptions, geography, retention, derived data and redistribution must be checked separately. Teach authentication, rate limits, timestamping and schema changes using mocks. API access is not authorization to trade. |
| Cboe DataShop / OptionMetrics via WRDS | Dataset access separate from any analysis library | Paid/institutional and product-specific. Read the actual agreement. DataShop notes additional-use licensing; WRDS availability is not an entitlement. No dataset bought or copied here. |
| ALFRED/FRED and official releases | Official API/docs accessible | Preserve series-specific source terms and historical vintages; do not assume every underlying provider has identical rights. Suitable for event-timing demonstrations after rights review. |

The [yfinance README](https://github.com/ranaroussi/yfinance) and [Cboe DataShop description](https://datashop.cboe.com/vix-index-eod-calculation-inputs) support this distinction. Documentation versions, test environments and API behavior remain implementation verification tasks; the curriculum does not invent a tested package lock.
