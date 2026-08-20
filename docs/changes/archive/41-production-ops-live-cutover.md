# CHANGE 41 — Production Operations Cutover Gate

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `41` |
| Slug | `production-ops-live-cutover` |
| Title | Production Operations Cutover Gate |
| Status | `archived` |
| Branch | `feature/41-production-ops-live-cutover` |

---

## Goal

Execute the first authorized split-topology cutover, enforce its fail-closed acceptance contract,
and close any release defect exposed by live evidence. Preserve both legacy and clean-start data,
prove rollback to the previous application/observability topology, and prepare an immutable
corrected release for a subsequent minimal retry. Registration and dashboard verification in the
independently deployed sre-kit core remain a later linked change and do not gate target lifecycle.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Re-run the read-only production preflight and validate the protected application and operations environments, immutable application images, backup freshness, disk headroom and exact rollback target without printing secrets — _Depends on:_ —
- [x] `I2` Record the architect's explicit live-window go/no-go only after I1 reports no unresolved blocker — _Depends on:_ I1
- [x] `I3` Execute the documented fresh-start cutover in order: stop only legacy observability services, deploy the approved application SHA, install the clean independent operations release and activate its maintenance timers — _Depends on:_ I2
- [x] `I4` Verify public application health/version, same-origin Umami collector behavior, private operations service health, empty new volumes, timer state and post-cutover backup/restore evidence; invoke the documented rollback if any blocking acceptance check fails — _Depends on:_ I3
- [x] `I5` Record sanitized live evidence and synchronize the production, onboarding, backup/restore and incident-response documentation with the verified topology and rollback state — _Depends on:_ I4
- [x] `I6` Fix the live Beszel Hub private binding by attaching it to a non-internal network, extend the topology regression test and prepare the corrected operations release for publication before another cutover attempt — _Depends on:_ I3

### Data

- [x] `D1` Preserve every legacy observability volume unchanged during the rollback window and prove the new operations project started with distinct empty volumes; do not copy or delete historical data — _Depends on:_ I3

### Other

- [x] ~~`T1` Prepare a sanitized handoff containing the verified target endpoints and identifiers needed for a subsequent linked sre-kit Source-registration change~~ — moved after the corrected live-cutover retry because the rolled-back target has no active new Source endpoints

---

## Files

### Create / modify

~~~
docs/changes/41-production-ops-live-cutover.md
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
docs/runbooks/production.md
docs/runbooks/production-onboarding.md
docs/runbooks/backup-restore.md
docs/runbooks/incident-response.md
ops/observability/compose.yml
scripts/tests/ops-stack-definition.test.sh
scripts/tests/production-ops-topology.test.sh
~~~

### Do NOT touch

- Application or operations source/configuration unless a live finding is first appended to this Backlog
- `.github/workflows/**`, `apps/web/**`, `apps/api/**` or sre-kit source/runtime/configuration
- Legacy or new Docker volumes through copy, restore, rename, prune or deletion
- SSH, UFW, fail2ban, WireGuard or provider-console configuration
- Protected environment, SSH, Restic or adapter credential values in git, logs or chat
- Archived change documents

---

## Contracts

See `docs/SPEC.md` §7–§8 and the Files list above.

---

## Gate Checks

This change includes an explicitly authorized live production mutation only after I1 passes and I2
records the final go/no-go. Follow `docs/runbooks/production.md` in order, use the exact approved
full Git SHA, and treat every failed acceptance check as fail-closed: stop progression and execute
the documented rollback. Evidence must be sanitized and must never print protected env values,
passwords, SSH material, Restic credentials or future sre-kit adapter secrets.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Read-only preflight on 2026-08-20 confirmed candidate
  `22193492d84363f74db3791abc10d6007134d4d6` has all three immutable GHCR images, while the
  application remains healthy on `eb70fbb517c05455f6ca7398f544947934a22707`. Root disk use is
  25%, the application backup is fresh at `2026-08-20T02:19:44Z`, the legacy observability
  containers and volumes remain present, and neither the shared network nor `infraege-ops` exists.
  The protected `ops.env` was then generated locally with independent values and mode 600, its
  Compose render passed, and the expected WireGuard server address was verified without exposing
  values. The architect explicitly authorized creation, configuration and the live cutover after
  this blocker was reported.
- The authorized cutover deployed the candidate application, created clean independent operations
  volumes, passed Umami, backup and disposable restore checks, then failed acceptance because the
  Beszel Agent restarted: Hub had only the externally isolated `ops-internal` network, so its
  declared WireGuard host port was unreachable. The documented rollback disabled operations
  timers, stopped the new project without deleting volumes, restored the previous application SHA
  and proved all four legacy observability containers healthy.
- The corrected definition attaches only Beszel Hub, not its database, to the existing shared
  non-internal network. Its host binding remains `10.77.0.1:8090`; no public Nginx route is added.
  Focused stack, cross-project topology and lifecycle tests pass. Another live attempt requires a
  newly published immutable SHA containing this fix.

---

## Commit Message

```
fix(change-41): close production operations cutover gate
```
