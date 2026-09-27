# PRODUCTION BUILD PROMPT — OPTIONS TRADING LEARNING PLATFORM

The research phase is complete.

The project now contains the canonical curriculum, source database, knowledge map, learning paths, exercises, projects, and related research documents.

Your objective is now to design and implement the actual production-quality web application.

You are acting as:

- Principal Software Architect
- Senior Spring Boot Engineer
- Senior Frontend Engineer
- Database Architect
- UI/UX Designer
- Security Engineer
- QA Engineer
- DevOps Engineer

The result must be deployable.

Do not treat this as a tutorial application.

---

# 1. FIRST INSPECT THE PROJECT

Before modifying anything:

- inspect the repository
- inspect existing files
- inspect project documentation
- inspect curriculum data
- inspect resource data
- inspect previous architecture decisions
- determine what already exists

Do not overwrite good existing work.

---

# 2. WRITE THE PRODUCT REQUIREMENTS

Create a proper:

`PRODUCT_REQUIREMENTS.md`

Define the MVP.

Recommended MVP:

### Public

- Homepage
- Curriculum explorer
- Learning paths
- Phase pages
- Module pages
- Topic pages
- Resource library
- Search
- Filtering
- Prerequisite visualization
- Resource details

### Authenticated

- Account
- Progress tracking
- Bookmarks
- Notes
- Completed modules/topics
- User dashboard
- Recommended next lesson

### Admin

- Manage programs
- Manage modules
- Manage topics
- Manage resources
- Manage tags
- Manage learning paths
- Manage prerequisites

Do not overstuff v1.

Place advanced trading tools in later milestones unless architecture strongly benefits from adding one foundational calculator.

---

# 3. SELECT THE ARCHITECTURE

Backend must remain:

**Spring Boot**

Use a modern supported Java version.

Recommended baseline to evaluate:

Backend:
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- PostgreSQL
- Flyway
- Bean Validation
- OpenAPI
- Testcontainers
- JUnit

Frontend recommendation to evaluate strongly:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui or carefully selected accessible component primitives

Explain whether:

Next.js frontend
↓ REST API
Spring Boot backend
↓
PostgreSQL

is the best architecture.

Consider SEO because curriculum pages should be indexable.

Avoid microservices unless there is an extraordinary justification.

A modular monolith is likely preferable.

---

# 4. MONOREPO STRUCTURE

Consider something like:

```text
options-academy/
    backend/
    frontend/
    data/
    docs/
    infrastructure/
    scripts/
```

Backend:

```text
backend/
    src/main/java/...
    src/main/resources/
    src/test/
```

Frontend:

```text
frontend/
    src/
    app/
    components/
    features/
    lib/
    hooks/
    types/
```

Data:

```text
data/
    curriculum/
    resources/
    exercises/
    learning-paths/
```

Infrastructure:

```text
infrastructure/
    docker/
    deployment/
```

---

# 5. DATABASE DESIGN

Use PostgreSQL unless research identifies a serious reason not to.

Design normalized relational tables.

Likely entities include:

```text
users
roles
user_roles

programs
phases
modules
chapters
topics

resources
resource_types
resource_topics

tags
topic_tags
module_tags

module_prerequisites
topic_prerequisites

learning_paths
learning_path_modules

exercises
exercise_topics

quizzes
quiz_questions
quiz_choices

user_topic_progress
user_module_progress
bookmarks
notes
```

Potential fields:

MODULE

```text
id
slug
title
description
difficulty
estimated_minutes
sequence
phase_id
status
created_at
updated_at
```

RESOURCE

```text
id
slug
title
author
organization
url
resource_type
difficulty
cost_type
estimated_minutes
description
recommendation_reason
priority
last_verified_at
```

Use join tables where appropriate.

Use unique indexes.

Use indexes based on actual access patterns.

Do not index blindly.

Create an ER diagram in documentation.

---

# 6. CURRICULUM IMPORT PIPELINE

The researched curriculum should not be manually hardcoded into Java classes.

Create an import/seed process.

Possible source formats:

- JSON
- YAML
- CSV where appropriate

Build a deterministic importer that:

- validates input
- handles duplicates
- validates slugs
- validates prerequisite references
- imports topics
- imports resources
- imports relationships

The seed process should be repeatable.

Avoid corrupting production data when re-running imports.

---

# 7. BACKEND API

Design a clean REST API.

Possible endpoints:

```text
GET /api/v1/programs

GET /api/v1/phases

GET /api/v1/modules

GET /api/v1/modules/{slug}

GET /api/v1/topics/{slug}

GET /api/v1/resources

GET /api/v1/resources/{id}

GET /api/v1/learning-paths

GET /api/v1/learning-paths/{slug}
```

Filters:

```text
?difficulty=
?type=
?tag=
?phase=
?free=
?topic=
```

Search:

```text
GET /api/v1/search?q=
```

User endpoints:

```text
GET /api/v1/me

GET /api/v1/me/progress

POST /api/v1/me/progress

POST /api/v1/me/bookmarks

DELETE /api/v1/me/bookmarks/{id}

POST /api/v1/me/notes
```

Admin endpoints must be authorization protected.

---

# 8. DTO STRATEGY

Do not expose JPA entities directly.

Use DTOs.

Examples:

```text
ModuleSummaryResponse
ModuleDetailResponse
TopicResponse
ResourceResponse
LearningPathResponse
UserProgressResponse
```

Keep mapping clear and maintainable.

Do not create dozens of meaningless DTO layers.

---

# 9. ERROR HANDLING

Create consistent error responses.

Example:

```json
{
  "timestamp": "...",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "errors": [...]
}
```

Support:

- validation errors
- entity not found
- unauthorized
- forbidden
- conflicts
- malformed requests
- server errors

Never leak stack traces in production.

---

# 10. AUTHENTICATION

Choose a suitable authentication architecture.

Evaluate:

- secure HTTP-only session cookies
- JWT access/refresh mechanism
- third-party authentication provider

For a web-first application, prefer the simplest secure architecture.

Document reasoning.

Support:

- register
- login
- logout
- password hashing
- user roles
- ADMIN
- USER

Potential future OAuth:

- Google
- GitHub

Do not implement fragile homegrown crypto.

---

# 11. SECURITY

Perform proper security design.

Include:

- BCrypt/Argon2 as appropriate
- authorization
- secure cookies
- CSRF strategy
- CORS
- input validation
- SQL injection prevention
- XSS protection
- rate limiting for auth
- brute-force prevention
- secret handling
- security headers
- admin protection
- dependency vulnerability checks

Create:

`SECURITY.md`

---

# 12. FRONTEND DESIGN SYSTEM

The website must look premium.

Do not settle for default framework styling.

Create:

- typography system
- spacing scale
- container widths
- card styles
- borders
- radius system
- shadows
- light/dark theme
- component states
- accessibility rules

Use subtle visual treatment inspired by high-quality software products.

Avoid excessive gradients and gimmicks.

---

# 13. INFORMATION ARCHITECTURE

Suggested navigation:

```text
Home
Learn
Roadmap
Resources
Projects
Tools
Dashboard
```

Potential user navigation:

```text
Progress
Bookmarks
Notes
Profile
```

Admin separate.

---

# 14. HOMEPAGE

Design a premium homepage.

Possible structure:

HERO

"Master options from first principles to professional volatility trading."

Primary CTAs:

Start Learning

Explore Roadmap

Then:

Learning Tracks

Curriculum statistics

Interactive roadmap preview

Featured modules

Featured projects

Why this curriculum is different

Study methodology

Progress experience

Footer

Do not overcrowd the hero.

---

# 15. ROADMAP EXPERIENCE

This is one of the most important pages.

It should visually communicate progression.

Possible design:

```text
Phase 1
  ↓
Foundations

Phase 2
  ↓
Options Mechanics

Phase 3
  ↓
Greeks

Phase 4
  ↓
Volatility
```

Allow:

- progress states
- locked/not-yet-ready states based on prerequisites if desired
- estimated durations
- difficulty
- prerequisites
- expandable sections

---

# 16. MODULE PAGE

Each module page should contain:

HEADER

- Module name
- Difficulty
- Estimated time
- Completion status

OVERVIEW

- Why this matters
- Learning objectives

PREREQUISITES

TOPICS

RESOURCES

- Essential
- Recommended
- Advanced

PRACTICE

- Exercises
- Projects
- Quiz

COMMON MISTAKES

MASTERY CHECK

NEXT MODULE

---

# 17. RESOURCE LIBRARY

Filters:

- Type
- Difficulty
- Free/Paid
- Priority
- Topic
- Track

Resource card:

- Title
- Author
- Resource type
- Difficulty
- Cost
- Time estimate
- Why recommended
- Topics

Search should be fast.

---

# 18. SEARCH

Design search intentionally.

MVP may use PostgreSQL full-text search.

Avoid Elasticsearch/OpenSearch unless justified.

Search:

- topics
- modules
- resource titles
- authors
- descriptions
- tags

---

# 19. PROGRESS TRACKING

Allow users to:

- start module
- mark topic complete
- mark module complete
- view percentage progress
- resume learning

Store progress server-side.

Do not rely solely on localStorage.

---

# 20. BOOKMARKS & NOTES

Users should be able to bookmark:

- modules
- topics
- resources

Users should be able to create private notes.

Design the data model cleanly.

---

# 21. SEO

Implement:

- semantic slugs
- SSR/SSG where appropriate
- metadata
- canonical URLs
- OpenGraph
- sitemap.xml
- robots.txt
- breadcrumb schema where appropriate
- educational structured data if justified

---

# 22. PERFORMANCE

Backend:

- pagination
- efficient queries
- avoid N+1
- proper fetch strategies
- indexes
- query measurement

Frontend:

- code splitting
- server rendering where useful
- optimized images
- caching
- lazy loading

Set measurable performance expectations.

---

# 23. TESTING STRATEGY

BACKEND

Use:

- JUnit
- Spring Boot Test
- Testcontainers
- PostgreSQL integration tests

Test:

- repositories
- services
- controllers
- authentication
- authorization
- validation
- curriculum import

FRONTEND

Test:

- critical components
- curriculum rendering
- filtering
- progress interactions
- auth states

E2E

Use Playwright.

Test flows like:

```text
Visitor opens roadmap
Visitor opens module
Visitor creates account
User completes topic
Progress updates
User bookmarks resource
User resumes module
Admin edits resource
```

Do not consider the app complete while major flows are untested.

---

# 24. DOCKER

Create production-appropriate Dockerfiles.

Potential development setup:

```text
docker compose up

postgres
backend
frontend
```

Development should be straightforward.

---

# 25. CI/CD

Create a GitHub Actions workflow or equivalent.

On pull requests:

- backend compile
- backend tests
- frontend lint
- frontend type check
- frontend tests
- build

Deployment branch:

- production builds
- migration safety
- deployment workflow

---

# 26. DEPLOYMENT

Evaluate hosting such as:

Frontend:

- Vercel
or
- Cloudflare Pages where appropriate

Backend:

- Railway
- Render
- Fly.io
- AWS
- another production service

Database:

- managed PostgreSQL

Do not blindly choose AWS if a simpler provider works better.

Document recommended:

1. MVP deployment
2. scalable deployment

---

# 27. OBSERVABILITY

Include:

- backend health endpoint
- structured logs
- error tracking
- uptime monitoring
- frontend error tracking

Consider:

- Spring Boot Actuator
- Sentry
- application logs
- database metrics

---

# 28. BACKUPS

Document:

- automated PostgreSQL backup strategy
- restore strategy
- migration rollback considerations

---

# 29. IMPLEMENTATION ORDER

Do not build everything simultaneously.

Recommended milestones:

## MILESTONE 1
Repository + architecture

## MILESTONE 2
Database + migrations

## MILESTONE 3
Curriculum importer

## MILESTONE 4
Public read APIs

## MILESTONE 5
Frontend design system

## MILESTONE 6
Homepage

## MILESTONE 7
Roadmap

## MILESTONE 8
Module/topic pages

## MILESTONE 9
Resource library

## MILESTONE 10
Authentication

## MILESTONE 11
Progress/bookmarks/notes

## MILESTONE 12
Admin

## MILESTONE 13
Testing

## MILESTONE 14
Security review

## MILESTONE 15
Performance review

## MILESTONE 16
Deployment

Complete and validate each milestone before proceeding.

---

# 30. USE CODEX EFFECTIVELY

When delegating implementation work to Codex, provide bounded tasks.

Bad instruction:

"Build the website."

Good instruction:

"Implement PostgreSQL/Flyway schema for Program, Phase, Module and Topic according to DATABASE.md. Add JPA entities, repositories, integration tests with Testcontainers, and update API documentation. Do not implement authentication yet."

Every Codex task should specify:

- objective
- relevant files
- constraints
- acceptance criteria
- tests
- things not to modify

Review Codex's work before moving forward.

Do not assume generated code is correct.

---

# 31. DEFINITION OF DONE

The application is not done merely because it runs locally.

Done means:

- curriculum renders correctly
- major APIs work
- authentication works
- progress works
- bookmarks work
- responsive UI works
- forms validate correctly
- authorization is enforced
- unit/integration tests pass
- E2E flows pass
- Docker builds succeed
- production build succeeds
- migrations work from an empty database
- accessibility is reasonable
- no critical security issues remain
- deployment succeeds
- production smoke tests pass
- documentation is sufficient for another developer to operate the system

---

# 32. FINAL REVIEW PASSES

Before declaring completion perform:

### Architecture review

Look for:

- unnecessary complexity
- tight coupling
- duplicate code

### Database review

Look for:

- missing indexes
- N+1 queries
- poor relationships
- inefficient access patterns

### Security review

Look for:

- auth bypasses
- insecure endpoints
- exposed secrets
- weak validation
- insecure cookies

### UI review

Look for:

- visual inconsistency
- poor mobile layout
- accessibility issues
- confusing navigation

### Research integrity review

Confirm:

- curriculum content has not been accidentally lost
- sources remain properly attributed
- external links work
- no fabricated references exist

### Deployment review

Test from fresh infrastructure.

---

# 33. PROJECT DOCUMENTATION

Maintain:

```text
README.md

docs/
    PRODUCT_REQUIREMENTS.md
    ARCHITECTURE.md
    DATABASE.md
    API.md
    FRONTEND.md
    SECURITY.md
    TESTING.md
    DEPLOYMENT.md
    DECISIONS.md
```

The README should allow a new developer to run the application from scratch.

---

# CORE RULE

Do not optimize for getting code written quickly.

Optimize for:

**correct architecture + maintainable code + excellent UX + trustworthy curriculum + successful production deployment.**

The finished system should feel like a real software product, not an AI-generated demo.