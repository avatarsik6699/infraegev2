"""Figures of topic 3 «Связанные таблицы: отбор и расчёт» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.
All keys start with ``db_`` so they never clash with other topics.

``db_book(name)`` — a workbook of the topic (topic-3/datasets.py) as a read-only
mini-sheet of three sheets inside a collapsed block «Книга из файла».
``db_schema(kind)`` — the schema of a database as the exam draws it: a box per
table with its fields, the key of each table marked, a line from every foreign
key to the key it refers to with «1» at the reference and «∞» at the records.
"""

from __future__ import annotations

import datetime
import html
import importlib.util
import sys
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


def db_schema(kind: str = "shop") -> str:
    """Three tables side by side; lines join each foreign key with the key it names."""
    tables, links = SCHEMAS[kind]
    width, gap, x0, top = 194, 30, 8, 30
    height = top + HEAD + ROW * max(len(f) for _, f, _ in tables) + 46
    out = [
        f'<svg viewBox="0 0 660 {height}" role="img" aria-label="Схема базы данных: '
        + html.escape(", ".join(t[0] for t in tables))
        + '">'
    ]

    def fy(t: int, f: int) -> float:
        return top + HEAD + ROW * f + ROW / 2

    def fx(t: int) -> float:
        return x0 + t * (width + gap)

    for t, (name, fields, key) in enumerate(tables):
        x = fx(t)
        h = HEAD + ROW * len(fields)
        out.append(
            f'<rect x="{x}" y="{top}" width="{width}" height="{h}" fill="#fff" '
            f'stroke="{INK}" stroke-width="1.5"/>'
        )
        out.append(
            f'<rect x="{x}" y="{top}" width="{width}" height="{HEAD}" fill="{WASH}" '
            f'stroke="{INK}" stroke-width="1.5"/>'
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
                out.append(_text(x + width - 8, y + 18, "ключ", 13, MUTED, "end"))
    for lt, lf, rt, rf in links:
        # from the record table (∞) to the reference table (1)
        y1, y2 = fy(lt, lf), fy(rt, rf)
        if rt < lt:
            x1, x2 = fx(lt), fx(rt) + width
            n_x, one_x, sign = x1 - 14, x2 + 10, -1
        else:
            x1, x2 = fx(lt) + width, fx(rt)
            n_x, one_x, sign = x1 + 14, x2 - 10, 1
        mid = (x1 + x2) / 2
        out.append(
            f'<path d="M {x1} {y1:.1f} H {mid} V {y2:.1f} H {x2}" fill="none" '
            f'stroke="{ACCENT}" stroke-width="1.75"/>'
        )
        out.append(_text(n_x, y1 - 6, "∞", 16, ACCENT, "middle", 700))
        out.append(_text(one_x, y2 - 6, "1", 15, ACCENT, "middle", 700))
        del sign
    note_y = height - 14
    out.append(
        _text(
            330,
            note_y,
            "1 — одна запись справочника, ∞ — много записей с тем же ключом",
            14,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


DB_FIGURES: dict = {
    "db_book": db_book,
    "db_schema": db_schema,
}
DB_STEPPERS: dict = {}
DB_WIDGETS: dict = {}
DB_SCRIPTS: dict = {}
