"""Independent answer and content checks for the EGE topic 13 lesson.

The lesson «Анализ хода исполнения алгоритма» counts programs of a numeric executor with a
table of counts (``topic-13/bank.py`` uses the stand's executor). Here every program is walked
one by one, depth first, and its trajectory is checked as a whole: mandatory numbers on it,
forbidden numbers off it, an exact length, no two multiplications in a row. The start, the
result and the numbers of an exam-format task are read from the bank task's own text.
"""

import re
import subprocess
import sys
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "branching-and-enumeration"


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _step(op: str, x: int) -> int | None:
    if op == "+1":
        return x + 1
    if op == "+2":
        return x + 2
    if op == "+3":
        return x + 3
    if op == "*2":
        return 2 * x
    if op == "*3":
        return 3 * x
    if op == "-1":
        return x - 1
    if op == "-2":
        return x - 2
    if op == "2x+1":
        return 2 * x + 1
    if op == "3x+2":
        return 3 * x + 2
    if op == "sq":
        return x * x
    if op == "app4":
        return 10 * x + 4
    if op == "swap":
        tens, units = x // 10 % 10, x % 10
        return x - 9 * tens + 9 * units if tens < units else None
    if op == "half":
        return x // 2 if x % 2 == 0 else None
    if op == "floor2":
        return x // 2
    if op == "ceil2":
        return (x + 1) // 2
    if op == "floor3":
        return x // 3
    if op == "half_or_minus3":
        return x // 2 if x % 2 == 0 else x - 3
    raise ValueError(op)


def _runs(start: int, target: int, ops: list[str]):
    """Every program from start to target: (its commands, its trajectory)."""
    up = target > start

    def walk(path: list[int], used: list[str]):
        x = path[-1]
        if x == target:
            yield list(used), list(path)
            return
        for op in ops:
            y = _step(op, x)
            if y is None or (y > target if up else y < target) or y == x:
                continue
            yield from walk([*path, y], [*used, op])

    yield from walk([start], [])


def _paths(start: int, target: int, ops: list[str]):
    return (path for _, path in _runs(start, target, ops))


def _count(start, target, ops, must=(), forbid=()) -> int:
    return sum(
        1
        for p in _paths(start, target, ops)
        if all(m in p for m in must) and not any(f in p for f in forbid)
    )


def _exam(task: TaskData, ops: list[str]) -> int:
    text = " ".join(b.data.markdown for b in task.statement if b.type == "text")
    found = re.search(r"исходном числе (\d+) результатом является число (\d+)", text)
    assert found, text
    start, target = map(int, found.groups())
    must = [int(x) for x in re.findall(r"(?<!не )содержит число (\d+)", text)]
    forbid = [int(x) for x in re.findall(r"не содержит числа (\d+)", text)]
    return _count(start, target, ops, must, forbid)


def _programs(start: int, ops: list[str], length: int):
    """Every program of exactly ``length`` commands with its trajectory."""
    if length == 0:
        yield "", [start]
        return
    for k, op in enumerate(ops):
        y = _step(op, start)
        if y is None:
            continue
        for rest, path in _programs(y, ops, length - 1):
            yield str(k + 1) + rest, [start, *path]


UP = ["+1", "*2"]


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    t = _entries()
    a: dict[str, int | str] = {}
    x = 3
    for op in ("+1", "*2", "+1"):
        x = _step(op, x) or 0
    a["task-13-1-01"] = x
    a["task-13-1-02"] = _count(3, 9, UP)
    a["task-13-1-03"] = _count(3, 10, UP)
    a["task-13-1-07"] = _exam(t["task-13-1-07"], ["+1", "*3"])
    a["task-13-2-01"] = _count(2, 8, UP)
    a["task-13-2-02"] = _count(1, 9, ["+1", "+2", "*2"])
    a["task-13-2-03"] = _count(2, 13, ["+2", "*3"])
    a["task-13-2-04"] = _count(1, 16, UP)
    a["task-13-2-05"] = _count(3, 25, ["+1", "*3"])
    a["task-13-2-06"] = _exam(t["task-13-2-06"], UP)
    a["task-13-2-07"] = _exam(t["task-13-2-07"], ["+1", "+2", "*3"])
    a["task-13-3-01"] = _count(2, 12, UP, must=[5])
    a["task-13-3-02"] = _count(2, 12, UP, forbid=[5])
    a["task-13-3-03"] = _count(2, 16, UP, must=[6], forbid=[9])
    a["task-13-3-04"] = _count(2, 16, UP, must=[4, 8])
    a["task-13-3-05"] = _count(2, 20, UP, forbid=[7, 17])
    a["task-13-3-06"] = _exam(t["task-13-3-06"], UP)
    a["task-13-3-07"] = _exam(t["task-13-3-07"], UP)
    a["task-13-4-01"] = _count(1, 13, ["+1", "2x+1"], forbid=[8])
    a["task-13-4-02"] = _count(1, 40, ["+1", "app4"])
    a["task-13-4-03"] = _count(2, 20, ["+1", "sq"])
    a["task-13-4-04"] = _count(1, 30, ["+1", "3x+2"])
    a["task-13-4-05"] = _count(12, 45, ["+1", "swap"])
    a["task-13-4-06"] = _exam(t["task-13-4-06"], ["+1", "swap"])
    a["task-13-4-07"] = _count(101, 135, ["+1", "swap"])
    a["task-13-5-01"] = _count(12, 2, ["-1", "half"])
    a["task-13-5-02"] = _count(12, 2, ["-1", "floor2"])
    a["task-13-5-03"] = _count(12, 2, ["-1", "ceil2"])
    a["task-13-5-04"] = _count(16, 2, ["-1", "half_or_minus3"])
    a["task-13-5-05"] = _count(25, 4, ["-2", "floor2"])
    a["task-13-5-06"] = _exam(t["task-13-5-06"], ["-1", "floor2"])
    a["task-13-5-07"] = _exam(t["task-13-5-07"], ["-1", "floor3"])
    a["task-13-6-02"] = _count(2, 8, UP)
    # 6.3: the forbidden target checked after «x == y» — every program to 6 counts
    a["task-13-6-03"] = _count(2, 6, UP)
    # 6.4: the table loop with «dp[y] = dp[x]» in place of «+=»
    dp = dict.fromkeys(range(2, 13), 0)
    dp[2] = 1
    for x in range(2, 12):
        for y in (x + 1, 2 * x):
            if y <= 12:
                dp[y] = dp[x]
    a["task-13-6-04"] = dp[12]
    a["task-13-6-05"] = _count(1, 10, ["+1", "+2", "*2"])
    a["task-13-6-06"] = _count(12, 2, ["-1", "floor2"])
    a["task-13-6-07"] = _count(2, 40, UP, must=[10], forbid=[25])
    paths = list(_paths(2, 6, UP))
    either = sum(3 in p or 4 in p for p in paths)
    a["task-13-7-01"] = either
    a["task-13-7-02"] = _count(2, 11, ["+1", "+3"])
    paths = list(_paths(2, 12, UP))
    both = sum(4 in p and 8 in p for p in paths)
    either = sum(4 in p or 8 in p for p in paths)
    a["task-13-7-04"] = len(paths) - both  # not through both
    a["task-13-7-05"] = sum((6 in p or 8 in p) and 15 not in p for p in _paths(2, 20, UP))
    a["task-13-7-06"] = _count(1, 15, ["+1", "+3"])
    a["task-13-7-07"] = min(n for n in range(1, 26) if _count(1, n, UP) == 20)
    five = [path for _, path in _programs(2, UP, 5) if path[-1] == 12]
    a["task-13-8-01"] = len(five)
    a["task-13-8-03"] = sum(1 for _, p in _programs(2, UP, 4) if p[-1] == 12)
    a["task-13-8-04"] = sum(
        1
        for used, _ in _runs(1, 16, UP)
        if not any(used[i] == used[i + 1] == "*2" for i in range(len(used) - 1))
    )
    seen = {p[-1] for k in range(6) for _, p in _programs(2, UP, k)}
    a["task-13-8-05"] = min(n for n in range(3, 100) if n not in seen)
    a["task-13-8-06"] = sum(6 in p for p in five)
    a["task-13-9-01"] = _exam(t["task-13-9-01"], UP)
    a["task-13-9-02"] = _exam(t["task-13-9-02"], ["+1", "+2", "*2"])
    a["task-13-9-03"] = _exam(t["task-13-9-03"], ["+1", "swap"])
    a["task-13-9-04"] = _exam(t["task-13-9-04"], ["-1", "floor2"])
    a["task-13-9-05"] = _exam(t["task-13-9-05"], ["+2", "*3"])
    return {k: str(v) for k, v in a.items()}


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(54))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [13] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-13-9-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith(("task-13-7-", "task-13-8-"))
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        tokens = expected.split()
        tokens[-1] = str(int(tokens[-1]) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id


def test_solution_programs_print_the_answer(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        (code,) = [
            block.data.code
            for block in task.explanation
            if block.type == "code_example" and block.data.language == "python"
        ]
        result = subprocess.run(
            [sys.executable, "-I", "-c", code],
            capture_output=True,
            text=True,
            check=True,
            timeout=120,
        )
        assert result.stdout.strip() == answers[task_id], task_id
        assert all(len(line) <= 64 for line in code.splitlines()), task_id
