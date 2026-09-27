"""Focused content, checker, attachment and public-projection checks for EGE task 17."""

import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

import pytest
from pydantic import ValidationError

from app.modules.practice.models import FileObject, TaskRecord
from app.modules.practice.readers import public_task
from app.modules.practice.schemas import Bank, Block, CourseDefinition, MaterialDefinition, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
TASK_IDS = [f"task-17-{number:02d}" for number in range(1, 9)]
EXPECTED = [7, 52, 9, 23, 5, 44, 109, 31]
WRONG = [6, 51, 8, 22, 4, 43, 108, 30]


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _markdown(block: Block) -> str:
    if block.type != "text":
        raise AssertionError("expected a text block")
    return block.data.markdown


def _code(task: TaskData) -> str:
    for block in task.explanation:
        if block.type == "code_example":
            return block.data.code
    raise AssertionError(f"{task.id} has no Python solution example")


def test_material_status_has_no_review_stage() -> None:
    with pytest.raises(ValidationError):
        MaterialDefinition.model_validate(
            {"id": "example", "sections": ["intro"], "status": "review"}
        )
    with pytest.raises(ValidationError):
        CourseDefinition.model_validate(
            {"id": "example", "lesson_ids": ["lesson"], "status": "review"}
        )


def test_task_17_content_answers_files_and_progression(tmp_path: Path) -> None:
    bank = _bank()
    bank.validate_references()
    entries = [next(e for e in bank.tasks if e.task.id == task_id) for task_id in TASK_IDS]
    assert [e.task.checker.answer_variants[0] for e in entries] == [str(n) for n in EXPECTED]
    assert [e.task.difficulty for e in entries] == [1, 1, 1, 2, 2, 2, 3, 3]
    assert [e.task.lessons[0].position for e in entries] == list(range(8))

    material = next(m for m in bank.materials if m.id == "number-sequences")
    assert material.status == "published"
    assert material.sections == [
        "sequence-from-file",
        "single-values",
        "neighbor-pairs",
        "neighbor-triples",
        "two-passes",
        "verify-boundaries",
    ]

    pair_explanation = _markdown(entries[3].task.explanation[0])
    assert "(16, 7)" in pair_explanation
    assert "наибольшую сумму 23" in pair_explanation
    assert "строго" in _markdown(entries[4].task.explanation[0])
    assert "15, 17, 17" in _markdown(entries[4].task.explanation[0])
    assert "строго больше этого среднего" in _markdown(entries[6].task.statement[0])
    assert "строго больше" in _markdown(entries[6].task.explanation[0])
    assert "равные 50" in _markdown(entries[7].task.explanation[0])
    assert "условие не выполняют" in _markdown(entries[7].task.explanation[0])

    file_map = {item.checksum: item for item in bank.files}
    for index, entry in enumerate(entries):
        task = entry.task
        assert task.exam_numbers == []
        assert task.catalog_visible is False
        assert len(task.lessons) == 1 and task.lessons[0].material_id == "number-sequences"
        assert len(task.files) == 1 and task.files[0].purpose == "attachment"
        assert len(task.theory_links) == 1
        assert task.theory_links[0].material_id == "number-sequences"
        assert task.theory_links[0].section in material.sections

        usage = task.files[0]
        metadata = file_map[usage.checksum]
        data = (BANK_DIR / "files" / usage.checksum).read_bytes()
        assert hashlib.sha256(data).hexdigest() == usage.checksum == metadata.storage_key
        assert len(data) == metadata.size_bytes
        assert data.endswith(b"\n") and b"\r" not in data
        assert re.fullmatch(rb"-?\d+\n(?:-?\d+\n)*", data)
        numbers = [int(line) for line in data.decode("utf-8").splitlines()]
        if index >= 6:
            assert 100 <= len(numbers) <= 200

        # Independent calculation from the file values, separate from the authored snippets.
        if index == 0:
            independently_computed = sum(n > 20 and n % 3 == 0 for n in numbers)
        elif index == 1:
            independently_computed = max(n for n in numbers if n > 20 and n % 4 == 0)
        elif index == 2:
            independently_computed = sum(
                (numbers[i] + numbers[i + 1]) % 5 == 0 for i in range(len(numbers) - 1)
            )
        elif index == 3:
            independently_computed = max(
                numbers[i] + numbers[i + 1]
                for i in range(len(numbers) - 1)
                if numbers[i] % 2 == 0 and numbers[i + 1] % 2 != 0
            )
        elif index == 4:
            independently_computed = sum(
                numbers[i] > numbers[i - 1] and numbers[i] > numbers[i + 1]
                for i in range(1, len(numbers) - 1)
            )
            inclusive_count = sum(
                numbers[i] >= numbers[i - 1] and numbers[i] >= numbers[i + 1]
                for i in range(1, len(numbers) - 1)
            )
            assert inclusive_count == independently_computed + 1
        elif index == 5:
            independently_computed = max(
                sum(numbers[i - 1 : i + 2])
                for i in range(1, len(numbers) - 1)
                if numbers[i] % 4 == 0
            )
        elif index == 6:
            average = sum(numbers) / len(numbers)
            independently_computed = sum(
                numbers[i] + numbers[i + 1] > average for i in range(len(numbers) - 1)
            )
            inclusive_count = sum(
                numbers[i] + numbers[i + 1] >= average for i in range(len(numbers) - 1)
            )
            assert inclusive_count == independently_computed + 10
        else:
            average = sum(numbers) / len(numbers)
            independently_computed = sum(
                numbers[i] > average and numbers[i - 1] < average and numbers[i + 1] < average
                for i in range(1, len(numbers) - 1)
            )
            inclusive_count = sum(
                numbers[i] >= average and numbers[i - 1] < average and numbers[i + 1] < average
                for i in range(1, len(numbers) - 1)
            )
            assert inclusive_count == independently_computed + 32

        expected = EXPECTED[index]
        assert independently_computed == expected
        assert is_correct(task.checker, str(expected))
        assert not is_correct(task.checker, str(WRONG[index]))

        code = _code(task)
        (tmp_path / "numbers.txt").write_bytes(data)
        result = subprocess.run(
            [sys.executable, "-c", code],
            cwd=tmp_path,
            capture_output=True,
            text=True,
            check=True,
        )
        assert result.stdout.strip() == str(expected)


@pytest.mark.parametrize("task_id", TASK_IDS)
def test_task_17_public_projection_excludes_checker_and_private_source(task_id: str) -> None:
    entry = next(e for e in _bank().tasks if e.task.id == task_id)
    private_content = entry.task.model_dump(exclude={"checker"})
    private_content["sources"].append(
        {
            "url": "https://example.invalid/internal-source",
            "kind": "bank",
            "role": "copy",
            "year": None,
            "title": "Private editorial reference",
            "author": None,
            "primary": False,
            "is_public": False,
            "adaptation": None,
            "original_id": "private-17-reference",
        }
    )
    usage = entry.task.files[0]
    metadata = next(item for item in _bank().files if item.checksum == usage.checksum)
    row = TaskRecord(
        id=entry.task.id,
        content=private_content,
        solution_revision=entry.solution_revision,
        catalog_visible=False,
        archived=False,
    )
    file_object = FileObject(
        checksum=metadata.checksum,
        storage_key=metadata.storage_key,
        format=metadata.format,
        mime_type=metadata.mime_type,
        size_bytes=metadata.size_bytes,
    )

    projected = public_task(row, {metadata.checksum: file_object})
    public_json = json.dumps(projected.model_dump(), ensure_ascii=False)
    assert "checker" not in public_json and "answer_variants" not in public_json
    assert "Private editorial reference" not in public_json
    assert "private-17-reference" not in public_json
    assert not hasattr(projected.content, "checker")
    assert len(projected.content.files) == 1
    assert projected.deliveries[0].size_bytes == metadata.size_bytes
