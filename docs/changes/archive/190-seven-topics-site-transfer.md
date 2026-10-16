# CHANGE 190 — Перенос семи тем на сайт

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `190` |
| Slug | `seven-topics-site-transfer` |
| Title | Перенос семи тем на сайт |
| Status | `archived` |
| Branch | `feature/190-seven-topics-site-transfer` |

---

## Goal

Темы 1, 2, 6, 12, 13, 15 и 22, одобренные на стенде в Change 189, переносятся на сайт по этапу 9
[пайплайна](../../runbooks/lesson-pipeline.md#этап-9-перенос-на-сайт), по образцу Change 184. Все семь —
в каталоге «в планах», старых уроков у них нет, поэтому задачи снимать не нужно. После переноса
все темы 1–27 опубликованы уроками пайплайна. Названия тем в каталоге, публикации и на стенде
приводятся к коротким названиям по плану варианта ФИПИ 2027. Уроки собираются экспортом со стенда
и руками не правятся (SPEC §1.4, §2.3). Выпуск в production — не здесь (SPEC §9 п. 2).

Решения, принятые при планировании (меняются на ревью архитектора):

- **Платформа готова.** Новые построители (`graph_match`, `logic_table`, `turtle`, `turing`,
  `executor`, `parameter`, `process`) дают только SVG и пошаговые схемы (`gm_match`, `tt_state`,
  `tm_trace`, `ex_fill`); новых песочниц нет. Доработки экспорта — только если тема их выявит.
- **Темы по одной, в одной сессии, без параллельных агентов**, по номерам: 1, 2, 6, 12, 13, 15, 22.
  Как в Change 189 — без промежуточных одобрений; ревью архитектора — на локальном сайте, когда
  перенесены все семь.
- **`id` каталога не меняются** (`information-models`, `truth-tables`, `simple-algorithms`,
  `executors`, `branching-and-enumeration`, `logic-transformations`, `parallel-computing`): на них
  ссылаются задачи банка и прогресс. Маршрут `NN-<название>` — по короткому названию ФИПИ.
- **Маршруты опубликованных тем не меняются**: у 18 тем меняется только название, адреса страниц
  остаются, редиректы не нужны.
- **Тема 6:** программы `turtle` без вывода — `CodeBlock` без `output`; тест урока такие программы
  не запускает, а сверяет рисунок исполнителя стенда (`turtle_figures`). Подсчёт по координатам —
  программы с выводом, как обычно.
- **Тема 22** — Excel-тема без Python, как 18: задачи банка берут `answer` из решателя стенда и
  `excel` — формулы решения; книги `22-N.xlsx` — вложения задач банка.

---

## Backlog

### Backend

- [x] `B1` `apps/api/tests/test_task_NN_bank.py` для 1, 2, 6, 12, 13, 15, 22: независимый пересчёт
  ответов задач банка другим способом; вложения 22 отдаются с верным MIME и контрольной суммой.
  Тесты API, завязанные на число опубликованных уроков, обновляются — _Depends on:_ D1

### Frontend

- [x] `F1` Публикация семи уроков: сгенерированные `*.lesson.tsx` и `*.media.ts`,
  `lesson-publication.mjs`, `lesson-registry.ts`, `subtopicCounts` каталога, записи каталога
  становятся опубликованными; `node scripts/practice-registry.mjs`; `PRODUCT.md` (состав уроков) —
  _Depends on:_ T3
- [x] `F2` Тесты сайта, завязанные на состав каталога и уроков (каталог тем, `public-release`,
  mastery, page objects e2e); тесты уроков `apps/web/tests/<id>-lesson.test.tsx` (код как на стенде,
  программы печатают свой вывод; `turtle` темы 6 — без запуска); затронутые e2e — один раз перед
  `/ship` — _Depends on:_ F1

- [x] `F3` E2E нашёл (T6): `expectInlineSolving` с Change 188 открывал первые задачи каталога — импорт КЕГЭ без подсказок, кнопки «Подсказка» нет. Проверка берёт первую тему, у двух ведущих задач которой подсказки есть; метка темы 16 в практике — «Рекуррентные выражения» без исключения «Рекурсия» (`practice-topic.ts`, тесты, page object) — _Depends on:_ T2
- [x] `F4` Ревью архитектора 2026-10-16: метка «скоро» в легенде карты заданий каталога тем больше не нужна — запланированных тем нет. Легенда показывает её, только пока в каталоге есть запланированная тема. Сделано: `topic-catalog-map.tsx`, тест каталога; Playwriter 1280/375 — легенда «базовый, повышенный, высокий» — _Depends on:_ F1

### Infra

None

### Data

- [x] `D1` `topic-NN/bank.py` каждой темы на общем `topic_bank.py`: условие — вопрос подтемы
  дословно, ответ печатает решающая программа (у 1 и 22 — `answer` решателя стенда, у 22 ещё
  `excel`) и сверяется с текстом подтемы; `theory_links`; `counts_toward_mastery: false` у
  дополнительных подтем; смешанные задачи итоговой страницы без `theory_links`; вложения
  `22-N.xlsx` (воспроизводимые `datasets.py`); самопроверка — `site.checkpoints`; `--write` по одной
  теме, Prettier, `pnpm validate:content`; локальный банк — `practice-local.py export`, затем
  `make practice-bootstrap` — _Depends on:_ T3

### Other

- [x] `T1` SPEC §9 п. 1 — семь тем: карты 187, стенд 189, перенос 190 — сделано в `/plan` —
  _Depends on:_ —
- [x] `T2` Короткие названия всех 27 тем по плану варианта ФИПИ 2027 (локальная копия
  `research_notes/Аудит материалов шести тем/sources/fipi2027.zip`): `exam-topics.mjs`,
  `lesson-publication.mjs`, `title` в `topic.json` стенда; повторный экспорт уроков 18 тем, чьё
  название изменилось; список «было → стало» — в Implementation Notes для ревью — _Depends on:_ —
- [x] `T3` Перенос по одной теме — 1, 2, 6, 12, 13, 15, 22: `topic.json` → `site` (`id`, `route`,
  якоря и `navLabel` шагов, `final`, `learningOutcomes`, `checkpoints`, `stepperLabels`),
  `export_media.py`, `export_lesson.py` и `--check`, Prettier, вычитка сгенерированного урока —
  _Depends on:_ T2
- [x] `T4` Проверка каждой темы: имена схем, терминов и медиа не пересекаются с другими темами;
  этап 7 и `--check` экспорта; регрессия уроков 18 опубликованных тем и курсов — байт в байт, кроме
  названий T2; проход темы глазами ученика против стенда; Playwriter на 1280 и 375 px — схемы,
  пошаговые схемы, листы, запуск кода, вложения скачиваются — _Depends on:_ T3
- [x] `T5` Документы: записи качества `docs/artifacts/lessons/NN-slug.quality.md` семи тем;
  этап 9 `lesson-pipeline.md` — уточнения переноса, если появятся; полная публикация стенда
  (навигация прежних страниц со всеми темами) — _Depends on:_ F1, D1
- [x] `T6` Гейт, затем ревью архитектора на локальном сайте; замечания — новыми пунктами —
  Сделано: ревью архитектора 2026-10-16 — одно замечание (F4, метка «скоро»), затем команда `/ship` — _Depends on:_ T4, T5, F2, B1
- [x] `T7` Условие задачи банка целиком, а не только первый абзац: у тем 1, 2, 6 условия с
  таблицей, схемой и кодом (у 1 — 45 из 49 задач). `topic_bank.statement`: абзац — текст,
  таблица Markdown — блок `table`, код — `code_example`, схема `%%builder(…)%%` в `<figure>` — блок
  `image` с PNG того же построителя (Chromium из Playwright, шрифт Onest, ×2; PNG хранится в
  `topic-NN/files/fig-<хеш SVG>.png` и перерисовывается только при смене SVG), книга
  `%%…_book%%` — пропуск (книга во вложении). Тест. Сделано: `topic_bank.statement`, `svg_png.mjs`, тест `scripts/tests/topic_bank_test.py`; вместе с этим самопроверка с таблицей, схемой или кодом собирается как шаг (`checkpoint_block`, схемы — в манифест урока), блок ```` ```algo ```` для программ исполнителя (тема 6), ответы итоговой страницы не перезаписываются списком «Что дальше», `--write` оставляет задачи темы на месте в банке — _Depends on:_ —

---

## Files

### Create / modify

~~~
content/lesson-design/topic-{1,2,6,12,13,15,22}/{topic.json,bank.py}
content/lesson-design/topic-*/topic.json — только title (T2)
content/lesson-design/index.html — названия тем (T2)
content/practice-bank/bank.json
apps/web/src/entities/lesson/content/{information-models,truth-tables,simple-algorithms,executors,branching-and-enumeration,logic-transformations,parallel-computing}.{lesson.tsx,media.ts}
apps/web/src/entities/lesson/content/{lesson-registry.ts,python-terms.tsx} и уроки 18 тем при смене названия
apps/web/src/shared/config/{exam-topics.mjs,lesson-publication.mjs}
apps/web/src/entities/topic-catalog/topic-catalog.ts
apps/web/tests/*-lesson.test.tsx, тесты каталога/публикации, apps/web/e2e/pages/**
apps/api/tests/test_task_{1,2,6,12,13,15,22}_bank.py
scripts/lesson_design/{export_lesson,export_media,topic_bank}.py — только если тема потребует
docs/artifacts/lessons/*.quality.md, docs/runbooks/lesson-pipeline.md, PRODUCT.md
~~~

### Do NOT touch

- Тексты подтем стенда, кроме исправлений, найденных при переносе (с записью в Backlog).
- Исходники архитектора `docs/artifacts/lessons/**`, банк задач каталога вне семи тем, production.
- Маршруты и `id` опубликованных уроков; архив изменений.

---

## Contracts

См. `docs/SPEC.md` §1.4, §2.3, §5, [lesson-pipeline.md](../../runbooks/lesson-pipeline.md) этап 9,
[lesson-authoring.md](../../runbooks/lesson-authoring.md) и Files выше.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

На каждую тему — этап 7 и `--check` экспорта (`export_media.py`, `export_lesson.py`), тест банка
темы, тест урока; затронутые e2e — один раз перед `/ship`, при остановленном dev-стенде Docker
(Change 184, T16). Переборы — под `ulimit -v 3000000; timeout 600`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 9f0d5ff + рабочее дерево | `gate.py affected` → format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media | PASS | 114 |
| 9f0d5ff + рабочее дерево | Банк: `bank.py` семи тем — ответы сходятся с текстом подтем (1: 30, 2: 30, 6: 45, 12: 43, 13: 54, 15: 45, 22: 47 задач); регрессия `topic_bank.build` по 16 перенесённым темам — байт в байт, кроме исправленной `task-5-1-06`; `pnpm validate:content` — 7769 задач, 25 уроков тем; `practice-registry.mjs --check`, `practice-catalog-topics.mjs --check` | PASS | — |
| 9f0d5ff + рабочее дерево | Экспорт: `export_media.py`/`export_lesson.py --check` — 25 уроков тем; 18 прежних байт в байт, кроме исправленных самопроверок 24 и 27; этап 7 тем 6 и 22 после правки стенда: `checks.py` 114/114 и 92/92, `verify_code` 8 программ, `verify_sheets` 56 формул — 0 проблем | PASS | — |
| 9f0d5ff + рабочее дерево | Тесты: API `-m pure` — 478 passed (новые `test_task_{1,2,6,12,13,15,22}_bank.py`, `test_topic_bank_files.py`); web Vitest — все файлы, включая семь тестов уроков и тесты каталога; `unittest` export_lesson_test + topic_bank_test — 21 OK | PASS | — |
| 9f0d5ff + рабочее дерево | Playwriter (Chrome Default, локальный сайт, банк из `make practice-bootstrap`): 57 страниц семи тем на 1280 и 375 px — без горизонтальной прокрутки, ошибок консоли и сырой разметки; каталог — 25 опубликованных тем с названиями ФИПИ; самопроверка с таблицей; задача банка со схемой PNG и таблицей; задача по книге 22-3.xlsx с формулами; пошаговая схема темы 12; ответы засчитываются (проверочный прогресс сброшен) | PASS | — |
| 9f0d5ff + рабочее дерево | E2E изолированно (`run-isolated-browser-audit.sh`): `full` — topic-catalog, topic-reading, topic-routing, practice-catalog, smoke; `account` — 1. Первый прогон: 6 падений `practice-catalog`/`topic-catalog` на холодной гидратации dev-сервера и 2 настоящих (метка темы 16, F3); после правки повтор в один поток — все проходят | PASS | — |
| 9f0d5ff + рабочее дерево (F3, F4) | `/ship`: перезапуск инвалидированных групп — format, web-lint, web-typecheck, docs-links; Vitest topic-catalog, practice-detail, exam-topics; E2E practice-catalog 10/10, account 1/1; Playwriter 1280/375 — легенда каталога; остальные строки приняты без изменений входов | PASS | — |

---

## Implementation Notes

- Короткие названия ФИПИ 2027 (T2), было → стало: 3 «Связанные таблицы» → «Реляционные базы данных»; 4 «Кодирование и условие Фано» → «Кодирование и декодирование информации»; 5 «Преобразование записей чисел» → «Формальное исполнение алгоритма»; 6 «Анализ простейших алгоритмов» → «Простейшие алгоритмы для исполнителей»; 7 «Объём информации: изображения, звук, текст» → «Объём графической и звуковой информации»; 8 «Перебор слов и системы счисления» → «Измерение количества информации»; 9 «Обработка таблицы чисел» → «Электронные таблицы»; 10 «IP-адреса и маски» → «Маска подсети»; 11 «Объём информации: пароли и записи» → «Информационный объём сообщения»; 12 «Машина Тьюринга» → «Исполнение алгоритма для исполнителя»; 13 «Подсчёт программ исполнителя» → «Анализ хода исполнения алгоритма»; 14 «Системы счисления: операции и неизвестные цифры» → «Позиционные системы счисления»; 15 «Преобразование логических выражений» → «Законы математической логики»; 16 «Рекурсивные алгоритмы» → «Рекуррентные выражения»; 17 «Числовые последовательности» → «Обработка числовой последовательности»; 18 «Робот-сборщик монет» → «Электронные таблицы: целочисленные данные»; 22 «Параллельные вычисления» → «Многопроцессорные системы»; 24 «Обработка символьных строк» → «Обработка символьной информации»; 25 «Делители и маски» → «Обработка целочисленной информации»; 26 «Обработка данных: сортировка и отбор» → «Обработка данных с сортировкой»; 27 «Анализ данных: кластеризация» → «Анализ данных»; 1, 2, 19–21, 23 без изменений. Маршруты и `id` прежние; метка темы практики «16 номер. Рекурсия» больше не исключение. Названия задач КЕГЭ, импортированных в Change 188 («Машина Тьюринга — КЕГЭ …»), — данные банка, не менялись.
- При переносе найдены и исправлены ошибки опубликованных тем: в самопроверке тем 24 и 27 код показывался сырой строкой ``` ``python… ``` ``` — теперь `CodeBlock`; у задачи банка `task-5-1-06` «Что выведет программа?» не было программы — теперь условие с кодом.
- Стенд: блок кода внутри пункта списка задач Python-Markdown показывает строчным кодом и сбивает нумерацию (было и до Change 190, например задача 5 подтемы 5 темы 2). Сайт не затронут: задачи идут в банк и самопроверку, где код — блок.

---

## Commit Message

```
feat(change-190): seven topics on site — lessons, bank, FIPI names
```
