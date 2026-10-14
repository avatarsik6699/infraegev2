"""Topic 24 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-24/bank.py          # check only
    python3 -I content/lesson-design/topic-24/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. The lesson
replaces the earlier «Обработка символьных строк» (same id and route):
``--write`` also archives that lesson's tasks (``RETIRED``); no other bank task
links its sections. ``apps/api/tests/test_task_24_bank.py`` recomputes every
answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, TWO, main  # noqa: E402

RETIRED = frozenset(f"task-24-0{k}" for k in range(1, 9))

LETTER = "Введите одну заглавную латинскую букву."
F1 = ("24-1.txt", "Строка из символов X, Y и Z")
F2 = ("24-2.txt", "Строка из десятичных цифр")
F3 = ("24-3.txt", "Строки из заглавных латинских букв")
F4 = ("24-4.txt", "Строка из заглавных латинских букв")
F5 = ("24-5.txt", "Строка из заглавных латинских букв и цифр")
F6 = ("24-6.txt", "Строка из цифр и знаков + и *")
F7 = ("24-7.txt", "Строка из цифр и знаков − и *")
F8 = ("24-8.txt", "Строка из цифр 1–9, знаков +, −, * и букв A–D")
F9 = ("24-9.txt", "Строка из миллиона заглавных латинских букв")


def read(name: str) -> str:
    return f"with open('{name}') as f:\n    s = f.readline().rstrip('\\r\\n')\n\n"


# The lesson's correct number: no leading zeros (subtopic 6).
NUM = "number = r'(?:0|[1-9][0-9]*)'\n"

# (page, number in the page) -> task definition; page 9 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 2),
        section="indeksy",
        title="Длина по включённым границам",
        difficulty=1,
        minutes=1,
        instruction="Введите три числа через пробел: длину, количество символов строго между концами и разность номеров.",
        hint="Обе границы входят во фрагмент: длина на единицу больше разности номеров.",
        code="""left, right = 4, 9
print(right - left + 1, right - left - 1, right - left)""",
    ),
    dict(
        at=(1, 5),
        section="polnyy-perebor",
        title="Сколько всего подстрок",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Подстрока задаётся парой границ left ≤ right: n · (n + 1) / 2 пар.",
        code="""for n in (8, 300_000):
    print(n * (n + 1) // 2)""",
    ),
    dict(
        at=(1, 8),
        section="stroki-fayla",
        title="K чаще, чем L",
        difficulty=1,
        minutes=4,
        instruction=NUMBER,
        hint="Каждую строку очистите от перевода строки и сравните два count.",
        files=[F3],
        code="""count = 0
with open('24-3.txt') as f:
    for line in f:
        line = line.rstrip('\\r\\n')
        if line.count('K') > line.count('L'):
            count += 1
print(count)""",
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 1),
        section="dve-peremennye",
        title="Цепочка X",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="current растёт на X и сбрасывается до 0 на другой букве.",
        code="""s = 'AXXXBXXXXXAX'
current = best = 0
for c in s:
    current = current + 1 if c == 'X' else 0
    best = max(best, current)
print(best)""",
    ),
    dict(
        at=(2, 2),
        section="sosedi-razlichny",
        title="Различные соседи",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="При одинаковой паре второй символ начинает новую цепочку длины 1.",
        code="""s = 'CAABCBCC'
current = best = 0
for i in range(len(s)):
    if i > 0 and s[i] != s[i - 1]:
        current += 1
    else:
        current = 1
    best = max(best, current)
print(best)""",
    ),
    dict(
        at=(2, 3),
        section="drugie-usloviya-sosedey",
        title="Одинаковые символы подряд",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Цепочка продолжается, если символ равен предыдущему.",
        code="""s = 'ZZYYYZYYYYZ'
current = best = 0
for i in range(len(s)):
    if i > 0 and s[i] == s[i - 1]:
        current += 1
    else:
        current = 1
    best = max(best, current)
print(best)""",
    ),
    dict(
        at=(2, 4),
        section="usloviya-po-troykam",
        title="Тройки цифр",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="При плохой тройке остаются две последние цифры: сброс до 2.",
        code="""s = '12456'
current = best = min(len(s), 2)
for i in range(2, len(s)):
    if int(s[i - 2]) + int(s[i - 1]) > int(s[i]):
        current += 1
    else:
        current = 2
    best = max(best, current)
print(best)""",
    ),
    dict(
        at=(2, 5),
        section="zapreshchyonnye-pary",
        title="K и L не рядом",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="Запрещённая пара — KL или LK; на втором символе пары сброс до 1.",
        code="""s = 'KLAKKLB'
current = best = 0
for i in range(len(s)):
    if i > 0 and s[i - 1:i + 1] in ('KL', 'LK'):
        current = 1
    else:
        current += 1
    best = max(best, current)
print(best)""",
    ),
    dict(
        at=(2, 7),
        section="obnovlenie-maksimuma",
        title="Без буквы Y",
        difficulty=1,
        minutes=3,
        instruction=NUMBER,
        hint="Обновляйте ответ после каждого символа, а не только при разрыве.",
        files=[F1],
        code=read("24-1.txt")
        + """current = best = 0
for c in s:
    current = current + 1 if c != 'Y' else 0
    best = max(best, current)
print(best)""",
    ),
    dict(
        at=(2, 8),
        section="zapreshchyonnye-pary",
        title="X и Z не рядом",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Пара запрещена, если оба символа из набора XZ — в том числе XX и ZZ.",
        files=[F1],
        code=read("24-1.txt")
        + """current = best = 0
for i in range(len(s)):
    if i > 0 and s[i - 1] in 'XZ' and s[i] in 'XZ':
        current = 1
    else:
        current += 1
    best = max(best, current)
print(best)""",
    ),
    dict(
        at=(2, 9),
        section="usloviya-po-troykam",
        title="Крайние больше средней",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Проверяйте тройку, которая заканчивается текущей цифрой; при нарушении сброс до 2.",
        files=[F2],
        code=read("24-2.txt")
        + """current = best = min(len(s), 2)
for i in range(2, len(s)):
    if int(s[i - 2]) + int(s[i]) > int(s[i - 1]):
        current += 1
    else:
        current = 2
    best = max(best, current)
print(best)""",
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 1),
        section="poisk-obrazca",
        title="Перекрывающиеся ABA",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Перебирайте каждое начало; count перекрытия не считает.",
        code="""s = 'ABABABA'
count = 0
for i in range(len(s) - 2):
    if s[i:i + 3] == 'ABA':
        count += 1
print(count)""",
    ),
    dict(
        at=(3, 2),
        section="korotkie-fragmenty",
        title="Одинаковые края тройки",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Тройка с началом i подходит, если s[i] == s[i + 2].",
        code="""s = 'ABABBAB'
count = 0
for i in range(len(s) - 2):
    if s[i] == s[i + 2]:
        count += 1
print(count)""",
    ),
    dict(
        at=(3, 3),
        section="povtoryayushchiysya-obrazec",
        title="Цепочка ABCABC…",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Длина цепочки показывает, какая буква образца ожидается следующей.",
        code="""s = 'ABABCABCA'
pattern = 'ABC'
current = best = 0
for c in s:
    if c == pattern[current % len(pattern)]:
        current += 1
    elif c == pattern[0]:
        current = 1
    else:
        current = 0
    best = max(best, current)
print(best)""",
    ),
    dict(
        at=(3, 4),
        section="cepochki-par",
        title="Пары «согласная + гласная»",
        difficulty=2,
        minutes=3,
        instruction="Введите два числа через пробел: количество пар и количество символов.",
        hint="Пары идут целиком: проверьте оба смещения, 0 и 1.",
        code="""s = 'BABEDACA'
best = 0
for offset in range(2):
    current = 0
    for i in range(offset, len(s) - 1, 2):
        if s[i] in 'BCDF' and s[i + 1] in 'AE':
            current += 1
        else:
            current = 0
        best = max(best, current)
print(best, 2 * best)""",
    ),
    dict(
        at=(3, 5),
        section="ravnye-chastoty",
        title="Чаще всего после A",
        difficulty=2,
        minutes=3,
        instruction=LETTER,
        hint="Перебирайте буквы по алфавиту и заменяйте ответ только при строго большей частоте.",
        code="""s = 'CADACABAA'
freq = {}
for i in range(1, len(s)):
    if s[i - 1] == 'A':
        freq[s[i]] = freq.get(s[i], 0) + 1
answer, best = '', 0
for c in sorted(freq):
    if freq[c] > best:
        answer, best = c, freq[c]
print(answer)""",
    ),
    dict(
        at=(3, 6),
        section="dopolnitelnyy-kriteriy",
        title="Самая правая из длинных",
        difficulty=2,
        minutes=3,
        instruction="Введите два числа через пробел: номер при нумерации с нуля, затем с единицы.",
        hint="При равной длине берите цепочку правее: сравнение >=.",
        code="""s = 'YXXYXXYXX'
current = best = start = 0
for i in range(len(s)):
    current = current + 1 if s[i] == 'X' else 0
    if current > 0 and current >= best:
        best = current
        start = i - current + 1
print(start, start + 1)""",
    ),
    dict(
        at=(3, 7),
        section="povtoryayushchiysya-obrazec",
        title="Цепочка XYZXYZ…",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Если символ не тот, что ожидается, но равен X, цепочка начинается заново с длины 1.",
        files=[F1],
        code=read("24-1.txt")
        + """pattern = 'XYZ'
current = best = 0
for c in s:
    if c == pattern[current % len(pattern)]:
        current += 1
    elif c == pattern[0]:
        current = 1
    else:
        current = 0
    best = max(best, current)
print(best)""",
    ),
    dict(
        at=(3, 8),
        section="cepochki-par",
        title="Пары «гласная + согласная»",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Пары идут целиком: проверьте оба смещения.",
        files=[F4],
        code=read("24-4.txt")
        + """vowels = 'AEIOUY'
best = 0
for offset in range(2):
    current = 0
    for i in range(offset, len(s) - 1, 2):
        if s[i] in vowels and s[i + 1] not in vowels:
            current += 1
        else:
            current = 0
        best = max(best, current)
print(best)""",
    ),
    dict(
        at=(3, 9),
        section="ravnye-chastoty",
        title="Чаще всего перед R",
        difficulty=2,
        minutes=4,
        instruction=LETTER,
        hint="Словарь частот букв перед R, затем выбор по алфавиту при равенстве.",
        files=[F4],
        code=read("24-4.txt")
        + """freq = {}
for i in range(1, len(s)):
    if s[i] == 'R':
        freq[s[i - 1]] = freq.get(s[i - 1], 0) + 1
answer, best = '', 0
for c in sorted(freq):
    if freq[c] > best:
        answer, best = c, freq[c]
print(answer)""",
    ),
    dict(
        at=(3, 10),
        section="mnogo-strok",
        title="Самая редкая буква строки",
        difficulty=3,
        minutes=6,
        instruction=LETTER,
        hint="Сначала выберите строку (последнюю при равенстве — сравнение >=), затем посчитайте в ней частоты.",
        files=[F3],
        code="""best_line, best_q = '', -1
with open('24-3.txt') as f:
    for line in f:
        line = line.rstrip('\\r\\n')
        if line.count('Q') >= best_q:
            best_line, best_q = line, line.count('Q')
freq = {}
for c in best_line:
    freq[c] = freq.get(c, 0) + 1
answer, fewest = '', len(best_line) + 1
for c in sorted(freq):
    if freq[c] < fewest:
        answer, fewest = c, freq[c]
print(answer)""",
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 1),
        section="sdvig-levoy-granicy",
        title="Не более двух A",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Когда A стало три, сдвигайте left, пока одна A не уйдёт из окна.",
        code="""s = 'ABCABBACB'
left = count = best = 0
for right in range(len(s)):
    if s[right] == 'A':
        count += 1
    while count > 2:
        if s[left] == 'A':
            count -= 1
        left += 1
    best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(4, 2),
        section="rovno-k",
        title="Ровно две A",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="То же окно, но ответ обновляется только при count == 2.",
        code="""s = 'ABCABBACB'
left = count = best = 0
for right in range(len(s)):
    if s[right] == 'A':
        count += 1
    while count > 2:
        if s[left] == 'A':
            count -= 1
        left += 1
    if count == 2:
        best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(4, 3),
        section="minimalnaya-dlina",
        title="Не менее двух A, короче всего",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="Пока букв достаточно, обновляйте ответ и сжимайте окно слева.",
        code="""s = 'ABCABBACB'
left = count = 0
best = len(s) + 1
for right in range(len(s)):
    if s[right] == 'A':
        count += 1
    while count >= 2:
        best = min(best, right - left + 1)
        if s[left] == 'A':
            count -= 1
        left += 1
print(best)""",
    ),
    dict(
        at=(4, 4),
        section="zapreshchyonnoe-slovo",
        title="Без ABC",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Когда слово закончилось на right, левая граница встаёт сразу за его первым символом.",
        code="""s = 'ABCXABYABCZ'
word = 'ABC'
left = best = 0
for right in range(len(s)):
    start = right - len(word) + 1
    if start >= 0 and s[start:right + 1] == word:
        left = max(left, start + 1)
    best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(4, 5),
        section="neskolko-ogranicheniy",
        title="A и B не более одного раза",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Два счётчика; окно сжимается, пока превышен счётчик только что добавленной буквы.",
        code="""s = 'ABCBADAB'
count = {'A': 0, 'B': 0}
left = best = 0
for right in range(len(s)):
    c = s[right]
    if c in count:
        count[c] += 1
        while count[c] > 1:
            if s[left] in count:
                count[s[left]] -= 1
            left += 1
    best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(4, 6),
        section="pary-v-okne",
        title="Не более одной пары AA",
        difficulty=3,
        minutes=4,
        instruction=NUMBER,
        hint="Пара считается в окне, только когда оба её символа внутри.",
        code="""s = 'AAABAAB'
left = count = best = 0
for right in range(len(s)):
    if right >= 1 and s[right - 1:right + 1] == 'AA':
        if right - 1 >= left:
            count += 1
    while count > 1:
        if s[left:left + 2] == 'AA' and left + 1 <= right:
            count -= 1
        left += 1
    best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(4, 8),
        section="sdvig-levoy-granicy",
        title="Не более 12 букв Q",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Скользящее окно со счётчиком Q.",
        files=[F4],
        code=read("24-4.txt")
        + """left = count = best = 0
for right in range(len(s)):
    if s[right] == 'Q':
        count += 1
    while count > 12:
        if s[left] == 'Q':
            count -= 1
        left += 1
    best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(4, 9),
        section="slovar-schyotchikov",
        title="J, K, X, Z не более 6 раз",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="На каждую букву свой счётчик в словаре.",
        files=[F4],
        code=read("24-4.txt")
        + """count = {c: 0 for c in 'JKXZ'}
left = best = 0
for right in range(len(s)):
    c = s[right]
    if c in count:
        count[c] += 1
        while count[c] > 6:
            if s[left] in count:
                count[s[left]] -= 1
            left += 1
    best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(4, 10),
        section="pary-v-okne",
        title="Ровно 25 пар TT",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Пары перекрываются; учитывайте пару, только когда оба символа в окне.",
        files=[F4],
        code=read("24-4.txt")
        + """left = count = best = 0
for right in range(len(s)):
    if right >= 1 and s[right - 1:right + 1] == 'TT':
        if right - 1 >= left:
            count += 1
    while count > 25:
        if s[left:left + 2] == 'TT' and left + 1 <= right:
            count -= 1
        left += 1
    if count == 25:
        best = max(best, right - left + 1)
print(best)""",
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="spisok-poziciy",
        title="Три A покороче",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Три подряд идущие позиции A: длина positions[j + 2] − positions[j] + 1.",
        code="""s = 'CAABACAB'
k = 3
positions = [i for i in range(len(s)) if s[i] == 'A']
best = len(s) + 1
for j in range(len(positions) - k + 1):
    length = positions[j + k - 1] - positions[j] + 1
    best = min(best, length)
print(best)""",
    ),
    dict(
        at=(5, 2),
        section="maksimum-s-rovno-k",
        title="Ровно две A через позиции",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Добавьте границы −1 и len(s) и растяните фрагмент до соседних A.",
        code="""s = 'CAABACAB'
k = 2
positions = [i for i in range(len(s)) if s[i] == 'A']
positions = [-1] + positions + [len(s)]
best = 0
for j in range(1, len(positions) - k):
    left = positions[j - 1] + 1
    right = positions[j + k] - 1
    best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(5, 3),
        section="vhozhdeniya-slova",
        title="Два вхождения ABA",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Начала слова — позиции; длина positions[j + 1] − positions[j] + 3.",
        code="""s = 'ABACABAABA'
word, k = 'ABA', 2
m = len(word)
positions = [i for i in range(len(s) - m + 1)
             if s[i:i + m] == word]
best = len(s) + 1
for j in range(len(positions) - k + 1):
    length = positions[j + k - 1] - positions[j] + m
    best = min(best, length)
print(best)""",
    ),
    dict(
        at=(5, 4),
        section="zameny-i-razbienie",
        title="Без X и Y",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Замените Y на X и разбейте строку по X.",
        code="""s = 'ABYCDXEFGHYXI'
parts = s.replace('Y', 'X').split('X')
print(max(len(p) for p in parts))""",
    ),
    dict(
        at=(5, 5),
        section="chasti-mezhdu-razdelitelyami",
        title="Цепочка между F",
        difficulty=3,
        minutes=4,
        instruction=NUMBER,
        hint="Части между соседними F; хорошая часть содержит не более одной A, плохая обрывает цепочку.",
        code="""s = 'AFBAFCFAAFDF'
parts = s.split('F')[1:-1]
current = best = 0
for p in parts:
    if p.count('A') <= 1:
        if current == 0:
            current = 1
        current += len(p) + 1
        best = max(best, current)
    else:
        current = 0
print(best)""",
    ),
    dict(
        at=(5, 6),
        section="peresekayushchiesya-razdeliteli",
        title="Разделители ABC в любом порядке",
        difficulty=3,
        minutes=4,
        instruction=NUMBER,
        hint="Пометьте все позиции каждой подходящей тройки, затем ищите самую длинную непомеченную цепочку.",
        code="""s = 'KLMNBCABXYZACBQ'
used = [False] * len(s)
for i in range(len(s) - 2):
    if sorted(s[i:i + 3]) == ['A', 'B', 'C']:
        used[i] = used[i + 1] = used[i + 2] = True
current = best = 0
for flag in used:
    current = 0 if flag else current + 1
    best = max(best, current)
print(best)""",
    ),
    dict(
        at=(5, 7),
        section="spisok-poziciy",
        title="50 букв Q покороче",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="K подряд идущих позиций Q.",
        files=[F4],
        code=read("24-4.txt")
        + """k = 50
positions = [i for i in range(len(s)) if s[i] == 'Q']
best = len(s) + 1
for j in range(len(positions) - k + 1):
    length = positions[j + k - 1] - positions[j] + 1
    best = min(best, length)
print(best)""",
    ),
    dict(
        at=(5, 8),
        section="nachalo-i-konec",
        title="Конец на 0 и ровно 6 K",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Фрагмент кончается на 0, внутри нуля нет: после каждого 0 список позиций K начинается заново.",
        files=[F5],
        code=read("24-5.txt")
        + """k = 6
positions = []
best = len(s) + 1
for i in range(len(s)):
    if s[i] == 'K':
        positions.append(i)
    elif s[i] == '0':
        if len(positions) >= k:
            best = min(best, i - positions[-k] + 1)
        positions = []
print(best)""",
    ),
    dict(
        at=(5, 9),
        section="odinakovye-koncy",
        title="Цифра, буквы, та же цифра",
        difficulty=3,
        minutes=7,
        instruction=NUMBER,
        hint="Концы — соседние цифры файла; при равной длине берите больший номер начала.",
        files=[F5],
        code=read("24-5.txt")
        + """vowels = 'AEIOUY'
digits = [i for i in range(len(s)) if s[i].isdigit()]
best, start = 0, -1
for a, b in zip(digits, digits[1:]):
    if s[a] == s[b] and s[a] in '0369' and b - a > 1:
        inside = s[a + 1:b]
        v = sum(c in vowels for c in inside)
        if 2 * v == len(inside) and b - a + 1 >= best:
            best, start = b - a + 1, a
print(start)""",
    ),
    dict(
        at=(5, 10),
        section="vse-simvoly-nabora",
        title="Все шесть гласных без цифр",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Цифра обрывает фрагмент; множество встреченных гласных сбрасывается вместе с длиной.",
        files=[F5],
        code=read("24-5.txt")
        + """vowels = 'AEIOUY'
current, seen, best = 0, set(), 0
for c in s:
    if c.isalpha():
        current += 1
        if c in vowels:
            seen.add(c)
    else:
        current, seen = 0, set()
    if len(seen) == len(vowels):
        best = max(best, current)
print(best)""",
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 3),
        section="shablon-vyrazheniya",
        title="Корректное выражение в короткой строке",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Число — 0 или цифра 1–9 и любые цифры; затем повторения «знак, число».",
        code="""import re

s = '5+*12+0*07+3'
"""
        + NUM
        + """pattern = number + r'(?:[+*]' + number + r')*'
print(max(len(m.group()) for m in re.finditer(pattern, s)))""",
    ),
    dict(
        at=(6, 6),
        section="zapis-v-sisteme",
        title="Число с основанием 12",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Первая цифра — от 1 до B, остальные — любые цифры основания 12.",
        code="""import re

s = '0A9BC00B1A20X'
pattern = r'[1-9AB][0-9AB]*'
print(max(len(m.group()) for m in re.finditer(pattern, s)))""",
    ),
    dict(
        at=(6, 7),
        section="shablon-vyrazheniya",
        title="Выражение с + и *",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="re.finditer по шаблону «число, затем (знак, число)*».",
        files=[F6],
        code="import re\n\n"
        + read("24-6.txt")
        + NUM
        + """pattern = number + r'(?:[+*]' + number + r')*'
print(max(len(m.group()) for m in re.finditer(pattern, s)))""",
    ),
    dict(
        at=(6, 8),
        section="shablon-po-usloviyu",
        title="Натуральные числа, − и *",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Числа 0 нет: число — [1-9][0-9]*; знаки — [-*].",
        files=[F7],
        code="""import re

"""
        + read("24-7.txt")
        + """number = r'[1-9][0-9]*'
pattern = number + r'(?:[-*]' + number + r')*'
print(max(len(m.group()) for m in re.finditer(pattern, s)))""",
    ),
    dict(
        at=(6, 9),
        section="zapis-v-sisteme",
        title="Число с основанием 20",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Цифры 0–9 и A–J; первая — не 0.",
        files=[F5],
        code="""import re

"""
        + read("24-5.txt")
        + """pattern = r'[1-9A-J][0-9A-J]*'
print(max(len(m.group()) for m in re.finditer(pattern, s)))""",
    ),
    dict(
        at=(6, 10),
        section="vedushchie-nuli",
        title="Наибольшее чётное в основании 16",
        difficulty=3,
        minutes=7,
        instruction=NUMBER,
        hint="Уберите ведущие нули блока, обрежьте его до последней чётной цифры и сравнивайте по длине, затем по записи.",
        files=[F5],
        code="""import re

"""
        + read("24-5.txt")
        + """digits = '0123456789ABCDEF'
best = ''
for m in re.finditer('[0-9A-F]+', s):
    block = m.group().lstrip('0')
    end = -1
    for i in range(len(block)):
        if digits.index(block[i]) % 2 == 0:
            end = i
    if end >= 0:
        candidate = block[:end + 1]
    else:
        candidate = '0' if '0' in m.group() else ''
    if (len(candidate), candidate) > (len(best), best):
        best = candidate
print(len(best))""",
    ),
    # ------------------------------------------------------------ subtopic 7
    dict(
        at=(7, 1),
        section="ne-bolee-k-chisel",
        title="Не более двух чисел",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="Окно по числам выражения: от числа j − k + 1 до числа j.",
        code="""import re

s = '9*8+76+5+4321'
k = 2
best = 0
for e in re.finditer(r'[0-9]+(?:[-+*][0-9]+)*', s):
    numbers = list(re.finditer(r'[0-9]+', e.group()))
    for j in range(len(numbers)):
        i = max(0, j - k + 1)
        length = numbers[j].end() - numbers[i].start()
        best = max(best, length)
print(best)""",
    ),
    dict(
        at=(7, 2),
        section="ne-bolee-k-chisel",
        title="Не более трёх чисел",
        difficulty=2,
        minutes=2,
        instruction=NUMBER,
        hint="Окно по числам выражения: от числа j − k + 1 до числа j.",
        code="""import re

s = '1+22*333+4444'
k = 3
best = 0
for e in re.finditer(r'[0-9]+(?:[-+*][0-9]+)*', s):
    numbers = list(re.finditer(r'[0-9]+', e.group()))
    for j in range(len(numbers)):
        i = max(0, j - k + 1)
        length = numbers[j].end() - numbers[i].start()
        best = max(best, length)
print(best)""",
    ),
    dict(
        at=(7, 4),
        section="dopolnitelnye-trebovaniya",
        title="Порядок слева направо",
        difficulty=3,
        minutes=4,
        instruction=NUMBER,
        hint="Умножение после вычитания переносит начало выражения на число после минуса.",
        code="""s = '4-3*2*5-1'
start = best = 0
for i in range(len(s)):
    if s[i] == '*':
        minus = s.rfind('-', start, i)
        if minus != -1:
            start = minus + 1
    best = max(best, i - start + 1)
print(best)""",
    ),
    dict(
        at=(7, 5),
        section="summa-posle-bukvy",
        title="Наибольшая сумма после A",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Проверьте все начальные части, которые заканчиваются целым числом.",
        code="""import re

s = 'A12-25+3'
best = None
for m in re.finditer(r'A([1-9][0-9]*(?:[-+][1-9][0-9]*)*)', s):
    total = 0
    for t in re.findall(r'[-+]?[0-9]+', m.group(1)):
        total += int(t)
        if best is None or total > best:
            best = total
print(best)""",
    ),
    dict(
        at=(7, 6),
        section="naibolshee-znachenie",
        title="Самая длинная сумма после B",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Сравнивайте пары (длина, значение).",
        code="""import re

s = 'B12-3CB21+5'
best = None
for m in re.finditer(r'B([1-9][0-9]*(?:[-+][1-9][0-9]*)*)', s):
    text = m.group(1)
    terms = re.findall(r'[-+]?[0-9]+', text)
    value = sum(int(t) for t in terms)
    if best is None or (len(text), value) > best:
        best = (len(text), value)
print(best[1])""",
    ),
    dict(
        at=(7, 7),
        section="ne-bolee-k-chisel",
        title="Не более 20 чисел",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Выражения ищет re.finditer, а внутри каждого — окно из 20 чисел.",
        files=[F8],
        code="""import re

"""
        + read("24-8.txt")
        + """k = 20
best = 0
for e in re.finditer(r'[1-9]+(?:[-+*][1-9]+)*', s):
    numbers = list(re.finditer(r'[1-9]+', e.group()))
    for j in range(len(numbers)):
        i = max(0, j - k + 1)
        length = numbers[j].end() - numbers[i].start()
        best = max(best, length)
print(best)""",
    ),
    dict(
        at=(7, 8),
        section="dopolnitelnye-trebovaniya",
        title="Восьмеричные числа, − и *",
        difficulty=3,
        minutes=7,
        instruction=NUMBER,
        hint="Сначала корректные выражения из восьмеричных чисел, затем внутри — перенос начала после минуса перед умножением.",
        files=[F7],
        code="""import re

"""
        + read("24-7.txt")
        + """number = r'(?:0|[1-7][0-7]*)'
pattern = number + r'(?:[-*]' + number + r')*'
best = 0
for m in re.finditer(pattern, s):
    e = m.group()
    start = 0
    for i in range(len(e)):
        if e[i] == '*':
            minus = e.rfind('-', start, i)
            if minus != -1:
                start = minus + 1
        best = max(best, i - start + 1)
print(best)""",
    ),
    dict(
        at=(7, 9),
        section="summa-posle-bukvy",
        title="Наибольшая сумма после C",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Со знаком + значение растёт с каждым числом: берите сумму целиком.",
        files=[F8],
        code="""import re

"""
        + read("24-8.txt")
        + """best = 0
for m in re.finditer(r'C([1-9]+(?:\\+[1-9]+)*)', s):
    total = sum(int(t) for t in m.group(1).split('+'))
    best = max(best, total)
print(best)""",
    ),
    dict(
        at=(7, 10),
        section="naibolshee-znachenie",
        title="Самая длинная сумма после B в файле",
        difficulty=3,
        minutes=5,
        instruction=NUMBER,
        hint="Сравнивайте пары (длина, значение); значение может быть отрицательным.",
        # the file writes the answer with the minus sign «−»
        says=["−5709"],
        files=[F8],
        code="""import re

"""
        + read("24-8.txt")
        + """best = None
for m in re.finditer(r'B([1-9]+(?:[-+][1-9]+)*)', s):
    text = m.group(1)
    terms = re.findall(r'[-+]?[1-9]+', text)
    value = sum(int(t) for t in terms)
    if best is None or (len(text), value) > best:
        best = (len(text), value)
print(best[1])""",
    ),
    # ------------------------------------------------------------ subtopic 8
    dict(
        at=(8, 2),
        section="kogda-okno-ne-szhimaetsya",
        title="Поровну A и B",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Баланс: +1 за A, −1 за B; запоминайте первое появление каждого баланса.",
        code="""s = 'ABBBAAB'
first = {0: -1}
balance = best = 0
for i in range(len(s)):
    balance += 1 if s[i] == 'A' else -1
    if balance in first:
        best = max(best, i - first[balance])
    else:
        first[balance] = i
print(best)""",
    ),
    dict(
        at=(8, 3),
        section="vse-simvoly-razlichny",
        title="Все символы различны",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Помните последнее появление символа; левая граница — сразу за ним.",
        code="""s = 'ABCADEB'
last = {}
left = best = 0
for right in range(len(s)):
    c = s[right]
    if c in last and last[c] >= left:
        left = last[c] + 1
    last[c] = right
    best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(8, 5),
        section="chislo-mezhdu-bukvami",
        title="Два числа между буквами",
        difficulty=3,
        minutes=4,
        instruction=NUMBER,
        hint="Объекты делят граничные буквы: ищите их с просмотром вперёд.",
        code="""import re

s = 'X12Y3Z45W'
k = 2
starts, ends = [], []
for m in re.finditer(r'(?=([A-Z][0-9]+[A-Z]))', s):
    starts.append(m.start(1))
    ends.append(m.end(1) - 1)
best = len(s) + 1
for j in range(len(starts) - k + 1):
    best = min(best, ends[j + k - 1] - starts[j] + 1)
print(best)""",
    ),
    dict(
        at=(8, 6),
        section="sovmeshchyonnye-usloviya",
        title="Одна Y и два ABA",
        difficulty=3,
        minutes=5,
        instruction=NUMBER,
        hint="Окно с ровно одной Y растягивается до соседних Y, а вхождения ABA внутри считают префиксные суммы.",
        code="""s = 'ABAYABABAYXYABA'
letter, k, word, t = 'Y', 1, 'ABA', 2
m, n = len(word), len(s)
prefix = [0] * (n + 1)
for i in range(n):
    prefix[i + 1] = prefix[i] + (s[i:i + m] == word)
positions = [i for i in range(n) if s[i] == letter]
positions = [-1] + positions + [n]
best = 0
for j in range(1, len(positions) - k):
    left = positions[j - 1] + 1
    right = positions[j + k] - 1
    if right - left + 1 < m:
        continue
    if prefix[right - m + 2] - prefix[left] >= t:
        best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(8, 7),
        section="sovmeshchyonnye-usloviya",
        title="30 букв Y и четыре 2025",
        difficulty=3,
        minutes=7,
        instruction=NUMBER,
        hint="Границы окна — соседние Y, количество 2025 — разность префиксных сумм.",
        files=[F5],
        code=read("24-5.txt")
        + """letter, k, word, t = 'Y', 30, '2025', 4
m, n = len(word), len(s)
prefix = [0] * (n + 1)
for i in range(n):
    prefix[i + 1] = prefix[i] + (s[i:i + m] == word)
positions = [i for i in range(n) if s[i] == letter]
positions = [-1] + positions + [n]
best = 0
for j in range(1, len(positions) - k):
    left = positions[j - 1] + 1
    right = positions[j + k] - 1
    if right - left + 1 < m:
        continue
    if prefix[right - m + 2] - prefix[left] >= t:
        best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(8, 8),
        section="chislo-mezhdu-bukvami",
        title="500 слов между цифрами",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Соседние «слова» делят граничную цифру — нужен просмотр вперёд.",
        files=[F5],
        code="""import re

"""
        + read("24-5.txt")
        + """k = 500
starts, ends = [], []
for m in re.finditer(r'(?=([0-9][A-Z]+[0-9]))', s):
    starts.append(m.start(1))
    ends.append(m.end(1) - 1)
best = len(s) + 1
for j in range(len(starts) - k + 1):
    best = min(best, ends[j + k - 1] - starts[j] + 1)
print(best)""",
    ),
    # ---------------------------------------------------- Практика и итог
    dict(
        at=(9, 1),
        title="Гласные не рядом",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Запрещённая пара — две гласные подряд.",
        files=[F9],
        code=read("24-9.txt")
        + """vowels = 'AEIOUY'
current = best = 0
for i in range(len(s)):
    if i > 0 and s[i - 1] in vowels and s[i] in vowels:
        current = 1
    else:
        current += 1
    best = max(best, current)
print(best)""",
    ),
    dict(
        at=(9, 2),
        title="Между двумя одинаковыми",
        difficulty=2,
        minutes=5,
        instruction=LETTER,
        hint="Тройки с одинаковыми краями, словарь частот средних букв, выбор по алфавиту.",
        files=[F9],
        code=read("24-9.txt")
        + """freq = {}
for i in range(len(s) - 2):
    if s[i] == s[i + 2]:
        freq[s[i + 1]] = freq.get(s[i + 1], 0) + 1
answer, best = '', 0
for c in sorted(freq):
    if freq[c] > best:
        answer, best = c, freq[c]
print(answer)""",
    ),
    dict(
        at=(9, 3),
        title="Q, X, Z не более 40 раз",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Скользящее окно со словарём счётчиков.",
        files=[F9],
        code=read("24-9.txt")
        + """count = {c: 0 for c in 'QXZ'}
left = best = 0
for right in range(len(s)):
    c = s[right]
    if c in count:
        count[c] += 1
        while count[c] > 40:
            if s[left] in count:
                count[s[left]] -= 1
            left += 1
    best = max(best, right - left + 1)
print(best)""",
    ),
    dict(
        at=(9, 4),
        title="Одна буква на концах",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Концы — соседние вхождения одной буквы: помните последнее появление каждой.",
        files=[F9],
        code=read("24-9.txt")
        + """last = {}
best = 0
for i in range(len(s)):
    c = s[i]
    if c in 'ABCDEF':
        if c in last:
            best = max(best, i - last[c] + 1)
        last[c] = i
print(best)""",
    ),
    dict(
        at=(9, 5),
        title="Корректная сумма",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Шаблон суммы: число, затем повторения «+ число»; знак * обрывает сумму.",
        files=[F6],
        code="import re\n\n"
        + read("24-6.txt")
        + NUM
        + """pattern = number + r'(?:\\+' + number + r')*'
print(max(len(m.group()) for m in re.finditer(pattern, s)))""",
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 24, TASKS, RETIRED))
