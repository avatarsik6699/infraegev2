"""Independent recomputation of every task answer in topic 9.

Usage: python3 -I content/lesson-design/topic-9/checks.py

The lesson solves a row with Counter, sets and sorted copies (datasets.py does
the same). Here every answer is recomputed another way:

- structures of repeats come from runs of a sorted row (itertools.groupby);
- groups of repeated and single numbers come from the frequency band
  [a.count(x) for x in a], as the spreadsheet builds it;
- answers that the lesson also solves in a spreadsheet are computed a third
  time by the stand's formula evaluator (sheet_eval) on the whole table, with
  the formulas shown in the answers;
- typical mistakes (a strict sign instead of a non-strict one, «or» instead of
  «exactly one») must change the answer, so a task really tests the point.

Every expected answer must appear verbatim in the answers of its page.
Exit code 1 if any check fails.
"""

from __future__ import annotations

import sys
from itertools import groupby
from pathlib import Path

D = Path(__file__).resolve().parent
sys.path.insert(0, str(D.parents[2] / "scripts" / "lesson_design"))

from sheet_eval import Book, address, shift  # noqa: E402

PAGES = {
    1: "01-stroka-i-uslovie.md",
    2: "02-summa-krajnie-srednie.md",
    3: "03-povtory-v-stroke.md",
    4: "04-povtoryayushchiesya-i-odinochnye.md",
    5: "05-chetnost-i-osobye-chisla.md",
    6: "06-poryadok-i-nomer-stroki.md",
    7: "07-treugolniki.md",
    8: "08-yachejka-stolbec-sosedi.md",
    9: "09-praktika-i-itog.md",
}


def answers(page: int) -> str:
    text = (D / PAGES[page]).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


def read(name: str) -> list[list[int]]:
    text = (D / "files" / f"{name}.txt").read_text(encoding="utf-8")
    return [[int(x) for x in line.split()] for line in text.splitlines()]


checks: list[tuple[str, str, bool]] = []


def expect(page: int, needle: str) -> None:
    checks.append((PAGES[page], needle, needle in answers(page)))


def same(label: str, a, b) -> None:
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def differ(label: str, a, b) -> None:
    checks.append(("—", f"{label}: {a} ≠ {b}", a != b))


# --- another way to see repeats ------------------------------------------------------


def runs(a: list[int]) -> list[int]:
    """Sizes of groups of equal values, by runs of the sorted row."""
    return sorted(len(list(g)) for _, g in groupby(sorted(a)))


def band(a: list[int]) -> list[int]:
    return [a.count(x) for x in a]


def singles(a: list[int]) -> list[int]:
    return [x for x, k in zip(a, band(a), strict=True) if k == 1]


def repeats(a: list[int]) -> list[int]:
    return [x for x, k in zip(a, band(a), strict=True) if k > 1]


def total(rows, check) -> int:
    return sum(map(bool, map(check, rows)))


def sheet_count(rows: list[list[int]], formula: str, extra: dict[int, str] | None = None) -> int:
    """Put the table on a sheet, copy the row formula down, sum the marks.

    ``formula`` is written for row 1 in the column right after the data (or
    after the helper columns of ``extra``: column number → formula of row 1).
    """
    book = Book()
    sheet = book.sheet("Л")
    width = len(rows[0])
    helpers = extra or {}
    mark = max([width, *helpers]) + 1
    for r, a in enumerate(rows, start=1):
        for c, x in enumerate(a, start=1):
            sheet.inputs[(r, c)] = str(x)
        for c, f in helpers.items():
            sheet.inputs[(r, c)] = shift(f, r - 1, 0)
        sheet.inputs[(r, mark)] = shift(formula, r - 1, 0)
    marks = [book.cell(sheet, r, mark) for r in range(1, len(rows) + 1)]
    assert all(isinstance(m, float) for m in marks), "a mark is not a number"
    return int(sum(m for m in marks if isinstance(m, float)))


def band_columns(width: int) -> dict[int, str]:
    """Frequency band right of the data: =СЧЁТЕСЛИ($A1:$F1;A1) and so on."""
    last = address(1, width).rstrip("1")
    return {width + 1 + j: f"=СЧЁТЕСЛИ($A1:${last}1;{address(1, j + 1)})" for j in range(width)}


TEXTBOOK = read("9")

# --- 1. Строка, условие и признак ----------------------------------------------------
same("9.txt — таблица исходника", TEXTBOOK[0], [2, 2, 5, 7, 9, 11])
sums = [sum(a) for a in TEXTBOOK]
same("сумма > 30", sum(s > 30 for s in sums), 4)
expect(1, f"Не меньше 34 — {sum(s >= 34 for s in sums)} строки")
expect(1, f"больше 34 — {sum(s > 34 for s in sums)} строки")
big = [x for a in TEXTBOOK for x in a if x > 20]
expect(1, f"{['Ноль', 'Одно', 'Два', 'Три'][len(big)]} числа (22, 24, 26), но одна строка")
f16 = "=ЕСЛИ(И(СУММ(A1:F1)>30;МИН(A1:F1)<=2);1;0)"
expect(1, f"подходят {sheet_count(TEXTBOOK, f16)} строки — первая, третья и четвёртая")
t1 = read("9-1")
f17 = "=ЕСЛИ(И(СУММ(A1:F1)>300;МАКС(A1:F1)<90);1;0)"
n17 = sheet_count(t1, f17)
same("1.7 таблицей и программой", n17, total(t1, lambda a: sum(a) > 300 and max(a) < 90))
expect(1, f"`{n17}`")
f18 = "=ЕСЛИ((МАКС(A1:F1)>95)<>(МИН(A1:F1)<5);1;0)"
n18 = sheet_count(t1, f18)
same("1.8 таблицей и программой", n18, total(t1, lambda a: (max(a) > 95) + (min(a) < 5) == 1))
differ("1.8 с «хотя бы одним»", n18, total(t1, lambda a: max(a) > 95 or min(a) < 5))
expect(1, f"`{n18}`")

# --- 2. Сумма, крайние и средние -----------------------------------------------------
row = [1, 5, 6, 7, 8]
same("упр. 1: 2(m + M) и остальные", 2 * (min(row) + max(row)), sum(sorted(row)[1:-1]))
row = [3, 3, 8, 10, 10]
expect(2, f"S − m − M = {sum(row)} − {min(row)} − {max(row)} = {sum(row) - min(row) - max(row)}")
expect(2, f"останется {[x for x in row if x not in (min(row), max(row))][0]}")
row = sorted([4, 9, 9, 6])
expect(2, f"Второе наибольшее {row[-2]} (повтор считается), второе наименьшее {row[1]}")
expect(2, f"{(3 + 6) ** 2} и {3 * 3 + 6 * 6}")
expect(2, f"25 · 4 = {25 * 4} > 33 · 3 = {33 * 3}")
row = [1, 2, 3, 13]
expect(2, f"13 > 2 · {sum(row) - 13} = {2 * (sum(row) - 13)}")


def sq_check(a):
    b = sorted(a)
    return (b[0] + b[-1]) ** 2 > sum(x * x for x in b[1:-1])


f27 = "=ЕСЛИ((МИН(A1:F1)+МАКС(A1:F1))^2>СУММКВ(A1:F1)-МИН(A1:F1)^2-МАКС(A1:F1)^2;1;0)"
n27 = sheet_count(t1, f27)
same("2.7 таблицей и программой", n27, total(t1, sq_check))
expect(2, f"`{n27}`")
n28 = total(t1, lambda a: (min(a) + max(a)) * 4 > sum(sorted(a)[1:-1]) * 2)
same(
    "2.8 средние через сортировку",
    n28,
    sheet_count(
        t1, "=ЕСЛИ(СРЗНАЧ(МИН(A1:F1);МАКС(A1:F1))>(СУММ(A1:F1)-МИН(A1:F1)-МАКС(A1:F1))/4;1;0)"
    ),
)
expect(2, f"`{n28}`")
n29 = total(t1, lambda a: sorted(a)[-1] > 3 * sum(sorted(a)[:-1]) / 5)
expect(2, f"`{n29}`")

# --- 3. Повторы в строке -------------------------------------------------------------
row = [4, 4, 7, 9, 9, 9]
expect(3, f"Различных значений {len(set(row))}")
expect(3, f"{' + '.join(map(str, repeats(row)))} = {sum(repeats(row))}")
expect(3, f"полоса {', '.join(map(str, band([3, 3, 6, 6, 6, 8])))}")
row = [5, 1, 5, 8, 1, 5, 2]
expect(
    3,
    f"Структура {' + '.join(map(str, sorted(runs(row), reverse=True)))}, полоса {', '.join(map(str, band(row)))}",
)
t2 = read("9-2")


def rest3(a):
    b = sorted(a)
    return sum(b[1:-1])


n37 = total(t2, lambda a: runs(a) == [1] * 5 and 2 * (min(a) + max(a)) <= rest3(a))
f37 = "=ЕСЛИ(И(МАКС(F1:J1)=1;2*(МИН(A1:E1)+МАКС(A1:E1))<=СУММ(A1:E1)-МИН(A1:E1)-МАКС(A1:E1));1;0)"
same("3.7 таблицей", n37, sheet_count(t2, f37, band_columns(5)))
expect(3, f"`{n37}`")
t3 = read("9-3")
n38 = total(t3, lambda a: max(band(a)) > 1 and band(a)[a.index(max(a))] == 1)
expect(3, f"`{n38}`")
t4 = read("9-4")
n39 = total(t4, lambda a: runs(a) == [1, 1, 2, 3])
f39 = "=ЕСЛИ(И(СЧЁТЕСЛИ(H1:N1;3)=3;СЧЁТЕСЛИ(H1:N1;2)=2;СЧЁТЕСЛИ(H1:N1;1)=2);1;0)"
same("3.9 таблицей", n39, sheet_count(t4, f39, band_columns(7)))
expect(3, f"`{n39}`")

# --- 4. Повторяющиеся и неповторяющиеся ----------------------------------------------
row = [4, 4, 5, 6, 9, 12]
expect(4, f"(5 + 6 + 9 + 12) / 4 = {sum(singles(row)) // 4}, сумма пары тоже {sum(repeats(row))}")
row = [6, 6, 6, 1, 8, 3]
expect(
    4,
    f"С учётом повторений {sum(repeats(row))}, различных повторяющихся {sum(set(repeats(row)))}, неповторяющихся {sum(singles(row))}",
)
row = [2, 2, 9, 9, 9, 4, 5]
expect(
    4,
    f"{sum(set(repeats(row)))}; деление ({' + '.join(map(str, repeats(row)))}) / 2 даёт {sum(repeats(row)) / 2:.1f}".replace(
        ".", ","
    ),
)
row = [5, 5, 1, 8, 8, 3, 2]
r, s = repeats(row), singles(row)
expect(4, f"{sum(r)} · {len(s)} = {sum(r) * len(s)} > {sum(s)} · {len(r)} = {sum(s) * len(r)}")
n46 = total(
    TEXTBOOK,
    lambda a: (
        repeats(a)
        and singles(a)
        and sum(repeats(a)) * len(singles(a)) < sum(singles(a)) * len(repeats(a))
    ),
)
expect(4, f"6. {n46} строк")
n47 = total(t3, lambda a: runs(a) == [1, 1, 1, 3] and 3 * repeats(a)[0] >= sum(singles(a)))
f47 = "=ЕСЛИ(И(СЧЁТЕСЛИ(G1:L1;3)=3;СЧЁТЕСЛИ(G1:L1;1)=3;СУММЕСЛИ(G1:L1;3;A1:F1)>=СУММЕСЛИ(G1:L1;1;A1:F1));1;0)"
same("4.7 таблицей", n47, sheet_count(t3, f47, band_columns(6)))
differ(
    "4.7 со строгим знаком",
    n47,
    total(t3, lambda a: runs(a) == [1, 1, 1, 3] and 3 * repeats(a)[0] > sum(singles(a))),
)
expect(4, f"`{n47}`")
n48 = total(t4, lambda a: runs(a) == [1, 1, 2, 3] and min(repeats(a)) > min(singles(a)))
expect(4, f"`{n48}`")
n49 = total(t3, lambda a: runs(a) == [1, 1, 2, 2] and sum(repeats(a)) / 2 > sum(singles(a)))
f49 = "=ЕСЛИ(И(СЧЁТЕСЛИ(G1:L1;2)=4;СУММЕСЛИ(G1:L1;2;A1:F1)/2>СУММЕСЛИ(G1:L1;1;A1:F1));1;0)"
same("4.9 таблицей", n49, sheet_count(t3, f49, band_columns(6)))
expect(4, f"`{n49}`")
same(
    "учебная задача таблицей",
    sheet_count(
        TEXTBOOK,
        '=ЕСЛИ(И(СЧЁТЕСЛИ(G1:L1;2)=2;СЧЁТЕСЛИ(G1:L1;1)=4;СУММЕСЛИ(G1:L1;1;A1:F1)>4*СУММЕСЛИ(G1:L1;">1";A1:F1));1;0)',
        band_columns(6),
    ),
    2,
)

# --- 5. Чётность и особые числа ------------------------------------------------------
expect(5, f"{23 % 4}, {-7 % 2} и {0 % 2}")
row = [2, 4, 7, 9, 11]
ev = [x for x in row if x % 2 == 0]
expect(
    5,
    f"Чётных {len(ev)} (сумма {sum(ev)}), нечётных {len(row) - len(ev)} (сумма {sum(row) - sum(ev)})",
)
expect(5, f"21 % 4 = {21 % 4}")
row = [2, 9, 4, 16, 7, 12]
above = [x for x in row if x > sum(row) / len(row)]
expect(5, f"S = {sum(row)}: подходят числа с 6x > {sum(row)} — {', '.join(map(str, above))}")
row = [3, 10, 6, 8, 12, 5, 7]
expect(5, f"сумма {sum(row)}, {sum(row)} // 7 = {sum(row) // 7}")
same("целая часть в строке", sum(row) // 7 in row, True)
expect(5, f"Кубы: {', '.join(str(k**3) for k in range(1, 5))}")
t5 = read("9-5")


def parity_split(a):
    odd = [x for x in a if x & 1]
    even = [x for x in a if not x & 1]
    return even, odd


n57 = total(
    t5,
    lambda a: (
        len(parity_split(a)[0]) > len(parity_split(a)[1])
        and sum(parity_split(a)[1]) > sum(parity_split(a)[0])
    ),
)
f57 = "=ЕСЛИ(И(СЧЁТЕСЛИ(I1:P1;0)>СЧЁТЕСЛИ(I1:P1;1);СУММЕСЛИ(I1:P1;1;A1:H1)>СУММЕСЛИ(I1:P1;0;A1:H1));1;0)"
mods = {9 + j: f"=ОСТАТ({address(1, j + 1)};2)" for j in range(8)}
same("5.7 таблицей", n57, sheet_count(t5, f57, mods))
expect(5, f"`{n57}`")


def noticeable(a):
    mean = sum(a) / len(a)
    hi = [x for x in a if x > mean]
    even, odd = parity_split(a)
    return sum(x & 1 for x in hi) > sum(1 - (x & 1) for x in hi) and sum(even) > sum(odd)


expect(5, f"`{total(t5, noticeable)}`")
t6 = read("9-6")
squares = {k * k for k in range(1, 200)}
n59 = total(t6, lambda a: int(sum(a) / len(a)) in a and bool(squares & set(a)))
expect(5, f"`{n59}`")

# --- 6. Порядок и номер строки -------------------------------------------------------
expect(6, "Строго не возрастает из-за двух шестёрок. Не убывает")
row = sorted([14, 5, 11, 8])
same("прогрессия 14, 5, 11, 8", len({row[i + 1] - row[i] for i in range(3)}), 1)
expect(6, f"сумма крайних 2 + 9 = {2 + 9}, средних 4 + 5 = {4 + 5}")
expect(6, f"1 + 6 = 2 + 5 = {1 + 6}")
rows = [(3, 50), (7, 80), (10, 80)]
first = next(n for n, s in rows if s == max(s for _, s in rows))
last = [n for n, s in rows if s == max(s for _, s in rows)][-1]
expect(
    6,
    f"Первая — {first} (сравнение `>`), последняя — {last} (`>=`). Сумма номеров {sum(n for n, _ in rows)}",
)
expect(6, f"|−9| = {abs(min(-5, -9, 2))}, минимум модулей {min(abs(x) for x in (-5, -9, 2))}")
row = [5, 9, 2, 7, 4, 6, 8, 3]
expect(6, f"суммы {sum(row[:4])} и {sum(row[4:])}")
t7 = read("9-7")


def is_progression(a):
    b = sorted(a)
    return b[3] - b[0] == 3 * (b[1] - b[0]) and b[2] - b[1] == b[1] - b[0]


def splits(a):
    x, y, z, w = a
    return x + y == z + w or x + z == y + w or x + w == y + z


n67 = total(t7, lambda a: is_progression(a) and runs(a) == [1, 1, 1, 1])
f67 = "=ЕСЛИ(И(F1-E1=G1-F1;G1-F1=H1-G1;F1>E1);1;0)"
small = {5 + k: f"=НАИМЕНЬШИЙ($A1:$D1;{k + 1})" for k in range(4)}
same("6.7 таблицей", n67, sheet_count(t7, f67, small))
expect(6, f"`{n67}`")
n68 = total(t7, lambda a: splits(a) and not is_progression(a))
expect(6, f"`{n68}`")
t8 = read("9-8")
n69 = max(
    (
        n
        for n, a in enumerate(t8, start=1)
        if all(x <= y for x, y in zip(a, a[1:], strict=False)) and runs(a) == [1, 1, 1, 1, 3]
    ),
    default=0,
)
differ(
    "6.9 со строгим возрастанием",
    n69,
    max(
        (
            n
            for n, a in enumerate(t8, start=1)
            if all(x < y for x, y in zip(a, a[1:], strict=False)) and runs(a) == [1, 1, 1, 1, 3]
        ),
        default=0,
    ),
)
expect(6, f"`{n69}`")
hit = next(a for a in t8 if runs(a) == [1, 1, 1, 1, 1, 2] and sum(singles(a)) < repeats(a)[0])
expect(6, f"`{-min(hit) if min(hit) < 0 else min(hit)}`")

# --- 7. Треугольники -----------------------------------------------------------------
expect(7, "Обычного — нет: 5 + 7 = 12")
expect(7, f"{6 * 6} + {8 * 8} = {6 * 6 + 8 * 8} > {9 * 9}")
expect(7, f"25 + 36 = {25 + 36} < {8 * 8}")
expect(7, f"(4 + 9 = {4 + 9} < {10 * 10})")
expect(7, f"5 + 6 = {5 + 6} не меньше 9")
e = sorted([2, 2, 5])
expect(7, f"Площади {e[0] * e[1]}, {e[0] * e[2]}, {e[1] * e[2]}")
t9 = read("9-9")


def sides(a):
    p, q, r = sorted(a)
    return p, q, r


n77 = total(t9, lambda a: sides(a)[0] ** 2 + sides(a)[1] ** 2 == sides(a)[2] ** 2)
expect(7, f"`{n77}`")
n78 = total(t9, lambda a: sum(a) > 2 * max(a) and 2 * max(a) ** 2 > sum(x * x for x in a))
same(
    "7.8 таблицей",
    n78,
    sheet_count(t9, "=ЕСЛИ(И(СУММ(A1:C1)>2*МАКС(A1:C1);2*МАКС(A1:C1)^2>СУММКВ(A1:C1));1;0)"),
)
expect(7, f"`{n78}`")
n79 = total(
    t7,
    lambda a: any(
        sorted(t)[0] + sorted(t)[1] < sorted(t)[2]
        for t in ([a[i] for i in range(4) if i != k] for k in range(4))
    ),
)
expect(7, f"`{n79}`")
n710 = total(
    t9,
    lambda a: (
        2 * max(a[0] * a[1], a[0] * a[2], a[1] * a[2]) > a[0] * a[1] + a[0] * a[2] + a[1] * a[2]
    ),
)
expect(7, f"`{n710}`")

# --- 8. Ячейка, столбец, соседи ------------------------------------------------------
expect(8, f"23 − 4 = {23 - 4}")
expect(8, f"{(4 - 2) * (6 - 2)} ячеек, 5 — у {2 * (4 - 2) + 2 * (6 - 2)} краевых")
t10 = read("9-10")
H, W = len(t10), len(t10[0])
col = [[a[j] for a in t10] for j in range(W)]
flat = [x for a in t10 for x in a]


def good_cells(a):
    return sum(1 for j, x in enumerate(a) if a.count(x) == 1 and col[j].count(x) - 1 >= 30)


expect(8, f"`{total(t10, lambda a: good_cells(a) >= 2)}`")
counts = {x: flat.count(x) for x in set(flat)}
expect(8, f"`{total(t10, lambda a: any(a.count(x) == 1 and counts[x] - 1 == 160 for x in a))}`")


def peak(r, c):
    x = t10[r][c]
    around = [
        t10[i][j]
        for i in range(max(0, r - 1), min(H, r + 2))
        for j in range(max(0, c - 1), min(W, c + 2))
        if (i, j) != (r, c)
    ]
    return t10[r].count(x) == 1 and max(around) <= x


expect(8, f"`{sum(any(peak(r, c) for c in range(W)) for r in range(H))}`")

# --- 9. Практика и итог --------------------------------------------------------------
nf1 = total(t3, lambda a: runs(a) == [1, 1, 1, 1, 2] and sum(singles(a)) <= 4 * sum(repeats(a)))
differ(
    "итог 1 со строгим знаком",
    nf1,
    total(t3, lambda a: runs(a) == [1, 1, 1, 1, 2] and sum(singles(a)) < 4 * sum(repeats(a))),
)
expect(9, f"`{nf1}`")
nf2 = sheet_count(
    t1,
    "=ЕСЛИ(НАИБОЛЬШИЙ(A1:F1;1)+НАИБОЛЬШИЙ(A1:F1;2)<=СУММ(A1:F1)-НАИБОЛЬШИЙ(A1:F1;1)-НАИБОЛЬШИЙ(A1:F1;2);1;0)",
)
expect(9, f"`{nf2}`")
nf3 = max(
    n
    for n, a in enumerate(t4, start=1)
    if runs(a) == [1, 1, 1, 1, 3] and 4 * repeats(a)[0] > sum(singles(a))
)
expect(9, f"`{nf3}`")
nf4 = sum(
    n
    for n, a in enumerate(t5, start=1)
    if n % 2 == 0 and runs(a) == [1] * 8 and sum(x % 2 for x in a) == 4
)
expect(9, f"`{nf4}`")
nf5 = [sum(a) for a in t8 if all(x < y for x, y in zip(a, a[1:], strict=False))][-1]
expect(9, f"`{nf5}`")

bad = [c for c in checks if not c[2]]
for f, needle, ok in checks:
    if not ok:
        print(f"FAIL {f}: {needle}")
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
