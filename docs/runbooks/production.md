# Production bootstrap and deployment

Target: Ubuntu 24.04 VPS in Moscow, 2 EPYC 7502 vCPU, 4 GB RAM, 40 GB NVMe, domain
`infraege.ru`, public IPv4 `2.26.8.245`. The primary access contract deliberately uses public
root/password SSH; keep the provider console open during password rotation or access repair. Generate and
place every required value using the ordered
[production onboarding guide](production-onboarding.md) before following this summary.

The independent `infraege-ops` project is active. Validate a candidate locally with
`make ops-config ENV_FILE=... RELEASE=<full-sha>`, use `ops-update` for the installed project and
reserve `ops-install` for a genuinely new target. Two preliminary cutover attempts rolled back
safely; the final 2026-08-20 cutover passed. No old analytics or metrics data was transferred.

## One-time bootstrap

1. In REG.RU replace the existing `A` records for `@` and `www` with `2.26.8.245`, TTL 300 during
   setup. Keep `ns1.reg.ru` and `ns2.reg.ru` as the authoritative nameservers.
2. In the provider console set a new unique root password, upload a release checkout, then run:

   ```bash
   ops/bootstrap-vps.sh
   ```

3. From a second terminal verify password-only `root@2.26.8.245` with the pinned host key before
   closing the console. Install an adapted
   `ops/wireguard/wg0.conf.example` as `/etc/wireguard/wg0.conf`, then enable `wg-quick@wg0`.
4. Create `/etc/infraege/production.env` from `infra/.env.example` with mode `600`. Generate every
   password independently. Create `/etc/infraege/restic-password`, also mode `600`.
5. Once both DNS records resolve to the VPS, obtain TLS:

   ```bash
   PUBLIC_IPV4=2.26.8.245 TLS_EMAIL=vlad-god500@mail.ru \
     ops/obtain-initial-certificate.sh
   ```

6. Run the first deployment from GitHub Actions, then configure renewal, the WireGuard journal
   gateway and timers on the server:

   ```bash
   ops/configure-certificate-renewal.sh
   WIREGUARD_IP=10.77.0.1 ops/setup-journal-gateway.sh
   ops/install-backup-timers.sh
   ```

7. For an existing server migration, prepare the new contract while the old administration session
   and provider console remain open. Verify it from a second root/password SSH session before
   retiring the three previous identities:

   ```bash
   sudo passwd root
   sudo ops/migrate-root-password-access.sh prepare
   scripts/production-root-ssh.sh 'ops/migrate-root-password-access.sh verify'
   CONFIRM_RETIRE_IDENTITIES=operator,deploy,ops-reader \
     ops/migrate-root-password-access.sh retire
   ```

   Store the new value locally as `~/.config/infraege/production/root-admin-password` with mode
   `600`. Never reuse the previous recovery value or print the new password in shell history,
   logs, git or chat.

## GitHub production settings

Environment `production` requires reviewer approval. Set secrets `PROD_HOST`,
`PROD_ROOT_PASSWORD`, `PROD_SSH_HOST_KEY`; set variable `VITE_UMAMI_WEBSITE_ID`. The host key must be
the exact `known_hosts` line obtained through a trusted channel, never
`StrictHostKeyChecking=no`.

GitHub Actions receives the same root password through the protected environment. Legacy
`PROD_USER` and `PROD_SSH_KEY` are not part of the active contract.

Images publish from `main` to GHCR under the full commit SHA. Deploy is manual: run “Deploy
production”, enter that 40-character SHA, approve the environment, and follow the smoke step. The
server runs the deployment as root, keeps the previous release and `scripts/deploy-remote.sh`
rolls back automatically if
readiness or the public page fails.

## Observability ownership

This repository owns VPS access, WireGuard/journal prerequisites, backup/restore and the small
target-specific operations package. `make ops-status` reads the installed `infraege-ops` Compose
project through pinned SSH. `ops-install` and `ops-update` upload one Compose release plus a
protected mode-600 environment, then run `pull` and `up --wait`; `ops-rollback` reapplies the
previous release. They do not reference or mutate the application Compose project.

`ops/observability/compose.yml` uses empty independent Postgres/Beszel volumes, WireGuard-only
UI/API bindings, the loopback read-only socket proxy and the external collector-ingress network.
Both deploy paths create that network if absent. The active application Nginx resolves Umami at
request time through Docker DNS and survives an independent Umami container replacement. Legacy
volumes remain rollback-only and are removed only by a later approved cleanup.

`/home/niquetamerewsl/projects/sre-kit` is the first-party sibling for the universal observability
core, adapters, Source configuration, normalization, alerts and monitoring UI. It does not own
infraegev2 deployment automation or target credentials. Repository and live VPS ownership are
split. Linked sre-kit Change 20 reconciled exactly six enabled Sources and proved fresh polling,
quiet success, reversible failure/recovery and authenticated UI rendering without mutating the
target. A workstation-hosted core still provides no polling or alerts while it is off. Do not
recreate the retired `apps/ops` dashboard.

## Verified fresh-start cutover

Production completed this procedure on 2026-08-20 with exact SHA
`ad6df05fa7d44e7a4f9434c196091ed4890e2f49`. Application and operations projects, public collector,
private services, Beszel registration, tagged backup/restore and timers passed acceptance. Keep the
following sequence as the rebuild/cutover contract; use one SHA that passed the Release Gate and
record the previous application release first.

Two preliminary attempts exercised rollback successfully. The accepted topology attaches Beszel to
both `ops-internal` and `infraege-observability-ingress`, keeps Postgres internal-only and never
shell-sources the Compose operations env in maintenance scripts.

During the authorized window:

1. Create or inspect `infraege-observability-ingress`; do not remove any volume.
2. Stop only legacy `umami`, `beszel`, `beszel-agent` and `docker-socket-proxy` in the currently
   installed application release. Leave Nginx, web, API and application Postgres running.
3. Deploy the selected application release. Its Compose project removes the now-orphaned legacy
   containers but does not remove their named volumes. Public application health must pass; the two
   `/stats` routes may return `502` until the next step.
4. Run `make ops-update ENV_FILE=... RELEASE=<full-sha>` when `/opt/infraege-ops/current` exists
   after a rollback; use `ops-install` only on a genuinely new target. Both reuse only the clean
   operations volumes and wait for all services; neither reads legacy volumes.
5. Run `sudo /opt/infraege/current/ops/install-backup-timers.sh activate-operations`, then manually
   start both `infraege-ops` backup and restore-check services and verify their tagged snapshots.
6. Create the new Umami website/Beszel system and verify the secret-free IDs in
   `ops/observability/sre-kit-sources.example.json`. For a genuinely new target, register and
   verify all six Sources through sre-kit's supported API/UI contracts; do not copy Change 20's
   local runtime state. Source registration never gates either Compose project.

If acceptance fails, disable the three `infraege-ops-*` timers, run the operations project's
Compose `down` without `--volumes`, and deploy the recorded previous application SHA. That release
recreates legacy containers against the preserved application-owned volumes. Verify public health,
collector and the previous dashboards. Do not delete the new operations volumes during rollback;
all cleanup is a later, separately authorized destructive task.

## Capacity and scale-up trigger

Review weekly once real traffic exists. Upgrade before sustained CPU >70%, RAM >75%, disk >70%,
swap activity during normal load, or p95 latency regression persists for 15 minutes. Do not add a
CDN until measurement shows edge caching would solve a real bottleneck.
