# P05 design review — 23 September 2026

Review scope: the REST contract against P02 J01–J17, P03 session/editorial decisions and P04 identity/ownership/lifecycle. This is one agent's structured review, not a claim of independent reviewers or real API execution.

Entry: `python3 scripts/validate_database_design.py` passed, including upstream architecture/product/inventory. Read actual canonical IDs, labels, readiness, P04 schema/lifecycle/query plan, security/ADRs and shared execution instructions. No AGENTS.md was found in the workspace/parent project tree; no backend/frontend/runtime exists. No original or canonical records were edited.

## Findings and resolutions

- Preserve R1 boundaries: no chapter or resource-rating routes, coding-project submissions or table-driven CRUD. Public subtopic/exercise detail supports planned learning workflows. Executable quiz IDs are distinct from QZ blueprints.
- Public canonical exercise prompts sometimes contain answers. Public runnable exercise projection therefore requires reviewed authored prompt separation; existing designs return unavailable. Quiz descriptions have no questions; attempt questions have no correctness fields; owner result releases only submitted form feedback. Negative schema/reachability tests exercise these boundaries.
- P03's unversioned CSRF example would conflict with uniform v1 identity routes. P05 records `/api/v1/auth/csrf` as the implementation contract, before any endpoint exists; no backward-compatibility alias is invented.
- P04 stores exact canonical difficulty/type/priority strings. Avoid invented taxonomy buckets: repeated exact values and discovery facets make ranges such as Beginner–Advanced explicit. Topic assignment filters cannot infer exact reading from competency-level resource associations.
- Pagination must not mix releases. Keyset cursors and bounded search pages bind generation; a publication change returns a restartable conflict. Deterministic sorting includes semantic-ID ties and unknown durations last.
- Idempotent replay must occur after fresh authorization but before stale version rejection; otherwise a lost successful POST cannot be recovered. Domain constraints outlive the bounded receipt cache. Withdrawal still overrides replayed feedback.
- P04's mutable STARTED answer save/finalization boundary is made explicit. Historical pinned lesson access needs an owned enrollment route; current public routes alone cannot deliver a previously enrolled safe revision.
- A generic public CatalogPage was unsuitable for admin draft lists. It was replaced with a typed DraftPage without public visibility/contentVersion assertions. Authored course/exercise/project detail types supplement archival canonical records for real authoring workflows.
- ADMIN does not inherit editorial powers; every operation has an explicit policy row. Preview/private SSR forward only a named cookie to the fixed internal API and remain no-store. Owned lists/counts/exports and nested references cannot bypass owner checks.
- Browser 204/HEAD, generic auth errors, conditional headers, unknown request fields, decimal arithmetic and publication-race handling are explicit. OpenAPI is structurally valid, but semantic transaction/factor/score rules require CT01–CT35 later.

## Validation and scope

Use `scripts/requirements-api-contract.txt` in an isolated venv, then `scripts/validate_api_contract.py`. The generated `docs/engineering/evidence/p05-validation.json` records actual counts/hash, schema examples, canonical assertions, five deliberate contract-corruption rejections and upstream gates. An initial authoring utility failed on a duplicated Python keyword while constructing a string schema; corrected before writing the contract. This was a utility failure, not a running API failure. The first combined gate then rejected a prospective link to the not-yet-created p05-validation.json; used its plain path until the actual report existed and reran. Subsequent checks passed without weakening assertions. Final review added exact remediation DTO references, explicit candidate selections, typed retirement review, no-session identity read semantics, and a status-only admin suspension/restoration command.

Official protocol inputs inspected: [OpenAPI 3.1.1](https://spec.openapis.org/oas/v3.1.1.html), [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html). The chosen contract version is not described as newest. No supported application dependency versions were changed or empirically verified here.

P05's exit gate is a coherent, testable **design contract** for every critical journey. Application tests, PostgreSQL transactions, WebAuthn device compatibility, actual generated client compilation, mail delivery, publication timing, scoring, data erasure and restore remain unexecuted. U01–U06 and zero reviewed lessons still block eventual launch. P06 is next only after the offline validator passes; P07–P21 own implementation evidence. No external messages, service purchases or deployment occurred.
