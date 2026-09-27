# DEEP RESEARCH TASK — BUILD THE DEFINITIVE OPTIONS TRADING CURRICULUM

You now have access to the three options-learning roadmap documents stored in this project.

Your job in this phase is **research and curriculum architecture only**.

Do not start building the website yet.

Do not casually skim the files.

Read all three documents in their entirety and perform a rigorous comparison.

---

# STEP 1 — EXTRACT EVERYTHING

Create a complete structured inventory from all three documents.

For every item found, capture:

- Document source
- Section
- Module
- Topic
- Subtopic
- Resource name
- Resource type
- Author/source
- URL if present
- Difficulty
- Prerequisite
- Whether duplicates appear elsewhere
- Notes

Build a canonical merged inventory.

Do not lose information simply because two files organize topics differently.

---

# STEP 2 — COMPARE THE THREE ROADMAPS

Produce a detailed gap matrix.

For each major domain of options trading, indicate:

- File 1 coverage
- File 2 coverage
- File 3 coverage
- Overall coverage quality
- Missing areas
- Outdated areas
- Duplicated material
- Recommendations

Rate coverage:

- Excellent
- Good
- Partial
- Weak
- Missing

---

# STEP 3 — RESEARCH EVERYTHING THAT MAY BE MISSING

Conduct extensive independent research.

Do not limit yourself to what the three documents mention.

Research from high-quality sources including, where appropriate:

- CBOE
- OCC
- CME
- SEC
- FINRA
- NSE
- SEBI
- Academic journals
- University courses
- Options textbooks
- Quantitative finance books
- SSRN papers
- Practitioner research
- Volatility research
- Professional market-making material
- Quantitative-finance lecture notes
- Reputable trading education
- Broker documentation
- Open-source quantitative libraries

Research until additional searching produces diminishing returns.

---

# STEP 4 — THINK LIKE MULTIPLE EXPERTS

Perform separate gap analyses from these perspectives:

1. Options beginner
2. Experienced discretionary trader
3. Quantitative analyst
4. Volatility trader
5. Market maker
6. Risk manager
7. Portfolio manager
8. Derivatives researcher
9. Financial mathematics professor
10. Indian derivatives trader
11. Systematic trader
12. Execution/microstructure specialist

For each perspective ask:

> What knowledge would this expert consider mandatory that the current roadmap misses?

---

# STEP 5 — CREATE A KNOWLEDGE MAP

Before defining modules, build the conceptual dependency graph.

For example:

Probability
↓
Expected Value
↓
Option Payoffs
↓
No-Arbitrage
↓
Put-Call Parity
↓
Risk-Neutral Pricing
↓
Black-Scholes
↓
Greeks
↓
Dynamic Hedging
↓
Volatility Trading

Create proper prerequisite relationships.

Avoid teaching concepts before their prerequisites.

---

# STEP 6 — DEFINE LEARNING LEVELS

Create a progression such as:

LEVEL 0 — Market Foundations

LEVEL 1 — Options Fundamentals

LEVEL 2 — Payoffs and Strategies

LEVEL 3 — Greeks and Risk

LEVEL 4 — Pricing and Probability

LEVEL 5 — Volatility

LEVEL 6 — Hedging and Portfolio Construction

LEVEL 7 — Quantitative Analysis

LEVEL 8 — Advanced Volatility Trading

LEVEL 9 — Market Microstructure and Market Making

LEVEL 10 — Professional / Research Topics

You may improve this structure.

Do not force exactly ten levels if a better taxonomy exists.

---

# STEP 7 — BUILD THE CANONICAL CURRICULUM

For EVERY module define:

## Module Metadata

- Module ID
- Title
- Level
- Difficulty
- Estimated duration
- Prerequisites
- Tags

## Learning Objectives

Use specific measurable outcomes.

Bad:

"Understand Greeks."

Good:

"Explain how gamma changes delta as the underlying moves and calculate the approximate change in delta for a given move."

## Concepts

List every major concept and subtopic.

## Required Mathematics

Clearly identify prerequisite math.

## Required Resources

Mark:

ESSENTIAL

## Recommended Resources

Mark:

RECOMMENDED

## Advanced Resources

Mark:

ADVANCED

## Exercises

Provide conceptual and computational exercises.

## Practical Work

Examples:

- Build payoff diagram
- Calculate Greeks
- Fit volatility smile
- Simulate delta hedging
- Backtest strategy
- Analyze historical event

## Mastery Check

Define how the learner proves understanding.

## Common Misconceptions

Document likely mistakes.

---

# STEP 8 — RESOURCE RESEARCH

For every important topic, identify the strongest resources.

Search across:

## Books

Include beginner through professional references.

Evaluate resources such as:

- Options, Futures, and Other Derivatives
- Option Volatility & Pricing
- Dynamic Hedging
- Volatility Trading
- Trading Volatility
- The Volatility Surface
- Paul Wilmott material
- Natenberg
- Taleb
- Euan Sinclair
- Sheldon Natenberg
- Lawrence McMillan
- Espen Gaarder Haug

Do not automatically recommend these just because they are famous.

Evaluate what each is best for.

## Academic Material

Find high-quality papers where relevant.

## Videos

Use reputable educators, universities, exchanges, or professionals.

## Courses

Consider:

- university lecture series
- exchange education
- quantitative-finance programs
- reputable MOOC material

## Websites

Prioritize authoritative educational material.

## Tools

Include useful tools such as:

- Python
- QuantLib
- volatility plotting tools
- backtesting libraries

---

# STEP 9 — RESOURCE METADATA

Every resource should ideally have:

```text
resource_id
title
author
organization
url
resource_type
free_or_paid
difficulty
estimated_time
topics
recommended_for
priority
prerequisites
country_relevance
description
reason_for_recommendation
last_verified
```

Avoid duplicate resources.

---

# STEP 10 — MATHEMATICS ROADMAP

Create a dedicated math track for options.

Determine exactly how deeply learners need:

- algebra
- logarithms
- functions
- probability
- random variables
- normal distribution
- expected value
- variance
- covariance
- calculus
- partial derivatives
- Taylor expansion
- differential equations
- stochastic processes
- Brownian motion
- Ito calculus
- linear algebra
- optimization
- statistics
- time-series analysis

Mark each as:

MANDATORY

USEFUL

ADVANCED

OPTIONAL

Explain exactly where each concept becomes necessary.

---

# STEP 11 — PROGRAMMING ROADMAP

Create a practical programming track.

Prefer Python for quantitative exercises.

Topics may include:

- Python fundamentals
- NumPy
- pandas
- matplotlib
- SciPy
- statsmodels
- QuantLib
- market-data ingestion
- data cleaning
- volatility calculations
- Black-Scholes implementation
- Greeks
- Monte Carlo
- backtesting
- optimization
- performance analysis

Create exercises tied to curriculum modules.

---

# STEP 12 — TRADING PRACTICE ROADMAP

Build a separate progression for trading practice.

Example:

Stage 1:
No trading. Learn payoff mechanics.

Stage 2:
Paper exercises.

Stage 3:
Historical trade reconstruction.

Stage 4:
Paper trading.

Stage 5:
Rule-based simulated strategies.

Stage 6:
Statistical strategy evaluation.

Stage 7:
Small-risk real-market implementation.

Do not encourage reckless leverage.

Trading practice should emphasize:

- defined risk
- position sizing
- journaling
- probability
- risk of ruin
- expected value
- transaction costs
- slippage
- discipline

---

# STEP 13 — INDIA-SPECIFIC TRACK

Create a dedicated India derivatives module covering:

- NSE options ecosystem
- index options
- stock options
- contract specifications
- expiry
- settlement
- lot size
- margins
- STT
- brokerage effects
- liquidity
- market timings
- SEBI regulations
- exchange circulars
- expiry changes
- physical settlement rules where applicable

Clearly separate:

STABLE CONCEPTS

from

TIME-SENSITIVE RULES

The latter should be stored in ways that can be updated later.

---

# STEP 14 — PROFESSIONAL TOPICS

Research whether the advanced curriculum should include:

- stochastic volatility
- local volatility
- Heston
- SABR
- jump diffusion
- calibration
- volatility surface construction
- SVI
- VIX
- variance swaps
- volatility swaps
- corridor variance
- dispersion
- correlation
- index arbitrage
- exotic options
- barriers
- digitals
- Asians
- lookbacks
- autocallables
- structured products
- volatility risk premium
- dealer gamma
- dealer vanna
- dealer charm
- flow effects
- market making
- inventory risk
- bid/ask modeling
- optimal execution
- 0DTE market structure

Only include advanced material where there is educational value.

---

# STEP 15 — PROJECTS

Create serious projects learners can build.

Examples:

### Project 1
Options Payoff Engine

### Project 2
Black-Scholes Pricing Library

### Project 3
Greeks Visualizer

### Project 4
Historical Volatility Analyzer

### Project 5
Implied Volatility Solver

### Project 6
Volatility Surface Builder

### Project 7
Delta-Hedging Simulator

### Project 8
Strategy Backtesting Framework

### Project 9
Volatility Risk Premium Study

### Project 10
Earnings Volatility Study

### Project 11
Index vs Constituent Dispersion Analysis

### Project 12
Dealer Gamma Approximation

For each project define:

- prerequisite modules
- objective
- data required
- implementation steps
- expected outputs
- evaluation criteria

---

# STEP 16 — FINAL GAP ANALYSIS

Once the curriculum is finished, attack it.

Ask:

- What did we miss?
- What is unnecessarily duplicated?
- What is too advanced too early?
- What professional topics remain uncovered?
- Is enough attention given to execution?
- Is enough attention given to risk?
- Is enough attention given to statistics?
- Is volatility deep enough?
- Are Greeks taught practically?
- Are misconceptions addressed?
- Are transaction costs included?
- Is there sufficient market-microstructure coverage?
- Is the India-specific material accurate?
- Are source materials high quality?
- Are there enough practical projects?

Perform at least THREE independent gap-analysis passes.

---

# STEP 17 — SAVE STRUCTURED ARTIFACTS

Create/update:

```text
docs/
    source-analysis.md
    roadmap-comparison.md
    curriculum.md
    knowledge-map.md
    math-roadmap.md
    programming-roadmap.md
    trading-practice-roadmap.md
    india-options-roadmap.md
    advanced-topics.md
    projects.md
    gap-analysis.md
    research-methodology.md
```

Also create machine-readable curriculum data.

Prefer something like:

```text
data/
    curriculum/
    resources/
    exercises/
    projects/
    learning-paths/
```

Use structured JSON/YAML/CSV as appropriate.

Do not create one giant impossible-to-maintain file.

---

# IMPORTANT RULES

Do not invent references.

Verify URLs and resources.

Prefer primary sources.

Clearly flag uncertain information.

Clearly separate facts from your recommendations.

Do not include a resource only because it is popular.

Do not optimize for number of resources.

Optimize for **learning quality**.

Do not make the beginner curriculum unnecessarily mathematical.

Do not make the advanced curriculum mathematically shallow.

Do not confuse trading strategies with trading edge.

Do not teach options as a collection of payoff diagrams.

Do not skip execution costs, risk, psychology, statistics, hedging, or volatility.

---

# FINAL DELIVERABLE

When this phase is finished, we should possess a research-backed canonical curriculum that can be directly imported into the future website.

Only after the curriculum and resource database are sufficiently mature should we proceed to software architecture.