# CHANGE 53 — sre-kit management VPS integration

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `53` |
| Slug | `sre-kit-management-vps-integration` |
| Title | sre-kit management VPS integration |
| Status | `active` |
| Branch | `feature/53-sre-kit-management-vps-integration` |

---

## Goal

Connect the generic sre-kit Change 26 distribution to infraegev2 from an independent always-on
management VPS without mutating the application/operations lifecycle or the unrelated services
already running on that host. Create a clean Project and seven human-readable Sources, preserve
privacy-safe traffic reduction and keep local dogfood data untouched as fallback.

---

## Backlog

### Backend
None.

### Frontend
None.

### Infra
- [x] `I1` Add a secret-safe, idempotent management-VPS SSH wrapper/bootstrap contract with pinned host fingerprint, protected env validation, UFW SSH/80/443 rules and coexistence checks for existing Firecrawl/SearXNG services — _Depends on:_ —
- [x] `I2` Provision a distinct WireGuard peer `10.77.0.3/32`, persist both server/client configuration atomically and prove only `10.77.0.1/32` routes through it while preserving workstation peer `10.77.0.2/32` — _Depends on:_ I1
- [x] `I3` Install the exact linked sre-kit release, initialize its admin password via stdin and configure `sre.infraege.ru` without copying local SQLite/secrets/history — _Depends on:_ I1, I2
- [x] `I4` Adapt/install the privacy-safe traffic publisher as a system service/timer using management-only cursor/token files, WireGuard journal access and loopback core ingress — _Depends on:_ I2, I3
- [x] `I5` Add read-only status plus guarded update/rollback/backup/restore-proof operator commands that never operate on application, infraege-ops or Firecrawl Compose projects — _Depends on:_ I3, I4
- [x] `I6` Add fake-transport contract tests for credential redaction, WireGuard peer persistence, clean bootstrap, Source registration, publisher lifecycle and unrelated-service preservation — _Depends on:_ I1, I2, I3, I4, I5
- [x] `I7` Accept the architect-approved 13-character application-VPS root password in the production SSH adapter, cover the 12/13-character boundary and document the explicitly accepted weaker-password risk without weakening pinned host verification or the surrounding access controls — _Depends on:_ I1
- [x] `I8` Apply the architect's follow-up acceptance of the actual 12-character application-VPS root password, cover the 11/12-character boundary and reconcile the documented residual risk while retaining every non-length SSH control — _Depends on:_ I7
- [x] `I9` Isolate application and management SSH askpass helpers so a management connection initialized first cannot make the following application SCP submit the wrong protected credential; add a combined-adapter regression test — _Depends on:_ I1, I8
- [x] `I10` Bind each askpass helper at every SSH/SCP invocation so arbitrarily interleaved management and application calls cannot inherit process-global credentials; prove both alternating directions with fake transports — _Depends on:_ I9
- [x] `I11` Probe Beszel's private `/api/health` endpoint after WireGuard activation instead of the hanging UI root path, and lock the acceptance URL in the management contract test — _Depends on:_ I2
- [x] `I12` Match the live sre-kit login contract by accepting its successful `204 No Content` response in Source reconciliation and cover that status expectation without exposing credentials — _Depends on:_ I3
- [x] `I13` Send authenticated Source reconciliation through the verified public TLS origin so the production `Secure` session cookie is preserved, while keeping token-based publisher ingestion on loopback — _Depends on:_ I12
- [x] `I14` Pin the management WireGuard peer to MTU 1280 and restart the interface during idempotent activation so journal responses larger than the path MTU do not blackhole between providers; retain the exact `/32` route — _Depends on:_ I2, I11
- [x] `I15` Make exact-SHA update fail closed when the requested release is not active after deployment, and diagnose/fix the live update path that currently exits successfully while retaining the previous release — _Depends on:_ I3, I5
- [x] `I16` Resolve Beszel Source credentials from the dedicated protected production user files instead of stale client-ops variables, without exposing or resetting the live account; cover file ownership/mode validation and reconciliation — _Depends on:_ D1
- [x] `I17` With the architect's explicit authorization, back up Umami, reset only the sole existing user's password using Umami's bcrypt contract, atomically refresh the protected operator credentials and encrypted Source secret, then prove API login and Source recovery without exposing credentials — _Depends on:_ D1

### Data
- [x] `D1` Register clean Project `infraegev2` and exactly seven enabled Sources named `Public availability`, `Host resources`, `Security bans`, `Application journal`, `Container telemetry`, `Product analytics` and `Nginx traffic`, resolving credentials only from protected operator inputs — _Depends on:_ I3
- [x] `D2` Prove two fresh successful pull cycles plus one idempotent push cycle, then capture only secret-free Source/status/count evidence; do not import or delete local history — _Depends on:_ I4, D1

### Other
- [x] `T1` Reconcile SPEC, STACK, example config and the operator runbook with the management-host ownership, DNS/TLS checkpoint, local-only backup risk and disabled Telegram scope — _Depends on:_ I6, D2

---

## Files

### Create / modify
~~~
ops/management/**
ops/observability/{sre-kit-sources.example.json,push-nginx-traffic.py}
ops/systemd/**
ops/wireguard/wg0.conf.example
scripts/**
Makefile
docs/{SPEC.md,STACK.md,KNOWN_GOTCHAS.md,runbooks/**}
docs/changes/53-sre-kit-management-vps-integration.md
~~~

### Do NOT touch
- Application or `infraege-ops` Compose desired state, volumes, credentials or release directories
- Existing Firecrawl/SearXNG containers, networks, services or data on the management VPS
- Existing workstation WireGuard private key, local sre-kit SQLite/secrets/cursor or telemetry
- Product frontend/backend/content, Telegram channels/rules or key-only SSH migration

---

## Contracts

See `docs/SPEC.md` §3–§4 (and §5–§7 where relevant) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

After the Critical Gate, the linked release requires both repositories' Full/Release Gates, DNS A
record `sre.infraege.ru -> 2.27.208.4`, exact-SHA readiness, authenticated browser evidence, real
WireGuard handshake, seven fresh Sources, local backup/isolated restore proof and before/after
evidence that unrelated containers and listeners were unchanged.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The architect selected a clean start, no Telegram and local-only backup; the old local runtime
  remains an untouched fallback and same-host backup loss is accepted.

---

## Commit Message

```
feat(change-53): integrate sre-kit management VPS
```
