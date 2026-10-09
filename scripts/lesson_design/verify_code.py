"""Run every Python example of a topic and compare it with the printed output.

Usage: python3 -I scripts/lesson_design/verify_code.py docs/artifacts/lesson-design/topic-25

A block is checked when it contains ``print`` and is followed directly by an
```output block (shown under the code, lines joined in one row), or by a marker
line ("Программа выведет:", "Результат:", …) and a ```text block.
Complete function definitions from earlier blocks of the topic (in file order)
are prepended, so later examples may call ``get_divisors`` and similar helpers.
Every code line must fit in 64 characters (the site's code column).
A program that continues an earlier one of the same file (uses its names
and fails when run alone) is rerun after the earlier programs of that
file, whose own output is discarded.
Programs run in the topic's ``files`` folder when it exists, so an example
may open a data file of the topic (topic 23: ``open("23.txt")``).
Exit code 1 on any mismatch or long line.
"""

import re
import subprocess
import sys
from pathlib import Path

MAX_LINE = 64
BLOCK = re.compile(r"```python\n((?:(?!```).)*?)```", re.S)
WITH_OUTPUT = re.compile(
    r"```python\n((?:(?!```).)*?)```\n\n?"
    r"(?:(?:Программа выведет|Результат|Получим|Выведет|получаем|даёт|даст):?\n\n"
    r"```text\n|```output\n)(.*?)```",
    re.S,
)
PRELUDE = "from math import isqrt\nfrom fnmatch import fnmatch\n"


def main(topic_dir: Path) -> int:
    prelude, ran, bad = PRELUDE, 0, 0
    files = topic_dir / "files"
    cwd = files if files.is_dir() else None
    for path in sorted(topic_dir.glob("[0-9][0-9]-*.md")):
        text = path.read_text(encoding="utf-8")
        outputs = {m.start(): m.group(2) for m in WITH_OUTPUT.finditer(text)}
        earlier = ""  # checked programs of this file, output silenced
        for block in BLOCK.finditer(text):
            code = block.group(1)
            line_no = text[: block.start()].count("\n") + 1
            for line in code.splitlines():
                if len(line) > MAX_LINE:
                    bad += 1
                    print(f"LONG {path.name}:{line_no} ({len(line)}): {line}")
            expected = outputs.get(block.start())
            if expected is not None and "print" in code:
                ran += 1
                def run(source):
                    return subprocess.run(
                        [sys.executable, "-I", "-c", source],
                        capture_output=True,
                        text=True,
                        timeout=300,
                        cwd=cwd,
                    )

                result = run(prelude + code)
                if result.returncode and earlier:
                    result = run(
                        prelude
                        + "import contextlib, io\n"
                        + "with contextlib.redirect_stdout(io.StringIO()):\n"
                        + f"    exec(compile({earlier!r}, 'earlier', 'exec'))\n"
                        + code
                    )
                earlier += code + "\n"
                if result.stdout.strip() != expected.strip():
                    bad += 1
                    print(
                        f"MISMATCH {path.name}:{line_no}\n--- expected\n{expected}"
                        f"--- got\n{result.stdout}{result.stderr[-500:]}"
                    )
            if re.search(r"^def ", code, re.M) and "print" not in code:
                try:
                    compile(code, "block", "exec")
                    prelude += code + "\n"
                except SyntaxError:
                    pass  # a one-line fragment shown for explanation
    print(f"checked {ran} programs, problems: {bad}")
    return 1 if bad else 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    sys.exit(main(Path(sys.argv[1])))
