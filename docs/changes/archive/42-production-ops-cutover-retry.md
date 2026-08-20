# CHANGE 42 — Production Operations Cutover Retry Gate

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `42` |
| Slug | `production-ops-cutover-retry` |
| Title | Production Operations Cutover Retry Gate |
| Status | `archived` |
| Branch | `feature/42-production-ops-cutover-retry` |

---

## Goal

Execute the authorized retry with the dual-network Beszel fix, enforce fail-closed acceptance and
publish any release defect exposed by live evidence. Preserve both volume sets and leave a minimal
immutable candidate for a subsequent final retry; sre-kit remains outside target lifecycle.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Re-run a secret-safe production preflight for exact release `e62f179d0b11b64b860f2da4a4e2bbef2fd37412`: protected env permissions and render, three immutable images, current and rollback application SHAs, backup freshness, disk headroom, legacy services, preserved new volumes and network state — _Depends on:_ —
- [x] `I2` Record the architect's explicit authorization for this corrected live retry after I1 has no unresolved blocker — _Depends on:_ I1
- [x] `I3` Stop only legacy observability services, deploy the exact approved application release, update the preserved independent operations project and activate operations maintenance timers — _Depends on:_ I2
- [x] `I4` Bootstrap a least-privilege Beszel operator, derive valid Agent credentials without exposing them, atomically update the protected operations env, reapply the same release and prove Hub/Agent registration — _Depends on:_ I3
- [x] `I5` Prove exact public application health, same-origin Umami collector behavior, absence of a public operations UI, private Umami/Beszel reachability, all operations containers, timer state and fresh backup/restore results; fail closed to the documented rollback on any blocking acceptance failure — _Depends on:_ I4
- [x] `I6` Synchronize SPEC, stack and operations runbooks with sanitized live evidence and the verified steady state — _Depends on:_ I5
- [x] `I7` Remove shell-sourcing of the Compose operations env from the backup path and add a regression case for a valid Beszel public key containing spaces, which the second live retry exposed — _Depends on:_ I3

### Data

- [x] `D1` Preserve legacy observability volumes unchanged and reuse only the already-created clean operations volumes; do not copy, restore, rename, prune or delete either set — _Depends on:_ I3

### Other

- [x] ~~`T1` Prepare the secret-free target endpoint and identifier handoff for the subsequent independent sre-kit Source-registration change~~ — moved after the final retry because production remains on the legacy topology

---

## Files

### Create / modify

~~~
docs/changes/42-production-ops-cutover-retry.md
docs/SPEC.md
docs/STACK.md
docs/runbooks/production.md
docs/runbooks/production-onboarding.md
docs/runbooks/backup-restore.md
docs/runbooks/incident-response.md
ops/observability/backup.sh
scripts/tests/ops-backup-restore.test.sh
~~~

### Do NOT touch

- Application, operations or sre-kit source/configuration unless a live finding is first appended to this Backlog
- `.github/workflows/**`, `apps/web/**`, `apps/api/**` or `/home/niquetamerewsl/projects/sre-kit/**`
- Legacy or new Docker volumes through copy, restore, rename, prune or deletion
- SSH, UFW, fail2ban, WireGuard or provider-console configuration
- Protected environment, SSH, Restic or adapter credential values in git, logs or chat
- Archived change documents

---

## Contracts

See `docs/SPEC.md` §7–§8, `docs/runbooks/production.md` and the Files list above. The exact release
is immutable, lifecycle ownership remains in infraegev2, and Source registration remains a later
sre-kit-owned operation.

---

## Gate Checks

This change performs an explicitly authorized production mutation after I1 passes. Follow the
runbook in order and fail closed: disable the new timers, stop the operations project without
volumes and restore the recorded application rollback SHA if a blocking acceptance check fails.
All evidence must remain sanitized.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Preflight confirmed all five local protected files are user-owned mode 600, the operations
  definition renders, all three exact-SHA images are available, root disk use is 25%, and the
  application backup status is successful with a 2026-08-20 02:19:44 UTC marker. Production is
  healthy on rollback SHA `eb70fbb517c05455f6ca7398f544947934a22707`; all four legacy services
  run, all three clean operations volumes and the shared network are preserved, no new operations
  container runs and all three operations timers are inactive. The architect explicitly authorized
  creation, configuration and execution of the corrected retry in this session.
- The corrected stack and Beszel registration passed, but the first manual operations backup
  failed because the valid space-containing Beszel public key was accepted by Compose while the
  backup script sourced the whole env as shell. Fail-closed rollback restored the previous
  application and all legacy services without deleting either volume set. The backup needs only
  Compose's `--env-file`, so shell-sourcing unrelated secrets is removed rather than imposing a
  second, shell-specific env grammar.

---

## Commit Message

```
chore(change-42): complete production operations cutover
```
