"""Topic 25 bank tasks for the site lesson (Change 171, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I docs/artifacts/lesson-design/topic-25/bank.py          # check only
    python3 -I docs/artifacts/lesson-design/topic-25/bank.py --write  # update the bank

Every checkable task of the subtopic pages and of «Практика и итог» becomes a
bank task; the «объясни, почему» questions live in the lesson as subtopic
self-checks instead. A statement is the subtopic's question verbatim. The
answer is what the task's own solution program prints, collapsed to one line
(the checker collapses whitespace too), and it must agree with the answer
written in the subtopic file. ``apps/api/tests/test_task_25_bank.py``
recomputes every answer independently by full enumeration.

``--write`` replaces this topic's tasks in ``content/practice-bank/bank.json``,
archives the eight tasks of the retired ``integer-processing`` lesson and
replaces its material with the registry entry of the new lesson. Run Prettier
on the bank afterwards.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[3]
BANK = REPO / "content/practice-bank/bank.json"
REGISTRY = REPO / "apps/api/practice-registry.json"
MATERIAL = "divisors-and-masks"
RETIRED_MATERIAL = "integer-processing"
RETIRED = [f"task-25-{n:02d}" for n in range(1, 9)]
TASK_BLOCK = ("**Чтобы проверить понимание", "**Задачи основных подтем")
FILES = {
    1: "01-perebor-i-proverki.md",
    2: "02-deliteli-parami.md",
    3: "03-chisla-po-delitelyam.md",
    4: "04-prostye-i-razlozhenie.md",
    5: "05-maski.md",
    6: "06-vid-chisla.md",
    7: "07-praktika-i-itog.md",
}
ADVANCED = {6}
MAX_CODE_LINE = 64

DIVISORS = """from math import isqrt


def get_divisors(n):
    divisors = []
    for d in range(1, isqrt(n) + 1):
        if n % d == 0:
            divisors.append(d)
            q = n // d
            if q != d:
                divisors.append(q)
    return sorted(divisors)
"""

COUNT = """from math import isqrt


def count_divisors(n):
    count = 0
    for d in range(1, isqrt(n) + 1):
        if n % d == 0:
            if d * d == n:
                count += 1
            else:
                count += 2
    return count
"""

CALC_M = """from math import isqrt


def calc_m(n):
    for d in range(2, isqrt(n) + 1):
        if n % d == 0:
            return d + n // d
    return 0
"""

FACTORS = """def prime_factors(n):
    factors = []
    m = n
    d = 2
    while d * d <= m:
        while m % d == 0:
            factors.append(d)
            m //= d
        d += 1
    if m > 1:
        factors.append(m)
    return factors


def prime_divisors(n):
    P = sorted(set(prime_factors(n)))
    return [p for p in P if p != n]
"""

PRIME = """from math import isqrt


def is_prime(n):
    if n < 2:
        return False
    for d in range(2, isqrt(n) + 1):
        if n % d == 0:
            return False
    return True
"""

ROWS = "Запишите все строки ответа подряд в одну строку через пробел: "

# (subtopic, number in the subtopic file) -> task definition.
# section: the step the task trains (theory link); none on the final page.
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 1),
        section="delenie-s-ostatkom",
        title="Найдите частное и остаток",
        difficulty=1,
        minutes=3,
        instruction="Введите частное и остаток через пробел.",
        hint="Сколько полных порций по 12 помещается в 145 и сколько остаётся сверх них?",
        explain="145 = 12·12 + 1: полных порций по 12 — двенадцать, сверх них остаётся 1. "
        "Частное 12, остаток 1, и он меньше делителя 12.",
        code="print(145 // 12, 145 % 12)",
    ),
    dict(
        at=(1, 2),
        section="uslovie-v-kod",
        title="Посчитайте кратные 7, но не 5",
        difficulty=1,
        minutes=5,
        instruction="Введите количество чисел.",
        hint="«Делится на 7, но не делится на 5» — две проверки остатка, соединённые и. "
        "Правая граница 2000 входит в отрезок.",
        explain="114: из 143 кратных 7 исключаем 29 кратных 35. "
        "Программа переводит условие буквально: остаток при делении на 7 равен нулю, "
        "а при делении на 5 — нет.",
        code="""count = 0
for n in range(1000, 2001):
    if n % 7 == 0 and n % 5 != 0:
        count += 1
print(count)""",
    ),
    dict(
        at=(1, 4),
        section="operacii-s-ciframi",
        title="Посчитайте числа, оканчивающиеся на 37",
        difficulty=1,
        minutes=5,
        instruction="Введите количество чисел.",
        hint="Две последние цифры числа — это остаток от деления на 100.",
        explain="33: числа вида …37, кратные 3, идут через 300. "
        "Проверка окончания — n % 100 == 37, проверка делимости — n % 3 == 0.",
        code="""count = 0
for n in range(10000, 20001):
    if n % 100 == 37 and n % 3 == 0:
        count += 1
print(count)""",
    ),
    dict(
        at=(1, 5),
        section="operacii-s-ciframi",
        title="Посчитайте числа с суммой цифр 10",
        difficulty=1,
        minutes=5,
        instruction="Введите количество чисел.",
        hint="Сумму цифр удобно получить из записи числа: перебрать символы str(n) и "
        "сложить их значения.",
        explain="63. Для каждого числа сумма цифр складывается из символов его записи; "
        "подходят числа, у которых она равна 10.",
        code="""count = 0
for n in range(1, 1001):
    digit_sum = 0
    for ch in str(n):
        digit_sum += int(ch)
    if digit_sum == 10:
        count += 1
print(count)""",
    ),
    dict(
        at=(1, 6),
        section="proverka-in",
        title="Сравните count и вхождения с перекрытием",
        difficulty=1,
        minutes=4,
        instruction="Введите два числа через пробел: что вернёт count и сколько вхождений "
        "с перекрытием.",
        hint="После найденного вхождения count продолжает поиск сразу за ним. "
        "Вхождения с перекрытием можно перебрать по позиции начала.",
        explain="count вернёт 2; с перекрытием вхождений три: группа 77 начинается "
        "с позиций 0, 1 и 2.",
        code="""s = "7777"
overlap = 0
for i in range(len(s) - 1):
    if s[i:i + 2] == "77":
        overlap += 1
print(s.count("77"), overlap)""",
    ),
    dict(
        at=(1, 7),
        section="perebor-po-ubyvaniyu",
        title="Найдите три наибольших подходящих числа",
        difficulty=2,
        minutes=8,
        instruction="Введите три числа через пробел, от большего к меньшему.",
        hint="Нужны наибольшие числа — перебирайте вниз от 499 999 и остановитесь, "
        "как только найдутся три.",
        explain="499109, 498069, 497809. Перебор по убыванию сразу даёт наибольшие "
        "подходящие числа, поэтому после третьего найденного цикл можно прервать.",
        code="""found = []
for n in range(499999, 0, -1):
    if n % 13 == 0 and n % 10 == 9 and "0" in str(n):
        found.append(n)
        if len(found) == 3:
            break
print(*found)""",
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 3),
        section="schetchik-delitelej",
        title="Посчитайте делители 360",
        difficulty=1,
        minutes=4,
        instruction="Введите количество делителей.",
        hint="Ищите делители парами до isqrt(n): обычная пара добавляет 2, "
        "пара вида d · d = n — 1.",
        explain="24. Счётчику не нужен список: каждая найденная пара разных делителей "
        "добавляет два, а 360 не квадрат, поэтому пар из одного числа нет.",
        code=COUNT + "\n\nprint(count_divisors(360))",
    ),
    dict(
        at=(2, 4),
        section="otbor-delitelej",
        title="Выпишите чётные делители 90",
        difficulty=1,
        minutes=4,
        instruction="Введите делители через пробел в порядке возрастания.",
        hint="Сначала найдите все делители, затем оставьте те, что делятся на 2.",
        explain="2, 6, 10, 18, 30, 90. Условие проверяется у делителя d, а не у числа 90.",
        code=DIVISORS
        + """

D = [d for d in get_divisors(90) if d % 2 == 0]
print(*D)""",
    ),
    dict(
        at=(2, 7),
        section="otbor-delitelej",
        title="Найдите числа с четырьмя делителями без 1 и n",
        difficulty=3,
        minutes=12,
        instruction=ROWS
        + "в каждой строке число и его четыре делителя по возрастанию.",
        hint="Для каждого числа отрезка найдите делители, оставьте 1 < d < n и "
        "проверьте, что их ровно четыре. Обе границы отрезка входят в перебор.",
        explain="Подходят два числа: 312404 с делителями 2, 4, 78101, 156202 и 312425 "
        "с делителями 5, 25, 12497, 62485.",
        code=DIVISORS
        + """

for n in range(312400, 312451):
    D = [d for d in get_divisors(n) if 1 < d < n]
    if len(D) == 4:
        print(n, *D)""",
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 1),
        section="rovno-k-delitelej",
        title="Найдите числа с четырьмя делителями от 20 до 40",
        difficulty=2,
        minutes=6,
        instruction=ROWS
        + "в каждой строке число и его четыре делителя по возрастанию.",
        hint="Для каждого числа отрезка оставьте делители 1 < d < n и проверьте, "
        "что их ровно четыре.",
        explain="Подходят 20 (2, 4, 5, 10), 28 (2, 4, 7, 14) и 32 (2, 4, 8, 16).",
        code=DIVISORS
        + """

for n in range(20, 41):
    D = [d for d in get_divisors(n) if 1 < d < n]
    if len(D) == 4:
        print(n, *D)""",
    ),
    dict(
        at=(3, 2),
        section="velichina-m",
        title="Вычислите M для числа 48",
        difficulty=1,
        minutes=4,
        instruction="Введите значение M.",
        hint="Выпишите делители 48 без 1 и 48 по возрастанию; два наибольших стоят в конце.",
        explain="Два наибольших подходящих делителя — 24 и 16, поэтому M = 40.",
        code=DIVISORS
        + """

D = [d for d in get_divisors(48) if 1 < d < 48]
print(D[-1] + D[-2])""",
    ),
    dict(
        at=(3, 3),
        section="naimenshij-i-naibolshij",
        title="Вычислите calc_m для трёх чисел",
        difficulty=1,
        minutes=5,
        instruction="Введите три значения через пробел: calc_m(91), calc_m(97), calc_m(121).",
        hint="Наименьший делитель больше 1 и его пара — это наибольший делитель "
        "меньше n. Если такого делителя нет, функция возвращает 0.",
        explain="20 (91 = 7·13), 0 (97 простое), 22 (у 121 единственный подходящий "
        "делитель 11, он и наименьший, и наибольший).",
        code=CALC_M + "\n\nprint(calc_m(91), calc_m(97), calc_m(121))",
    ),
    dict(
        at=(3, 4),
        section="maksimum-delitelej",
        title="Найдите число с наибольшим количеством делителей",
        difficulty=2,
        minutes=6,
        instruction="Введите количество делителей и само число через пробел.",
        hint="Храните лучший результат и заменяйте его только при строго большем "
        "количестве — так при равенстве останется наименьшее число.",
        explain="32 1080. На отрезке [1000; 1100] наибольшее количество делителей, 32, "
        "только у 1080.",
        code=COUNT
        + """

best_count = 0
best_n = 0
for n in range(1000, 1101):
    count = count_divisors(n)
    if count > best_count:
        best_count = count
        best_n = n
print(best_count, best_n)""",
    ),
    dict(
        at=(3, 6),
        section="pervye-posle-granicy",
        extra_sections=["naimenshij-i-naibolshij"],
        title="Найдите пять чисел с M, оканчивающимся на 6",
        difficulty=3,
        minutes=12,
        instruction=ROWS + "в каждой строке число и M.",
        hint="M — это наименьший делитель больше 1 и его пара. Перебирайте числа "
        "после 600 000 по возрастанию, пока не найдутся пять, — верхняя граница не нужна.",
        explain="Проверка одной строки вручную: наименьший делитель 600 023, больший 1, — "
        "это 149, потому что 600 023 = 149 · 4027. Значит, M = 149 + 4027 = 4176, "
        "оно оканчивается на 6.",
        code=CALC_M
        + """

n = 600001
found = 0
while found < 5:
    M = calc_m(n)
    if M > 0 and M % 10 == 6:
        print(n, M)
        found += 1
    n += 1""",
    ),
    dict(
        at=(3, 7),
        section="pervye-posle-granicy",
        extra_sections=["velichina-m"],
        title="Найдите пять чисел с M(N), кратным 101",
        difficulty=3,
        minutes=14,
        instruction=ROWS + "в каждой строке N и M(N).",
        hint="M(N) — сумма двух последних элементов отсортированного списка делителей "
        "без 1 и N. Если таких делителей меньше двух, M(N) = 0 и число не подходит.",
        explain="Для каждого числа после 2 000 000 строим список делителей без 1 и N, "
        "складываем два наибольших и проверяем делимость на 101. Первые пять "
        "подходящих чисел — 2000103, 2000204, 2000305, 2000406 и 2000589.",
        code=DIVISORS
        + """

def calc_m(n):
    D = [d for d in get_divisors(n) if 1 < d < n]
    if len(D) < 2:
        return 0
    return D[-1] + D[-2]


n = 2000001
found = 0
while found < 5:
    M = calc_m(n)
    if M > 0 and M % 101 == 0:
        print(n, M)
        found += 1
    n += 1""",
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 2),
        section="razlozhenie",
        title="Разложите 1960 на простые множители",
        difficulty=1,
        minutes=4,
        instruction="Введите множители через пробел в порядке неубывания, с повторениями.",
        hint="Делите на 2, пока делится, затем на 3, 5, 7 и так далее.",
        explain="1960 = 2 · 2 · 2 · 5 · 7 · 7 = 2³ · 5 · 7².",
        code=FACTORS + "\n\nprint(*prime_factors(1960))",
    ),
    dict(
        at=(4, 3),
        section="prostye-deliteli",
        extra_sections=["mnozhiteli-i-deliteli"],
        title="Сравните простые делители и множители 72",
        difficulty=1,
        minutes=4,
        instruction="Введите два числа через пробел: количество различных простых "
        "делителей и количество простых множителей с повторениями.",
        hint="Разложите 72 и посчитайте множители дважды: без повторов и с повторами.",
        explain="Различных — 2 (это 2 и 3), с повторениями — 5 (2, 2, 2, 3, 3).",
        code=FACTORS
        + """

f = prime_factors(72)
print(len(set(f)), len(f))""",
    ),
    dict(
        at=(4, 4),
        section="prostye-deliteli",
        title="Найдите наибольший простой делитель 999 999",
        difficulty=1,
        minutes=4,
        instruction="Введите простой делитель.",
        hint="Наибольший простой делитель — последний множитель разложения.",
        explain="37: 999 999 = 3³ · 7 · 11 · 13 · 37.",
        code=FACTORS + "\n\nprint(max(prime_factors(999999)))",
    ),
    dict(
        at=(4, 5),
        section="prostye-deliteli",
        title="Выпишите простые делители 990",
        difficulty=1,
        minutes=4,
        instruction="Введите делители через пробел в порядке возрастания.",
        hint="Простые делители — различные множители разложения.",
        explain="2, 3, 5, 11: 990 = 2 · 3 · 3 · 5 · 11, повтор тройки в ответ не входит.",
        code=FACTORS + "\n\nprint(*prime_divisors(990))",
    ),
    dict(
        at=(4, 6),
        section="cifry-mnozhitelej",
        extra_sections=["mnozhiteli-i-deliteli"],
        title="Найдите произведения двух простых с цифрой 7",
        difficulty=3,
        minutes=12,
        instruction=ROWS + "в каждой строке число и наибольший из множителей.",
        hint="Разложение должно состоять ровно из двух множителей с повторениями, "
        "и цифра 7 должна быть в записи каждого — проверьте это через all.",
        explain="Длина разложения с повторениями равна 2 — это «ровно два простых "
        "множителя, не обязательно различных»; all проверяет цифру 7 у каждого.",
        code=FACTORS
        + """

n = 3000001
found = 0
while found < 5:
    f = prime_factors(n)
    if len(f) == 2 and all("7" in str(p) for p in f):
        print(n, max(f))
        found += 1
    n += 1""",
    ),
    dict(
        at=(4, 7),
        section="prostye-deliteli",
        title="Найдите пять чисел с суммой простых делителей на 7",
        difficulty=3,
        minutes=12,
        instruction=ROWS + "в каждой строке число и S.",
        hint="S — сумма различных простых делителей без самого числа. У простого "
        "числа таких делителей нет, и S = 0.",
        explain="Для каждого числа после 2 500 000 берём различные простые делители, "
        "кроме самого числа, и проверяем три условия на S: не ноль, не больше 5000, "
        "последняя цифра 7.",
        code=FACTORS
        + """

n = 2500001
found = 0
while found < 5:
    S = sum(prime_divisors(n))
    if S != 0 and S <= 5000 and S % 10 == 7:
        print(n, S)
        found += 1
    n += 1""",
    ),
    dict(
        at=(4, 8),
        section="prostye-deliteli",
        title="Найдите пять чисел с простым M больше 1000",
        difficulty=3,
        minutes=14,
        instruction=ROWS + "в каждой строке число и M.",
        hint="Простые делители уже отсортированы: наименьший — первый, наибольший — "
        "последний. Простоту M проверьте отдельной функцией.",
        explain="Для каждого числа после 5 000 000 берём различные простые делители, "
        "кроме самого числа, складываем наименьший и наибольший и проверяем, что "
        "сумма больше 1000 и проста.",
        code=FACTORS
        + "\n\n"
        + PRIME.replace("from math import isqrt\n\n\n", "")
        + """

n = 5000001
found = 0
while found < 5:
    P = prime_divisors(n)
    if P:
        M = P[0] + P[-1]
        if M > 1000 and is_prime(M):
            print(n, M)
            found += 1
    n += 1""",
        prelude="from math import isqrt\n\n\n",
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="znaki-maski",
        title="Отберите числа по маске 12*3?",
        difficulty=1,
        minutes=4,
        instruction="Введите подходящие числа через пробел в том порядке, в котором они "
        "перечислены.",
        hint="Знак ? — ровно одна цифра, * — любое количество цифр, в том числе ни одной.",
        explain="Подходят 1234, 120034 и 12934. У 12304 после «3» стоят две цифры, "
        "а у 123 после «3» нет цифры для ?.",
        code="""from fnmatch import fnmatch

for s in ["1234", "12304", "120034", "123", "12934"]:
    if fnmatch(s, "12*3?"):
        print(s)""",
    ),
    dict(
        at=(5, 2),
        section="dlina-zvezdochki",
        title="Посчитайте числа по маске 4?*7",
        difficulty=1,
        minutes=5,
        instruction="Введите количество чисел.",
        hint="Сначала определите, сколько цифр может занять звёздочка, если в числе "
        "не больше пяти цифр.",
        explain="В маске три обязательные цифры: 4, одна цифра вместо ? и 7. Числа "
        "меньше 100 000 имеют не более пяти цифр, поэтому длина звёздочки 0, 1 или 2. "
        "Всего 10 · (1 + 10 + 100) = 1110.",
        code="""from fnmatch import fnmatch

count = 0
for n in range(1, 100000):
    if fnmatch(str(n), "4?*7"):
        count += 1
print(count)""",
    ),
    dict(
        at=(5, 3),
        section="perebor-kratnyh",
        title="Найдите кратные 7 по маске 1?2",
        difficulty=1,
        minutes=5,
        instruction=ROWS + "в каждой строке число и частное от деления на 7.",
        hint="Перебирайте только кратные 7 и проверяйте маску у их записи.",
        explain="Подходят 112 = 7 · 16 и 182 = 7 · 26.",
        code="""from fnmatch import fnmatch

for n in range(7, 1001, 7):
    if fnmatch(str(n), "1?2"):
        print(n, n // 7)""",
    ),
    dict(
        at=(5, 5),
        section="dlina-zvezdochki",
        extra_sections=["ocenka-kandidatov"],
        title="Посчитайте числа по маске 1?2*",
        difficulty=1,
        minutes=5,
        instruction="Введите количество чисел.",
        hint="Обязательных цифр три, а всего цифр не больше пяти.",
        explain="1110: длина звёздочки от 0 до 2, на месте ? десять цифр.",
        code="""from fnmatch import fnmatch

count = 0
for n in range(1, 100000):
    if fnmatch(str(n), "1?2*"):
        count += 1
print(count)""",
    ),
    dict(
        at=(5, 6),
        section="generaciya-po-maske",
        title="Постройте числа по маске 3?8?405",
        difficulty=2,
        minutes=8,
        instruction=ROWS + "в каждой строке число и частное от деления на 53.",
        hint="В маске нет звёздочки — переменных мест всего два, это 100 записей. "
        "Постройте их и проверьте делимость.",
        explain="Только ? — генерируем 100 записей: 3783405 = 53 · 71385 и "
        "3889405 = 53 · 73385.",
        code="""for a in range(10):
    for c in range(10):
        n = int("3" + str(a) + "8" + str(c) + "405")
        if n % 53 == 0:
            print(n, n // 53)""",
    ),
    dict(
        at=(5, 7),
        section="perebor-kratnyh",
        title="Найдите кратные 2027 по маске 12?4*76",
        difficulty=3,
        minutes=12,
        instruction=ROWS + "в каждой строке число и частное от деления на 2027.",
        hint="Кратных 2027 до 10⁸ меньше 50 000 — их можно перебрать все и проверить "
        "маску через fnmatch.",
        explain="Перебор кратных 2027 даёт четыре числа: 12340376, 12543076, 12745776 "
        "и 12948476; частные идут через 100.",
        code="""from fnmatch import fnmatch

for n in range(2027, 10**8 + 1, 2027):
    if fnmatch(str(n), "12?4*76"):
        print(n, n // 2027)""",
    ),
    # ------------------------------------------------------- subtopic 6 (advanced)
    dict(
        at=(6, 1),
        section="forma-chisla",
        title="Найдите числа с пятью делителями до 100",
        difficulty=2,
        minutes=6,
        instruction="Введите числа через пробел в порядке возрастания.",
        hint="Пять — простое число, поэтому формула количества делителей оставляет "
        "только вид p⁴.",
        explain="Ровно пять делителей у чисел вида p⁴: 2⁴ = 16 и 3⁴ = 81. Следующее, "
        "5⁴ = 625, больше 100.",
        code=COUNT
        + """

print(*[n for n in range(1, 101) if count_divisors(n) == 5])""",
    ),
    dict(
        at=(6, 2),
        section="forma-chisla",
        title="Найдите числа с тремя делителями после 50",
        difficulty=2,
        minutes=6,
        instruction="Введите три числа через пробел в порядке возрастания.",
        hint="Ровно три делителя бывают только у квадратов простых чисел.",
        explain="121, 169, 289 — квадраты простых 11, 13, 17. Число 81 не подходит: "
        "81 = 3⁴, у него пять делителей.",
        code=COUNT
        + """

found = []
n = 51
while len(found) < 3:
    if count_divisors(n) == 3:
        found.append(n)
    n += 1
print(*found)""",
    ),
    dict(
        at=(6, 3),
        section="formula-kolichestva",
        title="Посчитайте делители 72 по разложению",
        difficulty=2,
        minutes=5,
        instruction="Введите три числа через пробел: количество всех, чётных и нечётных "
        "делителей.",
        hint="72 = 2³ · 3². Нечётный делитель не содержит двойки, чётный содержит "
        "её хотя бы раз.",
        explain="72 = 2³ · 3²: всех — 12, чётных — 9, нечётных — 3. Программа "
        "проверяет формулу перебором делителей.",
        code=DIVISORS
        + """

D = get_divisors(72)
even = [d for d in D if d % 2 == 0]
print(len(D), len(even), len(D) - len(even))""",
    ),
    dict(
        at=(6, 4),
        section="formula-kolichestva",
        title="Посчитайте делители 1960 по разложению",
        difficulty=2,
        minutes=4,
        instruction="Введите количество делителей.",
        hint="Количество делителей — произведение показателей разложения, "
        "увеличенных на единицу.",
        explain="24: (3 + 1)(1 + 1)(2 + 1).",
        code=COUNT + "\n\nprint(count_divisors(1960))",
    ),
    dict(
        at=(6, 5),
        section="nechetnoe-kolichestvo",
        title="Посчитайте числа с нечётным числом делителей",
        difficulty=2,
        minutes=5,
        instruction="Введите количество чисел.",
        hint="Делители образуют пары; без пары остаётся только корень квадрата.",
        explain="100: это квадраты 1², 2², …, 100².",
        code=COUNT
        + """

count = 0
for n in range(1, 10001):
    if count_divisors(n) % 2 == 1:
        count += 1
print(count)""",
    ),
    dict(
        at=(6, 6),
        section="vid-vmesto-perebora",
        title="Найдите числа вида 2ᵐ · 3ⁿ на огромном отрезке",
        difficulty=3,
        minutes=10,
        instruction="Введите числа через пробел в порядке возрастания.",
        hint="Перебирайте показатели m и n, а не числа отрезка: степеней двойки и "
        "тройки до 6·10⁸ всего несколько десятков.",
        explain="Перебираем показатели, а не числа: m — чётные от 0, n — нечётные, "
        "и оставляем произведения из отрезка. Подходят восемь чисел.",
        code="""found = []
for m in range(0, 40, 2):
    for k in range(1, 40, 2):
        N = 2**m * 3**k
        if 2 * 10**8 <= N <= 6 * 10**8:
            found.append(N)
print(*sorted(found))""",
    ),
    # ------------------------------------------------------ «Практика и итог»
    dict(
        at=(7, 1),
        title="Найдите числа с двумя делителями без 1 и n",
        difficulty=3,
        minutes=10,
        instruction=ROWS + "в каждой строке число и два его делителя по возрастанию.",
        hint="Подтемы 2 и 3: делители парами и отбор «без 1 и самого числа».",
        explain="Для каждого числа отрезка оставляем делители 1 < d < n и берём числа, "
        "у которых их ровно два. Подтемы 2 и 3: делители парами и отбор «без 1 и "
        "самого числа».",
        code=DIVISORS
        + """

for n in range(500035, 500056):
    D = [d for d in get_divisors(n) if 1 < d < n]
    if len(D) == 2:
        print(n, *D)""",
    ),
    dict(
        at=(7, 2),
        title="Найдите пять чисел с наибольшим простым делителем на 7",
        difficulty=3,
        minutes=12,
        instruction=ROWS + "в каждой строке число и M.",
        hint="Подтема 4: простые делители через разложение.",
        explain="M — наибольший из различных простых делителей, кроме самого числа; "
        "у простого числа таких делителей нет, и M = 0. Подтема 4: простые делители "
        "через разложение.",
        code=FACTORS
        + """

n = 1200001
found = 0
while found < 5:
    P = prime_divisors(n)
    M = max(P) if P else 0
    if 0 < M <= 1000 and M % 10 == 7:
        print(n, M)
        found += 1
    n += 1""",
    ),
    dict(
        at=(7, 3),
        title="Найдите кратные 1301 по маске 8?4*21",
        difficulty=3,
        minutes=12,
        instruction=ROWS + "в каждой строке число и частное от деления на 1301.",
        hint="Подтема 5: перебор кратных 1301 и проверка маски.",
        explain="Кратных 1301 до 10⁸ меньше 77 000, поэтому их можно перебрать и "
        "проверить маску у каждого. Подтема 5: перебор кратных 1301 и проверка маски.",
        code="""from fnmatch import fnmatch

for n in range(1301, 10**8 + 1, 1301):
    if fnmatch(str(n), "8?4*21"):
        print(n, n // 1301)""",
    ),
    dict(
        at=(7, 4),
        title="Найдите произведения трёх простых с цифрой 3",
        difficulty=3,
        minutes=12,
        instruction=ROWS + "в каждой строке число и его три множителя по неубыванию.",
        hint="Подтема 4: длина разложения с повторениями и all для цифр.",
        explain="Разложение с повторениями должно состоять ровно из трёх множителей, "
        "и в записи каждого есть цифра 3. Подтема 4: длина разложения с повторениями "
        "и all для цифр.",
        code=FACTORS
        + """

n = 1000001
found = 0
while found < 5:
    f = prime_factors(n)
    if len(f) == 3 and all("3" in str(p) for p in f):
        print(n, *f)
        found += 1
    n += 1""",
    ),
    dict(
        at=(7, 5),
        title="Найдите число с наибольшим количеством делителей",
        difficulty=2,
        minutes=8,
        instruction="Введите количество делителей и само число через пробел.",
        hint="Подтема 3: хранение лучшего результата.",
        explain="80 200070. Лучший результат заменяется только при строго большем "
        "количестве делителей, поэтому при равенстве остаётся наименьшее число. "
        "Подтема 3: хранение лучшего результата.",
        code=COUNT
        + """

best_count = 0
best_n = 0
for n in range(200000, 200101):
    count = count_divisors(n)
    if count > best_count:
        best_count = count
        best_n = n
print(best_count, best_n)""",
    ),
]


def task_inventory(block: str) -> dict[int, tuple[str, str]]:
    questions, _, answers = block.partition("\n**Ответы для проверки:**\n")

    def numbered(text: str) -> dict[int, str]:
        found = re.split(r"(?m)^(\d+)\. ", text)
        return {
            int(found[k]): found[k + 1].strip() for k in range(1, len(found) - 1, 2)
        }

    q, a = numbered(questions), numbered(answers)
    return {n: (q[n], a.get(n, "")) for n in q}


def inventory() -> dict[int, dict[int, tuple[str, str]]]:
    result = {}
    for sub, name in FILES.items():
        steps = [s.strip() for s in re.split(r"\n---\n", (HERE / name).read_text())]
        block = next(s for s in steps if s.startswith(TASK_BLOCK))
        result[sub] = task_inventory(block)
    return result


def statement(question: str) -> list[dict]:
    """The question verbatim; an indented fence becomes its own text block."""
    blocks = []
    parts = re.split(r"\n\s*```(\w*)\n(.*?)\n\s*```", question, flags=re.S)
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


def run(code: str) -> str:
    done = subprocess.run(
        [sys.executable, "-I", "-c", code], capture_output=True, text=True, timeout=300
    )
    if done.returncode:
        raise SystemExit(done.stderr)
    return done.stdout


WORDS = {"два": "2", "две": "2", "три": "3", "четыре": "4", "пять": "5"}


def numbers(text: str) -> list[str]:
    text = re.sub(r"\b(" + "|".join(WORDS) + r")\b", lambda m: WORDS[m.group(1)], text)
    return re.findall(r"(?<![\d])\d[\d ]*\d(?!\d)|\d", text.replace(" ", " "))


def agrees(answer: str, written: str) -> bool:
    """Every number of the answer appears in the written answer, in order."""
    written_numbers = [n.replace(" ", "") for n in numbers(written)]
    # A grouped number like «600 023» is also a run of separate numbers.
    flat = [d for n in numbers(written) for d in n.split(" ")]
    for pool in (written_numbers, flat):
        it = iter(pool)
        if all(any(token == n for n in it) for token in answer.split()):
            return True
    return False


def build() -> list[dict]:
    texts = inventory()
    sections = {m["id"]: m for m in json.loads(REGISTRY.read_text())["materials"]}[
        MATERIAL
    ]["sections"]
    tasks = []
    for position, spec in enumerate(TASKS):
        sub, number = spec["at"]
        question, written = texts[sub][number]
        code = spec["code"]
        output = run(spec.get("prelude", "") + code)
        answer = " ".join(output.split())
        if not agrees(answer, written):
            raise SystemExit(
                f"{spec['at']}: program prints {answer!r}, file says {written!r}"
            )
        full_code = spec.get("prelude", "") + code
        long = [line for line in full_code.split("\n") if len(line) > MAX_CODE_LINE]
        if long:
            raise SystemExit(f"{spec['at']}: code lines over {MAX_CODE_LINE}: {long}")
        links = []
        for section in [spec.get("section"), *spec.get("extra_sections", [])]:
            if section is None:
                continue
            if section not in sections:
                raise SystemExit(f"{spec['at']}: unknown section {section}")
            links.append(
                {"label": "Теория", "section": section, "material_id": MATERIAL}
            )
        explanation = [
            {"type": "text", "data": {"markdown": spec["explain"]}},
            {
                "type": "code_example",
                "data": {
                    "language": "python",
                    "code": full_code,
                    "caption": "Решение программой",
                },
            },
        ]
        if "\n" in output.strip():
            explanation.append(
                {
                    "type": "code_example",
                    "data": {
                        "language": "text",
                        "code": output.strip(),
                        "caption": "Программа выведет",
                    },
                }
            )
        membership = {"position": position, "material_id": MATERIAL}
        if sub in ADVANCED:
            membership["counts_toward_mastery"] = False
        tasks.append(
            {
                "task": {
                    "id": f"task-25-{sub}-{number:02d}",
                    "title": spec["title"],
                    "short_description": None,
                    "explanation_kind": "worked_solution",
                    "difficulty": spec["difficulty"],
                    "estimated_minutes": spec["minutes"],
                    "answer_instruction": spec["instruction"],
                    "interaction_type": "production",
                    "content_schema_version": 1,
                    "statement": statement(question),
                    "hint": [{"type": "text", "data": {"markdown": spec["hint"]}}],
                    "explanation": explanation,
                    "skills": [],
                    "exam_numbers": [25],
                    "files": [],
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
                        "answer_variants": [answer],
                        "numeric_tolerance": None,
                    },
                },
                "solution_revision": 1,
            }
        )
    return tasks


def main() -> int:
    tasks = build()
    for entry in tasks:
        task = entry["task"]
        print(task["id"], "|", task["checker"]["answer_variants"][0][:70])
    if "--write" not in sys.argv:
        print(f"{len(tasks)} tasks agree with the subtopic files (dry run)")
        return 0
    bank = json.loads(BANK.read_text())
    new_ids = {entry["task"]["id"] for entry in tasks}
    kept = [entry for entry in bank["tasks"] if entry["task"]["id"] not in new_ids]
    for entry in kept:
        task = entry["task"]
        if task["id"] in RETIRED:
            task.update(
                archived=True, catalog_visible=False, lessons=[], theory_links=[]
            )
    bank["tasks"] = kept + tasks
    registry = {m["id"]: m for m in json.loads(REGISTRY.read_text())["materials"]}
    bank["materials"] = [
        registry[MATERIAL] if m["id"] == RETIRED_MATERIAL else m
        for m in bank["materials"]
        if m["id"] != MATERIAL
    ]
    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote {len(tasks)} tasks; archived {len(RETIRED)}; run Prettier on {BANK}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
