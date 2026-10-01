# Main consolidation and dependency review — 1 October 2026

Owner request: inspect every local/remote branch, commit and push outstanding work to main, and use main directly for future work. The owner separately authorized validation and merging of automated dependency proposals. This is repository maintenance, not P13 or a production release.

## Branch reconciliation

The working tree was clean on local main at 3791349. Fetch found GitHub main at 58c7234, already containing P11/P12 through 585cb43. Local main fast-forwarded without changing that work. Both local feature branches were already ancestors. All 14 Dependabot branch heads were merged into main with owner-authored merge/resolution commits and original bot authorship preserved. [Branch inventory](branches.json) records the inspected heads and ancestry. Existing branch references were retained; no new branch was created or pushed.

AGENTS.md records the main-only instruction. The local repository's default origin push refspec is main:main. Dependabot version-update PR limits are zero for every configured ecosystem so scheduled version proposals will not create new branches. Vulnerability alerts were not disabled. Branch protections, release gates and validation remain in force.

## Upgrade dispositions

Twelve proposals are active: Node 26.10.0; Node types 26.6.3; globals 17.12.0; Spotless 3.10.2; ArchUnit 1.5.0; Maven Enforcer 3.6.3; CycloneDX 2.9.3; and the five updated GitHub Actions. [Action pin evidence](action-pins.json) verifies each immutable SHA against its official release tag. Node 26 is a supported Current release, not yet LTS. `.nvmrc`, package engines, lockfile and Docker stages agree; npm is 11.19.1.

Two branch histories are reconciled without activating the proposed versions:

- Java 26.0.2: [Adoptium's support schedule](https://adoptium.net/support/) ends Java 26 availability in August 2026. Keep supported Java 25 LTS and the existing digest-pinned JRE.
- TypeScript 7.0.2: strict npm resolution fails because typescript-eslint 8.70.1 requires TypeScript <6.1.0. [Microsoft documents](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) the native compiler API transition. Keep 5.9.3; no forced or legacy-peer installation was used.

Spotless now enforces google-java-format >=1.30.0 on Java 25, so the formatter was upgraded to 1.30.0. No Java source reformat was necessary. Inspection of failed upstream CI exposed an incomplete exact Java build pin: setup-java compares the entire build suffix. CI now requests Adoptium's exact 25.0.4+101.0.LTS semver for JDK 25.0.4.1+1. Cleanup is guarded when setup fails before `.env` exists. Repeated screenshots go to ignored runtime paths and historical P11/P12 evidence remains unchanged.

## Validation and security boundaries

Local checks pass: 47 backend tests, 29 frontend tests, production frontend and container builds, 145 actual API response contracts, 24 implemented operations, six discovery journeys, five reading journeys, one real WebAuthn compatibility probe and four persistent-local smoke cases. Fresh npm audit has zero findings; the regenerated Java runtime SBOM has no HIGH/CRITICAL findings. Preserved inputs (85), migration checksums (21), dependency policy, recursive design contracts and secret scan pass. [Backend suites](backend-tests.json), [discovery](discovery-browser.json), [reading](reading-browser.json), [smoke](smoke-browser.json) and [local runtime](local-runtime.json) retain actual evidence. Persistent content remains 2,851 drafts and zero publications/accounts/reviews/certifications.

**The full image security/release gate remains blocked.** Fresh Trivy scanning found 56 HIGH/CRITICAL Debian package findings in both the old Node 24 base and the proposed Node 26 base, with zero new OS findings ([comparison](image-comparison.json)). The production stage now removes npm/yarn, which are unnecessary for the standalone server; this eliminated three vulnerable bundled package-manager findings. The [remaining image findings](frontend-image-final-audit.json) are recorded without suppression or a blanket waiver. This maintenance merge does not certify the image for production; P19/P22 remain closed until the base-image findings are remediated or individually assessed with evidence. The [fresh Java scan](java-audit-final.json) and [npm audit](npm-audit.json) do not cover those OS findings.

Hosted workflow results are separate from these local checks. The exact pushed revision and remote synchronization are verified after committing; no public content or production deployment is authorized here.
