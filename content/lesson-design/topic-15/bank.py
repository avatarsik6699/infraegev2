"""Topic 15 bank tasks for the site lesson (Change 190, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-15/bank.py          # check only
    python3 -I content/lesson-design/topic-15/bank.py --write  # update the bank
    python3 -I content/lesson-design/topic-15/bank.py --checkpoints  # and site.checkpoints

The rules are those of ``scripts/lesson_design/topic_bank.py``. The lesson
proves the answer with a model (the false case, the dangerous set) and checks it
with Python only in subtopic 6, so a task gives its ``answer`` from a finite
search the lesson justifies: every candidate A is tried against every x (and y)
of a range wide enough for the formula, the points of a line at half-steps
between integer ends. The formulas are written out from the statements.
``apps/api/tests/test_task_15_bank.py`` recomputes every answer independently.
"""

import sys
from itertools import combinations
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, TWO, main  # noqa: E402

NAT = range(1, 400)
NONNEG = range(0, 400)


def imp(a: bool, b: bool) -> bool:
    return not a or b


def DEL(n: int, m: int) -> bool:  # noqa: N802 — the exam's name
    return n % m == 0


def best(candidates, ok, pick=min) -> int:
    return pick(a for a in candidates if ok(a))


def always(xs, fn) -> bool:
    return all(fn(x) for x in xs)


def both(xs, ys, fn) -> bool:
    return all(fn(x, y) for x in xs for y in ys)


# --- segments: A = [a; b] with integer ends, x at half-steps ----------------------------
POINTS = [k / 2 for k in range(-20, 160)]


def inside(x: float, seg) -> bool:
    return seg[0] <= x <= seg[1]


def segment_length(P, Q, formula, pick) -> int:
    segs = [(a, b) for a in range(0, 70) for b in range(a, 70)]
    good = [
        b - a
        for a, b in segs
        if all(formula(inside(x, P), inside(x, Q), inside(x, (a, b))) for x in POINTS)
    ]
    return pick(good)


# --- finite sets: A ⊆ a small universe -----------------------------------------------------
UNIVERSE = range(-6, 9)


def subsets(ok):
    items = list(UNIVERSE)
    for k in range(len(items) + 1):
        for chosen in combinations(items, k):
            if ok(set(chosen)):
                yield set(chosen)


def triangle(a: int, b: int, c: int) -> bool:
    return a + b > c and a + c > b and b + c > a


def task(at, section, title, difficulty, minutes, hint, answer, instruction=NUMBER, **extra):
    spec = dict(at=at, title=title, difficulty=difficulty, minutes=minutes)
    spec.update(instruction=instruction, hint=hint, answer=answer, **extra)
    if section:
        spec["section"] = section
    return spec


P26, Q26 = {-4, 1, 6}, {1, 3}
S26 = list(subsets(lambda A: all(imp(x in A, x in P26) or x in Q26 for x in UNIVERSE)))
S27 = list(
    subsets(
        lambda A: all(imp(x in P26, x in A) and imp(x in A, x in P26 or x in Q26) for x in UNIVERSE)
    )
)
SQ44 = [
    a
    for a in range(-5, 80)
    if always(range(0, 20), lambda x, a=a: imp(x <= 5, x * x <= a))
    and always(range(0, 20), lambda y, a=a: imp(y * y <= a, y <= 5))
]
SAFE6 = [a for a in range(1, 41) if not any(DEL(x, 6) for x in range(a, a + 5))]

TASKS = [
    # ------------------------------------------------------------ subtopic 1
    task(
        (1, 1),
        "implikaciya",
        "Импликация при ложной предпосылке",
        1,
        1,
        "Стрелка ложна только при 1 → 0.",
        int(imp(False, False)),
    ),
    task(
        (1, 4),
        "minimum-i-maksimum",
        "Наименьшее A: x < 12",
        1,
        2,
        "Ложный случай: x < 12 и x > A.",
        best(range(-5, 50), lambda a: always(NONNEG, lambda x: imp(x < 12, x <= a))),
    ),
    task(
        (1, 5),
        "minimum-i-maksimum",
        "Наибольшее A: x ≥ 5",
        1,
        2,
        "Опасны x ≥ 5.",
        best(range(-5, 50), lambda a: always(NAT, lambda x: imp(x >= 5, x > a)), max),
    ),
    task(
        (1, 6),
        "formula-lozhna-vsegda",
        "Формула ложна всегда",
        2,
        2,
        "Отрицание должно быть истинно при всех x.",
        best(range(-5, 50), lambda a: always(NAT, lambda x: not (x < 6 and x > a))),
    ),
    task(
        (1, 7),
        "lozhnyj-sluchaj",
        "Наименьшее A: 3x < A",
        1,
        2,
        "Опасны x = 1 … 8.",
        best(range(0, 100), lambda a: always(NAT, lambda x: imp(x <= 8, 3 * x < a))),
    ),
    # ------------------------------------------------------------ subtopic 2
    task(
        (2, 1),
        "peresechenie-p-i-q",
        "Минимальная длина: общая часть",
        1,
        3,
        "A закрывает P ∩ Q.",
        segment_length((1, 13), (8, 18), lambda p, q, a: imp(not a, imp(p, not q)), min),
    ),
    task(
        (2, 2),
        "vnutri-p-q",
        "Максимальная длина внутри P ∪ Q",
        1,
        3,
        "A — внутри одной части.",
        segment_length((2, 7), (11, 20), lambda p, q, a: imp(a, p) or q, max),
    ),
    task(
        (2, 3),
        "promezhutok-mezhdu-chastyami",
        "Минимальная длина: обе части",
        2,
        3,
        "A покрывает и промежуток.",
        segment_length((3, 6), (14, 19), lambda p, q, a: imp(p or q, a), min),
    ),
    task(
        (2, 4),
        "slozhnaya-formula",
        "Максимальная длина: сложная формула",
        2,
        4,
        "Подставьте a = 0 и a = 1.",
        segment_length((2, 9), (10, 17), lambda p, q, a: imp(imp(not a, p), imp(a, q)), max),
    ),
    task(
        (2, 6),
        "kolichestvo-i-summa",
        "Наибольшее количество и сумма",
        2,
        3,
        "Количество и сумма — разные цели.",
        f"{max(len(A) for A in S26)} {max(sum(A) for A in S26)}",
        TWO,
    ),
    task(
        (2, 7),
        "kolichestvo-i-summa",
        "Наименьшая и наибольшая сумма",
        2,
        3,
        "Обязательные элементы плюс свободные.",
        f"{min(sum(A) for A in S27)} {max(sum(A) for A in S27)}",
        TWO,
    ),
    task(
        (2, 8),
        "peresechenie-p-i-q",
        "Наименьшая длина A",
        1,
        3,
        "Обязательна общая часть P и Q.",
        segment_length((10, 40), (25, 55), lambda p, q, a: imp(p, imp(q, a)), min),
    ),
    task(
        (2, 9),
        "vnutri-p-q",
        "Наибольшая длина A",
        1,
        3,
        "A целиком в P или в Q.",
        segment_length((5, 20), (30, 45), lambda p, q, a: imp(a, p) or q, max),
    ),
    # ------------------------------------------------------------ subtopic 3
    task((3, 1), "porazryadnoe-i", "26 & 13", 1, 1, "Сравните разряды.", 26 & 13),
    task(
        (3, 2),
        "naimenshee-a",
        "Наименьшее A: маски 26 и 12",
        2,
        3,
        "Обязательные биты.",
        best(
            range(128),
            lambda a: always(range(128), lambda x: imp(x & 26 != 0, imp(x & 12 == 0, x & a != 0))),
        ),
    ),
    task(
        (3, 3),
        "naibolshee-a",
        "Наибольшее A: маски 6 и 9",
        2,
        3,
        "Разрешённые биты.",
        best(
            range(128),
            lambda a: always(range(128), lambda x: imp(x & a != 0, imp(x & 6 == 0, x & 9 != 0))),
            max,
        ),
    ),
    task(
        (3, 5),
        "naimenshee-a",
        "Наименьшее A: маски 28 и 12",
        2,
        3,
        "Бит обязателен, если он есть в 28, но не в 12.",
        best(
            range(128),
            lambda a: always(range(128), lambda x: imp(x & 28 != 0, imp(x & 12 == 0, x & a != 0))),
        ),
    ),
    task(
        (3, 6),
        "naibolshee-a",
        "Наибольшее A: маски 20 и 3",
        2,
        3,
        "Разрешены биты масок 20 и 3.",
        best(
            range(128),
            lambda a: always(range(128), lambda x: imp(x & a != 0, imp(x & 20 == 0, x & 3 != 0))),
            max,
        ),
    ),
    task(
        (3, 7),
        "naimenshee-a",
        "Наименьшее A: маски 50 и 22",
        2,
        4,
        "Разложите маски на биты.",
        best(
            range(128),
            lambda a: always(range(128), lambda x: imp(x & 50 != 0, imp(x & 22 == 0, x & a != 0))),
        ),
    ),
    task(
        (3, 8),
        "naibolshee-a",
        "Наибольшее A: маски 41 и 15",
        2,
        4,
        "Все разрешённые биты.",
        best(
            range(128),
            lambda a: always(range(128), lambda x: imp(x & a != 0, imp(x & 41 == 0, x & 15 != 0))),
            max,
        ),
    ),
    # ------------------------------------------------------------ subtopic 4
    task(
        (4, 1),
        "naibolshee-znachenie",
        "Наименьшее A: x² ≤ A",
        1,
        2,
        "Наибольший квадрат на опасной области.",
        best(range(0, 100), lambda a: always(NONNEG, lambda x: imp(x < 5, x * x <= a))),
    ),
    task(
        (4, 2),
        "vse-lozhnye-chasti",
        "Две ложные части",
        2,
        4,
        "Опасны пары с x + y < 18 и x ≥ y.",
        best(
            range(0, 60),
            lambda a: both(range(1, 60), range(1, 60), lambda x, y: x + y >= 18 or x < y or y < a),
        ),
    ),
    task(
        (4, 3),
        "naibolshee-znachenie",
        "Наибольшее x + y",
        2,
        3,
        "Опасна область 3x + 2y < 24.",
        best(
            range(0, 60),
            lambda a: both(
                range(1, 60), range(1, 60), lambda x, y: 3 * x + 2 * y >= 24 or x + y < a
            ),
        ),
    ),
    task(
        (4, 4),
        "dve-chasti-i",
        "Все допустимые A",
        2,
        4,
        "Нижняя граница из первой части, верхняя — из второй.",
        f"{max(SQ44)} {len(SQ44)}",
        "Введите наибольшее допустимое A и количество допустимых A через пробел.",
    ),
    task(
        (4, 6),
        "parametr-mnozhitelem",
        "Параметр множителем",
        2,
        4,
        "При A ≤ 0 формула ложна.",
        best(
            range(-5, 100),
            lambda a: both(range(1, 60), range(1, 60), lambda x, y: y >= 10 or a * x >= 2 * y + 5),
        ),
    ),
    task(
        (4, 7),
        "napravlenie-vliyaniya",
        "Наибольшее A: xy < 40",
        2,
        4,
        "Опасны x, y < A.",
        best(
            range(1, 60),
            lambda a: both(range(1, 60), range(1, 60), lambda x, y: x * y < 40 or x >= a or y >= a),
            max,
        ),
    ),
    task(
        (4, 8),
        "naibolshee-znachenie",
        "Наименьшее A: 3x + y ≥ 33",
        2,
        4,
        "Наибольшее x + y на опасной области.",
        best(
            range(0, 80),
            lambda a: both(range(1, 60), range(1, 60), lambda x, y: 3 * x + y >= 33 or x + y < a),
        ),
    ),
    # ------------------------------------------------------------ subtopic 5
    task(
        (5, 1),
        "naibolshee-a-2",
        "Наибольшее A: 8 и 12",
        2,
        3,
        "A делит все опасные числа — их НОД.",
        best(
            range(1, 200),
            lambda a: always(
                range(1, 1000), lambda x: imp(not DEL(x, a), imp(DEL(x, 8), not DEL(x, 12)))
            ),
            max,
        ),
    ),
    task(
        (5, 2),
        "dopolnitelnoe-ogranichenie",
        "Наибольшее A с ДЕЛ(60, A)",
        2,
        3,
        "Сначала делимость, потом ограничение.",
        best(
            range(1, 200),
            lambda a: (
                DEL(60, a)
                and always(
                    range(1, 1000), lambda x: imp(not DEL(x, a), imp(DEL(x, 8), not DEL(x, 18)))
                )
            ),
            max,
        ),
    ),
    task(
        (5, 3),
        "obshchie-deliteli",
        "Наименьшее A с ДЕЛ(A, 20)",
        2,
        4,
        "Общие делители 84 и 126 делят A.",
        best(
            range(1, 2000),
            lambda a: (
                DEL(a, 20)
                and always(
                    range(1, 127), lambda x: imp(DEL(84, x), imp(not DEL(a, x), not DEL(126, x)))
                )
            ),
        ),
    ),
    task(
        (5, 4),
        "nekratnye-chisla",
        "Некратные 3 в отрезке",
        1,
        2,
        "Последнее некратное в отрезке.",
        best(
            range(1, 100), lambda a: always(NAT, lambda x: imp(10 <= x <= 40, DEL(x, 3) or x < a))
        ),
    ),
    task(
        (5, 5),
        "kratno-no-ne-drugomu",
        "Кратно 6, но не 4",
        2,
        3,
        "Опасный набор с исключением.",
        best(
            range(1, 100),
            lambda a: always(
                NAT, lambda x: imp(x < 50, (not (DEL(x, 6) and not DEL(x, 4))) or x < a)
            ),
        ),
    ),
    task(
        (5, 6),
        "konechnoe-mnozhestvo-a",
        "Наименьшее множество A",
        1,
        2,
        "В A — все опасные числа.",
        sum(1 for x in range(10, 41) if not DEL(x, 5)),
    ),
    task(
        (5, 7),
        "konechnyj-opasnyj-nabor",
        "Наибольшее A: отрезок [40; 50]",
        2,
        3,
        "Выпишите опасный набор.",
        best(
            range(1, 200),
            lambda a: always(
                range(1, 2000), lambda x: DEL(x, a) or imp(40 <= x <= 50, not DEL(x, 12))
            ),
            max,
        ),
    ),
    # ------------------------------------------------------------ subtopic 6
    task(
        (6, 3),
        "snachala-kontrprimer",
        "Первый контрпример",
        1,
        2,
        "Перебирайте x по возрастанию.",
        next(x for x in range(64) if not imp(x & 28 != 0, imp(x & 12 == 0, x & 8 != 0))),
    ),
    # ------------------------------------------------------------ subtopic 7
    task(
        (7, 2),
        "predikat-po-opredeleniyu",
        "Треугольник со сторонами 3 и 8",
        2,
        3,
        "Треугольник: каждая сторона меньше суммы двух других.",
        best(range(-5, 50), lambda a: always(NAT, lambda x: (not triangle(x, 3, 8)) or x > a), max),
    ),
    task(
        (7, 3),
        "max",
        "MAX(x, 12) < A",
        1,
        3,
        "Разберите случаи: какое из чисел больше.",
        best(range(0, 100), lambda a: always(NAT, lambda x: max(x, 12) < a or x >= 30)),
    ),
    task(
        (7, 4),
        "max",
        "MAX(x, y) ≤ 6",
        1,
        3,
        "Опасны x, y ≤ 6.",
        best(
            range(0, 100),
            lambda a: both(range(1, 30), range(1, 30), lambda x, y: imp(max(x, y) <= 6, x + y < a)),
        ),
    ),
    task(
        (7, 5),
        "svyazannye-delimosti",
        "Наибольшее A ≤ 200",
        2,
        4,
        "Опасный набор зависит от A.",
        best(
            range(1, 201),
            lambda a: always(range(1, 201), lambda x: imp(DEL(a, x) and DEL(x, 3), DEL(90, x))),
            max,
        ),
    ),
    task(
        (7, 6),
        "nabor-zavisit-ot-a",
        "Отрезок без кратных 6",
        2,
        3,
        "Посмотрите на остаток A при делении на 6.",
        f"{max(SAFE6)} {len(SAFE6)}",
        TWO,
    ),
    # ---------------------------------------------------- «Практика и итог»
    task(
        (8, 1),
        None,
        "Наименьшее A: x · x < A",
        1,
        3,
        "Подтема 1.",
        best(range(0, 300), lambda a: always(NAT, lambda x: imp(x <= 12, x * x < a))),
    ),
    task(
        (8, 2),
        None,
        "Наименьшая длина отрезка A",
        2,
        4,
        "Подтема 2.",
        segment_length((15, 40), (21, 63), lambda p, q, a: imp(p, imp(q and not a, not p)), min),
    ),
    task(
        (8, 3),
        None,
        "Наименьшее A: маски 29 и 17",
        2,
        4,
        "Подтема 3.",
        best(
            range(128),
            lambda a: always(range(128), lambda x: imp(x & 29 != 0, imp(x & 17 == 0, x & a != 0))),
        ),
    ),
    task(
        (8, 4),
        None,
        "Наибольшее A: 2x + y = 70",
        2,
        4,
        "Подтема 4.",
        best(
            range(-5, 80),
            lambda a: both(
                range(1, 80), range(1, 80), lambda x, y: 2 * x + y != 70 or x < y or a < x
            ),
            max,
        ),
    ),
    task(
        (8, 5),
        None,
        "Наименьшее A: некратные 4",
        2,
        3,
        "Подтема 5.",
        best(
            range(1, 100), lambda a: always(NAT, lambda x: imp(20 <= x <= 50, DEL(x, 4) or x < a))
        ),
    ),
]

assert all(str(t["answer"]).replace(" ", "").isdigit() for t in TASKS)

if __name__ == "__main__":
    sys.exit(main(HERE, 15, TASKS))
