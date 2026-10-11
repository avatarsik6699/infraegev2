"""Run every Python example of a topic and compare it with the printed output.

Usage: python3 -I scripts/lesson_design/verify_code.py content/lesson-design/topic-25

A block is checked when it contains ``print`` and is followed directly by an
```output block (shown under the code, lines joined in one row), or by a marker
line ("Программа выведет:", "Результат:", …) and a ```text block. A course
program may also be followed by ```input (typed lines fed to ``input()``)
and ```error (the last line of the traceback it must stop with), or by
```console — a terminal session where the typed text is marked ⟪…⟫: the
marked lines become stdin and are echoed, as a terminal shows them.
Complete function definitions from earlier blocks of the topic (in file order)
are prepended, so later examples may call ``get_divisors`` and similar helpers.
Functions of a runnable example (```python run, which defines and calls them in
one block) are prepended the same way.
Every code line must fit in 64 characters (the site's code column).
A program that continues an earlier one of the same file (uses its names
and fails when run alone) is rerun after the earlier programs of that
file, whose own output is discarded.
Programs run in the topic's ``files`` folder when it exists, so an example
may open a data file of the topic (topic 23: ``open("23.txt")``).
Exit code 1 on any mismatch or long line.
"""

import ast
import re
import subprocess
import sys
from pathlib import Path

MAX_LINE = 64
BLOCK = re.compile(r"```python(?: run)?(?: [\w-]+\.\w+)?\n((?:(?!```).)*?)```", re.S)
WITH_OUTPUT = re.compile(
    r"```python(?: run)?(?: [\w-]+\.\w+)?\n((?:(?!```).)*?)```\n\n?"
    r"(?:(?:Программа выведет|Результат|Получим|Выведет|получаем|даёт|даст):?\n\n"
    r"```text\n|```output\n)(.*?)```",
    re.S,
)
DEFINITIONS = (ast.FunctionDef, ast.ClassDef, ast.Import, ast.ImportFrom)
IO_AFTER = re.compile(r"\n*```(input|output|error|console)\n(.*?)```", re.S)
TYPED = re.compile(r"⟪(.*?)⟫")
ECHO = (
    "import builtins as _b\n"
    "_read = _b.input\n"
    "def _echo(prompt=''):\n"
    "    text = _read(prompt)\n"
    "    print(text)\n"
    "    return text\n"
    "_b.input = _echo\n"
)
# topics only: their sources call isqrt and fnmatch without importing them;
# a course program must import everything it uses, as a student would
PRELUDE = "from math import isqrt\nfrom fnmatch import fnmatch\n"


def run(source: str, stdin: str, cwd: Path | None) -> subprocess.CompletedProcess:
    """Run one program as a student would: isolated, with typed input."""
    return subprocess.run(
        [sys.executable, "-I", "-c", source],
        capture_output=True,
        text=True,
        timeout=300,
        cwd=cwd,
        input=stdin,
    )


def io_blocks(text: str, end: int) -> dict[str, str]:
    """```input / ```output / ```error blocks right after a program."""
    found = {}
    while m := IO_AFTER.match(text, end):
        found[m.group(1)] = m.group(2)
        end = m.end()
    return found


def main(topic_dir: Path) -> int:
    course = (topic_dir / "course.json").exists()
    prelude, ran, bad = ("" if course else PRELUDE), 0, 0
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
            io = io_blocks(text, block.end())
            expected = outputs.get(block.start(), io.get("output"))
            error = io.get("error")
            stdin = io.get("input", "")
            echo = ""
            if "console" in io:
                expected = TYPED.sub(r"\1", io["console"])
                stdin = "".join(t + "\n" for t in TYPED.findall(io["console"]))
                echo = ECHO
            if (expected is not None and "print" in code) or error is not None:
                ran += 1

                result = run(prelude + echo + code, stdin, cwd)
                if result.returncode and earlier and error is None:
                    result = run(
                        prelude
                        + "import contextlib, io\n"
                        + "with contextlib.redirect_stdout(io.StringIO()):\n"
                        + "    try:\n"
                        + f"        exec(compile({earlier!r}, 'earlier', 'exec'))\n"
                        + "    except SystemExit:\n"
                        + "        pass\n"
                        + echo
                        + code,
                        stdin,
                        cwd,
                    )
                if error is None:
                    earlier += code + "\n"
                got_error = (result.stderr.strip().splitlines() or [""])[-1]
                if result.stdout.strip() != (expected or "").strip() or (
                    error is not None and got_error != error.strip().splitlines()[-1]
                ):
                    bad += 1
                    print(
                        f"MISMATCH {path.name}:{line_no}\n--- expected\n{expected}{error or ''}"
                        f"--- got\n{result.stdout}{result.stderr[-500:]}"
                    )
            if re.search(r"^def ", code, re.M) and "print" not in code and error is None:
                try:
                    tree = ast.parse(code)
                except SyntaxError:
                    continue  # a one-line fragment shown for explanation
                # only definitions and imports; a block that also runs
                # something (unittest.main()) must not leak into later programs
                if all(isinstance(node, DEFINITIONS) for node in tree.body):
                    prelude += code + "\n"
            elif block.group(0).startswith("```python run") and error is None:
                # a runnable example defines its function and calls it at once
                # (П20); later programs of the topic may call that function
                tree = ast.parse(code)
                for node in tree.body:
                    if isinstance(node, ast.FunctionDef):
                        prelude += (ast.get_source_segment(code, node) or "") + "\n"
    print(f"checked {ran} programs, problems: {bad}")
    return 1 if bad else 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    sys.exit(main(Path(sys.argv[1])))
