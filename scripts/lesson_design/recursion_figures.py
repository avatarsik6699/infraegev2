"""Figures of topic 16 «Рекурсия» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.

``rec_unfold_stepper(n)`` — F(1) = 2, F(n) = F(n − 1) + 3n by hand: the
requests go down to the base, the pending calls wait with their «+ 3n», then
the results come back up.
``rec_chains(starts, delta, base, kind, lo)`` — chains of arguments on a
number line: where a chain reaches the base (n = base, n ≤ base or n ≥ base)
and where it jumps over it.
``rec_fill_order(n_up, top, n_down)`` — the order of a table: f[n] from
f[n − 1] and f[n − 2] left to right, f[n] from f[n + 1] right to left.
``rec_fib_tree(n)`` — the calls of the Fibonacci function without memory and
with ``@cache``, side by side.
``rec_diff(big, small)`` — F(big) contains F(small) and the added 3k; the
common part cancels in the difference.
``rec_doubling(starts, limit)`` — F(n) = n + F(2n): how many doublings each
start needs to pass the limit and the resulting G(n) = F(n) / n.
``rec_carry(n)`` — n and n + 1 digit by digit: trailing nines turn into
zeros, the digit before them grows by 1.
``rec_bound_prefixes(bound)`` — numbers up to a bound built left to right:
which first digits leave the rest free and which keep it tied to the bound.
"""

from __future__ import annotations

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stack_frame, _stepper, _text, ru_count

W = 660


def _num(n: int) -> str:
    """12 586 → «12 586», −4 → «−4»: thin spaces as in the lesson text."""
    s = f"{abs(n):,}".replace(",", " ")
    return ("−" if n < 0 else "") + s


# --- subtopic 1: unfolding F(4) -------------------------------------------


def rec_unfold_frames(n: int = 4) -> list[tuple[str, str]]:
    """F(1) = 2, F(n) = F(n − 1) + 3n: requests down, results up."""
    frames, stack = [], []
    for k in range(n, 0, -1):
        if k > 1:
            stack.append([f"F({k})", f"ждёт F({k - 1}), + {3 * k}", None])
            note = ("запрос", f"F({k}) = F({k - 1}) + {3 * k}")
            caption = (
                f"F({k}) = F({k - 1}) + 3 · {k}. Значения F({k - 1}) ещё нет, "
                f"поэтому F({k}) ждёт и помнит, что потом прибавит {3 * k}."
            )
        else:
            stack.append(["F(1)", "база: 2", None])
            note = ("база", "F(1) = 2")
            caption = "F(1) = 2 дано в условии — это база, новых запросов нет."
        frames.append((_stack_frame(stack, note), caption))
    value = 2
    for k in range(1, n + 1):
        if k > 1:
            value += 3 * k
        stack[-1][2] = value
        if k == 1:
            note = ("возврат", "F(1) = 2")
            caption = "F(1) возвращает 2 тому, кто его ждал, — вызову F(2)."
        else:
            note = ("возврат", f"F({k}) = {value - 3 * k} + {3 * k} = {value}")
            caption = (
                f"F({k}) получил F({k - 1}) = {value - 3 * k} и выполнил отложенное "
                f"действие: {value - 3 * k} + {3 * k} = {value}."
                + (" Стек пуст — ответ готов." if k == n else "")
            )
        frames.append((_stack_frame(stack, note), caption))
        stack.pop()
    return frames


def rec_unfold_stepper(n: int = 4) -> str:
    return _stepper(rec_unfold_frames(n))


# --- chains of arguments ----------------------------------------------------


def _chain(start: int, delta: int, base: int, kind: str, lo: int | None) -> tuple[list[int], bool]:
    seq = [start]
    while True:
        x = seq[-1]
        if (
            (kind == "eq" and x == base)
            or (kind == "le" and x <= base)
            or (kind == "ge" and x >= base)
        ):
            return seq, True
        if lo is not None and x + delta < lo:
            return seq, False
        seq.append(x + delta)


def _arc(x1: float, x2: float, y: float, color=INK) -> str:
    """A jump above the axis with an arrowhead at its end."""
    h = min(34.0, 10 + abs(x2 - x1) * 0.35)
    cx, cy = (x1 + x2) / 2, y - h
    tx, ty = x2 - cx, y - cy
    length = (tx * tx + ty * ty) ** 0.5
    ux, uy = tx / length, ty / length
    px, py = -uy * 4, ux * 4
    hx, hy = x2 - 8 * ux, y - 8 * uy
    return (
        f'<path d="M {x1:.1f} {y - 7} Q {cx:.1f} {cy:.1f} {hx:.1f} {hy - 7:.1f}" '
        f'fill="none" stroke="{color}" stroke-width="1.4"/>'
        f'<path d="M {x2:.1f} {y - 7} L {hx + px:.1f} {hy + py - 7:.1f} '
        f'L {hx - px:.1f} {hy - py - 7:.1f} Z" fill="{color}"/>'
    )


def rec_chains(starts, delta: int, base: int, kind: str = "eq", lo: int | None = None) -> str:
    """Chains start, start + delta, … on a number line; the base zone is washed."""
    chains = [(s, *_chain(s, delta, base, kind, lo)) for s in starts]
    values = [v for _, seq, _ in chains for v in seq] + [base]
    a, b = min(values), max(values)
    left, right = 64, W - 24
    step = (right - left) / max(1, b - a)

    def px(v: int) -> float:
        return left + (v - a) * step

    row = 92
    height = 34 + row * len(chains)
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-hidden="true">']
    for r, (s, seq, reached) in enumerate(chains):
        y = 70 + r * row
        if kind == "le":
            out.append(
                f'<rect x="{left - 8}" y="{y - 46}" width="{px(base) - left + 16:.1f}" '
                f'height="62" rx="6" fill="{WASH}"/>'
            )
        elif kind == "ge":
            out.append(
                f'<rect x="{px(base) - 8:.1f}" y="{y - 46}" width="{right - px(base) + 16:.1f}" '
                f'height="62" rx="6" fill="{WASH}"/>'
            )
        if kind in ("le", "ge"):
            sign = "≤" if kind == "le" else "≥"
            zx = (left + px(base)) / 2 if kind == "le" else (px(base) + right) / 2
            out.append(_text(zx, y - 30, f"база: n {sign} {_num(base)}", 12, MUTED, "middle"))
        out.append(
            f'<line x1="{left - 10}" y1="{y}" x2="{right + 10}" y2="{y}" stroke="{FAINT}" '
            'stroke-width="1.25"/>'
        )
        tick = 1 if b - a <= 26 else 5
        for v in range(a, b + 1):
            if v % tick == 0 or v in seq:
                out.append(
                    f'<line x1="{px(v):.1f}" y1="{y - 3}" x2="{px(v):.1f}" y2="{y + 3}" '
                    f'stroke="{MUTED}"/>'
                )
                out.append(_text(px(v), y + 19, _num(v), 12, INK if v in seq else MUTED, "middle"))
        for x1, x2 in zip(seq, seq[1:], strict=False):
            out.append(_arc(px(x1), px(x2), y))
        for v in seq:
            end = v == seq[-1]
            colour = ACCENT if end and reached else INK
            out.append(
                f'<circle cx="{px(v):.1f}" cy="{y}" r="4.5" fill="#fff" stroke="{colour}" '
                f'stroke-width="{2 if end else 1.5}"/>'
            )
        steps = len(seq) - 1
        if reached:
            note = f"F({_num(s)}): {ru_count(steps, 'переход', 'перехода', 'переходов')} до базы F({_num(seq[-1])})"
        else:
            note = f"F({_num(s)}): аргументы {', '.join(_num(v) for v in seq)}, … — база F({_num(base)}) пропущена"
        out.append(_text(left - 8, y - 52, note, 13, INK if reached else ACCENT, weight=500))
    if kind == "eq":
        for r in range(len(chains)):
            y = 70 + r * row
            out.append(
                f'<circle cx="{px(base):.1f}" cy="{y}" r="9" fill="none" stroke="{ACCENT}" '
                'stroke-dasharray="3 2"/>'
            )
    out.append("</svg>")
    return "".join(out)


# --- subtopic 3: order of a table ---------------------------------------------


def rec_fill_order(n_up: int = 6, top: int = 10, n_down: int = 7) -> str:
    """Two tables: F(n) = F(n − 1) + 2F(n − 2) left to right and
    F(n) = n + F(n + 1) right to left; arrows show what each cell uses."""
    up = {1: 1, 2: 3}
    for k in range(3, n_up + 1):
        up[k] = up[k - 1] + 2 * up[k - 2]
    down = {top: 1}
    for k in range(top - 1, 0, -1):
        down[k] = k + down[k + 1]
    cell, gap = 62, 8
    out = [f'<svg viewBox="0 0 {W} 300" role="img" aria-hidden="true">']

    def row(values: dict, keys: list[int], y: int, hot: int, uses: list[int], title: str):
        x0 = 24
        out.append(_text(x0, y - 44, title, 14, INK, weight=600))
        for i, k in enumerate(keys):
            x = x0 + i * (cell + gap)
            ready = k in values
            fill = WASH if k in uses else "#fff"
            stroke = ACCENT if k == hot else INK
            out.append(
                f'<rect x="{x}" y="{y}" width="{cell}" height="40" rx="6" fill="{fill}" '
                f'stroke="{stroke}" stroke-width="{2 if k == hot else 1.25}"/>'
            )
            out.append(_text(x + cell / 2, y - 8, f"f[{k}]", 12, MUTED, "middle"))
            out.append(
                _text(x + cell / 2, y + 26, _num(values[k]) if ready else "", 15, INK, "middle")
            )
        hx = x0 + keys.index(hot) * (cell + gap) + cell / 2
        for u in uses:
            ux = x0 + keys.index(u) * (cell + gap) + cell / 2
            mid = (ux + hx) / 2
            out.append(
                f'<path d="M {ux:.1f} {y + 42} Q {mid:.1f} {y + 70} {hx:.1f} {y + 44}" '
                f'fill="none" stroke="{ACCENT}" stroke-width="1.4"/>'
            )
            out.append(f'<path d="M {hx:.1f} {y + 42} l -4 9 l 8 0 Z" fill="{ACCENT}"/>')

    keys = list(range(1, n_up + 1))
    shown = {k: v for k, v in up.items() if k <= n_up}
    row(
        shown,
        keys,
        58,
        n_up,
        [n_up - 1, n_up - 2],
        f"F(n) = F(n − 1) + 2F(n − 2): слева направо, f[{n_up}] = {shown[n_up - 1]} + 2 · {shown[n_up - 2]} = {shown[n_up]}",
    )
    keys = list(range(n_down, top + 1))
    shown = {k: down[k] for k in keys}
    row(
        shown,
        keys,
        200,
        n_down,
        [n_down + 1],
        f"F(n) = n + F(n + 1): справа налево от f[{top}] = {down[top]}, f[{n_down}] = {n_down} + {down[n_down + 1]} = {down[n_down]}",
    )
    out.append("</svg>")
    return "".join(out)


# --- subtopic 4: Fibonacci calls ---------------------------------------------


def _fib_tree(k: int, memo: set, cache: bool):
    if cache and k in memo:
        return (k, True, [])
    kids = [] if k <= 2 else [_fib_tree(k - 1, memo, cache), _fib_tree(k - 2, memo, cache)]
    memo.add(k)
    return (k, False, kids)


def _layout(tree) -> dict:
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


def fib_calls(n: int, cache: bool) -> tuple[int, int]:
    """(all calls, calls that computed) of F(n) = F(n − 1) + F(n − 2)."""
    pos = _layout(_fib_tree(n, set(), cache))
    return len(pos), sum(1 for p in pos.values() if not p[3])


def rec_fib_tree(n: int = 5) -> str:
    """The call trees of F(n) without and with @cache, side by side."""
    half = W / 2
    inset = 30
    out, height = [], 0
    for k, cache in enumerate((False, True)):
        pos = _layout(_fib_tree(n, set(), cache))
        leaves = 1 + max(p[0] for p in pos.values())
        step = (half - 2 * inset) / (leaves - 1) if leaves > 1 else 0
        x0 = k * half + inset

        def px(x, x0=x0, step=step):
            return x0 + x * step

        def py(depth):
            return 70 + depth * 58

        calls, computed = len(pos), sum(1 for p in pos.values() if not p[3])
        note = ru_count(calls, "вызов", "вызова", "вызовов")
        if cache:
            note += f", вычислено {computed}"
        out.append(
            _text(
                k * half + 16, 22, "с @cache" if cache else "без запоминания", 15, INK, "start", 600
            )
        )
        out.append(_text(k * half + 16, 42, note, 13, MUTED))
        for x, d, _v, _mem, ids in pos.values():
            for i in ids:
                out.append(
                    f'<line x1="{px(x):.1f}" y1="{py(d) + 12}" x2="{px(pos[i][0]):.1f}" '
                    f'y2="{py(pos[i][1]) - 12}" stroke="{FAINT}" stroke-width="1.25"/>'
                )
        repeats = {}
        if not cache:
            for p in pos.values():
                repeats[p[2]] = repeats.get(p[2], 0) + 1
        for x, d, v, mem, _ids in pos.values():
            label = f"F({v})"
            tw = 40
            dash = ' stroke-dasharray="4 3"' if mem else ""
            again = not cache and v == n - 2 and repeats.get(v, 0) > 1
            stroke = MUTED if mem else (ACCENT if again else INK)
            out.append(
                f'<rect x="{px(x) - tw / 2:.1f}" y="{py(d) - 12}" width="{tw}" height="24" rx="6" '
                f'fill="{WASH if mem else "#fff"}" stroke="{stroke}" stroke-width="1.25"{dash}/>'
            )
            out.append(_text(px(x), py(d) + 4, label, 12, MUTED if mem else INK, "middle"))
            height = max(height, py(d) + 20)
        if cache:
            out.append(
                _text(k * half + 16, height + 18, "пунктир — ответ взят из памяти", 13, MUTED)
            )
        else:
            out.append(
                _text(
                    k * half + 16,
                    height + 18,
                    f"F({n - 2}) вычисляется {repeats[n - 2]} раза",
                    13,
                    ACCENT,
                )
            )
    height += 30
    out.insert(0, f'<line x1="{half}" y1="8" x2="{half}" y2="{height - 8}" stroke="{FAINT}"/>')
    return (
        f'<svg viewBox="0 0 {W} {height}" role="img" '
        f'aria-label="Дерево вызовов F({n}) без запоминания и с запоминанием">'
        + "".join(out)
        + "</svg>"
    )


# --- subtopic 5: a difference that cancels -------------------------------------


def rec_diff(big: int = 2026, small: int = 2023) -> str:
    """F(n) = F(n − 1) + 3n: F(big) is F(small) plus the added 3k."""
    adds = [3 * k for k in range(small + 1, big + 1)]
    common_w, seg = 220, (W - 24 - 120 - 220) / len(adds)
    x0 = 120
    out = [f'<svg viewBox="0 0 {W} 196" role="img" aria-hidden="true">']
    for y, label, parts in ((40, f"F({big})", adds), (110, f"F({small})", [])):
        out.append(_text(16, y + 26, label, 15, INK, weight=600))
        out.append(
            f'<rect x="{x0}" y="{y}" width="{common_w}" height="40" rx="6" fill="{WASH}" '
            f'stroke="{MUTED}" stroke-width="1.25"/>'
        )
        out.append(_text(x0 + common_w / 2, y + 26, f"F({small})", 14, MUTED, "middle"))
        for i, v in enumerate(parts):
            x = x0 + common_w + i * seg
            out.append(
                f'<rect x="{x + 4:.1f}" y="{y}" width="{seg - 4:.1f}" height="40" rx="6" '
                f'fill="#fff" stroke="{ACCENT}" stroke-width="1.5"/>'
            )
            k = small + 1 + i
            out.append(_text(x + seg / 2 + 2, y + 18, f"3 · {k}", 12, MUTED, "middle"))
            out.append(_text(x + seg / 2 + 2, y + 34, _num(v), 14, INK, "middle"))
    out.append(
        f'<line x1="{x0 + common_w + 2}" y1="96" x2="{x0 + common_w + 2}" y2="160" '
        f'stroke="{ACCENT}" stroke-dasharray="4 3"/>'
    )
    out.append(
        _text(
            x0 + common_w + 14,
            134,
            f"разность: {' + '.join(_num(v) for v in adds)}",
            14,
            ACCENT,
            weight=500,
        )
    )
    out.append(_text(x0 + common_w + 14, 156, f"= {_num(sum(adds))}", 14, ACCENT, weight=500))
    out.append(_text(x0, 186, "общая часть одинакова в обоих значениях и сокращается", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


def rec_doubling(starts=(6, 7, 12, 13), limit: int = 100, mark: int = 7) -> str:
    """F(n) = n + F(2n) up to the limit: doublings and G(n) = F(n) / n."""
    rows = []
    for s in starts:
        seq = [s]
        while seq[-1] <= limit:
            seq.append(seq[-1] * 2)
        rows.append(seq)

    def g_of(s: int) -> int:
        seq = [s]
        while seq[-1] <= limit:
            seq.append(seq[-1] * 2)
        return sum(seq) // s

    target = g_of(mark)
    box, gap = 58, 14
    height = 30 + 52 * len(rows)
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-hidden="true">']
    for r, seq in enumerate(rows):
        y = 20 + r * 52
        for i, v in enumerate(seq):
            x = 16 + i * (box + gap)
            over = v > limit
            out.append(
                f'<rect x="{x}" y="{y}" width="{box}" height="34" rx="6" fill="{WASH if over else "#fff"}" '
                f'stroke="{ACCENT if over else INK}" stroke-width="{1.5 if over else 1.25}"/>'
            )
            out.append(_text(x + box / 2, y + 22, _num(v), 14, INK, "middle"))
            if i:
                out.append(
                    f'<line x1="{x - gap + 2}" y1="{y + 17}" x2="{x - 3}" y2="{y + 17}" stroke="{MUTED}"/>'
                    f'<path d="M {x - 2} {y + 17} l -6 -3.5 l 0 7 Z" fill="{MUTED}"/>'
                )
        k = len(seq) - 1
        total = sum(seq)
        g = total // seq[0]
        out.append(
            _text(
                16 + 6 * (box + gap) + 8,
                y + 22,
                f"{ru_count(k, 'удвоение', 'удвоения', 'удвоений')}, G = {g}",
                14,
                ACCENT if g == target else MUTED,
                weight=500 if g == target else 400,
            )
        )
    out.append("</svg>")
    return "".join(out)


# --- subtopic 6: carry and digits of a bound ---------------------------------------


def rec_carry(n: int = 2399) -> str:
    """n and n + 1 digit by digit; trailing nines become zeros."""
    a, b = str(n), str(n + 1)
    width = max(len(a), len(b))
    a, b = a.rjust(width), b.rjust(width)
    t = len(a) - len(a.rstrip("9"))
    cell = 50
    x0 = 150
    out = [f'<svg viewBox="0 0 {W} 200" role="img" aria-hidden="true">']
    for y, digits, label in ((24, a, f"n = {n}"), (100, b, f"n + 1 = {n + 1}")):
        out.append(_text(16, y + 30, label, 14, INK, weight=600))
        for i, d in enumerate(digits):
            if d == " ":
                continue
            x = x0 + i * (cell + 6)
            hot = i >= width - t - 1
            out.append(
                f'<rect x="{x}" y="{y}" width="{cell}" height="46" rx="6" fill="#fff" '
                f'stroke="{ACCENT if hot else INK}" stroke-width="{1.6 if hot else 1.25}"/>'
            )
            out.append(_text(x + cell / 2, y + 30, d, 20, INK, "middle", 500))
        s = sum(int(d) for d in digits if d != " ")
        out.append(_text(x0 + width * (cell + 6) + 14, y + 30, f"сумма цифр {s}", 14, MUTED))
    for i in range(width - t - 1, width):
        x = x0 + i * (cell + 6) + cell / 2
        change = "+1" if i == width - t - 1 else "−9"
        out.append(_text(x, 88, change, 14, ACCENT, "middle", 600))
    sa = sum(int(d) for d in a if d != " ")
    sb = sum(int(d) for d in b if d != " ")
    out.append(
        _text(
            16,
            182,
            f"девяток в конце: {t}; изменение суммы 1 − 9 · {t} = {_num(sb - sa)}",
            14,
            ACCENT,
            weight=500,
        )
    )
    out.append("</svg>")
    return "".join(out)


def rec_bound_prefixes(bound: int = 250) -> str:
    """Numbers 000 … bound written with the same number of digits: a prefix
    smaller than the bound's prefix leaves the rest free."""
    digits = [int(c) for c in str(bound)]
    k = len(digits)
    out = [f'<svg viewBox="0 0 {W} {20 + 86 * k}" role="img" aria-hidden="true">']
    prefix = ""
    for level, top in enumerate(digits):
        y = 16 + level * 86
        rest = k - level - 1
        out.append(_text(16, y + 25, f"позиция {level + 1}", 13, MUTED))
        x = 100
        for d in range(top + 1):
            tight = d == top
            label = prefix + str(d) + "_" * rest
            w = 18 + 11 * len(label)
            out.append(
                f'<rect x="{x}" y="{y}" width="{w}" height="38" rx="6" '
                f'fill="{"#fff" if tight else WASH}" stroke="{ACCENT if tight else MUTED}" '
                f'stroke-width="{1.6 if tight else 1.1}"/>'
            )
            out.append(_text(x + w / 2, y + 25, label, 14, INK, "middle", 500))
            x += w + 8
        free = top * 10**rest
        if rest and top:
            note = (
                f"{ru_count(free, 'число', 'числа', 'чисел')} с началом меньше "
                f"{prefix + str(top)}: дальше любые цифры; {prefix + str(top)} — снова по границе"
            )
        elif rest:
            note = f"меньших начал нет: {prefix}0 — снова по границе"
        else:
            note = "последняя цифра — только 0" if top == 0 else f"последняя цифра — от 0 до {top}"
        out.append(_text(100, y + 60, note, 13, MUTED))
        prefix += str(top)
    out.append("</svg>")
    return "".join(out)


RECURSION_FIGURES: dict = {
    "rec_unfold_stepper": rec_unfold_stepper,
    "rec_chains": rec_chains,
    "rec_fill_order": rec_fill_order,
    "rec_fib_tree": rec_fib_tree,
    "rec_diff": rec_diff,
    "rec_doubling": rec_doubling,
    "rec_carry": rec_carry,
    "rec_bound_prefixes": rec_bound_prefixes,
}
RECURSION_STEPPERS: dict = {"rec_unfold_stepper": rec_unfold_frames}
RECURSION_WIDGETS: dict = {}
RECURSION_SCRIPTS: dict = {}
