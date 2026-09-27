# P05 contract-test plan

This is a future runtime acceptance plan plus an executable **offline design** check. P05 does not install a database or substitute HTTP mocks for later real-stack tests. [Journey mapping](journey-contracts.json) allocates J01–J17 to actual OpenAPI operation IDs. [Examples](../openapi/examples/examples.json) distinguish schema-valid shapes from domain-eligible content.

## Offline gate, run now

Create an isolated utility environment, not an application scaffold:

```sh
python3 -m venv /tmp/p05-contract-venv
/tmp/p05-contract-venv/bin/pip install -r scripts/requirements-api-contract.txt
/tmp/p05-contract-venv/bin/python scripts/validate_api_contract.py
```

The validator runs the P04 gate, validates OpenAPI 3.1, all local references and DTO schemas, operation uniqueness/security/CSRF/preconditions, exact matrix coverage, all 17 journey mappings, example schemas and canonical field assertions. Negative mutations prove it rejects ownership overposting, role escalation, answer-key leakage, invalid numeric input, stale documentation inventory and removal of auth/CSRF. Output records original-source/data hashes and explicit runtime tests not run. Schema checks cannot prove service authorization, rank implementation, atomicity or sanitization.

## Runtime harness and release gates

P07 generates/checks TypeScript clients from the checked-in contract, wires Spring DTO validators/Problem writers and fails CI on an unreviewed breaking diff. No runtime schema inferred from JPA can supersede P05. Controller tests assert status/content type/headers/body against these schemas; integration tests run actual Spring Security filters, Spring Session JDBC and PostgreSQL 18 through Testcontainers, real Flyway migrations and P09 importer. Seed canonical design separately from reviewed synthetic test-only lesson/forms, marking fixtures clearly. P17 later replaces fixture eligibility with reviewed release artifacts. Use a fake/local mail transport for deterministic token delivery, an injectable clock, deterministic search corpus and browser WebAuthn virtual authenticators; these supplement real browser/device testing, not a claim of deployed mail or hardware proof.

For each operation, parameterize the exhaustive matrix over anonymous, unverified, owner A, learner B, editor, publisher, admin, combined roles, suspended/deleting, expired/revoked sessions, password-only, WebAuthn-only and stale-factor sessions. Account roles in tests must be real server state. Capture sanitized requestId, status, headers, contract hash, fixture manifest, assertion report and transaction outcome. Never persist actual secrets/private test bodies in broadly visible CI logs. Fail the gate on unexpected keys, wrong status or cache headers, not only on the happy-path response.

| Test | Required assertions / adversarial fixtures | Implementation gates |
|---|---|---|
| CT01 Public hierarchy | OPT→P0→M01→M01.01→subtopic; bounded ordinal links, exact canonical IDs, MAP null lesson; unknown/draft IDs indistinguishable; slug rename/retire/split safe | P10/P11/P18; J01 |
| CT02 Public projection | Sentinel secrets in draft/ARCHIVE/protected question/reference/rubric; assert absent from every public DTO/list/count/snippet/HTML/sitemap/bundle/source map/export | P10/P15/P16/P19; J01/J05/J12 |
| CT03 List bounds | limit 0/51, scalar duplicates, unknown names, forged/expired/principal-swapped cursor, sort injection, ties, unknown duration last, last page/empty page; no duplicates within fixed generation | P10/P14; J04/J05 |
| CT04 Filter truth table | OR within and AND across, exact Beginner vs Beginner–Advanced, free excludes unknown/mixed, source OCC, geography/verification/readiness/module, Ready to learn, priority/date sort, exact topic assignments vs inherited competency, path optional branches, phase traversal; public facets use same set | P10/P12; J04 |
| CT05 Search relevance | Exact M01.01 beats title then weighted author/tag/summary; fixed tie ID; BSM/0DTE, punctuation, phrase/OR/exclusion, whitespace, oversize; no protected tokens; page generation changes 409 | P10/P12/P20; J05 |
| CT06 Origin/session | Cookie attributes, fixation/rotation, 24h/7d and 15min/8h expiry, absolute cap despite reauth, no session on public reads; unsafe missing/incorrect CSRF or foreign Origin/Referer rejected | P07/P13/P19; J06/J07 |
| CT07 Register/token | Owner/role injection; duplicate/known/unknown generic responses and comparable timing; email key casefold; password Unicode/space/boundary/blocklist; GET scanners never consume token; POST one-use/race | P13/P19; J06 |
| CT08 Recovery | Old/replaced/expired reset token, race consumes once, reset revokes all sessions/no autologin; pending email preserves old until verified, uniqueness race safe; generic mail outage responses | P13/P19; J08 |
| CT09 MFA/roles | Password-only/passkey-only/cross-principal denied; exact RP/origin, challenge purpose/replay, pending first-key enrollment, two-key activation, role revoke in-flight, admin cannot edit/publish alone; no first-admin route | P13/P16/P19; J07/J14 |
| CT10 Ownership | A/B list/detail/nested answer/count/cursor/export/mutation; owner SQL predicate + composite FK; 404 equivalence for unknown/foreign; admin cannot read learner text; no client-supplied owner | P08/P13–P16/P19; J09–J16 |
| CT11 Concurrent notes/progress | Two tabs same ETag: exactly one commit, other 412 with own version; missing condition 428; create race; stale delete; progress reopen cannot be overwritten by old completion | P14/P19; J09/J11 |
| CT12 Natural membership | Two simultaneous bookmark PUTs create one, preserve savedAt; repeat DELETE 204; retired saved target remains listed as tombstone; import does not erase notes/bookmarks | P09/P14; J10 |
| CT13 Frozen course | R1 exactly 36+6+1; 18/36 unchanged by new publication; explicit migration preserves old enrollment/scores and only reviewed equivalence; retired requirement blocked, whole-module completion unavailable | P08/P14/P18; J03/J09 |
| CT14 Recommendations | No enrollment, remediation, missing hard vs recommended preparation, next released topic, eligible gate/project, finished course, no eligible item; no unpublished Start learning | P14/P18; J09 |
| CT15 Transient practice | Anonymous evaluate persists nothing; CSRF required; inactive design unavailable; solution viewed label; persistent owner exercise cannot reset solution flag; no practice awards gate evidence | P15/P17; J02 |
| CT16 Start/exposure races | Two concurrent starts and same-key replay yield same active attempt/form; exposure recorded before delivery, abandon still exposed, cosmetic revision/migration cannot reset; unknown/foreign enrollment rejected | P08/P15/P19; J12 |
| CT17 Save/finalize | Owner answers mutable only STARTED; submission locks/seals once; old If-Match same-key lost-response replay returns original; changed reused key 409, changed terminal answers 409; different principal cannot replay | P15/P19; J12 |
| CT18 Scoring | 8/10 fails, 9/10 with all critical passes, high score + critical error fails; multi-select exact set, skipped confirmation; malformed/overflow number 422; tolerance exactly at/just outside boundary, unit mismatch, score injection | P15/P17; J12 |
| CT19 Feedback isolation | No key before submit; only submitted assigned form after submit; other form/other learner inaccessible including export; abandoned no solutions; result immutability; no answer text in errors/logs | P15/P19; J12 |
| CT20 Remediation/exhaustion | Failed attempt requires mapped topic + completed transfer; unrelated/replayed practice cannot qualify; two forms exhausted 409; one maintenance request; repeated practice no mastery; genuinely reviewed replacement | P15/P16/P17; J12 |
| CT21 Assessment withdrawal | Freeze STARTED with own answers intact/empty prompts; save/submit blocked; old result scores preserved, unsafe feedback removed and needsRecheck=true; rollback/replay cannot leak withdrawn feedback | P15/P16/P19; J12/J15 |
| CT22 Dossier | R1-only work; PR01–PR12 cannot submit; total 20k text, known typed fields, sum rubric bounds, numerical/critical gates, ≥85 self-review label, no files/code; duplicate self-review, sealed history, writing erasure | P15/P17/P19; J13 |
| CT23 Editorial conflict | Editor/publisher separation; typed base/ETag mismatch, both versions recoverable by authorized diff only; reorder full set atomic, DAG cycles rejected; edit invalidates exact-hash reviews; same-person attribution honest | P09/P16; J14 |
| CT24 Publication race | Two candidates same active generation: one activates; review/rights/closure failure leaves old search/catalog; single snapshot never mixes generations; transactional rollback on fault after index write | P08/P16/P20; J14/J15 |
| CT25 Import | Same hash repeat/concurrency no duplicate; reused package ID changed bytes rejection; no-base legacy compare only; missing IDs not deletion; schema/graph failure atomic; editor-vs-import conflict; no protected/public merge loss | P09/P16; J15 |
| CT26 Malicious package | ZIP traversal/symlink/bomb/expanded bound/unknown file, source hashes, raw HTML/MDX, external fetch instruction, report size; no importer network fetch or logging confidential payloads | P09/P19; J15 |
| CT27 Rule/resource due | Injectable clock just before/at due; India 7d/other 30d, stable 180d/link 30d; stopped worker cannot keep current-use eligibility; link success not substantive review; no current P01 rule after import | P09/P16/P20; J04/J15 |
| CT28 Cache/SSR | Public independent of identity/no session cookie; every dynamic status no-store; private Vary Cookie/noindex; SSR fixed origin/named cookie only; poisoned user headers ignored; account switch/back/bfcache refetch | P11/P13/P19/P20; J07/J17 |
| CT29 Freshness/containment | Direct, search, nav, sitemap, visible page update ≤60s after publish/withdraw; focus rechecks; double generation race safe 503; failed outbox doesn't delay safety; rollback doesn't resurrect | P16/P20; J15 |
| CT30 Rate/oversize/errors | Every error status shape incl ingress; request ID server-generated; no exception/private echo; real distributed quota boundaries, Retry-After, unknown/known equivalent; parse depth and media/type limits | P10/P13/P19/P20; J05–J08 |
| CT31 Export/delete | Authenticated owner-only ZIP, ≤24h job target/24h expiry, no presigned public route; deletion disables immediately, ≤7d live/≤35d backups; note/project erasure includes historical copies; suspended operator route | P13/P19/P21; J16 |
| CT32 Restore/revocation | Restore quarantine reapplies erasures/suspensions/roles/withdrawals; all session/token state invalidated; no note resurrected; backup and outbox failure states explicit | P19/P21; J15/J16 |
| CT33 Preview | Exact draft revision only with editorial role+MFA; guessed URL/learner/admin-alone denied, no share token, noindex/no-store SSR, no public revision query; nested referenced draft checks | P16/P19; J14 |
| CT34 Client compatibility | Generate client/typecheck; golden response/schema tests, optional response addition tolerated, request extras rejected; breaking enum/unit/status diff fails CI; framework CSRF/WebAuthn encoding matches contract | P07/P13/P18; all journeys |
| CT35 Accessibility/resilience | Real frontend/server flows: keyboard/screen reader, announced field errors and 409/412/429, no save-success before commit, preserved unsaved in-memory text, expiry/refetch, reduced motion/mobile/long math | P06/P18; J17 |

## Evidence and exit claims

P05 passes only the offline contract gate and documented semantic review. P08/P09/P10/P13/P14/P15/P16 each close their corresponding runtime rows with real PostgreSQL/authentication where applicable. P18 runs J01–J17 end-to-end against the actual stack and reviewed content; P19 tests adversarial privacy/security; P20 measures search/query/freshness budgets; P21 rehearses restore. Report unexecuted rows as pending, never passed by this document's existence. Test fixture IDs/versions, contract hash, commands, dates and failure/repair history accompany each stage's evidence.
