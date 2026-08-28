# CHANGE 65 — Observability Telemetry Integrity

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `65` |
| Slug | `observability-telemetry-integrity` |
| Title | Observability Telemetry Integrity |
| Status | `active` |
| Branch | `feature/65-observability-telemetry-integrity` |

---

## Goal

Repair the target-side Beszel container telemetry path and remove the stale manually copied system
identifier from sre-kit reconciliation. Make production acceptance verify actual fresh system and
container records rather than treating a successful empty response as sufficient evidence.

---

## Backlog

### Backend

None.

### Frontend

None.

### Infra

- [x] `I1` Attach the loopback-only Docker socket proxy to a dedicated non-internal bridge while
  keeping the Beszel agent in host-network mode and all write API access disabled — _Depends on:_ —
- [x] `I2` Discover exactly one Beszel system by configured name during Source reconciliation and
  set the linked sre-kit source to require fresh container statistics — _Depends on:_ I1
- [x] `I3` Extend contract and deployment acceptance tests to verify proxy API reachability plus
  real fresh Beszel system/container records — _Depends on:_ I2
- [x] `F1` Keep Beszel discovery on the fixed WireGuard management endpoint without exposing a
  dynamic URL transport to the reconciliation process — _Depends on:_ I2

### Data

None.

### Other

- [x] `T1` Synchronize SPEC, stack/runbook guidance and gotchas with the corrected topology,
  discovery rule and evidence standard — _Depends on:_ I3

---

## Files

### Create / modify

~~~
docs/{SPEC.md,STACK.md,KNOWN_GOTCHAS.md}
docs/runbooks/*
docs/guides/observability/*
docs/changes/65-observability-telemetry-integrity.md
ops/observability/{compose.yml,sre-kit-sources.example.json,remote-deploy.sh,remote-status.sh}
ops/management/*
scripts/tests/*
~~~

### Do NOT touch

- Product application frontend/backend/content
- Production credentials or persistent telemetry data
- sre-kit core/adapters/UI implementation
- Archived changes except this change's own archival during `/ship`

---

## Contracts

See `docs/SPEC.md` §7–§9 and the Files list above.

---

## Gate Checks

In addition to the standard gate, render the operations Compose definition and prove the socket
proxy remains bound only to loopback, is reachable from the host-network agent, exposes required
read endpoints only, and the reconciliation path selects one fresh named Beszel system with
container samples.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-65): restore trustworthy Beszel telemetry
```
