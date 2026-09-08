# CHANGE 102 — Course overview redesign

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `102` |
| Slug | `course-overview-redesign` |
| Title | Course overview redesign |
| Status | `active` |
| Branch | `feature/102-course-overview-redesign` |

## Goal

Bring `/courses/$courseSlug` into the accepted public infraege visual world.
Use a compact two-column composition: illustrated course summary on the left and sequential curriculum on the right, with restrained illustration depth and motion on the shared warm canvas.
Approved source: the architect-approved chat plan; SPEC remains unchanged.

## Design References

- `/courses`, `/ege`, `/`: expanded public header, warm canvas, shared typography and orange drawn links.
- Existing Python catalog illustration; engineering patterns and glints around the illustration; open program without a separate backing.

## Backlog

### Backend
None

### Frontend
- [x] `F1` Recompose the overview with expanded course navigation, catalog backlink, illustrated responsive introduction and truthful metadata — _Depends on:_ —
- [x] `F2` Place outcomes and the titled sequential module program below the introduction; preserve publication, all lesson links and hydration-only progress — _Depends on:_ F1
- [x] `F3` Synchronize the overview frontend contract and extend domain browser coverage for navigation, responsive layout, no-JS and progress — _Depends on:_ F2
- [x] `F4` Verify desktop/tablet/mobile/200% in browser, LSP, focused Critical Gate and independent visual review, then repository hygiene — _Depends on:_ F3

- [x] `F5` Remove the redundant catalog backlink and review current visual fragmentation against the architect's revised two-column brief — _Depends on:_ F4
- [x] `F6` Recompose a compact illustrated left summary and right sequential program; add catalog-derived illustration depth, engineering patterns and activity-aware motion — _Depends on:_ F5
- [x] `F7` Update frontend contract and browser coverage for the revised layout, preserved no-JS artwork, links/progress and reduced motion — _Depends on:_ F6
- [x] `F8` Complete affected Critical Gate, batched visual verification and independent review; clean generated evidence — _Depends on:_ F7

- [x] `F9` Remove the architect-rejected program backing; audit overview links/primitives against the current design system and replace legacy local affordances without changing lesson navigation — _Depends on:_ F6

- [x] `F10` Preserve the architect-approved content/program structure while strengthening the left column, widening the composition/gutter, keeping the stepper attached to the right program, and enriching balanced artwork depth/patterns/motion — _Depends on:_ F9

- [x] `F11` Extend balanced engineering patterns, depth, glints and activity-aware motion across the whole overview and along the program, preserving the approved asymmetry, open canvas and reading clarity — _Depends on:_ F10

- [x] `F12` Soften the light pass between module steps and replace SVG study geometry with generated transparent raster illustrations consistent with the mini-course staircase — _Depends on:_ F11

- [x] `F13` Reduce raster study contrast into a background role, then audit the complete overview against approved UI/UX, responsive, accessibility, motion and design-system contracts — _Depends on:_ F12

### Infra
None

### Data
None

## Files

### Create / modify
- `apps/web/src/pages/course-overview/`
- `apps/web/public/images/course-overview/` generated raster assets
- `docs/artifacts/course-overview-image-prompts.md` generation provenance
- `docs/artifacts/course-overview-ui-audit.md` current UI/UX audit
- `apps/web/e2e/` existing Python course page object and focused overview spec
- `docs/FRONTEND.md`
- `docs/changes/102-course-overview-redesign.md`

### Do NOT touch
- CourseLesson and TopicLesson pages, authored content, publication metadata, API and progress persistence.
- Existing untracked reference assets and lesson drafts.

## Contracts

See `docs/SPEC.md` §3–§5 and the Files list above.

## Gate Checks

Use the affected-area Critical Gate in [STACK.md](../STACK.md).
Additionally run the focused overview browser journey approved in the plan, including no-JS,
keyboard, responsive sizes, progress and screenshots. No Full Gate or release.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- E2E-only LSP reports the known isolated Playwright declaration mismatch documented in
  `KNOWN_GOTCHAS.md`; production overview diagnostics are empty. Web typecheck, lint and
  the focused browser journey provide the complementary E2E evidence.
- Independent visual review: PASS after correcting pre-hydration artwork sizing locally.
  No shared Image behavior or lesson surface was changed.
- The architect subsequently replaced the initial full-width composition and rejected the program
  backing. F5–F10 supersede that initial direction; the current overview uses two columns and shared
  ActionLink lesson titles on the open canvas.

## Commit Message

```
feat(change-102): redesign course overview and curriculum
```
