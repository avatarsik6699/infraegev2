# CHANGE 171 — Lesson pipeline platform and topic 25

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `171` |
| Slug | `lesson-pipeline-platform` |
| Title | Lesson pipeline platform and topic 25 |
| Status | `active` |
| Branch | `feature/171-lesson-pipeline-platform` |

---

## Goal

Give the site the lesson blocks that the binding [lesson pipeline](../runbooks/lesson-pipeline.md)
(stage 9) relies on, and rebuild EGE topic 25 on them from the approved demo stand
(`docs/artifacts/lesson-design/topic-25/`). After this change every later topic is transferred
without platform work.

Architect decisions 2026-10-08:
1. Exact code-generated SVG diagrams are a lesson medium (SPEC §2.3).
2. Components and the topic 25 transfer go in one change.
3. Mastery counts only core subtopics and the final page (SPEC §1.4, §3).
4. The old `integer-processing` lesson, its route and its eight tasks are replaced completely, with no redirects.
5. Every subtopic may end with its own self-check (SPEC §1.4).

Contract: [SPEC](../SPEC.md) §1.4, §2.2, §2.3, §3, §5 (v2.26), [FRONTEND](../FRONTEND.md),
[DESIGN](../../DESIGN.md), [lesson-patterns](../runbooks/lesson-patterns.md).

---

## Backlog

### Backend
- [x] `B1` Lesson membership flag that keeps a task outside the mastery total (default: counted). Covers:
  - bank schema (`Membership`) and validation;
  - import;
  - lesson-practice and course/topic summary totals;
  - OpenAPI and the generated client (`pnpm api:check`);
  - pytest for totals with and without flagged tasks.

  — _Depends on:_ —

### Frontend
- [x] `F1` Lesson model: `Subtopic.level` (`core` | `advanced`, default `core`) and an optional `Subtopic.checkpoint`. `subtopicErrors` requires at least one core subtopic and all advanced subtopics after all core ones. Unit tests in `lesson-subtopics.test.ts`. — _Depends on:_ —
- [x] `F2` Mastery from the B1 flag everywhere lesson progress is shown:
  - lesson progress panel;
  - «Практика и итог» result;
  - topic catalog;
  - account dashboard per-topic rows;
  - guest `0 из N`.

  Advanced tasks keep their solved state. — _Depends on:_ B1, F1
- [x] `F3` Level in navigation, text only, no new colour:
  - lesson tree: advanced subtopics after core ones, marked «дополнительный уровень»;
  - subtopic head kicker;
  - pager;
  - SSR and no-JS identical. — _Depends on:_ F1
- [x] `F4` Subtopic self-check: render `Subtopic.checkpoint` at the end of the subtopic page, after its tasks, with the existing native-`details` Checkpoint. It does not count as practice. — _Depends on:_ F1
- [x] `F5` `LessonTable` in `shared/components/learning-content`:
  - semantic `table` with header cells;
  - numeric columns right-aligned in the mono face with tabular figures;
  - horizontal scroll only inside its own container;
  - readable at 375 px.

  Component test. — _Depends on:_ —
- [x] `F6` `ProofDisclosure`: native `details` closed by default, summary «Доказательство …», full text in SSR. Component test. — _Depends on:_ —
- [x] `F7` `LessonDiagram`:
  - repository-generated SVG file with reserved intrinsic size;
  - `alt` and one caption;
  - placed after the paragraph it explains.

  Extend the `lesson-media-placement` contract to diagrams. Component test. — _Depends on:_ T1
- [x] `F8` `LessonStepper` over generated frame sets:
  - manual ←/→ and «Воспроизвести»/«Пауза»; no autoplay; reduced motion keeps manual stepping only;
  - caption in an `aria-live` region;
  - without scripting: the final frame and an ordered list of every step caption.

  Browser access goes through the owning adapter. Component and e2e test. — _Depends on:_ T1
- [x] `F9` `MaskSandbox`:
  - TypeScript port of the mask segmentation from `scripts/lesson_design/figures.py` (`_segment`), with unit tests on the same cases as the stand: 120034, 1239934, 152 accepted; 12304 rejected; non-digit input rejected;
  - enhancement only: without scripting, a static worked alignment shows instead. — _Depends on:_ —
- [x] `F10` Topic 25 lesson from the demo stand. Identity:
  - new id `divisors-and-masks`, route `25-deliteli-i-maski`, title «Делители и маски», `taskNumbers: [25]`.

  Structure:
  - six subtopics: five core, one advanced («Вид числа по количеству делителей»), plus «Практика и итог»;
  - one `ConceptBlock` per pipeline step: short `navLabel`, the claim sentence first in `explanation`;
  - texts verbatim from `topic-25/*.md`;
  - tables → F5, proofs → F6, diagrams → F7, steppers → F8, sandbox → F9;
  - stand page 7 → `examFocus` / `result` / lesson `checkpoint`;
  - each subtopic's «объясни, почему» questions → its F4 checkpoint;
  - code lines ≤ 64 characters.

  — _Depends on:_ F1, F4–F9, T1, T2
- [x] `F11` Retire the old lesson:
  - delete `integer-processing.lesson.tsx`;
  - remove its publication, registry, index and topic-catalog entries;
  - remove its tests and e2e page-object references.

  No redirect. `/ege/25-obrabotka-celyh-chisel` becomes an ordinary not-found page. The topic catalog links task 25 to the new route. — _Depends on:_ F10
- [x] `F12` Topic 25 tests:
  - lesson content test: every shown program's printed output matches the code, as in `verify_code.py`;
  - code-line length and media placement;
  - rewritten `topic-25-lesson.spec.ts`: subtopic pages, level marks, stepper, proof, sandbox, no-JS, mobile, mastery excluding advanced tasks;
  - accessibility pass.

  — _Depends on:_ F10, F11, D1
- [x] `F13` Fix (found while testing F12): «На этой странице» marks the section the learner
  clicked as current even when it is shorter than the reading line (topic 25 «Главная идея»
  steps), instead of the next section. — _Depends on:_ —
- [x] `F14` Architect review (compact presentation, approved on the stand 2026-10-09): `CodeBlock`
  gets an optional `output` shown under the code inside the same block, several output lines
  joined with «, », no extra background. — _Depends on:_ —
- [x] `F15` Architect review: `TermHint` — a Python term with a «?» button that opens a light
  popover (title, 1–3 sentences, course lesson name, «Читать урок →» to `/courses/python/<slug>`,
  «Закрыть»). Click or tap toggles it, hover opens it on hover devices, Escape closes it; native
  `popover`, so it also opens without the enhancement script. One typed term registry generated
  from `scripts/lesson_design/terms.py`. Component test. — _Depends on:_ —
- [x] `F16` Architect review: `VariantPicker` replaces long enumerations — chips choose one
  variant (`aria-pressed`, live result); plain value or a token row where the chosen members are
  emphasised. Without scripting every variant is listed. Component test. — _Depends on:_ —
- [x] `F17` Architect review: `RemainderExplorer` — the remainder figure with n/d steppers and
  presets «17 и 5», «20 и 5», «3 и 7»; the static 17/5 figure without scripting. Unit test of the
  layout maths. — _Depends on:_ —
- [x] `F18` Architect review: `TopicCheatSheet` on «Практика и итог» from
  `topic-25/cheatsheet.json` — solving order, one block per subtopic linking to it, candidate
  sources and the three checks; three columns on desktop, one on a phone. — _Depends on:_ —
- [x] `F19` Architect review: figures in the site style — Onest labels, ink, one orange accent,
  no blue fills, no hand or monospace fonts. Diagrams and stepper frames render inline so the page
  font applies; stepper controls look like `LessonVideo` (quiet icon buttons, thin step timeline,
  count). — _Depends on:_ T4
- [x] `F20` Architect review: topic 25 lesson re-exported from the compact stand texts — one
  reading flow (no Callout/Mistake boxes), output under code, terms, pickers, remainder explorer,
  cheat sheet; content and lesson tests updated to the `output` convention. — _Depends on:_ F14–F19, T4
- [x] `F21` Architect review: the Python term itself is the hint trigger — running text with a
  muted dotted underline (solid on hover/open) instead of the «?» icon; `InfoPopover` gets a
  `trigger` prop, the stand uses the same look. — _Depends on:_ —
- [x] `F22` Architect review: code line numbers barely visible (`--theme-code-line-number`; they are
  decorative, `aria-hidden` and not copied). — _Depends on:_ —
- [x] `F23` Architect review: the subtopic summary is «Итого» instead of «Коротко» (heading and
  outline label; section ids unchanged because the bank refers to them). — _Depends on:_ —
- [x] `F24` Architect review: «На этой странице» is wider (16–17rem), its rows are compact for a
  mouse (the 44px navigation height stays for coarse pointers), and the title has a text-align
  icon. — _Depends on:_ —
- [x] `F25` Found in testing: the topic 25 practice page had no topic-wide «Проверьте себя» that
  every published lesson carries (`shared-reading` e2e); `export_lesson.py` emits
  `site.checkpoints.praktika` as the lesson checkpoint. — _Depends on:_ —
- [x] `F26` Architect review: no «Решу ЕГЭ» in the lesson — mentions, collection counts and links
  removed from subtopics 1, 2, 5 and 6 (the internal stand page «Частоты» keeps its sources).
  — _Depends on:_ —

### Data
- [x] `D1` Topic 25 bank tasks. Content:
  - the checkable tasks of the six subtopics and the five mixed tasks of the final page, as original tasks;
  - each with statement, hint, worked-solution `explanation`, `answer_instruction` (table answers: rows on one line separated by spaces; the checker already collapses whitespace), difficulty and `exam_numbers: [25]`.

  Links:
  - `theory_links` point to the owning step;
  - membership positions; advanced-subtopic tasks carry the B1 flag.

  Answers come from the computations in `topic-25/checks.py`. Then `pnpm validate:content` and the regenerated practice registry. — _Depends on:_ B1, F10
- [x] `D2` Retire the old eight topic 25 tasks:
  - `archived`, not catalog-visible, no memberships;
  - remove the old material.

  Back up the dev bank before the local import, per the practice runbook, then import. — _Depends on:_ D1
- [x] `D3` API bank tests:
  - replace `test_task_25_bank.py` with independent recomputation of the new answers (full enumeration, not the lesson algorithm);
  - checker accepts each answer and rejects an off-by-one;
  - public payload hides answers;
  - adjust `test_minimal_bank.py`.

  — _Depends on:_ D1

### Other
- [x] `T1` `scripts/lesson_design/export_media.py`:
  - from a topic's `%%builder(…)%%` calls, write SVG diagram files, stepper frame sets and a typed caption manifest into `apps/web/public/lesson-media/<route>/` and the lesson content folder;
  - SVG text uses system fallback font stacks, because webfonts do not load inside `<img>`.

  A check fails when generated files are stale. — _Depends on:_ —
- [x] `T2` `scripts/lesson_design/export_lesson.py`: drafts `*.lesson.tsx` from a topic folder. It maps:
  - steps → ConceptBlocks;
  - tables, code, figure calls and proofs → F5–F8 elements;
  - subtopic tasks out to D1 / F4.

  The draft is reviewed by hand, never published unread. — _Depends on:_ T1, F5–F9
- [x] `T3` Docs:
  - pipeline stage 9 commands (`export_media`, `export_lesson`) and component names;
  - `lesson-authoring.md` for the new blocks;
  - new quality record `docs/artifacts/lessons/25-deliteli-i-maski.quality.md` replacing `25-integer-processing.quality.md`.

  — _Depends on:_ F10, D1
- [x] `T4` Architect review: pipeline tools for the compact form — `build.py` (```output blocks,
  `{{term|label}}`, `:::pick` / `:::pick-tokens`, `<sup>`), `figures.py` restyle and new builders
  (`remainder_widget`, `cheatsheet`), `verify_code.py` output rule, `export_lesson.py` /
  `export_media.py` mapping to F14–F19; runbook, authoring guide, DESIGN.md and the quality record
  updated. — _Depends on:_ —
- [x] `T5` Architect review: audit and unification for future lessons —
  - shared `ChoiceChips` replaces the duplicated chip buttons of `VariantPicker` and
    `RemainderExplorer`; `RemainderExplorer` takes `presets`;
  - `TopicCheatSheet` takes generic `sections` (rows, numbered steps, note) instead of the topic 25
    `candidates`/`checks`; `cheatsheet.json` carries `sections` and `caption`;
  - `export_lesson.py` no longer hard-codes block content: `mask_try(mask, number)` arguments come
    from the source, the remainder caption is one constant in `figures.py`, the cheat sheet links
    derive from the topic folder;
  - Russian plural agreement (`russianCount.of`, `figures.ru_count`) in the remainder labels
    («3 клетки», «4 полные порции»);
  - removed: the `25-compact.html` prototype and its links, the unused Caveat font, dead stand CSS
    (`.card(s)`, `.pair-figs`), duplicate colour constants in `figures.py`. — _Depends on:_ —

---

## Files

### Create / modify
~~~
apps/api/app/modules/practice/{schemas,service,catalog}.py, apps/api/app/modules/account/progress_api.py
apps/api/tests/test_task_25_bank.py, apps/api/tests/test_minimal_bank.py, contracts/openapi.json
apps/web/src/shared/api (generated client)
apps/web/src/entities/lesson/lib/{define-lesson.types,lesson-subtopics}.ts, entities/lesson/index.ts
apps/web/src/entities/lesson/content/{lesson-registry.ts,divisors-and-masks.lesson.tsx (new)}
apps/web/src/entities/lesson/content/integer-processing.lesson.tsx (delete)
apps/web/src/shared/config/lesson-publication.{mjs,d.mts}, entities/topic-catalog/topic-catalog.ts
apps/web/src/shared/components/learning-content/{lesson-table,proof-disclosure,lesson-diagram,lesson-stepper,mask-sandbox}/ (new)
apps/web/src/shared/components/lesson-tree/, widgets/subtopic-navigation/, widgets/lesson-progress-panel/
apps/web/src/features/lesson-progress/, pages/topic-lesson/, pages/account/model/
apps/web/public/lesson-media/25-deliteli-i-maski/ (generated)
apps/web/tests/{lesson-subtopics,lesson-media-placement,lesson-code-line-length,topic-catalog,public-release}.test.*
apps/web/tests/integer-processing-lesson.test.tsx (delete) → divisors-and-masks-lesson.test.tsx
apps/web/e2e/{topic-25-lesson.spec.ts,fixtures.ts,pages/*}
content/practice-bank/bank.json, apps/api/practice-registry.json
scripts/lesson_design/{export_media,export_lesson}.py
docs/runbooks/{lesson-pipeline,lesson-authoring}.md, docs/artifacts/lessons/25-*.quality.md
~~~

### Do NOT touch
- The other six EGE lessons and the Python course (content and routes).
- The answer checker (`apps/api/app/shared/checker.py`): table answers fit the existing normalization.
- `docs/artifacts/lesson-design/topic-25/` texts. They are the source; if a fix is needed, change it there too and rerun `verify_code.py` and `checks.py`.
- Production, push and deploy: release is a later change.

---

## Contracts

See `docs/SPEC.md` §1.4, §2.2–§2.3, §3–§5 (v2.26) and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with explicit `--full`; release selects affected checks and Release Gate. All gates are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

Change-specific additions:

```bash
python3 -I scripts/lesson_design/verify_code.py docs/artifacts/lesson-design/topic-25
python3 -I docs/artifacts/lesson-design/topic-25/checks.py
pnpm validate:content
pnpm --filter web exec playwright test e2e/topic-25-lesson.spec.ts e2e/accessibility.spec.ts
```

Plus a Playwriter pass of all seven topic 25 pages: desktop and 375 px, no-JS, reduced motion. Compare against the demo stand.

---

## Implementation Notes

- B1 has no migration. The flag lives in task content (`content.lessons[]`, written only when
  `false` through `exclude_if`), so unflagged tasks keep their exact stored shape and an older API
  image still reads them after a rollback; the summaries read the flag from that JSON.
  `TaskVersion.counts_toward_mastery` is always present; the frontend treats a missing flag as
  counted.
- The five mixed tasks of «Практика и итог» have no `theory_links`: a link would also place them on
  a subtopic page (`groupTasksBySubtopic`).
- `figures.py`: stepper frames are split from their stand HTML (`STEPPERS`), and `two_arcs` became
  one SVG so the site gets one file per diagram.
- Source remarks addressed to the author («в ваших подборках», «из вашей подборки») and every
  mention of and link to «Решу ЕГЭ» were removed from subtopics 1, 2, 5 and 6 (F26): the platform
  has its own bank and practice. Links to the Python docs stay. The final page's «Что дальше» says «Если задачи этой страницы получаются» because the
  summary now precedes the tasks.

- Compact presentation (F14–F20, T4, architect review 2026-10-09 on the stand): generated
  figures are no longer `<img>` files under `public/lesson-media/`; `export_media.py` writes the SVG
  markup into the typed manifest and `InlineSvg` renders it with `font-family="inherit"`, so labels
  use Onest (all figures ≈ 6 KB gzip). `frontend-architecture` consulted: the Python term registry
  is lesson content (`entities/lesson/content/python-terms.tsx`, generated from
  `scripts/lesson_design/terms.py`), and `PythonTerm` reuses the shared `InfoPopover` with a new
  `inline` native-popover fallback instead of a new shared popover.
- The topic 25 lesson is fully generated by `export_lesson.py`; the former hand edits (learning
  outcomes, self-checks, stepper names, «Что дальше») moved into `topic.json` → `site` and the stand.
  Code-block labels fall back to «Код на Python: <first line>» when no short introducing sentence
  exists. The throwaway `compact_prototype.py` was removed after approval.

---

## Commit Message

```
feat(change-171): lesson pipeline blocks — topic 25, levels, SVG
```
