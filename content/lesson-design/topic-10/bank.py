"""Topic 10 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-10/bank.py          # check only
    python3 -I content/lesson-design/topic-10/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. The programs use
the lesson's standard module ``ipaddress``: ``ip_network(…, strict=False)`` for
the network of a node, all 33 prefix lengths when the mask is unknown, the
addresses of a network for the conditions on the binary record, and the
count of positions ``comb`` of subtopic 7 for a large network.
``apps/api/tests/test_task_10_bank.py`` recomputes every answer independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, THREE, TWO, main  # noqa: E402

IP = "Введите IP-адрес с точками, например 10.0.0.1."
NO_DOTS = "Введите адрес без точек."
NET = "from ipaddress import ip_address, ip_network\n\n"
ONES = """def ones(address):
    return bin(int(address)).count('1')


"""


def network(node: str, mask: str) -> str:
    return f"net = ip_network('{node}/{mask}', strict=False)\n"


def prefixes(node: str, net: str) -> str:
    """The prefix lengths under which the node lies in the given network."""
    return (
        NET + f"ps = [p for p in range(33)\n"
        f"      if ip_network(f'{node}/{{p}}', strict=False)\n"
        f"      .network_address == ip_address('{net}')]\n"
    )


def pair(a: str, b: str) -> str:
    """The prefix lengths under which two nodes share a network."""
    return (
        NET
        + "def net(node, p):\n"
        + "    return ip_network(f'{node}/{p}', strict=False)\n\n\n"
        + "def ordinary(node, p):\n"
        + "    n = net(node, p)\n"
        + "    address = ip_address(node)\n"
        + "    return address not in (n.network_address,\n"
        + "                           n.broadcast_address)\n\n\n"
        + f"a, b = '{a}', '{b}'\n"
        + "same = [p for p in range(33) if net(a, p) == net(b, p)]\n"
    )


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


# (page, number in the page) -> task definition; page 8 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    task(
        (1, 1),
        "32-bita",
        "Октет в двоичной записи и обратно",
        "print(f'{150:08b}', int('00101101', 2))",
        "Октет записывают ровно восемью битами.",
        instruction="Введите двоичную запись и число через пробел.",
    ),
    task(
        (1, 3),
        "maska-po-prefiksu",
        "Маска /27",
        NET + "net = ip_network('0.0.0.0/27')\nprint(net.netmask, 32 - 27)",
        "Полные октеты — 255, остаток единиц — в одном октете.",
        instruction="Введите маску с точками и число нулей через пробел.",
    ),
    task(
        (1, 4),
        "vosem-bitov",
        "Октет 37",
        "bits = f'{37:08b}'\nprint(bits, bits.count('1'))",
        "37 = 32 + 4 + 1.",
        instruction="Введите восемь битов и число единиц через пробел.",
    ),
    task(
        (1, 5),
        "oktety-maski",
        "Длина префикса маски",
        NET + "p = ip_network('0.0.0.0/255.255.254.0').prefixlen\nprint(p, 32 - p)",
        "254 = 11111110.",
        instruction=TWO,
    ),
    task(
        (1, 7),
        "obratnoe-preobrazovanie",
        "Единицы адреса 192.168.10.173",
        "octets = '192.168.10.173'.split('.')\n"
        "bits = ''.join(f'{int(x):08b}' for x in octets)\n"
        "print(bits.count('1'))",
        "Сложите единицы всех четырёх октетов.",
    ),
    task(
        (1, 8),
        "oktety-maski",
        "Маска с 29 единицами",
        NET + "print(ip_network('0.0.0.0/29').netmask.packed[3])",
        "В последнем октете 29 − 24 = 5 единиц.",
    ),
    task(
        (1, 9),
        "oktety-maski",
        "Маски вида 255.255.X.0",
        "print(sum(1 for x in range(256) if '01' not in f'{x:08b}'))",
        "В октете маски после нуля не может стоять единица.",
    ),
    # ------------------------------------------------------------ subtopic 2
    task(
        (2, 1),
        "razmer-bloka",
        "Адрес сети через размер блока",
        NET + network("10.8.45.200", "255.255.255.224") + "print(net.network_address)",
        "d = 256 − 224 = 32.",
        instruction=IP,
    ),
    task(
        (2, 3),
        "shirokoveshchatelnyj",
        "Последний адрес и последний узел",
        NET
        + network("192.168.5.77", "27")
        + "print(net.broadcast_address, net.broadcast_address - 1)",
        "Последний адрес сети — широковещательный, узлу он не назначается.",
        instruction="Введите два IP-адреса через пробел.",
    ),
    task(
        (2, 4),
        "shirokoveshchatelnyj",
        "Адреса для компьютеров",
        NET + "print(ip_network('0.0.0.0/255.255.255.240').num_addresses - 2)",
        "Адрес сети и широковещательный не назначают.",
    ),
    task(
        (2, 5),
        "tretij-oktet",
        "Граница в третьем октете",
        NET + network("81.200.130.9", "255.255.192.0") + "print(net.network_address)",
        "d = 64, 130 лежит в блоке 128–191.",
        instruction=IP,
    ),
    task(
        (2, 6),
        "tretij-oktet",
        "Адрес сети и широковещательный",
        NET
        + network("46.31.250.17", "255.255.240.0")
        + "print(net.network_address, net.broadcast_address)",
        "d = 16.",
        instruction="Введите два IP-адреса через пробел.",
    ),
    task(
        (2, 7),
        "forma-otveta",
        "Ответ буквами",
        NET
        + network("211.47.155.3", "255.255.248.0")
        + """table = {0: 'A', 3: 'B', 47: 'C', 152: 'D', 155: 'E',
         211: 'F', 248: 'G', 255: 'H'}
print(''.join(table[x] for x in net.network_address.packed))""",
        "Сначала адрес сети, потом буквы по таблице.",
        instruction="Введите четыре буквы без точек.",
    ),
    task(
        (2, 8),
        "forma-otveta",
        "Сумма октетов адреса сети",
        NET
        + network("157.230.96.214", "255.255.255.248")
        + "print(sum(net.network_address.packed))",
        "d = 8.",
    ),
    task(
        (2, 9),
        "forma-otveta",
        "Наибольший адрес компьютера",
        NET
        + network("64.137.205.18", "255.255.252.0")
        + "print(sum((net.broadcast_address - 1).packed))",
        "На единицу меньше широковещательного.",
    ),
    # ------------------------------------------------------------ subtopic 3
    task(
        (3, 1),
        "svobodnye-bity",
        "Префикс и количество адресов",
        NET
        + "net = ip_network('0.0.0.0/255.255.248.0')\n"
        + "print(net.prefixlen, net.num_addresses, net.num_addresses - 2)",
        "Количество адресов — 2 в степени числа свободных битов.",
        instruction=THREE,
    ),
    task(
        (3, 2),
        "nomer-uzla",
        "Сеть, последний адрес и номер узла",
        NET
        + network("192.168.4.207", "27")
        + "node = ip_address('192.168.4.207')\n"
        + "number = int(node) - int(net.network_address)\n"
        + "print(net.network_address, net.broadcast_address, number)",
        "Номер узла — его расстояние от адреса сети.",
        instruction="Введите два IP-адреса и число через пробел.",
        minutes=3,
    ),
    task(
        (3, 3),
        "neskolko-oktetov",
        "Номер узла в нескольких октетах",
        NET
        + network("10.5.142.77", "21")
        + "node = ip_address('10.5.142.77')\n"
        + "number = int(node) - int(net.network_address)\n"
        + "print(net.network_address, net.broadcast_address,\n"
        + "      net.num_addresses, number)",
        "Часть узла занимает больше одного октета.",
        instruction="Введите два IP-адреса и два числа через пробел.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (3, 4),
        "maska-pod-kolichestvo",
        "Сеть на 1000 компьютеров",
        NET
        + "h = 1\nwhile 2 ** h - 2 < 1000:\n    h += 1\n"
        + "p = 32 - h\nprint(p, ip_network(f'0.0.0.0/{p}').netmask)",
        "Наименьшее h, при котором 2ʰ − 2 не меньше 1000.",
        instruction="Введите длину префикса и маску с точками через пробел.",
        minutes=3,
    ),
    task(
        (3, 5),
        "podseti",
        "Подсети /26 в сети /24",
        "print(2 ** (26 - 24), 2 ** (32 - 26))",
        "Перенос границы на два бита.",
        instruction=TWO,
    ),
    task(
        (3, 6),
        "adres-po-nomeru",
        "Узел с номером 1000",
        NET + "print(ip_network('10.40.16.0/20')[1000])",
        "1000 = 3 · 256 + 232.",
        instruction=IP,
    ),
    task(
        (3, 7),
        "svobodnye-bity",
        "Адреса сети /19",
        NET + "print(ip_network('0.0.0.0/19').num_addresses)",
        "Свободных битов 13.",
    ),
    task(
        (3, 8),
        "nomer-uzla",
        "Порядковый номер компьютера",
        NET
        + network("118.64.201.90", "255.255.240.0")
        + "node = ip_address('118.64.201.90')\n"
        + "print(int(node) - int(net.network_address))",
        "Номер — расстояние от адреса сети.",
    ),
    task(
        (3, 9),
        "svobodnye-bity",
        "Адреса компьютеров при маске /25",
        NET + "print(ip_network('0.0.0.0/255.255.255.128').num_addresses - 2)",
        "Два специальных адреса не используют.",
    ),
    # ------------------------------------------------------------ subtopic 4
    task(
        (4, 2),
        "perebor-dlin",
        "Наименьший последний байт маски",
        prefixes("85.112.43.200", "85.112.43.192")
        + "last = [ip_network(f'0.0.0.0/{p}').netmask.packed[3]\n"
        + "        for p in ps]\n"
        + "print(min(last), len(ps))",
        "Подходят все длины от L до C.",
        instruction=TWO,
        minutes=3,
    ),
    task(
        (4, 3),
        "neravenstvo",
        "Наибольшее число единиц маски",
        prefixes("131.70.215.9", "131.70.208.0") + "print(max(ps))",
        "C — последняя позиция, где можно оставить сетевой бит.",
    ),
    task(
        (4, 4),
        "neravenstvo",
        "Наименьшее число нулей маски",
        prefixes("131.70.215.9", "131.70.208.0") + "print(32 - max(ps))",
        "Самая длинная маска.",
    ),
    task(
        (4, 5),
        "neravenstvo",
        "Сколько масок возможно",
        prefixes("200.15.77.130", "200.15.77.128") + "print(len(ps))",
        "Длины от L до C.",
    ),
    task(
        (4, 7),
        "polnaya-programma",
        "Третий байт маски",
        prefixes("74.219.187.66", "74.219.176.0")
        + "print(ip_network(f'0.0.0.0/{ps[0]}').netmask.packed[2])",
        "Маска здесь одна.",
    ),
    task(
        (4, 8),
        "neravenstvo",
        "Наибольшее число единиц",
        prefixes("141.97.58.197", "141.97.58.192") + "print(max(ps))",
        "C — до первой единицы адреса, обнулённой в адресе сети.",
    ),
    task(
        (4, 9),
        "neravenstvo",
        "Наибольшее количество адресов",
        prefixes("141.97.58.197", "141.97.58.192") + "print(2 ** (32 - min(ps)))",
        "Самая короткая маска.",
    ),
    # ------------------------------------------------------------ subtopic 5
    task(
        (5, 1),
        "pervoe-razlichie",
        "Самая длинная общая и самая короткая разная",
        pair("10.30.52.1", "10.30.55.250") + "print(max(same), max(same) + 1)",
        "Граница маски не должна заходить дальше совпадающих битов.",
        instruction=TWO,
        minutes=3,
    ),
    task(
        (5, 2),
        "samaya-dlinnaya",
        "Наибольшее число единиц маски для двух узлов",
        pair("90.14.200.33", "90.14.203.140")
        + "print(max(p for p in same\n          if ordinary(a, p) and ordinary(b, p)))",
        "Узел не может быть адресом сети или широковещательным.",
        minutes=3,
    ),
    task(
        (5, 3),
        "setevye-chasti",
        "Наименьшее количество адресов общей сети",
        pair("90.14.200.33", "90.14.203.140")
        + "p = max(p for p in same if ordinary(a, p) and ordinary(b, p))\n"
        + "print(2 ** (32 - p))",
        "Самая длинная общая маска.",
        minutes=3,
    ),
    task(
        (5, 4),
        "pervoe-razlichie",
        "Разные сети: наименьшее число единиц",
        pair("156.71.33.90", "156.71.33.120") + "print(max(same) + 1)",
        "Разные сети — граница дальше первого различия.",
        minutes=3,
    ),
    task(
        (5, 5),
        "samaya-dlinnaya",
        "Узел на краю сети",
        pair("61.5.96.0", "61.5.111.7")
        + "print(max(p for p in same\n          if ordinary(a, p) and ordinary(b, p)))",
        "Адрес 61.5.96.0 при длинной маске становится адресом сети.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (5, 6),
        "programma-dvuh-setej",
        "Третий байт маски общей сети",
        pair("18.240.130.5", "18.240.141.77")
        + "p = max(p for p in same if ordinary(a, p) and ordinary(b, p))\n"
        + "print(ip_network(f'0.0.0.0/{p}').netmask.packed[2])",
        "Самая длинная общая маска.",
        minutes=3,
    ),
    task(
        (5, 7),
        "programma-dvuh-setej",
        "Третий байт маски разных сетей",
        pair("205.66.157.48", "205.66.149.230")
        + "p = max(same) + 1\n"
        + "print(ip_network(f'0.0.0.0/{p}').netmask.packed[2])",
        "Самая короткая маска, при которой сети разные.",
        minutes=3,
    ),
    task(
        (5, 8),
        "programma-dvuh-setej",
        "Второй байт маски",
        pair("77.180.12.9", "77.184.250.4")
        + "p = max(p for p in same if ordinary(a, p) and ordinary(b, p))\n"
        + "print(ip_network(f'0.0.0.0/{p}').netmask.packed[1])",
        "Первое различие — во втором байте.",
        minutes=3,
    ),
    # ------------------------------------------------------------ subtopic 6
    task(
        (6, 1),
        "chislo-edinic",
        "Ровно восемь единиц в /29",
        NET
        + ONES
        + "net = ip_network('192.168.1.0/29')\n"
        + "print(sum(1 for x in net if ones(x) == 8))",
        "Фиксированные единицы плюс единицы свободной части.",
        minutes=3,
    ),
    task(
        (6, 2),
        "specialnye-adresa",
        "Чётное число единиц",
        NET
        + ONES
        + """net = ip_network('192.168.1.0/29')
even = [x for x in net if ones(x) % 2 == 0]
hosts = [x for x in even if x not in (net.network_address,
                                      net.broadcast_address)]
print(len(even), len(hosts))""",
        "Проверьте каждый специальный адрес по условию.",
        instruction=TWO,
        minutes=3,
    ),
    task(
        (6, 3),
        "chislo-edinic",
        "Три единицы в /28",
        NET + ONES + "print(sum(1 for x in ip_network('10.0.0.0/28') if ones(x) == 3))",
        "У 10 две единицы.",
    ),
    task(
        (6, 4),
        "chislo-edinic",
        "Количество единиц кратно 3",
        NET
        + ONES
        + "print(sum(1 for x in ip_network('172.16.5.64/26')\n          if ones(x) % 3 == 0))",
        "Фиксированная часть даёт 8 единиц.",
        minutes=3,
    ),
    task(
        (6, 5),
        "dlya-vseh",
        "Наибольшее число единиц у компьютера",
        NET
        + ONES
        + "net = ip_network('192.168.0.0/24')\n"
        + "print(max(ones(x) for x in net.hosts()))",
        "Широковещательный адрес назначать нельзя.",
    ),
    task(
        (6, 6),
        "chast-adresa",
        "Третий байт: нулей столько же, сколько единиц",
        NET
        + """count = 0
for x in ip_network('10.20.0.0/18'):
    third = f'{x.packed[2]:08b}'
    if third.count('1') == third.count('0'):
        count += 1
print(count)""",
        "Условие проверяют на части записи.",
        minutes=3,
    ),
    task(
        (6, 7),
        "naimenshij-adres",
        "Наименьший адрес с кратным 4 числом единиц",
        NET
        + ONES
        + network("180.45.101.7", "255.255.224.0")
        + """for x in net.hosts():
    if ones(x) % 4 == 0:
        print(str(x).replace('.', ''))
        break""",
        "Перебор по порядку с остановкой.",
        instruction=NO_DOTS,
        minutes=4,
        difficulty=2,
    ),
    task(
        (6, 8),
        "krajnyaya-maska",
        "Наименьшее количество адресов с 15 единицами",
        pair("52.118.40.17", "52.118.45.200")
        + ONES
        + """p = max(p for p in same if ordinary(a, p) and ordinary(b, p))
print(sum(1 for x in net(a, p) if ones(x) == 15))""",
        "Сначала самая маленькая общая сеть.",
        minutes=5,
        difficulty=2,
    ),
    task(
        (6, 9),
        "chislo-edinic",
        "Число единиц не кратно 3",
        NET
        + ONES
        + "print(sum(1 for x in ip_network('201.33.148.0/28')\n          if ones(x) % 3 != 0))",
        "Из 16 адресов посчитайте неподходящие.",
    ),
    task(
        (6, 10),
        "naibolshee-znachenie",
        "Наибольшая сумма октетов",
        NET
        + ONES
        + """best = 0
for x in ip_network('115.180.0.0/14').hosts():
    if ones(x) == 16:
        best = max(best, sum(x.packed))
print(best)""",
        "Единиц и нулей поровну — по 16.",
        minutes=5,
        difficulty=2,
    ),
    # ------------------------------------------------------------ subtopic 7
    task(
        (7, 1),
        "vybor-pozicij",
        "Четыре единицы в /27",
        "from math import comb\n\nprint(comb(5, 4 - 2))",
        "c = 2, h = 5: выбор позиций единиц.",
    ),
    task(
        (7, 2),
        "formula",
        "Десять единиц в /12",
        NET
        + ONES
        + """from math import comb

net = ip_network('172.16.0.0/12')
c = ones(net.network_address)
h = 32 - net.prefixlen
print(comb(h, 10 - c))""",
        "Перебор миллиона адресов заменяет формула.",
        minutes=3,
        says=["15 504"],
    ),
    task(
        (7, 3),
        "maska-po-usloviyu",
        "Маска по условию на единицы",
        NET
        + ONES
        + """from math import comb

for p in range(33):
    net = ip_network(f'12.34.56.78/{p}', strict=False)
    c = ones(net.network_address)
    if c == 32 - p:
        print(comb(32 - p, 10 - c))""",
        "Условие проверяют для каждой из 33 длин.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (7, 4),
        "maska-po-usloviyu",
        "То же условие для другого узла",
        NET
        + ONES
        + """from math import comb

for p in range(33):
    net = ip_network(f'19.6.140.33/{p}', strict=False)
    c = ones(net.network_address)
    if c == 32 - p:
        print(comb(32 - p, 12 - c))""",
        "Условие проверяют для каждой из 33 длин.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (7, 5),
        "nomer-uzla-uslovie",
        "Условие на номер узла",
        NET
        + ONES
        + """from math import comb

node = ip_address('129.0.1.200')
best = 0
for p in range(33):
    net = ip_network(f'{node}/{p}', strict=False)
    c = ones(net.network_address)
    if ones(int(node) - int(net.network_address)) == c:
        best = max(best, comb(32 - p, c))
print(best)""",
        "Номер узла — его расстояние от адреса сети.",
        minutes=5,
        difficulty=3,
    ),
    task(
        (7, 6),
        "rovno-stolko",
        "Ровно 56 адресов с девятью единицами",
        NET
        + ONES
        + """from math import comb

for p in range(33):
    net = ip_network(f'10.66.129.3/{p}', strict=False)
    c = ones(net.network_address)
    if 9 >= c and comb(32 - p, 9 - c) == 56:
        print(p)""",
        "Проверьте каждую длину префикса.",
        minutes=4,
        difficulty=2,
    ),
    task(
        (7, 7),
        "vtoroj-uzel",
        "Второй узел по описанию",
        pair("61.200.37.5", "61.200.200.61")
        + ONES
        + """from math import comb

p = max(p for p in same if ordinary(a, p) and ordinary(b, p))
c = ones(net(a, p).network_address)
print(comb(32 - p, 12 - c))""",
        "Второй узел: первый байт как четвёртый, второй как третий.",
        minutes=5,
        difficulty=3,
    ),
    # ---------------------------------------------------- Практика и итог
    task(
        (8, 1),
        None,
        "Сумма октетов адреса сети",
        NET
        + network("93.180.214.77", "255.255.255.192")
        + "print(sum(net.network_address.packed))",
        "77 И 192.",
    ),
    task(
        (8, 2),
        None,
        "Наименьшее число единиц маски",
        prefixes("140.33.118.46", "140.33.112.0") + "print(min(ps))",
        "L ≤ p ≤ C.",
    ),
    task(
        (8, 3),
        None,
        "Третий байт маски общей сети",
        pair("66.12.250.3", "66.12.236.190")
        + "p = max(p for p in same if ordinary(a, p) and ordinary(b, p))\n"
        + "print(ip_network(f'0.0.0.0/{p}').netmask.packed[2])",
        "Совпадающие биты третьего октета.",
        minutes=3,
    ),
    task(
        (8, 4),
        None,
        "Число единиц кратно 5",
        NET
        + ONES
        + "print(sum(1 for x in ip_network('150.8.64.0/27')\n          if ones(x) % 5 == 0))",
        "Фиксированная часть даёт 6 единиц.",
        minutes=3,
    ),
    task(
        (8, 5),
        None,
        "Наибольший адрес компьютера без точек",
        NET
        + network("31.87.140.250", "255.255.248.0")
        + "print(str(net.broadcast_address - 1).replace('.', ''))",
        "На единицу меньше широковещательного.",
        instruction=NO_DOTS,
        minutes=3,
    ),
]

if __name__ == "__main__":
    sys.exit(main(HERE, 10, TASKS))
