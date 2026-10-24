# CHANGE 213 — Согласие 14+, акт оценки вреда, памятка РКН

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `213` |
| Slug | `minor-consent` |
| Title | Согласие 14+, акт оценки вреда, памятка РКН |
| Status | `archived` |
| Branch | `feature/213-minor-consent` |

---

## Goal

Решение архитектора от 2026-10-25, принято до отправки уведомления в РКН и до включения боевой
оплаты:
- согласие на обработку ПДн содержит заявление пользователя, что ему исполнилось 14 лет, а младше
  14 лет согласие даёт законный представитель; форма и надпись у галочки не меняются;
- составлен акт оценки вреда по приказу РКН № 178;
- памятка дополнена поручениями, сроками изменений, правилами для ИП, журналом обращений и
  правилом для зарубежных ресурсов.

---

## Backlog

### Site
- [x] `T1` `/consent` — версия `2026-10-25`: фраза о 14+ в абзаце согласия. Версия обновлена в
  `ConsentVersion`, `CONSENT_VERSION`, `contracts/openapi.json`, `schema.ts` и тестах. — _Depends on:_ —
- [x] `T2` `/privacy` — редакция 25.10.2026: та же фраза в разделе «Для несовершеннолетних». —
  _Depends on:_ —

### Docs
- [x] `T3` `SPEC.md` § Юридическое: заявление о 14+ в согласии. — _Depends on:_ T1
- [x] `T4` `harm-assessment-act.md`: акт по приказу РКН от 27.10.2022 № 178. Степень — высокая:
  несовершеннолетние бывают стороной договора (п. 2.1). — _Depends on:_ —
- [x] `T5` `privacy-legal-checklist.md`:
  - поручение только Yandex Cloud (DPA); serv.host — не обработчик;
  - правило для зарубежных ресурсов и CSP;
  - проверка дубля в реестре;
  - изменения до 15-го числа, прекращение — 10 рабочих дней;
  - ИП;
  - § 4a акт, § 4b журнал обращений;
  - пункт в § 7. — _Depends on:_ T4

### Ops
- [x] `T6` `/root/rkn-evidence-2026-10-25.txt` на production (600, без IP и email):
  - 2 аккаунта, оба оператора;
  - 2 регистрации в журналах nginx: 26.09 и 24.10;
  - 0 оплат и 0 принятий оферты;
  - журналы с 26.09.2026;
  - 3 502 адреса, из них 1 961 с браузерным user-agent. — _Depends on:_ —

---

## Gate Checks

Группы `format`, `python-format`, `web-lint`, `web-typecheck`, `api-lint`, `api-typecheck`,
`docs-links`, `api-contract` и прицельный pytest по тестам с версией согласия. E2E не нужен:
`account.page.ts` только передаёт версию через API, это покрыто pytest.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 9c0e3236+wt | format, python-format, web-lint, web-typecheck, api-lint, api-typecheck, docs-links, api-contract | PASS | 77 |
| 9c0e3236+wt | pytest: registration consent, auth guest, mail resend, provider email, billing refund (5) | PASS | 162 |

---

## Implementation Notes

Согласия, данные до 2026-10-25, остаются в силе. Под прежней редакцией регистрировался только
оператор.

---

## Commit Message

```
feat(change-213): consent states 14+ or guardian consent; harm assessment act
```
