# CHANGE 118 — Practice import before release activation

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `118` |
| Slug | `practice-release-import` |
| Title | Practice import before release activation |
| Status | `active` |
| Branch | `feature/118-practice-release-import` |

## Goal

Close the first-release ordering gap identified in Change 117: the candidate application must
not start until the frozen lesson bank has been imported and verified, with pre/post backups.
Reuse the operator writer and outcome journal; retries preserve later operator edits.
Mode: `continue`; source: approved chat continuation and SPEC §9.2 stage 5.
Local implementation only; live transfer, Full/Release gates and legacy retirement remain separate.

## Design References

None; no UI changes.

## Backlog

### Backend

- [x] `B1` Add a host release import coordinator using the frozen source, explicit environment /
  project identity, restricted roles and existing conversion/validate/diff/import/outcome service.
  Verify all original IDs, first history/revisions/content/membership and files; verify current
  checker/reader state without overwriting later edits. Require both backups before activation
  and make interrupted/repeated runs journal-aware — _Depends on:_ —

### Infra

- [x] `I1` Prepare the candidate's frozen host CLI environment before downtime; insert migration /
  import / verification before consumer startup under the existing deployment lock and EXIT
  recovery. Fail closed on any preparation/import/backup failure; preserve volumes and the
  exact-SHA application rollback contract — _Depends on:_ B1

### Other

- [x] `T1` Test the real orchestration boundary for success and import/backup interruption; prove
  original bank parity, replay, preservation of edits, corrupt-file rejection and role/target
  rejection on an isolated PG18 database with host runners and real backups — _Depends on:_ I1
- [x] `T2` Update operator/production/transition docs and STACK, run the affected Critical Gate
  with Python LSP, and clean owned test resources and analyzed artifacts — _Depends on:_ T1

## Files

### Create / modify

```text
apps/api/app/modules/practice/release.py
apps/api/tests/test_practice_release.py
scripts/deploy-remote.sh
scripts/lib/application-db-release.sh
scripts/tests/deploy_orchestration_test.py
scripts/tests/practice-release.test.sh
docs/STACK.md
docs/runbooks/practice.md
docs/runbooks/production.md
docs/runbooks/practice-transition.md
```

### Do NOT touch

- Public API/schema/UI, frozen authored content, legacy runtime/source deletion.
- Production credentials/data, pushes/deploys, rollback volumes, sibling repositories.
- User-owned staged `docs/artifacts/` files; immutable archives.

## Contracts

See `docs/SPEC.md` §3–§4, §8 and §9.2 and the Files list above.

## Gate Checks

Affected Critical Gate in [STACK](../STACK.md): format, Python/shell lint, Python typecheck/LSP,
focused isolated import and deployment-boundary tests; no frontend/API regeneration or browser
changes. Tests remain host-only. No Full/Release or live recovery claim. Finish allowlisted cleanup.

Verified locally: formatting, Ruff, ShellCheck/syntax, API and maintenance Pyright, Python LSP
and local document links passed. Six deployment tests passed, including the actual activation
call with migration/import failures and exactly-once recovery. Two focused pytest tests passed
on isolated PG18, covering target/password rejection, pre-backup failure, interrupted transaction,
post-commit backup failure, replay, all 150 original tasks, operator revision preservation and
corrupt-file rejection. The host CLI replay verified 150 tasks; Alembic reported no drift and
Restic verified stored backup data. The fixture used the current local API image as backup
verifier metadata, not a new production image or a live restore rehearsal.
Frontend/browser/API regeneration are skipped because those contracts did not change.
Owned containers, temporary image tags/tools and analyzed logs were removed; allowlisted
repository cleanup passed and the user-owned staged diff remained unchanged.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Every candidate still checks the fixed first-import outcome; replay does not reset edited tasks.
  Revision-one history is used only for migration evidence, while current reader/checker smoke
  checks current task state. This keeps the public runtime independent of history.
- Candidate host uv setup now precedes downtime. Production still needs refreshed exact-SHA
  compatibility and live transfer/restore acceptance through the explicit release workflow.

## Commit Message

```text
feat(change-118): import practice before release activation
```
