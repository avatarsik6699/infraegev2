# Application backup and restore

The application owns one encrypted Restic contract, tag `infraege-application`: logical DB dump,
allowlisted roles/privileges, schema/release metadata, checksums, referenced task files, protected
environment and SQL fingerprints. Retention is 7 daily + 4 weekly + 3 monthly. Jobs serialize with
`/run/lock/infraege-restic.lock`. Local same-host backups do not survive loss of the VPS; off-site
storage remains an accepted unresolved risk.

## Operator commands

```bash
make db-inventory DB_ENV=dev DB_PROJECT=infraege-dev
make db-inventory DB_ENV=prod DB_PROJECT=infraege
make db-backup DB_ENV=prod DB_PROJECT=infraege ENV_FILE=/etc/infraege/production.env
make db-restore-check DB_ENV=restore DB_PROJECT=infraege-restore
make db-export DB_ENV=prod DB_PROJECT=infraege DESTINATION=/absolute/new/export
```

Run production commands on the intended host with its protected environment, Restic password and
explicit identity. Inventory is read-only. Restore-check creates an isolated empty PG18 volume,
verifies roles/data/checksums and runs the bundle's matching verifier image against every task,
checker and file; it removes only its own restore resources. Export is an encrypted portable copy.
A passing backup alone is not a restore proof. Keep exact verifier images available with bundles.

The isolated verifier uses the restored `task-files` directory owner's numeric UID/GID.
Production timer backups are root-owned; local operator backups may have another owner.
Directory permissions remain private. The verifier retains a read-only root filesystem and
storage mount, no Linux capabilities, no-new-privileges and SELECT-only database credentials.
This maintenance identity does not change the application API's runtime user.

`ops/install-backup-timers.sh application` installs daily backup and monthly restore timers.
`/opt/infraege/database-current` selects the maintenance release that matches the DB. Inspect
`backup-status.json`, `restore-check-status.json`, `systemctl list-timers` and journald for status.
The source of timer truth is `ops/systemd/`; no separate monitoring stack is required.

## Recovery

Stop writers, preserve the failed instance and take a forensic copy where possible. Validate the
chosen bundle with its matching source-version maintenance tools. Restore to a NEW volume; verify
schema, every row/file fingerprint, roles, application reader/checker and HTTP/browser smoke before
switching the application. Never overwrite the only source or run a destructive downgrade.
A rollback application release must support the selected schema. Historical 121_01 bundles need
the archived 121_01 tools/image; the current verifier deliberately rejects incompatible schemas.

First conversion to 122_01 is documented in [practice-transition](practice-transition.md).
Retired operations snapshots/services are not altered by local code removal. Their eventual
retirement must be explicit; preserve any shared Restic data and application timers.
