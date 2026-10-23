"""Independent answer and content checks for the EGE topic 23 lesson «Анализ графов».

The lesson solves its tasks by recursion with @cache over float weights. Here every answer
is recomputed by another method with exact decimals: small graphs by enumerating every
path, the attached graph files by Dijkstra's algorithm with a heap and by dynamic
programming over a topological order or over the number of edges. The bank's own solution
programs, run next to their attached file, must print the same.
"""

import heapq
import json
import shutil
import subprocess
import sys
import tempfile
from decimal import Decimal
from pathlib import Path

import pytest

from app.modules.practice.models import FileObject, TaskRecord
from app.modules.practice.readers import public_task
from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "graph-analysis"
INF = Decimal("Infinity")
Edge = tuple[int, int, Decimal]


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _edges(text: str) -> list[Edge]:
    rows = [line.split() for line in text.replace(";", "\n").splitlines() if line.strip()]
    return [(int(u), int(v), Decimal(w)) for u, v, w in rows]


def _all_paths(edges: list[Edge], start: int, goal: int) -> list[tuple[Decimal, list[int]]]:
    found: list[tuple[Decimal, list[int]]] = []

    def walk(v: int, cost: Decimal, path: list[int]) -> None:
        if v == goal:
            found.append((cost, path))
            return
        for u, x, w in edges:
            if u == v:
                walk(x, cost + w, [*path, x])

    walk(start, Decimal(0), [start])
    return found


def _dijkstra(edges: list[Edge], start: int, banned: frozenset[int] = frozenset()) -> dict:
    adjacency: dict[int, list[tuple[int, Decimal]]] = {}
    for u, v, w in edges:
        adjacency.setdefault(u, []).append((v, w))
    best = {start: Decimal(0)}
    heap = [(Decimal(0), start)]
    done: set[int] = set()
    while heap:
        cost, v = heapq.heappop(heap)
        if v in done or v in banned:
            continue
        done.add(v)
        for x, w in adjacency.get(v, []):
            if x not in banned and cost + w < best.get(x, INF):
                best[x] = cost + w
                heapq.heappush(heap, (cost + w, x))
    return best


def _dist(edges: list[Edge], start: int, goal: int, banned: frozenset[int] = frozenset()):
    if start in banned or goal in banned:
        return INF
    return _dijkstra(edges, start, banned).get(goal, INF)


def _topological(edges: list[Edge]) -> list[int]:
    vertices = list(dict.fromkeys(x for e in edges for x in e[:2]))
    incoming = {v: 0 for v in vertices}
    for _, v, _ in edges:
        incoming[v] += 1
    order, ready = [], [v for v in vertices if incoming[v] == 0]
    while ready:
        v = ready.pop(0)
        order.append(v)
        for u, x, _ in edges:
            if u == v:
                incoming[x] -= 1
                if incoming[x] == 0:
                    ready.append(x)
    assert len(order) == len(vertices), "the graph has a cycle"
    return order


def _count_and_longest(edges: list[Edge], start: int, goal: int) -> tuple[int, Decimal]:
    count = {start: 1}
    longest = {start: Decimal(0)}
    for v in _topological(edges):
        for u, x, w in edges:
            if u == v and v in count:
                count[x] = count.get(x, 0) + count[v]
                longest[x] = max(longest.get(x, -INF), longest[v] + w)
    return count.get(goal, 0), longest.get(goal, -INF)


def _edge_counts(edges: list[Edge], start: int, goal: int) -> tuple[int, int]:
    """The fewest and the most edges on a path, over a topological order."""
    fewest, most = {start: 0}, {start: 0}
    for v in _topological(edges):
        for u, x, _ in edges:
            if u == v and v in fewest:
                fewest[x] = min(fewest.get(x, 10**9), fewest[v] + 1)
                most[x] = max(most.get(x, -1), most[v] + 1)
    return fewest[goal], most[goal]


def _to_any_dead_end(edges: list[Edge], start: int) -> Decimal:
    starts = {u for u, _, _ in edges}
    ends = {x for _, x, _ in edges} - starts
    return max(_count_and_longest(edges, start, end)[1] for end in ends)


def _by_edges(edges: list[Edge], start: int, goal: int, most: int) -> list[tuple[Decimal, int]]:
    """For k = 0 … most: the shortest length and the number of paths of exactly k edges,
    layer by layer forwards from the start."""
    cost, count = {start: Decimal(0)}, {start: 1}
    out = [(cost.get(goal, INF), count.get(goal, 0))]
    for _ in range(most):
        nxt_cost: dict[int, Decimal] = {}
        nxt_count: dict[int, int] = {}
        for u, x, w in edges:
            if u in cost:
                nxt_cost[x] = min(nxt_cost.get(x, INF), cost[u] + w)
                nxt_count[x] = nxt_count.get(x, 0) + count[u]
        cost, count = nxt_cost, nxt_count
        out.append((cost.get(goal, INF), count.get(goal, 0)))
    return out


def _file(task: TaskData) -> tuple[str, Path]:
    assert len(task.files) == 1, task.id
    usage = task.files[0]
    return usage.filename, BANK_DIR / "files" / usage.checksum


def _graph(task: TaskData) -> list[Edge]:
    return _edges(_file(task)[1].read_text())


G3 = _edges("1 20 2.4; 1 7 6.0; 20 7 1.3; 7 100 3.2; 20 100 8.0; 1 100 15.0")
G7 = _edges("1 12 3.4; 1 5 6.1; 12 5 1.9; 12 30 7.2; 5 30 2.6; 5 100 9.8; 30 100 4.7; 1 100 16.5")
G26 = _edges("1 4 2.5; 1 6 4.1; 4 6 1.2; 4 15 0.6; 6 15 2.9; 6 100 7.4; 15 100 5.8; 15 22 0.3")
EXAMPLE = _edges("100 12 1.0; 6 7 7.0; 6 1 1.0; 1 7 5.5; 7 100 2.0; 4 100 8.0; 1 100 12.0; 1 4 2.5")
FINAL_PAGE = {"task-23-6-06", "task-23-8-03", "task-23-8-04", "task-23-8-05"}
ADVANCED = {"task-23-7-04", "task-23-9-13", "task-23-9-14", "task-23-9-15", "task-23-9-16"}


def _min_enumerated(edges: list[Edge], banned: frozenset[int] = frozenset()) -> Decimal:
    return min(c for c, p in _all_paths(edges, 1, 100) if not banned & set(p))


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    tasks = _entries()

    def graph(task_id: str) -> list[Edge]:
        return _graph(tasks[task_id])

    def integer(value: Decimal) -> str:
        assert value not in (INF, -INF)
        return str(int(value))

    e1, e2, e3 = graph("task-23-4-06"), graph("task-23-5-06"), graph("task-23-6-06")
    e4, e5, e6 = graph("task-23-7-06"), graph("task-23-8-01"), graph("task-23-8-04")
    weight = {(u, v): w for edges in (e2, e6) for u, v, w in edges}
    via5 = min(
        _dist(e5, 1, 342) + _dist(e5, 342, 423) + _dist(e5, 423, 100),
        _dist(e5, 1, 423) + _dist(e5, 423, 342) + _dist(e5, 342, 100),
    )
    count4, longest4 = _count_and_longest(e4, 1, 100)
    fewest3, most3 = _edge_counts(e3, 1, 100)
    layers1, layers3, layers4 = (_by_edges(e, 1, 100, 200) for e in (e1, e3, e4))
    cycle = _edges("3 8 1.0; 8 5 2.0; 5 3 1.5; 8 9 4.0; 9 4 0.5")

    def reachable(edges: list[Edge], v: int) -> set[int]:
        seen: set[int] = set()
        todo = [v]
        while todo:
            here = todo.pop()
            for u, x, _ in edges:
                if u == here and x not in seen:
                    seen.add(x)
                    todo.append(x)
        return seen

    on_cycle = [v for v in {x for e in cycle for x in e[:2]} if v in reachable(cycle, v)]

    def greedy(edges: list[Edge], v: int, goal: int) -> Decimal:
        total = Decimal(0)
        while v != goal:
            w, v = min((w, x) for u, x, w in edges if u == v)
            total += w
        return total

    from_6 = _all_paths(EXAMPLE, 6, 100)
    dead_zero = _edges(
        "100 12 1.0; 6 7 7.0; 6 1 1.0; 1 7 5.5; 7 100 2.0; 4 100 8.0; 1 100 12.0; 1 4 2.5; 4 12 0.5"
    )
    return {
        "task-23-1-02": str(
            len({x for e in _edges("1 40 0; 40 7 0; 7 100 0; 1 100 0") for x in e[:2]})
        ),
        "task-23-1-05": integer(_min_enumerated(G3)),
        "task-23-9-01": str(len(from_6)),
        "task-23-1-07": integer(_min_enumerated(G7)),
        "task-23-9-02": str(len(on_cycle)),
        "task-23-9-03": integer(greedy(EXAMPLE, 6, 100) - min(c for c, _ in from_6)),
        "task-23-9-06": str(min(c for c, p in from_6 if 7 in p)),
        "task-23-9-04": f"{_min_enumerated(EXAMPLE)} {min(c for c, _ in from_6)}",
        "task-23-2-06": integer(_min_enumerated(G26)),
        # a zero in the dead end 12 counts paths that stop there, not at 100
        "task-23-9-05": integer(
            min(
                c
                for c, p in _all_paths(dead_zero, 1, 12) + _all_paths(dead_zero, 1, 100)
                if 100 not in p[:-1]
            )
        ),
        "task-23-3-01": "125 17",
        "task-23-3-06": "False 6",
        "task-23-3-07": str(len({x for e in e1 for x in e[:2]})),
        "task-23-4-06": integer(_dist(e1, 1, 100)),
        "task-23-4-07": integer(_dist(e1, 1, 255)),
        "task-23-8-01": integer(_dist(e5, 1, 100)),
        "task-23-5-05": str(
            _dist(G26, 1, 15, frozenset({4})) + _dist(G26, 15, 100, frozenset({4}))
        ),
        "task-23-5-06": integer(_dist(e2, 1, 264) + _dist(e2, 264, 100)),
        "task-23-8-02": integer(via5),
        "task-23-5-07": integer(_dist(e2, 1, 100, frozenset({975}))),
        "task-23-9-07": integer(_dist(e2, 1, 921) + weight[921, 305] + _dist(e2, 305, 100)),
        "task-23-9-08": integer(weight[1, 554] + _dist(e6, 554, 53) + weight[53, 100]),
        "task-23-7-06": str(count4),
        "task-23-9-09": str(
            _count_and_longest(e4, 1, 472)[0] * _count_and_longest(e4, 139, 100)[0]
        ),
        "task-23-7-07": integer(longest4),
        "task-23-9-12": integer(_to_any_dead_end(e6, 1)),
        "task-23-9-10": str(fewest3),
        "task-23-9-11": str(most3),
        "task-23-7-04": str(min(c for c, p in _all_paths(G3, 1, 100) if len(p) == 3)),
        "task-23-9-13": integer(layers3[10][0]),
        "task-23-9-14": integer(min(c for c, _ in layers1[20:])),
        "task-23-9-15": str(layers4[5][1]),
        "task-23-9-16": str(sum(n for _, n in layers4[1:7])),
        "task-23-6-06": integer(_dist(e3, 1, 100)),
        "task-23-8-03": integer(_dist(e5, 1, 100, frozenset({722}))),
        "task-23-8-04": integer(_dist(e6, 1, 100)),
        "task-23-8-05": integer(_dist(e6, 1, 429) + _dist(e6, 429, 100)),
    }


def _solution_code(task: TaskData) -> str:
    examples = [
        block.data.code
        for block in task.explanation
        if block.type == "code_example" and block.data.language == "python"
    ]
    assert len(examples) == 1, task.id
    return examples[0]


def test_material_is_published() -> None:
    bank = _bank()
    bank.validate_references()
    material = next(item for item in bank.materials if item.id == MATERIAL)
    assert material.kind == "topic" and material.status == "published"


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(task.lessons[0].position for task in tasks.values()) == list(range(37))
    sections = next(m for m in _bank().materials if m.id == MATERIAL).sections
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [23] and not task.catalog_visible and not task.archived
        assert task.sources[0].kind == "original" and task.hint and task.explanation
        assert bool(task.theory_links) != (task_id in FINAL_PAGE), task_id
        assert all(link.section in sections for link in task.theory_links)
        advanced = task_id in ADVANCED
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_answers_are_robust_to_float_arithmetic(answers: dict[str, str]) -> None:
    """The integer part of every file answer is the same with float sums."""
    tasks = _entries()
    for task_id in ("task-23-4-06", "task-23-6-06", "task-23-8-01", "task-23-8-04"):
        edges = [(u, v, float(w)) for u, v, w in _graph(tasks[task_id])]
        exact = _dist(_graph(tasks[task_id]), 1, 100)
        assert exact - int(exact) > Decimal("0.02") and int(exact) + 1 - exact > Decimal("0.02")
        assert str(int(_dijkstra_float(edges))) == answers[task_id]


def _dijkstra_float(edges: list[tuple[int, int, float]]) -> float:
    best = {1: 0.0}
    heap = [(0.0, 1)]
    while heap:
        cost, v = heapq.heappop(heap)
        if cost > best.get(v, float("inf")):
            continue
        for u, x, w in edges:
            if u == v and cost + w < best.get(x, float("inf")):
                best[x] = cost + w
                heapq.heappush(heap, (cost + w, x))
    return best[100]


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(
    answers: dict[str, str],
) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        if expected == "False 6":
            assert not is_correct(task.checker, "True 6"), task_id
            continue
        tokens = expected.split()
        last = tokens[-1]
        if "." in last:
            assert is_correct(task.checker, expected.replace(".", ",")), task_id
            tokens[-1] = str(Decimal(last) + Decimal("0.1"))
        else:
            tokens[-1] = str(int(last) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id


def test_solution_programs_print_the_answer(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        code = _solution_code(task)
        with tempfile.TemporaryDirectory() as tmp:
            if task.files:
                name, path = _file(task)
                shutil.copy(path, Path(tmp) / name)
                assert f'open("{name}")' in code, task_id
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


def test_attached_files_are_small_acyclic_graphs() -> None:
    for task in _entries().values():
        if not task.files:
            continue
        edges = _graph(task)
        assert len(edges) <= 200 and all(w > 0 for _, _, w in edges), task.id
        _topological(edges)


def test_public_projection_hides_the_answers() -> None:
    bank = _bank()
    files = {
        item.checksum: FileObject(
            checksum=item.checksum,
            storage_key=item.storage_key,
            format=item.format,
            mime_type=item.mime_type,
            size_bytes=item.size_bytes,
        )
        for item in bank.files
    }
    for task in _entries().values():
        row = TaskRecord(
            id=task.id,
            content=task.model_dump(mode="json", exclude={"checker"}),
            solution_revision=1,
            catalog_visible=False,
            archived=False,
        )
        projected = public_task(row, files)
        public_json = json.dumps(projected.model_dump(), ensure_ascii=False)
        assert "checker" not in public_json and "answer_variants" not in public_json
        # an attached graph file is delivered, never inlined
        assert len(projected.deliveries) == len(task.files), task.id
