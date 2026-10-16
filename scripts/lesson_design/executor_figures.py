"""Figures of topic 13 «Анализ хода исполнения алгоритма» (registered in figures.FIGURES).

A numeric executor of the lesson is run here: the same commands as on the page,
written as short codes, applied to the integers of the range. Every arrow, every
count W(n) under a number and every leaf of a tree comes from this execution.

Command codes: ``+k``, ``-k``, ``*k``, ``ax+b`` (``2x+1``), ``/k`` — exact
division, ``//k`` — division rounded down, ``ceil/k`` — rounded up, ``^2`` —
square, ``dD`` — append digit D on the right, ``swap`` — swap the two lowest
digits when the tens digit is less than the units digit.

``ex_tree(start, target, cmds)`` — the tree of all programs: success, overshoot.
``ex_line(start, target, cmds, must, forbid, path)`` — numbers of the range on a
line, every transition as an arrow, the number of programs W(n) under each.
``ex_fill(start, target, cmds, must, forbid)`` — step by step: W(n) of the next
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
    """W(n) for every n of the range. A mandatory number starts a new segment:
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


def _layout(nums: list[int], y: float, left: float = 46, right: float = W - 30):
    step = (right - left) / max(1, len(nums) - 1)
    return {n: (left + i * step, y) for i, n in enumerate(sorted(nums))}, step


def _arc(x1, x2, y, r, up: bool, color, width=1.6, dash="") -> str:
    h = min(90, 18 + abs(x2 - x1) * 0.32)
    cy = y - r - h if up else y + r + h
    y0 = y - r if up else y + r
    d = f' stroke-dasharray="{dash}"' if dash else ""
    # arrow head at the end
    ah = (
        f'<path d="M {x2 - 4:.1f} {y0 - (7 if up else -7):.1f} L {x2 + 4:.1f} {y0 - (7 if up else -7):.1f} '
        f'L {x2:.1f} {y0:.1f} Z" fill="{color}"/>'
    )
    return (
        f'<path d="M {x1:.1f} {y0:.1f} Q {(x1 + x2) / 2:.1f} {cy:.1f} {x2:.1f} {y0:.1f}" fill="none" '
        f'stroke="{color}" stroke-width="{width}"{d}/>' + ah
    )


def _line_svg(
    start, target, cmds, w, must=(), forbid=(), hot=None, hot_in=(), path=(), height=230, caption=""
) -> str:
    nums = _order(start, target)
    y = 120
    xy, step = _layout(nums, y)
    r = min(15, step * 0.38)
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Числа и переходы">']
    path_edges = set(zip(path, path[1:], strict=False))
    # commands: the first (usually +1 / −1) goes along the line, the others as arcs
    for x in nums:
        for k, op in enumerate(cmds):
            yv = apply(op, x)
            if yv is None or yv not in xy or yv == x:
                continue
            on_path = (x, yv) in path_edges
            is_hot = (x, op) in hot_in
            lo_, hi_ = sorted((x, yv))
            # useless: leaves a forbidden number or jumps over a mandatory one
            dead = x in forbid or any(lo_ < m < hi_ for m in must)
            color = (
                ACCENT if (on_path or is_hot) else (FAINT if dead else (INK if k == 0 else MUTED))
            )
            width = 2.4 if (on_path or is_hot) else 1.4
            (x1, _), (x2, _) = xy[x], xy[yv]
            if abs(nums.index(yv) - nums.index(x)) == 1 and k == 0:
                sgn = 1 if x2 > x1 else -1
                out.append(
                    f'<line x1="{x1 + sgn * r:.1f}" y1="{y}" x2="{x2 - sgn * (r + 3):.1f}" y2="{y}" '
                    f'stroke="{color}" stroke-width="{width}"/>'
                    f'<path d="M {x2 - sgn * r:.1f} {y} l {-sgn * 7:.1f} -4 l 0 8 Z" fill="{color}"/>'
                )
            else:
                out.append(_arc(x1, x2, y, r, k % 2 == 1, color, width))
    for n in nums:
        cx, cy = xy[n]
        stroke, sw, fill, dash = INK, 1.4, "#fff", ""
        if n in must:
            stroke, sw = ACCENT, 2.6
        if n in forbid:
            stroke, dash, fill = MUTED, ' stroke-dasharray="4 3"', WASH
        if n == hot:
            stroke, sw = ACCENT, 2.6
        out.append(
            f'<circle cx="{cx:.1f}" cy="{cy}" r="{r:.1f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{dash}/>'
        )
        fs = 13 if r < 13 else 14
        out.append(_text(cx, cy + 5, str(n), fs, INK, "middle", 600))
        if n in w:
            out.append(
                _text(cx, height - 34, str(w[n]), 15, ACCENT if n == hot else INK, "middle", 700)
            )
    out.append(_text(8, height - 34, "W", 13, MUTED, "start", 600))
    legend = "  ·  ".join(
        f"{label(op)}: {'по прямой' if k == 0 else ('дуга сверху' if k % 2 else 'дуга снизу')}"
        for k, op in enumerate(cmds)
    )
    out.append(_text(W / 2, height - 10, caption or legend, 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def ex_line(start: int, target: int, cmds, must=(), forbid=(), path=(), height: int = 230) -> str:
    """The range as a line: transitions and W(n) under every number."""
    w = counts(start, target, cmds, must, forbid)
    return _line_svg(start, target, cmds, w, must, forbid, path=tuple(path), height=height)


def fill_frames(start: int, target: int, cmds, must=(), forbid=()) -> list[tuple[str, str]]:
    full = counts(start, target, cmds, must, forbid)
    nums = _order(start, target)
    frames = []
    for i, n in enumerate(nums):
        shown = {m: full[m] for m in nums[: i + 1]}
        inc = [(x, op) for x, op in _incoming(n, start, target, cmds) if x in shown]
        svg = _line_svg(start, target, cmds, shown, must, forbid, hot=n, hot_in=tuple(inc))
        if i == 0:
            cap = f"W({n}) = 1: в старте одна пустая программа."
        elif n in forbid:
            cap = f"{n} запрещено: W({n}) = 0, из него никуда не идём."
        elif n in must and n != start:
            cap = f"W({n}) = {full[n]}: столько программ до обязательного {n}; дальше новый участок от {n}."
        elif not inc:
            cap = f"В {n} не ведёт ни одна команда: W({n}) = 0."
        else:
            terms = " + ".join(f"W({x})" for x, _ in inc)
            vals = " + ".join(str(shown[x]) for x, _ in inc)
            cap = (
                f"W({n}) = {terms} = {vals} = {full[n]}."
                if len(inc) > 1
                else f"W({n}) = {terms} = {full[n]}."
            )
        frames.append((svg, cap))
    return frames


def ex_fill(start: int, target: int, cmds, must=(), forbid=()) -> str:
    """Step by step: each W(n) as the sum over the arrows that enter n."""
    return _stepper(fill_frames(start, target, cmds, must, forbid))


def ex_tree(start: int, target: int, cmds, height: int = 330) -> str:
    """All programs as a tree: success leaves in accent, overshoot leaves grey."""
    up = target >= start

    def grow(x):
        kids = []
        for op in cmds:
            y = apply(op, x)
            if y is None:
                continue
            if y == target:
                kids.append((op, y, "ok", []))
            elif (y > target) == up and y != target:
                kids.append((op, y, "over", []))
            else:
                kids.append((op, y, "", grow(y)))
        return kids

    root = (None, start, "", grow(start))

    def leaves(node):
        return 1 if not node[3] else sum(leaves(k) for k in node[3])

    def depth(node):
        return 0 if not node[3] else 1 + max(depth(k) for k in node[3])

    nl, dp = leaves(root), depth(root)
    dx = (W - 40) / nl
    dy = (height - 70) / max(1, dp)
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Дерево программ">']
    nodes = []

    def place(node, d, left):
        n = leaves(node)
        cx = 20 + (left + n / 2) * dx
        cy = 30 + d * dy
        lft = left
        for k in node[3]:
            kx, ky = place(k, d + 1, lft)
            lft += leaves(k)
            out.append(
                f'<line x1="{cx:.1f}" y1="{cy + 14:.1f}" x2="{kx:.1f}" y2="{ky - 14:.1f}" stroke="{FAINT if k[2] == "over" else MUTED}" stroke-width="1.3"/>'
            )
            out.append(
                _text(
                    (cx + kx) / 2 + (6 if kx >= cx else -6),
                    (cy + ky) / 2 + 4,
                    label(k[0]),
                    13,
                    MUTED,
                    "start" if kx >= cx else "end",
                )
            )
        nodes.append((cx, cy, node))
        return cx, cy

    place(root, 0, 0)
    for cx, cy, node in nodes:
        kind = node[2]
        stroke = ACCENT if kind == "ok" else (FAINT if kind == "over" else INK)
        out.append(
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="14" fill="#fff" stroke="{stroke}" stroke-width="{2.4 if kind == "ok" else 1.4}"/>'
        )
        out.append(
            _text(cx, cy + 5, str(node[1]), 13, MUTED if kind == "over" else INK, "middle", 600)
        )
    ok = sum(1 for _, _, n in nodes if n[2] == "ok")
    out.append(
        _text(
            W / 2,
            height - 12,
            f"успешных листьев (программ): {ok} · серые — цель перепрыгнута",
            14,
            INK,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


EXECUTOR_FIGURES: dict = {"ex_tree": ex_tree, "ex_line": ex_line, "ex_fill": ex_fill}
EXECUTOR_STEPPERS: dict = {"ex_fill": fill_frames}
EXECUTOR_WIDGETS: dict = {}
EXECUTOR_SCRIPTS: dict = {}
