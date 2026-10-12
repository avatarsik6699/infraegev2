# CHANGE 180 — Волна 2: темы 4, 7, 8, 9 по пайплайну на демо-стенде

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `180` |
| Slug | `topics-4-7-8-9-stand` |
| Title | Волна 2: темы 4, 7, 8, 9 по пайплайну на демо-стенде |
| Status | `archived` |
| Branch | `feature/180-topics-4-7-8-9-stand` |

---

## Goal

Перестроить на демо-стенде четыре темы ЕГЭ по [пайплайну](../../runbooks/lesson-pipeline.md) и
[порядку волны](../../runbooks/lesson-wave.md), этапы 1–8 (SPEC §9, пункт 1): № 4 «Кодирование и
условие Фано» (`docs/artifacts/lessons/4.md`), № 7 «Объём информации: изображения, звук, текст»
(`7.md`), № 8 «Комбинаторика: слова и последовательности» (`8.md`), № 9 «Обработка таблицы»
(`9.md`). Исходники подтверждены архитектором (2026-10-11). Агент на тему (Opus 5.5, effort high):
фаза А — частоты и карта, контрольная точка, фаза Б — тексты, задачи, схемы и сразу проход глазами
ученика (по ревью волны 1: понятность, переусложнение, форматирование только имеющимися средствами,
мера схем). Оркестратор — общие файлы, гейт, браузер, свой проход, публикация.

Тема 9 решается в электронной таблице и на Python: стенд уже умеет живой мини-лист и строку формул
курса Excel (`sheetblock.py`, Change 176); подсказки терминов Excel (`terms.EXCEL_TERMS`) темам пока
недоступны — сборка получает их в этом change. Код сайта не меняется.

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
- [x] `T1` Этап 1 и подготовка (оркестратор): исходники `4.md`, `7.md`, `8.md`, `9.md` уже в нужных именах; новый исходник архитектора `18.md` добавить в git (для волны 3); модули схем `code_figures.py` (4), `volume_figures.py` (7), `combo_figures.py` (8), `table_figures.py` (9), подключённые в `figures.py`; строки терминов `# --- topic NN ---` в `terms.py`; задание агенту в `lesson-wave.md` дополнить проходом глазами ученика в фазе Б — _Depends on:_ —
- [x] `T2` Термины Excel в темах (оркестратор): `{{xl-…|подпись}}` открывает подсказку со ссылкой на урок курса Excel, как термины Python — на курс Python; `EXCEL_TERMS` получает заголовок и объяснение; `export_course.py --check` и регрессия сборки остальных страниц — _Depends on:_ —
- [x] `T3` Фаза А, тема 4 (агент) — _Depends on:_ T1
- [x] `T4` Фаза А, тема 7 (агент) — _Depends on:_ T1
- [x] `T5` Фаза А, тема 8 (агент) — _Depends on:_ T1
- [x] `T6` Фаза А, тема 9 (агент): в карте — что решается в таблице, что на Python, какие уроки курса Excel становятся терминами — _Depends on:_ T1, T2
- [x] `T7` Контрольная точка (оркестратор → архитектор): проверка карт, сводка уровней и спорных решений — _Depends on:_ T3, T4, T5, T6
Контрольная точка (2026-10-12), решения по рекомендации оркестратора (архитектор не возразил и попросил обязательный проход глазами ученика): 4 — сравнение форм дерева в основном уровне, «два требования подряд» и произведение длин — дополнительный уровень, программы только проверяют ответ; 7 — пересказы задач подборки переделать на свои числа, V = K · i в основном уровне; 8 — формулы подсчёта ручной проверкой, общий вывод свёрнут, номер слова — две основные подтемы; 9 — 22 аналога входят в подборку, по два файла `.xlsx` и `.txt` на задачу (1000 строк), решение таблицей и программой. Общие термины `product`, `enumerate`, `xl-row` и проверку листов в темах (`verify_sheets.py topic-NN`) добавил оркестратор.

- [x] `T8` Фаза Б, тема 4 (тот же агент) — _Depends on:_ T7
- [x] `T9` Фаза Б, тема 7 (тот же агент) — _Depends on:_ T7
- [x] `T10` Фаза Б, тема 8 (тот же агент) — _Depends on:_ T7
- [x] `T11` Фаза Б, тема 9 (тот же агент): мини-листы и формулы проверяются вычислителем курса Excel — _Depends on:_ T7
Ревью архитектора (2026-10-12): после фазы Б — отдельный повторный проход каждого урока глазами ученика (понятность и последовательность, переусложнение, форматирование имеющимися средствами, достаточно ли схем и анимаций), тем же агентом:
- [x] `T14` Тема 4 — _Depends on:_ T8
- [x] `T15` Тема 7 — _Depends on:_ T9
- [x] `T16` Тема 8 — _Depends on:_ T10
- [x] `T17` Тема 9 — _Depends on:_ T11

- [x] `T12` Сборка волны (оркестратор): совпадения терминов и схем, `index.html`, свой проход глазами ученика, этап 7 по всем темам, регрессия, Critical Gate, Playwriter на 1280 и 375 px — _Depends on:_ T14, T15, T16, T17
- [x] `T13` Этап 8 (**2026-10-12:** опубликовано, версии 37 и 38 — после T18; книги `.xlsx` темы 9 артефакт не принимает — на стенде доступны копии `.txt`; архитектор принял стенд и запустил `/ship`): публикация в артефакт стенда https://claude.ai/artifact/XiysKjUymWBdzjXQjdz8uk; ревью архитектора — замечания новыми ID — _Depends on:_ T12


Ревью архитектора (2026-10-12): решения по вопросам агентов поручены оркестратору — тема 4 без запускаемых блоков (процессы — пошаговые схемы на дереве); тема 7 без отдельной формулы для «наименьшего заголовка» (тот же цикл обычной программой считает экзаменационные числа); тема 9 — широкие мини-листы прокручиваются внутри блока, как в курсе Excel.
- [x] `T18` Тема 4, подтема 5: отдельный пример второй ловушки формы дерева — кратчайший код второй по частоте букве невыгоден (её проверяют итоговые задачи 4 и 5) — _Depends on:_ T14

---

## Files

### Create / modify
~~~
docs/SPEC.md                                     (§9 — сделано в /plan)
docs/artifacts/lessons/18.md                     (исходник архитектора, только добавить в git)
docs/runbooks/lesson-wave.md, lesson-pipeline.md (задание агенту; термины Excel в темах)
content/lesson-design/topic-4/, topic-7/, topic-8/, topic-9/   (агенты)
scripts/lesson_design/code_figures.py, volume_figures.py, combo_figures.py, table_figures.py
scripts/lesson_design/figures.py                 (регистрация модулей)
scripts/lesson_design/terms.py                   (термины тем; EXCEL_TERMS с текстом подсказки)
scripts/lesson_design/build.py, export_course.py (термины Excel, T2)
scripts/lesson_design/verify_sheets.py, tracer.py (листы тем; импортированный класс)
.gitignore, content/lesson-design/course-excel/map.md (книги темы 9; текст о реестре терминов)
content/lesson-design/index.html
~~~

### Do NOT touch
- `apps/web/**`, `apps/api/**`, `content/practice-bank/**` — перенос на сайт отдельными Change
- готовые темы и курсы стенда — только регрессионная сборка
- агентам — всё вне своей `topic-N/`, своего модуля схем и своей строки терминов

---

## Contracts

See `docs/SPEC.md` §1.4, §2.3, `docs/runbooks/lesson-pipeline.md`, `docs/runbooks/lesson-wave.md`
and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

Проверки этапа 7 по `topic-4`, `topic-7`, `topic-8`, `topic-9`; для T2 — `export_course.py --check`
и регрессия сборки остальных тем и курсов.

### Gate evidence

<!-- Filled by /work from the gate.py summary; /ship compares the diff since this HEAD. -->

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 3b11914 + рабочее дерево | format, python-format, host-ruff, host-python, docs-links, lesson-media | PASS | ~20 |
| 3b11914 + рабочее дерево | этап 7: verify_code 4/7/8/9 — 10/16/39/36 программ, checks.py — 96/85/98/90 (с `ulimit -v 3000000`), verify_sheets topic-9 — 6 листов, 72 формулы; export_course --check Python и Excel — stale 0; регрессия: старые темы и курсы прежние, кроме строки навигации и карты курса Excel (правка текста); две сборки всех тем волн 1–2 побайтно равны | PASS | — |
| 3b11914 + рабочее дерево | Playwriter: 4-1…4-8, 7-1…7-8, 8-1…8-8, 9-1…9-9, карты, частоты, ревью — 1280 и 375 px без прокрутки и ошибок консоли; пошаговые схемы до последнего кадра, запускаемые блоки до конца; мини-листы темы 9 без ошибочных ячеек | PASS | — |

---

## Implementation Notes

- 2026-10-12: `topic-4/checks.py` собирал все таблицы кодов в список (экспоненциально много) и занял ~18 ГБ — WSL остановлен архитектором, агент темы 4 прерван. Оркестратор переписал перебор генератором, `has_room` — на строки длины самого длинного кода, буквы с равной частотой — без перестановок: 95 проверок за ~20 с и 15 МБ. Правило «переборы генераторами, скрипты агента с `ulimit -v`» — в `lesson-wave.md`.
- Книги `.xlsx` темы 9 генерирует `topic-9/datasets.py`; они в `.gitignore`, как книга курса Excel; копии `.txt` с теми же данными в репозитории.
- `tracer.py`: импортированный класс (`from itertools import product`) в панели переменных — «функция», как импортированная встроенная функция (Change 179); классы программы показываются как прежде.
- `code_figures.py`: узлы дерева раскладываются в устойчивом порядке — раньше порядок узлов одной глубины зависел от перебора множества, и SVG менялся от сборки к сборке.
- `verify_sheets.py` проверяет и тему (`topic.json`); листы тем не входят в `sheet-cases.json` сайта (`--cases` только для курса).
---

## Commit Message

```
feat(change-180): topics 4, 7, 8, 9 stand — maps, lessons, Excel terms
```
