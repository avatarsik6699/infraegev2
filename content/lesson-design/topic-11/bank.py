"""Topic 11 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-11/bank.py          # check only
    python3 -I content/lesson-design/topic-11/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. A program counts
the way the lesson does: the bits of a symbol by ``while 2 ** i < A``, the bytes
of an object by ``ceil``, then the records and the memory; a bound «не более» or
«более» is searched over the possible values (subtopics 3, 4, 6). An answer the
file writes with spaces between the digit groups is matched by ``says``.
``apps/api/tests/test_task_11_bank.py`` recomputes every answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, TWO, main  # noqa: E402

BITS = """from math import ceil


def bits(alphabet):
    i = 1
    while 2 ** i < alphabet:
        i += 1
    return i


"""


def task(at, section, title, code, hint, *, instruction=NUMBER, difficulty=1, minutes=2, says=None):
    spec = dict(
        at=at,
        title=title,
        difficulty=difficulty,
        minutes=minutes,
        instruction=instruction,
        hint=hint,
        code=BITS + code if "bits(" in code or "ceil(" in code else code,
    )
    if section:
        spec["section"] = section
    if says:
        spec["says"] = says
    return spec


# (page, number in the page) -> task definition; page 7 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    task(
        (1, 1),
        "minimalno-vozmozhnoe",
        "Биты для 17, 32 и 33 символов",
        "print(bits(17), bits(32), bits(33))",
        "i битов дают 2ⁱ кодов.",
        instruction=THREE,
    ),
    task(
        (1, 2),
        "celye-bajty",
        "Пароль из 9 символов",
        "print(ceil(9 * bits(26 + 10) / 8))",
        "Алфавит — 26 букв и 10 цифр.",
    ),
    task(
        (1, 3),
        "chto-okruglyat",
        "200 паролей",
        "print(200 * ceil(13 * bits(9) / 8))",
        "Целые байты выделяют каждому паролю.",
    ),
    task(
        (1, 4),
        "alfavit",
        "Требования «хотя бы один»",
        "print(40 * ceil(12 * bits(52 + 10 + 4) / 8))",
        "Требования к составу пароля алфавит не меняют.",
        minutes=3,
    ),
    task(
        (1, 5),
        "kolichestvo-i-pamyat",
        "Сколько паролей и сколько битов",
        "print(4 ** 6, 6 * bits(4))",
        "Количество паролей и память для одного — разные величины.",
        instruction=TWO,
    ),
    task(
        (1, 6),
        "elementy-i-sostoyaniya",
        "Описания узоров",
        "print(1024 * ceil(40 * bits(150) / 8) // 1024)",
        "Элементы вместо символов не меняют расчёта.",
    ),
    task(
        (1, 7),
        "chto-okruglyat",
        "Байты каждому коду или всей последовательности",
        "code = 11 * bits(6)\nprint(15 * ceil(code / 8), ceil(15 * code / 8))",
        "Округляют тот объект, которому выделяют целые байты.",
        instruction=TWO,
        minutes=3,
    ),
    task(
        (1, 8),
        "raschyot-python",
        "Идентификаторы в Мбайтах",
        "per = ceil(180 * bits(16 + 2000) / 8)\nprint(524_288 * per // 2 ** 20)",
        "Алфавит — цифры шестнадцатеричной системы и специальные знаки.",
        minutes=3,
    ),
    task(
        (1, 9),
        "raschyot-python",
        "Наименьшее целое число Кбайт",
        "per = ceil(95 * bits(10 + 26 + 1200) / 8)\nprint(ceil(12_000 * per / 1024))",
        "Объём в Кбайтах округляют вверх.",
        minutes=3,
    ),
    # ------------------------------------------------------------ subtopic 2
    task(
        (2, 1),
        "dopolnitelnye-svedeniya",
        "64 пользователя",
        "print(64 * (ceil(10 * bits(26) / 8) + 20))",
        "Запись — пароль и сведения.",
    ),
    task(
        (2, 2),
        "dopolnitelnye-svedeniya",
        "128 пользователей",
        "print(128 * (ceil(15 * bits(12) / 8) + 9))",
        "Запись — пароль и сведения.",
    ),
    task(
        (2, 3),
        "obratnyj-hod",
        "Сведения на пользователя",
        "record = 6 * 1024 // 256\nprint(record - ceil(13 * bits(40) / 8))",
        "Из размера записи вычтите пароль.",
        minutes=3,
    ),
    task(
        (2, 4),
        "obratnyj-hod",
        "Сведения при 1080 байтах",
        "record = 1080 // 30\nprint(record - ceil(14 * bits(30) / 8))",
        "Обратный ход по той же цепочке.",
        minutes=3,
    ),
    task(
        (2, 5),
        "obshchij-zagolovok",
        "База с общим заголовком",
        "print(64 + 200 * (ceil(8 * bits(12) / 8) + 12))",
        "Заголовок прибавляют один раз.",
    ),
    task(
        (2, 6),
        "svedeniya-v-bitah",
        "Сведения в битах",
        "print(12 * 8 - 9 * bits(9))",
        "Пароль без отдельного округления.",
    ),
    task(
        (2, 7),
        "svedeniya-v-bitah",
        "Подряд или по частям",
        "pwd = 11 * bits(5)\nprint(ceil((pwd + 25) / 8), ceil(pwd / 8) + ceil(25 / 8))",
        "Где выделяются целые байты, решает формулировка.",
        instruction=TWO,
        minutes=3,
    ),
    task(
        (2, 8),
        "obratnyj-hod",
        "Сведения при 300 Кбайт",
        "record = 300 * 1024 // 4096\nprint(record - ceil(60 * bits(52 + 10 + 4) / 8))",
        "Размер записи — память, делённая на число пользователей.",
        minutes=3,
    ),
    task(
        (2, 9),
        "dopolnitelnye-svedeniya",
        "Данные о 500 объектах",
        "print(500 * (ceil(25 * bits(26 + 10 + 2) / 8) + 30))",
        "Дефис и точка — тоже символы алфавита.",
        minutes=3,
        says=["24 500"],
    ),
    # ------------------------------------------------------------ subtopic 3
    task(
        (3, 1),
        "dlina-parolya",
        "Длина пароля по 9 байтам",
        "ok = [n for n in range(1, 30) if ceil(n * bits(40) / 8) == 9]\nprint(min(ok), max(ok))",
        "Двойное неравенство 64 < 6L ≤ 72.",
        instruction=TWO,
    ),
    task(
        (3, 2),
        "moshchnost-alfavita",
        "Мощность алфавита по 9 байтам",
        "ok = [a for a in range(2, 300)\n      if ceil(12 * bits(a) / 8) == 9]\nprint(min(ok), max(ok))",
        "Сначала число битов, потом мощность.",
        instruction=TWO,
        minutes=3,
    ),
    task(
        (3, 4),
        "naibolshaya-dlina",
        "Наибольшая длина пароля",
        "record = 2048 // 100\nok = [n for n in range(1, 60)\n      if ceil(n * bits(33) / 8) + 3 <= record]\nprint(max(ok))",
        "От наибольшего размера записи — к паролю.",
        minutes=3,
    ),
    task(
        (3, 5),
        "naibolshaya-moshchnost",
        "Наибольшая мощность алфавита",
        "ok = [a for a in range(2, 1000)\n      if ceil(15 * bits(a) / 8) <= 480 // 40]\nprint(max(ok))",
        "Наибольшее целое число битов.",
        minutes=3,
    ),
    task(
        (3, 6),
        "specialnye-simvoly",
        "Специальные символы",
        "most = (30 * 1024 // 1000) * 8 // 24\nprint(2 ** most - 36)",
        "Сначала весь алфавит, потом вычесть известные символы.",
        minutes=3,
    ),
    task(
        (3, 7),
        "naibolshee-chislo-zapisej",
        "Пользователи в 3 Мбайт",
        "record = ceil(16 * bits(40) / 8) + 19\nprint(3 * 2 ** 20 // record)",
        "Целая часть деления памяти на размер записи.",
        minutes=3,
        says=["101 475"],
    ),
    task(
        (3, 8),
        "krupnye-chisla",
        "Мощность алфавита серийного номера",
        "most = 200 * 2 ** 20 // 700_000 * 8 // 310\nprint(2 ** most)",
        "Байты на номер — целая часть, затем биты на символ.",
        minutes=3,
    ),
    task(
        (3, 9),
        "krupnye-chisla",
        "Длина серийного номера",
        "per = 500 * 1024 // 3000\nprint(per * 8 // bits(10 + 52 + 700))",
        "Алфавит — цифры, латинские буквы обоих регистров и специальные символы.",
        minutes=3,
    ),
    # ------------------------------------------------------------ subtopic 4
    task(
        (4, 1),
        "naimenshee-chislo-bajtov",
        "«Не менее» и «более»",
        "print(ceil(1000 / 40), 1000 // 40 + 1)",
        "При «более» равенство не подходит.",
        instruction=TWO,
    ),
    task(
        (4, 2),
        "ne-pomeshchaetsya",
        "Минимальная длина пароля",
        "a = min(n for n in range(1, 60)\n        if 100 * ceil(n * bits(17) / 8) >= 1000)\n"
        "b = min(n for n in range(1, 60)\n        if 100 * ceil(n * bits(17) / 8) > 1000)\nprint(a, b)",
        "Код должен не помещаться в меньшее число байтов.",
        instruction="Введите два числа через пробел: для «не менее», затем для «более».",
        minutes=4,
        difficulty=2,
    ),
    task(
        (4, 3),
        "ne-pomeshchaetsya",
        "Более 450 байтов",
        "print(min(n for n in range(1, 60)\n          if 50 * ceil(n * bits(30) / 8) > 450))",
        "B ≥ ⌊450 / 50⌋ + 1.",
        minutes=3,
    ),
    task(
        (4, 4),
        "minimalnaya-moshchnost",
        "Минимальная мощность алфавита",
        "print(min(a for a in range(2, 5000)\n          if 200 * ceil(13 * bits(a) / 8) >= 2001))",
        "Минимальное подходящее число битов, затем мощность.",
        minutes=3,
    ),
    task(
        (4, 5),
        "minimalnyj-nabor",
        "Наименьший специальный набор",
        "print(min(s for s in range(0, 5000)\n          if 400 * ceil(20 * bits(36 + s) / 8) >= 6800))",
        "Сначала минимальный алфавит, затем вычесть известные символы.",
        minutes=3,
    ),
    task(
        (4, 6),
        "celaya-chast-zapisi",
        "Наименьший заголовок",
        "long = ceil(40 * bits(100) / 8)\nshort = ceil(25 * bits(100) / 8)\n"
        "data = 3 * long + 5 * short\n"
        "print(min(h for h in range(100) if data + 8 * h > 300))",
        "Заголовок у каждого сообщения.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (4, 7),
        "krupnye-chisla-granica",
        "Минимальная длина номера",
        "print(min(n for n in range(1, 500)\n          if 200_000 * ceil(n * bits(5036) / 8) > 30 * 2 ** 20))",
        "Алфавит — 10 + 26 + 5000 символов.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (4, 8),
        "krupnye-chisla-granica",
        "Минимальная мощность алфавита номера",
        "print(min(a for a in range(2, 5000)\n          if 2_000_000 * ceil(40 * bits(a) / 8)\n          >= 95 * 2 ** 20))",
        "Наименьшее число битов, при котором номера не помещаются в меньшее.",
        minutes=4,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 5
    task(
        (5, 1),
        "nomer-kak-chislo",
        "Номер числом и код из 256",
        "print((256).bit_length(), bits(256))",
        "Номер 256 записывается числом, а коды нумеруют варианты.",
        instruction=TWO,
    ),
    task(
        (5, 2),
        "gde-bajty",
        "Байты всему коду или по частям",
        "a, d = 5 * bits(26), 3 * bits(10)\nprint(ceil((a + d) / 8), ceil(a / 8) + ceil(d / 8))",
        "Где выделяются целые байты, решает формулировка.",
        instruction=TWO,
    ),
    task(
        (5, 3),
        "razbor-koda",
        "Свои биты или общий код",
        "print(ceil((6 * bits(26) + 4 * bits(9)) / 8),\n      ceil(10 * bits(26 + 9) / 8))",
        "Ноль не используется: цифр девять.",
        instruction=TWO,
        minutes=3,
    ),
    task(
        (5, 4),
        "nomer-i-kod",
        "Номер в своих байтах",
        "code = ceil(13 * bits(22) / 8)\nnumber = ceil((100).bit_length() / 8)\nprint(32 - code - number)",
        "Номер — двоичное число от 1 до 100.",
        minutes=3,
    ),
    task(
        (5, 5),
        "nomer-i-kod",
        "Номер вместе с кодом",
        "both = ceil((13 * bits(22) + (100).bit_length()) / 8)\nprint(32 - both)",
        "Код и номер вместе занимают целые байты.",
        minutes=3,
    ),
    task(
        (5, 6),
        "bit-length",
        "Срок действия на пропуске",
        "code = ceil(10 * bits(26) / 8)\n"
        "term = ceil(((63).bit_length() + (366).bit_length()) / 8)\nprint(code + term)",
        "Год и день — двоичные числа минимальной длины.",
        minutes=3,
    ),
    task(
        (5, 7),
        "urovni",
        "Описания 4096 объектов",
        "block = ceil((5 * bits(36) + (1000).bit_length()) / 8)\nprint(4096 * 30 * block // 1024)",
        "Снизу вверх: блок, объект, все объекты.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (5, 8),
        "nomer-i-kod",
        "Дополнительные данные объекта",
        "code = ceil((8 * bits(26) + (5000).bit_length()) / 8)\nprint(2368 // 64 - code)",
        "Код — буквы категории и номер вместе.",
        minutes=3,
    ),
    task(
        (5, 9),
        "urovni",
        "Дополнительная информация объекта",
        "ident = ceil(6 * bits(26) / 8)\nstruct = ceil(40 * bits(3000) / 8)\n"
        "print(2 * 2 ** 20 // 16_384 - ident - struct)",
        "Идентификатор, структура, дополнительная информация.",
        minutes=4,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 6
    task(
        (6, 1),
        "chislo-zagolovkov",
        "Сообщение с заголовками",
        "print(25 + ceil(25 / 6) * 2)",
        "Неполная последняя группа тоже получает заголовок.",
    ),
    task(
        (6, 2),
        "naibolshee-soobshchenie",
        "Наибольшее число символов",
        "size = max(b for b in range(1, 100) if b + ceil(b / 5) <= 60)\n"
        "print(size * 8 // bits(100))",
        "Сначала наибольший объём сообщения с заголовками.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (6, 3),
        "razmer-zavisit",
        "Код изделия больше 4 байтов",
        "print(min(n for n in range(1, 100_000)\n          if 4 * bits(26) + n.bit_length() > 32))",
        "Длина номера растёт вместе с числом изделий.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (6, 4),
        "perebor-kolichestva",
        "Изделий в партии не более 8 Кбайт",
        "best = 0\nfor n in range(1, 2000):\n"
        "    record = ceil((10 * bits(26) + n.bit_length()) / 8) + 20\n"
        "    if n * record <= 8 * 1024:\n        best = n\nprint(best)",
        "Длина номера зависит от числа изделий — перебирайте n.",
        minutes=4,
        difficulty=3,
    ),
    task(
        (6, 5),
        "naibolshee-soobshchenie",
        "Сообщение не более 2 Кбайт",
        "size = max(b for b in range(1, 3000) if b + ceil(b / 7) <= 2048)\n"
        "print(size * 8 // bits(300))",
        "Наибольший объём сообщения, затем символы.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (6, 6),
        "perebor-kolichestva",
        "Изделий в партии не более 60 Кбайт",
        "best = 0\nfor n in range(1, 3000):\n"
        "    record = ceil((15 * bits(52) + n.bit_length()) / 8) + 45\n"
        "    if n * record <= 60 * 1024:\n        best = n\nprint(best)",
        "Перебирайте число изделий.",
        minutes=4,
        difficulty=3,
    ),
    # ---------------------------------------------------- Практика и итог
    task(
        (7, 1),
        None,
        "Идентификаторы в Мбайтах",
        "per = ceil(220 * bits(10 + 3500) / 8)\nprint(2 ** 20 * per // 2 ** 20)",
        "Алфавит из частей и целые байты.",
        minutes=3,
    ),
    task(
        (7, 2),
        None,
        "Сведения при 20 Кбайт",
        "record = 20 * 1024 // 512\nprint(record - ceil(30 * bits(36) / 8))",
        "Обратная задача о сведениях.",
        minutes=3,
    ),
    task(
        (7, 3),
        None,
        "Мощность алфавита при 3 Мбайт",
        "most = 3 * 2 ** 20 // 40_000 * 8 // 150\nprint(2 ** most)",
        "«Не более»: байты на номер — целая часть.",
        minutes=3,
    ),
    task(
        (7, 4),
        None,
        "Минимальная длина номера",
        "print(min(n for n in range(1, 500)\n          if 5000 * ceil(n * bits(2036) / 8) > 600 * 1024))",
        "«Более»: номер не помещается в меньшее число байтов.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (7, 5),
        None,
        "Дополнительная информация карты",
        "code = ceil(12 * bits(18) / 8)\nnumber = ceil((1500).bit_length() / 8)\nprint(40 - code - number)",
        "Номер подразделения — двоичное число.",
        minutes=3,
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 11, TASKS))
