---
name: ship
description: Close a change with the Critical Gate by default, the manual Full Gate with --full, or mandatory Full and Release Gates with --release. Use when the architect wants to close or publish a change.
metadata:
  priority: 6
  pathPatterns:
    - 'docs/changes/*.md'
    - 'docs/STACK.md'
  promptSignals:
    phrases:
      - "ship the change"
      - "run the gate"
      - "merge to main"
      - "release to production"
    allOf:
      - [ship, gate]
    anyOf:
      - "full gate"
      - "release gate"
      - "deploy"
    noneOf: []
    minScore: 6
retrieval:
  aliases:
    - sdd ship
    - phase gate
  intents:
    - run selected gate and merge
    - release to production
  entities:
    - docs/changes/archive
    - STACK.md
---

# ship

Execute the canonical playbook in [docs/playbooks/ship.md](../../../../docs/playbooks/ship.md).
The executable commands live in `docs/STACK.md`'s Critical, Full, and Release Gate tables; do not
duplicate them here.
