---
description: Select the next scope from project docs or use a brief, refresh SPEC.md when needed, scaffold a change with a Backlog, and switch to its feature branch. Usage: /plan [--new|--continue] ["brief" | path/to/draft.md]
---

# /plan

Execute the canonical playbook: [docs/playbooks/plan.md](../../../docs/playbooks/plan.md).

The matching skill lives at [skills/plan/SKILL.md](../skills/plan/SKILL.md).

If the argument looks like a file path, read it as the source brief. With no brief or file, follow
the canonical playbook's self-scoping mode and derive the next safe minimal change from SPEC
roadmap and change history; ask only when no unique scope is supported. If no mode flag is
provided, follow the canonical default (`auto->new` for placeholder SPEC, otherwise
`auto->continue`).
