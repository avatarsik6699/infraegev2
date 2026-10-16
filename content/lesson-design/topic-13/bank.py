"""Topic 13 bank tasks for the site lesson (Change 190, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-13/bank.py          # check only
    python3 -I content/lesson-design/topic-13/bank.py --write  # update the bank
    python3 -I content/lesson-design/topic-13/bank.py --checkpoints  # and site.checkpoints

The rules are those of ``scripts/lesson_design/topic_bank.py``. The lesson
counts programs by hand with a table and checks with Python in subtopic 6, so a
task gives its ``answer`` from the stand's own executor (``executor_figures``:
the table of counts with mandatory and forbidden numbers, the same command codes
as in the figures). A length or a memory of the last command is counted by a
small recursion over the states the lesson names.
``apps/api/tests/test_task_13_bank.py`` recomputes every answer independently.
"""

import re
import sys
from functools import cache
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
# figures registers the builders first: executor_figures imports it back
import figures as _builders  # noqa: E402, F401
from executor_figures import answer, apply  # noqa: E402
from topic_bank import NUMBER, THREE, TWO, inventory, main  # noqa: E402

UP = ["+1", "*2"]
TEXTS = inventory(HERE)
EXAM = "Исполнитель: сколько программ."


def exam(page: int, number: int, cmds) -> int:
    """An exam-format task: start, result, «содержит число», «не содержит числа» read from it."""
    text = " ".join(TEXTS[page][number][0].split())
    found = re.search(r"исходном числе (\d+) результатом является число (\d+)", text)
    assert found, text
    start, target = map(int, found.groups())
    must = tuple(int(x) for x in re.findall(r"(?<!не )содержит число (\d+)", text))
    forbid = tuple(int(x) for x in re.findall(r"не содержит числа (\d+)", text))
    return answer(start, target, cmds, must=must, forbid=forbid)


def run(start: int, program: str, cmds) -> int:
    x = start
    for c in program:
        y = apply(cmds[int(c) - 1], x)
        assert y is not None, (program, x)
        x = y
    return x


def exactly(start: int, target: int, cmds, length: int, must=None) -> int:
    """Programs of exactly ``length`` commands; ``must`` — a number on the way."""

    @cache
    def f(x: int, left: int, seen: bool) -> int:
        seen = seen or x == must
        if left == 0:
            return int(x == target and (must is None or seen))
        return sum(
            f(y, left - 1, seen) for op in cmds if (y := apply(op, x)) is not None and y <= target
        )

    return f(start, length, False)


def no_double(start: int, target: int) -> int:
    """«+1» and «×2» when «×2» may not follow «×2»."""

    @cache
    def f(x: int, last: str) -> int:
        if x == target:
            return 1
        if x > target:
            return 0
        return f(x + 1, "+") + (f(2 * x, "*") if last != "*" else 0)

    return f(start, "")


def reachable(start: int, steps: int) -> set[int]:
    found, level = {start}, {start}
    for _ in range(steps):
        level = {y for x in level for y in (x + 1, 2 * x)}
        found |= level
    return found


def buggy_table(start: int, target: int) -> int:
    """The table loop of subtopic 6 with «=» instead of «+=»."""
    dp = [0] * (target + 1)
    dp[start] = 1
    for x in range(start, target):
        for y in (x + 1, 2 * x):
            if y <= target:
                dp[y] = dp[x]
    return dp[target]


def groups(start: int, target: int, a: int, b: int, forbid=()) -> tuple[int, int, int]:
    """Programs through both a and b, through at least one, through exactly one."""
    both = answer(start, target, UP, must=(a, b), forbid=forbid)
    one = answer(start, target, UP, must=(a,), forbid=forbid)
    other = answer(start, target, UP, must=(b,), forbid=forbid)
    return both, one + other - both, one + other - 2 * both


def task(at, section, title, difficulty, minutes, hint, answer_, instruction=NUMBER, **extra):
    spec = dict(at=at, title=title, difficulty=difficulty, minutes=minutes)
    spec.update(instruction=instruction, hint=hint, answer=answer_, **extra)
    if section:
        spec["section"] = section
    return spec


TASKS = [
    # ------------------------------------------------------------ subtopic 1
    task(
        (1, 1),
        "traektoriya",
        "Результат программы 121",
        1,
        1,
        "Выполняйте команды по порядку.",
        run(3, "121", UP),
    ),
    task(
        (1, 2),
        "razlichnye-programmy",
        "Программы из 3 в 9",
        1,
        2,
        "Перечислите программы по числу умножений.",
        answer(3, 9, UP),
    ),
    task(
        (1, 3),
        "derevo-variantov",
        "Программы из 3 в 10",
        1,
        3,
        "Превысив 10, ветка безуспешна.",
        answer(3, 10, UP),
    ),
    task((1, 7), "derevo-variantov", "Из 1 в 9: +1 и ×3", 1, 3, EXAM, exam(1, 7, ["+1", "*3"])),
    # ------------------------------------------------------------ subtopic 2
    task(
        (2, 1),
        "ot-starta-k-celi",
        "Таблица от 2 до 8",
        1,
        2,
        "W(n) = W(n − 1) + W(n / 2).",
        answer(2, 8, UP),
    ),
    task(
        (2, 2),
        "tri-komandy",
        "Три команды: из 1 в 9",
        2,
        4,
        "У каждого числа до трёх вкладов.",
        answer(1, 9, ["+1", "+2", "*2"]),
    ),
    task(
        (2, 3),
        "nedostizhimye-chisla",
        "Из 1 в 15 и из 2 в 13",
        2,
        3,
        "Обе команды сохраняют чётность.",
        f"{answer(1, 15, ['+2', '*3'])} {answer(2, 13, ['+2', '*3'])}",
        TWO,
    ),
    task(
        (2, 4),
        "razreshennye-predshestvenniki",
        "Таблица до 16",
        2,
        3,
        "У нечётного числа один предшественник.",
        answer(1, 16, UP),
    ),
    task(
        (2, 5),
        "razreshennye-predshestvenniki",
        "Из 3 в 25: +1 и ×3",
        1,
        3,
        "Предшественник ×3 — только у кратных 3.",
        answer(3, 25, ["+1", "*3"]),
    ),
    task((2, 6), "ot-starta-k-celi", "Из 3 в 17", 1, 3, EXAM, exam(2, 6, UP)),
    task(
        (2, 7),
        "tri-komandy",
        "Из 2 в 14: три команды",
        2,
        4,
        EXAM,
        exam(2, 7, ["+1", "+2", "*3"]),
    ),
    # ------------------------------------------------------------ subtopic 3
    task(
        (3, 1),
        "razrez-po-obyazatelnomu",
        "Через 5",
        1,
        2,
        "Количества участков перемножают.",
        answer(2, 12, UP, must=(5,)),
    ),
    task(
        (3, 2),
        "proverka-vychitaniem",
        "Без 5",
        1,
        3,
        "Все программы минус программы через 5.",
        answer(2, 12, UP, forbid=(5,)),
    ),
    task(
        (3, 3),
        "obyazatelnoe-i-zapreshchennoe",
        "Через 6 без 9",
        2,
        3,
        "Запрет учитывают на обоих участках.",
        answer(2, 16, UP, must=(6,), forbid=(9,)),
    ),
    task(
        (3, 4),
        "neskolko-obyazatelnyh",
        "Через 4 и 8",
        1,
        3,
        "Три участка по порядку.",
        answer(2, 16, UP, must=(4, 8)),
    ),
    task(
        (3, 5),
        "zapret-po-svojstvu",
        "Без чисел, оканчивающихся на 7",
        2,
        3,
        "Обнулите 7 и 17.",
        answer(2, 20, UP, forbid=tuple(n for n in range(2, 21) if n % 10 == 7)),
    ),
    task(
        (3, 6),
        "razrez-po-obyazatelnomu",
        "Из 1 в 20 через 10",
        1,
        3,
        EXAM,
        exam(3, 6, UP),
    ),
    task(
        (3, 7),
        "obyazatelnoe-i-zapreshchennoe",
        "Из 3 в 30 через 12 без 20",
        2,
        4,
        EXAM,
        exam(3, 7, UP),
    ),
    # ------------------------------------------------------------ subtopic 4
    task(
        (4, 1),
        "sostavnaya-komanda",
        "Команда 2x + 1",
        2,
        3,
        "Предшественник (n − 1) / 2 только у нечётного n.",
        answer(1, 13, ["+1", "2x+1"], forbid=(8,)),
    ),
    task(
        (4, 2),
        "dopisat-cifru",
        "Дописать цифру 4",
        1,
        2,
        "Обратный переход — только у чисел на 4.",
        answer(1, 40, ["+1", "d4"]),
    ),
    task(
        (4, 3),
        "kvadrat",
        "Квадрат",
        1,
        2,
        "Предшественник квадрата — только у точного квадрата.",
        answer(2, 20, ["+1", "^2"]),
    ),
    task(
        (4, 4),
        "predshestvennik-iz-ravenstva",
        "Команда 3x + 2",
        2,
        3,
        "p = (n − 2) / 3 при делимости.",
        answer(1, 30, ["+1", "3x+2"]),
    ),
    task(
        (4, 5),
        "uslovnaya-komanda",
        "Перестановка цифр: из 12 в 45",
        2,
        4,
        "Перестановка возможна, только если десятков меньше.",
        answer(12, 45, ["+1", "swap"]),
    ),
    task((4, 6), "uslovnaya-komanda", "Перестановка цифр", 2, 4, EXAM, exam(4, 6, ["+1", "swap"])),
    task(
        (4, 7),
        "uslovnaya-komanda",
        "Из 101 в 135",
        2,
        4,
        "Сотни не меняются.",
        answer(101, 135, ["+1", "swap"]),
    ),
    # ------------------------------------------------------------ subtopic 5
    task(
        (5, 1),
        "tablica-vniz",
        "Точное деление: из 12 в 2",
        1,
        3,
        "Таблица сверху вниз.",
        answer(12, 2, ["-1", "/2"]),
    ),
    task(
        (5, 2),
        "okruglenie-vniz",
        "Деление нацело: из 12 в 2",
        2,
        3,
        "Предшественники 2n и 2n + 1.",
        answer(12, 2, ["-1", "//2"]),
    ),
    task(
        (5, 3),
        "okruglenie-vverh",
        "Деление с округлением вверх",
        2,
        3,
        "Предшественники 2n − 1 и 2n.",
        answer(12, 2, ["-1", "ceil/2"]),
    ),
    task(
        (5, 4),
        "vetvlenie-v-komande",
        "Команда с ветвлением",
        2,
        4,
        "Ветвь выбирается по текущему числу.",
        answer(16, 2, ["-1", "b:/2|-3"]),
    ),
    task(
        (5, 5),
        "okruglenie-vniz",
        "Вычесть 2 и разделить нацело",
        2,
        3,
        "Таблица от 25 вниз.",
        answer(25, 4, ["-2", "//2"]),
    ),
    task(
        (5, 6),
        "zaprety-pri-ubyvanii",
        "Из 20 в 3 через 9",
        2,
        4,
        EXAM,
        exam(5, 6, ["-1", "//2"]),
    ),
    task((5, 7), "okruglenie-vniz", "Деление нацело на 3", 2, 4, EXAM, exam(5, 7, ["-1", "//3"])),
    # ------------------------------------------------------------ subtopic 6
    task(
        (6, 2),
        "rekursiya-f-x-y",
        "Вывод f(2, 8)",
        1,
        2,
        "Совпадает с таблицей подтемы 2.",
        answer(2, 8, UP),
    ),
    task(
        (6, 3),
        "obyazatelnye-i-zapreshchennye-v-kode",
        "Порядок проверок",
        2,
        3,
        "Запрещённая цель принята за успех.",
        answer(2, 6, UP),
    ),
    task(
        (6, 4),
        "tablichnyj-cikl",
        "Присваивание вместо прибавления",
        2,
        3,
        "Каждое присваивание стирает прежние вклады.",
        buggy_table(2, 12),
    ),
    task(
        (6, 5),
        "vhodyashchie-perehody",
        "Три команды: из 1 в 10",
        2,
        3,
        "Три входящих перехода.",
        answer(1, 10, ["+1", "+2", "*2"]),
    ),
    task(
        (6, 6),
        "ubyvanie-v-kode",
        "Деление нацело программой",
        2,
        3,
        "Делить можно любое число.",
        answer(12, 2, ["-1", "//2"]),
    ),
    task(
        (6, 7),
        "obyazatelnye-i-zapreshchennye-v-kode",
        "Из 2 в 40 через 10 без 25",
        2,
        4,
        "Запрет проверяют до x == y.",
        answer(2, 40, UP, must=(10,), forbid=(25,)),
    ),
    # ------------------------------------------------------------ subtopic 7
    task(
        (7, 1),
        "i-ili-rovno-odno",
        "Через оба, хотя бы одно, ровно одно",
        2,
        3,
        "Ровно одно — сумма минус два пересечения.",
        " ".join(map(str, groups(2, 6, 3, 4))),
        THREE,
    ),
    task(
        (7, 2),
        "tolko-pribavleniya",
        "Прибавления: из 2 в 11",
        2,
        3,
        "Выберите места для команд «+3».",
        answer(2, 11, ["+1", "+3"]),
    ),
    task(
        (7, 4),
        "ne-oba",
        "Хотя бы одно, ровно одно, не оба",
        2,
        4,
        "«Не оба» — все минус через оба.",
        " ".join(map(str, (lambda g: (g[1], g[2], answer(2, 12, UP) - g[0]))(groups(2, 12, 4, 8)))),
        THREE,
    ),
    task(
        (7, 5),
        "i-ili-rovno-odno",
        "Через 6 или 8 без 15",
        3,
        5,
        "Общий запрет — на всех участках.",
        groups(2, 20, 6, 8, forbid=(15,))[1],
    ),
    task(
        (7, 6),
        "tolko-pribavleniya",
        "Прибавления: из 1 в 15",
        2,
        3,
        "Число команд «+3» от 0 до 4.",
        answer(1, 15, ["+1", "+3"]),
    ),
    task(
        (7, 7),
        "obratnyj-vopros",
        "Цели с ровно 20 программами",
        2,
        4,
        "Посчитайте таблицу во всём диапазоне.",
        " ".join(str(n) for n in range(1, 26) if answer(1, n, UP) == 20),
        "Введите все такие цели через пробел в порядке возрастания.",
    ),
    # ------------------------------------------------------------ subtopic 8
    task(
        (8, 1),
        "zadannaya-dlina",
        "Ровно пять команд",
        2,
        4,
        "Состояние — число и оставшиеся команды.",
        f"{exactly(2, 12, UP, 5)} {exactly(2, 12, UP, 5, must=6)}",
        TWO,
        says=["Две программы", "через 6 — одна"],
    ),
    task(
        (8, 3),
        "zadannaya-dlina",
        "Ровно четыре команды",
        2,
        3,
        "Состояние (число, осталось).",
        exactly(2, 12, UP, 4),
    ),
    task(
        (8, 4),
        "zapret-povtora-podryad",
        "Без двух умножений подряд",
        2,
        4,
        "Состояние хранит последнюю команду.",
        no_double(1, 16),
    ),
    task(
        (8, 5),
        "skolko-chisel",
        "Достижимые числа за пять команд",
        2,
        4,
        "Считайте множество чисел, а не программы.",
        (lambda s: f"{len(s)} {min(n for n in range(2, 99) if n not in s)}")(reachable(2, 5)),
        TWO,
    ),
    task(
        (8, 6),
        "dlina-po-uchastkam",
        "Пять команд через 6",
        3,
        4,
        "Распределите длину между участками.",
        exactly(2, 12, UP, 5, must=6),
    ),
    # ---------------------------------------------------- «Практика и итог»
    task((9, 1), None, "Из 3 в 27", 1, 3, "Подтема 2.", exam(9, 1, UP)),
    task(
        (9, 2),
        None,
        "Из 2 в 15 через 8 без 11",
        2,
        5,
        "Подтема 3.",
        exam(9, 2, ["+1", "+2", "*2"]),
    ),
    task(
        (9, 3),
        None,
        "Из 13 в 70 с перестановкой",
        2,
        5,
        "Подтема 4.",
        exam(9, 3, ["+1", "swap"]),
    ),
    task(
        (9, 4),
        None,
        "Из 30 в 3 через 12",
        2,
        5,
        "Подтема 5.",
        exam(9, 4, ["-1", "//2"]),
    ),
    task(
        (9, 5),
        None,
        "Из 1 в 29 без 9",
        2,
        4,
        "Подтемы 2, 3.",
        exam(9, 5, ["+2", "*3"]),
    ),
]


if __name__ == "__main__":
    sys.exit(main(HERE, 13, TASKS))
