# Production values and secret onboarding

This runbook turns provider values into the inputs expected by the production scripts and GitHub
workflows. The primary contract uses public root/password SSH; no key-only migration is scheduled.
Generate secrets on the administration laptop or provider console; never
paste passwords or `/etc/infraege/production.env` into the repository or chat.

Operations onboarding prepares a separate mode-600 env file and validates it with
`make ops-config ENV_FILE=... RELEASE=<full-sha>`. The split stack is active: use `ops-update` for
the installed project and `ops-install` only for a genuinely new target.

## Confirmed non-secret inputs

| Input | Value |
|-------|-------|
| Domain | `infraege.ru` |
| VPS IPv4 | `2.26.8.245` |
| Bootstrap/runtime/deploy login | `root` with password authentication (primary accepted contract) |
| Authoritative DNS | `ns1.reg.ru`, `ns2.reg.ru` |
| Required A records | `@ -> 2.26.8.245`, `www -> 2.26.8.245` |
| TLS contact | `vlad-god500@mail.ru` |
| Feedback link | `https://t.me/+dElnKYPKGd81OGYy` |
| WireGuard server address | `10.77.0.1/24` |
| Initial laptop address | `10.77.0.2/32` |

The previous recovery password has been transmitted through chat and must not be reused. Generate a
new unique value, store it in `~/.config/infraege/production/root-admin-password` with mode `600`,
and add the same value to the reviewer-protected GitHub Environment. Keep the provider console and
old session open until a second password-only root session succeeds with the pinned host key.

## 1. Create and verify the primary root credential

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

## 2. Fill the GitHub `production` environment

The environment already exists. In the repository UI open **Settings -> Environments ->
production**. Use environment secrets, not repository files. GitHub only releases these values to
jobs that reference this environment, after its reviewer rule passes.

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
both a fresh wrapper session and a reviewer-approved deploy. If only the VPS/local copy changes,
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

## 3. Create WireGuard keys and configuration

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

## 4. Generate application and Restic secrets

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
# Edit every placeholder now, then validate:
scripts/render-production-config.sh /etc/infraege/production.env >/dev/null
```

Restic has no provider-issued key. Generate one more long random passphrase, store it in a password
manager, and write only that passphrase plus a trailing newline to
`/etc/infraege/restic-password` with mode `600`. Application and operations jobs share this
encrypted repository but select snapshots through separate tags; the first successful backup
initializes it. Losing this password makes the repository unrecoverable; same-host Restic is still
not disaster recovery. See the
[official Restic repository guide](https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html).

## 5. Create the Umami website ID and dashboard account

`VITE_UMAMI_WEBSITE_ID` is neither the Umami login nor `APP_SECRET`. It is the website record UUID
embedded in the public tracker. Before publishing images, generate it on the laptop:

```bash
uuidgen
```

Set that UUID as the GitHub environment variable from section 2. After the clean operations stack starts,
connect WireGuard and open `http://10.77.0.1:3001`. Log in with the one-time default
`admin` / `umami` credentials and change the password immediately. The current single-operator
local setup has explicitly accepted deferring that rotation while the administration surface is
WireGuard-only; rotate it before hosting ops remotely, sharing access or adding users. Create a website named
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

## 6. Obtain Beszel `TOKEN`, `KEY` and system ID

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
4. Complete **Add System**, then copy the resulting system record ID into the tracked non-secret
   `ops/observability/sre-kit-sources.example.json` `beszel-api.system_id` field. For the current
   target, linked sre-kit Change 20 already verified the resulting Source; a replacement target
   must repeat that proof through sre-kit's supported API/UI contracts.

The Beszel public key normally contains a space. It is valid Compose env input; operations
maintenance scripts must pass this file through `docker compose --env-file` and must never
`source` it as shell code.

The current Beszel flow and meanings of `KEY`, `TOKEN` and `HUB_URL` are documented in its
[getting-started](https://beszel.dev/guide/getting-started) and
[agent-installation](https://www.beszel.dev/guide/agent-installation) guides.

Create a separate read-only Beszel user, share only this system with it, and register it as a
`beszel-api` source in sre-kit — credentials are stored only there, never in this repository.
