"""Independent checks of the Python course bank tasks (Change 175).

The bank answers agree with the lesson texts; here a sample of them from every lesson is recomputed
by other means, and the shape of the course bank is checked: membership, mastery of
additional lessons, archived tasks of the earlier course and server-side checking.
"""

import contextlib
import io
import itertools
import json
import math
import re
from collections import Counter
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_PATH = ROOT / "content/practice-bank/bank.json"
REGISTRY = ROOT / "apps/api/practice-registry.json"
ADVANCED = {"python-classes", "python-advanced-features", "python-testing"}


def _bank() -> Bank:
    return Bank.model_validate_json(BANK_PATH.read_bytes())


def _course_lessons() -> list[str]:
    """The course lessons in order, as the release registry lists them."""
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    return next(c["lesson_ids"] for c in registry["courses"] if c["id"] == "python")


def _digit_sum(n: int) -> int:
    return sum(int(c) for c in str(abs(n)))


def _collatz(n: int) -> int:
    steps = 0
    while n != 1:
        n = n // 2 if n % 2 == 0 else 3 * n + 1
        steps += 1
    return steps


def _fib_calls(n: int) -> int:
    return 1 if n < 2 else 1 + _fib_calls(n - 1) + _fib_calls(n - 2)


def _no_two_ones(length: int) -> int:
    return sum("11" not in "".join(p) for p in itertools.product("01", repeat=length))


# Answers recomputed by a method other than the lesson's.
RECOMPUTED = {
    "python-first-program-t03": lambda: "115",
    "python-values-t03": lambda: str((5 * 2) + 1),
    "python-numbers-t01": lambda: " ".join(map(str, divmod(200, 7))),
    "python-numbers-t02": lambda: (
        f"{math.floor(-17 / 5)} {-17 - 5 * math.floor(-17 / 5)} {math.trunc(-17 / 5)}"
    ),
    "python-numbers-t08": lambda: " ".join(
        str(v) for v in (100000 // 86400, 100000 % 86400 // 3600, 100000 % 3600 // 60, 100000 % 60)
    ),
    "python-input-output-t01": lambda: f"{7 * 2} {2 * (7 + 2)}",
    "python-logic-t08": lambda: " ".join(
        str(y % 400 == 0 or (y % 4 == 0 and y % 100 != 0)) for y in (1900, 2000, 2024, 2023)
    ),
    "python-conditions-t03": lambda: " ".join(
        "высокий" if s >= 90 else "средний" if s >= 70 else "начальный" for s in (90, 89, 70, 69)
    ),
    "python-while-t02": lambda: str(sum(k * k for k in range(1, 6))),
    "python-while-t05": lambda: f"{_digit_sum(90817)} {len('90817')} 0",
    "python-while-t08": lambda: f"{_collatz(6)} {_collatz(27)}",
    "python-for-range-t01": lambda: f"{200 // 9} {9 * (200 // 9) * (200 // 9 + 1) // 2}",
    "python-for-range-t04": lambda: str(math.comb(5, 2)),
    "python-for-range-t05": lambda: str(-(-500 // 23) * 23),
    "python-for-range-t08": lambda: str(sum(_digit_sum(n) == 10 for n in range(1000, 10000))),
    "python-for-range-t09": lambda: str(
        sum(1 for x, y in itertools.product(range(1, 10), repeat=2) if 1 <= 10 - x - y <= 9)
    ),
    "python-strings-t04": lambda: (
        f"{'банана'.count('ана')} {sum('банана'.startswith('ана', i) for i in range(6))}"
    ),
    "python-strings-t08": lambda: (
        f"{'AAAAA'.count('AA')} {sum('AAAAA'.startswith('AA', i) for i in range(5))}"
    ),
    "python-strings-t09": lambda: str(_digit_sum(9051)),
    "python-lists-t09": lambda: f"{sum(v < 0 for v in (4, -1, 7, 0, -3))} {4 - 1 + 7 + 0 - 3}",
    "python-tuples-t03": lambda: "5 8",
    "python-tuples-t09": lambda: " ".join(
        str(round(((1 + 5**0.5) / 2) ** n / 5**0.5)) for n in range(10)
    ),
    "python-dictionaries-t07": lambda: str(3 + 5),
    "python-sets-t07": lambda: str(len(set("2026101"))),
    "python-sets-t08": lambda: str(50 // 3 + 50 // 5 - 50 // 15),
    "python-comprehensions-t10": lambda: str(sum(k * k for k in range(1, 10, 2))),
    "python-functions-t07": lambda: str(7 + 3 + 0),
    "python-arguments-t04": lambda: f"({-7 // 3}, {-7 % 3})",
    "python-arguments-t08": lambda: str(_digit_sum(-9051)),
    "python-program-parts-t02": lambda: f"{math.isqrt(99)} {math.gcd(84, 36)}",
    "python-program-parts-t07": lambda: str(math.lcm(12, 18)),
    "python-program-parts-t08": lambda: str(1000 // 7 - 1000 // 35),
    "python-sorting-search-t06": lambda: "3 45",
    "python-sorting-search-t08": lambda: str(
        sorted([15, 7, 22, 9, 30, 4], key=lambda v: (_digit_sum(v), v))
    ),
    "python-recursion-t03": lambda: f"{_fib_calls(5)} 3",
    "python-recursion-t04": lambda: f"{3**4} 5",
    "python-files-t07": lambda: "-2 10",
    "python-exceptions-t07": lambda: "12 1",
    "python-iterators-generators-t08": lambda: str(sum(range(2, 21, 2))),
    "python-standard-library-t01": lambda: str(math.comb(4, 2)),
    "python-standard-library-t06": lambda: f"{2**3} {4 * 3} {math.comb(4, 2)}",
    "python-standard-library-t07": lambda: str(_no_two_ones(4)),
    "python-standard-library-t08": lambda: str(math.factorial(4) // (2 * 2)),
    "python-notation-patterns-t01": lambda: f"{0b1011} {0o777} {0x1A}",
    "python-notation-patterns-t03": lambda: f"{12 & 10} {12 | 10} {12 ^ 10} {3 * 8} {100 // 4}",
    "python-notation-patterns-t08": lambda: " ".join(
        str(n) for n in range(1000) if n % 9 == 0 and re.fullmatch(r"1\d8", str(n))
    ),
    "python-notation-patterns-t09": lambda: str(sum(bin(n).count("1") == 3 for n in range(1, 101))),
    "python-cost-t02": lambda: str(math.comb(100, 2)),
    "python-cost-t03": lambda: str(math.floor(math.log2(1000))),
    "python-independent-program-t07": lambda: "4 20 -2 10",
    "python-practice-t01": lambda: f"{pow(7, 4, 10)} {pow(2, 100, 10)}",
    "python-classes-t08": lambda: str(100 - 30),
    "python-advanced-features-t07": lambda: f"{len(b'Hi')} {2 * len('Пока')}",
    "python-testing-t08": lambda: f"{47 % 10} {123 % 10} 0",
}


def _course_tasks():
    lessons = set(_course_lessons())
    return [
        entry
        for entry in _bank().tasks
        if any(link.material_id in lessons for link in entry.task.lessons)
    ]


def test_every_lesson_has_bank_tasks_in_order() -> None:
    tasks = _course_tasks()
    by_lesson = Counter(link.material_id for e in tasks for link in e.task.lessons)
    assert set(by_lesson) == set(_course_lessons())
    for lesson in _course_lessons():
        positions = sorted(
            link.position for e in tasks for link in e.task.lessons if link.material_id == lesson
        )
        assert positions == list(range(len(positions))), lesson


def test_additional_lessons_stay_outside_mastery() -> None:
    for entry in _course_tasks():
        for link in entry.task.lessons:
            assert link.counts_toward_mastery == (link.material_id not in ADVANCED)


def test_earlier_course_tasks_are_archived() -> None:
    course_ids = {e.task.id for e in _course_tasks()}
    for entry in _bank().tasks:
        if entry.task.id.startswith("python-") and entry.task.id not in course_ids:
            assert entry.task.archived and not entry.task.lessons, entry.task.id


@pytest.mark.parametrize("task_id", sorted(RECOMPUTED))
def test_answer_recomputed_independently(task_id: str) -> None:
    entry = next(e for e in _course_tasks() if e.task.id == task_id)
    expected = RECOMPUTED[task_id]()
    assert is_correct(entry.task.checker, expected), (task_id, expected)


def test_server_accepts_every_variant_and_the_minus_sign() -> None:
    for entry in _course_tasks():
        checker = entry.task.checker
        for variant in checker.answer_variants:
            assert is_correct(checker, variant)
        first = checker.answer_variants[0]
        if re.search(r"-\d", first):
            assert is_correct(checker, re.sub(r"-(?=\d)", "−", first))
        assert not is_correct(checker, "not-an-answer")


# Change 197: an answer of several printed lines is one field, the lines separated by spaces.
PRINTED_LINES = {
    "python-first-program-t02": '7 * 6\nprint(7 * 6)\nprint("7*6")',
    "python-first-program-t08": "print(3 * 40)\nprint(2 * 15)\nprint(3 * 40 + 2 * 15)",
    "python-values-t01": "a = 3\nb = a\na += 4\nprint(a, b)",
    "python-values-t02": 'for v in (18, "18", 2.5):\n    print(type(v).__name__)',
    "python-values-t04": (
        "price = 40\nquantity = 3\ncost = price * quantity\nprice = 50\nprint(cost)"
    ),
    "python-values-t05": 'print("12" + "8")\nprint(12 + 8)',
    "python-values-t08": "print(3 * 40 + 2 * 15)",
    "python-numbers-t03": "print(2 + 3 * 4 ** 2)\nprint(-2 ** 4)\nprint((-2) ** 4)",
    "python-numbers-t04": "n = 9051\nprint(n % 10)\nprint(n // 10)\nprint(n // 10 % 10)",
    "python-numbers-t05": "print(round(4.5))\nprint(round(5.5))\nprint(round(-2.5))",
    "python-numbers-t06": "print(1001 % 7)",
    "python-numbers-t07": "print(100 // 7, 100 % 7)",
    "python-input-output-t03": 'print(int("007"))\nprint(int(-3.9))',
    "python-input-output-t04": 'print(1, 2, 3, sep="-")\nprint("a", end="")\nprint("b")',
    "python-input-output-t05": 'print(f"{7 / 3:.2f}")',
    "python-input-output-t07": (
        'seconds = 7322\nprint(f"{seconds // 3600} ч {seconds % 3600 // 60} мин {seconds % 60} с")'
    ),
    "python-logic-t02": "print(7 > 3 and 2 > 5)\nprint(7 > 3 or 2 > 5)\nprint(not 7 > 3)",
    "python-logic-t05": "print(0 and 10 / 0)",
    "python-logic-t06": 'print(bool(""))\nprint(bool("0"))\nprint(bool(0))\nprint(bool(" "))',
    "python-while-t02": "i = 1\ntotal = 0\nwhile i <= 5:\n    total += i * i\n    i += 1\nprint(total)",
    "python-while-t03": "i = 10\ncount = 0\nwhile i > 0:\n    i -= 3\n    count += 1\nprint(count, i)",
    "python-for-range-t04": (
        "count = 0\nfor a in range(1, 6):\n    for b in range(1, 6):\n"
        "        if a < b:\n            count += 1\nprint(count)"
    ),
    "python-strings-t03": 's = "ABCDEFG"\nprint(s[2:5])\nprint(s[:4])\nprint(s[::3])\nprint(s[::-2])',
    "python-strings-t05": 'print(" Мир ".strip().upper())\nprint("a-b-c".replace("-", "", 1))',
    "python-lists-t02": (
        "a = [3, 1, 4]\na.append(1)\na.insert(0, 9)\nx = a.pop()\na.remove(1)\nprint(a)"
    ),
    "python-lists-t05": "t = [[0] * 2] * 3\nt[1][0] = 5\nprint(t)",
    "python-tuples-t06": 'count = 0\nfor pair in zip([1, 2, 3], "ab"):\n    count += 1\nprint(count)',
    "python-dictionaries-t03": 'print({"a": 1}.get("z", 0))\nprint("1" in {1: "x"})',
    "python-sets-t02": 'print(len(set("BANANA")))',
    "python-comprehensions-t04": "print([x for x in range(20) if x % 7 == 3])",
}


@pytest.mark.parametrize("task_id", sorted(PRINTED_LINES))
def test_the_answer_is_the_lines_python_prints(task_id: str) -> None:
    entry = next(e for e in _course_tasks() if e.task.id == task_id)
    printed = io.StringIO()
    with contextlib.redirect_stdout(printed):
        exec(PRINTED_LINES[task_id], {})  # noqa: S102 - the lesson's own fixed program
    lines = printed.getvalue().splitlines()
    assert is_correct(entry.task.checker, " ".join(lines)), task_id
