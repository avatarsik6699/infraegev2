---
name: plan
description: Select the next scope from project docs or use an explicit brief, refresh docs/SPEC.md when needed, scaffold a new docs/changes/NN-slug.md with a Backlog, and switch to its feature branch.
---

<!-- Migrated and adapted from the matching Claude Code skill. -->

You are running the SDD `plan` workflow.

**Brief**: the arguments supplied in the user's request

Execute the canonical playbook in [docs/playbooks/plan.md](../../../docs/playbooks/plan.md). That
file is the source of truth for spec drafting/validation, the design flow, Backlog scaffolding, and
the git-flow branch step.

If the arguments look like a file path, read that file as the source brief. If no brief or file is
supplied, follow the canonical playbook's self-scoping mode and derive the next safe minimal change
from SPEC roadmap and change history; ask only when no unique scope is supported. If no mode flag
is present, follow the canonical playbook's auto-mode rule.
