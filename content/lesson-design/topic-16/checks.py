"""Independent recomputation of every task answer in topic 16.

Usage: python3 -I content/lesson-design/topic-16/checks.py

The lessons compute answers with recursive functions; here every value is
recomputed by another method: tables filled in a loop (up or down), closed
formulas, brute force over all arguments, and an iterative digit-by-digit
count with a dictionary of states instead of the recursive ``solve`` with
``@cache``. Every expected answer must appear verbatim in the answers of its
subtopic file. Exit code 1 if any check fails.
"""

import sys
from fractions import Fraction
from math import comb, prod
from pathlib import Path

D = Path(__file__).resolve().parent
checks = []


def answers(f):
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


def expect(f, needle):
    checks.append((f, needle, needle in answers(f)))


def same(label, a, b):
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def up(base: dict, rule, n: int) -> dict:
    """Fill a table by increasing argument: f[k] = rule(f, k) for k not in base."""
    f = dict(base)
    for k in range(min(base), n + 1):
        if k not in f:
            f[k] = rule(f, k)
    return f


def down(is_base, base_value, rule, n: int, top: int) -> dict:
    """Fill a table by decreasing argument from top: f[k] = rule(f, k)."""
    f = {}
    for k in range(top, n - 1, -1):
        f[k] = base_value(k) if is_base(k) else rule(f, k)
    return f


def digits(n, b=10):
    out = []
    while n:
        n, d = divmod(n, b)
        out.append(d)
    return out[::-1] or [0]


def count_digits(bound, b, accept, start, step):
    """How many 1 ≤ n ≤ bound have accept(state) after reading all digits of n
    in base b left to right; state = step(state, digit), leading zeros skipped.
    An iterative table of states, not the lesson's recursive solve."""
    ds = digits(bound, b)
    states = {(True, False, start): 1}  # (tight, started, state) -> count
    for pos_digit in ds:
        nxt: dict = {}
        for (tight, started, st), cnt in states.items():
            for d in range((pos_digit if tight else b - 1) + 1):
                t2 = tight and d == pos_digit
                if not started and d == 0:
                    key = (t2, False, st)
                else:
                    s2 = step(st, d)
                    if s2 is None:
                        continue
                    key = (t2, True, s2)
                nxt[key] = nxt.get(key, 0) + cnt
        states = nxt
    return sum(c for (_, started, st), c in states.items() if started and accept(st))


# --- 1. Функция, заданная через себя ---
f = "01-funktsiya-cherez-sebya.md"
t = up({1: 3}, lambda f, k: f[k - 1] + 2 * k, 5)
expect(f, f"1. {t[5]}: последовательно получаются {', '.join(map(str, t.values()))}.")
t = up({1: 2}, lambda f, k: 3 * f[k - 1] - 1, 4)
expect(f, f"2. {t[4]}: значения {', '.join(map(str, t.values()))}.")
lin = lambda n: 3 * n - 2  # noqa: E731
expect(f, f"3. {lin(4)}, {lin(5) - 1}, {lin(6)} и {2 * lin(3)}")
# F(5) = 5F(4) + 5 = 5(4F(3) + 4) + 5: check on several F(3) values
coef = [(5 * (4 * x + 4) + 5) for x in (0, 1)]
same("1.4 коэффициенты", (coef[1] - coef[0], coef[0]), (20, 25))
expect(f, "4. F(5) = 5(4F(3) + 4) + 5 = 20F(3) + 25.")
t = up({1: 1}, lambda f, k: 2 * f[k - 1] + k, 4)
expect(f, f"5. {t[4]}:")
expect(f, f"F(2) = {t[2]}, F(3) = {t[3]}, F(4) = {t[4]}.")
t = up({1: 2, 2: 3}, lambda f, k: f[k - 1] + 2 * f[k - 2], 6)
expect(f, f"6. {t[6]}: значения {', '.join(map(str, t.values()))}.")
t = up({1: 1, 2: 1, 3: 1}, lambda f, k: f[k - 1] + f[k - 3], 10)
expect(f, f"7. {t[10]}: значения {', '.join(map(str, t.values()))}.")
t = up({1: 3, 2: 4}, lambda f, k: 2 * f[k - 1] - f[k - 2] + k, 6)
expect(f, f"8. {t[6]}: значения {', '.join(map(str, t.values()))};")
same("1.9 формула", up({1: 1}, lambda f, k: f[k - 1] * (k + 1), 5)[5], prod(range(3, 7)))
expect(f, "9. 360: значения 1, 3, 12, 60, 360.")

# --- 2. Рекурсивная функция на Python ---
f = "02-rekursivnaya-funktsiya.md"
chain8, chain9 = list(range(8, 1, -2)), list(range(9, 0, -2))
same("2.1 цепочки", (chain8[-1], chain9[-1]), (2, 1))
expect(f, "1. Для 8: аргументы 8, 6, 4, 2 доходят до базы F(2).")
reach = [n for n in (9, 10, 12) if n % 3 == 0]
expect(f, f"2. Для {reach[0]} и {reach[1]}:")
t = down(lambda k: k >= 20, lambda k: k, lambda f, k: f[k + 3] + 2, 4, 22)
expect(f, f"3. {t[4]}: аргументы 4, 7, 10, 13, 16, 19, 22")
t = down(lambda k: k > 30, lambda k: k, lambda f, k: f[k + 4] - 1, 17, 34)
expect(f, f"4. {t[17]}:")
par = up({1: 1, 2: 2}, lambda f, k: f[k - 1] + k if k % 2 == 0 else 2 * f[k - 2], 12)
expect(f, f"5. {par[12]}: F(11) = {par[11]}, поэтому F(12) = {par[11]} + 12.")
t = up({1: 5}, lambda f, k: f[k - 1] - 2 if k % 2 == 0 else f[k - 1] + 3 * k, 6)
expect(f, f"6. {t[6]}: значения {', '.join(map(str, t.values()))}.")
t = up({1: 1, 2: 3}, lambda f, k: k + f[k - 1] if k % 2 == 0 else 3 * f[k - 2], 14)
expect(f, f"7. {t[14]}: F(13) = 3 · F(11) = {t[13]}, F(14) = 14 + {t[13]}.")
t = up({1: 1, 2: 2}, lambda f, k: f[k - 1] + k if k % 3 == 0 else f[k - 2] + 2, 20)
expect(f, f"8. {t[20]}: F(20) = F(18) + 2, F(18) = F(17) + 18 = {t[17]} + 18.")

# --- 3. Таблица значений и цикл ---
f = "03-tablitsa-znacheniy.md"
t = up({1: 4}, lambda f, k: 2 * f[k - 1] - k, 6)
expect(
    f,
    f"1. {t[6]}: `value = 2 * value - n` для n от 2 до 6 даёт {', '.join(str(t[k]) for k in range(2, 7))}.",
)
t = down(lambda k: k >= 20, lambda k: k, lambda f, k: f[k + 2] + k, 15, 21)
expect(f, f"2. {t[15]}:")
same("3.2 сумма", t[15], 15 + 17 + 19 + 21)
a, b = 1, 1
for _ in range(3, 7):
    a = b
    b = b + a
expect(f, f"3. {b}:")
fg = {1: (2, 1)}
for k in range(2, 5):
    fg[k] = (fg[k - 1][0] + fg[k - 1][1], 2 * fg[k - 1][0])
expect(f, f"4. F(4) = {fg[4][0]}, G(4) = {fg[4][1]}.")
g = [2 * k - 1 for k in range(1, 6)]
expect(f, f"Значения G: {', '.join(map(str, g))}; F(5) = {sum(g)}.")
s6 = up({1: 1}, lambda f, k: sum(f[i] for i in range(1, k)) + 2, 6)
expect(f, f"6. {s6[6]}: значения {', '.join(map(str, s6.values()))};")
t = down(lambda k: k >= 40, lambda k: 2, lambda f, k: f[k + 1] + f[k + 2], 30, 41)
expect(f, f"7. {t[30]}:")
F, G = {1: 1}, {1: 1}
for k in range(2, 13):
    F[k], G[k] = F[k - 1] + 2 * G[k - 1], F[k - 1] + G[k - 1]
expect(f, f"8. {F[12] + G[12]}: F(12) = {F[12]}, G(12) = {G[12]}.")

# --- 4. Повторные вызовы, перебор и глубина ---
f = "04-povtornye-vyzovy.md"
C = up({1: 1, 2: 1}, lambda c, k: 1 + c[k - 1] + c[k - 2], 40)
fib = up({1: 1, 2: 1}, lambda c, k: c[k - 1] + c[k - 2], 50)
same("4.текст F(50)", fib[50], 12586269025)
same("4.текст число вызовов", [C[10], C[20], C[30], C[40]], [109, 13529, 1664079, 204668309])
same(
    "4.текст F(2000) цифр",
    len(str(up({1: 1, 2: 1}, lambda c, k: c[k - 1] + c[k - 2], 2000)[2000])),
    418,
)
# with @cache: F(n) computes n values, plus one repeated call F(k-2) from each computing k > 2
expect(
    f,
    f"1. {C[6]} вызовов: C(6) = 1 + C(5) + C(4) = 1 + {C[5]} + {C[4]}. С `@cache` — {6 + (6 - 2) - 1} вызовов, вычисляют 6.",
)
expect(
    f,
    f"2. F(5) = {2**4}; прямая программа делает 1 + 2 + 4 + 8 + 16 = {2**5 - 1} вызов, с `@cache` — 9",
)
expect(f, f"3. F(5) = {up({1: 1}, lambda c, k: 3 * c[k - 1] + 1, 5)[5]} при 5 вызовах")
expect(f, f"5. 20 вызовов, F(1 000 000) = {(10**6).bit_length() - 1}:")
expect(f, f"6. {sum(1 for n in range(1, 101) if bin(n).count('1') == 3)}.")
t = up({1: 1}, lambda c, k: c[k - 1] + k % 7, 3000)
expect(f, f"7. {t[3000]}.")
expect(f, f"8. {sum(1 for n in range(1, 701) if bin(n).count('1') == 4)}.")


def p9(n):
    extra = 0
    while n >= 100 and n % 3:
        extra += 5
        n -= 1
    return extra + (n if n < 100 else n + p9(n // 3))


n9 = next(n for n in range(1, 10**5) if p9(n) > 2000)
expect(f, f"9. {n9}: F({n9}) = {p9(n9)}.")
expect(f, f"F(1337) = {p9(1337)}, а F(1338) = {p9(1338)}")
same(
    "4.текст наименьшее n с пятью единицами",
    next(n for n in range(1, 99) if bin(n).count("1") == 5),
    31,
)

# --- 5. Большие аргументы ---
f = "05-bolshie-argumenty.md"
same("5.текст разность", sum(3 * k for k in range(2024, 2027)), 18225)
same("5.текст 3F(30) − …", 3 * (26 + 28 + 30) - (26 + 28) - 26, 172)
fact = up({1: 1}, lambda c, k: k * c[k - 1], 102)
expect(f, f"1. {(fact[102] + 3 * fact[101]) // fact[100]}:")
t = up({1: 1, 2: 1, 3: 1}, lambda c, k: c[k - 2] + k, 101)
expect(f, f"2. {t[101] - t[95]}:")
t = up({1: 1, 2: 1, 3: 1}, lambda c, k: c[k - 3] + 2 * k, 40)
expect(f, f"3. {2 * t[40] - t[37] - t[34]}:")
t = up({k: k for k in range(-3, 7)}, lambda c, k: c[k - 4] + 5, 51)
expect(f, f"4. F(50) = {t[50]}, F(51) = {t[51]}:")
t = up({1: 1, 2: 1}, lambda c, k: 2 * c[k - 2] if k % 2 else 3 * k * c[k - 1] + c[k - 3], 10)
expect(f, f"5. {Fraction(t[10], t[5])}:")
tri = down(lambda k: k > 200, lambda k: k, lambda c, k: k + c[3 * k], 1, 600)
G5 = Fraction(tri[5], 5)
expect(f, f"6. G(5) = {G5}:")
expect(f, f"n = {', '.join(str(n) for n in range(1, 201) if Fraction(tri[n], n) == G5)}.")
g = down(lambda k: k >= 40, lambda k: k, lambda c, k: c[k + 6] + 1, 1, 46)
t = up({k: 2 * g[k + 1] for k in range(1, 20)}, lambda c, k: c[k - 5] + 10, 48)
expect(f, f"7. {t[48]}:")
g = down(lambda k: k >= 20, lambda k: Fraction(k, 4), lambda c, k: c[k + 3] + 2, 1, 22)
g2 = down(lambda k: k >= 20, lambda k: k // 4, lambda c, k: c[k + 3] + 2, 1, 22)
expect(f, f"8. {4 * g[1]}:")
expect(f, f"С `//` получится {4 * g2[1]}.")
expect(f, f"9. {2029 * 2031}:")
t = up({k: k for k in range(1, 11)}, lambda c, k: k + c[k - 4], 3001)
expect(f, f"10. {t[3001] - t[2993]}:")
t = up({k: k for k in range(-5, 6)}, lambda c, k: c[k - 3] + 4, 21)
same("5.текст F(20), F(21)", (t[20], t[21]), (25, 27))
same("5.текст k по формуле", [(n - 5 + 2) // 3 for n in (20, 21)], [5, 6])

# --- 6. Что считает функция ---
f = "06-chto-schitaet-funktsiya.md"
same("6.текст 1…63", sum(1 for n in range(1, 64) if bin(n).count("1") == 2), comb(6, 2))
expect(f, f"1. {comb(7, 2)}:")
same("6.1 перебор", comb(7, 2), sum(1 for n in range(1, 128) if bin(n).count("1") == 2))
expect(f, f"F(100) = {len(digits(100, 3))}.")
expect(f, f"3. {sum(1 for n in range(100, 1000) if '7' not in str(n))}:")
even0 = lambda n: all(int(c) % 2 or c == "0" for c in str(n))  # noqa: E731
expect(f, f"4. {sum(1 for n in range(1000, 10000) if even0(n))}:")
same("6.текст трёхзначные", sum(1 for n in range(100, 1000) if even0(n)), 180)
ds = lambda n: sum(digits(n))  # noqa: E731
expect(f, f"5. {sum(1 for n in range(1000, 5001) if ds(n) > ds(n + 1))}:")
expect(f, f"6. {next(n for n in range(1, 10**5) if ds(n) - ds(n + 1) == 26)}:")


def f25(n):
    a = b = 0
    while n % 2 == 0:
        n, a = n // 2, a + 1
    while n % 5 == 0:
        n, b = n // 5, b + 1
    return 2 * a + 3 * b


expect(f, f"7. {next(n for n in range(1, 10**4) if f25(n) == 13)}:")
t = up({1: 2}, lambda c, k: c[k - 1] + 2 * k, 30)
same("6.8 формула", all(t[k] == k * (k + 1) for k in t), True)
expect(f, f"8. {t[30]}:")
expect(f, f"9. {sum(1 for n in range(10**5, 3 * 10**5 + 1) if even0(n))}:")
expect(f, f"10. {comb(20, 3)}:")


def f4(n):
    return sum([0, 1, 1, 2][d] for d in digits(n, 4))


same("6.текст 239", next(n for n in range(1, 10**4) if f4(n) == 7 and f4(n + 1) == 4), 239)

# --- 7. Подсчёт по цифрам ---
f = "07-podschet-po-tsifram.md"


def by_sum(bound, target, b=10):
    return count_digits(
        bound, b, lambda s: s == target, 0, lambda s, d: s + d if s + d <= target else None
    )


def by_prod(bound, target, b=10):
    return count_digits(
        bound,
        b,
        lambda s: s == target,
        1,
        lambda s, d: s * d if d and target % (s * d) == 0 else None,
    )


same("7.текст 100…250", by_sum(250, 6) - by_sum(99, 6), 11)
same("7.текст произведение", by_prod(500, 6), 13)
same("7.1 перебор", by_sum(999, 5), sum(1 for n in range(1, 1000) if ds(n) == 5))
expect(f, f"1. {by_sum(999, 5)}:")
expect(f, f"2. {sum(1 for n in range(100, 501) if ds(n) == 9)}:")
expect(f, f"3. {sum(1 for n in range(1, 1001) if prod(digits(n)) == 12)}:")
expect(f, f"5. {sum(1 for n in range(1, 101) if bin(n).count('1') == 3)}:")
expect(f, f"6. {sum(1 for n in range(1000, 5001) if ds(n) == 13)}:")
# digit sum 100 over 12 positions: coefficient of x^100 in (1 + x + … + x^9)^12
poly = [1]
for _ in range(12):
    new = [0] * (len(poly) + 9)
    for i, c in enumerate(poly):
        for d in range(10):
            new[i + d] += c
    poly = new
expect(f, f"7. {poly[100]}:")
same("7.7 два способа", poly[100], by_sum(10**12 - 1, 100))
expect(f, f"8. {by_prod(2**40, 30, 12)}:")
same(
    "7.8 малая граница",
    by_prod(3000, 30, 12),
    sum(1 for n in range(1, 3001) if prod(digits(n, 12)) == 30),
)

# --- 8. Практика и итог ---
f = "08-praktika-i-itog.md"
t = up({1: 2}, lambda c, k: c[k - 1] + k if k % 2 == 0 else 2 * c[k - 2] + k, 21)
expect(f, f"1. {t[21]}: F(21) = 2 · F(19) + 21 = 2 · {t[19]} + 21;")
t = up({1: 1}, lambda c, k: (k - 1) * c[k - 1], 2027)
expect(f, f"2. {(t[2027] + 4 * t[2026]) // t[2025]}:")
t = up({k: k for k in range(-2, 7)}, lambda c, k: k + 2 + c[k - 3], 4000)
expect(f, f"3. {t[4000] - t[3991]}:")
expect(f, f"4. {next(n for n in range(1, 10**4) if sum(digits(n, 3)) == 9)}:")
g = down(lambda k: k >= 50, lambda k: Fraction(k, 4), lambda c, k: c[k + 5] + 3, 1, 54)
t = up({k: 4 * (g[k + 2] - 3) for k in range(1, 15)}, lambda c, k: c[k - 3] + 7, 100)
expect(f, f"5. {t[100]}:")
g2 = down(lambda k: k >= 50, lambda k: k // 4, lambda c, k: c[k + 5] + 3, 1, 54)
t2 = up({k: 4 * (g2[k + 2] - 3) for k in range(1, 15)}, lambda c, k: c[k - 3] + 7, 100)
expect(f, f"получилось бы {t2[100]}.")

bad = [c for c in checks if not c[2]]
for c in bad:
    print("FAIL", c[0], c[1])
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
