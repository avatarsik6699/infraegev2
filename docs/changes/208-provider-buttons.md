# CHANGE 208 — Кнопки входа VK ID и Яндекс ID

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `208` |
| Slug | `provider-buttons` |
| Title | Кнопки входа VK ID и Яндекс ID |
| Status | `archived` |
| Branch | `feature/208-provider-buttons` |

---

## Goal

Архитектор 2026-10-24: кнопки входа через провайдеров выглядели как ссылки с обводкой. Причины:
- это был `ExternalLink`, со стрелкой «↗» и стилем ссылки;
- кнопки стояли в узкой сетке на три колонки, оставшейся от Telegram;
- вместо логотипов были значки lucide: «облачко» для VK и «лупа» для Яндекса.

Нужны красивые кнопки входа в нашей дизайн-системе и настоящие логотипы.

---

## Backlog

### Frontend
- [x] `F1` `provider-links.tsx`:
  - активный провайдер — `ActionLink` (`presentation="button"`, `hierarchy="secondary"`, полная
    загрузка страницы через `reloadDocument`);
  - недоступный провайдер — общий `Button`;
  - две колонки, на узком экране одна;
  - подпись «Или войдите с помощью», как просит руководство Яндекс ID.

  — _Depends on:_ —
- [x] `F2` `login-method-icon.tsx`: официальные знаки — красный круг с «Я» (из материалов кнопок
  Яндекс ID) и знак VK (simple-icons, `#0077FF`). Тот же значок стоит в списке «Способы входа»
  профиля. — _Depends on:_ —
- [x] `F3` `ActionLink`: в типы добавлены `reloadDocument` и `search: { return_to }`. — _Depends on:_ F1
- [x] `T1` DESIGN.md, раздел Buttons: правило для кнопок провайдеров. — _Depends on:_ F1

---

## Gate Checks

web-lint, web-typecheck, format, vitest. e2e `account.spec.ts` (изолированный раннер). Playwriter:
`/sign-in` с включёнными провайдерами на dev. Детектор impeccable.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 5ef57d75+wt | web-lint, web-typecheck, format; vitest 546/546; e2e `account.spec.ts` 18/18; impeccable detect `[]`; Playwriter `/sign-in`: две кнопки 44 px со знаками, href `/api/auth/providers/{vk,yandex}/start?return_to=%2F` | PASS | ~200 |

---

## Implementation Notes

- По руководству Яндекс ID нельзя менять цвет кнопки и обводки. Поэтому обводка тёмная (ink), а не
  серая, как у обычной вторичной кнопки. Наведение — заливка wash.
- Ссылки на файлы кнопок со страницы документации Яндекса отдают 404. Знак взят из CDN документации
  (`cdn-viewer.diplodoc.com/.../login-with-yandex-8.svg`).

---

## Commit Message

```
feat(change-208): VK ID and Yandex ID sign-in buttons with the providers' marks
```
