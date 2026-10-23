"""Sheet blocks of the Excel course stand: ```sheet in Markdown → a live mini-sheet.

A block is a small workbook written as a grid::

    ```sheet База select=E2
    |   | A        | B    | C  | D            | E
    | 1 | Товар    | Цена | Шт | Стоимость    | После скидки
    | 2 | Тетрадь  | 40   | 5  | =B2*C2 ⇒ 200 | =D2*(1-$H$2)
    | 3 | Ручка    | 20   | 3  |              |
    fill D2:E3
    fmt H2 %
    ```

- The first grid line names the columns (any start: ``| | F | G``); every other
  line starts with its row number. A blank cell is empty.
- ``=…`` is a formula (Russian locale). ``⇒ 200`` after it, or alone in a cell
  filled by ``fill``, is the value the reader is told.
- ``'00127`` is text, as typed in Excel; ``ИСТИНА``/``ЛОЖЬ`` are logical.
- Directives after a grid: ``fill D2:E3`` copies the formulas of the first row
  (or column) of the range over the rest with ``sheet_eval.shift`` — the copies
  are what Excel makes, never typed by hand; ``fmt RANGE KIND`` with KIND
  ``%``, ``0,0%``, ``0,00`` (decimals) or ``дата``; ``filter 3 5`` / ``hide 4`` —
  rows hidden by a filter / by hand (``ПРОМЕЖУТОЧНЫЕ.ИТОГИ``).
- Walls (topic 18, Change 181) are thick cell borders, drawn and never
  computed: ``wall right B1,A2:B2`` (also ``down``, ``left``, ``up``) puts a
  wall on that side of every cell; ``frame A1:C3`` walls the outline of a range;
  ``walls F1:H3 from A1:C3`` repeats the walls of one range on another of the
  same size (the field and its calculation block).
- ``[Товары]`` starts another sheet of the same book (its grid follows);
  the first sheet takes the block's name.
- Options on the fence line: ``select=D2`` (the cell shown first in the formula
  bar), ``edit=B2:C5,H2`` or ``edit=none`` (by default every constant cell
  can be retyped by the reader; formulas never).

On the page the block becomes a table with column letters, row numbers and a
formula bar; ``sheetblock.js`` (with ``sheet_eval.js``) lets the reader select
cells, see the cells a formula reads outlined in colour and retype the inputs.
Without JavaScript the computed table and the formula of the selected cell stay.
"""

from __future__ import annotations

import html
import json
import random
import re
from dataclasses import dataclass, field
from pathlib import Path

from sheet_eval import (
    EMPTY,
    Book,
    Err,
    Sheet,
    address,
    col_letters,
    col_number,
    display,
    parse_address,
    serial_date,
    shift,
)

HERE = Path(__file__).resolve().parent
EXPECT = "⇒"
BLOCK = re.compile(r"^```sheet ([^\n]+)\n(.*?)^```[ \t]*$", re.M | re.S)
RANGE = re.compile(r"\$?([A-Z]{1,3})\$?(\d+)(?::\$?([A-Z]{1,3})\$?(\d+))?")


class SheetBlockError(ValueError):
    pass


def cells_of(text: str) -> list[tuple[int, int]]:
    """``"B2:C3,H2"`` → [(2, 2), (2, 3), (3, 2), (3, 3), (2, 8)]."""
    out = []
    for part in text.split(","):
        m = RANGE.fullmatch(part.strip())
        if not m:
            raise SheetBlockError(f"bad range {part!r}")
        r1, c1 = int(m.group(2)), col_number(m.group(1))
        r2, c2 = (int(m.group(4)), col_number(m.group(3))) if m.group(3) else (r1, c1)
        out += [(r, c) for r in range(r1, r2 + 1) for c in range(c1, c2 + 1)]
    return out


@dataclass
class SheetPart:
    name: str
    cols: list[int] = field(default_factory=list)
    rows: list[int] = field(default_factory=list)
    inputs: dict[tuple[int, int], str] = field(default_factory=dict)
    expect: dict[tuple[int, int], str] = field(default_factory=dict)
    formats: dict[tuple[int, int], str] = field(default_factory=dict)
    filled: dict[tuple[int, int], tuple[int, int]] = field(default_factory=dict)  # copy → origin
    filtered: set[int] = field(default_factory=set)
    hidden: set[int] = field(default_factory=set)
    walls: dict[tuple[int, int], set[str]] = field(default_factory=dict)  # cell → sides


@dataclass
class SheetBlock:
    sheets: list[SheetPart]
    select: tuple[str, int, int] | None
    editable: set[tuple[str, int, int]]
    book: Book

    @property
    def name(self) -> str:
        return self.sheets[0].name


def split_row(line: str) -> list[str]:
    cells = [c.strip() for c in re.split(r"(?<!\\)\|", line.strip())]
    if cells and cells[0] == "":
        cells = cells[1:]
    if cells and cells[-1] == "" and line.rstrip().endswith("|"):
        cells = cells[:-1]
    return [c.replace("\\|", "|") for c in cells]


def apply_fill(part: SheetPart, rng: str) -> None:
    cells = cells_of(rng)
    r1, c1 = cells[0]
    r2, c2 = cells[-1]
    if r2 > r1 and c2 > c1:
        origins = [(r1, c) for c in range(c1, c2 + 1)]  # first row copied down
        down = True
    elif r2 > r1:
        origins, down = [(r1, c1)], True
    else:
        origins, down = [(r1, c1)], False
    for orow, ocol in origins:
        source = part.inputs.get((orow, ocol), "")
        if not source.startswith("="):
            raise SheetBlockError(f"fill {rng}: {address(orow, ocol)} has no formula")
        targets = (
            [(r, ocol) for r in range(orow + 1, r2 + 1)]
            if down
            else [(orow, c) for c in range(ocol + 1, c2 + 1)]
        )
        for r, c in targets:
            if part.inputs.get((r, c)):
                raise SheetBlockError(f"fill {rng}: {address(r, c)} is not empty")
            part.inputs[(r, c)] = shift(source, r - orow, c - ocol)
            # a copy of a copy is still a copy of the formula typed by hand
            part.filled[(r, c)] = part.filled.get((orow, ocol), (orow, ocol))


SIDES = {"right": "r", "down": "b", "left": "l", "up": "t"}


def apply_walls(part: SheetPart, word: str, rest: str) -> None:
    """``wall SIDE RANGES``, ``frame RANGE`` or ``walls DEST from SRC``."""
    if word == "wall":
        side, _, rng = rest.strip().partition(" ")
        if side not in SIDES:
            raise SheetBlockError(f"wall side {side!r}: use one of {', '.join(SIDES)}")
        for cell in cells_of(rng):
            part.walls.setdefault(cell, set()).add(SIDES[side])
    elif word == "frame":
        cells = cells_of(rest.strip())
        top, left = cells[0]
        bottom, right = cells[-1]
        for r, c in cells:
            sides = part.walls.setdefault((r, c), set())
            sides |= {s for s, edge in (("t", top), ("b", bottom)) if r == edge}
            sides |= {s for s, edge in (("l", left), ("r", right)) if c == edge}
            if not sides:
                del part.walls[(r, c)]
    else:
        dest, _, src = rest.strip().partition(" from ")
        to, frm = cells_of(dest), cells_of(src)
        if not src or len(to) != len(frm) or to[-1][0] - to[0][0] != frm[-1][0] - frm[0][0]:
            raise SheetBlockError(f"walls {rest.strip()!r}: ranges of different shape")
        dr, dc = to[0][0] - frm[0][0], to[0][1] - frm[0][1]
        for r, c in frm:
            if (r, c) in part.walls:
                part.walls.setdefault((r + dr, c + dc), set()).update(part.walls[(r, c)])


def parse_block(head: str, body: str) -> SheetBlock:
    name, *opts = head.split()
    options = dict(o.split("=", 1) for o in opts)
    parts = [SheetPart(name)]
    part = parts[0]
    for raw in body.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("[") and line.endswith("]"):
            part = SheetPart(line[1:-1].strip())
            parts.append(part)
            continue
        if line.startswith("|"):
            cells = split_row(line)
            if not part.cols:
                bad = [c for c in cells[1:] if not re.fullmatch(r"[A-Z]{1,3}", c)]
                if bad or not cells[1:]:
                    raise SheetBlockError(f"sheet {part.name}: column letters {cells[1:]}")
                part.cols = [col_number(c) for c in cells[1:]]
                continue
            row = int(cells[0])
            part.rows.append(row)
            for col, text in zip(part.cols, cells[1:], strict=False):
                value, _, expect = text.partition(EXPECT)
                value, expect = value.strip(), expect.strip()
                if value:
                    part.inputs[(row, col)] = value
                if expect or text.startswith(EXPECT):
                    part.expect[(row, col)] = expect
            continue
        word, _, rest = line.partition(" ")
        if word == "fill":
            apply_fill(part, rest.strip())
        elif word == "fmt":
            rng, _, kind = rest.strip().partition(" ")
            for cell in cells_of(rng):
                part.formats[cell] = kind.strip()
        elif word in ("filter", "hide"):
            rows = {int(x) for x in rest.split()}
            (part.filtered if word == "filter" else part.hidden).update(rows)
        elif word in ("wall", "frame", "walls"):
            apply_walls(part, word, rest)
        else:
            raise SheetBlockError(f"unknown line in sheet {name}: {line!r}")
    book = Book()
    for p in parts:
        if not p.cols:
            raise SheetBlockError(f"sheet {p.name} has no grid")
        outside = [
            address(r, c)
            for r, c in p.walls
            if not (min(p.rows, default=1) <= r <= max(p.rows, default=1))
            or not (min(p.cols) <= c <= max(p.cols))
        ]
        if outside:
            raise SheetBlockError(f"sheet {p.name}: walls outside the grid at {', '.join(outside)}")
        sheet = book.sheet(p.name)
        sheet.inputs.update(p.inputs)
        sheet.filtered, sheet.hidden = set(p.filtered), set(p.hidden)
    select = None
    if "select" in options:
        r, c = parse_address(options["select"])
        select = (name, r, c)
    edit = options.get("edit")
    editable: set[tuple[str, int, int]] = set()
    if edit is None:
        for p in parts:
            editable |= {(p.name, r, c) for (r, c), t in p.inputs.items() if not t.startswith("=")}
    elif edit != "none":
        editable = {(name, r, c) for r, c in cells_of(edit)}
    return SheetBlock(parts, select, editable, book)


# formats ----------------------------------------------------------------------


def formatted(value, kind: str | None) -> str:
    if not kind or not isinstance(value, float) or isinstance(value, bool):
        return display(value)
    if kind == "дата":
        return serial_date(value).strftime("%d.%m.%Y")
    m = re.fullmatch(r"0(?:,(0+))?(%?)", kind) or re.fullmatch(r"(%)", kind)
    if not m:
        raise SheetBlockError(f"unknown format {kind!r}")
    if kind == "%":
        digits, percent = 0, True
    else:
        digits, percent = len(m.group(1) or ""), m.group(2) == "%"
    x = value * 100 if percent else value
    text = f"{x:.{digits}f}".replace(".", ",")
    if text.startswith("-") and float(text.replace(",", ".")) == 0:
        text = text[1:]
    return text + ("%" if percent else "")


def kind_of(value) -> str:
    if isinstance(value, Err):
        return "err"
    if isinstance(value, bool):
        return "bool"
    if isinstance(value, float):
        return "num"
    if value is EMPTY:
        return "empty"
    return "txt"


# checks ------------------------------------------------------------------------


def check_block(block: SheetBlock) -> list[str]:
    """Problems of one block: expected values that differ, unexpected errors."""
    problems = []
    for part in block.sheets:
        for (r, c), text in part.inputs.items():
            value = block.book.value(part.name, address(r, c))
            shown = formatted(value, part.formats.get((r, c)))
            where = f"{part.name}!{address(r, c)}"
            want = part.expect.get((r, c))
            if want is not None and want != shown:
                problems.append(f"{where}: {text} gives {shown!r}, the text says {want!r}")
            if text.startswith("=") and isinstance(value, Err) and want != shown:
                problems.append(f"{where}: {text} gives {shown}")
        for (r, c), want in part.expect.items():
            if (r, c) not in part.inputs:
                problems.append(f"{part.name}!{address(r, c)}: ⇒ {want} on an empty cell")
    return problems


def blocks_in(md_text: str) -> list[tuple[int, SheetBlock]]:
    """Every sheet block of a page with the line it starts on."""
    out = []
    for m in BLOCK.finditer(md_text):
        line = md_text.count("\n", 0, m.start()) + 1
        try:
            out.append((line, parse_block(m.group(1), m.group(2))))
        except (SheetBlockError, ValueError) as e:
            raise SheetBlockError(f"line {line}: {e}") from e
    return out


# html ---------------------------------------------------------------------------


def walls_of(part: SheetPart) -> dict[str, str]:
    """``{"B1": "rb"}`` — the walled sides of every cell, in the order t, r, b, l."""
    return {
        address(r, c): "".join(s for s in "trbl" if s in sides)
        for (r, c), sides in sorted(part.walls.items())
    }


def block_data(block: SheetBlock) -> dict:
    """What sheetblock.js needs: inputs, formats, hidden rows, editable cells."""
    return {
        "sheets": [
            {
                "name": p.name,
                "cols": [min(p.cols), max(p.cols)],
                "rows": [min(p.rows), max(p.rows)] if p.rows else [1, 1],
                "inputs": {address(r, c): t for (r, c), t in sorted(p.inputs.items())},
                "formats": {address(r, c): k for (r, c), k in sorted(p.formats.items())},
                "filtered": sorted(p.filtered),
                "hidden": sorted(p.hidden),
                "edit": sorted(address(r, c) for s, r, c in block.editable if s == p.name),
                **({"walls": walls_of(p)} if p.walls else {}),
            }
            for p in block.sheets
        ],
        "select": [block.select[0], address(block.select[1], block.select[2])]
        if block.select
        else None,
    }


def grid_html(block: SheetBlock, part: SheetPart, active: bool, uid: str, index: int) -> str:
    c1, c2 = min(part.cols), max(part.cols)
    r1, r2 = (min(part.rows), max(part.rows)) if part.rows else (1, 1)
    head = "".join(f'<th scope="col">{col_letters(c)}</th>' for c in range(c1, c2 + 1))
    rows = []
    sel = block.select
    walls = walls_of(part)
    for r in range(r1, r2 + 1):
        tds = []
        for c in range(c1, c2 + 1):
            value = block.book.value(part.name, address(r, c))
            text = part.inputs.get((r, c), "")
            cls = [kind_of(value)]
            if text.startswith("="):
                cls.append("f")
            if (part.name, r, c) in block.editable:
                cls.append("in")
            if sel and sel == (part.name, r, c):
                cls.append("sel")
            wall = f' data-w="{walls[address(r, c)]}"' if address(r, c) in walls else ""
            tds.append(
                f'<td class="{" ".join(cls)}" data-a="{address(r, c)}"{wall}>'
                f"{html.escape(formatted(value, part.formats.get((r, c))))}</td>"
            )
        hidden = r in part.filtered or r in part.hidden
        rows.append(
            f'<tr{" data-hidden" if hidden else ""}><th scope="row">{r}</th>{"".join(tds)}</tr>'
        )
    return (
        f'<div class="sheet-scroll" role="tabpanel" id="{uid}-p{index}"'
        f'{"" if active else " hidden"} data-sheet-name="{html.escape(part.name)}">'
        f'<table class="sheet-grid"><thead><tr><th class="corner"></th>{head}</tr></thead>'
        f"<tbody>{''.join(rows)}</tbody></table></div>"
    )


def formula_items(part: SheetPart) -> list[tuple[str, str, str | None]]:
    """The formulas typed into a sheet: (address, formula, last cell of its copies)."""
    copies: dict[tuple[int, int], list[tuple[int, int]]] = {}
    for cell, origin in part.filled.items():
        copies.setdefault(origin, []).append(cell)
    items = []
    for (r, c), text in sorted(part.inputs.items(), key=lambda kv: (kv[0][1], kv[0][0])):
        if not text.startswith("=") or (r, c) in part.filled:
            continue
        until = None
        if (r, c) in copies:
            cells = copies[(r, c)]
            until = address(max(r2 for r2, _ in cells), max(c2 for _, c2 in cells))
        items.append((address(r, c), text, until))
    return items


def formulas_note(block: SheetBlock) -> str:
    """The formulas of the block in one line: originals and where they were copied."""
    items = []
    for part in block.sheets:
        prefix = f"{part.name}!" if len(block.sheets) > 1 else ""
        for addr, text, until in formula_items(part):
            item = f"<code>{prefix}{addr}: {html.escape(text)}</code>"
            if until:
                item += f", скопирована до {until}"
            items.append(item)
    if not items:
        return ""
    return f'<p class="sheet-note">Формулы: {"; ".join(items)}</p>'


def site_data(block: SheetBlock) -> dict:
    """The site's SheetBlock (Change 177): the stand data plus the formula list."""
    data = block_data(block)
    for part, sheet in zip(block.sheets, data["sheets"], strict=True):
        sheet["formulas"] = [
            {"cell": a, "formula": f, **({"until": u} if u else {})}
            for a, f, u in formula_items(part)
        ]
    return {"kind": "sheet", **data}


def block_html(block: SheetBlock, uid: str) -> str:
    sel = block.select
    if sel:
        part = next(p for p in block.sheets if p.name == sel[0])
        text = part.inputs.get((sel[1], sel[2]), "")
        shown_addr = address(sel[1], sel[2])
    else:
        text, shown_addr = "", ""
    tabs = ""
    if len(block.sheets) > 1:
        tabs = (
            '<div class="sheet-tabs" role="tablist" aria-label="Листы файла">'
            + "".join(
                f'<button type="button" role="tab" aria-controls="{uid}-p{i}" '
                f'aria-selected="{"true" if i == 0 else "false"}">{html.escape(p.name)}</button>'
                for i, p in enumerate(block.sheets)
            )
            + "</div>"
        )
    grids = "".join(grid_html(block, p, i == 0, uid, i) for i, p in enumerate(block.sheets))
    data = json.dumps(block_data(block), ensure_ascii=False).replace("</", "<\\/")
    return (
        f'<figure class="sheet" id="{uid}" data-sheetblock>'
        '<div class="sheet-bar"><span class="sheet-addr" aria-label="Адрес ячейки">'
        f"{shown_addr}</span>"
        '<span class="sheet-fx" aria-hidden="true">fx</span>'
        f'<output class="sheet-f">{html.escape(text)}</output>'
        '<button type="button" class="sheet-reset" hidden>Вернуть исходные</button></div>'
        f"{grids}{tabs}{formulas_note(block)}"
        f'<p class="sheet-live sr-only" aria-live="polite"></p>'
        f'<script type="application/json" class="sheet-data">{data}</script>'
        "</figure>"
    )


def prepare(md_text: str, prefix: str = "sheet") -> tuple[str, bool]:
    """Replace every ```sheet block with its HTML; returns the text and whether
    any block was found (the page then needs the scripts)."""
    count = 0

    def repl(m: re.Match) -> str:
        nonlocal count
        count += 1
        block = parse_block(m.group(1), m.group(2))
        problems = check_block(block)
        if problems:
            raise SheetBlockError("; ".join(problems))
        return "\n" + block_html(block, f"{prefix}-{count}") + "\n"

    return BLOCK.sub(repl, md_text), count > 0


def scripts() -> str:
    """sheet_eval.js and sheetblock.js inlined into the page."""
    ev = (HERE / "sheet_eval.js").read_text(encoding="utf-8")
    ui = (HERE / "sheetblock.js").read_text(encoding="utf-8")
    ev = re.sub(r"^export ", "", ev, flags=re.M)
    return f"<script>\n(function () {{\n{ev}\n{ui}\n}})();\n</script>"


# conformance cases ------------------------------------------------------------------


def case(block: SheetBlock, edits: dict[tuple[str, str], str]) -> dict:
    """Inputs (after ``edits``) and the display of every cell, as the JS must show."""
    book = Book()
    for p in block.sheets:
        sheet: Sheet = book.sheet(p.name)
        sheet.inputs.update(p.inputs)
        sheet.filtered, sheet.hidden = set(p.filtered), set(p.hidden)
    for (name, addr), text in edits.items():
        book.sheet(name).set(addr, text)
    data = block_data(block)
    expected = {}
    for p in block.sheets:
        for (r, c), _ in sorted(book.sheet(p.name).inputs.items()):
            value = book.value(p.name, address(r, c))
            expected[f"{p.name}!{address(r, c)}"] = formatted(value, p.formats.get((r, c)))
    return {
        "block": data,
        "edits": {f"{n}!{a}": t for (n, a), t in edits.items()},
        "expected": expected,
    }


def random_edits(block: SheetBlock, rng: random.Random) -> dict[tuple[str, str], str]:
    """Retype a few editable cells the way a reader might: other numbers, a
    negative, a decimal, a blank, a text in a number cell."""
    cells = sorted(block.editable)
    edits = {}
    for name, r, c in rng.sample(cells, min(len(cells), 3)):
        old = block.book.value(name, address(r, c))
        if isinstance(old, float) and not isinstance(old, bool):
            text = rng.choice(
                [str(rng.randint(0, 20)), str(-rng.randint(1, 9)), "2,5", "", "нет", "0"]
            )
        else:
            text = rng.choice(["Казань", "", "7", "'007"])
        edits[(name, address(r, c))] = text
    return edits


def cases_for(md_texts: list[str], seed: int = 176) -> list[dict]:
    rng = random.Random(seed)
    out = []
    for text in md_texts:
        for _, block in blocks_in(text):
            out.append(case(block, {}))
            if block.editable:
                for _ in range(3):
                    out.append(case(block, random_edits(block, rng)))
    return out
