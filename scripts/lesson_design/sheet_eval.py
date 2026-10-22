"""Reference spreadsheet evaluator for the Excel mini-course (Change 176).

The course shows formulas as a Russian-locale Excel shows them: Russian function
names, ``;`` between arguments, a decimal comma (``=ОКРУГЛ(A2*0,1;2)``). Every
sheet of the stand is computed here; the browser evaluator of the live sheet
(``sheetblock.js``) and the site's one (``apps/web/src/shared/lib/sheet-eval``)
must agree with it on ``apps/web/tests/fixtures/sheet-cases.json``, and the
generated workbook is recomputed by an independent library (``workbook.py --check``).

Only the functions the course teaches are supported (chapter 24 of the source);
an unknown name is ``#ИМЯ?``, as in Excel. Semantics follow Microsoft's
documentation for the cases the course discusses: blanks and ``""`` in counts,
``СРЗНАЧ`` of an empty selection, ``ОСТАТ`` of negatives, rounding away from zero,
``ПРОМЕЖУТОЧНЫЕ.ИТОГИ`` codes 1–11 and 101–111, wildcard criteria.

Public API:
    Book                       sheets of typed cell inputs, evaluation with caching
    parse(formula)             syntax tree, raises FormulaError on bad syntax
    shift(formula, drow, dcol) the formula copied by (drow, dcol): relative parts move
    references(formula)        referenced cells and ranges, for highlighting
    to_english(formula)        the formula as an .xlsx file stores it (English, ``,``)
    display(value)             a value as a Russian-locale Excel shows it
"""

from __future__ import annotations

import datetime
import math
import re
from dataclasses import dataclass, field
from decimal import ROUND_CEILING, ROUND_DOWN, ROUND_FLOOR, ROUND_HALF_UP, Decimal
from typing import Any

# values ---------------------------------------------------------------------


class Empty:
    """A cell nobody filled. Not equal to ``""`` (a formula may return that)."""

    _instance: Empty | None = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __repr__(self) -> str:
        return "EMPTY"


EMPTY = Empty()


@dataclass(frozen=True)
class Err:
    code: str

    def __repr__(self) -> str:
        return self.code


DIV0, NA, VALUE, NAME, REF, NUM, CYCLE = (
    Err("#ДЕЛ/0!"),
    Err("#Н/Д"),
    Err("#ЗНАЧ!"),
    Err("#ИМЯ?"),
    Err("#ССЫЛКА!"),
    Err("#ЧИСЛО!"),
    Err("#ЦИКЛ!"),
)
ERRORS_EN = {
    "#ДЕЛ/0!": "#DIV/0!",
    "#Н/Д": "#N/A",
    "#ЗНАЧ!": "#VALUE!",
    "#ИМЯ?": "#NAME?",
    "#ССЫЛКА!": "#REF!",
    "#ЧИСЛО!": "#NUM!",
}

Value = float | str | bool | Empty | Err


class FormulaError(ValueError):
    """The formula cannot be parsed."""


class SheetError(Exception):
    """Carries an error value out of nested evaluation."""

    def __init__(self, err: Err):
        super().__init__(err.code)
        self.err = err


# addresses ------------------------------------------------------------------


def col_number(letters: str) -> int:
    n = 0
    for ch in letters:
        n = n * 26 + ord(ch) - 64
    return n


def col_letters(n: int) -> str:
    out = ""
    while n:
        n, rest = divmod(n - 1, 26)
        out = chr(65 + rest) + out
    return out


CELL = re.compile(r"(\$?)([A-Z]{1,3})(\$?)(\d+)")


def parse_address(text: str) -> tuple[int, int]:
    """``"B3"`` → (row 3, column 2)."""
    m = CELL.fullmatch(text.replace("$", ""))
    if not m:
        raise ValueError(f"not a cell address: {text!r}")
    return int(m.group(4)), col_number(m.group(2))


def address(row: int, col: int) -> str:
    return f"{col_letters(col)}{row}"


# tokenizer ------------------------------------------------------------------

TOKEN = re.compile(
    r"""
    (?P<ws>\s+)
  | (?P<str>"(?:[^"]|"")*")
  | (?P<ref>(?:(?:'(?:[^']|'')+'|[A-Za-zА-Яа-яЁё_][\wА-Яа-яЁё.]*)!)?
            \$?[A-Z]{1,3}\$?\d+(?::\$?[A-Z]{1,3}\$?\d+)?)(?![\w(])
  | (?P<func>[A-Za-zА-Яа-яЁё][\wА-Яа-яЁё.]*)(?=\s*\()
  | (?P<bool>ИСТИНА|ЛОЖЬ)(?![\wА-Яа-яЁё])
  | (?P<num>\d+(?:,\d+)?(?:[Ee][+-]?\d+)?)
  | (?P<op><>|<=|>=|[-+*/^&=<>%();])
  | (?P<bad>.)
    """,
    re.X,
)


@dataclass
class Tok:
    kind: str
    text: str
    start: int


def tokenize(formula: str) -> list[Tok]:
    body = formula[1:] if formula.startswith("=") else formula
    offset = len(formula) - len(body)
    toks = []
    for m in TOKEN.finditer(body):
        kind = m.lastgroup or "bad"
        if kind == "ws":
            continue
        if kind == "bad":
            raise FormulaError(f"unexpected {m.group()!r} in {formula!r}")
        toks.append(Tok(kind, m.group(), m.start() + offset))
    return toks


# references -----------------------------------------------------------------


@dataclass(frozen=True)
class Ref:
    sheet: str | None
    r1: int
    c1: int
    r2: int
    c2: int
    abs_r1: bool = False
    abs_c1: bool = False
    abs_r2: bool = False
    abs_c2: bool = False
    is_range: bool = False

    @property
    def cells(self) -> int:
        return (self.r2 - self.r1 + 1) * (self.c2 - self.c1 + 1)


def parse_ref(text: str) -> Ref:
    sheet = None
    if "!" in text:
        sheet, text = text.rsplit("!", 1)
        if sheet.startswith("'"):
            sheet = sheet[1:-1].replace("''", "'")
    parts = text.split(":")
    ends = []
    for part in parts:
        m = CELL.fullmatch(part)
        assert m, part
        ends.append((bool(m.group(3)), int(m.group(4)), bool(m.group(1)), col_number(m.group(2))))
    (ar1, r1, ac1, c1), (ar2, r2, ac2, c2) = ends[0], ends[-1]
    if (r2, c2) < (r1, c1) or r2 < r1 or c2 < c1:
        r1, r2 = min(r1, r2), max(r1, r2)
        c1, c2 = min(c1, c2), max(c1, c2)
    return Ref(sheet, r1, c1, r2, c2, ar1, ac1, ar2, ac2, len(parts) == 2)


def ref_text(ref: Ref) -> str:
    def one(row, col, ar, ac):
        return f"{'$' if ac else ''}{col_letters(col)}{'$' if ar else ''}{row}"

    out = one(ref.r1, ref.c1, ref.abs_r1, ref.abs_c1)
    if ref.is_range:
        out += ":" + one(ref.r2, ref.c2, ref.abs_r2, ref.abs_c2)
    if ref.sheet is not None:
        name = ref.sheet
        if not re.fullmatch(r"[A-Za-zА-Яа-яЁё_][\wА-Яа-яЁё.]*", name):
            name = "'" + name.replace("'", "''") + "'"
        out = f"{name}!{out}"
    return out


def shift(formula: str, drow: int, dcol: int) -> str:
    """The formula as Excel writes it after copying by ``drow`` rows and ``dcol`` columns.

    Parts of an address without ``$`` move; parts with ``$`` stay. An address
    pushed off the sheet becomes ``#ССЫЛКА!`` (Excel does the same).
    """
    out, pos = [], 0
    for tok in tokenize(formula):
        if tok.kind != "ref":
            continue
        sheet_part = tok.text.rsplit("!", 1)[0] + "!" if "!" in tok.text else ""
        ends = tok.text.rsplit("!", 1)[-1].split(":")
        moved = []
        bad = False
        for end in ends:
            m = CELL.fullmatch(end)
            assert m
            col = col_number(m.group(2)) + (0 if m.group(1) else dcol)
            row = int(m.group(4)) + (0 if m.group(3) else drow)
            if row < 1 or col < 1:
                bad = True
            moved.append(f"{m.group(1)}{col_letters(max(col, 1))}{m.group(3)}{row}")
        out.append(formula[pos : tok.start])
        out.append("#ССЫЛКА!" if bad else sheet_part + ":".join(moved))
        pos = tok.start + len(tok.text)
    out.append(formula[pos:])
    return "".join(out)


def references(formula: str) -> list[Ref]:
    """Every cell or range the formula reads, in order of appearance."""
    return [parse_ref(t.text) for t in tokenize(formula) if t.kind == "ref"]


# parser ---------------------------------------------------------------------


@dataclass
class Node:
    kind: str  # num str bool ref func unary binary percent
    value: object = None
    args: list[Node] = field(default_factory=list)


PRECEDENCE = [
    ("=", "<>", "<", ">", "<=", ">="),
    ("&",),
    ("+", "-"),
    ("*", "/"),
    ("^",),
]


class Parser:
    def __init__(self, formula: str):
        self.formula = formula
        self.toks = tokenize(formula)
        self.i = 0

    def peek(self) -> Tok | None:
        return self.toks[self.i] if self.i < len(self.toks) else None

    def take(self, text: str | None = None) -> Tok:
        tok = self.peek()
        if tok is None or (text is not None and tok.text != text):
            raise FormulaError(f"expected {text or 'a value'} in {self.formula!r}")
        self.i += 1
        return tok

    def parse(self) -> Node:
        node = self.binary(0)
        if self.peek() is not None:
            raise FormulaError(f"unexpected {self.peek().text!r} in {self.formula!r}")  # type: ignore[union-attr]
        return node

    def binary(self, level: int) -> Node:
        if level == len(PRECEDENCE):
            return self.unary()
        node = self.binary(level + 1)
        while (tok := self.peek()) and tok.kind == "op" and tok.text in PRECEDENCE[level]:
            self.i += 1
            node = Node("binary", tok.text, [node, self.binary(level + 1)])
        return node

    def unary(self) -> Node:
        # Excel: unary minus binds tighter than ^ (=-2^2 is 4)
        tok = self.peek()
        if tok and tok.kind == "op" and tok.text in "+-":
            self.i += 1
            return Node("unary", tok.text, [self.unary()])
        return self.postfix()

    def postfix(self) -> Node:
        node = self.primary()
        while (tok := self.peek()) and tok.text == "%":
            self.i += 1
            node = Node("percent", None, [node])
        return node

    def primary(self) -> Node:
        tok = self.take()
        if tok.kind == "num":
            return Node("num", float(tok.text.replace(",", ".")))
        if tok.kind == "str":
            return Node("str", tok.text[1:-1].replace('""', '"'))
        if tok.kind == "bool":
            return Node("bool", tok.text == "ИСТИНА")
        if tok.kind == "ref":
            return Node("ref", parse_ref(tok.text))
        if tok.kind == "func":
            name = tok.text.upper()
            self.take("(")
            args: list[Node] = []
            if self.peek() and self.peek().text == ")":  # type: ignore[union-attr]
                self.i += 1
                return Node("func", name, args)
            while True:
                nxt = self.peek()
                if nxt and nxt.text in (";", ")"):
                    args.append(Node("missing"))
                else:
                    args.append(self.binary(0))
                sep = self.take()
                if sep.text == ")":
                    return Node("func", name, args)
                if sep.text != ";":
                    raise FormulaError(f"expected ; or ) in {self.formula!r}")
        if tok.text == "(":
            node = self.binary(0)
            self.take(")")
            return node
        raise FormulaError(f"unexpected {tok.text!r} in {self.formula!r}")


def parse(formula: str) -> Node:
    if not formula.startswith("="):
        raise FormulaError(f"a formula starts with '=': {formula!r}")
    return Parser(formula).parse()


def function_names(formula: str) -> list[str]:
    return [t.text.upper() for t in tokenize(formula) if t.kind == "func"]


# conversions ----------------------------------------------------------------

NUMBER_INPUT = re.compile(r"[+-]?(\d+(,\d*)?|,\d+)([Ee][+-]?\d+)?")
DATE_INPUT = re.compile(r"(\d{1,2})\.(\d{1,2})\.(\d{4})")
EPOCH = datetime.date(1899, 12, 30)


def date_serial(day: datetime.date) -> float:
    return float((day - EPOCH).days)


def serial_date(serial: float) -> datetime.date:
    return EPOCH + datetime.timedelta(days=math.floor(serial))


def parse_number_text(text: str) -> float | None:
    """Russian-locale text Excel reads as a number: ``12,5``, ``15%``, ``01.10.2026``."""
    s = text.strip().replace(" ", "").replace(" ", "")
    percent = s.endswith("%")
    if percent:
        s = s[:-1]
    if NUMBER_INPUT.fullmatch(s):
        value = float(s.replace(",", "."))
        return value / 100 if percent else value
    m = DATE_INPUT.fullmatch(s)
    if m and not percent:
        try:
            return date_serial(datetime.date(int(m.group(3)), int(m.group(2)), int(m.group(1))))
        except ValueError:
            return None
    return None


def typed(text: str) -> Value:
    """What Excel stores when ``text`` is typed into a cell (not a formula)."""
    if text == "":
        return EMPTY
    if text.startswith("'"):
        return text[1:]
    if text.upper() in ("ИСТИНА", "ЛОЖЬ"):
        return text.upper() == "ИСТИНА"
    number = parse_number_text(text)
    return number if number is not None else text


def format_number(x: float) -> str:
    """General format of a Russian-locale cell: up to 15 significant digits."""
    if x == 0:
        return "0"
    if x == int(x) and abs(x) < 1e15:
        return str(int(x))
    text = f"{x:.15g}"
    if "e" in text:
        mant, exp = text.split("e")
        return f"{mant.replace('.', ',')}E{int(exp):+03d}"
    return text.replace(".", ",")


def display(value: Value) -> str:
    if isinstance(value, Err):
        return value.code
    if value is EMPTY:
        return ""
    if isinstance(value, bool):
        return "ИСТИНА" if value else "ЛОЖЬ"
    if isinstance(value, float):
        return format_number(value)
    return str(value)


def to_number(v: Value) -> float:
    if isinstance(v, Err):
        raise SheetError(v)
    if isinstance(v, bool):
        return 1.0 if v else 0.0
    if v is EMPTY:
        return 0.0
    if isinstance(v, float):
        return v
    n = parse_number_text(str(v))
    if n is None:
        raise SheetError(VALUE)
    return n


def to_text(v: Value) -> str:
    if isinstance(v, Err):
        raise SheetError(v)
    return display(v)


def to_bool(v: Value) -> bool:
    if isinstance(v, Err):
        raise SheetError(v)
    if isinstance(v, bool):
        return v
    if v is EMPTY:
        return False
    if isinstance(v, float):
        return v != 0
    up = str(v).upper()
    if up in ("ИСТИНА", "TRUE"):
        return True
    if up in ("ЛОЖЬ", "FALSE"):
        return False
    raise SheetError(VALUE)


def type_rank(v: Value) -> int:
    if isinstance(v, bool):
        return 2
    if isinstance(v, str):
        return 1
    return 0


def compare(a: Value, b: Value) -> int:
    """Excel ordering: numbers < text < logical; text ignores case; blank adapts."""
    for v in (a, b):
        if isinstance(v, Err):
            raise SheetError(v)
    if a is EMPTY:
        a = "" if isinstance(b, str) else (False if isinstance(b, bool) else 0.0)
    if b is EMPTY:
        b = "" if isinstance(a, str) else (False if isinstance(a, bool) else 0.0)
    ra, rb = type_rank(a), type_rank(b)  # type: ignore[arg-type]
    if ra != rb:
        return -1 if ra < rb else 1
    if isinstance(a, str):
        s, t = a.lower(), str(b).lower()
        return (s > t) - (s < t)
    x, y = float(a), float(b)  # type: ignore[arg-type]
    return (x > y) - (x < y)


# ranges ---------------------------------------------------------------------


@dataclass
class Range:
    """A rectangle of evaluated values plus where it came from (for SUBTOTAL)."""

    rows: list[list[Value]]
    ref: Ref
    sheet: Sheet

    def flat(self) -> list[Value]:
        return [v for row in self.rows for v in row]

    @property
    def shape(self) -> tuple[int, int]:
        return len(self.rows), len(self.rows[0]) if self.rows else 0


def round_decimal(x: float, digits: int, mode: str) -> float:
    q = Decimal(1).scaleb(-digits)
    return float(Decimal(repr(x)).quantize(q, rounding=mode))


# criteria -------------------------------------------------------------------


def wildcard(pattern: str) -> re.Pattern:
    out, i = [], 0
    while i < len(pattern):
        ch = pattern[i]
        if ch == "~" and i + 1 < len(pattern) and pattern[i + 1] in "*?~":
            out.append(re.escape(pattern[i + 1]))
            i += 2
            continue
        out.append(".*" if ch == "*" else "." if ch == "?" else re.escape(ch))
        i += 1
    return re.compile("".join(out), re.I | re.S)


def criterion(crit: Value):
    """A predicate for СЧЁТЕСЛИ-family criteria."""
    if isinstance(crit, Err):
        raise SheetError(crit)
    if crit is EMPTY:
        crit = 0.0  # an empty criterion cell means 0
    if isinstance(crit, bool):
        return lambda v: isinstance(v, bool) and v == crit
    if isinstance(crit, float):
        return lambda v: (
            (isinstance(v, float) and not isinstance(v, bool) and v == crit)
            or (isinstance(v, str) and parse_number_text(v) == crit)
        )
    text = str(crit)
    m = re.match(r"(<=|>=|<>|<|>|=)?(.*)", text, re.S)
    assert m
    op, rest = m.group(1) or "=", m.group(2)
    number = parse_number_text(rest) if rest != "" else None
    if rest.upper() in ("ИСТИНА", "ЛОЖЬ"):
        flag = rest.upper() == "ИСТИНА"
        if op == "=":
            return lambda v: isinstance(v, bool) and v == flag
        if op == "<>":
            return lambda v: not (isinstance(v, bool) and v == flag)
    if number is not None:

        def num_test(v: Value) -> bool:
            if isinstance(v, bool) or not isinstance(v, float):
                return op == "<>"
            return {
                "=": v == number,
                "<>": v != number,
                "<": v < number,
                ">": v > number,
                "<=": v <= number,
                ">=": v >= number,
            }[op]

        return num_test
    if rest == "":
        if op == "=":
            return lambda v: v is EMPTY or v == ""
        if op == "<>":
            return lambda v: not (v is EMPTY or v == "")
    if op in ("=", "<>"):
        rx = wildcard(rest)

        def text_test(v: Value) -> bool:
            hit = isinstance(v, str) and rx.fullmatch(v) is not None
            return hit if op == "=" else not hit

        return text_test

    def text_order(v: Value) -> bool:
        if not isinstance(v, str):
            return False
        c = (v.lower() > rest.lower()) - (v.lower() < rest.lower())
        return {"<": c < 0, ">": c > 0, "<=": c <= 0, ">=": c >= 0}[op]

    return text_order


# functions ------------------------------------------------------------------

# Russian name → English name (chapter 24 of the source). One place for export
# to .xlsx and for future hints.
NAMES_EN = {
    "СУММ": "SUM",
    "СЧЁТ": "COUNT",
    "СЧЁТЗ": "COUNTA",
    "СЧИТАТЬПУСТОТЫ": "COUNTBLANK",
    "СРЗНАЧ": "AVERAGE",
    "МИН": "MIN",
    "МАКС": "MAX",
    "НАИМЕНЬШИЙ": "SMALL",
    "НАИБОЛЬШИЙ": "LARGE",
    "ЕСЛИ": "IF",
    "И": "AND",
    "ИЛИ": "OR",
    "НЕ": "NOT",
    "СЧЁТЕСЛИ": "COUNTIF",
    "СЧЁТЕСЛИМН": "COUNTIFS",
    "СУММЕСЛИ": "SUMIF",
    "СУММЕСЛИМН": "SUMIFS",
    "СРЗНАЧЕСЛИ": "AVERAGEIF",
    "СРЗНАЧЕСЛИМН": "AVERAGEIFS",
    "ОСТАТ": "MOD",
    "ABS": "ABS",
    "ЦЕЛОЕ": "INT",
    "ОТБР": "TRUNC",
    "ОКРУГЛ": "ROUND",
    "ОКРУГЛВВЕРХ": "ROUNDUP",
    "ОКРУГЛВНИЗ": "ROUNDDOWN",
    "ВПР": "VLOOKUP",
    "ИНДЕКС": "INDEX",
    "ПОИСКПОЗ": "MATCH",
    "ПРОМЕЖУТОЧНЫЕ.ИТОГИ": "SUBTOTAL",
    "ДЛСТР": "LEN",
    "ЛЕВСИМВ": "LEFT",
    "ПРАВСИМВ": "RIGHT",
    "ПСТР": "MID",
    "СЖПРОБЕЛЫ": "TRIM",
    "ПОДСТАВИТЬ": "SUBSTITUTE",
    "СОВПАД": "EXACT",
    "ЗНАЧЕН": "VALUE",
    "ЕЧИСЛО": "ISNUMBER",
    "ЕТЕКСТ": "ISTEXT",
    "ДАТА": "DATE",
    "ДЕНЬ": "DAY",
    "МЕСЯЦ": "MONTH",
    "ГОД": "YEAR",
    "ЕСЛИОШИБКА": "IFERROR",
    "ЕСНД": "IFNA",
    "СТРОКА": "ROW",
    "СУММКВ": "SUMSQ",
}
# Lazy functions get unevaluated nodes; Excel evaluates only the chosen branch.
LAZY = {"ЕСЛИ", "ЕСЛИОШИБКА", "ЕСНД", "СТРОКА"}


def to_english(formula: str) -> str:
    """The formula as an .xlsx file stores it: English names, ``,`` and ``.``."""
    out, pos = [], 0
    for tok in tokenize(formula):
        rep = None
        if tok.kind == "func":
            rep = NAMES_EN.get(tok.text.upper(), tok.text)
        elif tok.kind == "op" and tok.text == ";":
            rep = ","
        elif tok.kind == "num":
            rep = tok.text.replace(",", ".")
        elif tok.kind == "bool":
            rep = "TRUE" if tok.text == "ИСТИНА" else "FALSE"
        if rep is not None:
            out.append(formula[pos : tok.start] + rep)
            pos = tok.start + len(tok.text)
    out.append(formula[pos:])
    return "".join(out)


# book -----------------------------------------------------------------------


@dataclass
class Sheet:
    name: str
    inputs: dict[tuple[int, int], str] = field(default_factory=dict)
    filtered: set[int] = field(default_factory=set)  # rows hidden by a filter
    hidden: set[int] = field(default_factory=set)  # rows hidden by hand

    def set(self, addr: str, text: str) -> None:
        self.inputs[parse_address(addr)] = text

    def bounds(self) -> tuple[int, int]:
        if not self.inputs:
            return 0, 0
        return max(r for r, _ in self.inputs), max(c for _, c in self.inputs)


class Book:
    """Sheets of typed inputs; values are computed on demand with a cache."""

    def __init__(self) -> None:
        self.sheets: dict[str, Sheet] = {}
        self.cache: dict[tuple[str, int, int], Value] = {}
        self.stack: set[tuple[str, int, int]] = set()
        self.here: list[int] = []  # rows of the cells being computed, for СТРОКА()

    def sheet(self, name: str) -> Sheet:
        if name not in self.sheets:
            self.sheets[name] = Sheet(name)
        return self.sheets[name]

    def set(self, sheet: str, addr: str, text: str) -> None:
        self.sheet(sheet).set(addr, text)
        self.cache.clear()

    def value(self, sheet: str, addr: str) -> Value:
        row, col = parse_address(addr)
        try:
            return self.cell(self.sheet(sheet), row, col)
        except SheetError as e:
            return e.err

    def cell(self, sheet: Sheet, row: int, col: int) -> Value:
        key = (sheet.name, row, col)
        if key in self.cache:
            return self.cache[key]
        text = sheet.inputs.get((row, col), "")
        if not text.startswith("="):
            return typed(text)
        if key in self.stack:
            raise SheetError(CYCLE)
        self.stack.add(key)
        self.here.append(row)
        try:
            value = self.formula(text, sheet)
        finally:
            self.stack.discard(key)
            self.here.pop()
        self.cache[key] = value
        return value

    def formula(self, text: str, sheet: Sheet) -> Value:
        """Evaluate a formula as if it stood on ``sheet``."""
        try:
            node = parse(text)
        except FormulaError:
            return NAME
        try:
            result = self.eval(node, sheet)
        except SheetError as e:
            if e.err is CYCLE:
                raise
            return e.err
        if isinstance(result, Range):
            if result.shape == (1, 1):
                return result.rows[0][0] if result.rows[0][0] is not EMPTY else 0.0
            return VALUE  # a whole range in one cell: no implicit intersection here
        if result is EMPTY:
            return 0.0  # =A1 of an empty cell shows 0
        return result

    # evaluation ------------------------------------------------------------
    def target(self, ref: Ref, sheet: Sheet) -> Sheet:
        if ref.sheet is None:
            return sheet
        if ref.sheet not in self.sheets:
            raise SheetError(REF)
        return self.sheets[ref.sheet]

    def range(self, ref: Ref, sheet: Sheet) -> Range:
        src = self.target(ref, sheet)
        rows = [
            [self.cell(src, r, c) for c in range(ref.c1, ref.c2 + 1)]
            for r in range(ref.r1, ref.r2 + 1)
        ]
        return Range(rows, ref, src)

    def eval(self, node: Node, sheet: Sheet) -> Any:
        kind = node.kind
        if kind in ("num", "str", "bool"):
            return node.value
        if kind == "missing":
            return EMPTY
        if kind == "ref":
            ref: Ref = node.value  # type: ignore[assignment]
            if ref.is_range:
                return self.range(ref, sheet)
            return self.cell(self.target(ref, sheet), ref.r1, ref.c1)
        if kind == "unary":
            v = to_number(self.scalar(node.args[0], sheet))
            return -v if node.value == "-" else v
        if kind == "percent":
            return to_number(self.scalar(node.args[0], sheet)) / 100
        if kind == "binary":
            return self.binary(node, sheet)
        if kind == "func":
            return self.call(node, sheet)
        raise AssertionError(kind)

    def scalar(self, node: Node, sheet: Sheet) -> Value:
        v = self.eval(node, sheet)
        if isinstance(v, Range):
            if v.shape == (1, 1):
                return v.rows[0][0]
            raise SheetError(VALUE)
        return v

    def binary(self, node: Node, sheet: Sheet) -> Value:
        op = node.value
        a = self.scalar(node.args[0], sheet)
        b = self.scalar(node.args[1], sheet)
        if op == "&":
            return to_text(a) + to_text(b)
        if op in ("=", "<>", "<", ">", "<=", ">="):
            c = compare(a, b)
            return {
                "=": c == 0,
                "<>": c != 0,
                "<": c < 0,
                ">": c > 0,
                "<=": c <= 0,
                ">=": c >= 0,
            }[op]  # type: ignore[index]
        x, y = to_number(a), to_number(b)
        if op == "+":
            return x + y
        if op == "-":
            return x - y
        if op == "*":
            return x * y
        if op == "/":
            if y == 0:
                raise SheetError(DIV0)
            return x / y
        if op == "^":
            if x == 0 and y < 0:
                raise SheetError(DIV0)
            try:
                result = x**y
            except (OverflowError, ZeroDivisionError):
                raise SheetError(NUM) from None
            if isinstance(result, complex):
                raise SheetError(NUM)
            return float(result)
        raise AssertionError(op)

    def call(self, node: Node, sheet: Sheet) -> Value:
        name = node.value
        impl = FUNCTIONS.get(name)  # type: ignore[arg-type]
        if impl is None:
            raise SheetError(NAME)
        if name in LAZY:
            return impl(self, sheet, node.args)
        # a reference stays a range inside a function: СУММ(A1) ignores text in A1
        args = [
            self.range(a.value, sheet) if a.kind == "ref" else self.eval(a, sheet)  # type: ignore[arg-type]
            for a in node.args
        ]
        return impl(self, sheet, args)


# helpers for function implementations -----------------------------------------


def need(args: list, low: int, high: int | None = None) -> None:
    high = low if high is None else high
    if not low <= len(args) <= high:
        raise SheetError(VALUE)


def scalar(v) -> Value:
    if isinstance(v, Range):
        if v.shape == (1, 1):
            return v.rows[0][0]
        raise SheetError(VALUE)
    return v


def numbers(args: list, *, direct_text: bool = True) -> list[float]:
    """Numbers for СУММ/СРЗНАЧ/МИН/МАКС: ranges give only numbers; direct arguments
    convert logical values and numeric text (other text is #ЗНАЧ!)."""
    out = []
    for a in args:
        if isinstance(a, Range):
            for v in a.flat():
                if isinstance(v, Err):
                    raise SheetError(v)
                if isinstance(v, float) and not isinstance(v, bool):
                    out.append(v)
        elif a is EMPTY:
            continue
        elif isinstance(a, Err):
            raise SheetError(a)
        elif isinstance(a, str) and not direct_text:
            continue
        else:
            out.append(to_number(a))
    return out


def f_sum(book, sheet, args):
    return float(math.fsum(numbers(args)))


def f_sumsq(book, sheet, args):
    return float(math.fsum(x * x for x in numbers(args)))


def f_count(book, sheet, args):
    n = 0
    for a in args:
        if isinstance(a, Range):
            n += sum(1 for v in a.flat() if isinstance(v, float) and not isinstance(v, bool))
        elif isinstance(a, bool) or isinstance(a, float):
            n += 1
        elif isinstance(a, str) and parse_number_text(a) is not None:
            n += 1
    return float(n)


def f_counta(book, sheet, args):
    n = 0
    for a in args:
        if isinstance(a, Range):
            n += sum(1 for v in a.flat() if v is not EMPTY)
        elif a is not EMPTY:
            n += 1
    return float(n)


def f_countblank(book, sheet, args):
    need(args, 1)
    if not isinstance(args[0], Range):
        raise SheetError(VALUE)
    return float(sum(1 for v in args[0].flat() if v is EMPTY or v == ""))


def f_average(book, sheet, args):
    xs = numbers(args)
    if not xs:
        raise SheetError(DIV0)
    return math.fsum(xs) / len(xs)


def f_min(book, sheet, args):
    xs = numbers(args)
    return min(xs) if xs else 0.0


def f_max(book, sheet, args):
    xs = numbers(args)
    return max(xs) if xs else 0.0


def kth(args, reverse: bool):
    need(args, 2)
    xs = sorted(numbers([args[0]]), reverse=reverse)
    k = to_number(scalar(args[1]))
    k = math.ceil(k)
    if not xs or not 1 <= k <= len(xs):
        raise SheetError(NUM)
    return xs[k - 1]


def logicals(args: list) -> list[bool]:
    out = []
    for a in args:
        if isinstance(a, Range):
            for v in a.flat():
                if isinstance(v, Err):
                    raise SheetError(v)
                if isinstance(v, bool):
                    out.append(v)
                elif isinstance(v, float):
                    out.append(v != 0)
        elif a is EMPTY:
            continue
        else:
            out.append(to_bool(a))
    if not out:
        raise SheetError(VALUE)
    return out


def f_if(book: Book, sheet, nodes):
    need(nodes, 1, 3)
    cond = to_bool(book.scalar(nodes[0], sheet))
    if cond:
        if len(nodes) < 2 or nodes[1].kind == "missing":
            return 0.0 if len(nodes) >= 2 else True
        return book.eval(nodes[1], sheet)
    if len(nodes) < 3:
        return False
    if nodes[2].kind == "missing":
        return 0.0
    return book.eval(nodes[2], sheet)


def f_iferror(book: Book, sheet, nodes):
    need(nodes, 2)
    try:
        v = book.eval(nodes[0], sheet)
    except SheetError as e:
        if e.err is CYCLE:
            raise
        return book.eval(nodes[1], sheet)
    if isinstance(v, Err):
        return book.eval(nodes[1], sheet)
    return v


def f_ifna(book: Book, sheet, nodes):
    """ЕСНД: the second argument replaces only #Н/Д; other errors stay."""
    need(nodes, 2)
    try:
        v = book.eval(nodes[0], sheet)
    except SheetError as e:
        if e.err is NA:
            return book.eval(nodes[1], sheet)
        raise
    if v is NA:
        return book.eval(nodes[1], sheet)
    return v


def as_range(a, book: Book, sheet: Sheet) -> Range:
    if not isinstance(a, Range):
        raise SheetError(VALUE)
    return a


def f_countif(book, sheet, args):
    need(args, 2)
    rng = as_range(args[0], book, sheet)
    test = criterion(scalar(args[1]))
    return float(sum(1 for v in rng.flat() if not isinstance(v, Err) and test(v)))


def ifs_mask(args: list) -> tuple[list[bool], tuple[int, int]]:
    if len(args) % 2:
        raise SheetError(VALUE)
    shape = None
    mask: list[bool] = []
    for i in range(0, len(args), 2):
        rng = args[i]
        if not isinstance(rng, Range):
            raise SheetError(VALUE)
        if shape is None:
            shape = rng.shape
            mask = [True] * len(rng.flat())
        elif rng.shape != shape:
            raise SheetError(VALUE)
        test = criterion(scalar(args[i + 1]))
        for j, v in enumerate(rng.flat()):
            if mask[j] and (isinstance(v, Err) or not test(v)):
                mask[j] = False
    assert shape is not None
    return mask, shape


def f_countifs(book, sheet, args):
    if not args:
        raise SheetError(VALUE)
    mask, _ = ifs_mask(args)
    return float(sum(mask))


def resized(book: Book, base: Range, rng: Range) -> list[Value]:
    """СУММЕСЛИ's sum range takes the shape of the tested range from its corner."""
    rows, cols = base.shape
    ref = Ref(rng.ref.sheet, rng.ref.r1, rng.ref.c1, rng.ref.r1 + rows - 1, rng.ref.c1 + cols - 1)
    return book.range(ref, rng.sheet).flat()


def summable(values: list[Value], mask: list[bool]) -> list[float]:
    out = []
    for v, ok in zip(values, mask, strict=True):
        if not ok:
            continue
        if isinstance(v, Err):
            raise SheetError(v)
        if isinstance(v, float) and not isinstance(v, bool):
            out.append(v)
    return out


def f_sumif(book, sheet, args):
    need(args, 2, 3)
    rng = as_range(args[0], book, sheet)
    test = criterion(scalar(args[1]))
    mask = [not isinstance(v, Err) and test(v) for v in rng.flat()]
    values = rng.flat() if len(args) == 2 else resized(book, rng, as_range(args[2], book, sheet))
    return math.fsum(summable(values, mask))


def f_sumifs(book, sheet, args):
    if len(args) < 3:
        raise SheetError(VALUE)
    total = as_range(args[0], book, sheet)
    mask, shape = ifs_mask(args[1:])
    if total.shape != shape:
        raise SheetError(VALUE)
    return math.fsum(summable(total.flat(), mask))


def f_averageif(book, sheet, args):
    need(args, 2, 3)
    rng = as_range(args[0], book, sheet)
    test = criterion(scalar(args[1]))
    mask = [not isinstance(v, Err) and test(v) for v in rng.flat()]
    values = rng.flat() if len(args) == 2 else resized(book, rng, as_range(args[2], book, sheet))
    xs = summable(values, mask)
    if not xs:
        raise SheetError(DIV0)
    return math.fsum(xs) / len(xs)


def f_averageifs(book, sheet, args):
    if len(args) < 3:
        raise SheetError(VALUE)
    total = as_range(args[0], book, sheet)
    mask, shape = ifs_mask(args[1:])
    if total.shape != shape:
        raise SheetError(VALUE)
    xs = summable(total.flat(), mask)
    if not xs:
        raise SheetError(DIV0)
    return math.fsum(xs) / len(xs)


def num_args(args, low, high=None) -> list[float]:
    need(args, low, high)
    return [to_number(scalar(a)) for a in args]


def f_mod(book, sheet, args):
    n, d = num_args(args, 2)
    if d == 0:
        raise SheetError(DIV0)
    return n - d * math.floor(n / d)


def f_round(mode_pos: str, mode_neg: str):
    def impl(book, sheet, args):
        x, digits = num_args(args, 2)
        mode = mode_pos if x >= 0 else mode_neg
        return round_decimal(x, int(digits), mode)

    return impl


def f_trunc(book, sheet, args):
    xs = num_args(args, 1, 2)
    digits = int(xs[1]) if len(xs) > 1 else 0
    return round_decimal(xs[0], digits, ROUND_DOWN)


def f_int(book, sheet, args):
    (x,) = num_args(args, 1)
    return float(math.floor(x))


def f_abs(book, sheet, args):
    (x,) = num_args(args, 1)
    return abs(x)


def lookup_equal(a: Value, b: Value) -> bool:
    if isinstance(a, Err) or isinstance(b, Err):
        return False
    if a is EMPTY or b is EMPTY:
        return False
    if type_rank(a) != type_rank(b):  # type: ignore[arg-type]
        return False
    if isinstance(a, str):
        return wildcard(a).fullmatch(str(b)) is not None if isinstance(b, str) else False
    return a == b


def approximate(key: Value, values: list[Value], descending: bool = False) -> int:
    """Position (0-based) of the last value ≤ key in sorted data, or -1."""
    found = -1
    for i, v in enumerate(values):
        if v is EMPTY or isinstance(v, Err) or type_rank(v) != type_rank(key):  # type: ignore[arg-type]
            continue
        c = compare(v, key)
        if (c <= 0) if not descending else (c >= 0):
            found = i
        else:
            break
    return found


def f_vlookup(book, sheet, args):
    need(args, 3, 4)
    key = scalar(args[0])
    if isinstance(key, Err):
        raise SheetError(key)
    table = as_range(args[1], book, sheet)
    col = int(to_number(scalar(args[2])))
    exact = len(args) == 4 and not to_bool(scalar(args[3]) if args[3] is not EMPTY else False)
    if len(args) == 4 and args[3] is EMPTY:
        exact = True
    if col < 1:
        raise SheetError(VALUE)
    if col > table.shape[1]:
        raise SheetError(REF)
    first = [row[0] for row in table.rows]
    if exact:
        for i, v in enumerate(first):
            if lookup_equal(key, v):
                return table.rows[i][col - 1]
        raise SheetError(NA)
    i = approximate(key, first)
    if i < 0:
        raise SheetError(NA)
    return table.rows[i][col - 1]


def f_match(book, sheet, args):
    need(args, 2, 3)
    key = scalar(args[0])
    if isinstance(key, Err):
        raise SheetError(key)
    rng = as_range(args[1], book, sheet)
    if 1 not in rng.shape:
        raise SheetError(NA)
    kind = int(to_number(scalar(args[2]))) if len(args) == 3 else 1
    values = rng.flat()
    if kind == 0:
        for i, v in enumerate(values):
            if lookup_equal(key, v):
                return float(i + 1)
        raise SheetError(NA)
    i = approximate(key, values, descending=kind < 0)
    if i < 0:
        raise SheetError(NA)
    return float(i + 1)


def f_index(book, sheet, args):
    need(args, 2, 3)
    rng = as_range(args[0], book, sheet)
    rows, cols = rng.shape
    a = int(to_number(scalar(args[1])))
    b = int(to_number(scalar(args[2]))) if len(args) == 3 and args[2] is not EMPTY else None
    if b is None:
        if rows == 1:
            r, c = 1, a
        elif cols == 1:
            r, c = a, 1
        else:
            raise SheetError(REF)
    else:
        r, c = a, b
    if r < 1 or c < 1 or r > rows or c > cols:
        raise SheetError(REF)
    return rng.rows[r - 1][c - 1]


SUBTOTAL_OPS = {1: f_average, 2: f_count, 3: f_counta, 4: f_max, 5: f_min, 9: f_sum}


def f_subtotal(book, sheet, args):
    if len(args) < 2:
        raise SheetError(VALUE)
    code = int(to_number(scalar(args[0])))
    base = code - 100 if code > 100 else code
    if base not in SUBTOTAL_OPS:
        raise SheetError(VALUE)
    visible = []
    for a in args[1:]:
        rng = as_range(a, book, sheet)
        rows = []
        for offset, row in enumerate(rng.rows):
            r = rng.ref.r1 + offset
            if r in rng.sheet.filtered or (code > 100 and r in rng.sheet.hidden):
                continue
            # values computed by another ПРОМЕЖУТОЧНЫЕ.ИТОГИ are skipped
            cells = []
            for k, v in enumerate(row):
                text = rng.sheet.inputs.get((r, rng.ref.c1 + k), "")
                skip = text.startswith("=") and "ПРОМЕЖУТОЧНЫЕ.ИТОГИ" in text.upper()
                cells.append(EMPTY if skip else v)
            rows.append(cells)
        visible.append(Range(rows or [[]], rng.ref, rng.sheet))
    return SUBTOTAL_OPS[base](book, sheet, visible)


def text_arg(a) -> str:
    return to_text(scalar(a))


def f_len(book, sheet, args):
    need(args, 1)
    return float(len(text_arg(args[0])))


def f_left(book, sheet, args):
    need(args, 1, 2)
    n = int(to_number(scalar(args[1]))) if len(args) == 2 else 1
    if n < 0:
        raise SheetError(VALUE)
    return text_arg(args[0])[:n]


def f_right(book, sheet, args):
    need(args, 1, 2)
    n = int(to_number(scalar(args[1]))) if len(args) == 2 else 1
    if n < 0:
        raise SheetError(VALUE)
    text = text_arg(args[0])
    return text[len(text) - n :] if n else ""


def f_mid(book, sheet, args):
    need(args, 3)
    text = text_arg(args[0])
    start, n = int(to_number(scalar(args[1]))), int(to_number(scalar(args[2])))
    if start < 1 or n < 0:
        raise SheetError(VALUE)
    return text[start - 1 : start - 1 + n]


def f_trim(book, sheet, args):
    need(args, 1)
    return re.sub(" +", " ", text_arg(args[0]).strip(" "))


def f_substitute(book, sheet, args):
    need(args, 3, 4)
    text, old, new = text_arg(args[0]), text_arg(args[1]), text_arg(args[2])
    if old == "":
        return text
    if len(args) == 3:
        return text.replace(old, new)
    k = int(to_number(scalar(args[3])))
    if k < 1:
        raise SheetError(VALUE)
    pos = -1
    for _ in range(k):
        pos = text.find(old, pos + 1)
        if pos < 0:
            return text
    return text[:pos] + new + text[pos + len(old) :]


def f_exact(book, sheet, args):
    need(args, 2)
    return text_arg(args[0]) == text_arg(args[1])


def f_value(book, sheet, args):
    need(args, 1)
    v = scalar(args[0])
    if isinstance(v, float) and not isinstance(v, bool):
        return v
    if isinstance(v, Err):
        raise SheetError(v)
    if v is EMPTY:
        return 0.0
    if isinstance(v, bool):
        raise SheetError(VALUE)
    n = parse_number_text(str(v))
    if n is None:
        raise SheetError(VALUE)
    return n


def f_isnumber(book, sheet, args):
    need(args, 1)
    v = scalar(args[0])
    return isinstance(v, float) and not isinstance(v, bool)


def f_istext(book, sheet, args):
    need(args, 1)
    return isinstance(scalar(args[0]), str)


def f_and(book, sheet, args):
    return all(logicals(args))


def f_or(book, sheet, args):
    return any(logicals(args))


def f_not(book, sheet, args):
    need(args, 1)
    return not to_bool(scalar(args[0]))


def f_row(book: Book, sheet, nodes):
    """СТРОКА(): the row of the cell itself; СТРОКА(B7): the row of a reference."""
    need(nodes, 0, 1)
    if nodes:
        if nodes[0].kind != "ref":
            raise SheetError(VALUE)
        return float(nodes[0].value.r1)
    if not book.here:
        raise SheetError(VALUE)
    return float(book.here[-1])


def f_date(book, sheet, args):
    y, m, d = (int(x) for x in num_args(args, 3))
    if 0 <= y < 1900:
        y += 1900
    y += (m - 1) // 12
    m = (m - 1) % 12 + 1
    try:
        day = datetime.date(y, m, 1) + datetime.timedelta(days=d - 1)
    except (ValueError, OverflowError):
        raise SheetError(NUM) from None
    serial = date_serial(day)
    if serial < 1:
        raise SheetError(NUM)
    return serial


def date_part(part: str):
    def impl(book, sheet, args):
        (x,) = num_args(args, 1)
        if x < 0:
            raise SheetError(NUM)
        return float(getattr(serial_date(x), part))

    return impl


FUNCTIONS = {
    "СУММ": f_sum,
    "СЧЁТ": f_count,
    "СЧЁТЗ": f_counta,
    "СЧИТАТЬПУСТОТЫ": f_countblank,
    "СРЗНАЧ": f_average,
    "МИН": f_min,
    "МАКС": f_max,
    "НАИМЕНЬШИЙ": lambda book, sheet, args: kth(args, reverse=False),
    "НАИБОЛЬШИЙ": lambda book, sheet, args: kth(args, reverse=True),
    "ЕСЛИ": f_if,
    "И": f_and,
    "ИЛИ": f_or,
    "НЕ": f_not,
    "СЧЁТЕСЛИ": f_countif,
    "СЧЁТЕСЛИМН": f_countifs,
    "СУММЕСЛИ": f_sumif,
    "СУММЕСЛИМН": f_sumifs,
    "СРЗНАЧЕСЛИ": f_averageif,
    "СРЗНАЧЕСЛИМН": f_averageifs,
    "ОСТАТ": f_mod,
    "ABS": f_abs,
    "ЦЕЛОЕ": f_int,
    "ОТБР": f_trunc,
    "ОКРУГЛ": f_round(ROUND_HALF_UP, ROUND_HALF_UP),
    "ОКРУГЛВВЕРХ": f_round(ROUND_CEILING, ROUND_FLOOR),
    "ОКРУГЛВНИЗ": f_round(ROUND_FLOOR, ROUND_CEILING),
    "ВПР": f_vlookup,
    "ИНДЕКС": f_index,
    "ПОИСКПОЗ": f_match,
    "ПРОМЕЖУТОЧНЫЕ.ИТОГИ": f_subtotal,
    "ДЛСТР": f_len,
    "ЛЕВСИМВ": f_left,
    "ПРАВСИМВ": f_right,
    "ПСТР": f_mid,
    "СЖПРОБЕЛЫ": f_trim,
    "ПОДСТАВИТЬ": f_substitute,
    "СОВПАД": f_exact,
    "ЗНАЧЕН": f_value,
    "ЕЧИСЛО": f_isnumber,
    "ЕТЕКСТ": f_istext,
    "ДАТА": f_date,
    "ДЕНЬ": date_part("day"),
    "МЕСЯЦ": date_part("month"),
    "ГОД": date_part("year"),
    "ЕСЛИОШИБКА": f_iferror,
    "ЕСНД": f_ifna,
    "СТРОКА": f_row,
    "СУММКВ": f_sumsq,
}
assert set(FUNCTIONS) == set(NAMES_EN)


def evaluate(formula: str, cells: dict[str, str] | None = None) -> Value:
    """Evaluate one formula on a single sheet filled from ``{"A1": "5", …}``."""
    book = Book()
    sheet = book.sheet("Лист1")
    for addr, text in (cells or {}).items():
        sheet.set(addr, text)
    return book.formula(formula, sheet)
