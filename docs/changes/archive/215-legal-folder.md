# CHANGE 215 — Юридические документы в одной папке

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `215` |
| Slug | `legal-folder` |
| Title | Юридические документы в одной папке |
| Status | `archived` |
| Branch | `feature/215-legal-folder` |

---

## Goal

Просьба архитектора от 2026-10-25: собрать все документы, акты и памятки юридической части в
одном месте. Папка `docs/legal/`:
- памятка и акт перенесены сюда;
- в оглавлении `README.md` ссылки на опубликованные тексты (они остаются в коде, их собирает
  сборка), на то, что хранится вне репозитория, на связанные runbook-и и решения, а также
  оставшиеся шаги.

---

## Backlog

### Docs
- [x] `T1` `git mv` `docs/runbooks/privacy-legal-checklist.md` и `harm-assessment-act.md` в `docs/legal/`.
  Ссылки исправлены в SPEC, `accounts.md`, `billing.md` и самой памятке. — _Depends on:_ —
- [x] `T2` `docs/legal/README.md` — оглавление. — _Depends on:_ T1

---

## Gate Checks

docs-links, format.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 1bfdcf49+wt | docs-links, format | PASS | 27 |

---

## Implementation Notes

В архивных change-файлах старые пути `docs/runbooks/…` остаются как история.

---

## Commit Message

```
docs(change-215): legal documents in one folder
```
