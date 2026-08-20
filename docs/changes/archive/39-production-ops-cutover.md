# CHANGE 39 — Production Operations Cutover Preparation

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `39` |
| Slug | `production-ops-cutover` |
| Title | Production Operations Cutover Preparation |
| Status | `archived` |
| Branch | `feature/39-production-ops-cutover` |

---

## Goal

Prepare the repository for a fresh-start switch from observability services embedded in the
application Compose project to the independent `infraege-ops` project. Establish the final
cross-project Nginx topology and split backup/restore ownership without copying old Umami or
Beszel data. This change does not connect to the VPS or activate the cutover.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Remove Umami, Beszel, Beszel Agent and the socket proxy from the final application production definition, attach Nginx to `infraege-observability-ingress`, and keep application data/services otherwise unchanged — _Depends on:_ —
- [x] `I2` Make application deploy create the declared external network before Compose validation/apply while preserving its existing application rollback and smoke behavior — _Depends on:_ I1
- [x] `I3` Split the current Restic lifecycle so application backup/restore covers only application PostgreSQL and the independent operations lifecycle owns its Umami dump, Beszel state, retention and restore proof — _Depends on:_ I1
- [x] `I4` Add an explicit inactive cutover runbook sequence covering preconditions, legacy stop, application release, clean ops install, Source verification and restart-based rollback without data migration or cleanup — _Depends on:_ I1, I2, I3
- [x] `I5` Package and validate the operations-owned maintenance scripts with every independent `infraege-ops` release so its systemd jobs do not depend on the application checkout — _Depends on:_ I3
- [x] `I6` Retire current-release helpers and units that mutate application-owned Umami/Beszel state; preserved older releases remain the rollback implementation — _Depends on:_ I1, I3

### Data

- [x] `D1` Preserve old application-owned observability volumes as unreferenced rollback resources; do not copy, restore, rename or delete their contents — _Depends on:_ I1

### Other

- [x] `T1` Update production Compose/proxy tests to prove Nginx resolves the external Umami alias while the application project no longer defines observability services or volumes — _Depends on:_ I1, I2
- [x] `T2` Add focused fake-Docker/Restic tests for independent application and operations backup, restore, cleanup and timer ownership — _Depends on:_ I3
- [x] `T3` Synchronize SPEC, STACK, README and operator documentation with the prepared-but-not-activated topology and the separate authorization required for live execution — _Depends on:_ I4, T1, T2

---

## Files

### Create / modify

~~~
README.md
Makefile
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
docs/changes/39-production-ops-cutover.md
docs/runbooks/backup-restore.md
docs/runbooks/incident-response.md
docs/runbooks/production.md
docs/runbooks/production-onboarding.md
infra/.env.example
infra/docker-compose.prod.yml
infra/nginx/conf.d/infraege.prod.conf
scripts/deploy-remote.sh
scripts/backup.sh
scripts/restore-check.sh
scripts/init-umami-db.sh (delete)
scripts/configure-beszel-agent.sh (delete)
scripts/repair-beszel-env.sh (delete)
scripts/prune-umami-data.sh (delete)
ops/install-backup-timers.sh
ops/migrate-root-password-access.sh
ops/observability/backup.sh
ops/observability/restore-check.sh
ops/observability/prune-umami-data.sh
ops/observability/manage.sh
ops/observability/remote-deploy.sh
ops/postgres/umami-retention.sql
ops/systemd/infraege-backup.service
ops/systemd/infraege-restore-check.service
ops/systemd/infraege-analytics-retention.service (delete)
ops/systemd/infraege-analytics-retention.timer (delete)
ops/systemd/infraege-ops-backup.service
ops/systemd/infraege-ops-backup.timer
ops/systemd/infraege-ops-restore-check.service
ops/systemd/infraege-ops-restore-check.timer
ops/systemd/infraege-ops-analytics-retention.service
ops/systemd/infraege-ops-analytics-retention.timer
scripts/tests/backup-restore.test.sh
scripts/tests/root-password-access.test.sh
scripts/tests/production-env.test.sh
scripts/tests/ops-backup-restore.test.sh
scripts/tests/ops-lifecycle.test.sh
scripts/tests/production-ops-topology.test.sh
scripts/tests/umami-proxy.test.sh
~~~

### Do NOT touch

- VPS, production containers, networks, volumes, protected env files or Restic repositories
- `.github/workflows/**`, public deployment or `origin/main`
- sre-kit source, database, Source configuration or runtime
- `apps/web/**` and `apps/api/**`
- archived change documents

---

## Contracts

See `docs/SPEC.md` §7–§8 and the Files list above.

---

## Gate Checks

All cutover, backup and restore tests use synthetic environments plus fake Docker/Restic commands.
They must not connect to production, create real containers/networks/volumes or read protected
files. A live cutover requires separate explicit authorization after this change is shipped.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Nginx resolves the independent `umami` alias at request time through Docker's embedded DNS. This
  permits the application release to start before the clean ops install and avoids a stale upstream
  address after independent Umami replacement; only the two existing public allowlist routes use it.

---

## Commit Message

```
feat(change-39): prepare production operations cutover
```
