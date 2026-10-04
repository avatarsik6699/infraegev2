# Промпты для иллюстраций (Changes 164, 170)

Сверено с заглушками `IllustrationPlaceholder` в коде 2026-10-04 (Change 170, F6). Размер в
каждом промпте — это пропорция реального слота, указан с запасом под 2× экраны. Объект держать
по центру с полями: слот может слегка обрезать края.

## Карта слотов

| Слот в интерфейсе | Размер слота (desktop) | Файл |
|---|---|---|
| Главная, hero (заменяет плашку с заметками) | 30rem, 6:5 | `ill-hero` |
| Главная, плашки 4 тем | ≥14rem × 8.5rem | `ill-topic-*` |
| Главная, блок курса | 3:2 | `ill-course-python` |
| `/ege`, шапка | 14.4rem × 6rem | `ill-head-ege` |
| `/ege`, строки опубликованных тем | 7rem × 4.5rem | `ill-topic-*` |
| `/ege`, строки тем «Скоро» | 7rem × 4.5rem | остаётся заглушка, картинки нет |
| `/ege`, пусто «Темы не найдены» | ≤26rem × 5.5rem | `ill-empty-search` |
| `/courses`, шапка | 14.4rem × 6rem | `ill-head-courses` |
| `/courses`, карточка Python | ≈30rem × 9.4rem | `ill-course-python-wide` |
| `/courses`, карточки курсов «Скоро» | ≈30rem × 9.4rem | остаётся заглушка, картинки нет |
| `/courses/python`, шапка | 3:2 | `ill-course-python` |
| `/practice`, шапка | 14.4rem × 6rem | `ill-head-practice` |
| `/practice`, пусто «Пока ничего не нашлось» | ≤26rem × 5.5rem | `ill-empty-search` |
| Вход и регистрация, полоса | ≤62rem × 6.25rem | `ill-auth` |
| 404 (страница и задача) | ≤24rem × 7.5rem | `ill-404` |
| Ошибка загрузки, 503 задачи | ≤24rem × 7.5rem | `ill-error` |

## Общий стиль (вставлять в каждый промпт)

Hand-drawn black ink line illustration on a transparent background (the site places it on a soft pastel colour plate). Slightly wobbly, imperfect marker/pen lines, uniform line weight about 3px, no gradients, no shading, no textures, no drop shadows. Mostly monochrome black line art; use ONE accent colour only, orange #f26a0a, in at most one or two small elements. Friendly, calm, minimal, educational mood. Characters are simple Eduix-style doodles: round heads, dot eyes, tiny smile, simple clothes, teenage student, gender-neutral. No text, no letters, no logos inside the image (labels are added in HTML). Flat 2D, lots of empty space around the subject, clean edges, PNG with transparent background.

Avoid: colourful cartoon style, 3D, gradients, glossy icons, photo realism, neon, dark background, clutter, mascot costumes, text and watermarks.

Для широких слотов (2.4:1 и шире) добавлять: Wide horizontal composition, subject spread along the horizontal axis, keep the vertical extent compact.

## ill-hero

Где: Главная, крупный блок справа, вместо плашки с заметками. Размер: 6:5 (1440×1200).

Промпт: A teenage student sits cross-legged on the floor with a laptop, thoughtfully holding a pencil to the chin. Around the student float six hand-drawn rounded speech bubbles and chips with simple abstract symbols (a tiny flowchart, an arrow loop, a check mark, curly braces, a binary 1 0 1, a small tree diagram). A few doodle sparkles and a dotted arrow. One small accent element in orange (the check mark bubble).

## ill-topic-16

Где: Тема 16: Рекурсивные алгоритмы (главная и строка `/ege`). Размер: 3:2 (900×600).

Промпт: Nested hand-drawn frames, each smaller one inside the previous, like a mirror in a mirror, with a small arrow going inward and a tiny flag at the innermost frame. One orange flag.

## ill-topic-5

Где: Тема 5: Преобразование записей чисел. Размер: 3:2 (900×600).

Промпт: A row of simple square cells filled with abstract dots (binary-like), an arrow bending to a second row of cells where one cell is added at the end. One orange cell.

## ill-topic-17

Где: Тема 17: Числовые последовательности. Размер: 3:2 (900×600).

Промпт: A long train of numbered boxes connected by short arrows, a magnifying glass over a pair of neighbouring boxes. One orange pair.

## ill-topic-24

Где: Тема 24: Обработка символьных строк. Размер: 3:2 (900×600).

Промпт: Letter-like beads (simple abstract shapes, not real letters) threaded on a string, a pair of scissors cutting a segment, a bracket marking a slice. One orange bead.

## ill-topic-25

Где: Тема 25: Обработка целых чисел. Размер: 3:2 (900×600).

Промпт: A big abstract number made of blocks being taken apart digit by digit by a small hand, a sieve or funnel with small cubes falling. One orange cube.

## ill-topic-26

Где: Тема 26: Обработка данных: сортировка и отбор. Размер: 3:2 (900×600).

Промпт: A messy row of vertical bars of different heights turning into an ordered staircase, with a hand picking one bar. One orange bar.

## ill-topic-27

Где: Тема 27: Анализ данных: кластеризация. Размер: 3:2 (900×600).

Промпт: A scatter of dots forming two or three loose clusters, each circled by a wobbly loop. One cluster loop in orange.

## ill-course-python

Где: Курс Python — блок курса на главной и шапка `/courses/python`. Размер: 3:2 (900×600).

Промпт: A laptop with a screen showing an abstract code block (just lines and indents, no readable text), a small snake doodle curled on the keyboard, a mug. One orange line of code.

## ill-course-python-wide

Где: Карточка курса Python на `/courses`. Размер: 16:5 (1600×500).

Промпт: Wide horizontal composition, subject spread along the horizontal axis. On the left a laptop with an abstract code block on the screen (just lines and indents, no readable text); a long friendly snake doodle stretches from the keyboard to the right, passing a mug and a small stack of two books. One orange line of code.

## ill-head-ege

Где: Шапка каталога `/ege`. Размер: 12:5 (1200×500).

Промпт: Wide horizontal composition, subject spread along the horizontal axis. A dotted path winds from left to right through a row of five small round stepping stones; a doodle student walks on the second stone holding a pencil, and a tiny flag stands on the last stone. One orange flag.

## ill-head-courses

Где: Шапка каталога `/courses`. Размер: 12:5 (1200×500).

Промпт: Wide horizontal composition, subject spread along the horizontal axis. A short shelf with four simple notebooks of different heights standing upright, one notebook pulled slightly forward and open, a small potted plant at the end of the shelf. One orange bookmark ribbon in the open notebook.

## ill-head-practice

Где: Шапка каталога задач `/practice`. Размер: 12:5 (1200×500).

Промпт: Wide horizontal composition, subject spread along the horizontal axis. A row of three small task cards laid on a table, the first with a check mark, the second with a pencil resting across it, the third blank; a stopwatch doodle at the right edge. One orange check mark.

## ill-auth

Где: Страница входа и регистрации, узкая полоса над формой. Размер: 10:1 (2000×200).

Промпт: Very wide, very low horizontal frieze composition with the subject centred and empty space to both sides. A key and a small padlock lying on a stack of three smooth stones (orange stone on top, two black stones below), with a few sparkles on both sides. Minimal and calm.

## ill-404

Где: Страница 404 и «Задача не найдена». Размер: 16:5 (1200×375).

Промпт: Wide horizontal composition, subject spread along the horizontal axis. A confused doodle student holding a folded map upside down, a dotted path that runs sideways and ends nowhere, a question mark made of a line and a dot. One orange dot of the question mark.

## ill-error

Где: Ошибка загрузки страницы и 503 у задачи. Размер: 16:5 (1200×375).

Промпт: Wide horizontal composition, subject spread along the horizontal axis. A cable unplugged from a socket with a tiny spark, a plant pot beside it, a patient calm mood. One orange spark.

## ill-empty-search

Где: Пустой результат на `/practice` и «Темы не найдены» на `/ege`. Размер: 4:1 (1400×350).

Промпт: Wide horizontal composition, subject spread along the horizontal axis. An empty open box with a magnifying glass floating beside it, a few dust sparkles drifting to both sides. One orange magnifier rim.
