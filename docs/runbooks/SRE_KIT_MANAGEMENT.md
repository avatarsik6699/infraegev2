# sre-kit management VPS

This runbook connects infraegev2 to the generic sibling sre-kit distribution. It does not migrate
the local sre-kit database, encrypted secrets, Sources, cursor or telemetry. The new management
runtime begins empty, while the local runtime remains an untouched fallback.

## Protected local inputs

`~/.config/sre-kit/dedicated-vps/connection.env` must be owned by the current user with mode 600
and contain the management SSH connection values plus `SRE_KIT_ADMIN_PASS`. Existing application
credentials remain in the established mode-600 infraege production/ops files. Beszel specifically
uses `~/.config/infraege/production/beszel-user-email` and `beszel-user-password`; client-side
`INFRAEGE_BESZEL_*` variables are not deployment inputs. Commands never put passwords in argv or
logs.

Umami Source credentials come from `~/.config/infraege/ops/ops.env`. A credential reset is a
guarded recovery operation: create and verify an infraege-ops backup first, confirm the database
contains exactly one intended user, store a bcrypt cost-10 password hash for only that user, prove
the Umami API login, and rotate the `Product analytics` encrypted Source secret. Ordinary Source
reconciliation preserves the existing encrypted reference and therefore does not rotate it.

The management SSH wrapper keyscans only Ed25519 and compares it with the independently confirmed
fingerprint before writing its dedicated `known_hosts` file. A mismatch stops the operation.

## One-time sequence

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

## Routine operations

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

## Acceptance evidence

Before claiming completion, record only secret-free output:

- management and application WireGuard handshake/route evidence;
- `/health/ready` returning the deployed exact SHA through loopback and TLS;
- two later Source snapshots showing all six pull Sources fresh and healthy;
- one `Nginx traffic` push followed by an idempotent repeat;
- backup and isolated restore-proof timestamps;
- before/after container/listener evidence proving Firecrawl/SearXNG and application/ops stacks
  were unchanged;
- an authenticated browser journey through Dashboard, Sources and one Source detail page.
