"""Independent recomputation of every task answer in topic 18.

Usage: python3 -I content/lesson-design/topic-18/checks.py

The lesson fills a table of best sums cell by cell (datasets.py does the same
in Python). Here every answer is recomputed another way:

- small fields of the text: every route is enumerated (a generator, never a list);
- fields of the workbooks: the best sum to a cell is asked recursively from the
  finish backwards with memoisation, so cells are visited in another order;
- the main exam types are computed a third time by the stand's spreadsheet
  evaluator (sheet_eval) on the whole field, with the formulas the lesson teaches:
  ``=ЕСЛИ(ИЛИ(ЕЧИСЛО(…);ЕЧИСЛО(…));…+МАКС(…);"X")``, a single arrival at a wall,
  «X» in a cell without arrivals;
- typical mistakes (a cut-off cell counted as 0, walls ignored, only the bottom
  right finish) must change the answer, so a task really tests the point.

Every expected answer must appear verbatim in the answers of its page.
Exit code 1 if any check fails.
"""

from __future__ import annotations

import importlib.util
import sys
from collections.abc import Iterator
from functools import cache
from pathlib import Path
from typing import Any

D = Path(__file__).resolve().parent
sys.path.insert(0, str(D))
sys.path.insert(0, str(D.parents[2] / "scripts" / "lesson_design"))
sys.setrecursionlimit(20000)

from sheet_eval import Book, address, display  # noqa: E402


def _datasets() -> Any:
    """topic-18/datasets.py: the fields of the workbooks (data, not the method)."""
    spec = importlib.util.spec_from_file_location("topic18_datasets", D / "datasets.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules["topic18_datasets"] = module
    spec.loader.exec_module(module)
    return module


ds = _datasets()

PAGES = {
    1: "01-luchshaya-summa-do-kletki.md",
    2: "02-tablica-v-excel.md",
    3: "03-steny.md",
    4: "04-nedostizhimye-i-finishi.md",
    5: "05-napravleniya-i-zapuski.md",
    6: "06-diagonali-i-cena-shaga.md",
    7: "07-usloviya-perehoda.md",
    8: "08-ladya-i-chislo-marshrutov.md",
    9: "09-praktika-i-itog.md",
}

Cell = tuple[int, int]
checks: list[tuple[str, str, bool]] = []


def answers(page: int) -> str:
    text = (D / PAGES[page]).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


def text(page: int) -> str:
    return (D / PAGES[page]).read_text(encoding="utf-8")


def expect(page: int, needle: str, where: str = "answers") -> None:
    hay = answers(page) if where == "answers" else text(page)
    checks.append((PAGES[page], needle, needle in hay))


def same(label: str, a, b) -> None:
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def differ(label: str, a, b) -> None:
    checks.append(("—", f"{label}: {a} ≠ {b}", a != b))


# --- small fields: every route --------------------------------------------------------------

RD = [(0, 1), (1, 0)]


def routes(f: Any, start: Cell, moves=RD, stop=None) -> Iterator[list[Cell]]:
    """Every route from start; a route ends where ``stop(cell)`` is true or no move is left."""

    def go(path: list[Cell]) -> Iterator[list[Cell]]:
        r, c = path[-1]
        if stop and stop((r, c)):
            yield path
            return
        nxt = [(r + dr, c + dc) for dr, dc in moves if f.can(r, c, dr, dc)]
        if not nxt:
            if stop is None:
                yield path
            return
        for cell in nxt:
            yield from go(path + [cell])

    yield from go([start])


def coins_of(f: Any, path: list[Cell]) -> int:
    return sum(f.a[r][c] for r, c in path)


def to_cell(f: Any, target: Cell, start: Cell = (0, 0), moves=RD) -> list[int]:
    return [coins_of(f, p) for p in routes(f, start, moves, stop=lambda x: x == target)]


def field(rows, right=(), down=(), dark=()) -> Any:
    return ds.Field([list(r) for r in rows], set(right), set(down), set(dark))


def cell(name: str) -> Cell:
    return int(name[1:]) - 1, "ABCDEFGHIJKLMNOPQRSTUVWXYZ".index(name[0])


F4 = field([[2, 7, 4, 1], [5, 1, 8, 3], [2, 6, 2, 9], [4, 3, 7, 2]])
EX = field([[3, 4, 2], [1, 8, 5], [6, 2, 7]])

# --- 1. Лучшая сумма до клетки ----------------------------------------------------------------
s = to_cell(F4, (3, 3))
same("4 × 4: 20 маршрутов, 35 и 25", (len(s), max(s), min(s)), (20, 35, 25))
expect(1, "**максимум 35, минимум 25**", "text")
expect(1, "2 + 7 + 1 + 8 + 2 + 9 + 2 = 31", "text")
expect(1, "2 + 5 + 1 + 6 + 3 + 7 + 2 = 26", "text")
g = field([[1, 9, 1], [8, 1, 1], [100, 100, 1]])
first_right = [
    coins_of(g, p) for p in routes(g, (0, 0), stop=lambda x: x == (2, 2)) if p[1] == (0, 1)
]
same("жадный контрпример", (max(first_right), max(to_cell(g, (2, 2)))), (112, 210))
via_c3 = sorted({coins_of(F4, p) for p in routes(F4, (0, 0), stop=lambda x: x == (2, 2))})
same("суммы в C3: есть 17 и наибольшая 23", (17 in via_c3, max(via_c3)), (True, 23))
expect(
    1, f"Максимум 4 + max(29; 20) = {4 + max(29, 20)}, минимум 4 + min(18; 15) = {4 + min(18, 15)}."
)
expect(1, "4 + 7 = 11 перемещений и 12 клеток")
same("6 × 6 из четвёрок", set(to_cell(field([[4] * 6] * 6), (5, 5))), {44})
expect(1, "11 · 4 = 44")
gr = field([[1, 5, 1], [4, 3, 2], [9, 9, 1]])
expect(1, f"Наибольшая сумма {max(to_cell(gr, (2, 2)))}: A1 → A2 → A3 → B3 → C3.")
s = to_cell(EX, (2, 2))
expect(1, f"Ответ: {max(s)} и {min(s)}.")
neg = field([[-2, 5, -1], [4, -6, 3], [-3, 2, -4]])
s = to_cell(neg, (2, 2))
expect(1, f"Максимум {max(s)} (A1")
expect(1, f"минимум −{-min(s)} (A1")
f9 = field([[6, 4, 15, 11, 8], [7, 16, 16, 6, 16], [10, 15, 9, 7, 9], [4, 11, 17, 6, 8]])
s = to_cell(f9, (3, 4))
expect(1, f"`{max(s)}{min(s)}`")

# --- 2. Таблица в Excel ------------------------------------------------------------------------
c2 = field([[2, 7, 4, 1], [5, 1, 1, 3], [2, 6, 2, 9], [4, 3, 7, 2]])
same("C2 = 1: максимум", max(to_cell(c2, (3, 3))), 29)
expect(2, "максимум станет 29", "text")


@cache
def _best(name: str, pick: str, r: int, c: int, moves: tuple, start: Cell, gain: str):
    """Recursive best total from the start to (r, c), asked from the finish backwards."""
    f = FIELDS[name]
    if (r, c) == start:
        return f.a[r][c]
    if (r, c) in f.dark:
        return None
    cands = []
    for dr, dc in moves:
        pr, pc = r - dr, c - dc
        if 0 <= pr < f.h and 0 <= pc < f.w and f.can(pr, pc, dr, dc):
            prev = _best(name, pick, pr, pc, moves, start, gain)
            if prev is not None:
                add = abs(f.a[r][c] - f.a[pr][pc]) if gain == "diff" else f.a[r][c]
                cands.append(prev + add)
    if not cands:
        return None
    return max(cands) if pick == "max" else min(cands)


FIELDS = {name: make() for name, make in ds.FIELDS.items()}


def best(name, pick, cell_: Cell, moves=RD, start: Cell = (0, 0), gain="coin"):
    return _best(name, pick, cell_[0], cell_[1], tuple(moves), start, gain)


def val(name, pick, cell_: Cell, moves=RD, start: Cell = (0, 0), gain="coin") -> int:
    v = best(name, pick, cell_, moves, start, gain)
    assert v is not None, (name, cell_)
    return v


def ends(name: str, moves=RD, start: Cell = (0, 0), gain="coin") -> list[Cell]:
    f = FIELDS[name]
    return [
        (r, c)
        for r in range(f.h)
        for c in range(f.w)
        if best(name, "max", (r, c), moves, start, gain) is not None
        and not any(f.can(r, c, dr, dc) for dr, dc in moves)
    ]


b1 = (best("18-1", "max", (14, 14)), best("18-1", "min", (14, 14)))
expect(2, f"`{b1[0]}{b1[1]}`")
j10 = (best("18-1", "min", (9, 9)), best("18-1", "max", (9, 9)))
expect(2, f"`{j10[0]}{j10[1]}`")


# --- the spreadsheet evaluator on a whole field ----------------------------------------------


def sheet_table(name: str, pick: str = "МАКС", naive: bool = False) -> dict[Cell, str]:
    """The lesson's block for a right-and-down field under the field (as on the exam):
    general formula with ЕЧИСЛО, a single arrival at a wall, «X» without arrivals.
    ``naive``: the mistake — a cell without arrivals gets just its coin."""
    f = FIELDS[name]
    off = f.h + 1
    book = Book()
    for r in range(f.h):
        for c in range(f.w):
            book.set("L", address(r + 1, c + 1), str(f.a[r][c]))
    for r in range(f.h):
        for c in range(f.w):
            here, coin = address(r + 1 + off, c + 1), address(r + 1, c + 1)
            left = address(r + 1 + off, c) if c and f.can(r, c - 1, 0, 1) else None
            top = address(r + off, c + 1) if r and f.can(r - 1, c, 1, 0) else None
            if (r, c) == (0, 0):
                formula = f"={coin}"
            elif left and top:
                formula = (
                    f'=ЕСЛИ(ИЛИ(ЕЧИСЛО({left});ЕЧИСЛО({top}));{coin}+{pick}({left};{top});"X")'
                )
            elif left or top:
                one = left or top
                formula = f'=ЕСЛИ(ЕЧИСЛО({one});{coin}+{one};"X")'
            else:
                formula = f"={coin}" if naive else "X"
            if naive and (left or top) and (r, c) != (0, 0):
                parts = ";".join(x for x in (left, top) if x)
                formula = f"={coin}+{pick}({parts})"
            book.set("L", here, formula)
    return {
        (r, c): display(book.value("L", address(r + 1 + off, c + 1)))
        for r in range(f.h)
        for c in range(f.w)
    }


def sheet_corners(name: str, naive: bool = False) -> tuple[int, int]:
    mx, mn = sheet_table(name, "МАКС", naive), sheet_table(name, "МИН", naive)
    f = FIELDS[name]
    fin = [
        (r, c)
        for r in range(f.h)
        for c in range(f.w)
        if mx[(r, c)] != "X" and not any(f.can(r, c, dr, dc) for dr, dc in RD)
    ]
    return max(int(mx[x]) for x in fin), min(int(mn[x]) for x in fin)


# --- 3. Стены ---------------------------------------------------------------------------------
w4 = field(F4.a, right={(3, 2)}, down={(0, 2)})
s = to_cell(w4, (3, 3))
same("4 × 4 со стенами", (max(s), min(s)), (32, 27))
expect(3, "**максимум 32, минимум 27**", "text")
expect(3, "Остаётся только верхний предшественник: максимум 4 + 20 = 24, минимум 4 + 15 = 19.")
s = to_cell(field(EX.a, down={(0, 1)}), (2, 2))
expect(3, f"{max(s)} и {min(s)}: в `B2`")
s = to_cell(field(F4.a, right={(3, 2), (2, 1)}, down={(0, 2)}), (3, 3))
expect(3, f"Максимум {max(s)}, минимум {min(s)}: `C3`")
b2 = (best("18-2", "max", (19, 19)), best("18-2", "min", (19, 19)))
expect(3, f"`{b2[0]}{b2[1]}`")
mx2 = sheet_table("18-2", "МАКС")
mn2 = sheet_table("18-2", "МИН")
same("18-2 формулами листа", (int(mx2[(19, 19)]), int(mn2[(19, 19)])), b2)
nowall = ds.fixed(ds.Field(FIELDS["18-2"].a))
differ("18-2 без стен", nowall, b2)
expect(3, f"Без учёта стен получилось бы {nowall[0]} и {nowall[1]}.")

# --- 4. Недостижимые клетки и финиши ----------------------------------------------------------
W3 = field([[2, 9, 1], [5, 4, 8], [1, 7, 3]], right={(0, 1), (1, 0), (1, 1)}, down={(1, 1)})
vals = [coins_of(W3, p) for p in routes(W3, (0, 0))]
same("3 × 3 со стенами: суммы на остановках", sorted(vals), [15, 18])
expect(4, "**максимум 18, минимум 15**", "text")
a2 = [coins_of(W3, p) for p in routes(W3, (1, 0))]
same("старт в A2", a2, [16])
P = field([[4, 2, 7], [3, 9, 1], [6, 5, 8]], right={(0, 0), (2, 1)}, down={(1, 1)})
vals = [coins_of(P, p) for p in routes(P, (0, 0))]
expect(4, f"Максимум {max(vals)}, минимум {min(vals)}.")
e3 = ends("18-3")
mx3 = [val("18-3", "max", x) for x in e3]
mn3 = [val("18-3", "min", x) for x in e3]
ans3 = (max(mx3), min(mn3))
expect(4, f"`{ans3[0]}{ans3[1]}`")
same("18-3 формулами листа", sheet_corners("18-3"), ans3)
naive3 = sheet_corners("18-3", naive=True)
differ("18-3: отрезанные клетки нулём", naive3[1], ans3[1])
expect(4, f"минимум ошибочно станет {naive3[1]}")
only_corner = (best("18-3", "max", (19, 19)), best("18-3", "min", (19, 19)))
differ("18-3: только правый нижний угол", only_corner, ans3)
cut = sum(1 for r in range(20) for c in range(20) if best("18-3", "max", (r, c)) is None)
same("18-3 «X» листа", sum(v == "X" for v in sheet_table("18-3").values()), cut)
expect(4, f"`{cut}`")
e4 = ends("18-4", RD, ds.START_4)
ans4 = (
    max(val("18-4", "max", x, RD, ds.START_4) for x in e4),
    min(val("18-4", "min", x, RD, ds.START_4) for x in e4),
)
expect(4, f"`{ans4[0]}{ans4[1]}`")

# --- 5. Направления и запуски -----------------------------------------------------------------
LD = [(0, -1), (1, 0)]
s = to_cell(EX, (2, 0), (0, 2), LD)
expect(5, f"{max(s)} и {min(s)}: максимальный маршрут")
s = to_cell(F4, (3, 0), (0, 3), LD)
same("4 × 4 влево и вниз", (max(s), min(s)), (29, 24))
expect(5, "максимум 29; блок с `МИН` даёт минимум 24", "text")
s = [coins_of(F4, p) for p in routes(F4, (1, 1), stop=lambda x: x == (3, 3))]
expect(5, f"4. {min(s)} — значение `G2`")
st4 = field(F4.a, right={(1, 0), (2, 1)}, down={(0, 1), (1, 2)})
starts4 = [
    (r, c)
    for r in range(4)
    for c in range(4)
    if not st4.can(r, c, 0, -1) and not st4.can(r, c, -1, 0)
]
same("4 × 4 со стенами: старты", starts4, [(0, 0), (1, 1), (2, 2)])
to_d4 = {x: [coins_of(st4, p) for p in routes(st4, x, stop=lambda y: y == (3, 3))] for x in starts4}
hi4 = sorted((max(v) for v in to_d4.values()), reverse=True)
lo4 = sorted(min(v) for v in to_d4.values())
same("старты: суммы до D4", (hi4, lo4), ([35, 23, 13], [11, 19, 25]))
expect(
    5,
    f"**общий максимум {hi4[0]} + {hi4[1]} = {hi4[0] + hi4[1]}, общий минимум {lo4[0]} + {lo4[1]} = {lo4[0] + lo4[1]}**",
    "text",
)
expect(5, "Максимум 95 + 95 = 190")
expect(5, "минимум 33 + 39 = 72")
e5 = ends("18-5", LD, (0, 19))
ans5 = (
    min(val("18-5", "min", x, LD, (0, 19)) for x in e5),
    max(val("18-5", "max", x, LD, (0, 19)) for x in e5),
)
expect(5, f"`{ans5[0]}{ans5[1]}`")


def from_starts(name: str, k: int) -> tuple[int, int]:
    """Recursion forward from every start to the bottom right cell."""
    f = FIELDS[name]

    @cache
    def go(r: int, c: int, pick: str):
        if (r, c) == (f.h - 1, f.w - 1):
            return f.a[r][c]
        nxt = [go(r + dr, c + dc, pick) for dr, dc in RD if f.can(r, c, dr, dc)]
        nxt = [x for x in nxt if x is not None]
        if not nxt:
            return None
        return f.a[r][c] + (max(nxt) if pick == "max" else min(nxt))

    starts = [
        (r, c)
        for r in range(f.h)
        for c in range(f.w)
        if not f.can(r, c, 0, -1) and not f.can(r, c, -1, 0) and go(r, c, "max") is not None
    ]
    hi = sorted((v for r, c in starts if (v := go(r, c, "max")) is not None), reverse=True)
    lo = sorted(v for r, c in starts if (v := go(r, c, "min")) is not None)
    return sum(hi[:k]), sum(lo[:k])


r6 = from_starts("18-6", 3)
expect(5, f"`{r6[0]}{r6[1]}`")
differ("18-6: лучший старт три раза", r6[0], 3 * from_starts("18-6", 1)[0])

# --- 6. Диагонали, цена шага, запас ----------------------------------------------------------
DG = [(0, 1), (1, 0), (1, 1)]
s = to_cell(F4, (3, 3), (0, 0), DG)
same("4 × 4 с диагональю", (max(s), min(s)), (35, 7))
expect(6, "Минимум упал с 25 до **7**", "text")
s = to_cell(EX, (2, 2), (0, 0), DG)
expect(6, f"Максимум остаётся {max(s)}, минимум уменьшается до {min(s)}")
expect(6, f"Ответ {max(61, 58 + 12)}.")
E4 = field([[2, 7, 4, 1], [5, 1, 8, -1], [2, 6, 2, 9], [4, 3, -1, 2]], dark={(1, 3), (3, 2)})
finals = {}
for p in routes(E4, (0, 0)):
    finals.setdefault(p[-1], []).append(coins_of(E4, p))
cheap = {k: min(v) for k, v in finals.items()}
same("запас: финальные клетки", sorted(cheap), [(0, 3), (3, 1), (3, 3)])
same(
    "запас: какой-нибудь, любой, любым маршрутом",
    (min(cheap.values()), max(cheap.values()), max(max(v) for v in finals.values())),
    (14, 27, 34),
)
expect(6, f"Две: `D1` ({cheap[(0, 3)]}) и `B4` ({cheap[(3, 1)]})")
b7 = (val("18-7", "max", (14, 14), DG), val("18-7", "min", (14, 14), DG))
expect(6, f"`{b7[0]} -{-b7[1]}`")
e8 = ends("18-8", RD, (0, 0), "diff")
need = [val("18-8", "min", x, RD, (0, 0), "diff") for x in e8]
expect(6, f"`{min(need)}{max(need)}`")

# --- 7. Условия перехода ------------------------------------------------------------------------


def parity_routes(a: list[list[int]]) -> tuple[int | None, int]:
    """Every route with the parity rules: the best sum at the bottom right cell
    and the cells no route reaches."""
    h, w = len(a), len(a[0])
    seen: set[Cell] = set()
    best_sum = None

    def go(r: int, c: int, total: int) -> Iterator[int]:
        seen.add((r, c))
        if (r, c) == (h - 1, w - 1):
            yield total
        if c + 1 < w and a[r][c] % 2 == a[r][c + 1] % 2:
            yield from go(r, c + 1, total + a[r][c + 1])
        if r + 1 < h and a[r][c] % 2 != a[r + 1][c] % 2:
            yield from go(r + 1, c, total + a[r + 1][c])
        if r + 1 < h and c + 1 < w:
            yield from go(r + 1, c + 1, total + a[r + 1][c + 1])

    for t in go(0, 0, a[0][0]):
        best_sum = t if best_sum is None else max(best_sum, t)
    return best_sum, h * w - len(seen)


same("чётность 3 × 3", parity_routes([[3, 5, 8], [4, 7, 2], [6, 1, 9]]), (19, 2))
same("чётность 3 × 3, C1 = 9", parity_routes([[3, 5, 9], [4, 7, 2], [6, 1, 9]]), (28, 1))
even = field([[0, 4, 2], [0, 8, 0], [6, 2, 0]])
s = to_cell(even, (2, 2))
expect(7, f"Максимум {max(s)}: A1")
expect(7, f"Минимум {min(s)}: A1")
cost = {}
for p in routes(F4, (0, 0)):
    for k in range(len(p)):
        cell_ = p[k]
        cost[cell_] = min(cost.get(cell_, 10**9), coins_of(F4, p[: k + 1]))
reach = [x for x, v in cost.items() if v <= 20]
expect(7, f"4. {len(reach)} клеток")
same("наибольшее число шагов", max(r + c for r, c in reach), 4)
mxroute = max(routes(F4, (0, 0)), key=lambda p: coins_of(F4, p))
expect(7, f"5. {sum(F4.a[r][c] % 2 for r, c in mxroute)}: маршрут")
via = [coins_of(F4, p) for p in routes(F4, (0, 0)) if (2, 1) in p]
expect(7, f"Наибольшая 16 + 19 − 6 = {max(via)}, наименьшая 14 + 17 − 6 = {min(via)}")
p10 = parity_routes(FIELDS["18-10"].a)
expect(7, f"`{p10[0]} {p10[1]}`")

# --- 8. Ладья и число маршрутов --------------------------------------------------------------
row = [4, -9, 6, -2, 5]
rook_row = max(
    row[0] + sum(row[i] for i in range(1, 4) if mask >> i & 1) + row[4] for mask in range(16)
)
expect(8, f"Ладья: 4 + 6 + 5 = {rook_row}")
R4 = [[3, -2, 5, -4], [-6, 4, -1, 2], [1, -3, 6, -5], [-2, 7, -8, 4]]


def rook_best(r: int, c: int, total: int) -> Iterator[int]:
    if (r, c) == (3, 3):
        yield total
    for k in range(c + 1, 4):
        yield from rook_best(r, k, total + R4[r][k])
    for k in range(r + 1, 4):
        yield from rook_best(k, c, total + R4[k][c])


same("ладья 4 × 4", max(rook_best(0, 0, R4[0][0])), 16)
same("одиночные шаги 4 × 4", max(to_cell(field(R4), (3, 3))), 10)
expect(8, "Ладья собирает до 16, а робот одиночными шагами на этом поле — только 10", "text")
same("маршрутов 5 × 5", len(list(routes(field([[1] * 5] * 5), (0, 0)))), 70)
expect(8, "3. 70:")
expect(8, f"4. {len(list(routes(w4, (0, 0), stop=lambda x: x == (3, 3))))}:")
H = field([[5, 7, 6, 9], [4, 8, 7, 6], [6, 5, 9, 8], [7, 6, 8, 10]])


def height_routes(f: Any, limit: int, target: Cell) -> Iterator[list[Cell]]:
    def go(path):
        r, c = path[-1]
        if (r, c) == target:
            yield path
            return
        for dr, dc in RD:
            nr, nc = r + dr, c + dc
            if nr < f.h and nc < f.w and abs(f.a[nr][nc] - f.a[r][c]) <= limit:
                yield from go(path + [(nr, nc)])

    yield from go([(0, 0)])


same("высоты 4 × 4: маршрутов", sum(1 for _ in height_routes(H, 2, (3, 3))), 8)
seen = {x for p in height_routes(H, 2, (3, 3)) for x in p}
reach_h = {(0, 0)}
for r in range(4):
    for c in range(4):
        if (r, c) != (0, 0) and any(
            (r - dr, c - dc) in reach_h and abs(H.a[r][c] - H.a[r - dr][c - dc]) <= 2
            for dr, dc in RD
        ):
            reach_h.add((r, c))
same("высоты 4 × 4: недостижимых", 16 - len(reach_h), 1)
del seen
f9h = FIELDS["18-9"]


@cache
def count_to(r: int, c: int) -> int:
    if (r, c) == (0, 0):
        return 1
    total = 0
    for dr, dc in RD:
        pr, pc = r - dr, c - dc
        if pr >= 0 and pc >= 0 and abs(f9h.a[r][c] - f9h.a[pr][pc]) <= 50:
            total += count_to(pr, pc)
    return total


n9 = count_to(14, 14)
zero9 = sum(1 for r in range(15) for c in range(15) if count_to(r, c) == 0)
expect(8, f"`{n9} {zero9}`")

# --- 9. Практика и итог ----------------------------------------------------------------------
hi3 = sorted(mx3, reverse=True)[:2]
lo3 = sorted(mn3)[:2]
expect(9, f"`{sum(hi3)}{sum(lo3)}`")
expect(9, f"{hi3[0]} + {hi3[1]}, две наименьшие — {lo3[0]} + {lo3[1]}")
e2 = ends("18-2")
f2 = (max(val("18-2", "max", x) for x in e2), min(val("18-2", "min", x) for x in e2))
same("18-2 «угловые» формулами листа", sheet_corners("18-2"), f2)
expect(9, f"`{f2[0]}{f2[1]}`")
r62 = from_starts("18-6", 2)
expect(9, f"`{r62[0]}{r62[1]}`")
d1 = (best("18-1", "max", (14, 14), DG), best("18-1", "min", (14, 14), DG))
expect(9, f"`{d1[0]}{d1[1]}`")
e4a = ends("18-4")
f5 = (max(val("18-4", "max", x) for x in e4a), min(val("18-4", "min", x) for x in e4a))
same("18-4 «угловые» формулами листа", sheet_corners("18-4"), f5)
expect(9, f"`{f5[0]}{f5[1]}`")

# --- the answers of datasets.py agree --------------------------------------------------------
same("datasets 4.8", ds.TASKS["4.8"][1](), ans3)
same("datasets 5.8", ds.TASKS["5.8"][1](), r6)
same("datasets 6.8", ds.TASKS["6.8"][1]()[:2], (min(need), max(need)))
same("datasets 8.7", ds.TASKS["8.7"][1](), (n9, zero9))

bad = [x for x in checks if not x[2]]
for f_, needle, ok in checks:
    if not ok:
        print(f"FAIL {f_}: {needle}")
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
