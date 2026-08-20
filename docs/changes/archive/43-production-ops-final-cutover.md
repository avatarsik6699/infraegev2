# CHANGE 43 — Production Operations Final Cutover

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `43` |
| Slug | `production-ops-final-cutover` |
| Title | Production Operations Final Cutover |
| Status | `archived` |
| Branch | `feature/43-production-ops-final-cutover` |

---

## Goal

Apply the fully published operations candidate, prove the independent production stack and its
maintenance lifecycle end to end, and leave the target ready for a separate sre-kit Source
registration change. No legacy data is migrated or deleted.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Verify exact candidate `ad6df05fa7d44e7a4f9434c196091ed4890e2f49`, protected env/render, rollback application SHA, fresh application backup, disk, legacy services, preserved volumes and inactive operations timers without exposing secrets — _Depends on:_ —
- [x] `I2` Record the architect's explicit authorization after the clean preflight — _Depends on:_ I1
- [x] `I3` Stop only legacy observability services, deploy the candidate application SHA, update the independent operations project and activate its timers — _Depends on:_ I2
- [x] `I4` Prove public exact-SHA health, Umami collector and blocked public UI, private Umami/Beszel health, Beszel system status, all operations containers and fresh backup/restore results; fail closed on any blocker — _Depends on:_ I3
- [x] `I5` Synchronize SPEC, stack and runbooks with the sanitized verified live state — _Depends on:_ I4

### Data

- [x] `D1` Reuse only the clean operations volumes and preserve legacy volumes unchanged; do not copy, restore, rename, prune or delete either set — _Depends on:_ I3

### Other

- [x] `T1` Record the secret-free endpoint and Beszel system identifier handoff for the subsequent sre-kit Source-registration change — _Depends on:_ I4
- [x] `T2` Correct the source template to use the verified regular Beszel user collection and populate the non-secret live Beszel/Umami identifiers exposed by final acceptance — _Depends on:_ I4

---

## Files

### Create / modify

~~~
docs/changes/43-production-ops-final-cutover.md
docs/SPEC.md
docs/STACK.md
docs/runbooks/production.md
docs/runbooks/production-onboarding.md
docs/runbooks/backup-restore.md
docs/runbooks/incident-response.md
ops/observability/sre-kit-sources.example.json
~~~

### Do NOT touch

- Application, operations or sre-kit code/configuration unless a live finding is first appended to this Backlog
- `.github/workflows/**`, `apps/web/**`, `apps/api/**` or `/home/niquetamerewsl/projects/sre-kit/**`
- Legacy or new Docker volumes through copy, restore, rename, prune or deletion
- SSH, UFW, fail2ban, WireGuard or provider-console configuration
- Protected credential values in git, logs or chat
- Archived change documents

---

## Contracts

See `docs/SPEC.md` §7–§8 and `docs/runbooks/production.md`. The target lifecycle stays owned by
infraegev2; Source registration remains a later sre-kit-owned operation.

---

## Gate Checks

Use exact immutable SHA and the documented fail-closed rollback. Evidence must be sanitized. This
change has no code implementation unless a live finding is appended first.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Preflight confirmed all protected files are user-owned mode 600, the exact Compose candidate and
  its three image manifests are available, root disk use is 26%, and the application backup is
  successful at 2026-08-20T02:19:44Z. Production remains healthy on rollback SHA
  `eb70fbb517c05455f6ca7398f544947934a22707`; four legacy services run, three clean operations
  volumes are preserved, no operations container runs and all operations timers are inactive. The
  architect's explicit authorization remains current for this final corrected retry.
- GitHub deploy run `32376399939` applied the exact candidate. Public readiness reports the same
  SHA, `/stats/script.js` returns 200 while `/stats/` returns 404, both private service health
  endpoints return 200, and all five operations containers run with zero restarts. Umami has the
  expected single website; Beszel system `p5y1rsvan2rdr5y` (`infraege.ru`) is `up`. The operations
  backup completed successfully at 2026-08-20T13:52:45Z, its disposable restore exited 0 and left
  no container/work directory, and all three operations timers are active. Legacy containers are
  absent while legacy volumes remain preserved.
- The secret-free Source template now carries the verified Umami website and Beszel system IDs and
  authenticates the Beszel adapter through the regular `users` collection. Passwords remain
  placeholders owned by the later sre-kit registration change.

---

## Commit Message

```
chore(change-43): activate production operations stack
```
