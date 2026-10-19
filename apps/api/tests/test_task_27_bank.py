"""Independent answer and content checks for the EGE topic 27 lesson «Кластеризация».

The lesson splits points by bounds read from the scatter diagram, finds a center by a
double loop over candidates and scales the answer with ``int``. Here every answer is
recomputed another way: clusters are the connected groups of close points (union-find)
or the parts between the largest gaps, energies are cut at their three largest gaps, a
center comes from paired sums (each distance once, added to both ends) or as the median
of energies, distances use ``hypot`` and short answers use exact fractions and integer
square roots. The bank's own solution programs, run next to their attachments, must
print the same answers.
"""

import cmath
import math
import re
import shutil
import subprocess
import sys
import tempfile
from collections import Counter
from fractions import Fraction
from math import fsum, hypot, isqrt
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
FILES = ROOT / "content/lesson-files/topic-27"
MATERIAL = "data-analysis"
RETIRED = [f"task-27-{number:02d}" for number in range(1, 8)]


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _rows(name: str) -> list[list[str]]:
    return [line.replace(",", ".").split() for line in (FILES / name).read_text().splitlines()]


def _points(name: str) -> list[tuple[float, float]]:
    return [(float(r[0]), float(r[1])) for r in _rows(name)]


def _d(a, b) -> float:
    return hypot(a[0] - b[0], a[1] - b[1])


def _i4(v: float) -> str:
    return str(math.trunc(v * 10000))


def _num(v) -> str:
    """An exact number the way the lesson prints it: 5, 2.5."""
    v = Fraction(v)
    return str(v.numerator) if v.denominator == 1 else str(float(v))


def _chains(items, eps, key=lambda p: p):
    """Connected groups of points closer than eps (union-find), largest first."""
    parent = list(range(len(items)))

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if _d(key(items[i]), key(items[j])) <= eps:
                parent[find(i)] = find(j)
    groups: dict[int, list] = {}
    for i, item in enumerate(items):
        groups.setdefault(find(i), []).append(item)
    return sorted(groups.values(), key=len, reverse=True)


def _center(cluster, dd=_d, key=lambda p: p):
    """Paired sums: every distance once, added to both ends."""
    n = len(cluster)
    totals: list[list[float]] = [[] for _ in range(n)]
    for i in range(n):
        for j in range(i + 1, n):
            v = dd(key(cluster[i]), key(cluster[j]))
            totals[i].append(v)
            totals[j].append(v)
    sums = [fsum(t) for t in totals]
    return cluster[sums.index(min(sums))]


def _energy(r) -> float:
    return float(r[4]) * (float(r[2]) ** 2 + float(r[3]) ** 2) / 2


def _energy_groups(parts):
    """Sort by energy and cut at the three largest gaps."""
    srt = sorted(parts, key=_energy)
    gaps = sorted(range(len(srt) - 1), key=lambda i: _energy(srt[i + 1]) - _energy(srt[i]))[-3:]
    groups, start = [], 0
    for i in sorted(gaps):
        groups.append(srt[start : i + 1])
        start = i + 1
    groups.append(srt[start:])
    return groups


def _median_center(group, order):
    """The smallest sum of |ΔE| is at a median energy; of two equal medians the lesson
    keeps the one that comes first in the file."""
    srt = sorted(group, key=_energy)
    n = len(srt)
    middles = [srt[(n - 1) // 2], srt[n // 2]]
    return min(middles, key=lambda r: order[id(r)])


def _kind(code: str, cls: str, lum: str) -> bool:
    return re.fullmatch(f"{cls}\\d{lum}", code) is not None


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    # subtopic 1: exact arithmetic
    a["task-27-1-01"] = str(isqrt(3**2 + 4**2))
    a["task-27-1-03"] = str(isqrt(6**2 + 8**2))
    clusters = [[(0, 0), (1, 1)], [(5, 5), (6, 5), (7, 6)], [(10, 0)]]
    a["task-27-1-04"] = f"{len(clusters)} {len(clusters[1])} {clusters[1][-1][0]}"
    # distance in hundredths: floor(d · 10⁴) = isqrt(d² · 10⁸) exactly
    a["task-27-1-08"] = str(isqrt((460**2 + 265**2) * 10**4))
    # subtopic 2
    stars = _rows("27-3.txt")
    codes = Counter(r[2] for r in stars)
    a["task-27-2-05"] = f"{len(stars)} {codes['VII']}"
    a["task-27-2-06"] = str(sum(n for c, n in codes.items() if _kind(c, "M", "III")))
    a["task-27-2-07"] = _num(Fraction(2) * ((-1) ** 2 + 3**2) / 2)
    parts = _rows("27-4.txt")
    best = max(Fraction(r[4]) * (Fraction(r[2]) ** 2 + Fraction(r[3]) ** 2) / 2 for r in parts)
    a["task-27-2-08"] = str(math.floor(best * 10000))
    # subtopic 3: groups of neighbours instead of bounds
    a["task-27-3-05"] = _num(round(math.degrees(cmath.phase(complex(-3, 3)))))
    g1 = sorted(_chains(_points("27-1.txt"), 1.0), key=lambda g: min(p[0] for p in g))
    assert len(g1) == 2
    a["task-27-3-07"] = f"{len(g1[0])} {len(g1[1])}"
    g3 = _chains([(float(r[0]), float(r[1]), r[2]) for r in stars], 0.8)
    assert len(g3) == 3
    a["task-27-3-08"] = " ".join(str(len(g)) for g in sorted(g3, key=len))
    # subtopic 4
    c = _center(g1[0])
    a["task-27-4-08"] = f"{_i4(c[0])} {_i4(c[1])}"
    order = {id(r): i for i, r in enumerate(parts)}
    eg = _energy_groups(parts)
    assert all(_energy(g[-1]) - _energy(g[0]) <= 2 for g in eg)
    a["task-27-4-09"] = _i4(_energy(_median_center(eg[0], order)))
    # subtopic 5
    a["task-27-5-01"] = f"{_num(Fraction(-2 + 6, 2))} {_num(Fraction(4 + 10, 2))}"
    a["task-27-5-02"] = f"{abs(min(-5, 2, 4))} {abs(min(3, -7, 1))}"
    a["task-27-5-03"] = f"3 {_num(Fraction(2 + 3 + 7, 3))}"
    a["task-27-5-05"] = f"{_num(abs(Fraction(-6 + 2 + 1, 3)))} {_num(Fraction(6 + 2 + 1, 3))}"
    c1s = [_center(g) for g in g1]
    a["task-27-5-07"] = f"{_i4(fsum(c[0] for c in c1s) / 2)} {_i4(fsum(c[1] for c in c1s) / 2)}"
    g2 = _chains(_points("27-2.txt"), 1.0)
    big3 = sorted((g for g in g2 if len(g) > 10), key=len)
    assert len(big3) == 3 and sum(len(g) for g in g2 if len(g) <= 10) == 3
    c2s = [_center(g) for g in big3]
    rest = c2s[1:]
    a["task-27-5-08"] = " ".join(
        [
            _i4(abs(min(c[0] for c in c2s))),
            _i4(abs(min(c[1] for c in c2s))),
            _i4(fsum(c[0] for c in rest) / 2),
            _i4(fsum(c[1] for c in rest) / 2),
        ]
    )
    # subtopic 6
    ds = [_d(p, q) for p in [(0, 0), (1, 0)] for q in [(4, 0), (6, 0)]]
    a["task-27-6-01"] = f"{_num(round(min(ds)))} {_num(round(max(ds)))}"
    xs = [0, 1, 3, 4, 10]  # all on the axis: the distance is |x − 1|
    a["task-27-6-04"] = (
        f"{sum(abs(x - 1) <= 3 for x in xs)} {sum(abs(x - 1) < 3 for x in xs)} "
        f"{sum(abs(x - 1) <= 3 for x in xs if x != 1)}"
    )
    centers3 = {id(g): _center(g, key=lambda s: s[:2]) for g in g3}
    small3 = min(g3, key=len)
    near = min(
        (s for s in small3 if _kind(s[2], "M", "III")),
        key=lambda s: _d(s, centers3[id(small3)]),
    )
    a["task-27-6-07"] = f"{_i4(near[0])} {_i4(near[1])}"

    def giants(g):
        return sum(_kind(s[2], "M", "III") for s in g)

    lo, hi = min(g3, key=giants), max(g3, key=giants)
    b1 = _d(centers3[id(lo)], centers3[id(hi)])
    b2 = max(
        _d(p, q)
        for g in g3
        for p in g
        for q in g
        if p is not q and _kind(p[2], "G", "V") and _kind(q[2], "G", "V")
    )
    a["task-27-6-08"] = f"{_i4(b1)} {_i4(b2)}"
    q1 = _d(c2s[0], c2s[-1])
    q2 = max(_d(c, p) for c, g in zip(c2s, big3, strict=True) for p in g)
    a["task-27-6-09"] = f"{_i4(q1)} {_i4(q2)}"
    # subtopic 7
    p5 = _points("27-5.txt")
    ok = [e for e in range(1, 8) if sorted(len(g) for g in _chains(p5, e)) == [69, 76, 83]]
    a["task-27-7-07"] = str(max(ok))
    c6 = [_center(g) for g in _chains(_points("27-6.txt"), 0.5)]
    a["task-27-7-08"] = f"{_i4(fsum(c[0] for c in c6) / 2)} {_i4(fsum(c[1] for c in c6) / 2)}"
    # subtopic 8
    a["task-27-8-06"] = f"{isqrt(6**2 + 8**2)} {_num(Fraction(isqrt(6**2 + 8**2), 2))}"

    def minimax_radius(g):
        return min(max(_d(c, p) for p in g) for c in g)

    a["task-27-8-07"] = _i4(fsum(minimax_radius(g) for g in g1) / 2)
    sm = big3[0]
    anti = max(sm, key=lambda c: fsum(_d(c, p) for p in sm))
    a["task-27-8-08"] = _i4(abs(anti[0] + anti[1]))
    # Практика и итог
    a["task-27-9-01"] = _i4(_d(c1s[0], c1s[1]))
    a["task-27-9-02"] = _i4(max(_d(c2s[0], p) for p in big3[-1]))
    a["task-27-9-03"] = str(sum(s[2] == "VII" for s in max(g3, key=len)))
    q1 = max(
        hypot(float(r[0]) - float(s[0]), float(r[1]) - float(s[1]))
        for g in eg
        for r in g
        for s in g
        if r is not s and r[5] == "II" and s[5] == "II"
    )
    q2 = max(_energy(_median_center(g, order)) for g in eg)
    a["task-27-9-04"] = f"{_i4(q1)} {_i4(q2)}"
    c5 = [_center(g) for g in _chains(p5, 3)]
    a["task-27-9-05"] = (
        f"{_i4(abs(fsum(c[0] for c in c5) / 3))} {_i4(abs(fsum(c[1] for c in c5) / 3))}"
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
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(34))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [27] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-27-9-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith(("task-27-7-", "task-27-8-"))
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
