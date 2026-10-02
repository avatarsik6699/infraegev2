# CHANGE 165 — Monitoring signal corrections

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `165` |
| Slug | `monitoring-signal-corrections` |
| Title | Correct restore readiness probes |
| Status | `archived` |
| Branch | `feature/165-monitoring-signal-corrections` |

## Goal

Remove confirmed false PostgreSQL connection errors from the isolated restore drill without
weakening its readiness, restore verification or cleanup. Source: the 2026-10-02 live audit and
the architect's instruction to implement only justified code changes.

## Backlog

### Infra

- [x] `I1` Set the existing `postgres` database explicitly in both restore `pg_isready` calls; add a focused behavioral contract proving the readiness calls target that database and a real failed readiness still fails the drill. — _Depends on:_ —

### Other

- [x] `T1` Document the false-FATAL cause and the operational follow-up: disk stalls, unexplained HTTP 500, and independent readiness probes remain separate from this code fix. — _Depends on:_ I1

## Files

### Create / modify

~~~
scripts/restore-check.sh
scripts/check-shell.sh
scripts/tests/restore-readiness.test.sh
docs/KNOWN_GOTCHAS.md
docs/changes/165-monitoring-signal-corrections.md
~~~

### Do NOT touch

- Application code, database schema/data, dependency locks, deployment state, archived changes.
- Paused Change 164 and its design artifacts.

## Contracts

See `docs/SPEC.md` §7–§8 and `docs/runbooks/backup-restore.md`.
SPEC is unchanged: this corrects a probe of the existing isolated database.

## Gate Checks

Use the affected shell Critical Gate in [STACK](../../STACK.md), including the focused readiness
contract and existing backup/restore contract. No app build, browser or DB migration is involved.

Verification (2026-10-02): `bash scripts/tests/restore-readiness.test.sh` and
`bash scripts/tests/backup-restore.test.sh` PASS; `pnpm lint:shell` PASS; `git diff --check`
PASS. The new readiness contract first failed against the original script, then passed after
the fix. Independent review found no remaining infra blockers. `make clean-dry-run` was reviewed,
then `make clean` and `make clean-check` passed. Format/type/LSP/API/browser checks are not
applicable to shell-only changes; Markdown is outside the formatter boundary.

Release coverage: baseline `71bde986211e4ad5f2b8ed6c7a2905489aad9dc7`; application and dependency
inputs are unchanged. Accept the unchanged shell Critical evidence above. The other unpublished
change is 163 (Codex configuration/docs only); its TOML files parse successfully. No application
Full Gate is indicated. Production Compose render, target readiness and GitHub environment policy
were verified before publication; exact-SHA CI/images and deploy proof follow the final merge.

## Implementation Notes

- Change 164 was explicitly paused by the architect. Its branch remains
  `feature/164-client-redesign`; all untracked work is preserved in stash commit
  `8f8692b327ce00b4f1d06450568423c017a4fca4`, also pinned by
  `refs/backup/change-164-paused-20261002`. Restore with `git stash apply --index
  refs/backup/change-164-paused-20261002` on that branch after safely shelving this change.
  The normal next-number command returned 164 after shelving; 165 intentionally reserves 164
  for that unfinished work. Do not apply the stash to this branch or archive 164 as completed.
- Disk wait episodes and historical HTTP 500 have no established code-level root cause.
  This change does not claim to fix them. VPS network configuration and uptime target creation
  are operational follow-ups, not speculative application patches.

## Commit Message

```text
fix(change-165): target the restore readiness database explicitly
```
