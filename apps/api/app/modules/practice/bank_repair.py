"""Change 191: one-time editorial repair of the Change 188 kompege import in the canonical bank.

    uv run python -m app.modules.practice.bank_repair BANK_DIR EXAM_TOPICS_JSON

EXAM_TOPICS_JSON is `examTopicDefinitions` from `apps/web/src/shared/config/exam-topics.mjs`
(the canonical FIPI 2027 titles and topic ids). The bank is validated and rewritten in place.
Only editorial metadata changes for existing tasks; the 19/20/21 parts of one kompege game are
merged into new multi-part tasks and the split parts are archived, never deleted.
"""

import argparse
import copy
import json
import re
import uuid
from pathlib import Path
from typing import Any

from app.modules.practice.schemas import Bank

IMPORTED_TITLE = re.compile(r" — КЕГЭ \d+, задание \d+$")
QUESTION = re.compile(r"(?i)(найдите|укажите|определите|сколько|чему|назовите|какое|каков)")
ANSWER_TAIL = re.compile(r"(?i)\s*В ответе.*$", re.S)
GAME_PARTS = (19, 20, 21)


def block_text(block: dict) -> str:
    data = block.get("data") or {}
    if block.get("type") == "rich_text":
        return "".join(span["text"] for span in data["spans"])
    if block.get("type") in {"text", "callout"}:
        return data["markdown"]
    return ""


def preview(statement: list[dict]) -> str | None:
    """The question sentence of a statement, as in the Change 121 editorial generator."""
    paragraphs = [
        re.sub(r"\s+", " ", ANSWER_TAIL.sub("", line)).replace("`", "").strip()
        for block in statement
        for line in block_text(block).split("\n")
    ]
    paragraphs = [p for p in paragraphs if p]
    if not paragraphs:
        return None
    candidates = [p for p in paragraphs if QUESTION.search(p)]
    value = candidates[-1] if candidates else paragraphs[-1]
    # The question starts at its first asking sentence, not at the paragraph's context.
    sentences = re.split(r"(?<=[.!?])\s+", value)
    asked = next((i for i, s in enumerate(sentences) if QUESTION.search(s)), None)
    if asked is not None:
        value = " ".join(sentences[asked:])
    value = value[0].upper() + value[1:]
    return value if len(value) <= 300 else value[:296].rsplit(" ", 1)[0] + "…"


def primary(task: dict) -> dict:
    return next(source for source in task["sources"] if source["primary"])


def is_imported(task: dict) -> bool:
    source = primary(task)
    return source["kind"] == "bank" and "kompege.ru" in (source.get("url") or "")


def drop_prefix(block: dict, prefix: str) -> dict | None:
    """Remove `prefix` characters from the start of a rich text block, across spans."""
    result = copy.deepcopy(block)
    spans, remaining = [], len(prefix)
    for span in result["data"]["spans"]:
        if remaining >= len(span["text"]):
            remaining -= len(span["text"])
            continue
        spans.append(dict(span, text=span["text"][remaining:]))
        remaining = 0
    if spans:
        spans[0]["text"] = spans[0]["text"].lstrip()
        spans = [span for span in spans if span["text"]]
    if not spans:
        return None
    first = spans[0]["text"]
    spans[0]["text"] = first[0].upper() + first[1:]
    result["data"]["spans"] = spans
    return result


def capitalized(blocks: list[dict]) -> list[dict]:
    """Subparts lost their «Для игры из задания 19,» lead-in; start them with a capital."""
    if not blocks or blocks[0]["type"] != "rich_text":
        return blocks
    first = copy.deepcopy(blocks[0])
    span = first["data"]["spans"][0]
    span["text"] = span["text"][:1].upper() + span["text"][1:]
    return [first, *blocks[1:]]


def common(a: list[dict], b: list[dict]) -> int:
    count = 0
    while count < min(len(a), len(b)) and a[count] == b[count]:
        count += 1
    return count


def split_setup(parts: dict[int, dict]) -> tuple[list[dict], dict[int, list[dict]]] | None:
    """Shared game rules and each part's own question, or None when the split is ambiguous.

    20 and 21 were converted as `setup + own question` (Change 188); 19 is the root text, whose
    first question paragraph may share a block with the end of the setup. A part-specific
    initial position shared by 20 and 21 stays in their own questions.
    """
    later = [parts[n]["statement"] for n in (20, 21) if n in parts]
    if not later:
        return None
    ref = later[0]
    limit = min(len(s) for s in later) - 1  # every part keeps at least one own block
    size = min(common(later[0], later[-1]), limit) if len(later) == 2 else limit
    root_question: list[dict] | None = None
    if 19 in parts:
        root = parts[19]["statement"]
        equal = min(common(root, ref), size, len(root) - 1)
        tail = ref[equal] if equal < len(ref) else None
        if (
            equal < size
            and tail is not None
            and tail["type"] == "rich_text"
            and root[equal]["type"] == "rich_text"
            and block_text(root[equal]) != block_text(tail)
            and block_text(root[equal]).startswith(block_text(tail))
        ):
            # The setup ends inside the root's first question paragraph.
            rest = drop_prefix(root[equal], block_text(tail))
            size = equal + 1
            root_question = ([rest] if rest else []) + root[equal + 1 :]
        else:
            size = equal
            root_question = root[equal:]
    if size < 1 or root_question == []:
        return None
    questions = {n: capitalized(parts[n]["statement"][size:]) for n in (20, 21) if n in parts}
    if root_question is not None:
        questions[19] = root_question
    if any(not own for own in questions.values()):
        return None
    return ref[:size], questions


def heading(number: int) -> dict:
    # The web shows a text block equal to a part label as that part's heading.
    return {"type": "text", "data": {"markdown": f"Задание {number}"}}


def merge_game(parts: dict[int, dict], root_id: str, title: str) -> dict | None:
    split = split_setup(parts)
    if split is None:
        return None
    setup, questions = split
    numbers = sorted(questions)
    first = parts[numbers[0]]
    files: dict[str, dict] = {}
    statement = list(setup)
    for number in numbers:
        statement.append(heading(number))
        statement.extend(questions[number])
        for usage in parts[number].get("files", []):
            known = files.get(usage["id"])
            if known is not None and known != usage:
                return None
            files[usage["id"]] = usage
    used = {
        block["data"].get("usage_id")
        for block in statement
        if block["type"] in {"image", "diagram", "attachment"}
    }
    source = dict(primary(first), original_id=root_id)
    return {
        **{k: v for k, v in first.items() if k not in {"checker", "answer_parts"}},
        "id": str(
            uuid.uuid5(uuid.NAMESPACE_URL, f"https://kompege.ru/task?id={root_id}#ege-19-21")
        ),
        "title": title,
        "short_description": preview(questions[numbers[0]]),
        "difficulty": max(parts[n]["difficulty"] for n in numbers),
        "answer_instruction": "Ответьте на каждый вопрос задания отдельно.",
        "statement": statement,
        "hint": [],
        "explanation": [],
        "exam_numbers": numbers,
        "files": [usage for key, usage in files.items() if key in used],
        "sources": [source],
        "lessons": [],
        "answer_parts": [
            {
                "key": str(n),
                "label": f"Задание {n}",
                "answer_instruction": parts[n]["answer_instruction"],
            }
            for n in numbers
        ],
        "checker": {
            **parts[numbers[0]]["checker"],
            "parts": [dict(parts[n]["checker"], key=str(n)) for n in numbers],
        },
        "catalog_visible": True,
        "archived": False,
    }


def archive(task: dict) -> None:
    task.update(catalog_visible=False, archived=True, lessons=[])


def repair(raw: dict[str, Any], topics: list[dict]) -> dict[str, int]:
    titles = {n: topic["title"] for topic in topics for n in topic["taskNumbers"]}
    materials = {n: topic["id"] for topic in topics for n in topic["taskNumbers"]}
    known_materials = {item["id"] for item in raw.get("materials", [])}
    stats = dict(titles=0, summaries=0, theory=0, merged=0, archived=0, unmerged=0)
    games: dict[str, dict[int, dict]] = {}
    for entry in raw["tasks"]:
        task = entry["task"]
        numbers = task.get("exam_numbers") or []
        if is_imported(task) and IMPORTED_TITLE.search(task["title"]) and len(numbers) == 1:
            task["title"] = titles[numbers[0]]
            stats["titles"] += 1
        if task.get("catalog_visible", True) and not task.get("archived"):
            # Imported tasks never had a summary; regenerating keeps the rule in one place.
            regenerate = (is_imported(task) and not task.get("answer_parts")) or not task.get(
                "short_description"
            )
            if regenerate and (summary := preview(task["statement"])):
                task["short_description"] = summary
                stats["summaries"] += 1
            material = materials.get(numbers[0]) if numbers else None
            if not task.get("theory_links") and material in known_materials:
                task["theory_links"] = [
                    {"material_id": material, "section": None, "label": "Теория"}
                ]
                stats["theory"] += 1
            if is_imported(task) and len(numbers) == 1 and numbers[0] in GAME_PARTS:
                root = primary(task)["original_id"].split("/")[0]
                games.setdefault(root, {})[numbers[0]] = task
    existing = {entry["task"]["id"] for entry in raw["tasks"]}
    for root, parts in sorted(games.items(), key=lambda item: int(item[0])):
        if len(parts) < 2:
            stats["unmerged"] += 1
            continue
        merged = merge_game(parts, root, titles[19])
        if merged is None or merged["id"] in existing:
            stats["unmerged"] += 1
            continue
        raw["tasks"].append({"task": merged, "solution_revision": 1})
        stats["merged"] += 1
        for task in parts.values():
            archive(task)
            stats["archived"] += 1
    return stats


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("bank_dir", type=Path)
    parser.add_argument("exam_topics", type=Path)
    args = parser.parse_args()
    path = args.bank_dir / "bank.json"
    raw = json.loads(path.read_text())
    stats = repair(raw, json.loads(args.exam_topics.read_text()))
    Bank.model_validate(raw).validate_references()
    path.write_text(json.dumps(raw, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(stats, ensure_ascii=False))


if __name__ == "__main__":
    main()
