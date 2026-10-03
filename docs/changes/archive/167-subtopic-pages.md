# CHANGE 167 — Subtopic pages for EGE topics

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `167` |
| Slug | `subtopic-pages` |
| Title | Subtopic pages for EGE topics |
| Status | `archived` |
| Branch | `feature/167-subtopic-pages` |

---

## Goal

Finish the lesson layout of Change 164 (follow-up T6): split every published EGE topic into
authored subtopic pages with their own URLs, a two-level left panel, «Подтема N из M»,
previous/next navigation and a right “on this page” rail, as in the approved v5 mockups.
Authored wording and order, SSR/no-JS reading, progress semantics and existing links keep
working. Contract: [SPEC](../../SPEC.md) §2 (learning path), §3 (model), §5 (routes).

---

## Design References

- Lesson page — [mockups/lesson.html](../../artifacts/change-164/mockups/lesson.html): left panel
  (← Все темы ЕГЭ, topic title, «Задание 16 · 6 подтем», practice summary, numbered subtopics
  with ✓, “Практика · Задачи по теме”), breadcrumb, «Подтема 2 из 6» in `--or`, subtopic
  theory, subtopic practice («Задание 1 из 4»), previous/next pager, right rail «На этой
  странице». Visual system: [DESIGN](../../../DESIGN.md).

Architect decisions (2026-10-03):
- A subtopic is an authored group of adjacent `ConceptBlock`s (about 4–7 per topic); Claude
  proposes the grouping and slugs per topic, the architect approves them (D1).
- Practice: each subtopic page shows the lesson tasks whose theory links point into its
  sections; the topic also keeps a final «Практика и итог» page with all lesson tasks, exam
  focus, result and checkpoint.
- `/ege/{topic}` redirects to the first subtopic; the lesson intro opens that subtopic.
- Subtopic ✓ = every lesson task of the subtopic is solved (derived from existing progress; no
  API change); subtopics without tasks have no mark.

Defaults (no separate decision needed):
- Final page slug `praktika` is reserved and cannot be a subtopic slug.
- Old `/ege/{topic}#{section}` links: the server redirect keeps the fragment, and the client
  moves to the subtopic that owns the section. Without JS the reader lands on the first
  subtopic with the full subtopic list. Practice-catalog theory links point straight to
  `/ege/{topic}/{subtopic}#{section}`.
- A task linked to sections of several subtopics appears in the first one by lesson order.
- Python course lessons stay single-page with in-page anchors.

---

## Backlog

### Data
- [x] `D1` Propose subtopic grouping (adjacent `ConceptBlock` ids, title, ASCII slug) for all 7 published topics and get architect approval before F2 — _Depends on:_ —
- [x] `D2` Author the approved `subtopics` into each `entities/lesson/content/*.lesson.tsx` without changing theory text or order — _Depends on:_ D1, F1

### Frontend
- [x] `F1` Lesson contract: `Subtopic` type and `subtopics` field in `define-lesson.types.ts`; compile/test-time validation (every concept in exactly one subtopic, adjacency, order, unique slugs, reserved `praktika`); registry helpers to find a subtopic by slug and the subtopic that owns a section — _Depends on:_ —
- [x] `F2` Routes: `/ege/$slug/$subtopic` and `/ege/$slug/praktika` with loaders and `head` (title, canonical, description); `/ege/$slug` redirects to the first subtopic keeping the fragment; unknown subtopic → 404 — _Depends on:_ F1
- [x] `F3` Subtopic page: intro on the first subtopic only, breadcrumb, «Подтема N из M», subtopic theory, subtopic practice through `LessonPracticeFlow` with the topic-lesson context, previous/next pager (last subtopic → «Практика и итог») — _Depends on:_ F2
- [x] `F4` «Практика и итог» page: exam focus, all lesson tasks, result and checkpoint, previous link to the last subtopic, next/previous topic — _Depends on:_ F2
- [x] `F5` Left panel: two levels (← Все темы ЕГЭ, topic, «Задание N · M подтем», practice summary, numbered subtopic links with current-item style and ✓ from progress, «Практика» link); mobile disclosure «Подтемы · N из M» works without JS — _Depends on:_ F3
- [x] `F6` Right rail «На этой странице» with the current subtopic's sections and practice; hidden when the page has fewer than two entries — _Depends on:_ F3
- [x] `F7` Link compatibility: client-side hash resolution on the first subtopic, practice-catalog and task-detail theory links to subtopic URLs (`widgets/practice-task/api/get-practice-task.ts`, lesson practice heading links), sitemap/public paths list subtopic and practice URLs — _Depends on:_ F2
- [x] `F8` Tests: unit tests for F1 validation and helpers, page and sitemap tests on the new pages. The e2e migration (`topic-*-lesson`, `topic-reading`, `shared-reading`, `accessibility`, `smoke`, `practice-cutover`, `account-integration`, `public-discovery` to subtopic URLs, plus one `@no-js` subtopic check) moves to the end-of-programme stabilisation change by architect decision — _Depends on:_ F3, F4, F5, F6, F7
- [x] `F9` impeccable critique/audit on the subtopic and practice pages, Playwriter desktop+mobile check, one fix round — _Depends on:_ F8

### Other
- [x] `T1` Update `docs/FRONTEND.md` lesson navigation rules and `DESIGN.md` lesson layout notes if implementation deviates from the mockup — _Depends on:_ F9

---

## Files

### Create / modify
~~~
docs/SPEC.md (updated by /plan)
apps/web/src/entities/lesson/lib/define-lesson.types.ts, define-lesson.ts
apps/web/src/entities/lesson/content/*.lesson.tsx (subtopics field only), lesson-registry.ts
apps/web/src/entities/lesson/index.ts
apps/web/src/routes/ege.$slug.tsx, ege.$slug.$subtopic.tsx (new), ege.$slug.praktika.tsx (new)
apps/web/src/pages/topic-lesson/** (subtopic and practice pages)
apps/web/src/widgets/lesson-outline/**
apps/web/src/shared/styles/lesson-layout.module.css
apps/web/src/widgets/practice-task/api/get-practice-task.ts
apps/web/src/features/lesson-practice/components/practice-task-heading.tsx
apps/web/src/pages/site-discovery/public-paths.ts, routes/sitemap*.ts
apps/web/tests/** (lesson contract tests)
apps/web/e2e/** (topic lesson page objects and specs)
docs/FRONTEND.md, DESIGN.md (T1, only if needed)
~~~

### Do NOT touch
- Theory text and concept order in `entities/lesson/content/*.lesson.tsx`
- Python course lessons and `pages/course-lesson/**` behaviour
- `apps/api/**`, progress tables and the account API
- `.impeccable/critique/`

---

## Contracts

See `docs/SPEC.md` §2, §3 and §5 and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with explicit `--full`; release selects affected checks and Release Gate. All gates are defined in [docs/STACK.md](../../STACK.md) — this section only records
> change-specific overrides.

Per the architect (2026-10-03), e2e (including the affected topic lesson specs), Lighthouse and the
four known dev-bank data failures are deferred to the end-of-programme stabilisation change. This
change ships on the Critical Gate plus `pnpm validate:content`.

---

## Implementation Notes

- D1 grouping approved by the architect on 2026-10-03 as proposed (16: 6, 5: 4, 17/24/25/26/27: 3
  subtopics each); it lives in each lesson's `subtopics` field.
- Routes are `ege.$slug.tsx` (redirect only, `301`, `beforeLoad`), `ege_.$slug.$subtopic.tsx` and
  `ege_.$slug.praktika.tsx`; `praktika` wins over `$subtopic` by static-segment priority. The dev
  container's route generator fails with `EXDEV` on the bind mount, so `routeTree.gen.ts` was
  generated on the host with `@tanstack/router-generator`.
- A task linked to several subtopics shows in the earliest one, so on the dev bank some subtopics
  (e.g. 16 `predydushchie-znacheniya`) have no own practice; all tasks stay on «Практика и итог».
- The page rail hides below 72rem (DESIGN keeps it for desktop only); the left panel becomes the
  «Подтемы · N из M» disclosure below 60rem and stays expanded without JavaScript.
- F9: detector clean on the new UI; axe (WCAG 2.1 AA + best practice) clean at 1440 and 390 px on a
  first, middle and practice page after labelling both `aside` landmarks; no horizontal overflow;
  pager navigation scrolls to top and focuses the new heading; legacy `/ege/16-rekursiya#two-functions`
  lands on `slozhnye-pravila#two-functions`; SSR page has all subtopic links and concepts.
- Architect decision 2026-10-03: e2e, Lighthouse and the dev-bank data failures are handled at the
  end of the redesign programme; the affected topic e2e specs currently fail on the old single-page
  URLs and are migrated there (see F8).

---

## Commit Message

```
feat(change-167): EGE subtopic pages — routes, two-level nav, page rail
```
