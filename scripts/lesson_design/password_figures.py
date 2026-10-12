"""Figures of topic 11 «Объём информации: пароли и записи» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.
All keys start with ``pwd_`` so they never clash with other topics.

``pwd_bytes(count, bits)`` — count passwords of the same code length: whole
bytes for every password against all codes one after another.
``pwd_parts(parts, names, common)`` — parts of one record in bits: written one
after another in whole bytes, or whole bytes for every part; ``common`` adds a
row where all symbols share one alphabet.
``pwd_range(i, nbytes, mode)`` — the line of bits with byte boundaries and the
multiples of i: which code lengths L · i give exactly nbytes bytes ("exact"),
at most nbytes ("upper") or need more than nbytes − 1 ("lower").
``pwd_groups(size, group, head)`` — a message cut into groups of at most
``group`` bytes, each with its own header.
``pwd_code(symbols, bits)`` — one password: the codes of its symbols one after
another over the byte grid; a code may cross a byte boundary, the tail of the
last byte stays empty.
``pwd_number(j)`` — j bits hold the codes 0 … 2ʲ − 1: 2ʲ objects fit, the
numbers 1 … 2ʲ in binary do not — the last one needs bit j + 1.
Topic 7 builders (``vol_ladder``, ``vol_fit``) are reused as they are.
"""

from __future__ import annotations

from math import ceil

from figures import ACCENT, FAINT, INK, MUTED, WASH, _text
from volume_figures import W, _line, _rect, _svg, num


def _ru_bytes(n: int) -> str:
    """1 байт, 2 байта, 5 байтов — as the lessons write it."""
    if n % 10 == 1 and n % 100 != 11:
        return f"{num(n)} байт"
    if n % 10 in (2, 3, 4) and n % 100 not in (12, 13, 14):
        return f"{num(n)} байта"
    return f"{num(n)} байтов"


def _ru_bits(n: int) -> str:
    if n % 10 == 1 and n % 100 != 11:
        return f"{num(n)} бит"
    if n % 10 in (2, 3, 4) and n % 100 not in (12, 13, 14):
        return f"{num(n)} бита"
    return f"{num(n)} битов"


def _byte_grid(x0: float, y: float, nbytes: int, unit: float, h: float = 26) -> list[str]:
    """Outlines of nbytes bytes, each 8 · unit wide."""
    return [_rect(x0 + b * 8 * unit, y, 8 * unit, h, "none", INK, 1, rx=0) for b in range(nbytes)]


def _segment(x0: float, y: float, start: int, length: int, unit: float, k: int, h: float = 26):
    """Bits start … start + length of one code, shaded by its number k."""
    fill = WASH if k % 2 == 0 else FAINT
    return (
        f'<rect x="{x0 + start * unit:.1f}" y="{y + 3:.1f}" width="{length * unit:.1f}" '
        f'height="{h - 6:.1f}" fill="{fill}" stroke="none"/>'
    )


# --- whole bytes for every password ----------------------------------------------------


def pwd_bytes(count: int = 8, bits: int = 35) -> str:
    """count codes of ``bits`` bits: ⌈bits / 8⌉ bytes each against all of them in a row."""
    own = ceil(bits / 8)
    packed = ceil(count * bits / 8)
    left = 24
    unit = (W - 2 * left) / (count * own * 8)
    out = _svg(236, f"{count} паролей по {bits} бит: свои байты и подряд")
    out.append(
        _text(
            left,
            22,
            f"{count} паролей по {_ru_bits(bits)}; клетка — один байт, заливка — биты кода",
            13,
            MUTED,
        )
    )
    y1 = 58
    out.append(_text(left, y1 - 10, "каждому паролю свои байты", 14, INK, weight=600))
    for k in range(count):
        x = left + k * own * 8 * unit
        out.append(_segment(x, y1, 0, bits, unit, k))
        out.append(_rect(x + bits * unit, y1 + 3, (own * 8 - bits) * unit, 20, "none", ACCENT, 1))
    out += _byte_grid(left, y1, count * own, unit)
    for k in range(count + 1):
        x = left + k * own * 8 * unit
        out.append(_line(x, y1 - 4, x, y1 + 30, INK, 2))
    out.append(
        _text(
            left,
            y1 + 50,
            f"{count} · ⌈{bits} / 8⌉ = {count} · {own} = {_ru_bytes(count * own)}; "
            f"пустует по {_ru_bits(own * 8 - bits)} в каждом пароле",
            13,
            ACCENT,
        )
    )
    y2 = 150
    out.append(_text(left, y2 - 10, "все пароли подряд, байты — общей записи", 14, INK, weight=600))
    for k in range(count):
        out.append(_segment(left, y2, k * bits, bits, unit, k))
    tail = packed * 8 - count * bits
    if tail:
        out.append(_rect(left + count * bits * unit, y2 + 3, tail * unit, 20, "none", ACCENT, 1))
    out += _byte_grid(left, y2, packed, unit)
    out.append(
        _text(
            left,
            y2 + 50,
            f"⌈{count} · {bits} / 8⌉ = ⌈{num(count * bits)} / 8⌉ = {_ru_bytes(packed)}",
            13,
            MUTED,
        )
    )
    out.append(
        _text(
            W / 2,
            226,
            "разница — пустые хвосты последних байтов каждого пароля",
            12,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- parts of a record in bits -----------------------------------------------------------


def pwd_parts(parts=(35, 13), names=("пароль", "сведения"), common=None) -> str:
    """Parts in bits: one after another in whole bytes, or whole bytes for each part.

    ``common`` = (symbols, alphabet): one code length for all symbols of the record.
    """
    total = sum(parts)
    together = ceil(total / 8)
    each = [ceil(p / 8) for p in parts]
    rows = [together * 8, sum(each) * 8]
    if common:
        symbols, alphabet = common
        i = (alphabet - 1).bit_length()
        rows.append(ceil(symbols * i / 8) * 8)
    left = 24
    unit = min(11.0, (W - 2 * left) / max(rows))
    height = 46 + 92 * len(rows)
    out = _svg(height, "Части записи в битах и целые байты")
    out.append(
        _text(
            left,
            22,
            " + ".join(f"{n} — {_ru_bits(p)}" for n, p in zip(names, parts, strict=True))
            + "; клетка — байт",
            13,
            MUTED,
        )
    )
    y = 60
    out.append(_text(left, y - 10, "части подряд, байты — всей записи", 14, INK, weight=600))
    start = 0
    for k, p in enumerate(parts):
        out.append(_segment(left, y, start, p, unit, k))
        start += p
    if together * 8 > total:
        out.append(
            _rect(left + total * unit, y + 3, (together * 8 - total) * unit, 20, "none", ACCENT, 1)
        )
    out += _byte_grid(left, y, together, unit)
    out.append(
        _text(
            left,
            y + 48,
            f"⌈({' + '.join(map(str, parts))}) / 8⌉ = ⌈{total} / 8⌉ = {_ru_bytes(together)}",
            13,
            MUTED,
        )
    )
    y += 92
    out.append(_text(left, y - 10, "каждой части свои байты", 14, INK, weight=600))
    x = left
    for k, p in enumerate(parts):
        out.append(_segment(x, y, 0, p, unit, k))
        if each[k] * 8 > p:
            out.append(_rect(x + p * unit, y + 3, (each[k] * 8 - p) * unit, 20, "none", ACCENT, 1))
        out += _byte_grid(x, y, each[k], unit)
        out.append(_line(x, y - 4, x, y + 30, INK, 2))
        x += each[k] * 8 * unit
    out.append(_line(x, y - 4, x, y + 30, INK, 2))
    sums = " + ".join(f"⌈{p} / 8⌉" for p in parts)
    out.append(
        _text(
            left,
            y + 48,
            f"{sums} = {' + '.join(map(str, each))} = {_ru_bytes(sum(each))}",
            13,
            MUTED,
        )
    )
    if common:
        symbols, alphabet = common
        i = (alphabet - 1).bit_length()
        bits = symbols * i
        nbytes = ceil(bits / 8)
        y += 92
        out.append(
            _text(
                left,
                y - 10,
                f"один код на все {symbols} символов: алфавит {alphabet}",
                14,
                INK,
                weight=600,
            )
        )
        for k in range(symbols):
            out.append(_segment(left, y, k * i, i, unit, k))
        if nbytes * 8 > bits:
            out.append(
                _rect(left + bits * unit, y + 3, (nbytes * 8 - bits) * unit, 20, "none", ACCENT, 1)
            )
        out += _byte_grid(left, y, nbytes, unit)
        out.append(
            _text(
                left,
                y + 48,
                f"{symbols} · {i} = {bits} бита, ⌈{bits} / 8⌉ = {_ru_bytes(nbytes)}",
                13,
                MUTED,
            )
        )
    out.append(
        _text(
            W / 2,
            height - 10,
            "обведённые клетки — выделенные, но пустые биты",
            12,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- which code lengths fit the bytes ------------------------------------------------------


def pwd_range(i: int = 5, nbytes: int = 7, mode: str = "exact") -> str:
    """Bits on a line with byte boundaries; the multiples L · i of the code length.

    ``exact`` — L · i in (8(B − 1); 8B]; ``upper`` — L · i ≤ 8B;
    ``lower`` — L · i > 8(B − 1).
    """
    lo_bit, hi_bit = 8 * (nbytes - 2), 8 * (nbytes + 1)
    left, right, y = 40, 620, 84
    unit = (right - left) / (hi_bit - lo_bit)

    def x(b):
        return left + (b - lo_bit) * unit

    a, b = 8 * (nbytes - 1), 8 * nbytes
    ok = {
        "exact": lambda v: a < v <= b,
        "upper": lambda v: v <= b,
        "lower": lambda v: v > a,
    }[mode]
    title = {
        "exact": f"ровно {_ru_bytes(nbytes)}: {a} < L · {i} ≤ {b}",
        "upper": f"не более {_ru_bytes(nbytes)}: L · {i} ≤ {b}",
        "lower": f"больше {_ru_bytes(nbytes - 1)}: L · {i} > {a}",
    }[mode]
    out = _svg(200, f"Длины кода L · {i} и границы байтов")
    out.append(
        _text(16, 22, f"биты на прямой, засечки — границы байтов; точка — L · {i}", 13, MUTED)
    )
    # the allowed stretch
    xa = x(a) if mode != "upper" else left
    xb = x(b) if mode != "lower" else right
    out.append(_rect(xa, y - 16, xb - xa, 32, WASH, "none", 0, rx=2))
    out.append(_line(left, y, right, y, INK, 1.5))
    for k in range(lo_bit, hi_bit + 1, 8):
        out.append(
            _line(
                x(k), y - 22, x(k), y + 22, INK if k in (a, b) else MUTED, 2 if k in (a, b) else 1
            )
        )
        out.append(_text(x(k), y + 40, str(k), 13, INK, "middle", 600 if k in (a, b) else 400))
        out.append(_text(x(k), y + 58, f"{k // 8} Б", 12, MUTED, "middle"))
    first = -(-lo_bit // i)
    fits = [L for L in range(first, hi_bit // i + 1) if ok(L * i)]
    for L in range(first, hi_bit // i + 1):
        v = L * i
        hit = ok(v)
        out.append(
            f'<circle cx="{x(v):.1f}" cy="{y}" r="{6 if hit else 4.5}" '
            f'fill="{ACCENT if hit else "#fff"}" stroke="{ACCENT if hit else INK}" stroke-width="1.5"/>'
        )
        out.append(
            _text(
                x(v),
                y - 28,
                f"L = {L}",
                12,
                ACCENT if hit else MUTED,
                "middle",
                600 if hit else 400,
            )
        )
    if mode == "exact":
        note = f"подходят L = {', '.join(map(str, fits))}; левая граница {a} не входит"
    elif mode == "upper":
        best = max(fits)
        note = f"наибольшая длина L = {best}: {best} · {i} = {best * i} ≤ {b} < {(best + 1) * i}"
    else:
        least = min(fits)
        note = f"наименьшая длина L = {least}: {(least - 1) * i} ≤ {a} < {least * i}"
    out.append(_text(16, 164, title, 14, INK, weight=600))
    out.append(_text(16, 188, note, 13, ACCENT))
    out.append("</svg>")
    return "".join(out)


# --- groups with headers -----------------------------------------------------------------------


def pwd_groups(size: int = 10, group: int = 4, head: int = 1) -> str:
    """A message of ``size`` bytes in groups of at most ``group`` bytes plus a header each."""
    groups = ceil(size / group)
    total = size + groups * head
    left = 24
    unit = min(40.0, (W - 2 * left - 6 * groups) / total)
    out = _svg(164, f"Сообщение {size} байт группами по {group} с заголовками")
    out.append(
        _text(
            left,
            22,
            f"сообщение {_ru_bytes(size)}, группа — не больше {group}, заголовок — {_ru_bytes(head)}",
            13,
            MUTED,
        )
    )
    x, y, rest = left, 46, size
    for g in range(groups):
        part = min(group, rest)
        rest -= part
        out.append(_rect(x, y, head * unit, 36, "#fff", ACCENT, 2, rx=2))
        out.append(_text(x + head * unit / 2, y + 23, "з", 13, ACCENT, "middle", 600))
        x += head * unit
        for k in range(part):
            out.append(
                _rect(x + k * unit, y, unit, 36, WASH if g % 2 == 0 else FAINT, INK, 1, rx=0)
            )
        out.append(_text(x + part * unit / 2, y + 56, f"{part}", 13, INK, "middle", 600))
        x += part * unit + 6
    out.append(
        _text(
            left,
            y + 80,
            f"групп ⌈{size} / {group}⌉ = {groups}; всего {size} + {groups} · {head} = {_ru_bytes(total)}",
            14,
            INK,
            weight=600,
        )
    )
    out.append(
        _text(W / 2, 156, "неполная последняя группа тоже получает заголовок", 12, MUTED, "middle")
    )
    out.append("</svg>")
    return "".join(out)


# --- one password over the bytes ---------------------------------------------------------


def pwd_code(symbols: int = 7, bits: int = 5) -> str:
    """symbols codes of ``bits`` bits one after another; whole bytes below them."""
    total = symbols * bits
    nbytes = ceil(total / 8)
    left = 24
    unit = (W - 2 * left) / (nbytes * 8)
    y = 66
    out = _svg(204, f"Пароль из {symbols} символов по {bits} бит в байтах")
    out.append(_text(left, 22, f"{symbols} символов по {_ru_bits(bits)}; клетка — байт", 13, MUTED))
    for k in range(symbols):
        out.append(_segment(left, y, k * bits, bits, unit, k))
        x = left + (k * bits + bits / 2) * unit
        out.append(_text(x, y - 10, f"символ {k + 1}", 12, INK, "middle"))
    if nbytes * 8 > total:
        out.append(
            _rect(left + total * unit, y + 3, (nbytes * 8 - total) * unit, 20, "none", ACCENT, 1)
        )
    out += _byte_grid(left, y, nbytes, unit)
    for b in range(nbytes):
        out.append(_text(left + (b * 8 + 4) * unit, y + 46, f"байт {b + 1}", 12, MUTED, "middle"))
    out.append(
        _text(
            left,
            y + 82,
            f"{symbols} · {bits} = {_ru_bits(total)} кода; целых байтов ⌈{total} / 8⌉ = {nbytes}",
            14,
            INK,
            weight=600,
        )
    )
    out.append(
        _text(
            left,
            y + 106,
            f"{nbytes} · 8 = {_ru_bits(nbytes * 8)}: {_ru_bits(nbytes * 8 - total)} в последнем байте пустуют",
            13,
            ACCENT,
        )
    )
    out.append(
        _text(
            W / 2,
            196,
            "код символа может начаться в одном байте и закончиться в следующем",
            12,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- a number against a count of variants ------------------------------------------------


def pwd_number(j: int = 3) -> str:
    """Codes of j bits: 2ʲ objects get 0 … 2ʲ − 1, the number 2ʲ itself needs j + 1 bits."""
    top = 2**j
    left, cell = 150, 52
    out = _svg(212, f"{j} бита: коды объектов и двоичная запись чисел до {top}")
    out.append(
        _text(
            16,
            22,
            f"{j} бита дают {top} кодов: от {'0' * j} до {'1' * j}, то есть от 0 до {top - 1}",
            13,
            MUTED,
        )
    )
    y1 = 58
    out.append(_text(16, y1 + 10, f"{top} объектов", 14, INK, weight=600))
    out.append(_text(16, y1 + 28, "коды 0 … " + str(top - 1), 12, MUTED))
    y2 = 132
    out.append(_text(16, y2 + 10, f"числа 1 … {top}", 14, INK, weight=600))
    out.append(_text(16, y2 + 28, "двоичной записью", 12, MUTED))
    for k in range(top):
        x = left + k * cell
        out.append(_text(x + cell / 2 - 2, y1 - 8, f"№{k + 1}", 12, MUTED, "middle"))
        out.append(_rect(x, y1, cell - 4, 30, WASH, INK, 1, rx=2))
        out.append(_text(x + cell / 2 - 2, y1 + 20, format(k, f"0{j}b"), 13, INK, "middle"))
        v = k + 1
        hot = v == top
        width = cell - 4 + (14 if hot else 0)
        out.append(_rect(x, y2, width, 30, "#fff", ACCENT if hot else INK, 2 if hot else 1, rx=2))
        out.append(
            _text(
                x + width / 2,
                y2 + 20,
                format(v, f"0{j}b"),
                13,
                ACCENT if hot else INK,
                "middle",
                600 if hot else 400,
            )
        )
        out.append(_text(x + width / 2, y2 - 8, str(v), 12, MUTED, "middle"))
    out.append(
        _text(
            16,
            202,
            f"{j} бит хватает {top} объектам; число {top} = {format(top, 'b')} — уже {j + 1} бита: 2ʲ > m, а не 2ʲ ≥ m",
            13,
            ACCENT,
        )
    )
    out.append("</svg>")
    return "".join(out)


PASSWORD_FIGURES: dict = {
    "pwd_bytes": pwd_bytes,
    "pwd_parts": pwd_parts,
    "pwd_range": pwd_range,
    "pwd_groups": pwd_groups,
    "pwd_code": pwd_code,
    "pwd_number": pwd_number,
}
PASSWORD_STEPPERS: dict = {}
PASSWORD_WIDGETS: dict = {}
PASSWORD_SCRIPTS: dict = {}
