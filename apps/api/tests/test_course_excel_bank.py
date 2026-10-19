"""Independent checks of the Excel course bank tasks (Change 177).

The bank answers agree with the lesson texts; here every one of them is recomputed in plain
Python, the way Excel would compute it, without the course's own evaluator. The shape
of the course bank is checked too: membership, mastery of the additional lesson and the
problem book (Задачник) attached by its checksum.
"""

import datetime
import hashlib
import json
import math
import re
import zipfile
from collections import Counter
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

import pytest

from app.modules.practice.files import MIME
from app.modules.practice.schemas import Bank
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_PATH = ROOT / "content/practice-bank/bank.json"
BANK_FILES = ROOT / "content/practice-bank/files"
REGISTRY = ROOT / "apps/api/practice-registry.json"
ADVANCED = {"excel-tables-pivots"}
WORKBOOK_TASKS = {
    "excel-first-formulas-t08",
    "excel-conditions-t08",
    "excel-conditional-count-t06",
    "excel-neighbour-cells-t02",
    "excel-from-task-to-table-t08",
}


def _bank() -> Bank:
    return Bank.model_validate_json(BANK_PATH.read_bytes())


def _course_lessons() -> list[str]:
    """The course lessons in order, as the release registry lists them."""
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    return next(c["lesson_ids"] for c in registry["courses"] if c["id"] == "excel")


def _cells(ref: str) -> int:
    """Cells of a range like B3:E7."""
    (c1, r1), (c2, r2) = (re.fullmatch(r"([A-Z]+)(\d+)", p).groups() for p in ref.split(":"))  # type: ignore[union-attr]
    col = lambda s: sum((ord(ch) - 64) * 26**k for k, ch in enumerate(reversed(s)))  # noqa: E731
    return (int(r2) - int(r1) + 1) * (col(c2) - col(c1) + 1)


def _column_after(name: str) -> str:
    n = sum((ord(ch) - 64) * 26**k for k, ch in enumerate(reversed(name))) + 1
    out = ""
    while n:
        n, r = divmod(n - 1, 26)
        out = chr(65 + r) + out
    return out


def _serial(day: datetime.date) -> int:
    return (day - datetime.date(1899, 12, 30)).days


def _round(x: float, digits: int) -> float:
    """ОКРУГЛ: half away from zero, as Excel."""
    q = Decimal(1).scaleb(-digits)
    return float(Decimal(str(x)).quantize(q, rounding=ROUND_HALF_UP))


def _frequencies(row: list[int]) -> list[int]:
    return [row.count(v) for v in row]


def _num(x: float) -> str:
    """A number as the Russian-locale cell shows it."""
    return str(int(x)) if x == int(x) else str(x).replace(".", ",")


def _with_total(values: list[float]) -> str:
    """Values and their sum through a space, as a learner types them."""
    return " ".join(_num(v) for v in [*values, sum(values)])


def _singles_and_repeats(row: list[int]) -> str:
    singles = sum(v for v in row if row.count(v) == 1)
    return f"{singles} {sum(row) - singles}"


def _repeat_report(row: list[int]) -> str:
    freq = _frequencies(row)
    values = len({v for v, k in zip(row, freq, strict=True) if k > 1})
    return " ".join(map(str, [*freq, values, sum(k > 1 for k in freq)]))


def _filtered_sums(sums: list[int], filtered: list[int], hidden: list[int]) -> str:
    total = sum(sums)
    return f"{total} {total - sum(filtered)} {total - sum(filtered) - sum(hidden)}"


def _over_100(prices: list[float]) -> str:
    chosen = [p for p in prices if p > 100]
    return f"{len(chosen)} {_num(sum(chosen))}"


def _count_and_mean(scores: list[int]) -> str:
    chosen = [s for s in scores if s >= 60]
    return f"{len(chosen)} {_num(sum(chosen) / len(chosen))}"


# Answers recomputed by a method other than the lesson's.
RECOMPUTED = {
    "excel-sheet-t01": lambda: f"{_cells('B3:E7')} E7",
    "excel-sheet-t02": lambda: f"{_cells('C2:C11')} {_cells('B5:F5')}",
    "excel-sheet-t03": lambda: f"{_column_after('Z')} {_column_after('AZ')}",
    "excel-sheet-t04": lambda: f"B2:D4 {_cells('B2:D4')}",
    "excel-sheet-t05": lambda: f"{_cells('A1:C10')} {_cells('A1:C10') - 20 - 3}",
    "excel-sheet-t06": lambda: "B5 C2",
    "excel-sheet-t08": lambda: f"{_cells('B2:C4')} C4",
    "excel-input-files-t03": lambda: (
        f"{len('Тетрадь;40;12,5'.split(';'))} {len('Тетрадь;40;12,5'.split(','))}"
    ),
    "excel-input-files-t04": lambda: str(int("00127")),
    "excel-input-files-t08": lambda: "7 3",
    "excel-cell-values-t02": lambda: (
        f"{0.075 * 100:.0f}% {2 * 100:.0f}% {_num(0.075 * 1000 / 10)}%"
    ),
    "excel-cell-values-t04": lambda: f"{_num((6 + 9 + 0) / 3)} {_num((6 + 9) / 2)}",
    "excel-cell-values-t05": lambda: (
        f"{_serial(datetime.date(2026, 10, 3))} "
        f"{(datetime.date(2026, 10, 15) - datetime.date(2026, 10, 1)).days}"
    ),
    "excel-first-formulas-t01": lambda: f"{12 + 5 * 2} {(12 + 5) * 2}",
    "excel-first-formulas-t02": lambda: f"{2 * 3**2} {(2 * 3) ** 2} {_num(0.10 * 50)}",
    "excel-first-formulas-t03": lambda: f"{_num((15 + 8) / 2)} {_num(15 + 8 / 2)}",
    "excel-first-formulas-t04": lambda: f"200 {50 * 5}",
    "excel-first-formulas-t05": lambda: f"{_num(8 * 250 / 1000)} {8 * 120}",
    "excel-first-formulas-t07": lambda: "#ДЕЛ/0!",
    "excel-first-formulas-t08": lambda: _with_total([60 * 3, 25 * 4, 10 * 6]),
    "excel-references-t04": lambda: "C$2 $A5",
    "excel-references-t05": lambda: _with_total(
        [round(d * (1 - 0.15), 9) for d in (200, 60, 240, 60)]
    ),
    "excel-range-functions-t01": lambda: f"{7 + 0} 2 3 {_num((7 + 0) / 2)}",
    "excel-range-functions-t02": lambda: (
        f"{sorted([5, 5, 11])[-1]} {sorted([5, 5, 11])[-2]} {sorted([5, 5, 11])[1]}"
    ),
    "excel-range-functions-t03": lambda: f"{_num((90 * 3 + 70 * 7) / 10)} {_num((90 + 70) / 2)}",
    "excel-range-functions-t04": lambda: "#ДЕЛ/0!",
    "excel-range-functions-t07": lambda: str(5**2 + 12**2),
    "excel-conditions-t03": lambda: (
        f"{'ИСТИНА' if 10 > 10 else 'ЛОЖЬ'} {'ИСТИНА' if 10 >= 10 else 'ЛОЖЬ'}"
    ),
    "excel-conditions-t06": lambda: str(sum(40 <= s <= 70 for s in (35, 40, 55, 70, 71))),
    "excel-conditions-t08": lambda: _with_total([int(5 <= x <= 15) for x in (12, 7, 20, 3, 15)]),
    "excel-numbers-t01": lambda: _num(round(800 * 1.15 * 0.85, 9)),
    "excel-numbers-t02": lambda: str(math.ceil(37 / 8)),
    "excel-numbers-t04": lambda: (
        f"{_num(_round(3456, -2))} {math.trunc(7.99)} {-math.ceil(abs(-0.1))}"
    ),
    "excel-numbers-t05": lambda: f"{math.floor(-4.5)} {math.trunc(-4.5)}",
    "excel-numbers-t09": lambda: (
        f"{sum(_round(1.4, 0) for _ in range(3)):.0f} {_round(1.4 * 3, 0):.0f}"
    ),
    "excel-conditional-count-t04": lambda: str(sum(n % 2 == 0 or n % 3 == 0 for n in (2, 3, 6, 7))),
    "excel-conditional-count-t05": lambda: _repeat_report([7, 7, 2, 2, 5, 9]),
    "excel-conditional-count-t06": lambda: _singles_and_repeats([6, 6, 1, 2, 3, 9]),
    "excel-conditional-count-t07": lambda: " ".join(
        str(sum(s <= t < f for s, f in ((1, 5), (2, 3), (5, 8)))) for t in (2, 5)
    ),
    "excel-conditional-count-t08": lambda: str(
        sum(len(w) > 1 and w[1] == "а" for w in ("Казань", "Курск", "Самара", "Омск"))
    ),
    "excel-conditional-count-t09": lambda: f"{sum(v for v in (10, 15, 20, 25) if v >= 15)} #ДЕЛ/0!",
    "excel-text-dates-t01": lambda: f"{'Москва'[:3]} {'Москва'[-2:]} {'Москва'[1:5]}",
    "excel-text-dates-t02": lambda: f"{len(' да ')} {len(' да '.strip())}",
    "excel-sort-filter-t02": lambda: _filtered_sums([10, 20, 30, 40, 50, 60], [20, 50], [60]),
    "excel-lookup-t02": lambda: str("CDEF".index("E") + 1),
    "excel-lookup-t03": lambda: f"{[101, 102, 103, 104].index(104) + 1} Кофе",
    "excel-lookup-t06": lambda: (
        f"{sum(q for c, q in ((101, 2), (101, 3), (104, 4), (103, 5)) if c != 103)} "
        f"{sum(c != 103 for c in (101, 101, 104, 103))}"
    ),
    "excel-neighbour-cells-t01": lambda: f"{100 - 1} B{101 - 1}",
    "excel-neighbour-cells-t02": lambda: " ".join(
        str(sum([50, 30, 20, 100][: k + 1])) for k in range(4)
    ),
    "excel-neighbour-cells-t04": lambda: str(
        sum(a % 3 == 0 or b % 3 == 0 for a, b in zip([4, 8, 6, 5], [8, 6, 5, 7], strict=True))
    ),
    "excel-neighbour-cells-t05": lambda: f"{min((4, 9, 15))} {max((4, 9, 15))}",
    "excel-neighbour-cells-t06": lambda: f"{math.comb(1 + 2, 1)} {math.comb(2 + 3, 2)}",
    "excel-neighbour-cells-t07": lambda: str(2**3),
    "excel-from-task-to-table-t07": lambda: _over_100([200 * 0.5, 60 * 0.5, 240 * 0.5, 60 * 0.5]),
    "excel-from-task-to-table-t08": lambda: _count_and_mean([45, 80, 62, 80, 30, 95]),
    "excel-tables-pivots-t04": lambda: str(300 + 250),
}


def _course_tasks():
    lessons = set(_course_lessons())
    return [
        entry
        for entry in _bank().tasks
        if any(link.material_id in lessons for link in entry.task.lessons)
    ]


def test_every_course_task_is_recomputed() -> None:
    assert {e.task.id for e in _course_tasks()} == set(RECOMPUTED)


def test_every_lesson_has_bank_tasks_in_order() -> None:
    tasks = _course_tasks()
    by_lesson = Counter(link.material_id for e in tasks for link in e.task.lessons)
    assert set(by_lesson) == set(_course_lessons())
    for lesson in _course_lessons():
        positions = sorted(
            link.position for e in tasks for link in e.task.lessons if link.material_id == lesson
        )
        assert positions == list(range(len(positions))), lesson


def test_the_additional_lesson_stays_outside_mastery() -> None:
    for entry in _course_tasks():
        for link in entry.task.lessons:
            assert link.counts_toward_mastery == (link.material_id not in ADVANCED)


@pytest.mark.parametrize("task_id", sorted(RECOMPUTED))
def test_answer_recomputed_independently(task_id: str) -> None:
    entry = next(e for e in _course_tasks() if e.task.id == task_id)
    expected = RECOMPUTED[task_id]()
    assert is_correct(entry.task.checker, expected), (task_id, expected)


def test_server_accepts_every_variant_and_the_minus_sign() -> None:
    for entry in _course_tasks():
        checker = entry.task.checker
        for variant in checker.answer_variants:
            assert is_correct(checker, variant)
        first = checker.answer_variants[0]
        if re.search(r"-\d", first):
            assert is_correct(checker, re.sub(r"-(?=\d)", "−", first))
        assert not is_correct(checker, "not-an-answer")


def test_problem_book_is_attached_by_checksum() -> None:
    bank = _bank()
    records = {f.checksum: f for f in bank.files}
    attached = {e.task.id: e.task for e in _course_tasks() if e.task.files}
    assert set(attached) == WORKBOOK_TASKS
    checksums = {f.checksum for task in attached.values() for f in task.files}
    assert len(checksums) == 1, "one problem book for every task"
    (checksum,) = checksums
    record = records[checksum]
    assert record.mime_type == MIME["xlsx"]
    stored = BANK_FILES / record.storage_key
    data = stored.read_bytes()
    assert hashlib.sha256(data).hexdigest() == checksum
    assert record.size_bytes == len(data)
    with zipfile.ZipFile(stored) as book:
        names = set(book.namelist())
        assert "xl/workbook.xml" in names
        sheets = book.read("xl/workbook.xml").decode()
        assert "Задачи" in sheets and "Ответы" in sheets
    for task in attached.values():
        assert task.statement[-1].type == "attachment"
        assert task.files[0].filename == "excel-zadachnik.xlsx"
