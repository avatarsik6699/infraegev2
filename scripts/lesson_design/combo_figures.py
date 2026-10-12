"""Figures of topic 8 «Перебор слов и системы счисления» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture:
the words come from itertools, the counts from the words.

``cmb_tree(first, second)`` — the choices of a two-symbol code as a tree:
every first symbol branches into every second one, a · b leaves.
``cmb_shrink(alphabet, words)`` — words without repeats: after each chosen
letter the set of free letters changes, but its size is always one less.
``cmb_or_grid(alphabet, letter)`` — three-letter words as a grid «first
letter × last letter»: the row and the column of the letter overlap in a cell.
``cmb_places(n, k, letter)`` — every way to choose k places of n: C(n, k) rows.
``cmb_labels(word)`` — a word with repeated letters and its labelled versions:
swapping equal letters gives the same word.
``cmb_gaps(others, slots, letter)`` — the gaps around the other letters and
the chosen gaps filled with the letter: two letters in different gaps are
never neighbours.
``cmb_one_order(digits)`` — all orders of a set of digits; only one of them
is strictly decreasing.
``cmb_counter(alphabet, length)`` — the alphabetical list as a counter: the
number, the word, the digits of its record and its value.
``cmb_blocks(alphabet, length, prefix)`` — the list split into blocks by the
first letters, zoomed to the block of the prefix.
``cmb_renumber(alphabet, length, letter, k)`` — the full list and the list of
the words with k letters renumbered after the selection.
``cmb_states_stepper(alphabet, letter, length)`` — counting the words without
two letters in a row by states: words ending with the letter and the others.
"""

from __future__ import annotations

from itertools import combinations, permutations, product
from math import comb

from figures import ACCENT, FAINT, INK, MUTED, WASH, _arrow, _box, _stepper, _text, ru_count

SUB = str.maketrans("0123456789", "₀₁₂₃₄₅₆₇₈₉")
SUP = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")


def _svg(h: float, label: str) -> str:
    return f'<svg viewBox="0 0 660 {h:.0f}" role="img" aria-label="{label}">'


def _chip(x, y, ch, size=30, hot=False, muted=False, fill=False) -> str:
    stroke = ACCENT if hot else (FAINT if muted else INK)
    return _box(
        x, y, size, size, stroke, WASH if (hot or fill) else "#fff", rx=5, sw=2 if hot else 1.25
    ) + _text(x + size / 2, y + size * 0.7, ch, 16, MUTED if muted else INK, "middle", 600)


def _words(alphabet: str, length: int) -> list[str]:
    return ["".join(p) for p in product(alphabet, repeat=length)]


def _to_base(value: int, base: int, length: int) -> str:
    digits = ""
    for _ in range(length):
        digits = str(value % base) + digits
        value //= base
    return digits


# --- the rule of product as a tree ------------------------------------------------


def cmb_tree(first: str = "АБ", second: str = "012") -> str:
    """Every first symbol branches into every second one: a · b codes."""
    leaves = len(first) * len(second)
    step = 30
    top = 44
    h = top + leaves * step + 26
    out = [_svg(h, f"Дерево выбора двухсимвольного кода: {leaves} вариантов")]
    root_y = top + leaves * step / 2 - step / 2
    out.append(f'<circle cx="40" cy="{root_y:.1f}" r="5" fill="{INK}"/>')
    out.append(_text(40, root_y - 14, "начало", 12, MUTED, "middle"))
    out.append(_text(200, 16, "первый символ", 12, MUTED, "middle"))
    out.append(_text(380, 16, "второй символ", 12, MUTED, "middle"))
    out.append(_text(500, 16, "код", 12, MUTED, "middle"))
    k = 0
    for i, a in enumerate(first):
        ys = [top + (i * len(second) + j) * step for j in range(len(second))]
        my = sum(ys) / len(ys)
        out.append(
            f'<line x1="45" y1="{root_y:.1f}" x2="186" y2="{my:.1f}" stroke="{INK}" '
            'stroke-width="1.5"/>'
        )
        out.append(_chip(186, my - 15, a))
        for j, b in enumerate(second):
            y = ys[j]
            out.append(
                f'<line x1="216" y1="{my:.1f}" x2="366" y2="{y:.1f}" stroke="{MUTED}" '
                'stroke-width="1.25"/>'
            )
            out.append(_chip(366, y - 13, b, 26))
            out.append(_text(500, y + 5, a + b, 15, INK, "middle", 600))
            k += 1
    out.append(
        _text(
            600,
            h - 12,
            f"{len(first)} · {len(second)} = {k}",
            15,
            ACCENT,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- words without repeats: the set of free letters changes, its size does not ---


def cmb_shrink(alphabet: str = "АОБВГ", words: tuple = ("АБ", "ГО")) -> str:
    """For each chosen beginning: the free letters before every place."""
    size, gap = 24, 3
    col_w = 210
    x0 = 16
    row_h = 74
    h = 34 + len(words) * row_h
    out = [_svg(h, "Слова без повторений: число свободных букв на каждом месте")]
    places = len(words[0]) + 1
    for p in range(places):
        free = len(alphabet) - p
        out.append(
            _text(
                x0 + p * col_w,
                18,
                f"место {p + 1}: " + ru_count(free, "буква", "буквы", "букв"),
                13,
                MUTED,
            )
        )
    for r, word in enumerate(words):
        y = 34 + r * row_h
        for p in range(places):
            used = word[:p]
            free = [ch for ch in alphabet if ch not in used]
            chosen = word[p] if p < len(word) else None
            for j, ch in enumerate(free):
                out.append(_chip(x0 + p * col_w + j * (size + gap), y, ch, size, hot=ch == chosen))
            note = f"выбрана {chosen}" if chosen else f"после {used}: {len(free)}"
            out.append(_text(x0 + p * col_w, y + size + 18, note, 12, MUTED))
    out.append("</svg>")
    return "".join(out)


# --- «or»: the row and the column overlap -------------------------------------------


def cmb_or_grid(alphabet: str = "АОБВГ", letter: str = "А") -> str:
    """Three-letter words as cells «first × last»; every cell holds m words."""
    m = len(alphabet)
    cell = 36
    x0, y0 = 120, 48
    words = _words(alphabet, 3)
    row = sum(w[0] == letter for w in words)
    col = sum(w[-1] == letter for w in words)
    both = sum(w[0] == letter and w[-1] == letter for w in words)
    h = y0 + m * cell + 30
    out = [_svg(h, f"Трёхбуквенные слова: начинаются с {letter} или заканчиваются на {letter}")]
    out.append(_text(x0 + m * cell / 2, 18, "последняя буква", 12, MUTED, "middle"))
    out.append(_text(16, y0 + m * cell / 2, "первая буква", 12, MUTED))
    li = alphabet.index(letter)
    for i, a in enumerate(alphabet):
        out.append(_text(x0 - 12, y0 + i * cell + cell * 0.62, a, 14, INK, "middle", 600))
        out.append(_text(x0 + i * cell + cell / 2, y0 - 10, a, 14, INK, "middle", 600))
        for j in range(m):
            inside = i == li or j == li
            out.append(
                _box(
                    x0 + j * cell,
                    y0 + i * cell,
                    cell,
                    cell,
                    INK if inside else FAINT,
                    WASH if inside else "#fff",
                    rx=0,
                    sw=1.25,
                )
            )
            n = sum(w[0] == a and w[-1] == alphabet[j] for w in words)
            out.append(
                _text(
                    x0 + j * cell + cell / 2,
                    y0 + i * cell + cell * 0.64,
                    str(n),
                    13,
                    INK if inside else MUTED,
                    "middle",
                )
            )
    out.append(_box(x0 + li * cell, y0 + li * cell, cell, cell, ACCENT, "none", rx=0, sw=2.5))
    tx = x0 + m * cell + 40
    out.append(_text(tx, y0 + 18, f"строка {letter}: {row} слов", 14, INK))
    out.append(_text(tx, y0 + 44, f"столбец {letter}: {col} слов", 14, INK))
    out.append(_text(tx, y0 + 70, f"на пересечении: {both} слов", 14, ACCENT, weight=600))
    out.append(
        _text(tx, y0 + 108, f"{row} + {col} − {both} = {row + col - both}", 16, INK, weight=600)
    )
    out.append("</svg>")
    return "".join(out)


# --- choosing k places of n --------------------------------------------------------------


def cmb_places(n: int = 5, k: int = 2, letter: str = "А") -> str:
    """Every set of k places of n as a row of cells with the letter on them."""
    sets = list(combinations(range(1, n + 1), k))
    per_col = (len(sets) + 1) // 2
    size, gap = 26, 3
    row_h = 34
    col_w = 320
    h = 30 + per_col * row_h + 30
    out = [_svg(h, f"Все способы выбрать {k} места из {n}: {len(sets)}")]
    for c in range(2):
        out.append(_text(16 + c * col_w, 18, f"{k} {letter} на {n} местах", 12, MUTED))
    for idx, places in enumerate(sets):
        c, r = divmod(idx, per_col)
        x, y = 16 + c * col_w, 28 + r * row_h
        for p in range(1, n + 1):
            on = p in places
            out.append(
                _box(
                    x + (p - 1) * (size + gap),
                    y,
                    size,
                    size,
                    INK if on else FAINT,
                    WASH if on else "#fff",
                    rx=4,
                    sw=1.25,
                )
            )
            if on:
                out.append(
                    _text(
                        x + (p - 1) * (size + gap) + size / 2,
                        y + 18,
                        letter,
                        14,
                        INK,
                        "middle",
                        600,
                    )
                )
        out.append(
            _text(
                x + n * (size + gap) + 12,
                y + 18,
                "места " + " и ".join(map(str, places)),
                13,
                MUTED,
            )
        )
    ordered = len(list(permutations(range(n), k)))
    out.append(
        _text(
            330,
            h - 10,
            f"{ordered} упорядоченных выборов / {k}! = {len(sets)} = C"
            f"{str(n).translate(SUB)}{str(k).translate(SUP)}",
            14,
            ACCENT,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- labelled equal letters ----------------------------------------------------------------


def _labelled(word: str) -> list[list[str]]:
    """Every way to number the equal letters of the word."""
    groups = {ch: [i for i, c in enumerate(word) if c == ch] for ch in dict.fromkeys(word)}
    repeated = [ch for ch, pos in groups.items() if len(pos) > 1]
    variants = []
    for orders in product(*(permutations(range(1, len(groups[ch]) + 1)) for ch in repeated)):
        cells = list(word)
        for ch, order in zip(repeated, orders, strict=True):
            for pos, num in zip(groups[ch], order, strict=True):
                cells[pos] = ch + str(num).translate(SUB)
        variants.append(cells)
    return variants


def cmb_labels(word: str = "ТОПОТ") -> str:
    """Labelled versions of a word collapse into one ordinary word."""
    variants = _labelled(word)
    size, gap = 34, 4
    row_h = 44
    h = 30 + len(variants) * row_h + 12
    out = [_svg(h, f"Подписанные одинаковые буквы слова {word}")]
    out.append(_text(16, 18, "подписанные буквы", 12, MUTED))
    out.append(_text(430, 18, "обычное слово", 12, MUTED))
    wy = 30 + (len(variants) * row_h - row_h) / 2
    for r, cells in enumerate(variants):
        y = 30 + r * row_h
        for j, ch in enumerate(cells):
            out.append(_box(16 + j * (size + gap), y, size, size, INK, "#fff", rx=5, sw=1.25))
            out.append(_text(16 + j * (size + gap) + size / 2, y + 23, ch, 15, INK, "middle", 600))
        x_end = 16 + len(cells) * (size + gap) + 6
        out.append(_arrow(x_end, y + size / 2, 422, wy + size / 2, MUTED))
    for j, ch in enumerate(word):
        out.append(_box(430 + j * (size + gap), wy, size, size, ACCENT, WASH, rx=5, sw=2))
        out.append(_text(430 + j * (size + gap) + size / 2, wy + 23, ch, 16, INK, "middle", 600))
    out.append(
        _text(430, wy + size + 26, f"{len(variants)} подписанных → 1 слово", 13, ACCENT, weight=600)
    )
    out.append("</svg>")
    return "".join(out)


# --- gaps around the other letters ------------------------------------------------------------


def cmb_gaps(others: str = "БВГБ", slots: tuple = (1, 4), letter: str = "А") -> str:
    """The other letters, the gaps around them and the chosen gaps filled."""
    size, slot = 38, 30
    n_gaps = len(others) + 1
    width = len(others) * size + n_gaps * slot
    x0 = (660 - width) / 2
    out = [_svg(250, f"Промежутки вокруг букв {others}")]
    out.append(_text(16, 20, f"буквы без {letter} и {n_gaps} промежутков", 12, MUTED))
    x = x0
    word = ""
    for g in range(n_gaps):
        chosen = g in slots
        out.append(
            _box(
                x + 3,
                40,
                slot - 6,
                size,
                ACCENT if chosen else MUTED,
                WASH if chosen else "#fff",
                rx=4,
                sw=2 if chosen else 1,
                dashed=not chosen,
            )
        )
        out.append(_text(x + slot / 2, 40 + size + 16, str(g + 1), 12, MUTED, "middle"))
        if chosen:
            out.append(_text(x + slot / 2, 40 + size * 0.68, letter, 15, INK, "middle", 600))
            word += letter
        x += slot
        if g < len(others):
            out.append(_box(x, 40, size, size, INK, "#fff", rx=5, sw=1.5))
            out.append(_text(x + size / 2, 40 + size * 0.68, others[g], 17, INK, "middle", 600))
            word += others[g]
            x += size
    out.append(_text(16, 140, "получилось слово", 12, MUTED))
    wx = (660 - len(word) * (size + 4)) / 2
    for j, ch in enumerate(word):
        hot = ch == letter
        out.append(
            _box(
                wx + j * (size + 4),
                150,
                size,
                size,
                ACCENT if hot else INK,
                WASH if hot else "#fff",
                rx=5,
                sw=2 if hot else 1.5,
            )
        )
        out.append(
            _text(wx + j * (size + 4) + size / 2, 150 + size * 0.68, ch, 17, INK, "middle", 600)
        )
    k = len(slots)
    out.append(
        _text(
            330,
            236,
            f"выбрать {k} промежутка из {n_gaps}: C{str(n_gaps).translate(SUB)}"
            f"{str(k).translate(SUP)} = {comb(n_gaps, k)}",
            14,
            ACCENT,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- one order of a set of digits -----------------------------------------------------------


def cmb_one_order(digits: tuple = (5, 3, 2, 0)) -> str:
    """All orders of the digits; the strictly decreasing one is accented."""
    orders = list(permutations(digits))
    cols = 6
    rows = (len(orders) + cols - 1) // cols
    cw, rh = 100, 36
    h = 34 + rows * rh + 30
    out = [_svg(h, f"Все расстановки цифр {', '.join(map(str, digits))}")]
    out.append(
        _text(
            16,
            18,
            f"набор {{{', '.join(map(str, sorted(digits)))}}}: {len(orders)} расстановки",
            12,
            MUTED,
        )
    )
    good = 0
    for idx, order in enumerate(sorted(orders)):
        r, c = divmod(idx, cols)
        x, y = 16 + c * cw, 30 + r * rh
        down = all(order[i] > order[i + 1] for i in range(len(order) - 1))
        good += down
        out.append(
            _box(
                x,
                y,
                cw - 12,
                rh - 8,
                ACCENT if down else FAINT,
                WASH if down else "#fff",
                rx=5,
                sw=2 if down else 1,
            )
        )
        out.append(
            _text(
                x + (cw - 12) / 2,
                y + 20,
                "".join(map(str, order)),
                15,
                INK if down else MUTED,
                "middle",
                600 if down else 400,
            )
        )
    out.append(
        _text(330, h - 10, f"строго убывает {good} из {len(orders)}", 14, ACCENT, "middle", 600)
    )
    out.append("</svg>")
    return "".join(out)


# --- the list as a counter ---------------------------------------------------------------------


def cmb_counter(alphabet: str = "АБВ", length: int = 3, head: int = 10) -> str:
    """Number, word, digits and value; the digits changed since the row above
    are accented."""
    base = len(alphabet)
    words = _words(alphabet, length)
    rows = list(range(head)) + [len(words) - 1]
    rh = 22
    h = 44 + (len(rows) + 1) * rh + 8
    out = [_svg(h, f"Список слов из {alphabet} как счётчик")]
    xs = (90, 210, 340, 470)
    for x, title in zip(xs, ("номер", "слово", "запись", "значение"), strict=True):
        out.append(_text(x, 20, title, 12, MUTED, "middle"))
    out.append(f'<line x1="40" y1="30" x2="520" y2="30" stroke="{FAINT}"/>')
    y = 48
    prev = None
    for r in rows:
        if prev is not None and r != prev + 1:
            out.append(_text(xs[1], y, "…", 14, MUTED, "middle"))
            y += rh
        rec = _to_base(r, base, length)
        out.append(_text(xs[0], y, str(r + 1), 14, INK, "middle"))
        out.append(_text(xs[1], y, words[r], 15, INK, "middle", 600))
        old = _to_base(r - 1, base, length) if r > 0 and prev == r - 1 else rec
        x_d = xs[2] - (length - 1) * 7
        for j, ch in enumerate(rec):
            changed = ch != old[j]
            out.append(
                _text(
                    x_d + j * 14,
                    y,
                    ch,
                    15,
                    ACCENT if changed else INK,
                    "middle",
                    700 if changed else 400,
                )
            )
        out.append(_text(xs[3], y, str(r), 14, MUTED, "middle"))
        y += rh
        prev = r
    out.append(_text(580, 48, f"основание {base}", 12, MUTED, "middle"))
    out.append(_text(580, 66, "номер =", 12, MUTED, "middle"))
    out.append(_text(580, 82, "значение + 1", 12, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


# --- blocks of the list by the first letters -----------------------------------------------


def cmb_blocks(alphabet: str = "АБВ", length: int = 4, prefix: str = "БА") -> str:
    """The list as a bar; each level splits the block of the prefix by the next letter."""
    base = len(alphabet)
    words = _words(alphabet, length)
    left, right = 24, 636
    bar_h = 34
    level_h = 92
    h = 24 + len(prefix) * level_h - 20
    out = [_svg(h, f"Блоки списка по началу {prefix}")]
    lo, hi = 1, len(words)
    x_lo, x_hi = left, right
    for level in range(1, len(prefix) + 1):
        y = 24 + (level - 1) * level_h
        part = (hi - lo + 1) // base
        w = (x_hi - x_lo) / base if level == 1 else (right - left) / base
        start_x = left
        if level > 1:
            out.append(
                f'<line x1="{x_lo:.1f}" y1="{y - level_h + bar_h:.1f}" x2="{left}" '
                f'y2="{y:.1f}" stroke="{FAINT}"/>'
                f'<line x1="{x_hi:.1f}" y1="{y - level_h + bar_h:.1f}" x2="{right}" '
                f'y2="{y:.1f}" stroke="{FAINT}"/>'
            )
        next_lo = next_hi = 0
        next_x = (0.0, 0.0)
        for i, ch in enumerate(alphabet):
            b_lo = lo + i * part
            b_hi = b_lo + part - 1
            beginning = prefix[: level - 1] + ch
            first = words.index(beginning + alphabet[0] * (length - level)) + 1
            assert first == b_lo
            hot = beginning == prefix[:level]
            final = hot and level == len(prefix)
            x = start_x + i * w
            out.append(
                _box(
                    x + 2,
                    y,
                    w - 4,
                    bar_h,
                    ACCENT if final else INK,
                    WASH if hot else "#fff",
                    rx=4,
                    sw=2 if final else 1.25,
                )
            )
            out.append(
                _text(
                    x + w / 2,
                    y + 22,
                    f"{beginning}…: {b_lo}–{b_hi}",
                    14,
                    INK,
                    "middle",
                    600 if hot else 400,
                )
            )
            if hot:
                next_lo, next_hi = b_lo, b_hi
                next_x = (x + 2, x + w - 2)
        out.append(_text(left, y + bar_h + 18, f"{base} блока по {part} слов", 12, MUTED))
        lo, hi = next_lo, next_hi
        x_lo, x_hi = next_x
    out.append("</svg>")
    return "".join(out)


# --- full list and renumbered list -----------------------------------------------------------


def cmb_renumber(alphabet: str = "АБ", length: int = 2, letter: str = "А", k: int = 1) -> str:
    """Old numbers of the full list, new numbers after keeping the words with k letters."""
    words = _words(alphabet, length)
    rh = 40
    h = 40 + len(words) * rh + 10
    out = [_svg(h, "Полный список и список после отбора")]
    out.append(_text(110, 20, "полный список", 12, MUTED, "middle"))
    out.append(_text(470, 20, f"только слова с {k} {letter}, заново", 12, MUTED, "middle"))
    new = 0
    for i, w in enumerate(words):
        y = 34 + i * rh
        keep = w.count(letter) == k
        out.append(_text(60, y + 21, str(i + 1), 14, INK if keep else MUTED, "middle"))
        out.append(_box(84, y, 90, 30, INK if keep else FAINT, "#fff", rx=5, sw=1.25))
        out.append(_text(129, y + 21, w, 15, INK if keep else MUTED, "middle", 600))
        if keep:
            ny = 34 + new * rh
            new += 1
            out.append(_arrow(180, y + 15, 412, ny + 15, MUTED))
            out.append(_box(420, ny, 90, 30, ACCENT, WASH, rx=5, sw=2))
            out.append(_text(465, ny + 21, w, 15, INK, "middle", 600))
            out.append(_text(540, ny + 21, f"№ {new} (был {i + 1})", 14, ACCENT, weight=600))
    out.append("</svg>")
    return "".join(out)


# --- counting by states ---------------------------------------------------------------------


def cmb_states_frames(alphabet: str = "АБВГ", letter: str = "А", length: int = 5):
    """Frames: the table «length → a, b, total» grows row by row."""
    others = len(alphabet) - 1
    rows = []
    a, b = 1, others
    rows.append((1, a, b))
    for n in range(2, length + 1):
        a, b = b, others * (a + b)
        rows.append((n, a, b))
    # the totals agree with a full search of the words
    for n, a, b in rows:
        assert a + b == sum(letter * 2 not in w for w in _words(alphabet, n))
    frames = []
    xs = (110, 260, 420, 560)
    titles = ("длина", f"на {letter} (a)", "на другую (b)", "всего")
    for upto in range(len(rows)):
        out = [f'<svg viewBox="0 0 660 {60 + len(rows) * 34:.0f}" aria-hidden="true">']
        for x, t in zip(xs, titles, strict=True):
            out.append(_text(x, 22, t, 12, MUTED, "middle"))
        out.append(f'<line x1="60" y1="32" x2="610" y2="32" stroke="{FAINT}"/>')
        for r in range(upto + 1):
            n, a, b = rows[r]
            y = 56 + r * 34
            hot = r == upto
            color = INK if hot else MUTED
            weight = 600 if hot else 400
            out.append(_text(xs[0], y, str(n), 15, color, "middle", weight))
            out.append(_text(xs[1], y, str(a), 15, ACCENT if hot else color, "middle", weight))
            out.append(_text(xs[2], y, str(b), 15, ACCENT if hot else color, "middle", weight))
            out.append(_text(xs[3], y, str(a + b), 15, color, "middle", weight))
            if hot and r > 0:
                out.append(_arrow(xs[2] - 20, y - 30, xs[1] + 24, y - 8, MUTED))
                out.append(_arrow(xs[1] + 30, y - 30, xs[2] - 26, y - 8, MUTED))
                out.append(_arrow(xs[2], y - 26, xs[2], y - 14, MUTED))
        out.append("</svg>")
        n, a, b = rows[upto]
        if upto == 0:
            caption = (
                f"Длина 1: на {letter} одно слово, на другую букву — {b}. "
                "Дальше каждая строка получается из предыдущей."
            )
        else:
            pa, pb = rows[upto - 1][1:]
            caption = (
                f"Длина {n}: a = {a} — {letter} дописываем только к словам, которые "
                f"кончаются не на {letter} (прежнее b); b = {others} · ({pa} + {pb}) = {b} — "
                f"другую букву дописываем к любому слову. Всего {a + b}."
            )
        frames.append(("".join(out), caption))
    return frames


def cmb_states_stepper(alphabet: str = "АБВГ", letter: str = "А", length: int = 5) -> str:
    return _stepper(cmb_states_frames(alphabet, letter, length))


COMBO_FIGURES: dict = {
    "cmb_tree": cmb_tree,
    "cmb_shrink": cmb_shrink,
    "cmb_or_grid": cmb_or_grid,
    "cmb_places": cmb_places,
    "cmb_labels": cmb_labels,
    "cmb_gaps": cmb_gaps,
    "cmb_one_order": cmb_one_order,
    "cmb_counter": cmb_counter,
    "cmb_blocks": cmb_blocks,
    "cmb_renumber": cmb_renumber,
    "cmb_states_stepper": cmb_states_stepper,
}
COMBO_STEPPERS: dict = {
    "cmb_states_stepper": cmb_states_frames,
}
COMBO_WIDGETS: dict = {}
COMBO_SCRIPTS: dict = {}
