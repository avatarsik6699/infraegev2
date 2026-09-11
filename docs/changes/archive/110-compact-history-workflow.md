# CHANGE 110 — Compact history workflow

## Change Metadata

| Field | Value |
|---|---|
| Change | `110` |
| Slug | `compact-history-workflow` |
| Status | `archived` |
| Branch | `feature/110-compact-history-workflow` |

## Goal

Этап 5 согласованной hygiene queue: подготовить SDD к компактному архиву до удаления originals.

## Backlog

- [x] `T1` Добавить stdlib history tool: обычный/compact archive, next number, active detection,
  проверяемые metadata/source SHA/path manifest, byte-preserving read без изменения checkout.
- [x] `T2` Проверить временными Git repositories обычный ship/archive, numbering, invalid/missing
  metadata, missing source/shallow history, snapshot byte mismatch и защищённые paths.
- [x] `T3` Обновить AGENTS, plan/work/ship и STACK: читать checkpoint по необходимости, source
  восстановление, явное исключение для approved compaction; wrappers сохранить тонкими.
- [x] `T4` Scoped Critical Gate, LSP, format, cleanup; originals остаются до этапа 6.

## Files

scripts/change_history.py; scripts/tests/change_history_test.py; AGENTS.md;
docs/playbooks/{plan,work,ship}.md; docs/STACK.md; этот change.
Не менять приложение, архив, references, пользовательские staged files или production.

## Contracts

[STACK](../../STACK.md), audit §8.3–8.4 и §11. Следующий этап — отдельный change.

## Gate Checks

`python3 -m unittest discover -s scripts/tests -p change_history_test.py`;
scoped Ruff/Pyright/LSP, `pnpm format:check`, `make clean-dry-run`, `make clean`, `make clean-check`.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Six real-Git test scenarios PASS; Ruff format/lint, Pyright and both Python LSP files clean.
  Snapshot generation is read-only; actual deletion stays in 111. Thin wrappers already point to
  canonical playbooks, so require no duplicate workflow logic.

## Commit Message

```text
feat(change-110): support verified compact change history
```
