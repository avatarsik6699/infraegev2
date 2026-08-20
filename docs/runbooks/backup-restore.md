# Backup and restore

Daily backup captures both PostgreSQL databases, Beszel data and the encrypted-at-rest production
environment into a local Restic repository. Retention is 7 daily, 4 weekly and 3 monthly snapshots.
`infraege-backup.timer` runs daily; `infraege-restore-check.timer` performs a monthly restore into a
disposable PostgreSQL container. Status is written to `/var/lib/infraege/backup-status.json`.
Backup/restore lifecycle remains owned by `infraegev2/ops`; sre-kit may report sanitized freshness
and restore-check events but never runs backup, restore or retention mutations. `ops/opsctl status`
currently observes only timer state—the freshness and installed-restore proofs below remain the
authoritative acceptance checks.

`ops/observability/backup-cutover.json` names the future independent Umami database and Beszel
volume, but `activation_status: inactive-definition-only` means the existing backup script below
remains authoritative. Do not switch backup ownership merely because the new Compose renders.
Before cutover, extend backup/restore to the `infraege-ops` project and prove both data sets in a
disposable restore while retaining the pre-migration snapshot for rollback.

Checks:

```bash
sudo ops/install-backup-timers.sh
systemctl list-timers --all 'infraege-*'
sudo systemctl start infraege-backup.service
sudo scripts/check-backup-freshness.sh
env \
  RESTIC_REPOSITORY=/var/backups/infraege/restic \
  RESTIC_PASSWORD_FILE=/etc/infraege/restic-password \
  restic snapshots --latest 1
env \
  RESTIC_REPOSITORY=/var/backups/infraege/restic \
  RESTIC_PASSWORD_FILE=/etc/infraege/restic-password \
  restic check --read-data
sudo systemctl start infraege-restore-check.service
systemctl show infraege-backup.service infraege-restore-check.service \
  -p Id -p Result -p ExecMainStatus --no-pager
docker ps -a --filter name=infraege-restore-check
journalctl -u infraege-backup.service -u infraege-restore-check.service --since today
```

The first production proof is not complete until all three `infraege-*` timers appear with a next
run, the marker is fresh, Restic reports a current snapshot and `check --read-data` finds no
errors, both oneshot services exit with status 0, and no `infraege-restore-check-*` container or
`restore.*` work directory remains. A timer reported as `not-found` was never installed; waiting
for its calendar cannot create the first backup.

The custom-format Umami dump retains object ownership. The disposable cluster must create the
loginless `umami` owner role before `pg_restore`; using `--no-owner` would make a simplified import
pass without proving that the archived ownership metadata is restorable.

For an actual restore, stop application writers, select a Restic snapshot, restore it to a new
temporary directory, validate both dumps, then use `pg_restore --clean --if-exists` only after a
maintenance window and an additional current backup. Restore Beszel data before starting Beszel.
Run public smoke checks and preserve the pre-restore backup until acceptance.

Known accepted risk: the initial repository is on the same VPS, so it protects against logical
errors but not total VPS loss. Before storing irreplaceable user data, configure an encrypted
off-site Restic backend and perform the same restore drill against it.
