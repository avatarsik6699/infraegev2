"""Topic 14 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-14/bank.py          # check only
    python3 -I content/lesson-design/topic-14/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. A program works
the way the lesson does: the digits of a number by ``digits(n, q)`` (``%`` and
``//`` in a loop), the value of a record with unknown digits by ``value(ds, q)``
(``v * q + d``), then a search over the parameter x, the unknown digits or the
base. ``apps/api/tests/test_task_14_bank.py`` recomputes every answer
independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, TWO, main  # noqa: E402

DIGITS = """def digits(n, q):
    if n == 0:
        return [0]

    result = []

    while n > 0:
        result.append(n % q)
        n = n // q

    result.reverse()
    return result


"""

VALUE = """def value(ds, q):
    v = 0
    for d in ds:
        v = v * q + d
    return v


"""


def task(at, section, title, code, hint, *, instruction=NUMBER, difficulty=1, minutes=2, says=None):
    prefix = (DIGITS if "digits(" in code else "") + (VALUE if "value(" in code else "")
    spec = dict(
        at=at,
        title=title,
        difficulty=difficulty,
        minutes=minutes,
        instruction=instruction,
        hint=hint,
        code=prefix + code,
    )
    if section:
        spec["section"] = section
    if says:
        spec["says"] = says
    return spec


# (page, number in the page) -> task definition; page 8 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    task(
        (1, 2),
        "znachenie-zapisi",
        "Четверичная запись 2103",
        "print(int('2103', 4))",
        "Каждая цифра умножается на вес своего разряда.",
    ),
    task(
        (1, 3),
        "posledovatelnoe-delenie",
        "94 в пятеричной системе",
        "print(*digits(94, 5), sep='')",
        "Делите на 5 и читайте остатки снизу вверх.",
    ),
    task(
        (1, 4),
        "dlina-zapisi-14",
        "Наибольшее четырёхзначное шестеричное",
        "print(6 ** 4 - 1)",
        "Следующее число — уже пятизначное 10000₆.",
    ),
    task(
        (1, 6),
        "dlina-zapisi-14",
        "Трёхзначные числа в системе с основанием 6",
        "print(6 ** 2, 6 ** 3 - 1, 6 ** 3 - 6 ** 2)",
        "Трёхзначные числа лежат от q² до q³ − 1.",
        instruction=THREE,
    ),
    task(
        (1, 7),
        "ostatok-i-chastnoe",
        "Цифра в разряде 3",
        "print(2024 // 5 ** 3 % 5)",
        "Отбросьте три младшие цифры и возьмите последнюю.",
    ),
    task(
        (1, 8),
        "sdvigi",
        "Частное и остаток от деления на 49",
        "print(2024 // 49, 2024 % 49)",
        "49 = 7²: деление отрезает две последние семеричные цифры.",
        instruction=TWO,
    ),
    task(
        (1, 9),
        "naimenshee-osnovanie",
        "Наименьшее основание для 3A7",
        "q = max(3, 10, 7) + 1\nprint(q, value([3, 10, 7], q))",
        "Каждая цифра меньше основания; A = 10.",
        instruction=TWO,
    ),
    # ------------------------------------------------------------ subtopic 2
    task(
        (2, 1),
        "slozhenie",
        "Сложение в пятеричной системе",
        "s = int('324', 5) + int('143', 5)\nprint(*digits(s, 5), sep='')",
        "Складывайте поразрядно с переносом через 5.",
    ),
    task(
        (2, 2),
        "minus-edinica",
        "Запись 7⁵ и 7⁵ − 1",
        "top = digits(7 ** 5 - 1, 7)\nprint(len(digits(7 ** 5, 7)), ''.join(map(str, top)))",
        "qⁿ — единица и n нулей, qⁿ − 1 — n старших цифр.",
        instruction="Введите количество цифр и запись 7⁵ − 1 через пробел.",
        says=["шесть цифр", "66666₇"],
    ),
    task(
        (2, 3),
        "bloki-cifr",
        "Нули в записи 7⁸ + 7³ + 1",
        "print(digits(7 ** 8 + 7 ** 3 + 1, 7).count(0))",
        "Каждое слагаемое — единица в своём разряде.",
    ),
    task(
        (2, 4),
        "raznost-stepenej",
        "Тройки в записи 4²⁰ − 4⁷",
        "print(digits(4 ** 20 - 4 ** 7, 4).count(3))",
        "qᵃ − qᵇ — (a − b) старших цифр и b нулей.",
    ),
    task(
        (2, 5),
        "perevod-gruppami",
        "Единицы в 8¹⁵ + 2²⁰ − 7",
        "print(bin(8 ** 15 + 2 ** 20 - 7)[2:].count('1'))",
        "Приведите степени к основанию 2.",
        minutes=3,
    ),
    task(
        (2, 6),
        "slozhenie",
        "Единицы в 2¹⁵ + 2¹⁵ + 2³ − 1",
        "print(bin(2 ** 15 + 2 ** 15 + 2 ** 3 - 1)[2:].count('1'))",
        "Две одинаковые степени дают перенос.",
    ),
    task(
        (2, 7),
        "odno-osnovanie",
        "Двойки в троичной записи",
        "print(digits(9 ** 8 + 3 ** 10 - 3 ** 4, 3).count(2))",
        "9⁸ = 3¹⁶.",
        minutes=3,
    ),
    task(
        (2, 8),
        "neudobnoe-vychitaemoe",
        "Четвёрки в пятеричной записи",
        "print(digits(25 ** 6 + 5 ** 8 - 5 ** 3 - 3, 5).count(4))",
        "Разбейте вычитаемое на блоки.",
        minutes=4,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 3
    task(
        (3, 1),
        "podschyot-cifry",
        "Нули в шестеричной записи 2016",
        "print(digits(2016, 6).count(0))",
        "Остатки от деления на 6 — цифры записи.",
    ),
    task(
        (3, 3),
        "bolshie-stepeni",
        "Единицы в 2¹⁰⁰ − 2⁵⁰ + 1",
        "print(bin(2 ** 100 - 2 ** 50 + 1)[2:].count('1'))",
        "Python считает большие степени точно.",
    ),
    task(
        (3, 4),
        "voprosy-o-zapisi",
        "Сумма цифр 7²⁰ − 1",
        "print(sum(digits(7 ** 20 - 1, 7)))",
        "Сумма списка цифр.",
    ),
    task(
        (3, 6),
        "voprosy-o-zapisi",
        "Различные шестнадцатеричные цифры",
        "print(len(set(digits(16 ** 10 - 16 ** 5 + 255, 16))))",
        "Множество цифр списка.",
    ),
    task(
        (3, 7),
        "podschyot-cifry",
        "Восьмёрки в девятеричной записи",
        "n = 3 * 27 ** 15 + 9 ** 20 - 2 * 3 ** 10 - 4\nprint(digits(n, 9).count(8))",
        "Программа считает цифры без разбора блоков.",
        minutes=3,
    ),
    task(
        (3, 8),
        "cifry-so-svojstvom",
        "Цифры больше 9 в 36-ричной записи",
        "n = 5 * 36 ** 20 + 6 ** 45 - 6 ** 10 - 2025\n"
        "print(sum(1 for d in digits(n, 36) if d > 9))",
        "Цифры записи — числа от 0 до 35.",
        minutes=3,
        difficulty=2,
    ),
    task(
        (3, 9),
        "cifry-so-svojstvom",
        "Сумма цифр не больше 15",
        "n = 4 * 31 ** 30 + 9 * 31 ** 15 - 31 ** 6 + 2026\n"
        "print(sum(d for d in digits(n, 31) if d <= 15))",
        "Отберите цифры условием и сложите.",
        minutes=3,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 4
    task(
        (4, 2),
        "bez-zaimstvovanij",
        "Четвёрки в 5⁶ − 1 и 5⁶ − 2",
        "print(digits(5 ** 6 - 1, 5).count(4),\n      digits(5 ** 6 - 2, 5).count(4))",
        "5⁶ − 1 — шесть старших цифр.",
        instruction=TWO,
    ),
    task(
        (4, 3),
        "maksimalnoe-x",
        "Наибольшее x: ровно четыре четвёрки",
        "print(max(x for x in range(1, 201)\n          if digits(5 ** 6 - x, 5).count(4) == 4))",
        "Перебирайте x как число, а не как цифру.",
        minutes=3,
    ),
    task(
        (4, 5),
        "naibolshee-kolichestvo",
        "Наименьшее x с наибольшим числом нулей",
        "zeros = [digits(5 ** 6 - x, 5).count(0) for x in range(1, 501)]\n"
        "print(zeros.index(max(zeros)) + 1)",
        "Сначала наибольшее количество, затем первое x с ним.",
        minutes=3,
        difficulty=2,
    ),
    task(
        (4, 6),
        "maksimalnoe-x",
        "Ровно 53 нуля",
        "n = 7 ** 100 + 7 ** 50\n"
        "print(max(x for x in range(1, 3001)\n          if digits(n - x, 7).count(0) == 53))",
        "Количество нулей меняется не плавно — проверьте все x.",
        minutes=3,
        difficulty=2,
    ),
    task(
        (4, 7),
        "bez-zaimstvovanij",
        "Ровно 7 цифр 12",
        "n = 11 * 13 ** 20 + 13 ** 10\nx = 1\n"
        "while digits(n - x, 13).count(12) != 7:\n    x += 1\nprint(x)",
        "Верхней границы нет — перебор while.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (4, 8),
        "naibolshee-kolichestvo",
        "Наибольшее количество нулей",
        "n = 6 ** 120 + 6 ** 60\nprint(max(digits(n - x, 6).count(0) for x in range(1, 2001)))",
        "Ответ — количество, а не x.",
        minutes=3,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 5
    task(
        (5, 2),
        "naimenshaya-cifra",
        "2x3₇ + 1x4₇ делится на 6",
        "for x in range(7):\n"
        "    s = value([2, x, 3], 7) + value([1, x, 4], 7)\n"
        "    if s % 6 == 0:\n        print(s // 6)\n        break",
        "x — цифра от 0 до 6; ответ — частное.",
    ),
    task(
        (5, 3),
        "dopustimye-znacheniya",
        "2x1₆ + 1x3₈ делится на 5",
        "for x in range(6):\n"
        "    s = value([2, x, 1], 6) + value([1, x, 3], 8)\n"
        "    if s % 5 == 0:\n        answer = s // 5\nprint(answer)",
        "Цифра x должна подходить обоим основаниям.",
        minutes=3,
    ),
    task(
        (5, 4),
        "ves-razryada",
        "Значение 2x7₄₀ при x = 33",
        "print(value([2, 33, 7], 40))",
        "33 — одна цифра с весом 40.",
    ),
    task(
        (5, 6),
        "funkciya-znacheniya",
        "7x3A₁₉ + 4Bx3₁₉ кратно 18",
        "for x in range(19):\n"
        "    s = value([7, x, 3, 10], 19) + value([4, 11, x, 3], 19)\n"
        "    if s % 18 == 0:\n        print(s // 18)\n        break",
        "A = 10, B = 11; наименьшее x — первое найденное.",
        minutes=3,
    ),
    task(
        (5, 7),
        "v-otvet",
        "Три операнда в 23-ричной системе",
        "for x in range(23):\n"
        "    s = (value([5, x, 1, 8, 12, 3], 23)\n"
        "         + value([2, x, 7, x], 23) + value([9, 6, x, 4, 1], 23))\n"
        "    if s % 22 == 0:\n        answer = s // 22\nprint(answer)",
        "Наибольшее x — последнее подходящее.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (5, 8),
        "dopustimye-znacheniya",
        "Цифра из десятичного алфавита",
        "for x in range(10):\n"
        "    s = value([5, x, 7], 14) + value([x, 3, 11], 12)\n"
        "    if s % 20 == 0:\n        print(s // 20)",
        "x — от 0 до 9, независимо от оснований.",
        minutes=3,
    ),
    task(
        (5, 9),
        "ves-razryada",
        "Основание 41",
        "for x in range(41):\n"
        "    s = value([6, x, 2, 9], 41) + value([1, x, 0, 7, x], 41)\n"
        "    if s % 40 == 0:\n        print(s // 40)\n        break",
        "При основании больше 36 int(s, q) не работает.",
        minutes=3,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 6
    task(
        (6, 2),
        "vyrazhenie-ot-dvuh",
        "1xy₄ + 2yx₅ делится на 7",
        "best = None\nfor x in range(4):\n    for y in range(4):\n"
        "        s = value([1, x, y], 4) + value([2, y, x], 5)\n"
        "        if s % 7 == 0 and (best is None or s < best):\n"
        "            best = s\nprint(best // 7)",
        "Обе цифры есть в четверичной записи.",
        minutes=3,
    ),
    task(
        (6, 4),
        "naimenshee-znachenie",
        "Наименьшее значение, кратное 41",
        "best = None\nfor x in range(11):\n    for y in range(11):\n"
        "        s = value([3, x, 6, y], 11) + value([y, 5, x, 1], 13)\n"
        "        if s % 41 == 0 and (best is None or s < best):\n"
        "            best = s\nprint(best // 41)",
        "Первая подходящая пара — не обязательно наименьшая сумма.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (6, 5),
        "sama-para",
        "Наибольшее yx₃₈",
        "best = 0\nfor x in range(38):\n    for y in range(38):\n"
        "        if value([4, x, 1, y, 7], 38) % 37 == 0:\n"
        "            best = max(best, value([y, x], 38))\nprint(best)",
        "Ответ — значение пары, а не само число.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (6, 6),
        "sama-para",
        "yx₄₂ — полный квадрат",
        "from math import isqrt\n\nbest = 0\nfor x in range(42):\n    for y in range(42):\n"
        "        yx = value([y, x], 42)\n"
        "        if (value([3, x, 5, y], 42) % 41 == 0 and yx > 0\n"
        "                and isqrt(yx) ** 2 == yx):\n"
        "            best = max(best, yx)\nprint(best)",
        "Два условия: кратность числа и квадрат пары.",
        minutes=4,
        difficulty=3,
    ),
    # ------------------------------------------------------------ subtopic 7
    task(
        (7, 1),
        "osnovanie-po-formule",
        "Основание по записи 124",
        "print(next(q for q in range(5, 100)\n           if value([1, 2, 4], q) == 67))",
        "Цифра 4 требует q ≥ 5.",
    ),
    task(
        (7, 2),
        "osnovanie-i-cifra",
        "Основание и цифра записи 1x4",
        "for q in range(5, 100):\n    for x in range(q):\n"
        "        if value([1, x, 4], q) == 85:\n            print(q, x)",
        "Перебирайте основание и цифру вместе.",
        instruction=TWO,
        minutes=3,
    ),
    task(
        (7, 3),
        "ravenstvo-s-bukvami",
        "Равенство 3x + xy = 1y7",
        "for q in range(8, 40):\n    found = [value([x, y], q)\n"
        "             for x in range(1, q) for y in range(q)\n"
        "             if value([3, x], q) + value([x, y], q)\n"
        "             == value([1, y, 7], q)]\n"
        "    if found:\n        print(found[0])\n        break",
        "Цифра 7 требует q ≥ 8.",
        minutes=4,
        difficulty=3,
    ),
    task(
        (7, 4),
        "delenie-na-q-1",
        "Сумма делится на q − 1",
        "print(next(q for q in range(12, 1000)\n"
        "           if (value([9, 11, 4], q) + value([6, 10, 7], q))\n"
        "           % (q - 1) == 0))",
        "Число делится на q − 1 вместе с суммой своих цифр.",
        minutes=3,
        difficulty=2,
    ),
    task(
        (7, 6),
        "dobavka",
        "Наименьшая добавка до кратного",
        "best = None\nfor x in range(6):\n"
        "    m, n = value([3, x, 1], 6), value([2, x], 6)\n"
        "    a = n - m % n\n"
        "    if best is None or a < best:\n        best = a\nprint(best)",
        "A = N − (M mod N).",
        minutes=3,
        difficulty=2,
    ),
    task(
        (7, 7),
        "nachalo-perebora",
        "Шестёрок больше, чем нулей",
        "n = 2 * 7 ** 18 + 6 * 7 ** 10 + 3 * 7 ** 6 + 5 * 7 ** 2 + 4\n"
        "x = 1\nwhile True:\n    ds = digits(n - x, 7)\n"
        "    if ds.count(6) > ds.count(0):\n        break\n"
        "    x += 1\nprint(x)",
        "Пока x не больше младшего блока, нулей не меньше десяти.",
        minutes=5,
        difficulty=3,
    ),
    # ---------------------------------------------------- Практика и итог
    task(
        (8, 1),
        None,
        "Шестёрки в семеричной записи",
        "n = 2 * 49 ** 10 + 7 ** 12 - 7 ** 4 - 3\nprint(digits(n, 7).count(6))",
        "49¹⁰ = 7²⁰; вычитаемое — блоками.",
        minutes=3,
    ),
    task(
        (8, 2),
        None,
        "Цифры больше 9 при основании 36",
        "n = 3 * 6 ** 80 + 6 ** 50 - 6 ** 20 - 1000\nprint(sum(1 for d in digits(n, 36) if d > 9))",
        "Цифры — числа от 0 до 35.",
        minutes=3,
    ),
    task(
        (8, 3),
        None,
        "Ровно три нуля",
        "print(max(x for x in range(1, 1001)\n"
        "          if digits(6 ** 8 + 6 ** 3 - x, 6).count(0) == 3))",
        "Перебирайте x до 1000.",
        minutes=3,
    ),
    task(
        (8, 4),
        None,
        "Частное от деления на 10",
        "for x in range(21):\n"
        "    s = value([9, x, 3, 6], 21) + value([3, x, 7, 10, x], 21)\n"
        "    if s % 20 == 0:\n        print(s // 10)",
        "Кратность — 20, а делят на 10.",
        minutes=3,
    ),
    task(
        (8, 5),
        None,
        "Две цифры в основаниях 7 и 8",
        "best = None\nfor x in range(7):\n    for y in range(7):\n"
        "        s = value([1, x, y, 3], 7) + value([y, 2, x], 8)\n"
        "        if s % 13 == 0 and (best is None or s < best):\n"
        "            best = s\nprint(best // 13)",
        "Нужна наименьшая сумма, а не первая пара.",
        minutes=4,
        difficulty=2,
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 14, TASKS))
