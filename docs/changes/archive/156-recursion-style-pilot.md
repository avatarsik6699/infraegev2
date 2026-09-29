# CHANGE 156 — Единый визуальный стиль уроков и сайта

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `156` |
| Slug | `recursion-style-pilot` |
| Title | Единый визуальный стиль уроков и сайта |
| Status | `archived` |
| Branch | `feature/156-recursion-style-pilot` |

## Goal

Распространить одобренный UI/UX `/ege/16-rekursiya` на все уроки и семейства
страниц сайта: спокойная типографика, общие ссылки, semantic feedback, раскрытия
и смысловые отступы, сохраняя композицию, иллюстрации и функциональные контракты.
Визуальное ревью: синий цвет ссылок и оглавления одобрен для проекта.
Добавленный strong/em отклонён; подчёркивание ссылок только при наведении,
табы нейтральные. Остальные элементы пилота сохраняются.

## Design References

- [Virgilio: оглавление](https://virgili0.github.io/Virgilio/#table-of-contents).
- [Virgilio: статья](https://virgili0.github.io/Virgilio/paradiso/do-you-really-need-ml.html#no-value-without-a-cultural-change).
- Существующий урок задания 16: сохранить шрифты, геометрию и чернильные кнопки.

## Backlog

### Frontend

- [x] F1 Зафиксировать ограниченный пилот в SPEC/FRONTEND и включить семантический профиль только для lesson ID `rekursiya`: синие ссылки, активная группа/подраздел и маркер, success/danger для соответствующих состояний, линии под подразделами теории. — _Depends on:_ —
- [x] F2 (Superseded by F5 after visual review) Разметить короткие смысловые акценты и ключевые правила урока через em/strong, сохранив весь текст, формулы, код и порядок; проверить курсив Golos Text. — _Depends on:_ F1
- [x] F3 Проверить desktop/mobile, переходы и прокрутку оглавления, ошибки/успех, контраст, клавиатуру и no-JS; подтвердить изоляцию на другом уроке, каталоге и входе, провести независимое ревью, affected Critical Gate и hygiene. — _Depends on:_ F1, F2
- [x] F4 Устранить подтверждённый перехват мобильного нажатия пустой областью нижней панели при потере фокуса поля ответа; ограничить исправление пилотным профилем и проверить обычное нажатие у нижнего края. — _Depends on:_ F1

- [x] F5 По визуальному ревью убрать добавленные strong/em урока и вернуть нейтральное подчёркивание активных табов.
- [x] F6 Распространить одобренный синий цвет на текстовые ссылки и текущую позицию оглавления проекта; оставить кнопки и навигационные поверхности нейтральными. Подчёркивание текстовых ссылок показывать только при hover/focus-visible.
- [x] F7 Сблизить стрелки ссылок с текстом, добавить небольшой направленный сдвиг при hover с reduced-motion; исправить разъезд и переносы ссылки на теорию в практике.
- [x] F8 Обновить контракт и браузерные проверки по новому решению, проверить desktop/mobile и общие потребители, провести независимое ревью и affected Critical/hygiene.

- [x] F9 Перевести обычные текстовые ссылки входа/согласия/политики/профиля и контекстные ссылки Python на общую ActionLink, чтобы синий цвет и hover применялись также к прежним raw Link. Навигацию/карточки сохранить нейтральными.

- [x] F10 Провести комплексное исследование контентной части рекурсии: типографика/цвета/отступы/переносы, блоки примеров и итог, desktop/mobile/zoom. Подготовить независимые оценки и подробный отчёт с измерениями и рекомендациями; без изменения UI.

- [x] F11 По итогам F10 упростить типографику примеров только в recursion-pilot: условие/пояснение/шаги 16px/400 основного цвета, формулы без каскадного уменьшения; сохранить подпись и номера компактными. Согласовать заголовок «Что получилось» с подразделами теории.
- [x] F12 Сохранить весь учебный текст и порядок; структурировать переносы условий трёх примеров и коротких математических термов. В пилоте сохранить код 13px на мобильном и проверить локальную прокрутку длинных строк, узкую ширину и увеличение текста.
- [x] F13 Проверить F11–F12 на desktop/mobile/no-JS и на другом уроке, обновить focused browser acceptance/контракт, получить независимое ревью, выполнить affected Critical и hygiene. Цвета и поверхности не менять.

- [x] F14 Углубить ревью и доработать в recursion-pilot «Проверьте себя», «Подсказку», «Решение», concept mistake и «Когда применим этот приём»: спокойная и согласованная типографика, смысловые отступы, устойчивые переносы, понятные раскрытия и доступные состояния. Сохранить контент и одобренные семантические цвета; другие уроки не менять.
- [x] F15 Проверить F14 на desktop/mobile/узкой ширине, keyboard/no-JS/reduced-motion и увеличении текста; обновить focused acceptance, получить независимое ревью и affected Critical/hygiene.

### Backend

None

### Infra

None

## Review follow-up (2026-09-28)

- [x] F16 Разделить роли заголовка и раскрытого текста в accordion: умеренный вес управляющей строки, спокойное пространственное отделение ответа; «Проверьте себя» без цветной подложки и синего, с существующей иконкой. Только recursion-pilot.
- [x] F17 Согласовать «Разберём на примере» с contextual label callout, добавить подходящую Lucide-иконку только в пилоте; выровнять номера шагов относительно первой строки.
- [x] F18 Устранить рассинхрон кода/формул в пилоте через согласованные семантические размеры, сохранив authored текст, математические знаки, переносы и горизонтальную прокрутку больших code blocks.
- [x] F19 Дополнительно исследовать весь урок, включая header/outline/navigation/practice/feedback/mobile; занести конкретные подтверждённые дефекты перед исправлением, проверить desktop/mobile/keyboard/no-JS/enlarged text, независимое ревью и affected Critical/hygiene.

- [x] F20 Дополнительный аудит подтвердил пять формул с ASCII-дефисом вместо математического минуса рядом с формулами U+2212. Согласовать только математические Notation kind="formula"; настоящий Python-код и смысл текста сохранить.

- [x] F21 Браузер подтвердил documentWidth394px при viewport320px + 200% root text: длинные слова intro/context/concept и сгруппированный operand. В пилоте разрешить аварийный перенос длинного слова, перестройку context navigation на две строки при недостатке места и ограничить ширину группы формулы, сохранив обычное цельное отображение и локальную прокрутку кода. Проверить JS/no-JS reflow.

- [x] F22 В no-JS + 320px/200% text оставшееся переполнение342px принадлежит header session loading label (nowrap icon+«Проверяем вход»). В пилоте позволить перенос статусной строки без скрытия текста или изменения account/auth логики.

- [x] F23 По итогам ручного ревью убрать боковую линию раскрытий, сохранив отступ; единообразно уменьшить код/формулы пилота до0.8 от основного размера. Проверить desktop/mobile/no-JS,200% text и локальную прокрутку; общий rollout не выполнять.

- [x] F24 По ручному ревью увеличить единый размер кода/формул пилота с0.8 до0.9: сохранить моноширинное отличие от текста без возврата к1. Проверить desktop/mobile/no-JS/200% text и локальную прокрутку кода.

- [x] F25 Распространить одобренную типографику/цвета/отступы/раскрытия пилота на общие учебные компоненты и все уроки ЕГЭ/Python; убрать временные селекторы/проверки lesson ID, сохранить контент и размер кода0.9.
- [x] F26 Провести ревью всех семейств страниц сайта и унифицировать типографику, ссылки, отступы, переносы и semantic feedback через общие роли; сохранить композицию, иллюстрации и функциональные сценарии. Обновить SPEC/FRONTEND.
- [x] F27 Проверить все опубликованные уроки, representative desktop/mobile страниц и degraded состояния, обновить acceptance, выполнить независимое ревью, affected Critical, production SSR/hydration и hygiene. Без ship/release.

- [x] F28 Focused acceptance выявил устаревший router mock в topic-lesson-unavailable-practice: отсутствует createLink для общего ActionLink. Исправить тестовый mock без изменения runtime, проверить деградированную практику.
- [x] F29 Уточнить область status-локатора standalone practice в acceptance: статус проверки ответа должен искаться внутри main, отдельно от статуса сессии в header; сохранить проверки ошибки, ввода и повторной отправки.
- [x] F30 Исправить подтверждённые переполнения при 200% размере текста в каталогах и программе курса; проверить профиль с корректным fixture прогресса. Сохранить обычную композицию и не обрезать текст.
- [x] F31 После основного reflow остаточное переполнение принадлежит InlineSelect сортировки (label + trigger 380px при доступных320px). Разрешить перенос в общем компоненте и ограничить ширину его владельца; в профиле увеличить базовую ширину identity, чтобы не оставлять один символ почты на отдельной строке при обычном mobile.

- [x] F32 В финальной 200% проверке каталога практики пагинация остаётся шире контейнера после исправления сортировки. Разрешить перенос групп ссылок пагинации, сохранив номера, стрелки и целевые страницы.

- [x] F33 Выполнить финальный аудит кода, acceptance и документации перед ship; согласовать название/commit message и текущие notes с итоговым rollout, устранить подтверждённые расхождения и проверить готовность истории изменений.

- [x] F34 Исправить находку финального ревью: dense Callout поддерживаемого practice callout блока сохранял body14px/inline code12.6px вместо16px/14.4px. Сохранить compact padding/title, согласовать educational body и проверить существующий renderer fixture и живой браузерный пример.

- [x] F35 Найдено при ship (изолированный E2E): одобренный синий `#0074d9` на нейтральной поверхности `#f5f5f5` (callout, внешняя ссылка) даёт контраст 4.28:1 < 4.5:1 (axe `color-contrast`, `/courses/python/pervaya-programma`). Токен `--theme-link` затемнён до `#0070d2` (4.94:1 на белом, 4.53:1 на `#f5f5f5`); оттенок остаётся синим, hover `#005aa8` без изменений. Архитектору сообщить как отклонение от одобренного оттенка.

## Files

### Create / modify

- `apps/web/src/app/styles/theme.css`, `tokens.css`
- `apps/web/src/pages/topic-lesson/topic-lesson-page.tsx`
- `apps/web/src/pages/account/account-page.tsx`, `account-form.tsx`, `account-profile.tsx`
- `apps/web/src/pages/privacy/privacy-page.tsx`
- `apps/web/src/entities/lesson/content/python-course-lesson-link.tsx`
- `apps/web/src/shared/components/action-link/action-link.types.ts`
- `apps/web/src/shared/styles/link.module.css`
- `apps/web/src/shared/components/action-link/`, `external-link/`, `tabs/tabs.module.css`
- `apps/web/src/features/lesson-practice/lesson-practice.module.css`, `lesson-practice.tsx`, `lesson-practice.types.ts`
- `apps/web/src/features/lesson-practice/components/practice-task-panel.tsx`, `practice-task-help.tsx`
- `apps/web/src/pages/topic-lesson/components/topic-lesson-result.tsx`
- `apps/web/src/shared/components/inline-select/inline-select.module.css`
- `apps/web/src/shared/components/accordion/accordion.module.css`
- `apps/web/src/shared/components/callout/callout.module.css`
- `apps/web/src/shared/components/learning-content/checkpoint/`, `mistake/mistake.module.css`
- `apps/web/src/widgets/lesson-outline/lesson-outline.module.css`
- `apps/web/src/shared/components/learning-content/lesson-theory/lesson-theory.module.css`
- `apps/web/src/shared/components/learning-content/worked-example/`
- `apps/web/src/shared/components/learning-content/procedure/procedure.module.css`
- `apps/web/src/widgets/public-header/public-header.module.css`
- `apps/web/src/shared/components/notation/notation.module.css`
- `apps/web/src/shared/components/code-block/code-block.module.css`
- `apps/web/src/shared/styles/lesson-layout.module.css`
- `apps/web/src/shared/components/scroll-to-top/scroll-to-top.module.css`
- `apps/web/src/entities/lesson/content/rekursiya.lesson.tsx`
- `apps/web/e2e/topic-reading.spec.ts`, `pages/topic-lesson.page.ts`
- `apps/web/src/pages/`, shared typography and feedback consumers (site-wide rollout)
- `apps/web/e2e/shared-reading.spec.ts`, `pages/minimal-application.page.ts`
- `docs/SPEC.md`, `docs/FRONTEND.md`, this change
- `docs/artifacts/change-156/` (authored review screenshots and content audit)

### Do NOT touch

- Change 155, catalog illustrations, other authored prose, API/DB/auth behavior, dependencies.

## Contracts

See `docs/SPEC.md` §5, `docs/FRONTEND.md` §4/§8 and the Files list above.

## Gate Checks

Affected frontend Critical Gate per [STACK](../../STACK.md), shared-reading acceptance
for all published lessons, representative site-page/degraded states and production
SSR/hydration checks. Historical pilot isolation assertions are superseded by
F25–F27 rollout. Final audit precedes the architect-authorized local ship.
No Full Gate or release.

## Verification

- Affected frontend Critical: format, web lint, repository typecheck, explicit E2E
  compiler and source LSP diagnostics — PASS. API/backend/tooling/shell/build/Full
  checks skipped: their boundaries are unchanged.
- Topic-reading browser coverage: 7 unchanged cases PASS, final updated pilot case
  PASS. Includes mobile/touch, no-JS, outline/keyboard, enlarged text, neutral tabs,
  feedback, tight material-link spacing, hover underlines, arrow direction and
  reduced motion. Keyboard focus uses a real Tab event to exercise focus-visible.
- `vitest run tests/action-semantics.test.tsx tests/shared-components.test.tsx
  tests/account-return-to.test.ts tests/lesson-content-contract.test.ts` — 52 PASS.
- Playwriter verified sign-in and consent links: blue, no resting underline,
  destinations unchanged; console has no application errors. Its screenshot
  capture timed out; Chrome DevTools supplied desktop evidence, then screenshot
  capture stalled there too. Repository Playwright supplied final desktop/mobile
  captures: [desktop](../../artifacts/change-156/links-desktop.png),
  [mobile](../../artifacts/change-156/links-mobile.png). No horizontal overflow or page errors.
- Blue on white: 4.67:1 (после F35 — `#0070d2`: 4.94:1 на белом, 4.53:1 на `#f5f5f5`). Buttons/header/cards retain neutral semantics; other
  lesson rules keep their baseline. At the F5–F9 checkpoint, recursion content was byte-identical to HEAD; later readability changes preserve authored wording and sequence.
- Independent F5–F9 review: no remaining findings. Impeccable detector: `[]`.
- Hygiene is recorded after reports are analyzed; no additional graph-analysis claim.

### F11–F13 readability follow-up

- Format, web lint, web typecheck and explicit E2E TypeScript compiler — PASS.
  Source LSP diagnostics clean. E2E lies outside tsconfig's include; auxiliary LSP
  inferred-project resolution reports Playwright exports incorrectly, while the
  binding compiler with DOM/node/react types passes. No production bypass added.
- Focused Vitest (`lesson-content-contract`, `shared-components`) — 40 PASS.
  `pnpm validate:content` — PASS (735 tasks, 7 Topic / 28 Course lessons).
- Topic-reading — 8 PASS; after token corrections, final affected pilot JS/no-JS
  cases — 2 PASS. Assertions cover all three example roles/formulas, outcome
  rule/size, 320/390/1440 widths, keyboard horizontal code scrolling, outside-pilot
  typography and actual 200% text sizes (steps/formulas32px, code26px).
- Independent review identified fixed-pixel scaling; corrected to relative tokens
  and independently re-reviewed: no remaining findings. Detector type scan: [].
- Playwriter checked live styles/console/network; a fresh owned tab had no app
  errors or >=400 resources. Earlier edited/override tab emitted a hydration warning;
  fresh-load browser acceptance and fresh Chrome tab did not reproduce it.
  Screenshot capture supplied initial images but timed out on the batch, so final
  [desktop/mobile evidence](../../artifacts/change-156/content-pilot/verification.md)
  uses repository Chromium. All five authored captures inspected.
- API/backend/schema/security/dependency/Full/build rows skipped: no corresponding
  boundary change. Existing explicitly authorized dual-active Change155/156 state
  remains; no plan, ship, merge or release performed.

### F14–F15 learning blocks follow-up

- Pilot question/help/answer/mistake body: 16px / 400 / 1.68; semantic labels:
  14px / 500. Removed nested question-heading rule leakage and extra margins.
  Checkpoint indentation removed; callout and comparison body span the full panel.
  Short checkpoint relations stay together; authored wording/order retained.
- Native disclosure fallback enabled only in recursion checkpoint and practice
  help. Answers stay closed until requested with or without JavaScript; multiple
  disclosures work independently. Other lesson consumers keep their defaults.
- Focused unit checks: 40 PASS; topic-reading: 8 existing cases PASS and 2 new
  learning-block cases PASS, with the affected pair rerun after final wrap polish.
  Web lint/typecheck, explicit E2E compiler, source LSP, format and content validation
  PASS. Independent review: no findings, including final short-relation markup.
- Browser coverage: 320/390/768/1440 widths, keyboard focus/disclosure, no-JS,
  reduced motion, 200% text. Fresh Playwriter reload: no application errors or
  failed resources. Desktop/mobile screenshots inspected; repository Chromium
  supplied exact-size batch captures because Playwriter rounds viewport dimensions.
  [Evidence](../../artifacts/change-156/learning-blocks/verification.md).
- Affected checks only; no API/backend/schema/dependency/Full/build boundary change.
  No ship, commit, merge or release. Final hygiene recorded in the evidence report.

### F16–F22 final UI/UX follow-up

- Neutral self-check surface/icon retained; disclosure triggers500 vs answer400,
  thin neutral answer rule and modest indentation. Example icon/label and marker
  alignment corrected; all reading expressions and code unified to16px, five
  mathematical minus glyphs normalized without changing Python.
- Broader source/browser review covered header/context/outline/progress/practice,
  all five tasks, feedback, footer and links.320px/200% reflow findings appended as
  F21–F22 before fixes. Context wraps to a separate row when needed; long words,
  grouped terms and the header session placeholder no longer expand the page.
- Focused Critical: format/lint/typecheck/E2E compiler/LSP/content validation PASS;
  40 focused unit tests and10 topic-reading scenarios PASS. Independent review:
  no remaining findings. Detector type scope: []. Degraded and outside-pilot
  acceptance retained. Auth/API/backend/dependencies/build/Full unchanged.
- [Research and final desktop/mobile evidence](../../artifacts/change-156/final-polish/verification.md).
  Playwriter used first for real Chrome; screenshot timeout required repository
  Chromium capture. Fresh console/network clean. Final allowlisted hygiene PASS.

### F23 disclosure and formula scale follow-up

- Removed the disclosure answer side rule while preserving indentation. Formula
  and code size reduced uniformly to 0.8 of body text: 12.8px normally, 25.6px at
  200% text. Block code uses rem to avoid nested relative scaling.
- Format, lint, focused E2E compiler and four desktop/mobile/no-JS browser
  scenarios PASS. Desktop/mobile screenshots inspected; no application errors
  observed. [Evidence](../../artifacts/change-156/scale-followup/verification.md).
- Other lesson defaults and authored content unchanged. Final hygiene PASS.

### F24 balanced code and formula scale

- Increased the unified pilot scale to 0.9 (14.4px with 16px reading text).
  Monospace preserves the visual distinction; disclosure indentation remains.
- Format/lint/focused E2E compiler and four browser scenarios PASS. Desktop/mobile
  screenshots inspected. E2E LSP retains its known inferred-project import errors;
  explicit strict compilation PASS. Type detector: no findings. Hygiene PASS.
  [Evidence](../../artifacts/change-156/balanced-scale/verification.md).

## Implementation Notes

- The mobile bottom strip previously intercepted answer-button clicks when input
  blur made it reappear between pointerdown and pointerup. Initially fixed in the
  pilot, the shared strip now passes pointer events through empty space while
  preserving its button after F25 rollout.
- Explicitly authorized separate pilot while Change 155 is awaiting ship. History inspection
  verified next number 156; branch starts at saved Change 155 commit `562f2bb`, preserving its
  accepted local illustrations. No merge/archive of Change 155 is implied.

- The earlier320px +200% overflow observation was resolved in F21–F22: diagnosis
  separated context/title/grouped-term overflow from the no-JS header session label.
  Pilot now reflows at320/390/900px with and without scripts; this remains a focused
  reading check, not a complete WCAG audit.

## Commit Message

```
feat(change-156): unify lesson and site visual style
```

### F25–F32 site-wide rollout

- Promoted the approved reading system to shared tokens/components and removed
  lesson-ID/pilot switches. Code/formulas0.9, neutral checkpoints/disclosures,
  semantic feedback and authored wording retained. SPEC/FRONTEND updated.
- All35 published lessons pass production JS/no-JS acceptance (70 cases), with
  200% text/font and overflow/disclosure checks. Site-family61 cases pass after
  focused corrections; changed catalog reflow34 cases and profile/feedback2
  cases rerun; final pagination navigation1 PASS. Production layout5 PASS.
- Final production build and source/compiler/lint/content/focused-unit checks
  pass. Independent reviewer findings resolved, including the fixed mobile
  pagination grid override; final re-review has no findings.
- Final authored [report and desktop/mobile evidence](../../artifacts/change-156/site-rollout/verification.md)
  covers17 routes/states, 820px course catalog, enlarged sort/pagination, and
  native pagination. All34 route/viewport observations have no ordinary/200%
  horizontal overflow and no unexpected app/resource errors.
- API/schema/dependency/auth behavior unchanged; Full/release checks not invoked.
  No ship, commit, merge, push or deploy.

### F33–F34 final audit

- Two independent final reviews completed; dense practice callout typography gap
  corrected. Fresh format/lint/build,46 focused unit cases and desktop/mobile/200%
  Playwriter fixture checks PASS. No remaining P1/P2 findings.
- Final [audit report](../../artifacts/change-156/final-audit/verification.md) records
  accepted unchanged rollout evidence and the unresolved155/156 history boundary.
