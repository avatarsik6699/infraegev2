# CHANGE 06 — Production Platform

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `06` |
| Slug | `production-platform` |
| Title | Production platform for infraege.ru |
| Status | `active` |
| Branch | `feature/06-production-platform` |

---

## Goal

Prepare `infraege.ru` for a controlled first production deployment before resuming product scope:
immutable images, hardened single-VPS runtime, delivery automation, local-first unified operations
dashboard, analytics, backups, and executable production gates. Real DNS/VPS changes and the first
public deployment require external credentials; legal operator details and RKN notification are an
explicitly accepted deferred risk, not a release blocker for this change.

---

## Backlog

### Backend
- [x] `B1` Add liveness/readiness/version health contracts and dependency-failure tests — _Depends on:_ —
- [x] `B2` Remove Telegram delivery and retain structured request/error logging — _Depends on:_ —
- [x] `B3` Refactor the local ops Node BFF into pragmatic DDD-like core, API, project/dashboard
  modules and injected observability adapters without changing its public routes — _Depends on:_ F2, F3
- [x] `B4` Replace the placeholder traffic series with validated Umami v3 pageview/session data and
  keep every source independently degradable and secret-safe — _Depends on:_ B3

### Frontend
- [x] `F1` Add privacy-minimized Umami tracker and allowlisted learning events — _Depends on:_ I4
- [x] `F2` Build local-first multi-project `apps/ops` BFF and unified Mantine Charts dashboard — _Depends on:_ I4, I5
- [x] `F3` Add source freshness, partial-failure handling, accessible chart summaries and tests — _Depends on:_ F2
- [x] `F4` Remove age marking and replace legal-page placeholders with factual current-state text — _Depends on:_ —
- [x] `F5` Raise the shared muted-text token to WCAG AA contrast found by the new axe gate — _Depends on:_ T1
- [x] `F6` Fix Lighthouse heading/table semantics, missing favicon and production asset compression — _Depends on:_ T1
- [x] `F7` Refactor the ops React client into a pragmatic FSD-like dashboard page with a typed API
  client, abort-safe polling and explicit initial/background failure states — _Depends on:_ B3
- [x] `F8` Add accessible chart/table summaries and lazy-load the heavy chart surface without
  changing the established operations-desk visual direction — _Depends on:_ B4, F7

### Infra
- [x] `I1` Add immutable GHCR production images and resource-bounded Compose overlay — _Depends on:_ B1
- [x] `I2` Add idempotent Ubuntu 24.04 VPS bootstrap, SSH/UFW/swap/WireGuard hardening — _Depends on:_ —
- [x] `I3` Add infraege.ru Nginx/TLS/DNS contract and security/cache headers — _Depends on:_ I1
- [x] `I4` Add pinned Umami and Beszel services with private administration surfaces — _Depends on:_ I1
- [x] `I5` Add journald/fail2ban read-only observability path over WireGuard — _Depends on:_ I2
- [x] `I6` Add local-restic backup, retention, freshness and restore-drill automation — _Depends on:_ I4
- [x] `I7` Add GitHub static/security CI, pinned actions, audits and Dependabot without tests — _Depends on:_ I1
- [x] `I8` Add GHCR publish, manual SSH deploy, smoke verification and automatic rollback — _Depends on:_ I3, I7
- [x] `I9` Add scheduled external availability/TLS probe without alert integrations — _Depends on:_ I3
- [x] `I10` Bootstrap and harden the purchased VPS, establish WireGuard and obtain the initial TLS certificate after the confirmed DNS cutover — _Depends on:_ I2, I3, T4
- [x] `I11` Configure the GitHub `production` environment with verified deploy SSH trust and the chosen feedback/Umami build variables — _Depends on:_ I7, I8, I10
- [x] `I12` Place and render the real production environment, verify pre-release server readiness and record the post-release observability/backup handoff — _Depends on:_ I4, I5, I6, I10, I11
- [x] `I13` Make bootstrap enlarge a provider-created undersized swapfile to the contracted 2 GB and apply it on the VPS — _Depends on:_ I10
- [x] `I14` Make the initial TLS preflight ignore same-host local DNS overrides and require the public A records from independent resolvers — _Depends on:_ I10
- [x] `I15` Persist the successfully deployed immutable SHA into production.env for later backup, renewal and operations commands — _Depends on:_ I8, I12
- [x] `I16` Rotate the transmitted bootstrap root password after deploy-key verification and retain recovery material outside git — _Depends on:_ I10
- [x] `I17` Make the pre-push release target check permit only the initial deployment while retaining fail-closed health verification for later releases — _Depends on:_ I8, I12
- [x] `I18` Fix the local Nginx container healthcheck so the Full Gate reaches a stable healthy state instead of timing out in `nginx -t` — _Depends on:_ I3

### Data
- [x] `D1` Define Umami database bootstrap, analytics/log/metrics retention and deletion jobs — _Depends on:_ I4

### Other
- [x] `T1` Replace Full/Release Gate n/a rows with reproducible security, a11y, performance and image checks — _Depends on:_ I7
- [x] `T2` Add production, incident, backup/restore, DNS/TLS and ops-dashboard runbooks — _Depends on:_ I2, I3, I5, I6, I8
- [x] `T3` Synchronize SPEC/STACK/README/gotchas and record the deferred legal/off-site-backup risks — _Depends on:_ T1, T2
- [x] `T4` Record the purchased VPS/DNS/TLS inputs and add a secret-safe setup guide for GitHub, Umami, WireGuard, Beszel and Restic — _Depends on:_ I2, I3, I4, I5, I6, I8
- [x] `T5` Update the local GitHub CLI and verify the production environment secret/variable commands used by the onboarding guide — _Depends on:_ T4
- [x] `T6` Document and enforce the resulting ops frontend/server boundaries and re-run the complete
  ops Fast Gate plus local browser verification — _Depends on:_ B3, B4, F7, F8
- [x] `T7` Resolve the blocking Semgrep findings from the Full Gate without weakening the security gate — _Depends on:_ T1, I7
- [x] `T8` Make the Release Gate image scan work with Docker Desktop on WSL when the host Docker
  socket is not mounted into the distro — _Depends on:_ T1
- [x] `T9` Align GitHub security jobs with the verified local gate so an initial branch push does
  not depend on an unreachable pre-push commit and pip-audit excludes the editable project — _Depends on:_ I7, T7
- [x] `T10` Let a failed initial CI attempt be replaced before the first successful production
  deploy while preserving fail-closed health checks after deployment — _Depends on:_ I8, I17, T9

---

## Files

### Create / modify
~~~
apps/api/app/modules/health/
apps/api/app/core/
apps/api/tests/
apps/web/src/features/ apps/web/src/pages/ apps/web/src/widgets/
apps/ops/
infra/ ops/ scripts/
.github/workflows/ .github/dependabot.yml
docs/SPEC.md docs/STACK.md docs/KNOWN_GOTCHAS.md README.md docs/runbooks/
package.json pnpm-lock.yaml pnpm-workspace.yaml
~~~

### Do NOT touch
- `content/` product material
- `docs/changes/archive/`
- `TEMP.md` (input only; do not commit or delete)
- old remote repository `avatarsik6699/infraege`

---

## Contracts

See `docs/SPEC.md` §3–§8 and the Files list above. Do not hand-copy the schema, endpoints, types,
or env vars into this file — the codebase and `SPEC.md` are the source of truth.

---

## Gate Checks

Production integrations must provide offline/render validation where credentials are unavailable.
Vitest, pytest and Playwright remain local-only and must never be added to GitHub Actions.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Beszel 0.18.7 performs its own tiered cleanup and retains its coarsest historical series for
  30 days. Extending this to the planned 90 days would require a fork or a second metrics store,
  so the lightweight MVP keeps the upstream 30-day behavior and documents the limitation.
- The reviewer-gated GitHub `production` environment now contains the four deploy secrets plus the
  chosen feedback and Umami build variables. Their values remain outside git.
- Initial Restic storage is same-host and is not disaster recovery. Off-site encrypted storage is
  a documented prerequisite before irreplaceable user data appears.
- The purchased VPS `2.26.8.245` is bootstrapped and hardened: public DNS is cut over, deploy SSH
  trust is pinned, root/password SSH is disabled, UFW/fail2ban/Docker/2 GB swap/WireGuard are
  active, and the initial Let's Encrypt certificate expires on 2026-11-08.
- The Ubuntu Jammy `gh` 2.4.0 package lacked Actions variable commands, so the operator workstation
  uses the checksum-verified official `gh` 2.97.0 binary from `~/.local/bin`; authentication and
  environment secret/variable reads were re-verified after the update.
- The real production env and Restic password are mode `600` on the VPS and have a protected local
  recovery copy outside git; production Compose renders successfully. After the release lands,
  complete Umami/Beszel first-user setup, replace the temporary Beszel agent pair, activate the
  local WireGuard client, configure the certificate renewal hook and install/verify backup timers.
- The transmitted bootstrap root password was rotated after the deploy key succeeded. Root and
  password SSH remain disabled; the replacement recovery credential is stored only in the local
  protected production directory outside git.
- Trivy's non-root Dockerfile check is scoped out only for `infra/nginx/Dockerfile` until
  2027-08-10: the root master binds 80/443, reads the root-owned TLS key and supports graceful
  reloads, while `nginx.conf` explicitly drops request-handling workers to the `nginx` user.
- The image gate scans `docker image save` archives so Docker Desktop on WSL needs no distro-local
  socket. The web runtime intentionally omits unused npm tooling, and the Nginx image upgrades its
  Alpine packages during the immutable build so fixed base-image CVEs cannot pass the release.
- The initial GitHub push cannot provide a reachable previous remote commit to a range-based
  Gitleaks action, so CI uses the same digest-pinned filesystem scan as the local gate. Its Python
  audit likewise excludes the editable project and audits only the exported locked dependencies.
- Initial-release recovery is keyed to the absence of a successful deploy workflow, not to the
  existence of remote `main`; once any deploy succeeds, an unavailable public health endpoint
  blocks every later release exactly as before.

---

## Commit Message

```
feat(change-06): prepare infraege.ru production platform
```
