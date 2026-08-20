# CHANGE 40 — Production Operations Activation Gate

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `40` |
| Slug | `production-ops-activation` |
| Title | Production Operations Activation Gate |
| Status | `archived` |
| Branch | `feature/40-production-ops-activation` |

---

## Goal

Establish the final release/go-no-go gate for activating the split application and `infraege-ops`
topology. Capture sanitized live preflight evidence, validate candidate prerequisites and remove
the blocking security-scan finding before publishing a new immutable candidate. The actual VPS
cutover remains a subsequent separately authorized change.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Run the documented read-only production preflight and record sanitized evidence for the current application release, legacy observability ownership, Docker network/volume inventory, timers, backup freshness, disk headroom and rollback SHA — _Depends on:_ —
- [x] `I2` Audit the protected application/operations environments and exact release candidate without printing secrets; record absent prerequisites as fail-closed blockers for the subsequent activation change — _Depends on:_ I1
- [x] ~~`I3` Obtain the architect's explicit live-window go/no-go~~ — moved to the subsequent activation change
- [x] ~~`I4` Execute the fresh-start production cutover~~ — moved to the subsequent activation change
- [x] ~~`I5` Prove live application, operations and restore acceptance or rollback~~ — moved to the subsequent activation change
- [x] ~~`I6` Register and verify the six sre-kit Sources~~ — moved to the subsequent activation change
- [x] `I7` Replace the fixed-variable Umami proxy with Nginx's shared-memory resolving upstream so independent Docker DNS remains dynamic without triggering the blocking Semgrep SSRF rule — _Depends on:_ I1

### Data

- [x] ~~`D1` Start clean operations volumes and preserve all legacy volumes~~ — moved to the subsequent activation change

### Other

- [x] ~~`T1` Synchronize documentation with the verified live topology~~ — moved to the subsequent activation change
- [x] `T2` Reproduce the pushed-candidate Semgrep finding locally and prove the resolving-upstream replacement with the pinned Nginx image, focused proxy test and zero blocking Semgrep findings — _Depends on:_ I7

---

## Files

### Create / modify

~~~
docs/changes/40-production-ops-activation.md
infra/nginx/nginx.conf
infra/nginx/conf.d/infraege.prod.conf
scripts/tests/umami-proxy.test.sh
~~~

### Do NOT touch

- Legacy or new production Docker volumes; no copy, rename, restore, prune or deletion
- Production databases except normal empty-stack initialization and non-destructive restore drills
- SSH, UFW, fail2ban, WireGuard or provider-console configuration
- `.github/workflows/**`, application source under `apps/**` or sre-kit source code
- sre-kit deployment lifecycle; only target Source configuration is in scope
- Archived change documents

---

## Contracts

See `docs/SPEC.md` §7–§8 and the Files list above.

---

## Gate Checks

Read-only production evidence must not print protected env values, Restic credentials, SSH
passwords or adapter credentials. This change does not authorize a VPS mutation. The focused
security gate additionally runs Semgrep 1.172.0 with `p/default` and validates the production Nginx
configuration using the repository's pinned image while Umami is absent.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Read-only preflight on 2026-08-20 found application release
  `eb70fbb517c05455f6ca7398f544947934a22707` healthy with the four legacy observability containers,
  no installed `infraege-ops` release or shared ingress network, and only the three expected legacy
  volumes. Root disk usage was 25%; application/Restic files were root-owned mode 600; the
  application backup marker reported success at `2026-08-20T02:19:44Z`. The same live SHA is the
  recorded rollback target because `/opt/infraege/previous` is absent.
- Candidate `56c8b9f7a95a7e9543c4d90497ad820d54978c59` is 11 commits ahead of the local
  `origin/main` snapshot. Its application environment validates, but the protected local `ops.env`
  is absent and all three candidate GHCR images are unavailable. No production mutation was
  attempted; production activation remains blocked until both prerequisites exist.
- After the architect-authorized push, GitHub run `32366150340` passed static quality and dependency
  audit but blocked the security job on two Semgrep SSRF findings caused solely by the fixed
  `proxy_pass` variable. The resolving named upstream removes that variable; the pinned Nginx image
  validates without Umami present and the same Semgrep command reports zero findings locally.

---

## Commit Message

```
fix(change-40): harden production operations release gate
```
