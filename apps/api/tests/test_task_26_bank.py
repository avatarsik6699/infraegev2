"""Independent answer and content checks for the EGE topic 26 lesson «Обработка данных».

The lesson sorts and chooses greedily. Here every answer is recomputed another way: the
small exercises by full search over sets, chains, matchings, orders and schedules; the
files by stable sorts from the least important criterion, prefix sums with ``bisect``,
dynamic programming for chains, schedules and the climber's route, arrays of seconds for
loads and idle time, set lookups for seats and series and a heap for the lockers. The
bank's own solution programs, run next to their attachments, must print the same answers.
"""

import bisect
import heapq
import shutil
import subprocess
import sys
import tempfile
from collections import Counter
from fractions import Fraction
from itertools import combinations, permutations
from math import ceil
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
FILES = ROOT / "content/lesson-files/topic-26"
MATERIAL = "array-processing"
RETIRED = [f"task-26-{number:02d}" for number in range(1, 8)] + ["task-26-8-05"]


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _rows(name: str) -> list[list[str]]:
    return [line.split() for line in (FILES / name).read_text().splitlines() if line.strip()]


def _ints(name: str) -> list[list[int]]:
    return [[int(x) for x in r] for r in _rows(name)]


def _column(name: str) -> list[int]:
    return [r[0] for r in _ints(name)[1:]]


def _pair(*values: object) -> str:
    return " ".join(map(str, values))


# --- full search on small data -----------------------------------------------------------


def _count_then_max(sizes, cap):
    for k in range(len(sizes), 0, -1):
        best = max((max(c) for c in combinations(sizes, k) if sum(c) <= cap), default=None)
        if best is not None:
            return k, best
    return 0, 0


def _longest_chain(sizes, gap, key):
    s = sorted(sizes)
    for k in range(len(s), 0, -1):
        found = [
            (k, key(c))
            for c in combinations(s, k)
            if all(b - a >= gap for a, b in zip(c, c[1:], strict=False))
        ]
        if found:
            return max(found)
    raise ValueError("no chain")


def _min_trips(weights, cap):
    """The smallest number of trips of at most two people, over all pairings."""
    w = sorted(weights)
    best = len(w)
    for pairs in range(len(w) // 2 + 1):
        for chosen in combinations(range(len(w)), 2 * pairs):
            for perm in permutations(chosen):
                ps = [(perm[i], perm[i + 1]) for i in range(0, len(perm), 2)]
                if all(w[i] + w[j] <= cap for i, j in ps):
                    best = min(best, len(w) - pairs)
                    break
    return best


def _goods_brute(goods, boxes):
    best = (0, 0)
    for perm in permutations(boxes):
        sent = [g for g, b in zip(goods, perm, strict=False) if g <= b]
        best = max(best, (len(sent), max(sent, default=0)))
    return best


def _parts_brute(a, b, d):
    best = (0, 0)
    for r in range(min(len(a), len(b)) + 1):
        for ca in combinations(a, r):
            for cb in permutations(b, r):
                if all(abs(x - y) <= d for x, y in zip(ca, cb, strict=True)):
                    best = max(best, (sum(ca) + sum(cb), r))
    return best[1], best[0]


def _schedule_brute(meetings, pause, value):
    """Most meetings, then the largest value(last two) over all sets."""
    ms = sorted(meetings)
    for r in range(len(ms), 1, -1):
        found = [
            (r, value(c))
            for c in combinations(ms, r)
            if all(c[i + 1][0] >= c[i][1] + pause for i in range(r - 1))
        ]
        if found:
            return max(found)
    raise ValueError("no schedule")


def _alt_brute(boxes, gap_of, want_small):
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


def _min_blocks(boxes, ok):
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


# --- second methods for the files -----------------------------------------------------------


def _chain_dp(values, gap):
    """Longest chain through each size from below and from above, with bisect."""
    v = sorted(set(values))
    n = len(v)
    up, suffix = [1] * n, [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        up[i] = 1 + suffix[bisect.bisect_left(v, v[i] + gap)]
        suffix[i] = max(suffix[i + 1], up[i])
    down, prefix = [1] * n, [0] * (n + 1)
    for i in range(n):
        down[i] = 1 + prefix[bisect.bisect_right(v, v[i] - gap)]
        prefix[i + 1] = max(prefix[i], down[i])
    longest = max(up)
    smallest = max(v[i] for i in range(n) if up[i] == longest)
    largest = min(v[i] for i in range(n) if down[i] == longest)
    return longest, smallest, largest


def _max_matching(goods, boxes):
    """Heaviest good first: into the largest container if it fits."""
    b = sorted(boxes, reverse=True)
    j = count = 0
    for x in sorted(goods, reverse=True):
        if j < len(b) and x <= b[j]:
            count += 1
            j += 1
    return count


def _schedule_dp(meetings, pause, last_value):
    """count[i]: most meetings in a schedule ending with meeting i (by finish)."""
    ms = sorted(meetings, key=lambda m: m[1])
    finishes = [f for _, f in ms]
    best_upto: list[int] = []
    count = []
    for s, _ in ms:
        j = bisect.bisect_right(finishes, s - pause)
        c = 1 + (best_upto[j - 1] if j else 0)
        count.append(c)
        best_upto.append(max(best_upto[-1], c) if best_upto else c)
    k = max(count)
    earliest = min(f for (s, f), c in zip(ms, count, strict=True) if c >= k - 1)
    value = max(
        last_value(s, f, earliest)
        for (s, f), c in zip(ms, count, strict=True)
        if c == k and s >= earliest + pause
    )
    return k, value


def _load(intervals, end):
    """Number of running intervals in every unit of time [t, t + 1)."""
    units = [0] * (end + 1)
    for s, e in intervals:
        units[s] += 1
        units[e] -= 1
    cur, load = 0, []
    for t in range(end):
        cur += units[t]
        load.append(cur)
    return load


def _idle_runs(load):
    return sum(1 for t in range(len(load)) if load[t] == 0 and (t == 0 or load[t - 1] > 0))


def _lockers_heap(k, requests, strict):
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


def _one_window(clients, max_wait):
    t, waits = 0, []
    for a, d in clients:
        start = max(a, t)
        if start - a > max_wait:
            waits.append(None)
            continue
        waits.append(start - a)
        t = start + d
    return waits


def _climber_dp(heights, normal, special, allowed):
    h = sorted(set(heights))
    n = len(h)
    dp = [[0] * (allowed + 1) for _ in range(n)]
    best = (0, 0)
    for i in range(n - 1, -1, -1):
        for u in range(allowed + 1):
            val = 1
            j = i + 1
            while j < n and h[j] - h[i] <= special:
                if h[j] - h[i] <= normal:
                    val = max(val, dp[j][u] + 1)
                elif u > 0:
                    val = max(val, dp[j][u - 1] + 1)
                j += 1
            dp[i][u] = val
        best = max(best, (dp[i][allowed], h[i]))
    return best


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    # subtopic 1: stable sorts from the least important criterion
    recs = sorted([(12, 80, 5), (3, 90, 8), (7, 90, 4), (2, 90, 4)])
    recs.sort(key=lambda r: r[2])
    recs.sort(key=lambda r: r[1], reverse=True)
    a["task-26-1-01"] = _pair(*(r[0] for r in recs))
    variants = [(5, 40), (6, 12), (6, 15), (4, 100)]
    a["task-26-1-02"] = _pair(*sorted(sorted(variants, key=lambda v: v[1]), key=lambda v: v[0])[-1])
    sc = Counter((x > 0) - (x < 0) for x in [3, -2, 0, 5, -1, 0, 4])
    a["task-26-1-06"] = _pair(3 - 2 + 5 - 1 + 4, 3 + 5 + 4, sc[1] + sc[-1])
    tot = [90, 85, 80, 80, 80, 75, 70, 70, 65, 60, 55, 50]
    k = len(tot) // 4
    places = [1 + sum(y > x for y in tot) for x in tot]  # a tie shares the place
    a["task-26-1-07"] = _pair(sum(p <= k for p in places), k)
    s1 = _ints("26-1.txt")[1:]
    passed = sorted((r for r in s1 if 2 not in r[1:]), key=lambda r: r[0])
    passed.sort(key=lambda r: sum(r[1:]), reverse=True)
    last = passed[len(s1) * 15 // 100 - 1]
    a["task-26-1-09"] = _pair(last[0], sum(sum(r[1:]) == sum(last[1:]) for r in passed))
    quiz = sorted((-sum(r[1:]), sum(1 for x in r[1:] if x), r[0]) for r in _ints("26-2.txt")[1:])
    cut = quiz[len(quiz) * 20 // 100 - 1][:2]
    a["task-26-1-10"] = _pair(
        sum(q[:2] <= cut for q in quiz), min(q for q in quiz if q[:2] > cut)[2]
    )
    # subtopic 2
    a["task-26-2-01"] = _pair(*_count_then_max([5, 7, 8, 9, 12, 16], 30))
    k, big = _count_then_max([4, 5, 6], 10)
    best_sum = max(sum(c) for c in combinations([4, 5, 6], k) if sum(c) <= 10)
    a["task-26-2-02"] = _pair(k, best_sum, big)
    lots_a = [25] * 4 + [40] * 3
    lots_b = [10] * 6 + [30] * 5
    a_best = max(
        (r, -sum(c))
        for r in range(len(lots_a) + 1)
        for c in combinations(lots_a, r)
        if sum(c) <= 300
    )
    money = 300 + a_best[1]
    b_best = max(
        (r, -sum(c))
        for r in range(len(lots_b) + 1)
        for c in set(combinations(lots_b, r))
        if sum(c) <= money
    )
    a["task-26-2-04"] = _pair(b_best[0], money + b_best[1])
    items = [(p, "A") for p in [3, 8, 9]] + [(p, "B") for p in [2, 4, 7]]
    best = max(
        (r, sum(t == "A" for _, t in c), -sum(p for p, _ in c))
        for r in range(len(items) + 1)
        for c in combinations(items, r)
        if sum(p for p, _ in c) <= 20
    )
    a["task-26-2-05"] = _pair(best[1], 20 + best[2])
    prices = [120, 45, 300, 80, 60, 95, 210, 150]

    def triples(rule):
        free = max(
            sum(rule(perm[i : i + 3]) for i in range(0, len(prices) - 2, 3))
            for perm in permutations(prices)
        )
        return sum(prices) - free

    a["task-26-2-06"] = _pair(triples(min), triples(max))
    big = sorted(p for p in prices if p > 100)
    disc = big[: len(big) // 2]
    total = ceil(Fraction(sum(prices) - sum(disc)) + Fraction(4, 5) * sum(disc))
    a["task-26-2-07"] = _pair(total, max(disc))
    cap3 = _ints("26-3.txt")[0][0]
    s3 = sorted(_column("26-3.txt"))
    pref = [0]
    for x in s3:
        pref.append(pref[-1] + x)
    k = bisect.bisect_right(pref, cap3) - 1
    largest = max(
        x for i, x in enumerate(s3) if x + (pref[k - 1] if i >= k - 1 else pref[k] - s3[i]) <= cap3
    )
    a["task-26-2-08"] = _pair(k, largest)
    shop = _rows("26-4.txt")
    money = int(shop[0][1])
    pa = sorted(int(p) for p, t in shop[1:] if t == "A")
    pb = sorted(int(p) for p, t in shop[1:] if t == "B")
    pre_a = [0, *(sum(pa[: i + 1]) for i in range(len(pa)))]
    pre_b = [0, *(sum(pb[: i + 1]) for i in range(len(pb)))]
    best = None
    for ca in range(len(pa) + 1):  # every number of A, then as many B as fit
        if pre_a[ca] <= money:
            cb = bisect.bisect_right(pre_b, money - pre_a[ca]) - 1
            cand = (ca + cb, ca, -(pre_a[ca] + pre_b[cb]))
            best = cand if best is None or cand > best else best
    assert best
    a["task-26-2-09"] = _pair(best[1], money + best[2])
    p5 = sorted(_column("26-5.txt"))
    free = p5[len(p5) % 3 :][0::3]  # leftovers are the cheapest; then the cheapest of each triple
    a["task-26-2-10"] = _pair(sum(p5) - sum(free), max(free))
    # subtopic 3
    a["task-26-3-01"] = _pair(*_longest_chain([10, 16, 21, 27, 34, 40], 6, lambda c: c[0]))
    k, neg = _longest_chain([10, 16, 21, 27, 34, 40], 6, lambda c: -c[-1])
    a["task-26-3-02"] = _pair(k, -neg)
    a["task-26-3-04"] = str(_min_trips([40, 55, 70, 85, 90], 130))
    a["task-26-3-06"] = _pair(*_goods_brute([12, 18, 25, 27], [15, 20, 28, 10]))
    a["task-26-3-07"] = _pair(*_parts_brute([31, 44, 52, 60], [35, 47, 49, 70], 4))
    boxes6 = _column("26-6.txt")
    longest, smallest, _ = _chain_dp(boxes6, 7)
    a["task-26-3-08"] = _pair(longest, smallest)
    two = _ints("26-7.txt")[1:]
    goods, conts = [r[0] for r in two], [r[1] for r in two]
    k = _max_matching(goods, conts)
    lightest = sorted(goods)
    heaviest = next(
        x
        for x in sorted(set(goods), reverse=True)
        if _max_matching([*[g for g in lightest if g != x][: k - 1], x], conts) == k
    )
    a["task-26-3-09"] = _pair(k, heaviest)
    aa = sorted((r[0] for r in two), reverse=True)
    bb = sorted((r[1] for r in two), reverse=True)
    count = profit = ia = ib = 0
    while ia < len(aa) and ib < len(bb):
        x, y = aa[ia], bb[ib]
        if abs(x - y) <= 15:
            count, profit, ia, ib = count + 1, profit + x + y, ia + 1, ib + 1
        elif x > y:
            ia += 1
        else:
            ib += 1
    a["task-26-3-10"] = _pair(count, profit)
    # subtopic 4: set lookups
    occ = {(5, 10), (5, 13), (8, 20), (8, 23), (8, 30), (8, 33)}
    found = max(
        (r, -(s + 1))
        for r, s in occ
        if (r, s + 3) in occ and (r, s + 1) not in occ and (r, s + 2) not in occ
    )
    a["task-26-4-01"] = _pair(found[0], -found[1])
    ps = {1, 2, 3, 7, 8, 9, 10, 15, 16}
    lengths = []
    for p in (p for p in ps if p - 1 not in ps):
        q = p
        while q + 1 in ps:
            q += 1
        lengths.append(q - p + 1)
    a["task-26-4-02"] = _pair(max(lengths), sum(x >= 3 for x in lengths))
    lights = {1, 2, 5, 6, 7, 11, 12}
    line_of = {}
    for p in sorted(lights):  # a light point joins the line of a light point up to 3 left
        near = [q for q in range(p - 3, p) if q in lights]
        line_of[p] = line_of[near[-1]] if near else p
    a["task-26-4-04"] = str(max(p - line_of[p] + 1 for p in lights))
    pts = (1, 6, 8, 15, 30, 33)
    a["task-26-4-05"] = str(sum(all(abs(p - q) > 3 for q in pts if q != p) for p in pts))
    column = []
    for r in range(1, 11):
        if r not in {3, 7}:
            before = 0
            while r - before - 1 >= 1 and r - before - 1 not in {3, 7}:
                before += 1
            column.append((before, -r))
    a["task-26-4-06"] = _pair(-max(column)[1], max(column)[0])
    hall = _ints("26-8.txt")
    taken = {(r[0], r[1]) for r in hall[1:]}
    best = max(
        (r, -(s + 1))
        for r, s in taken
        if (r, s + 5) in taken and all((r, s + d) not in taken for d in range(1, 5))
    )
    a["task-26-4-08"] = _pair(best[0], -best[1])
    lit: dict[int, set[int]] = {}
    for r, p in _ints("26-9.txt")[1:]:
        lit.setdefault(r, set()).add(p)
    a["task-26-4-09"] = _pair(
        *max(
            (sum(1 for p in s if p - 1 not in s and p + 1 in s and p + 2 in s), r)
            for r, s in lit.items()
        )
    )
    iso = max(
        (sum(1 for p in s if not any(q in s for q in range(p - 4, p + 5) if q != p)), -r)
        for r, s in lit.items()
    )
    a["task-26-4-10"] = _pair(iso[0], -iso[1])
    # subtopic 5
    m1 = [(1, 3), (2, 6), (3, 5), (5, 8), (9, 15), (12, 16)]
    gap = lambda c: c[-1][0] - c[-2][1]  # noqa: E731
    a["task-26-5-01"] = _pair(*_schedule_brute(m1, 0, gap))
    m2 = [(0, 20), (1, 3), (3, 5), (5, 7)]
    first = min(m2)  # the earliest start blocks every meeting that starts before it ends
    by_start = 1 + sum(1 for s, f in m2 if s >= first[1])
    a["task-26-5-02"] = _pair(_schedule_brute(m2, 0, gap)[0], by_start)
    a["task-26-5-03"] = _pair(*_schedule_brute(m1, 1, gap))
    m4 = [(s, s + d) for s, d in [(1, 4), (5, 2), (6, 5), (8, 3), (12, 2)]]
    k, pause = _schedule_brute(m4, 0, gap)
    a["task-26-5-04"] = _pair(k, pause, _schedule_brute(m4, 0, lambda c: c[-1][1])[1])
    load = _load([(2, 6), (4, 9), (10, 12), (11, 15), (20, 22)], 24)
    a["task-26-5-05"] = _pair(sum(x > 0 for x in load), _idle_runs(load), load.count(0))
    load = _load([(1, 6), (2, 4), (4, 8), (5, 9)], 10)
    a["task-26-5-06"] = _pair(max(load), load.count(max(load)))
    meet = [(r[0], r[1]) for r in _ints("26-10.txt")[1:]]
    a["task-26-5-08"] = _pair(*_schedule_dp(meet, 10, lambda s, f, e: s - e))
    jobs = [(r[0], r[1]) for r in _ints("26-11.txt")[1:]]
    # an idle second [t, t + 1) is covered by no task: touching tasks leave no gap
    load = _load(jobs, 86400)
    a["task-26-5-09"] = _pair(_idle_runs(load), load.count(0))
    a["task-26-5-10"] = _pair(max(load), load.count(max(load)))
    # subtopic 6
    a["task-26-6-01"] = _pair(*_lockers_heap(2, [(1, 5), (2, 4), (3, 7), (4, 8), (5, 6)], True))
    req = [(0, 10), (2, 6), (4, 9), (6, 12), (9, 11), (10, 15)]
    a["task-26-6-02"] = _pair(*_lockers_heap(3, req, False))
    w = _one_window([(0, 5), (2, 3), (4, 4), (12, 2)], 2)
    a["task-26-6-03"] = _pair(sum(x is not None for x in w), w.count(None))
    a["task-26-6-04"] = _pair(*_one_window([(0, 5), (2, 3), (4, 4), (12, 2)], 10**9))
    room = [10, 6, 8]
    aside = []
    for part in [6, 9, 3, 5, 4]:
        fits = [i for i in range(3) if room[i] >= part]
        if fits:
            room[fits[0]] -= part
        else:
            aside.append(part)
    a["task-26-6-06"] = _pair(5 - len(aside), *aside)
    lk = _ints("26-12.txt")
    a["task-26-6-08"] = _pair(*_lockers_heap(lk[0][0], [(r[0], r[1]) for r in lk[2:]], True))
    by_window: dict[int, list[tuple[int, int]]] = {}
    for arrive, d, win in sorted(_ints("26-13.txt")[1:]):
        by_window.setdefault(win, []).append((arrive, d))
    waits = [_one_window(lst, 15) for lst in by_window.values()]
    a["task-26-6-09"] = _pair(
        max(sum(x is not None for x in w) for w in waits), sum(w.count(None) for w in waits)
    )
    log = _rows("26-14.txt")
    cap = int(log[0][1])
    recs = sorted(
        (sum(int(x) * m for x, m in zip(t.split(":"), (3600, 60, 1), strict=True)), int(c), int(v))
        for t, c, v in log[1:]
    )
    totals = Counter()
    for _, c, v in recs:
        totals[c] += v
    client = min(c for c in totals if totals[c] == max(totals.values()))
    mem, copies = 0, []
    for t, _, v in recs:
        if mem + v > cap:
            copies.append((t, mem))
            mem = 0
        mem += v
    morning = sorted((u for t, u in copies if t < 43200), reverse=True)
    a["task-26-6-10"] = _pair(client, sum(morning[:2]))
    # subtopic 7
    a["task-26-7-01"] = str(sum(x + y <= 14 for x, y in combinations([2, 5, 7, 9, 12], 2)))
    nums = [2, 4, 6, 9, 10, 14]
    avgs = [
        (x + y) // 2
        for x, y in combinations(nums, 2)
        if x % 2 == 0 == y % 2 and (x + y) // 2 in nums
    ]
    a["task-26-7-02"] = _pair(len(avgs), max(avgs))
    nums = [3, 5, 8, 13, 21]
    a["task-26-7-03"] = str(
        sum((x + y) % 2 == 1 and x + y in nums for x, y in combinations(nums, 2))
    )
    vals = [5, 1, 9, 12, 2, 7, 13]
    a["task-26-7-04"] = str(max(sum(lo <= v <= lo + 4 for v in vals) for lo in vals))
    a["task-26-7-05"] = _pair(*_climber_dp([30, 28, 23, 21, 17, 15, 9, 8], 3, 6, 2))
    nums15 = _column("26-15.txt")
    present = set(nums15)
    count = top = 0
    for t in nums15:  # pairs by their sum t: x even, y = t − x odd
        for x in nums15:
            if x % 2 == 0 and (t - x) % 2 == 1 and t - x in present:
                count += 1
                top = max(top, t)
    a["task-26-7-07"] = _pair(count, top)
    a["task-26-7-08"] = _pair(*_climber_dp(_column("26-16.txt"), 60, 100, 5))
    # subtopic 8
    col = [(40, 0), (37, 1), (33, 1), (31, 0), (26, 0), (24, 1), (20, 0), (18, 1), (12, 1)]
    a["task-26-8-01"] = _pair(*_alt_brute(col, lambda k: 4, True))
    mat = [
        (10, 0), (11, 1), (13, 1), (14, 0), (17, 0), (18, 1),
        (22, 1), (23, 0), (27, 0), (28, 1), (33, 1),
    ]  # fmt: skip
    a["task-26-8-02"] = _pair(*_alt_brute(mat, lambda k: 1 + k, False))
    plain = [(x, 0) for x in (3, 5, 6, 9, 11, 12, 13, 17)]
    a["task-26-8-03"] = str(_min_blocks(plain, lambda u, v: v[0] - u[0] >= 4))
    sizes = [5, 7, 8, 9, 12, 16]
    for r in range(len(sizes), 0, -1):
        fits = [sorted(c, reverse=True) for c in combinations(sizes, r) if sum(c) <= 33]
        if fits:
            a["task-26-8-06"] = _pair(*sorted(max(fits)))
            break
    srt = sorted(boxes6)
    widest = max(bisect.bisect_left(srt, x + 7) - i for i, x in enumerate(srt))
    a["task-26-8-07"] = _pair(widest, longest)
    mats = [(r[0], r[1]) for r in _ints("26-17.txt")[1:]]
    by_mat = {m: sorted(s for s, mm in mats if mm == m) for m in (0, 1)}
    res = []
    for first_mat in (0, 1):  # the next box by bisect instead of a scan
        need, n_boxes, last_box = first_mat, 0, None
        while True:
            lst = by_mat[need]
            j = bisect.bisect_left(lst, last_box + 500 + n_boxes if last_box is not None else -1)
            if j == len(lst):
                break
            last_box, n_boxes, need = lst[j], n_boxes + 1, 1 - need
        res.append((n_boxes, -(last_box or 0)))
    a["task-26-8-08"] = _pair(max(res)[0], -max(res)[1])
    # Практика и итог
    n, m, kk = hall[0]
    best = None
    for c in range(1, kk + 1):
        run = 0
        for r in range(1, m + 1):
            if (r, c) in taken:
                run = 0
                continue
            if best is None or (run, -r) > best:
                best = (run, -r)
            run += 1
    assert best
    a["task-26-9-01"] = _pair(-best[1], best[0])
    a["task-26-9-02"] = _pair(*_schedule_dp(meet, 0, lambda s, f, e: f))
    p5_all = _column("26-5.txt")
    dear = sorted((p for p in p5_all if p > 1000), reverse=True)
    cheap_half = dear[len(dear) - len(dear) // 2 :]
    total = ceil(Fraction(sum(p5_all)) - Fraction(1, 5) * sum(cheap_half))
    a["task-26-9-03"] = _pair(total, max(cheap_half))
    longest10, _, largest10 = _chain_dp(boxes6, 10)
    a["task-26-9-04"] = _pair(longest10, largest10)
    weights = sorted(_column("26-3.txt"), reverse=True)
    containers = []
    while weights:
        load_now, rest = 0, []
        for x in weights:
            if load_now + x <= 250:
                load_now += x
            else:
                rest.append(x)
        containers.append(load_now)
        weights = rest
    a["task-26-9-05"] = _pair(len(containers), containers[-2])
    a.update(_yandex_like())
    return a


def _yandex_like() -> dict[str, str]:
    """Hand tasks after the Yandex collections, by brute force over arrangements."""
    a: dict[str, str] = {}
    prices = [120, 46, 300, 80, 16, 60, 210, 96, 40, 180, 70, 24]
    half = len(prices) // 4

    def pay(order: list[int]) -> int:
        return sum(p // 2 if i % 4 == 3 else p for i, p in enumerate(order))

    cheap, dear = sorted(prices), sorted(prices, reverse=True)
    # discounted places 4, 8, 12 take the dearest (buyer) or the cheapest (shop)
    buyer = dear[half:][:3] + [dear[0]] + dear[half:][3:6] + [dear[1]] + dear[half:][6:] + [dear[2]]
    shop = (
        cheap[half:][:3]
        + [cheap[0]]
        + cheap[half:][3:6]
        + [cheap[1]]
        + cheap[half:][6:]
        + [cheap[2]]
    )
    assert sorted(buyer) == sorted(shop) == cheap
    a["task-26-10-01"] = _pair(pay(buyer), pay(shop))
    must = [30, 25]
    rest = [18, 7, 12, 40, 9, 22]
    best = max(
        (len(c), -sum(c))
        for r in range(len(rest) + 1)
        for c in combinations(rest, r)
        if sum(must) + sum(c) <= 100
    )
    a["task-26-10-02"] = _pair(len(must) + best[0], 100 - sum(must) + best[1])
    sizes = sorted(set([3, 5, 6, 7, 7, 9, 10, 11, 12, 15]))
    runs = [
        (j - i + 1, sizes[i])
        for i in range(len(sizes))
        for j in range(i, len(sizes))
        if sizes[j] - sizes[i] == j - i
    ]
    a["task-26-10-03"] = _pair(*max(runs))
    taken = [(3, 4), (3, 8), (3, 15), (7, 2), (7, 9), (7, 13), (7, 20), (7, 24), (5, 1), (5, 5)]
    occupied = set(taken)
    spots = [
        (r, s)
        for r, _ in taken
        for s in range(1, 30)
        if all((r, s + d) not in occupied for d in range(3))
        and (r, s - 1) in occupied
        and (r, s + 3) in occupied
    ]
    row = max(r for r, _ in spots)
    a["task-26-10-04"] = _pair(row, min(s for r, s in spots if r == row))
    reqs = [(2, 9), (1, 4), (5, 8), (3, 6), (7, 12), (6, 10), (9, 14), (10, 11)]
    a["task-26-10-05"] = _pair(*_lockers_heap(3, reqs, True))
    solved = [
        (14, 7),
        (3, 2),
        (25, 7),
        (9, 5),
        (31, 2),
        (12, 2),
        (40, 5),
        (18, 5),
        (44, 7),
        (52, 2),
        (36, 5),
        (61, 9),
    ]
    totals = Counter(w for _, w in solved)
    top = max(totals.values())
    finish = {w: max(t for t, v in solved if v == w) for w in totals if totals[w] == top}
    a["task-26-10-06"] = _pair(top, min(finish, key=lambda w: finish[w]))
    return a


def _solution(task: TaskData) -> str:
    (code,) = [
        block.data.code
        for block in task.explanation
        if block.type == "code_example" and block.data.language == "python"
    ]
    return code


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(72))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [26] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-26-9-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith(("task-26-7-", "task-26-8-"))
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_tasks_of_the_retired_lesson_are_archived() -> None:
    tasks = {entry.task.id: entry.task for entry in _bank().tasks}
    for task_id in RETIRED:
        task = tasks[task_id]
        assert task.archived and not task.catalog_visible, task_id
        assert not task.lessons and not task.theory_links, task_id


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(
    answers: dict[str, str],
) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        tokens = expected.split()
        tokens[-1] = str(int(tokens[-1]) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id


def test_solution_programs_print_the_answer(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        code = _solution(task)
        with tempfile.TemporaryDirectory() as tmp:
            for usage in task.files:
                shutil.copy(BANK_DIR / "files" / usage.checksum, Path(tmp) / usage.filename)
            result = subprocess.run(
                [sys.executable, "-I", "-c", code],
                capture_output=True,
                text=True,
                check=True,
                timeout=300,
                cwd=tmp,
            )
        assert " ".join(result.stdout.split()) == answers[task_id], task_id
        assert all(len(line) <= 64 for line in code.splitlines()), task_id
