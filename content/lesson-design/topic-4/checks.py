"""Independent recomputation of every task answer in topic 4.

Usage: python3 -I content/lesson-design/topic-4/checks.py

The lessons solve by the code tree: free branches, places, splitting the
shortest vertex. Here every answer is recomputed by brute force over actual
code words instead: all binary strings up to a length bound are tried for the
unknown letters, a table is kept when no code is the beginning of another and,
if other letters of the alphabet need codes, some binary string is still free.
Every expected answer must appear verbatim in the answers of its file.
Exit code 1 if any check fails.
"""

import sys
from fractions import Fraction
from itertools import product
from pathlib import Path

D = Path(__file__).resolve().parent


def answers(f: str) -> str:
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


checks: list[tuple[str, str, bool]] = []


def expect(f: str, needle: str, ok: bool = True) -> None:
    checks.append((f, needle, ok and needle in answers(f)))


def same(label: str, a, b) -> None:
    checks.append(("—", f"{label}: {a} = {b}", a == b))


# --- brute force over code words ---------------------------------------------------


def clash(a: str, b: str) -> bool:
    return a.startswith(b) or b.startswith(a)


def fano(codes) -> bool:
    codes = list(codes)
    return all(not clash(a, b) for i, a in enumerate(codes) for b in codes[i + 1 :])


def strings(limit: int) -> list[str]:
    return ["".join(p) for n in range(1, limit + 1) for p in product("01", repeat=n)]


def has_room(codes) -> bool:
    """Some string still fits: another letter can get a code (any length).

    Only strings as long as the longest code need trying: if a longer string is
    free, so is its beginning of that length (no code is equal to it or starts it).
    """
    n = max(len(c) for c in codes)
    return any(all(not clash("".join(s), c) for c in codes) for s in product("01", repeat=n))


def tables(fixed: dict, letters: str, room: bool = False, limit: int = 5, force=None, ties=()):
    """Every assignment of codes (length ≤ limit) to letters that keeps Fano.

    A generator: the number of assignments grows exponentially with the letters,
    so they are produced one by one and never kept in a list (a list of them took
    the whole memory of the machine).
    """
    force = force or {}
    pool = [s for s in strings(limit) if all(not clash(s, c) for c in fixed.values())]

    def rec(i: int, cur: dict):
        if i == len(letters):
            if not room or has_room(list(fixed.values()) + list(cur.values())):
                yield {**fixed, **cur}
            return
        ch = letters[i]
        # letters of one tie group are interchangeable: their codes go in increasing order
        tied = i > 0 and any(ch in g and letters[i - 1] in g for g in ties)
        for s in [force[ch]] if ch in force else pool:
            if tied and s <= cur[letters[i - 1]]:
                continue
            if all(not clash(s, c) for c in cur.values()) and all(
                not clash(s, c) for c in fixed.values()
            ):
                cur[ch] = s
                yield from rec(i + 1, cur)
                del cur[ch]

    yield from rec(0, {})


def word_len(code: dict, word: str) -> int:
    return sum(len(code[ch]) for ch in word)


def best_word(fixed, word, room=False, limit=5, force=None) -> int:
    # letters met equally often in the word are interchangeable for its length
    free = sorted(set(word) - set(fixed) - set(force or {}), key=lambda ch: (word.count(ch), ch))
    letters = "".join(sorted(force or {}, key=str)) + "".join(free)
    ties = [
        "".join(ch for ch in free if word.count(ch) == k) for k in {word.count(ch) for ch in free}
    ]
    return min(word_len(t, word) for t in tables(fixed, letters, room, limit, force, ties))


def best_sum(fixed, letters, room=False, limit=5) -> int:
    return min(sum(len(t[ch]) for ch in letters) for t in tables(fixed, letters, room, limit))


def shortest(fixed: dict, letter: str = "X", others: int = 0, largest: bool = False) -> str:
    room = others > 0
    for n in range(1, 8):
        ok = [
            s
            for s in ("".join(p) for p in product("01", repeat=n))
            if fano(list(fixed.values()) + [s])
            and (not room or has_room(list(fixed.values()) + [s]))
        ]
        if ok:
            return ok[-1] if largest else ok[0]
    raise AssertionError(letter)


def parses(table: dict, bits: str) -> list[str]:
    if not bits:
        return [""]
    return [
        k + rest
        for k, c in table.items()
        if bits.startswith(c)
        for rest in parses(table, bits[len(c) :])
    ]


BASE = {"А": "0", "Б": "10", "В": "110", "Г": "111"}

# --- 1. Код и условие Фано ---
f = "01-kod-i-uslovie-fano.md"
expect(f, "1. Да:" if fano(["00", "010", "011", "1"]) else "1. Нет")
enc = "".join(BASE[ch] for ch in "ВАГА")
expect(f, f"2. `{enc}`: 110 | 0 | 111 | 0, всего {len(enc)} знаков.")
n20 = next(n for n in range(1, 10) if 2**n >= 20)
expect(f, f"3. {2**6} последовательности: 2⁶ = 64. Для 20 букв нужна длина {n20}")
pairs = [("11", "110"), ("01", "101"), ("100", "10"), ("0110", "011")]
bad = [i + 1 for i, (a, b) in enumerate(pairs) if clash(a, b)]
same("1: нарушающие пары", bad, [1, 3, 4])
expect(f, "4. Нарушают первая, третья и четвёртая пары")
same("1: два прочтения 100", sorted(parses({"А": "1", "Б": "10", "В": "0"}, "100")), ["АВВ", "БВ"])
expect(f, "5. `100`: целиком 10 | 0 — БВ, по знакам 1 | 0 | 0 — АВВ.")
same("1: задача 6", fano(["01", "10", "0", "11"]), False)
expect(f, "6. Нет: `0` — начало `01`.")
fit = [c for c in ["0", "10", "011", "1000", "11"] if fano(["01", "100", c])]
expect(f, f"7. Подходит только `{fit[0]}`." if len(fit) == 1 else "—")
sets = [["0", "10", "110", "111"], ["0", "01", "11", "101"], ["00", "01", "10", "1"]]
sets.append(["1", "01", "001", "000"])
good = [i + 1 for i, s in enumerate(sets) if fano(s)]
expect(f, f"8. В наборах {good[0]} и {good[1]}.")

# --- 2. Кодовое дерево ---
f = "02-kodovoe-derevo.md"
t1 = {"А": "00", "Б": "010", "В": "011", "Г": "1"}
expect(f, f"1. {parses(t1, '010100011')[0]}:")
free2 = [s for s in strings(3) if fano(["01", "000", "11", s])]
minimal = sorted(s for s in free2 if not any(s != t and s.startswith(t) for t in free2))
expect(f, f"2. `{minimal[0]}` и `{minimal[1]}`:")
same("2: 11010", parses(BASE, "11010"), ["ВБ"])
same("2: 1101 не читается", parses(BASE, "1101"), [])
expect(f, "3. `11010` — ВБ: 110 | 10.")
expect(f, f"4. `{shortest({'А': '00', 'Б': '01', 'В': '110', 'Г': '111'})}`:")
t5 = {"А": "0", "Б": "111", "В": "101"}
expect(f, f"5. `{shortest(t5)}` и `{shortest(t5, largest=True)}`:")
four = [s for s in strings(4) if len(s) == 4 and fano(["1", "000", "011", s])]
expect(f, "6. " + ", ".join(f"`{s}`" for s in four) + ":")
expect(f, f"7. `{shortest({'К': '01', 'Л': '001', 'М': '11', 'Н': '100'})}`:")
t8 = dict(zip("АБВГДЕЖЗИ", "000 0010 0011 010 0110 100 101 1100 111".split(), strict=True))
expect(f, f"8. `{shortest(t8)}`:")
expect(f, f"9. `{shortest({'Р': '1', 'С': '001', 'Т': '010'}, largest=True)}`:")

# --- 3. Место и сумма длин ---
f = "03-mesto-dlya-vseh-bukv.md"
same("3: пример Г при Д", shortest({"А": "00", "Б": "01", "В": "10"}, others=1), "110")
abv = {"А": "00", "Б": "01", "В": "10"}
same("3: пример сумма шести", 6 + best_sum(abv, "ГДЕ"), 17)
same("3: две ветви", best_sum({"А": "00", "Б": "01", "В": "100"}, "ГДЕ"), 9)
deep = {"А": "01", "Б": "10", "В": "110", "Г": "1110", "Д": "11110"}
same("3: делить короткую", best_sum(deep, "ЕЖ", limit=6), 6)
expect(f, f"1. `{shortest({'А': '1', 'Б': '01'}, others=1)}`:")
expect(f, f"2. {1 + best_sum({'А': '1'}, 'БВГ')}:")
expect(f, f"3. {3 + best_sum({'А': '0', 'Б': '10'}, 'ВГДЕЖ')}:")
expect(f, f"4. {best_sum({'А': '00', 'Б': '011', 'В': '10'}, 'ГДЕ')}:")
expect(f, f"5. {best_sum({'А': '1', 'Б': '011', 'В': '0101', 'Г': '01001'}, 'ДЕ', limit=6)}:")
expect(f, f"6. `{shortest({'А': '00', 'Б': '010', 'В': '011', 'Г': '10'}, others=1)}`:")
expect(f, f"7. {7 + best_sum({'К': '0', 'Л': '100', 'М': '110'}, 'НОП')}:")
t38 = dict(zip("АБВГДЕ", "000 001 0100 011 10 1101".split(), strict=True))
expect(f, f"8. {best_sum(t38, 'ЖЗ')}:")
expect(f, f"9. `{shortest({'К': '000', 'Л': '001', 'М': '01', 'Н': '10'}, others=1)}`:")

# --- 4. Длина слова ---
f = "04-dlina-slova.md"
same("4: АААБВ", word_len(BASE, "АААБВ"), 8)
same("4: МОЛОКО", best_word({"О": "00", "К": "01"}, "МОЛОКО", room=True), 13)
same("4: МОЛОКО без Н", best_word({"О": "00", "К": "01"}, "МОЛОКО"), 12)
expect(f, f"1. {word_len(BASE, 'АББАВ')}:")
total = sum(len(c) for c in BASE.values())
expect(f, f"2. {total}, {word_len(BASE, 'ВАГА')} и {len(BASE['В']) * len(BASE['Г'])}:")
expect(f, f"3. {min(4 * 2 + 3, 4 * 3 + 2)}:")
expect(f, f"4. {best_word({'А': '0'}, 'МОМ', room=True)}:")
expect(f, f"5. {best_word({'Н': '00', 'О': '011', 'С': '101'}, 'ТОСТ', room=True)}:")
expect(f, f"6. {best_word({'А': '01', 'Р': '100'}, 'КЕКЛЕТ')}:")
expect(f, f"7. {best_word({'Б': '010', 'В': '011', 'Г': '10'}, 'ЖАБА', room=True)}:")
expect(f, f"8. {best_word({'К': '1', 'Т': '01'}, 'КОЛОТОК')}:")

# --- 5. Форма дерева ---
f = "05-forma-dereva.md"
dez = {"Д": "01", "Е": "10", "Ж": "110"}


def weighted(freq: dict, fixed: dict, limit: int = 5, force=None) -> int:
    letters = "".join(freq)
    return min(
        sum(freq[ch] * len(t[ch]) for ch in letters)
        for t in tables(fixed, letters, False, limit, force)
    )


same("5: пример", weighted({"А": 4, "Б": 3, "В": 2, "Г": 2}, dez), 37)
same("5: А — 00", weighted({"А": 4, "Б": 3, "В": 2, "Г": 2}, dez, force={"А": "00"}), 40)
w1 = {"А": 6, "Б": 2, "В": 1, "Г": 1}
no2 = min(
    sum(w1[ch] * len(t[ch]) for ch in w1)
    for t in tables(dez, "АБВГ")
    if all(len(t[ch]) >= 3 for ch in w1)
)
second = {"М": 4, "И": 2, "Р": 2, "С": 1}
same("5: вторая ловушка", weighted(second, {"Д": "101"}), 19)
same("5: И — 11", weighted(second, {"Д": "101"}, force={"М": "0", "И": "11"}), 20)
expect(f, f"1. {weighted(w1, dez)}:")
expect(f, f"лучшая оценка 6 · 3 + 2 · 3 + 1 · 4 + 1 · 4 = {no2}")
lens3 = {
    tuple(sorted(len(t[ch]) for ch in "ХЦЧ"))
    for t in tables({"А": "0", "Б": "10"}, "ХЦЧ")
    if not has_room(list(t.values()))
}
same("5: три буквы в ветви 11", lens3, {(3, 4, 4)})
expect(f, "2. 3, 4, 4:")
in1 = {"А": "0"}
a = weighted({"Х": 5, "Ц": 1, "Ч": 1, "Ш": 1}, in1)
b = weighted({"Х": 2, "Ц": 2, "Ч": 2, "Ш": 2}, in1)
expect(f, f"3. {a} и {b}:")
expect(f, f"4. {best_word({'Т': '001', 'С': '01'}, 'ПАСПОРТ')}:")
same("5: ПАСПОРТ при П — 1", best_word({"Т": "001", "С": "01"}, "ПАСПОРТ", force={"П": "1"}), 21)
mak = {"Р": "1100", "Н": "1111"}
expect(f, f"5. {best_word(mak, 'МАКАРОНЫ')}:")
same(
    "5: МАКАРОНЫ при А — 0, М — 10",
    best_word(mak, "МАКАРОНЫ", force={"А": "0", "М": "10"}),
    26,
)
expect(f, f"6. {best_word({'Р': '11'}, 'КАРКАС', room=True)}:")
same("5: КАРКАС при К — 0", best_word({"Р": "11"}, "КАРКАС", room=True, force={"К": "0"}), 14)
expect(f, f"даёт {best_word({'Т': '001', 'С': '01'}, 'ПАСПОРТ')}.")

# --- 6. Подсчёт кодов и другие величины ---
f = "06-podschet-i-velichiny.md"


def variants(fixed: list, limit: int, room: bool) -> int:
    return sum(
        1 for s in strings(limit) if fano(fixed + [s]) and (not room or has_room(fixed + [s]))
    )


same("6: пример 7", variants(["0", "10"], 4, False), 7)
same("6: пример 6", variants(["0", "10"], 4, True), 6)
expect(f, f"1. {variants(['1', '01'], 5, False)} вариантов")
expect(f, f"2. {variants(['1', '01'], 5, True)} вариантов")
expect(f, f"3. {variants(['0', '100'], 4, True)}:")
cap = next(tables({"А": "1", "Б": "01"}, "ВГДЕЖ", False, 5, force={"В": "000"}), None)
expect(f, "4. Да:" if cap is not None else "4. Нет")
prod5 = min(
    len(t["Х"]) * len(t["Ц"])
    for t in tables(dict(zip("БВГД", ["10", "110", "1110", "11110"], strict=True)), "ХЦ", limit=6)
)
expect(f, f"5. {prod5}:")
# the shortest word first, then the smallest sum of lengths among those tables
low, s6 = min(
    (word_len(t, "ВБГБД"), sum(len(t[ch]) for ch in "БВГД"))
    for t in tables({"А": "0"}, "БВГД", False, 5)
)
expect(f, f"6. {s6}:")
same("6: длина ВБГБД", low, 15)
kot = tables({"К": "10"}, "ОТ", False, 5)
rec = min((word_len(t, "КОТОК"), int("".join(t[ch] for ch in "КОТОК"), 2)) for t in kot)
expect(f, f"7. {oct(rec[1])[2:]}:")
same("6: восьмеричная пример", oct(int("11010110", 2))[2:], "326")
ones = min(
    sum(t[ch].count("1") for ch in "ВАГ") for t in tables({"А": "01", "Б": "111"}, "ВГ", True, 6)
)
expect(f, f"8. {ones}:")
anti = next(
    s
    for s in strings(4)
    if len(s) > 1 and s not in ("01", "11", "001") and not fano(["01", "11", "001", s])
)
expect(f, f"9. `{anti}`:")
anti_text = next(
    s
    for s in strings(4)
    if len(s) > 1 and s not in ("00", "011", "10") and not fano(["00", "011", "10", s])
)
same("6: код против Фано, пример", anti_text, "01")

# --- 7. Код по записи слова ---
f = "07-kod-po-zapisi.md"


def recover(records: list[tuple[str, str]], limit: int = 4, room: bool = False) -> list[dict]:
    letters = "".join(sorted({ch for w, _ in records for ch in w}))
    return [
        t
        for t in tables({}, letters, room, limit)
        if all("".join(t[ch] for ch in w) == r for w, r in records)
    ]


same("7: ТОПОТ", recover([("ТОПОТ", "100110010")]), [{"О": "0", "П": "110", "Т": "10"}])
same(
    "7: КОТ и ТОК",
    recover([("КОТ", "01011"), ("ТОК", "11100")]),
    [{"К": "0", "О": "10", "Т": "11"}],
)
anana = recover([("АНАНА", "0100100")])
expect(f, f"1. А — `{anana[0]['А']}`, Н — `{anana[0]['Н']}`:" if len(anana) == 1 else "—")
kabak = recover([("КАБАК", "100111010")])
expect(f, f"2. `{kabak[0]['Б']}`:" if len(kabak) == 1 else "—")
lel = {
    word_len(t, "ЛЬЕН")
    for t in tables({"Е": "00", "Р": "011", "Н": "110"}, "ЛЬ", True, 6)
    if word_len(t, "ЛЕЛЬ") == 9
}
expect(f, f"3. {lel.pop()}:" if len(lel) == 1 else "—")
kolos = {
    word_len(t, "ЛОЛ")
    for t in tables({"О": "10", "К": "011"}, "ЛС", True, 6)
    if word_len(t, "КОЛОС") == 11
}
same("7: КОЛОС → ЛОЛ", kolos, {6})
lak = recover([("ЛАК", "110010"), ("КАЛ", "100110")])
expect(f, f"4. `{''.join(lak[0][ch] for ch in 'ЛАЛА')}`:" if len(lak) == 1 else "—")
codes5 = ["0", "01", "011"]
suffix_free = all(not (a != b and b.endswith(a)) for a in codes5 for b in codes5)
same("7: задача 5", (fano(codes5), suffix_free), (False, True))
expect(f, "5. Прямое — нет: `0` — начало `01`. Обратное — да:")


def kraft(lengths) -> Fraction:
    return sum((Fraction(1, 2**n) for n in lengths), Fraction(0))


same("7: Крафт 1", kraft([1, 2, 3, 3, 3]), Fraction(9, 8))
same("7: Крафт 2", kraft([2, 2, 2, 3, 3]), Fraction(1))
same("7: Крафт пример", kraft([2, 2, 2]), Fraction(3, 4))
expect(f, "6. Нет: 1/2 + 1/4 + 3/8 = 9/8 > 1. Да:")
huff = weighted({"А": 5, "Б": 3, "В": 1, "Г": 1}, {}, limit=4)
expect(f, f"7. {huff}:")
same("7: Хаффман пример", weighted({"А": 8, "Б": 4, "В": 2, "Г": 1}, {}, limit=4), 25)

# --- 8. Практика и итог ---
f = "08-praktika-i-itog.md"
expect(f, f"1. `{shortest({'К': '00', 'Л': '01', 'М': '101', 'Н': '11'}, others=1)}`:")
t82 = dict(zip("АБВГД", ["000", "01", "100", "11", "1010"], strict=True))
expect(f, f"2. {best_sum(t82, 'ЕЖЗ')}:")
expect(f, f"3. {best_word({'Л': '0', 'О': '10'}, 'ЛОПАТА')}:")
expect(f, f"4. {best_word({'Р': '011'}, 'ТАРАКАН', room=True)}:")
same(
    "8: ТАРАКАН при Т — 00",
    best_word({"Р": "011"}, "ТАРАКАН", room=True, force={"А": "1", "Т": "00"}),
    17,
)
expect(f, f"5. {best_word({'Р': '11'}, 'КОРОВА', room=True)}:")
same("8: КОРОВА при О — 0", best_word({"Р": "11"}, "КОРОВА", room=True, force={"О": "0"}), 16)

failed = [c for c in checks if not c[2]]
for page, needle, ok in checks:
    if not ok:
        print(f"FAIL {page}: {needle}")
print(f"{len(checks)} checks, {len(failed)} failed")
sys.exit(1 if failed else 0)
