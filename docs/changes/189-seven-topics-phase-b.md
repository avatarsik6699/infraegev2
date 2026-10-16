# CHANGE 189 — Фаза Б семи тем: тексты, схемы и задачи на стенде

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `189` |
| Slug | `seven-topics-phase-b` |
| Title | Фаза Б семи тем: тексты, схемы и задачи на стенде |
| Status | `active` |
| Branch | `feature/189-seven-topics-phase-b` |

---

## Goal

Пройти этапы 4–8 пайплайна для тем 1, 2, 6, 12, 13, 15, 22 по картам, согласованным в change 187 (`content/lesson-design/topic-NN/map.md`): тексты подтем и итоговой страницы, схемы и `review.md`, задачи с ответами и `checks.py`, проверки этапа 7 и ревью архитектора на стенде. Темы идут по одной в одной сессии, без параллельных агентов; следующая тема начинается после одобрения стенда предыдущей. Только формат ЕГЭ 2027; названия тем — короткие, по формулировкам ФИПИ 2027. Перенос на сайт — отдельный change после ревью стенда.

---

## Backlog

### Other

- [x] T1 Записать в `docs/runbooks/lesson-pipeline.md` решения архитектора 2026-10-16: ориентир только на формат 2027 (архивные исполнители, соглашения и формулировки не переносятся, строки исходника помечаются в карте «не переносится»); порядок и названия тем — по «Обобщённому плану варианта» спецификации ФИПИ 2027, названия короткие. Согласовать с архитектором короткие названия семи тем и записать их в `topic.json` — _Depends on:_ —
- [x] T2 Тема 1: этапы 4–7 по карте — подтемы 01–06, итог 07 со шпаргалкой, схемы в `graph_match_figures.py`, `review.md`, задачи и `checks.py`, проверки этапа 7, проход глазами ученика — _Depends on:_ T1
- [x] T3 Тема 1: стенд (этап 8) — `index.html`, публикация артефакта, ревью архитектора; замечания — новыми пунктами Backlog — _Depends on:_ T2
- [x] T4 Тема 2: этапы 4–7 по карте (источник `2/2.md`; вывод программ — блоки `output`; схемы в `logic_table_figures.py`) — _Depends on:_ T3
- [x] T5 Тема 2: стенд и ревью архитектора — _Depends on:_ T4
- [x] T6 Тема 6: этапы 4–7 по карте (исполнитель команд без Tk и рисунки в `turtle_figures.py`; программы `turtle` без вывода, подсчёт по координатам — с выводом) — _Depends on:_ T5
- [x] T7 Тема 6: стенд и ревью архитектора — _Depends on:_ T6
- [x] T8 Тема 12: этапы 4–7 по карте (только машина Тьюринга; лента и такты в `turing_figures.py`; LaTeX → Unicode) — _Depends on:_ T7
- [x] T9 Тема 12: стенд и ревью архитектора — _Depends on:_ T8
- [x] T10 Тема 13: этапы 4–7 по карте (источник `13/13.md`; вывод программ — блоки `output`; граф переходов в `executor_figures.py`) — _Depends on:_ T9
- [x] T11 Тема 13: стенд и ревью архитектора — _Depends on:_ T10
- [x] T12 Тема 15: этапы 4–7 по карте (без архивных условий; LaTeX → Unicode; схемы в `parameter_figures.py`) — _Depends on:_ T11
- [x] T13 Тема 15: стенд и ревью архитектора — _Depends on:_ T12
- [x] T14 Тема 22: этапы 4–7 по карте (ВПР — подтема 3; выгрузка книги в `22/22_training.md`, `datasets.py` и книги `22-N.xlsx`, мини-листы `sheet`/`excel` и `verify_sheets.py`; схемы в `process_figures.py`) — _Depends on:_ T13
- [x] T15 Тема 22: стенд и ревью архитектора — _Depends on:_ T14

**2026-10-16:** все семь тем опубликованы в артефакт стенда https://claude.ai/artifact/XiysKjUymWBdzjXQjdz8uk (версия 46: `index.html` и 77 страниц тем 1, 2, 6, 12, 13, 15, 22; страницы прежних тем не перезаписаны — их навигация без новых тем до следующей полной публикации). Ревью архитектора на стенде — замечания новыми пунктами.

**2026-10-16:** архитектор просмотрел стенд — замечаний нет, переход к этапу 9 (перенос на сайт — change 190).

---

## Files

### Create / modify

~~~
docs/runbooks/lesson-pipeline.md — решения T1
content/lesson-design/topic-{1,2,6,12,13,15,22}/ — подтемы, итог, cheatsheet.json, review.md, checks.py, files/, datasets.py (22), правки map.md/topic.json по ходу
scripts/lesson_design/{graph_match,logic_table,turtle,turing,executor,parameter,process}_figures.py — построители тем
scripts/lesson_design/terms.py — термины только под строками «# --- topic NN ---»
scripts/lesson_design/{figures,build,verify_code}.py — только если теме нужна правка общего кода
content/lesson-design/index.html — обзор стенда
docs/artifacts/lessons/22/22_training.md — выгрузка листов книги для адресации
docs/changes/189-seven-topics-phase-b.md
~~~

### Do NOT touch

- `apps/**`, банк задач, база данных, production: перенос на сайт — отдельный change.
- Исходники `docs/artifacts/lessons/**` (кроме выгрузки `22_training.md`) и папки уже опубликованных тем.
- Архив изменений.

---

## Contracts

См. `docs/runbooks/lesson-pipeline.md` (этапы 4–8), `docs/runbooks/lesson-patterns.md`, «выводы прошлых тем» в `docs/runbooks/lesson-wave.md`, SPEC §1.4, §2.3 и Files выше. Карта темы — согласованный план; отклонение от неё — только по решению архитектора с записью в `map.md`.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

На каждую тему — команды этапа 7 (`verify_code.py`, `checks.py`, `frequency_report.py`, `build.py`; для 22 ещё `verify_sheets.py` и `datasets.py --check`), Ruff/Pyright/Prettier по своим файлам, Playwriter на 1280 и 375 px по страницам темы. Переборы — генераторами, запуск под `ulimit -v 3000000; timeout 600` (память WSL общая).

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| b956f49 + рабочее дерево | `gate.py affected` → format, python-format, host-ruff, host-python, docs-links, lesson-media | PASS | 46 |
| b956f49 + рабочее дерево | этап 7: `checks.py` — тема 1: 64, 2: 77, 6: 114, 12: 106, 13: 123, 15: 128, 22: 92 (все PASS); `verify_code.py` — 0/6/8/7/12/7/0 программ, 0 проблем; `verify_sheets.py` темы 22 — 2 листа, 56 формул, 0 проблем; `datasets.py --check` — 6 книг совпадают | PASS | — |
| b956f49 + рабочее дерево | Ruff по `scripts/lesson_design` и `checks.py`/`datasets.py` тем; Pyright `scripts/pyrightconfig.json` — 0 ошибок (предупреждения только о необязательных импортах); `unittest` export_lesson_test, sheet_eval_test — 56 OK | PASS | — |
| b956f49 + рабочее дерево | Playwriter (Chrome Default, сессия стенда): все страницы семи тем на 1280 и 375 px — без горизонтальной прокрутки и ошибок консоли (широкие схемы прокручиваются внутри рамки), пошаговые схемы листаются до конца; `index.html` на 375 px даёт ту же ложную прокрутку, что и `main` (кодировка локального файла без обёртки артефакта); опубликованная версия 46 — новые страницы, схемы и мини-листы открываются | PASS | — |

---

## Implementation Notes

- Решение архитектора 2026-10-16: промежуточных одобрений нет. Пункты «стенд и ревью» (T3, T5, …, T15) — публикация темы на демо-стенде; ревью и исправления — после того, как все семь тем будут на стенде. Короткие названия тем (T1) агент выводит из формулировок ФИПИ сам; согласование — на стенде.

- Общий инструмент `split_source.py` исправлен по ходу: экранированные скобки кода (`dp\[6\]`) больше не принимаются за формулу, фигурные скобки множеств (`\{1,2\}`) сохраняются, поддержаны формулы в `$…$` вне кода, `\setminus`, `\varepsilon`, `\frac{…}x`. Черновики тем 1, 2, 6 сделаны до правки и экранированных скобок не содержали.
- Построители новых тем: `graph_match_figures.py` (1), `logic_table_figures.py` (2), `turtle_figures.py` (6, исполнитель без Tk), `turing_figures.py` (12), `executor_figures.py` (13), `parameter_figures.py` (15), `process_figures.py` (22, с `pr_book` — свёрнутый мини-лист книги, потому что артефакт `.xlsx` не отдаёт). Книги `topic-22/files/22-N.xlsx` в `.gitignore`, как у тем 3, 9, 18; их воспроизводит `datasets.py --write`.
- Тема 22: в мини-листе ВПР два столбца поставщиков (у автора три) — формула с тремя `ВПР` длиннее 64 символов строки кода; в тексте сказано, как добавить третий.
- Тема 2: из итоговой страницы убран остаток исходника («## 25 Упражнения…» с методической пометкой).

---

## Commit Message

```
feat(change-189): phase B for seven topics — texts, figures, tasks
```
