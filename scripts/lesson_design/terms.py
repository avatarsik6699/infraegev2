"""Python basics that topic lessons do not re-explain.

A lesson marks a term as {{key|label}}: the label stays in the sentence,
underlined with dots, and opens a popover with the title, a short explanation and a link to
the Python course lesson. The site export uses the same registry.
"""

# key: (title, explanation HTML, course lesson route slug, course lesson title)
TERMS: dict[str, tuple[str, str, str, str]] = {
    "eq": (
        "Сравнение == и присваивание =",
        "<code>n == 18</code> проверяет, равно ли <code>n</code> восемнадцати, и даёт "
        "<code>True</code> или <code>False</code>; <code>!=</code> — «не равно». "
        "Одиночный <code>=</code> — присваивание: <code>n = 18</code> записывает 18 в "
        "<code>n</code>.",
        "logicheskie-vyrazheniya",
        "Логические выражения",
    ),
    "andor": (
        "Составные условия and и or",
        "<code>a and b</code> истинно, когда верны оба условия. <code>a or b</code> — "
        "когда верно хотя бы одно, в том числе оба сразу.",
        "logicheskie-vyrazheniya",
        "Логические выражения",
    ),
    "for": (
        "Цикл for и range",
        "<code>for n in range(a, b):</code> по очереди даёт <code>n</code> значения a, "
        "a + 1, …, b − 1 и для каждого выполняет строки с отступом под ним. Правая "
        "граница b в перебор не входит, а <code>range(a, b, k)</code> идёт с шагом k.",
        "for-i-range",
        "Цикл for и диапазоны",
    ),
    "if": (
        "Условие if",
        "<code>if условие:</code> выполняет строки с отступом под ним, только если условие "
        "истинно. Отступ показывает, какие команды относятся к <code>if</code> или циклу.",
        "usloviya",
        "Ветвление: if, elif и else",
    ),
    "while": (
        "Цикл while",
        "<code>while условие:</code> повторяет строки с отступом, пока условие истинно. "
        "Удобен, когда заранее неизвестно, сколько будет повторений.",
        "while",
        "Цикл while и состояние программы",
    ),
    "break": (
        "Досрочный выход: break",
        "<code>break</code> сразу завершает ближайший цикл; строки после цикла продолжают "
        "выполняться.",
        "while",
        "Цикл while и состояние программы",
    ),
    "str": (
        "Строка, str и int",
        'Строка — символы в кавычках: <code>"1234"</code>. <code>str(1234)</code> '
        'превращает число в строку, <code>int("1234")</code> — строку из цифр в число. '
        'Строки при сложении склеиваются: <code>"12" + "34"</code> даёт '
        '<code>"1234"</code>.',
        "vvod-i-vyvod",
        "Ввод, преобразование и вывод",
    ),
    "len": (
        "Длина: len",
        "<code>len(s)</code> — количество символов строки или элементов списка. Для "
        "натурального n <code>len(str(n))</code> — число его цифр.",
        "stroki",
        "Строки",
    ),
    "in": (
        "Проверка вхождения: in",
        '<code>"7" in s</code> даёт <code>True</code>, если подстрока <code>"7"</code> '
        "встречается в строке <code>s</code>; <code>x in список</code> ищет элемент в списке.",
        "stroki",
        "Строки",
    ),
    "slice": (
        "Индексы и срезы строки",
        "<code>s[0]</code> — первый символ, <code>s[-1]</code> — последний. "
        "<code>s[a:b]</code> — символы с номерами от a до b − 1; <code>s[::-1]</code> — "
        "строка задом наперёд.",
        "stroki",
        "Строки",
    ),
    "list": (
        "Список и append",
        "Список хранит несколько значений по порядку: <code>[]</code> — пустой список, "
        "<code>divisors.append(3)</code> добавляет 3 в его конец, <code>len(divisors)</code> "
        "— сколько в нём элементов.",
        "spiski",
        "Списки",
    ),
    "agg": (
        "sum, min, max",
        "<code>sum(a)</code> — сумма элементов списка, <code>min(a)</code> и "
        "<code>max(a)</code> — наименьший и наибольший из них.",
        "vklyucheniya",
        "Включения и функции для коллекций",
    ),
    "sorted": (
        "Сортировка: sorted",
        "<code>sorted(a)</code> возвращает новый список из тех же элементов по возрастанию; "
        "<code>sorted(a, reverse=True)</code> — по убыванию.",
        "sortirovka-i-poisk",
        "Сортировка и выбор лучших элементов",
    ),
    "set": (
        "Множество",
        "Множество хранит значения без повторов: <code>set(a)</code> убирает дубликаты из "
        "списка, <code>s.add(x)</code> добавляет элемент, если его ещё нет.",
        "mnozhestva",
        "Множества и выбор структуры данных",
    ),
    "comp": (
        "Списковое включение",
        "<code>[d for d in a if d % 2 == 0]</code> собирает новый список из элементов "
        "<code>a</code>, для которых условие истинно, — короткая запись цикла с "
        "<code>append</code>.",
        "vklyucheniya",
        "Включения и функции для коллекций",
    ),
    "def": (
        "Функция: def и return",
        "<code>def имя(n):</code> описывает функцию с параметром <code>n</code>. "
        "<code>return</code> возвращает результат туда, где функцию вызвали; "
        "<code>print</code> только выводит его на экран.",
        "funktsii",
        "Функции: def, return и область видимости",
    ),
    "import": (
        "Подключение модуля: import",
        "<code>from math import isqrt</code> подключает готовую функцию из стандартной "
        "библиотеки Python; после этого её можно вызывать по имени.",
        "chasti-programmy",
        "Модули и части программы",
    ),
    "split": (
        "Разбить строку: split",
        "<code>s.split()</code> делит строку на части по пробелам, табуляциям и переводам "
        'строки и возвращает список строк: <code>"40  7 1.3".split()</code> даёт '
        "<code>['40', '7', '1.3']</code>.",
        "spiski",
        "Списки",
    ),
    "num": (
        "Целые и дробные числа: int и float",
        "<code>int</code> — целые числа, <code>float</code> — дробные: <code>2.5</code>. "
        '<code>int("40")</code> превращает строку из цифр в число, а '
        "<code>int(7.9)</code> отбрасывает дробную часть и даёт 7.",
        "chisla-i-vyrazheniya",
        "Числа и арифметические операции",
    ),
    "dict": (
        "Словарь",
        "Словарь хранит пары «ключ — значение»: <code>{}</code> — пустой словарь, "
        "<code>d[40] = 2</code> записывает значение для ключа 40, <code>d[40]</code> "
        "читает его, <code>40 in d</code> проверяет, есть ли такой ключ.",
        "slovari",
        "Словари и подсчёт частот",
    ),
    "file": (
        "Чтение файла: with open",
        '<code>with open("23.txt") as f:</code> открывает файл, а <code>for line in f:</code> '
        "по очереди даёт его строки. После блока файл закрывается сам.",
        "fayly",
        "Файлы и внешние данные",
    ),
    "intdiv": (
        "Целая часть и остаток: // и %",
        "<code>17 // 5</code> — целая часть частного, 3; <code>17 % 5</code> — остаток, 2: "
        "17 = 5 · 3 + 2. Обычное <code>17 / 5</code> даёт дробное <code>3.4</code>. "
        "<code>2 ** 5</code> — степень, 32.",
        "chisla-i-vyrazheniya",
        "Числа и арифметические операции",
    ),
    "base": (
        "Запись в другой системе: bin, oct, int(s, q)",
        "<code>bin(13)</code> даёт строку <code>'0b1101'</code>, <code>bin(13)[2:]</code> — "
        "цифры <code>'1101'</code> без префикса; <code>oct</code> — восьмеричная запись. "
        "<code>int('1101', 2)</code> читает запись с основанием 2 и даёт 13; без второго "
        "аргумента <code>int</code> читает десятичную запись.",
        "zapisi-chisel-i-shablony",
        "Записи чисел, биты и текстовые шаблоны",
    ),
    "strmeth": (
        "Методы строки: count и replace",
        "<code>s.count('1')</code> — сколько раз символ <code>'1'</code> встречается в строке. "
        "<code>s.replace('0', '2')</code> возвращает новую строку, где каждый <code>'0'</code> "
        "заменён на <code>'2'</code>; сама <code>s</code> не меняется.",
        "stroki",
        "Строки",
    ),
    "rec": (
        "Рекурсия",
        "Рекурсивная функция вызывает саму себя для более простого случая. Ей нужен "
        "базовый случай, где ответ известен сразу, иначе вызовы не закончатся.",
        "rekursiya",
        "Рекурсия и запоминание",
    ),
    # Wave 1 (Change 179): terms several topics need are added here by the orchestrator.
    "none": (
        "None: значения пока нет",
        "<code>best = None</code> отмечает, что ответа ещё нет: ни одно значение не подошло. "
        "Проверяют это как <code>best is None</code>: <code>is</code> сравнивает сам "
        "объект, а <code>None</code> в программе один.",
        "for-i-range",
        "Цикл for и диапазоны",
    ),
    "augassign": (
        "Сокращённое присваивание: += и другие",
        "<code>count += 1</code> — то же, что <code>count = count + 1</code>: взять старое "
        "значение, прибавить и записать обратно. Так же работают <code>-=</code>, "
        "<code>*=</code>, <code>//=</code> и <code>%=</code>.",
        "znacheniya-i-peremennye",
        "Значения, типы и переменные",
    ),
    # Each topic agent adds its new terms only under its own line.
    # --- topic 16 ---
    "cache": (
        "Запоминание: @cache",
        "Строка <code>@cache</code> над <code>def</code> (из <code>from functools import "
        "cache</code>) запоминает результат функции для каждого аргумента: повторный вызов "
        "с тем же аргументом сразу берёт сохранённый ответ. Это декоратор — он меняет "
        "поведение функции, не трогая её формулу.",
        "rekursiya",
        "Рекурсия и запоминание",
    ),
    "reclimit": (
        "Предел глубины рекурсии",
        "Python держит не больше примерно 1000 незавершённых вызовов, дальше — ошибка "
        "<code>RecursionError</code>. <code>import sys</code> и "
        "<code>sys.setrecursionlimit(5000)</code> поднимают предел; алгоритм от этого "
        "быстрее не становится.",
        "rekursiya",
        "Рекурсия и запоминание",
    ),
    "defarg": (
        "Значение параметра по умолчанию",
        "<code>def count_sum(bound, target, base=10):</code> — если при вызове третий "
        "аргумент не передан, <code>base</code> равно 10; "
        "<code>count_sum(500, 6, 15)</code> передаёт 15.",
        "argumenty-i-lambda",
        "Аргументы, несколько результатов и lambda",
    ),
    "fraction": (
        "Точные дроби: Fraction",
        "<code>from fractions import Fraction</code>; <code>Fraction(11, 2)</code> хранит "
        "дробь 11/2 точно — целыми числителем и знаменателем, и арифметика с ней точная. "
        "Обычное <code>11 / 2</code> даёт приближённое <code>float</code>.",
        "standartnaya-biblioteka",
        "Стандартная библиотека и перебор комбинаций",
    ),
    # --- topic 17 ---
    "listindex": (
        "Индекс элемента списка",
        "<code>a[0]</code> — первый элемент списка, <code>a[i]</code> — элемент с индексом "
        "<code>i</code>; индексы начинаются с нуля, поэтому у списка из <code>n</code> "
        "элементов последний — <code>a[n - 1]</code>, а <code>a[n]</code> даёт ошибку.",
        "spiski",
        "Списки",
    ),
    "absval": (
        "Модуль числа: abs",
        "<code>abs(x)</code> — абсолютная величина числа: <code>abs(-12)</code> и "
        "<code>abs(12)</code> равны 12, <code>abs(0)</code> — 0. Знак отбрасывается, "
        "само число <code>x</code> не меняется.",
        "chisla-i-vyrazheniya",
        "Числа и арифметические операции",
    ),
    "nested": (
        "Вложенные циклы",
        "Цикл внутри цикла: для каждого значения внешней переменной внутренний цикл "
        "проходит целиком. <code>range(i + 1, n)</code> даёт числа от <code>i + 1</code> "
        "до <code>n - 1</code>.",
        "for-i-range",
        "Цикл for и диапазоны",
    ),
    # --- topic 27 ---
    "tuple": (
        "Кортеж и распаковка",
        "<code>point = (2.0, 5.0)</code> — кортеж: несколько значений по порядку, изменить "
        "его нельзя. <code>point[0]</code> — первый элемент, а <code>x, y = point</code> "
        "раздаёт элементы двум именам сразу; так же <code>for x, y in points:</code>.",
        "kortezhi-i-raspakovka",
        "Кортежи, распаковка, enumerate и zip",
    ),
    "listops": (
        "Методы списка: copy, pop, index",
        "<code>a.copy()</code> — новый отдельный список с теми же элементами. "
        "<code>a.pop()</code> удаляет последний элемент и возвращает его. "
        "<code>a.index(v)</code> — номер первого элемента, равного <code>v</code>.",
        "spiski",
        "Списки",
    ),
    "sortkey": (
        "Ключ сортировки: key",
        "<code>sorted(clusters, key=len)</code> сравнивает элементы не сами по себе, а по "
        "значению <code>len(элемент)</code>. Ключом может быть любая функция от элемента; "
        "передают саму функцию, без скобок. Так же работают <code>min</code> и "
        "<code>max</code> с <code>key=</code>.",
        "sortirovka-i-poisk",
        "Сортировка и выбор лучших элементов",
    ),
    "genexp": (
        "Генераторное выражение",
        "<code>sum(p[0] for p in points)</code> — выражение в скобках выдаёт значения по "
        "одному прямо в <code>sum</code>, <code>min</code> или <code>max</code>, без "
        "промежуточного списка. Запись та же, что у спискового включения, но без "
        "квадратных скобок.",
        "iteratory-i-generatory",
        "Итераторы и генераторы",
    ),
    "multiret": (
        "Несколько результатов функции",
        "<code>return best, radius</code> возвращает один кортеж из двух значений; при "
        "вызове его раскладывают по именам: <code>center, radius = f(cluster)</code>.",
        "argumenty-i-lambda",
        "Аргументы, несколько результатов и lambda",
    ),
    "continue": (
        "Пропуск шага: continue",
        "<code>continue</code> сразу переходит к следующему проходу цикла: оставшиеся "
        "строки тела для текущего элемента не выполняются, а цикл продолжается.",
        "while",
        "Цикл while и состояние программы",
    ),
    "strip": (
        "Края строки: strip",
        "<code>line.strip()</code> возвращает строку без пробелов, табуляций и перевода "
        "строки по краям. Для пустой строки файла результат — пустая строка "
        '<code>""</code>, а она в условии считается ложью.',
        "stroki",
        "Строки",
    ),
    "bigo": (
        "Сложность: запись O(n²)",
        "<code>O(n²)</code> говорит, как растёт работа с ростом данных: при вдвое большем "
        "n — примерно вчетверо больше действий. Это порядок роста, а не число секунд.",
        "skorost-i-pamyat",
        "Скорость и память программы",
    ),
}

# The Excel course (Change 177): the lesson that explains each spreadsheet term the
# EGE topics 3, 9, 18 and 22 rely on (map.md, «Термины тем ЕГЭ → уроки курса").
# key: (term, Excel course lesson route slug). No topic links them yet — those topics
# are legacy; a rebuilt topic adds the popover text here as TERMS has it.
# export_course.py checks that every slug is a published lesson of the course.
EXCEL_TERMS: dict[str, tuple[str, str]] = {
    "xl-address": ("Адрес ячейки и диапазон", "list-i-yacheyka"),
    "xl-csv": ("CSV, разделитель и импорт", "vvod-i-fayly"),
    "xl-format": ("Значение и формат ячейки", "chto-v-yacheyke"),
    "xl-formula": ("Формула и порядок действий", "pervye-formuly"),
    "xl-ref": ("Относительная, абсолютная и смешанная ссылка", "kopirovanie-i-dollar"),
    "xl-fill": ("Заполнение формулой", "kopirovanie-i-dollar"),
    "xl-range-functions": ("СУММ, СЧЁТ, СРЗНАЧ, МАКС, МИН, НАИБОЛЬШИЙ", "funktsii"),
    "xl-if": ("Признак ЕСЛИ(…;1;0), И, ИЛИ, НЕ", "usloviya"),
    "xl-mod": ("ОСТАТ, ЦЕЛОЕ, ОКРУГЛ, ABS", "chisla"),
    "xl-countif": ("СЧЁТЕСЛИ, СЧЁТЕСЛИМН, СУММЕСЛИ и критерий с &", "podschet-po-usloviyu"),
    "xl-frequency": ("Частоты значений в строке", "podschet-po-usloviyu"),
    "xl-dates": ("ДАТА, период и текстовые функции", "tekst-i-daty"),
    "xl-filter": ("Сортировка, фильтр и ПРОМЕЖУТОЧНЫЕ.ИТОГИ", "sortirovka-i-filtr"),
    "xl-lookup": ("Ключ, ВПР, ИНДЕКС и ПОИСКПОЗ", "poisk-po-klyuchu"),
    "xl-neighbours": ("Накопление, соседние пары и таблица из таблицы", "raschet-po-sosedyam"),
    "xl-check": ("Ошибки Excel и проверка ответа", "ot-usloviya-k-tablitse"),
}
