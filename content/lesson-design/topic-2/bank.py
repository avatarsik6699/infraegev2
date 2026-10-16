"""Topic 2 bank tasks for the site lesson (Change 190, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-2/bank.py          # check only
    python3 -I content/lesson-design/topic-2/bank.py --write  # update the bank
    python3 -I content/lesson-design/topic-2/bank.py --checkpoints  # and site.checkpoints

The rules are those of ``scripts/lesson_design/topic_bank.py``. The lesson solves
by hand and checks with Python only in subtopics 5–6, so a task gives its
``answer``: the formula is read from the task's statement (¬ before ∧, ∨, →, ≡,
as on the exam) and its fragment from the statement's table; every order of the
columns is tried together with every filling of the rows, and the rows must turn
into different sets. ``apps/api/tests/test_task_2_bank.py`` recomputes every
answer independently, with the formulas written out as Python functions.
"""

import re
import subprocess
import sys
from itertools import permutations, product
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, TWO, inventory, main  # noqa: E402

ORDER = "Введите буквы переменных подряд, без пробелов, в порядке столбцов."
SETS = "Введите наборы через пробел в порядке возрастания, каждый — цифрами подряд."
TEXTS = inventory(HERE)
# lowest first: ≡, →, ∨, ∧; ¬ binds tightest
BINARY = [("≡", lambda a, b: int(a == b)), ("→", lambda a, b: int(not a or b))]
BINARY += [("∨", lambda a, b: a | b), ("∧", lambda a, b: a & b)]


def question(page: int, number: int) -> str:
    return TEXTS[page][number][0]


def parse(formula: str):
    """A formula of the lesson → a function of a dict of variables."""
    tokens = re.findall(r"[a-z]\d?|[¬∧∨→≡⊕↓()]", formula)
    pos = 0

    def level(k: int):
        nonlocal pos
        if k == len(BINARY):
            return atom()
        sign, op = BINARY[k]
        left = level(k + 1)
        while pos < len(tokens) and tokens[pos] == sign:
            pos += 1
            right = level(k + 1)
            left = (lambda f, g, o: lambda v: o(f(v), g(v)))(left, right, op)
        return left

    def atom():
        nonlocal pos
        token = tokens[pos]
        pos += 1
        if token == "¬":
            inner = atom()
            return lambda v: 1 - inner(v)
        if token == "(":
            inner = level(0)
            assert tokens[pos] == ")", formula
            pos += 1
            return inner
        return lambda v: v[token]

    fn = level(0)
    assert pos == len(tokens), formula
    return fn


def formula_of(text: str, name: str = "F") -> str:
    """The formula after «F =» or «задаётся выражением», up to the end of its sentence."""
    head = rf"(?:{name} = |{name} задаётся выражением )"
    found = re.search(head + r"([^.]+?)(?=\.\s|\. \(|\.$| и F2| равна| найди| при)", text)
    assert found, text[:80]
    return found.group(1)


def names_of(*formulas: str) -> str:
    """The variables in the lesson's order of sets: x, y, z, w, then a, b, c…"""
    found = set(re.findall(r"\b[a-z]\b", " ".join(formulas)))
    return "".join(sorted(found, key=lambda v: ("xyzw".find(v) % 10, v)))


def fragment(text: str) -> list[tuple[str, tuple]]:
    """Rows of the statement's table: (pattern of 0, 1, *), (values of F…)."""
    lines = [x.strip() for x in text.split("\n") if x.strip().startswith("|")]
    head = [c.strip() for c in lines[0].strip("|").split("|")]
    rows = []
    for line in lines[2:]:
        cells = [c.strip().replace("\\*", "*") for c in line.strip("|").split("|")]
        named = dict(zip(head, cells, strict=True))
        pattern = "".join(named[h] for h in head if h.startswith("C"))
        values = tuple(
            None if named[h] == "?" else int(named[h]) for h in head if h.startswith("F")
        )
        rows.append((pattern, values))
    return rows


def orders(fns, names: str, rows) -> str:
    """The one order of the columns that turns the rows into different sets."""
    found = set()
    for order in permutations(names):
        candidates = []
        for pattern, wanted in rows:
            fits = []
            for bits in product((0, 1), repeat=len(names)):
                if any(p != "*" and int(p) != b for p, b in zip(pattern, bits, strict=True)):
                    continue
                v = dict(zip(order, bits, strict=True))
                if all(w is None or f(v) == w for f, w in zip(fns, wanted, strict=True)):
                    fits.append(bits)
            candidates.append(fits)
        if any(len(set(pick)) == len(pick) for pick in product(*candidates)):
            found.add("".join(order))
    assert len(found) == 1, found
    return found.pop()


def columns(page: int, number: int) -> str:
    text = question(page, number)
    formulas = [formula_of(text, n) for n in ("F1", "F2")] if "F1 =" in text else [formula_of(text)]
    return orders([parse(f) for f in formulas], names_of(*formulas), fragment(text))


def sets(formula: str, wanted: int) -> str:
    fn, names = parse(formula), names_of(formula)
    return " ".join(
        "".join(map(str, bits))
        for bits in product((0, 1), repeat=len(names))
        if fn(dict(zip(names, bits, strict=True))) == wanted
    )


def printed_lines(page: int, number: int) -> int:
    """How many lines the program of the statement prints."""
    code = re.search(r"```python\n(.*?)```", question(page, number), re.S)
    assert code
    lines = [x[3:] if x.startswith("   ") else x for x in code.group(1).split("\n")]
    done = subprocess.run(
        [sys.executable, "-I", "-c", "\n".join(lines)], capture_output=True, text=True, check=True
    )
    return len(done.stdout.splitlines())


def nor(a: int, b: int) -> int:
    return int(not (a or b))


def task(at, section, title, difficulty, minutes, instruction, hint, answer, **extra):
    spec = dict(at=at, title=title, difficulty=difficulty, minutes=minutes)
    spec.update(instruction=instruction, hint=hint, answer=answer, **extra)
    if section:
        spec["section"] = section
    return spec


TASKS = [
    # ------------------------------------------------------------ subtopic 1
    task(
        (1, 3),
        "implikaciya",
        "Стрелки при A = B = 1",
        1,
        1,
        "Введите четыре значения через пробел в порядке вопроса.",
        "Запрещённая пара стрелки — 1 → 0.",
        " ".join(str(parse(f)({"a": 1, "b": 1})) for f in ("a → b", "b → a", "a ≡ b", "¬a ∨ b")),
    ),
    task(
        (1, 5),
        "dizyunkciya",
        "И ложно, ИЛИ истинно",
        1,
        2,
        "Введите пары AB через пробел в порядке возрастания, каждую — цифрами подряд.",
        "Нужен хотя бы один ноль и хотя бы одна единица.",
        " ".join(f"{a}{b}" for a, b in product((0, 1), repeat=2) if not (a and b) and (a or b)),
    ),
    task(
        (1, 7),
        "konyunkciya",
        "Подписи столбцов для ¬x ∧ y",
        1,
        2,
        ORDER,
        "Найдите единственный набор, где F = 1.",
        orders([parse("¬x ∧ y")], "xy", [("10", (1,))]),
    ),
    task(
        (1, 8),
        "dizyunkciya",
        "Подписи столбцов для x ∨ ¬y",
        1,
        2,
        ORDER,
        "ИЛИ ложно, только если ложны обе части.",
        orders([parse("x ∨ ¬y")], "xy", [("01", (0,))]),
    ),
    # ------------------------------------------------------------ subtopic 2
    task(
        (2, 5),
        "polnaya-tablica",
        "Строки таблицы пяти переменных",
        1,
        1,
        NUMBER,
        "Каждая переменная удваивает число наборов.",
        2 ** len("abcde"),
    ),
    task(
        (2, 6),
        "ot-f-k-vhodam",
        "Нули функции (x → y) ∨ ¬z",
        1,
        2,
        SETS,
        "ИЛИ ложно, только если обе части равны 0.",
        sets("(x → y) ∨ ¬z", 0),
    ),
    task(
        (2, 8),
        "ot-f-k-vhodam",
        "Нули функции четырёх переменных",
        2,
        4,
        SETS,
        "Внешнее ИЛИ требует трёх нулей.",
        sets(formula_of(question(2, 8)), 0),
    ),
    # ------------------------------------------------------------ subtopic 3
    task(
        (3, 3),
        "poryadok-ruchnogo-resheniya",
        "Порядок столбцов для (a ∨ b) ∧ (a → c)",
        2,
        4,
        ORDER,
        "Выпишите подходящие наборы и сравните число нулей.",
        columns(3, 3),
    ),
    task(
        (3, 7),
        "obshchaya-shapka",
        "Порядок столбцов: x, y, z",
        2,
        5,
        ORDER,
        "Строки должны стать разными наборами.",
        columns(3, 7),
    ),
    task(
        (3, 8),
        "obshchaya-shapka",
        "Порядок столбцов: три строки",
        2,
        5,
        ORDER,
        "Сколько раз каждая переменная равна 1?",
        columns(3, 8),
    ),
    # ------------------------------------------------------------ subtopic 4
    task(
        (4, 1),
        "cepochka-implikacij",
        "Цепочка под отрицанием",
        2,
        5,
        ORDER,
        "Внешнее отрицание: внутри цепочка истинна.",
        columns(4, 1),
    ),
    task(
        (4, 2),
        "cepochka-implikacij",
        "Единицы цепочки импликаций",
        1,
        2,
        SETS,
        "После первой единицы — только единицы.",
        sets("(x → y) ∧ (y → z)", 1),
    ),
    task(
        (4, 3),
        "cepochka-implikacij",
        "Две строки цепочки",
        2,
        4,
        ORDER,
        "Строки различаются только пропуском.",
        orders([parse("(x → y) ∧ (y → z)")], "xyz", [("*01", (1,)), ("*01", (1,))]),
    ),
    task(
        (4, 4),
        "raznye-znacheniya-f",
        "Порядок столбцов при разных F",
        2,
        5,
        ORDER,
        "Сверьте каждую строку со своим списком наборов.",
        columns(4, 4),
    ),
    task(
        (4, 5),
        "chetyre-peremennye",
        "Порядок столбцов: четыре переменные",
        3,
        6,
        ORDER,
        "Начните со столбца, где известно больше клеток.",
        columns(4, 5),
    ),
    task(
        (4, 6),
        "chetyre-peremennye",
        "Порядок столбцов: x, y, z, w",
        3,
        6,
        ORDER,
        "Найдите переменную, равную 0 во всех нулях F.",
        columns(4, 6),
    ),
    # ------------------------------------------------------------ subtopic 5
    task(
        (5, 3),
        "perebor-cherez-product",
        "Нули F программой",
        2,
        3,
        SETS,
        "Перебор наборов через product и проверка F == 0.",
        sets(formula_of(question(2, 8)), 0),
    ),
    task(
        (5, 4),
        "perebor-cherez-product",
        "Число единиц функции",
        2,
        3,
        NUMBER,
        "Посчитайте наборы с F = 1.",
        len(sets(formula_of(question(5, 4)), 1).split()),
    ),
    task(
        (5, 5),
        "vlozhennye-cikly",
        "Сколько строк напечатает программа",
        2,
        3,
        NUMBER,
        "Посмотрите, в теле какого цикла стоит print.",
        printed_lines(5, 5),
    ),
    task(
        (5, 7),
        "perebor-cherez-product",
        "Порядок столбцов: проверка программой",
        3,
        6,
        ORDER,
        "Программа печатает нулевые наборы.",
        columns(5, 7),
    ),
    task(
        (5, 8),
        "perebor-cherez-product",
        "Порядок столбцов: три множителя",
        3,
        6,
        ORDER,
        "Выпишите единичные наборы программой.",
        columns(5, 8),
    ),
    # ------------------------------------------------------------ subtopic 6
    task(
        (6, 2),
        "neznakomyj-znak",
        "Стрелка Пирса",
        2,
        2,
        NUMBER,
        "Сначала внутренняя скобка.",
        nor(0, nor(0, 1)),
    ),
    task(
        (6, 4),
        "dva-urovnya-perebora",
        "Совместные варианты перебора",
        2,
        3,
        TWO,
        "Варианты строк перемножаются, затем — на число порядков.",
        f"{(2 * 2) ** 3} {(2 * 2) ** 3 * len(list(permutations('xyzw')))}",
    ),
    task(
        (6, 5),
        "dve-funkcii",
        "Две функции: порядок столбцов",
        3,
        6,
        ORDER,
        "Где F2 = 0, известны x и z.",
        columns(6, 5),
    ),
    task(
        (6, 6),
        "dve-funkcii",
        "Две функции: три строки",
        3,
        6,
        ORDER,
        "Каждая строка должна подойти обеим функциям.",
        columns(6, 6),
    ),
    # ---------------------------------------------------- «Практика и итог»
    task(
        (7, 1),
        None,
        "Порядок столбцов: подтема 3",
        2,
        4,
        ORDER,
        "Подтема 3: сколько раз переменная равна 1.",
        columns(7, 1),
    ),
    task(
        (7, 2),
        None,
        "Порядок столбцов: цепочка",
        2,
        4,
        ORDER,
        "Подтема 4: цепочка импликаций.",
        columns(7, 2),
    ),
    task(
        (7, 3),
        None,
        "Порядок столбцов: нули F",
        3,
        6,
        ORDER,
        "Подтемы 2–4: наборы с F = 0 и совместный выбор.",
        columns(7, 3),
    ),
    task(
        (7, 4),
        None,
        "Порядок столбцов: шаблоны строк",
        3,
        6,
        ORDER,
        "Подтемы 3–4: одинаковые шаблоны строк.",
        columns(7, 4),
    ),
    task(
        (7, 5),
        None,
        "Порядок столбцов: разные F",
        2,
        5,
        ORDER,
        "Подтема 4: разные значения F.",
        columns(7, 5),
    ),
]


if __name__ == "__main__":
    sys.exit(main(HERE, 2, TASKS))
