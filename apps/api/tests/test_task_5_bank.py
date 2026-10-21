"""Independent answer and content checks for the EGE topic 5 lesson «Преобразование записей чисел».

The lesson builds records as strings (``bin``, ``to_base``, slices, concatenation). Here every
answer is recomputed by arithmetic instead: appending a block is ``N · qᵏ + block``, prepending
is ``block · qᴸ + N``, inversion is ``qᴸ − 1 − N``, digits come from ``divmod`` and a monotone
result is counted by its extreme inputs. The bank's own solution programs must print the same
answers.
"""

import subprocess
import sys
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "preobrazovanie-zapisey-chisel"
RETIRED = [
    "preobrazovanie-zapisey-appending",
    "preobrazovanie-zapisey-base-three",
    "preobrazovanie-zapisey-digit-replacement",
    "preobrazovanie-zapisey-non-monotonic-maximum",
    "preobrazovanie-zapisey-parity",
]


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _digits(n: int, q: int) -> list[int]:
    """Digits of n in base q, most significant first."""
    out = []
    while n:
        n, d = divmod(n, q)
        out.append(d)
    return out[::-1] or [0]


def _value(digits: list[int], q: int) -> int:
    total = 0
    for d in digits:
        total = total * q + d
    return total


def _length(n: int, q: int) -> int:
    return len(_digits(n, q))


def _reverse(n: int, q: int) -> int:
    return _value(_digits(n, q)[::-1], q)


def _first(start: int, test) -> int:
    n = start
    while not test(n):
        n += 1
    return n


def _parity_tail(n: int, times: int, q: int = 2, mod: int = 2) -> int:
    """Append (digit sum mod ``mod``) ``times`` times, by arithmetic."""
    for _ in range(times):
        n = n * q + sum(_digits(n, q)) % mod
    return n


def _swap02(n: int) -> int:
    return 3 ** _length(n, 3) - 1 - n


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    # subtopic 1
    a["task-5-1-01"] = f"{''.join(map(str, _digits(22, 2)))} {''.join(map(str, _digits(22, 3)))}"
    a["task-5-1-02"] = (
        f"{_value([1, 0, 0, 1, 1], 2)} {_value([2, 1, 0, 1], 3)} {_value([1, 4, 7], 8)}"
    )
    six = [n for n in range(1, 200) if n.bit_length() == 6]
    a["task-5-1-04"] = f"{min(six)} {max(six)} {len(six)}"
    a["task-5-1-05"] = str((1000).bit_length())
    a["task-5-1-06"] = f"{_value([1, 0, 1], 2)} 101 {_value([1, 0, 1], 3)}"
    a["task-5-1-08"] = str(len(range(max(50, 3**4), min(300, 3**5 - 1) + 1)))
    a["task-5-1-09"] = str(len(range(2 * 3**4, min(500, 3**5 - 1) + 1)))
    # subtopic 2: appending as arithmetic
    a["task-5-2-01"] = str(11 * 2**3 + 1)
    a["task-5-2-02"] = str(2 * 2 ** (13).bit_length() + 13)
    a["task-5-2-03"] = str((47 - 1) // 2)
    a["task-5-2-04"] = str(7 * 3**2 + _value([1, 2], 3))
    a["task-5-2-05"] = str(45 * 8 + 45 % 8)
    a["task-5-2-06"] = str(6 * 2 ** (5).bit_length() + 5)

    def blocks(n: int) -> int:
        size = n.bit_length()
        if n % 2 == 0:
            return 2 ** (size + 1) + 2 * n
        return 3 * 2 ** (size + 1) + 2 * n + 1

    a["task-5-2-08"] = str(_first(1, lambda n: blocks(n) > 200))

    def ternary(n: int) -> int:
        if n % 3 == 0:
            return n * 9 + n % 9
        tail = n % 3 * 8
        return n * 3 ** _length(tail, 3) + tail

    a["task-5-2-09"] = str(_first(1, lambda n: ternary(n) > 500))
    # subtopic 3: parts of the record
    a["task-5-3-01"] = str(2 ** (22).bit_length() - 1 - 22)
    a["task-5-3-02"] = str(_value([1, 1, 0], 2) * 2**4 + 0b101101 % 2**4)
    a["task-5-3-03"] = f"{2**3 - 1 - 5} {2**8 - 1 - 5}"
    a["task-5-3-05"] = str(23 // 2 * 4)
    a["task-5-3-06"] = str(_reverse(52, 2))
    a["task-5-3-07"] = str(_swap02(46))

    def rotate_invert(n: int) -> int:
        size = n.bit_length()
        top, rest = divmod(n, 2 ** (size - 2))
        return 2**size - 1 - (rest * 4 + top)

    a["task-5-3-09"] = str(_first(4, lambda n: rotate_invert(n) > 40))
    # subtopic 4: digit sums
    a["task-5-4-02"] = str(_parity_tail(7, 2))
    a["task-5-4-05"] = f"{sum(_digits(100, 10))} {sum(_digits(100, 2))}"
    a["task-5-4-08"] = str(_first(1, lambda n: _parity_tail(n, 3) > 300))

    def window_sum(n: int) -> int:
        pairs = [n // 10**k % 100 for k in range(_length(n, 10) - 1)]
        return max(pairs) + min(pairs)

    a["task-5-4-09"] = str(_first(1001, lambda n: window_sum(n) == 100))
    # subtopic 5: searching
    a["task-5-5-01"] = str(_first(1, lambda n: 4 * n + (2 if n % 2 == 0 else 1) > 100))
    a["task-5-5-03"] = str(14 * 3**3 + 14)
    found = min((r, n) for n in range(1, 100) if (r := 8 * n + 7 if n % 2 == 0 else 2 * n) > 30)
    a["task-5-5-04"] = f"{found[0]} {found[1]}"

    def mixed(n: int) -> int:
        if n % 3 == 0:
            return 4 * n + n % 4
        head = n % 3 * 3
        return head * 2 ** n.bit_length() + n

    a["task-5-5-07"] = str(max(r for n in range(2, 300) if (r := mixed(n)) <= 200))

    def by_sum(n: int) -> int:
        if sum(_digits(n, 3)) % 2 == 0:
            return 3 * n + 1
        return 2 * 3 ** _length(n, 3) + n

    a["task-5-5-08"] = str(min((r, n) for n in range(1, 2000) if (r := by_sum(n)) > 1000)[1])
    a["task-5-5-09"] = str(len({_reverse(n, 2) for n in range(1, 101)}))
    # subtopic 4: from the result back to N (Change 197)

    def tail(n: int) -> int:
        return int(bin(n)[2:] + ("10" if n % 2 == 0 else "01"), 2)

    a["task-5-8-01"] = str(_first(1, lambda n: tail(n) == 189))
    a["task-5-8-02"] = str(min(r for n in range(1, 201) if (r := tail(n)) > 200))
    # Практика и итог

    def left_right(n: int) -> int:
        size = n.bit_length()
        if n % 2 == 0:
            return 2 * 2**size + n
        return 2 ** (size + 2) + 4 * n + 3

    a["task-5-7-01"] = str(max(r for n in range(1, 300) if (r := left_right(n)) <= 150))
    a["task-5-7-02"] = str(_first(1, lambda n: _parity_tail(n, 2, 3, 3) > 400))
    a["task-5-7-03"] = str(_first(1, lambda n: 2 * _reverse(n, 2) + 1 > 1000))

    def octal(n: int) -> int:
        digits = _digits(n, 8)
        if n % 2 == 0:
            return n * 8 + digits[0]
        return n % 5 * 8 ** len(digits) + n

    a["task-5-7-04"] = str(min((r, n) for n in range(1, 2000) if (r := octal(n)) > 600)[1])
    a["task-5-7-05"] = str(
        len({_value([d for d in _digits(n, 10) if d][::-1], 10) for n in range(10, 1000)})
    )
    return a


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(39))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [5] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-5-7-")
        assert bool(task.theory_links) != on_final_page, task_id
        assert task.lessons[0].counts_toward_mastery, task_id


def test_tasks_of_the_retired_lesson_are_archived() -> None:
    tasks = {entry.task.id: entry.task for entry in _bank().tasks}
    for task_id in RETIRED:
        task = tasks[task_id]
        assert task.archived and not task.catalog_visible, task_id
        assert not task.lessons and not task.theory_links, task_id


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
