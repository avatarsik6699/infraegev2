"""Read-only SDD history and verified Git snapshot support (Python standard library)."""

import argparse
import hashlib
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path, PurePosixPath

NUMBERED = re.compile(r"([0-9]{2,})-[a-z0-9-]+\.md\Z")
CHECKPOINT = Path("docs/changes/archive/COMPACTED.md")
MARKER = "<!-- compacted-metadata -->"


class HistoryError(ValueError):
    """History is incomplete or unsafe to interpret."""


def git(root: Path, *args: str) -> bytes:
    result = subprocess.run(["git", "-C", str(root), *args], capture_output=True, check=False)
    if result.returncode:
        raise HistoryError(
            "Git source unavailable. Fetch the recorded source commit/full history "
            "from a trusted repository; do not reset numbering or replace the SHA."
        )
    return result.stdout


def source_blob(root: Path, commit: str, path: str) -> bytes:
    if git(root, "cat-file", "-t", f"{commit}:{path}").strip() != b"blob":
        raise HistoryError(f"Source path is not a file: {path}")
    return git(root, "show", f"{commit}:{path}")


def checked_paths(value: object) -> list[str]:
    if not isinstance(value, list) or not value:
        raise HistoryError("source_paths must be a non-empty list")
    paths: list[str] = []
    for item in value:
        if not isinstance(item, str):
            raise HistoryError("Source paths must be strings")
        path = PurePosixPath(item)
        if (
            not item.startswith("docs/")
            or ".." in path.parts
            or str(path) != item
            or "\\" in item
            or any(ord(char) < 32 for char in item)
            or item == str(CHECKPOINT)
        ):
            raise HistoryError(f"Unsafe source path: {item!r}")
        paths.append(item)
    if paths != sorted(set(paths)):
        raise HistoryError("source_paths must be sorted and unique")
    return paths


def digest(root: Path, source: str, paths: list[str], checkout: bool = False) -> str:
    result = hashlib.sha256()
    for path in paths:
        blob = source_blob(root, source, path)
        if checkout:
            local = root / path
            if local.is_symlink() or not local.is_file() or local.read_bytes() != blob:
                raise HistoryError(f"Checkout differs from snapshot: {path}")
        result.update(path.encode() + b"\0" + hashlib.sha256(blob).digest())
    return result.hexdigest()


def validate_metadata(root: Path, data: object) -> dict:
    if not isinstance(data, dict):
        raise HistoryError("Checkpoint metadata must be an object")
    expected = {
        "covered_through",
        "source_commit",
        "date",
        "missing_numbers",
        "source_paths",
        "source_digest",
    }
    if set(data) != expected:
        raise HistoryError("Missing or unknown checkpoint metadata fields")
    through = data["covered_through"]
    if type(through) is not int or through < 1:
        raise HistoryError("covered_through must be a positive integer")
    source = data["source_commit"]
    if not isinstance(source, str) or not re.fullmatch(r"[0-9a-f]{40}", source):
        raise HistoryError("source_commit must be a full immutable SHA")
    if git(root, "cat-file", "-t", source).strip() != b"commit":
        raise HistoryError("source_commit is not a commit")
    try:
        date.fromisoformat(data["date"])
    except (TypeError, ValueError) as exc:
        raise HistoryError("Invalid checkpoint date") from exc
    missing = data["missing_numbers"]
    if (
        not isinstance(missing, list)
        or any(type(n) is not int or not 1 <= n <= through for n in missing)
        or missing != sorted(set(missing))
    ):
        raise HistoryError("Invalid missing_numbers")
    paths = checked_paths(data["source_paths"])
    archived = []
    for path in paths:
        match = NUMBERED.fullmatch(PurePosixPath(path).name)
        if PurePosixPath(path).parent == CHECKPOINT.parent and match:
            archived.append(int(match[1]))
        elif path.startswith("docs/changes/"):
            raise HistoryError("Only numbered archived changes may enter the snapshot")
    if sorted(archived) != [n for n in range(1, through + 1) if n not in missing]:
        raise HistoryError("Archive coverage does not match covered_through/missing_numbers")
    # Missing numbers cannot hide an archived source document.
    source_archives = (
        git(root, "ls-tree", "--name-only", source, "docs/changes/archive/").decode().splitlines()
    )
    represented = set(paths)
    for path in source_archives:
        match = NUMBERED.fullmatch(PurePosixPath(path).name)
        if match and int(match[1]) <= through and path not in represented:
            raise HistoryError(f"Unrepresented source archive: {path}")
    if data["source_digest"] != digest(root, source, paths):
        raise HistoryError("Snapshot digest mismatch")
    return data


def checkpoint(root: Path) -> dict | None:
    path = root / CHECKPOINT
    if not path.exists():
        # A deleted tracked checkpoint is not an empty initial project.
        tracked = git(root, "ls-files", "--", str(CHECKPOINT)).strip()
        committed = git(root, "log", "-1", "--format=%H", "--", str(CHECKPOINT)).strip()
        if tracked or committed:
            raise HistoryError("COMPACTED.md is missing; restore its metadata before planning")
        return None
    content = path.read_text()
    matches = re.findall(re.escape(MARKER) + r"\s*```json\s*\n(.*?)\n```", content, re.S)
    if len(matches) != 1 or content.count(MARKER) != 1:
        raise HistoryError("Expected exactly one compacted metadata block")
    try:
        data = json.loads(matches[0])
    except json.JSONDecodeError as exc:
        raise HistoryError("Invalid checkpoint JSON") from exc
    return validate_metadata(root, data)


def inspect(root: Path) -> dict:
    metadata = checkpoint(root)
    covered = metadata["covered_through"] if metadata else 0
    active: list[str] = []
    numbers: set[int] = set()
    for folder in (root / "docs/changes", root / "docs/changes/archive"):
        for path in sorted(folder.glob("*.md")):
            match = NUMBERED.fullmatch(path.name)
            if not match:
                if path != root / CHECKPOINT:
                    raise HistoryError(f"Unexpected change filename: {path}")
                continue
            number = int(match[1])
            if number < 1 or number in numbers or number <= covered:
                raise HistoryError(f"Duplicate or already compacted number: {number}")
            numbers.add(number)
            if folder.name != "archive":
                active.append(path.relative_to(root).as_posix())
    if len(active) > 1:
        raise HistoryError("Multiple active changes; resolve them before planning")
    return {"next": max(numbers | {covered}) + 1, "active": active, "covered_through": covered}


def snapshot(root: Path, source: str, through: int, paths: list[str]) -> dict:
    checked_paths(paths)
    if not re.fullmatch(r"[0-9a-f]{40}", source):
        raise HistoryError("Snapshot source must be a full SHA")
    archived = {
        int(match[1])
        for path in paths
        if PurePosixPath(path).parent == CHECKPOINT.parent
        and (match := NUMBERED.fullmatch(PurePosixPath(path).name))
    }
    data = {
        "covered_through": through,
        "source_commit": source,
        "date": date.today().isoformat(),
        "missing_numbers": [n for n in range(1, through + 1) if n not in archived],
        "source_paths": paths,
        "source_digest": digest(root, source, paths, checkout=True),
    }
    return validate_metadata(root, data)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("inspect")
    sub.add_parser("next")
    read = sub.add_parser("read")
    read.add_argument("path")
    create = sub.add_parser("snapshot")
    create.add_argument("source")
    create.add_argument("through", type=int)
    create.add_argument("paths_file", type=Path)
    args = parser.parse_args()
    root = args.root.resolve()
    try:
        if args.command == "snapshot":
            result = snapshot(
                root, args.source, args.through, args.paths_file.read_text().splitlines()
            )
        elif args.command == "read":
            metadata = checkpoint(root)
            if not metadata or args.path not in metadata["source_paths"]:
                raise HistoryError("Path is not represented by the checkpoint")
            sys.stdout.buffer.write(source_blob(root, metadata["source_commit"], args.path))
            return 0
        else:
            result = inspect(root)
            if args.command == "next":
                if result["active"]:
                    raise HistoryError("Ship the active change before planning another")
                print(f"{result['next']:02d}")
                return 0
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return 0
    except (HistoryError, OSError) as exc:
        print(f"History error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
