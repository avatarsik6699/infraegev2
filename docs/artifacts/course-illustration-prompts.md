# Промпты для иллюстраций мини-курсов (Change 185)

Картинки, нарисованные кодом (F15), архитектор отклонил 2026-10-15: «выглядят шаблонно и
безвкусно». Новые картинки генерирует архитектор по промптам ниже. Получились цветные сцены с
растушёвкой, поэтому они не обводятся в SVG, а сохраняются в WebP скриптом
[`course_scenes.py`](../../scripts/mascot/README.md); одна сцена курса служит и главной, и карточке
`/courses`, и шапке курса.

Задача каждой картинки: запомниться. Не схема предмета, а маленькая сцена с характером:
у каждого курса свой герой или предмет, который что-то делает. Стиль общий для всех, чтобы
четыре карточки читались одной серией.

## Требования к PNG

- Чисто белый фон: без фактуры бумаги, без серого, без теней и заливок.
- Только чёрная тушь и один оранжевый `#ff6a00` акцент на картинку.
- Без читаемого текста: код, числа и формулы — абстрактные штрихи и закорючки. Подписи, если
  они нужны, конвейер добавит сам.
- Ничего не обрезано краем кадра, вокруг сцены поля; главное — в средней части.
- Если генератор даёт несколько вариантов — присылайте 2–3 лучших, выберем вместе.

## Слоты

| Файл | Где | Пропорция, размер |
|---|---|---|
| `course-python-card` | `/courses`, шапка карточки Python | 12:5, 1800 × 750 |
| `course-excel-card` | `/courses`, шапка карточки Excel | 12:5, 1800 × 750 |
| `course-algorithms-card` | `/courses`, карточка «Алгоритмы и структуры данных» (курс готовится) | 12:5, 1800 × 750 |
| `course-advanced-card` | `/courses`, карточка «Решение задач повышенной сложности» (курс готовится) | 12:5, 1800 × 750 |

Карточка на телефоне становится уже (около 1.7:1), картинка вписывается целиком: держите
сцену компактной по горизонтали, без важных деталей у боковых краёв.

## Как собирать промпт

Промпт = блок стиля + сцена + концовка. Для серии карточек генерируйте их подряд в одной
сессии генератора, прикладывая первую удачную картинку как референс стиля к следующим.

### Блок стиля

```
Hand-drawn ink illustration made with a worn black brush marker on clean white paper. Lines are confident but alive: they swell and thin, have a slightly dry, grainy edge and overshoot a little where strokes meet. Outlines only — no fills, no grey, no shading, no hatching. Black ink plus exactly one small accent in flat orange #ff6a00. Playful, warm and a little witty, like a sketch from a good illustrated textbook, not clip art. Pure white background, generous empty space around the scene.
```

### Концовка

```
No readable text, letters or digits anywhere: code, numbers and formulas are drawn as abstract scribbles and short dashes. Nothing touches or is cut by the image edges. No background, no frame, no border, no shadows.
```

## Сцены

### course-python-card — 12:5

```
A long, friendly python snake wearing small round glasses has slithered halfway out of an open laptop screen and is reading a long paper printout that unrolls across the table like a scroll, its tail still curled around the laptop's keyboard. The printout is covered with short scribbled lines of code, indented in steps. The snake points with the tip of its tail at one line on the printout. Wide horizontal composition: laptop on the left, the snake's body flowing to the right along the scroll. The single orange accent is the one line the tail points at.
```

### course-excel-card — 12:5

```
A spreadsheet sheet drawn as a giant sheet of graph paper that unrolls from a laptop like a carpet across the table. A small hand grabs the tiny square handle at the corner of a selected cell and drags it down a column, leaving a trail of freshly filled cells behind. At the far end of the sheet, a bar chart rises out of the grid cells like little buildings, its tallest bar with a tiny ladder leaning on it. Wide horizontal composition. The single orange accent is the frame of the selected cell being dragged.
```

### course-algorithms-card — 12:5

```
A small tree grows out of a flowerpot made of stacked boxes (a stack of plates-like boxes). The tree's branches split strictly in two at every fork and end in round nodes like fruit, forming a neat binary tree. Beside it, a short queue of little square boxes on tiny legs walks in a line towards a gate, and a magnifying glass leans against the pot. Wide horizontal composition. The single orange accent is the one path of branches from the trunk up to one node.
```

### course-advanced-card — 12:5

```
A steep, slightly comic mountain built from a pile of oversized puzzle pieces and paper task cards. A tiny climber with a backpack and a rope is halfway up, holding on to the edge of one card; a dotted trail of footsteps winds from the foot of the mountain to the climber. On the summit stands a small flag. A light bulb hangs from a hook on the rope like a lantern. Wide horizontal composition, the mountain in the middle. The single orange accent is the flag on the summit.
```

## Где лежат

Исходные PNG — `docs/artifacts/references/for_new_design/{python_course,excel_course,algos_and_stucts_course,strong_exercisies_course}.png`.
`course_scenes.py` (команда — в его описании) пересобирает из них
`apps/web/public/images/courses/course-<курс>-{960,1600}.webp`: сцена обрезается по рисунку с
небольшим полем, Excel поворачивается на −6°. После новой генерации достаточно заменить PNG и
запустить скрипт.
