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
store it in a protected mode-600 local file, and send each batch with a unique
`Idempotency-Key`. Do not commit the token. Failed batches may be retried with the same key.

## Continuous delivery

The primary production path is the system publisher on the dedicated management VPS. Source
reconciliation installs its mode-600 loopback credentials and one-minute systemd timer:

```bash
make sre-management ACTION=sources
make sre-management ACTION=status
```

It reads the production Nginx journal through the dedicated WireGuard peer, persists only an
opaque cursor under `/var/lib/infraege-sre-kit`, and posts sanitized batches to the management
core on loopback. The publisher and core are always-on but remain observational: neither can
mutate the application or operations Compose projects.

### Manual workstation fallback

The separate local runtime is retained for explicit fallback use. Install or refresh its manual
lifecycle only against its own Source/token state:

```bash
ops/observability/install-sre-kit-local.sh \
  --source-id <push-source-uuid> \
  --token-file ~/.config/sre-kit/infraegev2-dogfood/infraegev2-push-token
sre-kit-local start
sre-kit-local status
```

The installer does not enable or start user units. The CLI starts the existing private tunnel and
core, performs one immediate traffic delivery, starts the one-minute timer, then starts the web UI.
`sre-kit-local stop` stops the timer/publisher before the UI, core and tunnel. Use
`sre-kit-local logs` for bounded status output; no raw access record is logged by the publisher.

The first run reads at most the latest 500 Nginx journal entries. Later runs continue after the
mode-600 cursor in `~/.local/state/sre-kit/infraegev2-dogfood/traffic-cursor.json`. The cursor is
advanced only after a successful or duplicate-confirmed push. A failed request leaves it unchanged,
and retrying the same cursor range produces the same idempotency key. When a window contains only
non-access Nginx messages, the cursor advances without sending an empty batch.

Clean product paths remain visible. Malformed/binary targets are aggregated as `__invalid_path__`,
overlong targets as `__long_path__`, and common vulnerability probes such as `/.env`, `/.git` and
`/wp-*` as `__probe__`; all three bounded labels use `suspected_automation`. Exact raw targets
remain available only in the existing bounded security journal, not in sre-kit analytics.

Stopping `sre-kit-local` pauses only this fallback runtime. Production traffic delivery, polling,
Dashboard and alert evaluation continue on the management VPS. They pause only if that management
runtime or its path to the target fails; target Nginx/Umami/Beszel continue independently.

## Retention and legal checks

journald remains bounded to 30 days/1 GB. Umami retention remains 13 months. sre-kit keeps raw
telemetry 30 days and hourly metric rollups 13 months. Before broadening fields or events, update
`/privacy`, reassess consent, localization and Roskomnadzor notification requirements, and obtain
appropriate legal review.
