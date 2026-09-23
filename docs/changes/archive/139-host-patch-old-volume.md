# CHANGE 139 — Patch and reboot the host, remove the old database volume and untagged snapshots

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `139` |
| Slug | `host-patch-old-volume` |
| Title | Patch and reboot the host, remove the old database volume and untagged snapshots |
| Status | `archived` |
| Branch | `feature/139-host-patch-old-volume` |

---

## Goal

Change 138 found that `dpkg` on infraege.ru had been interrupted since 2026-09-05, which silently
stopped unattended security upgrades. It also left two items to the architect: 13 untagged early
restic snapshots, and the pre-Change-122 volume `infraege_postgres-data`, which SPEC §7.3 still
protected. On 2026-09-23 the architect decided:
- upgrade and reboot the host now;
- delete the untagged snapshots;
- delete the old volume if it holds nothing important.

This change records those host operations and brings SPEC and the runbook in line with them. No
code or configuration changes. Contract: `docs/SPEC.md` v2.20 §7.3.

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
- [x] `I1` Inspect `infraege_postgres-data` read-only. Start a throwaway `postgres:16-alpine`
      with `--network none`, and count rows exactly per table (`count(*)`; `pg_stat` counters reset
      on start). If nothing of value is found, remove the volume and the inspection image.
      — _Depends on:_ —
- [x] `I2` Under the shared restic lock, forget the untagged snapshots by ID, then prune and
      `restic check`. The `infraege-application` snapshots must be unaffected. — _Depends on:_ —
- [x] `I3` Run `full-upgrade` of all pending packages (`NEEDRESTART_MODE=l`, keep existing config
      files), then a planned reboot. Verify:
      - the new kernel is running and no reboot is pending;
      - no failed units;
      - Docker, the agent, fail2ban and ssh are active;
      - application containers are healthy, and public `/health/ready` reports `d273dd5`;
      - backup timers are scheduled and no legacy listeners exist.

      — _Depends on:_ —

### Other
- [x] `T1` SPEC v2.20 §7.2/§7.3 (old volume gone, rollback shares `infraege_postgres122-data`), the
      production runbook (rollback wording; routine `dpkg --audit` / pending-reboot check) and a
      KNOWN_GOTCHAS entry on interrupted unattended upgrades. — _Depends on:_ I1, I2, I3

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
docs/SPEC.md, docs/runbooks/production.md, docs/KNOWN_GOTCHAS.md   (T1)
~~~

### Do NOT touch
- `infraege_postgres122-data` and the `infraege-application` snapshots.
- Application code, Compose, deploy scripts.

---

## Contracts

See `docs/SPEC.md` §7.2, §7.3 and the Files list above. Do not hand-copy the schema, endpoints,
types, or env vars into this file — the codebase and `SPEC.md` are the source of truth; this file
only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or when release risk selection requires it. All gates are defined in [docs/STACK.md](../../STACK.md) — this section only records
> change-specific overrides.

Documentation only. The host results are recorded in Implementation Notes.

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

- I1: `infraege_postgres-data` (PostgreSQL 16, created 2026-08-10, 71 MB, unused since the
  2026-09-20 cutover). Its `infraege` database had no tables. Its `umami` database held the
  retired Umami's test data: 104 `website_event`, 40 `session`, 14 `event_data`, 1 website and
  1 user. Removed together with the `postgres:16-alpine` inspection image. The only volume left
  is `infraege_postgres122-data`.
- I2: 13 untagged snapshots from 2026-08-10..20 (`work.*` paths, before tagging) were forgotten and
  pruned; `restic check` is clean. The repository holds 11 `infraege-application` snapshots in
  2.2 MiB. The newest is `11d6f041`, made by the d273dd5 deploy; the application's own policy
  had already rotated `d1a549fb` away.
- I3: `full-upgrade` applied 81 pending packages (config files kept, no services restarted); one
  phased update remains held by apt. Reboot at 18:30:55 UTC; the site answered `ok` 75 s after
  the command. The host now runs kernel 6.8.0-142 (138 before), with no pending reboot and no
  failed units. Containers came back through `restart: always`, and both smotryashchiy hosts
  stayed fresh.

---

## Commit Message

```
docs(change-139): record host patch, old volume and snapshot removal
```
