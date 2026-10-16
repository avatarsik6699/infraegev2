"""Independent recomputation of every task answer in topic 12.

Usage: python3 -I content/lesson-design/topic-12/checks.py

The lessons solve by reasoning: one pass as a map of symbols, binary weights,
the kept part and the tail, phases. Here every answer is recomputed by a
separate machine (it shares no code with turing_figures.py) and, for inverse
questions, by brute force over all input strings or all digit counts.
Every expected answer must appear verbatim in the answers of its page.
Exit code 1 if any check fails.
"""

import re
import sys
from itertools import product
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


def machine(rows: dict[str, str], alphabet: str = "λ01") -> dict:
    """{'q0': 'λLq1 - -', …} → {(state, symbol): (write, move, next)}."""
    rules = {}
    for state, cells in rows.items():
        for sym, cell in zip(alphabet, cells.split(), strict=True):
            if cell != "-":
                rules[(state, sym)] = (cell[0], cell[1], cell[2:])
    return rules


def execute(word: str, rules: dict, start: str = "right"):
    """(tape fragment without empty ends, steps, head) or an error text."""
    tape = dict(enumerate(word))
    pos = len(word) if start == "right" else (-1 if start == "left" else int(start))
    state, steps = "q0", 0
    while steps < 100_000:
        key = (state, tape.get(pos, "λ"))
        if key not in rules:
            return f"no command {key}"
        write, move, state = rules[key]
        tape[pos] = write
        steps += 1
        if move == "S":
            used = [i for i, s in tape.items() if s != "λ"]
            text = (
                "".join(tape.get(i, "λ") for i in range(min(used), max(used) + 1)) if used else ""
            )
            return text, steps, pos
        pos += 1 if move == "R" else -1
    return "step limit"


def value(word: str, rules: dict, start: str = "right") -> int:
    return int(execute(word, rules, start)[0], 2)


b = lambda n: format(n, "b")  # noqa: E731

SUB = machine({"q0": "λLq1 - -", "q1": "λSq1 1Lq1 0Sq1"})
LEFT = machine({"q0": "λLq1 - -", "q1": "1Lq2 0Lq1 1Lq1", "q2": "λSq2 - -"})
RIGHT = machine({"q0": "λRq1 - -", "q1": "1Sq1 0Rq1 1Rq1"})
INV = machine({"q0": "λLq1 - -", "q1": "λSq1 1Lq1 0Lq1"})
PLUS = machine({"q0": "λLq1 - -", "q1": "1Sq1 1Sq1 0Lq1"})
TOP = machine({"q0": "λLq1 - -", "q1": "λRq2 0Lq1 1Lq1", "q2": "- - 0Lq3", "q3": "1Sq3 - -"})
BLOCK = machine({"q0": "λRq1 - -", "q1": "1Rq2 0Rq1 1Rq1", "q2": "0Sq2 - -"})
MIRROR = machine({"q0": "λRq1 - -", "q1": "λSq1 1Sq1 0Rq1"})
PHASES = machine({"q0": "λRq1 - -", "q1": "0Lq2 1Rq1 1Rq1", "q2": "0Lq3 - 1Lq2", "q3": "1Sq3 - -"})
BOTH = machine({"q0": "λRq1 - -", "q1": "1Lq2 0Rq1 1Rq1", "q2": "1Sq2 0Lq2 1Lq2"})
BOTH0 = machine({"q0": "λRq1 - -", "q1": "0Lq2 0Rq1 1Rq1", "q2": "1Sq2 0Lq2 1Lq2"})
PARITY = machine({"q0": "0Sq0 0Rq0 1Rq1", "q1": "1Sq1 0Rq1 1Rq0"})
CYCLE = machine({"q0": "λLq1 - - -", "q1": "λSq1 2Lq1 0Lq1 1Lq1"}, "λ012")
CYCLE_UP = machine({"q0": "λLq1 - - -", "q1": "λSq1 1Lq1 2Lq1 0Lq1"}, "λ012")


def zeros_range(
    length: int, k: int, rules: dict, digit: str, start: str = "right", canon: bool = False
):
    vals = [
        w.count(digit)
        for w in ("".join(p) for p in product("01", repeat=length))
        if (not canon or w[0] == "1") and execute(w, rules, start)[0].count(digit) == k
    ]
    return min(vals), max(vals)


# --- subtopic 1 ------------------------------------------------------------------
P1 = "01-lenta-i-komanda.md"
same("1.3", execute("10100", SUB), ("10011", 4, 2))
expect(P1, "3. `10011`, координата 2, четыре такта.")
same("1.5", (execute("1000", SUB)[:2], value("1000", SUB)), (("0111", 5), 7))
expect(P1, "5. `0111`, значение 7, пять тактов")
same("1.6", execute("10100", SUB, "4"), "no command ('q0', '0')")
same("1.7", value(b(37), SUB), 36)
expect(P1, "7. 36")
same("1.8", execute(b(40), SUB)[1], 5)
expect(P1, "8. 5")

# --- subtopic 2 ------------------------------------------------------------------
P2 = "02-prohod-i-kolichestva.md"
same("2 main", execute("111220", CYCLE)[0], "000112")
inv = {"0": "1", "1": "2", "2": "0"}  # result symbol -> source symbol
src = {inv[d]: n for d, n in {"0": 4, "1": 1, "2": 2}.items()}
same("2.1", (src["0"], src["1"], src["2"]), (2, 4, 1))
expect(P2, "1. Два нуля, четыре единицы и одна двойка")
same("2.2", execute("0120", CYCLE)[0], "2012")
expect(P2, "2. `2012`.")
M = {"5": "1", "7": "1", "9": "0"}


def alternating(n: int):
    sums = [
        sum(map(int, w))
        for w in product("579", repeat=n)
        if all(M[w[i]] != M[w[i + 1]] for i in range(n - 1))
    ]
    return min(sums), max(sums)


same("2 main alt9", alternating(9)[0], 61)
same("2.3", alternating(6)[0], 42)
expect(P2, "3. 42.")
same("2.4", sum(1 for w in product("579", repeat=5) if "".join(M[c] for c in w) == "11010"), 8)
expect(P2, "4. 8")
strict = max(f5 * 5 + (6 - f5) * 7 + 27 for f5 in range(7) if f5 > 6 - f5)
same("2 strict", strict, 61)
same("2.5", max(f5 * 5 + (7 - f5) * 7 + 18 for f5 in range(8) if f5 >= 7 - f5), 59)
expect(P2, "5. 59")
twos = max(
    w.count("2")
    for w in product("012", repeat=10)
    if sum(int(execute("".join(w), CYCLE)[0][i]) for i in range(10)) == 12
)
same("2.6", twos, 8)
expect(P2, "6. 8")
same("2.7", alternating(7)[1], 57)
expect(P2, "7. 57")

# --- subtopic 3 ------------------------------------------------------------------
P3 = "03-slovo-i-chislo.md"
same(
    "3 main",
    [value("10101", LEFT), value("10101", RIGHT, "left"), value("10101", INV), value("10101", TOP)],
    [53, 43, 10, 37],
)
same("3 block", value("10101", BLOCK, "left"), 86)
same("3 plus", [execute("1011", PLUS)[:2], execute("111", PLUS)[:2]], [("1100", 4), ("1000", 5)])
same("3.1", value(b(37), RIGHT, "left"), 75)
expect(P3, "1. 75")
same("3.2", execute("101", LEFT)[:2], ("1101", 6))
expect(P3, "2. 1101, число 13, шесть тактов")
same("3.3", execute("1000", INV)[0], "0111")
expect(P3, "3. 0111, четыре символа, один ноль, значение 7.")
same("3.4", execute(b(47), PLUS)[:2], ("110000", 6))
expect(P3, "4. 110000 (48), шесть тактов")
same("3.5", value(b(45), BLOCK, "left"), 182)
expect(P3, "5. 182")
same("3.6", value(b(100), LEFT), 228)
expect(P3, "6. 228")
same("3.7", value(b(50), TOP), 82)
expect(P3, "7. 82")
same("3 demo", (value(b(2025), LEFT), execute(b(2025), LEFT)[1]), (4073, 14))

# --- subtopic 4 ------------------------------------------------------------------
P4 = "04-hvost-i-obratnaya-zadacha.md"
same("4.1", execute("000", SUB)[:2], ("111", 5))
expect(P4, "1. `111`, пять тактов")
same("4.2", zeros_range(12, 5, SUB, "0"), (4, 11))
expect(P4, "2. Минимум 4, максимум 11.")
same("4.3", execute("1000000", SUB)[1], 8)
expect(P4, "3. 8")
same("4.4", zeros_range(10, 1, SUB, "0"), (0, 9))
expect(P4, "4. Наименьшее 0")
same("4.5", zeros_range(7, 0, SUB, "0"), (7, 7))
expect(P4, "5. 7")
same("4.6", zeros_range(12, 5, SUB, "0", canon=True)[1], 10)
expect(P4, "6. 10")
same("4.7-8", zeros_range(10, 4, MIRROR, "1", "left"), (3, 9))
expect(P4, "7. 9")
expect(P4, "8. 3")
same("4 mirror", execute("1101", MIRROR, "left")[:2], ("0011", 4))

# --- subtopic 5 ------------------------------------------------------------------
P5 = "05-sostoyaniya-i-fazy.md"
table = [value("1" * k, PHASES, "left") for k in range(1, 8)]
same("5 table", table, [10, 22, 46, 94, 190, 382, 766])
same("5.1", max(v for v in table if v <= 500), 382)
expect(P5, "1. 382")
same("5.2", execute("10110", PHASES, "left")[1], 14)
expect(P5, "2. 14")
same("5.3", execute("110", PARITY, "0")[0], "1100")
expect(P5, "3. `1100`")
same("5.4", execute("100110", PARITY, "0")[0], "1001101")
expect(P5, "4. `1001101`")
same("5 both", value("10101", BOTH, "left"), 107)
same("5.5", value(b(13), BOTH, "left"), 59)
expect(P5, "5. 59")
same("5.6", value(b(2027), PHASES, "left"), 12286)
expect(P5, "6. 12286")
same("5.7", next(n for n in range(1, 5000) if value(b(n), BOTH, "left") > 1000), 244)
expect(P5, "7. 244")

# --- subtopic 6 ------------------------------------------------------------------
P6 = "06-proverka-resheniya.md"
same("6.4", execute("10100", SUB, "4"), "no command ('q0', '0')")
same("6.6", sum(1 for n in range(1, 301) if value(b(n), INV) != 2 ** len(b(n)) - 1 - n), 0)
expect(P6, "6. 0")
same("6.7", value(b(1000), LEFT), 2024)
expect(P6, "7. 2024")

# --- subtopic 7 ------------------------------------------------------------------
P7 = "07-ogranicheniya-na-summu.md"


def prime(x: int) -> bool:
    return x > 1 and all(x % d for d in range(2, int(x**0.5) + 1))


S369 = machine({"q0": "λLq1 - - -", "q1": "λSq1 7Lq1 8Lq1 3Lq1"}, "λ369")


def counts(limit: int):
    for n in range(1, limit + 1):
        for a in range(n + 1):
            for bb in range(n + 1 - a):
                yield n, a, bb, n - a - bb


S = lambda a, bb, c: 7 * a + 8 * bb + 3 * c  # noqa: E731
same("7 map", execute("39669", S369)[0], "73883")
same(
    "7 min",
    min(S(a, bb, c) + n for n, a, bb, c in counts(20) if min(a, bb, c) >= 1 and a + c >= 5),
    33,
)
same("7 max", max(S(a, bb, c) + n for n, a, bb, c in counts(10) if a + c >= 4), 86)
same(
    "7 prime",
    min(
        n for n, a, bb, c in counts(20) if min(a, bb, c) >= 1 and bb % 2 == 0 and prime(S(a, bb, c))
    ),
    5,
)
same("7.1", (prime(1), prime(2), prime(91)), (False, True, False))
same("7.2", "".join({"7": "3", "8": "6", "3": "9"}[c] for c in "7738"), "3396")
expect(P7, "2. `3396`")
same(
    "7.3",
    min(S(a, bb, c) + n for n, a, bb, c in counts(20) if min(a, bb, c) >= 1 and a + c >= 6),
    37,
)
expect(P7, "3. 37")
same("7.4", max(S(a, bb, c) + n for n, a, bb, c in counts(12) if a + c >= 4), 104)
expect(P7, "4. 104")
same(
    "7.5",
    min(
        n for n, a, bb, c in counts(20) if min(a, bb, c) >= 1 and bb % 2 == 1 and prime(S(a, bb, c))
    ),
    6,
)
expect(P7, "5. 6")
same(
    "7.6",
    max(
        S(a, bb, c)
        for n, a, bb, c in counts(8)
        if n == 8 and min(a, bb, c) >= 1 and prime(S(a, bb, c))
    ),
    53,
)
expect(P7, "6. 53")

# --- final page ------------------------------------------------------------------
P8 = "08-praktika-i-itog.md"
same("8.1", value(b(45), INV), 18)
expect(P8, "1. 18")
same("8.2", execute(b(95), PLUS)[1], 7)
expect(P8, "2. 7")
src2 = [
    w.count("2")
    for w in ("".join(p) for p in product("012", repeat=10))
    if sorted(execute(w, CYCLE_UP)[0]) == sorted("0000011122")
]
same("8.3", set(src2), {5})
expect(P8, "3. 5")
same("8.4", zeros_range(15, 6, SUB, "0")[1], 14)
expect(P8, "4. 14")
same("8.5", value(b(100), BOTH0, "left"), 456)
expect(P8, "5. 456")

for f in sorted(D.glob("0*.md")):
    nums = re.findall(r"^(\d+)\. ", answers(f.name), re.M)
    if nums != [str(i) for i in range(1, len(nums) + 1)]:
        checks.append((f.name, f"answers numbered 1…n: {nums}", False))

bad = [c for c in checks if not c[2]]
for f, needle, ok in checks:
    print("PASS" if ok else "FAIL", f, needle)
print(f"{len(checks) - len(bad)} of {len(checks)} checks pass")
sys.exit(1 if bad else 0)
