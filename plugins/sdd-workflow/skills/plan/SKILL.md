---
name: plan
description: Select the next scope from project docs or use an explicit brief, draft or continue SPEC.md (`--new` / `--continue`) when needed, scaffold a new docs/changes/NN-slug.md with a Backlog, and switch to its feature branch.
metadata:
  priority: 6
  pathPatterns:
    - 'docs/SPEC.md'
    - 'docs/STACK.md'
    - 'docs/changes/*.md'
  promptSignals:
    phrases:
      - "plan the next change"
      - "draft spec"
      - "bootstrap spec"
      - "create spec from description"
      - "start a new change"
    allOf:
      - [spec, draft]
    anyOf:
      - "specification"
      - "project brief"
      - "requirements"
      - "new change"
    noneOf: []
    minScore: 6
retrieval:
  aliases:
    - sdd plan
    - spec bootstrap
  intents:
    - select the next unit of work from project documentation
    - draft project spec from brief
    - scaffold a new unit of work
  entities:
    - SPEC.md
    - STACK.md
    - docs/changes
---

# plan

Execute the canonical playbook in [docs/playbooks/plan.md](../../../../docs/playbooks/plan.md).
That file is the source of truth for spec drafting/validation, the design flow, Backlog
scaffolding, and the git-flow branch step.
