# CHANGE 10 — Reusable Infrastructure Blueprint

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `10` |
| Slug | `infrastructure-blueprint` |
| Title | Reusable infrastructure blueprint for future projects |
| Status | `active` |
| Branch | `feature/10-infrastructure-blueprint` |

---

## Goal

Extract the production and operations lessons from changes 06–09 into one portable, evidence-led
blueprint for future single-VPS web applications on a similar stack. The guide must distinguish
reusable invariants from project-specific values, preserve the current runbooks as the source of
truth for infraege itself, and make security debt and verification boundaries explicit.

---

## Backlog

### Documentation

- [x] `T1` Write the canonical infrastructure blueprint with trust boundaries, staged delivery,
  lifecycle ownership, and a reuse-versus-adapt decision matrix — _Depends on:_ —
- [x] `T2` Add a copyable new-project input and acceptance checklist covering secrets, deployment,
  observability, backup/restore, incident response, and real browser/production evidence — _Depends on:_ T1
- [x] `T3` Capture the recurring production and local-ops traps from changes 06–09, including safe
  defaults and explicit “do not copy blindly” warnings — _Depends on:_ T1
- [x] `T4` Link the blueprint from the stack documentation and verify its repository-local links
  and documented commands without changing the existing infraege runbooks — _Depends on:_ T1, T2, T3

---

## Files

### Create / modify
~~~
docs/INFRASTRUCTURE_BLUEPRINT.md
docs/STACK.md
docs/changes/10-infrastructure-blueprint.md
~~~

### Do NOT touch
- application, infrastructure, workflow, and runtime source files
- existing runbooks and archived change files
- protected configuration outside the repository

---

## Contracts

This is a documentation-only extraction from `docs/SPEC.md` section 7, archived changes 06–09,
the existing runbooks, and `docs/KNOWN_GOTCHAS.md`. It does not alter the live infraege platform
or make its project-specific credentials, addresses, domains, retention values, or accepted risks
portable defaults.

---

## Gate Checks

The change-specific check verifies that every repository-relative Markdown target in the new
blueprint exists and that `git diff --check` passes. All code, build, test, migration, browser,
and API gate rows are `n/a` because no executable behavior changes.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
docs(change-10): add reusable infrastructure blueprint
```
