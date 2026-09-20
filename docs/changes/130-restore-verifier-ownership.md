# CHANGE 130 — Restore verifier ownership

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `130` |
| Slug | `restore-verifier-ownership` |
| Title | Restore verifier ownership |
| Status | `active` |
| Branch | `feature/130-restore-verifier-ownership` |

## Goal

Complete the authorized production release after the root-owned restored task directory
prevented the isolated verifier from reading files. The architect explicitly approved correcting
the verifier launch on 2026-09-21. SPEC remains unchanged; source brief is the release finding.

## Backlog

### Infra

- [x] I1 Run the isolated restore verifier with the restored storage owner's numeric UID/GID, retaining read-only mounts/root filesystem, dropped capabilities, no-new-privileges and SELECT-only database access; document the ownership contract. — _Depends on:_ —
- [x] I2 Add regression coverage for owner selection and retained restrictions; prove the existing root-owned production backup restores successfully without changing its permissions or reimporting the bank. — _Depends on:_ I1

## Files

### Create / modify

- `scripts/lib/application_db/recovery.py`
- `scripts/tests/application_db_test.py`
- `docs/runbooks/backup-restore.md`
- `docs/KNOWN_GOTCHAS.md`

### Do NOT touch

- Application UI/API, bank contents, database schema, immutable change archives.

## Contracts

See `docs/SPEC.md` §7–§8 and the Files list above.

## Gate Checks

Standard [STACK](../STACK.md) gates apply. Focused maintenance tests:
`python3 -m unittest scripts.tests.application_db_test`.
Additional release acceptance: isolated restore of the previously prepared production bank,
followed by exact-SHA deployment and public bank/HTTP/browser verification.

Critical Gate: format, Ruff, maintenance Pyright, both Python LSP files and six host tests PASS.
The optional concurrent SQL snapshot test was skipped without its isolated fixture; unchanged.
Allowlist cleanup PASS. Root-owned Restic snapshot `7e60e4a4` restored with the corrected tools:
697 tasks verified, SQL fingerprints/checkers/files PASS, 19 seconds; production remained on
`a5b0bf5793a85a4e9090f47c311ae01c022f194d`.

Full Gate (2026-09-21): format, isolated infrastructure/bootstrap, operations contracts,
migrations/no drift, backend (184), API drift, build/prerender, frontend units (224), E2E
collection and execution (81), smoke, accessibility (8), content/assets, Gitleaks/Semgrep/Trivy
and pnpm/pip dependency audits all PASS. Performance medians (LCP ms / CLS / TBT ms):
`/` 3159/0/0; `/ege` 3018/0/0; `/courses` 3477/0/0; `/courses/python` 3183/0/21;
`/ege/16-rekursiya` 3628/.008/106. All fifteen runs completed within enforced budgets.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Change 129 is already archived and published as `fb3a30f97bcd3a540be3fd2abd729bdd8d6bd938`.
  Its production activation never occurred. The approved 697-task bank and original production
  volume remain preserved; this continuation must reuse the prepared bank without reimport.

## Commit Message

```
fix(change-130): match restore verifier to storage owner
```
