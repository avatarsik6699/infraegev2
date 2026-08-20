# CHANGE 34 — Read-only Remote Preflight

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `34` |
| Slug | `read-only-remote-preflight` |
| Title | Read-only Remote Preflight |
| Status | `archived` |
| Branch | `feature/34-read-only-remote-preflight` |

---

## Goal

Add a deterministic, sanitized and strictly read-only VPS preflight bound to the immutable
operations bundle. It may prove readiness for migration planning, but can never authorize or
perform production changes.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Add a versioned preflight contract bound to installation id and bundle id, with explicit readiness, authorization=false, summary and closed check records — _Depends on:_ —
- [x] `I2` Add a fixed remote collector that emits only allowlisted sanitized records for host tools, WireGuard, Compose ownership, target paths, backup freshness and restore proof without mutating VPS state — _Depends on:_ I1
- [x] `I3` Add `opsctl preflight --bundle-manifest ... [--json]` using pinned SSH or an explicit test fixture, validating every remote record and failing closed without exposing raw SSH output — _Depends on:_ I1, I2
- [x] `I4` Add `make ops-preflight BUNDLE=...` and document that the report is evidence only and never apply authorization — _Depends on:_ I3

### Data

- [x] `D1` Add the JSON schema and safe healthy/blocked fixtures for the preflight report/collector boundary — _Depends on:_ I1

### Other

- [x] `T1` Add focused tests for deterministic healthy and blocked reports, malformed/unknown records, SSH failure, secret rejection and static non-mutation of the collector — _Depends on:_ I2, I3, D1
- [x] `T2` Synchronize STACK, README, production/onboarding and backup/restore runbooks with the preflight workflow and exclusions — _Depends on:_ I4, T1

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
README.md
docs/changes/34-read-only-remote-preflight.md
docs/runbooks/production.md
docs/runbooks/production-onboarding.md
docs/runbooks/backup-restore.md
ops/observability/opsctl.py
ops/observability/remote-preflight.sh
ops/observability/schemas/preflight.schema.json
ops/observability/fixtures/preflight-healthy.tsv
ops/observability/fixtures/preflight-blocked.tsv
scripts/tests/ops-preflight.test.sh
Makefile
~~~

### Do NOT touch

- production VPS, protected environment files, credentials, databases, volumes or containers
- application or operations Compose definitions, data migration, cutover and rollback execution
- production executor or remote upload path
- `apps/web/**`, `apps/api/**` and sre-kit source

---

## Contracts

See `docs/SPEC.md` §7.3 and §8 and the Files list above.

---

## Gate Checks

The Critical Gate is shell/Python/documentation scoped. Remote behavior is tested through explicit
fixtures and an unavailable-wrapper path; do not contact or mutate production.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes


---

## Commit Message

```
feat(change-34): add read-only remote preflight
```
