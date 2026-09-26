# Production bootstrap and deployment

Application: Ubuntu VPS, `infraege.ru`, Nginx → web/API/PostgreSQL. The accepted access contract
remains public root/password SSH with pinned host key, UFW and fail2ban. Keep provider console
access during credential rotation. Store secrets outside Git, mode 600; never put them in logs.

## Bootstrap

1. Configure DNS for the intended VPS and verify its host key. Run `ops/bootstrap-vps.sh` from
   the reviewed release. Verify a second SSH session before closing the recovery console.
2. Create `/etc/infraege/production.env` from `infra/.env.example`, mode 600, with distinct
   independent bootstrap/runtime/import/migration/backup/application-write passwords. Set a random
   `AUTH_CSRF_SECRET` (at least 32 characters), `PUBLIC_ORIGIN=https://infraege.ru` and keep
   `TASK_FILES_DIR=/var/lib/infraege/task-files`. Create `/etc/infraege/restic-password` separately.
   Production must never reuse dev credentials.
3. Before enabling accounts, configure SMTP delivery (`SMTP_*`, `MAIL_FROM`) and create provider
   applications with the exact HTTPS callback origins
   `https://infraege.ru/api/auth/providers/vk/callback`,
   `https://infraege.ru/api/auth/providers/yandex/callback` and
   `https://infraege.ru/api/auth/providers/telegram/callback`. Store client IDs/secrets only in the
   protected environment; do not paste callback `code`, `state`, mail links or tokens into tickets,
   shell history or journals. Provider methods also require the explicit per-provider
   `VK_ENABLED`, `YANDEX_ENABLED`, or `TELEGRAM_ENABLED` release flag (default `false`), only
   after the real callback and account-entry flows pass. Before disabling a previously enabled
   provider, verify that no member depends on it as the sole login method. A missing
   provider/mail setting is a bounded unavailable flow, not a
   reason to disable origin, CSRF or callback validation.
4. Obtain initial TLS with `ops/obtain-initial-certificate.sh` and the required `PUBLIC_IPV4` and
   `TLS_EMAIL` environment; configure renewal with `ops/configure-certificate-renewal.sh`.
5. Prepare the application database/bank using [practice-transition](practice-transition.md),
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
GHCR images after static quality checks; the image workflow owns digest security scans. Tests run
locally, not in ordinary CI or application containers.
Deploy workflow_dispatch selects a full commit on remote main. `/ship --release` requires
missing affected local coverage, unpublished-commit secrets checks, changed-dependency audits and
all Release Gate phases. Full is manual; unknown/shared inputs require an explicit coverage
decision. Ordinary `/work` and `/ship` do not deploy. Use the evidence and resume procedure in
[verification](verification.md); published-digest scans are checked after push
and before dispatch, and live SHA is checked independently after deploy.

The workflow uploads the checked-out deployment script to a SHA-specific root-owned path and
executes that file with closed stdin. Never stream its body into `bash -s`: a child command can
consume the remaining script and return false success. A separate runner step checks public
readiness against the requested full SHA and requests the homepage after remote completion.

The release is unpacked at `/opt/infraege/releases/<sha>` and deploy mutations use a host lock.
Preflight checks environment, schema-transition attestation, images and TLS readability. It backs
up the prepared DB, re-provisions restricted roles (including `infraege_app`), runs migration,
activates Compose, verifies health version and public HTTP,
then updates `current`, `database-current`, deployment status and environment SHA. It never
imports content automatically. Preserve candidate and previous images for recovery.
On a reviewed schema transition, the pre-migration deploy backup carries a recovery hold;
record its exact full snapshot ID from `backup-status.json` before the next timer backup. Ordinary
deploys and daily backups do not create holds. Review and manually release a hold after 30 days
only through the [backup procedure](backup-restore.md#recovery-hold-review-and-release), never by
an automatic retention timer.

After the release is healthy and recorded, `scripts/prune-releases.sh` keeps the three newest
releases plus whatever `current` and `database-current` point to, and removes the other releases'
directories, `/root/infraege-<sha>.tar.gz` archives, `/root/infraege-deploy-<sha>.sh` scripts and
application images (Change 138). An image still used by a container is skipped. A pruning failure
prints a warning and never fails the deploy. Set `KEEP_RELEASES` (at least 2) to change the count.

A failure invokes one verified rollback and retains its original error status. The data volume
`infraege_postgres122-data` is shared by every kept release, so rollback never switches volumes. Missing previous release or failed rollback
requires manual recovery, not a destructive schema downgrade. Consult [backup](backup-restore.md).
The `140_01` account migration is additive, so a retained `122_01` release remains rollback-safe
against the same volume; no automatic downgrade runs. Before the first account release, run the
two-stage candidate migration/restore rehearsal on isolated production-data copies described in
[backup](backup-restore.md), then record the exact candidate as root-owned mode-600
`/etc/infraege/accounts-schema-ready` containing `140_01 <full-candidate-sha>`. This must happen
after exact-SHA image verification and before deploy dispatch; routine restore-check of an old
`122_01` bundle alone cannot attest the new schema. Do not bypass the preflight or migrate the live
database to break the ordering cycle.

## Routine operation

Use `docker compose` with the explicit production environment/project and installed release files,
`systemctl` and `journalctl` for application/TLS/backup/security status. Confirm the daily backup,
monthly isolated restore and hourly `infraege-account-purge.timer` are enabled after deployment;
the purge timer reports only aggregate cleanup counts and must not be replaced by host SQL access.
Account recovery from a snapshot remains an isolated, reconciled procedure — see the deletion and
restore gate in [backup](backup-restore.md#account-deletion-after-a-backup). `/health/live` is process
liveness; `/health/ready` checks database/schema readiness. A scheduled GitHub probe checks public
availability and TLS. Preserve bounded logs and rate limits. Browser analytics is the cookieless
`smotryashchiy` snippet allowlisted in CSP (SPEC §7.3); there is no consent UI or client-error
ingestion.

Auth endpoints have an independent Nginx per-IP limit (10/minute, burst 10, immediate 429), separate
from practice reads/checker. Production access logs use a query-free request format and provider
callbacks disable edge access logging and suppress query-bearing proxy warnings; Uvicorn access logs
are disabled because they include request queries. The API's structured events retain path, status and
request ID only. Treat a callback query,
verification/reset link, password, cookie and CSRF value as a secret even when debugging.

Host packages are patched by unattended upgrades. They stop silently if `dpkg` was interrupted,
because every later `apt` run then fails. Check this monthly:
- `dpkg --audit` must print nothing;
- `apt list --upgradable` must stay short;
- `/var/run/reboot-required` means a pending reboot.

To repair: run `dpkg --configure -a` and `apt-get -f install` with `NEEDRESTART_MODE=l`, so no
service restarts. Plan the reboot separately: it restarts the application for about a minute.

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
