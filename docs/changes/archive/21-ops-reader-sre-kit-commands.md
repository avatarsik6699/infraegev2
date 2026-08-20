# CHANGE 21 — Extend ops-reader's forced command for sre-kit's SSH adapters

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `21` |
| Slug | `ops-reader-sre-kit-commands` |
| Title | Extend ops-reader's forced command for sre-kit's SSH adapters |
| Status | `archived` |
| Branch | `feature/21-ops-reader-sre-kit-commands` |

---

## Goal

The `ops-reader` SSH key's forced command (`ops/bin/infraege-ops-query`, `restrict,command=...` in
its `authorized_keys`) only recognized three keywords built for the retired `apps/ops` integration
(`fail2ban-status`, `backup-status`, `deploy-status`). sre-kit's `fail2ban-ssh` and
`host-metrics-ssh` adapters send their own fixed remote commands directly (not a keyword) — the
exact `tail -n 2000 /var/log/fail2ban.log` and a fixed `/proc/stat`+`/proc/meminfo`+`df` script —
found unreachable (`exit 64`, "unsupported operation") when live-testing sre-kit against this VPS.
This change extends the wrapper to also recognize those two exact commands, keeping `ops-reader`
read-only and keeping the forced-command restriction (no general shell access granted).

---

## Backlog

### Infra
- [x] `I1` `ops/bin/infraege-ops-query` — recognize sre-kit's exact `fail2ban-ssh` tail command and `host-metrics-ssh` sample script (byte-exact match against `adapters/host-metrics-ssh/main.go`'s `sampleScript` in the sre-kit repo, verified via a Python extraction + ANSI-C-quoted bash literal, not hand-transcribed) — _Depends on:_ —
- [x] `I2` `ops/sudoers/infraege-ops-reader` — add `NOPASSWD: /usr/bin/tail -n 2000 /var/log/fail2ban.log` (host-metrics's script needs no elevated privilege — `/proc/stat`, `/proc/meminfo`, `df -P /` are world-readable) — _Depends on:_ —

### Deploy (manual — outside agent-executable scope, see Implementation Notes)
- [ ] `I3` Deploy the updated wrapper + sudoers file to the production VPS and reload sudoers — _Depends on:_ `I1`, `I2`

<!-- Test execution is governed by docs/STACK.md's Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify
```
ops/bin/infraege-ops-query
ops/sudoers/infraege-ops-reader
docs/changes/21-ops-reader-sre-kit-commands.md
```

### Do NOT touch
- Anything under `apps/` — this is purely the VPS-side ops-reader forced command, unrelated to the retired `apps/ops` dashboard (change-19) or the tunnel script (change-20)

---

## Contracts

No API/schema contract — this is a server-side SSH forced-command whitelist. Contract is the exact
command strings matched: `tail -n 2000 /var/log/fail2ban.log` (fail2ban-ssh) and the literal
`sampleScript` constant in sre-kit's `adapters/host-metrics-ssh/main.go` (host-metrics-ssh). If
either sre-kit adapter's remote command ever changes, this file's matching literal must be
regenerated to match — a silent mismatch just means "unsupported operation" again, not a crash.

---

## Gate Checks

`bash -n ops/bin/infraege-ops-query` (syntax) and `visudo -c -f ops/sudoers/infraege-ops-reader`
(sudoers syntax) — both PASS locally (see Implementation Notes). No automated test suite covers
this VPS-side script; verification is functional (exact-match tests run locally against fixture
`SSH_ORIGINAL_COMMAND` values, documented below) plus a live re-test of sre-kit's two SSH sources
after deploy.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- **This change's `I3` (actual VPS deploy) was not executed by the agent** — writing to
  `/usr/local/bin/infraege-ops-query` and `/etc/sudoers.d/infraege-ops-reader` on the production
  VPS requires root over SSH with the `deploy` key, which this session's safety classifier blocked
  automatically (root/production-write actions are out of agent-autonomous scope by design). The
  architect must run the deploy manually — see the chat message accompanying this change for the
  exact `scp`/`ssh` commands.
- Local verification performed: `bash -n` syntax check; the two new exact-match branches tested
  with `SSH_ORIGINAL_COMMAND` set to (a) the literal fail2ban tail string and (b) the byte-exact
  `host-metrics-ssh` script (extracted via a Python script from sre-kit's actual source, not
  hand-typed, to guarantee no transcription drift) — both matched and executed correctly; an
  unrecognized command still correctly falls through to `exit 64`; the pre-existing `deploy-status`
  keyword still works unchanged.
- A `read -r -d '' var <<'EOF'` heredoc was tried first for the host-metrics script literal and
  silently dropped exactly one leading and one trailing newline, which would have made the
  comparison always fail after deploy with no error at edit time. Replaced with a
  Python-script-generated ANSI-C-quoted (`$'...'`) literal, verified byte-exact via `diff` against
  the source-extracted reference before being written into the file.

---

## Commit Message

```
fix(change-21): extend ops-reader forced command for sre-kit's SSH adapters
```
