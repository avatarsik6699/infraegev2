# CHANGE 210 — Лёгкий архив релиза для деплоя

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `210` |
| Slug | `slim-release-bundle` |
| Title | Лёгкий архив релиза для деплоя |
| Status | `archived` |
| Branch | `feature/210-slim-release-bundle` |

---

## Goal

2026-10-24 два деплоя `0ad9e69f` (Change 208–209) подряд упёрлись в лимит задания 20 минут на шаге
«Upload release bundle». Днём загрузка занимала 2,5 минуты, вечером шла около 0,4 МБ/с: за 19 минут
дошло 486 из 550 МБ. Прод при этом не менялся.

Почти весь архив (525 из 550 МБ) — вложения банка задач `content/practice-bank/files`. Каталог
релиза на хосте их не читает: банк импортируется отдельно (runbook practice), образы собирает CI,
`content/` монтируется только в dev-compose.

---

## Backlog

### Infra
- [x] `I1` `.github/workflows/deploy.yml`:
  - `git archive` исключает `content/practice-bank/files` (архив 32 МБ вместо 525 МБ);
  - размер архива пишется в журнал;
  - `timeout-minutes` поднят с 20 до 30.

  — _Depends on:_ —

---

## Gate Checks

format, tooling-lint, docs-links. Локально: архив без вложений — 32 МБ, в нём 0 файлов
`content/practice-bank/files/`, на месте `scripts/deploy-remote.sh`, `infra/docker-compose.prod.yml`,
`content/practice-bank/bank.json`, `scripts/operator-command.sh`. `deploy-remote.sh` только
распаковывает архив и ничего не сверяет. Окончательная проверка — следующий деплой.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 0ad9e69f+wt | format, tooling-lint, docs-links; локальная упаковка и состав архива | PASS | ~40 |

---

## Implementation Notes

- Импорт банка на прод по-прежнему делается из чистого checkout кандидата, а не из архива релиза
  (backup-restore § Candidate source, practice runbook).

---

## Commit Message

```
fix(change-210): slim release bundle without bank attachments
```
