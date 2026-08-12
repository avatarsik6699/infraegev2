---
name: work
description: Implement Backlog tasks or fix Architect Review Notes. Confirms the branch, absorbs findings, enforces required tooling, and runs one affected-area Critical Gate. Use for scoped work or reported issues.
metadata:
  priority: 6
  pathPatterns:
    - 'docs/changes/*.md'
    - 'docs/STACK.md'
  promptSignals:
    phrases:
      - "implement the backlog"
      - "work on the change"
      - "fix review notes"
      - "implement task"
    allOf:
      - [implement, task]
    anyOf:
      - "backlog"
      - "review notes"
      - "change file"
    noneOf: []
    minScore: 6
retrieval:
  aliases:
    - sdd work
    - impl loop
  intents:
    - implement backlog task
    - fix architect review note
  entities:
    - docs/changes
    - STACK.md
---

# work

Execute the canonical playbook in [docs/playbooks/work.md](../../../../docs/playbooks/work.md).
That file is the source of truth for the branch check, task-source resolution (Backlog vs.
`review`), Backlog-append handling, dependency/safety checks, required-tooling enforcement, and
the Critical Gate.
