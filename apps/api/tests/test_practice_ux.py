"""Presentation upgrades preserve the learner's problem and operator invariants."""

import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from app.modules.practice.files import Package
from app.modules.practice.schemas import Registry, TaskData
from app.modules.practice.service import solution_changed
from app.modules.practice.ux_editorial import prepare

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "content/practice-imports/120-ege-5-16"
PACKAGE = ROOT / "content/practice-imports/121-practice-ux/package"
REGISTRY = Registry.model_validate_json((ROOT / "apps/api/practice-registry.json").read_bytes())


def linear(blocks):
    result = []
    for block in blocks:
        if block["type"] == "rich_text":
            result.append(
                {
                    "type": "text",
                    "data": {
                        "markdown": "".join(
                            span["text"] if span["kind"] == "text" else "`" + span["text"] + "`"
                            for span in block["data"]["spans"]
                        )
                    },
                }
            )
        elif block["type"] == "code_variants":
            result.extend(
                {
                    "type": "code_example",
                    "data": {"language": v["language"], "code": v["code"], "caption": v["label"]},
                }
                for v in block["data"]["variants"]
            )
        else:
            result.append(block)
    return result


def test_entire_editorial_package_preserves_problem_answers_and_progress():
    package = Package(PACKAGE)
    package.validate(REGISTRY)
    assert len(package.manifest.tasks) == 547
    groups = 0
    for edit in package.edits():
        old_path = SOURCE / "corrections/tasks" / f"{edit.task.id}.json"
        if not old_path.exists():
            old_path = SOURCE / "package/tasks" / f"{edit.task.id}.json"
        old = TaskData.model_validate(json.loads(old_path.read_bytes())["task"])
        assert not solution_changed(old, edit.task, edit.mode)
        assert edit.task.checker == old.checker
        assert edit.task.sources == old.sources
        assert edit.task.lessons == old.lessons
        assert edit.task.theory_links == old.theory_links
        assert linear(edit.task.model_dump()["statement"]) == old.model_dump()["statement"]
        assert edit.task.explanation == old.explanation
        assert edit.task.short_description and edit.task.skills
        groups += sum(b.type == "code_variants" for b in edit.task.statement)
    assert groups == 8


def test_old_packages_keep_neutral_defaults_and_version_guard():
    raw = json.loads(next((SOURCE / "package/tasks").glob("*.json")).read_bytes())["task"]
    old = TaskData.model_validate(raw)
    assert old.short_description is None
    assert old.explanation_kind == "unclassified"
    raw["statement"] = [
        {"type": "rich_text", "data": {"spans": [{"kind": "formula", "text": "F(n)"}]}}
    ]
    with pytest.raises(ValidationError, match="version 2"):
        TaskData.model_validate(raw)
    raw["content_schema_version"] = 2
    assert TaskData.model_validate(raw).statement[0].type == "rich_text"
    raw["statement"][0]["data"]["spans"][0]["kind"] = "html"
    with pytest.raises(ValidationError):
        TaskData.model_validate(raw)


def test_package_reproduction_is_deterministic(tmp_path):
    output = tmp_path / "package"
    reproduced = prepare(SOURCE, output, REGISTRY)
    assert reproduced.checksum == Package(PACKAGE).checksum
    with pytest.raises(FileExistsError):
        prepare(SOURCE, output, REGISTRY)
