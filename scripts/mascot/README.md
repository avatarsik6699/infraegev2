# Маскот: конвейер (Change 170)

Утверждённые позы и правила: [references/mascot](../../docs/artifacts/references/mascot/README.md).

## Содержимое

Сборка поз, сцен и демо-страницы для согласования (`demo.mjs` пишет её во временный файл;
опубликованная версия — артефакт <https://claude.ai/artifact/MYcF3uXTzpP9mBtpND7y16>). Не часть
сборки приложения:

  - `prepare.py`, `build.mjs` — позы из сгенерированного листа;
  - `pen.mjs` — общее перо (штрих с нажимом, капля туши);
  - `doodles.mjs` — общие рисованные предметы, анимация и запись сцены;
  - `scenes.mjs` — сцены, собранные кодом из поз (hero);
  - `trace_prep.py`, `trace.mjs` — сцены из PNG архитектора (вход, регистрация, 404, ошибка,
    пустой поиск): трассировка, лицо пером, мелкие отдельные детали мерцают,
    вокруг рассыпаны звёздочки и кружки;
  - `topics.mjs` — предметные иллюстрации 25 тем ЕГЭ, нарисованные кодом общим пером
    (`node topics.mjs ../../apps/web/public/images/topics`);
  - `topic_heads.mjs` — фоны шапок тем ЕГЭ (Change 197): рисунок темы из `topics.mjs` в углу и
    россыпь знаков темы тем же пером, широкий `head-N.svg` и полоса для телефона
    `head-N-narrow.svg` (`node topic_heads.mjs ../../apps/web/public/images/topics`);
  - `course_scenes.py` — картинки курсов для главной, карточек `/courses` и шапок курсов (Change 185):
    цветные сцены архитектора не обводятся, а сохраняются в WebP двух ширин; Excel повёрнут на 6°,
    чтобы сцена легла горизонтально целиком;
  - `demo.mjs`, `demo.template.html` — демо-страница.

## Пересборка поз

```bash
cd scripts/mascot
python3 prepare.py ../../docs/artifacts/references/for_new_design/mascote_list.png /tmp/mascot-work
npm install --no-package-lock
node build.mjs /tmp/mascot-work ../../docs/artifacts/references/mascot/poses
```

1. `prepare.py` (Pillow) режет лист на 13 поз, отделяет чёрные линии от оранжевых, находит лицо
   (линии внутри нижнего камня, не касающиеся его контура), убирает его из маски тела и
   извлекает осевые линии лица.
2. `build.mjs` (potrace, svgo) трассирует тело и оранжевый камень, прорисовывает лицо пером с
   фиксированным seed и пишет оптимизированные SVG.

Результат детерминирован: повторный запуск даёт те же файлы.

## Сцены из PNG

```bash
cd scripts/mascot
R=../../docs/artifacts/references/for_new_design
python3 trace_prep.py $R/ill-sign-in.png /tmp/mascot-scenes/sign-in face=590,600,740,700
python3 trace_prep.py $R/ill-register.png /tmp/mascot-scenes/register face=575,600,720,700
python3 trace_prep.py $R/404-1200x375.png /tmp/mascot-scenes/not-found crop=0,0,1200,375 face=450,202,516,253 move=none
python3 trace_prep.py $R/server-error-1200x375.png /tmp/mascot-scenes/error crop=0,0,1200,375 face=267,218,337,256 move=430,20,920,200
python3 trace_prep.py $R/empty-search-1400x350.png /tmp/mascot-scenes/empty-search crop=80,20,1340,320 face=636,174,692,214 move=1040,250,1100,290
R=../../docs/artifacts/references/billing_refs   # Change 192, цветные рисунки
python3 trace_prep.py $R/paywall.png /tmp/mascot-scenes/paywall move=none
python3 trace_prep.py $R/paywall-guest.png /tmp/mascot-scenes/paywall-guest move=120,450,200,560/960,800,1040,870
python3 trace_prep.py $R/pricing.png /tmp/mascot-scenes/pricing move=95,755,160,845
node trace.mjs /tmp/mascot-scenes ../../apps/web/public/images/mascot [сцена...]
```

Цветные линии кроме оранжевого (жёлтые, зелёные, синие, серые; Change 192) уходят в свои
маски `tint-*.png` и трассируются в среднем цвете с долей туши; серая линия отделяется от мягкого
края чёрной по отсутствию чёрной сердцевины рядом. В сценах оплаты лица не перерисовываются
(`face` не задан), а `rough` и `calm` в `trace.mjs` дают неровный край туши и только мерцание меток.
Сцена «доступ открыт» (`access-open`) собирается кодом: `node scenes.mjs <позы> <выход> access-open`.

`face` — рамка лица в пикселях PNG: глаза и рот перерисовываются пером, как в утверждённых
позах. `crop` — кадр в пикселях PNG (без него — рисунок плюс поля); для баннеров кадр задан, чтобы
сохранить пропорции слота. Мелкие отдельно стоящие детали (лучи у двери, штрихи у карандаша,
молнии над сервером) мерцают; деталь, внутри которой что-то есть (чекбокс с галочкой), остаётся
частью рисунка. `move` ограничивает мерцание рамками (`x0,y0,x1,y1/…`) или выключает его
(`none`): пунктир следов должен стоять. Сцены для шапок каталогов (`/ege`, `/courses`,
`/practice`) пробовали и убрали: в шапке они спорили с заголовком. Вокруг рисунка пером
дорисованы только мелкие абстрактные метки (`floaters` в `trace.mjs`): звёздочки и кружки,
разнесённые по всей площади кадра, а не вокруг маскота. Предметы по смыслу (конверт, щит, значок) пробовали и
отказались: рядом с основным рисунком они неуместны.

## Сцены и демо

```bash
cd scripts/mascot
node scenes.mjs ../../docs/artifacts/references/mascot/poses ../../apps/web/public/images/mascot
node demo.mjs ../../docs/artifacts/references/mascot/poses ../../apps/web/public/images/mascot /tmp/mascot-demo.html
```

Новая сцена из PNG: строка `trace_prep.py` выше и запись в `SCENES` (`trace.mjs`, метки и их seed).
Новая сцена из поз: функция в `SCENES` (`scenes.mjs`). Затем её место на демо-странице
(`{{scene:<имя>}}` в шаблоне), согласование на демо, затем имя в `MascotSceneTypes.Scene`,
размер кадра в `sceneSizes` (`mascot-scene.tsx`) и использование `MascotScene` на странице.
Подписи («1 0 1», «{ }») переводятся в контуры шрифтом Caveat, на сайте шрифт не нужен.

## Как пришли к результату

1. Программные наброски персонажа (вариант C — лицо на нижнем камне) — по ним утверждены
   персонаж, характер линии и композиции. Первая версия:
   <https://claude.ai/artifact/SajYCSvpugvEets3VsmR75>.
2. Генерация по промптам ([prompts.md](../../docs/artifacts/mockups-v5/illustration-prompts.md)) давала
   слишком ровные линии; итоговый лист сгенерирован архитектором вручную.
3. Отвергнуто: фактура туши фильтром поверх вектора, полная перерисовка пером по осевым линиям.
4. Принято: тело — трассировка листа, лицо — перо.
