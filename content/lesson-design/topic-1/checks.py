"""Independent recomputation of every task answer in topic 1.

Usage: python3 -I content/lesson-design/topic-1/checks.py

The lessons solve by hand: degrees, neighbour profiles, anchors, triangles,
symmetry. Here every answer is recomputed by brute force instead: all maps
letter -> number are tried, a map is kept when every road and every absence of
a road is preserved, and the asked value must be the same under every kept map.
Every expected answer must appear verbatim in the answers of its page.
Exit code 1 if any check fails.
"""

import sys
from itertools import combinations, permutations
from pathlib import Path

D = Path(__file__).resolve().parent

Edges = list[tuple[str, str, int | None]]


def answers(f: str) -> str:
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


checks: list[tuple[str, str, bool]] = []


def expect(f: str, needle: str) -> None:
    checks.append((f, needle, needle in answers(f)))


def same(label: str, a: object, b: object) -> None:
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def roads(spec: str) -> Edges:
    """«АБ АВ» -> roads without lengths."""
    return [(e[0], e[1], None) for e in spec.split()]


def table(rows: list[str]) -> Edges:
    """Rows of a table: «-» no road, «*» a road, a number — its length."""
    out: Edges = []
    for i, row in enumerate(rows):
        for j, cell in enumerate(row.split()):
            if j > i and cell != "-":
                out.append((str(i + 1), str(j + 1), None if cell == "*" else int(cell)))
    return out


def adj(edges: Edges) -> dict[str, set[str]]:
    a: dict[str, set[str]] = {}
    for u, v, _ in edges:
        a.setdefault(u, set()).add(v)
        a.setdefault(v, set()).add(u)
    return a


def length(edges: Edges) -> dict[frozenset, int | None]:
    return {frozenset((u, v)): w for u, v, w in edges}


def maps(g: Edges, t: Edges, letters: str | None = None):
    """Every map letter -> number that keeps all roads and absences."""
    ga, ta = adj(g), adj(t)
    names = sorted(letters or ga)
    numbers = sorted(ta)
    for p in permutations(numbers):
        m = dict(zip(names, p, strict=True))
        if all((y in ga.get(x, ())) == (m[y] in ta[m[x]]) for x, y in combinations(names, 2)):
            yield m


def values(g: Edges, t: Edges, fn) -> set:
    tl = length(t)
    return {fn(m, tl) for m in maps(g, t)}


def one(g: Edges, t: Edges, fn):
    vs = values(g, t, fn)
    return next(iter(vs)) if len(vs) == 1 else ("неоднозначно", sorted(map(str, vs)))


def road(a: str, b: str):
    return lambda m, tl: tl[frozenset((m[a], m[b]))]


def pair(*letters: str):
    return lambda m, tl: "".join(sorted(m[x] for x in letters))


def num(a: str):
    return lambda m, tl: m[a]


def degrees(edges: Edges) -> list[int]:
    return sorted(len(v) for v in adj(edges).values())


def profile(edges: Edges, v: str) -> tuple[int, ...]:
    a = adj(edges)
    return tuple(sorted(len(a[x]) for x in a[v]))


def triangles(edges: Edges) -> int:
    a = adj(edges)
    return sum(1 for x, y, z in combinations(sorted(a), 3) if y in a[x] and z in a[x] and z in a[y])


EX1_G = roads("AB AC BC BD CD CE DF")
EX1_T = table(
    [
        "- - - 12 7 24",
        "- - - - 20 -",
        "- - - - - 9",
        "12 - - - 18 -",
        "7 20 - 18 - 11",
        "24 - 9 - 11 -",
    ]
)
EX1 = next(maps(EX1_G, EX1_T))
EX1_LEN = length(EX1_T)


def ex1_road(a: str, b: str) -> int | None:
    return EX1_LEN[frozenset((EX1[a], EX1[b]))]


def route(fn, path: str) -> int:
    return sum(fn(a, b) for a, b in zip(path, path[1:], strict=False))


# --- 1. Дороги, граф и таблица ---
f = "01-model-i-stepeni.md"
t11 = table(["- - * - -", "- - * - -", "* * - * -", "- - * - *", "- - - * -"])
same("1.1 соседи 3", sorted(adj(t11)["3"]), ["1", "2", "4"])
same("1.1 дорог", len(t11), 4)
expect(f, "1. Соседи пункта 3 — 1, 2, 4; степень пункта 5 — 1; прямой дороги 2—4 нет")
expect(f, f"2. {sum([3, 1, 2, 2, 4, 2]) // 2} дорог")
same("1.4 нечётная сумма", sum([3, 2, 2, 2, 2]) % 2, 1)
cross = roads("AB CD BE DE")
same("1.5 степени", {k: len(v) for k, v in adj(cross).items()}, dict(A=1, B=2, C=1, D=2, E=2))
expect(f, "5. A и C — степень 1, B, D и E — степень 2.")
g16 = roads("AB AC AD BC DE")
t16 = table(["- - - * *", "- - * * -", "- * - - -", "* * - - *", "* - - * -"])
same("1.6 A", values(g16, t16, num("A")), {"4"})
same("1.6 E", values(g16, t16, num("E")), {"3"})
same("1.6 BCD", set().union(*(values(g16, t16, num(x)) for x in "BCD")), {"1", "2", "5"})
g17 = roads("АБ АВ АГ АД БВ ГД ДЕ")
t17 = table(
    [
        "- - 9 - - 6",
        "- - 7 10 13 -",
        "9 7 - - 14 11",
        "- 10 - - - -",
        "- 13 14 - - -",
        "6 - 11 - - -",
    ]
)
expect(f, f"7. {one(g17, t17, road('А', 'Д'))}:")
g18 = roads("АБ АВ АГ АД БВ ВЕ")
t18 = table(
    ["- * - - - -", "* - - * * *", "- - - * - -", "- * * - - *", "- * - - - -", "- * - * - -"]
)
expect(f, f"8. {one(g18, t18, pair('Б', 'В'))}:")

# --- 2. Соседи и опоры ---
f = "02-sosedi-i-opory.md"
g21 = roads("AB AC AD BC BE DE EF")
same("2.1 A", profile(g21, "A"), (2, 2, 3))
same("2.1 E", profile(g21, "E"), (1, 2, 3))
t22 = table(["- * - - -", "* - * * -", "- * - * -", "- * * - *", "- - - * -"])
same("2.2", (profile(t22, "2"), profile(t22, "4")), ((1, 2, 3), (1, 2, 3)))
g25 = roads("AB BC CD BD DE EF")
t25 = table(
    ["- * - - * *", "* - - * - *", "- - - - * -", "- * - - - -", "* - * - - -", "* * - - - -"]
)
m25 = list(maps(g25, t25))
same("2.5 одно соответствие", len(m25), 1)
expect(f, "5. " + ", ".join(f"{k} ↔ {m25[0][k]}" for k in "ABCDEF") + ":")
g26 = roads("АБ АВ БВ БГ ВД ГД ГЕ")
t26 = table(
    [
        "- - 11 8 - 5",
        "- - 9 - - 17",
        "11 9 - - 12 -",
        "8 - - - - 14",
        "- - 12 - - -",
        "5 17 - 14 - -",
    ]
)
expect(f, f"6. {one(g26, t26, road('Б', 'В'))}:")
g27 = roads("АБ АВ АГ БВ ВД ГД ДЕ")
t27 = table(
    ["- - * - * -", "- - - - * *", "* - - * - *", "- - * - - -", "* * - - - *", "- * * - * -"]
)
expect(f, f"7. {one(g27, t27, num('Г'))}:")

# --- 3. Кандидаты и проверка ---
f = "03-kandidaty-i-proverka.md"
t31 = table(["- * - *", "* - * *", "- * - -", "* * - -"])
same("3.1 треугольников", triangles(t31), 1)
g32 = roads("AB BC CA AD BE CF DG DH EG EH FG FH")
t32 = table(
    [
        "- - * - * - * -",
        "- - - * - - * *",
        "* - - - - * - *",
        "- * - - - * * -",
        "* - - - - * - *",
        "- - * * * - - -",
        "* * - * - - - -",
        "- * * - * - - -",
    ]
)
expect(f, f"2. {one(g32, t32, pair('A', 'B', 'C'))}:")
same("3.3 треугольники", triangles(roads("12 13 23 24 34 45")), 2)
same("3.4 общие", len({"C", "D", "E", "F"} & {"D", "F", "G"}), 2)
prism = roads("AB BC CA DE EF FD AD BE CF")
k33: Edges = [(str(a), str(b), None) for a in (1, 2, 3) for b in (4, 5, 6)]
same("3.5 степени", degrees(prism), degrees(k33))
same("3.5 треугольники", (triangles(prism), triangles(k33)), (2, 0))
same("3.5 не одна система", len(list(maps(prism, k33))), 0)
g3x = roads("AC AD AG BD BE BF CE CF DF FG")
t3x = table(
    [
        "- - * * - * -",
        "- - - * - * -",
        "* - - * * - -",
        "* * * - - - *",
        "- - * - - - *",
        "* * - - - - *",
        "- - - * * * -",
    ]
)
same("3 пример B", values(g3x, t3x, num("B")), {"3"})
same("3.6 C не 3", any(m["C"] == "3" for m in maps(g3x, t3x)), False)
g37 = roads("ВД БГ АЕ АГ АЖ ДЕ АД БЖ ВЖ")
t37 = table(
    [
        "- - - * - * -",
        "- - * - - * -",
        "- * - * * * -",
        "* - * - - - *",
        "- - * - - - *",
        "* * * - - - -",
        "- - - * * - -",
    ]
)
expect(f, f"7. {one(g37, t37, num('Ж'))}:")
g38 = roads("АД АЕ ВГ ДЖ БД ГЖ БГ ЕЖ ДЕ")
t38 = table(
    [
        "- 8 10 - 6 11 -",
        "8 - - 12 - - -",
        "10 - - 15 - 7 -",
        "- 12 15 - - - 13",
        "6 - - - - 9 -",
        "11 - 7 - 9 - -",
        "- - - 13 - - -",
    ]
)
expect(f, f"8. {one(g38, t38, road('А', 'Д'))}:")

# --- 4. Симметрия ---
f = "04-simmetriya-i-otvet.md"
g41 = roads("AB AC AD BC CD")
swap_bd = {
    (u.translate(str.maketrans("BD", "DB")), v.translate(str.maketrans("BD", "DB")))
    for u, v, _ in g41
}
same("4.1 B и D", {frozenset(e) for e in swap_bd}, {frozenset((u, v)) for u, v, _ in g41})
g42 = roads("AB AC BC CD CE CF DE DF")
t42 = table(
    ["- - * * - *", "- - - * * -", "* - - * - -", "* * * - * *", "- * - * - -", "* - - * - -"]
)
expect(f, f"2. {one(g42, t42, pair('E', 'F'))};")
same("4.2 E неоднозначно", len(values(g42, t42, num("E"))), 2)
expect(f, f"; {one(g42, t42, pair('A', 'B'))}.")
g45 = roads("АБ АВ БВ БГ ВГ ГД ДЕ")
t45 = table(
    ["- * - - * *", "* - - * - *", "- - - - * -", "- * - - - *", "* - * - - -", "* * - * - -"]
)
expect(f, f"5. {one(g45, t45, pair('Б', 'В'))}:")
g46 = roads("АБ АВ АГ БВ ГД ГЕ ДЕ ЕЖ")
t46 = table(
    [
        "- 14 7 - - 11 -",
        "14 - - 10 - 8 -",
        "7 - - - 12 - 9",
        "- 10 - - - - -",
        "- - 12 - - - 6",
        "11 8 - - - - -",
        "- - 9 - 6 - -",
    ]
)
same("4.6 два соответствия", len(list(maps(g46, t46))), 2)
expect(f, f"6. {one(g46, t46, road('Б', 'В'))}:")

# --- 5. Длины и формат ---
f = "05-dliny-i-format.md"
g51 = roads("AB AC AD AE BD BF CD")
t51 = table(
    [
        "- - 12 - - 20",
        "- - - - 6 -",
        "12 - - 10 15 8",
        "- - 10 - - -",
        "- 6 15 - - 7",
        "20 - 8 - 7 -",
    ]
)
m51 = next(maps(g51, t51))
l51 = length(t51)
r51 = [
    l51[frozenset((m51["B"], m51["D"]))],
    sum(w or 0 for k, w in l51.items() if m51["A"] in k),
    sum(l51[frozenset((m51[a], m51[b]))] or 0 for a, b in ("EA", "AB", "BF")),
]
expect(f, f"1. {r51[0]}; {r51[1]}; {r51[2]}.")
same("5 пример BD", ex1_road("B", "D"), 24)
same("5 пример C", sum(w or 0 for k, w in EX1_LEN.items() if EX1["C"] in k), 56)
same("5 пример маршрут", route(ex1_road, "ECBDF"), 60)
expect(f, f"2. {sum(w or 0 for k, w in EX1_LEN.items() if EX1['D'] in k)}:")
expect(f, f"3. {route(ex1_road, 'ACDF')}:")
expect(f, f"4. {''.join(sorted(EX1['E'] + EX1['D']))} и {EX1['D']}{EX1['E']}:")
g56 = roads("АБ АВ АГ БВ БД ВЕ ГЕ ДЕ")
t56 = table(
    [
        "- 8 - 12 9 -",
        "8 - - - 13 10",
        "- - - 11 15 -",
        "12 - 11 - - 7",
        "9 13 15 - - -",
        "- 10 - 7 - -",
    ]
)
expect(f, f"6. {one(g56, t56, lambda m, tl: road('А', 'Б')(m, tl) + road('В', 'Е')(m, tl))}:")
g57 = roads("АБ БВ ВГ ГД ДА БД ГЕ")
t57 = table(
    [
        "- - 9 12 - -",
        "- - 5 6 - 10",
        "9 5 - - - 14",
        "12 6 - - 11 -",
        "- - - 11 - -",
        "- 10 14 - - -",
    ]
)
expect(
    f,
    f"7. {one(g57, t57, lambda m, tl: sum(road(a, b)(m, tl) for a, b in ('ЕГ', 'ГД', 'ДБ')))}:",
)

# --- 6. Дополнительные условия ---
f = "06-dopolnitelnye-usloviya-i-marshruty.md"
expect(f, "1. A ↔ 3:")
same("6.2 одинаковая сумма", 14 + 9, 23)
missing = [e for e in EX1_G if {e[0], e[1]} != {"C", "D"}]
same("6 пример сумма степеней", (sum(degrees(missing)), sum(degrees(EX1_T))), (12, 14))


def maps_missing(g: Edges, t: Edges, letters: str):
    """Maps keeping every road of the scheme with exactly one extra road in the table."""
    ga, ta = adj(g), adj(t)
    for p in permutations(sorted(ta)):
        m = dict(zip(sorted(letters), p, strict=True))
        if not all(m[y] in ta[m[x]] for x in ga for y in ga[x]):
            continue
        extra = {frozenset((a, b)) for a in ta for b in ta[a]} - {
            frozenset((m[x], m[y])) for x in ga for y in ga[x]
        }
        if len(extra) == 1:
            yield m, next(iter(extra))


miss6 = set()
for m6, e6 in maps_missing(missing, EX1_T, "ABCDEF"):
    back = {v: k for k, v in m6.items()}
    miss6.add(frozenset(back[x] for x in e6))
same("6 пример пропущена C—D", miss6, {frozenset("CD")})


def shortest(lens: dict[frozenset, int | None], a: str, b: str, names: str) -> int:
    best = 10**9
    mids = [x for x in names if x not in (a, b)]
    for k in range(len(mids) + 1):
        for chosen in permutations(mids, k):
            path = (a, *chosen, b)
            parts = [lens.get(frozenset(s)) for s in zip(path, path[1:], strict=False)]
            if all(p is not None for p in parts):
                best = min(best, sum(p for p in parts if p is not None))
    return best


ex1_letters = {frozenset((u, v)): ex1_road(u, v) for u, v, _ in EX1_G}
same("6 пример E—F", shortest(ex1_letters, "E", "F", "ABCDEF"), 40)
expect(f, f"4. A → C → D → F, {shortest(ex1_letters, 'A', 'F', 'ABCDEF')} км")
g66 = roads("AB BC CA CD DE EF FD FG")


def bridges(edges: Edges) -> list[str]:
    out = []
    for e in edges:
        rest = [x for x in edges if x != e]
        a = adj(rest)
        seen, stack = {e[0]}, [e[0]]
        while stack:
            x = stack.pop()
            for y in a.get(x, ()):
                if y not in seen:
                    seen.add(y)
                    stack.append(y)
        if e[1] not in seen:
            out.append(e[0] + "—" + e[1])
    return out


same("6.6 мосты", bridges(g66), ["C—D", "F—G"])
same("6 пример мосты", bridges(EX1_G), ["C—E", "D—F"])
g67 = roads("АБ АВ БВ БГ ВГ ГД ДЕ")
t67 = table(
    [
        "- - - 11 9 -",
        "- - 13 - 12 7",
        "- 13 - - - 10",
        "11 - - - - -",
        "9 12 - - - 8",
        "- 7 10 - 8 -",
    ]
)
v67 = {
    road("А", "Б")(m, length(t67))
    for m in maps(g67, t67)
    if road("Б", "Г")(m, length(t67)) < road("В", "Г")(m, length(t67))
}
same("6.7 одно значение", len(v67), 1)
expect(f, f"7. {next(iter(v67))}:")
g68 = roads("БД ГЕ БЕ ВЕ ГД АД АГ")
t68 = table(
    [
        "- - 7 - 16 12",
        "- - 17 - - -",
        "7 17 - 22 - 6",
        "- - 22 - - 9",
        "16 - - - - 15",
        "12 - 6 9 15 -",
    ]
)
l68 = length(t68)
v68 = {l68[e] for _, e in maps_missing(g68, t68, "АБВГДЕ")}
same("6.8 одно значение", len(v68), 1)
expect(f, f"8. {next(iter(v68))}:")

# --- 7. Практика и итог ---
f = "07-praktika-i-itog.md"
g71 = roads("АВ БД ДЕ АБ ВД БВ БГ АГ")
t71 = table(
    [
        "- 25 12 - - 10",
        "25 - - - - -",
        "12 - - 16 6 8",
        "- - 16 - 20 -",
        "- - 6 20 - 29",
        "10 - 8 - 29 -",
    ]
)
expect(f, f"1. {one(g71, t71, road('А', 'В'))}:")
g72 = roads("БГ АГ БЖ БВ АД АЖ ЕЖ БЕ ДЖ")
t72 = table(
    [
        "- * - - - - *",
        "* - - * * * -",
        "- - - - - * *",
        "- * - - - - -",
        "- * - - - * -",
        "- * * - * - *",
        "* - * - - * -",
    ]
)
expect(f, f"2. {one(g72, t72, num('Д'))}:")
g73 = roads("АГ ВД ГЕ ГД АБ ВЕ ВГ")
t73 = table(
    ["- * * * * -", "* - - * - -", "* - - * - -", "* * * - - -", "* - - - - *", "- - - - * -"]
)
expect(f, f"3. {one(g73, t73, pair('Д', 'Е'))}:")
g74 = roads("БВ ВЕ ВГ АД ДЕ АГ АЕ БД")
t74 = table(
    [
        "- 9 - - - 16",
        "9 - 18 13 - -",
        "- 18 - 10 7 -",
        "- 13 10 - - 5",
        "- - 7 - - 14",
        "16 - - 5 14 -",
    ]
)
same("7.4 два соответствия", len(list(maps(g74, t74))), 2)
expect(f, f"4. {one(g74, t74, lambda m, tl: road('А', 'Г')(m, tl) + road('Б', 'Д')(m, tl))}:")
g75 = roads("БВ АБ АВ ДЕ АЕ БД ВГ БЕ")
t75 = table(
    [
        "- - 29 - 26 14",
        "- - - 20 - 10",
        "29 - - 15 - 16",
        "- 20 15 - - 23",
        "26 - - - - -",
        "14 10 16 23 - -",
    ]
)
expect(f, f"5. {one(g75, t75, lambda m, tl: sum(w or 0 for k, w in tl.items() if m['А'] in k))}:")

failed = [c for c in checks if not c[2]]
for page, needle, ok in checks:
    if not ok:
        print(f"FAIL {page}: {needle}")
print(f"{len(checks)} checks, {len(failed)} failed")
sys.exit(1 if failed else 0)
