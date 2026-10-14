"""Topic 5 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-5/bank.py          # check only
    python3 -I content/lesson-design/topic-5/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. The lesson
replaces the earlier «Преобразование записей чисел» (same id and route):
``--write`` also archives that lesson's tasks (``RETIRED``); catalog tasks link
the lesson as a whole, without a section. ``apps/api/tests/test_task_5_bank.py``
recomputes every answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, TWO, main  # noqa: E402

RETIRED = frozenset(
    {
        "preobrazovanie-zapisey-appending",
        "preobrazovanie-zapisey-base-three",
        "preobrazovanie-zapisey-digit-replacement",
        "preobrazovanie-zapisey-non-monotonic-maximum",
        "preobrazovanie-zapisey-parity",
    }
)

# The lesson's own conversion to any base (subtopic 1).
TO_BASE = """def to_base(n, q):
    if n == 0:
        return '0'

    s = ''
    x = n

    while x > 0:
        digit = x % q
        s = str(digit) + s
        x = x // q

    return s


"""

# (page, number in the page) -> task definition; page 7 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 1),
        section="perevod-deleniem",
        title="22 в двоичной и троичной",
        difficulty=1,
        minutes=2,
        instruction="Введите две записи через пробел: двоичную, затем троичную.",
        hint="Делите на основание и собирайте остатки справа налево.",
        code=TO_BASE + "print(bin(22)[2:], to_base(22, 3))",
    ),
    dict(
        at=(1, 2),
        section="mesto-cifry",
        title="Какие числа записаны",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="Каждая цифра умножается на основание в степени своего разряда.",
        code="print(int('10011', 2), int('2101', 3), int('147', 8))",
    ),
    dict(
        at=(1, 4),
        section="dlina-zapisi",
        title="Шесть двоичных цифр",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="Шестизначные двоичные записи: 2⁵ ≤ N < 2⁶. Введите наименьшее, наибольшее и количество.",
        code="""low = 2 ** 5
high = 2 ** 6 - 1
print(low, high, high - low + 1)""",
    ),
    dict(
        at=(1, 5),
        section="dlina-zapisi",
        title="Длина двоичной записи 1000",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Найдите степени двойки, между которыми лежит 1000.",
        code="print(len(bin(1000)) - 2)",
    ),
    dict(
        at=(1, 6),
        section="gotovye-funkcii",
        title="Одна запись — три числа",
        difficulty=1,
        minutes=1,
        instruction=THREE,
        hint="Второй аргумент `int` — основание, по умолчанию 10.",
        code="print(int('101', 2), int('101'), int('101', 3))",
    ),
    dict(
        at=(1, 8),
        section="dlina-zapisi",
        title="Пятизначные троичные на отрезке",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Пятизначные троичные записи — числа от 3⁴ до 3⁵ − 1.",
        code=TO_BASE
        + """count = 0
for n in range(50, 301):
    if len(to_base(n, 3)) == 5:
        count += 1
print(count)""",
    ),
    dict(
        at=(1, 9),
        section="dlina-zapisi",
        title="Пять троичных цифр, первая 2",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Такие записи идут от 20000₃ до 22222₃.",
        code=TO_BASE
        + """count = 0
for n in range(1, 501):
    s = to_base(n, 3)
    if len(s) == 5 and s[0] == '2':
        count += 1
print(count)""",
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 1),
        section="neskolko-cifr",
        title="Дописать справа 001",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Блок из трёх цифр сдвигает число на три разряда: умножение на 8.",
        code="print(int(bin(11)[2:] + '001', 2))",
    ),
    dict(
        at=(2, 2),
        section="dopisyvanie-sleva",
        title="Дописать слева 10",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Дописанная слева единица стоит на разряде, равном длине записи 13.",
        code="print(int('10' + bin(13)[2:], 2))",
    ),
    dict(
        at=(2, 3),
        section="dopisyvanie-sprava",
        title="Найти N по результату",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Дописать единицу справа — это 2N + 1.",
        code="""for n in range(1, 47):
    if int(bin(n)[2:] + '1', 2) == 47:
        print(n)""",
    ),
    dict(
        at=(2, 4),
        section="neskolko-cifr",
        title="Троичный блок 12",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Два троичных разряда — умножение на 9, блок `12` равен 5.",
        code=TO_BASE + "print(int(to_base(7, 3) + '12', 3))",
    ),
    dict(
        at=(2, 5),
        section="poslednie-cifry",
        title="Копия трёх последних цифр",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="Последние три двоичные цифры — остаток от деления на 8.",
        code="""s = bin(45)[2:]
print(int(s + s[-3:], 2))""",
    ),
    dict(
        at=(2, 6),
        section="soedinenie-strok",
        title="Дописать запись другого числа",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Запись 5 — `101`, три разряда: R = 6 · 8 + 5.",
        code="print(int(bin(6)[2:] + bin(5)[2:], 2))",
    ),
    dict(
        at=(2, 8),
        section="blok-po-usloviyu",
        title="Блоки по чётности, R > 200",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Перебирайте N по возрастанию и стройте запись по ветви чётности.",
        code="""n = 1
while True:
    s = bin(n)[2:]
    if n % 2 == 0:
        s = '1' + s + '0'
    else:
        s = '11' + s + '1'
    if int(s, 2) > 200:
        print(n)
        break
    n += 1""",
    ),
    dict(
        at=(2, 9),
        section="rezultat-vychisleniya",
        title="Троичный алгоритм, R > 500",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Дописывается троичная запись произведения, а не `str`.",
        code=TO_BASE
        + """n = 1
while True:
    s = to_base(n, 3)
    if n % 3 == 0:
        s = s + s[-2:]
    else:
        s = s + to_base(n % 3 * 8, 3)
    if int(s, 3) > 500:
        print(n)
        break
    n += 1""",
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 1),
        section="perevernut-i-invertirovat",
        title="Инверсия записи 22",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Инверсия пятизначной записи — 31 − N.",
        code="""s = bin(22)[2:]
t = ''
for c in s:
    t += '1' if c == '0' else '0'
print(int(t, 2))""",
    ),
    dict(
        at=(3, 2),
        section="udalit-i-vstavit",
        title="Заменить первые две цифры",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Старый фрагмент удаляется срезом `s[2:]`, новый ставится слева.",
        code="""s = '101101'
print(int('110' + s[2:], 2))""",
    ),
    dict(
        at=(3, 3),
        section="odni-edinicy",
        title="Инверсия короткой и длинной записи",
        difficulty=2,
        minutes=2,
        instruction=TWO,
        hint="Инверсия записи длины L — (2ᴸ − 1) − N.",
        code="""def invert(s):
    t = ''
    for c in s:
        t += '1' if c == '0' else '0'
    return t


s = bin(5)[2:]
print(int(invert(s), 2), int(invert(s.zfill(8)), 2))""",
    ),
    dict(
        at=(3, 5),
        section="udalit-i-vstavit",
        title="Последнюю цифру заменить на 00",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Удалить последнюю цифру — `N // 2`, дописать `00` — умножить на 4.",
        code="""s = bin(23)[2:]
print(int(s[:-1] + '00', 2))""",
    ),
    dict(
        at=(3, 6),
        section="vedushchie-nuli",
        title="Переворот записи 52",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="После переворота нули оказываются впереди и не влияют на число.",
        code="print(int(bin(52)[2:][::-1], 2))",
    ),
    dict(
        at=(3, 7),
        section="odnovremennaya-zamena",
        title="Обмен цифр 0 и 2",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Меняйте цифры за один проход, иначе вторая замена испортит первую.",
        code=TO_BASE
        + """swap = {'0': '2', '1': '1', '2': '0'}
t = ''
for c in to_base(46, 3):
    t += swap[c]
print(int(t, 3))""",
    ),
    dict(
        at=(3, 9),
        section="sborka-iz-srezov",
        title="Перенос двух цифр и инверсия",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Результат не растёт вместе с N: проверьте и длину записи, и её вид.",
        code="""n = 4
while True:
    s = bin(n)[2:]
    s = s[2:] + s[:2]
    t = ''
    for c in s:
        t += '1' if c == '0' else '0'
    if int(t, 2) > 40:
        print(n)
        break
    n += 1""",
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 2),
        section="povtornyj-shag",
        title="Дважды дописать чётность",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Второй шаг считает единицы уже в новой записи.",
        code="""s = bin(7)[2:]
for _ in range(2):
    s += str(s.count('1') % 2)
print(int(s, 2))""",
    ),
    dict(
        at=(4, 5),
        section="desyatichnaya-zapis",
        title="Сумма цифр в двух системах",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Сумма двоичных цифр — количество единиц.",
        code="""digits = 0
for c in str(100):
    digits += int(c)
print(digits, bin(100).count('1'))""",
    ),
    dict(
        at=(4, 8),
        section="povtornyj-shag",
        title="Трижды дописать чётность, R > 300",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Хвост из трёх цифр — `000` или `100`, R примерно 8N.",
        code="""n = 1
while True:
    s = bin(n)[2:]
    for _ in range(3):
        s += str(s.count('1') % 2)
    if int(s, 2) > 300:
        print(n)
        break
    n += 1""",
    ),
    dict(
        at=(4, 9),
        section="desyatichnaya-zapis",
        title="Пары соседних цифр",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Пара с ведущим нулём, например `09`, — это число 9.",
        code="""n = 1001
while True:
    s = str(n)
    pairs = []
    for i in range(len(s) - 1):
        pairs.append(int(s[i:i + 2]))
    if max(pairs) + min(pairs) == 100:
        print(n)
        break
    n += 1""",
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="ostanovka-perebora",
        title="Минимальное N с R > 100",
        difficulty=1,
        minutes=3,
        instruction=NUMBER,
        hint="Справа всегда две цифры: R ≈ 4N.",
        code="""n = 1
while True:
    s = bin(n)[2:]
    s += '10' if n % 2 == 0 else '01'
    if int(s, 2) > 100:
        print(n)
        break
    n += 1""",
    ),
    dict(
        at=(5, 3),
        section="troichnyj-algoritm",
        title="Троичный алгоритм для 14",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="14 не делится на 3: дописывается троичная запись 7 · 2.",
        code=TO_BASE
        + """n = 14
s = to_base(n, 3)
if n % 3 == 0:
    s += s[-2:]
else:
    s += to_base(7 * (n % 3), 3)
print(int(s, 3))""",
    ),
    dict(
        at=(5, 4),
        section="vopros-poiska",
        title="Наименьший R > 30 и его вход",
        difficulty=2,
        minutes=4,
        instruction=TWO,
        hint="Блоки разной длины: R не растёт вместе с N. Сохраняйте R и N вместе.",
        code="""best_r = None
best_n = None
for n in range(1, 31):
    s = bin(n)[2:]
    s += '111' if n % 2 == 0 else '0'
    r = int(s, 2)
    if r > 30 and (best_r is None or r < best_r):
        best_r = r
        best_n = n
print(best_r, best_n)""",
    ),
    dict(
        at=(5, 7),
        section="granicy-perebora",
        title="Наибольшее R не больше 200",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Дописывание не убирает цифр: R ≥ N, перебора до 200 хватает.",
        code="""best = 0
for n in range(2, 201):
    s = bin(n)[2:]
    if n % 3 == 0:
        s = s + s[-2:]
    else:
        s = bin(n % 3 * 3)[2:] + s
    r = int(s, 2)
    if r <= 200:
        best = max(best, r)
print(best)""",
    ),
    dict(
        at=(5, 8),
        section="oba-chisla",
        title="Вход для наименьшего R > 1000",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="В ответе — N, а сравнивать нужно R: храните оба числа.",
        code=TO_BASE
        + """best_r = None
best_n = None
for n in range(1, 1004):
    s = to_base(n, 3)
    total = 0
    for c in s:
        total += int(c)
    if total % 2 == 0:
        s = s + '1'
    else:
        s = '2' + s
    r = int(s, 3)
    if r > 1000 and (best_r is None or r < best_r):
        best_r = r
        best_n = n
print(best_n)""",
    ),
    dict(
        at=(5, 9),
        section="zadan-rezultat",
        title="Различные результаты переворота",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Различные результаты собирает множество.",
        code="""results = set()
for n in range(1, 101):
    results.add(int(bin(n)[2:][::-1], 2))
print(len(results))""",
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 1),
        section="zamena-bez-perebora",
        title="Разность после обмена 0 и 2: 12",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Для записи длины L результат |2N − (3ᴸ − 1)|.",
        code=TO_BASE
        + """swap = {'0': '2', '1': '1', '2': '0'}
n = 1
while True:
    t = ''
    for c in to_base(n, 3):
        t += swap[c]
    if abs(n - int(t, 3)) == 12:
        print(n)
        break
    n += 1""",
    ),
    dict(
        at=(6, 3),
        section="zamena-bez-perebora",
        title="Разность после обмена 0 и 2: 40",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Проверьте длину записи кандидата: у числа должна быть именно L цифр.",
        code=TO_BASE
        + """swap = {'0': '2', '1': '1', '2': '0'}
n = 1
while True:
    t = ''
    for c in to_base(n, 3):
        t += swap[c]
    if abs(n - int(t, 3)) == 40:
        print(n)
        break
    n += 1""",
    ),
    dict(
        at=(6, 6),
        section="kolichestvo-rezultatov",
        title="Сколько результатов на огромном отрезке",
        difficulty=3,
        minutes=8,
        instruction=NUMBER,
        hint="R = 4N + N mod 3 растёт вместе с N: найдите крайние входы.",
        code="""def r(n):
    return 4 * n + n % 3


a, b = 123456789, 987654321
low = a // 4 - 1
while r(low) < a:
    low += 1
high = b // 4 + 1
while r(high) > b:
    high -= 1
print(high - low + 1)""",
    ),
    # ------------------------------------------------------ Практика и итог
    dict(
        at=(7, 1),
        title="Наибольшее R не больше 150",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="R ≥ N, поэтому хватает перебора N до 150.",
        code="""best = 0
for n in range(1, 151):
    s = bin(n)[2:]
    if n % 2 == 0:
        s = '10' + s
    else:
        s = '1' + s + '11'
    r = int(s, 2)
    if r <= 150:
        best = max(best, r)
print(best)""",
    ),
    dict(
        at=(7, 2),
        title="Дважды дописать остаток суммы на 3",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Сумма цифр каждый раз считается по текущей троичной записи.",
        code=TO_BASE
        + """n = 1
while True:
    s = to_base(n, 3)
    for _ in range(2):
        total = 0
        for c in s:
            total += int(c)
        s += str(total % 3)
    if int(s, 3) > 400:
        print(n)
        break
    n += 1""",
    ),
    dict(
        at=(7, 3),
        title="Переворот и единица справа",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="R не растёт вместе с N, но перебор по возрастанию N найдёт наименьшее.",
        code="""n = 1
while True:
    s = bin(n)[2:][::-1] + '1'
    if int(s, 2) > 1000:
        print(n)
        break
    n += 1""",
    ),
    dict(
        at=(7, 4),
        title="Восьмеричный алгоритм",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Восьмеричная запись — `oct(n)[2:]`; храните и N, и R.",
        code="""best_r = None
best_n = None
for n in range(1, 604):
    s = oct(n)[2:]
    if n % 2 == 0:
        s = s + s[0]
    else:
        s = oct(n % 5)[2:] + s
    r = int(s, 8)
    if r > 600 and (best_r is None or r < best_r):
        best_r = r
        best_n = n
print(best_n)""",
    ),
    dict(
        at=(7, 5),
        title="Без нулей и задом наперёд",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Различные результаты собирает множество.",
        code="""results = set()
for n in range(10, 1000):
    s = str(n).replace('0', '')[::-1]
    results.add(int(s))
print(len(results))""",
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 5, TASKS, RETIRED))
