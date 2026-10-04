# Маскот: конвейер и демо (Change 170)

Утверждённые позы и правила: [references/mascot](../../references/mascot/README.md).

## Содержимое

- `demo.html` — демо-страница для согласования: лист персонажа и сцены в том виде, в каком их
  показывает сайт. Собирается `pipeline/demo.mjs`, руками не правится. Опубликована как артефакт
  <https://claude.ai/artifact/MYcF3uXTzpP9mBtpND7y16>.
- `pipeline/` — сборка поз, сцен и демо. Не часть сборки приложения:
  - `prepare.py`, `build.mjs` — позы из сгенерированного листа;
  - `pen.mjs` — общее перо (штрих с нажимом, капля туши);
  - `doodles.mjs` — общие рисованные предметы, анимация и запись сцены;
  - `scenes.mjs` — сцены, собранные кодом из поз (hero);
  - `trace_prep.py`, `trace.mjs` — сцены из PNG архитектора (вход, регистрация, 404, ошибка,
    пустой поиск): трассировка, лицо пером, мелкие отдельные детали мерцают,
    вокруг рассыпаны звёздочки и кружки;
  - `demo.mjs`, `demo.template.html` — демо-страница.

## Пересборка поз

```bash
cd docs/artifacts/change-170/mascot/pipeline
python3 prepare.py ../../../references/for_new_design/mascote_list.png /tmp/mascot-work
npm install --no-package-lock
node build.mjs /tmp/mascot-work ../../../references/mascot/poses
```

1. `prepare.py` (Pillow) режет лист на 13 поз, отделяет чёрные линии от оранжевых, находит лицо
   (линии внутри нижнего камня, не касающиеся его контура), убирает его из маски тела и
   извлекает осевые линии лица.
2. `build.mjs` (potrace, svgo) трассирует тело и оранжевый камень, прорисовывает лицо пером с
   фиксированным seed и пишет оптимизированные SVG.

Результат детерминирован: повторный запуск даёт те же файлы.

## Сцены из PNG

```bash
cd docs/artifacts/change-170/mascot/pipeline
R=../../../references/for_new_design
python3 trace_prep.py $R/ill-sign-in.png /tmp/mascot-scenes/sign-in face=590,600,740,700
python3 trace_prep.py $R/ill-register.png /tmp/mascot-scenes/register face=575,600,720,700
python3 trace_prep.py $R/404-1200x375.png /tmp/mascot-scenes/not-found crop=0,0,1200,375 face=450,202,516,253 move=none
python3 trace_prep.py $R/server-error-1200x375.png /tmp/mascot-scenes/error crop=0,0,1200,375 face=267,218,337,256 move=430,20,920,200
python3 trace_prep.py $R/empty-search-1400x350.png /tmp/mascot-scenes/empty-search crop=80,20,1340,320 face=636,174,692,214 move=1040,250,1100,290
node trace.mjs /tmp/mascot-scenes ../../../../../apps/web/public/images/mascot [сцена...]
```

`face` — рамка лица в пикселях PNG: глаза и рот перерисовываются пером, как в утверждённых
позах. `crop` — кадр в пикселях PNG (без него — рисунок плюс поля); для баннеров кадр задан, чтобы
сохранить пропорции слота. Мелкие отдельно стоящие детали (лучи у двери, штрихи у карандаша,
молнии над сервером) мерцают; деталь, внутри которой что-то есть (чекбокс с галочкой), остаётся
частью рисунка. `move` ограничивает мерцание рамками (`x0,y0,x1,y1/…`) или выключает его
(`none`): пунктир следов должен стоять. Сцены для шапок каталогов (`/ege`, `/courses`,
`/practice`) пробовали и убрали: в шапке они спорили с заголовком. Вокруг рисунка пером дорисованы
только мелкие абстрактные метки (`floaters` в `trace.mjs`): звёздочки и кружки, разнесённые по всей
площади кадра, а не вокруг маскота. Предметы по смыслу (конверт, щит, значок) пробовали и
отказались: рядом с основным рисунком они неуместны.

## Сцены и демо

```bash
cd docs/artifacts/change-170/mascot/pipeline
node scenes.mjs ../../../references/mascot/poses ../../../../../apps/web/public/images/mascot
node demo.mjs ../../../references/mascot/poses ../../../../../apps/web/public/images/mascot ../demo.html
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
2. Генерация по промптам ([prompts.md](../../change-164/illustrations/prompts.md)) давала
   слишком ровные линии; итоговый лист сгенерирован архитектором вручную.
3. Отвергнуто: фактура туши фильтром поверх вектора, полная перерисовка пером по осевым линиям.
4. Принято: тело — трассировка листа, лицо — перо.
