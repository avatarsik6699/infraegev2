"""Figures of topic 18 «Робот-сборщик монет» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.
All keys start with ``grid_`` so they never clash with other topics.

``grid_fill_stepper(field)`` — the tables of best sums filled cell by cell: the
coin, its predecessors and «coin + max» and «coin + min» side by side.
``grid_routes(field, cell)`` — two routes into one cell and one continuation:
the route with the larger sum stays ahead whatever comes next.
``grid_back(field)`` — routes restored from the finish backwards in the
tables of the maximum and the minimum.
``grid_preds(kinds)`` — where the last step into a cell comes from: the commands
of the task (right and down, left and down, diagonals, a rook) or walls.
``grid_book(name)`` — the field of a workbook of the topic (topic-18/datasets.py)
as a read-only mini-sheet with its walls inside a collapsed block «Поле из файла».
"""

from __future__ import annotations

import html
import importlib.util
import sys
from pathlib import Path
from types import ModuleType

from figures import ACCENT, FAINT, INK, MUTED, WASH, _arrow, _stepper, _text

HERE = Path(__file__).resolve().parent
TOPIC = HERE.parents[1] / "content" / "lesson-design" / "topic-18"
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
FIELD_4 = [[2, 7, 4, 1], [5, 1, 8, 3], [2, 6, 2, 9], [4, 3, 7, 2]]

Cell = tuple[int, int]


def name(r: int, c: int) -> str:
    return f"{LETTERS[c]}{r + 1}"


def _num(x: int) -> str:
    return str(x).replace("-", "−")


def tables(a: list[list[int]]) -> tuple[list[list[int]], list[list[int]]]:
    """Best sums from A1 to every cell, moving right and down: maximum and minimum."""
    h, w = len(a), len(a[0])
    mx = [[0] * w for _ in range(h)]
    mn = [[0] * w for _ in range(h)]
    for r in range(h):
        for c in range(w):
            prev = [(r, c - 1)] * (c > 0) + [(r - 1, c)] * (r > 0)
            mx[r][c] = a[r][c] + (max(mx[p][q] for p, q in prev) if prev else 0)
            mn[r][c] = a[r][c] + (min(mn[p][q] for p, q in prev) if prev else 0)
    return mx, mn


def _grid(x, y, cells, size=34, hot=(), wash=(), faint=(), letters=True, values_size=15) -> str:
    """A small field: cell labels (None — empty), accented, washed and faint cells."""
    out = []
    h, w = len(cells), len(cells[0])
    for r in range(h):
        for c in range(w):
            cx, cy = x + c * size, y + r * size
            fill = WASH if (r, c) in wash else "#fff"
            out.append(
                f'<rect x="{cx}" y="{cy}" width="{size}" height="{size}" fill="{fill}" '
                f'stroke="{FAINT}" stroke-width="1"/>'
            )
            label = cells[r][c]
            if label is not None:
                color = MUTED if (r, c) in faint else INK
                out.append(
                    _text(cx + size / 2, cy + size * 0.66, label, values_size, color, "middle", 600)
                )
    out.append(
        f'<rect x="{x}" y="{y}" width="{w * size}" height="{h * size}" fill="none" '
        f'stroke="{INK}" stroke-width="1.5"/>'
    )
    for r, c in wash:
        out.append(
            f'<rect x="{x + c * size + 1.5}" y="{y + r * size + 1.5}" width="{size - 3}" '
            f'height="{size - 3}" fill="none" stroke="{MUTED}" stroke-width="1.5" '
            'stroke-dasharray="4 3"/>'
        )
    for r, c in hot:
        out.append(
            f'<rect x="{x + c * size + 1.5}" y="{y + r * size + 1.5}" width="{size - 3}" '
            f'height="{size - 3}" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>'
        )
    if letters:
        for c in range(w):
            out.append(_text(x + c * size + size / 2, y - 6, LETTERS[c], 12, MUTED, "middle"))
        for r in range(h):
            out.append(_text(x - 8, y + r * size + size * 0.64, str(r + 1), 12, MUTED, "end"))
    return "".join(out)


# --- filling the tables ----------------------------------------------------------------------


def grid_fill_frames(field: list[list[int]] | None = None) -> list[tuple[str, str]]:
    """Start, the top row and the left column as three frames, then every inner cell."""
    a = field or FIELD_4
    h, w = len(a), len(a[0])
    mx, mn = tables(a)
    size = 34
    xs = [40, 250, 460]
    top = 46
    row1 = [(0, c) for c in range(1, w)]
    col1 = [(r, 0) for r in range(1, h)]
    inner = [(r, c) for r in range(1, h) for c in range(1, w)]
    steps: list[tuple[list[Cell], list[Cell], str, str, str]] = []
    steps.append(
        (
            [(0, 0)],
            [],
            f"старт: {a[0][0]}",
            f"старт: {a[0][0]}",
            f"A1 — старт: робот уже забрал монету {a[0][0]}, обе суммы равны {a[0][0]}.",
        )
    )
    for group, side in ((row1, "слева"), (col1, "сверху")):
        sums = ", ".join(str(mx[r][c]) for r, c in [(0, 0), *group])
        where = "верхняя строка" if side == "слева" else "левый столбец"
        steps.append(
            (
                group,
                [],
                sums,
                sums,
                f"{where.capitalize()}: прийти можно только {side}, путь единственный — "
                f"накопленные суммы {sums}, в обеих таблицах одинаковые.",
            )
        )
    for r, c in inner:
        coin = a[r][c]
        (p1, q1), (p2, q2) = (r, c - 1), (r - 1, c)
        fmax = f"{coin} + max({mx[p1][q1]}; {mx[p2][q2]}) = {mx[r][c]}"
        fmin = f"{coin} + min({mn[p1][q1]}; {mn[p2][q2]}) = {mn[r][c]}"
        caption = (
            f"{name(r, c)}: приходят из {name(p1, q1)} и {name(p2, q2)}. "
            f"Максимум {fmax}, минимум {fmin}."
        )
        if (r, c) == (h - 1, w - 1):
            caption += (
                f" Готово: в {name(r, c)} наибольшая сумма {mx[r][c]}, наименьшая {mn[r][c]}."
            )
        steps.append(([(r, c)], [(p1, q1), (p2, q2)], fmax, fmin, caption))
    frames = []
    done: set[Cell] = set()
    for hot, prev, fmax, fmin, caption in steps:
        done |= set(hot)
        out = ['<svg viewBox="0 0 660 232" role="img" aria-hidden="true">']
        for x, title in zip(
            xs, ["монеты поля", "лучшая сумма: максимум", "лучшая сумма: минимум"], strict=True
        ):
            out.append(_text(x - 14, 18, title, 13, MUTED))
        out.append(
            _grid(xs[0], top, [[str(v) for v in row] for row in a], size, hot=hot, wash=prev)
        )
        for x, t, formula in ((xs[1], mx, fmax), (xs[2], mn, fmin)):
            cells = [[str(t[i][j]) if (i, j) in done else None for j in range(w)] for i in range(h)]
            out.append(_grid(x, top, cells, size, hot=hot, wash=prev))
            out.append(_text(x - 14, top + h * size + 30, formula, 15, INK, weight=600))
        out.append("</svg>")
        frames.append(("".join(out), caption))
    return frames


def grid_fill_stepper(field: list[list[int]] | None = None) -> str:
    """The two tables of best sums filled cell by cell, row after row."""
    return _stepper(grid_fill_frames(field))


# --- two routes into one cell ------------------------------------------------------------


def _centre(x, y, size, cell: Cell) -> tuple[float, float]:
    return x + cell[1] * size + size / 2, y + cell[0] * size + size / 2


def _polyline(x, y, size, cells: list[Cell], color, dashed=False, width=3.0, shift=0.0) -> str:
    pts = " ".join(
        f"{cx + shift:.1f},{cy + shift:.1f}" for cx, cy in (_centre(x, y, size, c) for c in cells)
    )
    dash = ' stroke-dasharray="7 5"' if dashed else ""
    return (
        f'<polyline points="{pts}" fill="none" stroke="{color}" stroke-width="{width}" '
        f'stroke-linecap="round" stroke-linejoin="round"{dash}/>'
    )


def _route_sum(a, cells: list[Cell]) -> tuple[str, int]:
    vals = [a[r][c] for r, c in cells]
    return " + ".join(_num(v) for v in vals), sum(vals)


def grid_routes(
    field: list[list[int]] | None = None,
    first: list[str] | None = None,
    second: list[str] | None = None,
    rest: list[str] | None = None,
) -> str:
    """Two routes into one cell and the same continuation after it."""
    a = field or FIELD_4

    def cells(names: list[str]) -> list[Cell]:
        return [(int(s[1:]) - 1, LETTERS.index(s[0])) for s in names]

    one = cells(first or ["A1", "B1", "C1", "C2", "C3"])
    two = cells(second or ["A1", "A2", "A3", "B3", "C3"])
    after = cells(rest or ["C3", "D3", "D4"])
    size, x, y = 56, 34, 40
    s1, v1 = _route_sum(a, one)
    s2, v2 = _route_sum(a, two)
    s3, v3 = _route_sum(a, after[1:])
    meet = name(*one[-1])
    out = ['<svg viewBox="0 0 660 292" role="img" aria-hidden="true">']
    out.append(_grid(x, y, [[None] * len(a[0]) for _ in a], size, hot=[one[-1]]))
    out.append(_polyline(x, y, size, one, ACCENT, shift=-6))
    out.append(_polyline(x, y, size, two, INK, dashed=True, shift=6))
    out.append(_polyline(x, y, size, after, MUTED, width=5))
    for r, row in enumerate(a):
        for c, v in enumerate(row):
            cx, cy = _centre(x, y, size, (r, c))
            out.append(_halo(cx, cy + 6, _num(v)))
    tx = x + len(a[0]) * size + 34
    out.append(_text(tx, 58, f"первый путь до {meet}", 13, ACCENT))
    out.append(_text(tx, 80, f"{s1} = {v1}", 16, INK, weight=600))
    out.append(_text(tx, 114, f"второй путь до {meet} (пунктир)", 13, MUTED))
    out.append(_text(tx, 136, f"{s2} = {v2}", 16, INK, weight=600))
    out.append(
        _text(tx, 170, f"одно продолжение: {', '.join(name(*c) for c in after[1:])}", 13, MUTED)
    )
    out.append(_text(tx, 192, f"{s3} = {v3}", 16, INK, weight=600))
    sign = ">" if v1 > v2 else "<"
    out.append(
        _text(
            tx, 234, f"{v1} + {v3} = {v1 + v3} {sign} {v2} + {v3} = {v2 + v3}", 16, INK, weight=600
        )
    )
    out.append(_text(tx, 258, f"порядок {v1} {sign} {v2} сохранился", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


def _halo(x, y, label: str, size: float = 17) -> str:
    """A number over route lines: a white outline under the digits keeps it readable."""
    font = (
        f'x="{x:.1f}" y="{y:.1f}" font-family="Onest, system-ui, sans-serif" '
        f'font-size="{size}" font-weight="600" text-anchor="middle" '
        'style="font-variant-numeric:tabular-nums"'
    )
    text = html.escape(label)
    return (
        f'<text {font} fill="#fff" stroke="#fff" stroke-width="6">{text}</text>'
        f'<text {font} fill="{INK}">{text}</text>'
    )


# --- restoring a route ----------------------------------------------------------------------


def back_route(a, t, pick) -> list[Cell]:
    """From the finish to the start: the predecessor whose sum gave the cell's sum.
    On a tie the upper predecessor is taken."""
    h, w = len(a), len(a[0])
    r, c = h - 1, w - 1
    path = [(r, c)]
    while (r, c) != (0, 0):
        need = t[r][c] - a[r][c]
        if r > 0 and t[r - 1][c] == need:
            r -= 1
        else:
            c -= 1
        path.append((r, c))
    del pick
    return path


def grid_back(field: list[list[int]] | None = None) -> str:
    """Routes restored backwards: in the table of the maximum and of the minimum."""
    a = field or FIELD_4
    mx, mn = tables(a)
    size, top = 54, 46
    out = ['<svg viewBox="0 0 660 336" role="img" aria-hidden="true">']
    for x, t, title, pick in (
        (60, mx, "таблица максимума", max),
        (370, mn, "таблица минимума", min),
    ):
        path = back_route(a, t, pick)
        out.append(_text(x - 20, 18, title, 13, MUTED))
        out.append(
            _grid(x, top, [[str(v) for v in row] for row in t], size, hot=path, values_size=16)
        )
        for (r1, c1), (r2, c2) in zip(path, path[1:], strict=False):
            x1, y1 = _centre(x, top, size, (r1, c1))
            x2, y2 = _centre(x, top, size, (r2, c2))
            k = 0.3
            out.append(
                _arrow(
                    x1 + (x2 - x1) * k,
                    y1 + (y2 - y1) * k,
                    x2 - (x2 - x1) * k,
                    y2 - (y2 - y1) * k,
                    ACCENT,
                )
            )
        route = list(reversed(path))
        s, v = _route_sum(a, route)
        out.append(
            _text(x - 20, top + len(a) * size + 34, " → ".join(name(*p) for p in route), 13, INK)
        )
        out.append(_text(x - 20, top + len(a) * size + 58, f"{s} = {v}", 14, INK, weight=600))
    out.append("</svg>")
    return "".join(out)


# --- predecessors -----------------------------------------------------------------------------

KINDS = {
    "rd": ("вправо и вниз", [(0, -1), (-1, 0)], ()),
    "ld": ("влево и вниз", [(0, 1), (-1, 0)], ()),
    "ru": ("вправо и вверх", [(0, -1), (1, 0)], ()),
    "lu": ("влево и вверх", [(0, 1), (1, 0)], ()),
    "diag": ("+ вправо-вниз", [(0, -1), (-1, 0), (-1, -1)], ()),
    "diag4": ("+ влево-вниз", [(0, -1), (-1, 0), (-1, -1), (-1, 1)], ()),
    "wall-left": ("стена слева", [(0, -1), (-1, 0)], ("l",)),
    "wall-top": ("стена сверху", [(0, -1), (-1, 0)], ("t",)),
    "wall-out": ("стены справа и снизу", [(0, -1), (-1, 0)], ("r", "b")),
}


def _panel(x, y, kind: str, size=48) -> str:
    title, preds, walls = KINDS[kind]
    out = [_text(x + 1.5 * size, y - 10, title, 13, INK, "middle", 600)]
    centre = (1, 1)
    cells = [(1 + dr, 1 + dc) for dr, dc in preds]
    out.append(
        _grid(x, y, [[None] * 3 for _ in range(3)], size, hot=[centre], wash=cells, letters=False)
    )
    cx, cy = _centre(x, y, size, centre)
    for (r, c), (dr, dc) in zip(cells, preds, strict=True):
        px, py = _centre(x, y, size, (r, c))
        blocked = (dc == -1 and dr == 0 and "l" in walls) or (dr == -1 and dc == 0 and "t" in walls)
        length = ((cx - px) ** 2 + (cy - py) ** 2) ** 0.5
        ux, uy = (cx - px) / length, (cy - py) / length
        edge = 0.5 * size / max(abs(ux), abs(uy)) + 3
        ax, ay = px - ux * 0.1 * size, py - uy * 0.1 * size
        bx, by = cx - ux * edge, cy - uy * edge
        out.append(_arrow(ax, ay, bx, by, MUTED if blocked else INK, dashed=blocked, width=2))
        if blocked:
            mx_, my_ = cx - ux * 0.5 * size, cy - uy * 0.5 * size
            out.append(
                f'<path d="M {mx_ - 5:.1f} {my_ - 5:.1f} l 10 10 m 0 -10 l -10 10" '
                f'stroke="{ACCENT}" stroke-width="2.5" stroke-linecap="round" fill="none"/>'
            )
    for side in walls:
        x0, y0 = x + size, y + size
        seg = {
            "l": (x0, y0, x0, y0 + size),
            "t": (x0, y0, x0 + size, y0),
            "r": (x0 + size, y0, x0 + size, y0 + size),
            "b": (x0, y0 + size, x0 + size, y0 + size),
        }[side]
        out.append(
            f'<line x1="{seg[0]}" y1="{seg[1]}" x2="{seg[2]}" y2="{seg[3]}" stroke="{INK}" '
            f'stroke-width="5" stroke-linecap="round"/>'
        )
    return "".join(out)


def grid_preds(kinds: list[str] | None = None) -> str:
    """Panels: the current cell (accent) and the cells the last step comes from."""
    kinds = kinds or ["rd"]
    size = 48
    step = 660 / len(kinds)
    out = ['<svg viewBox="0 0 660 196" role="img" aria-hidden="true">']
    for i, kind in enumerate(kinds):
        x = step * i + (step - 3 * size) / 2
        out.append(_panel(x, 34, kind, size))
    out.append("</svg>")
    return "".join(out)


# --- a field with walls -------------------------------------------------------------------


def _cells(names: list[str] | None) -> list[Cell]:
    return [(int(s[1:]) - 1, LETTERS.index(s[0])) for s in names or []]


def _walls(x, y, size, right: list[Cell], down: list[Cell], h: int, w: int) -> str:
    out = [
        f'<rect x="{x}" y="{y}" width="{w * size}" height="{h * size}" fill="none" '
        f'stroke="{INK}" stroke-width="4"/>'
    ]
    for r, c in right:
        x0 = x + (c + 1) * size
        out.append(
            f'<line x1="{x0}" y1="{y + r * size}" x2="{x0}" y2="{y + (r + 1) * size}" '
            f'stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
        )
    for r, c in down:
        y0 = y + (r + 1) * size
        out.append(
            f'<line x1="{x + c * size}" y1="{y0}" x2="{x + (c + 1) * size}" y2="{y0}" '
            f'stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
        )
    return "".join(out)


def best_sums(
    field: list[list[int]], right: list[Cell], down: list[Cell], pick, start: Cell, back: bool
) -> list[list[int | None]]:
    """Best sums moving right and down with walls; −1 — a cell the robot may not enter.
    ``back``: from every cell to the bottom right cell instead of from the start."""
    h, w = len(field), len(field[0])

    def step_ok(r: int, c: int, dr: int, dc: int) -> bool:  # the robot's move from (r, c)
        nr, nc = r + dr, c + dc
        if nr >= h or nc >= w or field[nr][nc] < 0:
            return False
        return (r, c) not in (right if dc else down)

    t: list[list[int | None]] = [[None] * w for _ in range(h)]
    cells = [(r, c) for r in range(h) for c in range(w)]
    for r, c in reversed(cells) if back else cells:
        if field[r][c] < 0:
            continue
        if (r, c) == ((h - 1, w - 1) if back else start):
            t[r][c] = field[r][c]
            continue
        if back:
            cands = [t[r + dr][c + dc] for dr, dc in ((0, 1), (1, 0)) if step_ok(r, c, dr, dc)]
        else:
            cands = [
                t[r - dr][c - dc]
                for dr, dc in ((0, 1), (1, 0))
                if r - dr >= 0 and c - dc >= 0 and step_ok(r - dr, c - dc, dr, dc)
            ]
        nums = [x for x in cands if x is not None]
        if nums:
            t[r][c] = field[r][c] + pick(nums)
    return t


def grid_walls(
    field: list[list[int]],
    right: list[str] | None = None,
    down: list[str] | None = None,
    mode: str = "",
    start: str = "A1",
    marks: list[str] | None = None,
    titles: list[str] | None = None,
) -> str:
    """A field with thick walls (``right`` — a wall to the right of the cell, ``down`` —
    below it; −1 — a closed cell) and, for a ``mode``, a table of the same shape with the
    same walls: «max» or «min» — best sums from ``start``, «back» — the largest sum from
    every cell to the bottom right cell; «X» — no route. ``marks`` — accented cells."""
    h, w = len(field), len(field[0])
    size = 44 if w <= 4 else 36
    rw, dw, hot = _cells(right), _cells(down), _cells(marks)
    panels = [[[_num(v) for v in row] for row in field]]
    if mode:
        pick = min if mode == "min" else max
        t = best_sums(field, rw, dw, pick, _cells([start])[0], mode == "back")
        panels.append([["X" if v is None else _num(v) for v in row] for row in t])
    names = titles or ["монеты поля", "лучшие суммы"]
    width = w * size
    gap = 80
    total = len(panels) * width + (len(panels) - 1) * gap
    x0 = (660 - total) / 2
    height = 40 + h * size + 16
    out = [f'<svg viewBox="0 0 660 {height}" role="img" aria-hidden="true">']
    for i, cells in enumerate(panels):
        x = x0 + i * (width + gap)
        faint = [(r, c) for r in range(h) for c in range(w) if cells[r][c] == "X"]
        out.append(_text(x, 14, names[i], 13, MUTED))
        out.append(
            _grid(x, 36, cells, size, hot=hot, faint=faint, values_size=16 if w <= 4 else 14)
        )
        out.append(_walls(x, 36, size, rw, dw, h, w))
    out.append("</svg>")
    return "".join(out)


# --- the field of a workbook --------------------------------------------------------------


def datasets() -> ModuleType:
    """topic-18/datasets.py, the generator of the workbooks."""
    if "topic18_datasets" in sys.modules:
        return sys.modules["topic18_datasets"]
    spec = importlib.util.spec_from_file_location("topic18_datasets", TOPIC / "datasets.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules["topic18_datasets"] = module  # dataclasses look the module up by name
    spec.loader.exec_module(module)
    return module


def book_markup(book: str) -> str:
    """The field of a workbook as a ```sheet block: numbers, walls, frame."""
    f = datasets().FIELDS[book]()
    letters = [LETTERS[c] for c in range(f.w)]
    lines = ["|   | " + " | ".join(letters)]
    lines += [f"| {r + 1} | " + " | ".join(str(v) for v in row) for r, row in enumerate(f.a)]
    if f.right:
        lines.append("wall right " + ",".join(name(r, c) for r, c in sorted(f.right)))
    if f.down:
        lines.append("wall down " + ",".join(name(r, c) for r, c in sorted(f.down)))
    lines.append(f"frame A1:{name(f.h - 1, f.w - 1)}")
    return "\n".join(lines)


_previews = {"n": 0}


def grid_book(book: str) -> str:
    """A collapsed read-only mini-sheet with the field of ``files/<book>.xlsx``."""
    from sheetblock import block_html, parse_block

    block = parse_block("Лист1 edit=none", book_markup(book))
    _previews["n"] += 1
    sheet = block_html(block, f"book-{book}-{_previews['n']}")
    return (
        '<details class="proof book">'
        f"<summary>Поле из файла {html.escape(book)}.xlsx</summary>{sheet}</details>"
    )


GRID_FIGURES: dict = {
    "grid_fill_stepper": grid_fill_stepper,
    "grid_routes": grid_routes,
    "grid_back": grid_back,
    "grid_preds": grid_preds,
    "grid_walls": grid_walls,
    "grid_book": grid_book,
}
GRID_STEPPERS: dict = {
    "grid_fill_stepper": grid_fill_frames,
}
GRID_WIDGETS: dict = {}
GRID_SCRIPTS: dict = {}
