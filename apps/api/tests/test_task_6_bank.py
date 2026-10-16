"""Independent answer and content checks for the EGE topic 6 lesson.

The lesson «Простейшие алгоритмы для исполнителей» draws with a turtle.

The bank's answers come from the stand's executor (``turtle_figures``: ray casting over the
trace). Here the algorithm is read from the bank task itself (its text or its program
block) and run again by a separate executor on complex numbers; a point is inside when the
contour winds around it, on the line when it lies on a drawn segment. Rectangles given by
their bounds are counted by formulas, visits by stepping one unit at a time. The programs of
subtopic 7 must print the same answers.
"""

import cmath
import math
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
MATERIAL = "simple-algorithms"
EPS = 1e-6
HEAD = {"вверх": 90, "вправо": 0, "влево": 180, "вниз": 270}


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _statement(task: TaskData) -> tuple[str, str]:
    """The text of a statement and its program block, if any."""
    text = " ".join(b.data.markdown for b in task.statement if b.type == "text")
    code = "\n".join(b.data.code for b in task.statement if b.type == "code_example")
    return text, code


def _expand(cmds: str) -> list[tuple[str, float]]:
    """«Повтори k [ … ]» unrolled into single commands."""
    while "Повтори" in cmds:
        cmds = re.sub(
            r"Повтори (\d+) \[([^\[\]]*)\]",
            lambda m: (" " + m.group(2) + " ") * int(m.group(1)),
            cmds,
        )
    words = cmds.replace(",", " ").split()
    out, i = [], 0
    while i < len(words):
        if words[i] in ("Поднять", "Опустить"):
            out.append((words[i], 0.0))
        else:
            out.append((words[i], float(words[i + 1])))
        i += 2
    return out


def _trace(task: TaskData) -> tuple[list[list[complex]], list[tuple[complex, complex]], complex]:
    """Closed contours, drawn segments and the end point of a task's algorithm."""
    text, code = _statement(task)
    quoted = re.search(r"(?:алгоритм|выполнила) «([^»]+)»", text)
    cmds = code or (quoted.group(1) if quoted else "")
    turn = re.search(r"(?:направление|направлена|голова) (вверх|вправо|влево|вниз)", text)
    heading = math.radians(HEAD[turn.group(1)] if turn else 90)
    z, pen = 0j, True
    segs: list[tuple[complex, complex]] = []
    contours: list[list[complex]] = []
    path: list[complex] = []
    for word, n in _expand(cmds):
        if word in ("Вперёд", "Назад"):
            nz = z + (n if word == "Вперёд" else -n) * cmath.exp(1j * heading)
            if pen:
                segs.append((z, nz))
                path = path or [z]
                path.append(nz)
                if len(path) > 3 and abs(path[-1] - path[0]) < EPS:
                    if not any(
                        len(c) == len(path) - 1
                        and all(min(abs(p - q) for q in c) < EPS for p in path)
                        for c in contours
                    ):
                        contours.append(path[:-1])
                    path = [nz]
            z = nz
        elif word in ("Направо", "Налево"):
            heading += math.radians(-n if word == "Направо" else n)
        else:
            pen = word == "Опустить"
            path = []
    return contours, segs, z


def _on(p: complex, a: complex, b: complex) -> bool:
    cross = ((b - a).conjugate() * (p - a)).imag
    return (
        abs(cross) < EPS
        and min(a.real, b.real) - EPS <= p.real <= max(a.real, b.real) + EPS
        and (min(a.imag, b.imag) - EPS <= p.imag <= max(a.imag, b.imag) + EPS)
    )


def _winds(p: complex, contour: list[complex]) -> bool:
    turn = sum(
        cmath.phase((b - p) / (a - p))
        for a, b in zip(contour, contour[1:] + contour[:1], strict=True)
    )
    return abs(turn) > math.pi


def _grid(segs):
    xs = [c.real for s in segs for c in s]
    ys = [c.imag for s in segs for c in s]
    return [
        complex(x, y)
        for x in range(math.floor(min(xs)) - 1, math.ceil(max(xs)) + 2)
        for y in range(math.floor(min(ys)) - 1, math.ceil(max(ys)) + 2)
    ]


def _count(task: TaskData, kinds: str) -> int:
    contours, segs, _ = _trace(task)
    n = 0
    for p in _grid(segs):
        edge = any(_on(p, a, b) for a, b in segs)
        inner = not edge and any(_winds(p, c) for c in contours)
        n += ("e" in kinds and edge) or ("i" in kinds and inner)
    return n


def _figure_points(task: TaskData) -> list[set[complex]]:
    contours, segs, _ = _trace(task)
    out = []
    for c in contours:
        sides = list(zip(c, c[1:] + c[:1], strict=True))
        out.append({p for p in _grid(segs) if any(_on(p, a, b) for a, b in sides) or _winds(p, c)})
    return out


def _box(x0: int, x1: int, y0: int, y1: int, strict: bool = False) -> int:
    d = 2 if strict else 0
    return max(0, x1 - x0 + 1 - d) * max(0, y1 - y0 + 1 - d)


def _overlap(a, b):
    return max(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), min(a[3], b[3])


def _visits(sides: int, first: bool) -> tuple[int, int]:
    """«Повтори 5 [Вперёд 3 Направо 90]» walked one unit at a time."""
    count: dict[complex, int] = {0j: 1} if first else {}
    z, step = 0j, 1j
    for _ in range(sides):
        for _ in range(3):
            z += step
            count[z] = count.get(z, 0) + 1
        step *= -1j
    return sum(v >= 2 for v in count.values()), len(set(count) | {0j})


def _solution(task: TaskData) -> str | None:
    found = [
        b.data.code
        for b in task.explanation
        if b.type == "code_example" and b.data.language == "python"
    ]
    return found[0] if found else None


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    t = _entries()
    a: dict[str, str] = {}
    a["task-6-1-05"] = f"{360 // 6} {360 // 8}"
    end = _trace(t["task-6-1-08"])[2]
    a["task-6-1-08"] = f"{round(end.real)} {round(end.imag)}"
    a["task-6-2-02"] = str(6 * 25)
    a["task-6-2-05"] = str((8 - -3) * (6 - -2))
    # 2.7: three sides close the triangle, the fourth goes up 10 and turns right by 120°
    a["task-6-2-07"] = f"0 10 {(90 - 120) % 360}"
    a["task-6-2-08"] = f"{(13 + 2) * (11 + 2)} {_box(0, 8, 0, 6, True)}"
    a["task-6-3-02"] = f"{_count(t['task-6-3-02'], 'i')} {_count(t['task-6-3-02'], 'ie')}"
    a["task-6-3-03"] = (
        f"{_box(0, 9, 0, 4, True)} {_box(0, 9, 0, 4)} {_box(0, 9, 0, 4) - _box(0, 9, 0, 4, True)}"
    )
    # 3.4: x = k on the segment to (6; 4) has y = 4k/6
    a["task-6-3-04"] = str(sum(1 for k in range(0, 7) if (4 * k) % 6 == 0))
    a["task-6-3-05"] = str(_count(t["task-6-3-05"], "e"))
    # 3.6: Pick's theorem I = S − B/2 + 1; B: 6 on one leg, 5 on the other, gcd(6, 5) on the third
    boundary = 6 + 5 + math.gcd(6, 5)
    a["task-6-3-06"] = f"15 {round(15 - boundary / 2 + 1)}"
    a["task-6-3-07"] = str(_count(t["task-6-3-07"], "i"))
    a["task-6-3-08"] = str(_count(t["task-6-3-08"], "ie"))
    both = _overlap((-2, 5, -1, 4), (1, 7, 2, 6))
    a["task-6-4-01"] = f"{_box(*both)} {_box(*both, True)}"
    a["task-6-4-02"] = str(
        _box(0, 4, 0, 3) + _box(2, 6, 1, 4) - _box(*_overlap((0, 4, 0, 3), (2, 6, 1, 4)))
    )
    a["task-6-4-03"] = f"0 {_box(*_overlap((0, 3, 0, 2), (3, 5, 0, 2)))} 0"
    A, B = (0, 8, 0, 6), (3, 10, 2, 7)
    inner = _box(*A, True) + _box(*B, True) - _box(4, 7, 3, 5)
    a["task-6-4-04"] = f"{_box(*A) - _box(*_overlap(A, B))} {inner}"
    a["task-6-4-05"] = str(_box(0, 10, 0, 6) - _box(*_overlap((0, 10, 0, 6), (4, 12, 2, 9))))
    f1, f2 = _figure_points(t["task-6-4-06"])
    a["task-6-4-06"] = str(len(f1 & f2))
    a["task-6-4-07"] = str(len(f1 | f2))
    for k, kinds in (
        ("5-01", "i"),
        ("5-02", "i"),
        ("5-03", "i"),
        ("5-04", "i"),
        ("5-06", "ie"),
        ("5-07", "i"),
    ):
        a[f"task-6-{k}"] = str(_count(t[f"task-6-{k}"], kinds))
    # 5.5 is about the algorithm of task 4: the points on its lines
    a["task-6-5-05"] = str(_count(t["task-6-5-04"], "e"))
    a["task-6-6-01"] = str(next(n for n in range(1, 99) if _box(0, 4, 0, n, True) >= 30))
    a["task-6-6-02"] = str(next(n for n in range(1, 99) if _box(0, 4, 0, n) > 60))
    a["task-6-6-03"] = str(next(n for n in range(1, 99) if _box(0, n, 0, n, True) > 100))
    a["task-6-6-04"] = str((min(10, 6) + 1) * (min(4, 6) + 1))
    a["task-6-6-05"] = str((10 - 3 + 1) * (4 - 3 + 1))
    a["task-6-6-06"] = str(_visits(5, True)[0])
    a["task-6-6-07"] = " ".join(map(str, _visits(5, False)))
    a["task-6-7-01"] = str(_box(0, 9, 0, 4, True))
    a["task-6-7-02"] = str(_box(*A) + _box(*B) - 2 * _box(*_overlap(A, B)))
    a["task-6-7-03"] = str(
        sum(1 for x in range(1, 6) for y in range(1, 7) if x / 3**0.5 < y < 6 - x / 3**0.5)
    )
    a["task-6-7-04"] = f"{len(range(3, 7))} {len(range(2, 4))}"
    a["task-6-7-05"] = str(
        sum(1 for x in range(0, 11) for y in range(0, 6) if (x - 5) ** 2 + y * y <= 25)
    )
    a["task-6-7-06"] = str(
        sum(1 for x in range(0, 11) for y in range(1, 6) if (x - 5) ** 2 + y * y < 25)
    )
    for k, kinds in (("8-01", "i"), ("8-02", "ie"), ("8-04", "i")):
        a[f"task-6-{k}"] = str(_count(t[f"task-6-{k}"], kinds))
    g1, g2 = _figure_points(t["task-6-8-03"])
    a["task-6-8-03"] = str(len(g1 & g2))
    (contour,) = _trace(t["task-6-8-05"])[0]
    s = sum(
        (p.conjugate() * q).imag for p, q in zip(contour, contour[1:] + contour[:1], strict=True)
    )
    a["task-6-8-05"] = str(round(abs(s) / 2))
    return a


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(45))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [6] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-6-8-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith(("task-6-6-", "task-6-7-"))
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_counting_programs_print_the_answer(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        code = _solution(task)
        assert (code is not None) == task_id.startswith("task-6-7-"), task_id
        if code is None:
            continue
        result = subprocess.run(
            [sys.executable, "-I", "-c", code], capture_output=True, text=True, check=True
        )
        assert " ".join(result.stdout.split()) == answers[task_id], task_id
        assert all(len(line) <= 64 for line in code.splitlines()), task_id


def test_executor_programs_are_shown_as_plain_text() -> None:
    for task_id, task in _entries().items():
        for block in task.statement:
            if block.type == "code_example":
                assert block.data.language == "text", task_id
                assert block.data.code.lstrip().startswith(("Повтори", "Вперёд")), task_id


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        tokens = expected.split()
        tokens[-1] = str(int(tokens[-1]) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id
