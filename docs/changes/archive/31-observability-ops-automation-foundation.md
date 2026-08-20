# CHANGE 31 — Observability Ops Automation Foundation

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `31` |
| Slug | `observability-ops-automation-foundation` |
| Title | Observability Ops Automation Foundation |
| Status | `archived` |
| Branch | `feature/31-observability-ops-automation-foundation` |

---

## Goal

Create an infraegev2-owned, agent-friendly `opsctl` foundation for inventory, non-mutating plan
and status of the current observability stack. Reuse the repository's protected SSH and existing
Compose/systemd scripts, keep production unchanged, and establish the boundary needed for a later
independent `infraege-ops` stack and sre-kit telemetry integration.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Define a versioned secret-free desired-state manifest for the current Umami, Beszel, journald/fail2ban, backup and private-network components; keep application web/api/Postgres outside the managed set — _Depends on:_ —
- [x] `I2` Add `opsctl inventory` and `status` with human and `--json` output, using read-only pinned SSH checks and never printing environment values, credentials or raw command output — _Depends on:_ I1
- [x] `I3` Add `opsctl plan` that compares the desired manifest with sanitized inventory and reports create/change/no-op/destructive effects without mutating local or remote state — _Depends on:_ I1, I2
- [x] `I4` Define the future apply boundary: stable remote state/revision paths, one remote lock, checkpoint and sanitized outbox contracts; do not implement target mutations or production cutover in this change — _Depends on:_ I3

### Data

- [x] `D1` Add schemas and fixture-based validation for desired state, inventory, plan, status, checkpoints and outbox records; reject unknown schema versions and secret-bearing fields — _Depends on:_ I1

### Other

- [x] `T1` Add focused shell tests proving JSON stability, redaction, read-only plan behavior, drift classification and SSH failure handling — _Depends on:_ I2, I3, D1
- [x] `T2` Synchronize SPEC, STACK, README and production/onboarding/backup/incident runbooks with infraegev2 ownership, the monitoring-only sre-kit boundary and deferred independent-stack migration — _Depends on:_ I4, T1

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
README.md
docs/changes/31-observability-ops-automation-foundation.md
docs/runbooks/production.md
docs/runbooks/production-onboarding.md
docs/runbooks/backup-restore.md
docs/runbooks/incident-response.md
ops/opsctl
ops/observability/**
scripts/lib/production-ssh.sh
scripts/tests/opsctl.test.sh
Makefile
~~~

### Do NOT touch

- `apps/web/**`, `apps/api/**`, lesson/content contracts or public product routes
- current production Compose ownership, containers, volumes, credentials or VPS configuration
- Umami/Beszel data migration, independent Compose project or production cutover
- sre-kit source files, deployment actions or a replacement local dashboard
- application deployment workflow except read-only integration needed by inventory

---

## Contracts

See `docs/SPEC.md` §7.1–§7.3 and §8 and the Files list above.

---

## Gate Checks

The Critical Gate is documentation/shell scoped. Focused tests must prove `inventory`, `status` and
`plan` are non-mutating, deterministic and secret-free under healthy, drifted and unreachable SSH
fixtures. No production command or Full Gate is part of this change.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The old `apps/ops` dashboard remains intentionally deleted. `ops/opsctl` owns automation while
  sre-kit remains a monitoring core.
- The current shared Compose/Postgres/backup coupling is inventoried but not changed here. Its
  migration requires a later change with disposable restore and independent rollback evidence.
- `opsctl` uses the protected pinned-host SSH wrapper and a fixed read-only remote collector. SSH
  stderr and malformed collector records collapse to a stable `ssh_unreachable` contract instead
  of being forwarded to agents.
- ShellCheck was unavailable in the environment. Bash syntax, the no-mutation command allowlist,
  fixture behavior, Ruff, Pyright, repository formatting and diff whitespace were verified.

---

## Commit Message

```
feat(change-31): add observability opsctl foundation
```
