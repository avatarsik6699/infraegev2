# CHANGE 236 — Адрес для чека, суммы в письмах, Chromium вне диска WSL

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `236` |
| Slug | `refund-mail-fixes` |
| Title | Адрес для чека, суммы в письмах, Chromium вне диска WSL |
| Status | `archived` |
| Branch | `feature/236-refund-mail-fixes` |

---

## Goal

Выпуск готовых пунктов Change 234: B1, B3, B4, I1, I2. Сама Change 234 с шагами на проде
остаётся открытой на своей ветке.

---

## Backlog

### Backend
- [x] `B1` (234 B1) `refund_states` пишет `billing.refund_state_unavailable`, когда Robokassa не
  отвечает о возврате. — _Depends on:_ —
- [x] `B2` (234 B3) Провайдер сообщает, примет ли он адрес (`accepts_email`; Robokassa — без `+`).
  Непринятый адрес не передаётся и не сохраняется как адрес для чека: его заполняет адрес из
  уведомления, введённый покупателем у провайдера. — _Depends on:_ —
- [x] `B3` (234 B4) Суммы в письмах — с запятой (`0,10 ₽`). — _Depends on:_ —

### Infra
- [x] `I1` (234 I1) Все конфигурации Playwright запускают Chromium без `--disable-dev-shm-usage`
  (`chromiumLaunch`): иначе его разделяемая память занимает гигабайты диска WSL через `/tmp`.
  — _Depends on:_ —
- [x] `I2` (234 I2) Изолированный браузерный прогон связывает файлы банка жёсткими ссылками.
  — _Depends on:_ —

---

## Files

### Create / modify
~~~
apps/api/app/modules/billing/{api,jobs,notices}.py, apps/api/app/modules/billing/provider/*,
apps/api/tests/test_billing.py, apps/api/tests/test_robokassa.py,
apps/web/e2e/support/chromium-launch.ts, apps/web/playwright*.config.ts,
scripts/run-isolated-browser-audit.sh, docs/KNOWN_GOTCHAS.md
~~~

### Do NOT touch
- Схема БД и данные.

---

## Contracts

See [billing runbook](../../runbooks/billing.md).

---

## Gate Checks

Как у Change 234, на том же содержимом файлов.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 45c29c76+wt | format, python-format, web-lint, web-typecheck, shell-lint, api-lint, api-typecheck, api-contract, docs-links | PASS | 120 |
| 45c29c76+wt | pytest test_billing, test_robokassa, test_operator_cli (22) | PASS | 187 |
| 45c29c76+wt | isolated browser `billing` with a disk probe: flat 6.8–6.9 GB, 4/4 in 59 s | PASS | 164 |

---

## Implementation Notes

---

## Commit Message

```
fix(change-236): receipt address from the provider, comma sums, refund-state log, Chromium off the WSL disk
```
