# Layout stability — Change 112

Дата: 2026-09-12. Локальная production-сборка ветки `feature/112-layout-stability`.
Исходное состояние: [аудит](layout-stability-audit.md). Публичный сайт не обновлялся.

## Исправления

- Шрифты используют optional: при медленной доставке документ сохраняет читаемый
  fallback. Mono не конкурирует с критичными display/UI preload.
- Python progress существует в SSR с нейтральной подписью и зарезервированной
  полосой; чтение пустого или полностью освоенного локального прогресса не двигает программу.
- Shared Image сохраняет видимость готового native image при hydration, стабильные
  размеры при loading/error и поддерживает responsive delivery/readiness notification.
- У карточек, hero и studies эффекты включаются после готовности соответствующего
  изображения. Добавлены 26 WebP derivatives существующих оригиналов, srcset/sizes
  и приоритеты загрузки. Оригинальные материалы сохранены.
- Медленная передача HTML выявила дополнительные причины: footer после большой
  inline SVG менял размер grid главной, scrollbar сужал страницу, правое выравнивание
  footer navigation двигало уже полученную ссылку, а процентные координаты фоновых
  SVG `/ege` зависели от растущей высоты документа. Добавлены резервирование
  footer track/gutter/navigation и независимые от высоты документа координаты фона.

## Проверки

Focused Chromium suite содержит 27 сценариев: четыре маршрута на 390/1440 px
с медленной передачей всей страницы и обычным motion; задержанные шрифты на обеих
ширинах; пустой/полностью освоенный progress с задержанным JS; readiness эффектов
при задержанных картинках; все четыре страницы без JavaScript.

Network profile: 800 Kbps download, 150 ms latency, CPU slowdown ×4, cold cache.
Streamed-page проверки требуют сумму layout-shift без пользовательского ввода
меньше 0.00001; isolated задержки сравнивают геометрию anchors с допуском 1 CSS px.
Page Object владеет CDP/DOM-инструментацией; specs используют domain fixtures.

До исправлений Windows Chrome 153 дал CLS 0.094823 для главной mobile,
0.010339 для тем mobile, 0.035699 для мини-курсов mobile и 0.015702 для Python desktop.
После исправлений повторные MCP-замеры этих маршрутов дали CLS 0, без page errors
и горизонтального overflow. В том же профиле Python artwork каталога на 390 px
завершил загрузку примерно за 2.2 s вместо 10.4 s; это лабораторное сравнение,
не гарантия времени доставки. Передача выбранного Python derivative — около 25 KB.

Critical Gate: format, web lint (включая architecture policies), typecheck — PASS;
49 focused unit tests — PASS; production build — PASS (36 prerendered routes);
27 production browser scenarios — PASS. Генератор derivatives проходит `node --check`.
MCP screenshots главной desktop, каталогов mobile и Python desktop просмотрены:
перекрытий/обрезания контента не обнаружено. Console: runtime errors 0; при optional
fallback Chrome может выдать четыре предупреждения о намеренно preloaded, но не
использованных в текущем документе display/UI fonts. Поздний font swap не включается.
Repository hygiene: `make clean-dry-run`, reviewed allowlist, `make clean`,
`make clean-check` — PASS. Временные production server/build/test outputs удалены;
существующий Docker dev stack сохранён.

## Ограничения и сопровождение

### F9 — чёрное пятно при загрузке `/courses`

Скриншот архитектора `incorrect_bg.png` воспроизведён на production build через
отключение WebP-запросов. Причина — `course-staircase-ink`: его матрица вычисляла
`A' = -3R -3G -3B + 8.4`. Для прозрачного пустого входа результат ограничивается
до alpha=1, а RGB обнуляется: фильтр рисовал чёрный прямоугольник, который маски и
opacity превращали в серое пятно. Это paint defect, а не layout shift. Формула
соответствует [описанию feColorMatrix](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feColorMatrix).

После матрицы добавлен `feComposite in2="SourceAlpha" operator="in"`: фильтр
может окрашивать только существующие пиксели изображения. Исправление работает
без JS, при pending/error и для обеих лестниц. Соседний `course-artwork-paper`
уже ограничен исходной прозрачностью через composite; других растровых alpha-generating
SVG-фильтров в `apps/web/src` не найдено.

Добавлены четыре pixel regression сценария (pending/error × JS/no-JS): screenshot
лестницы без исходных пикселей должен побайтно совпадать с тем же кадром при
отключённом фильтре. На старой production сборке все четыре проверки упали именно
на сравнении пикселей; на исправленной — прошли. MCP screenshot подтвердил
устранение пятна, в том числе при полностью недоступных изображениях. Network errors
в этой проверке ожидаемы: запросы картинок намеренно abort.

F9 Critical Gate: format, lint/architecture policies, typecheck, production-source LSP,
production build и 31 browser test — PASS. Normal-load MCP console: 0 errors,
0 warnings на момент проверки; загруженная лестница отображается корректно.
Unit suite не повторялась: изменение SVG paint покрыто реальным browser regression.
Cleanup dry run рассмотрен; `make clean` / `make clean-check` — PASS.

### Общие ограничения

- Проверялись Chromium production output и Windows Chrome через browser MCP;
  реальные мобильные устройства, Firefox, WebKit и production release здесь не проверялись.
  Нулевой CLS в этих сценариях не доказывает нулевой CLS для всех устройств и состояний.
- Optional сохраняет fallback на текущем документе, если web font опоздал.
  Холодный и тёплый визиты могут использовать разные шрифты; поздней замены внутри
  уже читаемого документа нет.
- Footer reservation соответствует текущим двум русским ссылкам и spacing;
  при изменении состава/типографики footer обновить размеры и streamed regression.
- Изолированная E2E TypeScript LSP диагностика воспроизводит известную ошибку
  разрешения `@playwright/test` также на неизменённом Page Object; см.
  KNOWN_GOTCHAS. Production-source LSP, repository typecheck, lint и реальный
  Playwright запуск служат отдельными проверками.
- Full Gate, полная E2E/Lighthouse серия, API regeneration и deployment не запускались:
  scope — affected-area Critical Gate и специально добавленная production layout suite.

## Local ship и правила дальнейшей разработки

Перед ship правила сведены в FRONTEND §4.2 Loading visual stability; STACK содержит
условия запуска production geometry/paint regression. T2 выполнен по явному запросу
архитектора. Финальный Critical Gate: format, web lint/architecture policies, typecheck,
production-source LSP, 49 focused unit tests — PASS. Дополнительные проверки Change 112:
production build и 31 browser test — PASS; ранее полученные MCP screenshots/console
подтверждают тот же код (после F9 изменялась только документация). Локальные ссылки
документов и `git diff --check` — PASS. Cleanup allowlist рассмотрен, clean/check — PASS.

API regeneration, backend/infra gates и Full/Release Gate — SKIPPED: соответствующий
код не менялся, запрошен обычный локальный ship. Push и deployment не выполняются.
Предсуществующие 14 staged файлов архитектора не входят в коммит Change 112.
