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
``gm_swap(edges, pos, a, b)`` — two names exchanged: every road stays a road.
``gm_profile(edges, pos, focus)`` — a point, its neighbours' degrees and the profile.
``gm_assume(gedges, gpos, tedges, known, letter, wrong, right, via)`` — step by
step: a wrong candidate assumed, the road to a found point missing in the table.
"""

from __future__ import annotations

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stepper, _text

W = 660
R = 16  # radius of a point


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


def _point(x, y, name, hot=False, faint=False) -> list[str]:
    stroke = ACCENT if hot else (MUTED if faint else INK)
    return [
        f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R}" fill="#fff" stroke="{stroke}" '
        f'stroke-width="{2.2 if hot else 1.5}"/>',
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


def _scheme(edges, pos, box, hot=(), dashed=(), show_lengths=False, degrees=False, under=None):
    """SVG elements of a scheme inside box = (x0, y0, w, h)."""
    xy = _scale(pos, *box)
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
    for n, (x, y) in xy.items():
        out += _point(x, y, n, hot=n in hot_nodes)
        below = []
        if degrees:
            below.append(f"d = {len(adj.get(n, ()))}")
        if under and n in under:
            below.append(str(under[n]))
        if below:
            out.append(_halo(x, y + R + 17, ", ".join(below)))
    return out


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
) -> str:
    """A road scheme (see the module docstring)."""
    hot = list(hot)
    note = ""
    if route:
        steps = list(zip(route, route[1:], strict=False))
        hot += [a + b for a, b in steps]
        lens = lengths(edges)
        parts = [lens[frozenset(s)] for s in steps]
        note = f"{'–'.join(route)}: {' + '.join(map(str, parts))} = {sum(parts)}"
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
    if note:
        out.append(_text(W / 2, height + bottom - 12, note, 15, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def _matrix(edges, names, x0, y0, cell, hot_cells=(), hot_rows=(), row_note=None) -> list[str]:
    """The table of roads: «*» or a length in a cell, «—» for no road."""
    adj = adjacency(edges)
    lens = lengths(edges)
    out = []
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
            elif r != c:
                out.append(_text(x + cell / 2, y + cell * 0.62, "—", 12, MUTED, "middle"))
        if row_note and r in row_note:
            out.append(
                _text(x0 + cell * (len(names) + 1) + 10, y + cell * 0.65, row_note[r], 13, MUTED)
            )
    return out


def gm_model(edges, pos, hot) -> str:
    """One road on the scheme and the two mirror cells of the table."""
    names = nodes_of(edges, pos)
    u, v = sorted(key(hot))
    cell = 34
    tw = cell * (len(names) + 1)
    th = cell * (len(names) + 1)
    height = max(220, th + 50)
    out = [
        f'<svg viewBox="0 0 {W} {height}" role="img" '
        f'aria-label="Дорога {u}—{v} на схеме и в таблице">'
    ]
    out += _scheme(edges, pos, (36, 30, W - tw - 150, height - 80), hot=[u + v])
    x0 = W - tw - 30
    out += _matrix(edges, names, x0, 20, cell, hot_cells={(u, v), (v, u)})
    out.append(_text(36, height - 14, f"дорога {u}—{v}: строка {u}, столбец {v}", 13, MUTED))
    out.append(_text(W - 30, height - 14, f"и строка {v}, столбец {u}", 13, MUTED, "end"))
    out.append("</svg>")
    return "".join(out)


# --- step by step: from the scheme to the table ------------------------------------------


def _match_frame(gedges, gpos, tedges, done: dict, focus: str | None, cand, note) -> str:
    tnames = nodes_of(tedges)
    cell = 32
    tw = cell * (len(tnames) + 1)
    height = cell * (len(tnames) + 1) + 70
    under = {g: f"↔ {t}" for g, t in done.items()}
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-hidden="true">']
    out += _scheme(
        gedges,
        gpos,
        (30, 26, W - tw - 120, height - 110),
        hot=[focus] if focus else [],
        under=under,
    )
    x0 = W - tw - 16
    rows = set(done.values())
    marks = {t: f"= {g}" for g, t in done.items()}
    hot_rows = rows
    out += _matrix(tedges, tnames, x0, 16, cell, hot_rows=hot_rows, row_note=None)
    for t, s in marks.items():
        i = tnames.index(t)
        out.append(_text(x0 - 8, 16 + cell * (i + 1) + cell * 0.65, s, 13, ACCENT, "end", 600))
    if cand:
        out.append(_text(30, height - 38, f"кандидаты для {focus}: {cand}", 13, MUTED))
    out.append(_text(30, height - 14, note, 14, INK, weight=600))
    out.append("</svg>")
    return "".join(out)


def match_frames(gedges, gpos, tedges, steps) -> list[tuple[str, str]]:
    """steps: [letter, number, caption]. Each pair is checked: equal degrees,
    and every pair found so far keeps roads and absences of roads."""
    ga, ta = adjacency(gedges), adjacency(tedges)
    done: dict[str, str] = {}
    frames = []
    first = (
        "Степени: на схеме "
        + ", ".join(f"{g} {len(ga[g])}" for g in nodes_of(gedges))
        + "; в таблице "
        + ", ".join(f"{t} {len(ta[t])}" for t in nodes_of(tedges))
        + "."
    )
    frames.append((_match_frame(gedges, gpos, tedges, {}, None, "", "начало"), first))
    for g, t, caption in steps:
        t = str(t)
        if len(ga[g]) != len(ta[t]):
            raise ValueError(f"degrees differ: {g} {len(ga[g])}, {t} {len(ta[t])}")
        free = [
            x
            for x in nodes_of(tedges)
            if len(ta[x]) == len(ga[g])
            and x not in done.values()
            and all((y in ga[g]) == (done[y] in ta[x]) for y in done)
        ]
        done[g] = t
        for a, b in done.items():
            for c, d in done.items():
                if a < c and (c in ga[a]) != (d in ta[b]):
                    raise ValueError(f"{a}↔{b}, {c}↔{d} break the roads")
        frames.append(
            (
                _match_frame(gedges, gpos, tedges, dict(done), g, ", ".join(free), f"{g} ↔ {t}"),
                caption,
            )
        )
    return frames


def gm_match(gedges, gpos, tedges, steps) -> str:
    """From the scheme to the table, one point at a time."""
    return _stepper(match_frames(gedges, gpos, tedges, steps))


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


def gm_swap(edges, pos, a: str, b: str) -> str:
    """The names a and b exchanged: the set of roads does not change."""
    swap = {a: b, b: a}
    roads = {key(u + v) for u, v, _ in parse(edges)}
    renamed = {frozenset(swap.get(x, x) for x in r) for r in roads}
    if renamed != roads:
        raise ValueError(f"{a} and {b} are not symmetric")
    pos2 = dict(pos)
    pos2[a], pos2[b] = pos[b], pos[a]
    height = 280
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Перестановка {a} и {b}">']
    for i, p in enumerate((pos, pos2)):
        x0 = i * W / 2
        out += _scheme(edges, p, (x0 + 40, 44, W / 2 - 80, height - 120), hot=[a, b])
        title = "исходные имена" if i == 0 else f"{a} и {b} поменяли местами"
        out.append(_text(x0 + W / 4, 22, title, 14, INK, "middle", 600))
    moved = sorted(
        "—".join(sorted(r)) for r in roads if (a in r or b in r) and not (a in r and b in r)
    )
    out.append(
        f'<line x1="{W / 2:.1f}" y1="10" x2="{W / 2:.1f}" y2="{height - 50}" '
        f'stroke="{FAINT}" stroke-width="1"/>'
    )
    out.append(
        _text(
            W / 2,
            height - 18,
            f"дороги {', '.join(moved)} переходят друг в друга — набор дорог тот же",
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
    roads in accent, and under the scheme its neighbours → their degrees →
    the profile sorted."""
    adj = adjacency(edges)
    nbrs = sorted(adj[focus])
    degs = [len(adj[n]) for n in nbrs]
    height = 300
    out = [
        f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Профиль соседей пункта {focus}">'
    ]
    out += _scheme(
        edges,
        pos,
        (40, 26, W - 80, height - 120),
        hot=[focus] + [focus + n for n in nbrs],
        degrees=True,
    )
    line = (
        f"соседи {focus}: {', '.join(nbrs)}   →   степени {', '.join(map(str, degs))}"
        f"   →   профиль ({', '.join(map(str, sorted(degs)))})"
    )
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
    height = cell * (len(tnames) + 1) + 70
    t_via = known[via]

    def frame(label, mark, hot_cells, note, hot_road):
        under = {g: f"↔ {t}" for g, t in known.items()}
        under[letter] = mark
        out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-hidden="true">']
        out += _scheme(
            gedges,
            gpos,
            (30, 26, W - tw - 120, height - 110),
            hot=[letter] + ([letter + via] if hot_road else []),
            under=under,
        )
        x0 = W - tw - 16
        out += _matrix(
            tedges, tnames, x0, 16, cell, hot_cells=hot_cells, hot_rows=set(known.values())
        )
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
            f"В строке {wrong}, столбце {t_via} прочерк: дороги нет. Предположение дало противоречие, {letter} ↔ {wrong} невозможно.",
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
    "gm_match": gm_match,
    "gm_pair": gm_pair,
    "gm_swap": gm_swap,
    "gm_profile": gm_profile,
    "gm_assume": gm_assume,
}
GRAPH_MATCH_STEPPERS: dict = {"gm_match": match_frames, "gm_assume": assume_frames}
GRAPH_MATCH_WIDGETS: dict = {}
GRAPH_MATCH_SCRIPTS: dict = {}
