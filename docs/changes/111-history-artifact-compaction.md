# CHANGE 111 — History and artifact compaction

## Change Metadata

| Field | Value |
|---|---|
| Change | `111` |
| Slug | `history-artifact-compaction` |
| Status | `active` |
| Branch | `feature/111-history-artifact-compaction` |

## Goal

Завершить этап 6 согласованной очереди: сохранить оригиналы в неизменяемом локальном Git commit,
заменить исторический архив одним проверяемым checkpoint и удалить только согласованные старые
references/документы. Git history, приложение, production и authored lessons не переписываются.

## Backlog

- [x] `T1` Snapshot на main после 110: точные bytes/hash всех 109 архивов 01–110 (17 отсутствует),
  29 artifacts из audit §8.1 плюс migration/learning документы, 18 дополнительных docs §8.2.
  Проверить отсутствие runtime consumers, перенос уникальных правил в 109 и staged guard.
- [x] `T2` Создать COMPACTED.md: metadata, решения/смены направлений, human approvals, accepted
  risks, незакрытые исторические пункты и точные команды чтения source. История не становится
  текущим Backlog и не выдаётся за новый production proof.
- [x] `T3` Удалить только byte-verified originals, обновить ссылки и чтение контрактов. Сам большой
  завершённый repository-hygiene-audit.md также включить в snapshot, но оставить по прежнему пути
  краткий итог и ограничения вместо повторяющихся исторических таблиц (§§1–11).
- [x] `T4` Проверить numbering/active и recovery Markdown + binary, doc links, content/brand
  consumers, отсутствие случайных удалений; format и cleanup; закрыть локально без push/deploy.

## Files

Создать docs/changes/archive/COMPACTED.md; удалить exact source_paths originals, кроме сокращаемого
repository-hygiene-audit.md. Ссылки: AGENTS/README/PRODUCT, docs/{SPEC,STACK,FRONTEND,KNOWN_GOTCHAS},
canonical playbooks и существующие runbooks по необходимости. Также только исторические
path comments в apps/web/eslint.config.js и scripts/wireguard-tunnel.sh; runtime logic не менять. Этот change остаётся обычным.

Защищены все 14 исходных staged additions, 9 действующих visual references/master, 3 references
неустановленного назначения, runtime assets, окружения, данные и git objects. Список source_paths
в checkpoint служит точным manifest; никакого wildcard удаления.

## Contracts

[STACK](../STACK.md#change-history); текущие SPEC и FRONTEND; исходный audit §8/§11 в snapshot.

## Gate Checks

History inspect + 6 fixture tests; byte recovery for Markdown/binary; local link/path review;
`pnpm validate:content`, `pnpm test:content-assets`, existing focused brand asset tests,
`pnpm format:check`; final cleanup. Runtime/LSP не применимы без изменения кода.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Source snapshot: `a443c286f6928c9501c5fee4365cf93aba00184b`; 159 files verified before mutation,
  158 deleted exactly by manifest and the audit rewritten. No Git history rewrite or remote copy
  claim. 109 archive files / 16,692 lines → checkpoint 294 lines including machine metadata;
  large audit → 54 lines. Current references and all 14 staged additions remain byte-identical.
- PASS: 6 real-Git scenarios; exact Markdown/binary recovery; current Markdown files/anchors;
  content tree (2 Topic lessons, 150 tasks, 28 Course lessons), 2 content-asset tests,
  4 brand-asset tests; web lint/policy (51 UI contracts), shell syntax, format. No runtime source
  behavior changed: only two historical path comments; app/browser/API/LSP gates not applicable.
- Historical observations/risks are preserved in checkpoint, not silently checked off. Cleanup
  uses only the repository allowlist after reviewing generated cache paths.

## Commit Message

```text
chore(change-111): compact verified history and retired artifacts
```
