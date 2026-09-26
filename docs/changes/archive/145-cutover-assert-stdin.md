# CHANGE 145 — Cutover assertion stdin

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `145` |
| Slug | `cutover-assert-stdin` |
| Title | Cutover assertion stdin |
| Status | `archived` |
| Branch | `feature/145-cutover-assert-stdin` |

## Goal

Make the second-stage account cutover assertion actually read its SQL input while preserving isolation and fail-closed attestation.

## Backlog

- [x] I1. Keep stdin open for the final `psql` query in the disposable restore container.
- [x] I2. Add a regression check and verify the Docker stdin behavior locally.
- ~~I3. Run the Full Gate before continuing the exact-SHA Release Gate and production rehearsal.~~ (removed by architect, 2026-09-26: local closure without gate/full gate reruns.)

## Gate Checks

- Critical Gate / Full Gate: **SKIPPED** by explicit architect authorization on 2026-09-26; not PASS evidence.
- Local closure only. Exact-SHA Release Gate, published-image checks and production cutover rehearsal remain pending and mandatory before deployment; this waiver does not apply to Change 146 or any release.

## Commit Message

`fix(release): preserve stdin for cutover assertion`

## Implementation Notes

- The Change 144 rehearsal restored the second-stage bundle and passed its data fingerprint, but the final `psql` assertion received no SQL because `docker exec` omitted `-i`. The failed rehearsal cleaned disposable resources and created no attestation.
- The architect accepted local closure without rerunning gates; no new execution evidence or production attestation is claimed.
