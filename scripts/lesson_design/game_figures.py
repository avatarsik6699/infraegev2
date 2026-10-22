"""Figures of topic 19–21 «Выигрышная стратегия» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture:
the rules of a game are given once (``ops``, ``end``, ``limit``) and the
positions, their kinds and the strategies come from a small solver. The groups
В1, П1, В2, П2 are those of the lesson's label function. All keys start with
``game_``.

``game_tree(start, depth, winner, …)`` — a game tree of one pile: every
move (``winner=""``) or the strategy of the winner — his chosen move and
every reply of the opponent. ``path`` marks one party.
``game_line_stepper(lo, hi, …)`` — positions on a number line filled from
the end of the game: В1, then П1, В2 and П2, with the moves that decide.
``game_line(lo, hi, …)`` — the final frame of the same line, with gaps.
``game_grid(first, rows, cols, limit, …)`` — two piles: every position (a, b)
with its kind, the row of the start (first, S) and marked positions.
``game_kinds(examples)`` — four cards, one position of each group and its moves.
``game_label_stepper(start)`` — the calls of the lesson's g(s) in the order the
program finishes them, each with the group it returns.
"""

from __future__ import annotations

import html
from functools import cache, lru_cache

from figures import ACCENT, FAINT, INK, MUTED, WASH, _arrow, _stepper, _text

W = 660
KINDS = ("В1", "П1", "В2", "П2")

# --- one-pile games ----------------------------------------------------------


def _apply(s: int, op: str) -> int:
    """«+1», «−1», «×2», «//2» applied to s."""
    for sym in ("//", "+", "−", "×"):
        if op.startswith(sym):
            k = int(op[len(sym) :])
            return {"+": s + k, "−": s - k, "×": s * k, "//": s // k}[sym]
    raise ValueError(op)


class Pile:
    """One pile: moves ``ops`` like ("+1", "×2"), the game ends when s ≥ limit
    (``end="≥"``) or s ≤ limit (``end="≤"``); the player who ends it wins."""

    def __init__(self, ops=("+1", "×2"), end="≥", limit=21):
        self.ops, self.end, self.limit = tuple(ops), end, limit
        self.f = lru_cache(maxsize=None)(self._f)

    def over(self, s: int) -> bool:
        return s >= self.limit if self.end == "≥" else s <= self.limit

    def moves(self, s: int) -> list[tuple[str, int]]:
        return [(op, _apply(s, op)) for op in self.ops]

    def _f(self, s: int, m: int) -> bool:
        if self.over(s):
            return m % 2 == 0
        if m == 0:
            return False
        results = [self.f(q, m - 1) for _, q in self.moves(s)]
        return any(results) if m % 2 else all(results)

    def kind(self, s: int) -> str | None:
        if self.over(s):
            return None
        for m, name in enumerate(KINDS, 1):
            if self.f(s, m):
                return name
        return None

    def rules(self) -> str:
        return f"ходы {', '.join(self.ops)}, победа при s {self.end} {self.limit}"


# --- game tree -----------------------------------------------------------------


def _tree(game: Pile, s: int, depth: int, winner_turn: int | None, turn: int = 0):
    """(s, op, kids). ``winner_turn`` — 0 or 1: on that player's turn only the
    first move that keeps his win within ``depth`` moves is kept."""
    if game.over(s) or depth == 0:
        return (s, [])
    kids = []
    for op, q in game.moves(s):
        if winner_turn is not None and turn == winner_turn:
            # the winner checks his win within the remaining moves
            if not _wins(game, q, depth - 1):
                continue
            kids.append((op, _tree(game, q, depth - 1, winner_turn, 1 - turn)))
            break
        kids.append((op, _tree(game, q, depth - 1, winner_turn, 1 - turn)))
    return (s, kids)


def _wins(game: Pile, q: int, left: int) -> bool:
    """After a move to q, does the player who made it win within ``left`` more
    moves (the opponent moves first)? Only his own moves can end it: the last
    useful one is the last even move."""
    if game.over(q):
        return True
    even = left - left % 2
    return even > 0 and game.f(q, even)


def _edge_label(x1: float, y1: float, x2: float, y2: float, label: str) -> str:
    """The move name beside the middle of an edge, on its outer side."""
    dx, dy = x2 - x1, y2 - y1
    length = (dx * dx + dy * dy) ** 0.5 or 1
    nx, ny = ((-dy, dx) if dx < 0 else (dy, -dx)) if dx else (1, 0)
    nx, ny = (nx / length, ny / length) if dx else (1, 0)
    mx, my = (x1 + x2) / 2 + nx * 14, (y1 + y2) / 2 + ny * 14 + 4
    return _text(mx, my, label, 13, MUTED, "middle")


def game_tree(
    start: int = 5,
    depth: int = 3,
    winner: str = "Петя",
    ops=("+1", "×2"),
    end: str = "≥",
    limit: int = 21,
    path=(),
) -> str:
    """A tree of one pile from ``start``: full (``winner=""``) or the strategy
    of ``winner`` («Петя» moves first). ``path`` — positions of one party."""
    game = Pile(ops, end, limit)
    names = ("Петя", "Ваня")
    wt = names.index(winner) if winner else None
    tree = _tree(game, start, depth, wt)
    pos: dict[tuple, tuple] = {}
    leaves = 0

    def place(node, d, ident, op):
        nonlocal leaves
        s, kids = node
        ids = [place(k, d + 1, ident + (j,), kop) for j, (kop, k) in enumerate(kids)]
        if ids:
            x = sum(pos[i][0] for i in ids) / len(ids)
        else:
            x = leaves
            leaves += 1
        pos[ident] = (x, d, s, op, ids)
        return ident

    place(tree, 0, (), "")
    deepest = max(p[1] for p in pos.values())
    left, right = 170, W - 60
    step = (right - left) / max(leaves - 1, 1)

    def px(x):
        return left + x * step if leaves > 1 else (left + right) / 2

    def py(d):
        return 34 + d * 74

    out = []
    for d in range(deepest + 1):
        alive = [p for p in pos.values() if p[1] == d and not game.over(p[2])]
        if alive:
            out.append(_text(16, py(d) + 5, f"ходит {names[d % 2]}", 13, MUTED))
    on_path = set()
    if path:
        node = ()
        on_path.add(node)
        for s in path[1:]:
            node = next(i for i in pos[node][4] if pos[i][2] == s)
            on_path.add(node)
    for ident, (x, d, _s, _op, ids) in pos.items():
        for i in ids:
            cx, cd, _cs, cop, _ = pos[i]
            hot = ident in on_path and i in on_path
            out.append(
                _arrow(px(x), py(d) + 15, px(cx), py(cd) - 16, ACCENT if hot else INK, width=1.25)
            )
            out.append(_edge_label(px(x), py(d), px(cx), py(cd), cop))
    for ident, (x, d, s, _op, _ids) in pos.items():
        over = game.over(s)
        w = 46
        stroke = ACCENT if ident in on_path else INK
        out.append(
            f'<rect x="{px(x) - w / 2:.1f}" y="{py(d) - 15}" width="{w}" height="30" rx="7" '
            f'fill="{WASH if over else "#fff"}" stroke="{stroke}" stroke-width="1.25"/>'
        )
        out.append(_text(px(x), py(d) + 5, str(s), 14, INK, "middle", 600 if over else 400))
        if over:
            who = names[(d - 1) % 2]
            out.append(_text(px(x), py(d) + 33, f"{who} выиграл", 13, MUTED, "middle"))
    height = py(deepest) + 44
    kind = f"стратегия: {winner}" if winner else "все ходы"
    return (
        f'<svg viewBox="0 0 {W} {height}" role="img" '
        f'aria-label="Дерево игры из {start} камней, {kind}">' + "".join(out) + "</svg>"
    )


# --- positions on a number line ------------------------------------------------


def _segments(lo: int, hi: int, show: str) -> list[int | None]:
    """Cells to draw: all of lo…hi, or the ranges of ``show`` («11-24,43-47»)
    with None for a gap."""
    if not show:
        return list(range(lo, hi + 1))
    cells: list[int | None] = []
    for part in show.split(","):
        a, b = (int(v) for v in part.split("-"))
        if cells:
            cells.append(None)
        cells += range(a, b + 1)
    return cells


def _label(x: float, y: float, s: str, color: str) -> str:
    """A move name on a white halo, so a line under it does not cut it."""
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="inherit" font-size="13" '
        f'fill="{color}" text-anchor="middle" stroke="#fff" stroke-width="4" '
        f'paint-order="stroke" style="font-variant-numeric:tabular-nums">'
        f"{html.escape(s)}</text>"
    )


def _arches(xs: dict, top: float, cw: float, arrows) -> list[str]:
    """Moves on a number line as nested arches over the cells.

    Every arch leaves its cell straight up and comes down straight into the
    target, so the head points along the line. Arches into (and out of) one
    cell get their own points on its top edge: the farther the other end, the
    closer to the middle, and the higher the arch — farther arches enclose
    nearer ones and never cross them. Each arch carries its own move name."""
    near = 2.5 * cw

    def ends(key: int, other: list[tuple[int, int]]) -> dict:
        """Offsets of the ends at cell ``key`` for arches to the cells ``other``:
        the nearest other end gets the point on its own side, the farther ones
        follow inwards. Arches from one side share the whole edge, from both
        sides — a half each."""
        offsets = {}
        sides = [
            (
                side,
                sorted(
                    (o for o in other if (xs[o[0]] - xs[key]) * side > 0),
                    key=lambda o: abs(xs[o[0]] - xs[key]),
                ),
            )
            for side in (-1, 1)
        ]
        both = all(group for _, group in sides)
        for side, group in sides:
            n = len(group)
            for i, o in enumerate(group):
                if both:
                    offsets[o] = side * (0.38 - 0.3 * i / max(n - 1, 1)) * cw
                else:
                    offsets[o] = side * ((n - 1) / 2 - i) * min(0.3, 0.8 / max(n - 1, 1)) * cw
        return offsets

    into: dict[int, list] = {}
    out_of: dict[int, list] = {}
    for n, (a, b, _op, _hot) in enumerate(arrows):
        into.setdefault(b, []).append((a, n))
        out_of.setdefault(a, []).append((b, n))
    land = {b: ends(b, v) for b, v in into.items()}
    leave = {a: ends(a, v) for a, v in out_of.items()}
    out = []
    labels = []
    for n, (a, b, op, hot) in enumerate(arrows):
        x1 = xs[a] + leave[a][(b, n)]
        x2 = xs[b] + land[b][(a, n)]
        if abs(xs[b] - xs[a]) < near:
            h = 20.0
        else:
            # long arches into one cell: each farther one higher
            longer = [
                o
                for o, _ in into[b]
                if abs(xs[o] - xs[b]) >= near and abs(xs[o] - xs[b]) < abs(xs[a] - xs[b])
            ]
            h = 80.0 + 26 * len(longer)
        color = ACCENT if hot else INK
        out.append(
            f'<path d="M {x1:.1f} {top} C {x1:.1f} {top - h:.1f} {x2:.1f} {top - h:.1f} '
            f'{x2:.1f} {top - 8:.1f}" fill="none" stroke="{color}" stroke-width="1.25"/>'
        )
        out.append(f'<path d="M {x2:.1f} {top:.1f} l -3.5 -8 l 7 0 Z" fill="{color}"/>')
        labels.append(_label((x1 + x2) / 2, top - 0.75 * h - 5, op, ACCENT if hot else MUTED))
    return out + labels


def _line_svg(game: Pile, cells, known: dict, arrows, note: str, rejected=()) -> str:
    n = len(cells)
    cw = min(34, (W - 24) / n)
    x0 = (W - cw * n) / 2
    y = 150
    xs = {s: x0 + i * cw + cw / 2 for i, s in enumerate(cells) if s is not None}
    out = []
    for i, s in enumerate(cells):
        x = x0 + i * cw
        if s is None:
            out.append(_text(x + cw / 2, y + 5, "…", 14, MUTED, "middle"))
            continue
        k = known.get(s)
        fill = WASH if k in ("В1", "В2") else "#fff"
        stroke = ACCENT if k == "П1" else (INK if k else FAINT)
        dash = ' stroke-dasharray="4 3"' if k in ("В2", "П2") else ""
        width = 2 if k == "П1" else 1.25
        out.append(
            f'<rect x="{x + 1:.1f}" y="{y - 14}" width="{cw - 2:.1f}" height="28" rx="4" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="{width}"{dash}/>'
        )
        size = 13
        out.append(_text(x + cw / 2, y + 4, str(s), size, INK if k else MUTED, "middle"))
        if k:
            out.append(
                _text(
                    x + cw / 2,
                    y + 32,
                    k,
                    13,
                    ACCENT if k == "П1" else MUTED,
                    "middle",
                )
            )
        if s in rejected:
            out.append(_text(x + cw / 2, y + 32, "нет", 13, MUTED, "middle"))
    out += _arches(xs, y - 15, cw, arrows)
    out.append(_text(12, 22, game.rules(), 13, MUTED))
    if note:
        out.append(_text(12, 200, note, 13, INK))
    return (
        f'<svg viewBox="0 0 {W} 212" role="img" aria-label="Позиции игры на числовой прямой">'
        + "".join(out)
        + "</svg>"
    )


def game_line_frames(
    lo: int = 1, hi: int = 20, ops=("+1", "×2"), end: str = "≥", limit: int = 21, show: str = ""
) -> list[tuple[str, str]]:
    """В1, П1, В2, П2 filled in that order; each frame shows the moves that decide."""
    game = Pile(ops, end, limit)
    cells = _segments(lo, hi, show)
    seen = [s for s in cells if s is not None]
    kinds = {s: game.kind(s) for s in seen}
    group = {k: [s for s in seen if kinds[s] == k] for k in KINDS}
    frames = []
    known: dict[int, str] = {}
    frames.append(
        (
            _line_svg(game, cells, known, [], "Позиции ещё не размечены."),
            f"Игра: {game.rules()}. Начинаем с конца: из каких позиций можно выиграть одним ходом?",
        )
    )
    w1 = group["В1"]
    known.update(dict.fromkeys(w1, "В1"))
    first = w1[0] if end == "≥" else w1[-1]
    op, q = next((op, q) for op, q in game.moves(first) if game.over(q))
    frames.append(
        (
            _line_svg(
                game,
                cells,
                known,
                [],
                f"В1: {_span(w1)} — есть ход, который сразу заканчивает игру.",
            ),
            f"В1 = {_span(w1)}: из {first} ход {op} даёт {q}, игра окончена. "
            f"Из {first - 1 if end == '≥' else first + 1} такого хода уже нет.",
        )
    )
    for name, rule in (
        ("П1", "все ходы ведут в В1 соперника"),
        ("В2", "не В1, но есть ход в П1"),
        ("П2", "все ходы ведут в В1 или В2, но позиция не П1"),
    ):
        members = group[name]
        known.update(dict.fromkeys(members, name))
        arrows = []
        parts = []
        for s in members:
            outs = game.moves(s)
            if name == "В2":
                outs = [(o, t) for o, t in outs if kinds.get(t) == "П1"][:1]
            for o, t in outs:
                if t in kinds or t in seen:
                    arrows.append((s, t, o, name == "В2"))
            parts.append(
                f"{s}: " + ", ".join(f"{o} → {t} ({kinds.get(t) or 'конец'})" for o, t in outs)
            )
        frames.append(
            (
                _line_svg(game, cells, known, arrows, f"{name}: {_span(members)} — {rule}."),
                f"{name} = {_span(members)}: {rule}. " + "; ".join(parts) + ".",
            )
        )
        if name == "П2":
            # a candidate that fails: one move into В1 or В2, another not
            fails = [
                s
                for s in seen
                if kinds[s] is None
                and any(kinds.get(t) in ("В1", "В2") for _, t in game.moves(s))
                and not all(kinds.get(t) in ("В1", "В2") for _, t in game.moves(s))
            ]
            if fails:
                s = fails[0]
                bad = next((o, t) for o, t in game.moves(s) if kinds.get(t) not in ("В1", "В2"))
                good = next((o, t) for o, t in game.moves(s) if kinds.get(t) in ("В1", "В2"))
                frames.append(
                    (
                        _line_svg(
                            game,
                            cells,
                            known,
                            [(s, good[1], good[0], False), (s, bad[1], bad[0], True)],
                            f"{s} — не П2: ход {bad[0]} даёт {bad[1]}, а это не В1 и не В2.",
                            rejected=(s,),
                        ),
                        f"{s} не подходит: {good[0]} → {good[1]} ({kinds[good[1]]}), "
                        f"но {bad[0]} → {bad[1]}, а {bad[1]} не В1 и не В2. Соперник не обязан "
                        "выигрывать за один-два хода — значит, гарантии нет.",
                    )
                )
    rest = [s for s in seen if kinds[s] is None]
    frames.append(
        (
            _line_svg(
                game,
                cells,
                known,
                [],
                f"Не размечены: {_span(rest)} — им нужны ходы дальше." if rest else "",
            ),
            "Итог: "
            + "; ".join(f"{k} = {_span(group[k])}" for k in KINDS)
            + (
                f". Позиции {_span(rest)} не попали ни в одну группу: для них нужно смотреть дальше."
                if rest
                else "."
            ),
        )
    )
    return frames


def _span(values: list[int]) -> str:
    """[11, 12, …, 20] → «11–20», [5, 9] → «5, 9»."""
    if not values:
        return "нет"
    parts, i = [], 0
    while i < len(values):
        j = i
        while j + 1 < len(values) and values[j + 1] == values[j] + 1:
            j += 1
        parts.append(
            f"{values[i]}–{values[j]}" if j - i >= 2 else ", ".join(map(str, values[i : j + 1]))
        )
        i = j + 1
    return ", ".join(parts)


def game_line_stepper(
    lo: int = 1, hi: int = 20, ops=("+1", "×2"), end: str = "≥", limit: int = 21, show: str = ""
) -> str:
    return _stepper(game_line_frames(lo, hi, ops, end, limit, show))


def game_line(
    lo: int = 11,
    hi: int = 46,
    ops=("−1", "//2"),
    end: str = "≤",
    limit: int = 10,
    show: str = "",
    arrows: str = "В2",
) -> str:
    """All four groups at once; arcs only for the moves of the group ``arrows``
    (В2 — the move into the trap П1, П2 — every move)."""
    game = Pile(ops, end, limit)
    cells = _segments(lo, hi, show)
    seen = [s for s in cells if s is not None]
    kinds = {s: game.kind(s) for s in seen}
    known = {s: k for s, k in kinds.items() if k}
    arcs = []
    for s in seen:
        if kinds[s] != arrows:
            continue
        for op, t in game.moves(s):
            if t in kinds and (arrows != "В2" or kinds[t] == "П1"):
                arcs.append((s, t, op, arrows == "В2"))
    members = [s for s in seen if kinds[s] == arrows]
    note = f"Стрелки — ходы из {_span(members)} ({arrows})."
    return _line_svg(game, cells, known, arcs, note)


# --- two piles -------------------------------------------------------------------


@cache
def _f2(a: int, b: int, m: int, limit: int, add: int, mul: int) -> bool:
    if a + b >= limit:
        return m % 2 == 0
    if m == 0:
        return False
    nxt = [(a + add, b), (a * mul, b), (a, b + add), (a, b * mul)]
    results = [_f2(x, y, m - 1, limit, add, mul) for x, y in nxt]
    return any(results) if m % 2 else all(results)


def kind2(a: int, b: int, limit: int = 20, add: int = 1, mul: int = 2) -> str | None:
    if a + b >= limit:
        return None
    for m, name in enumerate(KINDS, 1):
        if _f2(a, b, m, limit, add, mul):
            return name
    return None


def game_grid(
    first: int = 3,
    rows: int = 7,
    cols: int = 12,
    limit: int = 20,
    mark=((6, 6), (2, 10)),
    add: int = 1,
    mul: int = 2,
) -> str:
    """Positions (a, b) of two piles, +add or ×mul in one pile, the game ends when
    a + b ≥ limit. Row a = first is the start (first, S). Every text is 18 px of
    the 660-wide figure: about 9 px when the figure shrinks to a phone column."""
    cell, size = 46, 18
    x0, y0 = 60, 104
    out = [
        _text(12, 26, f"+{add} или ×{mul} в одну кучу, победа при a + b ≥ {limit}", size, MUTED),
        _text(x0 + cols * cell / 2, 62, "b — вторая куча", size, MUTED, "middle"),
        _text(14, y0 + rows * cell / 2 + 6, "a", size, MUTED),
    ]
    for b in range(1, cols + 1):
        out.append(_text(x0 + (b - 0.5) * cell, y0 - 10, str(b), size, MUTED, "middle"))
    for a in range(1, rows + 1):
        y = y0 + (a - 1) * cell
        out.append(
            _text(x0 - 10, y + cell / 2 + 6, str(a), size, ACCENT if a == first else MUTED, "end")
        )
        for b in range(1, cols + 1):
            x = x0 + (b - 1) * cell
            if a + b >= limit:
                continue
            k = kind2(a, b, limit, add, mul)
            fill = WASH if k in ("В1", "В2") else "#fff"
            stroke = ACCENT if k == "П1" else (INK if k else FAINT)
            dash = ' stroke-dasharray="4 3"' if k in ("В2", "П2") else ""
            out.append(
                f'<rect x="{x + 2}" y="{y + 2}" width="{cell - 4}" height="{cell - 4}" rx="4" '
                f'fill="{fill}" stroke="{stroke}" stroke-width="{2 if k == "П1" else 1.25}"{dash}/>'
            )
            if k:
                color = ACCENT if k == "П1" else INK
                out.append(_text(x + cell / 2, y + cell / 2 + 6, k, size, color, "middle"))
    ry = y0 + (first - 1) * cell
    out.append(
        f'<rect x="{x0 - 2}" y="{ry}" width="{cols * cell + 4}" height="{cell}" rx="6" '
        f'fill="none" stroke="{ACCENT}" stroke-width="2"/>'
    )
    for a, b in mark:
        cx, cy = x0 + (b - 0.5) * cell, y0 + (a - 0.5) * cell
        out.append(
            f'<circle cx="{cx}" cy="{cy}" r="{cell / 2 + 1}" fill="none" '
            f'stroke="{INK}" stroke-width="2.5"/>'
        )
    yb = y0 + rows * cell + 32
    marks = " и ".join(f"({a}, {b})" for a, b in mark)
    legend = [
        f"рамка — строка ({first}, S); кружки — {marks}",
        f"у обеих сумма {sum(mark[0])}; без подписи — дальше двух ходов",
    ]
    if rows + cols >= limit:
        legend.append("клеток нет — игра уже окончена")
    for i, line in enumerate(legend):
        out.append(_text(12, yb + i * 26, line, size, MUTED))
    height = yb + (len(legend) - 1) * 26 + 12
    return (
        f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Позиции двух куч и их группы">'
        + "".join(out)
        + "</svg>"
    )


# --- the four groups on examples ------------------------------------------------

RULE = {
    "В1": "есть ход, который кончает игру",
    "П1": "все ходы — в В1 соперника",
    "В2": "есть ход в П1 соперника",
    "П2": "все ходы — в В1 или В2, не все в В1",
}


def _kind_box(
    x: float, y: float, label: str, kind: str | None, w: float = 50, named: bool = True
) -> str:
    """A position box with its group under it; the end of the game is washed."""
    fill = WASH if kind in ("В1", "В2", "конец") else "#fff"
    stroke = ACCENT if kind == "П1" else INK
    dash = ' stroke-dasharray="4 3"' if kind in ("В2", "П2") else ""
    out = [
        f'<rect x="{x - w / 2:.1f}" y="{y - 16}" width="{w}" height="32" rx="7" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="{2 if kind == "П1" else 1.25}"{dash}/>',
        _text(x, y + 5, label, 15, INK, "middle", 600 if kind == "конец" else 400),
    ]
    if kind and named:
        color = ACCENT if kind == "П1" else MUTED
        out.append(_text(x, y + 34, kind, 14, color, "middle"))
    return "".join(out)


def game_kinds(examples=(11, 10, 9, 8)) -> str:
    """Four cards: a position of each group of the game +1 or ×2 until 21 and
    its moves; the move that decides is orange, a move the player skips is faint."""
    game = Pile()
    out = []
    cw, ch = W / 2, 196
    for i, (name, s) in enumerate(zip(KINDS, examples, strict=True)):
        assert game.kind(s) == name, (s, name)
        x0, y0 = (i % 2) * cw, (i // 2) * ch
        cx = x0 + cw / 2
        out.append(_text(x0 + 16, y0 + 28, name, 17, ACCENT if name == "П1" else INK, "start", 700))
        out.append(_text(x0 + 52, y0 + 28, RULE[name], 14, MUTED))
        out.append(_kind_box(cx, y0 + 64, str(s), name, named=False))
        moves = game.moves(s)
        for j, (op, q) in enumerate(moves):
            qx = cx + (j - (len(moves) - 1) / 2) * 130
            if game.over(q):
                kind = "конец"
            else:
                kind = game.kind(q)
            decides = {
                "В1": kind == "конец",
                "П1": True,
                "В2": kind == "П1",
                "П2": True,
            }[name]
            skipped = name in ("В1", "В2") and not decides
            color = ACCENT if decides and name in ("В1", "В2") else (FAINT if skipped else INK)
            out.append(_arrow(cx, y0 + 82, qx, y0 + 128, color, dashed=skipped, width=1.25))
            out.append(_edge_label(cx, y0 + 64, qx, y0 + 144, op))
            out.append(_kind_box(qx, y0 + 144, str(q), kind))
    for x in (cw,):
        out.append(f'<line x1="{x}" y1="8" x2="{x}" y2="{2 * ch - 8}" stroke="{FAINT}"/>')
    out.append(f'<line x1="8" y1="{ch}" x2="{W - 8}" y2="{ch}" stroke="{FAINT}"/>')
    return (
        f'<svg viewBox="0 0 {W} {2 * ch}" role="img" '
        f'aria-label="Четыре группы позиций на примерах: 11, 10, 9 и 8">' + "".join(out) + "</svg>"
    )


# --- calls of the label function g ------------------------------------------------

NAMES = {1: "В1", -1: "П1", 2: "В2", -2: "П2", 0: "дальше"}
WHY = {
    -1: "все ходы ведут в В1",
    2: "есть ход в П1",
    -2: "все ходы ведут в В1 или В2",
    0: "ни одно правило не подошло",
}


def _minus(v: int) -> str:
    return f"−{-v}" if v < 0 else str(v)


def _label_calls(game: Pile, s: int):
    """The calls of the lesson's g(s) in the order they finish: a node is
    (ident, s, op, kids, end, value); ``end`` is the move that ends the game."""
    order = []
    calls = []

    def go(s, op, ident):
        nxt = game.moves(s)
        end = next(((o, q) for o, q in nxt if game.over(q)), None)
        if not end:
            calls.append((len(order), ident, s, nxt))
        kids = [] if end else [go(q, o, ident + (j,)) for j, (o, q) in enumerate(nxt)]
        if end:
            value = 1
        else:
            r = [k[5] for k in kids]
            if all(x == 1 for x in r):
                value = -1
            elif -1 in r:
                value = 2
            elif all(x > 0 for x in r):
                value = -2
            else:
                value = 0
        node = (ident, s, op, kids, end, value)
        order.append(node)
        return node

    return go(s, "", ()), order, calls


def game_label_frames(
    start: int = 9, ops=("+1", "×2"), end: str = "≥", limit: int = 21
) -> list[tuple[str, str]]:
    game = Pile(ops, end, limit)
    root, order, calls = _label_calls(game, start)
    pos: dict[tuple, tuple[float, int]] = {}
    leaves = 0

    def place(node, d):
        nonlocal leaves
        ident, _s, _op, kids, fin, _v = node
        for k in kids:
            place(k, d + 1)
        if fin:
            pos[ident + ("end",)] = (leaves, d + 1)
        xs = [pos[k[0]][0] for k in kids] or [pos[ident + ("end",)][0]]
        if not kids and not fin:
            xs = [leaves]
        pos[ident] = (sum(xs) / len(xs), d)
        if fin or not kids:
            leaves += 1

    place(root, 0)
    depth = max(d for _, d in pos.values())
    left, right = 70, W - 70
    step = (right - left) / max(leaves - 1, 1)

    def px(x):
        return left + x * step

    def py(d):
        return 36 + d * 92

    def svg(done: set, current, waiting=()):
        out = []
        for node in order:
            ident, s, _op, kids, fin, value = node
            seen = ident in done or ident == current
            x, y = px(pos[ident][0]), py(pos[ident][1])
            lit = done | set(waiting) | {current}
            targets = [(k[0], k[2], k[0] in lit) for k in kids]
            if fin and seen:
                targets.append((ident + ("end",), fin[0], True))
            for t, op, lit in targets:
                tx, ty = px(pos[t][0]), py(pos[t][1])
                out.append(_arrow(x, y + 23, tx, ty - 24, INK if lit else FAINT, width=1.25))
                out.append(_edge_label(x, y, tx, ty, op))
            if fin and seen:
                ex, ey = px(pos[ident + ("end",)][0]), py(pos[ident + ("end",)][1])
                out.append(
                    f'<rect x="{ex - 30:.1f}" y="{ey - 20}" width="60" height="40" rx="7" '
                    f'fill="{WASH}" stroke="{INK}" stroke-width="1.25"/>'
                )
                out.append(_text(ex, ey - 2, str(fin[1]), 14, INK, "middle", 600))
                out.append(_text(ex, ey + 14, "конец", 12, MUTED, "middle"))
        for node in order:
            ident, s, _op, _kids, _fin, value = node
            x, y = px(pos[ident][0]), py(pos[ident][1])
            is_done = ident in done
            wait = ident in waiting and ident != current
            stroke = ACCENT if ident == current else (INK if is_done or wait else FAINT)
            out.append(
                f'<rect x="{x - 46:.1f}" y="{y - 22}" width="92" height="44" rx="7" '
                f'fill="#fff" stroke="{stroke}" stroke-width="{2 if ident == current else 1.25}"/>'
            )
            out.append(_text(x, y - 3, f"g({s})", 14, INK if is_done or wait else MUTED, "middle"))
            if is_done:
                tail = f"= {_minus(value)} ({NAMES[value]})"
                out.append(_text(x, y + 14, tail, 13, INK, "middle", 600))
            elif wait or ident == current and ident not in done and _kids:
                out.append(_text(x, y + 14, "ждёт…", 13, MUTED, "middle"))
        return (
            f'<svg viewBox="0 0 {W} {py(depth) + 32}" role="img" '
            f'aria-label="Вызовы g({start}) и группы позиций">' + "".join(out) + "</svg>"
        )

    def asks(s, nxt):
        after = " и ".join(f"{q} ({o})" for o, q in nxt)
        return f"g({s}): ни один ход не кончает игру — нужны группы позиций {after}."

    frames = []
    done: set = set()
    waits: list = []  # (ident, s) of the calls waiting for answers
    for i, node in enumerate(order):
        for at, ident, s, nxt in calls:
            if at == i:
                text = asks(s, nxt)
                if waits:
                    text += f" g({waits[-1][1]}) ждёт ответа."
                else:
                    text = text.replace(" — нужны", ", поэтому программа спрашивает")
                waits.append((ident, s))
                frames.append((svg(set(done), ident, {w for w, _ in waits}), text))
        ident, s, _op, kids, fin, value = node
        done.add(ident)
        if fin:
            text = f"g({s}): ход {fin[0]} даёт {fin[1]} — игра кончается. {s} — В1, g({s}) = 1."
        else:
            vals = ", ".join(_minus(k[5]) for k in kids)
            text = (
                f"g({s}): ходы дают [{vals}] — {WHY[value]}. "
                f"{s} — {NAMES[value]}, g({s}) = {_minus(value)}."
            )
        if ident == root[0]:
            text += f" Программа печатает {value}."
        if not fin:
            waits.remove((ident, s))
        frames.append((svg(set(done), ident, {w for w, _ in waits}), text))
    return frames


def game_label_stepper(start: int = 9) -> str:
    return _stepper(game_label_frames(start))


GAME_FIGURES: dict = {
    "game_tree": game_tree,
    "game_line_stepper": game_line_stepper,
    "game_line": game_line,
    "game_grid": game_grid,
    "game_label_stepper": game_label_stepper,
    "game_kinds": game_kinds,
}
GAME_STEPPERS: dict = {
    "game_line_stepper": game_line_frames,
    "game_label_stepper": game_label_frames,
}
GAME_WIDGETS: dict = {}
GAME_SCRIPTS: dict = {}
