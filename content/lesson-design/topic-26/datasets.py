"""Generate the data files of topic 26 and print the answers of their tasks.

Usage: python3 -I content/lesson-design/topic-26/datasets.py [--write | --check]

Every exam-format task of the topic works on our own file, in the formats of
the exam: a header with counts and limits, then one record per line. Files are
generated from fixed seeds, so they never change. Without arguments the script
prints the answers; --write writes the files into files/; --check compares the
files on disk with the generator and fails on any difference.

A file is accepted only if the tasks on it are robust: the typical errors named
in TRAPS give a different answer (ties at a border, a sum exactly at the limit,
the best series at the end of a row …). Files are written line by line;
checks.py recomputes every answer by another method.
"""

import random
import sys
from collections.abc import Callable, Iterable
from pathlib import Path

HERE = Path(__file__).resolve().parent
FILES = HERE / "files"

# textbook file: capacity and number of files, then the sizes (subtopic 2)
TEXTBOOK = {"26.txt": [[60, 6], [8], [12], [15], [19], [22], [34]]}

Rows = list[list]


# --- generators: seed -> list of rows (header first) -----------------------------


def gen_session(rnd: random.Random) -> Rows:
    """26-1: ID and four marks 2…5."""
    n = 4000
    ids = rnd.sample(range(1, 100_000), n)
    rows: Rows = [[n]]
    for i in ids:
        marks = [rnd.choices((2, 3, 4, 5), (1, 5, 8, 6))[0] for _ in range(4)]
        rows.append([i, *marks])
    return rows


def gen_quiz(rnd: random.Random) -> Rows:
    """26-2: ID and ten scores from −5 to 5, 0 — no answer."""
    n = 3000
    ids = rnd.sample(range(1, 100_000), n)
    rows: Rows = [[n]]
    for i in ids:
        scores = []
        for q in range(10):
            cost = 1 + q // 2
            r = rnd.random()
            scores.append(cost if r < 0.55 else (-cost if r < 0.75 else 0))
        rows.append([i, *scores])
    return rows


def gen_archive(rnd: random.Random) -> Rows:
    """26-3: capacity S, count N, sizes up to 100."""
    n = 5000
    sizes = [rnd.randint(1, 100) for _ in range(n)]
    s = sorted(sizes)
    k = 2600 + rnd.randint(0, 200)
    cap = sum(s[:k]) + rnd.randint(0, s[k] - 1)
    return [[cap, n]] + [[x] for x in sizes]


def gen_shop(rnd: random.Random) -> Rows:
    """26-4: count N, money M, then price and type A or B."""
    n = 1000
    rows = [[rnd.randint(50, 3000), rnd.choice("AB")] for _ in range(n)]
    prices = sorted(p for p, _ in rows)
    money = sum(prices[:300]) + rnd.randint(0, prices[300] - 1)
    return [[n, money]] + rows


def gen_prices(rnd: random.Random) -> Rows:
    """26-5: count N, then prices of goods."""
    n = 3000
    return [[n]] + [[rnd.randint(10, 5000)] for _ in range(n)]


def gen_boxes(rnd: random.Random) -> Rows:
    """26-6: count N, then sizes up to 10 000 (with repeats)."""
    n = 10000
    return [[n]] + [[rnd.randint(1, 10000)] for _ in range(n)]


def gen_two_sets(rnd: random.Random) -> Rows:
    """26-7: count N, then two unrelated numbers per line."""
    n = 6000
    rows: Rows = [[n]]
    for _ in range(n):
        rows.append([rnd.randint(1000, 9000), rnd.randint(500, 8800)])
    return rows


def gen_hall(rnd: random.Random) -> Rows:
    """26-8: occupied seats N, rows M, seats per row K, then row and seat."""
    m, k, n = 1500, 80, 10000
    seats = set()
    while len(seats) < n:
        seats.add((rnd.randint(1, m), rnd.randint(1, k)))
    order = list(seats)
    rnd.shuffle(order)
    return [[n, m, k]] + [list(p) for p in order]


def gen_screen(rnd: random.Random) -> Rows:
    """26-9: hits N, then row and position (repeats possible)."""
    n = 30000
    rows: Rows = [[n]]
    for _ in range(n):
        rows.append([rnd.randint(1, 300), rnd.randint(1, 400)])
    return rows


def gen_meetings(rnd: random.Random) -> Rows:
    """26-10: count N, then start and finish in minutes."""
    n = 1000
    rows: Rows = [[n]]
    for _ in range(n):
        d = rnd.randint(10, 120)
        s = rnd.randint(0, 1440 - d)
        rows.append([s, s + d])
    return rows


def gen_jobs(rnd: random.Random) -> Rows:
    """26-11: count N, then start and finish in seconds of a day."""
    n = 3000
    rows: Rows = [[n]]
    for _ in range(n):
        d = rnd.randint(1, 90)
        s = rnd.randint(0, 86400 - d)
        rows.append([s, s + d])
    return rows


def gen_lockers(rnd: random.Random) -> Rows:
    """26-12: cells K, requests N, then put and take minutes."""
    k, n = 30, 1000
    rows: Rows = [[k], [n]]
    for s in rnd.sample(range(1, 1401), n):  # different times: no ties to order
        rows.append([s, min(1440, s + rnd.randint(1, 90))])
    return rows


def gen_clients(rnd: random.Random) -> Rows:
    """26-13: count N, then arrival, service time and window 1…3."""
    n = 600
    times = rnd.sample(range(0, 720), n)
    return [[n]] + [[t, rnd.randint(1, 6), rnd.randint(1, 3)] for t in times]


def gen_log(rnd: random.Random) -> Rows:
    """26-14: count N, memory K, then time HH:MM:SS, client and volume."""
    n, k = 5000, 60000
    rows: Rows = [[n, k]]
    clients = rnd.sample(range(100, 10000), 400)
    for _ in range(n):
        t = rnd.randint(0, 86399)
        stamp = f"{t // 3600:02d}:{t // 60 % 60:02d}:{t % 60:02d}"
        rows.append([stamp, rnd.choice(clients), rnd.randint(100, 5000)])
    return rows


def gen_numbers(rnd: random.Random) -> Rows:
    """26-15: count N, then different natural numbers."""
    n = 2000
    return [[n]] + [[x] for x in rnd.sample(range(1, 20001), n)]


def gen_heights(rnd: random.Random) -> Rows:
    """26-16: count N, then heights of camps (repeats possible)."""
    n = 20000
    return [[n]] + [[rnd.randint(1, 1_000_000)] for _ in range(n)]


def gen_materials(rnd: random.Random) -> Rows:
    """26-17: count N, then size and material 0 or 1."""
    n = 20000
    return [[n]] + [[rnd.randint(1, 1_000_000), rnd.randint(0, 1)] for _ in range(n)]


# name: (generator, first seed)
SPECS: dict[str, tuple[Callable[[random.Random], Rows], int]] = {
    "26-1.txt": (gen_session, 101),
    "26-2.txt": (gen_quiz, 201),
    "26-3.txt": (gen_archive, 301),
    "26-4.txt": (gen_shop, 401),
    "26-5.txt": (gen_prices, 501),
    "26-6.txt": (gen_boxes, 601),
    "26-7.txt": (gen_two_sets, 701),
    "26-8.txt": (gen_hall, 801),
    "26-9.txt": (gen_screen, 901),
    "26-10.txt": (gen_meetings, 1001),
    "26-11.txt": (gen_jobs, 1101),
    "26-12.txt": (gen_lockers, 1201),
    "26-13.txt": (gen_clients, 1301),
    "26-14.txt": (gen_log, 1401),
    "26-15.txt": (gen_numbers, 1501),
    "26-16.txt": (gen_heights, 1601),
    "26-17.txt": (gen_materials, 1701),
}


# --- solutions in the lesson's terms ----------------------------------------------


def body(rows: Rows, skip: int = 1) -> Rows:
    return rows[skip:]


def session_order(rows: Rows) -> Rows:
    def key(r):
        twos = r[1:].count(2)
        return (twos, -sum(r[1:]) if twos == 0 else 0, r[0])

    return sorted(body(rows), key=key)


def t1_9(rows):
    order = session_order(rows)
    k = len(order) * 15 // 100
    last = order[k - 1]
    return last[0], sum(sum(r[1:]) == sum(last[1:]) and 2 not in r[1:] for r in order)


def quiz_table(rows):
    table = []
    for r in body(rows):
        sc = r[1:]
        table.append((sum(sc), sum(x != 0 for x in sc), r[0]))
    table.sort(key=lambda t: (-t[0], t[1], t[2]))
    return table


def t1_10(rows):
    table = quiz_table(rows)
    k = len(table) * 20 // 100
    key = table[k - 1][:2]
    while k < len(table) and table[k][:2] == key:
        k += 1
    return k, table[k][2]


def archive(cap, sizes):
    a = sorted(sizes)
    used = count = 0
    for x in a:
        if used + x > cap:
            break
        used += x
        count += 1
    limit = cap - (used - a[count - 1])
    largest = a[count - 1]
    for x in a[count - 1 :]:
        if x > limit:
            break
        largest = x
    return count, largest


def t2_8(rows):
    return archive(rows[0][0], [r[0] for r in body(rows)])


def t2_9(rows):
    money = rows[0][1]
    a = sorted(p for p, t in body(rows) if t == "A")
    b = sorted(p for p, t in body(rows) if t == "B")
    spent = count = 0
    for p in sorted(a + b):
        if spent + p > money:
            break
        spent += p
        count += 1
    pa, pb = [0], [0]
    for p in a:
        pa.append(pa[-1] + p)
    for p in b:
        pb.append(pb[-1] + p)
    best = None
    for ca in range(count + 1):
        cb = count - ca
        if ca <= len(a) and cb <= len(b) and pa[ca] + pb[cb] <= money:
            best = (ca, money - pa[ca] - pb[cb])
    return best


def t2_10(rows):
    p = sorted((r[0] for r in body(rows)), reverse=True)
    free = p[2::3]
    return sum(p) - sum(free), free[0]


def chain_outside_in(sizes, gap):
    sel = []
    for x in sorted(sizes, reverse=True):
        if not sel or sel[-1] - x >= gap:
            sel.append(x)
    return sel


def t3_8(rows):
    sel = chain_outside_in([r[0] for r in body(rows)], 7)
    return len(sel), sel[-1]


def goods_to_containers(goods, cont):
    g, c = sorted(goods), sorted(cont)
    j = count = 0
    for x in g:
        while j < len(c) and c[j] < x:
            j += 1
        if j == len(c):
            break
        count += 1
        j += 1
    return count, g, c


def t3_9(rows):
    goods = [r[0] for r in body(rows)]
    cont = [r[1] for r in body(rows)]
    count, g, c = goods_to_containers(goods, cont)
    # k − 1 lightest goods take their smallest containers; the last good is the
    # heaviest one that fits into the largest container left
    used, j = [False] * len(c), 0
    for x in g[: count - 1]:
        while c[j] < x:
            j += 1
        used[j] = True
        j += 1
    room = max(c[i] for i in range(len(c)) if not used[i])
    return count, max(x for x in g[count - 1 :] if x <= room)


def pair_parts(a, b, d):
    a, b = sorted(a, reverse=True), sorted(b, reverse=True)
    i = j = count = profit = 0
    while i < len(a) and j < len(b):
        if a[i] > b[j] + d:
            i += 1
        elif b[j] > a[i] + d:
            j += 1
        else:
            count += 1
            profit += a[i] + b[j]
            i += 1
            j += 1
    return count, profit


def t3_10(rows):
    return pair_parts([r[0] for r in body(rows)], [r[1] for r in body(rows)], 15)


def hall_rows(rows):
    d = {}
    for r, s in body(rows):
        d.setdefault(r, set()).add(s)
    return d


def t4_8(rows):
    d = hall_rows(rows)
    for r in sorted(d, reverse=True):
        s = sorted(d[r])
        for x, y in zip(s, s[1:], strict=False):
            if y - x - 1 == 4:
                return r, x + 1
    return None


def screen_rows(rows):
    d = {}
    for r, p in body(rows):
        d.setdefault(r, set()).add(p)
    return d


def runs(positions):
    out, cur, prev = [], 0, None
    for p in sorted(positions):
        if prev is not None and p == prev + 1:
            cur += 1
        else:
            if cur:
                out.append(cur)
            cur = 1
        prev = p
    if cur:
        out.append(cur)
    return out


def t4_9(rows):
    best = (0, 0)
    for r, s in screen_rows(rows).items():
        lines = sum(x >= 3 for x in runs(s))
        if (lines, r) > best:
            best = (lines, r)
    return best


def isolated(positions, dist):
    p = sorted(positions)
    count = 0
    for i in range(len(p)):
        left = i == 0 or p[i] - p[i - 1] > dist
        right = i == len(p) - 1 or p[i + 1] - p[i] > dist
        count += left and right
    return count


def t4_10(rows):
    best = None
    for r, s in screen_rows(rows).items():
        cand = (isolated(s, 4), -r)
        if best is None or cand > best:
            best = cand
    assert best
    return best[0], -best[1]


def greedy_meetings(meetings, pause):
    sel = []
    for s, f in sorted(meetings, key=lambda x: (x[1], x[0])):
        if not sel or s >= sel[-1][1] + pause:
            sel.append((s, f))
    return sel


def t5_8(rows):
    m = [tuple(r) for r in body(rows)]
    sel = greedy_meetings(m, 10)
    pf = sel[-2][1]
    return len(sel), max(s for s, f in m if s >= pf + 10) - pf


def merged(intervals):
    out = []
    for s, f in sorted(intervals):
        if not out or s > out[-1][1]:
            out.append([s, f])
        else:
            out[-1][1] = max(out[-1][1], f)
    return out


def t5_9(rows):
    cursor = count = idle = 0
    for s, f in merged(body(rows)):
        if s > cursor:
            count += 1
            idle += s - cursor
        cursor = f
    if cursor < 86400:
        count += 1
        idle += 86400 - cursor
    return count, idle


def t5_10(rows):
    changes = {0: 0, 86400: 0}
    for s, f in body(rows):
        changes[s] = changes.get(s, 0) + 1
        changes[f] = changes.get(f, 0) - 1
    times = sorted(changes)
    cur = top = total = 0
    for i in range(len(times) - 1):
        cur += changes[times[i]]
        d = times[i + 1] - times[i]
        if cur > top:
            top, total = cur, d
        elif cur == top:
            total += d
    return top, total


def lockers(rows, strict=True):
    k = rows[0][0]
    free_at = [0] * k
    accepted, last = 0, None
    for s, f in sorted((tuple(r) for r in rows[2:]), key=lambda r: r[0]):
        for i in range(k):
            if (free_at[i] < s) if strict else (free_at[i] <= s):
                free_at[i] = f
                accepted += 1
                last = i + 1
                break
    return accepted, last


def t6_8(rows):
    return lockers(rows)


def t6_9(rows):
    free = {1: 0, 2: 0, 3: 0}
    served = {1: 0, 2: 0, 3: 0}
    gone = 0
    for a, d, w in sorted(tuple(r) for r in body(rows)):
        start = max(a, free[w])
        if start - a > 15:
            gone += 1
            continue
        free[w] = start + d
        served[w] += 1
    return max(served.values()), gone


def seconds(stamp):
    h, m, s = map(int, stamp.split(":"))
    return h * 3600 + m * 60 + s


def t6_10(rows):
    cap = rows[0][1]
    recs = sorted((seconds(t), c, v) for t, c, v in body(rows))
    total = {}
    for _, c, v in recs:
        total[c] = total.get(c, 0) + v
    best = max(total, key=lambda c: (total[c], -c))
    used, copies = 0, []
    for t, _, v in recs:
        if used + v > cap:
            copies.append((t, used))
            used = 0
        used += v
    morning = sorted(u for t, u in copies if t < 12 * 3600)
    return best, morning[-1] + morning[-2]


def t7_7(rows):
    a = [r[0] for r in body(rows)]
    values = set(a)
    even = [x for x in a if x % 2 == 0]
    odd = [x for x in a if x % 2]
    count, best = 0, 0
    for x in even:
        for y in odd:
            if x + y in values:
                count += 1
                best = max(best, x + y)
    return count, best


def climb(heights, normal, special, allowed):
    h = sorted(set(heights), reverse=True)
    left = used = 0
    best = (0, 0)
    for right in range(len(h)):
        if right:
            gap = h[right - 1] - h[right]
            if gap > special:
                left, used = right, 0
            elif gap > normal:
                used += 1
        while used > allowed:
            if h[left] - h[left + 1] > normal:
                used -= 1
            left += 1
        best = max(best, (right - left + 1, h[right]))
    return best


def t7_8(rows):
    return climb([r[0] for r in body(rows)], 60, 100, 5)


def blocks(sizes, gap):
    a = sorted(sizes)
    left = best = 0
    for right in range(len(a)):
        while a[right] - a[left] >= gap:
            left += 1
        best = max(best, right - left + 1)
    return best


def t8_6(rows):
    sizes = [r[0] for r in body(rows)]
    return blocks(sizes, 7), len(chain_outside_in(sizes, 7))


def alternate(boxes, base):
    boxes = sorted(boxes)
    best = (0, 0)
    for first in (0, 1):
        need, count, last = first, 0, None
        for size, mat in boxes:
            if mat != need:
                continue
            if last is None or size - last >= base + count:
                count += 1
                last = size
                need = 1 - need
        if last is not None and (count > best[0] or (count == best[0] and last < best[1])):
            best = (count, last)
    return best


def t8_7(rows):
    return alternate([tuple(r) for r in body(rows)], 500)


def f_1(rows):
    """Seat whose column in front of it is free the longest (rows near the stage first)."""
    n, m, k = rows[0]
    col = {}
    for r, s in body(rows):
        col.setdefault(s, set()).add(r)
    best = None
    for s in range(1, k + 1):
        prev = 0
        for o in sorted(col.get(s, set())) + [m + 1]:
            if o - prev >= 2:
                cand = (o - prev - 2, -(o - 1))
                if best is None or cand > best:
                    best = cand
            prev = o
    assert best
    return -best[1], best[0]


def f_2(rows):
    m = [tuple(r) for r in body(rows)]
    sel = greedy_meetings(m, 0)
    pf = sel[-2][1]
    return len(sel), max(f for s, f in m if s >= pf)


def f_3(rows):
    prices = [r[0] for r in body(rows)]
    big = sorted(p for p in prices if p > 1000)
    disc = big[: len(big) // 2]
    rest = sum(prices) - sum(disc)
    return rest + (4 * sum(disc) + 4) // 5, max(disc)


def chain_inside_out(sizes, gap):
    sel = []
    for x in sorted(sizes):
        if not sel or x - sel[-1] >= gap:
            sel.append(x)
    return sel


def f_4(rows):
    sel = chain_inside_out([r[0] for r in body(rows)], 10)
    return len(sel), sel[-1]


def pack(weights, cap):
    rest = sorted(weights, reverse=True)
    loads = []
    while rest:
        nxt, load = [], 0
        for w in rest:
            if load + w <= cap:
                load += w
            else:
                nxt.append(w)
        loads.append(load)
        rest = nxt
    return loads


def f_5(rows):
    loads = pack([r[0] for r in body(rows)], 250)
    return len(loads), loads[-2]


TASKS: dict[str, tuple[str, Callable]] = {
    "1.9": ("26-1.txt", t1_9),
    "1.10": ("26-2.txt", t1_10),
    "2.8": ("26-3.txt", t2_8),
    "2.9": ("26-4.txt", t2_9),
    "2.10": ("26-5.txt", t2_10),
    "3.8": ("26-6.txt", t3_8),
    "3.9": ("26-7.txt", t3_9),
    "3.10": ("26-7.txt", t3_10),
    "4.8": ("26-8.txt", t4_8),
    "4.9": ("26-9.txt", t4_9),
    "4.10": ("26-9.txt", t4_10),
    "5.8": ("26-10.txt", t5_8),
    "5.9": ("26-11.txt", t5_9),
    "5.10": ("26-11.txt", t5_10),
    "6.8": ("26-12.txt", t6_8),
    "6.9": ("26-13.txt", t6_9),
    "6.10": ("26-14.txt", t6_10),
    "7.7": ("26-15.txt", t7_7),
    "7.8": ("26-16.txt", t7_8),
    "8.6": ("26-6.txt", t8_6),
    "8.7": ("26-17.txt", t8_7),
    "9.1": ("26-8.txt", f_1),
    "9.2": ("26-10.txt", f_2),
    "9.3": ("26-5.txt", f_3),
    "9.4": ("26-6.txt", f_4),
    "9.5": ("26-3.txt", f_5),
}


# --- typical errors: each must change the answer ------------------------------------


def trap_reverse_all(rows):
    """1.9 with reverse=True for the whole key: ties by ID go the wrong way."""
    passed = sorted(
        (r for r in body(rows) if 2 not in r[1:]),
        key=lambda r: (sum(r[1:]), r[0]),
        reverse=True,
    )
    last = passed[len(body(rows)) * 15 // 100 - 1]
    return last[0], sum(sum(r[1:]) == sum(last[1:]) for r in passed)


def trap_no_ties(rows):
    """1.10 without «и все с такими же показателями»."""
    table = quiz_table(rows)
    k = len(table) * 20 // 100
    return k, table[k][2]


def trap_no_swap(rows):
    """2.8: the largest of the k smallest instead of the largest that fits."""
    a = sorted(r[0] for r in body(rows))
    count, _ = t2_8(rows)
    return count, a[count - 1]


def trap_cheapest_only(rows):
    """2.9: buy the cheapest items without maximising A."""
    money = rows[0][1]
    spent = count = ca = 0
    for p, t in sorted(body(rows)):
        if spent + p > money:
            break
        spent += p
        count += 1
        ca += t == "A"
    return ca, money - spent


def trap_file_triples(rows):
    """2.10: triples in the order of the file."""
    p = [r[0] for r in body(rows)]
    free = [min(p[i : i + 3]) for i in range(0, len(p) - 2, 3)]
    return sum(p) - sum(free), max(free)


def trap_inside_out(rows):
    """3.8 built from the smallest box."""
    sel = chain_inside_out([r[0] for r in body(rows)], 7)
    return len(sel), sel[0]


def trap_same_line(rows):
    """3.9: a good only into the container of its own line."""
    ok = [g for g, c in body(rows) if g <= c]
    return len(ok), max(ok)


def trap_gap_k(rows):
    """4.8 with y − x == 4 instead of y − x − 1 == 4."""
    d = hall_rows(rows)
    for r in sorted(d, reverse=True):
        s = sorted(d[r])
        for x, y in zip(s, s[1:], strict=False):
            if y - x == 4:
                return r, x + 1
    return None


def trap_last_run(rows):
    """4.9 forgetting the series that ends the row."""
    best = (0, 0)
    for r, s in screen_rows(rows).items():
        lines = sum(x >= 3 for x in runs(s)[:-1])
        if (lines, r) > best:
            best = (lines, r)
    return best


def trap_finish(rows):
    """5.8 with the last meeting chosen by the latest finish."""
    m = [tuple(r) for r in body(rows)]
    sel = greedy_meetings(m, 10)
    pf = sel[-2][1]
    last = max((f, s) for s, f in m if s >= pf + 10)
    return len(sel), last[1] - pf


def trap_no_edges(rows):
    """5.9 without the idle time before the first and after the last job."""
    m = merged(body(rows))
    gaps = [b[0] - a[1] for a, b in zip(m, m[1:], strict=False)]
    return len(gaps), sum(gaps)


def trap_not_strict(rows):
    """6.8 taking a cell in the very minute it is freed."""
    return lockers(rows, strict=False)


TRAPS = {
    "1.9": trap_reverse_all,
    "1.10": trap_no_ties,
    "2.8": trap_no_swap,
    "2.9": trap_cheapest_only,
    "2.10": trap_file_triples,
    "3.8": trap_inside_out,
    "3.9": trap_same_line,
    "4.8": trap_gap_k,
    "4.9": trap_last_run,
    "5.8": trap_finish,
    "5.9": trap_no_edges,
    "6.8": trap_not_strict,
}


def robust(name: str, rows: Rows) -> bool:
    for label, (fname, solve) in TASKS.items():
        if fname != name:
            continue
        try:
            answer = solve(rows)
        except (IndexError, ValueError, AssertionError):
            return False
        if answer is None:
            return False
        if label in TRAPS and TRAPS[label](rows) == answer:
            return False
    return True


def build(name: str) -> tuple[int, Rows]:
    gen, seed = SPECS[name]
    while True:
        rows = gen(random.Random(seed))
        if robust(name, rows):
            return seed, rows
        seed += 1


def lines(rows: Rows) -> Iterable[str]:
    for r in rows:
        yield " ".join(str(x) for x in r) + "\n"


def main() -> int:
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    built = {name: build(name) for name in SPECS}
    for name, (seed, _) in built.items():
        print(f"{name}: seed {seed}")
    for label, (name, solve) in TASKS.items():
        print(f"{label} [{name}]: {solve(built[name][1])}")
    expected = {**{n: rows for n, (_, rows) in built.items()}, **TEXTBOOK}
    bad = 0
    for name, rows in expected.items():
        path = FILES / name
        if mode == "--write":
            FILES.mkdir(exist_ok=True)
            with path.open("w", encoding="utf-8") as f:
                f.writelines(lines(rows))
        elif mode == "--check":
            try:
                with path.open(encoding="utf-8") as f:
                    same = all(a == b for a, b in zip(f, lines(rows), strict=True))
            except (OSError, ValueError):
                same = False
            if not same:
                bad += 1
                print(f"DIFFERS {name}")
    if mode == "--check":
        print("files match the generator" if not bad else f"{bad} files differ")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
