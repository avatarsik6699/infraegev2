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

`scripts/production-root-ssh.sh` opens an operator root session with the documented host key and
password policy; verify SSH changes from a second session before closing the first. No monitoring
tunnels or journal HTTP gateways are required. UFW packet logging is off (Change 138): blocked
port scans would otherwise flood the monitoring events, and fail2ban reads the sshd log instead.

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

After the release is healthy and recorded, `scripts/prune-releases.sh` keeps the three newest
releases plus whatever `current` and `database-current` point to, and removes the other releases'
directories, `/root/infraege-<sha>.tar.gz` archives, `/root/infraege-deploy-<sha>.sh` scripts and
application images (Change 138). An image still used by a container is skipped. A pruning failure
prints a warning and never fails the deploy. Set `KEEP_RELEASES` (at least 2) to change the count.

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
Nothing on the host depends on it. Change 138 removed the rest of it by architect decision:
- the WireGuard tunnel `wg0` (packages, `/etc/wireguard/`, its UFW rules);
- the `systemd-journal-remote` package with the journal gateway socket;
- the env files in `/etc/infraege/ops` and `/var/backups/infraege-ops`;
- the `infraege-observability-ingress` network, its dangling anonymous volumes and one-off
  bootstrap/cutover files in `/root`;
- its restic snapshots (`restic forget --tag infraege-ops --prune`, followed by `restic check`).

The application's `infraege-application` snapshots were not touched. Sibling repositories and remote management hosts are still not
implicitly authorized by an application deploy.
