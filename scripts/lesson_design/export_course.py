"""Export an approved course stand to the site (Changes 175, 177; stage 9).

Usage (from the repository root):

    python3 -I scripts/lesson_design/export_course.py content/lesson-design/course-python
    python3 -I scripts/lesson_design/export_course.py content/lesson-design/course-excel --check

Writes into ``apps/web/src/entities/course/content/``:

- ``course-publication.mjs`` and ``.d.mts`` — every course of the stand
  (``content/lesson-design/course-*/course.json``, Python first), its modules
  and lessons (``site``: summary, audience, outcomes; per module ``summary``;
  per lesson ``site.id``, ``routeSlug``, ``outcome``), whichever course is exported;
- ``<course>-course-lessons.ts`` — the ordered lesson definitions of the course;
- ``<id>.lesson.tsx`` per lesson and ``<id>.media.ts`` when the lesson has
  diagrams, step-through figures or runnable code blocks.

Mapping: the text before the first ``---`` → the lesson's opening block
(``lead``: no heading, not in «На этой странице»); each
step → one ``ConceptBlock`` (``navLabel`` from ``site.navLabels`` of the
lesson); «Итого» and the steps after the task block
→ ``result``; tasks listed in ``tasks.json`` → bank tasks (``bank.py``), the
other tasks → the lesson's ``checkpoint``. Code: ```` ```python [run] [name.py]
```` with its ```` ```output / console / input / error ```` blocks → one
``CodeBlock`` (output lines as in a terminal; line numbers, as on the stand,
only in a runnable block, whose notes name the lines) or ``CodeRunner`` with the steps
recorded by ``tracer.py``; a data fence (```` ```numbers.txt ````) → a
``CodeBlock`` named by the file; ``range_try`` → ``RangeSandbox``. The Excel
course: a ```` ```sheet ```` block → ``SheetBlock`` with its data in the media
manifest (``sheetblock.site_data``; the site recomputes the values), ```` ```excel
[шаблон] ```` → ``FormulaBlock`` (``B2: =…`` names the cell), ``fill_try`` →
``FillSandbox``. Everything else as in ``export_lesson.py``. Generated files are never edited by hand:
change the stand and re-export. ``--check`` fails on stale output.
"""

import argparse
import json
import re
import sys
import textwrap
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
sys.path.insert(0, str(HERE))
from excel_figures import fill_try  # noqa: E402
from export_lesson import Converter, js, plain, split_steps, task_inventory  # noqa: E402
from export_media import figure_entries, manifest_text, parse_call, prettier  # noqa: E402
from runblock import IO, file_name, record  # noqa: E402
from sheetblock import BLOCK as SHEET_BLOCK  # noqa: E402
from sheetblock import parse_block, site_data  # noqa: E402
from terms import EXCEL_TERMS  # noqa: E402

OUT = REPO / "apps/web/src/entities/course/content"
TASK_BLOCK = "**Чтобы проверить понимание"
SUMMARY = "**Итого.**"
CODE_GROUP = re.compile(
    r"^```(?P<lang>[\w.-]+)(?P<run> run)?(?: (?P<name>[\w-]+\.\w+))?\n(?P<code>.*?)^```\n"
    r"(?P<io>(?:\n*^```(?:output|console|error|input)\n.*?^```\n)*)"
    r"(?:\n*^```steps\n(?P<notes>.*?)^```\n)?",
    re.M | re.S,
)
IO_BLOCK = re.compile(r"```(output|console|error|input)\n(.*?)```", re.S)
LEVELS = {"основной": "core", "дополнительный": "advanced"}
HEAD = {"shell": "команда", "text": "текст"}
STAND = REPO / "content/lesson-design"


def camel(text: str) -> str:
    head, *rest = re.split(r"[-_]", text)
    return head + "".join(part[:1].upper() + part[1:] for part in rest)


class CourseConverter(Converter):
    """Converter with the course's code groups and sandboxes."""

    def __init__(self, media_known: set[str]):
        super().__init__(media_known, {}, [])
        self.codes: list[str] = []
        self.runs: list[str] = []  # media entries of runnable blocks and sheets
        self.sheet_labels: dict[str, str] = {}

    def figure_call(self, name: str, args_src: str, caption, context: str) -> str:
        if name == "code":
            return self.codes[int(args_src)].replace("__LABEL__", js(code_label(context)))
        if name == "sheet":
            key = f"sheet{args_src}"
            self.imports.add("SheetBlock")
            return f"<SheetBlock {{...lessonMedia.{key}}} label={{{js(self.sheet_labels[key])}}} />"
        if name == "fill_try":
            args, _ = parse_call(name, args_src)
            defaults = fill_try.__defaults__ or ()
            formula, origin, target = (*args, *defaults[len(args) :])[:3]
            self.imports.add("FillSandbox")
            return (
                f"<FillSandbox defaultFormula={{{js(formula)}}} origin={js(origin)} "
                f"defaultTarget={js(target)} />"
            )
        if name == "range_try":
            args, kwargs = parse_call(name, args_src)
            mode, start, stop, step, text = (*args, None, None, None, None, None)[:5]
            mode = kwargs.get("mode", mode or "range")
            start = kwargs.get("start", 2 if start is None else start)
            stop = kwargs.get("stop", 9 if stop is None else stop)
            step = kwargs.get("step", 3 if step is None else step)
            text = kwargs.get("text", text or "ABCDEFG")
            self.imports.add("RangeSandbox")
            extra = f" text={js(text)}" if mode == "slice" else ""
            return (
                f"<RangeSandbox mode={js(mode)} start={{{json.dumps(start)}}} "
                f"stop={{{json.dumps(stop)}}} step={{{step}}}{extra} />"
            )
        return super().figure_call(name, args_src, caption, context)

    def code_group(self, m: re.Match) -> str:
        """One code fence with its output blocks → a placeholder line."""
        lang, code, name = m.group("lang"), m.group("code").rstrip("\n"), m.group("name")
        io_text = m.group("io") or ""
        if lang == "python":
            parts, error = [], None
            for kind, body in IO_BLOCK.findall(io_text):
                body = body.rstrip("\n")
                if kind == "error":
                    error = body
                elif kind == "input":
                    parts.append("\n".join(f"⟪{line}⟫" for line in body.split("\n")))
                else:
                    parts.append(body)
            output = "\n".join(parts)
            shown = name or file_name(code)
            if m.group("run"):
                key = "run" + camel(Path(shown).stem)[:1].upper() + camel(Path(shown).stem)[1:]
                steps = record(code + "\n", dict(IO.findall(io_text)), m.group("notes") or "")
                entry = {"kind": "run", "code": code, "fileName": shown, "output": output}
                if error is not None:
                    entry["error"] = error
                entry["steps"] = steps
                self.runs.append(f"  {key}: " + json.dumps(entry, ensure_ascii=False) + ",")
                self.media_known.add(key)
                self.imports.add("CodeRunner")
                jsx = f"<CodeRunner {{...lessonMedia.{key}}} label={{__LABEL__}} />"
            else:
                extra = ""
                if output or error is not None:
                    extra += ' outputLayout="lines"'
                if output:
                    extra += f" output={{{js(output)}}}"
                if error is not None:
                    extra += f" error={{{js(error)}}}"
                self.imports.add("CodeBlock")
                jsx = (
                    f'<CodeBlock code={{{js(code)}}} label={{__LABEL__}} language="python" '
                    f"fileName={js(shown)} showLineNumbers={{false}}{extra} />"
                )
        elif lang.startswith("excel"):
            # a formula of the Excel course: the sheet's formula bar (F9), not code
            lines = []
            for raw in code.split("\n"):
                at = re.match(r"^([A-Z]{1,3}\d+):\s*(?==)", raw)
                cell = {"cell": at.group(1)} if at else {}
                lines.append({**cell, "formula": raw[at.end() :] if at else raw})
            self.imports.add("FormulaBlock")
            label = "Шаблон формулы" if lang == "excel-template" else "Формула"
            jsx = (
                f"<FormulaBlock lines={{{json.dumps(lines, ensure_ascii=False)}}} "
                f"label={js(label)} />"
            )
        else:
            self.imports.add("CodeBlock")
            head = lang if "." in lang else HEAD.get(lang, str(lang))
            label = f"Строки файла {lang}" if "." in lang else f"Пример: {head}"
            jsx = (
                f'<CodeBlock code={{{js(code)}}} label={{{js(label)}}} language="text" '
                f"fileName={js(head)} showLineNumbers={{false}} />"
            )
        self.codes.append(jsx)
        return f"%%code({len(self.codes) - 1})%%\n"

    def prepare(self, md: str) -> str:
        md = md.replace("```excel шаблон\n", "```excel-template\n")
        md = SHEET_BLOCK.sub(self.sheet, md)
        return CODE_GROUP.sub(self.code_group, md)

    def sheet(self, m: re.Match) -> str:
        """A live sheet → its data in the media manifest and a placeholder line."""
        block = parse_block(m.group(1), m.group(2))
        key = f"sheet{len(self.sheet_labels) + 1}"
        self.sheet_labels[key] = f"Лист «{block.name}»"
        self.runs.append(f"  {key}: " + json.dumps(site_data(block), ensure_ascii=False) + ",")
        self.media_known.add(key)
        return f"%%sheet({key[5:]})%%\n"


def code_label(context: str) -> str:
    """The accessible name of a code block: the paragraph that introduces it."""
    text = plain(context).rstrip(":.").strip()
    if 4 <= len(text) <= 90:
        return text
    last = re.split(r"(?<=[.!?])\s+", text)[-1].rstrip(":.").strip()
    return last if 4 <= len(last) <= 90 else "Программа на Python"


def task_text(text: str) -> str:
    """A task or answer from a numbered list: continuation lines dedented."""
    first, _, rest = text.partition("\n")
    return first + ("\n" + textwrap.dedent(rest) if rest else "")


def lesson_source(course_dir: Path, lesson: dict, bank: dict[str, str]) -> tuple[str, str]:
    """The lesson module and its media manifest (empty when nothing to show)."""
    site = lesson["site"]
    md = (course_dir / lesson["source"]).read_text(encoding="utf-8")
    entries = figure_entries([md])
    known = {m.group(1) for e in entries if (m := re.match(r"  (\w+):", e))}
    converter = CourseConverter(known)
    steps = split_steps(converter.prepare(md))
    labels = site.get("navLabels", {})
    theory, result_parts, checkpoint = [], [], []
    after_tasks = False
    for index, step in enumerate(steps):
        if index == 0:
            theory.append(("intro", "Вступление", step))
            continue
        if step.startswith(TASK_BLOCK):
            details = re.findall(r"<details.*?</details>", step, re.S)
            for task in task_inventory(re.sub(r"<details.*?</details>", "", step, flags=re.S)):
                if str(task["number"]) in bank:
                    continue
                checkpoint.append(
                    (f"t{task['number']}", task_text(task["question"]), task_text(task["answer"]))
                )
            result_parts.extend(details)
            after_tasks = True
            continue
        if step.startswith(SUMMARY):
            result_parts.insert(0, step[len(SUMMARY) :].strip())
            continue
        if after_tasks:
            result_parts.append(step)
            continue
        anchor = f"s{len(theory)}"
        if anchor not in labels:
            raise SystemExit(f"{site['id']}: no site.navLabels[{anchor!r}] in course.json")
        label = labels[anchor]
        theory.append((anchor, label, step))

    blocks = [
        f"    {{\n      id: {js(a)},\n      navLabel: {js(label)},\n"
        + ("      lead: true,\n" if a == "intro" else "")
        + f"      explanation: (\n{converter.fragment(body)}\n      ),\n    }},"
        for a, label, body in theory
    ]
    result = converter.fragment("\n\n".join(result_parts))
    check = "".join(
        f"    {{ id: {js(i)}, prompt: {converter.fragment(q)}, reveal: {converter.fragment(a)} }},\n"
        for i, q, a in checkpoint
    )
    level = LEVELS[lesson["level"]]
    outcomes = [o.strip() for o in site["outcome"].split(", ") if o.strip()]
    publication = camel(site["id"])
    media = bool(converter.runs or entries)
    shared = sorted(converter.imports - {"CodeBlock"})
    header = [
        "// Generated by scripts/lesson_design/export_course.py from the approved stand.",
        "// Change the stand or course.json and re-export, not this file.",
        'import { CodeBlock } from "~/shared/components/code-block";',
        'import { ExternalLink } from "~/shared/components/external-link";',
        'import { KeyCombo } from "~/shared/components/key-combo";',
        'import { Notation } from "~/shared/components/notation";',
        'import { Typography } from "~/shared/components/typography";',
    ]
    if shared:
        header.append(
            "import {\n  "
            + ",\n  ".join(shared)
            + ',\n} from "~/shared/components/learning-content";'
        )
    header += [
        'import { defineCourseLesson } from "../lib/define-course-lesson";',
        f'import {{ {publication}LessonPublication }} from "./course-publication.mjs";',
    ]
    if media:
        header.append(f'import {{ lessonMedia }} from "./{site["id"]}.media";')
    body = [
        "",
        f"export const {publication}Lesson = defineCourseLesson({{",
        f"  ...{publication}LessonPublication,",
        "  masteryThreshold: 0.8,",
        *([f'  level: "{level}",'] if level != "core" else []),
        f"  learningOutcomes: [{', '.join(js(o[:1].upper() + o[1:]) for o in outcomes)}],",
        '  accessTier: "free",',
        "  theory: [",
        *blocks,
        "  ],",
        *([f"  checkpoint: [\n{check}  ],"] if checkpoint else []),
        f"  result: (\n{result}\n  ),",
        '  status: "published",',
        "});",
        "",
    ]
    text = "\n".join(header + body)
    for name, module in (
        ("CodeBlock", "code-block"),
        ("ExternalLink", "external-link"),
        ("KeyCombo", "key-combo"),
        ("Notation", "notation"),
        ("Typography", "typography"),
    ):
        if f"<{name}" not in text.split("\nexport const", 1)[1]:
            text = text.replace(f'import {{ {name} }} from "~/shared/components/{module}";\n', "")
    manifest = ""
    if media:
        manifest = manifest_text(course_dir / lesson["source"], entries + converter.runs)
    return text, manifest


def stand_courses() -> list[dict]:
    """Every course of the stand, Python first (the order of the publication)."""
    courses = [
        json.loads(p.read_text(encoding="utf-8")) for p in STAND.glob("course-*/course.json")
    ]
    return sorted(courses, key=lambda c: (c["id"] != "python", c["id"]))


def publication_source(courses: list[dict]) -> tuple[str, str]:
    out = [
        "// Generated by scripts/lesson_design/export_course.py from",
        "// content/lesson-design/course-*/course.json: change it there and re-export.",
        "",
    ]
    names: list[str] = []
    course_names: list[str] = []
    for course in courses:
        course_names.append(course_publication(course, out, names))
    out.append(f"export const coursePublications = Object.freeze([{', '.join(course_names)}]);")
    out.append(
        "export const courseLessonPublications = Object.freeze([\n"
        + "".join(f"  {n},\n" for n in names)
        + "]);\n"
    )
    out.append(FINDERS)
    declarations = (
        "// Generated by scripts/lesson_design/export_course.py.\n"
        'import type { LessonContent } from "~/entities/lesson";\n'
        'import type { CourseTypes } from "../course.types";\n\n'
        'export type CoursePublication = Omit<CourseTypes.Definition, "modules"> & {\n'
        "  modules: readonly CourseTypes.Module[];\n};\n\n"
        "export type CourseLessonPublication = {\n  id: string;\n  routeSlug: string;\n"
        "  title: string;\n  summary: string;\n  status: LessonContent.Status;\n"
        '  masteryThreshold?: number;\n  level?: "core" | "advanced";\n};\n\n'
        + "".join(f"export const {n}: Readonly<CourseLessonPublication>;\n" for n in names)
        + "".join(f"export const {n}: Readonly<CoursePublication>;\n" for n in course_names)
        + "export const coursePublications: readonly CoursePublication[];\n"
        "export const courseLessonPublications: readonly CourseLessonPublication[];\n"
        "export function findCoursePublicationByRouteSlug(\n  routeSlug: string,\n"
        "): CoursePublication | undefined;\n"
        "export function findCourseLessonPublicationByRouteSlugs(\n"
        "  courseRouteSlug: string,\n  lessonRouteSlug: string,\n"
        "): CourseLessonPublication | undefined;\n"
    )
    return "\n".join(out), declarations


def course_publication(course: dict, out: list[str], names: list[str]) -> str:
    """Append the lessons and the course of one ``course.json``; return its name."""
    site = course["site"]
    lessons = [(m, lesson) for m in course["modules"] for lesson in m["lessons"]]
    for _, lesson in lessons:
        s = lesson["site"]
        name = f"{camel(s['id'])}LessonPublication"
        names.append(name)
        level = LEVELS[lesson["level"]]
        out.append(
            f"export const {name} = Object.freeze({{\n  id: {js(s['id'])},\n"
            f"  routeSlug: {js(s['routeSlug'])},\n  title: {js(lesson['title'])},\n"
            f'  summary: {js(lesson["lead"])},\n  status: "published",\n'
            + (f'  level: "{level}",\n' if level != "core" else "")
            + "});\n"
        )
    modules = []
    for m in course["modules"]:
        plan = ",\n".join(
            "        Object.freeze({\n"
            f"          id: {js(lesson['site']['id'])},\n"
            f"          title: {js(lesson['title'])},\n"
            f"          outcome: {js(lesson['site']['outcome'] + '.')},\n"
            + ('          level: "advanced",\n' if LEVELS[lesson["level"]] == "advanced" else "")
            + "        })"
            for lesson in m["lessons"]
        )
        modules.append(
            "    Object.freeze({\n"
            f"      id: {js(m['id'])},\n      title: {js(m['title'])},\n"
            f"      summary: {js(m['summary'])},\n"
            f"      lessonPlan: Object.freeze([\n{plan},\n      ]),\n    }})"
        )
    outcomes = ",\n".join(f"    {js(o)}" for o in site["learningOutcomes"])
    name = f"{camel(course['id'])}CoursePublication"
    out.append(
        f"export const {name} = Object.freeze({{\n"
        f"  id: {js(course['id'])},\n  routeSlug: {js(course['id'])},\n"
        f"  title: {js(course['title'])},\n"
        f"  shortTitle: {js(site['shortTitle'])},\n"
        f"  summary: {js(site['summary'])},\n  audience: {js(site['audience'])},\n"
        f"  requirements: {js(site['requirements'])},\n"
        f"  learningOutcomes: Object.freeze([\n{outcomes},\n  ]),\n"
        '  status: "published",\n  stage: "complete",\n'
        f"  modules: Object.freeze([\n{','.join(chr(10) + mod for mod in modules).lstrip(chr(10))},\n  ]),\n"
        "});\n"
    )
    return name


FINDERS = """export const findCoursePublicationByRouteSlug = (routeSlug) =>
  coursePublications.find((course) => course.routeSlug === routeSlug);

export const findCourseLessonPublicationByRouteSlugs = (
  courseRouteSlug,
  lessonRouteSlug,
) => {
  const course = findCoursePublicationByRouteSlug(courseRouteSlug);
  if (!course) return undefined;
  const memberIds = new Set(
    course.modules.flatMap((courseModule) =>
      courseModule.lessonPlan.map((lesson) => lesson.id),
    ),
  );
  return courseLessonPublications.find(
    (lesson) =>
      memberIds.has(lesson.id) && lesson.routeSlug === lessonRouteSlug,
  );
};
"""


def lessons_index(course: dict) -> str:
    ids = [lesson["site"]["id"] for m in course["modules"] for lesson in m["lessons"]]
    imports = "".join(f'import {{ {camel(i)}Lesson }} from "./{i}.lesson";\n' for i in ids)
    return (
        "// Generated by scripts/lesson_design/export_course.py: the course lessons in order.\n"
        'import type { CourseTypes } from "../course.types";\n'
        + imports
        + f"\nexport const {camel(course['id'])}CourseLessons: readonly CourseTypes.LessonDefinition[] = [\n"
        + "".join(f"  {camel(i)}Lesson,\n" for i in ids)
        + "];\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=(__doc__ or "").split("\n")[0])
    parser.add_argument("course", type=Path)
    parser.add_argument("--check", action="store_true", help="fail on stale output")
    options = parser.parse_args()
    course_dir = options.course
    course = json.loads((course_dir / "course.json").read_text(encoding="utf-8"))
    if course["id"] == "excel":
        slugs = {lesson["site"]["routeSlug"] for m in course["modules"] for lesson in m["lessons"]}
        unknown = {k: slug for k, (_, slug) in EXCEL_TERMS.items() if slug not in slugs}
        if unknown:
            raise SystemExit(f"terms.EXCEL_TERMS name lessons the course lacks: {unknown}")
    tasks = json.loads((course_dir / "tasks.json").read_text(encoding="utf-8"))
    files: dict[Path, str] = {}
    publication, declarations = publication_source(stand_courses())
    files[OUT / "course-publication.mjs"] = publication
    files[OUT / "course-publication.d.mts"] = declarations
    files[OUT / f"{course['id']}-course-lessons.ts"] = lessons_index(course)
    for m in course["modules"]:
        for lesson in m["lessons"]:
            lesson_id = lesson["site"]["id"]
            text, manifest = lesson_source(course_dir, lesson, tasks.get(lesson["source"][:2], {}))
            files[OUT / f"{lesson_id}.lesson.tsx"] = text
            if manifest:
                files[OUT / f"{lesson_id}.media.ts"] = manifest
    stale = []
    for path, text in files.items():
        formatted = prettier(text, path)
        if options.check:
            if not path.exists() or path.read_text(encoding="utf-8") != formatted:
                stale.append(path.relative_to(REPO))
        else:
            path.write_text(formatted, encoding="utf-8")
    if options.check:
        for path in stale:
            print(f"stale: {path}")
        print(f"{len(files)} files, stale: {len(stale)}")
        return 1 if stale else 0
    print(f"wrote {len(files)} files into {OUT.relative_to(REPO)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
