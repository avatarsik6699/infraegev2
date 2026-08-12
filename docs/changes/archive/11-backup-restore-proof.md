# CHANGE 11 — Production Backup and Restore Proof

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `11` |
| Slug | `backup-restore-proof` |
| Title | Prove the production backup and restore lifecycle |
| Status | `archived` |
| Branch | `feature/11-backup-restore-proof` |

---

## Goal

Close the last unverified M2 operational boundary by proving that production backup timers are
installed, a current encrypted Restic snapshot is created and reported as fresh, and the monthly
disposable PostgreSQL restore drill succeeds. Preserve the accepted same-host limitation: this
change proves logical recovery on the current VPS, not disaster recovery from total VPS loss.

---

## Backlog

### Infra

- [x] `I1` Re-establish the documented pinned deploy-operator access path and audit the production
  backup, restore-check, analytics-retention, and certificate timer/service states without
  exposing protected values — _Depends on:_ —
- [x] `I2` Run the production backup service, verify the freshness marker, Restic snapshot and
  retention/integrity evidence, and fix only confirmed failures in the existing backup path — _Depends on:_ I1
- [x] `I3` Run the disposable restore-check service, prove both PostgreSQL dumps restore and the
  temporary resources are cleaned up, and fix only confirmed failures in the existing drill — _Depends on:_ I2
- [x] `I4` Add focused shell regression coverage for restoring an archive whose objects retain the
  production Umami owner role, including cleanup on failure — _Depends on:_ I3
- [x] `I5` Add an idempotent human-operator provisioning script and regression test that creates a
  distinct key-only SSH account with password-protected sudo while preserving disabled root and
  password SSH and the non-privileged deploy identity — _Depends on:_ I4
- [x] `I6` Provision the live operator with a separate local identity and protected sudo recovery
  credential, then prove key-only SSH, interactive sudo-to-root, deploy non-escalation, and the
  retained SSH hardening boundary without exposing credential material — _Depends on:_ I5

### Other

- [x] `T1` Record reproducible operator verification and any recurring trap in the backup runbook
  or gotcha log, without recording secrets or treating same-host Restic as off-site recovery — _Depends on:_ I2, I3, I4
- [x] `T2` Document the human operator login, sudo, rotation and recovery path and synchronize the
  SPEC access model without weakening the deploy or root SSH contracts — _Depends on:_ I5, I6

---

## Files

### Create / modify
~~~
scripts/backup.sh
scripts/check-backup-freshness.sh
scripts/restore-check.sh
scripts/tests/backup-restore.test.sh
ops/systemd/infraege-backup.*
ops/systemd/infraege-restore-check.*
ops/setup-operator-access.sh
scripts/tests/operator-access.test.sh
docs/runbooks/backup-restore.md
docs/runbooks/production.md
docs/runbooks/production-onboarding.md
docs/KNOWN_GOTCHAS.md
docs/SPEC.md
docs/changes/11-backup-restore-proof.md
~~~

Only files requiring a confirmed repair are modified; successful existing automation is left
unchanged.

### Do NOT touch
- application product behavior, content, frontend, backend API, or database schema
- production secret values, private keys, Restic password, or protected env files
- off-site storage, monitoring expansion, legal/RKN work, or M3 product scope
- archived change files

---

## Contracts

See `docs/SPEC.md` sections 7–8, the Files list above, and `docs/runbooks/backup-restore.md`.
Production actions must remain non-destructive: the drill restores only into disposable targets
and must not use `pg_restore --clean`, replace live data, or stop production writers.

---

## Gate Checks

In addition to applicable Fast Gate rows, acceptance requires sanitized production evidence for:

```text
timers enabled and scheduled
backup service exit status 0
fresh backup-status marker
at least one current Restic snapshot and repository integrity PASS
restore-check service exit status 0 for both PostgreSQL dumps
no leftover disposable restore container
```

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The live audit found that `certbot.timer` is enabled and active, while all three infraege timer
  units are absent rather than merely awaiting their first run. Installing the existing units
  requires the root recovery boundary; the deploy account intentionally has no general sudo
  capability. The installation used the protected local recovery credential through the existing
  pinned deploy SSH session without enabling root or password SSH.
- The first backup completed as snapshot `bc20027b`; the freshness marker, full Restic data check,
  and three timer schedules passed. The persistent restore service exposed the missing Umami owner
  role; the exact fixed candidate then passed as a disposable systemd oneshot under `deploy`, with
  both dumps restored and no container or work-directory residue. The installed persistent unit
  picks up the fixed script when Change 11 is released through the normal immutable release flow.
- The live human account is `operator` with primary group `infraege-operator`, the workstation's
  personal ED25519 key fingerprint `SHA256:1PPVzXUpWNtMGL9rlQml+c3MPUIVsQ2z8oHy+0gxaeM`, and a
  distinct sudo recovery value stored mode `600` outside git. Live negative tests proved that
  `deploy` cannot sudo and neither root nor password-based SSH became reachable.

---

## Commit Message

```
fix(change-11): prove recovery and add operator access
```
