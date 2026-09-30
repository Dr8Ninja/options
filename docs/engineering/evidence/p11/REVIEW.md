# P11 public learning interface — validation review

Implemented 27–28 September 2026 from P10 commit `3791349`, on `codex/p11-public-learning`. **P11 exit gate: PASS.** All 47 backend tests (2 unit/boundary, 45 PostgreSQL integration) passed without failures or skips. All 141 real HTTP captures match OpenAPI; 24 implemented public/CSRF operations match runtime contracts. [Actual API examples](api-examples.json), [query behavior](query-behavior.json) and [validation summary](validation.json) record the results.

## Scope and evidence

The public home, curriculum, program/phase, module, topic and subtopic pages read actual P10 DTOs on the server. They show publication-derived counts, ordered relationships, preparation, objectives, authored blocks or clearly labeled outlines, exact prioritized resource assignments, practice availability and next-topic links. No progress/bookmark/assessment controls pretend to work. Rendering, canonical URLs, titles/descriptions/OpenGraph, breadcrumbs, sitemap and environment-specific robots are implemented. Private/preview routes remain noindex/no-store.

The [five-case browser report](browser-results.json) records **5 passed, 0 failed, 35.9 seconds** against production Next, real Spring and disposable PostgreSQL containing the full P09 canonical import. Its single authored renderer specimen and publication approvals are explicitly synthetic test fixtures. They are neither API mocks nor approved canonical teaching. The test starts without PostgreSQL ANALYZE, exercising first-import query behavior.

The cases verify keyboard home → curriculum → phase → module → topic, a 308 alias redirect and 404 missing route, substantive HTML/math/tables with JavaScript disabled, canonical/OpenGraph/robots/breadcrumb metadata, sitemap inclusion/exclusion, sanitized unsafe content, widths 320/390/768, dark-theme axe checks, actual database withdrawal and actual API shutdown. Withdrawal tests require a successful refreshed sitemap, not just absence from an error body.

Screenshots inspected directly: [home](screenshots/home-desktop.png), [curriculum](screenshots/curriculum-desktop.png), [planned topic](screenshots/topic-outline-desktop.png), [authored desktop specimen](screenshots/lesson-desktop.png), [dark mobile specimen](screenshots/lesson-mobile-dark.png) and [mobile outage](screenshots/api-unavailable-mobile.png). Reading width, hierarchy, wrapping, status labels and recovery actions are legible. Math/table/code overflow is contained; keyboard skip navigation, menu Escape and focusable scrolling are verified. This is representative Chromium/axe/keyboard inspection, not a full screen-reader or cross-browser release acceptance claim.

Frontend checks pass formatting, lint, types, generated API/token drift checks and **23 tests**. Production build passes. The [validation summary](validation.json) records dependency/secret checks and screenshot fingerprints. All 85 preserved source/research/canonical inputs and 21 applied migrations remain unchanged. Renderer versions and MIT licenses are in [dependency evidence](renderer-dependencies.json).

The rebuilt persistent local stack passes **4 desktop/mobile smoke cases**. [Runtime evidence](local-runtime.json) verifies trusted local-CA HTTPS, protected 401 responses, no-store public/private delivery, 111 tables and 2,851 draft heads with zero publications/reviews/certifications/accounts. With no approved publication, it correctly renders an unavailable message. No production deployment or hosted CI run is claimed.

## Defects found and corrected

Cold filter validation previously expanded taxonomy joins; closed enums now skip that scan and scalar filters use fixed allowlisted columns. Page projection also evaluated correlated rule notices for skipped search rows: page latency grew until page 10 failed. The ordered candidate page is now bounded before metadata projection; [the diagnostic page-10 plan](bounded-page-plan.json) measured 38.384 ms for 51 candidate rows. This local diagnostic is not a production load budget. The complete browser sitemap traversal now passes.

The global streaming loading boundary turned redirects into HTTP 200; removing it restored 308/404 semantics while pending links retain navigation feedback. Mobile math initially lacked keyboard scrolling and rendered rejected commands with insufficient dark contrast; focusable regions and current-text-color errors fixed both without weakening axe assertions. A backend regression run overlapped another compilation and failed class loading; the isolated rerun passed all 47 tests and supersedes that failure. A local TLS leaf expired while work was paused; restarting the local proxy renewed it and CA-verified checks passed. Overlapping local smoke runs also collided in Playwright output; the final isolated four-case run passed.

## Boundaries

API additions are optional projections in OpenAPI 1.0.3, with generated Java/TypeScript contracts. No new mutation, schema migration or search service was introduced. Request-scoped caching is not shared caching; dynamic content remains no-store and generation checked. The renderer strips raw HTML, limits source/math expansion, refuses unsafe links and remote images, and never executes content code.

Persistent canonical content is still unreviewed. P12 discovery, P13 identity, P14 learner records, P15 assessment execution, P16 editorial workflows and P17 authored lessons remain outside P11. Full release accessibility, performance, security and recovery gates remain later assignments. Do not begin the next prompt automatically.
