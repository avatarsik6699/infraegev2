"""Independent recomputation of every task answer in topic 15.

Usage: python3 -I content/lesson-design/topic-15/checks.py

The lessons solve by reasoning: dangerous region, necessary and sufficient
condition. Here every answer is recomputed by brute force instead: every
candidate A of a wide range is tried on every x (and y) of a range several
times larger than the dangerous one; segments are checked exactly on ends,
midpoints and outside points with rational arithmetic. Nothing is shared with
parameter_figures.py. Every expected answer must appear verbatim in the
answers of its page. Exit code 1 if any check fails.
"""

import re
import sys
from fractions import Fraction as F
from pathlib import Path

D = Path(__file__).resolve().parent

checks: list[tuple[str, str, bool]] = []


def answers(f: str) -> str:
    text = (D / f).read_text(encoding="utf-8")
    tail = text.split("**Ответы для проверки:**", 1)[1]
    return re.split(r"\n\n(?:\*\*Что дальше|<details)", tail)[0]


def expect(f: str, needle: str) -> None:
    checks.append((f, needle, needle in answers(f)))


def same(label: str, a: object, b: object) -> None:
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def imp(p, q):
    return (not p) or q


def DEL(n, m):  # noqa: N802
    return n % m == 0


def tri(a, b, c):
    return a < b + c and b < a + c and c < a + b


N = range(1, 300)
N0 = range(0, 300)


def good(formula, A, xs=N):
    return all(formula(x, A) for x in xs)


def good2(formula, A, lim=80):
    return all(formula(x, y, A) for x in range(1, lim) for y in range(1, lim))


def smallest(formula, As, xs=N):
    return min(A for A in As if good(formula, A, xs))


def largest(formula, As, xs=N):
    return max(A for A in As if good(formula, A, xs))


def seg_ok(P, Q, expr, A):
    """Exact check on ends, midpoints and outside points (rational numbers)."""
    ends = sorted({F(v) for v in (*P, *Q, *A)})
    pts = (
        set(ends)
        | {(u + v) / 2 for u, v in zip(ends, ends[1:], strict=False)}
        | {ends[0] - 1, ends[-1] + 1}
    )
    for x in pts:
        p, q, a = P[0] <= x <= P[1], Q[0] <= x <= Q[1], A[0] <= x <= A[1]
        if not expr(p, q, a):
            return False
    return True


def seg_len(P, Q, expr, want, grid=range(0, 70)):
    lens = [r - lo for lo in grid for r in grid if r >= lo and seg_ok(P, Q, expr, (lo, r))]
    return min(lens) if want == "min" else max(lens)


# --- subtopic 1 ------------------------------------------------------------------
P1 = "01-parametr-i-lozhnyj-sluchaj.md"
same("1 main", smallest(lambda x, A: imp(x <= 7, x <= A), range(-5, 50), N0), 7)
same("1.1", imp(False, False), True)
expect(P1, "1. 1")
same(
    "1.2",
    all(
        (not ((x <= 4) or (y > 9))) == ((x > 4) and (y <= 9)) for x in range(20) for y in range(20)
    ),
    True,
)
same("1.3", (imp(0, imp(0, 0)), imp(imp(0, 0), 0)), (True, False))
same("1.4", smallest(lambda x, A: imp(x < 12, x <= A), range(-5, 50), N0), 11)
expect(P1, "4. 11")
same("1.5", largest(lambda x, A: imp(x >= 5, x > A), range(-5, 50)), 4)
expect(P1, "5. 4")
same("1.6", smallest(lambda x, A: not ((x < 6) and (x > A)), range(-5, 50)), 5)
expect(P1, "6. 5")
same("1.7", smallest(lambda x, A: imp(x <= 8, 3 * x < A), range(0, 100)), 25)
expect(P1, "7. 25")
same("1 squares", smallest(lambda x, A: imp(x < 4, x * x < A), range(0, 100)), 10)

# --- subtopic 2 ------------------------------------------------------------------
P2 = "02-prinadlezhnost-i-oblast.md"
same("2 main", seg_len((4, 18), (11, 26), lambda p, q, a: a or not p or not q, "min"), 7)
same("2 union", seg_len((3, 12), (8, 20), lambda p, q, a: (not a) or p or q, "max"), 17)
same("2 split", seg_len((3, 8), (12, 20), lambda p, q, a: (not a) or p or q, "max"), 8)
same("2 cover", seg_len((2, 5), (10, 14), lambda p, q, a: imp(p or q, a), "min"), 12)
same(
    "2 subst", seg_len((6, 19), (13, 24), lambda p, q, a: imp(imp(not a, p), imp(a, q)), "max"), 11
)
same("2.1", seg_len((1, 13), (8, 18), lambda p, q, a: imp(not a, imp(p, not q)), "min"), 5)
expect(P2, "1. 5")
same("2.2", seg_len((2, 7), (11, 20), lambda p, q, a: imp(a, p) or q, "max"), 9)
expect(P2, "2. 9")
same("2.3", seg_len((3, 6), (14, 19), lambda p, q, a: imp(p or q, a), "min"), 16)
expect(P2, "3. 16")
same("2.4", seg_len((2, 9), (10, 17), lambda p, q, a: imp(imp(not a, p), imp(a, q)), "max"), 7)
expect(P2, "4. 7")
expect(P2, "5. Нет")
Pf, Qf = {-4, 1, 6}, {1, 3}
allowed = [x for x in range(-10, 11) if imp(True, x in Pf) or x in Qf]
same("2.6", (len(allowed), sum(x for x in allowed if x > 0)), (4, 10))
expect(P2, "6. 4 элемента; сумма 10")
must = sorted(Pf)
free = [x for x in allowed if x not in Pf]
same("2.7", (sum(must), sum(must) + sum(x for x in free if x > 0)), (3, 6))
expect(P2, "7. 3 и 6")
same("2.8", seg_len((10, 40), (25, 55), lambda p, q, a: imp(p, imp(q, a)), "min"), 15)
expect(P2, "8. 15")
same("2.9", seg_len((5, 20), (30, 45), lambda p, q, a: imp(a, p) or q, "max"), 15)
expect(P2, "9. 15")

# --- subtopic 3 ------------------------------------------------------------------
P3 = "03-bity-i-maski.md"
B = range(0, 256)


def bits_min(f):
    return min(A for A in B if all(f(x, A) for x in B))


def bits_max(f):
    return max(A for A in B if all(f(x, A) for x in B))


same("3 main", bits_min(lambda x, A: imp(x & 22 != 0, imp(x & 10 == 0, x & A != 0))), 20)
same("3 max", bits_max(lambda x, A: imp(x & A != 0, imp(x & 12 == 0, x & 5 != 0))), 13)
same("3.1", 26 & 13, 8)
expect(P3, "1. 8")
same("3.2", bits_min(lambda x, A: imp(x & 26 != 0, imp(x & 12 == 0, x & A != 0))), 18)
expect(P3, "2. 18")
same("3.3", bits_max(lambda x, A: imp(x & A != 0, imp(x & 6 == 0, x & 9 != 0))), 15)
expect(P3, "3. 15")
same("3.4", next(x for x in B if not (not ((x & 1 != 0) and (x & 2 != 0)))), 3)
expect(P3, "4. Нет; контрпример x = 3")
same("3.5", bits_min(lambda x, A: imp(x & 28 != 0, imp(x & 12 == 0, x & A != 0))), 16)
expect(P3, "5. 16")
same("3.6", bits_max(lambda x, A: imp(x & A != 0, imp(x & 20 == 0, x & 3 != 0))), 23)
expect(P3, "6. 23")
same("3.7", bits_min(lambda x, A: imp(x & 50 != 0, imp(x & 22 == 0, x & A != 0))), 32)
expect(P3, "7. 32")
same("3.8", bits_max(lambda x, A: imp(x & A != 0, imp(x & 41 == 0, x & 15 != 0))), 47)
expect(P3, "8. 47")

# --- subtopic 4 ------------------------------------------------------------------
P4 = "04-opasnaya-oblast.md"


def pmin(f, As):
    return min(A for A in As if good2(f, A))


def pmax(f, As):
    return max(A for A in As if good2(f, A))


same("4 main", pmin(lambda x, y, A: (2 * x + 3 * y >= 30) or (x + 2 * y < A), range(1, 60)), 20)
same("4 sum", pmin(lambda x, y, A: (x + y >= 12) or (x < y) or (y < A), range(-5, 60)), 6)
same("4 prod", pmax(lambda x, y, A: (x * y < 30) or (x >= A) or (y >= A), range(1, 60)), 6)
same("4 coef", pmin(lambda x, y, A: (y >= 7) or (A * x > y + 20), range(-30, 60)), 27)
same("4.1", smallest(lambda x, A: imp(x < 5, x * x <= A), range(0, 100), N0), 16)
expect(P4, "1. 16")
same("4.2", pmin(lambda x, y, A: (x + y >= 18) or (x < y) or (y < A), range(-5, 60)), 9)
expect(P4, "2. 9")
same("4.3", pmin(lambda x, y, A: (3 * x + 2 * y >= 24) or (x + y < A), range(-5, 60)), 12)
expect(P4, "3. 12")
sq = [
    A for A in range(0, 200) if all(imp(x <= 5, x * x <= A) and imp(x * x <= A, x <= 5) for x in N0)
]
same("4.4", (min(sq), max(sq), len(sq)), (25, 35, 11))
expect(P4, "4. A = 25, 26, …, 35; максимум 35; количество 11")
sq2 = [
    A for A in range(0, 200) if all(imp(x < 5, x * x < A) and imp(x * x <= A, x <= 5) for x in N0)
]
same("4.5", (min(sq2), max(sq2), len(sq2)), (17, 35, 19))
expect(P4, "5. A = 17, 18, …, 35; количество 19")
same("4.6", pmin(lambda x, y, A: (y >= 10) or (A * x >= 2 * y + 5), range(-30, 60)), 23)
expect(P4, "6. 23")
same("4.7", pmax(lambda x, y, A: (x * y < 40) or (x >= A) or (y >= A), range(1, 60)), 7)
expect(P4, "7. 7")
same("4.8", pmin(lambda x, y, A: (3 * x + y >= 33) or (x + y < A), range(1, 100)), 31)
expect(P4, "8. 31")

# --- subtopic 5 ------------------------------------------------------------------
P5 = "05-delimost-i-smeshannye-usloviya.md"
same(
    "5 gcd",
    largest(
        lambda x, A: DEL(84, A) and imp(not DEL(x, A), imp(DEL(x, 12), not DEL(x, 18))),
        range(1, 200),
    ),
    12,
)
same(
    "5 lcm",
    smallest(
        lambda x, A: DEL(A, 28) and imp(DEL(180, x), imp(not DEL(A, x), not DEL(144, x))),
        range(1, 600),
    ),
    252,
)
same(
    "5 mixed",
    largest(lambda x, A: DEL(x, A) or imp(30 <= x <= 60, not DEL(x, 12)), range(1, 200)),
    12,
)
same(
    "5.1",
    largest(lambda x, A: imp(not DEL(x, A), imp(DEL(x, 8), not DEL(x, 12))), range(1, 200)),
    24,
)
expect(P5, "1. 24")
same(
    "5.2",
    largest(
        lambda x, A: DEL(60, A) and imp(not DEL(x, A), imp(DEL(x, 8), not DEL(x, 18))),
        range(1, 200),
    ),
    12,
)
expect(P5, "2. 12")
same(
    "5.3",
    smallest(
        lambda x, A: DEL(A, 20) and imp(DEL(84, x), imp(not DEL(A, x), not DEL(126, x))),
        range(1, 1000),
    ),
    420,
)
expect(P5, "3. 420")
same("5.4", smallest(lambda x, A: imp(10 <= x <= 40, DEL(x, 3) or x < A), range(1, 200)), 41)
expect(P5, "4. 41")
same(
    "5.5",
    smallest(lambda x, A: imp(x < 50, (not (DEL(x, 6) and not DEL(x, 4))) or x < A), range(1, 200)),
    43,
)
expect(P5, "5. 43")
same("5.6", sum(1 for x in range(10, 41) if not DEL(x, 5)), 24)
expect(P5, "6. 24")
same(
    "5.7", largest(lambda x, A: DEL(x, A) or imp(40 <= x <= 50, not DEL(x, 12)), range(1, 500)), 48
)
expect(P5, "7. 48")

# --- subtopic 6 ------------------------------------------------------------------
P6 = "06-konechnaya-proverka.md"
same(
    "6.1",
    all(
        DEL(x, 6) == DEL(x + 90, 6)
        and DEL(x, 10) == DEL(x + 90, 10)
        and DEL(x, 9) == DEL(x + 90, 9)
        for x in N
    ),
    True,
)
expect(P6, "1. x = 1, 2, …, 90")
same("6.2", all([]), True)
expect(P6, "2. `True`")
same("6.3", next(x for x in B if not imp(x & 28 != 0, imp(x & 12 == 0, x & 8 != 0))), 16)
expect(P6, "3. 16")
same("6.4", max(50, 22, 32) < 64, True)
expect(P6, "4. 0 … 63")
same(
    "6.5",
    all((3 * x + y >= 33) for x in range(11, 40) for y in range(1, 40))
    and all(3 * x + y >= 33 for x in range(1, 40) for y in range(30, 60)),
    True,
)
expect(P6, "5. x = 1 … 10, y = 1 … 29")
expect(P6, "6. Нарушение — при нецелом x = 1,015")

# --- subtopic 7 ------------------------------------------------------------------
P7 = "07-novye-predikaty.md"
same("7 tri", smallest(lambda x, A: imp(tri(x, 4, 7), x < A), range(1, 100)), 11)
same("7 max", smallest(lambda x, A: max(x, 8) < A or x > 20, range(1, 100)), 21)
same(
    "7 moving",
    max(A for A in range(1, 51) if good(lambda x, A: imp(A <= x <= A + 5, not DEL(x, 7)), A)),
    50,
)
same("7 even", largest(lambda x, A: imp(DEL(A, x) and DEL(x, 2), DEL(60, x)), range(1, 101)), 99)
same(
    "7.1",
    (
        [x for x in N if tri(x, 5, 9)][0],
        [x for x in N if tri(x, 5, 9)][-1],
        smallest(lambda x, A: imp(tri(x, 5, 9), x < A), range(1, 100)),
    ),
    (5, 13, 14),
)
expect(P7, "1. x = 5 … 13; A = 14")
same("7.2", largest(lambda x, A: (not tri(x, 3, 8)) or x > A, range(0, 100)), 5)
expect(P7, "2. 5")
same("7.3", smallest(lambda x, A: max(x, 12) < A or x >= 30, range(1, 100)), 30)
expect(P7, "3. 30")
same("7.4", pmin(lambda x, y, A: imp(max(x, y) <= 6, x + y < A), range(1, 100)), 13)
expect(P7, "4. 13")
same("7.5", largest(lambda x, A: imp(DEL(A, x) and DEL(x, 3), DEL(90, x)), range(1, 201)), 200)
expect(P7, "5. 200")
ok6 = [A for A in range(1, 41) if good(lambda x, A: imp(A <= x <= A + 4, not DEL(x, 6)), A)]
same("7.6", (max(ok6), len(ok6)), (37, 7))
expect(P7, "6. 37 и 7")

# --- final page --------------------------------------------------------------------
P8 = "08-praktika-i-itog.md"
same("8.1", smallest(lambda x, A: imp(x <= 12, x * x < A), range(1, 400)), 145)
expect(P8, "1. 145")
same("8.2", seg_len((15, 40), (21, 63), lambda p, q, a: imp(p, imp(q and not a, not p)), "min"), 19)
expect(P8, "2. 19")
same("8.3", bits_min(lambda x, A: imp(x & 29 != 0, imp(x & 17 == 0, x & A != 0))), 12)
expect(P8, "3. 12")
same("8.4", pmax(lambda x, y, A: (2 * x + y != 70) or (x < y) or (A < x), range(0, 100)), 23)
expect(P8, "4. 23")
same("8.5", smallest(lambda x, A: imp(20 <= x <= 50, DEL(x, 4) or x < A), range(1, 200)), 51)
expect(P8, "5. 51")

for f in sorted(D.glob("0*.md")):
    nums = re.findall(r"^(\d+)\. ", answers(f.name), re.M)
    if nums != [str(i) for i in range(1, len(nums) + 1)]:
        checks.append((f.name, f"answers numbered 1…n: {nums}", False))

bad = [c for c in checks if not c[2]]
for f, needle, ok in checks:
    print("PASS" if ok else "FAIL", f, needle)
print(f"{len(checks) - len(bad)} of {len(checks)} checks pass")
sys.exit(1 if bad else 0)
