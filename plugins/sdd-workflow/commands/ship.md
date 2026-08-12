---
description: Run the Critical Gate by default or Full Gate with --full; merge and archive on PASS. --release requires Full and Release Gates, then pushes and verifies deploy. Usage: /ship [change] [--full|--release]
---

# /ship

Execute the canonical playbook: [docs/playbooks/ship.md](../../../docs/playbooks/ship.md).

The matching skill lives at [skills/ship/SKILL.md](../skills/ship/SKILL.md).

Do not commit or merge outside of the selected gate's PASS path in this playbook.
