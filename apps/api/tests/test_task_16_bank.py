"""Independent answer and content checks for the EGE topic 16 lesson «Рекуррентные выражения».

The lesson computes recursively with ``@cache``. Here every answer is recomputed another
way: tables filled by loops instead of recursion, factorials and exact fractions for
divisions, brute force over strings of digits. The bank's own solution programs must
print the same answers. The two digit-DP tasks are archived with their subtopic
(Change 197).
"""

import subprocess
import sys
from fractions import Fraction
from math import factorial, prod
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "rekursiya"


def _entries() -> dict[str, TaskData]:
    bank = Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())
    return {
        entry.task.id: entry.task
        for entry in bank.tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _table(base: dict[int, int | Fraction], last: int, rule) -> dict:
    """Values from the bases up to ``last``, each from the earlier ones."""
    values = dict(base)
    for n in range(min(base) + 1, last + 1):
        if n not in values:
            values[n] = rule(values, n)
    return values


def _down(base, first: int, top: int, rule) -> dict:
    """Values from the bases at the top down to ``first``."""
    values = dict(base)
    for n in range(top, first - 1, -1):
        if n not in values:
            values[n] = rule(values, n)
    return values


def _digit_sum(n: int, base: int = 10) -> int:
    total = 0
    while n:
        total += n % base
        n //= base
    return total


def _ones(n: int) -> int:
    return bin(n).count("1")


def _first(start: int, test) -> int:
    n = start
    while not test(n):
        n += 1
    return n


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a = {}
    f = _table({1: 3}, 5, lambda v, n: v[n - 1] + 2 * n)
    a["task-16-1-01"] = str(f[5])
    f = _table({1: 2}, 4, lambda v, n: 3 * v[n - 1] - 1)
    a["task-16-1-02"] = str(f[4])
    a["task-16-1-03"] = str((3 * 6 - 2) - 2 * (3 * 3 - 2))
    f = _table({1: 2, 2: 3}, 6, lambda v, n: v[n - 1] + 2 * v[n - 2])
    a["task-16-1-06"] = str(f[6])
    f = _table({1: 1, 2: 1, 3: 1}, 10, lambda v, n: v[n - 1] + v[n - 3])
    a["task-16-1-07"] = str(f[10])
    f = _table({1: 3, 2: 4}, 6, lambda v, n: 2 * v[n - 1] - v[n - 2] + n)
    a["task-16-1-08"] = str(f[6])
    a["task-16-1-09"] = str(prod(range(3, 7)))

    a["task-16-2-02"] = " ".join(str(n) for n in (10, 11, 12) if n % 3 == 0)
    a["task-16-2-03"] = str(22 + 2 * len(range(4, 20, 3)))
    a["task-16-2-04"] = str(33 - len(range(17, 31, 4)))
    f = _table({1: 1, 2: 2}, 12, lambda v, n: v[n - 1] + n if n % 2 == 0 else 2 * v[n - 2])
    a["task-16-2-05"] = str(f[12])
    f = _table({1: 5}, 6, lambda v, n: v[n - 1] - 2 if n % 2 == 0 else v[n - 1] + 3 * n)
    a["task-16-2-06"] = str(f[6])
    f = _table({1: 1, 2: 3}, 14, lambda v, n: n + v[n - 1] if n % 2 == 0 else 3 * v[n - 2])
    a["task-16-2-07"] = str(f[14])
    f = _table({1: 1, 2: 2}, 20, lambda v, n: v[n - 1] + n if n % 3 == 0 else v[n - 2] + 2)
    a["task-16-2-08"] = str(f[20])

    f = _table({1: 4}, 6, lambda v, n: 2 * v[n - 1] - n)
    a["task-16-3-01"] = str(f[6])
    a["task-16-3-02"] = str(sum(range(15, 22, 2)))
    pairs = [(2, 1)]
    for _ in range(3):
        x, y = pairs[-1]
        pairs.append((x + y, 2 * x))
    a["task-16-3-04"] = str(sum(pairs[-1]))
    f = _table({1: 1}, 100, lambda v, n: v[n - 1] + v[n // 2])
    a["task-16-3-06"] = str(f[100])
    f = _down({40: 2, 41: 2}, 30, 39, lambda v, n: v[n + 1] + v[n + 2])
    a["task-16-3-07"] = str(f[30])
    x, y = 1, 1
    for _ in range(11):
        x, y = x + 2 * y, x + y
    a["task-16-3-08"] = str(x + y)

    f = _table({1: 1, 2: 1}, 70, lambda v, n: v[n - 1] + v[n - 2])
    a["task-16-4-01"] = str(f[70])
    f = _down({5000: 5000, 5001: 5001}, 1, 4999, lambda v, n: v[n + 2] + 1)
    a["task-16-4-02"] = str(f[1])
    f = _table({1: 1, 2: 1, 3: 1}, 40, lambda v, n: v[n - 1] + v[n - 2] + v[n - 3])
    a["task-16-4-03"] = str(f[40])
    a["task-16-4-05"] = str((10**6).bit_length() - 1)
    a["task-16-4-06"] = str(sum(_ones(n) == 3 for n in range(1, 101)))
    a["task-16-4-07"] = str(1 + sum(n % 7 for n in range(2, 3001)))
    a["task-16-4-08"] = str(sum(_ones(n) == 4 for n in range(1, 701)))
    f = _table(
        {n: n for n in range(1, 100)},
        3000,
        lambda v, n: n + v[n // 3] if n % 3 == 0 else v[n - 1] + 5,
    )
    a["task-16-4-09"] = str(_first(1, lambda n: f[n] > 2000))

    a["task-16-5-01"] = str((factorial(102) - 2 * factorial(101)) // factorial(100))
    f = _table({1: 1, 2: 1, 3: 1}, 101, lambda v, n: v[n - 2] + n)
    a["task-16-5-02"] = str(f[101] - f[95])
    f = _table({1: 1, 2: 1, 3: 1}, 40, lambda v, n: v[n - 3] + 2 * n)
    a["task-16-5-03"] = str(2 * f[40] - f[37] - f[34])
    f = _table({n: n for n in range(1, 7)}, 51, lambda v, n: v[n - 4] + 5)
    a["task-16-5-04"] = str(f[51] - f[50])
    f = _table(
        {1: 1, 2: 1},
        10,
        lambda v, n: 2 * v[n - 2] if n % 2 else 3 * n * v[n - 1] + (v[n - 3] if n > 3 else 0),
    )
    a["task-16-5-05"] = str(Fraction(f[10], f[5]))
    g = _down({n: n for n in range(40, 46)}, 1, 39, lambda v, n: v[n + 6] + 1)
    fv = _table({n: 2 * g[n + 1] for n in range(1, 20)}, 48, lambda v, n: v[n - 5] + 10)
    a["task-16-5-07"] = str(fv[48])
    g = _down({n: Fraction(n, 4) for n in range(20, 23)}, 1, 19, lambda v, n: v[n + 3] + 2)
    a["task-16-5-08"] = str(4 * g[1])
    a["task-16-5-09"] = str(
        (prod(range(3, 2033)) - 3 * prod(range(3, 2032))) // prod(range(3, 2031))
    )
    f = _table({n: n for n in range(1, 11)}, 3001, lambda v, n: n + v[n - 4])
    a["task-16-5-10"] = str(f[3001] - f[2993])

    a["task-16-6-01"] = str(sum(_ones(n) == 2 for n in range(1, 128)))
    a["task-16-6-03"] = str(sum("7" not in str(n) for n in range(100, 1000)))

    def even_sum(n: int) -> int:
        return sum(int(c) for c in str(n) if int(c) % 2 == 0)

    a["task-16-6-04"] = str(sum(even_sum(n) == 0 for n in range(1000, 10000)))
    a["task-16-6-05"] = str(sum(_digit_sum(n) > _digit_sum(n + 1) for n in range(1000, 5001)))
    a["task-16-6-06"] = str(_first(1, lambda n: _digit_sum(n) - _digit_sum(n + 1) == 26))

    f = _down({2000: 2000, 2001: 2001}, 20, 1999, lambda v, n: n + v[n + 2])
    a["task-16-6-07"] = str(f[21] - f[20])
    a["task-16-6-09"] = str(sum(even_sum(n) == 0 for n in range(10**5, 3 * 10**5 + 1)))
    a["task-16-6-10"] = str(sum(_ones(n) == 3 for n in range(2**20)))

    a["task-16-7-01"] = str(sum(_digit_sum(n) == 5 for n in range(1, 1000)))
    a["task-16-7-02"] = str(sum(_digit_sum(n) == 9 for n in range(100, 501)))
    a["task-16-7-03"] = str(sum(prod(int(c) for c in str(n)) == 12 for n in range(1, 1001)))
    a["task-16-7-05"] = str(sum(_ones(n) == 3 for n in range(1, 256)))
    a["task-16-7-06"] = str(sum(_digit_sum(n) == 13 for n in range(1000, 5001)))

    f = _table({1: 2, 2: 4}, 21, lambda v, n: v[n - 1] + n if n % 2 == 0 else 2 * v[n - 2] + n)
    a["task-16-8-01"] = str(f[21])
    a["task-16-8-02"] = str((factorial(2026) + 4 * factorial(2025)) // factorial(2024))
    f = _table({n: n for n in range(1, 7)}, 4000, lambda v, n: n + 2 + v[n - 3])
    a["task-16-8-03"] = str(f[4000] - f[3991])
    a["task-16-8-04"] = str(_first(1, lambda n: _digit_sum(n, 3) == 9))
    g = _down({n: Fraction(n, 4) for n in range(50, 55)}, 1, 49, lambda v, n: v[n + 5] + 3)
    fv = _table({n: 4 * (g[n + 2] - 3) for n in range(1, 15)}, 100, lambda v, n: v[n - 3] + 7)
    a["task-16-8-05"] = str(fv[100])
    return a


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(55))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [16] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-16-8-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith(("task-16-6-", "task-16-7-")) and task_id != "task-16-6-07"
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(
    answers: dict[str, str],
) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        tokens = expected.split()
        tokens[-1] = str(int(tokens[-1]) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id


def test_solution_programs_print_the_answer(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        (code,) = [
            block.data.code
            for block in task.explanation
            if block.type == "code_example" and block.data.language == "python"
        ]
        result = subprocess.run(
            [sys.executable, "-I", "-c", code],
            capture_output=True,
            text=True,
            check=True,
            timeout=300,
        )
        assert " ".join(result.stdout.split()) == answers[task_id], task_id
        assert all(len(line) <= 64 for line in code.splitlines()), task_id
