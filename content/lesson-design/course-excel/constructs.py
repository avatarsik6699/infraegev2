"""Where the Excel course explains each construct the EGE topics use.

excel_needs.py reads the formulas of SOURCES (```excel blocks, formulas in
inline code and, for the course source, formulas written in the prose) and
looks each construct up in CONSTRUCTS: (source section of the course, what it
is). The section owner and its level come from course.json. "+" after a
section marks a gap of the source that the course lesson fills (map.md).

Topics 18 and 22 have no source of their own in SOURCES yet: chapters 14–17 of
the course source — the worked tasks passed to those topics — stand for what
the topics need (decision of 2026-10-11, Change 176). Topic 3 has its own
source since Change 183.
"""

# source -> (EGE task shown in the report, line range or None for the whole file)
SOURCES = {
    "docs/artifacts/lessons/3.md": ("3", None),
    "docs/artifacts/lessons/9.md": ("9", None),
    "docs/artifacts/lessons/excel_course.md#14": ("9", (595, 696)),
    "docs/artifacts/lessons/excel_course.md#15": ("3", (697, 787)),
    "docs/artifacts/lessons/excel_course.md#16": ("18", (788, 881)),
    "docs/artifacts/lessons/excel_course.md#17": ("22", (882, 933)),
}

# actions the topics ask for in words (not formulas): regex over the prose
ACTIONS = {
    "fill": r"протян|маркер заполнения|заполни\w* (?:вниз|вправо|формул)|скопируй\w* (?:формул|вниз|вправо)",
    "filter": r"фильтр",
    "sort": r"сортир",
}

CONSTRUCTS = {
    # formulas and references
    "formula": ("4.1", "формула со знаком `=`"),
    "op arithmetic": ("4.2", "арифметика `+ - * /` и скобки"),
    "op ^": ("4.2", "степень `^`"),
    "op %": ("3.2", "знак процента `%`"),
    "op compare": ("7.1", "сравнения `= <> < > <= >=`"),
    "op &": ("8.2", "сцепление `&`"),
    "ref relative": ("5.1", "относительная ссылка `A2`"),
    "ref absolute": ("5.3", "абсолютная ссылка `$H$2`"),
    "ref mixed": ("5.4", "смешанная ссылка `$A2`, `A$1`"),
    "ref range": ("1.2", "диапазон `A2:F2`"),
    "ref sheet": ("15.3", "ссылка на другой лист `Товары!A2`"),
    "nested": ("6.1", "функция внутри функции"),
    "flag": ("7.3", "признак `ЕСЛИ(условие;1;0)`"),
    "criterion op": ("8.1", 'критерий-текст со сравнением `">5"`'),
    "criterion ref": ("8.2", 'критерий со ссылкой `">"&D2`'),
    "criterion wildcard": ("8.6", "шаблон `*` и `?` в критерии"),
    # functions
    "fn СУММ": ("6.1", "`СУММ`"),
    "fn СУММКВ": ("6.1+", "`СУММКВ` — сумма квадратов"),
    "fn СЧЁТ": ("6.2", "`СЧЁТ` — количество чисел"),
    "fn СЧЁТЗ": ("6.2", "`СЧЁТЗ` — непустые ячейки"),
    "fn СРЗНАЧ": ("6.3", "`СРЗНАЧ`"),
    "fn МИН": ("6.4", "`МИН`"),
    "fn МАКС": ("6.4", "`МАКС`"),
    "fn НАИБОЛЬШИЙ": ("6.4", "`НАИБОЛЬШИЙ` — k-е по величине"),
    "fn НАИМЕНЬШИЙ": ("6.4", "`НАИМЕНЬШИЙ`"),
    "fn ЕСЛИ": ("7.3", "`ЕСЛИ`"),
    "fn И": ("7.2", "`И`"),
    "fn ИЛИ": ("7.2", "`ИЛИ`"),
    "fn НЕ": ("7.2", "`НЕ`"),
    "fn СЧЁТЕСЛИ": ("8.1", "`СЧЁТЕСЛИ`"),
    "fn СЧЁТЕСЛИМН": ("8.3", "`СЧЁТЕСЛИМН`"),
    "fn СУММЕСЛИ": ("8.4", "`СУММЕСЛИ`"),
    "fn СУММЕСЛИМН": ("8.4", "`СУММЕСЛИМН`"),
    "fn СРЗНАЧЕСЛИ": ("8.4", "`СРЗНАЧЕСЛИ`"),
    "fn ОСТАТ": ("9.3", "`ОСТАТ`"),
    "fn ABS": ("9.3", "`ABS`"),
    "fn ЦЕЛОЕ": ("9.2", "`ЦЕЛОЕ`"),
    "fn ОКРУГЛВВЕРХ": ("9.2", "`ОКРУГЛВВЕРХ`"),
    "fn ДАТА": ("10.3", "`ДАТА`"),
    "fn ВПР": ("15.3", "`ВПР` с точным совпадением"),
    "fn ПОИСКПОЗ": ("15.4", "`ПОИСКПОЗ`"),
    "fn ИНДЕКС": ("15.4", "`ИНДЕКС`"),
    "fn СТРОКА": ("18.2+", "`СТРОКА()` — номер строки ячейки"),
    # actions
    "fill": ("5.2", "заполнение формулы вниз и вправо"),
    "fn ПРОМЕЖУТОЧНЫЕ.ИТОГИ": ("11.2", "`ПРОМЕЖУТОЧНЫЕ.ИТОГИ` — итог видимых строк"),
    "filter": ("11.2", "фильтр"),
    "sort": ("11.1", "сортировка"),
}
