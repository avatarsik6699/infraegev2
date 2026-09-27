"""Focused content, checker, attachment and public-projection checks for EGE task 24."""

import contextlib
import hashlib
import io
import itertools
import json
import re
import subprocess
import sys
from pathlib import Path
from unittest.mock import mock_open, patch

import pytest

from app.modules.practice.models import FileObject, TaskRecord
from app.modules.practice.readers import public_task
from app.modules.practice.schemas import Bank, Block, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
TASK_IDS = [f"task-24-{number:02d}" for number in range(1, 9)]
EXPECTED = [4, 5, 7, 9, 4, 6, 8, 81]
WRONG = [3, 4, 6, 8, 3, 5, 7, 80]
SECTIONS = [
    "adjacent-and-overlapping",
    "longest-valid-run",
    "longest-valid-run",
    "occurrence-limit",
    "expression-grammar",
    "expression-grammar",
    "expression-grammar",
    "linear-expression-scan",
]


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


def _is_expression(value: str, *, allow_zero: bool = True) -> bool:
    """Independent small-input parser for the task's complete expression grammar."""
    if not value:
        return False
    position = 0

    def read_number(start: int) -> int | None:
        if start >= len(value):
            return None
        if allow_zero and value[start] == "0":
            return start + 1
        if value[start] not in "6789":
            return None
        end = start + 1
        following_digits = "06789" if allow_zero else "6789"
        while end < len(value) and value[end] in following_digits:
            end += 1
        return end

    end = read_number(position)
    if end is None:
        return False
    position = end
    while position < len(value):
        if value[position] not in "-*":
            return False
        end = read_number(position + 1)
        if end is None:
            return False
        position = end
    return True


def _brute_longest_expression(value: str) -> int:
    return max(
        (
            end - start
            for start in range(len(value))
            for end in range(start + 1, len(value) + 1)
            if _is_expression(value[start:end])
        ),
        default=0,
    )


def _run_code_with_text(code: str, text: str) -> str:
    output = io.StringIO()
    with patch("builtins.open", mock_open(read_data=text)), contextlib.redirect_stdout(output):
        exec(compile(code, "task-24-solution.py", "exec"), {})
    return output.getvalue().strip()


def test_task_24_content_answers_files_and_ordered_lesson_progression(tmp_path: Path) -> None:
    bank = _bank()
    bank.validate_references()
    entries = [
        next(entry for entry in bank.tasks if entry.task.id == task_id) for task_id in TASK_IDS
    ]
    material = next(item for item in bank.materials if item.id == "string-processing")
    expected_sections = [
        "file-and-string",
        "positions-and-fragments",
        "adjacent-and-overlapping",
        "longest-valid-run",
        "occurrence-limit",
        "expression-grammar",
        "linear-expression-scan",
        "independent-verification",
    ]
    assert material.status == "published"
    assert material.sections == expected_sections
    assert [entry.task.checker.answer_variants[0] for entry in entries] == [
        str(number) for number in EXPECTED
    ]
    assert [entry.task.difficulty for entry in entries] == [1, 1, 2, 2, 2, 3, 3, 3]
    assert [entry.task.lessons[0].position for entry in entries] == list(range(8))
    assert "если они используют общие символы" in _markdown(entries[0].task.statement[0])

    file_map = {item.checksum: item for item in bank.files}
    for index, entry in enumerate(entries):
        task = entry.task
        assert task.exam_numbers == []
        assert task.catalog_visible is False
        assert task.archived is False
        assert len(task.lessons) == 1 and task.lessons[0].material_id == "string-processing"
        assert len(task.files) == 1 and task.files[0].purpose == "attachment"
        assert len(task.theory_links) == 1
        assert task.theory_links[0].material_id == "string-processing"
        assert task.theory_links[0].section == SECTIONS[index]

        usage = task.files[0]
        metadata = file_map[usage.checksum]
        data = (BANK_DIR / "files" / usage.checksum).read_bytes()
        assert hashlib.sha256(data).hexdigest() == usage.checksum == metadata.storage_key
        assert len(data) == metadata.size_bytes
        assert data.endswith(b"\n") and b"\r" not in data
        text = data.decode("utf-8").strip()

        if index == 0:
            independent = sum(text.startswith("ABA", start) for start in range(len(text) - 2))
        elif index == 1:
            runs = re.findall(r"[ABC]+", text)
            independent = max(map(len, runs), default=0)
        elif index == 2:
            independent = max(
                (
                    end - start
                    for start in range(len(text))
                    for end in range(start + 1, len(text) + 1)
                    if "XY" not in text[start:end]
                ),
                default=0,
            )
        elif index == 3:
            independent = max(
                (
                    end - start
                    for start in range(len(text))
                    for end in range(start + 1, len(text) + 1)
                    if sum(text.startswith("ABA", position) for position in range(start, end - 2))
                    <= 2
                ),
                default=0,
            )
        elif index == 4:
            lines = text.splitlines()
            independent = sum(_is_expression(line, allow_zero=False) for line in lines)
        elif index == 5:
            independent = sum(_is_expression(line) for line in text.splitlines())
        elif index == 6:
            segments = text.split("|")
            independent = max(
                (_brute_longest_expression(segment) for segment in segments),
                default=0,
            )
            assert len(data) >= 8_000
            assert len(segments) == len(set(segments)) == 1_025
            length_eight = [
                segment[start : start + 8]
                for segment in segments
                for start in range(len(segment) - 7)
                if _is_expression(segment[start : start + 8])
            ]
            assert length_eight == ["9-68-7*0"]
        else:
            independent = max(
                (_brute_longest_expression(part) for part in text.split("|")),
                default=0,
            )
            assert len(data) >= 100_000
            assert text.count("9" + "*8" * 40) == 1

        expected = EXPECTED[index]
        assert independent == expected
        assert is_correct(task.checker, str(expected))
        assert not is_correct(task.checker, str(WRONG[index]))

        code = _code(task)
        filename = usage.filename
        (tmp_path / filename).write_bytes(data)
        result = subprocess.run(
            [sys.executable, "-c", code],
            cwd=tmp_path,
            capture_output=True,
            text=True,
            check=True,
        )
        assert result.stdout.strip() == str(expected)


def test_task_24_expression_examples_match_independent_short_string_oracle() -> None:
    assert not _is_expression("60", allow_zero=False)
    assert _is_expression("60")
    bank = _bank()
    task = next(entry.task for entry in bank.tasks if entry.task.id == "task-24-08")
    code = _code(task)
    alphabet = "06789-*X"
    for length in range(5):
        for symbols in itertools.product(alphabet, repeat=length):
            text = "".join(symbols)
            assert _run_code_with_text(code, text) == str(_brute_longest_expression(text)), text

    for edge_case, expected in {
        "7-0": 3,
        "-0*7": 3,
        "07": 1,
        "68-0*7": 6,
        "6--7": 1,
        "7*": 1,
        "00": 1,
        "": 0,
    }.items():
        assert _run_code_with_text(code, edge_case) == str(expected), edge_case


def test_task_24_public_projection_hides_checker_answers_and_private_source() -> None:
    bank = _bank()
    for task_id in TASK_IDS:
        entry = next(item for item in bank.tasks if item.task.id == task_id)
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
                "original_id": "private-24-reference",
            }
        )
        usage = entry.task.files[0]
        metadata = next(item for item in bank.files if item.checksum == usage.checksum)
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
        assert "private-24-reference" not in public_json
        assert not hasattr(projected.content, "checker")
        assert len(projected.content.files) == 1
        assert projected.deliveries[0].size_bytes == metadata.size_bytes
