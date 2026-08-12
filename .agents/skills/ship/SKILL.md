---
name: ship
description: Close a change with the compact Critical Gate by default; use `--full` for the manual Full Gate or `--release` for mandatory Full and Release Gates, push, and deploy verification.
---

<!-- Migrated and adapted from the matching Claude Code skill. -->

You are running the SDD `ship` workflow.

**Arguments**: the arguments supplied in the user's request

Execute the canonical playbook in [docs/playbooks/ship.md](../../../docs/playbooks/ship.md). The
executable commands live in `docs/STACK.md`'s Critical, Full, and Release Gate tables; do not duplicate
them here.

Do not edit code in this workflow — only run gate commands, and on PASS perform the commit, merge,
archive, and (with `--release`) push/deploy-verification steps described in the playbook.

If no arguments are given, infer the change number from the current `feature/NN-slug` branch; if
that fails, ask: "Which change should I ship? (e.g. ship 01)"
