# CHANGE 88 — Unify concept-block styling and consolidate self-check into «Итоги»

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `88` |
| Slug | `concept-block-unification-checkpoint-consolidation` |
| Title | Unify concept-block styling and consolidate self-check into «Итоги» |
| Status | `archived` |
| Branch | `feature/88-concept-block-unification-checkpoint-consolidation` |

---

## Goal

Give `Mistake`, `Checkpoint` and `WorkedExample` a consistent semantic-tinted
background treatment (§5.2/§5.3 SPEC), removing `Mistake`'s decorative
vertical/horizontal rules. Consolidate `Checkpoint` from a per-`ConceptBlock`
local self-check into a single lesson-wide block rendered inside the «Итоги»
(`result`) section (SPEC §1.4/§3, updated by this change) — migrate all 30
existing `*.lesson.tsx` files to the new single-checkpoint shape.

---

## Design References

<!-- none provided -->

---

## Backlog

### Frontend
- [x] `F1` Add `--color-info-soft` and `--color-success-soft` tokens in `apps/web/src/app/styles/tokens.css`, following the existing `--color-danger-soft` `color-mix(in oklch, var(--color-X) 8%, var(--color-surface))` pattern — _Depends on:_ —
- [x] `F2` Restyle `Mistake`: drop `.root`'s left-rule border and the `.comparison + .comparison` top divider; give each `.comparison[data-status]` row its own soft background (`--color-danger-soft` / `--color-success-soft`) and `border-radius: var(--radius-surface)` — _Depends on:_ `F1`
- [x] `F3` Restyle `Checkpoint`: set `background: var(--color-info-soft)` and `border-radius: var(--radius-surface)` on `.root`, drop the `--learning-alert-accent-border` left rule — _Depends on:_ `F1`
- [x] `F4` Restyle `WorkedExample`: set `background: var(--surface-tonal-1)` and `border-radius: var(--radius-surface)` on `.root` (component-local override of the existing `--learning-panel-*` hooks in `patterns.module.css`) — _Depends on:_ —
- [x] `F5` Update `docs/FRONTEND.md`'s `Checkpoint`/`Mistake` "left-rule weight" passage (~lines 168-189) to document the new shared contract: quiet semantic-tinted fill + `--radius-surface`, no border, no divider lines — _Depends on:_ `F2`, `F3`, `F4`
- [x] `F6` Remove `ConceptBlock.checkpoint` from `apps/web/src/entities/lesson/lib/define-lesson.types.ts`; update `Definition.checkpoint`'s doc comment to describe it as the lesson's single self-check, rendered inside «Итоги» — _Depends on:_ —
- [x] `F7` Remove the standalone `checkpoint` nav/section entry from `apps/web/src/pages/topic-lesson/topic-lesson-page.tsx` (~lines 56-65, 112-117) and `apps/web/src/pages/course-lesson/course-lesson-page.tsx` (~lines 54-55, 96-98) — _Depends on:_ `F6`
- [x] `F8` Render `<Checkpoint items={props.lesson.checkpoint} />` inside `topic-lesson-result.tsx` and its course counterpart, after the "Что получилось" `Typography.Prose`, conditional on `props.lesson.checkpoint` — _Depends on:_ `F6`, `F7`
- [x] `F9` Update `docs/FRONTEND.md`'s adjacency/merge prose (~lines 168-175, "Two directly adjacent lesson steps...") to state the new rule: at most one `Checkpoint` per lesson, authored once at `Definition.checkpoint`, rendered inside «Итоги» — `ConceptBlock`-level checkpoints no longer exist — _Depends on:_ `F6`
- [x] `F10` Migrate all 30 `*.lesson.tsx` files (`apps/web/src/entities/lesson/content/*.lesson.tsx`, `apps/web/src/entities/course/content/*.lesson.tsx`): walk each `theory` array in reading order, pull every `ConceptBlock.checkpoint` item out (disambiguating any `id` collisions), delete the field from each `ConceptBlock`, and append the collected items in original order into the lesson's single `checkpoint:` array (merged after any existing lesson-level items) — _Depends on:_ `F6`, `F7`, `F8`
- [x] `F11` Update `apps/web/tests/lesson-design-system.test.tsx` (~lines 323-332, pinned to `rekursiya.lesson.tsx` having 4 `Checkpoint` sections with `[2,2,2,1]` items) and sweep for any other test asserting the old per-concept `Checkpoint` count/placement, to expect exactly one `Checkpoint` region inside the result section with all items merged — _Depends on:_ `F10`
- [x] `F12` (architect finding) `Checkpoint.root`'s vertical padding (`--space-0-5` = 0.25rem) is too tight against its new tinted background — content presses against the top/bottom edge. Increase top/bottom padding in `checkpoint.module.css` — _Depends on:_ `F3`
  — fixed: `--learning-alert-padding` default changed to `var(--space-1-5) var(--space-2)`, matching `Callout`'s padding convention for a tinted-fill surface.

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify
~~~
apps/web/src/app/styles/tokens.css
apps/web/src/shared/components/learning-content/mistake/mistake.module.css
apps/web/src/shared/components/learning-content/checkpoint/checkpoint.module.css
apps/web/src/shared/components/learning-content/worked-example/worked-example.module.css
apps/web/src/entities/lesson/lib/define-lesson.types.ts
apps/web/src/entities/course/course.types.ts
apps/web/e2e/pages/topic-lesson.page.ts
apps/web/src/pages/topic-lesson/topic-lesson-page.tsx
apps/web/src/pages/course-lesson/course-lesson-page.tsx
apps/web/src/pages/topic-lesson/components/topic-lesson-result.tsx
apps/web/src/pages/course-lesson/components/course-lesson-result.tsx
docs/FRONTEND.md
apps/web/src/entities/lesson/content/preobrazovanie-zapisey-chisel.lesson.tsx
apps/web/src/entities/lesson/content/rekursiya.lesson.tsx
apps/web/src/entities/course/content/*.lesson.tsx (28 files — see `ls apps/web/src/entities/course/content/`)
apps/web/tests/lesson-design-system.test.tsx
~~~

### Do NOT touch
- `apps/web/src/shared/components/callout/*` — unrelated general-purpose component, not part of the concept-block family
- `content/tasks/**` — practice data, out of scope
- Backend (`apps/api` or equivalent) — no API/schema contract touched
- `docs/SPEC.md` §5.3 Design System baseline (ALCHIMIA profile) — this change is a component-level tweak, not a new design baseline

---

## Contracts

See `docs/SPEC.md` §1.4, §3 (updated by this change) and §5.2, and the Files list above. Do not
hand-copy schema/type details into this file — the codebase and `SPEC.md` are the source of truth.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](./STACK.md) — this section only records
> change-specific overrides.

None — standard affected-area Critical Gate covers this change (frontend lint/typecheck/Vitest for
`apps/web`, plus a manual Playwright/chrome-devtools visual check per `AGENTS.md` Rule 7).

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- F4: `WorkedExample.root` no longer uses `composes: learningContentRoot from patterns.module.css`.
  In the local dev server, cross-file `composes` cascade order between the composed base rule and
  the local override rule was not reliable (observed via browser devtools: the composed
  `patterns.module.css` rule sometimes loaded after the local one, silently discarding the new
  padding/radius/background). Replaced with a standalone `.root` rule duplicating the small base
  declaration set (`display`, `gap`, `margin`) inline, matching how `Checkpoint` already avoids
  `composes` for this reason. `patterns.module.css`'s `learningContentRoot`/`learningContentHeading`
  are unchanged and still used elsewhere (`Checkpoint.heading`).
- `CourseTypes.ConceptBlock`/`LessonDefinition` in `apps/web/src/entities/course/course.types.ts`
  duplicate the `LessonContent` shapes in `define-lesson.types.ts` and needed the same
  `checkpoint` field removal/doc-comment update — not listed in the original Backlog (found during
  `tsc --noEmit`), added to Files.
- `apps/web/e2e/pages/topic-lesson.page.ts` had Playwright assertions pinned to the old
  `Checkpoint` count (4/5 separate regions) and to `Mistake`/`Checkpoint` sharing a
  `border-left`-based geometry contract; updated counts to 1 and replaced the border comparison
  with a tinted-background comparison. E2E specs are outside the Critical Gate and were not
  executed as part of this change's gate.

---

## Commit Message

```
feat(change-88): unify concept-block styling, consolidate self-check into «Итоги»
```
