# Production bootstrap and deployment

Target: Ubuntu 24.04 VPS in Moscow, 2 EPYC 7502 vCPU, 4 GB RAM, 40 GB NVMe, domain
`infraege.ru`, public IPv4 `2.26.8.245`. The primary access contract deliberately uses public
root/password SSH; keep the provider console open during password rotation or access repair. Generate and
place every required value using the ordered
[credentials and onboarding](#credentials-and-onboarding) before following this summary.

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
   PUBLIC_IPV4=2.26.8.245 TLS_EMAIL=avatarsik6699@gmail.com \
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

### First application PG16 → PG18 release (Change 113)

This is a separate maintenance/release operation. `/work 113` does not deploy it. The ordinary
workflow input `db_transfer=none` refuses an installed PG16 source; choose `16-to-18` only after
the following preflight. Subsequent PG18 releases use `none`.

1. Refresh the application-only inventory and backup/restore evidence from `backup-restore.md`.
   Keep the existing bootstrap password unchanged during this cutover. Add four independently
   generated role passwords from `infra/.env.example` to the protected production env; use
   `openssl rand -hex 24` for each. Never copy local/test values into production.
2. Verify that the exact previous application SHA works with PG18 and the read-only runtime
   connection in an isolated rehearsal. Record that full SHA in the root-owned
   `/etc/infraege/pg18-rollback-compatible-sha` (mode 600) only after this verification. The first release
   refuses to proceed without that exact compatibility proof. This live-release prerequisite
   remains pending after local Change 113 acceptance; a unit test is not this proof.
3. Check at least 30% disk free and space for old/new volumes, dump, restore workspace and WAL.
   Select the approved full candidate SHA and dispatch **Deploy production** with
   `db_transfer=16-to-18`. The coordinator locks `/run/lock/infraege-deploy.lock`, validates
   compatibility/config/images/TLS, stops only application web/API writers, makes a tagged backup,
   then invokes `db-transfer.sh --prepare-release` into a new `infraege_postgres18-data` volume.
4. Preparation restores only application data/roles, compares SQL data/schema evidence, provisions
   the new role credentials and disables the disposable restore administrator. It refuses an
   existing target volume. A failed candidate is retained for review; there is no automatic reset,
   destructive re-restore or volume removal. Old `infraege_postgres-data` is always retained.
5. The coordinator switches PostgreSQL, sets `/opt/infraege/database-current` to the matching
   maintenance release and installs the application timers before application smoke. Maintenance
   stays on the PG18 bundle contract even if application rollback occurs. Ops jobs/tag are untouched.
6. Verify runtime/readiness, SQL roles, installed timer backup and disposable restore, encrypted
   manual export, and the public application. Record measured restore duration from
   `/var/lib/infraege/restore-status.json` and check both freshness markers. This is live acceptance,
   not implied by local tests. Do not remove the old volume afterward without separate approval.

Before the DB switch, a failed release returns to the retained source. After the switch, automatic
rollback uses `--no-deps nginx web api` plus the PG18 runtime connection overlay; it never applies
the previous Postgres service or downgrades/restores data. If PG18 itself is unhealthy, stop and
inspect the retained volumes/transfer marker instead of retrying a blind restore. After any target
writes, PG16 is stale and recovery requires stopped writers and a separately reviewed plan using
current PG18 data. The `db-transfer.json` marker means *prepared*, not *cut over* or *healthy*.

Local `--rehearse` runs the same preparation code only for `test/infraege-db-test-*`, with explicit
temporary state/backup directories. It cannot select the production destination. Release archives
must carry the whole `scripts/lib/` tree, provisioning script, DB compatibility declaration and
rollback overlay; the existing full `git archive` packaging does so.

Environment `production` has no required reviewers by architect decision (2026-09-04); a manual
`workflow_dispatch` proceeds without a second approval, and `can_admins_bypass` remains enabled. Set secrets `PROD_HOST`,
`PROD_ROOT_PASSWORD`, `PROD_SSH_HOST_KEY`; set variable `VITE_UMAMI_WEBSITE_ID`. The host key must be
the exact `known_hosts` line obtained through a trusted channel, never
`StrictHostKeyChecking=no`.

GitHub Actions receives the same root password through the protected environment. Legacy
`PROD_USER` and `PROD_SSH_KEY` are not part of the active contract.
Any later root-password rotation must update both the protected local `root-admin-password` file
and the GitHub Environment `PROD_ROOT_PASSWORD` before the next deploy.

Images publish from `main` to GHCR under the full commit SHA. Deploy is manual: run “Deploy
production”, enter that 40-character SHA, and follow the unattended environment and smoke steps. The
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
UI/API bindings, the loopback read-only socket proxy on its own non-internal bridge and the
external collector-ingress network. The Beszel Agent remains in host-network mode and reaches
only the proxy's `127.0.0.1:2375` read API; production status requires `_ping` and a non-empty
container listing.
Both deploy paths create that network if absent. The active application Nginx resolves Umami at
request time through Docker DNS and survives an independent Umami container replacement. Legacy
volumes remain rollback-only and are removed only by a later approved cleanup.

`/home/niquetamerewsl/projects/sre-kit` is the first-party sibling for the universal observability
core, adapters, Source configuration, normalization, alerts and monitoring UI. It does not own
infraegev2 deployment automation or target credentials. Repository and live VPS ownership are
split. The accepted always-on management deployment at `https://sre.infraege.ru` contains the
clean-start `infraegev2` Project with six pull Sources and one `Nginx traffic` push Source. The
workstation-hosted core remains a disabled manual fallback; it is not the production monitoring
surface. Do not recreate the retired `apps/ops` dashboard.

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
6. Create the new Umami website and one uniquely named Beszel system (`infraege.ru`). Source
   reconciliation discovers its current record id through the existing protected Beszel account;
   do not copy an id into tracked or protected configuration. For a genuinely new target, register and
   verify all seven Sources through sre-kit's supported API/UI contracts; do not copy Change 20's
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

## Credentials and onboarding

### Confirmed non-secret inputs

| Input | Value |
|-------|-------|
| Domain | `infraege.ru` |
| VPS IPv4 | `2.26.8.245` |
| Bootstrap/runtime/deploy login | `root` with password authentication (primary accepted contract) |
| Authoritative DNS | `ns1.reg.ru`, `ns2.reg.ru` |
| Required A records | `@ -> 2.26.8.245`, `www -> 2.26.8.245` |
| TLS contact | `avatarsik6699@gmail.com` |
| Feedback link | `https://t.me/+dElnKYPKGd81OGYy` |
| WireGuard server address | `10.77.0.1/24` |
| Initial laptop address | `10.77.0.2/32` |

The previous recovery password has been transmitted through chat and must not be reused. Generate a
new unique value, store it in `~/.config/infraege/production/root-admin-password` with mode `600`,
and add the same value to the protected GitHub Environment. Keep the provider console and
old session open until a second password-only root session succeeds with the pinned host key.

### 1. Create and verify the primary root credential

The production adapter enforces the architect-approved minimum of 12 characters; the increased
brute-force risk is accepted for the current host. A longer independently generated password remains
the recommended onboarding default. Generate 48 random bytes without printing them to chat or
committing them. One safe local flow is:

```bash
install -d -m 700 ~/.config/infraege/production
umask 077
openssl rand -base64 48 > ~/.config/infraege/production/root-admin-password
chmod 600 ~/.config/infraege/production/root-admin-password
```

Set that password through the provider console with `passwd root`; do not pass it as a command-line
argument. Upload a release checkout and prepare the access profile:

```bash
ops/migrate-root-password-access.sh prepare
```

From a second terminal use the repository wrapper, then record the proof from that new session:

```bash
scripts/production-root-ssh.sh 'ops/migrate-root-password-access.sh verify'
```

The previous `operator`, `deploy` and `ops-reader` identities are retired. Do not recreate them or
plan key-only migration without a new explicit architect decision. Personal WireGuard keys are a
separate private-network contract and must not be deleted.

### 2. Fill the GitHub `production` environment

The environment already exists. In the repository UI open **Settings -> Environments ->
production**. Use environment secrets, not repository files. GitHub only releases these values to
jobs that reference this environment. Required reviewers are disabled by the architect decision
recorded in GitHub production settings above.

Add these secrets:

| Name | Exact source |
|------|--------------|
| `PROD_HOST` | `2.26.8.245` |
| `PROD_ROOT_PASSWORD` | Entire single line from protected `root-admin-password` |
| `PROD_SSH_HOST_KEY` | Verified `known_hosts` line for `2.26.8.245`, as described below |

Obtain the SSH host key without weakening strict host checking:

1. In the trusted VPS provider console, run
   `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` and note the SHA256 fingerprint.
2. On the laptop run
   `ssh-keyscan -t ed25519 2.26.8.245 > /tmp/infraege-known-hosts` and then
   `ssh-keygen -lf /tmp/infraege-known-hosts`.
3. Continue only if the fingerprints match. Use the complete line from
   `/tmp/infraege-known-hosts` as `PROD_SSH_HOST_KEY`.

The same values can be entered without exposing the password in shell history:

```bash
printf %s 2.26.8.245 | gh secret set --repo avatarsik6699/infraegev2 --env production PROD_HOST
gh secret set --repo avatarsik6699/infraegev2 --env production PROD_ROOT_PASSWORD \
  < ~/.config/infraege/production/root-admin-password
gh secret set --repo avatarsik6699/infraegev2 --env production PROD_SSH_HOST_KEY \
  < /tmp/infraege-known-hosts
gh secret delete --repo avatarsik6699/infraegev2 --env production PROD_USER
gh secret delete --repo avatarsik6699/infraegev2 --env production PROD_SSH_KEY
```

Treat the local file, the VPS login and GitHub Environment secret as one credential contract. On
every later root-password rotation, update
`~/.config/infraege/production/root-admin-password` and `production/PROD_ROOT_PASSWORD`, then prove
both a fresh wrapper session and a dispatched deploy. If only the VPS/local copy changes,
the deploy job reaches the host-key check but fails its first authenticated upload.

Add one environment variable under **Environment variables**:

- `VITE_UMAMI_WEBSITE_ID` is the public UUID identifying `infraege.ru` in Umami. Generate it before
  the first image build with `uuidgen` and keep the same value for the Umami website created in
  section 5. It is intentionally visible in the browser and is a variable, not a secret.

CLI equivalent after choosing the value:

```bash
gh variable set --repo avatarsik6699/infraegev2 --env production VITE_UMAMI_WEBSITE_ID \
  --body 'REPLACE_WITH_UUIDGEN_OUTPUT'
gh secret list --repo avatarsik6699/infraegev2 --env production
gh variable list --repo avatarsik6699/infraegev2 --env production
```

GitHub documents [environment secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets?tool=webui)
and [deployment protection rules](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).

### 3. Create WireGuard keys and configuration

WireGuard keys do not come from the hosting panel. Generate a distinct pair on each peer. On the
VPS provider console:

```bash
install -d -m 700 /etc/wireguard
umask 077
wg genkey | tee /etc/wireguard/server-private.key | \
  wg pubkey > /etc/wireguard/server-public.key
```

On the operator laptop, use an untracked private directory:

```bash
install -d -m 700 ~/.config/infraege/wireguard
umask 077
wg genkey | tee ~/.config/infraege/wireguard/laptop-private.key | \
  wg pubkey > ~/.config/infraege/wireguard/laptop-public.key
```

Copy only public keys between peers. Adapt `ops/wireguard/wg0.conf.example` for the VPS, install it
as `/etc/wireguard/wg0.conf` with mode `600`, and create the laptop peer with:

```ini
[Interface]
Address = 10.77.0.2/24
PrivateKey = REPLACE_LAPTOP_PRIVATE_KEY

[Peer]
PublicKey = REPLACE_SERVER_PUBLIC_KEY
Endpoint = 2.26.8.245:51820
AllowedIPs = 10.77.0.0/24
PersistentKeepalive = 25
```

Enable the VPS interface with `systemctl enable --now wg-quick@wg0`; bring up the laptop interface
using its WireGuard client and verify `ping 10.77.0.1`. The key-generation flow follows the
[official WireGuard quick start](https://www.wireguard.com/quickstart/).

Once the tunnel works, install the journal gateway independently of SSH identities:

```bash
WIREGUARD_IP=10.77.0.1 ops/setup-journal-gateway.sh
```

sre-kit's `host-metrics-ssh` and `fail2ban-ssh` sources use `root`, password authentication and the
public SSH endpoint. Beszel, Umami and the journal gateway remain private WireGuard services.
These are read-only adapter connections: sre-kit does not receive target lifecycle ownership.
After cutover, run `make ops-status` to inspect the infraegev2-owned operations Compose project.
The command is read-only; install, update and rollback remain explicit operator actions and are
never exposed through sre-kit's UI.

The repository contains the active `infraege-ops` Compose definition. Onboarding alone does not
mutate the installed Umami/Beszel project. Its
`env.contract` records names only; actual values remain in the protected operations environment.
Create `~/.config/infraege/production/ops.env` with exactly those names, independently generated
values and mode `600`; do not copy it into the checkout. The generated file, bootstrapped Beszel
credentials and clean operations volumes survived both rollback gates and now back the accepted
split production stack. Validate every later operations release before install/update:

```bash
make ops-config \
  ENV_FILE="$HOME/.config/infraege/production/ops.env" \
  RELEASE="$(git rev-parse HEAD)"
```

### 4. Generate application and Restic secrets

Create `/etc/infraege/production.env` from `infra/.env.example` on the VPS. It contains only
application settings. Generate every value independently; never reuse the root, SSH, database or
Restic credential:

```bash
openssl rand -hex 32     # POSTGRES_PASSWORD
```

Set `DEPLOY_SHA` to the full 40-character release SHA when deploying. Quote values in the env file
when they contain shell metacharacters. Validate the completed file without printing it:

```bash
umask 077
cp --no-clobber infra/.env.example /etc/infraege/production.env
chmod 600 /etc/infraege/production.env
## Edit every placeholder now, then validate:
scripts/render-production-config.sh /etc/infraege/production.env >/dev/null
```

Restic has no provider-issued key. Generate one more long random passphrase, store it in a password
manager, and write only that passphrase plus a trailing newline to
`/etc/infraege/restic-password` with mode `600`. Application and operations jobs share this
encrypted repository but select snapshots through separate tags; the first successful backup
initializes it. Losing this password makes the repository unrecoverable; same-host Restic is still
not disaster recovery. See the
[official Restic repository guide](https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html).

### 5. Create the Umami website ID and dashboard account

`VITE_UMAMI_WEBSITE_ID` is neither the Umami login nor `APP_SECRET`. It is the website record UUID
embedded in the public tracker. Before publishing images, generate it on the laptop:

```bash
uuidgen
```

Set that UUID as the GitHub environment variable from section 2. After the clean operations stack starts,
connect WireGuard and open `http://10.77.0.1:3001`. Log in with the one-time default
`admin` / `umami` credentials and change the password immediately. A previous single-operator local setup deferred rotation; that historical exception does not
authorize retaining default credentials when onboarding a new remote target. Create a website named
`infraege.ru`, domain `infraege.ru`, using `POST /api/websites` with the pre-generated UUID
in its `id` field. The [Umami websites API](https://docs.umami.is/docs/api/websites) explicitly
supports forcing the website UUID; authenticated self-hosted requests use a bearer token from
[`POST /api/auth/login`](https://docs.umami.is/docs/api/authentication).

This laptop-side example prompts for the new password and keeps it out of shell history:

```bash
read -rp 'Umami website UUID: ' infraege_umami_website_id
read -rp 'Umami username [admin]: ' infraege_umami_username
infraege_umami_username=${infraege_umami_username:-admin}
read -rsp 'Umami password: ' infraege_umami_password
printf '\n'
infraege_umami_token=$(
  jq -cn --arg username "$infraege_umami_username" \
    --arg password "$infraege_umami_password" '{username:$username,password:$password}' |
    curl -fsS http://10.77.0.1:3001/api/auth/login \
      -H 'Content-Type: application/json' --data-binary @- |
    jq -er .token
)
jq -cn --arg id "$infraege_umami_website_id" \
  '{id:$id,name:"infraege.ru",domain:"infraege.ru"}' |
  curl -fsS http://10.77.0.1:3001/api/websites \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $infraege_umami_token" --data-binary @-
unset infraege_umami_password infraege_umami_token
```

For sre-kit's `umami-http` source, create a separate least-privilege Umami account if the
installed version permits access to this website without administrative rights, then register
it as a source in sre-kit's own UI — credentials never enter this repository.

### 6. Obtain Beszel `TOKEN` and `KEY`

These values appear only after the Beszel Hub is running; they are not VPS-provider credentials.
Before `ops-install`, use independently generated temporary non-empty values for
`BESZEL_AGENT_TOKEN` and `BESZEL_AGENT_KEY` in the protected operations env. The agent may remain
unavailable while Umami, Beszel Hub and the application start.

Over WireGuard open `http://10.77.0.1:8090`, create the initial Beszel administrator, then:

1. Open `/settings/tokens` and create/copy a universal token -> `BESZEL_AGENT_TOKEN`.
2. Click **Add System** and use `/beszel_socket/beszel.sock` as Host/IP. Copy the public key shown
   by the dialog -> `BESZEL_AGENT_KEY`.
3. Replace both bootstrap values in the protected operations env and use `ops-update` with the
   currently installed full release SHA to recreate `beszel-agent`.
4. Complete **Add System** with the unique name `infraege.ru`. Management reconciliation resolves
   its current PocketBase record id by that name and fails closed on zero or multiple matches.
   Never copy a record id into tracked or protected configuration. A replacement target must prove
   fresh system and per-container records through sre-kit's supported API/UI contracts.

The Beszel public key normally contains a space. It is valid Compose env input; operations
maintenance scripts must pass this file through `docker compose --env-file` and must never
`source` it as shell code.

The current Beszel flow and meanings of `KEY`, `TOKEN` and `HUB_URL` are documented in its
[getting-started](https://beszel.dev/guide/getting-started) and
[agent-installation](https://www.beszel.dev/guide/agent-installation) guides.

Create a separate read-only Beszel user, share only this system with it, and register it as a
`beszel-api` source in sre-kit — credentials are stored only there, never in this repository.

## DNS and TLS

- Registrar/DNS: REG.RU, authoritative nameservers `ns1.reg.ru` and `ns2.reg.ru`. Canonical origin:
  `https://infraege.ru`; `www` redirects to the apex.
- Required records: `A @ 2.26.8.245` and `A www 2.26.8.245`. Replace the previous
  `95.163.244.138` values; do not leave duplicate A records. There is no IPv6 record until the VPS
  is deliberately configured for IPv6.
- Check propagation with `dig +short A infraege.ru` and `dig +short A www.infraege.ru` from two
  independent resolvers before requesting a certificate.
- The first certificate uses Certbot standalone mode, so ports 80/443 must be free. Subsequent
  renewal uses webroot `/var/www/certbot`; the deploy hook reloads only the Nginx container.
- Certificate contact: `avatarsik6699@gmail.com`. This address is for expiry/account notices, not a
  certificate private key or a GitHub secret.

Verification:

```bash
curl -I http://infraege.ru
curl -I https://www.infraege.ru
curl -fsS https://infraege.ru/health/ready | jq .
echo | openssl s_client -servername infraege.ru -connect infraege.ru:443 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates
sudo certbot renew --dry-run --no-random-sleep-on-renew
```

The scheduled GitHub probe fails when HTTPS/readiness fails or fewer than 14 certificate days
remain. It deliberately has no Telegram integration yet; inspect Actions and sre-kit.

## Incident response

### Triage

1. Record UTC start time, affected URLs and deployed SHA; do not rotate/delete logs before capture.
2. Check `https://infraege.ru/health/live` and `/health/ready`, GitHub probe history, then sre-kit's
   source strip.
3. On the VPS use `docker compose ... ps`, `journalctl -u docker --since -30min`, disk/memory state,
   and `fail2ban-client status`. Never paste production env files or tokens into tickets/chat.
   From a trusted workstation, `make ops-status` reads the independent operations Compose status
   over the pinned SSH transport without printing its protected environment.
4. Do not run `ops-install` or `ops-update` merely to inspect an incident. Use the read-only status
   command first; use `ops-rollback` only when the previous operations release is the confirmed
   recovery target.

### Containment and recovery

- Bad release: re-run the deploy workflow with the last known-good main SHA. Automatic rollback
  handles failed deploy smoke, but not delayed application defects.
- Database/storage: identify whether `infraege-application` or `infraege-ops` owns the data, stop
  only that project's writers and follow `backup-restore.md`; never run broad `DELETE`,
  `TRUNCATE`, `DROP TABLE` or `DROP DATABASE` as an exploratory action.
- Compromise suspicion: isolate with the provider firewall, preserve journal/GitHub evidence,
  rotate the primary root password in both GitHub and the local protected store plus database,
  Umami, Beszel, Restic and WireGuard secrets, then rebuild from bootstrap rather than trusting the
  host. A leaked root password means the whole VPS is untrusted.
- Root/password lockout: use the REG.RU console, restore a usable root password and rerun
  `ops/migrate-root-password-access.sh check`; never weaken host-key verification as a workaround.
- Resource exhaustion: identify the container first; scale the VPS only after containing runaway
  processes. Preserve at least 30% disk headroom.

### Closeout

Confirm public page and readiness, certificate validity, analytics collection, fresh tagged
application and operations backups, and all dashboard sources. Record root cause, timeline,
affected data, corrective backlog item and whether
legal notification duties need specialist review. infraegev2-specific Telegram rule/channel
wiring is deliberately deferred; sre-kit's generic Telegram engine already exists, but the
always-on core sends nothing for this target until an operator explicitly configures a channel
and matching rules.

## Lifecycle command contracts

**Production access:** the primary administration contract is public `root@2.26.8.245` with the
protected `root-admin-password`, pinned `known_hosts` and `scripts/production-root-ssh.sh`.
Public-key login and alternate SSH users are not active, and no key-only migration is scheduled.
The adapter accepts the architect-approved 12-character minimum. Longer generated passwords remain
recommended; the architect accepts the increased brute-force and host-compromise risk for the
current operating horizon.
Reaching the VPS's private `10.77.0.0/24` network
(Beszel, Umami and journald gatewayd) still needs the WireGuard tunnel: `make tunnel-up` starts and
verifies it, `make tunnel-down`
stops a tunnel this Makefile started, `make tunnel-status` reports interface/route/handshake state.
Wraps `scripts/wireguard-tunnel.sh`; requires the protected config at
`~/.config/infraege/production/infraege-wsl.conf` (or `$INFRAEGE_WG_CONFIG`) to already exist.

The independent definition is `ops/observability/compose.yml`, always rendered and applied with
project name `infraege-ops`. Callers provide the names listed in
`ops/observability/env.contract` through a protected mode-600 file and pass a full Git SHA as the
release id. `make ops-config ENV_FILE=… RELEASE=…` is local and non-mutating.

`make ops-status` reads only the installed project's Compose status through the pinned production
SSH wrapper. `make ops-install ENV_FILE=… RELEASE=…` uploads the Compose definition, its maintenance
scripts and protected environment, creates the one external ingress network if absent, then runs
`pull` and `up --wait`.
`ops-update` applies another release through the same path; `ops-rollback` reapplies the previous
release. Releases live under `/opt/infraege-ops`, their mode-600 environments under
`/etc/infraege/ops`, and none of these commands reference the application Compose project.


### Practice schema release (Change 114)

Local implementation does not deploy or authorize a production import. Follow the existing
Full + Release gates and, on the first PG18 switch, the Change 113 transfer procedure above.
Set `TASK_FILES_DIR=/var/lib/infraege/task-files` in the protected application environment;
deploy rejects a different production mount. It creates that persistent directory for UID 1000
and mounts it read-only into API/PostgreSQL. It is not a release directory or cleanup artifact.

The candidate must declare `infra/database-schema=114_01`. If the previous release does not
have that same declaration, first prove that exact previous application SHA works against the
new schema/runtime role on an isolated nonempty clone. Store only that verified full SHA in
root-owned mode-600 `/etc/infraege/schema-rollback-compatible-sha`. This is a separate proof
from PG18 binary compatibility; local unit tests do not certify an arbitrary live previous SHA.
Preflight rejects a missing/mismatched proof before changing application containers.

After PostgreSQL is ready, deploy takes a pre-migration application backup, points
`database-current` at the candidate's maintenance scripts and installs the matching timers.
The separate `db-migrate` job uses only migration credentials, applies reviewed Alembic revisions
and registers the generated application material/section identities. Registration preserves
historical identifiers and existing links; incompatible links stop the release before app startup.
API readiness then requires SQL and the exact supported schema, not just an open TCP port.

Rollback remains application-only and never invokes migrations, a DB restore or an old PostgreSQL
service. Failure after new writes needs a forward fix or separately reviewed recovery, not a
return to the stale PG16 volume. The new maintenance code supports both the pre-Alembic and
`114_01` bundle, independently of the application symlink.

Before production acceptance, run the installed backup/restore timers and encrypted export,
verify the shipped task/checker/file smoke and actually copy the export off VPS. The operator
host needs uv plus its frozen API environment for CLI imports/edits; use
[the practice runbook](practice.md), with separate operator credentials and explicit host identity.
The existing lesson bank is not switched merely by this schema release.


Application failure recovery uses a single EXIT boundary after compatibility preflight, including
failures inside Compose helpers and explicit exits. Recovery disables its own traps, retains the
original failure code, starts the previous application without replacing the switched DB, and
verifies readiness for the previous SHA. A rollback failure is reported as requiring manual
recovery; it never recursively retries or restores/downgrades database volumes.
