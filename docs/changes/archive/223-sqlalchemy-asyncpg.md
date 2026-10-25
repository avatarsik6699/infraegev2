# CHANGE 223 — SQLAlchemy 2.1, asyncpg 0.32 и keepalive SSH деплоя

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `223` |
| Slug | `sqlalchemy-asyncpg` |
| Title | SQLAlchemy 2.1, asyncpg 0.32 и keepalive SSH деплоя |
| Status | `archived` |
| Branch | `feature/223-sqlalchemy-asyncpg` |

---

## Goal

Архитектор одобрил 2026-10-25 обновления из открытых PR Dependabot #40 и #36: SQLAlchemy 2.1.4 и
asyncpg 0.32.0. В той же сессии деплой Change 222 оборвался: SSH раннера разорвался на долгом
бэкапе («client_loop: send disconnect: Broken pipe»). Production остался на прежнем релизе.
Исправление добавлено сюда, чтобы 222 вышел вместе с этим изменением.

---

## Backlog

### API
- [x] `T1` `sqlalchemy[asyncio]==2.1.4`, `asyncpg==0.32.0`, `uv.lock`. Затронутые изменения 2.1 —
  minimum Python 3.11, psycopg по умолчанию для `postgresql://`, autoflush перед `text()`,
  именованные ENUM. Приложение строит URL `postgresql+asyncpg` явно, ENUM нет, образ — Python
  3.12. — _Depends on:_ —
- [x] `T2` Pyright с типами 2.1 сверяет протокол с `Mapped[...]`: в `practice/readers.py` и
  `account/progress.py` поставлен `cast` с причиной, поведение не меняется. — _Depends on:_ T1
- [x] `T3` Разбор XML Robokassa проверяет `node is not None`, а не истинность элемента
  (DeprecationWarning). — _Depends on:_ —

### Ops
- [x] `T4` `production_ssh`: `ServerAliveInterval=30`, `ServerAliveCountMax=6`. — _Depends on:_ —

---

## Gate Checks

`api-lint`, `api-typecheck`, `python-format`, `api-contract`, полный pytest API, миграции на
одноразовой PostgreSQL 18 (`upgrade head`, `current`, `check`), shell-тесты
`deploy-preflight` и `root-password-access`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| fb7071f6+wt | api-lint, api-typecheck, python-format, api-contract | PASS | 12 |
| fb7071f6+wt | pytest API: 582 tests | PASS | 965 |
| fb7071f6+wt | alembic upgrade head → `198_01`, `alembic check`: no new operations | PASS | 40 |
| fb7071f6+wt | deploy-preflight, root-password-access, test_robokassa без DeprecationWarning | PASS | 10 |

---

## Implementation Notes

Откат деплоя 222 оставил сервер целым: `current` и `database-current` на `a1fbfeb5`, процесс
деплоя завершён, postgres пересоздан из нового релиза и healthy.

---

## Commit Message

```
chore(change-223): SQLAlchemy 2.1, asyncpg 0.32 and deploy SSH keepalive
```
