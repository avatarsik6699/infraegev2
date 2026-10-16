"""Independent recomputation of every task answer in topic 13.

Usage: python3 -I content/lesson-design/topic-13/checks.py

The lessons count programs with a table of sums. Here every answer is recounted
by brute force instead: all programs are enumerated as sequences of commands
(depth-first, cut only where the lesson proves it safe), the trajectory of each
is checked against the mandatory and forbidden numbers, and the programs are
counted one by one. The executor shares no code with executor_figures.py.
Every expected answer must appear verbatim in the answers of its page.
Exit code 1 if any check fails.
"""

import re
import sys
from itertools import product
from pathlib import Path

D = Path(__file__).resolve().parent
sys.setrecursionlimit(10_000)

checks: list[tuple[str, str, bool]] = []


def answers(f: str) -> str:
    text = (D / f).read_text(encoding="utf-8")
    tail = text.split("**Ответы для проверки:**", 1)[1]
    return re.split(r"\n\n(?:\*\*Что дальше|<details)", tail)[0]


def expect(f: str, needle: str) -> None:
    checks.append((f, needle, needle in answers(f)))


def same(label: str, a: object, b: object) -> None:
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def cmd(name: str):
    """A command as a function x -> result or None."""
    if name == "swap":
        return lambda x: x + 9 * (x % 10 - x // 10 % 10) if x // 10 % 10 < x % 10 else None
    if name == "sq":
        return lambda x: x * x
    if name == "2x+1":
        return lambda x: 2 * x + 1
    if name == "3x+2":
        return lambda x: 3 * x + 2
    if name == "d4":
        return lambda x: 10 * x + 4
    if name == "/2":
        return lambda x: x // 2 if x % 2 == 0 else None
    if name == "//2":
        return lambda x: x // 2
    if name == "//3":
        return lambda x: x // 3
    if name == "ceil2":
        return lambda x: (x + 1) // 2
    if name == "branch":
        return lambda x: x // 2 if x % 2 == 0 else x - 3
    k = int(name[1:])
    return {"+": lambda x: x + k, "-": lambda x: x - k, "*": lambda x: x * k}[name[0]]


def trajectories(start: int, target: int, names: list[str]):
    """Every program as its trajectory (numbers after each command)."""
    fs = [cmd(n) for n in names]
    up = target >= start

    def go(x, path):
        if x == target:
            yield path
            return
        if (x > target) if up else (x < target):
            return
        for f in fs:
            y = f(x)
            if y is None or y == x:
                continue
            yield from go(y, path + (y,))

    yield from go(start, ())


def count(start, target, names, must=(), forbid=(), test=None) -> int:
    n = 0
    for t in trajectories(start, target, names):
        s = set(t)
        if all(m in s for m in must) and not any(q in s for q in forbid):
            if test is None or test(s):
                n += 1
    return n


P = ["+1", "*2"]

# --- subtopic 1 --------------------------------------------------------------------
F1 = "01-komandy-i-derevo.md"
same("1.1", (3 + 1) * 2 + 1, 9)
expect(F1, "1. 9")
same("1.2", count(3, 9, P), 3)
expect(F1, "2. 3")
same("1.3", count(3, 10, P), 4)
expect(F1, "3. 4")
same("1.4", count(2, 6, ["+1", "+2"]), 5)
expect(F1, "4. 5 программ")
same("1.7", count(1, 9, ["+1", "*3"]), 5)
expect(F1, "7. 5")
same("1 main", count(2, 6, P), 3)
same("1 four", count(1, 4, P), 4)

# --- subtopic 2 --------------------------------------------------------------------
F2 = "02-tablica-kolichestv.md"
same("2 main", count(2, 12, P), 10)
same("2 three", count(1, 10, ["+1", "+2", "*2"]), 154)
same("2 parity", (count(1, 15, ["+2", "*3"]), count(2, 13, ["+2", "*3"])), (6, 0))
same("2.1", count(2, 8, P), 5)
expect(F2, "1. 5")
same("2.2", count(1, 9, ["+1", "+2", "*2"]), 87)
expect(F2, "2. 87")
expect(F2, "3. Из 1 в 15 — 6; из 2 в 13 — 0")
same("2.4", count(1, 16, P), 36)
expect(F2, "4. 36")
same("2.5", count(3, 25, ["+1", "*3"]), 7)
expect(F2, "5. 7")
same("2.6", count(3, 20, P), 18)
expect(F2, "6. 18")
same("2.7", count(2, 14, ["+1", "+2", "*3"]), 279)
expect(F2, "7. 279")

# --- subtopic 3 --------------------------------------------------------------------
F3 = "03-etapy-i-zaprety.md"
same("3 main", (count(2, 12, P, must=(6,)), count(2, 12, P, forbid=(6,))), (6, 4))
same("3 both", count(2, 20, P, must=(6,), forbid=(9,)), 9)
same("3 two", count(2, 12, P, must=(4, 8)), 4)
same("3.1", count(2, 12, P, must=(5,)), 6)
expect(F3, "1. 6")
same("3.2", count(2, 12, P, forbid=(5,)), 4)
expect(F3, "2. 4")
same("3.3", count(2, 16, P, must=(6,), forbid=(9,)), 9)
expect(F3, "3. 9")
same("3.4", count(2, 16, P, must=(4, 8)), 8)
expect(F3, "4. 8")
same("3.5", count(2, 20, P, forbid=(7, 17)), 6)
same("3 digit all", count(2, 20, P), 30)
expect(F3, "5. 6")
same("3.6", count(1, 20, P, must=(10,), forbid=(15,)), 14)
expect(F3, "6. 14")
same("3.7", count(3, 30, P, must=(12,), forbid=(20,)), 24)
expect(F3, "7. 24")

# --- subtopic 4 --------------------------------------------------------------------
F4 = "04-smysl-novoj-komandy.md"
same("4 main", count(10, 24, ["+1", "swap"]), 2)
same("4.1", count(1, 13, ["+1", "2x+1"], forbid=(8,)), 8)
expect(F4, "1. 8")
same("4.2", count(1, 40, ["+1", "d4"]), 4)
expect(F4, "2. 4")
same("4.3", count(2, 20, ["+1", "sq"]), 5)
expect(F4, "3. 5")
same("4.4", count(1, 30, ["+1", "3x+2"]), 17)
expect(F4, "4. 17")
same("4.5", count(12, 45, ["+1", "swap"]), 13)
expect(F4, "5. 13")
same("4.6", count(15, 60, ["+1", "swap"]), 14)
expect(F4, "6. 14")
same("4.7", count(101, 135, ["+1", "swap"]), 13)
expect(F4, "7. 13")

# --- subtopic 5 --------------------------------------------------------------------
F5 = "05-ubyvanie-i-delenie.md"
same("5.1", count(12, 2, ["-1", "/2"]), 10)
expect(F5, "1. 10")
same("5.2", count(12, 2, ["-1", "//2"]), 19)
expect(F5, "2. 19")
same("5.3", count(12, 2, ["-1", "ceil2"]), 37)
expect(F5, "3. 37")
same("5 branch", count(12, 3, ["-1", "branch"]), 13)
same("5.4", count(16, 2, ["-1", "branch"]), 83)
expect(F5, "4. 83")
same("5.5", count(25, 4, ["-2", "//2"]), 11)
expect(F5, "5. 11")
same(
    "5.6",
    (
        count(20, 10, ["-1", "//2"]),
        count(10, 3, ["-1", "//2"]),
        count(20, 3, ["-1", "//2"], must=(10,)),
    ),
    (2, 6, 12),
)
expect(F5, "6. 12")
same("5.7", count(40, 5, ["-1", "//3"]), 27)
expect(F5, "7. 27")

# --- subtopic 6 --------------------------------------------------------------------
F6 = "06-vychislenie-i-proverka.md"
same("6.2", count(2, 8, P), 5)
expect(F6, "2. 5")
wrong_order = sum(1 for _ in trajectories(2, 6, P))
same("6.3", wrong_order, 3)
expect(F6, "3. 3")
expect(F6, "4. 1")
same("6.5", count(1, 10, ["+1", "+2", "*2"]), 154)
expect(F6, "5. 154")
same("6.6", count(12, 2, ["-1", "//2"]), 19)
expect(F6, "6. 19")
same("6.7", count(2, 40, P, must=(10,), forbid=(25,)), 63)
expect(F6, "7. 63")

# --- subtopic 7 --------------------------------------------------------------------
F7 = "07-gruppy-programm.md"
both = lambda s: 3 in s and 4 in s  # noqa: E731
same(
    "7.1",
    [
        count(2, 6, P, test=both),
        count(2, 6, P, test=lambda s: 3 in s or 4 in s),
        count(2, 6, P, test=lambda s: (3 in s) != (4 in s)),
    ],
    [1, 3, 2],
)
expect(F7, "1. Через оба числа — 1")
same("7.2", count(2, 11, ["+1", "+3"]), 19)
expect(F7, "2. 19")
targets = [n for n in range(2, 22) if count(2, n, P) == 18]
same("7.3", targets, [16, 17])
expect(F7, "3. Все цели: 16 и 17")
same(
    "7.4",
    [
        count(2, 12, P, test=lambda s: 4 in s or 8 in s),
        count(2, 12, P, test=lambda s: (4 in s) != (8 in s)),
        count(2, 12, P, test=lambda s: not (4 in s and 8 in s)),
    ],
    [9, 5, 6],
)
expect(F7, "4. 9, 5 и 6")
same("7.5", count(2, 20, P, forbid=(15,), test=lambda s: 6 in s or 8 in s), 15)
expect(F7, "5. 15")
same("7.6", count(1, 15, ["+1", "+3"]), 129)
expect(F7, "6. 129")
same("7.7", [n for n in range(1, 26) if count(1, n, P) == 20], [12, 13])
expect(F7, "7. 12 и 13")

# --- subtopic 8 --------------------------------------------------------------------
F8 = "08-dlina-i-pamyat.md"


def by_length(start, target, length):
    return [p for p in product("12", repeat=length) if run(start, p) == target]


def run(x, p):
    for c in p:
        x = x + 1 if c == "1" else x * 2
    return x


same("8.1", sorted("".join(p) for p in by_length(2, 12, 5)), ["11112", "21211"])
expect(F8, "1. Две программы: 11112 и 21211")
same("8.3", ["".join(p) for p in by_length(2, 12, 4)], ["2112"])
expect(F8, "3. 1")


def no_double(start, target):
    n = 0
    for t in range(1, target - start + 1):
        for p in product("12", repeat=t):
            if "22" not in "".join(p):
                x, ok = start, True
                for c in p:
                    x = x + 1 if c == "1" else x * 2
                    if x > target:
                        ok = False
                        break
                if ok and x == target:
                    n += 1
    return n


same("8 nodouble", no_double(2, 20), 22)
same("8.4", no_double(1, 16), 23)
expect(F8, "4. 23")
reach = {2}
cur = {2}
for _ in range(5):
    cur = {y for x in cur for y in (x + 1, x * 2)}
    reach |= cur
same("8.5", (len(reach), min(n for n in range(2, 200) if n not in reach)), (32, 23))
expect(F8, "5. 32 числа; наименьшее недостижимое — 23")
withsix = [p for p in by_length(2, 12, 5) if 6 in {run(2, p[:i]) for i in range(1, 6)}]
same("8.6", len(withsix), 1)
expect(F8, "6. 1")
pos = sum(
    1
    for p in product((3, -2), repeat=5)
    if all(1 + sum(p[: i + 1]) > 0 for i in range(5)) and 1 + sum(p) == 6
)
same("8 updown", pos, 5)

# --- final page ----------------------------------------------------------------------
F9 = "09-praktika-i-itog.md"
same("9.1", count(3, 27, P), 34)
expect(F9, "1. 34")
same("9.2", count(2, 15, ["+1", "+2", "*2"], must=(8,), forbid=(11,)), 138)
expect(F9, "2. 138")
same("9.3", count(13, 70, ["+1", "swap"]), 55)
expect(F9, "3. 55")
same("9.4", count(30, 3, ["-1", "//2"], must=(12,)), 72)
expect(F9, "4. 72")
same("9.5", (count(1, 29, ["+2", "*3"], forbid=(9,)), count(1, 29, ["+2", "*3"])), (4, 12))
expect(F9, "5. 4")

for f in sorted(D.glob("0*.md")):
    nums = re.findall(r"^(\d+)\. ", answers(f.name), re.M)
    if nums != [str(i) for i in range(1, len(nums) + 1)]:
        checks.append((f.name, f"answers numbered 1…n: {nums}", False))

bad = [c for c in checks if not c[2]]
for f, needle, ok in checks:
    print("PASS" if ok else "FAIL", f, needle)
print(f"{len(checks) - len(bad)} of {len(checks)} checks pass")
sys.exit(1 if bad else 0)
