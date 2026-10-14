"""Topic 17 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-17/bank.py          # check only
    python3 -I content/lesson-design/topic-17/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. The lesson
replaces the earlier «Числовые последовательности» (same id and route):
``--write`` also archives that lesson's tasks (``RETIRED``); no catalog task
links its sections. ``apps/api/tests/test_task_17_bank.py`` recomputes every
answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, TWO, main  # noqa: E402

RETIRED = frozenset(f"task-17-{number:02d}" for number in range(1, 9))
F1 = [("17-1.txt", "Последовательность целых чисел от −10 000 до 10 000")]
F2 = [("17-2.txt", "Последовательность натуральных чисел, не превышающих 100 000")]
F3 = [("17-3.txt", "Последовательность целых чисел от −100 000 до 100 000")]
F4 = [("17-4.txt", "Последовательность натуральных чисел, не превышающих 100 000")]
F5 = [("17-5.txt", "Последовательность натуральных чисел")]
F6 = [("17-6.txt", "Последовательность натуральных чисел, не превышающих 10 000")]


def load(name: str) -> str:
    return f'with open("{name}") as f:\n    a = [int(part) for part in f.read().split()]\n\n'


# (page, number in the page) -> task definition; page 9 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 5),
        section="summa-i-proizvedenie",
        title="Сумма квадратов и квадрат суммы",
        difficulty=1,
        minutes=1,
        instruction=TWO,
        hint="Сумма квадратов — сначала возвести каждое число, квадрат суммы — сначала сложить.",
        code="""x, y = 2, 7
print(x ** 2 + y ** 2, (x + y) ** 2)""",
    ),
    dict(
        at=(1, 6),
        section="pervaya-stroka",
        title="Первое число — количество",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Элементы — числа после первого; во втором ответе сложите все строки файла.",
        code="""lines = [3, 10, 20, 30]
a = lines[1:]
print(sum(a), sum(lines))""",
    ),
    dict(
        at=(1, 7),
        section="ostatok",
        title="Кратные девяти и положительные",
        difficulty=1,
        minutes=4,
        instruction=TWO,
        hint="Кратность — `x % 9 == 0`; ноль и отрицательные кратные входят только в первое количество.",
        files=F1,
        code=load("17-1.txt")
        + """count = 0
positive = 0
for x in a:
    if x % 9 == 0:
        count += 1
        if x > 0:
            positive += 1
print(count, positive)""",
    ),
    dict(
        at=(1, 8),
        section="proverki-usloviya",
        title="Делится на 4, но не на 8",
        difficulty=1,
        minutes=4,
        instruction=TWO,
        hint="Каждое слово условия — своя проверка: `x % 4 == 0 and x % 8 != 0`, затем двойное неравенство.",
        files=F1,
        code=load("17-1.txt")
        + """first = 0
second = 0
for x in a:
    if x % 4 == 0 and x % 8 != 0:
        first += 1
    if -100 <= x <= 100:
        second += 1
print(first, second)""",
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 8),
        section="rovno-odno",
        title="Ровно одно и хотя бы одно",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="Посчитайте выполненные проверки: `int(x % 4 == 0) + int(x % 6 == 0)`.",
        files=F1,
        code=load("17-1.txt")
        + """exactly = 0
at_least = 0
for x in a:
    k = int(x % 4 == 0) + int(x % 6 == 0)
    if k == 1:
        exactly += 1
    if k >= 1:
        at_least += 1
print(exactly, at_least)""",
    ),
    dict(
        at=(2, 9),
        section="rovno-odno",
        title="Хотя бы два делителя из трёх",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Сложите три проверки делимости и сравните количество с двойкой.",
        files=F1,
        code=load("17-1.txt")
        + """count = 0
for x in a:
    k = int(x % 2 == 0) + int(x % 3 == 0) + int(x % 5 == 0)
    if k >= 2:
        count += 1
print(count)""",
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 1),
        section="poslednie-cifry",
        title="Остаток отрицательного числа",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="Остаток в Python неотрицателен: −23 = (−3) · 10 + 7.",
        code="print(-23 % 10, abs(-23) % 10, -23 // 10)",
    ),
    dict(
        at=(3, 8),
        section="gde-nuzhen-modul",
        title="Трёхзначные на 7 по модулю",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="Количество цифр и последнюю цифру проверяйте у `abs(x)`, знак — у самого `x`.",
        files=F1,
        code=load("17-1.txt")
        + """count = 0
negative = 0
for x in a:
    if 100 <= abs(x) <= 999 and abs(x) % 10 == 7:
        count += 1
        if x < 0:
            negative += 1
print(count, negative)""",
    ),
    dict(
        at=(3, 9),
        section="cifra-v-razryade",
        title="Две одинаковые последние цифры",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Предпоследняя цифра — `abs(x) // 10 % 10`; у однозначного числа её нет.",
        files=F1,
        code=load("17-1.txt")
        + """count = 0
for x in a:
    d = abs(x)
    if d >= 10 and d % 10 == d // 10 % 10:
        count += 1
print(count)""",
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 1),
        section="sosednie-pary",
        title="Пары с чётным числом",
        difficulty=1,
        minutes=3,
        instruction=TWO,
        hint="У пяти чисел четыре соседние пары: индексы начала от 0 до 3.",
        code="""a = [4, 7, 10, 3, -2]
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    if x % 2 == 0 or y % 2 == 0:
        count += 1
        if best is None or x + y > best:
            best = x + y
print(count, best)""",
    ),
    dict(
        at=(4, 2),
        section="sosednie-pary",
        title="Ровно одно отрицательное",
        difficulty=1,
        minutes=3,
        instruction=TWO,
        hint="Ноль не отрицателен: пара (−8, 0) содержит ровно одно отрицательное число.",
        code="""a = [-8, 0, 5, -3, 2]
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    if int(x < 0) + int(y < 0) == 1:
        count += 1
        if best is None or x + y > best:
            best = x + y
print(count, best)""",
    ),
    dict(
        at=(4, 3),
        section="sosednie-pary",
        title="Ровно одно оканчивается на 7",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Окончание отрицательного числа — по модулю; ответ — минимум сумм квадратов.",
        code="""a = [7, 12, 17, -7, 4]
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    k = int(abs(x) % 10 == 7) + int(abs(y) % 10 == 7)
    if k == 1:
        count += 1
        s = x ** 2 + y ** 2
        if best is None or s < best:
            best = s
print(count, best)""",
    ),
    dict(
        at=(4, 4),
        section="sosednie-trojki",
        title="Тройки с двумя трёхзначными",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="У шести чисел четыре соседние тройки, и они пересекаются.",
        code="""a = [100, 5, 200, 300, 7, 400]
count = 0
best = None
for i in range(len(a) - 2):
    g = [a[i], a[i + 1], a[i + 2]]
    k = 0
    for x in g:
        if 100 <= abs(x) <= 999:
            k += 1
    if k == 2:
        count += 1
        if best is None or sum(g) > best:
            best = sum(g)
print(count, best)""",
    ),
    dict(
        at=(4, 5),
        section="granica-perebora",
        title="Сколько соседних групп",
        difficulty=1,
        minutes=1,
        instruction=THREE,
        hint="Группа из k элементов начинается на индексах от 0 до n − k.",
        code="""n = 2000
print(n - 1, n - 2, n - 3)""",
    ),
    dict(
        at=(4, 7),
        section="sosednie-trojki",
        title="Четвёрки с суммой, кратной 7",
        difficulty=1,
        minutes=3,
        instruction=TWO,
        hint="Последний используемый индекс четвёрки — `i + 3`, значит `range(len(a) - 3)`.",
        code="""a = [1, 2, 3, 4, 5, 6]
count = 0
best = None
for i in range(len(a) - 3):
    s = a[i] + a[i + 1] + a[i + 2] + a[i + 3]
    if s % 7 == 0:
        count += 1
        if best is None or s > best:
            best = s
print(count, best)""",
    ),
    dict(
        at=(4, 8),
        section="bez-spiska-summ",
        title="Оба отрицательные, сумма кратна 5",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Все подходящие суммы отрицательные: начинайте максимум с `None`, а не с нуля.",
        files=F1,
        code=load("17-1.txt")
        + """count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    if x < 0 and y < 0 and (x + y) % 5 == 0:
        count += 1
        if best is None or x + y > best:
            best = x + y
print(count, best)""",
    ),
    dict(
        at=(4, 9),
        section="sosednie-trojki",
        title="Тройки: два трёхзначных, сумма кратна 4",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Трёхзначность — по модулю у каждого числа тройки; ответ — минимальная сумма.",
        files=F1,
        code=load("17-1.txt")
        + """count = 0
best = None
for i in range(len(a) - 2):
    g = [a[i], a[i + 1], a[i + 2]]
    k = 0
    for x in g:
        if 100 <= abs(x) <= 999:
            k += 1
    if k == 2 and sum(g) % 4 == 0:
        count += 1
        if best is None or sum(g) < best:
            best = sum(g)
print(count, best)""",
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="predvaritelnaya-harakteristika",
        title="Порог — наибольший на 17",
        difficulty=2,
        minutes=4,
        instruction=THREE,
        hint="Сначала найдите порог по всем числам, затем перебирайте пары.",
        code="""a = [12, 117, 40, 217, 5]
m = max(x for x in a if abs(x) % 100 == 17)
count = 0
best = None
for i in range(len(a) - 1):
    s = a[i] + a[i + 1]
    if s > m:
        count += 1
        if best is None or s > best:
            best = s
print(m, count, best)""",
    ),
    dict(
        at=(5, 5),
        section="polnaya-zadacha",
        title="Квадрат минимума на 1",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Минимум на 1 — среди исходных чисел (−31), окончание — по модулю.",
        code="""a = [-31, 6, 21, -4, 11]
m = min(x for x in a if abs(x) % 10 == 1)
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    k = int(abs(x) % 10 == 1) + int(abs(y) % 10 == 1)
    s = x ** 2 + y ** 2
    if k == 1 and s < m ** 2:
        count += 1
        if best is None or s > best:
            best = s
print(count, best)""",
    ),
    dict(
        at=(5, 6),
        section="srednee",
        title="Меньше среднего чётных",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="«Одно…, а другое…» — два распределения ролей через `or`; среднее сравнивайте без деления.",
        code="""a = [6, 9, 2, 15, 4]
s = sum(x for x in a if x % 2 == 0)
k = sum(1 for x in a if x % 2 == 0)
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    if (x % 3 == 0 and y * k < s) or (y % 3 == 0 and x * k < s):
        count += 1
        if best is None or x + y > best:
            best = x + y
print(count, best)""",
    ),
    dict(
        at=(5, 7),
        section="trojki-s-porogom",
        title="Тройки и максимум на 21",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Порог — максимум чисел, оканчивающихся на 21; в тройке ровно два четырёхзначных и хотя бы одно кратное 7.",
        files=F2,
        code=load("17-2.txt")
        + """m = max(x for x in a if x % 100 == 21)
count = 0
best = None
for i in range(len(a) - 2):
    g = [a[i], a[i + 1], a[i + 2]]
    four = 0
    seven = 0
    for x in g:
        four += int(1000 <= x <= 9999)
        seven += int(x % 7 == 0)
    if four == 2 and seven >= 1 and sum(g) > m:
        count += 1
        if best is None or sum(g) > best:
            best = sum(g)
print(count, best)""",
    ),
    dict(
        at=(5, 8),
        section="vidy-harakteristik",
        title="Порог — количество кратных 25",
        difficulty=2,
        minutes=6,
        instruction=TWO,
        hint="Первым проходом посчитайте кратные 25, затем используйте количество как порог для суммы пары.",
        files=F1,
        code=load("17-1.txt")
        + """m = 0
for x in a:
    if x % 25 == 0:
        m += 1
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    if (x < 0 or y < 0) and x + y < m:
        count += 1
        if best is None or x + y > best:
            best = x + y
print(count, best)""",
    ),
    dict(
        at=(5, 9),
        section="srednee-bez-drobej",
        title="Среднее нечётных без деления",
        difficulty=3,
        minutes=7,
        instruction=TWO,
        hint="«y меньше среднего» — `y * k < s`, где `s` и `k` — сумма и количество нечётных.",
        files=F2,
        code=load("17-2.txt")
        + """s = sum(x for x in a if x % 2 != 0)
k = sum(1 for x in a if x % 2 != 0)
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    if (x % 9 == 0 and y * k < s) or (y % 9 == 0 and x * k < s):
        count += 1
        if best is None or x + y > best:
            best = x + y
print(count, best)""",
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 1),
        section="proverka-i-otvet",
        title="Квадрат минимума и минимум квадратов",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Порядок слов — порядок действий: сначала минимум, потом квадрат, и наоборот.",
        code="""a = [5, -7, 2]
print(min(a) ** 2, min(x ** 2 for x in a))""",
    ),
    dict(
        at=(6, 2),
        section="proverka-i-otvet",
        title="Модуль максимума и максимум модулей",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="«Модуль максимальной суммы»: сначала максимум, потом модуль.",
        code="""sums = [-15, -40, 10]
print(abs(max(sums)), max(abs(s) for s in sums))""",
    ),
    dict(
        at=(6, 3),
        section="ostatok-minimalnogo",
        title="Остаток минимального и минимальный остаток",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Остаток минимального — `min(a) % 5`; минимальный остаток — минимум из остатков всех чисел.",
        code="""a = [13, 22, 9]
print(min(a) % 5, min(x % 5 for x in a))""",
    ),
    dict(
        at=(6, 4),
        section="dva-naibolshih",
        title="Два наибольших в тройке",
        difficulty=1,
        minutes=3,
        instruction=THREE,
        hint="После `sorted` два наибольших — `g[1]` и `g[2]`, средний по величине — `g[1]`.",
        code="""g = sorted([7, -2, 5])
print(g[1] + g[2], g[1] ** 2 + g[2] ** 2, g[1])""",
    ),
    dict(
        at=(6, 5),
        section="malenkij-spisok",
        title="Минимум и максимум тройки",
        difficulty=1,
        minutes=3,
        instruction=THREE,
        hint="Сумма модулей, модуль суммы и произведение — три разных выражения от одних −8 и 4.",
        code="""g = [3, -8, 4]
lo, hi = min(g), max(g)
print(abs(lo) + abs(hi), abs(lo + hi), lo * hi)""",
        says=["12", "4", "−32"],
    ),
    dict(
        at=(6, 6),
        section="ostatok-minimalnogo",
        title="Остаток на 7 равен минимуму",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="С минимумом сравнивается остаток каждого числа пары, а не само число.",
        code="""a = [30, 4, 17, 9]
m = min(a)
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    if x % 7 == m or y % 7 == m:
        count += 1
        if best is None or x + y > best:
            best = x + y
print(count, best)""",
    ),
    dict(
        at=(6, 7),
        section="proverka-i-otvet",
        title="Проверяем сумму, выводим квадраты",
        difficulty=1,
        minutes=3,
        instruction=TWO,
        hint="Отбор — по сумме пары, ответ — минимум сумм квадратов подходящих пар.",
        code="""a = [3, -1, 6, 2]
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    if x + y > 4:
        count += 1
        s = x ** 2 + y ** 2
        if best is None or s < best:
            best = s
print(count, best)""",
    ),
    dict(
        at=(6, 8),
        section="ostatok-minimalnogo",
        title="Остаток на 37 равен минимуму",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Найдите `m = min(a)` до цикла и сравнивайте с ним `x % 37` и `y % 37`.",
        files=F2,
        code=load("17-2.txt")
        + """m = min(a)
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    if x % 37 == m or y % 37 == m:
        count += 1
        if best is None or x + y > best:
            best = x + y
print(count, best)""",
    ),
    dict(
        at=(6, 9),
        section="dva-naibolshih",
        title="Два наибольших против квадрата количества",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Сумма двух наибольших — `sum(g) - min(g)`; модуль — только у окончательного максимума.",
        files=F3,
        code=load("17-3.txt")
        + """k = 0
for x in a:
    if 1000 <= abs(x) <= 9999 and abs(x) % 100 == 13:
        k += 1
count = 0
best = None
for i in range(len(a) - 2):
    g = [a[i], a[i + 1], a[i + 2]]
    if sum(g) - min(g) < k ** 2:
        count += 1
        if best is None or sum(g) > best:
            best = sum(g)
print(count, abs(best))""",
    ),
    dict(
        at=(6, 10),
        section="proverka-i-otvet",
        title="Ровно одно отрицательное и порог",
        difficulty=3,
        minutes=7,
        instruction=TWO,
        hint="Порог — наибольшее отрицательное трёхзначное кратное 7; ответ — минимум сумм квадратов.",
        files=F3,
        code=load("17-3.txt")
        + """t = max(x for x in a if -999 <= x <= -100 and x % 7 == 0)
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    if int(x < 0) + int(y < 0) == 1 and x + y > t:
        count += 1
        s = x ** 2 + y ** 2
        if best is None or s < best:
            best = s
print(count, best)""",
    ),
    # ------------------------------------------------------------ subtopic 7
    dict(
        at=(7, 5),
        section="pryamougolnyj",
        title="Прямоугольные тройки",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="Отсортируйте тройку: p + q > r и p² + q² = r².",
        code="""a = [3, 4, 5, 6, 8, 10]
count = 0
best = None
for i in range(len(a) - 2):
    p, q, r = sorted([a[i], a[i + 1], a[i + 2]])
    if p + q > r and p ** 2 + q ** 2 == r ** 2:
        count += 1
        if best is None or p + q + r > best:
            best = p + q + r
print(count, best)""",
    ),
    dict(
        at=(7, 6),
        section="vid-treugolnika",
        title="Тупоугольные тройки",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="Тупоугольный: треугольник существует и p² + q² < r² для наибольшей стороны r.",
        code="""a = [10, 6, 8, 3, 4, 5, 13]
count = 0
best = None
for i in range(len(a) - 2):
    p, q, r = sorted([a[i], a[i + 1], a[i + 2]])
    if p + q > r and p ** 2 + q ** 2 < r ** 2:
        count += 1
        if best is None or p + q + r > best:
            best = p + q + r
print(count, best)""",
    ),
    dict(
        at=(7, 7),
        section="vid-treugolnika",
        title="Остроугольные тройки файла",
        difficulty=2,
        minutes=6,
        instruction=TWO,
        hint="Остроугольный: p + q > r и p² + q² > r² после сортировки тройки.",
        files=F5,
        code=load("17-5.txt")
        + """count = 0
best = 0
for i in range(len(a) - 2):
    p, q, r = sorted([a[i], a[i + 1], a[i + 2]])
    if p + q > r and p ** 2 + q ** 2 > r ** 2:
        count += 1
        best = max(best, p + q + r)
print(count, best)""",
    ),
    dict(
        at=(7, 8),
        section="pryamougolnyj",
        title="Прямоугольные тройки файла",
        difficulty=2,
        minutes=6,
        instruction=TWO,
        hint="Стороны в файле идут в любом порядке — без сортировки часть троек потеряется.",
        files=F5,
        code=load("17-5.txt")
        + """count = 0
best = 0
for i in range(len(a) - 2):
    p, q, r = sorted([a[i], a[i + 1], a[i + 2]])
    if p + q > r and p ** 2 + q ** 2 == r ** 2:
        count += 1
        best = max(best, p + q + r)
print(count, best)""",
    ),
    # ------------------------------------------------------------ subtopic 8
    dict(
        at=(8, 1),
        section="chislo-proverok",
        title="Число пар разных позиций",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Пар разных позиций n(n − 1)/2.",
        code="""for n in (5, 2000):
    print(n * (n - 1) // 2)""",
        says=["10", "1 999 000"],
    ),
    dict(
        at=(8, 2),
        section="chislo-proverok",
        title="Пары из одинаковых значений",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Пары считаются по позициям; разных значений среди четырёх семёрок нет.",
        code="""a = [7, 7, 7, 7]
pairs = 0
different = 0
for i in range(len(a) - 1):
    for j in range(i + 1, len(a)):
        pairs += 1
        if a[i] != a[j]:
            different += 1
print(pairs, different)""",
        says=["6 пар", "ни одной"],
    ),
    dict(
        at=(8, 3),
        section="ne-sosedi",
        title="Любые пары с суммой, кратной 5",
        difficulty=1,
        minutes=3,
        instruction=TWO,
        hint="Вложенные циклы: `j` от `i + 1` до конца, каждая пара позиций — один раз.",
        code="""a = [3, 8, 2, 7]
count = 0
best = None
for i in range(len(a) - 1):
    for j in range(i + 1, len(a)):
        s = a[i] + a[j]
        if s % 5 == 0:
            count += 1
            if best is None or s > best:
                best = s
print(count, best)""",
    ),
    dict(
        at=(8, 4),
        section="po-ostatkam",
        title="Остаток партнёра",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="Сумма делится на 7, когда остатки дают в сумме 0 или 7: партнёр — `(-r) % 7`.",
        code="""print(*[(-r) % 7 for r in (0, 3, 5)])""",
    ),
    dict(
        at=(8, 6),
        section="po-ostatkam",
        title="Разность, кратная 3",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="Разность кратна 3, когда остатки равны; у всех чисел остаток 2.",
        code="""a = [2, 5, 8, 11, 14]
count = 0
best = None
for i in range(len(a) - 1):
    for j in range(i + 1, len(a)):
        d = abs(a[i] - a[j])
        if d % 3 == 0:
            count += 1
            if best is None or d > best:
                best = d
print(count, best)""",
    ),
    dict(
        at=(8, 7),
        section="po-ostatkam",
        title="Сумма кратна 12, есть кратное 5",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Пар около 180 тысяч — вложенные циклы справятся; проверьте оба условия.",
        files=F6,
        code=load("17-6.txt")
        + """count = 0
best = 0
for i in range(len(a) - 1):
    for j in range(i + 1, len(a)):
        x, y = a[i], a[j]
        if (x + y) % 12 == 0 and (x % 5 == 0 or y % 5 == 0):
            count += 1
            best = max(best, x + y)
print(count, best)""",
    ),
    dict(
        at=(8, 8),
        section="ne-sosedi",
        title="Произведение кратно 14",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Проверяйте само произведение: подходят и пары «кратное 2 и кратное 7».",
        files=F6,
        code=load("17-6.txt")
        + """count = 0
best = 0
for i in range(len(a) - 1):
    for j in range(i + 1, len(a)):
        x, y = a[i], a[j]
        if x * y % 14 == 0:
            count += 1
            best = max(best, x + y)
print(count, best)""",
    ),
    # ------------------------------------------------------ Практика и итог
    dict(
        at=(9, 1),
        title="Ровно одно кратно 3, сумма кратна 5",
        difficulty=2,
        minutes=6,
        instruction=TWO,
        hint="«Ровно одно» — количество выполненных проверок равно 1.",
        files=F4,
        code=load("17-4.txt")
        + """count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    k = int(x % 3 == 0) + int(y % 3 == 0)
    if k == 1 and (x + y) % 5 == 0:
        count += 1
        if best is None or x + y > best:
            best = x + y
print(count, best)""",
    ),
    dict(
        at=(9, 2),
        title="Не более одного трёхзначного",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Трёхзначное — по модулю; «не меньше» включает равенство с порогом.",
        files=F3,
        code=load("17-3.txt")
        + """m = min(x for x in a if x > 0 and x % 100 == 99)
count = 0
best = None
for i in range(len(a) - 2):
    g = [a[i], a[i + 1], a[i + 2]]
    k = 0
    for x in g:
        if 100 <= abs(x) <= 999:
            k += 1
    if k <= 1 and sum(g) >= m:
        count += 1
        if best is None or sum(g) < best:
            best = sum(g)
print(count, best)""",
    ),
    dict(
        at=(9, 3),
        title="Остатки минимума и максимума",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Сравнивайте остатки: `x % 3 == min(a) % 3`, а не `x % 3 == min(a)`.",
        files=F4,
        code=load("17-4.txt")
        + """r3 = min(a) % 3
r7 = max(a) % 7
count = 0
best = None
for i in range(len(a) - 1):
    x, y = a[i], a[i + 1]
    first = x % 3 == r3 or y % 3 == r3
    second = x % 7 == r7 or y % 7 == r7
    if first and second:
        count += 1
        if best is None or x + y > best:
            best = x + y
print(count, best)""",
    ),
    dict(
        at=(9, 4),
        title="Все одного знака",
        difficulty=3,
        minutes=8,
        instruction=TWO,
        hint="Ноль не положителен и не отрицателен; модуль — у суммы в проверке и у окончательного максимума.",
        files=F3,
        code=load("17-3.txt")
        + """m = max(x for x in a if abs(x) % 100 == 77)
count = 0
best = None
for i in range(len(a) - 2):
    g = [a[i], a[i + 1], a[i + 2]]
    same = min(g) > 0 or max(g) < 0
    if same and abs(sum(g)) < m:
        count += 1
        if best is None or sum(g) > best:
            best = sum(g)
print(count, abs(best))""",
    ),
    dict(
        at=(9, 5),
        title="Четвёрки и утроенное среднее",
        difficulty=3,
        minutes=9,
        instruction=TWO,
        hint="Без деления: сумма четвёрки, умноженная на `k`, больше `3 * s` (сумма и количество чётных).",
        files=F4,
        code=load("17-4.txt")
        + """s = sum(x for x in a if x % 2 == 0)
k = sum(1 for x in a if x % 2 == 0)
count = 0
best = None
for i in range(len(a) - 3):
    g = a[i : i + 4]
    k3 = sum(1 for x in g if x % 3 == 0)
    k7 = sum(1 for x in g if x % 7 == 0)
    if k3 > k7 and sum(g) * k > 3 * s:
        count += 1
        if best is None or sum(g) > best:
            best = sum(g)
print(count, best)""",
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 17, TASKS, RETIRED))
