"""Independent answer and content checks for the EGE topic 3 lesson «Связанные таблицы».

The lesson solves the tasks in Excel; the bank takes the answers of the book tasks from
the stand's solver (``topic-3/datasets.py``, a filter over the operations of the book).
Here every answer is recomputed another way: the reference sheets are first turned into
sets of keys (shops of a district or a street, articles of a supplier or of a name part),
and the operations are folded by (shop, article, type, day) before they are summed — the
way subtopic 3 selects with lists of IDs. The small book of the lessons is grouped by shop
and by day directly. The books themselves come from ``datasets.py`` (data, not the
method). A book task attaches its book and shows the spreadsheet formulas.
"""

import datetime
import importlib.util
import sys
from collections import defaultdict
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
TOPIC = ROOT / "content/lesson-design/topic-3"
MATERIAL = "relational-databases"
DAY = datetime.date


def _datasets():
    spec = importlib.util.spec_from_file_location("topic3_books", TOPIC / "datasets.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules["topic3_books"] = module
    spec.loader.exec_module(module)
    return module


ds = _datasets()


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


# --- the books: lists of keys and folded operations --------------------------------------------


def _folded(name: str):
    """(shop, article, type, day) → [packages, money, rows]."""
    out: dict = defaultdict(lambda: [0, 0, 0])
    for m in ds.sbook(name).moves:
        acc = out[(m.shop, m.art, m.kind, m.date)]
        acc[0] += m.packs
        acc[1] += m.packs * m.price
        acc[2] += 1
    return out


def _total(name, shops, arts, kind, first, last, what) -> float:
    goods = ds.sbook(name).goods
    acc = 0.0
    for (s, a, k, d), (packs, money, rows) in _folded(name).items():
        if s not in shops or a not in arts or (kind and k != kind):
            continue
        if (first and d < first) or (last and d > last):
            continue
        acc += {
            "packs": packs,
            "mass": packs * goods[a].qty,
            "money": money,
            "signed": packs if k == ds.IN else -packs,
            "rows": rows,
        }[what]
    return round(acc, 6)


def _g(value: float) -> str:
    return f"{value:g}"


def _shops(name, district=None, street=None) -> set[str]:
    return {
        s.id
        for s in ds.sbook(name).shops.values()
        if (district is None or s.district == district)
        and (street is None or street.lower() in s.address.lower())
    }


def _arts(name, part=None, dept=None, supplier=None, art=None) -> set[int]:
    return {
        g.art
        for g in ds.sbook(name).goods.values()
        if (part is None or part.lower() in g.name.lower())
        and (dept is None or g.dept == dept)
        and (supplier is None or g.supplier == supplier)
        and (art is None or g.art == art)
    }


# --- the small book of the lessons -------------------------------------------------------------

SHOP_DISTRICT = {"M1": "Северный", "M2": "Южный", "M3": "Северный"}
PACK_KG = {101: 0.5, 102: 1.0, 103: 1.0}
FACTORY = {101: "А", 102: "А", 103: "Б"}
OPS = [  # id, day of June (31 — 31 May), shop, article, sale?, packs, price
    (1, 1, "M1", 101, False, 20, 60),
    (2, 2, "M1", 101, True, 8, 80),
    (3, 3, "M3", 101, True, 5, 90),
    (4, 3, "M2", 101, True, 7, 80),
    (5, 4, "M3", 102, True, 4, 140),
    (6, 5, "M1", 103, True, 6, 110),
    (7, 10, "M1", 102, True, 3, 150),
    (8, 11, "M3", 101, True, 9, 85),
    (9, 6, "M3", 101, False, 12, 65),
    (10, 6, "M1", 101, True, 2, 85),
    (11, 7, "M3", 102, False, 6, 100),
    (12, 0, "M1", 101, True, 4, 80),
]


def _june(o) -> bool:
    return 1 <= o[1] <= 10


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    # the small book, grouped by shop and by day
    rows = [(21, "M2", 6), (22, "M3", 4), (23, "M2", 9), (24, "M2", 2)]
    a["task-3-1-04"] = f"{len(rows)} {len({r[1] for r in rows})} {sum(r[2] for r in rows)}"
    sold_a = [o for o in OPS if o[4] and FACTORY[o[3]] == "А" and _june(o)]
    by_shop_kg: dict = defaultdict(float)
    by_shop_money: dict = defaultdict(int)
    for o in sold_a:
        by_shop_kg[o[2]] += o[5] * PACK_KG[o[3]]
        by_shop_money[o[2]] += o[5] * o[6]
    a["task-3-4-01"] = f"{sum(o[5] for o in sold_a)} {len(sold_a)} {len(by_shop_kg)}"
    a["task-3-4-02"] = ds.num(sum(by_shop_kg.values()))
    a["task-3-4-03"] = str(sum(by_shop_money.values()))
    a["task-3-4-04"] = str(sum(o[5] * o[6] for o in OPS if not o[4] and o[3] == 101))
    a["task-3-4-06"] = ds.num(12 * 0.25 * 120)
    a["task-3-5-01"] = str(sum(o[5] * (-1 if o[4] else 1) for o in OPS if o[3] == 101 and _june(o)))
    a["task-3-5-02"] = str(
        sum(o[5] * (-1 if o[4] else 1) for o in OPS if o[3] == 102 and o[2] == "M3")
    )
    north = [o for o in OPS if SHOP_DISTRICT[o[2]] == "Северный" and _june(o)]
    a["task-3-5-04"] = str(-sum(o[5] * (-1 if o[4] else 1) for o in north if o[3] == 102))
    a["task-3-5-07"] = str(sum(o[5] * o[6] * (1 if o[4] else -1) for o in north if o[3] == 101))
    a["task-3-6-01"] = (
        f"{sum(v >= 6.5 for v in by_shop_kg.values())} {sum(v > 6.5 for v in by_shop_kg.values())}"
    )
    shop, low = min(by_shop_money.items(), key=lambda kv: kv[1])
    a["task-3-6-02"] = f"{shop} {low}"
    by_day: dict = defaultdict(int)
    for o in OPS:
        if o[4] and _june(o):
            by_day[o[1]] += o[5] * o[6]
    a["task-3-6-04"] = str(max(by_day, key=lambda d: by_day[d]))
    main = [o for o in sold_a if SHOP_DISTRICT[o[2]] == "Северный"]
    main_kg: dict = defaultdict(float)
    for o in main:
        main_kg[o[2]] += o[5] * PACK_KG[o[3]]
    a["task-3-6-05"] = (
        f"{sum(o[5] * PACK_KG[o[3]] >= 3 for o in main)} {sum(v >= 3 for v in main_kg.values())}"
    )
    a["task-3-7-02"] = str(sum(n * 1200 for n in (5, 2)))
    pairs = [("U1", "K1"), ("U1", "K2"), ("U2", "K1"), ("U3", "K2"), ("U3", "K3")]
    a["task-3-7-04"] = f"{len({p[0] for p in pairs})} {len({p[1] for p in pairs})} {len(pairs)}"
    moves = [(5, 10), (12, 4), (12, -3), (20, -6)]
    a["task-3-7-06"] = str(sum(q for d, q in moves if 5 < d <= 20))
    # the books
    b1 = ds.sbook("3-1")
    a["task-3-1-07"] = (
        f"{_total('3-1', {'M7'}, _arts('3-1'), None, None, None, 'rows'):g} "
        f"{len(_shops('3-1', district='Октябрьский'))}"
    )
    assert b1.moves
    a["task-3-2-08"] = _g(
        _total("3-1", _shops("3-1"), _arts("3-1", supplier=ds.FZ), None, None, None, "rows")
    )
    a["task-3-3-08"] = _g(
        _total(
            "3-2",
            _shops("3-2", street="Металлургов"),
            _arts("3-2", part="зефир"),
            ds.OUT,
            DAY(2026, 6, 10),
            DAY(2026, 6, 20),
            "rows",
        )
    )
    a["task-3-3-09"] = _g(
        _total(
            "3-2",
            _shops("3-2", district="Центральный"),
            _arts("3-2", dept="Молоко"),
            ds.IN,
            DAY(2026, 6, 1),
            DAY(2026, 6, 15),
            "rows",
        )
    )
    m48 = _total(
        "3-3", _shops("3-3", street="Революции"), _arts("3-3", part="зефир"),
        ds.IN, DAY(2026, 8, 5), DAY(2026, 8, 19), "mass",
    )  # fmt: skip
    a["task-3-4-08"] = str(int(m48))
    a["task-3-4-09"] = _g(
        _total(
            "3-3",
            _shops("3-3", district="Первомайский"),
            _arts("3-3", part="ультрапастеризованное"),
            ds.IN,
            DAY(2026, 8, 3),
            DAY(2026, 8, 24),
            "money",
        )
    )
    a["task-3-5-08"] = _g(
        _total(
            "3-4",
            _shops("3-4", district="Октябрьский"),
            _arts("3-4", art=33),
            None,
            DAY(2026, 6, 1),
            DAY(2026, 6, 12),
            "signed",
        )
    )
    a["task-3-5-09"] = _g(
        _total(
            "3-4",
            _shops("3-4", district="Заречный"),
            _arts("3-4", part="мука"),
            None,
            DAY(2026, 6, 3),
            DAY(2026, 6, 9),
            "signed",
        )
    )
    milk = _arts("3-5", dept="Молоко")
    rev = {
        s: _total("3-5", {s}, milk, ds.OUT, DAY(2026, 6, 10), DAY(2026, 6, 20), "money")
        for s in _shops("3-5", district="Центральный")
    }
    a["task-3-6-07"] = max(rev, key=lambda s: rev[s])
    per, bak = _shops("3-5", district="Первомайский"), _arts("3-5", dept="Бакалея")
    day = {
        d: _total("3-5", per, bak, ds.OUT, DAY(2026, 6, d), DAY(2026, 6, d), "money")
        for d in range(1, 31)
    }
    a["task-3-6-08"] = str(max(day, key=lambda d: day[d]))
    sweets = _arts("3-5", dept="Кондитерские изделия")
    a["task-3-6-09"] = str(
        sum(_total("3-5", {s}, sweets, ds.OUT, None, None, "money") > 20000 for s in _shops("3-5"))
    )
    th = ds.tbook("3-6")
    plays = {p[0]: p for p in ds.PLAY_LIST}
    tariff = {t[0]: t for t in ds.TARIFF_LIST}
    a["task-3-7-07"] = str(
        sum(
            s.child * tariff[s.tariff][4]
            for s in th.sales
            if plays[s.play][2] == "М. А. Булгаков"
            and plays[s.play][4] == "драма"
            and tariff[s.tariff][1] in ("Утренний летний", "Вечерний летний")
        )
    )
    a["task-3-7-08"] = str(
        sum(
            s.adult * tariff[s.tariff][2]
            for s in th.sales
            if plays[s.play][3] == "Мухина В. Д."
            and plays[s.play][4] == "комедия"
            and DAY(2026, 3, 1) <= s.date <= DAY(2026, 5, 31)
        )
    )
    m81 = _total(
        "3-7", _shops("3-7", street="Луговая"), _arts("3-7", part="пряники"),
        ds.OUT, DAY(2026, 9, 8), DAY(2026, 9, 21), "mass",
    )  # fmt: skip
    a["task-3-8-01"] = str(int(m81))
    a["task-3-8-02"] = _g(
        _total(
            "3-7",
            _shops("3-7", district="Первомайский"),
            _arts("3-7", art=39),
            None,
            DAY(2026, 9, 1),
            DAY(2026, 9, 15),
            "signed",
        )
    )
    a["task-3-8-03"] = _g(
        _total(
            "3-7",
            _shops("3-7", district="Заречный"),
            _arts("3-7", part="сметана"),
            ds.OUT,
            DAY(2026, 9, 10),
            DAY(2026, 9, 25),
            "money",
        )
    )
    areas = [
        _total(
            "3-8",
            _shops("3-8", district=d),
            _arts("3-8", supplier=ds.M2),
            ds.IN,
            DAY(2026, 10, 5),
            DAY(2026, 10, 18),
            "money",
        )  # fmt: skip
        for d in ds.DISTRICTS
    ]
    a["task-3-8-04"] = f"{max(areas):g}"
    l85 = _total(
        "3-8", _shops("3-8", street="пр. Мира"), _arts("3-8", part="молоко"),
        ds.IN, DAY(2026, 10, 1), DAY(2026, 10, 20), "mass",
    )  # fmt: skip
    a["task-3-8-05"] = str(int(l85))
    return a


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(35))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [3] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-3-8-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith("task-3-7-")
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_book_tasks_attach_the_book_and_show_the_formulas() -> None:
    for task_id, task in _entries().items():
        code = [b for b in task.explanation if b.type == "code_example"]
        assert all(b.data.language == "text" for b in code), task_id
        if task.files:
            assert task.files[0].filename.endswith(".xlsx"), task_id
            assert len(code) == 1 and "=" in code[0].data.code, task_id
            assert all(len(line) <= 64 for line in code[0].data.code.splitlines()), task_id


def test_checker_accepts_the_answer_and_rejects_a_neighbour(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        assert is_correct(task.checker, expected.lower()), task_id
        tokens = expected.split()
        last = tokens[-1]
        tokens[-1] = last[:-1] + chr(ord(last[-1]) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id
