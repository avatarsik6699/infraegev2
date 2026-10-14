"""Topic 7 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-7/bank.py          # check only
    python3 -I content/lesson-design/topic-7/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. A program counts
the way the lesson does: the number of elements, the size of one, then the units
asked; the rounding is the one the question names (subtopic 6). A decimal answer
is accepted with a comma as well; an answer the file writes with spaces between
the digit groups is matched by ``says``. ``apps/api/tests/test_task_7_bank.py``
recomputes every answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, TWO, main  # noqa: E402

DECIMAL = "Введите число; дробную часть можно отделить запятой или точкой."


def task(at, section, title, code, hint, *, instruction=NUMBER, difficulty=1, minutes=2, says=None):
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
    if says:
        spec["says"] = says
    return spec


def decimal(spec: dict, value: str) -> dict:
    """A decimal answer: the program prints it with a point, a comma is accepted too."""
    spec["instruction"] = DECIMAL
    spec["alt"] = [value.replace(".", ",")]
    spec["says"] = [value.replace(".", ",")]
    return spec


# (page, number in the page) -> task definition; page 8 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    task(
        (1, 1),
        "dlina-koda",
        "Код для 600 цветов",
        "i = 1\nwhile 2 ** i < 600:\n    i += 1\nprint(i)",
        "Наименьшее i, при котором 2ⁱ не меньше числа цветов.",
    ),
    task(
        (1, 2),
        "bajt",
        "Биты в 2,5 Мбайт",
        "print(int(2.5 * 1024 ** 2 * 8))",
        "Мбайт → Кбайт → байты → биты.",
        says=["20 971 520"],
    ),
    task(
        (1, 3),
        "stepeni-dvojki",
        "2²⁰ бит в Кбайтах",
        "print(2 ** 20 // 2 ** 13)",
        "В одном Кбайте 2¹³ бит.",
    ),
    task(
        (1, 4),
        "bajt",
        "Биты и байты",
        "print(3 * 1024 * 8, 6000 // 8)",
        "Из байтов в биты умножаем на 8, из битов в байты делим.",
        instruction=TWO,
        says=["24 576", "750"],
    ),
    task(
        (1, 5),
        "chislo-kodov",
        "12 бит и 4097 цветов",
        "i = 1\nwhile 2 ** i < 4097:\n    i += 1\nprint(2 ** 12, i)",
        "Каждый бит удваивает число кодов.",
        instruction=TWO,
    ),
    task(
        (1, 6),
        "obyom-teksta",
        "Текст в алфавите из 33 символов",
        "i = 1\nwhile 2 ** i < 33:\n    i += 1\nprint(1500 * i // 8)",
        "Сначала длина кода символа, потом объём текста.",
        minutes=3,
    ),
    task(
        (1, 7),
        "obyom-dannyh",
        "Документ из 32 страниц",
        "print(32 * 50 * 64 * 2 // 1024)",
        "Количество символов, умноженное на объём одного.",
    ),
    task(
        (1, 8),
        "obyom-teksta",
        "Сообщение в алфавите из 200 символов",
        "i = 1\nwhile 2 ** i < 200:\n    i += 1\nprint(4096 * i // 2 ** 13)",
        "200 символов требуют 8 бит.",
        minutes=3,
    ),
    task(
        (1, 9),
        "dlina-koda",
        "100 000 цветов",
        "i = 1\nwhile 2 ** i < 100_000:\n    i += 1\nprint(i)",
        "2¹⁶ = 65 536 — мало.",
    ),
    # ------------------------------------------------------------ subtopic 2
    task(
        (2, 1),
        "obyom-izobrazheniya",
        "Изображение 256 × 128",
        "i = 1\nwhile 2 ** i < 200:\n    i += 1\nprint(256 * 128 * i // 8192)",
        "Объём — число пикселей, умноженное на глубину цвета.",
        minutes=3,
    ),
    task(
        (2, 2),
        "obratnaya-zadacha",
        "Наибольшая палитра для 80 Кбайт",
        "i = 80 * 8192 // (320 * 200)\nprint(2 ** i)",
        "Целая глубина — наибольшая, при которой объём помещается.",
        minutes=3,
    ),
    decimal(
        task(
            (2, 3),
            "cveta-i-obyom",
            "16 цветов → 32 цвета",
            "print(5 / 4)",
            "Количество цветов удвоилось, а длина кода выросла на один бит.",
        ),
        "1.25",
    ),
    task(
        (2, 4),
        "razreshenie",
        "Скан 200 → 300 dpi",
        "print(int(8 * (300 / 200) ** 2))",
        "Разрешение растёт по двум измерениям сразу.",
    ),
    decimal(
        task(
            (2, 5),
            "po-poryadku",
            "Изображение 1024 × 768, 24 бита",
            "print(1024 * 768 * 24 / 2 ** 23)",
            "В одном Мбайте 2²³ бит.",
        ),
        "2.25",
    ),
    decimal(
        task(
            (2, 6),
            "glubina-cveta",
            "Палитра из 6000 цветов",
            "i = 1\nwhile 2 ** i < 6000:\n    i += 1\nprint(640 * 400 * i / 8192)",
            "Для 6000 цветов нужно 13 бит.",
            minutes=3,
        ),
        "406.25",
    ),
    task(
        (2, 8),
        "obratnaya-zadacha",
        "Наибольшее число цветов для 300 Кбайт",
        "i = 300 * 8192 // (1000 * 750)\nprint(2 ** i)",
        "Глубина — целая часть допустимого числа битов на пиксель.",
        minutes=3,
    ),
    task(
        (2, 9),
        "mnozhiteli",
        "Скан 400 → 200 dpi и 65 536 цветов",
        "print(int(36 * (200 / 400) ** 2 * 16 / 24))",
        "Перемножьте множители разрешения и глубины.",
        minutes=3,
    ),
    # ------------------------------------------------------------ subtopic 3
    task((3, 1), "szhatie", "Сжатие на 15 %", "print(40 * 85 // 100)", "Осталось 85 %."),
    task(
        (3, 2),
        "na-do-v",
        "На сколько процентов и во сколько раз",
        "print((80 - 20) * 100 // 80, 80 // 20)",
        "Процент уменьшения считают от исходного объёма.",
        instruction=TWO,
    ),
    task(
        (3, 3),
        "ishodnyj-obyom",
        "Объём до сжатия",
        "print(28 * 100 // 70)",
        "Сжатый объём делят на оставшуюся долю.",
    ),
    task(
        (3, 4),
        "posledovatelnye-izmeneniya",
        "Два сжатия подряд",
        "print(100 - 80 * 50 // 100)",
        "Оставшиеся доли перемножаются.",
    ),
    task(
        (3, 5),
        "zagolovok",
        "Заголовок до и после сжатия",
        "print(300 // 3 + 24, (300 + 24) // 3)",
        "Порядок сжатия и добавления заголовка меняет ответ.",
        instruction=TWO,
    ),
    task(
        (3, 6),
        "neskolko-fajlov",
        "Заголовок у каждого или один",
        "print(10 * (96 + 8), 10 * 96 + 8)",
        "Выясните, к чему относится служебная информация.",
        instruction=TWO,
    ),
    task(
        (3, 7),
        "drobnaya-glubina",
        "Палитра при сжатии на 40 %",
        "i = int(576 * 8192 / (0.6 * 1024 * 768))\nprint(2 ** i)",
        "Сжатый объём — 60 % исходного.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (3, 8),
        "obratnyj-poryadok",
        "Палитра 64 изображений",
        """per = 20 * 1024 // 64
data = (per - 32) * 100 // 75
i = data * 8192 // (1024 * 512)
print(2 ** i)""",
        "Действия отменяют в обратном порядке: заголовок, затем сжатие.",
        minutes=5,
        difficulty=2,
    ),
    task(
        (3, 9),
        "obratnyj-poryadok",
        "Описание карточки",
        """photo = 800 * 600 * 3 * 25 / 100 / 1024
card = 50 * 1024 / 100
print(round(card - photo))""",
        "Из объёма карточки вычтите сжатую фотографию.",
        minutes=5,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 4
    task(
        (4, 1),
        "obyom-zapisi",
        "Стереозапись 10 секунд",
        "print(16_000 * 10 * 2 * 16 // 8192)",
        "Отсчёты · каналы · биты, затем Кбайты.",
    ),
    decimal(
        task(
            (4, 2),
            "obyom-zapisi",
            "Монозапись 20 секунд",
            "print(48_000 * 20 * 24 / 8192)",
            "Килогерцы переводятся через 1000.",
        ),
        "2812.5",
    ),
    task(
        (4, 3),
        "dlitelnost",
        "Длительность стереозаписи",
        "print(3750 * 8192 // (32_000 * 2 * 16))",
        "Объём делят на объём одной секунды.",
    ),
    task(
        (4, 4),
        "vremya-v-sekundah",
        "Минуты в секунды",
        "print(3 * 60 + 45, int(2.5 * 60))",
        "В минуте 60 секунд.",
        instruction=TWO,
        minutes=1,
    ),
    task(
        (4, 5),
        "dve-zapisi",
        "Стерео, частота ×2, глубина ÷2, сжатие",
        "print(int(10 * 2 * 2 / 2 * 0.5))",
        "Перемножьте множители изменений.",
    ),
    task(
        (4, 6),
        "v-1-5-raza",
        "Квадро → стерео",
        "print(round(60 * 2 / 4 * 2 / 1.5))",
        "«В 1,5 раза меньше» — деление на 1,5.",
    ),
    decimal(
        task(
            (4, 7),
            "raznoe-szhatie",
            "Во сколько раз второй файл меньше",
            "print(0.8 / (1 / 2 * 2 * 0.25))",
            "Добавьте отношение оставшихся долей.",
            minutes=3,
        ),
        "3.2",
    ),
    task(
        (4, 8),
        "okruglenie-vverh",
        "Голосовое сообщение: целые Кбайты",
        "from math import ceil\n\nprint(ceil(24_000 * 2 * 16 * 187 / 8192))",
        "Наименьшее целое число Кбайт — округление вверх.",
        minutes=3,
        says=["17 532"],
    ),
    task(
        (4, 9),
        "dve-zapisi",
        "Моно → квадро",
        "print(int(18 * 4 / 2 / 3))",
        "Каналы ×4, глубина ÷2, частота ÷3.",
    ),
    task(
        (4, 10),
        "dlitelnost",
        "Длительность в минутах",
        "seconds = 330 * 2 ** 23 / (48_000 * 2 * 24)\nprint(round(seconds / 60))",
        "Ближайшее целое — обычное округление.",
        minutes=3,
    ),
    # ------------------------------------------------------------ subtopic 5
    task(
        (5, 1),
        "vremya-peredachi",
        "Передача минутной записи",
        "print(32_000 * 60 * 16 // 64_000)",
        "Время передачи — объём, делённый на скорость.",
    ),
    task(
        (5, 2),
        "bez-otstavaniya",
        "Наибольшая глубина для потока",
        "print(int(512_000 / (20_000 * 2 * 0.4)))",
        "За секунду канал должен пропускать всё, что запись создаёт за секунду.",
        minutes=3,
    ),
    task(
        (5, 3),
        "edinicy",
        "6 Мбайт по каналу 2²¹ бит/с",
        "print(6 * 2 ** 23 // 2 ** 21)",
        "Единицы объёма и скорости должны совпадать.",
    ),
    task(
        (5, 4),
        "skorost",
        "Сколько передаст канал",
        "print(256_000 * 120 // 8192)",
        "Скорость умножают на время.",
    ),
    task(
        (5, 5),
        "otnosheniya",
        "Файл больше, канал быстрее",
        "print(45 * 4 // 3)",
        "Сравнивайте отношения.",
    ),
    task(
        (5, 6),
        "nabor-snimkov",
        "Пакет из 50 снимков",
        "print(640 * 480 * 8 * 50 // 1_536_000)",
        "Сначала объём всего пакета.",
    ),
    task(
        (5, 7),
        "ekonomiya",
        "Экономия при отправке 40 снимков",
        "old = 2048 * 1536 * 24\nnew = 1024 * 768 * 16\nprint((old - new) * 40 // 2 ** 23)",
        "Экономия — разность объёмов.",
        minutes=3,
    ),
    task(
        (5, 8),
        "snimki",
        "Снимок в реальном времени",
        "from math import ceil\n\nshot = 1280 * 1024 * 2 / 1024 * 0.4\nprint(ceil(shot / 256))",
        "Снимок нужно успеть передать до следующего.",
        minutes=3,
        difficulty=2,
    ),
    task(
        (5, 9),
        "nabor-snimkov",
        "Пакет из 250 снимков в минутах",
        """i = 1
while 2 ** i < 5000:
    i += 1
seconds = 1920 * 1080 * i * 250 / 25_000_000
print(int(seconds / 60))""",
        "5000 цветов требуют 13 бит; в ответе целая часть минут.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (5, 10),
        "albom",
        "Скачивание альбома",
        """sound = 44_100 * 2 * 24 * 40 * 60
heads = 12 * 200 * 8192
print(int((sound + heads) / 100_000_000))""",
        "Общую длительность не умножают на число треков, заголовок — у каждого трека.",
        minutes=4,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 6
    task(
        (6, 1),
        "fajly-i-nositeli",
        "Файлы на 1 Мбайт",
        "print(1024 // 90)",
        "Целое число файлов — округление вниз.",
    ),
    task(
        (6, 2),
        "sosednee-znachenie",
        "Наименьший заголовок",
        "h = 0\nwhile (400 + 5 * h) / 50 <= 10:\n    h += 1\nprint(h)",
        "Строгое неравенство: проверьте соседнее значение.",
        minutes=3,
    ),
    task(
        (6, 3),
        "operacii-python",
        "Три способа округлить",
        "from math import ceil\n\nx = 1234.6\nprint(ceil(x), int(x), round(x))",
        "Вверх, целая часть и ближайшее целое.",
        instruction=THREE,
    ),
    task(
        (6, 5),
        "uroven-pamyati",
        "Записи по целому числу байтов",
        "from math import ceil\n\nprint(12 * ceil(7 * 5 / 8))",
        "Округляют на уровне, где выделяется память.",
        minutes=3,
    ),
    task(
        (6, 6),
        "fajly-i-nositeli",
        "Файлы и носители",
        "from math import ceil\n\nper = 700 // 64\nprint(per, ceil(50 / per))",
        "На носитель — вниз, носителей — вверх.",
        instruction=TWO,
    ),
    task(
        (6, 7),
        "sosednee-znachenie",
        "Заголовок трека альбома",
        """sound = 32_000 * 4 * 20 * 30 * 60
h = 0
while sound + 16 * h * 8192 <= 16 * 300_000_000:
    h += 1
print(h)""",
        "Скачивание длится больше 16 секунд: ищите наименьшее подходящее H.",
        minutes=5,
        difficulty=2,
    ),
    task(
        (6, 8),
        "zapolnennye-nositeli",
        "Снимки на заполненных картах",
        """from math import ceil

i = 1
while 2 ** i < 10_000_000:
    i += 1
shot = 3000 * 2000 * i // 8
per = 32 * 2 ** 30 // shot
cards = ceil(5000 / per)
print((cards - 1) * per)""",
        "Снимков на заполненных картах — (карт − 1) · снимков на карте.",
        minutes=5,
        difficulty=3,
    ),
    # ------------------------------------------------------------ subtopic 7
    task(
        (7, 1),
        "zamena-skana",
        "Доля текста после увеличения скана",
        "print(25 * 100 // (25 + 75 * 3))",
        "Доля считается от нового целого.",
    ),
    task(
        (7, 2),
        "odinakovyj-zagolovok",
        "Одинаковые заголовки: 33 и 9 Мбайт",
        "x = (33 - 9) // 3\nprint(9 - x)",
        "Разность файлов не содержит заголовка.",
    ),
    task(
        (7, 3),
        "odinakovyj-zagolovok",
        "Одинаковые заголовки: 70 и 16 Мбайт",
        "x = (70 - 16) // 9\nprint(16 - x)",
        "10x + H − (x + H) = 9x.",
    ),
    task(
        (7, 4),
        "zamena-skana",
        "Скан вчетверо меньше",
        "print(20 * 100 // (20 + 80 // 4))",
        "Текст не меняется, скан уменьшается.",
    ),
    decimal(
        task(
            (7, 5),
            "audiokniga",
            "Аудиокнига в моно",
            "seconds = 1024 / 2 * 60\nprint(seconds * 16_000 * 16 / 2 ** 23)",
            "Текст задаёт длительность через скорость чтения.",
            minutes=4,
        ),
        "937.5",
    ),
    task(
        (7, 6),
        "zamena-skana",
        "Скан 300 dpi со сжатием 75 %",
        "scan = 60 * 4 * 0.25 / 0.5\nprint(round(40 * 100 / (40 + scan)))",
        "Скан изменился в 4 · 0,25 / 0,5 раза.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (7, 7),
        "audiokniga",
        "Фрагменты аудиокниги",
        """seconds = 2048 / 4 * 60
mb = 16_000 * 2 * 16 * seconds / 2 ** 23
print(int(mb * 0.2 / 15))""",
        "Длительность → объём → сжатие → фрагменты.",
        minutes=5,
        difficulty=3,
    ),
    # ---------------------------------------------------- Практика и итог
    task(
        (8, 1),
        None,
        "Наибольшее число цветов для 900 Кбайт",
        "i = 900 * 8192 // (1280 * 720)\nprint(2 ** i)",
        "Целая глубина — наибольшая допустимая.",
        minutes=3,
    ),
    task(
        (8, 2),
        None,
        "Палитра 128 изображений",
        """per = 32 * 1024 // 128
data = (per - 16) * 100 / 75
i = int(data * 8192 / (640 * 480))
print(2 ** i)""",
        "Обратный ход; дробную глубину округляют вниз.",
        minutes=5,
        difficulty=2,
    ),
    task(
        (8, 3),
        None,
        "Голосовое сообщение 2 мин 35 с",
        "from math import ceil\n\nprint(ceil(22_050 * 2 * 16 * 155 / 8192))",
        "Наименьшее целое число Кбайт — вверх.",
        minutes=3,
        says=["13 351"],
    ),
    task(
        (8, 4),
        None,
        "Вторая передача",
        "print(round(50 * 2 * 0.5 * 1.5 / 3))",
        "Отношение объёмов, делённое на отношение скоростей.",
        minutes=3,
    ),
    task(
        (8, 5),
        None,
        "Пакет из 120 снимков",
        """i = 1
while 2 ** i < 1000:
    i += 1
print(int(2000 * 1500 * i * 120 / 14_000_000))""",
        "1000 цветов требуют 10 бит; целая часть секунд.",
        minutes=4,
        difficulty=2,
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 7, TASKS))
