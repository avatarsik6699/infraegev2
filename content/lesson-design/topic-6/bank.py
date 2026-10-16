"""Topic 6 bank tasks for the site lesson (Change 190, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-6/bank.py          # check only
    python3 -I content/lesson-design/topic-6/bank.py --write  # update the bank
    python3 -I content/lesson-design/topic-6/bank.py --checkpoints  # and site.checkpoints

The rules are those of ``scripts/lesson_design/topic_bank.py``. A turtle program
draws and prints nothing, so a task on a drawing gives its ``answer`` from the
stand's own executor (``turtle_figures``: the trace without Tk and the class of
every integer point — inside, on a line, outside); the algorithm and the start
direction are read from the task's statement. The tasks of subtopic 7, where the
learner writes the counting program, give that ``code``.
``apps/api/tests/test_task_6_bank.py`` recomputes every answer independently.
"""

import math
import re
import sys
from itertools import product
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
# figures registers the builders first: turtle_figures imports it back
import figures as _builders  # noqa: E402, F401
from topic_bank import NUMBER, THREE, TWO, inventory, main  # noqa: E402
from turtle_figures import classify, inside, on_segment, polygons, run  # noqa: E402

TEXTS = inventory(HERE)
XY = "Введите координаты x и y через пробел."
HEADINGS = {"вверх": 90, "вправо": 0, "влево": 180, "вниз": 270}


def question(page: int, number: int) -> str:
    return TEXTS[page][number][0]


def program(text: str) -> tuple[str, float]:
    """The algorithm of a statement and the start direction of the head."""
    fence = re.search(r"```algo\n(.*?)```", text, re.S)
    quoted = re.search(r"(?:алгоритм|выполнила|Выполни:?) «([^»]+)»", text)
    cmds = fence.group(1) if fence else quoted.group(1) if quoted else None
    assert cmds, text[:80]
    turn = re.search(r"(?:направление|направлена|голова) (вверх|вправо|влево|вниз)", text)
    return cmds.replace(",", " "), HEADINGS[turn.group(1)] if turn else 90


def points(page: int, number: int, kinds=("in",)) -> int:
    cmds, heading = program(question(page, number))
    cls, _ = classify(cmds, heading)
    return sum(1 for c in cls.values() if c in kinds)


def end(page: int, number: int) -> tuple[str, float]:
    """The end point «x y» and the heading after the algorithm."""
    cmds, heading = program(question(page, number))
    x, y, h, *_ = run(cmds, heading)[-1]
    return f"{round(x):g} {round(y):g}", h


def area(page: int, number: int) -> float:
    cmds, heading = program(question(page, number))
    (poly,) = polygons(cmds, heading)
    s = sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(poly, poly[1:] + poly[:1], strict=True))
    return abs(s) / 2


def rect_points(r, strict=False):
    x0, x1, y0, y1 = r
    d = 1 if strict else 0
    return {(x, y) for x in range(x0 + d, x1 - d + 1) for y in range(y0 + d, y1 - d + 1)}


def figures(page: int, number: int) -> list[set]:
    """Points inside or on the line of every closed figure of the statement."""
    cmds, heading = program(question(page, number))
    cls, _ = classify(cmds, heading)
    out = []
    for poly in polygons(cmds, heading):
        sides = list(zip(poly, poly[1:] + poly[:1], strict=True))
        out.append(
            {p for p in cls if inside(p, poly) or any(on_segment(p, a, b) for a, b in sides)}
        )
    return out


def visits(cmds: str, first: bool) -> tuple[int, int]:
    """Points visited at least twice, stepping by one; and distinct points of the trace."""
    seen: dict[tuple, int] = {}
    x = y = 0
    h = 90
    if first:
        seen[(0, 0)] = 1
    for c in re.findall(r"Вперёд (\d+)|Направо (\d+)", cmds):
        if c[0]:
            for _ in range(int(c[0])):
                x += round(math.cos(math.radians(h)))
                y += round(math.sin(math.radians(h)))
                seen[(x, y)] = seen.get((x, y), 0) + 1
        else:
            h -= int(c[1])
    trace = set(seen) | {(0, 0)}
    return sum(v >= 2 for v in seen.values()), len(trace)


def smallest(fn, test) -> int:
    a = 1
    while not test(fn(a)):
        a += 1
    return a


def task(at, section, title, difficulty, minutes, instruction, hint, answer=None, **extra):
    spec = dict(at=at, title=title, difficulty=difficulty, minutes=minutes)
    spec.update(instruction=instruction, hint=hint, **extra)
    if answer is not None:
        spec["answer"] = answer
    if section:
        spec["section"] = section
    return spec


A_RECT = (0, 8, 0, 6)
B_RECT = (3, 10, 2, 7)

TASKS = [
    # ------------------------------------------------------------ subtopic 1
    task(
        (1, 5),
        "ugol-povorota-i-ugol-figury",
        "Поворот правильного многоугольника",
        1,
        1,
        TWO,
        "Суммарный поворот при обходе — 360°.",
        f"{360 // 6} {360 // 8}",
    ),
    task(
        (1, 8),
        "konechnoe-sostoyanie",
        "Лестница из четырёх ступеней",
        1,
        3,
        XY,
        "Каждое повторение — 5 вверх и 5 вправо.",
        end(1, 8)[0],
    ),
    # ------------------------------------------------------------ subtopic 2
    task(
        (2, 2),
        "masshtab",
        "Масштаб и расстояние",
        1,
        1,
        NUMBER,
        "Расстояние умножают на k.",
        6 * 25,
    ),
    task(
        (2, 5),
        "setka-tochek",
        "Сколько точек отметит сетка",
        1,
        2,
        NUMBER,
        "Число значений range — разность границ.",
        len(range(-3, 8)) * len(range(-2, 6)),
    ),
    task(
        (2, 7),
        "gotovyj-shablon",
        "Диагностика после алгоритма",
        2,
        3,
        THREE,
        "Три повторения замыкают треугольник, четвёртое идёт дальше.",
        f"{end(2, 7)[0]} {round(end(2, 7)[1]) % 360}",
    ),
    task(
        (2, 8),
        "diapazony-setki",
        "Точки сетки шаблона",
        2,
        3,
        TWO,
        "Лишние точки сетки лежат снаружи.",
        f"{len(range(-2, 13)) * len(range(-2, 11))} {len(rect_points((0, 8, 0, 6), strict=True))}",
    ),
    # ------------------------------------------------------------ subtopic 3
    task(
        (3, 2),
        "vnutri-na-granice-snaruzhi",
        "Квадрат влево-вверх",
        1,
        3,
        TWO,
        "Сначала строго внутри, потом вместе с границей.",
        f"{points(3, 2)} {points(3, 2, ('in', 'edge'))}",
    ),
    task(
        (3, 3),
        "pryamougolnik-po-osyam",
        "Точки прямоугольника 9 × 4",
        1,
        2,
        THREE,
        "Строго внутри (a − 1)(b − 1), с границей (a + 1)(b + 1).",
        " ".join(
            str(v)
            for v in (
                len(rect_points((0, 9, 0, 4), True)),
                len(rect_points((0, 9, 0, 4))),
                len(rect_points((0, 9, 0, 4)) - rect_points((0, 9, 0, 4), True)),
            )
        ),
    ),
    task(
        (3, 4),
        "tochki-i-promezhutki",
        "Точки на наклонном отрезке",
        1,
        2,
        NUMBER,
        "Шаг по отрезку — делитель смещений.",
        math.gcd(6, 4) + 1,
    ),
    task(
        (3, 5),
        "nezamknutaya-liniya",
        "Точки незамкнутой линии",
        1,
        2,
        NUMBER,
        "Общие концы отрезков считают один раз.",
        points(3, 5, ("edge",)),
    ),
    task(
        (3, 6),
        "ploshchad-treugolnika",
        "Площадь и точки треугольника",
        2,
        3,
        TWO,
        "Площадь — половина прямоугольника; точки — по столбцам.",
        f"{6 * 5 // 2} {sum(1 for x in range(1, 6) for y in range(1, 5) if 5 * x + 6 * y < 30)}",
    ),
    task(
        (3, 7),
        "chto-sprashivaet-vopros",
        "Прямоугольник, обойдённый трижды",
        1,
        3,
        NUMBER,
        "Повторный обход не меняет область.",
        points(3, 7),
    ),
    task(
        (3, 8),
        "chto-sprashivaet-vopros",
        "Квадрат с границей",
        1,
        3,
        NUMBER,
        "Голова влево, повороты налево.",
        points(3, 8, ("in", "edge")),
    ),
    # ------------------------------------------------------------ subtopic 4
    task(
        (4, 1),
        "granicy-peresecheniya",
        "Пересечение прямоугольников",
        1,
        3,
        TWO,
        "Левая граница — максимум левых, правая — минимум правых.",
        f"{len(rect_points((1, 5, 2, 4)))} {len(rect_points((1, 5, 2, 4), True))}",
    ),
    task(
        (4, 2),
        "obedinenie",
        "Объединение с границами",
        1,
        3,
        NUMBER,
        "Общую часть вычитают один раз.",
        len(rect_points((0, 4, 0, 3)) | rect_points((2, 6, 1, 4))),
    ),
    task(
        (4, 3),
        "peresechenie-po-granice",
        "Прямоугольники касаются стороной",
        2,
        3,
        THREE,
        "Пересечение — отрезок: площади нет, точки на нём есть.",
        " ".join(
            str(v)
            for v in (
                0,
                len(rect_points((0, 3, 0, 2)) & rect_points((3, 5, 0, 2))),
                len(rect_points((0, 3, 0, 2), True) & rect_points((3, 5, 0, 2), True)),
            )
        ),
    ),
    task(
        (4, 4),
        "tolko-v-odnoj-figure",
        "В A, но не в B",
        2,
        4,
        TWO,
        "«Строго внутри хотя бы одного» — объединение внутренностей.",
        f"{len(rect_points(A_RECT) - rect_points(B_RECT))} "
        f"{len(rect_points(A_RECT, True) | rect_points(B_RECT, True))}",
    ),
    task(
        (4, 5),
        "tolko-v-odnoj-figure",
        "Точки A без B",
        2,
        3,
        NUMBER,
        "Из точек A вычтите точки пересечения.",
        len(rect_points((0, 10, 0, 6)) - rect_points((4, 12, 2, 9))),
    ),
    task(
        (4, 6),
        "perehod-mezhdu-figurami",
        "Пересечение двух прямоугольников",
        2,
        5,
        NUMBER,
        "Переход с поднятым хвостом сдвигает вторую фигуру.",
        len(set.intersection(*figures(4, 6))),
    ),
    task(
        (4, 7),
        "obedinenie",
        "Объединение двух прямоугольников",
        2,
        4,
        NUMBER,
        "Сумма точек фигур минус пересечение.",
        len(set.union(*figures(4, 6))),
    ),
    # ------------------------------------------------------------ subtopic 5
    task(
        (5, 1),
        "tochki-mezhdu-naklonnymi",
        "Треугольник по столбцам",
        2,
        4,
        NUMBER,
        "Пятое повторение проходит по уже нарисованным сторонам.",
        points(5, 1),
    ),
    task(
        (5, 2),
        "naklonnyj-chetyrehugolnik",
        "Наклонный ромб",
        2,
        5,
        NUMBER,
        "Сетке нужны отрицательные значения y.",
        points(5, 2),
    ),
    task(
        (5, 3),
        "tochki-mezhdu-naklonnymi",
        "Треугольник со стороной 10",
        2,
        5,
        NUMBER,
        "Считайте по столбцам.",
        points(5, 3),
    ),
    task(
        (5, 4),
        "naklonnyj-chetyrehugolnik",
        "Параллелограмм с поворотом 60°",
        2,
        5,
        NUMBER,
        "Вторая вертикальная сторона не на целом x.",
        points(5, 4),
    ),
    task(
        (5, 5),
        "spornaya-tochka",
        "Точки на линии параллелограмма",
        2,
        4,
        NUMBER,
        "Проверьте каждую сторону по её уравнению.",
        points(5, 4, ("edge",)),
    ),
    task(
        (5, 6),
        "naklonnyj-chetyrehugolnik",
        "Квадрат, повёрнутый на 45°",
        2,
        5,
        NUMBER,
        "Стороны лежат на прямых y = x и y = −x.",
        points(5, 6, ("in", "edge")),
    ),
    task(
        (5, 7),
        "nevypuklaya-figura",
        "Невыпуклая фигура",
        2,
        4,
        NUMBER,
        "Разрежьте фигуру на прямоугольники.",
        points(5, 7),
    ),
    # ------------------------------------------------------------ subtopic 6
    task(
        (6, 1),
        "chislo-tochek-ot-parametra",
        "Наименьшее A: не менее 30 точек",
        2,
        3,
        NUMBER,
        "Точки строго внутри — 3(A − 1).",
        smallest(lambda a: len(rect_points((0, 4, 0, a), True)), lambda n: n >= 30),
    ),
    task(
        (6, 2),
        "strogij-i-nestrogij-porog",
        "Наименьшее A: больше 60 точек",
        2,
        3,
        NUMBER,
        "«Больше» — строгое неравенство.",
        smallest(lambda a: len(rect_points((0, 4, 0, a))), lambda n: n > 60),
    ),
    task(
        (6, 3),
        "strogij-i-nestrogij-porog",
        "Квадрат: больше 100 точек внутри",
        2,
        3,
        NUMBER,
        "При равенстве порог ещё не пройден.",
        smallest(lambda a: len(rect_points((0, a, 0, a), True)), lambda n: n > 100),
    ),
    task(
        (6, 4),
        "figura-ne-pomeshchaetsya",
        "Наибольшее пересечение",
        2,
        4,
        NUMBER,
        "По каждой оси общая часть не длиннее меньшей фигуры.",
        max(
            len(rect_points((0, 10, 0, 4)) & rect_points((p, p + 6, q, q + 6)))
            for p, q in product(range(-6, 11), range(-6, 5))
        ),
    ),
    task(
        (6, 5),
        "naibolshee-peresechenie",
        "Положения квадрата 3 × 3",
        2,
        3,
        NUMBER,
        "Левый нижний угол пробегает целые точки.",
        sum(1 for p, q in product(range(0, 11), range(0, 5)) if p + 3 <= 10 and q + 3 <= 4),
    ),
    task(
        (6, 6),
        "schetchik-poseshchenij",
        "Точки, посещённые дважды",
        2,
        4,
        NUMBER,
        "Шагайте по единице и считайте посещения.",
        visits(
            "Повтори 5 [Вперёд 3 Направо 90]".replace("Повтори 5 [", "").replace("]", "") * 5, True
        )[0],
    ),
    task(
        (6, 7),
        "poseshcheniya",
        "Посещения без начального положения",
        2,
        4,
        TWO,
        "Начальная точка теперь не посещение.",
        " ".join(str(v) for v in visits("Вперёд 3 Направо 90 " * 5, False)),
    ),
    # ------------------------------------------------------------ subtopic 7
    task(
        (7, 1),
        "uslovie-prinadlezhnosti",
        "Точки прямоугольника программой",
        1,
        2,
        NUMBER,
        "Перебор с запасом и проверка условия.",
        code="""count = 0
for x in range(-1, 11):
    for y in range(-1, 6):
        if 0 < x < 9 and 0 < y < 4:
            count += 1
print(count)""",
    ),
    task(
        (7, 2),
        "dva-pryamougolnika",
        "Ровно в одном из прямоугольников",
        2,
        3,
        NUMBER,
        "Ровно в одном — in_A != in_B.",
        code="""count = 0
for x in range(-1, 12):
    for y in range(-1, 9):
        in_a = 0 <= x <= 8 and 0 <= y <= 6
        in_b = 3 <= x <= 10 and 2 <= y <= 7
        if in_a != in_b:
            count += 1
print(count)""",
    ),
    task(
        (7, 3),
        "treugolnik-programmoj",
        "Треугольник программой",
        2,
        4,
        NUMBER,
        "Точка между двумя наклонными сторонами.",
        code="""import math

count = 0
for x in range(-1, 8):
    for y in range(-1, 8):
        low = x / math.sqrt(3)
        if 0 < x and low < y < 6 - low:
            count += 1
print(count)""",
    ),
    task(
        (7, 4),
        "necelye-granicy",
        "Целые числа между нецелыми границами",
        1,
        2,
        TWO,
        "Округлите границы внутрь отрезка.",
        code="""import math

print(math.floor(6.8) - math.ceil(2.3) + 1,
      math.ceil(4) - math.floor(1.5) - 1)""",
    ),
    task(
        (7, 5),
        "krivolinejnaya-granica",
        "Полукруг с границей",
        2,
        3,
        NUMBER,
        "Сравнивайте квадраты расстояний — без корней.",
        code="""count = 0
for x in range(-1, 12):
    for y in range(-1, 7):
        if y >= 0 and (x - 5) ** 2 + y ** 2 <= 25:
            count += 1
print(count)""",
    ),
    task(
        (7, 6),
        "krivolinejnaya-granica",
        "Полукруг строго внутри",
        2,
        3,
        NUMBER,
        "Все неравенства — строгие.",
        code="""count = 0
for x in range(-1, 12):
    for y in range(-1, 7):
        if y > 0 and (x - 5) ** 2 + y ** 2 < 25:
            count += 1
print(count)""",
    ),
    # ---------------------------------------------------- «Практика и итог»
    task(
        (8, 1),
        None,
        "Прямоугольник, обойдённый с половиной",
        2,
        3,
        NUMBER,
        "Подтемы 1, 3.",
        points(8, 1),
    ),
    task(
        (8, 2),
        None,
        "Повторный обход влево",
        2,
        3,
        NUMBER,
        "Подтемы 1, 3.",
        points(8, 2, ("in", "edge")),
    ),
    task(
        (8, 3),
        None,
        "Пересечение двух фигур",
        2,
        5,
        NUMBER,
        "Подтема 4.",
        len(set.intersection(*figures(8, 3))),
    ),
    task((8, 4), None, "Треугольник, обойдённый дважды", 2, 5, NUMBER, "Подтема 5.", points(8, 4)),
    task((8, 5), None, "Площадь фигуры Г", 2, 4, NUMBER, "Подтемы 3, 5.", round(area(8, 5))),
]


if __name__ == "__main__":
    sys.exit(main(HERE, 6, TASKS))
