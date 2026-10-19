"""The files of the topic lessons' bank tasks (Change 184, 190, 197).

Each attachment must be stored under its checksum and have the MIME type the API serves
for its format. A data file the lessons also read lives in ``content/lesson-files/topic-NN/``
and must be byte for byte the attached one; a generated book (``.xlsx``) exists only in
the bank.
"""

import hashlib
import json
from pathlib import Path

import pytest

from app.modules.practice.files import MIME
from app.modules.practice.schemas import Bank

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK = ROOT / "content/practice-bank"
LESSON_FILES = ROOT / "content/lesson-files"
REGISTRY = ROOT / "apps/api/practice-registry.json"


def _topics() -> set[str]:
    """Material ids of the topic lessons on the site."""
    registry = json.loads(REGISTRY.read_text())
    return {m["id"] for m in registry["materials"] if m["kind"] == "topic"}


def test_topic_task_files_are_stored_and_match_the_lesson_files() -> None:
    bank = Bank.model_validate_json((BANK / "bank.json").read_bytes())
    records = {record.checksum: record for record in bank.files}
    topics = _topics()
    checked = set()
    for entry in bank.tasks:
        task = entry.task
        if task.archived or not any(link.material_id in topics for link in task.lessons):
            continue
        for file in task.files:
            record = records[file.checksum]
            data = (BANK / "files" / record.storage_key).read_bytes()
            assert hashlib.sha256(data).hexdigest() == file.checksum, task.id
            assert record.size_bytes == len(data), task.id
            suffix = Path(file.filename).suffix.lstrip(".")
            assert record.format == suffix, task.id
            assert record.mime_type == MIME[suffix], task.id
            # a topic task's id carries its exam number: task-26-…
            lesson_file = LESSON_FILES / f"topic-{task.id.split('-')[1]}" / file.filename
            if suffix == "xlsx":
                assert not lesson_file.exists(), f"{task.id}: a generated book lives in the bank"
            else:
                assert lesson_file.read_bytes() == data, task.id
            checked.add(task.id)
    # topics 3, 9, 17, 18, 22, 23, 24, 26 and 27 work with files; topic 1 shows its
    # schemes as PNG images of the figure builder (Change 190)
    prefixes = {task_id.split("-")[1] for task_id in checked}
    assert prefixes == {"1", "3", "9", "17", "18", "22", "23", "24", "26", "27"}
