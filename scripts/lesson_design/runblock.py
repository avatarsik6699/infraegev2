"""Runnable code block of the stand: ```python run.

The fence looks like any code block with its output. A «Выполнить по шагам»
button steps through the run recorded by ``tracer.trace_steps`` at build
time: the line just executed, an explanation, the names (one group per
active call) and the output growing line by line, an error as the last line.
Without JS the block stays an ordinary code block.

Author notes go into an optional ```steps block after the output:
«3: текст» replaces the explanation of every run of line 3, «3.2: текст» —
of its second run.
"""

import ast
import html
import json
import re
from pathlib import Path

from tracer import trace_steps

RUN = re.compile(
    r"```python run\n(?P<code>.*?)```"
    r"(?P<io>(?:\n*```(?:output|console|error|text)\n.*?```)*)"
    r"(?:\n*```steps\n(?P<notes>.*?)```)?",
    re.S,
)
IO = re.compile(r"```(output|console|error|text)\n(.*?)```", re.S)
TYPED = re.compile(r"⟪(.*?)⟫")
MARK = "#RUN:"


def file_name(code: str) -> str:
    """A file-like name for a course code block: the first function, class or
    meaningful variable of the example; ``main.py`` otherwise."""
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return "main.py"
    for node in tree.body:
        if isinstance(node, ast.FunctionDef):
            return f"{node.name}.py"
        if isinstance(node, ast.ClassDef):
            return re.sub(r"(?<!^)(?=[A-Z])", "_", node.name).lower() + ".py"
    for node in tree.body:
        if isinstance(node, ast.Assign) and isinstance(node.targets[0], ast.Name):
            name = node.targets[0].id
            if len(name) > 2:
                return f"{name}.py"
    return "main.py"


def record(code: str, io: dict[str, str], notes: str = "") -> list[dict]:
    """Steps of one runnable program, checked against the lesson: the recorded
    output must equal the ```output / ```console block, a run that stops must
    stop with the last line of the ```error block. The full error text of the
    lesson goes into the last step."""
    console = io.get("console", "")
    stdin = "".join(t + "\n" for t in TYPED.findall(console))
    steps = trace_steps(code, notes, stdin)
    got = steps[-1]["out"]
    expected = console or io.get("output")
    if expected is not None and got.strip() != expected.strip():
        raise SystemExit(f"run block output differs:\n{code}\n--- got\n{got}")
    if "error" in io:
        last = steps[-1]
        shown = io["error"].strip()
        if not last.get("stop") or last["error"] != shown.splitlines()[-1]:
            raise SystemExit(f"run block must stop with {shown}:\n{code}")
        last["error"] = shown  # the full message as in the lesson
    return steps


def prepare(md_text: str, store: dict[str, list]) -> str:
    """Record the run of every ```python run block; leave an ordinary fence
    with a marker line that ``code_html`` turns into the runnable block."""

    def one(m: re.Match) -> str:
        code, head = m.group("code"), ""
        if code.startswith("#FILE:"):
            first, _, code = code.partition("\n")
            head = first + "\n"
        steps = record(code, dict(IO.findall(m.group("io"))), m.group("notes") or "")
        key = str(len(store))
        store[key] = steps
        return f"```python\n{head}{MARK}{key}\n{code}```{m.group('io')}"

    return RUN.sub(one, md_text)


def code_html(code: str, store: dict[str, list], highlight) -> str | None:
    """The <pre> of a runnable block: one span per line and the recorded steps."""
    if not code.startswith(MARK):
        return None
    key, _, code = code[len(MARK) :].partition("\n")
    lines = "".join(
        f'<span class="ln">{highlight(line) or " "}</span>'
        for line in code.rstrip("\n").split("\n")
    )
    data = html.escape(json.dumps(store[key], ensure_ascii=False))
    return f'<pre class="code python" data-run="{data}"><code>{lines}</code></pre>'


RUN_JS = (
    "<script>\n" + (Path(__file__).with_suffix(".js")).read_text(encoding="utf-8") + "</script>"
)
