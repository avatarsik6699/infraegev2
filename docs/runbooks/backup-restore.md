# Application backup and restore

The application owns one encrypted Restic contract, tag `infraege-application`: logical DB dump,
allowlisted roles/privileges (including the least-privilege `infraege_app` account writer), schema/release metadata, checksums, referenced task files, protected
environment and SQL fingerprints. Retention is 7 daily + 4 weekly + 3 monthly. Thus an account
deleted from the live database is removed there immediately, but can remain in an immutable encrypted
snapshot until the applicable retention groups are pruned (normally up to about three calendar months,
plus timer/retention timing). Individual records are never edited out of Restic snapshots. Jobs serialize with
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

First conversion to 122_01 is documented in [practice-transition](practice-transition.md).
For the first `140_01` production release, the deploy preflight requires an exact-candidate-SHA
restore attestation **before** it will migrate production. After that SHA's images are published and
verified, take a fresh pre-migration production backup. Restore it into a disposable, isolated
database and task-files copy; never migrate the live database as part of the rehearsal. Apply the
candidate migration to that copy, create a candidate-schema backup from it, and restore that
backup into a *second* fresh isolated target. Verify data/roles/fingerprints, account identities,
session revocation, per-context progress and `infraege_app` grants there. Only after all checks pass
may the operator record `140_01 <full-candidate-sha>` in
`/etc/infraege/accounts-schema-ready` (root-owned, mode 600), then permit deployment. A failed or
partial drill must not create the attestation. Current routine `db-restore-check` verifies the
latest bundle; it does not by itself perform this two-stage candidate rehearsal or justify the
attestation.

Use the reviewed `scripts/rehearse-account-cutover.sh` from the exact candidate source on the
production host, before deploy dispatch. Take a fresh production backup through the existing
`make db-backup` command and record its full 64-character Restic snapshot ID. Do not extract a
bundle manually: the rehearsal authenticates and restores that exact snapshot itself into its
private root-owned workspace, rejecting `latest`, prefixes, untagged snapshots and any snapshot
that does not yield exactly one valid production `122_01` bundle. Pull the candidate API image
and obtain its `sha256:` digest from the successful exact-SHA `images.yml` publication evidence.
Run from a clean Git checkout whose `HEAD` is precisely the same full candidate SHA; this binds
the migration scripts to the SHA-tagged image rather than trusting nearby modified source. Then
run, with the full snapshot ID substituted:

```bash
bash scripts/rehearse-account-cutover.sh --validate FULL_RESTIC_SNAPSHOT_ID FULL_SHA sha256:API_DIGEST
bash scripts/rehearse-account-cutover.sh --run FULL_RESTIC_SNAPSHOT_ID FULL_SHA sha256:API_DIGEST
```

### Candidate source and Restic credentials

The normal deploy workflow creates and uploads `/root/infraege-<sha>.tar.gz` only *after* deploy
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
locks both deploy and Restic activity, and requires a fresh production `122_01` bundle from that
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

After a healthy first deploy, create a fresh *live* `140_01` backup and run the routine isolated
restore check again; this confirms the actual post-cutover data. Preserve the pre-migration backup
for recovery. Do not claim this post-deploy check as the proof that authorized the preceding
migration.
Retired operations snapshots/services are not altered by local code removal. Their eventual
retirement must be explicit; preserve any shared Restic data and application timers.
