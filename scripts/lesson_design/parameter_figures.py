"""Figures of topic 15 «Законы математической логики» (registered in figures.FIGURES).

A formula of the lesson is written as a Python expression and evaluated here
for every value shown: the 0/1 in a grid, the class of every part of a number
line, the dangerous points of a lattice or of a row of integers come from this
evaluation, not from labels. The expressions are written by the lesson
authors in the topic files; available names: the variables of the figure,
``imp(p, q)`` — implication, ``DEL(n, m)`` — n is divisible by m.

``pf_grid(expr, xlo, xhi, As)`` — the formula for every x (columns) and every
candidate A (rows); false cells in accent, a verdict for every row.
``pf_line(P, Q, expr, lo, hi, A)`` — two segments and the parts of the line
that must belong to A, must not, or are free (two substitutions a = 0, a = 1).
``pf_bits(rows, nbits, hot)`` — binary digits of masks under their weights.
``pf_plane(cond, xmax, ymax, witness)`` — natural lattice, dangerous points.
``pf_set(lo, hi, pred, seg)`` — integers of a range, the dangerous ones marked.
"""

from __future__ import annotations

from fractions import Fraction

from figures import ACCENT, FAINT, INK, MUTED, WASH, _text

W = 660


def imp(p, q) -> bool:
    return (not p) or bool(q)


def DEL(n, m) -> bool:  # noqa: N802 — the name of the lesson
    return m != 0 and n % m == 0


def _ev(expr: str, **names) -> bool:
    return bool(eval(expr, {"__builtins__": {}, "imp": imp, "DEL": DEL}, names))  # noqa: S307


# --- one parameter for all x -----------------------------------------------------------


def pf_grid(expr: str, xlo: int, xhi: int, As, var: str = "x", height: int | None = None) -> str:
    """Rows — candidates A, columns — values xlo..xhi; a false cell is a counterexample."""
    xs, As = list(range(xlo, xhi + 1)), list(As)
    cw = min(40, (W - 70 - 180) / len(xs))
    rh = 34
    height = height or 52 + rh * len(As) + 30
    x0 = 70
    out = [
        f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Значения формулы для каждого x">'
    ]
    out.append(_text(x0 - 12, 34, var, 14, MUTED, "end", 600))
    for j, x in enumerate(xs):
        out.append(_text(x0 + j * cw + cw / 2, 34, str(x), 13, MUTED, "middle"))
    for i, a in enumerate(As):
        y = 46 + i * rh
        out.append(_text(x0 - 12, y + 22, f"A = {a}", 14, INK, "end", 600))
        bad = None
        for j, x in enumerate(xs):
            v = _ev(expr, **{var: x, "A": a})
            if not v and bad is None:
                bad = x
            out.append(
                f'<rect x="{x0 + j * cw + 2:.1f}" y="{y + 2}" width="{cw - 4:.1f}" height="{rh - 4}" rx="4" '
                f'fill="{"#fff" if v else WASH}" stroke="{FAINT if v else ACCENT}" stroke-width="{1 if v else 2}"/>'
            )
            out.append(
                _text(
                    x0 + j * cw + cw / 2,
                    y + 22,
                    "1" if v else "0",
                    14,
                    INK if v else ACCENT,
                    "middle",
                    600,
                )
            )
        verdict = f"верно при всех {var}" if bad is None else f"ложно при {var} = {bad}"
        out.append(
            _text(
                x0 + len(xs) * cw + 12,
                y + 22,
                verdict,
                14,
                INK if bad is None else ACCENT,
                "start",
                600,
            )
        )
    out.append("</svg>")
    return "".join(out)


# --- segments on a line --------------------------------------------------------------


KIND = {
    (False, True): "must",
    (True, False): "out",
    (True, True): "free",
    (False, False): "never",
}


def classify(P, Q, expr: str, lo, hi):
    """Points and open parts of [lo; hi] with their class: must / out / free / never."""
    ends = sorted({Fraction(v) for v in (*P, *Q) if lo <= v <= hi} | {Fraction(lo), Fraction(hi)})
    parts = []
    for k, e in enumerate(ends):
        parts.append((e, e))
        if k + 1 < len(ends):
            parts.append((e, ends[k + 1]))
    out = []
    for a, b in parts:
        x = (a + b) / 2
        p = P[0] <= x <= P[1]
        q = Q[0] <= x <= Q[1]
        f0 = _ev(expr, p=p, q=q, a=False)
        f1 = _ev(expr, p=p, q=q, a=True)
        out.append((a, b, KIND[(f0, f1)]))
    return out


def pf_line(P, Q, expr: str, lo, hi, A=None, height: int = 190) -> str:
    """P and Q above the axis, below — what the formula demands from A."""
    sx = (W - 80) / (hi - lo)

    def X(v):
        return 40 + (float(v) - lo) * sx

    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Отрезки и требования к A">']
    for name, seg, y in (("P", P, 26), ("Q", Q, 52)):
        out.append(
            f'<line x1="{X(seg[0]):.1f}" y1="{y}" x2="{X(seg[1]):.1f}" y2="{y}" stroke="{INK}" stroke-width="3"/>'
        )
        for v in seg:
            out.append(f'<circle cx="{X(v):.1f}" cy="{y}" r="4" fill="{INK}"/>')
        out.append(_text(X(seg[0]) - 10, y + 5, name, 14, INK, "end", 700))
    ay = 92
    out.append(
        f'<line x1="30" y1="{ay}" x2="{W - 30}" y2="{ay}" stroke="{MUTED}" stroke-width="1"/>'
    )
    for v in sorted({*P, *Q}):
        if lo <= v <= hi:
            out.append(
                f'<line x1="{X(v):.1f}" y1="{ay - 5}" x2="{X(v):.1f}" y2="{ay + 5}" stroke="{MUTED}"/>'
            )
            out.append(_text(X(v), ay + 20, str(v), 13, MUTED, "middle"))
    by = 126
    style = {
        "must": (ACCENT, 5, ""),
        "out": (MUTED, 2, ' stroke-dasharray="5 4"'),
        "free": (FAINT, 5, ""),
        "never": (INK, 2, ' stroke-dasharray="2 3"'),
    }
    for a, b, kind in classify(P, Q, expr, lo, hi):
        color, w, dash = style[kind]
        if a == b:
            out.append(
                f'<circle cx="{X(a):.1f}" cy="{by}" r="{4.5 if kind == "must" else 3.5}" fill="{color}"/>'
            )
        else:
            out.append(
                f'<line x1="{X(a) + 5:.1f}" y1="{by}" x2="{X(b) - 5:.1f}" y2="{by}" stroke="{color}" stroke-width="{w}"{dash}/>'
            )
    if A is not None:
        out.append(
            f'<path d="M {X(A[0]):.1f} {by + 14} v 8 H {X(A[1]):.1f} v -8" fill="none" stroke="{INK}" stroke-width="1.6"/>'
        )
        out.append(
            _text((X(A[0]) + X(A[1])) / 2, by + 38, f"A = [{A[0]}; {A[1]}]", 13, INK, "middle", 600)
        )
    out.append(
        _text(
            W / 2,
            height - 8,
            "оранжевое — обязательно в A · пунктир — нельзя · серое — свободно",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- bits ----------------------------------------------------------------------------


def pf_bits(rows, nbits: int = 5, hot=(), height: int | None = None) -> str:
    """rows: (label, value); hot — weights whose column is framed."""
    cw = 52
    x0 = W - 30 - nbits * cw
    rh = 34
    height = height or 50 + rh * len(rows) + 10
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Двоичные разряды">']
    for j in range(nbits):
        w = 2 ** (nbits - 1 - j)
        out.append(
            _text(
                x0 + j * cw + cw / 2, 30, str(w), 13, ACCENT if w in hot else MUTED, "middle", 600
            )
        )
        if w in hot:
            out.append(
                f'<rect x="{x0 + j * cw + 3}" y="38" width="{cw - 6}" height="{rh * len(rows) + 4}" rx="6" '
                f'fill="none" stroke="{ACCENT}" stroke-width="2"/>'
            )
    for i, (label, value) in enumerate(rows):
        y = 40 + i * rh
        out.append(_text(x0 - 16, y + 22, label, 14, INK, "end", 600))
        for j in range(nbits):
            bit = (value >> (nbits - 1 - j)) & 1
            out.append(
                _text(
                    x0 + j * cw + cw / 2,
                    y + 22,
                    str(bit),
                    16,
                    INK if bit else FAINT,
                    "middle",
                    700 if bit else 400,
                )
            )
    out.append("</svg>")
    return "".join(out)


# --- lattice -------------------------------------------------------------------------


def pf_plane(
    cond: str, xmax: int, ymax: int, witness=None, note: str = "", height: int = 330
) -> str:
    """Natural points 1..xmax × 1..ymax; dangerous points (cond true) in ink."""
    left, bottom, top = 46, height - 50, 18
    sx = (W - left - 30) / xmax
    sy = (bottom - top) / ymax

    def P(x, y):
        return left + x * sx, bottom - y * sy

    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Опасные точки решётки">']
    out.append(f'<line x1="{left}" y1="{bottom}" x2="{W - 20}" y2="{bottom}" stroke="{MUTED}"/>')
    out.append(f'<line x1="{left}" y1="{bottom}" x2="{left}" y2="{top - 6}" stroke="{MUTED}"/>')
    out.append(_text(W - 18, bottom + 16, "x", 13, MUTED, "end", 600))
    out.append(_text(left + 8, top - 2, "y", 13, MUTED, "start", 600))
    n = 0
    for x in range(1, xmax + 1):
        if x % 5 == 0 or x == 1:
            out.append(_text(P(x, 0)[0], bottom + 16, str(x), 13, MUTED, "middle"))
        for y in range(1, ymax + 1):
            cx, cy = P(x, y)
            danger = _ev(cond, x=x, y=y)
            n += danger
            out.append(
                f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{3.6 if danger else 2}" fill="{INK if danger else FAINT}"/>'
            )
    for y in range(1, ymax + 1):
        if y % 5 == 0 or y == 1:
            out.append(_text(left - 8, P(0, y)[1] + 4, str(y), 13, MUTED, "end"))
    if witness:
        cx, cy = P(*witness)
        out.append(
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="8" fill="none" stroke="{ACCENT}" stroke-width="2.4"/>'
        )
        out.append(
            _text(cx + 12, cy - 8, f"({witness[0]}; {witness[1]})", 13, ACCENT, "start", 700)
        )
    out.append(_text(W / 2, height - 12, note or f"опасных точек: {n}", 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


# --- integers of a range -------------------------------------------------------------


def pf_set(lo: int, hi: int, pred: str, seg=None, note: str = "", height: int = 150) -> str:
    """Integers lo..hi as ticks; those where pred(x) is true are the dangerous set."""
    sx = (W - 80) / (hi - lo)

    def X(v):
        return 40 + (v - lo) * sx

    y = 70
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Опасные числа">']
    out.append(f'<line x1="30" y1="{y}" x2="{W - 30}" y2="{y}" stroke="{MUTED}"/>')
    hot = [v for v in range(lo, hi + 1) if _ev(pred, x=v)]
    for v in range(lo, hi + 1):
        out.append(
            f'<line x1="{X(v):.1f}" y1="{y - 4}" x2="{X(v):.1f}" y2="{y + 4}" stroke="{FAINT}"/>'
        )
    for v in (lo, hi):
        out.append(_text(X(v), y + 22, str(v), 13, MUTED, "middle"))
    if seg:
        out.append(
            f'<path d="M {X(seg[0]):.1f} {y - 24} v -8 H {X(seg[1]):.1f} v 8" fill="none" stroke="{INK}" stroke-width="1.6"/>'
        )
        out.append(
            _text(
                (X(seg[0]) + X(seg[1])) / 2, y - 38, f"[{seg[0]}; {seg[1]}]", 13, INK, "middle", 600
            )
        )
    for v in hot:
        out.append(
            f'<circle cx="{X(v):.1f}" cy="{y}" r="5.5" fill="#fff" stroke="{ACCENT}" stroke-width="2.4"/>'
        )
        if len(hot) <= 12:
            out.append(_text(X(v), y + 22, str(v), 13, ACCENT, "middle", 700))
    out.append(_text(W / 2, height - 12, note or f"опасных чисел: {len(hot)}", 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


PARAMETER_FIGURES: dict = {
    "pf_grid": pf_grid,
    "pf_line": pf_line,
    "pf_bits": pf_bits,
    "pf_plane": pf_plane,
    "pf_set": pf_set,
}
PARAMETER_STEPPERS: dict = {}
PARAMETER_WIDGETS: dict = {}
PARAMETER_SCRIPTS: dict = {}
