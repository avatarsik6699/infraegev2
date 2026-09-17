"""Reproducible editorial-only upgrade of the frozen 120 bank; no answer computation."""

import argparse
import copy
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

from app.modules.practice.files import Package, checksum
from app.modules.practice.legacy import encoded
from app.modules.practice.schemas import Registry, TaskEdit

# Reviewed source tables explicitly present the procedure in parallel languages.
# This allowlist is editorial input, never a runtime adjacency heuristic.
CODE_GROUPS = {600, 601, 602, 603, 604, 605, 3772, 9945}


def preview(statement: list[dict]) -> str:
    paragraphs = [b["data"]["markdown"] for b in statement if b["type"] == "text"]
    paragraphs = [re.sub(r"(?i)\s*В ответе.*$", "", p).strip() for p in paragraphs]
    paragraphs = [p for p in paragraphs if p]
    candidates = [
        p
        for p in paragraphs
        if re.search(r"(?i)(найдите|укажите|определите|сколько|чему|назовите)", p)
    ]
    value = candidates[-1] if candidates else paragraphs[-1]
    value = re.sub(r"(?i)\s*В ответе.*$", "", value).replace("`", "")
    value = re.sub(r"\s+", " ", value).strip()
    return value if len(value) <= 300 else value[:296].rsplit(" ", 1)[0] + "…"


def presentation(statement: list[dict], original_id: int) -> list[dict]:
    result = []
    code = [b for b in statement if b["type"] == "code_example"]
    if original_id in CODE_GROUPS:
        assert len(code) == 3
        assert {b["data"]["caption"] for b in code} in (
            {"Python", "C++", "Pascal"},
            {"Python", "C++", "Паскаль"},
        )
    for block in statement:
        if block["type"] == "code_example" and original_id in CODE_GROUPS:
            if block is code[0]:
                result.append(
                    {
                        "type": "code_variants",
                        "data": {
                            "variants": [
                                {
                                    "label": b["data"]["caption"],
                                    "language": b["data"]["language"],
                                    "code": b["data"]["code"],
                                }
                                for b in code
                            ]
                        },
                    }
                )
        elif block["type"] == "text" and "`" in block["data"]["markdown"]:
            # Frozen source has no literal backticks: these delimit converted LaTeX only.
            parts = re.split(r"(`[^`]+`)", block["data"]["markdown"])
            result.append(
                {
                    "type": "rich_text",
                    "data": {
                        "spans": [
                            {
                                "kind": "formula" if part.startswith("`") else "text",
                                "text": part[1:-1] if part.startswith("`") else part,
                            }
                            for part in parts
                            if part
                        ]
                    },
                }
            )
        else:
            result.append(block)
    return result


def prepare(source: Path, output: Path, registry: Registry) -> Package:
    if output.exists():
        raise FileExistsError("editorial output already exists")
    identities = json.loads((source / "identity.json").read_bytes())
    inputs = json.loads((source / "source.json").read_bytes())["tasks"]
    assert all("`" not in item["text"] for item in inputs)
    edits = []
    kinds: Counter[str] = Counter()
    skills: Counter[str] = Counter()
    for item in inputs:
        task_id = identities[str(item["taskId"])]
        path = source / "corrections" / "tasks" / f"{task_id}.json"
        corrected = path.exists()
        if not corrected:
            path = source / "package" / "tasks" / f"{task_id}.json"
        old = json.loads(path.read_bytes())["task"]
        task = copy.deepcopy(old)
        plain = " ".join(b["data"].get("markdown", "") for b in task["statement"])
        task["short_description"] = preview(task["statement"])
        task["explanation_kind"] = "unclassified" if item["solve_text"].strip() else "method"
        if item["number"] == 16:
            skill = (
                "recursive-procedure"
                if item["taskId"] in CODE_GROUPS
                else "mutual-recursion"
                if re.search(r"G\s*\(", plain)
                else "recursion"
            )
        else:
            skill = "binary-algorithm" if "двоич" in plain.lower() else "digit-algorithm"
        task["skills"] = [skill]
        task["statement"] = presentation(task["statement"], item["taskId"])
        if any(b["type"] in {"rich_text", "code_variants"} for b in task["statement"]):
            task["content_schema_version"] = 2
        assert task["checker"] == old["checker"] and task["sources"] == old["sources"]
        edits.append(
            TaskEdit.model_validate(
                {
                    "task": task,
                    "expected_revision": 2 if corrected else 1,
                    "mode": "editorial",
                    "reason": (
                        "Practice UX: preview, skill, honest explanation label and explicit "
                        "presentation; source answers retained"
                    ),
                }
            )
        )
        kinds[task["explanation_kind"]] += 1
        skills[skill] += 1
    output.mkdir(parents=True)
    (output / "tasks").mkdir()
    entries = []
    for edit in sorted(edits, key=lambda e: e.task.id):
        path = output / "tasks" / f"{edit.task.id}.json"
        path.write_bytes(encoded(edit.model_dump(mode="json")))
        entries.append({"path": f"tasks/{path.name}", "checksum": checksum(path)})
    digest = hashlib.sha256(encoded(entries)).hexdigest()
    (output / "manifest.json").write_bytes(
        encoded(
            {"format": 1, "package_id": f"practice-ux-{digest[:24]}", "tasks": entries, "files": []}
        )
    )
    package = Package(output)
    package.validate(registry)
    (output.parent / "report.json").write_bytes(
        encoded(
            {
                "package_id": package.manifest.package_id,
                "checksum": package.checksum,
                "tasks": len(edits),
                "explanation_kinds": dict(kinds),
                "skills": dict(skills),
                "code_group_source_ids": sorted(CODE_GROUPS),
                "source_checksum": checksum(source / "source.json"),
                "independently_solved": False,
            }
        )
    )
    return package


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--registry", type=Path, required=True)
    args = parser.parse_args()
    result = prepare(
        args.source, args.output, Registry.model_validate_json(args.registry.read_bytes())
    )
    print(result.manifest.package_id)


if __name__ == "__main__":
    main()
