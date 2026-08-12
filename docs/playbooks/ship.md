# ship — Canonical Playbook

Close a change locally after a compact Critical Gate. The expensive Full Gate is manual through
`--full`; production publication through `--release` always implies the Full Gate and then runs
the Release Gate before pushing.

This document is the single source of truth for the `ship` workflow. Runtime wrappers under
`.claude/skills/`, `.agents/skills/`, and `plugins/sdd-workflow/` stay thin and point here.

## Input

```text
/ship [NN]              — Critical Gate; merge to local main and archive on PASS
/ship [NN] --full       — Full Gate; merge to local main and archive on PASS
/ship [NN] --release    — Full + Release Gates; merge, push main, and verify the deploy
```

- `NN` — zero-padded change number. If omitted, infer it from `feature/NN-slug`.
- `--release` implies `--full`; passing both is valid but redundant.

## Required reads

- `docs/changes/NN-slug.md` — Backlog, Gate Checks, and Architect Review Notes
- `docs/STACK.md` — Critical, Full, and Release Gate command tables
- Current git branch and `docs/changes/` when `NN` is omitted

## Procedure

### 1. Identify the target

- Resolve the change file and confirm the current branch is its `feature/NN-slug` branch. Stop
  before gating or merging if it is not.
- Count unchecked Backlog and Architect Review Note items. Either kind blocks shipping regardless
  of automated results.
- Read change-specific `Gate Checks`; applicable overrides add to the selected standard gate.

### 2. Select and run the gate

#### Default local ship

1. Read `docs/STACK.md`'s **Critical Gate** table.
2. Determine touched areas from the feature-branch diff against local `main`.
3. Run the applicable Critical Gate rows once. Use focused tests covering changed behavior; do not
   broaden them to complete unit, E2E, infrastructure, security, accessibility, or performance
   suites. Documentation-only changes normally need formatting/link integrity only.
4. Report each applicable row and every intentional skip with its reason.

#### `--full` or `--release`

1. Read `docs/STACK.md`'s **Full Gate** table and treat it as the command source.
2. Ensure the declared environment/bootstrap prerequisites exist. Prefer a declared helper script
   when present; otherwise execute every defined row directly in table order.
3. Do not stop at the first failure: run every defined row and report the full picture. A missing
   command is `SKIPPED — no command in STACK.md`, never an invitation to guess.

For either mode, PASS requires every executed row to be green and no unchecked Backlog or
Architect Review Note items.

### 3. On FAIL

Report the selected gate table and stop. Do not commit, merge, archive, or push.

### 4. On PASS — merge and archive

1. Commit outstanding changes on `feature/NN-slug` using the change file's Commit Message.
2. Merge it into local `main` (fast-forward when possible, otherwise a normal merge commit; never
   rewrite history).
3. Set the change status to `archived` and move it to `docs/changes/archive/NN-slug.md`.
4. Report the gate mode, merge result, and archive path.

### 5. `--release` only — Release Gate and deploy

Run only after the mandatory Full Gate and local merge succeed.

1. Run every row in `docs/STACK.md`'s **Release Gate** table, reporting honest `SKIPPED` rows.
2. On PASS, push local `main` to `origin/main`.
3. Use `gh` to locate the resulting CI/CD run and confirm its successful completion and declared
   deployment health. “Pushed” alone is not sufficient.
4. On Release Gate failure, stop before pushing. Do not undo the already completed local merge.

## Report

```text
## ship complete — change [NN]

Gate mode: Critical / Full / Full + Release
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
- Run the Full Gate only for explicit `--full` or `--release`.
- Publication safety is not optional: `--release` must pass both Full and Release Gates.
- Unchecked Backlog or Architect Review Note items block every ship mode.
- Never force-push, rewrite history, or delete branches without explicit confirmation.
- Push `origin/main` only for `--release` after all mandatory gates pass.
- When the stack changes, update `docs/STACK.md`, not this playbook.

## Done when

- Every selected gate row has a reported status and all unresolved checklist items are counted.
- On PASS, the branch is merged locally and the change file is archived.
- With `--release`, Full and Release Gates pass, `main` is pushed, and deploy health is confirmed.
