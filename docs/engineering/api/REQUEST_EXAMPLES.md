# API request examples

The P05 examples below are **contract fixtures, not captured server responses**. Canonical IDs/titles/scopes come from data/v1 `1.0.0-design`. The `pub-example` / `rev-example` values and UUIDs are illustrative, not an actual publication. No existing exercise or lesson is asserted eligible. Machine-validated cases are in [examples.json](../openapi/examples/examples.json); private assessment examples are synthetic shapes with no real keys or solutions.

## P10 actual responses

[P10 captured HTTP responses](../evidence/p10/api-examples.json) contain actual request paths, statuses, headers and bodies from Spring HTTP endpoints backed by PostgreSQL 18.6. The test database imports all 2,851 canonical identities through the P09 importer, then activates explicitly synthetic test approvals. Captures include all 23 public operations, intersecting filters, pagination, validation errors, unknown/retired/withdrawn content and protected-request denials. These are separate from the illustrative P05 fixtures below.

Reproduce with the backend verification command in [TESTING](../TESTING.md), then run `python scripts/check-public-api.py`. The response validator checks every captured body against OpenAPI, including error shapes and no-store/no-cookie headers. Current persistent local content remains draft-only; `GET https://localhost:8443/api/v1/topics` therefore returns `503 TEMPORARILY_UNAVAILABLE` with `Cache-Control: no-store` and `Retry-After: 30`. A successful test capture does not imply a public course is available locally.

## Public discovery

```http
GET /api/v1/programs/OPT
GET /api/v1/phases/P0
GET /api/v1/modules/M01
GET /api/v1/topics/M01.01
GET /api/v1/subtopics/M01.01.S01
GET /api/v1/resources/R01
GET /api/v1/paths/PATH-BEGINNER
GET /api/v1/projects/PR01
GET /api/v1/exercises/EX-M01-C
GET /api/v1/routes?path=%2Fmodules%2Ffinancial-arithmetic-and-economic-purpose
GET /api/v1/search?q=M01.01&limit=20&page=0
GET /api/v1/resources?difficulty=Beginner%E2%80%93Advanced&cost=free&source=OCC&sort=title&limit=20
GET /api/v1/resources?topic=M01.01&cost=free&difficulty=Beginner&difficulty=Beginner%E2%80%93Advanced&limit=20
GET /api/v1/topics?path=PATH-BEGINNER&phase=P0&tag=foundations&sort=title&limit=20
```

R01's difficulty is literally `Beginner–Advanced`; its resource type is `Exchange/clearing documentation`, cost free, source OCC, priority Essential. An exact topic filter can legitimately return no R01 result: its competency association is not an exact reading assignment. `GET /search?q=%21%21%21` yields zero matches unless an approved exact title matches. A page 1 request must echo the page 0 generation: `GET /search?q=units&page=1&limit=20&generation=12`. On CONTENT_VERSION_CHANGED restart at page 0.

M01.01 is “Units and signs”, scope “currency, points, ticks, percentages, basis points, contracts, multipliers; dimensional checks”. Its fixture is MAP/scope_outline/lessonMarkdown=null. PATH-BEGINNER is “Absolute Beginner”; it is inspectable with enrollmentAvailable=false. PR01 is “Cash-flow and payoff engine”; broad deliverables are public, its canonical reference_behavior is not. A reviewed future R1 course uses the same wire shapes with real server-returned revisions; do not seed fixture tokens into production.

## Same-origin identity and private note

Browser fetches use `credentials: 'same-origin'`. Illustrative domain `https://learn.example.invalid` is not a deployed service.

```http
GET /api/v1/auth/csrf
```

Save the returned token in memory; the browser stores its HttpOnly pre-session cookie. Send token and Origin on every unsafe call:

```http
POST /api/v1/auth/register
Content-Type: application/json
Origin: https://learn.example.invalid
X-CSRF-TOKEN: <fresh-token>

{"email":"learner@example.invalid","password":"example only long passphrase","eligibilityAttested":true}
```

Generic 202: `{"message":"If eligible, check your email for the next step."}`. A verification-page GET only displays a form; POST `/auth/verification-confirmations` with `{"token":"<mail-token>"}` consumes it. Login body is email/password; use refreshed CSRF after successful login. A privileged login still requires the WebAuthn assertion before editorial access. Reauthentication posts password and, for privileged recent actions, a fresh assertion in the same account/session.

```http
PUT /api/v1/me/notes/M01.01
Content-Type: application/json
Origin: https://learn.example.invalid
X-CSRF-TOKEN: <fresh-token>
If-None-Match: *

{"text":"Check whether every amount is per unit or per contract."}
```

200 returns the saved note and `ETag: "note-example-1"`. A second tab replaces it using If-Match with that exact quoted tag. If another edit already succeeded, 412 returns:

```json
{
  "type": "urn:otr:problem:VERSION_MISMATCH",
  "title": "Version mismatch",
  "status": 412,
  "code": "VERSION_MISMATCH",
  "message": "This note changed. Refresh before saving your edits.",
  "fieldErrors": [],
  "timestamp": "2026-09-23T09:00:00Z",
  "requestId": "123e4567-e89b-42d3-a456-426614174000",
  "currentVersion": "\"note-example-2\""
}
```

Do not overwrite or include unsaved text in telemetry. GET `/me/notes/M01.01` retrieves only this principal's current note. PUT/DELETE `/me/bookmarks/M01.01` is natural set membership and needs CSRF but no ETag. A client-supplied owner or role property fails validation.

## Enrollment, progress and assessments

The following needs a future eligible R1-FND revision; today it must yield ENROLLMENT_UNAVAILABLE if no reviewed release exists.

```http
POST /api/v1/me/enrollments
Content-Type: application/json
Origin: https://learn.example.invalid
X-CSRF-TOKEN: <fresh-token>
Idempotency-Key: 123e4567-e89b-42d3-a456-426614174001

{"pathId":"R1-FND","pathRevision":"rev-example"}
```

Use the returned enrollment UUID/revisions. `GET /me/enrollments/{enrollmentId}/topics/M01.01` retrieves its safe pinned lesson. Topic completion:

```http
PUT /api/v1/me/progress/M01.01/revisions/rev-example
Content-Type: application/json
Origin: https://learn.example.invalid
X-CSRF-TOKEN: <fresh-token>
If-None-Match: *

{"state":"SELF_COMPLETED"}
```

Reopening uses If-Match and `{"state":"REOPENED"}`. Dashboard keeps the original 36-topic denominator. GET migration-preview with targetPathRevision shows differences; POST migrations with old enrollment ETag and idempotency key deliberately changes enrollment.

Start gate using a server-returned executable quiz ID (never QZ-M01 blueprint):

```http
POST /api/v1/me/attempts
Content-Type: application/json
Origin: https://learn.example.invalid
X-CSRF-TOKEN: <fresh-token>
Idempotency-Key: 123e4567-e89b-42d3-a456-426614174002

{"enrollmentId":"123e4567-e89b-42d3-a456-426614174003","quizId":"QUIZ-123e4567-e89b-42d3-a456-426614174004","quizRevision":"rev-example","mode":"FRESH"}
```

Server allocates the form, returns only its questions and records exposure. Save complete answer sets at `/me/attempts/{attemptId}/answers`; final submission is POST `/submission`, with If-Match and Idempotency-Key. Illustrative two-item subset of a **synthetic** form (a real gate sends all ten ordinals):

```json
{"answers":[{"ordinal":1,"type":"CHOICE","choiceKeys":["b"]},{"ordinal":2,"type":"NUMERIC","value":"12.5","unit":"currency"}],"confirmUnanswered":false}
```

Do not use this subset for a real gate: omitted ordinals fail validation. Explicit `{"ordinal":3,"type":"SKIPPED"}` requires confirmUnanswered=true. A lost successful submission can be replayed with the same key/body/old If-Match; it returns the original result after owner authorization. Changing answers on a used key is 409. Feedback is read only from the submitted owner's result. After failure, complete mapped remediation and transfer practice before the other fresh form; exhausted banks permit a request or labeled PRACTICE.

Anonymous practice: POST `/exercises/EX-M01-C/evaluate` with `{"revision":"rev-example","responseText":"My own reasoning about obligations and cash."}` and pre-session CSRF. The existing design is not yet runnable; expect 409 FEEDBACK_NOT_AVAILABLE until reviewed, or CONTENT_WITHDRAWN if a previously public exercise was withdrawn. Solution POST body is revision only. Authenticated saves use `/me/practice/{id}/revisions/{revision}`, with condition header. No path turns a practice solution into mastery evidence.

## Review, publication and importer

An editor GETs `/admin/drafts/M01.01` and its ETag, replaces the typed body plus baseRevision/reason, then requests review with the new ETag. Publisher records hash-bound review decisions; actor identity is never supplied. GET `/admin/preview/M01.01/revisions/{revision}` is private, even if a guessed URL is known.

POST `/admin/publications` includes the **complete** approved manifest and expectedPublicationId/expectedGeneration, not just the edited lesson. Review and public/private visibility must already be coherent. POST `/admin/publications/{publicationId}/activation` supplies candidate ETag, fresh factors, CSRF and an idempotency key. If another publication won, 409 PUBLICATION_CONFLICT requires a newly reviewed candidate. DELETE is not a shortcut for content retirement. Emergency withdrawal is an audited publisher operation; rollback cannot undo it.

```http
POST /api/v1/admin/imports
Content-Type: application/zip
Origin: https://learn.example.invalid
X-CSRF-TOKEN: <fresh-token>
Idempotency-Key: 123e4567-e89b-42d3-a456-426614174005

<bounded reviewed interchange ZIP bytes>
```

202 returns a run and Location. GET run/report until validation completes; only STAGED can POST application using current ETag/key. CONFLICTED cannot apply; resolve via base/current/proposed diff and submit a new package ID. No ZIP is supplied in this design stage and no upload has occurred.
