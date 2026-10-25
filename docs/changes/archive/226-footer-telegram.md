# CHANGE 226 — Подвал: канал Telegram и ссылки без стрелок

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `226` |
| Slug | `footer-telegram` |
| Title | Подвал: канал Telegram и ссылки без стрелок |
| Status | `archived` |
| Branch | `feature/226-footer-telegram` |

---

## Goal

Находки архитектора 2026-10-25:
- у канала новый адрес — `https://t.me/kodumka`;
- несколько ссылок со стрелками подряд выглядят неприятно. Ссылки, стоящие рядом, идут без стрелок.

Проверено, кода не требует: кнопки «Подсказка» и «Решение» на `/practice` не пропали. Их нет у 5187
задач, импортированных с КЕГЭ (Change 188): в банке у них пустые `hint` и `explanation`. У всех 547
авторских задач кнопки на месте (прод, `0057847f`).

---

## Backlog

### Frontend
- [x] `T1` `siteConfig.telegramChannelUrl` = `https://t.me/kodumka` (было приглашение по ссылке). — _Depends on:_ —
- [x] `T2` Ссылки подвала «Обработка данных», «Тарифы», «Оферта», «Возврат» и «Telegram-канал» — без
  стрелок: `ActionLink icon="none"`, у `ExternalLink` новый `icon="none"`. — _Depends on:_ —
- [x] `T3` `public-header.test.tsx`: адрес канала, в `nav` подвала нет стрелок (с продажами и без). — _Depends on:_ T1, T2

---

## Gate Checks

`format`, `web-lint`, `web-typecheck`; vitest `tests/public-header.test.tsx`. Playwriter: подвал на
локальном стеке.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 87695187+wt | format, web-lint, web-typecheck; vitest public-header (10); Playwriter подвал 1280 | PASS | 60 |

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-226): footer links without arrows, Telegram channel address
```
