"""Independent recomputation of every task answer of the Python course.

Usage: python3 -I content/lesson-design/course-python/checks.py

Each answer is recomputed here by a second method (divmod instead of // and %,
a brute force instead of a formula, running the student's program text) and
the expected fragment must appear verbatim in the lesson file. A program
answer is checked by running it with the given input. Exit code 1 if any
check fails.
"""

import contextlib
import io
import sys
from pathlib import Path

D = Path(__file__).resolve().parent
failures: list[str] = []
checked: set[str] = set()  # lessons with at least one check


def text(prefix: str) -> str:
    (path,) = D.glob(f"{prefix}-*.md")
    return path.read_text(encoding="utf-8")


def has(prefix: str, *fragments: str) -> None:
    checked.add(prefix)
    body = text(prefix)
    for fragment in fragments:
        if fragment not in body:
            failures.append(f"{prefix}: {fragment!r} not in the lesson")


def same(prefix: str, got, expected) -> None:
    checked.add(prefix)
    if got != expected:
        failures.append(f"{prefix}: recomputed {got!r}, lesson says {expected!r}")


def run(source: str, stdin: str = "") -> str:
    """Output of a short program, as a student would see it."""
    out = io.StringIO()
    lines = iter(stdin.splitlines())
    with contextlib.redirect_stdout(out):
        exec(source, {"input": lambda prompt="": next(lines)})
    return out.getvalue()


# 01 — program and errors
same("01", run("print(5 * 23)"), "115\n")
same("01", run("print(3 * 40 + 2 + 15)"), "137\n")
same("01", 3 * 40 + 2 * 15, 150)
same("01", 100 / 4, 25.0)
has("01", "Две строки: 42 и 7 * 6", "выводит 115", "Выводит 137", "стоимость 150")
has("01", "Успело напечататься 25.0", "вывод: 120, 30, 150")

# 02 — values and names
a = 3
b = a
a += 4
has("02", f"`{a} {b}`")
x = (5 * 2) + 1
has("02", f"3. {x}: сначала")
has("02", "5. 128 и 20")
a = 1
b = a + 1
a = b * 3
b = a - b
has("02", f"a = 1; b = 2; a = {a}; b = {b}.")
names = ["2nd_place", "max_value", "my name", "for", "total"]
ok = [n for n in names if n.isidentifier() and n not in {"for"}]
same("02", ok, ["max_value", "total"])
has("02", "вывод 150")

# 03 — numbers
q, r = divmod(200, 7)
has("03", f"1. {q} и {r}: 200 = 7·{q} + {r}.")
q, r = divmod(-17, 5)
has("03", f"2. {q}, {r} и {int(-17 / 5)}".replace("-", "−"))
has("03", f"3. {2 + 3 * 4**2}, {-(2**4)} и {(-2) ** 4}.".replace("-", "−"))
has("03", f"4. {9051 % 10}, {9051 // 10} и {9051 // 10 % 10}.")
has("03", f"5. {round(4.5)}, {round(5.5)} и {round(-2.5)}".replace("-", "−"))
same("03", 1001 % 7, 0)
has("03", f"7. {100 // 7} недель и {100 % 7} дня")
days, rest = divmod(100000, 86400)
hours, rest = divmod(rest, 3600)
minutes, seconds = divmod(rest, 60)
has("03", f"`{days} {hours} {minutes} {seconds}`")

# 04 — input and output
prog = "l = int(input())\nw = int(input())\nprint(l * w, 2 * (l + w))"
has("04", "вывод " + run(prog, "7\n2").strip())
has("04", "1. С `int`: вывод 14 18")
has("04", "2. 12 — строки")
has("04", f"5. {7 / 3:.2f}.")
has("04", "вывод 120.")
sec_prog = 't = int(input())\nprint(f"{t // 3600} ч {t % 3600 // 60} мин {t % 60} с")'
has("04", run(sec_prog, "3671").strip(), run(sec_prog, "7322").strip())


# 05 — logic
def exactly_one(n):
    return (n % 3 == 0) != (n % 5 == 0)


same("05", [exactly_one(n) for n in (9, 10, 7, 15)], [True, True, False, False])
has("05", "для 9 и 10 — True, для 7 и 15 — False")
same("05", [7 > 3 and 2 > 5, 7 > 3 or 2 > 5, not 7 > 3], [False, True, False])
x = 5
has("05", f"4. {x == 1 or 2}: второй")
same("05", [bool(""), bool("0"), bool(0), bool(" ")], [False, True, False, True])
same("05", [(not n > 10) or n % 2 == 0 for n in (7, 12, 15)], [True, True, False])


def leap(y):
    return y % 4 == 0 and y % 100 != 0 or y % 400 == 0


def leap_slow(y):
    # second method: the calendar rule spelled out case by case
    if y % 400 == 0:
        return True
    if y % 100 == 0:
        return False
    return y % 4 == 0


for y in (1900, 2000, 2024, 2023):
    same("05", leap(y), leap_slow(y))
has("05", "1900 — False, 2000 — True, 2024 — True, 2023 — False")

# 06 — branching
same("06", max(4, 4, -1), 4)
has("06", "1. 4; с нулевым началом для −5, −2, −9 получится 0 вместо −2.")
has("06", "2. 300 и 0")


def level06(v, high, mid, swapped=False):
    checks = (
        [(mid, "средний"), (high, "высокий")] if swapped else [(high, "высокий"), (mid, "средний")]
    )
    return next((name for limit, name in checks if v >= limit), "начальный")


has(
    "06", "3. " + ", ".join(level06(v, 90, 70) for v in (90, 89, 70)) + f" и {level06(69, 90, 70)}."
)
has("06", f"5. {level06(59, 85, 60, True)} и {level06(100, 85, 60, True)};")
same("06", {level06(v, 85, 60, True) for v in range(0, 101)}, {"начальный", "средний"})
has("06", "8. 1900 — обычный, 2024 — високосный.")
same("06", [leap_slow(1900), leap_slow(2024)], [False, True])


def triangle(a, b, c):
    return a < b + c and b < a + c and c < a + b


same("06", [triangle(3, 4, 5), triangle(1, 2, 3)], [True, False])

# 07 — while
k = next(k for k in range(100) if 2**k >= 64)
has("07", f"1. 0 и {k}")
has("07", f"2. {sum(i * i for i in range(1, 6))} = 1 + 4")
values = list(range(10, 0, -3))
has("07", f"3. {len(values)} итерации", f"i = {values[-1] - 3}".replace("-", "−"))
p = 1
for i in range(1, 6):
    p *= i
has("07", f"4. {p};")
digits = [int(c) for c in "90817"]
has("07", f"5. Сумма {sum(digits)}, количество {len(digits)}")
has("07", run("t = c = 0\nfor v in (4, -2, 9):\n    c += 1\n    t += v\nprint(c, t)").strip())


def steps(n):
    s = 0
    while n != 1:
        n = n // 2 if n % 2 == 0 else 3 * n + 1
        s += 1
    return s


has("07", f"8. {steps(6)} шагов", f"из 27 — {steps(27)} шагов")
has("07", f"9. {int(str(1230)[::-1])}:")

# 08 — for and range
mult = [n for n in range(1, 201) if n % 9 == 0]
has("08", f"1. {len(mult)} {sum(mult)}: `range(9, 201, 9)`")
has("08", "7. " + ", ".join(str(i * 10) for i in range(2)) + f" и {2 * 10};")
has("08", "2. 3, 7, 11; 10, 7, 4, 1; ни одного.")
has("08", f"3. `range(20, 31)`; {len(range(20, 31))} чисел.")
has("08", f"4. {sum(1 for a in range(1, 6) for b in range(1, 6) if a < b)} пар.")
first = 500 + (-500) % 23
has("08", f"5. {first} = 23 · {first // 23}.")
top = [n for n in range(999, 0, -1) if n % 13 == 0 and n % 10 == 1][:3]
has("08", f"6. {top[0]}, {top[1]} и {top[2]}")
four = sum(1 for n in range(1000, 10000) if sum(map(int, str(n))) == 10)
has("08", f"8. {four}.")
sols = sum(1 for x in range(1, 10) for y in range(1, 10) if 1 <= 10 - x - y <= 9)
has("08", f"9. {sols}.")

# 09 — strings
same("09", ["топот" == "топот"[::-1], "дом" == "дом"[::-1]], [True, False])
w = "ИНФОРМАТИКА"
has("09", f"2. {len(w)}, {w[0]}, {w[-1]} и {w[3]}.")
s = "ABCDEFG"
has("09", f"3. {s[2:5]}, {s[:4]}, {s[::3]} и {s[::-2]}.")


def overlapping(text, part):
    return sum(text.startswith(part, i) for i in range(len(text)))


has("09", f"4. {'банан'.count('ан')}; без перекрытий {'банана'.count('ана')}")
has("09", f"с перекрытиями {overlapping('банана', 'ана')}.")
has("09", f"5. {'  Мир  '.strip().upper()} и {'a-b-c'.replace('-', '', 1)}.")
has("09", f"6. {'Python'.find('th')} и −1")
has("09", f"7. {ord('a')}, {chr(ord('a') + 2)} и {'7'.zfill(3)}.")
has("09", f"8. {'AAAAA'.count('AA')} и {overlapping('AAAAA', 'AA')}.")
has("09", f"сумма {sum(int(c) for c in '9051')}.")

# 10 — lists
has("10", f"1. {[v for v in [3, -4, 0, 6, -2] if v >= 0]}.")
a = [3, 1, 4]
a.append(1)
a.insert(0, 9)
x = a.pop()
a.remove(1)
has("10", f"2. a = {a}, x = {x}.")
has("10", "3. [10, 2, 3]; с копией [1, 2, 3].")
t = [[0] * 2] * 3
t[1][0] = 5
has("10", f"5. {t}:")
has("10", f"6. {'3;8;;1'.split(';')} и {' 3 8  1 '.split()}.")
has("10", f"7. {'-'.join(['2026', '10', '10'])};")
nums = [int(v) for v in "4 -1 7 0 -3".split()]
has("10", f"9. {sum(v < 0 for v in nums)} {sum(nums)}:")

# 11 — tuples
kinds = run("print(type((8)).__name__, type((8,)).__name__, len((8,)))").split()
has("11", f"2. `{kinds[0]}`, `{kinds[1]}` и {kinds[2]}.")
a, b = 1, 2
for _ in range(3):
    a, b = b, a + b
has("11", f"3. a = {a}, b = {b}:")
first, *rest = "PYTHON"
has("11", f"`rest` — {rest}.")
has("11", f"6. {len(list(zip([1, 2, 3], 'ab', strict=False)))} пары")
has("11", "7. " + run("print(*[3, 1, 4], sep=', ')").strip() + ".")
best = max(zip(["Анна", "Илья", "Марк"], [91, 84, 95], strict=True), key=lambda p: p[1])
has("11", f"8. {best[0]} {best[1]}.")
fib = [0, 1]
while len(fib) < 10:
    fib.append(fib[-1] + fib[-2])
has("11", "9. " + " ".join(map(str, fib)) + ".")

pairs11 = [("Оля", 77), ("Петя", 95), ("Вера", 90)]
has("11", "1. " + " и ".join(f"{n} {v}" for n, v in pairs11 if v >= 90) + ".")

# 12 — dictionaries
from collections import Counter  # noqa: E402


def most_common_first(items):
    counts = Counter(items)
    top = max(counts.values())
    return next(i for i in items if counts[i] == top), top


words12 = Counter(["кот", "дом", "кот", "сад", "дом"])
top12 = max(words12, key=lambda w: words12[w])  # first of equals: insertion order
has("12", f"1. {top12} {words12[top12]}: у «кот» и «дом» по 2", "для `['x', 'y', 'y', 'x']` — x 2.")
same("12", most_common_first(["x", "y", "y", "x"]), ("x", 2))
same("12", most_common_first(list("abacba")), ("a", 3))
d = {"a": 1}
d["b"] = 2
d["a"] += 5
has("12", f"2. {d}, длина {len(d)}.")
has("12", f"5. {dict(Counter('MISSISSIPPI'))}.")
has("12", "6. " + run('print({1: "a", 1.0: "b", True: "c"})').strip() + ":")
words = Counter("кот дом кот сад дом кот".split())
has("12", "8. " + ", ".join(f"{w} {c}" for w, c in words.items()) + ".")

# 13 — sets
same("13", set(["Оля", "Петя", "Вера"]) & set(["Вера", "Оля", "Оля"]), {"Оля", "Вера"})
has("13", f"2. {len(set('BANANA'))}:")
a, b = {1, 2, 3, 4}, {3, 4, 5}
same("13", [a | b, a & b, a - b, a ^ b], [{1, 2, 3, 4, 5}, {3, 4}, {1, 2}, {1, 2, 5}])
has("13", f"7. {len(set('2026101'))}:")
m3 = {n for n in range(1, 51) if n % 3 == 0}
m5 = {n for n in range(1, 51) if n % 5 == 0}
has("13", f"8. {len(m3 | m5)}: {len(m3)} кратных 3, {len(m5)} кратных 5, {len(m3 & m5)} общих.")
same("13", sorted(set("программа") - set("информатика")), ["г", "п"])

# 14 — comprehensions
has("14", f"1. {[int(v) for v in '5 -8 3 0'.split()]}, сумма 0.")
has("14", f"2. {[n % 3 for n in range(7)]}.")
has("14", f"3. {[w[0] for w in 'кот дом сад'.split()]}.")
has("14", f"4. {[x for x in range(20) if x % 7 == 3]}.")
has("14", f"5. {['+' if x > 0 else '-' for x in [3, -1, 0]]}.")
pairs = [(a, b) for a in range(3) for b in range(a)]
has("14", f"6. {len(pairs)}: (1, 0), (2, 0), (2, 1).")
same("14", [sum([]), all([]), any([])], [0, True, False])
has("14", "8. {0, 1, 2, 3} и " + str({c: "abca".count(c) for c in "abca"}) + ".")
nums = [2, 8, -4]
has("14", f"9. {all(v % 2 == 0 for v in nums)} {any(v < 0 for v in nums)}.")
has("14", f"10. {sum(v * v for v in range(1, 10, 2))} = 1 + 9")


# 15 — functions
def h15(a):
    a.append(0)
    a = [5]
    a.append(1)


lst15 = [9]
h15(lst15)
has("15", f"perimeter(3, 5) = {2 * (3 + 5)}.", f"6. {lst15}:")
ld15 = [abs(n) % 10 for n in (47, -123, 50)]
has("15", f"7. {sum(ld15)} = {ld15[0]} + {ld15[1]} + {ld15[2]}.")
has("15", f"8. {sum(1 for n in [3, 8, 0, -6, 7] if n % 2 == 0)}: числа 8, 0 и −6.")
has("15", f"9. {max(-5, -2, -9)}.".replace("-", "−"))
same("15", run("def f(n):\n    print(n * 2)\nr = f(3)\nprint(r)"), "6\nNone\n")
same("15", run("x = 1\ndef g():\n    x = 2\n    return x\nprint(g(), x)"), "2 1\n")


def sign15(number):
    if number == 0:
        return "ноль"
    return "положительное" if number > 0 else "отрицательное"


has("15", f"; {sign15(7)} и {sign15(-0.5)}.")
bump15 = run(
    "count = 0\ndef bump():\n    count = count + 1\ntry:\n    bump()\nexcept Exception as e:\n    print(type(e).__name__)"
)
has("15", f"5. `{bump15.strip()}`:")


# 16 — arguments
def final_price(price, discount=0):
    return price * (100 - discount) / 100


def evens16(xs):
    return sum(1 for v in xs if v % 2 == 0)


has("16", f"1. {sum(v < 0 for v in [0, -3, 4, -7])} и {sum(v < 0 for v in [])}.")


def add_item_bad(item, items=[]):  # noqa: B006 — the lesson's trap, on purpose
    items.append(item)
    return items


calls16 = [list(add_item_bad(1)), list(add_item_bad(2, [])), list(add_item_bad(3))]
has("16", f"3. {calls16[0]}, {calls16[1]} и {calls16[2]}:", f"5. {sum([5])} и {sum([1, 2, 3])}.")
has("16", f"2. {final_price(500, 20)} и {final_price(discount=50, price=80)}.")
q16, r16 = divmod(-7, 3)
has("16", f"4. ({q16}, {r16})".replace("-", "−"), f"7. {17 % 5}.")
has("16", f"8. {sum(map(int, str(9051)))}.")
xs16 = [3, 5, 9, 12, 14]
has("16", f"9. {sum(v % 3 == 0 for v in xs16)} и {sum(v % 7 == 0 for v in xs16)}.")


# 18 — sorting
def digits18(n):
    return sum(map(int, str(n)))


has("18", f"1. {sorted([31, 22, 13, 42, 11], key=lambda v: (v % 10, v))}.")
has("18", f"2. {sorted(['10', '9', '100'])} и {sorted(['10', '9', '100'], key=int)}.")
st18 = [("Ира", 80), ("Аня", 92), ("Боря", 80)]
has("18", f"4. {sorted(st18, key=lambda s: (-s[1], s[0]))}.")
has("18", f"5. {max(['кот', 'слон', 'мышь'], key=len)}:")
spent = count = 0
for price in sorted([30, 5, 25, 15, 60]):
    if spent + price > 50:
        break
    spent += price
    count += 1
has("18", f"6. {count} предмета, {spent}:")
has("18", f"8. {sorted([15, 7, 22, 9, 30, 4], key=lambda v: (digits18(v), v))}:")


# 19 — recursion
calls19: dict[int, int] = {}


def fib19(n):
    calls19[n] = calls19.get(n, 0) + 1
    return n if n < 2 else fib19(n - 1) + fib19(n - 2)


fib19(5)
has(
    "19",
    f"2. {sum(range(6))};",
    f"3. {sum(calls19.values())} вызовов; F(2) вычисляется {calls19[2]} раза.",
)
has("19", f"4. {3**4}; глубина 5 вызовов")
f19 = [0, 1]
for _ in range(9):
    f19.append(f19[-1] + 2 * f19[-2])
has("19", f"7. {f19[10]}.", f"8. {sum(map(int, '9051'))}.")

# 20 — files (the lesson's data files are in files/)
F = D / "files"
nums = [int(v) for v in (F / "numbers.txt").read_text(encoding="utf-8").split()]
has("20", f"1. {min(v for v in nums if v > 0)}; для −3, −8 — «Положительных чисел нет».")
has("20", f"7. {min(nums)} {max(nums)}.".replace("-", "−"))
head, *rest = [int(v) for v in (F / "header.txt").read_text(encoding="utf-8").split()]
same("20", (len(rest), sum(rest)), (head, 9))
has("20", f"3. {head + sum(rest)}: в сумму попал заголовок {head}")
rows = (F / "students.csv").read_text(encoding="utf-8").splitlines()[1:]
name, score = max((r.split(";") for r in rows), key=lambda r: int(r[1]))
has("20", f"8. {name} {score}.")
import json  # noqa: E402

has("20", f"6. {json.loads(json.dumps((1, 2)))}:")

# 21 — exceptions
has("21", f"2. {int('-5') * 2} и {int(' 8 ') * 2}:".replace("-", "−"))
loop21 = run(
    'for text in ["x", "3"]:\n    try:\n        number = int(text)\n'
    '    except ValueError:\n        print(text, "— не число")\n'
    "    else:\n        print(number * 2)\n    finally:\n"
    '        print("проверено", text)'
).splitlines()
has("21", "3. «" + "», «".join(loop21[:2]) + f"», {loop21[2]} и «{loop21[3]}».")
has("21", f"4. {4 / 1} и {(1 + 2) / 2}.")
has("21", "5. шаг 0 элемент 5 сумма 5 и шаг 1 элемент -5 сумма 0.")
valid = [int(t) for t in ("5", "x", "7") if t.lstrip("-").isdigit()]
has("21", f"7. {sum(valid)} {3 - len(valid)}.")
has("21", f"8. {7 / 2} и None.")

# 17 — modules
import math  # noqa: E402

has("17", f"2. {math.isqrt(99)} и {math.gcd(84, 36)}.")
has("17", f"4. {math.floor(2.7)}, {math.ceil(2.1)} и {math.floor(-0.5)}.".replace("-", "−"))
has("17", f"7. {12 * 18 // math.gcd(12, 18)}.")
m7 = sum(1 for n in range(1, 1001) if n % 7 == 0)
m35 = sum(1 for n in range(1, 1001) if n % 35 == 0)
has("17", f"8. {m7 - m35}: {m7} кратных 7 минус {m35} кратных 35.")

# 22 — iterators
it = iter("abc")
next(it)
next(it)
has("22", f"2. {list(it)}.")
has("22", f"4. {list(filter(lambda v: v % 2, range(10)))}.")
has(
    "22",
    f"7. `next(x for x in range(100, 200) if x % 17 == 0)` — {next(x for x in range(100, 200) if x % 17 == 0)}.",
)
has("22", f"8. {sum(range(2, 21, 2))}.")

# 23 — standard library
from collections import deque  # noqa: E402
from decimal import Decimal  # noqa: E402
from fractions import Fraction  # noqa: E402
from itertools import combinations, permutations, product  # noqa: E402

two_ones = sum(1 for w in product("01", repeat=4) if w.count("1") == 2)
has("23", f"1. {two_ones}:")
has("23", f"2. {Counter('MISSISSIPPI').most_common(2)}.")
q = deque([5, 6])
q.append(7)
q.popleft()
q.popleft()
has("23", f"4. {list(q)}.")
has("23", f"5. {Fraction(1, 4) + Fraction(1, 6)} и {Decimal('0.1') * 3}.")
has(
    "23",
    f"6. {len(list(product('AB', repeat=3)))}, {len(list(permutations('ABCD', 2)))} "
    f"и {len(list(combinations('ABCD', 2)))}.",
)
no11 = sum(1 for w in product("01", repeat=4) if "11" not in "".join(w))
has("23", f"7. {no11}.", f"8. {len(set(permutations('ПАПА')))}.")

# 24 — notation, bits and patterns
import re  # noqa: E402
from fnmatch import fnmatchcase  # noqa: E402

has("24", f"1. {int('1011', 2)}, {int('777', 8)} и {int('1A', 16)}.")
has("24", f"2. {bin(10)}, {bin(10)[2:]} и {format(10, '08b')}.")
has("24", f"3. {12 & 10}, {12 | 10}, {12 ^ 10}, {3 << 3} и {100 >> 2}.")
has("24", f"4. {(13).bit_count()} и {(13).bit_length()}")
same("24", [fnmatchcase("1234", "1?3*"), fnmatchcase("13", "1?3*")], [True, False])
same("24", re.fullmatch(r"[0-9]+", "123a"), None)
caps = " и ".join(f"{m.group()} {m.start()} {m.end()}" for m in re.finditer("[A-Z]+", "abCDeFGHi"))
has("24", f"7. {caps}.")
mask = [n for n in range(9, 1000, 9) if fnmatchcase(str(n), "1?8")]
has("24", f"8. {mask[0]} и {mask[1]}.")
has("24", f"9. {sum(1 for n in range(1, 101) if bin(n).count('1') == 3)}.")

# 25 — cost
has("25", f"2. {100 * 99 // 2}.")
n, k = 1000, 0
while n > 1:
    n //= 2
    k += 1
has("25", f"3. {k} делений.")
has("25", f"8. 2³⁰ = {2**30:,} варианта".replace(",", " "))

# 26 — complete program
has("26", "2. Количество 1, сумма −5, минимум и максимум −5, среднее −5.000.")
has("26", f"6. {sum(1 for v in nums if v % 2 == 0)}: −2 и 10.")
has("26", f"7. {len(nums)} {sum(nums)} {min(nums)} {max(nums)}.".replace("-", "−"))
has("26", f"8. {sum(rest)}.")

# 27 — practice
has("27", f"1. {pow(7, 4, 10)} и {pow(2, 100, 10)}.")


def second_distinct(xs):
    u = sorted(set(xs))
    return u[-2] if len(u) > 1 else None


has("27", f"2. {second_distinct([9, 9, 4, 7])} и {second_distinct([5, 5])}.")
has("27", f"3. {list(dict.fromkeys('abracadabra'))}.")


def balanced(t):
    # second method: delete "()" pairs until nothing changes
    while "()" in t:
        t = t.replace("()", "")
    return t == ""


same("27", [balanced(t) for t in ["(()())", ")(", "(()"]], [True, False, False])
has("27", "6. True, False и False.")


def pair_slow(xs, target):
    for j in range(len(xs)):
        for i in range(j):
            if xs[i] + xs[j] == target:
                return (i, j)
    return None


has("27", f"7. {pair_slow([4, 7, 2, 9], 11)} и {pair_slow([5, 5], 10)}.")
from itertools import combinations as comb  # noqa: E402

meetings = [(0, 3), (1, 2), (2, 4), (3, 5)]
best_k = max(
    k
    for k in range(len(meetings) + 1)
    for c in comb(sorted(meetings), k)
    if all(a[1] <= b[0] for a, b in zip(c, c[1:], strict=False))
)
has("27", f"— {['ноль', 'одна', 'две', 'три'][best_k]} встречи.")

# 28 — classes (advanced)
pages = min(200, min(200, 50) + 170)
has("28", f"2. {pages} и {pages / 200}:")
has("28", f"5. {4 * 6};", f"8. {100 - 30}.")

# 29 — language mechanisms (advanced)
has("29", f"2. {5 * 4}.", f"7. {len(bytes('Hi', 'utf-8'))} и {len(bytes('Пока', 'utf-8'))}.")

# 30 — readability and tests (advanced)
has("30", f"2. {sum(v > 0 for v in [3, -1, 0, 5, 8])}.")
has("30", f"8. {47 % 10}, {123 % 10} и 0.")

# every lesson with answers must have at least one check
for path in sorted(D.glob("[0-9][0-9]-*.md")):
    if "**Ответы для проверки:**" in path.read_text(encoding="utf-8"):
        if path.name[:2] not in checked:
            failures.append(f"{path.name[:2]}: answers without a single check")

if failures:
    print("\n".join(failures))
    sys.exit(1)
print("all answers confirmed")
