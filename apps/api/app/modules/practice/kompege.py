"""Offline preparation of an explicitly captured KEGE selection for the operator CLI.

Source answers are trusted, never independently solved or silently corrected here.
The source snapshot and identity mapping are editorial inputs, not runtime fallback.
"""

import argparse
import hashlib
import json
import re
from pathlib import Path
from uuid import UUID

from app.modules.practice.files import MAX_PACKAGE, Package, checksum, safe_path
from app.modules.practice.kompege_content import blocks
from app.modules.practice.legacy import encoded
from app.modules.practice.schemas import Registry, TaskEdit


def prepare(source: Path, output: Path, registry: Registry) -> Package:
    if output.exists() or output.is_symlink():
        raise FileExistsError("package output already exists")
    source_path = safe_path(source, "source.json")
    if source_path.stat().st_size > MAX_PACKAGE:
        raise ValueError("source snapshot exceeds package limit")
    snapshot = json.loads(source_path.read_bytes())
    identities = json.loads(safe_path(source, "identity.json").read_bytes())
    tasks = snapshot["tasks"]
    if not 0 < len(tasks) <= 1000 or len({t["taskId"] for t in tasks}) != len(tasks):
        raise ValueError("duplicate IDs or invalid selection size")
    if set(identities) != {str(t["taskId"]) for t in tasks}:
        raise ValueError("identity mapping does not match source selection")
    if len(set(identities.values())) != len(identities):
        raise ValueError("duplicate internal UUID")
    # Full editorial blocks can be corrected independently without re-fetching source content.
    edits_path = source / "editorial.json"
    editorial = json.loads(edits_path.read_bytes())
    prepared = []
    summary = []
    for item in tasks:
        task_id = str(UUID(identities[str(item["taskId"])]))
        if item["number"] not in (5, 16) or item["difficulty"] not in (0, 1, 2, 3):
            raise ValueError("unexpected source classification")
        if item["files"] or item["subTask"] or item["table"]:
            raise ValueError("source contains additional payload requiring editorial review")
        if not re.fullmatch(r"\s*[-+]?\d+\s*", item["key"]):
            raise ValueError("answer needs an explicit input instruction")
        statement = blocks(item["text"])
        has_solution = bool(item["solve_text"].strip())
        authored = editorial[str(item["taskId"])]
        explanation = authored.get("explanation")
        if explanation is None:
            if not has_solution:
                raise ValueError("missing authored explanation")
            explanation = blocks(item["solve_text"])
        hint = authored["hint"]
        title = authored["title"]
        original = item["comment"].strip() or None
        years = set(re.findall(r"(?<!\d)(?:19|20)\d{2}(?!\d)", original or ""))
        year = int(next(iter(years))) if len(years) == 1 else None
        material = "preobrazovanie-zapisey-chisel" if item["number"] == 5 else "rekursiya"
        label = "Преобразование записей чисел" if item["number"] == 5 else "Рекурсия"
        task = {
            "id": task_id,
            "title": title,
            "difficulty": min(item["difficulty"] + 1, 3),
            "answer_instruction": "Запишите целое число в десятичной системе счисления.",
            "statement": statement,
            "hint": hint,
            "explanation": explanation,
            "checker": {"checker_type": "exact_match", "answer_variants": [item["key"]]},
            "sources": [
                {
                    "kind": "bank" if original else "unknown",
                    "role": "original",
                    "primary": True,
                    "title": original,
                    "author": None,
                    "year": year,
                    "url": None,
                    "original_id": None,
                    "adaptation": None,
                    "is_public": True,
                },
                {
                    "kind": "bank",
                    "role": "copy",
                    "primary": False,
                    "title": "КЕГЭ",
                    "author": None,
                    "year": None,
                    "original_id": str(item["taskId"]),
                    "url": f"https://kompege.ru/task?id={item['taskId']}",
                    "adaptation": None,
                    "is_public": False,
                },
            ],
            "exam_numbers": [item["number"]],
            "catalog_visible": True,
            "archived": False,
            "theory_links": [{"material_id": material, "section": None, "label": label}],
        }
        edit = TaskEdit.model_validate(
            {
                "task": task,
                "expected_revision": 0,
                "reason": "Initial exam bank import; source answer retained",
            }
        )
        prepared.append(edit)
        summary.append(
            {
                "id": task_id,
                "source_id": item["taskId"],
                "exam_number": item["number"],
                "explanation": "authored" if "explanation" in authored else "source",
                "answer_verification": "source-trusted; human mathematical review pending",
            }
        )
    # A new output directory is required; committed package bytes are never overwritten.
    output.mkdir(parents=True)
    (output / "tasks").mkdir()
    entries = []
    for edit in prepared:
        name = f"tasks/{edit.task.id}.json"
        (output / name).write_bytes(encoded(edit.model_dump(mode="json")))
        entries.append({"path": name, "checksum": checksum(output / name)})
    digest = hashlib.sha256(encoded(entries)).hexdigest()
    manifest = {"format": 1, "package_id": f"ege-5-16-{digest[:24]}", "tasks": entries, "files": []}
    (output / "manifest.json").write_bytes(encoded(manifest))
    output.with_suffix(".report.json").write_bytes(
        encoded(
            {
                "source_checksum": checksum(source_path),
                "identity_checksum": checksum(source / "identity.json"),
                "editorial_checksum": checksum(edits_path),
                "retrieved_at": snapshot["retrieved_at"],
                "tasks": summary,
                "counts": {str(n): sum(t["number"] == n for t in tasks) for n in (5, 16)},
                "independent_answer_computation": False,
            }
        )
    )
    package = Package(output)
    package.validate(registry)
    return package


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--registry", type=Path, required=True)
    args = parser.parse_args()
    package = prepare(
        args.source, args.output, Registry.model_validate_json(args.registry.read_bytes())
    )
    print(
        json.dumps(
            {
                "status": "prepared",
                "tasks": len(package.manifest.tasks),
                "package_id": package.manifest.package_id,
                "checksum": package.checksum,
            }
        )
    )


if __name__ == "__main__":
    main()
