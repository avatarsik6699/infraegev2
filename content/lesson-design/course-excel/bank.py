"""Excel course bank tasks for the site (Change 177, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs`` and
``workbook.py``, which builds the problem book ``files/excel-zadachnik.xlsx``):

    python3 -I content/lesson-design/course-excel/bank.py          # check only
    python3 -I content/lesson-design/course-excel/bank.py --write  # update the bank

``tasks.json`` names, per lesson file, the tasks with one short checkable answer
(a number, a word, an address; several values through a space) and that answer
as the learner types it; the other tasks — a formula or reasoning as the answer —
are the lesson's self-check (``export_course.py``): equivalent formulas cannot be
compared as strings. A statement is the lesson's question verbatim, the
explanation is the lesson's own answer; every token of the checkable answer must
appear in it, and ``checks.py`` recomputes the lesson answers.
``apps/api/tests/test_course_excel_bank.py`` recomputes the bank answers once
more by other means.

The tasks whose data lie on the «Задачи» sheet of the problem book (Задачник)
(``workbook.PRACTICE``) carry it as an attachment; the bank keeps it by
its sha256 (the build is reproducible). ``--write`` replaces the course tasks in
``content/practice-bank/bank.json``, copies the problem book into
``content/practice-bank/files/`` and the publication metadata (materials,
courses) from the registry. Run Prettier on the bank afterwards.
"""

import hashlib
import json
import re
import shutil
import sys
import textwrap
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
BANK = REPO / "content/practice-bank/bank.json"
BANK_FILES = REPO / "content/practice-bank/files"
REGISTRY = REPO / "apps/api/practice-registry.json"
WORKBOOK = HERE / "files" / "excel-zadachnik.xlsx"
TASK_BLOCK = "**Чтобы проверить понимание"
XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
# lesson file → task numbers whose data are on the problem book's «Задачи» sheet
WORKBOOK_TASKS = {"04": {8}, "07": {8}, "09": {6}, "13": {2}, "14": {8}}
WORKBOOK_NOTE = (
    "Задачник курса: лист «Задачи» — данные задачи и жёлтые ячейки для формул, "
    "лист «Ответы» — решения формулами"
)


def inventory(md: str) -> dict[int, tuple[str, str]]:
    step = next(s for s in re.split(r"\n---\n", md) if s.strip().startswith(TASK_BLOCK))
    step = re.sub(r"<details.*?</details>", "", step, flags=re.S)
    questions, _, answers = step.partition("\n**Ответы для проверки:**\n")

    def numbered(text: str) -> dict[int, str]:
        found = re.split(r"(?m)^(\d+)\. ", text)
        return {int(found[k]): found[k + 1].strip() for k in range(1, len(found) - 1, 2)}

    q, a = numbered(questions), numbered(answers)
    return {n: (q[n], a.get(n, "")) for n in q}


def dedent(text: str) -> str:
    """Continuation lines dedented; keys [[Ctrl+C]] as plain text in the bank."""
    text = re.sub(r"\[\[([^\]\n]+)\]\]", r"\1", text)
    first, _, rest = text.partition("\n")
    return first + ("\n" + textwrap.dedent(rest) if rest else "")


def statement(question: str) -> list[dict]:
    """The question verbatim; a fence (a CSV line, a formula) becomes a text block."""
    blocks = []
    parts = re.split(r"\n\s*```(\w*)\n(.*?)\n\s*```", dedent(question), flags=re.S)
    for k in range(0, len(parts), 3):
        text = " ".join(parts[k].split())
        if text:
            blocks.append({"type": "text", "data": {"markdown": text}})
        if k + 2 < len(parts):
            blocks.append(
                {
                    "type": "code_example",
                    "data": {
                        "language": "text",
                        "code": textwrap.dedent(parts[k + 2]),
                        "caption": None,
                    },
                }
            )
    return blocks


def plain(text: str) -> str:
    return re.sub(r"\*\*|`|\[\[|\]\]", "", " ".join(text.split()))


def title(question: str) -> str:
    text = plain(question.split("```")[0])
    first = re.split(r"(?<=[.?!])\s", text)[0].rstrip(".")
    return first if len(first) <= 80 else first[:77].rsplit(" ", 1)[0] + "…"


def instruction(answer: str) -> str:
    tokens = answer.split()
    if len(tokens) == 1 and re.fullmatch(r"-?\d+(,\d+)?", answer):
        return "Введите число."
    if len(tokens) == 1:
        return "Введите ответ одним значением — так, как его покажет Excel."
    return "Запишите ответы через пробел в порядке вопроса."


def variants(answer: str) -> list[str]:
    out = [answer]
    if re.search(r"-\d", answer):
        out.append(re.sub(r"-(?=\d)", "−", answer))
    return out


# a lesson answer may name a small count in words: «Три поля», «Шесть ячеек»
WORDS = {
    "одна": "1",
    "один": "1",
    "две": "2",
    "два": "2",
    "три": "3",
    "четыре": "4",
    "пять": "5",
    "шесть": "6",
    "семь": "7",
    "восемь": "8",
    "девять": "9",
    "десять": "10",
}


def agrees(answer: str, written: str) -> bool:
    """Every token of the bank answer appears in the lesson's own answer."""
    text = written.replace("−", "-").replace("`", "").casefold()
    numbers = {WORDS[w] for w in re.findall(r"[а-яё]+", text) if w in WORDS}
    return all(token.casefold() in text or token in numbers for token in answer.split())


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def build() -> tuple[list[dict], dict[str, Path]]:
    course = json.loads((HERE / "course.json").read_text(encoding="utf-8"))
    table = json.loads((HERE / "tasks.json").read_text(encoding="utf-8"))
    tasks: list[dict] = []
    files: dict[str, Path] = {}
    for module in course["modules"]:
        for lesson in module["lessons"]:
            lesson_id = lesson["site"]["id"]
            key = lesson["source"][:2]
            chosen = table.get(key, {})
            texts = inventory((HERE / lesson["source"]).read_text(encoding="utf-8"))
            advanced = lesson["level"] == "дополнительный"
            for position, (number, answer) in enumerate(
                sorted(chosen.items(), key=lambda item: int(item[0]))
            ):
                question, written = texts[int(number)]
                if not agrees(answer, written):
                    raise SystemExit(f"{lesson_id} {number}: {answer!r} not in {written!r}")
                membership: dict = {"position": position, "material_id": lesson_id}
                if advanced:
                    membership["counts_toward_mastery"] = False
                attachments = []
                if int(number) in WORKBOOK_TASKS.get(key, set()):
                    if not WORKBOOK.exists():
                        raise SystemExit(
                            f"{WORKBOOK.relative_to(REPO)} is missing: run workbook.py"
                        )
                    checksum = sha256(WORKBOOK)
                    files[checksum] = WORKBOOK
                    attachments.append(
                        {
                            "id": "statement-1",
                            "purpose": "attachment",
                            "checksum": checksum,
                            "filename": WORKBOOK.name,
                            "attribution": None,
                            "description": WORKBOOK_NOTE,
                        }
                    )
                tasks.append(
                    {
                        "task": {
                            "id": f"{lesson_id}-t{int(number):02d}",
                            "title": title(question),
                            "short_description": None,
                            "explanation_kind": "unclassified",
                            "difficulty": 2 if attachments else 1,
                            "estimated_minutes": None,
                            "answer_instruction": instruction(answer),
                            "interaction_type": "production",
                            "content_schema_version": 1,
                            "statement": statement(question)
                            + (
                                [{"type": "attachment", "data": {"usage_id": "statement-1"}}]
                                if attachments
                                else []
                            ),
                            "hint": [
                                {
                                    "type": "text",
                                    "data": {
                                        "markdown": f"Опора — урок «{lesson['title']}»: "
                                        "рассуди по шагам, а затем проверь в Excel."
                                    },
                                }
                            ],
                            "explanation": [
                                {
                                    "type": "text",
                                    "data": {"markdown": " ".join(dedent(written).split())},
                                }
                            ],
                            "skills": [],
                            "exam_numbers": [],
                            "files": attachments,
                            "lessons": [membership],
                            "theory_links": [],
                            "catalog_visible": False,
                            "archived": False,
                            "sources": [
                                {
                                    "url": None,
                                    "kind": "original",
                                    "role": "original",
                                    "year": None,
                                    "title": None,
                                    "author": None,
                                    "primary": True,
                                    "is_public": True,
                                    "adaptation": None,
                                    "original_id": None,
                                }
                            ],
                            "checker": {
                                "checker_type": "exact_match",
                                "answer_variants": variants(answer),
                                "numeric_tolerance": None,
                            },
                        },
                        "solution_revision": 1,
                    }
                )
    return tasks, files


def main() -> int:
    tasks, files = build()
    for entry in tasks:
        task = entry["task"]
        clip = " +xlsx" if task["files"] else ""
        print(task["id"], "|", task["checker"]["answer_variants"][0][:60] + clip)
    if "--write" not in sys.argv:
        print(f"{len(tasks)} tasks agree with the lesson files (dry run)")
        return 0
    bank = json.loads(BANK.read_text(encoding="utf-8"))
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    new_ids = {entry["task"]["id"] for entry in tasks}
    bank["tasks"] = [e for e in bank["tasks"] if e["task"]["id"] not in new_ids] + tasks
    known = {f["checksum"] for f in bank["files"]}
    for checksum, path in files.items():
        shutil.copy(path, BANK_FILES / checksum)
        if checksum not in known:
            bank["files"].append(
                {
                    "format": "xlsx",
                    "checksum": checksum,
                    "mime_type": XLSX_MIME,
                    "size_bytes": path.stat().st_size,
                    "storage_key": checksum,
                }
            )
    # publication metadata must equal the release registry, order included
    bank["materials"] = registry["materials"]
    bank["courses"] = registry["courses"]
    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(tasks)} tasks and {len(files)} files; run Prettier on {BANK}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
