# CHANGE 218 — Код: мёртвое, дубли, переименование, LCP и e2e

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `218` |
| Slug | `code-cleanup-rename` |
| Title | Код: мёртвое, дубли, переименование, LCP и e2e |
| Status | `done` |
| Branch | `feature/218-code-cleanup-rename` |

---

## Goal

Второй блок комплексного аудита (план архитектора от 2026-10-25):
- удалить мёртвый код и одноразовые инструменты, слить явные дубли;
- переименовать `infraege` в `kodumka` везде, кроме инфраструктурных имён;
- исправить LCP страниц курсов;
- вернуть e2e-набор к зелёному состоянию.

По решению архитектора cookie переименовываются без миграции: оба существующих аккаунта
принадлежат оператору.

---

## Backlog

### Web
- [x] `T1` Удалено неиспользуемое: класс `.learningContentHeading`, override ESLint для удалённого
  `lesson-design-lab`, комментарий о lab в `vite.config.ts`. — _Depends on:_ —
- [x] `T2` Склонения через `shared/lib/russian-count.ts`: добавлены `russianForms` (урок, задание)
  и `russianCount.lessons`. Удалены ручные `lessonCount` (две копии), `taskCount`, `countLabel` и
  пять копий `lessonForms`. — _Depends on:_ —
- [x] `T3` `difficultyLabel`: серверная проекция использует `practiceCatalog.difficultyLabel`, API
  отдаёт только значения 1–3. — _Depends on:_ —
- [x] `T4` LCP курсов (Lighthouse на production: 5,6–6 с). Картинка курса над сгибом теперь
  загружается сразу, с `fetchpriority="high"`: на `/courses` это первая карточка, на странице курса —
  главная картинка. Добавлены версии 480w (16–23 КБ), `course_scenes.py` выпускает три ширины.
  — _Depends on:_ —

### API
- [x] `T5` Удалены `LastLoginMethod` и `PAGE_SIZE`. `verified_email` в billing берётся из
  `account.restrictions`. — _Depends on:_ —
- [x] `T6` Удалены одноразовые инструменты вместе с тестами (`practice/kompege*.py`,
  `practice/bank_repair.py`); `practice.md` оставляет короткую справку. `PyJWT[crypto]` заменён на
  `PyJWT`: для HS256 cryptography не нужна. — _Depends on:_ —

### Rename
- [x] `T7` `infraege` → `kodumka`:
  - cookie `__Host-kodumka_session` и `__Host-kodumka_oauth`;
  - ключ `kodumka:ege-goal`;
  - шрифты «Kodumka Onest» и «Kodumka JetBrains Mono»;
  - атрибуты `data-kodumka-*`;
  - имя плагина Vite, имена пакетов, заголовок API;
  - тема письма `[kodumka billing]`;
  - файлы бренда `kodumka-*` и `og:image`.

  **Ошибка, видная покупателю:** описание платежа для Robokassa и чека было «… — infraege», причина
  возврата — «Возврат оплаты infraege»; теперь «Кодумка». Копия знака в
  `widgets/public-header/assets` удалена, заголовок берёт `/brand/kodumka-mark.svg`. Копия в
  `infra/nginx/auxiliary/assets` нужна как точка монтирования и остаётся.

  Не менялись: `sre.infraege.ru`, роли БД, контейнеры, тома, имена `infraege*.conf`, префикс
  `/_infraege/`, переменные окружения `INFRAEGE_*`, старые ключи localStorage в тестах очистки.
  — _Depends on:_ —

### E2E
- [x] `T8` Ручной прогон на HEAD `9094b16e` дал 15 падений из 268. Что сделано:
  - smoke ждал 404 на старом адресе темы 25, а Change 206 сделал 301 — тест теперь проверяет
    редирект;
  - выбор «На странице» мог открыться во время перерисовки — клик повторяется до появления опции;
  - падения account, topic-catalog и topic-25 только в CI: страница не успевает гидратироваться на
    dev-сервере Vite за 5 с. В CI ожидание увеличено до 15 с, главную причину (чанк 5 МБ)
    устраняет Change 221. — _Depends on:_ —

---

## Gate Checks

Группы: `format`, `python-format`, `tooling-lint`, `web-lint`, `web-typecheck`, `shell-lint`,
`api-lint`, `api-typecheck`, `host-ruff`, `host-python`, `docs-links`, `infra-config`,
`api-contract`, `paid-leak`.

Тесты:
- vitest: 17 файлов, 170 тестов;
- pytest: robokassa, billing, providers, auth/cookie, devices/restrictions — 26 тестов;
- shell: `paid-gate`, `auxiliary-pages`;
- изолированный e2e — по портфелям в таблице ниже.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| cb367b5b+wt | 14 static groups | PASS | 120 |
| cb367b5b+wt | vitest 17 files / 170 tests | PASS | 60 |
| cb367b5b+wt | pytest 26 tests | PASS | 270 |
| cb367b5b+wt | paid-gate, auxiliary-pages | PASS | 60 |
| cb367b5b+wt | e2e full: account, smoke, topic-catalog, topic-25, practice-catalog (75) | PASS after fixes | 210 |
| cb367b5b+wt | e2e account and billing portfolios | PASS (billing: one dev-server module fetch flake, rerun green) | 70 |

---

## Implementation Notes

Решено не делать:
- снимать `export` с типов в публичных сигнатурах (`AccountSession`, `RussianForms` и других);
- выносить `DAY_MS` в общий модуль: одна константа в двух местах;
- объединять `now()` и `MOSCOW` по модулям: тесты подменяют часы каждого модуля.

После релиза оба аккаунта оператора выйдут из системы: имя cookie изменилось.

---

## Commit Message

```
refactor(change-218): dead code, kodumka naming, course LCP and stale e2e
```
