# CHANGE 157 — Глубина урока «Рекурсия»: реальные приёмы задания 16

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `157` |
| Slug | `recursion-content-depth` |
| Title | Глубина урока «Рекурсия»: реальные приёмы задания 16 |
| Status | `active` |
| Branch | `feature/157-recursion-content-depth` |

---

## Goal

Довести урок `rekursiya` до покрытия приёмов, которые реально встречаются в задании 16: ветвление по чётности и порогу, шаги не на 1 (`//`, `%`), рекурсия вверх, две функции, «сколько n», дерево вызовов, разность и отношение при огромных аргументах. Упор — на рекурсию с кешем `@lru_cache(None)`, цикл — второй инструмент. Основание — [аудит](artifacts/lessons/16-rekursiya.audit.md) (сверка с 255 задачами банка, ФИПИ-2026 и авторскими статьями Яндекс Образования); контракт качества — [SPEC](SPEC.md) §2.3.

**Принципы.** Смысл важнее заучивания: каждый приём вводится как «проблема → наблюдение → идея → приём → проверка», с «почему работает» и «когда не сработает», со сверкой вторым способом (кеш ↔ упрощение, вверх ↔ вниз). Порядок решения: упростить → выбрать инструмент (кеш, прогрев кеша, `setrecursionlimit`, цикл) → проверить условие завершения. Пререквизиты — ссылками на уроки Python `funktsii` и `rekursiya` (`PythonCourseLessonLink`), без дублирования. Идеи внешних статей переформулируются; их тексты и задачи не переносятся.

---

## Design References

<!-- none provided -->

Визуальный язык — принятый Change 156 (общие компоненты `WorkedExample`, `Mistake`, `Procedure`, `Callout`, `CodeBlock`, чекпоинты); новых компонентов и стилей нет.

---

## Backlog

### Frontend (учебный текст урока)
- [x] `F1` Слить подраздел `why-it-works` в `base-case-and-step` (коротко, без индукции); сохранить id остальных разделов, где возможно — _Depends on:_ —
- [x] `F2` Подраздел про вызовы: ссылки на уроки Python `funktsii`/`rekursiya`; печать «вызвали/закончилась» и дерево вызовов; лимит 1000; счётчик повторных вызовов (числа Фибоначчи); `sys.setrecursionlimit` как один из инструментов; стек объясняется здесь — _Depends on:_ F1
- [x] `F3` Подраздел о кеше: измеренные повторы → идея запоминания → `@lru_cache(None)`; почему не `lru_cache()` (`maxsize=128` вытесняет); «минута ожидания» без кеша как наблюдение — _Depends on:_ F2
- [x] `F4` Переписать подраздел «когда рекурсию заменяет цикл» в «Как считать»: сначала упростить, затем рекурсия + кеш как основной путь, цикл для линейных случаев; убрать «цикл надёжнее»; добавить полный WorkedExample — _Depends on:_ F3
- [x] `F5` Новый подраздел: ветвление по чётности и порогу (`n>1 и чётно`, база при `n ≤ k`) — пример → ошибка → вопрос — _Depends on:_ F4
- [x] `F6` Новый подраздел: шаг не на 1 — `//`, `%`, `n/2`; ловушка `/` vs `//` объяснена причиной (`9/3 = 3.0`) — _Depends on:_ F5
- [x] `F7` Новый подраздел: рекурсия вверх `F(n+k)` с базой при `n>N` и прогрев кеша; направление прогрева выводится из направления зависимости, без «магических» границ — _Depends on:_ F3, F6
- [x] `F8` Новый подраздел: две функции F и G — _Depends on:_ F7
- [x] `F9` Новый подраздел: «сколько n с F(n)=k» (цикл по `n` + функция с кешем) — _Depends on:_ F8
- [x] `F10` Подраздел «Шаблон программы для задания 16» (импорты, кеш, лимит, вывод) с объяснением каждой строки — _Depends on:_ F9
- [x] `F11` Подраздел про большие `n`: разность через телескопирование, отношение, нечистый случай `n·F(n−1)−1` («целая часть»), цифровая рекурсия (`n//10`, `n%10`) — _Depends on:_ F6
- [x] `F12` Сверка вторым способом на одном примере (`F(n)=F(n+2)+2` при `n>N`: счёт с лимитом ↔ вывод формулы); кеш ↔ список — _Depends on:_ F3, F7
- [x] `F13` Ввести названия «Фибоначчи/трибоначчи» в подраздел про два предыдущих значения — _Depends on:_ F1
- [x] `F14` Заменить надуманные `Mistake` реальными ловушками (`/` vs `//`, `n<10` vs `n≤10`, порядок веток, нет базы при `n+k`, нет кеша); убрать повторное объяснение `range` — _Depends on:_ F6, F7
- [x] `F15` Переписать «Общий алгоритм»: 1) упростить, 2) способ вычисления по типу условия, 3) проверить условие завершения; убрать «считайте снизу вверх» — _Depends on:_ F11
- [x] `F16` Заменить дублирующие чекпоинты вопросами «какой приём выбрать по условию» и добавить вопросы на новые подразделы — _Depends on:_ F10, F11
- [x] `F17` Обновить `summary` урока в `lesson-publication.mjs` и учебные результаты (`learningOutcomes`) под новое покрытие — _Depends on:_ F16

### Data (практика и банк)
- [x] `D1` Независимо проверить ответы задач банка вторым способом (скрипт): подтверждено 154 из 255, расхождений нет; остаток — вне change (см. ~~D5~~). Калибровка `difficulty` рассмотрена, без изменений (нет данных о решаемости) — _Depends on:_ —
- [x] `D2` Задачи «наблюдай и объясни»: `/` vs `//` (`rekursiya-true-division`) и подсчёт вызовов (`rekursiya-repeated-calls`); прогрев и `RecursionError` — в примере и вопросе самопроверки — _Depends on:_ F7, D1
- [x] `D3` +10–12 учебных задач по нарастающей (по одной на приём), формулировки собственные, у каждой `theory_links.hash` на реальный подраздел; задачи и обе проверки (верный/неверный ответ) в `content/practice-bank/bank.json` — _Depends on:_ F10, D1
- [x] `D4` Проставить `theory_links.section` для 255 задач банка по [тегам аудита](artifacts/lessons/16-rekursiya.bank-tags.json); пересмотреть `difficulty` — _Depends on:_ F10, D1

### Data (дополнения)
- ~~D5~~ (removed) Проверка оставшихся 101 задачи банка (процедуры, «сколько n», нестандартные форматы): вне задачи углубления урока, каждая требует отдельного разбора. Задачи не менялись; риск принят, список — `docs/artifacts/lessons/16-rekursiya.checks/bank-check.json`.

### Other
- [x] `T1` Сверка с методическими рекомендациями ФИПИ-2026: упрощать до программы, условие завершения, лимит вызовов; решение — `@lru_cache(None)` (выполнено при аудите)
- [x] `T2` Сверено с демоверсией ФИПИ 2027 (задание 16: `F(n) = n·F(n−1)`, выражение `(F(n) + 5·F(n−1)) / F(n−2)`): приём «выразить всё через наименьшее значение и сократить» добавлен в раздел про большие n; остальные приёмы демоверсии — в уроке. Полные подборки sdamgia не просматривались — _Depends on:_ —
- [x] `T3` Обновить `lesson-content-contract.test.ts` (порядок id теории/задач) и page object/E2E при смене разметки — _Depends on:_ F17, D3
- [x] `T4` Запись качества `docs/artifacts/lessons/16-rekursiya.quality.md` по [runbook](runbooks/lesson-authoring.md) §5: карта «понятие → задача», независимые ответы, граничные случаи — _Depends on:_ D3, D4
- [x] `T5` Проверка страницы как ученик: 390/1440 и no-JS в изолированном E2E, скриншоты просмотрены; Playwriter не использован (нужна засеянная БД) — _Depends on:_ T3

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
apps/web/src/entities/lesson/content/rekursiya.lesson.tsx
apps/web/src/shared/config/lesson-publication.mjs
apps/web/tests/lesson-content-contract.test.ts
apps/web/e2e/pages/topic-lesson.page.ts  (только при смене разметки)
content/practice-bank/bank.json
apps/api/practice-registry.json  (через scripts/practice-registry.mjs)
docs/artifacts/lessons/16-rekursiya.quality.md
~~~

### Do NOT touch
- Общие компоненты, токены и стили (`apps/web/src/shared/**`, `apps/web/src/app/styles/**`) — визуальный язык закреплён Change 156.
- Другие уроки и курс Python; API-код и схема БД; `content/tasks/*.json` (исторические fixtures).

---

## Contracts

See `docs/SPEC.md` §2.3 (Content Quality Gate), §3–§4 and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with explicit `--full`; release selects affected checks and Release Gate. All gates are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

Дополнительно к Critical Gate: `pnpm validate:content`, `node scripts/practice-registry.mjs --check`, API-тесты банка (`test_minimal_bank.py`, `test_tasks_api.py`), изолированный E2E (`bash scripts/run-isolated-browser-audit.sh`) для страницы `/ege/16-rekursiya` и `accessibility`; все новые примеры и ответы запускаются в Python.

---

## Implementation Notes

- Теория выросла с 9 до 15 подразделов, задач урока — с 5 до 14. Порог освоения 0,8 теперь означает 12 из 14; E2E-путь прогресса решает 12 задач.
- Раздел `why-it-works` слит в `base-case-and-step`; сохранённые id разделов и хэши `theory_links` прежних задач не менялись.
- Скрипты и результаты проверки лежат в `docs/artifacts/lessons/16-rekursiya.checks/`.

- Рабочий банк — `content/practice-bank/bank.json` и `practice-registry.json`; `content/tasks/rekursiya-*.json` остаются историческими fixtures (STACK §Frontend).
- E2E требует засеянной БД: локально использовать `scripts/run-isolated-browser-audit.sh`, а не dev-базу (уроки Change 156).
- Требование `@lru_cache(None)` подтверждено архитектором; версия Python на экзамене не влияет на выбор.

---

## Commit Message

```
feat(change-157): deepen recursion lesson — real task types, cache, tasks
```
