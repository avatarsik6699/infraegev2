"""Topic 23 bank tasks for the site lesson (Change 172, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-23/bank.py          # check only
    python3 -I content/lesson-design/topic-23/bank.py --write  # update the bank

Every checkable task of the subtopic pages and of «Практика и итог» becomes a
bank task; the «объясни, почему» questions live in the lesson as subtopic
self-checks (``topic.json`` → ``site.checkpoints``). A statement is the
subtopic's question verbatim, with a stand link to a graph file replaced by
the file name: the file itself is attached to the task. The answer is what
the task's own solution program prints, run next to its file, and it must
appear in the answer written in the subtopic file.
``apps/api/tests/test_task_23_bank.py`` recomputes every answer independently.

``--write`` replaces this topic's tasks in ``content/practice-bank/bank.json``,
copies the graph files into ``content/practice-bank/files/<sha256>``, adds the
lesson material from the registry and runs nothing else: run Prettier on the
bank afterwards.
"""

import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
BANK = REPO / "content/practice-bank/bank.json"
BANK_FILES = REPO / "content/practice-bank/files"
REGISTRY = REPO / "apps/api/practice-registry.json"
MATERIAL = "graph-analysis"
TASK_BLOCK = ("**Чтобы проверить понимание", "**Задачи основных подтем")
FILES = {
    1: "01-graf-i-put.md",
    2: "02-luchshij-ostatok.md",
    3: "03-graf-iz-fajla.md",
    4: "04-rekursiya-s-zapominaniem.md",
    5: "05-usloviya-na-put.md",
    6: "06-povtornye-prohody.md",
    7: "07-drugie-sposoby.md",
    8: "08-praktika-i-itog.md",
}
ADVANCED = {6, 7}
MAX_CODE_LINE = 64
FILE_NOTE = "Ациклический ориентированный граф: в строке — начало ребра, конец и вес"

# Reading a graph file into an adjacency list, as in subtopic 3.
READ = """from decimal import Decimal
from functools import cache

INF = Decimal("Infinity")
graph = {}

with open("FILE") as f:
    for line in f:
        if not line.strip():
            continue
        parts = line.split()
        u = int(parts[0])
        v = int(parts[1])
        w = Decimal(parts[2])
        if u not in graph:
            graph[u] = []
        graph[u].append((v, w))
"""

# A small graph written in the statement, in the same structure.
SMALL = """from decimal import Decimal
from functools import cache

INF = Decimal("Infinity")
graph = {}

for line in EDGES:
    parts = line.split()
    u = int(parts[0])
    v = int(parts[1])
    w = Decimal(parts[2])
    if u not in graph:
        graph[u] = []
    graph[u].append((v, w))
"""

# best(v, target) of subtopic 5: the cheapest path from v to target.
BEST = """

@cache
def best(v, target):
    if v == target:
        return Decimal(0)
    answer = INF
    for next_vertex, weight in graph.get(v, []):
        candidate = weight + best(next_vertex, target)
        if candidate < answer:
            answer = candidate
    return answer
"""

# best_without(v, target): the same with forbidden vertices.
BEST_WITHOUT = """

@cache
def best_without(v, target):
    if v in BANNED:
        return INF
    if v == target:
        return Decimal(0)
    answer = INF
    for next_vertex, weight in graph.get(v, []):
        candidate = weight + best_without(next_vertex, target)
        if candidate < answer:
            answer = candidate
    return answer
"""


def read(file: str) -> str:
    return READ.replace("FILE", file)


def small(*edges: str) -> str:
    rows = ",\n    ".join(f'"{e}"' for e in edges)
    return f"EDGES = [\n    {rows},\n]\n" + SMALL


G3 = ("1 20 2.4", "1 7 6.0", "20 7 1.3", "7 100 3.2", "20 100 8.0", "1 100 15.0")
G7 = (
    "1 12 3.4",
    "1 5 6.1",
    "12 5 1.9",
    "12 30 7.2",
    "5 30 2.6",
    "5 100 9.8",
    "30 100 4.7",
    "1 100 16.5",
)
G26 = (
    "1 4 2.5",
    "1 6 4.1",
    "4 6 1.2",
    "4 15 0.6",
    "6 15 2.9",
    "6 100 7.4",
    "15 100 5.8",
    "15 22 0.3",
)
INT_PART = "Введите целую часть найденной длины."

# (subtopic, number in the subtopic file) -> task definition.
# section: the step the task trains (theory link); none on the final page.
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 2),
        section="vershiny-i-rebra",
        title="Посчитайте вершины графа",
        difficulty=1,
        minutes=2,
        instruction="Введите количество вершин.",
        hint="Выпишите все разные номера, которые встречаются в рёбрах. Номер 100 — "
        "имя вершины, а не их количество.",
        explain="4: в рёбрах встречаются номера 1, 40, 7 и 100. Номер 100 — имя одной "
        "вершины, а не количество вершин.",
        code="""edges = [(1, 40), (40, 7), (7, 100), (1, 100)]
vertices = set()
for u, v in edges:
    vertices.add(u)
    vertices.add(v)
print(len(vertices))""",
    ),
    dict(
        at=(1, 5),
        section="kratchajshij",
        title="Найдите кратчайший путь перебором",
        difficulty=1,
        minutes=5,
        instruction=INT_PART,
        hint="Путей из 1 в 100 всего четыре. Выпишите каждый и сложите веса его рёбер.",
        explain="Четыре пути: 15.0, 9.2, 10.4 и 6.9. Кратчайший — 1 → 20 → 7 → 100 "
        "длиной 2.4 + 1.3 + 3.2 = 6.9, целая часть — 6.",
        code=small(*G3)
        + BEST
        + """

print(int(best(1, 100)))""",
    ),
    dict(
        at=(1, 7),
        section="kratchajshij",
        title="Найдите кратчайший путь в небольшом графе",
        difficulty=2,
        minutes=6,
        instruction=INT_PART,
        hint="Путь с меньшим числом рёбер не обязательно короче: сравнивайте полные суммы весов.",
        explain="12: кратчайший путь 1 → 12 → 5 → 30 → 100 длиной "
        "3.4 + 1.9 + 2.6 + 4.7 = 12.6. Пути с меньшим числом рёбер дороже: "
        "1 → 100 — 16.5, 1 → 5 → 100 — 15.9.",
        code=small(*G7)
        + BEST
        + """

print(int(best(1, 100)))""",
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 6),
        section="tupik",
        title="Посчитайте f от цели назад",
        difficulty=2,
        minutes=6,
        instruction=INT_PART,
        hint="Начните с f(100) = 0 и f(22) = ∞: из 22 до цели не дойти. Затем "
        "f(15), f(6), f(4) и f(1).",
        explain="8: f(15) = 5.8, f(6) = min(2.9 + 5.8, 7.4) = 7.4, "
        "f(4) = min(1.2 + 7.4, 0.6 + 5.8) = 6.4, f(1) = min(2.5 + 6.4, 4.1 + 7.4) = 8.9. "
        "Если ошибочно считать тупик 22 нулём, получится 3.4.",
        code=small(*G26)
        + BEST
        + """

print(int(best(1, 100)))""",
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 1),
        section="split-i-int",
        title="Строки и числа",
        difficulty=1,
        minutes=1,
        instruction="Введите оба значения через пробел.",
        hint="Строки при сложении склеиваются, числа складываются.",
        explain="125 17: «12» + «5» — склейка строк, 12 + 5 — сумма чисел.",
        code='print("12" + "5", 12 + 5)',
    ),
    dict(
        at=(3, 6),
        section="decimal",
        title="float против Decimal",
        difficulty=1,
        minutes=2,
        instruction="Введите оба значения через пробел, как их выведет Python.",
        hint="0.1 и 0.2 не имеют конечной двоичной записи, а Decimal из строки "
        "хранит десятичные дроби точно.",
        explain="False True: сумма float хранится приближённо (0.30000000000000004), "
        "а Decimal складывает десятичные дроби точно.",
        code="""from decimal import Decimal

a = 0.1 + 0.2
b = Decimal("0.1") + Decimal("0.2")
print(a == 0.3, b == Decimal("0.3"))""",
    ),
    dict(
        at=(3, 7),
        section="spisok-reber",
        file="23-1.txt",
        title="Прочитайте граф из файла",
        difficulty=1,
        minutes=5,
        instruction="Введите количество вершин.",
        hint="Соберите оба конца каждого ребра в множество: повторы в нём не сохраняются.",
        explain="60 различных вершин при 200 рёбрах. Из вершины 100 выходят два ребра, "
        "хотя она цель: файл описывает весь граф, а не только путь.",
        code="""vertices = set()

with open("23-1.txt") as f:
    for line in f:
        if not line.strip():
            continue
        parts = line.split()
        vertices.add(int(parts[0]))
        vertices.add(int(parts[1]))

print(len(vertices))""",
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 6),
        section="programma",
        file="23-1.txt",
        title="Кратчайший путь из 1 в 100",
        difficulty=2,
        minutes=10,
        instruction=INT_PART,
        hint="Прочитайте файл в список смежности и вызовите рекурсию с @cache. "
        "Целую часть берите только у итоговой суммы.",
        explain="11387: рекурсия с запоминанием находит длину 11387.63, целая часть — 11387.",
        code=read("23-1.txt")
        + BEST
        + """

print(int(best(1, 100)))""",
    ),
    dict(
        at=(4, 7),
        section="programma",
        file="23-1.txt",
        title="Кратчайший путь до другой вершины",
        difficulty=2,
        minutes=6,
        instruction=INT_PART,
        hint="Меняется только цель: вершина 255 — тупик, но для этого вопроса она конец пути.",
        explain="11009: та же программа с целью 255 даёт 11009.49.",
        code=read("23-1.txt")
        + BEST
        + """

print(int(best(1, 255)))""",
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 5),
        section="zapret",
        extra_sections=["obyazatelnaya"],
        title="Обязательная и запрещённая вершина",
        difficulty=2,
        minutes=6,
        instruction="Введите длину пути — десятичную дробь через точку.",
        hint="Без вершины 4 до 15 можно дойти только через 6.",
        explain="12.8: участок 1 → 6 → 15 стоит 4.1 + 2.9 = 7.0, участок 15 → 100 — 5.8.",
        code=small(*G26)
        + "BANNED = {4}\n"
        + BEST_WITHOUT
        + """

part1 = best_without(1, 15)
part2 = best_without(15, 100)
print(part1 + part2)""",
        variants=lambda answer: [answer, answer.replace(".", ",")],
    ),
    dict(
        at=(5, 6),
        section="obyazatelnaya",
        file="23-2.txt",
        title="Путь через обязательную вершину",
        difficulty=2,
        minutes=10,
        instruction=INT_PART,
        hint="Путь делится на два участка: до вершины 264 и от неё. Сложите их "
        "минимумы, целую часть берите в конце.",
        explain="10742: best(1, 264) + best(264, 100) = 10742.14. Кратчайший путь без "
        "условия через 264 не проходит и стоит 10715.49.",
        code=read("23-2.txt")
        + BEST
        + """

print(int(best(1, 264) + best(264, 100)))""",
    ),
    dict(
        at=(5, 7),
        section="zapret",
        file="23-2.txt",
        title="Путь в обход запрещённой вершины",
        difficulty=2,
        minutes=10,
        instruction=INT_PART,
        hint="Запрещённая вершина — тупик: её значение — бесконечность.",
        explain="10981: кратчайший путь проходит через 975 и стоит 10715.49; в обход "
        "получается 10981.54.",
        code=read("23-2.txt")
        + "BANNED = {975}\n"
        + BEST_WITHOUT
        + """

print(int(best_without(1, 100)))""",
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 2),
        section="rannyaya-ostanovka",
        title="Сколько проходов при удобном порядке",
        difficulty=1,
        minutes=3,
        instruction="Введите количество проходов.",
        hint="При порядке по ходу движения все стоимости находятся за один проход. "
        "Что нужно, чтобы программа это заметила?",
        explain="2: за первый проход стоимости находятся сразу по цепочке 2, 3, 6, "
        "второй проход изменений не даёт, и программа останавливается.",
        code="""from decimal import Decimal

INF = Decimal("Infinity")
edges = [(1, 40, 2), (40, 7, 1), (7, 100, 3)]
distance = {1: Decimal(0), 40: INF, 7: INF, 100: INF}
passes = 0
for step in range(len(distance) - 1):
    passes += 1
    changed = False
    for u, v, w in edges:
        if distance[u] + w < distance[v]:
            distance[v] = distance[u] + w
            changed = True
    if not changed:
        break
print(passes)""",
    ),
    dict(
        at=(6, 6),
        section="programma-prohodov",
        file="23-3.txt",
        title="Кратчайший путь повторными проходами",
        difficulty=2,
        minutes=12,
        instruction=INT_PART,
        hint="Стоимость от начала: 0 для вершины 1, бесконечность для остальных. "
        "Просматривайте рёбра, пока они дают улучшения.",
        explain="7393: повторные проходы дают 7393.88 — столько же, сколько рекурсия.",
        code="""from decimal import Decimal

INF = Decimal("Infinity")
edges = []
vertices = {1, 100}

with open("23-3.txt") as f:
    for line in f:
        if not line.strip():
            continue
        parts = line.split()
        u = int(parts[0])
        v = int(parts[1])
        edges.append((u, v, Decimal(parts[2])))
        vertices.add(u)
        vertices.add(v)

distance = {v: INF for v in vertices}
distance[1] = Decimal(0)

for step in range(len(vertices) - 1):
    changed = False
    for u, v, w in edges:
        if distance[u] == INF:
            continue
        if distance[u] + w < distance[v]:
            distance[v] = distance[u] + w
            changed = True
    if not changed:
        break

print(int(distance[100]))""",
    ),
    dict(
        at=(6, 7),
        section="vosstanovlenie",
        file="23-3.txt",
        title="Восстановите кратчайший путь",
        difficulty=3,
        minutes=12,
        instruction="Введите номера вершин пути по порядку через пробел, начиная с 1.",
        hint="При каждом улучшении запоминайте предшественника: previous[v] = u. "
        "Потом идите от 100 назад и разверните список.",
        explain="Путь 1 → 899 → 650 → 372 → 820 → 598 → 450 → 246 → 170 → 701 → 632 → "
        "454 → 100: словарь предшественников, пройденный от цели к началу.",
        code="""from decimal import Decimal

INF = Decimal("Infinity")
edges = []
vertices = {1, 100}

with open("23-3.txt") as f:
    for line in f:
        if not line.strip():
            continue
        parts = line.split()
        u = int(parts[0])
        v = int(parts[1])
        edges.append((u, v, Decimal(parts[2])))
        vertices.add(u)
        vertices.add(v)

distance = {v: INF for v in vertices}
distance[1] = Decimal(0)
previous = {}

for step in range(len(vertices) - 1):
    changed = False
    for u, v, w in edges:
        if distance[u] == INF:
            continue
        if distance[u] + w < distance[v]:
            distance[v] = distance[u] + w
            previous[v] = u
            changed = True
    if not changed:
        break

path = []
v = 100
while v != 1:
    path.append(v)
    v = previous[v]
path.append(1)
path.reverse()
print(*path)""",
    ),
    # ------------------------------------------------------------ subtopic 7
    dict(
        at=(7, 1),
        section="topologicheskij",
        title="Запишите топологический порядок",
        difficulty=1,
        minutes=4,
        instruction="Введите номера вершин в порядке через пробел.",
        hint="Найдите вершину, в которую ничего не входит, запишите её и уберите её "
        "рёбра. Повторяйте.",
        explain="5 3 8 2: в 5 ничего не входит, после её удаления ничего не входит в 3, "
        "затем в 8, последней остаётся 2.",
        code="""edges = [(5, 3), (5, 8), (3, 8), (8, 2), (3, 2)]
vertices = [5, 3, 8, 2]
order = []
while len(order) < len(vertices):
    for v in vertices:
        if v in order:
            continue
        incoming = [u for u, x in edges
                    if x == v and u not in order]
        if not incoming:
            order.append(v)
            break
print(*order)""",
    ),
    dict(
        at=(7, 2),
        section="dejkstra",
        title="Порядок обработки в алгоритме Дейкстры",
        difficulty=2,
        minutes=6,
        instruction="Введите номера вершин в порядке обработки через пробел.",
        hint="Каждый раз берите ещё не обработанную вершину с наименьшей найденной "
        "стоимостью от начала.",
        explain="1 20 7 100: стоимости 0, 2.4, 3.7 (через 20) и 6.9 (через 7).",
        code=small(*G3)
        + """
dist = {1: Decimal(0)}
done = []
while len(done) < 4:
    v = min((d, x) for x, d in dist.items()
            if x not in done)[1]
    done.append(v)
    for x, w in graph.get(v, []):
        if dist[v] + w < dist.get(x, INF):
            dist[x] = dist[v] + w
print(*done)""",
    ),
    dict(
        at=(7, 4),
        section="rovno-k",
        title="Путь ровно из двух рёбер",
        difficulty=2,
        minutes=5,
        instruction="Введите стоимость — десятичную дробь через точку.",
        hint="Нужна стоимость попадания в 100 ровно за два перехода: D[2][100].",
        explain="9.2: ровно двумя рёбрами лучше путь 1 → 7 → 100 (6.0 + 3.2); "
        "1 → 20 → 100 стоит 10.4.",
        code="""from decimal import Decimal

INF = Decimal("Infinity")
edges = [(1, 20, "2.4"), (1, 7, "6.0"), (20, 7, "1.3"),
         (7, 100, "3.2"), (20, 100, "8.0"), (1, 100, "15.0")]
vertices = {1, 20, 7, 100}
D = [{v: INF for v in vertices} for k in range(3)]
D[0][1] = Decimal(0)
for k in range(2):
    for u, v, w in edges:
        if D[k][u] + Decimal(w) < D[k + 1][v]:
            D[k + 1][v] = D[k][u] + Decimal(w)
print(D[2][100])""",
        variants=lambda answer: [answer, answer.replace(".", ",")],
    ),
    dict(
        at=(7, 6),
        section="kolichestvo-putej",
        file="23-4.txt",
        title="Количество путей",
        difficulty=2,
        minutes=10,
        instruction="Введите количество путей.",
        hint="c(цель) = 1, тупик — 0, для остальных — сумма c по соседям. Запоминайте ответы.",
        explain="227: рекурсия с запоминанием складывает количества путей соседей.",
        code=read("23-4.txt")
        + """

@cache
def count(v):
    if v == 100:
        return 1
    total = 0
    for next_vertex, weight in graph.get(v, []):
        total += count(next_vertex)
    return total


print(count(1))""",
    ),
    dict(
        at=(7, 7),
        section="dlinnejshij",
        file="23-4.txt",
        title="Самый длинный путь",
        difficulty=2,
        minutes=10,
        instruction=INT_PART,
        hint="Вместо минимума — максимум, а тупик обозначается минус бесконечностью.",
        explain="7362: самый длинный путь стоит 7362.44.",
        code=read("23-4.txt")
        + """
NEG = Decimal("-Infinity")


@cache
def longest(v):
    if v == 100:
        return Decimal(0)
    answer = NEG
    for next_vertex, weight in graph.get(v, []):
        candidate = weight + longest(next_vertex)
        if candidate > answer:
            answer = candidate
    return answer


print(int(longest(1)))""",
    ),
    # ------------------------------------------------------- «Практика и итог»
    dict(
        at=(8, 1),
        file="23-5.txt",
        title="Кратчайший путь в графе из файла",
        difficulty=2,
        minutes=10,
        instruction=INT_PART,
        hint="Подтема 4: рекурсия с @cache, целая часть только в конце.",
        explain="10211: длина кратчайшего пути 10211.63. Подтема 4: рекурсия с запоминанием.",
        code=read("23-5.txt")
        + BEST
        + """

print(int(best(1, 100)))""",
    ),
    dict(
        at=(8, 2),
        file="23-5.txt",
        title="Путь через две обязательные вершины",
        difficulty=3,
        minutes=12,
        instruction=INT_PART,
        hint="Подтема 5: посчитайте оба порядка обязательных вершин — недостижимый "
        "даст бесконечность.",
        explain="10327: из 342 можно дойти до 423, а обратно нельзя, поэтому путь идёт "
        "1 → … → 342 → … → 423 → … → 100. Подтема 5: путь по участкам.",
        code=read("23-5.txt")
        + BEST
        + """

a, b = 342, 423
one = best(1, a) + best(a, b) + best(b, 100)
two = best(1, b) + best(b, a) + best(a, 100)
print(int(min(one, two)))""",
    ),
    dict(
        at=(8, 3),
        file="23-5.txt",
        title="Путь без запрещённой вершины",
        difficulty=2,
        minutes=10,
        instruction=INT_PART,
        hint="Подтема 5: запрещённая вершина возвращает бесконечность.",
        explain="10228: кратчайший путь проходит через 722, в обход получается "
        "10228.86. Подтема 5: запрещённая вершина.",
        code=read("23-5.txt")
        + "BANNED = {722}\n"
        + BEST_WITHOUT
        + """

print(int(best_without(1, 100)))""",
    ),
    dict(
        at=(8, 4),
        file="23-6.txt",
        title="Граф с тупиками",
        difficulty=2,
        minutes=10,
        instruction=INT_PART,
        hint="Подтемы 2 и 4: тупик, из которого не дойти до цели, — бесконечность, а не ноль.",
        explain="9257: длина кратчайшего пути 9257.03. Если тупику вернуть 0, получится "
        "316 — «путь» в тупик. Подтемы 2 и 4.",
        code=read("23-6.txt")
        + BEST
        + """

print(int(best(1, 100)))""",
    ),
    dict(
        at=(8, 5),
        file="23-6.txt",
        title="Путь через обязательную вершину",
        difficulty=2,
        minutes=10,
        instruction=INT_PART,
        hint="Подтема 5: сумма минимумов двух участков.",
        explain="9659: best(1, 429) + best(429, 100) = 9659.94. Подтема 5.",
        code=read("23-6.txt")
        + BEST
        + """

print(int(best(1, 429) + best(429, 100)))""",
    ),
]


def task_inventory(block: str) -> dict[int, tuple[str, str]]:
    questions, _, answers = block.partition("\n**Ответы для проверки:**\n")

    def numbered(text: str) -> dict[int, str]:
        found = re.split(r"(?m)^(\d+)\. ", text)
        return {int(found[k]): found[k + 1].strip() for k in range(1, len(found) - 1, 2)}

    q, a = numbered(questions), numbered(answers)
    return {n: (q[n], a.get(n, "")) for n in q}


def inventory() -> dict[int, dict[int, tuple[str, str]]]:
    result = {}
    for sub, name in FILES.items():
        steps = [s.strip() for s in re.split(r"\n---\n", (HERE / name).read_text())]
        block = next(s for s in steps if s.startswith(TASK_BLOCK))
        result[sub] = task_inventory(block)
    return result


def site_text(text: str) -> str:
    """Stand markup → bank Markdown: a graph file link becomes its name,
    a Python term keeps only its label."""
    text = re.sub(r"\[([^\]]+)\]\(topic-\d+/files/[^)]+\)", r"\1", text)
    return re.sub(r"\{\{\w+\|(.+?)\}\}", r"\1", text)


def statement(question: str) -> list[dict]:
    """The question verbatim; an indented fence becomes its own text block."""
    blocks = []
    parts = re.split(r"\n\s*```(\w*)\n(.*?)\n\s*```", site_text(question), flags=re.S)
    for k in range(0, len(parts), 3):
        text = " ".join(parts[k].replace("**", "").split())
        if text:
            blocks.append({"type": "text", "data": {"markdown": text}})
        if k + 2 < len(parts):
            code = "\n".join(line.strip() for line in parts[k + 2].split("\n"))
            blocks.append(
                {
                    "type": "code_example",
                    "data": {"language": "text", "code": code, "caption": None},
                }
            )
    return blocks


def run(code: str, file: str | None) -> str:
    """Run a solution next to its graph file, as the learner would."""
    with tempfile.TemporaryDirectory() as tmp:
        if file:
            shutil.copy(HERE / "files" / file, Path(tmp) / file)
        done = subprocess.run(
            [sys.executable, "-I", "-c", code],
            capture_output=True,
            text=True,
            timeout=300,
            cwd=tmp,
        )
    if done.returncode:
        raise SystemExit(done.stderr)
    return done.stdout


def agrees(answer: str, written: str) -> bool:
    """Every token of the answer appears in the written answer, in order."""
    rest = written.replace("`", "")
    for token in answer.split():
        found = re.search(rf"(?<![\d.]){re.escape(token)}(?![\d])", rest)
        if not found:
            return False
        rest = rest[found.end() :]
    return True


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def build() -> tuple[list[dict], dict[str, Path]]:
    texts = inventory()
    sections = {m["id"]: m for m in json.loads(REGISTRY.read_text())["materials"]}[MATERIAL][
        "sections"
    ]
    tasks, files = [], {}
    for position, spec in enumerate(TASKS):
        sub, number = spec["at"]
        question, written = texts[sub][number]
        code = spec["code"]
        output = run(code, spec.get("file"))
        answer = " ".join(output.split())
        if not agrees(answer, written):
            raise SystemExit(f"{spec['at']}: program prints {answer!r}, file says {written!r}")
        long = [line for line in code.split("\n") if len(line) > MAX_CODE_LINE]
        if long:
            raise SystemExit(f"{spec['at']}: code lines over {MAX_CODE_LINE}: {long}")
        links = []
        for section in [spec.get("section"), *spec.get("extra_sections", [])]:
            if section is None:
                continue
            if section not in sections:
                raise SystemExit(f"{spec['at']}: unknown section {section}")
            links.append({"label": "Теория", "section": section, "material_id": MATERIAL})
        attachments = []
        if spec.get("file"):
            path = HERE / "files" / spec["file"]
            checksum = sha256(path)
            files[checksum] = path
            attachments.append(
                {
                    "id": "statement-1",
                    "purpose": "attachment",
                    "checksum": checksum,
                    "filename": spec["file"],
                    "attribution": None,
                    "description": FILE_NOTE,
                }
            )
        explanation = [
            {"type": "text", "data": {"markdown": spec["explain"]}},
            {
                "type": "code_example",
                "data": {
                    "language": "python",
                    "code": code,
                    "caption": "Решение программой",
                },
            },
        ]
        membership = {"position": position, "material_id": MATERIAL}
        if sub in ADVANCED:
            membership["counts_toward_mastery"] = False
        variants = spec.get("variants", lambda a: [a])(answer)
        tasks.append(
            {
                "task": {
                    "id": f"task-23-{sub}-{number:02d}",
                    "title": spec["title"],
                    "short_description": None,
                    "explanation_kind": "worked_solution",
                    "difficulty": spec["difficulty"],
                    "estimated_minutes": spec["minutes"],
                    "answer_instruction": spec["instruction"],
                    "interaction_type": "production",
                    "content_schema_version": 1,
                    "statement": statement(question)
                    + (
                        [{"type": "attachment", "data": {"usage_id": "statement-1"}}]
                        if attachments
                        else []
                    ),
                    "hint": [{"type": "text", "data": {"markdown": spec["hint"]}}],
                    "explanation": explanation,
                    "skills": [],
                    "exam_numbers": [23],
                    "files": attachments,
                    "lessons": [membership],
                    "theory_links": links,
                    "catalog_visible": False,
                    "archived": False,
                    "sources": [
                        {
                            "url": None,
                            "kind": "original",
                            "role": "original",
                            "year": None,
                            "title": None,
                            "author": None,
                            "primary": True,
                            "is_public": True,
                            "adaptation": None,
                            "original_id": None,
                        }
                    ],
                    "checker": {
                        "checker_type": "exact_match",
                        "answer_variants": variants,
                        "numeric_tolerance": None,
                    },
                },
                "solution_revision": 1,
            }
        )
    return tasks, files


def main() -> int:
    tasks, files = build()
    for entry in tasks:
        task = entry["task"]
        print(task["id"], "|", task["checker"]["answer_variants"][0][:70])
    if "--write" not in sys.argv:
        print(f"{len(tasks)} tasks agree with the subtopic files (dry run)")
        return 0
    bank = json.loads(BANK.read_text())
    new_ids = {entry["task"]["id"] for entry in tasks}
    bank["tasks"] = [e for e in bank["tasks"] if e["task"]["id"] not in new_ids] + tasks
    known = {f["checksum"] for f in bank["files"]}
    for checksum, path in files.items():
        shutil.copy(path, BANK_FILES / checksum)
        if checksum not in known:
            bank["files"].append(
                {
                    "format": "txt",
                    "checksum": checksum,
                    "mime_type": "text/plain",
                    "size_bytes": path.stat().st_size,
                    "storage_key": checksum,
                }
            )
    # the bank carries the registry's publication metadata verbatim
    bank["materials"] = json.loads(REGISTRY.read_text())["materials"]
    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote {len(tasks)} tasks and {len(files)} files; run Prettier on {BANK}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
