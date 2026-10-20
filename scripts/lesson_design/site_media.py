"""Rebuild the code-built media of the site lessons (Change 197).

Usage (from the repository root):

    python3 -I scripts/lesson_design/site_media.py            # rewrite every manifest
    python3 -I scripts/lesson_design/site_media.py --check    # fail on a stale one
    python3 -I scripts/lesson_design/site_media.py apps/web/src/entities/lesson/content/rekursiya.media.ts

The site is the only source of the lessons: every ``*.media.ts`` manifest under
``apps/web/src/entities/{lesson,course}/content`` describes itself.

- A figure is the line ``// %%builder(args)%%`` above its entry; the entry (SVG
  strings, size, alt text, stepper frames, sandbox data) is rebuilt from that call
  with ``figures.py``. A builder without ``aria-label`` keeps the entry's alt text.
  To add a figure, write the call line where it belongs and run this script: the
  entry appears under it with its key (``media_key``) printed. Changing the call of
  an existing figure keeps its key.
- A runnable program (``kind: "run"``) is recorded again from its ``code`` by
  ``tracer.py``; the recorded output must equal the entry's ``output`` and a run that
  stops must stop with ``error``. Author notes for the steps (``3: текст``, ``3.2:
  текст``) are the line ``// run notes: "…"`` above the entry.
- A live sheet and anything else is data and stays as written.

The SVG text inherits the page font (Onest) because the site renders it inline; an
SVG inside ``<img>`` cannot load webfonts.
"""

import argparse
import ast
import hashlib
import html
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
sys.path.insert(0, str(HERE))
from figures import FIGURES, STEPPERS, WIDGET_DATA  # noqa: E402
from runblock import record  # noqa: E402

CONTENT = (
    REPO / "apps/web/src/entities/lesson/content",
    REPO / "apps/web/src/entities/course/content",
)
FIGURE_CALL = re.compile(r"%%(\w+)\((.*?)\)%%")
# builders whose content is in their list arguments: two calls with the same
# scalar arguments still draw different figures (formula_steps of one cell,
# base_blocks of one base, ex_line of one path with other marks)
HASHED = {"formula_steps", "base_blocks", "ex_line"}
SVG_NS = 'xmlns="http://www.w3.org/2000/svg"'
STAND_FONT = 'font-family="Onest, system-ui, sans-serif"'
HEADER = (
    "// Lesson media: a figure is rebuilt from the builder call above it, a run is\n"
    "// recorded again from its code — scripts/lesson_design/site_media.py.\n"
)
TYPE_IMPORT = 'import type { LessonMediaTypes } from "~/shared/components/learning-content";\n'
COMMENT = re.compile(r"^  // (.*)$")
KEY = re.compile(r"^  (\w+):(?: |$)")  # Prettier puts a long key alone on its line
NOTES = "run notes: "


def shown(path: Path) -> Path:
    """A path as the messages print it: repository-relative when it can be."""
    return path.relative_to(REPO) if path.is_relative_to(REPO) else path


def parse_call(args_src: str) -> tuple[list, dict]:
    call = ast.parse(f"f({args_src})", mode="eval").body
    assert isinstance(call, ast.Call)
    args = [ast.literal_eval(a) for a in call.args]
    kwargs = {k.arg: ast.literal_eval(k.value) for k in call.keywords}
    return args, kwargs


def prop(indent: int, key: str, value: str) -> str:
    """One object property the way Prettier (width 80) prints it."""
    pad = " " * indent
    line = f"{pad}{key}: {value},"
    return line if len(line) <= 80 else f"{pad}{key}:\n{pad}  {value},"


def media_key(name: str, args: list, kwargs: dict | None = None) -> str:
    """Stable TS identifier: camelCase builder name plus its positional args.
    A call whose arguments are only lists (a graph: its edge list) gets a short
    hash of them and of the keyword arguments instead, so that two pictures of
    one graph (a path, values under the vertices) never share a key; a call with
    keyword arguments gets the hash too, so that two views of one data file
    (points, then their clusters) never share a key either."""
    head, *rest = name.split("_")
    camel = head + "".join(part.title() for part in rest)
    parts = [re.sub(r"[^0-9A-Za-z]", "", str(a)) for a in args if not isinstance(a, list)]
    key = camel + "_".join(p for p in parts if p)
    if (key == camel and args) or kwargs or name in HASHED:
        data = json.dumps([args, kwargs or {}], ensure_ascii=False, sort_keys=True)
        digest = hashlib.sha1(data.encode()).hexdigest()
        key += "_" + digest[:6]
    return key


def ts_string(text: str) -> str:
    """A string literal the way Prettier keeps it: the quote needing fewer escapes."""
    if text.count('"') > text.count("'"):
        return "'" + text.replace("\\", "\\\\").replace("'", "\\'") + "'"
    return json.dumps(text, ensure_ascii=False)


def inline_svg(svg: str) -> tuple[str, int, int, str]:
    """SVG for inline use: text inherits the page font, the wrapper carries
    the accessible name. Returns markup, intrinsic size and alt text."""
    match = re.match(r'<svg viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"', svg)
    if not match:
        raise SystemExit('figure builder must start with <svg viewBox="0 0 W H"')
    width, height = round(float(match.group(1))), round(float(match.group(2)))
    label = re.search(r'aria-label="([^"]*)"', svg)
    head_match = re.match(r"<svg [^>]*>", svg)
    assert head_match
    head = head_match.group(0)
    clean = re.sub(r' (role|aria-label|aria-hidden)="[^"]*"', "", head)
    clean = clean.replace("<svg ", f'<svg {SVG_NS} aria-hidden="true" focusable="false" ', 1)
    svg = clean + svg[len(head) :]
    svg = svg.replace(STAND_FONT.strip(), 'font-family="inherit"')
    # the label is an SVG attribute value; the alt text is plain text
    return svg, width, height, html.unescape(label.group(1)) if label else ""


def figure_entry(call: str, current: dict | None, key: str | None = None) -> tuple[str, str]:
    """The key and manifest entry of one ``%%builder(args)%%`` call. An existing entry
    keeps its key when its call changes, so the lesson's references stay; a new one is
    named by ``media_key``."""
    match = FIGURE_CALL.fullmatch(call)
    if not match:
        raise SystemExit(f"not a figure call: {call!r}")
    name = match.group(1)
    if name not in FIGURES:
        raise SystemExit(f"Unknown figure {name!r}; add it to figures.FIGURES")
    args, kwargs = parse_call(match.group(2))
    key = key or media_key(name, args, kwargs)
    if name in WIDGET_DATA:
        # a sandbox drawn by its site component from generated data
        return key, f"  {key}: " + json.dumps(
            WIDGET_DATA[name](*args, **kwargs), ensure_ascii=False
        ) + ","
    if name in STEPPERS:
        frames = []
        width = height = 0
        for svg, caption in STEPPERS[name](*args, **kwargs):
            text_svg, width, height, _ = inline_svg(svg)
            frames.append(
                "      {\n"
                + prop(8, "svg", ts_string(text_svg))
                + "\n"
                + prop(8, "caption", ts_string(caption))
                + "\n      },"
            )
        return key, (
            f'  {key}: {{\n    kind: "stepper",\n    width: {width},\n'
            f"    height: {height},\n    frames: [\n" + "\n".join(frames) + "\n    ],\n  },"
        )
    text_svg, width, height, alt = inline_svg(FIGURES[name](*args, **kwargs))
    alt = alt or (current or {}).get("alt", "")
    if not alt:
        raise SystemExit(f"{key}: a diagram needs aria-label or an alt text in its entry")
    return key, (
        f'  {key}: {{\n    kind: "diagram",\n'
        + prop(4, "svg", ts_string(text_svg))
        + f"\n    width: {width},\n    height: {height},\n"
        + prop(4, "alt", ts_string(alt))
        + "\n  },"
    )


def run_entry(key: str, entry: dict, notes: str) -> str:
    """A runnable program recorded again; its output and error are checked."""
    io: dict[str, str] = {}
    output = entry["output"]
    if "⟪" in output:
        io["console"] = output
    elif output:
        io["output"] = output
    if "error" in entry:
        io["error"] = entry["error"]
    try:
        steps = record(entry["code"] + "\n", io, notes)
    except SystemExit as error:
        raise SystemExit(f"{key}: {error}") from None
    fresh = {k: entry[k] for k in ("kind", "code", "fileName", "output")}
    if "error" in entry:
        fresh["error"] = entry["error"]
    fresh["steps"] = steps
    return f"  {key}: " + json.dumps(fresh, ensure_ascii=False) + ","


def load(paths: list[Path]) -> dict[str, dict]:
    """Each manifest's ``lessonMedia`` object, read by Node (type stripping)."""
    script = (
        "const out = {};"
        "for (const p of process.argv.slice(1))"
        " out[p] = (await import(p)).lessonMedia;"
        "process.stdout.write(JSON.stringify(out));"
    )
    done = subprocess.run(
        ["node", "--no-warnings", "--input-type=module", "-e", script, *map(str, paths)],
        capture_output=True,
        text=True,
        cwd=REPO,
    )
    if done.returncode:
        raise SystemExit(done.stderr)
    return json.loads(done.stdout)


def rebuild(path: Path, media: dict) -> str:
    """The manifest rebuilt from its own figure calls, runs and data."""
    entries: list[str] = []
    comments: list[str] = []
    seen: set[str] = set()

    def figures_without_entry() -> None:
        for call in [c for c in comments if FIGURE_CALL.fullmatch(c)]:
            key, text = figure_entry(call, None)
            print(f"{shown(path)}: new figure {key}")
            add(key, [f"  // {call}", text])
        comments.clear()

    def add(key: str, lines: list[str]) -> None:
        if key in seen:
            raise SystemExit(f"{shown(path)}: two entries share the key {key!r}")
        seen.add(key)
        entries.extend(lines)

    body = path.read_text().split("export const lessonMedia = {\n", 1)[1]
    for line in body.split("\n"):
        if comment := COMMENT.match(line):
            comments.append(comment.group(1))
            continue
        match = KEY.match(line)
        if not match:
            continue
        key = match.group(1)
        entry = media[key]
        calls = [c for c in comments if FIGURE_CALL.fullmatch(c)]
        notes = [json.loads(c[len(NOTES) :]) for c in comments if c.startswith(NOTES)]
        if len(calls) > 1:
            # all but the last call are figures written before this entry
            last = comments.pop(len(comments) - 1 - comments[::-1].index(calls[-1]))
            figures_without_entry()
            comments.append(last)
            calls = [last]
        if calls:
            _, text = figure_entry(calls[0], entry, key)
            add(key, [f"  // {calls[0]}", text])
        elif entry.get("kind") == "run":
            note = notes[0] if notes else ""
            head = [f"  // {NOTES}" + json.dumps(note, ensure_ascii=False)] if note else []
            add(key, [*head, run_entry(key, entry, note)])
        elif entry.get("kind") in ("diagram", "stepper", "graph"):
            raise SystemExit(f"{shown(path)}: {key} has no // %%builder(args)%% line")
        else:
            add(key, [f"  {key}: " + json.dumps(entry, ensure_ascii=False) + ","])
        comments.clear()
    figures_without_entry()
    return (
        HEADER
        + TYPE_IMPORT
        + "\nexport const lessonMedia = {\n"
        + "\n".join(entries)
        + "\n} as const satisfies Record<string, LessonMediaTypes.Generated>;\n"
    )


def prettier(text: str, path: Path) -> str:
    """Format like the repository's format gate, so --check compares equal."""
    return subprocess.run(
        [str(REPO / "node_modules/.bin/prettier"), "--stdin-filepath", str(path)],
        input=text,
        capture_output=True,
        text=True,
        check=True,
        cwd=REPO,
    ).stdout


def main() -> int:
    parser = argparse.ArgumentParser(description=(__doc__ or "").split("\n")[0])
    parser.add_argument("manifests", nargs="*", type=Path, help="default: every manifest")
    parser.add_argument("--check", action="store_true", help="fail on stale output")
    options = parser.parse_args()
    paths = [p.resolve() for p in options.manifests] or sorted(
        p for folder in CONTENT for p in folder.glob("*.media.ts")
    )
    media = load(paths)
    stale = []
    for path in paths:
        text = prettier(rebuild(path, media[str(path)]), path)
        rel = shown(path)
        if path.read_text() == text:
            continue
        if options.check:
            stale.append(rel)
            print(f"{rel}: stale")
        else:
            path.write_text(text)
            print(f"wrote {rel}")
    if options.check:
        print(f"{len(paths)} manifests, stale: {len(stale)}")
    return 1 if stale else 0


if __name__ == "__main__":
    sys.exit(main())
