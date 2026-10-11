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
    "rec": (
        "Рекурсия",
        "Рекурсивная функция вызывает саму себя для более простого случая. Ей нужен "
        "базовый случай, где ответ известен сразу, иначе вызовы не закончатся.",
        "rekursiya",
        "Рекурсия и запоминание",
    ),
}
