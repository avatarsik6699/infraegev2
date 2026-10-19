# CHANGE 196 — Off-site backups in Yandex Object Storage

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `196` |
| Slug | `offsite-backups` |
| Title | Off-site backups in Yandex Object Storage |
| Status | `active` |
| Branch | `feature/196-offsite-backups` |

---

## Goal

Same-host Restic backups do not survive loss of the VPS, and off-site storage is a prerequisite
for paid access (`docs/runbooks/billing.md` launch checklist 2). After every successful local
backup, the snapshot is copied with `restic copy` to an off-site Restic repository in the
prepared Yandex Object Storage bucket `kodumka-backup-app`. The copy keeps the same retention and
recovery-hold. A weekly check and the monthly isolated restore read the off-site copy, and any
failure is visible (SPEC §8 «Backup / restore», v2.33). Part of release plan
`~/.claude/plans/distributed-popping-sunset.md` step 4 (P1).

Already in place (2026-10-19, outside the repo):
- Bucket: versioned; lifecycle `keep-deleted-30d`; 50 GB cap.
- Service account `kodumka-backup-app`: bucket ACL read+write, narrowed by the bucket policy. The
  key can put, list, get and delete objects (a delete only leaves a delete marker). It cannot
  delete or list versions, or change versioning, lifecycle or policy.
- Keys in athanor: `BACKUP_S3_ACCESS_KEY_ID` / `BACKUP_S3_SECRET_ACCESS_KEY`.
- The single Restic password for both repositories, also used by the monitoring host, is in
  athanor `RESTIC_PASSWORD`; it is the same value as `/etc/infraege/restic-password`.

---

## Backlog

### Infra
- [x] `I1` Root-only off-site credentials file `/etc/infraege/offsite-backup.env`:
  - Owner `0:0`, mode 600, not a symlink.
  - Keys: `OFFSITE_RESTIC_REPOSITORY` (`s3:https://storage.yandexcloud.net/kodumka-backup-app`),
    `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION=ru-central1`.
  - Loaded by one shared helper (`scripts/lib/offsite-backup.sh`). The helper refuses a wrong
    owner or mode and never prints values.
  - The credentials stay separate from `production.env`, which is rendered into Compose, so the
    keys never reach a container.
  - — _Depends on:_ —
- [x] `I2` `scripts/backup.sh`: after the local backup succeeds, under the same Restic lock:
  - Initialise the off-site repository if it is missing, using `--from-repo` and
    `--copy-chunker-params`.
  - `restic copy --from-repo <local> --tag infraege-application`. This also catches up any
    snapshots a failed day missed.
  - Authenticate that the new snapshot exists off-site (match its `original` ID).
  - Apply the same `forget --prune` policy with `--keep-tag infraege-recovery-hold`.
  - Write `/var/lib/infraege/offsite-backup-status.json`: status, completedAt, local and off-site
    snapshot IDs, `maxAgeHours: 36`.
  - On failure, record a failed status and exit non-zero, so the systemd unit fails. The local
    backup and its status stay valid.
  - Without the credentials file, record `not-configured` and leave the local behaviour unchanged.
  - — _Depends on:_ I1
- [x] `I3` Weekly `infraege-offsite-check.{service,timer}`:
  - Runs `restic check --read-data-subset` on the off-site repository under the shared lock.
  - Writes a status file; a failure fails the unit.
  - Installed by `ops/install-backup-timers.sh`; skipped cleanly while off-site is not configured.
  - — _Depends on:_ I1
- [x] `I4` `scripts/restore-check.sh` selects the source repository via `RESTORE_SOURCE`
  (`local`, `offsite`, or `auto`):
  - `auto` means off-site when configured, otherwise local.
  - The monthly timer uses `auto`.
  - `restore-status.json` records the source.
  - `make db-restore-check` can force either source.
  - — _Depends on:_ I1
- [x] `I5` `scripts/db-inventory.sh` prints the off-site backup and check status next to the local
  one (status, completedAt, maxAgeHours only). — _Depends on:_ I2, I3
- [x] `I6` Backup summary for the `smotryashchiy` «Backups» view (architect 2026-10-19; no Telegram).
  - Written hourly and after every backup, off-site copy, check and restore job.
  - Path: `/var/lib/infraege/ops/backups.json`, written atomically, mode 640, in the schema
    `smotryashchiy.backup/1` defined by smotryashchiy Change 29.
  - Contents:
    - local backup: age, status, snapshot count, repository size;
    - off-site copy: age and status, or `not-configured`;
    - last off-site check;
    - last restore drill: age, source, duration;
    - recovery holds and their age;
    - free space on the backup filesystem;
    - failed backup-related systemd units.
  - Counts, sizes and times only: no snapshot contents, paths of personal data or secrets.
  - The agent ships it as a document; its flag is set at the release.
  - — _Depends on:_ I2, I3, I4
- [x] `I7` Stale data on the production host (the image removal after the hold review moved to the
  general release checklist, architect 2026-10-19) (architect approved removal 2026-10-19):
  - Done 2026-10-19: removed `/var/backups/infraege/initial-bank-*`, the 12 MB leftover of the
    September bank import.
  - Done 2026-10-19 by the architect: removed `/root/infraege-cutover` (404 MB rehearsal
    checkouts) and ran `apt-get clean` (539 MB); the disk went from 9.6 GB to 8.6 GB used.
  - After the recovery-hold review (on or after 2026-10-26): remove the rehearsal-candidate API
    images `3cb84fb…`, `e618a49…` and `b3b6fc34…` (about 1.1 GB). Keep them until then, because
    the held 2026-09-25 snapshot may need them.
  - Keep: the pinned `postgres` image (it serves the live database) and the three releases with
    their archives (deploy retention keeps them for rollback).
  - — _Depends on:_ —

### Other
- [x] `T1` Tests:
  - Extend `scripts/tests/backup-retention.test.sh` (fake restic):
    - copy and forget run off-site with the hold kept;
    - a copy failure leaves the local status valid, records an off-site failure and exits
      non-zero;
    - a missing credentials file gives `not-configured`;
    - a credentials file with the wrong mode is refused.
  - Extend `backup-restic-integration.test.sh` (real `restic/restic:0.16.4`, two local
    repositories):
    - copy with chunker params, `original` matching, and catch-up of a missed snapshot;
    - the recovery hold survives off-site retention.
  - Restore source selection in `backup-restore.test.sh`.
  - — _Depends on:_ I2, I3, I4
- [x] `T2` Docs:
  - `docs/runbooks/backup-restore.md`:
    - remove the «accepted unresolved risk» wording;
    - off-site setup: write the credentials file from athanor over SSH, never echoing values;
    - Restic password custody: athanor `RESTIC_PASSWORD`, shared with the monitoring host;
    - releasing a recovery hold in both repositories (the off-site ID differs; find it by
      `original`);
    - disaster recovery on a fresh host from the off-site repository.
  - `docs/runbooks/production.md`: bootstrap step.
  - `docs/runbooks/billing.md`: checklist item 2 points to this procedure.
  - STACK Operations contracts list, if a new test file appears.
  - — _Depends on:_ I1–I5
- [x] ~~`T3`~~ (moved to the general release checklist with the `/ship --release` of Changes
  192–197, architect 2026-10-19) Production rollout, done at the general release with the architect's permission:
  - write the credentials file from athanor;
  - run one backup by hand and confirm both status files;
  - run `RESTORE_SOURCE=offsite` restore-check;
  - install the new timer.
  - — _Depends on:_ T2

---

## Files

### Create / modify
~~~
scripts/lib/offsite-backup.sh                      (create)
scripts/backup.sh
scripts/restore-check.sh
scripts/db-inventory.sh
scripts/offsite-check.sh                           (create)
ops/systemd/infraege-offsite-check.service         (create)
ops/systemd/infraege-offsite-check.timer           (create)
ops/systemd/infraege-restore-check.service
ops/install-backup-timers.sh
Makefile                                           (restore source passthrough, if needed)
scripts/tests/backup-retention.test.sh
scripts/tests/backup-restic-integration.test.sh
scripts/tests/backup-restore.test.sh
docs/runbooks/backup-restore.md
docs/runbooks/production.md
docs/runbooks/billing.md
docs/STACK.md
docs/SPEC.md                                       (v2.33 — done by /plan)
~~~

### Do NOT touch
- `apps/`, `infra/compose*`, `infra/nginx/` — the application runtime is unchanged.
- `/etc/infraege/production.env` contract and `scripts/render-production-config.sh`: no S3
  keys there.
- Bucket settings, IAM and the `smotryashchiy` repository. smotryashchiy Change 29 covers:
  - the «Backups» view and the `smotryashchiy.backup/1` schema;
  - the monitoring host's own backups: the daily SQLite copy to `kodumka-backup-monitoring`, with
    no local copies kept, the minimal retention, and 3-day retention of deleted versions in that
    bucket.

---

## Contracts

See `docs/SPEC.md` §8 «Backup / restore» (v2.33), `docs/runbooks/backup-restore.md` and the
Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

None

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| d127f6a (+ working tree) | `gate.py run`: shell-lint, docs-links, infra-config; contracts backup-retention, backup-restore, billing-jobs, account-retention; real Restic `backup-restic-integration.test.sh`; `systemd-analyze verify` of the new units (coverage decision: no gate rule matches `ops/systemd/*`) | PASS | ~2.2 + 60 |

---

## Implementation Notes

- A failed off-site copy also fails a deploy's pre-migration backup, so the deploy stops before
  migrating. The held pre-migration point must leave the host first. Without the credentials file
  the copy is `not-configured` and blocks nothing; the runbook says how to deploy deliberately
  during a storage outage.
- The credentials file is parsed (four allowed keys), never sourced, so it cannot run code.
- `restic copy` keeps the source ID in `original`. This was proven against real Restic 0.16.4,
  together with chunker parameters, catch-up of a missed day and the hold surviving off-site
  retention. Releasing a hold therefore needs the off-site ID found by `original` (runbook).
- The backup summary is built from status files only (no Restic, no password). Jobs record their
  repository facts (snapshot count, raw size, holds) when they run.
- `I7` stays open: the three rehearsal-candidate API images go after the recovery-hold review (on or
  after 2026-10-26).

---

## Commit Message

```
feat(change-196): off-site Restic copy — S3 copy, weekly check, restore
```
