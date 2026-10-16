"""Independent recomputation of every task answer in topic 22.

Usage: python3 -I content/lesson-design/topic-22/checks.py

The lessons build the early schedule with formulas and read answers from it.
Here every answer is recomputed by separate code: the books are read directly
from their XML (no openpyxl, no datasets.py), the early schedule is found by
relaxation until nothing changes, activity is counted millisecond by
millisecond, late starts — by trying every start of a process with all other
processes kept as late as possible, and resource schedules — by an event
simulation. Every expected answer must appear verbatim in the answers of its
page. Exit code 1 if any check fails.
"""

import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

D = Path(__file__).resolve().parent
NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"

checks: list[tuple[str, str, bool]] = []


def answers(f: str) -> str:
    text = (D / f).read_text(encoding="utf-8")
    tail = text.split("**Ответы для проверки:**", 1)[1]
    return re.split(r"\n\n(?:\*\*Что дальше|<details)", tail)[0]


def expect(f: str, needle: str) -> None:
    checks.append((f, needle, needle in answers(f)))


def same(label: str, a: object, b: object) -> None:
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def read_book(name: str) -> list[tuple[int, int, tuple[int, ...]]]:
    with zipfile.ZipFile(D / "files" / f"{name}.xlsx") as z:
        strings = []
        if "xl/sharedStrings.xml" in z.namelist():
            for si in ET.fromstring(z.read("xl/sharedStrings.xml")).iter(f"{NS}si"):
                strings.append("".join(t.text or "" for t in si.iter(f"{NS}t")))
        sheet = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
    rows = []
    for row in sheet.iter(f"{NS}row"):
        vals = []
        for c in row.iter(f"{NS}c"):
            v = c.find(f"{NS}v")
            text = (v.text or "") if v is not None else ""
            if c.get("t") == "s":
                text = strings[int(text)]
            elif c.get("t") == "inlineStr":
                text = "".join(t.text or "" for t in c.iter(f"{NS}t"))
            vals.append(text)
        rows.append(vals)
    out = []
    for vals in rows[1:]:
        deps = tuple(int(x) for x in str(vals[2]).split(";") if x.strip() and x.strip() != "0")
        out.append((int(float(vals[0])), int(float(vals[1])), deps))
    return out


def early(procs):
    s = {i: 0 for i, _, _ in procs}
    d = {i: x for i, x, _ in procs}
    changed = True
    while changed:
        changed = False
        for i, _, deps in procs:
            want = max((s[j] + d[j] for j in deps), default=0)
            if want != s[i]:
                s[i], changed = want, True
    return {i: (s[i], s[i] + d[i]) for i in s}


def total(procs) -> int:
    return max(f for _, f in early(procs).values())


def working(sched, t: int) -> int:
    return sum(1 for s, f in sched.values() if s <= t < f)


def latest_start(procs, i: int) -> int:
    """Largest start of i such that a valid schedule still ends at the minimum."""
    best = total(procs)
    d = {k: x for k, x, _ in procs}
    rec = {k: [r for r, _, deps in procs if k in deps] for k, _, _ in procs}

    def latest_finish(k, memo={}):  # noqa: B006 — local memo per call chain
        key = (id(procs), k)
        if key not in memo:
            memo[key] = min((latest_finish(r) - d[r] for r in rec[k]), default=best)
        return memo[key]

    lo = early(procs)[i][0]
    s = lo
    while s + 1 + d[i] <= latest_finish(i):
        s += 1
    return s


def simulate(procs, places, rule="id", exclusive=()):
    d = {i: x for i, x, _ in procs}
    deps = {i: set(p) for i, _, p in procs}
    done, running, ready_since, start, t = {}, {}, {}, {}, 0
    while len(done) < len(d):
        for i, f in list(running.items()):
            if f <= t:
                done[i] = f
                del running[i]
        for i in d:
            if i not in start and i not in ready_since and all(j in done for j in deps[i]):
                ready_since[i] = t
        cand = [i for i in ready_since if i not in start]
        cand.sort(key=(lambda i: i) if rule == "id" else (lambda i: (ready_since[i], i)))
        for i in cand:
            if len(running) >= places:
                break
            if any(i in pair and (set(pair) - {i}) & set(running) for pair in exclusive):
                continue
            start[i] = t
            running[i] = t + d[i]
        nxt = [f for f in running.values() if f > t]
        t = min(nxt) if nxt else t + 1
    return start, max(done.values())


P8 = [
    (1, 4, ()),
    (2, 6, ()),
    (3, 3, (1,)),
    (4, 2, (1, 2)),
    (5, 5, (2,)),
    (6, 4, (3, 4)),
    (7, 2, (4, 5)),
    (8, 1, (6, 7)),
]
P7 = [
    (1, 3, ()),
    (2, 8, ()),
    (3, 2, (1,)),
    (4, 5, (1, 3)),
    (5, 4, (2, 4)),
    (6, 6, (3,)),
    (7, 1, (5, 6)),
]
S8 = early(P8)
S7 = early(P7)

# --- subtopic 1 ------------------------------------------------------------------
F1 = "01-process-i-zavisimost.md"
same("1.7", total([(1, 5, ()), (2, 3, ()), (3, 4, (1, 2))]), 9)
expect(F1, "7. 9 мс")
same("1.3-4", (max(5, 9), total([(1, 5, ()), (2, 9, (1,))])), (9, 14))

# --- subtopic 2 ------------------------------------------------------------------
F2 = "02-rannee-raspisanie.md"
same(
    "2 main",
    (total(P8), [S8[i] for i in range(1, 9)]),
    (14, [(0, 4), (0, 6), (4, 7), (6, 8), (6, 11), (8, 12), (11, 13), (13, 14)]),
)
same("2.1", total([(1, 8, ()), (2, 5, ()), (3, 3, (1, 2))]), 11)
expect(F2, "1. 11 мс")
pr1 = [(1, 4, ()), (2, 7, ()), (3, 2, (1, 2)), (4, 3, (3,))]
same("2.3", (early(pr1)[3][0], total(pr1)), (7, 12))
expect(F2, "3. Начало процесса 3 — 7 мс, общее время 12 мс.")
pr2 = [(20, 3, (10,)), (40, 4, (20,)), (10, 5, ()), (30, 8, ()), (50, 2, (30, 40))]
same("2.4", (early(pr2)[50][0], total(pr2)), (12, 14))
expect(F2, "4. Начало процесса 50 — 12 мс, общее время 14 мс")
v5 = [(i, 6 if i == 5 else d, p) for i, d, p in P8]
v3 = [(i, 5 if i == 3 else d, p) for i, d, p in P8]
same("2.5", (total(v5), total(v3)), (15, 14))
expect(F2, "5. 15 мс")
same("2 B7", total([(i, 7 if i == 6 else d, p) for i, d, p in P8]), 16)
same("2.7", total(P7), 15)
expect(F2, "7. 15.")

# --- subtopic 3 ------------------------------------------------------------------
F3 = "03-excel-po-id.md"
same("3.7", total(read_book("22-1")), 69)
expect(F3, "7. 69.")

# --- subtopic 4 ------------------------------------------------------------------
F4 = "04-kogo-schitat.md"
same("4 main", (working(S8, 6), working(S8, 7), sorted(f for _, f in S8.values())[4]), (3, 2, 11))
same("4.2", working(S8, 4), 2)
expect(F4, "2. 2")
same("4.3", sum(1 for _, f in S8.values() if f <= 11), 5)
expect(F4, "3. 5")
same("4.4", sorted(f for _, f in S8.values())[5], 12)
expect(F4, "4. 12.")
win = [i for i, (s, f) in S8.items() if s >= 4 and f <= 12]
same("4.5", (len(win), sum(win)), (4, 18))
expect(F4, "5. 4 процесса, сумма ID 18.")
same("4.6", working(S8, 11), 2)
expect(F4, "6. 2")
same("4.7", working(S7, 9), 2)
expect(F4, "7. 2")
same("4.8", sorted(f for _, f in S7.values())[4], 11)
expect(F4, "8. 11.")

# --- subtopic 5 ------------------------------------------------------------------
F5 = "05-parallelnost.md"


def runs(sched, test, horizon):
    best = cur = 0
    for t in range(horizon):
        cur = cur + 1 if test(working(sched, t)) else 0
        best = max(best, cur)
    return best


T8 = total(P8)
same(
    "5 main",
    (
        max(working(S8, t) for t in range(T8)),
        runs(S8, lambda c: c == 3, T8),
        runs(S8, lambda c: c == 2, T8),
        runs(S8, lambda c: c >= 2, T8),
    ),
    (3, 1, 6, 12),
)
same("5 sum units", sum(working(S8, t) for t in range(T8)), sum(d for _, d, _ in P8))
same("5.3", (T8, 3, 1, working(S8, 7)), (14, 3, 1, 2))
expect(F5, "3. Общее время 14, пик 3, отрезок 1 мс, в момент 7 работают 2 процесса.")
same("5.4", runs(S8, lambda c: c <= 1, T8), 2)
expect(F5, "4. 2 мс")
s6, f6 = S8[6]
same("5.5", max(working({k: v for k, v in S8.items() if k != 6}, t) for t in range(s6, f6)), 1)
expect(F5, "5. 1")
same("5.6", max(0, min(S8[3][1], S8[4][1]) - max(S8[3][0], S8[4][0])), 1)
expect(F5, "6. 1 мс")
T7 = total(P7)
pk7 = max(working(S7, t) for t in range(T7))
same("5.7", (pk7, runs(S7, lambda c: c == pk7, T7)), (3, 3))
expect(F5, "7. 3 процесса, 3 мс")
s5 = {k: v for k, v in S8.items() if k != 5}
same("5 with 5", max(working(s5, t) for t in range(S8[5][0], S8[5][1])), 2)

# --- subtopic 6 ------------------------------------------------------------------
F6 = "06-sdvigi-i-zapas.md"
P4 = [(1, 4, ()), (2, 4, ()), (3, 2, (2,)), (4, 4, (2,))]
same("6.1", (latest_start(P4, 1), latest_start(P4, 2) - early(P4)[2][0]), (4, 0))
expect(F6, "1. Позднее начало процесса 1 — 4; у процесса 2 запаса нет.")
LS8 = {i: latest_start(P8, i) for i, _, _ in P8}
same("6 table", [LS8[i] for i in range(1, 9)], [2, 0, 6, 7, 6, 9, 11, 13])
same("6.2", (LS8[4], LS8[1] - S8[1][0]), (7, 2))
expect(F6, "2. Позднее начало процесса 4 — 7; запас процесса 1 — 2 мс.")
same("6.3", sorted(i for i in LS8 if LS8[i] == S8[i][0]), [2, 5, 7, 8])
expect(F6, "3. 2, 5, 7 и 8")
same("6 seven", (sum(1 for i in LS8 if LS8[i] >= 7), sum(1 for i in S8 if S8[i][0] >= 7)), (4, 3))
same("6.4", sum(1 for i in LS8 if LS8[i] >= 10), 2)
expect(F6, "4. 2")
P4b = [(1, 4, ()), (2, 4, ()), (3, 3, (2,)), (4, 4, (2,))]
same("6.5", total(P4b), 8)
ls_late = early(P4b)
both = {1: (4, 8), 2: ls_late[2], 3: ls_late[3], 4: ls_late[4]}
same("6.5b", runs(both, lambda c: c == 3, 8), 3)
expect(F6, "5. 3 мс")
LS7 = {i: latest_start(P7, i) for i, _, _ in P7}
same("6.7", sorted(i for i in LS7 if LS7[i] >= 6), [5, 6, 7])
expect(F6, "7. 3: процессы 5, 6 и 7.")

# --- subtopic 7 ------------------------------------------------------------------
F7 = "07-zaderzhki-i-obratnye-voprosy.md"
same(
    "7.1",
    (
        [x for x in range(1, 40) if max(12, x + 5) == 12],
        [x for x in range(1, 40) if max(12, x + 5) == 15],
    ),
    (list(range(1, 8)), [10]),
)
expect(F7, "1. Для 12 подходят x = 1, …, 7; для 15 нужно x = 10.")


def delayed(procs, delta):
    s = {}
    d = {i: x for i, x, _ in procs}
    for i, _, deps in procs:
        s[i] = max((s[j] + d[j] + delta for j in deps), default=0)
    return {i: (s[i], s[i] + d[i]) for i in s}


dl = delayed([(1, 3, ()), (2, 5, ()), (3, 4, (1, 2)), (4, 2, (3,))], 2)
same("7.2", (dl[4][0], max(f for _, f in dl.values())), (13, 15))
expect(F7, "2. Начало процесса 4 — 13 мс, общее время 15 мс.")
tx = {x: total([(i, x if i == 6 else d, p) for i, d, p in P8]) for x in range(1, 20)}
same("7.3", ([x for x in tx if tx[x] == 16], max(x for x in tx if tx[x] == 14)), ([7], 5))
expect(F7, "3. x = 7; наибольшее x = 5.")
same("7.4", max(6 + 4, 8 + 1), 10)
expect(F7, "4. В момент 10")
events = sorted({0} | {s for s, _ in S7.values()} | {f for _, f in S7.values()})
same("7.5", len(events) - 1, 7)
expect(F7, "5. 7")
same("7.6", runs(S7, lambda c: c == 2, T7), 5)
expect(F7, "6. 5 мс")

# --- subtopic 8 ------------------------------------------------------------------
F8 = "08-ogranichennye-resursy.md"
same("8.1", simulate([(1, 4, ()), (2, 4, ()), (3, 3, ()), (4, 2, (1,)), (5, 1, (2, 3))], 2)[1], 8)
expect(F8, "1. 8 мс.")
E = [(2, 3, ()), (3, 2, ()), (1, 1, (2,))]
same("8.2", (simulate(E, 1, "id")[0][3], simulate(E, 1, "fifo")[0][3]), (4, 3))
expect(F8, "2. 4 мс по правилу «меньший ID», 3 мс по очереди.")
same("8.3", simulate(P8, 99, "id", exclusive=[(4, 5)])[1], 16)
expect(F8, "3. 16 мс.")
same("8.5", simulate([(1, 3, ()), (2, 2, ()), (3, 4, ()), (4, 1, (1, 2)), (5, 2, (3,))], 2)[1], 8)
expect(F8, "5. 8 мс")
same("8.6", total([(1, 3, ()), (2, 2, ()), (3, 4, ()), (4, 1, (1, 2)), (5, 2, (3,))]), 6)
expect(F8, "6. 6 мс")

# --- final page ----------------------------------------------------------------------
F9 = "09-praktika-i-itog.md"
same("9.1", total(read_book("22-6")), 73)
expect(F9, "1. 73.")
same("9.2", working(early(read_book("22-2")), 20), 3)
expect(F9, "2. 3.")
same("9.3", sorted(f for _, f in early(read_book("22-4")).values())[9], 11)
expect(F9, "3. 11.")
b3 = read_book("22-3")
s3 = early(b3)
t3 = total(b3)
pk = max(working(s3, t) for t in range(t3))
same("9.4", (pk, runs(s3, lambda c: c == pk, t3)), (5, 3))
expect(F9, "4. 3")
b5 = read_book("22-5")
same("9.5", sum(1 for i, _, _ in b5 if latest_start(b5, i) >= 20), 13)
expect(F9, "5. 13.")

for f in sorted(D.glob("0*.md")):
    nums = re.findall(r"^(\d+)\. ", answers(f.name), re.M)
    if nums != [str(i) for i in range(1, len(nums) + 1)]:
        checks.append((f.name, f"answers numbered 1…n: {nums}", False))

bad = [c for c in checks if not c[2]]
for f, needle, ok in checks:
    print("PASS" if ok else "FAIL", f, needle)
print(f"{len(checks) - len(bad)} of {len(checks)} checks pass")
sys.exit(1 if bad else 0)
