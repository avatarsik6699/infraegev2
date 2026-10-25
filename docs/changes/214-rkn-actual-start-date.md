# CHANGE 214 — Фактическая дата начала обработки в уведомлении РКН

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `214` |
| Slug | `rkn-actual-start-date` |
| Title | Фактическая дата начала обработки в уведомлении РКН |
| Status | `done` |
| Branch | `feature/214-rkn-actual-start-date` |

---

## Goal

Решение архитектора от 2026-10-25 заменяет решение Change 212. В уведомлении РКН датой начала
обработки указывается **10.08.2026** — первый публичный деплой. С этого дня nginx записывает IP
посетителей. Подача поздняя, но добровольная и до запуска. Объяснение для РКН строится на фактах
из сводки `/root/rkn-evidence-2026-10-25.txt` (КоАП ст. 2.9, 4.2).

---

## Backlog

### Docs
- [x] `T1` `privacy-legal-checklist.md` § 4: дата 10.08.2026, объяснение на случай запроса, условие
  «ученикам и боевой оплате — только после отправки». — _Depends on:_ —

### Ops
- [x] `T2` Заголовок сводки `/root/rkn-evidence-2026-10-25.txt` указывает решение Change 214. —
  _Depends on:_ —

---

## Gate Checks

docs-links.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 1574e84c+wt | docs-links | PASS | 1 |

---

## Implementation Notes

None

---

## Commit Message

```
docs(change-214): RKN notice states the actual start date 10.08.2026
```
