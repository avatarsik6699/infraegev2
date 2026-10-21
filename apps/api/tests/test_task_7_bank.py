"""Independent answer and content checks for the EGE topic 7 lesson «Объём информации».

The bank's programs count in floats and loops, as the lesson does. Here every answer is
recomputed with exact fractions: the length of a code for n objects is ``(n − 1).bit_length()``,
units are powers of two, rounding is floor or ceiling division of fractions, and a decimal
answer is compared exactly. The bank's own solution programs must print the same answers,
and a decimal answer is accepted with a comma as well.
"""

import subprocess
import sys
from fractions import Fraction as F
from math import ceil, floor
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "media-coding"
KB, MB, GB = 2**13, 2**23, 2**33  # bits


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def bits(n: int) -> int:
    """The shortest code for n objects."""
    return (n - 1).bit_length()


def num(x: F) -> str:
    """An exact number as the programs print it: 18, 2.25."""
    x = F(x)
    return str(x.numerator) if x.denominator == 1 else str(float(x))


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    # subtopic 1
    a["task-7-1-01"] = str(bits(600))
    a["task-7-1-02"] = num(F(5, 2) * MB)
    a["task-7-1-03"] = num(F(2**20, KB))
    a["task-7-1-04"] = str(3 * KB)
    a["task-7-1-05"] = str(bits(4097))
    a["task-7-1-09"] = str(bits(100_000))
    # subtopic 2
    a["task-7-2-01"] = num(F(256 * 128 * bits(200), KB))
    a["task-7-2-02"] = str(1 << floor(F(80 * KB, 320 * 200)))
    a["task-7-2-03"] = num(F(bits(32), bits(16)))
    a["task-7-2-04"] = num(8 * F(300, 200) ** 2)
    a["task-7-2-05"] = num(F(1024 * 768 * 24, MB))
    a["task-7-2-06"] = num(F(640 * 400 * bits(6000), KB))
    a["task-7-2-08"] = str(1 << floor(F(300 * KB, 1000 * 750)))
    a["task-7-2-09"] = num(36 * F(200, 400) ** 2 * F(bits(65_536), 24))
    # subtopic 3
    a["task-7-3-01"] = num(40 * F(85, 100))
    a["task-7-3-02"] = num(F(80 - 20, 80) * 100)
    a["task-7-3-03"] = num(28 / F(70, 100))
    a["task-7-3-04"] = num(100 - 100 * F(80, 100) * F(50, 100))
    a["task-7-3-05"] = num(F(300 + 24, 3))
    a["task-7-3-06"] = str(10 * (96 + 8))
    a["task-7-3-07"] = str(1 << floor(F(576 * KB) / (F(60, 100) * 1024 * 768)))
    per = F(20 * 1024, 64)
    a["task-7-3-08"] = str(1 << floor((per - 32) / F(75, 100) * KB / (1024 * 512)))
    photo = F(800 * 600 * 24, KB) * F(25, 100)
    a["task-7-3-09"] = str(round(F(50 * 1024, 100) - photo))
    # subtopic 4
    a["task-7-4-01"] = num(F(16_000 * 10 * 2 * 16, KB))
    a["task-7-4-02"] = num(F(48_000 * 20 * 24, KB))
    a["task-7-4-03"] = num(F(3750 * KB, 32_000 * 2 * 16))
    a["task-7-4-04"] = str(3 * 60 + 45)
    a["task-7-4-05"] = num(10 * F(2) * 2 * F(1, 2) * F(1, 2))
    a["task-7-4-06"] = num(60 * F(2, 4) * 2 / F(3, 2))
    a["task-7-4-07"] = num(F(80, 100) / (F(1, 2) * 2 * F(25, 100)))
    a["task-7-4-08"] = str(ceil(F(24_000 * 2 * 16 * 187, KB)))
    a["task-7-4-09"] = num(18 * F(4) / 2 / 3)
    a["task-7-4-10"] = str(round(F(330 * MB, 48_000 * 2 * 24) / 60))
    # subtopic 5
    a["task-7-5-01"] = num(F(32_000 * 60 * 16, 64_000))
    a["task-7-5-02"] = str(floor(F(512_000) / (20_000 * 2 * F(4, 10))))
    a["task-7-5-03"] = num(F(6 * MB, 2**21))
    a["task-7-5-04"] = num(F(256_000 * 120, KB))
    a["task-7-5-05"] = num(F(45 * 4, 3))
    a["task-7-5-06"] = num(F(640 * 480 * bits(256) * 50, 1_536_000))
    a["task-7-5-07"] = num(F((2048 * 1536 * 24 - 1024 * 768 * 16) * 40, MB))
    shot = F(1280 * 1024 * bits(65_536), KB) * F(40, 100)
    a["task-7-5-08"] = str(ceil(shot / 256))
    a["task-7-5-09"] = str(floor(F(1920 * 1080 * bits(5000) * 250, 25_000_000) / 60))
    total = 44_100 * 2 * 24 * 2400 + 12 * 200 * KB
    a["task-7-5-10"] = str(floor(F(total, 100_000_000)))
    # rounding by the question
    a["task-7-6-01"] = str(floor(F(1024, 90)))
    a["task-7-6-02"] = str(next(h for h in range(100) if F(400 + 5 * h, 50) > 10))
    a["task-7-6-03"] = str(ceil(F(12346, 10)))
    a["task-7-6-06"] = str(ceil(F(50, 700 // 64)))
    sound = 32_000 * 4 * 20 * 1800
    a["task-7-6-07"] = str(floor(F(16 * 300_000_000 - sound, 16 * KB)) + 1)
    shot = F(3000 * 2000 * bits(10_000_000), 8)
    per = floor(F(32 * 2**30) / shot)
    a["task-7-6-08"] = str((ceil(F(5000, per)) - 1) * per)
    # Практика и итог
    a["task-7-8-01"] = str(1 << floor(F(900 * KB, 1280 * 720)))
    per = F(32 * 1024, 128)
    a["task-7-8-02"] = str(1 << floor((per - 16) / F(75, 100) * KB / (640 * 480)))
    a["task-7-8-03"] = str(ceil(F(22_050 * 2 * 16 * 155, KB)))
    a["task-7-8-04"] = num(F(50) * 2 * F(1, 2) * F(3, 2) / 3)
    a["task-7-8-05"] = str(floor(F(2000 * 1500 * bits(1000) * 120, 14_000_000)))
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
        assert task.exam_numbers == [7] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-7-8-")
        assert bool(task.theory_links) != on_final_page, task_id
        assert task.lessons[0].counts_toward_mastery, task_id


def test_checker_accepts_a_decimal_comma_and_rejects_a_neighbour(
    answers: dict[str, str],
) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        assert is_correct(task.checker, expected.replace(".", ",")), task_id
        tokens = expected.split()
        tokens[-1] = num(F(tokens[-1]) + 1)
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
