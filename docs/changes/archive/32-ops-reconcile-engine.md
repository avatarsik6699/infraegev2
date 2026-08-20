# CHANGE 32 — Ops Reconcile Engine

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `32` |
| Slug | `ops-reconcile-engine` |
| Title | Ops Reconcile Engine |
| Status | `archived` |
| Branch | `feature/32-ops-reconcile-engine` |

---

## Goal

Implement the transactional core of `opsctl apply` against an explicit local sandbox executor.
Prove plan binding, locking, checkpoint-before-effect, atomic revision publication, sanitized
outbox, idempotency and rollback before any mutating SSH/Compose/systemd transport is introduced.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Add a canonical plan fingerprint and saved-plan validation that binds desired state and inventory to an apply attempt and rejects stale, modified, blocked or destructive plans by default — _Depends on:_ —
- [x] `I2` Extract reconcile execution behind an executor boundary and implement only an explicit sandbox-state executor; invocation without `--sandbox-root` must fail closed and production SSH must remain read-only — _Depends on:_ I1
- [x] `I3` Implement one exclusive lock, checkpoint-before-effect, atomic revision publication and deterministic idempotent replay under the sandbox state root — _Depends on:_ I2
- [x] `I4` Implement rollback on partial failure plus schema-validated sanitized success/failure outbox records without environment values or raw exception/command output — _Depends on:_ I3

### Data

- [x] `D1` Extend versioned plan/checkpoint/outbox contracts and add revision/apply-result schemas and fixtures without changing schema version 1 semantics for existing readers — _Depends on:_ I1, I3, I4

### Other

- [x] `T1` Add focused tests for stale-plan rejection, explicit sandbox selection, lock contention, checkpoint ordering, no-op replay, injected partial failure rollback, atomic files and redaction — _Depends on:_ I4, D1
- [x] `T2` Synchronize STACK, README and production/incident runbooks so sandbox apply cannot be mistaken for production authorization; document the separate mutating-transport and cutover changes — _Depends on:_ T1

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
README.md
docs/changes/32-ops-reconcile-engine.md
docs/runbooks/production.md
docs/runbooks/incident-response.md
ops/opsctl
ops/observability/opsctl.py
ops/observability/apply-contract.json
ops/observability/schemas/**
ops/observability/fixtures/**
scripts/tests/opsctl-apply.test.sh
Makefile
~~~

### Do NOT touch

- production VPS, protected credentials, SSH authentication or existing remote collector behavior
- application or operations Compose files, systemd units, volumes, databases and backup contents
- `apps/web/**`, `apps/api/**`, public API/content contracts or sre-kit source
- mutating SSH/Compose/systemd executor, production apply flag or Umami/Beszel cutover

---

## Contracts

See `docs/SPEC.md` §7.3 and §8 and the Files list above.

---

## Gate Checks

The Critical Gate is shell/Python/documentation scoped. Tests must use disposable directories and
prove no network/SSH command is invoked by apply. No production command, Compose lifecycle, Full
Gate or remote mutation is part of this change.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Production execution remains intentionally impossible: `apply` has no SSH executor and rejects
  existing non-empty state roots unless they carry the exact sandbox marker.
- `INFRAEGE_OPS_TEST_FAIL_AFTER` is a sandbox-only failure-injection seam used to prove rollback;
  its value is never persisted or emitted.

---

## Commit Message

```
feat(change-32): add transactional ops reconcile engine
```
