---
name: work
description: Implement Backlog tasks and findings from local manual review. Confirms the branch, absorbs findings, enforces required tooling, and runs one affected-area Critical Gate. Use for scoped work or reported issues.
metadata:
  priority: 6
  pathPatterns:
    - 'docs/changes/*.md'
    - 'docs/STACK.md'
  promptSignals:
    phrases:
      - "implement the backlog"
      - "work on the change"
      - "fix reported findings"
      - "implement task"
    allOf:
      - [implement, task]
    anyOf:
      - "backlog"
      - "manual review findings"
      - "change file"
    noneOf: []
    minScore: 6
retrieval:
  aliases:
    - sdd work
    - impl loop
  intents:
    - implement backlog task
    - fix reported finding
  entities:
    - docs/changes
    - STACK.md
---

# work

Execute the canonical playbook in [docs/playbooks/work.md](../../../../docs/playbooks/work.md).
That file is the source of truth for the branch check, Backlog target resolution and append handling, dependency/safety checks, required-tooling enforcement, and
the Critical Gate.
