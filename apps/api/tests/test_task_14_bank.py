"""Independent answer and content checks for the EGE topic 14 lesson «Системы счисления».

The bank's programs take the digits of a number with ``%`` and ``//`` in a loop and the
value of a record with ``v * q + d``, then search the parameter, the digits or the base.
Here the answers are recomputed another way: a record is the sum ``Σ dₖ·qᵏ`` over its
reversed digits, the digits of a power expression are assembled from its blocks
(``qᵃ − qᵇ`` — ``a − b`` digits ``q − 1`` and ``b`` zeros), a divisibility condition on
an unknown digit is solved as a linear congruence, and the closed forms of the lesson
(``qⁿ − 1``, the range ``q² … q³ − 1``) replace the search where they exist. The bank's
own solution programs must print the same answers.
"""

import subprocess
import sys
from math import isqrt
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "numeral-systems"


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def rec(ds: list[int], q: int) -> int:
    """The value of a record: the sum of digit · weight of its place."""
    return sum(d * q**k for k, d in enumerate(reversed(ds)))


def rep(n: int, q: int) -> list[int]:
    """Digits of n in base q, the highest place first: the highest weight that fits."""
    k = 0
    while q ** (k + 1) <= n:
        k += 1
    out = []
    for place in range(k, -1, -1):
        d, n = divmod(n, q**place)
        out.append(d)
    return out


def block(a: int, b: int, q: int) -> list[int]:
    """qᵃ − qᵇ: a − b digits q − 1, then b zeros."""
    return [q - 1] * (a - b) + [0] * b


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    # subtopic 1
    a["task-14-1-02"] = str(rec([2, 1, 0, 3], 4))
    a["task-14-1-03"] = "".join(map(str, rep(94, 5)))
    a["task-14-1-04"] = str(rec([5] * 4, 6))
    a["task-14-1-06"] = str(len(range(6**2, 6**3)))
    a["task-14-1-07"] = str(rep(2024, 5)[-4])
    a["task-14-1-08"] = str(rec(rep(2024, 7)[-2:], 7))
    a["task-14-1-09"] = str(rec([3, 10, 7], 11))
    # subtopic 2: block records
    total = rep(rec([3, 2, 4], 5) + rec([1, 4, 3], 5), 5)
    a["task-14-2-01"] = "".join(map(str, total))
    a["task-14-2-02"] = "6" * 5
    record = [1] + [0] * 4 + [1] + [0] * 2 + [1]  # places 8, 3 and 0
    assert rec(record, 7) == 7**8 + 7**3 + 1
    a["task-14-2-03"] = str(record.count(0))
    assert rec(block(20, 7, 4), 4) == 4**20 - 4**7
    a["task-14-2-04"] = str(block(20, 7, 4).count(3))
    # 2⁴⁵ + (2²⁰ − 2³) + 1
    a["task-14-2-05"] = str(1 + block(20, 3, 2).count(1) + 1)
    a["task-14-2-06"] = str(1 + 3)  # 2¹⁶ and 111₂
    r = [1] + [0] * 6 + block(10, 4, 3)
    assert rec(r, 3) == 9**8 + 3**10 - 3**4
    a["task-14-2-07"] = str(r.count(2))
    low = rep(5**4 - 5**3 - 3, 5)
    r = [1] + [0] * 4 + block(8, 4, 5)[:4] + low
    assert rec(r, 5) == 25**6 + 5**8 - 5**3 - 3
    a["task-14-2-08"] = str(r.count(4))
    # subtopic 3
    a["task-14-3-01"] = str(rep(2016, 6).count(0))
    a["task-14-3-03"] = str(block(100, 50, 2).count(1) + 1)
    a["task-14-3-04"] = str(20 * 6)
    r = rep(16**10 - 16**5 + 255, 16)
    assert r == [15] * 5 + [0] * 3 + [15] * 2
    a["task-14-3-06"] = str(len(set(r)))
    a["task-14-3-07"] = str(rep(3 * 27**15 + 9**20 - 2 * 3**10 - 4, 9).count(8))
    r = rep(5 * 36**20 + 6**45 - 6**10 - 2025, 36)
    a["task-14-3-08"] = str(sum(d > 9 for d in r))
    r = rep(4 * 31**30 + 9 * 31**15 - 31**6 + 2026, 31)
    a["task-14-3-09"] = str(sum(d for d in r if d <= 15))

    # subtopic 4: qⁿ − x has the digits of q − 1 − (x − 1) place by place
    def fours(x: int) -> int:
        return rep(x - 1, 5).count(0) + 6 - len(rep(x - 1, 5)) if x > 1 else 6

    a["task-14-4-02"] = str(fours(2))
    a["task-14-4-03"] = str(max(x for x in range(1, 201) if fours(x) == 4))
    zeros = [rep(5**6 - x, 5).count(0) for x in range(1, 501)]
    a["task-14-4-05"] = str(zeros.index(max(zeros)) + 1)
    a["task-14-4-06"] = str(
        max(x for x in range(1, 3001) if rep(7**100 + 7**50 - x, 7).count(0) == 53)
    )
    # the ten low digits 12 sit where x − 1 has zeros: three nonzero digits are needed
    a["task-14-4-07"] = str(rec([1, 1, 1], 13) + 1)
    a["task-14-4-08"] = str(max(rep(6**120 + 6**60 - x, 6).count(0) for x in range(1, 2001)))

    # subtopic 5: a record linear in x — solve the congruence
    def digit_quotients(parts, alphabet, m, divisor=None):
        out = []
        for x in alphabet:
            s = sum(rec([x if d is None else d for d in ds], q) for ds, q in parts)
            if s % m == 0:
                out.append(s // (divisor or m))
        return out

    a["task-14-5-02"] = str((154 + 14 * 1) // 6)
    assert [x for x in range(7) if (154 + 14 * x) % 6 == 0] == [1, 4]
    assert [x for x in range(6) if (140 + 14 * x) % 5 == 0] == [0, 5]
    a["task-14-5-03"] = str((140 + 14 * 5) // 5)
    a["task-14-5-04"] = str(2 * 40**2 + 33 * 40 + 7)
    parts = [([7, None, 3, 10], 19), ([4, 11, None, 3], 19)]
    a["task-14-5-06"] = str(digit_quotients(parts, range(19), 18)[0])
    parts = [([5, None, 1, 8, 12, 3], 23), ([2, None, 7, None], 23), ([9, 6, None, 4, 1], 23)]
    a["task-14-5-07"] = str(digit_quotients(parts, range(23), 22)[-1])
    (only,) = digit_quotients([([5, None, 7], 14), ([None, 3, 11], 12)], range(10), 20)
    a["task-14-5-08"] = str(only)
    parts = [([6, None, 2, 9], 41), ([1, None, 0, 7, None], 41)]
    a["task-14-5-09"] = str(digit_quotients(parts, range(41), 40)[0])

    # subtopic 6: every pair, the best value explicitly
    def smallest(f, xs, ys, m):
        return min(s for x in xs for y in ys if (s := f(x, y)) % m == 0) // m

    a["task-14-6-02"] = str(
        smallest(lambda x, y: rec([1, x, y], 4) + rec([2, y, x], 5), range(4), range(4), 7)
    )
    a["task-14-6-04"] = str(
        smallest(
            lambda x, y: rec([3, x, 6, y], 11) + rec([y, 5, x, 1], 13), range(11), range(11), 41
        )
    )
    a["task-14-6-05"] = str(
        max(y * 38 + x for x in range(38) for y in range(38) if rec([4, x, 1, y, 7], 38) % 37 == 0)
    )
    a["task-14-6-06"] = str(
        max(
            yx
            for x in range(42)
            for y in range(42)
            if rec([3, x, 5, y], 42) % 41 == 0 and (yx := y * 42 + x) > 0 and isqrt(yx) ** 2 == yx
        )
    )
    # subtopic 7: the base from a formula
    a["task-14-7-01"] = str(next(q for q in range(5, 67) if q * q + 2 * q + 4 == 67))
    # q(q + x) = 81 with 0 ≤ x < q and q ≥ 5
    (pair,) = [(q, 81 // q - q) for q in range(5, 82) if 81 % q == 0 and 0 <= 81 // q - q < q]
    a["task-14-7-02"] = str(pair[0])
    sols = [
        (q, x, y)
        for q in range(8, 40)
        for x in range(1, q)
        for y in range(q)
        if 3 * q + x + x * q + y == q * q + y * q + 7
    ]
    q, x, y = min(sols)
    a["task-14-7-03"] = str(x * q + y)
    # a record ≡ the sum of its digits (mod q − 1); q ≥ 12, so q − 1 is a divisor of 47 above 10
    a["task-14-7-04"] = str(min(d for d in range(11, 48) if 47 % d == 0) + 1)
    a["task-14-7-06"] = str(
        min(rec([2, x], 6) - rec([3, x, 1], 6) % rec([2, x], 6) for x in range(6))
    )
    a["task-14-7-07"] = str(3 * 7**6 + 5 * 49 + 4 + 1)
    # Практика и итог
    a["task-14-8-01"] = str(rep(2 * 49**10 + 7**12 - 7**4 - 3, 7).count(6))
    a["task-14-8-02"] = str(sum(d > 9 for d in rep(3 * 6**80 + 6**50 - 6**20 - 1000, 36)))
    a["task-14-8-03"] = str(max(x for x in range(1, 1001) if rep(6**8 + 6**3 - x, 6).count(0) == 3))
    (only,) = digit_quotients(
        [([9, None, 3, 6], 21), ([3, None, 7, 10, None], 21)], range(21), 20, divisor=10
    )
    a["task-14-8-04"] = str(only)
    a["task-14-8-05"] = str(
        smallest(lambda x, y: rec([1, x, y, 3], 7) + rec([y, 2, x], 8), range(7), range(7), 13)
    )
    return a


def _solution(task: TaskData) -> str:
    (code,) = [
        block.data.code
        for block in task.explanation
        if block.type == "code_example" and block.data.language == "python"
    ]
    return code


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(50))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [14] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-14-8-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith("task-14-7-")
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        tokens = expected.split()
        tokens[-1] = str(int(tokens[-1]) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id


def test_solution_programs_print_the_answer(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        code = _solution(task)
        result = subprocess.run(
            [sys.executable, "-I", "-c", code],
            capture_output=True,
            text=True,
            check=True,
            timeout=300,
        )
        assert " ".join(result.stdout.split()) == answers[task_id], task_id
        assert all(len(line) <= 64 for line in code.splitlines()), task_id
