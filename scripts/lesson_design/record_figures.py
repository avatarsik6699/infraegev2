"""Figures of topic 5 «Преобразование записи числа» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture:
the digits of a record, the weights of its places, the result of a rule.

``convert_stepper(n, q)`` — division by the base, step by step: the remainder
is the last digit, the record grows from the right.
``append(digits, block, base, side)`` — appending a block: on the right
every old digit moves k places left (R = N·qᵏ + A); on the left the old digits
keep their places (R = A·qᴸ + N).
``invert(record, base)`` — a record, its digit-by-digit complement and
their column sums q − 1: N + M = qᴸ − 1.
``rn_plot(rule, start, stop, limit, …)`` — R for every N of a range for one
of the named rules of the lesson; the threshold, the first suitable N and the
best R are marked.
``blocks(k, base, ns)`` — the results of consecutive N when k digits are
appended: blocks [N·qᵏ; N·qᵏ + qᵏ − 1] that never overlap.
"""

from __future__ import annotations

from figures import ACCENT, FAINT, INK, MUTED, WASH, _arrow, _stepper, _text

SUP = str.maketrans("0123456789-", "⁰¹²³⁴⁵⁶⁷⁸⁹⁻")
SUB = str.maketrans("0123456789", "₀₁₂₃₄₅₆₇₈₉")


def sup(n: int) -> str:
    return str(n).translate(SUP)


def sub(n: int) -> str:
    return str(n).translate(SUB)


def to_base(n: int, q: int) -> str:
    if n == 0:
        return "0"
    s = ""
    while n > 0:
        s = str(n % q) + s
        n //= q
    return s


def _cell(x, y, ch, size=44, hot=False, muted=False) -> str:
    stroke = ACCENT if hot else (FAINT if muted else INK)
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{size}" height="{size}" rx="6" '
        f'fill="{WASH if hot else "#fff"}" stroke="{stroke}" stroke-width="{2 if hot else 1.5}"/>'
        + _text(x + size / 2, y + size * 0.68, ch, 22, MUTED if muted else INK, "middle", 600)
    )


# --- conversion by repeated division -------------------------------------------------


def _convert_frame(n, q, rows, digits, note) -> str:
    """Rows of divisions x = q·Q + d on the left, the record on the right."""
    out = ['<svg viewBox="0 0 660 230" role="img" aria-hidden="true">']
    out.append(_text(16, 24, f"деление на {q}", 13, MUTED))
    for k, (x, quot, rem, hot) in enumerate(rows):
        y = 52 + k * 34
        out.append(_text(16, y, f"{x} = {q} · {quot} + ", 17, INK if hot else MUTED))
        out.append(_text(150, y, str(rem), 17, ACCENT if hot else INK, weight=600))
    size, gap = 44, 8
    width = max(len(to_base(n, q)), 1)
    right = 640
    out.append(_text(right, 24, f"запись {n} в системе с основанием {q}", 13, MUTED, "end"))
    for i in range(width):
        x = right - (i + 1) * size - i * gap
        have = i < len(digits)
        ch = digits[-1 - i] if have else ""
        out.append(_cell(x, 44, ch, size, hot=have and i == len(digits) - 1, muted=not have))
        out.append(_text(x + size / 2, 112, f"{q}{sup(i)}", 13, MUTED, "middle"))
    out.append(_text(right, 150, note[0], 15, INK, "end"))
    out.append(_text(right, 176, note[1], 13, MUTED, "end"))
    out.append("</svg>")
    return "".join(out)


def convert_frames(n: int = 29, q: int = 3) -> list[tuple[str, str]]:
    """x = q·(x // q) + x % q: the remainder is the next digit from the right."""
    frames, rows, digits, x = [], [], "", n
    frames.append(
        (
            _convert_frame(n, q, [], "", (f"{n} — что осталось перевести", "цифр пока нет")),
            f"Переводим {n} в систему с основанием {q}. Цифры записи появятся справа налево.",
        )
    )
    while x > 0:
        quot, rem = divmod(x, q)
        rows = [(a, b, c, False) for a, b, c, _ in rows] + [(x, quot, rem, True)]
        digits = str(rem) + digits
        place = len(digits) - 1
        frames.append(
            (
                _convert_frame(
                    n,
                    q,
                    rows,
                    digits,
                    (f"остаток {rem} — цифра разряда {q}{sup(place)}", f"дальше переводим {quot}"),
                ),
                f"{x} = {q} · {quot} + {rem}. Остаток {rem} — цифра разряда {q}{sup(place)}, "
                + (
                    f"дальше работаем с частным {quot}."
                    if quot
                    else "частное 0 — перевод закончен."
                ),
            )
        )
        x = quot
    rows = [(a, b, c, False) for a, b, c, _ in rows]
    frames.append(
        (
            _convert_frame(n, q, rows, digits, (f"{n} = {digits}{sub(q)}", "остатки снизу вверх")),
            f"Готово: {n} = {digits}{sub(q)}. Первый найденный остаток стоит справа, последний — слева.",
        )
    )
    return frames


def convert_stepper(n: int = 29, q: int = 3) -> str:
    """Conversion of n to base q by repeated division, step by step."""
    return _stepper(convert_frames(n, q))


# --- appending a block ---------------------------------------------------------------


def _row(x0, y, digits, base, weights_from, hot=(), size=44, gap=8):
    """A record as cells with the weights of its places under them."""
    out = []
    n = len(digits)
    for k, ch in enumerate(digits):
        x = x0 + k * (size + gap)
        out.append(_cell(x, y, ch, size, hot=k in hot))
        place = weights_from + n - 1 - k
        out.append(_text(x + size / 2, y + size + 18, f"{base}{sup(place)}", 13, MUTED, "middle"))
    return out


def append_svg(digits: str = "1011", block: str = "01", base: int = 2, side: str = "right") -> str:
    """Old record above, new record below. Appending on the right moves every old
    digit len(block) places left; appending on the left leaves them in place."""
    size, gap = 44, 8
    step = size + gap
    n, k = len(digits), len(block)
    value, add = int(digits, base), int(block, base)
    total = n + k
    x_new = (660 - total * step + gap) / 2
    new = digits + block if side == "right" else block + digits
    hot = range(n, total) if side == "right" else range(k)
    old_shift = k  # old digits stand over the places they had before
    x_old = x_new + old_shift * step
    out = [
        f'<svg viewBox="0 0 660 268" role="img" aria-label="Дописывание {block} к записи {digits}">'
    ]
    out.append(_text(16, 22, f"было: {digits}{sub(base)} = {value}", 14, MUTED))
    out += _row(x_old, 34, digits, base, 0)
    for j in range(n):
        x1 = x_old + j * step + size / 2
        x2 = x_new + (j + (0 if side == "right" else k)) * step + size / 2
        out.append(_arrow(x1, 102, x2, 138, ACCENT if side == "right" else FAINT))
    out.append(_text(16, 140, f"стало: {new}{sub(base)} = {int(new, base)}", 14, MUTED))
    out += _row(x_new, 148, new, base, 0, hot=hot)
    if side == "right":
        formula = f"R = {value} · {base}{sup(k)} + {block}{sub(base)} = {value * base**k} + {add} = {int(new, base)}"
        note = f"старые цифры сдвинулись на {k} разряд{'а' if 1 < k < 5 else '' if k == 1 else 'ов'} влево: вес каждой вырос в {base**k} раз"
    else:
        formula = f"R = {block}{sub(base)} · {base}{sup(n)} + {value} = {add * base**n} + {value} = {int(new, base)}"
        note = f"старые цифры остались на месте; новый блок стоит над разрядами от {base}{sup(n)}"
    out.append(_text(330, 236, formula, 16, INK, "middle", 600))
    out.append(_text(330, 258, note, 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


# --- digit-by-digit complement -------------------------------------------------------


def invert_svg(record: str = "10110", base: int = 2) -> str:
    """N, its complement M (each digit d → base − 1 − d) and the column sums."""
    top = base - 1
    other = "".join(str(top - int(c)) for c in record)
    size, gap = 44, 8
    step = size + gap
    L = len(record)
    x0 = 150
    n, m = int(record, base), int(other, base)
    out = [f'<svg viewBox="0 0 660 214" role="img" aria-label="Инверсия записи {record}">']
    rows = [("N", record, n), ("M", other, m), ("N + M", str(top) * L, n + m)]
    for r, (name, digits, val) in enumerate(rows):
        y = 12 + r * 58
        out.append(_text(x0 - 18, y + 29, name, 15, INK if r < 2 else ACCENT, "end", 600))
        for j, ch in enumerate(digits):
            out.append(_cell(x0 + j * step, y, ch, size, hot=r == 2))
        out.append(
            _text(x0 + L * step + 10, y + 29, f"= {val}", 17, INK if r < 2 else ACCENT, weight=600)
        )
    out.append(
        f'<line x1="{x0 - 4}" y1="{12 + 2 * 58 - 6}" x2="{x0 + L * step - gap + 4}" y2="{12 + 2 * 58 - 6}" stroke="{INK}" stroke-width="1.25"/>'
    )
    out.append(
        _text(
            330,
            204,
            f"в каждом столбце {top}, поэтому N + M = {base}{sup(L)} − 1 = {base**L - 1} и M = {base**L - 1} − {n} = {m}",
            14,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- results of a rule over a range of inputs ----------------------------------------


def _even111_odd0(n: int) -> int:
    s = bin(n)[2:]
    return int(s + ("111" if n % 2 == 0 else "0"), 2)


def _parity_twice(n: int) -> int:
    s = bin(n)[2:]
    s += str(s.count("1") % 2)
    s += str(s.count("1") % 2)
    return int(s, 2)


def _tern7(n: int) -> int:
    s = to_base(n, 3)
    s = s + s[-2:] if n % 3 == 0 else s + to_base(n % 3 * 7, 3)
    return int(s, 3)


def _swap02(n: int) -> int:
    s = to_base(n, 3)
    m = int("".join(str(2 - int(c)) for c in s), 3)
    return abs(n - m)


RULES = {
    "even111_odd0": (_even111_odd0, "чётному N дописать 111, нечётному — 0"),
    "parity_twice": (_parity_twice, "дважды дописать остаток суммы цифр на 2"),
    "tern7": (_tern7, "троичный: копия двух цифр или запись 7·(N mod 3)"),
    "swap02": (_swap02, "троичная замена 0 ↔ 2, R = |N − M|"),
}


def rn_plot(
    rule: str = "even111_odd0",
    start: int = 1,
    stop: int = 12,
    limit: int | None = 8,
    above: bool = True,
    target: int | None = None,
) -> str:
    """Dots (N, R) for N in [start; stop]. With ``limit`` the threshold line is
    drawn, the first suitable N and the best suitable R are marked (smallest R
    above the limit or largest R not above it). With ``target`` the inputs
    that give exactly this R are marked."""
    fn, label = RULES[rule]
    ns = list(range(start, stop + 1))
    rs = [fn(n) for n in ns]
    left, right, top, bottom = 72, 640, 22, 214
    rmax = max(rs + [limit or 0, target or 0])
    rmax = rmax + max(1, rmax // 12)

    def px(n):
        return left + (n - start) * (right - left) / max(1, stop - start)

    def py(r):
        return bottom - r * (bottom - top) / rmax

    out = [f'<svg viewBox="0 0 660 262" role="img" aria-label="Результаты алгоритма: {label}">']
    out.append(
        f'<line x1="{left}" y1="{bottom}" x2="{right}" y2="{bottom}" stroke="{INK}" stroke-width="1.25"/>'
    )
    out.append(
        f'<line x1="{left}" y1="{top}" x2="{left}" y2="{bottom}" stroke="{INK}" stroke-width="1.25"/>'
    )
    out.append(_text(left - 8, top + 4, "R", 13, MUTED, "end"))
    out.append(_text(right + 4, bottom + 4, "N", 13, MUTED))
    every = max(1, len(ns) // 12)
    for n in ns:
        if (n - start) % every == 0:
            out.append(_text(px(n), bottom + 18, str(n), 12, MUTED, "middle"))
    ok, first, best = [], None, None
    line = limit if limit is not None else target
    if line is not None:
        y = py(line)
        out.append(
            f'<line x1="{left}" y1="{y:.1f}" x2="{right}" y2="{y:.1f}" stroke="{MUTED}" '
            'stroke-width="1.25" stroke-dasharray="5 4"/>'
        )
        sign = ">" if (above and limit is not None) else ("≤" if limit is not None else "=")
        out.append(
            _text(
                left - 6,
                y + 4,
                f"R {sign} {line}" if limit is not None else f"R = {line}",
                12,
                MUTED,
                "end",
            )
        )
    for n, r in zip(ns, rs, strict=True):
        if limit is not None:
            good = r > limit if above else r <= limit
        else:
            good = r == target
        if good:
            ok.append((n, r))
    if ok:
        first = ok[0]
        if limit is not None:
            best = min(ok, key=lambda p: p[1]) if above else max(ok, key=lambda p: p[1])
    for n, r in zip(ns, rs, strict=True):
        good = (n, r) in ok
        out.append(
            f'<circle cx="{px(n):.1f}" cy="{py(r):.1f}" r="{5 if good else 4}" '
            f'fill="{INK if good else "#fff"}" stroke="{INK if good else MUTED}" stroke-width="1.5"/>'
        )
        if len(ns) <= 14:
            out.append(_text(px(n), py(r) - 10, str(r), 11, INK if good else MUTED, "middle"))
    notes = []
    if first and above and limit is not None:
        n, r = first
        out.append(
            f'<circle cx="{px(n):.1f}" cy="{py(r):.1f}" r="11" fill="none" stroke="{ACCENT}" stroke-width="2"/>'
        )
        notes.append("○ — первое подходящее N")
    if best and not (above and best == first):
        n, r = best
        out.append(
            f'<rect x="{px(n) - 11:.1f}" y="{py(r) - 11:.1f}" width="22" height="22" rx="3" fill="none" '
            f'stroke="{ACCENT}" stroke-width="2"/>'
        )
        notes.append(f"□ — {'наименьший' if above else 'наибольший'} подходящий R")
    if target is not None:
        for n, r in ok:
            out.append(
                f'<circle cx="{px(n):.1f}" cy="{py(r):.1f}" r="11" fill="none" stroke="{ACCENT}" stroke-width="2"/>'
            )
        notes = [f"○ — R = {target}"]
    else:
        notes.insert(0, "● — подходящие входы")
    out.append(_text(330, 254, ";   ".join(notes), 13, INK, "middle"))
    out.append("</svg>")
    return "".join(out)


# --- non-overlapping blocks of results -----------------------------------------------


def blocks_svg(k: int = 2, base: int = 2, ns: list[int] | None = None) -> str:
    """For consecutive N the results N·qᵏ + A, 0 ≤ A < qᵏ, fill blocks that
    follow one another without overlapping."""
    ns = ns or [5, 6, 7]
    width = base**k
    lo, hi = ns[0] * width, (ns[-1] + 1) * width - 1
    left, right = 30, 630
    count = hi - lo + 1
    cell = (right - left) / count
    out = [
        f'<svg viewBox="0 0 660 150" role="img" aria-label="Блоки результатов при дописывании {k} цифр">'
    ]
    for i in range(count):
        v = lo + i
        x = left + i * cell
        n = v // width
        odd = ns.index(n) % 2 == 1
        out.append(
            f'<rect x="{x:.1f}" y="40" width="{cell:.1f}" height="34" fill="{WASH if odd else "#fff"}" '
            f'stroke="{INK}" stroke-width="1"/>'
        )
        out.append(_text(x + cell / 2, 62, str(v), 12 if v < 1000 else 10, INK, "middle"))
    for n in ns:
        a = left + (n * width - lo) * cell
        b = a + width * cell
        out.append(
            f'<path d="M {a + 2:.1f} 84 v 8 H {b - 2:.1f} v -8" fill="none" stroke="{ACCENT}" stroke-width="1.5"/>'
        )
        out.append(_text((a + b) / 2, 112, f"N = {n}", 14, INK, "middle", 600))
        out.append(
            _text((a + b) / 2, 30, f"{n}·{width} … {n}·{width} + {width - 1}", 12, MUTED, "middle")
        )
    out.append(
        _text(
            330,
            140,
            f"дописаны {k} цифр{'ы' if 1 < k < 5 else ''} в системе с основанием {base}: блок N кончается раньше, чем начинается блок N + 1",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- the parity bit appended twice ---------------------------------------------------


def parity_svg(a: int = 12, b: int = 13) -> str:
    """Two inputs: an even and an odd number of ones. The bit «ones mod 2» is
    appended twice; after the first bit the count of ones is always even, so
    the second bit is always 0."""
    out = [
        '<svg viewBox="0 0 660 214" role="img" aria-label="Дважды дописанный остаток суммы цифр">'
    ]
    size, gap = 34, 5
    for col, n in enumerate((a, b)):
        x0 = 16 + col * 330
        s = bin(n)[2:]
        out.append(
            _text(
                x0,
                20,
                f"N = {n}, единиц {s.count('1')} — {'чётно' if s.count('1') % 2 == 0 else 'нечётно'}",
                14,
                INK,
                weight=600,
            )
        )
        rows = [s]
        for _ in range(2):
            rows.append(rows[-1] + str(rows[-1].count("1") % 2))
        for r, rec in enumerate(rows):
            y = 34 + r * 52
            for j, ch in enumerate(rec):
                newest = j == len(rec) - 1 and r > 0
                out.append(_cell(x0 + j * (size + gap), y, ch, size, hot=newest, muted=False))
            ones = rec.count("1")
            label = "запись N" if r == 0 else f"дописали {rec[-1]}"
            out.append(_text(x0 + len(rows[2]) * (size + gap) + 4, y + 15, label, 12, MUTED))
            out.append(
                _text(
                    x0 + len(rows[2]) * (size + gap) + 4,
                    y + 31,
                    f"единиц {ones}",
                    12,
                    ACCENT if r == 1 else MUTED,
                )
            )
        tail = rows[2][-2:]
        out.append(
            _text(
                x0, 204, f"хвост {tail}: R = 4 · {n} + {int(tail, 2)} = {int(rows[2], 2)}", 14, INK
            )
        )
    out.append("</svg>")
    return "".join(out)


# --- length of a record and the range of numbers -------------------------------------


def lengths_svg(base: int = 2, upto: int = 4) -> str:
    """Numbers 1 … base^upto − 1 in a row, grouped by the length of their record:
    a group of length L starts at base^(L−1) and ends at base^L − 1."""
    hi = base**upto - 1
    left, right = 20, 640
    cell = (right - left) / hi
    out = [
        f'<svg viewBox="0 0 660 150" role="img" aria-label="Длина записи и диапазон чисел, основание {base}">'
    ]
    for v in range(1, hi + 1):
        x = left + (v - 1) * cell
        L = len(to_base(v, base))
        out.append(
            f'<rect x="{x:.1f}" y="30" width="{cell:.1f}" height="30" fill="{WASH if L % 2 == 0 else "#fff"}" '
            f'stroke="{INK}" stroke-width="1"/>'
        )
        out.append(_text(x + cell / 2, 50, str(v), 12 if cell >= 30 else 10, INK, "middle"))
    for L in range(1, upto + 1):
        lo_v, hi_v = base ** (L - 1), base**L - 1
        a = left + (lo_v - 1) * cell
        b = left + hi_v * cell
        out.append(
            f'<path d="M {a + 2:.1f} 70 v 8 H {b - 2:.1f} v -8" fill="none" stroke="{ACCENT}" stroke-width="1.5"/>'
        )
        out.append(_text((a + b) / 2, 96, f"L = {L}", 13, INK, "middle", 600))
        if hi_v > lo_v:
            out.append(
                _text(
                    (a + b) / 2,
                    114,
                    f"{to_base(lo_v, base)} … {to_base(hi_v, base)}",
                    12,
                    MUTED,
                    "middle",
                )
            )
        else:
            out.append(_text((a + b) / 2, 114, to_base(lo_v, base), 12, MUTED, "middle"))
    out.append(
        _text(
            330,
            142,
            f"запись из L цифр с основанием {base}: от {base}ᴸ⁻¹ до {base}ᴸ − 1; следующая длина начинается с {base}ᴸ",
            13,
            MUTED,
            "middle",
        )
    )
    out.append(_text(left, 20, "числа и длина их записи", 12, MUTED))
    out.append("</svg>")
    return "".join(out)


RECORD_FIGURES = {
    "convert_stepper": convert_stepper,
    "append": append_svg,
    "invert": invert_svg,
    "rn_plot": rn_plot,
    "blocks": blocks_svg,
    "parity": parity_svg,
    "lengths": lengths_svg,
}

RECORD_STEPPERS = {
    "convert_stepper": convert_frames,
}
