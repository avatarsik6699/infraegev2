"""Figure builders for lesson pages: inline SVG drawn to scale from code."""

import html
import json
import re
from pathlib import Path

INK = "#17191e"
MUTED = "#4d535e"
FAINT = "#d9d9d4"
WASH = "#f3f3f1"  # neutral wash: the site has no blue fills in figures
ACCENT = "#ff6a00"  # one accent per figure, strokes and text only
# A course lesson's figures take its course accent (Change 197): the action shade of the
# course tone, readable as text (≥5:1). `tone=None` keeps the orange of the topics.
TONES = {"python": "#3f6aa6"}


def accent_of(tone: str | None) -> str:
    return TONES[tone] if tone else ACCENT


SANS = "Onest, system-ui, sans-serif"


def ru_count(n: int, one: str, few: str, many: str) -> str:
    """«21 клетка», «3 полные порции», «5 полных порций»."""
    tail = n % 100
    if tail % 10 == 1 and tail != 11:
        word = one
    elif 2 <= tail % 10 <= 4 and not 12 <= tail <= 14:
        word = few
    else:
        word = many
    return f"{n} {word}"


CELLS = ("клетка", "клетки", "клеток")
PORTIONS = ("полная порция", "полные порции", "полных порций")


def _text(x, y, s, size: float = 15, color=INK, anchor="start", weight=400) -> str:
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{SANS}" font-size="{size}" '
        f'font-weight="{weight}" fill="{color}" text-anchor="{anchor}" '
        f'style="font-variant-numeric:tabular-nums">{html.escape(s)}</text>'
    )


def _bracket(x1, x2, y, color=MUTED) -> str:
    return (
        f'<path d="M {x1} {y} v 6 H {x2} v -6" fill="none" stroke="{color}" '
        f'stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>'
    )


def rectangles_svg(n: int = 36, cell: int = 10) -> str:
    """Divisor pairs of n as rectangles of n cells; the square is accented."""
    pairs = [(d, n // d) for d in range(1, int(n**0.5) + 1) if n % d == 0]
    left, top, gap = 20, 12, 18
    out, y = [], top
    for rows, cols in pairs:
        square = rows == cols
        w, h = cols * cell, rows * cell
        for c in range(1, cols):
            out.append(
                f'<line x1="{left + c * cell}" y1="{y}" x2="{left + c * cell}" '
                f'y2="{y + h}" stroke="{FAINT}"/>'
            )
        for rr in range(1, rows):
            out.append(
                f'<line x1="{left}" y1="{y + rr * cell}" x2="{left + w}" '
                f'y2="{y + rr * cell}" stroke="{FAINT}"/>'
            )
        out.append(
            f'<rect x="{left}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
            f'stroke="{ACCENT if square else INK}" stroke-width="{2 if square else 1.5}"/>'
        )
        label = f"{rows} · {cols} = {n}"
        tx = left + 36 * cell + 28
        out.append(_text(tx, y + h / 2 + 5, label, 15, INK))
        if square:
            out.append(_text(tx + 104, y + h / 2 + 5, "квадрат", 15, ACCENT, weight=600))
        y += h + gap
    return (
        f'<svg viewBox="0 0 660 {y - gap + top}" role="img" '
        f'aria-label="Прямоугольники из {n} клеток">' + "".join(out) + "</svg>"
    )


def _line_frame(n, upto, found, miss) -> str:
    w, left, right, base = 660, 28, 28, 150
    x = lambda v: left + (v - 1) / (n - 1) * (w - left - right)  # noqa: E731
    root = n**0.5
    g = [f'<svg viewBox="0 0 {w} 196" aria-hidden="true">']
    g.append(
        f'<line x1="{left}" y1="{base}" x2="{w - right}" y2="{base}" '
        f'stroke="{INK}" stroke-width="1.5"/>'
    )
    for v in range(1, n + 1):
        g.append(
            f'<line x1="{x(v):.1f}" y1="{base - 3}" x2="{x(v):.1f}" y2="{base + 3}" stroke="{FAINT}"/>'
        )
    g.append(
        f'<line x1="{x(root):.1f}" y1="30" x2="{x(root):.1f}" y2="{base + 6}" '
        f'stroke="{MUTED}" stroke-dasharray="4 4"/>'
    )
    g.append(_text(x(root) + 8, 44, f"√{n} = {int(root)}", 15, MUTED))
    for a, b in found:
        if a == b:
            g.append(
                f'<circle cx="{x(a):.1f}" cy="{base}" r="9" fill="#fff" stroke="{INK}" stroke-width="1.5"/>'
            )
            continue
        rx = (x(b) - x(a)) / 2
        ry = min(96, 16 + rx * 0.4)
        g.append(
            f'<path d="M {x(a):.1f} {base} A {rx:.1f} {ry:.1f} 0 0 1 {x(b):.1f} {base}" '
            f'fill="none" stroke="{INK}" stroke-width="1.5"/>'
        )
    for v in miss:
        g.append(_text(x(v), base + 28, "×", 15, MUTED, "middle"))
    for v in sorted({v for p in found for v in p}):
        g.append(f'<circle cx="{x(v):.1f}" cy="{base}" r="3.5" fill="{INK}"/>')
        g.append(_text(x(v), base + 28, str(v), 14, INK, "middle"))
    if upto is not None:
        cx = x(min(upto, n))
        g.append(
            f'<circle cx="{cx:.1f}" cy="{base}" r="13" fill="none" stroke="{ACCENT}" stroke-width="2"/>'
        )
        g.append(_text(cx, 18, f"d = {upto}", 15, ACCENT, "middle", 600))
    g.append("</svg>")
    return "".join(g)


def search_stepper(n: int = 36) -> str:
    """Frame-by-frame search of divisor pairs up to the square root."""
    return _stepper(search_frames(n))


def search_frames(n: int = 36) -> list[tuple[str, str]]:
    frames, found, miss, d = [], [], [], 1
    while d * d <= n:
        if n % d == 0:
            q = n // d
            found.append((d, q))
            caption = (
                f"d = {d}: {n} = {d} · {d}. Пара из одного числа — делитель {d} записываем один раз."
                if d == q
                else f"d = {d}: {n} % {d} = 0. Сразу два делителя — {d} и {n} // {d} = {q}."
            )
        else:
            miss.append(d)
            caption = f"d = {d}: {n} % {d} = {n % d}. Не делитель, пары нет."
        frames.append((_line_frame(n, d, list(found), list(miss)), caption))
        d += 1
    divisors = ", ".join(map(str, sorted({v for p in found for v in p})))
    frames.append(
        (
            _line_frame(n, None, found, miss),
            f"d = {d}: {d} · {d} = {d * d} больше {n} — стоп. Делители: {divisors}.",
        )
    )
    return frames


STEPPER_JS = r"""<script>
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PAUSE = '<path d="M9 5.5v13M15 5.5v13"/>';
  document.querySelectorAll("[data-stepper]").forEach(function (fig) {
    var frames = [].slice.call(fig.querySelectorAll(".frame"));
    var note = fig.querySelector(".st-note"), count = fig.querySelector(".st-count");
    var line = fig.querySelector(".st-line"), play = fig.querySelector(".st-play");
    var prev = fig.querySelector(".st-prev"), next = fig.querySelector(".st-next");
    var last = frames.length - 1, i = 0, timer = null, PLAY = play.innerHTML;
    if (reduce) play.hidden = true;
    function show(k) {
      i = Math.max(0, Math.min(last, k));
      frames.forEach(function (f, j) { f.hidden = j !== i; });
      note.textContent = frames[i].dataset.caption;
      count.textContent = (i + 1) + " / " + frames.length;
      line.value = i; line.style.setProperty("--p", (100 * i / last) + "%");
      prev.disabled = i === 0; next.disabled = i === last;
    }
    function stop() { clearTimeout(timer); timer = null; play.innerHTML = PLAY; play.setAttribute("aria-label", "Воспроизвести"); }
    function tick() { if (i >= last) { stop(); return; } show(i + 1); timer = setTimeout(tick, 1600); }
    prev.onclick = function () { stop(); show(i - 1); };
    next.onclick = function () { stop(); show(i + 1); };
    line.oninput = function () { stop(); show(+line.value); };
    play.onclick = function () {
      if (timer) { stop(); return; }
      if (i === last) show(0);
      play.innerHTML = PLAY.replace(/<path[^>]*>/, PAUSE); play.setAttribute("aria-label", "Пауза");
      timer = setTimeout(tick, 1600);
    };
    fig.querySelector(".st-ctl").hidden = false; note.hidden = false;
    fig.querySelector(".st-steps").hidden = true;
    show(0);
  });
})();
</script>"""


def cover_svg(side=6, rows=7, cols=8, cell=20) -> str:
    left, top = 20, 12
    out = []
    for r in range(rows):
        for c in range(cols):
            inside = r >= rows - side and c < side
            out.append(
                f'<rect x="{left + c * cell}" y="{top + r * cell}" width="{cell}" '
                f'height="{cell}" fill="{WASH if inside else "#fff"}" stroke="{FAINT}"/>'
            )
    out.append(
        f'<rect x="{left}" y="{top + (rows - side) * cell}" width="{side * cell}" '
        f'height="{side * cell}" fill="none" stroke="{INK}" stroke-width="2"/>'
        f'<rect x="{left}" y="{top}" width="{cols * cell}" height="{rows * cell}" '
        f'fill="none" stroke="{ACCENT}" stroke-width="2" stroke-dasharray="7 5"/>'
    )
    tx = left + cols * cell + 32
    out.append(_text(tx, top + 40, f"{side} · {side} = {side * side}", 16, INK, weight=600))
    out.append(_text(tx, top + 64, "уже все клетки числа 36", 15, MUTED))
    out.append(_text(tx, top + 104, f"{rows} · {cols} = {rows * cols}", 16, ACCENT, weight=600))
    out.append(_text(tx, top + 128, "квадрат и ещё клетки вокруг", 15, MUTED))
    return (
        f'<svg viewBox="0 0 660 {top * 2 + rows * cell}" role="img" aria-label='
        f'"Прямоугольник {rows} на {cols} накрывает квадрат {side} на {side}">'
        + "".join(out)
        + "</svg>"
    )


# ---------------------------------------------------------------- review set


def remainder_svg(n: int = 17, d: int = 5, cell: int = 32) -> str:
    """n cells in portions of d on one row: full portions, then the rest."""
    q, r = divmod(n, d)
    gap, left, top = 18, 20, 16
    out = []
    x = left
    for k in range(q + (1 if r else 0)):
        size = d if k < q else r
        color = INK if k < q else ACCENT
        for c in range(size):
            out.append(
                f'<rect x="{x + c * cell + 1}" y="{top}" width="{cell - 2}" '
                f'height="{cell - 2}" rx="4" fill="#fff" stroke="{color}" '
                f'stroke-width="{1.5 if k < q else 2}"/>'
            )
        w = size * cell
        out.append(_bracket(x + 2, x + w - 2, top + cell + 8, color if k == q else MUTED))
        label = f"{d}" if k < q else f"{r}"
        out.append(_text(x + w / 2, top + cell + 34, label, 15, color, "middle"))
        x += w + gap
    y = top + cell + 70
    out.append(_text(left, y, f"{n} // {d} = {q}", 16, INK, weight=600))
    out.append(_text(left + 104, y, "— полные порции", 15, MUTED))
    out.append(_text(640, y, "— остаток", 15, MUTED, "end"))
    out.append(_text(640 - 76, y, f"{n} % {d} = {r}", 16, ACCENT, "end", 600))
    h = top + cell + 88
    return (
        f'<svg viewBox="0 0 660 {h}" role="img" aria-label="{ru_count(n, *CELLS)} '
        f'порциями по {d}: {ru_count(q, *PORTIONS)} и {r} в остатке">' + "".join(out) + "</svg>"
    )


# One caption for the stand widget and the site RemainderExplorer.
REMAINDER_CAPTION = (
    "Клетки числа n разложены порциями по d: полные порции — частное `n // d`, "
    "клетки, которым не хватило на порцию, — остаток `n % d`. Меняйте числа или "
    "выберите пример."
)


def remainder_widget(n: int = 17, d: int = 5, presets=None) -> str:
    """remainder_svg with n and d controls and presets; static without JS."""

    def stepper_ctl(key, value, name):
        return (
            f'<span class="num-in"><span>{key}</span>'
            f'<button type="button" class="ib" data-k="{key}" data-s="-1" '
            f'aria-label="Уменьшить {name}">−</button>'
            f'<output data-v="{key}">{value}</output>'
            f'<button type="button" class="ib" data-k="{key}" data-s="1" '
            f'aria-label="Увеличить {name}">+</button></span>'
        )

    presets = "".join(
        f'<button type="button" class="chip" data-n="{a}" data-d="{b}">{a} и {b}</button>'
        for a, b in (presets or [(17, 5), (20, 5), (3, 7)])
    )
    return (
        f'<figure class="widget" data-remainder data-n="{n}" data-d="{d}">'
        f'<div class="plate" data-svg>{remainder_svg(n, d)}</div>'
        '<div class="rem-ctl" hidden>'
        + stepper_ctl("n", n, "число n")
        + stepper_ctl("d", d, "делитель d")
        + f'<span class="presets">{presets}</span></div>'
        f"<figcaption>{_inline(REMAINDER_CAPTION)}</figcaption></figure>"
    )


REMAINDER_JS = r"""<script>
(function () {
  var NS = "http://www.w3.org/2000/svg", INK = "#17191e", MU = "#4d535e", OR = "#ff6a00";
  function el(tag, a, text) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (text != null) e.textContent = text; return e; }
  function txt(x, y, s, size, color, anchor, weight) {
    return el("text", { x: x, y: y, "font-family": "Onest, system-ui, sans-serif", "font-size": size, fill: color,
      "text-anchor": anchor || "start", "font-weight": weight || 400, style: "font-variant-numeric:tabular-nums" }, s);
  }
  function ru(n, f) { var t = n % 100, u = t % 10; return n + " " + (u === 1 && t !== 11 ? f[0] : u >= 2 && u <= 4 && (t < 12 || t > 14) ? f[1] : f[2]); }
  // Same drawing as figures.remainder_svg, with portions wrapping to new rows.
  function draw(n, d) {
    var q = Math.floor(n / d), r = n % d, cell = 32, gap = 18, left = 20, top = 16, rowH = cell + 46;
    var parts = []; for (var k = 0; k < q; k++) parts.push(d); if (r) parts.push(r);
    var svg = el("svg", { role: "img", "aria-label": ru(n, ["клетка", "клетки", "клеток"]) + " порциями по " + d + ": " + ru(q, ["полная порция", "полные порции", "полных порций"]) + " и " + r + " в остатке" });
    var x = left, row = 0;
    parts.forEach(function (size, k) {
      var w = size * cell, rest = k === q, color = rest ? OR : INK;
      if (x + w > 640 && x > left) { x = left; row += 1; }
      var y = top + row * rowH;
      for (var c = 0; c < size; c++) svg.appendChild(el("rect", { x: x + c * cell + 1, y: y, width: cell - 2, height: cell - 2, rx: 4, fill: "#fff", stroke: color, "stroke-width": rest ? 2 : 1.5 }));
      svg.appendChild(el("path", { d: "M " + (x + 2) + " " + (y + cell + 8) + " v 6 H " + (x + w - 2) + " v -6", fill: "none", stroke: rest ? OR : MU, "stroke-width": 1.25, "stroke-linecap": "round", "stroke-linejoin": "round" }));
      svg.appendChild(txt(x + w / 2, y + cell + 34, String(size), 15, color, "middle"));
      x += w + gap;
    });
    var y = top + row * rowH + cell + 70;
    svg.appendChild(txt(left, y, n + " // " + d + " = " + q, 16, INK, "start", 600));
    svg.appendChild(txt(left + 104, y, "— полные порции", 15, MU));
    svg.appendChild(txt(640, y, "— остаток", 15, MU, "end"));
    svg.appendChild(txt(564, y, n + " % " + d + " = " + r, 16, OR, "end", 600));
    svg.setAttribute("viewBox", "0 0 660 " + (y + 18));
    return svg;
  }
  document.querySelectorAll("[data-remainder]").forEach(function (fig) {
    var v = { n: +fig.dataset.n, d: +fig.dataset.d }, lim = { n: [1, 40], d: [2, 9] };
    var plate = fig.querySelector("[data-svg]");
    function render() {
      plate.replaceChildren(draw(v.n, v.d));
      fig.querySelector('[data-v="n"]').textContent = v.n; fig.querySelector('[data-v="d"]').textContent = v.d;
      fig.querySelectorAll(".presets .chip").forEach(function (c) { c.setAttribute("aria-pressed", +c.dataset.n === v.n && +c.dataset.d === v.d); });
    }
    fig.querySelectorAll("[data-k]").forEach(function (b) {
      b.onclick = function () { var k = b.dataset.k; v[k] = Math.max(lim[k][0], Math.min(lim[k][1], v[k] + +b.dataset.s)); render(); };
    });
    fig.querySelectorAll(".presets .chip").forEach(function (c) { c.onclick = function () { v.n = +c.dataset.n; v.d = +c.dataset.d; render(); }; });
    fig.querySelector(".rem-ctl").hidden = false; render();
  });
})();
</script>"""


STAND = Path(__file__).resolve().parents[2] / "content" / "lesson-design"


def _inline(text: str) -> str:
    """`code` in cheat-sheet rows; everything else is escaped text."""
    parts = re.split(r"(`[^`]+`)", text)
    return "".join(
        f"<code>{html.escape(p[1:-1])}</code>" if p.startswith("`") else html.escape(p)
        for p in parts
    )


def cheatsheet(source: str) -> str:
    """The whole topic on one sheet: solving order, one block per subtopic
    with its key code and topic-wide sections (rows, numbered steps, note).
    HTML rather than SVG so it reflows to one column on a phone. Group titles
    link to the stand pages of the topic: topic-NN/… → NN-<page>.html."""
    path = STAND / source
    data = json.loads(path.read_text(encoding="utf-8"))
    prefix = path.parent.name.removeprefix("topic-")
    flow = "".join(
        f"<li><b>{html.escape(name)}</b><span>{html.escape(note)}</span></li>"
        for name, note in data["flow"]
    )

    def rows(items, columns=False) -> str:
        cols = " data-columns" if columns else ""
        return (
            f"<ul{cols}>"
            + "".join(
                f"<li><span class='cs-k'>{_inline(k)}</span>"
                f"<span class='cs-v'>{_inline(v)}</span></li>"
                for k, v in items
            )
            + "</ul>"
        )

    groups = []
    for g in data["groups"]:
        level = f"<small>{html.escape(g['level'])}</small>" if g.get("level") else ""
        groups.append(
            f'<section class="cs-group"><h3><a href="{prefix}-{g["page"]}.html">'
            f'<span class="cs-n">{g["page"]}</span>{html.escape(g["title"])}</a>{level}</h3>'
            f"{rows(g['items'])}</section>"
        )
    sections = []
    for sec in data.get("sections", []):
        body = rows(sec["rows"], sec.get("columns", False)) if "rows" in sec else ""
        if "steps" in sec:
            body += (
                '<ol class="cs-checks">'
                + "".join(f"<li>{_inline(c)}</li>" for c in sec["steps"])
                + "</ol>"
            )
        if sec.get("note"):
            body += f'<p class="cs-note">{_inline(sec["note"])}</p>'
        wide = " data-wide" if sec.get("columns") else ""
        sections.append(
            f'<section class="cs-group"{wide}><h3>{html.escape(sec["title"])}</h3>{body}</section>'
        )
    foot = f'<div class="cs-foot">{"".join(sections)}</div>' if sections else ""
    return (
        f'<figure class="cheatsheet" data-cheatsheet aria-label="{html.escape(data["title"])}">'
        f'<ol class="cs-flow">{flow}</ol>'
        f'<div class="cs-grid">{"".join(groups)}</div>{foot}'
        f"<figcaption>{_inline(data['caption'])}</figcaption></figure>"
    )


def overlap_svg(s: str = "7777", sub: str = "77", cell: int = 34) -> str:
    """All start positions of sub in s versus what str.count finds."""
    left, top = 16, 22
    starts = [i for i in range(len(s) - len(sub) + 1) if s.startswith(sub, i)]
    counted, i = [], 0
    while True:
        j = s.find(sub, i)
        if j < 0:
            break
        counted.append(j)
        i = j + len(sub)
    rows = len(starts)
    h = top + cell + 14 + rows * 26 + 20
    out = [f'<svg viewBox="0 0 660 {h}" role="img" aria-label="Вхождения {sub} в {s}">']
    for k, ch in enumerate(s):
        out.append(
            f'<rect x="{left + k * cell}" y="{top}" width="{cell}" height="{cell}" '
            f'fill="#ffffff" stroke="{INK}"/>'
            f'<text x="{left + k * cell + cell / 2}" y="{top + cell / 2 + 6}" '
            f'text-anchor="middle" font-family="{SANS}" font-size="17" '
            f'fill="{INK}">{ch}</text>'
            f'<text x="{left + k * cell + cell / 2}" y="{top - 6}" text-anchor="middle" '
            f'font-family="{SANS}" font-size="11" fill="{MUTED}">{k}</text>'
        )
    y = top + cell + 14
    for st in starts:
        mine = st in counted
        x1, x2 = left + st * cell + 4, left + (st + len(sub)) * cell - 4
        out.append(
            f'<line x1="{x1}" y1="{y + 8}" x2="{x2}" y2="{y + 8}" '
            f'stroke="{INK if mine else MUTED}" stroke-width="{4 if mine else 2}"'
            f"{'' if mine else ' stroke-dasharray="5 4"'}/>"
        )
        note = "count находит" if mine else "count пропускает: перекрывается с найденным"
        out.append(
            f'<text x="{left + len(s) * cell + 18}" y="{y + 13}" font-family="{SANS}" '
            f'font-size="13" fill="{INK if mine else MUTED}">с позиции {st}: {note}</text>'
        )
        y += 26
    out.append("</svg>")
    return "".join(out)


def arcs_svg(
    n: int,
    *,
    mark_even: bool = False,
    emphasize=None,
    mute=None,
    caption_root: bool = True,
    width: int = 660,
    ordinal: bool = False,
) -> str:
    """Divisor pairs of n as arcs. Optionally mark even divisors (filled) vs
    odd (hollow), emphasize one pair and fade another."""
    left, right, base = 24, 24, 150
    root = n**0.5
    pairs = [(d, n // d) for d in range(1, int(root) + 1) if n % d == 0]
    if ordinal:
        ds = sorted({v for p in pairs for v in p})
        step = (width - left - right) / (len(ds) - 1)

        def x(v):  # pyright: ignore[reportRedeclaration]
            if v in ds:
                return left + ds.index(v) * step
            lo = max(i for i, dv in enumerate(ds) if dv < v)
            frac = (v - ds[lo]) / (ds[lo + 1] - ds[lo])
            return left + (lo + frac) * step
    else:

        def x(v):
            return left + (v - 1) / (n - 1) * (width - left - right)

    g = [
        f'<svg viewBox="0 0 {width} 196" role="img" aria-label="Пары делителей {n}">',
        f'<line x1="{left}" y1="{base}" x2="{width - right}" y2="{base}" '
        f'stroke="{INK}" stroke-width="1.5"/>',
    ]
    if caption_root:
        exact = root == int(root)
        lab = f"√{n} = {int(root)}" if exact else f"√{n} ≈ {root:.2f}".replace(".", ",")
        g.append(
            f'<line x1="{x(root):.1f}" y1="14" x2="{x(root):.1f}" y2="{base + 6}" '
            f'stroke="{MUTED}" stroke-dasharray="4 4"/>'
            f'<text x="{x(root) + 6:.1f}" y="28" font-family="{SANS}" '
            f'font-size="15" fill="{MUTED}">{lab}</text>'
        )
    for a, b in pairs:
        strong = emphasize == (a, b)
        faded = mute == (a, b)
        stroke = FAINT if faded else ACCENT if strong else INK
        sw = 2.5 if strong else 1.5
        dash = ' stroke-dasharray="5 4"' if faded else ""
        if a == b:
            g.append(
                f'<circle cx="{x(a):.1f}" cy="{base}" r="9" fill="{WASH}" '
                f'stroke="{INK}" stroke-width="1.5"/>'
            )
            continue
        rx = (x(b) - x(a)) / 2
        ry = min(104, 18 + rx * 0.42)
        g.append(
            f'<path d="M {x(a):.1f} {base} A {rx:.1f} {ry:.1f} 0 0 1 {x(b):.1f} {base}" '
            f'fill="none" stroke="{stroke}" stroke-width="{sw}"{dash}/>'
        )
    for v in sorted({v for p in pairs for v in p}):
        hollow = mark_even and v % 2
        g.append(
            f'<circle cx="{x(v):.1f}" cy="{base}" r="{5 if mark_even else 3.5}" '
            f'fill="{"#ffffff" if hollow else INK}" stroke="{INK}" stroke-width="1.5"/>'
            f'<text x="{x(v):.1f}" y="{base + 26}" text-anchor="middle" '
            f'font-family="{SANS}" font-size="13" fill="{INK}">{v}</text>'
        )
    g.append("</svg>")
    return "".join(g)


def two_arcs_figure(a: int, b: int) -> str:
    """Divisor arcs of a and b side by side in one SVG (one file on the site)."""
    import re

    parts, height = [], 0
    for offset, n in ((0, a), (330, b)):
        svg = arcs_svg(n, width=330, ordinal=True)
        size = re.match(r'<svg viewBox="0 0 [\d.]+ ([\d.]+)"', svg)
        assert size
        h = int(float(size.group(1)))
        height = max(height, h)
        parts.append(
            re.sub(
                r"^<svg [^>]*>",
                f'<svg x="{offset}" y="0" width="330" height="{h}" viewBox="0 0 330 {h}">',
                svg,
            )
        )
    return (
        f'<svg viewBox="0 0 660 {height}" role="img" '
        f'aria-label="Пары делителей {a} и {b}">' + "".join(parts) + "</svg>"
    )


def ladder_svg(n: int = 360) -> str:
    """School-style division ladder: number on the left, prime on the right."""
    rows, m, d = [], n, 2
    while d * d <= m:
        while m % d == 0:
            rows.append((m, d))
            m //= d
        d += 1
    if m > 1:
        rows.append((m, m))
        m = 1
    rows.append((1, None))
    step, top, xl, xr = 30, 26, 150, 180
    h = top + len(rows) * step + 10
    out = [
        f'<svg viewBox="0 0 660 {h}" role="img" aria-label="Разложение {n} лесенкой">',
        f'<line x1="{xl + 14}" y1="{top - 18}" x2="{xl + 14}" '
        f'y2="{top + (len(rows) - 1) * step + 8}" stroke="{INK}" stroke-width="1.5"/>',
    ]
    for i, (val, p) in enumerate(rows):
        y = top + i * step
        out.append(
            f'<text x="{xl}" y="{y}" text-anchor="end" font-family="{SANS}" '
            f'font-size="17" fill="{INK}">{val}</text>'
        )
        if p:
            out.append(
                f'<text x="{xr + 12}" y="{y}" font-family="{SANS}" font-size="17" '
                f'fill="{INK}">{p}</text>'
                f'<text x="{xr + 60}" y="{y}" font-family="{SANS}" '
                f'font-size="15" fill="{MUTED}">{val} : {p} = {val // p}</text>'
            )
    primes = [p for _, p in rows if p]
    out.append(
        f'<text x="{xr + 190}" y="{top + step * 2}" font-family="{SANS}" '
        f'font-size="15" fill="{INK}">{n} = {" · ".join(map(str, primes))}</text>'
    )
    out.append("</svg>")
    return "".join(out)


def _factor_frame(m0, m, d, factors, note_cond) -> str:
    out = ['<svg viewBox="0 0 660 170" role="img" aria-hidden="true">']
    box = lambda x, label, val, stroke: (  # noqa: E731
        f'<rect x="{x}" y="14" width="190" height="64" rx="10" fill="#ffffff" '
        f'stroke="{stroke}" stroke-width="1.5"/>'
        f'<text x="{x + 14}" y="38" font-family="{SANS}" font-size="13" '
        f'fill="{MUTED}">{label}</text>'
        f'<text x="{x + 14}" y="66" font-family="{SANS}" font-size="24" '
        f'fill="{INK}">{val}</text>'
    )
    out.append(box(16, "m — что осталось", m, INK))
    out.append(box(226, "d — кандидат", d if d else "—", ACCENT))
    out.append(
        f'<text x="436" y="40" font-family="{SANS}" font-size="14" '
        f'fill="{INK}">{note_cond[0]}</text>'
        f'<text x="436" y="64" font-family="{SANS}" font-size="14" '
        f'fill="{MUTED}">{note_cond[1]}</text>'
    )
    chips = " · ".join(map(str, factors)) if factors else "пока пусто"
    out.append(
        f'<text x="16" y="116" font-family="{SANS}" font-size="13" '
        f'fill="{MUTED}">множители</text>'
        f'<text x="16" y="146" font-family="{SANS}" font-size="20" '
        f'fill="{INK}">{m0} = {chips}{"" if m == 1 or not factors else " · …"}</text>'
    )
    out.append("</svg>")
    return "".join(out)


def factor_stepper(n: int = 1050) -> str:
    """prime_factors(n) frame by frame: why while, why composite d never
    divides, why the remainder after the loop is prime."""
    return _stepper(factor_frames(n))


def factor_frames(n: int = 1050) -> list[tuple[str, str]]:
    names = {2: "двойки", 3: "тройки", 5: "пятёрки", 7: "семёрки"}
    frames, factors, m, d = [], [], n, 2
    frame = lambda cond, cap: frames.append(  # noqa: E731
        (_factor_frame(n, m, d, list(factors), cond), cap)
    )
    frame((f"d · d = {d * d} ≤ {m}", "продолжаем"), f"Начинаем: m = {n}, первый кандидат d = 2.")
    while d * d <= m:
        if m % d == 0:
            m //= d
            factors.append(d)
            again = factors.count(d) > 1
            frame(
                (f"{m * d} % {d} = 0", f"делим: m = {m}"),
                f"{m * d} делится на {d}: записываем {d}, теперь m = {m}. "
                + (
                    "Снова тот же множитель — поэтому внутри стоит while, а не if."
                    if again
                    else "Не меняем d: вдруг делится ещё раз."
                ),
            )
            continue
        small = [k for k in range(2, d) if d % k == 0]
        why = ""
        if small:
            gone = sorted({k for k in factors if d % k == 0})
            if gone:
                why = (
                    " Составное "
                    + str(d)
                    + " делить не может: все "
                    + ", ".join(names.get(k, str(k)) for k in gone)
                    + " уже удалены из m."
                )
        frame(
            (f"{m} % {d} = {m % d}", "не делится — d + 1"),
            f"{m} на {d} не делится — переходим к d = {d + 1}.{why}",
        )
        d += 1
    frame(
        (f"d · d = {d * d} > {m}", "цикл закончен"),
        f"{d} · {d} = {d * d} больше m = {m} — цикл закончен. Если бы у {m} был "
        f"делитель больше 1, хотя бы один нашёлся бы не больше √{m}, а такие "
        f"кандидаты уже проверены.",
    )
    if m > 1:
        factors.append(m)
        last = m
        m = 1
        frame(
            ("m > 1", f"{last} — последний множитель"),
            f"После цикла осталось {last}. Делителей у него нет, значит, {last} "
            f"простое — дописываем его. Итог: {n} = {' · '.join(map(str, factors))}.",
        )
    return frames


ICONS = {
    "prev": '<path d="m15 6-6 6 6 6"/>',
    "next": '<path d="m9 6 6 6-6 6"/>',
    "play": '<path d="M8 5.5v13l10.5-6.5z"/>',
    "pause": '<path d="M9 5.5v13M15 5.5v13"/>',
}


def icon(name: str, size: int = 18) -> str:
    return (
        f'<svg class="ic" width="{size}" height="{size}" viewBox="0 0 24 24" '
        f'aria-hidden="true">{ICONS[name]}</svg>'
    )


def _stepper(frames) -> str:
    """Frames with controls styled like the site video: icon buttons and a
    thin step timeline. Without JS the last frame and every step are shown."""
    last = len(frames) - 1
    items = "".join(
        f'<div class="frame" data-caption="{html.escape(c)}"{"" if i == last else " hidden"}>'
        f"{svg}</div>"
        for i, (svg, c) in enumerate(frames)
    )
    steps = "".join(f"<li>{html.escape(c)}</li>" for _, c in frames)
    return (
        '<figure class="stepper" data-stepper><div class="viewport">'
        + items
        + '</div><div class="st-ctl" hidden>'
        f'<button type="button" class="ib st-prev" aria-label="Предыдущий шаг">{icon("prev")}</button>'
        f'<button type="button" class="ib st-play" aria-label="Воспроизвести">{icon("play")}</button>'
        f'<button type="button" class="ib st-next" aria-label="Следующий шаг">{icon("next")}</button>'
        f'<input type="range" class="st-line" min="0" max="{last}" step="1" value="{last}" '
        'aria-label="Шаг схемы">'
        f'<span class="st-count">{len(frames)} / {len(frames)}</span></div>'
        '<p class="st-note" aria-live="polite" hidden></p>'
        f'<ol class="st-steps">{steps}</ol></figure>'
    )


def _mask_parts(mask: str):
    parts, buf = [], ""
    for ch in mask:
        if ch in "?*":
            if buf:
                parts.append(buf)
                buf = ""
            parts.append(ch)
        else:
            buf += ch
    if buf:
        parts.append(buf)
    return parts


def _segment(mask: str, s: str):
    """Split s by mask parts (first valid split, star as short as possible)."""
    parts = _mask_parts(mask)

    def go(i, k):
        if i == len(parts):
            return [] if k == len(s) else None
        p = parts[i]
        if p == "?":
            if k < len(s) and s[k].isdigit():
                rest = go(i + 1, k + 1)
                return None if rest is None else [(p, s[k])] + rest
            return None
        if p == "*":
            for L in range(0, len(s) - k + 1):
                rest = go(i + 1, k + L)
                if rest is not None:
                    return [(p, s[k : k + L])] + rest
            return None
        if s.startswith(p, k):
            rest = go(i + 1, k + len(p))
            return None if rest is None else [(p, p)] + rest
        return None

    return go(0, 0)


def mask_align_svg(mask: str, samples: list[str]) -> str:
    cell, left, top, gap = 26, 16, 34, 16
    fills = {"?": WASH}
    h = top + len(samples) * (cell + gap) + 8
    out = [
        f'<svg viewBox="0 0 660 {h}" role="img" aria-label="Разбор чисел по маске {mask}">',
        f'<text x="{left}" y="20" font-family="{SANS}" font-size="14" fill="{MUTED}">'
        f"маска {mask}: белые — обязательные цифры, серые — ?, оранжевая рамка — *</text>",
    ]
    for r, s in enumerate(samples):
        y = top + r * (cell + gap)
        seg = _segment(mask, s)
        x = left
        if seg is None:
            for ch in s:
                out.append(
                    f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" fill="{WASH}" '
                    f'stroke="{FAINT}"/><text x="{x + cell / 2}" y="{y + 18}" '
                    f'text-anchor="middle" font-family="{SANS}" font-size="15" '
                    f'fill="{MUTED}">{ch}</text>'
                )
                x += cell
        else:
            for p, text in seg:
                if p == "*" and text == "":
                    out.append(
                        f'<rect x="{x - 2}" y="{y - 3}" width="4" height="{cell + 6}" '
                        f'fill="{ACCENT}" stroke="none"/>'
                    )
                    continue
                for ch in text:
                    out.append(
                        f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" '
                        f'fill="{fills.get(p, "#ffffff")}" '
                        f'stroke="{ACCENT if p == "*" else INK}"'
                        f"{' stroke-width="2"' if p == '*' else ''}/>"
                        f'<text x="{x + cell / 2}" y="{y + 18}" text-anchor="middle" '
                        f'font-family="{SANS}" font-size="15" fill="{INK}">{ch}</text>'
                    )
                    x += cell
        star = next((t for p, t in seg if p == "*"), None) if seg else None
        verdict = (
            f"подходит: * = «{star}»"
            if seg and star is not None and star
            else "подходит: * — пустая"
            if seg
            else "не подходит"
        )
        out.append(
            f'<text x="{left + 8 * cell + 24}" y="{y + 18}" font-family="{SANS}" '
            f'font-size="14" fill="{INK if seg else MUTED}">{s} — {verdict}</text>'
        )
    out.append("</svg>")
    return "".join(out)


def mask_try(mask: str = "12*3?", number: str = "120034") -> str:
    """Mask sandbox with a starting mask and number (site: MaskSandbox)."""
    return MASK_TRY_HTML.format(mask=html.escape(mask), number=html.escape(number))


MASK_TRY_HTML = """<div class="mask-try" data-mask-try>
<div class="mt-row"><label>Маска <input class="mt-mask" value="{mask}" spellcheck="false" autocomplete="off"></label>
<label>Число <input class="mt-num" value="{number}" inputmode="numeric" spellcheck="false" autocomplete="off"></label></div>
<div class="mt-out" aria-live="polite"></div>
<p class="mt-note">Белые клетки — обязательные цифры маски, серые — <code>?</code>, в оранжевой рамке — <code>*</code>. Тонкая оранжевая черта — пустая <code>*</code>.</p>
</div>"""

MASK_TRY_JS = """<script>
document.querySelectorAll("[data-mask-try]").forEach(function (box) {
  var mi = box.querySelector(".mt-mask"), ni = box.querySelector(".mt-num"), out = box.querySelector(".mt-out");
  function parts(mask) {
    var res = [], buf = "";
    for (var i = 0; i < mask.length; i++) {
      var c = mask[i];
      if (c === "?" || c === "*") { if (buf) { res.push(buf); buf = ""; } res.push(c); } else buf += c;
    }
    if (buf) res.push(buf);
    return res;
  }
  function seg(ps, s, i, k) {
    if (i === ps.length) return k === s.length ? [] : null;
    var p = ps[i];
    if (p === "?") {
      if (k < s.length && /[0-9]/.test(s[k])) { var r = seg(ps, s, i + 1, k + 1); return r && [[p, s[k]]].concat(r); }
      return null;
    }
    if (p === "*") {
      for (var L = 0; L <= s.length - k; L++) { var r2 = seg(ps, s, i + 1, k + L); if (r2) return [[p, s.slice(k, k + L)]].concat(r2); }
      return null;
    }
    if (s.slice(k, k + p.length) === p) { var r3 = seg(ps, s, i + 1, k + p.length); return r3 && [[p, p]].concat(r3); }
    return null;
  }
  function esc(t) { return t.replace(/[&<>]/g, function (c) { return {"&": "&amp;", "<": "&lt;", ">": "&gt;"}[c]; }); }
  function run() {
    var mask = mi.value.trim(), s = ni.value.trim();
    if (!mask || !s) { out.innerHTML = "<p class='mt-msg'>Введи маску и число.</p>"; return; }
    if (!/^[0-9]+$/.test(s)) { out.innerHTML = "<p class='mt-msg'>Число должно состоять только из цифр.</p>"; return; }
    if (!/^[0-9?*]+$/.test(mask)) { out.innerHTML = "<p class='mt-msg'>В маске допустимы только цифры, ? и *.</p>"; return; }
    var r = seg(parts(mask), s, 0, 0), html = "<div class='mt-cells'>";
    if (!r) {
      for (var i = 0; i < s.length; i++) html += "<span class='c bad'>" + esc(s[i]) + "</span>";
      out.innerHTML = html + "</div><p class='mt-msg'>Не подходит: число нельзя разбить по частям маски.</p>";
      return;
    }
    var star = null;
    r.forEach(function (pt) {
      var cls = pt[0] === "?" ? "q" : pt[0] === "*" ? "s" : "f";
      if (pt[0] === "*") star = pt[1];
      if (pt[0] === "*" && pt[1] === "") { html += "<span class='c empty' title='пустая *'></span>"; return; }
      for (var j = 0; j < pt[1].length; j++) html += "<span class='c " + cls + "'>" + esc(pt[1][j]) + "</span>";
    });
    var note = star === null ? "" : star === "" ? " Звёздочка здесь пустая." : " Звёздочка заменяет «" + esc(star) + "».";
    out.innerHTML = html + "</div><p class='mt-msg ok'>Подходит." + note + "</p>";
  }
  mi.addEventListener("input", run); ni.addEventListener("input", run); run();
});
</script>"""


def divisor_grid_svg(p: int = 2, a: int = 3, q: int = 3, b: int = 2) -> str:
    """Divisors of p^a·q^b as a grid: rows are powers of p, columns powers of q."""
    cw, ch, left, top = 84, 40, 130, 40
    w = left + (b + 1) * cw
    h = top + (a + 1) * ch + 16
    sup = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")
    out = [f'<svg viewBox="0 0 660 {h}" role="img" aria-label="Делители {p**a * q**b} в таблице">']
    for j in range(b + 1):
        out.append(
            f'<text x="{left + j * cw + cw / 2}" y="{top - 12}" text-anchor="middle" '
            f'font-family="{SANS}" font-size="15" fill="{MUTED}">{q}{str(j).translate(sup)}</text>'
        )
    for i in range(a + 1):
        y = top + i * ch
        out.append(
            f'<text x="{left - 14}" y="{y + ch / 2 + 6}" text-anchor="end" '
            f'font-family="{SANS}" font-size="15" fill="{MUTED}">{p}{str(i).translate(sup)}</text>'
        )
        for j in range(b + 1):
            even = i >= 1
            out.append(
                f'<rect x="{left + j * cw}" y="{y}" width="{cw}" height="{ch}" '
                f'fill="{WASH if even else "#ffffff"}" stroke="{INK}"/>'
                f'<text x="{left + j * cw + cw / 2}" y="{y + ch / 2 + 6}" text-anchor="middle" '
                f'font-family="{SANS}" font-size="16" fill="{INK}">{p**i * q**j}</text>'
            )
    tx = w + 30
    out.append(
        f'<text x="{tx}" y="{top + 18}" font-family="{SANS}" font-size="14" fill="{INK}">'
        f"{a + 1} строки × {b + 1} столбца = {(a + 1) * (b + 1)}</text>"
        f'<text x="{tx}" y="{top + 48}" font-family="{SANS}" font-size="14" fill="{MUTED}">'
        f"верхняя строка — нечётные: {b + 1}</text>"
        f'<text x="{tx}" y="{top + 72}" font-family="{SANS}" font-size="14" fill="{MUTED}">'
        f"закрашенные — чётные: {a * (b + 1)}</text>"
    )
    out.append("</svg>")
    return "".join(out)


# ------------------------------------------------------------------ graphs
# Topic 23: weighted acyclic graphs. An edge is (u, v, w); the weight is shown
# exactly as written (a string such as "2.4" or a number).

NODE_R = 17


def _num(w) -> str:
    return w if isinstance(w, str) else f"{w:g}"


def _topo_layers(edges) -> tuple[list[int], dict[int, int]]:
    """Vertices in order of appearance and the layer of each one: the number
    of edges on the longest path that reaches it from a vertex without
    incoming edges."""
    nodes = list(dict.fromkeys(v for u, w_, _ in edges for v in (u, w_)))
    preds = {v: [u for u, x, _ in edges if x == v] for v in nodes}
    layer: dict[int, int] = {}
    while len(layer) < len(nodes):
        for v in nodes:
            if v not in layer and all(u in layer for u in preds[v]):
                layer[v] = 1 + max((layer[u] for u in preds[v]), default=-1)
    return nodes, layer


def _quad(p0, c, p2, t):
    return tuple(
        (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t * t * d
        for a, b, d in zip(p0, c, p2, strict=True)
    )


def _unit(a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    n = (dx * dx + dy * dy) ** 0.5 or 1.0
    return dx / n, dy / n


def graph_layout(edges, *, order=None, up: bool = False, width: int = 660) -> dict:
    """Geometry of a weighted directed graph, the single source for the stand
    picture (graph_svg) and the site sandbox (PathBuilder, via site_media).

    Vertices go by layers from left to right; an edge is a quadratic curve,
    bent when a vertex lies on its straight line. order — every vertex in one
    row in this order (a backward edge bends below; the graph may have a cycle);
    up — bend arcs upwards only (room under the vertices for values).
    Returns width, the vertical extent (top, bottom) and per vertex (x, y),
    per edge u, v, w, the curve and arrow paths, the label box and backward.
    """
    margin = 34
    if order:
        nodes = list(order)
        cols = {v: i for i, v in enumerate(order)}
        rows = {v: 0 for v in order}
    else:
        nodes, layer = _topo_layers(edges)
        cols = layer
        by_col: dict[int, list] = {}
        for v in nodes:
            by_col.setdefault(layer[v], []).append(v)
        height_rows = max(len(c) for c in by_col.values())
        rows = {}
        for col in by_col.values():
            shift = (height_rows - len(col)) / 2
            for i, v in enumerate(col):
                rows[v] = shift + i
        if height_rows == 1 and len(by_col) > 2:
            # a chain: inner vertices step up and down, so that edges which
            # skip a vertex stay straight lines instead of arcs
            last = len(by_col) - 1
            for c, (v,) in by_col.items():
                rows[v] = 0 if c in (0, last) else (-0.6 if c % 2 else 0.6)
    ncols = max(cols.values()) + 1
    dx = (width - 2 * margin) / max(1, ncols - 1)
    gap = 84
    pos = {v: (margin + cols[v] * dx, rows[v] * gap) for v in nodes}
    ys = [y + d for _, y in pos.values() for d in (-NODE_R - 4, NODE_R + 4)]
    flip = 0

    geo = []
    for u, v, w in edges:
        p0, p2 = pos[u], pos[v]
        backward = bool(order) and cols[v] < cols[u]
        dirx, diry = _unit(p0, p2)
        length = ((p2[0] - p0[0]) ** 2 + (p2[1] - p0[1]) ** 2) ** 0.5
        blocked = any(
            x not in (u, v)
            and 0 < (pos[x][0] - p0[0]) * dirx + (pos[x][1] - p0[1]) * diry < length
            and abs((pos[x][0] - p0[0]) * diry - (pos[x][1] - p0[1]) * dirx) < NODE_R + 6
            for x in pos
        )
        bend = 0.0
        if blocked or backward:
            # positive bend = the arc goes above the straight line
            if order:
                bend = (-1 if backward else 1) * (10 + 0.18 * length)
            else:
                sign = 1 if up or flip % 2 == 0 else -1
                flip += 1
                bend = sign * (22 + 0.14 * length)
        mid = ((p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2)
        if dirx >= 0:
            c = (mid[0] + diry * 2 * bend, mid[1] - dirx * 2 * bend)
        else:
            c = (mid[0] - diry * 2 * bend, mid[1] + dirx * 2 * bend)
        geo.append((u, v, w, p0, c, p2, backward))
    curves = [[_quad(p0, c, p2, k / 40) for k in range(41)] for *_, p0, c, p2, _b in geo]

    out_edges, labels = [], []
    for i, (u, v, w, p0, c, p2, backward) in enumerate(geo):
        s = _unit(p0, c)
        e = _unit(c, p2)
        a = (p0[0] + s[0] * NODE_R, p0[1] + s[1] * NODE_R)
        tip = (p2[0] - e[0] * (NODE_R + 1), p2[1] - e[1] * (NODE_R + 1))
        base = (tip[0] - e[0] * 9, tip[1] - e[1] * 9)
        ys.append(c[1] / 2 + (p0[1] + p2[1]) / 4)  # apex of the arc
        label = None
        if _num(w) != "":
            # weight label near the middle of the edge, away from other edges
            # (crossings) and from labels placed before
            def clear(pt, i=i):
                near_edge = min(
                    (
                        abs(pt[0] - x) + abs(pt[1] - y)
                        for j, cv in enumerate(curves)
                        if j != i
                        for x, y in cv
                    ),
                    default=99,
                )
                free = all(abs(pt[0] - x) > 26 or abs(pt[1] - y) > 20 for x, y in labels)
                return near_edge > 22 and free

            options = [_quad(p0, c, p2, t) for t in (0.5, 0.42, 0.58, 0.34, 0.66, 0.28, 0.72)]
            lx, ly = next((pt for pt in options if clear(pt)), options[0])
            labels.append((lx, ly))
            label = (lx, ly, 7.6 * len(_num(w)) + 8)
            ys += [ly - 12, ly + 12]
        out_edges.append(
            {
                "u": u,
                "v": v,
                "w": w,
                "backward": backward,
                "path": (
                    f"M {a[0]:.1f} {a[1]:.1f} Q {c[0]:.1f} {c[1]:.1f} {base[0]:.1f} {base[1]:.1f}"
                ),
                "arrow": (
                    f"M {tip[0]:.1f} {tip[1]:.1f} "
                    f"L {base[0] - e[1] * 4.5:.1f} {base[1] + e[0] * 4.5:.1f} "
                    f"L {base[0] + e[1] * 4.5:.1f} {base[1] - e[0] * 4.5:.1f} Z"
                ),
                "label": label,
            }
        )
    return {
        "width": width,
        "pos": pos,
        "edges": out_edges,
        "top": min(ys) - 8,
        "bottom": max(ys) + 8,
    }


def graph_geometry(edges) -> dict:
    """graph_layout moved so that the picture starts at y = 0: the data the
    site sandbox draws from (site_media → manifest kind «graph»)."""
    g = graph_layout(edges)
    top = g["top"]

    def shift_path(d: str) -> str:
        nums = d.split()
        out, k = [], 0
        for t in nums:
            if t.isalpha():
                out.append(t)
                k = 0
                continue
            out.append(f"{float(t) - top:.1f}" if k % 2 else t)
            k += 1
        return " ".join(out)

    return {
        "width": g["width"],
        "height": round(g["bottom"] - top),
        "nodes": [
            {"id": v, "x": round(x, 1), "y": round(y - top, 1)} for v, (x, y) in g["pos"].items()
        ],
        "edges": [
            {
                "from": e["u"],
                "to": e["v"],
                "weight": _num(e["w"]),
                "path": shift_path(e["path"]),
                "arrow": shift_path(e["arrow"]),
                "label": None
                if e["label"] is None
                else {
                    "x": round(e["label"][0], 1),
                    "y": round(e["label"][1] - top, 1),
                    "width": round(e["label"][2], 1),
                },
            }
            for e in g["edges"]
        ],
    }


def graph_svg(
    edges,
    *,
    path=None,
    must=(),
    banned=(),
    values=None,
    current=None,
    edge=None,
    order=None,
    changed=None,
    footer=None,
    faded=(),
    interactive: bool = False,
    width: int = 660,
    label: str | None = None,
) -> str:
    """Weighted directed graph drawn from graph_layout.

    path — vertices of a highlighted path; must / banned — a vertex the path
    has to visit / may not visit; values — text under a vertex (f = 4);
    current — vertex in focus; edge — (u, v) edge in focus; changed — vertex
    whose value has just changed; order — every vertex in one row in this
    order (a backward edge is accented); footer — lines of text under the
    graph; faded — vertices already removed (topological sort);
    interactive — vertices and edges carry data-v / data-e for a page script.
    """
    g = graph_layout(edges, order=order, up=values is not None or footer is not None, width=width)
    pos = g["pos"]
    on_path = set(zip(path, path[1:], strict=False)) if path else set()
    banned, faded = set(banned), set(faded)
    parts, label_parts, ys = [], [], [g["top"], g["bottom"]]

    for e in g["edges"]:
        u, v = e["u"], e["v"]
        hot = (u, v) in on_path or edge == (u, v) or e["backward"]
        off = u in banned or v in banned or u in faded
        stroke = ACCENT if hot else FAINT if off else INK
        sw = 2.4 if hot else 1.4
        dash = ' stroke-dasharray="5 4"' if (off and u not in faded) or e["backward"] else ""
        tag = f' data-e="{u}-{v}"' if interactive else ""
        parts.append(
            f'<path{tag} d="{e["path"]}" fill="none" stroke="{stroke}" stroke-width="{sw}"{dash}/>'
        )
        parts.append(f'<path{tag} d="{e["arrow"]}" fill="{stroke}"/>')
        if e["label"]:
            lx, ly, tw = e["label"]
            text = _text(
                lx,
                ly + 5,
                _num(e["w"]),
                13,
                ACCENT if hot else MUTED,
                "middle",
                600 if hot else 400,
            )
            if interactive:
                text = text.replace("<text ", f'<text data-el="{u}-{v}" ', 1)
            label_parts.append(
                f'<rect x="{lx - tw / 2:.1f}" y="{ly - 10:.1f}" width="{tw:.1f}" '
                f'height="20" rx="4" fill="#ffffff"/>' + text
            )
    parts += label_parts

    for v, (x, y) in pos.items():
        dash = ""
        if v in banned:
            fill, stroke, sw, color = WASH, MUTED, 1.5, MUTED
            dash = ' stroke-dasharray="4 3"'
        elif v == current or v in must:
            fill, stroke, sw, color = "#ffffff", ACCENT, 2.4, INK
        elif v in faded:
            fill, stroke, sw, color = WASH, FAINT, 1.5, MUTED
        else:
            fill, stroke, sw, color = "#ffffff", INK, 1.5, INK
        if interactive:
            parts.append(
                f'<g data-v="{v}" tabindex="0" role="button" aria-label="Вершина {v}" class="gv">'
            )
        parts.append(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{NODE_R}" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="{sw}"{dash}/>'
        )
        parts.append(_text(x, y + 5, str(v), 14 if len(str(v)) < 4 else 12, color, "middle", 600))
        if interactive:
            parts.append("</g>")
        if values and v in values:
            hot = v == changed
            # above a vertex of the upper row, under the others
            vy = y - NODE_R - 9 if y < 0 else y + NODE_R + 19
            parts.append(
                _text(x, vy, values[v], 14, ACCENT if hot else INK, "middle", 600 if hot else 400)
            )
            ys += [vy - 14, vy + 7]

    top = min(ys) - (0 if min(ys) == g["top"] else 8)
    bottom = max(ys) + (0 if max(ys) == g["bottom"] else 8)
    for i, line in enumerate(footer or []):
        parts.append(_text(18, bottom + 18 + 22 * i, line, 14, MUTED))
    if footer:
        bottom += 22 * len(footer) + 6
    name = label or "Граф: " + ", ".join(f"{u} → {v} ({_num(w)})" for u, v, w in edges)
    # the picture starts at y = 0: the site's export expects viewBox "0 0 W H"
    return (
        f'<svg viewBox="0 0 {width} {bottom - top:.0f}" role="img" '
        f'aria-label="{html.escape(name)}"><g transform="translate(0 {-top:.1f})">'
        + "".join(parts)
        + "</g></svg>"
    )


def _f(x) -> str:
    return "∞" if x == float("inf") else f"{x:g}"


def best_frames(edges, source=1, target=100) -> list[tuple[str, str]]:
    """best(v) with @cache, call by call: the call stack, the saved values and
    the moment a repeated call takes its value from memory."""
    graph: dict[int, list] = {}
    for u, v, w in edges:
        graph.setdefault(u, []).append((v, float(w)))
    memo: dict[int, float] = {}
    stack: list[int] = []
    frames = []

    def snap(caption, cur=None, edge=None, changed=None):
        values = {v: f"f = {_f(x)}" for v, x in memo.items()}
        chain = " → ".join(f"best({v})" for v in stack) or "пуст"
        frames.append(
            (
                graph_svg(
                    edges,
                    values=values,
                    current=cur,
                    edge=edge,
                    changed=changed,
                    footer=[f"Стек вызовов: {chain}"],
                ),
                caption,
            )
        )

    def best(v):
        if v in memo:
            return memo[v]
        stack.append(v)
        if v == target:
            memo[v] = 0.0
            snap(
                f"best({v}): это цель, идти больше не нужно — f({v}) = 0. Значение сохранено.",
                v,
                changed=v,
            )
            stack.pop()
            return 0.0
        snap(f"Вызов best({v}): ответа для {v} ещё нет, перебираем рёбра из {v}.", v)
        answer = float("inf")
        for nxt, w in graph.get(v, []):
            known = nxt in memo
            rest = best(nxt)
            cand = w + rest
            got = (
                f"best({nxt}) уже сохранено — берём из памяти: {_f(rest)}."
                if known
                else (f"best({nxt}) вернул {_f(rest)}.")
            )
            better = cand < answer
            answer = min(answer, cand)
            snap(
                f"Ребро {v} → {nxt} ({w:g}): {got} Кандидат {w:g} + {_f(rest)} = {_f(cand)}"
                + (" — пока лучший." if better else f", хуже {_f(answer)}."),
                v,
                edge=(v, nxt),
            )
        memo[v] = answer
        snap(
            f"Все рёбра из {v} просмотрены: f({v}) = {_f(answer)}. Значение сохранено.",
            v,
            changed=v,
        )
        stack.pop()
        return answer

    result = best(source)
    snap(f"Ответ: best({source}) = {_f(result)}. Каждая вершина вычислена один раз.")
    return frames


def best_stepper(edges, source=1, target=100) -> str:
    """Recursion with memoization on a small graph, step by step."""
    return _stepper(best_frames(edges, source, target))


def passes_frames(edges, source=1) -> list[tuple[str, str]]:
    """Repeated passes over the edge list in file order with the table of
    best found costs d[v] under the vertices."""
    nodes, _ = _topo_layers(edges)
    d = {v: float("inf") for v in nodes}
    d[source] = 0.0
    frames = []

    def snap(caption, edge=None, changed=None, where=""):
        values = {v: f"d = {_f(x)}" for v, x in d.items()}
        frames.append(
            (
                graph_svg(
                    edges,
                    values=values,
                    edge=edge,
                    changed=changed,
                    footer=[where] if where else None,
                ),
                caption,
            )
        )

    snap(
        f"До проходов: d[{source}] = 0, до остальных вершин путь пока не найден — ∞.",
        where="Рёбра в порядке файла: " + ", ".join(f"{u} → {v}" for u, v, _ in edges),
    )
    passes = len(nodes) - 1
    for p in range(1, passes + 1):
        changed_any = False
        for i, (u, v, w) in enumerate(edges, 1):
            w = float(w)
            where = f"Проход {p} из {passes} · ребро {i} из {len(edges)}"
            if d[u] == float("inf"):
                snap(
                    f"{u} → {v}: до {u} путь пока не найден — ребро ничего не даёт.",
                    (u, v),
                    where=where,
                )
                continue
            cand = d[u] + w
            if cand < d[v]:
                old = d[v]
                d[v] = cand
                changed_any = True
                snap(
                    f"{u} → {v}: {_f(d[u])} + {w:g} = {_f(cand)} < {_f(old)} — улучшаем d[{v}].",
                    (u, v),
                    changed=v,
                    where=where,
                )
            else:
                snap(
                    f"{u} → {v}: {_f(d[u])} + {w:g} = {_f(cand)}, не лучше {_f(d[v])}.",
                    (u, v),
                    where=where,
                )
        if not changed_any:
            snap(
                f"За проход {p} ничего не изменилось — дальше можно не проходить.",
                where=f"Проход {p} без изменений",
            )
            break
    else:
        snap(
            f"Выполнено V − 1 = {ru_count(passes, 'проход', 'прохода', 'проходов')} — "
            "значения окончательные."
        )
    return frames


def passes_stepper(edges, source=1) -> str:
    """Bellman–Ford passes in file order, edge by edge."""
    return _stepper(passes_frames(edges, source))


def _out_edges(edges, v):
    return [(x, w) for u, x, w in edges if u == v]


def backward_frames(edges, source=1, target=100) -> list[tuple[str, str]]:
    """f(v) vertex by vertex from the target backwards: every candidate
    «weight + f(next)» and the one that wins."""
    nodes, layer = _topo_layers(edges)
    order = sorted(nodes, key=lambda v: -layer[v])
    f: dict[int, float] = {}
    win: dict[int, int] = {}
    frames = []

    def snap(caption, cur=None, edge=None, path=None, changed=None):
        values = {v: f"f = {_f(x)}" for v, x in f.items()}
        frames.append(
            (
                graph_svg(edges, values=values, current=cur, edge=edge, path=path, changed=changed),
                caption,
            )
        )

    snap(
        "Значения f пока не известны. Начнём с вершин, после которых идти "
        "некуда или почти некуда, — с цели."
    )
    for v in order:
        if v == target:
            f[v] = 0.0
            snap(f"f({v}) = 0: мы уже в цели, идти больше не нужно.", v, changed=v)
            continue
        outs = _out_edges(edges, v)
        if not outs:
            f[v] = float("inf")
            snap(f"Из {v} рёбер нет — до цели не дойти: f({v}) = ∞.", v, changed=v)
            continue
        cands = [(float(w) + f[x], x, w) for x, w in outs]
        best_c, best_x, _ = min(cands)
        f[v] = best_c
        win[v] = best_x
        terms = ", ".join(f"{_num(w)} + f({x})" for _, x, w in cands)
        nums = ", ".join(f"{_num(w)} + {_f(f[x])}" for _, x, w in cands)
        formula = (
            f"f({v}) = {_num(cands[0][2])} + f({cands[0][1]}) = {nums} = {_f(best_c)}"
            if len(cands) == 1
            else f"f({v}) = min({terms}) = min({nums}) = {_f(best_c)}"
        )
        snap(
            f"{formula}. Ответы для соседей уже известны — они ближе к цели.",
            v,
            edge=(v, best_x),
            changed=v,
        )
    path, v = [source], source
    while v != target and v in win:
        v = win[v]
        path.append(v)
    snap(
        f"Готово: f({source}) = {_f(f[source])}. Если из каждой вершины идти по ребру, "
        f"которое дало минимум, получится путь {' → '.join(map(str, path))}.",
        path=path,
    )
    return frames


def backward_stepper(edges, source=1, target=100) -> str:
    """f from the target backwards, vertex by vertex."""
    return _stepper(backward_frames(edges, source, target))


def adjacency_svg(edges, focus=None, width: int = 660) -> str:
    """File lines on the left, the dictionary graph on the right: every line
    goes into the list of its start vertex."""
    keys = list(dict.fromkeys(u for u, _, _ in edges))
    targets = [v for v in dict.fromkeys(v for _, v, _ in edges) if v not in keys]
    row, top = 30, 44
    lx, rx = 24, 300
    h = top + row * max(len(edges), len(keys) + len(targets)) + 16
    out = [
        f'<svg viewBox="0 0 {width} {h}" role="img" '
        f'aria-label="Строки файла раскладываются в словарь graph по начальной вершине">'
    ]
    out.append(_text(lx, 22, "строки файла", 13, MUTED))
    out.append(_text(rx, 22, "graph: вершина → её переходы", 13, MUTED))
    key_y = {k: top + row * i for i, k in enumerate(keys)}
    for i, (u, v, w) in enumerate(edges):
        y = top + row * i
        hot = u == focus
        color = ACCENT if hot else INK
        out.append(_text(lx, y + 5, f"{u} {v} {_num(w)}", 15, color, "start", 600 if hot else 400))
        out.append(
            f'<path d="M {lx + 110} {y} C {lx + 190} {y}, '
            f'{rx - 80} {key_y[u]}, {rx - 12} {key_y[u]}" '
            f'fill="none" stroke="{ACCENT if hot else FAINT}" stroke-width="{2 if hot else 1.25}"/>'
        )
    for k in keys:
        y = key_y[k]
        hot = k == focus
        items = ", ".join(f"({v}, {_num(w)})" for u, v, w in edges if u == k)
        out.append(
            _text(
                rx,
                y + 5,
                f"{k}: [{items}]",
                15,
                ACCENT if hot else INK,
                "start",
                600 if hot else 400,
            )
        )
    for i, t in enumerate(targets):
        y = top + row * (len(keys) + i)
        out.append(_text(rx, y + 5, f"{t}: записи нет — graph.get({t}, []) даёт []", 15, MUTED))
    out.append("</svg>")
    return "".join(out)


def _call_tree(edges, v, target, memo, cache):
    """Nested calls of best(v): (vertex, from memory?, children)."""
    if cache and v in memo:
        return (v, True, [])
    kids = (
        []
        if v == target
        else [_call_tree(edges, x, target, memo, cache) for x, _ in _out_edges(edges, v)]
    )
    memo.add(v)
    return (v, False, kids)


def _tree_layout(tree) -> dict:
    """ident -> (x in leaf units, depth, vertex, from memory, child idents):
    leaves left to right, a parent above the middle of its children."""
    pos: dict = {}
    leaves = 0

    def place(node, depth, ident):
        nonlocal leaves
        v, mem, kids = node
        ids = [place(kid, depth + 1, ident + (j,)) for j, kid in enumerate(kids)]
        if ids:
            x = sum(pos[i][0] for i in ids) / len(ids)
        else:
            x = leaves
            leaves += 1
        pos[ident] = (x, depth, v, mem, ids)
        return ident

    place(tree, 0, ())
    return pos


def call_tree_svg(edges, source=1, target=100, width: int = 660) -> str:
    """Calls of best() without and with @cache, side by side."""
    half = width / 2
    inset = 46  # half a call box plus a gap from the edge and the divider
    out, height = [], 0
    for k, cache in enumerate((False, True)):
        pos = _tree_layout(_call_tree(edges, source, target, set(), cache))
        n = 1 + max(p[0] for p in pos.values())
        step = (half - 2 * inset) / (n - 1) if n > 1 else 0
        x0 = k * half + inset + (0 if n > 1 else half / 2 - inset)

        def px(x, x0=x0, step=step):
            return x0 + x * step

        def py(depth):
            return 64 + depth * 58

        calls = len(pos)
        computed = sum(1 for p in pos.values() if not p[3])
        note = ru_count(calls, "вызов", "вызова", "вызовов")
        if cache:
            note += f", вычислено {computed}"
        out.append(
            _text(k * half + 20, 20, "с @cache" if cache else "без @cache", 15, INK, "start", 600)
        )
        out.append(_text(k * half + 20, 40, note, 13, MUTED))
        for x, d, _v, _mem, ids in pos.values():
            for i in ids:
                cx, cd = pos[i][0], pos[i][1]
                out.append(
                    f'<line x1="{px(x):.1f}" y1="{py(d) + 12}" x2="{px(cx):.1f}" '
                    f'y2="{py(cd) - 12}" stroke="{FAINT}" stroke-width="1.25"/>'
                )
        for x, d, v, mem, _ids in pos.values():
            label = f"best({v})"
            tw = 6.9 * len(label) + 10
            dash = ' stroke-dasharray="4 3"' if mem else ""
            out.append(
                f'<rect x="{px(x) - tw / 2:.1f}" y="{py(d) - 12}" width="{tw:.1f}" '
                f'height="24" rx="6" fill="{WASH if mem else "#ffffff"}" '
                f'stroke="{MUTED if mem else INK}" stroke-width="1.25"{dash}/>'
            )
            out.append(_text(px(x), py(d) + 4, label, 12, MUTED if mem else INK, "middle"))
            height = max(height, py(d) + 20)
        if cache:
            out.append(
                _text(k * half + 20, height + 18, "пунктир — ответ взят из памяти", 13, MUTED)
            )
    height += 30
    out.insert(0, f'<line x1="{half}" y1="8" x2="{half}" y2="{height - 8}" stroke="{FAINT}"/>')
    return (
        f'<svg viewBox="0 0 {width} {height}" role="img" '
        f'aria-label="Дерево вызовов best без запоминания и с запоминанием">'
        + "".join(out)
        + "</svg>"
    )


def topo_frames(edges) -> list[tuple[str, str]]:
    """Kahn's topological sort: in-degree under every vertex, removed vertices
    fade, the order grows in the footer."""
    nodes, _ = _topo_layers(edges)
    indeg = {v: sum(1 for _, x, _ in edges if x == v) for v in nodes}
    done: list[int] = []
    frames = []

    def snap(caption, cur=None):
        values = {v: f"входит: {indeg[v]}" for v in nodes if v not in done}
        order = ", ".join(map(str, done)) or "пока пуст"
        frames.append(
            (
                graph_svg(
                    edges, values=values, current=cur, faded=done, footer=[f"Порядок: {order}"]
                ),
                caption,
            )
        )

    snap(
        "Под каждой вершиной — сколько рёбер в неё входит. Ищем вершину, в "
        "которую не входит ни одно ребро."
    )
    while len(done) < len(nodes):
        v = next(x for x in nodes if x not in done and indeg[x] == 0)
        nxt = [x for u, x, _ in edges if u == v]
        for x in nxt:
            indeg[x] -= 1
        done.append(v)
        if nxt:
            names = (
                ", ".join(map(str, nxt[:-1])) + " и " + str(nxt[-1])
                if len(nxt) > 1
                else str(nxt[0])
            )
            tail = f" Убираем её рёбра: у {names} входящих рёбер становится меньше."
        else:
            tail = ""
        snap(f"В {v} ничего не входит — записываем её в порядок.{tail}", v)
    snap(
        f"Все вершины записаны: {', '.join(map(str, done))}. Каждое ребро идёт от более "
        "ранней вершины к более поздней."
    )
    return frames


def topo_stepper(edges) -> str:
    """Topological sort by removing vertices without incoming edges."""
    return _stepper(topo_frames(edges))


def path_builder_data(edges, source=1, target=100, caption="") -> dict:
    """Data of the site sandbox (PathBuilder): graph geometry, the start, the
    target and the shortest length as written with the weights' decimals."""
    from decimal import Decimal

    graph: dict = {}
    for u, v, w in edges:
        graph.setdefault(u, []).append((v, Decimal(str(w))))

    def f(v):
        if v == target:
            return Decimal(0)
        return min((w + f(x) for x, w in graph.get(v, [])), default=Decimal("Infinity"))

    return {
        "kind": "graph",
        **graph_geometry(edges),
        "source": source,
        "target": target,
        "shortest": str(f(source)),
    }


def path_builder(edges, source=1, target=100, caption="") -> str:
    """Sandbox: click vertices one after another to build a path; the page
    shows the running sum, refuses moves against the arrows and compares the
    finished path with the shortest one (site: PathBuilder)."""
    graph: dict[int, list] = {}
    for u, v, w in edges:
        graph.setdefault(u, []).append((v, float(w)))

    def f(v):
        if v == target:
            return 0.0
        return min((w + f(x) for x, w in graph.get(v, [])), default=float("inf"))

    data = json.dumps([[u, v, _num(w)] for u, v, w in edges])
    svg = graph_svg(edges, interactive=True)
    return (
        f'<figure class="plate-figure pathb" data-pathb data-edges="{html.escape(data)}" '
        f'data-source="{source}" data-target="{target}" data-best="{f(source):g}">'
        f"{svg}"
        '<div class="pb-ctl" hidden><p class="pb-status" aria-live="polite"></p>'
        '<div class="pb-btns"><button type="button" class="chip pb-back">Шаг назад</button>'
        '<button type="button" class="chip pb-reset">Сначала</button></div></div>'
        f"<figcaption>{_inline(caption)}</figcaption></figure>"
    )


PATH_BUILDER_JS = r"""<script>
document.querySelectorAll("[data-pathb]").forEach(function (box) {
  var E = JSON.parse(box.dataset.edges), S = +box.dataset.source, T = +box.dataset.target;
  var best = +box.dataset.best, path = [S];
  var status = box.querySelector(".pb-status"), ACC = "#ff6a00", INK = "#17191e", MUT = "#4d535e";
  function w(u, v) { for (var i = 0; i < E.length; i++) if (E[i][0] === u && E[i][1] === v) return E[i][2]; return null; }
  function sum() { var s = 0; for (var i = 1; i < path.length; i++) s += +w(path[i - 1], path[i]); return Math.round(s * 1000) / 1000; }
  function paint() {
    var on = {};
    for (var i = 1; i < path.length; i++) on[path[i - 1] + "-" + path[i]] = true;
    box.querySelectorAll("[data-e]").forEach(function (el) {
      var hot = on[el.dataset.e];
      if (el.getAttribute("fill") === "none") { el.setAttribute("stroke", hot ? ACC : INK); el.setAttribute("stroke-width", hot ? 2.4 : 1.4); }
      else el.setAttribute("fill", hot ? ACC : INK);
    });
    box.querySelectorAll("[data-el]").forEach(function (el) {
      var hot = on[el.dataset.el]; el.setAttribute("fill", hot ? ACC : MUT); el.setAttribute("font-weight", hot ? 600 : 400);
    });
    box.querySelectorAll("[data-v]").forEach(function (g) {
      var c = g.querySelector("circle"), inPath = path.indexOf(+g.dataset.v) >= 0, last = +g.dataset.v === path[path.length - 1];
      c.setAttribute("stroke", inPath ? ACC : INK); c.setAttribute("stroke-width", last ? 3 : inPath ? 2.4 : 1.5);
    });
  }
  function say(extra) {
    var ws = []; for (var i = 1; i < path.length; i++) ws.push(w(path[i - 1], path[i]));
    var head = "Путь: " + path.join(" → ");
    if (ws.length) head += " · длина " + (ws.length > 1 ? ws.join(" + ") + " = " : "") + sum();
    status.textContent = head + (extra ? ". " + extra : "");
  }
  function last() { return path[path.length - 1]; }
  function outs(v) { return E.filter(function (e) { return e[0] === v; }); }
  function click(v) {
    var u = last();
    if (u === T) { say("Цель уже достигнута — нажмите «Сначала» или «Шаг назад»"); return; }
    if (v === u) return;
    if (w(u, v) === null) {
      say(w(v, u) !== null ? "Из " + u + " в " + v + " ребра нет: стрелка идёт только " + v + " → " + u : "Из " + u + " в " + v + " ребра нет");
      return;
    }
    path.push(v); paint();
    if (v === T) say(sum() === best ? "Дошли до цели. Это кратчайший путь" : "Дошли до цели. Есть путь короче — попробуйте найти его");
    else if (!outs(v).length) say("Из " + v + " рёбер нет: это тупик, до цели отсюда не дойти");
    else say("Выберите следующую вершину");
  }
  box.querySelectorAll("[data-v]").forEach(function (g) {
    g.addEventListener("click", function () { click(+g.dataset.v); });
    g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); click(+g.dataset.v); } });
  });
  box.querySelector(".pb-back").onclick = function () { if (path.length > 1) path.pop(); paint(); say(path.length > 1 ? "" : "Начинаем в вершине " + S + ": выберите, куда идти"); };
  box.querySelector(".pb-reset").onclick = function () { path = [S]; paint(); say("Начинаем в вершине " + S + ": выберите, куда идти"); };
  box.querySelector(".pb-ctl").hidden = false; box.setAttribute("data-ready", "");
  paint(); say("Начинаем в вершине " + S + ": выберите, куда идти");
});
</script>"""


# ------------------------------------------------------------------ registry
# Lesson Markdown calls a figure as %%name(args)%%, for example
# %%rectangles(36)%% or %%arcs(84, emphasize=(2, 42), ordinal=True)%%.
# Arguments must be Python literals. Add a new builder here, never inline SVG
# by hand: every number on a figure has to come from code.

# ---------------------------------------------------------------- python course


def _arrow(x1, y1, x2, y2, color=INK, dashed=False, width=1.5) -> str:
    """Straight arrow with a drawn head (no <marker>: ids would clash on a page)."""
    dx, dy = x2 - x1, y2 - y1
    length = (dx * dx + dy * dy) ** 0.5 or 1
    ux, uy = dx / length, dy / length
    hx, hy = x2 - 9 * ux, y2 - 9 * uy
    px, py = -uy * 4.5, ux * 4.5
    dash = ' stroke-dasharray="5 4"' if dashed else ""
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{hx:.1f}" y2="{hy:.1f}" stroke="{color}" '
        f'stroke-width="{width}"{dash}/>'
        f'<path d="M {x2:.1f} {y2:.1f} L {hx + px:.1f} {hy + py:.1f} '
        f'L {hx - px:.1f} {hy - py:.1f} Z" fill="{color}"/>'
    )


def refs_svg(names, objects, cells=None, old=None, accent=(), tone: str | None = None) -> str:
    """Names on the left point to objects; an object with cells (an outer list)
    points from each cell to its element. ``names`` — [name, object index];
    ``objects`` — labels; ``cells`` — {object index: [element indexes]};
    ``old`` — earlier bindings drawn dashed; ``accent`` — names in accent.
    An element shared by several cells sits right under them, so the arrows
    visibly land on one box; separate elements go to the right column."""
    hot = accent_of(tone)
    cells = {int(k): v for k, v in (cells or {}).items()}
    old = old or []
    row_h, top, cell = 58, 18, 34
    width = {
        k: cell * len(cells[k]) if k in cells else max(56, 11 * len(label) + 24)
        for k, label in enumerate(objects)
    }
    owners = {}
    for k, targets in cells.items():
        for c, t in enumerate(targets):
            owners.setdefault(t, []).append((k, c))
    pos, mid_rows = {}, 0
    for k in range(len(objects)):
        if k not in owners:
            pos[k] = (230, top + mid_rows * row_h)
            mid_rows += 1
    for k, targets in cells.items():
        ox, oy = pos[k]
        below = oy + row_h + 22
        shared = [t for t in dict.fromkeys(targets) if len(owners[t]) > 1]
        if shared:
            # one element for several cells: right under them, arrows meet
            for t in shared:
                centre = sum(ox + cell * c + cell / 2 for _, c in owners[t]) / len(owners[t])
                pos[t] = (centre - width[t] / 2, below)
        else:
            # one element per cell: a row below, in cell order, arrows fan out
            total = sum(width[t] for t in targets) + 16 * (len(targets) - 1)
            x = ox + cell * len(targets) / 2 - total / 2
            for t in targets:
                pos[t] = (x, below)
                x += width[t] + 16
    live = {t for _, t in names} | set(owners)
    bottom = max(y for _, y in pos.values()) + 40
    h = max(bottom, top + len(names) * row_h - 18) + top
    out = [f'<svg viewBox="0 0 660 {h:.0f}" role="img" aria-label="Имена и объекты">']

    def anchor(t, fx, fy):
        """Arrow end on the target box: its top for a box below, else its left.
        A box shared by several cells takes each arrow under its own cell, so
        the arrowheads stay apart instead of meeting in one point."""
        x, y = pos[t]
        if y > fy + 30:
            if len(owners.get(t, ())) > 1:
                return min(max(fx, x + 12), x + width[t] - 12), y
            return x + width[t] / 2, y
        return x, y + 20

    for k, label in enumerate(objects):
        x, y = pos[k]
        faded = k not in live
        stroke = FAINT if faded else INK
        if k in cells:
            for c in range(len(cells[k])):
                out.append(
                    f'<rect x="{x + cell * c:.1f}" y="{y}" width="{cell}" height="40" '
                    f'fill="{WASH}" stroke="{stroke}"/>'
                    f'<circle cx="{x + cell * c + 17:.1f}" cy="{y + 20}" r="3.5" fill="{INK}"/>'
                )
        else:
            out.append(
                f'<rect x="{x:.1f}" y="{y:.1f}" width="{width[k]}" height="40" rx="8" '
                f'fill="#fff" stroke="{stroke}" stroke-width="1.5"/>'
            )
            out.append(
                _text(x + width[k] / 2, y + 26, label, 16, MUTED if faded else INK, "middle")
            )
    for k, targets in cells.items():
        x, y = pos[k]
        for c, t in enumerate(targets):
            # from the cell's bottom edge: the arrow never crosses a neighbour cell
            fx, fy = x + cell * c + 17, y + 40
            out.append(
                f'<line x1="{fx:.1f}" y1="{y + 20}" x2="{fx:.1f}" y2="{fy}" stroke="{MUTED}"/>'
            )
            out.append(_arrow(fx, fy, *anchor(t, fx, fy - 20), MUTED))
    order = [n for n, _ in names]
    for name, t in old:
        ny = top + order.index(name) * row_h + 20
        out.append(_arrow(108, ny, *anchor(t, 108, ny), FAINT, dashed=True))
    for i, (name, t) in enumerate(names):
        y = top + i * row_h
        color = hot if name in accent else INK
        out.append(
            f'<rect x="16" y="{y}" width="92" height="40" rx="8" fill="#fff" '
            f'stroke="{color}" stroke-width="{2 if name in accent else 1.5}"/>'
        )
        out.append(_text(62, y + 26, name, 16, color, "middle", 600))
        out.append(_arrow(108, y + 20, *anchor(t, 108, y + 20), color))
    out.append("</svg>")
    return "".join(out)


def slice_svg(
    text: str = "ABCDEFG", start=None, stop=None, step=1, show=True, tone: str | None = None
) -> str:
    """Characters with positive and negative indexes; the slice is marked and
    its elements numbered in the order the slice takes them. ``show=False`` draws
    the indexes only, without a slice."""
    accent = accent_of(tone)
    taken = list(range(*slice(start, stop, step).indices(len(text)))) if show else []
    cell, left, top = 46, 30, 30
    height = 156 if show else 112  # no order labels under an indexes-only view
    out = [f'<svg viewBox="0 0 660 {height}" role="img" aria-label="Срез строки {text}">']
    n = len(text)
    for k, ch in enumerate(text):
        x = left + k * cell
        on = k in taken
        out.append(
            f'<rect x="{x}" y="{top}" width="{cell}" height="{cell}" '
            f'fill="{WASH if on else "#fff"}" stroke="{accent if on else INK}" '
            f'stroke-width="{2 if on else 1.25}"/>'
        )
        out.append(_text(x + cell / 2, top + 30, ch, 19, INK, "middle", 600))
        out.append(_text(x + cell / 2, top - 9, str(k), 13, MUTED, "middle"))
        out.append(_text(x + cell / 2, top + cell + 20, str(k - n), 13, MUTED, "middle"))
        if on:
            order = taken.index(k) + 1
            out.append(_text(x + cell / 2, top + cell + 44, f"{order}-й", 13, accent, "middle"))
    right = left + n * cell + 26
    out.append(_text(right, top + 12, "индекс от начала", 13, MUTED))
    out.append(_text(right, top + cell + 20, "индекс с конца", 13, MUTED))
    shown = "".join(text[k] for k in taken)
    parts = ["" if v is None else str(v) for v in (start, stop)]
    spec = ":".join(parts) + ("" if step == 1 else f":{step}")
    if show:
        out.append(_text(right, top + 36, f"s[{spec}] → {shown!r}", 15, accent, weight=600))
    if step > 0 and taken:
        for k in (taken[0], taken[-1] + 1):  # start and stop boundaries
            x = left + k * cell
            out.append(
                f'<line x1="{x}" y1="{top - 4}" x2="{x}" y2="{top + cell + 4}" '
                f'stroke="{INK}" stroke-width="2.5"/>'
            )
    out.append("</svg>")
    return "".join(out)


def range_svg(
    start: int = 2, stop: int = 9, step: int = 3, lo=None, hi=None, tone: str | None = None
) -> str:
    """Integers on a line; values of range(start, stop, step) are circled and the
    excluded stop is marked."""
    accent = accent_of(tone)
    values = list(range(start, stop, step))
    lo = min(start, stop) - 1 if lo is None else lo
    hi = max(start, stop) + 1 if hi is None else hi
    left, right, base = 30, 630, 70
    x = lambda v: left + (v - lo) / (hi - lo) * (right - left)  # noqa: E731
    out = ['<svg viewBox="0 0 660 120" role="img" aria-label="Значения range">']
    out.append(
        f'<line x1="{left}" y1="{base}" x2="{right}" y2="{base}" stroke="{INK}" stroke-width="1.5"/>'
    )
    for v in range(lo, hi + 1):
        out.append(
            f'<line x1="{x(v):.1f}" y1="{base - 4}" x2="{x(v):.1f}" y2="{base + 4}" stroke="{MUTED}"/>'
        )
        out.append(_text(x(v), base + 26, str(v), 14, INK if v in values else MUTED, "middle"))
    for k, v in enumerate(values):
        out.append(
            f'<circle cx="{x(v):.1f}" cy="{base}" r="9" fill="{WASH}" stroke="{accent}" stroke-width="2"/>'
        )
        if k:
            a, b = x(values[k - 1]), x(v)
            mid = (a + b) / 2
            out.append(
                f'<path d="M {a:.1f} {base - 12} Q {mid:.1f} {base - 42} {b:.1f} {base - 12}" '
                f'fill="none" stroke="{MUTED}" stroke-width="1.25"/>'
            )
            out.append(_text(mid, base - 34, f"{step:+d}", 12, MUTED, "middle"))
    sx = x(stop)
    out.append(
        f'<line x1="{sx:.1f}" y1="{base - 20}" x2="{sx:.1f}" y2="{base + 8}" '
        f'stroke="{INK}" stroke-width="1.5" stroke-dasharray="4 3"/>'
    )
    out.append(_text(sx, 18, f"stop = {stop}, не входит", 13, INK, "middle"))
    out.append("</svg>")
    return "".join(out)


def _state_frame(boxes, check, bottom, accent=ACCENT) -> str:
    """Variable boxes, the loop check and a bottom line of a trace frame."""
    out = ['<svg viewBox="0 0 660 160" role="img" aria-hidden="true">']
    for k, (label, value, hot) in enumerate(boxes):
        x = 16 + k * 160
        out.append(
            f'<rect x="{x}" y="14" width="146" height="64" rx="10" fill="#fff" '
            f'stroke="{accent if hot else INK}" stroke-width="{2 if hot else 1.5}"/>'
        )
        out.append(_text(x + 14, 36, label, 13, MUTED))
        out.append(_text(x + 14, 66, str(value), 24, INK))
    x = 16 + len(boxes) * 160
    out.append(_text(x, 40, check[0], 14, INK))
    out.append(_text(x, 64, check[1], 14, MUTED))
    out.append(_text(16, 112, bottom[0], 13, MUTED))
    out.append(_text(16, 142, bottom[1], 20, INK))
    out.append("</svg>")
    return "".join(out)


def digits_frames(number: int = 5072, tone: str | None = None) -> list[tuple[str, str]]:
    """while n > 0: digit = n % 10; total += digit; n //= 10."""
    frames, n, total, taken = [], abs(number), 0, []
    while True:
        ok = n > 0
        frames.append(
            (
                _state_frame(
                    [("n — что осталось", n, True), ("digit_sum", total, False)],
                    (f"n > 0: {n} > 0", "берём цифру" if ok else "цифры кончились"),
                    ("снятые цифры справа налево", " ".join(map(str, taken)) or "пока нет"),
                    accent_of(tone),
                ),
                (
                    f"n = {n}: последняя цифра n % 10 = {n % 10}, n // 10 = {n // 10}."
                    if ok
                    else f"n = 0 — цикл закончен. Сумма цифр {abs(number)} равна {total}."
                ),
            )
        )
        if not ok:
            break
        taken.append(n % 10)
        total += n % 10
        n //= 10
    return frames


def digits_stepper(number: int = 5072, tone: str | None = None) -> str:
    """Digits of a number removed from the right one by one."""
    return _stepper(digits_frames(number, tone))


def _stack_frame(stack, note, accent=ACCENT) -> str:
    out = ['<svg viewBox="0 0 660 330" role="img" aria-hidden="true">']
    for k, (call, wait, value) in enumerate(stack):
        y = 290 - (k + 1) * 50
        top = k == len(stack) - 1
        out.append(
            f'<rect x="16" y="{y}" width="330" height="42" rx="8" fill="{WASH if top else "#fff"}" '
            f'stroke="{accent if top else INK}" stroke-width="{2 if top else 1.25}"/>'
        )
        out.append(_text(30, y + 27, call, 16, INK, weight=600))
        out.append(
            _text(
                170,
                y + 27,
                wait if value is None else f"→ {value}",
                15,
                MUTED if value is None else accent,
            )
        )
    out.append(_text(16, 318, "дно стека — первый вызов", 13, MUTED))
    out.append(_text(370, 40, note[0], 14, INK))
    out.append(_text(370, 64, note[1], 14, MUTED))
    out.append("</svg>")
    return "".join(out)


def stack_frames(n: int = 4, tone: str | None = None) -> list[tuple[str, str]]:
    """factorial(n): calls pile up to the base case, then return in reverse."""
    frames, stack = [], []
    for k in range(n, -1, -1):
        wait = f"ждёт {k} × f({k - 1})" if k else "база: 1"
        stack.append([f"factorial({k})", wait, None])
        frames.append(
            (
                _stack_frame(stack, ("вызов", f"глубина {len(stack)}"), accent_of(tone)),
                f"factorial({k}) "
                + (
                    f"ждёт результат factorial({k - 1})."
                    if k
                    else "— базовый случай, ответ 1 без новых вызовов."
                ),
            )
        )
    value = 1
    for k in range(0, n + 1):
        value = value * k if k else 1
        stack[-1][2] = value
        frames.append(
            (
                _stack_frame(stack, ("возврат", f"factorial({k}) = {value}"), accent_of(tone)),
                f"factorial({k}) возвращает {value}"
                + (f" = {k} × {value // k}." if k else ".")
                + (" Вызов снимается со стека." if k < n else " Стек пуст — ответ готов."),
            )
        )
        stack.pop()
    return frames


def stack_stepper(n: int = 4, tone: str | None = None) -> str:
    """The call stack of factorial(n), call by call."""
    return _stepper(stack_frames(n, tone))


MONO_FONT = "JetBrains Mono, ui-monospace, monospace"
VIOLET = "#6b4fa0"  # a third mapping colour beside a course blue (≥5:1 on white)
BLUE = "#1f4fd0"
GREEN = "#2a6a3a"


def _mono(x, y, s, size: float = 15, color=INK, anchor="start", weight=500) -> str:
    # The figures place boxes by the 0.6 em advance of JetBrains Mono; the
    # fixed text length keeps that pitch when another monospace font renders
    # the text (a fallback before the web font loads), so boxes stay on it.
    fit = f' textLength="{len(s) * size * CH:.1f}" lengthAdjust="spacing"' if len(s) > 1 else ""
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{MONO_FONT}" font-size="{size}" '
        f'font-weight="{weight}" fill="{color}" text-anchor="{anchor}"{fit} '
        f'style="white-space:pre;font-variant-ligatures:none">{html.escape(s)}</text>'
    )


def place_value_svg(digits: str = "472", base: int = 10, tone: str | None = None) -> str:
    """Digits of a record with their weights: 472 = 4·100 + 7·10 + 2·1."""
    accent = accent_of(tone)
    n = len(digits)
    box, gap = 64, 14
    total_w = n * box + (n - 1) * gap
    x0 = (660 - total_w) / 2
    out = [f'<svg viewBox="0 0 660 196" role="img" aria-label="Разряды записи {digits}">']
    terms = []
    for k, d in enumerate(digits):
        weight = base ** (n - 1 - k)
        value = int(d, base) * weight
        terms.append(str(value))
        x = x0 + k * (box + gap)
        last = k == n - 1
        out.append(
            f'<rect x="{x:.1f}" y="16" width="{box}" height="56" rx="10" fill="#fff" '
            f'stroke="{accent if last else INK}" stroke-width="{2 if last else 1.5}"/>'
        )
        out.append(_text(x + box / 2, 54, d, 28, INK, "middle", 600))
        out.append(_text(x + box / 2, 98, f"× {weight}", 15, MUTED, "middle"))
        out.append(_text(x + box / 2, 130, str(value), 17, INK, "middle"))
    out.append(_text(x0 - 12, 98, "вес", 13, MUTED, "end"))
    number = int(digits, base)
    tail = f" = {number}"
    out.append(_text(330, 172, " + ".join(terms) + tail, 17, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def _branch_panel(x, title, var, value, checks, other, accent=ACCENT) -> str:
    out = [_text(x + 8, 20, title, 14, INK, weight=600)]
    taken = None
    for i, (cond, _) in enumerate(checks):
        if eval(f"{value} {cond}"):  # noqa: S307 — literal comparisons of the figure
            taken = i
            break
    reached = len(checks) if taken is None else taken
    y = 40
    for i, (cond, label) in enumerate(checks):
        visited = i <= reached
        hit = i == taken
        color = INK if visited else FAINT
        out.append(
            f'<rect x="{x + 8}" y="{y}" width="168" height="38" rx="19" fill="#fff" '
            f'stroke="{accent if visited else FAINT}" stroke-width="{2 if visited else 1.25}"/>'
        )
        out.append(_mono(x + 92, y + 25, f"{var} {cond}", 14, color, "middle"))
        out.append(_arrow(x + 176, y + 19, x + 214, y + 19, accent if hit else FAINT))
        out.append(_text(x + 195, y + 12, "да", 12, accent if hit else MUTED, "middle"))
        out.append(
            f'<rect x="{x + 216}" y="{y}" width="100" height="38" rx="8" '
            f'fill="{WASH if hit else "#fff"}" stroke="{INK if hit else FAINT}" stroke-width="1.5"/>'
        )
        out.append(_text(x + 266, y + 25, label, 14, INK if hit else MUTED, "middle"))
        down = visited and not hit
        out.append(_arrow(x + 92, y + 38, x + 92, y + 66, accent if down else FAINT))
        out.append(_text(x + 100, y + 56, "нет", 12, accent if down else MUTED))
        y += 66
    hit = taken is None
    out.append(
        f'<rect x="{x + 42}" y="{y}" width="100" height="38" rx="8" '
        f'fill="{WASH if hit else "#fff"}" stroke="{INK if hit else FAINT}" stroke-width="1.5"/>'
    )
    out.append(_text(x + 92, y + 25, other, 14, INK if hit else MUTED, "middle"))
    return "".join(out)


def branch_svg(value: int = 73, wrong: int = 90, tone: str | None = None) -> str:
    """if/elif/else for score levels: the path of a value through the checks,
    and the same checks in the wrong order where «высокий» is unreachable."""
    good = [(">= 85", "высокий"), (">= 60", "средний")]
    bad = [(">= 60", "средний"), (">= 85", "высокий")]
    out = ['<svg viewBox="0 0 660 230" role="img" aria-label="Порядок проверок elif">']
    out.append(
        _branch_panel(
            0,
            f"score = {value}: верный порядок",
            "score",
            value,
            good,
            "начальный",
            accent_of(tone),
        )
    )
    out.append(
        _branch_panel(
            336,
            f"score = {wrong}: проверки переставлены",
            "score",
            wrong,
            bad,
            "начальный",
            accent_of(tone),
        )
    )
    out.append("</svg>")
    return "".join(out)


def loop_grid_svg(
    rows: int = 2,
    cols: int = 3,
    outer: str = "row",
    inner: str = "column",
    tone: str | None = None,
) -> str:
    """Order of the inner body in nested loops: each cell numbered by its turn."""
    accent = accent_of(tone)
    cw, ch = 104, 54
    x0, y0 = 150, 44
    out = [
        f'<svg viewBox="0 0 660 {y0 + rows * ch + 24}" role="img" aria-label="Порядок вложенных циклов">'
    ]
    for c in range(cols):
        out.append(_mono(x0 + c * cw + cw / 2, y0 - 14, f"{inner} = {c}", 13, MUTED, "middle"))
    for r in range(rows):
        y = y0 + r * ch
        out.append(_mono(x0 - 14, y + ch / 2 + 5, f"{outer} = {r}", 13, MUTED, "end"))
        for c in range(cols):
            x = x0 + c * cw
            turn = r * cols + c + 1
            out.append(
                f'<rect x="{x}" y="{y}" width="{cw - 6}" height="{ch - 6}" rx="8" fill="#fff" '
                f'stroke="{INK}" stroke-width="1.25"/>'
            )
            out.append(_mono(x + (cw - 6) / 2, y + 30, f"({r}, {c})", 15, INK, "middle"))
            out.append(_text(x + 8, y + 15, str(turn), 11, accent, weight=600))
    out.append("</svg>")
    return "".join(out)


def venn_svg(a=(1, 2, 3), b=(3, 4), tone: str | None = None) -> str:
    """Four small Euler diagrams of the same sets: the result of |, &, -, ^ in accent."""
    accent = accent_of(tone)
    a, b = set(a), set(b)
    ops = [("a | b", a | b), ("a & b", a & b), ("a - b", a - b), ("a ^ b", a ^ b)]
    out = ['<svg viewBox="0 0 660 190" role="img" aria-label="Операции над множествами">']
    for k, (label, res) in enumerate(ops):
        cx = 82 + k * 165
        la, rb = cx - 22, cx + 22
        out.append(
            f'<circle cx="{la}" cy="88" r="44" fill="none" stroke="{INK}" stroke-width="1.25"/>'
        )
        out.append(
            f'<circle cx="{rb}" cy="88" r="44" fill="none" stroke="{INK}" stroke-width="1.25"/>'
        )
        out.append(_text(la - 34, 40, "a", 13, MUTED, "middle"))
        out.append(_text(rb + 34, 40, "b", 13, MUTED, "middle"))
        groups = [(sorted(a - b), la - 20), (sorted(a & b), cx), (sorted(b - a), rb + 20)]
        for items, x in groups:
            for i, v in enumerate(items):
                y = 88 + (i - (len(items) - 1) / 2) * 22 + 6
                on = v in res
                out.append(
                    _text(
                        x,
                        y,
                        str(v),
                        17 if on else 15,
                        accent if on else FAINT,
                        "middle",
                        600 if on else 400,
                    )
                )
        out.append(_mono(cx, 160, label, 15, INK, "middle"))
        shown = "{" + ", ".join(map(str, sorted(res))) + "}"
        out.append(_mono(cx, 182, shown, 14, accent, "middle"))
    out.append("</svg>")
    return "".join(out)


def loop_to_comp_svg(tone: str | None = None) -> str:
    """The parts of a loop with append and of the same list comprehension,
    matched by colour: what to take, where from, which ones."""
    # «что взять» takes the course colour; «откуда» then turns violet so the three stay apart
    what = accent_of(tone)
    src = BLUE if tone is None else VIOLET
    parts = [
        ("result = []", [("result = []", MUTED)]),
        ("for n in range(1, 8):", [("for n in range(1, 8):", src)]),
        ("    if n % 2 == 0:", [("    ", INK), ("if n % 2 == 0:", GREEN)]),
        (
            "        result.append(n * n)",
            [("        result.append(", MUTED), ("n * n", what), (")", MUTED)],
        ),
    ]
    out = ['<svg viewBox="0 0 660 252" role="img" aria-label="Цикл и списковое включение">']
    char = 9.0
    for i, (_, spans) in enumerate(parts):
        x = 40
        for text, color in spans:
            out.append(_mono(x, 34 + i * 26, text, 15, color))
            x += len(text) * char
    comp = [
        ("result = [", MUTED),
        ("n * n", what),
        (" ", INK),
        ("for n in range(1, 8)", src),
        (" ", INK),
        ("if n % 2 == 0", GREEN),
        ("]", MUTED),
    ]
    x, y = 40, 178
    marks = []
    for text, color in comp:
        out.append(_mono(x, y, text, 15, color))
        if color in (what, src, GREEN):
            marks.append((x, x + len(text) * char, color))
        x += len(text) * char
    labels = {what: "что взять", src: "откуда", GREEN: "какие"}
    for x1, x2, color in marks:
        out.append(_bracket(x1, x2 - 4, y + 10, color))
        out.append(_text((x1 + x2) / 2, y + 38, labels[color], 13, color, "middle"))
    out.append(f'<line x1="40" y1="140" x2="620" y2="140" stroke="{FAINT}"/>')
    out.append("</svg>")
    return "".join(out)


def _cursor_frame(items, pos, code, result, was=None) -> str:
    cell, gap = 78, 8
    n = len(items)
    x0 = (660 - (n * cell + (n - 1) * gap)) / 2
    out = ['<svg viewBox="0 0 660 170" role="img" aria-hidden="true">']
    for k, label in enumerate(items):
        x = x0 + k * (cell + gap)
        done = k < pos
        now = was is not None and was <= k < pos
        stroke = ACCENT if now else FAINT if done else INK
        out.append(
            f'<rect x="{x:.1f}" y="16" width="{cell}" height="48" rx="8" '
            f'fill="{WASH if done else "#fff"}" stroke="{stroke}" stroke-width="{2 if now else 1.5}"/>'
        )
        out.append(_mono(x + cell / 2, 46, label, 16, MUTED if done and not now else INK, "middle"))
    cx = x0 + pos * (cell + gap) - gap / 2 if pos < n else x0 + n * (cell + gap) - gap / 2
    out.append(_arrow(cx, 98, cx, 70, ACCENT, width=2))
    out.append(_text(cx, 116, "позиция", 13, ACCENT, "middle"))
    if code:
        out.append(_mono(16, 150, code, 15, INK))
        out.append(_mono(644, 150, f"→ {result}", 15, ACCENT, "end"))
    out.append("</svg>")
    return "".join(out)


def cursor_frames(
    items, ops, start="Позиция в начале: ничего ещё не взято."
) -> list[tuple[str, str]]:
    """A source read by a cursor that only moves forward (a file, an iterator).
    ``ops`` — [code, how many elements it takes (or "rest"), result, caption]."""
    frames = [(_cursor_frame(items, 0, "", ""), start)]
    pos = 0
    for code, take, result, caption in ops:
        was, pos = pos, len(items) if take == "rest" else min(len(items), pos + take)
        frames.append((_cursor_frame(items, pos, code, result, was), caption))
    return frames


def cursor_stepper(items, ops, start="Позиция в начале: ничего ещё не взято.") -> str:
    return _stepper(cursor_frames(items, ops, start))


def range_try(mode: str = "range", start=2, stop=9, step=3, text: str = "ABCDEFG") -> str:
    """Sandbox for range(start, stop, step) or the slice s[start:stop:step]:
    the same drawing as range_svg / slice_svg, redrawn on input. Static without JS."""
    if mode == "range":
        static = range_svg(start, stop, step)
        fields = [("start", start), ("stop", stop), ("step", step)]
        text_field = ""
    else:
        static = slice_svg(text, start, stop, step)
        fields = [("start", start), ("stop", stop), ("step", step)]
        text_field = (
            '<label>Строка s <input class="rt-text" value="'
            + html.escape(text)
            + '" maxlength="10" spellcheck="false" autocomplete="off"></label>'
        )
    inputs = "".join(
        f'<label>{name} <input class="rt-num" data-f="{name}" value="{"" if v is None else v}" '
        'inputmode="numeric" autocomplete="off"></label>'
        for name, v in fields
    )
    note = (
        "Пустое поле start или stop в срезе означает «от края», как пропущенная граница."
        if mode != "range"
        else "Попробуй шаг −1, start меньше stop и шаг 0."
    )
    return (
        f'<div class="mask-try range-try" data-range-try data-mode="{mode}">'
        f'<div class="plate" data-svg>{static}</div>'
        f'<div class="rt-ctl" hidden><div class="mt-row">{text_field}{inputs}</div>'
        '<p class="mt-msg" aria-live="polite"></p>'
        f'<p class="mt-note">{note}</p></div></div>'
    )


RANGE_TRY_JS = r"""<script>
(function () {
  var NS = "http://www.w3.org/2000/svg", INK = "#17191e", MU = "#4d535e", OR = "#ff6a00", WASH = "#f3f3f1";
  function el(tag, a, text) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (text != null) e.textContent = text; return e; }
  function txt(x, y, s, size, color, anchor, weight) {
    return el("text", { x: x, y: y, "font-family": "Onest, system-ui, sans-serif", "font-size": size, fill: color,
      "text-anchor": anchor || "start", "font-weight": weight || 400, style: "font-variant-numeric:tabular-nums" }, s);
  }
  function rangeValues(a, b, st) { var out = []; if (st > 0) for (var v = a; v < b && out.length < 200; v += st) out.push(v); else for (var w = a; w > b && out.length < 200; w += st) out.push(w); return out; }
  // Python's slice.indices for a sequence of length n
  function sliceIdx(a, b, st, n) {
    function fix(v, def, lo, hi) { if (v === null) return def; if (v < 0) { v += n; if (v < lo) v = lo; } else if (v > hi) v = hi; return v; }
    var lo = st > 0 ? 0 : -1, hi = st > 0 ? n : n - 1;
    var s = fix(a, st > 0 ? 0 : n - 1, lo, hi), e = fix(b, st > 0 ? n : -1, lo, hi);
    return rangeValues(s, e, st);
  }
  function drawRange(a, b, st) {
    var vals = rangeValues(a, b, st), lo = Math.min(a, b) - 1, hi = Math.max(a, b) + 1, L = 30, R = 630, base = 70;
    var x = function (v) { return L + (v - lo) / (hi - lo) * (R - L); };
    var svg = el("svg", { viewBox: "0 0 660 120", role: "img", "aria-label": "Значения range" });
    svg.appendChild(el("line", { x1: L, y1: base, x2: R, y2: base, stroke: INK, "stroke-width": 1.5 }));
    var every = Math.ceil((hi - lo + 1) / 26);
    for (var v = lo; v <= hi; v++) {
      svg.appendChild(el("line", { x1: x(v), y1: base - 4, x2: x(v), y2: base + 4, stroke: MU }));
      if ((v - lo) % every === 0 || vals.indexOf(v) >= 0) svg.appendChild(txt(x(v), base + 26, String(v), 14, vals.indexOf(v) >= 0 ? INK : MU, "middle"));
    }
    vals.forEach(function (v, k) {
      svg.appendChild(el("circle", { cx: x(v), cy: base, r: 9, fill: WASH, stroke: OR, "stroke-width": 2 }));
      if (k) { var p = x(vals[k - 1]), q = x(v), m = (p + q) / 2;
        svg.appendChild(el("path", { d: "M " + p + " " + (base - 12) + " Q " + m + " " + (base - 42) + " " + q + " " + (base - 12), fill: "none", stroke: MU, "stroke-width": 1.25 }));
        if (Math.abs(q - p) > 26) svg.appendChild(txt(m, base - 34, (st > 0 ? "+" : "") + st, 12, MU, "middle")); }
    });
    svg.appendChild(el("line", { x1: x(b), y1: base - 20, x2: x(b), y2: base + 8, stroke: INK, "stroke-width": 1.5, "stroke-dasharray": "4 3" }));
    svg.appendChild(txt(Math.max(70, Math.min(590, x(b))), 18, "stop = " + b + ", не входит", 13, INK, "middle"));
    return svg;
  }
  function drawSlice(t, a, b, st) {
    var taken = sliceIdx(a, b, st, t.length), cell = 46, L = 30, top = 30, n = t.length;
    var svg = el("svg", { viewBox: "0 0 660 156", role: "img", "aria-label": "Срез строки " + t });
    for (var k = 0; k < n; k++) {
      var X = L + k * cell, on = taken.indexOf(k) >= 0;
      svg.appendChild(el("rect", { x: X, y: top, width: cell, height: cell, fill: on ? WASH : "#fff", stroke: on ? OR : INK, "stroke-width": on ? 2 : 1.25 }));
      svg.appendChild(txt(X + cell / 2, top + 30, t[k], 19, INK, "middle", 600));
      svg.appendChild(txt(X + cell / 2, top - 9, String(k), 13, MU, "middle"));
      svg.appendChild(txt(X + cell / 2, top + cell + 20, String(k - n), 13, MU, "middle"));
      if (on) svg.appendChild(txt(X + cell / 2, top + cell + 44, (taken.indexOf(k) + 1) + "-й", 13, OR, "middle"));
    }
    if (st > 0 && taken.length) [taken[0], taken[taken.length - 1] + 1].forEach(function (k) {
      svg.appendChild(el("line", { x1: L + k * cell, y1: top - 4, x2: L + k * cell, y2: top + cell + 4, stroke: INK, "stroke-width": 2.5 }));
    });
    return svg;
  }
  function num(v) { v = v.trim().replace("−", "-"); if (v === "") return null; return /^-?\d+$/.test(v) ? parseInt(v, 10) : NaN; }
  document.querySelectorAll("[data-range-try]").forEach(function (box) {
    var mode = box.dataset.mode, plate = box.querySelector("[data-svg]"), msg = box.querySelector(".mt-msg");
    var f = {}; box.querySelectorAll(".rt-num").forEach(function (i) { f[i.dataset.f] = i; });
    var ti = box.querySelector(".rt-text");
    function run() {
      var a = num(f.start.value), b = num(f.stop.value), st = num(f.step.value);
      if (st === null) st = 1;
      if ([a, b, st].some(function (v) { return v !== null && isNaN(v); })) { msg.textContent = "Нужны целые числа."; return; }
      if (st === 0) { msg.textContent = (mode === "range" ? "range" : "Срез") + " с шагом 0 — ошибка ValueError: шаг не может быть нулём."; return; }
      if (mode === "range") {
        if (a === null || b === null) { msg.textContent = "Для range заполни start и stop."; return; }
        if (Math.abs(b - a) > 60) { msg.textContent = "Возьми границы поближе: не дальше 60 друг от друга."; return; }
        var vals = rangeValues(a, b, st);
        plate.replaceChildren(drawRange(a, b, st));
        msg.textContent = "list(range(" + a + ", " + b + ", " + st + ")) → [" + vals.join(", ") + "]" + (vals.length ? "" : " — пусто: при шаге " + (st > 0 ? "+" : "") + st + " уже первое значение " + a + (st > 0 ? " не меньше " : " не больше ") + "stop " + b + ".");
      } else {
        var t = ti.value.slice(0, 10) || "A";
        var taken = sliceIdx(a, b, st, t.length);
        plate.replaceChildren(drawSlice(t, a, b, st));
        var spec = (a === null ? "" : a) + ":" + (b === null ? "" : b) + (st === 1 ? "" : ":" + st);
        msg.textContent = "s[" + spec + "] → '" + taken.map(function (k) { return t[k]; }).join("") + "'" + (taken.length ? "" : " — пустой срез, это не ошибка.");
      }
    }
    box.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", run); });
    box.querySelector(".rt-ctl").hidden = false; run();
  });
})();
</script>"""

# --- Course basics (lessons 1–5): concepts shown, not only told ---------------

ERR = "#b3261e"  # error text, as the red of an error in the output field
CH = 0.6  # JetBrains Mono advance per font-size unit


def _box(x, y, w, h, stroke=INK, fill="#fff", rx=8, sw=1.5, dashed=False) -> str:
    dash = ' stroke-dasharray="5 4"' if dashed else ""
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{dash}/>'
    )


def _svg(h, label, w=660) -> str:
    return f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{html.escape(label)}">'


def program_path_svg(tone: str | None = None) -> str:
    """Task → algorithm → source code → interpreter → output for 3 × 40."""
    accent = accent_of(tone)
    cards = [
        ("Задача", ["Сколько стоят", "3 тетради", "по 40 ₽?"], False),
        ("Алгоритм", ["взять 3 и 40,", "перемножить,", "показать ответ"], False),
        ("Исходный код", ["main.py", "print(3 * 40)"], True),
        ("Интерпретатор", ["Python читает", "строки по одной", "и выполняет"], False),
        ("Вывод", ["120"], False),
    ]
    w, gap, x0, y = 112, 20, 10, 18
    out = [_svg(212, "Путь от задачи до вывода")]
    for k, (title, lines, code) in enumerate(cards):
        x = x0 + k * (w + gap)
        out.append(_box(x, y, w, 118, accent if k == 2 else INK, sw=2 if k == 2 else 1.5))
        out.append(_text(x + w / 2, y + 24, title, 14, INK, "middle", 600))
        if code:
            out.append(_text(x + w / 2, y + 56, lines[0], 12, MUTED, "middle"))
            out.append(_mono(x + w / 2, y + 80, lines[1], 12.5, INK, "middle"))
        elif title == "Вывод":
            out.append(_mono(x + w / 2, y + 78, lines[0], 26, INK, "middle", 600))
        else:
            for i, s in enumerate(lines):
                out.append(_text(x + w / 2, y + 54 + i * 19, s, 13, INK, "middle"))
        if k:
            out.append(_arrow(x - gap + 2, y + 59, x - 2, y + 59, MUTED))
    groups = [
        (0, 1, "думает человек"),
        (2, 2, "пишет человек"),
        (3, 4, "делает компьютер"),
    ]
    for a, b, label in groups:
        x1, x2 = x0 + a * (w + gap) + 6, x0 + b * (w + gap) + w - 6
        out.append(_bracket(x1, x2, 150))
        out.append(_text((x1 + x2) / 2, 180, label, 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def _window(x, y, w, h, title, lines, title_size: float = 13) -> str:
    """A program window: title bar and monospace lines (text, colour)."""
    out = [_box(x, y, w, h, INK, rx=10)]
    out.append(f'<path d="M {x} {y + 30} H {x + w}" stroke="{FAINT}"/>')
    for i in range(3):
        out.append(f'<circle cx="{x + 16 + i * 13}" cy="{y + 15}" r="4" fill="{FAINT}"/>')
    out.append(_text(x + 54, y + 20, title, title_size, MUTED))
    for i, (s, color) in enumerate(lines):
        out.append(_mono(x + 14, y + 56 + i * 22, s, 13, color))
    return "".join(out)


def tools_svg(tone: str | None = None) -> str:
    """Editor, terminal and the Python shell: where code is written and run."""
    accent = accent_of(tone)
    out = [_svg(232, "Редактор, терминал и интерактивный режим Python")]
    out.append(
        _window(
            8,
            8,
            204,
            150,
            "Редактор: main.py",
            [('print("Привет!")', INK), ("print(3 * 40)", INK)],
        )
    )
    out.append(
        _window(
            228,
            8,
            204,
            150,
            "Терминал",
            [("> python main.py", accent), ("Привет!", INK), ("120", INK)],
        )
    )
    out.append(
        _window(448, 8, 204, 150, "Интерактивный режим", [(">>> 3 * 40", accent), ("120", INK)], 12)
    )
    notes = [
        ("пишем и сохраняем", "текст программы"),
        ("команда запускает", "файл целиком"),
        ("Python-код по строке;", "ответ виден сразу"),
    ]
    for k, (a, b) in enumerate(notes):
        cx = 110 + k * 220
        out.append(_text(cx, 186, a, 13, INK, "middle"))
        out.append(_text(cx, 206, b, 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def expr_fate_svg(tone: str | None = None) -> str:
    """A value computed in a file: lost without print, shown with print."""
    accent = accent_of(tone)
    out = [_svg(150, "Куда попадает значение выражения")]
    rows = [("3 * 40", False), ("print(3 * 40)", True)]
    for k, (code, shown) in enumerate(rows):
        y = 16 + k * 66
        w = len(code) * 15 * CH + 28
        out.append(_box(16, y, w, 44, INK))
        out.append(_mono(30, y + 28, code, 15))
        vx = 16 + w + 96
        out.append(_arrow(16 + w + 6, y + 22, vx - 6, y + 22, MUTED))
        out.append(_text((16 + w + vx) / 2, y + 12, "вычисляет", 12, MUTED, "middle"))
        out.append(_box(vx, y, 64, 44, INK, WASH))
        out.append(_mono(vx + 32, y + 28, "120", 16, INK, "middle", 600))
        tx = vx + 64
        if shown:
            out.append(_arrow(tx + 6, y + 22, tx + 70, y + 22, accent))
            out.append(_box(tx + 76, y, 150, 44, accent, sw=2))
            out.append(_text(tx + 90, y + 18, "экран", 12, MUTED))
            out.append(_mono(tx + 90, y + 36, "120", 14))
        else:
            out.append(
                f'<line x1="{tx + 6}" y1="{y + 22}" x2="{tx + 64}" y2="{y + 22}" '
                f'stroke="{FAINT}" stroke-width="1.5" stroke-dasharray="5 4"/>'
            )
            out.append(_text(tx + 76, y + 27, "никуда не попадает", 14, MUTED))
    out.append("</svg>")
    return "".join(out)


def error_stages_svg() -> str:
    """Where each kind of error shows up: parsing, running, checking the answer."""
    cols = [
        (
            "1. Разбор записи",
            "до первой строки",
            "print(3 * 40",
            ("SyntaxError", ERR),
            ["не выполнится", "ни одна строка"],
        ),
        (
            "2. Выполнение",
            "строка за строкой",
            "pritn(3 * 40)",
            ("NameError", ERR),
            ["строки выше уже", "выполнены"],
        ),
        (
            "3. Сверка ответа",
            "делаешь ты",
            "print(3 + 40)",
            ("43", INK),
            ["Python молчит:", "логическая ошибка"],
        ),
    ]
    w, gap = 192, 30  # three columns and two gaps inside the 660 width
    x0 = (660 - 3 * w - 2 * gap) / 2
    out = [_svg(250, "Где обнаруживаются три вида ошибок")]
    for k, (title, when, code, (res, color), note) in enumerate(cols):
        x = x0 + k * (w + gap)
        out.append(_text(x, 20, title, 15, INK, weight=600))
        out.append(_text(x, 40, when, 13, MUTED))
        out.append(_box(x, 54, w, 40, INK))
        out.append(_mono(x + 12, 79, code, 14))
        out.append(_arrow(x + w / 2, 96, x + w / 2, 122, MUTED))
        out.append(_box(x, 124, w, 40, color, WASH if color == ERR else "#fff"))
        out.append(_mono(x + 12, 149, res, 14, color, weight=600))
        if color == INK:
            out.append(_text(x + 40, 149, "вместо 120", 13, MUTED))
        for i, s in enumerate(note):
            out.append(_text(x, 190 + i * 19, s, 13, MUTED))
        if k:
            out.append(_arrow(x - gap + 4, 74, x - 4, 74, FAINT))
    out.append(
        _text(
            8,
            244,
            "Запись разобрана — начинается выполнение; выполнилась — сверяй ответ.",
            13,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


def traceback_svg(tone: str | None = None) -> str:
    """The parts of a traceback and the order to read them."""
    accent = accent_of(tone)
    lines = [
        ("Traceback (most recent call last):", None, "дальше — путь к ошибке"),
        ('  File "main.py", line 2, in <module>', 2, "файл и номер строки"),
        ("    print(120 / 0)", 3, "сама строка программы"),
        ("          ~~~~^~~", None, "виновная часть выражения"),
        ("ZeroDivisionError: division by zero", 1, "тип и пояснение"),
    ]
    out = [_svg(196, "Из чего состоит сообщение об ошибке")]
    out.append(_box(8, 8, 348, 178, FAINT, WASH, rx=10))
    for i, (s, order, note) in enumerate(lines):
        y = 38 + i * 32
        color = ERR if order == 1 else INK
        out.append(_mono(20, y, s, 12.5, color, weight=600 if order == 1 else 500))
        end = 20 + len(s) * 12.5 * CH + 6
        out.append(
            f'<line x1="{end:.1f}" y1="{y - 4}" x2="{392}" y2="{y - 4}" stroke="{FAINT}" '
            'stroke-dasharray="2 3"/>'
        )
        if order:
            out.append(
                f'<circle cx="408" cy="{y - 4}" r="11" fill="#fff" '
                f'stroke="{accent if order == 1 else INK}" stroke-width="1.5"/>'
            )
            out.append(_text(408, y + 1, str(order), 13, INK, "middle", 600))
        out.append(_text(428, y, note, 14, INK if order else MUTED))
    out.append("</svg>")
    return "".join(out)


def code_loop_svg(tone: str | None = None) -> str:
    """How to work with code: write, run, compare with the expected output, explain."""
    accent = accent_of(tone)
    steps = [
        ("Написать", ["или изменить", "одну деталь"]),
        ("Запустить", ["файл целиком", "или фрагмент"]),
        ("Сравнить", ["вывод с тем,", "что ожидал"]),
        ("Объяснить", ["почему вышло", "именно так"]),
    ]
    w, gap, x0, y, h = 138, 26, 15, 16, 92
    out = [_svg(186, "Цикл работы с кодом: написать, запустить, сравнить, объяснить")]
    for k, (title, lines) in enumerate(steps):
        x = x0 + k * (w + gap)
        key = k == 2
        out.append(_box(x, y, w, h, accent if key else INK, sw=2 if key else 1.5))
        out.append(_text(x + w / 2, y + 30, title, 15, accent if key else INK, "middle", 600))
        for i, line in enumerate(lines):
            out.append(_text(x + w / 2, y + 56 + i * 19, line, 13, MUTED, "middle"))
        if k:
            out.append(_arrow(x - gap + 2, y + h / 2, x - 2, y + h / 2, MUTED))
    # back from «Объяснить» to «Написать»: the loop repeats
    right = x0 + 3 * (w + gap) + w / 2
    left = x0 + w / 2
    bottom = y + h + 34
    out.append(
        f'<path d="M {right:.1f} {y + h + 2:.1f} V {bottom} H {left:.1f} V {y + h + 14:.1f}" '
        f'fill="none" stroke="{MUTED}" stroke-width="1.5"/>'
    )
    out.append(_arrow(left, y + h + 16, left, y + h + 2, MUTED))
    out.append(
        _text(
            330,
            bottom + 24,
            "повторяй, пока вывод не совпадёт и причина не станет ясна",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


def code_block_anatomy_svg(tone: str | None = None) -> str:
    """What the parts of a code block on the page mean."""
    accent = accent_of(tone)
    out = [_svg(220, "Из чего состоит блок кода на странице")]
    x, y, w = 8, 8, 352
    out.append(_box(x, y, w, 196, FAINT, "#fff", rx=10))
    out.append(f'<path d="M {x} {y + 34} H {x + w}" stroke="{FAINT}"/>')
    out.append(_mono(x + 16, y + 23, "main.py", 13, MUTED))
    code = [
        ("# три тетради по 40 рублей", MUTED),
        ("print(3 * 40)", INK),
        ("print(120 / 0)", INK),
    ]
    for i, (line, color) in enumerate(code):
        out.append(_mono(x + 16, y + 62 + i * 24, line, 13, color))
    out.append(f'<path d="M {x} {y + 126} H {x + w}" stroke="{FAINT}"/>')
    out.append(_text(x + 16, y + 150, "Вывод", 12, MUTED))
    out.append(_mono(x + 72, y + 150, "120", 13, INK))
    out.append(_mono(x + 72, y + 176, "ZeroDivisionError: division by zero", 11, ERR, weight=600))
    marks = [
        (y + 19, "имя файла"),
        (y + 58, "пояснение после #"),
        (y + 94, "код программы"),
        (y + 146, "«Вывод» программы"),
        (y + 172, "ошибка — красным"),
    ]
    for k, (my, note) in enumerate(marks, 1):
        out.append(
            f'<line x1="{x + w + 6}" y1="{my}" x2="{392}" y2="{my}" stroke="{FAINT}" '
            'stroke-dasharray="2 3"/>'
        )
        out.append(
            f'<circle cx="408" cy="{my}" r="11" fill="#fff" stroke="{accent}" stroke-width="1.5"/>'
        )
        out.append(_text(408, my + 5, str(k), 13, INK, "middle", 600))
        out.append(_text(428, my + 5, note, 13.5, INK))
    out.append("</svg>")
    return "".join(out)


TYPES = [
    ("int", "целое число", ["0", "18", "-7"], "количество"),
    ("float", "дробное число", ["2.5", "-0.125"], "измерения"),
    ("str", "строка", ['"Python"', '"27"', '""'], "любой текст"),
    ("bool", "логическое", ["True", "False"], "ответ «да / нет»"),
    ("NoneType", "нет значения", ["None"], "результата нет"),
]


def type_cards_svg(names=None) -> str:
    """The first types: examples of values and what each is for. ``names`` picks
    the cards; the figure is as wide as its cards, so three fit a phone."""
    types = [t for t in TYPES if names is None or t[0] in names]
    # five cards and four gaps fill the 660 width; three narrower ones fit a phone
    w, gap = (118, 13) if len(types) > 3 else (100, 10)
    width = round(len(types) * (w + gap) - gap + 18)
    x0 = (width - len(types) * w - (len(types) - 1) * gap) / 2
    out = [_svg(232, "Первые типы значений", width)]
    for k, (name, ru, examples, use) in enumerate(types):
        x = x0 + k * (w + gap)
        out.append(_mono(x + w / 2, 22, name, 16, INK, "middle", 600))
        out.append(_text(x + w / 2, 42, ru, 13, MUTED, "middle"))
        out.append(_box(x, 54, w, 128, FAINT, WASH, rx=10))
        for i, v in enumerate(examples):
            bw = max(44, len(v) * 14 * CH + 20)
            out.append(_box(x + (w - bw) / 2, 64 + i * 38, bw, 30, INK))
            out.append(_mono(x + w / 2, 84 + i * 38, v, 14, INK, "middle"))
        out.append(_text(x + w / 2, 206, use, 13, INK, "middle"))
    out.append("</svg>")
    return "".join(out)


def _cells(x, y, chars, cell=34, stroke=INK) -> str:
    out = []
    for i, c in enumerate(chars):
        out.append(_box(x + i * cell, y, cell, cell, stroke, "#fff", rx=0, sw=1.25))
        out.append(_mono(x + i * cell + cell / 2, y + 23, c, 16, INK, "middle", 600))
    return "".join(out)


def plus_types_svg(tone: str | None = None) -> str:
    """One sign, two actions: numbers add up, strings are glued."""
    accent = accent_of(tone)
    out = [_svg(150, "Плюс для чисел и для строк")]
    out.append(_text(16, 22, "Числа: 27 + 3", 14, INK, weight=600))
    out.append(_box(16, 44, 64, 40, INK))
    out.append(_mono(48, 70, "27", 17, INK, "middle", 600))
    out.append(_text(98, 70, "+", 18, MUTED, "middle"))
    out.append(_box(116, 44, 48, 40, INK))
    out.append(_mono(140, 70, "3", 17, INK, "middle", 600))
    out.append(_arrow(172, 64, 212, 64, MUTED))
    out.append(_box(220, 44, 64, 40, accent, WASH, sw=2))
    out.append(_mono(252, 70, "30", 17, INK, "middle", 600))
    out.append(_text(16, 118, "складываются: получается новое число", 13, MUTED))
    x = 350
    out.append(_text(x, 22, 'Строки: "27" + "3"', 14, INK, weight=600))
    out.append(_cells(x, 47, "27"))
    out.append(_text(x + 84, 70, "+", 18, MUTED, "middle"))
    out.append(_cells(x + 102, 47, "3"))
    out.append(_arrow(x + 144, 64, x + 180, 64, MUTED))
    out.append(_cells(x + 188, 47, "273", stroke=accent))
    out.append(_text(x, 118, "склеиваются: символы встают подряд", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


def assign_svg(tone: str | None = None) -> str:
    """cost = price * quantity: the right side first, then the name."""
    accent = accent_of(tone)
    out = [_svg(196, "Порядок выполнения присваивания")]
    code = "cost = price * quantity"
    cw = 18 * CH
    x0 = 330 - len(code) * cw / 2
    out.append(_mono(x0, 30, code, 18, INK, weight=600))
    out.append(_bracket(x0 + 7 * cw, x0 + len(code) * cw, 40, MUTED))
    out.append(_bracket(x0, x0 + 4 * cw, 40, accent))
    # step 1: the right side is computed from the current values
    y = 70
    out.append(_text(16, y + 16, "1. Правая часть", 14, INK, weight=600))
    out.append(_text(16, y + 34, "вычисляется первой", 13, MUTED))
    x = 160
    for name, value in [("price", "40"), ("quantity", "3")]:
        out.append(_box(x, y, 84, 34, INK))
        out.append(_text(x + 42, y + 22, name, 14, INK, "middle", 600))
        out.append(_arrow(x + 84, y + 17, x + 106, y + 17, MUTED))
        out.append(_box(x + 108, y, 40, 34, INK))
        out.append(_mono(x + 128, y + 22, value, 14, INK, "middle"))
        x += 166
    out.append(_mono(x + 4, y + 22, "40 * 3 → 120", 14, INK, weight=600))
    # step 2: the name is bound to the finished value
    y = 136
    out.append(_text(16, y + 16, "2. Имя слева", 14, accent, weight=600))
    out.append(_text(16, y + 34, "связывается с итогом", 13, MUTED))
    out.append(_box(160, y, 84, 38, accent, sw=2))
    out.append(_text(202, y + 24, "cost", 15, accent, "middle", 600))
    out.append(_arrow(244, y + 19, 290, y + 19, accent))
    out.append(_box(294, y, 60, 38, INK, WASH))
    out.append(_mono(324, y + 24, "120", 15, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def bind_strip_svg(
    code=("x = 5", "y = x + 2", "x = 100"), names=("x", "y"), tone: str | None = None
) -> str:
    """Names after each line of a short program: values change, formulas are not kept.
    The name the line binds is accented; the figure is as wide as its panels."""
    accent = accent_of(tone)
    env: dict = {}
    states = []
    for line in code:
        before = dict(env)
        exec(line, {}, env)  # noqa: S102 — literal lines of the figure
        states.append((line, dict(env), {n for n in env if env.get(n) != before.get(n)}))
    w, gap = 200, 30
    height = 78 + len(names) * 54
    width = 8 + (len(states) - 1) * (w + gap) + 192
    out = [_svg(height, "Значения имён после каждой строки", width)]
    for k, (line, env_k, changed) in enumerate(states):
        x = 8 + k * (w + gap)
        out.append(_text(x, 18, f"после строки {k + 1}", 13, MUTED))
        out.append(_mono(x, 42, line, 15, INK, weight=600))
        for i, n in enumerate(names):
            y = 62 + i * 54
            if n not in env_k:
                out.append(_box(x, y, 64, 38, FAINT, dashed=True))
                out.append(_text(x + 32, y + 25, n, 15, MUTED, "middle"))
                out.append(_text(x + 76, y + 25, "ещё нет", 13, MUTED))
                continue
            hot = n in changed
            color = accent if hot else INK
            out.append(_box(x, y, 64, 38, color, sw=2 if hot else 1.5))
            out.append(_text(x + 32, y + 25, n, 15, color, "middle", 600))
            out.append(_arrow(x + 64, y + 19, x + 104, y + 19, color))
            out.append(_box(x + 108, y, 64, 38, INK, WASH if hot else "#fff"))
            out.append(_mono(x + 140, y + 25, str(env_k[n]), 15, INK, "middle", 600))
        if k:
            out.append(f'<path d="M {x - gap / 2} 8 V {height - 14}" stroke="{FAINT}"/>')
    out.append("</svg>")
    return "".join(out)


def floor_line_svg(tone: str | None = None) -> str:
    """// rounds down, int() cuts towards zero: equal for 23 / 5, apart for −7 / 3."""
    accent = accent_of(tone)
    out = [_svg(232, "Округление вниз и отбрасывание дробной части")]
    rows = [(23, 5, 2, 7), (-7, 3, -5, 1)]
    for k, (a, b, lo, hi) in enumerate(rows):
        top = 18 + k * 112
        exact = a / b
        L, R = 60, 620
        base = top + 62

        def x(v, lo=lo, hi=hi, L=L, R=R):
            return L + (v - lo) / (hi - lo) * (R - L)

        title = f"{a} / {b} = {exact:.3g}".replace("-", "−")
        out.append(_text(16, top + 4, title, 15, INK, weight=600))
        out.append(
            f'<line x1="{L - 20}" y1="{base}" x2="{R + 20}" y2="{base}" '
            f'stroke="{INK}" stroke-width="1.5"/>'
        )
        for v in range(lo, hi + 1):
            out.append(
                f'<line x1="{x(v):.1f}" y1="{base - 5}" x2="{x(v):.1f}" y2="{base + 5}" '
                f'stroke="{MUTED}"/>'
            )
            label = str(v).replace("-", "−")
            out.append(_text(x(v), base + 24, label, 14, INK if v == 0 else MUTED, "middle"))
        floor, trunc = a // b, int(a / b)
        out.append(f'<circle cx="{x(exact):.1f}" cy="{base}" r="6" fill="{INK}"/>')
        out.append(_arrow(x(exact) - 8, base - 14, x(floor) + 2, base - 14, accent, width=2))
        both = " и int()" if trunc == floor else ""
        label = f"//{both} → {floor}".replace("-", "−")
        out.append(_text(x(floor), base - 24, label, 14, accent, "middle", 600))
        if trunc != floor:
            out.append(_arrow(x(exact) + 8, base - 14, x(trunc) - 2, base - 14, INK, width=2))
            label = f"int() → {trunc}, к нулю".replace("-", "−")
            out.append(_text(x(trunc) + 4, base - 24, label, 14, INK, "start", 600))
    out.append("</svg>")
    return "".join(out)


_OPS = {
    "Add": "+",
    "Sub": "−",
    "Mult": "×",
    "Div": "/",
    "FloorDiv": "//",
    "Mod": "%",
    "Pow": "**",
    "USub": "−",
}


def _tree(node):
    """(label, value, children) of an arithmetic expression, computed exactly."""
    import ast

    if isinstance(node, ast.Constant):
        return (str(node.value), node.value, [])
    if isinstance(node, ast.UnaryOp):
        child = _tree(node.operand)
        value = eval(f"-({child[1]!r})")  # noqa: S307 — literal numbers
        return (_OPS[type(node.op).__name__], value, [child])
    left, right = _tree(node.left), _tree(node.right)
    op = _PY[type(node.op).__name__]
    value = eval(f"{left[1]!r} {op} {right[1]!r}")  # noqa: S307 — literal numbers
    return (_OPS[type(node.op).__name__], value, [left, right])


_PY = {
    "Add": "+",
    "Sub": "-",
    "Mult": "*",
    "Div": "/",
    "FloorDiv": "//",
    "Mod": "%",
    "Pow": "**",
}


def _place(t, depth, leaves):
    """Leaves get consecutive slots, a node sits over the middle of its branches."""
    kids = t[2]
    if not kids:
        leaves.append(t)
        return (len(leaves) - 1, depth, t, [])
    placed = [_place(c, depth + 1, leaves) for c in kids]
    return (sum(p[0] for p in placed) / len(placed), depth, t, placed)


def _draw_tree(p, cx0, gapx, out, top=True, accent=ACCENT) -> None:
    pos, depth, (label, value, kids), placed = p
    x, y = cx0 + pos * gapx, 62 + depth * 58
    for c in placed:
        out.append(
            f'<line x1="{x:.1f}" y1="{y + 14}" x2="{cx0 + c[0] * gapx:.1f}" '
            f'y2="{62 + c[1] * 58 - 16}" stroke="{MUTED}"/>'
        )
        _draw_tree(c, cx0, gapx, out, top=False, accent=accent)
    if kids:
        out.append(
            f'<circle cx="{x:.1f}" cy="{y}" r="16" fill="#fff" '
            f'stroke="{accent if top else INK}" stroke-width="{2 if top else 1.5}"/>'
        )
        out.append(_mono(x, y + 5, label, 14, INK, "middle", 600))
        shown = f"= {value}".replace("-", "−")
        out.append(_text(x + 22, y + 5, shown, 13, accent if top else MUTED))
    else:
        out.append(_box(x - 17, y - 15, 34, 30, INK, WASH))
        out.append(_mono(x, y + 5, label, 14, INK, "middle", 600))


def expr_trees_svg(
    sources=("2 + 3 * 4", "2 ** 3 ** 2", "-3 ** 2"), tone: str | None = None
) -> str:
    """Expression trees: an operation is applied to the values of its branches,
    lower branches first; each node shows the value it produces."""
    import ast

    accent = accent_of(tone)

    slot = 660 / len(sources)
    out = [_svg(262, "Деревья выражений")]
    for s, src in enumerate(sources):
        tree = _tree(ast.parse(src, mode="eval").body)
        if tree[1] != eval(src):  # noqa: S307 — the figure must agree with Python
            raise SystemExit(f"expr_trees: {src} disagrees with Python")
        leaves: list = []
        root = _place(tree, 0, leaves)
        n = len(leaves)
        gapx = min(62, (slot - 40) / (n - 1)) if n > 1 else 0
        cx0 = s * slot + slot / 2 - gapx * (n - 1) / 2
        out.append(_mono(s * slot + slot / 2, 22, src, 15, INK, "middle", 600))
        _draw_tree(root, cx0, gapx, out, accent=accent)
        if s:
            out.append(f'<path d="M {s * slot:.1f} 8 V 250" stroke="{FAINT}"/>')
    out.append("</svg>")
    return "".join(out)


def _bool_node(node, env):
    """(label, value, children) of a condition: comparisons and arithmetic are
    leaves with their source, ``not`` / ``and`` / ``or`` are operations."""
    import ast

    value = eval(ast.unparse(node), {}, dict(env))  # noqa: S307 — literal conditions
    if isinstance(node, ast.BoolOp):
        op = "and" if isinstance(node.op, ast.And) else "or"
        return (op, value, [_bool_node(v, env) for v in node.values])
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.Not):
        return ("not", value, [_bool_node(node.operand, env)])
    return (ast.unparse(node), value, [])


def bool_tree_svg(sources, env, tone: str | None = None) -> str:
    """Trees of logical expressions with the values of every part: comparisons
    are the leaves, ``not`` / ``and`` / ``or`` are applied to the values under
    them, so the order of the operations is the shape of the tree."""
    import ast

    accent = accent_of(tone)
    size, gap, step, top = 13, 16, 74, 64
    trees = [_bool_node(ast.parse(src, mode="eval").body, env) for src in sources]

    def leaf_w(label):
        return len(label) * size * CH + 20

    def layout(t, depth, x, out):
        """Leaves left to right from x; a node over the middle of its children.
        Returns (centre, right edge)."""
        label, value, kids = t
        if not kids:
            w = leaf_w(label)
            out.append((x + w / 2, depth, t, w, []))
            return x + w / 2, x + w
        centres, right = [], x
        placed = []
        for k in kids:
            c, right = layout(k, depth + 1, right, placed)
            centres.append(c)
            right += gap
        out.extend(placed)
        centre = sum(centres) / len(centres)
        out.append((centre, depth, t, 0, centres))
        return centre, right - gap

    plans, widths = [], []
    for t in trees:
        nodes: list = []
        _, right = layout(t, 0, 0, nodes)
        plans.append(nodes)
        # an operation writes «= value» to its right: the tree is as wide as that
        labels = [n[0] + 30 + len(f"= {n[2][1]}") * 13 * CH for n in nodes if n[2][2]]
        widths.append(max([right, *labels]))
    depth = max(n[1] for nodes in plans for n in nodes)
    height = top + depth * step + 58
    spare = (660 - sum(widths)) / (len(trees) + 1)
    out = [_svg(height, "Порядок not, and, or в условии")]
    x0 = spare
    for k, (src, nodes, w) in enumerate(zip(sources, plans, widths, strict=True)):
        out.append(_mono(x0 + w / 2, 20, src, 13, INK, "middle", 600))
        names = ", ".join(f"{n} = {v}" for n, v in env.items() if n in src)
        out.append(_text(x0 + w / 2, 40, names, 13, MUTED, "middle"))
        root = max(nodes, key=lambda n: -n[1])
        for cx, d, (label, value, kids), lw, centres in nodes:
            x, y = x0 + cx, top + d * step
            if kids:
                for c in centres:
                    child = next(n for n in nodes if n[0] == c and n[1] == d + 1)
                    cy = top + child[1] * step - (16 if child[2][2] else 15)
                    out.append(
                        f'<line x1="{x:.1f}" y1="{y + 15}" x2="{x0 + c:.1f}" y2="{cy}" '
                        f'stroke="{MUTED}"/>'
                    )
                is_root = d == root[1]
                out.append(
                    _box(x - 24, y - 15, 48, 30, accent if is_root else INK, "#fff", rx=15,
                         sw=2 if is_root else 1.5)
                )
                out.append(_mono(x, y + 5, label, 13, INK, "middle", 600))
                out.append(
                    _mono(x + 30, y + 5, f"= {value}", 13, accent if is_root else MUTED,
                          "start", 600 if is_root else 500)
                )
            else:
                out.append(_box(x - lw / 2, y - 15, lw, 30, INK, WASH))
                out.append(_mono(x, y + 5, label, size, INK, "middle"))
                out.append(_mono(x, y + 34, str(value), 12, MUTED, "middle"))
        if k:
            sep = x0 - spare / 2
            out.append(f'<path d="M {sep:.1f} 8 V {height - 8}" stroke="{FAINT}"/>')
        x0 += w + spare
    out.append("</svg>")
    return "".join(out)


def code_paths_svg(panels, tone: str | None = None) -> str:
    """Which lines of a short program run: each panel is a program run once;
    executed lines are marked, skipped ones faded, blocks shown by their
    indent guide, and the output written under the code."""
    import contextlib
    import io
    import sys

    accent = accent_of(tone)
    size, line_h, top = 13, 24, 58
    n = len(panels)
    slot = 660 / n
    longest = max(len(p[1].splitlines()) for p in panels)
    outs = []
    for _, code in panels:
        ran: set[int] = set()

        def tracer(frame, event, arg, ran=ran):
            if frame.f_code.co_filename == "<figure>" and event == "line":
                ran.add(frame.f_lineno)
            return tracer

        printed = io.StringIO()
        sys.settrace(tracer)
        try:
            with contextlib.redirect_stdout(printed):
                exec(compile(code, "<figure>", "exec"), {})  # noqa: S102 — the figure's program
        finally:
            sys.settrace(None)
        lines = code.splitlines()
        # «else:» has no line event of its own: it ran if its block did
        for i, line in enumerate(lines, 1):
            if line.strip() == "else:" and i + 1 in ran:
                ran.add(i)
        outs.append((lines, ran, printed.getvalue().splitlines()))
    height = top + longest * line_h + 30 + max(len(o[2]) for o in outs) * 20 + 10
    out = [_svg(height, "Какие строки программы выполняются")]
    for k, ((title, _), (lines, ran, printed)) in enumerate(zip(panels, outs, strict=True)):
        x0 = k * slot + 16
        out.append(_text(x0, 22, title, 14, INK, weight=600))
        y = top
        for i, line in enumerate(lines, 1):
            done = i in ran
            if line.startswith("    "):
                out.append(
                    f'<path d="M {x0 + 20:.1f} {y - 17} V {y + 7}" stroke="{FAINT}" '
                    f'stroke-width="2"/>'
                )
            if done:
                out.append(f'<circle cx="{x0 + 4}" cy="{y - 5}" r="3.5" fill="{accent}"/>')
            out.append(_mono(x0 + 16, y, line, size, INK if done else FAINT))
            y += line_h
        y += 8
        out.append(_text(x0 + 16, y + 6, "вывод:", 12, MUTED))
        for s in printed:
            y += 20
            out.append(_mono(x0 + 16, y + 6, s, size, INK, weight=600))
        if k:
            out.append(f'<path d="M {k * slot:.1f} 8 V {height - 8}" stroke="{FAINT}"/>')
    out.append("</svg>")
    return "".join(out)


def loop_checks_svg(code, names, tone: str | None = None) -> str:
    """A while loop as the strip of its condition checks: the names before each
    check and the answer of the condition — True runs the body, the last False
    leaves the loop; the output after the loop is written under the strip."""
    import contextlib
    import io
    import sys

    accent = accent_of(tone)
    lines = code.splitlines()
    at = next(i for i, line in enumerate(lines, 1) if line.startswith("while "))
    cond = lines[at - 1][len("while ") :].rstrip(":")
    checks: list = []

    def tracer(frame, event, arg):
        if frame.f_code.co_filename == "<figure>" and event == "line" and frame.f_lineno == at:
            env = dict(frame.f_locals)
            checks.append(([(n, env.get(n)) for n in names], eval(cond, {}, env)))  # noqa: S307
        return tracer

    printed = io.StringIO()
    sys.settrace(tracer)
    try:
        with contextlib.redirect_stdout(printed):
            exec(compile(code, "<figure>", "exec"), {})  # noqa: S102 — the figure's program
    finally:
        sys.settrace(None)
    n = len(checks)
    gap, top, h = 36, 44, 128
    w = (628 - (n - 1) * gap) / n
    out = [_svg(top + h + 54, "Значения перед каждой проверкой условия")]
    out.append(_text(16, 22, "значения перед каждой проверкой условия", 13, MUTED))
    for k, (values, ok) in enumerate(checks):
        x = 16 + k * (w + gap)
        last = not ok
        out.append(_box(x, top, w, h, accent if last else INK, WASH if last else "#fff",
                        sw=2 if last else 1.5))
        out.append(_text(x + w / 2, top + 20, f"проверка {k + 1}", 12, MUTED, "middle"))
        for i, (name, value) in enumerate(values):
            shown = "—" if value is None else str(value)
            out.append(_mono(x + w / 2, top + 46 + i * 20, f"{name} = {shown}", 14, INK, "middle"))
        out.append(f'<path d="M {x + 10:.1f} {top + 86} H {x + w - 10:.1f}" stroke="{FAINT}"/>')
        out.append(_mono(x + w / 2, top + 104, cond, 12, MUTED, "middle"))
        out.append(_mono(x + w / 2, top + 121, str(ok), 14, accent if last else INK, "middle", 600))
        if ok and k + 1 < n:
            out.append(_arrow(x + w + 3, top + h / 2, x + w + gap - 3, top + h / 2, MUTED))
            out.append(_text(x + w + gap / 2, top + h / 2 + 18, "тело", 11, MUTED, "middle"))
    result = " ".join(printed.getvalue().split())
    out.append(_text(16, top + h + 30, "условие ложно — цикл закончен", 13, MUTED))
    last_x = 16 + (n - 1) * (w + gap) + w / 2
    out.append(_text(last_x, top + h + 24, "вывод", 12, MUTED, "middle"))
    out.append(_mono(last_x, top + h + 42, result, 14, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def for_while_svg(tone: str | None = None) -> str:
    """The same sum written with for and with while: range(1, 5) holds the start,
    the bound and the step that the while loop keeps by hand."""
    accent = accent_of(tone)
    size = 15
    cw = size * CH
    left = ["total = 0", "for i in range(1, 5):", "    total += i", "print(total)"]
    right = ["total = 0", "i = 1", "while i < 5:", "    total += i", "    i += 1", "print(total)"]
    out = [_svg(262, "for и while: начало, граница и шаг")]

    def mark(x, y, k, tick=False):
        if tick:  # a short stem up to the character the mark names
            out.append(f'<path d="M {x:.1f} {y - 9} V {y - 17}" stroke="{accent}" stroke-width="1.5"/>')
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="9" fill="{accent}"/>')
        out.append(_text(x, y + 4, str(k), 12, "#fff", "middle", 700))

    def box(x, y, chars, start):
        out.append(_box(x + start * cw - 3, y - 18, chars * cw + 6, 25, accent, "none", rx=4))

    for title, x, lines in (("for", 24, left), ("while", 354, right)):
        out.append(_mono(x, 26, title, 15, INK, weight=700))
        # the for side leaves room under its loop line for the marks
        ys = (62, 92, 140, 170) if lines is left else [62 + i * 30 for i in range(len(lines))]
        for line, ly in zip(lines, ys, strict=True):
            out.append(_mono(x, ly, line, size))
    # for: the numbers inside range(1, 5)
    y = 92
    for k, idx in ((1, 15), (2, 18)):
        mark(24 + idx * cw + cw / 2, y + 26, k, tick=True)
    mark(24 + 20 * cw + 8, y + 26, 3)
    out.append(_text(24 + 20 * cw + 22, y + 30, "шаг 1 — сам", 12, MUTED))
    # while: the same three parts written by hand
    x = 354
    box(x, 62 + 30, 5, 0)
    mark(x + 5 * cw + 16, 62 + 30 - 5, 1)
    box(x, 62 + 60, 5, 6)
    mark(x + 11 * cw + 20, 62 + 60 - 5, 2)
    box(x, 62 + 120, 6, 4)
    mark(x + 10 * cw + 16, 62 + 120 - 5, 3)
    out.append(f'<path d="M 330 10 V 216" stroke="{FAINT}"/>')
    out.append(_text(16, 246, "1 — начало, 2 — граница (в перебор не входит), 3 — шаг", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


def zip_pairs_svg(names, scores, start: int = 1, tone: str | None = None) -> str:
    """enumerate gives each element its number; zip joins two sources position by
    position and stops at the shorter one — the leftover element gets no pair."""
    accent = accent_of(tone)
    rows = max(len(names), len(scores))
    top, step = 70, 46
    out = [_svg(top + rows * step + 24, "enumerate и zip")]
    # enumerate: a number before every element
    out.append(_mono(16, 22, f"enumerate(names, start={start})", 13, INK, weight=600))
    for k, name in enumerate(names):
        y = top + k * step
        out.append(f'<circle cx="34" cy="{y}" r="13" fill="{accent}"/>')
        out.append(_text(34, y + 5, str(start + k), 13, "#fff", "middle", 700))
        out.append(_arrow(50, y, 76, y, MUTED))
        out.append(_box(80, y - 16, 96, 32, INK))
        out.append(_text(128, y + 5, name, 14, INK, "middle"))
        out.append(_mono(190, y + 5, f"→ ({start + k}, {name!r})", 12, MUTED))
    out.append(f'<path d="M 330 10 V {top + rows * step + 8}" stroke="{FAINT}"/>')
    # zip: pairs by position, the longer source is cut
    out.append(_mono(350, 22, "zip(names, scores)", 13, INK, weight=600))
    pairs = min(len(names), len(scores))
    for k in range(rows):
        y = top + k * step
        paired = k < pairs
        color = INK if paired else FAINT
        if k < len(names):
            out.append(_box(350, y - 16, 96, 32, color))
            out.append(_text(398, y + 5, names[k], 14, INK if paired else MUTED, "middle"))
        if k < len(scores):
            out.append(_box(500, y - 16, 56, 32, color))
            out.append(_text(528, y + 5, str(scores[k]), 14, INK if paired else MUTED, "middle"))
        if paired:
            out.append(f'<path d="M 446 {y} H 500" stroke="{accent}" stroke-width="2"/>')
            out.append(_text(570, y + 5, f"пара {k + 1}", 12, MUTED))
        else:
            out.append(_text(458, y + 5, "пары нет", 12, MUTED))
    out.append(_text(350, top + rows * step + 2, "zip остановился на коротком списке", 12, MUTED))
    out.append("</svg>")
    return "".join(out)


def freq_table_svg(text: str = "BANANA", tone: str | None = None) -> str:
    """A frequency table built letter by letter: every letter adds 1 to its key;
    keys stand in the order of their first appearance."""
    accent = accent_of(tone)
    counts: dict = {}
    seen: dict = {}
    for i, ch in enumerate(text, 1):
        counts[ch] = counts.get(ch, 0) + 1
        seen.setdefault(ch, []).append(i)
    cell = 40
    top = 44
    rows = len(counts)
    out = [_svg(max(top + rows * 48 + 6, top + 70), f"Частоты букв {text}")]
    out.append(_text(16, 22, "буквы по очереди", 13, MUTED))
    for i, ch in enumerate(text):
        x = 16 + i * cell
        out.append(_box(x, top, cell, cell, INK, "#fff", rx=0, sw=1.25))
        out.append(_text(x + cell / 2, top + 26, ch, 18, INK, "middle", 600))
        out.append(_text(x + cell / 2, top + cell + 18, f"{i + 1}-я", 12, MUTED, "middle"))
    x0 = 16 + len(text) * cell + 44
    out.append(_text(x0, 22, "словарь counts", 13, MUTED))
    for k, (ch, n) in enumerate(counts.items()):
        y = top + k * 48
        out.append(_box(x0, y, 48, 36, INK))
        out.append(_mono(x0 + 24, y + 24, repr(ch), 15, INK, "middle"))
        out.append(_arrow(x0 + 52, y + 18, x0 + 80, y + 18, MUTED))
        out.append(_box(x0 + 84, y, 44, 36, accent, WASH, sw=2))
        out.append(_mono(x0 + 106, y + 24, str(n), 16, INK, "middle", 600))
        where = ", ".join(map(str, seen[ch]))
        out.append(_text(x0 + 140, y + 23, f"+1 на буквах {where}", 12, MUTED))
    out.append("</svg>")
    return "".join(out)


def call_flow_svg(tone: str | None = None) -> str:
    """A call of rectangle_area(3, 5): the arguments become the parameters, the body
    runs, and return puts its value back where the call stood."""
    accent = accent_of(tone)
    size = 15
    cw = size * CH
    x0 = 40
    call = "area = rectangle_area(3, 5)"
    head = "def rectangle_area(width, height):"
    body = "    return width * height"
    out = [_svg(300, "Вызов функции rectangle_area(3, 5)")]
    out.append(_text(x0, 20, "строка с вызовом", 12, MUTED))
    out.append(_mono(x0, 50, call, size, INK, weight=600))
    # the call itself, which return replaces with a value
    out.append(_box(x0 + 7 * cw - 4, 30, 20 * cw + 8, 28, accent, "none", rx=5, dashed=True))
    out.append(_box(x0 - 14, 118, 440, 104, FAINT, WASH, rx=10))
    out.append(_text(x0, 110, "функция", 12, MUTED))
    out.append(_mono(x0, 152, head, size))
    out.append(_mono(x0, 192, body, size))
    for arg_idx, par_idx, par_len in ((22, 19, 5), (25, 26, 6)):
        ax = x0 + arg_idx * cw + cw / 2
        px = x0 + (par_idx + par_len / 2) * cw
        out.append(_box(x0 + par_idx * cw - 2, 134, par_len * cw + 4, 24, accent, "none", rx=4))
        out.append(_arrow(ax, 58, px, 130, accent, width=1.75))
    out.append(_text(x0 + 300, 92, "3 → width, 5 → height", 12, MUTED))
    # return: the value goes back to the call
    out.append(_box(x0 + 4 * cw - 3, 174, 21 * cw + 6, 25, INK, "none", rx=4))
    bx, by = 560, 186
    out.append(f'<circle cx="{bx}" cy="{by}" r="20" fill="{WASH}" stroke="{accent}" stroke-width="2"/>')
    out.append(_mono(bx, by + 5, "15", 15, INK, "middle", 600))
    out.append(_arrow(x0 + 25 * cw + 8, by, bx - 24, by, MUTED))
    out.append(
        f'<path d="M {bx} {by - 22} V 44 H {x0 + 27 * cw + 12}" fill="none" stroke="{accent}" '
        f'stroke-width="1.75"/>'
    )
    out.append(f'<path d="M {x0 + 27 * cw + 6} 44 l 8 -4 v 8 z" fill="{accent}"/>')
    out.append(_text(x0, 262, "return отдаёт 15 в место вызова: строка становится area = 15", 13, INK))
    out.append(_text(x0, 284, "тело выполняется при каждом вызове, а не при def", 12, MUTED))
    out.append("</svg>")
    return "".join(out)


def fib_tree_svg(n: int = 5, tone: str | None = None) -> str:
    """All calls of the plain recursive Fibonacci for n: the values that are
    computed again and again are marked."""
    accent = accent_of(tone)

    def build(k):
        return (k, [] if k < 2 else [build(k - 1), build(k - 2)])

    tree = build(n)
    counts: dict = {}

    def count(t):
        counts[t[0]] = counts.get(t[0], 0) + 1
        for c in t[1]:
            count(c)

    count(tree)
    leaves: list = []

    def place(t, depth):
        if not t[1]:
            leaves.append(t)
            return (len(leaves) - 1, depth, t, [])
        kids = [place(c, depth + 1) for c in t[1]]
        return (sum(p[0] for p in kids) / len(kids), depth, t, kids)

    root = place(tree, 0)
    gap = 600 / max(len(leaves) - 1, 1)
    top, step = 52, 54

    def depth_of(p):
        return max([p[1]] + [depth_of(c) for c in p[3]])

    height = top + depth_of(root) * step + 40
    total = sum(counts.values())
    out = [_svg(height, f"Вызовы fibonacci_slow({n})")]
    out.append(_text(16, 22, f"fibonacci_slow({n}): {total} вызовов", 14, INK, weight=600))
    repeats = ", ".join(f"F({k}) — {c} раза" for k, c in sorted(counts.items(), reverse=True) if c > 1 and k >= 2)
    out.append(_text(644, 22, f"повторы: {repeats}", 12, accent, "end"))

    def draw(p):
        pos, depth, (k, _), kids = p
        x, y = 30 + pos * gap, top + depth * step
        for c in kids:
            out.append(
                f'<line x1="{x:.1f}" y1="{y + 14}" x2="{30 + c[0] * gap:.1f}" '
                f'y2="{top + c[1] * step - 14}" stroke="{FAINT}" stroke-width="1.5"/>'
            )
            draw(c)
        again = counts[k] > 1 and k >= 2
        out.append(
            f'<rect x="{x - 24:.1f}" y="{y - 14}" width="48" height="28" rx="14" '
            f'fill="{WASH if again else "#fff"}" stroke="{accent if again else INK}" '
            f'stroke-width="{2 if again else 1.25}"/>'
        )
        out.append(_mono(x, y + 5, f"F({k})", 13, INK, "middle", 600 if again else 500))

    draw(root)
    out.append("</svg>")
    return "".join(out)


def _key_of(key):
    """A key for the sorting figures: its function and how it is written."""
    if key == "len":
        return len, "len"
    if key == "last":
        return (lambda w: w[-1]), "lambda w: w[-1]"
    return (lambda w: w), None


def _word_card(out, cx, y, word, stroke=INK, fill="#fff", sw=1.5, w=96):
    out.append(_box(cx - w / 2, y, w, 34, stroke, fill, sw=sw))
    out.append(_text(cx, y + 23, word, 15, INK, "middle"))


def sort_frames(items, key="len", tone: str | None = None) -> list[tuple[str, str]]:
    """sorted(items, key=…) step by step: the key of every element, then the
    elements in the order of their keys; equal keys keep their order."""
    accent = accent_of(tone)
    fn, shown = _key_of(key)
    keys = [fn(w) for w in items]
    order = sorted(range(len(items)), key=lambda k: keys[k])
    step = 620 / len(items)
    xs = [20 + step * k + step / 2 for k in range(len(items))]
    call = f"sorted(words, key={shown})" if shown else "sorted(words)"
    frames = []

    def frame(known, result, current=None):
        out = [_svg(262, "Сортировка по ключу")]
        out.append(_mono(16, 22, "words", 13, MUTED))
        for k, w in enumerate(items):
            hot = k == current
            _word_card(out, xs[k], 34, w, accent if hot else INK, WASH if hot else "#fff", 2 if hot else 1.5)
            if k in known:
                out.append(_text(xs[k], 90, f"ключ {keys[k]!r}" if not isinstance(keys[k], int) else f"ключ {keys[k]}", 13, accent, "middle", 600))
        if not result:
            out.append(_text(330, 190, "результат появится, когда известны все ключи", 12, FAINT, "middle"))
        if result:
            out.append(_mono(16, 136, call, 13, MUTED))
            for slot, k in enumerate(order):
                _word_card(out, xs[slot], 150, items[k], INK, WASH)
                out.append(_text(xs[slot], 206, f"ключ {keys[k]}" if isinstance(keys[k], int) else f"ключ {keys[k]!r}", 12, accent, "middle", 600))
                out.append(_text(xs[slot], 226, f"было место {k + 1}", 12, MUTED, "middle"))
        out.append("</svg>")
        return "".join(out)

    frames.append((frame(set(), False), "Исходный список. sorted сначала вычисляет ключ каждого элемента."))
    for k, w in enumerate(items):
        frames.append(
            (
                frame(set(range(k + 1)), False, k),
                f"Ключ слова «{w}»: {shown}(«{w}») = {keys[k]!r}." if shown else f"Без key сравниваются сами слова: «{w}».",
            )
        )
    ties = [w for w in items if [fn(x) for x in items].count(fn(w)) > 1]
    note = " Слова с равным ключом — " + ", ".join(f"«{w}»" for w in ties) + " — сохранили исходный порядок." if ties else ""
    frames.append((frame(set(range(len(items))), True), "Слова встали в порядке ключей." + note))
    return frames


def sort_stepper(items, key="len", tone: str | None = None) -> str:
    """sorted with a key, frame by frame."""
    return _stepper(sort_frames(items, key, tone))


def sort_result_svg(items, key="len", reverse=False, tone: str | None = None) -> str:
    """The result of one sorting rule: sorted elements with their keys and the
    places they came from."""
    accent = accent_of(tone)
    fn, shown = _key_of(key)
    order = sorted(range(len(items)), key=lambda k: fn(items[k]), reverse=reverse)
    step = 620 / len(items)
    parts = ["words"] + ([f"key={shown}"] if shown else []) + (["reverse=True"] if reverse else [])
    out = [_svg(130, "Результат сортировки")]
    out.append(_mono(16, 22, f"sorted({', '.join(parts)})", 13, MUTED))
    for slot, k in enumerate(order):
        cx = 20 + step * slot + step / 2
        value = fn(items[k])
        out.append(_text(cx, 50, f"ключ {value!r}" if not isinstance(value, int) else f"ключ {value}", 12, accent, "middle", 600))
        _word_card(out, cx, 60, items[k], INK, WASH)
        out.append(_text(cx, 116, f"было место {k + 1}", 12, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def tuple_sort_frames(students, tone: str | None = None) -> list[tuple[str, str]]:
    """Sorting records by the key (-score, name): first components decide,
    equal first components pass the decision to the second."""
    accent = accent_of(tone)
    keys = [(-score, name) for name, score in students]
    order = sorted(range(len(students)), key=lambda k: keys[k])
    step = 620 / len(students)
    xs = [20 + step * k + step / 2 for k in range(len(students))]
    top_score = -min(k[0] for k in keys)
    tied = [k for k in range(len(students)) if -keys[k][0] == top_score]

    def frame(stage):
        out = [_svg(262, "Сортировка по кортежу ключей")]
        out.append(_mono(16, 22, "students", 13, MUTED))
        for k, (name, score) in enumerate(students):
            hot = (stage == 2 and k in tied) or (stage == 3 and k in tied)
            _word_card(out, xs[k], 34, f"{name} {score}", accent if hot else INK, WASH if hot else "#fff", 2 if hot else 1.5, w=120)
            if stage >= 1:
                first, second = keys[k]
                out.append(_mono(xs[k], 92, f"({first}, {second!r})", 13, INK, "middle"))
                if stage == 2:
                    out.append(_bracket(xs[k] - 46, xs[k] - 18, 100, accent))
                if stage == 3 and k in tied:
                    out.append(_bracket(xs[k] - 8, xs[k] + 50, 100, accent))
        if stage == 4:
            out.append(_mono(16, 136, "sorted(students, key=lambda s: (-s[1], s[0]))", 13, MUTED))
            for slot, k in enumerate(order):
                name, score = students[k]
                _word_card(out, xs[slot], 150, f"{name} {score}", INK, WASH, w=120)
                out.append(_mono(xs[slot], 206, f"({keys[k][0]}, {keys[k][1]!r})", 12, accent, "middle"))
        out.append("</svg>")
        return "".join(out)

    names = " и ".join(students[k][0] for k in tied)
    return [
        (frame(0), "Исходные записи: имя и балл."),
        (frame(1), "Ключ каждой записи — кортеж: минус балл и имя."),
        (frame(2), f"Сначала сравниваются первые элементы: −{top_score} меньше остальных, поэтому {names} будут впереди."),
        (frame(3), f"У {names} первые элементы равны — решает второй: имена сравниваются по алфавиту."),
        (frame(4), "Итог: по убыванию балла, при равном балле — по алфавиту."),
    ]


def tuple_sort_stepper(students, tone: str | None = None) -> str:
    """Sorting by a tuple key, frame by frame."""
    return _stepper(tuple_sort_frames(students, tone))


def max_frames(items, tone: str | None = None) -> list[tuple[str, str]]:
    """max(items, key=len) element by element: the best so far changes only on
    a strictly greater key, so on a tie the first one stays."""
    accent = accent_of(tone)
    step = 620 / len(items)
    xs = [20 + step * k + step / 2 for k in range(len(items))]
    frames = []
    best = None
    for k, w in enumerate(items):
        if best is None:
            best, note = k, f"«{w}»: длина {len(w)} — первый элемент, пока лучший."
        elif len(w) > len(items[best]):
            note = f"«{w}»: {len(w)} > {len(items[best])} — новый лучший."
            best = k
        elif len(w) == len(items[best]):
            note = f"«{w}»: {len(w)} не больше {len(items[best])} — лучшим остаётся «{items[best]}»."
        else:
            note = f"«{w}»: {len(w)} < {len(items[best])} — лучшим остаётся «{items[best]}»."
        out = [_svg(150, "Поиск наибольшего по ключу")]
        out.append(_mono(16, 22, "max(words, key=len)", 13, MUTED))
        for j, word in enumerate(items):
            seen = j <= k
            is_best = j == best
            stroke = accent if j == k else (INK if seen else FAINT)
            _word_card(out, xs[j], 40, word, stroke, WASH if is_best else "#fff", 2 if j == k else 1.5)
            if seen:
                out.append(_text(xs[j], 96, f"ключ {len(word)}", 12, accent if is_best else MUTED, "middle", 600 if is_best else 400))
            if is_best:
                out.append(_text(xs[j], 120, "лучший пока", 12, accent, "middle", 600))
        out.append("</svg>")
        frames.append(("".join(out), note))
    frames.append((frames[-1][0], f"Список кончился: max вернул «{items[best]}»."))
    return frames


def max_stepper(items, tone: str | None = None) -> str:
    """max with a key, element by element."""
    return _stepper(max_frames(items, tone))


def greedy_frames(prices, budget, tone: str | None = None) -> list[tuple[str, str]]:
    """Buying the cheapest first: the budget bar fills price by price until the
    next price does not fit."""
    accent = accent_of(tone)
    order = sorted(prices)
    scale = 600 / (budget + max(order))  # room for a price that does not fit
    frames = []
    spent = 0
    taken = []

    def frame(trying=None):
        out = [_svg(186, "Жадная покупка в пределах бюджета")]
        out.append(_mono(16, 22, f"sorted(prices) = {order}", 13, MUTED))
        x0, y = 40, 70
        out.append(_box(x0, y, budget * scale, 34, INK, "#fff", rx=4))
        out.append(_text(x0 + budget * scale, y - 8, f"бюджет {budget}", 12, MUTED, "end"))
        x = x0
        for p in taken:
            out.append(_box(x, y, p * scale, 34, accent, WASH, rx=4, sw=1.5))
            out.append(_text(x + p * scale / 2, y + 22, str(p), 13, INK, "middle", 600))
            x += p * scale
        if trying is not None:
            fits = spent + trying <= budget
            color = accent if fits else ERR
            out.append(_box(x, y + 44, trying * scale, 30, color, "#fff", rx=4, sw=1.5, dashed=not fits))
            out.append(_text(x + trying * scale / 2, y + 64, str(trying), 13, color, "middle", 600))
        out.append(_text(x0, y + 104, f"куплено {len(taken)}, потрачено {spent}", 13, INK, weight=600))
        out.append("</svg>")
        return "".join(out)

    frames.append((frame(), "Цены по возрастанию: выгоднее всего брать самые дешёвые."))
    for p in order:
        if spent + p > budget:
            frames.append((frame(p), f"{spent} + {p} = {spent + p} > {budget}: не помещается — break."))
            break
        frames.append((frame(p), f"Пробуем {p}: {spent} + {p} = {spent + p} — помещается."))
        spent += p
        taken.append(p)
        frames.append((frame(), f"Купили {p}: потрачено {spent}."))
    frames.append((frame(), f"Итог: {len(taken)} предмета за {spent}."))
    return frames


def greedy_stepper(prices, budget, tone: str | None = None) -> str:
    """The greedy purchase, frame by frame."""
    return _stepper(greedy_frames(prices, budget, tone))


def arg_binding_svg(tone: str | None = None) -> str:
    """Three calls of final_price(price, discount=0): which value each
    parameter gets — by position, by name or by default."""
    accent = accent_of(tone)
    rows = [
        ("final_price(200)", [("price", "200", "по позиции"), ("discount", "0", "по умолчанию")]),
        ("final_price(200, 10)", [("price", "200", "по позиции"), ("discount", "10", "по позиции")]),
        ("final_price(discount=10, price=200)", [("price", "200", "по имени"), ("discount", "10", "по имени")]),
    ]
    out = [_svg(262, "Как параметры получают значения")]
    out.append(_mono(16, 22, "def final_price(price, discount=0):", 13, MUTED))
    for i, (call, params) in enumerate(rows):
        y = 52 + i * 70
        out.append(_mono(16, y + 22, call, 13, INK, weight=600))
        for j, (name, value, how) in enumerate(params):
            x = 360 + j * 150
            default = how == "по умолчанию"
            out.append(_box(x, y, 136, 34, accent if not default else FAINT, WASH if not default else "#fff", dashed=default))
            out.append(_mono(x + 68, y + 22, f"{name} = {value}", 13, INK, "middle"))
            out.append(_text(x + 68, y + 52, how, 12, accent if not default else MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def tuple_return_svg(tone: str | None = None) -> str:
    """return a // b, a % b: two values leave the function as one tuple and are
    unpacked into two names at the call."""
    accent = accent_of(tone)
    out = [_svg(150, "Несколько результатов — один кортеж")]
    out.append(_text(16, 22, "функция при a = 23, b = 5", 12, MUTED))
    out.append(_box(16, 34, 236, 40, FAINT, WASH, rx=8))
    out.append(_mono(28, 59, "return a // b, a % b", 14, INK))
    out.append(_arrow(256, 54, 292, 54, MUTED))
    out.append(f'<rect x="296" y="32" width="104" height="44" rx="22" fill="{WASH}" stroke="{accent}" stroke-width="2"/>')
    out.append(_mono(348, 59, "(4, 3)", 15, INK, "middle", 600))
    out.append(_text(348, 22, "один кортеж", 12, accent, "middle"))
    out.append(_arrow(404, 46, 470, 36, accent, width=1.5))
    out.append(_arrow(404, 62, 470, 76, accent, width=1.5))
    for y, label in ((18, "q = 4"), (60, "r = 3")):
        out.append(_box(474, y, 90, 32, INK))
        out.append(_mono(519, y + 21, label, 14, INK, "middle", 600))
    out.append(_text(16, 118, "строка вызова раскладывает кортеж на два имени:", 13, INK))
    out.append(_mono(16, 140, "q, r = quotient_and_remainder(23, 5)", 13, MUTED))
    out.append("</svg>")
    return "".join(out)

def import_names_svg(tone: str | None = None) -> str:
    """import math gives the program the name of the module; from math import
    isqrt gives the name of one function inside it."""
    accent = accent_of(tone)
    out = [_svg(250, "import и from … import")]
    funcs = ["isqrt", "gcd", "floor", "ceil", "fsum"]
    for k, (title, name, target, call) in enumerate(
        (("import math", "math", None, "math.isqrt(50)"), ("from math import isqrt", "isqrt", 0, "isqrt(50)"))
    ):
        x0 = k * 330 + 16
        out.append(_mono(x0, 22, title, 14, INK, weight=600))
        out.append(_text(x0, 44, "имена программы", 12, MUTED))
        out.append(_box(x0, 54, 90, 34, accent, WASH, sw=2))
        out.append(_mono(x0 + 45, 76, name, 14, INK, "middle", 600))
        mx, my = x0 + 140, 54
        out.append(_text(mx, 44, "модуль math", 12, MUTED))
        out.append(_box(mx, my, 150, 30 + len(funcs) * 24, INK, "#fff", rx=10))
        for i, fn_name in enumerate(funcs):
            hot = target == i
            out.append(_mono(mx + 16, my + 26 + i * 24, fn_name, 13, accent if hot else INK, weight=600 if hot else 500))
        if target is None:
            out.append(_arrow(x0 + 90, 71, mx - 2, 71, accent, width=1.75))
        else:
            out.append(_arrow(x0 + 90, 71, mx + 12, my + 22 + target * 24, accent, width=1.75))
        out.append(_text(x0, 222, "вызов:", 12, MUTED))
        out.append(_mono(x0 + 48, 222, call, 14, INK, weight=600))
        if k == 0:
            out.append(f'<path d="M 322 10 V 236" stroke="{FAINT}"/>')
    out.append("</svg>")
    return "".join(out)


def name_main_svg(tone: str | None = None) -> str:
    """The same calculations.py run directly and imported: __name__ decides
    whether the block under if __name__ == "__main__" runs."""
    accent = accent_of(tone)
    code = ["def square(number):", "    return number * number", "", 'if __name__ == "__main__":', "    print(square(7))"]
    cases = [
        ("python calculations.py", '"__main__"', True, "блок выполнен: печатает 49"),
        ("from calculations import square", '"calculations"', False, "блок пропущен: только определения"),
    ]
    out = [_svg(254, "__name__ при запуске и при импорте")]
    for k, (how, value, runs, note) in enumerate(cases):
        x0 = k * 330 + 16
        out.append(_mono(x0, 22, how, 12.5, INK, weight=600))
        out.append(_mono(x0, 46, f"__name__ == {value}", 13, accent, weight=600))
        for i, line in enumerate(code):
            y = 82 + i * 24
            block = i == 4
            color = (INK if runs else FAINT) if block else INK
            if block and runs:
                out.append(f'<circle cx="{x0 + 4}" cy="{y - 5}" r="3.5" fill="{accent}"/>')
            out.append(_mono(x0 + 14, y, line, 13, color))
        out.append(_text(x0, 226, note, 13, accent if runs else MUTED, weight=600 if runs else 400))
        if k == 0:
            out.append(f'<path d="M 322 10 V 240" stroke="{FAINT}"/>')
    out.append("</svg>")
    return "".join(out)


def program_split_svg(tone: str | None = None) -> str:
    """A small program in three parts: reading, computing, printing; the
    computing function is checked on its own."""
    accent = accent_of(tone)
    parts = [("чтение", "input() или файл"), ("вычисление", "count_multiples(a, b, d)"), ("вывод", "print(...)")]
    out = [_svg(196, "Чтение, вычисление и вывод")]
    widths = [150, 230, 150]
    x = 16
    for k, ((title, sub), w) in enumerate(zip(parts, widths, strict=True)):
        hot = k == 1
        out.append(_box(x, 30, w, 64, accent if hot else INK, WASH if hot else "#fff", sw=2 if hot else 1.5))
        out.append(_text(x + w / 2, 56, title, 14, INK, "middle", 600))
        out.append(_mono(x + w / 2, 80, sub, 12, MUTED, "middle"))
        if k:
            out.append(_arrow(x - 24, 62, x - 4, 62, MUTED))
        if hot:
            out.append(f'<path d="M {x + w / 2} 98 V 128" stroke="{accent}" stroke-dasharray="4 3"/>')
            out.append(_mono(x + w / 2, 150, "count_multiples(1, 100, 7) → 14", 13, INK, "middle", 600))
            out.append(_text(x + w / 2, 174, "проверка без ввода и вывода", 12, accent, "middle"))
        x += w + 28
    out.append("</svg>")
    return "".join(out)


def time_split_svg(seconds: int = 3671, tone: str | None = None) -> str:
    """Seconds split into hours, minutes and seconds by // and %."""
    accent = accent_of(tone)
    h, m, s = seconds // 3600, seconds % 3600 // 60, seconds % 60
    parts = [
        (f"{h} ч", f"{h * 3600} с", f"{seconds} // 3600"),
        (f"{m} мин", f"{m * 60} с", f"{seconds} % 3600 // 60"),
        (f"{s} с", f"{s} с", f"{seconds} % 60"),
    ]
    widths = [300, 170, 120]
    out = [_svg(170, f"Разложение {seconds} секунд")]
    x = 30
    out.append(_bracket(30, 30 + sum(widths) + 20, 22))
    out.append(_text(330, 16, f"{seconds} секунд", 14, INK, "middle", 600))
    for k, ((big, sec, code), w) in enumerate(zip(parts, widths, strict=True)):
        out.append(
            _box(
                x,
                36,
                w,
                54,
                accent if k == 2 else INK,
                WASH,
                rx=6,
                sw=2 if k == 2 else 1.5,
            )
        )
        out.append(_text(x + w / 2, 60, big, 17, INK, "middle", 600))
        out.append(_text(x + w / 2, 80, sec, 13, MUTED, "middle"))
        out.append(_mono(x + w / 2, 118, code, 13, INK, "middle"))
        out.append(_mono(x + w / 2, 140, f"→ {[h, m, s][k]}", 13, accent, "middle", 600))
        x += w + 10
    out.append("</svg>")
    return "".join(out)


def input_flow_svg(tone: str | None = None) -> str:
    """Keyboard → input() → str → int() → int → + 1; without int — TypeError."""
    accent = accent_of(tone)
    nodes = [
        ("набрано", "2 5 ↵", None),
        ("str", '"25"', None),
        ("int", "25", None),
        ("int", "26", None),
    ]
    arrows = ["input()", "int(...)", "+ 1"]
    w, gap, y = 104, 74, 52
    out = [_svg(208, "Путь введённого текста")]
    for k, (tag, value, _) in enumerate(nodes):
        x = 16 + k * (w + gap)
        first = k == 0
        out.append(
            _box(
                x,
                y,
                w,
                46,
                INK if not first else MUTED,
                WASH if not first else "#fff",
                dashed=first,
            )
        )
        out.append(_mono(x + w / 2, y + 30, value, 17, INK, "middle", 600))
        out.append(
            _text(
                x + w / 2,
                y - 10,
                tag if not first else "клавиатура",
                13,
                MUTED,
                "middle",
            )
        )
        if k:
            ax = x - gap
            out.append(
                _arrow(
                    ax + 4,
                    y + 23,
                    x - 4,
                    y + 23,
                    accent if k == 2 else MUTED,
                    width=2 if k == 2 else 1.5,
                )
            )
            out.append(
                _mono(
                    ax + gap / 2,
                    y + 44,
                    arrows[k - 1],
                    13,
                    accent if k == 2 else INK,
                    "middle",
                )
            )
    sx = 16 + (w + gap) + w / 2
    out.append(_arrow(sx, y + 50, sx, y + 108, FAINT, dashed=True))
    out.append(_mono(sx + 10, y + 82, "+ 1", 13, MUTED))
    out.append(_box(sx - 60, y + 112, 230, 34, ERR, "#fff"))
    out.append(_mono(sx - 48, y + 134, "TypeError", 13, ERR, weight=600))
    out.append(_text(sx + 40, y + 134, "строка + число", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


def print_marks_svg(tone: str | None = None) -> str:
    """What print adds: sep between the values, end after them."""
    accent = accent_of(tone)
    rows = [
        (
            ["print(10, 20, 30)"],
            [("10", 0), (" ", "sep"), ("20", 0), (" ", "sep"), ("30", 0), ("↵", "end")],
        ),
        (
            ['print(10, 20, 30, sep="; ")'],
            [
                ("10", 0),
                ("; ", "sep"),
                ("20", 0),
                ("; ", "sep"),
                ("30", 0),
                ("↵", "end"),
            ],
        ),
        (
            ['print("Начало", end=" ")', 'print("продолжение")'],
            [("Начало", 0), (" ", "end"), ("продолжение", 0), ("↵", "end")],
        ),
    ]
    size = 14
    cw = size * CH
    out = [_svg(236, "Разделитель и окончание print")]
    out.append(_text(16, 18, "Код", 13, MUTED))
    out.append(_text(338, 18, "Что попадает на экран", 13, MUTED))
    y = 48
    for code, segs in rows:
        for i, c in enumerate(code):
            out.append(_mono(16, y + i * 22, c, 13))
        x = 338
        for s, kind in segs:
            w = max(len(s), 1) * cw + (8 if kind else 0)
            if kind:
                color = accent if kind == "sep" else INK
                out.append(
                    _box(
                        x,
                        y - 17,
                        w,
                        24,
                        color,
                        WASH,
                        rx=4,
                        sw=1.25,
                        dashed=kind == "end",
                    )
                )
                out.append(
                    _mono(
                        x + w / 2,
                        y,
                        "␣" * len(s) if s.strip() == "" else s,
                        size,
                        color,
                        "middle",
                    )
                )
                out.append(_text(x + w / 2, y + 24, kind, 11, color, "middle"))
            else:
                out.append(_mono(x, y, s, size))
            x += w + 5
        y += 22 * len(code) + 50
    out.append("</svg>")
    return "".join(out)


def fstring_svg(tone: str | None = None) -> str:
    """An f-string is a template: each {…} is computed and put in its place."""
    accent = accent_of(tone)
    size = 13.5
    cw = size * CH
    tpl = 'f"Тетрадей: {quantity}, стоимость: {quantity * price:.2f}"'
    res = '"Тетрадей: 3, стоимость: 127.50"'
    x0 = 16
    out = [_svg(200, "Подстановка значений в f-строку")]
    out.append(_mono(x0, 40, tpl, size, INK, weight=600))
    holes = [
        ("{quantity}", "3", "quantity → 3"),
        ("{quantity * price:.2f}", "127.50", "127.5 → две цифры после точки"),
    ]
    out.append(_mono(x0, 160, res, size, INK, weight=600))
    for hole, filled, note in holes:
        a = tpl.index(hole)
        b = res.index(filled)
        hx, hw = x0 + a * cw - 2, len(hole) * cw + 4
        rx, rw = x0 + b * cw - 2, len(filled) * cw + 4
        out.append(_box(hx, 22, hw, 26, accent, "none", rx=4, sw=1.5))
        out.append(_box(rx, 142, rw, 26, accent, "none", rx=4, sw=1.5))
        out.append(_arrow(hx + hw / 2, 52, rx + rw / 2, 138, MUTED))
        mx = (hx + hw / 2 + rx + rw / 2) / 2
        out.append(_text(mx + 8, 100, note, 13, MUTED))
    out.append(
        _text(
            x0,
            192,
            "остальной текст шаблона переходит в строку без изменений",
            13,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


def interval_svg(lo: int = 5, hi: int = 20, x: int = 12, tone: str | None = None) -> str:
    """lo <= x < hi on a number line: the closed and the open end."""
    accent = accent_of(tone)
    L, R, a, b = 40, 620, lo - 3, hi + 3
    base = 74

    def px(v):
        return L + (v - a) / (b - a) * (R - L)

    out = [_svg(150, f"Интервал {lo} <= x < {hi}")]
    out.append(
        f'<line x1="{L}" y1="{base}" x2="{R}" y2="{base}" stroke="{INK}" stroke-width="1.5"/>'
    )
    for v in range(a, b + 1):
        tall = v in (lo, hi, x)
        out.append(
            f'<line x1="{px(v):.1f}" y1="{base - 4}" x2="{px(v):.1f}" y2="{base + 4}" stroke="{MUTED}"/>'
        )
        if tall or v % 5 == 0:
            out.append(_text(px(v), base + 26, str(v), 14, INK if tall else MUTED, "middle"))
    out.append(
        f'<line x1="{px(lo):.1f}" y1="{base}" x2="{px(hi):.1f}" y2="{base}" stroke="{accent}" stroke-width="5"/>'
    )
    out.append(f'<circle cx="{px(lo):.1f}" cy="{base}" r="7" fill="{accent}"/>')
    out.append(
        f'<circle cx="{px(hi):.1f}" cy="{base}" r="7" fill="#fff" stroke="{accent}" stroke-width="2.5"/>'
    )
    out.append(_mono(px(lo), base - 22, f"{lo} <= x", 14, INK, "middle"))
    out.append(_mono(px(hi), base - 22, f"x < {hi}", 14, INK, "middle"))
    out.append(_text(px(lo), base + 50, "входит", 13, MUTED, "middle"))
    out.append(_text(px(hi), base + 50, "не входит", 13, MUTED, "middle"))
    out.append(f'<path d="M {px(x):.1f} {base - 14} l -6 -10 h 12 z" fill="{INK}"/>')
    out.append(_mono(px(x), base - 30, f"x = {x}", 14, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def truth_grids_svg(
    exprs=("a and b", "a or b", "a != b"),
    names=("a", "b"),
    legend=None,
    case=None,
    tone: str | None = None,
) -> str:
    """Each expression as a 2 × 2 grid over the values of two conditions:
    the cells where it is True are marked. ``legend`` names the conditions;
    ``case`` — [a, b] of the lesson's example, a dot in its cell."""
    accent = accent_of(tone)
    p, q = names
    slot = 660 / len(exprs)
    cell_w, cell_h = 66, 38
    out = [_svg(196, "Таблицы истинности")]
    for k, e in enumerate(exprs):
        gx = k * slot + (slot - 2 * cell_w) / 2 + 22
        gy = 70
        out.append(_mono(k * slot + slot / 2 + 11, 22, e, 15, INK, "middle", 600))
        for j, bv in enumerate((False, True)):
            out.append(
                _mono(
                    gx + j * cell_w + cell_w / 2,
                    gy - 10,
                    f"{q}={bv}"[0:1] + f" {bv}",
                    11,
                    MUTED,
                    "middle",
                )
            )
        marked = []  # outlines of the True cells, drawn over every cell
        for i, av in enumerate((False, True)):
            out.append(_mono(gx - 8, gy + i * cell_h + 24, f"{p} {av}", 11, MUTED, "end"))
            for j, bv in enumerate((False, True)):
                v = eval(e, {}, {p: av, q: bv})  # noqa: S307 — literal expressions of the figure
                x, y = gx + j * cell_w, gy + i * cell_h
                out.append(_box(x, y, cell_w, cell_h, FAINT, WASH if v else "#fff", rx=0, sw=1))
                if v:
                    marked.append(_box(x + 1, y + 1, cell_w - 2, cell_h - 2, accent, "none", 0, 2))
                if case is not None and [av, bv] == list(case):
                    marked.append(f'<circle cx="{x + 9}" cy="{y + 9}" r="4" fill="{INK}"/>')
                out.append(
                    _mono(
                        x + cell_w / 2,
                        y + 24,
                        str(v),
                        13,
                        INK if v else MUTED,
                        "middle",
                        600 if v else 500,
                    )
                )
        out.extend(marked)
        if k:
            out.append(f'<path d="M {k * slot:.1f} 8 V 164" stroke="{FAINT}"/>')
    out.append(
        _text(
            330,
            186,
            legend or "строки — значение первого условия, столбцы — второго",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


def short_circuit_svg(tone: str | None = None) -> str:
    """and / or stop as soon as the answer is known: the right part is skipped."""
    accent = accent_of(tone)
    rows = [
        ("x != 0", " and ", "10 / x > 2", "False", "False: and уже ложно"),
        ("x == 0", " or ", "10 / x > 2", "True", "True: or уже истинно"),
    ]
    size = 15
    cw = size * CH
    out = [_svg(212, "Короткое вычисление and и or")]
    out.append(_text(16, 20, "x = 0", 14, MUTED))
    for k, (left, op, right, lv, res) in enumerate(rows):
        y = 64 + k * 82
        x = 16
        lw = len(left) * cw + 16
        out.append(_box(x, y - 22, lw, 32, INK))
        out.append(_mono(x + 8, y, left, size, INK, weight=600))
        out.append(_mono(x + lw / 2, y + 30, f"→ {lv}", 13, accent, "middle", 600))
        x += lw
        out.append(_mono(x, y, op, size, INK, weight=600))
        x += len(op) * cw
        rw = len(right) * cw + 16
        out.append(_box(x, y - 22, rw, 32, FAINT, dashed=True))
        out.append(_mono(x + 8, y, right, size, MUTED))
        out.append(_text(x + rw / 2, y + 30, "не вычисляется", 13, MUTED, "middle"))
        out.append(_arrow(x + rw + 8, y - 6, x + rw + 44, y - 6, MUTED))
        out.append(_text(x + rw + 52, y - 1, res, 14, INK))
    out.append("</svg>")
    return "".join(out)


def truthy_svg(tone: str | None = None) -> str:
    """Values that count as false in a condition, and everything else."""
    accent = accent_of(tone)
    false = ["0", "0.0", '""', "None", "False"]
    true = ["5", "-1", "0.5", '"0"', '"False"', '" "', "True"]
    out = [_svg(196, "Истинные и ложные значения в условии")]
    for k, (title, items, note, hot) in enumerate(
        [
            ("в условии — ложь", false, "позже: пустые коллекции", True),
            ("в условии — истина", true, "и любое другое значение", False),
        ]
    ):
        x, w = (8, 258) if k == 0 else (282, 370)
        out.append(
            _box(
                x,
                30,
                w,
                118,
                accent if hot else INK,
                WASH if hot else "#fff",
                rx=12,
                sw=2 if hot else 1.5,
            )
        )
        out.append(_text(x + 14, 20, title, 14, INK, weight=600))
        cx, cy = x + 14, 46
        for v in items:
            bw = len(v) * 14 * CH + 20
            if cx + bw > x + w - 10:
                cx, cy = x + 14, cy + 42
            out.append(_box(cx, cy, bw, 30, INK))
            out.append(_mono(cx + bw / 2, cy + 20, v, 14, INK, "middle"))
            cx += bw + 10
        out.append(_text(x + 14, 174, note, 13, MUTED))
    out.append("</svg>")
    return "".join(out)


def _diamond(cx, cy, w, h, label, accent=ACCENT) -> str:
    return (
        f'<path d="M {cx} {cy - h / 2} L {cx + w / 2} {cy} L {cx} {cy + h / 2} '
        f'L {cx - w / 2} {cy} Z" fill="#fff" stroke="{accent}" stroke-width="1.75"/>'
        + _text(cx, cy + 5, label, 13, INK, "middle")
    )


def control_flow_svg(tone: str | None = None) -> str:
    """Sequence, choice and repetition as three small flowcharts."""
    accent = accent_of(tone)
    out = [_svg(300, "Три способа управлять порядком строк")]
    titles = [("Подряд", "a = 1; print(a)"), ("Выбор", "if … else"), ("Повтор", "while …")]
    for k, (title, code) in enumerate(titles):
        cx = 110 + k * 220
        out.append(_text(cx, 22, title, 15, INK, "middle", 600))
        out.append(_mono(cx, 42, code, 12.5, MUTED, "middle"))
        if k:
            out.append(f'<path d="M {cx - 110} 12 V 288" stroke="{FAINT}"/>')
    # sequence: three lines one after another
    cx = 110
    for i in range(3):
        y = 64 + i * 66
        out.append(_box(cx - 60, y, 120, 36, INK))
        out.append(_text(cx, y + 23, f"строка {i + 1}", 13, INK, "middle"))
        out.append(_arrow(cx, y + 36, cx, y + 64, MUTED))
    out.append(_text(cx, 282, "дальше", 13, MUTED, "middle"))
    # choice: one of two blocks
    cx = 330
    out.append(_diamond(cx, 98, 116, 52, "условие?", accent))
    for side, label, block in [(-1, "да", "блок if"), (1, "нет", "блок else")]:
        bx = cx + side * 52
        out.append(f'<path d="M {cx + side * 58} 98 H {bx}" stroke="{MUTED}" fill="none"/>')
        out.append(_arrow(bx, 98, bx, 150, MUTED))
        out.append(_text(bx + side * 6, 90, label, 12, MUTED, "middle"))
        out.append(_box(bx - 48, 152, 96, 36, INK))
        out.append(_text(bx, 175, block, 13, INK, "middle"))
        out.append(f'<path d="M {bx} 188 V 222 H {cx}" stroke="{MUTED}" fill="none"/>')
    out.append(_arrow(cx, 222, cx, 260, MUTED))
    out.append(_text(cx, 282, "дальше", 13, MUTED, "middle"))
    # repetition: the body returns to the check
    cx = 550
    out.append(_diamond(cx, 98, 116, 52, "условие?", accent))
    out.append(_arrow(cx, 124, cx, 150, MUTED))
    out.append(_text(cx + 8, 142, "да", 12, MUTED))
    out.append(_box(cx - 48, 152, 96, 36, INK))
    out.append(_text(cx, 175, "тело", 13, INK, "middle"))
    out.append(
        f'<path d="M {cx - 48} 170 H {cx - 92} V 98 H {cx - 66}" stroke="{accent}" '
        'stroke-width="1.75" fill="none"/>'
    )
    out.append(_arrow(cx - 70, 98, cx - 59, 98, accent))
    out.append(_text(cx - 98, 140, "снова", 12, accent, "end"))
    out.append(f'<path d="M {cx + 58} 98 H {cx + 84} V 236 H {cx}" stroke="{MUTED}" fill="none"/>')
    out.append(_text(cx + 92, 90, "нет", 12, MUTED, "middle"))
    out.append(_arrow(cx, 236, cx, 260, MUTED))
    out.append(_text(cx, 282, "дальше", 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def combo_grids_svg(items: str = "ABC") -> str:
    """Pairs from items for product, permutations, combinations and
    combinations_with_replacement: the 3 × 3 grid of (first, second) with the
    pairs each tool yields marked. Built with itertools itself."""
    import itertools as it

    tools = [
        ("product", it.product(items, repeat=2), "порядок важен, повтор можно"),
        ("permutations", it.permutations(items, 2), "порядок важен, без повтора"),
        ("combinations", it.combinations(items, 2), "без порядка, без повтора"),
        (
            "…_with_replacement",
            it.combinations_with_replacement(items, 2),
            "без порядка, повтор можно",
        ),
    ]
    n, cell = len(items), 30
    slot = 165
    out = [_svg(232, "Пары из трёх букв для четырёх средств itertools")]
    for k, (name, pairs, note) in enumerate(tools):
        got = {"".join(p) for p in pairs}
        gx = k * slot + (slot - n * cell) / 2 + 6
        cx = k * slot + slot / 2
        out.append(_mono(cx, 20, name, 12.5, INK, "middle", 600))
        out.append(_text(cx, 40, f"{len(got)} пар", 13, ACCENT, "middle", 600))
        for i, a in enumerate(items):
            out.append(_mono(gx - 10, 78 + i * cell, a, 12, MUTED, "middle"))
            out.append(_mono(gx + i * cell + cell / 2, 54, a, 12, MUTED, "middle"))
            for j, b in enumerate(items):
                on = a + b in got
                x, y = gx + j * cell, 60 + i * cell
                out.append(
                    _box(
                        x,
                        y,
                        cell,
                        cell,
                        ACCENT if on else FAINT,
                        WASH if on else "#fff",
                        rx=0,
                        sw=1.5 if on else 1,
                    )
                )
                out.append(_mono(x + cell / 2, y + 20, a + b, 11.5, INK if on else FAINT, "middle"))
        out.append(_text(cx, 176, note.split(", ")[0] + ",", 12.5, MUTED, "middle"))
        out.append(_text(cx, 194, note.split(", ")[1], 12.5, MUTED, "middle"))
        if k:
            out.append(f'<path d="M {k * slot} 8 V 200" stroke="{FAINT}"/>')
    out.append(_text(330, 224, "строка — первая буква пары, столбец — вторая", 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def bits_svg(a: int = 6, b: int = 3) -> str:
    """Bitwise operations column by column: each result bit depends only on
    the bits above it; shifts move the whole record."""
    width = 4
    rows = [
        ("a", a, None),
        ("b", b, None),
        ("a & b", a & b, "1, только если оба 1"),
        ("a | b", a | b, "1, если хотя бы один 1"),
        ("a ^ b", a ^ b, "1, если биты различны"),
    ]
    shifts = [("a << 1", a << 1, "сдвиг влево: × 2"), ("a >> 1", a >> 1, "сдвиг вправо: // 2")]
    cell, x0 = 34, 130
    out = [_svg(330, "Побитовые операции по разрядам")]

    def record(y, name, value, bold, color=INK):
        out.append(_mono(x0 - 16, y + 23, name, 14, INK, "end", 600 if bold else 500))
        bits = format(value, f"0{width}b")
        for i, bit in enumerate(bits):
            x = x0 + i * cell
            out.append(
                _box(
                    x,
                    y,
                    cell,
                    cell,
                    color if bold else INK,
                    WASH if bold else "#fff",
                    rx=0,
                    sw=1.25,
                )
            )
            out.append(
                _mono(x + cell / 2, y + 23, bit, 16, INK if bit == "1" else MUTED, "middle", 600)
            )
        out.append(_text(x0 + width * cell + 14, y + 23, f"= {value}", 15, INK, weight=600))

    for k, (name, value, rule) in enumerate(rows):
        y = 14 + k * 42 + (12 if k >= 2 else 0)
        record(y, name, value, k >= 2, ACCENT)
        if rule:
            out.append(_text(x0 + width * cell + 64, y + 23, rule, 13, MUTED))
    out.append(
        f'<path d="M {x0 - 70} 104 H {x0 + width * cell + 40}" stroke="{INK}" stroke-width="1.5"/>'
    )
    for k, (name, value, rule) in enumerate(shifts):
        y = 250 + k * 42 - 12
        record(y, name, value, False)
        out.append(_text(x0 + width * cell + 64, y + 23, rule, 13, MUTED))
    out.append("</svg>")
    return "".join(out)


def growth_svg(n: int = 100_000) -> str:
    """Number of basic actions for n elements, one bar per order of growth on a
    logarithmic scale: each grid step is ×1000."""
    import math

    def words(v: float) -> str:
        for size, name in [(1e9, "млрд"), (1e6, "млн"), (1e3, "тыс.")]:
            if v >= size:
                return f"≈ {v / size:.3g}".replace(".", ",") + f" {name}"
        return f"{v:.0f}"

    rows = [
        ("O(1)", "элемент по индексу", 1),
        ("O(log n)", "деление пополам", math.log2(n)),
        ("O(n)", "один проход", n),
        ("O(n log n)", "сортировка", n * math.log2(n)),
        ("O(n²)", "все пары", n * n),
        ("O(2ⁿ)", "все подмножества", None),
    ]
    L, R, top, step = 250, 540, 30, 34
    top_power = 12
    out = [_svg(top + len(rows) * step + 40, f"Рост числа действий при n = {n}")]
    out.append(_text(16, 18, f"n = {n:,}".replace(",", " "), 14, INK, weight=600))
    for p in range(0, top_power + 1, 3):
        x = L + p / top_power * (R - L)
        out.append(f'<path d="M {x:.1f} {top - 6} V {top + len(rows) * step}" stroke="{FAINT}"/>')
        label = "1" if p == 0 else f"10{'⁰¹²³⁴⁵⁶⁷⁸⁹'[p] if p < 10 else '¹' + '⁰¹²'[p - 10]}"
        out.append(_text(x, top + len(rows) * step + 18, label, 12, MUTED, "middle"))
    for k, (name, example, v) in enumerate(rows):
        y = top + k * step
        out.append(_mono(16, y + 20, name, 14, INK, weight=600))
        out.append(_text(112, y + 20, example, 13, MUTED))
        if v is None:
            out.append(
                f'<rect x="{L}" y="{y + 7}" width="{R - L}" height="18" fill="{WASH}" '
                f'stroke="{ACCENT}" stroke-dasharray="5 4"/>'
            )
            out.append(_text(R + 8, y + 21, "не дождаться", 13, ACCENT, weight=600))
            continue
        w = max(3, math.log10(max(v, 1)) / top_power * (R - L))
        hot = name == "O(n²)"
        out.append(
            f'<rect x="{L}" y="{y + 7}" width="{w:.1f}" height="18" fill="{WASH}" '
            f'stroke="{ACCENT if hot else INK}" stroke-width="{1.75 if hot else 1.25}"/>'
        )
        out.append(_text(L + w + 8, y + 21, words(v), 13, ACCENT if hot else INK))
    out.append("</svg>")
    return "".join(out)


FIGURES = {
    "rectangles": rectangles_svg,
    "cover": cover_svg,
    "search_stepper": search_stepper,
    "remainder": remainder_svg,
    "overlap": overlap_svg,
    "arcs": arcs_svg,
    "two_arcs": two_arcs_figure,
    "ladder": ladder_svg,
    "factor_stepper": factor_stepper,
    "mask_align": mask_align_svg,
    "mask_try": mask_try,
    "divisor_grid": divisor_grid_svg,
    "remainder_widget": remainder_widget,
    "cheatsheet": cheatsheet,
    "graph": graph_svg,
    "best_stepper": best_stepper,
    "passes_stepper": passes_stepper,
    "backward_stepper": backward_stepper,
    "adjacency": adjacency_svg,
    "call_tree": call_tree_svg,
    "topo_stepper": topo_stepper,
    "path_builder": path_builder,
    "refs": refs_svg,
    "slice": slice_svg,
    "range": range_svg,
    "digits_stepper": digits_stepper,
    "stack_stepper": stack_stepper,
    "place_value": place_value_svg,
    "branch": branch_svg,
    "bool_tree": bool_tree_svg,
    "code_paths": code_paths_svg,
    "loop_checks": loop_checks_svg,
    "for_while": for_while_svg,
    "zip_pairs": zip_pairs_svg,
    "freq_table": freq_table_svg,
    "call_flow": call_flow_svg,
    "fib_tree": fib_tree_svg,
    "sort_stepper": sort_stepper,
    "sort_result": sort_result_svg,
    "tuple_sort_stepper": tuple_sort_stepper,
    "max_stepper": max_stepper,
    "greedy_stepper": greedy_stepper,
    "arg_binding": arg_binding_svg,
    "tuple_return": tuple_return_svg,
    "import_names": import_names_svg,
    "name_main": name_main_svg,
    "program_split": program_split_svg,
    "loop_grid": loop_grid_svg,
    "venn": venn_svg,
    "loop_to_comp": loop_to_comp_svg,
    "cursor": cursor_stepper,
    "range_try": range_try,
    "program_path": program_path_svg,
    "tools": tools_svg,
    "expr_fate": expr_fate_svg,
    "error_stages": error_stages_svg,
    "traceback": traceback_svg,
    "code_loop": code_loop_svg,
    "code_block_anatomy": code_block_anatomy_svg,
    "type_cards": type_cards_svg,
    "plus_types": plus_types_svg,
    "assign": assign_svg,
    "bind_strip": bind_strip_svg,
    "floor_line": floor_line_svg,
    "expr_trees": expr_trees_svg,
    "time_split": time_split_svg,
    "input_flow": input_flow_svg,
    "print_marks": print_marks_svg,
    "fstring": fstring_svg,
    "interval": interval_svg,
    "truth_grids": truth_grids_svg,
    "short_circuit": short_circuit_svg,
    "truthy": truthy_svg,
    "control_flow": control_flow_svg,
    "combo_grids": combo_grids_svg,
    "bits": bits_svg,
    "growth": growth_svg,
}

# Step-through figures as (svg, caption) frames, for the site media
# (scripts/lesson_design/site_media.py). Keys match FIGURES.
STEPPERS = {
    "search_stepper": search_frames,
    "factor_stepper": factor_frames,
    "best_stepper": best_frames,
    "passes_stepper": passes_frames,
    "backward_stepper": backward_frames,
    "topo_stepper": topo_frames,
    "digits_stepper": digits_frames,
    "stack_stepper": stack_frames,
    "sort_stepper": sort_frames,
    "tuple_sort_stepper": tuple_sort_frames,
    "max_stepper": max_frames,
    "greedy_stepper": greedy_frames,
    "cursor": cursor_frames,
}

# Interactive stand widgets that the site renders as its own component.
WIDGETS = {
    "mask_try": "MaskSandbox",
    "remainder_widget": "RemainderExplorer",
    "cheatsheet": "TopicCheatSheet",
    "path_builder": "PathBuilder",
    "range_try": "RangeSandbox",
}

# Widgets whose site component draws from generated data: site_media writes
# the data into the lesson's media manifest.
WIDGET_DATA = {
    "path_builder": path_builder_data,
}

# Script appended once to a page whose HTML contains the marker.
PAGE_SCRIPTS = {
    "data-stepper": STEPPER_JS,
    "data-mask-try": MASK_TRY_JS,
    "data-remainder": REMAINDER_JS,
    "data-pathb": PATH_BUILDER_JS,
    "data-range-try": RANGE_TRY_JS,
}

# The Excel course (Change 176): its figures and sandboxes live in excel_figures.py.
from excel_figures import EXCEL_FIGURES, EXCEL_SCRIPTS, EXCEL_STEPPERS, EXCEL_WIDGETS  # noqa: E402

FIGURES.update(EXCEL_FIGURES)
WIDGETS.update(EXCEL_WIDGETS)
STEPPERS.update(EXCEL_STEPPERS)
PAGE_SCRIPTS.update(EXCEL_SCRIPTS)

# Topic 5 (Change 178): figures of number records live in record_figures.py.
from record_figures import RECORD_FIGURES, RECORD_STEPPERS  # noqa: E402

FIGURES.update(RECORD_FIGURES)
STEPPERS.update(RECORD_STEPPERS)

# Topic waves (Changes 179–182): each topic keeps its figures in its own module.
from base_figures import (  # noqa: E402
    BASE_FIGURES,
    BASE_SCRIPTS,
    BASE_STEPPERS,
    BASE_WIDGETS,
)
from cluster_figures import (  # noqa: E402
    CLUSTER_FIGURES,
    CLUSTER_SCRIPTS,
    CLUSTER_STEPPERS,
    CLUSTER_WIDGETS,
)
from code_figures import (  # noqa: E402
    CODE_FIGURES,
    CODE_SCRIPTS,
    CODE_STEPPERS,
    CODE_WIDGETS,
)
from combo_figures import (  # noqa: E402
    COMBO_FIGURES,
    COMBO_SCRIPTS,
    COMBO_STEPPERS,
    COMBO_WIDGETS,
)
from db_figures import (  # noqa: E402
    DB_FIGURES,
    DB_SCRIPTS,
    DB_STEPPERS,
    DB_WIDGETS,
)
from executor_figures import (  # noqa: E402
    EXECUTOR_FIGURES,
    EXECUTOR_SCRIPTS,
    EXECUTOR_STEPPERS,
    EXECUTOR_WIDGETS,
)
from game_figures import (  # noqa: E402
    GAME_FIGURES,
    GAME_SCRIPTS,
    GAME_STEPPERS,
    GAME_WIDGETS,
)
from graph_match_figures import (  # noqa: E402
    GRAPH_MATCH_FIGURES,
    GRAPH_MATCH_SCRIPTS,
    GRAPH_MATCH_STEPPERS,
    GRAPH_MATCH_WIDGETS,
)
from greedy_figures import (  # noqa: E402
    GREEDY_FIGURES,
    GREEDY_SCRIPTS,
    GREEDY_STEPPERS,
    GREEDY_WIDGETS,
)
from grid_figures import (  # noqa: E402
    GRID_FIGURES,
    GRID_SCRIPTS,
    GRID_STEPPERS,
    GRID_WIDGETS,
)
from ip_figures import (  # noqa: E402
    IP_FIGURES,
    IP_SCRIPTS,
    IP_STEPPERS,
    IP_WIDGETS,
)
from logic_table_figures import (  # noqa: E402
    LOGIC_TABLE_FIGURES,
    LOGIC_TABLE_SCRIPTS,
    LOGIC_TABLE_STEPPERS,
    LOGIC_TABLE_WIDGETS,
)
from parameter_figures import (  # noqa: E402
    PARAMETER_FIGURES,
    PARAMETER_SCRIPTS,
    PARAMETER_STEPPERS,
    PARAMETER_WIDGETS,
)
from password_figures import (  # noqa: E402
    PASSWORD_FIGURES,
    PASSWORD_SCRIPTS,
    PASSWORD_STEPPERS,
    PASSWORD_WIDGETS,
)
from process_figures import (  # noqa: E402
    PROCESS_FIGURES,
    PROCESS_SCRIPTS,
    PROCESS_STEPPERS,
    PROCESS_WIDGETS,
)
from recursion_figures import (  # noqa: E402
    RECURSION_FIGURES,
    RECURSION_SCRIPTS,
    RECURSION_STEPPERS,
    RECURSION_WIDGETS,
)
from sequence_figures import (  # noqa: E402
    SEQUENCE_FIGURES,
    SEQUENCE_SCRIPTS,
    SEQUENCE_STEPPERS,
    SEQUENCE_WIDGETS,
)
from string_figures import (  # noqa: E402
    STRING_FIGURES,
    STRING_SCRIPTS,
    STRING_STEPPERS,
    STRING_WIDGETS,
)
from table_figures import (  # noqa: E402
    TABLE_FIGURES,
    TABLE_SCRIPTS,
    TABLE_STEPPERS,
    TABLE_WIDGETS,
)
from turing_figures import (  # noqa: E402
    TURING_FIGURES,
    TURING_SCRIPTS,
    TURING_STEPPERS,
    TURING_WIDGETS,
)
from turtle_figures import (  # noqa: E402
    TURTLE_FIGURES,
    TURTLE_SCRIPTS,
    TURTLE_STEPPERS,
    TURTLE_WIDGETS,
)
from volume_figures import (  # noqa: E402
    VOLUME_FIGURES,
    VOLUME_SCRIPTS,
    VOLUME_STEPPERS,
    VOLUME_WIDGETS,
)

for _figures, _steppers, _widgets, _scripts in (
    (RECURSION_FIGURES, RECURSION_STEPPERS, RECURSION_WIDGETS, RECURSION_SCRIPTS),
    (SEQUENCE_FIGURES, SEQUENCE_STEPPERS, SEQUENCE_WIDGETS, SEQUENCE_SCRIPTS),
    (CLUSTER_FIGURES, CLUSTER_STEPPERS, CLUSTER_WIDGETS, CLUSTER_SCRIPTS),
    (CODE_FIGURES, CODE_STEPPERS, CODE_WIDGETS, CODE_SCRIPTS),
    (VOLUME_FIGURES, VOLUME_STEPPERS, VOLUME_WIDGETS, VOLUME_SCRIPTS),
    (COMBO_FIGURES, COMBO_STEPPERS, COMBO_WIDGETS, COMBO_SCRIPTS),
    (TABLE_FIGURES, TABLE_STEPPERS, TABLE_WIDGETS, TABLE_SCRIPTS),
    (IP_FIGURES, IP_STEPPERS, IP_WIDGETS, IP_SCRIPTS),
    (PASSWORD_FIGURES, PASSWORD_STEPPERS, PASSWORD_WIDGETS, PASSWORD_SCRIPTS),
    (BASE_FIGURES, BASE_STEPPERS, BASE_WIDGETS, BASE_SCRIPTS),
    (GRID_FIGURES, GRID_STEPPERS, GRID_WIDGETS, GRID_SCRIPTS),
    (GAME_FIGURES, GAME_STEPPERS, GAME_WIDGETS, GAME_SCRIPTS),
    (STRING_FIGURES, STRING_STEPPERS, STRING_WIDGETS, STRING_SCRIPTS),
    (GREEDY_FIGURES, GREEDY_STEPPERS, GREEDY_WIDGETS, GREEDY_SCRIPTS),
    (DB_FIGURES, DB_STEPPERS, DB_WIDGETS, DB_SCRIPTS),
    (GRAPH_MATCH_FIGURES, GRAPH_MATCH_STEPPERS, GRAPH_MATCH_WIDGETS, GRAPH_MATCH_SCRIPTS),
    (LOGIC_TABLE_FIGURES, LOGIC_TABLE_STEPPERS, LOGIC_TABLE_WIDGETS, LOGIC_TABLE_SCRIPTS),
    (TURTLE_FIGURES, TURTLE_STEPPERS, TURTLE_WIDGETS, TURTLE_SCRIPTS),
    (TURING_FIGURES, TURING_STEPPERS, TURING_WIDGETS, TURING_SCRIPTS),
    (EXECUTOR_FIGURES, EXECUTOR_STEPPERS, EXECUTOR_WIDGETS, EXECUTOR_SCRIPTS),
    (PARAMETER_FIGURES, PARAMETER_STEPPERS, PARAMETER_WIDGETS, PARAMETER_SCRIPTS),
    (PROCESS_FIGURES, PROCESS_STEPPERS, PROCESS_WIDGETS, PROCESS_SCRIPTS),
):
    FIGURES.update(_figures)
    STEPPERS.update(_steppers)
    WIDGETS.update(_widgets)
    PAGE_SCRIPTS.update(_scripts)
