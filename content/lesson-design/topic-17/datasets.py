"""Generate the data files of topic 17 and print the answers of their tasks.

Usage: python3 -I content/lesson-design/topic-17/datasets.py [--write]

Every exam-format task of the topic works on our own file, one integer per
line, as on the exam. Files are generated from fixed seeds, so they never
change; without --write the script only prints the answers. Textbook files
hold the small sequences of the worked examples (the programs of the lesson
open them, verify_code.py runs them in files/).

Numbers of a generated file get a random length first (1 to 4 or 5 digits)
and then a random value of that length, so that conditions on the number of
digits matter. A file is accepted only if the tasks on it are robust: every
answer counts more than one group, and the typical errors named in TRAPS give
a different answer. checks.py recomputes every answer by another method.
"""

import random
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
FILES = HERE / "files"

TEXTBOOK = {
    "17.txt": [8, -12, 5, 20, -3, 14],
    "17-sem.txt": [-47, 8, 17, -7, 4, 27, 10],
    "17-troyki.txt": [1017, 2000, 6, 3001, 4001, 8, 123],
    "17-srednee.txt": [2, 9, 4, 7, 12],
}

# name: (first seed, how many numbers, longest length, signed, length weights)
SPECS = {
    "17-1.txt": (101, 1000, 4, True, (1, 2, 3, 3)),
    "17-2.txt": (201, 1000, 5, False, (1, 1, 2, 3, 2)),
    "17-3.txt": (301, 1000, 5, True, (1, 2, 3, 3, 2)),
    "17-4.txt": (401, 1000, 5, False, (0, 1, 2, 3, 2)),
    "17-6.txt": (601, 600, 4, False, (1, 1, 2, 3)),
}


def number(rnd: random.Random, longest: int, signed: bool, weights) -> int:
    length = rnd.choices(range(1, longest + 1), weights)[0]
    low = 0 if length == 1 and signed else (10 ** (length - 1) if length > 1 else 1)
    x = rnd.randint(low, 10**length - 1)
    return -x if signed and rnd.random() < 0.5 else x


def make(name: str, seed: int) -> list[int]:
    _, n, longest, signed, weights = SPECS[name]
    rnd = random.Random(seed)
    return [number(rnd, longest, signed, weights) for _ in range(n)]


def make_triangles(seed: int) -> list[int]:
    """Small sides with some right triples planted, so both kinds occur."""
    rnd = random.Random(seed)
    a = [rnd.randint(1, 40) for _ in range(600)]
    for _ in range(6):
        p = rnd.randrange(0, 590)
        m = rnd.randint(1, 8)
        tri = rnd.choice([(3, 4, 5), (5, 12, 13), (8, 15, 17)])
        a[p : p + 3] = rnd.sample([m * t for t in tri], 3)
    return a


# --- helpers in the lesson's terms ------------------------------------------------


def pairs(a):
    return [(a[i], a[i + 1]) for i in range(len(a) - 1)]


def groups(a, k):
    return [a[i : i + k] for i in range(len(a) - k + 1)]


def digits(x):
    return len(str(abs(x)))


def answer(values, best="max"):
    """«количество, затем лучшее значение» — 0 0 when nothing fits."""
    if not values:
        return (0, 0)
    return (len(values), max(values) if best == "max" else min(values))


# --- tasks: label -> (file, function of the list) ----------------------------------


def s1_t8(a):
    return (sum(x % 9 == 0 for x in a), sum(x > 0 and x % 9 == 0 for x in a))


def s1_t9(a):
    return (
        sum(x % 4 == 0 and x % 8 != 0 for x in a),
        sum(-100 <= x <= 100 for x in a),
    )


def s2_t8(a):
    one = sum(int(x % 4 == 0) + int(x % 6 == 0) == 1 for x in a)
    any_ = sum(x % 4 == 0 or x % 6 == 0 for x in a)
    return (one, any_)


def s2_t9(a):
    return (sum(int(x % 2 == 0) + int(x % 3 == 0) + int(x % 5 == 0) >= 2 for x in a),)


def s3_t8(a):
    sel = [x for x in a if digits(x) == 3 and abs(x) % 10 == 7]
    return (len(sel), sum(x < 0 for x in sel))


def s3_t9(a):
    return (sum(abs(x) >= 10 and abs(x) % 10 == abs(x) // 10 % 10 for x in a),)


def s4_t8(a):
    return answer([x + y for x, y in pairs(a) if x < 0 and y < 0 and (x + y) % 5 == 0])


def s4_t9(a):
    return answer(
        [sum(g) for g in groups(a, 3) if sum(digits(x) == 3 for x in g) == 2 and sum(g) % 4 == 0],
        "min",
    )


def s5_t7(a):
    t = max(x for x in a if x % 100 == 21)
    return answer(
        [
            sum(g)
            for g in groups(a, 3)
            if sum(digits(x) == 4 for x in g) == 2 and any(x % 7 == 0 for x in g) and sum(g) > t
        ]
    )


def s5_t8(a):
    c = sum(x % 25 == 0 for x in a)
    return answer([x + y for x, y in pairs(a) if (x < 0 or y < 0) and x + y < c])


def s5_t9(a):
    odd = [x for x in a if x % 2 != 0]
    s, k = sum(odd), len(odd)
    return answer(
        [x + y for x, y in pairs(a) if (x % 9 == 0 and y * k < s) or (y % 9 == 0 and x * k < s)]
    )


def s6_t7(a):
    m = min(a)
    return answer([x + y for x, y in pairs(a) if x % 37 == m or y % 37 == m])


def s6_t8(a):
    c = sum(digits(x) == 4 and abs(x) % 100 == 13 for x in a)
    ok = [sum(g) for g in groups(a, 3) if sum(g) - min(g) < c**2]
    return (len(ok), abs(max(ok)))


def s6_t9(a):
    t = max(x for x in a if x < 0 and digits(x) == 3 and x % 7 == 0)
    return answer(
        [x * x + y * y for x, y in pairs(a) if int(x < 0) + int(y < 0) == 1 and x + y > t],
        "min",
    )


def s7_t6(a):
    out = []
    for g in groups(a, 3):
        p, q, r = sorted(g)
        if p > 0 and p + q > r and p * p + q * q > r * r:
            out.append(p + q + r)
    return answer(out)


def s7_t7(a):
    out = []
    for g in groups(a, 3):
        p, q, r = sorted(g)
        if p > 0 and p + q > r and p * p + q * q == r * r:
            out.append(p + q + r)
    return answer(out)


def s8_t7(a):
    n = len(a)
    out = [
        a[i] + a[j]
        for i in range(n)
        for j in range(i + 1, n)
        if (a[i] + a[j]) % 12 == 0 and (a[i] % 5 == 0 or a[j] % 5 == 0)
    ]
    return answer(out)


def s8_t8(a):
    n = len(a)
    out = [a[i] + a[j] for i in range(n) for j in range(i + 1, n) if a[i] * a[j] % 14 == 0]
    return answer(out)


def f_1(a):
    return answer(
        [x + y for x, y in pairs(a) if int(x % 3 == 0) + int(y % 3 == 0) == 1 and (x + y) % 5 == 0]
    )


def f_2(a):
    t = min(x for x in a if x > 0 and x % 100 == 99)
    return answer(
        [sum(g) for g in groups(a, 3) if sum(digits(x) == 3 for x in g) <= 1 and sum(g) >= t],
        "min",
    )


def f_3(a):
    r3, r7 = min(a) % 3, max(a) % 7
    return answer(
        [
            x + y
            for x, y in pairs(a)
            if (x % 3 == r3 or y % 3 == r3) and (x % 7 == r7 or y % 7 == r7)
        ]
    )


def f_4(a):
    t = max(x for x in a if abs(x) % 100 == 77)
    ok = [
        sum(g)
        for g in groups(a, 3)
        if (all(x > 0 for x in g) or all(x < 0 for x in g)) and abs(sum(g)) < t
    ]
    return (len(ok), abs(max(ok)))


def f_5(a):
    even = [x for x in a if x % 2 == 0]
    s, k = sum(even), len(even)
    return answer(
        [
            sum(g)
            for g in groups(a, 4)
            if sum(x % 3 == 0 for x in g) > sum(x % 7 == 0 for x in g) and sum(g) * k > 3 * s
        ]
    )


TASKS = {
    "1.8": ("17-1.txt", s1_t8),
    "1.9": ("17-1.txt", s1_t9),
    "2.8": ("17-1.txt", s2_t8),
    "2.9": ("17-1.txt", s2_t9),
    "3.8": ("17-1.txt", s3_t8),
    "3.9": ("17-1.txt", s3_t9),
    "4.8": ("17-1.txt", s4_t8),
    "4.9": ("17-1.txt", s4_t9),
    "5.7": ("17-2.txt", s5_t7),
    "5.8": ("17-1.txt", s5_t8),
    "5.9": ("17-2.txt", s5_t9),
    "6.7": ("17-2.txt", s6_t7),
    "6.8": ("17-3.txt", s6_t8),
    "6.9": ("17-3.txt", s6_t9),
    "7.6": ("17-5.txt", s7_t6),
    "7.7": ("17-5.txt", s7_t7),
    "8.7": ("17-6.txt", s8_t7),
    "8.8": ("17-6.txt", s8_t8),
    "9.1": ("17-4.txt", f_1),
    "9.2": ("17-3.txt", f_2),
    "9.3": ("17-4.txt", f_3),
    "9.4": ("17-3.txt", f_4),
    "9.5": ("17-4.txt", f_5),
}


# --- typical errors: each must change the answer --------------------------------


def trap_zero_start(a):
    """4.8 with the maximum started at 0: all fitting sums are negative."""
    sums = [x + y for x, y in pairs(a) if x < 0 and y < 0 and (x + y) % 5 == 0]
    return (len(sums), max([0] + sums))


def trap_no_abs(a):
    """3.8 with x % 10 instead of abs(x) % 10."""
    sel = [x for x in a if digits(x) == 3 and x % 10 == 7]
    return (len(sel), sum(x < 0 for x in sel))


def trap_strict(a):
    """9.2 with > instead of >=."""
    t = min(x for x in a if x > 0 and x % 100 == 99)
    return answer(
        [sum(g) for g in groups(a, 3) if sum(digits(x) == 3 for x in g) <= 1 and sum(g) > t],
        "min",
    )


def trap_min_itself(a):
    """9.3 with the minimum itself instead of its remainder."""
    m, r7 = min(a), max(a) % 7
    return answer(
        [x + y for x, y in pairs(a) if (x % 3 == m or y % 3 == m) and (x % 7 == r7 or y % 7 == r7)]
    )


def trap_at_least(a):
    """9.1 with «хотя бы одно» instead of «ровно одно»."""
    return answer([x + y for x, y in pairs(a) if (x % 3 == 0 or y % 3 == 0) and (x + y) % 5 == 0])


def trap_squares_order(a):
    """6.8 with the two largest squares instead of the two largest numbers."""
    c = sum(digits(x) == 4 and abs(x) % 100 == 13 for x in a)
    ok = [sum(g) for g in groups(a, 3) if sum(g) - min(g) < c**2]
    return (len(ok), max(abs(v) for v in ok))


TRAPS = {
    "4.8": trap_zero_start,
    "3.8": trap_no_abs,
    "9.2": trap_strict,
    "9.3": trap_min_itself,
    "9.1": trap_at_least,
    "6.8": trap_squares_order,
}


def robust(name: str, a: list[int]) -> bool:
    for label, (fname, task) in TASKS.items():
        if fname != name:
            continue
        try:
            got = task(a)
        except ValueError:  # no element for a threshold
            return False
        if got[0] < 2:
            return False
        if label in TRAPS and TRAPS[label](a) == got:
            return False
    if name == "17-5.txt":
        return True
    if min(a) >= 37 and name == "17-2.txt":
        return False
    return True


def generate() -> dict[str, list[int]]:
    data = {name: values for name, values in TEXTBOOK.items()}
    for name, (seed, *_rest) in SPECS.items():
        s = seed
        while not robust(name, make(name, s)):
            s += 1
        data[name] = make(name, s)
    s = 501
    while not robust("17-5.txt", make_triangles(s)):
        s += 1
    data["17-5.txt"] = make_triangles(s)
    return data


def main() -> None:
    data = generate()
    for label, (name, task) in TASKS.items():
        print(label, name, " ".join(str(v) for v in task(data[name])))
    if "--write" in sys.argv:
        FILES.mkdir(exist_ok=True)
        for name, values in sorted(data.items()):
            (FILES / name).write_text("".join(f"{x}\n" for x in values), encoding="utf-8")
        print(f"{len(data)} files written to {FILES}")


if __name__ == "__main__":
    main()
