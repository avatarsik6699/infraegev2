"""Topic 8 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-8/bank.py          # check only
    python3 -I content/lesson-design/topic-8/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. The programs are
the lesson's: ``product`` and ``permutations`` over the positions, a numbered
list as ``enumerate(…, start=1)`` with the number and the count kept apart, the
number of a word as a record in base q, and, where a search is too long, the
states, the type schemes and the count up to a bound of subtopic 7.
``apps/api/tests/test_task_8_bank.py`` recomputes every answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, main  # noqa: E402

WORD = "Введите слово заглавными буквами."


def wrap(condition: str, indent: int) -> str:
    """A long condition split at ``and`` the way the lesson writes it."""
    pad = " " * indent
    if "\n" in condition or len(f"{pad}if {condition}:") <= 64:
        return condition
    parts = condition.split(" and ")
    inner = pad + "        "
    return (
        "(\n"
        + "\n".join(f"{inner}{'and ' if k else ''}{part}" for k, part in enumerate(parts))
        + f"\n{pad}    )"
    )


def words(alphabet: str, length: int, condition: str, repeat: bool = True) -> str:
    """Count the words of the alphabet that pass the condition."""
    if repeat:
        head = "from itertools import product\n\n"
        loop = f"for letters in product('{alphabet}', repeat={length}):\n"
    else:
        head = "from itertools import permutations\n\n"
        loop = f"for letters in permutations('{alphabet}', {length}):\n"
    return (
        head
        + "count = 0\n"
        + loop
        + "    word = ''.join(letters)\n"
        + f"    if {wrap(condition, 4)}:\n"
        + "        count += 1\n"
        + "print(count)"
    )


def numbers(base: int, length: int, condition: str) -> str:
    """Count the numbers with ``length`` digits in base ``base`` that pass."""
    return (
        "from itertools import product\n\n"
        "count = 0\n"
        f"for d in product(range({base}), repeat={length}):\n"
        f"    if {wrap('d[0] != 0 and ' + condition, 4)}:\n"
        "        count += 1\n"
        "print(count)"
    )


def rank(alphabet: str, word: str) -> str:
    """The number of a word in the full list: its record in base q, plus one."""
    q = len(alphabet)
    return (
        f"alphabet = '{alphabet}'\n"
        f"word = '{word}'\n"
        "digits = ''.join(str(alphabet.index(c)) for c in word)\n"
        f"print(int(digits, {q}) + 1)"
    )


def by_number(alphabet: str, length: int, number: int) -> str:
    """The word with the given number: number − 1 in base q, with leading zeros."""
    q = len(alphabet)
    return (
        f"alphabet = '{alphabet}'\n"
        f"n = {number} - 1\n"
        "word = ''\n"
        f"for _ in range({length}):\n"
        f"    word = alphabet[n % {q}] + word\n"
        f"    n //= {q}\n"
        "print(word)"
    )


def listing(alphabet: str, length: int, condition: str, what: str) -> str:
    """A numbered full list: the first or the last number, or a count."""
    head = (
        "from itertools import product\n\n"
        + ("count = 0\n" if what == "count" else "last = None\n" if what == "last" else "")
        + "for number, letters in enumerate(\n"
        + f"        product('{alphabet}', repeat={length}), start=1):\n"
        + "    word = ''.join(letters)\n"
        + f"    if {wrap(condition, 4)}:\n"
    )
    body = {
        "count": "        count += 1\nprint(count)",
        "last": "        last = number\nprint(last)",
        "first": "        print(number)\n        break",
    }[what]
    return head + body


def task(at, section, title, code, hint, *, instruction=NUMBER, difficulty=1, minutes=2):
    spec = dict(
        at=at,
        title=title,
        difficulty=difficulty,
        minutes=minutes,
        instruction=instruction,
        hint=hint,
        code=code,
    )
    if section:
        spec["section"] = section
    return spec


ODD_E = "word.count('Е') >= 2 and 'НН' not in word"

# (page, number in the page) -> task definition; page 8 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    task(
        (1, 1),
        "umnozhenie",
        "Слова из пяти букв длины 4",
        "print(5 ** 4)",
        "На каждом месте любая из пяти букв.",
    ),
    task(
        (1, 2),
        "ogranicheniya-mest",
        "Начинается с А, кончается не на А",
        words("АБВГД", 4, "word[0] == 'А' and word[-1] != 'А'"),
        "Ограничение на место меняет только его множитель.",
    ),
    task(
        (1, 3),
        "bez-povtorenij",
        "Без повторений из шести букв",
        words("АБВГДЕ", 4, "True", repeat=False),
        "Каждая следующая буква — из оставшихся.",
    ),
    task(
        (1, 4),
        "alfavit-i-zapas",
        "Буквы слова КОЛОС",
        words("КОЛС", 3, "True"),
        "Разрешённые буквы — различные буквы слова.",
    ),
    task(
        (1, 5),
        "slozhenie",
        "Слова длины от 1 до 3",
        "print(sum(3 ** n for n in range(1, 4)))",
        "Слова разной длины не пересекаются — складываем.",
    ),
    task(
        (1, 6),
        "slozhenie",
        "Начинается с Б или кончается на О",
        words("АОБВГ", 4, "word[0] == 'Б' or word[-1] == 'О'"),
        "Слова вида Б??О вошли в оба случая.",
    ),
    task(
        (1, 8),
        "permutations",
        "Перестановки слова ПЛОТ",
        words("ПЛОТ", 4, "True", repeat=False),
        "Все буквы различны.",
    ),
    task(
        (1, 9),
        "ogranicheniya-mest",
        "Коды Пети",
        words("КРОНА", 5, "word[0] != 'Р' and word[-1] in 'ОА'"),
        "Первое и последнее места имеют свои множители.",
        minutes=3,
    ),
    task(
        (1, 10),
        "ogranicheniya-mest",
        "Коды Маши",
        words("СЛИВАТ", 6, "word[0] not in 'ИА' and word[-1] != 'Т'", repeat=False),
        "Разберите случаи: код начинается с Т или с другой согласной.",
        minutes=4,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 2
    task(
        (2, 1),
        "ostalnye-pozicii",
        "Ровно две А",
        words("АБВГД", 5, "word.count('А') == 2"),
        "Места для А без порядка, остальные — из четырёх букв.",
    ),
    task(
        (2, 2),
        "dopolnenie",
        "Хотя бы одна Б",
        words("АБВ", 5, "'Б' in word"),
        "Из всех слов вычтите слова без Б.",
    ),
    task(
        (2, 3),
        "odinakovye-bukvy",
        "Перестановки слова АНАНАС",
        "from itertools import permutations\n\nprint(len(set(permutations('АНАНАС'))))",
        "Одинаковые буквы нельзя считать различными.",
    ),
    task(
        (2, 4),
        "hotya-by-ne-bolee",
        "Не более одной А",
        words("АБВГ", 4, "word.count('А') <= 1"),
        "«Не более одной» — ноль или одна.",
    ),
    task(
        (2, 5),
        "neskolko-glasnyh",
        "Ровно три гласные",
        words("АОБВГ", 5, "sum(c in 'АО' for c in word) == 3"),
        "Выбор мест гласных и выбор самих гласных.",
        minutes=3,
    ),
    task(
        (2, 6),
        "peresecheniya",
        "И А, и Д",
        words("АБВГД", 4, "'А' in word and 'Д' in word"),
        "При вычитании учтите слова, где нет обеих букв.",
        minutes=3,
    ),
    task(
        (2, 8),
        "razbor-sluchaev",
        "Слова Васи",
        words("КОРАЛ", 6, "word.count('К') == 2 and word[0] != 'А'"),
        "Разберите случаи по первой букве.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (2, 9),
        "razbor-sluchaev",
        "Коды Светы",
        words("ПАРУС", 5, "sum(c in 'АУ' for c in word) >= 2 and word[-1] != 'С'"),
        "Разберите случаи по последней букве.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (2, 10),
        "odinakovye-bukvy",
        "Перестановки слова КОЛОКОЛ",
        "from itertools import permutations\n\nprint(len(set(permutations('КОЛОКОЛ'))))",
        "Две К, три О, две Л.",
    ),
    # ------------------------------------------------------------ subtopic 3
    task(
        (3, 1),
        "promezhutki",
        "Две А не рядом",
        words("АБ", 5, "word.count('А') == 2 and 'АА' not in word"),
        "Две А вставляют в разные промежутки вокруг трёх Б.",
    ),
    task(
        (3, 2),
        "odinakovye-sosedi",
        "Без одинаковых соседей",
        words("АБВ", 4, "all(word[i] != word[i + 1] for i in range(3))"),
        "Каждая следующая буква — любая, кроме предыдущей.",
    ),
    task(
        (3, 3),
        "odinakovye-sosedi",
        "С А и без одинаковых соседей",
        words("АБВГ", 6, "word[0] == 'А' and all(word[i] != word[i + 1] for i in range(5))"),
        "Первое место — одна буква, остальные — по три.",
    ),
    task(
        (3, 4),
        "blok",
        "П и Л рядом",
        words("ПЛАСТ", 5, "'ПЛ' in word or 'ЛП' in word", repeat=False),
        "Блок ПЛ или ЛП и ещё три буквы.",
    ),
    task(
        (3, 6),
        "chereduyutsya",
        "Гласные и согласные чередуются",
        words(
            "АОБВГ",
            6,
            "all((word[i] in 'АО') != (word[i + 1] in 'АО')\n           for i in range(5))",
        ),
        "Две схемы типов: с гласной и с согласной в начале.",
        minutes=3,
    ),
    task(
        (3, 8),
        "glasnye-ne-ryadom",
        "Коды Иры",
        words(
            "КАТЕРИ",
            6,
            "all(not (word[i] in 'АЕИ' and word[i + 1] in 'АЕИ')\n           for i in range(5))",
            repeat=False,
        ),
        "Согласные, затем гласные в промежутки.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (3, 9),
        "proverka-sosedej",
        "Коды Димы",
        """from itertools import product

count = 0
for letters in product('ДОМИК', repeat=5):
    word = ''.join(letters)
    if word.count('М') != 1:
        continue
    i = word.index('М')
    near = word[max(i - 1, 0):i] + word[i + 1:i + 2]
    if not any(c in 'ОИ' for c in near):
        count += 1
print(count)""",
        "Проверьте обоих соседей М.",
        minutes=4,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 4
    task(
        (4, 1),
        "nachalnyj-nol",
        "Трёхзначные пятеричные числа",
        numbers(5, 3, "True"),
        "Первая цифра не ноль.",
    ),
    task(
        (4, 2),
        "cifry-chislami",
        "Ровно одна цифра 6",
        numbers(8, 3, "d.count(6) == 1"),
        "Разберите, где стоит шестёрка.",
    ),
    task(
        (4, 3),
        "bez-povtora-cifr",
        "Различные цифры",
        numbers(8, 4, "len(set(d)) == 4"),
        "Начальный ноль учитывают отдельно.",
    ),
    task(
        (4, 4),
        "vozrastanie",
        "Строго возрастающие цифры",
        numbers(7, 3, "d[0] < d[1] < d[2]"),
        "Расстановку заменяет выбор трёх цифр из 1–6.",
    ),
    task(
        (4, 6),
        "chetnost",
        "Чётные семеричные четырёхзначные",
        "print(sum(1 for n in range(7 ** 3, 7 ** 4) if n % 2 == 0))",
        "При нечётном основании последняя цифра чётность не решает.",
    ),
    task(
        (4, 7),
        "ryadom-s-5",
        "Две семёрки без чётных соседей",
        """from itertools import product

count = 0
for d in product(range(8), repeat=5):
    if d[0] == 0 or d.count(7) != 2:
        continue
    ok = True
    for i in range(5):
        if d[i] == 7:
            for j in (i - 1, i + 1):
                if 0 <= j < 5 and d[j] % 2 == 0:
                    ok = False
    if ok:
        count += 1
print(count)""",
        "Проверяйте соседей каждой семёрки.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (4, 8),
        "bez-povtora-cifr",
        "Различные 12-ричные цифры, две больше 8",
        numbers(12, 4, "len(set(d)) == 4 and sum(x > 8 for x in d) == 2"),
        "Большие цифры — 9, 10, 11.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (4, 9),
        "dlina-ne-zadana",
        "Последняя цифра 0, длина не задана",
        """from itertools import permutations

count = 0
for length in range(2, 8):
    count += len(list(permutations(range(1, 7), length - 1)))
print(count)""",
        "Считайте по каждой длине и складывайте.",
        minutes=4,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 5
    task(
        (5, 1),
        "nomer-slova",
        "Номер слова ВАБВ",
        rank("АБВ", "ВАБВ"),
        "Запись в троичной системе плюс один.",
    ),
    task(
        (5, 2),
        "slovo-po-nomeru",
        "Слово под номером 20",
        by_number("АБВ", 4, 20),
        "Номер минус один — в троичную систему.",
        instruction=WORD,
    ),
    task(
        (5, 3),
        "nomer-slova",
        "Номер слова ГАББА",
        rank("АБВГ", "ГАББА"),
        "Запись в четверичной системе плюс один.",
    ),
    task(
        (5, 4),
        "nachalnye-nuli",
        "Слово под номером 500",
        by_number("АБВГ", 5, 500),
        "Начальные нули терять нельзя.",
        instruction=WORD,
    ),
    task(
        (5, 5),
        "obshchee-nachalo",
        "Первое слово на В",
        "print(2 * 3 ** 3 + 1)",
        "Перед ним все слова на А и Б.",
    ),
    task(
        (5, 6),
        "poryadok-alfavita",
        "Номер слова ТОК",
        rank("КОТ", "ТОК"),
        "Сначала запишите алфавит по порядку.",
    ),
    task(
        (5, 7),
        "raznaya-dlina",
        "Слова разной длины",
        "print(3 + int('22', 3) + 1)",
        "Сначала идут все однобуквенные.",
    ),
    task(
        (5, 8),
        "poryadok-alfavita",
        "Номер слова РУДАР",
        rank("АДРУ", "РУДАР"),
        "Алфавит по порядку: А, Д, Р, У.",
    ),
    task(
        (5, 9),
        "slovo-po-nomeru",
        "Слово под номером 700",
        by_number("КОТЫ", 5, 700),
        "Алфавит: К, О, Т, Ы.",
        instruction=WORD,
    ),
    task(
        (5, 10),
        "obshchee-nachalo",
        "Первое слово на Й",
        "print(3 ** 5 + 1)",
        "По алфавиту А < Й < М.",
    ),
    # ------------------------------------------------------------ subtopic 6
    task(
        (6, 1),
        "chetnost-nomera",
        "Чётные номера с одной А",
        listing("АБВГ", 3, "number % 2 == 0 and word.count('А') == 1", "count"),
        "Номер и количество хранятся раздельно.",
        minutes=3,
    ),
    task(
        (6, 2),
        "pervoe-i-poslednee",
        "Первое слово без А",
        listing("АБВ", 4, "'А' not in word", "first"),
        "Первое подходящее — с остановкой.",
    ),
    task(
        (6, 3),
        "pervoe-i-poslednee",
        "Последнее слово с двумя В",
        listing("АБВ", 4, "word.count('В') == 2", "last"),
        "Последнее — запоминая каждый новый подходящий номер.",
    ),
    task(
        (6, 4),
        "chetnost-nomera",
        "Нечётные номера с одной А",
        listing("АБВ", 4, "number % 2 == 1 and word.count('А') == 1", "count"),
        "Номер увеличивается для каждого слова полного списка.",
        minutes=3,
    ),
    task(
        (6, 5),
        "ne-sokrashchat",
        "Номер в сокращённом списке",
        """from itertools import product

number = 0
for letters in product('АБВ', repeat=4):
    word = ''.join(letters)
    if any(word[i] == word[i + 1] for i in range(3)):
        continue
    number += 1
    if word == 'БАБА':
        print(number)""",
        "Новый список нумеруют заново — номер растёт только у оставленных слов.",
        minutes=3,
    ),
    task(
        (6, 6),
        "odin-cikl",
        "Последнее слово с нечётным номером",
        listing(
            "АКОРТ",
            5,
            "number % 2 == 1 and word[0] != 'А' and word.count('О') == 2",
            "last",
        ),
        "Алфавит по порядку: А, К, О, Р, Т.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (6, 7),
        "odin-cikl",
        "Количество слов с чётными номерами",
        listing("ЕИЛНС", 6, f"number % 2 == 0 and {ODD_E}", "count"),
        "Алфавит по порядку: Е, И, Л, Н, С.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (6, 8),
        "odin-cikl",
        "Первое слово с чётным номером",
        listing(
            "АЕКЛМ",
            5,
            "number % 2 == 0 and word[0] not in 'АЕ' and word.count('Л') >= 2",
            "first",
        ),
        "Первое найденное — с остановкой.",
        minutes=4,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 7
    task(
        (7, 1),
        "sostoyaniya",
        "Без двух А подряд, длина 6",
        """end_a = 1
end_other = 3
for length in range(2, 7):
    new_a = end_other
    new_other = 3 * (end_a + end_other)
    end_a = new_a
    end_other = new_other
print(end_a + end_other)""",
        "Состояния: слово кончается на А или на другую букву.",
        minutes=3,
    ),
    task(
        (7, 2),
        "sostoyaniya",
        "Без двух Б подряд, длина 30",
        """end_b = 1
end_other = 2
for length in range(2, 31):
    new_b = end_other
    new_other = 2 * (end_b + end_other)
    end_b = new_b
    end_other = new_other
print(end_b + end_other)""",
        "Те же состояния, но других букв две.",
        minutes=3,
    ),
    task(
        (7, 3),
        "strogij-poryadok",
        "Возрастающие восьмеричные цифры",
        """from itertools import combinations

total = 0
for k in range(2, 8):
    total += len(list(combinations(range(1, 8), k)))
print(total)""",
        "Наборы цифр из 1–7, не менее двух.",
        minutes=3,
    ),
    task(
        (7, 4),
        "sostoyaniya",
        "Двадцать троичных цифр без двух нулей",
        """end_0 = 0
end_other = 2
for length in range(2, 21):
    new_0 = end_other
    new_other = 2 * (end_0 + end_other)
    end_0 = new_0
    end_other = new_other
print(end_0 + end_other)""",
        "Первая цифра не ноль: в начале 0 и 2.",
        minutes=3,
    ),
    task(
        (7, 5),
        "do-granicy",
        "Различные цифры не больше 41530₆",
        """from math import perm

def count_upto(bound, q):
    total = 0
    used = set()
    for i, d in enumerate(bound):
        rest = len(bound) - i - 1
        for x in range(d):
            if x in used or (i == 0 and x == 0):
                continue
            total += perm(q - len(used) - 1, rest)
        if d in used:
            return total
        used.add(d)
    return total + 1


print(count_upto([4, 1, 5, 3, 0], 6))""",
        "Разряд за разрядом, как номер слова.",
        minutes=5,
        difficulty=3,
    ),
    task(
        (7, 6),
        "shemy-tipov",
        "Три чётные цифры не рядом",
        """from itertools import product

total = 0
for types in product('чн', repeat=10):
    scheme = ''.join(types)
    if scheme.count('ч') != 3 or 'чч' in scheme:
        continue
    ways = 1
    for i, kind in enumerate(scheme):
        if kind == 'н':
            ways *= 4
        elif i == 0:
            ways *= 4
        else:
            ways *= 5
    total += ways
print(total)""",
        "Чётная на первом месте — 4 варианта, на остальных — 5.",
        minutes=5,
        difficulty=3,
    ),
    task(
        (7, 7),
        "shemy-tipov",
        "Два нуля и не более трёх букв",
        """from itertools import product

total = 0
for types in product('0bd', repeat=9):
    scheme = ''.join(types)
    if scheme[0] == '0' or scheme.count('0') != 2:
        continue
    if scheme.count('b') > 3:
        continue
    total += 5 ** scheme.count('b') * 9 ** scheme.count('d')
print(total)""",
        "Типы: ноль, цифра-буква (5 вариантов), остальные ненулевые (9).",
        minutes=5,
        difficulty=3,
    ),
    # ---------------------------------------------------- Практика и итог
    task(
        (8, 1),
        None,
        "Коды Лены",
        words("ФИЛЬМ", 6, "word[0] != 'Ь' and word.count('Ф') == 1"),
        "Разберите случаи по первой букве.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (8, 2),
        None,
        "Чередование чётности, различные цифры",
        numbers(
            9,
            5,
            "len(set(d)) == 5 and all(d[i] % 2 != d[i + 1] % 2 for i in range(4))",
        ),
        "Две схемы чередования; ноль не на первом месте.",
        minutes=5,
        difficulty=2,
    ),
    task(
        (8, 3),
        None,
        "Одна цифра A и не более двух малых",
        numbers(11, 6, "d.count(10) == 1 and sum(x < 3 for x in d) <= 2"),
        "Цифра A — значение 10, «меньше 3» — d < 3.",
        minutes=5,
        difficulty=2,
    ),
    task(
        (8, 4),
        None,
        "Слово под номером 444",
        by_number("АРФШ", 5, 444),
        "Алфавит по порядку: А, Р, Ф, Ш.",
        instruction=WORD,
    ),
    task(
        (8, 5),
        None,
        "Последнее слово с чётным номером",
        listing(
            "ЕЛОПТ",
            6,
            "number % 2 == 0 and word[0] != 'О' and word.count('Л') == 2 and 'ЕЕ' not in word",
            "last",
        ),
        "Номер и условия — раздельно.",
        minutes=5,
        difficulty=2,
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 8, TASKS))
