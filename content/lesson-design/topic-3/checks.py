"""Independent recomputation of every task answer in topic 3.

Usage: python3 -I content/lesson-design/topic-3/checks.py

The lessons solve tasks in Excel; datasets.py computes the answers of the books by
walking the operations with a filter per task. Here every answer is recomputed
in other ways:

- the small book of the lessons (3 shops, 3 goods, 12 operations): by hand-like
  Python over its rows, as the text explains (selection, then contribution);
- the books of the exam-format tasks: the reference sheets are first turned into
  sets of keys (shops of a district or a street, articles of a supplier or of a
  name part), and the operations are grouped by (shop, article, type, day) — the
  way subtopic 3 selects with lists of IDs;
- the same answers a third time by the stand's spreadsheet evaluator (sheet_eval)
  on the whole book, with the formulas the lessons teach: ВПР columns next to the
  operations and СУММЕСЛИМН / СЧЁТЕСЛИМН with criteria;
- typical mistakes (one price for all rows, «Продажа» in the stock formula, a
  pattern that catches another street, «>=» instead of «>») must change the
  answer, so a task really tests the point.

Every expected answer must appear verbatim in the answers of its page.
Exit code 1 if any check fails.
"""

from __future__ import annotations

import datetime
import importlib.util
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

D = Path(__file__).resolve().parent
sys.path.insert(0, str(D.parents[2] / "scripts" / "lesson_design"))

from sheet_eval import Book, display  # noqa: E402


def _datasets() -> Any:
    """topic-3/datasets.py: the data of the books (not the method)."""
    spec = importlib.util.spec_from_file_location("topic3_datasets", D / "datasets.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules["topic3_datasets"] = module
    spec.loader.exec_module(module)
    return module


ds = _datasets()
DAY = datetime.date

PAGES = {
    1: "01-tablicy-i-klyuchi.md",
    2: "02-svyaz-listov-vpr.md",
    3: "03-otbor-zapisey.md",
    4: "04-vklad-zapisi.md",
    5: "05-izmenenie-zapasa.md",
    6: "06-itogi-po-obektam.md",
    7: "07-drugie-bazy.md",
    8: "08-praktika-i-itog.md",
}
checks: list[tuple[str, str, bool]] = []


def answers(page: int) -> str:
    text = (D / PAGES[page]).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


def text(page: int) -> str:
    return (D / PAGES[page]).read_text(encoding="utf-8")


def expect(page: int, needle: str, where: str = "answers") -> None:
    hay = answers(page) if where == "answers" else text(page)
    checks.append((PAGES[page], needle, needle in hay))


def same(label: str, a, b) -> None:
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def differ(label: str, a, b) -> None:
    checks.append(("—", f"{label}: {a} ≠ {b}", a != b))


def num(x: float) -> str:
    return ds.num(x)


# --- the small book of the lessons ------------------------------------------------------------

SHOPS = {"M1": "Северный", "M2": "Южный", "M3": "Северный"}
PACK = {101: 0.5, 102: 1.0, 103: 1.0}
SUPPLIER = {101: "А", 102: "А", 103: "Б"}
OPS = [  # id, date, shop, article, sale?, packs, price
    (1, DAY(2026, 6, 1), "M1", 101, False, 20, 60),
    (2, DAY(2026, 6, 2), "M1", 101, True, 8, 80),
    (3, DAY(2026, 6, 3), "M3", 101, True, 5, 90),
    (4, DAY(2026, 6, 3), "M2", 101, True, 7, 80),
    (5, DAY(2026, 6, 4), "M3", 102, True, 4, 140),
    (6, DAY(2026, 6, 5), "M1", 103, True, 6, 110),
    (7, DAY(2026, 6, 10), "M1", 102, True, 3, 150),
    (8, DAY(2026, 6, 11), "M3", 101, True, 9, 85),
    (9, DAY(2026, 6, 6), "M3", 101, False, 12, 65),
    (10, DAY(2026, 6, 6), "M1", 101, True, 2, 85),
    (11, DAY(2026, 6, 7), "M3", 102, False, 6, 100),
    (12, DAY(2026, 5, 31), "M1", 101, True, 4, 80),
]
FIRST, LAST = DAY(2026, 6, 1), DAY(2026, 6, 10)


def small(
    *,
    sale: bool | None = True,
    district: str | None = "Северный",
    supplier: str | None = "А",
    first: datetime.date | None = FIRST,
    last: datetime.date | None = LAST,
    art: int | None = None,
):
    return [
        o
        for o in OPS
        if (sale is None or o[4] == sale)
        and (district is None or SHOPS[o[2]] == district)
        and (supplier is None or SUPPLIER[o[3]] == supplier)
        and (art is None or o[3] == art)
        and (first is None or o[1] >= first)
        and (last is None or o[1] <= last)
    ]


def kg(rows) -> float:
    return sum(o[5] * PACK[o[3]] for o in rows)


def money(rows) -> int:
    return sum(o[5] * o[6] for o in rows)


def stock(rows) -> int:
    return sum(-o[5] if o[4] else o[5] for o in rows)


main = small()
same("отбор основного вопроса", [o[0] for o in main], [2, 3, 5, 7, 10])
same("масса", kg(main), 14.5)
same("упаковки", sum(o[5] for o in main), 22)
same("выручка", money(main), 2270)
same("закупка", money(small(sale=False)), 2580)
same("запас 101", stock(small(sale=None, art=101)), 17)
same("запас 102", stock(small(sale=None, art=102)), -1)
same("запас в кг", kg(small(sale=False)) - kg(main), 7.5)
same("прибыль", money(main) - money(small(sale=False)), -310)
naive = sum(o[5] for o in main) * 0.5
differ("22 · 0,5 вместо массы по строкам", naive, kg(main))
by_shop: dict[str, float] = defaultdict(float)
for o in main:
    by_shop[o[2]] += o[5] * PACK[o[3]]
same("итоги магазинов", dict(by_shop), {"M1": 8.0, "M3": 6.5})
for page, needle in [
    (3, "операции 2, 3, 5, 7 и 10"),
    (4, "**14,5 кг**"),
    (4, "**2270**"),
    (4, "**2580**"),
    (5, "32 − 15 = 17"),
    (5, "22 − 14,5 = 7,5 кг"),
    (5, "2270 − 2580 = −310"),
    (6, "4 + 3 + 1 = 8 кг"),
]:
    expect(page, needle.replace("операции", "операции"), "text")

# page 1, tasks 4–6 and the text example
expect(1, "4 записи, 2 магазина (M2 и M3), 6 + 4 + 9 + 2 = 21 упаковка")
same("M1 в операциях", [o[0] for o in OPS if o[2] == "M1"], [1, 2, 6, 7, 10, 12])
expect(1, "операции 1, 2, 6, 7, 10 и 12", "text")

# page 3
south = [s for s, d in SHOPS.items() if d == "Южный"]
same("Южный район", south, ["M2"])
all_a = small(district=None)
same("фабрика А во всех районах", [o[0] for o in all_a], [2, 3, 4, 5, 7, 10])
expect(3, "Операции 2, 3, 4, 5, 7, 10")
or_rows = [
    o for o in OPS if SHOPS[o[2]] == "Северный" or SUPPLIER[o[3]] == "А" or o[4]
]  # the mistake of task 4: every check joined by ИЛИ
same("ИЛИ вместо И", len(or_rows), 12)
expect(3, "Все 12")

# page 4
same("4.1 упаковки", sum(o[5] for o in all_a), 29)
same("4.1 магазины", sorted({o[2] for o in all_a}), ["M1", "M2", "M3"])
expect(4, "29 упаковок")
same("4.2 масса", kg(all_a), 18.0)
expect(4, "18 кг")
same("4.3 выручка", money(all_a), 2830)
expect(4, "2830 рублей")
same(
    "4.4 закупка 101",
    money(small(sale=False, district=None, supplier=None, first=None, last=None, art=101)),
    1980,
)
expect(4, "1980 рублей")
same("4.5", 18 * 0.25, 4.5)
expect(4, "18 · 0,25 = 4,5 кг")
same("4.6", 12 * 0.25 * 120, 360)
expect(4, "= 360 рублей")
changed = [(o[0], o[1], o[2], o[3], o[4], 7 if o[0] == 3 else o[5], o[6]) for o in OPS]
same(
    "правка операции 3: масса",
    sum(o[5] * PACK[o[3]] for o in changed if o[0] in (2, 3, 5, 7, 10)),
    15.5,
)
expect(4, "масса станет 15,5, выручка 2450", "text")

# page 5
s101 = stock(small(sale=None, district=None, supplier=None, art=101))
same("5.1", s101, 10)
expect(5, "1. 10:")
s102m3 = stock([o for o in OPS if o[2] == "M3" and o[3] == 102])
same("5.2", s102m3, 2)
m1_101 = stock([o for o in OPS if o[2] == "M1" and o[3] == 101 and FIRST <= o[1] <= LAST])
same("5.3", 30 + m1_101, 40)
expect(5, "3. 40: 30 + 20 − 8 − 2")
sales_only = stock([o for o in OPS if SHOPS[o[2]] == "Северный" and o[3] == 101 and o[4]])
same("5.5 условие «Продажа»", sales_only, -28)
expect(5, "= −28")
moved = [(o[0], LAST if o[0] == 8 else o[1], *o[2:]) for o in OPS]
moved_main = [
    o
    for o in moved
    if o[4] and SHOPS[o[2]] == "Северный" and SUPPLIER[o[3]] == "А" and FIRST <= o[1] <= LAST
]
same("5.6 масса", kg(moved_main) - kg(main), 4.5)
same("5.6 выручка", money(moved_main) - money(main), 765)
moved_stock = stock(
    [o for o in moved if SHOPS[o[2]] == "Северный" and o[3] == 101 and FIRST <= o[1] <= LAST]
)
same("5.6 запас", moved_stock, 8)
expect(5, "с 17 до 8")
p101 = money(small(supplier=None, art=101)) - money(small(sale=False, supplier=None, art=101))
same("5.7 прибыль 101", p101, -720)
expect(5, "−720 рублей")

# page 6
tot: dict[str, float] = defaultdict(float)
rev: dict[str, int] = defaultdict(int)
for o in all_a:
    tot[o[2]] += o[5] * PACK[o[3]]
    rev[o[2]] += o[5] * o[6]
same("6.1", (sum(v >= 6.5 for v in tot.values()), sum(v > 6.5 for v in tot.values())), (2, 1))
expect(6, "1. 2 и 1")
low = min(rev.items(), key=lambda kv: kv[1])
same("6.2", low, ("M2", 560))
expect(6, "M2, 560 рублей")
r101 = [o for o in OPS if o[3] == 101 and o[4]]
same("6.3 операция", max(o[5] * o[6] for o in r101), 765)
shop101: dict[str, int] = defaultdict(int)
for o in r101:
    shop101[o[2]] += o[5] * o[6]
same("6.3 магазин", max(shop101.items(), key=lambda kv: kv[1]), ("M3", 1215))
expect(6, "M3 — 450 + 765 = 1215")
days: dict[int, int] = defaultdict(int)
for o in OPS:
    if o[4] and FIRST <= o[1] <= LAST:
        days[o[1].day] += o[5] * o[6]
best_day = max(days.items(), key=lambda kv: kv[1])
same("6.4", best_day, (3, 1010))
expect(6, "4. 3: 3 июня")
same(
    "6.5",
    (sum(o[5] * PACK[o[3]] >= 3 for o in main), sum(v >= 3 for v in by_shop.values())),
    (3, 2),
)
expect(6, "3 продажи")

# page 7: the small theatre base of the text
PLAYS = {
    101: ("М. А. Булгаков", "драма"),
    104: ("А. П. Чехов", "комедия"),
    110: ("С. Я. Маршак", "сказка"),
}
TARIFF = {
    "T1": ("Утренний летний", 600, 400, 300),
    "T3": ("Вечерний летний", 1200, 800, 600),
    "T6": ("Вечерний зимний", 1400, 900, 700),
}
SALES = [
    (1, 101, "T1", 4, 1, 3),
    (2, 110, "T1", 2, 0, 6),
    (3, 101, "T3", 5, 2, 2),
    (4, 101, "T6", 3, 1, 4),
    (5, 104, "T3", 6, 0, 1),
    (6, 101, "T3", 2, 1, 0),
]
child = sum(
    s[5] * TARIFF[s[2]][3]
    for s in SALES
    if PLAYS[s[1]] == ("М. А. Булгаков", "драма")
    and TARIFF[s[2]][0] in ("Утренний летний", "Вечерний летний")
)
same("театр, пример", child, 2100)
expect(7, "**2100**", "text")
same("7.1", sum(SALES[2][3:]), 9)
expect(7, "= 9 билетов")
same("7.2", sum(s[3] * TARIFF[s[2]][1] for s in SALES if s[1] == 101 and s[2] == "T3"), 8400)
expect(7, "8400 рублей")
pairs = [("U1", "K1"), ("U1", "K2"), ("U2", "K1"), ("U3", "K2"), ("U3", "K3")]
same("7.4", (len({p[0] for p in pairs}), len({p[1] for p in pairs}), len(pairs)), (3, 3, 5))
expect(7, "3 ученика, 3 кружка, 5 пар")
moves7 = [
    (DAY(2026, 1, 5), 10),
    (DAY(2026, 1, 12), 4),
    (DAY(2026, 1, 12), -3),
    (DAY(2026, 1, 20), -6),
]
same("7.6", sum(q for d, q in moves7 if DAY(2026, 1, 5) < d <= DAY(2026, 1, 20)), -5)
expect(7, "6. −5")


# --- the books: lists of keys and grouped operations -----------------------------------------


def keys(name: str):
    b = ds.sbook(name)
    return b, b.shops, b.goods


def grouped(name: str) -> dict[tuple[str, int, str, datetime.date], tuple[int, int]]:
    """(shop, article, type, day) → (packages, money): the operations folded."""
    out: dict[tuple[str, int, str, datetime.date], tuple[int, int]] = {}
    for m in ds.sbook(name).moves:
        k = (m.shop, m.art, m.kind, m.date)
        p, c = out.get(k, (0, 0))
        out[k] = (p + m.packs, c + m.packs * m.price)
    return out


def total(name, shops, arts, kind, first, last, what):
    """Sum over the folded operations of the given shops and articles."""
    b, _, goods = keys(name)
    acc = 0.0
    for (s, a, k, d), (p, c) in grouped(name).items():
        if s not in shops or a not in arts or (kind and k != kind):
            continue
        if (first and d < first) or (last and d > last):
            continue
        if what == "packs":
            acc += p
        elif what == "mass":
            acc += p * goods[a].qty
        elif what == "money":
            acc += c
        elif what == "signed":
            acc += p if k == ds.IN else -p
        elif what == "rows":
            acc += sum(1 for m in b.moves if (m.shop, m.art, m.kind, m.date) == (s, a, k, d))
    return round(acc, 6)


def shops_where(name, *, district=None, street=None):
    _, shops, _ = keys(name)
    return {
        s.id
        for s in shops.values()
        if (district is None or s.district == district)
        and (street is None or street.lower() in s.address.lower())
    }


def arts_where(name, *, part=None, dept=None, supplier=None, art=None):
    _, _, goods = keys(name)
    return {
        g.art
        for g in goods.values()
        if (part is None or part.lower() in g.name.lower())
        and (dept is None or g.dept == dept)
        and (supplier is None or g.supplier == supplier)
        and (art is None or g.art == art)
    }


ALL = None


def every_shop(name):
    return shops_where(name)


def every_art(name):
    return arts_where(name)


T = {label: solve() for label, (_, solve) in ds.TASKS.items()}

b1 = ds.sbook("3-1")
same(
    "1.7",
    (sum(1 for m in b1.moves if m.shop == "M7"), len(shops_where("3-1", district="Октябрьский"))),
    T["1.7"],
)
expect(1, f"`{T['1.7'][0]} {T['1.7'][1]}`")
z = shops_where("3-1", district="Заречный")
same(
    "1.8",
    (
        sorted(z, key=lambda s: int(s[1:])),
        int(total("3-1", z, every_art("3-1"), None, None, None, "rows")),
    ),
    T["1.8"],
)
expect(1, f"{', '.join(T['1.8'][0])}; всего {T['1.8'][1]} операций")
m75 = next(m for m in b1.moves if m.id == 75)
same("2.7", f"{b1.shops[m75.shop].district} {b1.goods[m75.art].supplier}", T["2.7"])
expect(2, f"`{T['2.7']}`")
expect(2, f"магазин {m75.shop} и артикул {m75.art}")
same(
    "2.8",
    int(
        total("3-1", every_shop("3-1"), arts_where("3-1", supplier=ds.FZ), None, None, None, "rows")
    ),
    T["2.8"],
)
expect(2, f"{T['2.8']} операций")

r38 = int(
    total(
        "3-2",
        shops_where("3-2", street="Металлургов"),
        arts_where("3-2", part="зефир"),
        ds.OUT,
        DAY(2026, 6, 10),
        DAY(2026, 6, 20),
        "rows",
    )
)
same("3.8", r38, T["3.8"])
expect(3, f"{T['3.8']} операций")
r39 = int(
    total(
        "3-2",
        shops_where("3-2", district="Центральный"),
        arts_where("3-2", dept="Молоко"),
        ds.IN,
        DAY(2026, 6, 1),
        DAY(2026, 6, 15),
        "rows",
    )
)
same("3.9", r39, T["3.9"])
expect(3, f"9. {T['3.9']} операций")

m48 = total(
    "3-3",
    shops_where("3-3", street="Революции"),
    arts_where("3-3", part="зефир"),
    ds.IN,
    DAY(2026, 8, 5),
    DAY(2026, 8, 19),
    "mass",
)
same("4.8", m48, T["4.8"])
expect(4, f"`{int(m48)}`: масса {num(m48)} кг")
c49 = int(
    total(
        "3-3",
        shops_where("3-3", district="Первомайский"),
        arts_where("3-3", part="ультрапастеризованное"),
        ds.IN,
        DAY(2026, 8, 3),
        DAY(2026, 8, 24),
        "money",
    )
)
same("4.9", c49, T["4.9"])
expect(4, f"{T['4.9']} рублей")

s58 = int(
    total(
        "3-4",
        shops_where("3-4", district="Октябрьский"),
        arts_where("3-4", art=33),
        None,
        DAY(2026, 6, 1),
        DAY(2026, 6, 12),
        "signed",
    )
)
same("5.8", s58, T["5.8"])
expect(5, f"{T['5.8']}: поступления минус продажи")
s59 = int(
    total(
        "3-4",
        shops_where("3-4", district="Заречный"),
        arts_where("3-4", part="мука"),
        None,
        DAY(2026, 6, 3),
        DAY(2026, 6, 9),
        "signed",
    )
)
same("5.9", s59, T["5.9"])
expect(5, f"{str(T['5.9']).replace('-', '−')}: два вида муки")
only_sales = int(
    total(
        "3-4",
        shops_where("3-4", district="Октябрьский"),
        arts_where("3-4", art=33),
        ds.OUT,
        DAY(2026, 6, 1),
        DAY(2026, 6, 12),
        "signed",
    )
)
differ("5.8 с условием «Продажа»", only_sales, s58)

cent = shops_where("3-5", district="Центральный")
milk = arts_where("3-5", dept="Молоко")
rev68 = {
    s: total("3-5", {s}, milk, ds.OUT, DAY(2026, 6, 10), DAY(2026, 6, 20), "money") for s in cent
}
best68 = max(rev68, key=lambda s: rev68[s])
same("6.8", best68, T["6.8"])
same("6.8 единственный максимум", sorted(rev68.values())[-1] != sorted(rev68.values())[-2], True)
expect(6, f"`{T['6.8']}`")
per = shops_where("3-5", district="Первомайский")
bak = arts_where("3-5", dept="Бакалея")
rev69 = {
    d: total("3-5", per, bak, ds.OUT, DAY(2026, 6, d), DAY(2026, 6, d), "money")
    for d in range(1, 31)
}
best69 = max(rev69, key=lambda d: rev69[d])
same("6.9", best69, T["6.9"])
expect(6, f"8. {T['6.9']}:")
conf = arts_where("3-5", dept="Кондитерские изделия")
rev610 = [total("3-5", {s}, conf, ds.OUT, None, None, "money") for s in every_shop("3-5")]
same("6.10", sum(v > 20000 for v in rev610), T["6.10"])
expect(6, f"{T['6.10']} магазинов")

th = ds.tbook("3-6")
plays = {p[0]: p for p in ds.PLAY_LIST}
tar = {t[0]: t for t in ds.TARIFF_LIST}
r77 = sum(
    s.child * tar[s.tariff][4]
    for s in th.sales
    if plays[s.play][2] == "М. А. Булгаков"
    and plays[s.play][4] == "драма"
    and tar[s.tariff][1] in ("Утренний летний", "Вечерний летний")
)
same("7.7", r77, T["7.7"])
expect(7, f"{T['7.7']} рублей")
r78 = sum(
    s.adult * tar[s.tariff][2]
    for s in th.sales
    if plays[s.play][3] == "Мухина В. Д."
    and plays[s.play][4] == "комедия"
    and DAY(2026, 3, 1) <= s.date <= DAY(2026, 5, 31)
)
same("7.8", r78, T["7.8"])
expect(7, f"{T['7.8']} рублей")
wide77 = sum(
    s.child * tar[s.tariff][4]
    for s in th.sales
    if plays[s.play][2] == "М. А. Булгаков"
    and plays[s.play][4] == "драма"
    and tar[s.tariff][1].endswith("летний")
)
differ("7.7 шаблон «*летний» захватил дневной", wide77, r77)

m81 = total(
    "3-7",
    shops_where("3-7", street="Луговая"),
    arts_where("3-7", part="пряники"),
    ds.OUT,
    DAY(2026, 9, 8),
    DAY(2026, 9, 21),
    "mass",
)
same("8.1", m81, T["8.1"])
expect(8, f"`{int(m81)}`: масса {num(m81)} кг")
s82 = int(
    total(
        "3-7",
        shops_where("3-7", district="Первомайский"),
        arts_where("3-7", art=39),
        None,
        DAY(2026, 9, 1),
        DAY(2026, 9, 15),
        "signed",
    )
)
same("8.2", s82, T["8.2"])
expect(8, f"`{T['8.2']}`")
c83 = int(
    total(
        "3-7",
        shops_where("3-7", district="Заречный"),
        arts_where("3-7", part="сметана"),
        ds.OUT,
        DAY(2026, 9, 10),
        DAY(2026, 9, 25),
        "money",
    )
)
same("8.3", c83, T["8.3"])
expect(8, f"`{T['8.3']}`")
areas = {
    d: total(
        "3-8",
        shops_where("3-8", district=d),
        arts_where("3-8", supplier=ds.M2),
        ds.IN,
        DAY(2026, 10, 5),
        DAY(2026, 10, 18),
        "money",
    )
    for d in ds.DISTRICTS
}
same("8.4", int(max(areas.values())), T["8.4"])
expect(8, f"`{T['8.4']}`")
l85 = total(
    "3-8",
    shops_where("3-8", street="пр. Мира"),
    arts_where("3-8", part="молоко"),
    ds.IN,
    DAY(2026, 10, 1),
    DAY(2026, 10, 20),
    "mass",
)
same("8.5", l85, T["8.5"])
expect(8, f"`{int(l85)}`: {num(l85)} л")
wide85 = total(
    "3-8",
    shops_where("3-8", street="Мир"),
    arts_where("3-8", part="молоко"),
    ds.IN,
    DAY(2026, 10, 1),
    DAY(2026, 10, 20),
    "mass",
)
differ("8.5 шаблон «*Мир*»", wide85, l85)


# --- the books a third time: the stand's spreadsheet evaluator --------------------------------


def cell_text(v) -> str:
    if isinstance(v, datetime.date):
        return v.strftime("%d.%m.%Y")
    if isinstance(v, float):
        return f"{v:.6f}".rstrip("0").rstrip(".").replace(".", ",")
    return str(v)


def letters(n: int) -> str:
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[n]


def shop_sheet(name: str) -> tuple[Book, int]:
    """The book as sheets plus the lesson's columns next to the operations."""
    book = Book()
    sheets = ds.sbook(name).sheets()
    for title, head, rows in sheets:
        for c, h in enumerate(head):
            book.set(title, f"{letters(c)}1", h)
        for r, row in enumerate(rows, start=2):
            for c, v in enumerate(row):
                book.set(title, f"{letters(c)}{r}", cell_text(v))
    n = len(sheets[0][2]) + 1
    shops_n = len(sheets[2][2]) + 1
    goods_n = len(sheets[1][2]) + 1
    shop = f"'Магазин'!$A$2:$C${shops_n}"
    good = f"'Товар'!$A$2:$F${goods_n}"
    for r in range(2, n + 1):
        sh = "Движение товаров"
        book.set(sh, f"H{r}", f"=ВПР(C{r};{shop};2;0)")
        book.set(sh, f"I{r}", f"=ВПР(C{r};{shop};3;0)")
        book.set(sh, f"J{r}", f"=ВПР(D{r};{good};2;0)")
        book.set(sh, f"K{r}", f"=ВПР(D{r};{good};3;0)")
        book.set(sh, f"L{r}", f"=ВПР(D{r};{good};6;0)")
        book.set(sh, f"M{r}", f"=F{r}*ВПР(D{r};{good};5;0)")
        book.set(sh, f"N{r}", f"=F{r}*G{r}")
        book.set(sh, f"O{r}", f'=ЕСЛИ(E{r}="Поступление";F{r};-F{r})')
    return book, n


def sheet_value(name: str, formula: str):
    book, n = shop_sheet(name)
    book.set("Движение товаров", "Z1", formula.replace("#", str(n)))
    return book.value("Движение товаров", "Z1")


def period(first: datetime.date, last: datetime.date) -> str:
    return (
        f'B2:B#;">="&ДАТА({first.year};{first.month};{first.day});'
        f'B2:B#;"<="&ДАТА({last.year};{last.month};{last.day})'
    )


def sheet_check(label: str, name: str, formula: str, expected) -> None:
    value = display(sheet_value(name, formula))
    shown = num(expected) if isinstance(expected, float) else str(expected)
    same(f"{label} формулами листа", value, shown)


sheet_check("1.7", "3-1", '=СЧЁТЕСЛИ(C2:C#;"M7")', T["1.7"][0])
sheet_check("2.8", "3-1", '=СЧЁТЕСЛИ(L2:L#;"Фабрика «Заря»")', T["2.8"])
sheet_check(
    "3.8",
    "3-2",
    '=СЧЁТЕСЛИМН(K2:K#;"*зефир*";I2:I#;"*Металлургов*";E2:E#;"Продажа";'
    + period(DAY(2026, 6, 10), DAY(2026, 6, 20))
    + ")",
    T["3.8"],
)
sheet_check(
    "3.9",
    "3-2",
    '=СЧЁТЕСЛИМН(J2:J#;"Молоко";H2:H#;"Центральный";E2:E#;"Поступление";'
    + period(DAY(2026, 6, 1), DAY(2026, 6, 15))
    + ")",
    T["3.9"],
)
sheet_check(
    "4.8",
    "3-3",
    '=СУММЕСЛИМН(M2:M#;K2:K#;"*зефир*";I2:I#;"*Революции*";E2:E#;"Поступление";'
    + period(DAY(2026, 8, 5), DAY(2026, 8, 19))
    + ")",
    T["4.8"],
)
sheet_check(
    "4.9",
    "3-3",
    '=СУММЕСЛИМН(N2:N#;K2:K#;"*ультрапастеризованное*";H2:H#;"Первомайский";'
    'E2:E#;"Поступление";' + period(DAY(2026, 8, 3), DAY(2026, 8, 24)) + ")",
    T["4.9"],
)
sheet_check(
    "5.8",
    "3-4",
    '=СУММЕСЛИМН(O2:O#;D2:D#;33;H2:H#;"Октябрьский";'
    + period(DAY(2026, 6, 1), DAY(2026, 6, 12))
    + ")",
    T["5.8"],
)
sheet_check(
    "5.9",
    "3-4",
    '=СУММЕСЛИМН(O2:O#;K2:K#;"*мука*";H2:H#;"Заречный";'
    + period(DAY(2026, 6, 3), DAY(2026, 6, 9))
    + ")",
    T["5.9"],
)
sheet_check(
    "6.10 (M5)",
    "3-5",
    '=СУММЕСЛИМН(N2:N#;C2:C#;"M5";J2:J#;"Кондитерские изделия";E2:E#;"Продажа")',
    int(total("3-5", {"M5"}, conf, ds.OUT, None, None, "money")),
)
sheet_check(
    "8.1",
    "3-7",
    '=СУММЕСЛИМН(M2:M#;K2:K#;"*пряники*";I2:I#;"*Луговая*";E2:E#;"Продажа";'
    + period(DAY(2026, 9, 8), DAY(2026, 9, 21))
    + ")",
    T["8.1"],
)
sheet_check(
    "8.3",
    "3-7",
    '=СУММЕСЛИМН(N2:N#;K2:K#;"*сметана*";H2:H#;"Заречный";E2:E#;"Продажа";'
    + period(DAY(2026, 9, 10), DAY(2026, 9, 25))
    + ")",
    T["8.3"],
)
sheet_check(
    "8.5",
    "3-8",
    '=СУММЕСЛИМН(M2:M#;K2:K#;"*молоко*";I2:I#;"пр. Мира*";E2:E#;"Поступление";'
    + period(DAY(2026, 10, 1), DAY(2026, 10, 20))
    + ")",
    T["8.5"],
)

# the answers of datasets.py and of the text agree on the form
same("4.8 не целое", m48 != int(m48), True)
same("8.1 не целое", m81 != int(m81), True)
same("8.5 не целое", l85 != int(l85), True)
same("5.9 отрицательное", T["5.9"] < 0, True)

bad = [x for x in checks if not x[2]]
for f_, needle, ok in checks:
    if not ok:
        print(f"FAIL {f_}: {needle}")
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
