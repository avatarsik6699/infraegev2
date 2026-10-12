"""Independent recomputation of every task answer in topic 14.

Usage: python3 -I content/lesson-design/topic-14/checks.py

Each answer is recomputed here by a different method than the lesson uses:
digits come from divmod (not the lesson's ``digits``), values of records are
sums of digit · q^k over places (not Horner's ``value``), searches run over
full ranges without early stops, and unknown bases are searched far beyond
the bounds of the text. Every expected answer must appear verbatim in the
answers of its subtopic file; a few numbers of the explanations are checked
in the text too. Exit code 1 if any check fails.
"""

import sys
from itertools import product
from math import isqrt
from pathlib import Path

D = Path(__file__).resolve().parent
ALPHA = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"


def text(f):
    return (D / f).read_text(encoding="utf-8")


def answers(f):
    return text(f).split("**Ответы для проверки:**", 1)[1]


def digs(n, q):
    """Digits of n in base q, most significant first."""
    out = []
    while True:
        n, d = divmod(n, q)
        out.append(d)
        if n == 0:
            return out[::-1]


def val(record, q, env=None):
    """Value of a record: letters x, y, … from env, A–Z as digits 10–35."""
    env = env or {}
    ds = [env[c] if c in env else ALPHA.index(c) for c in record]
    if max(ds) >= q:
        raise ValueError(record)
    return sum(d * q**k for k, d in enumerate(reversed(ds)))


def rec(n, q):
    return "".join(ALPHA[d] for d in digs(n, q))


checks = []


def expect(f, needle):
    checks.append((f, needle, needle in answers(f)))


def in_text(f, needle):
    checks.append((f, needle, needle in text(f)))


def same(label, a, b):
    checks.append(("—", f"{label}: {a} = {b}", a == b))


# --- 1. Запись числа и её значение ---
f = "01-zapis-i-znachenie.md"
expect(f, f"минимальное основание — {max(ALPHA.index(c) for c in '5C1') + 1}")
expect(f, f"2. {val('2103', 4)}:")
expect(f, f"3. {rec(94, 5)}₅:")
expect(f, f"4. {max(n for n in range(2000) if len(digs(n, 6)) == 4)}:")
expect(f, f"значение {val('1A0', 16)} = 256 + 160")
expect(f, f"значение {val('1100', 6)} = 216 + 36")
three = [n for n in range(1, 300) if len(digs(n, 6)) == 3]
expect(f, f"6. От {three[0]} до {three[-1]}: 6² ≤ N < 6³, всего {len(three)} чисел.")
expect(f, f"7. {digs(2024, 5)[-4]}:")
expect(f, f"2024 = {rec(2024, 5)}₅")
expect(f, f"8. {val(rec(2024, 7)[:-2], 7)} и {val(rec(2024, 7)[-2:], 7)}:")
q9 = min(q for q in range(2, 40) if all(ALPHA.index(c) < q for c in "3A7"))
expect(f, f"9. q = {q9},")
expect(f, f"= {val('3A7', q9)}.")
in_text(f, f"{val('2304', 5)}")
same("2304₅", val("2304", 5), 329)
same("1A3₁₆", val("1A3", 16), 419)
same("234₅", val("234", 5), 69)

# --- 2. Запись суммы и разности степеней ---
f = "02-stepeni-blokami.md"
expect(f, f"1. {rec(val('324', 5) + val('143', 5), 5)}₅.")
expect(
    f,
    f"У 7⁵ {'шесть' if len(digs(7**5, 7)) == 6 else '?'} цифр: {rec(7**5, 7)}₇. А 7⁵ − 1 = {rec(7**5 - 1, 7)}₇.",
)
expect(f, f"3. {digs(7**8 + 7**3 + 1, 7).count(0)} нулей.")
expect(f, f"4. {digs(4**20 - 4**7, 4).count(3)}:")
expect(f, f"5. {digs(8**15 + 2**20 - 7, 2).count(1)}.")
expect(f, f"6. {digs(2**15 + 2**15 + 2**3 - 1, 2).count(1)}.")
expect(f, f"7. {digs(9**8 + 3**10 - 3**4, 3).count(2)}:")
expect(f, f"запись {rec(9**8 + 3**10 - 3**4, 3)}₃.")
expect(f, f"8. {digs(25**6 + 5**8 - 5**3 - 3, 5).count(4)}:")
expect(f, f"запись {rec(25**6 + 5**8 - 5**3 - 3, 5)}₅")
n2 = 5**12 + 5**7 - 5**3
same(
    "5¹² + 5⁷ − 5³: четвёрки, нули, всего",
    (digs(n2, 5).count(4), digs(n2, 5).count(0), len(digs(n2, 5))),
    (4, 8, 13),
)
same("4⁵⁰ + 2³⁰ − 15: единиц", digs(4**50 + 2**30 - 15, 2).count(1), 28)
same("5¹⁰ − 18", rec(5**10 - 18, 5), "4444444412")
same("D6₁₆", (rec(val("D6", 16), 2), rec(val("D6", 16), 8)), ("11010110", "326"))

# --- 3. Цифры значения выражения программой ---
f = "03-cifry-programmoj.md"
expect(f, f"1. {digs(2016, 6).count(0)}: 2016 = {rec(2016, 6)}₆")
expect(f, f"2. `{digs(2016, 6)}`.")
expect(f, f"3. {digs(2**100 - 2**50 + 1, 2).count(1)}:")
expect(f, f"4. {sum(digs(7**20 - 1, 7))}:")
expect(f, f"5. {'0b1000000'.count('0')}:")
same("нулей в 64₂", digs(64, 2).count(0), 6)
h = 16**10 - 16**5 + 255
expect(f, f"6. {len(set(digs(h, 16)))}: запись {rec(h, 16)}₁₆")
e7 = 3 * 27**15 + 9**20 - 2 * 3**10 - 4
expect(f, f"7. {digs(e7, 9).count(8)}: запись {rec(e7, 9)}₉")
e8 = 5 * 36**20 + 6**45 - 6**10 - 2025
expect(f, f"8. {sum(d > 9 for d in digs(e8, 36))}: в записи {rec(e8, 36)}₃₆")
e9 = 4 * 31**30 + 9 * 31**15 - 31**6 + 2026
expect(f, f"9. {sum(d for d in digs(e9, 31) if d <= 15)}: в записи {rec(e9, 31)}₃₁")
ds3 = digs(n2, 5)
same("чётных цифр", sum(d % 2 == 0 for d in ds3), 12)
same("различных, самая частая", (len(set(ds3)), max(range(5), key=ds3.count)), (3, 0))
same("основание 25", digs(n2, 25), [1, 0, 0, 4, 24, 20, 0])
big = 4**50 + 2**30 - 15
same("цифр в десятичной записи", len(digs(big, 10)), 31)

# --- 4. Выражение с параметром x ---
f = "04-parametr-x.md"
expect(f, f"2. {digs(5**6 - 1, 5).count(4)} и {digs(5**6 - 2, 5).count(4)}:")
four = [x for x in range(1, 201) if digs(5**6 - x, 5).count(4) == 4]
expect(f, f"3. {four[-1]}:")
expect(f, f"5⁶ − 176 = {rec(5**6 - 176, 5)}₅")
expect(f, f"4. {four[0]}:")
zeros5 = [digs(5**6 - x, 5).count(0) for x in range(1, 501)]
expect(f, f"5. {zeros5.index(max(zeros5)) + 1}:")
c6 = 7**100 + 7**50
z53 = [x for x in range(1, 3001) if digs(c6 - x, 7).count(0) == 53]
expect(f, f"6. {z53[-1]}:")
expect(f, f"нулей 53 у {len(z53)} значений x")
c7 = 11 * 13**20 + 13**10
x7 = next(x for x in range(1, 10**5) if digs(c7 - x, 13).count(12) == 7)
expect(f, f"7. {x7}:")
c8 = 6**120 + 6**60
expect(f, f"8. {max(digs(c8 - x, 6).count(0) for x in range(1, 2001))}:")
twos = [x for x in range(1, 101) if digs(3**8 - x, 3).count(2) == 5]
same("3⁸ − x: наибольший x с пятью двойками", twos[-1], 97)
in_text(f, f"ровно пять двоек у {len(twos)} значений x")
zeros3 = [digs(3**8 - x, 3).count(0) for x in range(1, 101)]
same("3⁸ − x: наибольшее число нулей и x", (max(zeros3), zeros3.index(max(zeros3)) + 1), (4, 81))
same(
    "3⁸ − x: первый x с тремя нулями",
    next(x for x in range(1, 999) if digs(3**8 - x, 3).count(0) == 3),
    27,
)

# --- 5. Одна неизвестная цифра ---
f = "05-neizvestnaya-cifra.md"


def one(records, signs, q, xs, k):
    found = []
    for x in xs:
        s = sum(sg * val(r, q, {"x": x}) for r, sg in zip(records, signs, strict=True))
        if s % k == 0:
            found.append((x, s))
    return found


expect(f, f"При x = 7: 4 · 81 + 7 · 9 + 1 = {val('4x1', 9, {'x': 7})}.")
r2 = one(["2x3", "1x4"], [1, 1], 7, range(7), 6)
expect(f, f"2. {r2[0][1] // 6}.")
r3 = [
    (x, val("2x1", 6, {"x": x}) + val("1x3", 8, {"x": x}))
    for x in range(6)
    if (val("2x1", 6, {"x": x}) + val("1x3", 8, {"x": x})) % 5 == 0
]
expect(f, f"3. {r3[-1][1] // 5}.")
expect(f, f"4. {val('2x7', 40, {'x': 33})}:")
expect(f, f"`int('3111', 16)` = {int('3111', 16)}")
expect(f, f"`int('3B1', 16)` = {val('3B1', 16)}")
r6 = one(["7x3A", "4Bx3"], [1, 1], 19, range(19), 18)
expect(f, f"6. {r6[0][1] // 18}: x = {r6[0][0]}, сумма {r6[0][1]}.")
r7 = one(["5x18C3", "2x7x", "96x41"], [1, 1, 1], 23, range(23), 22)
expect(f, f"7. {r7[-1][1] // 22}: подходят x = {r7[0][0]} и x = {r7[-1][0]}")
r8 = [(x, val("5x7", 14, {"x": x}) + val("x3B", 12, {"x": x})) for x in range(10)]
r8 = [p for p in r8 if p[1] % 20 == 0]
same("5x7₁₄ + x3B₁₂: одно подходящее x", len(r8), 1)
expect(f, f"8. {r8[0][1] // 20}: x от 0 до 9, подходит только x = {r8[0][0]}, сумма {r8[0][1]}.")
r9 = one(["6x29", "1x07x"], [1, 1], 41, range(41), 40)
expect(f, f"9. {r9[0][1] // 40}: x = {r9[0][0]}, сумма {r9[0][1]}.")
t5 = one(["2Ax5", "1xB3"], [1, 1], 16, range(16), 15)
same("2Ax5₁₆ + 1xB3₁₆", (t5[0][0], t5[0][1], t5[0][1] // 15), (14, 18840, 1256))
mixed = [
    (x, val("3x2", 8, {"x": x}) + val("2x5", 13, {"x": x}))
    for x in range(8)
    if (val("3x2", 8, {"x": x}) + val("2x5", 13, {"x": x})) % 17 == 0
]
same("3x2₈ + 2x5₁₃: x и частное", (mixed[0][0], mixed[0][1] // 17), (6, 39))
same("1x2₅₀ при x = 37", val("1x2", 50, {"x": 37}), 4352)

# --- 6. Две неизвестные цифры ---
f = "06-dve-cifry.md"


def pairs(a, qa, b, qb, k):
    lim = min(qa, qb)
    out = []
    for x, y in product(range(lim), repeat=2):
        s = val(a, qa, {"x": x, "y": y}) + val(b, qb, {"x": x, "y": y})
        if s % k == 0:
            out.append((x, y, s))
    return out


p2 = pairs("1xy", 4, "2yx", 5, 7)
best2 = min(p2, key=lambda t: t[2])
expect(f, f"2. {best2[2] // 7}.")
expect(f, f"при x = {best2[0]}, y = {best2[1]}: {best2[2]} / 7")
expect(f, f"3. Пару x = {p2[0][0]}, y = {p2[0][1]}: сумма {p2[0][2]}, частное {p2[0][2] // 7}")
p4 = pairs("3x6y", 11, "y5x1", 13, 41)
b4 = min(p4, key=lambda t: t[2])
expect(f, f"4. {b4[2] // 41}: наименьшая сумма {b4[2]} при x = {b4[0]}, y = {b4[1]}")
expect(f, f"первая найденная пара x = {p4[0][0]}, y = {p4[0][1]} даёт {p4[0][2]}")
c5 = [
    (val("yx", 38, {"x": x, "y": y}), x, y)
    for x, y in product(range(38), repeat=2)
    if val("4x1y7", 38, {"x": x, "y": y}) % 37 == 0
]
expect(f, f"5. {max(c5)[0]}: y = {max(c5)[2]}, x = {max(c5)[1]}")
c6s = sorted(
    v
    for x, y in product(range(42), repeat=2)
    if val("3x5y", 42, {"x": x, "y": y}) % 41 == 0
    and (v := val("yx", 42, {"x": x, "y": y})) > 0
    and isqrt(v) ** 2 == v
)
expect(f, f"6. {c6s[-1]}:")
same("квадратов yx два", len(c6s), 2)
p1 = pairs("1xy", 5, "2yx", 7, 5)
same("1xy₅ + 2yx₇: первая пара и наименьшая сумма", (p1[0][2], min(t[2] for t in p1)), (155, 135))
same("наибольшая запись yx₅", max(val("yx", 5, {"x": x, "y": y}) for x, y, _ in p1), 20)

# --- 7. Неизвестное основание и признаки делимости ---
f = "07-neizvestnoe-osnovanie.md"


def solve_eq(lhs, rhs, letters, qmax=80):
    sols = []
    for q in range(2, qmax):
        for vs in product(range(q), repeat=len(letters)):
            env = dict(zip(letters, vs, strict=True))
            if any(env.get(r[0], 1) == 0 for r in [*lhs, rhs]):
                continue
            try:
                if sum(val(r, q, env) for r in lhs) == val(rhs, q, env):
                    sols.append((q, *vs))
            except ValueError:
                continue
    return sols


expect(f, f"1. q = {[q for q in range(5, 80) if val('124', q) == 67][0]}.")
s2 = [(q, x) for q in range(5, 90) for x in range(q) if val("1x4", q, {"x": x}) == 85]
same("1x4: одно решение", len(s2), 1)
expect(f, f"2. q = {s2[0][0]}, x = {s2[0][1]}:")
same("132 → основание", [q for q in range(4, 60) if val("132", q) == 56], [6])
same(
    "2x1 = 91",
    [(q, x) for q in range(3, 60) for x in range(q) if val("2x1", q, {"x": x}) == 91],
    [(6, 3)],
)
same("2x + xy = 1y5", solve_eq(["2x", "xy"], "1y5", "xy"), [(7, 5, 0)])
s3 = solve_eq(["3x", "xy"], "1y7", "xy")
expect(
    f,
    f"3. {val('xy', s3[0][0], {'x': s3[0][1], 'y': s3[0][2]})}. Решений {'два' if len(s3) == 2 else '?'}",
)
q4 = next(q for q in range(12, 200) if (val("9B4", q) + val("6A7", q)) % (q - 1) == 0)
expect(f, f"4. {q4}.")
expect(f, f"остаток {val('2413', 6) % 7}: 3 − 1 + 4 − 2 = 4; 2413₆ = {val('2413', 6)}")
adds = [val("2x", 6, {"x": x}) - val("3x1", 6, {"x": x}) % val("2x", 6, {"x": x}) for x in range(6)]
brute = min(
    a
    for a in range(1, 100)
    for x in range(6)
    if (val("3x1", 6, {"x": x}) + a) % val("2x", 6, {"x": x}) == 0
)
same("добавка двумя способами", min(adds), brute)
expect(f, f"6. {brute}:")
c7f = 2 * 7**18 + 6 * 7**10 + 3 * 7**6 + 5 * 7**2 + 4
x7f = next(x for x in range(1, 10**6) if digs(c7f - x, 7).count(6) > digs(c7f - x, 7).count(0))
expect(f, f"7. {x7f}:")
same(
    "2x0₅ / 1x0₅: добавки",
    [val("1x0", 5, {"x": x}) - val("2x0", 5, {"x": x}) % val("1x0", 5, {"x": x}) for x in range(5)],
    [25, 5, 10, 15, 20],
)
cf = 3 * 6**22 + 5 * 6**12 + 4 * 6**8 + 2 * 6**5 + 11
lf = 4 * 6**8 + 2 * 6**5 + 11
high = digs(cf // 6**9, 6)
same("старшая часть не меняется при x ≤ L", (cf - 1) // 6**9 == (cf - lf) // 6**9, True)
same("при x ≤ L нулей ≥ 12, пятёрок ≤ 10", (high.count(0), high.count(5) + 9), (12, 10))
ok = digs(cf - (lf + 1), 6)
same("x = L + 1", (lf + 1, ok.count(5), ok.count(0)), (6734028, 12, 9))

# --- 8. Практика и итог ---
f = "08-praktika-i-itog.md"
e1 = 2 * 49**10 + 7**12 - 7**4 - 3
expect(f, f"1. {digs(e1, 7).count(6)}:")
expect(f, f"запись {rec(e1, 7)}₇")
e2 = 3 * 6**80 + 6**50 - 6**20 - 1000
expect(f, f"2. {sum(d > 9 for d in digs(e2, 36))}: запись {rec(e2, 36)}₃₆")
z3 = [x for x in range(1, 1001) if digs(6**8 + 6**3 - x, 6).count(0) == 3]
expect(f, f"3. {z3[-1]}: три нуля у x = {z3[0]}, {z3[1]} и {z3[2]}")
same("три нуля — ровно три x", len(z3), 3)
r4 = one(["9x36", "3x7Ax"], [1, 1], 21, range(21), 20)
same("9x36₂₁ + 3x7Ax₂₁: одно x", len(r4), 1)
expect(f, f"4. {r4[0][1] // 10}: подходит только x = {r4[0][0]}, сумма {r4[0][1]}")
p5 = pairs("1xy3", 7, "y2x", 8, 13)
b5 = min(p5, key=lambda t: t[2])
expect(f, f"5. {b5[2] // 13}: наименьшая сумма {b5[2]} при x = {b5[0]}, y = {b5[1]}")
expect(f, f"первая найденная пара x = {p5[0][0]}, y = {p5[0][1]} даёт {p5[0][2]}")

bad = [c for c in checks if not c[2]]
for c in bad:
    print("FAIL", c[0], c[1])
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
