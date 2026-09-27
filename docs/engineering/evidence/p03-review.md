# P03 design review and exit gate

23 September 2026. Performed as a single-agent documentary review; these are review lenses, not claims of independent human security, infrastructure or pedagogy experts. [Entry evidence](p02-entry-check.json), [source record](official-sources.md), [deterministic checks](p03-validation.json).

## Substantive findings and resolution

| Finding | Resolution / recheck |
|---|---|
| P02's 36-topic course could be mistaken for the seven complete paths | Architecture introduction and CAT/LRN ownership retain separate course versions and all publication exclusions; no readiness promotion |
| Documentation sidebar “stable” is not an OSS support commitment | ADR-001 uses policy, GA dates and explicit inference; Java/Node/PostgreSQL horizons recorded; P07 recheck required |
| A same-origin cookie design could leak a competing auth service into Next | ADR-002/004 forbid frontend identity/scoring/DB; browser mutations go through ingress to Spring; private SSR read forwarding narrowly defined |
| WebAuthn example only requires MFA for already-enrolled accounts | ADR-004 requires MFA by privileged role, denies role without factor, requires two recoverable authenticators and documents offline recovery |
| LRN recommendations reading scores and ASMT reading progress could create a service cycle | Root FLOW service supplies a server-created versioned prerequisite snapshot to ASMT; domain dependency directions are explicit and acyclic; P07 architecture check retained |
| Git and admin edits could silently become two content masters | ADR-005 sets database authority after bootstrap; file import is a conflict-checked proposal, missing data is not deletion, export failure is retried independently |
| Cached HTML or soft navigation could keep withdrawn content visible | Initial dynamic SSR/no-store, no prefetch, focus/navigation and 30-second status checks; synchronous withdrawal overrides old releases; P20 must measure ≤60 seconds |
| Rollback could resurrect a superseded rule or roll back learner records | Withdrawal deny rules survive manifest rollback; learner attempts remain pinned and immutable; correction uses needs-recheck rather than rewriting scores |
| A CSP nonce plus static generation is internally inconsistent | ADR-002 chooses dynamic SSR; no static hosting claim. KaTeX generated style policy tradeoff is explicit; adversarial rendering remains P19 |
| Provider PITR did not cover independent retained backups and deletion replay | ADR-006 adds daily encrypted off-service copy, independent deletion ledger, expiration of restored credentials and timed isolated recovery |
| Durable mail retries could require raw bearer tokens in jobs/backups | Mail jobs hold intent only; worker creates a digest-backed expiring token at send time, replaces on uncertain retry, no raw token persistence; ephemeral auth tables excluded from recovery export |
| A small cloud price could be confused with total ownership or demonstrated performance | Dated compute/storage/transfer/email/staging model, exclusions, alternative VM/DB estimate and unmeasured sizing are explicit. Single-instance failure and SLO/RTO tension acknowledged |
| Source-specific compatibility gaps could be papered over | springdoc's declared family support versus narrower tested matrix is stated; P07 must execute spec-generation/typed client/session tests. An incompatibility requires ADR amendment, not silent fallback |
| Security retention/logging defaults could leak data or fall short | Retention covers provider and object versions; console log retention requires private archive for 30-day target; no request bodies/query tokens/private analytics |
| First validation treated the regenerated P02 report as immutable input | It correctly failed when new project navigation increased its local-link count. Reconstructed the original 38-link report and verified its original SHA-256 exactly; saved that snapshot. Current P02 output must match every original semantic field except the expected link count, while all three product specifications and source manifest retain byte-hash checks. Rerun passes |

## Gate assessment

| P03 exit condition | Design evidence / result |
|---|---|
| P02 verified before architecture | Product contract validator passes; source/entry fingerprints preserved |
| Supported versions and compatibility coherent | ADR-001 and primary-source register; exact observed patches, BOM and declared limits, horizons, future runtime proof clearly distinguished |
| Frontend comparison ends in a decision | ADR-002 chooses Next dynamic SSR after five-option comparison |
| Java modular monolith and relational tooling | Six domain modules, bounded infrastructure/flow coordination, JPA/JDBC/Flyway, typed OpenAPI/test policy |
| Context/container/request flows and trust boundaries | Five Mermaid diagrams plus textual transport, authorization and transaction rules |
| Sessions/CSRF/CORS/logout/roles/storage concrete | ADR-004 plus T01–T05/T17 and explicit MFA/recovery |
| Editorial source of truth before schema work | ADR-005 resolves bootstrap, edits, imports, revisions, public/protected exports, review, publish, rules and rollback |
| Local/production runtime compatibility and cost | ADR-006 chooses one workable local/reference production topology, quotes dated assumptions and flags launch inputs |
| P02 requirements allocated | Forty unique requirement rows with components/mechanisms and validation owners |
| No accidental implementation defaults | Rendering/caches, auth, DB, source authority and hosting decided; unknown operator facts have explicit dependent gates |
| Scope respected | No application directories, feature implementation, schema migrations, paid services, messages or deployment |

**P03 design gate passes.** `python3 scripts/validate_architecture.py` passed, including the current P02 gate. This does not pass P07 runtime integration, P17 authoring, P18–P20 release QA or P21/P22 operations/deployment. Remaining U01–U06 are already-recorded user-dependent launch facts, not unresolved architectural defaults. P04 may begin when requested.

## Required later proofs, not skipped P03 deliverables

P07: freshly supported patch set, compiled Boot/Java/DB/migration/OpenAPI/TypeScript/Next integration, production-image startup and real session/CSRF/WebAuthn baseline. P13/P19: complete security, revocation and ownership negative tests. P16/P20: atomic publication and measured withdrawal under browser/cache/failure cases. P17/P18: authored content, original worked examples, accessible math and actual learner journey. P20/P21: measured capacity, trusted proxy IP chain, mail/provider policies, SLO probes and timed restore with recent deletion. P22: authorized target, budget, domain, processors, roles and actual delivery. No claim that any of these tests ran in P03.
