# CHANGE 109 — Documentation consolidation

## Change Metadata

| Field | Value |
|---|---|
| Change | `109` |
| Slug | `documentation-consolidation` |
| Status | `active` |
| Branch | `feature/109-documentation-consolidation` |

## Goal

Этап 4 аудита: сократить обязательный контекст, сохранить уникальные правила у действующих
владельцев и подготовить дополнительные документы к выводу в Git history. Архитектор разрешил
довести согласованную очередь до конца. Продукт, инфраструктура и учебный контент не меняются.

## Backlog

- [x] `T1` Согласовать чтение SPEC/STACK/FRONTEND/GOTCHAS в agent entrypoints и playbooks;
  обязательны текущий change и релевантные контракты, полное чтение SPEC — для product pivots.
- [x] `T2` Сжать PRODUCT и повторяющиеся visual/release разделы SPEC; сохранить уникальные
  delivery-требования BRAND_ASSET_REQUIREMENTS в FRONTEND и learning checklist/ограничения/источники
  в SPEC §2.3. Сохранить frontend auxiliary behavior и текущие recipes.
- [x] `T3` Объединить onboarding/DNS/TLS/incident в production, management в analytics;
  backup-restore сохранить отдельно. Перенести operations details из STACK в runbooks,
  проверить текущие ownership/secret rotation команды по исходникам. Originals пока не удалять.
- [x] `T4` Классифицировать ещё открытые findings старых readiness/course audits по текущему
  коду и архиву: сохранить deferred outcomes/риски, не переоткрывать закрытые задачи.
- [x] `T5` Проверить карту сохранности разделов, ссылки, format и cleanup; обновить очередь.

## Files

PRODUCT.md; AGENTS.md; CLAUDE.md; docs/{SPEC,FRONTEND,STACK,KNOWN_GOTCHAS}.md;
docs/playbooks/{plan,work}.md; docs/runbooks/{production,analytics,backup-restore}.md;
docs/artifacts/repository-hygiene-audit.md; этот change.

Не менять код, endpoints, credentials, deployment, authored lessons, references, staged files,
archive или удалять originals. Этапы 5–6 выполняются отдельными changes.

## Contracts

SPEC §2–§8, FRONTEND, STACK. Только консолидация принятых требований.

## Gate Checks

Документный Critical Gate из [STACK](../STACK.md#critical-gate): format, link/ownership review,
cleanup. Runtime/LSP/API tests не применимы. Содержимое команд переносится, а не исполняется.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Preservation map: PRODUCT visual detail and SPEC §5.3 → FRONTEND §4/§4.1;
  BRAND delivery → FRONTEND §10; learning principles/checklist/limitations/sources → SPEC §2.3;
  onboarding/DNS/incident → production; management → analytics; STACK lifecycle details → those
  same runbooks. Originals remain present until verified compaction. Blueprint/guides remain
  historical inputs, not additional current contracts.
- Current reconciliation code (`ops/management/reconcile-sources.py`) confirms Change 66's secret
  refresh. Fixed the stale management instruction and outdated onboarding reviewer requirement.
  The historical local Umami default-password exception does not apply to new remote onboarding.
- Old findings: PR-01/02/03/06 closed in 46, PR-05 in 47; PR-04 mobile title/outline addressed by
  105/107, but the original task-5 visual-density observation has no separate human closure proof
  and remains a review limitation. PR-07 applies only to workstation fallback after Change 53.
  PC-01 closed in 68; PC-02/03 explicitly deferred by the architect in 69 (pageviews/path aggregates
  suffice); PC-04's exact two-lesson regression scenario is historical after the 28-lesson course,
  with no claim that its original coverage request was implemented. Independent CourseLesson/Topic
  ownership remains intentional. Preserve these dispositions in the compact checkpoint.

- Validation: Markdown destinations reviewed; repository format PASS; cleanup dry-run empty.
  Runtime/API/LSP skipped because this change only consolidates documentation.

## Commit Message

```text
docs(change-109): consolidate current contracts and operations
```
