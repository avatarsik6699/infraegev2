"""Draft a site lesson (``*.lesson.tsx``) from an approved topic folder (stage 9).

Usage (from the repository root):

    python3 -I scripts/lesson_design/export_lesson.py content/lesson-design/topic-25 \\
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
import html
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from excel_figures import fill_try  # noqa: E402
from export_media import media_key, parse_call, prettier  # noqa: E402
from figures import REMAINDER_CAPTION, STAND, STEPPERS, WIDGETS, mask_try  # noqa: E402
from runblock import IO, file_name, record  # noqa: E402
from sheetblock import BLOCK as SHEET_BLOCK  # noqa: E402
from sheetblock import parse_block, site_data  # noqa: E402
from terms import EXCEL_TERMS, TERMS  # noqa: E402

CONTENT = HERE.parents[1] / "apps/web/src/entities/lesson/content"
BANK = HERE.parents[1] / "content/practice-bank/bank.json"
TASK_BLOCK = ("**Чтобы проверить понимание", "**Задачи основных подтем")
FIGURE_CALL = re.compile(r"^%%(\w+)\((.*?)\)%%$")
INLINE = re.compile(
    r"\[\[(?P<keys>[^\]\n\"]+)\]\]"
    r"|\{\{(?P<term_key>[\w-]+)\|(?P<term_label>.+?)\}\}"
    r"|<sup>(?P<sup>.+?)</sup>"
    r"|\*\*(?P<bold>.+?)\*\*"
    r"|`(?P<code>[^`]+)`"
    r"|<code>(?P<html_code>.+?)</code>"
    r"|\[(?P<link_text>[^\]]+)\]\((?P<link_url>https?://[^)\s]+)\)"
    r"|\[(?P<file_text>[^\]]+)\]\((?P<file_url>topic-\d+/files/[^)\s]+)\)"
)
LEVELS = {"основной": "core", "дополнительный": "advanced"}
CODE_GROUP = re.compile(
    r"^```(?P<lang>[\w.-]+)(?P<run> run)?(?: (?P<name>[\w-]+\.\w+))?\n(?P<code>.*?)^```\n"
    r"(?P<io>(?:\n*^```(?:output|console|error|input)\n.*?^```\n)*)"
    r"(?:\n*^```steps\n(?P<notes>.*?)^```\n)?",
    re.M | re.S,
)
IO_BLOCK = re.compile(r"```(output|console|error|input)\n(.*?)```", re.S)
HEAD = {"shell": "команда", "text": "текст"}


# fences a code block may have besides a file name (``23.txt``)
CODE_FENCES = {"python", "output", "error", "console", "input", "bash", "shell"}


def js(text: str) -> str:
    return json.dumps(text, ensure_ascii=False)


def jsx_text(text: str) -> str:
    """Plain text as JSX children: braces and angle brackets become strings."""
    return re.sub(r"[{}<>]+", lambda m: "{" + js(m.group(0)) + "}", text)


def inline(text: str, files: dict[str, str] | None = None) -> str:
    # figure captions are HTML on the stand: <strong> reads as **…**
    text = re.sub(r"<strong>(.*?)</strong>", r"**\1**", text, flags=re.S)
    out, last = [], 0
    for m in INLINE.finditer(text):
        out.append(jsx_text(text[last : m.start()]))
        if m.group("keys") is not None:
            keys = ", ".join(js(k.strip()) for k in m.group("keys").split("+"))
            out.append(f"<KeyCombo keys={{[{keys}]}} />")
        elif m.group("term_key") is not None:
            key = m.group("term_key")
            if key not in TERMS and key not in EXCEL_TERMS:
                raise SystemExit(f"Unknown term {key!r}; add it to terms.TERMS or EXCEL_TERMS")
            label = inline(m.group("term_label"), files)
            out.append(f"<PythonTerm term={js(key)}>{label}</PythonTerm>")
        elif m.group("sup") is not None:
            out.append(f"<sup>{jsx_text(m.group('sup'))}</sup>")
        elif m.group("bold") is not None:
            out.append(f"<strong>{inline(m.group('bold'), files)}</strong>")
        elif m.group("file_text") is not None and files is not None:
            # a self-check question links the file of the bank task it shares
            name = m.group("file_url").rsplit("/", 1)[-1]
            if name not in files:
                raise SystemExit(f"{name}: no bank task carries this file")
            out.append(
                f'<DownloadLink presentation="inline" href={js(files[name])}>'
                f"{jsx_text(m.group('file_text'))}</DownloadLink>"
            )
        elif m.group("file_text") is not None:
            # a data file of the topic: on the site it is attached to the bank
            # task, so the lesson names it without a stand link
            out.append(f"<Notation>{{{js(m.group('file_text'))}}}</Notation>")
        elif m.group("code") is not None or m.group("html_code") is not None:
            code = m.group("code")
            if code is None:  # <code> of an HTML caption: entities decoded
                code = html.unescape(m.group("html_code"))
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


def camel(text: str) -> str:
    head, *rest = re.split(r"[-_]", text)
    return head + "".join(part[:1].upper() + part[1:] for part in rest)


def code_label(context: str) -> str:
    """The accessible name of a code block: the paragraph that introduces it."""
    text = plain(context).rstrip(":.").strip()
    if 4 <= len(text) <= 90:
        return text
    last = re.split(r"(?<=[.!?])\s+", text)[-1].rstrip(":.").strip()
    return last if 4 <= len(last) <= 90 else "Программа на Python"


class Converter:
    def __init__(self, media_known: set[str], site: dict, subtopic_slugs: list[str]):
        self.media_known = media_known
        self.site = site
        self.subtopic_slugs = subtopic_slugs
        self.imports: set[str] = set()
        self.local: set[str] = set()
        # a course shows every Python fence as in a terminal; a topic keeps its
        # code-and-output blocks and takes only runs, sheets and formulas from here
        self.course = False
        self.summary = False  # converting the list of «Итого»
        self.codes: list[str] = []
        self.runs: list[str] = []  # media entries of runnable blocks and sheets
        self.sheet_labels: dict[str, str] = {}
        self.run_keys: set[str] = set()

    def cheatsheet(self, source: str) -> str:
        data = json.loads((STAND / source).read_text(encoding="utf-8"))
        self.imports.add("TopicCheatSheet")
        self.local.add("SubtopicLink")

        def rows(items) -> str:
            return (
                "["
                + ", ".join(
                    f"{{ key: <>{inline(k)}</>, note: <>{inline(v)}</> }}" for k, v in items
                )
                + "]"
            )

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
            cells = [c.strip() for c in re.split(r" \| ", line.strip().lstrip("- "))]
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
        return self.topic_figure(name, args_src, caption, context)

    def topic_figure(self, name: str, args_src: str, caption: str | None, context: str) -> str:
        args, kwargs = parse_call(name, args_src)
        if name == "mask_try":
            self.imports.add("MaskSandbox")
            mask, number = (*args, *(mask_try.__defaults__ or ())[len(args) :])
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
            raise SystemExit(f"{key}: not in the media manifest; run export_media.py first")
        if name in STEPPERS:
            self.imports.add("LessonStepper")
            labels = self.site.get("stepperLabels", {})
            # by media key, or by builder name when the key carries a hash
            label = labels.get(key) or labels.get(name) or plain(context) or "Пошаговая схема"
            return f"<LessonStepper {{...lessonMedia.{key}}} label={{{js(label)}}} />"
        self.imports.add("LessonDiagram")
        return (
            f"<LessonDiagram {{...lessonMedia.{key}}} caption={{<>{inline(caption or '')}</>}} />"
        )

    def code_group(self, m: re.Match) -> str:
        """One code fence with its output blocks → a placeholder line."""
        lang, code, name = m.group("lang"), m.group("code").rstrip("\n"), m.group("name")
        io_text = m.group("io") or ""
        if not self.course and not (m.group("run") or lang.startswith("excel")):
            return m.group(0)  # a topic's code and output: blocks() keeps its look
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
                base, n = key, 1
                while key in self.run_keys:  # a topic reuses a file name on another page
                    n += 1
                    key = f"{base}{n}"
                steps = record(code + "\n", dict(IO.findall(io_text)), m.group("notes") or "")
                entry = {"kind": "run", "code": code, "fileName": shown, "output": output}
                if error is not None:
                    entry["error"] = error
                entry["steps"] = steps
                self.runs.append(f"  {key}: " + json.dumps(entry, ensure_ascii=False) + ",")
                self.run_keys.add(key)
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
                # «⇒ value» after the formula: what the cell shows, as on a sheet
                formula, _, shown = (raw[at.end() :] if at else raw).partition(" ⇒ ")
                result = {"result": shown.strip()} if shown.strip() else {}
                lines.append({**cell, "formula": formula.rstrip(), **result})
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
                # a code block holds code, its output or the lines of a file
                # (Change 184 T24): reasoning, plans and conditions are prose
                if lang.split()[0] not in CODE_FENCES and "." not in lang:
                    raise SystemExit(f"```{lang}: not code — write it as prose, a list or a figure")
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
                    else f"Строки файла {file_name}"
                    if file_name
                    else "Результат"
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
                # «Тонкости: …» — fine points of a step, not a proof: own look
                kind = ' kind="nuance"' if title.startswith("Тонкости") else ""
                out.append(
                    f"<ProofDisclosure summary={js(title)}{kind}>\n{inner}\n</ProofDisclosure>"
                )
                i = j + 1
                continue
            call = FIGURE_CALL.match(stripped)
            if call:
                out.append(self.figure_call(call.group(1), call.group(2), None, last_para))
                i += 1
                continue
            if stripped.startswith("|"):
                j = i
                rows = []
                while j < len(lines) and lines[j].strip().startswith("|"):
                    rows.append([c.strip() for c in lines[j].strip().strip("|").split("|")])
                    j += 1
                header, align, body = rows[0], rows[1], rows[2:]
                columns = ", ".join(
                    f"{{ label: {node(h)}{', numeric: true' if a.endswith(':') else ''} }}"
                    for h, a in zip(header, align, strict=True)
                )
                cells = ",\n".join("[" + ", ".join(node(c) for c in row) + "]" for row in body)
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
                if self.summary and not ordered:
                    out.append(summary_block(items))
                    self.imports.add("LessonSummary")
                    i = j
                    continue
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
                and not re.match(r"^(```|<figure|<details|%%|:::|\||>|- |\d+\. )", lines[j].strip())
            ):
                para.append(lines[j].strip())
                j += 1
            text = " ".join(para)
            last_para = text
            out.append(f"<Typography.Text>{inline(text)}</Typography.Text>")
            i = j
        return out

    def fragment(self, md: str, summary: bool = False) -> str:
        """JSX of a step; in «Итого» (`summary`) a bullet list is LessonSummary."""
        self.summary = summary
        try:
            return "<>\n" + "\n".join(self.blocks(md)) + "\n</>"
        finally:
            self.summary = False


# «Итого» item: a key — bold or code, maybe with a few words — then « — » or «: »
SUMMARY_KEY = re.compile(r"^((?:\*\*[^*]+\*\*|`[^`]+`)[^—:`*]*?)(?: — |: )(.+)$", re.S)


def summary_block(items: list[str]) -> str:
    """The list of «Итого» as LessonSummary (Change 184): `**ключ** — пояснение`
    gives a key and its note. Keys only when every item has one, so a list never
    mixes the two forms; otherwise each item is one plain block."""
    found = [SUMMARY_KEY.match(item) for item in items]
    rows = []
    for item, m in zip(items, found, strict=True):
        if all(found) and m:
            key, note = inline(m.group(1).strip()), inline(m.group(2))
            rows.append(f"{{ key: <>{key}</>, note: <>{note}</> }}")
        else:
            rows.append(f"{{ note: <>{inline(item)}</> }}")
    return "<LessonSummary\nitems={[\n" + ",\n".join(rows) + ",\n]}\n/>"


def split_steps(md: str) -> list[str]:
    return [b.strip() for b in re.split(r"\n---\n", md) if b.strip()]


def without_label(step: str, label: str) -> str:
    """The step without a bold opening that repeats its heading («**Итого.**»)."""
    m = re.match(r"\*\*(.+?)\.?\*\*[ \t]*", step)
    if m and m.group(1).casefold() == label.casefold():
        return step[m.end() :].lstrip()
    return step


def task_inventory(block: str) -> list[dict]:
    """Numbered tasks of a task block with their answers, as authored."""
    parts = re.split(r"\n\*\*Ответы для проверки:\*\*\n", block)
    questions, answers = parts[0], parts[1] if len(parts) > 1 else ""

    def numbered(text: str) -> dict[int, str]:
        found = re.split(r"(?m)^(\d+)\. ", text)
        return {int(found[k]): found[k + 1].strip() for k in range(1, len(found) - 1, 2)}

    q, a = numbered(questions), numbered(answers)
    return [{"number": n, "question": q[n], "answer": a.get(n, "")} for n in sorted(q)]


def write_terms(path: Path) -> str:
    """The term registry of topic lessons, generated from terms.TERMS (Python
    course) and terms.EXCEL_TERMS (Excel course, Change 184)."""
    entries = []
    for course, registry in (("python", TERMS), ("excel", EXCEL_TERMS)):
        meta = json.loads((STAND / f"course-{course}/course.json").read_text(encoding="utf-8"))
        slugs = {ls["site"]["routeSlug"] for m in meta["modules"] for ls in m["lessons"]}
        for key, (title, body, slug, lesson) in registry.items():
            if slug not in slugs:
                raise SystemExit(f"term {key!r}: the {course} course has no lesson {slug!r}")
            entries.append(
                f"  {js(key) if '-' in key else key}: {{\n    title: {js(title)},\n"
                f"    body: <>{inline(body)}</>,\n    course: {js(course)},\n"
                f"    lessonSlug: {js(slug)},\n    lessonTitle: {js(lesson)},\n  }},"
            )
    return prettier(
        "// Generated by scripts/lesson_design/export_lesson.py from terms.py.\n"
        'import { Notation } from "~/shared/components/notation";\n\n'
        "type PythonTermEntry = {\n  title: string;\n  body: React.ReactNode;\n"
        '  course: "python" | "excel";\n  lessonSlug: string;\n  lessonTitle: string;\n};\n\n'
        "export const pythonTerms = {\n"
        + "\n".join(entries)
        + "\n} as const satisfies Record<string, PythonTermEntry>;\n\n"
        "export type PythonTermKey = keyof typeof pythonTerms;\n",
        path,
    )


def bank_files() -> dict[str, str]:
    """File name → its download address on the site: the file of the first bank
    task (by id) that carries it, as the practice shows it."""
    bank = json.loads(BANK.read_text(encoding="utf-8"))
    found: dict[str, str] = {}
    for entry in sorted(bank["tasks"], key=lambda e: e["task"]["id"]):
        for usage in entry["task"]["files"]:
            found.setdefault(
                usage["filename"], f"/api/tasks/{entry['task']['id']}/files/{usage['id']}"
            )
    return found


def checkpoint_block(checks: list[dict], indent: str) -> str:
    """«Проверьте себя» items from topic.json → a `checkpoint` property. The
    question is text, not a button (Change 184): its terms open their hints and
    a task file is a download link."""
    if not checks:
        return ""
    for c in checks:
        if "%%" in c["prompt"] + c["reveal"]:
            # a stand figure (the workbook view of a task) has no place in the
            # self-check: the file is attached to the bank task (Change 184)
            raise SystemExit(f"checkpoint {c['id']!r}: a %%figure%% call in the self-check")
    files = bank_files() if any("/files/" in c["prompt"] + c["reveal"] for c in checks) else {}
    items = ",\n".join(
        f"{indent}  {{ id: {js(c['id'])}, "
        f"prompt: <>{inline(c['prompt'], files)}</>, "
        f"reveal: <>{inline(c['reveal'], files)}</> }}"
        for c in checks
    )
    return f"{indent}checkpoint: [\n{items}\n{indent}],\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=(__doc__ or "").split("\n")[0])
    parser.add_argument("topic", type=Path)
    parser.add_argument("--out", type=Path, help="default: the site lesson of topic.json site.id")
    parser.add_argument("--tasks", type=Path, help="where to write the task inventory")
    parser.add_argument("--check", action="store_true", help="fail on a stale lesson or terms")
    options = parser.parse_args()
    topic = options.topic
    meta = json.loads((topic / "topic.json").read_text())
    site = meta["site"]
    manifest = (CONTENT / f"{site['id']}.media.ts").read_text()
    slugs = [re.sub(r"^\d+-", "", Path(sub["source"]).stem) for sub in meta["subtopics"]]
    converter = Converter(set(re.findall(r"^  (\w+): \{", manifest, re.M)), site, slugs)
    theory, subtopics, inventory = [], [], {}
    for sub in meta["subtopics"]:
        name = sub["source"]
        slug = re.sub(r"^\d+-", "", Path(name).stem)
        steps = split_steps(converter.prepare((topic / name).read_text()))
        anchors = site.get("steps", {}).get(name, [])
        ids = []
        k = 0
        for step in steps:
            if step.startswith(TASK_BLOCK):
                inventory[slug] = task_inventory(step)
                continue
            anchor, label = anchors[k] if k < len(anchors) else (f"{slug}-{k + 1}", f"Шаг {k + 1}")
            k += 1
            ids.append(anchor)
            theory.append(
                f"    {{\n      id: {js(anchor)},\n      navLabel: {js(label)},\n"
                f"      explanation: (\n{converter.fragment(without_label(step, label), label == 'Итого')}\n      ),\n    }},"
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
    final_steps = split_steps(converter.prepare((topic / meta["final"]["source"]).read_text()))
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
        *[
            f'import {{ {name} }} from "./{re.sub(r"(?<!^)(?=[A-Z])", "-", name).lower()}";'
            for name in local
        ],
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
    if "<DownloadLink" in text:  # a self-check question with a task file
        text = text.replace(
            'import { Notation } from "~/shared/components/notation";\n',
            'import { DownloadLink } from "~/shared/components/download-link";\n'
            'import { Notation } from "~/shared/components/notation";\n',
        )
    if "<CodeBlock" not in text:  # a spreadsheet topic (18) has no code
        text = text.replace('import { CodeBlock } from "~/shared/components/code-block";\n', "")
    if "<KeyCombo" in text:  # a key combination is written inline, outside the imports
        text = text.replace(
            'import { Notation } from "~/shared/components/notation";\n',
            'import { KeyCombo } from "~/shared/components/key-combo";\n'
            'import { Notation } from "~/shared/components/notation";\n',
        )
    out = options.out or CONTENT / f"{site['id']}.lesson.tsx"
    outputs = {out: prettier(text, out)}
    terms_path = out.parent / "python-terms.tsx"
    outputs[terms_path] = write_terms(terms_path)
    if options.check:
        stale = [p for p, body in outputs.items() if not p.exists() or p.read_text() != body]
        for p in outputs:
            print(f"{p.name}: {'stale' if p in stale else 'up to date'}")
        return 1 if stale else 0
    for p, body in outputs.items():
        p.write_text(body)
    if options.tasks:
        options.tasks.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote {out.name}" + (f"; tasks: {options.tasks}" if options.tasks else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
