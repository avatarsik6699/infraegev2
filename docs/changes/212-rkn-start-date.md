# CHANGE 212 — Дата начала обработки для уведомления в РКН

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `212` |
| Slug | `rkn-start-date` |
| Title | Дата начала обработки для уведомления в РКН |
| Status | `archived` |
| Branch | `feature/212-rkn-start-date` |

---

## Goal

Решение архитектора 2026-10-24: в уведомлении в РКН датой начала обработки указывается дата
отправки уведомления.

Факты, проверенные на проде:
- первый публичный деплой 10.08.2026;
- аккаунтов два, оба оператора; оплат нет;
- журналы nginx с 26.09.2026: около 5,3 тыс. адресов, из них около 2 тыс. «браузерных», почти
  все — облачные сети и сканеры.

Риск того, что РКН сочтёт журналы с IP обработкой с 10.08, отмечен и принят архитектором.

---

## Backlog

### Docs
- [x] `T1` `privacy-legal-checklist.md` § 4: дата начала обработки, обоснование и условие «ученикам
  и боевой оплате — только после отправки уведомления». — _Depends on:_ —

---

## Gate Checks

docs-links.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 69659a35+wt | docs-links | PASS | 1 |

---

## Implementation Notes

None

---

## Commit Message

```
docs(change-212): RKN notice start date is the filing date
```
