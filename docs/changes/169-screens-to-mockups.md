# CHANGE 169 — Screens to the v5 mockups

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `169` |
| Slug | `screens-to-mockups` |
| Title | Screens to the v5 mockups |
| Status | `active` |
| Branch | `feature/169-screens-to-mockups` |

---

## Goal

Bring every page to the approved v5 mockups. A side-by-side audit on 2026-10-03 found the course
lesson, practice task, Python course, EGE catalog, mini-course catalog and status pages still
diverging, plus smaller gaps elsewhere. Architect directive: all pages must match the design plan,
not only the named ones; the earlier topic/course drawings reused across pages are retired in
favour of neutral placeholders until the architect supplies new illustrations.
Contract: [SPEC](../SPEC.md) §5.

---

## Design References

- Mockups: [mockups](../artifacts/change-164/mockups/README.md) (`single.html` holds all pages);
  visual system: [DESIGN](../../DESIGN.md).
- Per page: `home.html`, `ege.html`, `lesson.html` (EGE and course lessons), `practice.html`,
  `practice-task.html`, `courses.html`, `course-python.html`, `account.html`, `auth.html`,
  `privacy.html`, `states.html`, `components.html`.

Defaults (Claude, 2026-10-03; within the approved mockups):
- Placeholders follow the mockups: a neutral soft plate with a dashed edge and no text label in
  the product (labels like `ill-topic-16` are mockup annotations). Home keeps its pastel plates.
- Lesson content media (`public/lesson-media`, lesson figures) stays; only catalog/overview/home
  drawings (`public/images/topics`, `public/images/courses`) are retired.
- Course lessons are not split into subtopic pages; they get the lesson frame only.
- Where the mockup shows data the product does not have (reading time, «700+ задач»), the element
  is omitted rather than invented.

---

## Backlog

### Frontend
- [x] `F1` Retire the old drawings: remove `illustration` from topic/course catalog entries and their consumers (home, `/ege`, `/courses`, `/courses/python`, topic lesson intro if any), delete `public/images/topics` and `public/images/courses`, add one shared neutral placeholder plate; update unit tests and e2e page objects that reference the images — _Depends on:_ —
- [x] `F2` `/ege` per `ege.html`: compact head with placeholder, search + segmented status filter in one row, compact rows, published topics first then compact «Скоро» rows, guest lock card, footer note — _Depends on:_ F1
- [x] `F3` `/courses` per `courses.html`: cards with a top placeholder plate, title, summary, meta line, outcome, bar «Освоено N из 28 уроков», full-width «Открыть курс»; planned cards muted with «Скоро» — _Depends on:_ F1
- [x] `F4` `/courses/python` per `course-python.html`: head with eyebrow, two stats («уроков освоено», «практика»), primary «Продолжить: …» and «К программе курса ↓», placeholder plate; «Что понадобится» and «Как идёт курс» cards; module cards (number, title, «N уроков · статус», bar, chevron) with lesson rows «Практика: X из Y»; «Свернуть/Развернуть всё» — _Depends on:_ F1
- [x] `F5` Course lesson on the lesson frame per `lesson.html`: left panel with the course, its modules/lessons and the current lesson marked, centre column with breadcrumbs and the lesson, right «На этой странице» rail, prev/next pager; old «§ N ·» eyebrows and the separate breadcrumb band go — _Depends on:_ —
- [x] `F6` Practice task page per `practice-task.html`: back button «К списку задач», orange topic eyebrow, h1 = task title, metadata row, statement, «Ваш ответ» label with input and «Проверить», instruction under the input, «Подсказка»/«Решение» disclosures, source card at the bottom — _Depends on:_ —
- [x] `F7` Status pages per `states.html`: 404 and load error as centred cards with placeholder and buttons; empty search/practice/progress states; practice/filter error blocks; check the global loading bar — _Depends on:_ F1
- [x] `F8` Lesson details per `lesson.html`: no visible focus ring on the subtopic h1 after navigation; practice tabs «Задача N» with difficulty icon; left panel «Практика: решено X из Y» under the title if it does not duplicate the progress block — _Depends on:_ —
- [x] `F9` Practice catalog per `practice.html`: topic column «ЕГЭ 16 · Рекурсия», a difficulty filter control in the filter row, active filter chips with «Сбросить всё», head placeholder — _Depends on:_ F1
- [x] `F10` Sweep of the remaining pages against their mockups at 1440 and 390 px (home, account, auth screens, privacy, header/footer, shared components per `components.html`); fix every deviation found in one round — _Depends on:_ F2, F3, F4, F5, F6, F7, F8, F9
- [x] `F11` impeccable detector, Playwriter desktop + mobile screenshots of every page next to its mockup, axe, one batched fix round — _Depends on:_ F10

---

## Files

### Create / modify
~~~
apps/web/src/entities/topic-catalog/**, apps/web/src/entities/course/** (drop illustration data)
apps/web/public/images/topics/**, apps/web/public/images/courses/** (delete)
apps/web/src/shared/components/** (placeholder plate if no fitting component exists)
apps/web/src/pages/{foundation,topic-catalog,course-catalog,course-overview,course-lesson,practice-catalog,practice-task,account,auth*,privacy}/**
apps/web/src/pages/topic-lesson/**, apps/web/src/widgets/**
apps/web/src/routes/** (status/404 components only if needed)
apps/web/tests/**, apps/web/e2e/pages/** (image references)
docs/SPEC.md §5, docs/FRONTEND.md (only if a rule changes)
~~~

### Do NOT touch
- `apps/api/**`, contracts and progress semantics
- `apps/web/src/entities/*/content/*.lesson.tsx` wording and order; `public/lesson-media/**`
- `docs/artifacts/references/**` (source drawings stay in history and references)
- `.impeccable/critique/`

---

## Contracts

See `docs/SPEC.md` §5 and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with explicit `--full`; release selects affected checks and Release Gate. All gates are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

Per the architect (2026-10-03), e2e, Lighthouse and dev-bank data failures are deferred to the
end-of-programme stabilisation change; unit tests and lint follow the Critical Gate.

---

## Implementation Notes

- The lesson frame (three columns, left navigation, pager) moved to
  `shared/styles/lesson-frame.module.css`; topic and course lessons compose it. `LessonOutline` and
  the old frame classes in `lesson-layout.module.css` had no consumers left and were removed.
- Course lesson left panel: the course, the current module's lessons and links to the other
  modules (first published lesson); mastery ✓ is not shown because the lesson page has no course
  summary. Lesson pages keep a single progress block in the panel; the mockup's extra
  «Практика: решено X из Y» line under the title is omitted to avoid duplicated progress.
- Practice task page uses a new `detail` solving layout (visible «Ваш ответ», instruction under the
  input, hint/solution disclosures with h2 headers via `Accordion.headingLevel`); the home try block
  keeps the compact layout (`presentation="embed"`). SPEC §5 updated.
- Heading focus after client navigation ignored a StrictMode effect re-run as the first load; it
  now tracks the last path, so the subtopic h1 no longer gets focused (and ringed) on load.
- Deliberate omissions from the mockups: «12 мин чтения», «700+ задач», «Привет, Имя» (no data);
  the `ege.html` «Гостевой вид прогресса» card is a state demo — the guest lock stays per row.
  Practice filter labels stay visible for accessibility.
- E2E: only the image assertions were migrated (topic catalog placeholders); the rest stays with
  the end-of-programme stabilisation change.
- Verification: Playwriter desktop 1440 and mobile 390 for every page family, axe clean on 14
  routes × 2 widths, no horizontal overflow; impeccable detector: only the accepted page-head grid.

---

## Commit Message

```
feat(change-169): screens to v5 mockups — placeholders, catalogs, lessons
```
