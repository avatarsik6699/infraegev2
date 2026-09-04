# Требования к бренд-ассетам

## Активный профиль ALCHIMIA

Change 75 утвердил ALCHIMIA на `/lab/design-system`; Change 76 активировал тот же профиль в
public header, metadata, manifest, favicon, Apple/manifest icons и social preview. Технический
домен `infraege.ru`, storage keys, analytics ids и инфраструктурные имена при этом не меняются.

`docs/artifacts/references/logo.svg` — единственный художественный источник ALCHIMIA. Прежний
`logo_with_transperant_bg.svg` и исторический `docs/artifacts/final_logo.svg` не являются
production-источниками.
Нормализация может убрать фиксированные размеры, исправить `preserveAspectRatio` или добавить
delivery whitespace, но не может перерисовывать, сглаживать, перекрашивать, обрезать или
переинтерпретировать видимую геометрию. Для явно тёмного контекста допустима только монохромная
инверсия знака в белый без изменения его формы.

Надпись `ALCHIMIA` и подзаголовок «ЕГЭ информатика» не встраиваются в SVG: они остаются живым
доступным текстом в Alegreya и Golos Text соответственно (Change 86 заменил исходную пару
Cormorant SC/IBM Plex Mono — IBM Plex Mono сузился до кода, данных и формул и больше не покрывает
service-UI-подпись).

## Производные файлы

- `apps/web/public/brand/alchimia-mark.svg` сохраняет все авторские paths и gradients, удаляет
  фиксированные размеры и нормализует `preserveAspectRatio`.
- `apps/web/public/favicon.svg` использует те же paths и gradients; квадратный `viewBox` добавляет
  только прозрачное поле и сохраняет весь исходный знак. Встроенный `prefers-color-scheme`
  переключает рисунок на белый в тёмном browser chrome.
- PNG/ICO, Apple touch, manifest icons и social preview воспроизводимо генерируются командой
  `pnpm brand:generate`; manifest хранится декларативно рядом и проверяется тем же test contract.

## Favicon и иконки

| Файл | Размер | Требование |
|------|--------|------------|
| `favicon.svg` | квадратный `viewBox` | Упрощённый знак, прозрачный фон |
| `favicon-16x16.png` | 16×16 | Чёрный знак на белом fallback-фоне |
| `favicon-32x32.png` | 32×32 | Чёрный знак на белом fallback-фоне |
| `favicon.ico` | 16×16 и 32×32 внутри | PNG frames с alpha |
| `apple-touch-icon.png` | 180×180 | Непрозрачный белый фон, без встроенного скругления |
| `alchimia-icon-192.png` | 192×192 | Непрозрачный белый фон, manifest purpose `any` |
| `alchimia-icon-512.png` | 512×512 | Непрозрачный белый фон, manifest purpose `any` |

Apple/manifest-иконки оставляют 12.5% свободного поля с каждой стороны. Maskable-вариант,
service worker, offline-режим и установка как PWA не входят в текущий контракт.

## Social preview

`apps/web/public/brand/alchimia-social.png` имеет размер 1200×630 px и белый фон. Единственный
элемент — утверждённый знак ALCHIMIA, расположенный по центру обеих осей. Wordmark, подпись,
разделители и дополнительные декоративные элементы отсутствуют.

## Приёмка

- Master/production SVG не содержит `<text>`, JavaScript, внешние URL, embedded raster, фильтры
  или непрозрачный canvas; favicon содержит только локальное media-rule для белой dark-схемы;
  контуры не выходят за `viewBox`.
- Крупный production mark визуально совпадает с master-файлом; малые favicon не получают
  отдельной перерисовки.
- Проверяются сигнатуры и размеры raster/ICO, manifest declarations, favicon в браузере,
  OG/Twitter metadata, desktop/mobile/150%-zoom header, SSR/no-JS, контраст wordmark и чистая
  консоль.
- SEO URL и metadata contract остаются стабильными; меняется только содержимое производных файлов.
