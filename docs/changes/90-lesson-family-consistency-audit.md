# CHANGE 90 — Lesson Family Consistency Audit

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `90` |
| Slug | `lesson-family-consistency-audit` |
| Title | Lesson Family Consistency Audit |
| Status | `active` |
| Branch | `feature/90-lesson-family-consistency-audit` |

---

## Goal

Audit `TopicLessonPage` and `CourseLessonPage` — the two parallel lesson-page families — plus the
`Mistake`/`Checkpoint`/`WorkedExample` learning-content trio for drift introduced by Changes 86–89,
which touched one family/component but not always its sibling. Fix confirmed discrepancies so both
lesson families and all three concept-block components stay visually and structurally in sync, per
`docs/FRONTEND.md` §4/§6.1.

**Confirmed discrepancy (browser/code evidence, not a guess):** Change 89 added a capped
`.railSpacer` between `LessonOutline` and the progress block in `CourseLessonPage` to fix an
unbounded gap on short outlines, but never touched `TopicLessonPage`, which has the identical rail
structure (`.railContents` pinned to `100dvh`, `.resultProgress` anchored with `margin-top: auto`)
and therefore has the same unbounded-gap bug on short topic lessons (e.g. exam-task lessons with
few theory items and no `examFocus`).

**Confirmed doc/code drift:** `docs/FRONTEND.md` §4 states `Mistake`, `Checkpoint` and
`WorkedExample` share "the same compact outer padding", but Change 88's F12 architect finding
deliberately increased `Checkpoint`'s padding (`--space-1-5 var(--space-2)`) beyond
`WorkedExample`'s (`--space-1 var(--space-2)`) and `Mistake`'s per-comparison padding
(hardcoded `--space-1 var(--space-2)`, not routed through a shared override token). The wording
was never updated after F12, so the documented contract no longer matches the shipped code.

---

## Design References

<!-- none provided -->

---

## Backlog

### Frontend

- [x] `F1` Mirror Change 89's fix into `TopicLessonPage`: add a `.railSpacer` element (same
  `flex: 1 1 auto; max-height: var(--space-6)` rule, matching `course-lesson-page.module.css`)
  between `<LessonOutline />` and `<TopicLessonProgress />` in
  `apps/web/src/pages/topic-lesson/topic-lesson-page.tsx`, and remove the unconditional
  `margin-top: auto` on `.resultProgress` in `topic-lesson-page.module.css` (keep the narrow-
  breakpoint `margin-top: var(--space-3)` override untouched, matching the course-lesson pattern)
  — _Depends on:_ —
- [x] `F2` Verify with Playwright MCP screenshots at 1280px and the ~72rem/60rem breakpoints: a
  short topic lesson (few theory items, no `examFocus`) shows a capped gap instead of an unbounded
  one, and a long-theory-list topic lesson still bottom-anchors "Прогресс" with no regression;
  confirm 0 console errors/warnings — _Depends on:_ `F1`
  **Verified**: `/ege/16-rekursiya` at 1280×900 before/after — before the rail's leftover space
  collapsed into one unbounded gap above "Прогресс"; after, the gap is capped at the same
  `--space-6` (64px) used by `CourseLessonPage`. Checked 390×844 mobile (unaffected — uses its own
  fixed `margin-top: var(--space-3)` override) and browser console (0 errors/warnings) at both
  viewports. Only 2 published topic lessons exist in this checkout (16 and 19 theory items each),
  neither long enough to force internal rail scrolling and prove full bottom-anchoring under
  overflow — same limitation Change 89 recorded for course lessons; the flex mechanism
  (`flex: 1 1 auto` shrinks toward 0 as content grows) guarantees that behavior structurally, and
  the implementation is a verbatim structural mirror of the already browser-verified
  `CourseLessonPage` fix.
- [x] `F3` Route `Mistake`'s per-`.comparison` padding through a shared override-friendly custom
  property (e.g. `--learning-panel-padding`, matching `WorkedExample`'s pattern) instead of the
  hardcoded `var(--space-1) var(--space-2)` value in `mistake.module.css`, so all three components
  read outer padding the same structural way — _Depends on:_ —

- [x] `F4` (architect finding) The shared `Accordion` component (`apps/web/src/shared/components/
  accordion/accordion.module.css`) draws `border-bottom` on every `.item`, including the last one —
  visible as a stray divider line under the final question in `Checkpoint`'s "Проверьте себя" list.
  Drop the border on the last item (`.item:last-child { border-bottom: none; }` or equivalent) so
  the fix applies uniformly wherever `Accordion` is consumed (`Checkpoint` and the practice-task
  «Подсказка»/«Решение» disclosures), not just one lesson — _Depends on:_ —
  **Verified**: `/courses/python/while` (single checkpoint item + Подсказка/Решение pair) and
  `/ege/16-rekursiya` (7-item checkpoint list) via Playwright MCP — between-item dividers remain,
  only the trailing line under the last item/question is gone; 0 console errors/warnings on both.

### Other

- [x] `T1` Update `docs/FRONTEND.md` §4's "same compact outer padding" sentence (the
  `Mistake`/`Checkpoint`/`WorkedExample` shared-contract passage) to state the actual contract:
  `Mistake` and `WorkedExample` share one compact padding value; `Checkpoint` intentionally uses
  more vertical padding per the Change 88 F12 finding because its content otherwise presses against
  its tinted background's edge — _Depends on:_ —

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
apps/web/src/pages/topic-lesson/topic-lesson-page.tsx
apps/web/src/pages/topic-lesson/topic-lesson-page.module.css
apps/web/src/shared/components/learning-content/mistake/mistake.module.css
apps/web/src/shared/components/accordion/accordion.module.css
docs/FRONTEND.md
~~~

### Do NOT touch
- `apps/web/src/pages/course-lesson/**` — already correct per Change 89, reference implementation
  only
- `apps/web/src/widgets/lesson-outline/**` — already audited/compacted in Changes 85/87/89; the
  40px row height is an accessibility floor, out of scope
- Any `--rhythm-*` token or its consumers
- `Checkpoint`'s own padding value (`--space-1-5 var(--space-2)`) — Change 88 F12 was an explicit,
  browser-verified architect finding; do not revert it to match `WorkedExample`
- Authored lesson/course content (`*.lesson.tsx` theory/practice/checkpoint data) and any component
  or spacing value not explicitly named in the Backlog above

---

## Contracts

See `docs/SPEC.md` §5.3, `docs/FRONTEND.md` §4/§6.1, and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](./STACK.md) — this section only records
> change-specific overrides.

None beyond the standard frontend Critical Gate — browser evidence (short-outline and long-outline
topic-lesson screenshots) is mandatory per `docs/FRONTEND.md` Required Tooling, same as Change 89.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-90): sync topic-lesson rail spacer and concept-block padding docs with course-lesson/Checkpoint fixes
```
