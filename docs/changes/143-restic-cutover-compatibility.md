# Change 143 — Restic cutover compatibility

## Goal

Unblock the first account-schema production rehearsal without weakening its exact-snapshot and exact-candidate safeguards.

## Backlog

- [x] I1. Use authenticated Restic `stats --mode restore-size --json` for snapshot sizing, requiring exactly one snapshot and a nonnegative size; retain all existing fail-closed identity, freshness, and candidate checks.
- [x] I2. Cover the Restic 0.16 snapshot-without-summary case and invalid stats in the cutover contract test; document the direct production backup command for hosts without `make`.
- [x] I3. Run affected tests, exact relevant CI checks, and the Full Gate before release.
- [x] I4. Stabilize the no-JavaScript practice-filter browser contract: target its native limit select even if a scripted combobox is briefly present in the DOM during stylesheet loading.

## Implementation Notes

- Production Restic 0.16.4 returns a valid authenticated snapshot without `summary`; its JSON restore-size stats report `total_size` and `snapshots_count`.
