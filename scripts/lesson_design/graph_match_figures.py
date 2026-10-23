"""Figures of topic 1 «Анализ информационных моделей» (registered in figures.FIGURES).

A road scheme is an undirected graph; the task compares it with a table of the
same roads under other names. Every number on a figure — degrees, cells of
the table, sums of lengths — is computed here from the same edge list.

Edges are written as a string ``"AB AC BC"`` (one-letter names), or as a list
of pairs ``[["1", "2"], ...]``, or of triples with a length ``[["1", "2", 7]]``.
Positions are given in any units: ``{"A": (0, 0), "B": (2, 1)}``; the figure
scales them into its panel.

``gm_graph(edges, pos, hot, dashed, lengths, degrees, under, route)`` — the
scheme: accented roads or points, a dashed road, lengths, degrees, labels
under points, a route with the sum of its lengths.
``gm_model(edges, pos, hot)`` — the same roads as a scheme and as a table: one
road and its two mirror cells in accent.
``gm_match(gedges, gpos, tedges, steps)`` — step by step: a point of the
scheme gets a number of the table; candidates and the reason under the frame.
``gm_pair(left, right, titles)`` — two schemes side by side with their degrees.
``gm_side(gedges, gpos, tedges, hot, hot_rows)`` — the scheme with the degree under
every point next to the table with the degree of every row.
``gm_swap(edges, pos, swaps)`` — names exchanged in pairs («AC BE»): every road stays a road.
``gm_profile(edges, pos, focus)`` — a point, its neighbours and their degrees.
``gm_assume(gedges, gpos, tedges, known, letter, wrong, right, via)`` — step by
step: a wrong candidate assumed, the road to a found point missing in the table.
"""

from __future__ import annotations

import math

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stepper, _text

W = 660
R = 16  # radius of a point
FOUND = "#ffeedf"  # a found point: a light tint of the accent


# --- data ----------------------------------------------------------------------------


def parse(edges) -> list[tuple[str, str, int | None]]:
    """Edges as (u, v, length or None)."""
    if isinstance(edges, str):
        return [(e[0], e[1], None) for e in edges.split()]
    out = []
    for e in edges:
        u, v = str(e[0]), str(e[1])
        out.append((u, v, int(e[2]) if len(e) > 2 else None))
    return out


def nodes_of(edges, pos=None) -> list[str]:
    names = {x for u, v, _ in parse(edges) for x in (u, v)}
    if pos:
        names |= set(pos)
    return sorted(names, key=lambda s: (len(s), s))


def adjacency(edges) -> dict[str, set[str]]:
    adj: dict[str, set[str]] = {}
    for u, v, _ in parse(edges):
        adj.setdefault(u, set()).add(v)
        adj.setdefault(v, set()).add(u)
    return adj


def lengths(edges) -> dict[frozenset, int]:
    return {frozenset((u, v)): w for u, v, w in parse(edges) if w is not None}


def key(pair: str | list | tuple) -> frozenset:
    """«BD», ["1", "6"] → frozenset({B, D})."""
    if isinstance(pair, str):
        return frozenset(pair)
    return frozenset(str(x) for x in pair)


def degree_profile(edges) -> dict[str, tuple[int, tuple[int, ...]]]:
    """Degree and sorted degrees of the neighbours of every point."""
    adj = adjacency(edges)
    return {v: (len(n), tuple(sorted(len(adj[x]) for x in n))) for v, n in adj.items()}


# --- drawing -------------------------------------------------------------------------


def _scale(pos: dict, x0: float, y0: float, w: float, h: float) -> dict[str, tuple[float, float]]:
    xs = [p[0] for p in pos.values()]
    ys = [p[1] for p in pos.values()]
    dx = (max(xs) - min(xs)) or 1
    dy = (max(ys) - min(ys)) or 1
    k = min(w / dx, h / dy)
    ox = x0 + (w - dx * k) / 2
    oy = y0 + (h - dy * k) / 2
    return {n: (ox + (p[0] - min(xs)) * k, oy + (p[1] - min(ys)) * k) for n, p in pos.items()}


def _point(x, y, name, hot=False, faint=False, found=False) -> list[str]:
    stroke = ACCENT if hot else (MUTED if faint else INK)
    return [
        f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R}" fill="{FOUND if found else "#fff"}" '
        f'stroke="{stroke}" stroke-width="{2.2 if hot else 1.5}"/>',
        _text(x, y + 5, name, 15, stroke, "middle", 600),
    ]


def _halo(x, y, s, size: float = 13, color=MUTED) -> str:
    """A label over roads: a white plate keeps it readable on a line."""
    w = len(s) * size * 0.6 + 8
    return (
        f'<rect x="{x - w / 2:.1f}" y="{y - size:.1f}" width="{w:.1f}" height="{size + 5:.1f}" '
        'rx="3" fill="#fff"/>' + _text(x, y, s, size, color, "middle")
    )


def _road(p, q, hot=False, dashed=False) -> str:
    (x1, y1), (x2, y2) = p, q
    dash = ' stroke-dasharray="6 5"' if dashed else ""
    color = ACCENT if hot else (MUTED if dashed else INK)
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
        f'stroke="{color}" stroke-width="{2.6 if hot else 1.4}"{dash}/>'
    )


def _length_label(p, q, w, hot=False) -> list[str]:
    (x1, y1), (x2, y2) = p, q
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    s = str(w)
    bw = 10 + 8.5 * len(s)
    return [
        f'<rect x="{mx - bw / 2:.1f}" y="{my - 11:.1f}" width="{bw:.1f}" height="21" rx="4" '
        f'fill="#fff" stroke="{ACCENT if hot else FAINT}" stroke-width="1"/>',
        _text(mx, my + 5, s, 13, ACCENT if hot else INK, "middle", 600),
    ]


def _scheme(
    edges, pos, box, hot=(), dashed=(), show_lengths=False, degrees=False, under=None, found=()
):
    """SVG elements of a scheme inside box = (x0, y0, w, h): the degree of a
    point is a small number beside it, as written on a draft; found points are
    shaded."""
    xy = _scale(pos, *box)
    bounds = (box[0] - 28, box[1] - 24, box[0] + box[2] + 28, box[1] + box[3] + 40)
    taken: list = []
    hot_keys = {key(h) for h in hot if len(key(h)) == 2}
    hot_nodes = {h for h in hot if isinstance(h, str) and len(h) == 1} | {
        str(h[0]) for h in hot if not isinstance(h, str) and len(h) == 1
    }
    dashed_keys = {key(d) for d in dashed}
    adj = adjacency(edges)
    out: list[str] = []
    for u, v, _w in parse(edges):
        out.append(_road(xy[u], xy[v], hot=frozenset((u, v)) in hot_keys))
    for d in dashed_keys:
        u, v = sorted(d)
        out.append(_road(xy[u], xy[v], dashed=True))
    if show_lengths:
        for u, v, w in parse(edges):
            if w is not None:
                out += _length_label(xy[u], xy[v], w, frozenset((u, v)) in hot_keys)
                # the length plate is an obstacle for the labels of points
                mx, my = (xy[u][0] + xy[v][0]) / 2, (xy[u][1] + xy[v][1]) / 2
                bw = 10 + 8.5 * len(str(w))
                taken.append((mx - bw / 2, my - 11, mx + bw / 2, my + 10))
    for n, (x, y) in xy.items():
        out += _point(x, y, n, hot=n in hot_nodes, found=n in found)
        below = []
        if degrees:
            below.append(str(len(adj.get(n, ()))))
        if under and n in under:
            below.append(str(under[n]))
        if below:
            out.append(_label(xy, edges, n, ", ".join(below), bounds, taken))
    return out


def _label(xy, edges, n, s, bounds, taken: list) -> str:
    """A label beside a point: the first place (below, above, at the sides, on
    a diagonal) where its plate crosses no road, misses other points and the
    labels already placed (``taken``) and stays inside the figure; if there is
    none, the place farthest from all of them."""
    x, y = xy[n]
    w = len(s) * 13 * 0.6 + 8
    places = [
        (0, R + 17),
        (0, -R - 8),
        (R + 6 + w / 2, 5),
        (-R - 6 - w / 2, 5),
        (R + w / 2 - 4, R + 14),
        (-R - w / 2 + 4, R + 14),
        (R + w / 2 - 4, -R - 4),
        (-R - w / 2 + 4, -R - 4),
    ]
    segs = [(xy[u], xy[v]) for u, v, _ in parse(edges)]
    bx0, by0, bx1, by1 = bounds

    def rect(dx, dy):
        cx, cy = x + dx, y + dy
        return cx - w / 2, cy - 13, cx + w / 2, cy + 5

    def clearance(dx, dy) -> float:
        x0, y0, x1, y1 = rect(dx, dy)
        best = 1e9
        for (ax, ay), (bx, by) in segs:
            for k in range(41):
                px, py = ax + (bx - ax) * k / 40, ay + (by - ay) * k / 40
                ox = max(x0 - px, 0, px - x1)
                oy = max(y0 - py, 0, py - y1)
                best = min(best, math.hypot(ox, oy))
        for m, (px, py) in xy.items():
            if m != n:
                ox = max(x0 - px, 0, px - x1)
                oy = max(y0 - py, 0, py - y1)
                best = min(best, math.hypot(ox, oy) - R)
        for t0, u0, t1, u1 in taken:
            ox = max(t0 - x1, 0, x0 - t1)
            oy = max(u0 - y1, 0, y0 - u1)
            best = min(best, math.hypot(ox, oy) - 2)
        return best

    def inside(dx, dy) -> bool:
        x0, y0, x1, y1 = rect(dx, dy)
        return x0 >= bx0 and x1 <= bx1 and y0 >= by0 and y1 <= by1

    fits = [p for p in places if inside(*p)] or places
    free = [p for p in fits if clearance(*p) >= 3]
    dx, dy = free[0] if free else max(fits, key=lambda p: clearance(*p))
    taken.append(rect(dx, dy))
    return _halo(x + dx, y + dy, s)


def gm_graph(
    edges,
    pos,
    hot=(),
    dashed=(),
    lengths_shown: bool = False,
    degrees: bool = False,
    under=None,
    route=None,
    height: int = 300,
    cross=None,
) -> str:
    """A road scheme (see the module docstring); ``cross`` — two roads whose
    lines meet with no point there: the place is ringed and marked «не пункт»."""
    hot = list(hot)
    note = ""
    if route:
        steps = list(zip(route, route[1:], strict=False))
        hot += [a + b for a, b in steps]
        lens = lengths(edges)
        parts = [lens[frozenset(s)] for s in steps]
        note = f"{' → '.join(route)}: {' + '.join(map(str, parts))} = {sum(parts)}"
    bottom = 36 if note else 0
    out = [f'<svg viewBox="0 0 {W} {height + bottom}" role="img" aria-label="Схема дорог">']
    out += _scheme(
        edges,
        pos,
        (40, 26, W - 80, height - 62 if (degrees or under) else height - 52),
        hot,
        dashed,
        lengths_shown,
        degrees,
        under,
    )
    if cross:
        box = (40, 26, W - 80, height - 62 if (degrees or under) else height - 52)
        xy = _scale(pos, *box)
        a, b = xy[cross[0][0]], xy[cross[0][1]]
        c, d = xy[cross[1][0]], xy[cross[1][1]]
        t = ((c[0] - a[0]) * (d[1] - c[1]) - (c[1] - a[1]) * (d[0] - c[0])) / (
            (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0])
        )
        x, y = a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])
        out.append(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="13" fill="none" stroke="{ACCENT}" '
            'stroke-width="1.6" stroke-dasharray="4 3"/>'
        )
        out.append(_text(x - 22, y + 5, "не пункт", 13, ACCENT, "end"))
    if note:
        out.append(_text(W / 2, height + bottom - 12, note, 15, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def _matrix(
    edges, names, x0, y0, cell, hot_cells=(), hot_rows=(), row_note=None, note_head=""
) -> list[str]:
    """The table of roads: «*» or a length in a cell, an empty cell for no road,
    as in the exam; the diagonal is grey."""
    adj = adjacency(edges)
    lens = lengths(edges)
    out = []
    if note_head:
        out.append(_text(x0 + cell * (len(names) + 1) + 10, y0 + cell * 0.65, note_head, 13, MUTED))
    for j, c in enumerate(names):
        out.append(_text(x0 + cell * (j + 1.5), y0 + cell * 0.65, c, 14, MUTED, "middle", 600))
    for i, r in enumerate(names):
        y = y0 + cell * (i + 1)
        row_hot = r in hot_rows
        if row_hot:
            out.append(
                f'<rect x="{x0:.1f}" y="{y:.1f}" width="{cell * (len(names) + 1):.1f}" '
                f'height="{cell}" fill="{WASH}"/>'
            )
        out.append(_text(x0 + cell / 2, y + cell * 0.65, r, 14, INK, "middle", 600))
        for j, c in enumerate(names):
            x = x0 + cell * (j + 1)
            hot = (r, c) in hot_cells
            fill = "#fff" if not row_hot else WASH
            if r == c:
                fill = FAINT
            out.append(
                f'<rect x="{x:.1f}" y="{y:.1f}" width="{cell}" height="{cell}" fill="{fill}" '
                f'stroke="{ACCENT if hot else FAINT}" stroke-width="{2.2 if hot else 1}"/>'
            )
            if c in adj.get(r, ()):
                w = lens.get(frozenset((r, c)))
                s = "*" if w is None else str(w)
                out.append(
                    _text(
                        x + cell / 2, y + cell * 0.66, s, 14, ACCENT if hot else INK, "middle", 600
                    )
                )
        if row_note and r in row_note:
            out.append(
                _text(x0 + cell * (len(names) + 1) + 10, y + cell * 0.65, row_note[r], 14, MUTED)
            )
    return out


def gm_model(edges, pos, hot) -> str:
    """One road on the scheme and the two mirror cells of the table: a compact
    scheme with lengths on the left, the table on the right."""
    names = nodes_of(edges, pos)
    u, v = sorted(key(hot))
    cell = 42
    tw = cell * (len(names) + 1)
    height = tw + 46
    out = [
        f'<svg viewBox="0 0 {W} {height}" role="img" '
        f'aria-label="Дорога {u}—{v} на схеме и в таблице">'
    ]
    out += _scheme(edges, pos, (60, 40, 250, height - 110), hot=[u + v], show_lengths=True)
    x0 = 400
    out += _matrix(edges, names, x0, 10, cell, hot_cells={(u, v), (v, u)})
    out.append(_text(185, height - 14, f"дорога {u}—{v}", 14, INK, "middle", 600))
    out.append(
        _text(
            x0 + tw / 2,
            height - 14,
            f"строка {u}, столбец {v} и строка {v}, столбец {u}",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


def gm_side(gedges, gpos, tedges, hot=(), hot_rows=()) -> str:
    """The scheme with «d = …» under every point and the table with the degree
    of every row: the first thing to write down in task 1."""
    tnames = nodes_of(tedges)
    ta = adjacency(tedges)
    cell = 34
    tw = cell * (len(tnames) + 1)
    height = cell * (len(tnames) + 1) + 40
    out = [
        f'<svg viewBox="0 0 {W} {height}" role="img" '
        'aria-label="Степени пунктов на схеме и в таблице">'
    ]
    out += _scheme(gedges, gpos, (30, 26, W - tw - 170, height - 76), hot=hot, degrees=True)
    x0 = W - tw - 72
    out += _matrix(
        tedges,
        tnames,
        x0,
        16,
        cell,
        hot_rows={str(r) for r in hot_rows},
        row_note={t: str(len(ta[t])) for t in tnames},
        note_head="степень",
    )
    out.append("</svg>")
    return "".join(out)


# --- step by step: from the scheme to the table ------------------------------------------


def _match_frame(gedges, gpos, tedges, done: dict, focus: str | None, note, roads=()) -> str:
    """The scheme with degrees and found numbers; the table with the degree of
    every row, and a found letter written over its column and before its row."""
    tnames = nodes_of(tedges)
    cell = 32
    tw = cell * (len(tnames) + 1)
    top = 34
    height = top + cell * (len(tnames) + 1) + 70
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-hidden="true">']
    out += _scheme(
        gedges,
        gpos,
        (30, 30, W - tw - 170, height - 120),
        hot=([focus] if focus else []) + list(roads),
        degrees=True,
        found=set(done),
    )
    out += _lettered_table(tedges, done, W - tw - 72, top, cell)
    out.append(_text(30, height - 14, note, 14, INK, weight=600))
    out.append("</svg>")
    return "".join(out)


def _lettered_table(tedges, done: dict, x0, top, cell, hot_cells=()) -> list[str]:
    """The table with the degree of every row; a found letter is written over
    the column and before the row of its number, and the row is shaded."""
    tnames = nodes_of(tedges)
    ta = adjacency(tedges)
    out = _matrix(
        tedges,
        tnames,
        x0,
        top,
        cell,
        hot_cells=hot_cells,
        hot_rows=set(done.values()),
        row_note={t: str(len(ta[t])) for t in tnames},
        note_head="степень",
    )
    for g, t in done.items():
        i = tnames.index(t)
        y = top + cell * (i + 1) + cell * 0.65
        out.append(_text(x0 - 8, y, g, 15, ACCENT, "end", 700))
        out.append(_text(x0 + cell * (i + 1.5), top - 8, g, 15, ACCENT, "middle", 700))
    return out


def match_frames(gedges, gpos, tedges, steps, intro=None) -> list[tuple[str, str]]:
    """steps: [letter, number, caption] or [letter, number, caption, roads] —
    «BC EC», the roads the caption speaks of, in accent. Each pair is checked:
    equal degrees, and every pair found so far keeps roads and absences of
    roads. ``intro`` — the caption of the first frame, the degrees written."""
    ga, ta = adjacency(gedges), adjacency(tedges)
    done: dict[str, str] = {}
    frames = []
    first = intro or "Подпишем степени у точек схемы и у строк таблицы."
    frames.append((_match_frame(gedges, gpos, tedges, {}, None, "подписаны степени"), first))
    for g, t, caption, *rest in steps:
        t = str(t)
        roads = rest[0].split() if rest else []
        if len(ga[g]) != len(ta[t]):
            raise ValueError(f"degrees differ: {g} {len(ga[g])}, {t} {len(ta[t])}")
        done[g] = t
        for a, b in done.items():
            for c, d in done.items():
                if a < c and (c in ga[a]) != (d in ta[b]):
                    raise ValueError(f"{a}↔{b}, {c}↔{d} break the roads")
        frames.append(
            (
                _match_frame(gedges, gpos, tedges, dict(done), g, f"{g} ↔ {t}", roads),
                caption,
            )
        )
    return frames


def gm_match(gedges, gpos, tedges, steps, intro=None) -> str:
    """From the scheme to the table, one point at a time."""
    return _stepper(match_frames(gedges, gpos, tedges, steps, intro))


# --- two schemes ---------------------------------------------------------------------------


def gm_pair(left, right, titles) -> str:
    """Two schemes side by side; under each — the degrees of its points."""
    height = 270
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="{" и ".join(titles)}">']
    for i, (edges, pos) in enumerate((left, right)):
        x0 = 20 + i * W / 2
        out += _scheme(edges, pos, (x0 + 20, 40, W / 2 - 80, height - 130))
        out.append(_text(x0 + W / 4 - 20, 22, titles[i], 14, INK, "middle", 600))
        adj = adjacency(edges)
        degs = sorted(len(adj[n]) for n in adj)
        n_edges = len(parse(edges))
        out.append(
            _text(
                x0 + W / 4 - 20,
                height - 40,
                f"пунктов {len(adj)}, дорог {n_edges}",
                13,
                MUTED,
                "middle",
            )
        )
        out.append(
            _text(
                x0 + W / 4 - 20,
                height - 18,
                "степени " + ", ".join(map(str, degs)),
                13,
                MUTED,
                "middle",
            )
        )
        if i:
            out.append(
                f'<line x1="{W / 2:.1f}" y1="10" x2="{W / 2:.1f}" y2="{height - 10}" '
                f'stroke="{FAINT}" stroke-width="1"/>'
            )
    out.append("</svg>")
    return "".join(out)


def gm_swap(edges, pos, swaps: str) -> str:
    """Names exchanged in pairs («AC BE»): the set of roads does not change."""
    pairs = [(p[0], p[1]) for p in swaps.split()]
    swap = {a: b for a, b in pairs} | {b: a for a, b in pairs}
    roads = {key(u + v) for u, v, _ in parse(edges)}
    renamed = {frozenset(swap.get(x, x) for x in r) for r in roads}
    if renamed != roads:
        raise ValueError(f"{swaps} is not a symmetry")
    pos2 = {swap.get(n, n): p for n, p in pos.items()}
    height = 280
    names = " и ".join(f"{a} и {b}" for a, b in pairs)
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Перестановка {names}">']
    for i, p in enumerate((pos, pos2)):
        x0 = i * W / 2
        out += _scheme(edges, p, (x0 + 40, 44, W / 2 - 80, height - 120), hot=list(swap))
        title = "исходные имена" if i == 0 else ", ".join(f"{a} ↔ {b}" for a, b in pairs)
        out.append(_text(x0 + W / 4, 22, title, 14, INK, "middle", 600))
    pairs_of_roads, still = [], []
    seen = set()
    for r in sorted(roads, key=lambda r: "".join(sorted(r))):
        image = frozenset(swap[x] if x in swap else x for x in r)
        if image == r:
            still.append("—".join(sorted(r)))
        elif r not in seen:
            seen |= {r, image}
            pairs_of_roads.append(f"{'—'.join(sorted(r))} ↔ {'—'.join(sorted(image))}")
    out.append(
        f'<line x1="{W / 2:.1f}" y1="10" x2="{W / 2:.1f}" y2="{height - 50}" '
        f'stroke="{FAINT}" stroke-width="1"/>'
    )
    out.append(
        _text(
            W / 2,
            height - 18,
            f"{', '.join(pairs_of_roads)}; {' и '.join(still)} — на месте",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- the profile of neighbours and a checked assumption (Change 197) -------------------------


def gm_profile(edges, pos, focus: str) -> str:
    """One point and its neighbours: degrees under every point, the point's
    roads in accent, and under the scheme its neighbours and their degrees."""
    adj = adjacency(edges)
    nbrs = sorted(adj[focus])
    degs = [len(adj[n]) for n in nbrs]
    height = 300
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Соседи пункта {focus}">']
    out += _scheme(
        edges,
        pos,
        (40, 26, W - 80, height - 120),
        hot=[focus] + [focus + n for n in nbrs],
        degrees=True,
    )
    line = f"соседи {focus}: {', '.join(nbrs)}   →   их степени {', '.join(map(str, degs))}"
    out.append(_text(W / 2, height - 18, line, 14, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def assume_frames(gedges, gpos, tedges, known, letter: str, wrong: str, right: str, via: str):
    """Two candidates for a point: the wrong one is assumed, the road to an
    already found point is looked up in the table, it is missing — so the
    other candidate stays, and its road is there."""
    ga, ta = adjacency(gedges), adjacency(tedges)
    known = {g: str(t) for g, t in known.items()}
    if via not in ga[letter] or known[via] in ta[wrong] or known[via] not in ta[right]:
        raise ValueError("the assumption must fail on the road to the found point")
    tnames = nodes_of(tedges)
    cell = 32
    tw = cell * (len(tnames) + 1)
    top = 34
    height = top + cell * (len(tnames) + 1) + 70
    t_via = known[via]

    def frame(label, mark, hot_cells, note, hot_road):
        out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-hidden="true">']
        out += _scheme(
            gedges,
            gpos,
            (30, 30, W - tw - 170, height - 120),
            hot=[letter] + ([letter + via] if hot_road else []),
            under={letter: mark},
            found=set(known),
        )
        out += _lettered_table(tedges, known, W - tw - 72, top, cell, hot_cells)
        out.append(_text(30, height - 14, note, 14, INK, weight=600))
        out.append("</svg>")
        return "".join(out), label

    return [
        frame(
            f"Найдены {', '.join(f'{g} ↔ {t}' for g, t in known.items())}. Для {letter} остались номера {wrong} и {right}.",
            f"{wrong} или {right}?",
            set(),
            f"кандидаты для {letter}: {wrong}, {right}",
            False,
        ),
        frame(
            f"Пусть {letter} ↔ {wrong}. На схеме есть дорога {letter}—{via}, а {via} ↔ {t_via}: в таблице должна быть дорога {wrong}—{t_via}.",
            f"↔ {wrong}?",
            {(wrong, t_via), (t_via, wrong)},
            f"пусть {letter} ↔ {wrong}: нужна дорога {wrong}—{t_via}",
            True,
        ),
        frame(
            f"Клетка строки {wrong}, столбца {t_via} пустая: дороги нет. Предположение дало противоречие, {letter} ↔ {wrong} невозможно.",
            f"не {wrong}",
            {(wrong, t_via), (t_via, wrong)},
            f"дороги {wrong}—{t_via} нет — противоречие",
            True,
        ),
        frame(
            f"Остаётся {letter} ↔ {right}, и дорога {right}—{t_via} в таблице есть. Это не выбор «наугад», а единственный вариант, который не противоречит дорогам.",
            f"↔ {right}",
            {(right, t_via), (t_via, right)},
            f"{letter} ↔ {right}: дорога {right}—{t_via} есть",
            True,
        ),
    ]


def gm_assume(gedges, gpos, tedges, known, letter, wrong, right, via) -> str:
    """An assumption checked until a contradiction (see assume_frames)."""
    return _stepper(assume_frames(gedges, gpos, tedges, known, letter, wrong, right, via))


GRAPH_MATCH_FIGURES: dict = {
    "gm_graph": gm_graph,
    "gm_model": gm_model,
    "gm_side": gm_side,
    "gm_match": gm_match,
    "gm_pair": gm_pair,
    "gm_swap": gm_swap,
    "gm_profile": gm_profile,
    "gm_assume": gm_assume,
}
GRAPH_MATCH_STEPPERS: dict = {"gm_match": match_frames, "gm_assume": assume_frames}
GRAPH_MATCH_WIDGETS: dict = {}
GRAPH_MATCH_SCRIPTS: dict = {}
