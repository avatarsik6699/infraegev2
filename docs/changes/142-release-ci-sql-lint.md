# CHANGE 142 — Release CI SQL Lint

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `142` |
| Slug | `release-ci-sql-lint` |
| Title | Release CI SQL Lint |
| Status | `active` |
| Branch | `feature/142-release-ci-sql-lint` |

---

## Goal

Unblock the authorized account release after exact-SHA GitHub quality checks found nine Ruff
E501 violations in restored-database SQL strings. Reflow only SQL whitespace, preserve role and
grant semantics, and run the exact CI static-check commands locally before publication. See
`docs/SPEC.md` §7–§8 and `docs/runbooks/backup-restore.md`.

---

## Backlog

### Infra

- [x] `I1` Reflow the SQL literals in `scripts/lib/application_db/sql.py` to satisfy Ruff's 100-column rule without changing generated queries, role checks or account restore assertions; rerun application DB/restore contracts — _Depends on:_ —
- [x] `I2` Run the exact shell, frontend, backend and API-contract static commands from `quality.yml` locally and resolve any further release-blocking failures without weakening checks — _Depends on:_ I1

---

## Files

### Create / modify

- `scripts/lib/application_db/sql.py`
- `docs/changes/142-release-ci-sql-lint.md`

### Do NOT touch

- Production data, account schema, authentication behavior, credentials or CI thresholds

---

## Contracts

See `docs/SPEC.md` §7–§8, `docs/STACK.md` Full/Release Gates and the Files list above.

---

## Gate Checks

The exact `quality.yml` static commands are required in addition to the risk-selected Full and
Release Gates. The failed `2f248d5a86f32a3a0bca59d3aa0439f8658f79f9` quality run is diagnostic
evidence, not release proof.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-142): satisfy release backend SQL lint
```
