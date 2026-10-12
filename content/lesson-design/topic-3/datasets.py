"""Generate the workbooks of topic 3 and print the answers of their tasks.

Usage:
    python3 -I content/lesson-design/topic-3/datasets.py
        print the answer of every exam-format task
    uv run --no-project --with openpyxl python -I content/lesson-design/topic-3/datasets.py --write
        write files/3-N.xlsx
    uv run --no-project --with openpyxl python -I content/lesson-design/topic-3/datasets.py --check
        every book holds exactly the sheets, headers and values of its data

Every exam-format task works on our own book, never on a file of the collection.
As on the exam, a book has three linked sheets: the operations («Движение
товаров», hundreds of rows), the goods («Товар») and the shops («Магазин»);
headers are those of the exam files, dates are date values, the price column is
the price of one package (the exam calls it «Цена, руб./шт.»). Book 3-6 is the
theatre database of the advanced subtopic. Books come from fixed seeds and never
change; ``assert_shape`` checks that each book has the property its tasks rely on.

The answers here walk the records with Python filters, one task at a time;
checks.py recomputes them with dictionaries grouped another way and with the
stand's spreadsheet evaluator on the whole book (ВПР columns and СУММЕСЛИМН).
"""

from __future__ import annotations

import datetime
import random
import re
import sys
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

HERE = Path(__file__).resolve().parent
FILES = HERE / "files"
D = datetime.date

MOVES = "Движение товаров"
GOODS = "Товар"
SHOPS = "Магазин"
MOVE_HEAD = [
    "ID операции",
    "Дата",
    "ID магазина",
    "Артикул",
    "Тип операции",
    "Количество упаковок, шт.",
    "Цена, руб./шт.",
]
GOOD_HEAD = ["Артикул", "Отдел", "Наименование", "Ед. изм.", "Количество в упаковке", "Поставщик"]
SHOP_HEAD = ["ID магазина", "Район", "Адрес"]
IN, OUT = "Поступление", "Продажа"

# --- the shops and the goods (the same reference sheets in every shop book) ------------------

DISTRICTS = ["Заречный", "Центральный", "Октябрьский", "Первомайский"]
STREETS = [
    "ул. Металлургов",
    "ул. Луговая",
    "пр. Революции",
    "ул. Садовая",
    "пр. Мира",
    "ул. Мирная",
]
# shop id → (district, street index, house): a street crosses districts, so «на улице»
# and «в районе» pick different shops; «пр. Мира» and «ул. Мирная» share «Мир»
SHOP_LIST = [
    ("M1", 0, 0, 12),
    ("M2", 0, 1, 5),
    ("M3", 0, 2, 41),
    ("M4", 0, 3, 3),
    ("M5", 1, 4, 87),
    ("M6", 1, 0, 14),
    ("M7", 1, 1, 2),
    ("M8", 1, 5, 9),
    ("M9", 2, 4, 33),
    ("M10", 2, 2, 7),
    ("M11", 2, 0, 18),
    ("M12", 2, 3, 25),
    ("M13", 3, 4, 56),
    ("M14", 3, 1, 4),
    ("M15", 3, 2, 61),
    ("M16", 3, 5, 30),
]

M1, M2, BK, FZ, SK, MK, PF = (
    "Молокозавод № 1",
    "Молокозавод № 2",
    "Мелькомбинат",
    "Фабрика «Заря»",
    "Фабрика «Сладкий край»",
    "Мясокомбинат «Восток»",
    "Птицефабрика «Рассвет»",
)
# article, department, name, unit, quantity in a package, supplier, purchase price
GOOD_LIST = [
    (11, "Молоко", "Молоко 2,5%", "л", 1, M1, 64),
    (12, "Молоко", "Молоко 3,2%", "л", 0.9, M2, 71),
    (13, "Молоко", "Молоко ультрапастеризованное 2,5%", "л", 1, M1, 82),
    (14, "Молоко", "Молоко ультрапастеризованное 3,2%", "л", 0.95, M2, 89),
    (15, "Молоко", "Кефир 1%", "л", 0.9, M1, 58),
    (16, "Молоко", "Сметана 15%", "кг", 0.3, M1, 74),
    (17, "Молоко", "Сметана 20%", "кг", 0.3, M2, 86),
    (18, "Молоко", "Творог 5%", "кг", 0.2, M2, 92),
    (19, "Молоко", "Йогурт питьевой клубничный", "л", 0.3, M1, 45),
    (20, "Молоко", "Сливки 10%", "л", 0.5, M2, 97),
    (31, "Бакалея", "Мука пшеничная", "кг", 2, BK, 88),
    (32, "Бакалея", "Мука ржаная", "кг", 1, BK, 61),
    (33, "Бакалея", "Сахар песок", "кг", 1, BK, 79),
    (34, "Бакалея", "Сахар тростниковый", "кг", 0.5, BK, 96),
    (35, "Бакалея", "Рис круглозёрный", "кг", 0.9, BK, 83),
    (36, "Бакалея", "Рис длиннозёрный", "кг", 0.9, BK, 99),
    (37, "Бакалея", "Макароны рожки", "кг", 0.45, BK, 54),
    (38, "Бакалея", "Макароны перья", "кг", 0.45, BK, 57),
    (39, "Бакалея", "Крупа гречневая", "кг", 0.8, BK, 76),
    (40, "Бакалея", "Соль поваренная", "кг", 1, BK, 21),
    (51, "Кондитерские изделия", "Зефир ванильный", "кг", 0.25, FZ, 118),
    (52, "Кондитерские изделия", "Зефир шоколадный", "кг", 0.25, FZ, 131),
    (53, "Кондитерские изделия", "Зефир с клюквой", "кг", 0.3, SK, 142),
    (54, "Кондитерские изделия", "Пастила яблочная", "кг", 0.2, SK, 104),
    (55, "Кондитерские изделия", "Мармелад жевательный", "кг", 0.1, SK, 63),
    (56, "Кондитерские изделия", "Мармелад лимонный", "кг", 0.3, FZ, 112),
    (57, "Кондитерские изделия", "Пряники медовые", "кг", 0.5, FZ, 109),
    (58, "Кондитерские изделия", "Пряники мятные", "кг", 0.5, SK, 101),
    (59, "Кондитерские изделия", "Печенье овсяное", "кг", 0.4, FZ, 87),
    (60, "Кондитерские изделия", "Карамель «Лимонная»", "кг", 0.25, SK, 93),
    (71, "Мясная гастрономия", "Колбаса докторская", "кг", 0.5, MK, 245),
    (72, "Мясная гастрономия", "Бекон варёно-копчёный", "кг", 0.2, MK, 189),
    (73, "Мясная гастрономия", "Паштет печёночный", "кг", 0.15, MK, 72),
    (74, "Мясная гастрономия", "Сосиски молочные", "кг", 0.4, MK, 163),
    (81, "Яйцо", "Яйцо куриное С1", "шт.", 10, PF, 98),
    (82, "Яйцо", "Яйцо перепелиное", "шт.", 20, PF, 115),
]


@dataclass(frozen=True)
class Shop:
    id: str
    district: str
    address: str


@dataclass(frozen=True)
class Good:
    art: int
    dept: str
    name: str
    unit: str
    qty: float
    supplier: str
    buy: int  # purchase price of a package

    @property
    def sale(self) -> int:
        return round(self.buy * 1.3)


@dataclass(frozen=True)
class Move:
    id: int
    date: datetime.date
    shop: str
    art: int
    kind: str
    packs: int
    price: int


def shops() -> list[Shop]:
    return [Shop(sid, DISTRICTS[d], f"{STREETS[s]}, {house}") for sid, d, s, house in SHOP_LIST]


def goods() -> list[Good]:
    return [Good(*g) for g in GOOD_LIST]


@dataclass
class ShopBook:
    name: str
    moves: list[Move]

    @property
    def shops(self) -> dict[str, Shop]:
        return {s.id: s for s in shops()}

    @property
    def goods(self) -> dict[int, Good]:
        return {g.art: g for g in goods()}

    def sheets(self) -> list[tuple[str, list[str], list[list]]]:
        return [
            (
                MOVES,
                MOVE_HEAD,
                [[m.id, m.date, m.shop, m.art, m.kind, m.packs, m.price] for m in self.moves],
            ),
            (
                GOODS,
                GOOD_HEAD,
                [[g.art, g.dept, g.name, g.unit, g.qty, g.supplier] for g in goods()],
            ),
            (SHOPS, SHOP_HEAD, [[s.id, s.district, s.address] for s in shops()]),
        ]


def make_moves(seed: int, start: datetime.date, days: int, n: int, active: list[int]) -> list[Move]:
    """n operations with the ``active`` goods over ``days`` days, in date order.

    ID операции grows with the date. The goods sheet lists the whole catalogue, as
    on the exam; only some goods move in a given book.
    """
    rnd = random.Random(seed)
    catalog = [g for g in goods() if g.art in active]
    assert len(catalog) == len(active)
    ids = [s[0] for s in SHOP_LIST]
    rows = []
    for _ in range(n):
        day = start + datetime.timedelta(days=rnd.randrange(days))
        g = rnd.choice(catalog)
        kind = IN if rnd.random() < 0.4 else OUT
        packs = rnd.randint(20, 160) if kind == IN else rnd.randint(2, 90)
        price = g.buy if kind == IN else g.sale
        rows.append((day, rnd.choice(ids), g.art, kind, packs, price))
    rows.sort(key=lambda r: r[0])
    return [Move(i + 1, *r) for i, r in enumerate(rows)]


def shop_book(
    name: str, seed: int, start: datetime.date, days: int, n: int, active: list[int]
) -> ShopBook:
    return ShopBook(name, make_moves(seed, start, days, n, active))


# --- the theatre database (subtopic 7) --------------------------------------------------------

SALES = "Продажа билетов"
PLAYS = "Спектакли"
PRICES = "Цены"
SALE_HEAD = [
    "ID операции",
    "Дата продажи",
    "Код спектакля",
    "ID тарифа",
    "Взрослых без льгот",
    "Взрослых льготных",
    "Детских",
]
PLAY_HEAD = ["Код спектакля", "Название", "Автор", "Режиссёр", "Жанр"]
PRICE_HEAD = ["ID тарифа", "Название тарифа", "Взрослый, руб.", "Льготный, руб.", "Детский, руб."]
PLAY_LIST = [
    (101, "Белая гвардия", "М. А. Булгаков", "Зимина В. В.", "драма"),
    (102, "Бег", "М. А. Булгаков", "Орлов Д. С.", "драма"),
    (103, "Зойкина квартира", "М. А. Булгаков", "Мухина В. Д.", "комедия"),
    (104, "Вишнёвый сад", "А. П. Чехов", "Орлов Д. С.", "комедия"),
    (105, "Чайка", "А. П. Чехов", "Зимина В. В.", "драма"),
    (106, "Ревизор", "Н. В. Гоголь", "Мухина В. Д.", "комедия"),
    (107, "Женитьба", "Н. В. Гоголь", "Орлов Д. С.", "комедия"),
    (108, "Гроза", "А. Н. Островский", "Зимина В. В.", "драма"),
    (109, "Снегурочка", "А. Н. Островский", "Мухина В. Д.", "сказка"),
    (110, "Двенадцать месяцев", "С. Я. Маршак", "Зимина В. В.", "сказка"),
]
TARIFF_LIST = [
    ("T1", "Утренний летний", 600, 400, 300),
    ("T2", "Дневной летний", 800, 550, 400),
    ("T3", "Вечерний летний", 1200, 800, 600),
    ("T4", "Утренний зимний", 700, 450, 350),
    ("T5", "Дневной зимний", 900, 600, 450),
    ("T6", "Вечерний зимний", 1400, 900, 700),
]


@dataclass(frozen=True)
class Sale:
    id: int
    date: datetime.date
    play: int
    tariff: str
    adult: int
    reduced: int
    child: int


@dataclass
class TheatreBook:
    name: str
    sales: list[Sale]

    @property
    def plays(self) -> dict[int, tuple]:
        return {p[0]: p for p in PLAY_LIST}

    @property
    def tariffs(self) -> dict[str, tuple]:
        return {t[0]: t for t in TARIFF_LIST}

    def sheets(self) -> list[tuple[str, list[str], list[list]]]:
        rows = [[s.id, s.date, s.play, s.tariff, s.adult, s.reduced, s.child] for s in self.sales]
        return [
            (SALES, SALE_HEAD, rows),
            (PLAYS, PLAY_HEAD, [list(p) for p in PLAY_LIST]),
            (PRICES, PRICE_HEAD, [list(t) for t in TARIFF_LIST]),
        ]


def theatre_book(name: str, seed: int, n: int) -> TheatreBook:
    rnd = random.Random(seed)
    rows = []
    for _ in range(n):
        day = D(2026, 1, 10) + datetime.timedelta(days=rnd.randrange(300))
        rows.append(
            (
                day,
                rnd.choice(PLAY_LIST)[0],
                rnd.choice(TARIFF_LIST)[0],
                rnd.randint(0, 12),
                rnd.randint(0, 6),
                rnd.randint(0, 9),
            )
        )
    rows.sort(key=lambda r: r[0])
    return TheatreBook(name, [Sale(i + 1, *r) for i, r in enumerate(rows)])


# --- the books -----------------------------------------------------------------------------

BOOKS: dict[str, Callable[[], ShopBook | TheatreBook]] = {
    "3-1": lambda: shop_book(
        "3-1", 301, D(2026, 6, 1), 15, 160, [11, 16, 31, 33, 37, 51, 57, 59, 71, 81]
    ),
    "3-2": lambda: shop_book(
        "3-2", 308, D(2026, 6, 1), 20, 220, [11, 12, 15, 16, 33, 39, 51, 52, 53, 54]
    ),
    "3-3": lambda: shop_book(
        "3-3", 303, D(2026, 8, 1), 31, 240, [11, 13, 14, 16, 17, 31, 51, 52, 53, 57]
    ),
    "3-4": lambda: shop_book("3-4", 316, D(2026, 6, 1), 15, 200, [31, 32, 33, 34, 35, 36, 39, 40]),
    "3-5": lambda: shop_book(
        "3-5", 305, D(2026, 6, 1), 30, 250, [11, 12, 16, 18, 31, 33, 37, 51, 57, 60]
    ),
    "3-6": lambda: theatre_book("3-6", 306, 180),
    "3-7": lambda: shop_book(
        "3-7", 307, D(2026, 9, 1), 30, 400, [11, 15, 16, 17, 33, 35, 39, 57, 58, 59, 72, 81]
    ),
    "3-8": lambda: shop_book(
        "3-8", 308, D(2026, 10, 1), 31, 380, [11, 12, 13, 14, 15, 17, 18, 20, 31, 51, 73, 82]
    ),
}

_cache: dict[str, ShopBook | TheatreBook] = {}


def book(name: str) -> ShopBook | TheatreBook:
    if name not in _cache:
        _cache[name] = BOOKS[name]()
    return _cache[name]


def sbook(name: str) -> ShopBook:
    b = book(name)
    assert isinstance(b, ShopBook)
    return b


def tbook(name: str) -> TheatreBook:
    b = book(name)
    assert isinstance(b, TheatreBook)
    return b


# --- the answers, record by record --------------------------------------------------------------


def contains(text: str, part: str) -> bool:
    return part.lower() in text.lower()


def pick(
    name: str,
    *,
    kind: str | None = None,
    district: str | None = None,
    street: str | None = None,
    shop: str | None = None,
    dept: str | None = None,
    goods_part: str | None = None,
    art: int | None = None,
    supplier: str | None = None,
    first: datetime.date | None = None,
    last: datetime.date | None = None,
) -> list[Move]:
    """Operations of a shop book that meet every given condition."""
    b = sbook(name)
    out = []
    for m in b.moves:
        s, g = b.shops[m.shop], b.goods[m.art]
        if kind and m.kind != kind:
            continue
        if district and s.district != district:
            continue
        if street and not contains(s.address, street):
            continue
        if shop and m.shop != shop:
            continue
        if dept and g.dept != dept:
            continue
        if goods_part and not contains(g.name, goods_part):
            continue
        if art is not None and m.art != art:
            continue
        if supplier and g.supplier != supplier:
            continue
        if first and m.date < first:
            continue
        if last and m.date > last:
            continue
        out.append(m)
    return out


def mass(name: str, moves: list[Move]) -> float:
    g = sbook(name).goods
    return round(sum(m.packs * g[m.art].qty for m in moves), 6)


def cost(moves: list[Move]) -> int:
    return sum(m.packs * m.price for m in moves)


def signed(moves: list[Move]) -> int:
    return sum(m.packs if m.kind == IN else -m.packs for m in moves)


def num(x: float) -> str:
    """A number as the answer is written: integer or decimal comma."""
    if abs(x - round(x)) < 1e-9:
        return str(round(x))
    return f"{x:.6f}".rstrip("0").replace(".", ",")


def by_shop(moves: list[Move], value: Callable[[Move], float]) -> dict[str, float]:
    out: dict[str, float] = {}
    for m in moves:
        out[m.shop] = out.get(m.shop, 0) + value(m)
    return out


def task_1_7() -> tuple[int, int]:
    """3-1: operations of M7; shops of Октябрьский district."""
    b = sbook("3-1")
    return sum(m.shop == "M7" for m in b.moves), sum(
        s.district == "Октябрьский" for s in b.shops.values()
    )


def task_1_8() -> tuple[list[str], int]:
    """3-1: IDs of the shops of Заречный district and the number of their operations."""
    b = sbook("3-1")
    ids = [s.id for s in b.shops.values() if s.district == "Заречный"]
    return ids, sum(m.shop in ids for m in b.moves)


def task_2_7() -> str:
    """3-1: district of the shop of operation 75 and supplier of its good."""
    b = sbook("3-1")
    m = b.moves[74]
    return f"{b.shops[m.shop].district} {b.goods[m.art].supplier}"


def task_2_8() -> int:
    """3-1: operations with goods of Фабрика «Заря» (any type, any date)."""
    return len(pick("3-1", supplier=FZ))


def task_3_8() -> int:
    """3-2: sales of all kinds of «Зефир» on ул. Металлургов, 10–20 June."""
    return len(
        pick(
            "3-2",
            kind=OUT,
            goods_part="зефир",
            street="Металлургов",
            first=D(2026, 6, 10),
            last=D(2026, 6, 20),
        )
    )


def task_3_9() -> int:
    """3-2: arrivals of department «Молоко» in Центральный district, 1–15 June."""
    return len(
        pick(
            "3-2",
            kind=IN,
            dept="Молоко",
            district="Центральный",
            first=D(2026, 6, 1),
            last=D(2026, 6, 15),
        )
    )


def task_4_8() -> float:
    """3-3: kg of all kinds of «Зефир» received by the shops of пр. Революции, 5–19 August."""
    moves = pick(
        "3-3",
        kind=IN,
        goods_part="зефир",
        street="Революции",
        first=D(2026, 8, 5),
        last=D(2026, 8, 19),
    )
    return mass("3-3", moves)


def task_4_9() -> int:
    """3-3: cost of received packages of all kinds of ultrapasteurised milk, Первомайский."""
    return cost(
        pick(
            "3-3",
            kind=IN,
            goods_part="ультрапастеризованное",
            district="Первомайский",
            first=D(2026, 8, 3),
            last=D(2026, 8, 24),
        )
    )


def task_5_8() -> int:
    """3-4: change of the stock of «Сахар песок» in Октябрьский district, 1–12 June."""
    return signed(
        pick(
            "3-4",
            art=33,
            district="Октябрьский",
            first=D(2026, 6, 1),
            last=D(2026, 6, 12),
        )
    )


def task_5_9() -> int:
    """3-4: change of the stock of all kinds of «Мука», Заречный, 3–9 June (may be < 0)."""
    return signed(
        pick(
            "3-4",
            goods_part="мука",
            district="Заречный",
            first=D(2026, 6, 3),
            last=D(2026, 6, 9),
        )
    )


def task_6_8() -> str:
    """3-5: shop of Центральный with the largest revenue of «Молоко», 10–20 June; its ID."""
    moves = pick(
        "3-5",
        kind=OUT,
        dept="Молоко",
        district="Центральный",
        first=D(2026, 6, 10),
        last=D(2026, 6, 20),
    )
    totals = by_shop(moves, lambda m: m.packs * m.price)
    best = max(totals.values())
    winners = [s for s, v in totals.items() if v == best]
    assert len(winners) == 1
    return winners[0]


def task_6_9() -> int:
    """3-5: day of June with the largest revenue of «Бакалея» in Первомайский district."""
    moves = pick("3-5", kind=OUT, dept="Бакалея", district="Первомайский")
    totals: dict[int, int] = {}
    for m in moves:
        totals[m.date.day] = totals.get(m.date.day, 0) + m.packs * m.price
    best = max(totals.values())
    days = [d for d, v in totals.items() if v == best]
    assert len(days) == 1
    return days[0]


def task_6_10() -> int:
    """3-5: shops whose June revenue of «Кондитерские изделия» exceeds 20 000 rubles."""
    moves = pick("3-5", kind=OUT, dept="Кондитерские изделия")
    totals = by_shop(moves, lambda m: m.packs * m.price)
    return sum(v > 20000 for v in totals.values())


def theatre_revenue(
    name: str,
    column: str,
    *,
    author: str | None = None,
    genre: str | None = None,
    director: str | None = None,
    tariffs: tuple[str, ...] = (),
    first: datetime.date | None = None,
    last: datetime.date | None = None,
) -> int:
    b = tbook(name)
    col = {"adult": (4, 2), "reduced": (5, 3), "child": (6, 4)}[column]
    total = 0
    for s in b.sales:
        play, tariff = b.plays[s.play], b.tariffs[s.tariff]
        if author and play[2] != author:
            continue
        if genre and play[4] != genre:
            continue
        if director and play[3] != director:
            continue
        if tariffs and tariff[1] not in tariffs:
            continue
        if first and s.date < first:
            continue
        if last and s.date > last:
            continue
        count = [s.id, s.date, s.play, s.tariff, s.adult, s.reduced, s.child][col[0]]
        total += count * tariff[col[1]]
    return total


def task_7_7() -> int:
    """3-6: children's tickets of Bulgakov's dramas at the morning or evening summer tariff."""
    return theatre_revenue(
        "3-6",
        "child",
        author="М. А. Булгаков",
        genre="драма",
        tariffs=("Утренний летний", "Вечерний летний"),
    )


def task_7_8() -> int:
    """3-6: adult tickets without discount, comedies of Мухина В. Д., 1 March – 31 May."""
    return theatre_revenue(
        "3-6",
        "adult",
        director="Мухина В. Д.",
        genre="комедия",
        first=D(2026, 3, 1),
        last=D(2026, 5, 31),
    )


def task_8_1() -> float:
    """3-7: kg of all kinds of «Пряники» sold by the shops of ул. Луговая, 8–21 September."""
    moves = pick(
        "3-7",
        kind=OUT,
        goods_part="пряники",
        street="Луговая",
        first=D(2026, 9, 8),
        last=D(2026, 9, 21),
    )
    return mass("3-7", moves)


def task_8_2() -> int:
    """3-7: change of the stock of «Крупа гречневая» in Первомайский, 1–15 September."""
    return signed(
        pick("3-7", art=39, district="Первомайский", first=D(2026, 9, 1), last=D(2026, 9, 15))
    )


def task_8_3() -> int:
    """3-7: revenue of all kinds of «Сметана» in Заречный, 10–25 September."""
    return cost(
        pick(
            "3-7",
            kind=OUT,
            goods_part="сметана",
            district="Заречный",
            first=D(2026, 9, 10),
            last=D(2026, 9, 25),
        )
    )


def task_8_4() -> int:
    """3-8: district where Молокозавод № 2 delivered goods for the largest sum, 5–18 October."""
    moves = pick("3-8", kind=IN, supplier=M2, first=D(2026, 10, 5), last=D(2026, 10, 18))
    b = sbook("3-8")
    totals: dict[str, int] = {}
    for m in moves:
        d = b.shops[m.shop].district
        totals[d] = totals.get(d, 0) + m.packs * m.price
    return max(totals.values())


def task_8_5() -> float:
    """3-8: litres of all kinds of «Молоко» received by shops of пр. Мира, 1–20 October."""
    moves = pick(
        "3-8",
        kind=IN,
        goods_part="молоко",
        street="пр. Мира",
        first=D(2026, 10, 1),
        last=D(2026, 10, 20),
    )
    return mass("3-8", moves)


TASKS: dict[str, tuple[str, Callable[[], object]]] = {
    "1.7": ("3-1", task_1_7),
    "1.8": ("3-1", task_1_8),
    "2.7": ("3-1", task_2_7),
    "2.8": ("3-1", task_2_8),
    "3.8": ("3-2", task_3_8),
    "3.9": ("3-2", task_3_9),
    "4.8": ("3-3", task_4_8),
    "4.9": ("3-3", task_4_9),
    "5.8": ("3-4", task_5_8),
    "5.9": ("3-4", task_5_9),
    "6.8": ("3-5", task_6_8),
    "6.9": ("3-5", task_6_9),
    "6.10": ("3-5", task_6_10),
    "7.7": ("3-6", task_7_7),
    "7.8": ("3-6", task_7_8),
    "8.1": ("3-7", task_8_1),
    "8.2": ("3-7", task_8_2),
    "8.3": ("3-7", task_8_3),
    "8.4": ("3-8", task_8_4),
    "8.5": ("3-8", task_8_5),
}


def assert_shape() -> list[str]:
    """Each book has the property its tasks rely on (the trap of the task is really there)."""
    bad = []
    for name in ("3-1", "3-2", "3-3", "3-4", "3-5", "3-7", "3-8"):
        b = sbook(name)
        n = len(b.moves)
        if not (150 <= n <= 400):
            bad.append(f"{name}: {n} operations")
        unknown = [m.id for m in b.moves if m.shop not in b.shops or m.art not in b.goods]
        if unknown:
            bad.append(f"{name}: keys without a reference row {unknown[:5]}")
    # «улица Мира» must not be found by «Мира» alone: ул. Мирная exists (the trap of 8.5)
    if not pick("3-8", kind=IN, goods_part="молоко", street="Мир", first=D(2026, 10, 1)):
        bad.append("3-8: no arrivals of milk on any «Мир…» street")
    wide = pick("3-8", kind=IN, goods_part="молоко", street="Мир", first=D(2026, 10, 1))
    narrow = pick("3-8", kind=IN, goods_part="молоко", street="пр. Мира", first=D(2026, 10, 1))
    if len(wide) == len(narrow):
        bad.append("3-8: «*Мир*» and «*пр. Мира*» pick the same operations")
    # the stock of flour really falls (a negative answer, task 5.9)
    if task_5_9() >= 0:
        bad.append("3-4: the stock of flour does not fall")
    # the street of 3.8 has shops in two districts
    if len({s.district for s in shops() if "Металлургов" in s.address}) < 2:
        bad.append("ул. Металлургов is in one district")
    # the mass of 4.8 is not an integer: the answer form matters
    if abs(task_4_8() - round(task_4_8())) < 1e-9:
        bad.append("3-3: the mass of 4.8 is an integer")
    if not task_6_10() or task_6_10() == 16:
        bad.append("3-5: the threshold of 6.10 does not split the shops")
    return bad


# --- workbooks ---------------------------------------------------------------------------------

STAMP = "2026-10-12T00:00:00Z"  # fixed save time: the same data gives the same bytes


def write_book(name: str) -> None:
    from openpyxl import Workbook
    from openpyxl.styles import Font

    wb = Workbook()
    first = wb.active
    assert first is not None
    wb.remove(first)
    for title, head, rows in book(name).sheets():
        ws = wb.create_sheet(title)
        ws.append(head)
        for cell in ws[1]:
            cell.font = Font(bold=True)
        for row in rows:
            ws.append(row)
        for r in range(2, len(rows) + 2):
            for c in range(1, len(head) + 1):
                if isinstance(ws.cell(r, c).value, datetime.date):
                    ws.cell(r, c).number_format = "DD.MM.YYYY"
        for c, title_ in enumerate(head, start=1):
            letter = ws.cell(1, c).column_letter
            ws.column_dimensions[letter].width = max(10, min(36, len(title_) + 2))
    path = FILES / f"{name}.xlsx"
    wb.save(path)
    reproducible(path)


def reproducible(path: Path) -> None:
    """Drop the save time openpyxl stamps into the file (as course-excel/workbook.py)."""
    import zipfile

    with zipfile.ZipFile(path) as src:
        entries = [(info, src.read(info)) for info in src.infolist()]
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as out:
        for info, data in entries:
            if info.filename == "docProps/core.xml":
                data = re.sub(
                    rb"(<dcterms:(?:created|modified)[^>]*>)[^<]*",
                    lambda m: m.group(1) + STAMP.encode(),
                    data,
                )
            fixed_info = zipfile.ZipInfo(info.filename, date_time=(1980, 1, 1, 0, 0, 0))
            fixed_info.compress_type = zipfile.ZIP_DEFLATED
            fixed_info.external_attr = info.external_attr
            out.writestr(fixed_info, data)


def read_book(name: str) -> list[tuple[str, list[str], list[list]]]:
    from openpyxl import load_workbook

    wb = load_workbook(FILES / f"{name}.xlsx")
    out = []
    for ws in wb.worksheets:
        rows = [list(r) for r in ws.iter_rows(values_only=True)]
        head, body = [str(x) for x in rows[0]], rows[1:]
        body = [[v.date() if isinstance(v, datetime.datetime) else v for v in row] for row in body]
        out.append((ws.title, head, body))
    return out


def same_sheets(a, b) -> bool:
    def norm(v):
        return float(v) if isinstance(v, (int, float)) and not isinstance(v, bool) else v

    return [(t, h, [[norm(v) for v in r] for r in rows]) for t, h, rows in a] == [
        (t, h, [[norm(v) for v in r] for r in rows]) for t, h, rows in b
    ]


def main() -> None:
    if "--write" in sys.argv:
        FILES.mkdir(exist_ok=True)
        for name in BOOKS:
            write_book(name)
        print(f"written: {len(BOOKS)} books in {FILES}")
    if "--check" in sys.argv:
        bad = [name for name in BOOKS if not same_sheets(book(name).sheets(), read_book(name))]
        print("books agree with the data" if not bad else f"differ: {bad}")
        if bad:
            raise SystemExit(1)
    problems = assert_shape()
    for p in problems:
        print("SHAPE", p)
    for label, (name, solve) in TASKS.items():
        result = solve()
        shown = num(result) if isinstance(result, float) else result
        print(f"{label:5} {name:4} {shown}")
    if problems:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
