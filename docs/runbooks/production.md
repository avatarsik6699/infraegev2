# Production bootstrap and deployment

Target: Ubuntu 24.04 VPS in Moscow, 2 EPYC 7502 vCPU, 4 GB RAM, 40 GB NVMe, domain
`infraege.ru`, public IPv4 `2.26.8.245`. The temporary beta access contract deliberately uses
public root/password SSH; keep the provider console open during any access change. Generate and
place every required value using the ordered
[production onboarding guide](production-onboarding.md) before following this summary.

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

For this temporary contract, GitHub Actions receives the same root password through the protected
environment. Remove legacy `PROD_USER` and `PROD_SSH_KEY` after the password deploy succeeds.

Images publish from `main` to GHCR under the full commit SHA. Deploy is manual: run “Deploy
production”, enter that 40-character SHA, approve the environment, and follow the smoke step. The
server runs the deployment as root, keeps the previous release and `scripts/deploy-remote.sh`
rolls back automatically if
readiness or the public page fails.

## Observability ownership

This repository owns the observability target desired state, VPS access, WireGuard/journal
prerequisites, backup/restore and lifecycle automation. Use `ops/opsctl inventory`, `status` or
`plan` for a sanitized read-only view; use `--json` for agents. The foundation has no `apply`
command and therefore cannot mutate production.

`/home/niquetamerewsl/projects/sre-kit` is the first-party sibling for the universal observability
core, adapters, Source configuration, normalization, alerts and monitoring UI. It does not own
infraegev2 deployment automation or target credentials. Beszel and Umami currently remain in the
shared infraegev2 Compose; moving them to a separate infraege-ops project requires a later backup,
rollback and uninterrupted-source migration. Do not recreate the retired `apps/ops` dashboard.

## Capacity and scale-up trigger

Review weekly once real traffic exists. Upgrade before sustained CPU >70%, RAM >75%, disk >70%,
swap activity during normal load, or p95 latency regression persists for 15 minutes. Do not add a
CDN until measurement shows edge caching would solve a real bottleneck.
