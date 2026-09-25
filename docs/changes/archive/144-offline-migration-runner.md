# CHANGE 144 — Offline migration runner

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `144` |
| Slug | `offline-migration-runner` |
| Title | Offline migration runner |
| Status | `archived` |
| Branch | `feature/144-offline-migration-runner` |

## Goal

Make the first account-schema cutover and production migration run from dependencies already installed in the published API image, without requesting network access or development packages at runtime.

## Backlog

- [x] I1. Invoke the installed Alembic executable directly in the isolated cutover and both Compose migration commands; keep the migration and network isolation otherwise unchanged.
- [x] I2. Add a regression contract and verify the executable exists and runs in a networkless production API image.
- [x] I3. Run affected tests and the Full Gate before continuing the release workflow.

## Implementation Notes

- The first Change 143 rehearsal failed while `uv run` tried to download the default dev group into a networkless container. Its disposable resources were cleaned up and no attestation was written.
