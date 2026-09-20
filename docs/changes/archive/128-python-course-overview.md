# CHANGE 128 — Python course overview

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `128` |
| Slug | `python-course-overview` |
| Title | Python course overview |
| Status | `archived` |
| Branch | `feature/128-python-course-overview` |

## Goal

Implement the approved two-column Python overview with a compact expandable curriculum,
practice counts and a first-unmastered-lesson action. Preserve all 28 lessons, nine modules,
their authored order and final task-manager project. Reading tracking is explicitly excluded.

## Design References

`docs/artifacts/references/20_30_50.png` — `/courses/python`: summary/action/progress on the left,
curriculum disclosures on the right. Use actual course content; omit reading progress and keep
the existing public header/footer. Desktop ratio approximately 34/66; single column below 60rem.

## Backlog

### Backend
None

### Frontend
- [x] F1 Add revision-aware lesson/course counts and a page-owned overview model: truthful loading/error states, module mastery and first-unmastered continuation; preserve catalog semantics and storage — _Depends on:_ —
- [x] F2 Extend shared Accordion with controlled disclosure and opt-in stable SSR/native fallback; keep existing consumers compatible — _Depends on:_ —
- [x] F3 Rebuild overview summary, primary action, practice progress and compact curriculum against the reference, including responsive and degraded states — _Depends on:_ F1, F2
- [x] F4 Reuse the Python catalog illustration above the overview title, with a smaller mobile size and reserved loading/error geometry — _Depends on:_ F3
- [x] F5 Move the illustration beside the course title per the architect's updated screenshot; keep description/metadata full-width and prevent overlap on narrow screens — _Depends on:_ F4

- [x] F6 Remove the overview illustration after visual review; restore the text-only intro and remove its layout/documentation exception — _Depends on:_ F5

### Infra
None

### Other
- [x] T1 Cover calculations, disclosure, SSR and overview behavior with focused tests; update affected Page Object assertions; verify desktop/mobile and degraded states, LSP and Critical Gate — _Depends on:_ F3
- [x] T2 Record the overview contract in FRONTEND and reconcile PRODUCT's visible-outcome statement — _Depends on:_ F3

## Files

### Create / modify
Frontend: `apps/web/src/pages/course-overview/**`, `apps/web/src/entities/course/course-progress*`,
`apps/web/src/shared/components/accordion/**`, `apps/web/tests/course-overview*`,
`apps/web/tests/accordion*`, `apps/web/e2e/pages/practice-cutover.page.ts`.
Documentation: `docs/FRONTEND.md`, `PRODUCT.md`, this change and the supplied reference.

### Do NOT touch
- Published lesson theory, task bank, lesson routes, shared header/footer, course catalog presentation.
- Backend API/schema, persistent progress format, deployment and archive.

## Contracts

See `docs/SPEC.md` §2.2, §3–§5, `docs/FRONTEND.md` and the Files list above.

## Gate Checks

Critical Gate is defined in [STACK](../../STACK.md). Focused model/component tests and required
interactive browser evidence only; no Full Gate or deploy. Verify no-JS, blocked/delayed scripts,
summary failure, long titles, keyboard and responsive widths (desktop, 768, 390, 320).

Verification: format, web lint/architecture policies, typecheck and 76 focused tests passed
(overview, course foundation, course catalog and shared components). Production build/prerender
passed. The affected Playwright file collects five journeys; the E2E suite was not executed.
Changed production sources and the new test are MCP LSP-clean. The existing E2E LSP resolution
issue from KNOWN_GOTCHAS was reproduced; a realpath-aware TypeScript language service reports
zero diagnostics for the changed Page Object.

Playwriter verified desktop/mobile screenshots, 320/390/768/1312px without horizontal overflow,
independent/bulk disclosure, keyboard Enter, reduced motion, no-JS native disclosures, delayed
scripts with unchanged main geometry, unavailable summary, and revision-aware saved progress.
The seeded 12/140 state masters the first module and continues at Conditions. Browser exceptions
were traced to an unrelated Chrome extension; no application exceptions were recorded.
Allowlisted clean-dry-run, clean and clean-check passed; temporary preview servers were stopped.

F4 verification: 15 overview tests, format, lint, typecheck and LSP passed. Playwriter screenshots
confirmed the shared asset at 160px desktop / 112px mobile. Blocking the image retained the 112px
slot and identical heading coordinates. Allowlisted cleanup passed.

F5 supersedes F4's placement: artwork shares the eyebrow/title rows on the right. Format, lint,
typecheck, LSP and 15 overview tests passed. Playwriter verified desktop/390px screenshots and
320px geometry without overlap or horizontal overflow. Blocking the image preserved the title
coordinates and 98px artwork slot at 320px. Allowlisted cleanup passed.

F6 supersedes F4/F5: the overview is text-only again. Format, web lint, typecheck and LSP passed.
Playwriter screenshots confirmed desktop and 320px layouts without horizontal overflow or course
images. Only the previously identified extension exception appeared. Focused tests and API checks
were skipped: removal of decorative markup/CSS changes no behavior or API. Allowlisted cleanup passed.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Final review: no blocking correctness findings. Fallow MCP audit reports `fail` from an
  estimated-coverage CRAP score for the pure overview calculation (CC 17); this is advisory,
  not a repository gate. Its state branches are covered by the focused overview tests.
  The short lesson-count inflection helper and native/enhanced trigger markup remain deliberately
  local; extracting them is optional cleanup. CSS duplication/selector warnings preserve local
  layout and native/enhanced parity; the hover selector at line 65 predates this change.
  No dependency, import-cycle or layer-boundary regression was reported. Public type additions
  and optional Accordion props preserve existing consumers; the page Props and E2E method
  signatures remain unchanged. Fallow CLI is unavailable, so MCP audit/decision-surface and
  manual diff review were used without claiming walkthrough post-validation.
- Final local ship gate: format, web lint/architecture policies, typecheck, 76 focused tests,
  changed-source LSP and five E2E journey collection checks pass. The unchanged summary API
  reproduces the documented MCP realpath false positive; repository typecheck passes.
  Desktop/mobile and degraded-state evidence above was reviewed, including the final text-only
  screenshots. API/backend checks do not apply; Full Gate, E2E execution and release were not
  requested.

## Commit Message

```
feat(change-128): redesign Python course overview
```
