"""Topic 3 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-3/bank.py          # check only
    python3 -I content/lesson-design/topic-3/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. The topic is
solved in a spreadsheet and its lesson has no Python, so a task gives its
``answer``: for a book task from the stand's own solver (``datasets.py``, a
filter over the operations of the book), for a task on the small book of the
lessons from its 12 operations below; a book task shows the spreadsheet
formulas of the solution. ``apps/api/tests/test_task_3_bank.py`` recomputes
every answer independently.
"""

import datetime
import importlib.util
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, main  # noqa: E402

_spec = importlib.util.spec_from_file_location("datasets3", HERE / "datasets.py")
assert _spec and _spec.loader
ds = importlib.util.module_from_spec(_spec)
sys.modules["datasets3"] = ds
_spec.loader.exec_module(ds)

DAY = datetime.date
INT = "Введите целое число."

# The small book of the lessons: shops, goods and 12 operations.
SHOPS = {"M1": "Северный", "M2": "Южный", "M3": "Северный"}
PACK = {101: 0.5, 102: 1.0, 103: 1.0}
SUPPLIER = {101: "А", 102: "А", 103: "Б"}
OPS = [  # id, date, shop, article, sale?, packs, price of a package
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
JUNE_1, JUNE_10 = DAY(2026, 6, 1), DAY(2026, 6, 10)


def rows(
    sale: bool | None = True,
    district=None,
    supplier=None,
    art=None,
    shop=None,
    period=True,
):
    return [
        o
        for o in OPS
        if (sale is None or o[4] == sale)
        and (district is None or SHOPS[o[2]] == district)
        and (supplier is None or SUPPLIER[o[3]] == supplier)
        and (art is None or o[3] == art)
        and (shop is None or o[2] == shop)
        and (not period or JUNE_1 <= o[1] <= JUNE_10)
    ]


def kg(selected) -> float:
    return sum(o[5] * PACK[o[3]] for o in selected)


def money(selected) -> int:
    return sum(o[5] * o[6] for o in selected)


def stock(selected) -> int:
    return sum(-o[5] if o[4] else o[5] for o in selected)


def per_shop(selected, value) -> dict[str, float]:
    out: dict[str, float] = {}
    for o in selected:
        out[o[2]] = out.get(o[2], 0) + value([o])
    return out


def xlsx(name: str) -> tuple[str, str]:
    return (f"{name}.xlsx", "База данных — Excel-файл, как на экзамене")


FACTORY_A = rows(supplier="А")  # the selection of 4.1 and subtopic 6: all districts
MAIN = rows(supplier="А", district="Северный")  # the main question of the lessons

LOOKUP = """Рядом с операциями — характеристики через ВПР:
H2: =ВПР(C2;'Магазин'!$A:$C;2;0)  — район
I2: =ВПР(C2;'Магазин'!$A:$C;3;0)  — адрес
J2: =ВПР(D2;'Товар'!$A:$F;3;0)    — наименование
K2: =ВПР(D2;'Товар'!$A:$F;5;0)    — в упаковке"""
# (page, number in the page) -> task definition; page 8 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 4),
        section="mnogo-operacij",
        title="Записи, магазины, упаковки",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="Записи — строки, магазины — разные коды, упаковки — сумма количеств.",
        answer="4 2 21",
    ),
    dict(
        at=(1, 7),
        section="kniga-i-listy",
        title="Операции магазина и магазины района",
        difficulty=1,
        minutes=4,
        instruction="Введите два числа через пробел.",
        hint="Операции считают на листе движения, магазины района — в справочнике.",
        files=[xlsx("3-1")],
        answer=" ".join(map(str, ds.task_1_7())),
        excel="""Операции M7: =СЧЁТЕСЛИ(C:C;"M7")
Магазины района: =СЧЁТЕСЛИ('Магазин'!B2:B17;"Октябрьский")""",
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 8),
        section="drugie-stolbcy",
        title="Операции поставщика",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Поставщика дописывают к операции через ВПР по артикулу.",
        files=[xlsx("3-1")],
        answer=str(ds.task_2_8()),
        excel="""H2: =ВПР(D2;'Товар'!$A:$F;6;0)  — поставщик
=СЧЁТЕСЛИ(H:H;"Фабрика «Заря»")""",
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 8),
        section="vse-vidy",
        title="Продажи зефира на улице Металлургов",
        difficulty=2,
        minutes=7,
        instruction=NUMBER,
        hint="«Все виды» — шаблон по части наименования; адрес — тоже шаблоном.",
        files=[xlsx("3-2")],
        answer=str(ds.task_3_8()),
        excel=LOOKUP
        + """
=СЧЁТЕСЛИМН(J:J;"*зефир*";I:I;"*Металлургов*";
  E:E;"Продажа";B:B;">="&ДАТА(2026;6;10);
  B:B;"<="&ДАТА(2026;6;20))""",
    ),
    dict(
        at=(3, 9),
        section="priznak-1-0",
        title="Поступления отдела «Молоко»",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Отдел — второй столбец справочника товаров.",
        files=[xlsx("3-2")],
        answer=str(ds.task_3_9()),
        excel="""H2: =ВПР(C2;'Магазин'!$A:$C;2;0)  — район
L2: =ВПР(D2;'Товар'!$A:$F;2;0)    — отдел
=СЧЁТЕСЛИМН(L:L;"Молоко";H:H;"Центральный";
  E:E;"Поступление";B:B;">="&ДАТА(2026;6;1);
  B:B;"<="&ДАТА(2026;6;15))""",
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 1),
        section="raznye-voprosy",
        title="Упаковки, записи и магазины",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="Три разных вопроса к одним и тем же записям.",
        answer=f"{sum(o[5] for o in FACTORY_A)} {len(FACTORY_A)} {len({o[2] for o in FACTORY_A})}",
    ),
    dict(
        at=(4, 2),
        section="massa",
        title="Масса проданного",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Упаковки строки умножают на массу упаковки этой строки.",
        answer=ds.num(kg(FACTORY_A)),
    ),
    dict(
        at=(4, 3),
        section="stoimost",
        title="Выручка",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Упаковки строки умножают на цену упаковки этой строки.",
        answer=str(money(FACTORY_A)),
    ),
    dict(
        at=(4, 4),
        section="postupleniya-i-prodazhi",
        title="Стоимость поступлений",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Нужны поступления, а не продажи, и весь период.",
        answer=str(money(rows(sale=False, art=101, period=False))),
    ),
    dict(
        at=(4, 6),
        section="edinicy",
        title="Цена за килограмм",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Цена за килограмм умножается на массу.",
        answer=ds.num(12 * 0.25 * 120),
    ),
    dict(
        at=(4, 8),
        section="summeslimn",
        title="Масса зефира на проспекте Революции",
        difficulty=3,
        minutes=8,
        instruction=INT,
        hint="Масса строки — упаковки × количество в упаковке; в ответе только целая часть.",
        files=[xlsx("3-3")],
        answer=str(int(ds.task_4_8())),
        excel=LOOKUP
        + """
L2: =F2*K2  — масса строки
=СУММЕСЛИМН(L:L;J:J;"*зефир*";I:I;
  "*пр. Революции*";E:E;"Поступление";
  B:B;">="&ДАТА(2026;8;5);B:B;"<="&ДАТА(2026;8;19))""",
    ),
    dict(
        at=(4, 9),
        section="stolbec-vklada",
        title="Стоимость ультрапастеризованного молока",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Стоимость строки — упаковки × цена поступления этой строки.",
        files=[xlsx("3-3")],
        answer=str(ds.task_4_9()),
        excel=LOOKUP
        + """
L2: =F2*G2  — стоимость строки
=СУММЕСЛИМН(L:L;J:J;"*ультрапастеризованное*";
  H:H;"Первомайский";E:E;"Поступление";
  B:B;">="&ДАТА(2026;8;3);B:B;"<="&ДАТА(2026;8;24))""",
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="summa-so-znakami",
        title="Изменение запаса товара 101",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Поступления со знаком «+», продажи со знаком «−».",
        answer=str(stock(rows(sale=None, art=101))),
    ),
    dict(
        at=(5, 2),
        section="summa-so-znakami",
        title="Изменение запаса товара 102 в M3",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Все операции магазина с этим товаром за весь период.",
        answer=str(stock(rows(sale=None, art=102, shop="M3", period=False))),
    ),
    dict(
        at=(5, 4),
        section="bolshe-ili-menshe",
        title="На сколько уменьшился запас",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Изменение отрицательно; «на сколько уменьшился» — его модуль.",
        answer=str(-stock(rows(sale=None, art=102, district="Северный"))),
    ),
    dict(
        at=(5, 7),
        section="pribyl",
        title="Прибыль",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Выручка минус стоимость закупки; прибыль может быть отрицательной.",
        answer=str(
            money(rows(art=101, district="Северный"))
            - money(rows(sale=False, art=101, district="Северный"))
        ),
        # the file writes the answer with the minus sign «−»
        says=["−720"],
    ),
    dict(
        at=(5, 8),
        section="stolbec-znaka",
        title="Рост запаса сахара",
        difficulty=2,
        minutes=7,
        instruction=NUMBER,
        hint="Знак операции в отдельном столбце; в формуле суммы нет условия на тип.",
        files=[xlsx("3-4")],
        answer=str(ds.task_5_8()),
        excel=LOOKUP
        + """
L2: =ЕСЛИ(E2="Поступление";F2;-F2)  — упаковки со знаком
=СУММЕСЛИМН(L:L;J:J;"Сахар песок";
  H:H;"Октябрьский";B:B;">="&ДАТА(2026;6;1);
  B:B;"<="&ДАТА(2026;6;12))""",
    ),
    dict(
        at=(5, 9),
        section="stolbec-znaka",
        title="Изменение запаса муки",
        difficulty=2,
        minutes=7,
        instruction=NUMBER,
        hint="Два вида муки — шаблон; уменьшение запаса — отрицательное число.",
        files=[xlsx("3-4")],
        answer=str(ds.task_5_9()),
        says=["−26"],
        excel=LOOKUP
        + """
L2: =ЕСЛИ(E2="Поступление";F2;-F2)
=СУММЕСЛИМН(L:L;J:J;"*мука*";
  H:H;"Заречный";B:B;">="&ДАТА(2026;6;3);
  B:B;"<="&ДАТА(2026;6;9))""",
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 1),
        section="porog-itoga",
        title="Порог итога магазина",
        difficulty=2,
        minutes=3,
        instruction="Введите два числа через пробел: «не менее», затем «более».",
        hint="Порог проверяют после сложения записей магазина.",
        answer=" ".join(
            str(sum(1 for v in per_shop(FACTORY_A, kg).values() if test(v)))
            for test in (lambda v: v >= 6.5, lambda v: v > 6.5)
        ),
    ),
    dict(
        at=(6, 2),
        section="maksimum-chego",
        title="Наименьшая выручка магазина",
        difficulty=2,
        minutes=3,
        instruction="Введите ID магазина и выручку через пробел.",
        hint="Сначала итог каждого магазина, затем наименьший из них.",
        answer=" ".join(map(str, min(per_shop(FACTORY_A, money).items(), key=lambda kv: kv[1]))),
    ),
    dict(
        at=(6, 4),
        section="rajon-ili-den",
        title="День с наибольшей выручкой",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Объект группы — день; итог дня — сумма выручки его продаж.",
        answer=str(
            max(
                range(1, 11),
                key=lambda d: money([o for o in rows() if o[1] == DAY(2026, 6, d)]),
            )
        ),
    ),
    dict(
        at=(6, 5),
        section="porog-itoga",
        title="Записи и итоги не меньше 3 кг",
        difficulty=2,
        minutes=3,
        instruction="Введите два числа через пробел: продажи, затем магазины.",
        hint="Порог одной записи и порог итога магазина — разные вопросы.",
        answer=f"{sum(1 for o in MAIN if kg([o]) >= 3)} "
        f"{sum(1 for v in per_shop(MAIN, kg).values() if v >= 3)}",
    ),
    dict(
        at=(6, 7),
        section="chto-v-otvete",
        title="Магазин с наибольшей выручкой",
        difficulty=3,
        minutes=8,
        instruction="Введите ID магазина так, как он указан в базе.",
        hint="Итоги выручки магазинов района, в ответе — ID магазина.",
        files=[xlsx("3-5")],
        answer=str(ds.task_6_8()),
        excel=LOOKUP.replace("наименование", "наименование")
        + """
L2: =ВПР(D2;'Товар'!$A:$F;2;0)  — отдел
M2: =F2*G2                            — выручка строки
Список M5…M8, для каждого:
=СУММЕСЛИМН(M:M;C:C;N2;L:L;"Молоко";
  E:E;"Продажа";B:B;">="&ДАТА(2026;6;10);
  B:B;"<="&ДАТА(2026;6;20))""",
    ),
    dict(
        at=(6, 8),
        section="rajon-ili-den",
        title="День наибольшей выручки «Бакалеи»",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Список дат 1–30 июня и итог выручки каждой даты.",
        files=[xlsx("3-5")],
        answer=str(ds.task_6_9()),
        excel="""L2: =ВПР(D2;'Товар'!$A:$F;2;0)  — отдел
H2: =ВПР(C2;'Магазин'!$A:$C;2;0)  — район
M2: =F2*G2                            — выручка строки
Даты в столбце N, для каждой:
=СУММЕСЛИМН(M:M;B:B;N2;L:L;"Бакалея";
  H:H;"Первомайский";E:E;"Продажа")""",
    ),
    dict(
        at=(6, 9),
        section="gruppirovka",
        title="Магазины с выручкой больше 20 000",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Итог каждого из 16 магазинов, затем подсчёт итогов больше порога.",
        files=[xlsx("3-5")],
        answer=str(ds.task_6_10()),
        excel="""L2: =ВПР(D2;'Товар'!$A:$F;2;0)  — отдел
M2: =F2*G2                            — выручка строки
Итог магазина из столбца N:
=СУММЕСЛИМН(M:M;C:C;N2;
  L:L;"Кондитерские изделия";E:E;"Продажа")
=СЧЁТЕСЛИ(O2:O17;">20000")""",
    ),
    # ------------------------------------------------------------ subtopic 7
    dict(
        at=(7, 2),
        section="cena-po-tarifu",
        title="Взрослые билеты на «Белую гвардию»",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Цена из справочника тарифов — по ключу тарифа и категории билета.",
        answer=str((5 + 2) * 1200),
    ),
    dict(
        at=(7, 4),
        section="tablica-svyazej",
        title="Таблица связей",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="Строки таблицы связей — пары, а не объекты.",
        answer="3 3 5",
    ),
    dict(
        at=(7, 6),
        section="nalichie-na-datu",
        title="Изменение наличия между датами",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="Движения после первой даты и не позже второй.",
        answer=str(4 - 3 - 6),
        says=["−5"],
    ),
    dict(
        at=(7, 7),
        section="ili-v-pole",
        title="Детские билеты на драмы Булгакова",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Два тарифа — сумма по каждому или признак с ИЛИ.",
        files=[xlsx("3-6")],
        answer=str(ds.task_7_7()),
        excel="""Рядом с продажами (C — код спектакля, D — тариф):
H2: =ВПР(C2;'Спектакли'!$A:$E;3;0)  — автор
I2: =ВПР(C2;'Спектакли'!$A:$E;5;0)  — жанр
J2: =ВПР(D2;'Цены'!$A:$E;2;0)       — тариф
K2: =ВПР(D2;'Цены'!$A:$E;5;0)*G2    — детские × цена
=СУММЕСЛИМН(K:K;H:H;"*Булгаков*";I:I;"драма";
  J:J;"Утренний летний")+ то же для «Вечерний летний»""",
    ),
    dict(
        at=(7, 8),
        section="cena-po-tarifu",
        title="Взрослые билеты на комедии",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Цена взрослого билета без льгот — третий столбец «Цен».",
        files=[xlsx("3-6")],
        answer=str(ds.task_7_8()),
        excel="""H2: =ВПР(C2;'Спектакли'!$A:$E;4;0)  — режиссёр
I2: =ВПР(C2;'Спектакли'!$A:$E;5;0)  — жанр
K2: =ВПР(D2;'Цены'!$A:$E;3;0)*E2    — взрослые × цена
=СУММЕСЛИМН(K:K;H:H;"Мухина*";I:I;"комедия";
  B:B;">="&ДАТА(2026;3;1);B:B;"<="&ДАТА(2026;5;31))""",
    ),
    # ---------------------------------------------------- Практика и итог
    dict(
        at=(8, 1),
        title="Масса пряников на Луговой улице",
        difficulty=3,
        minutes=8,
        instruction=INT,
        hint="Масса строки — упаковки × количество в упаковке; целая часть.",
        files=[xlsx("3-7")],
        answer=str(int(ds.task_8_1())),
        excel=LOOKUP
        + """
L2: =F2*K2
=СУММЕСЛИМН(L:L;J:J;"*пряники*";I:I;"*Луговая*";
  E:E;"Продажа";B:B;">="&ДАТА(2026;9;8);
  B:B;"<="&ДАТА(2026;9;21))""",
    ),
    dict(
        at=(8, 2),
        title="Рост запаса гречневой крупы",
        difficulty=2,
        minutes=7,
        instruction=NUMBER,
        hint="Поступления минус продажи — упаковки со знаком.",
        files=[xlsx("3-7")],
        answer=str(ds.task_8_2()),
        excel=LOOKUP
        + """
L2: =ЕСЛИ(E2="Поступление";F2;-F2)
=СУММЕСЛИМН(L:L;J:J;"Крупа гречневая";
  H:H;"Первомайский";B:B;">="&ДАТА(2026;9;1);
  B:B;"<="&ДАТА(2026;9;15))""",
    ),
    dict(
        at=(8, 3),
        title="Выручка от сметаны",
        difficulty=2,
        minutes=7,
        instruction=NUMBER,
        hint="Выручка строки — упаковки × цена этой строки.",
        files=[xlsx("3-7")],
        answer=str(ds.task_8_3()),
        excel=LOOKUP
        + """
L2: =F2*G2
=СУММЕСЛИМН(L:L;J:J;"*сметана*";H:H;"Заречный";
  E:E;"Продажа";B:B;">="&ДАТА(2026;9;10);
  B:B;"<="&ДАТА(2026;9;25))""",
    ),
    dict(
        at=(8, 4),
        title="Район с наибольшей поставкой",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Итог стоимости поставок по каждому из четырёх районов.",
        files=[xlsx("3-8")],
        answer=str(ds.task_8_4()),
        excel="""H2: =ВПР(C2;'Магазин'!$A:$C;2;0)  — район
L2: =ВПР(D2;'Товар'!$A:$F;6;0)    — поставщик
M2: =F2*G2                            — стоимость строки
Для каждого района из списка N2:N5:
=СУММЕСЛИМН(M:M;H:H;N2;L:L;
  "Молокозавод № 2";E:E;"Поступление";
  B:B;">="&ДАТА(2026;10;5);
  B:B;"<="&ДАТА(2026;10;18))
=МАКС(O2:O5)""",
    ),
    dict(
        at=(8, 5),
        title="Литры молока на проспекте Мира",
        difficulty=3,
        minutes=8,
        instruction=INT,
        hint="Шаблон адреса «пр. Мира*», иначе попадёт ул. Мирная.",
        files=[xlsx("3-8")],
        answer=str(int(ds.task_8_5())),
        excel=LOOKUP
        + """
L2: =F2*K2  — литры строки
=СУММЕСЛИМН(L:L;J:J;"*молоко*";I:I;"пр. Мира*";
  E:E;"Поступление";B:B;">="&ДАТА(2026;10;1);
  B:B;"<="&ДАТА(2026;10;20))""",
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 3, TASKS))
