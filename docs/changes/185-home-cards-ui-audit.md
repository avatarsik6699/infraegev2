# CHANGE 185 — Home cards after the references + UI/UX audit

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `185` |
| Slug | `home-cards-ui-audit` |
| Title | Home cards after the references + UI/UX audit |
| Status | `active` |
| Branch | `feature/185-home-cards-ui-audit` |

---

## Goal

Rework the home-page cover cards after the architect's references, and audit the whole site's
UI/UX for visual inconsistencies, style breaks, UX friction and missing functionality. The audit is
published as a report; the architect picks findings that become new Backlog items here.

Decisions (architect, 2026-10-14): the «Выберите путь» path tiles get the full reference style; the
four home topic cards share its skin and keep their illustrations; the icon chip is a saturated
"strong" shade of the card's own pastel, home page only (recorded in DESIGN.md); the audit report
comes first, fixes after the architect's pick.

---

## Design References

- Home path tiles at rest (reference 1): pastel tone gradient fading to the right; a small rounded
  square chip in a saturated shade of the tone with a white glyph; bold ink title; subtitle in a
  dark shade of the tone; a large faint outline watermark of the same icon clipped at the right edge.
- Home path tile on hover (reference 2): the card brightens to near-white with a light wash of its
  tone from the right, a soft white ring and glow; the watermark gains colour.

---

## Backlog

### Frontend
- [x] `F1` Mockup artifact of home path tiles and topic cards with the real tokens: rest and
  forced hover, 1440 and 390; path-tile density (a) compact chip + title + subtitle, (b) plus a
  short description; topic-card task-number chip vs illustration only. Architect review — _Depends on:_ —
- [x] `F2` Path-tile tokens (strong shades of sky, sage, lilac: white glyph ≥3:1, subtitle ≥4.5:1 on its pastel; no apricot strong) and DESIGN.md: home path-tile anatomy, the cover-card head plate with its patterns (P2 for topics, P1 engineering grid for the course card, a home-cover exception to the grid rule), the facts footer, the try card head strip, the watermark motion — _Depends on:_ F11
- [x] `F3` Path tiles as approved in F11: chip spanning title and subtitle, tight subtitle, clipped watermark icon, whole-card stretched link with a card focus ring; hover = 2px lift with raised shadow, the watermark rising, shifting and turning a few degrees in step; nothing moves under reduced motion — _Depends on:_ F2
- [x] `F4` Home topic cards, variant E with P2 (architect, 2026-10-14): head plate on the soft surface with a large mono task number and a few pen marks, the illustration filling the plate; footer «N подтем · M задач» + «Открыть тему →» under a hairline; the feature card sized by its content (B1); `--radius-tile`; stretched link — _Depends on:_ F3
- [x] `F5` Home course card with the P1 head plate (engineering grid) and footer «8 модулей · 30 уроков» + «Открыть курс →», whole-card link; try card gets a head strip (task number, topic, difficulty) and keeps no lift; reduced-motion guard in `foundation-try-demo.module.css` — _Depends on:_ F4
- [x] `F6` Mockup round 2 (architect review of F1, 2026-10-14): compact path tiles (variant A) with a restrained hover instead of the white wash and ring, colours tuned for pleasantness rather than copied from the reference; two clearly different neutral topic-card options close to the original; the feature card «Связанные таблицы» sized by its content like the Python card on `/courses` (B1). Architect review — _Depends on:_ F1
- [x] `F7` Task statements show raw TeX (`F(10^{30})`, `n\%10`) on the task page and in catalog previews (audit A1): render or normalise the notation — _Depends on:_ —
- [x] `F8` Lesson and task counts disagree between pages (audit A2: Python 30 vs 27, Excel 15 vs 14, topic 8 63 vs 56). Rule (architect, 2026-10-15): the main number everywhere is the one progress counts (core lessons and tasks); where there is room the additional ones follow as «+ N дополнительных»; profile and home use the same main number; the `/ege` row stays as it is (B5) — _Depends on:_ —
- [x] `F9` Cards that lift on hover are clickable as a whole (audit A4): home (done in F3–F5) and the account tiles and «Следующий шаг»; `/courses` stays as it is (architect, 2026-10-15, A3) — _Depends on:_ F3
- [x] `F10` Excel course illustration (audit A3, the only accepted part): square and wide pictures drawn in code with the shared pen of `scripts/mascot` (architect, 2026-10-14: «нарисуй кодом самостоятельно какую-нибудь интересную иллюстрацию»); shown on the `/courses` card and the `/courses/excel` head — _Depends on:_ —

- [x] `F11` Mockup round 3 (architect review of F6, 2026-10-14): path tiles keep the subtitle tight under the title; hover is the 2px lift (H2) with the watermark moving in step (rises, shifts, turns a few degrees); topic cards stay variant E but get structure for weight — a head plate with a barely visible pattern (P1 engineering grid or P2 large mono task number with pen marks) and the illustration filling it, and a footer with facts and the action under a hairline; the same for the course card, optionally a head strip for the try card. Architect review — _Depends on:_ F6

- [x] `F12` Path tiles look too small next to the other home cards (architect, 2026-10-14): make them larger with a description and meta information; titles of the three tiles sit at the same height whatever the subtitle length — _Depends on:_ F3
- [x] `F13` More space between the «Темы ЕГЭ» cards and the Python course card; they stick together (architect, 2026-10-14) — _Depends on:_ F5

- [x] `F14` `/courses` cards rework (architect, 2026-10-15; replaces the A3 decision to keep `/courses` as is): the Excel picture is too small to read in the narrow card column. Re-lay out the cards after the home's colour cards, with patterns or textures, and give every course (published and planned) its own picture drawn in code that fits the card. Mockup first, architect review — _Depends on:_ F10
- [x] `F15` Course pictures for the cards and the course page heads. Code-drawn versions rejected 2026-10-15 («шаблонно и безвкусно»); the architect generated four scenes (`docs/artifacts/references/for_new_design/{python_course,excel_course,algos_and_stucts_course,strong_exercisies_course}.png`): coloured, with shading, so they are served as optimised raster (WebP, `srcset`), not traced. The card plate is resized to the pictures so they fill it; the course heads get a larger picture area; optional animated overlays and patterns. Mockup with the real pictures, architect review — _Depends on:_ F18
- [x] `F16` Implement the approved `/courses` cards and course heads; DESIGN.md (pastel on `/courses` is a new exception to the Cover Rule) — _Depends on:_ F15

- [x] `F17` `/courses` review (architect, 2026-10-15): variant A approved (colour only on published courses, planned neutral); the drawn Python snake does not work and the Python dot pattern is too dense — redraw the Python picture and choose another pattern; re-check with the architect — _Depends on:_ F14

- [x] `F18` Prompts for the course pictures (architect, 2026-10-15): style block, ending and one scene per card and head, slot sizes and the PNG requirements of the tracing pipeline — `docs/artifacts/course-illustration-prompts.md` — _Depends on:_ F17

- [x] `F19` Illustration review (architect, 2026-10-15): nothing moves inside the picture areas — no sway, no zoom on hover; only quiet blinking or pulsing that does not draw attention. Pictures are never cropped in cards or heads: they fit whole, with a little (not much) space around — _Depends on:_ F15

- [x] `F20` Illustration plates (architect, 2026-10-15): the background patterns are too loud, and on the Python card the blue tone tints the picture; make the patterns much fainter and keep the picture's own colours. Planned courses keep their pictures in colour — _Depends on:_ F19

- [x] `F21` Excel picture still cut at the bottom (architect, 2026-10-15): rotate it slightly (the diagonal composition allows it) so the whole scene fits the card without shrinking — larger in the card if possible — _Depends on:_ F20

- [x] `F22` `/courses` cards (architect, 2026-10-15): the green and blue card backgrounds clash with other parts such as the progress bar; card backgrounds become neutral, everything else keeps its colour (icon square, the «уровень · уроки» line, the pattern) — _Depends on:_ F16
- [x] `F23` Home course card (architect, 2026-10-15): the Python card still shows the old traced snake; it shows the course's new scene like `/courses` and the course head — _Depends on:_ F16
- [x] `F24` Leftovers (architect, 2026-10-15): remove files and code this change made unused — the traced `course-python.svg`, its `trace.mjs` entry and `folder` option, its README command and source PNGs, the `scene` switch in `ObjectIllustration`, stale CSS, the trace-pipeline wording in the illustration prompts — _Depends on:_ F23
- [x] `F26` Home course card (architect, 2026-10-15): carry over more of the `/courses` card — the course's background pattern behind the picture (instead of the engineering grid), the icon square, the level line, the blinking pen marks; one shared course cover instead of copies in two pages — _Depends on:_ F23
- [x] `F27` Course tone (architect, 2026-10-15): a barely visible gradient of the course's colour on the border, the background pattern and one more quiet detail, on the home course card and the `/courses` cards of Python (blue) and Excel (green); planned courses stay neutral — _Depends on:_ F26
- [x] `F28` `/ege` visual audit (architect, 2026-10-15): research how to improve the topics page — at least the topic rows, e.g. the home cards' patterns, above all the cropped task-number numeral; other findings on the page welcome. Report with a mockup for the architect's pick, then the picked items as new F-items — _Depends on:_ F26
- [x] `F29` `/ege` mockup review (architect, 2026-10-15): variants A and B keep the pattern and the numeral in the picture's left part; style the whole row instead — numeral, pen marks and surface spread over the row — _Depends on:_ F28
- [x] `F30` `/ege` rows, variant C (architect pick, 2026-10-15): flat rows with hairlines; the large task numeral on the right under the progress, cropped by the row's bottom; pen marks over the row's margins and the picture column; a light wash toward the numeral; «Задание N» above the title, the index column removed; progress «Теория · N задач», bar, «Решено x из N» (+ «Продолжить»); unused `summaryText` / `progressStatus` classes removed (E1, E2, E4, E6, E10) — _Depends on:_ F29
- [x] `F31` Planned topics (architect, 2026-10-15): the same anatomy as published ones — «Теория · — задач», an empty bar, «Решено — из —», «Скоро» — so all rows are about one height and the left pictures can grow — _Depends on:_ F30
- [x] `F32` `/ege` at 390 (architect, 2026-10-15): the picture moves to the right of the title instead of shrinking to an icon on the left — _Depends on:_ F30
- [x] `F33` Exam map in the `/ege` head (architect, 2026-10-15, E7): 27 task cells, published / planned, 19–21 as one cell; a cell leads to its row — _Depends on:_ F30
- [x] `F34` Difficulty levels (architect, 2026-10-15, E8): each task's level (базовый / повышенный / высокий) after the FIPI specification, shown on the rows and the map; data checked against the current specification — _Depends on:_ F30
- [x] `F35` Goal plans (architect, 2026-10-15): pick a target — «База · 40+ баллов» (без программирования, только математика и простые решения), «Стандарт · 60+» (проверенные методы и шаблоны), «Хард · 80+» (серьёзное программирование, самые сложные задачи) — and get the topics for it, like education.yandex.ru/ege/inf/plan; research, task-to-plan mapping, mockup, then the feature — _Depends on:_ F34
- [x] `F36` Goal control (architect, 2026-10-15): the «Ваша цель» panel is too large; make it a compact filter — a slider or another interactive control — and give levels a minimal colour: База green, Стандарт blue, Хард red, the same on the exam map — _Depends on:_ F35
- [x] `F37` Goal scale (architect, 2026-10-15): the scale works, the round thumb does not read as the chosen level; remove it or find another indicator — _Depends on:_ F36
- Decided (architect, 2026-10-15): F35 plans as proposed, cumulative by level (База — базовый, Стандарт — + повышенный, Хард — all); topics outside the chosen goal stay in the list, dimmed.
- [x] `F38` `/ege` search and progress filters (architect, 2026-10-15): the «Найти тему» field and the three filter buttons fit the redesign neither in place nor in style; rework them — _Depends on:_ F30
- [x] `F39` Goal block composition (architect, 2026-10-15): drop the «Цель» label; move the goal's description out of the row — a tooltip on a step or one «?» explanation for all goals, whichever is better — _Depends on:_ F37
- [x] `F40` `/ege` control line (architect, 2026-10-15): remove the topic search entirely; the «Все темы / В процессе / Не начаты» filter becomes a minimal dropdown on the right so it does not compete with the goal — _Depends on:_ F38
- [x] `F41` Goal help (architect, 2026-10-15): the «?» is too large and loud — make it minimal and align it with the goal scale on one line — _Depends on:_ F39
- [x] `F42` `/ege` empty result (architect, 2026-10-15): when the progress filter finds nothing the screen's composition breaks — the scene runs full width, the text sits on the left — _Depends on:_ F40
- [x] `F43` `/ege` head (architect, 2026-10-15): more space between the exam map and the head's copy — _Depends on:_ F33
- [x] `F44` Goal help (architect, 2026-10-15): the «?» was still misaligned and too large; then (same day) drop the shared «?» altogether — each goal shows its own description in a tooltip on hover — _Depends on:_ F41
- [x] `T3` UI/UX review and audit of `/ege` after the redesign (architect, 2026-10-15): find and fix what the rework broke or left rough; report the rest — _Depends on:_ F42
- [x] `F45` `/ege` empty result, again (architect, 2026-10-15): the scene is squeezed, the title and the line under it lack weight, the outlined button does not fit; redo the composition — a larger scene, a harmonious block — _Depends on:_ F42
- [x] `T4` `/practice` visual audit and research (architect, 2026-10-15): audit the practice catalog (filters, rows, pagination, inline task, empty and error states, 1440/390) and research how to improve it visually, in the line of the `/ege` redesign; report artifact with findings and mockup directions, the architect picks what becomes F-items — _Depends on:_ —
- [x] `T5` `/practice` variants from the current format (architect, 2026-10-15): directions Б and А of the T4 report declined — the current table format stays; mock up more variants that keep it and still fix every finding П1–П14 — _Depends on:_ T4
- [x] `F46` `/practice` rows after variant В1 (architect, 2026-10-15): no «Формат» column, hash or bookmark; the condition under the title; number and topic in two even lines of «Тема»; the whole row opens the task; order by number, then difficulty; the shared fixes П1, П3, П5–П8, П10–П14 of the T4 report — _Depends on:_ T5
- [x] `F47` `/practice` topic group rows from В3 (architect, 2026-10-15): a root row per exam number in the list — number, topic, FIPI level, «Теория →», «Решено N из M» and the like — _Depends on:_ F46
- [x] `F50` `/practice` topic row (architect, 2026-10-15): the progress bar is too short; make it larger — _Depends on:_ F47
- [x] `F51` `/practice` topic row (architect, 2026-10-15): the bar is now too long — about as long as on the `/ege` topic rows; «Решено N из M» sits at the bar's end, not its start, so a guest (no bar) still sees it at the right edge — _Depends on:_ F50
- [x] `F48` `/practice` filters and search, recomposed (architect, 2026-10-15): rework how search, «Тема», «Прогресс», «Сложность» and «Сортировка» sit together; the topic dropdown keeps its behaviour and content (groups, counts, search inside, apply); picked К3 — search and text selects in a panel over the table, chosen values as chips; no «Прогресс» filter (architect, 2026-10-15: it would need session-aware catalog queries and cookie forwarding from the server function) — _Depends on:_ F46
- [x] `F53` Home «Темы ЕГЭ» grid (architect, 2026-10-15): the group also holds the «Python с нуля для ЕГЭ» and «Excel с нуля для ЕГЭ» course cards; the grid stays asymmetric for the visual effect — _Depends on:_ F26
- [x] `F54` Home grid, again (architect, 2026-10-15): the courses are the heroes — the large cards; the topics stay small, since their illustrations are small and look poor on a large card — _Depends on:_ F53
- [x] `F55` Home grid Г1 (architect, 2026-10-15): the diagonal of courses looks good, but the course cards are too large in it; make them somewhat smaller — _Depends on:_ F54
- [x] `F56` Home grid (architect, 2026-10-15): better, but the topic cards are now squeezed; a non-standard diagonal grid is needed — _Depends on:_ F55
- [x] `F57` Home grid (architect, 2026-10-15; accepted with `/ship 185`): take Д2 — seven columns, rows of different step (a course on three, topics on two, mirrored in the second row); and make the topic illustrations larger — _Depends on:_ F56
- [x] `F58` `/practice` filter panel (architect, 2026-10-15): with a long topic chosen the selects wrap and the panel deforms (the search drops to the middle of a two-line block); «Найдено N заданий» sits too close to the table heading — set the spacing properly and make the panel's layout stable — _Depends on:_ F48
- [x] `F59` `/practice` rows (architect, 2026-10-15): in the topic row move the bar and «Решено N из M» to the row's right edge (the gap there is the grid's chevron column); align the topic number with the title, not centred; in the task rows raise the difficulty word so its bottom nearly meets the bottom of the difficulty glyph — _Depends on:_ F51
- [x] `F52` `/practice` on small screens (architect, 2026-10-15): the «Раскрыть все» toggle sits alone on its own line under «Найдено N заданий»; move it to the right of the count — _Depends on:_ F48
- [x] `F49` `/practice` expanded task (architect, 2026-10-15): no «Открыть отдельно ↗» button; a «↗» beside «Задача 02347089» makes it a visibly clickable link to the task page, not in link blue so it does not pull the eye — _Depends on:_ F46
- Declined (architect, 2026-10-15): E9 sticky search panel.
- [x] `F25` Card shadow (architect, 2026-10-15): the shadow under the cards is too diffuse; make it tighter and closer to the card (home and `/courses` share `--shadow-cover`) — _Depends on:_ F22

### Other
- [x] `T2` Found during F16 verification: `layout-stability.spec.ts` (production run of the isolated audit) looked for topic 16's subtopic «Как считается рекурсия», renamed «Функция, заданная через себя» by the Change 184 re-export; the page object now uses the current title — _Depends on:_ —
- [x] `T1` UI/UX audit report artifact: Playwriter pass over every public route (desktop 1440,
  phone 390; hover/focus, empty and error states) merged with the code sweep (card radii, hovers,
  paddings and icon styles differ; hover-lift cards without whole-card click; orange outside "you
  are here"; non-blue links; thick side bars; duplicate empty/error/progress/badge patterns;
  reduced-motion and touch-target gaps; missing loading and retry states; feature gaps). Each
  finding with screenshot, priority, fix and files. Architect review; picked findings become new
  F-items — _Depends on:_ —

---

## Files

### Create / modify
~~~
apps/web/src/pages/foundation/foundation-page.tsx
apps/web/src/pages/foundation/foundation-page.module.css
apps/web/src/pages/foundation/foundation-try-demo.module.css
apps/web/src/app/styles/theme.css
apps/web/src/app/styles/tokens.css
DESIGN.md
~~~

### Do NOT touch
- Lesson content, `content/`, stands and topic exports (pipeline-owned)
- Pages outside home until the architect picks audit findings

---

## Contracts

See `docs/SPEC.md` §3–§4 (and §5–§7 where relevant) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

None

### Gate evidence

<!-- Filled by /work from the gate.py summary; /ship compares the diff since this HEAD. -->

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 081d3ed + worktree | format, web-lint, web-typecheck, docs-links; vitest topic-catalog, course-catalog, public-release, client-foundation (37); Playwriter 1440/390 home, hover, focus, whole-card click; impeccable detector | PASS | 85 |
| 081d3ed + worktree | F7, F10, F12, F13: format, tooling-lint, web-lint, web-typecheck, docs-links; vitest practice notation/content/inline/catalog/detail/solving (52), course catalog/foundation (23); topics.mjs rebuild byte-identical; Playwriter home, /courses, /courses/excel, task page 1440/390 | PASS | 70 |
| 081d3ed + worktree | F7–F9: format, tooling-lint, web-lint, web-typecheck, docs-links; vitest notation, practice, counts, account, course/topic catalog, topic levels (90+); Playwriter home, /courses, topic 8, account 1440 | PASS | 75 |
| 081d3ed + worktree | F15–F22, T2: format, python-format, tooling-lint, web-lint, web-typecheck, host-ruff, host-python, docs-links; vitest course catalog/foundation (32); isolated audit `e2e/course-catalog.spec.ts` 11/11 + production run 6/6; Playwriter /courses 1440/390, /courses/python and /courses/excel heads; impeccable detector | PASS | 420 |
| 081d3ed + worktree | F23–F25: format, python-format, tooling-lint, web-lint, web-typecheck, host-ruff, host-python, docs-links; vitest course catalog, public release (19); orphan scan of changed CSS modules, new tokens and exports; Playwriter home 1440/390 (course card rest and hover, topics), /courses hover | PASS | 60 |
| 081d3ed + worktree | F26–F27: format, web-lint, web-typecheck; vitest course catalog, public release, client foundation (28); isolated audit `e2e/course-catalog.spec.ts` 11/11 + production run 6/6; Playwriter home 1440/390, /courses 1440; impeccable detector (Excel cells only, known) | PASS | 160 |
| 081d3ed + worktree | F30–F37: format, web-lint, web-typecheck, docs-links; vitest topic catalog (13, incl. exam plan, labels, goal dimming and storage); isolated audit `e2e/topic-catalog.spec.ts` 13/13 + production run 6/6; Playwriter /ege 1440/390, goal, map navigation | PASS | 300 |
| 081d3ed + worktree | F38–F41: format, web-lint, web-typecheck, docs-links; vitest topic + practice catalog (38); isolated audit `e2e/topic-catalog.spec.ts` + `e2e/practice-catalog.spec.ts` 23/23 + production run 6/6; Playwriter /ege desktop (the Chrome tab runs at 80% zoom, so phone widths come from the e2e 390/360 runs) | PASS | 240 |
| 081d3ed + worktree | F42–F44, T3: format, web-lint, web-typecheck, docs-links; vitest topic catalog (13); isolated audit `e2e/topic-catalog.spec.ts` + `e2e/practice-catalog.spec.ts` 23/23 + production run 6/6; Playwriter /ege 1440/390 (127.0.0.1), signed-in empty state, keyboard and tooltips | PASS | 260 |
| 081d3ed + worktree | F45: format, web-lint, web-typecheck, docs-links; vitest topic catalog (13); isolated audit `e2e/topic-catalog.spec.ts` 13/13 + production run 6/6; Playwriter signed-in empty state | PASS | 120 |
| 081d3ed + worktree | F46: format, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, api-contract, python-format, tooling-lint, docs-links; pytest `tests/test_minimal_bank.py` (22); vitest practice catalog, pagination, inline solving, lesson route data, public release (43); Playwriter /practice 1440/390 guest (127.0.0.1) and signed-in (localhost), empty search | PASS | 200 |
| 081d3ed + worktree | F47: format, web-lint, web-typecheck, api-lint, api-typecheck, api-contract, docs-links; pytest `test_account_auth_guest_and_context_progress` and the progress set (6); vitest practice catalog, inline solving, account dashboard (37); Playwriter /practice 1440 guest at the 5→16 boundary (page 10), signed-in «Решено 2 из 292», 390 | PASS | 160 |
| 081d3ed + worktree | F50–F51: format, web-lint; Playwriter /practice signed-in (15rem bar, count at its end) and guest (count at the right edge) | PASS | 60 |
| 081d3ed + worktree | F48: format, web-lint, web-typecheck, docs-links; vitest practice catalog, inline solving, filters and combobox users (34); Playwriter /practice 1440 (panel, open topic list, active filters with chips), 390 | PASS | 160 |
| 081d3ed + worktree | F52: format, web-lint; Playwriter /practice 390 and 900 (toggle on the count's line, centred on the rows' chevron column), 1440 unchanged | PASS | 40 |
| 081d3ed + worktree | F49 and the /practice series F46–F52: format, web-lint, web-typecheck, docs-links; vitest inline solving (7); isolated audit `e2e/practice-catalog.spec.ts` + `e2e/practice-task-detail.spec.ts` 11/11 + account 1/1 + production run 6/6; `e2e/course-catalog.spec.ts` alone 11/11 (its guest-progress check timed out only when run beside the practice specs); Playwriter expanded task 1440/390, hover | PASS | 320 |
| 081d3ed + worktree | F53–F59: format, web-lint, web-typecheck, docs-links; vitest home and courses (39), practice catalog and inline solving (32); isolated audit `e2e/accessibility.spec.ts` + `e2e/practice-catalog.spec.ts` 21/21 + account 1/1 + production run 6/6 (after F58; F59 is CSS only); Playwriter home 1440/1125/875 CSS px, /practice panel at 1440/1250/1100/1000/390 with long and multiple topics, F59 measurements | PASS | 300 |
| 081d3ed + worktree | /ship 185 (affected Critical): format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, api-contract; full web vitest 66 files / 484 tests; e2e accepted from the F53–F59 isolated run (no source change since but F59 CSS) | PASS | 160 |

---

## Implementation Notes

- Architect's pick from the audit (2026-10-14): A1, A2, A4 taken; A3 reduced to the Excel illustration only; B1 changed to a content-height feature card; B2 rejected (home keeps only the Python course, it is the target course); B5 rejected (the `/ege` row keeps its progress as is). Other findings are not in this change.
- Home topic-card facts show only «N подтем»: the task count comes from the API and the home is prerendered without it; add it after F8 settles one counting rule. Subtopic counts live in `entities/topic-catalog` and a test checks them against the lesson definitions.
- F7 reads the bank's TeX in presentation only (`practiceTaskNotation`): 58 bank tasks carry `^{…}`, `_{…}` or `\%` (26 catalog-visible, 2026-10-14 local bank). Code stays literal, so explanation code spans such as `2^{1890}` and the flattened piecewise definitions («F(n) = { 2^{1024}, если … }») remain data issues for the bank owner.
- F9: «Следующий шаг» keeps only its primary button as the link; stretching it over the plate would mean overriding the shared button's positioning (FRONTEND §4). The account tiles got links to their sections (course, `/ege`, `/practice`) to become whole-card links.
- F8 home topic-card facts still show only «N подтем»: the home is prerendered without the task API.
- F15/F16: the architect's course scenes are coloured and shaded, so they ship as WebP (`scripts/mascot/course_scenes.py`, 960 and 1600 wide, 42–143 KB), not traced; the code-drawn `courses.mjs` pictures, `course-excel*.svg` and the unused `course-python-wide.svg` were removed. Excel's scene is turned 6° so it fits whole. Home topic cards lost their hover picture zoom to follow F19 (nothing moves in a picture area); the path-tile watermark motion stays, as the architect asked for it (F11).
- F23/F24: the home course card shows the course scene, so `ObjectIllustration` has one course form and lost its `scene` switch; the traced `course-python.svg`, its `trace.mjs` entry and `folder` option, the README command and the source PNGs `python_page_card.png` / `python_wide_card.png` were removed (they stay in git history). The unused head prompts left `course-illustration-prompts.md`. `docs/artifacts/mockups-v5/illustration-prompts.md` is a past change's record and keeps its mention of `course-python-wide`.
- F25: `--shadow-cover` keeps its tokens and colours; the far layer went from `0 1rem 2rem -1.25rem` to `0 0.375rem 0.75rem -0.375rem` (raised: `0 0.75rem 1.25rem -0.625rem`), a short dense shadow for home and `/courses` alike.
- F26: the course cover (plate, pattern, picture, blinking pen marks), the icon square and the course tone moved from the `/courses` page into `entities/course` (`CourseCover`, `CourseChip`, `courseCover.tone`), so the home course card uses the same pieces instead of a copy (FRONTEND §3: no page-to-page imports); `course-catalog-sparks.tsx` went with it. The home card lost the engineering grid, so DESIGN.md drops that card exception.
- F27: the tone wash is a 1px ring drawn over a transparent border (a gradient border keeps the radius only this way), the plate's 135° tint (20% → 8% of the pastel), the pattern fading from the top-left (mask 100% → 30%, opacity 0.35 → 0.5 so the top-left stays visible) and the plate's hairline; planned courses carry no `data-course-tone` and stay grey.
- F28/F29 report and row mockup (v2 after F29: whole-row variants C flat rows / D quiet tiles, numeral on the right under the progress, pen marks over the row; findings E1–E10, exam-map idea): https://claude.ai/artifact/8dAEDNYNnusB2WAhTdEv2n — awaits the architect's pick.
- F30–F35 mockup v3 (same link as F28): variant C with all 25 rows, planned rows with «— задач» and the task's requirement from the specification as their description, the exam map with level dots, goal plans that filter rows and fade map cells, the 390 layout with the picture right of the title.
- F34 levels come from the generalised plan in the FIPI project specification of the 2027 KIM (`inf_11_2027.zip`, «ИНФ-11 ЕГЭ 2027 СПЕЦ.pdf», appendix): Б — 1–10, 19; П — 11–18, 20, 22, 23; В — 21, 24–27 (11/11/5); minutes per task sum to 235; tasks 26 and 27 give 2 points. Same dated source as the topic catalog (SPEC §3); recheck when FIPI publishes the final 2027 version.
- F35 plans proposed cumulative by level: База = базовый (11 tasks, ≤ 11 primary ≈ 54), Стандарт = базовый + повышенный (22, ≤ 22 ≈ 83), Хард = all. Targets need 6 / 14 / 21 primary on the approximate past-years scale (kedu.ru); the scale changes yearly, so the page states targets, not a promise. The mapping awaits the architect.
- F36 mockup v4: the goal is a one-line slider (native range over three cumulative segments, keyboard arrows, `aria-valuetext` with the plan's summary); Хард includes every task, so it is the default and shows all rows. Level tones are dots only (map, row label) plus the slider's segments: База `#3c8571` (sage strong), Стандарт `#4a76b4` (sky strong), Хард a muted brick `#b65a52` kept apart from `--theme-danger` `#b3261e`. On the site this needs a DESIGN.md exception (colour outside the home page, one meaning per tone: exam level).
- F37 mockup v5: the thumb is gone; the three segments are a native radio group (arrow keys, focus ring on the segment). Segments up to the goal are filled with a light tone, the chosen one is thicker in its full tone with its name in ink, later ones stay grey. The F36/F37 items are mockup-only; the site work is F30–F35 after the architect's pick.
- F30–F37 on the site: `examPlan` (levels, minutes, points, goals, approximate scale) in `entities/topic-catalog`; `/ege` rows rebuilt (`topic-catalog-card`, `topic-catalog-marks` — seeded per topic id, so server and client draw the same marks), the exam map in the head (`topic-catalog-map`, TanStack `Link` with `hash` and `activeOptions.includeHash`, so only the cell in the address is current), the goal scale (`topic-catalog-goal`, native radios; `use-topic-goal` keeps it via `safeLs.createStore`). `PageHead` gained `asideOnNarrow` so the map stays under the copy on phones. Planned rows show their catalog summary (already in the definitions). Level tones `--color-level-*`; DESIGN.md records the exception and the row, map and scale anatomy; SPEC §3 the source.
- Kept from before: search and the «Все темы / В процессе / Не начаты» filter (the architect declined only the sticky panel, E9). «Практика не начата / завершена» left the progress line (E4): the count and the bar carry it; two unit tests now assert «Решено 1 из 1». E10: the undefined `summaryText` / `progressStatus` classes are gone.
- Every title keeps a 2.5rem line box: the published title is a link with the shared 40px target, so planned and published rows share one rhythm without overriding the link.
- F38–F41: the topic search is gone (model, hook, page, tests); the progress filter is the shared `InlineSelect`, which gained a controlled mode (`value` / `onValueChange`, disabled options) beside its form-submitting one used by `/practice`; the goal lost its label and summary, and one small «?» (`InfoPopover size="small"`, 14px icon, the 40px hit area kept) explains every goal with its scope. The empty state now offers «Показать все темы».
- F42–F44, T3: the empty-state styles were lost in the F30 CSS rewrite — restored as a compact centred block with a message per filter. The map keeps a `--space-5` gap from the head copy. The shared «?» left (InfoPopover reverted to main); a new shared `Tooltip` (Base UI) gives each goal step its own hint on hover and focus, the radio carries the same text via `aria-describedby`. T3 audit (Playwriter, 127.0.0.1:8080 at 100% zoom for widths; localhost for the signed-in state): fixed — 28 Tab stops before the first row (the map is now one roving-tabindex stop, arrows/Home/End inside), the row label breaking on phones (the time and points hide under 52rem), the head note wrapping the FIPI link (shortened to «Задания 19–21 — одна тема»), map cells named only by number (topic tooltip). Left as is — the numeral under the progress bar (approved in v3), the guest progress «временно недоступен» on 127.0.0.1 (the API answers the localhost origin only), the taller progress block of published rows (it reserves the bar while progress loads, no CLS).
- F45: the empty result is the shared `EmptyState` without page overrides — the scene leads at up to 52rem, the title and line follow centred, one solid «Показать все темы» button; the text still follows the filter.
- impeccable detector flags the Excel card's cell pattern as `codex-grid-background`: it is the spreadsheet's own cells, approved in the F15 mockup.
- T4 report: https://claude.ai/artifact/3AR54jHYwgFHTHq3EwgKih (findings П1–П14, directions Б and А; catalog data: 547 tasks on numbers 5 and 16 only, one answer format, 55% without a source, 10 distinct titles). Awaits the architect's pick.
- T5: directions Б and А declined; the same report (v2) now holds three variants that keep the current table — В1 number and topic in the «Тема» column, В2 number badge in the hash slot and «Навык» instead of «Тема», В3 В2 plus group rows per number (topic, level, theory, «Решено N из M»); all of them carry the shared fixes for П1, П3, П5–П8, П10–П14. Awaits the architect's pick.
- F46–F49 picked from T5 (В1 + group rows of В3, expanded task id as a quiet ↗ link); the report (v3) adds three toolbar compositions for F48 — К1 one row of fields, К2 search and pills, К3 a panel over the table — with the topic MultiCombobox unchanged. Picked (architect, 2026-10-15): К3 for F48; П7 «Лёгкая / Средняя / Трудная» and П14 no status icon for guests, as recommended.
- F46: the API's default order is now exam number (the first one; tasks without one last), then difficulty, then id — `ordering` and the `next_task` keyset share it (a row comparison); the literal `default` stays, the select calls it «По номеру». Rows lost the hash link, «Формат» and the bookmark; «Тема» shows «№ N» and the `/ege` title (`topicCatalog`), a course task splits its facet label; the condition is the shared 14px soft line, cut with «…» only when the snippet stops mid-sentence. The title button stretches over the row (hover and focus fill the side surface). Guests get no status icon (`useAccountSession`, as `/ege`). Difficulty is «Лёгкая / Средняя / Трудная» everywhere (catalog, task page, lesson tabs, home try card). The empty result follows F45 and hides the pager; the lead is «Задачи ЕГЭ с проверкой ответа и разбором». Under 64rem number, topic, difficulty and source share one wrapping line. The e2e page object compares row ids instead of the removed id links.
- F47: `/api/progress` results carry the task's `exam_numbers` (contract regenerated); the practice-progress store keeps them for standalone results, so a topic row counts the number's solved catalog tasks without loading the catalog — and a task solved on the page counts at once (its row knows the number). M is the facet count of `ege-N`. The topic row is an `li role="presentation"` (the list still has one listitem per task) with an h2; the rows under it take h3. Groups show only in the «По номеру» order; under them «Тема» names the skill (F47), the topic stays in the group row. Guests see «N заданий» without a bar.
- F50, F51: the topic row takes the table's grid; its progress sits at the right end of «Тема»–«Источник», the bar 15rem like the `/ege` progress column, the count right-aligned over it (a guest's count keeps the same right edge); on phones it starts under the topic, the bar filling the text column.
- F48 (К3, no «Прогресс»): `.catalog` frames the filter panel and the table; `PracticeFilters` now holds the search (label for screen readers only), «Тема», «Сложность», «Сортировка» and the chips — the result bar keeps only «Найдено N». `MultiCombobox` gained `presentation="inline"` (reads as the `InlineSelect` beside it; the colon is `aria-hidden`, so the name stays «Тема») and a `note` line under the list. The topic list shows only topics with tasks (a chosen empty one stays) and, for members, «· решено N» per exam number from the progress store. The facet labels still say «ЕГЭ 16 · Рекурсия» where `/ege` says «Рекурсивные алгоритмы» — they come from `practice-catalog-topics.json`.
- F52: under 64rem the table's frame becomes a two-column grid for its first line — «Найдено N» on the left, the list heading (only the «Раскрыть все» toggle there) on the right over the chevrons; the rule under that line moves to the list's top.
- F49: the expanded task's header is «Задача 02347089 ↗» (the id's first 8 characters, the row's `taskHref`) and «Теория →»; the topic heading inside left (the row and its group say it). The link is the shared `ActionLink` with a new `presentation="reference"` (shared link styles; DESIGN records it as the one non-blue link) — no page override. Its accessible name is «Открыть задачу 02347089 на отдельной странице». Vite did not pick up the `composes` change in `link.module.css` until the composing module was touched — a dev-server quirk only.
- e2e for F46–F52: the page object follows the new default order (exam number, difficulty, id), counts tasks by `listitem` (the topic row is `role=presentation`), checks that empty topics are hidden with the «Ещё N тем» line, and measures the check button in document coordinates (the topic row moves the task down, so feedback may scroll). The production run caught a real shift: the topic row lost its empty bar once the session said «guest» (−10px); the progress block now reserves the bar's line.
- F53 mockup: https://claude.ai/artifact/7A7Y92CSVWbXkvqxnpVKcb — three asymmetric grids for four topics and the two published courses (В1 3×4 with Python tall and Excel wide, В2 a 4×3 bento with the courses crosswise, В3 the courses as a pair beside the large topic); awaits the architect's pick.
- F54 mockup (same link, v2): the courses lead — Г1 the two courses as 2×2 heroes on a diagonal with four compact topics around them, Г2 a wide Python over three columns and a tall Excel beside it over a row of four compact topics, Г3 a staircase of two wide courses with five compact topics (adds task 8); awaits the architect's pick.
- F55 mockup (same link, v3, first tab): the diagonal on four columns — each course two columns by one row with its scene full-width on top (no letterboxing: the scenes are 2.5:1 and 2:1), Python and two topics in the first row, two topics and Excel in the second; a course is about 540 × 450 instead of 725 × 760.
- F56 mockup (same link, v4, first tabs): Д1 — three columns, each course two columns wide with its scene full-width on top (~724 × 505), beside it a pair of horizontal topics stacked (illustration in a square on the left, ~354 × 245), Python top-left and Excel bottom-right; Д2 — seven narrow columns with rows of different step (course 3, topics 2 + 2, then mirrored), course ~460, topic ~300.
- F53–F56 were mockup rounds (same artifact) that ended in F57. F57 on the site: the separate home course band is gone; `FoundationCourseCard` (cover on top) renders the published courses inside the topics list — the first before the topics, the second after them — and the grid is seven columns with courses on three and topics on two, so CSS flow alone gives the mirrored second row. The topic layouts feature/compact/wide and their CSS left; every topic plate is 11rem with the picture at 1.1×. The lead counts courses too («… тем и 2 мини-курса»). The hero facts and the path tile still name Python.
- F58: the panel no longer lays out by content — from 75rem one line (search `minmax(12rem, 1fr)`, the selects `flex: none` and never wrapping; a long topic is cut by the trigger's own ellipsis), under 75rem always two lines; «Найдено N» has `--space-2` above and `--space-1-5` below. The F48 accessibility run also caught the topic row as `li role=presentation` (axe «list»): the row is now a `div` inside the first task's item, so the list holds only tasks.
- F59: the topic row's progress spans to the last grid column (the chevron's), so its end meets the row's right edge; the number and the topic align on the title's first baseline; `PracticeDifficulty` sets the word on the glyph's foot (`align-items: flex-end`, `line-height: 1`) — catalog rows and the task page alike.
- T1 report: https://claude.ai/artifact/DcYJZuiXKjDYgdpBh4U6v3 (findings A1–A4, B1–B11, C1–C5, 7 feature gaps); F1 mockup: https://claude.ai/artifact/3C8m6bmFWnd5CrDZpUszag. Both await the architect's pick.
- Strong tones proposed in F1: sky `#3b6db0` / text `#28497a`, sage `#2f7d6d` / `#285b4f`, lilac `#7154b8` / `#4f3a8c`; white glyph 4.9–5.7:1, subtitle on pastel 6.7–7.6:1.

---

## Commit Message

```
feat(change-185): home cover cards after references, UI/UX audit
```
