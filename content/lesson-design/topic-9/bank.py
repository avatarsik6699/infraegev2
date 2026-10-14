"""Topic 9 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-9/bank.py          # check only
    python3 -I content/lesson-design/topic-9/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. A task on a
table attaches it twice: as the exam book ``.xlsx`` and as the text file the
lesson's programs read. ``apps/api/tests/test_task_9_bank.py`` recomputes every
answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import MAX_CODE_LINE, NUMBER, THREE, TWO, main  # noqa: E402

XLSX = "Таблица чисел — Excel-файл, как на экзамене"
TXT = "Та же таблица текстом: строка файла — строка таблицы, числа через пробел"
TRAIN = "Учебная таблица подтемы 1: шесть строк по шесть чисел"


def table(name: str) -> list[tuple[str, str]]:
    return [(f"{name}.xlsx", XLSX), (f"{name}.txt", TXT)]


def count(file: str, condition: str, prelude: str = "", head: str = "") -> str:
    """The lesson's program: read the file row by row, count the rows that pass."""
    body = "".join(f"        {line}\n" for line in prelude.strip("\n").split("\n") if line)
    if len(f"        if {condition}:") > MAX_CODE_LINE:
        parts = condition.split(" and ")
        condition = (
            "(\n"
            + "\n".join(f"            {'and ' if k else ''}{part}" for k, part in enumerate(parts))
            + "\n        )"
        )
    return (
        head
        + f"""answer = 0
with open("{file}") as f:
    for line in f:
        a = [int(part) for part in line.split()]
{body}        if {condition}:
            answer += 1
print(answer)"""
    )


COUNTER = "from collections import Counter\n\n"
GROUPS = """counts = Counter(a)
repeated = [x for x in a if counts[x] > 1]
single = [x for x in a if counts[x] == 1]
shape = sorted(counts.values())"""

# (subtopic, number in the subtopic file) -> task definition.
# section: the step the task trains (theory link); none on the final page.
# file: the table the task reads; "9.txt" is the training table of subtopic 1.
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 4),
        section="bukvalnyj-perevod",
        title="«Не меньше» и «больше»",
        difficulty=1,
        minutes=3,
        instruction=TWO,
        hint="«Не меньше 34» допускает сумму, равную 34, «больше 34» — нет.",
        files=[("9.txt", TRAIN)],
        code="""at_least = 0
greater = 0
with open("9.txt") as f:
    for line in f:
        a = [int(part) for part in line.split()]
        if sum(a) >= 34:
            at_least += 1
        if sum(a) > 34:
            greater += 1
print(at_least, greater)""",
    ),
    dict(
        at=(1, 5),
        section="chto-schitaem",
        title="Числа и строки",
        difficulty=1,
        minutes=3,
        instruction=TWO,
        hint="Подходящее число учитывается каждое, а строка — один раз, сколько бы в ней ни "
        "было подходящих чисел.",
        files=[("9.txt", TRAIN)],
        says=("Три числа", "одна строка"),
        code="""numbers = 0
rows = 0
with open("9.txt") as f:
    for line in f:
        a = [int(part) for part in line.split()]
        big = [x for x in a if x > 20]
        numbers += len(big)
        if len(big) > 0:
            rows += 1
print(numbers, rows)""",
    ),
    dict(
        at=(1, 7),
        section="neskolko-uslovij",
        title="Сумма и наибольшее число",
        difficulty=1,
        minutes=5,
        instruction=NUMBER,
        hint="Оба условия должны выполняться для одной строки: соедините их через «и».",
        files=table("9-1"),
        code=count("9-1.txt", "sum(a) > 300 and max(a) < 90"),
    ),
    dict(
        at=(1, 8),
        section="neskolko-uslovij",
        title="Ровно одно из двух условий",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="«Ровно одно» — результаты двух проверок различны; «или» засчитало бы и строки, "
        "где выполнены оба условия.",
        files=table("9-1"),
        code=count("9-1.txt", "(max(a) > 95) != (min(a) < 5)"),
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 2),
        section="povtory-krajnih",
        title="Сумма остальных при повторах",
        difficulty=1,
        minutes=3,
        instruction=TWO,
        hint="S − m − M убирает по одному экземпляру минимума и максимума, а не все равные им "
        "числа.",
        code="""a = [3, 3, 8, 10, 10]
rest = sum(a) - min(a) - max(a)
middle = [x for x in a if x != min(a) and x != max(a)]
print(rest, sum(middle))""",
    ),
    dict(
        at=(2, 3),
        section="vtoroe-po-velichine",
        title="Второе по величине",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Упорядочите строку: повторяющееся число занимает два места.",
        code="""a = [4, 9, 9, 6]
b = sorted(a)
print(b[-2], b[1])""",
    ),
    dict(
        at=(2, 4),
        section="kvadrat-summy",
        title="Квадрат суммы и сумма квадратов",
        difficulty=1,
        minutes=1,
        instruction=TWO,
        hint="Квадрат суммы: сначала сложить, потом возвести в квадрат.",
        code="print((3 + 6) ** 2, 3**2 + 6**2)",
    ),
    dict(
        at=(2, 7),
        section="kvadrat-summy",
        title="Квадрат суммы крайних",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Сумма квадратов остальных — сумма квадратов всей строки без квадратов "
        "наименьшего и наибольшего.",
        files=table("9-1"),
        code=count(
            "9-1.txt",
            "(m + big) ** 2 > squares - m**2 - big**2",
            "m = min(a)\nbig = max(a)\nsquares = sum(x**2 for x in a)",
        ),
    ),
    dict(
        at=(2, 8),
        section="srednie-bez-deleniya",
        title="Среднее крайних и среднее остальных",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Умножьте обе части сравнения на 4: деление не понадобится.",
        files=table("9-1"),
        code=count(
            "9-1.txt",
            "2 * (m + big) > sum(a) - m - big",
            "m = min(a)\nbig = max(a)",
        ),
    ),
    dict(
        at=(2, 9),
        section="srednie-bez-deleniya",
        title="Наибольшее и среднее остальных",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="M > 3 · (S − M) / 5 — то же, что 5M > 3(S − M).",
        files=table("9-1"),
        code=count("9-1.txt", "5 * max(a) > 3 * (sum(a) - max(a))"),
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 1),
        section="znachenie-i-poyavlenie",
        title="Значения и появления",
        difficulty=1,
        minutes=3,
        instruction=THREE,
        hint="Различные значения считают по одному разу, а сумму повторяющихся — по всем "
        "появлениям.",
        code="""a = [4, 4, 7, 9, 9, 9]
single = [x for x in a if a.count(x) == 1]
repeated = [x for x in a if a.count(x) > 1]
print(len(set(a)), *single, sum(repeated))""",
    ),
    dict(
        at=(3, 7),
        section="mnozhestvo",
        title="Все числа различны",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Все числа различны, если множество строки такого же размера, как сама строка.",
        files=table("9-2"),
        code=count(
            "9-2.txt",
            "len(set(a)) == len(a) and 2 * (m + big) <= rest",
            "m = min(a)\nbig = max(a)\nrest = sum(a) - m - big",
        ),
    ),
    dict(
        at=(3, 8),
        section="count",
        title="Наибольшее число — один раз",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Повторы в строке есть, если множество меньше строки; наибольшее единственно, "
        "если `a.count(max(a)) == 1`.",
        files=table("9-3"),
        code=count("9-3.txt", "len(set(a)) < len(a) and a.count(max(a)) == 1"),
    ),
    dict(
        at=(3, 9),
        section="counter",
        title="Структура 3 + 2 + 1 + 1",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Отсортированные частоты `Counter` описывают структуру повторов.",
        files=table("9-4"),
        code=count("9-4.txt", "sorted(Counter(a).values()) == [1, 1, 2, 3]", head=COUNTER),
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 6),
        section="polnaya-programma",
        title="Среднее повторяющихся меньше",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Нужны обе группы; средние сравните произведениями сумм на количества.",
        files=[("9.txt", TRAIN)],
        code=count(
            "9.txt",
            "repeated and single and smaller",
            "repeated = [x for x in a if a.count(x) > 1]\n"
            "single = [x for x in a if a.count(x) == 1]\n"
            "smaller = (\n"
            "    sum(repeated) * len(single)\n"
            "    < sum(single) * len(repeated)\n"
            ")",
        ),
    ),
    dict(
        at=(4, 7),
        section="celoe-reshenie",
        title="Тройка и три одиночных",
        difficulty=2,
        minutes=7,
        instruction=NUMBER,
        hint="Сначала структура [1, 1, 1, 3], затем 3 · (повторяющееся) ≥ сумма одиночных.",
        files=table("9-3"),
        code=count(
            "9-3.txt",
            "shape == [1, 1, 1, 3] and 3 * repeated[0] >= sum(single)",
            GROUPS,
            head=COUNTER,
        ),
    ),
    dict(
        at=(4, 8),
        section="snachala-struktura",
        title="Наименьшие двух групп",
        difficulty=2,
        minutes=7,
        instruction=NUMBER,
        hint="Пока структура не проверена, групп может и не быть: проверяйте её первой.",
        files=table("9-4"),
        code=count(
            "9-4.txt",
            "shape == [1, 1, 2, 3] and min(repeated) > min(single)",
            GROUPS,
            head=COUNTER,
        ),
    ),
    dict(
        at=(4, 9),
        section="razlichnye-povtory",
        title="Различные повторяющиеся значения",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="«Без учёта повторений» — каждое повторяющееся значение один раз: `set(repeated)`.",
        files=table("9-3"),
        code=count(
            "9-3.txt",
            "shape == [1, 1, 2, 2] and sum(set(repeated)) > sum(single)",
            GROUPS,
            head=COUNTER,
        ),
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="ostatok",
        title="Остатки в Python",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="В Python остаток от деления на положительное число всегда неотрицателен.",
        code="print(23 % 4, -7 % 2, 0 % 2)",
    ),
    dict(
        at=(5, 7),
        section="chetnye-i-nechetnye",
        title="Чётных больше, сумма нечётных больше",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Соберите чётные и нечётные в два списка: сравниваются и их длины, и суммы.",
        files=table("9-5"),
        code=count(
            "9-5.txt",
            "len(even) > len(odd) and sum(odd) > sum(even)",
            "even = [x for x in a if x % 2 == 0]\nodd = [x for x in a if x % 2 != 0]",
        ),
    ),
    dict(
        at=(5, 8),
        section="vyshe-srednego",
        title="Заметные числа",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Число больше среднего, если n · x > S. Количества сравнивают среди заметных, "
        "суммы — по всем числам строки.",
        files=table("9-5"),
        code=count(
            "9-5.txt",
            "len(odd_big) > len(even_big) and sum(even) > sum(odd)",
            "n = len(a)\ns = sum(a)\n"
            "even = [x for x in a if x % 2 == 0]\n"
            "odd = [x for x in a if x % 2 != 0]\n"
            "even_big = [x for x in even if n * x > s]\n"
            "odd_big = [x for x in odd if n * x > s]",
        ),
    ),
    dict(
        at=(5, 9),
        section="celaya-chast-srednego",
        title="Целая часть среднего и квадрат",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Целая часть среднего натуральных чисел — `sum(a) // len(a)`; x — квадрат, если "
        "`isqrt(x) ** 2 == x`.",
        files=table("9-6"),
        code=count(
            "9-6.txt",
            "sum(a) // len(a) in a and len(squares) > 0",
            "squares = [x for x in a if isqrt(x) ** 2 == x]",
            head="from math import isqrt\n\n",
        ),
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 4),
        section="sposob-otveta",
        title="Первая, последняя и сумма номеров",
        difficulty=2,
        minutes=4,
        instruction="Введите четыре числа через пробел в том порядке, в каком их спрашивают.",
        hint="Сравнение `>` оставляет первую из равных строк, `>=` — последнюю.",
        code="""rows = [(3, 50), (7, 80), (10, 80)]
first = None
last = None
best = 0
for number, s in rows:
    if first is None or s > best:
        first = number
        best = s
for number, s in rows:
    if last is None or s >= best:
        last = number
print(first, last, sum(n for n, s in rows), rows[-1][1])""",
    ),
    dict(
        at=(6, 5),
        section="modul",
        title="Модуль минимума и минимум модулей",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Модуль берут в том месте, где его называет условие: от минимума или от каждого "
        "числа.",
        code="""a = [-5, -9, 2]
print(abs(min(a)), min(abs(x) for x in a))""",
    ),
    dict(
        at=(6, 7),
        section="sortirovannaya-kopiya",
        title="Арифметическая прогрессия",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Упорядочьте копию строки и сравните соседние разности.",
        files=table("9-7"),
        code=count(
            "9-7.txt",
            "len(set(a)) == 4 and b[1] - b[0] == b[2] - b[1] == b[3] - b[2]",
            "b = sorted(a)",
        ),
    ),
    dict(
        at=(6, 8),
        section="dve-pary",
        title="Две пары, но не прогрессия",
        difficulty=2,
        minutes=7,
        instruction=NUMBER,
        hint="Пары с равными суммами есть, если сумма крайних равна сумме средних; каждая "
        "прогрессия под это подходит, её исключают.",
        files=table("9-7"),
        code=count(
            "9-7.txt",
            "b[0] + b[3] == b[1] + b[2] and not progression",
            "b = sorted(a)\nprogression = b[1] - b[0] == b[2] - b[1] == b[3] - b[2]",
        ),
    ),
    dict(
        at=(6, 9),
        section="summa-i-nomer",
        title="Наибольший номер строки",
        difficulty=2,
        minutes=7,
        instruction=NUMBER,
        hint="Запоминайте номер каждой подходящей строки: последний запомненный и будет "
        "наибольшим.",
        files=table("9-8"),
        code=COUNTER
        + """answer = 0
with open("9-8.txt") as f:
    for number, line in enumerate(f, start=1):
        a = [int(part) for part in line.split()]
        shape = sorted(Counter(a).values())
        if a == sorted(a) and shape == [1, 1, 1, 1, 3]:
            answer = number
print(answer)""",
    ),
    dict(
        at=(6, 10),
        section="modul",
        title="Первая подходящая строка",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Остановитесь на первой подходящей строке и возьмите модуль её наименьшего числа.",
        files=table("9-8"),
        code=COUNTER
        + """answer = None
with open("9-8.txt") as f:
    for line in f:
        a = [int(part) for part in line.split()]
        counts = Counter(a)
        pair = [x for x in counts if counts[x] == 2]
        single = [x for x in a if counts[x] == 1]
        shape = sorted(counts.values())
        if shape == [1, 1, 1, 1, 1, 2]:
            if sum(single) < pair[0]:
                answer = abs(min(a))
                break
print(answer)""",
    ),
    # ------------------------------------------------------------ subtopic 7
    dict(
        at=(7, 6),
        section="vid-po-uglam",
        title="Прямоугольный треугольник",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="После сортировки сравните сумму квадратов двух меньших с квадратом большего.",
        files=table("9-9"),
        code=count("9-9.txt", "b[0] ** 2 + b[1] ** 2 == b[2] ** 2", "b = sorted(a)"),
    ),
    dict(
        at=(7, 7),
        section="tupougolnyj",
        title="Тупоугольный треугольник",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Сравнения квадратов мало: сначала проверьте, что треугольник существует.",
        files=table("9-9"),
        code=count(
            "9-9.txt",
            "b[0] + b[1] > b[2] and b[0] ** 2 + b[1] ** 2 < b[2] ** 2",
            "b = sorted(a)",
        ),
    ),
    dict(
        at=(7, 8),
        section="tri-iz-chetyreh",
        title="Три из четырёх",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Хуже всего для треугольника две самые маленькие стороны и самая большая.",
        files=table("9-7"),
        code=count("9-7.txt", "b[0] + b[1] < b[3]", "b = sorted(a)"),
    ),
    dict(
        at=(7, 9),
        section="parallelepiped",
        title="Грани параллелепипеда",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Наибольшая грань — произведение двух больших рёбер.",
        files=table("9-9"),
        code=count("9-9.txt", "b[1] * b[2] > b[0] * b[1] + b[0] * b[2]", "b = sorted(a)"),
    ),
    # ------------------------------------------------------------ subtopic 8
    dict(
        at=(8, 1),
        section="oblast-podscheta",
        title="Появления в других строках",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Из всех появлений вычитают все появления в текущей строке.",
        code="print(23 - 4)",
    ),
    dict(
        at=(8, 2),
        section="poyavleniya-i-stroki",
        title="Появления и строки",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Строка учитывается, если число в ней есть хотя бы раз.",
        code="""per_row = [2, 3, 0, 1]
print(sum(per_row), len([k for k in per_row if k > 0]))""",
    ),
    dict(
        at=(8, 4),
        section="sosedi",
        title="Сколько соседей у ячеек",
        difficulty=2,
        minutes=4,
        instruction=THREE,
        hint="Внутренние ячейки имеют 8 соседей, краевые — 5, угловые — 3.",
        code="""rows, cols = 4, 6
inner = (rows - 2) * (cols - 2)
corner = 4
edge = rows * cols - inner - corner
print(inner, edge, corner)""",
    ),
    dict(
        at=(8, 6),
        section="vse-dannye",
        title="Хорошие ячейки",
        difficulty=3,
        minutes=10,
        instruction=NUMBER,
        hint="Первым проходом посчитайте частоты каждого столбца, вторым проверьте ячейки.",
        files=table("9-10"),
        code=COUNTER
        + """table = []
with open("9-10.txt") as f:
    for line in f:
        table.append([int(part) for part in line.split()])
columns = [Counter(row[j] for row in table) for j in range(6)]
answer = 0
for a in table:
    counts = Counter(a)
    good = 0
    for j in range(6):
        x = a[j]
        if counts[x] == 1 and columns[j][x] - 1 >= 30:
            good += 1
    if good >= 2:
        answer += 1
print(answer)""",
    ),
    dict(
        at=(8, 7),
        section="urovni-proverki",
        title="Интересные ячейки",
        difficulty=3,
        minutes=10,
        instruction=NUMBER,
        hint="Появления в других строках — все появления в таблице минус появления в своей строке.",
        files=table("9-10"),
        code=COUNTER
        + """table = []
with open("9-10.txt") as f:
    for line in f:
        table.append([int(part) for part in line.split()])
everywhere = Counter(x for row in table for x in row)
answer = 0
for a in table:
    counts = Counter(a)
    found = 0
    for x in a:
        if counts[x] == 1 and everywhere[x] - counts[x] == 160:
            found += 1
    if found > 0:
        answer += 1
print(answer)""",
    ),
    dict(
        at=(8, 8),
        section="perebor-sosedej",
        title="Вершины таблицы",
        difficulty=3,
        minutes=12,
        instruction=NUMBER,
        hint="Меняйте индексы строки и столбца на −1, 0 и 1, пропуская саму ячейку и выход "
        "за край таблицы.",
        files=table("9-10"),
        code="""table = []
with open("9-10.txt") as f:
    for line in f:
        table.append([int(part) for part in line.split()])
n, m = len(table), len(table[0])
answer = 0
for i in range(n):
    found = False
    for j in range(m):
        x = table[i][j]
        if table[i].count(x) != 1:
            continue
        top = True
        for di in (-1, 0, 1):
            for dj in (-1, 0, 1):
                y, z = i + di, j + dj
                inside = 0 <= y < n and 0 <= z < m
                if inside and (di, dj) != (0, 0):
                    if table[y][z] > x:
                        top = False
        if top:
            found = True
    if found:
        answer += 1
print(answer)""",
    ),
    # --------------------------------------------------------- final page
    dict(
        at=(9, 1),
        title="Одна пара и четыре одиночных",
        difficulty=2,
        minutes=8,
        instruction=NUMBER,
        hint="Подтемы 3 и 4: структура [1, 1, 1, 1, 2]; «не больше» сравнивают без деления "
        "и с равенством.",
        files=table("9-3"),
        code=count(
            "9-3.txt",
            "shape == [1, 1, 1, 1, 2] and sum(single) <= 4 * sum(repeated)",
            GROUPS,
            head=COUNTER,
        ),
    ),
    dict(
        at=(9, 2),
        title="Два наибольших и остальные",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Подтема 2: два наибольших с учётом повторов — два последних числа "
        "упорядоченной строки.",
        files=table("9-1"),
        code=count(
            "9-1.txt",
            "sum(top) <= sum(a) - sum(top)",
            "top = sorted(a)[-2:]",
        ),
    ),
    dict(
        at=(9, 3),
        title="Номер последней подходящей строки",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Подтемы 3, 4 и 6: структура [1, 1, 1, 1, 3], средние без деления, номер "
        "запоминается в каждой подходящей строке.",
        files=table("9-4"),
        code=COUNTER
        + """answer = 0
with open("9-4.txt") as f:
    for number, line in enumerate(f, start=1):
        a = [int(part) for part in line.split()]
        counts = Counter(a)
        triple = [x for x in counts if counts[x] == 3]
        single = [x for x in a if counts[x] == 1]
        shape = sorted(counts.values())
        if shape == [1, 1, 1, 1, 3]:
            if 4 * triple[0] > sum(single):
                answer = number
print(answer)""",
    ),
    dict(
        at=(9, 4),
        title="Сумма чётных номеров",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Подтемы 3, 5 и 6: номер строки прибавляется, только если он чётный.",
        files=table("9-5"),
        code="""answer = 0
with open("9-5.txt") as f:
    for number, line in enumerate(f, start=1):
        a = [int(part) for part in line.split()]
        even = [x for x in a if x % 2 == 0]
        different = len(set(a)) == len(a)
        if different and len(even) == 4 and number % 2 == 0:
            answer += number
print(answer)""",
    ),
    dict(
        at=(9, 5),
        title="Сумма чисел последней строки",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Подтема 6: в ответе сумма чисел строки, а не её номер.",
        files=table("9-8"),
        code="""answer = 0
with open("9-8.txt") as f:
    for line in f:
        a = [int(part) for part in line.split()]
        if a == sorted(a) and len(set(a)) == len(a):
            answer = sum(a)
print(answer)""",
    ),
]


if __name__ == "__main__":
    sys.exit(main(HERE, 9, TASKS))
