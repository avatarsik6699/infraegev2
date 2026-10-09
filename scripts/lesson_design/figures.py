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


def _text(x, y, s, size=15, color=INK, anchor="start", weight=400) -> str:
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
            out.append(
                _text(tx + 104, y + h / 2 + 5, "квадрат", 15, ACCENT, weight=600)
            )
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
    out.append(
        _text(tx, top + 40, f"{side} · {side} = {side * side}", 16, INK, weight=600)
    )
    out.append(_text(tx, top + 64, "уже все клетки числа 36", 15, MUTED))
    out.append(
        _text(tx, top + 104, f"{rows} · {cols} = {rows * cols}", 16, ACCENT, weight=600)
    )
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
        out.append(
            _bracket(x + 2, x + w - 2, top + cell + 8, color if k == q else MUTED)
        )
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
        f'порциями по {d}: {ru_count(q, *PORTIONS)} и {r} в остатке">'
        + "".join(out)
        + "</svg>"
    )


# One caption for the stand widget and the site RemainderExplorer (export_lesson).
REMAINDER_CAPTION = (
    "Клетки числа n разложены порциями по d: полные порции — частное `n // d`, "
    "клетки, которым не хватило на порцию, — остаток `n % d`. Меняйте числа или "
    "выберите пример."
)


def remainder_widget(n: int = 17, d: int = 5) -> str:
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
        for a, b in [(17, 5), (20, 5), (3, 7)]
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


STAND = Path(__file__).resolve().parents[2] / "docs" / "artifacts" / "lesson-design"


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
        return f"<ul{cols}>" + "".join(
            f"<li><span class='cs-k'>{_inline(k)}</span>"
            f"<span class='cs-v'>{_inline(v)}</span></li>"
            for k, v in items
        ) + "</ul>"

    groups = []
    for g in data["groups"]:
        level = f'<small>{html.escape(g["level"])}</small>' if g.get("level") else ""
        groups.append(
            f'<section class="cs-group"><h3><a href="{prefix}-{g["page"]}.html">'
            f'<span class="cs-n">{g["page"]}</span>{html.escape(g["title"])}</a>{level}</h3>'
            f'{rows(g["items"])}</section>'
        )
    sections = []
    for sec in data.get("sections", []):
        body = rows(sec["rows"], sec.get("columns", False)) if "rows" in sec else ""
        if "steps" in sec:
            body += '<ol class="cs-checks">' + "".join(
                f"<li>{_inline(c)}</li>" for c in sec["steps"]
            ) + "</ol>"
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

        def x(v):
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
        h = int(float(re.match(r'<svg viewBox="0 0 [\d.]+ ([\d.]+)"', svg).group(1)))
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
                        f'{' stroke-width="2"' if p == "*" else ""}/>'
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
    picture (graph_svg) and the site sandbox (PathBuilder, via export_media).

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
                    (abs(pt[0] - x) + abs(pt[1] - y)
                     for j, cv in enumerate(curves) if j != i for x, y in cv),
                    default=99,
                )
                free = all(abs(pt[0] - x) > 26 or abs(pt[1] - y) > 20 for x, y in labels)
                return near_edge > 22 and free

            options = [_quad(p0, c, p2, t) for t in (0.5, 0.42, 0.58, 0.34, 0.66, 0.28, 0.72)]
            lx, ly = next((pt for pt in options if clear(pt)), options[0])
            labels.append((lx, ly))
            label = (lx, ly, 7.6 * len(_num(w)) + 8)
            ys += [ly - 12, ly + 12]
        out_edges.append({
            "u": u, "v": v, "w": w, "backward": backward,
            "path": (f"M {a[0]:.1f} {a[1]:.1f} Q {c[0]:.1f} {c[1]:.1f} "
                     f"{base[0]:.1f} {base[1]:.1f}"),
            "arrow": (f"M {tip[0]:.1f} {tip[1]:.1f} "
                      f"L {base[0] - e[1] * 4.5:.1f} {base[1] + e[0] * 4.5:.1f} "
                      f"L {base[0] + e[1] * 4.5:.1f} {base[1] - e[0] * 4.5:.1f} Z"),
            "label": label,
        })
    return {"width": width, "pos": pos, "edges": out_edges,
            "top": min(ys) - 8, "bottom": max(ys) + 8}


def graph_geometry(edges) -> dict:
    """graph_layout moved so that the picture starts at y = 0: the data the
    site sandbox draws from (export_media → manifest kind «graph»)."""
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
        "nodes": [{"id": v, "x": round(x, 1), "y": round(y - top, 1)}
                  for v, (x, y) in g["pos"].items()],
        "edges": [{
            "from": e["u"], "to": e["v"], "weight": _num(e["w"]),
            "path": shift_path(e["path"]), "arrow": shift_path(e["arrow"]),
            "label": None if e["label"] is None else {
                "x": round(e["label"][0], 1), "y": round(e["label"][1] - top, 1),
                "width": round(e["label"][2], 1)},
        } for e in g["edges"]],
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
    g = graph_layout(edges, order=order, up=values is not None or footer is not None,
                     width=width)
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
        parts.append(f'<path{tag} d="{e["path"]}" fill="none" stroke="{stroke}" '
                     f'stroke-width="{sw}"{dash}/>')
        parts.append(f'<path{tag} d="{e["arrow"]}" fill="{stroke}"/>')
        if e["label"]:
            lx, ly, tw = e["label"]
            text = _text(lx, ly + 5, _num(e["w"]), 13, ACCENT if hot else MUTED, "middle",
                         600 if hot else 400)
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
            parts.append(f'<g data-v="{v}" tabindex="0" role="button" '
                         f'aria-label="Вершина {v}" class="gv">')
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{NODE_R}" fill="{fill}" '
                     f'stroke="{stroke}" stroke-width="{sw}"{dash}/>')
        parts.append(_text(x, y + 5, str(v), 14 if len(str(v)) < 4 else 12, color,
                           "middle", 600))
        if interactive:
            parts.append("</g>")
        if values and v in values:
            hot = v == changed
            # above a vertex of the upper row, under the others
            vy = y - NODE_R - 9 if y < 0 else y + NODE_R + 19
            parts.append(_text(x, vy, values[v], 14, ACCENT if hot else INK, "middle",
                               600 if hot else 400))
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
        + "".join(parts) + "</g></svg>"
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
                graph_svg(edges, values=values, current=cur, edge=edge, changed=changed,
                          footer=[f"Стек вызовов: {chain}"]),
                caption,
            )
        )

    def best(v):
        if v in memo:
            return memo[v]
        stack.append(v)
        if v == target:
            memo[v] = 0.0
            snap(f"best({v}): это цель, идти больше не нужно — f({v}) = 0. Значение сохранено.",
                 v, changed=v)
            stack.pop()
            return 0.0
        snap(f"Вызов best({v}): ответа для {v} ещё нет, перебираем рёбра из {v}.", v)
        answer = float("inf")
        for nxt, w in graph.get(v, []):
            known = nxt in memo
            rest = best(nxt)
            cand = w + rest
            got = f"best({nxt}) уже сохранено — берём из памяти: {_f(rest)}." if known else (
                f"best({nxt}) вернул {_f(rest)}.")
            better = cand < answer
            answer = min(answer, cand)
            snap(
                f"Ребро {v} → {nxt} ({w:g}): {got} Кандидат {w:g} + {_f(rest)} = {_f(cand)}"
                + (" — пока лучший." if better else f", хуже {_f(answer)}."),
                v,
                edge=(v, nxt),
            )
        memo[v] = answer
        snap(f"Все рёбра из {v} просмотрены: f({v}) = {_f(answer)}. Значение сохранено.",
             v, changed=v)
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
            (graph_svg(edges, values=values, edge=edge, changed=changed,
                       footer=[where] if where else None), caption)
        )

    snap(f"До проходов: d[{source}] = 0, до остальных вершин путь пока не найден — ∞.",
         where="Рёбра в порядке файла: " + ", ".join(f"{u} → {v}" for u, v, _ in edges))
    passes = len(nodes) - 1
    for p in range(1, passes + 1):
        changed_any = False
        for i, (u, v, w) in enumerate(edges, 1):
            w = float(w)
            where = f"Проход {p} из {passes} · ребро {i} из {len(edges)}"
            if d[u] == float("inf"):
                snap(f"{u} → {v}: до {u} путь пока не найден — ребро ничего не даёт.",
                     (u, v), where=where)
                continue
            cand = d[u] + w
            if cand < d[v]:
                old = d[v]
                d[v] = cand
                changed_any = True
                snap(f"{u} → {v}: {_f(d[u])} + {w:g} = {_f(cand)} < {_f(old)} — улучшаем d[{v}].",
                     (u, v), changed=v, where=where)
            else:
                snap(f"{u} → {v}: {_f(d[u])} + {w:g} = {_f(cand)}, не лучше {_f(d[v])}.",
                     (u, v), where=where)
        if not changed_any:
            snap(f"За проход {p} ничего не изменилось — дальше можно не проходить.",
                 where=f"Проход {p} без изменений")
            break
    else:
        snap(f"Выполнено V − 1 = {ru_count(passes, 'проход', 'прохода', 'проходов')} — "
             "значения окончательные.")
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
            (graph_svg(edges, values=values, current=cur, edge=edge, path=path,
                       changed=changed), caption)
        )

    snap("Значения f пока не известны. Начнём с вершин, после которых идти "
         "некуда или почти некуда, — с цели.")
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
        formula = (f"f({v}) = {_num(cands[0][2])} + f({cands[0][1]}) = {nums} = {_f(best_c)}"
                   if len(cands) == 1 else
                   f"f({v}) = min({terms}) = min({nums}) = {_f(best_c)}")
        snap(f"{formula}. Ответы для соседей уже известны — они ближе к цели.",
             v, edge=(v, best_x), changed=v)
    path, v = [source], source
    while v != target and v in win:
        v = win[v]
        path.append(v)
    snap(f"Готово: f({source}) = {_f(f[source])}. Если из каждой вершины идти по ребру, "
         f"которое дало минимум, получится путь {' → '.join(map(str, path))}.",
         path=path)
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
    out = [f'<svg viewBox="0 0 {width} {h}" role="img" '
           f'aria-label="Строки файла раскладываются в словарь graph по начальной вершине">']
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
        out.append(_text(rx, y + 5, f"{k}: [{items}]", 15, ACCENT if hot else INK, "start",
                         600 if hot else 400))
    for i, t in enumerate(targets):
        y = top + row * (len(keys) + i)
        out.append(_text(rx, y + 5, f"{t}: записи нет — graph.get({t}, []) даёт []", 15, MUTED))
    out.append("</svg>")
    return "".join(out)


def _call_tree(edges, v, target, memo, cache):
    """Nested calls of best(v): (vertex, from memory?, children)."""
    if cache and v in memo:
        return (v, True, [])
    kids = [] if v == target else [_call_tree(edges, x, target, memo, cache)
                                   for x, _ in _out_edges(edges, v)]
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
        out.append(_text(k * half + 20, 20, "с @cache" if cache else "без @cache", 15, INK,
                         "start", 600))
        out.append(_text(k * half + 20, 40, note, 13, MUTED))
        for x, d, _v, _mem, ids in pos.values():
            for i in ids:
                cx, cd = pos[i][0], pos[i][1]
                out.append(f'<line x1="{px(x):.1f}" y1="{py(d) + 12}" x2="{px(cx):.1f}" '
                           f'y2="{py(cd) - 12}" stroke="{FAINT}" stroke-width="1.25"/>')
        for x, d, v, mem, _ids in pos.values():
            label = f"best({v})"
            tw = 6.9 * len(label) + 10
            dash = ' stroke-dasharray="4 3"' if mem else ""
            out.append(f'<rect x="{px(x) - tw / 2:.1f}" y="{py(d) - 12}" width="{tw:.1f}" '
                       f'height="24" rx="6" fill="{WASH if mem else "#ffffff"}" '
                       f'stroke="{MUTED if mem else INK}" stroke-width="1.25"{dash}/>')
            out.append(_text(px(x), py(d) + 4, label, 12, MUTED if mem else INK, "middle"))
            height = max(height, py(d) + 20)
        if cache:
            out.append(_text(k * half + 20, height + 18, "пунктир — ответ взят из памяти", 13,
                             MUTED))
    height += 30
    out.insert(0, f'<line x1="{half}" y1="8" x2="{half}" y2="{height - 8}" stroke="{FAINT}"/>')
    return (f'<svg viewBox="0 0 {width} {height}" role="img" '
            f'aria-label="Дерево вызовов best без запоминания и с запоминанием">'
            + "".join(out) + "</svg>")


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
        frames.append((graph_svg(edges, values=values, current=cur, faded=done,
                                 footer=[f"Порядок: {order}"]), caption))

    snap("Под каждой вершиной — сколько рёбер в неё входит. Ищем вершину, в "
         "которую не входит ни одно ребро.")
    while len(done) < len(nodes):
        v = next(x for x in nodes if x not in done and indeg[x] == 0)
        nxt = [x for u, x, _ in edges if u == v]
        for x in nxt:
            indeg[x] -= 1
        done.append(v)
        if nxt:
            names = (", ".join(map(str, nxt[:-1])) + " и " + str(nxt[-1])
                     if len(nxt) > 1 else str(nxt[0]))
            tail = f" Убираем её рёбра: у {names} входящих рёбер становится меньше."
        else:
            tail = ""
        snap(f"В {v} ничего не входит — записываем её в порядок.{tail}", v)
    snap(f"Все вершины записаны: {', '.join(map(str, done))}. Каждое ребро идёт от более "
         "ранней вершины к более поздней.")
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

    return {"kind": "graph", **graph_geometry(edges), "source": source,
            "target": target, "shortest": str(f(source))}


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
}

# Step-through figures as (svg, caption) frames, for the site export
# (scripts/lesson_design/export_media.py). Keys match FIGURES.
STEPPERS = {
    "search_stepper": search_frames,
    "factor_stepper": factor_frames,
    "best_stepper": best_frames,
    "passes_stepper": passes_frames,
    "backward_stepper": backward_frames,
    "topo_stepper": topo_frames,
}

# Interactive stand widgets that the site renders as its own component.
WIDGETS = {
    "mask_try": "MaskSandbox",
    "remainder_widget": "RemainderExplorer",
    "cheatsheet": "TopicCheatSheet",
    "path_builder": "PathBuilder",
}

# Widgets whose site component draws from generated data: export_media writes
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
}
