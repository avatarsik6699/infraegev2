# Compacted change history — 01–153

Changes 01–110 and 111–153 have separate immutable source snapshots. Current contracts remain
SPEC, FRONTEND, STACK and the owning runbooks; this checkpoint preserves historical decisions,
approvals and unresolved risks. Local archive/publication status is not live release evidence.
The metadata is verified by `python3 scripts/change_history.py inspect` before history-dependent work.

<!-- compacted-metadata -->
```json
{
  "version": 2,
  "snapshots": [
    {
      "covered_from": 1,
      "covered_through": 110,
      "source_commit": "a443c286f6928c9501c5fee4365cf93aba00184b",
      "date": "2026-09-11",
      "missing_numbers": [
        17
      ],
      "source_paths": [
        "docs/BRAND_ASSET_REQUIREMENTS.md",
        "docs/INFRASTRUCTURE_BLUEPRINT.md",
        "docs/artifacts/alchimia-public-migration-matrix.md",
        "docs/artifacts/course-overview-image-prompts.md",
        "docs/artifacts/course-overview-ui-audit.md",
        "docs/artifacts/infraege-ui-migration.md",
        "docs/artifacts/learning-science-principles.md",
        "docs/artifacts/lessons/16-rekursiya.md",
        "docs/artifacts/lessons/16-rekursiya.quality.md",
        "docs/artifacts/lessons/5-build-and-analyze-algos-for-executors.md",
        "docs/artifacts/lessons/5-build-and-analyze-algos-for-executors.quality.md",
        "docs/artifacts/product-readiness-audit-2026-08-20.md",
        "docs/artifacts/python-course-application-gap-audit-2026-08-29.md",
        "docs/artifacts/python-course-curriculum-audit-2026-08-29.md",
        "docs/artifacts/references/design_system.png",
        "docs/artifacts/references/exec-51732868-6ea7-4bbe-a873-6c5603023eed.png",
        "docs/artifacts/references/exec-5b753307-dbb0-4586-9e36-80f4fec62c00.png",
        "docs/artifacts/references/exec-615bde2c-6f44-4595-86d0-7ac3d4fc1359.png",
        "docs/artifacts/references/exec-80200717-77ac-48ee-a2ba-634ac917a479.png",
        "docs/artifacts/references/icons.png",
        "docs/artifacts/references/lesson_structure.png",
        "docs/artifacts/references/logo.svg",
        "docs/artifacts/references/patterns_lines.png",
        "docs/artifacts/references/recraft-vectorize-477c595e.svg",
        "docs/artifacts/references/visual_schema.png",
        "docs/artifacts/repository-hygiene-audit.md",
        "docs/artifacts/route-states/404.png",
        "docs/artifacts/route-states/502.png",
        "docs/artifacts/route-states/503.png",
        "docs/artifacts/route-states/504.png",
        "docs/artifacts/route-states/README.md",
        "docs/artifacts/route-states/error.png",
        "docs/artifacts/route-states/loading.png",
        "docs/artifacts/route-states/pattern.png",
        "docs/changes/archive/01-project-foundation.md",
        "docs/changes/archive/02-architecture-refactor.md",
        "docs/changes/archive/03-testing-conventions.md",
        "docs/changes/archive/04-mantine-adoption.md",
        "docs/changes/archive/05-first-published-topic.md",
        "docs/changes/archive/06-production-platform.md",
        "docs/changes/archive/07-local-ops-lifecycle.md",
        "docs/changes/archive/08-production-env-safety.md",
        "docs/changes/archive/09-umami-collector-path.md",
        "docs/changes/archive/10-infrastructure-blueprint.md",
        "docs/changes/archive/100-course-catalog.md",
        "docs/changes/archive/101-unified-design-system.md",
        "docs/changes/archive/102-course-overview-redesign.md",
        "docs/changes/archive/103-shared-visual-language.md",
        "docs/changes/archive/104-home-topic-visual-cohesion.md",
        "docs/changes/archive/105-lesson-reading-experience.md",
        "docs/changes/archive/106-navigation-progress.md",
        "docs/changes/archive/107-frontend-design-system-consolidation.md",
        "docs/changes/archive/108-runtime-hygiene.md",
        "docs/changes/archive/109-documentation-consolidation.md",
        "docs/changes/archive/11-backup-restore-proof.md",
        "docs/changes/archive/110-compact-history-workflow.md",
        "docs/changes/archive/12-learning-visual-system.md",
        "docs/changes/archive/13-project-hygiene-audit.md",
        "docs/changes/archive/14-web-client-foundation.md",
        "docs/changes/archive/15-impeccable-public-web-redesign.md",
        "docs/changes/archive/16-exploded-algorithm-design-system.md",
        "docs/changes/archive/18-resumable-docker-development.md",
        "docs/changes/archive/19-retire-ops-dashboard.md",
        "docs/changes/archive/20-wireguard-tunnel-script.md",
        "docs/changes/archive/21-ops-reader-sre-kit-commands.md",
        "docs/changes/archive/22-recursion-lesson-content-system.md",
        "docs/changes/archive/23-recursion-practice-expansion.md",
        "docs/changes/archive/24-first-lesson-publication-readiness.md",
        "docs/changes/archive/25-backend-checker-test-fixture.md",
        "docs/changes/archive/26-api-image-security-refresh.md",
        "docs/changes/archive/27-number-record-transformation-lesson.md",
        "docs/changes/archive/28-second-lesson-publication.md",
        "docs/changes/archive/29-second-lesson-publication-e2e.md",
        "docs/changes/archive/30-temporary-root-password-operations.md",
        "docs/changes/archive/31-observability-ops-automation-foundation.md",
        "docs/changes/archive/32-ops-reconcile-engine.md",
        "docs/changes/archive/33-independent-ops-stack-definition.md",
        "docs/changes/archive/34-read-only-remote-preflight.md",
        "docs/changes/archive/35-disposable-migration-rehearsal.md",
        "docs/changes/archive/36-disposable-data-fidelity-drill.md",
        "docs/changes/archive/37-production-snapshot-candidate.md",
        "docs/changes/archive/38-fresh-start-ops-cutover.md",
        "docs/changes/archive/39-production-ops-cutover.md",
        "docs/changes/archive/40-production-ops-activation.md",
        "docs/changes/archive/41-production-ops-live-cutover.md",
        "docs/changes/archive/42-production-ops-cutover-retry.md",
        "docs/changes/archive/43-production-ops-final-cutover.md",
        "docs/changes/archive/44-cross-repository-documentation-audit.md",
        "docs/changes/archive/45-product-readiness-audit.md",
        "docs/changes/archive/46-anonymous-lesson-progress-closure.md",
        "docs/changes/archive/47-cross-repository-documentation-stabilization.md",
        "docs/changes/archive/48-consented-analytics-integration.md",
        "docs/changes/archive/49-continuous-traffic-publisher.md",
        "docs/changes/archive/50-publisher-permission-security-gate.md",
        "docs/changes/archive/51-current-contract-reconciliation.md",
        "docs/changes/archive/52-observability-learning-guide.md",
        "docs/changes/archive/53-sre-kit-management-vps-integration.md",
        "docs/changes/archive/54-post-deployment-contract-audit.md",
        "docs/changes/archive/55-observability-contract-reconciliation.md",
        "docs/changes/archive/56-python-course-foundation.md",
        "docs/changes/archive/57-python-course-publication-navigation.md",
        "docs/changes/archive/58-release-gate-regression-fixes.md",
        "docs/changes/archive/59-refresh-api-base-image.md",
        "docs/changes/archive/60-brand-identity-seo.md",
        "docs/changes/archive/61-final-brand-mark.md",
        "docs/changes/archive/62-project-contract-audit.md",
        "docs/changes/archive/63-python-curriculum-conditions.md",
        "docs/changes/archive/64-publish-python-conditions-lesson.md",
        "docs/changes/archive/65-observability-telemetry-integrity.md",
        "docs/changes/archive/66-source-secret-rotation.md",
        "docs/changes/archive/67-python-course-application-gap-audit.md",
        "docs/changes/archive/68-python-course-published-continuation-truth.md",
        "docs/changes/archive/69-python-errors-course-lesson.md",
        "docs/changes/archive/70-publish-python-errors-lesson.md",
        "docs/changes/archive/71-complete-python-course.md",
        "docs/changes/archive/72-python-course-release.md",
        "docs/changes/archive/73-web-image-cache-recovery.md",
        "docs/changes/archive/74-project-reconciliation-maintainability.md",
        "docs/changes/archive/75-alchimia-design-system-labs.md",
        "docs/changes/archive/76-alchimia-public-activation.md",
        "docs/changes/archive/77-editorial-contract-pilots.md",
        "docs/changes/archive/78-python-foundations-editorial-batch.md",
        "docs/changes/archive/79-alchimia-public-design-system-migration.md",
        "docs/changes/archive/80-rich-practice-content.md",
        "docs/changes/archive/81-python-loops-editorial-batch.md",
        "docs/changes/archive/82-python-collections-editorial-batch.md",
        "docs/changes/archive/83-python-functions-files-editorial-batch.md",
        "docs/changes/archive/84-python-algorithms-project-editorial-batch.md",
        "docs/changes/archive/85-final-release-reconciliation.md",
        "docs/changes/archive/86-typography-system-rework.md",
        "docs/changes/archive/87-lesson-component-spacing-audit.md",
        "docs/changes/archive/88-concept-block-unification-checkpoint-consolidation.md",
        "docs/changes/archive/89-lesson-outline-rail-spacer.md",
        "docs/changes/archive/90-lesson-family-consistency-audit.md",
        "docs/changes/archive/91-lesson-outline-compact-density.md",
        "docs/changes/archive/92-release-gate-drift-and-lcp-fix.md",
        "docs/changes/archive/93-web-image-cache-recovery-2.md",
        "docs/changes/archive/94-repository-reconciliation-and-cleanup.md",
        "docs/changes/archive/95-infraege-home-redesign.md",
        "docs/changes/archive/96-home-links-and-footer-polish.md",
        "docs/changes/archive/97-home-ambient-depth-and-motion.md",
        "docs/changes/archive/98-repository-hygiene-and-reconciliation.md",
        "docs/changes/archive/99-ege-topic-catalog.md",
        "docs/guides/observability/01-infraegev2-as-a-system.md",
        "docs/guides/observability/02-signals.md",
        "docs/guides/observability/03-sources-and-adapters.md",
        "docs/guides/observability/04-sre-kit-core.md",
        "docs/guides/observability/05-dashboard-and-alerts.md",
        "docs/guides/observability/06-placement-and-lifecycle.md",
        "docs/guides/observability/07-end-to-end-scenarios.md",
        "docs/guides/observability/08-overlap-and-redundancy.md",
        "docs/guides/observability/09-failure-matrix.md",
        "docs/guides/observability/README.md",
        "docs/playbooks/README.md",
        "docs/playbooks/workflow-init.md",
        "docs/runbooks/SRE_KIT_MANAGEMENT.md",
        "docs/runbooks/dns-tls.md",
        "docs/runbooks/incident-response.md",
        "docs/runbooks/production-onboarding.md"
      ],
      "source_digest": "06030369c3756bfdf743779109b7b277b371b2b4d33e7b01b3171b01ec04b4ab"
    },
    {
      "covered_from": 111,
      "covered_through": 153,
      "source_commit": "ec4ecbabae7dfc0abdfc6cfb19dd2043d46148b4",
      "date": "2026-09-28",
      "missing_numbers": [],
      "source_paths": [
        ".impeccable/critique/2026-09-13T19-45-36Z__c-pages-practice-catalog-practice-catalog-page-tsx.md",
        "docs/artifacts/126-ege-catalog/accessibility.json",
        "docs/artifacts/126-ege-catalog/desktop-hover.png",
        "docs/artifacts/126-ege-catalog/desktop-number.png",
        "docs/artifacts/126-ege-catalog/desktop.png",
        "docs/artifacts/126-ege-catalog/final-review.md",
        "docs/artifacts/126-ege-catalog/header-desktop.png",
        "docs/artifacts/126-ege-catalog/header-mobile.png",
        "docs/artifacts/126-ege-catalog/mobile-recursion.png",
        "docs/artifacts/126-ege-catalog/mobile.png",
        "docs/artifacts/126-ege-catalog/review-validation.json",
        "docs/artifacts/126-ege-catalog/verification.md",
        "docs/artifacts/127-courses-catalog/compact-desktop-hover.png",
        "docs/artifacts/127-courses-catalog/compact-desktop.png",
        "docs/artifacts/127-courses-catalog/compact-mobile.png",
        "docs/artifacts/127-courses-catalog/desktop.png",
        "docs/artifacts/127-courses-catalog/dev-hover-fixed.png",
        "docs/artifacts/127-courses-catalog/equal-cards-desktop.png",
        "docs/artifacts/127-courses-catalog/equal-cards-mobile.png",
        "docs/artifacts/127-courses-catalog/final-review.md",
        "docs/artifacts/127-courses-catalog/illustrations-v2.md",
        "docs/artifacts/127-courses-catalog/illustrations.md",
        "docs/artifacts/127-courses-catalog/masters/advanced-problems-v2.png",
        "docs/artifacts/127-courses-catalog/masters/advanced-problems.png",
        "docs/artifacts/127-courses-catalog/masters/algorithms-data-structures-v2.png",
        "docs/artifacts/127-courses-catalog/masters/algorithms-data-structures.png",
        "docs/artifacts/127-courses-catalog/masters/excel-v2.png",
        "docs/artifacts/127-courses-catalog/masters/excel.png",
        "docs/artifacts/127-courses-catalog/masters/python-v2.png",
        "docs/artifacts/127-courses-catalog/masters/python.png",
        "docs/artifacts/127-courses-catalog/mobile-bottom.png",
        "docs/artifacts/127-courses-catalog/mobile.png",
        "docs/artifacts/127-courses-catalog/revision-desktop-hover.png",
        "docs/artifacts/127-courses-catalog/revision-mobile-bottom.png",
        "docs/artifacts/127-courses-catalog/revision-mobile.png",
        "docs/artifacts/127-courses-catalog/ship-desktop.png",
        "docs/artifacts/127-courses-catalog/ship-mobile.png",
        "docs/artifacts/127-courses-catalog/ship-unavailable.png",
        "docs/artifacts/127-courses-catalog/soon-badge-mobile.png",
        "docs/artifacts/127-courses-catalog/soon-desktop.png",
        "docs/artifacts/127-courses-catalog/soon-mobile.png",
        "docs/artifacts/127-courses-catalog/unavailable.png",
        "docs/artifacts/127-courses-catalog/verification.md",
        "docs/artifacts/incorrect_bg.png",
        "docs/artifacts/layout-stability-audit.md",
        "docs/artifacts/layout-stability-verification.md",
        "docs/artifacts/multiagents.md",
        "docs/artifacts/practice-ux-research.md",
        "docs/artifacts/references/123246.png",
        "docs/artifacts/references/13_50_05.png",
        "docs/artifacts/references/2026-09-19_124625.png",
        "docs/artifacts/references/20_30_50.png",
        "docs/artifacts/references/841be234-1c34-4534-a2dc-3d2c8eb39767.png",
        "docs/artifacts/references/algorithms_and_data_structs.png",
        "docs/artifacts/references/base.jpg",
        "docs/artifacts/references/cards_refs.png",
        "docs/artifacts/references/code_block_ref.png",
        "docs/artifacts/references/d9cf8537-82c3-4db2-a271-07098e9aa187.png",
        "docs/artifacts/references/error_page.png",
        "docs/artifacts/references/excel_from_scratch.png",
        "docs/artifacts/references/illustration-number-representation-transparent.png",
        "docs/artifacts/references/illustration-recursive-algorithms-transparent.png",
        "docs/artifacts/references/loading_page.png",
        "docs/artifacts/references/main-page.png",
        "docs/artifacts/references/mini-courses-patterns/exec-09cfe315-a7f9-41da-a54f-0b687e2715f1.png",
        "docs/artifacts/references/mini-courses-patterns/exec-58497f71-6293-4a27-af2c-4330429d651e.png",
        "docs/artifacts/references/mini-courses-patterns/exec-6d97f44c-a105-4bac-b8ee-32417951952a.png",
        "docs/artifacts/references/mini-courses-patterns/exec-dac2905d-a1b4-4797-af2b-5d1230930789.png",
        "docs/artifacts/references/mini-courses.png",
        "docs/artifacts/references/new_pages/exec-1e2230b7-c412-40da-8569-cb5f7e3e3ecc.png",
        "docs/artifacts/references/new_pages/exec-3f35af90-38f2-44c7-8b35-e4d99026b298.png",
        "docs/artifacts/references/new_pages/exec-b6f2e0be-dca2-470b-aa9e-226a474a7f19.png",
        "docs/artifacts/references/new_pages/exec-ba93e8f8-aadd-48ab-8ea7-90d14bcd105f.png",
        "docs/artifacts/references/new_pages/exec-d4f84de1-b9f4-47a8-98dd-cb498ee430d9.png",
        "docs/artifacts/references/new_pages/exec-e2b5297b-7198-4c7e-ae64-7cc7a3fe0ec6.png",
        "docs/artifacts/references/practice_catalog/(1).png",
        "docs/artifacts/references/practice_catalog/(2).png",
        "docs/artifacts/references/practice_catalog/(3).png",
        "docs/artifacts/references/practice_catalog/(4).png",
        "docs/artifacts/references/py_from_scratch.png",
        "docs/artifacts/references/solving_complex_problems.png",
        "docs/artifacts/references/sorting-array-transparent.png",
        "docs/artifacts/repository-hygiene-audit.md",
        "docs/artifacts/sdd-verification-redesign-2026-09-26.md",
        "docs/artifacts/verification-pilot-146.md",
        "docs/changes/archive/111-history-artifact-compaction.md",
        "docs/changes/archive/112-layout-stability.md",
        "docs/changes/archive/113-practice-data-foundation.md",
        "docs/changes/archive/114-practice-model-tooling.md",
        "docs/changes/archive/115-lesson-practice-cutover.md",
        "docs/changes/archive/116-practice-catalog.md",
        "docs/changes/archive/117-practice-transition-readiness.md",
        "docs/changes/archive/118-practice-release-import.md",
        "docs/changes/archive/119-practice-release-rehearsal.md",
        "docs/changes/archive/120-practice-bank-import.md",
        "docs/changes/archive/121-practice-ux.md",
        "docs/changes/archive/122-minimalist-baseline.md",
        "docs/changes/archive/123-release-readiness.md",
        "docs/changes/archive/124-practice-inline-solving.md",
        "docs/changes/archive/125-audit-reconciliation.md",
        "docs/changes/archive/126-ege-catalog-redesign.md",
        "docs/changes/archive/127-courses-catalog-redesign.md",
        "docs/changes/archive/128-python-course-overview.md",
        "docs/changes/archive/129-lesson-readability.md",
        "docs/changes/archive/130-restore-verifier-ownership.md",
        "docs/changes/archive/131-deploy-transport-completion.md",
        "docs/changes/archive/132-efficient-agent-workflow.md",
        "docs/changes/archive/133-analytics-reinstate.md",
        "docs/changes/archive/134-checkpoint-sast-false-positive.md",
        "docs/changes/archive/135-checkpoint-matrix-job-names.md",
        "docs/changes/archive/136-host-hardening-retire-ops.md",
        "docs/changes/archive/137-web-image-cached-install.md",
        "docs/changes/archive/138-release-retention-legacy-cleanup.md",
        "docs/changes/archive/139-host-patch-old-volume.md",
        "docs/changes/archive/140-accounts-server-progress.md",
        "docs/changes/archive/141-release-ci-repair.md",
        "docs/changes/archive/142-release-ci-sql-lint.md",
        "docs/changes/archive/143-restic-cutover-compatibility.md",
        "docs/changes/archive/144-offline-migration-runner.md",
        "docs/changes/archive/145-cutover-assert-stdin.md",
        "docs/changes/archive/146-verification-redesign.md",
        "docs/changes/archive/147-release-safety-followup.md",
        "docs/changes/archive/148-ci-python-test-line-length.md",
        "docs/changes/archive/149-number-sequences-lesson.md",
        "docs/changes/archive/150-string-processing-lesson.md",
        "docs/changes/archive/151-integer-processing-lesson.md",
        "docs/changes/archive/152-array-processing-lesson.md",
        "docs/changes/archive/153-data-clustering-lesson.md"
      ],
      "source_digest": "bbae14e4164ec88ad4ecbab48a6c8f02bca602c59d020d5ad6ebc361cdcb1376"
    }
  ]
}
```

## Historical record retained from Change 111

The following text records the 01–110 snapshot at initial compaction; later decisions are
summarized separately below. References to then-current tools/services are historical.

## Как читать историю

Этот checkpoint заменяет 109 архивных файлов Changes 01–110 (17 не был завершён) и хранит
индекс выведенных источников. Текущие правила принадлежат SPEC, FRONTEND, STACK и трём runbooks;
код описывает фактическую реализацию. Summary не повторяет их полный контракт.

`source_commit` — локально доступный immutable commit до удаления. `source_paths` — точные пути
в его дереве; `source_digest` связывает каждый путь и SHA-256 его содержимого. Git history не
переписывалась. Это сохранение в локальной истории, а не доказательство удалённой резервной копии.

```bash
python3 scripts/change_history.py inspect
python3 scripts/change_history.py read docs/changes/archive/107-frontend-design-system-consolidation.md
python3 scripts/change_history.py read docs/artifacts/references/logo.svg
```

`read` возвращает исходные bytes в stdout и ничего не создаёт в checkout. Для binary используйте
новый временный файл. Для главы выведенного observability guide подставьте её точный source_paths
entry; порядок 01–09 сохраняется в исходном дереве. При недоступном commit/shallow clone сначала
получите записанную Git history из доверенной копии. Нельзя заменять source SHA текущим HEAD.

## Завершённые этапы и повороты

| Changes | Результат и судьба решения |
|---|---|
| 01–03 | Web/API/Compose foundation, границы слоёв, git-based content, API `/api` без `/v1`, fixture/Page Object e2e policy. Архитектурные детали теперь в STACK/FRONTEND. |
| 04–05 | Первоначальные Mantine и первая тема. Mantine впоследствии заменён Base UI с локальными semantic wrappers; старый контракт не является вторым UI kit. |
| 06–11 | VPS, DNS/TLS, CI/deploy, env safety, collector path, локальная ops lifecycle, backup/restore proof. Blueprint создавался для других проектов; теперь доступен только как исторический переносимый материал. |
| 12–16 | Learning visuals, editor/hygiene, typed client foundation, public/lab iterations. Отдельные визуальные направления являются этапами поиска, не разрешением вернуть их в production. |
| 17 | Попытка остановлена до commit; завершённого archive не существует. Полезная recursion работа независимо реализована 22–24. |
| 18–21 | Resumable Docker, удаление приложения `apps/ops`, WireGuard adapter, старый ops-reader transport. Ownership monitoring передан sibling sre-kit; старые SSH identities впоследствии retired. |
| 22–29 | Два самостоятельных TopicLesson: рекурсия и преобразование записей числа; typed TSX theory + server-owned task data, content/publication и checker/browser proofs. Исторические Markdown originals не являются живым renderer. |
| 30–38 | Переход SSH, попытки generic reconcile/rehearsal/snapshot tooling. Итоговое решение — Compose + явные runbooks, fresh-start ops; generic plan/apply engine и старые snapshots не действующий lifecycle. |
| 39–44 | Последовательные ops cutover gates, два rollback и успешный финальный cutover на `ad6df05fa7d44e7a4f9434c196091ed4890e2f49` (2026-08-20). Данные прежних Umami/Beszel не переносились, legacy volumes rollback-only. |
| 45–47 | Readiness audit, anonymous lesson mastery/result/reset/continuation и truthful privacy. Граница human review и deferred legal outcomes сохранена ниже. |
| 48–52 | Explicit consent, bounded analytics и Nginx aggregates, manual publisher, permission hardening и учебный observability guide. Guide не новый обязательный operations contract. |
| 53–55 | Отдельный always-on management VPS sre-kit, семь Sources, dedicated WireGuard peer и management-local backup/proof. Workstation runtime остаётся ручным fallback. |
| 56–59 | Самостоятельный Python CourseLesson, публикация/навигация, release regressions и security refresh. CourseLesson не получает искусственную Topic relation. |
| 60–62 | Возврат infraege brand, окончательный трёхкаменный master и reconciliation. Только `references/infraege-mark.svg` — художественный source; остальные логотипы и raster references исторические. |
| 63–68 | Conditions lesson, telemetry integrity, Source secret rotation, course-gap audit и исправление ложного «урок ещё готовится». Reconciliation обновляет encrypted refs из protected inputs. |
| 69–70 | Errors lesson, публикация, упрощение результатов и inline notation. Архитектор остановил event-level analytics refinement: существующих visits/pageviews/path aggregates достаточно. |
| 71–74 | Утверждённая 28-урочная Python программа, завершение контента, publication/release/cache recovery и reconciliation. Первоначальная 19-шаговая программа отвергнута после curriculum review. |
| 75–76, 79 | ALCHIMIA lab/public experiments и migration matrix. Направление впоследствии отменено для публичного бренда; оно не текущая альтернатива infraege. |
| 77–78, 80–84 | Editorial pilots и последовательные foundations/loops/collections/functions/files/algorithms/project batches; rich practice content. Human-approved содержание не переписывалось в hygiene queue. |
| 85–91 | Release reconciliation, Alegreya/Golos/JetBrains typography, lesson spacing/ConceptBlock/Checkpoint/outline. Текущее оформление и роли определяет FRONTEND, исторические font assertions не контракт. |
| 92–94 | Font-test/LCP drift, image-cache recovery, последующая repository reconciliation. Архивные чекбоксы и performance exception не скрыты: см. ограничения ниже. |
| 95–98 | Reference-led homepage, links/footer/motion и hygiene tooling. LCP contract изменён по решению архитектора; это изменение порога, а не доказательство оптимизации до старой цели. |
| 99–104 | `/ege` из 25 тем (номера 19–21 вместе), `/courses`, Python overview, общие lab specimens и визуальный язык. Planned rows остаются обычным текстом без фиктивных маршрутов. |
| 105–106 | Linear lesson reading и auxiliary pages; skeleton удалён, current route сохраняется до готовности следующего, top progress после 150ms. Telemetry observation сохранено ниже. |
| 107 | Полный DS audit: 51 контракт, DS01–DS21. Semantic variants/common owners, link families, Badge/Typography/Image, lesson shell, learning blocks, modal/focus/no-JS, migration всех consumers и policy checks. |
| 108 | Проверенные 16 tokens, 15 dead CSS rules и старые placeholders/declarations удалены. 18 computed-style сравнений не изменились; Nginx isolation PASS. |
| 109 | Brand delivery → FRONTEND; learning checklist/источники → SPEC; production onboarding/DNS/incident и management объединены с owning runbooks. Reading scope и stale operations instructions исправлены. |
| 110 | Проверяемые metadata, нумерация, безопасное чтение и stdlib history tool. Шесть сценариев в real temporary Git repositories, включая shallow source failure; Ruff/Pyright/LSP PASS. |

## Human approvals и границы доказательства

- Первые два TopicLesson прошли отдельную content/publication review (22–29). Python сначала
  выпускался отдельными одобренными уроками; 19-шаговый общий draft не сохранил approval после
  curriculum audit. Замена на 28 уроков одобрена и реализована 71–73; поздние editorial batches
  77–84 имеют собственную human review history. Автоматические тесты не заменяют эту приёмку.
- Original lesson/quality Markdown, curriculum/application/overview audits и image prompts
  сохранены в source_paths. Они объясняют происхождение и решения; текущая TSX theory и task data
  не выведены из checkout. Course overview audit был завершён в 102, его findings не новый Backlog.
- Исследования проверяли весь перечисленный frontend scope, а браузерные проверки — конкретные
  маршруты/состояния. Это не обещание отсутствия любых будущих дефектов или полного runtime coverage.
- 107: 67 focused unit + 7 E2E, web lint/typecheck/format, Python Ruff/Pyright PASS;
  76 production/unit TS files LSP clean. Изолированный E2E LSP сохраняет известное разрешение
  Playwright types, не объявляется зелёным. 108: computed-style и auxiliary isolation PASS.
- Архивный статус означает завершённую единицу учёта, а не автоматическое исполнение каждого
  исторического checkbox. Новые 107–110 закрывались локально; push/deploy не выполнялись.
  Для фактического production SHA нужны `/health/ready` и release evidence конкретного deploy.

## Сохранённые ограничения и незакрытые наблюдения

| Источник | Диспозиция |
|---|---|
| 13 / I10 | Архив сохранил unchecked branch-protection/required-check enforcement. Нет новой проверки GitHub enforcement; не считать выполненным или автоматически открытым Backlog. |
| 21 / I3 | Старый ops-reader wrapper deploy остался unchecked; агент его не выполнял. Сам transport позднее заменён принятым root/password contract; нельзя разворачивать retired sudoers по этому пункту. |
| 92 / F1–F4 | Original checkboxes остались unchecked при archived status. Поздние проверки/рефакторинги не переписывают эту историю; точные обстоятельства доступны в оригинале. |
| 92 / LCP | Архитектор разрешил release при residual LCP failure. В 98 принят enforced median ≤4000ms, ≤2800ms сохранён будущей целью; реальные повторные medians 3616ms и 3915ms прошли новый порог. Это historical measurement, не свежий production score. |
| 106 / telemetry | При injected server-function 503 в локальном Docker наблюдался telemetry 422; retry восстановил страницу. Причина не подтверждена, исправление этим checkpoint не заявляется. |
| Readiness PR-01/02/03/06 | Закрыты 46: result/mastery/reset/continuation и browser journey. PR-05 закрыт 47: factual privacy без выдуманных operator details. |
| Readiness PR-04 | Title-before-outline и mobile collapse реализованы 105/107. У прежнего наблюдения плотности task-5 нет отдельного human closure proof; сохранено как visual-review limitation. |
| Readiness PR-07 | Workstation polling pause остаётся свойством ручного fallback. С 53 production monitoring работает на отдельном management VPS; выключение ноутбука его не останавливает. |
| Course PC-01 | Исправлен 68: continuation не называет опубликованный conditions lesson будущим. |
| Course PC-02/03 | Event allowlist/emitter/completion-semantic refinement снят архитектором в 69 в пользу visits/pageviews/path aggregates. Не заявляется реализованным. |
| Course PC-04 | Запрошенное exact 0/2→1/2→2/2/reset isolation regression coverage не объявляется выполненным; двухурочная поверхность позже заменена 28-урочным курсом. |
| A04 | Три PNG (`code_block_ref.png`, `error_page.png`, `loading_page.png`) сохранены: назначение не установлено. Девять active master/reference файлов и 14 staged пользовательских additions также не удалялись. |

## Принятые риски и отложенные направления

- Primary public root/password SSH и минимум 12 символов приняты архитектором с рисками brute
  force/полного host compromise; pinned host keys, UFW/fail2ban сохраняются. Key-only migration
  не запланирована. Отменённые operator/deploy/ops-reader identities не восстановительная опция.
- Production GitHub Environment с 2026-09-04 не имеет required reviewers; unattended dispatch
  принят явно, `can_admins_bypass` сохранён. Это не доказательство отдельной branch protection.
- Application/ops и management Restic используют local storage с принятым риском одновременной
  потери VPS и backup. Доказанный isolated restore не создаёт off-site disaster recovery.
- `/privacy` содержит согласованные каналы связи; отсутствие ФИО/адреса оператора принято явно.
  Formal legal/RKN/localization review бессрочно отложено, не заявляется завершённым аудитом.
- Infraege-specific Telegram channel/rules не настроены. Generic sre-kit engine не означает
  действующие alerts для проекта. Event analytics refinement и новый measurement product scope
  не добавляются уборкой.
- CourseLesson и Topic независимы. Нет выдуманных prerequisite/unlock/recommendation связей;
  4/5 mastery и 5/5 task completion различаются. Authored lesson facts/examples не сжимались.

## Выведенные документы и их владельцы

BRAND_ASSET_REQUIREMENTS → FRONTEND §10; learning-science → SPEC §2.3 с checklist, ограничениями
и библиографией. Onboarding/DNS/TLS/incident → production; management → analytics; backup-restore
сохранён отдельно. Blueprint, workflow-init и observability guide остались в Git как материалы
для отдельного проекта/обучения, не конкурирующие текущие contracts. ALCHIMIA/migration matrices,
старые raster scenes, superseded logo references и законченные audits доступны через source_paths.

Большой repository-hygiene-audit также сохранён полностью в source commit; по прежнему пути
оставлен короткий итог реализации и границы проверки. Последующие ordinary changes продолжают
архивироваться отдельно. При новой компактизации обязательно сохранить этот source snapshot,
а не перезаписать его metadata новым деревом, в котором ранних originals уже нет.


## Snapshot 111–153: outcomes and decisions

Compacted in Change 154 on 2026-09-28 from source `ec4ecbabae7dfc0abdfc6cfb19dd2043d46148b4`.
The exact 128-path manifest above replaces 43 completed changes, 84 retired artifacts and one
finished Impeccable critique. No source branch/tag is substituted for either full SHA. All files
were compared byte-for-byte before deletion; no Git objects or remote state were changed.

| Changes | Outcome and retained decision |
|---|---|
| 111 | Initial compaction: 159 verified sources, old proof retained unchanged. Historical unresolved observations below were not silently closed. |
| 112 | Stable font/hydration/layout geometry; optional font display can keep a cold-visit fallback. HTML-stream throttling exposed defects missed by font/image/JS-only delays. |
| 113–115 | PostgreSQL-owned bank, typed projections, immutable files, transactional operator import/export and revision-aware lesson checking. Missing revision rejects with 422; architect accepted explicit reload for old tabs. Original anonymous-progress migration was later superseded by accounts. |
| 116–120 | Public practice catalog/discovery, isolated pagination/performance proof and first-import/release rehearsals. Original 150 exercises stayed lesson-only. Prior PG16 inventory and compatibility markers were observations at those dates, not fresh PG18 proof. |
| 121–122 | Simplified to one sequential operator bank and application Compose; history/package/import engines, labs and decorative systems retired. Topic/course theory remains authored code. Old data/snapshots were preserved until separate explicit host decisions. |
| 123–125 | Exact-SHA release readiness, public statement-only search, authored answer instructions and shared Nginx read budget across API/SSR/server functions. Compact inline solving preserves drafts on collapse; architect removed next-task navigation, retained filtered return links. |
| 126 | EGE catalog: 25 rows with 19–21 grouped, published-only links, topic search/progress filtering and bounded educational miniatures. Historical acceptance includes desktop/mobile/no-JS/ingress/contract proof, not deployment. |
| 127–128 | Four-course catalog is the approved raster miniature exception; only Python is published. Python overview is text-only with 28 lessons/nine modules/four-stage project, truthful counts and native disclosure fallback. PNG masters and iterations are recoverable from this snapshot. |
| 129 | Lesson readability, plain inline notation, numeric difficulty, responsive theory links and return-to-top. Architect corrections superseded the initial link placement and 56px strip; final mobile control is 40px plus safe area. |
| 130–131 | Restore-verifier ownership and deploy transport failure handling; fake transport tests prove recovery boundaries without asserting a production release. |
| 132 | Earlier resumable verification/model-routing design. Superseded by 146; historical exact-input static reuse is not permission to revive an evidence cache. |
| 133–135 | External cookieless tracker retained; application owns CSP allowlist only. Verification command grouping and exact-SHA CI/image name handling refined. |
| 136–139 | Architect-authorized host/ops retirement, retention and patching. Root/password SSH remains explicit policy. Retired ops volumes/snapshots and later empty PG16 volume were removed only through separately authorized host work; those actions grant no general cleanup authority. |
| 140 | Optional accounts and server-owned, account/context/revision-scoped results. Guests retain learning/checking without saved progress; no answer text or guest history import. Account deletion and lesson-scoped reset explicitly confirmed by the architect on 2026-09-24. |
| 141–145 | CI/static repairs and first account-schema cutover compatibility: Restic 0.16.4 lacks summary; offline migration calls `.venv/bin/alembic`; SQL stdin requires `docker exec -i`. Failed rehearsals cleaned temporary resources and wrote no attestation. Change 145 local closure was explicitly waived without rerunning gates; no production proof was claimed. |
| 146 | Compact affected Critical; Full only on explicit request, candidate-specific release/security/image proof and weekly/manual audits. New audit/cache/scheduler/release platforms were removed. Native Sol/Luna/Astra roles validated in a fresh session; no model cost/speedup claim. |
| 147–148 | Protected pre-migration backups, focused dependency classification, narrow historical Gitleaks exceptions and CI line-length repair. Exact-SHA advisory exceptions never transfer to another candidate; publication is not successful deployment. |
| 149–153 | Five additional TopicLessons: sequences, strings, integers, sorting/selection, clustering. Published source-tree content received local acceptance; release/import are separate. Current lesson-quality records remain authored evidence. |

## Snapshot 111–153: unresolved risks and acceptance limits

- Practice files may retain unreferenced bytes after a failed import; automatic garbage collection,
  concurrent editorial writes and conflict merging were deliberately excluded. Legacy task JSON
  remains meaningful test input, not runtime bank data.
- Change 120 retained imported source answers unchanged. Added explanations were methodological,
  not independently verified calculations; human mathematical review of those imported tasks
  remained an architect-owned manual step. Import/checker/structural acceptance is not proof of
  answer correctness, and no later human closure is claimed here.
- The historical practice UX study proposed learner usability testing; no participant study or
  measured learning benefit is claimed. Later UI changes do not retrospectively prove those hypotheses.
- Change 140 explicitly accepted no age/guardian verification, no public operator name/address and
  pre-release RKN deferral. The checkbox is not evidence of guardian authority. Provider accounts
  require their own consent capture before flags are enabled. Formal legal review remains open.
- Deleted-account backup reconciliation fails closed: hard deletion has no durable external
  tombstone. A deletion ledger requires separate design; cleanup does not bypass that safeguard.
  Provider applications/callbacks/mail and installed retention timers need environment-specific proof.
- The exact pre-migration account-cutover backup was lost; an older `122_01` snapshot was held under
  the Restic lock with replacement ID `94c5a3e7b7e6ecf485d6ac21194ac295ecc6579b72dc95a2203b0e1afd2b8214`.
  Manual hold review is due on/after 2026-10-26. This does not recover the deleted exact backup.
- On 2026-09-26 browser audit `36243493157` passed while security audit `36243491641` failed at four
  historical checksum findings before SAST/config/dependency steps. Architect-approved value/path
  Gitleaks exceptions and a later local scan do not turn that remote run into a PASS.
- The historical dev-only extract-zip chain had two HIGH advisories without a patch. Any accepted
  exception belongs only to its exact candidate SHA; this checkpoint is not a current dependency scan.
  SHA `4d2b49f7965c34cca0fa15103c5b83aed4fc993a` published images but failed static quality and did not deploy.
- Change 146 toolbar geometry passed four layout cases; interactive screenshot capture timed out.
  Its pilot table/research was superseded by simple opportunistic timing; no benchmark result exists.
  Account browser traces are intentionally excluded from uploaded artifacts to protect session links.
- Change 149 final isolated lesson E2E used an unseeded bank and did not observe eight practice tasks;
  earlier dev bootstrap/bank API checks passed. This remains an acceptance limitation, not a claimed
  fresh seeded journey. Change 150 E2E LSP retained the documented package-resolution limitation.
- Historical references have no current runtime/generator consumers except the retained logo source.
  Completed source PNGs, screenshots, audits, proposals and critique are recoverable by exact path;
  lack of a current import alone was not used as deletion evidence.

## Recovery after Change 154

```bash
python3 scripts/change_history.py inspect
python3 scripts/change_history.py read docs/changes/archive/140-accounts-server-progress.md
python3 scripts/change_history.py read docs/artifacts/127-courses-catalog/masters/python-v2.png
python3 scripts/change_history.py read docs/artifacts/repository-hygiene-audit.md --source a443c286f6928c9501c5fee4365cf93aba00184b
python3 scripts/change_history.py read docs/artifacts/repository-hygiene-audit.md --source ec4ecbabae7dfc0abdfc6cfb19dd2043d46148b4
```

A path appearing in two snapshots requires `--source` with the full SHA. `read` returns exact
bytes to stdout; redirect binary data only to a new temporary file. Missing source objects,
corrupt metadata, incomplete ranges or mismatched hashes fail closed. Fetch full recorded history
from a trusted copy; never replace the source with HEAD. Change 154 and later changes remain ordinary
archives until another explicitly approved compaction. This saves checkout space, not `.git` space.
