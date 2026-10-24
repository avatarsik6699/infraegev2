# CHANGE 203 — Находки Release Gate: gitleaks и зависимости

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `203` |
| Slug | `release-audit` |
| Title | Находки Release Gate: gitleaks и зависимости |
| Status | `archived` |
| Branch | `feature/203-release-audit` |

---

## Goal

Release Gate перед публикацией (`e0d433fc..a5cbd53f`, 163 коммита) остановил push по двум причинам.

1. **Gitleaks:** 2016 срабатываний `generic-api-key`. Все они — поле `storage_key` в
   `content/practice-bank/bank.json`. Проверено: все 1947 текущих значений равны SHA-256 публичных
   файлов банка, то есть это адреса содержимого, а не секреты.
2. **pnpm audit:** HIGH в инструментах разработки:
   - `vite` 8.2.1 (GHSA-587h-7wmj-h5pm);
   - `zod` 4.4.3 через `eslint-plugin-react-hooks` и 3.25.76 через Lighthouse CI
     (GHSA-mrhx-c7xc-m3w5);
   - `body-parser` 1.20.6 через `@lhci/cli` (GHSA-27r3-jxmh-p828).

   В образы ни один из этих пакетов не попадает.

---

## Backlog

### Infra
- [x] `I1` `.gitleaks.toml`: исключение для строк `"storage_key": "<64 hex>"` только в `bank.json`
  (`regexTarget = "line"`). — _Depends on:_ —
- [x] `I2` `vite` 8.2.1 → 8.2.4; override `zod@>=4.0.0 <4.6.6` → 4.6.6. — _Depends on:_ —
- [x] `I3` Исправления нет или оно слишком свежее, поэтому `ignoreGhsas` с обоснованием:
  - `zod` 3.x: исправления нет вовсе, пакет только в Lighthouse CI;
  - `body-parser` 1.20.9: вышел 2026-10-22, моложе `minimumReleaseAge` (7 дней). Пакет только в
    локальном сервере Lighthouse CI. С 2026-10-29 исключение заменить override.

  — _Depends on:_ —

---

## Files

### Create / modify
~~~
.gitleaks.toml, apps/web/package.json, pnpm-workspace.yaml, pnpm-lock.yaml
~~~

---

## Gate Checks

pre-push gitleaks по всему диапазону; `pnpm audit --audit-level high`; format, tooling-lint,
web-lint, web-typecheck; production-сборка с проверкой утечки платного текста; vitest; e2e на
новом vite.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| a5cbd53f+wt | gitleaks `e0d433fc..main` — no leaks; `pnpm audit` — 0 HIGH вне исключений; format, tooling-lint, web-lint, web-typecheck, infra-config; сборка + paid-leak (74 модуля); vitest 544/544 | PASS | ~345 |
| a5cbd53f+wt | e2e dev (vite 8.2.4): smoke, practice-cutover, account — 52/54. Два падения — `net::ERR_INSUFFICIENT_RESOURCES` dev-режима (см. Change 202), на production-сборке эти сценарии проходят | PASS (accepted) | ~170 |

---

## Implementation Notes

- Еженедельный аудит (`audit-security.yml`) падает с 2026-10-06; к релизу это не относится, так
  как в Release Gate входит только скан истории. Скан рабочей папки находит:
  - `twilio-api-key` на случайных данных в файлах вложений задач (`content/practice-bank/files`,
    `infra/task-files.local`);
  - два `storage_key` на стыках кусков большого `bank.json`.

  Это отдельная задача Backlog после релиза.
- `body-parser`: заменить исключение на override после 2026-10-29.

---

## Commit Message

```
fix(change-203): release gate findings — gitleaks storage keys, dev dependency advisories
```
