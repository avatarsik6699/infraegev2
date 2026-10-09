"""Generate the graph files of topic 23 and print their answers.

Usage: python3 -I content/lesson-design/topic-23/datasets.py [--write]

Every exam-format task of the topic works on our own file: an acyclic directed
graph, one edge «from to weight» per line, at most 200 lines, vertices numbered
with gaps, weights with two decimals. Files are generated from a fixed seed, so
the output never changes. Without --write the script only prints answers.

A graph is accepted only if its answers are robust: the fractional part of
every asked sum is at least 0.02 away from an integer (float and Decimal give
the same integer part), the shortest path has several edges, a mandatory
vertex is off the shortest path and a forbidden vertex is on it.
checks.py recomputes every answer by another method.
"""

import random
import sys
from decimal import Decimal
from pathlib import Path

HERE = Path(__file__).resolve().parent
FILES = HERE / "files"
INF = Decimal("Infinity")

# The worked example of the lesson in the «inconvenient» order of lines.
TEXTBOOK = "7 100 3.0\n40 7 1.0\n40 100 9.0\n1 100 12.0\n1 7 5.0\n1 40 2.0\n"


def make(seed: int, n_vertices: int, n_edges: int):
    """Vertices in a hidden topological order; most edges are short jumps
    with a weight that grows with the jump, so best paths are long."""
    rnd = random.Random(seed)
    ids = rnd.sample([v for v in range(2, 1000) if v != 100], n_vertices - 2)
    order = ids[:]
    order.insert(rnd.randint(0, 2), 1)
    order.insert(len(order) - rnd.randint(3, 6), 100)
    edges = set()
    while len(edges) < n_edges:
        i = rnd.randrange(len(order) - 1)
        j = min(len(order) - 1, i + rnd.choice([1, 1, 2, 2, 3, 4, 6, 9]))
        if (order[i], order[j]) in {(a, b) for a, b, _ in edges}:
            continue
        span = j - i
        cents = rnd.randint(150, 400) * span * 100 + rnd.randint(0, 99) + rnd.randint(-9000, 9000)
        edges.add((order[i], order[j], Decimal(max(cents, 101)) / 100))
    edges = sorted(edges, key=lambda e: rnd.random())
    return edges


def best(edges, source, target, banned=()):
    """Minimal sum from source to target by recursion over a DAG (Decimal)."""
    graph: dict[int, list] = {}
    for u, v, w in edges:
        graph.setdefault(u, []).append((v, w))
    memo: dict[int, Decimal] = {}

    def f(v):
        if v in banned:
            return INF
        if v == target:
            return Decimal(0)
        if v not in memo:
            memo[v] = min((w + f(x) for x, w in graph.get(v, [])), default=INF)
        return memo[v]

    sys.setrecursionlimit(10000)
    return f(source)


def path_of(edges, source, target, banned=()):
    v, path = source, [source]
    while v != target:
        rest = best(edges, v, target, banned)
        v = next(
            x
            for u, x, w in edges
            if u == v and x not in banned and w + best(edges, x, target, banned) == rest
        )
        path.append(v)
    return path


def frac_ok(x: Decimal) -> bool:
    f = x - int(x)
    return Decimal("0.02") <= f <= Decimal("0.98")


def text(edges) -> str:
    return "".join(f"{u} {v} {w}\n" for u, v, w in edges)


SPECS = {
    # file: (n_vertices, n_edges)
    "23-1.txt": (60, 200),
    "23-2.txt": (60, 200),
    "23-3.txt": (45, 150),
    "23-4.txt": (30, 70),
    "23-5.txt": (60, 200),
    "23-6.txt": (55, 190),
}


def generate():
    """file -> edges, searching seeds until the file's answers are robust."""
    out = {}
    for name, (nv, ne) in SPECS.items():
        seed = 23_000 + 100 * list(SPECS).index(name)
        while True:
            edges = make(seed, nv, ne)
            d = best(edges, 1, 100)
            p = path_of(edges, 1, 100) if d != INF else []
            if d != INF and len(p) >= 6 and frac_ok(d) and asks_ok(name, edges, p):
                out[name] = edges
                break
            seed += 1
    return out


def must_vertex(edges, path, k=0):
    """A mandatory vertex: reachable from 1, reaches 100, off the best path."""
    cands = [
        v
        for v in sorted({x for e in edges for x in e[:2]})
        if v not in path and best(edges, 1, v) != INF and best(edges, v, 100) != INF
    ]
    return cands[len(cands) // 3 + k] if len(cands) > 3 + k else None


def asks_ok(name, edges, path):
    if name in ("23-2.txt", "23-5.txt"):
        k = must_vertex(edges, path)
        if k is None or not frac_ok(best(edges, 1, k) + best(edges, k, 100)):
            return False
        banned = path[len(path) // 2]
        if not frac_ok(best(edges, 1, 100, banned={banned})):
            return False
    if name == "23-5.txt":
        k2 = must_vertex(edges, path, 1)
        if k2 is None:
            return False
    if name == "23-4.txt":
        return frac_ok(longest(edges, 1, 100))
    if name == "23-6.txt":
        # the file punishes «a dead end returns 0»: that mistake gives a
        # smaller, wrong sum
        wrong = naive(edges, 1, 100)
        return frac_ok(wrong) and int(wrong) < int(best(edges, 1, 100))
    return True


def longest(edges, source, target):
    graph: dict[int, list] = {}
    for u, v, w in edges:
        graph.setdefault(u, []).append((v, w))
    memo: dict[int, Decimal] = {}

    def g(v):
        if v == target:
            return Decimal(0)
        if v not in memo:
            memo[v] = max((w + g(x) for x, w in graph.get(v, [])), default=-INF)
        return memo[v]

    return g(source)


def count(edges, source, target):
    graph: dict[int, list] = {}
    for u, v, _ in edges:
        graph.setdefault(u, []).append(v)
    memo: dict[int, int] = {}

    def c(v):
        if v == target:
            return 1
        if v not in memo:
            memo[v] = sum(c(x) for x in graph.get(v, []))
        return memo[v]

    return c(source)


def naive(edges, source, target):
    """The common mistake: a dead end returns 0 instead of infinity."""
    graph: dict[int, list] = {}
    for u, v, w in edges:
        graph.setdefault(u, []).append((v, w))
    memo: dict[int, Decimal] = {}

    def f(v):
        if v == target or not graph.get(v):
            return Decimal(0)
        if v not in memo:
            memo[v] = min(w + f(x) for x, w in graph[v])
        return memo[v]

    return f(source)


def answers(files):
    a = {}
    e1 = files["23-1.txt"]
    a["23-1 кратчайший 1 → 100"] = int(best(e1, 1, 100))
    e2 = files["23-2.txt"]
    p2 = path_of(e2, 1, 100)
    k = must_vertex(e2, p2)
    b = p2[len(p2) // 2]
    a[f"23-2 через {k}"] = int(best(e2, 1, k) + best(e2, k, 100))
    a[f"23-2 без {b}"] = int(best(e2, 1, 100, banned={b}))
    e3 = files["23-3.txt"]
    a["23-3 кратчайший 1 → 100"] = int(best(e3, 1, 100))
    a["23-3 путь"] = " ".join(map(str, path_of(e3, 1, 100)))
    e4 = files["23-4.txt"]
    a["23-4 количество путей"] = count(e4, 1, 100)
    a["23-4 самый длинный"] = int(longest(e4, 1, 100))
    e5 = files["23-5.txt"]
    p5 = path_of(e5, 1, 100)
    k1, k2 = must_vertex(e5, p5), must_vertex(e5, p5, 1)
    a["23-5 кратчайший 1 → 100"] = int(best(e5, 1, 100))
    first, second = sorted((k1, k2), key=lambda v: best(e5, 1, v))
    via = best(e5, 1, first) + best(e5, first, second) + best(e5, second, 100)
    a[f"23-5 через {first}, затем {second}"] = "нет пути" if via == INF else int(via)
    b5 = p5[len(p5) // 2]
    a[f"23-5 без {b5}"] = int(best(e5, 1, 100, banned={b5}))
    e6 = files["23-6.txt"]
    a["23-6 кратчайший 1 → 100"] = int(best(e6, 1, 100))
    a["23-6 ошибка «тупик = 0»"] = int(naive(e6, 1, 100))
    return a


if __name__ == "__main__":
    files = generate()
    if "--write" in sys.argv:
        FILES.mkdir(exist_ok=True)
        (FILES / "23.txt").write_text(TEXTBOOK, encoding="utf-8")
        for name, edges in files.items():
            (FILES / name).write_text(text(edges), encoding="utf-8")
    for name, edges in files.items():
        vs = {x for e in edges for x in e[:2]}
        print(f"{name}: {len(edges)} рёбер, {len(vs)} вершин")
    for key, value in answers(files).items():
        print(f"{key}: {value}")
