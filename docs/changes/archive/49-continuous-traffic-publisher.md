# CHANGE 49 — Continuous Traffic Publisher

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `49` |
| Slug | `continuous-traffic-publisher` |
| Title | Continuous Traffic Publisher |
| Status | `archived` |
| Branch | `feature/49-continuous-traffic-publisher` |

---

## Goal

Turn the proven one-shot Nginx aggregate batch into a reliable local publisher that runs only
inside the operator's explicit `sre-kit-local` session. Preserve the repository boundary: this
repository owns journal parsing, privacy reduction and lifecycle; sre-kit remains an unchanged
ingestion/dashboard core.

---

## Backlog

### Backend
None

### Frontend
None

### Infra
- [x] `I1` Extract the privacy-safe aggregation module and add a bounded journal-gateway publisher that parses Nginx combined records in memory, persists only an opaque cursor, retries with a stable idempotency key, validates loopback endpoints and protected token/state files, and never emits raw identifiers — _Depends on:_ —
- [x] `I2` Add repository-owned user-unit templates, installer and canonical `sre-kit-local` CLI integration so the publisher timer starts after tunnel/core, stops before them, remains disabled outside explicit sessions and exposes bounded status/logs — _Depends on:_ I1
- [x] `I3` Install the local integration using the existing protected push credential, prove restart-safe cursor progress and at least two real delivery cycles against the active seven-Source dashboard, and leave the manually started session healthy without changing the VPS — _Depends on:_ I2
- [x] `I4` Bound malformed request targets and common vulnerability-probe paths into low-cardinality `__invalid_path__`/`__probe__` labels classified as suspected automation, while preserving exact clean product paths — _Depends on:_ I1

### Data
None

### Other
- [x] `T1` Update STACK/runbook/gotcha contracts and focused tests for parsing, identifier removal, empty windows, HTTP failure, duplicate retry, cursor persistence and manual lifecycle composition — _Depends on:_ I1, I2

---

## Files

### Create / modify
~~~
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
docs/runbooks/analytics.md
docs/changes/49-continuous-traffic-publisher.md
ops/observability/traffic_telemetry.py
ops/observability/build-traffic-telemetry.py
ops/observability/push-nginx-traffic.py
ops/observability/install-sre-kit-local.sh
ops/observability/sre-kit-local.sh
ops/systemd/infraege-sre-kit-traffic.service.in
ops/systemd/infraege-sre-kit-traffic.timer
scripts/tests/traffic_telemetry_test.py
scripts/tests/sre-kit-local-lifecycle.test.sh
~~~

### Do NOT touch
- Production Nginx/Compose/systemd state, application deployment or VPS data
- sre-kit source code, database schema, API or dashboard implementation
- Browser analytics consent, product-event allowlist, lesson content or legal identity details
- Checked-in secrets, raw access logs, IP addresses or persistent visitor identifiers

---

## Contracts

See `docs/SPEC.md` §3–§4 and §7–§8 and the Files list above.

---

## Gate Checks

In addition to the affected Critical Gate, run the focused Python and shell lifecycle tests. Live
activation may read the existing private journal gateway and local sre-kit API but must not mutate
the VPS.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The development runtime retains pre-I4 bootstrap series with exact scanner paths until its next
  authorized reset or normal retention; every new publisher cycle uses bounded labels.

---

## Commit Message

```
feat(analytics): automate privacy-safe traffic delivery
```
