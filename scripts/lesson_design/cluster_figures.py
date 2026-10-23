"""Figures of topic 27 «Кластеризация» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture:
coordinates, distances, sums, sizes of groups. Scatter plots read the data
files of the topic (content/lesson-files/topic-27) and split them by
the same bounds as the lessons.

``cl_plane(points, segment)`` — points on the coordinate plane; with a segment,
the right triangle of the distance formula.
``cl_scatter(file, rule, …)`` — a scatter plot of a data file: clusters by the
bounds of the lesson (marker shape per cluster), anomalies, bound lines,
centers, radius and diameters.
``cl_regions()`` — the order of checks of an ``if / elif / else`` chain.
``cl_projection(w, h, angle)`` — a rotated rectangle is wider on the axis.
``cl_sector(start, width, angles)`` — a sector around C, the angle relative to
its start, the jump over 0°.
``cl_energy(file, bounds)`` — kinetic energies of the particles on a line.
``cl_center_stepper(xs)`` — candidates of the center one by one, their sums.
``cl_eps_stepper(points, eps_list)`` — the same points at different thresholds.
``cl_split_stepper(points, eps)`` — ``split_clusters`` step by step.
``cl_parabola(xs)`` — the sum of squares as a parabola with its vertex at the mean.
``cl_pairs_grid(n)`` — pairs i < j of the paired sum.
"""

from __future__ import annotations

import math
import zlib
from math import dist
from pathlib import Path

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stepper, _text

FILES = Path(__file__).resolve().parents[2] / "content" / "lesson-files" / "topic-27"
W = 660


def ru(v: float, digits: int = 3) -> str:
    """2.5 -> «2,5», 3.0 -> «3», −1.25 -> «−1,25»."""
    s = f"{v:.{digits}f}".rstrip("0").rstrip(".")
    if s in ("-0", ""):
        s = "0"
    return s.replace(".", ",").replace("-", "−")


def _svg(h, label) -> str:
    return f'<svg viewBox="0 0 {W} {h:.0f}" role="img" aria-label="{label}">'


def _line(x1, y1, x2, y2, color=INK, width=1.25, dashed=False) -> str:
    dash = ' stroke-dasharray="5 4"' if dashed else ""
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{color}" '
        f'stroke-width="{width}"{dash}/>'
    )


def _dot(x, y, r=3.2, color=INK, fill="#fff", width=1.4) -> str:
    return (
        f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{fill}" stroke="{color}" '
        f'stroke-width="{width}"/>'
    )


def _marker(kind: int, x, y, s=3.2, color=INK) -> str:
    """Hollow markers: 0 circle, 1 square, 2 triangle, 3 diamond."""
    if kind == 0:
        return _dot(x, y, s, color)
    if kind == 1:
        return (
            f'<rect x="{x - s:.1f}" y="{y - s:.1f}" width="{2 * s:.1f}" height="{2 * s:.1f}" '
            f'fill="#fff" stroke="{color}" stroke-width="1.3"/>'
        )
    if kind == 2:
        return (
            f'<path d="M {x:.1f} {y - s * 1.2:.1f} L {x + s * 1.1:.1f} {y + s * 0.8:.1f} '
            f'L {x - s * 1.1:.1f} {y + s * 0.8:.1f} Z" fill="#fff" stroke="{color}" '
            'stroke-width="1.3"/>'
        )
    return (
        f'<path d="M {x:.1f} {y - s * 1.3:.1f} L {x + s * 1.1:.1f} {y:.1f} L {x:.1f} '
        f'{y + s * 1.3:.1f} L {x - s * 1.1:.1f} {y:.1f} Z" fill="#fff" stroke="{color}" '
        'stroke-width="1.3"/>'
    )


def _cross(x, y, s=5, color=ACCENT) -> str:
    return _line(x - s, y - s, x + s, y + s, color, 2) + _line(x - s, y + s, x + s, y - s, color, 2)


class Plane:
    """Equal-scale coordinate box: data rectangle -> pixels."""

    def __init__(self, x0, x1, y0, y1, width=560, left=60, top=20, max_h=420):
        self.x0, self.x1, self.y0, self.y1 = x0, x1, y0, y1
        k = width / (x1 - x0)
        if (y1 - y0) * k > max_h:
            k = max_h / (y1 - y0)
        self.k, self.left, self.top = k, left, top
        self.w, self.h = (x1 - x0) * k, (y1 - y0) * k

    def px(self, x):
        return self.left + (x - self.x0) * self.k

    def py(self, y):
        return self.top + (self.y1 - y) * self.k

    def frame(self, step=1.0, labels_every=None, axes=True) -> str:
        out = [
            f'<rect x="{self.left}" y="{self.top}" width="{self.w:.1f}" height="{self.h:.1f}" '
            f'fill="#fff" stroke="{FAINT}"/>'
        ]
        every = labels_every or step
        v = math.ceil(self.x0 / step) * step
        while v <= self.x1 + 1e-9:
            out.append(_line(self.px(v), self.top, self.px(v), self.top + self.h, FAINT, 0.6))
            if abs(v / every - round(v / every)) < 1e-9:
                out.append(_text(self.px(v), self.top + self.h + 16, ru(v), 11, MUTED, "middle"))
            v += step
        v = math.ceil(self.y0 / step) * step
        while v <= self.y1 + 1e-9:
            out.append(_line(self.left, self.py(v), self.left + self.w, self.py(v), FAINT, 0.6))
            if abs(v / every - round(v / every)) < 1e-9:
                out.append(_text(self.left - 6, self.py(v) + 4, ru(v), 11, MUTED, "end"))
            v += step
        if axes:
            if self.y0 <= 0 <= self.y1:
                out.append(_line(self.left, self.py(0), self.left + self.w, self.py(0), MUTED, 1))
            if self.x0 <= 0 <= self.x1:
                out.append(_line(self.px(0), self.top, self.px(0), self.top + self.h, MUTED, 1))
        return "".join(out)


# --- points and the distance formula -------------------------------------------------


def cl_plane(points=((2, 5, "A"), (-3, 4, "B")), segment=None) -> str:
    """Points with dashed projections; ``segment`` [(x1, y1), (x2, y2)] adds
    the right triangle: legs |x2 − x1|, |y2 − y1| and the hypotenuse d."""
    xs = [p[0] for p in points] + ([segment[0][0], segment[1][0]] if segment else [])
    ys = [p[1] for p in points] + ([segment[0][1], segment[1][1]] if segment else [])
    pl = Plane(min(min(xs), 0) - 1, max(max(xs), 0) + 1, min(min(ys), 0) - 1, max(ys) + 1, 330)
    out = [_svg(pl.h + 48, "Точки на координатной плоскости"), pl.frame()]
    out.append(_text(pl.left + pl.w - 4, pl.py(0) - 6, "x", 12, MUTED, "end"))
    out.append(_text(pl.px(0) + 6, pl.top + 12, "y", 12, MUTED))
    for x, y, name in points:
        out.append(_line(pl.px(x), pl.py(y), pl.px(x), pl.py(0), MUTED, 1, True))
        out.append(_line(pl.px(x), pl.py(y), pl.px(0), pl.py(y), MUTED, 1, True))
        out.append(_dot(pl.px(x), pl.py(y), 4.5, INK, INK))
        out.append(_text(pl.px(x) + 8, pl.py(y) - 8, f"{name} ({ru(x)}; {ru(y)})", 14, INK))
    tx = pl.left + pl.w + 24
    if not segment:
        out.append(_text(tx, pl.top + 26, "От начала координат:", 14, MUTED))
        for i, (x, y, name) in enumerate(points):
            hor = f"{ru(abs(x))} {'вправо' if x >= 0 else 'влево'}"
            ver = f"{ru(abs(y))} {'вверх' if y >= 0 else 'вниз'}"
            out.append(_text(tx, pl.top + 52 + 26 * i, f"{name}: {hor}, {ver}", 14))
    if segment:
        (x1, y1), (x2, y2) = segment
        a, b, c = (pl.px(x1), pl.py(y1)), (pl.px(x2), pl.py(y1)), (pl.px(x2), pl.py(y2))
        out.append(_line(*a, *b, INK, 1.5))
        out.append(_line(*b, *c, INK, 1.5))
        out.append(_line(*a, *c, ACCENT, 2.5))
        out.append(
            f'<path d="M {b[0] - 10:.1f} {b[1]:.1f} v -10 h 10" fill="none" stroke="{INK}"/>'
        )
        for p, (x, y) in ((a, (x1, y1)), (c, (x2, y2))):
            out.append(_dot(*p, 4.5, INK, INK))
            out.append(
                _text(
                    p[0] - 8, p[1] + (18 if p is a else -8), f"({ru(x)}; {ru(y)})", 13, INK, "end"
                )
            )
        dx, dy = abs(x2 - x1), abs(y2 - y1)
        out.append(_text((a[0] + b[0]) / 2, a[1] + 18, f"{ru(dx)}", 14, INK, "middle", 600))
        out.append(_text(b[0] + 8, (b[1] + c[1]) / 2 + 5, f"{ru(dy)}", 14, INK, "start", 600))
        d = math.hypot(dx, dy)
        out.append(_text(tx, pl.top + 30, "катеты — разности координат:", 14, MUTED))
        out.append(
            _text(
                tx,
                pl.top + 52,
                f"{ru(x2)} − {ru(x1)} = {ru(dx)},  {ru(y2)} − {ru(y1)} = {ru(dy)}",
                14,
            )
        )
        out.append(_text(tx, pl.top + 86, "гипотенуза — расстояние:", 14, MUTED))
        out.append(
            _text(
                tx, pl.top + 108, f"d = √({ru(dx)}² + {ru(dy)}²) = {ru(d)}", 14, ACCENT, weight=600
            )
        )
    out.append("</svg>")
    return "".join(out)


# --- scatter plots of the data files ----------------------------------------------------


def _read(name):
    pts, extra = [], []
    with open(FILES / name, encoding="utf-8") as f:
        for line in f:
            parts = line.replace(",", ".").split()
            if not parts or parts[0][0] not in "-0123456789":
                continue
            pts.append((float(parts[0]), float(parts[1])))
            extra.append(parts[2:])
    return pts, extra


def _rule(name, p):
    """Cluster number of a point by the bounds of the lessons; −1 is an anomaly."""
    x, y = p
    if name == "x5":
        return 0 if x < 5 else 1
    if name == "x6":
        return 0 if x < 6 else 1
    if name == "boxes2":
        if -8 < x < 0 and 2 < y < 10:
            return 0
        if 1 < x < 10 and 2 < y < 10:
            return 1
        if -2 < x < 5 and -7 < y < 1:
            return 2
        return -1
    if name == "stars":
        return 0 if y < 5 else (1 if x < 10 else 2)
    return 0


RULE_LINES = {
    "x5": [("v", 5, "x = 5")],
    "x6": [("v", 6, "x = 6")],
    "stars": [("h", 5, "y = 5"), ("v", 10, "x = 10")],
}
RULE_BOXES = {"boxes2": [(-8, 0, 2, 10), (1, 10, 2, 10), (-2, 5, -7, 1)]}


def _center(cluster):
    return min(cluster, key=lambda c: sum(dist(c, p) for p in cluster))


def cl_scatter(
    file="example27.txt",
    rule=None,
    lines=False,
    centers=False,
    labels=False,
    pairs=False,
    step=1.0,
    width=560,
    mark=None,
    circle=None,
    chains=None,
) -> str:
    """A scatter plot of a data file at equal scale. ``rule`` — the bounds of the
    lesson (marker shape per cluster, anomalies as accent crosses); ``lines``
    draws the bounds; ``centers`` rings the centers by the sum of distances;
    ``labels`` writes coordinates next to the points (small files);
    ``pairs`` draws radius, diameter and the intercluster diameter;
    ``mark`` [x, y, label] marks a given point; ``circle`` [x, y, r] draws the
    circle of radius r (clipped to the plot) and counts points inside, on it and
    outside."""
    pts, _ = _read(file)
    if chains is not None:
        rule = rule or "chains"  # groups of neighbours get a legend like bounds do
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    pad = step
    x0, x1 = math.floor(min(xs) / step) * step - pad, math.ceil(max(xs) / step) * step + pad
    y0, y1 = math.floor(min(ys) / step) * step - pad, math.ceil(max(ys) / step) * step + pad
    pl = Plane(x0, x1, y0, y1, width, 46, 14, 400)
    extra = 22 if (rule and not pairs) or circle is not None else 0
    # a label on every other grid line when the grid is dense
    every = 2 * step if (x1 - x0) / step > 14 else step
    out = [
        _svg(pl.h + 40 + extra, f"Точечная диаграмма файла {file}"),
        pl.frame(step, every, axes=True),
    ]
    groups: dict[int, list] = {}
    if chains is not None:
        # groups of neighbours at the threshold ``chains``, left to right
        comps = sorted(_components(pts, chains), key=lambda g: min(pts[i][0] for i in g))
        for k, g in enumerate(comps):
            groups[k] = [pts[i] for i in g]
    else:
        for p in pts:
            groups.setdefault(_rule(rule, p) if rule else 0, []).append(p)
    if rule and lines:
        for kind, v, label in RULE_LINES.get(rule, []):
            if kind == "v":
                out.append(_line(pl.px(v), pl.top, pl.px(v), pl.top + pl.h, ACCENT, 1.75, True))
                out.append(_text(pl.px(v) + 6, pl.top + 16, label, 13, ACCENT, weight=600))
            else:
                out.append(_line(pl.left, pl.py(v), pl.left + pl.w, pl.py(v), ACCENT, 1.75, True))
                out.append(_text(pl.left + 6, pl.py(v) - 6, label, 13, ACCENT, weight=600))
        for bx0, bx1, by0, by1 in RULE_BOXES.get(rule, []):
            out.append(
                f'<rect x="{pl.px(bx0):.1f}" y="{pl.py(by1):.1f}" width="{(bx1 - bx0) * pl.k:.1f}" '
                f'height="{(by1 - by0) * pl.k:.1f}" fill="none" stroke="{MUTED}" '
                'stroke-width="1.25" stroke-dasharray="5 4"/>'
            )
    small = len(pts) <= 20
    for k, group in sorted(groups.items()):
        for p in group:
            if k < 0:
                out.append(_cross(pl.px(p[0]), pl.py(p[1])))
            else:
                out.append(
                    _marker(k if rule else 0, pl.px(p[0]), pl.py(p[1]), 4.2 if small else 2.6)
                )
            if labels:
                out.append(
                    _text(pl.px(p[0]) + 7, pl.py(p[1]) - 7, f"({ru(p[0])}; {ru(p[1])})", 11, MUTED)
                )
    if mark is not None:
        mx, my, mlabel = mark
        out.append(_dot(pl.px(mx), pl.py(my), 5, ACCENT, ACCENT))
        out.append(_text(pl.px(mx) + 8, pl.py(my) + 16, mlabel, 13, ACCENT, weight=600))
    if circle is not None:
        cx, cy, r = circle
        cid = f"clc{zlib.crc32(repr((file, cx, cy, r)).encode()):08x}"
        out.append(
            f'<clipPath id="{cid}"><rect x="{pl.left}" y="{pl.top}" width="{pl.w:.1f}" '
            f'height="{pl.h:.1f}"/></clipPath>'
            f'<circle cx="{pl.px(cx):.1f}" cy="{pl.py(cy):.1f}" r="{r * pl.k:.1f}" fill="none" '
            f'stroke="{ACCENT}" stroke-width="1.75" stroke-dasharray="6 4" clip-path="url(#{cid})"/>'
        )
        out.append(_dot(pl.px(cx), pl.py(cy), 3.5, ACCENT, ACCENT))
        inside = sum(dist((cx, cy), p) < r - 1e-9 for p in pts)
        on = sum(abs(dist((cx, cy), p) - r) <= 1e-9 for p in pts)
        out.append(
            _text(
                pl.left,
                pl.top + pl.h + 34,
                f"r = {ru(r)}: внутри {inside}, на окружности {on}, снаружи {len(pts) - inside - on}",
                12,
                MUTED,
            )
        )
    cs = {k: _center(g) for k, g in groups.items() if k >= 0}
    if centers:
        for c in cs.values():
            out.append(
                f'<circle cx="{pl.px(c[0]):.1f}" cy="{pl.py(c[1]):.1f}" r="9" fill="none" '
                f'stroke="{ACCENT}" stroke-width="2"/>'
            )
    if pairs and len(cs) == 2:
        a, b = groups[0], groups[1]
        cb = cs[1]
        far = max(b, key=lambda p: dist(cb, p))
        out.append(_line(pl.px(cb[0]), pl.py(cb[1]), pl.px(far[0]), pl.py(far[1]), INK, 1.5, True))
        da = max(((p, q) for i, p in enumerate(b) for q in b[i + 1 :]), key=lambda t: dist(*t))
        out.append(
            _line(pl.px(da[0][0]), pl.py(da[0][1]), pl.px(da[1][0]), pl.py(da[1][1]), ACCENT, 2.5)
        )
        ip = max(((p, q) for p in a for q in b), key=lambda t: dist(*t))
        out.append(
            _line(pl.px(ip[0][0]), pl.py(ip[0][1]), pl.px(ip[1][0]), pl.py(ip[1][1]), MUTED, 1.25)
        )
        out.append(
            _text(
                pl.px((ip[0][0] + ip[1][0]) / 2),
                pl.py(max(ip[0][1], ip[1][1])) - 10,
                f"межкластерный диаметр {ru(dist(*ip))}",
                12,
                MUTED,
                "middle",
            )
        )
        out.append(
            _text(
                pl.px(cb[0]),
                pl.py(min(p[1] for p in b)) + 22,
                f"радиус {ru(dist(cb, far))} (пунктир), диаметр {ru(dist(*da))}",
                12,
                INK,
                "middle",
            )
        )
    if rule and not pairs:
        legend = []
        for k, g in sorted(groups.items()):
            legend.append(f"{'аномалии' if k < 0 else f'кластер {k + 1}'}: {len(g)}")
        out.append(_text(pl.left, pl.top + pl.h + 34, " · ".join(legend), 12, MUTED))
    out.append("</svg>")
    return "".join(out)


# --- the order of checks of an if / elif / else chain --------------------------------


def cl_regions(point=(2, 1)) -> str:
    """y < 3 → first; elif x < 5 → second; else → third. A point with both
    x < 5 and y < 3 goes to the first group: the first true check wins."""
    pl = Plane(0, 12, 0, 9, 360, 46, 14)
    out = [_svg(pl.h + 40, "Области цепочки if, elif, else"), pl.frame(1, 2, axes=False)]
    regions = [
        (0, 12, 0, 3, "1: y < 3", 8.5),
        (0, 5, 3, 9, "2: x < 5", "вторая — среди оставшихся"),
        (5, 12, 3, 9, "3: else", "всё остальное"),
    ]
    for i, (a, b, c, d, label, _) in enumerate(regions):
        fill = WASH if i == 0 else "#fff"
        out.append(
            f'<rect x="{pl.px(a):.1f}" y="{pl.py(d):.1f}" width="{(b - a) * pl.k:.1f}" '
            f'height="{(d - c) * pl.k:.1f}" fill="{fill}" fill-opacity="0.9" stroke="{INK}" '
            'stroke-width="1.25"/>'
        )
        lx = _ if isinstance(_, float) else (a + b) / 2
        out.append(_text(pl.px(lx), pl.py((c + d) / 2) + 5, label, 14, INK, "middle", 600))
    out.append(_line(pl.px(5), pl.py(0), pl.px(5), pl.py(3), MUTED, 1, True))
    x, y = point
    out.append(_dot(pl.px(x), pl.py(y), 5, ACCENT, ACCENT))
    out.append(_text(pl.px(x) + 8, pl.py(y) - 8, f"({ru(x)}; {ru(y)})", 12, ACCENT, weight=600))
    tx = pl.left + pl.w + 22
    out.append(_text(tx, pl.top + 24, f"Точка ({ru(x)}; {ru(y)}):", 14, INK, weight=600))
    out.append(
        _text(
            tx,
            pl.top + 48,
            f"y < 3 — {'да' if y < 3 else 'нет'}, x < 5 — {'да' if x < 5 else 'нет'}.",
            14,
        )
    )
    out.append(_text(tx, pl.top + 72, "Подходят обе проверки, но", 14))
    out.append(_text(tx, pl.top + 92, "выполняется первая истинная:", 14))
    out.append(_text(tx, pl.top + 116, "точка уходит в группу 1.", 14, ACCENT, weight=600))
    out.append(_text(tx, pl.top + 150, "Пунктир — граница x = 5,", 13, MUTED))
    out.append(_text(tx, pl.top + 170, "которую нижняя полоса", 13, MUTED))
    out.append(_text(tx, pl.top + 190, "уже не использует.", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


# --- a rotated rectangle and its projections -------------------------------------------


def cl_projection(w=4.0, h=2.0, angle=30) -> str:
    a = math.radians(angle)
    corners = [
        (u * math.cos(a) - v * math.sin(a), u * math.sin(a) + v * math.cos(a))
        for u, v in ((-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2))
    ]
    xs, ys = [c[0] for c in corners], [c[1] for c in corners]
    pl = Plane(-3.5, 3.5, -2.5, 2.5, 330, 40, 14)
    out = [_svg(pl.h + 44, "Повёрнутый прямоугольник и его проекция"), pl.frame(1, 1, axes=False)]
    out.append(
        f'<rect x="{pl.px(min(xs)):.1f}" y="{pl.py(max(ys)):.1f}" width="{(max(xs) - min(xs)) * pl.k:.1f}" '
        f'height="{(max(ys) - min(ys)) * pl.k:.1f}" fill="none" stroke="{MUTED}" stroke-dasharray="5 4"/>'
    )
    d = " ".join(
        f"{'M' if i == 0 else 'L'} {pl.px(x):.1f} {pl.py(y):.1f}"
        for i, (x, y) in enumerate(corners)
    )
    out.append(f'<path d="{d} Z" fill="{WASH}" stroke="{INK}" stroke-width="2"/>')
    out.append(
        _line(
            pl.px(corners[0][0]),
            pl.py(corners[0][1]),
            pl.px(corners[1][0]),
            pl.py(corners[1][1]),
            ACCENT,
            3,
        )
    )
    tx = pl.left + pl.w + 22
    out.append(_text(tx, pl.top + 26, f"Стороны {ru(w)} и {ru(h)}, поворот {angle}°.", 14))
    out.append(_text(tx, pl.top + 54, f"Сторона W = {ru(w)}", 14, ACCENT, weight=600))
    out.append(_text(tx, pl.top + 82, "Разброс x точек внутри:", 14))
    out.append(
        _text(
            tx,
            pl.top + 104,
            f"x max − x min = {ru(max(xs) - min(xs), 2)} > {ru(w)}",
            14,
            INK,
            weight=600,
        )
    )
    out.append(_text(tx, pl.top + 132, "Пунктир — прямоугольник", 13, MUTED))
    out.append(_text(tx, pl.top + 152, "вдоль осей вокруг тех же точек.", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


# --- sectors around a point --------------------------------------------------------------


def cl_sector(start=350, width=20, angles=(5, 355, 15)) -> str:
    """A sector [start; start + width] that may cross 0°; directions ``angles``
    with their angle relative to the start: (a − start) % 360. Angles near 0°
    are only 5° apart, so their labels stand in a column right of the circle,
    each with a short leader to its point on the circle."""
    cx, cy, r = 170, 160, 130
    out = [_svg(300, "Сектор и угол направления")]
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{FAINT}"/>')
    out.append(_line(cx - r - 10, cy, cx + r, cy, FAINT))
    out.append(_line(cx, cy - r - 10, cx, cy + r + 10, FAINT))
    for deg, label in ((90, "90°"), (180, "180°"), (270, "270°")):
        t = math.radians(deg)
        out.append(
            _text(
                cx + (r + 22) * math.cos(t),
                cy - (r + 22) * math.sin(t) + 4,
                label,
                11,
                MUTED,
                "middle",
            )
        )
    a0, a1 = math.radians(start), math.radians(start + width)
    p0 = (cx + r * math.cos(a0), cy - r * math.sin(a0))
    p1 = (cx + r * math.cos(a1), cy - r * math.sin(a1))
    out.append(
        f'<path d="M {cx} {cy} L {p0[0]:.1f} {p0[1]:.1f} A {r} {r} 0 0 0 {p1[0]:.1f} {p1[1]:.1f} Z" '
        f'fill="{WASH}" stroke="{INK}" stroke-width="1.5"/>'
    )
    out.append(_dot(cx, cy, 4, INK, INK))
    out.append(_text(cx - 8, cy + 18, "C", 13, INK, "end", 600))
    # (angle, label, colour, weight) of everything that needs a label near 0°
    labels = [
        (start, f"{start}°", INK, 600),
        ((start + width) % 360, f"{(start + width) % 360}°", INK, 600),
        (0, "0°", MUTED, 400),
    ]
    tx, ty = 370, 40
    out.append(_text(tx, ty, f"Сектор: начало {start}°, ширина {width}°.", 14, INK, weight=600))
    out.append(_text(tx, ty + 22, "Проверка: (angle − start) % 360 ≤ width", 13, MUTED))
    for i, ang in enumerate(angles):
        t = math.radians(ang)
        inside = (ang - start) % 360 <= width
        color = ACCENT if inside else MUTED
        out.append(
            _line(cx, cy, cx + r * math.cos(t), cy - r * math.sin(t), color, 1.75, not inside)
        )
        labels.append((ang, f"{ang}°", color, 600 if inside else 400))
        rel = (ang - start) % 360
        out.append(
            _text(
                tx,
                ty + 56 + 26 * i,
                f"{ang}°: ({ang} − {start}) % 360 = {rel} → {'внутри' if inside else 'снаружи'}",
                13,
                color,
                weight=600 if inside else 400,
            )
        )
    ys = []
    order = sorted(labels, key=lambda lab: -math.sin(math.radians(lab[0])))
    for ang, _, _, _ in order:
        want = cy - r * math.sin(math.radians(ang)) + 4
        ys.append(max(want, ys[-1] + 13) if ys else want)
    shift = (sum(ys) - sum(cy - r * math.sin(math.radians(a)) + 4 for a, *_ in order)) / len(ys)
    for (ang, label, color, weight), y in zip(order, ys, strict=True):
        t = math.radians(ang)
        px, py = cx + r * math.cos(t), cy - r * math.sin(t)
        out.append(_line(px, py, cx + r + 14, y - shift - 4, color, 0.75))
        out.append(_text(cx + r + 17, y - shift, label, 11, color, "start", weight))
    out.append(
        _text(tx, ty + 56 + 26 * len(angles) + 14, "Без % 360 разность для 5° была бы", 13, MUTED)
    )
    out.append(
        _text(
            tx,
            ty + 56 + 26 * len(angles) + 32,
            f"5 − {start} = {ru(5 - start)}: отрицательная.",
            13,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- energies of the particles ---------------------------------------------------------


def _energies(name):
    out = []
    with open(FILES / name, encoding="utf-8") as f:
        for line in f:
            p = [float(v) for v in line.replace(",", ".").split()[:5]]
            out.append(p[4] * (p[2] ** 2 + p[3] ** 2) / 2)
    return sorted(out)


def cl_energy(file="27-4.txt", bounds=(3.5, 7, 10.5)) -> str:
    """Kinetic energies of all particles of a file as ticks on one axis; the
    big gaps and the bounds placed in them."""
    es = _energies(file)
    lo, hi = math.floor(es[0]), math.ceil(es[-1])
    left, right, y = 40, 620, 70
    k = (right - left) / (hi - lo)
    out = [_svg(150, f"Кинетические энергии частиц файла {file}")]
    out.append(_line(left, y, right, y, MUTED))
    for v in range(lo, hi + 1):
        out.append(_line(left + (v - lo) * k, y, left + (v - lo) * k, y + 5, MUTED))
        out.append(_text(left + (v - lo) * k, y + 20, str(v), 11, MUTED, "middle"))
    for e in es:
        out.append(_line(left + (e - lo) * k, y - 22, left + (e - lo) * k, y - 4, INK, 0.7))
    gaps = sorted(zip(es, es[1:], strict=False), key=lambda t: t[1] - t[0])[-len(bounds) :]
    for a, b in sorted(gaps):
        out.append(
            _text(
                left + ((a + b) / 2 - lo) * k, y - 30, f"пусто {ru(b - a, 2)}", 11, MUTED, "middle"
            )
        )
    for b in bounds:
        out.append(
            _line(left + (b - lo) * k, y - 40, left + (b - lo) * k, y + 26, ACCENT, 1.75, True)
        )
        out.append(_text(left + (b - lo) * k, y + 40, ru(b), 12, ACCENT, "middle", 600))
    groups = [0] * (len(bounds) + 1)
    for e in es:
        groups[sum(e > b for b in bounds)] += 1
    out.append(
        _text(
            left,
            136,
            f"{len(es)} частиц; группы по энергии: " + ", ".join(map(str, groups)),
            12,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- candidates of the center on a line ---------------------------------------------------


def _line_positions(xs, left=40, right=620, gap_after=None):
    """Positions on a line; after ``gap_after`` the axis is broken so that a far
    point fits (the caption says so)."""
    if gap_after is None:
        k = (right - left) / (max(xs) - min(xs))
        return {x: left + (x - min(xs)) * k for x in xs}, None
    near = [x for x in xs if x <= gap_after]
    k = (right - left - 120) / (max(near) - min(near) or 1)
    pos = {x: left + (x - min(xs)) * k for x in near}
    for x in xs:
        if x > gap_after:
            pos[x] = right
    return pos, (pos[max(near)] + right) / 2


def _center_frame(xs, cand, best, sums, gap_after):
    pos, brk = _line_positions(xs, gap_after=gap_after)
    y = 140
    out = [_svg(230, "Кандидаты в центры на прямой")]
    out.append(_line(30, y, 630, y, MUTED))
    if brk:
        out.append(_text(brk, y + 5, "≈", 18, MUTED, "middle"))
        out.append(f'<rect x="{brk - 7:.1f}" y="{y - 4}" width="14" height="8" fill="#fff"/>')
        out.append(_text(brk, y + 6, "//", 13, MUTED, "middle"))
    if cand is not None:
        # arcs leave the candidate at different points and nest: a farther target
        # gets a taller arc that starts nearer the candidate, so no two arcs meet
        for side in (-1, 1):
            targets = sorted(
                (x for x in xs if x != cand and (pos[x] - pos[cand]) * side > 0),
                key=lambda x: abs(pos[x] - pos[cand]),
            )
            for rank, x in enumerate(targets):
                start = pos[cand] + side * (2 + 3 * (len(targets) - 1 - rank))
                a, b = sorted((start, pos[x]))
                h = 14 + 0.2 * (b - a)
                out.append(
                    f'<path d="M {a:.1f} {y - 6} C {a:.1f} {y - 6 - h} {b:.1f} {y - 6 - h} '
                    f'{b:.1f} {y - 6}" fill="none" stroke="{ACCENT}" stroke-width="1.5"/>'
                )
                out.append(
                    _text(
                        (a + b) / 2, y - 10 - 0.75 * h, ru(abs(x - cand)), 12, ACCENT, "middle", 600
                    )
                )
    for x in xs:
        hot = x == cand
        out.append(
            _dot(pos[x], y, 6 if hot else 5, ACCENT if hot else INK, ACCENT if hot else "#fff", 2)
        )
        out.append(_text(pos[x], y + 24, f"({ru(x)}; 0)", 12, INK, "middle"))
    for x in xs:
        s = sums.get(x)
        if s is not None:
            hot_sum = x == best
            color = ACCENT if hot_sum else MUTED
            out.append(
                _text(
                    pos[x], y + 44, f"сумма {ru(s)}", 12, color, "middle", 600 if hot_sum else 400
                )
            )
    if best is not None:
        out.append(
            _text(30, y + 76, f"Лучший пока: ({ru(best)}; 0), сумма {ru(sums[best])}", 13, INK)
        )
    out.append("</svg>")
    return "".join(out)


def cl_center_frames(xs=(0, 1, 2, 3, 100), gap_after=3):
    xs = list(xs)
    frames, sums = [], {}
    best: float | None = None
    frames.append(
        (
            _center_frame(xs, None, None, sums, gap_after),
            "Центр — одна из точек кластера. Проверим каждую по очереди, как кандидата.",
        )
    )
    for c in xs:
        s = sum(abs(c - x) for x in xs)
        sums[c] = s
        parts = " + ".join(ru(abs(c - x)) for x in xs if x != c)
        better = best is None or s < sums[best]
        if better:
            best = c
        frames.append(
            (
                _center_frame(xs, c, best, dict(sums), gap_after),
                f"Кандидат ({ru(c)}; 0): {parts} = {ru(s)}. "
                + (
                    "Пока это лучшая сумма."
                    if better and c == best
                    else f"Хуже, чем {ru(sums[best])}."
                ),
            ),
        )
    assert best is not None  # xs is never empty
    frames.append(
        (
            _center_frame(xs, best, best, dict(sums), gap_after),
            f"Все кандидаты проверены: центр ({ru(best)}; 0), наименьшая сумма {ru(sums[best])}.",
        )
    )
    return frames


def cl_center_stepper(xs=(0, 1, 2, 3, 100), gap_after=3) -> str:
    return _stepper(cl_center_frames(xs, gap_after))


# --- threshold of neighbours ---------------------------------------------------------------


def _components(points, eps):
    rest, groups = list(range(len(points))), []
    while rest:
        g = [rest.pop()]
        i = 0
        while i < len(g):
            keep = []
            for j in rest:
                (g if dist(points[g[i]], points[j]) <= eps else keep).append(j)
            rest = keep
            i += 1
        groups.append(sorted(g))
    return groups


def _eps_frame(points, eps, pl_args):
    x0, x1, y0, y1 = pl_args
    pl = Plane(x0, x1, y0, y1, 400, 40, 14)
    out = [_svg(pl.h + 34, f"Точки и рёбра при пороге {ru(eps)}"), pl.frame(1, 1, axes=False)]
    for i, p in enumerate(points):
        for q in points[i + 1 :]:
            if dist(p, q) <= eps:
                out.append(_line(pl.px(p[0]), pl.py(p[1]), pl.px(q[0]), pl.py(q[1]), ACCENT, 1.75))
    groups = _components(points, eps)
    order = sorted(groups, key=lambda g: min(points[i] for i in g))
    for k, g in enumerate(order):
        for i in g:
            out.append(_marker(k % 4, pl.px(points[i][0]), pl.py(points[i][1]), 4.5))
    tx = pl.left + pl.w + 20
    out.append(_text(tx, pl.top + 24, f"порог ε = {ru(eps)}", 15, ACCENT, weight=600))
    out.append(_text(tx, pl.top + 50, f"групп: {len(groups)}", 15, INK, weight=600))
    sizes = sorted((len(g) for g in groups), reverse=True)
    out.append(_text(tx, pl.top + 74, "размеры: " + ", ".join(map(str, sizes)), 13, MUTED))
    out.append("</svg>")
    return "".join(out), len(groups), sizes


def cl_eps_frames(points, eps_list):
    xs, ys = [p[0] for p in points], [p[1] for p in points]
    box = (
        math.floor(min(xs)) - 1,
        math.ceil(max(xs)) + 1,
        math.floor(min(ys)) - 1,
        math.ceil(max(ys)) + 1,
    )
    frames = []
    for eps in eps_list:
        svg, n, sizes = _eps_frame(points, eps, box)
        frames.append(
            (
                svg,
                f"Порог {ru(eps)}: соединены пары на расстоянии не больше {ru(eps)}, "
                f"групп {n} ({', '.join(map(str, sizes))}).",
            )
        )
    return frames


def cl_eps_stepper(points, eps_list) -> str:
    return _stepper(cl_eps_frames(points, eps_list))


# --- split_clusters step by step -------------------------------------------------------------


def _split_frame(points, names, remaining, clusters, cluster, pos, note_pts, eps):
    pl = Plane(-0.5, max(p[0] for p in points) + 0.8, -1, 1.6, 380, 30, 14)
    out = [_svg(pl.h + 120, "Работа split_clusters")]
    out.append(_line(pl.left, pl.py(0), pl.left + pl.w, pl.py(0), FAINT))
    done = {i for c in clusters for i in c}
    under = len(out)  # the neighbour circle goes here, under points and letters
    for i, p in enumerate(points):
        if i in (cluster or []):
            k, color = cluster.index(i), ACCENT
            fill = ACCENT if pos is not None and k < pos else "#fff"
        elif i in done:
            color, fill = INK, INK
        else:
            color, fill = MUTED, "#fff"
        out.append(_dot(pl.px(p[0]), pl.py(p[1]), 6, color, fill, 2))
        out.append(
            _text(pl.px(p[0]), pl.py(p[1]) - 12, names[i], 13, INK, "middle", 600).replace(
                "<text ", '<text stroke="#fff" stroke-width="3" paint-order="stroke" ', 1
            )
        )
    if pos is not None and cluster and pos < len(cluster):
        p = points[cluster[pos]]
        r = eps * pl.k
        out.insert(
            under,
            f'<circle cx="{pl.px(p[0]):.1f}" cy="{pl.py(p[1]):.1f}" r="{r:.1f}" fill="none" '
            f'stroke="{ACCENT}" stroke-dasharray="5 4"/>',
        )
    y = pl.top + pl.h + 22
    rows = [
        ("remaining", "[" + ", ".join(names[i] for i in remaining) + "]"),
        (
            "cluster",
            "["
            + ", ".join(names[i] for i in (cluster or []))
            + "]"
            + (f"   pos = {pos}" if pos is not None else ""),
        ),
        (
            "clusters",
            "[" + ", ".join("[" + ", ".join(names[i] for i in c) + "]" for c in clusters) + "]",
        ),
    ]
    for j, (k, v) in enumerate(rows):
        out.append(_text(pl.left, y + 22 * j, k, 13, MUTED))
        out.append(_text(pl.left + 90, y + 22 * j, v, 13, INK, weight=600))
    tx = pl.left + pl.w + 16
    out.append(_text(tx, pl.top + 20, f"ε = {ru(eps)}", 14, ACCENT, weight=600))
    out.append(_text(tx, pl.top + 44, "оранжевые — cluster,", 12, MUTED))
    out.append(_text(tx, pl.top + 62, "залитые — соседи найдены;", 12, MUTED))
    out.append(_text(tx, pl.top + 80, "чёрные — готовые группы", 12, MUTED))
    out.append("</svg>")
    return "".join(out)


def cl_split_frames(points, eps, names=None):
    names = names or [chr(65 + i) for i in range(len(points))]
    frames = []
    remaining = list(range(len(points)))
    clusters: list[list[int]] = []
    frames.append(
        (
            _split_frame(points, names, remaining, clusters, None, None, [], eps),
            "remaining — все точки, групп пока нет.",
        )
    )
    while remaining:
        cluster = [remaining.pop()]
        pos = 0
        frames.append(
            (
                _split_frame(points, names, remaining, clusters, cluster, 0, [], eps),
                f"pop() забирает последнюю точку {names[cluster[0]]}: с неё начинается новая группа.",
            )
        )
        while pos < len(cluster):
            point = points[cluster[pos]]
            found, rest = [], []
            for j in remaining:
                (found if dist(point, points[j]) <= eps else rest).append(j)
            cluster += found
            remaining = rest
            text = f"Соседи {names[cluster[pos]]} в пределах {ru(eps)}: " + (
                ", ".join(names[j] for j in found) + " — в группу." if found else "новых нет."
            )
            pos += 1
            frames.append(
                (_split_frame(points, names, remaining, clusters, cluster, pos, found, eps), text)
            )
        clusters.append(cluster)
        frames.append(
            (
                _split_frame(points, names, remaining, clusters, None, None, [], eps),
                f"pos дошёл до конца: группа [{', '.join(names[i] for i in cluster)}] готова."
                + ("" if remaining else " Нераспределённых точек нет."),
            )
        )
    return frames


def cl_split_stepper(points, eps, names=None) -> str:
    return _stepper(cl_split_frames(points, eps, names))


# --- the sum of squares is a parabola -------------------------------------------------------


def cl_parabola(xs=(0, 1, 2, 3, 100)) -> str:
    xs = list(xs)
    m = sum(xs) / len(xs)

    def t(x):
        return sum((x - v) ** 2 for v in xs)

    left, right, top, bottom = 50, 620, 20, 230
    lo, hi = min(xs) - 5, max(xs) + 5
    ymax = max(t(lo), t(hi))
    kx = (right - left) / (hi - lo)

    def px(x):
        return left + (x - lo) * kx

    def py(v):
        return bottom - (v / ymax) * (bottom - top)

    out = [_svg(310, "Сумма квадратов расстояний как парабола")]
    out.append(_line(left, bottom, right, bottom, MUTED))
    path = " ".join(
        f"{'M' if i == 0 else 'L'} {px(lo + i * (hi - lo) / 120):.1f} {py(t(lo + i * (hi - lo) / 120)):.1f}"
        for i in range(121)
    )
    out.append(f'<path d="{path}" fill="none" stroke="{INK}" stroke-width="1.5"/>')
    out.append(_line(px(m), top, px(m), bottom, ACCENT, 1.5, True))
    out.append(_text(px(m) + 6, top + 14, f"средняя точка x̄ = {ru(m)}", 13, ACCENT, weight=600))
    best = min(xs, key=t)
    for x in xs:
        out.append(
            _dot(
                px(x), py(t(x)), 5, ACCENT if x == best else INK, ACCENT if x == best else "#fff", 2
            )
        )
    out.append(_text(px(100) - 12, py(t(100)) - 10, f"T(100) = {t(100):.0f}", 12, INK, "end"))
    out.append(_text(px(0), bottom + 18, "0  1  2  3", 11, MUTED, "start"))
    out.append(_text(px(100), bottom + 18, "100", 11, MUTED, "middle"))
    rows = [f"T({ru(x)}) = {t(x):.0f}" for x in xs[:4]]
    out.append(_text(left, bottom + 44, "Кандидаты слева: " + ", ".join(rows), 13, INK))
    out.append(
        _text(
            left,
            bottom + 64,
            f"Ниже всех — ({ru(best)}; 0), ближайшая к x̄ = {ru(m)}.",
            13,
            ACCENT,
            weight=600,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- pairs i < j -----------------------------------------------------------------------------


def cl_pairs_grid(n=4) -> str:
    cell, left, top = 46, 70, 40
    out = [_svg(top + n * cell + 30, "Пары номеров i и j")]
    for i in range(n):
        out.append(_text(left - 14, top + i * cell + cell / 2 + 5, f"i = {i}", 13, MUTED, "end"))
        out.append(_text(left + i * cell + cell / 2, top - 10, f"j = {i}", 13, MUTED, "middle"))
        for j in range(n):
            x, y = left + j * cell, top + i * cell
            if j > i:
                out.append(
                    f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" fill="{WASH}" stroke="{INK}"/>'
                )
                out.append(
                    _text(x + cell / 2, y + cell / 2 + 5, f"d{i}{j}", 13, INK, "middle", 600)
                )
            else:
                out.append(
                    f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" fill="#fff" stroke="{FAINT}"/>'
                )
                out.append(
                    _text(
                        x + cell / 2,
                        y + cell / 2 + 5,
                        "0" if i == j else f"d{j}{i}",
                        12,
                        MUTED,
                        "middle",
                    )
                )
    tx = left + n * cell + 30
    pairs = n * (n - 1) // 2
    out.append(_text(tx, top + 20, f"Всего клеток {n} · {n} = {n * n}.", 14))
    out.append(
        _text(
            tx, top + 46, f"Нужны только i < j: {n} · {n - 1} / 2 = {pairs}.", 14, INK, weight=600
        )
    )
    out.append(_text(tx, top + 72, "Диагональ — расстояние до себя, 0.", 13, MUTED))
    out.append(_text(tx, top + 94, "Под диагональю — те же пары", 13, MUTED))
    out.append(_text(tx, top + 114, "в обратном порядке.", 13, MUTED))
    out.append(_text(tx, top + 146, "Каждое d прибавляется сразу", 13, INK))
    out.append(_text(tx, top + 166, "к totals[i] и totals[j].", 13, INK))
    out.append("</svg>")
    return "".join(out)


# --- reading a line: columns and the code of a star --------------------------------------


def cl_columns(
    line="-12,554\t9,248\t1,957\t1,743\t1,768\tVII", names=("x", "y", "vx", "vy", "m", "признак")
) -> str:
    """A line of the file, its parts after split() and the index of each part."""
    parts = line.replace(",", ".").split()
    out = [_svg(170, "Части строки файла и их номера")]
    shown = line.replace("\t", " ⇥ ")
    out.append(_text(20, 26, "строка файла:", 13, MUTED))
    out.append(_text(126, 26, shown, 14, INK, weight=600))
    cw, gap, x0, y0 = 92, 8, 20, 50
    for i, part in enumerate(parts):
        x = x0 + i * (cw + gap)
        num = i < 5
        out.append(
            f'<rect x="{x}" y="{y0}" width="{cw}" height="40" rx="6" fill="{WASH if num else "#fff"}" '
            f'stroke="{INK if num else ACCENT}" stroke-width="1.5"/>'
        )
        out.append(_text(x + cw / 2, y0 + 26, part, 15, INK, "middle", 600))
        out.append(_text(x + cw / 2, y0 + 62, names[i], 14, INK, "middle"))
        out.append(_text(x + cw / 2, y0 + 84, f"p[{i}]", 13, MUTED, "middle"))
    out.append(
        _text(
            20,
            162,
            f"⇥ — табуляция; split() даёт {len(parts)} частей: пять чисел (серые) и признак-строку",
            12,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


def cl_code_parts(codes=("M4III", "K3V", "VII")) -> str:
    """Characters of star codes by position: class, subclass, luminosity."""
    cell, x0, top = 34, 30, 18
    out = [_svg(top + 104 * len(codes) - 14, "Разбор кода звезды по позициям")]
    for k, code in enumerate(codes):
        y = top + k * 104
        has_class = code[0] in "OBAFGKM"
        for i, ch in enumerate(code):
            x = x0 + i * cell
            out.append(
                f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" fill="#fff" stroke="{INK}"/>'
            )
            out.append(_text(x + cell / 2, y + 23, ch, 17, INK, "middle", 600))
            out.append(_text(x + cell / 2, y - 4, str(i), 10, MUTED, "middle"))
        parts = [(0, 1, "класс"), (1, 2, "подкласс"), (2, len(code), "светимость")]
        if not has_class:
            parts = [(0, len(code), "светимость")]
        for n, (a, b, label) in enumerate(parts):
            xa, xb = x0 + a * cell + 3, x0 + b * cell - 3
            out.append(
                f'<path d="M {xa} {y + cell + 6} v 6 H {xb} v -6" fill="none" stroke="{MUTED}"/>'
            )
            out.append(
                _text((xa + xb) / 2, y + cell + 26 + 15 * (n % 2), label, 12, MUTED, "middle")
            )
        tx = x0 + 7 * cell
        if has_class:
            note = f"code[0] = '{code[0]}', code[1] = '{code[1]}', code[2:] = '{code[2:]}'"
            out.append(_text(tx, y + 15, note, 14, INK))
            out.append(_text(tx, y + 37, "первый символ — буква класса", 13, MUTED))
        else:
            out.append(
                _text(
                    tx,
                    y + 15,
                    f"'{code}': code[0] = '{code[0]}' — не буква класса",
                    14,
                    ACCENT,
                    weight=600,
                )
            )
            out.append(_text(tx, y + 37, "у белого карлика есть только светимость", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


# --- int, round and floor on the number line ------------------------------------------------


def cl_trunc_line(values=(2.9, -2.9)) -> str:
    """Where int, round and floor send a positive and a negative number."""
    lo, hi, left, right = -4, 4, 150, 630
    k = (right - left) / (hi - lo)

    def px(v):
        return left + (v - lo) * k

    out = [_svg(110 * len(values) + 20, "int, round и floor на числовой прямой")]
    for r, v in enumerate(values):
        y = 70 + r * 110
        out.append(_line(left, y, right, y, MUTED))
        for t in range(lo, hi + 1):
            out.append(_line(px(t), y - 4, px(t), y + 4, MUTED))
            out.append(_text(px(t), y + 20, ru(t), 11, MUTED, "middle"))
        out.append(_dot(px(v), y, 5, INK, INK))
        out.append(_text(px(v), y - 40, ru(v), 13, INK, "middle", 600))
        res = [("int", int(v)), ("round", round(v)), ("floor", math.floor(v))]
        for j, (name, w) in enumerate(res):
            hot = name == "int"
            color = ACCENT if hot else MUTED
            yy = y - 30 + 9 * j  # int on top, as in the labels
            out.append(_line(px(v), yy, px(w), yy, color, 1.75 if hot else 1.25))
            out.append(_dot(px(w), yy, 2.5, color, color))
            out.append(
                _text(
                    20,
                    y - 12 + 18 * (j - 1),
                    f"{name}({ru(v)}) = {ru(w)}",
                    13,
                    color,
                    weight=600 if hot else 400,
                )
            )
    out.append(
        _text(
            20,
            110 * len(values) + 4,
            "int отбрасывает дробную часть — сдвигает к нулю; floor — всегда вниз",
            12,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- polar coordinates ----------------------------------------------------------------------


def cl_polar(points=((60, 4), (210, 2))) -> str:
    """Points given by a polar angle φ (degrees) and a radius r: the ray from the
    origin, the arc of φ from the polar axis and the dashed projections
    x = r·cos φ, y = r·sin φ."""
    pl = Plane(-3, 5, -2, 5, 300, 40, 14)
    out = [_svg(pl.h + 40, "Полярные координаты точки"), pl.frame(1, 1, axes=True)]
    out.append(_text(pl.left + pl.w - 4, pl.py(0) - 6, "x", 12, MUTED, "end"))
    out.append(_text(pl.px(0) + 6, pl.top + 12, "y", 12, MUTED))
    tx, ty = pl.left + pl.w + 24, pl.top + 22
    for i, (phi, r) in enumerate(points):
        t = math.radians(phi)
        x, y = r * math.cos(t), r * math.sin(t)
        hot = i == 0
        color = ACCENT if hot else INK
        out.append(_line(pl.px(0), pl.py(0), pl.px(x), pl.py(y), color, 2 if hot else 1.5))
        out.append(_line(pl.px(x), pl.py(y), pl.px(x), pl.py(0), MUTED, 1, True))
        out.append(_line(pl.px(x), pl.py(y), pl.px(0), pl.py(y), MUTED, 1, True))
        ar = (0.9 if hot else 0.6) * pl.k
        large = 1 if phi > 180 else 0
        ex, ey = pl.px(0) + ar * math.cos(t), pl.py(0) - ar * math.sin(t)
        out.append(
            f'<path d="M {pl.px(0) + ar:.1f} {pl.py(0):.1f} A {ar:.1f} {ar:.1f} 0 {large} 0 '
            f'{ex:.1f} {ey:.1f}" fill="none" stroke="{color}" stroke-width="1.25"/>'
        )
        mid = t / 2 if phi <= 180 else math.radians(150)  # off the y axis
        out.append(
            _text(
                pl.px(0) + (ar + 12) * math.cos(mid),
                pl.py(0) - (ar + 12) * math.sin(mid) + 4,
                f"{phi}°",
                12,
                color,
                "middle",
                600 if hot else 400,
            )
        )
        out.append(_dot(pl.px(x), pl.py(y), 4.5, color, color))
        dy = -10 if y >= 0 else 20
        out.append(_text(pl.px(x) + 8, pl.py(y) + dy, f"({ru(x)}; {ru(y)})", 13, color, weight=600))
        out.append(_text(tx, ty, f"φ = {phi}°, r = {ru(r)}:", 14, color, weight=600))
        out.append(_text(tx, ty + 22, f"x = {ru(r)} · cos {phi}° = {ru(x)}", 14))
        out.append(_text(tx, ty + 44, f"y = {ru(r)} · sin {phi}° = {ru(y)}", 14))
        ty += 82
    out.append(_text(tx, ty, "Дуга — угол от оси x", 13, MUTED))
    out.append(_text(tx, ty + 18, "против часовой стрелки.", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


# --- clusters between two lines ---------------------------------------------------------------


def _between_lines(p):
    """The two triangles between y = x, y = 10 − x and the axes; −1 — outside."""
    x, y = p
    if x > 0 and y > 0 and y < 10 - x:
        return 0 if y < x else 1
    return -1


def cl_lines(file="27-8.txt") -> str:
    """A scatter plot of the points between the lines y = x, y = 10 − x and the
    axes: two triangles are the clusters, everything outside is an anomaly."""
    pts, _ = _read(file)
    pl = Plane(-2, 10, -2, 10, 400, 46, 14)
    out = [_svg(pl.h + 60, f"Точки файла {file} между прямыми"), pl.frame(1, 2, axes=True)]
    cid = f"cll{zlib.crc32(file.encode()):08x}"
    out.append(
        f'<clipPath id="{cid}"><rect x="{pl.left}" y="{pl.top}" width="{pl.w:.1f}" '
        f'height="{pl.h:.1f}"/></clipPath>'
    )
    for (xa, ya), (xb, yb), label, lx, ly in (
        ((-2, -2), (10, 10), "y = x", 7.6, 9.4),
        ((-2, 12), (10, 0), "y = 10 − x", 1.0, 9.6),
    ):
        out.append(
            f'<line x1="{pl.px(xa):.1f}" y1="{pl.py(ya):.1f}" x2="{pl.px(xb):.1f}" '
            f'y2="{pl.py(yb):.1f}" stroke="{ACCENT}" stroke-width="1.75" '
            f'stroke-dasharray="6 4" clip-path="url(#{cid})"/>'
        )
        out.append(_text(pl.px(lx), pl.py(ly), label, 13, ACCENT, weight=600))
    groups: dict[int, list] = {}
    for p in pts:
        groups.setdefault(_between_lines(p), []).append(p)
    for k, group in sorted(groups.items()):
        for p in group:
            if k < 0:
                out.append(_cross(pl.px(p[0]), pl.py(p[1])))
            else:
                out.append(_marker(k, pl.px(p[0]), pl.py(p[1]), 2.6))
    tx = pl.left + pl.w + 22
    out.append(_text(tx, pl.top + 24, "Нижний треугольник:", 14, INK, weight=600))
    out.append(_text(tx, pl.top + 46, "y > 0, y < x, y < 10 − x", 13))
    out.append(_text(tx, pl.top + 64, f"кружки, {len(groups.get(0, []))} точек", 13, MUTED))
    out.append(_text(tx, pl.top + 98, "Левый треугольник:", 14, INK, weight=600))
    out.append(_text(tx, pl.top + 120, "x > 0, y > x, y < 10 − x", 13))
    out.append(_text(tx, pl.top + 138, f"квадраты, {len(groups.get(1, []))} точек", 13, MUTED))
    out.append(_text(tx, pl.top + 172, "Вне треугольников:", 14, ACCENT, weight=600))
    out.append(
        _text(tx, pl.top + 194, f"аномалии, {len(groups.get(-1, []))} (крестики)", 13, ACCENT)
    )
    out.append("</svg>")
    return "".join(out)


# --- the aim point of a telescope ---------------------------------------------------------------


def cl_aim(points=((1, 1), (2, 1), (2, 2), (5, 4), (6.2, 4.4), (5.6, 5.6)), r=1.5) -> str:
    """For every star — how many other stars are closer than r; the most such
    neighbours wins, a tie goes to the star nearer to the origin."""
    pl = Plane(0, 7, 0, 6, 330, 40, 14)
    out = [_svg(pl.h + 40, "Точка наведения телескопа"), pl.frame(1, 1, axes=True)]
    counts = [sum(0 < dist(p, q) < r for q in points) for p in points]
    top = max(counts)
    tied = [p for p, c in zip(points, counts, strict=True) if c == top]
    aim = min(tied, key=lambda p: dist(p, (0, 0)))
    cid = f"cla{zlib.crc32(repr((points, r)).encode()):08x}"
    out.append(
        f'<clipPath id="{cid}"><rect x="{pl.left}" y="{pl.top}" width="{pl.w:.1f}" '
        f'height="{pl.h:.1f}"/></clipPath>'
    )
    for p in tied:
        hot = p == aim
        out.append(
            f'<circle clip-path="url(#{cid})" cx="{pl.px(p[0]):.1f}" cy="{pl.py(p[1]):.1f}" r="{r * pl.k:.1f}" '
            f'fill="none" stroke="{ACCENT if hot else MUTED}" stroke-width="{1.75 if hot else 1}" '
            f'stroke-dasharray="{"6 4" if hot else "3 4"}"/>'
        )
    for p, c in zip(points, counts, strict=True):
        hot = p == aim
        out.append(
            _dot(pl.px(p[0]), pl.py(p[1]), 4.5, ACCENT if hot else INK, ACCENT if hot else "#fff")
        )
        out.append(
            _text(pl.px(p[0]) + 8, pl.py(p[1]) - 7, str(c), 13, ACCENT if hot else INK, weight=600)
        )
    tx = pl.left + pl.w + 24
    out.append(_text(tx, pl.top + 24, "Число — сколько других звёзд", 14))
    out.append(_text(tx, pl.top + 44, f"ближе {ru(r)} к этой звезде.", 14))
    out.append(
        _text(tx, pl.top + 78, f"Больше всего — {top}: у {len(tied)} звёзд.", 14, INK, weight=600)
    )
    out.append(_text(tx, pl.top + 100, "Из них ближе к началу координат", 14))
    out.append(
        _text(
            tx,
            pl.top + 122,
            f"({ru(aim[0])}; {ru(aim[1])}) — точка наведения.",
            14,
            ACCENT,
            weight=600,
        )
    )
    out.append(_text(tx, pl.top + 156, "Пунктир — круг радиуса " + ru(r) + ".", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


# --- correlation of the experiments -------------------------------------------------------------


def _pearson(g):
    n = len(g)
    mx, my = sum(p[0] for p in g) / n, sum(p[1] for p in g) / n
    sxy = sum((p[0] - mx) * (p[1] - my) for p in g)
    sxx = sum((p[0] - mx) ** 2 for p in g)
    syy = sum((p[1] - my) ** 2 for p in g)
    return sxy / math.sqrt(sxx * syy)


def cl_corr(file="27-9.txt", bounds=(15, 35)) -> str:
    """Experiments split by x bounds; the Pearson coefficient r of each."""
    pts, _ = _read(file)
    ys = [p[1] for p in pts]
    pl = Plane(-2, 52, math.floor(min(ys) / 5) * 5 - 2, math.ceil(max(ys) / 5) * 5 + 2, 560, 46, 30)
    out = [_svg(pl.h + 70, f"Эксперименты файла {file} и их корреляция"), pl.frame(5, 10)]
    edges = [-math.inf, *bounds, math.inf]
    for k in range(len(edges) - 1):
        g = [p for p in pts if edges[k] <= p[0] < edges[k + 1]]
        for p in g:
            out.append(_marker(k, pl.px(p[0]), pl.py(p[1]), 2.6))
        r = _pearson(g)
        strong = abs(r) >= 0.9
        cx = sum(p[0] for p in g) / len(g)
        out.append(
            _text(
                pl.px(cx),
                pl.top - 10,
                f"r = {ru(r)}",
                14,
                ACCENT if strong else MUTED,
                "middle",
                600 if strong else 400,
            )
        )
    for b in bounds:
        out.append(_line(pl.px(b), pl.top, pl.px(b), pl.top + pl.h, MUTED, 1.25, True))
    out.append(
        _text(
            pl.left,
            pl.top + pl.h + 38,
            "|r| ≥ 0,9 — сильная связь: точки вытянуты вдоль прямой; r около 0 — облако без наклона",
            12,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- quartiles and outliers ----------------------------------------------------------------------


def _median(v):
    n = len(v)
    return v[n // 2] if n % 2 else (v[n // 2 - 1] + v[n // 2]) / 2


def cl_iqr(values=(3, 9, 10, 10, 11, 12, 12, 13, 14, 29)) -> str:
    """Quartiles by halves (the median of the lower and of the upper half), the
    box Q1–Q3, the fences Q1 − 1,5·IQR and Q3 + 1,5·IQR and the outliers."""
    v = sorted(values)
    n = len(v)
    lower, upper = v[: n // 2], v[(n + 1) // 2 :]
    q1, q3 = _median(lower), _median(upper)
    iqr = q3 - q1
    lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    a, b = min(v[0], lo) - 1, max(v[-1], hi) + 1
    left, right, y = 30, 630, 96
    k = (right - left) / (b - a)

    def px(t):
        return left + (t - a) * k

    out = [_svg(190, "Квартили и выбросы")]
    out.append(_line(left, y, right, y, MUTED))
    step = 5
    t = math.ceil(a / step) * step
    while t <= b:
        out.append(_line(px(t), y - 4, px(t), y + 4, MUTED))
        out.append(_text(px(t), y + 20, ru(t), 11, MUTED, "middle"))
        t += step
    out.append(
        f'<rect x="{px(q1):.1f}" y="{y - 46}" width="{(q3 - q1) * k:.1f}" height="22" '
        f'fill="{WASH}" stroke="{INK}" stroke-width="1.25"/>'
    )
    for val, label in ((q1, f"Q1 = {ru(q1)}"), (q3, f"Q3 = {ru(q3)}")):
        out.append(_text(px(val), y - 54, label, 12, INK, "middle", 600))
    for val, label in ((lo, ru(lo)), (hi, ru(hi))):
        out.append(_line(px(val), y - 60, px(val), y + 6, ACCENT, 1.5, True))
        out.append(_text(px(val), y + 38, label, 12, ACCENT, "middle", 600))
    seen: dict[float, int] = {}
    for val in v:
        j = seen.get(val, 0)
        seen[val] = j + 1
        yy = y - 8 - 9 * j
        if val < lo or val > hi:
            out.append(_cross(px(val), yy, 4))
        else:
            out.append(_dot(px(val), yy, 3.2, INK, INK))
    out.append(
        _text(
            left,
            168,
            f"IQR = {ru(q3)} − {ru(q1)} = {ru(iqr)}; границы {ru(q1)} − 1,5 · {ru(iqr)} = {ru(lo)} "
            f"и {ru(q3)} + 1,5 · {ru(iqr)} = {ru(hi)}; крестики — выбросы",
            12,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


CLUSTER_FIGURES: dict = {
    "cl_plane": cl_plane,
    "cl_scatter": cl_scatter,
    "cl_regions": cl_regions,
    "cl_projection": cl_projection,
    "cl_sector": cl_sector,
    "cl_energy": cl_energy,
    "cl_center_stepper": cl_center_stepper,
    "cl_eps_stepper": cl_eps_stepper,
    "cl_split_stepper": cl_split_stepper,
    "cl_parabola": cl_parabola,
    "cl_pairs_grid": cl_pairs_grid,
    "cl_columns": cl_columns,
    "cl_code_parts": cl_code_parts,
    "cl_trunc_line": cl_trunc_line,
    "cl_polar": cl_polar,
    "cl_lines": cl_lines,
    "cl_aim": cl_aim,
    "cl_corr": cl_corr,
    "cl_iqr": cl_iqr,
}
CLUSTER_STEPPERS: dict = {
    "cl_center_stepper": cl_center_frames,
    "cl_eps_stepper": cl_eps_frames,
    "cl_split_stepper": cl_split_frames,
}
CLUSTER_WIDGETS: dict = {}
CLUSTER_SCRIPTS: dict = {}
