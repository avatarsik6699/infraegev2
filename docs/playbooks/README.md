# SDD Workflow Playbooks

These playbooks are the canonical source of truth for the workflow. Runtime wrappers under
`.claude/skills/` and `plugins/sdd-workflow/` must stay thin and point here.

## Bootstrap

- [workflow-init.md](./workflow-init.md) — integrate the workflow into a target project

## Integrated-project workflow

- [plan.md](./plan.md) — select the next scope from project docs or use a brief, refresh
  `docs/SPEC.md` when needed, and scaffold a new change with its feature branch
- [work.md](./work.md) — implement Backlog tasks (default) or fix Architect Review Notes
  (`/work XX review`) through the agent execution loop, absorbing mid-session findings into the
  Backlog and running the Fast Gate
- [ship.md](./ship.md) — run the Full Gate, merge to `main`, archive the change, and (with
  `--release`) push and verify the deploy
