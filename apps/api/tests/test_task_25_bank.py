"""Independent content and answer checks for the EGE integer-processing lesson."""

import json
import subprocess
import sys
from pathlib import Path

import pytest

from app.modules.practice.models import TaskRecord
from app.modules.practice.readers import public_task
from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_PATH = ROOT / "content/practice-bank/bank.json"
TASK_IDS = [f"task-25-{number:02d}" for number in range(1, 9)]
EXPECTED_SECTIONS = [
    {"divisibility-remainder", "decimal-digits"},
    {"decimal-digits", "divisibility-remainder"},
    {"divisors"},
    {"primes"},
    {"divisors", "primes"},
    {"divisor-pairs"},
    {"decimal-mask", "divisibility-remainder"},
    {"bounded-search", "divisor-pairs"},
]


def _bank() -> Bank:
    return Bank.model_validate_json(BANK_PATH.read_bytes())


def _proper_divisors(number: int) -> list[int]:
    return [divisor for divisor in range(1, number) if number % divisor == 0]


def _all_divisors(number: int) -> list[int]:
    return _proper_divisors(number) + [number]


def _is_prime(number: int) -> bool:
    return number > 1 and len(_all_divisors(number)) == 2


def _independent_answers() -> list[int]:
    task_01 = sum(number % 6 == 0 and number % 10 == 2 for number in range(100, 200))
    task_02 = max(
        number
        for number in range(300, 451)
        if number % 5 == 0 and sum(int(digit) for digit in str(number)) == 12
    )
    task_03 = len(_proper_divisors(36))
    task_04 = sum(_is_prime(number) for number in range(90, 111))
    task_05 = next(number for number in range(40, 71) if len(_all_divisors(number)) == 3)
    task_06 = max(divisor for divisor in _proper_divisors(216) if divisor % 10 == 4)
    task_07 = sum(
        number % 2 == 0 and number % 9 == 0
        for number in range(3000, 4000)
        if str(number)[0] == "3" and str(number)[2] == "5"
    )
    first_five: list[int] = []
    for number in range(500_000, 505_001):
        qualifying = [
            divisor for divisor in _proper_divisors(number) if divisor > 7 and divisor % 10 == 7
        ]
        if qualifying:
            first_five.append(max(qualifying))
        if len(first_five) == 5:
            break
    assert len(first_five) == 5
    task_08 = sum(first_five)
    return [task_01, task_02, task_03, task_04, task_05, task_06, task_07, task_08]


def _solution_code(task: TaskData) -> str:
    examples = [block.data.code for block in task.explanation if block.type == "code_example"]
    assert len(examples) == 1, task.id
    return examples[0]


def test_task_25_independent_answers_and_executable_solutions() -> None:
    bank = _bank()
    bank.validate_references()
    material = next(item for item in bank.materials if item.id == "integer-processing")
    assert material.kind == "topic" and material.status == "published"
    assert material.sections == [
        "integer-range",
        "divisibility-remainder",
        "decimal-digits",
        "divisors",
        "primes",
        "divisor-pairs",
        "decimal-mask",
        "bounded-search",
    ]

    expected = _independent_answers()
    assert expected == [4, 435, 8, 5, 49, 54, 5, 229_825]
    entries = [
        next(entry for entry in bank.tasks if entry.task.id == task_id) for task_id in TASK_IDS
    ]
    assert [entry.task.lessons[0].position for entry in entries] == list(range(8))
    assert [entry.task.difficulty for entry in entries] == [1, 1, 2, 2, 3, 3, 3, 3]

    for index, entry in enumerate(entries):
        task = entry.task
        assert task.exam_numbers == [] and not task.catalog_visible and not task.archived
        assert task.interaction_type == "production"
        assert task.files == []
        assert len(task.sources) == 1
        assert task.sources[0].kind == "original"
        assert task.sources[0].is_public
        assert len(task.lessons) == 1 and task.lessons[0].material_id == "integer-processing"
        assert {link.material_id for link in task.theory_links} == {"integer-processing"}
        assert {link.section for link in task.theory_links} == EXPECTED_SECTIONS[index]
        assert task.checker.answer_variants == [str(expected[index])]
        assert is_correct(task.checker, str(expected[index]))
        assert not is_correct(task.checker, str(expected[index] + 1))
        assert task.hint and task.explanation
        result = subprocess.run(
            [sys.executable, "-c", _solution_code(task)],
            capture_output=True,
            text=True,
            check=True,
        )
        assert result.stdout.strip() == str(expected[index]), task.id


@pytest.mark.parametrize("number", [1, 2, 3, 4, 36, 49, 97, 216])
def test_divisor_oracle_boundary_cases(number: int) -> None:
    proper = _proper_divisors(number)
    assert all(number % divisor == 0 and divisor < number for divisor in proper)
    assert len(proper) == len(set(proper))
    assert _is_prime(number) == (number in {2, 3, 97})
    if number == 36:
        assert proper == [1, 2, 3, 4, 6, 9, 12, 18]
    if number == 49:
        assert _all_divisors(number) == [1, 7, 49]


def test_task_25_public_projection_hides_checker() -> None:
    bank = _bank()
    for task_id in TASK_IDS:
        entry = next(item for item in bank.tasks if item.task.id == task_id)
        row = TaskRecord(
            id=task_id,
            content=entry.task.model_dump(exclude={"checker"}),
            solution_revision=entry.solution_revision,
            catalog_visible=False,
            archived=False,
        )
        projected = public_task(row, {})
        public_json = json.dumps(projected.model_dump(), ensure_ascii=False)
        assert "checker" not in public_json
        assert "answer_variants" not in public_json
        assert not hasattr(projected.content, "checker")
