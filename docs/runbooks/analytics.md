# Analytics operations

## Ownership

infraegev2 owns consent, first-party event production, Nginx classification inputs and the
Umami/Beszel lifecycle. sre-kit owns Projects, Source credentials, ingestion, retention, alerts and
all operator dashboards. Neither repository imports the other's code.

## Browser analytics

The Umami script must not appear in SSR HTML. `analytics-consent` loads it only after the stored
`granted` choice; `denied` leaves learning behavior unchanged. Withdrawal stores `denied`, removes
the script and reloads the document to clear already-installed runtime hooks. Product events are
accepted only by the TypeScript union in `features/product-analytics`; never add answers, arbitrary
text, URL query/hash or fingerprint material.

## Target aggregate batch

`ops/observability/build-traffic-telemetry.py` reads JSON request summaries from stdin and produces
a sre-kit schema `1.0` batch. It ignores IP/request identifiers and emits only counts labeled by
clean path, status family and one of `known_bot`, `suspected_automation`, `unclassified`. Server
logs cannot prove browser consent and therefore never emit `browser_analytics`; that fourth class
belongs only to consented Umami records. Treat every class as a signal category, not an identity or
proof of personhood.

Create the `infraegev2` Project and push Source using
`ops/observability/sre-kit-sources.example.json`. Generate/rotate the Source token in sre-kit,
store it in the protected target environment, and send each batch with a unique
`Idempotency-Key`. Do not commit the token. Failed batches may be retried with the same key.

## Retention and legal checks

journald remains bounded to 30 days/1 GB. Umami retention remains 13 months. sre-kit keeps raw
telemetry 30 days and hourly metric rollups 13 months. Before broadening fields or events, update
`/privacy`, reassess consent, localization and Roskomnadzor notification requirements, and obtain
appropriate legal review.
