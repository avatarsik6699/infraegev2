# Backup and restore

## Change 113 inventory and transfer preconditions (2026-09-12)

Read-only SQL against the application database confirmed PostgreSQL 16.14 in both the local
`infraege-dev` project and live `infraege`. Each `infraege` database was 7,699,479 bytes, with
the `public` schema owned by `pg_database_owner` and no user tables. Local `plpgsql` is 1.0.
The bootstrap/application login `infraege` currently has superuser, create-role and create-DB
privileges; the four restricted application roles do not yet exist. This is measured inventory,
not a conclusion inferred from the absence of ORM models.

Ownership was checked through Compose project/service labels and mount metadata. Local PG16
uses `infraege-dev_postgres-data`; live PG16 uses `infraege_postgres-data`, both mounted at
`/var/lib/postgresql/data`. The local container was resumed solely for the SQL inventory and
returned to its original stopped state. Other local volumes were not mounted or inspected.
The live application cluster also contains legacy `umami` database/role metadata: exclude both
from application transfer and role export. Its tables/data were not opened. Independent
operations databases and volumes remain outside this procedure.

Live release: `a5b0bf5793a85a4e9090f47c311ae01c022f194d`. The application backup and restore timers
were active; last triggers were 2026-09-12 02:31:13 UTC and 2026-09-01 01:01:50 UTC respectively.
Both services reported success/exit 0. Backup status recorded success at 02:31:17 UTC on September
12, with a 36-hour freshness limit. These are installed-job status observations, not a new restore
drill or proof of the future PG18 backup format. Live disk had 26 GiB available (32% used); the
workstation filesystem had 6.8 GiB available (86% used), while local Docker reported roughly
928 GiB available. Recheck disk space immediately before transfer.

Transfer/recovery sequence:

1. Re-run sanitized inventory with explicit environment/project ownership. Record application
   database/schema/role ownership, version, release, size, disk and backup/restore status.
2. Reserve room for the retained PG16 volume, new PG18 volume, logical backup, restore workspace
   and WAL growth; retain at least 30% free disk. Stop application writers for the final dump.
3. Export only the application database and its allowlisted roles/privileges, with release/schema
   metadata and checksums. Do not use cluster-wide globals export on this legacy shared cluster.
4. Restore into a separate PG18 volume (`/var/lib/postgresql`, PGDATA
   `/var/lib/postgresql/18/docker`) and prove schema, data and role permissions using SQL.
   Never start PG18 with the old PG16 data directory.
5. Before target writes, a failed rehearsal/cutover can return to the retained PG16 source.
   After target writes, PG16 is stale: stop writers and use a separately reviewed recovery plan
   from current PG18 data. Never automatically downgrade or restore over either retained volume.
6. Production switching is an explicit serialized release operation following successful local
   nonempty rehearsal. Keep the old volume until a separate cleanup authorization.

The approved image was resolved and pulled from Docker Hub as
`postgres:18.6-alpine3.24@sha256:d3e1620b530c944afa6e887d22eb899824da68e19c52024bf98f5220c88a65b2`.
The code now uses this image; production remains PG16 until the explicit release transfer.

Application and operations own separate backup contracts while sharing one encrypted Restic
repository. Application snapshots use tag `infraege-application` and contain only the application
logical bundle: application dump, allowlisted roles, schema/release metadata, SQL data checks,
checksums and protected `/etc/infraege/production.env`. Operations snapshots use tag `infraege-ops`
and contain the Umami PostgreSQL dump, Beszel state and the release-specific operations env. Each
tag has its own 7 daily + 4 weekly + 3 monthly retention, restore proof and freshness marker.
Application retention groups by host/tag, not the changing temporary dump path.

The jobs share `/run/lock/infraege-restic.lock`, so backup, restore and prune cannot mutate the same
repository concurrently. sre-kit may report sanitized status but never runs these mutations.

## Installation and activation

The release coordinator sets `/opt/infraege/database-current` to the maintenance release matching
the installed DB. Application systemd units resolve all scripts and libraries through that pointer,
independently of application-image rollback. Once it exists, install only the application jobs:

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

Explicit operator interfaces (run production commands on the VPS, never with local dev secrets):

```bash
make db-inventory DB_ENV=dev DB_PROJECT=infraege-dev
make db-inventory DB_ENV=prod DB_PROJECT=infraege
make db-backup DB_ENV=prod DB_PROJECT=infraege ENV_FILE=/etc/infraege/production.env
make db-restore-check DB_ENV=restore DB_PROJECT=infraege-restore
make db-export DB_ENV=prod DB_PROJECT=infraege DESTINATION=/var/backups/infraege/pc-export-YYYY-MM-DD
```

Inventory never starts a stopped container. Backup selects one running container by exact
application project/service labels, verifies the database name, and uses the separate backup
credential when provisioned. Legacy PG16 preparation alone uses the existing bootstrap login.
Privileged maintenance reads allowlisted role/ownership metadata separately from the dump login.
Runtime gets SELECT, import gets DML/sequence use, migration owns the empty `practice` schema and
future default grants, backup gets SELECT. Neither runtime nor import can create schema/table/temp
objects. No task tables, Alembic head or SQL-aware application readiness are claimed here.

Provisioning also grants `infraege_backup` schema USAGE and SELECT on existing tables and
sequences in every non-system schema of the selected `infraege` database. This includes restored
legacy objects in `public`; a whole-database dump must not silently omit them. It grants no
cluster-wide `pg_read_all_data` membership, write/sequence-advance rights or RLS bypass, and does
not widen runtime/import access. Future `practice` objects keep their migration-owner default
grants. After separately approved DDL outside `practice`, re-run provisioning before backup;
new objects from other owners have no automatic default grants. RLS and unsupported role/object
dependencies still fail closed and require explicit review.

The bundle refuses unknown application role dependencies. Maintenance exports one PostgreSQL
REPEATABLE READ snapshot and holds it open while dump, row fingerprints, schema and file references
are read. `pg_dump --snapshot` and `SET TRANSACTION SNAPSHOT` use that same snapshot. Row data is
fingerprinted once; concurrent committed imports belong to the next backup. A shared schema advisory
lock excludes Alembic changes during collection. Final PG16 release transfer still stops writers.
Roles are restored with their privilege attributes and settings but NOLOGIN, without password hashes;
explicit release provisioning supplies the selected environment's credentials. No source env file
is executed by disposable restore. Tables, ownership, grants/default privileges and sequences travel
in the PostgreSQL archive. Restore requires a fresh labelled PG18 volume, verifies checksums and
actual row/schema evidence, and removes only its own disposable resources.

Local acceptance used host Restic 0.16.4 (matching the VPS) and a nonempty PG16.14 → PG18.6 fixture containing identity
values, JSONB, Cyrillic text and timezone-aware timestamps. Encrypted backup, disposable restore and
portable export passed actual SQL/role checks. Measured disposable restore including cleanup was **5 seconds** on the
workstation for this small fixture; this is not a production RTO estimate. The shared release
preparation also passed on the isolated fixture, preserving the source and refusing an existing
candidate. PG18-only writes proved the retained source becomes stale. Live cutover/rollback smoke
and the newly installed PG18 timer/export proofs remain release acceptance.

```bash
sudo systemctl start infraege-backup.service
sudo systemctl start infraege-restore-check.service
sudo systemctl start infraege-ops-backup.service
sudo systemctl start infraege-ops-restore-check.service

sudo scripts/check-backup-freshness.sh
sudo scripts/check-backup-freshness.sh --restore
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
data. Application tooling never restores into an existing database and never uses `--clean`.
Recover application data to a separately verified fresh target, then explicitly switch after SQL
and application compatibility checks. Restore Beszel state only for the operations project and
before its Hub starts.

The fresh-start cutover does not inspect, copy or restore old Umami/Beszel data. Old application
volumes remain unreferenced rollback resources until a separate destructive cleanup is authorized.
The first 2026-08-20 attempt proved a successful operations backup and disposable Umami/Beszel
restore before rolling back for an unrelated Beszel network defect. A second attempt proved the
network and Agent registration, then rolled back when backup shell-sourced a valid space-containing
Beszel key. The maintenance path now leaves env parsing to Compose. Final cutover then produced a
fresh `infraege-ops` snapshot and successful disposable Umami/Beszel restore; all three operations
timers are active and both volume sets remain intact.

Known accepted risk: the repository is on the same VPS, so it protects against logical errors but
not total VPS loss. The approved weekly PC export below provides the current off-host recovery
copy; automated off-site storage remains a separate future change.

## Weekly manual PC export

After a successful fresh application backup and restore drill, run `make db-export` above with a
new absolute destination. It validates the complete bundle before copying only the newest
application-tag snapshot into a new independently encrypted Restic repository, then runs
`restic check --read-data`. Copy the **entire directory** to the PC over the pinned SSH transport;
verify it on the PC with `RESTIC_REPOSITORY=<copied-directory> RESTIC_PASSWORD_FILE=<off-VPS-key-file>
restic check --read-data`. Keep the password available separately from the VPS and export directory.
Do not copy only `application.dump` or leave the sole decryption password on the VPS. Record the
actual copy date; an export still on the VPS is not an off-host copy. Export does not delete its
destination on failure; a failed command is incomplete evidence and requires a new destination.

Current target RPO is at most 24 hours with successful daily backups and a surviving VPS. Total VPS
loss recovers only to the last actual PC copy (up to a week with the weekly routine, potentially
total loss without it). Automated off-site storage/PITR remains explicitly pending. Change 114 extends application
bundles with task files and the shipped checker/projection smoke described below; production
installation of that code is still a release acceptance step.


## Maintenance ownership

`make db-*` and the existing shell entry points remain the operator interface. Bash owns Docker
lifecycle and Restic/systemd coordination; `scripts/application_db.py` and
`scripts/lib/application_db/` own the bundle contract, SQL snapshot transport, file verification
and restore safety checks. They use Python 3.12+ standard library and installed Docker tools;
no API environment, package install, Docker SDK or new service is needed for host maintenance.
Install the complete `scripts/` release tree, not only the shell wrappers. Subprocess errors are
explicit and bounded; password-bearing command arguments are never included in exception reports.
Format 1 and pre-Alembic bundles remain supported. Schema changes must update this explicit
compatibility contract with matching recovery evidence.

## Practice schema and immutable files (Change 114)

Bundles with schema `114_01`, `120_01` or `121_01` include `task-files/` and `file-references.txt` in addition to the
foundation dump/roles/metadata/configuration. Each object name is its SHA-256; validation checks
its bytes and every DB-declared size/reference. The reference list is covered by SHA256SUMS.
Dump, fingerprint and file-reference metadata share one exported DB snapshot. Only files named
by that snapshot's immutable `file_object` rows are copied and checked, including historical objects.
Concurrent additions and `.staging` leftovers do not affect the backup. Never delete old immutable
files; removing them would invalidate this consistency guarantee.
Legacy `pre-alembic` snapshots remain supported and are identified explicitly.

Metadata records the exact application verifier image reference and image ID. Production uses
the full release-SHA GHCR API image; restore requires that image (or a pull of the same ID) on a
compatible architecture, as well as the pinned PostgreSQL image. Preserve registry access/image
availability when planning disaster recovery. An image identity mismatch fails the drill.

After SQL/ownership/fingerprint and schema-metadata comparison, restore enables only the runtime
role with a disposable random password and runs the shipped `practice.cli smoke` in its API image
against the isolated DB. This is an application command, not a test runner. It validates the
current material references, reads public projections, verifies required files and checks accepted
answers. It has no production network credentials, elevated capabilities or writable root mount.
Success is written only after this command and complete temporary-resource cleanup.

The first schema release keeps `database-current` on the new maintenance implementation before
running migrations, so backup/restore continues to understand both pre-Alembic and new schema
states even if application startup fails. The new CLI takes pre/post backups for each applied
package; a post-commit failure must be resolved through its journal, not assumed to be a rollback.
See [practice operator workflow](practice.md).

A real recovery must install verified immutable objects at the new target's persistent storage
path before enabling its application. A validated dump without those objects is insufficient.
Never restore into an existing production database or overwrite old volumes. The weekly encrypted
export carries these files automatically; an export remaining on the VPS is still not off-site.


### Lesson practice consumer cutover (Change 115)

Before activating the DB-backed lesson consumers, follow the explicit register/convert/validate/
diff/pre-backup/import/outcome/parity/API-file-smoke/post-backup sequence in
[practice](practice.md#change-115-explicit-local-bootstrap-and-cutover). A healthy empty schema is
not a populated practice bank. The nonempty restore smoke now exercises public readers and the
revision-aware checker. Keep source assets and old volumes through stage-5 production/rollback
acceptance; local implementation and rehearsals do not authorize production activation.
