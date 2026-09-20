# CHANGE 127 — Courses catalog redesign

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `127` |
| Slug | `courses-catalog-redesign` |
| Title | Courses catalog redesign |
| Status | `archived` |
| Branch | `feature/127-courses-catalog-redesign` |

## Goal

Implement the architect-approved `/courses` plan: four truthful cards, hand-drawn raster
illustrations, a responsive two-column catalog and shared lesson progress in cards/header.
Keep current publication/order/content and navigate to the Python overview, without filters.

## Design References

- [Supplied reference](../../artifacts/references/d9cf8537-82c3-4db2-a271-07098e9aa187.png): monochrome ink illustrations, compact cards, quiet metadata.
- Approved chat plan: two columns on desktop, one on mobile; existing public typography and controls.

## Backlog

### Backend
None.

### Frontend
- [x] F1 Update visual contracts with the approved catalog-only raster/motion exception — _Depends on:_ —
- [x] F2 Generate four matching ink illustrations, preserve PNG masters and optimize WebP delivery — _Depends on:_ F1
- [x] F3 Implement responsive cards and header using shared controls, truthful planned states and overview CTA — _Depends on:_ F1, F2
- [x] F4 Derive header/card progress once from revision-aware lesson state, reserve SSR/degraded geometry — _Depends on:_ F3
- [x] F5 Preserve the light progress track and distinguish the published-card hover/focus surface — _Depends on:_ F4
- [x] F6 Use a contrasting filled primary overview link through shared ActionLink styles — _Depends on:_ F3
- [x] F7 Enlarge all four illustrations and generate more detailed hand-drawn raster variants — _Depends on:_ F2, F3

- [x] F8 Compact card composition: metadata immediately below description, grounded Python level/outcome, tighter progress/footer — _Depends on:_ F3, F7
- [x] F9 Replace card outline with a soft static shadow; use motion-only card and shared primary CTA hover with reduced-motion support — _Depends on:_ F5, F6

- [x] F10 Restore a very low-contrast card border, equalize all four card dimensions responsively, and constrain CTA hover to scale/arrow motion with unchanged colors — _Depends on:_ F8, F9

- [x] F11 Replace planned copy with a corner “Скоро” badge; visibly mute unavailable cards while preserving readable text, equal sizing and no actions — _Depends on:_ F10

- [x] F12 Soften the unavailable treatment: retain white surface/shadow and only slightly mute illustrations and titles — _Depends on:_ F11

- [x] F13 Give the “Скоро” badge a distinct neutral surface and diagnose/fix CTA hover color on the live localhost:8080 dev route — _Depends on:_ F12

### Infra
None.

### Data
None.

### Other
- [x] T2 Final code review and scoped static audit before the explicitly authorized local ship — _Depends on:_ F13, T1
- [x] T1 Focused unit/E2E coverage, production browser evidence, LSP and frontend Critical Gate — _Depends on:_ F2, F3, F4

## Files

### Create / modify
- Frontend: `apps/web/src/pages/course-catalog/`, `apps/web/public/images/courses/`.
- Shared control: `apps/web/src/shared/components/action-link/` (primary button and opt-in motion-only feedback).
- Shared style: `apps/web/src/shared/components/button/button.module.css` (preserve primary foreground on link hover).
- Catalog metadata: `apps/web/src/entities/course/course-catalog.types.ts`, `apps/web/src/entities/course/content/course-catalog.ts` (grounded Python level/outcome only).
- Tokens: `apps/web/src/app/styles/tokens.css` (scoped mini-course shadow).
- Tests: focused catalog tests, course catalog E2E with domain fixtures/Page Objects.
- Docs/assets: `docs/SPEC.md`, `docs/FRONTEND.md`, `PRODUCT.md`, `docs/artifacts/127-courses-catalog/`.

### Do NOT touch
- Course/topic authored content, publication order, API/DB schema, storage keys, deployment.
- Preserve the supplied reference. No changes to `/ege` or course overview behavior.

## Contracts

See `docs/SPEC.md` §2 and §5, `docs/FRONTEND.md`, and Files above.

## Gate Checks

Use the affected frontend Critical Gate in [STACK](../../STACK.md).
Additionally run targeted catalog E2E and production browser checks through Playwriter:
desktop/mobile, keyboard/reduced motion, no-JS, failed images/API and delayed hydration/fonts.
Record evidence before allowlisted cleanup. Local ship explicitly authorized after final review; no Full/Release Gate, push or deployment.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Acceptance and tooling limitations: [verification](../../artifacts/127-courses-catalog/verification.md). Independent design review: [PASS](../../artifacts/127-courses-catalog/final-review.md).

## Commit Message

```
feat(change-127): redesign mini-course catalog
```
