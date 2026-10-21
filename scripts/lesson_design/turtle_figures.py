"""Figures of topic 6 «Простейшие алгоритмы для исполнителей» (registered in figures.FIGURES).

The stand cannot open a turtle window, so the commands of a task are executed
here without Tk: the same «Вперёд n», «Назад n», «Направо m», «Налево m»,
«Поднять хвост», «Опустить хвост», «Повтори k [ … ]» as in the lesson. The
trace, the grid of integer points and the class of every point — strictly
inside, on the boundary, outside — are computed from the commands; the
counts in the captions come from the same computation.

``tt_draw(cmds, heading, grid, show, label_end)`` — what the program draws:
the trace, the integer grid; points inside or on the boundary in colour.
``tt_state(cmds, heading)`` — step by step: position, direction and tail
after every command.
``tt_rects(rects, show)`` — rectangles given by their bounds and the integer
points of their intersection, union or of exactly one of them.
``tt_segment(a, b)`` — a segment with the integer points on it.
"""

from __future__ import annotations

import math

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stepper, _text

W = 660
EPS = 1e-9

# --- the executor --------------------------------------------------------------------


def tokens(cmds: str) -> list[str]:
    cmds = cmds.replace("[", " [ ").replace("]", " ] ")
    return cmds.split()


def parse(cmds: str):
    """Commands as a list: ("F", n), ("R", m), ("U",), ("D",), ("REP", k, body)."""
    toks = tokens(cmds)
    pos = 0

    def block():
        nonlocal pos
        out = []
        while pos < len(toks) and toks[pos] != "]":
            word = toks[pos]
            pos += 1
            if word == "Повтори":
                k = int(toks[pos])
                assert toks[pos + 1] == "["
                pos += 2
                body = block()
                assert toks[pos] == "]"
                pos += 1
                out.append(("REP", k, body))
            elif word in ("Вперёд", "Назад", "Направо", "Налево"):
                n = float(toks[pos])
                pos += 1
                out.append(({"Вперёд": "F", "Назад": "B", "Направо": "R", "Налево": "L"}[word], n))
            elif word in ("Поднять", "Опустить"):
                assert toks[pos] == "хвост"
                pos += 1
                out.append(("U",) if word == "Поднять" else ("D",))
            else:
                raise ValueError(f"unknown command {word!r} in {cmds!r}")
        return out

    prog = block()
    assert pos == len(toks), cmds
    return prog


def flat(prog):
    for c in prog:
        if c[0] == "REP":
            for _ in range(c[1]):
                yield from flat(c[2])
        else:
            yield c


def _r(v: float) -> float:
    return round(v, 9) + 0.0


def run(cmds: str, heading: float = 90, start=(0.0, 0.0)):
    """States after every elementary command: (x, y, heading, pen, segment)."""
    x, y = start
    h, pen = heading % 360, True
    states: list[tuple] = [(x, y, h, pen, None, None)]
    for c in flat(parse(cmds)):
        seg = None
        if c[0] in ("F", "B"):
            n = c[1] if c[0] == "F" else -c[1]
            nx = _r(x + n * math.cos(math.radians(h)))
            ny = _r(y + n * math.sin(math.radians(h)))
            if pen:
                seg = ((x, y), (nx, ny))
            x, y = nx, ny
        elif c[0] == "R":
            h = (h - c[1]) % 360
        elif c[0] == "L":
            h = (h + c[1]) % 360
        elif c[0] == "U":
            pen = False
        elif c[0] == "D":
            pen = True
        states.append((x, y, h, pen, seg, c))
    return states


def segments(cmds: str, heading: float = 90, start=(0.0, 0.0)):
    return [s[4] for s in run(cmds, heading, start) if s[4] is not None]


def polygons(cmds: str, heading: float = 90, start=(0.0, 0.0)) -> list[list[tuple]]:
    """Closed contours of the trace: from a pen-down start until the turtle
    first comes back to it."""
    out = []
    path: list[tuple] = []
    for *_xyh, pen, seg, _c in run(cmds, heading, start):
        if seg is None:
            if not pen:
                path = []
            continue
        if not path:
            path = [seg[0]]
        path.append(seg[1])
        if len(path) > 3 and _same(path[-1], path[0]):
            poly = _dedupe(path[:-1])
            if not any(_same_poly(poly, p) for p in out):
                out.append(poly)
            path = [seg[1]]
    return out


def _same(a, b) -> bool:
    return abs(a[0] - b[0]) < 1e-7 and abs(a[1] - b[1]) < 1e-7


def _same_poly(a, b) -> bool:
    return len(a) == len(b) and all(any(_same(p, q) for q in b) for p in a)


def _dedupe(path):
    out = []
    for p in path:
        if not out or not _same(out[-1], p):
            out.append(p)
    # drop points in the middle of a straight side
    res = []
    for i, p in enumerate(out):
        a, b = out[i - 1], out[(i + 1) % len(out)]
        cross = (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])
        if abs(cross) > 1e-7:
            res.append(p)
    return res


def on_segment(p, a, b) -> bool:
    cross = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
    if abs(cross) > 1e-7:
        return False
    return (
        min(a[0], b[0]) - 1e-7 <= p[0] <= max(a[0], b[0]) + 1e-7
        and min(a[1], b[1]) - 1e-7 <= p[1] <= max(a[1], b[1]) + 1e-7
    )


def inside(p, poly) -> bool:
    """Ray casting; points on the boundary are decided by the caller."""
    x, y = p
    res = False
    n = len(poly)
    for i in range(n):
        (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % n]
        if (y1 > y) != (y2 > y):
            xi = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
            if xi > x:
                res = not res
    return res


def classify(cmds: str, heading: float = 90, grid=None, start=(0.0, 0.0)):
    """Integer points of the grid: 'in', 'edge' (on a drawn line) or 'out'."""
    segs = segments(cmds, heading, start)
    polys = polygons(cmds, heading, start)
    xs = [c for s in segs for c in (s[0][0], s[1][0])]
    ys = [c for s in segs for c in (s[0][1], s[1][1])]
    if grid is None:
        grid = (
            math.floor(min(xs)) - 1,
            math.ceil(max(xs)) + 1,
            math.floor(min(ys)) - 1,
            math.ceil(max(ys)) + 1,
        )
    x0, x1, y0, y1 = grid
    out = {}
    for gx in range(x0, x1 + 1):
        for gy in range(y0, y1 + 1):
            p = (gx, gy)
            if any(on_segment(p, a, b) for a, b in segs):
                out[p] = "edge"
            elif any(inside(p, poly) for poly in polys):
                out[p] = "in"
            else:
                out[p] = "out"
    return out, grid


# --- drawing ---------------------------------------------------------------------------


class _View:
    def __init__(self, grid, x0, y0, w, h):
        gx0, gx1, gy0, gy1 = grid
        self.k = min(w / max(gx1 - gx0, 1), h / max(gy1 - gy0, 1))
        self.ox = x0 + (w - (gx1 - gx0) * self.k) / 2 - gx0 * self.k
        self.oy = y0 + (h - (gy1 - gy0) * self.k) / 2 + gy1 * self.k

    def __call__(self, x, y):
        return self.ox + x * self.k, self.oy - y * self.k


def _arrow(v: _View, x, y, h) -> str:
    cx, cy = v(x, y)
    a = math.radians(h)
    pts = []
    for ang, r in ((0, 13), (140, 9), (-140, 9)):
        b = a + math.radians(ang)
        pts.append(f"{cx + r * math.cos(b):.1f},{cy - r * math.sin(b):.1f}")
    return f'<polygon points="{" ".join(pts)}" fill="{ACCENT}"/>'


def _axes(v: _View, grid) -> list[str]:
    gx0, gx1, gy0, gy1 = grid
    out = []
    if gx0 <= 0 <= gx1:
        (ax, ay0), (_, ay1) = v(0, gy0), v(0, gy1)
        out.append(
            f'<line x1="{ax:.1f}" y1="{ay0:.1f}" x2="{ax:.1f}" y2="{ay1:.1f}" stroke="{FAINT}" stroke-width="1.2"/>'
        )
    if gy0 <= 0 <= gy1:
        (bx0, by), (bx1, _) = v(gx0, 0), v(gx1, 0)
        out.append(
            f'<line x1="{bx0:.1f}" y1="{by:.1f}" x2="{bx1:.1f}" y2="{by:.1f}" stroke="{FAINT}" stroke-width="1.2"/>'
        )
    ox, oy = v(0, 0)
    if gx0 <= 0 <= gx1 and gy0 <= 0 <= gy1:
        out.append(_text(ox - 6, oy + 15, "0", 12, MUTED, "end"))
    return out


def tt_draw(
    cmds: str,
    heading: float = 90,
    grid=None,
    show: str = "",
    label_end: bool = False,
    height: int = 330,
    note: str = "",
) -> str:
    """The trace and the integer grid; show: 'in', 'edge', 'in edge' or ''."""
    cls, grid = classify(cmds, heading, grid)
    bottom = 40
    v = _View(grid, 30, 18, W - 60, height - bottom - 30)
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Рисунок Черепахи">']
    out += _axes(v, grid)
    lines, dots = [], []
    for a, b in segments(cmds, heading):
        (x1, y1), (x2, y2) = v(*a), v(*b)
        lines.append(
            f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
            f'stroke="{INK}" stroke-width="2.2" stroke-linecap="round"/>'
        )
    counts = {"in": 0, "edge": 0}
    for p, c in cls.items():
        cx, cy = v(*p)
        hot = c in show.split()
        if hot:
            counts[c] += 1
        else:
            # faint grid nodes go under the trace, so they do not break its lines
            out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="2.6" fill="{FAINT}"/>')
            continue
        color = ACCENT if (hot and c == "in") else (INK if hot else FAINT)
        r = 4.2 if hot else 2.6
        fill = color if not (hot and c == "edge") else "#fff"
        stroke = f' stroke="{INK}" stroke-width="1.8"' if hot and c == "edge" else ""
        dots.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" fill="{fill}"{stroke}/>')
    out += lines + dots
    states = run(cmds, heading)
    x, y, h = states[-1][0], states[-1][1], states[-1][2]
    out.append(_arrow(v, x, y, h))
    parts = []
    if "in" in show.split():
        parts.append(f"строго внутри: {counts['in']}")
    if "edge" in show.split():
        parts.append(f"на линиях: {counts['edge']}")
    if label_end:
        parts.append(f"конец: ({_fmt(x)}; {_fmt(y)}), направление {_fmt(h)}°")
    if note:
        parts.append(note)
    if parts:
        out.append(_text(W / 2, height - 14, "  ·  ".join(parts), 14, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def _fmt(v: float) -> str:
    if abs(v - round(v)) < 1e-6:
        return str(int(round(v)))
    return f"{v:.3f}".replace(".", ",")


DIRS = {0: "вправо", 90: "вверх", 180: "влево", 270: "вниз"}


def _dir(h: float) -> str:
    return (
        DIRS.get(int(round(h)) % 360, f"{_fmt(h)}°") if abs(h - round(h)) < 1e-6 else f"{_fmt(h)}°"
    )


def state_frames(cmds: str, heading: float = 90) -> list[tuple[str, str]]:
    states = run(cmds, heading)
    segs_all = [s[4] for s in states if s[4] is not None]
    xs = [c for s in segs_all for c in (s[0][0], s[1][0])] + [0]
    ys = [c for s in segs_all for c in (s[0][1], s[1][1])] + [0]
    grid = (
        math.floor(min(xs)) - 1,
        math.ceil(max(xs)) + 1,
        math.floor(min(ys)) - 1,
        math.ceil(max(ys)) + 1,
    )
    names = {"F": "Вперёд", "B": "Назад", "R": "Направо", "L": "Налево"}
    frames = []
    height = 330
    for i, (x, y, h, pen, _seg, c) in enumerate(states):
        v = _View(grid, 30, 18, W - 260, height - 50)
        out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-hidden="true">']
        out += _axes(v, grid)
        for gx in range(grid[0], grid[1] + 1):
            for gy in range(grid[2], grid[3] + 1):
                cx, cy = v(gx, gy)
                out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="2" fill="{FAINT}"/>')
        for j, s in enumerate(states[1 : i + 1], start=1):
            if s[4] is not None:
                (x1, y1), (x2, y2) = v(*s[4][0]), v(*s[4][1])
                last = j == i
                out.append(
                    f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
                    f'stroke="{ACCENT if last else INK}" stroke-width="{2.8 if last else 2}" stroke-linecap="round"/>'
                )
        out.append(_arrow(v, x, y, h))
        bx = W - 215
        out.append(
            f'<rect x="{bx}" y="30" width="200" height="132" rx="10" fill="{WASH}" stroke="{FAINT}"/>'
        )
        out.append(_text(bx + 16, 60, f"x = {_fmt(x)}, y = {_fmt(y)}", 15, INK, weight=600))
        out.append(_text(bx + 16, 92, f"голова: {_dir(h)}", 15, INK, weight=600))
        out.append(
            _text(bx + 16, 124, f"хвост: {'опущен' if pen else 'поднят'}", 15, INK, weight=600)
        )
        out.append(_text(bx + 16, 152, f"шаг {i} из {len(states) - 1}", 13, MUTED))
        out.append("</svg>")
        if c is None:
            cap = f"Начало: ({_fmt(x)}; {_fmt(y)}), голова {_dir(h)}, хвост опущен."
        elif c[0] in names:
            cap = f"{names[c[0]]} {_fmt(c[1])}: " + (
                f"теперь ({_fmt(x)}; {_fmt(y)})."
                if c[0] in "FB"
                else f"голова {_dir(h)}, положение то же."
            )
        else:
            cap = (
                "Хвост поднят: дальше перемещения без линии."
                if c[0] == "U"
                else "Хвост опущен: перемещения снова рисуют."
            )
        frames.append(("".join(out), cap))
    return frames


def tt_state(cmds: str, heading: float = 90) -> str:
    """Position, direction and tail after every command."""
    return _stepper(state_frames(cmds, heading))


# --- rectangles by their bounds ----------------------------------------------------------


def _in_rect(p, r, strict: bool) -> bool:
    x0, x1, y0, y1 = r
    if strict:
        return x0 < p[0] < x1 and y0 < p[1] < y1
    return x0 <= p[0] <= x1 and y0 <= p[1] <= y1


def rect_points(rects, mode: str, strict: bool = False) -> list[tuple[int, int]]:
    a, b = rects
    xs = range(min(a[0], b[0]) - 1, max(a[1], b[1]) + 2)
    ys = range(min(a[2], b[2]) - 1, max(a[3], b[3]) + 2)
    out = []
    for x in xs:
        for y in ys:
            ia, ib = _in_rect((x, y), a, strict), _in_rect((x, y), b, strict)
            ok = {"both": ia and ib, "any": ia or ib, "one": ia != ib, "first": ia and not ib}[mode]
            if ok:
                out.append((x, y))
    return out


def tt_rects(rects, mode: str = "both", strict: bool = False, height: int = 320) -> str:
    """Two rectangles and the integer points of the asked region."""
    pts = set(rect_points(rects, mode, strict))
    a, b = rects
    grid = (min(a[0], b[0]) - 1, max(a[1], b[1]) + 1, min(a[2], b[2]) - 1, max(a[3], b[3]) + 1)
    v = _View(grid, 30, 18, W - 60, height - 70)
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Два прямоугольника">']
    out += _axes(v, grid)
    shapes, hot_dots = [], []
    for i, r in enumerate(rects):
        (x0, y1), (x1, y0) = v(r[0], r[3]), v(r[1], r[2])
        shapes.append(
            f'<rect x="{x0:.1f}" y="{y1:.1f}" width="{x1 - x0:.1f}" height="{y0 - y1:.1f}" '
            f'fill="none" stroke="{INK}" stroke-width="2"{' stroke-dasharray="7 5"' if i else ""}/>'
        )
        shapes.append(_text(x0 + 6, y1 + 18, "AB"[i], 15, INK, weight=700))
    for gx in range(grid[0], grid[1] + 1):
        for gy in range(grid[2], grid[3] + 1):
            cx, cy = v(gx, gy)
            hot = (gx, gy) in pts
            # faint nodes under the rectangles, the asked points above them
            (hot_dots if hot else out).append(
                f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{4.2 if hot else 2.4}" '
                f'fill="{ACCENT if hot else FAINT}"/>'
            )
    out += shapes + hot_dots
    label = {
        "both": "в обеих",
        "any": "хотя бы в одной",
        "one": "ровно в одной",
        "first": "в A, но не в B",
    }[mode]
    out.append(
        _text(
            W / 2,
            height - 14,
            f"{label}{' строго внутри' if strict else ', границы включены'}: {len(pts)}",
            14,
            INK,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


def tt_segment(a, b, height: int = 220) -> str:
    """A segment and the integer points lying exactly on it."""
    pts = [
        (x, y)
        for x in range(min(a[0], b[0]), max(a[0], b[0]) + 1)
        for y in range(min(a[1], b[1]), max(a[1], b[1]) + 1)
        if on_segment((x, y), a, b)
    ]
    grid = (min(a[0], b[0]) - 1, max(a[0], b[0]) + 1, min(a[1], b[1]) - 1, max(a[1], b[1]) + 1)
    v = _View(grid, 30, 14, W - 60, height - 56)
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Отрезок и целые точки">']
    for gx in range(grid[0], grid[1] + 1):
        for gy in range(grid[2], grid[3] + 1):
            cx, cy = v(gx, gy)
            out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="2.4" fill="{FAINT}"/>')
    (x1, y1), (x2, y2) = v(*a), v(*b)
    out.append(
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{INK}" stroke-width="2.2"/>'
    )
    for p in pts:
        cx, cy = v(*p)
        out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="4.6" fill="{ACCENT}"/>')
    length = math.dist(a, b)
    out.append(
        _text(
            W / 2,
            height - 12,
            f"длина {_fmt(length)}, целых точек на отрезке: {len(pts)}",
            14,
            INK,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


def tt_turn(side: float = 8, turn: float = 120, height: int = 300) -> str:
    """The turn of the turtle at a vertex and the angle of the figure there."""
    a = math.radians(90 - turn)
    b = (0.0, float(side))
    c = (b[0] + side * math.cos(a), b[1] + side * math.sin(a))
    grid = (-3, math.ceil(c[0]) + 2, -1, side + 3)
    v = _View(grid, 30, 14, W - 60, height - 28)
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Поворот и угол фигуры">']
    (ax, ay), (bx, by), (cx, cy) = v(0, 0), v(*b), v(*c)
    (ex, ey) = v(0, side + 3.2)
    out.append(
        f'<line x1="{bx:.1f}" y1="{by:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="{MUTED}" '
        f'stroke-width="1.6" stroke-dasharray="6 5"/>'
    )
    out.append(
        f'<polyline points="{ax:.1f},{ay:.1f} {bx:.1f},{by:.1f} {cx:.1f},{cy:.1f}" fill="none" '
        f'stroke="{INK}" stroke-width="2.2" stroke-linejoin="round"/>'
    )
    out.append(
        f'<line x1="{cx:.1f}" y1="{cy:.1f}" x2="{ax:.1f}" y2="{ay:.1f}" stroke="{FAINT}" stroke-width="2"/>'
    )

    def arc(r, t0, t1, sweep, color, width):
        x0, y0 = bx + r * math.cos(math.radians(t0)), by - r * math.sin(math.radians(t0))
        x1, y1 = bx + r * math.cos(math.radians(t1)), by - r * math.sin(math.radians(t1))
        return (
            f'<path d="M {x0:.1f} {y0:.1f} A {r} {r} 0 0 {sweep} {x1:.1f} {y1:.1f}" fill="none" '
            f'stroke="{color}" stroke-width="{width}" stroke-linecap="round"/>'
        )

    # the turn: from «straight on» (up) clockwise to the new direction
    out.append(arc(46, 90, 90 - turn, 1, ACCENT, 2.4))
    # the angle of the figure: between the side it came by and the next side
    out.append(arc(26, 270, 450 - turn, 0, INK, 1.6))
    mid = math.radians(90 - turn / 2)
    out.append(
        _text(
            bx + 60 * math.cos(mid),
            by - 60 * math.sin(mid) + 6,
            f"{turn:g}°",
            16,
            ACCENT,
            weight=700,
        )
    )
    inner = math.radians(270 + (180 - turn) / 2)
    out.append(
        _text(
            bx + 44 * math.cos(inner),
            by - 44 * math.sin(inner) + 6,
            f"{180 - turn:g}°",
            15,
            INK,
            "middle",
            700,
        )
    )
    out.append(_text(ex + 8, ey + 4, "прямо", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


TURTLE_FIGURES: dict = {
    "tt_draw": tt_draw,
    "tt_state": tt_state,
    "tt_rects": tt_rects,
    "tt_segment": tt_segment,
    "tt_turn": tt_turn,
}
TURTLE_STEPPERS: dict = {"tt_state": state_frames}
TURTLE_WIDGETS: dict = {}
TURTLE_SCRIPTS: dict = {}


def count(cmds: str, heading: float = 90, what: str = "in") -> int:
    """Number of integer points of a class — used by checks of the topic."""
    cls, _ = classify(cmds, heading)
    return sum(1 for c in cls.values() if c == what)
