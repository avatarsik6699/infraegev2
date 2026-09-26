# CHANGE 147 — Release safety follow-up

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `147` |
| Slug | `release-safety-followup` |
| Title | Release safety follow-up |
| Status | `active` |
| Branch | `feature/147-release-safety-followup` |

---

## Goal

Close the concrete gaps found during the first account release without rebuilding the SDD pipeline: protect a selected pre-migration backup from ordinary retention, avoid dependency audits for manifest edits unrelated to dependencies, and resolve the patched `js-yaml` finding. Activate the already-published weekly audits once and inspect their actual outcome. See `docs/SPEC.md` §7–§8 and the owning runbooks.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] I1 Add an explicit protected pre-migration backup mode and retention policy that preserves the selected full Restic snapshot ID across same-day and later routine backups; fail closed on missing/malformed proof. Preserve the ordinary backup cadence and avoid a new scheduler. — _Depends on:_ —
- [x] I2 Connect protected mode only to a reviewed schema-changing deploy, before migration; keep ordinary deploy backups ordinary. Verify the selected protected snapshot after the release backup and document a bounded, explicit operator release of the hold. — _Depends on:_ I1
- [x] I3 Add focused fake-command and isolated Restic retention tests for two same-day backups, exact-ID survival, schema-change selection, and failure paths; never touch production data in tests. — _Depends on:_ I1, I2
- [x] I4 Make `changed-dependencies` classify actual dependency/trust-policy changes in manifests, while lockfile changes still always audit; script-only `package.json` and test-marker-only `pyproject.toml` edits must not trigger ecosystem audits. Cover the classifier with focused tests. — _Depends on:_ —
- [x] I5 Update the dev-only `js-yaml` 3.x transitive dependency to the patched 3.15.2 release using the existing pnpm policy, regenerate the lockfile, and verify frozen installation without broad upgrades or suppressing other findings. — _Depends on:_ —
- [x] I6 Dispatch each already-published weekly GitHub audit once on remote `main`, inspect the actual status/logs and standard notification route, and record known failures honestly; no production credentials or mutations. — _Depends on:_ —
- [x] I7 Classify the four historical Gitleaks findings without exposing values; after architect approval, allowlist only the four source-verified public SHA-256 digests at their exact historical snapshot path, rerun the history scan, and leave all other secret detection active. — _Depends on:_ I6

### Data

None

### Other

- [x] T1 Update backup/production/verification runbooks and the relevant gotcha with the observed loss of the exact pre-migration snapshot, protected-backup procedure, remaining older snapshot limitations, and weekly-audit activation result. Do not claim the deleted snapshot was recovered. — _Depends on:_ I1, I2, I6

---

## Files

### Create / modify

- `scripts/backup.sh`, `scripts/deploy-remote.sh`, owning shell/Python contract tests
- `scripts/security-gate.sh`, a minimal stdlib classifier if needed, `scripts/tests/security_gate_test.py`
- `.gitleaks.toml` for the approved exact historical digest exceptions
- `pnpm-workspace.yaml`, `pnpm-lock.yaml`
- `docs/runbooks/backup-restore.md`, `docs/runbooks/production.md`, `docs/runbooks/verification.md`, `docs/KNOWN_GOTCHAS.md`
- `docs/STACK.md` for the focused operations contract row
- This change file

### Do NOT touch

- Application account/API/web behavior or database schema
- Existing unrelated untracked `docs/artifacts/references/*` and `docs/artifacts/smtp.txt`
- Production data or deployment; only the verified exact-ID hold-tag mutation of the older
  retained `122_01` snapshot is in this change's separately recorded operational scope

---

## Contracts

See `docs/SPEC.md` §7–§8 and the Files list above. Existing backup, release, security and periodic-audit runbooks provide the concrete operational contracts.

---

## Gate Checks

The affected Critical Gate owns shell lint/syntax, focused backup/deploy/security contracts, pnpm frozen install and repository hygiene. One isolated local Restic repository may prove retention semantics. Full Gate and Lighthouse are not implicit. The weekly workflows are observed separately from local acceptance; a known failed audit is not PASS.

Remote handoff after local ship: publish only through the authorized Release Gate, verify exact-SHA CI/images before any deploy, re-verify the already-held older `122_01` snapshot by its new full ID, then verify production backup/restore and public health. Never treat the deleted exact pre-migration snapshot as recoverable.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- On 2026-09-26 the remaining older `122_01` production snapshot from 2026-09-25 was
  held under the shared Restic lock. Tagging replaced full ID
  `63049c5f1d7f2b465573819dacc40d8abae274c75d3ac6c85f841edc9db30244` with
  `94c5a3e7b7e6ecf485d6ac21194ac295ecc6579b72dc95a2203b0e1afd2b8214`;
  exact-ID authentication and current-policy retention dry-run passed. Review for manual
  hold release on/after 2026-10-26. This does not recover the lost exact cutover backup.
- Manual weekly audits on published SHA `bb0c0aea936b2949faee415510a17c8930f676fd`:
  browser run `36243493157` passed; security run `36243491641` failed at four historical
  Gitleaks findings before SAST/config/dependency checks. Dispatch actor was `avatarsik6699`;
  standard GitHub Actions notifications are configured, but email receipt is not API-verifiable.
  The dev-only `extract-zip` route still has two HIGH advisories with no patched version.
- Architect approved four exact Gitleaks exceptions after each public SHA-256 was matched to
  its source task file at historical commit `a588ce1fe14b3265a13ac30515d690ba0672defb`.
  The local full-history scan passed; a digest outside the allowed path still triggered.
  This does not turn the earlier remote audit into a PASS.

---

## Commit Message

```
fix(change-147): protect release backups and focus audits
```
