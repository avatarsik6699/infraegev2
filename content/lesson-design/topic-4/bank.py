"""Topic 4 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-4/bank.py          # check only
    python3 -I content/lesson-design/topic-4/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. The programs use
the lesson's ``fano`` and code search (subtopics 1, 2, 5); a task on the smallest
length lists the shapes of the free branches, as subtopic 5 does by hand: each
free branch stays empty, takes one letter or splits in two.
``apps/api/tests/test_task_4_bank.py`` recomputes every answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, TWO, main  # noqa: E402

CODE = "Введите кодовое слово (последовательность из 0 и 1)."

FANO = """def fano(codes):
    for i in range(len(codes)):
        for j in range(len(codes)):
            if i != j and codes[j].startswith(codes[i]):
                return False
    return True


def codes_of(length):
    return [bin(x)[2:].zfill(length)
            for x in range(2 ** length)]


"""

# The free branches and the shapes of the tree (subtopic 5).
SHAPES = (
    FANO
    + """def free_branches(used):
    \"\"\"Free vertices next to the paths of the used codes.\"\"\"
    result = []
    for code in used:
        for k in range(len(code)):
            for b in '01':
                v = code[:k] + b
                if all(not c.startswith(v)
                       and not v.startswith(c) for c in used):
                    if v not in result:
                        result.append(v)
    return result


def fill(d, k):
    \"\"\"Depths of k letters in a branch of depth d: one letter
    there, or two non-empty halves.\"\"\"
    if k == 1:
        return [[d]]
    result = []
    for i in range(1, k):
        for left in fill(d + 1, i):
            for right in fill(d + 1, k - i):
                result.append(left + right)
    return result


def leaves(depths, k):
    \"\"\"Depths of k letters spread over the free branches.\"\"\"
    if k == 0:
        return [[]]
    if not depths:
        return []
    d, rest = depths[0], depths[1:]
    result = list(leaves(rest, k))
    for here in range(1, k + 1):
        for part in fill(d, here):
            for tail in leaves(rest, k - here):
                result.append(part + tail)
    return result


def best(used, weights):
    \"\"\"Smallest sum of weight · length of the new codes:
    frequent letters take the short places.\"\"\"
    depths = [len(v) for v in free_branches(used)]
    w = sorted(weights, reverse=True)
    return min(sum(x * y for x, y in zip(w, sorted(ls)))
               for ls in leaves(depths, len(w)))


"""
)


def listing(name: str, items: list[str]) -> str:
    """``name = [...]``, wrapped at 64 characters as the lesson writes it."""
    line = f"{name} = {items!r}\n"
    if len(line) <= 65:
        return line
    rows, row = [], f"{name} = ["
    for k, item in enumerate(items):
        part = repr(item) + ("]" if k == len(items) - 1 else ",")
        if len(row) + len(part) + 1 > 64:
            rows.append(row.rstrip())
            row = " " * (len(name) + 4)
        row += part + " "
    rows.append(row.rstrip())
    return "\n".join(rows) + "\n"


def shortest(fixed: list[str], pick: str = "min", room: bool = False) -> str:
    """The shortest code compatible with ``fixed``; with ``room`` it must also
    leave a free branch for the remaining letters."""
    check = "fano(fixed + [c])" + (" and free_branches(fixed + [c])" if room else "")
    return (
        (SHAPES if room else FANO)
        + listing("fixed", fixed)
        + "for length in range(1, 8):\n"
        + f"    ok = [c for c in codes_of(length)\n          if {check}]\n"
        + f"    if ok:\n        print({pick}(ok))\n        break"
    )


# (page, number in the page) -> task definition; page 8 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 2),
        section="kod-bukvy",
        title="Закодировать слово ВАГА",
        difficulty=1,
        minutes=2,
        instruction="Введите запись слова и число знаков через пробел.",
        hint="Коды букв записываются подряд, без разделителей.",
        code="""code = {'А': '0', 'Б': '10', 'В': '110', 'Г': '111'}
s = ''
for letter in 'ВАГА':
    s += code[letter]
print(s, len(s))""",
    ),
    dict(
        at=(1, 3),
        section="chislo-posledovatelnostej",
        title="Равномерный код для 20 букв",
        difficulty=1,
        minutes=2,
        instruction=TWO,
        hint="Каждый знак удваивает число последовательностей.",
        code="""print(2 ** 6, min(k for k in range(1, 10) if 2 ** k >= 20))""",
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 1),
        section="chtenie-po-derevu",
        title="Декодировать по таблице",
        difficulty=1,
        minutes=2,
        instruction="Введите слово заглавными буквами.",
        hint="Идите от корня до буквы, затем снова от корня.",
        code="""def decode(bits, letter):
    word, buf = '', ''
    for b in bits:
        buf += b
        if buf in letter:
            word += letter[buf]
            buf = ''
    return word, buf


letter = {'00': 'А', '010': 'Б', '011': 'В', '1': 'Г'}
print(decode('010100011', letter)[0])""",
    ),
    dict(
        at=(2, 4),
        section="kratchajshij-kod",
        title="Кратчайший код Д",
        difficulty=1,
        minutes=2,
        instruction=CODE,
        hint="Проверяйте длины по возрастанию.",
        code=shortest(["00", "01", "110", "111"]),
    ),
    dict(
        at=(2, 5),
        section="kratchajshij-kod",
        title="Наименьший и наибольший кратчайший код",
        difficulty=2,
        minutes=3,
        instruction="Введите два кодовых слова через пробел: с наименьшим, затем с наибольшим значением.",
        hint="Среди кодов одной длины сравнивают числовые значения.",
        code=FANO
        + """fixed = ['0', '111', '101']
for length in range(1, 8):
    ok = [c for c in codes_of(length) if fano(fixed + [c])]
    if ok:
        print(min(ok), max(ok))
        break""",
    ),
    dict(
        at=(2, 6),
        section="svobodnaya-vetv",
        title="Все коды длины 4",
        difficulty=2,
        minutes=3,
        instruction="Введите коды через пробел в порядке возрастания.",
        hint="У каждой свободной ветви длины 3 два продолжения длины 4.",
        code=FANO
        + """fixed = ['1', '000', '011']
print(*[c for c in codes_of(4) if fano(fixed + [c])])""",
    ),
    dict(
        at=(2, 7),
        section="kratchajshij-kod",
        title="Кратчайший код П",
        difficulty=2,
        minutes=3,
        instruction=CODE,
        hint="Ведущие нули — часть кода.",
        code=shortest(["01", "001", "11", "100"]),
    ),
    dict(
        at=(2, 8),
        section="kratchajshij-kod",
        title="Кратчайший код К",
        difficulty=2,
        minutes=4,
        instruction=CODE,
        hint="Найдите свободные вершины дерева девяти кодов.",
        code=shortest(["000", "0010", "0011", "010", "0110", "100", "101", "1100", "111"]),
    ),
    dict(
        at=(2, 9),
        section="kratchajshij-kod",
        title="Кратчайший код с наибольшим значением",
        difficulty=2,
        minutes=3,
        instruction=CODE,
        hint="Из кодов наименьшей длины выберите больший.",
        code=shortest(["1", "001", "010"], "max"),
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 1),
        section="mesta-ne-hvatit",
        title="Место для Г",
        difficulty=2,
        minutes=3,
        instruction=CODE,
        hint="Код В не должен занять последнюю свободную ветвь.",
        code=shortest(["1", "01"], room=True),
    ),
    dict(
        at=(3, 2),
        section="naimenshaya-summa",
        title="Сумма длин четырёх кодов",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Разветвляйте свободную ветвь столько раз, сколько нужно букв.",
        code=SHAPES + "print(1 + best(['1'], [1, 1, 1]))",
    ),
    dict(
        at=(3, 3),
        section="naimenshaya-summa",
        title="Сумма длин семи кодов",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Пять букв в ветви 11.",
        code=SHAPES + "print(1 + 2 + best(['0', '10'], [1, 1, 1, 1, 1]))",
    ),
    dict(
        at=(3, 4),
        section="neskolko-vetvej",
        title="Три буквы в двух ветвях",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Делят самую короткую свободную вершину.",
        code=SHAPES + "print(best(['00', '011', '10'], [1, 1, 1]))",
    ),
    dict(
        at=(3, 5),
        section="neskolko-vetvej",
        title="Две буквы: короткая ветвь выгоднее",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Сравните одну букву в каждой ветви и деление короткой.",
        code=SHAPES + "print(best(['1', '011', '0101', '01001'], [1, 1]))",
    ),
    dict(
        at=(3, 6),
        section="odnoj-vetvi-hvataet",
        title="Кратчайший код Д в большом алфавите",
        difficulty=2,
        minutes=3,
        instruction=CODE,
        hint="Остальным буквам алфавита нужна хотя бы одна свободная ветвь.",
        code=shortest(["00", "010", "011", "10"], room=True),
    ),
    dict(
        at=(3, 7),
        section="naimenshaya-summa",
        title="Сумма длин шести кодов",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Сначала свободные ветви, потом их разветвление.",
        code=SHAPES + "print(1 + 3 + 3 + best(['0', '100', '110'], [1, 1, 1]))",
    ),
    dict(
        at=(3, 8),
        section="neskolko-vetvej",
        title="Две оставшиеся буквы",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Сравните свободные ветви по длине.",
        code=SHAPES + "print(best(['000', '001', '0100', '011', '10', '1101'], [1, 1]))",
    ),
    dict(
        at=(3, 9),
        section="mesta-ne-hvatit",
        title="Кратчайший код П с местом для Р",
        difficulty=2,
        minutes=3,
        instruction=CODE,
        hint="Код П не должен занять последнюю свободную ветвь.",
        code=shortest(["000", "001", "01", "10"], room=True),
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 1),
        section="chastoty-i-dliny",
        title="Длина записи АББАВ",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Сумма частот, умноженных на длины кодов.",
        code="""code = {'А': '0', 'Б': '10', 'В': '110', 'Г': '111'}
word = 'АББАВ'
total = 0
for letter in code:
    total += word.count(letter) * len(code[letter])
print(total)""",
    ),
    dict(
        at=(4, 2),
        section="chto-umenshat",
        title="Три разные величины",
        difficulty=1,
        minutes=2,
        instruction=THREE,
        hint="Сумма длин, длина записи слова и произведение — разные величины.",
        code="""code = {'А': '0', 'Б': '10', 'В': '110', 'Г': '111'}
total = sum(len(c) for c in code.values())
word = sum(len(code[letter]) for letter in 'ВАГА')
print(total, word, len(code['В']) * len(code['Г']))""",
    ),
    dict(
        at=(4, 3),
        section="chastym-korotkie",
        title="Два места и две буквы",
        difficulty=1,
        minutes=2,
        instruction=NUMBER,
        hint="Частой букве — короткое место.",
        code="""from itertools import permutations

places = [2, 3]
freq = [4, 1]
print(min(sum(f * p for f, p in zip(freq, order))
          for order in permutations(places)))""",
    ),
    dict(
        at=(4, 4),
        section="bukva-ne-v-slove",
        title="Слово МОМ",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Букве К, которой нет в слове, тоже нужно место: её частота 0.",
        code=SHAPES + "print(best(['0'], [2, 1, 0]))",
    ),
    dict(
        at=(4, 5),
        section="rezervnaya-vetv",
        title="Слово ТОСТ",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Все остальные буквы алфавита — одна резервная ветвь с частотой 0.",
        code=SHAPES
        + """fixed = ['00', '011', '101']
print(3 + 3 + best(fixed, [2, 0]))""",
    ),
    dict(
        at=(4, 6),
        section="chastym-korotkie",
        title="Слово КЕКЛЕТ",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Частоты: К и Е — по 2, Л и Т — по 1.",
        code=SHAPES + "print(best(['01', '100'], [2, 2, 1, 1]))",
    ),
    dict(
        at=(4, 7),
        section="rezervnaya-vetv",
        title="Слово ЖАБА",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Д и Е в слове нет, но им нужны места.",
        code=SHAPES
        + """fixed = ['010', '011', '10']
print(3 + best(fixed, [2, 1, 0, 0]))""",
    ),
    dict(
        at=(4, 8),
        section="chastoty-i-dliny",
        title="Слово КОЛОТОК",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="К и Т заданы, О встречается трижды.",
        code=SHAPES + "print(2 * 1 + 1 * 2 + best(['1', '01'], [3, 1]))",
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="lovushka-chastoj",
        title="Частоты 6, 2, 1, 1",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Сравните все формы дерева.",
        code=SHAPES + "print(best(['01', '10', '110'], [6, 2, 1, 1]))",
    ),
    dict(
        at=(5, 2),
        section="perebor-form",
        title="Три буквы в ветви без пустых мест",
        difficulty=1,
        minutes=2,
        instruction="Введите три длины через пробел в порядке возрастания.",
        hint="Ветвь делится, пока не наберётся три листа.",
        code=SHAPES + "print(*sorted(fill(2, 3)[0]))",
    ),
    dict(
        at=(5, 3),
        section="dokazatelstvo-minimuma",
        title="Четыре буквы в ветви 1",
        difficulty=2,
        minutes=3,
        instruction=TWO,
        hint="При неравных частотах выгодна неравная форма.",
        code=SHAPES + "print(best(['0'], [5, 1, 1, 1]), best(['0'], [2, 2, 2, 2]))",
    ),
    dict(
        at=(5, 4),
        section="lovushka-chastoj",
        title="Слово ПАСПОРТ",
        difficulty=3,
        minutes=5,
        instruction=NUMBER,
        hint="Отдать П код 1 — не лучший вариант.",
        code=SHAPES
        + """fixed = ['001', '01']
print(3 + 2 + best(fixed, [2, 1, 1, 1]))""",
    ),
    dict(
        at=(5, 5),
        section="lovushka-vtoroj",
        title="Слово МАКАРОНЫ",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Кратчайший код второй по частоте букве тоже может удлинить запись.",
        code=SHAPES
        + """fixed = ['1100', '1111']
print(4 + 4 + best(fixed, [2, 1, 1, 1, 1]))""",
    ),
    dict(
        at=(5, 6),
        section="perebor-form",
        title="Слово КАРКАС",
        difficulty=3,
        minutes=5,
        instruction=NUMBER,
        hint="Не забудьте резерв для Я.",
        code=SHAPES + "print(2 + best(['11'], [2, 2, 1, 0]))",
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 1),
        section="podschet-kodov",
        title="Сколько кодов для В",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Перечислите коды длин 2–5 в свободной ветви.",
        code=FANO
        + """count = 0
for length in range(1, 6):
    for new in codes_of(length):
        if fano(['1', '01', new]):
            count += 1
print(count)""",
    ),
    dict(
        at=(6, 2),
        section="podschet-kodov",
        title="Коды для В с местом для Г",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Код не должен занять последнее свободное место.",
        code=SHAPES
        + """count = 0
for length in range(1, 6):
    for new in codes_of(length):
        used = ['1', '01', new]
        if fano(used) and free_branches(used):
            count += 1
print(count)""",
    ),
    dict(
        at=(6, 3),
        section="podschet-kodov",
        title="Коды для В длиной до 4",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Свободных ветвей две — ни один код не забирает последнее место.",
        code=SHAPES
        + """count = 0
for length in range(1, 5):
    for new in codes_of(length):
        used = ['0', '100', new]
        if fano(used) and free_branches(used):
            count += 1
print(count)""",
    ),
    dict(
        at=(6, 5),
        section="proizvedenie-dlin",
        title="Наименьшее произведение длин",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Сравнивайте именно произведения.",
        code=SHAPES
        + """depths = [len(v) for v in
          free_branches(['10', '110', '1110', '11111'])]
print(min(a * b for a, b in leaves(depths, 2)))""",
    ),
    dict(
        at=(6, 6),
        section="dva-trebovaniya",
        title="Слово ВБГБД: два требования",
        difficulty=3,
        minutes=5,
        instruction=NUMBER,
        hint="Сначала наименьшая длина слова, затем среди таких — наименьшая сумма длин.",
        code=SHAPES
        + """weights = [2, 1, 1, 1]
depths = [len(v) for v in free_branches(['0'])]
pairs = []
for ls in leaves(depths, 4):
    word = sum(w * d for w, d in zip(weights, sorted(ls)))
    pairs.append((word, sum(ls)))
print(min(pairs)[1])""",
    ),
    dict(
        at=(6, 7),
        section="zapis-slova",
        title="Запись слова в восьмеричной системе",
        difficulty=3,
        minutes=5,
        instruction="Введите запись числа в восьмеричной системе.",
        hint="Сначала строят запись целиком, потом переводят.",
        code=FANO
        + """k = '10'
best = None
for lo in range(1, 4):
    for lt in range(1, 4):
        for o in codes_of(lo):
            for t in codes_of(lt):
                if fano([k, o, t]):
                    s = k + o + t + o + k
                    if best is None or (len(s), s) < best:
                        best = (len(s), s)
print(oct(int(best[1], 2))[2:])""",
    ),
    dict(
        at=(6, 8),
        section="chislo-edinic",
        title="Наименьшее число единиц",
        difficulty=3,
        minutes=5,
        instruction=NUMBER,
        hint="Каждый код весит столько, сколько в нём единиц; нужен резерв для алфавита.",
        code=SHAPES
        + """fixed = ['01', '111']
cands = [c for n in range(1, 5) for c in codes_of(n)
         if fano(fixed + [c])]
best = None
for v in cands:
    for g in cands:
        used = fixed + [v, g]
        if fano(used) and free_branches(used):
            ones = v.count('1') + 1 + g.count('1')
            if best is None or ones < best:
                best = ones
print(best)""",
    ),
    dict(
        at=(6, 9),
        section="narushenie-fano",
        title="Код, нарушающий условие Фано",
        difficulty=2,
        minutes=3,
        instruction=CODE,
        hint="Ищите на путях к буквам и под буквами.",
        code=FANO
        + """fixed = ['01', '11', '001']
for length in range(2, 6):
    bad = [c for c in codes_of(length)
           if c not in fixed and not fano(fixed + [c])]
    if bad:
        print(min(bad))
        break""",
    ),
    # ------------------------------------------------------------ subtopic 7
    dict(
        at=(7, 1),
        section="kody-po-povtoram",
        title="Коды А и Н по записи АНАНА",
        difficulty=2,
        minutes=4,
        instruction="Введите коды А и Н через пробел.",
        hint="3a + 2n = 7 — длины, затем коды по позициям.",
        code=FANO
        + """s = '0100100'
for la in range(1, 7):
    for ln in range(1, 7):
        if 3 * la + 2 * ln == len(s):
            a, n = s[:la], s[la:la + ln]
            if a + n + a + n + a == s and fano([a, n]):
                print(a, n)""",
    ),
    dict(
        at=(7, 2),
        section="kody-po-povtoram",
        title="Код Б по записи КАБАК",
        difficulty=2,
        minutes=4,
        instruction=CODE,
        hint="Начало и конец записи — код К.",
        code=FANO
        + """s = '100111010'
for lk in range(1, 5):
    for la in range(1, 5):
        lb = len(s) - 2 * lk - 2 * la
        if lb < 1:
            continue
        k, a = s[:lk], s[lk:lk + la]
        b = s[lk + la:lk + la + lb]
        if k + a + b + a + k == s and fano([k, a, b]):
            print(b)""",
    ),
    dict(
        at=(7, 3),
        section="uravnenie-na-dliny",
        title="Длина записи ЛЬЕН",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="2·длина(Л) + 2 + длина(Ь) = 9, и остальным буквам нужно место.",
        code=SHAPES
        + """fixed = ['00', '011', '110']
cands = [c for n in range(1, 6) for c in codes_of(n)]
found = set()
for l in cands:
    for soft in cands:
        used = fixed + [l, soft]
        if 2 * len(l) + 2 + len(soft) != 9:
            continue
        if fano(used) and free_branches(used):
            found.add(len(l) + len(soft) + 2 + 3)
print(*found)""",
    ),
    dict(
        at=(7, 4),
        section="dva-slova",
        title="Запись слова ЛАЛА",
        difficulty=3,
        minutes=5,
        instruction="Введите запись слова из 0 и 1.",
        hint="Общие буквы двух записей: К в конце первой и в начале второй.",
        code=FANO
        + """s1, s2 = '110010', '100110'
for ll in range(1, 5):
    for la in range(1, 5):
        l, a = s1[:ll], s1[ll:ll + la]
        k = s1[ll + la:]
        if k and k + a + l == s2 and fano([l, a, k]):
            print(l + a + l + a)""",
    ),
    dict(
        at=(7, 7),
        section="metod-haffmana",
        title="Метод Хаффмана",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Каждое объединение двух наименьших прибавляет их сумму к длине сообщения.",
        code="""import heapq

freq = [5, 3, 1, 1]
heapq.heapify(freq)
total = 0
while len(freq) > 1:
    a = heapq.heappop(freq)
    b = heapq.heappop(freq)
    total += a + b
    heapq.heappush(freq, a + b)
print(total)""",
    ),
    # ---------------------------------------------------- Практика и итог
    dict(
        at=(8, 1),
        title="Кратчайший код П с местом для Р",
        difficulty=2,
        minutes=4,
        instruction=CODE,
        hint="Код П не должен занять последнюю свободную ветвь.",
        code=shortest(["00", "01", "101", "11"], room=True),
    ),
    dict(
        at=(8, 2),
        title="Три оставшиеся буквы",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Делят самую короткую свободную ветвь.",
        code=SHAPES + "print(best(['000', '01', '100', '11', '1010'], [1, 1, 1]))",
    ),
    dict(
        at=(8, 3),
        title="Слово ЛОПАТА",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Л и О заданы; А встречается дважды.",
        code=SHAPES + "print(1 + 2 + best(['0', '10'], [2, 1, 1]))",
    ),
    dict(
        at=(8, 4),
        title="Слово ТАРАКАН",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Сравните формы дерева; Я нужна резервная ветвь.",
        code=SHAPES + "print(3 + best(['011'], [3, 1, 1, 1, 0]))",
    ),
    dict(
        at=(8, 5),
        title="Слово КОРОВА",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Все буквы алфавита — резервная ветвь с частотой 0.",
        code=SHAPES + "print(2 + best(['11'], [2, 1, 1, 1, 0]))",
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 4, TASKS))
