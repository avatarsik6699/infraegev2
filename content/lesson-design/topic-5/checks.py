"""Independent recomputation of every task answer in topic 5.

Usage: python3 -I content/lesson-design/topic-5/checks.py

Each answer is recomputed here by a different method than the lesson uses:
records are built from digit lists (not bin/oct/to_base strings), results
are compared with the arithmetic formulas of the subtopics, and searches run
over full ranges without early stops. Every expected answer must appear
verbatim in the answers of its subtopic file. Exit code 1 if any check fails.
"""

import sys
from pathlib import Path

D = Path(__file__).resolve().parent


def answers(f):
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


def digits(n, q):
    """Digits of n in base q, most significant first, as a list of ints."""
    out = []
    while n:
        n, d = divmod(n, q)
        out.append(d)
    return out[::-1] or [0]


def value(ds, q):
    """Horner: the number written by the digit list ds in base q."""
    v = 0
    for d in ds:
        v = v * q + d
    return v


def rec(n, q):
    return "".join(str(d) for d in digits(n, q))


checks = []


def expect(f, needle, ok=True):
    checks.append((f, needle, ok and needle in answers(f)))


def same(label, a, b):
    checks.append(("—", f"{label}: {a} = {b}", a == b))


# --- 1. Число и его запись ---
f = "01-chislo-i-zapis.md"
expect(f, f"1. {rec(22, 2)}₂ и {rec(22, 3)}₃")
expect(f, f"2. {value([1, 0, 0, 1, 1], 2)}, {value([2, 1, 0, 1], 3)} и {value([1, 4, 7], 8)}")
expect(f, f"= {value([1, 2, 0, 3], 4)}.")
six = [n for n in range(1, 200) if len(digits(n, 2)) == 6]
expect(f, f"4. От {six[0]} до {six[-1]}: 2⁵ ≤ N < 2⁶, всего {len(six)} числа.")
expect(f, f"5. {len(digits(1000, 2))} цифр")
expect(f, f"6. `{value([1, 0, 1], 2)} 101 {value([1, 0, 1], 3)}`")
expect(f, f"`'{rec(29, 3)[::-1]}'`")
five = [n for n in range(50, 301) if len(digits(n, 3)) == 5]
expect(f, f"8. {len(five)}:")
lead2 = [n for n in range(1, 501) if len(digits(n, 3)) == 5 and digits(n, 3)[0] == 2]
expect(f, f"9. {len(lead2)}:")

# --- 2. Дописывание цифр ---
f = "02-dopisyvanie.md"
expect(f, f"1. {value(digits(11, 2) + [0, 0, 1], 2)}:")
expect(f, f"2. {value([1, 0] + digits(13, 2), 2)}:")
expect(f, f"3. {[n for n in range(1, 47) if value(digits(n, 2) + [1], 2) == 47][0]}:")
expect(f, f"4. {value(digits(7, 3) + [1, 2], 3)}:")
expect(f, f"5. {value(digits(45, 2) + digits(45, 2)[-3:], 2)}:")
expect(f, f"6. {value(digits(6, 2) + digits(5, 2), 2)}:")


def blocks_lr(n):
    ds = digits(n, 2)
    return value([1] + ds + [0], 2) if n % 2 == 0 else value([1, 1] + ds + [1], 2)


ok8 = [n for n in range(1, 300) if blocks_lr(n) > 200]
expect(f, f"8. {ok8[0]}:")
expect(f, f"получаем `{rec(blocks_lr(ok8[0]), 2)}`₂ = {blocks_lr(ok8[0])}")
same("2: ветви формулой", blocks_lr(6), 2**4 + 2 * 6)


def tern8(n):
    ds = digits(n, 3)
    return value(ds + ds[-2:], 3) if n % 3 == 0 else value(ds + digits(n % 3 * 8, 3), 3)


ok9 = [n for n in range(1, 300) if tern8(n) > 500]
expect(f, f"9. {ok9[0]}:")
expect(f, f"= {tern8(ok9[0])}. Все N от 1 до {ok9[0] - 1}")

# --- 3. Части записи ---
f = "03-chasti-zapisi.md"


def inv(n, q, length=None):
    ds = digits(n, q)
    if length:
        ds = [0] * (length - len(ds)) + ds
    return value([q - 1 - d for d in ds], q)


expect(f, f"1. {inv(22, 2)}:")
expect(f, f"2. {value([1, 1, 0] + [1, 1, 0, 1], 2)}:")
expect(f, f"3. {inv(5, 2)} и {inv(5, 2, 8)}:")
s = "1101001"
expect(f, f"4. `'{s[2:5]}'`, `'{s[-3:]}'` и `'{s[::-1]}'`.")
expect(f, f"5. {value(digits(23, 2)[:-1] + [0, 0], 2)}:")
expect(f, f"6. {value(digits(52, 2)[::-1], 2)}:")
expect(f, f"7. {inv(46, 3)}:")
same("3: формула инверсии троичной", inv(46, 3), 3 ** len(digits(46, 3)) - 1 - 46)


def move_inv(n):
    ds = digits(n, 2)
    ds = ds[2:] + ds[:2]
    return value([1 - d for d in ds], 2)


ok9 = [n for n in range(4, 500) if move_inv(n) > 40]
expect(f, f"9. {ok9[0]}:")
expect(
    f,
    f"= {move_inv(ok9[0])}. Пятизначные записи (N от 16 до 31) дают не больше {max(move_inv(n) for n in range(16, 32))}",
)

# --- 4. Сумма цифр ---
f = "04-summa-cifr.md"


def append_parity(n, times):
    ds = digits(n, 2)
    for _ in range(times):
        ds = ds + [sum(ds) % 2]
    return value(ds, 2)


expect(f, f"2. {append_parity(7, 2)}:")
expect(f, f"3. {sum(digits(50, 3))}:")
expect(f, f"= {value([2, 1, 1, 1], 3)}.")
expect(f, f"5. {sum(digits(100, 10))} и {sum(digits(100, 2))}:")
w = [int("40517"[i : i + 3]) for i in range(3)]
expect(f, f"разность {max(w)} − {min(w)} = {max(w) - min(w)}.")
ok8 = [n for n in range(1, 300) if append_parity(n, 3) > 300]
expect(f, f"8. {ok8[0]}:")
expect(
    f,
    f"R = 8 · {ok8[0]} + 4 = {append_parity(ok8[0], 3)}. При N = {ok8[0] - 1} получается ровно {append_parity(ok8[0] - 1, 3)}.",
)
same(
    "4: дважды пересчёт = 4N или 4N + 2",
    all(append_parity(n, 2) in (4 * n, 4 * n + 2) for n in range(1, 500)),
    True,
)


def pairs(n):
    t = str(n)
    v = [int(t[i : i + 2]) for i in range(len(t) - 1)]
    return max(v) + min(v)


expect(f, f"9. {[n for n in range(1001, 20000) if pairs(n) == 100][0]}:")

# --- 5. Поиск ответа ---
f = "05-poisk-otveta.md"


def ten_or_01(n):
    return value(digits(n, 2) + ([1, 0] if n % 2 == 0 else [0, 1]), 2)


expect(f, f"1. N = {[n for n in range(1, 200) if ten_or_01(n) > 100][0]}:")
can100 = any(append_parity(n, 2) == 100 for n in range(1, 101))
expect(f, "2. Нет:", not can100)


def tern7(n):
    ds = digits(n, 3)
    return value(ds + ds[-2:], 3) if n % 3 == 0 else value(ds + digits(n % 3 * 7, 3), 3)


expect(f, f"3. {tern7(14)}:")


def e111(n):
    return value(digits(n, 2) + ([1, 1, 1] if n % 2 == 0 else [0]), 2)


best4 = min((e111(n), n) for n in range(1, 500) if e111(n) > 30)
expect(f, f"4. R = {best4[0]} при N = {best4[1]}:")
expect(f, f"5. N от 1 до {500 // 8}:")


def left3(n):
    ds = digits(n, 2)
    return value(ds + ds[-2:], 2) if n % 3 == 0 else value(digits(n % 3 * 3, 2) + ds, 2)


best7 = max((left3(n), n) for n in range(2, 1000) if left3(n) <= 200)
expect(f, f"7. {best7[0]} при N = {best7[1]}:")


def sum_par(n):
    ds = digits(n, 3)
    return value(ds + [1], 3) if sum(ds) % 2 == 0 else value([2] + ds, 3)


cands = sorted((sum_par(n), n) for n in range(1, 5000) if sum_par(n) > 1000)
same("5.8: наименьший R единственный", cands[0][0] < cands[1][0], True)
expect(f, f"8. {cands[0][1]}:")
expect(f, f"R = {rec(sum_par(cands[0][1]), 3)}₃ = {cands[0][0]}.")
expect(f, f"9. {len({value(digits(n, 2)[::-1], 2) for n in range(1, 101)})}:")
same("5: transform_ternary ≤ 300", max(tern7(n) for n in range(1, 2000) if tern7(n) <= 300), 286)


def octal(n):
    ds = digits(n, 8)
    return value(ds + ds[-2:], 8) if n % 3 == 0 else value(digits(n % 3 * 5, 8) + ds, 8)


same(
    "5: восьмеричный алгоритм",
    min((octal(n), n) for n in range(8, 5000) if octal(n) > 350),
    (351, 31),
)

# --- 6. Рассуждение вместо перебора ---
f = "06-rassuzhdenie-vmesto-perebora.md"


def swap(n):
    return abs(n - inv(n, 3))


expect(f, f"1. {[n for n in range(1, 1000) if swap(n) == 12][0]}:")
same("6: R = 10", [n for n in range(1, 1000) if swap(n) == 10][0], 18)
same("6: R всегда чётно", any(swap(n) % 2 for n in range(1, 20000)), False)
expect(f, f"3. {[n for n in range(1, 1000) if swap(n) == 40][0]}:")
same(
    "6: наибольший R при N ≤ 10⁹",
    max(blocks_lr(n) for n in range(10**9 - 3000, 10**9 + 1)),
    8442450943,
)
same("6: формула нечётной ветви", blocks_lr(999_999_999), 3 * 2**31 + 2 * 999_999_999 + 1)


def copy3(n):
    return 8 * n + n % 8


same(
    "6: copy3 = формула",
    all(value(digits(n, 2) + digits(n, 2)[-3:], 2) == copy3(n) for n in range(4, 3000)),
    True,
)
same(
    "6: счёт copy3 перебором",
    sum(1 for n in range(4, 250_010) if 10**6 <= copy3(n) <= 2 * 10**6),
    125001,
)


def mod3(n):
    return value(digits(n, 2) + [n % 3 // 2, n % 3 % 2], 2)


A, B = 123_456_789, 987_654_321
same("6: mod3 растёт", all(mod3(n) < mod3(n + 1) for n in range(1, 100000)), True)
# count without the lesson's walk: inputs with 4n + r in [A; B] for each remainder r
count = 0
for r in range(3):
    # n ≡ r (mod 3) and A ≤ 4n + r ≤ B
    lo = -(-(A - r) // 4)
    hi = (B - r) // 4
    lo += (r - lo) % 3
    hi -= (hi - r) % 3
    count += (hi - lo) // 3 + 1 if hi >= lo else 0
expect(f, f"6. {count}:")

# --- 7. Практика и итог ---
f = "07-praktika-i-itog.md"


def p1(n):
    ds = digits(n, 2)
    return value([1, 0] + ds, 2) if n % 2 == 0 else value([1] + ds + [1, 1], 2)


b1 = max((p1(n), n) for n in range(1, 1000) if p1(n) <= 150)
expect(f, f"1. {b1[0]} при N = {b1[1]}:")


def p2(n):
    ds = digits(n, 3)
    for _ in range(2):
        ds = ds + [sum(ds) % 3]
    return value(ds, 3)


n2 = [n for n in range(1, 2000) if p2(n) > 400][0]
expect(f, f"2. {n2}:")
expect(f, f"R = {rec(p2(n2), 3)}₃ = {p2(n2)}.")


def p3(n):
    return value(digits(n, 2)[::-1] + [1], 2)


n3 = [n for n in range(1, 5000) if p3(n) > 1000][0]
expect(f, f"3. {n3}:")
expect(f, f"= {p3(n3)}.")


def p4(n):
    ds = digits(n, 8)
    return value(ds + ds[:1], 8) if n % 2 == 0 else value(digits(n % 5, 8) + ds, 8)


c4 = sorted((p4(n), n) for n in range(1, 5000) if p4(n) > 600)
same("7.4: наименьший R единственный", c4[0][0] < c4[1][0], True)
expect(f, f"4. {c4[0][1]}:")
expect(f, f"R = {rec(c4[0][0], 8)}₈ = {c4[0][0]}.")


def p5(n):
    ds = [d for d in digits(n, 10) if d][::-1]
    return value(ds, 10) if ds else 0


expect(f, f"5. {len({p5(n) for n in range(10, 1000)})}.")

bad = [c for c in checks if not c[2]]
for c in bad:
    print("FAIL", c[0], c[1])
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
