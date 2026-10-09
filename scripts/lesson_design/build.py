"""Build the lesson-design stand: one topic folder -> static HTML pages.

Usage (from the repository root):

    uv run --no-project --with markdown python -I scripts/lesson_design/build.py \
        content/lesson-design/topic-25

The topic folder holds ``topic.json`` (see docs/runbooks/lesson-pipeline.md),
the subtopic Markdown files and the extra pages. Pages are written next to the
topic folder, into the stand root that also holds ``index.html`` and
``textbook.css``. The pattern catalogue is rendered from
``docs/runbooks/lesson-patterns.md`` into ``patterns.html``.
"""

import ast
import html
import json
import re
import sys
from pathlib import Path

import markdown

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
sys.path.insert(0, str(HERE))
from figures import FIGURES, PAGE_SCRIPTS  # noqa: E402
from terms import TERMS  # noqa: E402

PATTERNS = REPO / "docs" / "runbooks" / "lesson-patterns.md"

FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
    "family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600"
    '&display=swap">'
)

KEYWORDS = set(
    "and as break continue def elif else for if in is not or return "
    "while True False None import from".split()
)
BUILTINS = {"print", "range", "len", "sum", "abs", "int", "sorted", "min", "max"}
TOKEN = re.compile(
    r"(#.*$)|(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*')|(\b\d[\d_]*\b)"
    r"|(\b[A-Za-z_]\w*\b)",
    re.M,
)
FIGURE_CALL = re.compile(r"%%(\w+)\((.*?)\)%%")
PICK_BLOCK = re.compile(r"^:::(pick|pick-tokens) ([^\n]+)\n(.*?)^:::$", re.M | re.S)
TERM = re.compile(r"\{\{(\w+)\|(.+?)\}\}")
COURSE = "http://localhost:8080/courses/python/"


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
        cells = [c.strip() for c in line.lstrip("- ").split("|")]
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


def term(m: re.Match) -> str:
    key, label = m.group(1), m.group(2)
    if key not in TERMS:
        raise SystemExit(f"Unknown term {key!r}; add it to terms.TERMS")
    title, body, slug, lesson = TERMS[key]
    _term_count[key] = _term_count.get(key, 0) + 1
    pid = f"term-{key}-{_term_count[key]}"
    return (
        f'<button type="button" class="term" data-term popovertarget="{pid}" '
        f'aria-expanded="false">{label}</button>'
        f'<span id="{pid}" popover class="pop" role="dialog" aria-label="{html.escape(title)}">'
        f'<b class="pop-t">{html.escape(title)}</b><span class="pop-b">{body}</span>'
        f'<span class="pop-c">Курс Python: {html.escape(lesson)}</span>'
        f'<span class="pop-a"><a href="{COURSE}{slug}">Читать урок →</a>'
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


def render(md_text: str) -> tuple[str, list[tuple[str, str]]]:
    md_text = FIGURE_CALL.sub(call_figure, md_text)
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
        if lang == "output":
            # Output lines joined in one row, under the code they come from.
            shown = ", ".join(code.rstrip("\n").split("\n"))
            return (
                '<div class="out"><span class="out-l">Вывод</span>'
                f'<span class="out-v">{html.escape(shown)}</span></div>'
            )
        if "." in lang:
            # lines of a data file: the fence names the file (```23.txt)
            return (
                f'<pre class="code text" data-file="{html.escape(lang)}">'
                f"<code>{html.escape(code)}</code></pre>"
            )
        inner = highlight_python(code) if lang == "python" else html.escape(code)
        return f'<pre class="code {lang}"><code>{inner}</code></pre>'

    body = re.sub(
        r'<pre><code class="language-([\w.+-]+)">(.*?)</code></pre>',
        code_block,
        body,
        flags=re.S,
    )
    body = re.sub(
        r'(<pre class="code python">(?:(?!</pre>).)*</pre>)\s*(<div class="out">.*?</div>)',
        r'<div class="code-box">\1\2</div>',
        body,
        flags=re.S,
    )
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


def nav_html(topic: dict, current: str, numbers: list[int]) -> str:
    """Stand bar: overview, every topic, extra pages of this topic, patterns."""
    n = topic["number"]
    items = [("index.html", "Обзор")]
    items += [(f"{k}-1.html", f"Тема {k}") for k in numbers]
    items += [(f"{n}-{p['name']}.html", p["nav"]) for p in topic.get("pages", [])]
    items.append(("patterns.html", "Паттерны"))
    out = []
    for href, label in items:
        here = href == current or (
            href == f"{n}-1.html" and re.fullmatch(rf"{n}-\d+\.html", current)
        )
        attr = ' aria-current="page"' if here else ""
        out.append(f'<a href="{href}"{attr}>{html.escape(label)}</a>')
    return "".join(out)


def build_topic(topic_dir: Path) -> None:
    topic = json.loads((topic_dir / "topic.json").read_text(encoding="utf-8"))
    n = topic["number"]
    stand = topic_dir.parent
    numbers = stand_topics(stand)
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
            nav_html(topic, out, numbers),
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
            nav_html(topic, out, numbers),
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
        nav_html(topic, "patterns.html", numbers),
        body,
        [],
    )
    (stand / "patterns.html").write_text(text, encoding="utf-8")
    print("patterns.html")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    build_topic(Path(sys.argv[1]).resolve())
