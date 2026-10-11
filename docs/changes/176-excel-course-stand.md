# CHANGE 176 — Мини-курс Excel по пайплайну: стенд всего курса

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `176` |
| Slug | `excel-course-stand` |
| Title | Мини-курс Excel по пайплайну: стенд всего курса |
| Status | `active` |
| Branch | `feature/176-excel-course-stand` |

---

## Goal

Собрать мини-курс Excel по обязательному пайплайну ([lesson-pipeline.md](../runbooks/lesson-pipeline.md),
[lesson-patterns.md](../runbooks/lesson-patterns.md)) на демо-стенде (этапы 1–8), чтобы темы ЕГЭ
3, 9, 18 и 22 ссылались на уроки курса (SPEC §1.3, §1.4, §2.3). Исходник архитектора —
`docs/artifacts/lessons/Excel-Course.docx` (24 главы, 30 упражнений) и `Excel-Practice.xlsx`.
Код сайта не меняется: перенос на сайт — отдельный Change 177.

Решения архитектора (2026-10-11):
1. В курс идут механизмы электронной таблицы; разборы глав 14–17 (задания 9, 3, 18, 22) делятся:
   механизмы (частоты `СЧЁТЕСЛИ($A2:$F2;A2)`, `СУММЕСЛИ` по полосе признаков, `ВПР` и
   `ИНДЕКС`/`ПОИСКПОЗ` между листами, формула из вычисленных соседей с заполнением прямоугольника,
   `СЧЁТЕСЛИМН` по интервалам) — в уроки курса; приёмы задач — темам (`map.md`: «передано теме NN»).
2. Живой мини-лист: строка формул, подсветка ячеек-предшественников, правка исходных чисел с
   пересчётом в браузере; вычислитель ограничен функциями курса. Сначала стенд, затем сайт.
3. Книга практики .xlsx генерируется со стенда из тех же данных, что и уроки; книга архитектора —
   исходник этапа 1.

---

## Backlog

<!-- This list is OPEN, not a fixed scope: /work appends new items here when the architect reports
     findings/fixes/follow-ups mid-session — it does not fix them off-list.
     ID scheme: B=Backend · F=Frontend · I=Infra · D=Data · T=other (ungrouped)
     IDs are stable after assignment — never renumber. Mark removed items as ~~BN~~ (removed). -->

### Backend
None

### Frontend
None

### Infra
None

### Other
- [x] `T1` Пайплайн: раздел «Мини-курс Excel» в `lesson-pipeline.md` — отличия этапов 1–8, структура `content/lesson-design/course-excel/`, правило уровней, формат блоков листа, команды этапа 7, строка «Истории решений»; новый паттерн (если появится) — в `lesson-patterns.md` — _Depends on:_ —
- [x] `T2` Этап 1: `scripts/lesson_design/docx_to_md.py` (stdlib `zipfile` + `xml.etree`) — docx → `docs/artifacts/lessons/excel_course.md` (нумерованные заголовки, таблицы Markdown, стиль `Formula` → ```` ```excel ````, упражнения); выгрузка книги в `excel_practice.md` (лист → ячейка → значение/формула). Текст и формулы дословно; коммитятся docx, xlsx и оба md — _Depends on:_ —
- [x] `T3` Опорный вычислитель `scripts/lesson_design/sheet_eval.py`: русская локаль (`;`, `,` в дробях), ссылки `A1`/`$A$1`/`$A1`/`A$1`, диапазоны, `Лист!` и `'Лист'!`, операторы и `%`, типы (число, текст, логическое, пусто, `""`, ошибки), функции главы 24, критерии `СЧЁТЕСЛИ` с шаблонами `* ? ~`, порядок зависимостей и цикл → ошибка, `shift(formula, drow, dcol)`; таблица RU↔EN в одном месте; тонкости сверены с документацией Microsoft; юнит-тесты — _Depends on:_ T2
- [x] `T4` Блоки стенда: ```` ```sheet имя ```` (сетка, `=` формула, `⇒` ожидаемое значение, `fill D2 → D2:D5` через `shift`, секции листов `[Товары]`, пометка редактируемых ячеек) и ```` ```excel ```` (разбор, имена функций, значение при контексте); `verify_sheets.py` (сверка `⇒`, длина строки ≤ 64); `build.py` без жёсткого `course-python` — курсы по `course.json` в `course-*`, префикс `xl`, навигация «Курс Python» / «Курс Excel», `TERM_LESSON` по курсу термина; курс Python и темы 23/25 собираются байт в байт — _Depends on:_ T3
- [x] `T5` Живой мини-лист `sheetblock.py` + `sheetblock.js`: сетка в системе DESIGN.md, строка формул, выбор мышью и стрелками, цветные рамки предшественников, правка исходных ячеек (Enter/Tab, Esc), «Вернуть исходные», JS-вычислитель того же подмножества, без JS — статичная таблица, прокрутка внутри блока на 375 px, `aria-live`; `sheet_cases.json` из `sheet_eval.py` (блоки курса + случайные правки) и `node`-проверка соответствия; песочница `fill_try` (формула → куда скопировать → новая формула с подсветкой изменённых частей адреса) — _Depends on:_ T4
- [x] `T6` Этап 2: анализ потребностей тем — формулы исходника темы 9 и глав 14–17 курса (пока у тем 3, 18, 22 нет исходников): функции, виды ссылок, критерии с `&`, заполнение; `course-excel/constructs.py`, генерируемый `needs.md`; скрипт падает на конструкции темы без урока основного уровня — _Depends on:_ T2, T3
- [x] `T7` Этап 3: `course-excel/map.md` (урок → разделы/строки исходника → что добавлено; «передано теме 9/3/18/22»; куда ушли главы 20–24; «Термины тем ЕГЭ → уроки курса»; ошибки исходника) и `course.json` (`id: excel`, `prefix: xl`, модули → уроки, `site.id`/`routeSlug`); сквозной пример — таблица покупок листа «База»; мосты и шаги-сборки (П19) — _Depends on:_ T6
- [x] `T8` Тексты, модуль «Лист и данные» (главы 1–3): шаблон 4.2 курса, перенос `split_source.py`, таблицы-примеры → ```` ```sheet ````, упражнения глав 21–22 + свои (не повторяют разбор), `course-excel/checks.py` — пересчёт вторым способом, урок с ответами без проверок — FAIL — _Depends on:_ T5, T7
- [x] `T9` Тексты, модуль «Формулы» (главы 4–6, `fill_try` в уроке о `$`) — _Depends on:_ T8
- [x] `T10` Тексты, модуль «Условия» (главы 7–10 + механизмы глав 14, 17) — _Depends on:_ T9
- [x] `T11` Тексты, модуль «Таблицы и связи» (глава 11, механизмы глав 15–17, глава 18) — _Depends on:_ T10
- [x] `T12` Тексты, модуль «Итог» (главы 13, 19, 20; шпаргалка RU/EN из главы 24) и «Дополнительно» (глава 12, пометка «Дополнительный урок…», вне mastery) — _Depends on:_ T11
- [x] `T13` Книга практики `course-excel/workbook.py` (openpyxl): листы уроков с данными и областями задач, лист «Ответы» с формулами RU→EN; `--check` пересчитывает книгу библиотекой `formulas` и сверяет с `sheet_eval` и `checks.py`; ссылка на книгу на странице курса стенда — _Depends on:_ T12
- [x] `T14` Этап 5 (П18, П21, с мерой): новые построители `figures.py` (адрес и диапазон, сдвиг ссылки при копировании, значение и формат, полуинтервал дат, фильтр и `ПРОМЕЖУТОЧНЫЕ.ИТОГИ` — по необходимости); `course-excel/review.md` с местами без схемы и причиной — _Depends on:_ T12
- [x] `T15` Этап 7: анализ потребностей, `verify_sheets.py`, `checks.py`, `workbook.py --check`, тесты `sheet_eval`, соответствие JS, `build.py`; регрессия курса Python и тем 23/25; гейт; Playwriter — все `xl-*` на 1280/375 px, мини-лист (выбор, подсветка, правка, `#ЗНАЧ!`, сброс, клавиатура), `fill_try`, схемы — _Depends on:_ T13, T14
- [x] `T16` Этап 8: раздел курса в `content/lesson-design/index.html`, публикация в артефакт стенда https://claude.ai/artifact/XiysKjUymWBdzjXQjdz8uk; ревью архитектора по модулям, замечания — новыми ID сюда, общие правила — в `lesson-patterns.md` — _Depends on:_ T15 — **2026-10-11:** раздел в обзоре и публикация (версия 30) сделаны; ревью архитектора по T17–T19 пройдено, стенд v32 одобрен к закрытию change

Ревью архитектора (2026-10-11):
- [x] `T17` Мини-лист: рамка выбранной ячейки (чёрная) стоит на 1px ниже и правее цветных рамок ячеек-предшественников — все выделения на одной линии сетки — _Depends on:_ T16
- [x] `T18` Мини-лист: рамки соседних ячеек-предшественников разного цвета не наслаиваются (общая граница — одна линия толщиной 2px), заливка внутри диапазона без двойных полос — _Depends on:_ T17
- [x] `T19` Повторный проход уроков 1–15 глазами ученика, не знакомого с материалом: где текст объясняет не полностью или механизм держится в голове — схема, пошаговая анимация или лист (П18, с мерой); пошаговое вычисление формулы проверяется вычислителем (каждый шаг равен ответу); `review.md` дополнен — _Depends on:_ T18

---

## Files

### Create / modify
~~~
docs/SPEC.md                                   (§1.3, §1.4, §2.2, §2.3, §9 — сделано в /plan)
docs/runbooks/lesson-pipeline.md
docs/runbooks/lesson-patterns.md               (только если появится паттерн)
docs/artifacts/lessons/Excel-Course.docx, Excel-Practice.xlsx   (исходник, без правок)
docs/artifacts/lessons/excel_course.md, excel_practice.md
scripts/lesson_design/docx_to_md.py
scripts/lesson_design/sheet_eval.py (+ тесты), verify_sheets.py
scripts/lesson_design/sheetblock.py, sheetblock.js, sheet_conformance.mjs
scripts/lesson_design/needs_report.py (или excel_needs.py)
scripts/lesson_design/build.py, figures.py, excel_figures.py, excel_needs.py
scripts/tests/sheet_eval_test.py, scripts/pyrightconfig.json (extraPaths: lesson_design)
.gitignore                                     (xl-*.html, книга практики, sheet_cases.json)
content/lesson-design/index.html, textbook.css (только при необходимости)
content/lesson-design/course-excel/            (course.json, constructs.py, needs.md, map.md,
                                                NN-slug.md, review.md, checks.py, workbook.py,
                                                sheet_cases.json)
~~~

### Do NOT touch
- `apps/web/**`, `apps/api/**`, `content/practice-bank/**` — перенос в Change 177
- `scripts/lesson_design/terms.py` — слаги меняются только при переносе
- `content/lesson-design/course-python/`, `topic-23/`, `topic-25/` — только регрессионная сборка

---

## Contracts

See `docs/SPEC.md` §1.3, §1.4, §2.3, `docs/runbooks/lesson-pipeline.md` and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

Проверки этапа 7 пайплайна по `content/lesson-design/course-excel` (раздел «Мини-курс Excel»
`lesson-pipeline.md`) и регрессия курса Python и тем 23/25.

### Gate evidence

<!-- Filled by /work from the gate.py summary; /ship compares the diff since this HEAD. -->

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 6d3ac68 + worktree | format, python-format, tooling-lint, host-ruff, host-python, docs-links, lesson-media | PASS | 17 |
| 6d3ac68 + worktree | stage 7: `excel_needs.py` (39 constructs, 151 formulas); `verify_sheets.py --cases` (64 sheets, 176 formulas); `sheet_conformance.mjs` 212 cases / 4489 cells; `checks.py` 15 lessons; `sheet_eval_test` 43; `workbook.py --check` (392 cells agree with `formulas`, 33 KNOWN, 14 answers); `build.py` course | PASS | — |
| 6d3ac68 + worktree | regression: course Python and topics 23/25 rebuilt — 55 pages differ only by the «Курс Excel» nav item; `verify_code.py` 196/16/40, `checks.py` ×3 | PASS | — |
| 6d3ac68 + worktree | Playwriter: 19 pages × 1280/375 px — no page overflow, no console errors; 64 sheets fit at 375 px (wide grids scroll inside); edit → recalculation, text in a number cell → #ЗНАЧ!, Esc, F2, arrows, reset, aria-live; lesson 12 tabs keep the formula's frames; `fill_try` valid/mixed/invalid; figures viewed | PASS | — |
| 6d3ac68 + worktree (T17–T18) | format, docs-links; Playwriter: lessons 6 and 8 at 1280 px — selection and reference frames on the same grid lines, shared edges one 2px band, no double tint | PASS | — |
| 6d3ac68 + worktree (T19) | format, python-format, tooling-lint, host-ruff, host-python, docs-links, lesson-media; `verify_sheets.py` (65 sheets, 186 formulas, every `formula_steps` step equals the formula), `checks.py` (15 lessons), `excel_needs.py`, `sheet_conformance.mjs` (210 cases, 4520 cells, 0 mismatches); Playwriter: lessons 1–4, 6–12 at 1280 px — every new figure and stepper frame viewed, no console errors; at 375 px no page overflow | PASS | — |
| 6d3ac68 + worktree | coverage decision: `Excel-Course.docx`, `Excel-Practice.xlsx` (no gate rule) — stage-1 sources, verified by `docx_to_md.py` conversion and by recomputing all 388 workbook formulas with `sheet_eval` against the cached values (0 mismatches) | PASS | — |

---

## Implementation Notes

- Уроки 8 и 9 переставлены относительно порядка учебника (числа раньше подсчёта по условию): подсчёт «кратно 2 или 3» нуждается в ОСТАТ (П19).
- Анализ формул нашёл у темы 9 СУММКВ и СТРОКА(), которых нет в справочнике учебника; обе добавлены в вычислители и уроки 6 и 13.
- Схемы и песочница курса — в отдельном `excel_figures.py`, регистрируются в `figures.FIGURES`; `build.py` находит курсы по `course-*/course.json`, термины тем по-прежнему ведут в курс Python.
- Библиотека `formulas` расходится с Excel в нескольких местах (`СЖПРОБЕЛЫ` внутри строки, русская локаль в `ЗНАЧЕН` и `&`, `ЕЧИСЛО` от текста из цифр, критерий `"<>"`, укороченный диапазон `СУММЕСЛИ`, `ОКРУГЛ(1,005;2)`); семантика `sheet_eval` сверена по документации Microsoft, отличия перечислены в `workbook.py` → `KNOWN`. Цикл ссылок в `sheet_eval` — ошибка `#ЦИКЛ!` (Excel показывает предупреждение и 0); на листах курса циклов нет.
- В файле .xlsx строки, скрытые фильтром на стенде, — просто скрытые строки: код 9 у `ПРОМЕЖУТОЧНЫЕ.ИТОГИ` в Excel их учтёт.
- Артефакт не раздаёт .xlsx: книга практики генерируется в репозитории (`files/`, в `.gitignore` вместе с `sheet_cases.json`); на сайт — вложением в Change 177.

---

## Commit Message

```
feat(change-176): Excel course stand — evaluator, live sheet, lessons
```
