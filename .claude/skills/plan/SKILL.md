---
name: plan
description: Select the next scope from project docs or use an explicit brief, refresh docs/SPEC.md when needed, scaffold a new docs/changes/NN-slug.md with a Backlog, and switch to its feature branch.
allowed-tools: Read, Write, Edit, Glob, Bash
argument-hint: "[--new | --continue] [brief text | path/to/draft.md]"
---

You are running the SDD `plan` workflow.

**Brief**: $ARGUMENTS

Execute the canonical playbook in [docs/playbooks/plan.md](../../../docs/playbooks/plan.md). That
file is the source of truth for spec drafting/validation, the design flow, Backlog scaffolding, and
the git-flow branch step.

If `$ARGUMENTS` looks like a file path, read that file as the source brief. If `$ARGUMENTS` is
empty, follow the canonical playbook's self-scoping mode and derive the next safe minimal change
from SPEC roadmap and change history; ask only when no unique scope is supported. If no mode flag
is present, follow the canonical playbook's auto-mode rule.
