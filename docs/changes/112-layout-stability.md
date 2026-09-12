# CHANGE 112 — Стабильная загрузка публичных страниц

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `112` |
| Slug | `layout-stability` |
| Title | Стабильная загрузка публичных страниц |
| Status | `active` |
| Branch | `feature/112-layout-stability` |

## Goal

Устранить подтверждённые LS-01–LS-05 из [аудита](../artifacts/layout-stability-audit.md)
на `/`, `/ege`, `/courses`, `/courses/python`. Сохранить читаемый SSR, текущую композицию
и неподвижную геометрию при поздних/отсутствующих шрифтах, изображениях и JavaScript.
Источник: аудит и команда архитектора «Приступай к реализации»; mode continue.
SPEC остаётся без изменений: это исправление действующего frontend/performance контракта.

## Design References

Текущие `/courses` и `/courses/python`, lab → Система → Визуальный язык.
Сохраняются Image, SurfaceMaterial, SurfaceGlint, artworkDrift, Typography, Progress;
страницы владеют композицией и решением, какое изображение завершает их сцену.
Новая visual capability не добавляется; существующий Image specimen получает delivery contract.

## Backlog

### Backend

None

### Frontend

- [x] F1 Устранить позднюю замену шрифтов через optional delivery, оставить preload только критичных display/UI faces; сохранить начальный readable fallback — _Depends on:_ —
- [x] F2 Зарезервировать одинаковую геометрию progress Python до/после hydration без фиктивного learner state — _Depends on:_ —
- [x] F3 Расширить Image responsive delivery и readiness contract, устранить скрытие готовой SSR-картинки и loading-only min-height; обеспечить fallback/error — _Depends on:_ —
- [x] F4 Подключить responsive WebP derivatives и приоритет hero, синхронизировать image readiness с glint/drift/route у каталогов и overview — _Depends on:_ F3
- [x] F5 Добавить regression browser coverage на production output для delayed fonts/images/JS, no-JS и progress; расширить маршруты performance budget — _Depends on:_ F1, F2, F4
- [x] F6 Зарезервировать footer track главной и scrollbar gutter: медленная передача HTML с inline SVG задерживает появление footer, меняет grid и ширину viewport; проверить обычный motion с network throttling — _Depends on:_ F5
- [x] F7 Убрать зависимость координат фоновых SVG `/ege` от растущей при передаче HTML высоты документа; проверить все четыре маршрута с network throttling — _Depends on:_ F6
- [x] F8 Зарезервировать ширину desktop footer navigation: её выравнивание вправо двигало первую ссылку при позднем получении второй ссылки из HTML — _Depends on:_ F6
- [x] F9 Устранить чёрные пятна от SVG-фильтров при задержанной/отсутствующей картинке (скриншот архитектора `incorrect_bg.png`); проверить промежуточный paint с JS/no-JS и failed image, сохранить pixel regression и evidence — _Depends on:_ F8

### Infra

None

### Other

- [x] T1 Синхронизировать FRONTEND/STACK и сохранить before/after evidence; Critical Gate и repository hygiene — _Depends on:_ F5
- [x] T2 Закрепить best practices визуальной стабильности и условия regression-проверок в FRONTEND/STACK перед локальным ship — _Depends on:_ F9

## Files

### Create / modify

- `apps/web/src/pages/course-catalog/components/course-catalog-ambient-field.tsx`
- `apps/web/src/app/styles/fonts.css`, `apps/web/src/routes/__root.tsx`
- `apps/web/src/app/styles/globals.css`, `apps/web/src/pages/foundation/foundation-page.module.css`
- `apps/web/src/widgets/public-footer/public-footer.module.css`
- `apps/web/src/shared/components/image/**`, `apps/web/src/shared/styles/patterns.module.css`
- `apps/web/src/pages/course-overview/components/{course-overview-progress,course-overview-artwork,course-overview-study,course-overview-field}.tsx`, `course-overview-page.module.css`
- `apps/web/src/pages/course-catalog/components/{course-catalog-card,course-catalog-study,course-catalog-staircase}.tsx`, `course-catalog-page.tsx`, `course-catalog-page.module.css`
- `apps/web/src/pages/topic-catalog/components/topic-catalog-card.tsx`
- `apps/web/src/pages/topic-catalog/components/topic-catalog-ambient-field.tsx`, `apps/web/src/pages/topic-catalog/topic-catalog-page.module.css`
- `apps/web/src/pages/design-system-lab/components-catalog.tsx`
- `apps/web/public/images/{course-catalog,course-overview}/responsive/*`, `apps/web/public/topics/responsive/*`
- `scripts/generate-responsive-images.mjs`, `package.json`
- `apps/web/tests/shared-components.test.tsx`, focused course progress tests
- `apps/web/e2e/{fixtures.ts,layout-stability.spec.ts}`, `apps/web/e2e/pages/layout-stability*.ts`
- `apps/web/playwright.layout.config.ts`, `apps/web/playwright.config.ts`, `apps/web/e2e/pages/python-course.page.ts`, `apps/web/package.json`, `lighthouserc.cjs`
- `docs/FRONTEND.md`, `docs/STACK.md`, `docs/artifacts/layout-stability-verification.md`
- `docs/artifacts/layout-stability-audit.md`, `docs/artifacts/incorrect_bg.png`

### Do NOT touch

- Existing staged reference/material files, original artwork/master assets, lesson content.
- API, storage schema, analytics behavior, production infra, deployment/push.
- Archive/local merge разрешены отдельной командой архитектора на ship после T2.

## Contracts

See SPEC §5/§8, FRONTEND §4/§4.1/§5/§8 and Files above.

## Task Plan

- F1: CSS optional, remove noncritical mono preload; compare cold/delayed fonts on four routes.
- F2: permanent progress section and neutral initial text with stable two-line slot; no-JS and hydrated storage assertions.
- F3: native responsive props and semantic loaded notification, always-visible native image, stable geometry through errors; test cache/load/fallback/src change. Image owns browser readiness, pages receive no DOM/event objects.
- F4: deterministic resize derivatives of existing artwork, page-owned sizes/priority. Local loaded state gates existing activity; no global asset registry or duplicated network loading.
- F5: domain Page Object owns instrumentation/assertions; fixture owns isolated contexts/cleanup. Production-only dedicated config avoids Vite hydration noise. Anchor movement ≤1 CSS px in isolated delay cases; CLS and readiness checked separately.
- T1: focused unit/browser evidence, mandated MCP screenshot/console and TypeScript LSP; once-per-target Critical Gate.

## Gate Checks

Use [STACK](../STACK.md) Critical Gate. Explicit scope includes a production build and focused
layout stability browser suite plus MCP cold-network verification; not Full Gate or full E2E.
Performance route coverage changes without raising thresholds. No production operations.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Проверки и ограничения: [verification](../artifacts/layout-stability-verification.md).
- F6–F8 выявлены только при throttling всей HTML-передачи; isolated задержки fonts/images/JS их не воспроизводили.
- Optional допускает сохранение fallback на холодном визите; frontend contract обновлён.
- Существующие 14 staged материалов архитектора сохранены без изменений.

## Commit Message

```text
fix(change-112): stabilize fonts, progress and artwork loading
```
