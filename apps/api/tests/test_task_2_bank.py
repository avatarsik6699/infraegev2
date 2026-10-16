"""Independent answer and content checks for the EGE topic 2 lesson «Таблицы истинности».

The bank's answers parse each formula of the stand (``topic-2/bank.py``). Here every
formula is written out again as a Python function, and the fragment of a task is read
from the bank task itself (its ``table`` block). An order of the columns is accepted when
the rows can take different sets one after another (backtracking), not by trying every
combination of the rows at once.
"""

import re
from itertools import permutations, product
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "truth-tables"


def imp(a: int, b: int) -> int:
    return 0 if a == 1 and b == 0 else 1


def eqv(a: int, b: int) -> int:
    return int(a == b)


FORMULAS = {
    "task-2-3-03": ("abc", lambda a, b, c: (a | b) & imp(a, c)),
    "task-2-3-07": ("xyz", lambda x, y, z: imp(x | y, eqv(z, x))),
    "task-2-3-08": ("xyz", lambda x, y, z: (1 - (x & z)) & imp(y, x)),
    "task-2-4-01": ("xyzw", lambda x, y, z, w: 1 - (imp(x, z) & imp(z, w) & imp(w, y))),
    "task-2-4-04": ("xyz", lambda x, y, z: (x | y) & (1 - eqv(y, z))),
    "task-2-4-05": ("xyzw", lambda x, y, z, w: (x & (1 - y)) | eqv(y, z) | (1 - w)),
    "task-2-4-06": ("xyzw", lambda x, y, z, w: (imp(x, y) & imp(y, w)) | eqv(z, x | y)),
    "task-2-5-07": ("xyzw", lambda x, y, z, w: (1 - (x | (1 - y))) | imp(z, w)),
    "task-2-5-08": ("xyzw", lambda x, y, z, w: imp(w, x) & (y | z) & (1 - eqv(x, y))),
    "task-2-6-05": (
        "xyz",
        lambda x, y, z: (imp(x, y) & z, x | (1 - z)),
    ),
    "task-2-6-06": (
        "xyz",
        lambda x, y, z: ((x & (1 - y)) | z, y | eqv(x, z)),
    ),
    "task-2-7-01": ("xyz", lambda x, y, z: imp(y, x) & eqv(z, 1 - x)),
    "task-2-7-02": ("xyzw", lambda x, y, z, w: imp(x, y) & imp(y, z) & imp(z, w)),
    "task-2-7-03": ("xyzw", lambda x, y, z, w: (1 - (x | y)) | eqv(z, w) | (x & (1 - z))),
    "task-2-7-04": ("xyzw", lambda x, y, z, w: eqv(imp(y, z) & (1 - w), x | w)),
    "task-2-7-05": ("xyz", lambda x, y, z: (1 - imp(x, z)) | (y & z)),
}


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _rows(task: TaskData) -> list[tuple[str, tuple[int | None, ...]]]:
    (block,) = [b for b in task.statement if b.type == "table"]
    head = block.data.headers
    out = []
    for row in block.data.rows:
        cells = dict(zip(head, row, strict=True))
        pattern = "".join(cells[h] for h in head if h.startswith("C"))
        values = tuple(
            None if cells[h] == "?" else int(cells[h]) for h in head if h.startswith("F")
        )
        out.append((pattern, values))
    return out


def _fits(names: str, order, fn, pattern: str, wanted) -> list[tuple[int, ...]]:
    """Sets of the variables that a row of the fragment can be under this order."""
    out = []
    for bits in product((0, 1), repeat=len(names)):
        if all(p == "*" or int(p) == b for p, b in zip(pattern, bits, strict=True)):
            v = dict(zip(order, bits, strict=True))
            got = fn(*(v[n] for n in names))
            got = got if isinstance(got, tuple) else (got,)
            if all(w is None or w == g for w, g in zip(wanted, got, strict=True)):
                out.append(bits)
    return out


def _orders(names: str, fn, rows) -> list[str]:
    found = []
    for order in permutations(names):
        options = [_fits(names, order, fn, pattern, wanted) for pattern, wanted in rows]

        def place(k: int, used: frozenset, options=options) -> bool:
            if k == len(options):
                return True
            return any(place(k + 1, used | {s}) for s in options[k] if s not in used)

        if place(0, frozenset()):
            found.append("".join(order))
    return found


def _zeros(names: str, fn, wanted: int) -> str:
    return " ".join(
        "".join(map(str, bits))
        for bits in product((0, 1), repeat=len(names))
        if fn(*bits) == wanted
    )


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    tasks = _entries()
    a: dict[str, str] = {}
    for task_id, (names, fn) in FORMULAS.items():
        (a[task_id],) = _orders(names, fn, _rows(tasks[task_id]))
    a["task-2-1-03"] = " ".join(str(v) for v in (imp(1, 1), imp(1, 1), eqv(1, 1), 0 | 1))
    a["task-2-1-05"] = " ".join(
        f"{p}{q}" for p in (0, 1) for q in (0, 1) if (p & q) == 0 and (p | q) == 1
    )
    (a["task-2-1-07"],) = _orders("xy", lambda x, y: (1 - x) & y, [("10", (1,))])
    (a["task-2-1-08"],) = _orders("xy", lambda x, y: x | (1 - y), [("01", (0,))])
    a["task-2-2-05"] = str(len(list(product((0, 1), repeat=5))))
    a["task-2-2-06"] = _zeros("xyz", lambda x, y, z: imp(x, y) | (1 - z), 0)
    f28 = FORMULAS["task-2-4-05"][1]
    a["task-2-2-08"] = _zeros("xyzw", f28, 0)
    a["task-2-4-02"] = _zeros("xyz", lambda x, y, z: imp(x, y) & imp(y, z), 1)
    (a["task-2-4-03"],) = _orders(
        "xyz", lambda x, y, z: imp(x, y) & imp(y, z), [("*01", (1,)), ("*01", (1,))]
    )
    a["task-2-5-03"] = _zeros("xyzw", f28, 0)
    a["task-2-5-04"] = str(len(_zeros("xyzw", FORMULAS["task-2-4-06"][1], 1).split()))
    # the print is in the body of the y loop: one line for every pair x, y
    a["task-2-5-05"] = str(2 * 2)
    a["task-2-6-02"] = str(1 - (0 | (1 - (0 | 1))))
    a["task-2-6-04"] = f"{4**3} {4**3 * 24}"
    return a


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(30))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [2] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-2-7-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith("task-2-6-")
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_fragment_tasks_show_their_table() -> None:
    for task_id, task in _entries().items():
        tables = [b for b in task.statement if b.type == "table"]
        assert (len(tables) == 1) == (task_id in FORMULAS), task_id
        assert not task.files, task_id


def test_program_task_shows_the_program() -> None:
    task = _entries()["task-2-5-05"]
    (code,) = [b for b in task.statement if b.type == "code_example"]
    assert code.data.language == "python"
    assert re.search(r"^        print\(", code.data.code, re.M)


def test_checker_accepts_the_answer_and_rejects_a_neighbour(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        if expected.isalpha():  # an order of the columns: two letters swapped
            wrong = expected[1] + expected[0] + expected[2:]
        else:  # a set or a number gets one more digit
            wrong = expected + "0"
        assert not is_correct(task.checker, wrong), task_id
