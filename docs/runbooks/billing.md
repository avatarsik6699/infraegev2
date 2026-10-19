# Billing operations (Change 192)

Paid access is a one-time pass: «Месяц» (30 days) or «Год» (365 days), no auto-renewal, no saved
cards (SPEC §2.2, §6.1). The seller is a самозанятый; Robokassa takes the money and its Робочеки
СМЗ register every receipt in «Мой налог». This runbook covers the flags, routine checks, refunds,
incidents and the НПД limit. Provider questions and the launch checks are in
[billing-provider-selection](billing-provider-selection.md).

## Flags and settings

All live in `/etc/infraege/production.env` (mode 600) and take effect after the API restarts; no
code release is needed.

| Key | Meaning |
|---|---|
| `BILLING_ENABLED` | checkout and provider notifications; off = `/api/billing/checkout` answers 404 |
| `PAYWALL_ENABLED` | paid text and tasks need access; requires `BILLING_ENABLED` (the API refuses to start otherwise) |
| `BILLING_PROVIDER` | `robokassa` in production; the fake provider is refused there |
| `BILLING_MONTH_PRICE_KOPECKS`, `BILLING_YEAR_PRICE_KOPECKS` | prices in kopecks (490 ₽ = `49000`); a new price applies to new orders only |
| `BILLING_OPERATOR_EMAIL` | where reconciliation and НПД alerts go |
| `ROBOKASSA_MERCHANT_LOGIN`, `ROBOKASSA_PASSWORD1..3`, `ROBOKASSA_HASH`, `ROBOKASSA_TEST` | shop credentials; password #3 signs refunds; `ROBOKASSA_TEST=true` until the live check passes |

Turn on in this order: `BILLING_ENABLED=true` with `ROBOKASSA_TEST=true` → test payments → live
1 ₽ check → `ROBOKASSA_TEST=false` → announcement period → `PAYWALL_ENABLED=true`. Turning the
paywall off again makes everything free at once; grants are kept.

Robokassa shop settings: ResultURL `https://kodumka.ru/api/billing/webhooks/robokassa` (POST),
SuccessURL and FailURL `https://kodumka.ru/subscribe/return` (GET), hash algorithm equal to
`ROBOKASSA_HASH`. Notifications come from `185.59.216.65` and `185.59.217.65`; the signature, not
the address, authenticates them.

## Launch checklist

1. Release the paid-access code with both flags off; production stays free. Before that deploy,
   rehearse the `140_01` → `192_01` migration on the production host and keep its attestation
   ([backup-restore](backup-restore.md), «Change 192»).
2. Off-site backups are running and a restore check of a `192_01` bundle has passed (billing rows
   are evidence, see «Backups»).
3. Register as самозанятый, connect the Robokassa shop and Робочеки СМЗ, put the credentials into
   `/etc/infraege/production.env` ([billing-provider-selection](billing-provider-selection.md)).
4. `BILLING_ENABLED=true`, `ROBOKASSA_TEST=true`: run the test-mode checks; then the live 1 ₽
   payment and refund with both receipts visible in «Мой налог».
5. Announce the paid part for the topics that are free today, then `PAYWALL_ENABLED=true`.
6. The offer, refund rules and privacy text were not reviewed by a lawyer (architect's decision,
   2026-10-18). Any change to the offer after the first payment is a new dated file in
   `content/legal/oferta/`; an accepted edition is never edited.

## What runs on its own

- `infraege-billing-hourly.timer` → `scripts/billing-jobs.sh hourly`: asks the provider about
  payments without a notification, expires orders left unpaid for an hour, finishes pending
  refunds, sends the «доступ заканчивается» notice three days before access ends.
- `infraege-billing-daily.timer` → `scripts/billing-jobs.sh daily`: compares the last three days of
  payments with the provider and mails the operator on any mismatch; checks the НПД limit.
- Both are no-ops while `BILLING_ENABLED` is off. Logs: `journalctl -u infraege-billing-hourly`
  (events `billing.*`, ids and amounts only, no emails).

## Routine checks

- After enabling: `journalctl -u infraege-billing-daily --since today` shows `billing.jobs_done`.
- Monthly: `admin revenue` (below) against the «Мой налог» income for the same months.

## Operator CLI

Run inside the API container of the current release:

```bash
docker compose --env-file /etc/infraege/production.env --project-name infraege \
  -f /opt/infraege/current/infra/docker-compose.yml -f /opt/infraege/current/infra/docker-compose.prod.yml \
  exec -T api /app/.venv/bin/python -m app.modules.billing.admin <command>
```

| Command | Use |
|---|---|
| `show --email ADDRESS` | a buyer's payments, statuses and access periods |
| `refund --payment ID --amount auto --reason buyer` | refund of unused whole days (ЗоЗПП ст. 32); access ends now |
| `refund --payment ID --amount full --reason guardian` | a parent's request for a minor's purchase: the full price |
| `refund --payment ID --amount KOPECKS --reason operator` | any other agreed sum |
| `refunds` | requested, pending and failed refunds (account deletions create requested ones) |
| `execute --refund ID` | send a requested or failed refund to the provider |
| `revenue [--year YEAR]` | НПД income of a Moscow calendar year and its share of the limit |

A refund is idempotent by payment, reason and amount: repeating the command does not pay twice.
Robokassa finishes refunds asynchronously; the hourly job records the result and mails the buyer.
The receipt correction belongs to Робочеки; if it did not happen, annul the receipt in «Мой
налог» by hand and note it here.

## Refund requests by mail

1. Find the buyer with `show --email` (the address of the account the mail came from).
2. Choose the amount: `auto` for the buyer's own refusal, `full` for a parent's request or a
   technical failure on our side.
3. Run `refund`, answer the buyer with the amount and the bank's usual timing (up to 10 days).

## Account deletion

Deleting an account ends its access, creates `requested` refunds for the unused days and removes
the contact email from payments; payment, grant, refund and offer-acceptance rows stay without the
account link (5-year retention, SPEC §3). Run `refunds`, then `execute` each new one.

## Incidents

| Symptom | Action |
|---|---|
| Buyer paid, access not open | `show --email`: a `pending` payment is settled by the next hourly run; run `scripts/billing-jobs.sh hourly` now. A `failed` one with money taken: check the shop's operation list, then refund or settle by hand with the architect |
| `billing.amount_mismatch` in logs | the provider reported another sum: never grant; check the operation in the shop and refund |
| `billing.notification_rejected` repeatedly | password #2 or the hash algorithm differs from the shop settings |
| Webhook endpoint down for hours | nothing is lost: Robokassa retries and the hourly job asks for every open payment |
| `billing.reconcile_mismatch` mail | compare the listed invoices in the shop; a refund made in the shop by hand must also be recorded here (`refund … --reason operator`) |
| `billing.npd_limit_pause` | new checkouts are refused at 95 % of the НПД limit; access already bought continues. Decide with the architect: wait for the new year or move to ИП (a separate project: new offer, new contract) |

## Backups

Billing rows live in the application database and its Restic backups. They are legal evidence
(offer acceptances, payments, refunds): enabling paid access requires off-site backup storage and a
restore proof that includes these tables (SPEC §8.2, §11).
