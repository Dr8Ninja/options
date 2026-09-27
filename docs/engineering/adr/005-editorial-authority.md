# ADR-005 — Database editorial revisions; canonical files as reviewed interchange

Accepted for design, 23 September 2026. This decides ownership before P04 designs tables. [Architecture](../ARCHITECTURE.md).

## One authority at each stage

**Before the first import**, reviewed canonical files are the authoritative curriculum design snapshot. Originals under `sources/` remain immutable evidence forever; archives are not web assets. P09 bootstraps an empty database from an explicitly approved import manifest, preserving canonical IDs, provenance and honest readiness. It cannot promote scope outlines to lessons.

**After bootstrap**, the database's immutable editorial revisions plus draft heads and publication manifest are the authoritative operating content state. Admin edits and imports are two clients of the same Spring content service. A file edit is a proposed change until accepted there. Git tracks reviewed interchange snapshots and application code; pushing Git does not auto-publish lessons or overwrite database changes. JSON is transport, not a storage-model decision.

Database-to-file export is deterministic, versioned and manifest-checksummed. Separate distributable public catalog/lesson snapshots from restricted editorial evidence and protected assessment solutions. The latter never goes into the public frontend image, public Git repository, API docs examples or static asset directory. Existing P01 lesson-design metadata stays labeled as such. P04 defines every mapping, including all source mappings, resource associations, gaps, decision cards, branches and capstones needed for faithful archival/export preservation; not every archival item needs a public relational feature.

## Editing and imports

Each stable entity has immutable revisions; a mutable draft head points to a revision. An edit carries the expected base revision. A stale base returns a conflict with the base/current/proposed texts or fields the editor is authorized to see. Saving a resolved merge creates a new revision, invalidates affected review approvals and records provenance; no automatic last-writer-wins. Reviewers see both semantic diff and affected prerequisites/resources/assessments.

Import packages carry interchange schema version, source hashes, package ID, base export/release ID and per-entity base revision. A bootstrap exception allows no base only on an empty target. Dry-run validates IDs, schema, dependencies, rights/readiness and reports additions/changes/conflicts/explicit retirements. An unchanged package hash is an idempotent no-op. Missing entities are **not deletions**. A legacy file without base revisions can create a staged comparison but cannot overwrite existing records. Reject a materially invalid package atomically. Apply approved nonconflicting proposals as drafts only; conflicts remain visible until resolved and resubmitted. Imported publication labels are observations, not permission to publish.

Do not dual-write database and Git in one fragile operation. An accepted database transaction is durable even if its later export fails; the durable outbox records an export-needed job, retry status and alert. The resulting snapshot can be reviewed/committed later by an authorized operator. File checksums/revisions identify drift without claiming a failed Git push reverted publication.

## Review and publication

Follow draft → review → approved → published → withdrawn/retired with history. Editors prepare; reviewer/publisher role publishes; administrators assign roles and operate recovery, but an admin role alone does not bypass editorial approval. One person may hold all roles, with explicit same-person attribution. Technical, pedagogy, assessment/solution, accessibility and rights/source review records must refer to the exact revisions. A meaningful edit clears affected approvals. P17's CR-01–CR-08 and REQ-38 remain hard release gates; no existing topic qualifies merely by having a teaching brief.

Publish a **release manifest** selecting an internally consistent set of revisions and exact R1 course/gate membership. In one PostgreSQL transaction, validate approvals and references, materialize public search rows, advance the active publication pointer, and add an audit/outbox record. Use an expected current release ID to serialize concurrent publication. Any failure leaves the previous complete release visible. Public endpoints project only approved fields; answer keys and reviewer notes never join their DTOs.

R1 HTML/API has no shared cache. Pages, search, navigation, prerequisite displays and sitemap read the same release and withdrawal policy. Browser navigation/focus/30-second status checks implement the ≤60-second freshness requirement for visible sessions; server calls see publication immediately after commit. Outbox work is for secondary artifacts and audit/export, not a prerequisite for hiding dangerous content. If a safety withdrawal cannot be enforced, ingress serves maintenance for affected routes (or the whole catalog when scope is uncertain) until containment is verified.

Rollback creates a new audited publication event pointing to a previously reviewed coherent manifest. It never restores revoked roles, deleted accounts, old sessions, private notes or learner attempts. **Safety withdrawal and superseded-rule exclusions survive rollback**; an old manifest cannot resurrect forbidden content. Restoring excluded material requires a fresh correction review and explicit reinstatement. Retired IDs remain resolvable to honest tombstones/redirects; archival records are not erased.

## Stable teaching, market rules and learner evidence

Separate stable teaching revisions, dated external rule observations and learner records. Rule records preserve jurisdiction/instrument/source/circular, effective intervals, verification/due dates, supersession and uncertainty. “Current” eligibility is computed from evidence status, time and scope at read/publish time. Operational India reviews are due in seven days, other operational rules in 30; required links monthly, stable resource substantive review in 180 days, as P02 specifies. Failed link checks do not prove factual obsolescence; successful HTTP responses do not prove substantive review. A scheduled job creates the editorial queue, while read-time checks prevent overdue facts appearing current even if that job fails.

All current operational rules in P01 are ineligible. R1 uses explicit synthetic/historical assumptions, not an automatically refreshed exchange constant. A rule correction identifies dependent lessons and assessments for review. Critical corrections mark affected mastery evidence “needs recheck” while preserving the originally earned score and version. They create private notices and deterministic remediation, never silently rescore old attempts. Accounts retain course enrollment/version and may explicitly migrate; a partial 36-topic course cannot mark an entire canonical module/path mastered.

## Authored format and safe rendering

Choose **restricted Markdown**, with GFM tables, fenced inert code, math, local approved images and stable-ID links. No MDX, JSX, raw HTML, iframe, embedded script, executable notebook or arbitrary plugin. Named teaching blocks are a small allowlisted convention rendered by trusted components, not author-supplied React. Store exact source, format version, revision hash and renderer version. Rendering is a derived view; a renderer security fix triggers validation without mutating historical authorship.

Next uses [react-markdown](https://github.com/remarkjs/react-markdown) with a fixed plugin set and a reviewed rehype-sanitize policy; retain only safe elements/attributes/URL protocols. Links allow HTTPS (and explicitly approved internal routes), reject javascript/data/file schemes, and external links receive safe relation attributes. Disable remote-image fetching; owned licensed images have manifest entries, alt text and dimensions. Notes/project free text is escaped plain text, not Markdown.

Use [KaTeX](https://katex.org/docs/options.html) with `trust: false`, HTML+MathML output, finite size/macro/input-length limits and original prose explaining the formula. Sanitize Markdown before the trusted math transformation, and allow only the tested KaTeX output, not arbitrary raw MathML or author styles. No page can be approved with a renderer error or inaccessible essential math. Its required layout uses KaTeX-generated inline styles: script CSP remains nonce-only; a narrow style policy allowing generated inline styles is an explicit residual tradeoff, tested with the sanitizer, not a claim of an entirely inline-free policy. P19 revisits this if a stricter tested renderer becomes available.

## Alternatives rejected

Git-only publishing with an admin UI that secretly commits files requires repository write credentials, merge orchestration and deploy latency for routine corrections. Two equal masters invite overwrite conflicts. An external headless CMS adds a third content model, cost and access boundary without a requirement. Arbitrary MDX grants authors code execution. Automatic live rule ingestion mistakes changed web text for verified regulation. All remain rejected for R1.
