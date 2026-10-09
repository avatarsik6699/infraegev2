"""Independent recomputation of every task answer in topic 23.

Usage: python3 -I docs/artifacts/lesson-design/topic-23/checks.py

The lesson solves tasks by recursion with @cache. Here answers are recomputed
by other methods: small graphs by enumerating every path, files by Dijkstra
with a heap and by dynamic programming over a topological order (Kahn). Each
expected answer must appear verbatim in its subtopic file. Exit code 1 if any
check fails.
"""

import heapq
import sys
from decimal import Decimal
from pathlib import Path

D = Path(__file__).resolve().parent
INF = Decimal("Infinity")
checks: list[tuple[str, str, bool]] = []


def rd(name: str) -> str:
    return (D / name).read_text(encoding="utf-8")


def small(text: str):
    """Edges from «1 20 2.4; 1 7 6.0» or from lines of a file."""
    out = []
    for part in text.replace(";", "\n").splitlines():
        if part.strip():
            u, v, w = part.split()
            out.append((int(u), int(v), Decimal(w)))
    return out


def load(name: str):
    return small(rd(f"files/{name}"))


def all_paths(edges, s, t, banned=()):
    """Every path from s to t as (cost, vertices) — full enumeration."""
    out = []

    def go(v, cost, path):
        if v in banned:
            return
        if v == t:
            out.append((cost, path))
            return
        for u, x, w in edges:
            if u == v:
                go(x, cost + w, path + [x])

    go(s, Decimal(0), [s])
    return out


def shortest_enum(edges, s, t, banned=(), length=None):
    costs = [c for c, p in all_paths(edges, s, t, banned) if length is None or len(p) - 1 == length]
    return min(costs, default=INF)


def dijkstra(edges, s, banned=()):
    adj: dict[int, list] = {}
    for u, v, w in edges:
        adj.setdefault(u, []).append((v, w))
    dist = {s: Decimal(0)}
    heap = [(Decimal(0), s)]
    done = set()
    while heap:
        d, v = heapq.heappop(heap)
        if v in done or v in banned:
            continue
        done.add(v)
        for x, w in adj.get(v, []):
            if x not in banned and d + w < dist.get(x, INF):
                dist[x] = d + w
                heapq.heappush(heap, (d + w, x))
    return dist


def dist(edges, s, t, banned=()):
    if s in banned or t in banned:
        return INF
    return dijkstra(edges, s, banned).get(t, INF)


def topo(edges):
    vs = list(dict.fromkeys(x for e in edges for x in e[:2]))
    indeg = {v: 0 for v in vs}
    for _, v, _ in edges:
        indeg[v] += 1
    order, ready = [], [v for v in vs if indeg[v] == 0]
    while ready:
        v = ready.pop()
        order.append(v)
        for u, x, _ in edges:
            if u == v:
                indeg[x] -= 1
                if indeg[x] == 0:
                    ready.append(x)
    assert len(order) == len(vs), "graph has a cycle"
    return order


def backward_dp(edges, t, combine, at_target, dead):
    """Value of every vertex towards t, vertices in reverse topological
    order: combine(list of (w, value of next)) for vertices with edges."""
    val = {}
    for v in reversed(topo(edges)):
        if v == t:
            val[v] = at_target
            continue
        outs = [(w, val[x]) for u, x, w in edges if u == v]
        val[v] = combine(outs) if outs else dead
    return val


def count_paths(edges, s, t):
    return backward_dp(edges, t, lambda o: sum(c for _, c in o), 1, 0)[s]


def longest(edges, s, t):
    return backward_dp(edges, t, lambda o: max(w + g for w, g in o), Decimal(0), -INF)[s]


def dead_end_zero(edges, s, t):
    """The mistake «a vertex without edges returns 0»."""
    return backward_dp(edges, t, lambda o: min(w + f for w, f in o), Decimal(0), Decimal(0))[s]


def check(file: str, label: str, ok: bool) -> None:
    checks.append((file, label, ok))


def expect(file: str, *lines: str) -> None:
    text = rd(file)
    for line in lines:
        check(file, line, line in text)


def answer(file: str, number: int, value) -> None:
    """Answer line «N. value.» (or «N. value» at the end of the file)."""
    line = f"\n{number}. {value}"
    check(file, line.strip(), line in rd(file))


TEXTBOOK = small("1 40 2; 1 7 5; 1 100 12; 40 7 1; 40 100 9; 7 100 3")
G3 = small("1 20 2.4; 1 7 6.0; 20 7 1.3; 7 100 3.2; 20 100 8.0; 1 100 15.0")
G7 = small("1 12 3.4; 1 5 6.1; 12 5 1.9; 12 30 7.2; 5 30 2.6; 5 100 9.8; 30 100 4.7; 1 100 16.5")
G26 = small("1 4 2.5; 1 6 4.1; 4 6 1.2; 4 15 0.6; 6 15 2.9; 6 100 7.4; 15 100 5.8; 15 22 0.3")

# --- the worked example
check(
    "01",
    "учебный граф: 4 пути, минимум 6",
    len(all_paths(TEXTBOOK, 1, 100)) == 4 and shortest_enum(TEXTBOOK, 1, 100) == 6,
)
check(
    "files/23.txt",
    "файл 23.txt — учебный граф",
    sorted(load("23.txt")) == sorted(TEXTBOOK),
)

# --- subtopic 1
f = "01-graf-i-put.md"
paths = {tuple(p): c for c, p in all_paths(G3, 1, 100)}
check(
    f,
    "G3: четыре пути с указанными суммами",
    paths
    == {
        (1, 100): Decimal("15.0"),
        (1, 7, 100): Decimal("9.2"),
        (1, 20, 100): Decimal("10.4"),
        (1, 20, 7, 100): Decimal("6.9"),
    },
)
expect(f, "Минимум — `6.9`, в ответ записывается `6`.")
fewest = min(all_paths(G3, 1, 100), key=lambda cp: len(cp[1]))
check(f, "G3: меньше всего рёбер у 1 → 100", fewest[1] == [1, 100])
g7 = sorted(all_paths(G7, 1, 100))
check(
    f,
    "G7: кратчайший 1 → 12 → 5 → 30 → 100 = 12.6",
    g7[0] == (Decimal("12.6"), [1, 12, 5, 30, 100]),
)
check(f, "G7: 1 → 5 → 100 = 15.9", (Decimal("15.9"), [1, 5, 100]) in g7)
answer(f, 7, int(g7[0][0]))

# --- subtopic 2
f = "02-luchshij-ostatok.md"
fv = {v: dist(G3, v, 100) for v in (1, 20, 7, 100)}
check(
    f,
    "f для G3",
    fv == {1: Decimal("6.9"), 20: Decimal("4.5"), 7: Decimal("3.2"), 100: 0},
)
g25 = small("1 5 3; 1 9 4; 5 8 1; 5 100 6; 9 100 2")
check(
    f,
    "задача 5: f(1) = 6, с ошибкой 4",
    dist(g25, 1, 100) == 6 and dead_end_zero(g25, 1, 100) == 4 and dist(g25, 5, 100) == 6,
)
f26 = {v: dist(G26, v, 100) for v in (1, 4, 6, 15, 22)}
check(
    f,
    "задача 6: f",
    f26
    == {
        1: Decimal("8.9"),
        4: Decimal("6.4"),
        6: Decimal("7.4"),
        15: Decimal("5.8"),
        22: INF,
    },
)
check(
    f,
    "задача 6: ошибка «тупик = 0» даёт 3.4",
    dead_end_zero(G26, 1, 100) == Decimal("3.4"),
)
answer(f, 6, int(f26[1]))

# --- subtopic 3
f = "03-graf-iz-fajla.md"
e1 = load("23-1.txt")
vs = {x for e in e1 for x in e[:2]}
check(f, "23-1: 200 рёбер, 60 вершин", len(e1) == 200 and len(vs) == 60)
check(f, "23-1: из 100 выходят два ребра", sum(u == 100 for u, _, _ in e1) == 2)
check(f, "23-1: без исходящих рёбер только 255", vs - {u for u, _, _ in e1} == {255})
expect(f, "7. 60 различных вершин при 200 рёбрах. Из вершины 100 выходят два ребра")
check(
    f,
    "задача 3: 9.2 и 7",
    sum(map(Decimal, ["4.7", "2.6", "1.9"])) == Decimal("9.2") and 4 + 2 + 1 == 7,
)

# --- subtopic 4
f = "04-rekursiya-s-zapominaniem.md"
answer(f, 6, int(dist(e1, 1, 100)))
check(f, "задача 7: путь до 255", f"7. {int(dist(e1, 1, 255))}." in rd(f))
calls = [0] * 32  # calls[v] — calls made by best(v) without @cache
for v in range(30, 0, -1):
    calls[v] = 1 + sum(calls[x] for x in (v + 1, v + 2) if x <= 30)
check(f, "лесенка 1…30: 2 178 308 вызовов", calls[1] == 2178308 and "2 178 308" in rd(f))

# --- subtopic 5
f = "05-usloviya-na-put.md"
check(
    f,
    "граф подтемы: 8.9, через 6 — 11.1, без 4 — 11.5, через 6 и 15 — 12.4",
    dist(G26, 1, 100) == Decimal("8.9")
    and dist(G26, 1, 6) + dist(G26, 6, 100) == Decimal("11.1")
    and dist(G26, 1, 100, banned={4}) == Decimal("11.5")
    and dist(G26, 1, 6) + dist(G26, 6, 15) + dist(G26, 15, 100) == Decimal("12.4")
    and dist(G26, 15, 6) == INF
    and dist(G26, 6, 4) == INF,
)
check(
    f,
    "задача 1: G3 без 7 = 10.4",
    shortest_enum(G3, 1, 100, banned={7}) == Decimal("10.4"),
)
check(
    f,
    "задача 5: через 15 без 4 = 12.8",
    dist(G26, 1, 15, {4}) + dist(G26, 15, 100, {4}) == Decimal("12.8"),
)
e2 = load("23-2.txt")
answer(f, 6, int(dist(e2, 1, 264) + dist(e2, 264, 100)))
check(f, "задача 7", f"7. {int(dist(e2, 1, 100, banned={975}))}." in rd(f))
check(
    f,
    "23-2: без запрета 10715.49",
    dist(e2, 1, 100) == Decimal("10715.49") and "10715.49" in rd(f),
)

# --- subtopic 6 (Bellman–Ford is checked against Dijkstra)
f = "06-povtornye-prohody.md"
e3 = load("23-3.txt")
answer(f, 6, int(dist(e3, 1, 100)))
d3 = dijkstra(e3, 1)
path, v = [100], 100
while v != 1:  # predecessor on a shortest path, found from distances
    v = next(u for u, x, w in e3 if x == v and u in d3 and d3[u] + w == d3[v])
    path.append(v)
answer(f, 7, " ".join(map(str, reversed(path))))


def passes(edges):
    vs_ = {x for e in edges for x in e[:2]} | {1, 100}
    d = {x: INF for x in vs_}
    d[1] = Decimal(0)
    done = 0
    for _ in range(len(vs_) - 1):
        done += 1
        changed = False
        for u, x, w in edges:
            if d[u] + w < d[x]:
                d[x], changed = d[u] + w, True
        if not changed:
            break
    return done, d[100]


check(
    f,
    "23-1: 13 проходов, ответ 11387",
    passes(e1) == (13, dist(e1, 1, 100)) and "после 13 проходов из 59" in rd(f),
)
check(
    f,
    "задача 2: по порядку — два прохода",
    passes(small("1 40 2; 40 7 1; 7 100 3"))[0] == 2,
)

# --- subtopic 7
f = "07-drugie-sposoby.md"
check(
    f,
    "учебный: 4 пути, из 40 — 2, длиннейший 12 и 9",
    count_paths(TEXTBOOK, 1, 100) == 4
    and count_paths(TEXTBOOK, 40, 100) == 2
    and longest(TEXTBOOK, 1, 100) == 12
    and longest(TEXTBOOK, 40, 100) == 9,
)
check(
    f,
    "ровно 1 и 2 ребра: 12 и 8",
    shortest_enum(TEXTBOOK, 1, 100, length=1) == 12
    and shortest_enum(TEXTBOOK, 1, 100, length=2) == 8,
)
check(
    f,
    "задача 1: топологический порядок единственный 5, 3, 8, 2",
    topo(small("5 3 1; 5 8 1; 3 8 1; 8 2 1; 3 2 1")) == [5, 3, 8, 2],
)
check(
    f,
    "задача 4: G3 ровно два ребра 9.2",
    shortest_enum(G3, 1, 100, length=2) == Decimal("9.2"),
)
check(
    f,
    "задача 5: G3 4 пути, длиннейший 15.0",
    count_paths(G3, 1, 100) == 4 and longest(G3, 1, 100) == Decimal("15.0"),
)
e4 = load("23-4.txt")
answer(f, 6, count_paths(e4, 1, 100))
answer(f, 7, int(longest(e4, 1, 100)))

# --- final page
f = "08-praktika-i-itog.md"
e5, e6 = load("23-5.txt"), load("23-6.txt")
answer(f, 1, int(dist(e5, 1, 100)))
via = min(
    dist(e5, 1, 342) + dist(e5, 342, 423) + dist(e5, 423, 100),
    dist(e5, 1, 423) + dist(e5, 423, 342) + dist(e5, 342, 100),
)
check(
    f,
    "задача 2: 342 → 423 достижимо, обратно нет",
    dist(e5, 342, 423) != INF and dist(e5, 423, 342) == INF,
)
answer(f, 2, int(via))
answer(f, 3, int(dist(e5, 1, 100, banned={722})))
answer(f, 4, int(dist(e6, 1, 100)))
check(
    f,
    "задача 4: ошибка «тупик = 0» даёт 316",
    f"выдаст {int(dead_end_zero(e6, 1, 100))}" in rd(f),
)
answer(f, 5, int(dist(e6, 1, 429) + dist(e6, 429, 100)))

# every file: at most 200 lines, acyclic, answers robust to float
for name in [f"23-{i}.txt" for i in range(1, 7)]:
    edges = load(name)
    topo(edges)
    check(
        name,
        "не больше 200 рёбер, вершины ≤ 999",
        len(edges) <= 200 and max(x for e in edges for x in e[:2]) <= 999,
    )

bad = [c for c in checks if not c[2]]
for file, label, ok in checks:
    if not ok:
        print(f"FAIL {file}: {label}")
print(f"checks: {len(checks)}, failed: {len(bad)}")
sys.exit(1 if bad else 0)
