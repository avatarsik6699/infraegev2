"""The files of the topic lessons' bank tasks are the stand's own files (Change 184).

Every topic moved to the site from ``content/lesson-design/topic-NN/`` attaches the data
files of its stand. Each attachment must be stored under its checksum, have the MIME type
the API serves for its format and be byte for byte the stand file of the same name.
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
STAND = ROOT / "content/lesson-design"


def _topics() -> dict[str, Path]:
    """Material id of each topic lesson on the site → its stand folder."""
    topics = {}
    for path in sorted(STAND.glob("topic-*/topic.json")):
        site = json.loads(path.read_text()).get("site")
        if site:
            topics[site["id"]] = path.parent
    return topics


def test_topic_task_files_are_the_stand_files_with_their_mime_type() -> None:
    bank = Bank.model_validate_json((BANK / "bank.json").read_bytes())
    records = {record.checksum: record for record in bank.files}
    topics = _topics()
    checked = set()
    for entry in bank.tasks:
        task = entry.task
        stands = [topics[link.material_id] for link in task.lessons if link.material_id in topics]
        if task.archived or not stands:
            continue
        for file in task.files:
            record = records[file.checksum]
            data = (BANK / "files" / record.storage_key).read_bytes()
            assert hashlib.sha256(data).hexdigest() == file.checksum, task.id
            assert record.size_bytes == len(data), task.id
            suffix = Path(file.filename).suffix.lstrip(".")
            assert record.format == suffix, task.id
            assert record.mime_type == MIME[suffix], task.id
            assert (stands[0] / "files" / file.filename).read_bytes() == data, task.id
            checked.add(task.id)
    # topics 3, 9, 17, 18, 23, 24, 26 and 27 work with files
    prefixes = {task_id.split("-")[1] for task_id in checked}
    assert prefixes == {"3", "9", "17", "18", "23", "24", "26", "27"}
