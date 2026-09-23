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

Root/password SSH stays by architect decision (SPEC §7.1); guessing is limited by `MaxAuthTries 3`
and the fail2ban sshd jail, whose bans grow for repeat offenders (Change 136). To apply a changed
`ops/fail2ban/jail.d/infraege.conf` to a running host: install it to `/etc/fail2ban/jail.d/`, run
`fail2ban-client reload`, and confirm `fail2ban-client get sshd bantime.increment` prints `true`.

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
availability and TLS. Preserve bounded logs and rate limits. Browser analytics is the cookieless
`smotryashchiy` snippet allowlisted in CSP (SPEC §7.3); there is no consent UI or client-error
ingestion.

## Host monitoring agent (smotryashchiy)

The host runs the `smotryashchiy` agent outside Compose (SPEC §7.1): systemd unit
`smotryashchiy-agent`, binary `/usr/local/bin/smotryashchiy`, config `/etc/smotryashchiy/agent.json`
(mode 600, holds the agent's WireGuard key) and spool `/etc/smotryashchiy/spool`. It reads metrics,
journald, Docker and fail2ban read-only and reports to `sre.infraege.ru`; it opens no ports. It is a
separate product with its own releases, so an application deploy never updates it. To update: download
`smotryashchiy-linux-amd64` and `SHA256SUMS` from the smotryashchiy GitHub Release, verify with
`sha256sum -c`, keep the running binary as `smotryashchiy.bak-<version>`, install the new one and
`systemctl restart smotryashchiy-agent`; confirm the host is fresh on the dashboard, then delete the
backup binary. Roll back by restoring that binary and restarting.

## Retired operations stack

The pre-Change-122 operations stack `infraege-ops` (Umami, Beszel and its agent, docker-socket-proxy,
its own PostgreSQL, timers `infraege-ops-backup`, `infraege-ops-analytics-retention`,
`infraege-ops-restore-check`, installed from `/opt/infraege-ops`) kept running after Change 122 until
the Change 136 release removed it completely, volumes included, by architect decision (SPEC §7.3).
Nothing on the host depends on it. Its WireGuard management tunnel `wg0` (10.77.0.1, peers
10.77.0.2/.3) carried only that stack: `wg-quick@wg0` is disabled and its UFW rules (51820/udp, the
old journal gateway 19531 on wg0) are removed, while `/etc/wireguard/` is kept. Its encrypted
snapshots (restic tag `infraege-ops`) remain in the shared repository `/var/backups/infraege/restic`;
nothing prunes them any more, and the application's own snapshots are unaffected. Sibling repositories and remote management hosts are still not
implicitly authorized by an application deploy.
