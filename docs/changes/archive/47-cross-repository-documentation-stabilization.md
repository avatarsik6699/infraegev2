# CHANGE 47 — Cross-repository documentation stabilization

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `47` |
| Slug | `cross-repository-documentation-stabilization` |
| Title | Cross-repository documentation stabilization |
| Status | `archived` |
| Branch | `feature/47-cross-repository-documentation-stabilization` |

---

## Goal

Make the current infraegev2 documentation, public privacy wording and sibling sre-kit boundary agree
with the implementation that exists after Changes 45–46. Distinguish local code, GitHub and
production state explicitly, close resolved audit findings without erasing historical evidence,
and repair durable workflow/tooling references before selecting more product work.

---

## Backlog

### Frontend

- [x] `F1` Replace the scheduled-sounding operator-details promise on `/privacy` with factual
  current-state wording, then update its Page Object assertion — _Depends on:_ —

### Infra

- [x] `I1` Reconcile the operations/sre-kit diagrams, runbooks and incident wording with the
  pull-based six-Source contract and the accepted workstation/offline-alert limitation —
  _Depends on:_ —
- [x] `I2` Make local checkout, GitHub and deployed production state distinguishable without
  implying that locally completed changes are already released — _Depends on:_ —

### Documentation and workflow

- [x] `T1` Reconcile `SPEC.md` with the implemented anonymous progress/result semantics and mark
  Change 46 complete while keeping personalized recommendations and hint scoring out of scope —
  _Depends on:_ —
- [x] `T2` Add current dispositions to the product-readiness audit: close `PR-01`, `PR-02`,
  `PR-03` and `PR-06`, close `PR-05` through `F1`, preserve `PR-04` as architect-owned visual
  follow-up and `PR-07` as an accepted limitation — _Depends on:_ F1, T1
- [x] `T3` Remove obsolete operator-account guidance and repair active documentation/source
  pointers that still target moved change files — _Depends on:_ —
- [x] `T4` Replace stale workflow capability names with the installed architecture and UI-review
  skills, and label the source-package bootstrap playbook so it is not mistaken for an integrated
  repo command — _Depends on:_ —
- [x] `T5` Validate Markdown links, the sibling six-manifest source contract and all affected
  frontend/documentation checks; record only residual risks that are not visible from the diff —
  _Depends on:_ F1, I1, I2, T1, T2, T3, T4

---

## Files

### Create / modify

~~~
README.md
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
docs/artifacts/product-readiness-audit-2026-08-20.md
docs/runbooks/incident-response.md
docs/playbooks/work.md
docs/playbooks/workflow-init.md
apps/web/src/pages/privacy/privacy-page.tsx
apps/web/e2e/pages/privacy.page.ts
apps/web/eslint.config.js
docs/changes/47-cross-repository-documentation-stabilization.md
~~~

### Do NOT touch

- Lesson theory, tasks, publication status or lesson visual layout (`PR-04` remains review-owned)
- API, database, deployment, backup/restore or production runtime state
- Analytics events or operator details that have not been supplied by the architect
- Files in the sibling `sre-kit` repository (owned by linked sre-kit Change 21)

---

## Contracts

The implemented Change 46 behavior is canonical: accepted answers determine per-lesson solved and
mastery state; hints and solutions do not change progress; result navigation exposes available
published materials without presenting a personalized recommendation. The integration boundary
remains pull-based until sre-kit implements a generic push ingress: infraegev2 owns target
lifecycle, while sre-kit owns Source registration, polling, normalization, alerts and monitoring
UI.

---

## Gate Checks

In addition to the affected-area Critical Gate, validate the six example Source entries against
the six sibling sre-kit manifests and run the focused privacy browser journey. All production and
sre-kit runtime verification is read-only.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- TypeScript LSP reports nonexistent `@playwright/test` named-export errors for the changed Page
  Object even though repository `tsc`, lint and the focused Playwright journey all pass. Production
  component diagnostics are clean; no import workaround was added for the tool-only mismatch.

---

## Commit Message

```
docs(change-47): stabilize cross-repository contracts
```
