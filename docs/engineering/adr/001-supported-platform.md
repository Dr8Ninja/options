# ADR-001 — Supported platform and dependency policy

Accepted for design, 23 September 2026. Owner: P03; implementation proof: P07, then every release. [Architecture](../ARCHITECTURE.md).

## Decision

Use Eclipse Temurin Java 25 LTS, Spring Boot 4.1, Spring MVC with embedded Tomcat, and Maven Wrapper. Use the Boot dependency management BOM without independently upgrading Framework, Security, Hibernate or Jackson. Deploy ordinary JVM containers; neither native-image compilation nor reactive persistence is needed for the P02 scale.

The following is the **observed baseline**, not a promise that these patches will still be current when P07 runs. Exact artifact hashes, container digests and a resolved dependency tree belong to P07. No application dependency installation or compatibility test has been performed in P03.

| Component | Observed version / selection | Evidence and compatibility | Support horizon / required action |
|---|---|---|---|
| Temurin | 25.0.4.1+1; compile with release 25 | [Adoptium roadmap](https://adoptium.net/support/); Boot accepts Java 17–26 | Java 25 availability at least September 2031; community triage, not an SLA |
| Spring Boot | 4.1.1 | [Requirements](https://docs.spring.io/spring-boot/system-requirements.html): Framework 7.0.9+, Maven 3.6.3+, Tomcat 11 / Servlet 6.1 | Minor releases receive at least 12 months OSS support under [policy](https://github.com/spring-projects/spring-boot/wiki/Supported-Versions); 4.1 GA was [10 June 2026](https://spring.io/blog/2026/06/10/spring-boot-4/). Planning floor is June 2027, derived from policy, not an independently published exact EOL date. Recheck by March 2027 |
| Maven | 3.9.16 Wrapper, checksum verified | [Apache download](https://maven.apache.org/download.cgi); supported by Boot | Current stable; no fixed LTS promise found. Do not choose Maven 4 RC |
| Framework / Security / Session | 7.0.9 / 7.1.1 / 4.1.1 | [Boot managed coordinates](https://docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html) | Track Boot and each dependency's advisories; a supported Boot is not proof every optional dependency is supported |
| Persistence | Hibernate 7.4.5.Final; PostgreSQL JDBC 42.7.13; Flyway core and PostgreSQL module 12.4.0 | Same Boot coordinates; [Flyway PostgreSQL support](https://documentation.red-gate.com/flyway/reference/database-driver-reference/postgresql-database) verifies PostgreSQL 18 | Use managed versions; SQL migrations use free core features only |
| PostgreSQL | 18.6, major 18 everywhere | [Version policy](https://www.postgresql.org/support/versioning/); [Render availability](https://render.com/changelog/postgresql-18-is-now-available-for-render-postgres-databases) | Supported through 14 November 2030. Apply current minor fixes; 17 remains supported but offers no requirement advantage for this new build |
| Next / React / React DOM | 16.3.6 / 19.3.0 / matching 19.3.0 | Official package publisher metadata at [Next](https://registry.npmjs.org/next/latest), [React](https://registry.npmjs.org/react/latest); Next accepts React 19 and Node ≥20.9 | [Next 16 Active LTS](https://nextjs.org/support-policy); policy implies maintenance through October 2027, two years from initial release, not two additional years after active support. React has no fixed support deadline established here |
| Node / npm | 24.21.0 / 11.19.0 | [Node release index](https://nodejs.org/dist/index.json); [release schedule](https://github.com/nodejs/Release#release-schedule) | Node 24 Active LTS, maintenance scheduled 20 October 2026, EOL 30 April 2028; do not use EOL Node 20 simply because Next permits it |
| TypeScript | 7.0.2, strict checking | [Publisher metadata](https://registry.npmjs.org/typescript/latest); [Next minimum 5.1](https://nextjs.org/docs/app/getting-started/installation) | No fixed LTS horizon established; validate Next's type plugin and generated client with this compiler in P07 |
| Reverse proxy | Caddy 2.11.4 | [Official release metadata](https://api.github.com/repos/caddyserver/caddy/releases/latest) | Follow maintained 2.x and security fixes; no contractual support assumed |
| Tests | Boot-managed JUnit Jupiter 6.0.3, Testcontainers 2.0.5 | Boot coordinates | Match test modules and JDK; no stale JUnit 5 override |

Package metadata establishes published versions and declared ranges, **not** an executed integration. Dated retrieval notes and limitations are in [the source record](../evidence/official-sources.md).

## Tooling decisions

Use Spring Data JPA for aggregate persistence, Bean Validation and explicit request/response DTOs. Keep transactions in services, disable Open Session in View and avoid exposing entities. Use parameterized Spring JDBC queries for ranked PostgreSQL search and exceptional bulk/report projections. No generic repository facade, mapping framework, GraphQL, Spring Data REST, Spring Cloud, Kafka or Redis initially. Boot's Jackson 3 default must be respected; an optional Jackson 2 artifact in its BOM is not a reason to build a second JSON stack.

Use **springdoc-openapi 3.1.1**, the API-only MVC starter, with OpenAPI 3.1. Its [maintainer documentation](https://springdoc.org/#what-is-the-compatibility-matrix-of-springdoc-openapi-with-spring-boot) states 3.x supports Boot 4, but its exhaustive matrix still names 4.0.x/3.0.x. Therefore Boot 4.1.1 plus springdoc 3.1.1 is a declared-family compatibility decision with a mandatory P07 startup/spec-generation test, not a tested-pair claim. Do not install its MCP, OAuth server or alternate UI modules. Swagger UI, if used for development, is nonproduction only. P05 writes the reviewed API contract; CI compares generated OpenAPI against it.

Generate frontend types with openapi-typescript 7.13.0 and call through openapi-fetch 0.17.0, observed [publisher versions](https://registry.npmjs.org/openapi-typescript/latest) / [fetch version](https://registry.npmjs.org/openapi-fetch/latest), using their [OpenAPI 3.1 support](https://openapi-ts.dev/introduction). Commit generated output with its source checksum; regeneration must be clean. Types are compile-time assistance; Spring still validates every request and browser errors remain defensive.

Frontend uses npm with a committed package-lock and `npm ci`; a single frontend package does not justify a workspace orchestrator. Use CSS Modules and shared design tokens for themes, not an additional runtime styling system. ESLint, TypeScript, Vitest/Testing Library, axe and Playwright are the selected testing categories; pin supported concrete versions at P07 against the resolved Next/React versions rather than inventing a lockfile now. ArchUnit checks Java package boundaries. PostgreSQL behavior uses Testcontainers, never H2 substitution.

## Rejected alternatives and maintenance

Java 21 and Boot 4.0 are viable but shorten the maintenance runway without solving a compatibility problem shown here. Boot 3.x tutorial examples are not a reason to start on an older generation. Gradle is supported but its extra DSL and plugin choices add little for one Java executable. Native images and WebFlux would increase debugging and library constraints without evidence of startup/concurrency pressure.

At P07: re-fetch official stable metadata and advisories, select newest safe patch in the accepted lines, record SBOM/licenses/digests, compile, start, migrate PostgreSQL 18, generate OpenAPI/types, build the production Next container, and test a real session/CSRF/passkey flow. An actual incompatibility must produce an ADR amendment and a supported alternative; it must not trigger a silent downgrade. Before each release repeat dependency/advisory review; review support horizons monthly and begin upgrades at least 90 days before EOL. Critical/high applicable security findings block release under REQ-35. Routine patch updates are reviewed and tested, not automatically deployed.

The P02/P03 offline auditors include stage-specific assertions that no application directories exist. P07 must separate those historical scope assertions from the reusable content/reference checks before adding them to ongoing application CI, preserving the original gate evidence. Do not interpret a later authorized application directory as corrupted curriculum data.
