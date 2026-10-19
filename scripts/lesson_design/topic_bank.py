"""Bank tasks of an EGE topic lesson, shared by every ``topic-NN/bank.py`` (Change 184).

A topic's ``bank.py`` lists its tasks and calls :func:`main`:

    python3 -I content/lesson-design/topic-NN/bank.py          # check only
    python3 -I content/lesson-design/topic-NN/bank.py --write  # update the bank

Run ``node scripts/practice-registry.mjs`` first: theory links name sections of
the published lesson. A task of a subtopic page or of «Практика и итог» with a
short checkable answer (one or a few numbers) becomes a bank task; a question
answered by a formula, a translation of words, a proof or «да / нет» with a
reason is a subtopic self-check (``topic.json`` → ``site.checkpoints``, the
question and its answer verbatim — :func:`checkpoints` writes them).

A task is a dict:

- ``at``: (page, number) — page 1… are the subtopics of ``topic.json`` in order,
  the last page is «Практика и итог»; number is the task's number on the page;
- ``section``: the step anchor the task trains (no theory link on the final page);
- ``title``, ``difficulty`` (1–3), ``minutes``, ``instruction``, ``hint``;
- ``code``: the solution program; it prints the answer, run next to the task's
  files; lines are at most 64 characters;
- or, for a topic solved in a spreadsheet (no Python in its lesson), ``answer``:
  the answer computed by the topic's ``bank.py`` with the stand's own solver, and
  ``excel``: optional formulas of the solution, shown as text;
- ``files``: optional ``[(file name in topic-NN/files, description)]`` attached
  to the task;
- ``exams``: optional exam numbers of the task when the topic spans several
  (19–21); the topic's number otherwise;
- ``alt``: optional other spellings of the same answer the checker accepts
  (a decimal comma: ``2.25`` and ``2,25``);
- ``says``: optional phrases the written answer must contain, for an answer
  written in words; otherwise every printed token must appear in it in order.

The statement is the question verbatim (a stand link to a data file becomes the
file name, a course term keeps its label); the explanation is the written
answer and the solution program. Tasks of advanced subtopics are outside
mastery. ``--write`` replaces the topic's tasks (``remove`` archives the tasks of a
retired lesson, hidden and unlinked as the retired Python course tasks; ``relink`` moves other tasks' theory links to the new sections) in ``content/practice-bank/bank.json``, copies the files into
``content/practice-bank/files/<sha256>`` and refreshes the materials from the
registry; run Prettier on the bank afterwards.
"""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
import textwrap
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
BANK = REPO / "content/practice-bank/bank.json"
BANK_FILES = REPO / "content/practice-bank/files"
REGISTRY = REPO / "apps/api/practice-registry.json"
TASK_BLOCK = ("**Чтобы проверить понимание", "**Задачи основных подтем")
MAX_CODE_LINE = 64
XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
MIME = {
    ".xlsx": ("xlsx", XLSX_MIME),
    ".txt": ("txt", "text/plain"),
    ".png": ("png", "image/png"),
}
NUMBER = "Введите число."
TWO = "Введите два числа через пробел в том порядке, в каком их спрашивают."
THREE = "Введите три числа через пробел в том порядке, в каком их спрашивают."
SOURCE = {
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


def pages(topic: Path) -> tuple[dict, list[str]]:
    meta = json.loads((topic / "topic.json").read_text())
    return meta, [s["source"] for s in meta["subtopics"]] + [meta["final"]["source"]]


def task_inventory(block: str) -> dict[int, tuple[str, str]]:
    questions, _, answers = block.partition("\n**Ответы для проверки:**\n")
    # the closing words of a final page («**Что дальше.**») may hold a list of their own
    answers = answers.split("\n\n**", 1)[0]

    def numbered(text: str) -> dict[int, str]:
        found = re.split(r"(?m)^(\d+)\. ", text)
        return {int(found[k]): found[k + 1].strip() for k in range(1, len(found) - 1, 2)}

    q, a = numbered(questions), numbered(answers)
    return {n: (q[n], a.get(n, "")) for n in q}


def inventory(topic: Path) -> dict[int, dict[int, tuple[str, str]]]:
    """Questions and written answers by page (from 1) and number."""
    result = {}
    for page, name in enumerate(pages(topic)[1], start=1):
        steps = [s.strip() for s in re.split(r"\n---\n", (topic / name).read_text())]
        block = next(s for s in steps if s.startswith(TASK_BLOCK))
        result[page] = task_inventory(block)
    return result


def plain(text: str) -> str:
    """Stand markup → bank Markdown: a data file link becomes its name, a
    course term keeps only its label."""
    text = re.sub(r"\[([^\]]+)\]\(topic-\d+/files/[^)]+\)", r"\1", text)
    return re.sub(r"\{\{[\w-]+\|(.+?)\}\}", r"\1", text)


def site_text(text: str) -> str:
    """The written answer: its first paragraph (the final page's closing words
    after the last answer are not part of it)."""
    return plain(text.split("\n\n", 1)[0])


def figure_png(topic: Path, svg: str) -> Path:
    """Where the PNG of a statement figure lives: named by its SVG."""
    digest = hashlib.sha256(svg.encode()).hexdigest()[:16]
    return topic / "files" / f"fig-{digest}.png"


def render_png(jobs: list[tuple[str, Path]]) -> None:
    """Draw the missing PNGs with ``svg_png.mjs`` (headless Chromium)."""
    if not jobs:
        return
    payload = json.dumps([{"svg": svg, "out": str(out)} for svg, out in jobs])
    done = subprocess.run(
        ["node", str(REPO / "scripts/lesson_design/svg_png.mjs")],
        input=payload,
        capture_output=True,
        text=True,
        timeout=300,
    )
    if done.returncode:
        raise SystemExit(done.stderr)


def table_block(lines: list[str]) -> dict:
    def cells(line: str) -> list[str]:
        cells = line.strip().strip("|").split("|")
        return [plain(c.strip().replace("**", "").replace("\\*", "*")) for c in cells]

    return {
        "type": "table",
        "data": {
            "headers": cells(lines[0]),
            "rows": [cells(x) for x in lines[2:]],
            "caption": None,
        },
    }


def statement(question: str, topic: Path | None = None) -> tuple[list[dict], list[tuple]]:
    """The whole question as bank blocks: paragraphs are text, a Markdown table
    a ``table``, a code fence a ``code_example``, a stand figure an ``image``
    (PNG of the same builder, returned as ``(svg, png, alt, width, height)``);
    a workbook view (``%%…_book(…)%%``) is left out — the book is attached."""
    blocks: list[dict] = []
    images: list[tuple] = []
    parts = re.split(r"(<figure\b.*?</figure>|```[^\n]*\n.*?```)", question.strip(), flags=re.S)
    for k, part in enumerate(parts):
        if k % 2:
            body = textwrap.dedent(part)
            if body.startswith("```"):
                head, _, code = body.partition("\n")
                code = textwrap.dedent(code.rsplit("```", 1)[0]).rstrip()
                language = "python" if head.strip("`").startswith("python") else "text"
                blocks.append(
                    {
                        "type": "code_example",
                        "data": {"language": language, "code": code, "caption": None},
                    }
                )
                continue
            call = re.search(r"%%(\w+)\((.*?)\)%%", body)
            if not call or topic is None:
                raise SystemExit(f"a figure without a builder call: {body[:80]!r}")
            from figures import FIGURES  # noqa: PLC0415
            from site_media import inline_svg, parse_call  # noqa: PLC0415

            args, kwargs = parse_call(call.group(2))
            svg = FIGURES[call.group(1)](*args, **kwargs)
            _, width, height, alt = inline_svg(svg)
            caption = re.search(r"<figcaption>(.*?)</figcaption>", body, re.S)
            alt = alt or (
                " ".join(re.sub(r"<[^>]+>", "", caption.group(1)).split()) if caption else ""
            )
            if not alt:
                raise SystemExit(f"figure {call.group(1)}: needs aria-label or a figcaption")
            images.append((svg, figure_png(topic, svg), alt, width, height))
            data: dict[str, object] = {"usage_id": f"figure-{len(images)}", "alt": alt}
            data.update(width=width, height=height, caption=None)
            blocks.append({"type": "image", "data": data})
            continue
        for chunk in re.split(r"\n\s*\n", part):
            lines = [x.strip() for x in chunk.strip().split("\n") if x.strip()]
            if not lines:
                continue
            if re.fullmatch(r"%%\w+_book\(.*\)%%", " ".join(lines)):
                continue
            if "%%" in chunk:
                raise SystemExit(f"a stand figure outside <figure>: {chunk.strip()[:80]!r}")
            if lines[0].startswith("|") and len(lines) > 2 and set(lines[1]) <= set("|-: "):
                blocks.append(table_block(lines))
            else:
                blocks.append(
                    {"type": "text", "data": {"markdown": " ".join(plain(chunk).split())}}
                )
    return blocks, images


def run(code: str, files: list[Path]) -> str:
    """Run a solution next to its data files, as the learner would."""
    with tempfile.TemporaryDirectory() as tmp:
        for path in files:
            shutil.copy(path, Path(tmp) / path.name)
        done = subprocess.run(
            [sys.executable, "-I", "-c", code],
            capture_output=True,
            text=True,
            timeout=300,
            cwd=tmp,
        )
    if done.returncode:
        raise SystemExit(done.stderr)
    return done.stdout


def agrees(answer: str, written: str) -> bool:
    """Every token of the answer appears in the written answer, in order."""
    rest = written.replace("`", "")
    for token in answer.split():
        found = re.search(rf"(?<![\d.]){re.escape(token)}(?![\d])", rest)
        if not found:
            return False
        rest = rest[found.end() :]
    return True


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def build(topic: Path, exam: int, tasks: list[dict]) -> tuple[list[dict], dict[str, Path]]:
    meta, _ = pages(topic)
    material = meta["site"]["id"]
    advanced = {
        page
        for page, sub in enumerate(meta["subtopics"], start=1)
        if sub["level"] == "дополнительный"
    }
    final = len(meta["subtopics"]) + 1
    texts = inventory(topic)
    sections = {m["id"]: m for m in json.loads(REGISTRY.read_text())["materials"]}[material][
        "sections"
    ]
    built, files = [], {}
    missing = {
        png: svg
        for spec in tasks
        for svg, png, *_ in statement(texts[spec["at"][0]][spec["at"][1]][0], topic)[1]
        if not png.exists()
    }
    render_png([(svg, png) for png, svg in missing.items()])
    for position, spec in enumerate(tasks):
        page, number = spec["at"]
        question, written = texts[page][number]
        blocks, images = statement(question, topic)
        written = site_text(written)
        code = spec.get("code")
        attached = [(topic / "files" / name, note) for name, note in spec.get("files", [])]
        if code is None:
            answer = " ".join(str(spec["answer"]).split())
        else:
            answer = " ".join(run(code, [path for path, _ in attached]).split())
        says = spec.get("says")
        if not (all(p in written for p in says) if says else agrees(answer, written)):
            raise SystemExit(f"{spec['at']}: program prints {answer!r}, file says {written!r}")
        shown = code if code is not None else spec.get("excel", "")
        long = [line for line in shown.split("\n") if len(line) > MAX_CODE_LINE]
        if long:
            raise SystemExit(f"{spec['at']}: code lines over {MAX_CODE_LINE}: {long}")
        links = []
        if page == final:
            assert "section" not in spec, spec["at"]
        else:
            if spec["section"] not in sections:
                raise SystemExit(f"{spec['at']}: unknown section {spec['section']}")
            links.append({"label": "Теория", "section": spec["section"], "material_id": material})
        attachments = []
        for k, (path, note) in enumerate(attached, start=1):
            checksum = sha256(path)
            files[checksum] = path
            attachments.append(
                {
                    "id": f"statement-{k}",
                    "purpose": "attachment",
                    "checksum": checksum,
                    "filename": path.name,
                    "attribution": None,
                    "description": note,
                }
            )
        for k, (_, png, alt, _, _) in enumerate(images, start=1):
            checksum = sha256(png)
            files[checksum] = png
            attachments.append(
                {
                    "id": f"figure-{k}",
                    "purpose": "image",
                    "checksum": checksum,
                    "filename": png.name,
                    "attribution": None,
                    "description": alt,
                }
            )
        membership = {"position": position, "material_id": material}
        if page in advanced:
            membership["counts_toward_mastery"] = False
        built.append(
            {
                "task": {
                    "id": f"task-{exam}-{page}-{number:02d}",
                    "title": spec["title"],
                    "short_description": None,
                    "explanation_kind": "worked_solution",
                    "difficulty": spec["difficulty"],
                    "estimated_minutes": spec["minutes"],
                    "answer_instruction": spec["instruction"],
                    "interaction_type": "production",
                    "content_schema_version": 1,
                    "statement": blocks
                    + [
                        {"type": "attachment", "data": {"usage_id": a["id"]}}
                        for a in attachments
                        if a["purpose"] == "attachment"
                    ],
                    "hint": [{"type": "text", "data": {"markdown": spec["hint"]}}],
                    "explanation": [{"type": "text", "data": {"markdown": written}}]
                    + solution(code, spec.get("excel")),
                    "skills": [],
                    "exam_numbers": spec.get("exams", [exam]),
                    "files": attachments,
                    "lessons": [membership],
                    "theory_links": links,
                    "catalog_visible": False,
                    "archived": False,
                    "sources": [dict(SOURCE)],
                    "checker": {
                        "checker_type": "exact_match",
                        "answer_variants": [answer, *spec.get("alt", [])],
                        "numeric_tolerance": None,
                    },
                },
                "solution_revision": 1,
            }
        )
    return built, files


def solution(code: str | None, excel: str | None) -> list[dict]:
    """The solution under the written answer: the program, or the spreadsheet formulas."""
    if code is not None:
        data = {"language": "python", "code": code, "caption": "Решение программой"}
    elif excel:
        data = {"language": "text", "code": excel, "caption": "Формулы в Excel"}
    else:
        return []
    return [{"type": "code_example", "data": data}]


def checkpoints(topic: Path, tasks: list[dict]) -> dict[str, list[dict]]:
    """Self-checks of the subtopics: every task that is not a bank task,
    question and answer verbatim, keyed by subtopic slug («praktika» last)."""
    _, names = pages(topic)
    used = {spec["at"] for spec in tasks}
    result: dict[str, list[dict]] = {}
    for page, items in inventory(topic).items():
        slug = "praktika" if page == len(names) else re.sub(r"^\d+-", "", names[page - 1][:-3])
        for number, (question, answer) in items.items():
            if (page, number) not in used:
                # the workbook view of a task stays on the stand (the bank task attaches the book)
                prompt = re.sub(r"\n\s*%%\w+_book\(.*?\)%%", "", question)
                result.setdefault(slug, []).append(
                    {"id": f"zadacha-{number}", "prompt": prompt, "reveal": answer}
                )
    return result


def main(
    topic: Path,
    exam: int,
    tasks: list[dict],
    remove: frozenset[str] = frozenset(),
    relink: dict[str, str] | None = None,
) -> int:
    """``remove``: task ids of a retired lesson, archived; ``relink``: its section → the
    new section, for the theory links of other bank tasks (catalog tasks)."""
    built, files = build(topic, exam, tasks)
    for entry in built:
        task = entry["task"]
        print(task["id"], "|", task["checker"]["answer_variants"][0][:70])
    if "--checkpoints" in sys.argv:
        path = topic / "topic.json"
        meta = json.loads(path.read_text())
        meta["site"]["checkpoints"] = checkpoints(topic, tasks)
        path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n")
        print(f"wrote site.checkpoints of {path}; run Prettier on it")
    if "--write" not in sys.argv:
        print(f"{len(built)} tasks agree with the subtopic files (dry run)")
        return 0
    bank = json.loads(BANK.read_text())
    prefix = f"task-{exam}-"
    missing = set(remove) - {e["task"]["id"] for e in bank["tasks"]}
    if missing:
        raise SystemExit(f"retired tasks not in the bank: {sorted(missing)}")
    for entry in bank["tasks"]:
        if entry["task"]["id"] in remove:
            # kept for the saved progress, hidden and out of every lesson; the
            # import then drops their lesson positions
            entry["task"].update(archived=True, catalog_visible=False, lessons=[], theory_links=[])

    # a retired task may share the prefix (task-17-01 of the earlier lesson);
    # the topic's tasks keep their place in the bank (a new topic goes last)
    def ours(e: dict) -> bool:
        return e["task"]["id"].startswith(prefix) and e["task"]["id"] not in remove

    place = next((k for k, e in enumerate(bank["tasks"]) if ours(e)), len(bank["tasks"]))
    kept = [e for e in bank["tasks"] if not ours(e)]
    at = sum(1 for e in bank["tasks"][:place] if not ours(e))
    bank["tasks"] = kept[:at] + built + kept[at:]
    material = json.loads((topic / "topic.json").read_text())["site"]["id"]
    for entry in bank["tasks"]:
        for link in entry["task"]["theory_links"]:
            if link["material_id"] == material and link["section"] in (relink or {}):
                link["section"] = (relink or {})[link["section"]]
    known = {f["checksum"] for f in bank["files"]}
    for checksum, path in files.items():
        shutil.copy(path, BANK_FILES / checksum)
        if checksum not in known:
            kind, mime = MIME[path.suffix]
            bank["files"].append(
                {
                    "format": kind,
                    "checksum": checksum,
                    "mime_type": mime,
                    "size_bytes": path.stat().st_size,
                    "storage_key": checksum,
                }
            )
    # the bank carries the registry's publication metadata verbatim
    bank["materials"] = json.loads(REGISTRY.read_text())["materials"]
    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote {len(built)} tasks and {len(files)} files; run Prettier on {BANK}")
    return 0
