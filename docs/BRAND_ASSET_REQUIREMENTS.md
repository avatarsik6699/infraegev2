# Требования к бренд-ассетам

## Активный профиль infraege

Публичная айдентика — `infraege`. Технический домен `infraege.ru`, storage keys, analytics ids
и infrastructure names при смене визуального профиля не меняются. Исторический ALCHIMIA lab не
является источником public delivery.

`docs/artifacts/references/infraege-mark.svg` — единственный художественный master знака.
`docs/artifacts/references/base.jpg` и `docs/artifacts/references/main-page.png` задают направление
его применения. Master содержит ровно три органических камня и ничего больше:

- верхний малый камень — `#FF6A00`;
- средний и нижний камни — `#1A1A1A`;
- text, baseline, canvas, filters, masks, embedded raster и внешние URL отсутствуют.

Надпись `infraege` и подзаголовок «подготовка к ЕГЭ по информатике» не встраиваются в mark SVG:
в интерфейсе они остаются живым доступным текстом в Alegreya и Golos Text. Типографические роли
Change 86 не меняются; JetBrains Mono остаётся шрифтом кода, данных и формул.

## Производные файлы

- `apps/web/public/brand/infraege-mark.svg` и widget asset сохраняют paths, classes, colors и
  `viewBox` master-файла.
- `apps/web/public/favicon.svg` использует ту же геометрию; квадратный `viewBox` добавляет только
  delivery whitespace. В dark browser chrome две ink-фигуры становятся белыми, orange-фигура
  сохраняет цвет.
- PNG/ICO, Apple touch, manifest icons и social preview воспроизводимо генерируются командой
  `pnpm brand:generate`; генератор также удаляет только известные прежние ALCHIMIA derivatives.
- Warm opaque background raster-иконок и social preview — `#F5F3EF`.

## Favicon и иконки

| Файл | Размер | Требование |
|------|--------|------------|
| `favicon.svg` | квадратный `viewBox` | Три камня на прозрачном фоне |
| `favicon-16x16.png` | 16×16 RGBA | Тот же знак, без отдельной перерисовки |
| `favicon-32x32.png` | 32×32 RGBA | Тот же знак, без отдельной перерисовки |
| `favicon.ico` | 16×16 и 32×32 внутри | PNG frames с alpha |
| `apple-touch-icon.png` | 180×180 RGB | Непрозрачный warm-paper фон, без встроенного скругления |
| `infraege-icon-192.png` | 192×192 RGB | Непрозрачный warm-paper фон, manifest purpose `any` |
| `infraege-icon-512.png` | 512×512 RGB | Непрозрачный warm-paper фон, manifest purpose `any` |

Apple/manifest icons оставляют устойчивое свободное поле вокруг знака. Maskable-вариант, service
worker, offline-режим и установка как PWA не входят в текущий контракт.

## Social preview

`apps/web/public/brand/infraege-social.png` имеет размер 1200×630 px и warm-paper фон. Он включает
трёхкаменный знак, wordmark `infraege` и короткую подпись о подготовке к ЕГЭ. Это delivery raster,
поэтому доступное имя задаётся route metadata, а не текстом внутри изображения.

## Приёмка

- Master/production SVG проходит structural test: три paths, один orange и два ink, без text,
  script, external URL, embedded raster, filter или непрозрачного canvas.
- Крупный production mark визуально совпадает с master; размеры 512/48/32/16 проверяются без
  отдельной художественной версии.
- Проверяются сигнатуры, pixel format и размеры raster/ICO, manifest declarations, favicon,
  OG/Twitter metadata, desktop/mobile/150%-zoom header, SSR/no-JavaScript, contrast и clean console.
- Все brand derivatives воспроизводимы: повторный `pnpm brand:generate` не меняет tracked output.
