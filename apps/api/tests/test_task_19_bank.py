"""Independent answer and content checks for the EGE tasks 19–21 lesson «Выигрышная стратегия».

The lesson finds the group of a position with the label function ``g(s)``: В1, П1, В2,
П2 (and В3, П3 in the advanced lesson). Here every game is solved to the end instead:
the value of a position is +n when the player to move forces a win by his n-th move at
the latest (and not sooner), −n when the opponent forces a win by his n-th move whatever
the player does. Then В1, П1, В2, П2 are the values +1, −1, +2, −2, В3 and П3 are +3 and
−3, and Petya's mistake is a move to a position of value +1 for Vanya. The bank's own
solution programs must print the same answers.
"""

import subprocess
import sys
from functools import cache
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "winning-strategy"


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


class Game:
    """A game solved to the end; ``value`` as described in the module docstring."""

    def __init__(self, moves, finished) -> None:
        self.moves, self.finished = moves, finished
        self.value = cache(self._value)

    def _value(self, p) -> int:
        nxt = self.moves(p)
        if any(self.finished(q) for q in nxt):
            return 1
        values = [self.value(q) for q in nxt]
        losing = [-v for v in values if v < 0]
        if losing:
            return 1 + min(losing)
        return -max(values)

    def where(self, starts, value: int) -> list:
        return [s for s in starts if self.value(s) == value]

    def mistake(self, p) -> bool:
        """Petya can move so that Vanya wins at once."""
        return any(not self.finished(q) and self.value(q) == 1 for q in self.moves(p))


def heap(*steps):
    """+k, ×k, //k as text: '+1', '*3', '-2', '/3'."""

    def moves(s):
        out = []
        for step in steps:
            k = int(step[1:])
            out.append({"+": s + k, "*": s * k, "-": s - k, "/": s // k}[step[0]])
        return out

    return moves


def heaps(add: int, times: int):
    def moves(p):
        a, b = p
        return [(a + add, b), (a * times, b), (a, b + add), (a, b * times)]

    return moves


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    sys.setrecursionlimit(20000)
    a: dict[str, str] = {}

    def at_least(n):
        return lambda s: s >= n

    def at_most(n):
        return lambda s: s <= n

    def total(n):
        return lambda p: p[0] + p[1] >= n

    # subtopic 1: Vanya wins at once after Petya's mistake
    for task, steps, goal in [
        ("task-19-1-06", ("+1", "*3"), 40),
        ("task-19-1-07", ("+7", "*2"), 40),
        ("task-19-1-08", ("+1", "+4", "*4"), 90),
    ]:
        g = Game(heap(*steps), at_least(goal))
        a[task] = str(min(s for s in range(1, goal) if g.mistake(s)))
    # subtopic 2
    g = Game(heap("+1", "+2", "*3"), at_least(60))
    a["task-19-2-07"] = " ".join(map(str, g.where(range(1, 60), -1)))
    a["task-19-2-08"] = " ".join(map(str, g.where(range(1, 60), 2)))
    a["task-19-2-09"] = str(min(g.where(range(1, 60), -2)))
    # subtopic 3
    g = Game(heap("+2", "+3", "*2"), at_least(50))
    w2 = g.where(range(1, 50), 2)
    a["task-19-3-04"] = f"{len(w2)} {sum(w2)} {min(w2)} {max(w2)}"
    g = Game(heap("+1", "+3", "*3"), at_least(200))
    a["task-19-3-06"] = " ".join(map(str, g.where(range(1, 200), -1)))
    a["task-19-3-07"] = " ".join(map(str, g.where(range(1, 200), 2)[:2]))
    g = Game(heap("+2", "+5", "*2"), at_least(301))
    a["task-19-3-08"] = str(len(g.where(range(1, 301), -2)))
    # subtopic 4: two heaps
    g = Game(heaps(3, 2), total(120))
    a["task-19-4-06"] = str(min(s for s in range(1, 111) if g.mistake((9, s))))
    a["task-19-4-07"] = " ".join(
        str(s) for s in [s for s in range(1, 111) if g.value((9, s)) == 2][:2]
    )
    a["task-19-4-08"] = str(min(s for s in range(1, 111) if g.value((9, s)) == -2))
    # the theme task: (7, S), +3 or ×2 in one pile, the sum at least 100
    g = Game(heaps(3, 2), total(100))
    a["task-19-4-11"] = str(min(s for s in range(1, 93) if g.mistake((7, s))))
    a["task-19-4-12"] = " ".join(
        str(s) for s in [s for s in range(1, 93) if g.value((7, s)) == 2][:2]
    )
    a["task-19-4-13"] = str(min(s for s in range(1, 93) if g.value((7, s)) == -2))
    # subtopic 5: decreasing heaps
    a["task-19-5-01"] = str(3 * (12 + 1) - 1)
    g = Game(heap("-3", "/4"), at_most(20))
    a["task-19-5-05"] = str(max(s for s in range(21, 1000) if g.mistake(s)))
    g = Game(heap("-2", "-5", "/3"), at_most(30))
    a["task-19-5-07"] = str(min(g.where(range(31, 1000), -1)))
    a["task-19-5-08"] = " ".join(map(str, g.where(range(31, 1000), 2)[:2]))
    a["task-19-5-09"] = str(min(g.where(range(31, 1000), -2)))
    a["task-19-5-10"] = str(max(s for s in range(31, 1000) if g.mistake(s)))
    # subtopic 6 (advanced): the third move
    g = Game(heaps(2, 2), total(100))
    a["task-19-6-07"] = " ".join(
        str(s) for s in [s for s in range(1, 90) if g.value((10, s)) == 3][:2]
    )
    a["task-19-6-08"] = str(min(s for s in range(1, 90) if g.value((10, s)) == -3))
    # subtopic 7
    take = Game(lambda s: [s - k for k in (1, 2, 3) if k <= s], lambda s: s == 0)
    a["task-19-7-03"] = " ".join(str(s) for s in range(1, 15) if take.value(s) < 0)
    a["task-19-7-04"] = str(
        min(
            x + y
            for x in range(1, 50)
            for y in range(1, 50)
            if x + y < 50 and max(3 * x + y, x + 3 * y, x + y + 1) >= 50
        )
    )

    def no_repeat(p):
        s, last = p
        return [
            (q, step) for q, step in ((s + 1, "+1"), (s + 2, "+2"), (s * 2, "x2")) if step != last
        ]

    g = Game(no_repeat, lambda p: p[0] >= 30)
    a["task-19-7-05"] = " ".join(str(s) for s in range(1, 30) if g.value((s, "")) == -1)
    w2 = [s for s in range(1, 30) if g.value((s, "")) == 2]
    a["task-19-7-06"] = f"{min(w2)} {max(w2)}"
    g = Game(heaps(1, 2), total(60))
    a["task-19-7-07"] = str(max(s for s in range(1, 54) if g.value((6, s)) < 0))
    # Практика и итог
    g = Game(heap("+2", "*3"), at_least(70))
    a["task-19-8-01"] = str(min(s for s in range(1, 70) if g.mistake(s)))
    g = Game(heap("+1", "+3", "*2"), at_least(45))
    w2 = g.where(range(1, 45), 2)
    a["task-19-8-02"] = f"{min(w2)} {max(w2)}"
    g = Game(heaps(2, 2), total(100))
    a["task-19-8-03"] = str(min(s for s in range(1, 93) if g.value((7, s)) == -2))
    g = Game(heap("-3", "-4", "/2"), at_most(40))
    a["task-19-8-04"] = str(max(g.where(range(41, 1000), -1)))
    g = Game(heap("+1", "+4", "*3"), at_least(100))
    a["task-19-8-05"] = " ".join(map(str, g.where(range(1, 100), 2)[:2]))
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
        assert set(task.exam_numbers) <= {19, 20, 21} and task.exam_numbers, task_id
        assert not task.catalog_visible and not task.archived, task_id
        on_final_page = task_id.startswith("task-19-8-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith(("task-19-6-", "task-19-7-"))
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


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
        result = subprocess.run(
            [sys.executable, "-I", "-c", code],
            capture_output=True,
            text=True,
            check=True,
            timeout=300,
        )
        assert " ".join(result.stdout.split()) == answers[task_id], task_id
        assert all(len(line) <= 64 for line in code.splitlines()), task_id
