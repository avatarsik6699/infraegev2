"""Draft a site lesson (``*.lesson.tsx``) from an approved topic folder (stage 9).

Usage (from the repository root):

    python3 -I scripts/lesson_design/export_lesson.py docs/artifacts/lesson-design/topic-25 \\
        --out /tmp/draft.lesson.tsx --tasks /tmp/tasks.json

The draft is a starting point, never a publication: read it in full, then move
it to ``apps/web/src/entities/lesson/content/<id>.lesson.tsx`` and review it by
hand. Run ``export_media.py`` first; the draft imports its manifest.

``topic.json`` → ``site`` names the identity and the step anchors:

- ``id``, ``route``: lesson id and public route;
- ``steps``: per subtopic file, ``[anchor, navLabel]`` for each step in order
  (one step = one block between ``---``); missing entries get placeholders;
- ``final``: which blocks of the final page form ``result`` and ``examFocus``.

Mapping: a step → one ``ConceptBlock`` with its claim sentence first; a
Markdown table → ``LessonTable`` (``---:`` columns are numeric); code fences →
``CodeBlock``; ``<details>`` → ``ProofDisclosure``; a ``<figure>`` with a
``%%builder()%%`` call → ``LessonDiagram``; a bare stepper call →
``LessonStepper``; ``%%mask_try(mask, number)%%`` → ``MaskSandbox``;
``%%remainder_widget(n, d)%%`` → ``RemainderExplorer``; ``%%cheatsheet(file)%%`` →
``TopicCheatSheet``; ``%%path_builder(edges, …)%%`` → ``PathBuilder`` with the
graph data of the manifest. A link to a topic data file (``topic-NN/files/…``)
becomes the file name: on the site the file is attached to the bank task. A python fence followed by an ``output`` fence becomes one
``CodeBlock`` with ``output``; ``{{key|label}}`` → ``PythonTerm`` (registry
``python-terms.tsx`` is regenerated from ``terms.py``); ``:::pick`` /
``:::pick-tokens`` → ``VariantPicker`` (with ``TokenSet`` values). The task block of each
subtopic («Чтобы проверить понимание…», «Задачи основных подтем…») is not
theory: it is written to ``--tasks`` with its answers, to become bank tasks
(checkable) or the subtopic self-check (``объясни, почему``).
"""

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from export_media import media_key, parse_call, prettier  # noqa: E402
from figures import REMAINDER_CAPTION, STAND, STEPPERS, WIDGETS, mask_try  # noqa: E402
from terms import TERMS  # noqa: E402

TASK_BLOCK = ("**Чтобы проверить понимание", "**Задачи основных подтем")
FIGURE_CALL = re.compile(r"^%%(\w+)\((.*?)\)%%$")
INLINE = re.compile(
    r"\{\{(?P<term_key>\w+)\|(?P<term_label>.+?)\}\}"
    r"|<sup>(?P<sup>.+?)</sup>"
    r"|\*\*(?P<bold>.+?)\*\*"
    r"|`(?P<code>[^`]+)`"
    r"|<code>(?P<html_code>.+?)</code>"
    r"|\[(?P<link_text>[^\]]+)\]\((?P<link_url>https?://[^)\s]+)\)"
    r"|\[(?P<file_text>[^\]]+)\]\((?P<file_url>topic-\d+/files/[^)\s]+)\)"
)
LEVELS = {"основной": "core", "дополнительный": "advanced"}


def js(text: str) -> str:
    return json.dumps(text, ensure_ascii=False)


def jsx_text(text: str) -> str:
    """Plain text as JSX children: braces and angle brackets become strings."""
    return re.sub(r"[{}<>]+", lambda m: "{" + js(m.group(0)) + "}", text)


def inline(text: str) -> str:
    out, last = [], 0
    for m in INLINE.finditer(text):
        out.append(jsx_text(text[last : m.start()]))
        if m.group("term_key") is not None:
            key = m.group("term_key")
            if key not in TERMS:
                raise SystemExit(f"Unknown term {key!r}; add it to terms.TERMS")
            out.append(
                f"<PythonTerm term={js(key)}>{inline(m.group('term_label'))}</PythonTerm>"
            )
        elif m.group("sup") is not None:
            out.append(f"<sup>{jsx_text(m.group('sup'))}</sup>")
        elif m.group("bold") is not None:
            out.append(f"<strong>{inline(m.group('bold'))}</strong>")
        elif m.group("file_text") is not None:
            # a data file of the topic: on the site it is attached to the bank
            # task, so the lesson names it without a stand link
            out.append(f"<Notation>{{{js(m.group('file_text'))}}}</Notation>")
        elif m.group("code") is not None or m.group("html_code") is not None:
            code = m.group("code") or m.group("html_code")
            out.append(f"<Notation>{{{js(code)}}}</Notation>")
        else:
            out.append(
                f"<ExternalLink href={js(m.group('link_url'))}>"
                f"{jsx_text(m.group('link_text'))}</ExternalLink>"
            )
        last = m.end()
    out.append(jsx_text(text[last:]))
    return "".join(out)


def node(text: str) -> str:
    """A table cell or label: a string literal unless it carries markup."""
    converted = inline(text)
    return js(text) if converted == text else f"<>{converted}</>"


def short_label(paragraph: str, fallback: str) -> str:
    """A region label from the paragraph that introduces the block: the whole
    paragraph when short, otherwise its last sentence (usually «… :»)."""
    text = plain(paragraph).rstrip(":.").strip()
    if 4 <= len(text) <= 90:
        return text
    last = re.split(r"(?<=[.!?])\s+", text)[-1].rstrip(":.").strip()
    return last if 4 <= len(last) <= 90 else fallback


def plain(text: str) -> str:
    text = re.sub(r"\*\*|`|<[^>]+>", "", text)
    return re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text).strip()


class Converter:
    def __init__(self, media_known: set[str], site: dict, subtopic_slugs: list[str]):
        self.media_known = media_known
        self.site = site
        self.subtopic_slugs = subtopic_slugs
        self.imports: set[str] = set()
        self.local: set[str] = set()

    def cheatsheet(self, source: str) -> str:
        data = json.loads((STAND / source).read_text(encoding="utf-8"))
        self.imports.add("TopicCheatSheet")
        self.local.add("SubtopicLink")

        def rows(items) -> str:
            return "[" + ", ".join(
                f"{{ key: <>{inline(k)}</>, note: <>{inline(v)}</> }}" for k, v in items
            ) + "]"

        groups = []
        for g in data["groups"]:
            slug = self.subtopic_slugs[g["page"] - 1]
            level = f", level: {js(g['level'])}" if g.get("level") else ""
            groups.append(
                f"{{ number: {g['page']}, title: <SubtopicLink routeSlug={js(self.site['route'])} "
                f"subtopic={js(slug)}>{jsx_text(g['title'])}</SubtopicLink>{level}, "
                f"rows: {rows(g['items'])} }}"
            )
        flow = ", ".join(f"{{ name: {js(n)}, note: {js(t)} }}" for n, t in data["flow"])
        sections = []
        for sec in data.get("sections", []):
            parts = [f"title: {js(sec['title'])}"]
            if "rows" in sec:
                parts.append(f"rows: {rows(sec['rows'])}")
            if sec.get("columns"):
                parts.append("columns: true")
            if "steps" in sec:
                parts.append(
                    "steps: [" + ", ".join(f"<>{inline(c)}</>" for c in sec["steps"]) + "]"
                )
            if sec.get("note"):
                parts.append(f"note: <>{inline(sec['note'])}</>")
            sections.append("{ " + ", ".join(parts) + " }")
        return (
            f"<TopicCheatSheet label={{{js(data['title'])}}} flow={{[{flow}]}} "
            f"groups={{[{', '.join(groups)}]}} sections={{[{', '.join(sections)}]}} "
            f"caption={{<>{inline(data['caption'])}</>}} />"
        )

    def pick(self, kind: str, head: str, body: str) -> str:
        label, _, universe = head.partition("|")
        values = [v.strip() for v in universe.split(",") if v.strip()]
        variants, default = [], 0
        for index, line in enumerate(body.strip().splitlines()):
            cells = [c.strip() for c in line.strip().lstrip("- ").split("|")]
            name, value, note = (cells + ["", ""])[:3]
            if name.startswith("*"):
                default, name = index, name.lstrip("*").strip()
            if kind == "pick-tokens":
                self.imports.add("TokenSet")
                chosen = [v.strip() for v in value.split(",")]
                shown = (
                    f"<TokenSet values={{[{', '.join(values)}]}} "
                    f"selected={{[{', '.join(chosen)}]}} />"
                )
            else:
                shown = f"<>{inline(value)}</>"
            extra = f", note: <>{inline(note)}</>" if note else ""
            variants.append(f"{{ label: {js(plain(name))}, value: {shown}{extra} }}")
        self.imports.add("VariantPicker")
        chosen_default = f" defaultIndex={{{default}}}" if default else ""
        return (
            f"<VariantPicker label={{{js(label.strip())}}}{chosen_default} "
            f"variants={{[{', '.join(variants)}]}} />"
        )

    def figure_call(
        self, name: str, args_src: str, caption: str | None, context: str
    ) -> str:
        args, kwargs = parse_call(name, args_src)
        if name == "mask_try":
            self.imports.add("MaskSandbox")
            mask, number = (*args, *mask_try.__defaults__[len(args) :])
            return f"<MaskSandbox defaultMask={js(mask)} defaultNumber={js(number)} />"
        if name == "remainder_widget":
            self.imports.add("RemainderExplorer")
            return (
                f"<RemainderExplorer n={{{args[0]}}} d={{{args[1]}}} "
                f"caption={{<>{inline(REMAINDER_CAPTION)}</>}} />"
            )
        if name == "cheatsheet":
            return self.cheatsheet(args[0])
        if name == "path_builder":
            self.imports.add("PathBuilder")
            key = media_key(name, args, kwargs)
            if key not in self.media_known:
                raise SystemExit(f"{key}: not in the media manifest; run export_media.py first")
            return (
                f"<PathBuilder {{...lessonMedia.{key}}} "
                f"caption={{<>{inline(kwargs.get('caption', ''))}</>}} />"
            )
        if name in WIDGETS:
            raise SystemExit(f"widget {name!r} has no site mapping")
        key = media_key(name, args, kwargs)
        if key not in self.media_known:
            raise SystemExit(
                f"{key}: not in the media manifest; run export_media.py first"
            )
        if name in STEPPERS:
            self.imports.add("LessonStepper")
            labels = self.site.get("stepperLabels", {})
            # by media key, or by builder name when the key carries a hash
            label = labels.get(key) or labels.get(name) or plain(context) or "Пошаговая схема"
            return f"<LessonStepper {{...lessonMedia.{key}}} label={{{js(label)}}} />"
        self.imports.add("LessonDiagram")
        return f"<LessonDiagram {{...lessonMedia.{key}}} caption={{<>{inline(caption or '')}</>}} />"

    def blocks(self, md: str) -> list[str]:
        """Convert Markdown body text into JSX block elements."""
        lines = md.strip("\n").split("\n")
        out: list[str] = []
        last_para = ""
        i = 0
        while i < len(lines):
            line = lines[i]
            stripped = line.strip()
            if not stripped:
                i += 1
                continue
            if stripped.startswith("```"):
                lang = stripped[3:].strip() or "text"
                j = i + 1
                while not lines[j].strip().startswith("```"):
                    j += 1
                code = "\n".join(lines[i + 1 : j])
                output = None
                k = j + 1
                while k < len(lines) and not lines[k].strip():
                    k += 1
                if lang == "python" and k < len(lines) and lines[k].strip() == "```output":
                    m = k + 1
                    while not lines[m].strip().startswith("```"):
                        m += 1
                    output = "\n".join(lines[k + 1 : m])
                    j = m
                self.imports.add("CodeBlock")
                language = "python" if lang == "python" else "text"
                # lines of a data file: the fence names the file (```23.txt)
                file_name = lang if "." in lang else None
                first = next((ln.strip() for ln in code.splitlines() if ln.strip()), "")
                label = (
                    short_label(last_para, f"Код на Python: {first[:60]}")
                    if language == "python"
                    else f"Строки файла {file_name}" if file_name else "Результат"
                )
                extra = f" output={{{js(output)}}}" if output is not None else ""
                if file_name:
                    extra += f" fileName={js(file_name)}"
                out.append(
                    f"<CodeBlock code={{{js(code)}}} label={{{js(label)}}} language={js(language)}{extra} />"
                )
                i = j + 1
                continue
            if stripped.startswith("<figure"):
                j = i
                while "</figure>" not in lines[j]:
                    j += 1
                chunk = "\n".join(lines[i : j + 1])
                call = re.search(r"%%(\w+)\((.*?)\)%%", chunk)
                caption = re.search(r"<figcaption>(.*?)</figcaption>", chunk, re.S)
                if not call:
                    raise SystemExit(f"figure without a builder call: {chunk[:80]}")
                out.append(
                    self.figure_call(
                        call.group(1),
                        call.group(2),
                        caption.group(1).strip() if caption else None,
                        last_para,
                    )
                )
                i = j + 1
                continue
            if stripped.startswith(":::pick"):
                kind, _, head = stripped[3:].partition(" ")
                j = i + 1
                while lines[j].strip() != ":::":
                    j += 1
                out.append(self.pick(kind, head, "\n".join(lines[i + 1 : j])))
                i = j + 1
                continue
            if stripped.startswith("<details"):
                j = i
                while "</details>" not in lines[j]:
                    j += 1
                chunk = "\n".join(lines[i + 1 : j])
                summary = re.search(r"<summary>(.*?)</summary>", chunk)
                body = re.sub(r"<summary>.*?</summary>", "", chunk, count=1)
                self.imports.add("ProofDisclosure")
                inner = "\n".join(self.blocks(body))
                title = plain(summary.group(1)) if summary else "Доказательство"
                out.append(
                    f"<ProofDisclosure summary={js(title)}>\n{inner}\n</ProofDisclosure>"
                )
                i = j + 1
                continue
            call = FIGURE_CALL.match(stripped)
            if call:
                out.append(
                    self.figure_call(call.group(1), call.group(2), None, last_para)
                )
                i += 1
                continue
            if stripped.startswith("|"):
                j = i
                rows = []
                while j < len(lines) and lines[j].strip().startswith("|"):
                    rows.append(
                        [c.strip() for c in lines[j].strip().strip("|").split("|")]
                    )
                    j += 1
                header, align, body = rows[0], rows[1], rows[2:]
                columns = ", ".join(
                    f"{{ label: {node(h)}{', numeric: true' if a.endswith(':') else ''} }}"
                    for h, a in zip(header, align, strict=True)
                )
                cells = ",\n".join(
                    "[" + ", ".join(node(c) for c in row) + "]"
                    for row in body
                )
                label = short_label(last_para, ", ".join(plain(h) for h in header))
                self.imports.add("LessonTable")
                out.append(
                    f"<LessonTable label={{{js(label)}}} columns={{[{columns}]}} rows={{[\n{cells}\n]}} />"
                )
                i = j
                continue
            if stripped.startswith(">"):
                j = i
                quote = []
                while j < len(lines) and lines[j].strip().startswith(">"):
                    quote.append(lines[j].strip()[1:].strip())
                    j += 1
                paras = [p for p in "\n".join(quote).split("\n\n") if p.strip()]
                body = "\n".join(
                    f"<Typography.Text>{inline(' '.join(p.split()))}</Typography.Text>"
                    for p in paras
                )
                out.append(f"<blockquote>\n{body}\n</blockquote>")
                i = j
                continue
            if re.match(r"^(- |\d+\. )", stripped):
                ordered = bool(re.match(r"^\d+\. ", stripped))
                j = i
                items = []
                while j < len(lines) and re.match(r"^(- |\d+\. )", lines[j].strip()):
                    items.append(re.sub(r"^(- |\d+\. )", "", lines[j].strip()))
                    j += 1
                tag = "ol" if ordered else "ul"
                lis = "\n".join(f"<li>{inline(item)}</li>" for item in items)
                out.append(f"<{tag}>\n{lis}\n</{tag}>")
                i = j
                continue
            j = i
            para = []
            while (
                j < len(lines)
                and lines[j].strip()
                and not re.match(
                    r"^(```|<figure|<details|%%|:::|\||>|- |\d+\. )", lines[j].strip()
                )
            ):
                para.append(lines[j].strip())
                j += 1
            text = " ".join(para)
            last_para = text
            out.append(f"<Typography.Text>{inline(text)}</Typography.Text>")
            i = j
        return out

    def fragment(self, md: str) -> str:
        return "<>\n" + "\n".join(self.blocks(md)) + "\n</>"


def split_steps(md: str) -> list[str]:
    return [b.strip() for b in re.split(r"\n---\n", md) if b.strip()]


def task_inventory(block: str) -> list[dict]:
    """Numbered tasks of a task block with their answers, as authored."""
    parts = re.split(r"\n\*\*Ответы для проверки:\*\*\n", block)
    questions, answers = parts[0], parts[1] if len(parts) > 1 else ""

    def numbered(text: str) -> dict[int, str]:
        found = re.split(r"(?m)^(\d+)\. ", text)
        return {
            int(found[k]): found[k + 1].strip() for k in range(1, len(found) - 1, 2)
        }

    q, a = numbered(questions), numbered(answers)
    return [{"number": n, "question": q[n], "answer": a.get(n, "")} for n in sorted(q)]


def write_terms(path: Path) -> None:
    """The PythonTerm registry, generated from terms.TERMS."""
    entries = []
    for key, (title, body, slug, lesson) in TERMS.items():
        entries.append(
            f"  {key}: {{\n    title: {js(title)},\n    body: <>{inline(body)}</>,\n"
            f"    lessonSlug: {js(slug)},\n    lessonTitle: {js(lesson)},\n  }},"
        )
    path.write_text(prettier(
        "// Generated by scripts/lesson_design/export_lesson.py from terms.py.\n"
        'import { Notation } from "~/shared/components/notation";\n\n'
        "type PythonTermEntry = {\n  title: string;\n  body: React.ReactNode;\n"
        "  lessonSlug: string;\n  lessonTitle: string;\n};\n\n"
        "export const pythonTerms = {\n"
        + "\n".join(entries)
        + "\n} as const satisfies Record<string, PythonTermEntry>;\n\n"
        "export type PythonTermKey = keyof typeof pythonTerms;\n",
        path,
    ))


def checkpoint_block(checks: list[dict], indent: str) -> str:
    """«Проверьте себя» items from topic.json → a `checkpoint` property."""
    if not checks:
        return ""
    items = ",\n".join(
        f"{indent}  {{ id: {js(c['id'])}, prompt: <>{inline(c['prompt'])}</>, "
        f"reveal: <>{inline(c['reveal'])}</> }}"
        for c in checks
    )
    return f"{indent}checkpoint: [\n{items}\n{indent}],\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("topic", type=Path)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--tasks", type=Path, required=True)
    options = parser.parse_args()
    topic = options.topic
    meta = json.loads((topic / "topic.json").read_text())
    site = meta["site"]
    manifest = (
        HERE.parents[1]
        / "apps/web/src/entities/lesson/content"
        / f"{site['id']}.media.ts"
    ).read_text()
    slugs = [re.sub(r"^\d+-", "", Path(sub["source"]).stem) for sub in meta["subtopics"]]
    converter = Converter(
        set(re.findall(r"^  (\w+): \{", manifest, re.M)), site, slugs
    )
    theory, subtopics, inventory = [], [], {}
    for sub in meta["subtopics"]:
        name = sub["source"]
        slug = re.sub(r"^\d+-", "", Path(name).stem)
        steps = split_steps((topic / name).read_text())
        anchors = site.get("steps", {}).get(name, [])
        ids = []
        k = 0
        for step in steps:
            if step.startswith(TASK_BLOCK):
                inventory[slug] = task_inventory(step)
                continue
            anchor, label = (
                anchors[k] if k < len(anchors) else (f"{slug}-{k + 1}", f"Шаг {k + 1}")
            )
            k += 1
            ids.append(anchor)
            theory.append(
                f"    {{\n      id: {js(anchor)},\n      navLabel: {js(label)},\n"
                f"      explanation: (\n{converter.fragment(step)}\n      ),\n    }},"
            )
        level = LEVELS[sub["level"]]
        checkpoint = checkpoint_block(site.get("checkpoints", {}).get(slug, []), "      ")
        subtopics.append(
            f"    {{\n      slug: {js(slug)},\n      title: {js(sub['title'])},\n"
            f"      lead: {js(sub['lead'])},\n"
            + (f'      level: "{level}",\n' if level != "core" else "")
            + "      conceptIds: ["
            + ", ".join(js(i) for i in ids)
            + "],\n"
            + checkpoint
            + "    },"
        )
    final_steps = split_steps((topic / meta["final"]["source"]).read_text())
    for step in final_steps:
        if step.startswith(TASK_BLOCK):
            inventory["praktika"] = task_inventory(step)
    picks = site.get("final", {"result": [0], "examFocus": []})
    result = converter.fragment("\n\n".join(final_steps[i] for i in picks["result"]))
    exam = converter.fragment("\n\n".join(final_steps[i] for i in picks["examFocus"]))
    component_imports = sorted(converter.imports - {"CodeBlock"})
    local = sorted(converter.local - {"Notation"})
    outcomes = ", ".join(js(o) for o in site.get("learningOutcomes", []))
    practice_check = checkpoint_block(site.get("checkpoints", {}).get("praktika", []), "  ")
    publication = re.sub(r"-(\w)", lambda m: m.group(1).upper(), site["id"])
    header = [
        "// Generated by scripts/lesson_design/export_lesson.py from the approved stand.",
        "// Read it in full before publishing; change the stand and re-export, not this file.",
        'import { CodeBlock } from "~/shared/components/code-block";',
        'import { ExternalLink } from "~/shared/components/external-link";',
        'import { Notation } from "~/shared/components/notation";',
        'import { Typography } from "~/shared/components/typography";',
        "import {\n  "
        + ",\n  ".join(component_imports)
        + ',\n} from "~/shared/components/learning-content";',
        f'import {{ {publication}LessonPublication }} from "~/shared/config/lesson-publication.mjs";',
        'import { defineLesson } from "../lib/define-lesson";',
        f'import {{ lessonMedia }} from "./{site["id"]}.media";',
        'import { PythonTerm } from "./python-term";',
        *[f'import {{ {name} }} from "./{re.sub(r"(?<!^)(?=[A-Z])", "-", name).lower()}";' for name in local],
        "",
        f"export const {publication}Lesson = defineLesson({{",
        f"  ...{publication}LessonPublication,",
        "  masteryThreshold: 0.8,",
        f"  learningOutcomes: [{outcomes}],",
        '  accessTier: "free",',
        "  subtopics: [",
        *subtopics,
        "  ],",
        "  theory: [",
        *theory,
        "  ],",
        # «praktika» holds the topic-wide self-check of the practice page.
        *([practice_check.rstrip("\n")] if practice_check else []),
        f"  examFocus: (\n{exam}\n  ),",
        f"  result: (\n{result}\n  ),",
        '  status: "published",',
        "});",
        "",
    ]
    text = "\n".join(header)
    if "<ExternalLink" not in text:  # topic 23 has no outside links
        text = text.replace(
            'import { ExternalLink } from "~/shared/components/external-link";\n', ""
        )
    options.out.write_text(prettier(text, options.out))
    write_terms(options.out.parent / "python-terms.tsx")
    options.tasks.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + "\n")
    print(f"draft: {options.out}; tasks: {options.tasks}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
