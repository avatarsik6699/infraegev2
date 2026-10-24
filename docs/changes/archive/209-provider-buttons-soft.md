# CHANGE 209 — Кнопки входа VK ID и Яндекс ID без обводки

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `209` |
| Slug | `provider-buttons-soft` |
| Title | Кнопки входа VK ID и Яндекс ID без обводки |
| Status | `archived` |
| Branch | `feature/209-provider-buttons-soft` |

---

## Goal

Архитектор 2026-10-24, после Change 208: обводка на кнопках провайдеров не нравится. Кнопки должны
быть в стиле без обводки. Берём soft-кнопку дизайн-системы: заливка wash, прозрачная граница. Это
соответствует светлому варианту кнопки Яндекс ID (серая заливка, без обводки).

---

## Backlog

### Frontend
- [x] `F1` `provider-links.tsx`: `hierarchy="soft"` у `ActionLink` и `Button`; в типы `ActionLink`
  добавлен `soft` (стиль уже есть в `button.module.css`). CSS: убрана тёмная обводка, осталась
  ширина. — _Depends on:_ —
- [x] `T1` DESIGN.md, раздел Buttons: правило Provider sign-in переписано на soft. — _Depends on:_ F1

---

## Gate Checks

web-lint, web-typecheck, format, docs-links, vitest, e2e `account.spec.ts`, Playwriter `/sign-in`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| c347321c+wt | web-lint, web-typecheck, format, docs-links; vitest 546/546; e2e `account.spec.ts` 18/18 (изолированный раннер); Playwriter dev `/sign-in`: обе кнопки `hierarchy=soft`, граница `rgba(0,0,0,0)`, высота 44 px, ошибок консоли нет | PASS | ~260 |

---

## Implementation Notes

- Во время проверки Docker Desktop был остановлен. Временно запущенные вне Docker API и Vite
  остановлены по просьбе архитектора, проверка повторена на штатном dev-стеке (`make dev`).

---

## Commit Message

```
feat(change-209): borderless soft sign-in buttons for VK ID and Yandex ID
```
