# Verification pilot after Change 146

## Start and ownership

Start with the first five real changes locally shipped after 146. This table is a collection
template, not evidence of savings, and does not require opening five changes concurrently.
The integrating work/ship agent adds one row at closure; the architect reviews the five-row result.
Keep the pre-activation compatibility boundary until remote audit/import/notification proof exists.

## Measurement contract

- Identify the change, local ship SHA, risk classes and exact external gate report filenames.
- Record wall time, setup time, summed command time, executed/reused check counts, failures and
  retries from reports. Concurrent command time is not wall time. Never count a reused check as
  freshly executed, or reset its original observation timestamp.
- Record browser runs, builds and environment restarts separately, with the reason for repeats.
- Compare old/new **plans**, not two executed pipelines. Estimated avoided commands are not
  measured minutes saved. Missing historical durations remain `unknown`.
- Record regressions escaped, false positives, setup failures and manual intervention. Record model
  cost only from actual usage evidence; do not estimate it from wall time or a model label.
- Do not attach credentials, raw mail, answers, scanner source excerpts, or browser storage.

| Change / ship SHA | Risk / report IDs | Wall / setup / command ms | Executed / reused | Browser / builds / restarts | Failures / retries / false positives | Escaped defects / intervention |
|---|---|---|---|---|---|---|
| 1 — pending | | | | | | |
| 2 — pending | | | | | | |
| 3 — pending | | | | | | |
| 4 — pending | | | | | | |
| 5 — pending | | | | | | |

## Review and rollback

After five rows, compare observed cost within comparable risk classes and investigate every
escaped auth/data/security regression. Retain correct focused coverage even if slower. Disable
reuse or parallelism for a check whose ownership/isolation is unproven; keep the sequential
fresh-check path. If periodic reports are absent, stale, failed or untrusted, restore the legacy
delivery coverage rather than treating the audit as green. No pilot result authorizes deploy.
