# Production bootstrap and deployment

Application: Ubuntu VPS, `infraege.ru`, Nginx → web/API/PostgreSQL. The accepted access contract
remains public root/password SSH with pinned host key, UFW and fail2ban. Keep provider console
access during credential rotation. Store secrets outside Git, mode 600; never put them in logs.

## Bootstrap

1. Configure DNS for the intended VPS and verify its host key. Run `ops/bootstrap-vps.sh` from
   the reviewed release. Verify a second SSH session before closing the recovery console.
2. Create `/etc/infraege/production.env` from `infra/.env.example`, with distinct independent
   bootstrap/runtime/import/migration/backup passwords. Keep `TASK_FILES_DIR=/var/lib/infraege/task-files`.
   Create `/etc/infraege/restic-password` separately. Production must never reuse dev credentials.
3. Obtain initial TLS with `ops/obtain-initial-certificate.sh` and the required `PUBLIC_IPV4` and
   `TLS_EMAIL` environment; configure renewal with `ops/configure-certificate-renewal.sh`.
4. Prepare the application database/bank using [practice-transition](practice-transition.md),
   then perform the explicit release. Install application backup/restore timers only when
   `/opt/infraege/database-current` points to the matching reviewed release.

Existing SSH migration helpers remain in `ops/migrate-root-password-access.sh` and
`scripts/production-root-ssh.sh`. Verify changes from a second session before retiring identities.
No monitoring tunnels or journal HTTP gateways are required.

## Release contract

GitHub Environment `production` contains `PROD_HOST`, `PROD_ROOT_PASSWORD`, `PROD_SSH_HOST_KEY`.
The previously accepted no-required-reviewers policy is unchanged. CI publishes immutable full-SHA
GHCR images after static/security checks. Tests run locally, not in CI or application containers.
Deploy workflow_dispatch selects a full commit on remote main. `/ship --release` requires
risk-selected local coverage (Full for unknown/shared inputs), fresh security and all Release
Gate phases; ordinary `/work` and `/ship` do not deploy. Use the durable evidence and resume
procedure in [verification](verification.md); published-digest scans are checked after push
and before dispatch, and live SHA is checked independently after deploy.

The workflow uploads the checked-out deployment script to a SHA-specific root-owned path and
executes that file with closed stdin. Never stream its body into `bash -s`: a child command can
consume the remaining script and return false success. A separate runner step checks public
readiness against the requested full SHA and requests the homepage after remote completion.

The release is unpacked at `/opt/infraege/releases/<sha>` and deploy mutations use a host lock.
Preflight checks environment, schema-transition attestation, images and TLS readability. It backs
up the prepared DB, runs migration, activates Compose, verifies health version and public HTTP,
then updates `current`, `database-current`, deployment status and environment SHA. It never
imports content automatically. Preserve candidate and previous images for recovery.

A failure invokes one verified rollback and retains its original error status. Both data volumes
remain; after new writes the old volume is stale. Missing previous release or failed rollback
requires manual recovery, not a destructive schema downgrade. Consult [backup](backup-restore.md).

## Routine operation

Use `docker compose` with the explicit production environment/project and installed release files,
`systemctl` and `journalctl` for application/TLS/backup/security status. `/health/live` is process
liveness; `/health/ready` checks database/schema readiness. A scheduled GitHub probe checks public
availability and TLS. Preserve bounded logs and rate limits. No browser analytics, consent UI or
client-error ingestion remains in the candidate.

The Change 122 local implementation has not stopped installed Umami/Beszel/sre-kit services.
During an authorized release inventory and retire their specific jobs and projects separately,
keeping data/configuration and shared host security/application backup intact. Sibling repositories
and remote management hosts are not implicitly authorized by an application deploy.
