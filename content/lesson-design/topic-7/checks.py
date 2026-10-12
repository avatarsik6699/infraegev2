"""Independent recomputation of every task answer in topic 7.

Usage: python3 -I content/lesson-design/topic-7/checks.py

The lessons compute with powers of two, ratios and float division. Here every
answer is recomputed in a different way: exact fractions of bits (never
floats), the code length from the length of a binary record instead of a loop
over powers, maximal and minimal integers by searching neighbours instead of
dividing, and media filled photo by photo. Every expected answer must appear
verbatim in the answers of its file. Exit code 1 if any check fails.
"""

import sys
from fractions import Fraction as F
from pathlib import Path

D = Path(__file__).resolve().parent
BYTE, KB, MB, GB = 8, 8 * 1024, 8 * 1024**2, 8 * 1024**3  # in bits


def answers(f):
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


def code_len(n):
    """Smallest i with 2**i >= n: the length of the binary record of n − 1."""
    return len(format(n - 1, "b")) if n > 1 else 0


def ru(x):
    """12 345,5 — the way numbers are written in the lessons."""
    x = F(x)
    whole = x.numerator // x.denominator
    s = f"{whole:,}".replace(",", " ") if whole >= 10000 else str(whole)
    rest = x - whole
    if rest:
        digits = ""
        while rest and len(digits) < 6:
            rest *= 10
            digits += str(rest.numerator // rest.denominator)
            rest -= rest.numerator // rest.denominator
        s += "," + digits
    return s


def largest(ok, start=0):
    """Largest integer n >= start with ok(n), searching upward from start."""
    n = start
    while ok(n + 1):
        n += 1
    return n


def smallest(ok, start=0):
    n = start
    while not ok(n):
        n += 1
    return n


def ceil_f(x):
    return smallest(lambda n: n >= x, int(x) - 1)


def floor_f(x):
    return largest(lambda n: n <= x, int(x) - 1)


checks = []


def expect(f, needle):
    checks.append((f, needle, needle in answers(f)))


def same(label, a, b):
    checks.append(("—", f"{label}: {a} = {b}", a == b))


# --- 1. Биты, байты и коды ---
f = "01-bity-i-kody.md"
expect(f, f"1. {code_len(600)} бит:")
expect(f, f"2. {ru(F(5, 2) * MB)} бит:")
expect(f, f"3. {ru(F(2**20, KB))} Кбайт:")
expect(f, f"4. {ru(3 * KB)} бит и {ru(F(6000, BYTE))} байт:")
expect(f, f"5. {2**12} цветов; для 4097 — {code_len(4097)} бит")
expect(f, f"6. {ru(F(1500 * code_len(33), BYTE))} байт:")
expect(f, f"7. {ru(F(32 * 50 * 64 * 2 * BYTE, KB))} Кбайт:")
expect(f, f"8. {ru(F(4096 * code_len(200), KB))} Кбайт:")
expect(f, f"9. {code_len(100000)} бит:")


def image(w, h, i):
    return w * h * i


def max_colours(w, h, limit_bits, keep=F(1)):
    depth = largest(lambda i: keep * image(w, h, i) <= limit_bits)
    return 2**depth


# --- 2. Растровое изображение ---
f = "02-izobrazhenie.md"
expect(f, f"1. {ru(F(image(256, 128, code_len(200)), KB))} Кбайт:")
expect(f, f"2. {max_colours(320, 200, 80 * KB)} цвета:")
expect(f, f"3. В {ru(F(code_len(32), code_len(16)))} раза:")
expect(f, f"4. {ru(8 * F(300, 200) ** 2)} Мбайт:")
expect(f, f"5. {ru(F(image(1024, 768, 24), MB))} Мбайт:")
expect(f, f"6. {ru(F(image(640, 400, code_len(6000)), KB))} Кбайт:")
expect(f, f"7. 24 бита и 2²⁴ = {ru(2**24)} цветов")
expect(f, f"8. {max_colours(1000, 750, 300 * KB)} цветов:")
same("2.9 скан", 36 * F(200, 400) ** 2 * F(code_len(65536), 24), 6)
expect(f, "9. 6 Мбайт:")


# --- 3. Сжатие и служебная информация ---
f = "03-szhatie-i-zagolovki.md"
expect(f, f"1. {ru(40 * F(85, 100))} Мбайт:")
expect(f, f"2. На {ru(F(80 - 20, 80) * 100)} % и в {ru(F(80, 20))} раза:")
expect(f, f"3. {ru(28 / F(70, 100))} Мбайт:")
expect(f, f"4. На {ru((1 - F(80, 100) * F(50, 100)) * 100)} %:")
expect(f, f"5. {ru(F(300, 3) + 24)} и {ru(F(300 + 24, 3))} Кбайт:")
expect(f, f"6. {10 * (96 + 8)} и {10 * 96 + 8} Кбайт:")
expect(f, f"7. {max_colours(1024, 768, 576 * KB, F(60, 100))} цвета:")


def colours_of_set(n, w, h, keep, head_kb, total_bits):
    """Largest depth with which the whole set still fits in total_bits."""
    depth = largest(lambda i: n * (keep * image(w, h, i) + head_kb * KB) <= total_bits)
    return 2**depth


expect(f, f"8. {colours_of_set(64, 1024, 512, F(3, 4), 32, 20 * MB)} цвета:")
photo_kb = F(800 * 600 * 24, KB) * F(1, 4)
desc = F(50 * MB, 100 * KB) - photo_kb
same("3.9 ближайшее", round(desc), 160)
expect(f, f"9. {round(desc)} Кбайт:")
expect(f, f"= {ru(desc)}.")
# the worked examples of the subtopic
same("3: 70 % и 48 Кбайт", max_colours(512, 256, 48 * KB, F(30, 100)), 1024)
same("3: набор 8 Мбайт", colours_of_set(32, 512, 256, F(3, 4), 64, 8 * MB), 2**16)
same("3: набор 7 Мбайт", colours_of_set(32, 512, 256, F(3, 4), 64, 7 * MB), 2**13)


def sound(f_hz, c, i, t):
    return f_hz * c * i * t


# --- 4. Оцифрованный звук ---
f = "04-zvuk.md"
expect(f, f"1. {ru(F(sound(16000, 2, 16, 10), KB))} Кбайт:")
expect(f, f"2. {ru(F(sound(48000, 1, 24, 20), KB))} Кбайт:")
expect(f, f"3. {smallest(lambda t: sound(32000, 2, 16, t) >= 3750 * KB)} с:")
expect(f, f"4. {3 * 60 + 45} с и {ru(F(5, 2) * 60)} с:")
expect(f, f"5. {ru(10 * F(2, 1) * F(2, 1) * F(1, 2) * F(50, 100))} Мбайт:")
expect(f, f"6. {ru(60 * F(2, 4) * 2 / F(3, 2))} Мбайт:")
ratio = F(1, 2) * 2 * F(25, 100) / F(80, 100)
expect(f, f"7. В {ru(1 / ratio)} раза:")
v8 = F(sound(24000, 2, 16, 3 * 60 + 7), KB)
expect(f, f"8. {ru(ceil_f(v8))} Кбайт:")
expect(f, f"= {ru(v8)},")
expect(f, f"9. {ru(18 * F(4, 1) * F(1, 2) * F(1, 3))} Мбайт:")
minutes = F(330 * MB, 48000 * 2 * 24) / 60
expect(f, f"10. {round(minutes)} минут:")
same("4: 1 мин 25 с", ceil_f(F(sound(16000, 2, 16, 85), KB)), 5313)


# --- 5. Передача данных ---
f = "05-peredacha.md"
expect(f, f"1. {ru(F(sound(32000, 1, 16, 60), 64000))} с:")
expect(f, f"2. {largest(lambda i: sound(20000, 2, i, 1) * F(40, 100) <= 512000)} бита:")
expect(f, f"3. {ru(F(6 * MB, 2**21))} с:")
expect(f, f"4. {ru(F(256000 * 120, KB))} Кбайт:")
expect(f, f"5. {ru(45 * F(4, 3))} с:")
expect(f, f"6. {ru(F(image(640, 480, code_len(256)) * 50, 1536000))} с:")
saved = 40 * (image(2048, 1536, 24) - image(1024, 768, 16))
expect(f, f"7. {ru(F(saved, MB))} Мбайт:")
photo = image(1280, 1024, code_len(65536)) * F(40, 100)
expect(f, f"8. {smallest(lambda n: 256 * KB * n >= photo, 1)}:")
pack = F(image(1920, 1080, code_len(5000)) * 250, 25000000)
expect(f, f"9. {floor_f(pack / 60)}:")
album = F(sound(44100, 2, 24, 40 * 60) + 12 * 200 * KB, 100000000)
expect(f, f"10. {floor_f(album)}:")
# worked examples
same("5: поток 20 Кбайт/с", largest(lambda i: sound(32000, 2, i, 1) * F(1, 4) <= 20 * KB), 10)
same(
    "5: снимков за 10 минут",
    largest(lambda n: n * image(1600, 1200, code_len(3000)) <= 5000000 * 600),
    130,
)
same("5: каждые n секунд", smallest(lambda n: 24 * n >= 64, 1), 3)
same("5: кадров в секунду", largest(lambda n: 64 * n <= 200), 3)


# --- 6. Округление и границы ---
f = "06-okruglenie.md"
expect(f, f"1. {largest(lambda n: n * 90 <= 1024)} файлов:")
expect(f, f"2. {smallest(lambda h: F(400 + 5 * h, 50) > 10)} Кбайт:")
x = F(12346, 10)
expect(f, f"3. {ceil_f(x)}, {floor_f(x)} и {round(x)}.")
expect(f, f"4. {floor_f(F(2399, 10) / 60)} минуты:")
expect(f, f"5. {12 * ceil_f(F(7 * 5, 8))} байт:")
expect(f, f"= {ceil_f(F(12 * 7 * 5, 8))} неверно")
per = largest(lambda n: n * 64 <= 700)
expect(f, f"6. {per} файлов и {ceil_f(F(50, per))} носителей:")
music = sound(32000, 4, 20, 1800)
expect(f, f"7. {smallest(lambda h: F(music + 16 * h * KB, 300000000) > 16)} Кбайт:")


def filled_cards(w, h, palette, card_bits, shots):
    """Put photos on cards one by one; count the photos on all but the last card."""
    size = image(w, h, code_len(palette))
    cards, free, on_card = [], 0, 0
    for _ in range(shots):
        if size > free:
            if on_card:
                cards.append(on_card)
            free, on_card = card_bits, 0
        free -= size
        on_card += 1
    return sum(cards)


expect(f, f"8. {filled_cards(3000, 2000, 10**7, 32 * GB, 5000)}:")
same("6: пример с картами", filled_cards(4000, 3000, 20 * 10**6, 64 * GB, 10000), 9160)
same("6: заголовок H > 10", smallest(lambda h: F(600 + 4 * h, 20) > 32), 11)


# --- 7. Составные записи ---
f = "07-sostavnye-zapisi.md"


def share(text, k):
    """Percent of the unchanged text after the rest grows k times (text in %)."""
    return F(text) / (text + k * (100 - text)) * 100


def header(k, big, small):
    """Brute force over x in tenths of a Mbyte: k·x + H = big, x + H = small."""
    for tenth in range(1, small * 10):
        x = F(tenth, 10)
        if k * x + (small - x) == big:
            return small - x
    return None


expect(f, f"1. {ru(share(25, 3))} %:")
expect(f, f"2. {ru(header(4, 33, 9))} Мбайт:")
expect(f, f"3. {ru(header(10, 70, 16))} Мбайт:")
expect(f, f"4. {ru(share(20, F(1, 4)))} %:")
seconds = F(1024, 2) * 60
expect(f, f"5. {ru(F(sound(16000, 1, 16, seconds), MB))} Мбайт:")
expect(f, f"6. {ru(share(40, F(300, 150) ** 2 * F(25, 50)))} %:")
book = F(sound(16000, 2, 16, F(2048, 4) * 60), MB) * F(20, 100)
expect(f, f"7. {ru(book / 15)}:")
same("7: пример 4 %", share(20, F(200, 100) ** 2 * F(90, 60)), 4)
same("7: аудиокнига 60 %", (1 - F(75 * 5 * MB, sound(16000, 1, 16, seconds))) * 100, 60)
same("7: заголовок 2 Мбайт", header(8, 50, 8), 2)


# --- 8. Практика и итог ---
f = "08-praktika-i-itog.md"
expect(f, f"1. {max_colours(1280, 720, 900 * KB)}:")
expect(f, f"2. {colours_of_set(128, 640, 480, F(3, 4), 16, 32 * MB)}:")
v3 = F(sound(22050, 2, 16, 2 * 60 + 35), KB)
expect(f, f"3. {ru(ceil_f(v3))} Кбайт:")
expect(f, f"4. {ru(50 * (2 * F(1, 2) * F(3, 2)) / 3)} с:")
expect(f, f"5. {floor_f(F(image(2000, 1500, code_len(1000)) * 120, 14000000))}:")

bad = [c for c in checks if not c[2]]
for c in bad:
    print("FAIL", c[0], c[1])
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
