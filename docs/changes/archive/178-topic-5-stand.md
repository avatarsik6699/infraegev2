# CHANGE 178 — Тема 5 «Преобразование записи числа» по пайплайну: демо-стенд

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `178` |
| Slug | `topic-5-stand` |
| Title | Тема 5 «Преобразование записи числа» по пайплайну: демо-стенд |
| Status | `archived` |
| Branch | `feature/178-topic-5-stand` |

---

## Goal

Перестроить тему 5 ЕГЭ по обязательному пайплайну ([lesson-pipeline.md](../../runbooks/lesson-pipeline.md),
[lesson-patterns.md](../../runbooks/lesson-patterns.md)) на демо-стенде — этапы 1–8 (SPEC §9, пункт 1).
Исходник архитектора — `docs/artifacts/lessons/5.md` (≈2780 строк: число и запись, позиционные
системы, дописывание и замена цифр, чётность и сумма цифр, повторные шаги, инверсия, Python-средства,
поиск входа и границы перебора, обратный ход). Подборки «Решу ЕГЭ»: theme 362 «Посимвольное
двоичное преобразование» (54 задачи) и theme 427 «Посимвольное преобразование в n-ричной системе»
(15 задач). Код сайта не меняется: старый урок `preobrazovanie-zapisey-chisel` остаётся как есть,
перенос — отдельный Change после одобрения стенда.

Опоры: курсы Python и Excel уже на сайте — основы Python (`int(s, 2)`, `bin`, срезы, `replace`,
функции, `for`/`break`) в теме не объясняются заново, а помечаются терминами `{{key|…}}` со
ссылкой на урок курса; объяснения исходника, которые дублируют курс, сворачиваются в подсказку
термина или остаются там, где на них держится приём задания (решение и место — в `map.md`).

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
- [x] `T1` Этап 1: исходник переименовать по шаблону `NN_slug.md` (`git mv` → `docs/artifacts/lessons/5_number_records.md`), текст без правок; ссылка в `topic.json`; архитектор уже подтвердил исходник (сообщение 2026-10-11) — _Depends on:_ —
- [x] `T2` Этап 2: `sdamgia.py fetch <scratch> 362 427`; каждое условие прочитать целиком; `topic-5/tasks.py` — 69 задач с метками источника, своими описаниями типа и кодами приёмов (дописывание справа/слева, остаток и хвост, замена, сумма цифр и чётность, ветви по условию, инверсия, n-ричная запись, повторные шаги, поиск минимума N / минимума R, обратный ход, границы перебора), `YEAR_BOUNDS`, `TREND`, `CORE_RULE`, `ADVANCED_RULE`; сверка с методическими рекомендациями и демоверсией ФИПИ; `frequency_report.py` → `frequency.md` — _Depends on:_ T1
- [x] `T3` Этап 3: `topic-5/map.md` (4–6 основных подтем + 0–2 дополнительных + «Практика и итог»; таблица «подтема → строки исходника → что добавлено»; куда ушли упражнения исходника (строки 2725–2780); что из Python-раздела (строки 914–1625) стало терминами курса, а что осталось в теме и почему; границы и исключения уровня с числами из `frequency.md`; найденные ошибки исходника) и `topic-5/topic.json` (страницы `5-1.html` …, карта, частоты, ревью); недостающие термины — в `terms.py` с уроками курса Python — _Depends on:_ T2
- [x] `T4` Этап 4: тексты основных подтем по шаблону 4.2 — перенос `split_source.py` дословно, LaTeX → Unicode, вступление без ярлыков, сквозной пример на подтему, компактная подача (без врезок, вывод под кодом, `:::pick` вместо перечислений), строки кода ≤ 64 — _Depends on:_ T3
- [x] `T5` Этап 4: дополнительные подтемы (с пометкой «Дополнительный урок — для продвинутых…») и итоговая страница «Практика и итог» (порядок рассуждений, проверочные случаи и таблица ошибок из строк 2660–2723, 5 смешанных задач, `cheatsheet.json` темы) — _Depends on:_ T4
- [x] `T6` Этап 5 (П18, П21, с мерой): тяжёлые места — дописывание как «×основание + цифра» и сдвиг разрядов, длина записи и диапазон, хвост и остаток от деления на qᵏ, замена фрагмента, инверсия через 11…1, одновременная замена символов, обоснование остановки перебора и границы, обратный ход; существующие построители (`place_value`, `slice`, `digits_stepper` …) или новые в `figures.py` (каждое число считает код), пошаговые схемы без автозапуска, доказательства свёрнуты; `topic-5/review.md` с местами без схемы и причиной — _Depends on:_ T5
- [x] `T7` Этап 6: в каждой подтеме 6–10 оригинальных задач от простых к сложным, последние 1–2 в формате ЕГЭ по частым типам; ответы считает программа; `topic-5/checks.py` пересчитывает вторым способом (полный перебор) и проверяет, что строки ответов дословно есть в тексте — _Depends on:_ T5
- [x] `T8` Этап 7: `verify_code.py`, `checks.py`, `frequency_report.py`, `build.py` для `topic-5`; регрессия сборки тем 23/25 и курсов; Critical Gate по `gate.py affected`; Playwriter — все страницы темы на 1280 и 375 px без горизонтальной прокрутки и ошибок консоли, все пошаговые схемы и песочницы, доказательства раскрываются, скриншоты новых схем просмотрены — _Depends on:_ T6, T7
- [x] `T9` Этап 8: тема 5 в `content/lesson-design/index.html` (уровни, доля покрытия, ссылки); публикация в тот же артефакт стенда https://claude.ai/artifact/XiysKjUymWBdzjXQjdz8uk; ревью архитектора — замечания новыми ID сюда, общие правила — в `lesson-patterns.md` — _Depends on:_ T8 — **2026-10-11:** раздел темы в обзоре и публикация (версия 33) сделаны; ревью архитектора — T10, T11; архитектор принял стенд и предложил закрыть change

Ревью архитектора (2026-10-11):
- [x] `T10` Запускаемый блок кода (```` ```python run ````, П20) в темах: сборка темы оформляет его шапкой с именем файла и кнопкой «Запуск», вывод — внутрь блока; в теме 5 запускаемыми стали примеры, где важен порядок выполнения (перевод `to_base`, выбор ветви, сборка инверсии, пересчёт суммы, обновление лучшего результата, шаги к крайнему входу); на сайте — `CodeRunner` при переносе (этап 9) — _Depends on:_ T9
- [x] `T11` Повторный проход уроков 1–7 глазами ученика: последовательность без скачков, нет ли переусложнения (тяжёлые ручные разборы — свернуть, если на них не держится понимание), форматирование формул и текста, достаточно ли схем и анимаций (П18, П21, с мерой); `review.md` и `map.md` дополнены — _Depends on:_ T10

---

## Files

### Create / modify
~~~
docs/SPEC.md                                   (§9 — сделано в /plan)
docs/artifacts/lessons/5.md → 5_number_records.md   (переименование, без правок текста)
content/lesson-design/topic-5/                 (topic.json, tasks.py, frequency.md, map.md,
                                                01-…md … NN-praktika-i-itog.md, review.md,
                                                checks.py, cheatsheet.json)
content/lesson-design/index.html
scripts/lesson_design/figures.py               (регистрация построителей темы)
scripts/lesson_design/record_figures.py        (построители схем темы 5)
scripts/lesson_design/export_media.py          (--check пропускает тему без site)
scripts/lesson_design/build.py, verify_code.py (запускаемый блок в темах, T10)
content/lesson-design/course-python/constructs.py  (путь переименованного исходника)
scripts/lesson_design/terms.py                 (только новые термины тем)
scripts/lesson_design/build.py, verify_code.py (только если тема с однозначным номером требует)
docs/runbooks/lesson-pipeline.md, lesson-patterns.md   (только решения архитектора из ревью)
~~~

### Do NOT touch
- `apps/web/**`, `apps/api/**`, `content/practice-bank/**` — перенос на сайт отдельным Change
- `topic-5/bank.py`, `export_media.py`, `export_lesson.py` — этап 9
- `content/lesson-design/topic-23/`, `topic-25/`, `course-python/`, `course-excel/` — только регрессионная сборка

---

## Contracts

See `docs/SPEC.md` §1.4, §2.3, `docs/runbooks/lesson-pipeline.md` and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

Проверки этапа 7 пайплайна по `content/lesson-design/topic-5` и регрессионная сборка тем 23/25 и
курсов Python и Excel.

### Gate evidence

<!-- Filled by /work from the gate.py summary; /ship compares the diff since this HEAD. -->

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| b121f8a + рабочее дерево | format, python-format, host-ruff, host-python, docs-links, lesson-media | PASS | ~16 |
| b121f8a + рабочее дерево | этап 7 темы 5: verify_code (19 программ), checks.py (70), frequency_report, build; регрессия topic-23/25 (verify_code, checks), export_course --check (Python, Excel), gate_test, export_course_test | PASS | ~10 |
| b121f8a + рабочее дерево (T10–T11) | format, python-format, host-ruff, host-python, docs-links, lesson-media; verify_code темы 5/23/25 и курса Python; checks.py; сборка тем 23/25 и курсов байт в байт прежняя; Playwriter: 8 запускаемых блоков до последнего шага на 1280 и 375 px, вывод совпадает, без ошибок консоли и прокрутки; публикация v34 | PASS | — |
| b121f8a + рабочее дерево | Playwriter: 5-1…5-7, карта, частоты, ревью, обзор — 1280 и 375 px без горизонтальной прокрутки и ошибок консоли; пошаговая схема перевода — все 6 кадров; переключатели и подсказки терминов; 12 схем просмотрены | PASS | — |

---

## Implementation Notes

- Построители темы 5 вынесены в `scripts/lesson_design/record_figures.py` и регистрируются в `figures.FIGURES`, как построители курса Excel: `figures.py` и так больше 3600 строк.
- Гейт `lesson-media` перебирает все `topic-*`; тема только на стенде не имеет `site`, поэтому `export_media.py --check` её пропускает (обычный экспорт без `site` по-прежнему падает).
- Новые термины `intdiv`, `base`, `strmeth` в `terms.py` попадут в `apps/web/.../python-terms.tsx` при переносе темы на сайт (этап 9); до этого регистр сайта их не содержит.
- Запускаемый блок в темах (T10): сборка темы даёт ему шапку с именем файла и «Запуск», вывод переносится внутрь блока; функции такого блока доступны программам ниже (`verify_code.py`). Экспорт запускаемых блоков темы на сайт (`CodeRunner`) — при переносе.
- Схемы шире 520 px на 375 px прокручиваются внутри своей рамки — общее правило стенда (`textbook.css`), страница не прокручивается.

---

## Commit Message

```
feat(change-178): topic 5 stand — frequency, subtopics, figures
```
