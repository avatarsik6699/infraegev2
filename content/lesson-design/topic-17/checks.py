"""Independent recomputation of every task answer in topic 17.

Usage: python3 -I content/lesson-design/topic-17/checks.py

Each answer is recomputed here by a different method than the lesson uses:
groups of neighbours come from zip over shifted copies of the list (not
from indexes), digits and endings from the decimal string of the modulus
(not from % and //), counts of fitting elements from sum over booleans, any
pairs from itertools.combinations, and the remainder-bucket count is compared
with the full search of pairs. Every expected answer must appear verbatim in
the answers of its subtopic file. Exit code 1 if any check fails.
"""

import sys
from itertools import combinations
from pathlib import Path

D = Path(__file__).resolve().parent


def answers(f):
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


def read(name):
    return [int(line) for line in (D / "files" / name).read_text(encoding="utf-8").split()]


def neighbours(a, k):
    return list(zip(*(a[s:] for s in range(k)), strict=False))


def text_of(x):
    return str(abs(x))


def ends(x, tail):
    return text_of(x).endswith(str(tail))


def length(x):
    return len(text_of(x))


def pair(values, best=max):
    return f"`{len(values)} {best(values) if values else 0}`"


checks = []


def expect(f, needle):
    checks.append((f, needle, needle in answers(f)))


def same(label, a, b):
    checks.append(("—", f"{label}: {a} = {b}", a == b))


# --- 1. Числа файла и проверки ---
f = "01-chisla-i-proverki.md"
s = [8, -12, 5, 20, -3, 14]
expect(f, f"Номер {s.index(20) + 1}, индекс {s.index(20)}")
expect(f, f"`a[5]` = {s[-1]}")
mult9 = [v for v in [0, 9, -18, 27, 36, -3] if v % 9 == 0]
expect(f, "Кратны девяти " + ", ".join(str(v).replace("-", "−") for v in mult9))
expect(f, f"Сумма {4 + 6} кратна пяти")
expect(f, f"Произведение {4 * 6} кратно восьми")
expect(f, f"5. {2 * 2 + 7 * 7} и {(2 + 7) ** 2}")
expect(f, f"6. {10 + 20 + 30}:")
expect(f, f"получится {3 + 10 + 20 + 30}")
a1 = read("17-1.txt")
nine = [x for x in a1 if text_of(x) != "0" and x / 9 == x // 9] + [x for x in a1 if x == 0]
expect(f, f"7. `{len(nine)} {len([x for x in nine if x > 0])}`")
expect(
    f,
    f"8. `{sum(x % 4 == 0 and (x // 4) % 2 == 1 for x in a1)} {sum(abs(x) <= 100 for x in a1)}`",
)

# --- 2. Сколько элементов подходит ---
f = "02-skolko-podhodit.md"
prs = [(12, 7), (7, 8), (3, 30), (5, 21)]
some = [p for p in prs if any(v % 3 == 0 for v in p)]
both = [p for p in prs if all(v % 3 == 0 for v in p)]
one = [p for p in prs if sum(v % 3 == 0 for v in p) == 1]
same("2.1 хотя бы одно", some, [(12, 7), (3, 30), (5, 21)])
same("2.1 оба", both, [(3, 30)])
same("2.1 ровно одно", one, [(12, 7), (5, 21)])
t = [9, 10, 25]
same("2.2", (sum(v % 3 == 0 for v in t), sum(v % 5 == 0 for v in t)), (1, 2))
x, y = 10, 12
same(
    "2.4",
    (x % 5 == 0 or y % 5 == 0 and x + y > 50, (x % 5 == 0 or y % 5 == 0) and x + y > 50),
    (True, False),
)
x, y, T = 12, 4, 10
same(
    "2.5",
    (
        any(v % 3 == 0 for v in (x, y)) and any(v < T for v in (x, y)),
        any(u % 3 == 0 and v < T for u, v in ((x, y), (y, x))),
        any(v % 3 == 0 and v < T for v in (x, y)),
    ),
    (True, True, False),
)
same("2.7", (sum(v % 3 == 0 for v in (15, 30, 7)), sum(v % 5 == 0 for v in (15, 30, 7))), (2, 2))
exactly = sum((x % 4 == 0) != (x % 6 == 0) for x in a1)
either = sum(x % 4 == 0 or x % 6 == 0 for x in a1)
expect(f, f"8. `{exactly} {either}`")
expect(f, f"9. `{sum(sum(x % d == 0 for d in (2, 3, 5)) >= 2 for x in a1)}`")

# --- 3. Цифры и знак ---
f = "03-cifry-i-znak.md"
expect(f, f"1. `{-23 % 10} {text_of(-23)[-1]} {-23 // 10}`")
seven = [v for v in [7, -17, 170, -107, 1007] if ends(v, 7)]
same("3.2 на 7", seven, [7, -17, -107, 1007])
same("3.2 на 07", [v for v in seven if text_of(v)[-2:] == "07"], [-107, 1007])
same("3.3", (-9 % 4, abs(-9) % 4), (3, 1))
same("3.4", [v for v in [99, -100, 999, -1000, 450, -45] if length(v) == 3], [-100, 999, 450])
w = text_of(-2048)
expect(f, f"Последняя {w[-1]}, предпоследняя {w[-2]}, первая {w[0]}")
same(
    "3.5",
    [v for v in [-455, 1050, 33, 5] if len(text_of(v)) >= 2 and text_of(v)[-1] == text_of(v)[-2]],
    [-455, 33],
)
expect(f, f"Произведение {-4 * -1 * -6}".replace("-", "−"))
sel = [x for x in a1 if length(x) == 3 and ends(x, 7)]
expect(f, f"8. `{len(sel)} {sum(x < 0 for x in sel)}`")
wrong = [x for x in a1 if length(x) == 3 and x % 10 == 7]
expect(f, f"получилось бы `{len(wrong)} {sum(x < 0 for x in wrong)}`")
expect(f, f"9. `{sum(len(text_of(x)) >= 2 and text_of(x)[-1] == text_of(x)[-2] for x in a1)}`")

# --- 4. Соседние пары и тройки ---
f = "04-sosednie-gruppy.md"
expect(
    f,
    "1. " + pair([u + v for u, v in neighbours([4, 7, 10, 3, -2], 2) if u % 2 == 0 or v % 2 == 0]),
)
expect(
    f, "2. " + pair([u + v for u, v in neighbours([-8, 0, 5, -3, 2], 2) if (u < 0) + (v < 0) == 1])
)
expect(
    f,
    "3. "
    + pair(
        [
            u * u + v * v
            for u, v in neighbours([7, 12, 17, -7, 4], 2)
            if ends(u, 7) + ends(v, 7) == 1
        ],
        min,
    ),
)
expect(
    f,
    "4. "
    + pair(
        [
            sum(g)
            for g in neighbours([100, 5, 200, 300, 7, 400], 3)
            if sum(length(v) == 3 for v in g) == 2
        ]
    ),
)
expect(
    f,
    f"5. {len(neighbours(list(range(2000)), 2))}, {len(neighbours(list(range(2000)), 3))} и {len(neighbours(list(range(2000)), 4))}",
)
neg = [u + v for u, v in neighbours([-5, -2, -9, 4], 2) if u < 0 and v < 0]
expect(f, f"6. {pair(neg)}")
expect(f, f"программа выведет `{len(neg)} {max([0] + neg)}`")
expect(f, "7. " + pair([sum(g) for g in neighbours([1, 2, 3, 4, 5, 6], 4) if sum(g) % 7 == 0]))
neg8 = [u + v for u, v in neighbours(a1, 2) if u < 0 and v < 0 and (u + v) % 5 == 0]
expect(f, "8. " + pair(neg8))
same("4.8 все суммы отрицательные", max(neg8) < 0, True)
expect(
    f,
    "9. "
    + pair(
        [
            sum(g)
            for g in neighbours(a1, 3)
            if sum(length(v) == 3 for v in g) == 2 and sum(g) % 4 == 0
        ],
        min,
    ),
)

# --- 5. Характеристика всей последовательности ---
f = "05-vsya-posledovatelnost.md"
s5 = [12, 117, 40, 217, 5]
thr = max(v for v in s5 if ends(v, 17))
expect(
    f,
    f"Порог {thr}; подходят пары (40, 217) и (217, 5): "
    + pair([u + v for u, v in neighbours(s5, 2) if u + v > thr]),
)
same("5.2", (min([-35, 15, -5, 25]), max([-35, 15, -5, 25])), (-35, 25))
odd = [v for v in [3, 8, 5, 10, 7] if v % 2]
same("5.3", [v for v in [3, 8, 5, 10, 7] if v < sum(odd) / len(odd)], [3])
s5e = [-31, 6, 21, -4, 11]
m = min(v for v in s5e if ends(v, 1))
expect(
    f,
    "5. "
    + pair(
        [
            u * u + v * v
            for u, v in neighbours(s5e, 2)
            if ends(u, 1) + ends(v, 1) == 1 and u * u + v * v < m * m
        ]
    ),
)
s6 = [6, 9, 2, 15, 4]
ev = [v for v in s6 if v % 2 == 0]
avg = sum(ev) / len(ev)
expect(
    f,
    "6. "
    + pair(
        [
            u + v
            for u, v in neighbours(s6, 2)
            if (u % 3 == 0 and v < avg) or (v % 3 == 0 and u < avg)
        ]
    ),
)
a2 = read("17-2.txt")
t21 = max(v for v in a2 if ends(v, 21))
expect(
    f,
    "7. "
    + pair(
        [
            sum(g)
            for g in neighbours(a2, 3)
            if sum(length(v) == 4 for v in g) == 2 and any(v % 7 == 0 for v in g) and sum(g) > t21
        ]
    ),
)
c25 = sum(x % 25 == 0 for x in a1)
expect(f, "8. " + pair([u + v for u, v in neighbours(a1, 2) if min(u, v) < 0 and u + v < c25]))
odd2 = [v for v in a2 if v % 2]
avg2 = sum(odd2) / len(odd2)
expect(
    f,
    "9. "
    + pair(
        [
            u + v
            for u, v in neighbours(a2, 2)
            if (u % 9 == 0 and v < avg2) or (v % 9 == 0 and u < avg2)
        ]
    ),
)

# --- 6. Что проверять и что выводить ---
f = "06-chto-proveryat-i-vyvodit.md"
expect(f, f"1. {min([5, -7, 2]) ** 2} и {min(v * v for v in [5, -7, 2])}")
expect(f, f"2. {abs(max([-15, -40, 10]))} и {max(abs(v) for v in [-15, -40, 10])}")
expect(f, f"3. {min([13, 22, 9]) % 5} и {min(v % 5 for v in [13, 22, 9])}")
o = sorted([7, -2, 5])
expect(f, f"4. {o[1] + o[2]}, {o[1] ** 2 + o[2] ** 2} и {o[1]}")
o = sorted([3, -8, 4])
expect(f, f"5. {abs(o[0]) + abs(o[2])}, {abs(o[0] + o[2])} и {o[0] * o[2]}".replace("-", "−"))
s66 = [30, 4, 17, 9]
expect(f, "6. " + pair([u + v for u, v in neighbours(s66, 2) if min(s66) in (u % 7, v % 7)]))
expect(f, "7. " + pair([u * u + v * v for u, v in neighbours([3, -1, 6, 2], 2) if u + v > 4], min))
expect(f, "8. " + pair([u + v for u, v in neighbours(a2, 2) if min(a2) in (u % 37, v % 37)]))
a3 = read("17-3.txt")
c13 = sum(length(v) == 4 and ends(v, 13) for v in a3)
ok = [sum(g) for g in neighbours(a3, 3) if sum(sorted(g)[1:]) < c13**2]
expect(f, f"9. `{len(ok)} {abs(max(ok))}`")
t7 = max(v for v in a3 if v < 0 and length(v) == 3 and v % 7 == 0)
expect(
    f,
    "10. "
    + pair([u * u + v * v for u, v in neighbours(a3, 2) if (u < 0) != (v < 0) and u + v > t7], min),
)


def kind(g):
    p, q, r = sorted(g)
    if p <= 0 or p + q <= r:
        return None
    return (p * p + q * q > r * r) - (p * p + q * q < r * r)  # 1 acute, 0 right, -1 obtuse


# --- 7. Треугольники ---
f = "07-treugolniki.md"
same("7.1", (kind([5, 5, 10]), kind([2, 2, 3])), (None, -1))
same("7.2", (kind([6, 8, 10]), kind([5, 6, 7]), kind([4, 6, 9])), (0, 1, -1))
same("7.3", kind([0, 3, 3]), None)
same("7.4", kind([7, 2, 4]), None)
expect(f, "5. " + pair([sum(g) for g in neighbours([3, 4, 5, 6, 8, 10], 3) if kind(g) == 0]))
expect(f, "6. " + pair([sum(g) for g in neighbours([10, 6, 8, 3, 4, 5, 13], 3) if kind(g) == -1]))
same(
    "7, фрагмент",
    pair([sum(g) for g in neighbours([5, 12, 13, 0, 5, 5], 3) if kind(g) == 0]),
    "`1 30`",
)
a5 = read("17-5.txt")
expect(f, "7. " + pair([sum(g) for g in neighbours(a5, 3) if kind(g) == 1]))
right = [g for g in neighbours(a5, 3) if kind(g) == 0]
expect(f, "8. " + pair([sum(g) for g in right]))
unsorted = [g for g in right if g[0] ** 2 + g[1] ** 2 == g[2] ** 2]
same("7.8 без сортировки часть теряется", len(unsorted) < len(right), True)

# --- 8. Любые пары ---
f = "08-lyubye-pary.md"
expect(f, f"1. {len(list(combinations(range(5), 2)))} и {2000 * 1999 // 2:,}".replace(",", " "))
expect(f, f"2. {len(list(combinations([7, 7, 7, 7], 2)))} пар")
expect(f, "3. " + pair([u + v for u, v in combinations([3, 8, 2, 7], 2) if (u + v) % 5 == 0]))
same("8.4", [next(p for p in range(7) if (r + p) % 7 == 0) for r in (0, 3, 5)], [0, 4, 2])
d = [max(u, v) - min(u, v) for u, v in combinations([2, 5, 8, 11, 14], 2) if (u - v) % 3 == 0]
expect(f, f"6. `{len(d)} {max(d)}`")
a6 = read("17-6.txt")
expect(
    f,
    "7. "
    + pair(
        [u + v for u, v in combinations(a6, 2) if (u + v) % 12 == 0 and (u % 5 == 0 or v % 5 == 0)]
    ),
)
expect(f, "8. " + pair([u + v for u, v in combinations(a6, 2) if u * v % 14 == 0]))


def buckets(a, m):
    counts, best_by, count, best = [0] * m, [None] * m, 0, None
    for x in a:
        need = (-x) % m
        count += counts[need]
        if best_by[need] is not None:
            best = x + best_by[need] if best is None else max(best, x + best_by[need])
        counts[x % m] += 1
        best_by[x % m] = x if best_by[x % m] is None else max(best_by[x % m], x)
    return count, best


full = [u + v for u, v in combinations(a6, 2) if (u + v) % 7 == 0]
same("8: остатки против полного перебора на 17-6.txt", buckets(a6, 7), (len(full), max(full)))
same("8: пример урока", buckets([4, 6, 11, 9], 5), (4, 20))

# --- 9. Практика и итог ---
f = "09-praktika-i-itog.md"
a4 = read("17-4.txt")
expect(
    f,
    "1. "
    + pair(
        [u + v for u, v in neighbours(a4, 2) if (u % 3 == 0) != (v % 3 == 0) and (u + v) % 5 == 0]
    ),
)
t99 = min(v for v in a3 if v > 0 and ends(v, 99))
fit2 = [sum(g) for g in neighbours(a3, 3) if sum(length(v) == 3 for v in g) <= 1 and sum(g) >= t99]
expect(f, "2. " + pair(fit2, min))
same("9.2 сумма ровно на пороге", min(fit2) == t99 == 99, True)
r3, r7 = min(a4) % 3, max(a4) % 7
expect(
    f,
    "3. "
    + pair([u + v for u, v in neighbours(a4, 2) if r3 in (u % 3, v % 3) and r7 in (u % 7, v % 7)]),
)
t77 = max(v for v in a3 if ends(v, 77))
ok4 = [
    sum(g)
    for g in neighbours(a3, 3)
    if len({(v > 0) - (v < 0) for v in g} - {0}) == 1 and 0 not in g and abs(sum(g)) < t77
]
expect(f, f"4. `{len(ok4)} {abs(max(ok4))}`")
ev4 = [v for v in a4 if v % 2 == 0]
avg4 = sum(ev4) / len(ev4)
expect(
    f,
    "5. "
    + pair(
        [
            sum(g)
            for g in neighbours(a4, 4)
            if sum(v % 3 == 0 for v in g) > sum(v % 7 == 0 for v in g) and sum(g) > 3 * avg4
        ]
    ),
)

bad = [c for c in checks if not c[2]]
for f, needle, ok in checks:
    if not ok:
        print(f"FAIL {f}: {needle}")
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
