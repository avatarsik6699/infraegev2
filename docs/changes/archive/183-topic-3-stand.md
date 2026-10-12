# CHANGE 183 — Тема 3 «Связанные таблицы» по пайплайну на демо-стенде

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `183` |
| Slug | `topic-3-stand` |
| Title | Тема 3 «Связанные таблицы» по пайплайну на демо-стенде |
| Status | `archived` |
| Branch | `feature/183-topic-3-stand` |

---

## Goal

Перестроить на демо-стенде тему № 3 ЕГЭ «Связанные таблицы: отбор и расчёт» по
[пайплайну](../../runbooks/lesson-pipeline.md) и [порядку волны](../../runbooks/lesson-wave.md), этапы 1–8
(SPEC §9, пункт 1). Исходник архитектора — [`3.md`](../../artifacts/lessons/3.md) и тренировочная книга
[`3_training.xlsx`](../../artifacts/lessons/3_training.xlsx) (выгрузка листов —
[`3_training.md`](../../artifacts/lessons/3_training.md), `docx_to_md.py`).

Решение архитектора (2026-10-12): **тема 3 решается только в Excel, Python в уроках нет** — как
тема 18. Мини-лист и строка формул курса Excel, термины `{{xl-…}}` на уроки курса (поиск по ключу
`ВПР`, отбор `СУММЕСЛИМН`, фильтр и `ПРОМЕЖУТОЧНЫЕ.ИТОГИ` уже есть в курсе — тема объясняет, почему
задание решается так, а не механизм функции). `checks.py` пересчитывает ответы вторым способом на
Python — это проверка, а не материал урока; `verify_sheets.py` проверяет формулы мини-листов.

Одна тема — один агент (Opus 5.5, effort high), как в волнах: фаза А — частоты и карта,
контрольная точка, фаза Б — тексты, задачи, схемы и проход глазами ученика; после публикации —
второй проход тем же агентом. Оркестратор — общие файлы, гейт, браузер, свой проход, публикация.
Пересечения: курс Excel (уроки 9, 11, 12, 15), тема 9 (признак строки, итог по столбцу), тема 18
(Excel-тема без Python, «Поле из файла»). Код сайта не меняется.

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
- [x] `T1` Подготовка (оркестратор): исходник на место `docs/artifacts/lessons/3.md` (ссылка на книгу вместо `sandbox:`), книга `3_training.xlsx` и её выгрузка `3_training.md`; модуль схем `db_figures.py` (префикс `db_`), подключённый в `figures.py`; строки `# --- topic 3 ---` в `terms.py` (термины и `EXCEL_TERMS`); `course-excel/constructs.py` — у темы 3 свой исходник в `SOURCES`, конструкция `ПРОМЕЖУТОЧНЫЕ.ИТОГИ` (урок 11), `needs.md` пересобран; папка подборок вне репозитория — _Depends on:_ —
- [x] `T2` Фаза А, тема 3 (агент): подборки «Решу ЕГЭ» (каталог шире одной подборки — проверить), `tasks.py`, `frequency.md`, `map.md`, `topic.json`; в карте — какие формулы и приёмы нужны каждому типу задач, что передано курсу Excel терминами, как задачи получают книгу с тремя листами (стенд `.xlsx` не отдаёт: прецеденты — `.txt`-копии темы 9 и свёрнутый мини-лист «Поле из файла» темы 18) — _Depends on:_ T1
- [x] `T3` Контрольная точка (оркестратор → архитектор): проверка карты, сводка уровней и спорных решений, способ выдачи данных на стенде — _Depends on:_ T2
Контрольная точка (2026-10-12), решения оркестратора по поручению архитектора: живая подборка одна — 424 (64 задачи) и 20 аналогов с её страниц, всего 84; архив «Д3»/«Д4» (191 задача: родословные до 2021 года, таблицы с выбором ответа до 2015, графы — нынешнее задание 1) размечен, но в уровни не входит — формат с 2022 года не встречается. Основной уровень — подтемы 1–6, 72 из 84 (86 %), все 5 задач экзаменов 2022–2026 и демоверсии 2023–2025; подтема 6 «Итоги по объектам» основная по правилу 2.4 (без неё 67 %); подтема 7 «Другие базы» дополнительная — 12 авторских задач, на экзаменах не было. Товар частью названия и улица (шаблон `*…*`) — в основной подтеме 3. Упражнения исходника разобраны в его тексте — в подтемы идут на изменённых данных. Данные задач: книги `3-N.xlsx` из трёх листов генерирует `datasets.py` (в `.gitignore`, для сайта), на стенде под условием — ссылка и свёрнутый мини-лист «Книга из файла» всех трёх листов (`db_book`, как `grid_book` темы 18); копии `.txt` не делаются — книга из трёх листов не собирается из отдельных текстов, а таблицу предпросмотра можно скопировать в Excel; 150–250 операций в задачах подтем, до 400 в итоговых. Новые термины Excel `xl-wildcard` (урок 9), `xl-sheetref` (урок 12), `xl-pivot` (урок 15) заводит агент под строкой темы 3 в `EXCEL_TERMS`.

- [x] `T4` Фаза Б, тема 3 (тот же агент), с проходом глазами ученика; решения — мини-листы и формулы, проверка вычислителем курса Excel; программ в уроках нет — _Depends on:_ T3
- [x] `T5` Сборка (оркестратор; **2026-10-12:** опубликовано, версия 44): совпадения терминов и схем, `index.html`, свой проход глазами ученика, этап 7, регрессия, Critical Gate, Playwriter на 1280 и 375 px, публикация в артефакт стенда https://claude.ai/artifact/XiysKjUymWBdzjXQjdz8uk — _Depends on:_ T4
- [x] `T6` Второй проход глазами ученика (тот же агент) — _Depends on:_ T5
- [x] `T7` Сборка после прохода (оркестратор; **2026-10-12:** опубликовано, версия 45): этап 7, регрессия, гейт, Playwriter, публикация; ревью архитектора — замечания новыми ID — _Depends on:_ T6

---

## Files

### Create / modify
~~~
docs/SPEC.md                                     (§9 — сделано в /plan)
docs/artifacts/lessons/3.md, 3_training.xlsx, 3_training.md   (исходник, T1)
docs/runbooks/lesson-wave.md, lesson-pipeline.md (выводы, история)
content/lesson-design/topic-3/                   (агент)
scripts/lesson_design/db_figures.py
scripts/lesson_design/figures.py                 (регистрация модуля)
scripts/lesson_design/terms.py                   (термины темы)
content/lesson-design/course-excel/constructs.py, needs.md   (исходник темы 3)
content/lesson-design/index.html
~~~

### Do NOT touch
- `apps/web/**`, `apps/api/**`, `content/practice-bank/**` — перенос на сайт отдельным Change
- готовые темы и курсы стенда — только регрессионная сборка
- агенту — всё вне `topic-3/`, `db_figures.py` и своих строк терминов

---

## Contracts

See `docs/SPEC.md` §1.4, §2.3, `docs/runbooks/lesson-pipeline.md`, `docs/runbooks/lesson-wave.md`
and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

Проверки этапа 7 по `topic-3` (`verify_sheets.py topic-3`, `checks.py`, `datasets.py --check`, если
есть); `excel_needs.py` курса Excel; регрессия сборки остальных тем и курсов против `main`.

### Gate evidence

<!-- Filled by /work from the gate.py summary; /ship compares the diff since this HEAD. -->

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 2709261 + рабочее дерево | format, python-format, host-ruff, host-python, docs-links, lesson-media | PASS | ~20 |
| 2709261 + рабочее дерево | этап 7 темы 3: checks.py — 137, verify_sheets — 9 листов, 30 формул, `datasets.py --check` (8 книг байт в байт), verify_code — программ нет, `excel_needs.py` — 0 проблем; export_course --check Excel и Python — stale 0; `verify_sheets --cases --check` курса Excel — 210 случаев, актуален; регрессия против `main`: прежние страницы совпадают, кроме ссылки «Тема 3» в навигации, `index.html` и `xl-needs.html` | PASS | — |
| 2709261 + рабочее дерево | Playwriter: 3-1…3-8, карта, частоты, ревью, 18-2, 18-3, 18-9, 9-4, xl-05, xl-11, xl-12 на 1280 и 375 px — без прокрутки страницы и ошибок консоли, все вкладки листов переключены, ошибочные ячейки только в намеренных примерах `#Н/Д` урока xl-12; мини-листы и «Книга из файла» глазами | PASS | — |
| 2709261 + рабочее дерево (после T6) | format, python-format, host-ruff, host-python, docs-links, lesson-media; этап 7 темы 3 — checks.py 137, verify_sheets 9 листов и 31 формула, `datasets.py --check`; Playwriter 3-1…3-8 на 1280 и 375 px без прокрутки и ошибок, вкладки листов, перепечатка `М1` кириллицей в `C3` подтемы 2 даёт `#Н/Д`, латинская `M2` — «Южный» | PASS | ~21 |
| 2709261 + рабочее дерево (/ship) | affected Critical: после последнего прогона входы не менялись — строки приняты без повтора; `docs/artifacts/lessons/3_training.xlsx` — исходник архитектора без правила гейта, покрытие — его выгрузка `3_training.md` (`docx_to_md.py`) и сверка формул листа «Разбор» агентом (фаза А) | PASS | — |

---

## Implementation Notes

- Проход оркестратора (T5): страница 1 — повтор «чтобы уверенно различать» и определение базы данных; 3 и 8 — слишком длинные первые утверждения; 3 и 5 — двойное выделение одной мысли; 4 — пример целой части (102,95 → 102) совпадал с ответом задачи 8 той же подтемы, заменён на 47,63.
- Мини-лист (`sheetblock.js`, `textbook.css`): выбранная ячейка широкого листа уходила за правый край — при загрузке лист прокручивается к ней внутри своей рамки, страница не двигается. Книга задачи в блоке «Книга из файла» (220–400 строк) раскрывалась на всю высоту (~7000 px) — теперь прокрутка внутри блока высотой 26rem, буквы столбцов закреплены; то же для «Поле из файла» темы 18.
- Локально `index.html` без обёртки артефакта читается в неверной кодировке и даёт ложную прокрутку на 375 px (так же на `main`); опубликованная страница кодировку получает.

---

## Commit Message

```
feat(change-183): topic 3 stand — map, Excel lessons, linked tables
```
