# CHANGE 155 — Иллюстрации каталога ЕГЭ по подготовленным исходникам

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `155` |
| Slug | `ege-reference-illustrations` |
| Title | Иллюстрации каталога ЕГЭ по подготовленным исходникам |
| Status | `archived` |
| Branch | `feature/155-ege-reference-illustrations` |

## Goal

Добавить подготовленные иллюстрации в соответствующие строки `/ege`, сохранив композицию,
читабельность и геометрию каталога. Темы 5 и 16 служат эталоном масштаба; принятые мастера сохраняются.

## Design References

- `/ege` — существующие строки тем 5 и 16, фиксированное место изображения и независимый текст.
- Десять пользовательских прозрачных PNG задали первоначальные композиции и соответствие
  темам по префиксам; после приёмки результата они удалены по F11. Темы 19–21 используют одну строку.
- `docs/artifacts/references/ege_themes_illustrations/generated/` — принятые PNG-мастера и промпты.

## Backlog

### Frontend

- [x] F1 Подготовить компактные прозрачные изображения из десяти исходников: убрать пустые поля, сохранить весь рисунок и пропорции, согласовать видимый масштаб с темами 5/16. — _Depends on:_ —
- [x] F2 Подключить изображения по номерам тем, убрать индивидуальные CSS-увеличения, сохранить колонки и общий размер мобильного слота; актуализировать описание иллюстраций в SPEC/FRONTEND в рамках пользовательского запроса. — _Depends on:_ F1
- [x] F3 Обновить существующую проверку изображений каталога и проверить геометрию, загрузку, поиск и резервирование места при сбое изображений на desktop/mobile; выполнить требуемый Critical Gate и независимое ревью. — _Depends on:_ F2

- [x] F4 По находке независимого ревью: проверить загрузку и отсутствие пересечения новых иллюстраций с заголовками также во всех четырёх сценариях responsive с задержанными изображениями. — _Depends on:_ F3

- [x] F5 Замечание архитектора: увеличить видимый масштаб подготовленных рисунков и место для них, адаптировать сетку на узких desktop/tablet, сохранить размер рисунков 5/16, читаемость текста и стабильную геометрию; проверить desktop/mobile. — _Depends on:_ F4

- [x] F6 По ревью F5: сохранить прежнюю ширину SVG 5/16 также на tablet/узком desktop до 72rem; последующее уточнение F7 заменяет специальный SVG-масштаб общей растровой композицией с сохранением эталонных пропорций. — _Depends on:_ F5

- [x] F7 Замечание архитектора: унифицировать стиль растровой генерацией высокого качества по исходникам с сохранением сложной композиции, цифр, подписей и связей; общий характер линий и подписей, сопоставимый видимый размер; проверить итоговый ансамбль desktop/mobile. Векторная перерисовка отменена по уточнению архитектора. — _Depends on:_ F6

- [x] F8 Диагностировать выявленную гонку браузерной проверки delayed-assets: первая запись геометрии иногда производится до загрузки CSS. Сохранить проверку стабильности первого оформленного SSR и последующей гидратации. — _Depends on:_ F7

- [x] F9 По финальному визуальному просмотру растра: облегчить штрихи цифр в темах 17/25 до общего математического стиля, сохранив символы и композиции; подтвердить итоговые изображения в браузере. — _Depends on:_ F7

- [x] F10 По независимому ревью: заменить два временных `undefined` в журнале промптов точными принятыми промптами тем 17/25. — _Depends on:_ F9

- [x] F11 По запросу архитектора: удалить десять первоначальных PNG-референсов, сохранить принятые PNG-мастера и WebP, актуализировать документацию и зафиксировать текущую работу коммитом в feature-ветке без ship/слияния/архивации/push. — _Depends on:_ F10

### Backend

None

### Infra

None

## Files

### Create / modify

```text
apps/web/public/images/topics/*.webp (production derivatives)
apps/web/public/images/topics/number-record.svg / recursion.svg (existing references only)
docs/artifacts/references/ege_themes_illustrations/generated/*.png (high-resolution masters)
docs/artifacts/references/ege_themes_illustrations/generated/README.md (generation prompts and provenance)
docs/artifacts/references/ege_themes_illustrations/*.png (delete ten original references per F11)
apps/web/src/entities/topic-catalog/topic-catalog.ts
apps/web/src/pages/topic-catalog/topic-catalog-page.module.css
apps/web/src/pages/topic-catalog/components/topic-catalog-illustration.tsx
apps/web/e2e/pages/topic-catalog.page.ts
apps/web/src/entities/topic-catalog/topic-catalog.test.ts (if needed)
docs/SPEC.md (EGE illustration inventory only)
docs/FRONTEND.md (§9 illustration inventory only)
docs/changes/155-ege-reference-illustrations.md
```

### Do NOT touch

- Принятые мастера `docs/artifacts/references/ege_themes_illustrations/generated/` при удалении первоначальных референсов F11.
- Содержание уроков, публикации, API, БД, авторизация, зависимости и release.
- Смысл эталонных иллюстраций тем 5 и 16; F7 допускает унификацию их оформления.

## Contracts

See `docs/SPEC.md` §5 and `docs/FRONTEND.md` §9 and the Files list above.

## Gate Checks

Critical Gate: [STACK](../../STACK.md). Аffected frontend static checks plus focused catalog browser
acceptance; no Full Gate or release. High-quality raster edits preserve source compositions; baseline5/16 are rasterized without redesign.

## Implementation Notes

- `13_theme.png` depicts networks/IP while the current topic-13 title is branching/enumeration.
  The user explicitly requested matching source prefixes; retain that mapping and lesson content.
- F7 supersedes F6-specific SVG sizing: approved 5/16 compositions are rasterized at their
  144×88 logical scale inside the common 192×104 canvas; all figures adapt together to the slot.

## Verification

- PASS: frozen pnpm install earlier in this unchanged-dependency change; final code set
  `pnpm format:check`, `pnpm --filter web lint`, `pnpm --filter web typecheck`.
- PASS: `pnpm --filter web exec playwright test e2e/topic-catalog.spec.ts` — 13/13,
  including search, no-JS, errors, zoom, delayed/failed assets at 1305/820/390/360px.
- PASS after final raster17/25 refinements: same command with `--grep 'delayed assets'` —
  4/4; all twelve images decoded at 576×312, contained in their slots and separate from titles.
  CSS readiness now precedes the initial geometry snapshot; scripts/fonts/images/summary
  remain blocked and the original geometry/CLS assertions remain intact.
- PASS: registry TypeScript LSP has zero diagnostics. E2E-file LSP reproduces the known
  isolated wrong Playwright declaration view (20 cascading diagnostics); binding workspace
  TypeScript compiler and actual browser runner pass. No casts/import changes hide diagnostics.
- PASS: Impeccable detector reports `[]`. Independent final review found no substantive blockers;
  its two prompt-log placeholders were corrected and checked.
- Browser: Playwriter connected to ordinary Chrome, confirmed twelve loaded images and no overflow
  at 1440px. Screenshot capture timed out in its relay; DevTools fallback captured the full desktop
  catalog and 390px mobile catalog, then confirmed final refined digits at both widths.
  Generated drawings were compared with every original on white: labels, graph/table connections,
  mask, bars/hatching/checks, selection corners and original stone/point counts preserved.
- Live dev stack with PostgreSQL at `http://localhost:8080/ege`: auth/session and practice-summary
  HTTP 200; all twelve raster files load, no console errors/warnings, guest progress settles normally.
  Earlier standalone-server absent-DB errors were environment failures; final live stack resolves them.
- All twelve production files are lossless RGBA WebP576×312, total230416bytes. High-resolution
  PNG masters and generation prompts are retained; after acceptance the ten original supplied
  PNGs were deleted at the architect's explicit request in F11.
- PASS F11: deleted exactly ten original PNG references; SHA-256 comparison confirms all
  twelve accepted masters and twelve production WebPs are unchanged. Documentation now points
  to retained masters. Earlier frontend/browser evidence remains valid: no runtime/test code or
  production image changed during F11. Checkpoint commit only; change remains active.
- SKIPPED: full build/Full Gate, broad audits, backend/DB/API regeneration and release:
  changed boundary is catalog assets/metadata/CSS and owning browser assertions.
- PASS: reviewed `make clean-dry-run`, ran `make clean`, `make clean-check`, and checked diff whitespace;
  temporary browser-session tab closed
  and Playwriter session deleted. User dev stack remains running.

## Commit Message

```text
feat(change-155): fit supplied illustrations to EGE catalog
```
