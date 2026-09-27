# Local infrastructure

See [local deployment](../docs/operations/DEPLOYMENT.md) for the full startup/shutdown flow. These Compose files are explicitly local: generated credentials, localhost certificates, no external mail delivery, loopback published ports. They are not production manifests.

`compose.yml` provides PostgreSQL 18 (55432), Mailpit SMTP (1025)/UI (8025), and the proxy definition. `compose.full.yml` adds the application containers and routes the proxy to them. Use both for the reproducible HTTPS stack. Host development starts only `postgres mailpit` from the base file and runs Caddy on the host. Do not start the base proxy by itself while relying on host-loopback forwarding.

P07 adds only `V0001__spring_jdbc_sessions.sql`; P08 continues DB01 at V0002. The local database owner can run migrations for development only. Production needs a separate migration job/DDL role, runtime least privilege and verified database TLS at P21.
