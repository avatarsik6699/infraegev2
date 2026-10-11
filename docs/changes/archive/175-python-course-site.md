# CHANGE 175 — Мини-курс Python на сайте: перенос со стенда

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field  | Value                                               |
| ------ | --------------------------------------------------- |
| Change | `175`                                               |
| Slug   | `python-course-site`                                |
| Title  | Мини-курс Python на сайте: перенос со стенда        |
| Status | `archived`                                          |
| Branch | `feature/175-python-course-site`                    |

---

## Goal

Одобренный стенд курса Python (Change 174, `content/lesson-design/course-python/`) заменяет на
сайте прежние 28 уроков: 30 уроков в 8 модулях (27 основных, 3 дополнительных), схемы и
пошаговые схемы из тех же построителей, запускаемые примеры кода, песочница диапазонов и задачи
уроков в банке. Курс собирается экспортом со стенда, а не правится руками (SPEC §1.3, §1.4, §2.2,
§2.3; пайплайн, этап 9 и раздел «Мини-курс Python»). Выпуск в production — не здесь.

Решения, принятые при планировании (меняются на ревью архитектора):

- снятые уроки (`python-todo-*`, `oshibki`, `sostavnye-usloviya`, `schetchiki-i-nakopiteli`,
  `tsifry-chisla`, `tablitsy`, `polnyy-perebor`, `otbor-rezultata`) удаляются без редиректов;
- 140 задач прежних уроков архивируются (`archived: true`), как задачи снятого урока в теме 25;
  у уроков с тем же `id` задачи только новые;
- устаревшие TopicLesson не правятся (решение 2026-10-11): их ссылки на снятые уроки
  перенаправляет общий `PythonCourseLessonLink` — `otbor-rezultata` → `sortirovka-i-poisk`,
  `schetchiki-i-nakopiteli` → `while`;
- задачи урока с однозначным коротким ответом — задачи банка; «объясни, почему» и ответы-рассуждения —
  самопроверка урока (`checkpoint`); задачи дополнительных уроков не входят в mastery.

---

## Backlog

### Backend

- [x] `B1` Тесты API, завязанные на прежние уроки и задачи курса (`test_minimal_bank.py`, `test_tasks_api.py`), — на новый состав; независимый пересчёт ответов задач курса `apps/api/tests/test_course_python_bank.py` (другой способ, как `test_task_25_bank.py`) — _Depends on:_ D1

### Frontend

- [x] `F1` `CourseLesson.level: "core" | "advanced"`: тип, `defineCourseLesson`, прогресс и mastery курса без дополнительных уроков, пометка «доп.» в дереве уроков и обзоре курса; тесты прогресса — _Depends on:_ —
- [x] `F2` `CodeBlock` для курса: одно поле «Вывод» строками (не через «, »), набранный ввод — «клавишей» с ↵, ошибка — красным (токен ошибки DESIGN.md), сворачивание вывода длиннее 8 строк как у кода; режим тем 23/25 не меняется; тесты — _Depends on:_ —
- [x] `F3` `CodeRunner` — запускаемый блок кода по записанным шагам (контракт данных — шаги `tracer.py`): «Запуск» в шапке; назад / счётчик / вперёд / закрыть; подсветка строки, «Переменные» справа или под кодом, рамки вызовов, списки/словари/множества объектами со стрелками, пояснение шага, живой «Вывод», ошибка последним шагом; высоты по самому большому шагу; клавиши ←/→/Esc; без JS и в SSR — обычный `CodeBlock` с выводом; доступность (aria-live, фокус); тесты шагов и SSR — _Depends on:_ F2
- [x] `F4` `RangeSandbox` — песочница `range` и среза по образцу `range_try` (те же правила, пустой результат, шаг 0, отрицательный шаг, границы среза); схема — того же вида, что `range_svg`/`slice_svg`; без JS — статичная схема; тесты значений против Python-правил — _Depends on:_ —
- [x] `F5` Публикация курса: `course-publication.mjs` (8 модулей, 30 уроков, `id`/`routeSlug` из `course.json`, `level`), 30 сгенерированных `*.lesson.tsx` и манифестов схем, удаление файлов снятых уроков, реестр курса, `node scripts/practice-registry.mjs` — _Depends on:_ F1, F2, F3, F4, T2, T3
- [x] `F6` `PythonCourseLessonLink`: таблица перенаправления снятых slug'ов (см. Goal) и тест «каждый `lessonSlug` в уроках ведёт на опубликованный урок курса» — _Depends on:_ F5
- [x] `F7` Тесты сайта, завязанные на прежний курс (`course-foundation.test.ts`, `practice-revision-progress.test.ts`, `number-sequences-lesson.test.tsx`, страницы e2e `apps/web/e2e/pages/course-catalog.page.ts` и соседние, что открывают курс), — на новый состав; без правки самих устаревших уроков — _Depends on:_ F5, F6
- [x] `F8` Ревью архитектора: вкладки задач — значок уровня стоит на базовой линии подписи «Задача N» (и в мете страницы задачи), строка «Задание n из N» над вкладками убрана — _Depends on:_ —
- [x] `F9` Ревью архитектора: `CodeBlock` и `CodeRunner` — вид стенда (шапка с именем файла, «Запуск» и «Показать весь код» пилюлей, значения переменных в рамках, рамка вызова и изменённое значение — цветом «здесь», код в пояснении шага — чипом, номера строк только в запускаемом блоке); «Вывод:» с двоеточием, строки вывода — под подписью (и на стенде) — _Depends on:_ —
- [x] `F10` Ревью архитектора: рисунки курса — моноширинный текст схем держит шаг 0,6 em (`textLength`) и шрифт сайта, рамки не съезжают; таблица истинности — рамки истинных клеток поверх соседних; просмотр всех рисунков 30 уроков — _Depends on:_ —
- [x] `F11` Ревью архитектора: вступление урока без заголовка «Главная идея» и без пункта в «На этой странице» (`ConceptBlock.lead`); в текстах стенда нет «Главная идея урока:» и «Сквозной пример урока —» (своя фраза в каждом уроке); шаблон 4.2 и правило в `lesson-pipeline.md` — _Depends on:_ —
- [x] `F12` Ревью архитектора: «Тонкости» — свой вид `ProofDisclosure kind="nuance"` (значок, «Тонкости» и тема, стрелка справа, рамка как у блоков кода); экспорт ставит `kind` по подписи — _Depends on:_ —
- [x] `F13` Ревью архитектора: в `refs_svg` стрелки ячеек к общему элементу приходят каждая под своей ячейкой (урок 10, `[[0] * 3] * 2`) — наконечники не сливаются — _Depends on:_ —
- [x] `F14` Ревью архитектора: секции под кодом — «Строка N:» с пояснением на новой строке, «Переменные:», «Вывод:»; общая подпись `CodeBlockLabel` с тихим значком своей секции (`MessageSquareText`, `Tag` — имя как ярлык из урока 2, `SquareTerminal`); на стенде — двоеточия и пояснение под подписью — _Depends on:_ F9

### Infra

None

### Data

- [x] `D1` `content/lesson-design/course-python/bank.py` по образцу темы 25: задачи банка из задач уроков с проверяемым ответом (условие — дословно, ответ печатает решающая программа и сверяется с ответом урока и `checks.py`), `lessons`/`theory_links`, `counts_toward_mastery: false` для уроков 28–30; архив 140 прежних задач; запись `materials`/`courses` нового курса; `--write`, Prettier, `pnpm validate:content`; локальный банк — `practice-local.py export` и `make practice-bootstrap` — _Depends on:_ T2

### Other

- [x] `T1` SPEC: §1.3 состав курса, §2.2 уровень `CourseLesson`, §2.3 правило переноса урока курса, §9 пункт 0 — сделано в `/plan` — _Depends on:_ —
- [x] `T2` Экспорт урока курса: `export_lesson.py` (или `export_course.py`) для папки с `course.json` — шаг → `ConceptBlock`, «Итого» → `result`, задачи → банк / `checkpoint`, блоки кода с именем файла и выводом курса, ```` ```python run ```` → `CodeRunner` с шагами, `range_try` → `RangeSandbox`, `remainder_widget` / `mask_try` / `:::pick` / `<details>` как в темах; `export_media.py` для курса (схемы и пошаговые схемы, данные шагов); `--check` на устаревшие файлы; тесты экспорта — _Depends on:_ —
- [x] `T3` `terms.py`: slug'и и названия новых уроков по таблице `map.md` («Термины тем ЕГЭ → уроки курса»); повторный экспорт `python-terms.tsx` и уроков тем 23 и 25 (только ссылки терминов); `build.TERM_LESSON` берёт урок из `terms.py` — _Depends on:_ T2
- [x] `T4` Документы: этап 9 и раздел «Мини-курс Python» `lesson-pipeline.md` (порядок переноса курса, новые блоки), `FRONTEND.md` (`CodeRunner`, `RangeSandbox`, вывод курса), `map.md` (пункт «Для Change 175» выполнен), запись качества курса в `docs/artifacts/lessons/` — _Depends on:_ F5, D1
- [x] `T5` Проверка: этап 7 пайплайна для курса, `--check` экспорта, Playwriter — все 30 уроков и обзор курса на 1280/375 px против стенда (схемы, запуск по шагам, песочница, свёртка, термины в темах 23/25, ссылки из устаревших тем), гейт; ревью архитектора — _Depends on:_ F7, B1, T3, T4

---

## Files

### Create / modify

~~~
docs/SPEC.md                                              (сделано в /plan)
docs/runbooks/lesson-pipeline.md, docs/FRONTEND.md
scripts/lesson_design/export_lesson.py, export_media.py, terms.py, build.py (TERM_LESSON)
scripts/lesson_design/export_course.py                    (если экспорт курса отдельным файлом)
content/lesson-design/course-python/bank.py, map.md
content/practice-bank/bank.json
apps/api/practice-registry.json, apps/api/tests/test_course_python_bank.py,
  apps/api/tests/test_minimal_bank.py, apps/api/tests/test_tasks_api.py
apps/web/src/entities/course/**                           (типы, define, прогресс, publication, registry, content/*.lesson.tsx и *.media.ts)
apps/web/src/entities/lesson/content/python-course-lesson-link.tsx, python-terms.tsx,
  divisors-and-masks.lesson.tsx, graph-analysis.lesson.tsx (повторный экспорт)
apps/web/src/shared/components/code-block/**
apps/web/src/shared/components/learning-content/code-runner/**, range-sandbox/**
apps/web/src/widgets|features курса (дерево уроков, обзор — пометка «доп.»)
ревью F8–F14: apps/web/src/features/lesson-practice/**, entities/practice-task/practice-difficulty.module.css,
  pages/practice-task/practice-task-page.module.css, pages/course-lesson/course-lesson-page.tsx,
  shared/components/learning-content/{proof-disclosure,lesson-theory,lesson-media}/**,
  scripts/lesson_design/{figures.py,runblock.js}, content/lesson-design/textbook.css,
  content/lesson-design/course-python/NN-*.md (вступления) и пересобранные страницы стенда py-*.html
apps/web/tests/**, apps/web/e2e/** (курс)
docs/artifacts/lessons/python-course.quality.md
~~~

### Do NOT touch

- Устаревшие TopicLesson `apps/web/src/entities/lesson/content/*.lesson.tsx`, кроме тем 23 и 25
  (`array-processing`, `data-analysis`, `number-sequences`, `preobrazovanie-zapisey-chisel`,
  `rekursiya`, `string-processing`) — решение 2026-10-11
- Тексты курса на стенде `content/lesson-design/course-python/NN-*.md` — только при замечании ревью
- `content/tasks/` — исторические fixtures
- Production: push, deploy, импорт в production БД

---

## Contracts

See `docs/SPEC.md` §1.3, §1.4, §2.2–§2.3, §3–§5 and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

- Этап 7 пайплайна для курса: `verify_code.py`, `checks.py`, `bank.py` (без `--write`), `export_media.py --check`, экспорт уроков `--check`.
- `pnpm validate:content` после изменения банка.

### Gate evidence

<!-- Filled by /work from the gate.py summary; /ship compares the diff since this HEAD. -->

| HEAD | Groups / focused checks | Result | Seconds |
| ---- | ----------------------- | ------ | ------- |
| e1e0bd5 + worktree | format, python-format, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media | PASS | ≈60 |
| e1e0bd5 + worktree | Vitest: 11 files / 138 tests (course, blocks, links, release, topics 23/25); pytest: bank, course bank, topics 23/25 — 98; stage 7: `verify_code` 196, `checks.py`, `bank.py` 157, `export_course --check`, `export_media --check` ×2, topics 23/25 checks and bank; `pnpm validate:content` 965 tasks | PASS | — |
| e1e0bd5 + worktree | Playwriter (local stack, bank 965): `/courses/python` + 30 lessons × 1280/375 px — no horizontal scroll, 0 console errors; CodeRunner (lessons 15, 16) beside/under code, keys, arrows; RangeSandbox; input/error output; code fold; term link in topic 25; topic 17 links redirected. impeccable audit: detector 0 findings on files (URL mode failed to start a browser — skipped) | PASS | — |
| e1e0bd5 + worktree (review F8–F12) | format, python-format, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media | PASS | ≈60 |
| e1e0bd5 + worktree (review F8–F12) | Vitest: 12 files (course blocks +2 tests, course foundation, practice, topics 23/25); pytest: course bank, minimal bank — 80; `export_course --check` 56; topics 23/25 lesson export byte-identical; `practice-registry`, `bank.py --write`, `validate:content` 965; `make practice-bootstrap` | PASS | — |
| e1e0bd5 + worktree (review F8–F12) | Playwriter: 48 figures of 30 lessons viewed (all stepper frames unhidden) — fixed: f-string boxes (font name), truth tables, `error_stages` and `type_cards` past 660, two captions (`&lt;`, `<strong>`); geometry check — nothing past the viewBox; 30 lessons × 375/1280 — no horizontal scroll; CodeRunner, «Тонкости», practice tabs, task page meta | PASS | — |
| e1e0bd5 + worktree (review F13–F14) | format, python-format, web-lint, web-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media; Vitest course blocks 13; `export_course --check` 56; `export_media --check` topics 23/25 up to date; Playwriter: lesson 10 figure, CodeRunner 1280/375 (no horizontal scroll) | PASS | — |
| e1e0bd5 + worktree (/ship) | format, python-format, web-lint, web-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media; stage 7 (`verify_code` 196, `checks.py`, `bank.py` 157, `export_course --check`, `export_media --check` ×2, `validate:content`); Vitest 14 files / 144 | PASS | — |
| e1e0bd5 + worktree (/ship) | Playwright (isolated bank): account-integration, course-catalog, practice-cutover, practice-task-detail, accessibility, topic-reading, topic-routing, topic-23/25, layout-stability — 51 + 1; course-catalog at 360 px with delayed hydration timed out once on «Прогресс загружается», the spec file passed 11/11 on rerun | PASS | — |

---

## Implementation Notes

- `/ship` Playwright found that the guest course card counted all 30 lessons («Освоено 0 из 30»): `CourseCatalogCard` now passes the core count (`lessonCount − advancedLessonIds`); e2e page objects updated to 27 lessons / 146 tasks. «Показать весь код» pill is transparent (contract of `topic-reading`: the button stays transparent over the fade).

- Course export is a separate `export_course.py` reusing `export_lesson.Converter`; publication, lessons and manifests are generated, so `course-registry.ts` imports the generated `python-course-lessons.ts`.
- Runnable steps live in the lesson media manifest (kind `run`); `CodeRunner` lays out every step in one grid cell to keep the tallest height without measuring.
- Step labels are authored in `course.json` (`site.navLabels`): the heuristic cut claims mid-word; export fails on a missing label.
- `PRODUCT.md` course facts updated (30 lessons, additional ones outside mastery). E2E page objects updated, Playwright specs not run (affected specs before ship).

---

## Commit Message

```
feat(change-175): Python course on site — 30 lessons, CodeRunner, bank
```
