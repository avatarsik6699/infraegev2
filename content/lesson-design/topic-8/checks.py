"""Independent recomputation of every task answer in topic 8.

Usage: python3 -I content/lesson-design/topic-8/checks.py

The lessons count by reasoning (products, choice of places, gaps, the value
of a record) and check with product or enumerate. Here every answer is
recomputed another way: answers found by a formula are counted by a full
search; answers found by a search over the list are found by converting
numbers to words (or words to numbers); searches over digits are replaced
by schemes of digit types or sets of positions; counts by states are
recomputed by a memoised recursion. Every expected answer must appear
verbatim in the answers of its subtopic file. Exit code 1 if any check fails.
"""

import sys
from functools import cache
from itertools import combinations, permutations, product
from math import comb, factorial
from pathlib import Path

D = Path(__file__).resolve().parent


def answers(f):
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


checks = []


def expect(f, needle):
    checks.append((f, needle, needle in answers(f)))


def same(label, a, b):
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def words(alphabet, n):
    return ("".join(p) for p in product(alphabet, repeat=n))


def count(it):
    return sum(1 for _ in it)


def no_pair(w, bad):
    return not any(bad(w[i], w[i + 1]) for i in range(len(w) - 1))


def word_of(number, alphabet, n):
    """Word with this number in the alphabetical list (conversion, no search)."""
    v, out = number - 1, ""
    for _ in range(n):
        out = alphabet[v % len(alphabet)] + out
        v //= len(alphabet)
    return out


def number_of(word, alphabet):
    v = 0
    for ch in word:
        v = v * len(alphabet) + alphabet.index(ch)
    return v + 1


# --- 1. Слова и правило умножения ---
f = "01-slova-i-umnozhenie.md"
same("1: 5⁵", count(words("АОБВГ", 5)), 3125)
same("1: 750", count(w for w in words("АОБВГ", 5) if w[0] in "АО" and w[-1] in "БВГ"), 750)
same("1: 45", count(w for w in words("АОБВГ", 3) if "А" in (w[0], w[-1])), 45)
same("1: 60", count(w for w in words("АОБВГ", 3) if len(set(w)) == 3), 60)
expect(f, f"1. {count(words('АБВГД', 4))}:")
expect(f, f"2. {count(w for w in words('АБВГД', 4) if w[0] == 'А' and w[-1] != 'А')}:")
expect(f, f"3. {count(w for w in words('АБВГДЕ', 4) if len(set(w)) == 4)}:")
expect(f, f"4. {len(set(words('КОЛОС', 3)))}:")
expect(f, f"5. {sum(count(words('АБВ', n)) for n in range(1, 4))}:")
expect(f, f"6. {count(w for w in words('АОБВГ', 4) if w[0] == 'Б' or w[-1] == 'О')}:")
expect(f, f"8. {len(set(permutations('ПЛОТ')))}:")
expect(f, f"9. {count(w for w in words('КРОНА', 5) if w[0] != 'Р' and w[-1] in 'ОА')}:")
c10 = count(w for w in words("СЛИВАТ", 6) if len(set(w)) == 6 and w[0] not in "ИА" and w[-1] != "Т")
expect(f, f"10. {c10}:")

# --- 2. Сколько раз встречается буква ---
f = "02-skolko-raz-bukva.md"
same("2: 270", count(w for w in words("АБВГ", 5) if w.count("А") == 2), 270)
same("2: 216", count(w for w in words("АБВГ", 5) if w.count("А") == 2 and w[0] != "Б"), 216)
same("2: 30", count(set(permutations("ТОПОТ"))), factorial(5) // (2 * 2))
expect(f, f"1. {count(w for w in words('АБВГД', 5) if w.count('А') == 2)}:")
expect(f, f"2. {count(w for w in words('АБВ', 5) if 'Б' in w)}:")
expect(f, f"3. {len(set(permutations('АНАНАС')))}:")
expect(f, f"4. {count(w for w in words('АБВГ', 4) if w.count('А') <= 1)}:")
expect(f, f"5. {count(w for w in words('АОБВГ', 5) if w.count('А') + w.count('О') == 3)}:")
expect(f, f"6. {count(w for w in words('АБВГД', 4) if 'А' in w and 'Д' in w)}:")
expect(f, f"8. {count(w for w in words('КОРАЛ', 6) if w.count('К') == 2 and w[0] != 'А')}:")
c9 = count(w for w in words("ПАРУС", 5) if w.count("А") + w.count("У") >= 2 and w[-1] != "С")
expect(f, f"9. {c9}:")
expect(f, f"10. {len(set(permutations('КОЛОКОЛ')))}:")

# --- 3. Соседние буквы ---
f = "03-sosednie-bukvy.md"
same("3: 324", 4 * 3**4, 324)
same("3: 810", count(w for w in words("АБВГ", 6) if w.count("А") == 2 and "АА" not in w), 810)
same(
    "3: 216",
    count(
        w
        for w in words("АБВГ", 5)
        if w.count("Б") == 1 and no_pair(w, lambda a, b: {a, b} == {"А", "Б"})
    ),
    216,
)
same("3: 12", count(p for p in permutations("АБВГ") if abs(p.index("А") - p.index("Б")) == 1), 12)
expect(f, f"1. {count(w for w in words('АБ', 5) if w.count('А') == 2 and 'АА' not in w)}:")
expect(f, f"2. {count(w for w in words('АБВ', 4) if no_pair(w, lambda a, b: a == b))}:")
expect(
    f,
    f"3. {count(w for w in words('АБВГ', 6) if w[0] == 'А' and no_pair(w, lambda a, b: a == b))}:",
)
expect(f, f"4. {count(p for p in permutations('ПЛАСТ') if abs(p.index('П') - p.index('Л')) == 1)}:")
expect(f, f"Верный ответ — {count(w for w in words('АБ', 4) if 'ББ' in w)}.")
vow = "АО"
expect(
    f,
    f"6. {count(w for w in words('АОБВГ', 6) if no_pair(w, lambda a, b: (a in vow) == (b in vow)))}:",
)
starts = sum("АБАБА".startswith("АБА", i) for i in range(5))
expect(f, f"7. `{'АБАБА'.count('АБА')}`: count")
expect(f, f"начал фрагмента {starts}")
c8 = count(p for p in permutations("КАТЕРИ") if no_pair(p, lambda a, b: a in "АЕИ" and b in "АЕИ"))
expect(f, f"8. {c8}:")
c9 = count(
    w
    for w in words("ДОМИК", 5)
    if w.count("М") == 1 and no_pair(w, lambda a, b: "М" in (a, b) and (a in "ОИ" or b in "ОИ"))
)
expect(f, f"9. {c9}:")

# --- 4. Числа в системе счисления ---
f = "04-zapis-chisla.md"


def numbers(q, n):
    return (d for d in product(range(q), repeat=n) if d[0] != 0)


same("4: 1080", count(numbers(6, 4)), 5 * 6**3)
same("4: 300", count(d for d in numbers(6, 4) if len(set(d)) == 4), 300)
same(
    "4: 15",
    count(combinations(range(6), 4)),
    count(d for d in numbers(6, 4) if d[0] > d[1] > d[2] > d[3]),
)
same(
    "4: 60",
    count(d for d in numbers(6, 4) if len(set(d)) == 4 and no_pair(d, lambda a, b: a % 2 == b % 2)),
    60,
)
same(
    "4: 201",
    count(
        d
        for d in numbers(6, 4)
        if d.count(5) == 1 and no_pair(d, lambda a, b: 5 in (a, b) and (a + b - 5) % 2 == 1)
    ),
    201,
)
same("4: 1630", sum(count(d for d in numbers(6, n) if len(set(d)) == n) for n in range(1, 7)), 1630)
expect(f, f"1. {count(numbers(5, 3))}:")
expect(f, f"2. {count(d for d in numbers(8, 3) if d.count(6) == 1)}:")
expect(f, f"3. {count(d for d in numbers(8, 4) if len(set(d)) == 4)}:")
expect(f, f"4. {count(d for d in numbers(7, 3) if d[0] < d[1] < d[2])}:")
expect(f, f"и действительно 2111₃ = {2 * 27 + 9 + 3 + 1}.")
even7 = count(d for d in numbers(7, 4) if (d[0] * 343 + d[1] * 49 + d[2] * 7 + d[3]) % 2 == 0)
expect(f, f"6. {even7}:")


def by_types(n, kinds, ok):
    """Count numbers by schemes of digit types: kinds maps a type to
    (digits on the first place, digits elsewhere)."""
    total = 0
    for scheme in product(kinds, repeat=n):
        if ok(scheme):
            ways = 1
            for i, t in enumerate(scheme):
                ways *= kinds[t][0 if i == 0 else 1]
            total += ways
    return total


def seven_ok(s):
    if s.count("7") != 2:
        return False
    return no_pair(s, lambda a, b: "7" in (a, b) and "e" in (a, b))


expect(f, f"7. {by_types(5, {'7': (1, 1), 'o': (3, 3), 'e': (3, 4)}, seven_ok)}:")
expect(
    f, f"8. {count(p for p in permutations(range(12), 4) if p[0] and sum(x > 8 for x in p) == 2)}:"
)
c9 = sum(count(p for p in permutations(range(7), n) if p[0] and p[-1] == 0) for n in range(2, 8))
expect(f, f"9. {c9}:")

# --- 5. Номер слова ---
f = "05-nomer-slova.md"
L4 = list(words("АБВ", 4))
same("5: БАВБ", L4.index("БАВБ") + 1, 35)
same("5: 50", L4[49], "БВББ")
same("5: 5", L4[4], "ААББ")
same("5: БА", [i + 1 for i, w in enumerate(L4) if w.startswith("БА")][::8], [28, 36])
mixed = [w for n in range(1, 4) for w in words("АБВ", n)]
same("5: смешанный список", mixed.index("БАВ") + 1, 24)
expect(f, f"1. {L4.index('ВАБВ') + 1}:")
expect(f, f"2. `{L4[19]}`:")
L5 = list(words("АБВГ", 5))
expect(f, f"3. {L5.index('ГАББА') + 1}:")
expect(f, f"4. `{L5[499]}`:")
expect(f, f"5. {[i + 1 for i, w in enumerate(L4) if w[0] == 'В'][0]}:")
expect(f, f"6. {list(words('КОТ', 3)).index('ТОК') + 1}:")
expect(f, f"7. {mixed.index('ВВ') + 1}:")
expect(f, f"8. {list(words('АДРУ', 5)).index('РУДАР') + 1}:")
expect(f, f"9. {list(words('КОТЫ', 5))[699]}:")
expect(f, f"10. {[i + 1 for i, w in enumerate(words('АЙМ', 6)) if w[0] == 'Й'][0]}:")

# --- 6. Поиск в нумерованном списке (conversion of numbers, no enumerate) ---
f = "06-poisk-v-spiske.md"


def numbered(alphabet, n):
    return ((k, word_of(k, alphabet, n)) for k in range(1, len(alphabet) ** n + 1))


one_a = [k for k, w in numbered("АБВ", 4) if w.count("А") == 1]
same("6: первое и последнее", (one_a[0], one_a[-1], len(one_a)), (14, 79, 32))
same("6: БВАВ", (number_of("БВАВ", "АБВ"), one_a.index(number_of("БВАВ", "АБВ")) + 1), (48, 18))
big = [
    (k, w)
    for k, w in numbered("АБВГ", 5)
    if w[0] != "А" and w.count("А") == 2 and "ББ" not in w and k % 2 == 0
]
same("6: сводная", (len(big), big[-1]), (49, (964, "ГГААГ")))
expect(f, f"1. {count(k for k, w in numbered('АБВГ', 3) if w.count('А') == 1 and k % 2 == 0)}:")
expect(f, f"2. {next(k for k, w in numbered('АБВ', 4) if 'А' not in w)}:")
expect(f, f"3. {[k for k, w in numbered('АБВ', 4) if w.count('В') == 2][-1]}:")
expect(f, f"4. {count(k for k in one_a if k % 2 == 1)}:")
kept = [w for w in words("АБВ", 4) if no_pair(w, lambda a, b: a == b)]
expect(f, f"5. {kept.index('БАБА') + 1}:")


def last_from_end(alphabet, n, ok):
    for k in range(len(alphabet) ** n, 0, -1):
        if ok(k, word_of(k, alphabet, n)):
            return k
    return None


expect(
    f,
    f"6. {last_from_end('АКОРТ', 5, lambda k, w: k % 2 == 1 and w[0] != 'А' and w.count('О') == 2)}:",
)
c7 = count(
    k
    for k in range(2, 5**6 + 1, 2)
    if word_of(k, "ЕИЛНС", 6).count("Е") >= 2 and "НН" not in word_of(k, "ЕИЛНС", 6)
)
expect(f, f"7. {c7}:")
c8 = next(
    k
    for k in range(2, 5**5 + 1, 2)
    if word_of(k, "АЕКЛМ", 5)[0] not in "АЕ" and word_of(k, "АЕКЛМ", 5).count("Л") >= 2
)
expect(f, f"8. {c8}:")

# --- 7. Когда перебор не успевает (memoised recursion and sets of positions) ---
f = "07-kogda-perebor-ne-uspevaet.md"


@cache
def no_double(n, others, last_bad):
    """Words of n more letters without two «bad» letters in a row."""
    if n == 0:
        return 1
    total = others * no_double(n - 1, others, False)
    if not last_bad:
        total += no_double(n - 1, others, True)
    return total


same("7: 819", no_double(5, 3, False), 819)
same("7: длина 20", no_double(20, 3, False), 393620574951)
same("7: 819 перебором", count(w for w in words("АБВГ", 5) if "АА" not in w), 819)


def apart(n, k):
    """Sets of k places of n, no two neighbours."""
    return [
        s
        for s in combinations(range(n), k)
        if all(b - a > 1 for a, b in zip(s, s[1:], strict=False))
    ]


def octal_odd(n, k):
    return sum(4**n if 0 in s else 3 * 4 ** (n - 1) for s in apart(n, k))


same("7: восьмеричные 5 и 12", (octal_odd(5, 2), octal_odd(12, 4)), (5376, 1820327936))
same(
    "7: 502",
    count(
        d
        for n in range(2, 10)
        for d in permutations(range(9), n)
        if list(d) == sorted(d, reverse=True)
    ),
    502,
)
same("7: 146", count(p for p in permutations(range(6), 4) if p[0] and p <= (3, 2, 0, 4)), 146)
expect(f, f"1. {count(w for w in words('АБВГ', 6) if 'АА' not in w)}:")
expect(f, f"2. {no_double(30, 2, False)}:")
inc8 = count(d for n in range(2, 8) for d in permutations(range(1, 8), n) if list(d) == sorted(d))
expect(f, f"3. {inc8}:")


@cache
def no_zeros(n, last_zero):
    if n == 0:
        return 1
    total = 2 * no_zeros(n - 1, False)
    if not last_zero:
        total += no_zeros(n - 1, True)
    return total


expect(f, f"4. {2 * no_zeros(19, False)}:")
expect(f, f"5. {count(p for p in permutations(range(6), 5) if p[0] and p <= (4, 1, 5, 3, 0))}:")
nine_even = sum((4 if 0 in s else 5) * 5**2 * 4**7 for s in apart(10, 3))
expect(f, f"6. {nine_even}:")
fifteen = comb(8, 2) * sum(comb(7, j) * 5**j * 9 ** (7 - j) for j in range(4))
expect(f, f"7. {fifteen}:")

# --- Практика и итог ---
f = "08-praktika-i-itog.md"
expect(f, f"1. {count(w for w in words('ФИЛЬМ', 6) if w[0] != 'Ь' and w.count('Ф') == 1)}:")
expect(
    f,
    f"2. {count(p for p in permutations(range(9), 5) if p[0] and no_pair(p, lambda a, b: a % 2 == b % 2))}:",
)
c3 = by_types(
    6,
    {"A": (1, 1), "s": (2, 3), "o": (7, 7)},
    lambda s: s.count("A") == 1 and s.count("s") <= 2,
)
expect(f, f"3. {c3}:")
expect(f, f"4. {word_of(444, 'АРФШ', 5)}:")
expect(
    f,
    f"5. {last_from_end('ЕЛОПТ', 6, lambda k, w: k % 2 == 0 and w[0] != 'О' and w.count('Л') == 2 and 'ЕЕ' not in w)}:",
)

bad = [c for c in checks if not c[2]]
for c in bad:
    print("FAIL", c[0], c[1])
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
