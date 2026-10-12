"""Figures of topic 9 «Обработка таблицы» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.

``tb_minus(rows)`` — S − m − M crosses out one cell with the minimum and one with
the maximum; when a row repeats its extremes, a second line crosses out every
cell equal to them, which is another operation.
``tb_groups(rows)`` — equal values of a row joined by a bracket, the frequency of
its value under every cell and the structure of repeats (3 + 2 + 1 + 1).
``tb_pairs(values)`` — the three ways to split four numbers into two pairs, sorted
a ≤ b ≤ c ≤ d: only «a + d against b + c» can be equal.
``tb_triangle(sides)`` — sorted sides a ≤ b ≤ c: a and b laid end to end along c
fall short, just reach it or overlap it.
``tb_scope(table, r, c)`` — where the value of one cell is counted: its row, its
column, the whole table; occurrences counted in each area.
``tb_neighbours(rows, cols)`` — neighbours of a corner, an edge and an inner cell
of a table: 3, 5 and 8 cells.
"""

from __future__ import annotations

from collections import Counter

from figures import ACCENT, FAINT, INK, MUTED, WASH, _text

CELL, GAP = 52, 6


def _minus(x: int) -> str:
    return str(x).replace("-", "−")


def _cell(x, y, label, w=CELL, h=40, hot=False, faint=False, crossed=False, size=17) -> str:
    stroke = ACCENT if hot else (FAINT if faint or crossed else INK)
    fill = WASH if faint or crossed else "#fff"
    out = (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w}" height="{h}" rx="6" fill="{fill}" '
        f'stroke="{stroke}" stroke-width="{2 if hot else 1.5}"/>'
        + _text(x + w / 2, y + h * 0.66, label, size, MUTED if crossed else INK, "middle", 600)
    )
    if crossed:
        out += (
            f'<line x1="{x + 8:.1f}" y1="{y + h - 8:.1f}" x2="{x + w - 8:.1f}" y2="{y + 8:.1f}" '
            f'stroke="{ACCENT}" stroke-width="2" stroke-linecap="round"/>'
        )
    return out


def _plural(n: int, one: str, few: str, many: str) -> str:
    if n % 10 == 1 and n % 100 != 11:
        return one
    if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14:
        return few
    return many


def _sum_text(values: list[int]) -> str:
    if not values:
        return "ничего, сумма 0"
    if len(values) == 1:
        return _minus(values[0])
    return f"{' + '.join(_minus(v) for v in values)} = {_minus(sum(values))}"


# --- the sum of the rest ------------------------------------------------------------


def tb_minus(rows: list[list[int]] | None = None) -> str:
    rows = rows or [[2, 2, 5, 9, 9], [4, 4, 4, 4, 4]]
    lines: list[tuple[str, list[int], set[int]]] = []
    for a in rows:
        lo, hi = a.index(min(a)), len(a) - 1 - a[::-1].index(max(a))
        if lo == hi:  # one element only: nothing left to choose from
            hi = next(i for i in range(len(a)) if i != lo)
        lines.append(("S − m − M", a, {lo, hi}))
        if min(a) != max(a) and (a.count(min(a)) > 1 or a.count(max(a)) > 1):
            every = {i for i, x in enumerate(a) if x in (min(a), max(a))}
            lines.append(("все равные m и M", a, every))
    row_h = 66
    height = 16 + len(lines) * row_h
    out = [
        f'<svg viewBox="0 0 660 {height}" role="img" aria-label="Какие ячейки убирает S − m − M">'
    ]
    for k, (label, a, gone) in enumerate(lines):
        y = 14 + k * row_h
        out.append(_text(10, y + 26, label, 14, MUTED if "все" in label else INK, weight=600))
        x0 = 168
        for i, x in enumerate(a):
            out.append(_cell(x0 + i * (CELL + GAP), y, _minus(x), crossed=i in gone))
        rest = [x for i, x in enumerate(a) if i not in gone]
        out.append(
            _text(x0 + len(a) * (CELL + GAP) + 6, y + 26, "остаётся " + _sum_text(rest), 14, INK)
        )
    out.append("</svg>")
    return "".join(out)


# --- groups of equal values ---------------------------------------------------------


def structure(a: list[int]) -> list[int]:
    return sorted(Counter(a).values(), reverse=True)


def tb_groups(rows: list[list[int]] | None = None) -> str:
    rows = rows or [[4, 4, 4, 7, 7, 2, 9]]
    blocks = []
    for a in rows:
        counts = Counter(a)
        groups = [v for v in dict.fromkeys(a) if counts[v] > 1]
        blocks.append((a, counts, groups))
    heights = [40 + 26 + 16 * max(1, len(g)) + 30 for _, _, g in blocks]
    out = [
        f'<svg viewBox="0 0 660 {sum(heights) + 10}" role="img" '
        'aria-label="Группы одинаковых значений строки">'
    ]
    y = 10
    for (a, counts, groups), h in zip(blocks, heights, strict=True):
        x0 = 20
        step = CELL + GAP
        for i, x in enumerate(a):
            out.append(_cell(x0 + i * step, y, _minus(x)))
            out.append(
                _text(x0 + i * step + CELL / 2, y + 60, str(counts[x]), 14, MUTED, "middle", 600)
            )
        for level, v in enumerate(groups):
            places = [i for i, x in enumerate(a) if x == v]
            ly = y + 76 + level * 16
            left = x0 + places[0] * step + CELL / 2
            right = x0 + places[-1] * step + CELL / 2
            out.append(
                f'<line x1="{left:.1f}" y1="{ly:.1f}" x2="{right:.1f}" y2="{ly:.1f}" '
                f'stroke="{INK}" stroke-width="1.5"/>'
            )
            for i in places:
                cx = x0 + i * step + CELL / 2
                out.append(
                    f'<line x1="{cx:.1f}" y1="{ly - 6:.1f}" x2="{cx:.1f}" y2="{ly:.1f}" '
                    f'stroke="{INK}" stroke-width="1.5"/>'
                )
            out.append(
                _text(
                    right + 8,
                    ly + 5,
                    f"{_minus(v)}: {counts[v]} {_plural(counts[v], 'раз', 'раза', 'раз')}",
                    12.5,
                    MUTED,
                    weight=600,
                )
            )
        sx = x0 + len(a) * step + 14
        out.append(_text(sx, y + 18, "структура", 13, MUTED))
        out.append(_text(sx, y + 40, " + ".join(map(str, structure(a))), 17, ACCENT, weight=600))
        out.append(_text(sx, y + 60, "частота под ячейкой", 12, MUTED))
        y += h
    out.append("</svg>")
    return "".join(out)


# --- two pairs with equal sums ----------------------------------------------------


def tb_pairs(values: list[int] | None = None) -> str:
    values = values or [7, 3, 8, 4]
    a, b, c, d = sorted(values)
    splits = [((a, b), (c, d)), ((a, c), (b, d)), ((a, d), (b, c))]
    unit = 200 / max(c + d, b + d, a + d, b + c)
    out = [
        '<svg viewBox="0 0 660 250" role="img" aria-label="Три разбиения четырёх чисел на пары">'
    ]
    out.append(_text(20, 24, f"после сортировки: {a} ≤ {b} ≤ {c} ≤ {d}", 15, INK, weight=600))
    for k, (left, right) in enumerate(splits):
        y = 52 + k * 64
        sl, sr = sum(left), sum(right)
        equal = sl == sr
        for side, (pair, s, x0) in enumerate(((left, sl, 20), (right, sr, 340))):
            color = ACCENT if equal else (MUTED if side == 0 else INK)
            out.append(_text(x0, y + 14, f"{pair[0]} + {pair[1]} = {s}", 14, color, weight=600))
            out.append(
                f'<rect x="{x0}" y="{y + 22}" width="{s * unit:.1f}" height="14" rx="4" '
                f'fill="{WASH}" stroke="{color}" stroke-width="1.5"/>'
            )
        sign = "=" if equal else ("<" if sl < sr else ">")
        out.append(_text(300, y + 34, sign, 20, ACCENT if equal else INK, "middle", 600))
    out.append(
        _text(
            20,
            242,
            "в первых двух разбиениях левая пара меньше или равна правой при любых числах",
            12.5,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- triangle sides -----------------------------------------------------------------


def tb_triangle(sides: list[list[int]] | None = None) -> str:
    sides = sides or [[4, 6, 10], [4, 5, 7]]
    longest = max(max(sum(sorted(t)[:2]), max(t)) for t in sides)
    unit = 380 / longest
    row_h = 92
    out = [
        f'<svg viewBox="0 0 660 {20 + len(sides) * row_h}" role="img" '
        'aria-label="Две меньшие стороны вдоль наибольшей">'
    ]
    for k, triple in enumerate(sides):
        a, b, c = sorted(triple)
        y = 30 + k * row_h
        x0 = 140
        out.append(_text(20, y + 26, f"{a}, {b}, {c}", 17, INK, weight=600))
        out.append(
            f'<line x1="{x0}" y1="{y + 32}" x2="{x0 + c * unit:.1f}" y2="{y + 32}" '
            f'stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
        )
        out.append(_text(x0 + c * unit + 10, y + 37, f"c = {c}", 14, INK))
        out.append(
            f'<line x1="{x0}" y1="{y + 12}" x2="{x0 + a * unit:.1f}" y2="{y + 12}" '
            f'stroke="{MUTED}" stroke-width="4" stroke-linecap="round"/>'
        )
        out.append(
            f'<line x1="{x0 + a * unit + 4:.1f}" y1="{y + 12}" x2="{x0 + (a + b) * unit:.1f}" '
            f'y2="{y + 12}" stroke="{ACCENT}" stroke-width="4" stroke-linecap="round"/>'
        )
        out.append(_text(x0 + a * unit / 2, y + 2, f"a = {a}", 13, MUTED, "middle"))
        out.append(_text(x0 + a * unit + b * unit / 2, y + 2, f"b = {b}", 13, ACCENT, "middle"))
        if a + b > c:
            verdict = f"{a} + {b} = {a + b} > {c}: стороны можно согнуть — треугольник есть"
        elif a + b == c:
            verdict = f"{a} + {b} = {c}: стороны лягут на одну прямую — треугольник вырожден"
        else:
            verdict = f"{a} + {b} = {a + b} < {c}: стороны не дотянутся — треугольника нет"
        out.append(_text(x0, y + 62, verdict, 13, MUTED))
    out.append("</svg>")
    return "".join(out)


# --- where a value is counted -------------------------------------------------------

SMALL = 30


def _grid(table, x0, y0, r, c, area) -> tuple[str, int]:
    """One small copy of the table: the area washed, equal values outlined."""
    x = table[r][c]
    out, found = [], 0
    for i, row in enumerate(table):
        for j, v in enumerate(row):
            inside = area(i, j)
            same = inside and v == x
            found += same
            cx, cy = x0 + j * SMALL, y0 + i * SMALL
            stroke = ACCENT if same else (INK if inside else FAINT)
            out.append(
                f'<rect x="{cx}" y="{cy}" width="{SMALL - 3}" height="{SMALL - 3}" rx="4" '
                f'fill="{WASH if inside else "#fff"}" stroke="{stroke}" '
                f'stroke-width="{2.5 if (i, j) == (r, c) else 1.4}"/>'
            )
            out.append(
                _text(cx + (SMALL - 3) / 2, cy + 19, str(v), 13, INK if inside else MUTED, "middle")
            )
    return "".join(out), found


def tb_scope(table: list[list[int]] | None = None, r: int = 1, c: int = 1) -> str:
    table = table or [
        [3, 1, 4, 2],
        [4, 4, 5, 1],
        [2, 4, 3, 4],
        [5, 2, 1, 3],
        [1, 4, 2, 5],
    ]
    areas = [
        ("в своей строке", lambda i, j: i == r),
        ("в своём столбце", lambda i, j: j == c),
        ("во всей таблице", lambda i, j: True),
    ]
    width = len(table[0]) * SMALL
    height = len(table) * SMALL
    out = [
        f'<svg viewBox="0 0 660 {height + 92}" role="img" '
        'aria-label="Где считается значение ячейки">'
    ]
    counts = []
    for k, (label, area) in enumerate(areas):
        x0 = 30 + k * (width + 90)
        out.append(_text(x0 + width / 2, 20, label, 14, INK, "middle", 600))
        grid, found = _grid(table, x0, 32, r, c, area)
        counts.append(found)
        out.append(grid)
        out.append(
            _text(
                x0 + width / 2,
                32 + height + 22,
                f"{found} {_plural(found, 'раз', 'раза', 'раз')}",
                14,
                ACCENT,
                "middle",
                600,
            )
        )
    x = table[r][c]
    out.append(
        _text(
            30,
            32 + height + 52,
            f"значение {x}: в других строках {counts[2]} − {counts[0]} = {counts[2] - counts[0]}, "
            f"в других ячейках столбца {counts[1]} − 1 = {counts[1] - 1}",
            13.5,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- neighbours of a cell -----------------------------------------------------------


def tb_neighbours(rows: int = 4, cols: int = 5) -> str:
    cells = [("в углу", 0, 0), ("на краю", 0, 2), ("внутри", 2, 2)]
    width, height = cols * SMALL, rows * SMALL
    out = [
        f'<svg viewBox="0 0 660 {height + 84}" role="img" '
        'aria-label="Соседи угловой, краевой и внутренней ячейки">'
    ]
    for k, (label, r, c) in enumerate(cells):
        x0 = 20 + k * (width + 50)
        count = 0
        for i in range(rows):
            for j in range(cols):
                near = max(abs(i - r), abs(j - c)) == 1
                count += near
                me = (i, j) == (r, c)
                fill = INK if me else (WASH if near else "#fff")
                stroke = INK if me else (ACCENT if near else FAINT)
                out.append(
                    f'<rect x="{x0 + j * SMALL}" y="{24 + i * SMALL}" width="{SMALL - 3}" '
                    f'height="{SMALL - 3}" rx="4" fill="{fill}" stroke="{stroke}" '
                    f'stroke-width="{2 if near else 1.4}"/>'
                )
        out.append(_text(x0 + width / 2, 16, label, 14, INK, "middle", 600))
        out.append(
            _text(
                x0 + width / 2,
                24 + height + 24,
                f"{count} {_plural(count, 'сосед', 'соседа', 'соседей')}",
                14,
                ACCENT,
                "middle",
                600,
            )
        )
    out.append(
        _text(
            20,
            24 + height + 48,
            "сосед — общая сторона или угол; сама ячейка (тёмная) в число соседей не входит",
            12.5,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


TABLE_FIGURES: dict = {
    "tb_minus": tb_minus,
    "tb_groups": tb_groups,
    "tb_pairs": tb_pairs,
    "tb_triangle": tb_triangle,
    "tb_scope": tb_scope,
    "tb_neighbours": tb_neighbours,
}
TABLE_STEPPERS: dict = {}
TABLE_WIDGETS: dict = {}
TABLE_SCRIPTS: dict = {}
