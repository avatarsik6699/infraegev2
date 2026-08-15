# CHANGE 19 — Retire the local `apps/ops` dashboard

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `19` |
| Slug | `retire-ops-dashboard` |
| Title | Retire the local `apps/ops` dashboard |
| Status | `active` |
| Branch | `feature/19-retire-ops-dashboard` |

---

## Goal

`apps/ops` (local Node BFF + React/Mantine dashboard, reached over WireGuard) is being fully
replaced by the external `sre-kit` tool, which now covers its observability surface (host
metrics, fail2ban, journal logs incl. structured-log parsing, uptime, Umami traffic incl. event
funnels — see sre-kit's changes 08–13). `apps/ops` has zero production footprint and no data
worth preserving (per architect: "сейчас в apps/ops нет никаких важных для меня данных"). This
change removes the package and every reference to it so the workspace, CI, Makefile, and docs
stop assuming it exists.

---

## Backlog

### Infra
- [x] `I1` Delete `apps/ops/` entirely (package, `dist/`, `node_modules/`, `.eslintcache`) — _Depends on:_ —
- [x] `I2` Remove `"apps/ops"` from `pnpm-workspace.yaml`; run `pnpm install` to regenerate `pnpm-lock.yaml` — _Depends on:_ `I1`
- [x] `I3` Remove the "Operations dashboard static checks" step from `.github/workflows/quality.yml` — _Depends on:_ —
- [x] `I4` Remove `scripts/ops-local.sh` and the `ops-*` Makefile targets/`.PHONY` entries/help text that depend on it (`ops-init`, `ops-up`, `ops-down`, `ops-status`, `ops-logs`, `ops-tunnel-up`, `ops-tunnel-down`); update `clean` target to drop the `apps/ops/dist apps/ops/.eslintcache` line. Keep `ops-open-beszel`, `ops-open-umami`, `ops-configure-beszel-agent`, `ops-repair-beszel-env` (they don't depend on `apps/ops`) — _Depends on:_ —
- [x] `I5` Remove `"./apps/ops"` from `.vscode/settings.json`'s `eslint.workingDirectories` — _Depends on:_ —

### Docs
- [x] `D1` `docs/STACK.md` — remove the ops row from the stack table (~L29), the ops mention in package managers (~L31), the `ops` columns from Critical/Full Gate tables (~L125-127, 147, 150), the ops-specific jsdom testing-policy note (~L244), `apps/ops/` from the project-structure tree (~L271), the ops-dashboard mention in the architecture note (~L322), and delete the "Operations application (`apps/ops/`)" section wholesale (~L346-374) — _Depends on:_ `I1`
- [x] `D2` `docs/SPEC.md` — rewrite the WireGuard/`apps/ops` topology note (~L405-406) and the `apps/ops` bullet under Наблюдаемость (~L441-443) to describe sre-kit instead; update the Observability NFR row (~L456) — _Depends on:_ —
- [x] `D3` `docs/INFRASTRUCTURE_BLUEPRINT.md` — drop the "Local operations lifecycle" table row (~L442) — _Depends on:_ `I4`
- [x] `D4` `docs/KNOWN_GOTCHAS.md` — delete the three ops-only sections wholesale (journald ranges/private SSH ~L263-273, history range ~L275-286, Beszel MiB/GB ~L287-295); update the two shared gotchas that use `apps/ops` as an example (VS Code ESLint TSConfig root ~L28-40, split Vite+tsc entrypoint ~L69-78) to drop the now-nonexistent example without losing the general lesson — _Depends on:_ —
- [x] `D10` `docs/KNOWN_GOTCHAS.md` — delete the "WSL: an active Windows VPN does not create the infraege WireGuard route" gotcha wholesale (~L249-261): it's entirely instructions for the now-removed `make ops-tunnel-up`/`ops-up`/`ops-status` targets — _Depends on:_ `I4` <!-- found mid-implementation: this gotcha references removed Makefile targets, wasn't in the original survey's flagged list -->

- [x] `D5` Delete `docs/runbooks/monitoring.md` (wholly about `apps/ops`) — _Depends on:_ `I1`
- [x] `D6` `docs/runbooks/production-onboarding.md` — rewrite the `apps/ops` Umami-account note and the Beszel read-only-user note (both were more extensive than the original line estimate — full paragraphs, not one line each) to point at registering sre-kit sources instead — _Depends on:_ `D5`
- [x] `D7` `docs/runbooks/dns-tls.md` — reword the "ops dashboard" cross-reference (~L27) — _Depends on:_ —
- [x] `D8` `docs/runbooks/incident-response.md` — reword the "local ops dashboard source strip" cross-reference (~L6-7) — _Depends on:_ —
- [x] `D9` `README.md` — remove the `pnpm --filter ops build` sentence/snippet (~L196-200) and the `apps/ops` paragraph (~L252-255) — _Depends on:_ —

<!-- Test execution is governed by docs/STACK.md's Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify
```
pnpm-workspace.yaml
pnpm-lock.yaml
.github/workflows/quality.yml
Makefile
.vscode/settings.json
docs/STACK.md
docs/SPEC.md
docs/INFRASTRUCTURE_BLUEPRINT.md
docs/KNOWN_GOTCHAS.md
docs/runbooks/production-onboarding.md
docs/runbooks/dns-tls.md
docs/runbooks/incident-response.md
README.md
docs/changes/19-retire-ops-dashboard.md
```

### Delete
```
apps/ops/
scripts/ops-local.sh
docs/runbooks/monitoring.md
```

### Do NOT touch
- `apps/web/`, `apps/api/`, `contracts/` — no dependency on `apps/ops` found
- `docs/changes/archive/*.md` — immutable historical record, left as-is even where it mentions `apps/ops`

---

## Contracts

Pure removal — no new contracts. See `docs/STACK.md` Critical Gate for verification commands
(post-change, without the `ops` filter rows).

---

## Gate Checks

No change-specific override; Critical Gate for the `web`/`api`/repo-root scope per `docs/STACK.md`.
Full Gate's `Ops dashboard` row (`pnpm --filter ops build`) is removed by this change itself, so it
is `n/a` going forward.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- `pnpm install` alone hit a pre-existing, unrelated flake: `minimumReleaseAge` (7-day) rejected
  the already-locked `@tanstack/router-core@1.171.20` on re-resolution triggered by the
  `pnpm-workspace.yaml` edit. Regenerated with `pnpm install --config.minimumReleaseAge=0` for this
  one-off lockfile prune; the resulting diff is a pure 386-line deletion (apps/ops's dependency
  subtree only), confirmed via `git diff --stat pnpm-lock.yaml`.
- Critical Gate's "Focused tests" row is `SKIPPED`: this change touches no test-covered source
  behavior (workspace config, CI workflow, Makefile, and docs only).
- Two runbook edits (`production-onboarding.md`) turned out larger than the original survey's line
  estimate — full paragraphs of `apps/ops`-specific credential setup, not single lines — rewritten
  in place rather than deleted, since the underlying task (create a least-privilege Umami/Beszel
  account) still applies, just registered in sre-kit instead of `apps/ops`'s env vars.

---

## Commit Message

```
chore(change-19): retire the local apps/ops dashboard in favor of sre-kit
```
