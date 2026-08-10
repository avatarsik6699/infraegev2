# Backup and restore

Daily backup captures both PostgreSQL databases, Beszel data and the encrypted-at-rest production
environment into a local Restic repository. Retention is 7 daily, 4 weekly and 3 monthly snapshots.
`infraege-backup.timer` runs daily; `infraege-restore-check.timer` performs a monthly restore into a
disposable PostgreSQL container. Status is written to `/var/lib/infraege/backup-status.json`.

Checks:

```bash
systemctl list-timers 'infraege-*'
sudo systemctl start infraege-backup.service
sudo scripts/check-backup-freshness.sh
sudo systemctl start infraege-restore-check.service
journalctl -u infraege-backup.service -u infraege-restore-check.service --since today
```

For an actual restore, stop application writers, select a Restic snapshot, restore it to a new
temporary directory, validate both dumps, then use `pg_restore --clean --if-exists` only after a
maintenance window and an additional current backup. Restore Beszel data before starting Beszel.
Run public smoke checks and preserve the pre-restore backup until acceptance.

Known accepted risk: the initial repository is on the same VPS, so it protects against logical
errors but not total VPS loss. Before storing irreplaceable user data, configure an encrypted
off-site Restic backend and perform the same restore drill against it.

