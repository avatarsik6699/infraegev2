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

## sre-kit management VPS

This runbook connects infraegev2 to the generic sibling sre-kit distribution. It does not migrate
the local sre-kit database, encrypted secrets, Sources, cursor or telemetry. The management runtime was installed from empty state; the local runtime remains a manual fallback.

### Protected local inputs

`~/.config/sre-kit/dedicated-vps/connection.env` must be owned by the current user with mode 600
and contain the management SSH connection values plus `SRE_KIT_ADMIN_PASS`. Existing application
credentials remain in the established mode-600 infraege production/ops files. Beszel specifically
uses `~/.config/infraege/production/beszel-user-email` and `beszel-user-password`; client-side
`INFRAEGE_BESZEL_*` variables are not deployment inputs. Commands never put passwords in argv or
logs.

Umami Source credentials come from `~/.config/infraege/ops/ops.env`. A credential reset is a
guarded recovery operation: create and verify an infraege-ops backup first, confirm the database
contains exactly one intended user, store a bcrypt cost-10 password hash for only that user, prove
the Umami API login, and rotate the `Product analytics` encrypted Source secret. Every explicit Source reconciliation refreshes secret-bearing configuration from current protected
inputs. sre-kit replaces the encrypted reference and deletes its superseded secret; an opaque
reference cannot prove equality with the operator credential (Change 66).

The management SSH wrapper keyscans only Ed25519 and compares it with the independently confirmed
fingerprint before writing its dedicated `known_hosts` file. A mismatch stops the operation.

### One-time sequence

1. Publish and verify the linked sre-kit exact-SHA images.
2. Add `sre.infraege.ru` as an A record pointing to `2.27.208.4` and wait for public resolution.
3. Run the coexistence-safe host bootstrap:

   ```bash
   make sre-management ACTION=bootstrap
   ```

4. Add and verify the dedicated WireGuard peer:

   ```bash
   make sre-management ACTION=wireguard
   ```

   The workstation peer remains `10.77.0.2/32`; management is `10.77.0.3/32` and routes only
   `10.77.0.1/32`.

5. Install the immutable sre-kit release, then reconcile Sources and install the publisher:

   ```bash
   make sre-management ACTION=install RELEASE=<40-character-sre-kit-main-sha>
   make sre-management ACTION=sources
   ```

   Source administration uses the verified public TLS origin because production login cookies are
   `Secure`; the installed traffic publisher uses its separate token only against loopback core.

The clean Project is `infraegev2`. It contains exactly seven enabled Sources named `Public
availability`, `Host resources`, `Security bans`, `Application journal`, `Container telemetry`,
`Product analytics` and `Nginx traffic`. Telegram channels and alert rules are intentionally not
created.

### Browser verification

1. Open `https://sre.infraege.ru` and sign in with the admin password stored as
   `SRE_KIT_ADMIN_PASS` in the protected management connection env. Do not copy it into a command,
   ticket or browser bookmark.
2. Open Project `infraegev2`. The overview must show seven enabled Sources and no source in an
   error state.
3. Open **Sources** and verify all seven names listed above. `Last seen` must advance for the six
   scheduled pull Sources; `Nginx traffic` advances when the system publisher sends a new
   aggregate batch.
4. Open **Container telemetry** and require fresh `beszel.system_fresh` and
   `beszel.containers_fresh` checks plus both host and per-container measurements. Reconciliation
   discovers the unique Beszel system named `infraege.ru`; it never reuses a copied record id.
5. Open at least one Source detail page and confirm the displayed purpose, current status and
   recent metrics belong to that Source. A green overview without a readable detail page is not
   sufficient UI acceptance.
6. In a terminal run `make sre-management ACTION=status` and compare the reported exact SHA and
   service health with the browser session. Use `backup` or `restore-proof` only as explicit
   operator actions; viewing the UI never mutates target lifecycle.

### Routine operations

```bash
make sre-management ACTION=status
make sre-management ACTION=backup
make sre-management ACTION=restore-proof
make sre-management ACTION=update RELEASE=<new-main-sha>
make sre-management ACTION=rollback RELEASE=<previous-healthy-main-sha>
```

Update and rollback both apply immutable desired state. The generic deploy takes a pre-update
backup, verifies local and public exact-SHA readiness and automatically restores the prior release
on failure. Daily Restic snapshots retain 7 daily, 4 weekly and 3 monthly copies; monthly proof
restores into a temporary directory and never replaces live state. The repository is on the same
management VPS, so simultaneous VPS/storage loss remains an accepted risk.

### Acceptance evidence

Before claiming completion, record only secret-free output:

- management and application WireGuard handshake/route evidence;
- `/health/ready` returning the deployed exact SHA through loopback and TLS;
- two later Source snapshots showing all seven Sources enabled and reachable, with fresh polling for
  the six pull Sources and a recent batch for `Nginx traffic`;
- fresh Beszel system and container checks plus at least one per-container metric;
- one `Nginx traffic` push followed by an idempotent repeat;
- backup and isolated restore-proof timestamps;
- before/after container/listener evidence proving Firecrawl/SearXNG and application/ops stacks
  were unchanged;
- an authenticated browser journey through Dashboard, Sources and one Source detail page.

## Management and fallback command contracts

The always-on sre-kit control plane is a third, independent Compose project on the dedicated
management VPS. `make sre-management ACTION=<action> RELEASE=<sre-kit-main-sha>` wraps the pinned
root/password connection from `~/.config/sre-kit/dedicated-vps/connection.env`; supported actions
are `bootstrap`, `wireguard`, `install`, `update`, `rollback`, `sources`, `status`, `backup`,
`restore-proof` and `all`. The wrapper verifies the independently confirmed management host
fingerprint before every connection. Bootstrap opens only the configured SSH port and 80/443 in
UFW, and fails if the pre/post Firecrawl/SearXNG container inventory changes. It never addresses
the application or `infraege-ops` Compose projects.

The management peer owns `10.77.0.3/32`, pins MTU 1280 for the cross-provider path and routes only
`10.77.0.1/32`; workstation peer
`10.77.0.2/32` remains unchanged. DNS `sre.infraege.ru -> 2.27.208.4` must exist before first
exact-SHA deploy so Caddy can obtain TLS and public readiness can pass.

`ops/observability/sre-kit-sources.example.json` documents one Project and seven human-readable
Sources: `Public availability`, `Host resources`, `Security bans`, `Application journal`,
`Container telemetry`, `Product analytics` and `Nginx traffic`. Credentials are transient
mode-600 reconciliation input, become encrypted sre-kit secret refs, and are then removed from the
management host. Admin reconciliation uses the verified `https://sre.infraege.ru` origin so the
production `Secure` session cookie is never weakened; token-based publisher ingestion remains on
core loopback. Every explicit reconciliation refreshes secret-bearing Source configs from current
protected operator inputs because an opaque API ref cannot prove credential equality; sre-kit
replaces the encrypted ref and deletes the superseded value. The generated push token stays in a
protected management-only file. The separate
`stub` manifest is test-only. Linked sre-kit Change 20
historically reconciled the six pull Sources and proved fresh polling, quiet success, reversible
failure/recovery and authenticated Dashboard/Sources/detail rendering without target-side
mutations. A local core still provides no polling or alerts while its workstation is off, and
monitoring availability never gates target lifecycle.

Beszel Agent intentionally retains host networking for host network counters. Its Docker API is a
read-only socket proxy bound only to `127.0.0.1:2375` and attached to the dedicated non-internal
`docker-api` bridge; `POST=0` remains mandatory. Source reconciliation authenticates with the
existing protected Beszel user, resolves exactly one system named `infraege.ru`, and sets
`require_container_stats=true`; copied PocketBase record ids are not configuration inputs.

`ops/observability/install-sre-kit-local.sh` installs the repository-owned manual CLI plus a
disabled user timer for privacy-safe Nginx aggregate delivery. It accepts the current push Source
UUID and a mode-600 token file, writes only protected local configuration/state, and never enables
autostart. The rendered unit pins the same discovered Python ≥3.12 interpreter validated by the
installer instead of relying on an older `/usr/bin/python3`. `sre-kit-local start` starts tunnel →
core → one immediate publisher run → timer → web;
`stop` stops the publisher before core/tunnel. The timer reads at most 500 journal entries per
minute through the existing loopback gateway forward and persists only its opaque cursor.
