# CHANGE 07 - Local Ops Lifecycle

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `07` |
| Slug | `local-ops-lifecycle` |
| Title | One-command local operations dashboard lifecycle |
| Status | `active` |
| Branch | `feature/07-local-ops-lifecycle` |

---

## Goal

Make the existing local-first operations dashboard practical to run from WSL: validate and manage
the narrow WireGuard route, load protected operator configuration from outside git, and provide a
predictable one-command background lifecycle. Preserve the SPEC section 7 security boundary: the
BFF stays loopback-only and production credentials, keys, logs and runtime state stay outside the
repository.

---

## Backlog

### Backend
None

### Frontend
- [x] `F1` Separate the historical dashboard range from refresh cadence and offer a safe
  near-real-time mode after measuring the current polling behavior and upstream costs; keep
  source requests bounded and surface freshness without turning the local dashboard into an
  unbounded log stream - _Depends on:_ I6
- [x] `F2` Verify container resource values against the live Beszel payload and display the actual
  memory unit or normalized value instead of presenting raw adapter numbers as ambiguous sizes -
  _Depends on:_ F1

### Infra
- [x] `I1` Add a fail-closed local ops lifecycle script that validates protected config, starts or
  reuses the `infraege` WireGuard interface, verifies its route, handshake and private endpoint,
  builds and starts the loopback BFF in the background, and provides status, logs and down actions
  without storing secrets or runtime files in git - _Depends on:_ -
- [x] `I2` Add `make ops-init`, `ops-up`, `ops-status`, `ops-logs`, `ops-down`, private UI launchers
  and first-time tunnel entry points with discoverable help and focused lifecycle checks -
  _Depends on:_ I1
- [x] `I3` Align the local ops Umami base URL and onboarding examples with the live direct
  WireGuard endpoint after production proved that port 3001 serves Umami from `/` while `/stats`
  is the public Nginx prefix - _Depends on:_ I1
- [x] `I4` Correct the public privacy-minimized Umami proxy if live verification confirms that
  runtime `BASE_PATH=/stats` on the prebuilt image leaves Nginx proxying tracker requests to
  nonexistent upstream `/stats` routes; retain the public allowlist and private admin surface -
  _Depends on:_ I3
- [x] `I5` Add an explicitly invoked, hidden-prompt helper that atomically replaces only the two
  Beszel agent values through pinned deploy SSH, recreates only `beszel-agent`, and restores the
  previous protected production env if the agent fails to start - _Depends on:_ I1
- [x] `I6` Restore the live journald and fail2ban dashboard sources after the first complete local
  ops request reported both unavailable; retain WireGuard-only, read-only and sanitized access -
  _Depends on:_ I1, I2
- [x] `I7` Trace a real learner visit and practice event through the public Umami tracker,
  production ingestion, stored website data and ops queries; identify every broken boundary
  before changing code or proxy configuration - _Depends on:_ I3, F1

### Data
None

### Other
- [x] `T1` Document the WSL and Amnezia coexistence path, protected local files, first-time
  Umami/Beszel setup, expected dashboard evidence and recovery steps; record recurring routing
  pitfalls in KNOWN_GOTCHAS - _Depends on:_ I1, I2, I3, I4, I6

---

## Files

### Create / modify
~~~
scripts/ops-local.sh
scripts/configure-beszel-agent.sh
scripts/tests/ops-local.test.sh
Makefile
apps/ops/config/projects.example.json
apps/ops/server/core/config.ts
apps/ops/server/core/config.test.ts
apps/ops/server/app.test.ts
apps/ops/server/integrations/beszel.ts
apps/ops/server/integrations/journal.ts
apps/ops/server/integrations/journal.test.ts
apps/ops/server/integrations/fail2ban.ts
apps/ops/server/integrations/fail2ban.test.ts
apps/ops/contracts/dashboard.ts
apps/ops/server/modules/dashboard/schemas.ts
apps/ops/server/modules/dashboard/service.ts
apps/ops/server/modules/dashboard/service.test.ts
apps/ops/server/integrations/index.ts
apps/ops/server/integrations/umami.ts
apps/ops/server/integrations/umami.test.ts
apps/ops/src/pages/dashboard/dashboard-page.tsx
apps/ops/src/pages/dashboard/dashboard-page.module.css
apps/ops/src/pages/dashboard/components/dashboard-header.tsx
apps/ops/src/pages/dashboard/components/source-status.tsx
apps/ops/src/pages/dashboard/components/summary-metrics.tsx
apps/ops/src/pages/dashboard/components/operations-tables.tsx
apps/ops/src/pages/dashboard/model/use-dashboard.ts
apps/ops/tests/dashboard-page.test.tsx
apps/ops/tests/fixtures.ts
infra/nginx/conf.d/infraege.prod.conf
scripts/tests/umami-proxy.test.sh
docs/runbooks/monitoring.md
docs/runbooks/production-onboarding.md
docs/KNOWN_GOTCHAS.md
docs/changes/07-local-ops-lifecycle.md
~~~

### Do NOT touch
- unrelated application behavior or externally published API contracts
- production VPS configuration, GitHub environment or deploy workflows
- files under `~/.config/infraege/production/` except through explicit operator setup
- `content/`
- `docs/changes/archive/`

---

## Contracts

See `docs/SPEC.md` section 7 and the Files list above. Do not hand-copy schema, endpoint, type or
secret values into this file; the codebase, protected local config and SPEC are the sources of
truth.

---

## Gate Checks

Focused lifecycle verification must use a temporary HOME, config and state tree and stub external
commands so tests never start a real tunnel, contact production or read operator secrets.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The architect chose to use the existing Beszel administrator account for the initial local
  dashboard instead of creating a separate read-only user. This works but retains broader access;
  moving the dashboard to a shared machine requires replacing it with a system-scoped read-only
  account first.
- The architect explicitly accepted keeping Umami's default `admin / umami` credentials while its
  administration surface remains WireGuard-only. Umami already runs on the production VPS, so the
  credentials must be rotated before broadening admin access, hosting ops remotely or adding users.

---

## Commit Message

```
feat(change-07): add one-command local ops lifecycle
```
