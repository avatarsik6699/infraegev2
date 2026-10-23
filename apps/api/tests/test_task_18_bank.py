"""Independent answer and content checks for the EGE topic 18 lesson «Робот-сборщик монет».

The lesson fills a table of best sums cell by cell, in Excel. Its bank tasks take their
answers from the stand's own forward table (``topic-18/datasets.py``). Here every answer
is recomputed another way: the small fields of the text by enumerating every route; the
fields of the workbooks by recursion with memoisation — the best sum to a cell asked from
the cell back to the start, the best sum from a start asked forward to the finish. The
fields themselves come from ``datasets.py`` (data, not the method). A task on a book
attaches that book and shows the spreadsheet formulas of the solution.
"""

import importlib.util
import sys
from functools import cache
from itertools import combinations
from pathlib import Path
from typing import Any

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
TOPIC = ROOT / "content/lesson-files/topic-18"
MATERIAL = "spreadsheet-optimization"
RD = ((0, 1), (1, 0))
LD = ((0, -1), (1, 0))
DIAG = ((0, 1), (1, 0), (1, 1))
Cell = tuple[int, int]
# T257: three full tasks of subtopics 3–5 joined the final page
FINAL = {"task-18-3-07", "task-18-4-07", "task-18-5-06", "task-18-9-02", "task-18-9-05"}
ADVANCED = {
    "task-18-5-05",
    "task-18-5-07",
    "task-18-6-01",
    "task-18-6-07",
    "task-18-8-01",
    "task-18-8-03",
    "task-18-8-04",
    "task-18-8-07",
    "task-18-9-01",
    "task-18-9-03",
    "task-18-9-04",
}
ARCHIVED = [
    "task-18-1-02",
    "task-18-1-03",
    "task-18-5-04",
    "task-18-7-04",
    "task-18-7-05",
    "task-18-7-06",
    "task-18-7-07",
    "task-18-8-05",
]


def _datasets():
    spec = importlib.util.spec_from_file_location("topic18_fields", TOPIC / "datasets.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules["topic18_fields"] = module
    spec.loader.exec_module(module)
    return module


ds = _datasets()


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _cell(name: str) -> Cell:
    return int(name[1:]) - 1, "ABCDEFGHIJKLMNOPQRSTUVWXYZ".index(name[0])


def _field(rows, right=(), down=()):
    return ds.Field([list(r) for r in rows], {_cell(c) for c in right}, {_cell(c) for c in down})


F4 = [[2, 7, 4, 1], [5, 1, 8, 3], [2, 6, 2, 9], [4, 3, 7, 2]]
EX = [[3, 4, 2], [1, 8, 5], [6, 2, 7]]


# --- small fields: every route ------------------------------------------------------------


def _routes(f, start: Cell, target: Cell | None = None, moves=RD):
    """Every route from start to target, or to a cell with no move left."""

    def go(path):
        r, c = path[-1]
        if (r, c) == target:
            yield path
            return
        nxt = [(r + dr, c + dc) for dr, dc in moves if f.can(r, c, dr, dc)]
        if not nxt and target is None:
            yield path
        for p in nxt:
            yield from go([*path, p])

    yield from go([start])


def _sums(f, start: Cell, target: Cell | None = None, moves=RD, weight=None) -> list[int]:
    weight = weight or (lambda f, p: f.a[p[0]][p[1]])
    return [sum(weight(f, p) for p in path) for path in _routes(f, start, target, moves)]


def _pair(values: list[int]) -> str:
    return f"{max(values)} {min(values)}"


# --- the workbooks: recursion with memoisation -------------------------------------------------


def _best_to(f, pick, moves=RD, start: Cell = (0, 0), step=None):
    """best(r, c): the best total of a route from start to (r, c), asked backwards;
    None when no route reaches the cell."""
    step = step or (lambda p, q: f.a[q[0]][q[1]])

    @cache
    def best(r: int, c: int) -> Any:
        if (r, c) == start:
            return f.a[r][c]
        if (r, c) in f.dark:
            return None
        cands = []
        for dr, dc in moves:
            pr, pc = r - dr, c - dc
            if 0 <= pr < f.h and 0 <= pc < f.w and f.can(pr, pc, dr, dc):
                prev = best(pr, pc)
                if prev is not None:
                    cands.append(prev + step((pr, pc), (r, c)))
        return pick(cands) if cands else None

    return best


def _stops(f, best, moves=RD) -> list[Cell]:
    return [
        (r, c)
        for r in range(f.h)
        for c in range(f.w)
        if best(r, c) is not None and not any(f.can(r, c, dr, dc) for dr, dc in moves)
    ]


def _corners(f, moves=RD, start: Cell = (0, 0)) -> tuple[int, int]:
    mx, mn = _best_to(f, max, moves, start), _best_to(f, min, moves, start)
    ends = _stops(f, mx, moves)
    return max(mx(*e) for e in ends), min(mn(*e) for e in ends)


def _best_from(f, pick):
    """best(r, c): the best total from (r, c) to the bottom right cell, asked forward."""
    finish = (f.h - 1, f.w - 1)

    @cache
    def best(r: int, c: int) -> Any:
        if (r, c) == finish:
            return f.a[r][c]
        nxt = [best(r + dr, c + dc) for dr, dc in RD if f.can(r, c, dr, dc)]
        nxt = [v for v in nxt if v is not None]
        return f.a[r][c] + pick(nxt) if nxt else None

    return best


def _starts(f, k: int) -> tuple[int, int]:
    mx, mn = _best_from(f, max), _best_from(f, min)
    st = [
        (r, c)
        for r in range(f.h)
        for c in range(f.w)
        if not f.can(r, c, 0, -1) and not f.can(r, c, -1, 0) and mx(r, c) is not None
    ]
    return (
        sum(sorted(mx(*s) for s in st)[-k:]),
        sum(sorted(mn(*s) for s in st)[:k]),
    )


def _book(name: str):
    return ds.FIELDS[name]()


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    import sys as _sys

    _sys.setrecursionlimit(10000)
    a: dict[str, str] = {}
    ex = _field(EX)
    # subtopic 1
    a["task-18-1-01"] = f"{max(4 + 29, 4 + 20)} {min(4 + 18, 4 + 15)}"
    g = _field([[1, 5, 1], [4, 3, 2], [9, 9, 1]])
    greedy = [(0, 0)]
    while greedy[-1] != (2, 2):
        r, c = greedy[-1]
        greedy.append(
            max(
                ((r, c + 1), (r + 1, c)),
                key=lambda p: g.a[p[0]][p[1]] if p[0] < 3 and p[1] < 3 else -1,
            )
        )
    a["task-18-1-04"] = f"{sum(g.a[r][c] for r, c in greedy)} {max(_sums(g, (0, 0), (2, 2)))}"
    a["task-18-1-06"] = _pair(_sums(ex, (0, 0), (2, 2)))
    a["task-18-1-08"] = _pair(_sums(_field([[-2, 5, -1], [4, -6, 3], [-3, 2, -4]]), (0, 0), (2, 2)))
    f9 = _field([[6, 4, 15, 11, 8], [7, 16, 16, 6, 16], [10, 15, 9, 7, 9], [4, 11, 17, 6, 8]])
    s = _sums(f9, (0, 0), (3, 4))
    a["task-18-1-09"] = f"{max(s)} {min(s)}"
    # subtopic 2
    b1 = _book("18-1")
    mx, mn = _best_to(b1, max), _best_to(b1, min)
    a["task-18-2-07"] = f"{mx(14, 14)} {mn(14, 14)}"
    a["task-18-2-08"] = f"{mn(9, 9)} {mx(9, 9)}"
    # subtopic 3
    a["task-18-3-01"] = f"{4 + 20} {4 + 15}"
    a["task-18-3-02"] = _pair(_sums(_field(EX, down=["B1"]), (0, 0), (2, 2)))
    a["task-18-3-05"] = _pair(_sums(_field(F4, right=["C4", "B3"], down=["C1"]), (0, 0), (3, 3)))
    b2 = _book("18-2")
    a["task-18-3-07"] = f"{_best_to(b2, max)(19, 19)} {_best_to(b2, min)(19, 19)}"
    # subtopic 4
    w = _field([[4, 2, 7], [3, 9, 1], [6, 5, 8]], right=["A1", "B3"], down=["B2"])
    a["task-18-4-03"] = _pair(_sums(w, (0, 0)))
    b3 = _book("18-3")
    a["task-18-4-06"] = " ".join(map(str, _corners(b3)))
    best3 = _best_to(b3, max)
    a["task-18-4-07"] = str(sum(best3(r, c) is None for r in range(b3.h) for c in range(b3.w)))
    a["task-18-4-08"] = " ".join(map(str, _corners(_book("18-4"), RD, (5, 3))))
    # subtopic 5
    a["task-18-5-01"] = _pair(_sums(ex, (0, 2), (2, 0), LD))
    a["task-18-5-05"] = (
        f"{sum(sorted([70, 95, 60, 95, 81])[-2:])} {sum(sorted([40, 52, 33, 47, 39])[:2])}"
    )
    mx5, mn5 = _corners(_book("18-5"), LD, (0, 19))
    a["task-18-5-06"] = f"{mn5} {mx5}"
    a["task-18-5-07"] = " ".join(map(str, _starts(_book("18-6"), 3)))
    # subtopic 6
    a["task-18-6-01"] = _pair(_sums(ex, (0, 0), (2, 2), DIAG))
    a["task-18-6-04"] = str(max(61 + (12 if 12 > 20 else 0), 58 + (12 if 12 > 9 else 0)))
    b7 = _book("18-7")
    a["task-18-6-07"] = f"{_best_to(b7, max, DIAG)(14, 14)} {_best_to(b7, min, DIAG)(14, 14)}"
    b8 = _book("18-8")

    def cost(p, q):
        return abs(b8.a[q[0]][q[1]] - b8.a[p[0]][p[1]])

    least = _best_to(b8, min, step=cost)
    finals = _stops(b8, least)
    a["task-18-6-08"] = f"{min(least(*e) for e in finals)} {max(least(*e) for e in finals)}"
    # subtopic 7
    even = lambda f, p: f.a[p[0]][p[1]] if f.a[p[0]][p[1]] % 2 == 0 else 0  # noqa: E731
    a["task-18-7-01"] = _pair(_sums(ex, (0, 0), (2, 2), weight=even))
    # subtopic 8
    row = [4, -9, 6, -2, 5]
    rook = max(
        row[0] + sum(row[i] for i in inner) + row[-1]
        for k in range(len(row) - 1)
        for inner in combinations(range(1, len(row) - 1), k)
    )
    a["task-18-8-01"] = f"{rook} {sum(row)}"
    a["task-18-8-03"] = str(
        sum(1 for _ in _routes(_field([[0] * 5 for _ in range(5)]), (0, 0), (4, 4)))
    )
    walls = _field(F4, right=["C4"], down=["C1"])
    a["task-18-8-04"] = str(sum(1 for _ in _routes(walls, (0, 0), (3, 3))))
    b9 = _book("18-9")

    def ok(p, q) -> bool:
        return abs(b9.a[p[0]][p[1]] - b9.a[q[0]][q[1]]) <= 50

    @cache
    def count(r: int, c: int) -> int:
        if (r, c) == (0, 0):
            return 1
        return (count(r, c - 1) if c and ok((r, c - 1), (r, c)) else 0) + (
            count(r - 1, c) if r and ok((r - 1, c), (r, c)) else 0
        )

    zero = sum(count(r, c) == 0 for r in range(15) for c in range(15))
    a["task-18-8-07"] = f"{count(14, 14)} {zero}"
    # Практика и итог
    mx3, mn3 = _best_to(b3, max), _best_to(b3, min)
    ends = _stops(b3, mx3)
    a["task-18-9-01"] = (
        f"{sum(sorted(mx3(*e) for e in ends)[-2:])} {sum(sorted(mn3(*e) for e in ends)[:2])}"
    )
    a["task-18-9-02"] = " ".join(map(str, _corners(b2)))
    a["task-18-9-03"] = " ".join(map(str, _starts(_book("18-6"), 2)))
    a["task-18-9-04"] = f"{_best_to(b1, max, DIAG)(14, 14)} {_best_to(b1, min, DIAG)(14, 14)}"
    a["task-18-9-05"] = " ".join(map(str, _corners(_book("18-4"))))
    return a


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(33))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [18] and not task.catalog_visible and not task.archived
        on_final_page = task_id in FINAL
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id in ADVANCED
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_book_tasks_attach_the_book_and_show_the_formulas() -> None:
    for task_id, task in _entries().items():
        code = [b for b in task.explanation if b.type == "code_example"]
        assert all(b.data.language == "text" for b in code), task_id
        if task.files:
            assert [f.filename for f in task.files][0].endswith(".xlsx"), task_id
            formulas = code[0].data.code if len(code) == 1 else ""
            assert "=" in formulas or "МАКС" in formulas, task_id
            assert all(len(line) <= 64 for line in code[0].data.code.splitlines()), task_id


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(
    answers: dict[str, str],
) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        tokens = expected.split()
        tokens[-1] = str(int(tokens[-1]) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id


def test_tasks_of_the_removed_sections_are_archived() -> None:
    tasks = {entry.task.id: entry.task for entry in _bank().tasks}
    for task_id in ARCHIVED:
        task = tasks[task_id]
        assert task.archived and not task.catalog_visible, task_id
        assert not task.lessons and not task.theory_links, task_id
