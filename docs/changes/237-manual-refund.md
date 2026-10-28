# CHANGE 237 — Возврат вручную, когда Robokassa не может вернуть

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `237` |
| Slug | `manual-refund` |
| Title | Возврат вручную, когда Robokassa не может вернуть |
| Status | `active` |
| Branch | `feature/237-manual-refund` |

---

## Goal

Robokassa возвращает деньги только с баланса магазина (договор, приложение 6). Если баланса не
хватает, она отвечает `Support, Refund error 8401` (Change 232). Решение архитектора от 2026-10-28:
резерв на балансе не держим, вместо этого делаем запасной путь.
- Оператор возвращает деньги сам, переводом на реквизиты, которые покупатель прислал письменно.
  Возврат другим способом, чем оплата, допустим с согласия потребителя.
- Затем аннулирует чек в «Мой налог» и при частичном возврате выдаёт чек на остаток. Робочеки при
  этом не участвуют.
- Наконец отмечает возврат в Кодумке.

---

## Backlog

### Backend
- [ ] `B1` `admin refund-paid --refund ID --note TEXT`: возврат `requested` или `failed` становится
  `succeeded` без запроса к провайдеру.
  - `provider_ref` = `manual:<note>`, доступ по оплате заканчивается, полный возврат переводит
    оплату в `refunded`;
  - `pending` и `succeeded` команда отвергает: Robokassa уже взялась или деньги уже вернулись;
  - журнал `billing.refund_paid_manually`. — _Depends on:_ —
- [ ] `B2` Письма после ручного возврата.
  - Покупателю — обычное «Возврат оплаты Кодумки».
  - Оператору — «Аннулируйте чек в «Мой налог»»: дата оплаты и сумма, а при частичном возврате ещё
    чек на остаток (наименование, сумма, адрес). Робочеки тут ничего не делают, письмо о Робочеках
    (232 B3) не отправляется.
  - Письмо «Возврат не прошёл» для 8401 называет и этот путь. — _Depends on:_ B1
- [ ] `B3` Тесты в `test_billing.py`: отказ 8401 → `refund-paid` → оба письма, доступ закрыт; повторная
  отметка и отметка `pending` отвергнуты. — _Depends on:_ B1, B2
- [ ] `B4` `billing.md`: порядок ручного возврата (письменная просьба покупателя с реквизитами,
  перевод, аннулирование чека, чек на остаток, `refund-paid`), строка в таблице CLI и в «Incidents».
  — _Depends on:_ B1, B2

---

## Files

### Create / modify
~~~
apps/api/app/modules/billing/{service,admin,notices}.py, apps/api/tests/test_billing.py,
docs/runbooks/billing.md
~~~

### Do NOT touch
- Схема БД; провайдер Robokassa; консоль smotryashchiy (ручной возврат — только CLI).

---

## Contracts

See [billing runbook](../runbooks/billing.md).

---

## Gate Checks

pytest `test_billing.py`, `test_operator_cli.py`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|

---

## Implementation Notes

---

## Commit Message

```
feat(change-237): refund paid by the operator when Robokassa cannot
```
