"""One-time private KEGE delta preparation, with complete source reconciliation.

Run from apps/api: python -m app.modules.practice.kompege prepare RAW_DIR
EXISTING_BANK_DIR DATABASE_EXPORT_DIR OUTPUT_DIR. No database writes are performed.
"""

from __future__ import annotations

import argparse
import json
import os
import re
from collections import Counter
from pathlib import Path
from urllib.parse import parse_qs, urlsplit
from uuid import NAMESPACE_URL, uuid5

from app.modules.practice.kompege_assets import AssetResolver
from app.modules.practice.kompege_html import NativeHTML, Node, parse_html, text_content
from app.modules.practice.schemas import Bank, BankTask

SECTIONS = (*range(1, 20), *range(22, 28))


# Current source primary groups already use the 2027 numbering (10=networks,
# 13=program counting, 23=graph analysis), unlike older historical groups.
def canonical_titles() -> dict[int, str]:
    topics = json.loads(
        (Path(__file__).resolve().parents[3] / "practice-catalog-topics.json").read_text()
    )
    titles = {
        number: re.sub(r"^[\d–]+ номер\.\s*", "", topic["label"])
        for topic in topics
        for number in topic.get("exam_numbers") or []
    }
    if set(titles) != set(range(1, 28)):
        raise ValueError("canonical practice catalog must define all 27 exam titles")
    return titles


TITLES = canonical_titles()

ANSWER_CORRECTIONS = {
    (31372, 7): (
        "120",
        "Ответ восстановлен арифметически: разность объёмов стереозаписи "
        "512 с, 48 кГц, 24 бит и монозаписи 32 кГц, 16 бит после сжатия на 34% "
        "равна 120 МиБ. В источнике ответ отсутствует.",
    ),
}


def answer(value: object) -> str:
    if not isinstance(value, str):
        raise ValueError("source answer must be a string (numeric coercion is forbidden)")
    value = value.replace("\\r\\n", "\n").replace("\\n", "\n").replace("\\t", "\t")
    if not value.strip():
        raise ValueError("source answer is empty")
    return value.strip()


def existing_identities(*banks: dict) -> set[tuple[int, int | None]]:
    found: set[tuple[int, int | None]] = set()
    for bank in banks:
        for entry in bank["tasks"]:
            task = entry["task"]
            for source in task.get("sources", []):
                url = urlsplit(source.get("url") or "")
                is_kege = url.hostname in {"kompege.ru", "www.kompege.ru"} or any(
                    label in str(source.get("title", "")).lower() for label in ("кегэ", "kompege")
                )
                if not is_kege:
                    continue
                original = str(source.get("original_id") or "")
                match = re.fullmatch(r"(\d+)(?:[/_-](19|20|21))?", original)
                query = parse_qs(url.query).get("id", [])
                identifier = (
                    int(match[1])
                    if match
                    else int(query[0])
                    if query and query[0].isdigit()
                    else None
                )
                if identifier is None:
                    continue
                parts = [int(match[2])] if match and match[2] else task.get("exam_numbers", [])
                for part in parts or [None]:
                    found.add((identifier, part))
    return found


def compatibility(row: dict, part: int) -> str | None:
    if row.get("hide"):
        return "hidden source entry"
    text = text_content(row.get("text", "")).lower()
    if part in {19, 20, 21} and re.search(r"[A-Za-zА-Яа-яЁё]", str(row.get("key") or "")):
        return "legacy nonnumeric game answer format (player names/labels), no answer conversion"
    if part == 12 and not re.search(r"исполнитель\s+мт|тьюринг|головк.{0,80}лент", text):
        return "obsolete non-Turing task 12"
    if part == 27:
        table = row.get("table", {})
        if table != {"cols": 2, "rows": 1}:
            return "obsolete task 27 answer format: requires one row with two numbers"
        if len(answer(row.get("key")).split()) != 2:
            raise ValueError("2027 task 27 must have exactly two ordered answer tokens")
        if (
            not all(token in text for token in ("кластер", "кинетическ", "признак"))
            or len(row.get("files", [])) != 1
        ):
            return "task 27 subject does not match 2027 analytical single-dataset format"
    return None


def _raw_text(node: Node | str) -> str:
    if isinstance(node, str):
        return node
    if node.tag == "br":
        return "\n"
    return "".join(_raw_text(c) for c in node.children)


def _prefix(node: Node | str, length: int) -> Node | str:
    if isinstance(node, str):
        return node[:length]
    children: list[Node | str] = []
    for child in node.children:
        size = len(_raw_text(child))
        if length >= size:
            children.append(child)
            length -= size
        elif length > 0:
            children.append(_prefix(child, length))
            break
        else:
            break
    return Node(node.tag, node.attrs.copy(), children)


LEGACY_GAME_FAMILIES = {
    11951: r"набор\s+слов",
    4366: r"символьных\s+цепочек",
    4364: r"символьных\s+цепочек",
    2475: r"набор\s+карт",
    833: r"карточки",
    584: r"кубик",
}


def legacy_game_family(row: dict) -> str | None:
    identifier = row.get("taskId")
    pattern = LEGACY_GAME_FAMILIES.get(identifier) if isinstance(identifier, int) else None
    if pattern is None:
        return None
    if not re.search(pattern, text_content(row["text"]), re.I):
        raise ValueError("inspected legacy game subject changed; manual review required")
    return "legacy word/card/dice game family excluded by explicit architect decision"


def game_setup(html: str, *, source_id: int | None = None) -> str:
    """Keep common rules; use explicit question boundaries, never a date/length heuristic."""
    tree = parse_html(html)
    text = _raw_text(tree)
    if source_id == 1028:
        boundary = re.search(r"Игра\s+начинается\s+в\s+одной\s+из\s+позиций", text, re.I)
        if boundary is None:
            raise ValueError("inspected game initial-position boundary changed")
        end = boundary.start()
    elif source_id in {471, 502}:
        # Both inspected roots give a root-only initial position after this phrase;
        # their subparts supply their own different positions.
        boundary = re.search(
            r"Известно\s*,?\s*что\s*(?:в\s+начале\s+игры|игра\s+началась)",
            text,
            re.I,
        )
        if boundary is None:
            raise ValueError("inspected game initial-position boundary changed")
        end = boundary.start()
    else:
        initial = list(re.finditer(r"(?:В\s+начальн\w*\s+момент|В\s+начале\s+игры)", text, re.I))
        markers = list(
            re.finditer(
                r"(?:Известно\s*,?\s*что|Укажите\b|Найдите\b|Определите\b|Назовите\b|"
                r"Сколько\b|Какое\b|При\s+каком\b|Кто\s+из\b|При\s+игре\s+из\b|"
                r"Выполните\s+следующие\s+задания|Задание\s*19|Ответьте\s+на\s+вопрос)",
                text,
                re.I,
            )
        )
        after_initial = [m for m in markers if not initial or m.start() >= initial[-1].end()]
        # A late initial-position phrase can itself be part of the root question
        # ("Сколько ... если ... в начале игры ..."). Keep only the rules then.
        candidates = after_initial or [m for m in markers if not re.match(r"Известно", m[0], re.I)]
        candidates = [
            m
            for m in candidates
            if len(text[: m.start()]) >= 150
            and re.search(
                r"игра\s+(?:завершается|заканчивается)|победител|выигрывает",
                text[: m.start()],
                re.I,
            )
        ]
        if not candidates:
            raise ValueError("game common setup: no unambiguous question boundary after game rules")
        end = candidates[0].start()
    prefix_tree = _prefix(tree, end)
    assert isinstance(prefix_tree, Node)
    return prefix_tree.html()


def _erase_ranges(node: Node | str, ranges: list[tuple[int, int]], offset: int = 0) -> Node | str:
    if isinstance(node, str):
        kept = []
        for index, char in enumerate(node):
            if not any(start <= offset + index < end for start, end in ranges):
                kept.append(char)
        return "".join(kept)
    children: list[Node | str] = []
    for child in node.children:
        children.append(_erase_ranges(child, ranges, offset))
        offset += len(_raw_text(child))
    return Node(node.tag, node.attrs.copy(), children)


def _own_game_question(html: str) -> str:
    tree = parse_html(html)
    text = _raw_text(tree)
    dependency = re.compile(
        r"(?:Для\s+(?:условия\s+)?игры|В\s+игре)\s*,?\s*"
        r"(?:описанной\s+в\s+(?:задании\s*19|19\s*задании|предыдущем\s+задании)"
        r"|(?:из|в)\s+задани[яи]\s*19|из\s+предыдущего\s+задания)"
        r"\s*,?\s*(?:ответьте\s+на\s+вопрос[.:]?\s*)?",
        re.I,
    )
    ranges = [(match.start(), match.end()) for match in dependency.finditer(text)]
    cleaned = _erase_ranges(tree, ranges)
    assert isinstance(cleaned, Node)
    result = cleaned.html()
    if re.search(
        r"(?:задани\w*\s*19|19\s*задани|предыдущ\w*\s+задани)", text_content(result), re.I
    ):
        raise ValueError("game subpart retains an unresolved reference to task 19")
    if not text_content(result):
        raise ValueError("empty game subpart")
    return result


def convert_task(
    row: dict, part: int, resolver: AssetResolver, *, setup: str = ""
) -> tuple[dict, dict]:
    source_id = row["taskId"]
    presentation = NativeHTML(resolver)
    html = setup + _own_game_question(row["text"]) if part in {20, 21} else row["text"]
    statement = presentation.convert(html)
    for file in row.get("files", []):
        block = presentation.media(file["url"], "attachment", file["name"])
        if block not in statement:
            statement.append(block)
    correction = (
        ANSWER_CORRECTIONS.get((source_id, part)) if not str(row.get("key") or "").strip() else None
    )
    private_answer = answer(correction[0] if correction else row.get("key"))
    original_id = f"{source_id}/{part}" if part in {20, 21} else str(source_id)
    comment = str(row.get("comment") or "").strip()
    source_years = re.findall(r"(?<!\d)(?:19|20)\d{2}(?!\d)", comment)
    difficulty = row.get("difficulty")
    if (
        not isinstance(difficulty, int)
        or isinstance(difficulty, bool)
        or difficulty not in range(4)
    ):
        raise ValueError("source difficulty must be 0..3")
    task = {
        "id": str(uuid5(NAMESPACE_URL, f"https://kompege.ru/task?id={source_id}#ege-{part}")),
        "title": f"{TITLES[part]} — КЕГЭ {source_id}, задание {part}",
        "difficulty": min(difficulty + 1, 3),
        "answer_instruction": (
            "Запишите значения через пробел в указанном в условии порядке. "
            "Для таблицы перечислите строки последовательно, слева направо."
            if len(private_answer.split()) > 1 or row.get("table", {}).get("cols", 0) > 1
            else "Запишите ответ в формате, указанном в условии."
        ),
        "content_schema_version": 2,
        "statement": statement,
        "hint": [],
        "explanation": [],
        "lessons": [],
        "theory_links": [],
        "skills": [],
        "exam_numbers": [part],
        "files": presentation.files,
        "catalog_visible": True,
        "archived": False,
        "sources": [
            {
                "kind": "bank",
                "role": "copy",
                "primary": True,
                "title": "КЕГЭ" + (f" — {comment}" if comment else ""),
                "author": None,
                "original_id": original_id,
                "url": f"https://kompege.ru/task?id={source_id}",
                "year": int(source_years[0]) if len(source_years) == 1 else None,
                "adaptation": (
                    "В источнике отсутствовал ответ; он восстановлен независимым расчётом."
                    if correction
                    else None
                ),
                "is_public": True,
            }
        ],
        "checker": {"checker_type": "exact_match", "answer_variants": [private_answer]},
    }
    # Validate without rewriting dictionaries: omitted optional/default fields stay omitted.
    BankTask.model_validate({"task": task, "solution_revision": 1})
    return {"task": task, "solution_revision": 1}, presentation.assets


def prepare(
    raw_dir: Path, existing: dict, database: dict, resolver: AssetResolver
) -> tuple[dict, dict, dict]:
    identities = existing_identities(existing, database)
    report: list[dict] = []
    tasks, assets = [], {}
    seen: set[tuple[int, int]] = set()
    retained_ids = {entry["task"]["id"] for b in (existing, database) for entry in b["tasks"]}
    for section in SECTIONS:
        path = raw_dir / f"section-{section}.json"
        if not path.is_file():
            report.append(
                {"section": section, "status": "error", "reason": "missing raw source section"}
            )
            continue
        rows = json.loads(path.read_text())
        if not isinstance(rows, list):
            raise ValueError(f"section {section}: raw source must be a list")
        for index, root in enumerate(rows):
            source_id = root.get("taskId")
            parts = [(section, root)]
            for child in root.get("subTask", []):
                parts.append(
                    (
                        child.get("number"),
                        {
                            **child,
                            "taskId": source_id,
                            "difficulty": root.get("difficulty"),
                            "comment": root.get("comment"),
                            "hide": root.get("hide") or child.get("hide"),
                            "files": root.get("files", []),
                        },
                    )
                )
            for part, row in parts:
                record = {"section": section, "index": index, "source_id": source_id, "part": part}
                try:
                    if (
                        not isinstance(source_id, int)
                        or isinstance(source_id, bool)
                        or source_id <= 0
                    ):
                        raise ValueError("invalid numeric source taskId")
                    if root.get("number") != section:
                        raise ValueError("source root number differs from collected section")
                    if part != section and (section != 19 or part not in {20, 21}):
                        raise ValueError("unexpected source subpart outside 19/20/21")
                    identity = (source_id, part)
                    if identity in seen:
                        raise ValueError("duplicate identity in raw source")
                    seen.add(identity)
                    if identity in identities or (source_id, None) in identities:
                        record.update(
                            status="existing", reason="retained canonical/database source identity"
                        )
                    elif reason := (
                        legacy_game_family(root) if section == 19 else None
                    ) or compatibility(row, part):
                        record.update(status="excluded", reason=reason)
                    else:
                        setup = (
                            game_setup(root["text"], source_id=source_id)
                            if part in {20, 21}
                            else ""
                        )
                        task, files = convert_task(row, part, resolver, setup=setup)
                        if task["task"]["id"] in retained_ids:
                            raise ValueError(
                                "new deterministic task ID collides with retained bank"
                            )
                        tasks.append(task)
                        assets.update(files)
                        correction = ANSWER_CORRECTIONS.get(identity)
                        record.update(status="included", task_id=task["task"]["id"])
                        if correction:
                            record["correction"] = correction[1]
                except (ValueError, KeyError, TypeError, OSError) as error:
                    if isinstance(error, PermissionError):
                        raise
                    record.update(status="error", reason=str(error))
                report.append(record)
    bank = {
        "format": 1,
        "tasks": tasks,
        "files": [assets[k].bank_file() for k in sorted(assets)],
        "materials": existing.get("materials", []),
        "courses": existing.get("courses", []),
    }
    Bank.model_validate(bank).validate_references()
    return (
        bank,
        {"format": 1, "counts": dict(Counter(r["status"] for r in report)), "records": report},
        assets,
    )


def _private_json(path: Path, value: dict) -> None:
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["prepare"])
    for arg in ("raw_dir", "existing_bank_dir", "database_export_dir", "output_dir"):
        parser.add_argument(arg, type=Path)
    args = parser.parse_args(argv)
    existing = json.loads((args.existing_bank_dir / "bank.json").read_text())
    database = json.loads((args.database_export_dir / "bank.json").read_text())
    args.output_dir.mkdir(mode=0o700)
    (args.output_dir / "files").mkdir(mode=0o700)
    bank, report, assets = prepare(
        args.raw_dir, existing, database, AssetResolver(cache_dir=args.raw_dir / "assets")
    )
    for checksum, asset in assets.items():
        path = args.output_dir / "files" / checksum
        descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(asset.data)
    _private_json(args.output_dir / "bank.json", bank)
    _private_json(args.output_dir / "report.json", report)
    print(json.dumps(report["counts"], ensure_ascii=False))
    return int(bool(report["counts"].get("error")))


if __name__ == "__main__":
    raise SystemExit(main())
