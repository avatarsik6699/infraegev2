"""Topic 18 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-18/bank.py          # check only
    python3 -I content/lesson-design/topic-18/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. The topic is
solved in a spreadsheet and its lesson has no Python, so a task gives its
``answer`` from the stand's own solver (``datasets.py``: the forward table of
the lesson on the fields the books hold) and, for a task on a book, the
spreadsheet formulas of the solution. ``apps/api/tests/test_task_18_bank.py``
recomputes every answer independently, by recursion from the finish.
"""

import importlib.util
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, main  # noqa: E402

_spec = importlib.util.spec_from_file_location("datasets18", HERE / "datasets.py")
assert _spec and _spec.loader
ds = importlib.util.module_from_spec(_spec)
sys.modules["datasets18"] = ds
_spec.loader.exec_module(ds)

JOINED = "Введите ответ одним числом: два результата подряд, без пробела."
SPACED = "Введите два числа через пробел."
FIELD_4 = [[2, 7, 4, 1], [5, 1, 8, 3], [2, 6, 2, 9], [4, 3, 7, 2]]
TRAIN = [[3, 4, 2], [1, 8, 5], [6, 2, 7]]


def cell(name: str) -> tuple[int, int]:
    return int(name[1:]) - 1, "ABCDEFGHIJKLMNOPQRSTUVWXYZ".index(name[0])


def field(a, right=(), down=()):
    """A field of the lesson; walls to the right of / below the named cells."""
    return ds.Field([row[:] for row in a], {cell(c) for c in right}, {cell(c) for c in down})


def book(name: str):
    return ds.FIELDS[name]()


def joined(pair) -> str:
    return "".join(str(v) for v in pair)


def xlsx(name: str) -> tuple[str, str]:
    return (f"{name}.xlsx", "Поле — Excel-файл, как на экзамене")


def greedy(f) -> int:
    """The robot that always steps to the larger neighbouring coin."""
    r = c = 0
    total = f.a[0][0]
    while (r, c) != (f.h - 1, f.w - 1):
        steps = [(r + dr, c + dc) for dr, dc in ds.RD if f.can(r, c, dr, dc)]
        r, c = max(steps, key=lambda p: f.a[p[0]][p[1]])
        total += f.a[r][c]
    return total


def count_routes(f) -> int:
    n = [[0] * f.w for _ in range(f.h)]
    n[0][0] = 1
    for r in range(f.h):
        for c in range(f.w):
            if r and f.can(r - 1, c, 1, 0):
                n[r][c] += n[r - 1][c]
            if c and f.can(r, c - 1, 0, 1):
                n[r][c] += n[r][c - 1]
    return n[-1][-1]


def best_route(f, t) -> list[tuple[int, int]]:
    """The route of the best sum, from the finish back along the table."""
    r, c = f.h - 1, f.w - 1
    route = [(r, c)]
    while (r, c) != (0, 0):
        prev = [
            (r - dr, c - dc)
            for dr, dc in ds.RD
            if r - dr >= 0 and c - dc >= 0 and f.can(r - dr, c - dc, dr, dc)
        ]
        r, c = next(p for p in prev if t[p[0]][p[1]] == t[r][c] - f.a[r][c])
        route.append((r, c))
    return route


def energy_reach(f, reserve: int) -> tuple[int, int]:
    """A cell costs its number; the cells the reserve reaches and the longest route."""
    t = ds.best_table(f, min)
    reach = [(r, c) for r in range(f.h) for c in range(f.w) if t[r][c] <= reserve]
    return len(reach), max(r + c for r, c in reach)


def through(f, r: int, c: int, pick) -> int:
    to_cell = ds.best_table(f, pick)[r][c]
    from_cell = ds.to_finish(f, pick)[r][c]
    return to_cell + from_cell - f.a[r][c]


def rook(row: list[int]) -> int:
    best = [row[0]]
    for j in range(1, len(row)):
        best.append(row[j] + max(best))
    return best[-1]


def even_gain(f, p, q) -> int:
    x = f.a[q[0]][q[1]]
    return x if x % 2 == 0 else 0


BASE = field(FIELD_4)
WALLS_3 = field(FIELD_4, right=["C4"], down=["C1"])
B3 = cell("B3")

# Formulas of the forward table, shown under the written answer of a book task.
BLOCK_15 = """Поле A1:O15, блок максимума A17:O31:
A17: =A1
B17: =B1+A17        (копировать вправо до O17)
A18: =A2+A17        (копировать вниз до A31)
B18: =B2+МАКС(A18;B17)  (копировать на B18:O31)
Блок минимума A33:O47 — те же формулы с МИН."""
BLOCK_20 = """Поле A1:T20, блок максимума A22:T41:
A22: =A1;  B22: =B1+A22;  A23: =A2+A22
B23: =B2+МАКС(A23;B22) — скопировать на весь блок,
затем в клетках со стеной на входе убрать
запрещённого предшественника.
Блок минимума — те же формулы с МИН."""
CORNERS = """Блоки максимума и минимума — как для поля со стенами;
клетки, отрезанные стенами, — «X»:
=ЕСЛИ(СЧЁТ(A23;B22)=0;"X";B2+МАКС(A23;B22))
Ответ — МАКС и МИН по «угловым» клеткам блоков."""

# (page, number in the page) -> task definition; page 9 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 1),
        section="pravilo-kletki",
        title="Сумма по двум предшественникам",
        difficulty=1,
        minutes=1,
        instruction="Введите два числа через пробел: максимальную, затем минимальную сумму.",
        hint="К монете клетки прибавьте лучший из двух приходов.",
        answer=f"{4 + max(29, 20)} {4 + min(18, 15)}",
    ),
    dict(
        at=(1, 2),
        section="dlina-marshruta",
        title="Длина маршрута",
        difficulty=1,
        minutes=1,
        instruction="Введите два числа через пробел: перемещения, затем клетки.",
        hint="Вниз нужно 4 шага, вправо — 7.",
        answer=f"{(5 - 1) + (8 - 1)} {(5 - 1) + (8 - 1) + 1}",
    ),
    dict(
        at=(1, 3),
        section="dlina-marshruta",
        title="Одинаковые монеты",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="Любой маршрут посещает одинаковое число клеток.",
        answer=f"{2 * 6 - 1} " + " ".join(map(str, ds.fixed(field([[4] * 6 for _ in range(6)])))),
    ),
    dict(
        at=(1, 4),
        section="ochevidnye-sposoby",
        title="Жадный робот",
        difficulty=1,
        minutes=3,
        instruction="Введите два числа через пробел: сумму жадного робота, затем наибольшую.",
        hint="Жадный выбор на шаге не учитывает, что ждёт дальше.",
        answer=f"{greedy(field([[1, 5, 1], [4, 3, 2], [9, 9, 1]]))} "
        f"{ds.fixed(field([[1, 5, 1], [4, 3, 2], [9, 9, 1]]))[0]}",
    ),
    dict(
        at=(1, 6),
        section="pole-4x4",
        title="Обе таблицы на поле 3 × 3",
        difficulty=2,
        minutes=4,
        instruction="Введите два числа через пробел: максимум, затем минимум.",
        hint="Края заполняются накоплением, внутренние клетки — по правилу клетки.",
        answer=" ".join(map(str, ds.fixed(field(TRAIN)))),
    ),
    dict(
        at=(1, 8),
        section="pravilo-kletki",
        title="Отрицательные числа",
        difficulty=2,
        minutes=4,
        instruction="Введите два числа через пробел: максимум, затем минимум.",
        hint="Правило клетки не зависит от знака чисел.",
        answer=" ".join(map(str, ds.fixed(field([[-2, 5, -1], [4, -6, 3], [-3, 2, -4]])))),
        # the file writes the minimum with the minus sign «−»
        says=["Максимум 1", "минимум −6"],
    ),
    dict(
        at=(1, 9),
        section="pole-4x4",
        title="Поле 4 × 5",
        difficulty=2,
        minutes=6,
        instruction=JOINED,
        hint="Постройте обе таблицы и запишите максимум и минимум подряд.",
        answer=joined(
            ds.fixed(
                field(
                    [
                        [6, 4, 15, 11, 8],
                        [7, 16, 16, 6, 16],
                        [10, 15, 9, 7, 9],
                        [4, 11, 17, 6, 8],
                    ]
                )
            )
        ),
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 7),
        section="pole-ekzamena",
        title="Поле 15 × 15",
        difficulty=2,
        minutes=8,
        instruction=JOINED,
        hint="Блоки максимума и минимума под полем; ответ — в клетках под O15.",
        files=[xlsx("18-1")],
        answer=joined(ds.fixed(book("18-1"))),
        excel=BLOCK_15 + "\nОтвет: O31 и O47.",
    ),
    dict(
        at=(2, 8),
        section="pole-ekzamena",
        title="Финиш в J10",
        difficulty=2,
        minutes=4,
        instruction=JOINED,
        hint="Блоки те же; нужен результат в клетке под J10. Сначала минимум.",
        files=[xlsx("18-1")],
        answer=f"{ds.best_table(book('18-1'), min)[9][9]}{ds.best_table(book('18-1'), max)[9][9]}",
        excel=BLOCK_15 + "\nОтвет: J42 (минимум) и J26 (максимум).",
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 1),
        section="stena-na-vhode",
        title="Стена слева",
        difficulty=1,
        minutes=1,
        instruction="Введите два числа через пробел: максимальную, затем минимальную сумму.",
        hint="Стена на входе убирает левого предшественника.",
        answer=f"{4 + 20} {4 + 15}",
    ),
    dict(
        at=(3, 2),
        section="stena-mezhdu-kletkami",
        title="Стена между B1 и B2",
        difficulty=2,
        minutes=3,
        instruction="Введите два числа через пробел: максимум, затем минимум.",
        hint="В B2 теперь приходят только слева.",
        answer=" ".join(map(str, ds.fixed(field(TRAIN, down=["B1"])))),
    ),
    dict(
        at=(3, 5),
        section="stena-v-formule",
        title="Третья стена",
        difficulty=2,
        minutes=4,
        instruction="Введите два числа через пробел: максимум, затем минимум.",
        hint="C3 получает сумму только сверху.",
        answer=" ".join(map(str, ds.fixed(field(FIELD_4, right=["C4", "B3"], down=["C1"])))),
    ),
    dict(
        at=(3, 7),
        section="otrezok-steny",
        title="Поле 20 × 20 со стенами",
        difficulty=3,
        minutes=10,
        instruction=JOINED,
        hint="Формулу клеток со стеной на входе правят на всём отрезке стены.",
        files=[xlsx("18-2")],
        answer=joined(ds.fixed(book("18-2"))),
        excel=BLOCK_20 + "\nОтвет: T41 и правая нижняя клетка блока минимума.",
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 3),
        section="uglovye-finishi",
        title="«Угловые» финиши поля 3 × 3",
        difficulty=2,
        minutes=4,
        instruction="Введите два числа через пробел: максимум, затем минимум.",
        hint="Финиши — достижимые клетки, из которых нет хода.",
        answer=" ".join(
            map(
                str,
                ds.corners(
                    field([[4, 2, 7], [3, 9, 1], [6, 5, 8]], right=["A1", "B3"], down=["B2"])
                ),
            )
        ),
    ),
    dict(
        at=(4, 6),
        section="uglovye-finishi",
        title="«Угловые» финиши поля 20 × 20",
        difficulty=3,
        minutes=12,
        instruction=JOINED,
        hint="Отрезанные стенами клетки — «X», а не 0.",
        files=[xlsx("18-3")],
        answer=joined(ds.corners(book("18-3"))),
        excel=CORNERS,
    ),
    dict(
        at=(4, 7),
        section="metka-x",
        title="Недостижимые клетки",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Посчитайте «X» в блоке функцией СЧЁТЕСЛИ.",
        files=[xlsx("18-3")],
        answer=str(ds.unreachable(book("18-3"), ds.best_table(book("18-3"), max))),
        excel=CORNERS + '\nНедостижимых клеток: =СЧЁТЕСЛИ(A22:T41;"X").',
    ),
    dict(
        at=(4, 8),
        section="start-vnutri",
        title="Старт в позиции (4; 6)",
        difficulty=3,
        minutes=12,
        instruction=JOINED,
        hint="Клетки выше и левее старта недостижимы — «X».",
        files=[xlsx("18-4")],
        answer=joined(ds.corners(book("18-4"), ds.RD, ds.START_4)),
        excel=CORNERS
        + "\nСтарт D6: в клетке блока под D6 — =D6;\nстроки 1–5 и столбцы A–C блока — «X».",
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="predshestvenniki",
        title="Влево и вниз",
        difficulty=2,
        minutes=3,
        instruction="Введите два числа через пробел: максимум, затем минимум.",
        hint="Старт в C1, предшественники — справа и сверху.",
        answer=f"{ds.best_table(field(TRAIN), max, ds.LD, ((0, 2),))[2][0]} "
        f"{ds.best_table(field(TRAIN), min, ds.LD, ((0, 2),))[2][0]}",
    ),
    dict(
        at=(5, 4),
        section="obratnyj-raschyot",
        title="От B2 до финиша",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Блок «к финишу» с МИН: клетка блока под B2.",
        answer=str(ds.to_finish(BASE, min)[1][1]),
    ),
    dict(
        at=(5, 5),
        section="neskolko-zapuskov",
        title="Два запуска из разных стартов",
        difficulty=1,
        minutes=2,
        instruction="Введите два числа через пробел: максимум, затем минимум.",
        hint="Два наибольших и два наименьших результата разных стартов.",
        answer=f"{sum(sorted([70, 95, 60, 95, 81])[-2:])} {sum(sorted([40, 52, 33, 47, 39])[:2])}",
    ),
    dict(
        at=(5, 6),
        section="adresa-predshestvennikov",
        title="Влево и вниз на поле 20 × 20",
        difficulty=3,
        minutes=12,
        instruction=JOINED,
        hint="Старт в правой верхней клетке; финиши закрыты слева и снизу. Сначала минимум.",
        files=[xlsx("18-5")],
        answer=joined(reversed(ds.corners(book("18-5"), ds.LD, (0, 19)))),
        excel="""Старт T1: в клетке блока под T1 — =T1;
первая строка накапливается влево, столбец T — вниз;
внутренняя клетка: монета + МАКС(клетка справа;
клетка сверху), отрезанные клетки — «X».
Ответ — МИН и МАКС по «угловым» клеткам.""",
    ),
    dict(
        at=(5, 7),
        section="neskolko-zapuskov",
        title="Три запуска из разных стартов",
        difficulty=3,
        minutes=12,
        instruction=JOINED,
        hint="Считайте от финиша: блок «к финишу» даёт результат каждого старта.",
        files=[xlsx("18-6")],
        answer=joined(ds.runs_from_starts(book("18-6"), 3)),
        excel="""Блок «к финишу»: в клетке под T20 — =T20;
внутренняя клетка: монета + МАКС(клетка справа;
клетка снизу) — то же с МИН во втором блоке.
Ответ — сумма трёх наибольших и трёх наименьших
результатов стартов (НАИБОЛЬШИЙ, НАИМЕНЬШИЙ).""",
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 1),
        section="diagonal-vpravo-vniz",
        title="Диагональ вправо-вниз",
        difficulty=2,
        minutes=3,
        instruction="Введите два числа через пробел: максимум, затем минимум.",
        hint="Третий предшественник — клетка слева сверху.",
        answer=" ".join(map(str, ds.diag(field(TRAIN)))),
    ),
    dict(
        at=(6, 4),
        section="vklad-ot-prihoda",
        title="Вклад зависит от прихода",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="Сравнивайте полные кандидаты двух приходов.",
        answer=str(max(61 + (12 if 12 > 20 else 0), 58 + (12 if 12 > 9 else 0))),
    ),
    dict(
        at=(6, 7),
        section="diagonal-vpravo-vniz",
        title="Диагонали на поле 15 × 15",
        difficulty=2,
        minutes=8,
        instruction=SPACED,
        hint="В правило клетки добавьте диагонального предшественника.",
        files=[xlsx("18-7")],
        answer=" ".join(map(str, ds.diag(book("18-7")))),
        excel="""Блок максимума A17:O31: края — накопление,
B18: =B2+МАКС(A18;B17;A17) — на весь блок.
Блок минимума — те же формулы с МИН.""",
    ),
    dict(
        at=(6, 8),
        section="zapas-energii",
        title="Запас энергии",
        difficulty=3,
        minutes=12,
        instruction=JOINED,
        hint="Блок наименьшего расхода; ответы — МИН и МАКС по финальным клеткам.",
        files=[xlsx("18-8")],
        answer=joined(ds.energy(book("18-8"))[:2]),
        excel="""Блок наименьшего расхода, старт: =A1;
кандидат прихода слева: B17+ABS(C2-B2),
сверху: C16+ABS(C2-C1); клетка: МИН кандидатов,
закрытые клетки и отрезанные — «X».
Задание 1 — МИН по финальным клеткам,
задание 2 — МАКС по ним.""",
    ),
    # ------------------------------------------------------------ subtopic 7
    dict(
        at=(7, 1),
        section="nachislenie-i-perehod",
        title="Только чётные монеты",
        difficulty=2,
        minutes=4,
        instruction="Введите два числа через пробел: максимум, затем минимум.",
        hint="Клетка доступна, но её вклад 0, если число нечётное.",
        answer=f"{ds.best_table(field(TRAIN), max, gain=even_gain, first=lambda f, p: 0)[2][2]} "
        f"{ds.best_table(field(TRAIN), min, gain=even_gain, first=lambda f, p: 0)[2][2]}",
    ),
    dict(
        at=(7, 4),
        section="ostatok-energii",
        title="Запас 20 на поле 4 × 4",
        difficulty=3,
        minutes=5,
        instruction="Введите два числа через пробел: количество клеток, затем наибольшее число шагов.",
        hint="Достижимость — по таблице наименьшего расхода.",
        answer=" ".join(map(str, energy_reach(BASE, 20))),
    ),
    dict(
        at=(7, 5),
        section="harakteristika-marshruta",
        title="Нечётные клетки лучшего маршрута",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Восстановите маршрут по таблице максимума от финиша.",
        answer=str(sum(BASE.a[r][c] % 2 for r, c in best_route(BASE, ds.best_table(BASE, max)))),
    ),
    dict(
        at=(7, 6),
        section="cherez-kletku",
        title="Через клетку B3",
        difficulty=3,
        minutes=5,
        instruction="Введите два числа через пробел: наибольшую, затем наименьшую сумму.",
        hint="До B3 плюс от B3 до финиша минус монета B3, посчитанная дважды.",
        answer=f"{through(BASE, *B3, max)} {through(BASE, *B3, min)}",
    ),
    dict(
        at=(7, 7),
        section="proverka-prihoda",
        title="Чётность шага",
        difficulty=3,
        minutes=12,
        instruction=SPACED,
        hint="Каждый приход проверяйте отдельно: вправо — та же чётность, вниз — другая.",
        files=[xlsx("18-10")],
        answer=" ".join(map(str, ds.parity_steps(book("18-10")))),
        excel="""Вспомогательные блоки кандидатов, клетка B18:
слева: =ЕСЛИ(И(ЕЧИСЛО(A18);ОСТАТ(A2;2)=ОСТАТ(B2;2));
       A18+B2;"X")
сверху: то же с B17 и ОСТАТ(B1;2)<>ОСТАТ(B2;2);
по диагонали: =ЕСЛИ(ЕЧИСЛО(A17);A17+B2;"X").
Клетка: «X», если кандидатов нет, иначе МАКС.
Недостижимых: =СЧЁТЕСЛИ(блок;"X").""",
    ),
    # ------------------------------------------------------------ subtopic 8
    dict(
        at=(8, 1),
        section="ladya",
        title="Ладья в строке",
        difficulty=2,
        minutes=2,
        instruction="Введите два числа через пробел: сумму ладьи, затем робота.",
        hint="Ладья может остановиться на любой клетке правее.",
        answer=f"{rook([4, -9, 6, -2, 5])} {sum([4, -9, 6, -2, 5])}",
    ),
    dict(
        at=(8, 3),
        section="chislo-marshrutov",
        title="Маршруты на поле 5 × 5",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Число маршрутов клетки — сумма чисел предшественников.",
        answer=str(count_routes(field([[0] * 5 for _ in range(5)]))),
    ),
    dict(
        at=(8, 4),
        section="chislo-marshrutov",
        title="Маршруты со стенами",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Стена убирает слагаемое запрещённого прихода.",
        answer=str(count_routes(WALLS_3)),
    ),
    dict(
        at=(8, 5),
        section="chislo-marshrutov",
        title="Сколько лучших маршрутов",
        difficulty=2,
        minutes=2,
        instruction="Введите два числа через пробел: при равных кандидатах, затем при 31 сверху.",
        hint="Складывают количества только лучших приходов.",
        answer="5 1",
    ),
    dict(
        at=(8, 7),
        section="chislo-marshrutov",
        title="Маршруты по высотам",
        difficulty=3,
        minutes=10,
        instruction=SPACED,
        hint="Переход разрешён, если высоты различаются не больше чем на 50.",
        files=[xlsx("18-9")],
        answer=" ".join(map(str, ds.routes_and_cut_off(book("18-9"), 50))),
        excel="""Блок числа маршрутов, старт: 1;
клетка: =ЕСЛИ(ABS(B2-A2)<=50;A18;0)
        +ЕСЛИ(ABS(B2-B1)<=50;B17;0);
недостижимые клетки — с числом 0:
=СЧЁТЕСЛИ(блок;0).""",
    ),
    # ---------------------------------------------------- Практика и итог
    dict(
        at=(9, 1),
        title="Два запуска к разным финишам",
        difficulty=3,
        minutes=12,
        instruction=JOINED,
        hint="Две наибольшие и две наименьшие суммы «угловых» финишей.",
        files=[xlsx("18-3")],
        answer=joined(ds.runs_to_finishes(book("18-3"), 2)),
        excel=CORNERS.replace("МАКС и МИН", "суммы двух наибольших и\nдвух наименьших"),
    ),
    dict(
        at=(9, 2),
        title="Все «угловые» финиши",
        difficulty=3,
        minutes=12,
        instruction=JOINED,
        hint="Финиши — клетки, закрытые справа и снизу, включая правую нижнюю.",
        files=[xlsx("18-2")],
        answer=joined(ds.corners(book("18-2"))),
        excel=CORNERS,
    ),
    dict(
        at=(9, 3),
        title="Два старта",
        difficulty=3,
        minutes=12,
        instruction=JOINED,
        hint="Блок «к финишу» и два лучших результата стартов.",
        files=[xlsx("18-6")],
        answer=joined(ds.runs_from_starts(book("18-6"), 2)),
        excel="""Блок «к финишу», клетка: монета + МАКС(справа;
снизу), второй блок — с МИН. Ответ — сумма двух
наибольших и двух наименьших результатов стартов.""",
    ),
    dict(
        at=(9, 4),
        title="Диагонали на поле без стен",
        difficulty=2,
        minutes=8,
        instruction=JOINED,
        hint="Третий предшественник — клетка слева сверху.",
        files=[xlsx("18-1")],
        answer=joined(ds.diag(book("18-1"))),
        excel="""B18: =B2+МАКС(A18;B17;A17) — на весь блок,
блок минимума — то же с МИН. Ответ: O31 и O47.""",
    ),
    dict(
        at=(9, 5),
        title="Финиши при старте в углу",
        difficulty=3,
        minutes=12,
        instruction=JOINED,
        hint="Старт в углу: участвуют все «угловые» клетки.",
        files=[xlsx("18-4")],
        answer=joined(ds.corners(book("18-4"))),
        excel=CORNERS,
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 18, TASKS))
