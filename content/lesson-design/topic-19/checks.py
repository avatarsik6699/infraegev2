"""Independent recomputation of every task answer in topic 19–21.

Usage: python3 -I content/lesson-design/topic-19/checks.py

The lessons decide positions top-down: four functions or the recursion
f(p, m). Here the same groups come bottom-up from sets: ``win_in[n]`` — the
positions from which the player to move forces a win by his n-th move,
``lose_in[n]`` — those from which the opponent does. They are filled layer by
layer over every position reachable from the starts, without recursion.
«Ваня after a mistake» is checked by trying every pair of moves, the game
without a move limit by a backward sweep over positions. Every expected
answer must appear verbatim in the answers of its subtopic file; key numbers
of the explanations are checked in the text too. Exit code 1 if any check
fails.
"""

import sys
from pathlib import Path

D = Path(__file__).resolve().parent


def text(f):
    return (D / f).read_text(encoding="utf-8")


def answers(f):
    return text(f).split("**Ответы для проверки:**", 1)[1]


checks = []


def expect(f, needle):
    checks.append((f, needle, needle in answers(f)))


def in_text(f, needle):
    checks.append((f, needle, needle in text(f)))


def same(label, a, b):
    checks.append(("—", f"{label}: {a} = {b}", a == b))


class Game:
    """Rules as data: ``step(p)`` — positions after one move, ``over(p)`` —
    the game has ended (the player who moved there won)."""

    def __init__(self, step, over):
        self.step, self.over = step, over

    def reachable(self, starts, depth):
        seen, layer = set(), set(starts)
        for _ in range(depth + 1):
            seen |= layer
            layer = {q for p in layer if not self.over(p) for q in self.step(p)} - seen
        return seen

    def layers(self, starts, rounds):
        """win_in[n], lose_in[n] for n = 1 … rounds, bottom-up over sets."""
        pos = [p for p in self.reachable(starts, 2 * rounds) if not self.over(p)]
        win_in, lose_in = {0: set()}, {0: set()}
        for n in range(1, rounds + 1):
            win = {p for p in pos if any(self.over(q) or q in lose_in[n - 1] for q in self.step(p))}
            lose = {
                p
                for p in pos
                if self.step(p) and all(not self.over(q) and q in win for q in self.step(p))
            }
            win_in[n], lose_in[n] = win, lose
        return win_in, lose_in

    def groups(self, starts, rounds=2):
        w, lo = self.layers(starts, rounds)
        out = {}
        for n in range(1, rounds + 1):
            out[f"W{n}"] = sorted(s for s in starts if s in w[n] and s not in w[n - 1])
            out[f"L{n}"] = sorted(s for s in starts if s in lo[n] and s not in lo[n - 1])
        return out

    def mistake(self, p):
        """Some first move of Петя leaves a position from which Ваня ends it."""
        return not self.over(p) and any(
            not self.over(q) and any(self.over(r) for r in self.step(q)) for q in self.step(p)
        )


def pile(*ops, ge=None, le=None):
    """One pile: ops like ("+", 1), ("*", 2), ("-", 1), ("//", 2)."""

    def step(s):
        out = []
        for op, k in ops:
            out.append({"+": s + k, "*": s * k, "-": s - k, "//": s // k}[op])
        return out

    return Game(step, (lambda s: s >= ge) if ge is not None else (lambda s: s <= le))


def piles(adds=(), muls=(), total=None):
    def step(p):
        a, b = p
        out = []
        for d in adds:
            out += [(a + d, b), (a, b + d)]
        for k in muls:
            out += [(a * k, b), (a, b * k)]
        return out

    return Game(step, lambda p: p[0] + p[1] >= total)


def keyed(game, first, starts):
    """Groups of starts (first, S), reported by S."""
    g = game.groups([(first, s) for s in starts], 3)
    return {k: [p[1] for p in v] for k, v in g.items()}


def span(values):
    return ", ".join(map(str, values))


def spand(values):
    """«27, 50 и 51»."""
    return span(values[:-1]) + " и " + str(values[-1]) if len(values) > 1 else span(values)


# --- the game of the topic: +1, ×2, s ≥ 21 -------------------------------
base = pile(("+", 1), ("*", 2), ge=21)
gb = base.groups(range(1, 21), 3)
same("W1", gb["W1"], list(range(11, 21)))
same("L1, W2, L2", (gb["L1"], gb["W2"], gb["L2"]), ([10], [5, 9], [8]))
same("неудачный ход", min(s for s in range(1, 21) if base.mistake(s)), 6)
same("третий ход", (gb["W3"], gb["L3"]), ([4, 7], [6]))

# --- 1. Игра, партия и стратегия -------------------------------------------
f = "01-igra-i-strategiya.md"
in_text(f, "5 · 2 · 2 = 20")
in_text(f, "Ответ для этой формулировки: **S = 6**")
same("из 8 Ваня не выигрывает", [base.over(q) for q in base.step(8)], [False, False])
expect(f, "1. Нет. Петя может перейти из 7 в 8. Из 8 Ваня получит 9 или 16")
g5 = pile(("+", 2), ("*", 2), ge=30)
same(
    "+2, ×2 до 30: 11 — W2 через 13",
    (11 in g5.groups([11], 2)["W2"], g5.groups([13], 1)["L1"]),
    (True, [13]),
)
expect(f, "5. Ход +2: 11 → 13.")
g6 = pile(("+", 1), ("*", 3), ge=40)
expect(f, f"6. {min(s for s in range(1, 40) if g6.mistake(s))}:")
g7 = pile(("+", 7), ("*", 2), ge=40)
expect(f, f"7. {min(s for s in range(1, 40) if g7.mistake(s))}:")
g8 = pile(("+", 1), ("+", 4), ("*", 4), ge=90)
expect(f, f"8. {min(s for s in range(1, 90) if g8.mistake(s))}:")

# --- 2. Позиции от конца игры ----------------------------------------------
f = "02-pozicii-ot-konca.md"
in_text(f, "**W1 = 11, 12, …, 20**")
in_text(f, "**L1 = 10**")
in_text(f, "**W2 = 5, 9**")
in_text(f, "**L2 = 8**")
h = pile(("+", 1), ("*", 3), ge=40)
gh = h.groups(range(1, 40), 2)
same("+1, ×3 до 40", (gh["L1"], gh["W2"], gh["L2"]), ([13], [12], [11]))
expect(f, "1. Добавить один и передать Ване 13")
expect(f, "12 — `W2` для Вани, поэтому 11 — `L2`")
g30 = pile(("+", 1), ("*", 2), ge=30).groups(range(1, 30), 2)
m30 = min(s for s in range(1, 30) if pile(("+", 1), ("*", 2), ge=30).mistake(s))
expect(
    f,
    f"4. `W1`: {g30['W1'][0]}–{g30['W1'][-1]}; `L1`: {span(g30['L1'])}; "
    f"`W2`: {span(g30['W2'])}; `L2`: {span(g30['L2'])}; минимум после неудачного хода — {m30}",
)
g12 = pile(("+", 1), ("+", 3), ge=12).groups(range(1, 12), 2)
expect(
    f,
    f"5. `W1`: {span(g12['W1'])}; `L1`: {span(g12['L1'])}; `W2`: {span(g12['W2'])}; "
    f"`L2`: {span(g12['L2'])}.",
)
g60 = pile(("+", 1), ("+", 2), ("*", 3), ge=60).groups(range(1, 60), 2)
expect(f, f"7. {g60['L1'][0]}:")
same("задача 7 — одно значение", len(g60["L1"]), 1)
expect(f, f"8. {g60['W2'][0]}{g60['W2'][1]}:")
same("задача 8 — ровно два значения", len(g60["W2"]), 2)
expect(f, f"9. {g60['L2'][0]}:")

# --- 3. Программа: четыре проверки -----------------------------------------
f = "03-chetyre-proverki.md"
g50 = pile(("+", 2), ("+", 3), ("*", 2), ge=50)
r50 = g50.groups(range(1, 50), 2)
m50 = min(s for s in range(1, 50) if g50.mistake(s))
expect(
    f,
    f"3. `L1`: {span(r50['L1'])}; `W2`: {span(r50['W2'])}; `L2`: {span(r50['L2'])}; "
    f"после неудачного хода — {m50}",
)
expect(
    f,
    f"4. {len(r50['W2'])} значения, сумма {sum(r50['W2'])}; «наименьшее и наибольшее» — "
    f"{r50['W2'][0]} и {r50['W2'][-1]}",
)
r200 = pile(("+", 1), ("+", 3), ("*", 3), ge=200).groups(range(1, 200), 2)
expect(f, f"6. {r200['L1'][0]}:")
same("задача 6 — одно значение", len(r200["L1"]), 1)
expect(f, f"7. {r200['W2'][0]}{r200['W2'][1]}: подходят {span(r200['W2'][:2])} и {r200['W2'][2]}")
r301 = pile(("+", 2), ("+", 5), ("*", 2), ge=301).groups(range(1, 301), 2)
expect(
    f, f"8. {len(r301['L2'])}: подходят {', '.join(map(str, r301['L2'][:-1]))} и {r301['L2'][-1]}"
)

# --- 4. Две кучи -------------------------------------------------------------
f = "04-dve-kuchi.md"
two = piles((1,), (2,), total=20)
k3 = keyed(two, 3, range(1, 17))
same("(3, S)", (k3["L1"], k3["W2"], k3["L2"]), ([8], [4, 6, 7], [3]))
same("(6, 6) — L1", (6, 6) in two.layers([(6, 6)], 1)[1][1], True)
same("(3, S): неудачный ход", min(s for s in range(1, 17) if two.mistake((3, s))), 5)
in_text(f, "наименьшее S = 5")
k5 = keyed(piles((1,), (3,), total=50), 5, range(1, 45))
same("(5, S), ×3 до 50", (k5["L1"], k5["W2"], k5["L2"]), ([], [4], [14]))
expect(f, f"Задание 20 — S = {k5['W2'][0]}, задание 21 — S = {k5['L2'][0]}")
g9 = piles((3,), (2,), total=120)
m9 = min(s for s in range(1, 111) if g9.mistake((9, s)))
expect(f, f"6. {m9}: два удвоения второй кучи дают 9 + 4 · {m9} = {9 + 4 * m9}")
k9 = keyed(g9, 9, range(1, 111))
expect(f, f"7. {k9['W2'][0]}{k9['W2'][1]}: подходят {spand(k9['W2'])}")
expect(f, f"8. {k9['L2'][0]}.")

# --- 5. Уменьшение кучи и ходы с условием ----------------------------------
f = "05-umenshenie-i-usloviya.md"
down = pile(("-", 1), ("//", 2), le=10)
gd = down.groups(range(11, 100), 2)
same("−1, //2 до 10", (gd["L1"], gd["W2"], gd["L2"]), ([22], [23, 44, 45], [24, 46]))
in_text(f, "**W2 = 23, 44, 45**")
same("наибольшее после неудачного хода", max(s for s in range(11, 400) if down.mistake(s)), 43)
expect(f, f"1. {max(s for s in range(13, 200) if s // 3 <= 12)}, потому что")
expect(f, f"2. `(s + 2) // 3`: из 20 получается {(20 + 2) // 3}, из 21 — тоже {(21 + 2) // 3}.")
g15 = pile(("-", 2), ("//", 3), le=15).groups(range(16, 300), 2)
same("−2, //3 до 15: W1", (g15["W1"][0], g15["W1"][-1]), (16, 47))
expect(f, f"`L1`: {span(g15['L1'])} (оба хода")
same("−2, //3 до 15: W2", g15["W2"], [50, 51, 144, 145, 146, 147, 148, 149])
cond = Game(lambda s: [s - 1] + ([s // 3] if s % 3 == 0 else []), lambda s: s <= 10)
gc = cond.groups(range(11, 41), 2)
expect(f, f"4. `L1`: {span(gc['L1'])}; наименьшая `L2` — {gc['L2'][0]}.")
g335 = pile(("-", 3), ("//", 4), le=20)
expect(f, f"5. {max(s for s in range(21, 5000) if g335.mistake(s))}:")
divisors = Game(lambda s: [s + d for d in range(2, s) if s % d == 0], lambda s: s >= 30)
expect(f, f"6. {', '.join(str(s) for s in range(2, 11) if not divisors.step(s))} —")
g30d = pile(("-", 2), ("-", 5), ("//", 3), le=30)
r30d = g30d.groups(range(31, 400), 2)
expect(f, f"7. {r30d['L1'][0]}:")
expect(f, f"8. {r30d['W2'][0]}{r30d['W2'][1]}:")
expect(f, f"9. {r30d['L2'][0]}.")
expect(f, f"10. {max(s for s in range(31, 3000) if g30d.mistake(s))}:")
same("граница L1 из хода −1", max(down.groups(range(11, 400), 1)["L1"]), 22)

# --- 6. Рекурсия f(p, m) -----------------------------------------------------
f = "06-rekursiya-f.md"
same("f(9, 3) и f(8, 3)", (9 in gb["W2"], 8 in gb["W2"] or 8 in gb["W1"]), (True, False))
g10 = piles((2,), (2,), total=100)
k10 = keyed(g10, 10, range(1, 90))
expect(f, f"7. {k10['W3'][0]}{k10['W3'][1]}: подходят {span(k10['W3'][:-1])} и {k10['W3'][-1]}")
expect(f, f"8. {k10['L3'][0]}.")

# --- 7. Позиция шире числа камней -------------------------------------------
f = "07-pozitsiya-shire.md"


def no_repeat(limit):
    names = (("+1", 1, 0), ("+2", 2, 0), ("×2", 0, 2))

    def step(p):
        s, last = p
        return [(s * k if k else s + a, n) for n, a, k in names if n != last]

    return Game(step, lambda p: p[0] >= limit)


nr = no_repeat(30)
gr = nr.groups([(s, "") for s in range(1, 30)], 2)
expect(f, f"5. {gr['L1'][0][0]}.")
expect(f, f"6. {gr['W2'][0][0]} и {gr['W2'][-1][0]}.")
nr21 = no_repeat(21).groups([(s, "") for s in range(1, 21)], 2)
same(
    "запрет повтора до 21",
    [[p[0] for p in nr21[k]] for k in ("L1", "W2", "L2")],
    [[10], [5, 6, 7, 8, 9], [4]],
)


def losing_full(step, over, positions):
    """Backward sweep: a position is lost for the mover if every move hands
    the opponent a won position. ``positions`` must be listed so that every
    move leads to a position listed earlier or to the end of the game."""
    lost = set()
    for p in positions:
        if all(not over(q) and q not in lost for q in step(p)):
            lost.add(p)
    return lost


full_lost = losing_full(lambda s: [s + 1, s * 2], lambda s: s >= 21, range(20, 0, -1))
same("игра до конца: проигрышные", sorted(full_lost), [2, 6, 8, 10])
take = losing_full(lambda s: [s - t for t in (1, 2, 3) if t <= s], lambda s: s == 0, range(1, 15))
# here the move to 0 ends the game, so «lost» positions are those where every
# move leaves the opponent a winning position; 0 itself is never reached alive
expect(f, f"3. {', '.join(map(str, sorted(take)))}:")
pairs = [(6, s) for s in range(53, 0, -1)]
order = sorted(
    {(a, b) for a in range(1, 120) for b in range(1, 120) if a + b < 60},
    key=lambda p: -(p[0] + p[1]),
)
lost2 = losing_full(
    lambda p: [(p[0] + 1, p[1]), (p[0] * 2, p[1]), (p[0], p[1] + 1), (p[0], p[1] * 2)],
    lambda p: p[0] + p[1] >= 60,
    order,
)
expect(f, f"7. {max(s for a, s in pairs if (a, s) in lost2)}:")
best = min(
    a + b for a in range(1, 50) for b in range(1, 50) if a + b < 50 and a + b + 2 * max(a, b) >= 50
)
expect(f, f"4. {best}:")

# --- 8. Практика и итог ------------------------------------------------------
f = "08-praktika-i-itog.md"
p1 = pile(("+", 2), ("*", 3), ge=70)
expect(f, f"1. {min(s for s in range(1, 70) if p1.mistake(s))}:")
p2 = pile(("+", 1), ("+", 3), ("*", 2), ge=45).groups(range(1, 45), 2)
expect(f, f"2. {p2['W2'][0]} и {p2['W2'][-1]}: подходят {spand(p2['W2'])}.")
p3 = keyed(piles((2,), (2,), total=100), 7, range(1, 93))
expect(f, f"3. {p3['L2'][0]}: подходят {spand(p3['L2'])}.")
p4 = pile(("-", 3), ("-", 4), ("//", 2), le=40).groups(range(41, 400), 1)
expect(f, f"4. {p4['L1'][-1]}:")
expect(f, f"подходят {spand(p4['L1'])}.")
p5 = pile(("+", 1), ("+", 4), ("*", 3), ge=100).groups(range(1, 100), 3)
expect(f, f"5. {p5['W3'][0]}{p5['W3'][1]}: подходят {spand(p5['W3'])}.")

bad = [c for c in checks if not c[2]]
for c in bad:
    print("FAIL", c[0], c[1])
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
