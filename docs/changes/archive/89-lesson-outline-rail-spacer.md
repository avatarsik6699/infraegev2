# CHANGE 89 — Lesson Outline Rail Spacer

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `89` |
| Slug | `lesson-outline-rail-spacer` |
| Title | Lesson Outline Rail Spacer |
| Status | `archived` |
| Branch | `feature/89-lesson-outline-rail-spacer` |

---

## Goal

On short lessons (few/no theory items, "Практика"/"Итог" rendered as empty placeholder groups),
the left rail's `.railContents` is pinned to `100dvh` and `.resultProgress` uses
`margin-top: auto` to anchor "Прогресс" to the bottom — all leftover viewport space collapses into
one large unbounded gap above "Прогресс", which reads as excessive spacing inside the "В этом
уроке" TOC even though the TOC's own item/group gap values are already minimal (audited in Change
85/87). This change caps that spacer with an explicit flex element instead of an unbounded
auto-margin, so short outlines get a modest, fixed-feeling gap while tall outlines keep the
documented bottom-anchor behavior. See `docs/FRONTEND.md` (left-rail / progress-anchoring note).

---

## Backlog

### Frontend
- [x] `F1` Add a capped spacer element (`.railSpacer`) between `<LessonOutline />` and
  `<CourseLessonProgress />` in `course-lesson-page.tsx`'s rail JSX, replacing the unconditional
  `margin-top: auto` on `.resultProgress` with `flex: 1 1 auto; max-height: <token>` on the new
  spacer (start from an existing `--space-*`/`--rhythm-*` token; confirm the exact cap value with
  browser evidence, not a guess) — keep `.resultProgress`'s existing `padding-top`/`border-top`
  separator. Leave the narrow-breakpoint override (`height: auto` / fixed `margin-top`) untouched.
  **Implemented** with `max-height: var(--space-6)` (64px) on `.railSpacer`. — _Depends on:_ —
- [x] `F2` Verify with Playwright MCP screenshots: a short lesson (empty Практика/Итог, few theory
  items) shows a proportionate gap instead of an empty one, and a long-theory-list lesson still
  shows "Прогресс" reading as bottom-anchored (no regression). — _Depends on:_ `F1`
  **Verified**: `/courses/python/pervaya-programma` (5 theory items, matches the reported
  screenshot) before/after via `git stash` — before showed the full unbounded gap, after shows a
  64px gap. `/courses/python/oshibki` (6 items, the longest available in this course's content)
  shows the same capped gap with no regression; no course lesson in this checkout has enough
  theory items to visually fill the viewport and prove full bottom-anchoring, but the flex
  mechanism (`flex: 1 1 auto` shrinks toward 0 as content grows) guarantees that behavior
  structurally. Also checked 390×844 mobile viewport (unaffected — uses its own fixed
  `margin-top: var(--space-3)` override) and browser console (0 errors/warnings) at all three.

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
apps/web/src/pages/course-lesson/course-lesson-page.tsx
apps/web/src/pages/course-lesson/course-lesson-page.module.css
~~~

### Do NOT touch
- `apps/web/src/widgets/lesson-outline/**` (`lesson-outline.module.css` row `min-height`,
  `.groups`/`.children` gaps, `.headingRow` margin) — already audited and near-floor per Change
  85/87; the 40px row height is the repo-wide `--input-min-height` interactive-target convention
  and is explicitly out of scope for this change.
- Any `--rhythm-*` token or its consumers (`patterns.module.css` `.lessonSection`,
  `lesson-theory.module.css` `.concepts`/`.concept`).
- `apps/web/e2e/pages/lesson-page.assertions.ts` (`expectLessonInteractiveTargets`) — must keep
  passing unmodified; this change doesn't touch row heights.

---

## Contracts

See `docs/SPEC.md` §5 and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](./STACK.md) — this section only records
> change-specific overrides.

None beyond the standard frontend Critical Gate — browser evidence (short-outline and
long-outline screenshots) is mandatory per `docs/FRONTEND.md` Required Tooling.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-89): cap rail spacer so short lesson outlines don't leave an unbounded gap
```
