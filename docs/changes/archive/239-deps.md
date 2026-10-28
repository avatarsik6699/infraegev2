# CHANGE 239 — Обновления Dependabot после 238

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `239` |
| Slug | `deps` |
| Title | Обновления Dependabot после 238 |
| Status | `archived` |
| Branch | `feature/239-deps` |

---

## Goal

После выхода 238 Dependabot переоткрыл три PR на более новых версиях. Принять их, чтобы поток
обновлений не копился.

---

## Backlog

### Infra
- [x] `I1` Dependabot:
  - #42: `node:22.23.3-slim` (LTS от 2026-09-23) в образе web; `node-version` в CI тоже 22.23.3;
  - #44: `astral-sh/setup-uv` 10.3.1 (коммит совпадает с тегом `v10.3.1`);
  - #46: sqlalchemy 2.1.6 (две правки регрессий ORM и `make_url.keep_blank_values`), `uv.lock`.

  PR закроются, когда `main` с ними уйдёт на GitHub. — _Depends on:_ —

---

## Files

### Create / modify
~~~
.github/workflows/{audit-browser,audit-security,quality}.yml, apps/web/Dockerfile,
apps/api/pyproject.toml, apps/api/uv.lock
~~~

### Do NOT touch
- Код приложения.

---

## Contracts

—

---

## Gate Checks

Статические группы из `gate.py affected`; pytest на базе для sqlalchemy.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 15e3e821+wt | format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, infra-config, docs-links | PASS | 71 |
| 15e3e821+wt | pytest test_billing, test_robokassa, test_operator_cli, test_account_lifecycle (30) on sqlalchemy 2.1.6 | PASS | 313 |

---

## Implementation Notes

---

## Commit Message

```
chore(change-239): Dependabot updates (node 22.23.3, setup-uv 10.3.1, sqlalchemy 2.1.6)
```
