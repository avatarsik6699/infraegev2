# CHANGE 200 — Реквизиты продавца в подвале для Robokassa

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `200` |
| Slug | `footer-requisites` |
| Title | Реквизиты продавца в подвале для Robokassa |
| Status | `archived` |
| Branch | `feature/200-footer-requisites` |

---

## Goal

Robokassa подключает магазин только к сайту, у которого в подвале указаны данные продавца
([требования](https://robokassa.com/content/trebovaniya.php), проверено 2026-10-24). Для
самозанятого это «Самозанятый ФИО (полностью), ИНН», плюс открытый контакт. Сейчас реквизиты есть
только в конце оферты, а SPEC §5 прямо запрещает имя продавца в подвале.

Решение архитектора от 2026-10-24:
- одна мелкая строка в подвале: «Самозанятый Годлевский Владислав Александрович, ИНН 190302795145 ·
  kodumka@mail.ru»;
- без города и без телефона;
- строка видна только при включённой продаже (`BILLING_ENABLED`), как и ссылки «Тарифы»,
  «Оферта» и «Возврат». Пока сайт бесплатный, подвал не меняется.

Так юридическое по-прежнему остаётся в наименее заметной допустимой форме.

---

## Design References

- Подвал `apps/web/src/widgets/public-footer/`: тот же мелкий приглушённый текст, без панели и
  без значков.

---

## Backlog

### Frontend
- [x] `F1` Реквизиты продавца в `siteConfig` (`seller`: ФИО, ИНН). В `PublicFooter` при `billing`
  выводится строка «Самозанятый …, ИНН … · email» со ссылкой `mailto:`. Ширина 375 px: перенос без
  горизонтальной прокрутки. — _Depends on:_ —
- [x] `F2` Unit-тест подвала: при `billing` строка есть, без `billing` её нет. — _Depends on:_ F1

### Docs
- [x] `T1` SPEC §5: вместо «no seller name» — строка реквизитов при включённой продаже (решение
  2026-10-24). В `privacy-legal-checklist.md` добавить требования Robokassa к сайту и где каждое
  выполнено. — _Depends on:_ F1

---

## Files

### Create / modify
~~~
apps/web/src/shared/config/site.ts
apps/web/src/widgets/public-footer/{public-footer.tsx,public-footer.module.css,public-footer.test.tsx}
docs/SPEC.md, docs/runbooks/privacy-legal-checklist.md
~~~

### Do NOT touch
- Оферта `content/legal/oferta/2026-10-23.md`: принятая редакция не меняется.

---

## Contracts

Нет изменений API.

---

## Gate Checks

Затронутые группы web (format, lint, typecheck, unit), `docs-links`; Playwriter: подвал при
выключенной и включённой продаже, ширина 375 и 1280 px.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| b7e911e8+wt | format, web-lint, web-typecheck, docs-links; vitest `tests/public-header.test.tsx` (10) | PASS | ~63 |
| b7e911e8+wt | Playwriter, dev with `BILLING_ENABLED=true`: строка под подвалом на десктопе; на узкой ширине перенос без горизонтальной прокрутки; без продажи строки нет | PASS | — |

---

## Implementation Notes

- Строка — `Typography.Text variant="caption" tone="muted"`: правило lint запрещает голый `<p>`.
- Playwriter в обычном Chrome не меняет ширину окна через `setViewportSize`; узкую ширину
  проверял через CDP `Emulation.setDeviceMetricsOverride`. Самая узкая ширина, которую удалось
  получить, — 469 px; строка там переносится в две, `scrollWidth ≤ innerWidth`. Перенос на 375 px
  обеспечивают `width: 100%` и `overflow-wrap: anywhere`.

---

## Commit Message

```
feat(change-200): seller requisites in the footer for Robokassa
```
