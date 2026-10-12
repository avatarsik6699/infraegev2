"""Independent recomputation of every task answer in topic 26.

Usage: python3 -I content/lesson-design/topic-26/checks.py

Each answer is recomputed here by a different method than the lesson uses.
Small exercises: full search over sets, chains, matchings and schedules, one
candidate at a time (itertools generators, never a list of all variants).
Exam files: other algorithms — dynamic programming for chains, schedules and
the climber's route, arrays of seconds for loads and idle time, set lookups for
seats and series, a heap for lockers, independent sweeps for pairs. Greedy
claims the lesson relies on are also checked against full search on random
small inputs. Every expected answer must appear verbatim in the answers of its
subtopic file. Exit code 1 if any check fails.
"""

import bisect
import heapq
import random
import sys
from collections import Counter
from fractions import Fraction
from itertools import combinations, permutations
from math import ceil
from pathlib import Path

D = Path(__file__).resolve().parent
checks: list[tuple[str, str, bool]] = []


def answers(f: str) -> str:
    return (D / f).read_text(encoding="utf-8").split("**Ответы для проверки:**", 1)[1]


def expect(f: str, needle: str) -> None:
    checks.append((f, needle, needle in answers(f)))


def same(label: str, a, b) -> None:
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def rows_of(name: str) -> list[list[str]]:
    with (D / "files" / name).open(encoding="utf-8") as f:
        return [line.split() for line in f if line.strip()]


def ints(name: str) -> list[list[int]]:
    return [[int(x) for x in r] for r in rows_of(name)]


def pair(a, b) -> str:
    return f"`{a} {b}`"


# --- brute-force helpers on small data ------------------------------------------------


def best_count_then_max(sizes, cap):
    """Largest k, then the largest single element among sets of size k (full search)."""
    for k in range(len(sizes), 0, -1):
        best = max((max(c) for c in combinations(sizes, k) if sum(c) <= cap), default=None)
        if best is not None:
            return k, best
    return 0, 0


def longest_chain(sizes, gap, key):
    """Full search of nested chains: (length, key(chain)) maximised."""
    s = sorted(sizes)
    best = None
    for k in range(len(s), 0, -1):
        for c in combinations(s, k):
            if all(b - a >= gap for a, b in zip(c, c[1:], strict=False)):
                cand = (k, key(c))
                if best is None or cand > best:
                    best = cand
        if best is not None:
            return best
    raise ValueError("no chain")


def chain_up_fast(values, gap):
    v = sorted(set(values))
    n = len(v)
    up = [1] * n
    suffix = [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        j = bisect.bisect_left(v, v[i] + gap)
        up[i] = 1 + suffix[j]
        suffix[i] = max(suffix[i + 1], up[i])
    down = [1] * n
    prefix = [0] * (n + 1)
    for i in range(n):
        j = bisect.bisect_right(v, v[i] - gap)
        down[i] = 1 + prefix[j]
        prefix[i + 1] = max(prefix[i], down[i])
    longest = max(up)
    smallest = max(v[i] for i in range(n) if up[i] == longest)
    largest = min(v[i] for i in range(n) if down[i] == longest)
    return longest, smallest, largest


def max_matching(goods, boxes):
    """Heaviest good first: into the largest container if it fits."""
    g = sorted(goods, reverse=True)
    b = sorted(boxes, reverse=True)
    j = count = 0
    for x in g:
        if j < len(b) and x <= b[j]:
            count += 1
            j += 1
    return count


def schedule_dp(meetings, pause):
    """count[i]: most meetings in a schedule ending with meeting i (by finish order)."""
    ms = sorted(meetings, key=lambda m: m[1])
    finishes = [f for _, f in ms]
    best_upto = []  # best count among meetings 0..i
    count = []
    for s, _ in ms:
        j = bisect.bisect_right(finishes, s - pause)  # meetings that end in time
        c = 1 + (best_upto[j - 1] if j else 0)
        count.append(c)
        best_upto.append(max(best_upto[-1], c) if best_upto else c)
    return ms, count


def schedule_answer(meetings, pause, last_value):
    ms, count = schedule_dp(meetings, pause)
    k = max(count)
    # earliest finish of a schedule of k − 1 meetings
    earliest = min(f for (s, f), c in zip(ms, count, strict=True) if c >= k - 1)
    value = max(
        last_value(s, f, earliest)
        for (s, f), c in zip(ms, count, strict=True)
        if c == k and s >= earliest + pause
    )
    return k, value


# --- 1. Записи и рейтинг --------------------------------------------------------------
f = "01-zapisi-i-rejting.md"
recs = [(12, 80, 5), (3, 90, 8), (7, 90, 4), (2, 90, 4)]
order = sorted(recs, key=lambda r: r[0])
for crit in (2, 1):  # stable sorts from the least important criterion
    order.sort(key=lambda r: r[crit] * (-1 if crit == 1 else 1))
expect(f, "1. `" + " ".join(str(r[0]) for r in order) + "`")
expect(f, f"2. {max([(5, 40), (6, 12), (6, 15), (4, 100)])}")
expect(f, "3. `" + " ".join(str(p) for p in sorted([(2, 5), (1, 7), (2, 3)])) + "`")
ms = [(5, 9), (1, 20), (7, 8)]
fake = list(zip(sorted(m[0] for m in ms), sorted(m[1] for m in ms), strict=True))
same("1.5", [p for p in fake if p not in ms], [(1, 8), (7, 20)])
sc = [3, -2, 0, 5, -1, 0, 4]
expect(f, f"6. `{sum(sc)} {sum(x for x in sc if x > 0)} {len(sc) - sc.count(0)}`")
tot = [90, 85, 80, 80, 80, 75, 70, 70, 65, 60, 55, 50]
k = len(tot) // 4
expect(f, f"7. {sum(t >= tot[k - 1] for t in tot)} и {k}")
same("1.8", 20000 * 19999 // 2, 199_990_000)
s1 = ints("26-1.txt")[1:]
passed = [r for r in s1 if 2 not in r[1:]]
passed.sort(key=lambda r: r[0])
passed.sort(key=lambda r: sum(r[1:]), reverse=True)
k = len(s1) * 15 // 100
last = passed[k - 1]
expect(f, f"9. {pair(last[0], sum(sum(r[1:]) == sum(last[1:]) for r in passed))}")
quiz = []
for r in ints("26-2.txt")[1:]:
    quiz.append((-sum(r[1:]), sum(1 for x in r[1:] if x), r[0]))
quiz.sort()
k = len(quiz) * 20 // 100
cut = quiz[k - 1][:2]
finalists = sum(q[:2] <= cut for q in quiz)
expect(f, f"10. {pair(finalists, min(q for q in quiz if q[:2] > cut)[2])}")

# --- 2. Жадный выбор ---------------------------------------------------------------------
f = "02-zhadnyj-vybor.md"
expect(f, "1. " + pair(*best_count_then_max([5, 7, 8, 9, 12, 16], 30)))
k, big = best_count_then_max([4, 5, 6], 10)
best_sum = max(sum(c) for r in range(4) for c in combinations([4, 5, 6], r) if sum(c) <= 10)
expect(f, f"2. {k} файла, сумма {best_sum} (4 + 6), наибольший файл {big}")
same("2.3 верно", best_count_then_max([9, 20, 3], 15)[0], 2)


def lots_buy(money, lots_a, lots_b):
    items_a = sorted(p for p, q in lots_a for _ in range(q))
    items_b = sorted(p for p, q in lots_b for _ in range(q))
    ca = 0
    while ca < len(items_a) and items_a[ca] <= money:
        money -= items_a[ca]
        ca += 1
    cb = 0
    while ca == len(items_a) and cb < len(items_b) and items_b[cb] <= money:
        money -= items_b[cb]
        cb += 1
    return cb, money


expect(f, "4. " + pair(*lots_buy(300, [(25, 4), (40, 3)], [(10, 6), (30, 5)])))


def three_rules(budget, a, b):
    """Full search: most items, then most A, then cheapest."""
    items = [(p, "A") for p in a] + [(p, "B") for p in b]
    best = None
    for r in range(len(items) + 1):
        for c in combinations(items, r):
            cost = sum(p for p, _ in c)
            if cost <= budget:
                cand = (r, sum(t == "A" for _, t in c), -cost)
                if best is None or cand > best:
                    best = cand
    assert best
    return best[1], budget + best[2]


expect(f, "5. " + pair(*three_rules(20, [3, 8, 9], [2, 4, 7])))
prices = [120, 45, 300, 80, 60, 95, 210, 150]


def triples_best(p, free_rule):
    """Full search over splits into triples (small lists only)."""
    best = None
    for perm in permutations(p):
        free = sum(free_rule(perm[i : i + 3]) for i in range(0, len(p) - 2, 3))
        if best is None or free > best:
            best = free
    return sum(p) - (best or 0)


expect(f, f"6. {triples_best(prices, min)} и {triples_best(prices, max)}")
big = sorted(p for p in prices if p > 100)
disc = big[: len(big) // 2]
total = ceil(Fraction(sum(prices) - sum(disc)) + Fraction(4, 5) * sum(disc))
expect(f, f"7. {pair(total, max(disc))}")
a3 = [r[0] for r in ints("26-3.txt")[1:]]
cap3 = ints("26-3.txt")[0][0]
s3 = sorted(a3)
pref = [0]
for x in s3:
    pref.append(pref[-1] + x)
k = bisect.bisect_right(pref, cap3) - 1
best = max(
    x for i, x in enumerate(s3) if x + (pref[k - 1] if i >= k - 1 else pref[k] - s3[i]) <= cap3
)
expect(f, "8. " + pair(k, best))
shop = rows_of("26-4.txt")
money = int(shop[0][1])
pa = sorted(int(p) for p, t in shop[1:] if t == "A")
pb = sorted(int(p) for p, t in shop[1:] if t == "B")
allp = sorted(pa + pb)
spent_prefix = [sum(allp[: i + 1]) for i in range(len(allp))]
k = bisect.bisect_right(spent_prefix, money)
best = max(
    (ca, money - sum(pa[:ca]) - sum(pb[: k - ca]))
    for ca in range(k + 1)
    if ca <= len(pa) and k - ca <= len(pb) and sum(pa[:ca]) + sum(pb[: k - ca]) <= money
)
expect(f, "9. " + pair(*best))
p5 = sorted(r[0] for r in ints("26-5.txt")[1:])
rest = len(p5) % 3
body = p5[rest:]  # leftovers are the cheapest; free — the cheapest of each triple
free = body[0::3]
expect(f, "10. " + pair(sum(p5) - sum(free), max(free)))

# --- 3. Цепочки и пары -----------------------------------------------------------------------
f = "03-cepochki-i-pary.md"
expect(f, "1. " + pair(*longest_chain([10, 16, 21, 27, 34, 40], 6, lambda c: c[0])))
k, neg = longest_chain([10, 16, 21, 27, 34, 40], 6, lambda c: -c[-1])
expect(f, "2. " + pair(k, -neg))
expect(f, "3. " + pair(*longest_chain([5, 9, 9, 13, 20, 22], 4, lambda c: c[0])))


def min_trips(weights, cap):
    """Full search: the smallest number of trips of at most two people."""
    w = sorted(weights)
    best = len(w)
    for pairs_n in range(len(w) // 2 + 1):
        for chosen in combinations(range(len(w)), 2 * pairs_n):
            for perm in permutations(chosen):
                ps = [(perm[i], perm[i + 1]) for i in range(0, len(perm), 2)]
                if all(w[i] + w[j] <= cap for i, j in ps):
                    best = min(best, len(w) - pairs_n)
                    break
    return best


expect(f, f"4. {min_trips([40, 55, 70, 85, 90], 130)}:")
expect(f, f"5. {min_trips([40, 40, 50], 130)} рейса")


def goods_brute(goods, boxes):
    best = (0, 0)
    for perm in permutations(boxes):
        sent = [g for g, b in zip(goods, perm, strict=False) if g <= b]
        cand = (len(sent), max(sent, default=0))
        best = max(best, cand)
    return best


expect(f, "6. " + pair(*goods_brute([12, 18, 25, 27], [15, 20, 28, 10])))


def parts_brute(a, b, d):
    best = (0, 0)
    for r in range(min(len(a), len(b)) + 1):
        for ca in combinations(a, r):
            for cb in permutations(b, r):
                if all(abs(x - y) <= d for x, y in zip(ca, cb, strict=True)):
                    cand = (sum(ca) + sum(cb), r)
                    best = max(best, cand)
    return best[1], best[0]


expect(f, "7. " + pair(*parts_brute([31, 44, 52, 60], [35, 47, 49, 70], 4)))
boxes6 = [r[0] for r in ints("26-6.txt")[1:]]
longest, smallest, largest = chain_up_fast(boxes6, 7)
expect(f, "8. " + pair(longest, smallest))
two = ints("26-7.txt")[1:]
goods = [r[0] for r in two]
conts = [r[1] for r in two]
k = max_matching(goods, conts)
heaviest = None
for x in sorted(set(goods), reverse=True):
    rest_goods = sorted(goods)
    rest_goods.remove(x)
    if max_matching(rest_goods[: k - 1] + [x], conts) == k:
        heaviest = x
        break
expect(f, "9. " + pair(k, heaviest))
# A/B parts: an independent sweep with explicit index lists
aa = sorted((r[0] for r in two), reverse=True)
bb = sorted((r[1] for r in two), reverse=True)
count = profit = 0
ia = ib = 0
while ia < len(aa) and ib < len(bb):
    x, y = aa[ia], bb[ib]
    if abs(x - y) <= 15:
        count, profit = count + 1, profit + x + y
        ia, ib = ia + 1, ib + 1
    elif x > y:
        ia += 1
    else:
        ib += 1
expect(f, "10. " + pair(count, profit))

# --- 4. Ряды и серии --------------------------------------------------------------------------
f = "04-ryady-i-serii.md"
occ = {(5, 10), (5, 13), (8, 20), (8, 23), (8, 30), (8, 33)}
found = max(
    (r, -(s + 1))
    for r, s in occ
    if (r, s + 3) in occ and (r, s + 1) not in occ and (r, s + 2) not in occ
)
expect(f, "1. " + pair(found[0], -found[1]))
ps = {1, 2, 3, 7, 8, 9, 10, 15, 16}
starts = [p for p in ps if p - 1 not in ps]
lengths = []
for p in starts:
    q = p
    while q + 1 in ps:
        q += 1
    lengths.append(q - p + 1)
expect(f, "2. " + pair(max(lengths), sum(x >= 3 for x in lengths)))
occ3 = [3, 9, 13, 14, 20]
gaps = [b - a - 1 for a, b in zip(occ3, occ3[1:], strict=False)]
expect(f, "3. " + ", ".join(map(str, gaps[:-1])) + f" и {gaps[-1]} свободных")
lights = sorted({1, 2, 5, 6, 7, 11, 12})
spans, first = [], lights[0]
for a, b in zip(lights, lights[1:], strict=False):
    if b - a - 1 > 2:  # more than two dark points in a row end the line
        spans.append(a - first + 1)
        first = b
spans.append(lights[-1] - first + 1)
expect(f, f"4. {max(spans)}: точки 1–7")
col5 = {3, 7}
column = []
for r in range(1, 11):
    if r in col5:
        continue
    before = 0
    while r - before - 1 >= 1 and r - before - 1 not in col5:
        before += 1
    column.append((before, -r))
best_col = max(column)
expect(f, f"6. Ряд {-best_col[1]}, перед ним {best_col[0]} свободных")
art_all = [(101, 500, 0), (101, 500, 0), (101, 500, 1), (205, 900, 0), (205, 900, 1)]
art_all += [(205, 900, 1), (307, 120, 0), (307, 120, 0), (307, 120, 0)]
art_all += [(412, 700, 0), (412, 700, 0), (412, 700, 1)]
avg_left = Fraction(sum(p for _, p, st in art_all if st == 1), sum(st for *_, st in art_all))
dear_arts = {a for a, p, _ in art_all if p > avg_left}
leader = max(dear_arts, key=lambda a: sum(1 for x, _, st in art_all if x == a and st == 0))
sold_n = sum(1 for x, _, st in art_all if x == leader and st == 0)
left_n = sum(1 for x, _, st in art_all if x == leader and st == 1)
price_l = next(p for x, p, _ in art_all if x == leader)
expect(f, f"Лидер — {leader}: выручка {sold_n * price_l}, осталось {left_n}")

iso = [
    p for p in (1, 6, 8, 15, 30, 33) if all(abs(p - q) > 3 for q in (1, 6, 8, 15, 30, 33) if q != p)
]
expect(f, f"5. {len(iso)}: изолированы {iso[0]} и {iso[1]}")
hall = ints("26-8.txt")
taken = {(r[0], r[1]) for r in hall[1:]}
cand = [
    (r, -(s + 1))
    for r, s in taken
    if (r, s + 5) in taken and all((r, s + d) not in taken for d in range(1, 5))
]
best = max(cand)
expect(f, "8. " + pair(best[0], -best[1]))
lit: dict[int, set[int]] = {}
for r, p in ints("26-9.txt")[1:]:
    lit.setdefault(r, set()).add(p)
lines_best = max(
    (sum(1 for p in s if p - 1 not in s and p + 1 in s and p + 2 in s), r) for r, s in lit.items()
)
expect(f, "9. " + pair(*lines_best))
iso_best = max(
    (sum(1 for p in s if not any(q in s for q in range(p - 4, p + 5) if q != p)), -r)
    for r, s in lit.items()
)
expect(f, "10. " + pair(iso_best[0], -iso_best[1]))

# --- 5. Интервалы ---------------------------------------------------------------------------------


def must(value):
    assert value is not None
    return value


def schedule_brute(meetings, pause):
    """Full search: most meetings, then the largest gap before the last one."""
    best = None
    ms = sorted(meetings)
    for r in range(len(ms), 1, -1):
        for c in combinations(ms, r):
            if all(c[i + 1][0] >= c[i][1] + pause for i in range(r - 1)):
                cand = (r, c[-1][0] - c[-2][1])
                if best is None or cand > best:
                    best = cand
        if best:
            return best
    return best


f = "05-intervaly.md"
m1 = [(1, 3), (2, 6), (3, 5), (5, 8), (9, 15), (12, 16)]
expect(f, "1. " + pair(*must(schedule_brute(m1, 0))))
expect(f, "3. " + pair(*must(schedule_brute(m1, 1))))
expect(f, f"2. {must(schedule_brute([(0, 20), (1, 3), (3, 5), (5, 7)], 0))[0]} и 1")
m4 = [(s, s + d) for s, d in [(1, 4), (5, 2), (6, 5), (8, 3), (12, 2)]]
k, gap = must(schedule_brute(m4, 0))
expect(
    f, f"4. {k} собрания, перерыв {gap}, окончание {schedule_answer(m4, 0, lambda s, f, e: f)[1]}"
)


def seconds_load(intervals, end):
    units = [0] * (end + 1)
    for s, e in intervals:
        units[s] += 1
        units[e] -= 1
    cur, load = 0, []
    for t in range(end):
        cur += units[t]
        load.append(cur)
    return load


load = seconds_load([(2, 6), (4, 9), (10, 12), (11, 15), (20, 22)], 24)
idle_runs = sum(1 for t in range(24) if load[t] == 0 and (t == 0 or load[t - 1] > 0))
expect(
    f,
    f"5. Работа {sum(x > 0 for x in load)}, простоев {idle_runs} общей длительностью {load.count(0)}",
)
load = seconds_load([(1, 6), (2, 4), (4, 8), (5, 9)], 10)
expect(f, f"6. {max(load)} запроса в течение {load.count(max(load))}")
meet = [tuple(r) for r in ints("26-10.txt")[1:]]
expect(f, "8. " + pair(*schedule_answer(meet, 10, lambda s, f, e: s - e)))
jobs = [tuple(r) for r in ints("26-11.txt")[1:]]
load = seconds_load(jobs, 86400)
idle_runs = sum(1 for t in range(86400) if load[t] == 0 and (t == 0 or load[t - 1] > 0))
expect(f, "9. " + pair(idle_runs, load.count(0)))
expect(f, "10. " + pair(max(load), load.count(max(load))))

# --- 6. Моделирование -----------------------------------------------------------------------------


def lockers_heap(k, requests, strict):
    free = list(range(k))
    busy: list[tuple[int, int]] = []
    accepted, last = 0, None
    for s, e in sorted(requests, key=lambda r: r[0]):
        while busy and (busy[0][0] < s if strict else busy[0][0] <= s):
            heapq.heappush(free, heapq.heappop(busy)[1])
        if free:
            cell = heapq.heappop(free)
            heapq.heappush(busy, (e, cell))
            accepted, last = accepted + 1, cell + 1
    return accepted, last


f = "06-modelirovanie.md"
req = [(1, 5), (2, 4), (3, 7), (4, 8), (5, 6)]
expect(f, "1. " + pair(*lockers_heap(2, req, True)))
expect(
    f, "2. " + pair(*lockers_heap(3, [(0, 10), (2, 6), (4, 9), (6, 12), (9, 11), (10, 15)], False))
)


def one_window(clients, max_wait):
    t, waits = 0, []
    for a, d in clients:
        start = a if a >= t else t
        if start - a > max_wait:
            waits.append(None)
            continue
        waits.append(start - a)
        t = start + d
    return waits


w = one_window([(0, 5), (2, 3), (4, 4), (12, 2)], 2)
expect(f, f"3. {sum(x is not None for x in w)} и {w.count(None)}")
w = one_window([(0, 5), (2, 3), (4, 4), (12, 2)], 10**9)
expect(f, "4. " + ", ".join(map(str, w[:-1])) + f" и {w[-1]}")
loads = []
left = sorted([8, 7, 5, 4, 3, 1], reverse=True)
while left:
    box, keep = 0, []
    for x in left:
        (keep.append(x) if box + x > 12 else None)
        box += 0 if box + x > 12 else x
    loads.append(box)
    left = keep
expect(f, "5. " + ", ".join(map(str, loads[:-1])) + f" и {loads[-1]}")
room = [10, 6, 8]
aside = []
for part in [6, 9, 3, 5, 4]:
    fits = [i for i in range(3) if room[i] >= part]
    if fits:
        room[fits[0]] -= part
    else:
        aside.append(part)
expect(f, f"6. {5 - len(aside)} детали, отложена {aside[0]}")
items = [(5, 9), (8, 2), (4, 7), (6, 3)]
order = sorted(range(4), key=lambda i: min(items[i]))  # each item is placed by its smaller time
line: list[int] = [0] * 4
front, back = 0, 3
for i in order:
    if items[i][0] < items[i][1]:
        line[front], front = i + 1, front + 1
    else:
        line[back], back = i + 1, back - 1
expect(f, f"7. Изделие {order[-1] + 1}, перед ним одно: лента {', '.join(map(str, line))}")
same("6.7 перед ним", line.index(order[-1] + 1), 1)
lk = ints("26-12.txt")
expect(f, "8. " + pair(*lockers_heap(lk[0][0], [tuple(r) for r in lk[2:]], True)))
cl = ints("26-13.txt")[1:]
by_window: dict[int, list[tuple[int, int]]] = {}
for a, d, w_ in sorted(cl):
    by_window.setdefault(w_, []).append((a, d))
served = {}
gone = 0
for w_, lst in by_window.items():
    res = one_window(lst, 15)
    served[w_] = sum(x is not None for x in res)
    gone += res.count(None)
expect(f, "9. " + pair(max(served.values()), gone))
log = rows_of("26-14.txt")
cap = int(log[0][1])
recs = sorted(
    (sum(int(x) * m for x, m in zip(t.split(":"), (3600, 60, 1), strict=True)), int(c), int(v))
    for t, c, v in log[1:]
)
totals = Counter()
for _, c, v in recs:
    totals[c] += v
top = max(totals.values())
best_client = min(c for c in totals if totals[c] == top)
mem, copies = 0, []
for t, _, v in recs:
    if mem + v > cap:
        copies.append((t, mem))
        mem = 0
    mem += v
morning = [u for t, u in copies if t < 43200]
expect(f, "10. " + pair(best_client, sum(sorted(morning, reverse=True)[:2])))

# --- 7. Пары, окно, куча ------------------------------------------------------------------------------
f = "07-pary-okno-kucha.md"
expect(f, f"1. {sum(x + y <= 14 for x, y in combinations([2, 5, 7, 9, 12], 2))}:")
nums = [2, 4, 6, 9, 10, 14]
avgs = [
    (x + y) // 2 for x, y in combinations(nums, 2) if x % 2 == 0 == y % 2 and (x + y) // 2 in nums
]
expect(f, "2. " + pair(len(avgs), max(avgs)))
nums = [3, 5, 8, 13, 21]
expect(f, f"3. {sum((x + y) % 2 == 1 and x + y in nums for x, y in combinations(nums, 2))}:")
vals = [5, 1, 9, 12, 2, 7, 13]
expect(f, f"4. {max(sum(lo <= v <= lo + 4 for v in vals) for lo in vals)}:")


def climber_dp(heights, normal, special, allowed):
    h = sorted(set(heights))
    n = len(h)
    # dp[i][u]: longest route ending at h[i] with u special moves used
    dp = [[0] * (allowed + 1) for _ in range(n)]
    best = (0, 0)
    for i in range(n - 1, -1, -1):  # from the highest camp down
        for u in range(allowed + 1):
            val = 1
            j = i + 1
            while j < n and h[j] - h[i] <= special:
                g = h[j] - h[i]
                if g <= normal:
                    val = max(val, dp[j][u] + 1)
                elif u > 0:
                    val = max(val, dp[j][u - 1] + 1)
                j += 1
            dp[i][u] = val
        best = max(best, (dp[i][allowed], h[i]))
    return best


expect(f, "5. " + pair(*climber_dp([30, 28, 23, 21, 17, 15, 9, 8], 3, 6, 2)))
hp = [5, 1, 4]
heapq.heapify(hp)
expect(f, f"6. {heapq.heappop(hp)} и {heapq.heappop(hp)}, в куче осталось `{hp}`")
nums15 = [r[0] for r in ints("26-15.txt")[1:]]
present = set(nums15)
cnt, top = 0, 0
for t in nums15:  # count pairs by their sum t: x even, y = t − x odd
    for x in nums15:
        y = t - x
        if x % 2 == 0 and y % 2 == 1 and y in present:
            cnt += 1
            top = max(top, t)
expect(f, "7. " + pair(cnt, top))
expect(f, "8. " + pair(*climber_dp([r[0] for r in ints("26-16.txt")[1:]], 60, 100, 5)))

# --- 8. Сложные цепочки -------------------------------------------------------------------------------


def alt_brute(boxes, gap_of, want_small):
    """Full search of alternating chains; gap_of(k) — gap after k boxes."""
    s = sorted(boxes)
    best = None
    for r in range(1, len(s) + 1):
        for c in combinations(s, r):
            if all(
                c[i][1] != c[i + 1][1] and c[i + 1][0] - c[i][0] >= gap_of(i + 1)
                for i in range(r - 1)
            ):
                cand = (r, c[0][0] if want_small else -c[-1][0])
                if best is None or cand > best:
                    best = cand
    assert best
    return best[0], best[1] if want_small else -best[1]


f = "08-slozhnye-cepochki.md"
col = [(40, 0), (37, 1), (33, 1), (31, 0), (26, 0), (24, 1), (20, 0), (18, 1), (12, 1)]
expect(f, "1. " + pair(*alt_brute(col, lambda k: 4, True)))
mat = [
    (10, 0),
    (11, 1),
    (13, 1),
    (14, 0),
    (17, 0),
    (18, 1),
    (22, 1),
    (23, 0),
    (27, 0),
    (28, 1),
    (33, 1),
]
expect(f, "2. " + pair(*alt_brute(mat, lambda k: 1 + k, False)))


def min_blocks(boxes, ok):
    """Fewest chains covering all boxes: n − maximum matching (Kuhn)."""
    n = len(boxes)
    match = [-1] * n

    def augment(u, seen):
        for v in range(n):
            if ok(boxes[u], boxes[v]) and v not in seen:
                seen.add(v)
                if match[v] == -1 or augment(match[v], seen):
                    match[v] = u
                    return True
        return False

    return n - sum(augment(u, set()) for u in range(n))


plain = [(x, 0) for x in (3, 5, 6, 9, 11, 12, 13, 17)]
expect(f, f"3. {min_blocks(plain, lambda a, b: b[0] - a[0] >= 4)}:")
colored = [(5, 0), (6, 1), (10, 0), (12, 0), (13, 1), (17, 1), (18, 0)]
expect(f, f"5. {min_blocks(colored, lambda a, b: a[1] != b[1] and b[0] - a[0] >= 4)}:")
same("8 пример", min_blocks(colored, lambda a, b: a[1] != b[1] and b[0] - a[0] >= 5), 3)


def best_set_brute(sizes, cap):
    for r in range(len(sizes), 0, -1):
        fits = [sorted(c, reverse=True) for c in combinations(sizes, r) if sum(c) <= cap]
        if fits:
            return sorted(max(fits))
    return []


expect(f, "6. `" + " ".join(map(str, best_set_brute([5, 7, 8, 9, 12, 16], 33))) + "`")
same("8 пример набора", best_set_brute([8, 12, 15, 19, 22, 34], 62), [8, 12, 19, 22])
srt = sorted(boxes6)
widest = max(bisect.bisect_left(srt, x + 7) - i for i, x in enumerate(srt))
expect(f, "7. " + pair(widest, longest))
mats = [tuple(r) for r in ints("26-17.txt")[1:]]
by_mat = {m: sorted(s for s, mm in mats if mm == m) for m in (0, 1)}
res = []
for first in (0, 1):
    need, count, last = first, 0, None
    while True:
        lst = by_mat[need]
        j = bisect.bisect_left(lst, (last + 500 + count) if last is not None else -1)
        if j == len(lst):
            break
        last, count, need = lst[j], count + 1, 1 - need
    res.append((count, -last if last is not None else 0))
best = max(res)
expect(f, "8. " + pair(best[0], -best[1]))

# --- 9. Практика и итог ---------------------------------------------------------------------------------
f = "09-praktika-i-itog.md"
n, m, kk = hall[0]
best = None
for c in range(1, kk + 1):
    run = 0
    for r in range(1, m + 1):
        if (r, c) in taken:
            run = 0
            continue
        cand = (run, -r)
        if best is None or cand > best:
            best = cand
        run += 1
assert best
expect(f, "1. " + pair(-best[1], best[0]))
expect(f, "2. " + pair(*schedule_answer(meet, 0, lambda s, f, e: f)))
p5_all = [r[0] for r in ints("26-5.txt")[1:]]
dear = sorted((p for p in p5_all if p > 1000), reverse=True)
cheap_half = dear[len(dear) - len(dear) // 2 :]
total = ceil(Fraction(sum(p5_all)) - Fraction(1, 5) * sum(cheap_half))
expect(f, "3. " + pair(total, max(cheap_half)))
expect(
    f, "4. " + pair(longest_inside := chain_up_fast(boxes6, 10)[0], chain_up_fast(boxes6, 10)[2])
)
_ = longest_inside
weights = sorted(a3, reverse=True)
containers = []
while weights:
    load, rest = 0, []
    for x in weights:
        if load + x <= 250:
            load += x
        else:
            rest.append(x)
    containers.append(load)
    weights = rest
expect(f, "5. " + pair(len(containers), containers[-2]))

# --- greedy claims against full search on random small data -----------------------------------------


def ab_greedy(a, b, d):
    a, b = sorted(a, reverse=True), sorted(b, reverse=True)
    i = j = c = p = 0
    while i < len(a) and j < len(b):
        if a[i] > b[j] + d:
            i += 1
        elif b[j] > a[i] + d:
            j += 1
        else:
            c, p, i, j = c + 1, p + a[i] + b[j], i + 1, j + 1
    return c, p


rnd = random.Random(26)
bad = 0
for _ in range(300):
    a = [rnd.randint(1, 30) for _ in range(rnd.randint(0, 4))]
    b = [rnd.randint(1, 30) for _ in range(rnd.randint(0, 4))]
    d = rnd.randint(0, 6)
    bad += ab_greedy(a, b, d) != parts_brute(a, b, d)
same("пары A и B: жадный проход = перебор (300 наборов)", bad, 0)
bad = 0
for _ in range(300):
    ms_ = []
    for _ in range(rnd.randint(2, 6)):
        s = rnd.randint(0, 20)
        ms_.append((s, s + rnd.randint(1, 6)))
    p_ = rnd.randint(0, 2)
    brute = schedule_brute(ms_, p_)
    if brute is None:
        continue
    bad += schedule_answer(ms_, p_, lambda s, f, e: s - e) != brute
same("перерыв перед последним: динамика = перебор (300 наборов)", bad, 0)
bad = 0
for _ in range(300):
    bx = [(rnd.randint(1, 25), rnd.randint(0, 1)) for _ in range(rnd.randint(1, 7))]
    tops: dict[int, list[int]] = {0: [], 1: []}
    blocks = 0
    for size, colr in sorted(bx):
        fit = [t for t in tops[1 - colr] if t <= size - 5]
        if fit:
            tops[1 - colr].remove(max(fit))
        else:
            blocks += 1
        tops[colr].append(size)
    bad += blocks != min_blocks(bx, lambda u, v: u[1] != v[1] and v[0] - u[0] >= 5)
same("блоки с чередованием: жадно = паросочетание (300 наборов)", bad, 0)

failed = [c for c in checks if not c[2]]
for f_, needle, ok in checks:
    if not ok:
        print(f"FAIL {f_}: {needle}")
print(f"{len(checks)} checks, {len(failed)} failed")
sys.exit(1 if failed else 0)
