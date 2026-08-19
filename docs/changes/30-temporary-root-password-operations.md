# CHANGE 30 — Temporary Root Password Operations

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `30` |
| Slug | `temporary-root-password-operations` |
| Title | Temporary Root Password Operations |
| Status | `active` |
| Branch | `feature/30-temporary-root-password-operations` |

---

## Goal

Finish the current production-operations pass while temporarily simplifying VPS administration to
one public `root` login with password authentication. Preserve host-key pinning, UFW, fail2ban,
GitHub environment approval, deploy rollback, backups, restore proof and private WireGuard services;
retire the live `operator`, `deploy` and `ops-reader` identities only after their duties work as root.

---

## Backlog

### Backend
None

### Frontend
None

### Infra
- [x] `I1` Add a fail-closed temporary root/password SSH access profile and migration/preflight tooling that validates `sshd`, keeps a recovery session available, and never prints or accepts a committed password — _Depends on:_ —
- [x] `I2` Convert GitHub and local production deployment to pinned-host root/password authentication without a password process argument, retaining immutable-SHA validation, smoke and rollback — _Depends on:_ I1
- [x] `I3` Move host production ownership plus backup, restore and analytics-retention services from `deploy` to `root`, and separate the WireGuard journal gateway from the retired ops-reader setup — _Depends on:_ I1
- [x] `I4` Retire the active key-only operator/deploy/ops-reader provisioning contract, adapt remaining maintenance helpers, and add a guarded account-retirement step that targets only those three identities after root proofs pass — _Depends on:_ I2, I3
- [x] `I5` Migrate the live VPS in one recovery-backed window: rotate root password, verify a second password session, install the new runtime contract, switch sre-kit SSH sources, retire the three identities and infraege-specific keys, and prove deploy/backup/restore/observability/public health — _Depends on:_ I1, I2, I3, I4
- [x] `I6` Remove the orphaned `ops-local.test.sh` that still invokes the Change 19-retired `scripts/ops-local.sh`; retain the active standalone WireGuard tunnel contract — _Depends on:_ —
- [x] `I7` Repair the live Certbot renewal contract from port-conflicting `standalone` to the existing Nginx-served webroot and prove a no-downtime staging renewal with the reload hook — _Depends on:_ —
- [x] `I8` Establish `sre-kit` as the first-party sibling repository that owns the observability core and its deployment: document the cross-repository boundary in both projects, require coordinated Backlog changes when observability work crosses that boundary, and align the existing infraege host contract without reviving `apps/ops` — _Depends on:_ I5

### Data
None

### Other
- [x] `T1` Synchronize SPEC, STACK, production/incident/backup runbooks and tests with the explicit temporary beta-risk, current GitHub secrets and future key-only restoration boundary — _Depends on:_ I1, I2, I3, I4

---

## Files

### Create / modify
~~~
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
docs/runbooks/production.md
docs/runbooks/production-onboarding.md
docs/runbooks/backup-restore.md
docs/runbooks/incident-response.md
.github/workflows/deploy.yml
/home/niquetamerewsl/projects/sre-kit/docs/*
ops/bootstrap-vps.sh
ops/sshd/*
ops/systemd/*
ops/setup-*.sh
scripts/deploy-remote.sh
scripts/configure-beszel-agent.sh
scripts/repair-beszel-env.sh
scripts/tests/*
docs/changes/30-temporary-root-password-operations.md
~~~

### Do NOT touch
- Product API, database schema/content, frontend application code, public routes or design system
- `docs/changes/archive/**`
- Personal SSH keys, WireGuard keys, application/database credentials or unrelated host accounts
- Off-site backup, Telegram alerts or `main` branch protection

---

## Contracts

See `docs/SPEC.md` §7–§8 and the Files list above. No product API/schema/type contract changes.

---

## Gate Checks

In addition to the repository Critical Gate, focused verification must cover shell tests, workflow
syntax/security, `sshd -t`/`sshd -T`, wrong-password rejection, old-key rejection, exact account
scope, GitHub deploy of the merged SHA, fresh backup, `restic check --read-data`, disposable restore,
sre-kit SSH sources, timers, TLS, public `/` and `/health/ready`.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Change 21's archived `I3` remains historically unchecked, but the 2026-08-19 live wrapper and
  sudoers checksums matched the repository exactly; Change 30 does not rewrite archived history.
- The architect explicitly accepted public root/password SSH, GitHub-held root credentials,
  deletion of `operator`/`deploy`/`ops-reader`, and no automatic expiry until a later command.
- The live VPS migration proved an independent password session, exact-SHA deploy, backup with
  `restic check --read-data`, disposable restore, sre-kit SSH adapters, Certbot webroot dry-run,
  timers and public health. The external GitHub uptime probe also passed.
- The new GitHub password-deploy workflow cannot be dispatched until this branch reaches `main`;
  `/ship 30 --release` must perform that final merged-SHA proof. The same upload and remote deploy
  path was exercised directly against the current production SHA during migration.
- The server WireGuard interface and journal gateway were verified active. A fresh local
  `make tunnel-up` smoke was not repeated because WSL sudo required an interactive terminal;
  existing WireGuard keys and configuration were deliberately preserved.

---

## Commit Message

```
chore(change-30): simplify temporary production administration
```
