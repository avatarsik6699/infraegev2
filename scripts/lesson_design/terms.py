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
        "usloviya",
        "Условия: сравнения и выбор из двух вариантов",
    ),
    "andor": (
        "Составные условия and и or",
        "<code>a and b</code> истинно, когда верны оба условия. <code>a or b</code> — "
        "когда верно хотя бы одно, в том числе оба сразу.",
        "sostavnye-usloviya",
        "Несколько ветвей и составные условия",
    ),
    "for": (
        "Цикл for и range",
        "<code>for n in range(a, b):</code> по очереди даёт <code>n</code> значения a, "
        "a + 1, …, b − 1 и для каждого выполняет строки с отступом под ним. Правая "
        "граница b в перебор не входит, а <code>range(a, b, k)</code> идёт с шагом k.",
        "for-i-range",
        "for и range: повторяем известное число раз",
    ),
    "if": (
        "Условие if",
        "<code>if условие:</code> выполняет строки с отступом под ним, только если условие "
        "истинно. Отступ показывает, какие команды относятся к <code>if</code> или циклу.",
        "usloviya",
        "Условия: сравнения и выбор из двух вариантов",
    ),
    "while": (
        "Цикл while",
        "<code>while условие:</code> повторяет строки с отступом, пока условие истинно. "
        "Удобен, когда заранее неизвестно, сколько будет повторений.",
        "while",
        "while: повторяем, пока условие верно",
    ),
    "break": (
        "Досрочный выход: break",
        "<code>break</code> сразу завершает ближайший цикл; строки после цикла продолжают "
        "выполняться.",
        "schetchiki-i-nakopiteli",
        "Счётчики, накопители и границы цикла",
    ),
    "str": (
        "Строка, str и int",
        'Строка — символы в кавычках: <code>"1234"</code>. <code>str(1234)</code> '
        'превращает число в строку, <code>int("1234")</code> — строку из цифр в число. '
        'Строки при сложении склеиваются: <code>"12" + "34"</code> даёт '
        '<code>"1234"</code>.',
        "stroki",
        "Строки: символы, индексы и срезы",
    ),
    "len": (
        "Длина: len",
        "<code>len(s)</code> — количество символов строки или элементов списка. Для "
        "натурального n <code>len(str(n))</code> — число его цифр.",
        "stroki",
        "Строки: символы, индексы и срезы",
    ),
    "in": (
        "Проверка вхождения: in",
        '<code>"7" in s</code> даёт <code>True</code>, если подстрока <code>"7"</code> '
        "встречается в строке <code>s</code>; <code>x in список</code> ищет элемент в списке.",
        "stroki",
        "Строки: символы, индексы и срезы",
    ),
    "slice": (
        "Индексы и срезы строки",
        "<code>s[0]</code> — первый символ, <code>s[-1]</code> — последний. "
        "<code>s[a:b]</code> — символы с номерами от a до b − 1; <code>s[::-1]</code> — "
        "строка задом наперёд.",
        "stroki",
        "Строки: символы, индексы и срезы",
    ),
    "list": (
        "Список и append",
        "Список хранит несколько значений по порядку: <code>[]</code> — пустой список, "
        "<code>divisors.append(3)</code> добавляет 3 в его конец, <code>len(divisors)</code> "
        "— сколько в нём элементов.",
        "spiski",
        "Списки: храним и изменяем последовательность",
    ),
    "agg": (
        "sum, min, max",
        "<code>sum(a)</code> — сумма элементов списка, <code>min(a)</code> и "
        "<code>max(a)</code> — наименьший и наибольший из них.",
        "sortirovka-i-poisk",
        "Сортировка и поиск в коллекции",
    ),
    "sorted": (
        "Сортировка: sorted",
        "<code>sorted(a)</code> возвращает новый список из тех же элементов по возрастанию; "
        "<code>sorted(a, reverse=True)</code> — по убыванию.",
        "sortirovka-i-poisk",
        "Сортировка и поиск в коллекции",
    ),
    "set": (
        "Множество",
        "Множество хранит значения без повторов: <code>set(a)</code> убирает дубликаты из "
        "списка, <code>s.add(x)</code> добавляет элемент, если его ещё нет.",
        "mnozhestva",
        "Множества: оставляем уникальные значения",
    ),
    "comp": (
        "Списковое включение",
        "<code>[d for d in a if d % 2 == 0]</code> собирает новый список из элементов "
        "<code>a</code>, для которых условие истинно, — короткая запись цикла с "
        "<code>append</code>.",
        "vklyucheniya",
        "Включения: собираем коллекции коротко",
    ),
    "def": (
        "Функция: def и return",
        "<code>def имя(n):</code> описывает функцию с параметром <code>n</code>. "
        "<code>return</code> возвращает результат туда, где функцию вызвали; "
        "<code>print</code> только выводит его на экран.",
        "funktsii",
        "Функции: параметры и возвращаемый результат",
    ),
    "import": (
        "Подключение модуля: import",
        "<code>from math import isqrt</code> подключает готовую функцию из стандартной "
        "библиотеки Python; после этого её можно вызывать по имени.",
        "chasti-programmy",
        "Разбиваем программу на понятные части",
    ),
}
