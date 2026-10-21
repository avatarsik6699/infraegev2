"""Independent answer and content checks for the EGE topic 9 lesson «Обработка таблицы чисел».

The lesson solves a row with frequency bands, two lists, sets and sorted copies. Here every answer is
recomputed another way: repeats from runs of equal values in the sorted row, groups
from a frequency table built by hand, order by pairwise comparisons, neighbours by
explicit offsets. The book ``.xlsx`` and the text file of a task must hold the same
table, and the bank's own solution programs, run next to the text file, must print
the same answers.
"""

import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from itertools import groupby
from math import isqrt
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "spreadsheets"
Row = list[int]


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _path(task: TaskData, suffix: str) -> Path:
    (usage,) = [f for f in task.files if f.filename.endswith(suffix)]
    return BANK_DIR / "files" / usage.checksum


def _rows(task: TaskData) -> list[Row]:
    text = _path(task, ".txt").read_text()
    return [[int(x) for x in line.split()] for line in text.splitlines() if line.strip()]


def _book(path: Path) -> list[Row]:
    """The numbers of the first sheet, row by row, read from the sheet XML."""
    xml = zipfile.ZipFile(path).read("xl/worksheets/sheet1.xml").decode()
    rows = re.findall(r"<row [^>]*>(.*?)</row>", xml)
    return [[int(v) for v in re.findall(r"<v>(-?\d+)</v>", row)] for row in rows]


def _shape(a: Row) -> list[int]:
    """Sizes of the groups of equal values: runs of the sorted row."""
    return sorted(len(list(run)) for _, run in groupby(sorted(a)))


def _freq(a: Row) -> dict[int, int]:
    table: dict[int, int] = {}
    for x in a:
        table[x] = table.get(x, 0) + 1
    return table


def _split(a: Row) -> tuple[Row, Row]:
    """(repeated with every appearance, single)."""
    f = _freq(a)
    return [x for x in a if f[x] > 1], [x for x in a if f[x] == 1]


def _count(rows: list[Row], test) -> int:
    return sum(1 for a in rows if test(a))


def _ascending(a: Row, strict: bool) -> bool:
    return all(x < y if strict else x <= y for x, y in zip(a, a[1:], strict=False))


def _progression(a: Row) -> bool:
    b = sorted(a)
    return len({y - x for x, y in zip(b, b[1:], strict=False)}) == 1


def _two_pairs(a: Row) -> bool:
    w, x, y, z = a
    return w + x == y + z or w + y == x + z or w + z == x + y


def _neighbours(table: list[Row], i: int, j: int) -> list[int]:
    offsets = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
    return [
        table[i + di][j + dj]
        for di, dj in offsets
        if 0 <= i + di < len(table) and 0 <= j + dj < len(table[0])
    ]


TRAINING = [
    [2, 2, 5, 7, 9, 11],
    [5, 5, 1, 3, 7, 9],
    [2, 2, 5, 5, 9, 11],
    [2, 2, 2, 7, 9, 11],
    [3, 3, 4, 5, 7, 8],
    [7, 7, 20, 22, 24, 26],
]


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    tasks = _entries()

    def rows(task_id: str) -> list[Row]:
        return _rows(tasks[task_id])

    t1, t2, t3, t4 = (
        rows("task-9-1-07"),
        rows("task-9-3-07"),
        rows("task-9-3-08"),
        rows("task-9-3-09"),
    )
    t5, t6, t7, t8 = (
        rows("task-9-5-07"),
        rows("task-9-5-09"),
        rows("task-9-6-07"),
        rows("task-9-6-09"),
    )
    t9, t10 = rows("task-9-7-06"), rows("task-9-8-06")
    assert rows("task-9-1-04") == TRAINING

    def mean_test(a: Row) -> bool:
        rep, one = _split(a)
        return bool(rep and one) and sum(rep) / len(rep) < sum(one) / len(one)

    def noticeable(a: Row) -> bool:
        mean = sum(a) / len(a)
        big = [x for x in a if x > mean]
        even = [x for x in a if x % 2 == 0]
        odd = [x for x in a if x % 2 == 1]
        return sum(x % 2 for x in big) > sum(1 - x % 2 for x in big) and sum(even) > sum(odd)

    numbered8 = list(enumerate(t8, start=1))
    last992 = max(n for n, a in numbered8 if _ascending(a, False) and _shape(a) == [1, 1, 1, 1, 3])
    first26 = next(
        a
        for a in t8
        if _shape(a) == [1, 1, 1, 1, 1, 2]
        and sum(_split(a)[1]) < next(x for x, k in _freq(a).items() if k == 2)
    )
    columns = [_freq([row[j] for row in t10]) for j in range(6)]
    everywhere = _freq([x for row in t10 for x in row])
    peaks = 0
    for i, row in enumerate(t10):
        f = _freq(row)
        if any(f[x] == 1 and max(_neighbours(t10, i, j)) <= x for j, x in enumerate(row)):
            peaks += 1
    last999 = max(
        n
        for n, a in enumerate(t4, start=1)
        if _shape(a) == [1, 1, 1, 1, 3]
        and next(x for x, k in _freq(a).items() if k == 3) > sum(_split(a)[1]) / 4
    )
    last15 = [a for a in t8 if _ascending(a, True)][-1]
    return {
        "task-9-1-04": f"{_count(TRAINING, lambda a: sum(a) >= 34)} "
        f"{_count(TRAINING, lambda a: sum(a) > 34)}",
        "task-9-1-05": f"{sum(x > 20 for a in TRAINING for x in a)} "
        f"{_count(TRAINING, lambda a: max(a) > 20)}",
        "task-9-1-07": str(_count(t1, lambda a: sum(a) > 300 and max(a) < 90)),
        "task-9-1-08": str(_count(t1, lambda a: (max(a) > 95) ^ (min(a) < 5))),
        "task-9-2-02": f"{34 - 3 - 10} 8",
        "task-9-2-03": "9 6",
        "task-9-2-04": f"{9 * 9} {9 + 36}",
        "task-9-2-07": str(
            _count(t1, lambda a: (min(a) + max(a)) ** 2 > sum(x * x for x in sorted(a)[1:-1]))
        ),
        "task-9-2-08": str(_count(t1, lambda a: (min(a) + max(a)) / 2 > sum(sorted(a)[1:-1]) / 4)),
        "task-9-2-09": str(_count(t1, lambda a: max(a) > 3 * (sum(a) - max(a)) / 5)),
        "task-9-3-01": "3 7 35",
        "task-9-3-07": str(
            _count(
                t2,
                lambda a: _shape(a) == [1] * 5 and 2 * (min(a) + max(a)) <= sum(sorted(a)[1:-1]),
            )
        ),
        "task-9-3-08": str(_count(t3, lambda a: _shape(a) != [1] * 6 and sorted(a)[-2] < max(a))),
        "task-9-3-09": str(_count(t4, lambda a: _shape(a) == [1, 1, 2, 3])),
        "task-9-4-06": str(_count(TRAINING, mean_test)),
        "task-9-4-07": str(
            _count(
                t3,
                lambda a: _shape(a) == [1, 1, 1, 3] and _split(a)[0][0] >= sum(_split(a)[1]) / 3,
            )
        ),
        "task-9-4-08": str(
            _count(
                t4,
                lambda a: _shape(a) == [1, 1, 2, 3] and min(_split(a)[0]) > min(_split(a)[1]),
            )
        ),
        "task-9-4-09": str(
            _count(
                t3,
                lambda a: _shape(a) == [1, 1, 2, 2] and sum(set(_split(a)[0])) > sum(_split(a)[1]),
            )
        ),
        "task-9-5-01": f"{23 - 4 * 5} {-7 - 2 * (-4)} 0",
        "task-9-5-07": str(
            _count(
                t5,
                lambda a: (
                    sum(1 - x % 2 for x in a) > sum(x % 2 for x in a)
                    and sum(x for x in a if x % 2) > sum(x for x in a if not x % 2)
                ),
            )
        ),
        "task-9-5-08": str(_count(t5, noticeable)),
        "task-9-5-09": str(
            _count(
                t6,
                lambda a: int(sum(a) / len(a)) in a and any(isqrt(x) ** 2 == x for x in a),
            )
        ),
        "task-9-6-04": "7 10 20 80",
        "task-9-6-05": f"{abs(-9)} {abs(2)}",
        "task-9-6-07": str(_count(t7, lambda a: _shape(a) == [1] * 4 and _progression(a))),
        "task-9-6-08": str(_count(t7, lambda a: _two_pairs(a) and not _progression(a))),
        "task-9-6-09": str(last992),
        "task-9-6-10": str(abs(min(first26))),
        "task-9-7-06": str(_count(t9, lambda a: 2 * max(a) ** 2 == sum(x * x for x in a))),
        "task-9-7-07": str(
            _count(
                t9,
                lambda a: 2 * max(a) < sum(a) and 2 * max(a) ** 2 > sum(x * x for x in a),
            )
        ),
        "task-9-8-01": "19",
        "task-9-8-02": f"{2 + 3 + 1} 3",
        "task-9-8-04": f"{2 * 4} {2 * 4 + 2 * 2} 4",
        "task-9-8-06": str(
            _count(
                t10,
                lambda a: (
                    sum(_freq(a)[x] == 1 and columns[j][x] - 1 >= 30 for j, x in enumerate(a)) >= 2
                ),
            )
        ),
        "task-9-8-07": str(
            _count(t10, lambda a: any(_freq(a)[x] == 1 and everywhere[x] - 1 == 160 for x in a))
        ),
        "task-9-8-08": str(peaks),
        "task-9-9-01": str(
            _count(
                t3,
                lambda a: (
                    _shape(a) == [1, 1, 1, 1, 2] and sum(_split(a)[1]) / 4 <= sum(_split(a)[0])
                ),
            )
        ),
        "task-9-9-02": str(_count(t1, lambda a: sum(sorted(a)[-2:]) <= sum(sorted(a)[:-2]))),
        "task-9-9-03": str(last999),
        "task-9-9-04": str(
            sum(
                n
                for n, a in enumerate(t5, start=1)
                if n % 2 == 0 and _shape(a) == [1] * 8 and sum(x % 2 for x in a) == 4
            )
        ),
        "task-9-9-05": str(sum(last15)),
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
    expected = answers
    assert sorted(tasks) == sorted(expected)
    assert sorted(task.lessons[0].position for task in tasks.values()) == list(range(41))
    sections = next(m for m in _bank().materials if m.id == MATERIAL).sections
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == expected[task_id], task_id
        assert task.exam_numbers == [9] and not task.catalog_visible and not task.archived
        assert task.sources[0].kind == "original" and task.hint and task.explanation
        on_final_page = task_id.startswith("task-9-9-")
        assert bool(task.theory_links) != on_final_page, task_id
        assert all(link.section in sections for link in task.theory_links)
        advanced = task_id.startswith("task-9-8-")
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_book_and_text_file_hold_one_table() -> None:
    for task_id, task in _entries().items():
        if len(task.files) == 2:
            assert {f.filename.rsplit(".", 1)[1] for f in task.files} == {"xlsx", "txt"}
            assert _book(_path(task, ".xlsx")) == _rows(task), task_id


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
        code = _solution_code(task)
        with tempfile.TemporaryDirectory() as tmp:
            for usage in task.files:
                shutil.copy(BANK_DIR / "files" / usage.checksum, Path(tmp) / usage.filename)
            texts = [f.filename for f in task.files if f.filename.endswith(".txt")]
            assert all(f'open("{name}")' in code for name in texts), task_id
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
