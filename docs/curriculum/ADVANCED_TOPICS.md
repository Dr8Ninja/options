# Advanced teaching briefs and numerical conventions

These briefs connect the scope to concrete work. They are curriculum design, not fully authored and independently reviewed lessons. Specialist model implementations, current product parameters and empirical profitability claims are excluded from publication until their specific evidence and numerical tests pass. Primary assignments include [Gatheral–Jacquier sections 2–3](https://arxiv.org/abs/1204.0646), [the de-Americanization study](https://arxiv.org/abs/1611.06181), [Avellaneda–Stoikov](https://math.nyu.edu/inmemoriam/avellaneda/HighFrequencyTrading.pdf) and the author-hosted [variance-swap note](https://emanuelderman.com/wp-content/uploads/1999/02/gs-volatility_swaps.pdf). Each is used only within the scope in the claim register.

Greek convention contract: V is value per underlying unit, S is underlying price, σ and r are decimal annual quantities, τ is remaining years, and t is elapsed calendar time at a fixed expiry. Multiply by signed quantity and contractual multiplier exactly once. Convert vega/rho per unit to per percentage point by dividing by 100; convert annual time sensitivities to a day only after declaring the day-count convention. Nonstandard Greek names always accompany derivative definitions.

| Name | Definition in this curriculum | Main failure to test |
|---|---|---|
| Delta | ∂V/∂S | Not actual probability of profit; exercise/surface convention changes it. |
| Gamma | ∂²V/∂S² | Large shocks and near-expiry kinks defeat a local quadratic approximation. |
| Vega | ∂V/∂σ | Decimal versus one-point scaling; American IV convention. |
| Theta | ∂V/∂t = −∂V/∂τ at fixed expiry and other inputs | Calendar-time sign and nontrading-day treatment. |
| Rho | ∂V/∂r | Curve shifts, funding and multiple currencies exceed a single-rate shock. |
| Vanna | ∂²V/(∂S∂σ) | Sticky-strike versus sticky-delta convention and changing forward inputs. |
| Volga/vomma | ∂²V/∂σ² | Vega convexity and finite-difference cancellation. |
| Charm | ∂delta/∂t | Opposite sign if defined with remaining time. |
| Speed | ∂gamma/∂S | Grid step and discontinuities. |
| Color | ∂gamma/∂t | Time convention and near-expiry instability. |
| Ultima | ∂³V/∂σ³ | Very noisy numerical high derivatives. |
| Zomma | ∂gamma/∂σ | Surface/model shock differs from isolated σ shift. |
| Lambda/elasticity | (S/V)delta | Undefined or unstable as V approaches zero. |
| Cross-gamma | ∂²V/(∂Sᵢ∂Sⱼ) | Missing correlation and cross-asset terms in portfolio shocks. |

For small shocks, use delta·dS +½gamma·dS² +vega·dσ +theta·dt +rho·dr +vanna·dS·dσ +½vomma·dσ², with higher terms as justified. Mixed second derivatives have no extra½ when written once. This approximation is checked against full revaluation under the same conventions. Finite-difference checks sweep step sizes; a single coincident value is not convergence. Portfolio cash Greeks aggregate linearly only when underlying units and shock conventions match. Cash-gamma conventions vary: ΓS², ΓS²×.01 and½Γ(.01S)² describe different reported quantities and must never share an unlabeled column.

Volatility depth is organized around decisions:

| Teaching sequence | Intuition, mathematics and failure case | Work and mastery |
|---|---|---|
| Measurement | Historical is observed; realized is a chosen path statistic; implied is an inversion of price under a model. Demeaned sample variance, zero-mean realized variance and high-frequency quadratic variation are different objects. | PR04 separates sampling, gaps, annualization, microstructure noise and confidence intervals; compare against a simple forecast. |
| Forecasts and regimes | Clustering and conditional heteroskedasticity motivate GARCH-style forecasts; estimated mean reversion is not a guaranteed reversion timetable. Cones are historical conditional distributions, not probability guarantees. | M12/M35 compare rolling baselines and conditional models out of sample; test breakpoints and event contamination. |
| IV versus RV and carry | Compare matched-horizon variance, accounting for pricing versus physical expectations, jumps and risk compensation. Positive historical spread is not net edge. | PR09 reports dependence-aware uncertainty and replication costs; adverse tail months cannot be omitted. |
| Forward variance and term structure | Work in total variance w=σ²τ. Under the chosen consistent convention a forward interval estimate is (w₂−w₁)/(τ₂−τ₁); taking differences of volatilities is invalid. | Reconstruct a synthetic event term structure and challenge the background-variance assumption. Do not treat a vanilla-ATM formula as an exact forward variance-swap price. |
| Smiles, skew and convexity | Convert strike to log forward moneyness. Price convexity/density, calendar consistency and tails constrain a fit. Raw SVI positivity alone is insufficient. | PR06 must disclose quote filters, American treatment, residuals, grid coverage and extrapolation. Analytic guarantees and finite-grid diagnostics are different claims. |
| Events and 0DTE | Event timing can dominate remaining variance; near-expiry convexity, settlement and thin quotes make spot/vol/time risks interact. | PR10 uses a known synthetic event then optional entitled observations. Dealer flow and pinning stories remain hypotheses, with opposing positioning assumptions. |
| Variance, volatility and corridor swaps | A variance payoff is linear in realized variance; a volatility payoff involves its square root and convexity. Continuous replication needs explicit idealizations. Corridor terms depend on observation and in-range conventions. | Compare a term sheet’s sampling, annualization, caps, disruptions and corridor denominator before pricing. Bennett p55 supplies one practitioner convention, not a universal legal definition. |
| VIX and related products | Spot index calculation, special settlement, futures, index options, options on futures and ETP daily reset/roll exposure are distinct. | M39/PR09 compare variance weighting with simple volatility averaging. Exact current methodology/addendum verification is still excluded; the FAQ supports only bounded conceptual distinctions. |
| Dispersion and correlation | For fixed linear weights, portfolio variance is w′Σw. Index/stock option differences introduce skew, jumps, weights, dividends, settlement and hedging basis. | PR11 passes only with covariance validity, residual-risk decomposition and cost/funding stress. A vanilla dispersion package is not a pure correlation swap. |

Model progression: replication and European benchmarks → binomial American exercise with discrete dividends → MC/variance reduction and finite-difference convergence → local volatility and stochastic volatility → Heston, SABR where the underlying/product convention warrants it, jump models and SVI calibration. Distinguish a fitted surface from a dynamics model. Lower in-sample pricing error does not identify dynamics or guarantee better hedge performance. Record objective weights, bid/ask uncertainty, bounds, initial values, regularization, stability and out-of-sample validation. De-Americanization is an approximation with documented numerical error; the reviewed study does not establish a discrete-dividend guarantee.

Exotics/structured products are specialist term-sheet work: barriers/digitals have discontinuous hedge behavior; Asians depend on fixing schedules; lookbacks on sampled extrema; forward-starts/cliquets on resets and local/global caps; autocallables combine path-dependent calls, coupons, downside exposure, issuer credit and funding. M44 requires two paths with the same terminal spot but different payouts, then a monitoring-gap/counterparty scenario. Haug/Taleb/Gatheral are selected references with access limitations, not evidence that every formula or structure has been reviewed.

Market-making study separates spread revenue, queue/fill uncertainty, inventory variance, adverse selection, hedging costs, rebates/fees, capital and operational incidents. Avellaneda–Stoikov provides a stylized inventory model under specified midprice/arrival assumptions; it is not a ready-made options market-making business or a complete model of toxic flow. PR12 explicitly varies dealer ownership/sign assumptions and reports ranges. Aggregate public OI cannot certify actual dealer gamma, vanna or charm exposure.
