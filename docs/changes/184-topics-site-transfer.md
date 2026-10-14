# CHANGE 184 — Перенос тем ЕГЭ со стенда на сайт

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `184` |
| Slug | `topics-site-transfer` |
| Title | Перенос тем ЕГЭ со стенда на сайт |
| Status | `active` |
| Branch | `feature/184-topics-site-transfer` |

---

## Goal

Все темы ЕГЭ, одобренные на демо-стенде в Changes 178–183, переносятся на сайт по этапу 9
[пайплайна](../runbooks/lesson-pipeline.md#этап-9-перенос-на-сайт). Это 16 уроков: темы 3, 4, 5,
7, 8, 9, 10, 11, 14, 16, 17, 18, 19–21 (один урок), 24, 26 и 27.

- Уроки тем 5, 16, 17, 24, 26 и 27 заменяют устаревшие уроки сайта. Замена идёт без редиректов, как тема 25 в Change 171.
- Остальные 10 тем были в каталоге «в планах» и теперь публикуются.

Уроки собираются экспортом со стенда и руками не правятся (SPEC §1.4, §2.3). Выпуск в production —
не здесь (SPEC §9 п. 2).

Решения, принятые при планировании (меняются на ревью архитектора):

- **Сначала платформа.** Блоки, которых нет у экспорта урока темы, оркестратор добавляет до раздачи тем. На них проверяется пилотная тема 9: в ней есть Python, Excel, запуск кода и файл данных.
- **Без параллельных агентов** (решение архитектора 2026-10-12). Темы переносятся по одной, в одной сессии, обычным циклом `/work`. После каждой темы — проверка против стенда и показ архитектору; замечания правятся сразу, до следующей темы.
- **Порядок тем** — сначала заменяемые уроки, затем новые:
  1. 16, 17, 5, 24, 26, 27;
  2. 18, 19–21, 3, 4, 7, 8, 10, 11, 14.
- **Задачи старых уроков в банке.** Их снимают так же, как задачи `integer-processing` в Change 171. Задачи нового урока — оригинальные задачи стенда.
- **Файлы данных и книги** (`3-N.xlsx`, `9.txt`, `17.txt` и другие) становятся вложениями задач банка (`files/<sha256>`). Книги собираются воспроизводимо: при одинаковых данных получаются одинаковые байты.

---

## Backlog

### Backend

- [x] `B1` `apps/api/tests/test_task_NN_bank.py` на каждую перенесённую тему: независимый пересчёт ответов задач банка другим способом, вложения отдаются с верным MIME и контрольной суммой. Тесты 17, 24, 26, 27 переписываются под новые задачи. Тесты API, завязанные на число опубликованных уроков, обновляются — _Depends on:_ D2

### Frontend

- [x] `F1` `SheetBlock`, нужное темам 3, 9 и 18:
  - стены (`wall`/`frame`/`walls` из `sheetblock.py`) в SSR и с JS, в токенах DESIGN.md;
  - ~~книга из файла~~ не нужна: `db_book` / `grid_book` стоят только в блоках задач, а на сайте книга — вложение задачи банка (Implementation Notes);
  - тесты SSR и взаимодействия — _Depends on:_ —
- [x] `F2` Термины Excel в тексте тем (`{{xl-…|…}}`): всплывающая подсказка как у `PythonTerm` и ссылка на урок курса Excel из `terms.EXCEL_TERMS`. Реестр генерируется экспортом; тест — _Depends on:_ T3
- [x] `F3` Публикация 16 уроков:
  - сгенерированные `*.lesson.tsx` и `*.media.ts`;
  - `lesson-publication.mjs` и `lesson-registry.ts`;
  - записи каталога тем становятся опубликованными;
  - старые уроки 5, 16, 17, 24, 26, 27 и их медиа удаляются, ссылки на них в курсах ведут на новые подтемы;
  - `node scripts/practice-registry.mjs`, `PRODUCT.md` (состав уроков) — _Depends on:_ T5, T6, T7, T8
- [x] `F4` Тесты сайта, завязанные на состав каталога и уроков (каталог тем, `public-release`, mastery, page objects e2e) — _Depends on:_ F3

- [x] `F5` E2E: page objects и сценарии, которые брали старые уроки (рекурсия — пилот стиля, врезки, старые разделы и задачи `rekursiya-*`; затем 5, 17, 24, 26, 27), перевести на перенесённые уроки одним проходом, когда все заменяемые уроки перенесены; затронутые сценарии — один раз перед `/ship` — _Depends on:_ T5

Замечания ревью архитектора 2026-10-14 (T11):

- [x] `F6` Шапка темы на первой подтеме (все темы): заголовок темы, описание и метаданные похожи на заголовок подтемы, а заголовок и вводка первой подтемы оформлены иначе, чем на остальных подтемах. Шапка темы — отдельная секция с разделителем; заголовок подтемы на первой странице выглядит как на остальных. Сделано: шапка темы (`LessonIntro`) — «Задание N» подписью над заголовком, заголовок, вводка, «N подтем · M задач», сетка шапки страницы фоном и линия снизу; у первой подтемы заголовок и вводка как на остальных (Playwriter 1280/390) — _Depends on:_ —
- [x] `F7` Плашка цитаты (`blockquote` урока: условие, вопрос, правило) читается как непонятное выделение — более сильное решение, понятное ученику, во всех темах. Сделано: цитата — отступ, линия цвета текста 3 px слева, полужирный 500, без подложки и рамки (DESIGN: «Quoted formulation»); цитата с неверным рассуждением в подтеме 1 темы 3 заменена схемой `db_lookup` — _Depends on:_ —
- [x] `F8` `SheetBlock`: высота не скачет при переключении листов — общая высота по самому высокому листу, но не больше предела; дальше прокрутка внутри таблицы. Сделано: листы блока лежат в одной ячейке сетки — высота по самому высокому листу, не больше min(34rem, 75vh), дальше прокрутка внутри; буквы столбцов и номера строк закреплены (Playwriter: высота 1187 px на всех трёх листах) — _Depends on:_ —
- [x] `F9` `SheetBlock`: длинные формулы нечитаемы в строке «fx» и в перечне «Формулы:» под таблицей (тема 3, «Столбец знака») — читаемое представление. Сделано: `formula-layout.ts` — длинная формула переносится между аргументами вызова, пары «диапазон; условие» у `…ЕСЛИМН` на одной строке, длинная строка — ещё раз на уровень глубже; строка «fx» держит высоту самой длинной формулы блока; под сеткой — список «ячейка, скопирована до … / формула», строка выделяет свою ячейку; тот же перенос у `FormulaBlock`. На телефоне формула под адресом во всю ширину — _Depends on:_ —
- [x] `F10` `SheetBlock`: полноэкранный режим — кнопка-иконка в правом верхнем углу таблицы. Сделано: кнопка-иконка в конце строки формул; Fullscreen API (`shared/lib/fullscreen`), без него блок накрывает окно; Esc и кнопка возвращают на страницу — _Depends on:_ —

Замечания ревью архитектора 2026-10-14, второй круг (T11):

- [x] `F11` Таблица или схема уже колонки текста стоит по центру, а не у левого края (все темы и курсы). Сделано: `LessonTable` и `InlineSvg` (не шире своего размера) стоят по центру колонки; широкие начинаются слева и прокручиваются — _Depends on:_ —
- [x] `F12` Список формул под таблицей Excel непонятен: читается как «пресеты»; неясно, почему он только у одного листа. Подпись говорит, что это формулы в ячейках и что строка выделяет ячейку; листы без формул названы. Сделано: подпись «Формулы в ячейках листа «…»», под ней «Нажми на формулу — её ячейка выделится в таблице» и «На листах «…» формул нет — только данные» — _Depends on:_ F9
- [x] `F13` Длинная формула с `ЕСЛИ` («Отбор записей») раздувает строку «fx» и строки списка, а резерв высоты достаётся и коротким формулам. Формула — одной строкой с переносом между аргументами; разбор по аргументам — по кнопке в строке формул; без резерва высоты. Сделано: формула — одна строка с переносом только после «;» (`formula-text.tsx`) в строке «fx», в списке и в `FormulaBlock`; резерв строки «fx» — до трёх строк по длине самой длинной формулы; кнопка-стрелка «Формула по аргументам» раскрывает разбор `formula-layout.ts` — _Depends on:_ F9
- [x] `F14` Раскрывающиеся блоки («Другой способ отбора…», «Почему…», «Доказательство…»): назначение блока не видно по его форме. Над заголовком — тип: обоснование, другой способ, общая формула, подробный разбор. Сделано: над заголовком `ProofDisclosure` — «Обоснование · необязательно», «Другой способ · …», «Общий случай · …», «Формула · …», «Подробный разбор · …», «Справка · …»; если заголовок уже называет назначение — «Необязательно» (`disclosureLabel`, тест); правило заголовков — в `lesson-authoring.md` — _Depends on:_ —

### Infra

None

### Data

- [x] `D1` Воспроизводимые файлы тем: `datasets.py` тем 3, 9, 17, 18, 26, 27 и других дают одинаковый `sha256` при двух прогонах. У книг `.xlsx` фиксированы даты свойств и записей zip. `--check` по-прежнему проходит — _Depends on:_ —
- [x] `D2` `topic-NN/bank.py` каждой темы по образцу тем 23/25:
  - условие — вопрос подтемы дословно; ответ печатает решающая программа и сверяется с текстом подтемы;
  - `theory_links`; `counts_toward_mastery: false` у дополнительного уровня; смешанные задачи итоговой страницы без `theory_links`;
  - вложения файлов;
  - снятие задач старых уроков;
  - `--write` по одной теме, Prettier, `pnpm validate:content`;
  - локальный банк: `practice-local.py export`, затем `make practice-bootstrap` — _Depends on:_ D1, T5, T6, T7, T8

### Other

- [x] `T1` SPEC §2.3 (перенос тем с листами, книгами и запуском кода) и §9 п. 1 — сделано в `/plan` — _Depends on:_ —
- [x] `T2` Платформа экспорта урока темы (`export_lesson.py`, `export_media.py`) — оркестратор:
  - ```` ```sheet ```` → `SheetBlock`, ```` ```excel ```` → `FormulaBlock`; общий код с `export_course.py`;
  - ```` ```python run ```` → `CodeRunner` с шагами `tracer.py` в манифесте;
  - ```` ```NN.txt ```` и ссылки на файлы → `CodeBlock` с `fileName` и имя вложения;
  - `db_schema` и прочие схемы → `LessonDiagram` (`db_book`, `grid_book` — только в блоках задач, на сайт не идут);
  - `--check` для урока (урок генерируется целиком, повторный экспорт байт в байт);
  - экспорт 23/25 не меняется; тесты экспорта — _Depends on:_ F1
- [x] `T3` `terms.py` → реестр терминов сайта: термины Python всех тем и термины Excel (`EXCEL_TERMS`) со slug'ами опубликованных уроков курса Excel. Экспорт падает на термине без урока — _Depends on:_ T2
- [x] `T4` Пилот — тема 9: `topic.json` → `site`, экспорт урока и схем, `bank.py`, тест банка, запись качества, Playwriter против стенда на 1280 и 375 px, показ архитектору. По итогам — короткий порядок переноса темы в этапе 9 `lesson-pipeline.md` — _Depends on:_ T2, T3, F1, F2, D1
- [x] `T5` Заменяемые уроки по одной теме: 16, 17, 5, 24, 26, 27. Каждая тема — как пилот, с проверкой и показом архитектору до следующей. Перенесены 16, 17, 5, 24, 26 и 27 (у 17 и 24 по восемь задач прежнего урока `task-17-0N` и `task-24-0N`, у 26 и 27 по семь `task-26-0N` и `task-27-0N` архивированы; ключ схемы включает хеш именованных аргументов — две схемы одного файла темы 27 различаются только ими, у 25 и 26 сменилось по два ключа; у 24, 26 и 27 на итоговой странице больше трёх шагов до задач — `site.final.examFocus` перечисляет их все; с темой 26 `bank.json` перерос размер, до которого TypeScript выводит тип JSON-модуля, — импорт банка в `tests/practice-migration-fixture.ts` и `e2e/pages/minimal-application.page.ts` типизирован явно; `topic_bank.main` не удаляет архивируемые задачи с тем же префиксом) — _Depends on:_ T4
- [x] `T6` Новые темы по одной: 18, 19–21, 3, 4. Перенесены 18 (новая тема: id каталога, название со стенда; Excel-тема без Python — задача банка берёт `answer` из решателя стенда и показывает формулы Excel, `topic_bank` принимает `answer`/`excel` вместо `code`; `export_media` не собирает схемы блоков задач; `export_lesson` импортирует `KeyCombo`; тесты каталога считают опубликованные темы по `lessonPublications`); перенесена 19–21 (один урок `winning-strategy`, задача банка получает номер задания по вопросу — `exams` в `topic_bank`); перенесена 3 (Excel-тема, как 18; термин в вопросе самопроверки — простой текст: подсказка в кнопке аккордеона давала вложенную кнопку); перенесена 4 — T6 выполнен — _Depends on:_ T5
- [x] `T7` Новые темы по одной: 7, 8. Перенесена 7 (маршрут по второй части названия; дробный ответ принимается и с запятой — `alt` в `topic_bank`); перенесена 8 — T7 выполнен — _Depends on:_ T6
- [x] `T8` Новые темы по одной: 10, 11, 14 — _Depends on:_ T7
- [x] `T9` Проверка каждой темы перед показом:
  - имена схем, терминов и медиа не пересекаются с другими темами;
  - проход темы глазами ученика против стенда;
  - этап 7 и `--check` экспорта;
  - регрессия уроков 23, 25, курсов и уже перенесённых тем — байт в байт;
  - Playwriter на 1280 и 375 px: схемы, пошаговые схемы, песочницы, листы, запуск кода, вложения скачиваются — _Depends on:_ T4
- [x] `T10` Документы:
  - этап 9 `lesson-pipeline.md`: новые блоки и история переноса;
  - `FRONTEND.md`: стены и книга `SheetBlock`, термины Excel;
  - записи качества `docs/artifacts/lessons/NN-slug.quality.md`;
  - память о переносе тем — _Depends on:_ F3, D2
- [x] `T11` Гейт, затем ревью архитектора; замечания — новыми пунктами Сделано: три круга ревью архитектора (F6–F14, T18–T24; T25–T27, F15–F19), 2026-10-14 архитектор закрыл change командой на коммит и мердж — _Depends on:_ T9, T10, F4, B1
- [x] `T12` Тема 9: вступление подтемы 1 упоминало «Решу ЕГЭ» — по правилу Change 172 уроки сайта подборку не называют; на стенде «В открытых подборках задания 9 — 74 задачи». То же проверить у темы 17 при переносе — _Depends on:_ T4
- [x] `T13` Видео и растровые схемы старого урока рекурсии новым уроком не используются. Решение архитектора 2026-10-13 — удалить всё: медиа `public/lesson-media/rekursiya/`, движок `scripts/lesson_media` и его тест, `LessonVideo`/`LessonFigure` и их тесты, маршрут nginx `/lesson-media` и его тест, правило гейта для движка, правила роликов и растра в SPEC §2.3, FRONTEND, DESIGN, KNOWN_GOTCHAS, STACK, runbook-ах; `validate:content` теперь запрещает ссылки на `/lesson-media`. Тест расстановки схем допускает схему после списка (темы 16) — _Depends on:_ T5
- [x] `T14` Общий `scripts/lesson_design/topic_bank.py` для `topic-NN/bank.py`: банк темы, самопроверка (`--checkpoints`), архивирование задач заменённого урока (`remove`: `archived`, без урока и ссылок — как снятые уроки курса Python) и перенос ссылок задач каталога на новые разделы (`relink`); тема 9 переведена на него без изменений в банке — _Depends on:_ T4
- [x] `T15` E2E F5 нашёл: при корневом шрифте 200 % на ширине 390 строка управления `LessonStepper` (кнопки, шкала, счётчик) расширяла страницу до 448 px (уроки 5, 14, 16). Строка переносится: шкала со счётчиком уходит под кнопки, при обычном шрифте — одна строка (Playwriter 390/1280) — _Depends on:_ F5
- [x] `T16` Нагрузка E2E: все 18 уроков со схемами (~7 МБ исходников, 22 МБ в dev-режиме) грузятся на каждой странице через реестр. Ленивая загрузка (оглавления уроков и `import()` по теме) была сделана и снята: решение архитектора 2026-10-13 — оставить как было; E2E гонять при остановленном dev-стенде Docker — _Depends on:_ F5
- [x] `T17` Сценарии курсов в E2E (решение архитектора 2026-10-13 — чинить в этом change): shared-reading и smoke строили адрес урока курса как `/courses/python/…` — уроки Excel получали 404; адрес теперь по курсу, в плане модулей которого урок. Самопроверка в shared-reading проверяется там, где она есть (у уроков Python 3 и 4 её нет). `KeyCombo` при шрифте 200 % на 390 px растягивал страницу до 544 px (урок Excel «Ввод и файлы»): комбинация переносится целиком и разбивается между клавишами только если шире колонки (Playwriter 390/1280, 100/200 %) — _Depends on:_ F5
- [x] `T18` «Итого» дублируется во всех темах: заголовок шага «Итого» и следом утверждение «**Итого.**». Экспорт не повторяет утверждение, совпадающее с заголовком шага; повторный экспорт 18 тем. Сделано: `export_lesson.without_label`, тест; 128 повторов «Итого.» и один «Итого.» с продолжением (тема 25) убраны — _Depends on:_ —
- [x] `T19` Термин «книга» для файлов `.xlsx` в темах 3, 9, 18 и в описании вложений банка («База данных — книга Excel…») заменяется на «файл»: «В файле 3-2.xlsx три листа», «3-2.xlsx. База данных — Excel-файл, как на экзамене». Сделано: темы 3, 9, 18 — «файл», «учебная база» вместо «учебной книги»; шаг «Файл и листы», «Файлы .xlsx и .txt»; вложения банка «… — Excel-файл, как на экзамене»; `aria-label` вкладок листов «Листы файла»; банк пересобран — _Depends on:_ —
- [x] `T20` Тема 3, подтема 1 «Таблицы, записи и ключи»: широкие таблицы-примеры («Одна большая таблица», «Строка — объект», «Ключ записи», «Коды в операции») с узкими колонками и переносом по слогам нечитаемы — другое представление. Плюс проход по всей теме 3 глазами ученика: восприятие, понятность, перегруженность текста. Сделано: ячейки `LessonTable` переносятся только между словами (во всех темах), широкая таблица прокручивается внутри; в подтеме 1 темы 3 три иллюстративные таблицы-схемы `db_flat`, `db_terms`, `db_lookup` вместо широкой таблицы, таблицы магазинов с терминами и цитаты с неверным рассуждением; длинные абзацы подтем 3, 4, 6, 7 (550–700 знаков) разбиты на короткие абзацы и списки — _Depends on:_ —
- [x] `T21` «Столбец знака» темы 3: поверх строки текста под `K2` видна тёмная полоса — найти и убрать. Не ошибка: полоса — индикатор прогресса чтения вверху окна, попавший в снимок длинного элемента; на странице текст не перекрыт — _Depends on:_ —
- [x] `T22` Проверка T18 нашла: в `topic.json` темы 14 у подтемы 4 лишний якорь «График количества» — шаги «Наибольшее количество», «Цикл while» и «Итого» получали подписи соседей. Якорь убран, урок, реестр практики и банк пересобраны; у всех 18 тем число шагов совпадает с числом якорей — _Depends on:_ T18
- [x] `T23` Схема учебной базы (`db_schema`): «∞» мелкий и прижат к линии, таблицы тесно. Шире промежутки, «1» и «∞» крупно у концов связи (∞ — линией, как в схеме экзамена), подпись объясняет «один ко многим». Сделано: таблицы шире разнесены (172/70), «∞» нарисован линией у таблицы записей, «1» — у справочника, в легенде те же знаки — _Depends on:_ —
- [x] `T24` Блок кода — только для кода, вывода программы и строк файла. Экспорт падает на ```` ```text ````; тема 3: «И / ИЛИ» — схема `db_logic`, рабочие фразы итоговой страницы — цитаты; тема 17: план решения — список, пример последовательности — текст; тема 7: коды из трёх битов — текст. Правило — в `lesson-authoring.md`. Сделано: `export_lesson` падает на блоке без кода (`CODE_FENCES` или имя файла), тест; тема 3 — схема `db_logic` и две цитаты; тема 17 — список и текст; тема 7 — коды текстом; правило — в `lesson-authoring.md` и DESIGN — _Depends on:_ —
- [x] `T25` Ревью темы 3 (архитектор, 2026-10-14): ошибки на сайте. В «Проверьте себя» подтемы 2 виден сырой `%%db_book("3-1")%%`; в практике — старое «книга» (банк в dev-БД не перезагружен после T19); шпаргалка и формулы в тексте рвутся посреди адреса (`$C$1`/`7`, `-`/`F2`); карточка файла показывает MIME вместо типа. Сделано: директива убрана из `topic-3/topic.json`, `export_lesson.checkpoint_block` отказывает на `%%…%%` (тест `CheckpointTest`); `make practice-bootstrap`; `Notation` переносит формулу Excel (`=…;…`) только после «;», `breakable` держит минус со ссылкой; карточка файла — «Excel · 13,9 КБ» (`fileKind`, запятая в размере) — _Depends on:_ —
- [x] `T26` Варианты компонентов урока и правки контента темы 3 — артефакт для выбора архитектора (https://claude.ai/artifact/BmtnYjMwn1xMLYGqXrkppX). Выбор архитектора (2026-10-14): формула — C, «Итого» — C без рамки, «Проверьте себя» — A, остальное — по рекомендациям; внедрение — F15–F19, T27 — _Depends on:_ T25
- [x] `F15` Блок формулы Excel (вариант C): без рамки и «fx», строка между волосяными линиями, адрес шрифтом подписи, «⇒ значение» в конце строки (на телефоне — под формулой), копирование проявляется при наведении. Экспорт: ```` ```excel ```` `H2: =… ⇒ Северный` → `result`; тест. Результаты дописаны в формулы темы 3 — _Depends on:_ T26
- [x] `F16` «Итого» (вариант C без рамки): новый `LessonSummary` — сетка «ключ над пояснением» как блоки шпаргалки; экспорт шага «Итого» тем и курсов (`summary_block`): `**ключ** — …` / `` `формула` — … `` → пара, ключи только если они у всех пунктов, иначе одна колонка предложений; тесты. «Итого» темы 3 переписаны ключами; остальные темы пока предложениями — _Depends on:_ T26
- [x] `F17` «Проверьте себя» (вариант A): заголовок раздела, нумерованные вопросы, мягкая кнопка «Ответ»/«Скрыть ответ» на нативном `details`, ответ с подписью «Ответ»; вопрос — текст: термины и ссылка на файл задачи банка (`bank_files`, `DownloadLink`, темы 3 и 27). На странице подтемы и итоговой странице — перед «Практикой»; в курсе — заголовок третьего уровня внутри «Итога». E2E-помощник и юнит-тесты обновлены — _Depends on:_ T26
- [x] `F18` Переключатель вариантов: значение в панели на волосяной рамке под чипами с подписью выбранного чипа; тест — _Depends on:_ T26
- [x] `F19` Практика: без полосы вкладок при одной задаче; раздел итоговой страницы «На экзамене» → «Проверка решения» (во всех темах он о проверке решения) — _Depends on:_ T26
- [x] `T27` Контент темы 3 по ревью глазами ученика: подтема 3 — дата со временем свёрнута, проверка периода — блок формулы, к фильтру добавлена строка состояния, код 103 и копирование свёрнуты; подтема 4 — «Разные вопросы» после закупки без дубля списка и отступления о нулевой продаже, шаблон `СУММЕСЛИМН` до листа «Вклад», фраза о разных ID; подтема 5 — схема `db_stock`; подтема 6 — схема `db_groups` вместо таблицы, `ИНДЕКС/ПОИСКПОЗ` свёрнут, основной путь — сортировка, столбцы `R2` названы по листу «Вклад»; итоговая страница — шаги по трём этапам шпаргалки, ошибки по этапам, «Что дальше» — в итоге — _Depends on:_ T26

---


### Deferred

- `T28` «Итого» остальных 17 тем и обоих курсов в форме «ключ — пояснение» (сетка варианта C; сейчас одна колонка предложений). Перенесено в следующий change по решению архитектора закрыть 184 (2026-10-14).
## Files

### Create / modify

~~~
docs/SPEC.md (сделано в /plan), docs/FRONTEND.md, PRODUCT.md
docs/runbooks/lesson-pipeline.md
docs/artifacts/lessons/NN-slug.quality.md (по теме)
scripts/lesson_design/export_lesson.py, export_media.py, export_course.py (общий код листов), terms.py
content/lesson-design/topic-{3,4,5,7,8,9,10,11,14,16,17,18,19,24,26,27}/topic.json, bank.py, datasets.py
content/practice-bank/bank.json, content/practice-bank/files/<sha256>
apps/api/practice-registry.json, apps/api/tests/test_task_NN_bank.py
apps/web/src/entities/lesson/content/*.lesson.tsx, *.media.ts, lesson-registry.ts, python-terms.tsx
apps/web/src/shared/config/lesson-publication.mjs, entities/topic-catalog/**
apps/web/src/shared/components/learning-content/sheet-block/**, термины Excel
apps/web/tests/**, apps/web/e2e/**
~~~

### Do NOT touch

- Тексты уроков стенда `content/lesson-design/topic-NN/NN-*.md` — только при замечании ревью; правка темы — на стенде, затем повторный экспорт
- Уроки 23 и 25 и курсы Python/Excel на сайте: меняются только повторным экспортом и без изменений содержимого
- Темы каталога без стенда (1, 2, 6, 12, 13, 15, 22) — остаются «в планах»
- `content/tasks/` — исторические fixtures
- Production: push, deploy, импорт в production БД

---

## Contracts

See `docs/SPEC.md` §1.4, §2.3, §3–§5 and the Files list above. Do not hand-copy the schema,
endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source of truth;
this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

None

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| f327016 + рабочее дерево | format, python-format, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media | PASS | ~80 |
| f327016 + рабочее дерево | Целевые: `export_lesson_test`, `export_course_test`; `--check` экспорта урока и схем тем 9, 23, 25 и курсов (stale 0); `topic-9/bank.py` (43/43), `checks.py` (90); pytest `test_task_9/23/25_bank` (23); Vitest `spreadsheets-lesson`, `course-term`, `excel-course-blocks`, `graph-analysis-lesson`, `divisors-and-masks-lesson`, `topic-catalog`, `public-release` и тесты каталога; `pnpm validate:content`; Playwriter 1280/375 | PASS | — |
| f327016 + рабочее дерево (тема 16) | Все группы `gate.py affected`; `content-static` FAIL только на 20 медиа старого урока рекурсии (T13) | PASS кроме T13 | ~70 |
| f327016 + рабочее дерево (тема 16) | pytest `test_task_16_bank`, `test_minimal_bank`, `test_tasks_api`; Vitest весь `apps/web` (412: 2 FAIL — `lesson-media-placement`, T13); `topic-16/bank.py` 57/57; локальный банк: у урока 57 задач; Playwriter 1280/375 | PASS кроме T13 | — |
| f327016 + рабочее дерево (тема 16, T13) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; Vitest `apps/web` 397/397; `gate_test` | PASS | ~70 |
| f327016 + рабочее дерево (тема 17) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_17_bank`, `test_task_16_bank`, `test_task_9_bank`, `test_minimal_bank`; Vitest `apps/web` 396/396; `topic-17/checks.py` 84/84, `bank.py` 49/49; локальный банк: у урока 49 задач; Playwriter 1280/375 | PASS | ~70 |
| f327016 + рабочее дерево (тема 5) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_5_bank`, `test_task_16_bank`, `test_task_17_bank`, `test_minimal_bank`, `test_tasks_api`; Vitest `apps/web` 401/401; `topic-5/checks.py` 70/70, `bank.py` 40/40; локальный банк: у урока 40 задач; Playwriter 1280/375 | PASS | ~70 |
| f327016 + рабочее дерево (тема 24) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_24_bank`, `test_task_5_bank`, `test_task_16_bank`, `test_task_17_bank`, `test_minimal_bank`, `test_tasks_api`; Vitest `apps/web` 402/402; `topic-24/checks.py` 139/139, `bank.py` 66/66; локальный банк: у урока 66 задач; Playwriter 1280/375 | PASS | ~80 |
| f327016 + рабочее дерево (тема 26) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_26_bank`, `test_task_24_bank`, `test_minimal_bank`, `test_tasks_api`; Vitest `apps/web` 404/404; `topic-26/checks.py` 84/84, `bank.py` 67/67; локальный банк: у урока 67 задач; Playwriter 1280/375 | PASS | ~80 |
| f327016 + рабочее дерево (тема 27) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_27_bank`, `test_minimal_bank`, `test_tasks_api`; Vitest `apps/web` 406/406; `topic-27/checks.py` 69/69, `bank.py` 34/34; `export_media.py --check` всех перенесённых тем; локальный банк: у урока 34 задачи; Playwriter 1280/375 | PASS | ~80 |
| f327016 + рабочее дерево (тема 18) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_18_bank`, `test_task_9_bank`, `test_minimal_bank`; Vitest `apps/web` 411/411; `topic-18/checks.py` 92/92, `bank.py` 41/41; `export_lesson.py --check` и `export_media.py --check` всех перенесённых тем; локальный банк: у урока 41 задача; Playwriter 1280/375 | PASS | ~90 |
| f327016 + рабочее дерево (тема 19–21) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_19_bank`, `test_minimal_bank`; Vitest `apps/web` 417/417; `topic-19/checks.py` 74/74, `bank.py` 31/31; локальный банк: у урока 31 задача; Playwriter 1280/375 | PASS | ~60 |
| f327016 + рабочее дерево (тема 3) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_3_bank`, `test_minimal_bank`; Vitest `apps/web` 422/422; `topic-3/checks.py` 137/137, `bank.py` 35/35; `export_lesson.py --check` всех перенесённых тем; локальный банк: у урока 35 задач; Playwriter 1280/375 | PASS | ~70 |
| f327016 + рабочее дерево (тема 4) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_4_bank`, `test_minimal_bank`; Vitest `apps/web` 428/428; `topic-4/checks.py` 98/98, `bank.py` 50/50; локальный банк: у урока 50 задач; Playwriter 1280/375 | PASS | ~60 |
| f327016 + рабочее дерево (тема 7) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_7_bank`, `test_minimal_bank`; Vitest `apps/web` 434/434; `topic-7/checks.py` 85/85, `bank.py` 65/65; локальный банк: у урока 65 задач; Playwriter 1280/375 | PASS | ~50 |
| f327016 + рабочее дерево (тема 8) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_8_bank`, `test_minimal_bank`; Vitest `apps/web` 440/440; `topic-8/checks.py` 98/98, `bank.py` 63/63; локальный банк: у урока 63 задачи; Playwriter 1280/375 | PASS | ~50 |
| f327016 + рабочее дерево (тема 10) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_10_bank`, `test_minimal_bank`; Vitest `apps/web` 446/446; `topic-10/checks.py` 94/94, `bank.py` 61/61; локальный банк: у урока 61 задача; Playwriter 1280/375 | PASS | ~50 |
| f327016 + рабочее дерево (тема 11) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_11_bank`, `test_minimal_bank`; Vitest `apps/web` 452/452; `topic-11/checks.py` 82/82, `bank.py` 54/54; локальный банк: у урока 54 задачи; Playwriter 1280/375 | PASS | ~45 |
| f327016 + рабочее дерево (тема 14) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_task_14_bank`, `test_minimal_bank`; Vitest `apps/web` 458/458; `topic-14/checks.py` 106/106, `bank.py` 50/50; локальный банк: у урока 50 задач; Playwriter 1280/375 | PASS | ~45 |
| f327016 + рабочее дерево (F4, F5 в работе, B1, T15) | format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config; pytest `test_topic_bank_files`; `export_media`/`export_lesson --check` всех 18 тем; E2E затронутых сценариев остановлены по памяти, не пройдены | PASS (без E2E) | ~5 |
| f327016 + рабочее дерево (F5, T15, T16 снят) | Vitest 458/458; E2E через `run-isolated-browser-audit.sh` (dev-стенд web остановлен на время прогона): уроки 17, 24, 26, 27, чтение и маршруты темы, cutover практики, каталог, smoke, accessibility, shared-reading уроков тем — 77 + повтор 61 после правок ожиданий, 0 падений по темам. Вне Change 184: shared-reading курса Excel строит адрес `/courses/python/…` (404, 30 тестов) | PASS (темы) | ~10 |
| f327016 + рабочее дерево (T17) | 13 групп гейта; Vitest 458/458; E2E курсов: shared-reading уроков Python и Excel, smoke, cutover практики — 122 + повтор 6 после правок, 0 падений | PASS | ~10 |
| f327016 + рабочее дерево (F6–F10, T18–T22) | 13 групп гейта; Vitest 465/465; pytest банков 3, 9, 14, 18, `test_topic_bank_files`, `test_minimal_bank` 37/37; `export_lesson_test`; `export_lesson`/`export_media --check` 18 тем; `topic-3/checks.py` 137/137; Playwriter 1280/390 (шапка темы, цитата, листы, полный экран, схемы); E2E через `run-isolated-browser-audit.sh` (dev-стенд web остановлен): чтение и маршруты темы, accessibility, layout-stability, урок 17 — 25/25; `impeccable` audit: детектор — сетка шапки (правило DESIGN «Engineering Grid») и линия цитаты (`side-tab`, решение архитектора при ревью) | PASS | ~10 |
| f327016 + рабочее дерево (F11–F14, T23–T24) | 13 групп гейта; Vitest 468/468; `export_lesson_test`; `export_lesson`/`export_media --check` 18 тем, `export_course --check` обоих курсов; банки 3, 7, 17 (dry run); `topic-3/checks.py` 137/137; Playwriter 1280/390; E2E через `run-isolated-browser-audit.sh` (dev-стенд web остановлен): чтение и маршруты темы, accessibility, layout-stability, уроки 17 и 25 — 28/28 | PASS | ~10 |
| f327016 + рабочее дерево (T25–T27, F15–F19) | 13 групп гейта (`gate.py affected`); Vitest 472/472; `export_lesson_test` 13/13; `export_lesson`/`export_media --check` 18 тем, `export_course --check` обоих курсов — 0 устаревших; банк темы 3 пересобран (35 задач, порядок якорей подтемы 4), `make practice-bootstrap`; pytest `test_topic_bank_files`, `test_minimal_bank` 23/23; `topic-3/checks.py` 137/137; Playwriter 1280/390 (scrollWidth 384); E2E через `run-isolated-browser-audit.sh`: чтение и маршруты темы, accessibility, layout-stability, уроки 17 и 25 — 26/28, два падения — новый ассерт размера шрифта в помощнике «Проверьте себя» (проверял обёртку, а не текст ответа); исправлен, `topic-reading` повторно 10/10 | PASS | ~12 |

---

## Implementation Notes

- F1: превью «Книга из файла» на сайт не переносится. `db_book` и `grid_book` стоят только в блоках задач, а задачи становятся задачами банка, где книга — вложение, как на экзамене. Стены (`walls`) уже были в данных `site_data`; сайту понадобились только тип и отрисовка.
- D1: файлы тем 3, 9, 17, 18, 24, 26 и 27 уже воспроизводимы: два прогона `datasets.py` дают одинаковые `sha256`.
- T2: `Converter` экспорта урока и курса — общий (`prepare`: листы, формулы, запуск); тема сохраняет свои блоки кода с выводом, курс — вывод строками терминала. Уроки 23, 25 и оба курса после рефакторинга экспортируются байт в байт.
- Тема 16: прежний урок `rekursiya` заменён с тем же id и маршрутом. 14 его задач архивированы, а не удалены: импорт обновляет только задачи банка, и задачи снятого урока иначе остались бы в уроке со своими позициями (проверено на локальной базе). 255 задач каталога ссылались на разделы прежнего урока — ссылки переведены (`RELINK` в `topic-16/bank.py`). Подписи схем тем 16 и 18 без `aria-label` берут альтернативный текст из `figcaption` (`export_media.captions`).
- T4: задачи темы делятся так: в банк — с ответом из чисел, в самопроверку — формула, неравенство или «да / нет» с причиной, дословно со стенда; разбор задачи банка — ответ стенда. Задача на таблице прикрепляет `.xlsx` и `.txt`.
- F7: цитату не делим на «условие» и «правило» подписями: смысл задаёт вводная фраза перед ней («Учебное условие:», «Главное правило:»); оформление цитаты одно. Неверное рассуждение цитатой не даётся — его показывает схема.
- F10: Fullscreen API на iPhone для элементов недоступен, поэтому блок всегда получает `data-expanded` и накрывает окно сам; в браузере с API он ещё и уходит в полный экран.

---

## Commit Message

```
feat(change-184): topics to site — 18 pipeline lessons, unified lesson blocks

All 18 EGE topics export from their stands; sheet walls, xl terms, topic head,
formula display line with results, LessonSummary «Итого», numbered self-check
before practice, variant picker panel; topic 3 reviewed as a learner.
```
