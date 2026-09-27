# Master project requirements — record of the user's chat brief

Recorded 21 September 2026. **This is a structured summary of the master prompt supplied in conversation, not a verbatim attachment.** The two later prompt attachments are preserved in full alongside this file. The detailed execution checklist and stage assignments are in [PROMPTS.md](../../PROMPTS.md).

## Intended outcome

Create a serious, comprehensive, research-backed options-trading learning platform that takes a learner from absolute beginner toward professional understanding. It must explain what to learn, in what order, with which resources, through which exercises and how understanding is assessed. This is an educational system intended for eventual public production deployment, not a small tutorial or collection of links.

## Research and curriculum obligations

Read every supplied roadmap completely before proposing changes. Inventory all modules, topics, subtopics, sequences, resources, exercises and assessments. Treat the originals as starting evidence, not complete or necessarily current truth. Find strong/partial coverage, duplicates, omissions, outdated claims, sequencing problems, absent competencies and material that should be revised or removed from the canonical learning path, retaining provenance.

Research deeply across academic/quantitative literature, authoritative textbooks, exchanges/clearinghouses/regulators, university courses, broker education, professional trading/volatility/market-making literature, reputable practitioner sources and videos, primary papers, maintained open-source projects and Python tools. Prefer authoritative primary sources. Evaluate the curriculum repeatedly from professional perspectives before claiming completeness.

Cover foundations and contract mechanics; market infrastructure and microstructure; simple and multi-leg payoffs; primary and higher-order Greeks; no-arbitrage, replication and analytical/numerical pricing; especially deep volatility theory, measurement, surfaces, forecasting and derivatives; hedging; strategies organized by exposures, regime and expected edge; probability/statistics/mathematics; practical Python; portfolio and operational risk; psychology and disciplined decisions; professional trading/market making; structured products/exotics; and historical crisis/trading cases. The detailed minimum concept list is retained in P01 of the working guide.

Include global markets and a proper Indian path. Research NSE/SEBI and relevant exchange/clearing rules, named index contracts, expiry/lot changes, settlement, taxes/fees, brokerage/margin and restrictions. Design changing market facts as updateable, dated records instead of scattering constants through lessons or code.

Use a useful hierarchy of programs, phases, modules, chapters, topics, subtopics, resources, exercises, quizzes and projects. Modules need objectives, rationale, prerequisites, concepts, readings, exercises/assignments, mistakes, checkpoint questions, mastery criteria and study duration. Provide shared-module paths for beginners, retail, quantitative, volatility, market-making, Indian and systematic learners without duplicated content.

Resources need stable identity, title, author/organization, URL, type, difficulty, cost/access, effort, topics, recommendation rationale, prerequisites, priority, useful publication information, foundational/optional role, geographic relevance and verification date. Categorize Essential, Recommended, Advanced, Optional and Reference. Quality matters more than link volume. Separate application code, canonical curriculum data, resource metadata and research notes; build reliable import/seed mechanisms.

## Product and engineering obligations

Provide curriculum/module/topic browsing, search/filtering, resources, paths, prerequisites, duration/difficulty/tags, progress, bookmarks, completed topics, private notes, quizzes/exercises/projects, recommended next lessons, resource ratings and admin management with explicit release scope. Plan later flashcards/spaced repetition, trading journal, payoff/Greeks/BSM/volatility tools, strategy builder, paper-trading exercises and analytics without needless initial complexity.

Java and Spring Boot are mandatory. Choose supported versions and justify the frontend, strongly considering React/Next.js/TypeScript against SEO, performance, maintainability, integration, design, deployment and scale. Strongly consider PostgreSQL, relational modeling and Flyway; avoid premature microservices and all-purpose JSON storage. Model content relationships and user learning state with proper constraints.

Use professional controller/service/repository patterns where helpful, DTOs, validation, consistent errors, pagination/filtering/sorting, secure authentication/authorization, logging and configuration. Consider Spring Web/Data JPA/Security, OpenAPI, secure sessions or justified JWT, JUnit/Mockito/Testcontainers and Docker. Secrets stay outside source control. Address CSRF/CORS, rate limiting, production errors, health checks, structured logs, CI/CD, backup/recovery and monitoring.

Create a premium, accessible, responsive, keyboard-friendly UI with excellent typography, spacing and hierarchy. Design home, roadmap, modules and resource library for serious learning and mobile use; consider light/dark themes. Avoid a generic admin dashboard or plain link list. Public content needs suitable SSR/static rendering, semantic URLs, metadata/OpenGraph, canonical links, sitemap, robots and honest structured data.

Testing is mandatory: backend unit/integration/repository/API/auth with real PostgreSQL/Testcontainers; frontend component/integration and critical E2E journeys using Playwright or an appropriate equivalent. Verify security, accessibility, performance and deployed workflows before relevant readiness claims. Deployment preparation includes environment configuration, containers, migration safety, operations and recovery documentation.

## Sequencing and durable decisions

The master brief specified 16 phases: source analysis; missing-material research; canonical curriculum; resource database; requirements; architecture; database design; API design; frontend design; backend; frontend; seed data; testing; security review; performance review; production deployment preparation. Establish prerequisite artifacts before dependent work.

Maintain living research, curriculum, resource, product, architecture, database, API, frontend, security, testing, deployment, TODO and decision documents. Preserve knowledge outside chat. Repeatedly ask what a professional trader, volatility specialist, quantitative researcher, market maker, derivatives professor, risk manager or systematic trader would still expect to find. The working prompt sequence refines the phases into smaller tested assignments and explicitly maps back to them.
