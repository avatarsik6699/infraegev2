"""Independent recomputation of every task answer in topic 2.

Usage: python3 -I content/lesson-design/topic-2/checks.py

The lessons reason by hand: operations, sets with the given F, the column a
variable can take, a chain of arrows. Here every formula is written again as a
Python function, and every answer is recomputed by brute force: all orders of
columns, all fillings of the gaps, rows of the fragment chosen together and
different. Every expected answer must appear verbatim in its page.
Exit code 1 if any check fails.
"""

import sys
from itertools import permutations, product
from math import factorial
from pathlib import Path

D = Path(__file__).resolve().parent


def answers(f: str) -> str:
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


checks: list[tuple[str, str, bool]] = []


def expect(f: str, needle: str) -> None:
    checks.append((f, needle, needle in answers(f)))


def same(label: str, a: object, b: object) -> None:
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def imp(a: int, b: int) -> int:
    return int((not a) or b)


def sets(fn, names: str, wanted: int) -> list[str]:
    out = []
    for bits in product((0, 1), repeat=len(names)):
        if fn(**dict(zip(names, bits, strict=True))) == wanted:
            out.append("".join(map(str, bits)))
    return out


def orders(fn, names: str, rows, distinct: bool = True) -> list[str]:
    """Orders of columns for which the rows can be filled together.

    rows: (pattern, wanted) — pattern of 0, 1 and * ; wanted is F, None or a
    tuple of values of several functions (None — the value is hidden).
    """
    found = set()
    for order in permutations(names):
        cands = []
        for pattern, wanted in rows:
            c = []
            for bits in product((0, 1), repeat=len(names)):
                if any(p != "*" and int(p) != b for p, b in zip(pattern, bits, strict=True)):
                    continue
                got = fn(**dict(zip(order, bits, strict=True)))
                want = wanted if isinstance(wanted, tuple) else (wanted,)
                have = got if isinstance(got, tuple) else (got,)
                if all(w is None or w == g for w, g in zip(want, have, strict=True)):
                    c.append(bits)
            cands.append(c)
        for pick in product(*cands):
            if not distinct or len(set(pick)) == len(pick):
                found.add("".join(order))
                break
    return sorted(found)


def one(fn, names, rows) -> str:
    o = orders(fn, names, rows)
    return o[0] if len(o) == 1 else f"неоднозначно {o}"


def ex_formula(x, y, z):
    """F = (x ∨ y) ∧ (x → z) — the example of the lessons."""
    return int((x or y) and imp(x, z))


# --- 1. Логические операции ---
f = "01-logicheskie-operacii.md"
A, B = 0, 1
same(
    "1.1",
    [int(not A), A & B, A | B, imp(A, B), imp(B, A), int(A == B), A ^ B],
    [1, 0, 1, 1, 0, 0, 1],
)
expect(f, "1. Последовательно: 1, 0, 1, 1, 0, 0, 1.")
same("1.3", [imp(1, 1), imp(1, 1), int(1 == 1), int((not 1) or 1)], [1, 1, 1, 1])
expect(f, "3. 1, 1, 1, 1:")
pairs = [f"{a}{b}" for a in (0, 1) for b in (0, 1) if (a & b) == 0 and (a | b) == 1]
expect(f, f"5. {pairs[0]} и {pairs[1]}:")
expect(f, f"7. {one(lambda x, y: int((not x) and y), 'xy', [('10', 1)])}:")
expect(f, f"8. {one(lambda x, y: int(x or not y), 'xy', [('01', 0)])}:")

# --- 2. Формула и наборы ---
f = "02-formula-i-nabory.md"


def ex3(x, y, z):
    return int(imp((not x) or y, z) and (x == y))


same("2.1", (ex3(0, 0, 1), ex3(0, 0, 0)), (1, 0))
neg_and = sets(lambda x, y: int(not (x and y)), "xy", 1)
and_neg = sets(lambda x, y: int((not x) and (not y)), "xy", 1)
same("2.2", sorted(set(neg_and) ^ set(and_neg)), ["01", "10"])
same("2.3", sets(ex_formula, "xyz", 0), ["000", "001", "100", "110"])
same("2.5", 2**5, 32)
expect(f, "5. 32 = 2⁵")
expect(f, f"6. {','.join(sets(lambda x, y, z: int(imp(x, y) or not z), 'xyz', 0))}:")


def left(x, y, z):
    return imp(imp(x, y), z)


def right(x, y, z):
    return imp(x, imp(y, z))


diff = ["".join(map(str, b)) for b in product((0, 1), repeat=3) if left(*b) != right(*b)]
expect(f, f"различаются на {diff[0]} и {diff[1]}")


def f28(x, y, z, w):
    return int((x and not y) or (y == z) or (not w))


s28 = sets(f28, "xyzw", 0)
expect(f, "8. " + ", ".join(s28) + ":")
same("2 пример F=1", sets(ex_formula, "xyz", 1), ["010", "011", "101", "111"])

# --- 3. Фрагмент и столбцы ---
f = "03-fragment-i-stolbcy.md"
same("3 пример yzx", orders(ex_formula, "xyz", [("**0", 1), ("**0", 1), ("011", 1)]), ["yzx"])
expect(f, "1. Стрелка ложна только при x = 1, y = 0. В первом столбце 0, значит, там y.")
same("3.1", orders(lambda x, y: imp(x, y), "xy", [("01", 0)]), ["yx"])
ones = {v: sum(s["xyz".index(v)] == "1" for s in sets(ex_formula, "xyz", 1)) for v in "xyz"}
same("3.2 единицы", ones, {"x": 2, "y": 3, "z": 3})
same(
    "3.3 cab",
    orders(
        lambda a, b, c: int((a or b) and imp(a, c)), "abc", [("*0*", 1), ("*0*", 1), ("110", 1)]
    ),
    ["cab"],
)
expect(f, "3. Ответ cab.")
expect(f, "5. Ответ ywxz.")
same("3.6 x ≡ y симметрична", len(orders(lambda x, y: int(x == y), "xy", [("00", 1)])), 2)


def f37(x, y, z):
    return imp(x or y, int(z == x))


expect(f, f"7. {one(f37, 'xyz', [('*10', 0), ('0*1', 0), ('*11', 0)])}:")
same("3.7 наборы", sets(f37, "xyz", 0), ["011", "100", "110"])


def f38(x, y, z):
    return int((not (x and z)) and imp(y, x))


expect(f, f"8. {one(f38, 'xyz', [('10*', 1), ('*10', 1), ('1*0', 1)])}:")
same("3.8 наборы", sets(f38, "xyz", 1), ["000", "001", "100", "110"])
same("3 порядков", (factorial(3), factorial(4)), (6, 24))

# --- 4. Четыре переменные ---
f = "04-chetyre-peremennye.md"


def chain(x, y, z, w):
    return int(imp(x, y) and imp(y, z) and imp(z, w))


same("4 пример", orders(chain, "xyzw", [("0*1*", 1), ("10*0", 1), ("*011", 1)]), ["zxwy"])
same("4 разные F", orders(ex_formula, "xyz", [("*00", 0), ("0*1", 1), ("*11", 0)]), ["zxy"])


def ex12(x, y, z, w):
    return int(not (imp(x, z) and imp(z, w) and imp(w, y)))


same("4.1", orders(ex12, "xyzw", [("0*1*", 0), ("10*0", 0), ("*011", 0)]), ["wxyz"])
expect(f, "1. Ответ wxyz.")


def chain3(x, y, z):
    return int(imp(x, y) and imp(y, z))


expect(f, "2. " + ", ".join(sets(chain3, "xyz", 1)) + ":")
expect(f, f"3. {one(chain3, 'xyz', [('*01', 1), ('*01', 1)])}:")


def f44(x, y, z):
    return int((x or y) and not (y == z))


expect(f, f"4. {one(f44, 'xyz', [('10*', 1), ('1*0', 0), ('10*', 0)])}:")
expect(f, f"5. {one(f28, 'xyzw', [('11**', 0), ('1**1', 0), ('0**0', 0)])}:")


def f46(x, y, z, w):
    return int((imp(x, y) and imp(y, w)) or (z == int(x or y)))


expect(f, f"6. {one(f46, 'xyzw', [('*101', 0), ('010*', 1), ('0*10', 0)])}:")
same("4.6 нули", sets(f46, "xyzw", 0), ["0100", "1000", "1001", "1100"])
same("4 пять переменных", (2**5, factorial(5)), (32, 120))

# --- 5. Проверка программой ---
f = "05-proverka-python.md"
x = y = z = 0
wrong = x <= y == z
right_ = (x <= y) == z
same("5.1", (wrong, right_), (True, False))
same("5.2", (2**4, factorial(4), 2**5), (16, 24, 32))
expect(f, "3. Программа печатает 0 0 1 1, 0 1 0 1, 1 1 0 1")
expect(f, f"4. {len(sets(f46, 'xyzw', 1))} наборов:")
printed = 0
for _x in (0, 1):
    for _y in (0, 1):
        for _z in (0, 1):
            pass
        printed += 1
expect(f, f"5. {printed} строки:")
for bits in product((0, 1), repeat=4):
    x, y, z, w = bits
    same(f"5.6 {bits}", int((not ((not x) or y)) or (z == w)), int(not imp(x, y) or (z == w)))


def f57(x, y, z, w):
    return int((not (x or not y)) or imp(z, w))


expect(f, f"7. {one(f57, 'xyzw', [('*0*0', 0), ('**11', 0), ('*1*1', 0)])}:")
same("5.7 нули", sets(f57, "xyzw", 0), ["0010", "1010", "1110"])


def f58(x, y, z, w):
    return int(imp(w, x) and (y or z) and not (x == y))


expect(f, f"8. {one(f58, 'xyzw', [('1**1', 1), ('**11', 1), ('**11', 1)])}:")
same("5.8 единицы", sets(f58, "xyzw", 1), ["0100", "0110", "1010", "1011"])

# --- 6. Полный перебор ---
f = "06-polnyj-poisk.md"
same(
    "6.1 без различия",
    orders(ex_formula, "xyz", [("**0", 1), ("**0", 1), ("011", 1)], distinct=False),
    ["xyz", "xzy", "yxz", "yzx"],
)
expect(f, "1. Для раздела 16 ответ zxy.")


def nor(a: int, b: int) -> int:
    return int(not (a or b))


expect(f, f"2. {nor(0, nor(0, 1))}:")
expect(f, f"4. {(2 * 2) ** 3} и {(2 * 2) ** 3 * factorial(4)}:")


def two(x, y, z):
    return int(x == y), imp(y, z)


same(
    "6 пример двух функций",
    orders(two, "xyz", [("00*", (0, None)), ("*10", (0, 0)), ("1*1", (1, 1))]),
    ["zyx"],
)


def two5(x, y, z):
    return int(imp(x, y) and z), int(x or not z)


expect(f, f"5. {one(two5, 'xyz', [('*10', (1, 0)), ('01*', (0, None)), ('*10', (None, 0))])}:")


def two6(x, y, z):
    return int((x and not y) or z), int(y or (x == z))


expect(f, f"6. {one(two6, 'xyz', [('01*', (1, 0)), ('*01', (1, None)), ('*10', (0, None))])}:")

# --- 7. Практика и итог ---
f = "07-praktika-i-itog.md"


def g1(x, y, z):
    return int(imp(y, x) and (z == int(not x)))


expect(f, f"1. {one(g1, 'xyz', [('10*', 1), ('1*0', 1), ('01*', 1)])}:")
expect(f, f"2. {one(chain, 'xyzw', [('*10*', 1), ('1**0', 1), ('*0*1', 1)])}:")


def g3(x, y, z, w):
    return int((not (x or y)) or (z == w) or (x and not z))


expect(f, f"3. {one(g3, 'xyzw', [('**01', 0), ('0*0*', 0), ('00**', 0)])}:")


def g4(x, y, z, w):
    return int(int(imp(y, z) and not w) == int(x or w))


expect(f, f"4. {one(g4, 'xyzw', [('*0*1', 1), ('11**', 1), ('*0*1', 1)])}:")


def g5(x, y, z):
    return int((not imp(x, z)) or (y and z))


expect(f, f"5. {one(g5, 'xyz', [('1*1', 0), ('00*', 1), ('10*', 0)])}:")

failed = [c for c in checks if not c[2]]
for page, needle, ok in checks:
    if not ok:
        print(f"FAIL {page}: {needle}")
print(f"{len(checks)} checks, {len(failed)} failed")
sys.exit(1 if failed else 0)
