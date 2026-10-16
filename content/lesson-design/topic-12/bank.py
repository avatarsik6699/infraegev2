"""Topic 12 bank tasks for the site lesson (Change 190, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-12/bank.py          # check only
    python3 -I content/lesson-design/topic-12/bank.py --write  # update the bank
    python3 -I content/lesson-design/topic-12/bank.py --checkpoints  # and site.checkpoints

The rules are those of ``scripts/lesson_design/topic_bank.py``. The lesson
solves by hand and checks with Python only in subtopic 6, so a task gives its
``answer`` from the stand's own executor (``turing_figures.result``): the
tables of the subtopics are written as on the stand, a table of the final page
is read from the task's statement, and an inverse question tries every input.
``apps/api/tests/test_task_12_bank.py`` recomputes every answer independently.
"""

import re
import sys
from itertools import product
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
# figures registers the builders first: turing_figures imports it back
import figures as _builders  # noqa: E402, F401
from topic_bank import NUMBER, THREE, TWO, inventory, main  # noqa: E402
from turing_figures import result  # noqa: E402

TEXTS = inventory(HERE)
WORD = "Введите слово на ленте — цифры подряд, без пробелов."
SUB = "q0: λLq1 - -; q1: λSq1 1Lq1 0Sq1"
LEFT = "q0: λLq1 - -; q1: 1Lq2 0Lq1 1Lq1; q2: λSq2 - -"
RIGHT = "q0: λRq1 - -; q1: 1Sq1 0Rq1 1Rq1"
INV = "q0: λLq1 - -; q1: λSq1 1Lq1 0Lq1"
PLUS = "q0: λLq1 - -; q1: 1Sq1 1Sq1 0Lq1"
TOP = "q0: λLq1 - -; q1: λRq2 0Lq1 1Lq1; q2: - - 0Lq3; q3: 1Sq3 - -"
BLOCK = "q0: λRq1 - -; q1: 1Rq2 0Rq1 1Rq1; q2: 0Sq2 - -"
MIRROR = "q0: λRq1 - -; q1: λSq1 1Sq1 0Rq1"
PHASES = "q0: λRq1 - -; q1: 0Lq2 1Rq1 1Rq1; q2: 0Lq3 - 1Lq2; q3: 1Sq3 - -"
BOTH = "q0: λRq1 - -; q1: 1Lq2 0Rq1 1Rq1; q2: 1Sq2 0Lq2 1Lq2"
PARITY = "q0: 0Sq0 0Rq0 1Rq1; q1: 1Sq1 0Rq1 1Rq0"
CYCLE = ("q0: λLq1 - - -; q1: λSq1 2Lq1 0Lq1 1Lq1", "λ012")
SWAP = ("q0: λLq1 - - -; q1: λSq1 7Lq1 8Lq1 3Lq1", "λ369")


def question(page: int, number: int) -> str:
    return TEXTS[page][number][0]


def tape(word: str, table, start: str = "right") -> tuple[str, int]:
    """Word left on the tape and the number of steps."""
    table, alphabet = table if isinstance(table, tuple) else (table, "λ01")
    head = -1 if start == "left" else None
    text, steps, _ = result(word, table, head=head, alphabet=alphabet)
    return text, steps


def value(n: int, table, start: str = "right") -> int:
    return int(tape(f"{n:b}", table, start)[0], 2)


def statement_table(page: int, number: int) -> tuple[str, str]:
    """The program of a final-page task: its Markdown table → the stand's string."""
    lines = [x.strip() for x in question(page, number).split("\n") if x.strip().startswith("|")]
    head = [c.strip() for c in lines[0].strip("|").split("|")][1:]
    rows = []
    for line in lines[2:]:
        cells = [c.strip() for c in line.strip("|").split("|")]
        rows.append(
            f"{cells[0]}: " + " ".join("-" if c == "—" else c.replace(", ", "") for c in cells[1:])
        )
    return "; ".join(rows), "".join(head)


def start_of(page: int, number: int) -> str:
    return "left" if "ближайшей слева" in question(page, number) else "right"


def zeros(length: int, k: int, table, digit: str, start="right", canon=False) -> tuple[int, int]:
    """Fewest and most ``digit`` in an input of ``length`` giving ``k`` of them."""
    found = [
        w.count(digit)
        for w in ("".join(p) for p in product("01", repeat=length))
        if (not canon or w[0] == "1") and tape(w, table, start)[0].count(digit) == k
    ]
    return min(found), max(found)


REPLACE = {"5": "1", "7": "1", "9": "0"}


def alternating(n: int) -> tuple[int, int]:
    sums = [
        sum(map(int, w))
        for w in product("579", repeat=n)
        if all(REPLACE[w[i]] != REPLACE[w[i + 1]] for i in range(n - 1))
    ]
    return min(sums), max(sums)


def prime(x: int) -> bool:
    return x > 1 and all(x % d for d in range(2, int(x**0.5) + 1))


def swaps(limit: int):
    """Counts of 3, 6, 9 in an input of length n ≤ limit: (n, a, b, c)."""
    for n in range(1, limit + 1):
        for a in range(n + 1):
            for b in range(n + 1 - a):
                yield n, a, b, n - a - b


def swap_sum(a: int, b: int, c: int) -> int:
    """3 → 7, 6 → 8, 9 → 3: the sum of the result's digits."""
    return 7 * a + 8 * b + 3 * c


def task(at, section, title, difficulty, minutes, instruction, hint, answer, **extra):
    spec = dict(at=at, title=title, difficulty=difficulty, minutes=minutes)
    spec.update(instruction=instruction, hint=hint, answer=answer, **extra)
    if section:
        spec["section"] = section
    return spec


def final(n: int) -> tuple:
    return statement_table(8, n), start_of(8, n)


TASKS = [
    # ------------------------------------------------------------ subtopic 1
    task(
        (1, 3),
        "tablica-na-slove-10100",
        "Слово 10100: итог, головка, такты",
        1,
        3,
        "Введите итоговое слово, координату головки и число тактов через пробел.",
        "Остановочная запись тоже такт.",
        " ".join(map(str, (lambda r: (r[0], r[2], r[1]))(result("10100", SUB)))),
        says=["`10011`, координата 2, четыре такта"],
    ),
    task(
        (1, 5),
        "odin-takt",
        "Слово 1000",
        1,
        3,
        "Введите итоговое слово, его десятичное значение и число тактов через пробел.",
        "Хвост из нулей становится единицами.",
        f"{tape('1000', SUB)[0]} {int(tape('1000', SUB)[0], 2)} {tape('1000', SUB)[1]}",
        says=["`0111`, значение 7, пять тактов"],
    ),
    task(
        (1, 7),
        "nachalnoe-polozhenie",
        "Число 37 после программы",
        1,
        2,
        NUMBER,
        "Переведите 37 в двоичную запись.",
        value(37, SUB),
    ),
    task(
        (1, 8),
        "odin-takt",
        "Такты для числа 40",
        1,
        2,
        NUMBER,
        "Вход, хвост нулей, остановка.",
        tape(f"{40:b}", SUB)[1],
    ),
    # ------------------------------------------------------------ subtopic 2
    task(
        (2, 1),
        "kolichestva-simvolov",
        "Количества до замены",
        1,
        2,
        THREE,
        "Каждый конечный символ однозначно указывает исходный.",
        "2 4 1",
        says=["Два нуля, четыре единицы и одна двойка"],
    ),
    task(
        (2, 2),
        "nezavisimaya-zamena",
        "Замена в строке 0120",
        1,
        1,
        WORD,
        "Каждый символ меняется сам по себе.",
        tape("0120", CYCLE)[0],
    ),
    task(
        (2, 3),
        "uslovie-na-rezultat",
        "Наименьшая сумма при чередовании",
        2,
        3,
        NUMBER,
        "Нули дают только девятки.",
        alternating(6)[0],
    ),
    task(
        (2, 4),
        "kolichestva-simvolov",
        "Число исходных строк",
        2,
        2,
        NUMBER,
        "Единица могла быть пятёркой или семёркой.",
        sum(1 for w in product("579", repeat=5) if "".join(REPLACE[c] for c in w) == "11010"),
    ),
    task(
        (2, 5),
        "uslovie-na-vhod",
        "Наибольшая сумма при условии на вход",
        2,
        3,
        NUMBER,
        "Семёрок не больше, чем пятёрок.",
        max(f5 * 5 + (7 - f5) * 7 + 18 for f5 in range(8) if f5 >= 7 - f5),
    ),
    task(
        (2, 6),
        "summa-rezultata",
        "Наибольшее число двоек",
        2,
        4,
        NUMBER,
        "Выразите сумму результата через количества.",
        max(
            w.count("2")
            for w in ("".join(p) for p in product("012", repeat=10))
            if sum(map(int, tape(w, CYCLE)[0])) == 12
        ),
    ),
    task(
        (2, 7),
        "uslovie-na-rezultat",
        "Наибольшая сумма при чередовании",
        2,
        3,
        NUMBER,
        "Сравните два варианта чередования.",
        alternating(7)[1],
    ),
    # ------------------------------------------------------------ subtopic 3
    task(
        (3, 1),
        "pripisyvanie-sprava",
        "Единица справа",
        1,
        1,
        NUMBER,
        "Дописывание справа удваивает число.",
        value(37, RIGHT, "left"),
    ),
    task(
        (3, 2),
        "edinica-sleva",
        "Единица слева к слову 101",
        1,
        3,
        "Введите слово, его десятичное значение и число тактов через пробел.",
        "Головка проходит слово и пишет единицу слева.",
        f"{tape('101', LEFT)[0]} {int(tape('101', LEFT)[0], 2)} {tape('101', LEFT)[1]}",
        says=["1101, число 13, шесть тактов"],
    ),
    task(
        (3, 4),
        "pribavlenie-edinicy",
        "Прибавление единицы к 101111",
        1,
        2,
        "Введите слово и число тактов через пробел.",
        "Перенос идёт по хвосту из единиц.",
        " ".join(map(str, tape("101111", PLUS))),
        says=["110000 (48), шесть тактов"],
    ),
    task(
        (3, 5),
        "pripisyvanie-sprava",
        "Блок 10 справа",
        1,
        2,
        NUMBER,
        "Два разряда справа — умножение на 4.",
        value(45, BLOCK, "left"),
    ),
    task(
        (3, 6),
        "edinica-sleva",
        "Единица слева к числу 100",
        1,
        2,
        NUMBER,
        "Прибавляется 2ᵏ, k — число цифр.",
        value(100, LEFT),
    ),
    task(
        (3, 7),
        "zamena-starshego-razryada",
        "Смена старшего разряда",
        2,
        3,
        NUMBER,
        "Сначала заменяется старшая единица.",
        value(50, TOP),
    ),
    # ------------------------------------------------------------ subtopic 4
    task(
        (4, 2),
        "granica-i-primer",
        "Нули входа длины 12",
        2,
        4,
        TWO,
        "Нули результата — из P и из остановки.",
        " ".join(map(str, zeros(12, 5, SUB, "0"))),
    ),
    task(
        (4, 3),
        "vychitanie-edinicy",
        "Такты на слове 1000000",
        1,
        2,
        NUMBER,
        "Хвост из шести нулей.",
        tape("1000000", SUB)[1],
    ),
    task(
        (4, 4),
        "otkuda-nuli",
        "Нули входа длины 10",
        2,
        3,
        TWO,
        "Найдите пример для каждой границы.",
        " ".join(map(str, zeros(10, 1, SUB, "0"))),
    ),
    task(
        (4, 5),
        "osobye-sluchai",
        "Результат без нулей",
        1,
        2,
        NUMBER,
        "Без нулей результат бывает только у одного входа.",
        zeros(7, 0, SUB, "0")[0],
    ),
    task(
        (4, 6),
        "osobye-sluchai",
        "Без ведущих нулей",
        2,
        4,
        NUMBER,
        "Первая цифра — единица.",
        zeros(12, 5, SUB, "0", canon=True)[1],
    ),
    task(
        (4, 7),
        "zerkalnaya-tablica",
        "Зеркальная таблица: наибольшее",
        2,
        4,
        NUMBER,
        "Проход слева направо.",
        zeros(10, 4, MIRROR, "1", "left")[1],
    ),
    task(
        (4, 8),
        "zerkalnaya-tablica",
        "Зеркальная таблица: наименьшее",
        2,
        4,
        NUMBER,
        "Хвост может быть пустым.",
        zeros(10, 4, MIRROR, "1", "left")[0],
    ),
    # ------------------------------------------------------------ subtopic 5
    task(
        (5, 1),
        "rezultat-dlya-lyuboj-dliny",
        "Наибольший результат не больше 500",
        2,
        3,
        NUMBER,
        "Результат зависит только от длины.",
        max(v for v in (value(2**k - 1, PHASES, "left") for k in range(1, 9)) if v <= 500),
    ),
    task(
        (5, 2),
        "fazy-po-dejstviyam",
        "Такты на слове длины 5",
        2,
        3,
        NUMBER,
        "Сложите такты всех фаз.",
        tape("10110", PHASES, "left")[1],
    ),
    task(
        (5, 3),
        "sostoyanie-kak-pamyat",
        "Чётность слова 110",
        1,
        2,
        WORD,
        "Состояние помнит чётность единиц.",
        result("110", PARITY, head=0)[0],
    ),
    task(
        (5, 4),
        "sostoyanie-kak-pamyat",
        "Чётность слова 100110",
        1,
        2,
        WORD,
        "Три единицы — нечётно.",
        result("100110", PARITY, head=0)[0],
    ),
    task(
        (5, 5),
        "razryady-na-krayah",
        "Единицы слева и справа",
        2,
        3,
        NUMBER,
        "2ᵏ⁺¹ + 2N + 1.",
        value(13, BOTH, "left"),
    ),
    task(
        (5, 6),
        "rezultat-dlya-lyuboj-dliny",
        "Число 2027",
        2,
        3,
        NUMBER,
        "Важна только длина записи.",
        value(2027, PHASES, "left"),
    ),
    task(
        (5, 7),
        "razryady-na-krayah",
        "Наименьшее N: больше 1000",
        2,
        4,
        NUMBER,
        "Сравните длины записи.",
        next(n for n in range(1, 5000) if value(n, BOTH, "left") > 1000),
    ),
    # ------------------------------------------------------------ subtopic 6
    task(
        (6, 6),
        "proverka-formuly",
        "Расхождения инверсии",
        1,
        3,
        NUMBER,
        "Сравните результат машины с формулой.",
        sum(1 for n in range(1, 301) if value(n, INV) != 2 ** len(f"{n:b}") - 1 - n),
    ),
    task(
        (6, 7),
        "universalnaya-funkciya",
        "Единица слева к числу 1000",
        1,
        3,
        NUMBER,
        "Десять цифр — плюс 2¹⁰.",
        value(1000, LEFT),
    ),
    # ------------------------------------------------------------ subtopic 7
    task(
        (7, 2),
        "tri-kolichestva",
        "Вход по результату 7738",
        1,
        2,
        WORD,
        "Замена обратима: 7 ← 3, 8 ← 6, 3 ← 9.",
        "".join({"7": "3", "8": "6", "3": "9"}[c] for c in "7738"),
    ),
    task(
        (7, 3),
        "naimenshaya-summa",
        "Наименьшее S + N",
        2,
        4,
        NUMBER,
        "Граница плюс самый дешёвый символ.",
        min(swap_sum(a, b, c) + n for n, a, b, c in swaps(20) if min(a, b, c) >= 1 and a + c >= 6),
    ),
    task(
        (7, 4),
        "naibolshaya-summa",
        "Наибольшее S + N",
        2,
        4,
        NUMBER,
        "Заполните длину самыми дорогими символами.",
        max(swap_sum(a, b, c) + n for n, a, b, c in swaps(12) if a + c >= 4),
    ),
    task(
        (7, 5),
        "prostaya-summa",
        "Наименьшая длина с простой суммой",
        3,
        5,
        NUMBER,
        "Перебирайте длины по возрастанию.",
        min(
            n
            for n, a, b, c in swaps(20)
            if min(a, b, c) >= 1 and b % 2 == 1 and prime(swap_sum(a, b, c))
        ),
    ),
    task(
        (7, 6),
        "prostaya-summa",
        "Наибольшая простая сумма",
        3,
        5,
        NUMBER,
        "Проверьте простоту каждой допустимой суммы.",
        max(
            swap_sum(a, b, c)
            for n, a, b, c in swaps(8)
            if n == 8 and min(a, b, c) >= 1 and prime(swap_sum(a, b, c))
        ),
    ),
    # ---------------------------------------------------- «Практика и итог»
    task(
        (8, 1),
        None,
        "Программа на числе 45",
        2,
        4,
        NUMBER,
        "Подтемы 1, 3.",
        value(45, final(1)[0], final(1)[1]),
    ),
    task(
        (8, 2),
        None,
        "Такты на числе 95",
        2,
        4,
        NUMBER,
        "Подтемы 1, 3.",
        tape(f"{95:b}", final(2)[0], final(2)[1])[1],
    ),
    task(
        (8, 3),
        None,
        "Двойки исходной строки",
        2,
        4,
        NUMBER,
        "Подтема 2.",
        next(
            iter(
                {
                    w.count("2")
                    for w in ("".join(p) for p in product("012", repeat=10))
                    if sorted(tape(w, final(3)[0])[0]) == sorted("0000011122")
                }
            )
        ),
    ),
    task(
        (8, 4),
        None,
        "Наибольшее число нулей",
        3,
        5,
        NUMBER,
        "Подтема 4.",
        zeros(15, 6, final(4)[0], "0")[1],
    ),
    task(
        (8, 5),
        None,
        "Программа на числе 100",
        2,
        4,
        NUMBER,
        "Подтемы 3, 5.",
        value(100, final(5)[0], final(5)[1]),
    ),
]

assert all(re.fullmatch(r"[\d ]+", str(t["answer"])) for t in TASKS), "answers are digits"

if __name__ == "__main__":
    sys.exit(main(HERE, 12, TASKS))
