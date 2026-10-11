"""Independent recomputation of every task answer of the Excel course.

Usage: python3 -I content/lesson-design/course-excel/checks.py

The lessons' sheets are computed by sheet_eval (verify_sheets.py); here each
task answer is recomputed a second way in plain Python — loops instead of
functions, counting by hand, dates by the standard library — without the
course's evaluator, and the expected fragment must appear verbatim in the
lesson file. Exit code 1 if any check fails, or if a lesson with answers has
no check at all.
"""

import datetime
import math
import re
import sys
from decimal import ROUND_HALF_UP, Decimal
from fractions import Fraction
from pathlib import Path

D = Path(__file__).resolve().parent
failures: list[str] = []
checked: set[str] = set()


def text(prefix: str) -> str:
    (path,) = D.glob(f"{prefix}-*.md")
    # inline code and keys are markup, not text: `=B2*C2`, [[Ctrl+C]]
    return re.sub(r"`|\[\[|\]\]", "", path.read_text(encoding="utf-8"))


def has(prefix: str, *fragments: str) -> None:
    checked.add(prefix)
    body = text(prefix)
    for fragment in fragments:
        fragment = re.sub(r"`|\[\[|\]\]", "", fragment)
        if fragment not in body:
            failures.append(f"{prefix}: {fragment!r} not in the lesson")


def same(prefix: str, got, expected) -> None:
    checked.add(prefix)
    if got != expected:
        failures.append(f"{prefix}: recomputed {got!r}, lesson says {expected!r}")


def ru(x) -> str:
    """A number as the lessons write it: decimal comma, no trailing zeros."""
    if isinstance(x, Fraction):
        x = float(x)
    if float(x) == int(x):
        return str(int(x))
    return f"{x:.10g}".replace(".", ",")


def col(letters: str) -> int:
    n = 0
    for ch in letters:
        n = n * 26 + ord(ch) - 64
    return n


def letters(n: int) -> str:
    out = ""
    while n:
        n, r = divmod(n - 1, 26)
        out = chr(65 + r) + out
    return out


def cells(r1, c1, r2, c2) -> int:
    return (r2 - r1 + 1) * (c2 - c1 + 1)


def excel_round(x: float, digits: int = 0) -> float:
    return float(Decimal(str(x)).quantize(Decimal(1).scaleb(-digits), rounding=ROUND_HALF_UP))


def serial(y: int, m: int, d: int) -> int:
    return (datetime.date(y, m, d) - datetime.date(1899, 12, 30)).days


# 01 — sheet, cell, range
n = cells(3, col("B"), 7, col("E"))
has("01", f"1. {n} ячеек: строк 7 − 3 + 1 = 5, столбцов от B до E — 4. Нижняя правая — E7.")
has("01", f"2. {cells(2, 3, 11, 3)} и {cells(5, col('B'), 5, col('F'))}:")
same("01", (letters(27), letters(col("AZ") + 1)), ("AA", "BA"))
has("01", "3. AA, затем после AZ идёт BA.", f"4. B2:D4, 3 × 3 = {cells(2, 2, 4, 4)} ячеек.")
total = cells(1, 1, 10, 3)
has("01", f"5. {total} ячеек, из них {total - 23} пустых")
has("01", "8. Шесть ячеек: 3 строки × 2 столбца.")
same("01", cells(2, 2, 4, 3), 6)

# 02 — input and files
line = "Тетрадь;40;12,5"
has(
    "02",
    f"3. Три поля при «;»: `Тетрадь`, `40`, `12,5`. Два при «,»: `{line.split(',')[0]}` и `{line.split(',')[1]}`.",
)
same("02", len(line.split(";")), 3)
has("02", f"4. Число {int('00127')}: ведущие нули", "8. 7 — набор заменяет")

# 03 — values in a cell
has(
    "03",
    f"2. {round(0.075 * 100)}% и {round(2 * 100)}%; в формате «0,0%» — {ru(Fraction(75, 10))}%.",
)
has("03", f"3. Число {int('0042')} и текст 0042.")
a = [6, 9, 0]
b = [6, 9]
has("03", f"4. {ru(Fraction(sum(a), len(a)))} и {ru(Fraction(sum(b), len(b)))}:")
same("03", serial(2026, 10, 1), 46296)
has(
    "03",
    f"5. {serial(2026, 10, 3)}; от 01.10 до 15.10 — {serial(2026, 10, 15) - serial(2026, 10, 1)} дней: {serial(2026, 10, 15)} − {serial(2026, 10, 1)}.",
)
same("03", serial(2026, 10, 5), 46300)
has("03", "день номер 46300", "следующий день — 46301")

# 04 — first formulas
A, B = 12, 5
has("04", f"1. {A + B * 2} и {(A + B) * 2}.")
has("04", f"2. {2 * 3**2}, {(2 * 3) ** 2} и {ru(Fraction(10, 100) * 50)}:")
has("04", f"3. {ru(Fraction(15 + 8, 2))} и {ru(15 + Fraction(8, 2))}.")
has("04", f"4. D2 — 200, E2 — {50 * 5}:")
has("04", f"Масса 8×250/1000 = {8 * 250 // 1000} кг. Выручка 8×120 = {8 * 120} рублей.")
items = [(60, 3), (25, 4), (10, 6)]
costs = [p * q for p, q in items]
has("04", f"8. {costs[0]}, {costs[1]} и {costs[2]}, итог {sum(costs)}:")
has("04", f"=(A2+B2)/2 ⇒ {ru(Fraction(12 + 5, 2))}", f"=A2+B2/2 ⇒ {ru(12 + Fraction(5, 2))}")


# 05 — copying and $
def shift(ref: str, drow: int, dcol: int) -> str:
    """Hand-written rule: a part without $ moves, a part with $ stays."""
    out, i = "", 0
    while i < len(ref):
        if ref[i] == "$" or ref[i].isalpha():
            fixed_c = ref[i] == "$"
            j = i + fixed_c
            k = j
            while ref[k].isalpha():
                k += 1
            c = ref[j:k]
            fixed_r = ref[k] == "$"
            m = k + fixed_r
            e = m
            while e < len(ref) and ref[e].isdigit():
                e += 1
            r = int(ref[m:e])
            c = c if fixed_c else letters(col(c) + dcol)
            r = r if fixed_r else r + drow
            out += ("$" if fixed_c else "") + c + ("$" if fixed_r else "") + str(r)
            i = e
        else:
            out += ref[i]
            i += 1
    return out


same("05", shift("B2*C2", 3, 0), "B5*C5")
has("05", f"В D5 получится ={shift('B2*C2', 3, 0)}, в F2 — ={shift('B2*C2', 0, 2)}.")
has("05", f"2. ={shift('$B2*C$1+$H$2', 3, 2)}.")
has("05", f"3. В C3 — ={shift('A1*$B$1', 2, 0)}, в E1 — ={shift('A1*$B$1', 0, 2)}.")
has("05", f"4. {shift('A$2', 3, 2)} и {shift('$A2', 3, 2)}.")
prices = [200, 60, 240, 60]
after = [p * (100 - 15) / 100 for p in prices]
has(
    "05",
    f"5. {ru(after[0])}, {ru(after[1])}, {ru(after[2])} и {ru(after[3])}; сумма {ru(sum(after))}.",
)
has("05", f"7. ={shift('$A2*B$1', 3, 3)}, значение 4 × 4 = 16.")
has("05", f"8. =$A2+B$1; в E5 — ={shift('$A2+B$1', 3, 3)}, значение {4 + 4}.")

# 06 — functions
vals = [7, 0, None, "нет"]
nums = [v for v in vals if isinstance(v, int)]
has(
    "06",
    f"1. Сумма {sum(nums)}, количество чисел {len(nums)}, непустых значений {sum(v is not None for v in vals)}, среднее {ru(Fraction(sum(nums), len(nums)))}.",
)
s3 = sorted([5, 5, 11])
has("06", f"2. {s3[-1]}, {s3[-2]} и {s3[1]}:")
has(
    "06",
    f"3. Общее среднее {ru(Fraction(90 * 3 + 70 * 7, 10))}: (90·3 + 70·7)/10; среднее двух средних — {ru(Fraction(90 + 70, 2))}.",
)
row = [6, 1, 6, 2]
has("06", f"то есть {sum(row)} − {max(row)} = {sum(row) - max(row)}.")
has("06", f"7. {5**2 + 12**2}: 25 + 144.")
has("06", f"=(B2*C2+B3*C3)/(C2+C3) ⇒ {ru(Fraction(80 * 2 + 60 * 8, 10))}")

# 07 — conditions
scores = [35, 40, 55, 70, 71]
fit = [s for s in scores if 40 <= s <= 70]
has("07", f"6. Три: {fit[0]}, {fit[1]} и {fit[2]}.")
same("07", len(fit), 3)
xs = [12, 7, 20, 3, 15]
flags = [1 if 5 <= x <= 15 else 0 for x in xs]
has("07", f"8. Признаки {', '.join(map(str, flags))}; итог {sum(flags)}.")
has("07", f"5. {max(3, 8)} — большее из двух")

# 08 — numbers
has("08", f"1. 800×1,15×0,85={ru(Fraction(800) * Fraction(115, 100) * Fraction(85, 100))}.")
has("08", f"2. Пять коробок. =ОКРУГЛВВЕРХ(37/8;0). Четыре коробки вмещают только {4 * 8} предмета.")
same("08", -(-37 // 8), 5)
has("08", f"4. {ru(excel_round(3456, -2))}, {math.floor(7.99)} и −{math.ceil(0.1)}.")
has("08", f"5. −{math.ceil(4.5)} и −{int(4.5)}.")
has(
    "08",
    f"6. На {ru(Fraction(300 - 250, 250) * 100)}%; при падении с 300 до 250 — примерно на {ru(round(float(Fraction(50, 300) * 100), 1))}%",
)
q, r = divmod(100, 7)
has("08", f"7. {r}: 100 = 7·{q} + {r}.")
has("08", "для 45 — ИСТИНА, для 50 — ЛОЖЬ")
same("08", (45 % 3 == 0 and 45 % 5 == 0, 50 % 3 == 0 and 50 % 5 == 0), (True, False))
has(
    "08",
    f"9. Округлить каждую и сложить — {3 * round(1.4)}, сложить и округлить — {round(1.4 * 3)}:",
)

# 09 — conditional count
row = [2, 3, 6, 7]
has("09", f"4. Подходят 2, 3 и 6: ответ {sum(1 for x in row if x % 2 == 0 or x % 3 == 0)}.")
freq_row = [7, 7, 2, 2, 5, 9]
freqs = [freq_row.count(x) for x in freq_row]
has("09", f"5. Частоты {', '.join(map(str, freqs))}.")
r6 = [6, 6, 1, 2, 3, 9]
single = sum(x for x in r6 if r6.count(x) == 1)
rep = sum(x for x in r6 if r6.count(x) > 1)
has("09", f"6. Одиночные {single} (1 + 2 + 3 + 9), повторяющиеся {rep} (6 + 6).")
spans = [(1, 5), (2, 3), (5, 8)]
at2 = sum(1 for s, f in spans if s <= 2 < f)
at5 = sum(1 for s, f in spans if s <= 5 < f)
same("09", (at2, at5), (2, 1))
has("09", "7. Момент 2 содержат два промежутка", "Момент 5 — один")
words = ["Казань", "Курск", "Самара", "Омск"]
has("09", f"8. {sum(1 for w in words if len(w) >= 2 and w[1].lower() == 'а')}: «Казань» и «Самара»")
has("09", f"9. {sum(x for x in [10, 15, 20, 25] if x >= 15)} и #ДЕЛ/0!")

# 10 — text and dates
w = "Москва"
has("10", f"1. {w[:3]}, {w[-2:]} и {w[1:5]}.")
has("10", f"2. {len(' да ')} и {len(' да '.strip())}.")
has("10", f'3. =ПОДСТАВИТЬ(A2;"-";"") даёт {"2026-10-05".replace("-", "")}')
d1 = datetime.date(2026, 2, 27)
d2 = datetime.date(2026, 3, 2)
has("10", f"6. {(d2 - d1).days} дня; 2 марта 2026 года")
same("10", datetime.date(2026, 3, 1) + datetime.timedelta(days=1), datetime.date(2026, 3, 2))
has("10", f"8. =ЗНАЧЕН(ПРАВСИМВ(A2;3))+1 — {int('AB-12-345'[-3:]) + 1}.")
has("10", f"=ДАТА(2026;11;1)-B2 ⇒ {serial(2026, 11, 1) - serial(2026, 10, 5)}")

# 11 — sort and filter
sums = [10, 20, 30, 40, 50, 60]
filtered, hidden = {20, 50}, {60}
has(
    "11",
    f"2. {sum(sums)}, {sum(x for x in sums if x not in filtered)} и {sum(x for x in sums if x not in filtered | hidden)}.",
)

# 12 — lookup
goods = {
    101: ("Чай", "Напитки", 100),
    102: ("Кофе", "Напитки", 250),
    103: ("Печенье", "Выпечка", 200),
    104: ("Какао", "Напитки", 150),
}
has("12", f"Для кода 102 результат равен {goods[102][2]} г.")
codes = list(goods)
has("12", f"3. {codes.index(104) + 1} и «{goods[codes[1]][0]}».")
ops = [(101, 2), (101, 3), (104, 4), (103, 5)]
drinks = [q for c, q in ops if goods[c][1] == "Напитки"]
has("12", f"6. {sum(drinks)} упаковок и {len(drinks)} операции")
by_mass = next(name for name, _, mass in goods.values() if mass == 150)
has("12", f"— «{by_mass}».")
has("12", "2. 3: внутри диапазона C:F столбец E — третий.")
same("12", col("E") - col("C") + 1, 3)

# 13 — neighbour cells
has("13", f"1. Пар {101 - 2}.")
acc = []
for x in [50, 30, 20, 100]:
    acc.append((acc[-1] if acc else 0) + x)
has("13", f"2. {acc[0]}, {acc[1]}, {acc[2]} и {acc[3]}.")
seq = [4, 8, 6, 5, 7]
pairs = [(a, b) for a, b in zip(seq, seq[1:], strict=False) if a % 3 == 0 or b % 3 == 0]
same("13", pairs, [(8, 6), (6, 5)])
has("13", "4. Две: (8, 6) и (6, 5)")
has("13", f"6. {math.comb(3, 1)} и {math.comb(5, 2)}.", f"7. {2**3} = 2³.")
seq6 = [4, 5, 9, 7, 8, 12]
flags = [int(a % 3 == 0 or b % 3 == 0) for a, b in zip(seq6, seq6[1:], strict=False)]
has("13", f"=СУММ(B2:B6) ⇒ {sum(flags)}", f"=МИН(D2:D6) ⇒ {flags.index(1) + 2}")
has("13", f"| 4 |       |            |   | ⇒ {math.comb(6, 3)}")

# 14 — from task to table
discount = Fraction(1, 2)
after = [p * q * (1 - discount) for p, q in [(40, 5), (20, 3), (120, 2), (15, 4)]]
big = [x for x in after if x > 100]
has("14", f"7. Одна покупка — папки — на {ru(big[0])} рублей")
same("14", len(big), 1)
after10 = [p * q * Fraction(9, 10) for p, q in [(40, 5), (20, 3), (120, 2), (15, 4)]]
has("14", f"на {ru(sum(x for x in after10 if x > 100))} рублей; проверка другим способом")
marks = [45, 80, 62, 80, 30, 95]
ok = [m for m in marks if m >= 60]
has(
    "14",
    f"8. {len(ok)} балла не меньше 60 — 80, 62, 80, 95; среднее {ru(Fraction(sum(ok), len(ok)))}.",
)
has("14", "6. Строка 6, 2, 2, 2 пограничная: 6 = 2 + 2 + 2")

# 15 — tables and pivots (advanced)
sales = [
    ("Москва", "Чай", 300),
    ("Казань", "Кофе", 450),
    ("Москва", "Кофе", 250),
    ("Омск", "Чай", 120),
    ("Казань", "Чай", 200),
    ("Москва", "Какао", 150),
]
has("15", f"4. {sum(v for c, g, v in sales if c == 'Москва' and g != 'Какао')}:")
has("15", f"=СУММ(G2:G4) ⇒ {sum(v for _, _, v in sales)}")

# every lesson with answers must have at least one check
for path in sorted(D.glob("[0-9][0-9]-*.md")):
    if "**Ответы для проверки:**" in path.read_text(encoding="utf-8"):
        if path.name[:2] not in checked:
            failures.append(f"{path.name[:2]}: answers without a single check")

if failures:
    print("\n".join(failures))
    sys.exit(1)
print(f"all answers confirmed: {len(checked)} lessons")
