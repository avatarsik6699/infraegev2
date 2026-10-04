# Промпты для иллюстраций (Changes 164, 170)

Сверено с заглушками `IllustrationPlaceholder` в коде 2026-10-04 (Change 170, F6). Размер в
каждом промпте — это пропорция реального слота, указан с запасом под 2× экраны. Объект держать
по центру с полями: слот может слегка обрезать края.

Маскот (решение архитектора 2026-10-04): живая стопка из трёх камней логотипа, лицо на большом
нижнем камне, только обводка, оранжевая обводка у верхнего камня, тонкие руки и ноги. Маскот
используется в hero, входе, 404, ошибке и пустом поиске (сцены для шапок каталогов
пробовали и убрали 2026-10-04: в шапке они спорили с заголовком); темы и курс Python
остаются предметными иллюстрациями. Программные наброски, лист персонажа и сцены:
[change-170/mascot](../../change-170/mascot/) (`mascot-lab-v3-sheet.html`).

> Маскот утверждён 2026-10-04: позы лежат в [references/mascot](../../references/mascot/README.md).
> Hero собран кодом из поз. Остальные сцены с маскотом кодом не получились (отклонены
> архитектором), поэтому они снова генерируются по промптам ниже, по одной, с листом
> [`mascote_list.png`](../../references/for_new_design/mascote_list.png) как
> референсом персонажа. PNG переводится в SVG конвейером
> [change-170/mascot](../../change-170/mascot/README.md). Порядок: вход и регистрация, затем
> остальные экраны, каждый после одобрения предыдущего.

### Требования к PNG для конвейера

- Чисто белый фон без фактуры бумаги, без серого, без теней.
- Только чёрная тушь и оранжевый `#ff6a00`; оранжевым — только верхний камень маскота.
- Маскот такой же, как на листе: те же камни, руки, ноги и лицо.
- Ничего не обрезано краем кадра, вокруг сцены поля.

## Как собирать промпт

Каждый промпт = блок стиля + описание маскота (если он в сцене) + сцена. Референсы не нужны.
Если генератор умеет держать персонажа по картинке, к сценам можно прикладывать свой лучший
сгенерированный лист персонажа. Для анимации hero маскот и предметы генерируются отдельными
слоями.

## Карта слотов

| Слот в интерфейсе | Размер слота (desktop) | Файл | Маскот |
|---|---|---|---|
| Главная, hero (заменяет плашку с заметками) | 30rem, 6:5 | `ill-hero` + слои | да |
| Главная, плашки 4 тем | ≥14rem × 8.5rem | `ill-topic-*` | нет |
| Главная, блок курса | 3:2 | `ill-course-python` | нет |
| `/ege`, шапка | — | без иллюстрации (убрано 2026-10-04) | — |
| `/ege`, строки опубликованных тем | 7rem × 4.5rem | `ill-topic-*` | нет |
| `/ege`, строки тем «Скоро» | 7rem × 4.5rem | остаётся заглушка | — |
| `/ege`, пусто «Темы не найдены» | ≤34rem, 4.2:1 | `ill-empty-search` | да |
| `/courses`, шапка | — | без иллюстрации (убрано 2026-10-04) | — |
| `/courses`, карточка Python | ≈30rem × 9.4rem | `ill-course-python-wide` | нет |
| `/courses`, карточки курсов «Скоро» | ≈30rem × 9.4rem | остаётся заглушка | — |
| `/courses/python`, шапка | 3:2 | `ill-course-python` | нет |
| `/practice`, шапка | — | без иллюстрации (убрано 2026-10-04) | — |
| `/practice`, пусто «Пока ничего не нашлось» | ≤34rem, 4.2:1 | `ill-empty-search` | да |
| Вход, справа от формы (и восстановление пароля) | 30rem, 6:5 | `ill-sign-in` | да |
| Регистрация, справа от формы (и подтверждение почты) | 30rem, 6:5 | `ill-register` | да |
| 404 (страница и задача) | ≤50rem, 3.2:1 | `ill-404` | да |
| Ошибка загрузки, 503 задачи | ≤50rem, 3.2:1 | `ill-error` | да |

## Блок стиля

Hand-drawn ink doodle made with a worn black brush marker on rough white paper. Every line is wobbly and uneven: it swells and thins, has a grainy dry-brush texture with slightly broken edges, and overshoots a little where strokes meet. Nothing is geometric or symmetrical. Outlines only, no fills, no shading. Black ink plus a single orange #ff6a00 accent. White background, lots of empty space, no text.

Avoid: vector, clean line art, smooth uniform lines, perfect ellipses, symmetry, digital look, 3D.

## Маскот

A cute minimal mascot: a stack of three lopsided, asymmetric pebbles with small gaps between them. The big bottom pebble is the body, with a tiny face: two dot eyes and a small curved smile. On it a smaller flat pebble, and on top a small flat pebble outlined in orange. Thin stick arms with small round hands, two short stick legs.

## mascot-sheet

Размер: 16:9, 2400×1350. Состав: стиль + маскот + сцена.

Сцена: Sketchbook page of studies of this mascot, evenly spaced, no labels: front, side and back views; standing, waving, pointing, jumping, meditating cross-legged; faces happy, thinking, confused, surprised, calm with closed eyes.

## ill-hero

Размер: 6:5, 1440×1200. Состав: стиль + маскот + сцена.

Сцена: The mascot floats cross-legged in meditation, eyes closed, calm smile, hands on its knees, two short float lines beneath. Around it float small doodles: a curly snake, a tiny spreadsheet grid with a check, the digits 1 0 1, curly braces, a speech bubble with a check, two answer boxes with 2 and 7, a mini flowchart, a three-node tree.

Слои для анимации (CSS-парение, выключается при `prefers-reduced-motion`; hero — кандидат LCP, слои — лёгкие WebP с размерами):

- Слой маскота, 1:1, 1200×1200, стиль + маскот + сцена: The mascot alone, floating cross-legged in meditation, eyes closed, calm smile, hands on its knees. Centred, nothing else.
- Слои предметов, 1:1, 600×600, по одному, стиль + сцена: One small doodle, centred, nothing else: [a curly snake | a tiny spreadsheet grid with a check | the digits 1 0 1 | curly braces | a speech bubble with a check | two answer boxes with 2 and 7 | a mini flowchart | a three-node tree].

## ill-sign-in

Размер: 6:5, 1440×1200. Состав: стиль + маскот + сцена + концовка. Приложить `mascote_list.png`
как референс персонажа. Только символы входа: дверь, ключ, замок, пароль. Без учебных предметов.

Сцена: The mascot stands at a big half-open door and turns a large key in its keyhole with
both hands; warm light lines spill out through the gap. On the door hangs an open padlock. Beside
the door floats a password field drawn as a rounded box with four dots and a small eye. A small
doormat lies under the mascot's feet. Rich but clear composition, every object about signing in.

## ill-register

Размер: 6:5, 1440×1200. Состав: стиль + маскот + сцена + концовка. Приложить `mascote_list.png`
как референс персонажа. Один крупный предмет рядом с маскотом, по масштабу как дверь на входе.
Фон (кружки, крестики, маленькие галочки) дорисовывается кодом: в картинке их нет.

Итог (2026-10-04): первая версия (карточка участника, конфетти, зелёная галочка) и три варианта
ниже отклонены; архитектор нарисовал свою сцену — маскот карандашом заполняет анкету со своим
портретом на планшете ([`ill-register.png`](../../references/for_new_design/ill-register.png)).
Фоновые узоры не добавляются ни на вход, ни на регистрацию.

## Концовка для ill-sign-in и ill-register

Keep the mascot exactly as in the attached character sheet, including its uneven hand-drawn face
lines. Plain pure white background, no paper texture, no grey, no shadows. Black ink only; orange
only on the mascot's top pebble. Nothing touches the edges of the image. No words or letters.

## ill-404

Размер: 16:5, 1200×375. Состав: стиль + маскот + сцена.

Сцена: Wide, low composition. The mascot stands next to a signpost with two blank arrows pointing opposite ways, holding a map upside down, a question mark above it.

## ill-error

Размер: 16:5, 1200×375. Состав: стиль + маскот + сцена.

Сцена: Wide, low composition. The orange top pebble has just fallen off the mascot and lies at its feet with small impact lines; the mascot looks at it, surprised.

## ill-empty-search

Размер: 4:1, 1400×350. Состав: стиль + маскот + сцена.

Сцена: Wide, low composition. The mascot points at an empty cardboard box lying on its side, a few dust specks drifting out.

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
