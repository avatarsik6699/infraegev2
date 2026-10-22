"""Independent answer and content checks for the EGE topic 15 lesson.

The lesson «Законы математической логики» solves every formula by its false case. The bank's
answers come from a finite search over A and x (``topic-15/bank.py``). Here every answer is
derived the lesson's way instead: the bits a mask must or may hold, the common part or the
gaps of two segments, the greatest common divisor or the least common multiple of the
dangerous numbers, the largest value of an expression over the dangerous region.
"""

from math import gcd, isqrt, lcm
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "logic-transformations"


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _required(left: int, zero: int) -> int:
    """(x & left ≠ 0) → ((x & zero = 0) → (x & A ≠ 0)): bits of left outside zero."""
    return left & ~zero


def _allowed(zero: int, right: int) -> int:
    """(x & A ≠ 0) → ((x & zero = 0) → (x & right ≠ 0)): bits of zero or right."""
    return zero | right


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, int | str] = {}
    a["task-15-1-01"] = 1
    # x < 12 needs x ≤ A: the largest dangerous x is 11
    a["task-15-1-04"] = 11
    # x ≥ 5 needs x > A: the smallest dangerous x is 5
    a["task-15-1-05"] = 5 - 1
    # x < 6 and x > A must never hold: A covers 1 … 5
    a["task-15-1-06"] = 5
    a["task-15-1-07"] = 3 * 8 + 1
    # segments: P ∩ Q, the longer of P and Q, the hull of both, Q itself
    a["task-15-2-01"] = min(13, 18) - max(1, 8)
    a["task-15-2-02"] = max(7 - 2, 20 - 11)
    a["task-15-2-03"] = 20 - 2
    a["task-15-2-04"] = 17 - 10
    # 2.6: A ⊆ P ∪ Q; the largest sum leaves out −4
    p, q = {-4, 1, 6}, {1, 3}
    a["task-15-2-06"] = sum(v for v in p | q if v > 0)
    # 2.7: P ⊆ A ⊆ P ∪ Q; the smallest sum is P itself
    a["task-15-2-07"] = sum(p)
    a["task-15-2-08"] = min(40, 60) - max(12, 28)
    a["task-15-2-09"] = max(24 - 6, 45 - 31)
    a["task-15-3-01"] = 27 & 14
    a["task-15-3-02"] = _required(26, 12)
    a["task-15-3-03"] = _allowed(6, 9)
    a["task-15-3-05"] = _required(28, 12)
    a["task-15-3-06"] = _allowed(20, 3)
    a["task-15-3-07"] = _required(50, 22)
    a["task-15-3-08"] = _allowed(41, 15)
    a["task-15-4-01"] = 4 * 4
    # x + y < 18 and x ≥ y: the largest y is 8
    a["task-15-4-02"] = max(y for x in range(1, 18) for y in range(1, x + 1) if x + y < 18) + 1
    # 3x + 2y < 24: x + y is largest at x = 1, y = 10
    a["task-15-4-03"] = max(x + (23 - 3 * x) // 2 for x in range(1, 8)) + 1
    # x ≤ 5 → x² ≤ A gives A ≥ 25; y² ≤ A → y ≤ 5 gives A < 36
    a["task-15-4-04"] = 36 - 1
    # y ≤ 7: A·x ≥ 3y + 4 is hardest at x = 1, y = 7
    a["task-15-4-06"] = 3 * 7 + 4
    # x, y < A must give xy < 40: (A − 1)² < 40
    a["task-15-4-07"] = isqrt(39) + 1
    a["task-15-4-08"] = max(x + 32 - 3 * x for x in range(1, 11)) + 1
    # ДЕЛ: A divides the common multiples of 8 and 12 → A | lcm
    a["task-15-5-01"] = lcm(8, 12)
    a["task-15-5-02"] = gcd(60, lcm(8, 18))
    # common divisors of 84 and 126 divide A; A divisible by 20
    a["task-15-5-03"] = lcm(gcd(84, 126), 20)
    a["task-15-5-04"] = max(x for x in range(20, 55) if x % 6) + 1
    a["task-15-5-05"] = max(x for x in range(1, 50) if x % 6 == 0 and x % 4) + 1
    a["task-15-5-06"] = (60 - 20 + 1) - (60 // 4 - 19 // 4)
    dangerous = [x for x in range(40, 51) if x % 12 == 0]
    a["task-15-5-07"] = gcd(*dangerous) if len(dangerous) > 1 else dangerous[0]
    # A = 8 lacks bit 16: the first x with bit 16 and neither 8 nor 4
    a["task-15-6-03"] = min(x for x in range(64) if x & _required(28, 12) & ~8)
    # triangle with 3 and 8: 5 < x < 11, so A < 6
    a["task-15-7-02"] = (8 - 3 + 1) - 1
    a["task-15-7-03"] = 29 + 1
    a["task-15-7-04"] = 6 + 6 + 1
    # 200 = 2³ · 5²: no divisor of 200 is a multiple of 3
    a["task-15-7-05"] = 200
    # A ≡ 1 (mod 6) keeps A … A + 4 clear of multiples of 6
    good = list(range(1, 41, 6))
    a["task-15-7-06"] = good[-1]
    a["task-15-8-01"] = 12 * 12 + 1
    a["task-15-8-02"] = min(40, 63) - max(15, 21)
    a["task-15-8-03"] = _required(29, 17)
    # 2x + y = 70 with x ≥ y: x ≥ 24 (y ≤ x gives 3x ≥ 70)
    a["task-15-8-04"] = -(-70 // 3) - 1
    a["task-15-8-05"] = max(x for x in range(20, 51) if x % 4) + 1
    return {k: str(v) for k, v in a.items()}


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(45))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [15] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-15-8-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith("task-15-7-")
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        tokens = expected.split()
        tokens[-1] = str(int(tokens[-1]) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id
