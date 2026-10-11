"""Write the Excel course's needs.md: which spreadsheet constructs the EGE topics use.

Usage: python3 -I scripts/lesson_design/excel_needs.py content/lesson-design/course-excel

Stage 2 of a mini-course (as needs_report.py for Python): every formula of the
topic sources (``constructs.py`` → SOURCES) is parsed by ``sheet_eval`` —
```excel blocks, formulas in inline code and, in the course source, formulas
written in the prose («В E2 запиши =СУММ(A2:D2)»). A fragment without ``=``
(``$A1:$F1``, ``">"&M1``) is read as a formula. Actions asked for in words
(fill a formula down, filter, sort) are found by ACTIONS. Each construct is
looked up in CONSTRUCTS (where the course explains it); course.json says
which lesson holds that section. The report fails when a topic uses a
construct CONSTRUCTS does not know or that no core lesson explains.
Never edit needs.md by hand: change constructs.py and rerun.
"""

import importlib.util
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
from sheet_eval import FormulaError, Node, parse, tokenize  # noqa: E402

EXCEL = re.compile(r"^```excel[^\n]*\n(.*?)^```", re.S | re.M)
INLINE = re.compile(r"(?<!`)`([^`\n]+)`(?!`)")
CODE = re.compile(r"^```.*?^```", re.S | re.M)
LABEL = re.compile(r"^[A-Z]{1,3}\d+:\s*")
CRITERIA = {"СЧЁТЕСЛИ": [1], "СУММЕСЛИ": [1], "СРЗНАЧЕСЛИ": [1]}
CRITERIA_PAIRS = {"СЧЁТЕСЛИМН": 0, "СУММЕСЛИМН": 1, "СРЗНАЧЕСЛИМН": 1}


def load_constructs(course_dir: Path):
    spec = importlib.util.spec_from_file_location("constructs", course_dir / "constructs.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def prose_formulas(text: str) -> list[str]:
    """Formulas written in running text: from ``=`` to the end of the expression."""
    out = []
    end = 0
    for m in re.finditer(r"(?<![\w=<>])=(?=[A-ZА-ЯЁ$(\d\-'])", text):
        if m.start() < end:
            continue  # a comparison inside a formula already taken
        depth, i, quote = 0, m.start() + 1, False
        while i < len(text):
            ch = text[i]
            if ch == '"':
                quote = not quote
            elif not quote:
                if ch == "(":
                    depth += 1
                elif ch == ")":
                    if depth == 0:
                        break
                    depth -= 1
                elif ch.isspace() and depth == 0:
                    break
                elif ch == "\n":
                    break
            i += 1
        end = i
        formula = text[m.start() : i].rstrip(".,:;—?!»")
        if len(formula) > 2:
            out.append(formula)
    return out


def formulas_of(text: str, prose: bool) -> list[str]:
    found = []
    for block in EXCEL.findall(text):
        pending = ""
        for line in block.splitlines():
            line = LABEL.sub("", line.strip()) if not pending else line.strip()
            pending += line
            if pending and pending.count("(") <= pending.count(")"):
                found.append(pending)  # a formula broken over lines is joined
                pending = ""
    plain = CODE.sub("", text)
    for code in INLINE.findall(plain):
        if re.fullmatch(r"[=<>&\s]+", code):
            continue  # an operator named in the text, not a formula
        if code.startswith("=") or re.search(r"[A-Z]+\$?\d|[А-ЯЁ]{2,}\(", code):
            found.append(code)
    if prose:
        found += prose_formulas(INLINE.sub("", plain))
    return found


def walk(node: Node, out: set[str], depth: int = 0) -> None:
    kind = node.kind
    if kind == "binary":
        op = node.value
        if op in ("+", "-", "*", "/"):
            out.add("op arithmetic")
        elif op == "^":
            out.add("op ^")
        elif op == "&":
            out.add("op &")
            left = node.args[0]
            if left.kind == "str" and re.match(r"[<>=]", str(left.value)):
                out.add("criterion ref")
        else:
            out.add("op compare")
    elif kind == "unary":
        out.add("op arithmetic")
    elif kind == "percent":
        out.add("op %")
    elif kind == "func":
        name = str(node.value)
        out.add(f"fn {name}")
        if depth:
            out.add("nested")
        if (
            name == "ЕСЛИ"
            and len(node.args) == 3
            and [a.value for a in node.args[1:]] == [1.0, 0.0]
        ):
            out.add("flag")
        positions = list(CRITERIA.get(name, []))
        if name in CRITERIA_PAIRS:
            start = CRITERIA_PAIRS[name] + 1
            positions += list(range(start, len(node.args), 2))
        for p in positions:
            if p < len(node.args) and node.args[p].kind == "str":
                crit = str(node.args[p].value)
                if re.match(r"[<>=]", crit):
                    out.add("criterion op")
                if re.search(r"(?<!~)[*?]", crit):
                    out.add("criterion wildcard")
        for a in node.args:
            walk(a, out, depth + 1)
        return
    for a in node.args:
        walk(a, out, depth)


def constructs_of(formula: str) -> set[str] | None:
    text = formula if formula.startswith("=") else "=" + formula
    try:
        tree = parse(text)
        toks = tokenize(text)
    except FormulaError:
        return None
    out = {"formula"} if formula.startswith("=") else set()
    walk(tree, out)
    for t in toks:
        if t.kind != "ref":
            continue
        body = t.text.rsplit("!", 1)[-1]
        if "!" in t.text:
            out.add("ref sheet")
        if ":" in body:
            out.add("ref range")
        for end in body.split(":"):
            dollars = (end.startswith("$"), "$" in end[1:])
            if all(dollars):
                out.add("ref absolute")
            elif any(dollars):
                out.add("ref mixed")
            else:
                out.add("ref relative")
    return out


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    course_dir = Path(sys.argv[1])
    cons = load_constructs(course_dir)
    course = json.loads((course_dir / "course.json").read_text(encoding="utf-8"))
    owner: dict[str, tuple[int, dict]] = {}
    number = 0
    for module in course["modules"]:
        for lesson in module["lessons"]:
            number += 1
            for section in lesson["sections"]:
                owner[section] = (number, lesson)

    uses: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    stats = []
    unparsed: list[str] = []
    for source, (task, span) in cons.SOURCES.items():
        path = ROOT / source.split("#")[0]
        lines = path.read_text(encoding="utf-8").split("\n")
        text = "\n".join(lines[span[0] - 1 : span[1]] if span else lines)
        formulas = formulas_of(text, prose=span is not None)
        parsed = 0
        for f in formulas:
            found = constructs_of(f)
            if found is None:
                unparsed.append(f"{source}: {f}")
                continue
            parsed += 1
            for c in found:
                uses[c][task] += 1
        plain = CODE.sub("", text)
        for action, pattern in cons.ACTIONS.items():
            hits = len(re.findall(pattern, plain, re.I))
            if hits:
                uses[action][task] += hits
        stats.append((source, task, len(formulas), parsed))

    problems = []
    rows = []
    for c in sorted(uses, key=lambda c: (-len(uses[c]), -sum(uses[c].values()), c)):
        if c not in cons.CONSTRUCTS:
            problems.append(f"unknown construct {c!r}: add it to constructs.CONSTRUCTS")
            continue
        section, what = cons.CONSTRUCTS[c]
        key = section.rstrip("+")
        if key not in owner:
            problems.append(f"{c}: section {section} belongs to no lesson of course.json")
            continue
        n, lesson = owner[key]
        if lesson["level"] != "основной":
            problems.append(f"{c}: lesson {n} ({section}) is not core")
        topics = ", ".join(sorted(uses[c], key=lambda t: int(t)))
        rows.append(
            f"| {what} | {len(uses[c])} | {topics} | {sum(uses[c].values())} | {section} "
            f"| [{n}. {lesson['title']}](xl-{n:02d}.html) |"
        )

    needed_lessons = {
        owner[cons.CONSTRUCTS[c][0].rstrip("+")][0] for c in uses if c in cons.CONSTRUCTS
    }
    unused = []
    number = 0
    for module in course["modules"]:
        for lesson in module["lessons"]:
            number += 1
            if number not in needed_lessons:
                unused.append(f"- {number}. {lesson['title']} ({lesson['level']})")

    out = [
        "# Что нужно темам ЕГЭ от курса Excel",
        "",
        "Файл сгенерирован скриптом `excel_needs.py` из формул тем ЕГЭ (`constructs.py` → "
        "`SOURCES`) и привязки конструкций к разделам учебника (`constructs.py` → `CONSTRUCTS`). "
        "Руками не правится.",
        "",
        "## Итог",
        "",
        f"- Источников: **{len(stats)}**, формул: **{sum(s[2] for s in stats)}**, "
        f"разобрано: **{sum(s[3] for s in stats)}**.",
        f"- Различных конструкций: **{len(uses)}**; все объяснены в уроках основного уровня: "
        f"**{'да' if not problems else 'нет'}**.",
        f"- Уроков курса, ни один раздел которых не нужен темам напрямую: **{len(unused)}** "
        "(список в конце).",
        "",
        "**Правило уровней.** Конструкция, которую использует хотя бы одна тема ЕГЭ, объясняется "
        "в уроке основного уровня. Урок без прямой потребности тем остаётся основным, если без "
        "него не читаются следующие уроки или не проверить решение; иначе он дополнительный.",
        "",
        "У тем 3, 18 и 22 пока нет своих исходников. До их появления то, что им нужно, задают "
        "главы 14–17 учебника Excel — разборы, переданные этим темам (решение архитектора "
        "2026-10-11). Раздел со знаком «+» — пробел учебника: урок курса добавляет конструкцию "
        "(список — в [карте курса](xl-map.html)).",
        "",
        "## Формулы по источникам",
        "",
        "| Источник | Тема | Формул | Разобрано |",
        "|---|---:|---:|---:|",
        *[f"| `{s}` | {t} | {n} | {p} |" for s, t, n, p in stats],
        "",
        "## Конструкции",
        "",
        "Число в столбце «Раз» — сколько раз конструкция встречается во всех источниках.",
        "",
        "| Конструкция | Тем | Темы | Раз | Раздел учебника | Урок курса |",
        "|---|---:|---|---:|---|---|",
        *rows,
        "",
        "## Уроки без прямой потребности тем",
        "",
        "Они остаются в курсе: на них опираются следующие уроки или проверка решения "
        "(обоснование — в карте курса).",
        "",
        *unused,
        "",
    ]
    if unparsed:
        out += ["## Не разобраны", "", *[f"- `{u}`" for u in unparsed], ""]
    (course_dir / "needs.md").write_text("\n".join(out), encoding="utf-8")
    for p in problems:
        print(p)
    print(
        f"needs.md: {len(uses)} constructs, {sum(s[2] for s in stats)} formulas, "
        f"{len(unparsed)} unparsed; {len(problems)} problems"
    )
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
