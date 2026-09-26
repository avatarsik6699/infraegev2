# ship — Canonical Playbook

Close a change locally after checking what changed since its affected-area Critical Gate.
The expensive Full Gate is manual through `--full`. Production publication through `--release`
adds missing affected coverage, candidate security and the release checks.

This document is the single source of truth for the `ship` workflow. Runtime wrappers under
`.claude/skills/`, `.agents/skills/`, and `plugins/sdd-workflow/` stay thin and point here.

## Input

```text
/ship [NN]              — missing/invalidated Critical checks; merge locally and archive on PASS
/ship [NN] --full       — Full Gate; merge to local main and archive on PASS
/ship [NN] --release    — affected coverage + Release Gate; merge, push, verify deploy
```

- `NN` — zero-padded change number. If omitted, infer it from `feature/NN-slug`.
- `--release --full` explicitly forces all local coverage; `--release` alone selects affected
  checks against the candidate and the last verified production SHA, never merely local `main`.

## Required reads

- `docs/changes/NN-slug.md` — Backlog, Gate Checks, and Architect Review Notes
- `docs/STACK.md` — Critical, Full, and Release Gate command tables
- Current git branch and `docs/changes/` when `NN` is omitted

## Procedure

### 1. Identify the target

- Run `python3 scripts/change_history.py inspect`; verify the target is the single active file.
  COMPACTED.md does not participate in active Backlog checks.
- Resolve the change file and confirm the current branch is its `feature/NN-slug` branch. Stop
  before gating or merging if it is not.
- Count unchecked Backlog and Architect Review Note items. Either kind blocks shipping regardless
  of automated results.
- Read change-specific `Gate Checks`; applicable overrides add to the selected standard gate.

### 2. Select and run the gate

#### Default local ship

1. Read `docs/STACK.md`'s **Critical Gate** table.
2. Determine touched areas from the feature-branch diff against local `main`.
3. Compare the candidate with the recorded `/work` acceptance. Run only missing or invalidated
   affected Critical rows. If no relevant inputs changed and the evidence is clear, record the
   unchanged checks as accepted without re-executing them. Use focused behavior tests when needed;
   documentation changes normally need link/structure checks only. Analyze reports before hygiene.
4. Report each applicable row and every intentional skip with its reason.

#### `--full` or `--release`

1. Read STACK and the verification runbook. Explicit `--full` uses Full. Release-only selects
   missing affected coverage and fresh candidate security/image evidence; it does not promote to
   Full merely because a path is shared or unfamiliar. Record the coverage rationale and do not
   infer a production baseline from local main.
2. List the selected commands and prerequisites, prepare only the required isolated environment,
   and run the affected checks. A failed prerequisite is not a green check.
3. On failure, stop dependent stages; diagnose the specific failing contract and rerun only
   invalidated work. Fresh security and external release observations are never replaced by old
   results. Unknown inputs require an explicit coverage decision.
4. Analyze reports before repository hygiene.

For either mode, PASS requires every executed row to be green and no unchecked Backlog or
Architect Review Note items.

### 3. On FAIL

Report the selected gate table and stop. Do not commit, merge, archive, or push.

### 4. On PASS — merge and archive

1. Commit outstanding changes on `feature/NN-slug` using the change file's Commit Message.
2. Merge it into local `main` (fast-forward when possible, otherwise a normal merge commit; never
   rewrite history).
3. Set the change status to `archived`, normalize relative links for the extra `archive/` directory
   level (for example `../STACK.md` becomes `../../STACK.md`), and move it to
   `docs/changes/archive/NN-slug.md`. Do not otherwise rewrite historical content.
4. Run `python3 scripts/change_history.py inspect` again after archiving; next numbering must
   include compacted coverage. Report the gate mode, merge result, and archive path.

Explicitly approved archive compaction is the sole exception to retaining each historical file:
prepare a separate Backlog, immutable source commit and byte-verified manifest before removal;
retain decisions, accepted risks and unresolved historical items in COMPACTED.md. Ordinary ship
continues to create one numbered archive and never edits compacted evidence or rewrites Git.

### 5. `--release` only — Release Gate and deploy

Run only after the selected local release coverage and local merge succeed.

1. Reconcile the tested source tree with the final merged SHA (archive-only metadata changes
   do not authorize untested source edits). Check every unpublished commit for secrets and audit
   changed dependencies. Run prepublication STACK rows: production Compose render, release target
   health and GitHub access/environment/secrets policy. Never persist secrets.
2. On PASS, push local `main` to `origin/main` under the user's release authorization.
3. Use the release checkpoint utility to fetch fresh successful CI and images evidence for that
   exact SHA. The images workflow scans the actual published digests; no second local image build
   is required. Pending/missing/failed runs block deploy.
4. For a first account-schema cutover, pause before dispatch. The operator must rehearse this
   exact candidate against isolated copies of production data, verify the second-stage restore,
   and record the root-owned SHA attestation described in the production and backup runbooks.
   Missing or failed rehearsal blocks deploy; a pre-migration production backup or a local drill
   alone is not sufficient. Use the dedicated candidate rehearsal command, not the routine
   restore-check command, for this proof.
5. Dispatch the existing deploy workflow once for that SHA. On interruption, inspect existing
   runs before deciding whether any dispatch is needed; a checkpoint never repeats a mutation.
6. Verify the exact deploy target and independent public readiness SHA/homepage using the
   checkpoint utility. Saved statuses are history, never current production truth.
7. Failure before push blocks push; failure after push blocks deploy or completion. Report the
   actual reached phase. Do not undo a completed merge/push or repeat bank imports automatically.

## Report

```text
## ship complete — change [NN]

Gate mode: affected Critical / Full / affected Release (or explicit Full + Release)
[selected gate]:
  [row] — PASS
  [row] — SKIPPED ([reason])
Backlog: [count] unresolved
Architect Review Notes: [count] unresolved

Result: PASS / FAIL
Merged: feature/[NN]-slug -> main (fast-forward / merge commit)
Archived: docs/changes/archive/[NN]-slug.md

--release:
Release Gate:
  [row] — PASS / SKIPPED
Pushed: origin/main @ [sha]
Deploy status: [live status via gh, or "not applicable"]
```

## Rules

- Do not edit code files in this workflow.
- Default `/ship` is intentionally compact; do not silently promote it to a Full Gate.
- Run the Full Gate only for explicit `--full`.
- Publication safety is not optional: `--release` must pass affected coverage, candidate security
  and all Release Gate phases. Unknown/shared inputs require an explicit coverage decision.
- Unchecked Backlog or Architect Review Note items block every ship mode.
- Never force-push, rewrite history, or delete branches without explicit confirmation.
- Push `origin/main` only for `--release` after all mandatory gates pass.
- When the stack changes, update `docs/STACK.md`, not this playbook.

## Done when

- Every selected gate row has a reported status and all unresolved checklist items are counted.
- On PASS, the branch is merged locally and the change file is archived.
- With `--release`, selected coverage and Release Gate pass, `main` is pushed, and the exact
  deployed SHA is confirmed independently of workflow success.
