"""Topic 16 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-16/bank.py          # check only
    python3 -I content/lesson-design/topic-16/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. The lesson
replaces the earlier «Рекурсивные алгоритмы» (same id and route): ``--write``
also removes that lesson's tasks (``RETIRED``). ``apps/api/tests/test_task_16_bank.py``
recomputes every answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, TWO, main  # noqa: E402

RETIRED = frozenset(
    {
        "rekursiya-base-sequence",
        "rekursiya-branch-doubling",
        "rekursiya-call-stack-trace",
        "rekursiya-count-arguments",
        "rekursiya-difference-terms",
        "rekursiya-digit-steps",
        "rekursiya-inexact-ratio",
        "rekursiya-large-ratio",
        "rekursiya-program-parity-pair",
        "rekursiya-repeated-calls",
        "rekursiya-true-division",
        "rekursiya-two-functions-table",
        "rekursiya-two-values",
        "rekursiya-upward-chain",
    }
)
# Sections of the retired lesson → the steps that now teach the same; catalog
# tasks of task 16 link their theory there.
RELINK = {
    "large-arguments-differences": "raznost",
    "branching-conditions": "usloviya-v-opredelenii",
    "large-arguments-algebraic-shortcut": "smotret-na-vyrazhenie",
    "two-functions": "svyazannye-funkcii",
    "argument-steps": "cepochki",
    "general-method": "baza-i-sootnoshenie",
    "count-arguments": "skolko-argumentov",
    "several-previous-values": "tablica-predydushchih",
    "upward-recursion-cache-warmup": "dve-problemy",
    "code-and-call-stack": "do-bazy-i-obratno",
}
FOUR = "Введите четыре числа через пробел в том порядке, в каком их спрашивают."

# The digit counters of subtopic 7, as the lesson writes them.
DIGITS = """from functools import cache


def digits_in_base(number, base):
    if number == 0:
        return [0]
    digits = []
    while number > 0:
        digits.append(number % base)
        number //= base
    digits.reverse()
    return digits
"""
COUNT_SUM = """

def count_sum(bound, target, base=10):
    if bound < 0:
        return 0
    digits = digits_in_base(bound, base)

    @cache
    def solve(position, remaining, equal):
        if remaining < 0:
            return 0
        if position == len(digits):
            return 1 if remaining == 0 else 0
        limit = digits[position] if equal else base - 1
        total = 0
        for digit in range(limit + 1):
            new_equal = equal and digit == digits[position]
            rest = remaining - digit
            total += solve(position + 1, rest, new_equal)
        return total

    return solve(0, target, True)
"""
COUNT_PRODUCT = """

def count_product(bound, target, base=10):
    if bound < 1:
        return 0
    digits = digits_in_base(bound, base)

    @cache
    def solve(position, remaining, equal, started):
        if position == len(digits):
            return 1 if started and remaining == 1 else 0
        limit = digits[position] if equal else base - 1
        total = 0
        for digit in range(limit + 1):
            new_equal = equal and digit == digits[position]
            nxt = position + 1
            if not started and digit == 0:
                total += solve(nxt, remaining, new_equal, False)
            elif digit > 0 and remaining % digit == 0:
                rest = remaining // digit
                total += solve(nxt, rest, new_equal, True)
        return total

    return solve(0, target, True, False)
"""

# (page, number in the page) -> task definition; page 8 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 1),
        section="rekursivnoe-opredelenie",
        title="Значение по одному предыдущему",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Начните с базы F(1) = 3 и поднимайтесь: F(2), F(3), F(4), F(5).",
        code="""def F(n):
    if n == 1:
        return 3
    return F(n - 1) + 2 * n


print(F(5))""",
    ),
    dict(
        at=(1, 2),
        section="rekursivnoe-opredelenie",
        title="Утроить и вычесть единицу",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Каждое следующее значение — утроенное предыдущее минус 1.",
        code="""def F(n):
    if n == 1:
        return 2
    return 3 * F(n - 1) - 1


print(F(4))""",
    ),
    dict(
        at=(1, 3),
        section="zapis-f-n",
        title="Скобки после имени функции",
        difficulty=1,
        minutes=3,
        instruction=FOUR,
        hint="F(5 − 1) — значение функции при аргументе 4, а F(5) − 1 — значение при 5 "
        "без единицы.",
        code="""def F(n):
    return 3 * n - 2


print(F(5 - 1), F(5) - 1, F(2 * 3), 2 * F(3))""",
    ),
    dict(
        at=(1, 6),
        section="tablica-predydushchih",
        title="Два предыдущих значения",
        difficulty=1,
        minutes=3,
        instruction=NUMBER,
        hint="Составьте таблицу F(1), F(2), …, F(6): каждому значению нужны два предыдущих.",
        code="""def F(n):
    if n == 1:
        return 2
    if n == 2:
        return 3
    return F(n - 1) + 2 * F(n - 2)


print(F(6))""",
    ),
    dict(
        at=(1, 7),
        section="tablica-predydushchih",
        title="Шаг назад на три",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Нужны F(n − 1) и F(n − 3): заполните таблицу от 1 до 10.",
        code="""def F(n):
    if n <= 3:
        return 1
    return F(n - 1) + F(n - 3)


print(F(10))""",
    ),
    dict(
        at=(1, 8),
        section="tablica-predydushchih",
        title="Задача в формате экзамена: F(6)",
        difficulty=1,
        minutes=4,
        instruction=NUMBER,
        hint="База — n ≤ 2; дальше каждое значение строится по двум предыдущим.",
        code="""def F(n):
    if n <= 2:
        return n + 2
    return 2 * F(n - 1) - F(n - 2) + n


print(F(6))""",
    ),
    dict(
        at=(1, 9),
        section="rekursivnoe-opredelenie",
        title="Задача в формате экзамена: F(5)",
        difficulty=1,
        minutes=3,
        instruction=NUMBER,
        hint="Множитель (n + 1) берётся для текущего аргумента.",
        code="""def F(n):
    if n == 1:
        return 1
    return F(n - 1) * (n + 1)


print(F(5))""",
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 2),
        section="dohodyat-do-bazy",
        title="Дойдёт ли вызов до базы",
        difficulty=2,
        minutes=3,
        instruction="Введите подходящие числа через пробел по возрастанию.",
        hint="Шаг 3 не меняет остаток от деления на 3.",
        code="""def reaches(n):
    while n > 0:
        n -= 3
    return n == 0


print(*[n for n in [9, 10, 12] if reaches(n)])""",
    ),
    dict(
        at=(2, 3),
        section="dohodyat-do-bazy",
        title="Рекурсия вверх",
        difficulty=1,
        minutes=3,
        instruction=NUMBER,
        hint="Аргумент растёт на 3, пока не станет не меньше 20.",
        code="""def F(n):
    if n >= 20:
        return n
    return F(n + 3) + 2


print(F(4))""",
    ),
    dict(
        at=(2, 4),
        section="dohodyat-do-bazy",
        title="Вверх с вычитанием",
        difficulty=1,
        minutes=3,
        instruction=NUMBER,
        hint="База — первый аргумент больше 30 в цепочке 17, 21, 25, …",
        code="""def F(n):
    if n > 30:
        return n
    return F(n + 4) - 1


print(F(17))""",
    ),
    dict(
        at=(2, 5),
        section="usloviya-v-opredelenii",
        title="Ветвь по чётности",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Чётный аргумент берёт предыдущее, нечётный — через один.",
        code="""def F(n):
    if n <= 2:
        return n
    if n % 2 == 0:
        return F(n - 1) + n
    return 2 * F(n - 2)


print(F(12))""",
    ),
    dict(
        at=(2, 6),
        section="usloviya-v-opredelenii",
        title="Ветвь для каждого вызова",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Чётность проверяется для аргумента каждого вызова, а не только для 6.",
        code="""def F(n):
    if n == 1:
        return 5
    if n % 2 == 0:
        return F(n - 1) - 2
    return F(n - 1) + 3 * n


print(F(6))""",
    ),
    dict(
        at=(2, 7),
        section="usloviya-v-opredelenii",
        title="Задача в формате экзамена: F(14)",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="F(14) обращается к F(13), а нечётные аргументы идут через один до 1.",
        code="""def F(n):
    if n == 1:
        return 1
    if n % 2 == 0:
        return n + F(n - 1)
    return 3 * F(n - 2)


print(F(14))""",
    ),
    dict(
        at=(2, 8),
        section="usloviya-v-opredelenii",
        title="Задача в формате экзамена: F(20)",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Ветвь зависит от делимости на 3 текущего аргумента.",
        code="""def F(n):
    if n < 3:
        return n
    if n % 3 == 0:
        return F(n - 1) + n
    return F(n - 2) + 2


print(F(20))""",
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 1),
        section="odno-predydushchee",
        title="Цикл с одной переменной",
        difficulty=1,
        minutes=3,
        instruction=NUMBER,
        hint="`value = 2 * value - n` для n от 2 до 6.",
        code="""value = 4
for n in range(2, 7):
    value = 2 * value - n
print(value)""",
    ),
    dict(
        at=(3, 2),
        section="po-ubyvaniyu",
        title="Таблица по убыванию",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="От 15 аргументы растут через один: 15, 17, 19, 21.",
        code="""F = {}
for n in range(21, 0, -1):
    if n >= 20:
        F[n] = n
    else:
        F[n] = F[n + 2] + n
print(F[15])""",
    ),
    dict(
        at=(3, 4),
        section="svyazannye-funkcii",
        title="Две связанные функции",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="Обе функции берут значения предыдущего шага: обновляйте их одновременно.",
        code="""f, g = 2, 1
for n in range(2, 5):
    f, g = f + g, 2 * f
print(f, g)""",
    ),
    dict(
        at=(3, 6),
        section="summa-predydushchih",
        title="Сумма всех предыдущих",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Храните накопленную сумму: F(n) = сумма + 2.",
        code="""values = [1]
for n in range(2, 7):
    values.append(sum(values) + 2)
print(values[-1])""",
    ),
    dict(
        at=(3, 7),
        section="po-ubyvaniyu",
        title="Задача в формате экзамена: F(30)",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Заполняйте таблицу от баз F(41) и F(40) вниз до 30.",
        code="""F = {}
for n in range(41, 29, -1):
    if n >= 40:
        F[n] = 2
    else:
        F[n] = F[n + 1] + F[n + 2]
print(F[30])""",
    ),
    dict(
        at=(3, 8),
        section="svyazannye-funkcii",
        title="Задача в формате экзамена: F(12) + G(12)",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="На каждом шаге новые F и G считаются по старым значениям обеих функций.",
        code="""f, g = 1, 1
for n in range(2, 13):
    f, g = f + 2 * g, f + g
print(f + g)""",
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 1),
        section="povtornye-vychisleniya",
        title="Вызовы Фибоначчи",
        difficulty=2,
        minutes=5,
        instruction=THREE,
        hint="Число вызовов C(n) = 1 + C(n − 1) + C(n − 2); с кешем каждый аргумент "
        "вычисляется один раз.",
        code="""from functools import cache

calls = 0


def F(n):
    global calls
    calls += 1
    if n <= 2:
        return 1
    return F(n - 1) + F(n - 2)


F(6)
cached_calls = 0
computed = 0


@cache
def G(n):
    global computed
    computed += 1
    if n <= 2:
        return 1
    return H(n - 1) + H(n - 2)


def H(n):
    global cached_calls
    cached_calls += 1
    return G(n)


H(6)
print(calls, cached_calls, computed)""",
    ),
    dict(
        at=(4, 2),
        section="cache",
        title="Два одинаковых вызова",
        difficulty=2,
        minutes=4,
        instruction=THREE,
        hint="Без кеша каждый уровень удваивает число вызовов; с кешем второй вызов F(k − 1) "
        "берёт готовый ответ.",
        code="""from functools import cache

calls = 0


def F(n):
    global calls
    calls += 1
    if n == 1:
        return 1
    return F(n - 1) + F(n - 1)


value = F(5)
cached_calls = 0


@cache
def G(n):
    if n == 1:
        return 1
    return H(n - 1) + H(n - 1)


def H(n):
    global cached_calls
    cached_calls += 1
    return G(n)


H(5)
print(value, calls, cached_calls)""",
    ),
    dict(
        at=(4, 3),
        section="povtornye-vychisleniya",
        title="Множитель — не вызов",
        difficulty=1,
        minutes=3,
        instruction=TWO,
        hint="3F(n − 1) — одно обращение к функции, умноженное на 3.",
        code="""calls = 0


def F(n):
    global calls
    calls += 1
    if n == 1:
        return 1
    return 3 * F(n - 1) + 1


print(F(5), calls)""",
    ),
    dict(
        at=(4, 5),
        section="razmer-argumenta",
        title="Деление аргумента пополам",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="Каждый вызов делит аргумент пополам: таких шагов до 1 немного.",
        code="""calls = 0


def F(n):
    global calls
    calls += 1
    if n == 1:
        return 0
    return F(n // 2) + 1


value = F(1000000)
print(calls, value)""",
    ),
    dict(
        at=(4, 6),
        section="skolko-argumentov",
        title="Сколько аргументов подходит",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Вызовите функцию для каждого n от 1 до 100 и посчитайте совпадения.",
        code="""def F(n):
    if n == 0:
        return 0
    return F(n // 2) + n % 2


print(len([n for n in range(1, 101) if F(n) == 3]))""",
    ),
    dict(
        at=(4, 7),
        section="dve-problemy",
        title="Глубина рекурсии",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Прямая рекурсия упрётся в предел глубины: прогрейте кеш по возрастанию или "
        "посчитайте циклом.",
        code="""value = 1
for n in range(2, 3001):
    value = value + n % 7
print(value)""",
    ),
    dict(
        at=(4, 8),
        section="skolko-argumentov",
        title="Задача в формате экзамена: сколько n",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Посчитайте F(n) для каждого n от 1 до 700.",
        code="""from functools import cache


@cache
def F(n):
    if n == 0:
        return 0
    if n % 2 == 1:
        return F(n - 1) + 1
    return F(n // 2)


print(len([n for n in range(1, 701) if F(n) == 4]))""",
    ),
    dict(
        at=(4, 9),
        section="poisk-argumenta",
        title="Задача в формате экзамена: наименьшее n",
        difficulty=3,
        minutes=7,
        instruction=NUMBER,
        hint="Значения не растут монотонно: перебирайте n по возрастанию до первого подходящего.",
        code="""from functools import cache


@cache
def F(n):
    if n < 100:
        return n
    if n % 3 == 0:
        return n + F(n // 3)
    return F(n - 1) + 5


n = 1
while F(n) <= 2000:
    n += 1
print(n)""",
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="proizvedenie",
        title="Отношение факториалов",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="F(102) = 102 · 101 · F(100), F(101) = 101 · F(100).",
        code="print(101 * 102 + 3 * 101)",
    ),
    dict(
        at=(5, 2),
        section="raznost",
        title="Разность через одно",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Общая часть сокращается: остаются прибавления 97, 99, 101.",
        code="print(97 + 99 + 101)",
    ),
    dict(
        at=(5, 3),
        section="obshchee-neizvestnoe",
        title="Общее неизвестное",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Обозначьте F(34) = X и выразите F(37) и F(40) через X.",
        code="""x = 0
f37 = x + 2 * 37
f40 = f37 + 2 * 40
print(2 * f40 - f37 - x)""",
    ),
    dict(
        at=(5, 4),
        section="cepochki",
        title="Цепочки с шагом 4",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="От 50 и от 51 цепочки попадают в разные базы.",
        code="""def F(n):
    if n <= 6:
        return n
    return F(n - 4) + 5


print(F(50), F(51))""",
    ),
    dict(
        at=(5, 5),
        section="chetnost-i-sokrashchenie",
        title="Отношение при ветвях по чётности",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Выразите F(10) через F(9) и F(7), а их — через F(5).",
        code="""def F(n):
    if n <= 2:
        return 1
    if n % 2 == 1:
        return 2 * F(n - 2)
    return 3 * n * F(n - 1) + F(n - 3)


print(F(10) // F(5))""",
    ),
    dict(
        at=(5, 7),
        section="napravleniya",
        title="Связанные функции в разные стороны",
        difficulty=3,
        minutes=7,
        instruction=NUMBER,
        hint="F уменьшает аргумент на 5 до значения меньше 20, G увеличивает на 6 до 40.",
        code="""def G(n):
    if n >= 40:
        return n
    return G(n + 6) + 1


def F(n):
    if n >= 20:
        return F(n - 5) + 10
    return 2 * G(n + 1)


print(F(48))""",
    ),
    dict(
        at=(5, 8),
        section="arifmetika",
        title="Деление в базе",
        difficulty=2,
        minutes=5,
        instruction=TWO,
        hint="G(22) = 5,5 — дробь; `//` отбросит половину.",
        code="""def G(n):
    if n >= 20:
        return n / 4
    return G(n + 3) + 2


def H(n):
    if n >= 20:
        return n // 4
    return H(n + 3) + 2


print(int(4 * G(1)), 4 * H(1))""",
    ),
    dict(
        at=(5, 9),
        section="proizvedenie",
        title="Задача в формате экзамена: отношение",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="F(2030) = 2032 · F(2029), F(2029) = 2031 · F(2028).",
        code="print((2032 - 3) * 2031)",
    ),
    dict(
        at=(5, 10),
        section="raznost",
        title="Задача в формате экзамена: разность",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="F(3001) раскрывается через F(2997) до F(2993).",
        code="print(3001 + 2997)",
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 1),
        section="dvoichnye-cifry",
        title="Две единицы в двоичной записи",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="F(n) — количество единиц в двоичной записи n.",
        code="""def F(n):
    if n == 0:
        return 0
    return F(n // 2) + n % 2


print(len([n for n in range(1, 128) if F(n) == 2]))""",
    ),
    dict(
        at=(6, 3),
        section="vklad-cifry",
        title="Трёхзначные числа без семёрок",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="F(n) считает семёрки в записи числа.",
        code="""def F(n):
    if n == 0:
        return 0
    if n % 10 == 7:
        return F(n // 10) + 1
    return F(n // 10)


print(len([n for n in range(100, 1000) if F(n) == 0]))""",
    ),
    dict(
        at=(6, 4),
        section="vklad-cifry",
        title="Без чётных цифр",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Сумма чётных цифр равна 0, если чётных цифр нет или все они нули.",
        code="""def F(n):
    if n == 0:
        return 0
    if n % 2 == 0:
        return F(n // 10) + n % 10
    return F(n // 10)


print(len([n for n in range(1000, 10000) if F(n) == 0]))""",
    ),
    dict(
        at=(6, 5),
        section="perenos",
        title="Сумма цифр падает",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Сумма цифр уменьшается только при переносе — у чисел, оканчивающихся на 9.",
        code="""def F(n):
    if n == 0:
        return 0
    return F(n // 10) + n % 10


print(len([n for n in range(1000, 5001) if F(n) > F(n + 1)]))""",
    ),
    dict(
        at=(6, 6),
        section="perenos",
        title="Разность 26",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Переход через t девяток меняет сумму цифр на 1 − 9t.",
        code="""def F(n):
    if n == 0:
        return 0
    return F(n // 10) + n % 10


n = 1
while F(n) - F(n + 1) != 26:
    n += 1
print(n)""",
    ),
    dict(
        at=(6, 7),
        section="prostye-mnozhiteli",
        title="Двойки и пятёрки",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="F(n) = 2a + 3b для n = 2ᵃ · 5ᵇ · c; ищите наименьшее такое число.",
        code="""def F(n):
    if n % 2 == 0:
        return F(n // 2) + 2
    if n % 5 == 0:
        return F(n // 5) + 3
    return 0


n = 1
while F(n) != 13:
    n += 1
print(n)""",
    ),
    dict(
        at=(6, 9),
        section="vklad-cifry",
        title="Задача в формате экзамена: F(n) = 0",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="F(n) — сумма чётных цифр; ноль, если чётные цифры — только нули.",
        code="""def F(n):
    if n == 0:
        return 0
    if n % 2 == 0:
        return F(n // 10) + n % 10
    return F(n // 10)


numbers = range(10**5, 3 * 10**5 + 1)
print(len([n for n in numbers if F(n) == 0]))""",
    ),
    dict(
        at=(6, 10),
        section="dvoichnye-cifry",
        title="Задача в формате экзамена: три единицы",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="F(n) — число единиц двоичной записи: выберите три позиции из двадцати.",
        code="""from math import comb

print(comb(20, 3))""",
    ),
    # ------------------------------------------------------------ subtopic 7
    dict(
        at=(7, 1),
        section="sleva-napravo",
        title="Сумма цифр 5 до 999",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Проверьте ответ функцией `count_sum(999, 5)`.",
        code=DIGITS + COUNT_SUM + "\n\nprint(count_sum(999, 5))",
    ),
    dict(
        at=(7, 2),
        section="sleva-napravo",
        title="Сумма цифр 9 от 100 до 500",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Вычтите числа до 99 из чисел до 500.",
        code=DIGITS + COUNT_SUM + "\n\nprint(count_sum(500, 9) - count_sum(99, 9))",
    ),
    dict(
        at=(7, 3),
        section="vedushchie-nuli",
        title="Произведение цифр 12",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Ведущие нули не входят в произведение, а нуль внутри числа обнуляет его.",
        code=DIGITS + COUNT_PRODUCT + "\n\nprint(count_product(1000, 12))",
    ),
    dict(
        at=(7, 5),
        section="cifry-sleva",
        title="Три единицы в двоичной записи",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Сумма двоичных цифр — количество единиц: `count_sum(100, 3, 2)`.",
        code=DIGITS + COUNT_SUM + "\n\nprint(count_sum(100, 3, 2))",
    ),
    dict(
        at=(7, 6),
        section="sleva-napravo",
        title="Сумма цифр 13 от 1000 до 5000",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Вычтите числа до 999 из чисел до 5000.",
        code=DIGITS + COUNT_SUM + "\n\nprint(count_sum(5000, 13) - count_sum(999, 13))",
    ),
    dict(
        at=(7, 7),
        section="sleva-napravo",
        title="Задача в формате экзамена: сумма цифр 100",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="F(n) — сумма десятичных цифр; перебор до 10¹² невозможен, нужен подсчёт по цифрам.",
        code=DIGITS + COUNT_SUM + "\n\nprint(count_sum(10**12 - 1, 100))",
    ),
    dict(
        at=(7, 8),
        section="vedushchie-nuli",
        title="Задача в формате экзамена: произведение цифр",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="F(n) — произведение цифр в системе с основанием 12.",
        code=DIGITS + COUNT_PRODUCT + "\n\nprint(count_product(2**40, 30, 12))",
    ),
    # --------------------------------------------------------- final page
    dict(
        at=(8, 1),
        title="Ветвь для каждого вызова: F(21)",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Подтема 2: ветвь выбирается для аргумента каждого вызова.",
        code="""def F(n):
    if n == 1:
        return 2
    if n % 2 == 0:
        return F(n - 1) + n
    return 2 * F(n - 2) + n


print(F(21))""",
    ),
    dict(
        at=(8, 2),
        title="Общий множитель",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Подтема 5: F(2027) = 2026 · F(2026), F(2026) = 2025 · F(2025).",
        code="print((2026 + 4) * 2025)",
    ),
    dict(
        at=(8, 3),
        title="Разность при шаге 3",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Подтема 5: раскройте F(4000) до F(3991).",
        code="print((4000 + 2) + (3997 + 2) + (3994 + 2))",
    ),
    dict(
        at=(8, 4),
        title="Первое n с F(n) = 9",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Подтема 4: перебирайте n по возрастанию до первого совпадения.",
        code="""def F(n):
    if n == 0:
        return 0
    if n % 3 == 0:
        return F(n // 3)
    return n % 3 + F(n - n % 3)


n = 0
while F(n) != 9:
    n += 1
print(n)""",
    ),
    dict(
        at=(8, 5),
        title="Две функции и точное деление",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="Подтемы 3 и 5: F уходит вниз шагами по 3, G — вверх шагами по 5; делите точно.",
        code="""def G(n):
    if n >= 50:
        return n / 4
    return G(n + 5) + 3


def F(n):
    if n >= 15:
        return F(n - 3) + 7
    return 4 * (G(n + 2) - 3)


print(int(F(100)))""",
    ),
]


if __name__ == "__main__":
    sys.exit(main(HERE, 16, TASKS, RETIRED, RELINK))
