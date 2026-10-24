# CHANGE 202 — Проверка сессии вне лимита входа

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `202` |
| Slug | `session-check-budget` |
| Title | Проверка сессии вне лимита входа |
| Status | `archived` |
| Branch | `feature/202-session-check-budget` |

---

## Goal

Найдено при e2e-разборе релиза 2026-10-24. Тесты, прогнанные на production-сборке за nginx
(gate-стек, `:18080`), получали `429` на `GET /api/auth/session`. После этого сайт показывал
«Не удалось проверить вход», а прогресс не загружался.

Причина: с Change 140 весь префикс `/api/auth/` идёт через зону `auth_requests` (10 запросов в
минуту на IP, burst 10). А проверку сессии браузер делает при каждой загрузке страницы. Класс
школьников за одним NAT или абоненты мобильного оператора исчерпают этот бюджет за минуту.

Перебор через этот запрос невозможен: он только читает cookie. Поэтому он переходит в бюджет
чтения страниц: `page_reads`, 600 в минуту, burst 200. Лимит входа, регистрации, сброса пароля и
колбэков провайдеров не меняется.

---

## Backlog

### Infra
- [x] `I1` `infra/nginx/snippets/practice-read-zone.conf`: `/api/auth/session` в ключе
  `page_read_key`. `infraege.prod.conf` и `infraege.conf`: точный `location = /api/auth/session` с
  `practice-read-limit.conf`. — _Depends on:_ —
- [x] `I2` `scripts/tests/auth-edge.test.sh`: после исчерпания бюджета входа 60 параллельных
  проверок сессии не получают `429`. — _Depends on:_ I1
- [x] `T1` `docs/runbooks/production.md`: исключение для проверки сессии. — _Depends on:_ I1

---

## Files

### Create / modify
~~~
infra/nginx/snippets/practice-read-zone.conf, infra/nginx/conf.d/{infraege.prod.conf,infraege.conf}
scripts/tests/auth-edge.test.sh, docs/runbooks/production.md
~~~

### Do NOT touch
- Зона `auth_requests` и её параметры.

---

## Gate Checks

`infra-config`, nginx-контракты `auth-edge`, `practice-read-limit`, `paid-gate`,
`auxiliary-pages`; e2e на gate-стеке (production-сборка за nginx).

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| ce1bd048+wt | shell-lint, docs-links, infra-config; контракты auth-edge (с новой проверкой), practice-read-limit, paid-gate, auxiliary-pages | PASS | ~14 |
| ce1bd048+wt | e2e на production-сборке за nginx (gate `:18080`): practice-cutover, topic-catalog, practice-catalog — 27/28; единственное падение (геометрия 390 px с недоступными ассетами) прошло 3/3 повтором | PASS | ~50 |

---

## Implementation Notes

Разбор e2e релиза (Full Gate после Change 201: 260/268):
- Штатный изолированный прогон (`run-isolated-browser-audit.sh full`, dev-сервер Vite) дал другой
  набор падений: 259/268. Повтор упавших прошёл, кроме `practice-cutover:24`.
- `practice-cutover:24` на dev-сервере падает с `net::ERR_INSUFFICIENT_RESOURCES`. Урок курса
  Python тянет сотни модулей, и браузеру не хватает ресурсов; ни одного ответа API в трейсе нет.
  Иногда тест проходит в одиночку. Это ограничение dev-режима.
- На production-сборке за nginx тот же тест упал по другой причине — `429` на проверке сессии.
  Это и есть дефект продукта, исправленный здесь; после правки тест проходит.
- Наблюдение, не исправлялось: production-сборка в тестах шлёт просмотры в настоящую аналитику
  `sre.infraege.ru/api/collect` с хостом `127.0.0.1`.

---

## Commit Message

```
fix(change-202): the session check reads on the page budget
```
