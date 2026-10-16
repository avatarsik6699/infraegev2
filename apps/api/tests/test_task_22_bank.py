"""Independent answer and content checks for the EGE topic 22 lesson.

The lesson «Многопроцессорные системы» fills a table of starts and finishes in Excel. The
bank's answers come from the stand's solvers (``process_figures.schedule`` and
``topic-22/datasets.py``). Here the finish of a process is asked recursively — its duration
plus the latest finish among its suppliers, remembered — the latest start by the longest path
to the end, and the processes of a book are read from the workbook attached to the bank task
(its sheet XML), not from the generator.
"""

import re
import zipfile
from functools import cache
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "parallel-computing"
System = dict[int, tuple[int, tuple[int, ...]]]

MAIN: System = {
    1: (4, ()),
    2: (6, ()),
    3: (3, (1,)),
    4: (2, (1, 2)),
    5: (5, (2,)),
    6: (4, (3, 4)),
    7: (2, (4, 5)),
    8: (1, (6, 7)),
}
EXAM: System = {
    1: (3, ()),
    2: (8, ()),
    3: (2, (1,)),
    4: (5, (1, 3)),
    5: (4, (2, 4)),
    6: (6, (3,)),
    7: (1, (5, 6)),
}


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _book(task: TaskData) -> System:
    """ID, duration and suppliers of every row of the attached workbook."""
    (usage,) = task.files
    xml = zipfile.ZipFile(BANK_DIR / "files" / usage.checksum).read("xl/worksheets/sheet1.xml")
    out: System = {}
    for row in re.findall(r'<row r="(\d+)"[^>]*>(.*?)</row>', xml.decode())[1:]:
        cells = dict(re.findall(r'<c r="([A-C])\d+"[^>]*>(?:<v>|<is><t>)([^<]*)<', row[1]))
        deps = tuple(int(x) for x in cells["C"].split(";") if x.strip() not in ("", "0"))
        out[int(cells["A"])] = (int(cells["B"]), deps)
    return out


def _times(system: System, extra: int = 0) -> dict[int, tuple[int, int]]:
    """{id: (start, finish)}; ``extra`` — a delay after every supplier."""

    @cache
    def finish(i: int) -> int:
        return start(i) + system[i][0]

    @cache
    def start(i: int) -> int:
        return max((finish(j) + extra for j in system[i][1]), default=0)

    return {i: (start(i), finish(i)) for i in system}


def _end(system: System) -> int:
    return max(f for _, f in _times(system).values())


def _late(system: System) -> dict[int, int]:
    """Latest start: the total minus the longest path from the process to the end."""
    takers = {i: [j for j in system if i in system[j][1]] for i in system}

    @cache
    def tail(i: int) -> int:
        return system[i][0] + max((tail(j) for j in takers[i]), default=0)

    return {i: _end(system) - tail(i) for i in system}


def _load(system: System, times=None) -> list[int]:
    times = times or _times(system)
    end = max(f for _, f in times.values())
    return [sum(s <= t < f for s, f in times.values()) for t in range(end)]


def _run(values: list[int], value: int) -> int:
    best = run = 0
    for v in values:
        run = run + 1 if v == value else 0
        best = max(best, run)
    return best


def _places(system: System, places: int, apart=()) -> int:
    """At most ``places`` at once, the smaller ID first; ``apart`` never together."""
    left, busy, done, t = set(system), {}, {}, 0
    while left or busy:
        done |= {i: f for i, f in busy.items() if f <= t}
        busy = {i: f for i, f in busy.items() if f > t}
        for i in sorted(left):
            ready = all(j in done for j in system[i][1])
            clash = any(i in pair and set(pair) - {i} <= set(busy) for pair in apart)
            if ready and not clash and len(busy) < places:
                busy[i] = t + system[i][0]
                left.discard(i)
        t = min(busy.values()) if busy else t + 1
    return max(done.values())


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    t = _entries()
    m = _times(MAIN)
    e = _times(EXAM)
    a: dict[str, int | str] = {}
    a["task-22-1-01"] = 12 + 7
    a["task-22-1-02"] = 30 - 8
    a["task-22-1-03"] = max(5, 9)
    a["task-22-1-04"] = 5 + 9
    a["task-22-1-07"] = _end({1: (5, ()), 2: (3, ()), 3: (4, (1, 2))})
    a["task-22-2-01"] = _end({1: (8, ()), 2: (5, ()), 3: (3, (1, 2))})
    a["task-22-2-02"] = 10 + 2 + 4
    s23: System = {1: (4, ()), 2: (7, ()), 3: (2, (1, 2)), 4: (3, (3,))}
    a["task-22-2-03"] = f"{_times(s23)[3][0]} {_end(s23)}"
    s24: System = {20: (3, (10,)), 40: (4, (20,)), 10: (5, ()), 30: (8, ()), 50: (2, (30, 40))}
    a["task-22-2-04"] = f"{_times(s24)[50][0]} {_end(s24)}"
    a["task-22-2-05"] = f"{_end({**MAIN, 5: (6, (2,))})} {_end({**MAIN, 3: (5, (1,))})}"
    a["task-22-2-07"] = _end(EXAM)
    a["task-22-3-01"] = 12
    a["task-22-3-07"] = _end(_book(t["task-22-3-07"]))
    a["task-22-4-02"] = sum(s <= 4 < f for s, f in m.values())
    a["task-22-4-03"] = sum(f <= 11 for _, f in m.values())
    a["task-22-4-04"] = sorted(f for _, f in m.values())[6 - 1]
    window = [i for i, (s, f) in m.items() if s >= 4 and f <= 12]
    a["task-22-4-05"] = f"{len(window)} {sum(window)}"
    a["task-22-4-06"] = sum(s <= 11 < f for s, f in m.values())
    a["task-22-4-07"] = sum(s <= 9 < f for s, f in e.values())
    a["task-22-4-08"] = sorted(f for _, f in e.values())[5 - 1]
    a["task-22-5-01"] = f"{4 + 3} {max(4, 3)}"
    a["task-22-5-02"] = 8 - 5
    load = _load(MAIN)
    a["task-22-5-03"] = f"{len(load)} {max(load)} {_run(load, max(load))} {load[7]}"
    a["task-22-5-04"] = _run([int(v <= 1) for v in load], 1)
    s6, f6 = m[6]
    a["task-22-5-05"] = max(sum(s <= k < f for s, f in m.values()) - 1 for k in range(s6, f6))
    a["task-22-5-06"] = max(0, min(m[3][1], m[4][1]) - max(m[3][0], m[4][0]))
    load_e = _load(EXAM)
    a["task-22-5-07"] = f"{max(load_e)} {_run(load_e, max(load_e))}"
    four: System = {1: (4, ()), 2: (4, ()), 3: (2, (2,)), 4: (4, (2,))}
    late4 = _late(four)
    a["task-22-6-01"] = f"{late4[1]} {late4[2] - _times(four)[2][0]}"
    late = _late(MAIN)
    a["task-22-6-02"] = f"{late[4]} {late[1] - m[1][0]}"
    a["task-22-6-03"] = " ".join(str(i) for i in sorted(MAIN) if late[i] == m[i][0])
    a["task-22-6-04"] = sum(v >= 10 for v in late.values())
    # 6.5: process 3 lasts 3; process 1 shifted to its latest start 4 joins 3 and 4
    four3 = {**four, 3: (3, (2,))}
    shifted = {1: (4, 8), 2: (0, 4), 3: (4, 7), 4: (4, 8)}
    assert all(shifted[i][1] - shifted[i][0] == four3[i][0] for i in four3)
    assert all(shifted[j][1] <= shifted[i][0] for i in four3 for j in four3[i][1])
    assert max(f for _, f in shifted.values()) == _end(four)
    a["task-22-6-05"] = sum(v >= 3 for v in _load(four3, shifted))
    a["task-22-6-07"] = sum(v >= 6 for v in _late(EXAM).values())
    s72: System = {1: (3, ()), 2: (5, ()), 3: (4, (1, 2)), 4: (2, (3,))}
    d72 = _times(s72, extra=2)
    a["task-22-7-02"] = f"{d72[4][0]} {max(f for _, f in d72.values())}"
    xs = range(1, 30)
    a["task-22-7-03"] = (
        f"{next(x for x in xs if _end({**MAIN, 6: (x, (3, 4))}) == 16)} "
        f"{max(x for x in xs if _end({**MAIN, 6: (x, (3, 4))}) == 14)}"
    )
    a["task-22-7-04"] = max(6 + 4, 8 + 1)
    a["task-22-7-05"] = len({v for se in e.values() for v in se}) - 1
    a["task-22-7-06"] = _run(load_e, 2)
    a["task-22-8-01"] = _places(
        {1: (4, ()), 2: (4, ()), 3: (3, ()), 4: (2, (1,)), 5: (1, (2, 3))}, 2
    )
    a["task-22-8-03"] = _places(MAIN, 99, apart=((4, 5),))
    s85: System = {1: (3, ()), 2: (2, ()), 3: (4, ()), 4: (1, (1, 2)), 5: (2, (3,))}
    a["task-22-8-05"] = _places(s85, 2)
    a["task-22-8-06"] = f"{_end(s85)} {_places(s85, 2) - _end(s85)}"
    a["task-22-9-01"] = _end(_book(t["task-22-9-01"]))
    b2 = _times(_book(t["task-22-9-02"]))
    a["task-22-9-02"] = sum(s <= 20 < f for s, f in b2.values())
    b4 = _times(_book(t["task-22-9-03"]))
    a["task-22-9-03"] = sorted(f for _, f in b4.values())[10 - 1]
    load3 = _load(_book(t["task-22-9-04"]))
    a["task-22-9-04"] = _run(load3, max(load3))
    a["task-22-9-05"] = sum(v >= 20 for v in _late(_book(t["task-22-9-05"])).values())
    return {k: str(v) for k, v in a.items()}


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(47))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [22] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-22-9-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith(("task-22-7-", "task-22-8-"))
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_book_tasks_attach_the_book_and_show_the_formulas() -> None:
    for task_id, task in _entries().items():
        code = [b for b in task.explanation if b.type == "code_example"]
        assert all(b.data.language == "text" for b in code), task_id
        assert bool(task.files) == bool(code), task_id
        if task.files:
            (usage,) = task.files
            assert usage.filename.endswith(".xlsx") and usage.purpose == "attachment", task_id
            assert "ВПР(" in code[0].data.code, task_id
            assert all(len(line) <= 64 for line in code[0].data.code.splitlines()), task_id


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        tokens = expected.split()
        tokens[-1] = str(int(tokens[-1]) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id
