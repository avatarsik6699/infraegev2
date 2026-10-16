"""Topic 1 bank tasks for the site lesson (Change 190, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-1/bank.py          # check only
    python3 -I content/lesson-design/topic-1/bank.py --write  # update the bank
    python3 -I content/lesson-design/topic-1/bank.py --checkpoints  # and site.checkpoints

The rules are those of ``scripts/lesson_design/topic_bank.py``. The lesson solves
by hand and has no Python, so a task gives its ``answer``: the scheme and the
table are read from the task's own statement (the ``gm_graph`` call, the roads
named in the text, the Markdown table), every map letter → number that keeps all
roads and absences is tried, and the asked value must be the same under every
kept map. ``apps/api/tests/test_task_1_bank.py`` recomputes every answer
independently, by backtracking over the letters.
"""

import ast
import re
import sys
from itertools import combinations, permutations
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, inventory, main  # noqa: E402

PAIR = "Введите номера двух пунктов подряд, без пробела, в порядке возрастания."
TEXTS = inventory(HERE)

Roads = dict[frozenset, int | None]


def question(page: int, number: int) -> str:
    return TEXTS[page][number][0]


def scheme(text: str) -> Roads:
    """Roads of the first ``gm_graph`` call, or of «дороги AB, AC…» in the text."""
    call = re.search(r"%%gm_graph\((.*?)\)%%", text, re.S)
    if call:
        tree = ast.parse(f"f({call.group(1)})", mode="eval").body
        assert isinstance(tree, ast.Call)
        first = ast.literal_eval(tree.args[0])
        pairs = first.split() if isinstance(first, str) else first
        return {frozenset(p[:2]): (int(p[2]) if len(p) > 2 else None) for p in pairs}
    names = re.search(r"дороги ((?:[A-ZА-Я]{2}, )*[A-ZА-Я]{2})", text)
    assert names, text[:80]
    return {frozenset(p): None for p in names.group(1).split(", ")}


def table(text: str) -> Roads:
    """Roads of the first table of points 1, 2, …: «*» a road, a number its length."""
    for chunk in re.split(r"\n\s*\n", text):
        rows = [
            [c.strip().replace("**", "") for c in line.strip().strip("|").split("|")]
            for line in chunk.split("\n")
            if line.strip().startswith("|")
        ]
        if not rows or rows[0][0] != "Пункт" or not rows[0][1].isdigit():
            continue
        out: Roads = {}
        for row in rows[2:]:
            for name, cell in zip(rows[0][1:], row[1:], strict=True):
                if cell not in ("—", "-", "") and row[0] != name:
                    out[frozenset((row[0], name))] = None if cell == "*" else int(cell)
        return out
    raise SystemExit(f"no table of points: {text[:80]!r}")


def nodes(roads: Roads) -> list[str]:
    return sorted({x for e in roads for x in e})


def maps(g: Roads, t: Roads):
    """Every map letter → number that keeps all roads and absences."""
    letters, numbers = nodes(g), nodes(t)
    for p in permutations(numbers):
        m = dict(zip(letters, p, strict=True))
        if all(
            (frozenset((x, y)) in g) == (frozenset((m[x], m[y])) in t)
            for x, y in combinations(letters, 2)
        ):
            yield m


def one(values) -> str:
    found = {str(v) for v in values}
    assert len(found) == 1, found
    return found.pop()


def asked(page: int, number: int, fn) -> str:
    """The value ``fn(map, table)`` asked by a task: one under every map."""
    text = question(page, number)
    g, t = scheme(text), table(text)
    return one(fn(m, t) for m in maps(g, t))


def road(a: str, b: str):
    return lambda m, t: t[frozenset((m[a], m[b]))]


def pair(*letters: str):
    return lambda m, t: "".join(sorted(m[x] for x in letters))


def num(a: str):
    return lambda m, t: m[a]


def route(path: str):
    return lambda m, t: sum(
        t[frozenset((m[a], m[b]))] for a, b in zip(path, path[1:], strict=False)
    )


def both(*pairs: str):
    return lambda m, t: sum(t[frozenset((m[p[0]], m[p[1]]))] for p in pairs)


def row(a: str):
    return lambda m, t: sum(w for e, w in t.items() if m[a] in e)


def example():
    """The full example of subtopic 2, used again in subtopics 5 and 6."""
    page = (HERE / "02-sosedi-i-opory.md").read_text()
    step = next(s for s in page.split("\n---\n") if s.strip().startswith("**Полный пример"))
    g, t = scheme(step), table(step)
    (m,) = maps(g, t)
    return g, t, m


EX_G, EX_T, EX_M = example()


def ex_road(a: str, b: str) -> int:
    w = EX_T[frozenset((EX_M[a], EX_M[b]))]
    assert w is not None
    return w


def distance(g: Roads, a: str, b: str) -> int:
    """Fewest roads from a to b, level by level."""
    level, seen, k = {a}, {a}, 0
    while b not in level:
        level = {y for x in level for e in g for y in e if x in e and y not in seen}
        seen |= level
        k += 1
    return k


def missing(page: int, number: int) -> str:
    """The length of the one road the scheme leaves out."""
    text = question(page, number)
    g, t = scheme(text), table(text)
    found = set()
    for extra in combinations(nodes(g), 2):
        if frozenset(extra) in g:
            continue
        full = {**g, frozenset(extra): None}
        found |= {t[frozenset(m[x] for x in extra)] for m in maps(full, t)}
    return one(found)


def triangles(spec: str) -> int:
    roads = {frozenset(r.split("—")) for r in spec.split(", ")}
    names = nodes(dict.fromkeys(roads))
    return sum(
        1
        for x, y, z in combinations(names, 3)
        if {frozenset((x, y)), frozenset((y, z)), frozenset((x, z))} <= roads
    )


def degree_a_road_2_4() -> str:
    """Task 2.4: the neighbour of 5 of degree 2 not joined with 2."""
    neighbours_of_5 = {"1": {"5", "2"}, "3": {"5", "4"}, "6": {"5", "2"}}
    return one(k for k, v in neighbours_of_5.items() if "2" not in v)


def longer_ac() -> str:
    """Task 6.1: A—C is longer than B—C; {A, B} ↔ {3, 5}, C ↔ 1."""
    lengths = {"3": 14, "5": 9}
    return one(a for a, b in (("3", "5"), ("5", "3")) if lengths[a] > lengths[b])


def compared(page: int, number: int) -> str:
    """Task 6.7: Б—Г shorter than В—Г picks the map, then А—Б is read."""
    text = question(page, number)
    g, t = scheme(text), table(text)
    return one(
        road("А", "Б")(m, t) for m in maps(g, t) if road("Б", "Г")(m, t) < road("В", "Г")(m, t)
    )


# (page, number) -> task definition; page 7 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 2),
        section="proverka-chisla-dorog",
        title="Число дорог по степеням",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Каждая дорога добавляет единицу к степеням двух пунктов.",
        answer=sum([3, 1, 2, 2, 4, 2]) // 2,
    ),
    dict(
        at=(1, 3),
        section="stepen-punkta",
        title="Степень по строке таблицы",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Важно, сколько клеток заполнено, а не какие в них числа.",
        answer=len([15, 8, 23]),
    ),
    dict(
        at=(1, 7),
        section="stepen-punkta",
        title="Длина дороги А—Д",
        difficulty=1,
        minutes=3,
        instruction=NUMBER,
        hint="Найдите пункты с единственной степенью.",
        answer=asked(1, 7, road("А", "Д")),
    ),
    dict(
        at=(1, 8),
        section="stepen-punkta",
        title="Номера пунктов Б и В",
        difficulty=1,
        minutes=3,
        instruction=PAIR,
        hint="Посчитайте степени на схеме и в таблице.",
        answer=asked(1, 8, pair("Б", "В")),
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 4),
        section="opornyj-punkt",
        title="Номер A по найденным пунктам",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Номер A — сосед пункта 5, но не сосед пункта 2.",
        answer=degree_a_road_2_4(),
    ),
    dict(
        at=(2, 5),
        section="polnyj-primer",
        title="Полное соответствие",
        difficulty=2,
        minutes=4,
        instruction="Введите номера пунктов A, B, C, D, E, F через пробел.",
        hint="Начните с пунктов степени 1 и их соседей.",
        answer=asked(2, 5, lambda m, t: " ".join(m[x] for x in "ABCDEF")),
    ),
    dict(
        at=(2, 6),
        section="profil-sosedej",
        title="Длина дороги Б—В",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Степени совпадают — сравните профили соседей.",
        answer=asked(2, 6, road("Б", "В")),
    ),
    dict(
        at=(2, 7),
        section="opornyj-punkt",
        title="Номер пункта Г",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Найдите пункт, у которого есть сосед степени 1.",
        answer=asked(2, 7, num("Г")),
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 2),
        section="treugolnik-i-svyazi",
        title="Тройка пунктов одной степени",
        difficulty=2,
        minutes=4,
        instruction="Введите номера трёх пунктов подряд, без пробелов, в порядке возрастания.",
        hint="Степени одинаковы — ищите треугольник.",
        answer=asked(3, 2, pair("A", "B", "C")),
    ),
    dict(
        at=(3, 3),
        section="treugolnik-i-svyazi",
        title="Число треугольников",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Треугольник — три пункта, попарно соединённые дорогами.",
        answer=triangles("1—2, 1—3, 2—3, 2—4, 3—4, 4—5"),
        says=["Два треугольника"],
    ),
    dict(
        at=(3, 4),
        section="obshchie-sosedi",
        title="Общие соседи",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Пересечение двух списков соседей.",
        answer=len(set("CDEF") & set("DFG")),
        says=["Два общих соседа"],
    ),
    dict(
        at=(3, 7),
        section="treugolnik-i-svyazi",
        title="Номер пункта Ж",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Профили совпали — проверьте, кто входит в треугольник.",
        answer=asked(3, 7, num("Ж")),
    ),
    dict(
        at=(3, 8),
        section="treugolnik-i-svyazi",
        title="Длина дороги А—Д: треугольник",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="У А и Б одинаковы степень и профиль, но только один входит в треугольник.",
        answer=asked(3, 8, road("А", "Д")),
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 5),
        section="odnoznachnyj-otvet",
        title="Номера симметричных Б и В",
        difficulty=2,
        minutes=4,
        instruction=PAIR,
        hint="Номер каждого из них не определён, а набор номеров — да.",
        answer=asked(4, 5, pair("Б", "В")),
    ),
    dict(
        at=(4, 6),
        section="odnoznachnyj-otvet",
        title="Дорога между симметричными пунктами",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Дорога Б—В одна и та же в обоих вариантах.",
        answer=asked(4, 6, road("Б", "В")),
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="bukvy-v-nomera",
        title="Дорога, строка и маршрут",
        difficulty=2,
        minutes=5,
        instruction=THREE,
        hint="Сначала полное соответствие, потом длины.",
        answer=" ".join(asked(5, 1, fn) for fn in (road("B", "D"), row("A"), route("EABF"))),
    ),
    dict(
        at=(5, 2),
        section="bukvy-v-nomera",
        title="Сумма дорог из D",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="D ↔ 6: сложите числа строки 6.",
        answer=sum(ex_road("D", x) for x in "BCF"),
    ),
    dict(
        at=(5, 3),
        section="bukvy-v-nomera",
        title="Длина маршрута A → C → D → F",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Переведите каждый участок в пару номеров.",
        answer=sum(ex_road(a, b) for a, b in ("AC", "CD", "DF")),
    ),
    dict(
        at=(5, 4),
        section="format-otveta",
        title="Два порядка записи",
        difficulty=1,
        minutes=2,
        instruction="Введите две записи через пробел: по возрастанию, затем в порядке «D, E».",
        hint="Порядок записи задаёт вопрос.",
        answer="".join(sorted(EX_M["E"] + EX_M["D"])) + " " + EX_M["D"] + EX_M["E"],
    ),
    dict(
        at=(5, 6),
        section="dejstvie-po-voprosu",
        title="Сумма двух дорог",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Каждая дорога одинакова во всех допустимых вариантах.",
        answer=asked(5, 6, both("АБ", "ВЕ")),
    ),
    dict(
        at=(5, 7),
        section="dejstvie-po-voprosu",
        title="Длина маршрута Е — Г — Д — Б",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Сложите длины трёх участков.",
        answer=asked(5, 7, route("ЕГДБ")),
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 1),
        section="sravnenie-dlin",
        title="Номер A по сравнению длин",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="Проверьте сравнение для каждого варианта.",
        answer=longer_ac(),
    ),
    dict(
        at=(6, 5),
        section="dalnee-okruzhenie-i-mosty",
        title="Расстояние в дорогах",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Считайте дороги, а не километры.",
        answer=distance(EX_G, "E", "F"),
    ),
    dict(
        at=(6, 7),
        section="sravnenie-dlin",
        title="Длина дороги А—Б при сравнении",
        difficulty=3,
        minutes=5,
        instruction=NUMBER,
        hint="Сравнение длин различает симметричные Б и В.",
        answer=compared(6, 7),
    ),
    dict(
        at=(6, 8),
        section="propushchennaya-doroga",
        title="Длина пропущенной дороги",
        difficulty=3,
        minutes=5,
        instruction=NUMBER,
        hint="Сравните суммы степеней на схеме и в таблице.",
        answer=missing(6, 8),
    ),
    # ---------------------------------------------------- «Практика и итог»
    dict(
        at=(7, 1),
        title="Длина дороги А—В",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Подтемы 1 и 2: степени и опора на найденный пункт.",
        answer=asked(7, 1, road("А", "В")),
    ),
    dict(
        at=(7, 2),
        title="Номер пункта Д",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Подтема 3: треугольник.",
        answer=asked(7, 2, num("Д")),
    ),
    dict(
        at=(7, 3),
        title="Номера пунктов Д и Е",
        difficulty=2,
        minutes=4,
        instruction=PAIR,
        hint="Подтема 4: симметрия.",
        answer=asked(7, 3, pair("Д", "Е")),
    ),
    dict(
        at=(7, 4),
        title="Сумма двух дорог при симметрии",
        difficulty=3,
        minutes=5,
        instruction=NUMBER,
        hint="Подтемы 4 и 5: симметрия и сумма длин.",
        answer=asked(7, 4, both("АГ", "БД")),
    ),
    dict(
        at=(7, 5),
        title="Сумма дорог из пункта А",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Подтемы 2 и 5: опора и сумма строки.",
        answer=asked(7, 5, row("А")),
    ),
]


if __name__ == "__main__":
    sys.exit(main(HERE, 1, TASKS))
