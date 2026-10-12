"""Figures of topic 19–21 «Выигрышная стратегия» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture:
the rules of a game are given once (``ops``, ``end``, ``limit``) and the
positions, their kinds and the strategies come from the same small solver the
lesson programs use (f(p, m) of subtopic 6). All keys start with ``game_``.

``game_tree(start, depth, winner, …)`` — a game tree of one pile: every
move (``winner=""``) or the strategy of the winner — his chosen move and
every reply of the opponent. ``path`` marks one party.
``game_line_stepper(lo, hi, …)`` — positions on a number line filled from
the end of the game: W1, then L1, W2 and L2, with the moves that decide.
``game_line(lo, hi, …)`` — the final frame of the same line, with gaps.
``game_grid(first, second, limit, …)`` — two piles: every position (a, b)
with its kind, the row of the start (first, S) and marked positions.
``game_calls_stepper(start, m)`` — the calls of f(p, m) in the order the
program finishes them: ``any`` on the turn of the player we check, ``all``
on the opponent's turn, values going up.
"""

from __future__ import annotations

from functools import cache, lru_cache

from figures import ACCENT, FAINT, INK, MUTED, WASH, _arrow, _stepper, _text

W = 660
KINDS = ("W1", "L1", "W2", "L2")

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
        fill = WASH if k in ("W1", "W2") else "#fff"
        stroke = ACCENT if k == "L1" else (INK if k else FAINT)
        dash = ' stroke-dasharray="4 3"' if k in ("W2", "L2") else ""
        width = 2 if k == "L1" else 1.25
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
                    ACCENT if k == "L1" else MUTED,
                    "middle",
                )
            )
        if s in rejected:
            out.append(_text(x + cw / 2, y + 32, "нет", 13, MUTED, "middle"))
    into: dict[int, int] = {}
    labelled: list[tuple[int, str]] = []
    for a, b, op, hot in arrows:
        x1, x2 = xs[a], xs[b]
        # arcs into one cell are stacked: each next one higher, one label
        k = into.get(b, 0)
        into[b] = k + 1
        lift = 14 + min(abs(x2 - x1), 420) * 0.14 + 22 * k
        mid = (x1 + x2) / 2
        color = ACCENT if hot else INK
        out.append(
            f'<path d="M {x1:.1f} {y - 16} Q {mid:.1f} {y - 16 - 2 * lift:.1f} {x2:.1f} {y - 18}" '
            f'fill="none" stroke="{color}" stroke-width="1.25"/>'
        )
        # small head pointing down at the target
        out.append(f'<path d="M {x2:.1f} {y - 16} l -4 -7 l 8 0 Z" fill="{color}"/>')
        if not any(t == b and o == op for t, o in labelled):
            if abs(x2 - x1) < 2.5 * cw:
                # a short arc: the label beside its start, clear of long arcs
                side = 1 if x1 > x2 else -1
                out.append(
                    _text(x1 + side * 8, y - 22, op, 13, MUTED, "start" if side > 0 else "end")
                )
            else:
                out.append(_text(mid, y - 18 - lift, op, 13, MUTED, "middle"))
            labelled.append((b, op))
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
    """W1, L1, W2, L2 filled in that order; each frame shows the moves that decide."""
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
    w1 = group["W1"]
    known.update(dict.fromkeys(w1, "W1"))
    first = w1[0] if end == "≥" else w1[-1]
    op, q = next((op, q) for op, q in game.moves(first) if game.over(q))
    frames.append(
        (
            _line_svg(
                game,
                cells,
                known,
                [],
                f"W1: {_span(w1)} — есть ход, который сразу заканчивает игру.",
            ),
            f"W1 = {_span(w1)}: из {first} ход {op} даёт {q}, игра окончена. "
            f"Из {first - 1 if end == '≥' else first + 1} такого хода уже нет.",
        )
    )
    for name, rule in (
        ("L1", "все ходы ведут в W1 соперника"),
        ("W2", "не W1, но есть ход в L1"),
        ("L2", "все ходы ведут в W1 или W2, но позиция не L1"),
    ):
        members = group[name]
        known.update(dict.fromkeys(members, name))
        arrows = []
        parts = []
        for s in members:
            outs = game.moves(s)
            if name == "W2":
                outs = [(o, t) for o, t in outs if kinds.get(t) == "L1"][:1]
            for o, t in outs:
                if t in kinds or t in seen:
                    arrows.append((s, t, o, name == "W2"))
            parts.append(
                f"{s}: " + ", ".join(f"{o} → {t} ({kinds.get(t) or 'конец'})" for o, t in outs)
            )
        frames.append(
            (
                _line_svg(game, cells, known, arrows, f"{name}: {_span(members)} — {rule}."),
                f"{name} = {_span(members)}: {rule}. " + "; ".join(parts) + ".",
            )
        )
        if name == "L2":
            # a candidate that fails: one move into W1 or W2, another not
            fails = [
                s
                for s in seen
                if kinds[s] is None
                and any(kinds.get(t) in ("W1", "W2") for _, t in game.moves(s))
                and not all(kinds.get(t) in ("W1", "W2") for _, t in game.moves(s))
            ]
            if fails:
                s = fails[0]
                bad = next((o, t) for o, t in game.moves(s) if kinds.get(t) not in ("W1", "W2"))
                good = next((o, t) for o, t in game.moves(s) if kinds.get(t) in ("W1", "W2"))
                frames.append(
                    (
                        _line_svg(
                            game,
                            cells,
                            known,
                            [(s, good[1], good[0], False), (s, bad[1], bad[0], True)],
                            f"{s} — не L2: ход {bad[0]} даёт {bad[1]}, а это не W1 и не W2.",
                            rejected=(s,),
                        ),
                        f"{s} не подходит: {good[0]} → {good[1]} ({kinds[good[1]]}), "
                        f"но {bad[0]} → {bad[1]}, а {bad[1]} не W1 и не W2. Соперник не обязан "
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
    arrows: str = "W2",
) -> str:
    """All four groups at once; arcs only for the moves of the group ``arrows``
    (W2 — the move into the trap L1, L2 — every move)."""
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
            if t in kinds and (arrows != "W2" or kinds[t] == "L1"):
                arcs.append((s, t, op, arrows == "W2"))
    members = [s for s in seen if kinds[s] == arrows]
    note = f"Стрелки — ходы из {_span(members)} ({arrows})."
    return _line_svg(game, cells, known, arcs, note)


# --- two piles -------------------------------------------------------------------


@cache
def _f2(a: int, b: int, m: int, limit: int, mul: int) -> bool:
    if a + b >= limit:
        return m % 2 == 0
    if m == 0:
        return False
    nxt = [(a + 1, b), (a * mul, b), (a, b + 1), (a, b * mul)]
    results = [_f2(x, y, m - 1, limit, mul) for x, y in nxt]
    return any(results) if m % 2 else all(results)


def kind2(a: int, b: int, limit: int = 20, mul: int = 2) -> str | None:
    if a + b >= limit:
        return None
    for m, name in enumerate(KINDS, 1):
        if _f2(a, b, m, limit, mul):
            return name
    return None


def game_grid(
    first: int = 3, rows: int = 7, cols: int = 12, limit: int = 20, mark=((6, 6), (2, 10))
) -> str:
    """Positions (a, b) of two piles, +1 or ×2 in one pile, the game ends when
    a + b ≥ limit. Row a = first is the start (first, S). Every text is 18 px of
    the 660-wide figure: about 9 px when the figure shrinks to a phone column."""
    cell, size = 46, 18
    x0, y0 = 60, 104
    out = [
        _text(12, 26, f"+1 или ×2 в одну кучу, победа при a + b ≥ {limit}", size, MUTED),
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
            k = kind2(a, b, limit)
            fill = WASH if k in ("W1", "W2") else "#fff"
            stroke = ACCENT if k == "L1" else (INK if k else FAINT)
            dash = ' stroke-dasharray="4 3"' if k in ("W2", "L2") else ""
            out.append(
                f'<rect x="{x + 2}" y="{y + 2}" width="{cell - 4}" height="{cell - 4}" rx="4" '
                f'fill="{fill}" stroke="{stroke}" stroke-width="{2 if k == "L1" else 1.25}"{dash}/>'
            )
            if k:
                color = ACCENT if k == "L1" else INK
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
    for i, line in enumerate(
        (
            f"рамка — строка ({first}, S); кружки — {marks}",
            f"у обеих сумма {sum(mark[0])}; без подписи — дальше двух ходов",
            "клеток нет — игра уже окончена",
        )
    ):
        out.append(_text(12, yb + i * 26, line, size, MUTED))
    height = yb + 2 * 26 + 12
    return (
        f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Позиции двух куч и их группы">'
        + "".join(out)
        + "</svg>"
    )


# --- calls of f(p, m) --------------------------------------------------------------


def _calls(game: Pile, s: int, m: int, ident=()):
    """(ident, s, m, kids, value, how) in the order the program finishes them."""
    order = []

    def go(s, m, ident):
        if game.over(s):
            value, how, kids = m % 2 == 0, "конец", []
        elif m == 0:
            value, how, kids = False, "m = 0", []
        else:
            kids = [go(q, m - 1, ident + (j,)) for j, (_, q) in enumerate(game.moves(s))]
            vals = [k[4] for k in kids]
            value, how = (any(vals), "any") if m % 2 else (all(vals), "all")
        node = (ident, s, m, kids, value, how)
        order.append(node)
        return node

    root = go(s, m, ident)
    return root, order


def game_calls_frames(start: int = 5, m: int = 3) -> list[tuple[str, str]]:
    game = Pile()
    root, order = _calls(game, start, m)
    pos: dict[tuple, tuple[float, int]] = {}
    leaves = 0

    def place(node, d):
        nonlocal leaves
        ident, _s, _m, kids, _v, _h = node
        for k in kids:
            place(k, d + 1)
        if kids:
            x = sum(pos[k[0]][0] for k in kids) / len(kids)
        else:
            x = leaves
            leaves += 1
        pos[ident] = (x, d)

    place(root, 0)
    depth = max(d for _, d in pos.values())
    step = (W - 80) / max(leaves - 1, 1)

    def px(x):
        return 40 + x * step

    def py(d):
        return 34 + d * 88

    def svg(done: set, current):
        out = []
        for node in order:
            ident, _s, _m, kids, _v, _h = node
            for k in kids:
                out.append(
                    f'<line x1="{px(pos[ident][0]):.1f}" y1="{py(pos[ident][1]) + 44}" '
                    f'x2="{px(pos[k[0]][0]):.1f}" y2="{py(pos[k[0]][1]) - 20}" '
                    f'stroke="{FAINT}" stroke-width="1.25"/>'
                )
        for node in order:
            ident, s, mm, kids, value, how = node
            x, y = px(pos[ident][0]), py(pos[ident][1])
            is_done = ident in done
            stroke = ACCENT if ident == current else (INK if is_done else FAINT)
            out.append(
                f'<rect x="{x - 36:.1f}" y="{y - 20}" width="72" height="40" rx="6" '
                f'fill="{WASH if is_done and value else "#fff"}" stroke="{stroke}" '
                f'stroke-width="{2 if ident == current else 1.25}"/>'
            )
            out.append(_text(x, y - 3, f"f({s}, {mm})", 13, INK if is_done else MUTED, "middle"))
            if is_done:
                tail = "True" if value else "False"
                out.append(_text(x, y + 14, tail, 13, INK, "middle", 600))
            if kids:
                out.append(_text(x, y + 37, how, 13, MUTED, "middle"))
        return (
            f'<svg viewBox="0 0 {W} {py(depth) + 30}" role="img" '
            f'aria-label="Вызовы f({start}, {m})">' + "".join(out) + "</svg>"
        )

    frames = [
        (
            svg(set(), root[0]),
            f"f({start}, {m}): проверяем победу Пети не позднее его второго хода. "
            "Программа спускается по ходам, пока не дойдёт до конца игры или до m = 0.",
        )
    ]
    done: set = set()
    for node in order:
        ident, s, mm, kids, value, how = node
        done.add(ident)
        if how == "конец":
            who = "нужный" if value else "не тот"
            text = f"f({s}, {mm}): {s} ≥ {game.limit}, игра окончена, последний ход сделал {who} игрок — {value}."
        elif how == "m = 0":
            text = f"f({s}, {mm}): ходы кончились, а игра идёт — False."
        else:
            vals = ", ".join(str(k[4]) for k in kids)
            whose = (
                "ход Пети — хватит одного хода" if how == "any" else "ход Вани — нужны все ответы"
            )
            text = f"f({s}, {mm}) = {how}([{vals}]) = {value}: {whose}."
        frames.append((svg(done, ident), text))
    return frames


def game_calls_stepper(start: int = 5, m: int = 3) -> str:
    return _stepper(game_calls_frames(start, m))


GAME_FIGURES: dict = {
    "game_tree": game_tree,
    "game_line_stepper": game_line_stepper,
    "game_line": game_line,
    "game_grid": game_grid,
    "game_calls_stepper": game_calls_stepper,
}
GAME_STEPPERS: dict = {
    "game_line_stepper": game_line_frames,
    "game_calls_stepper": game_calls_frames,
}
GAME_WIDGETS: dict = {}
GAME_SCRIPTS: dict = {}
