"""Independent recomputation of every task answer in topic 10.

Usage: python3 -I content/lesson-design/topic-10/checks.py

The lessons solve with the ipaddress module. Here every answer is recomputed
another way, on plain 32-bit integers: the mask is built from shifts, the
network address is ``ip & mask``, the broadcast address is ``net | ~mask``,
ones are counted with ``int.bit_count``, the possible masks come from L and C
(the last one of the network address and the first differing bit, found with
``^`` and ``bit_length``), and addresses are counted by looping over integers
(generators, no lists of addresses). Every expected answer must appear
verbatim in the answers of its file. Exit code 1 if any check fails.
"""

import sys
from pathlib import Path

D = Path(__file__).resolve().parent
FULL = 2**32 - 1


def answers(f):
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


def num(s: str) -> int:
    a, b, c, d = (int(x) for x in s.split("."))
    return ((a * 256 + b) * 256 + c) * 256 + d


def dotted(n: int) -> str:
    return ".".join(str(n >> s & 255) for s in (24, 16, 8, 0))


def mask(p: int) -> int:
    return FULL ^ (FULL >> p) if p else 0


def net(ip: str, p: int) -> int:
    return num(ip) & mask(p)


def bcast(ip: str, p: int) -> int:
    return net(ip, p) | (FULL ^ mask(p))


def prefix(m: str) -> int:
    """Length of a contiguous mask; -1 for a broken one."""
    n = num(m)
    p = 32 - (FULL ^ n).bit_length()
    return p if n == mask(p) else -1


def octet_sum(n: int) -> int:
    return sum(n >> s & 255 for s in (24, 16, 8, 0))


def lc(ip: str, network: str) -> range:
    """Prefix lengths L…C that turn ip into the network address."""
    n, a = num(network), num(ip)
    last = 32 - ((n & -n).bit_length() - 1) if n else 0
    common = 32 - (a ^ n).bit_length()
    return range(last, common + 1)


def ok_hosts(a: int, b: int, p: int) -> bool:
    """Both addresses in one network of /p and neither is an end of it."""
    m = mask(p)
    if a & m != b & m:
        return False
    ends = (a & m, a & m | (FULL ^ m))
    return p >= 31 or (a not in ends and b not in ends)


def longest_common(x: str, y: str) -> int:
    a, b = num(x), num(y)
    p = 32 - (a ^ b).bit_length()
    while not ok_hosts(a, b, p):
        p -= 1
    return p


def first_split(x: str, y: str) -> int:
    return 33 - (num(x) ^ num(y)).bit_length()


def addresses(ip: str, p: int, hosts: bool = False):
    lo, hi = net(ip, p), bcast(ip, p)
    return range(lo + 1, hi) if hosts else range(lo, hi + 1)


def count(ip: str, p: int, test, hosts: bool = False) -> int:
    return sum(1 for n in addresses(ip, p, hosts) if test(n.bit_count()))


def mask_octet(p: int, i: int) -> int:
    return mask(p) >> (24 - 8 * i) & 255


checks = []


def expect(f, needle):
    checks.append((f, needle, needle in answers(f)))


def same(label, a, b):
    checks.append(("—", f"{label}: {a} = {b}", a == b))


# --- 1. IP-адрес, биты и маска ---
f = "01-adres-i-maska.md"
expect(f, f"1. {150:08b} и {0b00101101}:")
valid = [m for m in ("255.255.128.0", "255.255.96.0", "255.128.255.0") if prefix(m) >= 0]
same("1.2 допустимые маски", valid, ["255.255.128.0"])
expect(f, f"2. Только `{valid[0]}`:")
expect(f, f"3. {dotted(mask(27))} и {32 - 27} нулей:")
expect(f, f"4. {37:08b}, {(37).bit_count()} единицы:")
expect(f, f"5. p = {prefix('255.255.254.0')}, h = {32 - prefix('255.255.254.0')}:")
third = f"{num('10.200.3.77') >> 8 & 255:08b}"
expect(f, f"6. Сетевые — `{third[:4]}`, к части узла — `{third[4:]}`:")
expect(f, f"7. {num('192.168.10.173').bit_count()} единиц:")
expect(f, f"8. X = {mask_octet(29, 3)}:")
expect(f, f"9. {len({mask_octet(p, 2) for p in range(16, 25)})} масок:")
same("1: 173 по весам", "".join(str(173 >> k & 1) for k in range(7, -1, -1)), "10101101")
same("1: int(address)", num("192.168.10.173"), 3232238253)

# --- 2. Адрес сети и границы сети ---
f = "02-adres-seti.md"
p224 = prefix("255.255.255.224")
expect(f, f"1. {dotted(net('10.8.45.200', p224))}:")
same("2.2 не адрес сети", dotted(net("172.20.77.0", 22)) != "172.20.77.0", True)
expect(f, f"2. Нет: при `/22` адрес сети {dotted(net('172.20.77.0', 22))}.")
expect(f, f"3. {dotted(bcast('192.168.5.77', 27))} и {dotted(bcast('192.168.5.77', 27) - 1)}:")
expect(f, f"4. {2 ** (32 - prefix('255.255.255.240')) - 2} адресов:")
expect(f, f"5. {dotted(net('81.200.130.9', prefix('255.255.192.0')))}:")
p240 = prefix("255.255.240.0")
expect(f, f"6. {dotted(net('46.31.250.17', p240))} и {dotted(bcast('46.31.250.17', p240))}:")
table: dict[int, str] = dict(zip((0, 3, 47, 152, 155, 211, 248, 255), "ABCDEFGH", strict=True))
n7 = net("211.47.155.3", prefix("255.255.248.0"))
expect(f, f"7. {''.join(table[n7 >> s & 255] for s in (24, 16, 8, 0))}:")
expect(f, f"8. {octet_sum(net('157.230.96.214', prefix('255.255.255.248')))}:")
expect(f, f"9. {octet_sum(bcast('64.137.205.18', prefix('255.255.252.0')) - 1)}:")
same("2: адрес сети /26", dotted(net("192.168.10.173", 26)), "192.168.10.128")
same(
    "2: края /22",
    (dotted(net("172.20.77.140", 22)), dotted(bcast("172.20.77.140", 22))),
    ("172.20.76.0", "172.20.79.255"),
)
same("2: сумма октетов", octet_sum(bcast("172.20.77.140", 22) - 1), 525)

# --- 3. Количество адресов и номер узла ---
f = "03-kolichestvo-i-nomer-uzla.md"
p248 = prefix("255.255.248.0")
expect(f, f"1. p = {p248}, {2 ** (32 - p248)} и {2 ** (32 - p248) - 2}:")
a2 = "192.168.4.207"
expect(f, f"2. {dotted(net(a2, 27))}, {dotted(bcast(a2, 27))} и {num(a2) - net(a2, 27)}:")
a3 = "10.5.142.77"
expect(
    f,
    f"3. {dotted(net(a3, 21))}, {dotted(bcast(a3, 21))}, {2**11} и {num(a3) - net(a3, 21)}:",
)
h4 = next(h for h in range(33) if 2**h - 2 >= 1000)
expect(f, f"4. `/{32 - h4}` = {dotted(mask(32 - h4))}:")
expect(f, f"5. {2 ** (26 - 24)} подсети по {2 ** (32 - 26)} адреса:")
expect(f, f"6. {dotted(net('10.40.16.0', 20) + 1000)}:")
expect(f, f"7. {2 ** (32 - 19)} адреса:")
a8 = "118.64.201.90"
expect(f, f"8. {num(a8) - net(a8, prefix('255.255.240.0'))}:")
expect(f, f"9. {2 ** (32 - prefix('255.255.255.128')) - 2}:")
same("3: номер узла", num("172.20.77.140") - net("172.20.77.140", 22), 396)
same("3: узел 650", dotted(net("172.20.77.140", 22) + 650), "172.20.78.138")
same("3: h для 500", next(h for h in range(33) if 2**h - 2 >= 500), 9)

# --- 4. Маска по адресу узла и адресу сети ---
f = "04-maska-po-adresu-seti.md"
r1 = lc("10.12.166.37", "10.12.160.0")
oct1 = [mask_octet(p, 2) for p in r1]
expect(f, f"1. {', '.join(f'`/{p}`' for p in r1)}; {min(oct1)} и {max(oct1)}:")
r2 = lc("85.112.43.200", "85.112.43.192")
expect(f, f"2. {min(mask_octet(p, 3) for p in r2)}, {len(r2)} маски:")
r3 = lc("131.70.215.9", "131.70.208.0")
expect(f, f"3. {max(r3)}:")
expect(f, f"4. {32 - max(r3)} нулей:")
expect(f, f"5. {len(lc('200.15.77.130', '200.15.77.128'))} масок:")
same("4.6 192 И 192", 192 & 192, 192)
r7 = lc("74.219.187.66", "74.219.176.0")
same("4.7 маска одна", len(r7), 1)
expect(f, f"7. {mask_octet(r7[0], 2)}:")
r8 = lc("141.97.58.197", "141.97.58.192")
expect(f, f"8. {max(r8)}:")
expect(f, f"9. {2 ** (32 - min(r8))} адреса:")
same("4: пример", list(lc("172.20.174.93", "172.20.160.0")), [19, 20])
same("4: однозначный пример", list(lc("172.20.91.37", "172.20.80.0")), [20])

# --- 5. Два узла ---
f = "05-dva-uzla.md"
c1 = longest_common("10.30.52.1", "10.30.55.250")
expect(f, f"1. `/{c1}` = {dotted(mask(c1))} и `/{c1 + 1}` = {dotted(mask(c1 + 1))}:")
c2 = longest_common("90.14.200.33", "90.14.203.140")
expect(f, f"2. {c2}:")
expect(f, f"3. {2 ** (32 - c2)} адреса:")
expect(f, f"4. {first_split('156.71.33.90', '156.71.33.120')}:")
expect(f, f"5. {longest_common('61.5.96.0', '61.5.111.7')}:")
expect(f, f"6. {mask_octet(longest_common('18.240.130.5', '18.240.141.77'), 2)}:")
expect(f, f"7. {mask_octet(first_split('205.66.157.48', '205.66.149.230'), 2)}:")
expect(f, f"8. {mask_octet(longest_common('77.180.12.9', '77.184.250.4'), 1)}:")
same("5: пример C", longest_common("172.20.74.10", "172.20.79.200"), 21)
same("5: разные сети", first_split("172.20.74.10", "172.20.79.200"), 22)
same("5: узел — адрес сети", longest_common("172.20.72.0", "172.20.79.200"), 20)

# --- 6. Адреса с условием на двоичную запись ---
f = "06-dvoichnaya-zapis-adresov.md"
expect(f, f"1. {count('192.168.1.0', 29, lambda k: k == 8)}:")
e_all = count("192.168.1.0", 29, lambda k: k % 2 == 0)
e_hosts = count("192.168.1.0", 29, lambda k: k % 2 == 0, hosts=True)
expect(f, f"2. {e_all} и {e_hosts}:")
expect(f, f"3. {count('10.0.0.0', 28, lambda k: k == 3)}:")
expect(f, f"4. {count('172.16.5.64', 26, lambda k: k % 3 == 0)}:")
expect(f, f"5. {max(n.bit_count() for n in addresses('192.168.0.0', 24, hosts=True))}:")
expect(f, f"6. {sum(1 for n in addresses('10.20.0.0', 18) if (n >> 8 & 255).bit_count() == 4)}:")
first7 = next(n for n in addresses("180.45.101.7", 19, hosts=True) if n.bit_count() % 4 == 0)
expect(f, f"7. {dotted(first7).replace('.', '')}:")
c8 = longest_common("52.118.40.17", "52.118.45.200")
expect(f, f"8. {count('52.118.40.17', c8, lambda k: k == 15)}:")
expect(f, f"9. {count('201.33.148.0', 28, lambda k: k % 3 != 0)}:")
p10 = prefix("255.252.0.0")
best10 = max(octet_sum(n) for n in addresses("115.180.0.0", p10, hosts=True) if n.bit_count() == 16)
expect(f, f"10. {best10}:")
same("6: 9 единиц в /28", count("192.168.10.0", 28, lambda k: k == 9), 6)
same("6: чётные в /28", count("192.168.10.0", 28, lambda k: k % 2 == 0), 8)
same(
    "6: узлы чётные и нечётные",
    (
        count("192.168.10.0", 28, lambda k: k % 2 == 0, hosts=True),
        count("192.168.10.0", 28, lambda k: k % 2 == 1, hosts=True),
    ),
    (8, 6),
)
same(
    "6: половины",
    sum(
        1 for n in addresses("192.168.10.0", 28) if (n >> 16).bit_count() > (n & 65535).bit_count()
    ),
    11,
)
same(
    "6: наименьший с 9 единицами",
    dotted(next(n for n in addresses("192.168.10.0", 28, hosts=True) if n.bit_count() == 9)),
    "192.168.10.3",
)
same(
    "6: наибольшая сумма",
    max(octet_sum(n) for n in addresses("192.168.10.0", 28, hosts=True) if n.bit_count() == 9),
    382,
)
same(
    "6: маска не задана, min",
    count("192.168.10.0", longest_common("192.168.10.5", "192.168.10.9"), lambda k: k == 9),
    6,
)
r = lc("192.168.10.5", "192.168.10.0")
same(
    "6: маска не задана, max",
    (min(r), max(r), max(n.bit_count() for n in addresses("192.168.10.5", min(r), hosts=True))),
    (23, 29, 15),
)


# --- 7. Маска по условию и сочетания ---
def ones_equal_zeros(ip: str) -> list[int]:
    return [p for p in range(33) if net(ip, p).bit_count() == 32 - p]


def host_number_property(ip: str) -> int:
    """Largest number of addresses whose host number has as many ones as the network."""
    best = 0
    for p in range(33):
        base = net(ip, p)
        c = base.bit_count()
        if (num(ip) - base).bit_count() != c:
            continue
        assert 32 - p <= 22, "the brute force below needs a small network"
        best = max(best, sum(1 for n in addresses(ip, p) if (n - base).bit_count() == c))
    return best


def exact_count(ip: str, k: int, target: int) -> list[int]:
    """Prefix lengths whose network has exactly target addresses with k ones.
    A shorter prefix gives a superset, so the count never decreases: stop above target."""
    found = []
    for p in range(32, -1, -1):
        got = count(ip, p, lambda x: x == k)
        if got > target:
            break
        if got == target:
            found.append(p)
    return found


f = "07-maska-po-usloviyu.md"
expect(f, f"1. {count('10.0.0.0', 27, lambda k: k == 4)}:")
c2 = count("172.16.0.0", 12, lambda k: k == 10)
expect(f, f"2. {c2 // 1000} {c2 % 1000:03d}:")
(p3,) = ones_equal_zeros("12.34.56.78")
expect(f, f"3. {count('12.34.56.78', p3, lambda k: k == 10)}:")
(p4,) = ones_equal_zeros("19.6.140.33")
expect(f, f"4. {count('19.6.140.33', p4, lambda k: k == 12)}:")
expect(f, f"5. {host_number_property('129.0.1.200')}:")
(p6,) = exact_count("10.66.129.3", 9, 56)
expect(f, f"6. {p6}:")
second = "61.200.200.61"  # a.b.b.a inside the network of 61.200.37.5
p7 = longest_common("61.200.37.5", second)
expect(f, f"7. {count('61.200.37.5', p7, lambda k: k == 12)}:")
same(
    "7: пример /23",
    (ones_equal_zeros("25.140.77.201"), count("25.140.77.201", 23, lambda k: k == 12)),
    ([23], 84),
)
same("7: пример номера узла", host_number_property("129.0.5.96"), 120)
same("7: ровно 120", exact_count("77.1.130.9", 9, 120), [22])
same("7: /8 и 20 единиц", count("10.0.0.0", 8, lambda k: k == 20), 134596)

# --- 8. Практика и итог ---
f = "08-praktika-i-itog.md"
expect(f, f"1. {octet_sum(net('93.180.214.77', prefix('255.255.255.192')))}:")
expect(f, f"2. {min(lc('140.33.118.46', '140.33.112.0'))}:")
expect(f, f"3. {mask_octet(longest_common('66.12.250.3', '66.12.236.190'), 2)}:")
expect(f, f"4. {count('150.8.64.0', prefix('255.255.255.224'), lambda k: k % 5 == 0)}:")
expect(f, f"5. {dotted(bcast('31.87.140.250', prefix('255.255.248.0')) - 1).replace('.', '')}:")

bad = [c for c in checks if not c[2]]
for where, what, _ in bad:
    print(f"FAIL {where}: {what}")
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
