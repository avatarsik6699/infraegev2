# CHANGE 136 — Host hardening, retire the old ops stack, accurate analytics notice

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `136` |
| Slug | `host-hardening-retire-ops` |
| Title | Host hardening, retire the old ops stack, accurate analytics notice |
| Status | `active` |
| Branch | `feature/136-host-hardening-retire-ops` |

---

## Goal

The 2026-09-23 audit of infraege.ru (from the smotryashchiy side) found four things in this repo's
area. The old monitoring stack `infraege-ops` (Umami, Beszel and its agent, docker-socket-proxy, its
own PostgreSQL, three `infraege-ops-*` timers) still runs on the host two weeks after smotryashchiy
replaced it; it receives no events and holds ~350 MiB RAM. The architect decided to remove it
completely, volumes included (SPEC §7.3). SSH keeps root/password login by architect decision; it
gets growing bans for repeat offenders. The `/privacy` analytics paragraph no longer describes what
the snippet sends. The production runbook still says no browser analytics exists and does not
mention the smotryashchiy agent. The release also carries Change 135, which is only on local
`main`. Contract: `docs/SPEC.md` v2.18 §7.1, §7.3.

---

## Backlog

<!-- This list is OPEN, not a fixed scope: /work appends new items here when the architect reports
     findings/fixes/follow-ups mid-session — it does not fix them off-list.
     Group items by area (Backend / Frontend / Infra / Data, etc.).
     ID scheme: B=Backend · F=Frontend · I=Infra · D=Data · T=other (ungrouped)
     Each item: `ID` description — _Depends on:_ ID, ID or —
     IDs are stable after assignment — never renumber. Mark removed items as ~~BN~~ (removed).
     New items always take the next unused ID in their group, appended at the end. -->

### Frontend
- [x] `F1` `/privacy` analytics paragraph matches smotryashchiy v0.2.4: the browser sends the page
      path and the referring address; the service keeps only the path without parameters and the
      referrer's domain, and derives browser/OS/device type from the standard browser header. Keep
      the rest of the paragraph (no cookie, no persistent id, daily-rotating hash, raw IP not stored,
      aggregate use only) and update the "Актуально на" date. Unit/e2e expectations updated if they
      pin this text; browser check with Playwriter. — _Depends on:_ —

### Infra
- [x] `I1` `ops/fail2ban/jail.d/infraege.conf`: add `bantime.increment = true` and
      `bantime.maxtime = 1w` to `[DEFAULT]`; add a contract test that the jail file keeps the sshd
      jail enabled with `backend = systemd`, `maxretry = 5` and the increment, and that
      `ops/sshd/20-infraege-root-password.conf` keeps `MaxAuthTries 3` / `LoginGraceTime 30`
      (password login stays by decision). — _Depends on:_ —
- [x] `I2` `infra/nginx/conf.d/infraege.prod.conf`: raise proxy buffers at server level
      (`proxy_buffers 16 32k`, `proxy_busy_buffers_size 64k`) so immutable JS bundles and fonts
      (up to ~250 KiB) stop spilling to `proxy_temp` (13 `[warn]` lines in 72 h). `nginx -t` through
      the existing config tests. — _Depends on:_ —
- [x] `I3` `docs/runbooks/production.md`: replace the outdated "no browser analytics" and
      "Umami/Beszel/sre-kit not stopped" text; document the smotryashchiy agent on this host
      (unit, config path, checksum-verified update from its GitHub Release, rollback binary), the
      Change 136 fail2ban apply step, and the retirement procedure below as done. — _Depends on:_ I1
- [x] `I4` Release-time host step (after the deploy is verified): apply I1 on the host (install the
      jail file, `fail2ban-client reload`, confirm the sshd jail). Then retire `infraege-ops`:
      inventory its compose project, containers, timers/services, volumes and `/opt/infraege-ops`;
      confirm where its last encrypted backup lives and report it; stop and disable the three
      timers and their services, `docker compose down` the project, remove its volumes
      (`infraege-ops_*` and the orphaned `infraege_beszel-*`), images and `/opt/infraege-ops`.
      Never touch `infraege_postgres-data` or `infraege_postgres122-data`. Verify the application
      stays healthy and the smotryashchiy agent keeps reporting. — _Depends on:_ I1
- [x] `I5` Host cleanup: remove `/usr/local/bin/smotryashchiy.bak-v0.2.2` once the v0.2.3 agent
      has run cleanly (it has since 2026-09-23 12:25). — _Depends on:_ —
- [x] `I6` Found during I1: `scripts/tests/root-password-access.test.sh` fails on `main` — it still
      greps and `bash -n`-checks `ops/setup-journal-gateway.sh`, removed by Change 122 (SPEC §7.3: no
      journal HTTP gateways). The test is not in the Full Gate rows, so nothing noticed. Drop those
      three stale references; the rest of the test must pass unchanged. — _Depends on:_ —

### Other
- [x] `T1` `docs/KNOWN_GOTCHAS.md`: a retired host stack is not retired until its timers are
      disabled — the `infraege-ops` stack kept running and backing up for two weeks after the repo
      removed it. — _Depends on:_ I4

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
apps/web/src/pages/privacy/privacy-page.tsx (+ tests pinning its text, if any)   (F1)
ops/fail2ban/jail.d/infraege.conf                                                 (I1)
scripts/tests/host-access-policy.test.sh                                          (I1, new)
scripts/tests/root-password-access.test.sh                                        (I6)
infra/nginx/conf.d/infraege.prod.conf                                             (I2)
docs/runbooks/production.md                                                       (I3, I4)
docs/KNOWN_GOTCHAS.md                                                             (T1)
docs/SPEC.md                                                                      (§7.1, §7.3 — done by /plan)
~~~

### Do NOT touch
- SSH password login (`ops/sshd/20-infraege-root-password.conf` semantics) — kept by decision.
- Application volumes `infraege_postgres-data`, `infraege_postgres122-data`; application Compose.
- CSP and the analytics snippet (Change 133); smotryashchiy itself (separate repo).

---

## Contracts

See `docs/SPEC.md` §7.1, §7.3 and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or when release risk selection requires it. All gates are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

After the release deploy: public `/health/ready` reports the new full SHA; `/privacy` shows the new
text; on the host `fail2ban-client get sshd bantime.increment` is true, no `infraege-ops` container,
timer, volume or directory remains, application containers are healthy, and the smotryashchiy
dashboard still shows `infraege-prod` fresh. No `proxy_temp` warnings for `/assets/` or `/fonts/`
after a page load.

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

- I4/I5 ran on the host before `/ship` by architect direction (2026-09-23): jail installed
  (previous file kept as `/root/infraege-jail.conf.bak-change135`), sshd jail reloaded with growing
  bans; `infraege-ops` containers, 5 volumes, images, 6 units and `/opt/infraege-ops` removed;
  `wg-quick@wg0` disabled and its ufw rules (51820/udp, 19531) removed, `/etc/wireguard` kept;
  the last restic snapshots tagged `infraege-ops` stay in the shared repository (not pruned).
  Application containers stayed healthy on 2cf106e throughout.
- F1 checked in a real browser with Playwriter at 1280 and 360 px (no horizontal scroll, no
  console errors).
- Release coverage: Full Gate (release_checkpoint.py from Change 135 and infra/ops paths are in
  the diff against production 2cf106e) on a fresh isolated database; decision `ready`.

---

## Commit Message

```
fix(change-136): retire ops stack, fail2ban increment, privacy text
```
