"""Independent answer and content checks for the EGE topic 11 lesson «Объём информации: пароли».

The bank's programs count bits with a loop and search the bounds «не более» and «более»
over the possible values. Here every answer is recomputed in closed form: the bits of a
symbol are ``(A − 1).bit_length()``, bytes are ceiling division ``−(−x // 8)``, and every
bound is solved as an inequality — the largest length is ``⌊8B / i⌋``, the smallest one
that does not fit into B − 1 bytes is ``⌊8(B − 1) / i⌋ + 1``, the largest alphabet is
``2^⌊8B / L⌋`` — instead of being searched. The bank's own solution programs must print
the same answers.
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
MATERIAL = "information-amount"


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def i(alphabet: int) -> int:
    """Bits of one symbol."""
    return (alphabet - 1).bit_length()


def nbytes(nbits: int) -> int:
    return -(-nbits // 8)


def up(a: int, b: int) -> int:
    return -(-a // b)


def longest(bytes_: int, bits_per_symbol: int) -> int:
    """The largest length that fits into the given bytes."""
    return 8 * bytes_ // bits_per_symbol


def shortest_over(bytes_below: int, bits_per_symbol: int) -> int:
    """The smallest length that does not fit into ``bytes_below`` bytes."""
    return 8 * bytes_below // bits_per_symbol + 1


def smallest_alphabet_over(length: int, bytes_below: int) -> int:
    """The smallest alphabet whose code of ``length`` symbols does not fit."""
    need = 8 * bytes_below // length + 1  # bits per symbol
    return 2 ** (need - 1) + 1


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    # subtopic 1
    a["task-11-1-01"] = str(i(33))
    a["task-11-1-02"] = str(nbytes(9 * i(36)))
    a["task-11-1-03"] = str(200 * nbytes(13 * i(9)))
    a["task-11-1-04"] = str(40 * nbytes(12 * i(66)))
    a["task-11-1-05"] = str(6 * i(4))  # bits, not the 4**6 passwords
    a["task-11-1-06"] = str(1024 * nbytes(40 * i(150)) // 1024)
    a["task-11-1-07"] = str(nbytes(15 * 11 * i(6)))  # whole bytes for the sequence
    a["task-11-1-08"] = str(524_288 * nbytes(180 * i(2016)) // 2**20)
    a["task-11-1-09"] = str(up(12_000 * nbytes(95 * i(1236)), 1024))
    # subtopic 2
    a["task-11-2-01"] = str(64 * (nbytes(10 * i(26)) + 20))
    a["task-11-2-02"] = str(128 * (nbytes(15 * i(12)) + 9))
    a["task-11-2-03"] = str(6 * 1024 // 256 - nbytes(13 * i(40)))
    a["task-11-2-04"] = str(1080 // 30 - nbytes(14 * i(30)))
    a["task-11-2-05"] = str(64 + 200 * (nbytes(8 * i(12)) + 12))
    a["task-11-2-06"] = str(96 - 9 * i(9))
    a["task-11-2-07"] = str(nbytes(11 * i(5) + 25))  # whole bytes for the record
    a["task-11-2-08"] = str(300 * 1024 // 4096 - nbytes(60 * i(66)))
    a["task-11-2-09"] = str(500 * (nbytes(25 * i(38)) + 30))
    # subtopic 3: «не более»
    a["task-11-3-01"] = str(longest(9, i(40)))
    low = 8 * 8 // 12 + 1  # bits that do not fit 8 bytes
    high = 8 * 9 // 12
    assert low == high
    a["task-11-3-02"] = str(2 ** (low - 1) + 1)
    a["task-11-3-04"] = str(longest(2048 // 100 - 3, i(33)))
    a["task-11-3-05"] = str(2 ** (8 * (480 // 40) // 15))
    a["task-11-3-06"] = str(2 ** (8 * (30 * 1024 // 1000) // 24) - 36)
    a["task-11-3-07"] = str(3 * 2**20 // (nbytes(16 * i(40)) + 19))
    a["task-11-3-08"] = str(2 ** (8 * (200 * 2**20 // 700_000) // 310))
    a["task-11-3-09"] = str(longest(500 * 1024 // 3000, i(762)))
    # subtopic 4: «не менее» and «более»
    a["task-11-4-01"] = str(1000 // 40 + 1)  # «более»: the bound itself fails
    more = 1000 // 100 + 1  # bytes per password
    a["task-11-4-02"] = str(shortest_over(more - 1, i(17)))
    a["task-11-4-03"] = str(shortest_over(450 // 50, i(30)))
    a["task-11-4-04"] = str(smallest_alphabet_over(13, up(2001, 200) - 1))
    a["task-11-4-05"] = str(smallest_alphabet_over(20, up(6800, 400) - 1) - 36)
    data = 3 * nbytes(40 * i(100)) + 5 * nbytes(25 * i(100))
    a["task-11-4-06"] = str((300 - data) // 8 + 1)
    a["task-11-4-07"] = str(shortest_over(30 * 2**20 // 200_000, i(5036)))
    a["task-11-4-08"] = str(smallest_alphabet_over(40, up(95 * 2**20, 2_000_000) - 1))
    # subtopic 5: composite codes
    a["task-11-5-01"] = str((256).bit_length())
    letters, digits = 5 * i(26), 3 * i(10)
    a["task-11-5-02"] = str(nbytes(letters + digits))
    a["task-11-5-03"] = str(nbytes(10 * i(35)))  # one common code
    a["task-11-5-04"] = str(32 - nbytes(13 * i(22)) - nbytes((100).bit_length()))
    a["task-11-5-05"] = str(32 - nbytes(13 * i(22) + (100).bit_length()))
    a["task-11-5-06"] = str(nbytes(10 * i(26)) + nbytes((63).bit_length() + (366).bit_length()))
    a["task-11-5-07"] = str(4096 * 30 * nbytes(5 * i(36) + (1000).bit_length()) // 1024)
    a["task-11-5-08"] = str(2368 // 64 - nbytes(8 * i(26) + (5000).bit_length()))
    a["task-11-5-09"] = str(2 * 2**20 // 16_384 - nbytes(6 * i(26)) - nbytes(40 * i(3000)))
    # subtopic 6: headers that depend on the size
    a["task-11-6-01"] = str(25 + up(25, 6) * 2)
    # with groups of g bytes and a 1-byte header the total is b + ⌈b / g⌉; it grows by
    # at least one with every b, so the largest b is found by stepping down from the bound
    b = 60
    while b + up(b, 5) > 60:
        b -= 1
    a["task-11-6-02"] = str(longest(b, i(100)))
    # the code grows past 32 bits when the number needs 13 bits: from 2¹² on
    a["task-11-6-03"] = str(2 ** (32 - 4 * i(26)))
    best = 0
    for k in range(1, 12):  # numbers of k bits: from 2^(k−1) to 2^k − 1
        record = nbytes(10 * i(26) + k) + 20
        top = min(2**k - 1, 8 * 1024 // record)
        if top >= 2 ** (k - 1):
            best = max(best, top)
    a["task-11-6-04"] = str(best)
    b = 2048
    while b + up(b, 7) > 2048:
        b -= 1
    a["task-11-6-05"] = str(longest(b, i(300)))
    best = 0
    for k in range(1, 13):
        record = nbytes(15 * i(52) + k) + 45
        top = min(2**k - 1, 60 * 1024 // record)
        if top >= 2 ** (k - 1):
            best = max(best, top)
    a["task-11-6-06"] = str(best)
    # Практика и итог
    a["task-11-7-01"] = str(nbytes(220 * i(3510)))
    a["task-11-7-02"] = str(20 * 1024 // 512 - nbytes(30 * i(36)))
    a["task-11-7-03"] = str(2 ** (8 * (3 * 2**20 // 40_000) // 150))
    a["task-11-7-04"] = str(shortest_over(600 * 1024 // 5000, i(2036)))
    a["task-11-7-05"] = str(40 - nbytes(12 * i(18)) - nbytes((1500).bit_length()))
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
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(54))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [11] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-11-7-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith("task-11-6-")
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
