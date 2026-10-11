# CHANGE 177 — Мини-курс Excel на сайте: перенос со стенда

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `177` |
| Slug | `excel-course-site` |
| Title | Мини-курс Excel на сайте: перенос со стенда |
| Status | `active` |
| Branch | `feature/177-excel-course-site` |

---

## Goal

Одобренный стенд курса Excel (Change 176, `content/lesson-design/course-excel/`) публикуется на
сайте вторым курсом: 15 уроков в 6 модулях (14 основных, урок 15 дополнительный), живой мини-лист
`SheetBlock` с пересчётом в браузере, песочница копирования формулы `FillSandbox`, схемы и
пошаговые схемы из тех же построителей, задачи уроков в банке и книга практики `.xlsx` вложением.
Курс собирается экспортом со стенда, руками не правится (SPEC §1.3, §2.2, §2.3, §5, §9 п. 0;
пайплайн, этап 9 и раздел «Мини-курс Excel»). Выпуск в production — не здесь.

Решения, принятые при планировании (меняются на ревью архитектора):

- в банк идут задачи урока с одним коротким проверяемым ответом (число, слово, адрес, несколько
  чисел через пробел), как `tasks.json` курса Python; задачи, где ответ — формула или рассуждение,
  уходят в самопроверку урока (`checkpoint`): checker сравнивает строки, а у формулы много
  равносильных записей;
- задачник курса (T9: бывшая «книга практики») — один, собирается воспроизводимо (одинаковые данные → одинаковые байты),
  хранится в банке по контрольной сумме и прикрепляется к задачам, данные которых лежат на её
  листе «Практика»; отдельной ссылки на книгу вне задач нет;
- TypeScript-вычислитель — порт `sheet_eval.js` в `shared/lib`; эталон — `sheet_cases.json`,
  который генерирует `verify_sheets.py --cases` (тот же набор, что проходит JS стенда);
- устаревшие уроки тем 3, 9, 18, 22 не правятся (решение 2026-10-11); ссылки на уроки Excel из
  тем появятся при их перестройке — сейчас только реестр терминов.

---

## Backlog

### Backend

- [x] `B1` `apps/api/tests/test_course_excel_bank.py`: независимый пересчёт ответов задач курса другим способом (по данным условия на чистом Python, без `sheet_eval`), вложение книги отдаётся с MIME `.xlsx` и контрольной суммой из банка; тесты API, завязанные на состав курсов, — на два опубликованных курса — _Depends on:_ D2

### Frontend

- [x] `F1` TypeScript-вычислитель `apps/web/src/shared/lib/sheet-eval/`: порт `sheet_eval.js` (русская локаль, ссылки и диапазоны, `Лист!`, операторы и `%`, типы и ошибки, функции курса, критерии с шаблонами, порядок зависимостей и цикл, `shift`, `references`, форматы `%`/`0,00`/`дата`); Vitest по `sheet-cases.json` — 0 расхождений, плюс тесты пограничных случаев курса — _Depends on:_ T5
- [x] `F2` `SheetBlock` в `shared/components/learning-content/sheet-block/`: SSR и без JS — статичная таблица значений с адресами, вкладками листов и списком формул; с JS — выбор мышью и стрелками, строка формул с цветными ссылками, рамки предшественников по правилам T17/T18 стенда (одна линия сетки, общая граница — одна линия 2px, заливка — фоном ячейки), правка исходных ячеек (Enter/Tab/F2/Esc), «Вернуть исходные», вкладки сохраняют рамки, `aria-live`, строки фильтра и скрытые строки с пропуском номеров; на 375 px прокрутка только внутри сетки; токены DESIGN.md; тесты SSR и взаимодействия — _Depends on:_ F1
- [x] `F3` `FillSandbox` в `shared/components/learning-content/fill-sandbox/` по образцу `fill_try`: формула и ячейки «откуда/куда», новая формула через `shift` вычислителя, изменившиеся части адреса выделены, уход за край листа — `#ССЫЛКА!`, ошибка ввода — подсказкой; без JS — разобранный пример; тесты против правил `shift` — _Depends on:_ F1
- [x] `F4` Блок формулы: `CodeBlock` с `language="excel"` — подсветка функций, ссылок, текста и чисел (токены вычислителя), шапка «формула» / «шаблон формулы», копирование; режимы Python и тем 23/25 не меняются; тесты — _Depends on:_ F1
- [x] `F5` Публикация курса: сгенерированные `excel-*.lesson.tsx` и манифесты схем, `excelCourse` и реестр курсов из списка публикаций, запись `excel` каталога становится опубликованной, подпись курса в темах практики — из публикации (а не `course.id === "python"`), `node scripts/practice-registry.mjs`, `PRODUCT.md` (состав курсов) — _Depends on:_ F2, F3, F4, T3, T4
- [x] `F6` Тесты сайта, завязанные на состав каталога (`course-overview.test.tsx`, `course-foundation.test.ts`, `public-release.test.ts`, page objects e2e каталога курсов и обзора): два опубликованных курса, два запланированных; mastery курса Excel — 14 основных уроков — _Depends on:_ F5

- [x] `F7` Ревью архитектора: клавиши и сочетания клавиш в уроках Excel — клавишами (`Ctrl` + `C`, `Enter`, `F2`), как на присланных образцах: на стенде и на сайте (`Kbd`), разметка урока `[[Ctrl+C]]`; в задачах банка — обычным текстом — _Depends on:_ —
- [x] `F8` Ревью архитектора: больше акцентов в тексте уроков Excel, как в курсе Python — формулы, адреса ячеек и диапазонов, имена функций и значения ИСТИНА/ЛОЖЬ в тексте — моноширинным кодом; формулы в коде проверяет `verify_sheets.py` — _Depends on:_ F7
- [x] `F9` Ревью архитектора: формулы показываются блоком кода — смешение сущностей. Свой минималистичный блок формулы в языке листа (строка формул: «fx», адрес ячейки слева, если формула записана для ячейки; функции выделены, слова-заполнители шаблона — курсивом), копирование; на стенде и на сайте (`FormulaBlock`); `CodeBlock` для формул больше не используется — _Depends on:_ F4
- [x] `F10` Финальное ревью кода: вкладки листов `SheetBlock` доступны с клавиатуры (стрелки ←/→ переключают лист и переводят фокус), в показанной сетке всегда есть ячейка с tab stop — первая, если выделение на другом листе; тест — _Depends on:_ F2

### Infra

None

### Data

- [x] `D1` `course-excel/workbook.py`: воспроизводимая сборка — фиксированные даты свойств книги и записей zip, два прогона дают один `sha256`; `--check` по-прежнему зелёный — _Depends on:_ —
- [x] `D2` `content/lesson-design/course-excel/bank.py` по образцу курса Python: задачи из `tasks.json` (условие — дословно, разбор — ответ урока, ответ сверяется с `checks.py`), `lessons`/`theory_links`, `counts_toward_mastery: false` для урока 15, вложение книги практики (`purpose: attachment`, файл в `content/practice-bank/files/<sha256>`) у задач на её данных, записи `materials`/`courses`; `--write`, Prettier, `pnpm validate:content`; локальный банк — `practice-local.py export` и `make practice-bootstrap` — _Depends on:_ D1, T2, F5

### Other

- [x] `T1` SPEC: §1.3 состав опубликованных курсов, §2.2 каталог и publication registry списком, §2.3 правило переноса курса Excel, §5 блоки `SheetBlock` и `FillSandbox`, §9 п. 0 — сделано в `/plan` — _Depends on:_ —
- [x] `T2` Данные стенда для сайта: в `course-excel/course.json` — `site.navLabels` и `site.outcome` уроков; `course-excel/tasks.json` — задачи банка по урокам с ответом в том виде, в каком его набирает ученик; стенд пересобирается без изменений текста уроков — _Depends on:_ —
- [x] `T3` Пошаговые схемы курса для экспорта: `formula_steps`, `ctrl_jump`, `sumif_steps`, `vlookup_steps` получают функции кадров и регистрируются в `figures.STEPPERS`; статичные схемы и `fill_try` (`EXCEL_WIDGETS` → `FillSandbox`) проходят `export_media.py`; страницы стенда `xl-*` собираются байт в байт — _Depends on:_ —
- [x] `T4` Экспорт: `export_course.py` для нескольких курсов — публикация собирается из всех `course-*/course.json` (`pythonCoursePublication`, `excelCoursePublication`, `coursePublications` списком), `<id>-course-lessons.ts` на курс; блок ```` ```sheet ```` → данные `SheetBlock` (входы, значения, посчитанные `sheet_eval`, форматы, `select`/`edit`/`filter`/`hide`, листы книги), ```` ```excel [шаблон] ```` → блок формулы, `fill_try` → `FillSandbox`, задачи → банк / `checkpoint`; `--check`; вывод курса Python не меняется; тесты экспорта — _Depends on:_ T2, T3
- [x] `T5` Эталон вычислителя для сайта: экспорт пишет `sheet-cases.json` рядом с тестами вычислителя (сгенерированный, коммитится, `--check` ловит устаревший); `sheet_conformance.mjs` стенда и Vitest сайта читают один и тот же набор — _Depends on:_ —
- [x] `T6` `terms.py`: термины курса Excel по таблице `map.md` («Термины тем ЕГЭ → уроки курса») со slug'ами опубликованных уроков; `build.TERM_LESSON` берёт урок Excel из реестра; повторный экспорт тем не нужен (темы 3, 9, 18, 22 устаревшие) — _Depends on:_ T4
- [x] `T7` Документы: этап 9 и раздел «Мини-курс Excel» `lesson-pipeline.md` (порядок переноса, новые блоки, эталон вычислителя), `FRONTEND.md` (`SheetBlock`, `FillSandbox`, блок формулы, `shared/lib/sheet-eval`), `map.md` (перенос выполнен), запись качества курса `docs/artifacts/lessons/excel-course.quality.md` — _Depends on:_ F5, D2
- [x] `T8` Проверка: этап 7 пайплайна для курса, `--check` экспорта и схем, Playwriter — 15 уроков и обзор курса на 1280/375 px против стенда (мини-лист: выбор, рамки, правка → пересчёт, текст в числовой ячейке → `#ЗНАЧ!`, сброс, клавиатура, вкладки; `FillSandbox`; пошаговые схемы; задачи с вложением — файл скачивается и открывается), без JS — статичные листы; гейт; ревью архитектора — _Depends on:_ F6, B1, T6, T7
- [x] `T9` Ревью архитектора: «книга практики» — это задачник: везде «Задачник курса», файл `excel-zadachnik.xlsx`, лист «Практика» → «Задачи»; описание вложения, тексты книги, `workbook.py`/`bank.py`, документы; банк — новый файл по контрольной сумме — _Depends on:_ —

---

## Files

### Create / modify

~~~
docs/SPEC.md                                              (сделано в /plan)
docs/runbooks/lesson-pipeline.md, docs/FRONTEND.md, PRODUCT.md
docs/artifacts/lessons/excel-course.quality.md
scripts/lesson_design/export_course.py, export_media.py, excel_figures.py, figures.py,
  terms.py, build.py (TERM_LESSON), verify_sheets.py, sheet_conformance.mjs
content/lesson-design/course-excel/course.json, tasks.json, bank.py, workbook.py, map.md
content/practice-bank/bank.json, content/practice-bank/files/<sha256> (книга практики)
apps/api/practice-registry.json, apps/api/tests/test_course_excel_bank.py (+ тесты состава курсов)
apps/web/src/shared/lib/sheet-eval/**                     (вычислитель, sheet-cases.json, тесты)
apps/web/src/shared/components/learning-content/sheet-block/**, fill-sandbox/**, index.ts
apps/web/src/shared/components/code-block/**              (language="excel")
apps/web/src/entities/course/**                           (publication, registry, catalog, excel-*.lesson.tsx, *.media.ts)
apps/web/src/pages/practice-task/practice-topic.ts, scripts/practice-catalog-topics.mjs (подпись курса)
apps/web/tests/**, apps/web/e2e/** (каталог и обзор курсов)
~~~

### Do NOT touch

- Устаревшие TopicLesson `apps/web/src/entities/lesson/content/*.lesson.tsx` (решение 2026-10-11), в том числе уроки тем 3, 9, 18, 22
- Тексты уроков курса Excel на стенде `content/lesson-design/course-excel/NN-*.md` и курса Python — только при замечании ревью
- Сгенерированные файлы курса Python: меняются только повторным экспортом и без изменений содержимого
- `content/tasks/` — исторические fixtures
- Production: push, deploy, импорт в production БД

---

## Contracts

See `docs/SPEC.md` §1.3, §2.2–§2.3, §3–§5 and the Files list above. Do not hand-copy the schema,
endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source of truth;
this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

- Этап 7 пайплайна для курса Excel: `verify_sheets.py --cases`, `checks.py`, `excel_needs.py`, `workbook.py --check`, `sheet_conformance.mjs`, `bank.py` (без `--write`), `export_course.py --check` (оба курса), `export_media.py --check`.
- Vitest вычислителя по `sheet-cases.json` — 0 расхождений.
- `pnpm validate:content` после изменения банка.

### Gate evidence

<!-- Filled by /work from the gate.py summary; /ship compares the diff since this HEAD. -->

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 6d3ac68…e3606ec + worktree | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media | PASS | ≈50 |
| worktree | Vitest 12 files / 102 tests (evaluator vs `sheet-cases.json` 4520 cells, SheetBlock, FillSandbox, formula CodeBlock, course catalog/foundation/overview, release metadata, lesson contracts, design tokens); pytest `test_course_excel_bank.py` 61, `test_minimal_bank.py` 22, course Python and topics 23/25 banks; `scripts.tests.export_course_test`, `sheet_eval_test` | PASS | — |
| worktree | Stage 7: `excel_needs` 0 problems, `verify_sheets --cases --check` 65 sheets / 186 formulas, `sheet_conformance` 0 mismatches, `checks.py` 15 lessons, `workbook.py --check` 0 problems (two builds — one sha256), `bank.py` 56 tasks, `export_course --check` Excel 33 / Python 56 files up to date, `export_media --check` topics 23/25, `practice-registry`/`practice-catalog-topics --check`, `pnpm validate:content` 1021 tasks; stand `xl-*` pages byte-identical | PASS | — |
| worktree (review F7, F8, T9) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media; `verify_sheets --cases --check` (200 formulas in text, templates skipped), `checks.py`, `excel_needs`, `workbook.py --check`, `bank.py`, `export_course --check` ×2, `export_media --check` topics 23/25, `validate:content` 1021; Vitest excel blocks 10 (KeyCombo), lesson contracts; pytest Excel bank 61; `export_course_test`; Playwriter — keys and inline code on the site and the stand (lessons 2, 7, 9), 375 px no overflow | PASS | — |
| worktree (review F9) | format, python-format, tooling-lint, web-lint, web-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media; Vitest excel blocks (FormulaBlock: cell/fx/function/slot, copy without addresses), course blocks, lesson contracts — 28; `export_course_test`; `export_course --check` ×2, `checks.py`, `bank.py`, `verify_sheets`; Playwriter — formula blocks on the site (lessons 7, 9, 12) and the stand (lesson 7), 375 px no overflow, no page errors | PASS | — |
| worktree (final review F10) | web-lint, web-typecheck, prettier (sheet-block, test); Vitest excel blocks + sheet-eval — 18; impeccable detector — 0; Playwriter — lesson 12 sheet tabs: ArrowRight switches and focuses the tab, Shift+Tab lands on the shown grid, ArrowDown moves on that sheet | PASS | — |
| worktree (/ship) | gate format, web-lint, web-typecheck, docs-links (invalidated by F10); isolated browser audit `E2E_ARGS=e2e/course-catalog.spec.ts` — course catalog 11, a11y 1, layout/smoke 6; other groups accepted from the F9 evidence (inputs unchanged) | PASS | — |
| worktree | Playwriter (local stack, bank 1021): `/courses/excel` + 15 lessons × 1280/375 px — no page overflow (wide sheets scroll inside); sheet select/frames/edit → «пересчитано формул: 5»/reset, lesson 12 tabs keep frames, FillSandbox, stepper; task with the workbook: download 200, `.xlsx`, 60 KB. Console: only 429 from the dev Nginx rate limit during the fast crawl. impeccable detector: 0 findings on sheet-block and fill-sandbox; audit — tabs under 44px high, as on the stand | PASS | — |

---

## Implementation Notes

- The conformance cases moved from the gitignored stand file to the committed `apps/web/tests/fixtures/sheet-cases.json` (one case per line, Prettier-ignored); the stand's `sheet_conformance.mjs` and Vitest read the same file.
- `formula_steps` media keys always carry a hash (`export_media.HASHED`): two worked formulas of one cell would otherwise share a key.
- T6 is data-only: `terms.EXCEL_TERMS` maps terms to lessons and the export checks the slugs; popover texts and their rendering wait for a rebuilt topic 3/9/18/22 that uses them (no consumer now).
- Found in the browser check and fixed within F5: the course overview's «Что понадобится» was hard-coded for Python — now `site.requirements` per course; `/courses` meta description and the catalog header genitive («из 41 урока») corrected; the course gets `site.shortTitle` for practice topic labels.
- Review F9: `CodeBlock language="excel"` (F4) is retired — formulas are `FormulaBlock`; three formulas written for a named cell carry its address (`B2: =…`, `E2: =…`, `G2: =…`).
- Review F8: the inline-code markup of the lesson texts was applied once by a script (formulas, addresses, function names, `ИСТИНА`/`ЛОЖЬ`, error codes; expressions such as `A2>=ДАТА(…)` kept whole) and checked line by line; `checks.py` compares the text without markup.
- `bank.py` accepts small numbers written as words in the lesson answer («Три поля» for `3`).

---

## Commit Message

```
feat(change-177): Excel course on site — SheetBlock, 15 lessons, bank
```
