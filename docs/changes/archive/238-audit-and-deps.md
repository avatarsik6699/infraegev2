# CHANGE 238 — Недельный аудит безопасности и обновления Dependabot

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `238` |
| Slug | `audit-and-deps` |
| Title | Недельный аудит безопасности и обновления Dependabot |
| Status | `archived` |
| Branch | `feature/238-audit-and-deps` |

---

## Goal

`audit-security.yml` падал с 27.10 на одной блокирующей находке semgrep в скрипте сборки уроков.
Заодно приняты семь открытых PR Dependabot (#42–#48): все прошли его 7-дневную выдержку.

---

## Backlog

### Infra
- [x] `I1` semgrep `detect-non-literal-regexp` в `scripts/lib/lesson-sources.mjs:23`. Выражение
  собиралось из имени поля, а `nosemgrep` стоял двумя строками выше находки и не действовал.
  Теперь у `title` и `lead` литеральные выражения. `topicStructure` по 25 темам совпадает побайтно
  до и после правки. — _Depends on:_ —
- [x] `I2` Dependabot:
  - #42: дайджест `node:22.23.2-slim`;
  - #43: `actions/setup-node` 7.1.0;
  - #44: `astral-sh/setup-uv` 10.3.0;
  - #45: `actions/upload-artifact` 7.0.2;
  - #46: sqlalchemy 2.1.5, `uv.lock` обновлён;
  - #47: `docker/build-push-action` 7.4.0;
  - #48: `anchore/sbom-action` 0.24.3.

  Диффы PR применены в ветке, PR закроются, когда `main` с ними уйдёт на GitHub. — _Depends on:_ —

---

## Files

### Create / modify
~~~
scripts/lib/lesson-sources.mjs, .github/workflows/*.yml, apps/web/Dockerfile,
apps/api/pyproject.toml, apps/api/uv.lock
~~~

### Do NOT touch
- Код приложения.

---

## Contracts

—

---

## Gate Checks

semgrep `p/default`, как в `audit-security.yml`; pytest на базе для sqlalchemy.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| a2865ef8+wt | format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, infra-config, python-format, api-contract, docs-links; `validate-content-links.mjs` | PASS | 80 |
| a2865ef8+wt | semgrep 1.172.0 `p/default` (the weekly audit's command): 0 findings on 528 rules | PASS | — |
| a2865ef8+wt | pytest test_billing, test_robokassa, test_operator_cli, test_account_lifecycle (30) on sqlalchemy 2.1.5 | PASS | 273 |

---

## Implementation Notes

---

## Commit Message

```
chore(change-238): weekly audit back to green, Dependabot updates
```
