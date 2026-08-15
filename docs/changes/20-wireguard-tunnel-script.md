# CHANGE 20 — Standalone WireGuard tunnel up/down script

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `20` |
| Slug | `wireguard-tunnel-script` |
| Title | Standalone WireGuard tunnel up/down script |
| Status | `active` |
| Branch | `feature/20-wireguard-tunnel-script` |

---

## Goal

Change-19 retired `apps/ops` and, with it, `scripts/ops-local.sh` — which also happened to own the
only `make ops-tunnel-up`/`ops-tunnel-down` convenience wrapper around `wg-quick` for the private
`10.77.0.0/24` WireGuard route to the VPS (Beszel `10.77.0.1:8090`, Umami `:3001`, journald
`:19531`). That tunnel is still needed: sre-kit now runs locally on the architect's machine (same
as `apps/ops` did) and needs the same private-network reachability for its
`beszel-api`/`umami-http`/`journal-http`/`fail2ban-ssh` adapters. This change extracts just the
tunnel lifecycle (not the deleted dashboard lifecycle) into its own script and Makefile targets, so
`make tunnel-up`/`make tunnel-down` works standalone, with no dependency on `apps/ops` or any other
retired code.

---

## Backlog

### Infra
- [x] `I1` Add `scripts/wireguard-tunnel.sh` with `up`/`down`/`status` actions, extracted from change-19's deleted `scripts/ops-local.sh` (its `ensure_wireguard`/`stop_owned_wireguard`/wg-related helpers only — no dashboard/ops-config logic) — _Depends on:_ —
- [x] `I2` Add `make tunnel-up`, `make tunnel-down`, `make tunnel-status` targets wrapping the script; update `make help` — _Depends on:_ `I1`

### Docs
- [x] `D1` `docs/STACK.md` — add a short "Private VPS access" note under Prerequisites/Initial setup pointing at `make tunnel-up`/`tunnel-down` — _Depends on:_ `I2`

<!-- Test execution is governed by docs/STACK.md's Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify
```
scripts/wireguard-tunnel.sh
Makefile
docs/STACK.md
docs/changes/20-wireguard-tunnel-script.md
```

### Do NOT touch
- Anything already removed by change-19 (`apps/ops`, `scripts/ops-local.sh`, `docs/runbooks/monitoring.md`) — this change does not resurrect the dashboard, only the tunnel

---

## Contracts

Pure infra/tooling addition — no API/schema contracts. Script contract: `scripts/wireguard-tunnel.sh {up|down|status}`, exit non-zero on failure, same env var overrides as before (`INFRAEGE_PRODUCTION_DIR`, `INFRAEGE_OPS_WG_CONFIG` renamed `INFRAEGE_WG_CONFIG`).

---

## Gate Checks

No change-specific override. This change has no automated test coverage (it's a shell script
exercising real WireGuard/sudo state) — verification is a manual dry run (`bash -n`, `shellcheck`
if available) plus a live `make tunnel-up && make tunnel-status && make tunnel-down` run by the
architect against the real VPS, which is outside agent-executable scope in this session (requires
sudo and a real WireGuard peer).

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

Verified: `bash -n` syntax check, `make -n help/tunnel-up/tunnel-down/tunnel-status` dry runs,
`pnpm format:check`. shellcheck was not available in this environment, so it was skipped rather
than silently omitted. A live `make tunnel-up`/`tunnel-down` run against the real WireGuard peer
was not exercised here (requires sudo and the architect's real VPS/peer state) — first real use
is the natural verification point.

---

## Commit Message

```
feat(change-20): restore standalone WireGuard tunnel up/down script
```
