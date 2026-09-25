# CHANGE 141 — Release CI Repair

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `141` |
| Slug | `release-ci-repair` |
| Title | Release CI Repair |
| Status | `active` |
| Branch | `feature/141-release-ci-repair` |

---

## Goal

Unblock the authorized Change 140 production release after the first pushed candidate failed
GitHub static quality and published Nginx image scanning. Keep the account application contract
unchanged; repair the cutover script's ShellCheck finding and replace the fixed-version Alpine
package pin, then verify the next exact-SHA publication before deployment. See `docs/SPEC.md` §7–§8.

---

## Backlog

### Infra

- [x] `I1` Replace the ambiguous `&& … || …` clean-checkout guard in the account cutover rehearsal with explicit fail-closed control flow; pass repository ShellCheck and existing cutover contracts — _Depends on:_ —
- [x] `I2` Upgrade the pinned Nginx-image `libexpat` from vulnerable `2.8.4-r0` to the available fixed `2.8.5-r0`, prove the image builds and contains the fixed package, and preserve the published-image HIGH/CRITICAL scan gate — _Depends on:_ —

---

## Files

### Create / modify

- `scripts/rehearse-account-cutover.sh`
- `infra/nginx/Dockerfile`
- `docs/changes/141-release-ci-repair.md`

### Do NOT touch

- Account API, database schema, learning progress, production secrets, live production database
- Published-image vulnerability policy or CI scan thresholds

---

## Contracts

See `docs/SPEC.md` §7–§8, `docs/STACK.md` Full/Release Gates and the Files list above.

---

## Gate Checks

Run affected-area shell/cutover contracts, a local fixed-package image build and security check,
then the risk-selected Release Gate against the independently verified production SHA. The failed
`6a1a79b551203eedff9f657b7d49936b3f1c26e9` CI run is diagnostic evidence, not release proof.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-141): repair release CI and Nginx image scan
```
