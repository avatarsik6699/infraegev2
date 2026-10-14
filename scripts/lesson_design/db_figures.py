"""Figures of topic 3 «Связанные таблицы: отбор и расчёт» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.
All keys start with ``db_`` so they never clash with other topics.

``db_book(name)`` — a workbook of the topic (topic-3/datasets.py) as a read-only
mini-sheet of three sheets inside a collapsed block «Книга из файла».
``db_schema(kind)`` — the schema of a database as the exam draws it: a box per
table with its fields, the key of each table marked, a line from every foreign
key to the key it refers to with «1» at the reference and «∞» at the records.
``db_flat()`` — three sales of one shop kept in one big table: the shop's
district and address and the goods' name and pack mass repeat in every row.
``db_terms()`` — the shop table with its parts named: a record (one shop), a
field («Район») and the value of that field in one record.
``db_lookup()`` — an operation finds its shop by the equal ID, not by the row
with the same number: the right link and the crossed-out wrong one.
``db_logic()`` — the requirements of a question joined by И, the variants of
one requirement by ИЛИ: a frame per requirement, «и» between the frames.
``db_stock()`` — two shops with different starting stock get the same +20 and
−8: the stock changes by the same 12, so the change needs no starting stock.
``db_groups()`` — the selected sales stacked by shop against the 7 kg
threshold: no single sale passes it, the sum of M1 does.
"""

from __future__ import annotations

import datetime
import html
import importlib.util
import sys
from collections.abc import Collection
from pathlib import Path
from types import ModuleType

from figures import ACCENT, FAINT, INK, MUTED, WASH, _text

HERE = Path(__file__).resolve().parent
TOPIC = HERE.parents[1] / "content" / "lesson-design" / "topic-3"
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

_module: dict[str, ModuleType] = {}


def datasets() -> ModuleType:
    """topic-3/datasets.py: the data of the books (loaded once)."""
    if "ds" not in _module:
        spec = importlib.util.spec_from_file_location("topic3_datasets", TOPIC / "datasets.py")
        assert spec and spec.loader
        module = importlib.util.module_from_spec(spec)
        sys.modules["topic3_datasets"] = module
        spec.loader.exec_module(module)
        _module["ds"] = module
    return _module["ds"]


# --- the book under a task ------------------------------------------------------------------


def _cell(value) -> str:
    """A value as typed into a ```sheet grid: dates dd.mm.yyyy, decimal comma."""
    if isinstance(value, datetime.date):
        return value.strftime("%d.%m.%Y")
    if isinstance(value, float):
        text = f"{value:.6f}".rstrip("0").rstrip(".")
        return text.replace(".", ",")
    return str(value).replace("|", "\\|")


def book_markup(name: str) -> str:
    """The sheets of a workbook as the body of a ```sheet block (first sheet unnamed)."""
    lines: list[str] = []
    for i, (title, head, rows) in enumerate(datasets().book(name).sheets()):
        if i:
            lines.append(f"[{title}]")
        letters = LETTERS[: len(head)]
        lines.append("|   | " + " | ".join(letters))
        lines.append("| 1 | " + " | ".join(_cell(h) for h in head))
        for r, row in enumerate(rows, start=2):
            lines.append(f"| {r} | " + " | ".join(_cell(v) for v in row))
        dates = [c for c, v in enumerate(rows[0]) if isinstance(v, datetime.date)]
        for c in dates:
            lines.append(f"fmt {letters[c]}2:{letters[c]}{len(rows) + 1} дата")
    return "\n".join(lines)


_previews = {"n": 0}


def db_book(name: str) -> str:
    """A collapsed read-only mini-sheet with the three sheets of ``files/<name>.xlsx``."""
    from sheetblock import block_html, parse_block

    sheets = datasets().book(name).sheets()
    first = sheets[0][0]
    block = parse_block("Лист edit=none", book_markup(name))
    # the head of a ```sheet block takes one word; the exam names the sheet with a space
    part = block.sheets[0]
    sheet = block.book.sheets.pop(part.name)
    part.name = sheet.name = first
    block.book.sheets[first] = sheet
    _previews["n"] += 1
    grid = block_html(block, f"book-{name}-{_previews['n']}")
    rows = len(sheets[0][2])
    return (
        '<details class="proof book">'
        f"<summary>Книга из файла {html.escape(name)}.xlsx: {html.escape(first)} "
        f"({rows} строк), {html.escape(sheets[1][0])}, {html.escape(sheets[2][0])}</summary>"
        f"{grid}</details>"
    )


# --- the schema of a database -------------------------------------------------------------------

# kind → tables (name, fields, key field index) and links (from table, field → to table, field)
SCHEMAS: dict[str, tuple[list[tuple[str, list[str], int]], list[tuple[int, int, int, int]]]] = {
    "shop": (
        [
            ("Магазин", ["ID магазина", "Район", "Адрес"], 0),
            (
                "Движение",
                [
                    "ID операции",
                    "Дата",
                    "ID магазина",
                    "Артикул",
                    "Тип операции",
                    "Упаковок, шт.",
                    "Цена, руб./уп.",
                ],
                0,
            ),
            (
                "Товар",
                ["Артикул", "Отдел", "Наименование", "Ед. изм.", "В упаковке", "Поставщик"],
                0,
            ),
        ],
        [(1, 2, 0, 0), (1, 3, 2, 0)],
    ),
    "theatre": (
        [
            ("Спектакли", ["Код спектакля", "Название", "Автор", "Режиссёр", "Жанр"], 0),
            (
                "Продажа билетов",
                [
                    "ID операции",
                    "Дата продажи",
                    "Код спектакля",
                    "ID тарифа",
                    "Взрослых без льгот",
                    "Взрослых льготных",
                    "Детских",
                ],
                0,
            ),
            (
                "Цены",
                [
                    "ID тарифа",
                    "Название тарифа",
                    "Взрослый, руб.",
                    "Льготный, руб.",
                    "Детский, руб.",
                ],
                0,
            ),
        ],
        [(1, 2, 0, 0), (1, 3, 2, 0)],
    ),
}

ROW = 26  # height of a field row
HEAD = 32  # height of the table name


def _infinity(cx: float, cy: float, color: str = ACCENT) -> str:
    """∞ drawn as a line: the glyph of the page font is too small to read."""
    return (
        f'<path d="M {cx} {cy} C {cx - 3} {cy - 5}, {cx - 8.5} {cy - 5}, {cx - 8.5} {cy} '
        f"C {cx - 8.5} {cy + 5}, {cx - 3} {cy + 5}, {cx} {cy} "
        f"C {cx + 3} {cy - 5}, {cx + 8.5} {cy - 5}, {cx + 8.5} {cy} "
        f'C {cx + 8.5} {cy + 5}, {cx + 3} {cy + 5}, {cx} {cy}" fill="none" '
        f'stroke="{color}" stroke-width="1.75"/>'
    )


def db_schema(kind: str = "shop") -> str:
    """Three tables side by side; lines join each foreign key with the key it names.

    As on the exam schema, «1» stands at the reference table and «∞» at the
    table of records; the gaps leave both marks clear of the boxes (T23).
    """
    tables, links = SCHEMAS[kind]
    width, gap, x0, top = 172, 70, 4, 12
    height = top + HEAD + ROW * max(len(f) for _, f, _ in tables) + 52
    out = [
        f'<svg viewBox="0 0 664 {height}" role="img" aria-label="Схема базы данных: '
        + html.escape(", ".join(t[0] for t in tables))
        + '">'
    ]

    def fy(f: int) -> float:
        return top + HEAD + ROW * f + ROW / 2

    def fx(t: int) -> float:
        return x0 + t * (width + gap)

    for t, (name, fields, key) in enumerate(tables):
        x = fx(t)
        h = HEAD + ROW * len(fields)
        out.append(
            f'<rect x="{x}" y="{top}" width="{width}" height="{h}" rx="6" fill="#fff" '
            f'stroke="{INK}" stroke-width="1.5"/>'
        )
        out.append(
            f'<path d="M {x} {top + HEAD} V {top + 6} Q {x} {top} {x + 6} {top} '
            f'H {x + width - 6} Q {x + width} {top} {x + width} {top + 6} V {top + HEAD} Z" '
            f'fill="{WASH}" stroke="{INK}" stroke-width="1.5"/>'
        )
        out.append(_text(x + width / 2, top + 21, name, 15, INK, "middle", 700))
        linked = {lf for lt, lf, _, _ in links if lt == t} | {
            rf for _, _, rt, rf in links if rt == t
        }
        for f, field in enumerate(fields):
            y = top + HEAD + ROW * f
            if f:
                out.append(f'<line x1="{x}" y1="{y}" x2="{x + width}" y2="{y}" stroke="{FAINT}"/>')
            color = INK if f == key or f in linked else MUTED
            weight = 700 if f == key else 400
            out.append(_text(x + 10, y + 18, field, 14, color, "start", weight))
            if f == key:
                out.append(_text(x + width - 8, y + 18, "ключ", 12.5, MUTED, "end"))
    for lt, lf, rt, rf in links:
        # from the record table (∞) to the reference table (1)
        y1, y2 = fy(lf), fy(rf)
        if rt < lt:
            x1, x2 = fx(lt), fx(rt) + width
            n_x, one_x = x1 - 16, x2 + 12
        else:
            x1, x2 = fx(lt) + width, fx(rt)
            n_x, one_x = x1 + 16, x2 - 12
        mid = (x1 + x2) / 2
        out.append(
            f'<path d="M {x1} {y1:.1f} H {mid} V {y2:.1f} H {x2}" fill="none" '
            f'stroke="{ACCENT}" stroke-width="1.75"/>'
        )
        out.append(_infinity(n_x, y1 - 9))
        out.append(_text(one_x, y2 - 6, "1", 16, ACCENT, "middle", 700))
    note_y = height - 16
    out.append(_text(150, note_y, "1", 16, ACCENT, "middle", 700))
    out.append(_text(162, note_y, "— одна запись справочника", 13.5, MUTED))
    out.append(_infinity(372, note_y - 5))
    out.append(_text(386, note_y, "— много записей с тем же ключом", 13.5, MUTED))
    out.append("</svg>")
    return "".join(out)


# --- illustrative tables of subtopic 1 (Change 184 T20) -----------------------------------------

TROW, THEAD = 32, 28  # row and head heights of an illustrative table


def _table(x0: float, y0: float, cols, rows, wash: Collection[tuple[int, int]] = ()) -> list[str]:
    """A small table drawn like the site's learning table: a washed head, hairlines.

    ``cols`` — (label, width, numeric); ``wash`` — (row, col) cells washed as repeats.
    """
    width = sum(w for _, w, _ in cols)
    out = [
        f'<rect x="{x0}" y="{y0}" width="{width}" height="{THEAD}" fill="{WASH}"/>',
        f'<line x1="{x0}" y1="{y0 + THEAD}" x2="{x0 + width}" y2="{y0 + THEAD}" '
        f'stroke="{MUTED}" stroke-width="1"/>',
    ]
    x = x0
    for c, (label, w, numeric) in enumerate(cols):
        tx, anchor = (x + w - 8, "end") if numeric else (x + 8, "start")
        out.append(_text(tx, y0 + 18, label, 12.5, MUTED, anchor, 500))
        for r, row in enumerate(rows):
            y = y0 + THEAD + TROW * r
            if (r, c) in wash:
                out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{TROW}" fill="{WASH}"/>')
            out.append(_text(tx, y + 21, row[c], 14, INK, anchor))
        x += w
    for r in range(1, len(rows) + 1):
        y = y0 + THEAD + TROW * r
        out.append(f'<line x1="{x0}" y1="{y}" x2="{x0 + width}" y2="{y}" stroke="{FAINT}"/>')
    return out


def db_flat() -> str:
    """Three sales of shop M1 in one big table: its district and address and the
    goods' name and pack mass are written again in every row."""
    cols = [
        ("Дата", 92, False),
        ("Магазин", 70, False),
        ("Район", 84, False),
        ("Адрес", 88, False),
        ("Товар", 128, False),
        ("Масса уп.", 74, True),
        ("Упаковок", 76, True),
    ]
    rows = [
        ["02.06.2026", "M1", "Северный", "Лесная, 5", "Макароны рожки", "0,5 кг", "8"],
        ["06.06.2026", "M1", "Северный", "Лесная, 5", "Макароны рожки", "0,5 кг", "2"],
        ["31.05.2026", "M1", "Северный", "Лесная, 5", "Макароны рожки", "0,5 кг", "4"],
    ]
    x0, y0 = 4, 8
    repeated = {(r, c) for r in range(3) for c in (2, 3, 4, 5)}
    out = [
        '<svg viewBox="0 0 620 172" role="img" aria-label="Одна большая таблица: '
        'район, адрес, товар и масса упаковки повторяются в каждой строке">',
        *_table(x0, y0, cols, rows, repeated),
    ]
    bottom = y0 + THEAD + TROW * 3
    edges = [x0]
    for _, w, _ in cols:
        edges.append(edges[-1] + w)
    for first, last, label in (
        (2, 3, "магазин — в каждой строке"),
        (4, 5, "товар — в каждой строке"),
    ):
        left, right = edges[first] + 2, edges[last + 1] - 2
        out.append(
            f'<rect x="{left}" y="{y0 + THEAD + 2}" width="{right - left}" '
            f'height="{TROW * 3 - 4}" rx="5" fill="none" stroke="{ACCENT}" stroke-width="1.75"/>'
        )
        out.append(_text((left + right) / 2, bottom + 24, label, 13, ACCENT, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def db_terms() -> str:
    """The shop table with its parts named: a record, a field and a field value."""
    cols = [("ID магазина", 112, False), ("Район", 112, False), ("Адрес", 120, False)]
    rows = [
        ["M1", "Северный", "Лесная, 5"],
        ["M2", "Южный", "Садовая, 9"],
        ["M3", "Северный", "Мира, 12"],
    ]
    x0, y0 = 4, 40
    width = sum(w for _, w, _ in cols)
    out = [
        '<svg viewBox="0 0 620 204" role="img" aria-label="Таблица магазинов: '
        'строка — запись о магазине, столбец — поле, ячейка — значение поля">',
        *_table(x0, y0, cols, rows),
    ]
    # the field «Район»: a bracket over its column
    fx1, fx2 = x0 + 112 + 6, x0 + 224 - 6
    out.append(
        f'<path d="M {fx1} {y0 - 4} v -6 H {fx2} v 6" fill="none" stroke="{MUTED}" '
        'stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>'
    )
    out.append(_text((fx1 + fx2) / 2, y0 - 16, "поле «Район»", 13.5, MUTED, "middle", 600))
    # the record of M1: a frame over its row, named on the right
    ry = y0 + THEAD
    out.append(
        f'<rect x="{x0 + 1}" y="{ry + 1}" width="{width - 2}" height="{TROW - 2}" rx="4" '
        f'fill="none" stroke="{INK}" stroke-width="1.5"/>'
    )
    out.append(
        f'<line x1="{x0 + width}" y1="{ry + TROW / 2}" x2="{x0 + width + 22}" y2="{ry + TROW / 2}" stroke="{INK}"/>'
    )
    out.append(
        _text(x0 + width + 28, ry + TROW / 2 + 5, "запись — один магазин", 13.5, INK, "start", 600)
    )
    # the value of the field «Район» in the record of M3, named under the table
    vx, vy = x0 + 112 + 4, ry + TROW * 2 + 4
    out.append(
        f'<rect x="{vx}" y="{vy}" width="104" height="{TROW - 8}" rx="4" fill="none" '
        f'stroke="{ACCENT}" stroke-width="1.75"/>'
    )
    bottom = y0 + THEAD + TROW * 3
    out.append(
        f'<line x1="{vx + 52}" y1="{vy + TROW - 8}" x2="{vx + 52}" y2="{bottom + 14}" '
        f'stroke="{ACCENT}"/>'
    )
    out.append(
        _text(vx + 52, bottom + 30, "значение поля «Район» у M3", 13.5, ACCENT, "middle", 600)
    )
    out.append("</svg>")
    return "".join(out)


def db_lookup() -> str:
    """Operation 3 takes its shop by the equal ID M3, not from the row of the
    shop table with the same number: that row is M2, another shop."""
    left = [("ID операции", 96, True), ("ID магазина", 100, False)]
    right = [("ID магазина", 100, False), ("Район", 96, False)]
    ops = [["2", "M1"], ["3", "M3"], ["4", "M2"]]
    shops = [["M1", "Северный"], ["M2", "Южный"], ["M3", "Северный"]]
    lx, rx, y0 = 4, 404, 34
    out = [
        '<svg viewBox="0 0 620 214" role="img" aria-label="Связь по ключу: операция 3 '
        'находит магазин M3 по совпадению ID, а не по номеру строки">',
        _text(lx, 18, "Движение", 14, INK, "start", 700),
        _text(rx, 18, "Магазин", 14, INK, "start", 700),
        *_table(lx, y0, left, ops, {(1, 1)}),
        *_table(rx, y0, right, shops, {(2, 0)}),
    ]

    def cy(r: int) -> float:
        return y0 + THEAD + TROW * r + TROW / 2

    x1, x2 = lx + 196 + 6, rx - 6
    # wrong: the row with the same number
    out.append(
        f'<line x1="{x1}" y1="{cy(1)}" x2="{x2}" y2="{cy(1)}" stroke="{MUTED}" '
        'stroke-width="1.5" stroke-dasharray="5 5"/>'
    )
    mx = (x1 + x2) / 2
    out.append(
        f'<path d="M {mx - 7} {cy(1) - 7} l 14 14 M {mx + 7} {cy(1) - 7} l -14 14" '
        f'stroke="{MUTED}" stroke-width="2" stroke-linecap="round"/>'
    )
    out.append(_text(mx, cy(1) - 14, "не по номеру строки", 13, MUTED, "middle", 600))
    # right: the equal ID
    out.append(
        f'<path d="M {x1} {cy(1)} C {mx} {cy(1)}, {mx} {cy(2)}, {x2 - 8} {cy(2)}" fill="none" '
        f'stroke="{ACCENT}" stroke-width="2"/>'
    )
    out.append(
        f'<path d="M {x2 - 8} {cy(2) - 5} L {x2} {cy(2)} L {x2 - 8} {cy(2) + 5}" fill="none" '
        f'stroke="{ACCENT}" stroke-width="2" stroke-linejoin="round"/>'
    )
    out.append(_text(mx, cy(2) + 26, "по совпадению ID: M3", 13, ACCENT, "middle", 600))
    bottom = y0 + THEAD + TROW * 3
    out.append(
        _text(lx, bottom + 46, "Операция 3 → магазин M3 → Северный район.", 13.5, INK, "start", 600)
    )
    out.append("</svg>")
    return "".join(out)


def db_logic() -> str:
    """Four requirements of the question, all needed (И); inside the shop and
    goods requirements one variant is enough (или)."""
    groups = [
        ("магазин", ["M1", "M3"]),
        ("товар", ["101", "102"]),
        ("тип операции", ["Продажа"]),
        ("дата", ["1–10 июня"]),
    ]
    width, gap, x0, y0, h = 130, 30, 4, 8, 76
    out = [
        '<svg viewBox="0 0 620 124" role="img" aria-label="Требования вопроса через И: '
        'магазин M1 или M3, товар 101 или 102, продажа, дата с 1 по 10 июня">'
    ]
    for k, (title, variants) in enumerate(groups):
        x = x0 + k * (width + gap)
        out.append(
            f'<rect x="{x}" y="{y0}" width="{width}" height="{h}" rx="8" fill="#fff" '
            f'stroke="{INK}" stroke-width="1.5"/>'
        )
        out.append(_text(x + width / 2, y0 + 22, title, 12.5, MUTED, "middle", 500))
        if len(variants) == 2:
            chip = 42
            for v, cx in zip(variants, (x + 10, x + width - 10 - chip), strict=True):
                out.append(
                    f'<rect x="{cx}" y="{y0 + 34}" width="{chip}" height="28" rx="6" '
                    f'fill="{WASH}" stroke="{FAINT}"/>'
                )
                out.append(_text(cx + chip / 2, y0 + 53, v, 14, INK, "middle", 600))
            out.append(_text(x + width / 2, y0 + 53, "или", 13, MUTED, "middle", 600))
        else:
            out.append(
                f'<rect x="{x + 14}" y="{y0 + 34}" width="{width - 28}" height="28" rx="6" '
                f'fill="{WASH}" stroke="{FAINT}"/>'
            )
            out.append(_text(x + width / 2, y0 + 53, variants[0], 14, INK, "middle", 600))
        if k:
            out.append(_text(x - gap / 2, y0 + h / 2 + 6, "и", 17, ACCENT, "middle", 700))
    out.append(
        _text(
            310,
            y0 + h + 30,
            "все четыре рамки — одновременно; внутри рамки — любой из вариантов",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


def db_stock() -> str:
    """Starting stock 50 and 100, the same arrival and sale: the same change."""
    came, sold, scale, x0 = 20, 8, 3, 84
    change = came - sold
    out = [
        f'<svg viewBox="0 0 560 214" role="img" aria-label="Начальный запас 50 и 100 упаковок; '
        f'поступило {came}, продано {sold}; в обоих случаях запас вырос на {change}">'
    ]
    for row, start in enumerate((50, 100)):
        y = 10 + row * 110
        end = start + change
        out.append(_text(0, y + 15, f"было {start}", 13, MUTED))
        out.append(
            f'<rect x="{x0}" y="{y}" width="{start * scale}" height="20" rx="3" '
            f'fill="{WASH}" stroke="{FAINT}"/>'
        )
        xs = x0 + start * scale
        out.append(
            f'<rect x="{xs}" y="{y}" width="{came * scale}" height="20" rx="3" '
            f'fill="#fff" stroke="{INK}"/>'
        )
        out.append(_text(xs + came * scale / 2, y + 15, f"+{came}", 12, INK, "middle", 500))
        xe = x0 + end * scale
        out.append(
            f'<rect x="{xe}" y="{y + 26}" width="{sold * scale}" height="16" rx="3" '
            f'fill="none" stroke="{MUTED}" stroke-dasharray="3 2"/>'
        )
        out.append(_text(xe + sold * scale / 2, y + 38, f"−{sold}", 11, MUTED, "middle"))
        out.append(
            f'<path d="M{xs} {y + 52} V{y + 60} H{xe} V{y + 52}" fill="none" '
            f'stroke="{ACCENT}" stroke-width="1.6"/>'
        )
        out.append(_text((xs + xe) / 2, y + 78, f"+{change}", 13, ACCENT, "middle", 600))
        out.append(_text(xs + came * scale + 10, y + 15, f"стало {end}", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


# the selected sales of the main question: operation, shop, kilograms
GROUP_SALES = [(2, "M1", 4.0), (3, "M3", 2.5), (5, "M3", 4.0), (7, "M1", 3.0), (10, "M1", 1.0)]
GROUP_THRESHOLD = 7


def _kg(value: float) -> str:
    return f"{value:g}".replace(".", ",")


def db_groups() -> str:
    """Sales stacked by shop with the threshold line: the check is on the sum."""
    shops = sorted({shop for _, shop, _ in GROUP_SALES})
    scale, base, bar, x_first, step = 25, 260, 100, 140, 160
    total = {shop: sum(kg for _, s, kg in GROUP_SALES if s == shop) for shop in shops}
    label = "; ".join(
        f"{shop}: {', '.join(_kg(kg) for _, s, kg in GROUP_SALES if s == shop)} кг, "
        f"итого {_kg(total[shop])}"
        for shop in shops
    )
    out = [
        f'<svg viewBox="0 0 500 300" role="img" aria-label="Подходящие продажи по магазинам: '
        f'{label}; порог {GROUP_THRESHOLD} кг">'
    ]
    out.append(f'<line x1="40" y1="{base}" x2="450" y2="{base}" stroke="{FAINT}"/>')
    line_y = base - GROUP_THRESHOLD * scale
    for k, shop in enumerate(shops):
        x = x_first + k * step
        y = base
        for n, (op, _, kg) in enumerate(s for s in GROUP_SALES if s[1] == shop):
            h = kg * scale
            y -= h
            fill = WASH if n % 2 == 0 else "#fff"
            out.append(
                f'<rect x="{x}" y="{y}" width="{bar}" height="{h}" fill="{fill}" stroke="{INK}"/>'
            )
            text = f"оп. {op} · {_kg(kg)} кг" if h >= 30 else f"оп. {op} · {_kg(kg)}"
            out.append(_text(x + bar / 2, y + h / 2 + 4, text, 12, INK, "middle"))
        out.append(
            _text(x + bar / 2, base + 22, f"{shop} · {_kg(total[shop])} кг", 14, INK, "middle", 600)
        )
        passed = total[shop] > GROUP_THRESHOLD
        note = f"больше {GROUP_THRESHOLD} — подходит" if passed else f"меньше {GROUP_THRESHOLD}"
        out.append(_text(x + bar + 6, y + 6 if passed else y + 14, note, 12, MUTED))
    out.append(
        f'<line x1="40" y1="{line_y}" x2="450" y2="{line_y}" stroke="{ACCENT}" '
        f'stroke-width="1.6" stroke-dasharray="6 4"/>'
    )
    out.append(_text(40, line_y - 7, f"порог {GROUP_THRESHOLD} кг", 12, ACCENT, "start", 600))
    out.append("</svg>")
    return "".join(out)


DB_FIGURES: dict = {
    "db_book": db_book,
    "db_schema": db_schema,
    "db_flat": db_flat,
    "db_terms": db_terms,
    "db_lookup": db_lookup,
    "db_logic": db_logic,
    "db_stock": db_stock,
    "db_groups": db_groups,
}
DB_STEPPERS: dict = {}
DB_WIDGETS: dict = {}
DB_SCRIPTS: dict = {}
