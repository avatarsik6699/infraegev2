# CHANGE 174 — Мини-курс Python по пайплайну: стенд всего курса

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `174` |
| Slug | `python-course-stand` |
| Title | Мини-курс Python по пайплайну: стенд всего курса |
| Status | `archived` |
| Branch | `feature/174-python-course-stand` |

---

## Goal

Привести мини-курс Python к обязательному пайплайну и паттернам
([lesson-pipeline.md](../../runbooks/lesson-pipeline.md), [lesson-patterns.md](../../runbooks/lesson-patterns.md))
на демо-стенде (этапы 1–8), чтобы следующие темы ЕГЭ ссылались на корректные уроки курса
(SPEC §1.4, §2.2, §2.3). Исходник архитектора — `docs/artifacts/lessons/Python_podrobny_uchebnik.html`.
Код сайта не меняется: перенос на сайт — отдельный Change 175.

Решения архитектора (2026-10-10):
1. В курс идут языковые механизмы; алгоритмические приёмы глав 22–26 передаются темам ЕГЭ
   (в `map.md` — «передано теме NN»).
2. Главы 27–29 — уроки дополнительного уровня в конце курса, вне mastery курса.
3. Проект «Список дел» (`python-todo-*`) заменяется итоговым модулем по главам 30–31.
4. Change 174 — стенд всего курса; Change 175 — перенос на сайт.

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
- [x] `T1` Пайплайн для курса: в `lesson-pipeline.md` раздел «Мини-курс Python»: этапы 1–8 для курса, структура `content/lesson-design/course-python/`, правило уровней, шаблон урока курса, строка в «Истории решений». Если для курса появляется свой паттерн, он записывается в `lesson-patterns.md` — _Depends on:_ —
- [x] `T2` Этап 1: `scripts/lesson_design/html_to_md.py` (stdlib `html.parser`) переводит HTML-учебник в `docs/artifacts/lessons/python_course.md`: главы и разделы → заголовки с номерами, `<pre>` → `python`, однозначный комментарий-результат → блок `output`, таблицы → Markdown, «Разбор» → `<details>`, навигация, CSS и JS удаляются. Коммитятся HTML-оригинал и md — _Depends on:_ —
- [x] `T3` Этап 2: `scripts/lesson_design/needs_report.py`. Разбирает через `ast` блоки `python` исходников тем `docs/artifacts/lessons/*.md` и строит таблицу «конструкция → темы ЕГЭ → сколько раз». Привязка конструкций к разделам исходника — `course-python/constructs.py`; отчёт `course-python/needs.md` генерируется. Уровни: нужна хотя бы одной теме → основной; ни одной → дополнительный; исключения — в `map.md`. Неотслеживаемые исходники тем коммитятся без правок как входные данные — _Depends on:_ T2
- [x] `T4` Этап 3: `course-python/map.md` и `course-python/course.json` (модули → уроки: `source`, `title`, `level`, `lead`, `site.id`/`site.routeSlug`). Порядок от фундамента, без ссылок вперёд. Слаги: тот же смысл — прежние `id`/`routeSlug`, новая идея — новый слаг, `todo-*` — без редиректов. В `map.md`: «урок → строки исходника → что добавлено», «термин `terms.py` → новый урок», «раздел глав 22–26 → передан теме NN», куда ушли главы 0 и 32–34, ошибки исходника — _Depends on:_ T3
- [x] `T5` Инструменты стенда: `build.py` собирает папку с `course.json` (модули в навигации, страницы `py-NN.html`, карта/потребности/ревью). `verify_code.py`: блоки `input` (stdin) и `error` (последняя строка traceback). Раздел курса в `content/lesson-design/index.html`. Темы 23 и 25 собираются без изменений — _Depends on:_ T4
- [x] `T6` Тексты, модуль «Старт» (главы 0–4, 18.1): шаблон этапа 4.2, перенос через `split_source.py`, 6–10 оригинальных задач на урок, ответы пересчитаны в `course-python/checks.py` — _Depends on:_ T5
- [x] `T7` Тексты, модуль «Условия» (главы 5–6) — _Depends on:_ T6
- [x] `T8` Тексты, модуль «Циклы» (главы 7–8) — _Depends on:_ T7
- [x] `T9` Тексты, модуль «Последовательности и коллекции» (главы 9–14) — _Depends on:_ T8
- [x] `T10` Тексты, модуль «Функции и инструменты» (главы 15, 16, 25.1–25.3, 20, 23.2, 21) — _Depends on:_ T9
- [x] `T11` Тексты, модуль «Данные и надёжность» (главы 17, 18.2–18.6, 19, языковая часть 22–23) — _Depends on:_ T10
- [x] `T12` Тексты, модуль «Итог» (главы 30–32) — _Depends on:_ T11
- [x] `T13` Тексты, модуль «Дополнительно» (главы 27–29, пометка «Дополнительный урок…») — _Depends on:_ T12
- [x] `T14` Этап 5 (П18): схемы и пошаговые анимации тяжёлых мест — новые построители в `figures.py`; `course-python/review.md` с местами без схемы и причиной — _Depends on:_ T6–T13
- [x] `T15` Этап 7: `needs_report.py`, `verify_code.py`, `checks.py`, `build.py` по курсу зелёные; регрессия тем 23/25; Playwriter 1280/375 px, анимации, доказательства, скриншоты схем — _Depends on:_ T14
- [x] `T16` Этап 8: опубликовать курс в артефакт стенда https://claude.ai/artifact/XiysKjUymWBdzjXQjdz8uk. Ревью архитектора по модулям; замечания — новыми ID сюда, общие правила — в `lesson-patterns.md` — _Depends on:_ T15, T24 — **2026-10-11:** архитектор принял курс законченным; уроки тем ЕГЭ на сайте, кроме 23 и 25, признаны устаревшими (не правятся, ждут рефакторинга)

Итерация 2 (2026-10-10, ревью курса глазами ученика: наглядность и связность):
- [x] `T17` Вывод курса строками, как в терминале; блок `console` (сеанс с набранным вводом `⟪…⟫`) в `build.py` и `verify_code.py`; темы 23/25 сохраняют компактную строку — _Depends on:_ T15
- [x] `T18` Трассировщик `trace_stepper`: кадры из реального запуска (`sys.settrace`) — строка, таблицы имён и вызовов, вывод; уроки 1, 2, 6, 7, 12, 15, 20, 22 — _Depends on:_ T17
- [x] `T19` Статические схемы `place_value`, `branch`, `loop_grid`, `venn`, `loop_to_comp`; `refs` в уроках 11, 15, 16 — _Depends on:_ T17
- [x] `T20` Курсор `cursor_stepper`: файл (урок о файлах) и итератор (урок 22) — один механизм — _Depends on:_ T17
- [x] `T21` Песочницы: `remainder_widget` (урок 3), `mask_try` (урок 24), новая `range_try` (уроки 8, 9) — _Depends on:_ T17
- [x] `T22` Связность: мост вместо статистики ЕГЭ, сквозная задача курса `5, -2, 10, 7`, шаги-сборки в конце модулей, урок «Модули» после «Аргументы и договорённость», без ссылок вперёд, правки уроков 1 и 2, тонкости — в свёрнутый блок — _Depends on:_ T18–T21
- [x] `T23` П19/П20 в `lesson-patterns.md`, раздел курса в `lesson-pipeline.md`, `review.md` курса — _Depends on:_ T22
- [x] `T24` Этап 7, регрессия тем 23/25, Playwriter, гейт, публикация «Курс Python, итерация 2» — _Depends on:_ T23
- [x] `T25` Запускаемый блок кода ```` ```python run ```` вместо SVG-трассировщика: шаги из `tracer.py`, `runblock.py` (HTML, JS, данные), `build.py`/`verify_code.py`, стили; 10 примеров в уроках 1, 2, 6, 7, 8, 12, 15, 21, 22; П20 и пайплайн; Playwriter, гейт, публикация — _Depends on:_ T24
- [x] `T26` Доработка запускаемого блока по ревью: шапка с условным именем файла у всех блоков кода курса и кнопка «Запуск» в ней; переменные справа от кода или под ним, рамки вызовов, списки и словари объектами со стрелками; высоты по самому большому шагу (без сдвигов); слияние шагов одной строки; естественные формулировки; запуск добавлен в уроки 10, 15 (`rebind`/`mutate`) и 16 вместо статичных схем `refs` в 15–16 — _Depends on:_ T25
- [x] `T27` Вывод в блоках кода курса: одно поле «Вывод» (вывод, ввод и ошибка вместе), ввод — «клавишей» с ↵, ошибка — красным, полный traceback в уроке 1 как вывод запускаемого блока; без подписи «Терминал» (шапка команд — «команда»); копирование кода из шапки; номера строк у запускаемых блоков — _Depends on:_ T26
- [x] `T28` Сворачивание длинного кода и вывода (больше 8 строк, свёрнуто до ~7,5 строки) с кнопкой «Показать весь код / вывод», как у `CodeBlock` сайта; в режиме «Запуск» отключено (всё раскрыто, кнопки скрыты) — _Depends on:_ T27
- [x] `T29` Наглядность уроков 1–5 по ревью: каждое понятие, объяснённое текстом, получает схему (путь «задача → алгоритм → код → интерпретатор → вывод», редактор/терминал/оболочка, этапы трёх видов ошибок, порядок чтения traceback, карточки типов, присваивание, имена после каждой строки, `//` и `int()` на прямой, деревья выражений, разложение секунд, путь ввода, `sep`/`end`, f-строка, интервал, сетки истинности, короткое вычисление, ложные значения); таблицы-перечисления уроков 1–5 заменены текстом и схемами; П21 — _Depends on:_ T28
- [x] `T30` Уроки 6–27 по П21 с мерой (замечание архитектора: «не перебарщивать»): таблицы, повторявшие схему или запускаемый пример, и перечисления заменены текстом (6, 7, 8 `range`, 12, 13, 18, 19, 20, 21, 23 обзор, 25 пары); методы строк, списков и regex — переключателями с примерами, посчитанными Python; новые схемы только четыре — три способа порядка строк (8), пары `itertools` сеткой 3 × 3 (23), биты по разрядам (24), рост числа действий (25). Справочные таблицы оставлены: итог модуля (14), источники `for` (22), стоимость операций (25), урок 27. Разбор `:::pick` делит ячейки по « \| » — _Depends on:_ T29
- [x] `T31` Аудит 2026-10-11 — инструменты. `checks.py`: нет ни одной проверки для уроков 15, 16, 18, 19 (34 ответа; пересчитаны вручную — верны) → добавить разделы и защиту «урок с ответами без проверок — FAIL». `build.py`: подсветка не знает `try`/`except`/`finally`/`with`/`yield`/`class`/`lambda`/`raise`/`assert`/`global`/`async`/`await` и встроенные `list`/`open`/`input`/`str`/`set`/`float`/`enumerate`/`zip`/`type`/`map`/`next`, тройные кавычки; метка `console` в `IO_ROWS` мертва; ссылки подсказок терминов ведут на `localhost:8080` — на стенде вести на `py-NN.html`. `verify_code.py`: `PRELUDE` (`isqrt`, `fnmatch`) подставлять только темам — курс проходит без него — _Depends on:_ T30
- [x] `T32` Аудит — фактические неточности: урок 5 «знак всегда двумя символами» (`<`, `>` — один); 2 «Итого»: «смешивать типы нельзя» (`2 + 2.5`, `"ab" * 3` работают); 3 «Итого»: `//` и `int` расходятся только при делении не нацело; 9: «срез обычно обрезается» (всегда), `chr(65)` в тексте при `chr(66)` в коде; 25: подпись «2ⁿ не закончится при нескольких десятках» согласовать с задачей 8 (2³⁰ ≈ 107 с); 27: главная идея — девять шагов вместо десяти, задача 1 — «целое `base`» и «неотрицательный `base`» одновременно; 30: «Python обычно не проверяет аннотации» → не проверяет — _Depends on:_ T31
- [x] `T33` Аудит — висящие ссылки и невыполненные обещания: 16 «правило сортировки в следующем уроке» (следующий — «Модули»); 10 «позднее познакомимся с `copy.deepcopy`»; 2 «`+=` меняет коллекцию» (нигде не показано); 3 `math.isclose` «в уроке о модулях» (он в уроке 23); 21 мост и отладка — «таблица состояний из урока о `while`» (таблица убрана в T30); 17 задача 1 — функция `average` из урока 21; 11 `student[0]` без имени `student`; 8 «пошаговые схемы с подсвеченной строкой» → запускаемые примеры; 15/18/19 — один термин «рамка вызова» вместо «таблица вызова» / «таблица имён» — _Depends on:_ T31
- [x] `T34` Аудит — склейки и повторы после правок: 14 схема `loop_to_comp` разрывает «условное выражение … решает другую задачу:» и его пример; 16 «Запусти по шагам» между «правильный приём …:» и кодом; 20 курсор между фразой о двух числах в заголовке и её примером, «позиция файла» объяснена дважды (первый раз до определения); 19 лишний пробел в начале абзаца после схемы стека; повторы: 7 суммы 0, 1, 3, 6, 10 в двух шагах и «будут напечатаны 1, 2, 3, 4» под тем же выводом, 25 абзац под диаграммой роста = подпись, 23 числа 9 / 6 / 3 в схеме, коде и фразе, 13 оговорка о порядке вывода множеств дважды, 17 «пакеты не нужны» дважды, 21 `[-9, -2, -7]` и список наборов, 10 `append`/`extend` в тексте и переключателе — _Depends on:_ T31
- [x] `T35` Аудит — неявные формулировки для новичка: 7 «рабочая копия привязки к целому значению»; 8 «число 4 и число 6 в перебор не попали»; 9 «пустой шаблон имеет отдельную математическую семантику»; 10 «явный разделитель имеет другую семантику»; 12 абзац о хешах и «правило „любой неизменяемый объект подходит“» (в курсе не звучало); 16 «некоторые свойства описания», «другой контекст знакомых знаков», «сигнатура»; 18 «избавляет от ручного сравнения каждой пары»; 19 «хвостовая рекурсия», «линейно по `n`»; 22 «Отсюда работают …», двойное «и» в пояснении `yield`, `1_000_000` объяснён только в ответе; 23 «при каком условии это верно», `heapq`/`bisect` в обзоре без примера; 24 `fnmatchcase` — «нормализация регистра платформой», `findall` — «захватывающие группы»; 6 абзац о вложенных `if` и «раннем выходе из функции» не в своём шаге; 21 «в окончательном ответе автоматической проверке»; 29 «эту главу» — _Depends on:_ T31
- [x] `T36` Аудит — задачи, повторяющие разобранный пример (заменить данные или вопрос, ответ пересчитать в `checks.py`): 6 — 3, 5; 8 — 1, 7; 9 — 7; 11 — 1; 12 — 1; 15 — 3, 5; 16 — 1, 3, 5; 20 — 1, 2, 3; 21 — 2, 3, 4. Правило «задача не повторяет разобранный пример» — в этап 6 `lesson-pipeline.md` — _Depends on:_ T31
- [x] `T37` Аудит — служебные страницы и документы: `map.md` — «Откуда взят текст» упоминает убранные таблицы (5, 6, 9, 10, 12, 18, 19, 21, 25) и `sum(1 for …)`, «195 программ», «сеанс терминала», нет итераций 3–4; `review.md` — нет схем T29–T30, раздел «Сознательно без схемы» противоречит им (5, 18, 19, 24, 25), «рядом с таблицей инварианта»; `index.html` — «195 программ», список уроков с «Запуском», пункт «длинные таблицы методов»; `lesson-pipeline.md` — шапка команд «терминал» → «команда», строка этапа 5 — П18 и П21, разбор `:::pick` по « \| ». Затем этап 7, Playwriter, гейт, публикация — _Depends on:_ T32, T33, T34, T35, T36

---

## Files

### Create / modify
~~~
docs/SPEC.md                                   (§1.4, §2.3 — сделано в /plan)
docs/runbooks/lesson-pipeline.md
docs/runbooks/lesson-patterns.md               (только если появится паттерн)
docs/artifacts/lessons/Python_podrobny_uchebnik.html
docs/artifacts/lessons/python_course.md
docs/artifacts/lessons/*.md                    (коммит неотслеживаемых исходников тем без правок)
scripts/lesson_design/html_to_md.py
scripts/lesson_design/needs_report.py
scripts/lesson_design/build.py
scripts/lesson_design/verify_code.py
scripts/lesson_design/figures.py
scripts/lesson_design/tracer.py, runblock.py, runblock.js   (запускаемый блок кода)
scripts/lesson_design/export_lesson.py         (разбор :::pick по « | »)
content/lesson-design/index.html
content/lesson-design/textbook.css             (только при необходимости)
content/lesson-design/course-python/           (course.json, constructs.py, needs.md, map.md,
                                                NN-slug.md, review.md, checks.py, files/)
~~~

### Do NOT touch
- `apps/web/**`, `apps/api/**`, `content/practice-bank/**` — перенос в Change 175
- `scripts/lesson_design/terms.py` — слаги меняются только при переносе
- `content/lesson-design/topic-23/`, `content/lesson-design/topic-25/` — только регрессионная сборка

---

## Contracts

See `docs/SPEC.md` §1.4, §2.2–§2.3, `docs/runbooks/lesson-pipeline.md` and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

Проверки этапа 7 пайплайна по `content/lesson-design/course-python` и регрессия тем 23/25
(команды — `lesson-pipeline.md` § Этап 7).

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 1aaea06 + worktree | format, python-format, host-ruff, host-python, docs-links, lesson-media | PASS | 16 |
| 1aaea06 + worktree | stage 7: `needs_report.py`, `verify_code.py` (course 192, topic 25 40, topic 23 16 programs), course `checks.py`, topic 25/23 `checks.py`, `build.py` for course and both topics | PASS | — |
| 1aaea06 + worktree | Playwriter: 36 pages × 1280/375 px — no horizontal scroll, no console errors, every stepper frame, all `<details>` open | PASS | — |
| 1aaea06 + worktree (итерация 2) | format, python-format, host-ruff, host-python, docs-links, lesson-media | PASS | 17 |
| 1aaea06 + worktree (итерация 2) | stage 7: `needs_report.py`; `verify_code.py` course 195 (с `console`), topic 25 40, topic 23 16; `checks.py` course/25/23; `build.py` ×3; topic 23/25 pages byte-identical | PASS | — |
| 1aaea06 + worktree (итерация 2) | Playwriter: 36 pages × 1280/375 px — no horizontal scroll, no console errors, 14 steppers / 125 frames, 5 sandboxes; `range_try` on empty range, step 0, negative step, slice past length | PASS | — |
| 1aaea06 + worktree (T25) | format, python-format, host-ruff, host-python, docs-links, lesson-media | PASS | 13 |
| 1aaea06 + worktree (T25) | stage 7: `verify_code.py` course 195; `checks.py`; `needs_report.py`; `build.py` ×3 (вывод записанного запуска сверен с блоками вывода) | PASS | — |
| 1aaea06 + worktree (T25) | Playwriter: 36 pages × 1280/375 px — no horizontal scroll, no console errors; 10 run blocks stepped to the end (97 steps), static output hidden while running, highlight cleared on close | PASS | — |
| 1aaea06 + worktree (T26) | format, python-format, host-ruff, host-python, docs-links, lesson-media | PASS | 17 |
| 1aaea06 + worktree (T26) | stage 7: `verify_code.py` course 195, topics 40/16; `checks.py`; `needs_report.py`; `build.py` ×3 | PASS | — |
| 1aaea06 + worktree (T26) | Playwriter: 36 pages × 1280/375 px — no horizontal scroll, no console errors; 13 run blocks stepped forward and back (103 steps), block height unchanged on every step | PASS | — |
| 1aaea06 + worktree (T27) | format, python-format, host-ruff, host-python, docs-links, lesson-media | PASS | 13 |
| 1aaea06 + worktree (T27) | stage 7: `verify_code.py` course 196, topics 40/16; `checks.py`; `needs_report.py`; `build.py` ×3 | PASS | — |
| 1aaea06 + worktree (T27) | Playwriter: 37 pages × 1280/375 px — one output field per block, no horizontal scroll, no console errors; run blocks height-stable at 1280/414/375 px | PASS | — |
| 1aaea06 + worktree (T28) | format, python-format, host-ruff, host-python, docs-links, lesson-media; `verify_code.py` course 196 | PASS | 12 |
| 1aaea06 + worktree (T28) | Playwriter: 33 pages × 1280/375 px — 31 folded code blocks open and close, output fold checked on a patched 12-line output, run blocks unfold and stay height-stable, no horizontal scroll, no console errors | PASS | — |
| 1aaea06 + worktree (T29) | format, python-format, host-ruff, host-python, docs-links, lesson-media; `verify_code.py` course 196; `checks.py`; `build.py`; Playwriter py-01…05 × 1280/375 px — 21 new figures, no tables, no horizontal scroll, no console errors | PASS | — |
| 1aaea06 + worktree (T30) | format, python-format, host-ruff, host-python, docs-links, lesson-media; `verify_code.py` course 196; `checks.py`; `build.py` course + topics 23/25 (pick rows unchanged); Playwriter py-01…30 × 1280/375 px — no horizontal scroll, no console errors | PASS | — |
| 1aaea06 + worktree (T31–T37) | format, python-format, host-ruff, host-python, docs-links, lesson-media; `needs_report.py`; `verify_code.py` course 196 (no prelude), topics 40/16; `checks.py` — every lesson with answers checked; `build.py` ×3; Playwriter 49 pages × 1280/375 px — no horizontal scroll, term links → `py-NN.html`, reordered steps 6/14/16/20 verified | PASS | — |

---

## Implementation Notes

- Состав модулей окончательно задан `course.json`/`map.md`: модуль T10 стал «Функции» (15, 16, 25.1–25.3), модуль T11 — «Файлы и инструменты» (17–21, 20.5 с 23.1–23.2, 22.4–22.5 с 23.4–23.5).
- 30 уроков вместо 28 из черновика плана: глава 15 разделена на два урока (механика вызова и договорённость), исключения и модули — отдельные уроки. Итоговый модуль стоит перед дополнительным — основная траектория заканчивается практикой.
- `html_to_md.py` переносит код дословно; блоки вывода (`# 10` → ```` ```output ````) сделаны при переносе в уроки, а не конвертером: так исходник остаётся точной копией HTML.
- `verify_code.py`: в общий пролог попадают только блоки из одних определений и импортов, а программа с ожидаемой ошибкой — никогда; при повторном запуске предыдущих программ `SystemExit` игнорируется. Темы 23 и 25 проверены — без изменений.
- Исходный HTML-учебник добавлен в `.prettierignore`: он хранится дословно как исходник этапа 1.
- Итерация 2: трассировщик в отдельном `scripts/lesson_design/tracer.py` (не `trace.py` — имя заслоняло бы стандартный модуль); кадры — реальный запуск под `sys.settrace`, при длинной строке кода таблицы уходят под код. Урок «Модули» перенесён на место 17 (файлы 17–21 переименованы, `site.id`/`routeSlug` не менялись, `checks.py` перенумерован). Для Change 175: песочница `range_try` → компонент сайта `RangeSandbox`; запускаемый блок ```` ```python run ```` → компонент `CodeRunner` с данными шагов (`tracer.trace_steps`); SVG-трассировщик удалён; `console`-блок и вывод строками нужны в экспорте уроков курса.

---

## Commit Message

```
feat(change-174): Python course stand — pipeline, map, lessons, figures
```
