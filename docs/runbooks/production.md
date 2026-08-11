# Production bootstrap and deployment

Target: Ubuntu 24.04 VPS in Moscow, 2 EPYC 7502 vCPU, 4 GB RAM, 40 GB NVMe, domain
`infraege.ru`, public IPv4 `2.26.8.245`. Commands that alter the server are intentionally not run
from a developer machine. Generate and place every required value using the ordered
[production onboarding guide](production-onboarding.md) before following this summary.

## One-time bootstrap

1. In REG.RU replace the existing `A` records for `@` and `www` with `2.26.8.245`, TTL 300 during
   setup. Keep `ns1.reg.ru` and `ns2.reg.ru` as the authoritative nameservers.
2. Upload a release checkout to the server, keep the provider console open, then as root run:

   ```bash
   ADMIN_SSH_PUBLIC_KEY='<deploy public key>' ops/bootstrap-vps.sh
   ```

3. Verify a second SSH session works before closing the root session. Install an adapted
   `ops/wireguard/wg0.conf.example` as `/etc/wireguard/wg0.conf`, then enable `wg-quick@wg0`.
4. Create `/etc/infraege/production.env` from `infra/.env.example` with mode `600`. Generate every
   password independently. Create `/etc/infraege/restic-password`, also mode `600`.
5. Once both DNS records resolve to the VPS, obtain TLS:

   ```bash
   PUBLIC_IPV4=2.26.8.245 TLS_EMAIL=vlad-god500@mail.ru \
     ops/obtain-initial-certificate.sh
   ```

6. Run the first deployment from GitHub Actions, then configure renewal, read-only ops access and
   timers on the server:

   ```bash
   ops/configure-certificate-renewal.sh
   OPS_READER_SSH_PUBLIC_KEY='<ops key>' WIREGUARD_IP=10.77.0.1 ops/setup-ops-access.sh
   ops/install-backup-timers.sh
   ```

7. Provision a distinct human administrator after verifying the operator public key through the
   protected local recovery copy. The account uses key-only SSH and password-protected sudo;
   `deploy` remains non-sudo and direct root SSH remains disabled:

   ```bash
   ssh -i ~/.ssh/id_ed25519 operator@2.26.8.245
   sudo -i
   ```

   The current operator sudo recovery value is mode `600` at
   `~/.config/infraege/production/operator-sudo-password`. It is not an SSH password because
   password and keyboard-interactive SSH remain disabled. Rotate it from an authenticated operator
   session with `sudo passwd operator`; do not put it in shell history, git, chat or GitHub.

## GitHub production settings

Environment `production` requires reviewer approval. Set secrets `PROD_HOST`, `PROD_USER`,
`PROD_SSH_KEY`, `PROD_SSH_HOST_KEY`; set variables `VITE_FEEDBACK_URL` and
`VITE_UMAMI_WEBSITE_ID`. The host key must be the exact `known_hosts` line obtained through a
trusted channel, never `StrictHostKeyChecking=no`.

For this VPS, `PROD_HOST=2.26.8.245` and `PROD_USER=deploy`. Do not use the bootstrap `root`
account or its password in GitHub.

Images publish from `main` to GHCR under the full commit SHA. Deploy is manual: run “Deploy
production”, enter that 40-character SHA, approve the environment, and follow the smoke step. The
server keeps the previous release and `scripts/deploy-remote.sh` rolls back automatically if
readiness or the public page fails.

## Capacity and scale-up trigger

Review weekly once real traffic exists. Upgrade before sustained CPU >70%, RAM >75%, disk >70%,
swap activity during normal load, or p95 latency regression persists for 15 minutes. Do not add a
CDN until measurement shows edge caching would solve a real bottleneck.
