# CHANGE 108 — Runtime hygiene

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `108` |
| Slug | `runtime-hygiene` |
| Title | Runtime hygiene |
| Status | `active` — реализован, ожидает `/ship` |
| Branch | `feature/108-runtime-hygiene` |

## Goal

Выполнить этап 3 [общей очереди аудита](../artifacts/repository-hygiene-audit.md#111-очередь-и-обязательные-условия-перехода)
после локального закрытия Change 107: убрать подтверждённые остатки CSS/token API и старые
пустые filesystem targets. Сохранить поведение, композицию и независимую доставку Nginx error pages.
Источник brief: указание архитектора перейти к следующему этапу + аудит §11 (C02–C04, A01/A02).
SPEC, публичные API, контент и визуальное направление не меняются.

## Design References

Существующие `/courses`, `/lab/design-system` и `/lab/design-system#system-auxiliary-states`; автономные Nginx 502/503/504.
Это удаление неиспользуемых правил. Новые роли/компоненты не вводятся; живые shared primitives
и page composition Change 107 остаются эталоном. Для удаления нужны отсутствие consumers
и сравнение computed styles до/после, включая narrow и forced-colors у Nginx.

## Backlog

### Frontend

- [x] `F1` Повторно проверить 16 кандидатов C04 точным поиском по актуальным source/config/tests,
  включая динамическую lab token map. Удалить только определения без consumers; сохранить
  `--max-content-width`, `--surface-tonal-2`, одноимённые префиксы и живые theme values.
  До/после сравнить computed presentation lab, catalog и app error states.
  — _Depends on:_ —
- [x] `F2` Удалить неработающую `--page-frame-background` из course catalog (остаток C03).
  Проверить текущий pageFrame и отсутствие потребления; геометрия и фон каталога не меняются.
  — _Depends on:_ F1

### Infra

- [x] `I1` Удалить только неиспользуемые `.code`, `.art`, `.visual`, `.diagram`, `.route`,
  `.break-disc` rules, связанные descendant/media ветки из автономного `styles.css` (C02).
  Сохранить используемые numeral, scenes, chrome, focus, forced-colors и самостоятельную поставку
  CSS/assets. Проверить фактические HTML и DOM, затем 502/503/504 и изоляцию Nginx.
  — _Depends on:_ —
- [x] `I2` После проверки exact mounts и содержимого удалить только пустой
  `apps/web/public/images/route-states/` и `infra/nginx/auxiliary/assets/scenes/.gitkeep` (A01/A02).
  Использовать empty-only rmdir для каталогов; сохранить fonts/.gitkeep и brand SVG mountpoint.
  Уточнить историческую gotcha о nested read-only mounts по текущей topology.
  — _Depends on:_ I1

### Other

- [x] `T1` Провести affected-area Critical Gate по STACK и существующий
  `bash scripts/tests/auxiliary-pages.test.sh`. Browser MCP: снимки и console, Nginx desktop/narrow,
  forced-colors/reduced-motion, lab/catalog/app states; сравнение computed styles до/после.
  Зафиксировать решения по всем кандидатам, синхронизировать указатель очереди аудита и выполнить
  штатный cleanup после анализа evidence. — _Depends on:_ F1, F2, I1, I2

## Files

### Create / modify

```text
apps/web/src/app/styles/tokens.css
apps/web/src/pages/course-catalog/course-catalog-page.module.css
infra/nginx/auxiliary/assets/styles.css
infra/nginx/auxiliary/assets/scenes/.gitkeep (delete)
apps/web/public/images/route-states/ (empty-only removal)
docs/KNOWN_GOTCHAS.md
docs/artifacts/repository-hygiene-audit.md
docs/changes/108-runtime-hygiene.md
```

### Do NOT touch

- Authored content, API/backend/domain logic, routes/storage, dependencies, live tokens and components.
- Nginx routing/security headers, Compose mounts, Docker images, production state.
- Пользовательские 14 staged additions, references, logo/artwork, archived changes и Git history.
- Документная компрессия, SDD lifecycle и squash архива: следующие отдельные этапы §11.

## Contracts

См. `docs/SPEC.md` §5–§8, `docs/FRONTEND.md` и Files выше. SPEC unchanged.

## Gate Checks

Critical Gate определяется [STACK](../STACK.md#critical-gate). Дополнительный узкий override:
`bash scripts/tests/auxiliary-pages.test.sh`; `--preview` используется только для browser evidence
и затем завершается штатно. Unit-тест, зеркалящий удалённый CSS/token, не нужен. Full Gate не назначен.
Для CSS-only изменений LSP и API regen не применимы; web lint/typecheck проверяют consumers.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- C04: все 16 исходных кандидатов проверены заново, consumers не найдено, определения удалены.
  Динамическая lab map использует явные token names; живые lab tokens и theme palette сохранены.
  C03: удалена одна неработающая catalog declaration. C02: удалены 15 rules и один участник
  группового forced-colors selector; HTML всех трёх страниц не содержит этих шести классов.
- A01/A02: empty-only removal двух каталогов и единственного scenes/.gitkeep; fonts/.gitkeep и
  brand SVG сохранены. Изолированный Nginx успешно стартовал заново после удаления placeholder.
- Проверки: format, web lint/typecheck и Nginx auxiliary contract — PASS. 18 сравнений computed
  styles до/после совпали (1440×900 и 390×844; catalog, design-system/lesson labs, 502/503/504;
  Nginx также forced-colors, motion отключён для воспроизводимого сравнения); overflow отсутствует.
  MCP screenshots просмотрены, app console clean; на Nginx error document только ожидаемый HTTP 503.
- Unit/LSP/API/backend/shell-lint — SKIPPED: удаление CSS/declarations/placeholder, соответствующие
  source/contracts не менялись. Существующий shell integration test выполнен; Full Gate не требовался.
- Hygiene dry-run/apply/check — PASS; временный Nginx container удалён test trap, dev stack
  возвращён в исходное остановленное состояние, данные сохранены.
- Change 107 закрыт локально перед созданием этой ветки. 14 пользовательских staged additions
  сохранены без изменения; push/deploy не выполнялись.


## Commit Message

```text
chore(change-108): remove verified runtime leftovers
```
