"""Topic 27 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-27/bank.py          # check only
    python3 -I content/lesson-design/topic-27/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. The lesson
replaces the earlier «Анализ данных: кластеризация» (same id and route):
``--write`` also archives that lesson's tasks (``RETIRED``).
``apps/api/tests/test_task_27_bank.py`` recomputes every answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, TWO, main  # noqa: E402

RETIRED = frozenset(f"task-27-0{k}" for k in range(1, 8))

F1 = ("27-1.txt", "Точки двух кластеров")
F2 = ("27-2.txt", "Точки трёх кластеров и три аномалии")
F3 = ("27-3.txt", "Звёзды: координаты и характеристика")
F4 = ("27-4.txt", "Частицы: координаты, скорость, масса, признак")
F5 = ("27-5.txt", "Точки трёх кластеров в секторах")
F6 = ("27-6.txt", "Точки двух кластеров-дуг")
SCALED = "Введите два целых числа через пробел."

# The lesson's reading of a file of points (subtopic 2) and its center
# by the smallest sum of distances (subtopic 4).
POINTS = """from math import dist


def read_points(filename):
    points = []
    with open(filename, encoding='utf-8-sig') as f:
        for line in f:
            parts = line.replace(',', '.').split()
            points.append((float(parts[0]), float(parts[1])))
    return points


def center_sum(cluster):
    best_point = cluster[0]
    best_sum = float('inf')
    for candidate in cluster:
        total = 0.0
        for point in cluster:
            total += dist(candidate, point)
        if total < best_sum:
            best_sum = total
            best_point = candidate
    return best_point


"""

# Stars of 27-3.txt split by the lesson's bounds (subtopics 2 and 3).
STARS = """from math import dist


def center_sum(cluster):
    best_point = cluster[0]
    best_sum = float('inf')
    for candidate in cluster:
        total = 0.0
        for point in cluster:
            total += dist(candidate, point)
        if total < best_sum:
            best_sum = total
            best_point = candidate
    return best_point


stars = []
with open('27-3.txt', encoding='utf-8-sig') as f:
    for line in f:
        sx, sy, code = line.replace(',', '.').split()
        stars.append((float(sx), float(sy), code))

clusters = [[], [], []]
for s in stars:
    if s[1] < 5:
        clusters[0].append(s)
    elif s[0] < 10:
        clusters[1].append(s)
    else:
        clusters[2].append(s)


def is_kind(code, cls, lum):
    return code[0] == cls and code[2:] == lum


"""

# Particles of 27-4.txt and their energy clusters (subtopics 2 and 3).
PARTICLES = """parts = []
with open('27-4.txt', encoding='utf-8-sig') as f:
    for line in f:
        p = line.replace(',', '.').split()
        parts.append([float(v) for v in p[:5]] + [p[5]])


def energy(p):
    return p[4] * (p[2] ** 2 + p[3] ** 2) / 2


clusters = [[], [], [], []]
for p in parts:
    k = 0
    for bound in [3.5, 7, 10.5]:
        if energy(p) > bound:
            k += 1
    clusters[k].append(p)


def center_energy(cluster):
    best, best_sum = cluster[0], float('inf')
    for c in cluster:
        total = 0.0
        for p in cluster:
            total += abs(energy(c) - energy(p))
        if total < best_sum:
            best, best_sum = c, total
    return best


"""

# 27-2.txt: three areas, everything else is an anomaly (subtopic 3).
AREAS = """clusters = [[], [], []]
for x, y in read_points('27-2.txt'):
    if -8 < x < 0 and 2 < y < 10:
        clusters[0].append((x, y))
    elif 1 < x < 10 and 2 < y < 10:
        clusters[1].append((x, y))
    elif -2 < x < 5 and -7 < y < 1:
        clusters[2].append((x, y))
clusters.sort(key=len)
centers = [center_sum(c) for c in clusters]

"""

SPLIT_1 = """left, right = [], []
for p in read_points('27-1.txt'):
    if p[0] < 6:
        left.append(p)
    else:
        right.append(p)

"""

# The lesson's groups of neighbours by a threshold (subtopic 7).
NEIGHBOURS = """def split_clusters(points, eps):
    remaining = points.copy()
    clusters = []
    while remaining:
        cluster = [remaining.pop()]
        pos = 0
        while pos < len(cluster):
            point = cluster[pos]
            rest = []
            for other in remaining:
                if dist(point, other) <= eps:
                    cluster.append(other)
                else:
                    rest.append(other)
            remaining = rest
            pos += 1
        clusters.append(cluster)
    return clusters


"""

# (page, number in the page) -> task definition; page 9 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 1),
        section="teorema-pifagora",
        title="Расстояние 3–4–5",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Разности координат — катеты прямоугольного треугольника.",
        code="""from math import dist

print(f'{dist((2, 1), (5, 5)):g}')""",
    ),
    dict(
        at=(1, 3),
        section="teorema-pifagora",
        title="Расстояние с отрицательными координатами",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Разность 5 − (−1) равна 6.",
        code="""from math import dist

print(f'{dist((-1, -2), (5, 6)):g}')""",
    ),
    dict(
        at=(1, 4),
        section="klaster-spisok",
        title="Кластеры как список списков",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="Индексы начинаются с нуля: clusters[1] — второй кластер.",
        code="""clusters = [[(0, 0), (1, 1)], [(5, 5), (6, 5), (7, 6)],
            [(10, 0)]]
print(len(clusters), len(clusters[1]), clusters[1][2][0])""",
    ),
    dict(
        at=(1, 8),
        section="celaya-chast-otveta",
        title="Расстояние в формате ответа",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Умножьте расстояние на 10 000 и отбросьте дробную часть.",
        code="""from math import dist

print(int(dist((-1.5, 2.25), (3.1, -0.4)) * 10000))""",
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 5),
        section="kod-zvezdy",
        title="Звёзды и белые карлики",
        difficulty=1,
        minutes=3,
        instruction="Введите два числа через пробел: количество звёзд и количество белых карликов.",
        hint="Код белого карлика — ровно VII, без спектрального класса.",
        files=[F3],
        code="""codes = []
with open('27-3.txt', encoding='utf-8-sig') as f:
    for line in f:
        codes.append(line.split()[2])
print(len(codes), codes.count('VII'))""",
    ),
    dict(
        at=(2, 6),
        section="kod-zvezdy",
        title="Красные гиганты",
        difficulty=1,
        minutes=3,
        instruction=NUMBER,
        hint="Класс — первый символ кода, светимость — всё после подкласса.",
        files=[F3],
        code="""count = 0
with open('27-3.txt', encoding='utf-8-sig') as f:
    for line in f:
        code = line.split()[2]
        if code[0] == 'M' and code[2:] == 'III':
            count += 1
print(count)""",
    ),
    dict(
        at=(2, 7),
        section="stroka-chasticy",
        title="Кинетическая энергия",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="E = m · (vx² + vy²) / 2.",
        code="""m, vx, vy = 2, -1, 3
print(f'{m * (vx ** 2 + vy ** 2) / 2:g}')""",
    ),
    dict(
        at=(2, 8),
        section="stroka-chasticy",
        title="Наибольшая энергия частицы",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Скорость — третий и четвёртый столбцы, масса — пятый.",
        files=[F4],
        code="""best = 0
with open('27-4.txt', encoding='utf-8-sig') as f:
    for line in f:
        p = line.replace(',', '.').split()
        vx, vy, m = float(p[2]), float(p[3]), float(p[4])
        best = max(best, m * (vx ** 2 + vy ** 2) / 2)
print(int(best * 10000))""",
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 5),
        section="razdelyayushchiy-priznak",
        title="Угол направления",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="atan2(y, x) — угол точки; % 360 убирает отрицательные углы.",
        code="""from math import atan2, degrees

print(f'{degrees(atan2(3, -3)) % 360:g}')""",
    ),
    dict(
        at=(3, 7),
        section="koordinatnye-granicy",
        title="Два кластера по границе x = 6",
        difficulty=2,
        minutes=5,
        instruction="Введите два числа через пробел: размер левого кластера, затем правого.",
        hint="По диаграмме рассеяния кластеры разделяет вертикальная прямая.",
        files=[F1],
        code=POINTS + SPLIT_1 + "print(len(left), len(right))",
    ),
    dict(
        at=(3, 8),
        section="tri-gruppy",
        title="Три кластера звёзд",
        difficulty=2,
        minutes=5,
        instruction=THREE,
        hint="Сначала горизонтальная граница отделяет нижний кластер, затем вертикальная делит верхние.",
        files=[F3],
        code=STARS + "print(*sorted(len(c) for c in clusters))",
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 8),
        section="programma-centra",
        title="Центр левого кластера",
        difficulty=2,
        minutes=6,
        instruction=SCALED,
        hint="Каждую точку кластера проверьте как кандидата в центр.",
        files=[F1],
        code=POINTS
        + SPLIT_1
        + """c = center_sum(left)
print(int(c[0] * 10000), int(c[1] * 10000))""",
    ),
    dict(
        at=(4, 9),
        section="formula-rasstoyaniya",
        title="Центр по энергиям",
        difficulty=3,
        minutes=7,
        instruction=NUMBER,
        hint="Расстояние между частицами здесь — модуль разности энергий.",
        files=[F4],
        code=PARTICLES + """print(int(energy(center_energy(clusters[0])) * 10000))""",
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="srednee-centrov",
        title="Средние координаты двух центров",
        difficulty=1,
        minutes=1,
        instruction=TWO,
        hint="Каждая координата усредняется отдельно.",
        code="""centers = [(-2, 4), (6, 10)]
px = sum(c[0] for c in centers) / len(centers)
py = sum(c[1] for c in centers) / len(centers)
print(f'{px:g} {py:g}')""",
    ),
    dict(
        at=(5, 2),
        section="minimalnye-koordinaty",
        title="Модули минимальных координат",
        difficulty=1,
        minutes=1,
        instruction=TWO,
        hint="Сначала минимум, потом модуль.",
        code="""centers = [(-5, 3), (2, -7), (4, 1)]
print(abs(min(c[0] for c in centers)),
      abs(min(c[1] for c in centers)))""",
    ),
    dict(
        at=(5, 3),
        section="isklyuchenie-klasterov",
        title="Среднее после исключения",
        difficulty=1,
        minutes=1,
        instruction="Введите два числа через пробел: делитель и среднее.",
        hint="Делят на число оставшихся кластеров.",
        code="""radii = [2, 3, 7]
print(len(radii), f'{sum(radii) / len(radii):g}')""",
    ),
    dict(
        at=(5, 5),
        section="srednee-centrov",
        title="Модуль среднего и среднее модулей",
        difficulty=1,
        minutes=2,
        instruction="Введите два числа через пробел: модуль среднего, затем среднее модулей.",
        hint="Порядок действий меняет ответ.",
        code="""xs = [-6, 2, 1]
mean_abs = sum(abs(x) for x in xs) / len(xs)
print(f'{abs(sum(xs) / len(xs)):g} {mean_abs:g}')""",
    ),
    dict(
        at=(5, 7),
        section="polnyy-primer",
        title="Средняя точка центров",
        difficulty=2,
        minutes=6,
        instruction=SCALED,
        hint="Центры двух кластеров, затем средние координаты.",
        files=[F1],
        code=POINTS
        + SPLIT_1
        + """c1, c2 = center_sum(left), center_sum(right)
px = (c1[0] + c2[0]) / 2
py = (c1[1] + c2[1]) / 2
print(int(px * 10000), int(py * 10000))""",
    ),
    dict(
        at=(5, 8),
        section="isklyuchenie-klasterov",
        title="Аномалии и исключение кластера",
        difficulty=3,
        minutes=8,
        instruction="Введите четыре целых числа через пробел: два для пункта а, затем два для пункта б.",
        hint="Аномалии не входят ни в одну область; без самого маленького кластера остаются два центра.",
        files=[F2],
        code=POINTS
        + AREAS
        + """min_x = abs(min(c[0] for c in centers))
min_y = abs(min(c[1] for c in centers))
mx = (centers[1][0] + centers[2][0]) / 2
my = (centers[1][1] + centers[2][1]) / 2
print(int(min_x * 10000), int(min_y * 10000),
      int(mx * 10000), int(my * 10000))""",
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 1),
        section="mezhklasternyy-diametr",
        title="Расстояния между кластерами",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Берите по одной точке из каждого кластера.",
        code="""from math import dist

first = [(0, 0), (1, 0)]
second = [(4, 0), (6, 0)]
d = [dist(a, b) for a in first for b in second]
print(f'{min(d):g} {max(d):g}')""",
    ),
    dict(
        at=(6, 4),
        section="tochki-okolo-centra",
        title="Точки около центра",
        difficulty=2,
        minutes=2,
        instruction=THREE,
        hint="«Не больше» включает границу; «остальные» — без самого центра.",
        code="""from math import dist

points = [(0, 0), (1, 0), (3, 0), (4, 0), (10, 0)]
c = (1, 0)
near = [p for p in points if dist(c, p) <= 3]
print(len(near), sum(dist(c, p) < 3 for p in points),
      len([p for p in near if p != c]))""",
    ),
    dict(
        at=(6, 7),
        section="blizhayshiy-obekt",
        title="Ближайший красный гигант",
        difficulty=3,
        minutes=8,
        instruction=SCALED,
        hint="Центр находят по всем звёздам кластера, а ближайшего ищут среди красных гигантов.",
        files=[F3],
        code=STARS
        + """small = min(clusters, key=len)
c = center_sum([(s[0], s[1]) for s in small])
giants = [s for s in small if is_kind(s[2], 'M', 'III')]
near = min(giants, key=lambda s: dist(c, (s[0], s[1])))
print(int(near[0] * 10000), int(near[1] * 10000))""",
    ),
    dict(
        at=(6, 8),
        section="diametr",
        title="Центры и жёлтые карлики",
        difficulty=3,
        minutes=8,
        instruction=SCALED,
        hint="B₂ — пары жёлтых карликов внутри одного кластера.",
        files=[F3],
        code=STARS
        + """giants = [sum(is_kind(s[2], 'M', 'III') for s in c)
          for c in clusters]
centers = [center_sum([(s[0], s[1]) for s in c])
           for c in clusters]
lo = giants.index(min(giants))
hi = giants.index(max(giants))
b1 = dist(centers[lo], centers[hi])
b2 = 0
for c in clusters:
    g = [(s[0], s[1]) for s in c if is_kind(s[2], 'G', 'V')]
    for i in range(len(g)):
        for j in range(i + 1, len(g)):
            b2 = max(b2, dist(g[i], g[j]))
print(int(b1 * 10000), int(b2 * 10000))""",
    ),
    dict(
        at=(6, 9),
        section="svoy-i-chuzhoy",
        title="Центры и радиус",
        difficulty=3,
        minutes=8,
        instruction=SCALED,
        hint="Q₂ — расстояния от центра только до точек своего кластера.",
        files=[F2],
        code=POINTS
        + AREAS
        + """q1 = dist(centers[0], centers[-1])
q2 = 0
for c, cluster in zip(centers, clusters):
    for p in cluster:
        q2 = max(q2, dist(c, p))
print(int(q1 * 10000), int(q2 * 10000))""",
    ),
    # ------------------------------------------------------------ subtopic 7
    dict(
        at=(7, 7),
        section="obosnovanie-poroga",
        title="Наибольший целый порог",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Порог подходит, пока группы остаются тремя секторами: 69, 76 и 83 точки.",
        files=[F5],
        code=POINTS
        + NEIGHBOURS
        + """points = read_points('27-5.txt')
best = 0
for eps in range(1, 8):
    sizes = sorted(len(c) for c in split_clusters(points, eps))
    if sizes == [69, 76, 83]:
        best = eps
print(best)""",
    ),
    dict(
        at=(7, 8),
        section="porog-v-primere",
        title="Центры двух дуг",
        difficulty=3,
        minutes=8,
        instruction=SCALED,
        hint="Дуги не разделить прямой, но промежуток между ними больше порога 0,5.",
        files=[F6],
        code=POINTS
        + NEIGHBOURS
        + """clusters = split_clusters(read_points('27-6.txt'), 0.5)
centers = [center_sum(c) for c in clusters]
px = sum(c[0] for c in centers) / len(centers)
py = sum(c[1] for c in centers) / len(centers)
print(int(px * 10000), int(py * 10000))""",
    ),
    # ------------------------------------------------------------ subtopic 8
    dict(
        at=(8, 6),
        section="samaya-dalyokaya-tochka",
        title="Радиус двух точек",
        difficulty=2,
        minutes=2,
        instruction="Введите два числа через пробел: радиус с центром в точке кластера, затем с центром в любой точке.",
        hint="Любой центр — середина отрезка.",
        code="""from math import dist

a, b = (0, 0), (6, 8)
print(f'{dist(a, b):g} {dist(a, b) / 2:g}')""",
    ),
    dict(
        at=(8, 7),
        section="samaya-dalyokaya-tochka",
        title="Средний радиус по минимаксу",
        difficulty=3,
        minutes=7,
        instruction=NUMBER,
        hint="Для каждого кандидата сначала самая далёкая точка, затем минимум по кандидатам.",
        files=[F1],
        code=POINTS
        + SPLIT_1
        + """radii = []
for cluster in (left, right):
    radius = min(max(dist(c, p) for p in cluster)
                 for c in cluster)
    radii.append(radius)
print(int(sum(radii) / 2 * 10000))""",
    ),
    dict(
        at=(8, 8),
        section="antipod",
        title="Антицентр маленького кластера",
        difficulty=3,
        minutes=7,
        instruction=NUMBER,
        hint="Антицентр — наибольшая сумма расстояний; в ответе модуль.",
        files=[F2],
        code=POINTS
        + AREAS
        + """small = clusters[0]
anti = max(small, key=lambda c: sum(dist(c, p) for p in small))
print(int(abs(anti[0] + anti[1]) * 10000))""",
    ),
    # ---------------------------------------------------- Практика и итог
    dict(
        at=(9, 1),
        title="Расстояние между центрами",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Граница x = 6, центры по сумме расстояний.",
        files=[F1],
        code=POINTS
        + SPLIT_1
        + """d = dist(center_sum(left), center_sum(right))
print(int(d * 10000))""",
    ),
    dict(
        at=(9, 2),
        title="Точки чужого кластера",
        difficulty=3,
        minutes=7,
        instruction=NUMBER,
        hint="Центр маленького кластера, а точки — из самого большого.",
        files=[F2],
        code=POINTS
        + AREAS
        + """far = max(dist(centers[0], p) for p in clusters[-1])
print(int(far * 10000))""",
    ),
    dict(
        at=(9, 3),
        title="Белые карлики большого кластера",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Сначала самый большой кластер, затем коды VII.",
        files=[F3],
        code=STARS
        + """big = max(clusters, key=len)
print(sum(s[2] == 'VII' for s in big))""",
    ),
    dict(
        at=(9, 4),
        title="Частицы признака II",
        difficulty=3,
        minutes=8,
        instruction=SCALED,
        hint="Q₁ — евклидово расстояние по координатам, Q₂ — энергия центра по энергиям.",
        files=[F4],
        code="""from math import dist

"""
        + PARTICLES
        + """q1 = 0
for c in clusters:
    two = [p for p in c if p[5] == 'II']
    for i in range(len(two)):
        for j in range(i + 1, len(two)):
            d = dist(two[i][:2], two[j][:2])
            q1 = max(q1, d)
q2 = max(energy(center_energy(c)) for c in clusters)
print(int(q1 * 10000), int(q2 * 10000))""",
    ),
    dict(
        at=(9, 5),
        title="Кластеры в секторах",
        difficulty=3,
        minutes=8,
        instruction=SCALED,
        hint="Угол направления из вершины C (2; −1); сектор начинается с угла start и имеет ширину 20°.",
        files=[F5],
        code=POINTS
        + """from math import atan2, degrees

clusters = [[], [], []]
for p in read_points('27-5.txt'):
    a = degrees(atan2(p[1] + 1, p[0] - 2)) % 360
    for k, start in enumerate([350, 110, 230]):
        if (a - start) % 360 <= 20:
            clusters[k].append(p)
centers = [center_sum(c) for c in clusters]
px = abs(sum(c[0] for c in centers) / 3)
py = abs(sum(c[1] for c in centers) / 3)
print(int(px * 10000), int(py * 10000))""",
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 27, TASKS, RETIRED))
