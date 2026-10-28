# Billing operations (Change 192)

Paid access is a one-time pass: «Месяц» (30 days) or «Год» (365 days), no auto-renewal, no saved
cards (SPEC §2.2, §6.1). The seller is a самозанятый; Robokassa takes the money and its Робочеки
СМЗ register every receipt in «Мой налог». This runbook covers the flags, routine checks, refunds,
incidents and the НПД limit; the launch checks are in [Launch checklist](#launch-checklist).

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

The app has one password pair. While `ROBOKASSA_TEST=true`, Robokassa signs `IsTest` payments with
the shop's **test** passwords, so `ROBOKASSA_PASSWORD1/2` hold the test pair then. When switching to
`ROBOKASSA_TEST=false`, replace them with the live pair. Password #3 (refunds) is live only.

The shop was created on 2026-10-24 (Change 211):
- shop `kodumka`, status «Новый», activation not yet requested;
- hash SHA256 for live and test;
- the URLs below;
- all five passwords were generated in the shop and kept in athanor (infraegev2 vault:
  `ROBOKASSA_MERCHANT_LOGIN`, `ROBOKASSA_PASSWORD1..3` live, `ROBOKASSA_TEST_PASSWORD1..2`);
- production runs `BILLING_ENABLED=true`, `ROBOKASSA_TEST=true` with the test pair, `PAYWALL_ENABLED=false`;
- the env copy before that is `production.env.pre-billing-2026-10-24`.

Robokassa shop settings: ResultURL `https://kodumka.ru/api/billing/webhooks/robokassa` (POST),
SuccessURL and FailURL `https://kodumka.ru/subscribe/return` (GET), hash algorithm equal to
`ROBOKASSA_HASH`. Notifications come from `185.59.216.65` and `185.59.217.65`; the signature, not
the address, authenticates them.

## Launch checklist

The provider is Robokassa with Робочеки СМЗ: every payment gets a receipt in «Мой налог» and a
refund annuls it, refunds go by API (password #3). The code reaches any provider through
`app/modules/billing/provider/port.py`; Prodamus and CloudPayments are the fallbacks.

Done (2026-10-24/25):
- the paid-access code released with the paywall off;
- the `140_01` → `198_01` migration rehearsed and applied;
- off-site backups running, with a restore check of a `198_01` bundle;
- НПД registration, the shop `kodumka` and Робочеки connected, credentials in
  `/etc/infraege/production.env`, `BILLING_ENABLED=true`, `ROBOKASSA_TEST=true`;
- RKN notification filed, Яндекс ID and VK ID on, the `smotryashchiy` VPS country checked.

Every payment link carries the receipt nomenclature (`Receipt`, one `service` position named
«Доступ к учебным материалам Кодумки на N дней», `tax: none`), and every refund carries the same
position as `InvoiceItems` (Change 229). Without them Робочеки cannot form the receipt or annul it.
The shop's fiscalization is «Робочеки СМЗ — Одобрено ФНС — Активно» since the activation on
2026-10-28.

Test mode (`ROBOKASSA_TEST=true`):
- [ ] a month purchase from the site returns to `/subscribe/return` and opens access; the payment
      page accepts the signed `Receipt`;
- [ ] `journalctl -u infraege-billing-hourly` shows no `billing.notification_rejected`;
- [ ] OpStateExt answers for the test invoice (state codes 5/10/50/100 match); record a real
      response as a fixture in `apps/api/tests/test_robokassa.py`;
- [ ] a refund of the test payment through `admin refund … --amount full` finishes.

Changing a flag or price (Change 232): copy `production.env` first
(`production.env.pre-live-<date>`), edit it as root, then recreate only the API. Its environment is
interpolated from the file, so `restart` keeps the old values:

```bash
current=$(readlink -f /opt/infraege/current)
DEPLOY_SHA=$(basename "$current") docker compose --env-file /etc/infraege/production.env \
  --project-name infraege -f "$current/infra/docker-compose.yml" \
  -f "$current/infra/docker-compose.prod.yml" up --detach --no-deps --wait api
```

Robokassa facts from the 2026-10-28 test purchases (Changes 230, 231):
- it refuses a receipt address with `+`, so the link leaves such an address out;
- it returns the buyer to the shop's SuccessURL unless `SuccessUrl2` is sent;
- `SuccessUrl2` and `FailUrl2` are signed as they are; the URL-encoded form of its example gives
  error 29;
- OpStateExt does not find test operations (code 3), so a test payment cannot be refunded.
- the Refund API takes the JWT as a JSON string; a bare token is `400 BadRequest` (Change 233);
- a refund is paid from the shop balance, which holds payments minus the commission (offer of
  Robokassa, appendix 6). When the balance cannot cover it, the answer is `Support, Refund error
  8401` and the refund becomes `failed`; the first live 1 ₽ payment left 0,96 ₽. Keep a reserve on
  the balance, or refund from the cabinet after topping it up.

Live (after Robokassa activates the shop, `ROBOKASSA_TEST=false`, live password pair):
- [ ] a real 1 ₽ purchase (temporary `BILLING_MONTH_PRICE_KOPECKS=100`): the receipt appears in «Мой
      налог» and in the buyer's mail;
- [ ] its full refund: the receipt is annulled in «Мой налог»;
- [ ] real prices restored, API restarted;
- [ ] announce the paid part for the topics that are free today, then `PAYWALL_ENABLED=true`.

The offer, refund rules and privacy text were not reviewed by a lawyer (architect's decision,
2026-10-18, confirmed 2026-10-23). Any change to the offer after the first payment is a new dated
file in `content/legal/oferta/`; an accepted edition is never edited. Legal status:
[docs/legal](../legal/README.md).

## What runs on its own

- `infraege-billing-hourly.timer` → `scripts/billing-jobs.sh hourly`: asks the provider about
  payments without a notification, expires orders left unpaid for an hour, finishes pending
  refunds, sends the «доступ заканчивается» notice three days before access ends.
- `infraege-billing-daily.timer` → `scripts/billing-jobs.sh daily`: compares the last three days of
  payments with the provider and mails the operator on any mismatch; checks the НПД limit.
- Both are no-ops while `BILLING_ENABLED` is off. Logs: `journalctl -u infraege-billing-hourly`
  (events `billing.*`, ids and amounts only, no emails).

## Business summary (Change 195)

The hourly timer, also while billing is off, writes `/var/lib/infraege/business/summary.json`
(root, mode 640) from `admin export`: orders → payments → refunds by day and plan for 90 days,
registrations by day with paying accounts, active access and access ending within 7 days, the НПД
year income and limit, stuck orders (created or pending over 2 hours) and requested/pending/failed
refunds. The daily timer keeps its last provider reconciliation in `reconcile.json` beside it, and
the hourly summary carries it as `reconcile`. The file holds counts and sums only. The
`smotryashchiy` agent on this host reads it and ships it to the monitoring «Продажи» view
([production](production.md#host-monitoring-agent-smotryashchiy)). A failed export fails the
hourly unit (`journalctl -u infraege-billing-hourly`).

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
| `refunds` | `open`: requested, pending and failed refunds (account deletions create requested ones); `remainder_receipts`: partial refunds of 30 days with the receipt left to issue (Change 232) |
| `funnel [--days N]` | orders of the last N Moscow days (default 30) by day and plan: paid, failed, open, refunded and the money kept — the payment conversion (Change 194) |
| `execute --refund ID` | send a requested or failed refund to the provider |
| `refund-paid --refund ID --note TEXT` | Change 237: record a requested or failed refund the operator paid by hand ([Refund by hand](#refund-by-hand-change-237)) |
| `revenue [--year YEAR]` | НПД income of a Moscow calendar year and its share of the limit |
| `signals [--days N]` | Change 198: accounts above a sharing or downloading threshold, numbers only; no measure is automatic |
| `warn` / `suspend --days N` / `terminate` / `lift [--compensate]` (`--user ID` or `--email A`) | Change 198: the graded manual measures of offer section 6 and their lifting — procedure in [accounts](accounts.md#ограничения-change-198) |
| `operator KIND` (args JSON on stdin) | Change 199: the console's form of `warn`, `suspend`, `terminate`, `lift`, `refund_execute`, `account_show`; one JSON object out, a refusal is `{"error": …}` with exit 2. Normally run by `scripts/operator-command.sh` for the sre.infraege.ru console |
| `export-operator` | Change 199: the `kodumka.operator/1` report (signals, running measures, open refunds and, Change 232, `remainder_receipts`); `scripts/operator-export.sh` writes it every ten minutes |

A refund is idempotent by payment, reason and amount: repeating the command does not pay twice.
Robokassa finishes refunds asynchronously; the hourly job records the result and mails the buyer.
The receipt correction belongs to Робочеки; if it did not happen, annul the receipt in «Мой
налог» by hand and note it here.

## Refund requests by mail

1. Find the buyer with `show --email` (the address the mail came from: the account's own or,
   Change 228, the receipt address of a payment — a VK ID or Яндекс ID buyer has only that).
2. Choose the amount: `auto` for the buyer's own refusal, `full` for a parent's request or a
   technical failure on our side.
3. Run `refund`, answer the buyer with the amount and the bank's usual timing (up to 10 days).

## Refund money and the receipt for the rest (Change 232)

- A refund is paid from the shop balance, which holds payments minus Robokassa's commission. No
  reserve is kept there (the architect's decision, 2026-10-28) and automatic payout is off. A
  refund the balance cannot cover fails with `Support, Refund error 8401`; the operator gets the
  «Возврат не прошёл» mail with the reason. Wait for payments and run `execute --refund ID` (or
  «Выполнить» in the console), or return the money by hand (below), within the 10 days of ЗоЗПП
  ст. 31.
- The commission is not withheld from a refund: ЗоЗПП ст. 32 and ГК ст. 782 let the seller keep
  only the expenses of performing the contract, and the commission pays for taking the money.
  The lawful reduction is `auto`: the buyer pays for the days already used.
- A partial refund (`auto`, or any sum below the payment) makes Робочеки annul the payment's whole
  НПД receipt; no receipt for the rest is made (Robokassa support, 2026-10-28). When it
  succeeds, the operator gets «Выдайте чек на остаток в «Мой налог»» with the service name, the
  sum, the payment date and the receipt address. In «Мой налог»: «Новая продажа», that name and
  sum, buyer a physical person, the payment date as the sale date, then send the receipt to that
  address. `refunds` and the console's report list such payments for 30 days
  (`remainder_receipts`); there is no mark for an issued one, so check «Мой налог» before
  issuing.
- A full refund annuls the receipt and needs nothing more.

### Refund by hand (Change 237)

When Robokassa cannot pay a refund (8401) and waiting is not an option:

1. Ask the buyer by mail for the details to send the money to (card number or bank account) and
   keep the reply: returning money another way than it was paid needs the buyer's consent.
2. Transfer the refund sum from your own account.
3. `admin refund-paid --refund ID --note «перевод на карту …1234, 29.10»`. The refund becomes
   `succeeded` without a provider call, access by that payment ends, the buyer gets «Возврат
   оплаты Кодумки», and the operator gets «Аннулируйте чек в «Мой налог»». The command refuses a
   `pending` refund (Robokassa already took it) and a `succeeded` one.
4. In «Мой налог» annul the payment's receipt with the reason «Возврат средств»: Робочеки do not
   know about this refund. For a partial refund then issue the receipt for the rest as above; the
   mail names its sum.

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
| `billing.settle_unavailable` / `billing.refund_state_unavailable` | the next hourly run asks again. `reason` names the cause (Change 240): `HTTP 5xx` or `Robokassa status error N` is Robokassa's side; `ConnectTimeout`, `ConnectError … SSL` is the network. Repeats over several hours: check `curl -4 -w '%{time_appconnect}' https://auth.robokassa.ru/` from the host, then ask Robokassa support with the times |
| `billing.reconcile_mismatch` mail | compare the listed invoices in the shop; a refund made in the shop by hand must also be recorded here (`refund … --reason operator`) |
| «Возврат не прошёл» mail, `billing.refund_failed` | the reason is Robokassa's; 8401 = the balance cannot cover the refund with its commission: wait for payments and `execute --refund ID`, or pay it by hand and `refund-paid` (Changes 232, 237) |
| «Выдайте чек на остаток» mail, `billing.remainder_receipt_due` | issue the receipt for the rest in «Мой налог» as described in [Refund money](#refund-money-and-the-receipt-for-the-rest-change-232) |
| `billing.npd_limit_pause` | new checkouts are refused at 95 % of the НПД limit; access already bought continues. Decide with the architect: wait for the new year or move to ИП (a separate project: new offer, new contract) |

## Backups

Billing rows live in the application database and its Restic backups. They are legal evidence
(offer acceptances, payments, refunds): enabling paid access requires off-site backup storage and a
restore proof that includes these tables (SPEC §8.2, §11).
