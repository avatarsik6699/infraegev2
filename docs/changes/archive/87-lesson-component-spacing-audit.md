# CHANGE 87 — Lesson Component Spacing Audit

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `87` |
| Slug | `lesson-component-spacing-audit` |
| Title | Lesson Component Spacing Audit |
| Status | `active` |
| Branch | `feature/87-lesson-component-spacing-audit` |

---

## Goal

Audit and, where browser evidence supports it, tighten component-internal micro-spacing in four
lesson learning-content components — `Procedure`, `WorkedExample`, `Checkpoint`, `Mistake` — for
compactness, without letting distinct items/logical blocks visually merge. This is a narrow
follow-up to a broader spacing audit that ruled out two other areas as out of scope (see below).
See `docs/FRONTEND.md` §6.1 and `docs/SPEC.md` §5.3.

**Explicitly out of scope, already investigated and rejected:**
- `LessonOutline` ("В этом уроке") spacing — already compacted in Change 85 (F7/F9); the remaining
  `.groups`/`.children` gaps are minimal and the 40px row height is an accessibility floor tested by
  `expectLessonInteractiveTargets` in `apps/web/e2e/pages/lesson-page.assertions.ts`. Do not touch.
- The 5-role `--rhythm-*` system (content-flow/stage-entry/related-block/concept-separation/
  section-separation) — Change 79's F26 deliberately *increased* the related-block role (12→24px)
  to fix a visual-merging problem. Do not touch any `--rhythm-*` value.

---

## Backlog

### Frontend

- [x] `F1` Audited `Procedure`'s `.steps` gap at `--space-0-5` (4px) on `/courses/python/rekursiya`
  ("Трассируем два направления", 4 steps) at 1280px, 390px and a forced 300px wrap. **Reverted to
  8px (`var(--space-1)`, unchanged)** — evidence: at 300px every step wraps to 2 lines, and with 4px
  gap the wrapped second line of one step (e.g. "…аргумент и немедленный результат.") sits close
  enough to the next item's first line ("2. Проверьте уменьшение…") that the numbered-list `::marker`
  is the only thing preventing them from reading as one continued paragraph — too close to the
  merging failure mode. `no_change_needed`, recorded with a screenshot-based finding, not a guess
  — _Depends on:_ —
- [x] `F2` Audited `WorkedExample`'s `.steps` gap on the same lesson ("Развернём sum_to(3)", 3
  steps) at 1280px, 390px and a forced 300px wrap (all 3 steps wrapped to 2 lines at 300px).
  **Reduced to `--space-0-5` (4px)** — evidence: each step's circular `stepBadge` sits in its own
  grid column, a stronger and more isolated visual anchor than Procedure's inline `::marker`, so
  adjacent wrapped steps stayed clearly distinguishable at 4px — _Depends on:_ —
- [x] `F3` Audited `Checkpoint`'s `.root` gap (heading "Проверьте себя" → `Accordion` content) at
  1280px, 390px and 300px (wrapped 2-line question). **Reduced to `--space-0-5` (4px)** — evidence:
  the heading uses a distinct icon + colored label treatment that reads as self-contained regardless
  of gap size, so the tighter value didn't create ambiguity — _Depends on:_ —
- [x] `F4` Audited `Mistake`'s comparison divider padding at 1280px, 390px and 300px (both
  "Неверно"/"Как правильно" comparisons wrapped to 2+ lines at narrow width). **Reduced to
  `--space-1` (8px)** — evidence: the `border-top` rule line remained the clear visual boundary
  regardless of padding amount, confirming the padding was mostly extra breathing room
  — _Depends on:_ —

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify

~~~
apps/web/src/shared/components/learning-content/procedure/procedure.module.css
apps/web/src/shared/components/learning-content/worked-example/worked-example.module.css
apps/web/src/shared/components/learning-content/checkpoint/checkpoint.module.css
apps/web/src/shared/components/learning-content/mistake/mistake.module.css
docs/changes/87-lesson-component-spacing-audit.md
~~~

### Do NOT touch

- `apps/web/src/widgets/lesson-outline/**` (already audited and compacted in Change 85; the
  remaining gaps and the 40px row height are load-bearing, not stylistic)
- Any `--rhythm-*` token or its consumers (`patterns.module.css` `.lessonSection`,
  `lesson-theory.module.css` `.concepts`/`.concept`) — the 5-role rhythm system
- Lesson/course/task authored content, mastery logic, progress/storage semantics
- Any component or spacing value not explicitly named in the Backlog above

---

## Contracts

See `docs/SPEC.md` §5.3, `docs/FRONTEND.md` §6.1, and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](./STACK.md) — this section only records
> change-specific overrides.

None beyond the standard frontend Critical Gate — browser evidence is mandatory for every item per
`docs/FRONTEND.md` Required Tooling; an item may end up `no_change_needed` if evidence doesn't
support a reduction.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Mid-session pitfall: right after editing CSS and restarting `make dev`'s `web` container,
  `getComputedStyle` briefly kept returning the *old* value (a stale Vite dev bundle) even though
  the on-disk file and the served stylesheet text were already correct — cost one full round of
  screenshots taken against unreduced spacing before the mismatch was caught by comparing the
  stylesheet rule text directly against a computed value. Waiting ~30s after a container restart
  before trusting browser evidence would have avoided it; not a code defect, just a dev-loop timing
  gotcha worth remembering for the next CSS-only change verified this way.
- `Procedure` (F1) is the only item reverted to its original value; `WorkedExample`/`Checkpoint`/
  `Mistake` (F2-F4) were reduced one token step each.

---

## Commit Message

```
fix(change-87): tighten lesson component micro-spacing where browser evidence supports it
```
