"""Build the lesson-design stand: one topic or course folder -> static HTML pages.

Usage (from the repository root):

    uv run --no-project --with markdown python -I scripts/lesson_design/build.py \
        content/lesson-design/topic-25

The topic folder holds ``topic.json`` (see docs/runbooks/lesson-pipeline.md),
the subtopic Markdown files and the extra pages; a mini-course folder holds
``course.json`` (modules of one-page lessons) instead. Pages are written next to the
topic folder, into the stand root that also holds ``index.html`` and
``textbook.css``. The pattern catalogue is rendered from
``docs/runbooks/lesson-patterns.md`` into ``patterns.html``.
"""

import ast
import builtins
import html
import json
import keyword
import re
import sys
from pathlib import Path

import markdown

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
sys.path.insert(0, str(HERE))
from figures import FIGURES, PAGE_SCRIPTS  # noqa: E402
from runblock import RUN_JS, code_html, file_name, prepare  # noqa: E402
from sheetblock import prepare as prepare_sheets  # noqa: E402
from sheetblock import scripts as sheet_scripts  # noqa: E402
from terms import TERMS  # noqa: E402

PATTERNS = REPO / "docs" / "runbooks" / "lesson-patterns.md"

FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
    "family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600"
    '&display=swap">'
)

KEYWORDS = set(keyword.kwlist)
BUILTINS = {n for n in dir(builtins) if n[0].islower() and not n.startswith("_")}
TOKEN = re.compile(
    r"(#.*$)"
    r'|("""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\''
    r"|\"(?:[^\"\\\n]|\\.)*\"|'(?:[^'\\\n]|\\.)*')"
    r"|(\b\d[\d_]*\b)|(\b[A-Za-z_]\w*\b)",
    re.M,
)
FIGURE_CALL = re.compile(r"%%(\w+)\((.*?)\)%%")
PICK_BLOCK = re.compile(r"^:::(pick|pick-tokens) ([^\n]+)\n(.*?)^:::$", re.M | re.S)
TERM = re.compile(r"\{\{(\w+)\|(.+?)\}\}")
IO_ROWS = {"input": "Ввод", "output": "Вывод", "error": "Ошибка"}
TYPED = re.compile(r"⟪(.*?)⟫")
# [[Ctrl+C]] in a lesson: keys of a keyboard shortcut (the Excel course, Change 177)
KEYS = re.compile(r"\[\[([^\]\n\"]+)\]\]")


def keys_html(m: re.Match) -> str:
    keys = [html.escape(k.strip()) for k in m.group(1).split("+")]
    plus = '<span class="key-plus">+</span>'
    return (
        '<span class="keys">' + plus.join(f'<kbd class="key">{k}</kbd>' for k in keys) + "</span>"
    )


# the Python course: terms of the topics open its lessons
PY_COURSE_DIR = "course-python"
# ```python name.py / ```python run name.py: a name for the head of the block
NAMED_FENCE = re.compile(r"^```python( run)? ([\w-]+\.\w+)\n", re.M)
HEAD_LABEL = {
    "shell": "команда",
    "text": "текст",
}
COPY_ICON = (
    '<svg class="ic" width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">'
    '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/>'
    '<path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/></svg>'
)
COPY_JS = r"""<script>
document.querySelectorAll(".code-copy").forEach(function (b) {
  b.hidden = !navigator.clipboard;
  b.onclick = function () {
    var text = b.dataset.copy || b.closest(".code-box").querySelector("pre.code").innerText.replace(/\n$/, "");
    navigator.clipboard.writeText(text).then(function () {
      b.classList.add("done"); b.setAttribute("aria-label", "Код скопирован");
      setTimeout(function () { b.classList.remove("done"); b.setAttribute("aria-label", "Скопировать код"); }, 1600);
    });
  };
});
</script>"""


# Course: a code block or an output longer than 8 lines is folded to about 7.5
# lines with a fade and «Показать весь код / вывод» — as the site's CodeBlock.
# While a block runs step by step everything stays open (CSS .running).
COLLAPSE_JS = r"""<script>
(function () {
  var CHEVRON = '<svg class="ic" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var n = 0;
  function fold(target, what) {
    var lines = target.textContent.replace(/\n$/, "").split("\n").length;
    if (lines <= 8) return;
    var wrap = document.createElement("div");
    wrap.className = "fold";
    target.before(wrap); wrap.append(target);
    target.id = target.id || "fold-" + (++n);
    var bar = document.createElement("div");
    bar.className = "fold-bar";
    var b = document.createElement("button");
    b.type = "button"; b.className = "fold-btn"; b.setAttribute("aria-controls", target.id);
    wrap.append(bar); bar.append(b);
    function set(open) {
      wrap.toggleAttribute("data-folded", !open);
      b.setAttribute("aria-expanded", open);
      b.innerHTML = CHEVRON + "<span>" + (open ? "Свернуть " + what : "Показать весь " + what) + "</span>";
    }
    b.onclick = function () { set(wrap.hasAttribute("data-folded")); };
    set(false);
  }
  document.querySelectorAll(".code-box > pre.code:not([data-run])").forEach(function (pre) { fold(pre, "код"); });
  document.querySelectorAll(".code-box .out-lines > .out-v").forEach(function (v) { fold(v, "вывод"); });
})();
</script>"""


def code_head(label: str, copy: bool = False) -> str:
    button = (
        f'<button type="button" class="ib code-copy" aria-label="Скопировать код" hidden>'
        f"{COPY_ICON}</button>"
        if copy
        else ""
    )
    return (
        f'<div class="code-head"><span class="code-name">{html.escape(label)}</span>{button}</div>'
    )


def out_lines(lang: str, code: str) -> str:
    """Course: output, typed input and an error in one «Вывод» field. Typed
    text becomes a key-like chip, an error is set apart by colour."""
    text = html.escape(code.rstrip("\n"))
    if lang == "error":
        return f'<span class="out-err">{text}</span>'
    if lang == "input":
        return "\n".join(f'<kbd class="typed">{t}</kbd>' for t in text.split("\n"))
    return TYPED.sub(lambda t: f'<kbd class="typed">{t.group(1)}</kbd>', text)


def highlight_python(src: str) -> str:
    out, last = [], 0
    for m in TOKEN.finditer(src):
        out.append(html.escape(src[last : m.start()], quote=False))
        text = html.escape(m.group(0), quote=False)
        if m.group(1):
            cls = "com"
        elif m.group(2):
            cls = "str"
        elif m.group(3):
            cls = "num"
        elif m.group(0) in BUILTINS:
            cls = "fn"
        elif m.group(0) in KEYWORDS:
            cls = "kw"
        else:
            cls = None
        out.append(f'<span class="tok-{cls}">{text}</span>' if cls else text)
        last = m.end()
    out.append(html.escape(src[last:], quote=False))
    return "".join(out)


# A formula of the Excel course in pieces: function names, quoted text, and the
# lower-case words of a template that stand for arguments («условие»).
FORMULA_PART = re.compile(
    r'(?P<str>"[^"]*")|(?P<func>[A-ZА-ЯЁ][A-ZА-ЯЁ0-9.]*(?=\())|(?P<slot>[a-zа-яё][\wа-яё]*|…)'
)
FORMULA_LABEL = re.compile(r"^([A-Z]{1,3}\d+):\s*(?==)")


def formula_html(src: str, template: bool) -> str:
    """A formula block (Change 177 F9): the sheet's formula bar, not a code block —
    an optional cell address, «fx» and the formula; functions in medium weight,
    the slots of a template in italics; one quiet copy button."""
    rows, plain = [], []
    for line in src.strip("\n").split("\n"):
        m = FORMULA_LABEL.match(line)
        cell, formula = (m.group(1), line[m.end() :]) if m else ("", line)
        plain.append(formula)
        parts, pos = [], 0
        for t in FORMULA_PART.finditer(formula):
            parts.append(html.escape(formula[pos : t.start()]))
            text = html.escape(t.group(0))
            if t.lastgroup == "func":
                parts.append(f'<span class="f-fn">{text}</span>')
            elif t.lastgroup == "slot":
                parts.append(f'<span class="f-slot">{text}</span>')
            else:
                parts.append(text)
            pos = t.end()
        parts.append(html.escape(formula[pos:]))
        rows.append(
            f'<div class="f-row"><span class="f-cell">{cell}</span>'
            f'<span class="f-fx" aria-hidden="true">fx</span>'
            f'<code class="f-text">{"".join(parts)}</code></div>'
        )
    label = "Шаблон формулы" if template else "Формула"
    copy = html.escape("\n".join(plain), quote=True)
    return (
        f'<figure class="formula" role="group" aria-label="{label}">{"".join(rows)}'
        f'<button type="button" class="ib code-copy f-copy" aria-label="Скопировать формулу" '
        f'data-copy="{copy}" hidden>{COPY_ICON}</button></figure>'
    )


def inline_md(text: str) -> str:
    """`code` and **bold** inside hand-written widget rows."""
    text = re.sub(r"`([^`]+)`", lambda m: f"<code>{html.escape(m.group(1))}</code>", text)
    return re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)


def pick_block(m: re.Match) -> str:
    """:::pick label / - variant | value | note / ::: — one variant at a time.

    In ``pick-tokens`` the label is followed by ``| 1, 2, 3`` — the full set —
    and each value lists the chosen members. A variant starting with ``*`` is
    selected first. Without JS every variant stays listed.
    """
    kind, head, body = m.group(1), m.group(2), m.group(3)
    label, _, universe = head.partition("|")
    values = [v.strip() for v in universe.split(",") if v.strip()]
    rows = []
    for line in body.strip().splitlines():
        cells = [c.strip() for c in re.split(r" \| ", line.lstrip("- "))]
        name, value, note = (cells + ["", ""])[:3]
        selected = name.startswith("*")
        name = name.lstrip("*").strip()
        if kind == "pick-tokens":
            on = {v.strip() for v in value.split(",")}
            shown = (
                '<span class="toks">'
                + "".join(f'<span class="tok{" on" if v in on else ""}">{v}</span>' for v in values)
                + "</span>"
            )
        else:
            shown = inline_md(value)
        if note:
            shown += f'<span class="pick-n">{inline_md(note)}</span>'
        rows.append(
            f'<div class="pick-item" data-label="{html.escape(name)}"'
            f'{" data-selected" if selected else ""}><span class="pick-l">{html.escape(name)}</span>'
            f'<div class="pick-v">{shown}</div></div>'
        )
    if not any("data-selected" in r for r in rows):
        rows[0] = rows[0].replace('class="pick-item"', 'class="pick-item" data-selected', 1)
    return (
        f'\n<div class="pick" data-pick role="group" aria-label="{html.escape(label.strip())}">'
        '<div class="pick-chips" hidden></div>' + "".join(rows) + "</div>\n"
    )


_term_count: dict[str, int] = {}


def course_slugs() -> list[str]:
    """Site route slugs of the stand's Python course lessons, in course order."""
    course = json.loads(
        (REPO / "content" / "lesson-design" / PY_COURSE_DIR / "course.json").read_text(
            encoding="utf-8"
        )
    )
    return [lesson["site"]["routeSlug"] for m in course["modules"] for lesson in m["lessons"]]


def term(m: re.Match) -> str:
    key, label = m.group(1), m.group(2)
    if key not in TERMS:
        raise SystemExit(f"Unknown term {key!r}; add it to terms.TERMS")
    # on the stand a term opens the course lesson page with its route slug
    title, body, slug, lesson = TERMS[key]
    number = course_slugs().index(slug) + 1
    _term_count[key] = _term_count.get(key, 0) + 1
    pid = f"term-{key}-{_term_count[key]}"
    return (
        f'<button type="button" class="term" data-term popovertarget="{pid}" '
        f'aria-expanded="false">{label}</button>'
        f'<span id="{pid}" popover class="pop" role="dialog" aria-label="{html.escape(title)}">'
        f'<b class="pop-t">{html.escape(title)}</b><span class="pop-b">{body}</span>'
        f'<span class="pop-c">Курс Python, урок {number}: {html.escape(lesson)}</span>'
        f'<span class="pop-a"><a href="py-{number:02d}.html">Читать урок →</a>'
        f'<button type="button" class="pop-x" popovertarget="{pid}" '
        'popovertargetaction="hide">Закрыть</button></span></span>'
    )


PICK_JS = r"""<script>
document.querySelectorAll("[data-pick]").forEach(function (box) {
  var items = [].slice.call(box.querySelectorAll(".pick-item")), chips = box.querySelector(".pick-chips");
  items.forEach(function (item) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.textContent = item.dataset.label;
    b.setAttribute("aria-pressed", item.hasAttribute("data-selected"));
    b.onclick = function () {
      items.forEach(function (x) { x.toggleAttribute("data-selected", x === item); });
      chips.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", c === b); });
    };
    chips.appendChild(b);
    item.setAttribute("aria-live", "polite");
  });
  chips.hidden = false; box.setAttribute("data-ready", "");
});
</script>"""

TERM_JS = r"""<script>
document.querySelectorAll("[data-term]").forEach(function (btn) {
  var pop = document.getElementById(btn.getAttribute("popovertarget"));
  var hideT = null, showT = null, pinned = false;
  function place() {
    var r = btn.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    var left = Math.max(16, Math.min(innerWidth - w - 16, r.left + r.width / 2 - w / 2));
    var top = r.bottom + 8;
    if (top + h > innerHeight - 8) top = r.top - h - 8;
    pop.style.left = left + "px"; pop.style.top = top + "px";
  }
  pop.addEventListener("toggle", function (e) {
    var open = e.newState === "open";
    btn.setAttribute("aria-expanded", open);
    if (open) place(); else pinned = false;
  });
  btn.addEventListener("click", function () { pinned = true; });
  function enter() { clearTimeout(hideT); if (!pop.matches(":popover-open")) showT = setTimeout(function () { pop.showPopover(); }, 150); }
  function leave() { clearTimeout(showT); if (!pinned) hideT = setTimeout(function () { if (pop.matches(":popover-open")) pop.hidePopover(); }, 250); }
  if (matchMedia("(hover: hover)").matches) {
    btn.addEventListener("mouseenter", enter); btn.addEventListener("mouseleave", leave);
    pop.addEventListener("mouseenter", enter); pop.addEventListener("mouseleave", leave);
  }
  addEventListener("scroll", function () { if (pop.matches(":popover-open")) place(); }, { passive: true });
});
</script>"""


def call_figure(m: re.Match) -> str:
    """Expand %%name(literal args)%% with a builder from figures.FIGURES."""
    name = m.group(1)
    if name not in FIGURES:
        raise SystemExit(f"Unknown figure {name!r}; add it to figures.FIGURES")
    call = ast.parse(f"f({m.group(2)})", mode="eval").body
    assert isinstance(call, ast.Call)
    args = [ast.literal_eval(a) for a in call.args]
    kwargs = {str(k.arg): ast.literal_eval(k.value) for k in call.keywords}
    return FIGURES[name](*args, **kwargs)


def render(md_text: str, lines: bool = False) -> tuple[str, list[tuple[str, str]]]:
    """Markdown page -> HTML body and step outline.

    ``lines``: output keeps its lines as in a terminal (the course); topics
    show it in one compact row. A ```console block is a terminal session
    where the typed text is marked ⟪…⟫.
    """
    runs: dict[str, list] = {}
    md_text = NAMED_FENCE.sub(
        lambda m: f"```python{m.group(1) or ''}\n#FILE:{m.group(2)}\n", md_text
    )
    md_text = prepare(md_text, runs)
    md_text = md_text.replace("```excel шаблон\n", "```excel-template\n")
    md_text, sheets = prepare_sheets(md_text)
    md_text = FIGURE_CALL.sub(call_figure, md_text)
    md_text = KEYS.sub(keys_html, md_text)
    md_text = PICK_BLOCK.sub(pick_block, md_text)
    leftover = re.findall(r"%%[^%\n]+%%", md_text)
    if leftover:
        raise SystemExit(f"Unexpanded placeholders: {leftover}")
    body = markdown.markdown(md_text, extensions=["tables", "fenced_code", "md_in_html"])
    body = TERM.sub(term, body)
    for marker, script in {**PAGE_SCRIPTS, "data-pick": PICK_JS, "data-term": TERM_JS}.items():
        if marker in body:
            body += script

    def code_block(m: re.Match) -> str:
        lang, code = m.group(1), html.unescape(m.group(2))
        if lang == "console" or (lines and lang in IO_ROWS):  # console: always lines
            return (
                '<div class="out out-lines"><span class="out-l">Вывод:</span>'
                f'<pre class="out-v">{out_lines(lang, code)}</pre></div>'
            )
        if lang in IO_ROWS:
            # Output lines joined in one row, under the code they come from;
            # typed input and the last line of an expected error likewise.
            shown = ", ".join(code.rstrip("\n").split("\n"))
            return (
                f'<div class="out out-{lang}"><span class="out-l">{IO_ROWS[lang]}</span>'
                f'<span class="out-v">{html.escape(shown)}</span></div>'
            )
        if lang.startswith("excel"):
            return formula_html(code, lang == "excel-template")
        if lines and lang != "python":
            label = lang if "." in lang else HEAD_LABEL.get(lang, str(lang))
            return (
                f'<div class="code-box">{code_head(label)}'
                f'<pre class="code {"text" if "." in lang else lang}">'
                f"<code>{html.escape(code)}</code></pre></div>"
            )
        if "." in lang:
            # lines of a data file: the fence names the file (```23.txt)
            return (
                f'<pre class="code text" data-file="{html.escape(lang)}">'
                f"<code>{html.escape(code)}</code></pre>"
            )
        name = None
        if lang == "python" and code.startswith("#FILE:"):
            first, _, code = code.partition("\n")
            name = first[len("#FILE:") :]
        run = code_html(code, runs, highlight_python) if lang == "python" else None
        inner = highlight_python(code) if lang == "python" else html.escape(code)
        pre = run or f'<pre class="code {lang}"><code>{inner}</code></pre>'
        if not lines and not run:
            return pre
        visible = code.split("\n", 1)[1] if code.startswith("#RUN:") else code
        return (
            f'<div class="code-box">{code_head(name or file_name(visible), copy=True)}{pre}</div>'
        )

    body = re.sub(
        r'<pre><code class="language-([\w.+-]+)">(.*?)</code></pre>',
        code_block,
        body,
        flags=re.S,
    )
    outs = r'((?:\s*<div class="out out-[^"]+">.*?</div>)+)'
    if lines:
        # course: every code block already has its box with a head; the
        # output, typed input or error under the code moves into that box
        body = re.sub(
            r'(<div class="code-box">(?:(?!<div class="code-box">).)*?</pre>)</div>' + outs,
            lambda m: (
                f"{m.group(1)}{re.sub(r'</div>\s+<div', '</div><div', m.group(2).strip())}</div>"
            ),
            body,
            flags=re.S,
        )
    else:
        # a topic's runnable block has its own box with a head («Запуск»
        # goes there, П20); its output moves into that box, as in the course
        body = re.sub(
            r'(<div class="code-box">[^<]*<div class="code-head">(?:(?!<div class="code-box">).)*?</pre>)</div>'
            + outs,
            lambda m: (
                f"{m.group(1)}{re.sub(r'</div>\s+<div', '</div><div', m.group(2).strip())}</div>"
            ),
            body,
            flags=re.S,
        )
        body = re.sub(
            r'(<pre class="code python"(?![^>]*data-run)[^>]*>(?:(?!</pre>).)*</pre>)' + outs,
            lambda m: (
                f'<div class="code-box">{m.group(1)}'
                f"{re.sub(r'</div>\s+<div', '</div><div', m.group(2).strip())}</div>"
            ),
            body,
            flags=re.S,
        )
    if lines:
        # one «Вывод» field per program: output, typed input and error together
        body = re.sub(
            r'</pre></div><div class="out out-lines"><span class="out-l">Вывод:</span><pre class="out-v">',
            "\n",
            body,
        )
    if "code-copy" in body:
        body += COPY_JS
    if lines:
        body += COLLAPSE_JS
    if runs:
        body += RUN_JS
    if sheets:
        body += sheet_scripts()
    # A step opens with a bold claim right after a horizontal rule; it becomes
    # an anchor for the step outline.
    outline: list[tuple[str, str]] = []

    def claim(m: re.Match) -> str:
        text = re.sub(r"<[^>]+>", "", m.group(1))
        anchor = f"s{len(outline) + 1}"
        outline.append((anchor, text))
        return f'<hr>\n<p class="claim" id="{anchor}"><strong>{m.group(1)}</strong>'

    body = re.sub(r"<hr />\s*<p><strong>(.*?)</strong>", claim, body, flags=re.S)
    body = body.replace("<table>", '<div class="tbl"><table>').replace("</table>", "</table></div>")
    return body, outline


def page(title, kicker, lead, nav, body, outline, before="", after="") -> str:
    toc = ""
    if outline:
        items = "".join(f'<li><a href="#{a}">{html.escape(t)}</a></li>' for a, t in outline)
        toc = (
            '<details class="toc"><summary>Шаги урока — '
            f"{len(outline)}</summary><ol>{items}</ol></details>"
        )
    return f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)}</title>
{FONTS}
<link rel="stylesheet" href="textbook.css">
</head>
<body>
<header class="bar"><div class="bar-in">
  <div class="brand">Демо-стенд уроков <small>прототип</small></div>
  <nav aria-label="Страницы стенда">{nav}</nav>
</div></header>
<div class="head"><div class="head-in">
  <p class="kicker">{kicker}</p>
  <h1>{html.escape(title)}</h1>
  <p class="lead">{lead}</p>
</div></div>
<main>
{before}
{toc}
{body}
{after}
</main>
</body>
</html>
"""


def stand_topics(stand: Path) -> list[int]:
    """Numbers of all topics of the stand, from their topic.json files."""
    return sorted(
        json.loads(p.read_text(encoding="utf-8"))["number"]
        for p in stand.glob("topic-*/topic.json")
    )


def stand_courses(stand: Path) -> list[dict]:
    """Mini-courses of the stand (``course-*/course.json``), the Python course first."""
    courses = [
        json.loads(p.read_text(encoding="utf-8")) for p in stand.glob("course-*/course.json")
    ]
    return sorted(courses, key=lambda c: (c["id"] != "python", c["id"]))


def nav_html(extra: list[tuple[str, str]], current: str, numbers: list[int], stand: Path) -> str:
    """Stand bar: overview, every topic, the course, extra pages of this page group, patterns."""
    items = [("index.html", "Обзор")]
    items += [(f"{k}-1.html", f"Тема {k}") for k in numbers]
    courses = stand_courses(stand)
    items += [(f"{c['prefix']}-01.html", c.get("nav", "Курс Python")) for c in courses]
    items += extra
    items.append(("patterns.html", "Паттерны"))
    group = current.split("-")[0]
    prefixes = {c["prefix"] for c in courses}
    out = []
    for href, label in items:
        here = href == current or (
            href.endswith("-01.html" if group in prefixes else "-1.html")
            and href.split("-")[0] == group
            and re.fullmatch(rf"{group}-\d+\.html", current)
        )
        attr = ' aria-current="page"' if here else ""
        out.append(f'<a href="{href}"{attr}>{html.escape(label)}</a>')
    return "".join(out)


def build_topic(topic_dir: Path) -> None:
    topic = json.loads((topic_dir / "topic.json").read_text(encoding="utf-8"))
    n = topic["number"]
    stand = topic_dir.parent
    numbers = stand_topics(stand)
    nav_extra = [(f"{n}-{p['name']}.html", p["nav"]) for p in topic.get("pages", [])]
    lessons = topic["subtopics"] + [dict(topic["final"], level="")]
    outs = [f"{n}-{i}.html" for i in range(1, len(lessons) + 1)]
    core_count = len(topic["subtopics"])

    def subnav(current: str) -> str:
        items = []
        for i, (lesson, out) in enumerate(zip(lessons, outs, strict=True), 1):
            number = str(i) if i <= core_count else "Итог"
            note = " · доп." if lesson.get("level") == "дополнительный" else ""
            attr = ' aria-current="page"' if out == current else ""
            items.append(
                f'<li><a href="{out}"{attr}><span class="num">{number}</span>'
                f"{html.escape(lesson['title'])}{note}</a></li>"
            )
        return (
            f'<nav class="subnav" aria-label="Подтемы задания {n}"><ol>'
            + "".join(items)
            + "</ol></nav>"
        )

    def pager(i: int) -> str:
        links = []
        if i > 0:
            links.append(
                f'<a class="prev" href="{outs[i - 1]}">← {html.escape(lessons[i - 1]["title"])}</a>'
            )
        if i < len(lessons) - 1:
            links.append(
                f'<a class="next" href="{outs[i + 1]}">{html.escape(lessons[i + 1]["title"])} →</a>'
            )
        return '<nav class="pager" aria-label="Соседние подтемы">' + "".join(links) + "</nav>"

    for i, (lesson, out) in enumerate(zip(lessons, outs, strict=True)):
        if i < core_count:
            kicker = f"Задание {n} · Подтема {i + 1} из {core_count} · {lesson['level']} уровень"
        else:
            kicker = f"Задание {n} · итоговая страница"
        body, outline = render((topic_dir / lesson["source"]).read_text(encoding="utf-8"))
        text = page(
            lesson["title"],
            kicker,
            lesson["lead"],
            nav_html(nav_extra, out, numbers, stand),
            body,
            outline,
            subnav(out),
            pager(i),
        )
        (stand / out).write_text(text, encoding="utf-8")
        print(f"{out}: {len(outline)} steps")

    for extra in topic.get("pages", []):
        out = f"{n}-{extra['name']}.html"
        body, _ = render((topic_dir / extra["source"]).read_text(encoding="utf-8"))
        text = page(
            extra["title"],
            extra["kicker"],
            extra["lead"],
            nav_html(nav_extra, out, numbers, stand),
            body,
            [],
        )
        (stand / out).write_text(text, encoding="utf-8")
        print(out)

    body, _ = render(PATTERNS.read_text(encoding="utf-8"))
    text = page(
        "Учебные паттерны",
        "Обязательный каталог приёмов подачи",
        "Скелет урока и приёмы, по которым строится каждая тема.",
        nav_html(nav_extra, "patterns.html", numbers, stand),
        body,
        [],
    )
    (stand / "patterns.html").write_text(text, encoding="utf-8")
    print("patterns.html")


def build_course(course_dir: Path) -> None:
    """A mini-course: modules of one-page lessons ``py-01.html`` …, plus extra pages."""
    course = json.loads((course_dir / "course.json").read_text(encoding="utf-8"))
    stand = course_dir.parent
    numbers = stand_topics(stand)
    prefix = course["prefix"]
    nav_extra = [(f"{prefix}-{p['name']}.html", p["nav"]) for p in course.get("pages", [])]
    lessons = [(m, lesson) for m in course["modules"] for lesson in m["lessons"]]
    outs = [f"{prefix}-{i:02d}.html" for i in range(1, len(lessons) + 1)]

    def subnav(current: str) -> str:
        """Lessons of the current module, other modules folded under one summary."""
        here = outs.index(current)
        first, rows, items, title = 0, [], [], ""
        for module in course["modules"]:
            last = first + len(module["lessons"])
            span = f"уроки {first + 1}–{last}"
            if first <= here < last:
                title = f"{module['title']} · {span} из {len(lessons)}"
                for i in range(first, last):
                    lesson = lessons[i][1]
                    note = " · доп." if lesson["level"] == "дополнительный" else ""
                    attr = ' aria-current="page"' if i == here else ""
                    items.append(
                        f'<li><a href="{outs[i]}"{attr}><span class="num">{i + 1}</span>'
                        f"{html.escape(lesson['title'])}{note}</a></li>"
                    )
            rows.append(
                f'<li><a href="{outs[first]}">{html.escape(module["title"])}'
                f' <span class="num">{span}</span></a></li>'
            )
            first = last
        return (
            '<nav class="subnav course" aria-label="Уроки курса">'
            f'<p class="mod-t">{html.escape(title)}</p><ol>{"".join(items)}</ol>'
            f'<details class="mods"><summary>Все модули курса</summary><ol>{"".join(rows)}</ol>'
            "</details></nav>"
        )

    def pager(i: int) -> str:
        links = []
        if i > 0:
            title = html.escape(lessons[i - 1][1]["title"])
            links.append(f'<a class="prev" href="{outs[i - 1]}">← {title}</a>')
        if i < len(lessons) - 1:
            title = html.escape(lessons[i + 1][1]["title"])
            links.append(f'<a class="next" href="{outs[i + 1]}">{title} →</a>')
        return '<nav class="pager" aria-label="Соседние уроки">' + "".join(links) + "</nav>"

    for i, ((module, lesson), out) in enumerate(zip(lessons, outs, strict=True)):
        kicker = (
            f"{course['title']} · {module['title']} · Урок {i + 1} из {len(lessons)}"
            f" · {lesson['level']} уровень"
        )
        body, outline = render(
            (course_dir / lesson["source"]).read_text(encoding="utf-8"), lines=True
        )
        text = page(
            lesson["title"],
            kicker,
            lesson["lead"],
            nav_html(nav_extra, out, numbers, stand),
            body,
            outline,
            subnav(out),
            pager(i),
        )
        (stand / out).write_text(text, encoding="utf-8")
        print(f"{out}: {len(outline)} steps")

    for page_def in course.get("pages", []):
        out = f"{prefix}-{page_def['name']}.html"
        body, _ = render((course_dir / page_def["source"]).read_text(encoding="utf-8"), lines=True)
        text = page(
            page_def["title"],
            page_def["kicker"],
            page_def["lead"],
            nav_html(nav_extra, out, numbers, stand),
            body,
            [],
        )
        (stand / out).write_text(text, encoding="utf-8")
        print(out)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    folder = Path(sys.argv[1]).resolve()
    if (folder / "course.json").exists():
        build_course(folder)
    else:
        build_topic(folder)
