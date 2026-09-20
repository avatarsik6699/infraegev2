# CHANGE 126 — EGE catalog redesign

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `126` |
| Slug | `ege-catalog-redesign` |
| Title | EGE catalog redesign |
| Status | `archived` |
| Branch | `feature/126-ege-catalog-redesign` |

## Goal

Implement the architect-approved `/ege` reference: all 25 numerically ordered topics,
shared search/buttons/thin progress, accurate lesson-only progress and stable first paint.
Only topics 5 and 16 receive faithful mathematical miniatures; planned topics use a common
Lucide BookOpen placeholder and “Скоро”. No theory tracking, alternate view or recommended sorting.

## Design References

- `/ege` — [provided reference](../../artifacts/references/13_50_05.png): editorial rows,
  large numbers, mathematical miniatures, monochrome controls and progress.
- Architect-approved plan in chat: responsive reserved geometry, zero unexpected layout shifts;
  reuse shared SearchField, Progress, Button, ActionLink and Lucide interface icons.

## Backlog

### Backend
- [x] B1 Add read-only published topic practice summary and generated API contract — _Depends on:_ —

### Frontend
- [x] F1 Build reference composition, exact 5/16 miniatures and common planned placeholder — _Depends on:_ —
- [x] F2 Reuse shared controls, add compatible controlled SearchField, search/status filters and reset — _Depends on:_ F1
- [x] F3 Connect revision-aware lesson progress with stable loading/error/retry/no-JS states — _Depends on:_ B1, F2
- [x] F4 Deliver responsive geometry, accessible links/controls and no unexpected layout shifts — _Depends on:_ F1, F2, F3

- [x] F5 Visually mute planned topics while preserving readable text contrast — _Depends on:_ F1
- [x] F6 Align theory/task metadata with the title and practice status/progress with the row bottom — _Depends on:_ F3
- [x] F7 Thicken progress toward the reference and retain track contrast on hover/focus — _Depends on:_ F3
- [x] F8 Animate the published-row arrow on hover/focus without layout changes; respect reduced motion — _Depends on:_ F1

- [x] F9 Restore the original light progress track; distinguish it by changing the row hover/focus background instead — _Depends on:_ F7

- [x] F10 Replace the generic subtitle with catalog totals, published-topic availability and lesson practice progress below the heading; preserve stable loading geometry — _Depends on:_ F3

- [x] F11 Tighten title-to-metadata spacing and compact the summary rows without loading shifts — _Depends on:_ F10

- [x] F12 Resolve final-review findings: correct summary count grammar and extract pure progress aggregation from the loading hook — _Depends on:_ F3

- [x] F13 Replace generic-span ARIA labels on exam numbers with actual screen-reader text and verify the accessibility audit — _Depends on:_ F4

### Other
- [x] T1 Focused API/UI/regression tests, production browser evidence and affected Critical Gate — _Depends on:_ B1, F1, F2, F3, F4

### Infra
- [x] I1 Include the new summary in the existing practice read-rate budget and focused ingress test — _Depends on:_ B1

### Data
None. No migration, bank import or production mutation.

## Files

### Create / modify
- Backend: `apps/api/app/modules/practice/{api,readers}.py`, focused API tests, generated OpenAPI.
- Frontend: `apps/web/src/pages/topic-catalog/`, page-owned summary adapter,
  shared SearchField, semantic typography tokens, generated API types, catalog tests and domain E2E fixtures/Page Objects.
- Ingress: `infra/nginx/snippets/practice-read-zone.conf`, `scripts/tests/practice-read-limit.test.sh`.
- Assets: `apps/web/public/images/topics/` (two mathematical SVGs).
- Contracts: `docs/SPEC.md`, `docs/FRONTEND.md`.

### Do NOT touch
- Authored lesson content, bank/checker data, progress storage keys, deployment and course behavior.
- Reference image supplied by the user must be preserved.

## Contracts

See `docs/SPEC.md` §3–§5, `docs/FRONTEND.md`, and Files above.

## Gate Checks

Use [STACK](../../STACK.md) affected-area Critical Gate. Additionally verify the approved
production build/prerender and targeted topic browser scenarios with Playwriter, including
slow/failed API, hydration/assets, no-JS and desktop/mobile layout stability.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Summary transport stays in the owning page API: no other slice consumes this catalog-specific aggregate.
- Verification and browser evidence: [acceptance record](../../artifacts/126-ege-catalog/verification.md).
- Final [review and audit](../../artifacts/126-ege-catalog/final-review.md): no unresolved functional blockers. Fallow retains advisory complexity/state-selector warnings, reviewed as bounded local code; no suppressions added.
- E2E language-server diagnostics retain the documented Playwright package-resolution limitation; actual browser tests and repository lint pass.

## Commit Message

```
feat(change-126): redesign EGE catalog and lesson progress
```
