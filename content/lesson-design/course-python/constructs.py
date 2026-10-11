"""Where the Python course explains each construct the EGE topic sources use.

needs_report.py parses every ``python`` block of SOURCES with ``ast`` and
looks each construct up in CONSTRUCTS: (source section of the course, what it
is). The section owner and its level come from course.json. A section
written as "тема NN" means the topic explains the tool itself (a library
used by one topic only); "+" after a section marks a gap of the source that
the course lesson fills (listed in map.md).
"""

# topic source -> EGE task number shown in the report
SOURCES = {
    "docs/artifacts/lessons/4.md": "4",
    "docs/artifacts/lessons/5.md": "5",
    "docs/artifacts/lessons/7.md": "7",
    "docs/artifacts/lessons/8.md": "8",
    "docs/artifacts/lessons/9.md": "9",
    "docs/artifacts/lessons/11.md": "11",
    "docs/artifacts/lessons/10.md": "13",
    "docs/artifacts/lessons/14.md": "14",
    "docs/artifacts/lessons/16_rekursion.md": "16",
    "docs/artifacts/lessons/17_num_sec.md": "17",
    "docs/artifacts/lessons/19_21_theory_of_game.md": "19–21",
    "docs/artifacts/lessons/23_graphs.md": "23",
    "docs/artifacts/lessons/24.md": "24",
    "docs/artifacts/lessons/25_dividers_and_mask.md": "25",
    "docs/artifacts/lessons/26_data_processing.md": "26",
    "docs/artifacts/lessons/27_clusters.md": "27",
}

CONSTRUCTS = {
    # program, values, numbers, input and output
    "print()": ("1.2", "вывод `print`"),
    "augassign": ("2.3", "`+=`, `-=`, `//=` и другие"),
    "op /": ("3.1", "деление `/`"),
    "op //": ("3.1", "целая часть частного `//`"),
    "op %": ("3.1", "остаток `%`"),
    "op **": ("3.1", "степень `**`"),
    "abs()": ("3.5", "модуль числа `abs`"),
    "min()": ("3.5", "`min`"),
    "max()": ("3.5", "`max`"),
    "round()": ("3.5", "округление `round`"),
    "int()": ("4.1", "`int` из текста"),
    "float()": ("4.2", "`float` из текста"),
    "str()": ("4.2", "`str` из числа"),
    "sep=": ("4.3", "разделитель `sep=` в `print`"),
    "end=": ("4.3", "окончание `end=` в `print`"),
    "f-string": ("4.4", "f-строка"),
    # logic and branching
    "and": ("5.2", "`and`"),
    "or": ("5.2", "`or`"),
    "not": ("5.2", "`not`"),
    "chained compare": ("5.2", "цепочка сравнений `a <= x < b`"),
    "if": ("6.1", "`if` и `else`"),
    "elif": ("6.2", "`elif`"),
    "ternary": ("6.4", "условное выражение `x if c else y`"),
    # loops
    "while": ("7.1", "цикл `while`"),
    "break": ("7.5", "`break`"),
    "continue": ("7.5", "`continue`"),
    "for": ("8.1", "цикл `for`"),
    "range()": ("8.2", "`range`"),
    "loop else": ("8.5", "`else` у цикла"),
    "is": ("8.5", "`is None`"),
    # strings
    "len()": ("9.1", "длина `len`"),
    "slice": ("9.2", "срезы"),
    "in": ("9.4", "проверка вхождения `in`"),
    ".count()": ("9.4", "`count` у строки и списка"),
    ".replace()": ("9.4", "`replace`"),
    ".strip()": ("9.4", "`strip`"),
    ".rstrip()": ("9.4", "`rstrip`"),
    ".endswith()": ("9.4", "`endswith`"),
    ".zfill()": ("9.4+", "дополнение нулями `zfill`"),
    # lists, tuples, dictionaries, sets
    "list literal": ("10.1", "список `[…]`"),
    ".append()": ("10.1", "`append`"),
    ".pop()": ("10.1", "`pop`"),
    ".index()": ("10.1", "`index`"),
    ".reverse()": ("10.1+", "`reverse` у списка"),
    ".copy()": ("10.3", "`copy`"),
    "list()": ("10.3", "`list` из перебираемого"),
    ".split()": ("10.5", "`split`"),
    ".join()": ("10.5", "`join`"),
    "tuple": ("11.1", "кортеж"),
    "unpack": ("11.2", "распаковка `a, b = …`"),
    "star": ("11.3", "звёздочка при распаковке и в вызове"),
    "enumerate()": ("11.3", "`enumerate`"),
    "dict literal": ("12.1", "словарь `{ключ: значение}`"),
    ".get()": ("12.1", "`get` со значением по умолчанию"),
    ".values()": ("12.3", "`values`"),
    "set literal": ("13.1", "множество `{…}`"),
    "set()": ("13.1", "`set`"),
    ".add()": ("13.2", "`add`"),
    ".update()": ("13.2+", "`update` у множества"),
    # comprehensions and functions over collections
    "listcomp": ("14.1", "списковое включение"),
    "sum()": ("14.4", "`sum`"),
    "all()": ("14.4", "`all`"),
    "any()": ("14.4", "`any`"),
    # functions
    "def": ("15.1", "`def`"),
    "return": ("15.2", "`return`"),
    "default args": ("15.5", "значение параметра по умолчанию"),
    "lambda": ("15.7", "`lambda`"),
    # sorting
    "sorted()": ("16.1", "`sorted`"),
    ".sort()": ("16.1", "`sort`"),
    "reverse=": ("16.1", "`reverse=True`"),
    "key=": ("16.2", "ключ `key=`"),
    # recursion
    "@cache": ("25.3", "декоратор `@cache`"),
    "from functools import cache": ("25.3", "`functools.cache`"),
    ".cache_clear()": ("25.3", "`cache_clear`"),
    "import sys": ("25.2+", "модуль `sys` и глубина рекурсии"),
    ".setrecursionlimit()": ("25.2+", "`sys.setrecursionlimit`"),
    ".getrecursionlimit()": ("25.2+", "`sys.getrecursionlimit`"),
    # files
    "open()": ("17.1", "`open`"),
    "with": ("17.1", "`with`"),
    ".read()": ("17.1", "`read`"),
    ".readline()": ("17.3", "`readline`"),
    # modules
    "from math import isqrt": ("19.1", "`math.isqrt`"),
    "from math import floor": ("19.1+", "`math.floor`"),
    "from math import fsum": ("19.1+", "`math.fsum`"),
    # iterators and the standard library
    "map()": ("20.2", "`map`"),
    "genexp": ("20.3", "генераторное выражение"),
    "from collections import Counter": ("20.5", "`Counter`"),
    "from collections import deque": ("20.5+", "очередь `deque`"),
    ".popleft()": ("20.5+", "`popleft` у `deque`"),
    "from fractions import Fraction": ("20.5", "`Fraction`"),
    "from decimal import Decimal": ("20.5", "`Decimal`"),
    "from itertools import product": ("23.1", "`itertools.product`"),
    "from itertools import permutations": ("23.2", "`itertools.permutations`"),
    # number notation, bits, patterns
    "bin()": ("22.4", "`bin`"),
    "oct()": ("22.4", "`oct`"),
    "hex()": ("22.4", "`hex`"),
    "format()": ("22.4+", "`format(n, 'b')`"),
    "op &": ("22.5", "побитовое И `&`"),
    "op ^": ("22.5", "исключающее ИЛИ `^`"),
    ".bit_length()": ("22.5", "`bit_length`"),
    "from fnmatch import fnmatch": ("23.4", "маска `fnmatch`"),
    "import re": ("23.5", "регулярные выражения `re`"),
    ".finditer()": ("23.5+", "`re.finditer`"),
    ".group()": ("23.5+", "`group` у совпадения"),
    ".start()": ("23.5+", "`start` у совпадения"),
    ".end()": ("23.5+", "`end` у совпадения"),
    # tools of a single topic, explained there
    "from ipaddress import ip_network": ("тема 13", "сети `ipaddress`"),
    "from ipaddress import ip_address": ("тема 13", "адреса `ipaddress`"),
    ".hosts()": ("тема 13", "`hosts` у сети"),
    "from heapq import heapify": ("тема 26", "куча `heapq`"),
    "from heapq import heappush": ("тема 26", "куча `heapq`"),
    "from heapq import heappop": ("тема 26", "куча `heapq`"),
    "from math import dist": ("тема 27", "расстояние `math.dist`"),
    "from math import atan2": ("тема 27", "угол `math.atan2`"),
    "from math import degrees": ("тема 27", "градусы `math.degrees`"),
    "import matplotlib.pyplot": ("тема 27", "рисунок точек `matplotlib`"),
    ".scatter()": ("тема 27", "`scatter`"),
    ".show()": ("тема 27", "`show`"),
    ".grid()": ("тема 27", "`grid`"),
    ".axis()": ("тема 27", "`axis`"),
}

# not constructs a student learns separately
IGNORE: set[str] = set()

RULE = (
    "**Правило уровней.** Конструкция, которую использует хотя бы одна тема ЕГЭ, "
    "объясняется в уроке основного уровня. Разделы, которые не нужны ни одной теме, "
    "остаются основными, если без них не читаются следующие уроки (например, "
    "строка документации или `try`); иначе это дополнительный уровень: классы, "
    "дополнительные механизмы языка, аннотации и тесты. Инструмент, который нужен "
    "одной теме и объясняется в ней самой (сети `ipaddress`, куча `heapq`, "
    "геометрия точек), помечен «тема NN»."
)

NOTES = (
    "Файл `10.md` — исходник задания 13 (IP-адреса), поэтому в отчёте он подписан "
    "номером 13. В исходниках заданий 4 и 7 программ на Python нет. Раздел со "
    "знаком «+» — пробел исходника учебника: урок курса добавляет конструкцию "
    "к этому разделу (список — в [карте курса](py-map.html))."
)
