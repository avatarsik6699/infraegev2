# CHANGE 91 — Lesson Outline Compact Density

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `91` |
| Slug | `lesson-outline-compact-density` |
| Title | Lesson Outline Compact Density |
| Status | `archived` |
| Branch | `feature/91-lesson-outline-compact-density` |

---

## Goal

Reduce the visual row height of `LessonOutline` ("В этом уроке") group/child links. The perceived
"large spacing between items" the architect keeps flagging is driven by the `2.5rem` (40px)
`min-height` accessibility floor on `.groupLink`/`.childLink`, not by the (already minimal) `gap`
tokens — this floor was explicitly kept in Changes 85/87/89/90 as "load-bearing, not stylistic."
This change is an explicit, architect-confirmed exception scoped to `LessonOutline` only: shrink
the visible row height while preserving a `40px` invisible/accessible hit area per
`docs/FRONTEND.md` §5 ("compact visuals may use a larger invisible hit area"). Every other
interactive control in the product keeps the ordinary `40×40px` visible floor unchanged.

---

## Design References

<!-- none provided -->

---

## Backlog

### Frontend

- [x] `F1` In `apps/web/src/widgets/lesson-outline/lesson-outline.module.css`, reduce
  `.groupLink`/`.childLink` visible `min-height` (start from `--space-4` / 32px, confirm exact
  value with browser evidence at 1280px/390px against a lesson with mixed 1-line and 2-line
  labels) while adding an invisible larger hit area so the *clickable* region stays `>= 40px` tall
  (e.g. a `::before` pseudo-element sized to `40px` and centered via `inset` around the link, or an
  equivalent technique that doesn't shift adjacent layout) — _Depends on:_ —
  **Implemented** with `min-height: var(--space-4)` (32px) plus a shared `::after` pseudo-element
  (`inset-block: calc((var(--space-4) - 2.5rem) / 2)` = -4px top/bottom) restoring the 40px hit
  area. Removed `overflow: hidden` from the shared `.groupLink, .childLink` rule (it would have
  clipped the expanded pseudo); truncation still works via the existing `-webkit-line-clamp` on the
  inner `<span>`.
- [x] `F2` Verify with Playwright MCP: visible row height is reduced (screenshot before/after on
  `/ege/16-rekursiya`, 1280px and 390px), the invisible hit area is actually `>= 40px` tall
  (measure the interactive/click-catching element, not just the visible link), keyboard focus ring
  still wraps the visible link sensibly, and 0 console errors/warnings — _Depends on:_ `F1`
  **Verified**: `/ege/16-rekursiya` (1280px, 390px) and `/courses/python/while` (1280px, shared
  component). Measured `visibleHeight: 32px` + `::after` top/bottom `-4px` each = 40px hit area;
  confirmed via `elementFromPoint` that a click 2px above the visible box still resolves to the
  anchor. Focus-visible ring wraps the shrunk row cleanly on a 2-line label; the `aria-current`
  active-indicator bar still reads correctly at the new row height. 0 console errors/warnings on
  every page.

### Other

- [x] `T1` Update `docs/FRONTEND.md` §5's interactive-target passage to record this as an explicit,
  narrow, architect-approved exception: `LessonOutline` group/child links use a smaller *visible*
  row while keeping a `>= 40px` invisible/accessible hit area; every other control keeps the
  ordinary visible `40×40px` floor — _Depends on:_ `F1`
- [x] `T2` Update `expectLessonInteractiveTargets` (`apps/web/e2e/pages/lesson-page.assertions.ts`)
  so the `outline` target group asserts against the actual clickable hit-area height (not the
  shrunk visible link height) — keep the `>= 40px` assertion meaningful rather than just lowering
  the threshold — _Depends on:_ `F1`
  **Implemented**: split `outline` out of the generic visible-height loop; it now reads each
  link's `getBoundingClientRect().height` plus its computed `::after` `top`/`bottom` expansion and
  asserts the resulting hit-area height `>= 40`, so the test stays meaningful against whatever
  technique/values `lesson-outline.module.css` uses rather than hardcoding the current -4px.

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify
~~~
apps/web/src/widgets/lesson-outline/lesson-outline.module.css
docs/FRONTEND.md
apps/web/e2e/pages/lesson-page.assertions.ts
~~~

### Do NOT touch
- `.children` gap, `.groups` gap and other already-audited spacing values (Changes 85/87) — only
  the row `min-height`/hit-area technique is in scope
- Any other component's `40×40px` interactive-target floor — this exception is scoped to
  `LessonOutline` only
- `apps/web/src/pages/course-lesson/**`, `apps/web/src/pages/topic-lesson/**` rail-spacer/progress
  logic — unrelated to this change (Changes 89/90)

---

## Contracts

See `docs/FRONTEND.md` §5, and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](./STACK.md) — this section only records
> change-specific overrides.

None beyond the standard frontend Critical Gate — browser evidence (row-height and hit-area
measurements, before/after screenshots) is mandatory per `docs/FRONTEND.md` Required Tooling.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- `lesson-outline.tsx` (JSX) didn't need to change — the shrink + hit-area-restore was fully
  achievable in `lesson-outline.module.css` via a pseudo-element, so it was dropped from the Files
  list rather than touched for no reason.

---

## Commit Message

```
feat(change-91): shrink LessonOutline row height while preserving a 40px accessible hit area
```
