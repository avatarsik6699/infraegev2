"""Figures of topic 13 «Анализ хода исполнения алгоритма» (registered in figures.FIGURES).

A numeric executor of the lesson is run here: the same commands as on the page,
written as short codes, applied to the integers of the range. Every arrow, every
count K(n) under a number and every leaf of a tree comes from this execution.

Command codes: ``+k``, ``-k``, ``*k``, ``ax+b`` (``2x+1``), ``/k`` — exact
division, ``//k`` — division rounded down, ``ceil/k`` — rounded up, ``^2`` —
square, ``dD`` — append digit D on the right, ``swap`` — swap the two lowest
digits when the tens digit is less than the units digit.

``ex_tree(start, target, cmds)`` — the tree of all programs: success, overshoot.
``ex_line(start, target, cmds, must, forbid, path)`` — numbers of the range on a
line, every transition as an arrow, the number of programs K(n) under each.
``ex_fill(start, target, cmds, must, forbid)`` — step by step: K(n) of the next
number as the sum over the arrows that enter it.
"""

from __future__ import annotations

import re

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stepper, _text

W = 660

LABEL = {"swap": "перест.", "^2": "x²"}


def label(op: str) -> str:
    if op.startswith("b:"):
        even, odd = op[2:].split("|")
        return f"чёт {label(even)}, нечёт {label(odd)}"
    if op in LABEL:
        return LABEL[op]
    if op.startswith("*"):
        return "×" + op[1:]
    if op.startswith("-"):
        return "−" + op[1:]
    if op.startswith("ceil/"):
        return "⌈÷" + op[5:] + "⌉"
    if op.startswith("//"):
        return "⌊÷" + op[2:] + "⌋"
    if op.startswith("/"):
        return "÷" + op[1:]
    if op.startswith("d"):
        return "+цифра " + op[1:]
    return op


def apply(op: str, x: int) -> int | None:
    """Result of one command or None when the command is not allowed for x.
    ``b:A|B`` — one command with two branches: A for an even x, B for an odd x."""
    if op.startswith("b:"):
        even, odd = op[2:].split("|")
        return apply(even if x % 2 == 0 else odd, x)
    if op == "swap":
        t, u = (x // 10) % 10, x % 10
        return x + 9 * (u - t) if t < u else None
    if op == "^2":
        return x * x
    m = re.fullmatch(r"(\d+)x\+(\d+)", op)
    if m:
        return int(m.group(1)) * x + int(m.group(2))
    if op.startswith("ceil/"):
        return -(-x // int(op[5:]))
    if op.startswith("//"):
        return x // int(op[2:])
    if op.startswith("/"):
        k = int(op[1:])
        return x // k if x % k == 0 else None
    if op.startswith("d"):
        return 10 * x + int(op[1:])
    k = int(op[1:])
    return {"+": x + k, "-": x - k, "*": x * k}[op[0]]


def _order(start: int, target: int) -> list[int]:
    step = 1 if target >= start else -1
    return list(range(start, target + step, step))


def counts(start: int, target: int, cmds, must=(), forbid=()) -> dict[int, int]:
    """K(n) for every n of the range. A mandatory number starts a new segment:
    from it the counting begins again with 1 (as in the lesson tables), so the
    answer is the product of the values at the segment ends. Forbidden numbers
    keep 0. Every command must move from start towards target (checked)."""
    if must:
        stops = sorted(must, key=lambda m: abs(m - start))
        out, cur = {}, start
        for m in [*stops, target]:
            seg = counts(cur, m, cmds, forbid=forbid)
            out.update({n: v for n, v in seg.items() if n != cur or cur == start})
            cur = m
        return out
    nums = _order(start, target)
    pos = {n: i for i, n in enumerate(nums)}
    w = dict.fromkeys(nums, 0)
    w[start] = 1
    for x in nums:
        if x in forbid:
            w[x] = 0
            continue
        for op in cmds:
            y = apply(op, x)
            if y is None or y not in pos:
                continue
            assert pos[y] > pos[x], f"{op} does not move {x} towards {target}"
            w[y] += w[x]
    for f in forbid:
        if f in w:
            w[f] = 0
    return w


def answer(start: int, target: int, cmds, must=(), forbid=()) -> int:
    """Number of programs: the product over the segments between mandatory numbers."""
    total, cur = 1, start
    for m in [*sorted(must, key=lambda m: abs(m - start)), target]:
        total *= counts(cur, m, cmds, forbid=forbid)[m]
        cur = m
    return total


def _incoming(n: int, start: int, target: int, cmds) -> list[tuple[int, str]]:
    nums = _order(start, target)
    return [(x, op) for x in nums for op in cmds if apply(op, x) == n and x != n]


# --- drawing -------------------------------------------------------------------------
#
# The range is drawn as the table a student writes on paper: a row of numbers n and
# under it the row of counts K(n), in the order the table is filled. The first command
# (+1 or −1) joins neighbouring cells and needs no arrow; every other transition is an
# arc from cell to cell with the command written at its top. Arcs that would cross are
# put on the other side of the table.

CELL_H = 32
OVER = "#9a9a94"  # an overshoot leaf: readable, but clearly not counted


def _segments(start: int, target: int, must=()) -> list[tuple[int, int]]:
    """Consecutive segments start → m₁ → m₂ → … → target."""
    stops = [*sorted(must, key=lambda m: abs(m - start)), target]
    out, cur = [], start
    for m in stops:
        out.append((cur, m))
        cur = m
    return out


def useful(start: int, target: int, cmds, must=(), forbid=()) -> set[tuple[int, str]]:
    """Transitions (x, op) that lie on at least one counted program: x is reached in
    its segment and the segment end is reachable from the result. A transition that
    jumps over a mandatory number, leaves or enters a forbidden one, or leads past
    the end is not drawn."""
    edges: set[tuple[int, str]] = set()
    for a, b in _segments(start, target, must):
        nums = _order(a, b)
        reached = counts(a, b, cmds, forbid=forbid)
        back: set[int] = set()
        for x in reversed(nums):
            if x in forbid:
                continue
            if x == b or any(apply(op, x) in back for op in cmds):
                back.add(x)
        for x in nums:
            if x in forbid or reached.get(x, 0) == 0 or x == b:
                continue
            for op in cmds:
                y = apply(op, x)
                if y in back and y != x:
                    edges.add((x, op))
    return edges


def _cell_w(n: int) -> float:
    return min(48.0, 600 / n)


def _arc_h(span: float) -> float:
    return min(78.0, 16 + span * 0.2)


def _sides(arcs: list[tuple[int, int]], pos: dict[int, int]) -> list[bool]:
    """True — above the table. An arc goes below when it would cross an arc above or
    end in the same cell; when both sides are taken it stays above."""
    placed: dict[bool, list[tuple[int, int]]] = {True: [], False: []}
    out = []

    def clash(a, b) -> bool:
        (p1, q1), (p2, q2) = sorted((pos[a[0]], pos[a[1]])), sorted((pos[b[0]], pos[b[1]]))
        crossing = p1 < p2 < q1 < q2 or p2 < p1 < q2 < q1
        return crossing or a[1] == b[1]

    for arc in arcs:
        side = next((s for s in (True, False) if not any(clash(arc, o) for o in placed[s])), True)
        placed[side].append(arc)
        out.append(side)
    return out


def _arrow(x1, y1, cx, cy, x2, y2, color, width) -> str:
    """Quadratic arc with its head along the tangent at the end."""
    dx, dy = x2 - cx, y2 - cy
    ln = (dx * dx + dy * dy) ** 0.5 or 1
    ux, uy = dx / ln, dy / ln
    bx, by = x2 - ux * 8, y2 - uy * 8
    head = (
        f'<path d="M {x2:.1f} {y2:.1f} L {bx - uy * 4:.1f} {by + ux * 4:.1f} '
        f'L {bx + uy * 4:.1f} {by - ux * 4:.1f} Z" fill="{color}"/>'
    )
    # the line stops at the base of the head, so the tip stays sharp
    return (
        f'<path d="M {x1:.1f} {y1:.1f} Q {cx:.1f} {cy:.1f} {bx:.1f} {by:.1f}" fill="none" '
        f'stroke="{color}" stroke-width="{width}" stroke-linecap="round"/>' + head
    )


def _halo(x, y, s, size, color, weight=600) -> str:
    """A label on top of lines: a white outline keeps it readable."""
    t = _text(x, y, s, size, color, "middle", weight)
    return t.replace("<text ", '<text stroke="#fff" stroke-width="4" paint-order="stroke" ', 1)


def _strip(
    out: list,
    nums: list[int],
    x0: float,
    top: float,
    cw: float,
    cmds,
    k: dict[int, int],
    arcs: list[tuple[int, str, bool]] = (),
    hops: list[int] = (),
    must=(),
    forbid=(),
    hot=None,
    sources=(),
):
    """One table row pair at (x0, top). ``arcs`` — (x, op, highlighted); ``hops`` —
    cells x whose step to the neighbour by the first command is highlighted."""
    pos = {n: i for i, n in enumerate(nums)}
    cx = {n: x0 + (i + 0.5) * cw for i, n in enumerate(nums)}
    bottom = top + 2 * CELL_H
    out.append(_text(x0 - 10, top + CELL_H / 2 + 5, "n", 13, MUTED, "end", 600))
    out.append(_text(x0 - 10, top + CELL_H * 1.5 + 5, "K", 13, MUTED, "end", 600))
    for n in nums:
        x = x0 + pos[n] * cw
        out.append(
            f'<rect x="{x:.1f}" y="{top}" width="{cw:.1f}" height="{CELL_H}" fill="{WASH}" '
            f'stroke="{FAINT}"/>'
            f'<rect x="{x:.1f}" y="{top + CELL_H}" width="{cw:.1f}" height="{CELL_H}" fill="#fff" '
            f'stroke="{FAINT}"/>'
        )
    for n in nums:
        color = ACCENT if n in must else (MUTED if n in forbid else INK)
        out.append(_text(cx[n], top + CELL_H / 2 + 5, str(n), 14, color, "middle", 600))
        if n in forbid:
            # crossed out: the cell is in the table, but no program may pass it
            x = x0 + pos[n] * cw
            out.append(
                f'<line x1="{x + 5:.1f}" y1="{top + CELL_H - 5}" x2="{x + cw - 5:.1f}" '
                f'y2="{top + 5}" stroke="{MUTED}" stroke-width="1.6"/>'
            )
        if n in k:
            hot_k = n == hot
            color = ACCENT if hot_k else (MUTED if n in forbid else INK)
            out.append(_text(cx[n], top + CELL_H * 1.5 + 5, str(k[n]), 15, color, "middle", 700))
    for n in sources:
        x = x0 + pos[n] * cw
        out.append(
            f'<rect x="{x + 1.5:.1f}" y="{top + CELL_H + 1.5}" width="{cw - 3:.1f}" '
            f'height="{CELL_H - 3}" fill="none" stroke="{ACCENT}" stroke-width="1.4" rx="3"/>'
        )
    if hot is not None and hot in pos:
        x = x0 + pos[hot] * cw
        out.append(
            f'<rect x="{x:.1f}" y="{top}" width="{cw:.1f}" height="{2 * CELL_H}" fill="none" '
            f'stroke="{ACCENT}" stroke-width="2.4" rx="2"/>'
        )
    pairs = [(x, apply(op, x)) for x, op, _ in arcs]
    sides = _sides(pairs, pos)
    # a step to the neighbour enters the left part of a cell, an arc above its right part
    hopped = {nums[pos[x] + 1] for x in hops if pos[x] + 1 < len(nums)}
    for (x, op, lit), (_, y), up in zip(arcs, pairs, sides, strict=True):
        x2 = cx[y] + (cw * 0.22 if up and y in hopped else 0)
        h = _arc_h(abs(x2 - cx[x]))
        ya = top if up else bottom
        cy = ya - 2 * h if up else ya + 2 * h
        color, width = (ACCENT, 2.2) if lit else (MUTED, 1.4)
        out.append(_arrow(cx[x], ya, (cx[x] + x2) / 2, cy, x2, ya, color, width))
        out.append(_halo((cx[x] + x2) / 2, ya - h + 4 if up else ya + h + 4, label(op), 12, color))
    for x in hops:
        if pos[x] + 1 >= len(nums):
            continue
        y = nums[pos[x] + 1]
        x1, x2 = cx[x] + cw * 0.15, cx[y] - cw * 0.22
        out.append(_arrow(x1, top, (x1 + x2) / 2, top - 26, x2, top, ACCENT, 2.2))
        out.append(_halo((x1 + x2) / 2, top - 15, label(cmds[0]), 12, ACCENT))


def _reach(arcs, nums, cw, cmds) -> tuple[float, float]:
    """Room the arcs need above and below the table."""
    pos = {n: i for i, n in enumerate(nums)}
    pairs = [(x, apply(op, x)) for x, op, _ in arcs]
    up = dn = 0.0
    for (x, y), side in zip(pairs, _sides(pairs, pos), strict=True):
        h = _arc_h(abs(pos[y] - pos[x]) * cw) + 12
        if side:
            up = max(up, h)
        else:
            dn = max(dn, h)
    return up, dn


def _legend(cmds) -> str:
    first = f"соседняя клетка — {label(cmds[0])}"
    rest = ", ".join(label(op) for op in cmds[1:])
    return f"{first} · дуга — {rest}" if rest else first


def _figure(width, height, body, legend, aria) -> str:
    foot = _text(width / 2, height - 10, legend, 13, MUTED, "middle") if legend else ""
    return (
        f'<svg viewBox="0 0 {width:.0f} {height:.0f}" role="img" aria-label="{aria}">'
        + "".join(body)
        + foot
        + "</svg>"
    )


def ex_line(
    start: int,
    target: int,
    cmds,
    must=(),
    forbid=(),
    rows=False,
    focus=None,
    arcs=True,
) -> str:
    """The range as a table n / K(n) in filling order. Arcs: the transitions that lie
    on counted programs; ``focus`` — only the transitions into this number, the cells
    they come from outlined; ``rows`` — one table per segment between mandatory
    numbers and the product of their ends; ``arcs=False`` — counts only."""
    if rows and must:
        return _rows_svg(start, target, cmds, must, forbid, arcs)
    nums = _order(start, target)
    cw = _cell_w(len(nums))
    k = counts(start, target, cmds, must, forbid)
    hops, sources = [], []
    if focus is not None:
        inc = _incoming(focus, start, target, cmds)
        drawn = [(x, op, True) for x, op in inc if op != cmds[0]]
        hops = [x for x, op in inc if op == cmds[0]]
        sources = [x for x, _ in inc]
    elif arcs:
        edges = useful(start, target, cmds, must, forbid)
        drawn = [(x, op, False) for x in nums for op in cmds[1:] if (x, op) in edges]
    else:
        drawn = []
    up, dn = _reach(drawn, nums, cw, cmds)
    up = max(up, 30 if hops else 0)
    x0 = 34
    top = 14 + up
    width = x0 + cw * len(nums) + 14
    height = top + 2 * CELL_H + dn + 36
    body: list = []
    _strip(body, nums, x0, top, cw, cmds, k, drawn, hops, must, forbid, focus, sources)
    legend = _legend(cmds) if drawn or hops else ""
    if not legend:
        height -= 22
    return _figure(width, height, body, legend, "Таблица количеств программ")


def _rows_svg(start, target, cmds, must, forbid, arcs) -> str:
    """One table per segment between mandatory numbers: each counts from 1 again."""
    segs = _segments(start, target, must)
    longest = max(abs(b - a) + 1 for a, b in segs)
    cw = _cell_w(longest)
    edges = useful(start, target, cmds, must, forbid) if arcs else set()
    x0, y, ends, body = 34, 8.0, [], []
    width = x0 + cw * longest + 14
    for a, b in segs:
        nums = _order(a, b)
        k = counts(a, b, cmds, forbid=forbid)
        ends.append(k[b])
        drawn = [(x, op, False) for x in nums for op in cmds[1:] if (x, op) in edges]
        up, dn = _reach(drawn, nums, cw, cmds)
        body.append(_text(x0, y + 16, f"участок {a} → {b}: {k[b]}", 14, INK, "start", 600))
        top = y + 28 + up
        _strip(body, nums, x0, top, cw, cmds, k, drawn, (), must, forbid)
        y = top + 2 * CELL_H + dn + 14
    prod = 1
    for e in ends:
        prod *= e
    total = " · ".join(map(str, ends))
    body.append(_text(x0, y + 18, f"программ: {total} = {prod}", 15, ACCENT, "start", 700))
    if arcs:
        return _figure(width, y + 58, body, _legend(cmds), "Участки пути")
    return _figure(width, y + 30, body, "", "Участки пути")


def fill_frames(start: int, target: int, cmds, must=(), forbid=()) -> list[tuple[str, str]]:
    """The table filled cell by cell: in the current cell the arrows that enter it and
    the cells they come from, outlined — their counts add up to the new one."""
    full = counts(start, target, cmds, must, forbid)
    nums = _order(start, target)
    cw = _cell_w(len(nums))
    every = [
        (x, op, True) for n in nums for x, op in _incoming(n, start, target, cmds) if op != cmds[0]
    ]
    up = max(_reach(every, nums, cw, cmds)[0], 30)
    x0, top = 34, 14 + up
    width = x0 + cw * len(nums) + 14
    height = top + 2 * CELL_H + 36
    frames = []
    for i, n in enumerate(nums):
        shown = {m: full[m] for m in nums[: i + 1]}
        inc = [(x, op) for x, op in _incoming(n, start, target, cmds) if x in shown]
        body: list = []
        _strip(
            body,
            nums,
            x0,
            top,
            cw,
            cmds,
            shown,
            [(x, op, True) for x, op in inc if op != cmds[0]],
            [x for x, op in inc if op == cmds[0]],
            must,
            forbid,
            n,
            [x for x, _ in inc],
        )
        svg = _figure(width, height, body, _legend(cmds), "Заполнение таблицы")
        if i == 0:
            cap = f"K({n}) = 1: в старте одна пустая программа."
        elif n in forbid:
            cap = f"{n} запрещено: K({n}) = 0, из него никуда не идём."
        elif not inc:
            cap = f"В {n} не ведёт ни одна команда: K({n}) = 0."
        else:
            terms = " + ".join(f"K({x})" for x, _ in inc)
            vals = " + ".join(str(shown[x]) for x, _ in inc)
            cap = (
                f"K({n}) = {terms} = {vals} = {full[n]}."
                if len(inc) > 1
                else f"K({n}) = {terms} = {full[n]}: в {n} ведёт только «{label(inc[0][1])}»."
            )
        frames.append((svg, cap))
    return frames


def ex_fill(start: int, target: int, cmds, must=(), forbid=()) -> str:
    """Step by step: each K(n) as the sum over the arrows that enter n."""
    return _stepper(fill_frames(start, target, cmds, must, forbid))


def ex_run(start: int, programs, cmds) -> str:
    """Programs executed command by command: each row starts at the same number, an
    arrow per command with its number and action, the trajectory bracketed under the
    results — the start is not part of it."""
    longest = max(len(p) for p in programs)
    gap, r, x0 = 74, 17, 64
    width = x0 + longest * gap + r + 16
    rh = 104
    out = [
        f'<svg viewBox="0 0 {width:.0f} {rh * len(programs) + 8:.0f}" role="img" aria-label="Выполнение программ">'
    ]
    for row, prog in enumerate(programs):
        y = 34 + row * rh
        out.append(_text(8, y + 5, prog, 16, ACCENT, "start", 700))
        xs, vals = [x0], [start]
        for ch in prog:
            vals.append(apply(cmds[int(ch) - 1], vals[-1]))
            xs.append(xs[-1] + gap)
        for i, ch in enumerate(prog):
            a, b = xs[i] + r, xs[i + 1] - r
            out.append(_arrow(a, y, (a + b) / 2, y, b, y, MUTED, 1.5))
            out.append(
                _text(
                    (a + b) / 2,
                    y - 9,
                    f"{ch}: {label(cmds[int(ch) - 1])}",
                    12,
                    MUTED,
                    "middle",
                    600,
                )
            )
        for i, (x, v) in enumerate(zip(xs, vals, strict=True)):
            fill = WASH if i == 0 else "#fff"
            out.append(
                f'<circle cx="{x:.1f}" cy="{y}" r="{r}" fill="{fill}" stroke="{MUTED if i == 0 else INK}" '
                f'stroke-width="1.4"/>'
            )
            out.append(_text(x, y + 5, str(v), 14, INK, "middle", 600))
        out.append(_text(xs[0], y + r + 20, "старт", 12, MUTED, "middle"))
        bx1, bx2 = xs[1] - r, xs[-1] + r
        out.append(
            f'<path d="M {bx1:.1f} {y + r + 8} v 6 H {bx2:.1f} v -6" fill="none" stroke="{ACCENT}" '
            f'stroke-width="1.4"/>'
        )
        traj = ", ".join(map(str, vals[1:]))
        out.append(
            _text((bx1 + bx2) / 2, y + r + 32, f"траектория: {traj}", 13, ACCENT, "middle", 600)
        )
    out.append("</svg>")
    return "".join(out)


def ex_tree(start: int, target: int, cmds) -> str:
    """All programs as a tree: success leaves in accent with the program under them,
    overshoot leaves grey and dashed."""
    up = target >= start

    def grow(x, code):
        kids = []
        for i, op in enumerate(cmds, 1):
            y = apply(op, x)
            if y is None:
                continue
            c = code + str(i)
            if y == target:
                kids.append((op, y, "ok", [], c))
            elif (y > target) == up:
                kids.append((op, y, "over", [], c))
            else:
                kids.append((op, y, "", grow(y, c), c))
        return kids

    root = (None, start, "", grow(start, ""), "")

    def leaves(node):
        return 1 if not node[3] else sum(leaves(k) for k in node[3])

    def depth(node):
        return 0 if not node[3] else 1 + max(depth(k) for k in node[3])

    nl, dp = leaves(root), depth(root)
    dx = 40.0  # narrow enough to fit a phone without scrolling
    dy = 62
    width = 32 + nl * dx
    height = 30 + dp * dy + 88
    lines, labels, nodes = [], [], []

    def place(node, d, left):
        cx = 16 + (left + leaves(node) / 2) * dx
        cy = 26 + d * dy
        lft = left
        for kid in node[3]:
            kx, ky = place(kid, d + 1, lft)
            lft += leaves(kid)
            faint = kid[2] == "over"
            lines.append(
                f'<line x1="{cx:.1f}" y1="{cy + 15:.1f}" x2="{kx:.1f}" y2="{ky - 15:.1f}" '
                f'stroke="{FAINT if faint else MUTED}" stroke-width="1.3"/>'
            )
            color = OVER if faint else MUTED
            labels.append(_halo((cx + kx) / 2, (cy + ky) / 2 + 4, label(kid[0]), 12, color, 500))
        nodes.append((cx, cy, node))
        return cx, cy

    place(root, 0, 0)
    out = [f'<svg viewBox="0 0 {width:.0f} {height:.0f}" role="img" aria-label="Дерево программ">']
    out += lines + labels
    for cx, cy, node in nodes:
        kind = node[2]
        if kind == "ok":
            stroke, sw, dash = ACCENT, 2.4, ""
        elif kind == "over":
            stroke, sw, dash = OVER, 1.3, ' stroke-dasharray="3 3"'
        else:
            stroke, sw, dash = INK, 1.4, ""
        out.append(
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="15" fill="#fff" stroke="{stroke}" '
            f'stroke-width="{sw}"{dash}/>'
        )
        out.append(
            _text(cx, cy + 5, str(node[1]), 13, MUTED if kind == "over" else INK, "middle", 600)
        )
        if kind == "ok":
            out.append(_text(cx, cy + 34, node[4], 13, ACCENT, "middle", 700))
    names = ", ".join(f"{i} — {label(op)}" for i, op in enumerate(cmds, 1))
    out.append(_text(width / 2, height - 28, f"команды: {names}", 13, MUTED, "middle"))
    out.append(_text(width / 2, height - 10, "пунктир — цель перепрыгнута", 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


EXECUTOR_FIGURES: dict = {
    "ex_tree": ex_tree,
    "ex_line": ex_line,
    "ex_fill": ex_fill,
    "ex_run": ex_run,
}
EXECUTOR_STEPPERS: dict = {"ex_fill": fill_frames}
EXECUTOR_WIDGETS: dict = {}
EXECUTOR_SCRIPTS: dict = {}
