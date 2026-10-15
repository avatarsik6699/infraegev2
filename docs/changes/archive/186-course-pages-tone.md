# CHANGE 186 — Course pages: audit and course tone

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `186` |
| Slug | `course-pages-tone` |
| Title | Course pages: audit and course tone |
| Status | `archived` |
| Branch | `feature/186-course-pages-tone` |

---

## Goal

Continue the Change 185 UI/UX audit on `/courses/python`, `/courses/excel` and their lessons. Give
each course a recognisable identity in its own colour: Python in blue, Excel in green. Today the
tone (Python sky, Excel sage) lives only on the course cards, and the overview and lesson pages are
neutral. The course scenes are almost grey, so the colour must come from the page around them.

Constraints to resolve in DESIGN.md (F2):
- The course tone becomes a named exception to the No Section Colour Rule and the Cover Rule. A
  course is an object with its own identity, not a site section; `/ege` and `/practice` stay
  neutral.
- One Meaning Rule:
  - Python uses `sky-strong` / `sky-ink`, never the link blue. Links stay link-blue.
  - Excel uses the teal-green `sage-strong`, never `success`. Checks and results stay `success`.
  - The orange "here" mark stays.
- No pastel-filled buttons: the primary CTA stays ink.

---

## Backlog

<!-- This list is OPEN, not a fixed scope: /work appends new items here when the architect reports
     findings/fixes/follow-ups mid-session — it does not fix them off-list.
     IDs are stable after assignment — never renumber. Mark removed items as ~~BN~~ (removed).
     New items always take the next unused ID in their group, appended at the end. -->

### Other
- [x] `T1` UI/UX audit report (artifact, https://claude.ai/artifact/GerahZu7mnXSeUb68XUeCr; architect took all 15 findings К1–К15 as F5–F19) — _Depends on:_ —
  - Playwriter at 1440, 960 and 390. Guest on 127.0.0.1, member on localhost.
  - Pages: both overviews, one lesson of each course, the final project, a planned lesson and the
    in-lesson practice.
  - States: hover/focus, accordion open and closed, progress, guest lock.
  - Each finding gets a screenshot, P1–P3, a fix and the files. The architect picks the findings,
    which then become F-items.

### Frontend
- [x] `F1` Course tone mockups (artifact, review point; https://claude.ai/artifact/XLoWcZUojrWjyXkX4TdRPm, v3 approved) — _Depends on:_ T1
  - Python and Excel at 1440 and 390.
  - (a) Restrained: hero scene plate with the course pattern, `CourseChip` by the title, module
    numbers in `--course-strong`, tinted progress, a tone hairline on the fact cards.
  - (b) Recognisable traits:
    - Python: `>>>` mono numbering, blue indentation guides, a code ruler.
    - Excel: column letters and row numbers, a cell grid in the hero, the green selected-cell
      frame with a fill handle on the current lesson.
  - A lesson-page strip for each variant. The architect picks the variant and the scope (overview
    only, or lessons too).
- [x] `F2` Course tone tokens and DESIGN.md — _Depends on:_ F1
  - Semantic `--course-tone` / `--course-strong` / `--course-ink`, set by `data-course-tone`.
  - Computed contrast of the ink tones.
  - The Course Tone Rule and a Do/Don't entry. Update Cover Pastels and Course cards.
- [x] `F3` Course overview in the chosen variant — _Depends on:_ F2
- [x] `F4` Course lesson pages: header chip and rail module numbers, only if the scope includes
  lessons — _Depends on:_ F2
- [x] `F5` К1: course tone on the overview, so Python and Excel differ by colour (done through F3) — _Depends on:_ F2
- [x] `F6` К2: under 48rem show the course scene under the title, full width, on the tone plate, height reserved — _Depends on:_ F2
- [x] `F7` К3: guest progress shows the course size («14 уроков · 55 задач») and a plain login link, no overlay on the numbers — _Depends on:_ —
- [x] `F8` К4: the second stat label «практика» becomes «задач решено» — _Depends on:_ —
- [x] `F9` К5: no empty progress track on unstarted modules (hidden or tinted, per F1) — _Depends on:_ F1
- [x] `F10` К6: hide «Практика: 0 из 0» and its status icon on lessons without tasks — _Depends on:_ —
- [x] `F11` К7: drop the «дополнительный урок» mark inside the «Дополнительно» module — _Depends on:_ —
- [x] `F12` К8: practice task does not repeat its title as the first line of the statement — _Depends on:_ —
- [x] `F13` К9: scroll-to-top button never covers the footer links — _Depends on:_ —
- [x] `F14` К10: course title in the lesson rail links to the overview, with the course chip — _Depends on:_ F2
- [x] `F15` К11: mobile lesson navigation label names the course («Excel · урок 1.1») — _Depends on:_ —
- [x] `F16` К12: breadcrumbs on narrow widths do not wrap with a leading «›» — _Depends on:_ —
- [x] `F17` К13: replace the generic «Как идёт курс» fact with a course-specific «Что получится в конце» — _Depends on:_ —
- [x] `F18` К14: spreadsheet active cell in the Excel green frame with a fill handle (courses and topic 3) — _Depends on:_ F1
- [x] `F19` К15: the hero scene sits on the tone plate, not on the engineering grid (resolved by F20: no plate, the backdrop fades out before the picture) — _Depends on:_ F2
- [x] `F20` Architect (F1 review): variant b chosen. Hero illustrations get no tone plate (that supersedes the plate in F6 and F19); the scene sits on the page itself — _Depends on:_ F1
- [x] `F21` Larger course scene in the overview head — _Depends on:_ F20
- [x] `F22` Quieter b background motif (Python editor lines/gutter, Excel sheet headers/cells), especially on phones, where it competed with the text — _Depends on:_ F20
- [x] `F23` No hard edge between head and body: the motif fades down and to the right, the head loses its bottom rule — _Depends on:_ F22
- [x] `F24` Redesign «Чему научитесь» / «Что понадобится», now plain bordered text blocks — _Depends on:_ F20
- [x] `F25` Mockup defect: the mastered check in the lesson rail wraps under the number; it sits left of the lesson title — _Depends on:_ —
- [x] `F26` Lessons of both courses (overview rows and lesson rail): a plain green check when the lesson is mastered, no mark otherwise (the empty circle goes) — _Depends on:_ F25
- [x] `F27` Course pages: the primary action («Начать курс» / «Продолжить») in the course colour instead of black (white text ≥ 4.5:1: Python #3f6aa6, Excel #347a66). Moving every black button on the site is a later change — _Depends on:_ F2
- [x] `F28` Architect: the course buttons are still black on the course pages; the primary must show the course action shade — _Depends on:_ F27
- [x] `F29` Architect: «К программе курса ↓» in the course colour — _Depends on:_ F2
- [x] `F30` e2e after the course work: the guest course card on `/courses` stays «Прогресс загружается» (course-catalog), and smoke @no-js overflows 391 > 390 px. Smoke: the no-script topic list on `/practice` (Change 185) widened the filter row; fixed. Course card: `course-catalog` «truthful metadata» fails the same way on clean `main` (isolated worktree run, 2/2), so it predates 186; reported to the architect — _Depends on:_ F29
- [x] `T2` Architect (2026-10-15): the same treatment for the EGE topic pages (report: https://claude.ai/artifact/2ot9Hcq238yL3Sy7wyKXQS). Start with an audit report (artifact) of `/ege`, subtopic lessons and «Практика и итог» at 1440/390, guest and member; the architect picks the findings — _Depends on:_ F30
- [x] `F31` EGE identity mockups (artifact, review point; https://claude.ai/artifact/2AZmqm5sfWH6Y1tajnU4Po). One identity for all topics in the base grey + orange (no new hue; lilac rejected). The exam-paper motif: squared paper and the answer-blank strip. Orange accents for numbers, progress and the jump link; button variants (ink / dark orange / ink with orange hover) — _Depends on:_ T2
- [x] `F32` EGE palette tokens and DESIGN.md (an «Exam Paper Rule» amendment beside the Course Tone Rule: orange's second use, contrast) — _Depends on:_ F31
- [x] `F33` `/ege` catalog in the chosen variant — _Depends on:_ F32
- [x] `F34` EGE subtopic lessons: rail root, markers, eyebrow, buttons and links in the identity — _Depends on:_ F32
- [x] `F35` «Практика и итог»: head, outcomes row, primary «Проверить» — _Depends on:_ F32
- [x] `F36` Э1: EGE identity (exam paper, grey + orange), the topic illustration in the topic head (via F31–F35) — _Depends on:_ F32
- [x] `F37` Э2: the first subtopic has one topic head and a smaller subtopic title, not two big headings — _Depends on:_ F31
- ~~`F38`~~ (removed: the architect keeps the catalog rows as they are, see F47)
- ~~`F39`~~ (removed: rows stay as they are, see F47)
- [x] `F40` Э5: on the first subtopic the phone back link goes to «← Темы ЕГЭ» — _Depends on:_ —
- [x] `F41` Э6: rail «Темы ЕГЭ» links to `/ege` with the EGE mark; the rail scrolls to the open topic; numbers in the identity — _Depends on:_ F32
- [x] `F42` Э7: phone rail label names the task («Задание 3 · 1 из 7») — _Depends on:_ —
- [x] `F43` Э10: «Практика и итог» eyebrow «Задание 16 · Практика и итог» in the identity colour — _Depends on:_ F32
- [x] `F44` Э8: keep the identity orange to lines and numbers (no fills beyond the chosen button edge); the goal-scale bars stay as they are with the rows (F47) — _Depends on:_ F31
- [x] `F45` Э9: the `/ege` head summary breaks only between its pairs — _Depends on:_ —
- [x] `F46` Architect (F31 review): no answer-blank strip (registration mark, subject line, answer cells) — it pulls attention. The squared-paper backdrop alone, on the `/ege` head and the lesson topic head — _Depends on:_ F31
- [x] `F47` Catalog rows stay as they are; only the filled progress bar takes the EGE orange — _Depends on:_ F32
- [x] `F48` Lesson topic head: no illustration, no duplicated number box; the eyebrow is just «Задание 16», and level and time join the meta line («7 подтем · 42 задачи + 15 дополнительных · повышенный · ≈ 9 мин») — _Depends on:_ F46
- [x] `F49` The rail «ЕГЭ» mark is filled with the light orange (the mockup's border colour) and white letters, like the course chip — _Depends on:_ F32
- [x] `F50` Buttons on the EGE pages: variant c — ink with a light orange bottom edge on primary and secondary buttons (hover, active, focus and disabled checked); the soft «Подсказка» / «Решение» get no edge — _Depends on:_ F32
- [x] `F51` Architect: the «ЕГЭ» mark is too light; a darker orange fill (`--color-exam-badge` #d0651a; outcome rules keep the light exam mark) — _Depends on:_ F49
- [x] `F52` Architect: the black button showed a black line around its orange edge; the edge is now a solid shadow under the button, no blur (architect's suggestion), so the button stays whole and no fill shows around the edge — _Depends on:_ F50
- [x] `F53` Architect: drop the orange button edge altogether; the EGE buttons stay ink. The ink should be a near-black, not literal black: it already is #17191e, and the architect kept it — _Depends on:_ F52
- [x] `F54` Architect: «Проверьте себя» shows its questions as tabs, like the practice block, instead of one long list (shared `Checkpoint`: tabs «Вопрос N», a stacked list without scripts, no strip for one question) — _Depends on:_ —
- [x] `F55` Architect: no «Следующий вопрос →» in «Проверьте себя» — the tabs already switch questions — _Depends on:_ F54

---

## Files

### Create / modify
~~~
apps/web/src/entities/course/course-cover.tsx
apps/web/src/entities/course/course-cover.module.css
apps/web/src/pages/course-overview/**
apps/web/src/pages/course-lesson/**
apps/web/src/widgets/course-navigation/**
apps/web/src/shared/components/lesson-tree/lesson-tree.module.css
apps/web/src/app/styles/theme.css
apps/web/src/app/styles/tokens.css
DESIGN.md
apps/web/e2e/pages/course-catalog.page.ts (only if selectors change)
~~~

### Do NOT touch
- The API (`apps/api/**`) and the course content and lesson bodies.
- `/ege`, `/practice` and home styling.
- `scripts/mascot/course_scenes.py` and the scene WebP files.

---

## Contracts

See `docs/SPEC.md` §3–§4 (and §5–§7 where relevant) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

Affected e2e before `/ship`: `course-catalog.spec.ts`, `accessibility.spec.ts` (plus the production
set from the isolated audit script).

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| fa354b0 + working tree | format, web-lint, web-typecheck, docs-links; vitest 68 files / 489 tests; isolated e2e (topic-*, accessibility, smoke, practice-*, account-integration, course-catalog), 93 passed / 1 failed (course-catalog guest card, fails the same on clean main) | PASS (gates, vitest); e2e: known pre-existing failure only | — |

---

## Implementation Notes

- The course palette (`--course-tone/strong/ink/action`) moved to `entities/course/course-identity.module.css`; the card `.tone` composes it. Pages set `data-course-tone` and `courseIdentity.palette` on their root.
- A page may not override `--control-*` (verify-design-system), so the shared button reads `--primary-fill` / `--primary-fill-hover` with the control tokens as fallbacks; the overview sets them to the course action shade. Progress bars use the existing `--progress-*` hooks; the lesson tree got `--lesson-tree-marker` / `--lesson-tree-guide`.
- Contrast, white on the action shades: Python #3f6aa6 5.49:1, Excel #347a66 5.09:1 (the strong shades were 4.62 and 4.39).
- The lesson tree's done mark is now a green check in its own slot before the label, for course and EGE rails alike (the EGE rail used to swap the number for a check). The course rail learns mastery from the course practice summary, loaded beside the lesson (a failed summary marks nothing; a guest sees no checks, as on the overview).
- The spreadsheet's selected cell is green with a fill handle wherever the sheet block appears (Excel course and topic 3).
- F28 cause: the dev server kept the old button CSS (the known Vite `composes` quirk); the lesson pages now set `--primary-fill` too, so «Проверить» takes the course colour. F29 adds the matching `--link-fill` hook in `shared/styles/link.module.css`.
- EGE (F32–F50): tokens `--color-exam-ink/mark/edge/paper`; `ExamPaper` / `ExamMark` in `entities/topic-catalog`; the shared button reads `--button-edge`, the lesson intro takes `backdrop` and `examMeta`. The rail's root links needed `activeOptions.exact` — TanStack marked «Темы ЕГЭ» and the course title `aria-current="page"` by prefix. The rail scrolls itself (never the page) to the open file. Breadcrumbs pick the phone back link as the nearest linked ancestor; on a topic's first subtopic the topic crumb is not a link.
- F12 strips a statement's lead sentence when it only repeats the title (about 60 bank tasks, mostly Python and Excel), in every view that shows the title above the statement.

---

## Commit Message

```
feat(change-186): course pages tone — Python blue, Excel green, audit
```
