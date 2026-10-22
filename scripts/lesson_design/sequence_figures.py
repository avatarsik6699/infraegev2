"""Figures of topic 17 «Числовые последовательности» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.

``seq_strip(values)`` — elements in cells: the ordinary number above, the
Python index below, the last index n − 1 accented.
``seq_windows(values, k)`` — every group of k neighbours as a bracket under
the strip; brackets overlap, the last group starts at n − k.
``seq_negmod(x, d)`` — x on the number line between multiples of d: Python's
x % d is the distance from the multiple on the left, the last digit of the
record is the remainder of abs(x).
``seq_threshold(values, ending, k, at_most)`` — the running maximum of the
elements with a given ending, element by element: the threshold is known
only after the last element; the groups of k that pass the final threshold
(above it, or not above it with ``at_most``) are marked.
``seq_triangle(sides)`` — sorted sides p ≤ q ≤ r drawn as segments: p and q
laid end to end along r either fall short, just reach it or overlap it.
``seq_pair_grid(values)`` — the n × n table of index pairs: the cells i < j
are the pairs, the diagonal and the mirrored half are not counted.
``seq_roles(pair, d, limit)`` — three wordings of two properties on one pair
as patterns of a 2 × 2 grid: by columns, by the diagonal, by a row.
``seq_broken(sort_values, filter_values)`` — sorting or dropping elements
creates pairs that were never neighbours.
``seq_order(values)`` — «квадрат минимума» and «минимум квадратов» as two
chains of the same actions in the opposite order.
``seq_bucket_stepper(values, m)`` — pairs with a sum divisible by m counted by
remainders: for each new number the partners already met are counted at once.
"""

from __future__ import annotations

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stepper, _text

CELL, GAP = 64, 8


def _cell(x, y, label, w=CELL, h=44, hot=False, faint=False, size=19) -> str:
    stroke = ACCENT if hot else (FAINT if faint else INK)
    size = 17 if w == CELL and len(label) >= 5 else size  # −2100 fits the cell
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w}" height="{h}" rx="6" '
        f'fill="{WASH if hot else "#fff"}" stroke="{stroke}" stroke-width="{2 if hot else 1.5}"/>'
        + _text(x + w / 2, y + h * 0.66, label, size, MUTED if faint else INK, "middle", 600)
    )


def _minus(x: int) -> str:
    """−12 with a real minus sign, as in the lesson text."""
    return str(x).replace("-", "−")


def _left(n: int, width: int = 660, label: float = 0) -> float:
    """The left edge of a centred strip of n cells, moved right of its row labels."""
    return max((width - (n * CELL + (n - 1) * GAP)) / 2, label)


# --- elements, numbers and indexes ----------------------------------------------


def seq_strip(values: list[int] | None = None) -> str:
    values = values or [8, -12, 5, 20, -3, 14]
    n = len(values)
    left = _left(n, label=86)
    out = ['<svg viewBox="0 0 660 150" role="img" aria-label="Элементы, их номера и индексы">']
    out.append(_text(left - 12, 30, "номер", 13, MUTED, "end"))
    out.append(_text(left - 12, 76, "значение", 13, MUTED, "end"))
    out.append(_text(left - 12, 122, "индекс", 13, MUTED, "end"))
    for i, v in enumerate(values):
        x = left + i * (CELL + GAP)
        last = i == n - 1
        out.append(_text(x + CELL / 2, 30, str(i + 1), 14, MUTED, "middle"))
        out.append(_cell(x, 46, _minus(v), hot=last))
        out.append(
            _text(
                x + CELL / 2,
                122,
                f"a[{i}]",
                15,
                ACCENT if last else INK,
                "middle",
                600 if last else 400,
            )
        )
    out.append(
        _text(
            330,
            145,
            f"n = len(a) = {n}, последний индекс — n − 1 = {n - 1}",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- groups of neighbours --------------------------------------------------------


def seq_windows(values: list[int] | None = None, k: int = 2) -> str:
    values = values or [8, -12, 5, 20, -3, 14]
    n = len(values)
    left = _left(n, label=62)
    starts = list(range(n - k + 1))
    levels = 2 if k == 2 else 3
    height = 112 + levels * 30 + 30
    out = [f'<svg viewBox="0 0 660 {height}" role="img" aria-label="Соседние группы по {k}">']
    for i, v in enumerate(values):
        x = left + i * (CELL + GAP)
        out.append(_cell(x, 30, _minus(v)))
        out.append(_text(x + CELL / 2, 96, str(i), 13, MUTED, "middle"))
    out.append(_text(left - 12, 96, "индекс", 13, MUTED, "end"))
    for s in starts:
        y = 116 + (s % levels) * 30
        x1 = left + s * (CELL + GAP) + 6
        x2 = left + (s + k - 1) * (CELL + GAP) + CELL - 6
        last = s == starts[-1]
        color = ACCENT if last else INK
        out.append(
            f'<path d="M {x1:.1f} {y - 8} v 8 H {x2:.1f} v -8" fill="none" stroke="{color}" '
            f'stroke-width="{2 if last else 1.5}" stroke-linejoin="round"/>'
        )
        out.append(
            _text((x1 + x2) / 2, y + 18, f"i = {s}", 13, color, "middle", 600 if last else 400)
        )
    word = {2: "пар", 3: "троек", 4: "четвёрок"}.get(k, "групп")
    out.append(
        _text(
            330,
            height - 8,
            f"n = {n}: последнее начало i = n − {k} = {n - k}, всего {word} n − {k - 1} = {n - k + 1}",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- remainders of negative numbers ---------------------------------------------


def seq_negmod(x: int = -17, d: int = 10) -> str:
    q, r = x // d, x % d
    lo, hi = (q - 1) * d, (q + 2) * d
    left, right, base = 40, 620, 92

    def pos(v: float) -> float:
        return left + (v - lo) / (hi - lo) * (right - left)

    out = [f'<svg viewBox="0 0 660 200" role="img" aria-label="Остаток {x} от деления на {d}">']
    out.append(
        f'<line x1="{left}" y1="{base}" x2="{right}" y2="{base}" stroke="{INK}" stroke-width="1.5"/>'
    )
    for v in range(lo, hi + 1, max(1, d // 10)):
        tall = v % d == 0
        out.append(
            f'<line x1="{pos(v):.1f}" y1="{base - (7 if tall else 3)}" x2="{pos(v):.1f}" '
            f'y2="{base + (7 if tall else 3)}" stroke="{INK if tall else FAINT}"/>'
        )
        if tall:
            out.append(_text(pos(v), base + 28, _minus(v), 14, INK, "middle"))
    m = q * d
    out.append(
        f'<path d="M {pos(m):.1f} {base - 14} Q {(pos(m) + pos(x)) / 2:.1f} {base - 56} '
        f'{pos(x):.1f} {base - 14}" fill="none" stroke="{ACCENT}" stroke-width="2"/>'
    )
    out.append(_text((pos(m) + pos(x)) / 2, base - 44, f"+{r}", 15, ACCENT, "middle", 600))
    out.append(f'<circle cx="{pos(x):.1f}" cy="{base}" r="6" fill="{ACCENT}"/>')
    near = min(x - m, m + d - x) <= d / 4  # the label would cover a tick label
    out.append(_text(pos(x), base + (50 if near else 28), _minus(x), 15, ACCENT, "middle", 600))
    out.append(_text(pos(m), 22, f"ближайшее слева кратное {d}: {_minus(m)}", 13, MUTED, "middle"))
    out.append(
        _text(
            330,
            166,
            f"{_minus(x)} = ({_minus(q)}) · {d} + {r}, поэтому {_minus(x)} % {d} = {r}",
            15,
            INK,
            "middle",
        )
    )
    a = abs(x)
    digits = {10: "последняя цифра", 100: "две последние цифры"}[d]
    out.append(
        _text(
            330,
            190,
            f"{digits} записи — остаток модуля: {a} = {a // d} · {d} + {a % d}",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- a threshold of the whole sequence -------------------------------------------


def seq_threshold(
    values: list[int] | None = None, ending: int = 17, k: int = 2, at_most: bool = False
) -> str:
    """Groups of k neighbours against the final threshold: a sum passes when it is
    above it, or not above it with ``at_most``."""
    values = values or [30, 117, 95, 120, 217]
    mod = 10 ** len(str(ending))
    n = len(values)
    left = _left(n, label=86)
    running, best = [], None
    for v in values:
        if abs(v) % mod == ending and (best is None or v > best):
            best = v
        running.append(best)
    final = running[-1]
    levels = 2 if k == 2 else 3
    height = 176 + levels * 34 + 34
    out = [
        f'<svg viewBox="0 0 660 {height}" role="img" '
        'aria-label="Порог меняется до последнего элемента">'
    ]
    out.append(_text(left - 12, 58, "элемент", 13, MUTED, "end"))
    out.append(_text(left - 12, 112, "порог", 13, MUTED, "end"))
    out.append(_text(left - 12, 128, "после него", 13, MUTED, "end"))
    for i, v in enumerate(values):
        x = left + i * (CELL + GAP)
        ends = abs(v) % mod == ending
        out.append(_cell(x, 30, _minus(v), hot=ends))
        shown = "—" if running[i] is None else _minus(running[i])
        changed = running[i] is not None and (i == 0 or running[i] != running[i - 1])
        out.append(_text(x + CELL / 2, 120, shown, 16, ACCENT if changed else MUTED, "middle", 600))
    for i in range(n - k + 1):
        s = sum(values[i : i + k])
        x1 = left + i * (CELL + GAP) + CELL / 2
        x2 = x1 + (k - 1) * (CELL + GAP)
        y = 164 + (i % levels) * 34
        good = s <= final if at_most else s > final
        sign = ("≤" if good else ">") if at_most else (">" if good else "≤")
        color = INK if good else FAINT
        out.append(
            f'<path d="M {x1:.1f} {y - 8} v 8 H {x2:.1f} v -8" fill="none" stroke="{color}" '
            f'stroke-width="1.5"/>'
        )
        out.append(
            _text(
                (x1 + x2) / 2,
                y + 17,
                f"{_minus(s)} {sign} {_minus(final)}",
                13,
                INK if good else MUTED,
                "middle",
            )
        )
    out.append(
        _text(
            330,
            height - 8,
            f"окончательный порог {_minus(final)} известен только после просмотра всех элементов",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- triangles ---------------------------------------------------------------------


def seq_triangle(sides: list[list[int]] | None = None) -> str:
    sides = sides or [[1, 2, 3], [2, 3, 4]]
    longest = max(max(sum(sorted(t)[:2]), max(t)) for t in sides)
    unit = 400 / longest
    row_h = 92
    height = 20 + len(sides) * row_h
    out = [
        f'<svg viewBox="0 0 660 {height}" role="img" aria-label="Две меньшие стороны вдоль большей">'
    ]
    for k, triple in enumerate(sides):
        p, q, r = sorted(triple)
        y = 30 + k * row_h
        x0 = 150
        out.append(_text(20, y + 26, f"{p}, {q}, {r}", 17, INK, weight=600))
        out.append(
            f'<line x1="{x0}" y1="{y + 32}" x2="{x0 + r * unit}" y2="{y + 32}" '
            f'stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
        )
        out.append(_text(x0 + r * unit + 10, y + 37, f"r = {r}", 14, INK))
        out.append(
            f'<line x1="{x0}" y1="{y + 12}" x2="{x0 + p * unit}" y2="{y + 12}" '
            f'stroke="{MUTED}" stroke-width="4" stroke-linecap="round"/>'
        )
        out.append(
            f'<line x1="{x0 + p * unit + 4}" y1="{y + 12}" x2="{x0 + (p + q) * unit}" y2="{y + 12}" '
            f'stroke="{ACCENT}" stroke-width="4" stroke-linecap="round"/>'
        )
        out.append(_text(x0 + p * unit / 2, y + 2, f"p = {p}", 13, MUTED, "middle"))
        out.append(_text(x0 + p * unit + q * unit / 2, y + 2, f"q = {q}", 13, ACCENT, "middle"))
        if p + q > r:
            verdict = f"{p} + {q} = {p + q} > {r}: концы можно поднять и свести в вершину — треугольник есть"
        elif p + q == r:
            verdict = f"{p} + {q} = {r}: стороны лягут на одну прямую — треугольника нет"
        else:
            verdict = f"{p} + {q} = {p + q} < {r}: стороны не дотянутся — треугольника нет"
        out.append(_text(x0, y + 62, verdict, 13, MUTED))
    out.append("</svg>")
    return "".join(out)


# --- pairs of any two positions ------------------------------------------------------


def seq_pair_grid(values: list[int] | None = None) -> str:
    values = values or [4, 6, 11, 9]
    n = len(values)
    size = 62
    left, top = 150, 62
    out = [
        f'<svg viewBox="0 0 660 {top + n * size + 40}" role="img" aria-label="Пары индексов i &lt; j">'
    ]
    out.append(_text(left + n * size / 2, 20, "j — второй элемент пары", 13, MUTED, "middle"))
    out.append(_text(left - 46, top - 14, "i", 13, MUTED, "middle"))
    count = 0
    for i in range(n):
        out.append(
            _text(left - 46, top + i * size + size * 0.6, f"{i}: {values[i]}", 14, INK, "middle")
        )
        out.append(
            _text(left + i * size + size / 2, top - 10, f"{i}: {values[i]}", 14, INK, "middle")
        )
        for j in range(n):
            x, y = left + j * size, top + i * size
            if i < j:
                count += 1
                fill, stroke, label, color = "#fff", INK, f"{values[i] + values[j]}", INK
            elif i == j:
                fill, stroke, label, color = WASH, FAINT, "×", MUTED
            else:
                fill, stroke, label, color = WASH, FAINT, "", MUTED
            out.append(
                f'<rect x="{x}" y="{y}" width="{size}" height="{size}" fill="{fill}" '
                f'stroke="{stroke}" stroke-width="1.25"/>'
            )
            if label:
                out.append(_text(x + size / 2, y + size * 0.6, label, 15, color, "middle", 600))
    right = left + n * size + 24
    out.append(_text(right, top + 22, "клетка над диагональю —", 13, INK))
    out.append(_text(right, top + 40, "пара i < j и её сумма", 13, INK))
    out.append(_text(right, top + 70, "× — элемент сам с собой", 13, MUTED))
    out.append(_text(right, top + 100, "под диагональю — те же пары", 13, MUTED))
    out.append(_text(right, top + 118, "в обратном порядке", 13, MUTED))
    out.append(
        _text(
            right,
            top + 154,
            f"пар: {n} · {n - 1} / 2 = {count}",
            15,
            ACCENT,
            weight=600,
        )
    )
    out.append("</svg>")
    return "".join(out)


def _bucket_frame(m, counts, best_by, x, note, count, best) -> str:
    out = ['<svg viewBox="0 0 660 210" role="img" aria-hidden="true">']
    out.append(_text(20, 26, "уже встречены, по остаткам:", 13, MUTED))
    w = 96
    for r in range(m):
        cx = 20 + r * (w + 10)
        hot = note is not None and r == note[1]
        out.append(
            f'<rect x="{cx}" y="38" width="{w}" height="76" rx="6" fill="{WASH if hot else "#fff"}" '
            f'stroke="{ACCENT if hot else INK}" stroke-width="{2 if hot else 1.25}"/>'
        )
        out.append(_text(cx + w / 2, 58, f"остаток {r}", 13, MUTED, "middle"))
        out.append(_text(cx + w / 2, 82, f"чисел: {counts[r]}", 15, INK, "middle", 600))
        b = "—" if best_by[r] is None else str(best_by[r])
        out.append(_text(cx + w / 2, 104, f"наиб.: {b}", 13, INK, "middle"))
    if x is not None and note is not None:
        out.append(
            _text(
                20,
                150,
                f"x = {x}, остаток {x % m}, нужен партнёр с остатком {note[1]}",
                15,
                INK,
                weight=600,
            )
        )
    out.append(
        _text(20, 184, f"пар найдено: {count}", 15, ACCENT if x is not None else INK, weight=600)
    )
    out.append(_text(240, 184, f"наибольшая сумма: {'—' if best is None else best}", 15, INK))
    out.append("</svg>")
    return "".join(out)


def seq_bucket_frames(values: list[int] | None = None, m: int = 5) -> list[tuple[str, str]]:
    values = values or [4, 6, 11, 9]
    counts = [0] * m
    best_by: list[int | None] = [None] * m
    count, best = 0, None
    frames = [
        (
            _bucket_frame(m, counts, best_by, None, None, count, best),
            "Ещё ни одного числа не встречено: у каждого остатка 0 чисел.",
        )
    ]
    for x in values:
        r = x % m
        need = (-r) % m
        found = counts[need]
        count += found
        partner_best = best_by[need]
        if partner_best is not None and (best is None or x + partner_best > best):
            best = x + partner_best
        partner = (
            f"с ним дают пары все {found} прежних с остатком {need}"
            if found
            else f"прежних чисел с остатком {need} нет — пар с {x} пока нет"
        )
        frames.append(
            (
                _bucket_frame(m, counts, best_by, x, (r, need), count, best),
                f"x = {x}: остаток {r}, нужен остаток {need}; {partner}. Пар всего: {count}.",
            )
        )
        counts[r] += 1
        own_best = best_by[r]
        if own_best is None or x > own_best:
            best_by[r] = x
    frames.append(
        (
            _bucket_frame(m, counts, best_by, None, None, count, best),
            f"Все числа обработаны: {count} пары, наибольшая сумма {best}. "
            "Каждое число добавлено к своему остатку только после подсчёта.",
        )
    )
    return frames


def seq_bucket_stepper(values: list[int] | None = None, m: int = 5) -> str:
    return _stepper(seq_bucket_frames(values, m))


# --- roles of two properties in a pair ------------------------------------------


def _line(x1, y1, x2, y2, color=INK, width=1.5, dashed=False) -> str:
    dash = ' stroke-dasharray="5 4"' if dashed else ""
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{color}" '
        f'stroke-width="{width}"{dash}/>'
    )


def _box(x, y, w, h, color=INK, width=1.5, fill="none") -> str:
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="5" '
        f'fill="{fill}" stroke="{color}" stroke-width="{width}"/>'
    )


def seq_roles(pair: list[int] | None = None, d: int = 3, limit: int = 10) -> str:
    """Three wordings on one pair: «хотя бы … и хотя бы …» reads the grid by
    columns, «одно…, а другое…» by the diagonals (two different elements),
    «одновременно» by a row (one element)."""
    pair = pair or [3, 100]
    has = [[v % d == 0, v < limit] for v in pair]
    heads = [f"кратно {d}", f"< {limit}"]
    by_columns = any(r[0] for r in has) and any(r[1] for r in has)
    by_diagonal = (has[0][0] and has[1][1]) or (has[1][0] and has[0][1])
    by_row = any(r[0] and r[1] for r in has)
    a, z = (_minus(v) for v in pair)
    panels = [
        (
            "хотя бы одно кратно 3",
            "и хотя бы одно < 10",
            ["в каждом столбце есть «да»"],
            by_columns,
        ),
        (
            "одно кратно 3,",
            "а другое < 10",
            [
                f"{a} кратно 3, {z} < 10: {'да' if has[0][0] and has[1][1] else 'нет'}",
                f"{z} кратно 3, {a} < 10: {'да' if has[1][0] and has[0][1] else 'нет'}",
            ],
            by_diagonal,
        ),
        (
            "хотя бы одно одновременно",
            "кратно 3 и < 10",
            ["вся строка одного числа — «да»"],
            by_row,
        ),
    ]
    cw, ch, lw = 58, 34, 44
    out = ['<svg viewBox="0 0 660 250" role="img" aria-label="Три формулировки на одной паре">']
    for p, (t1, t2, how, ok) in enumerate(panels):
        x0 = 8 + p * 220
        gx, gy = x0 + lw, 86
        out.append(_text(x0 + 104, 20, t1, 13, INK, "middle", 600))
        out.append(_text(x0 + 104, 38, t2, 13, INK, "middle", 600))
        for c, head in enumerate(heads):
            out.append(_text(gx + c * cw + cw / 2, gy - 10, head, 12, MUTED, "middle"))
        for r, v in enumerate(pair):
            out.append(_text(gx - 10, gy + r * ch + ch * 0.62, _minus(v), 14, INK, "end", 600))
            for c in range(2):
                yes = has[r][c]
                out.append(_box(gx + c * cw, gy + r * ch, cw, ch, FAINT, 1.25, "#fff"))
                out.append(
                    _text(
                        gx + c * cw + cw / 2,
                        gy + r * ch + ch * 0.62,
                        "да" if yes else "нет",
                        14,
                        INK if yes else MUTED,
                        "middle",
                        600 if yes else 400,
                    )
                )
        if p == 0:
            # a column is read top to bottom: it passes when it has a «да» anywhere
            for c in range(2):
                found = any(has[r][c] for r in range(2))
                out.append(
                    _box(
                        gx + c * cw + 3,
                        gy + 3,
                        cw - 6,
                        2 * ch - 6,
                        ACCENT if found else MUTED,
                        2 if found else 1.25,
                    )
                )
        elif p == 2:
            for r in range(2):
                if has[r][0] and has[r][1]:
                    out.append(_box(gx + 3, gy + r * ch + 3, 2 * cw - 6, ch - 6, ACCENT, 2))
        for k, line in enumerate(how):
            out.append(_text(x0 + 104, 176 + k * 16, line, 12, MUTED, "middle"))
        out.append(
            _text(
                x0 + 104,
                220,
                "подходит" if ok else "не подходит",
                15,
                ACCENT if ok else INK,
                "middle",
                600,
            )
        )
    out.append(
        _text(
            330,
            242,
            f"пара ({_minus(pair[0])}, {_minus(pair[1])}): строки — числа пары, столбцы — свойства",
            12,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- transformations that break neighbourhood ----------------------------------------


def _row_with_pairs(x0, y, values, new_pairs=(), w=50, gap=6) -> list[str]:
    out = []
    for i, v in enumerate(values):
        out.append(_cell(x0 + i * (w + gap), y, _minus(v), w=w, h=38, size=16))
    for i in range(len(values) - 1):
        x1 = x0 + i * (w + gap) + w / 2
        x2 = x1 + w + gap
        new = (values[i], values[i + 1]) in new_pairs
        color = ACCENT if new else MUTED
        yy = y + 50 + (i % 2) * 12
        out.append(
            f'<path d="M {x1:.1f} {yy - 6} v 6 H {x2:.1f} v -6" fill="none" stroke="{color}" '
            f'stroke-width="{2 if new else 1.25}"/>'
        )
    return out


def seq_broken(sort_values: list[int] | None = None, filter_values: list[int] | None = None) -> str:
    """Sorting the whole list and dropping elements create neighbours that
    were never neighbours: the new pairs are accented."""
    sort_values = sort_values or [10, 1, 20]
    filter_values = filter_values or [2, 7, 4]
    rows = [
        ("a.sort()", sort_values, sorted(sort_values)),
        ("только чётные", filter_values, [v for v in filter_values if v % 2 == 0]),
    ]
    out = ['<svg viewBox="0 0 660 240" role="img" aria-label="Сортировка и отбор меняют соседей">']
    for k, (label, before, after) in enumerate(rows):
        y = 26 + k * 104
        old = {frozenset(p) for p in zip(before, before[1:], strict=False)}
        new = [p for p in zip(after, after[1:], strict=False) if frozenset(p) not in old]
        out.extend(_row_with_pairs(20, y, before))
        out.append(_text(250, y + 16, label, 13, MUTED, "middle"))
        out.append(_line(200, y + 26, 296, y + 26, MUTED))
        out.append(f'<path d="M 296 {y + 26} l -8 -4 v 8 z" fill="{MUTED}"/>')
        out.extend(_row_with_pairs(320, y, after, new_pairs=set(new)))
        names = ", ".join(f"({_minus(a)}, {_minus(b)})" for a, b in new)
        out.append(_text(320, y + 84, f"новая пара {names}", 13, ACCENT, "start", 600))
    out.append("</svg>")
    return "".join(out)


# --- order of actions in a wording ----------------------------------------------------


def seq_order(values: list[int] | None = None) -> str:
    """«квадрат минимума» and «минимум квадратов»: the same actions in the
    opposite order give different numbers."""
    values = values or [-20, -3, 8]
    lo = min(values)
    squares = [v * v for v in values]
    rows = [
        ("квадрат минимума", [("min", [lo]), ("в квадрат", [lo * lo])]),
        ("минимум квадратов", [("в квадрат", squares), ("min", [min(squares)])]),
    ]
    out = ['<svg viewBox="0 0 660 204" role="img" aria-label="Порядок действий в формулировке">']
    for k, (label, steps) in enumerate(rows):
        y = 44 + k * 82
        out.append(_text(20, y - 12, label, 13, MUTED))
        x = 20
        stages = [values] + [vals for _, vals in steps]
        for s, vals in enumerate(stages):
            text = ", ".join(_minus(v) for v in vals)
            w = max(52, 14 + 10 * len(text))
            last = s == len(stages) - 1
            out.append(_cell(x, y, text, w=w, h=38, hot=last, size=16))
            x += w
            if not last:
                op = steps[s][0]
                out.append(_line(x + 6, y + 19, x + 88, y + 19, MUTED))
                out.append(f'<path d="M {x + 88} {y + 19} l -8 -4 v 8 z" fill="{MUTED}"/>')
                out.append(_text(x + 47, y + 11, op, 13, INK, "middle", 600))
                x += 94
    out.append(
        _text(
            330,
            196,
            f"те же два действия в другом порядке: {lo * lo} и {min(squares)}",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


SEQUENCE_FIGURES: dict = {
    "seq_strip": seq_strip,
    "seq_windows": seq_windows,
    "seq_negmod": seq_negmod,
    "seq_threshold": seq_threshold,
    "seq_triangle": seq_triangle,
    "seq_pair_grid": seq_pair_grid,
    "seq_bucket_stepper": seq_bucket_stepper,
    "seq_roles": seq_roles,
    "seq_broken": seq_broken,
    "seq_order": seq_order,
}
SEQUENCE_STEPPERS: dict = {"seq_bucket_stepper": seq_bucket_frames}
SEQUENCE_WIDGETS: dict = {}
SEQUENCE_SCRIPTS: dict = {}
