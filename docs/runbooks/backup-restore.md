# Backup and restore

Application and operations own separate backup contracts while sharing one encrypted Restic
repository. Application snapshots use tag `infraege-application` and contain only the application
PostgreSQL dump plus `/etc/infraege/production.env`. Operations snapshots use tag `infraege-ops`
and contain the Umami PostgreSQL dump, Beszel state and the release-specific operations env. Each
tag has its own 7 daily + 4 weekly + 3 monthly retention, restore proof and freshness marker.

The jobs share `/run/lock/infraege-restic.lock`, so backup, restore and prune cannot mutate the same
repository concurrently. sre-kit may report sanitized status but never runs these mutations.

## Installation and activation

Before cutover, install only the application jobs:

```bash
sudo ops/install-backup-timers.sh application
```

Only after the clean `infraege-ops` project is installed and healthy, switch retention ownership
and enable its jobs:

```bash
sudo ops/install-backup-timers.sh activate-operations
systemctl list-timers --all 'infraege-*'
```

The second command keeps application backup/restore enabled, removes the legacy application-owned
analytics-retention units and enables the three `infraege-ops-*` timers. It refuses activation when
`/opt/infraege-ops/current` is absent.

## Acceptance checks

```bash
sudo systemctl start infraege-backup.service
sudo systemctl start infraege-restore-check.service
sudo systemctl start infraege-ops-backup.service
sudo systemctl start infraege-ops-restore-check.service

sudo scripts/check-backup-freshness.sh
jq -e '.status == "success"' /var/lib/infraege-ops/backup-status.json

env RESTIC_REPOSITORY=/var/backups/infraege/restic \
  RESTIC_PASSWORD_FILE=/etc/infraege/restic-password \
  restic snapshots --tag infraege-application --latest 1
env RESTIC_REPOSITORY=/var/backups/infraege/restic \
  RESTIC_PASSWORD_FILE=/etc/infraege/restic-password \
  restic snapshots --tag infraege-ops --latest 1
env RESTIC_REPOSITORY=/var/backups/infraege/restic \
  RESTIC_PASSWORD_FILE=/etc/infraege/restic-password \
  restic check --read-data

systemctl show infraege-backup.service infraege-restore-check.service \
  infraege-ops-backup.service infraege-ops-restore-check.service \
  -p Id -p Result -p ExecMainStatus --no-pager
docker ps -a --filter name=infraege-restore-check
docker ps -a --filter name=infraege-ops-restore-check
```

Acceptance requires both tags to have a current snapshot, `restic check --read-data` to pass, all
four jobs to exit successfully and no disposable restore container or `restore.*` directory to
remain. The Umami drill creates its archived owner role before `pg_restore`; the application drill
does not restore or inspect operations artifacts.

## Real recovery

Stop only the writers owned by the affected project. Select a snapshot with the matching tag,
restore into a new temporary directory and run the corresponding restore check before changing live
data. Use `pg_restore --clean --if-exists` only in an approved maintenance window after taking a new
current backup. Restore Beszel state only for the operations project and before its Hub starts.

The fresh-start cutover does not inspect, copy or restore old Umami/Beszel data. Old application
volumes remain unreferenced rollback resources until a separate destructive cleanup is authorized.
The first 2026-08-20 attempt proved a successful operations backup and disposable Umami/Beszel
restore before rolling back for an unrelated Beszel network defect. A second attempt proved the
network and Agent registration, then rolled back when backup shell-sourced a valid space-containing
Beszel key. The maintenance path now leaves env parsing to Compose. Final cutover then produced a
fresh `infraege-ops` snapshot and successful disposable Umami/Beszel restore; all three operations
timers are active and both volume sets remain intact.

Known accepted risk: the repository is on the same VPS, so it protects against logical errors but
not total VPS loss. Configure an encrypted off-site backend and repeat both restore drills before
storing irreplaceable user data.
