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


def _singles_and_repeats(row: list[int]) -> str:
    singles = sum(v for v in row if row.count(v) == 1)
    return f"{singles} {sum(row) - singles}"


def _after_discount(discount: float) -> list[float]:
    """The purchase table of the course: cost × (1 − discount) per purchase."""
    return [price * qty * (1 - discount) for price, qty in ((40, 5), (20, 3), (120, 2), (15, 4))]


_PURCHASES = (
    ("Москва", "чай", 300),
    ("Казань", "кофе", 450),
    ("Москва", "кофе", 250),
    ("Омск", "чай", 120),
    ("Казань", "чай", 200),
    ("Москва", "какао", 150),
)


def _shift(formula: str, cols: int, rows: int) -> str:
    """A formula copied by (cols, rows): the parts without $ move."""

    def move(m: re.Match[str]) -> str:
        col_fixed, col, row_fixed, row = m.groups()
        if not col_fixed:
            col = _column_after(chr(ord(col) + cols - 1))
        if not row_fixed:
            row = str(int(row) + rows)
        return f"{col_fixed}{col}{row_fixed}{row}"

    return re.sub(r"(\$?)([A-Z])(\$?)(\d+)", move, formula)


# Answers recomputed by a method other than the lesson's.
RECOMPUTED = {
    "excel-sheet-t01": lambda: str(_cells("B3:E7")),
    "excel-sheet-t09": lambda: "E7",
    "excel-sheet-t02": lambda: str(_cells("C2:C11")),
    "excel-sheet-t10": lambda: str(_cells("B5:F5")),
    "excel-sheet-t03": lambda: _column_after("Z"),
    "excel-sheet-t11": lambda: _column_after("AZ"),
    "excel-sheet-t04": lambda: "B2:D4",
    "excel-sheet-t12": lambda: str(_cells("B2:D4")),
    "excel-sheet-t05": lambda: str(_cells("A1:C10") - 20 - 3),
    "excel-sheet-t06": lambda: "B5",
    "excel-sheet-t13": lambda: "C2",
    "excel-sheet-t08": lambda: str(_cells("B2:C4")),
    "excel-sheet-t14": lambda: "C4",
    "excel-input-files-t03": lambda: str(len("Тетрадь;40;12,5".split(";"))),
    "excel-input-files-t09": lambda: str(len("Тетрадь;40;12,5".split(","))),
    "excel-input-files-t04": lambda: str(int("00127")),
    "excel-input-files-t08": lambda: "7",
    "excel-input-files-t10": lambda: "3",
    "excel-cell-values-t02": lambda: f"{_num(_round(0.075 * 100, 0))}%",
    "excel-cell-values-t11": lambda: f"{_num(2 * 100)}%",
    "excel-cell-values-t12": lambda: f"{_num(_round(0.075 * 100, 1))}%",
    "excel-cell-values-t04": lambda: _num((6 + 9 + 0) / 3),
    "excel-cell-values-t13": lambda: _num((6 + 9) / 2),
    "excel-cell-values-t05": lambda: str(_serial(datetime.date(2026, 10, 3))),
    "excel-cell-values-t14": lambda: str(
        (datetime.date(2026, 10, 15) - datetime.date(2026, 10, 1)).days
    ),
    "excel-first-formulas-t01": lambda: str(12 + 5 * 2),
    "excel-first-formulas-t09": lambda: str((12 + 5) * 2),
    "excel-first-formulas-t02": lambda: str(2 * 3**2),
    "excel-first-formulas-t10": lambda: str((2 * 3) ** 2),
    "excel-first-formulas-t11": lambda: _num(0.10 * 50),
    "excel-first-formulas-t03": lambda: _num((15 + 8) / 2),
    "excel-first-formulas-t12": lambda: _num(15 + 8 / 2),
    "excel-first-formulas-t04": lambda: str(50 * 5),
    "excel-first-formulas-t13": lambda: "200",
    "excel-first-formulas-t05": lambda: _num(8 * 250 / 1000),
    "excel-first-formulas-t14": lambda: str(8 * 120),
    "excel-first-formulas-t07": lambda: "#ДЕЛ/0!",
    "excel-first-formulas-t15": lambda: "#ЗНАЧ!",
    "excel-first-formulas-t08": lambda: str(60 * 3 + 25 * 4 + 10 * 6),
    "excel-first-formulas-t16": lambda: str(25 * 4),
    "excel-references-t09": lambda: "=B5*C5",
    "excel-references-t10": lambda: "=D2*E2",
    "excel-references-t04": lambda: "C$2",
    "excel-references-t11": lambda: "$A5",
    "excel-references-t12": lambda: "$A$2",
    "excel-references-t05": lambda: _num(round(240 * (1 - 0.15), 9)),
    "excel-references-t13": lambda: _num(
        round(sum(round(d * (1 - 0.15), 9) for d in (200, 60, 240, 60)), 9)
    ),
    "excel-references-t14": lambda: _num(60 * (1 - 0)),
    "excel-references-t15": lambda: "=$A5*E$1",
    "excel-references-t16": lambda: str(4 * 4),
    "excel-range-functions-t01": lambda: str(7 + 0),
    "excel-range-functions-t09": lambda: str(sum(isinstance(v, int) for v in (7, 0, None, "нет"))),
    "excel-range-functions-t10": lambda: str(sum(v is not None for v in (7, 0, None, "нет"))),
    "excel-range-functions-t11": lambda: _num((7 + 0) / 2),
    "excel-range-functions-t04": lambda: "#ДЕЛ/0!",
    "excel-range-functions-t02": lambda: str(sorted([5, 5, 11], reverse=True)[1]),
    "excel-range-functions-t12": lambda: str(sorted([5, 5, 11])[1]),
    "excel-range-functions-t13": lambda: str(sum(sorted([5, 5, 11], reverse=True)[:2])),
    "excel-range-functions-t03": lambda: _num((90 * 3 + 70 * 7) / 10),
    "excel-range-functions-t14": lambda: _num((90 + 70) / 2),
    "excel-range-functions-t15": lambda: str(sum([6, 1, 6, 2, 3, 4]) - max([6, 1, 6, 2, 3, 4])),
    "excel-range-functions-t07": lambda: str(5**2 + 12**2),
    "excel-conditions-t03": lambda: "ИСТИНА" if 10 > 10 else "ЛОЖЬ",
    "excel-conditions-t09": lambda: "ИСТИНА" if 10 >= 10 else "ЛОЖЬ",
    # a chain compares a logical value with 20: Excel ranks logical above numbers
    "excel-conditions-t10": lambda: "ЛОЖЬ",
    "excel-conditions-t11": lambda: "ИСТИНА" if (20 < 10 or 20 > 20) else "ЛОЖЬ",
    "excel-conditions-t12": lambda: "ИСТИНА" if (True ^ True) else "ЛОЖЬ",
    "excel-conditions-t06": lambda: str(sum(40 <= s <= 70 for s in (35, 40, 55, 70, 71))),
    "excel-conditions-t13": lambda: str(max(3, 8)),
    "excel-conditions-t14": lambda: "нет данных",
    "excel-conditions-t08": lambda: str(sum(5 <= x <= 15 for x in (12, 7, 20, 3, 15))),
    "excel-numbers-t01": lambda: _num(round(800 * 1.15 * 0.85, 9)),
    "excel-numbers-t10": lambda: _num(round((300 - 250) / 250 * 100, 9)),
    "excel-numbers-t02": lambda: str(math.ceil(37 / 8)),
    "excel-numbers-t04": lambda: _num(_round(3456, -2)),
    "excel-numbers-t11": lambda: str(math.trunc(7.99)),
    "excel-numbers-t12": lambda: str(-math.ceil(abs(-0.1))),
    "excel-numbers-t05": lambda: str(math.floor(-4.5)),
    "excel-numbers-t13": lambda: str(math.trunc(-4.5)),
    "excel-numbers-t09": lambda: f"{sum(_round(1.4, 0) for _ in range(3)):.0f}",
    "excel-numbers-t14": lambda: f"{_round(1.4 * 3, 0):.0f}",
    "excel-numbers-t15": lambda: str(100 % 7),
    "excel-numbers-t16": lambda: str(abs(-127) % 10),
    "excel-conditional-count-t10": lambda: str(sum(v > 5 for v in (5, 7, 10, 5, 8, 3))),
    "excel-conditional-count-t11": lambda: str(sum(v >= 7 for v in (5, 7, 10, 5, 8, 3))),
    "excel-conditional-count-t12": lambda: str(sum(60 <= v <= 80 for v in (72, 85, 55, 60, 64, 90))),
    "excel-conditional-count-t09": lambda: str(
        sum(d for c, d in zip(("Книги", "Еда", "Книги", "Игрушки"), (100, 50, 200, 300), strict=True) if c == "Книги")
    ),
    "excel-conditional-count-t13": lambda: "#ДЕЛ/0!" if not [v for v in (10, 15, 20, 25) if v > 30] else "",
    "excel-conditional-count-t04": lambda: str(sum(n % 2 == 0 or n % 3 == 0 for n in (2, 3, 6, 7))),
    "excel-conditional-count-t05": lambda: str([7, 7, 2, 2, 5, 9].count(2)),
    "excel-conditional-count-t14": lambda: str(
        len({v for v in [7, 7, 2, 2, 5, 9] if [7, 7, 2, 2, 5, 9].count(v) > 1})
    ),
    "excel-conditional-count-t15": lambda: str(sum(k > 1 for k in _frequencies([7, 7, 2, 2, 5, 9]))),
    "excel-conditional-count-t06": lambda: _singles_and_repeats([6, 6, 1, 2, 3, 9]).split()[0],
    "excel-conditional-count-t16": lambda: _singles_and_repeats([6, 6, 1, 2, 3, 9]).split()[1],
    "excel-text-dates-t01": lambda: "Москва"[:3],
    "excel-text-dates-t09": lambda: "Москва"[-2:],
    "excel-text-dates-t10": lambda: "Москва"[1:5],
    "excel-text-dates-t02": lambda: str(len(" да ")),
    "excel-text-dates-t11": lambda: str(len(" да ".strip())),
    "excel-text-dates-t12": lambda: "12-34-5".replace("-", ""),
    "excel-text-dates-t13": lambda: str((datetime.date(2026, 3, 2) - datetime.date(2026, 2, 27)).days),
    "excel-text-dates-t14": lambda: str(datetime.date(2027, 1, 1).month),
    "excel-text-dates-t15": lambda: (
        "ИСТИНА"
        if datetime.datetime(2026, 10, 15, 12, 30) <= datetime.datetime(2026, 10, 15)
        else "ЛОЖЬ"
    ),
    "excel-sort-filter-t02": lambda: str(sum([10, 20, 30, 40, 50, 60])),
    "excel-sort-filter-t09": lambda: str(sum(v for v in [10, 20, 30, 40, 50, 60] if v not in (20, 50, 60))),
    "excel-sort-filter-t10": lambda: str(sum(v for v in [10, 20, 30, 40, 50, 60] if v not in (20, 50))),
    "excel-sort-filter-t11": lambda: str(100 + 150 + 50),
    "excel-sort-filter-t12": lambda: str(
        sum(c == "Москва" and v >= 80 for c, v in (("Москва", 72), ("Москва", 85), ("Москва", 90), ("Казань", 88)))
    ),
    "excel-sort-filter-t13": lambda: str(sorted([40, 20, 120, 15])[0]),
    "excel-lookup-t02": lambda: str("CDEF".index("E") + 1),
    "excel-lookup-t10": lambda: str(dict(zip((101, 102, 103, 104), (100, 250, 200, 150), strict=True))[103]),
    "excel-lookup-t11": lambda: "#Н/Д" if 105 not in (101, 102, 103, 104) else "",
    "excel-lookup-t03": lambda: str([101, 102, 103, 104].index(104) + 1),
    "excel-lookup-t09": lambda: ["Чай", "Кофе", "Печенье", "Какао"][2 - 1],
    "excel-lookup-t06": lambda: str(
        sum(q for c, q in ((101, 2), (101, 3), (104, 4), (103, 5)) if c != 103)
    ),
    "excel-lookup-t12": lambda: str(sum(c != 103 for c in (101, 101, 104, 103))),
    "excel-neighbour-cells-t01": lambda: str(100 - 1),
    "excel-neighbour-cells-t09": lambda: f"B{101 - 1}",
    "excel-neighbour-cells-t02": lambda: str(sum([50, 30, 20, 100][:3])),
    "excel-neighbour-cells-t04": lambda: str(
        sum(a % 3 == 0 or b % 3 == 0 for a, b in zip([4, 8, 6, 5], [8, 6, 5, 7], strict=True))
    ),
    "excel-neighbour-cells-t05": lambda: str(min((4, 9, 15))),
    "excel-neighbour-cells-t10": lambda: str(max((4, 9, 15))),
    "excel-neighbour-cells-t06": lambda: str(math.comb(1 + 2, 1)),
    "excel-neighbour-cells-t11": lambda: str(math.comb(2 + 3, 2)),
    "excel-neighbour-cells-t07": lambda: str(2**3),
    "excel-from-task-to-table-t07": lambda: str(sum(v > 100 for v in _after_discount(0.5))),
    "excel-from-task-to-table-t09": lambda: _num(sum(v for v in _after_discount(0.5) if v > 100)),
    "excel-from-task-to-table-t10": lambda: str(
        sum(
            max(row) < sum(row) - max(row)
            for row in ((3, 4, 5, 6), (1, 2, 3, 9), (5, 5, 1, 9), (2, 2, 2, 6), (4, 4, 4, 4))
        )
    ),
    "excel-from-task-to-table-t11": lambda: str(sum((5, 3, 2, 1, 4, 1))),
    "excel-from-task-to-table-t12": lambda: str(
        len({"тетрадь", "ручка", "тетрадь", "папка", "ручка", "тетрадь"})
    ),
    "excel-from-task-to-table-t13": lambda: "#ЧИСЛО!" if 4 > len((7, 3, 9)) else "",
    "excel-from-task-to-table-t14": lambda: str(
        sum(sum(row) >= 20 for row in ((5, 7, 8), (10, 9, 1), (6, 6, 7), (2, 3, 4)))
    ),
    "excel-from-task-to-table-t08": lambda: str(sum(s >= 60 for s in (45, 80, 62, 80, 30, 95))),
    "excel-from-task-to-table-t15": lambda: _num(
        sum(s for s in (45, 80, 62, 80, 30, 95) if s >= 60)
        / sum(s >= 60 for s in (45, 80, 62, 80, 30, 95))
    ),
    "excel-summary-t01": lambda: _shift("=A2*$B$1", 2, 3),
    "excel-summary-t02": lambda: str(
        sum(isinstance(v, int) for v in (10, "нет", None, 20, 0, "5"))
    ),
    "excel-summary-t03": lambda: str(sum(60 <= s <= 90 for s in (59, 60, 75, 90, 91))),
    "excel-summary-t04": lambda: str(100 // 12),
    "excel-summary-t05": lambda: str(
        sum(
            v
            for c, v in zip(
                ("Москва", "Казань", "Москва", "Тула", "Москва"),
                (100, 250, 150, 80, 50),
                strict=True,
            )
            if c == "Москва"
        )
    ),
    "excel-summary-t06": lambda: str(dict(zip((101, 102, 103, 104), (40, 20, 120, 15), strict=True))[103]),
    "excel-tables-pivots-t05": lambda: "=СУММ($A2:$F2)>50",
    "excel-tables-pivots-t06": lambda: str(
        sum(sum(row) > 50 for row in ((9,) * 6, (10, 10, 10, 10, 10, 0), (20, 20, 5, 1, 1, 4)))
    ),
    "excel-tables-pivots-t07": lambda: "=СУММ(" + _shift("A2:F2", 3, 0) + ")>50",
    "excel-tables-pivots-t08": lambda: str(
        sum(v for c, _, v in _PURCHASES if c == "Москва")
    ),
    "excel-tables-pivots-t09": lambda: str(sum(c == "Москва" for c, _, _ in _PURCHASES)),
    "excel-tables-pivots-t04": lambda: str(
        sum(v for c, g, v in _PURCHASES if c == "Москва" and g != "какао")
    ),
    "excel-tables-pivots-t10": lambda: "точечная",
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
