# Product requirements and release contract

P02 · version 1.0 · 22 September 2026 · **Specification, not implemented behavior.**

The first release, **R1 Foundations**, will offer a complete, assessed introduction to contract obligations, cash flows and risk alongside an honest map of the larger curriculum. It will not promise professional trading competence. The [content release plan](CONTENT_RELEASE_PLAN.md) fixes the 36-topic teaching slice; the [traceability matrix](REQUIREMENTS_TRACEABILITY.md) assigns the original requirements; [TODO](../project/TODO.md) records execution order. Requirements below are normative unless explicitly assigned to a later release.

## Entry gate and authority

P01 `1.0.0-design` passes the entry gate for product planning. On 22 September, inventory parity, canonical validation with negative tests, source hashes and local links were rerun successfully. The immutable [entry evidence](evidence/p01-entry-check.json) records 23 exports, 70 competencies, 120 hard prerequisite edges, 6,402 mappings and zero reviewed lessons. Prior numerical and byte-identical rebuild results were inspected, not mislabeled as new application tests. No application directories exist.

The gate is bounded: 1,025 topics are scopes/briefs, 141 of 152 reading assignments are candidates, and all 27 market-rule records deny current operational publication eligibility. R56 statistics, R58 wording, current NSE/BSE masters and other exclusions in [P01 reconciliation](../research/RECONCILIATION.md) carry forward. They do not prevent a synthetic foundation course; they do prevent publishing an operational tax, contract or trading calculator. P02 does not change canonical readiness labels.

Latest user instructions and PROMPTS.md control scope. The master brief is preserved as a structured chat summary, not a verbatim original. Java/Spring Boot remains mandatory; supported versions, frontend, authentication architecture, database design and hosting are P03–P05 decisions. This document specifies observable behavior, not tables, endpoints or an application schema.

Release assignments: **R1** blocks the initial product release; **MAP** is an R1 public curriculum/proposal view without a lesson-completion claim; **LATER** is an explicit expansion requiring a new bounded assignment; **OPERATIONS** must pass before the separately authorized P22 deployment. All R1 requirements are mandatory; a missing feature must not be hidden behind a reduced acceptance test.

## People, goals and journeys

Personas are design hypotheses, not interview findings. English is the initial authored language. Translation remains future work. The planning assumption is an adult, self-directed audience using an ordinary browser, sometimes on a phone or a slow connection. Operator, age policy and launch territories require confirmation before public registration (U02 below).

| Persona | Goal and likely preparation | R1 journey and honest boundary |
|---|---|---|
| Absolute beginner | Explain what can be owed, calculate net loss and decide when zero contracts is appropriate; basic arithmetic only | Start R1 Foundations, use an arithmetic bridge, practice manually, pass six gates and self-review a cash-ledger project. No calculus or coding required. |
| Retail/discretionary learner | Replace strategy labels and win-rate claims with obligations, costs and falsifiable decisions | Take the entry diagnostic, inspect worked examples, attempt gates, then browse the planned retail path. R1 does not certify strategy selection or an edge. |
| Quantitative/systematic learner | Find numerical prerequisites, reproducible projects and research-validity controls | Inspect math/Python preparation and PR01–PR12 project specifications; complete any desired foundation work. Coding, pricing and backtest projects remain planned. |
| Volatility specialist | Find variance, surfaces, hedging and event/correlation dependencies | Navigate the volatility path, source scopes and project requirements; see exactly which instruction is unpublished. No implied full volatility course. |
| Market maker/execution specialist | Locate quoting economics, fills, inventory, capital and operational controls | Inspect specialist map and prerequisites, use the foundation reconciliation drill; advanced simulations remain planned. |
| Indian learner | Distinguish index/stock obligations and verify dated exchange rules | Use hypothetical contracts in R1; inspect the planned India path and rule-verification explanation. No current lot, expiry, margin or tax value is asserted by the initial course. |
| Risk/portfolio learner | Separate terminal payoff from interim funding and concentration | Use cash/assignment cases and inspect later risk/portfolio branches; no claim of full risk-management qualification. |
| Editor/reviewer | Correct evidence, write teachable lessons and publish coherent versions | Draft → preview → review → publish or withdraw, with evidence and conflict handling. |
| Administrator/operator | Maintain access, content integrity and recoverability | Manage roles and release controls, inspect sanitized audit records, restore a rehearsal environment; private learner writing is not an editorial input. |

The teaching loop is explanation → original worked example → learner calculation → specific feedback → fresh transfer check → next eligible lesson or remediation. A diagnostic recommends placement; it does not silently award module mastery. A specialist can read any published lesson without a prerequisite lock. Assessment credit requires the listed prerequisite evidence. No recommendation infers financial suitability or suggests a live trade.

### Capabilities and separation of duties — REQ-03

| Capability | Visitor | Verified learner | Editor | Reviewer/publisher | Admin |
|---|---|---|---|---|---|
| Public map, reviewed lessons, resources, project briefs | Yes | Yes | Yes | Yes | Yes |
| Anonymous practice and diagnostic | Transient only | Yes | As learner | As learner | As learner |
| Persistent progress, own notes/bookmarks/attempts/export | No | Own only | Own only | Own only | Own only |
| Draft/edit/reorder curriculum and preview drafts | No | No | Yes | Yes | Only with editorial role |
| Approve/publish/withdraw a content version | No | No | No | Yes | Only with publisher role |
| Assign/revoke privileged roles and suspend accounts | No | No | No | No | Yes; audited |
| Read another learner's notes/answers | No | No | No | No | No routine UI access |

Roles may belong to one account. R1 permits one accountable operator to author and publish, but requires separately recorded technical, teaching, assessment and accessibility review events before approval. Record whether the reviewer is also the author; never describe self-review or one agent's lenses as independent expert review. A second reviewer is recommended when available, not an invented staffing prerequisite. Routine operators use metadata only. Exceptional infrastructure access to private records requires a documented incident purpose, restricted authorization and access audit; never promise that stored data is physically inaccessible to the service operator. Privileged authentication needs a second factor; P03 chooses a supported mechanism and recovery process.

## Functional contract

### REQ-01 — Educational scope and claims

R1 is free to read and has no checkout, brokerage connection, order routing, live prices, investment recommendations or real-money graduation requirement. Account creation is optional for reading and required for durable learning records. User-facing copy states the limited learning outcome; no profitability, accreditation, expert endorsement or professional certification claim. Synthetic contracts, currencies, fees and risk budgets are labeled in every applicable example. **Accept:** J01/J13 show a complete manual route and no action requiring money, a broker or paid data.

### REQ-02 — Map versus publication

R1 exposes a reviewed public map of all 70 modules, 1,025 topics, seven canonical paths, twelve project specifications and seven capstones, preserving their stable identities. The complete map is separate from the 36 published lessons. Public map descriptions must pass metadata/rights review; raw archives, internal evidence notes and draft lesson bodies are not automatically public. Each entity shows Published lesson, Planned scope, Under review or Withdrawn as applicable. Published counts count actual reviewed lessons only. Planned pages are functional informational pages with prerequisites, scope, expected effort and an explanation of what remains; they have no Start lesson, Complete or Quiz controls. **Accept:** J01/J03 and a public-payload audit find zero draft bodies or answer keys; 36/1,025 is never displayed as full-program mastery.

### REQ-04 — Home and navigation

Public navigation is Home, Learn, Curriculum, Paths, Resources and Projects; account/dashboard and a separate authorized editor area appear when relevant. Home has Start Foundations and Explore Curriculum, truthful published/planned counts, learning method, source policy and limited project highlights. Learn opens the released course; Curriculum opens the full map. No Tools, ratings, journal or flashcard navigation until implemented under a later contract. A planned project may link to its real specification with a Planned badge, not to a fake workspace. **Accept:** J01 reaches a reviewed lesson within three deliberate link activations from home, with a keyboard-operable equivalent.

### REQ-05 — Hierarchy and stable navigation

Program → phase → module → topic → addressable scope/lesson sections follows canonical order. Chapters are omitted in R1 because none exists in P01; adding a real chapter later must preserve existing deep links. Show breadcrumb, title, difficulty, meaningful tags, objectives, why it matters, preparation, ordered topics, study-time range/basis, resources, mistakes, practice and next step. Distinguish module-wide estimates from the released subset. A text/list view provides all dependency information shown in a diagram. Retired slugs resolve to a labeled replacement or explanatory tombstone; unknown slugs show a useful not-found page. **Accept:** J01/J03 deep-link, reload, Back and narrow-screen navigation preserve context without invented empty hierarchy levels.

### REQ-06 — Lesson delivery

Each released topic meets CR-01–CR-08 in the content plan: original explanation, defined symbols/units, a worked calculation, a misconception/counterexample, original practice, feedback, exact citations and a next step. Tables and diagrams have equivalent text/data; essential learning does not depend on watching an inaccessible external video or buying a book. Browser print of a lesson preserves text, citations and tables without private annotations by default. **Accept:** J02 can finish the whole required sequence with paper/basic calculator and the platform's own instruction when external resource sites are unavailable.

### REQ-07 — Prerequisites and diagnostics

Show hard prerequisites separately from recommended preparation and optional enrichment, with a reason and a link. The R1 lesson sequence has its own assessed, narrower prerequisites; it grants no automatic whole-module competency. Public reading remains open. Before a gate, missing prerequisite evidence produces an explained remediation link; a versioned diagnostic/earlier gate may supply the evidence. A four-question entry diagnostic checks signed arithmetic, percentages, units and reading a table; it is untimed, offers solutions after submission and points to the first relevant bridge. **Accept:** J03/J12 demonstrate both zero-prerequisite beginner entry and an experienced learner's supported placement without circular or unpublished dependencies.

### REQ-08 — Paths and duration

Every path page states audience, entry and exit outcomes, ordered shared content, branches, readiness and editorial study-time range. Only `R1-FND` can be completed in R1. None of PATH-BEGINNER/RETAIL/QUANT/VOL/MM/INDIA/SYSTEMATIC can be completed with 36 topics. A learner can select a specialist interest to organize map/recommendation links, but cannot enroll into a falsely complete specialist course. R1 enrollment has a fixed version and denominator. **Accept:** J03 shows an explicit complete-course versus planned-path distinction; a shared topic is not duplicated in progress or bookmarks.

### REQ-09 — Projects and capstones

The project browser displays all twelve capability specifications and seven original capstone briefs with prerequisites, learning outcome, data rights, steps, deliverables, rubric, failure cases and effort. Their implementation workspaces and formal assessment remain planned. The R1 cash-and-obligations dossier is a separate, noncoding release project, not completion of PR01 or a professional capstone. **Accept:** J13 finds the R1 worksheet, completes its self-review and sees a Self-reviewed project outcome distinct from a server-scored gate.

### REQ-10 — Resource library

Library cards/details expose stable title/author or organization, type, difficulty, free/paid/mixed/unknown access, prerequisites, effort/basis, Essential/Recommended/Advanced/Optional/Reference priority, rationale, geography, canonical link, edition/DOI when known, verification date/scope and replacement/status. Unknown means unknown with an explanation. Filters cover type, difficulty, cost, priority, topic/tag, path, source/organization, geography and verification/readiness. Within a facet selected values are OR; across facets they are AND. Sort by relevance when searching, otherwise priority then title then stable ID; support title, estimated time and last verified, with unknowns last. Public metadata candidates remain labeled and cannot be presented as verified required assignments. **Accept:** J04 uses combined filters, follows a resource to its exact assignment and sees any paywall or review limitation before leaving.

### REQ-11 — Search and filter behavior

Search public titles, authors/organizations, descriptions and topical tags across modules, topics, resources, paths and projects; never search private notes, drafts or answer keys. Global facets are entity type, phase/module, difficulty, topic/tag, path and readiness; resource-specific facets are available in the library. Phase/module/path filters use explicit membership or discovery associations, not a claim that every linked resource supports every topic. Match canonical IDs and case-insensitive exact titles first, then title/author tokens, then tags/descriptions; stable ID breaks ties. P05 must specify ranking tests, including “M21.01”, “assignment”, “Natenberg” and “margin”. Default results include published lessons and labeled public map entries; Ready to learn filters to published instruction. Filter/sort/page state survives a shareable URL, reload and Back. Page size defaults to 20, selectable 20/50, maximum 50; filter changes reset page 1. Query maximum 200 characters; empty query browses the selected entity type, punctuation-only query has an explained empty state. Reject unsupported filters/sorts without silent fallback. **Accept:** J05 proves combinations, deterministic pagination, retired content treatment and exclusion from snippets and counts as well as result bodies.

### REQ-12 — Source transparency and rights

Lesson citations identify source/edition and reviewed section, date and scope. Access checking, bibliographic review, selected reading and numerical verification have different labels. Keep archival mappings privately available to editors; public citations need not expose local filesystem paths. Link to third-party material; do not redistribute books, videos, market data or supplied archives without rights. R1 synthetic inputs carry an author/rights record and a clear data dictionary. **Accept:** CR-03 and J04 trace every adopted release claim and required exercise dataset to usable evidence/permission; no inherited module association is treated as an exact topic citation.

### REQ-13 — Common interaction states

Every journey specifies initial, loading, empty, error, success and interrupted states. Show an accessible loading indicator by 500 ms, and timeout/retry guidance after 10 seconds; an empty result is not an error. Preserve already rendered public text during network failure. R1 has no offline synchronization or background mutation queue: offline changes stay visibly unsaved in the current tab, with copy/retry options and a warning before leaving. Never display Saved before server acknowledgment. A reconnect or double-click cannot duplicate a mutation/attempt. An expired session requires login with a safe same-origin return destination; retain in-tab nonsensitive work when feasible and warn before loss. Private drafts are cleared on explicit logout/account switch; offer copy before doing so. No private browser-persistent draft cache by default. **Accept:** each J01–J17 failure fixture demonstrates its safe state; server errors show a correlation reference, not a stack trace or private content.

### REQ-14 — Accessibility

Target WCAG 2.2 AA for complete public, learner, authentication and editorial processes. P18 must map applicable success criteria and combine automated scans with keyboard and assistive-technology checks. Require semantic headings/landmarks, visible unobscured focus, labeled errors/status announcements, non-color status cues, contrast, reduced motion, text alternatives and accessible math/tables. Reflow at 320 CSS pixels and 400% zoom; essential wide tables may scroll within a labeled region with a text alternative. Authentication allows password managers and paste; no memory puzzle is a required route. Assessments are untimed and support keyboard/screen-reader input. These targets follow [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/); conformance is not claimed before testing. **Accept:** J17 completes reading, account, assessment and editorial paths without a mouse; all target violations block release, even if an automated score is high.

### REQ-15 — Devices, browsers and visual quality

Support responsive web at 320, 390, 768, 1280 and 1440 CSS-pixel test widths, portrait/landscape, touch and keyboard. At release, support current and previous major Chrome, Edge and Firefox on supported desktop operating systems, Safari on current/previous macOS and iOS, and current/previous Chrome on Android. Record actual versions in P18; no timeless version number is assumed. Test NVDA with Firefox on Windows and VoiceOver with Safari on macOS/iOS. No native app, Internet Explorer or embedded in-app browser guarantee. Core reading works without client scripting where feasible; authenticated controls explain if JavaScript is required. R1 includes light and dark themes plus system preference, readable long-form typography and a consistent component/state system; both themes meet contrast targets. Theme preference may be stored locally without learning data. **Accept:** visual review uses real long titles, equations, tables and empty/error states across the matrix, not blank cards.

### REQ-16 — Registration and verification

Register using email and password; optional display name, no phone, real name, financial profile or broker account. Verify email before durable private writes. Reading remains available while verification is pending. Duplicate/unknown-account responses avoid revealing account existence. Verification links expire after 24 hours, are single-use and can be resent with clear limits. The design accepts passwords of 15–128 Unicode code points, checks common/compromised values, permits spaces/paste/password managers, and has no forced composition pattern or routine expiry. P03/P19 validate secure supported handling; this policy is informed by [NIST SP 800-63B-4 §3.1.1](https://pages.nist.gov/800-63-4/sp800-63b.html), not a claim of NIST certification. **Accept:** J06 covers valid, invalid, duplicate, expired/reused link, delivery failure and refresh without creating duplicate accounts. No public request can assign a privileged role.

### REQ-17 — Login, logout and account security

Support email/password login, current-session logout and logout-all-sessions. Learner sessions expire after 24 hours idle or seven days absolute; privileged sessions after 15 minutes idle or eight hours absolute, with accessible warning and extension by reauthentication. Privileged actions and account deletion require recent authentication within five minutes. Changing/resetting a password revokes existing sessions. P03 decides sessions versus another secure architecture. Auth/session material must not be exposed in ordinary URLs, logs or browser-readable persistent storage. Initial rate-limit fixtures: ten failed logins per account per 15 minutes trigger a 15-minute throttle, plus source-level abuse controls; do not lock an account permanently. **Accept:** J07 covers deep links, revoked/expired sessions, two devices and Back after logout, with no private response served from public caches.

### REQ-18 — Recovery and account maintenance

Forgot-password responses are generic for known/unknown addresses. Reset links expire after 30 minutes, are single-use, and never auto-login the user; success directs normal login and revokes existing sessions. Limit reset/resend requests to five per hour per address and 20 per hour per source, counting unknown addresses equivalently; P19 checks shared-network usability and enumeration behavior. Change-email requires recent authentication and verification of the new address; keep the old login until completion and notify the old address. Cancel/expiry leaves the old address unchanged. No security questions or support bypass based on guessed identity. Lost mailbox recovery is not promised; the support policy must explain limits. [OWASP recovery guidance](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) informs these controls; the exact time/rate values are product choices. **Accept:** J08 covers wrong/expired/reused tokens and failed delivery with a local mail adapter; actual authorized delivery is a P22 gate, not assumed now.

### REQ-19 — Ownership and preferences

Authenticated identity determines ownership of every progress, bookmark, note, attempt, project record and export. Neither a guessed ID nor a supplied user/role field can grant access. Lists, search, counts and cached pages enforce the same isolation as detail/mutation operations. Learners can change optional display name, theme and chosen learning interest; no public profile or leaderboard. **Accept:** two-user tests cover read/list/create/edit/delete/export and cross-account browser switching. Editors/admins cannot retrieve private writing through ordinary learner endpoints.

### REQ-20 — Progress and version changes

Persist started and self-completed lesson states server-side, separately from attempts and demonstrated gate results. A topic may be reopened without deleting its assessment history. Module completion is derived from all mandatory topics in its pinned module version, never from the subset currently published. “Mark module complete” is a reviewed summary action allowed only when those requirements exist and are complete; unavailable for partial modules. R1 progress displays “x of 36 lessons self-completed”, six gate results and the project self-review separately. Completion of R1 requires all three conditions in CR-06. An additive course version does not silently lower an enrolled learner's denominator: offer explicit migration with a change summary and preserve the old completion record. Critical corrections can flag affected mastery Needs recheck while preserving original scores. A stale completion/reopen write is rejected with the current saved state and an option to refresh and deliberately reapply; it cannot silently reverse a newer decision. **Accept:** J09/J15 exercise 18/36 → new version, retirement, shared topics, idempotent updates and stale concurrent writes without erased history.

### REQ-21 — Bookmarks

Bookmark modules, topics and resources, including clearly labeled planned map entries. The same account/entity pair appears once; repeated add/remove is idempotent. Show type, title and current publication state in a paginated private list. A retired target retains a labeled saved reference and replacement link; do not silently delete it. **Accept:** J10 tests refresh, another device, duplicate requests, filters, empty state and an inaccessible/retired target without exposing another account's list.

### REQ-22 — Private notes

Plain-text notes may attach to a module, topic or resource; one note per account/target in R1, maximum 10,000 characters. They are editable, deletable, timestamped and exportable. Explicit Save shows Saving/Saved/Failed with last saved time; no silent background overwrite. A stale revision returns a conflict view with the current saved text and the learner's unsaved text, allowing copy and deliberate replacement after refresh. Rendering never executes HTML or links as code. Deletion asks confirmation and clearly states backup retention; no undeclared trash bin. **Accept:** J11 covers two tabs, offline/session expiry, length boundary, markup input, deletion and ownership.

### REQ-23 — Dashboard, resume and next step

Show enrolled release/version, self-completion, assessment results, project status, last confirmed location, bookmarks and relevant correction notices. Resume goes to the last accessible lesson/section; a withdrawn target routes to its explanation and a safe alternative. Deterministic recommendation order: unresolved critical remediation → earliest missing required prerequisite → next incomplete released lesson → next eligible gate/project → course-complete summary and planned-path map. Display the reason. Never recommend an unpublished lesson as Start learning; after R1 completion, say that further instruction is planned. **Accept:** J09 covers a new account, partial course, failed gate, stale lesson, complete course and no eligible next item. No ML profiling is needed.

### REQ-24 — Quizzes and scored feedback

R1 supports single-choice, explicit multi-select and numerical responses with stated units/rounding/tolerance. Server-side scoring is authoritative; each attempt pins question, solution and rubric versions. Six gates each contain ten equally weighted items, three designated critical checks and two authored forms. Pass is at least 85% with no critical errors; with ten equal items that requires at least nine correct. Multi-select is all-or-nothing unless a reviewed rubric explicitly replaces that rule. Missing answers score zero and must be confirmed before submission. No timing pressure or competitive rank. Show item-specific explanation after submission only; draft/client payloads contain no answer key. Numerical invalid input is a validation error, not a secretly scored zero. **Accept:** J12 and boundary tests cover scores, units, tolerance, critical override, tampered scores, answer leakage, ownership and resubmission.

Retry requires viewing targeted remediation and completing a transfer task before switching to the other form. After both forms have been seen, further attempts are labeled repeated practice and do not create new “fresh transfer” evidence. If both forms fail, show Request fresh assessment, creating a private assessment-maintenance item linked to the failed gate and remediation. The learner sees its pending state; the operator target is a reviewed replacement within five business days under the stated staffing assumption. An approved replacement form is required for new mastery evidence; no claim of unseen questions from reshuffling old ones. Version withdrawal freezes an in-progress gate, preserves answers privately and explains the restart; a minor editorial change can leave the pinned version available. Incomplete attempts have no mastery claim. This is educational evidence, not proctoring or identity-certified competence.

### REQ-25 — Exercises and solution release

Each R1 lesson has a numerical/structured practice case and a changed-input transfer variant, feedback for the likely error and a reference solution. Anonymous users can practice transiently; verified learners save attempts. Requesting a practice solution is allowed and labeled Solution viewed; it cannot count as fresh assessment evidence. Provide printable inputs and semantic tables; no remote code execution or notebook runtime. **Accept:** J02/J12 can explain a wrong answer, retry with changed inputs and recover from a failed save without false completion.

### REQ-26 — R1 project assessment

The cash dossier is completed with a local worksheet and structured answers in the platform. R1 stores only the learner's text/numerical responses and self-review rubric, not uploaded files or executable code. A reference solution appears after submission/self-review. Deterministic numerical fields may be checked automatically; qualitative reasoning remains explicitly self-assessed. Self-review requires at least 85% and no acknowledged critical error; it is not labeled reviewer-certified mastery. Optional free text is limited to 20,000 characters per dossier. Formal instructor grading, file uploads and all twelve coding project submissions are LATER. **Accept:** J13 proves clear assessment labels, one submitted version per attempt, correction/retry history and private ownership.

### REQ-27 — Editorial management

Authorized editors create, edit, reorder and retire program/phase/module/topic/subtopic metadata, tags, resources/assignments, paths/prerequisites, lessons, exercises/quizzes/projects and rule-verification records. Chapters have no empty UI in R1; add them only through a later justified hierarchy change. Draft → in review → approved → published → withdrawn/retired has named actors, version, date and reason. Rejection returns actionable findings. Preview is authenticated and uncached publicly. A publisher records content, source/numerical, assessment and accessibility review evidence, including reviewer identity and any same-author review. Publication validates IDs/slugs/references, cycles, metadata, rights, required teaching and assessment readiness. **Accept:** J14 rejects an incomplete lesson or cycle, approves a corrected version and publishes related records atomically; role changes are separately audited.

### REQ-28 — Concurrent editing, import and rollback

Every content edit/import names its base version. A stale update shows a diff/conflict and requires explicit resolution; no last-writer overwrite. P03 must choose one editorial authority connecting files, imports and editor changes. Repeat import leaves effective content and learner data unchanged; missing input records do not mean delete. Publication or withdrawal updates page, navigation, resource relationships, search and sitemap coherently within 60 seconds. Security/factual emergency withdrawal invalidates public delivery within that same bound, or the affected route is disabled until it can. Roll back content without rolling back learner transactions. **Accept:** J15 demonstrates editor-versus-import and editor-versus-editor conflicts, atomic rejection, stable links, preserved notes/attempts and search/cache invalidation.

### REQ-29 — Freshness, reports and correction

Each resource/rule has an owner, last substantive verification, scope, next review date and supersession/conflict status; checking HTTP reachability never refreshes substantive review. Before R1, all required reading sections and links are reviewed; mandatory material has an accessible original alternative. Thereafter check required links every 30 days, substantive stable readings every 180 days, and any suspected source change immediately upon editorial review. Market rules inherit the tighter P01 interval (India seven days, other jurisdictions 30) if ever published operationally; none is eligible now. An overdue operational record is excluded from current-use claims and queued, not silently left “current”.

R1 supplies a Report content issue form for verified users (2,000 characters, page/version attached, no public posting); visitors get a published support route after U05 is resolved. Reports acknowledge receipt, never promise an unstaffed response. The operational target is triage within two business days; confirmed critical misinformation is withdrawn within one staffed hour, with the coverage assumption disclosed in the runbook. Corrections link old/new version, evidence, impact and reviewer. An affected learner sees an in-app notice and remediation on next visit. No automatic mass email is authorized by P02. **Accept:** J15 simulates link loss, a conflicting rule, overdue review and a critical answer correction.

### REQ-30 — Privacy, retention and analytics limits

Collect only email/credential verifier, optional name/preferences, account/verification/security metadata and the learning records required above. Do not collect DOB, income, holdings, broker credentials, private trading history or advertising identifiers. Age eligibility is a binary attestation under U02, not a birth date. No public learner profile, ads, tracking pixels, session replay or cross-site profiling. Search text, note bodies, answers, credentials and recovery tokens must not enter ordinary logs or telemetry. Necessary auth/theme storage is described accurately; do not invent a cookie-consent banner that conceals third-party tracking.

| Record | R1 retention rule and purpose |
|---|---|
| Account and saved learning records | While account is active, until user deletion; after 24 months without login send one authorized lifecycle notice, then delete after 30 days without return. Explain this at signup. |
| Unverified registrations | Delete after seven days; do not keep abandoned email lists. |
| Notes/project writing deleted individually | Remove from live application immediately; encrypted rolling backups expire within 35 days. |
| Auth/reset tokens | Usable only for their configured lifetime; expired/revoked secret material purged within 24 hours, event metadata retained below. |
| Security/audit events | Security metadata 90 days; content publication/version audit retained for provenance, stripped of unnecessary learner data. |
| Application/error logs and content-issue reports | Sanitized logs 30 days; resolved private issue reports 90 days after closure. |
| Backups and deletion ledger | Backups at most 35 days; restricted minimal deletion identifiers retained 90 days to reapply erasure after restore, then purged. |
| Performance counters | Route templates, status/latency and aggregate error counts 90 days; no user/account identifiers or query text. |

These are product retention choices, subject to the operator/territory review in U02, not a claim of legal compliance. P19 must reconcile actual providers/processors and any legal retention exceptions before publication. A tested restore reapplies deletions before serving users.

### REQ-31 — Export, deletion and suspension

Account settings offers recent-authenticated export of owned profile/preferences, notes, bookmarks, progress and assessment/project history, with content IDs/versions and submitted feedback; it excludes credentials, tokens, other users and unattempted protected answer banks. Export is available within 24 hours in a private authenticated download, expires after 24 hours and uses a documented portable format. Delete-account requires an explicit confirmation, immediately revokes sessions and hides private data; live erasure completes within seven days, backups within 35. Explain both and issue a receipt without retaining the deleted content. Suspension revokes sessions and blocks writes but offers an operator-reviewed export/deletion route; it does not silently erase history. **Accept:** J16 tests pending/export-expiry, ownership, revoked access, deletion completion and a restore that does not resurrect an erased account.

### REQ-32 — Measurement without learner surveillance

R1 includes only operational availability/errors/performance measurement and user-visible calculations needed for their own progress. No separate learning-analytics dashboard, behavioral experimentation, cohort ranking or personalization tracking. Editorial teams may review explicitly volunteered issue reports; pilot feedback is consented and outside automatic telemetry. Later learning analytics needs its own purpose, data minimization, retention and bias review. **Accept:** P19 inspects outgoing requests and logs for prohibited data; P20 can measure budgets with synthetic accounts and aggregate metrics.

### REQ-33 — Scale and measured performance budgets

Planning envelope, not a demand forecast: one program, five phases, 70 modules, 1,025 topics, 96 resource records, 152 assignments, twelve project specifications, seven capstones and eight path views including R1-FND. Load tests also include 5,000 accounts, 250,000 progress records, 200,000 attempts with one million answers, 50,000 notes and 100,000 bookmarks. Assume 500 daily active learners, 50 simultaneously active sessions and 20 requests/second sustained peak; test a 100 requests/second 30-second burst for bounded failure/recovery. Reassess if actual scale exceeds this envelope.

| Metric | R1 budget | Measurement contract |
|---|---|---|
| Public content, resource/detail API | p95 ≤300 ms, p99 ≤1 s | Application boundary, representative database, warm mixed workload, excluding client network; not a mocked repository |
| Search and dashboard | p95 ≤500 ms, p99 ≤1.5 s | Intersecting filters and realistic account history; no empty-table benchmark |
| Learner saves and scoring | p95 ≤700 ms, p99 ≤2 s | Includes committed persistence; auth hashing measured separately with p95 ≤1 s login |
| Web experience | LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at p75 | Mobile and desktop separately; initial lab gates below, post-launch field results when sample supports them |
| Public first-load transfer | ≤1 MiB compressed total; ≤200 KiB compressed JS; critical CSS/fonts ≤150 KiB | Home, map, resource, lesson; no autoplay video or all-catalog payload on initial navigation |
| Public page/API error rate | <1% unexpected 5xx/timeouts at sustained envelope | At least 30 minutes after ten-minute warmup; intentional validation/rate-limit responses reported separately |
| Publish/withdraw visibility | ≤60 s | Check direct page, search, navigation, sitemap and public cached response |

The Web Vitals thresholds follow [Google's Web Vitals definitions](https://web.dev/articles/vitals). Other budgets are engineering targets chosen here, not measurements. P20 records hardware, runtime, content version and network profile; use 150 ms RTT, 1.6 Mbps down/750 Kbps up and documented 4× CPU slowdown for mobile lab runs, plus unthrottled desktop. Run at least 20 cold navigations per representative route; also report warm results and interaction traces. Lab interaction timings are a proxy, not field INP certification. After authorized launch, use privacy-minimized aggregated field metrics if feasible; if sample is insufficient, report that and retain synthetic monitoring. The release may not claim measured production performance before deployment.

### REQ-34 — Availability and recovery

Target 99.5% monthly availability of public learning and authenticated save services, measured separately by one-minute synthetic checks; planned maintenance counts as downtime. This allows 216 minutes in a 30-day month. Third-party reading sites are outside the service SLI, but required learning must survive their failure. RPO ≤24 hours for learner data and content; disaster RTO ≤4 hours from declared recovery start, with detection/response delay reported separately. Test encrypted daily backups, 35-day retention and an isolated restore of representative content, private records and deletion ledger. A disaster can exhaust the availability budget; it is not excluded to improve the score. P03 must assess feasibility against U01 budget/staffing; changes require an explicit contract revision. No provider or paid plan is selected. **Accept:** P21 records an actual restore time/data cut, incident procedure and alert recipient; P22 tests deployed health and backups with authorization.

### REQ-35 — Security and operational boundaries

Least-privilege, server-side role/ownership checks, safe credential handling, CSRF/origin controls, input/length validation, query safety, output/content sanitization, safe redirects, public/private cache separation, secret management, headers and dependency review are release blockers. Drafts, quiz solutions and private data must be absent from public responses, rendered source, search and exports. No arbitrary uploaded-code execution or server fetch of user-supplied resource URLs. If a later link checker fetches URLs, it needs an SSRF review first. Protect import/preview/admin interfaces; bootstrap privileged identities without shared credentials. **Accept:** P19 tests actual trust boundaries and resolves all known critical/high findings; a scanner alone does not establish security.

### REQ-36 — SEO and public truthfulness

Substantive published lessons and useful public landing/module/path/resource pages render for crawlers with semantic stable slugs, titles/descriptions, canonical links, OpenGraph and breadcrumbs. Sitemap contains only approved indexable public pages. Individual planned topic stubs and filter/search variants are noindex and excluded from sitemap; the aggregate curriculum map remains indexable. Private/auth/admin/preview pages are noindex and access-controlled, not protected by robots alone. Use structured data only for actual visible educational content; never invent ratings or course completion claims. Redirect slug changes without confusing learner identity. **Accept:** P20 inspects rendered source, redirects, sitemap coverage and cache isolation; no crawler-only false content.

### REQ-37 — Engineering and validation delivery

P03–P06 establish architecture, relational lifecycle, API/authorization and UX before application coding. Honor Java/Spring Boot, evaluate supported frontend/data/auth tools, favor a modular monolith and PostgreSQL/Flyway, keep content outside hardcoded application classes and use bounded DTO/error/pagination contracts. P07–P16 implement with backend unit/integration/repository/API/auth tests using real PostgreSQL/Testcontainers where relevant, frontend component/integration checks and real-stack Playwright journeys. P18–P21 additionally verify migrations/import from empty state, idempotence/conflicts, build/container/CI, security, accessibility, performance, SEO, sanitized observability and restore. Six final review lenses cover architecture, database, security, UI, research integrity and deployment. P22 needs a separately authorized target and actual deployed smoke tests. **Accept:** no mandatory skipped check is reported as passed; evidence records versions, environment, commands and defects.

### REQ-38 — Content gate

The exact 36-topic list, six gate packs, original examples, manual exercise route and R1 dossier in the content plan are all release blockers. Every assigned topic must satisfy its declared scope or be transparently split with successor mapping and an explicit release-contract amendment; removing a hard lesson to ship faster is not permitted. The R1-FND sequence is completed only after all CR criteria pass. Broader canonical modules remain partially available. **Accept:** P18 reconciles published IDs/readiness, source/rule exclusions and assessment coverage against CR-01–CR-08; counts alone cannot pass.

### REQ-39 — Explicit future scope, including ratings

Resource ratings/reviews and their moderation are **LATER**, because no moderation staffing or reliable volume exists and popularity is not evidence quality. R1 has editorial rationale and private content-issue reports, no stars, aggregates, rating API or public comment form. A later contract must specify one rating per verified account/resource, editable history, no self-promotion, abuse/rate limits, minimum aggregate counts, moderation queue, appeals, removal, privacy and transparency. Moderator is not an unused R1 role.

Also LATER: flashcards/spaced repetition; a trading journal; payoff/Greeks/BSM/volatility calculators/visualizers; strategy builder; historical or live paper-trading workspace; learning/trading analytics; social login; formal project review/file upload; translations/native/offline apps; and monetization. R1's fixed synthetic worksheet is deliberately included educational practice, not a paper-trading product. Preserve these in TODO with prerequisites and reasons; do not expose working navigation or collect data for them in advance.

### REQ-40 — Open operator constraints and change control

Routine product choices above are recorded decisions, not claimed user preferences. These remaining constraints do not block P02 or local P03 analysis, but do block the named later actions:

| ID | Truly missing input | Safe planning position | Resolve before |
|---|---|---|---|
| U01 | Operating budget, support coverage and preferred deployment geography | Estimate alternatives later; no purchase/provider commitment; performance/recovery targets stay requirements until revised | P03 cost/topology finalization where material; P21 operations; P22 spend |
| U02 | Operator identity, intended territories, eligibility/age policy and required legal review | Adult self-directed English design assumption; no claim of territorial compliance or approved legal copy | P19 privacy/terms gate; public registration/deployment |
| U03 | Rights/license for supplied originals and eventual project distribution | Preserve archives privately; author original teaching; no automatic redistribution license | P17 source publication and P19 release review |
| U04 | Named author/reviewer/publisher and assessment-maintenance capacity | Recorded review and bounded-form maintenance are release obligations; one operator may hold multiple roles with honest attribution | P16 bootstrap and P17 publication |
| U05 | Public support identity, email delivery account/domain and authorized test recipients | Local mail adapter and draft support copy only; no outgoing messages sent by this assignment | P21 configuration and P22 delivery checks |
| U06 | Brand/domain, launch date and deployment target | Working descriptive product name; no invented deadline or domain purchase | P06 branding finalization where relevant; P22 target |

P03 records architectural decisions under this contract. Changes to scope, retention, assessment semantics or budgets require rationale, affected requirement IDs, traceability/TODO updates and rechecking dependent acceptance criteria. An unresolved U item must never silently become a user's preference.

## Observable journey suite

Each journey uses real imported reviewed content and the actual frontend/API/database once implemented. P02 defines the tests; none has run against an application yet. REQ-13/14/19 apply throughout.

| Journey | Observable acceptance scenario | Error/edge fixture and validation owner |
|---|---|---|
| J01 Discover and navigate | Visitor opens home → map → module → published topic; sees scope/readiness, objectives, time and breadcrumb; a planned topic gives a useful informational page | Unknown/retired slug, slow fetch, deep link, Back, 320 px; P11/P18 |
| J02 Learn and practice | Visitor reads an original example, calculates a fresh case, submits it and receives error-specific feedback and next step without a book purchase | External source unavailable, units error, solution viewed, offline submit; P15/P17/P18 |
| J03 Choose a path | Beginner starts R1; specialist examines a path, prerequisite reasons and planned work; diagnostic routes to a bridge; completion claims match actual scope | No prior evidence, shared topic, missing/unpublished prerequisite, completed R1; P12/P14/P18 |
| J04 Find a resource | User combines free + beginner + topic filters, sorts, opens detail and follows the exact reading assignment | Unknown cost, paywall, dead link, no results, filter Back/reload; P12/P18 |
| J05 Search | Query by ID/title/author/tag yields correctly typed stable results and shareable filters/page | Empty/punctuation/oversize query, invalid sort, tied rank, page beyond end, draft/answer exclusions; P10/P12/P18 |
| J06 Register/verify | Visitor registers, verifies once and can save owned work; reading works before verification | Duplicate email, bad input, expired/reused link, mail adapter outage, self-role escalation; P13/P19 |
| J07 Login/logout | Learner logs in through a protected deep link, uses two devices, logs out current/all, and cannot reload cached private content | Bad password, throttle, expiry mid-save, revoked session, privileged second factor; P13/P19 |
| J08 Recover/change account | Learner requests reset, uses valid link, logs in with new password; verified email change replaces login atomically | Unknown address, expired/reused token, reset race, unavailable mailbox, failed email; P13/P19/P22 |
| J09 Persist/resume | Learner completes topic, refreshes, logs out/in on another device, sees same progress and an explained next step | 18/36 version change, correction/retirement, concurrent update, empty dashboard; P14/P18 |
| J10 Save a bookmark | Learner bookmarks module/topic/resource, revisits list and removes it; duplicate add is one record | Retired target, repeat request, empty list, another user's ID; P14/P19 |
| J11 Keep a private note | Learner creates/edits/deletes note and confirms persistence; two tabs produce an explicit conflict | Offline unsaved text, session change, unsafe markup, maximum length, user B access; P14/P19 |
| J12 Demonstrate understanding | Learner submits failed gate, sees feedback, completes remediation and passes an unseen form; history stays versioned | Critical error despite high score, numerical boundary, changed version, tampered score, no fresh form; P15/P17/P18 |
| J13 Finish foundation dossier | Learner completes signed cash/assignment worksheet and structured self-review; course distinguishes gate evidence from self-assessment | Margin-as-loss mistake, zero allowable size, partial save, reused reference, no upload/code runtime; P15/P17/P18 |
| J14 Edit/review/publish | Editor fixes rejected draft, an authorized publisher records review and approves, public page/search update coherently | Unauthorized user, missing review evidence, missing citation, cycle, stale edit, inaccessible preview; P16/P18/P19 |
| J15 Maintain safely | Editor encounters import conflict, preserves both revisions, publishes correction/withdrawal and flags affected mastery | Stale rule, broken required link, conflicting evidence, rollback, learner data preservation; P09/P16/P18/P20 |
| J16 Own/export/delete data | User A exports owned records, confirms deletion, loses sessions; live/backups meet retention contract | User B access, expired export, suspended account request, restore with deletion ledger; P13/P19/P21 |
| J17 Accessible/resilient use | Keyboard/screen-reader user completes reading → auth → quiz → note; publisher completes review with zoom and reduced motion | Long math/table/title, invalid form, announcement/focus, dark theme, slow/offline connection; P06/P18 |

## Release gate and evidence

P02 passes when requirements, content selection, source dispositions, owners, budgets and exclusions are coherent and checked. It does **not** pass P18–P22. R1 can release only when all R1/MAP requirements, CR-01–CR-08, J01–J17, required tests and operational criteria have evidence; unresolved critical/high security defects, target accessibility failures, missing lessons, private/answer leakage, failed restore or necessary unresolved U constraints block release. Lower-severity residuals need an owner, rationale and review date, and cannot waive a required journey.

The next eligible assignment is P03. No application, production schema, paid service or public deployment is created by this contract.
