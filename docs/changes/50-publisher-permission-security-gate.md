# CHANGE 50 — Publisher Permission Security Gate

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `50` |
| Slug | `publisher-permission-security-gate` |
| Title | Publisher Permission Security Gate |
| Status | `active` |
| Branch | `feature/50-publisher-permission-security-gate` |

---

## Goal

Unblock the coordinated infraegev2/sre-kit release without weakening the security gate: preserve
the publisher cursor directory's owner-only `0700` contract in a Semgrep-safe expression and prove
the effective filesystem mode with a focused regression test.

---

## Backlog

### Backend
None

### Frontend
None

### Infra
- [x] `I1` Express cursor-directory hardening through the existing named owner-only permission constant so Semgrep no longer misclassifies the secure mode, while retaining correction of a pre-existing permissive directory — _Depends on:_ —

### Data
None

### Other
- [x] `T1` Add focused regression coverage proving cursor persistence narrows the state directory to `0700`, then run the affected Critical Gate and the exact Semgrep scan that blocked release — _Depends on:_ I1

---

## Files

### Create / modify
~~~
docs/changes/50-publisher-permission-security-gate.md
ops/observability/push-nginx-traffic.py
scripts/tests/traffic_telemetry_test.py
~~~

### Do NOT touch
- Security scanner configuration, ignore files, inline suppressions or gate thresholds
- Publisher ingestion, cursor/idempotency behavior, credentials or local systemd lifecycle
- Production state, sibling sre-kit files or any public analytics/legal surface

---

## Contracts

See `docs/SPEC.md` §3–§4 and the Files list above.

---

## Gate Checks

In addition to the affected Critical Gate, run Semgrep 1.172.0 `p/default` against the changed
publisher file and require zero blocking findings. Do not run the Full or Release Gate from
`/work`.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
fix(analytics): preserve private publisher state permissions
```
