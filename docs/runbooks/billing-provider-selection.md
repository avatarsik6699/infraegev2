# Payment provider: choice and launch checks (Change 192)

Requirement for a самозанятый seller: every payment gets a receipt in «Мой налог» without manual
work, a refund annuls or corrects it, and refunds can be made by API. ЮKassa's API documentation
leaves receipts of a самозанятый manual, so the choice is **Robokassa** with Робочеки СМЗ. Without
auto-renewal no recurring payments are needed. Prodamus and CloudPayments are the fallbacks; the
code reaches any provider through `app/modules/billing/provider/port.py`.

## Questions for Robokassa support (before connecting)

- [ ] Connecting a самозанятый: documents, timing, the contract.
- [ ] Робочеки СМЗ: a receipt for every payment and an annulment on a refund, with no `Receipt`
      field from us? If the field is required, which values for a service of НПД.
- [ ] Commission for cards and СБП; settlement timing.
- [ ] Refund API for a самозанятый: is password #3 available; refund timing.
- [ ] Test mode: do test payments reach ResultURL and OpStateExt?

## Shop settings

- ResultURL `https://infraege.ru/api/billing/webhooks/robokassa`, method POST.
- SuccessURL and FailURL `https://infraege.ru/subscribe/return`, method GET.
- Hash algorithm SHA-256 (`ROBOKASSA_HASH=sha256`).
- Passwords #1, #2 and #3 (test and live pairs differ) only in `/etc/infraege/production.env`.

## Test-mode checks (`ROBOKASSA_TEST=true`, `BILLING_ENABLED=true`, paywall off)

- [ ] A month purchase from the site returns to `/subscribe/return` and opens access.
- [ ] `journalctl -u infraege-billing-hourly` shows no `billing.notification_rejected`.
- [ ] OpStateExt answers for the test invoice (the adapter's state codes 5/10/50/100 match the
      shop's answers); record a real response as a fixture in `apps/api/tests/test_robokassa.py`.
- [ ] A refund of the test payment through `admin refund … --amount full` finishes.

## Live check (`ROBOKASSA_TEST=false`)

- [ ] A real 1 ₽ purchase (temporary `BILLING_MONTH_PRICE_KOPECKS=100`): the receipt appears in «Мой
      налог» and in the buyer's mail.
- [ ] Its full refund: the receipt is annulled in «Мой налог».
- [ ] Restore the real prices, restart the API.
