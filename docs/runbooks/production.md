# Production bootstrap and deployment

Application: Ubuntu VPS, `kodumka.ru` (former `infraege.ru` redirects), Nginx → web/API/PostgreSQL. The accepted access contract
remains public root/password SSH with pinned host key, UFW and fail2ban. Keep provider console
access during credential rotation. Store secrets outside Git, mode 600; never put them in logs.

## Bootstrap

1. Configure DNS for the intended VPS and verify its host key. Run `ops/bootstrap-vps.sh` from
   the reviewed release. Verify a second SSH session before closing the recovery console.
2. Create `/etc/infraege/production.env` from `infra/.env.example`, mode 600, with distinct
   independent bootstrap/runtime/import/migration/backup/application-write passwords. Set a random
   `AUTH_CSRF_SECRET` (at least 32 characters), `PUBLIC_ORIGIN=https://kodumka.ru` and keep
   `TASK_FILES_DIR=/var/lib/infraege/task-files`. Create `/etc/infraege/restic-password` separately
   and keep a copy off the host (athanor `RESTIC_PASSWORD`). Write the root-only off-site
   credentials file `/etc/infraege/offsite-backup.env` as in [backup-restore](backup-restore.md)
   § Off-site copy (Change 196). Production must never reuse dev credentials.
3. Before enabling accounts, configure SMTP delivery (`SMTP_*`, `MAIL_FROM`) and create provider
   applications with the exact HTTPS callback origins
   `https://kodumka.ru/api/auth/providers/vk/callback` and
   `https://kodumka.ru/api/auth/providers/yandex/callback` (Telegram sign-in was removed in
   Change 198: a foreign service, 149-ФЗ ст. 10 ч. 8). Store client IDs/secrets only in the
   protected environment; do not paste callback `code`, `state`, mail links or tokens into tickets,
   shell history or journals. Provider methods also require the explicit per-provider
   `VK_ENABLED` or `YANDEX_ENABLED` release flag (default `false`), only
   after the real callback and account-entry flows pass. Before disabling a previously enabled
   provider, verify that no member depends on it as the sole login method. A missing
   provider/mail setting is a bounded unavailable flow, not a
   reason to disable origin, CSRF or callback validation.
4. Obtain initial TLS with `ops/obtain-initial-certificate.sh` and the required `PUBLIC_IPV4` and
   `TLS_EMAIL` environment; configure renewal with `ops/configure-certificate-renewal.sh`.
5. Prepare the application database and import the bank following [practice](practice.md),
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
Migrations must stay additive so a retained previous release remains rollback-safe against the
same volume; no automatic downgrade runs. A candidate that changes the schema head needs the
[schema transition attestation](backup-restore.md#schema-transition-attestation) after exact-SHA
image verification and before deploy dispatch. Do not bypass the preflight or migrate the live
database to break the ordering cycle.

## Domain, providers and host prerequisites

The public origin is `https://kodumka.ru` (Change 193): `www.kodumka.ru`, `infraege.ru` and
`www.infraege.ru` answer 301 with path and query kept; both certificates renew by webroot
(`ops/configure-certificate-renewal.sh`), and the deploy preflight requires both. Keep
`infraege.ru` registered while the redirect matters. Done:
- DNS at reg.ru: Postbox `kodumka.ru` with DKIM, SPF and DMARC; the Google TXT record stays;
- Google Search Console change of address `infraege.ru` → `kodumka.ru` (2026-10-25);
- sitemaps in both search consoles;
- uptime targets in `smotryashchiy`.

OAuth apps (Change 207):
- Yandex ID «Кодумка» (oauth.yandex.ru, scope `login:info`, verification pending);
- VK ID «Кодумка» (ID 54851111, base domain `kodumka.ru`).

Credentials are in athanor (infraegev2 vault) and `/etc/infraege/production.env`. Robokassa URLs
are in [billing](billing.md).

A rebuilt host also needs:
- `GEOIP_DIR=/var/lib/infraege/geoip` in the protected environment (the prod overlay requires it);
- `ops/install-backup-timers.sh` (adds `infraege-geoip.timer`), then one
  `systemctl start infraege-geoip.service`;
- the fail2ban jail `ops/fail2ban/jail.d/infraege.conf`. It bans in `DOCKER-USER` (option
  `chain = DOCKER-USER`, Change 205); `fail2ban-client -d` must show `-I DOCKER-USER`.

## Alerts (Change 194)

`.github/workflows/uptime.yml` probes kodumka.ru, the infraege.ru redirect, both certificates and
`sre.infraege.ru` on a 15-minute schedule; GitHub throttles scheduled runs, so in practice it runs
every 2–5 hours and the uptime targets in `smotryashchiy` are the primary probe. On failure it posts to Telegram when the repository secrets
`TELEGRAM_BOT_TOKEN` (a bot from BotFather) and `TELEGRAM_CHAT_ID` (the operator's chat with that
bot) are set; without them the run only fails in GitHub with a warning. After setting or rotating
them, check delivery once: dispatch the workflow with a deliberately failing step on a branch, or
send a test message with the same `curl` from a trusted shell. Never print the token.

## Routine operation

Use `docker compose` with the explicit production environment/project and installed release files,
`systemctl` and `journalctl` for application/TLS/backup/security status. Confirm the daily backup,
monthly isolated restore and hourly `infraege-account-purge.timer` are enabled after deployment;
the purge timer reports only aggregate cleanup counts and must not be replaced by host SQL access.
Paid access (Change 192) adds `infraege-billing-hourly.timer` and `infraege-billing-daily.timer`
(installed by `ops/install-backup-timers.sh`, no-ops while `BILLING_ENABLED` is off); flags,
refunds and incidents are in the [billing runbook](billing.md).
After a release that changes account purge, the release operator must keep the incident open until
`systemctl list-timers infraege-account-purge.timer` and
`journalctl -u infraege-account-purge.service --since <release-time> --no-pager` show the first
successful scheduled run and the next hourly run. Record both timestamps, service exit status and
aggregate JSON counts in release evidence; confirm neither run contains the previous Python import
error. Do not record account identifiers or token values. If either run fails, retain the incident
as open, capture the sanitized error, and add a Backlog fix before another release. Local `/ship`
alone does not establish that the installed timer resumed.
Account recovery from a snapshot remains an isolated, reconciled procedure — see the deletion and
restore gate in [backup](backup-restore.md#account-deletion-after-a-backup). `/health/live` is process
liveness; `/health/ready` checks database/schema readiness. A scheduled GitHub probe checks public
availability and TLS. Preserve bounded logs and rate limits. Browser analytics is the cookieless
`smotryashchiy` snippet allowlisted in CSP (SPEC §7.3); there is no consent UI or client-error
ingestion.

Auth endpoints have an independent Nginx per-IP limit (10/minute, burst 10, immediate 429), separate
from practice reads/checker. The exception is `GET /api/auth/session`, the check every page load
makes: it uses the page-read budget (600/minute, burst 200), so visitors behind one NAT address
(a school class) are not shown «Не удалось проверить вход» (Change 202). Production access logs use a query-free request format and provider
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

The agent also ships the hourly business summary (Change 195, [billing](billing.md#business-summary-change-195))
to the «Продажи» view: its unit runs `agent run` with `--business-file
/var/lib/infraege/business/summary.json` (smotryashchiy v0.4.0 or later). Without the flag, or
before the first hourly run writes the file, the view says that no summary has arrived.

Change 199 adds the operator console (smotryashchiy SPEC §4j, release with smotryashchiy Change 30).
Install the timers again (`ops/install-backup-timers.sh` adds `infraege-operator-export.timer`,
every ten minutes) and extend the agent unit's `agent run` with
`--document operator=/var/lib/infraege/ops/operator.json` and
`--operator-command /opt/infraege/current/scripts/operator-command.sh` (the business summary moves to
`--document business=…` or stays on `--business-file`), then `systemctl daemon-reload` and restart
the agent. The executor runs only the allow-listed kinds `warn`, `suspend`, `terminate`, `lift`,
`refund_execute`, `account_show`, checks every argument and passes them as JSON on stdin to
`billing.admin operator KIND`; without `--operator-command` the agent never asks for commands. The
report names people (email, account ID, IP, city): it stays root-only (`640`) and travels only to
the operator's own monitoring server in Russia.

## Retired operations stack

The pre-Change-122 stack `infraege-ops` (Umami, Beszel, WireGuard, journal gateway, its PostgreSQL
and timers) and the old PostgreSQL 16 volume were removed from the host by architect decisions
(Changes 136, 138, 139; details in `docs/changes/archive/COMPACTED.md`). Nothing depends on them;
only `infraege_postgres122-data` and the `infraege-application` snapshots remain protected. An
application deploy never implicitly authorizes changes to sibling repositories or other hosts.
