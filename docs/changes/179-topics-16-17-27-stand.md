# CHANGE 179 — Волна 1: темы 16, 17, 27 по пайплайну на демо-стенде

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `179` |
| Slug | `topics-16-17-27-stand` |
| Title | Волна 1: темы 16, 17, 27 по пайплайну на демо-стенде |
| Status | `active` |
| Branch | `feature/179-topics-16-17-27-stand` |

---

## Goal

Перестроить на демо-стенде три темы ЕГЭ по обязательному пайплайну
([lesson-pipeline.md](../runbooks/lesson-pipeline.md), [lesson-patterns.md](../runbooks/lesson-patterns.md)),
этапы 1–8 (SPEC §9, пункт 1): № 16 «Рекурсия» (`docs/artifacts/lessons/16.md`), № 17 «Числовые
последовательности» (`17.md`), № 27 «Кластеризация» (`27.md`). Перенос темы 5 на сайт отложен
архитектором (2026-10-11): сначала стенд пополняется волнами тем.

Впервые темы делаются параллельно: агент на тему (Opus 5.5, effort high) выполняет этапы 2–7 в
своей папке `topic-N/`, оркестратор — общие файлы, гейт, браузер, проход глазами ученика и
публикацию. Порядок: фаза А (частоты и карта) → контрольная точка → фаза Б (тексты, задачи, схемы).
Правила оркестрации фиксируются в runbook, чтобы следующие волны (4, 7, 8, 9; 10, 11, 14, 19–21)
шли по нему.

Опоры: курсы Python и Excel на сайте — основы Python помечаются терминами со ссылкой на урок курса;
решения по теме 5 (запускаемые блоки, сначала пример — потом правило, сквозной пример, свёрнутые
ручные разборы) переносятся в задание агентам. Код сайта не меняется: старые уроки 16, 17, 27 на
сайте остаются как есть.

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
- [x] `T1` Этап 1 (оркестратор): архитектор переименовал исходники в `16.md`, `17.md`, `27.md` (а также `19_21.md`, `26.md`) без правок текста — закрепить переименование в git, обновить ссылки в `course-python/constructs.py`, `lesson-pipeline.md` (эталонные исходники, шаблон имени `NN.md`), `lesson-patterns.md`; исходники подтверждены архитектором (2026-10-11) — _Depends on:_ —
- [x] `T2` Оркестрация (оркестратор): `docs/runbooks/lesson-wave.md` — роли, владение файлами, фазы и контрольная точка, модель и effort, задание агенту (обязательные документы, уроки темы 5, запреты: git, браузер, общие файлы, `make clean`; формат отчёта; список нужных терминов в `topic-N/terms-needed.md`); ссылка из `lesson-pipeline.md`; пустые модули схем `recursion_figures.py`, `sequence_figures.py`, `cluster_figures.py`, подключённые в `figures.py` — _Depends on:_ T1
- [x] `T3` Фаза А, тема 16 (агент): этапы 2–3 — подборки «Решу ЕГЭ», `tasks.py`, `frequency.md`, `map.md`, `topic.json` — _Depends on:_ T2
- [x] `T4` Фаза А, тема 17 (агент): то же — _Depends on:_ T2
- [x] `T5` Фаза А, тема 27 (агент): то же; файлы данных задач — в `topic-27/files/` — _Depends on:_ T2
- [x] `T6` Контрольная точка (оркестратор → архитектор): проверка карт (уровни по частотам, границы, что ушло в термины курса), сводка уровней и подтем по трём темам архитектору; замечания — новыми ID — _Depends on:_ T3, T4, T5
Контрольная точка (2026-10-11), решения архитектора — по рекомендации оркестратора: 16 — архивные «Задания Д16» вне уровней, `@cache` и сумма предыдущих в основном уровне; 17 — треугольники и любые пары двумя дополнительными подтемами, среднее в основном уровне, Excel не добавлять; 27 — цепочки соседей и ускорения дополнительные, 39 задач старого задания 27 вне темы, таблицу ссылок на задачи подборки на итоговой странице убрать. Общие термины `none`, `augassign` добавил оркестратор.

- [x] `T7` Фаза Б, тема 16 (тот же агент): этапы 4–7 — подтемы, дополнительные подтемы, «Практика и итог», `cheatsheet.json`, схемы (П18, П21, с мерой), запускаемые блоки (П20), `review.md`, задачи и `checks.py`, `verify_code`, сборка страниц темы — _Depends on:_ T6
- [x] `T8` Фаза Б, тема 17 (тот же агент): то же — _Depends on:_ T6
- [x] `T9` Фаза Б, тема 27 (тот же агент): то же — _Depends on:_ T6
- [x] `T10` Сборка волны (оркестратор): термины из `terms-needed.md` в `terms.py`; темы в `index.html`; проход каждой темы глазами ученика с правками; регрессия сборки тем 5/23/25 и курсов; Critical Gate по `gate.py affected`; Playwriter — все страницы трёх тем на 1280 и 375 px, пошаговые схемы, запускаемые блоки, раскрытия — _Depends on:_ T7, T8, T9
- [x] `T11` Этап 8 (**2026-10-11:** опубликовано, версии 35 и 36 — после T12–T14; архитектор принял стенд, открытые вопросы агентов оставлены как сделано): публикация в тот же артефакт стенда https://claude.ai/artifact/XiysKjUymWBdzjXQjdz8uk; ревью архитектора — замечания новыми ID сюда, общие правила — в `lesson-patterns.md` / `lesson-wave.md` — _Depends on:_ T10


Ревью архитектора (2026-10-11): повторный проход всех уроков темы глазами ученика — понятность и последовательность, переусложнение, форматирование текста (выделения только имеющимися средствами: жирный, код, термины, списки, переключатели — маркерного выделения не вводить, решение архитектора), достаточно ли схем и анимаций (П18, П21, с мерой); тот же агент темы:
- [x] `T12` Тема 16 — _Depends on:_ T10
- [x] `T13` Тема 17 — _Depends on:_ T10
- [x] `T14` Тема 27 — _Depends on:_ T10

---

## Files

### Create / modify
~~~
docs/SPEC.md                                    (§9 — сделано в /plan)
docs/artifacts/lessons/16.md, 17.md, 27.md, 19_21.md, 26.md   (переименование архитектора, T1)
docs/runbooks/lesson-wave.md                    (новый, T2)
docs/runbooks/lesson-pipeline.md, lesson-patterns.md   (ссылки на исходники, ссылка на волну; решения ревью)
content/lesson-design/course-python/constructs.py      (пути исходников)
content/lesson-design/topic-16/, topic-17/, topic-27/  (агенты: topic.json, tasks.py, frequency.md,
                                                 map.md, NN-*.md, review.md, checks.py,
                                                 cheatsheet.json, terms-needed.md, files/)
scripts/lesson_design/recursion_figures.py, sequence_figures.py, cluster_figures.py   (схемы тем)
scripts/lesson_design/figures.py                (регистрация модулей, оркестратор)
scripts/lesson_design/terms.py                  (новые термины, только оркестратор)
content/lesson-design/index.html                (оркестратор)
scripts/lesson_design/build.py, verify_code.py  (только если тема требует; только оркестратор)
scripts/lesson_design/tracer.py                 (встроенная функция в панели переменных, T10)
~~~

### Do NOT touch
- `apps/web/**`, `apps/api/**`, `content/practice-bank/**` — перенос на сайт отдельными Change
- `content/lesson-design/topic-5/`, `topic-23/`, `topic-25/`, `course-python/` (кроме путей в `constructs.py`), `course-excel/` — только регрессионная сборка
- агентам — всё вне своей `topic-N/` и своего модуля схем

---

## Contracts

See `docs/SPEC.md` §1.4, §2.3, `docs/runbooks/lesson-pipeline.md` and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

Проверки этапа 7 пайплайна по `topic-16`, `topic-17`, `topic-27` (агенты — своей темы, оркестратор —
повторно для всей волны) и регрессионная сборка темы 5, тем 23/25 и курсов Python и Excel.

### Gate evidence

<!-- Filled by /work from the gate.py summary; /ship compares the diff since this HEAD. -->

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| b121f8a + рабочее дерево | format, python-format, host-ruff, host-python, docs-links, lesson-media (после исправлений Ruff/Pyright в файлах агентов) | PASS | ~20 |
| b121f8a + рабочее дерево | этап 7: verify_code 16/17/27 — 25/39/45 программ, checks.py — 92/84/69, frequency_report, build; регрессия: сборка тем 5/23/25 и курсов Python и Excel — 82 страницы побайтно прежние, кроме строки навигации | PASS | — |
| b121f8a + рабочее дерево (T12–T14) | gate: format, python-format, host-ruff, host-python, docs-links, lesson-media; verify_code 25/40/45, checks 92/84/69; регрессия — страницы тем 5/23/25 и курсов побайтно прежние; Playwriter — все страницы трёх тем на 1280 и 375 px, схемы и запускаемые блоки до конца; новые схемы на выборку отрисованы | PASS | — |
| b121f8a + рабочее дерево | Playwriter: 16-1…16-8, 17-1…17-9, 27-1…27-9, карты, частоты, ревью — 1280 и 375 px без прокрутки и ошибок консоли; все пошаговые схемы до последнего кадра, 8 запускаемых блоков до конца; доказательства раскрываются; схемы на выборку отрисованы и просмотрены | PASS | — |

---

## Implementation Notes

- Агенты тем 16, 17 и 27 — Opus 5.5, effort high, фаза А и фаза Б в одном контексте каждого; общие файлы правил только оркестратор. Термины, нужные нескольким темам (`none`, `augassign`), добавил оркестратор до фазы Б, чтобы ключи не совпали.
- `tracer.py`: встроенная функция, импортированная в запускаемом блоке (`from math import dist`), показывается в панели переменных как «функция», а не `<built-in function dist>` — длинное значение раздвигало блок на 375 px. Запускаемые блоки с импортом есть только в теме 27; остальные страницы стенда собираются побайтно прежними.
- Файлы данных темы 17 для задач в формате экзамена — по 1000 чисел (на экзамене около 10 000), чтобы не раздувать репозиторий; формат и диапазоны экзаменационные.
- Тема 16 разбивает многострочные определения функций жёстким переносом строки (два пробела в конце строки Markdown, `.editorconfig` их сохраняет для `*.md`); при переносе на сайт (этап 9) экспорт должен передать перенос.
- Обзор стенда при локальной раздаче без `<meta charset>` декодируется не в UTF-8 и даёт ложную прокрутку на 375 px; опубликованный артефакт добавляет кодировку сам.
---

## Commit Message

```
feat(change-179): topics 16, 17, 27 stand — wave runbook, maps, lessons
```
