"""Independent content, file, ordering and checker checks for EGE task 26."""

import hashlib
import itertools
import subprocess
import sys
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
TASK_IDS = [f"task-26-{number:02d}" for number in range(1, 8)]
EXPECTED = ["12", "3", "9", "14", "2", "10 6", "1 18"]
WRONG = ["18", "4", "8", "6", "3", "10 8", "2 18"]
SECTIONS = [
    {"sorted-order"},
    {"capacity-selection"},
    {"secondary-optimum"},
    {"file-records"},
    {"event-stream"},
    {"event-stream", "independent-check"},
    {"event-stream", "independent-check"},
]


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _code(task: TaskData) -> str:
    examples = [block.data.code for block in task.explanation if block.type == "code_example"]
    assert len(examples) == 1, task.id
    return examples[0]


def _task_text(task: TaskData) -> str:
    return "\n".join(block.data.markdown for block in task.statement if block.type == "text")


def _backup_sizes_at_cutoff(records: list[tuple[str, str, int]]) -> list[int]:
    buffer_size = 0
    completed: list[int] = []
    for time, _client_id, volume in records:
        if buffer_size + volume > 10:
            if time <= "11:59:59":
                completed.append(buffer_size)
            buffer_size = 0
        buffer_size += volume
    return completed


def _strictly_greatest_client(totals: dict[str, int]) -> str | None:
    ranked = sorted(totals.items(), key=lambda item: item[1], reverse=True)
    if len(ranked) < 2 or ranked[0][1] == ranked[1][1]:
        return None
    return ranked[0][0]


def _independent_answers(bank: Bank) -> list[str]:
    by_id = {entry.task.id: entry.task for entry in bank.tasks}

    values = [18, 12, 18, 7, 12, 20]
    answer_01 = str(sorted(values)[2])

    weights = [7, 3, 5, 4, 6, 2]
    capacity_02 = 13
    feasible_counts = [
        len(choice)
        for size in range(len(weights) + 1)
        for choice in itertools.combinations(weights, size)
        if sum(choice) <= capacity_02
    ]
    answer_02 = str(max(feasible_counts))

    sizes = [2, 3, 4, 5, 7, 8, 9, 10]
    capacity_03 = 18
    feasible = [
        choice
        for size in range(len(sizes) + 1)
        for choice in itertools.combinations(sizes, size)
        if sum(choice) <= capacity_03
    ]
    maximal_count = max(map(len, feasible))
    answer_03 = str(max(max(choice) for choice in feasible if len(choice) == maximal_count))

    records_path = _attached_path(bank, by_id["task-26-04"])
    records_lines = records_path.read_text().splitlines()
    assert int(records_lines[0]) == len(records_lines) - 1
    records = [tuple(map(int, line.split())) for line in records_lines[1:]]
    ordered_records = sorted(enumerate(records), key=lambda row: (-row[1][1], row[0]))
    answer_04 = str(ordered_records[2][1][0])

    events_path = _attached_path(bank, by_id["task-26-05"])
    totals: dict[str, int] = {}
    for line in events_path.read_text().splitlines():
        timestamp, group, points = line.split()
        hour, minute = map(int, timestamp.split(":"))
        if hour * 60 + minute <= 10 * 60:
            totals[group] = totals.get(group, 0) + int(points)
    answer_05 = str(sum(total >= 7 for total in totals.values()))

    backup_path = _attached_path(bank, by_id["task-26-06"])
    buffer_size = 0
    eligible_backups: list[int] = []
    for line in backup_path.read_text().splitlines():
        timestamp, raw_size = line.split()
        size = int(raw_size)
        if buffer_size + size > 10:
            timestamp_parts = tuple(map(int, timestamp.split(":")))
            timestamp_parts += (0,) * (3 - len(timestamp_parts))
            if timestamp_parts <= (11, 59, 59):
                eligible_backups.append(buffer_size)
            buffer_size = 0
        buffer_size += size
    answer_06 = " ".join(map(str, sorted(eligible_backups, reverse=True)[:2]))

    integrated_path = _attached_path(bank, by_id["task-26-07"])
    integrated_records = [
        (time, client_id, int(volume))
        for time, client_id, volume in (
            line.split() for line in integrated_path.read_text().splitlines()
        )
    ]
    client_totals: dict[str, int] = {}
    for _time, client_id, volume in integrated_records:
        client_totals[client_id] = client_totals.get(client_id, 0) + volume
    winner = _strictly_greatest_client(client_totals)
    assert winner is not None
    integrated_backups = _backup_sizes_at_cutoff(integrated_records)
    answer_07 = f"{winner} {sum(sorted(integrated_backups, reverse=True)[:2])}"

    return [answer_01, answer_02, answer_03, answer_04, answer_05, answer_06, answer_07]


def _attached_path(bank: Bank, task: TaskData) -> Path:
    assert len(task.files) == 1, task.id
    return BANK_DIR / "files" / task.files[0].checksum


def test_task_26_answers_files_and_ordered_lesson_progression(tmp_path: Path) -> None:
    bank = _bank()
    bank.validate_references()
    material = next(item for item in bank.materials if item.id == "array-processing")
    assert material.kind == "topic" and material.status == "published"
    assert material.sections == [
        "sorted-order",
        "file-records",
        "capacity-selection",
        "secondary-optimum",
        "event-stream",
        "independent-check",
    ]

    entries = [
        next(entry for entry in bank.tasks if entry.task.id == task_id) for task_id in TASK_IDS
    ]
    assert _independent_answers(bank) == EXPECTED
    assert [entry.task.difficulty for entry in entries] == [1, 2, 2, 2, 3, 3, 3]
    assert [entry.task.lessons[0].position for entry in entries] == list(range(7))

    file_map = {item.checksum: item for item in bank.files}
    for index, entry in enumerate(entries):
        task = entry.task
        assert task.exam_numbers == []
        assert task.catalog_visible is False and task.archived is False
        assert task.interaction_type == "production"
        assert task.lessons[0].material_id == "array-processing"
        assert {link.material_id for link in task.theory_links} == {"array-processing"}
        assert {link.section for link in task.theory_links} == SECTIONS[index]
        assert len(task.sources) == 1
        assert task.sources[0].kind == "original" and task.sources[0].is_public
        assert task.checker.answer_variants == [EXPECTED[index]]
        assert is_correct(task.checker, EXPECTED[index])
        assert not is_correct(task.checker, WRONG[index])
        assert task.hint and task.explanation

        if index < 3:
            assert task.files == []
        else:
            assert len(task.files) == 1 and task.files[0].purpose == "attachment"
            usage = task.files[0]
            metadata = file_map[usage.checksum]
            data = (BANK_DIR / "files" / usage.checksum).read_bytes()
            assert hashlib.sha256(data).hexdigest() == usage.checksum == metadata.storage_key
            assert len(data) == metadata.size_bytes
            assert data.endswith(b"\n") and b"\r" not in data
            (tmp_path / usage.filename).write_bytes(data)

        result = subprocess.run(
            [sys.executable, "-c", _code(task)],
            cwd=tmp_path,
            capture_output=True,
            text=True,
            check=True,
        )
        assert result.stdout.strip() == EXPECTED[index], task.id


def test_task_26_boundaries_and_counterexamples_are_explicit() -> None:
    bank = _bank()
    tasks = {entry.task.id: entry.task for entry in bank.tasks if entry.task.id in TASK_IDS}

    assert "Одинаковые числа остаются в списке" in _task_text(tasks["task-26-01"])
    assert "не более `13` кг" in _task_text(tasks["task-26-02"])
    assert "не превысит 10" in _task_text(tasks["task-26-06"])
    assert "не позже 11:59:59 включительно" in _task_text(tasks["task-26-06"])
    assert "порядке файла" in _task_text(tasks["task-26-06"])
    integrated_text = _task_text(tasks["task-26-07"])
    assert "в том числе запросов после 11:59:59" in integrated_text
    assert "строго наибольшим" in integrated_text
    assert "11:59:59 включительно" in integrated_text

    # Four lightest objects exceed 13, so no choice of four can fit.
    assert sum(sorted([7, 3, 5, 4, 6, 2])[:4]) == 14
    # The secondary optimum replaces 5 with 9; replacing it with 10 exceeds capacity.
    assert 2 + 3 + 4 + 9 <= 18
    assert 2 + 3 + 4 + 10 > 18

    records_task = tasks["task-26-04"]
    records_lines = _attached_path(bank, records_task).read_text().splitlines()
    assert records_lines == [
        "8",
        "11 68",
        "12 91",
        "13 74",
        "14 91",
        "15 86",
        "16 91",
        "17 74",
        "18 95",
    ]
    assert (
        sorted(
            (tuple(map(int, line.split())) for line in records_lines[1:]),
            key=lambda record: -record[1],
        )[2][0]
        == 14
    )

    backup_task = tasks["task-26-06"]
    backup_lines = _attached_path(bank, backup_task).read_text().splitlines()
    assert backup_lines[1] == "09:10:00 4"  # exact fit after the first request
    assert backup_lines[6:8] == ["11:59:59 8", "11:59:59 2"]  # equal-time file order matters
    assert backup_lines[8] == "12:00:00 1"  # starts a backup outside the cutoff

    def completed_by_cutoff(lines: list[str]) -> list[int]:
        buffer_size = 0
        completed: list[int] = []
        for line in lines:
            timestamp, raw_size = line.split()
            size = int(raw_size)
            if buffer_size + size > 10:
                time_parts = tuple(map(int, timestamp.split(":")))
                time_parts += (0,) * (3 - len(time_parts))
                if time_parts <= (11, 59, 59):
                    completed.append(buffer_size)
                buffer_size = 0
            buffer_size += size
        return completed

    assert completed_by_cutoff(backup_lines) == [10, 5, 6]
    reordered_ties = backup_lines[:6] + [backup_lines[7], backup_lines[6]] + backup_lines[8:]
    assert completed_by_cutoff(reordered_ties) == [10, 5, 8]
    assert sorted(completed_by_cutoff(backup_lines), reverse=True)[:2] == [10, 6]
    assert sorted(completed_by_cutoff(reordered_ties), reverse=True)[:2] == [10, 8]

    integrated_path = _attached_path(bank, tasks["task-26-07"])
    integrated_lines = integrated_path.read_text().splitlines()
    assert integrated_lines[5:7] == ["11:59:59 1 7", "11:59:59 3 3"]
    assert integrated_lines[7] == "12:00:00 2 2"
    integrated_records = [
        (time, client_id, int(volume))
        for time, client_id, volume in (line.split() for line in integrated_lines)
    ]
    assert _backup_sizes_at_cutoff(integrated_records) == [10, 8, 4]

    reordered_integrated = (
        integrated_records[:5]
        + [integrated_records[6], integrated_records[5]]
        + integrated_records[7:]
    )
    assert _backup_sizes_at_cutoff(reordered_integrated) == [10, 8, 7]

    assert _strictly_greatest_client({"1": 12, "2": 10, "4": 9, "3": 3}) == "1"
    assert _strictly_greatest_client({"1": 12, "2": 12}) is None
