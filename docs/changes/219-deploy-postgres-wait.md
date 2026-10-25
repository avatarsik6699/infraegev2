# CHANGE 219 — Запас времени на старт postgres при деплое

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `219` |
| Slug | `deploy-postgres-wait` |
| Title | Запас времени на старт postgres при деплое |
| Status | `done` |
| Branch | `feature/219-deploy-postgres-wait` |

---

## Goal

Деплой `5d0f4374` (Changes 217–218) 2026-10-25 откатился: `up --wait --wait-timeout 60 postgres`
не дождался готовности БД. Postgres пересоздаётся при каждом релизе, потому что его скрипт ролей
лежит в каталоге релиза. Сразу после скачивания образов он стартовал около 90 с: 66 с ушло на
ожидание диска. При откате тот же запуск занял 4 с. Production не пострадал, откат прошёл штатно.

---

## Backlog

### Ops
- [x] `T1` `scripts/deploy-remote.sh`: ожидание postgres 180 с, как у остальных сервисов. —
  _Depends on:_ —

---

## Gate Checks

`shell-lint`, `scripts/tests/deploy-preflight.test.sh`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 5d0f4374+wt | shell-lint, deploy-preflight | PASS | 10 |

---

## Implementation Notes

Пересоздание postgres на каждом релизе даёт минуту-две недоступности API. Устранить его можно,
если монтировать скрипт ролей из постоянного пути вместо каталога релиза. Это отдельное решение,
сюда не входит.

---

## Commit Message

```
fix(change-219): give postgres three minutes to start during a deploy
```
