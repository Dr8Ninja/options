# Deployment and local runtime

P07 establishes a local development environment, not a production deployment. No hosted account, domain, email delivery or production secret is configured. P08 provides migration/runtime DB role separation; P21 owns production packaging, monitoring and recovery; P22 requires an explicit deployment target.

## Prerequisites

Use Temurin **25.0.4.1+1 on macOS** or **25.0.4+7 on Linux**, Node **24.21.0** (npm **11.19.0**), Python 3.12+ and an operational Docker Engine with Compose. `.nvmrc` selects Node. The checked-in Maven Wrapper downloads **3.9.16** and verifies SHA-256; no system Maven is required. Only macOS/Linux are covered by the local shell and browser-fixture runner. `mvnw.cmd` is provided for Maven on Windows, but a Windows full-stack setup is not verified.

Check `java -version`, `node --version`, `npm --version`, `docker version` and `docker compose version`. `docker version` must include a working **Server**; an installed CLI alone does not satisfy the gate. Testcontainers must be able to create and remove containers. Do not disable its tests or substitute H2. On this Mac Docker Desktop's CLI initially needed `/Applications/Docker.app/Contents/Resources/bin` on PATH, and its daemon required starting Docker Desktop. A transient Docker startup failure/timeout was observed before recovery. Do not stop another project's database to obtain a port: this project uses 55432.

The work session downloaded checksum-verified JDK/Node archives into ignored `.local/tools/`. That directory is not part of a fresh checkout. Install the exact official runtimes yourself, or use the download URLs/checksums in [tool evidence](../engineering/evidence/p07/tool-downloads.json). With the session's macOS ARM64 downloads, export:

```sh
export JAVA_HOME="$PWD/.local/tools/jdk-25.0.4.1+1/Contents/Home"
export PATH="$JAVA_HOME/bin:$PWD/.local/tools/node-v24.21.0-darwin-arm64/bin:/Applications/Docker.app/Contents/Resources/bin:$PATH"
```

## Fresh local container setup

Run from the repository root with the runtimes above:

```sh
python3 -m venv .venv
.venv/bin/pip install -r scripts/requirements-api-contract.txt
.venv/bin/pip install --require-hashes -r scripts/requirements-content-import.txt
.venv/bin/python scripts/validate_frontend_design.py
python3 scripts/verify-preservation.py
python3 scripts/dev-env.py
docker compose -f infrastructure/compose.yml up -d --wait postgres mailpit
python3 scripts/provision-local-db.py
cp frontend/.env.example frontend/.env.local
npm --prefix frontend ci
./backend/mvnw -f backend/pom.xml -B verify
npm --prefix frontend run check
npm --prefix frontend run build
docker compose -f infrastructure/compose.yml -f infrastructure/compose.full.yml up -d --build
```

`dev-env.py` writes distinct random local owner/runtime DB passwords to `infrastructure/.env` and `.local/backend.env`, with mode 0600. It refuses to overwrite either file. On repeat setup, keep the existing pair and omit that command; regenerating one password without changing the existing PostgreSQL volume will not change the DB role's password. Examples contain **no password** and cannot start the database unedited. These credentials are local only; do not reuse them elsewhere.

This is a **development** stack even though Next runs a production build: both applications explicitly select LOCAL, no account exists, and P09 domain tables are migrated without account/content seeds; canonical drafts are imported separately. The container images are digest-pinned; only Caddy's HTTPS port and the documented loopback operator/development ports are published. Application containers run as non-root. The reference startup builds Java on the host and copies the verified JAR; Next is independently built with `npm ci` inside its container.

Export the local Caddy CA and verify HTTPS without changing the OS trust store:

```sh
mkdir -p .local
python3 scripts/export-local-ca.py
python3 scripts/wait-ready.py
curl --cacert .local/caddy-root.crt https://localhost:8443/api/health
curl http://127.0.0.1:8081/actuator/health/readiness
```

Open `https://localhost:8443`. To use it in an ordinary browser without a certificate warning, deliberately trust **this local development CA** in your user trust store. On macOS, the user can run `security add-trusted-cert -r trustRoot -k ~/Library/Keychains/login.keychain-db .local/caddy-root.crt`; inspect the certificate and complete any OS prompt yourself. This work did not install system trust. Never deploy or share the Caddy CA private key. Playwright's explicitly local test contexts accept the ephemeral test certificate; the curl/readiness probe above verifies the exported CA.

| Local port | Purpose | Exposure |
|---|---|---|
| 8443 HTTPS | Browser shell, `/api/**` | Loopback only; Caddy ingress |
| 8081 HTTP | Operator health/readiness | Loopback only; blocked at Caddy |
| 55432 PostgreSQL | Host development DB | Loopback only |
| 1025 SMTP / 8025 HTTP | Local captured mail / Mailpit UI | Loopback only; no relay credentials |
| 8080 / 3000 | Spring / Next | Container network only in full profile |

Only `/api/health` and GET `/api/v1/auth/csrf` are public application endpoints. The latter returns a masked CSRF token and sets the Secure HttpOnly SameSite=Lax `__Host-OTRSESSION` cookie. All other API routes deny access. No default user, login, passkey registration, learner or editorial endpoint is enabled. Springdoc is available directly in LOCAL/TEST, disabled by default and always blocked at Caddy. No arbitrary credentialed CORS is configured. WebAuthn's test-only fixture has its own disposable PostgreSQL/HTTPS server and cannot be included in the application JAR.

## Development with host Java and Next

First stop the full stack so its management port is free. Start only its database/mail services:

```sh
docker compose -f infrastructure/compose.yml -f infrastructure/compose.full.yml down
docker compose -f infrastructure/compose.yml up -d postgres mailpit
set -a
. .local/backend.env
set +a
./backend/mvnw -f backend/pom.xml spring-boot:run
```

In separate terminals, use `npm --prefix frontend run dev`, then run Caddy **2.11.4 on the host** with `caddy run --config infrastructure/Caddyfile`. Host Caddy's default upstreams are loopback 8080/3000. Do not start the base Compose proxy alone and assume host-loopback forwarding works across Docker platforms. Caddy's host-local CA differs from the container CA; use `caddy trust` deliberately for that development CA. Dev HMR requires the development CSP exception for `unsafe-eval`; production builds omit it. Stop the foreground processes with Ctrl-C, then use Compose down for services.

## Health, shutdown and troubleshooting

Liveness answers whether the Spring process can serve; it does **not** query the database. Readiness includes database connectivity and application availability. Flyway validation/migration must finish before Spring is ready; a bad checksum or failed migration fails startup. PostgreSQL socket/connect/pool timeouts bound a lost-DB readiness response. Tests pause the actual PostgreSQL container and assert live=200, ready=503, then recover. Responses reveal only status, not component names, schema, environment or exception details. Actuator environment, heap dumps and metrics are not exposed.

```sh
docker compose -f infrastructure/compose.yml -f infrastructure/compose.full.yml ps
docker compose -f infrastructure/compose.yml -f infrastructure/compose.full.yml logs --tail 100 backend frontend proxy
docker compose -f infrastructure/compose.yml -f infrastructure/compose.full.yml down
```

`down` preserves named PostgreSQL and CA volumes. Do not use `down -v` as routine shutdown. No cleanup here deletes canonical files or any other project's data. Session rows expire after 15 idle minutes and framework cleanup removes them. Local Mailpit keeps at most 100 messages; no application sends mail in P07.

On a Docker startup timeout, retain the failed command and daemon evidence, check `docker version`/Desktop status and retry after recovery. The first session observed a transient daemon 500, then stalled container starts; a later start succeeded. The gate is the observed successful runtime check, not the retry alone. Missing Docker, unavailable packages or unavailable vulnerability feeds must fail their checks visibly.

Configuration has no default production credentials. Spring requires DB URL/user/password and a valid HTTPS origin/environment; PRODUCTION rejects local/test DB roles, a local profile and DB connections without `sslmode=verify-full`. Next validates its fixed internal API origin and public HTTPS origin during build and Node startup. Never put DB secrets in frontend variables, use `NEXT_PUBLIC_*` for secrets, enable actuator details publicly, or copy LOCAL Compose settings into production. P08 supplies and tests runtime/migration/import/privacy role separation. Production resource limits, backup/restore, processor review and deployment remain P21/P22 gates.


## P08 database upgrade and role separation

An existing P07 setup keeps its DB volume and environment files. Start PostgreSQL, then run `python3 scripts/provision-local-db.py` once before rebuilding the backend; the helper retains the owner password, adds the runtime credential if absent and updates only the ignored local environment. Repeated provisioning preserves the runtime credential. No existing tables, accounts or volumes are dropped. Rebuild with `mvnw verify`, then Compose `up -d --build backend` as in [DATABASE](../engineering/DATABASE.md#p08-migration-commands).

`options_local` is the **local migration owner**, not the runtime connection. `options_runtime` has only the `otr_runtime` group. Importer and erasure group roles are NOLOGIN; later workers need deliberately provisioned connections. No worker password is seeded. The web runtime cannot create/drop schema objects, disable triggers or delete accounts. The same separation is exercised through PostgreSQL role-switch tests.

Production requires a pre-migration job/command with its own schema owner, precreated extension/groups and a schema-compatible application artifact. Set `MIGRATIONS_ENABLED=false` in the runtime and omit migration credentials. Startup checks actual runtime privilege flags and rejects owner/superuser/erasure authority before readiness. Local Compose credentials/settings remain unsuitable as a production deployment template.


## P09 canonical drafts and operator credentials

Run the fresh setup above (or rebuild the verified backend against the existing volume) to apply V0016–V0020. Preserve existing migrations, volumes and credentials. The importer tests require the hash-locked Python dependencies before Maven verification. Follow [the operator workflow](../../data/README.md#p09-operator-import-workflow) to provision a separate random local `options_import` login, prepare the reviewed `data/v1` package, validate/dry-run, then apply. A plain application startup never imports or publishes content. Reuse `.local/import.env` on repeat runs; never inject it into the web containers.

The initial package creates 11,452 canonical records across 22 collections, represented by 2,851 catalog identities/revisions plus typed assignments, mappings, tasks and other relationships. Supplemental material and original mappings remain available in the database, with zero published lessons, active publications or seeded accounts. Export the current editorial state before proposing changes; use exact base versions and the documented preview/recovery commands. Recovery preserves learner transactions and is separate from production backup/restore.

Successful apply records an `IMPORT_EXPORT` job intent, but P09 has no automatic export worker. Run the explicit export command and retain its output privately; database drafts remain authoritative. An export failure does not reverse an already committed import. Retrying the same package returns the applied batch; retry an export to a new output directory. Statement/lock timeouts fail visibly (30 seconds/1 second); the CLI does not retry automatically or impose a whole-import deadline.
