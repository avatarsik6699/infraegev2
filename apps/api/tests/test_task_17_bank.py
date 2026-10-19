"""Independent answer and content checks for the EGE topic 17 lesson «Числовые последовательности».

The lesson loops over indices with arithmetic checks. Here every answer is recomputed
another way: windows by ``zip`` over shifted lists, digits from the decimal string,
averages as exact fractions, triangles by all three inequalities without sorting and
pairs of any positions by ``combinations`` or remainder counts. The bank's own
solution programs, run next to their attachments, must print the same answers.
"""

import shutil
import subprocess
import sys
import tempfile
from collections import Counter
from fractions import Fraction
from itertools import combinations, permutations
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
FILES = ROOT / "content/lesson-files/topic-17"
MATERIAL = "number-sequences"
RETIRED = [f"task-17-{number:02d}" for number in range(1, 9)]

Group = tuple[int, ...]


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _read(name: str) -> list[int]:
    return [int(part) for part in (FILES / name).read_text().split()]


def _windows(a: list[int], k: int) -> list[Group]:
    return list(zip(*(a[i:] for i in range(k)), strict=False))


def _digits(x: int) -> str:
    return str(x).lstrip("-")


def _ends(x: int, tail: str) -> bool:
    return _digits(x).endswith(tail)


def _answer(groups: list[Group], test, value=sum, pick=max) -> str:
    chosen = [value(g) for g in groups if test(g)]
    return f"{len(chosen)} {pick(chosen)}"


def _exactly(g: Group, test, k: int = 1) -> bool:
    return [test(x) for x in g].count(True) == k


def _triangle(g: Group) -> bool:
    p, q, r = g
    return p + q > r and p + r > q and q + r > p


def _right(g: Group) -> bool:
    return any(p * p + q * q == r * r for p, q, r in permutations(g))


def _largest_square_gap(g: Group) -> int:
    """Sign of p² + q² − r² for the longest side r: > 0 acute, < 0 obtuse."""
    r = max(g)
    rest = list(g)
    rest.remove(r)
    return rest[0] ** 2 + rest[1] ** 2 - r**2


def _mean(values: list[int]) -> Fraction:
    return Fraction(sum(values), len(values))


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    f1, f2, f3, f4 = (_read(f"17-{k}.txt") for k in range(1, 5))
    f5, f6 = _read("17-5.txt"), _read("17-6.txt")

    # subtopic 1
    a["task-17-1-05"] = f"{sum(x * x for x in (2, 7))} {sum((2, 7)) ** 2}"
    a["task-17-1-06"] = f"{10 + 20 + 30} {3 + 10 + 20 + 30}"
    nines = [x for x in f1 if x % 9 == 0]
    a["task-17-1-07"] = f"{len(nines)} {len([x for x in nines if x > 0])}"
    a["task-17-1-08"] = (
        f"{len([x for x in f1 if x % 4 == 0 and x % 8])} {len([x for x in f1 if abs(x) <= 100])}"
    )
    # subtopic 2
    kinds = [(x % 4 == 0) + (x % 6 == 0) for x in f1]
    a["task-17-2-08"] = f"{kinds.count(1)} {len(kinds) - kinds.count(0)}"
    a["task-17-2-09"] = str(len([x for x in f1 if sum(x % d == 0 for d in (2, 3, 5)) >= 2]))
    # subtopic 3: digits from the decimal string
    a["task-17-3-01"] = f"{-23 - 10 * (-3)} {_digits(-23)[-1]} {-3}"
    three7 = [x for x in f1 if len(_digits(x)) == 3 and _ends(x, "7")]
    a["task-17-3-08"] = f"{len(three7)} {len([x for x in three7 if str(x)[0] == '-'])}"
    a["task-17-3-09"] = str(
        len([x for x in f1 if len(_digits(x)) > 1 and len(set(_digits(x)[-2:])) == 1])
    )
    # subtopic 4
    a["task-17-4-01"] = _answer(
        _windows([4, 7, 10, 3, -2], 2), lambda g: any(x % 2 == 0 for x in g)
    )
    a["task-17-4-02"] = _answer(
        _windows([-8, 0, 5, -3, 2], 2), lambda g: _exactly(g, lambda x: x < 0)
    )
    a["task-17-4-03"] = _answer(
        _windows([7, 12, 17, -7, 4], 2),
        lambda g: _exactly(g, lambda x: _ends(x, "7")),
        lambda g: sum(x * x for x in g),
        min,
    )
    a["task-17-4-04"] = _answer(
        _windows([100, 5, 200, 300, 7, 400], 3),
        lambda g: _exactly(g, lambda x: len(_digits(x)) == 3, 2),
    )
    a["task-17-4-05"] = " ".join(str(len(_windows(list(range(2000)), k))) for k in (2, 3, 4))
    a["task-17-4-07"] = _answer(_windows([1, 2, 3, 4, 5, 6], 4), lambda g: sum(g) % 7 == 0)
    a["task-17-4-08"] = _answer(_windows(f1, 2), lambda g: max(g) < 0 and sum(g) % 5 == 0)
    a["task-17-4-09"] = _answer(
        _windows(f1, 3),
        lambda g: _exactly(g, lambda x: len(_digits(x)) == 3, 2) and sum(g) % 4 == 0,
        pick=min,
    )
    # subtopic 5: thresholds over the whole sequence, means as fractions
    seq = [12, 117, 40, 217, 5]
    m = max(x for x in seq if _ends(x, "17"))
    a["task-17-5-01"] = f"{m} " + _answer(_windows(seq, 2), lambda g: sum(g) > m)
    seq = [-31, 6, 21, -4, 11]
    m = min(x for x in seq if _ends(x, "1"))
    a["task-17-5-05"] = _answer(
        _windows(seq, 2),
        lambda g: _exactly(g, lambda x: _ends(x, "1")) and sum(x * x for x in g) < m * m,
        lambda g: sum(x * x for x in g),
    )
    seq = [6, 9, 2, 15, 4]
    mean = _mean([x for x in seq if x % 2 == 0])
    a["task-17-5-06"] = _answer(
        _windows(seq, 2),
        lambda g: any(p % 3 == 0 and q < mean for p, q in permutations(g)),
    )
    m = max(x for x in f2 if _ends(x, "21"))
    a["task-17-5-07"] = _answer(
        _windows(f2, 3),
        lambda g: (
            _exactly(g, lambda x: len(_digits(x)) == 4, 2)
            and any(x % 7 == 0 for x in g)
            and sum(g) > m
        ),
    )
    m = len([x for x in f1 if x % 25 == 0])
    a["task-17-5-08"] = _answer(_windows(f1, 2), lambda g: min(g) < 0 and sum(g) < m)
    mean = _mean([x for x in f2 if x % 2])
    a["task-17-5-09"] = _answer(
        _windows(f2, 2),
        lambda g: any(p % 9 == 0 and q < mean for p, q in permutations(g)),
    )
    # subtopic 6: the quantity checked and the quantity printed
    a["task-17-6-01"] = f"{(-7) ** 2} {min((5 * 5, 7 * 7, 2 * 2))}"
    a["task-17-6-02"] = f"{abs(10)} {abs(-40)}"
    a["task-17-6-03"] = f"{9 % 5} {min(13 % 5, 22 % 5, 9 % 5)}"
    top = sorted((7, -2, 5), reverse=True)
    a["task-17-6-04"] = f"{top[0] + top[1]} {top[0] ** 2 + top[1] ** 2} {top[1]}"
    a["task-17-6-05"] = f"{8 + 4} {abs(-8 + 4)} {-8 * 4}"
    m = min(30, 4, 17, 9)
    a["task-17-6-06"] = _answer(_windows([30, 4, 17, 9], 2), lambda g: m in (g[0] % 7, g[1] % 7))
    a["task-17-6-07"] = _answer(
        _windows([3, -1, 6, 2], 2), lambda g: sum(g) > 4, lambda g: sum(x * x for x in g), min
    )
    m = min(f2)
    a["task-17-6-08"] = _answer(_windows(f2, 2), lambda g: m in (g[0] % 37, g[1] % 37))
    k = len([x for x in f3 if len(_digits(x)) == 4 and _ends(x, "13")])
    sums = [sum(g) for g in _windows(f3, 3) if sum(sorted(g)[1:]) < k * k]
    a["task-17-6-09"] = f"{len(sums)} {abs(max(sums))}"
    t = max(x for x in f3 if x < 0 and len(_digits(x)) == 3 and x % 7 == 0)
    a["task-17-6-10"] = _answer(
        _windows(f3, 2),
        lambda g: _exactly(g, lambda x: x < 0) and sum(g) > t,
        lambda g: sum(x * x for x in g),
        min,
    )
    # subtopic 7: triangles without sorting
    a["task-17-7-05"] = _answer(
        _windows([3, 4, 5, 6, 8, 10], 3), lambda g: _triangle(g) and _right(g)
    )
    a["task-17-7-06"] = _answer(
        _windows([10, 6, 8, 3, 4, 5, 13], 3),
        lambda g: _triangle(g) and _largest_square_gap(g) < 0,
    )
    a["task-17-7-07"] = _answer(
        _windows(f5, 3), lambda g: _triangle(g) and _largest_square_gap(g) > 0
    )
    a["task-17-7-08"] = _answer(_windows(f5, 3), lambda g: _triangle(g) and _right(g))
    # subtopic 8: pairs of any positions
    a["task-17-8-01"] = (
        f"{len(list(combinations(range(5), 2)))} {len(list(combinations(range(2000), 2)))}"
    )
    pairs = list(combinations([7, 7, 7, 7], 2))
    a["task-17-8-02"] = f"{len(pairs)} {len([p for p in pairs if p[0] != p[1]])}"
    a["task-17-8-03"] = _answer(list(combinations([3, 8, 2, 7], 2)), lambda g: sum(g) % 5 == 0)
    a["task-17-8-04"] = " ".join(
        str(next(s for s in range(7) if (r + s) % 7 == 0)) for r in (0, 3, 5)
    )
    seq = [2, 5, 8, 11, 14]
    same = Counter(x % 3 for x in seq)
    a["task-17-8-06"] = f"{sum(c * (c - 1) // 2 for c in same.values())} {max(seq) - min(seq)}"
    a["task-17-8-07"] = _answer(
        list(combinations(f6, 2)), lambda g: sum(g) % 12 == 0 and any(x % 5 == 0 for x in g)
    )
    a["task-17-8-08"] = _answer(list(combinations(f6, 2)), lambda g: g[0] * g[1] % 14 == 0)
    # Практика и итог
    a["task-17-9-01"] = _answer(
        _windows(f4, 2), lambda g: _exactly(g, lambda x: x % 3 == 0) and sum(g) % 5 == 0
    )
    m = min(x for x in f3 if x > 0 and _ends(x, "99"))
    a["task-17-9-02"] = _answer(
        _windows(f3, 3),
        lambda g: [len(_digits(x)) == 3 for x in g].count(True) <= 1 and sum(g) >= m,
        pick=min,
    )
    r3, r7 = min(f4) % 3, max(f4) % 7
    a["task-17-9-03"] = _answer(
        _windows(f4, 2),
        lambda g: r3 in (g[0] % 3, g[1] % 3) and r7 in (g[0] % 7, g[1] % 7),
    )
    m = max(x for x in f3 if _ends(x, "77"))
    sums = [
        sum(g)
        for g in _windows(f3, 3)
        if 0 not in g and len({x > 0 for x in g}) == 1 and abs(sum(g)) < m
    ]
    a["task-17-9-04"] = f"{len(sums)} {abs(max(sums))}"
    mean = _mean([x for x in f4 if x % 2 == 0])
    a["task-17-9-05"] = _answer(
        _windows(f4, 4),
        lambda g: sum(x % 3 == 0 for x in g) > sum(x % 7 == 0 for x in g) and sum(g) > 3 * mean,
    )
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
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(49))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [17] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-17-9-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith(("task-17-7-", "task-17-8-"))
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
