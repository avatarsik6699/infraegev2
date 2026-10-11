"""Compute every sheet of the Excel course and compare it with the text.

Usage:
    python3 -I scripts/lesson_design/verify_sheets.py content/lesson-design/course-excel
    python3 -I scripts/lesson_design/verify_sheets.py content/lesson-design/course-excel --cases

Checks every lesson page of the course (``course.json``) and its extra pages:

- each ```sheet block is computed by ``sheet_eval`` (Russian locale); a value the
  text states with ``⇒`` must be what the sheet shows, and a formula must not
  end in an error the text does not announce (sheetblock.check_block);
- each line of a ```excel block that starts with ``=`` or ``X2: =`` is a formula:
  it must parse and use only functions the course teaches (``sheet_eval.FUNCTIONS``).
  A block ```excel шаблон holds templates with words in place of arguments and
  is not parsed;
- inline code that is a formula (`` `=СУММ(A2:F2)` ``) and a formula written in the
  prose («запиши =СУММ(A2:F2)», as the course source does) are parsed the same
  way; a template with words in place of arguments (``=ЕСЛИ(условие;1;0)``) is
  skipped;
- a formula line is at most 64 characters, as code lines of the course;
- every step of a worked formula (``%%formula_steps(cells, steps, notes)%%``)
  shows the same value as the formula itself (excel_figures.check_steps).

``--cases`` also writes ``sheet_cases.json`` next to ``course.json``: every block
of the course as it stands and with a few cells retyped, with the display of
every cell. ``sheet_conformance.mjs`` runs the browser evaluator on it.
Exit code 1 on any problem.
"""

import ast
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from excel_figures import check_steps  # noqa: E402
from excel_needs import prose_formulas  # noqa: E402
from sheet_eval import FUNCTIONS, FormulaError, function_names, parse  # noqa: E402
from sheetblock import BLOCK, SheetBlockError, blocks_in, cases_for, check_block  # noqa: E402

MAX_LINE = 64
EXCEL = re.compile(r"^```excel( шаблон)?\n(.*?)^```", re.M | re.S)
INLINE = re.compile(r"(?<!`)`(=[^`\n]+)`(?!`)")
STEPS = re.compile(r"%%formula_steps\((.*?)\)%%")
LABEL = re.compile(r"^(?:[A-Z]{1,3}\d+|[\wА-Яа-яЁё ]+!?[A-Z]{1,3}\d+):\s*(?==)")
# extra formulas for the conformance file: the cases the course discusses
STRESS = [
    "=2+3*4",
    "=-2^2",
    "=10%",
    "=1/3",
    "=0,1+0,2",
    "=ОКРУГЛ(2,675;2)",
    "=ОКРУГЛ(-2,5;0)",
    "=ОКРУГЛВВЕРХ(-2,3;0)",
    "=ОКРУГЛВНИЗ(-2,3;0)",
    "=ОТБР(-2,3)",
    "=ЦЕЛОЕ(-2,3)",
    "=ОСТАТ(-7;3)",
    "=ОСТАТ(7;-3)",
    "=ДАТА(2026;13;1)",
    "=ДЕНЬ(ДАТА(2026;2;30))",
    '=СЖПРОБЕЛЫ("  a   b ")',
    '=ПОДСТАВИТЬ("a-b-c";"-";"";2)',
    '=ПСТР("ABCDE";2;3)',
    '="Да"="да"',
    '=СОВПАД("Да";"да")',
    "=10<=5<=20",
    "=12345678901234567",
    "=0,000012345",
    "=СТРОКА()*2",
    "=СТРОКА(C40)",
    "=СУММКВ(3;4)",
    '=ЗНАЧЕН("12,5")+1',
    '=ЕСЛИОШИБКА(1/0;"нет")',
    "=СУММА(1)",
    "=1/0",
]


def is_template(formula: str) -> bool:
    """Lower-case words outside quotes and sheet names stand for arguments."""
    plain = re.sub(r'"[^"]*"', "", formula)
    plain = re.sub(r"(?:'[^']+'|[\wА-Яа-яЁё.]+)!", "", plain)
    return re.search(r"[а-яёa-z…]", plain) is not None


def check_formula(text: str) -> str | None:
    try:
        parse(text)
    except FormulaError as e:
        return str(e)
    unknown = [n for n in function_names(text) if n not in FUNCTIONS]
    if unknown:
        return f"unknown functions {unknown}"
    return None


def pages(course_dir: Path) -> list[Path]:
    course = json.loads((course_dir / "course.json").read_text(encoding="utf-8"))
    files = [course_dir / ls["source"] for m in course["modules"] for ls in m["lessons"]]
    files += [course_dir / p["source"] for p in course.get("pages", [])]
    return [f for f in files if f.exists()]


def check_page(path: Path) -> tuple[list[str], int, int]:
    text = path.read_text(encoding="utf-8")
    problems: list[str] = []
    sheets = formulas = 0
    try:
        found = blocks_in(text)
    except SheetBlockError as e:
        return [f"{path.name}: {e}"], 0, 0
    for line, block in found:
        sheets += 1
        problems += [f"{path.name}:{line}: {p}" for p in check_block(block)]
    for m in EXCEL.finditer(text):
        if m.group(1):
            continue
        start = text.count("\n", 0, m.start()) + 2
        for k, raw in enumerate(m.group(2).splitlines()):
            if len(raw) > MAX_LINE:
                problems.append(f"{path.name}:{start + k}: formula line longer than {MAX_LINE}")
            line = LABEL.sub("", raw.strip())
            if not line.startswith("="):
                continue
            formulas += 1
            err = check_formula(line)
            if err:
                problems.append(f"{path.name}:{start + k}: {line}: {err}")
    for m in INLINE.finditer(text):
        if not re.search(r"[\wА-Яа-яЁё]", m.group(1)[1:]):
            continue  # operators named in the text (`= <> <`), not a formula
        formulas += 1
        err = check_formula(m.group(1))
        if err:
            line = text.count("\n", 0, m.start()) + 1
            problems.append(f"{path.name}:{line}: `{m.group(1)}`: {err}")
    for m in STEPS.finditer(text):
        line = text.count("\n", 0, m.start()) + 1
        call = ast.parse(f"f({m.group(1)})", mode="eval").body
        assert isinstance(call, ast.Call)
        cells, steps = (ast.literal_eval(a) for a in call.args[:2])
        formulas += 1
        for step in steps:
            if step.startswith("="):
                err = check_formula(step)
                if err:
                    problems.append(f"{path.name}:{line}: {step}: {err}")
        problems += [f"{path.name}:{line}: {p}" for p in check_steps(cells, steps)]
    prose = re.sub(r"^```.*?^```", "", BLOCK.sub("", text), flags=re.M | re.S)
    prose = STEPS.sub("", prose)
    prose = re.sub(r"`[^`\n]+`", "", prose)
    prose = re.sub(r"<details[^>]*>|</?summary>|</details>", "", prose)
    for formula in prose_formulas(prose):
        if is_template(formula):
            continue
        formulas += 1
        err = check_formula(formula)
        if err:
            problems.append(f"{path.name}: prose {formula}: {err}")
    return problems, sheets, formulas


def stress_page() -> str:
    rows = "\n".join(f"| {i} | {f} |" for i, f in enumerate(STRESS, start=1))
    return f"```sheet Проверка edit=none\n|   | A |\n{rows}\n```\n"


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 1:
        raise SystemExit(__doc__)
    course_dir = Path(args[0])
    problems: list[str] = []
    total_sheets = total_formulas = 0
    texts = []
    for path in pages(course_dir):
        found, sheets, formulas = check_page(path)
        problems += found
        total_sheets += sheets
        total_formulas += formulas
        texts.append(path.read_text(encoding="utf-8"))
    for p in problems:
        print(p)
    print(f"{total_sheets} sheets, {total_formulas} formulas; {len(problems)} problems")
    if "--cases" in sys.argv and not problems:
        cases = cases_for([*texts, stress_page()])
        out = course_dir / "sheet_cases.json"
        out.write_text(json.dumps(cases, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"{out}: {len(cases)} cases")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
