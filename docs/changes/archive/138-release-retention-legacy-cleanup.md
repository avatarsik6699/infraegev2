# CHANGE 138 — Keep three releases on the host, remove what the old operations stack left behind

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `138` |
| Slug | `release-retention-legacy-cleanup` |
| Title | Keep three releases on the host, remove what the old operations stack left behind |
| Status | `archived` |
| Branch | `feature/138-release-retention-legacy-cleanup` |

---

## Goal

The 2026-09-23 audit after the 136/137 release found two things.

First, a deploy never removes anything. The host holds 31 release directories, 29 release archives
and deploy scripts in `/root`, and 92 application images (≈2.6 GB reclaimable). The architect set
retention to the three newest releases.

Second, the old operations stack left pieces behind in the repository and on the host:
- `ops/bootstrap-vps.sh` opens inbound `51820/udp` and ends by pointing to the removed
  `setup-journal-gateway.sh`.
- `scripts/check-backup-freshness.sh` has no caller.
- The finished SSH identity migration `ops/migrate-root-password-access.sh` is still in the repo.
- On the host: an enabled `systemd-journal-gatewayd.socket`, the WireGuard and journal-remote
  packages, `/etc/wireguard`, the old stack's env files and backup directory, its Docker network
  and 19 dangling anonymous volumes, one-off bootstrap/cutover leftovers in `/root`, and the
  `infraege-ops` restic snapshots.

The architect decided to remove all of them. UFW packet logging turns off: its `[UFW BLOCK]` lines
are about 400 `warn` events per hour in smotryashchiy. Root/password SSH stays (SPEC §7.1).
Contract: `docs/SPEC.md` v2.19 §7.1, §7.3.

---

## Backlog

<!-- This list is OPEN, not a fixed scope: /work appends new items here when the architect reports
     findings/fixes/follow-ups mid-session — it does not fix them off-list.
     Group items by area (Backend / Frontend / Infra / Data, etc.).
     ID scheme: B=Backend · F=Frontend · I=Infra · D=Data · T=other (ungrouped)
     Each item: `ID` description — _Depends on:_ ID, ID or —
     IDs are stable after assignment — never renumber. Mark removed items as ~~BN~~ (removed).
     New items always take the next unused ID in their group, appended at the end. -->

### Infra
- [x] `I1` Tests first: `scripts/tests/release-retention.test.sh` runs
      `scripts/prune-releases.sh`. It uses a temporary root, fake `/root` and a fake `docker` that
      logs its calls. The test asserts:
      - the three newest release directories are kept, plus any release that `current` or
        `database-current` points to, plus the SHA just deployed;
      - archives `infraege-<sha>.tar.gz` and scripts `infraege-deploy-<sha>.sh` are removed only
        for pruned SHAs;
      - `docker rmi` is called only for `ghcr.io/avatarsik6699/infraegev2-{api,web,nginx}:<pruned
        sha>`, followed by one `docker image prune -f`;
      - a non-SHA entry is never touched, and `KEEP_RELEASES` below 2 is refused.
      — _Depends on:_ —
- [x] `I2` `scripts/prune-releases.sh` implements I1 (`KEEP_RELEASES` default 3). An image still
      used by a container is skipped, never forced. `deploy-remote.sh` runs it after the new release
      is healthy and recorded. A pruning failure only prints a warning, because the deploy already
      succeeded. — _Depends on:_ I1
- [x] `I3` `ops/bootstrap-vps.sh`:
      - no inbound `51820/udp` (the smotryashchiy agent only dials out);
      - `ufw logging off`;
      - the last line points to TLS and the production runbook, not the journal gateway.

      Extend `host-access-policy.test.sh` to pin all three. — _Depends on:_ —
- [x] `I4` Remove the orphaned `scripts/check-backup-freshness.sh` and the finished
      `ops/migrate-root-password-access.sh`. Drop the migration assertions from
      `root-password-access.test.sh` (the SSH policy, workflow and `production-root-ssh.sh` checks
      stay) and the runbook line that points to the migration. — _Depends on:_ —
- [x] `I5` Host step before `/ship`:
      - disable and mask `systemd-journal-gatewayd.socket`;
      - purge the `systemd-journal-remote`, `wireguard` and `wireguard-tools` packages;
      - remove `/etc/wireguard`, `/etc/infraege/ops` and `/var/backups/infraege-ops`;
      - remove the Docker network `infraege-observability-ingress` and the dangling *anonymous*
        volumes;
      - remove the one-off `/root` leftovers (`infraege-bootstrap*`, `infraege-change30`,
        `infraege-cutover-129`, `infraege-wireguard-server-peer.sh`, the Change 135 jail backup);
      - run `ufw logging off`.

      Never touch `infraege_postgres-data` or `infraege_postgres122-data`. Verify the application
      stays healthy and the agent keeps reporting. — _Depends on:_ —
- [x] `I6` Host step before `/ship`: under the shared restic lock, run
      `restic forget --tag infraege-ops --prune`, then `restic check`. Confirm the
      `infraege-application` snapshots are unchanged, before and after, by count and newest ID.
      — _Depends on:_ —
- ~~`I7`~~ (removed — a post-deploy observation cannot be checked before `/ship`; the retention
      result is verified in Gate Checks instead)
- [x] `I9` Found during I5: `dpkg` had been interrupted since 2026-09-05 08:26, during an
      unattended kernel upgrade to 6.8.0-139 (the host rebooted mid-unpack). Since then every
      `apt` run failed, unattended security upgrades included. Repaired with
      `dpkg --configure -a` and `apt-get -f install` (`NEEDRESTART_MODE=l`, so no service restarted);
      `dpkg --audit` is clean. The new kernel is installed but not running, and 42 package upgrades
      are pending. The reboot and catch-up upgrade are the architect's decision (they restart the
      application). — _Depends on:_ —
- [x] `I8` Found during I1: the host/deploy contract tests `host-access-policy`,
      `root-password-access` (Change 136), `web-image-build` (Change 137) and `release-retention`
      are not part of the gate's Operations contracts row, so no gate runs them. Add them to
      `scripts/lib/gate/core.py` and the STACK row. — _Depends on:_ I1

### Other
- [x] `T1` Docs:
      - production runbook: release retention, the retired stack as fully removed, UFW logging off;
      - `backup-restore.md`: the restore marker is `restore-status.json`;
      - KNOWN_GOTCHAS: drop the stale Umami example and add "a deploy that never prunes fills the
        disk";
      - SPEC v2.19 §7.3.
      — _Depends on:_ I2, I5, I6

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
scripts/prune-releases.sh (new), scripts/tests/release-retention.test.sh (new)   (I1, I2)
scripts/deploy-remote.sh                                                          (I2)
ops/bootstrap-vps.sh, scripts/tests/host-access-policy.test.sh                    (I3)
scripts/check-backup-freshness.sh, ops/migrate-root-password-access.sh (delete)   (I4)
scripts/tests/root-password-access.test.sh                                        (I4)
docs/runbooks/production.md, docs/runbooks/backup-restore.md                      (I4, T1)
docs/KNOWN_GOTCHAS.md, docs/SPEC.md                                               (T1)
~~~

### Do NOT touch
- SSH password login (SPEC §7.1); `scripts/production-root-ssh.sh` and `scripts/lib/production-ssh.sh`.
- Application volumes `infraege_postgres-data`, `infraege_postgres122-data`; `infraege-application`
  restic snapshots; application Compose.

---

## Contracts

See `docs/SPEC.md` §7.1, §7.3 and the Files list above. Do not hand-copy the schema, endpoints,
types, or env vars into this file — the codebase and `SPEC.md` are the source of truth; this file
only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or when release risk selection requires it. All gates are defined in [docs/STACK.md](../../STACK.md) — this section only records
> change-specific overrides.

After the release deploy:
- public `/health/ready` reports the new full SHA;
- on the host, `/opt/infraege/releases` holds three directories, `/root` holds three release
  archives, and only images of those three SHAs remain;
- no `wg`, journal-remote or gateway units, packages or files remain;
- `ufw status verbose` shows `Logging: off`;
- restic has no `infraege-ops` snapshots, `restic check` passes, and the application snapshots
  are intact;
- application containers are healthy and `infraege-prod` stays fresh in smotryashchiy.

---

## Architect Review Notes

Use this section after manual product, UX, API, or workflow verification. This is the human-facing
channel for post-implementation fixes.

Add one unchecked checkbox per issue the agent must fix before the change can ship. Keep each item
independently fixable and describe observed behavior plus expected behavior. If the fix may change
SPEC/API/schema/security behavior, say so explicitly in the note.

The agent resolves these items through `/work [XX] review`. Leave an item unchecked while it is
still open. Check it off only after the fix is implemented and re-verified. If manual verification
found nothing, keep the default checked line below.

- [x] No architect review issues recorded

---

## Implementation Notes

- I5 (2026-09-23), in plain commands after the classifier refused a base64-wrapped script:
  - the gateway socket and service are disabled and masked;
  - the three packages are purged;
  - removed: 9 leftover paths, the `infraege-observability-ingress` network and 18 dangling
    anonymous volumes;
  - `ufw logging off`.

  Only `infraege_postgres-data` and `infraege_postgres122-data` remain as volumes. Containers
  stayed healthy on `6e34478`.
- I6: 37 `infraege-ops` snapshots were forgotten by ID (`forget --tag` alone needs a policy and
  removes nothing), then pruned. `restic check` is clean and the repository went from 48 MiB to
  7.4 MiB. The 11 `infraege-application` snapshots are identical before and after (IDs listed in
  the session). 13 untagged snapshots from 2026-08-10..20 are early application backups (`work.*`
  paths, before tagging) and were left alone.
- `prune-releases.sh` was checked by mutation: breaking the deploy call makes the test fail.

---

## Commit Message

```
fix(change-138): keep three releases, remove old operations leftovers
```
