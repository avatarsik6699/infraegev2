# Application backup and restore

The application owns one encrypted Restic contract, tag `infraege-application`: logical DB dump,
allowlisted roles/privileges (including the least-privilege `infraege_app` account writer), schema/release metadata, checksums, referenced task files, protected
environment and SQL fingerprints. Retention is 7 daily + 4 weekly + 3 monthly. Thus an account
deleted from the live database is removed there immediately, but can remain in an immutable encrypted
snapshot until the applicable retention groups are pruned (normally up to about three calendar months,
plus timer/retention timing). A schema-transition deploy additionally creates one
`infraege-recovery-hold` snapshot; routine retention keeps that exact full ID until an operator
removes the hold. Review and manually release it after 30 days, after confirming recovery is no
longer needed. This is a bounded operational review, not an automatic deletion timer. Individual
records are never edited out of Restic snapshots. Jobs serialize with
`/run/lock/infraege-restic.lock`. Under it a backup removes stale Restic locks left by a killed job
(`restic unlock`, never a live lock) and initialises only a repository whose `config` is missing
(Change 224). Every successful backup is also copied off the host (§ Off-site
copy), so loss of the VPS no longer takes the backups with it.

## Operator commands

```bash
make db-inventory DB_ENV=dev DB_PROJECT=infraege-dev
make db-inventory DB_ENV=prod DB_PROJECT=infraege
make db-backup DB_ENV=prod DB_PROJECT=infraege ENV_FILE=/etc/infraege/production.env
make db-restore-check DB_ENV=restore DB_PROJECT=infraege-restore            # off-site copy when configured
make db-restore-check DB_ENV=restore DB_PROJECT=infraege-restore RESTORE_SOURCE=local
make db-export DB_ENV=prod DB_PROJECT=infraege DESTINATION=/absolute/new/export
```

Run production commands on the intended host with its protected environment, Restic password and
explicit identity. Inventory is read-only. Restore-check creates an isolated empty PG18 volume,
verifies roles/data/checksums and runs the bundle's matching verifier image against every task,
checker and file; for schema `140_01` it also verifies all account/progress tables, absence of answer
columns in progress and the restored `infraege_app` grants before smoke. It removes only its own
restore resources. Export is an encrypted portable copy.
A passing backup alone is not a restore proof. Keep exact verifier images available with bundles.

The isolated verifier uses the restored `task-files` directory owner's numeric UID/GID.
Production timer backups are root-owned; local operator backups may have another owner.
Directory permissions remain private. The verifier retains a read-only root filesystem and
storage mount, no Linux capabilities, no-new-privileges and SELECT-only database credentials.
This maintenance identity does not change the application API's runtime user.

`ops/install-backup-timers.sh application` installs daily backup, monthly restore and hourly bounded
account-artifact purge timers. The purge runs inside the already-running API container with the
`infraege_app` role; it removes at most 500 expired/revoked sessions, mail tokens and provider
challenges per table per run. It never removes a live session, an unexpired mail link or a token
that can still contribute to the one-hour resend cap.
`/opt/infraege/database-current` selects the maintenance release that matches the DB. Inspect
`backup-status.json`, `restore-status.json`, `systemctl list-timers` and journald for status. The
deploy backup's `backup-status.json` contains its full `snapshotId` and `recoveryHold=true` when
the deployed candidate changes the recorded schema. Record that full ID with the release evidence
before a later routine backup overwrites the status file. A schema-unchanged deploy and daily timer
remain ordinary backups. Every backup authenticates its returned full ID before and after retention;
missing or malformed ID proof fails the backup before recording success.
The
purge emits aggregate counts only; account addresses, identifiers and token values must not be copied
to shell history, tickets or logs.
The source of timer truth is `ops/systemd/`; no separate monitoring stack is required.

## Recovery

Stop writers, preserve the failed instance and take a forensic copy where possible. Validate the
chosen bundle with its matching source-version maintenance tools. Restore to a NEW volume; verify
schema, every row/file fingerprint, roles, application reader/checker and HTTP/browser smoke before
switching the application. Never overwrite the only source or run a destructive downgrade.
A rollback application release must support the selected schema. Historical 121_01 bundles need
the archived 121_01 tools/image; the current verifier deliberately rejects incompatible schemas.

### Account deletion after a backup

An old backup is a point-in-time copy: it can contain an account that the person subsequently
deleted. The standard restore checker is deliberately isolated and must never promote that copy to
production automatically. Before an incident operator can promote any snapshot, they must record
the snapshot timestamp, reconcile every self-service deletion completed after that timestamp from a
reliable incident/deletion record, and repeat those deletions on the isolated restored copy before
any switchover. Then take and verify a fresh backup of the reconciled copy.

The current live deletion is a hard cascade and does **not** retain a separate deletion tombstone.
Consequently, if no reliable record exists for the interval after the selected snapshot, promotion
is a hard stop: keep the copy isolated and choose a newer snapshot or an explicitly approved
recovery plan. Do not silently return its accounts to service. An automatic proof against
reappearance requires a separately designed deletion ledger; it is a known follow-up, not something
this procedure pretends to provide.

## Schema transition attestation

Deploy preflight (`scripts/lib/application-db-release.sh`) compares `infra/database-schema` of the
candidate with the running release. When the schema head changes, it refuses to migrate production
unless root-owned, mode-600 `/etc/infraege/accounts-schema-ready` contains
`<schema> <full-candidate-sha>`. That proof may be written only by a passing isolated two-stage
rehearsal of the exact candidate, after its images are published and verified: take a fresh
pre-migration production backup, restore it into a disposable isolated database and task-files
copy (never migrate the live database), apply the candidate migration there, back that copy up,
restore it into a _second_ fresh isolated target and verify data/roles/fingerprints, identities,
session revocation, per-context progress and application grants. A failed or partial drill must not
create the attestation; routine `db-restore-check` does not justify it.

The completed 2026-09-26 `122_01` → `140_01` account cutover used the procedure below;
`scripts/rehearse-account-cutover.sh` implements that transition and, since Change 191, the
`140_01` → `191_01` one: the target is the candidate's `infra/database-schema` and the source the
schema of the release production runs now (`/opt/infraege/database-current/infra/database-schema`,
falling back to the predecessor in `APPLICATION_SCHEMAS`); the transition must be the immediate
predecessor or a reviewed entry of `APPLICATION_SKIPS` in `scripts/lib/application-db-release.sh`.
The attestation holds `<target> <sha>`. A further schema head extends that list and its own checks.

Change 192: the restore check of a `192_01` bundle also proves the billing tables and grants
(`sql.BILLING_RESTORE`): the application may add and update payments, grants, refunds and
provider events but never delete them, offer acceptances are append-only, and the runtime and
import roles see none of them. Billing rows are 5-year evidence: paid access needs this proof and
off-site backups before `BILLING_ENABLED` (docs/runbooks/billing.md).

Change 198: production went from `140_01` straight to `198_01` on 2026-10-24 (the reviewed
skip). The restore check of a `198_01` bundle also proves the device,
activity and restriction tables and grants (`sql.DEVICE_RESTORE`): restrictions are evidence the
application never deletes; the runtime and import roles see none of them.

Use the reviewed `scripts/rehearse-account-cutover.sh` from the exact candidate source on the
production host, before deploy dispatch. Take a fresh production backup through the existing
`make db-backup` command and record its full 64-character Restic snapshot ID. On a production host
without `make`, run its equivalent from the current release directory:
`DB_ENV=prod DB_PROJECT=infraege bash scripts/backup.sh /etc/infraege/production.env`.
The rehearsal authenticates the snapshot and obtains its restore size through Restic stats, so it
also works with Restic 0.16 snapshots that do not include an embedded `summary`. Do not extract a
bundle manually: the rehearsal authenticates and restores that exact snapshot itself into its
private root-owned workspace, rejecting `latest`, prefixes, untagged snapshots and any snapshot
that does not yield exactly one valid production bundle of the source schema. Pull the candidate API image
and obtain its `sha256:` digest from the successful exact-SHA `images.yml` publication evidence.
Run from a clean Git checkout whose `HEAD` is precisely the same full candidate SHA; this binds
the migration scripts to the SHA-tagged image rather than trusting nearby modified source. Then
run, with the full snapshot ID substituted:

```bash
bash scripts/rehearse-account-cutover.sh --validate FULL_RESTIC_SNAPSHOT_ID FULL_SHA sha256:API_DIGEST
bash scripts/rehearse-account-cutover.sh --run FULL_RESTIC_SNAPSHOT_ID FULL_SHA sha256:API_DIGEST
```

### Candidate source and Restic credentials

The normal deploy workflow creates and uploads `/root/infraege-<sha>.tar.gz` only _after_ deploy
dispatch, so it is not available for this pre-dispatch proof and is not a replacement for a Git
checkout. After the SHA has been pushed and its exact-SHA image evidence has passed, create a
root-only disposable checkout on the production host from the canonical repository, then verify
and use it:

```bash
install -d -m 700 /root/infraege-cutover
git clone --no-checkout --branch main --single-branch https://github.com/avatarsik6699/infraegev2.git \
  /root/infraege-cutover/FULL_SHA
git -C /root/infraege-cutover/FULL_SHA cat-file -e FULL_SHA^{commit}
git -C /root/infraege-cutover/FULL_SHA checkout --detach FULL_SHA
git -C /root/infraege-cutover/FULL_SHA status --porcelain --untracked-files=all
```

The final status command must print nothing. If the commit is unavailable from `main`, the remote
identity cannot be authenticated, or any command differs from the expected SHA, stop the release;
do not manually unpack a directory or remove the script's source check. Remove only this exact
root-owned temporary checkout after the rehearsal completes or fails.

Use the already-installed root backup identity. The command defaults to the same
`RESTIC_REPOSITORY` (`/var/backups/infraege/restic`) and root-only
`RESTIC_PASSWORD_FILE` (`/etc/infraege/restic-password`) as `scripts/backup.sh`; no password,
repository credential or snapshot contents belongs in the shell history, command arguments, logs,
chat, or CI output. For an approved remote Restic backend, establish its repository and backend
credentials in the root-only backup-service environment before opening the root shell, then invoke
the command without printing or overriding them. A missing/unreadable credential or an
unauthenticated `restic cat snapshot` is a hard stop, never a reason to fall back to a manually
extracted bundle.

`--validate` makes Restic authenticate and inspect the exact snapshot, verifies its application
tag/freshness, checks the clean candidate source SHA and confirms the local SHA tag has the exact
published API digest; it never restores data or starts a database. `--run` repeats those checks,
locks both deploy and Restic activity, and requires a fresh production source-schema bundle from that
snapshot, the still-current source release, sufficient free space in both backup and Docker
storage, root-only production settings and the already-pulled matching API image. It creates
networkless disposable PostgreSQL
volumes, restores the
source, provisions roles and migrates only the first copy, adds synthetic account/session/progress
facts there, then backs up and restores that copy into a second volume. It creates the SHA proof
only after the restored synthetic facts and cleanup pass. Failure leaves no proof; never create
one manually to bypass a failed run. The bundle and its restored working copy contain protected
environment data, so never attach or inspect them in untrusted tooling. A successful local drill
is not production evidence. After preserving the encrypted Restic snapshot and recording the
result, remove only the exact temporary extraction directory selected for this rehearsal; the
command removes its own disposable Docker resources and internal working directory.

After a healthy transition deploy, create a fresh _live_ backup of the new schema and run the routine isolated
restore check again; this confirms the actual post-cutover data. Preserve the pre-migration backup
for recovery. Do not claim this post-deploy check as the proof that authorized the preceding
migration. After that fresh backup has run its retention, re-authenticate the previously recorded
held **full ID** and assert both tags under the shared lock; the newer backup overwrites
`backup-status.json`, so that file cannot recover the earlier ID:

```bash
set -o pipefail
export RESTIC_REPOSITORY=/var/backups/infraege/restic
export RESTIC_PASSWORD_FILE=/etc/infraege/restic-password
flock -n /run/lock/infraege-restic.lock restic cat snapshot FULL_HELD_SNAPSHOT_ID |
  jq -e '(.tags | index("infraege-application")) != null and
    (.tags | index("infraege-recovery-hold")) != null'
```

An absent ID or either tag is a failed recovery check, not a successful post-release backup.

### Recovery hold review and release

At 30 days after a schema transition, an operator checks the recorded full 64-character held
snapshot ID, current live schema/health, successful recent backup and isolated restore, and any
open recovery incident. Never release a hold just because the calendar date arrived. Under the
shared `/run/lock/infraege-restic.lock`, authenticate the exact ID with `restic cat snapshot`,
confirm both `infraege-application` and `infraege-recovery-hold` tags, and inspect
`restic forget --tag infraege-application --group-by host,tags --keep-daily 7 --keep-weekly 4
--keep-monthly 3 --keep-tag infraege-recovery-hold --dry-run` before changing it. If approved,
remove only the `infraege-recovery-hold` tag from that exact snapshot with `restic tag --remove
infraege-recovery-hold FULL_SNAPSHOT_ID`; Restic changes the snapshot ID when tags change, so
record the new full ID and authenticate it. The next routine retention may prune it. Never run
`forget --prune` manually as part of releasing a hold, and never use `latest` or a prefix in this
procedure. The retained pre-migration point can contain later-deleted accounts; the deletion
reconciliation rule above applies before any restoration to production.

The exact pre-migration snapshot of the 2026-09-26 cutover was pruned before recovery holds
existed; an older retained `122_01` point is a different backup — verify its ID, schema and
account-deletion window before relying on it.
Since Change 196 the off-site repository holds a copy of the held snapshot under a **different ID**
whose `original` field is the local full ID. After releasing the hold locally, release it off-site
too: with the off-site environment loaded (see § Off-site copy), find the copy with `restic
snapshots --json --tag infraege-recovery-hold | jq '.[] | select(.original == "FULL_LOCAL_ID") |
.id'`, authenticate it with `restic cat snapshot` and remove only its `infraege-recovery-hold` tag.
The off-site key cannot delete object versions; pruned data stays in the bucket for 30 more days.

## Off-site copy (Change 196)

Restic copies every application snapshot to a second, encrypted repository in Yandex Object
Storage (Russia): `s3:https://storage.yandexcloud.net/kodumka-backup-app`.
- **Bucket:** private, versioned, 50 GB cap. Lifecycle `keep-deleted-30d` keeps replaced or deleted
  object versions for 30 days.
- **Key:** the bucket key (service account `kodumka-backup-app`) can write, read and delete objects.
  It cannot delete versions, list versions, or change versioning, lifecycle or the bucket policy, so
  a compromised host cannot destroy the history.
- **Password:** both repositories use the one Restic password in `/etc/infraege/restic-password`.
  The architect keeps it off-host in athanor (`RESTIC_PASSWORD`, infraegev2 vault); the monitoring
  host uses the same one. Without it the off-site copy is unreadable.

**Setup** (once, from the operator machine, without echoing values): write the root-only
credentials file from athanor over SSH. The file holds only these keys, never `production.env`,
which is rendered into Compose:

```bash
athanor run -- bash -c 'printf "OFFSITE_RESTIC_REPOSITORY=s3:https://storage.yandexcloud.net/kodumka-backup-app\nAWS_ACCESS_KEY_ID=%s\nAWS_SECRET_ACCESS_KEY=%s\nAWS_DEFAULT_REGION=ru-central1\n" \
  "$BACKUP_S3_ACCESS_KEY_ID" "$BACKUP_S3_SECRET_ACCESS_KEY" |
  ssh root@<host> "install -m 600 -o root -g root /dev/stdin /etc/infraege/offsite-backup.env"'
```

`scripts/lib/offsite-backup.sh` refuses the file unless it is a root-owned regular file with mode
600. It reads only those four keys and never executes the file. Without the file, every job records
`not-configured`.

**What runs:**
- After each local backup (timer or deploy), `backup.sh`, under the same lock:
  - runs `restic copy` (the first run creates the repository with the local chunker parameters);
  - finds the new snapshot off-site by its `original` ID;
  - applies the same retention, holds included;
  - writes `offsite-backup-status.json`.
- A failed copy records `failed` and exits non-zero after the local backup succeeded. The timer
  unit fails; a deploy stops before migrating, because the pre-migration copy must leave the host
  first. To deploy during a storage outage, fix the storage, or move the credentials file away
  deliberately and record why.
- Weekly, `infraege-offsite-check.timer` runs `restic check --read-data-subset=10%` and writes
  `offsite-check-status.json`.
- Monthly, the restore drill reads the off-site repository (`RESTORE_SOURCE=auto`), and
  `restore-status.json` records `source`.
- `scripts/backup-summary.sh` (hourly and after every job) writes
  `/var/lib/infraege/ops/backups.json` in the `smotryashchiy.backup/1` schema, mode 640. It holds
  only states, times, snapshot counts, sizes, holds, backup-disk space and failed backup units.
  The monitoring agent reports it with `--document backup=/var/lib/infraege/ops/backups.json`; the
  dashboard's BACKUPS ledger assesses it. There are no notifications.

**Disaster recovery on a fresh host:**
1. Bootstrap the host as in production.md.
2. Restore `/etc/infraege/restic-password` from athanor and write the credentials file as above.
3. Run `RESTORE_SOURCE=offsite make db-restore-check …` to prove the copy.
4. Restore the chosen bundle to a new volume with the matching maintenance release (§ Recovery).

Retired operations snapshots/services are not altered by local code removal. Their eventual
retirement must be explicit; preserve any shared Restic data and application timers.
