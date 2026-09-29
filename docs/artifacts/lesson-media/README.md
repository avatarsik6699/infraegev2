# Ролики и иллюстрации для теории уроков

Кадры рисуются программой, а не вручную: одна и та же сцена с тем же seed даёт те же кадры. Числа на сценах считаются кодом и сверяются с текстом урока (`assert` в сцене).

## Запуск

```bash
uv run --no-project --with pillow python docs/artifacts/lesson-media/build.py             # все сцены
uv run --no-project --with pillow python docs/artifacts/lesson-media/build.py --only rekursiya-call-tree
uv run --no-project --with pillow python docs/artifacts/lesson-media/build.py --list      # что найдено
```

Нужен `ffmpeg` с `libvpx-vp9` и `libx264` (для видео). Pillow берётся через `--with pillow` и в lock-файлы репозитория не входит. Результат для уроков — `apps/web/public/lesson-media/<урок>/`: `NAME.webm`, `NAME.mp4`, `NAME-poster.webp`; эталонные сцены — `reference/`. После пересборки проверить `pnpm validate:content`.

Тесты движка (Pillow, ffmpeg не нужен):

```bash
uv run --no-project --with pillow python -m unittest discover -s scripts/tests -p lesson_media_engine_test.py
```

## Файлы

| Файл | Назначение |
| --- | --- |
| `handdrawn.py` | Ядро: примитивы, штрихи, рукописный текст, таймлайн сцены, проверки |
| `rekursiya_chain.py` | Общие детали роликов про цепочку значений (ряд кругов, дуги вопросов и ответов) |
| `rekursiya_base_step.py`, `rekursiya_no_base.py`, `rekursiya_call_tree.py` | Сцены урока «Рекурсия» |
| `build.py` | Поиск сцен, кадры → WebM, MP4, постер WebP (или статичный WebP), `manifest.json` |
| `specimen.py`, `reference/specimen.png` | Лист образцов всех примитивов |
| `ENGINE.md` | Устройство движка и как расширять под сложные схемы |
| `fonts/Neucha.ttf`, `fonts/OFL.txt` | Шрифт подписей (SIL Open Font License 1.1) |
| `STYLE.md` | Правила манеры рисования |

## Новая сцена

Создать модуль с `NAME` и `build()`, возвращающей `(Scene, meta)`, добавить его в `SCENES` в `build.py`, прочитать постер глазами (`Scene.render(scene.poster_time)`), затем подключить ролик компонентом `LessonVideo` с текстовым описанием. Правила ролика — [SPEC §2.3](../../SPEC.md); устройство и расширение — [ENGINE.md](ENGINE.md); манера — [STYLE.md](STYLE.md).
