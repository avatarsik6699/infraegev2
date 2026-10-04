# Маскот: конвейер и демо (Change 170)

Утверждённые позы и правила: [references/mascot](../../references/mascot/README.md).

## Содержимое

- `demo.html` — демо-страница для согласования: лист персонажа и сцены в том виде, в каком их
  показывает сайт. Собирается `pipeline/demo.mjs`, руками не правится. Опубликована как артефакт
  <https://claude.ai/artifact/MYcF3uXTzpP9mBtpND7y16>.
- `pipeline/` — сборка поз, сцен и демо. Не часть сборки приложения:
  - `prepare.py`, `build.mjs` — позы из сгенерированного листа;
  - `pen.mjs` — общее перо (штрих с нажимом, капля туши);
  - `scenes.mjs` — сцены сайта: поза плюс предметы, CSS-анимация внутри файла;
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

## Сцены и демо

```bash
cd docs/artifacts/change-170/mascot/pipeline
node scenes.mjs ../../../references/mascot/poses ../../../../../apps/web/public/images/mascot
node demo.mjs ../../../references/mascot/poses ../../../../../apps/web/public/images/mascot ../demo.html
```

Новая сцена: функция в `SCENES` (`scenes.mjs`), её место на демо-странице
(`{{scene:<имя>}}` в шаблоне), согласование на демо, затем имя в `MascotSceneTypes.Scene` и
использование `MascotScene` на странице. Подписи («1 0 1», «{ }») переводятся в контуры шрифтом
Caveat, на сайте шрифт не нужен.

## Как пришли к результату

1. Программные наброски персонажа (вариант C — лицо на нижнем камне) — по ним утверждены
   персонаж, характер линии и композиции. Первая версия:
   <https://claude.ai/artifact/SajYCSvpugvEets3VsmR75>.
2. Генерация по промптам ([prompts.md](../../change-164/illustrations/prompts.md)) давала
   слишком ровные линии; итоговый лист сгенерирован архитектором вручную.
3. Отвергнуто: фактура туши фильтром поверх вектора, полная перерисовка пером по осевым линиям.
4. Принято: тело — трассировка листа, лицо — перо.
