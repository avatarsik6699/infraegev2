"""Topic 26 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-26/bank.py          # check only
    python3 -I content/lesson-design/topic-26/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. The lesson
replaces the earlier «Обработка данных: сортировка и отбор» (same id and
route): ``--write`` also archives that lesson's tasks (``RETIRED``).
``apps/api/tests/test_task_26_bank.py`` recomputes every answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, TWO, main  # noqa: E402

RETIRED = frozenset(f"task-26-0{k}" for k in range(1, 8))

F1 = ("26-1.txt", "Результаты сессии: ID и четыре оценки")
F2 = ("26-2.txt", "Результаты викторины: ID и баллы за 10 вопросов")
F3 = ("26-3.txt", "Объём диска, количество и размеры файлов")
F4 = ("26-4.txt", "Цены и типы изделий")
F5 = ("26-5.txt", "Цены товаров")
F6 = ("26-6.txt", "Стороны коробок")
F7 = ("26-7.txt", "Пары чисел: груз и контейнер, заготовки A и B")
F8 = ("26-8.txt", "Занятые места: ряд и место")
F9 = ("26-9.txt", "Попадания частиц: ряд и позиция")
F10 = ("26-10.txt", "Заявки: начало и окончание в минутах")
F11 = ("26-11.txt", "Задачи: начало и окончание в секундах")
F12 = ("26-12.txt", "Камера хранения: ячейки и заявки")
F13 = ("26-13.txt", "Клиенты: приход, обслуживание, окно")
F14 = ("26-14.txt", "Журнал запросов к серверу")
F15 = ("26-15.txt", "Различные натуральные числа")
F16 = ("26-16.txt", "Высоты лагерей")
F17 = ("26-17.txt", "Коробки: сторона и материал")


def rows(name: str, header: int = 1) -> str:
    """The lesson's reading: header lines, then one record per line."""
    skip = "\n".join("    f.readline()" for _ in range(header))
    return (
        f"with open('{name}') as f:\n{skip}\n"
        "    data = [list(map(int, line.split())) for line in f]\n\n"
    )


def numbers(name: str) -> str:
    return f"with open('{name}') as f:\n    f.readline()\n    a = [int(line) for line in f]\n\n"


# The lesson's chain of boxes from the outside in (subtopic 3).
OUTSIDE_IN = """def chain(sizes, gap):
    sel = []
    for x in sorted(sizes, reverse=True):
        if not sel or sel[-1] - x >= gap:
            sel.append(x)
    return sel


"""

# The greedy choice of meetings by the earliest end (subtopic 5).
MEETINGS = """def greedy(meetings, pause):
    sel = []
    for s, f in sorted(meetings, key=lambda m: (m[1], m[0])):
        if not sel or s >= sel[-1][1] + pause:
            sel.append((s, f))
    return sel


"""

# Alternating materials with a growing gap, inside out (subtopic 8).
ALTERNATE = """def alternate(boxes, base_gap):
    best_count, best_outer = 0, None
    for first_type in (0, 1):
        expected, count, last = first_type, 0, None
        for size, material in sorted(boxes):
            if material != expected:
                continue
            if last is None or size - last >= base_gap + count:
                count += 1
                last = size
                expected = 1 - expected
        if count > best_count or (
            count == best_count and last is not None
            and (best_outer is None or last < best_outer)
        ):
            best_count, best_outer = count, last
    return best_count, best_outer


"""

# (page, number in the page) -> task definition; page 9 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 1),
        section="klyuch-reytinga",
        title="Порядок по трём полям",
        difficulty=1,
        minutes=2,
        instruction="Введите ID через пробел в порядке рейтинга.",
        hint="Минус в ключе даёт убывание: (−баллы, штраф, ID).",
        code="""records = [(12, 80, 5), (3, 90, 8), (7, 90, 4), (2, 90, 4)]
records.sort(key=lambda r: (-r[1], r[2], r[0]))
print(*[r[0] for r in records])""",
    ),
    dict(
        at=(1, 2),
        section="ogranicheniya-i-cel",
        title="Лучший вариант",
        difficulty=1,
        minutes=1,
        instruction="Введите два числа лучшего варианта через пробел.",
        hint="Кортежи сравниваются по первому числу, при равенстве — по второму.",
        code="""print(*max([(5, 40), (6, 12), (6, 15), (4, 100)]))""",
    ),
    dict(
        at=(1, 6),
        section="vychislyaemye-pokazateli",
        title="Сумма, положительные, ответы",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="Ответ дан, если балл не равен нулю.",
        code="""sc = [3, -2, 0, 5, -1, 0, 4]
positive = sum(x for x in sc if x > 0)
print(sum(sc), positive, sum(x != 0 for x in sc))""",
    ),
    dict(
        at=(1, 7),
        section="granica-prohoda",
        title="Первые 25 % и равные последнему",
        difficulty=2,
        minutes=2,
        instruction="Введите два числа через пробел: с добавкой, затем без неё.",
        hint="Сначала целая часть 25 % от 12, затем все с суммой последнего прошедшего.",
        code="""a = [90, 85, 80, 80, 80, 75, 70, 70, 65, 60, 55, 50]
k = len(a) * 25 // 100
last = a[k - 1]
print(sum(x >= last for x in a), k)""",
    ),
    dict(
        at=(1, 9),
        section="klyuch-reytinga",
        title="Повышенная стипендия",
        difficulty=2,
        minutes=6,
        instruction=TWO,
        hint="Ключ: (число двоек, −сумма у студентов без двоек, ID).",
        files=[F1],
        code=rows("26-1.txt")
        + """def key(r):
    twos = r[1:].count(2)
    if twos == 0:
        return (0, -sum(r[1:]), r[0])
    return (twos, 0, r[0])


data.sort(key=key)
k = len(data) * 15 // 100
last = data[k - 1]
same = 0
for r in data:
    if 2 not in r[1:] and sum(r[1:]) == sum(last[1:]):
        same += 1
print(last[0], same)""",
    ),
    dict(
        at=(1, 10),
        section="granica-prohoda",
        title="Финалисты викторины",
        difficulty=3,
        minutes=7,
        instruction=TWO,
        hint="После 20 % мест добавьте всех с теми же двумя показателями, что у последнего.",
        files=[F2],
        code=rows("26-2.txt")
        + """table = []
for r in data:
    answers = sum(x != 0 for x in r[1:])
    table.append((sum(r[1:]), answers, r[0]))
table.sort(key=lambda t: (-t[0], t[1], t[2]))
k = len(table) * 20 // 100
last = table[k - 1]
while k < len(table) and table[k][:2] == last[:2]:
    k += 1
print(k, table[k][2])""",
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 1),
        section="samyy-bolshoy-fayl",
        title="Вместимость 30",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Наберите самые маленькие, затем замените последний на наибольший помещающийся.",
        code="""a = sorted([5, 7, 8, 9, 12, 16])
capacity = 30
used = count = 0
for x in a:
    if used + x > capacity:
        break
    used += x
    count += 1
limit = capacity - (used - a[count - 1])
largest = max(x for x in a[count - 1:] if x <= limit)
print(count, largest)""",
    ),
    dict(
        at=(2, 2),
        section="samyy-bolshoy-fayl",
        title="Вместимость 10",
        difficulty=2,
        minutes=3,
        instruction=THREE,
        hint="Переберите все наборы из максимального количества файлов.",
        code="""from itertools import combinations

a = [4, 5, 6]
capacity = 10
k = max(r for r in range(len(a) + 1)
        if sum(sorted(a)[:r]) <= capacity)
sets = [c for c in combinations(a, k) if sum(c) <= capacity]
print(k, max(map(sum, sets)), max(map(max, sets)))""",
    ),
    dict(
        at=(2, 4),
        section="pokupka-partiyami",
        title="Партии A, затем B",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Внутри каждого типа партии берут от дешёвых, из партии — сколько хватает денег.",
        code="""money = 300
a = [(4, 25), (3, 40)]
b = [(6, 10), (5, 30)]
for batches in (a, b):
    bought = 0
    for count, price in sorted(batches, key=lambda p: p[1]):
        take = min(count, money // price)
        bought += take
        money -= take * price
print(bought, money)""",
    ),
    dict(
        at=(2, 5),
        section="dva-tipa",
        title="Больше всего, затем больше A",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="Количество находят по самым дешёвым; затем перебирают число изделий A.",
        code="""a = sorted([3, 8, 9])
b = sorted([2, 4, 7])
money = 20
total = 0
count = 0
for p in sorted(a + b):
    if total + p > money:
        break
    total += p
    count += 1
best = None
for ca in range(count + 1):
    cb = count - ca
    if ca <= len(a) and cb <= len(b):
        spent = sum(a[:ca]) + sum(b[:cb])
        if spent <= money:
            best = (ca, money - spent)
print(*best)""",
    ),
    dict(
        at=(2, 6),
        section="skidki",
        title="Тройки с бесплатным товаром",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="По убыванию цен: бесплатный самый дешёвый — каждый третий; самый дорогой — первые n // 3.",
        code="""p = sorted([120, 45, 300, 80, 60, 95, 210, 150],
           reverse=True)
print(sum(p) - sum(p[2::3]), sum(p) - sum(p[:len(p) // 3]))""",
    ),
    dict(
        at=(2, 7),
        section="skidki",
        title="Каждый второй дороже 100",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Скидку получают самые дешёвые из дорогих товаров — их половина.",
        code="""prices = [120, 45, 300, 80, 60, 95, 210, 150]
big = sorted(p for p in prices if p > 100)
disc = big[:len(big) // 2]
rest = sum(prices) - sum(disc)
print(rest + (4 * sum(disc) + 4) // 5, max(disc))""",
    ),
    dict(
        at=(2, 8),
        section="samyy-bolshoy-fayl",
        title="Архив на диске",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Закрепите все файлы, кроме последнего, и найдите наибольший, который поместится вместо него.",
        files=[F3],
        code="""with open('26-3.txt') as f:
    capacity, n = map(int, f.readline().split())
    a = sorted(int(line) for line in f)

used = count = 0
for x in a:
    if used + x > capacity:
        break
    used += x
    count += 1
limit = capacity - (used - a[count - 1])
largest = max(x for x in a[count - 1:] if x <= limit)
print(count, largest)""",
    ),
    dict(
        at=(2, 9),
        section="dva-tipa",
        title="Изделия A и B",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Количество — по самым дешёвым; затем перебор числа A с накопленными суммами.",
        files=[F4],
        code="""with open('26-4.txt') as f:
    n, money = map(int, f.readline().split())
    items = [line.split() for line in f]

a = sorted(int(p) for p, t in items if t == 'A')
b = sorted(int(p) for p, t in items if t == 'B')
spent = count = 0
for p in sorted(a + b):
    if spent + p > money:
        break
    spent += p
    count += 1
pa, pb = [0], [0]
for p in a:
    pa.append(pa[-1] + p)
for p in b:
    pb.append(pb[-1] + p)
best = None
for ca in range(count + 1):
    cb = count - ca
    if ca < len(pa) and cb < len(pb):
        if pa[ca] + pb[cb] <= money:
            best = (ca, money - pa[ca] - pb[cb])
print(*best)""",
    ),
    dict(
        at=(2, 10),
        section="skidki",
        title="Самый дешёвый в тройке бесплатно",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="По убыванию цен бесплатен каждый третий товар.",
        files=[F5],
        code=numbers("26-5.txt")
        + """a.sort(reverse=True)
free = a[2::3]
print(sum(a) - sum(free), free[0])""",
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 1),
        section="cepochka-snaruzhi",
        title="Цепочка с зазором 6",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Снаружи внутрь: в каждую коробку — самую большую подходящую.",
        code=OUTSIDE_IN
        + """sel = chain([10, 16, 21, 27, 34, 40], 6)
print(len(sel), sel[-1])""",
    ),
    dict(
        at=(3, 2),
        section="napravlenie-postroeniya",
        title="Изнутри наружу",
        difficulty=2,
        minutes=2,
        instruction=TWO,
        hint="Для наименьшей внешней коробки цепочку строят от самой маленькой.",
        code="""sel = []
for x in sorted([10, 16, 21, 27, 34, 40]):
    if not sel or x - sel[-1] >= 6:
        sel.append(x)
print(len(sel), sel[-1])""",
    ),
    dict(
        at=(3, 4),
        section="dva-ukazatelya",
        title="Рейсы по двое",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="Самый тяжёлый едет с самым лёгким, если они помещаются, иначе — один.",
        code="""a = sorted([40, 55, 70, 85, 90])
left, right = 0, len(a) - 1
trips = 0
while left <= right:
    if left < right and a[left] + a[right] <= 130:
        left += 1
    right -= 1
    trips += 1
print(trips)""",
    ),
    dict(
        at=(3, 6),
        section="gruzy-i-konteynery",
        title="Грузы в контейнеры",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Самый лёгкий груз — в самый маленький подходящий контейнер; затем замените последний груз.",
        code="""g = sorted([12, 18, 25, 27])
c = sorted([15, 20, 28, 10])
used = [False] * len(c)
j = count = 0
for x in g:
    while j < len(c) and c[j] < x:
        j += 1
    if j == len(c):
        break
    used[j] = True
    count += 1
    j += 1
used[max(i for i in range(len(c)) if used[i])] = False
room = max(c[i] for i in range(len(c)) if not used[i])
print(count, max(x for x in g[count - 1:] if x <= room))""",
    ),
    dict(
        at=(3, 7),
        section="detali-dvuh-vidov",
        title="Детали A и B",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="По убыванию: больший из двух несовместимых пропускается.",
        code="""a = sorted([31, 44, 52, 60], reverse=True)
b = sorted([35, 47, 49, 70], reverse=True)
i = j = count = profit = 0
while i < len(a) and j < len(b):
    if a[i] > b[j] + 4:
        i += 1
    elif b[j] > a[i] + 4:
        j += 1
    else:
        count += 1
        profit += a[i] + b[j]
        i += 1
        j += 1
print(count, profit)""",
    ),
    dict(
        at=(3, 8),
        section="cepochka-snaruzhi",
        title="Матрёшка с зазором 7",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="Снаружи внутрь: самая большая подходящая коробка на каждой глубине.",
        files=[F6],
        code=numbers("26-6.txt")
        + OUTSIDE_IN
        + """sel = chain(a, 7)
print(len(sel), sel[-1])""",
    ),
    dict(
        at=(3, 9),
        section="gruzy-i-konteynery",
        title="Грузы и контейнеры из файла",
        difficulty=3,
        minutes=7,
        instruction=TWO,
        hint="Грузы и контейнеры сортируются отдельно; последний груз — наибольший, помещающийся в оставшийся контейнер.",
        files=[F7],
        code=rows("26-7.txt")
        + """g = sorted(r[0] for r in data)
c = sorted(r[1] for r in data)
used = [False] * len(c)
j = count = 0
for x in g:
    while j < len(c) and c[j] < x:
        j += 1
    if j == len(c):
        break
    count += 1
    j += 1
j = 0
for x in g[:count - 1]:
    while c[j] < x:
        j += 1
    used[j] = True
    j += 1
room = max(c[i] for i in range(len(c)) if not used[i])
print(count, max(x for x in g[count - 1:] if x <= room))""",
    ),
    dict(
        at=(3, 10),
        section="detali-dvuh-vidov",
        title="Заготовки A и B",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Два указателя по спискам, отсортированным по убыванию.",
        files=[F7],
        code=rows("26-7.txt")
        + """a = sorted((r[0] for r in data), reverse=True)
b = sorted((r[1] for r in data), reverse=True)
i = j = count = profit = 0
while i < len(a) and j < len(b):
    if a[i] > b[j] + 15:
        i += 1
    elif b[j] > a[i] + 15:
        j += 1
    else:
        count += 1
        profit += a[i] + b[j]
        i += 1
        j += 1
print(count, profit)""",
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 1),
        section="svobodnye-mesta",
        title="Два свободных места",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Между занятыми x и y ровно два свободных, если y − x − 1 == 2.",
        code="""taken = [(5, 10), (5, 13), (8, 20), (8, 23), (8, 30),
         (8, 33)]
rows = {}
for r, s in taken:
    rows.setdefault(r, []).append(s)
found = None
for r in sorted(rows, reverse=True):
    s = sorted(rows[r])
    for x, y in zip(s, s[1:]):
        if y - x - 1 == 2:
            found = (r, x + 1)
            break
    if found:
        break
print(*found)""",
    ),
    dict(
        at=(4, 2),
        section="serii",
        title="Серии позиций",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Серия продолжается, если позиция на 1 больше предыдущей; последнюю серию учтите после цикла.",
        code="""p = [1, 2, 3, 7, 8, 9, 10, 15, 16]
runs = []
current = 1
for i in range(1, len(p)):
    if p[i] == p[i - 1] + 1:
        current += 1
    else:
        runs.append(current)
        current = 1
runs.append(current)
print(max(runs), sum(r >= 3 for r in runs))""",
    ),
    dict(
        at=(4, 4),
        section="liniya-s-promezhutkom",
        title="Линия с тёмными точками",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Линия обрывается, если между соседними светлыми больше двух тёмных.",
        code="""p = [1, 2, 5, 6, 7, 11, 12]
start = p[0]
best = 0
for i in range(len(p)):
    if i > 0 and p[i] - p[i - 1] - 1 > 2:
        start = p[i]
    best = max(best, p[i] - start + 1)
print(best)""",
    ),
    dict(
        at=(4, 5),
        section="izolirovannaya-tochka",
        title="Изолированные точки",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Достаточно ближайших соседей слева и справа.",
        code="""p = [1, 6, 8, 15, 30, 33]
count = 0
for i in range(len(p)):
    left = i == 0 or p[i] - p[i - 1] > 3
    right = i == len(p) - 1 or p[i + 1] - p[i] > 3
    if left and right:
        count += 1
print(count)""",
    ),
    dict(
        at=(4, 6),
        section="stolbcy",
        title="Кресло номер 5",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Добавьте условные занятые ряды 0 и 11; лучшее место — перед следующим занятым.",
        code="""taken = [3, 7]
best = None
prev = 0
for o in taken + [11]:
    if o - prev >= 2:
        cand = (o - prev - 2, -(o - 1))
        if best is None or cand > best:
            best = cand
    prev = o
print(-best[1], best[0])""",
    ),
    dict(
        at=(4, 8),
        section="svobodnye-mesta",
        title="Четыре свободных места",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Ровно четыре свободных между занятыми: y − x − 1 == 4.",
        files=[F8],
        code=rows("26-8.txt")
        + """seats = {}
for r, s in data:
    seats.setdefault(r, set()).add(s)
found = None
for r in sorted(seats, reverse=True):
    s = sorted(seats[r])
    for x, y in zip(s, s[1:]):
        if y - x - 1 == 4:
            found = (r, x + 1)
            break
    if found:
        break
print(*found)""",
    ),
    dict(
        at=(4, 9),
        section="serii",
        title="Линии на экране",
        difficulty=2,
        minutes=6,
        instruction=TWO,
        hint="Позиции ряда — множество; серии считают по отсортированным позициям, последнюю — после цикла.",
        files=[F9],
        code=rows("26-9.txt")
        + """screen = {}
for r, p in data:
    screen.setdefault(r, set()).add(p)
best = (0, 0)
for r, ps in screen.items():
    p = sorted(ps)
    lines = 0
    current = 1
    for i in range(1, len(p) + 1):
        if i < len(p) and p[i] == p[i - 1] + 1:
            current += 1
        else:
            if current >= 3:
                lines += 1
            current = 1
    best = max(best, (lines, r))
print(*best)""",
    ),
    dict(
        at=(4, 10),
        section="izolirovannaya-tochka",
        title="Изолированные точки экрана",
        difficulty=2,
        minutes=6,
        instruction=TWO,
        hint="При равном количестве нужен наименьший номер ряда — сравнивайте (количество, −ряд).",
        files=[F9],
        code=rows("26-9.txt")
        + """screen = {}
for r, p in data:
    screen.setdefault(r, set()).add(p)
best = None
for r, ps in screen.items():
    p = sorted(ps)
    count = 0
    for i in range(len(p)):
        left = i == 0 or p[i] - p[i - 1] > 4
        right = i == len(p) - 1 or p[i + 1] - p[i] > 4
        if left and right:
            count += 1
    if best is None or (count, -r) > best:
        best = (count, -r)
print(best[0], -best[1])""",
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="vtoroy-kriteriy",
        title="Перерыв между последними",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Последнее мероприятие — с самым поздним началом после окончания предпоследнего.",
        code=MEETINGS
        + """m = [(1, 3), (2, 6), (3, 5), (5, 8), (9, 15), (12, 16)]
sel = greedy(m, 0)
end = sel[-2][1]
print(len(sel), max(s for s, f in m if s >= end) - end)""",
    ),
    dict(
        at=(5, 2),
        section="kontrprimery",
        title="Раннее начало проигрывает",
        difficulty=1,
        minutes=2,
        instruction="Введите два числа через пробел: максимальное количество, затем результат правила раннего начала.",
        hint="Правило раннего начала сразу берёт (0, 20).",
        code=MEETINGS
        + """m = [(0, 20), (1, 3), (3, 5), (5, 7)]
by_start = []
for s, f in sorted(m):
    if not by_start or s >= by_start[-1][1]:
        by_start.append((s, f))
print(len(greedy(m, 0)), len(by_start))""",
    ),
    dict(
        at=(5, 3),
        section="vtoroy-kriteriy",
        title="Перерыв не меньше 1",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Следующее начинается не раньше окончания предыдущего плюс 1.",
        code=MEETINGS
        + """m = [(1, 3), (2, 6), (3, 5), (5, 8), (9, 15), (12, 16)]
sel = greedy(m, 1)
end = sel[-2][1]
last = max(s for s, f in m if s >= end + 1)
print(len(sel), last - end)""",
    ),
    dict(
        at=(5, 4),
        section="vtoroy-kriteriy",
        title="Собрания с длительностью",
        difficulty=2,
        minutes=4,
        instruction=THREE,
        hint="Переведите (начало, длительность) в (начало, окончание).",
        code=MEETINGS
        + """m = [(s, s + d) for s, d in
     [(1, 4), (5, 2), (6, 5), (8, 3), (12, 2)]]
sel = greedy(m, 0)
end = sel[-2][1]
after = [(s, f) for s, f in m if s >= end]
pause = max(s for s, f in after) - end
print(len(sel), pause, max(f for s, f in after))""",
    ),
    dict(
        at=(5, 5),
        section="obedinenie-intervalov",
        title="Работа и простои сервера",
        difficulty=2,
        minutes=3,
        instruction=THREE,
        hint="Объедините пересекающиеся интервалы, затем пройдите от 0 до 24.",
        code="""work = sorted([(2, 6), (4, 9), (10, 12), (11, 15), (20, 22)])
merged = []
for s, f in work:
    if merged and s <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], f)
    else:
        merged.append([s, f])
busy = sum(f - s for s, f in merged)
cursor = count = idle = 0
for s, f in merged + [[24, 24]]:
    if s > cursor:
        count += 1
        idle += s - cursor
    cursor = f
print(busy, count, idle)""",
    ),
    dict(
        at=(5, 6),
        section="sobytiya",
        title="Одновременные запросы",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="События +1 в начале и −1 в окончании; длительность — до следующего события.",
        code="""req = [(1, 6), (2, 4), (4, 8), (5, 9)]
changes = {}
for s, f in req:
    changes[s] = changes.get(s, 0) + 1
    changes[f] = changes.get(f, 0) - 1
times = sorted(changes)
cur = top = total = 0
for i in range(len(times) - 1):
    cur += changes[times[i]]
    d = times[i + 1] - times[i]
    if cur > top:
        top, total = cur, d
    elif cur == top:
        total += d
print(top, total)""",
    ),
    dict(
        at=(5, 8),
        section="vtoroy-kriteriy",
        title="Зал с перерывом 10 минут",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Жадный выбор по окончанию, затем самое позднее начало последнего.",
        files=[F10],
        code=rows("26-10.txt")
        + MEETINGS
        + """sel = greedy(data, 10)
end = sel[-2][1]
last = max(s for s, f in data if s >= end + 10)
print(len(sel), last - end)""",
    ),
    dict(
        at=(5, 9),
        section="obedinenie-intervalov",
        title="Простои за сутки",
        difficulty=2,
        minutes=6,
        instruction=TWO,
        hint="Концы включены: касающиеся интервалы сливаются; простои до первой и после последней задачи тоже считаются.",
        files=[F11],
        code=rows("26-11.txt")
        + """merged = []
for s, f in sorted(data):
    if merged and s <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], f)
    else:
        merged.append([s, f])
cursor = count = idle = 0
for s, f in merged + [[86400, 86400]]:
    if s > cursor:
        count += 1
        idle += s - cursor
    cursor = f
print(count, idle)""",
    ),
    dict(
        at=(5, 10),
        section="sobytiya",
        title="Наибольшая нагрузка",
        difficulty=2,
        minutes=6,
        instruction=TWO,
        hint="Изменения в одну секунду складываются в словаре.",
        files=[F11],
        code=rows("26-11.txt")
        + """changes = {}
for s, f in data:
    changes[s] = changes.get(s, 0) + 1
    changes[f] = changes.get(f, 0) - 1
times = sorted(changes)
cur = top = total = 0
for i in range(len(times) - 1):
    cur += changes[times[i]]
    d = times[i + 1] - times[i]
    if cur > top:
        top, total = cur, d
    elif cur == top:
        total += d
print(top, total)""",
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 1),
        section="kamera-hraneniya",
        title="Ячейка со следующей минуты",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Ячейка свободна, если она освободилась строго раньше прихода.",
        code="""requests = [(1, 5), (2, 4), (3, 7), (4, 8), (5, 6)]
free_at = [0, 0]
accepted = last = 0
for start, end in sorted(requests):
    for i in range(len(free_at)):
        if free_at[i] < start:
            free_at[i] = end
            accepted += 1
            last = i + 1
            break
print(accepted, last)""",
    ),
    dict(
        at=(6, 2),
        section="kamera-hraneniya",
        title="Три ячейки",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Ячейку можно занять сразу после освобождения: free_at <= start.",
        code="""requests = [(0, 10), (2, 6), (4, 9), (6, 12), (9, 11),
            (10, 15)]
free_at = [0, 0, 0]
accepted = last = 0
for start, end in sorted(requests):
    for i in range(len(free_at)):
        if free_at[i] <= start:
            free_at[i] = end
            accepted += 1
            last = i + 1
            break
print(accepted, last)""",
    ),
    dict(
        at=(6, 3),
        section="ochered",
        title="Ожидание не больше 2 минут",
        difficulty=2,
        minutes=3,
        instruction="Введите два числа через пробел: обслуженных, затем ушедших.",
        hint="Ушедший клиент не меняет время освобождения окна.",
        code="""clients = [(0, 5), (2, 3), (4, 4), (12, 2)]
free = served = gone = 0
for arrive, d in clients:
    start = max(arrive, free)
    if start - arrive > 2:
        gone += 1
        continue
    free = start + d
    served += 1
print(served, gone)""",
    ),
    dict(
        at=(6, 4),
        section="ochered",
        title="Ожидание каждого клиента",
        difficulty=1,
        minutes=2,
        instruction="Введите время ожидания клиентов через пробел в порядке прихода.",
        hint="Обслуживание начинается в max(приход, освобождение окна).",
        code="""clients = [(0, 5), (2, 3), (4, 4), (12, 2)]
free = 0
waits = []
for arrive, d in clients:
    start = max(arrive, free)
    waits.append(start - arrive)
    free = start + d
print(*waits)""",
    ),
    dict(
        at=(6, 6),
        section="zadannaya-procedura",
        title="Первый подходящий контейнер",
        difficulty=1,
        minutes=2,
        instruction="Введите два числа через пробел: количество размещённых деталей и отложенную деталь.",
        hint="Процедуру выполняют буквально, по номерам контейнеров.",
        code="""room = [10, 6, 8]
placed = 0
left = []
for part in [6, 9, 3, 5, 4]:
    for i in range(len(room)):
        if room[i] >= part:
            room[i] -= part
            placed += 1
            break
    else:
        left.append(part)
print(placed, *left)""",
    ),
    dict(
        at=(6, 8),
        section="kamera-hraneniya",
        title="Камера хранения из файла",
        difficulty=2,
        minutes=6,
        instruction=TWO,
        hint="Строгое free_at[i] < start: ячейку занимают со следующей минуты.",
        files=[F12],
        code="""with open('26-12.txt') as f:
    k = int(f.readline())
    f.readline()
    data = [list(map(int, line.split())) for line in f]

free_at = [0] * k
accepted = last = 0
for start, end in sorted(data, key=lambda r: r[0]):
    for i in range(k):
        if free_at[i] < start:
            free_at[i] = end
            accepted += 1
            last = i + 1
            break
print(accepted, last)""",
    ),
    dict(
        at=(6, 9),
        section="ochered",
        title="Три окна",
        difficulty=2,
        minutes=6,
        instruction=TWO,
        hint="У каждого окна своё время освобождения; ушедший его не меняет.",
        files=[F13],
        code=rows("26-13.txt")
        + """free = {1: 0, 2: 0, 3: 0}
served = {1: 0, 2: 0, 3: 0}
gone = 0
for arrive, d, w in sorted(data):
    start = max(arrive, free[w])
    if start - arrive > 15:
        gone += 1
        continue
    free[w] = start + d
    served[w] += 1
print(max(served.values()), gone)""",
    ),
    dict(
        at=(6, 10),
        section="zhurnaly-i-kopii",
        title="Журнал сервера",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Записи сортируют по времени; копия создаётся до добавления запроса.",
        files=[F14],
        code="""with open('26-14.txt') as f:
    n, k = map(int, f.readline().split())
    log = []
    for line in f:
        t, c, v = line.split()
        h, m, s = map(int, t.split(':'))
        log.append((h * 3600 + m * 60 + s, int(c), int(v)))

log.sort()
total = {}
for t, c, v in log:
    total[c] = total.get(c, 0) + v
best = max(total, key=lambda c: (total[c], -c))
used = 0
copies = []
for t, c, v in log:
    if used + v > k:
        if t < 12 * 3600:
            copies.append(used)
        used = 0
    used += v
copies.sort()
print(best, copies[-1] + copies[-2])""",
    ),
    # ------------------------------------------------------------ subtopic 7
    dict(
        at=(7, 1),
        section="podschyot-i-razbienie",
        title="Пары с суммой не больше 14",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="Если a[left] + a[right] подходит, с a[left] подходят все элементы до right.",
        code="""a = sorted([2, 5, 7, 9, 12])
left, right = 0, len(a) - 1
count = 0
while left < right:
    if a[left] + a[right] <= 14:
        count += right - left
        left += 1
    else:
        right -= 1
print(count)""",
    ),
    dict(
        at=(7, 2),
        section="perebor-par",
        title="Среднее чётных есть среди чисел",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Перебор пар; среднее проверяют по множеству.",
        code="""a = [2, 4, 6, 9, 10, 14]
values = set(a)
count = best = 0
for i in range(len(a)):
    for j in range(i + 1, len(a)):
        x, y = a[i], a[j]
        if x % 2 == 0 and y % 2 == 0:
            if (x + y) // 2 in values:
                count += 1
                best = max(best, (x + y) // 2)
print(count, best)""",
    ),
    dict(
        at=(7, 3),
        section="perebor-par",
        title="Сумма разной чётности",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Чётное плюс нечётное; сумму ищут во множестве.",
        code="""a = [3, 5, 8, 13, 21]
values = set(a)
even = [x for x in a if x % 2 == 0]
odd = [x for x in a if x % 2]
print(sum(x + y in values for x in even for y in odd))""",
    ),
    dict(
        at=(7, 4),
        section="skolzyashchee-okno",
        title="Разность не больше 4",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="После сортировки выбранные числа — непрерывный участок.",
        code="""a = sorted([5, 1, 9, 12, 2, 7, 13])
left = best = 0
for right in range(len(a)):
    while a[right] - a[left] > 4:
        left += 1
    best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(7, 5),
        section="osobye-perehody",
        title="Маршрут с двумя специальными",
        difficulty=3,
        minutes=4,
        instruction=TWO,
        hint="Окно по убывающим высотам: специальных переходов внутри не больше двух.",
        code="""h = sorted(set([30, 28, 23, 21, 17, 15, 9, 8]),
           reverse=True)
left = used = 0
best = (0, 0)
for right in range(len(h)):
    if right:
        gap = h[right - 1] - h[right]
        if gap > 6:
            left, used = right, 0
        elif gap > 3:
            used += 1
    while used > 2:
        if h[left] - h[left + 1] > 3:
            used -= 1
        left += 1
    best = max(best, (right - left + 1, h[right]))
print(*best)""",
    ),
    dict(
        at=(7, 7),
        section="perebor-par",
        title="Пары разной чётности в файле",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Перебор пар «чётное + нечётное» с проверкой суммы по множеству.",
        files=[F15],
        code=numbers("26-15.txt")
        + """values = set(a)
even = [x for x in a if x % 2 == 0]
odd = [x for x in a if x % 2]
count = best = 0
for x in even:
    for y in odd:
        if x + y in values:
            count += 1
            best = max(best, x + y)
print(count, best)""",
    ),
    dict(
        at=(7, 8),
        section="osobye-perehody",
        title="Маршрут альпиниста",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Окно по отсортированным различным высотам; переход больше 100 разрывает маршрут.",
        files=[F16],
        code=numbers("26-16.txt")
        + """h = sorted(set(a), reverse=True)
left = used = 0
best = (0, 0)
for right in range(len(h)):
    if right:
        gap = h[right - 1] - h[right]
        if gap > 100:
            left, used = right, 0
        elif gap > 60:
            used += 1
    while used > 5:
        if h[left] - h[left + 1] > 60:
            used -= 1
        left += 1
    best = max(best, (right - left + 1, h[right]))
print(*best)""",
    ),
    # ------------------------------------------------------------ subtopic 8
    dict(
        at=(8, 1),
        section="chereduyushchiesya-cveta",
        title="Чередование цветов",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="Два жадных прохода снаружи внутрь — по цвету внешней коробки.",
        code="""boxes = [(40, 0), (37, 1), (33, 1), (31, 0), (26, 0),
         (24, 1), (20, 0), (18, 1), (12, 1)]
best = (0, 0)
for first in (0, 1):
    need, count, last = first, 0, None
    for size, color in sorted(boxes, reverse=True):
        if color != need:
            continue
        if last is None or last - size >= 4:
            count += 1
            last = size
            need = 1 - need
    best = max(best, (count, last))
print(*best)""",
    ),
    dict(
        at=(8, 2),
        section="rastushchiy-zazor",
        title="Растущий зазор при C = 1",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Два прохода изнутри наружу; перед новой коробкой нужен зазор C + count.",
        code=ALTERNATE
        + """boxes = [(10, 0), (11, 1), (13, 1), (14, 0), (17, 0),
         (18, 1), (22, 1), (23, 0), (27, 0), (28, 1),
         (33, 1)]
print(*alternate(boxes, 1))""",
    ),
    dict(
        at=(8, 3),
        section="naimenshee-chislo-blokov",
        title="Сколько блоков",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="Блоков столько, сколько коробок попарно отличаются меньше чем на зазор.",
        code="""a = sorted([3, 5, 6, 9, 11, 12, 13, 17])
left = best = 0
for right in range(len(a)):
    while a[right] - a[left] >= 4:
        left += 1
    best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(8, 5),
        section="bloki-s-cherodovaniem",
        title="Блоки с чередованием, зазор 4",
        difficulty=3,
        minutes=3,
        instruction=NUMBER,
        hint="Каждую коробку кладут на блок другого цвета с самым большим подходящим верхом.",
        code="""boxes = [(5, 0), (6, 1), (10, 0), (12, 0), (13, 1),
         (17, 1), (18, 0)]
gap = 4
tops = {0: [], 1: []}
blocks = 0
for size, color in sorted(boxes):
    other = tops[1 - color]
    fitting = [t for t in other if t <= size - gap]
    if fitting:
        other.remove(max(fitting))
    else:
        blocks += 1
    tops[color].append(size)
print(blocks)""",
    ),
    dict(
        at=(8, 6),
        section="luchshiy-nabor",
        title="Лучший набор при вместимости 33",
        difficulty=3,
        minutes=4,
        instruction="Введите размеры файлов набора через пробел по возрастанию.",
        hint="Замены сверху вниз: каждый раз наибольший файл, который помещается.",
        code="""sizes = sorted([5, 7, 8, 9, 12, 16])
capacity = 33
used = k = 0
for x in sizes:
    if used + x > capacity:
        break
    used += x
    k += 1
chosen = list(range(k))
free = capacity - used
upper = len(sizes)
for j in range(k - 1, -1, -1):
    best = chosen[j]
    for i in range(chosen[j] + 1, upper):
        if sizes[i] - sizes[chosen[j]] <= free:
            best = i
    free -= sizes[best] - sizes[chosen[j]]
    chosen[j] = best
    upper = best
print(*[sizes[i] for i in chosen])""",
    ),
    dict(
        at=(8, 7),
        section="naimenshee-chislo-blokov",
        title="Ячейки склада",
        difficulty=3,
        minutes=6,
        instruction=TWO,
        hint="Число ячеек — окно короче зазора; самый длинный блок — цепочка снаружи внутрь.",
        files=[F6],
        code=numbers("26-6.txt")
        + OUTSIDE_IN
        + """a.sort()
left = cells = 0
for right in range(len(a)):
    while a[right] - a[left] >= 7:
        left += 1
    cells = max(cells, right - left + 1)
print(cells, len(chain(a, 7)))""",
    ),
    dict(
        at=(8, 8),
        section="rastushchiy-zazor",
        title="Материалы и зазор K + 500",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Два прохода изнутри наружу по материалу первой коробки.",
        files=[F17],
        code=rows("26-17.txt") + ALTERNATE + """print(*alternate(data, 500))""",
    ),
    # ---------------------------------------------------- Практика и итог
    dict(
        at=(9, 1),
        title="Свободные кресла перед местом",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Словарь «номер места → занятые ряды» и условные занятые ряды 0 и M + 1.",
        files=[F8],
        code="""with open('26-8.txt') as f:
    n, m, k = map(int, f.readline().split())
    data = [list(map(int, line.split())) for line in f]

col = {}
for r, s in data:
    col.setdefault(s, set()).add(r)
best = None
for s in range(1, k + 1):
    prev = 0
    for o in sorted(col.get(s, set())) + [m + 1]:
        if o - prev >= 2:
            cand = (o - prev - 2, -(o - 1))
            if best is None or cand > best:
                best = cand
        prev = o
print(-best[1], best[0])""",
    ),
    dict(
        at=(9, 2),
        title="Самое позднее окончание",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Жадный выбор по окончанию; последнее — с самым поздним окончанием.",
        files=[F10],
        code=rows("26-10.txt")
        + MEETINGS
        + """sel = greedy(data, 0)
end = sel[-2][1]
print(len(sel), max(f for s, f in data if s >= end))""",
    ),
    dict(
        at=(9, 3),
        title="Скидка на каждый второй",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Скидку получает дешёвая половина товаров дороже 1000; округляется только итог.",
        files=[F5],
        code=numbers("26-5.txt")
        + """big = sorted(p for p in a if p > 1000)
disc = big[:len(big) // 2]
rest = sum(a) - sum(disc)
print(rest + (4 * sum(disc) + 4) // 5, max(disc))""",
    ),
    dict(
        at=(9, 4),
        title="Матрёшка изнутри наружу",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="Для наименьшей внешней коробки цепочку строят от самой маленькой.",
        files=[F6],
        code=numbers("26-6.txt")
        + """sel = []
for x in sorted(a):
    if not sel or x - sel[-1] >= 10:
        sel.append(x)
print(len(sel), sel[-1])""",
    ),
    dict(
        at=(9, 5),
        title="Контейнеры по 250",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Процедура буквально: break при неудаче нельзя — следующие грузы легче.",
        files=[F3],
        code=numbers("26-3.txt")
        + """rest = sorted(a, reverse=True)
loads = []
while rest:
    left, load = [], 0
    for w in rest:
        if load + w <= 250:
            load += w
        else:
            left.append(w)
    loads.append(load)
    rest = left
print(len(loads), loads[-2])""",
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 26, TASKS, RETIRED))
