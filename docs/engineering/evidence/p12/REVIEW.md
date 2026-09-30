# P12 public discovery — validation review

Resumed from P11 artifacts on `codex/p12-discovery`, 30 September–1 October 2026. **P12 exit gate: PASS.** Final results are recorded in [validation](validation.json); this review covers P12 only.

## Delivered behavior

The live resource library and global search provide URL-addressable intersecting filters, typed results, matching counts, closed sorting, bounded pagination, removal/reset and generation-change recovery. Filter choices remain available for empty intersections. Results carry source, cost and scoped verification metadata without per-result API requests. Resource detail explains rationale, preparation, rights/access limits, verification scope/date and exact assignments linking to relevant published topics. Unknown cost and unverified sources are labeled honestly.

Paths show audience, entry/exit capabilities, effort, ordered shared modules, branch rules, milestones, gates and projects. Blueprint gates stay planned descriptions; they do not pretend to be executable quizzes. Projects expose objectives, preparation, lawful data plans, work sequence, deliverables, rubric names/weights, limitations and noncoding routes. Public next links follow authored order; they neither infer personal readiness nor record progress. Ratings are deferred by P02 REQ-39, and no Tools navigation was added.

Server rendering uses P10 DTOs and the existing safe renderer. Detail routes retain redirects, canonical metadata and explicit publication indexability. Queryable landing pages conservatively remain noindex; dynamic responses remain no-store and publication-generation checked. Draft/protected material is excluded from results, facets and snippets. No entity or protected rubric descriptions, reference behavior or answer material is exposed.

## Real-stack validation

[Discovery browser results](browser-results.json): **6 passed, 0 failed (11.1 seconds)**. They cover search → filtered resource → exact topic, combined free/Beginner filters with reload/back/removal, pagination, empty/invalid/stale states, unpublished sentinel exclusion, path → shared module and project prerequisites. They also exercise keyboard focus, 320/390/768px layouts, dark axe checks, JavaScript-disabled content, raw server HTML and actual API shutdown. The stack uses production Next, real Spring and disposable PostgreSQL with the full P09 import; publication approvals and the one renderer specimen are test-only fixtures. No mocked API response is used to pass the gate.

[Reading regression](reading-regression.json): **5 passed, 0 failed (35.4 seconds)**. It reruns the five P11 journeys, including real withdrawal, metadata, redirects, sanitization and sitemap. New captures live under P12; historical P11 screenshots are preserved. [Local runtime](local-runtime.json) records the rebuilt persistent stack, which remains unpublished; all **4 local desktop/mobile smoke cases pass**.

Inspected [resource detail](screenshots/resource-desktop.png), [library filters](screenshots/library-filters-desktop.png), [path](screenshots/path-desktop.png), [project](screenshots/project-desktop.png) and [dark mobile library](screenshots/library-mobile-dark.png). Native filters are keyboard operable, applied values remain readable, narrow screens do not acquire page overflow, and planned/review status remains visible. These representative Chromium/axe/keyboard checks do not claim full screen-reader or cross-browser release acceptance.

All 47 backend tests pass without failures/skips; [suite records](backend-tests.json), [actual API examples](api-examples.json) and [query behavior](query-behavior.json) retain evidence. 145 actual HTTP captures match OpenAPI and 24 runtime public/CSRF operations match their contracts. Canonical scale is 2,851 identities and 2,462 public search rows in the disposable publication. One versus 50 topic results both use four SELECTs; measured representative requests take 27–66 ms. These local point measurements are not production load certification.

OpenAPI 1.0.4 adds optional facets, resource result metadata, preparation and path/project reading fields. Generated Java DTOs and frontend types agree. D046 documents use of the search API's existing bounded numeric pages for URL-addressable catalogs; D047 limits public assessment criteria to rubric names/weights. No migration, search cluster or P12 dependency was added. The traceability addition is an explicit hash-chained amendment preserving the original P02 document prefix.

## Findings and limits

Native multi-select labels initially included option text in their accessible names; separating labels with explicit associations repaired the two failed filtered-resource journeys. Fixture setup initially omitted required format metadata and revision sealing; both were corrected. Screenshot review prompted an assessment-link probe, which exposed an incorrect test assumption: canonical path gates are BLUEPRINT references, not QUIZ records. The final test verifies that these planned blueprints remain noninteractive. The irregular QUIZ plural mapping is separately corrected and unit-tested for actual public quiz descriptions.

Frontend checks cover formatting, lint, types, generated-contract drift and 29 tests; production build passes. Original preservation covers 85 inputs and 21 unchanged migrations. npm audit and secret scans pass. The Java HIGH/CRITICAL scan used the cached Trivy database dated 28 September 2026 after fresh downloads failed from both registries; it found no HIGH/CRITICAL issues, but is not a fresh vulnerability assessment. P12 changes no dependencies. P19 remains the full security gate.

Persistent canonical content is draft-only, with no reviews, certifications, publications or accounts created. No hosted CI result, production deployment, remote push, lesson authorship, learner personalization or assessment execution is claimed. P13 and later prompts have not been started.
