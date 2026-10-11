"""Python course bank tasks for the site (Change 175, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/course-python/bank.py          # check only
    python3 -I content/lesson-design/course-python/bank.py --write  # update the bank

``tasks.json`` names, per lesson file, the tasks with one checkable answer and
that answer as the learner types it; the other tasks of the lesson are its
self-check (``export_course.py``). A statement is the lesson's question
verbatim, the explanation is the lesson's own answer. Every token of the
checkable answer must appear in the lesson's answer, and ``checks.py``
recomputes the lesson answers; ``apps/api/tests/test_course_python_bank.py``
recomputes the bank answers once more by other means.

``--write`` replaces the course tasks in ``content/practice-bank/bank.json``,
archives the tasks of the earlier course (its lessons were rebuilt, Change
175) and copies the publication metadata (materials, courses) from the registry. Run
Prettier on the bank afterwards.
"""

import json
import re
import sys
import textwrap
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
BANK = REPO / "content/practice-bank/bank.json"
REGISTRY = REPO / "apps/api/practice-registry.json"
TASK_BLOCK = "**Чтобы проверить понимание"


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
    first, _, rest = text.partition("\n")
    return first + ("\n" + textwrap.dedent(rest) if rest else "")


def statement(question: str) -> list[dict]:
    """The question verbatim; a fence becomes its own code block."""
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
                        "language": "python" if parts[k + 1] == "python" else "text",
                        "code": textwrap.dedent(parts[k + 2]),
                        "caption": None,
                    },
                }
            )
    return blocks


def plain(text: str) -> str:
    return re.sub(r"\*\*|`", "", " ".join(text.split()))


def title(question: str) -> str:
    text = plain(question.split("```")[0])
    bold = re.match(r"\*\*(.+?)\*\*", question)
    if bold:
        return bold.group(1)
    first = re.split(r"(?<=[.?!])\s", text)[0].rstrip(".")
    return first if len(first) <= 80 else first[:77].rsplit(" ", 1)[0] + "…"


def instruction(answer: str) -> str:
    tokens = answer.split()
    if len(tokens) == 1 and re.fullmatch(r"-?\d+(\.\d+)?", answer):
        return "Введите число."
    if answer[:1] in "[({" and answer[-1:] in "])}" and answer.count(" ") == answer.count(", "):
        return "Запишите результат так, как его печатает Python."
    if len(tokens) == 1:
        return "Введите ответ одним значением, как его покажет Python."
    return (
        "Запишите ответы через пробел в порядке вопроса; "
        "списки и строки — так, как их печатает Python."
    )


def variants(answer: str) -> list[str]:
    out = [answer]
    if re.search(r"-\d", answer):
        out.append(re.sub(r"-(?=\d)", "−", answer))
    return out


def agrees(answer: str, written: str) -> bool:
    """Every token of the bank answer appears in the lesson's own answer."""
    text = written.replace("−", "-").replace("`", "").casefold()
    return all(token.casefold() in text for token in answer.split())


def build() -> tuple[list[dict], dict[str, bool]]:
    course = json.loads((HERE / "course.json").read_text(encoding="utf-8"))
    table = json.loads((HERE / "tasks.json").read_text(encoding="utf-8"))
    tasks: list[dict] = []
    for module in course["modules"]:
        for lesson in module["lessons"]:
            lesson_id = lesson["site"]["id"]
            chosen = table.get(lesson["source"][:2], {})
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
                tasks.append(
                    {
                        "task": {
                            "id": f"{lesson_id}-t{int(number):02d}",
                            "title": title(question),
                            "short_description": None,
                            "explanation_kind": "unclassified",
                            "difficulty": 2 if question.startswith("Напиши") else 1,
                            "estimated_minutes": None,
                            "answer_instruction": instruction(answer),
                            "interaction_type": "production",
                            "content_schema_version": 1,
                            "statement": statement(question),
                            "hint": [
                                {
                                    "type": "text",
                                    "data": {
                                        "markdown": f"Опора — урок «{lesson['title']}»: "
                                        "проследи программу по строкам и запиши значения так, "
                                        "как их покажет Python."
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
                            "files": [],
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
    return tasks, {}


def main() -> int:
    tasks, _ = build()
    for entry in tasks:
        task = entry["task"]
        print(task["id"], "|", task["checker"]["answer_variants"][0][:60])
    if "--write" not in sys.argv:
        print(f"{len(tasks)} tasks agree with the lesson files (dry run)")
        return 0
    bank = json.loads(BANK.read_text(encoding="utf-8"))
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    new_ids = {entry["task"]["id"] for entry in tasks}
    kept, archived = [], 0
    for entry in bank["tasks"]:
        task = entry["task"]
        if task["id"] in new_ids:
            continue
        if any(link["material_id"].startswith("python-") for link in task["lessons"]):
            task.update(archived=True, catalog_visible=False, lessons=[], theory_links=[])
            archived += 1
        kept.append(entry)
    bank["tasks"] = kept + tasks
    # publication metadata must equal the release registry, order included
    bank["materials"] = registry["materials"]
    bank["courses"] = registry["courses"]
    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(tasks)} tasks; archived {archived}; run Prettier on {BANK}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
