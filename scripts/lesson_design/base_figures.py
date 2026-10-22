"""Figures of topic 14 «Системы счисления» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.
All keys start with ``base_`` so they never clash with other topics.

``base_carry(a, b, q)`` — column addition in base q, one column per frame:
the column sum s gives the digit s mod q and the carry s // q.
``base_blocks(q, rows)`` — a sum of signed powers of q, each row one part of the
expression placed by its digits' places, and the total record below with its
runs of equal digits counted: the parts never overlap, so nothing carries.
``base_groups(bits)`` — a binary record grouped from the right by four and by
three digits: one hexadecimal or octal digit per group.
``base_count_plot(q, power, digit, stop, target)`` — how many digits ``digit``
the record of qᵖᵒʷᵉʳ − x has for x = 1 … stop; the suitable x and the answer
are marked.
``base_pair_grid(a, qa, b, qb, k)`` — all pairs of unknown digits (x, y) as a
grid in the order of a nested loop; the sums divisible by k, the first one
found and the smallest one are marked.
"""

from __future__ import annotations

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stepper, _text

DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
WORDS = {4: "четыре", 3: "три"}
SUP = str.maketrans("0123456789-", "⁰¹²³⁴⁵⁶⁷⁸⁹⁻")
SUB = str.maketrans("0123456789", "₀₁₂₃₄₅₆₇₈₉")


def _sup(n: int) -> str:
    return str(n).translate(SUP)


def _sub(n: int) -> str:
    return str(n).translate(SUB)


def _digits(n: int, q: int) -> list[int]:
    if n == 0:
        return [0]
    out = []
    while n:
        out.append(n % q)
        n //= q
    return out[::-1]


def _box(x, y, ch, size=40, hot=False, muted=False, font=20) -> str:
    stroke = ACCENT if hot else (FAINT if muted else INK)
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{size}" height="{size}" rx="6" '
        f'fill="{WASH if hot else "#fff"}" stroke="{stroke}" stroke-width="{2 if hot else 1.5}"/>'
        + _text(x + size / 2, y + size * 0.68, ch, font, MUTED if muted else INK, "middle", 600)
    )


def _value(record: str, q: int, env: dict[str, int]) -> int:
    v = 0
    for ch in record:
        v = v * q + (env[ch] if ch in env else DIGITS.index(ch))
    return v


# --- column addition with carries ---------------------------------------------------


def _carry_frame(a: str, b: str, q: int, done: int, cols: list[tuple]) -> str:
    """Two records, carries over the columns, the digits written so far."""
    width = max(len(a), len(b)) + 1
    size, gap = 44, 10
    step = size + gap
    x0 = (660 - width * step + gap) / 2
    out = ['<svg viewBox="0 0 660 290" role="img" aria-hidden="true">']
    out.append(_text(x0 - 18, 106, "+", 22, INK, "end", 600))
    for row, (rec, y) in enumerate(((a, 62), (b, 116))):
        pad = width - len(rec)
        for j, ch in enumerate(rec):
            col = width - 1 - (pad + j)
            out.append(_box(x0 + (pad + j) * step, y, ch, size, hot=col == done - 1, font=22))
        _ = row
    line_y = 172
    out.append(
        f'<line x1="{x0 - 8:.1f}" y1="{line_y}" x2="{x0 + width * step - gap + 8:.1f}" '
        f'y2="{line_y}" stroke="{INK}" stroke-width="1.5"/>'
    )
    for col, (_, carry_in, _, digit, carry_out) in enumerate(cols[:done]):
        x = x0 + (width - 1 - col) * step
        out.append(_box(x, 182, DIGITS[digit], size, hot=col == done - 1, font=22))
        if carry_out:
            out.append(_text(x - step + size / 2, 50, f"+{carry_out}", 15, ACCENT, "middle", 600))
        _ = carry_in
    if done < len(cols):
        pass
    elif cols[-1][4]:
        out.append(_box(x0, 182, str(cols[-1][4]), size, hot=True, font=22))
    out.append(_text(x0 - 18, 210, "=", 22, INK, "end", 600))
    if done:
        col, carry_in, total, digit, carry_out = cols[done - 1]
        parts = [str(_digit_at(a, col)), str(_digit_at(b, col))] + (
            [str(carry_in)] if carry_in else []
        )
        note = (
            f"разряд {q}{_sup(col)}: {' + '.join(parts)} = {total} = {carry_out} · {q} + {digit}"
            if carry_out
            else f"разряд {q}{_sup(col)}: {' + '.join(parts)} = {total} < {q} — переноса нет"
        )
        out.append(_text(330, 262, note, 16, INK, "middle", 600))
    out.append(
        _text(
            330,
            284,
            f"пишем s mod {q}, а s // {q} переносим в следующий разряд",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


def _digit_at(rec: str, col: int) -> int:
    return DIGITS.index(rec[-1 - col]) if col < len(rec) else 0


def base_carry_frames(a: str = "243", b: str = "134", q: int = 5) -> list[tuple[str, str]]:
    cols, carry = [], 0
    for col in range(max(len(a), len(b))):
        total = _digit_at(a, col) + _digit_at(b, col) + carry
        cols.append((col, carry, total, total % q, total // q))
        carry = total // q
    result = "".join(DIGITS[c[3]] for c in reversed(cols))
    if carry:
        result = str(carry) + result
    va, vb = _value(a, q, {}), _value(b, q, {})
    frames = [
        (
            _carry_frame(a, b, q, 0, cols),
            f"Складываем {a}{_sub(q)} + {b}{_sub(q)} столбиком, начиная с разряда единиц.",
        )
    ]
    for done in range(1, len(cols) + 1):
        col, carry_in, total, digit, carry_out = cols[done - 1]
        tail = (
            f"{total} = {carry_out} · {q} + {digit}: пишем {digit}, {carry_out} переносим в следующий разряд."
            if carry_out
            else f"{total} меньше {q}: пишем {digit}, переноса нет."
        )
        frames.append((_carry_frame(a, b, q, done, cols), f"Разряд {q}{_sup(col)}. {tail}"))
    frames[-1] = (
        frames[-1][0],
        frames[-1][1]
        + f" Итог: {result}{_sub(q)}; проверка: {va} + {vb} = {va + vb} = {_value(result, q, {})}.",
    )
    return frames


def base_carry(a: str = "243", b: str = "134", q: int = 5) -> str:
    """Column addition in base q, step by step."""
    return _stepper(base_carry_frames(a, b, q))


# --- a sum of powers as non-overlapping blocks --------------------------------------


def _term_label(coef: int, power: int, q: int, first: bool) -> str:
    sign = "" if first and coef > 0 else (" + " if coef > 0 else " − ")
    c = abs(coef)
    body = f"{q}{_sup(power)}" if power else "1"
    if c != 1:
        body = f"{c} · {body}" if power else str(c)
    return sign + body


def _columns(ds: list[int], fold: int | None) -> list:
    """Columns of a record, the highest place first: ``("place", k)`` or, for the
    inside of a run of more than ``fold`` equal digits, one ``("gap", hidden)``."""
    places = len(ds)
    cols: list = []
    j = 0
    while j < places:
        k = j
        while k < places and ds[k] == ds[j]:
            k += 1
        run = list(range(places - 1 - j, places - 1 - k, -1))
        if fold and len(run) > fold:
            cols += [("place", p) for p in run[:2]]
            cols.append(("gap", run[2:-2]))
            cols += [("place", p) for p in run[-2:]]
        else:
            cols += [("place", p) for p in run]
        j = k
    return cols


def base_blocks(q: int = 5, rows: list | None = None, labels=None, fold: int | None = None) -> str:
    """Rows of terms [[coef, power], …]; each row is one part of the expression.
    The parts are drawn over the places of their digits, the total below. With
    ``fold`` a run of more than ``fold`` equal digits of the total shows its two
    first and two last places around «…»; ``labels`` name the rows."""
    rows = rows or [[[1, 12]], [[1, 7], [-1, 3]]]
    parts = [sum(c * q**p for c, p in row) for row in rows]
    if labels is None:
        labels = [
            "".join(_term_label(c, p, q, i == 0) for i, (c, p) in enumerate(row)) for row in rows
        ]
    total = sum(parts)
    ds = _digits(total, q)
    cols = _columns(ds, fold)
    size, gap = 38, 5
    step = size + gap
    width = 660
    x0 = width - 16 - len(cols) * step + gap
    top = 30
    height = top + (len(rows) + 1) * 54 + 80
    col_x = {i: x0 + i * step for i in range(len(cols))}
    out = [
        f'<svg viewBox="0 0 {width} {height}" role="img" aria-label="Запись выражения по блокам">'
    ]
    for i, (kind, val) in enumerate(cols):
        if kind == "place":
            out.append(_text(col_x[i] + size / 2, top - 10, str(val), 12, MUTED, "middle"))
    out.append(_text(x0 - 10, top - 10, "разряд", 12, MUTED, "end"))

    def draw_row(rd: list[int], y: float, hot: bool) -> None:
        at = {len(rd) - 1 - j: d for j, d in enumerate(rd)}
        for i, (kind, val) in enumerate(cols):
            if kind == "place":
                if val in at:
                    d = at[val]
                    out.append(
                        _box(col_x[i], y, DIGITS[d], size, hot=hot, muted=d == 0 and not hot)
                    )
            elif any(p in at for p in val):
                out.append(
                    _text(col_x[i] + size / 2, y + size * 0.62, "…", 20, MUTED, "middle", 600)
                )

    for r, (label, value) in enumerate(zip(labels, parts, strict=True)):
        y = top + r * 54
        out.append(_text(x0 - 10, y + 25, label, 15, INK, "end", 600))
        draw_row(_digits(value, q), y, False)
    y = top + len(rows) * 54 + 6
    out.append(
        f'<line x1="{x0 - 4:.1f}" y1="{y - 8}" x2="{x0 + len(cols) * step - gap + 4:.1f}" '
        f'y2="{y - 8}" stroke="{INK}" stroke-width="1.5"/>'
    )
    out.append(_text(x0 - 10, y + 25, "сумма", 15, ACCENT, "end", 600))
    draw_row(ds, y, True)
    # runs of equal digits with their lengths under the total
    yb = y + size + 8
    j = 0
    pos = {val: i for i, (kind, val) in enumerate(cols) if kind == "place"}
    while j < len(ds):
        k = j
        while k < len(ds) and ds[k] == ds[j]:
            k += 1
        hi, lo = len(ds) - 1 - j, len(ds) - k
        x1, x2 = col_x[pos[hi]], col_x[pos[lo]] + size
        out.append(
            f'<path d="M {x1:.1f} {yb} v 6 H {x2:.1f} v -6" fill="none" stroke="{MUTED}" '
            'stroke-width="1.25"/>'
        )
        out.append(_text((x1 + x2) / 2, yb + 24, f"{DIGITS[ds[j]]} × {k - j}", 13, INK, "middle"))
        j = k
    counts = {d: ds.count(d) for d in sorted(set(ds))}
    summary = ", ".join(f"«{DIGITS[d]}» — {c}" for d, c in counts.items())
    out.append(
        _text(width / 2, height - 14, f"всего {len(ds)} цифр: {summary}", 14, MUTED, "middle")
    )
    out.append("</svg>")
    return "".join(out)


# --- q^k − 1: one unit of the highest place broken down -----------------------------


def base_borrow_frames(q: int = 5, k: int = 4) -> list[tuple[str, str]]:
    """10…0 − 1 in base q: the unit of place k is broken down place by place to the
    right; in every place one unit goes on and q − 1 stay."""
    size, gap = 44, 10
    step = size + gap
    cols = k + 1
    x0 = (660 - cols * step + gap) / 2

    def frame(cells: list[str], hot: int | None, minus: bool, note: str) -> str:
        out = ['<svg viewBox="0 0 660 200" role="img" aria-hidden="true">']
        for i, ch in enumerate(cells):
            place = k - i
            x = x0 + i * step
            out.append(_text(x + size / 2, 34, f"{q}{_sup(place)}", 12, MUTED, "middle"))
            if ch:
                big = ch not in DIGITS[:q]
                out.append(_box(x, 44, ch, size, hot=place == hot or big, muted=ch == "0", font=22))
        if minus:
            out.append(
                _text(x0 + (cols - 1) * step + size / 2, 124, "− 1", 18, ACCENT, "middle", 600)
            )
        out.append(_text(330, 176, note, 15, INK, "middle", 600))
        out.append("</svg>")
        return "".join(out)

    top = DIGITS[q - 1]
    frames = [
        (
            frame(
                ["1"] + ["0"] * k,
                None,
                True,
                f"10…0{_sub(q)} − 1: в разряде единиц вычитать не из чего",
            ),
            f"1{'0' * k}{_sub(q)} — это {q}{_sup(k)}. Отнять 1 из разряда единиц нельзя: там 0.",
        )
    ]
    for i in range(1, k + 1):
        cells = [""] + [top] * (i - 1) + [str(q) if q < 10 else f"{q}"] + ["0"] * (k - i)
        place = k - i
        frames.append(
            (
                frame(cells, place, True, f"разряд {q}{_sup(place)}: пришло {q} единиц"),
                (
                    f"Единица разряда {q}{_sup(place + 1)} — это {q} единиц разряда {q}{_sup(place)}."
                    + (f" Одну отдаём дальше вправо, {q - 1} остаются." if place else "")
                ),
            )
        )
    frames.append(
        (
            frame([""] + [top] * k, None, False, f"{q}{_sup(k)} − 1 = {top * k}{_sub(q)}"),
            f"Из {q} единиц вычли 1 — осталось {q - 1}. В каждом разряде цифра {top}: "
            f"{q}{_sup(k)} − 1 = {top * k}{_sub(q)}.",
        )
    )
    return frames


def base_borrow(q: int = 5, k: int = 4) -> str:
    """Why q^k − 1 is k digits q − 1, step by step."""
    return _stepper(base_borrow_frames(q, k))


# --- q^n − x as (q^n − 1) − (x − 1) ---------------------------------------------------


def base_minus(
    q: int = 5, n: int = 23, x: int = 1876, head: int | None = None, fold: int = 6
) -> str:
    """The run of n digits q − 1 minus x − 1 digit by digit, no borrowing: the digit
    q − 1 survives exactly where x − 1 has a zero. ``head`` — a higher power added
    to the expression (drawn as its leading 1)."""
    top_ds = [q - 1] * n
    sub = _digits(x - 1, q)
    sub = [0] * (n - len(sub)) + sub
    res = [a - b for a, b in zip(top_ds, sub, strict=True)]
    cols = _columns([q - 1] * (n - 5) + [0] * 5 if fold else res, fold)
    # the five lowest places stay visible, the rest folds
    size, gap = 38, 5
    step = size + gap
    x0 = 660 - 16 - (len(cols) + (1 if head else 0)) * step + gap
    lead = 1 if head else 0
    col_x = {i: x0 + (i + lead) * step for i in range(len(cols))}
    label_x = x0 - 10
    out = ['<svg viewBox="0 0 660 300" role="img" aria-label="Вычитание x − 1 из цифр q − 1">']
    for i, (kind, val) in enumerate(cols):
        if kind == "place":
            out.append(_text(col_x[i] + size / 2, 22, str(val), 12, MUTED, "middle"))
    if head:
        out.append(_text(x0 + size / 2, 22, str(head), 12, MUTED, "middle"))
    rows = [
        (f"{q}{_sup(n)} − 1", top_ds, False, None),
        (f"x − 1 = {x - 1}", sub, False, None),
        ("разность", res, True, sub),
    ]
    for r, (label, rd, hot, under) in enumerate(rows):
        y = 32 + r * 64
        if r == 2:
            out.append(
                f'<line x1="{x0 - 4:.1f}" y1="{y - 10}" x2="{660 - 12}" y2="{y - 10}" '
                f'stroke="{INK}" stroke-width="1.5"/>'
            )
            if head:
                out.append(_box(x0, y, "1", size, font=18))
        out.append(_text(label_x, y + 25, label, 14, ACCENT if hot else INK, "end", 600))
        at = {n - 1 - j: d for j, d in enumerate(rd)}
        for i, (kind, val) in enumerate(cols):
            if kind == "place":
                d = at[val]
                keep = hot and under is not None and under[n - 1 - val] == 0
                out.append(
                    _box(
                        col_x[i], y, DIGITS[d], size, hot=keep, muted=(not hot and d == 0), font=18
                    )
                )
            else:
                out.append(
                    _text(col_x[i] + size / 2, y + size * 0.62, "…", 20, MUTED, "middle", 600)
                )
    kept = sum(1 for d in res if d == q - 1)
    word = _digits_word(kept)
    out.append(
        _text(
            330,
            262,
            f"цифра {q - 1} осталась там, где у x − 1 ноль: {kept} {word} {q - 1}",
            15,
            ACCENT,
            "middle",
            600,
        )
    )

    out.append(
        _text(
            330,
            286,
            "вычитаем поразрядно: из цифры q − 1 можно вычесть любую цифру без займа",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- grouping binary digits ---------------------------------------------------------


def base_groups(bits: str = "11010110") -> str:
    """A binary record split from the right into groups of 4 and of 3."""
    size, gap = 36, 4
    out = [f'<svg viewBox="0 0 660 290" role="img" aria-label="Группы цифр записи {bits}₂">']
    for r, (k, q) in enumerate(((4, 16), (3, 8))):
        groups, rest = [], bits
        while rest:
            groups.append(rest[-k:])
            rest = rest[:-k]
        groups.reverse()
        y = 18 + r * 140
        widths = [len(g) * (size + gap) - gap for g in groups]
        total_w = sum(widths) + 22 * (len(groups) - 1)
        x = (660 - total_w) / 2 + 40
        out.append(_text(x - 18, y + 25, f"по {k} справа", 13, MUTED, "end"))
        digits = ""
        for g, w in zip(groups, widths, strict=True):
            for j, ch in enumerate(g):
                out.append(_box(x + j * (size + gap), y, ch, size, font=18))
            v = int(g, 2)
            digits += DIGITS[v]
            out.append(
                f'<path d="M {x:.1f} {y + size + 6} v 6 H {x + w:.1f} v -6" fill="none" '
                f'stroke="{MUTED}" stroke-width="1.25"/>'
            )
            label = f"{g}₂ = {v}" + (f" = {DIGITS[v]}" if v > 9 else "")
            out.append(_text(x + w / 2, y + size + 32, label, 13, INK, "middle"))
            if len(g) < k:
                out.append(_text(x + w / 2, y + size + 50, "неполная группа", 12, MUTED, "middle"))
            x += w + 22
        out.append(
            _text(
                330,
                y + size + 74,
                f"{bits}₂ = {digits}{_sub(q)}: {q} = 2{_sup(k)}, одна цифра — {WORDS[k]} двоичные",
                14,
                ACCENT,
                "middle",
                600,
            )
        )
    out.append("</svg>")
    return "".join(out)


# --- how many digits d in q^power − x ------------------------------------------------


def base_count_plot(
    q: int = 3,
    power: int = 8,
    digit: int = 2,
    stop: int = 100,
    target: int | None = 5,
    head: int | None = None,
) -> str:
    """Dots (x, count of ``digit`` in the record of q^power − x) for x = 1 … stop.
    With ``target`` the x giving exactly this count are filled and the largest
    one is circled; without it the largest count and its smallest x are marked."""
    xs = list(range(1, stop + 1))
    base = q**power + (q**head if head else 0)
    cs = [_digits(base - x, q).count(digit) for x in xs]
    left, right, top, bottom = 64, 640, 24, 206
    cmax = max(cs + [target or 0]) + 1
    cmin = max(0, min(cs) - 1)

    def px(x):
        return left + (x - 1) * (right - left) / max(1, stop - 1)

    def py(c):
        return bottom - (c - cmin) * (bottom - top) / (cmax - cmin)

    name = (f"{q}{_sup(head)} + " if head else "") + f"{q}{_sup(power)} − x"
    out = [f'<svg viewBox="0 0 660 280" role="img" aria-label="Цифры {digit} в записи {name}">']
    out.append(
        f'<line x1="{left}" y1="{bottom}" x2="{right}" y2="{bottom}" stroke="{INK}" stroke-width="1.25"/>'
    )
    out.append(
        f'<line x1="{left}" y1="{top}" x2="{left}" y2="{bottom}" stroke="{INK}" stroke-width="1.25"/>'
    )
    for c in range(cmin, cmax + 1):
        if (cmax - cmin) <= 8 or c % max(1, (cmax - cmin) // 5) == 0:
            out.append(_text(left - 8, py(c) + 4, str(c), 12, MUTED, "end"))
    for x in xs:
        if x == 1 or x % 10 == 0:
            out.append(_text(px(x), bottom + 18, str(x), 12, MUTED, "middle"))
    out.append(_text(right + 4, bottom + 4, "x", 13, MUTED))
    if target is not None:
        y = py(target)
        out.append(
            f'<line x1="{left}" y1="{y:.1f}" x2="{right}" y2="{y:.1f}" stroke="{MUTED}" '
            'stroke-width="1.25" stroke-dasharray="5 4"/>'
        )
        good = [x for x, c in zip(xs, cs, strict=True) if c == target]
    else:
        best = max(cs)
        good = [x for x, c in zip(xs, cs, strict=True) if c == best]
    for x, c in zip(xs, cs, strict=True):
        on = x in good
        out.append(
            f'<circle cx="{px(x):.1f}" cy="{py(c):.1f}" r="{3.6 if on else 3}" '
            f'fill="{INK if on else "#fff"}" stroke="{INK if on else MUTED}" stroke-width="1.2"/>'
        )
    mark = good[-1] if target is not None else good[0]
    mc = cs[mark - 1]
    out.append(
        f'<circle cx="{px(mark):.1f}" cy="{py(mc):.1f}" r="10" fill="none" stroke="{ACCENT}" stroke-width="2"/>'
    )
    if target is not None:
        note = f"● — ровно {target} {_digits_word(target)} {digit} ({len(good)} значений x); в кольце — наибольший x = {mark}"
    else:
        note = f"● — наибольшее количество, {mc}; в кольце — наименьший x с ним, {mark}"
    out.append(
        _text(
            330, 248, f"сколько цифр {digit} в записи {name} по основанию {q}", 13, MUTED, "middle"
        )
    )
    out.append(_text(330, 270, note, 13, INK, "middle"))
    out.append("</svg>")
    return "".join(out)


def _digits_word(n: int) -> str:
    """«цифры» after 2, 3, 4 (not 12–14), otherwise «цифр»."""
    return "цифры" if n % 10 in (2, 3, 4) and n % 100 not in (12, 13, 14) else "цифр"


# --- pairs of unknown digits --------------------------------------------------------


def base_pair_grid(a: str = "1xy", qa: int = 5, b: str = "2yx", qb: int = 7, k: int = 5) -> str:
    """Grid of pairs (x, y) in nested-loop order; sums divisible by k shown."""
    lim = min(qa, qb)
    cell = 64
    x0, y0 = 150, 48
    out = [
        f'<svg viewBox="0 0 660 {y0 + lim * cell + 64}" role="img" aria-label="Пары цифр x и y">'
    ]
    out.append(_text(x0 + lim * cell / 2, 20, "y — внутренний цикл →", 13, MUTED, "middle"))
    out.append(_text(x0 - 40, y0 - 10, "x ↓", 13, MUTED, "end"))
    sums = {}
    order = []
    for x in range(lim):
        for y in range(lim):
            s = _value(a, qa, {"x": x, "y": y}) + _value(b, qb, {"x": x, "y": y})
            sums[x, y] = s
            if s % k == 0:
                order.append((x, y))
    first = order[0]
    best = min(order, key=lambda p: sums[p])
    for y in range(lim):
        out.append(_text(x0 + y * cell + cell / 2, y0 - 10, str(y), 13, INK, "middle", 600))
    for x in range(lim):
        out.append(_text(x0 - 14, y0 + x * cell + cell / 2 + 5, str(x), 13, INK, "end", 600))
        for y in range(lim):
            good = (x, y) in order
            cx, cy = x0 + y * cell, y0 + x * cell
            out.append(
                f'<rect x="{cx + 3}" y="{cy + 3}" width="{cell - 6}" height="{cell - 6}" rx="6" '
                f'fill="{WASH if good else "#fff"}" stroke="{INK if good else FAINT}" stroke-width="1.25"/>'
            )
            out.append(
                _text(
                    cx + cell / 2,
                    cy + cell / 2 + 6,
                    str(sums[x, y]),
                    16 if good else 12,
                    INK if good else MUTED,
                    "middle",
                    600 if good else 400,
                )
            )
    for (x, y), shape in ((first, "circle"), (best, "rect")):
        cx, cy = x0 + y * cell + cell / 2, y0 + x * cell + cell / 2
        if shape == "circle":
            out.append(
                f'<circle cx="{cx}" cy="{cy}" r="{cell / 2 - 4}" fill="none" stroke="{ACCENT}" stroke-width="2"/>'
            )
        else:
            out.append(
                f'<rect x="{cx - cell / 2 + 1}" y="{cy - cell / 2 + 1}" width="{cell - 2}" '
                f'height="{cell - 2}" rx="8" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>'
            )
    lx = x0 + lim * cell + 24
    out.append(_text(lx, y0 + 18, f"кратно {k}:", 13, MUTED))
    for i, (x, y) in enumerate(order):
        out.append(_text(lx, y0 + 40 + i * 20, f"{i + 1}) x = {x}, y = {y}: {sums[x, y]}", 13, INK))
    out.append(
        _text(
            330,
            y0 + lim * cell + 40,
            f"○ — первая найденная пара, {sums[first]};  □ — наименьшая сумма, {sums[best]}",
            14,
            INK,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


BASE_FIGURES: dict = {
    "base_carry": base_carry,
    "base_borrow": base_borrow,
    "base_minus": base_minus,
    "base_blocks": base_blocks,
    "base_groups": base_groups,
    "base_count_plot": base_count_plot,
    "base_pair_grid": base_pair_grid,
}
BASE_STEPPERS: dict = {"base_carry": base_carry_frames, "base_borrow": base_borrow_frames}
BASE_WIDGETS: dict = {}
BASE_SCRIPTS: dict = {}
