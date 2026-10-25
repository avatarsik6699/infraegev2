# CHANGE 220 — Документация: факты, остатки стенда, SPEC

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `220` |
| Slug | `docs-compaction` |
| Title | Документация: факты, остатки стенда, SPEC |
| Status | `done` |
| Branch | `feature/220-docs-compaction` |

---

## Goal

Третий блок комплексного аудита (план архитектора от 2026-10-25):
- исправить утверждения, которые расходятся с кодом;
- убрать описание удалённого стенда из runbook-ов;
- сжать историю в SPEC до текущих требований со ссылками;
- удалить устаревшие документы и осиротевшие артефакты.

Код не меняется, кроме двух комментариев со ссылкой на runbook.

---

## Backlog

### Facts
- [x] `T1` Исправлены расхождения с кодом:
  - STACK: Vite 8.2.4, Alembic `198_01`;
  - README: бренд, 30 уроков Python и курс Excel, `198_01`;
  - `practice.md`: `198_01`;
  - `backup-restore.md`: переход `140_01` → `198_01` выполнен 2026-10-24;
  - PRODUCT: оплата в продукте, бренд Кодумка;
  - `verification.md`: правило про архив стенда;
  - `accounts.md`: заголовок и строка о РКН;
  - `docs/legal`: заголовок § 4 и строка 216. — _Depends on:_ —

### Stand remnants
- [x] `T2` `lesson-pipeline.md` (103 → 78 КБ):
  - убраны структура файлов стенда, команды удалённых инструментов и этап 9 (перенос);
  - этапы 7–8 описаны для сайта;
  - сохранены правила содержания, перечень блоков сайта и правила задач.

  `lesson-authoring.md` больше не ссылается на этап 9 и экспорт; `lesson-wave.md` удалён; строка
  Document Roles в AGENTS обновлена; ссылка `lesson-review.md` ведёт в архив 197. — _Depends on:_ —

### Billing
- [x] `T3` `billing-provider-selection.md` влит в `billing.md` § Launch checklist: выполненные
  шаги отмечены, проверки тестового и боевого режима остались. Ссылки в `robokassa.py` и
  `test_robokassa.py` обновлены. — _Depends on:_ —

### SPEC
- [x] `T4` SPEC v2.36 (118 → 95 КБ). Изменено:
  - §1.3 — текущие границы;
  - §2.3 — короткий порядок без нарратива о стенде;
  - §5 — визуальная система, уроки и каталоги сведены к правилам со ссылками на DESIGN и FRONTEND;
  - §6.1 — без экспорта стенда;
  - §7.3 — операции;
  - §8.2 — наблюдаемость, бэкапы и 152-ФЗ со ссылками на runbook-и и `docs/legal`;
  - §9 Roadmap и §11 — текущие открытые пункты. — _Depends on:_ —

### Runbooks and artifacts
- [x] `T5` Runbook-и и артефакты:
  - `production.md`: «Domain move» и «Retired operations stack» сведены к текущим фактам и
    требованиям к новому хосту;
  - Alerts: GitHub выполняет `uptime.yml` раз в 2–5 часов;
  - KNOWN_GOTCHAS: `ERR_PNPM_VERIFY_DEPS_BEFORE_RUN`, реестр практики без стенда;
  - удалены осиротевшие `references/pricing/`, `course-illustration-prompts.md`,
    `release-readiness.md`, `lessons/Python_podrobny_uchebnik.html`. — _Depends on:_ —

---

## Gate Checks

docs-links, format, api-lint (комментарии в Python).

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| a1fbfeb5+wt | format, docs-links, api-lint | PASS | 30 |

---

## Implementation Notes

Дубли правил в AGENTS (gates, `make clean`, Playwriter) оставлены. AGENTS — обязательная точка
входа агента, правило должно быть видно там без перехода; полные версии живут в STACK и
`verification.md`. Удалённые документы попадут в снимок истории Change 221.

---

## Commit Message

```
docs(change-220): facts, stand remnants and a leaner SPEC
```
