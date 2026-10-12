"""Independent recomputation of every task answer in topic 11.

Usage: python3 -I content/lesson-design/topic-11/checks.py

The lessons find the code length with a loop over powers of two, round up
with ``ceil`` and solve bounds by dividing. Here every answer is recomputed in
a different way: the code length from the length of a binary record, whole
bytes by remainder, largest and smallest integers by a binary search over a
monotone condition (never by dividing), and the worked examples of the text
by direct search over lengths and alphabets. Every expected answer must appear
verbatim in the answers of its file. Exit code 1 if any check fails.
"""

import sys
from pathlib import Path

D = Path(__file__).resolve().parent
KB, MB, GB = 2**10, 2**20, 2**30  # in bytes


def answers(f):
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


def code_len(n):
    """Smallest i with 2**i >= n: the length of the binary record of n − 1."""
    return len(format(n - 1, "b")) if n > 1 else 0


def number_len(m):
    """Bits of m written as a binary number."""
    return len(format(m, "b"))


def whole(bits):
    """Whole bytes for bits: full bytes plus one for a non-empty remainder."""
    return bits // 8 + (1 if bits % 8 else 0)


def code_bytes(alphabet, length):
    return whole(length * code_len(alphabet))


def largest(ok, lo=0):
    """Largest n >= lo with ok(n) for a condition true up to some point."""
    hi = lo + 1
    while ok(hi):
        hi = lo + 2 * (hi - lo)
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if ok(mid):
            lo = mid
        else:
            hi = mid
    return lo


def smallest(ok, lo=1):
    """Smallest n >= lo with ok(n) for a condition false up to some point."""
    return largest(lambda n: not ok(n), lo - 1) + 1


def ru(n):
    """12 345 — the way numbers are written in the answers."""
    return f"{n:,}".replace(",", " ") if n >= 10000 else str(n)


checks = []


def expect(f, needle):
    checks.append((f, needle, needle in answers(f)))


def same(label, a, b):
    checks.append(("—", f"{label}: {a} = {b}", a == b))


# --- 1. Пароль: от символов к байтам ---
f = "01-parol-v-bajtah.md"
expect(f, f"1. {code_len(17)}, {code_len(32)} и {code_len(33)} битов:")
expect(f, f"2. {code_bytes(26 + 10, 9)} байтов:")
expect(f, f"3. {200 * code_bytes(9, 13)} байтов:")
expect(f, f"4. {40 * code_bytes(26 + 26 + 10 + 4, 12)} байтов:")
expect(f, f"5. {sum(1 for _ in range(4**6))} паролей и {6 * code_len(4)} бит:")
expect(f, f"6. {1024 * whole(40 * code_len(150)) // KB} Кбайт:")
expect(f, f"7. {15 * code_bytes(6, 11)} и {whole(15 * 11 * code_len(6))} байта:")
expect(f, f"8. {524288 * code_bytes(16 + 2000, 180) // MB} Мбайт:")
total9 = 12000 * code_bytes(10 + 26 + 1200, 95)
expect(f, f"9. {smallest(lambda k: k * KB >= total9)} Кбайт:")
same("1: пароль 7 из 20", (code_len(20), 7 * code_len(20), code_bytes(20, 7)), (5, 35, 5))
same("1: 8 паролей", (8 * code_bytes(20, 7), whole(8 * 35)), (40, 35))
same("1: 69 символов", code_len(26 + 26 + 10 + 7), 7)
same("1: 300 типов", whole(25 * code_len(300)), 29)
total = 20000 * code_bytes(10 + 3000, 150)
same("1: идентификаторы", (total, smallest(lambda k: k * KB >= total)), (4500000, 4395))


# --- 2. Записи ---
f = "02-zapisi.md"


def extra(alphabet, length, volume, users):
    """D from the total: the only D with users · (B + D) = volume."""
    b = code_bytes(alphabet, length)
    return next(d for d in range(volume) if users * (b + d) == volume)


expect(f, f"1. {64 * (code_bytes(26, 10) + 20)} байтов:")
expect(f, f"2. {128 * (code_bytes(12, 15) + 9)} байтов:")
expect(f, f"3. {extra(40, 13, 6 * KB, 256)} байтов:")
expect(f, f"4. {extra(30, 14, 1080, 30)} байтов:")
expect(f, f"5. {64 + 200 * (code_bytes(12, 8) + 12)} байта:")
expect(f, f"6. {12 * 8 - 9 * code_len(9)} битов:")
expect(f, f"7. {whole(11 * code_len(5) + 25)} и {code_bytes(5, 11) + whole(25)} байтов:")
expect(f, f"8. {extra(52 + 10 + 4, 60, 300 * KB, 4096)} байта:")
expect(f, f"9. {ru(500 * (code_bytes(26 + 10 + 2, 25) + 30))} байтов:")
same("2: пример", 128 * (code_bytes(20, 7) + 11), 2 * KB)
same("2: сведения в битах", 900 // 50 * 8 - 9 * code_len(11), 108)
same("2: 35 + 13", (whole(48), whole(35) + whole(13)), (6, 7))


# --- 3. Обратные задачи: «не более» ---
f = "03-ne-bolee.md"


def lengths(alphabet, nbytes):
    return [n for n in range(1, 200) if code_bytes(alphabet, n) == nbytes]


def alphabets(length, nbytes):
    found = [a for a in range(2, 5000) if code_bytes(a, length) == nbytes]
    return found[0], found[-1]


def max_alphabet(length, n, memory):
    return largest(lambda a: n * code_bytes(a, length) <= memory, 1)


l1 = lengths(40, 9)
expect(f, f"1. {l1[0]} и {l1[-1]}:")
a2 = alphabets(12, 9)
expect(f, f"2. {a2[0]} и {a2[1]}:")
a3 = alphabets(4, 3)
bits3 = sorted({code_len(a) for a in range(a3[0], a3[1] + 1)})
expect(f, f"3. {bits3[0]} или {bits3[-1]} битов, мощность от {a3[0]} до {a3[1]}:")
expect(f, f"4. {largest(lambda n: 100 * (code_bytes(33, n) + 3) <= 2 * KB)} символа:")
expect(f, f"5. {max_alphabet(15, 40, 480)}:")
expect(f, f"6. {max_alphabet(24, 1000, 30 * KB) - 36}:")
expect(f, f"7. {ru(largest(lambda n: n * (code_bytes(40, 16) + 19) <= 3 * MB))}:")
expect(f, f"8. {max_alphabet(310, 700000, 200 * MB)}:")
expect(f, f"9. {largest(lambda n: 3000 * code_bytes(10 + 52 + 700, n) <= 500 * KB)}:")
same("3: длины 7 байтов", lengths(20, 7), [10, 11])
same("3: алфавиты 10 символов", alphabets(10, 7), (17, 32))
same("3: 3 символа в 2 байтах", alphabets(3, 2), (5, 32))
same("3: наибольшая длина", largest(lambda n: 250 * (code_bytes(52, n) + 7) <= 8 * KB), 33)
same("3: наибольший алфавит", max_alphabet(10, 100, 700), 32)
same("3: 14 паролей", largest(lambda n: n * code_bytes(20, 11) <= 100), 14)
same("3: 256 символов", max_alphabet(200, 300000, 64 * MB), 256)
same(
    "3: 4 Гбайт",
    largest(lambda n: n * code_bytes(10 + 26 + 50000, 240) <= 4 * GB),
    8947848,
)


# --- 4. Нижняя граница ---
f = "04-bolee-i-ne-menee.md"


def min_length(alphabet, n, ok):
    return smallest(lambda length: ok(n * code_bytes(alphabet, length)))


def min_alphabet(length, n, ok):
    return smallest(lambda a: ok(n * code_bytes(a, length)), 2)


expect(
    f,
    f"1. {smallest(lambda r: 40 * r >= 1000)} и {smallest(lambda r: 40 * r > 1000)} байтов:",
)
expect(
    f,
    f"2. а) {min_length(17, 100, lambda v: v >= 1000)} символов; "
    f"б) {min_length(17, 100, lambda v: v > 1000)} символов.",
)
expect(f, f"3. {min_length(30, 50, lambda v: v > 450)} символов:")
expect(f, f"4. {min_alphabet(13, 200, lambda v: v >= 2001)} символов:")
expect(f, f"5. {min_alphabet(20, 400, lambda v: v >= 6800) - 36} символов:")
messages = 3 * code_bytes(100, 40) + 5 * code_bytes(100, 25)
expect(f, f"6. {smallest(lambda h: messages + 8 * h > 300)} байтов:")
expect(f, f"7. {min_length(10 + 26 + 5000, 200000, lambda v: v > 30 * MB)} символов:")
expect(f, f"8. {min_alphabet(40, 2000000, lambda v: v >= 95 * MB)} символов:")
same("4: длина при 601", min_length(20, 100, lambda v: v >= 601), 10)
same("4: алфавит при 601", min_alphabet(10, 100, lambda v: v >= 601), 17)
same("4: спецзнаков", smallest(lambda k: code_len(62 + k) >= 7, 0), 3)
sent = 4 * code_bytes(40, 20) + 6 * code_bytes(40, 30)
same("4: заголовок", (sent, smallest(lambda h: sent + 10 * h > 320)), (198, 13))
same("4: 20 Мбайт", min_length(10 + 26 + 900, 150000, lambda v: v > 20 * MB), 112)


# --- 5. Составные коды ---
f = "05-sostavnye-kody.md"
expect(f, f"1. {number_len(256)} и {code_len(256)} битов:")
expect(f, f"2. а) {whole(5 * 5 + 3 * 4)} байтов; б) {whole(5 * 5) + whole(3 * 4)} байтов.")
expect(f, f"3. {whole(6 * code_len(26) + 4 * code_len(9))} и {code_bytes(26 + 9, 10)} байтов:")
code4 = 13 * code_len(12 + 10)
expect(f, f"4. {32 - whole(code4) - whole(number_len(100))} байта:")
expect(f, f"5. {32 - whole(code4 + number_len(100))} байта:")
expect(f, f"6. {code_bytes(26, 10) + whole(number_len(63) + number_len(366))} байтов:")
block = whole(5 * code_len(36) + code_len(1000))
expect(f, f"7. {4096 * 30 * block // KB} Кбайт:")
expect(f, f"8. {2368 // 64 - whole(8 * code_len(26) + number_len(5000))} байтов:")
per_object = 2 * MB // 16384
expect(f, f"9. {per_object - code_bytes(26, 6) - code_bytes(3000, 40)} байта:")
same("5: идентификатор", (whole(32), whole(20) + whole(12), code_bytes(36, 7)), (4, 5, 6))
same("5: пропуск", (whole(54) + whole(number_len(500)), whole(54 + number_len(500))), (9, 8))
same("5: блоки", (whole(10 * (code_len(9) + 15)), 10 * whole(code_len(9) + 15)), (24, 30))


# --- 6. Служебные данные ---
f = "06-sluzhebnye-dannye.md"


def with_headers(size, group, head=1):
    groups = smallest(lambda g: g * group >= size, 0)
    return size + groups * head


def batch(code_bits, extra_bytes, memory):
    def fits(n):
        return n * (whole(code_bits + number_len(n)) + extra_bytes) <= memory

    # fits(n) is not monotone near powers of two, so every n is tried
    return max(n for n in range(1, memory // extra_bytes + 1) if fits(n))


expect(f, f"1. {with_headers(25, 6, 2)} байтов:")
biggest2 = largest(lambda b: with_headers(b, 5) <= 60)
expect(f, f"2. {biggest2 * 8 // code_len(100)} символов:")
expect(f, f"3. {smallest(lambda n: whole(4 * code_len(26) + number_len(n)) > 4)} изделий:")
expect(f, f"4. {batch(10 * code_len(26), 20, 8 * KB)} изделия:")
biggest5 = largest(lambda b: with_headers(b, 7) <= 2 * KB)
expect(f, f"5. {biggest5 * 8 // code_len(300)} символа:")
expect(f, f"6. {batch(15 * code_len(52), 45, 60 * KB)} изделий:")
same("6: 10 байтов", with_headers(10, 4), 13)
same("6: 40 символов", largest(lambda b: with_headers(b, 4) <= 20) * 8 // code_len(40), 21)
same("6: партия", batch(5 * code_len(26), 10, KB), 73)


# --- 7. Практика и итог ---
f = "07-praktika-i-itog.md"
expect(f, f"1. {MB * code_bytes(10 + 3500, 220) // MB} Мбайт:")
expect(f, f"2. {extra(26 + 10, 30, 20 * KB, 512)} байтов:")
expect(f, f"3. {max_alphabet(150, 40000, 3 * MB)}:")
expect(f, f"4. {min_length(10 + 26 + 2000, 5000, lambda v: v > 600 * KB)}:")
expect(f, f"5. {40 - code_bytes(18, 12) - whole(number_len(1500))} байтов:")

bad = [c for c in checks if not c[2]]
for c in bad:
    print("FAIL", c[0], c[1])
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
