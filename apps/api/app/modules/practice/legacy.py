"""Offline, deterministic conversion of the frozen first-import corpus.

The resulting package uses the existing validate/diff/import writer. This module
never connects to a database and never reads runtime publication definitions.
"""

import argparse
import copy
import hashlib
import json
import shutil
import tempfile
from pathlib import Path

from app.modules.content.schemas import Task
from app.modules.practice.files import MAX_PACKAGE, MAX_TASK, Package, checksum, safe_path
from app.modules.practice.schemas import Registry, TaskEdit


def encoded(value: object) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n").encode()


def convert(source: Path, output: Path, registry: Registry) -> Package:
    if output.exists() or output.is_symlink():
        raise FileExistsError("migration output already exists")
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".practice-convert-", dir=output.parent) as temporary:
        staged = Path(temporary) / "package"
        _convert(source, staged, registry)
        if output.exists() or output.is_symlink():
            raise FileExistsError("migration output already exists")
        staged.rename(output)
    return Package(output)


def _convert(source: Path, output: Path, registry: Registry) -> None:
    snapshot_path = safe_path(source, "snapshot.json")
    if snapshot_path.stat().st_size > MAX_TASK:
        raise ValueError("migration snapshot too large")
    snapshot = json.loads(snapshot_path.read_bytes())
    if snapshot["format"] != 1:
        raise ValueError("unsupported migration snapshot")
    total = 0
    for relative, digest in snapshot["inputs"].items():
        path = safe_path(source, relative)
        total += path.stat().st_size
        if total > MAX_PACKAGE or checksum(path) != digest:
            raise ValueError("migration source size/checksum mismatch")
    task_paths = sorted(name for name in snapshot["inputs"] if name.startswith("tasks/"))
    if not 0 < len(task_paths) <= 1000:
        raise ValueError("migration task limit exceeded")
    memberships: dict[str, list[dict]] = {}
    kinds: dict[str, str] = {}
    for material in snapshot["materials"]:
        if material["id"] in kinds or material["kind"] not in {"topic", "course"}:
            raise ValueError("ambiguous material")
        kinds[material["id"]] = material["kind"]
        if len(material["task_ids"]) != len(set(material["task_ids"])):
            raise ValueError("duplicate task membership")
        for position, task_id in enumerate(material["task_ids"]):
            memberships.setdefault(task_id, []).append(
                {"material_id": material["id"], "position": position}
            )
    entries = []
    output.mkdir()
    (output / "tasks").mkdir()
    files: dict[str, dict] = {}
    file_sources: dict[str, Path] = {}
    for relative in task_paths:
        path = safe_path(source, relative)
        if path.stat().st_size > MAX_TASK:
            raise ValueError("migration task too large")
        raw = json.loads(path.read_bytes())
        old = Task.model_validate(raw)
        if path.stem != old.id or old.id not in memberships:
            raise ValueError("unresolved migration task")
        links = memberships[old.id]
        if set(old.topic_ids + old.course_lesson_ids) != {m["material_id"] for m in links}:
            raise ValueError("migration membership mismatch")
        if any(kinds[m] != "topic" for m in old.topic_ids) or any(
            kinds[m] != "course" for m in old.course_lesson_ids
        ):
            raise ValueError("migration material kind mismatch")
        if snapshot["first_solution_revisions"].get(old.id) != 1:
            raise ValueError("invalid first-import revision")
        content = {key: copy.deepcopy(raw[key]) for key in ("statement", "hint", "explanation")}
        usages = []
        for area, blocks in content.items():
            for index, block in enumerate(blocks):
                if block["type"] not in {"attachment", "image", "diagram"}:
                    continue
                data = block["data"]
                prefix = "/content/tasks/"
                if not data["src"].startswith(prefix):
                    raise ValueError("unsupported legacy asset location")
                asset_name = "assets/" + data["src"][len(prefix) :]
                if asset_name not in snapshot["inputs"]:
                    raise ValueError("unresolved migration asset")
                asset = safe_path(source, asset_name)
                digest = checksum(asset)
                usage_id = f"{area}-{index}"
                attachment = block["type"] == "attachment"
                usages.append(
                    {
                        "id": usage_id,
                        "checksum": digest,
                        "purpose": "attachment" if attachment else "image",
                        "filename": data["label"] if attachment else asset.name,
                        "description": data["description"] if attachment else data["alt"],
                    }
                )
                files[digest] = {
                    "path": f"files/{digest}",
                    "checksum": digest,
                    "size_bytes": asset.stat().st_size,
                    "format": asset.suffix.removeprefix("."),
                }
                file_sources[digest] = asset
                block["data"] = (
                    {"usage_id": usage_id}
                    if attachment
                    else {
                        **{key: value for key, value in data.items() if key != "src"},
                        "usage_id": usage_id,
                    }
                )
        edit = TaskEdit.model_validate(
            {
                "expected_revision": 0,
                "reason": "Existing lesson practice first import",
                "task": {
                    "id": old.id,
                    "title": old.title,
                    "difficulty": old.difficulty,
                    "interaction_type": old.interaction_type,
                    "answer_instruction": (
                        "Введите ответ по условию задачи. Порядок значений важен."
                    ),
                    **content,
                    "files": usages,
                    "lessons": links,
                    "theory_links": [
                        {
                            "material_id": link["material_id"],
                            "section": reference.hash,
                            "label": reference.label,
                        }
                        for link in links
                        for reference in old.theory_links
                    ],
                    "checker": {
                        key: raw.get(key)
                        for key in ("checker_type", "answer_variants", "numeric_tolerance")
                    },
                    "sources": [
                        {
                            "kind": "unknown",
                            "role": "original",
                            "primary": True,
                            "title": None,
                            "author": None,
                            "original_id": None,
                            "url": None,
                            "year": None,
                            "adaptation": None,
                        }
                    ],
                    "catalog_visible": False,
                },
            }
        )
        name = f"tasks/{old.id}.json"
        payload = encoded(
            edit.model_dump(
                mode="json", exclude={"task": {"short_description", "explanation_kind"}}
            )
        )
        (output / name).write_bytes(payload)
        entries.append({"path": name, "checksum": hashlib.sha256(payload).hexdigest()})
    if set(memberships) != {Path(name).stem for name in task_paths} or set(
        snapshot["first_solution_revisions"]
    ) != set(memberships):
        raise ValueError("incomplete migration mapping")
    for digest, entry in files.items():
        target = output / entry["path"]
        target.parent.mkdir(exist_ok=True)
        shutil.copyfile(file_sources[digest], target)
    (output / "manifest.json").write_bytes(
        encoded(
            {
                "format": 1,
                "package_id": "lesson-practice-first-" + checksum(snapshot_path)[:32],
                "tasks": entries,
                "files": list(files.values()),
            }
        )
    )
    package = Package(output)
    package.validate(registry)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--registry", type=Path, required=True)
    args = parser.parse_args()
    package = convert(
        args.source, args.output, Registry.model_validate_json(args.registry.read_bytes())
    )
    print(
        json.dumps(
            {
                "package_id": package.manifest.package_id,
                "tasks": len(package.manifest.tasks),
                "checksum": package.checksum,
            }
        )
    )


if __name__ == "__main__":
    main()
