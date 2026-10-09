#!/usr/bin/env python3
"""Fail when a relative Markdown link in current documentation points to a missing path.

Archived changes are immutable history and lesson-design stands resolve their links from the
generated stand pages, so both are outside this check. Fenced code blocks are ignored.
"""

from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SKIPPED = ("docs/changes/archive/", "content/lesson-design/")
FENCE = re.compile(r"^(```|~~~).*?^\1", re.S | re.M)
LINK = re.compile(r"\]\(([^)\s]+)\)")


def markdown_files() -> list[str]:
    listed = subprocess.run(
        ["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard", "*.md"],
        cwd=REPO,
        text=True,
        capture_output=True,
        check=True,
    ).stdout.split("\0")
    return [path for path in listed if path and not path.startswith(SKIPPED)]


def broken_links(path: str) -> list[str]:
    source = REPO / path
    if not source.exists():
        return []
    text = FENCE.sub("", source.read_text(encoding="utf-8", errors="replace"))
    broken = []
    for match in LINK.finditer(text):
        target = match.group(1)
        if re.match(r"[a-z][a-z0-9+.-]*:", target) or target.startswith("#"):
            continue
        relative = target.split("#", 1)[0]
        if relative and not (source.parent / relative).exists():
            broken.append(target)
    return broken


def main() -> int:
    failures = [(path, link) for path in markdown_files() for link in broken_links(path)]
    for path, link in failures:
        print(f"{path}: broken link {link}")
    if failures:
        return 1
    print(f"doc links: {len(markdown_files())} files OK")
    return 0


if __name__ == "__main__":
    os.chdir(REPO)
    sys.exit(main())
