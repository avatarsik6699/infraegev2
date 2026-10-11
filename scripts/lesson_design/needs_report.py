"""Write a course's needs.md: which Python constructs the EGE topic sources use.

Usage: python3 -I scripts/lesson_design/needs_report.py content/lesson-design/course-python

A mini-course has no task collections to count, so its stage 2 asks a
different question: which constructs do the EGE topic lessons rely on?
Every ``python`` block of every topic source (SOURCES in ``constructs.py``)
is parsed with ``ast``; a block that is only a header line (``if x:``) is
completed with ``pass``. Each construct found is looked up in CONSTRUCTS,
which says where the course explains it; ``course.json`` says which course
lesson holds that source section. The report fails when a topic uses a
construct that CONSTRUCTS does not know or that no core course lesson
explains. Never edit needs.md by hand: change constructs.py and rerun.
"""

import ast
import builtins
import importlib.util
import json
import re
import sys
import textwrap
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FENCE = re.compile(r"^```(\w*)\n(.*?)^```", re.S | re.M)

OPERATORS = {
    ast.FloorDiv: "op //",
    ast.Mod: "op %",
    ast.Pow: "op **",
    ast.Div: "op /",
    ast.BitAnd: "op &",
    ast.BitOr: "op |",
    ast.BitXor: "op ^",
    ast.LShift: "op <<",
    ast.RShift: "op >>",
    ast.Invert: "op ~",
    ast.Not: "not",
    ast.And: "and",
    ast.Or: "or",
    ast.In: "in",
    ast.NotIn: "in",
    ast.Is: "is",
    ast.IsNot: "is",
}
STATEMENTS = {
    ast.While: "while",
    ast.For: "for",
    ast.If: "if",
    ast.Break: "break",
    ast.Continue: "continue",
    ast.FunctionDef: "def",
    ast.Return: "return",
    ast.Lambda: "lambda",
    ast.ListComp: "listcomp",
    ast.SetComp: "setcomp",
    ast.DictComp: "dictcomp",
    ast.GeneratorExp: "genexp",
    ast.Try: "try",
    ast.Raise: "raise",
    ast.With: "with",
    ast.Yield: "yield",
    ast.YieldFrom: "yield",
    ast.ClassDef: "class",
    ast.Global: "global",
    ast.Nonlocal: "nonlocal",
    ast.Assert: "assert",
    ast.Match: "match",
    ast.JoinedStr: "f-string",
    ast.IfExp: "ternary",
    ast.AugAssign: "augassign",
    ast.Slice: "slice",
    ast.Starred: "star",
    ast.NamedExpr: "walrus",
    ast.Dict: "dict literal",
    ast.Set: "set literal",
    ast.List: "list literal",
    ast.Tuple: "tuple",
}
BUILTINS = set(dir(builtins))


def load(folder: Path):
    spec = importlib.util.spec_from_file_location("constructs", folder / "constructs.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def parse(code: str):
    code = textwrap.dedent(code)
    for tail in ("", "\n    pass", "\ndef f():\n    pass"):
        try:
            return ast.parse(code + tail)
        except SyntaxError:
            continue
    return None


def features(tree: ast.AST) -> Counter:
    """Construct keys of one program: syntax, operators, builtins, methods, imports."""
    found = Counter()
    for node in ast.walk(tree):
        kind = STATEMENTS.get(type(node))
        if kind:
            found[kind] += 1
        if (
            isinstance(node, ast.If)
            and len(node.orelse) == 1
            and isinstance(node.orelse[0], ast.If)
        ):
            found["elif"] += 1
        if isinstance(node, (ast.For, ast.While)) and node.orelse:
            found["loop else"] += 1
        if isinstance(node, ast.Compare) and len(node.ops) > 1:
            found["chained compare"] += 1
        if isinstance(node, ast.For) and isinstance(node.target, ast.Tuple):
            found["unpack"] += 1
        if isinstance(node, ast.Assign) and any(isinstance(t, ast.Tuple) for t in node.targets):
            found["unpack"] += 1
        if isinstance(node, (ast.BinOp, ast.UnaryOp, ast.BoolOp)):
            key = OPERATORS.get(type(node.op))
            if key:
                found[key] += 1
        if isinstance(node, ast.Compare):
            for op in node.ops:
                key = OPERATORS.get(type(op))
                if key:
                    found[key] += 1
        if isinstance(node, ast.FunctionDef):
            for dec in node.decorator_list:
                target = dec.func if isinstance(dec, ast.Call) else dec
                name = (
                    target.attr if isinstance(target, ast.Attribute) else getattr(target, "id", "")
                )
                found[f"@{name}"] += 1
            if node.args.defaults or any(node.args.kw_defaults):
                found["default args"] += 1
            if node.args.vararg:
                found["*args"] += 1
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in BUILTINS:
                found[f"{node.func.id}()"] += 1
            elif isinstance(node.func, ast.Attribute):
                found[f".{node.func.attr}()"] += 1
            if node.keywords:
                for kw in node.keywords:
                    if kw.arg in ("key", "reverse", "sep", "end", "maxsize"):
                        found[f"{kw.arg}="] += 1
        if isinstance(node, ast.Import):
            for alias in node.names:
                found[f"import {alias.name}"] += 1
        if isinstance(node, ast.ImportFrom):
            for alias in node.names:
                found[f"from {node.module} import {alias.name}"] += 1
    return found


def scan(sources: dict[str, str]):
    """Per topic: Counter of construct -> number of programs that use it."""
    uses: dict[str, Counter] = {}
    skipped: dict[str, int] = {}
    programs: dict[str, int] = {}
    for path, topic in sources.items():
        text = (ROOT / path).read_text(encoding="utf-8")
        counter, miss, total = Counter(), 0, 0
        for match in FENCE.finditer(text):
            if match.group(1) not in ("python", "py"):
                continue
            total += 1
            tree = parse(match.group(2))
            if tree is None:
                miss += 1
                continue
            counter.update(set(features(tree)))
        uses[topic], skipped[topic], programs[topic] = counter, miss, total
    return uses, skipped, programs


def lessons_by_section(course: dict) -> dict[str, tuple[str, str]]:
    """Source section -> (lesson file, level) from course.json."""
    owner = {}
    for module in course["modules"]:
        for lesson in module["lessons"]:
            for section in lesson.get("sections", []):
                owner[section] = (lesson["source"], lesson["level"])
    return owner


def report(c, course: dict) -> tuple[str, list[str]]:
    uses, skipped, programs = scan(c.SOURCES)
    owner = lessons_by_section(course)
    titles = {
        lesson["source"]: lesson["title"] for m in course["modules"] for lesson in m["lessons"]
    }
    topics = list(dict.fromkeys(c.SOURCES.values()))
    total = Counter()
    where = defaultdict(list)
    for topic in topics:
        for key, n in uses[topic].items():
            if key in c.IGNORE:
                continue
            total[key] += n
            where[key].append(topic)
    errors = []
    rows = []
    for key in sorted(total, key=lambda k: (-len(where[k]), -total[k], k)):
        construct = c.CONSTRUCTS.get(key)
        if construct is None:
            errors.append(f"construct {key!r} used by topics {where[key]} is not in CONSTRUCTS")
            continue
        section, name = construct
        if section.startswith("тема "):
            shown = f"объясняется в {section.replace('тема', 'теме')}"
        else:
            lesson, level = owner.get(section.rstrip("+"), ("", ""))
            if not lesson:
                errors.append(f"section {section} ({key}) belongs to no lesson of course.json")
            elif level != "основной":
                errors.append(f"{key} is needed by topics but lesson {lesson} is {level}")
            shown = titles.get(lesson, "—")
        rows.append(
            f"| `{key}` | {name} | {len(where[key])} | {', '.join(where[key])} | "
            f"{total[key]} | {section} | {shown} |"
        )
    used_sections = {c.CONSTRUCTS[k][0].rstrip("+") for k in total if k in c.CONSTRUCTS}
    unused = [
        f"| {lesson['title']} | {lesson['level']} |"
        for module in course["modules"]
        for lesson in module["lessons"]
        if not used_sections & set(lesson.get("sections", []))
    ]
    parsed = sum(programs.values()) - sum(skipped.values())
    lines = [
        "# Какие конструкции Python нужны темам ЕГЭ",
        "",
        "Файл сгенерирован скриптом `needs_report.py` из исходников тем ЕГЭ "
        "(`constructs.py` → `SOURCES`) и привязки конструкций к разделам учебника "
        "(`constructs.py` → `CONSTRUCTS`). Руками не правится.",
        "",
        "## Итог",
        "",
        f"- Исходников тем: **{len(c.SOURCES)}**, программ Python: **{sum(programs.values())}**, "
        f"разобрано: **{parsed}**.",
        f"- Различных конструкций: **{len(total)}**; все объяснены в уроках основного уровня: "
        f"**{'да' if not errors else 'НЕТ'}**.",
        f"- Уроков курса, ни один раздел которых не нужен темам напрямую: **{len(unused)}** "
        "(список в конце).",
        "",
        c.RULE,
        "",
        "## Программы по темам",
        "",
        "| Тема | Программ | Разобрано |",
        "|---|---:|---:|",
    ]
    for topic in topics:
        lines.append(f"| {topic} | {programs[topic]} | {programs[topic] - skipped[topic]} |")
    lines += [
        "",
        "## Конструкции",
        "",
        "Число в столбце «Программ» — в скольких программах всех тем встречается конструкция.",
        "",
        "| Конструкция | Что это | Тем | Темы | Программ | Раздел учебника | Урок курса |",
        "|---|---|---:|---|---:|---|---|",
        *rows,
        "",
        "## Уроки без прямой потребности тем",
        "",
        "| Урок | Уровень |",
        "|---|---|",
        *unused,
        "",
    ]
    if getattr(c, "NOTES", ""):
        lines[lines.index("## Программы по темам") : lines.index("## Программы по темам")] = [
            c.NOTES,
            "",
        ]
    return "\n".join(lines), errors


def main() -> int:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    folder = Path(sys.argv[1])
    data = load(folder)
    course = json.loads((folder / "course.json").read_text(encoding="utf-8"))
    text, errors = report(data, course)
    (folder / "needs.md").write_text(text, encoding="utf-8")
    print(f"{folder / 'needs.md'} written")
    for error in errors:
        print("ERROR:", error)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
