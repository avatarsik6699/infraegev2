"""Figures of topic 26 «Обработка данных: сортировка и выбор» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.
All keys start with ``greedy_`` so they never clash with other topics.

``greedy_fill(sizes, cap)`` — sorted sizes laid into a capacity bar one after
another; the first one that does not fit sticks out past the capacity line.
``greedy_room(sizes, cap)`` — the k − 1 smallest fixed in the bar, the room left
for the last one and every remaining size against that room.
``greedy_compare(sizes, chosen)`` — the k smallest and another set of k sizes,
both sorted, joined position by position: every chosen size is not smaller.
``greedy_chain(sizes, gap)`` — a chain of nested boxes built from the outside,
one frame per box: the allowed zone and the largest size in it.
``greedy_trips(weights, cap)`` — two pointers over sorted weights, one frame per
trip: the heaviest goes, with the lightest if they fit together.
``greedy_row(marked, length, need=…, series=…)`` — one row of places: marked ones
filled; gaps between neighbours (b − a − 1) or the series of marked places.
``greedy_timeline(intervals, picked=…, merged=…, load=…)`` — intervals as bars on a
time axis; the picked ones stand out; optionally the union of the bars or the
number of active intervals between the events.
``greedy_cells(k, requests, strict=…)`` — storage cells over time: each accepted
request is a bar in its cell, a rejected one is listed under the chart.
``greedy_window(values, d)`` — a sliding window over a sorted list, one frame per
right end: the left end moves only forward.
``greedy_blocks(sizes, gap)`` — sizes on a line split into blocks (chains); the
sizes closer than the gap to each other must lie in different blocks.
"""

from __future__ import annotations

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stepper, _text, ru_count

W = 660


def _rect(x, y, w, h, fill="#fff", stroke=INK, width=1.5, dash="", rx=4) -> str:
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{max(w, 0):.1f}" height="{h:.1f}" rx="{rx}" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="{width}"{d}/>'
    )


def _line(x1, y1, x2, y2, color=INK, width=1.5, dash="") -> str:
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
        f'stroke="{color}" stroke-width="{width}"{d}/>'
    )


def _svg(h: int, label: str) -> str:
    return f'<svg viewBox="0 0 {W} {h}" role="img" aria-label="{label}">'


# --- filling a capacity with the smallest sizes ------------------------------------


def greedy_fill(sizes: list[int], cap: int) -> str:
    """Sorted sizes into a bar of length cap; the first misfit sticks out."""
    a = sorted(sizes)
    x0, scale = 40, 520 / (cap * 1.3)
    out = [_svg(200, f"Самые маленькие размеры подряд при вместимости {cap}")]
    used, count = 0, 0
    y = 70
    out.append(_text(x0, 34, f"вместимость {cap}", 15, INK, "start", 600))
    out.append(_rect(x0, y, cap * scale, 44, WASH, INK, 1.5))
    for s in a:
        fits = used + s <= cap
        x = x0 + used * scale
        out.append(
            _rect(
                x, y + 6, s * scale, 32, "#fff", INK if fits else ACCENT, 1.5, "" if fits else "5 4"
            )
        )
        out.append(
            _text(x + s * scale / 2, y + 28, str(s), 14, INK if fits else ACCENT, "middle", 600)
        )
        if not fits:
            out.append(
                _text(
                    x + s * scale / 2,
                    y + 80,
                    f"{used} + {s} = {used + s} > {cap}",
                    14,
                    ACCENT,
                    "middle",
                )
            )
            break
        used += s
        count += 1
    xc = x0 + cap * scale
    out.append(_line(xc, y - 14, xc, y + 50, INK, 2))
    rest = a[count + 1 :]
    if rest:
        out.append(
            _text(
                x0,
                186,
                "дальше: " + ", ".join(map(str, rest)) + " — ещё больше, поэтому break",
                14,
                MUTED,
            )
        )
    out.append(_text(xc + 8, y - 4, f"занято {used} из {cap}", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


def greedy_room(sizes: list[int], cap: int) -> str:
    """k − 1 smallest fixed; the room left; each remaining size against the room."""
    a = sorted(sizes)
    used = count = 0
    for s in a:
        if used + s > cap:
            break
        used += s
        count += 1
    fixed = a[: count - 1]
    room = cap - sum(fixed)
    x0, scale = 40, 470 / (cap * 1.15)
    h = 140 + 34 * (len(a) - len(fixed))
    out = [_svg(h, f"Закреплены {len(fixed)} самых маленьких, свободно {room}")]
    out.append(
        _text(
            x0,
            30,
            f"вместимость {cap}: закреплены {len(fixed)} самых маленьких",
            15,
            INK,
            "start",
            600,
        )
    )
    y = 46
    out.append(_rect(x0, y, cap * scale, 40, WASH, INK))
    x = x0
    for s in fixed:
        out.append(_rect(x, y + 5, s * scale, 30))
        out.append(_text(x + s * scale / 2, y + 25, str(s), 14, INK, "middle", 600))
        x += s * scale
    out.append(_text(x + room * scale / 2, y + 25, f"место {room}", 14, ACCENT, "middle", 600))
    out.append(_rect(x, y + 5, room * scale, 30, "none", ACCENT, 1.5, "5 4"))
    best = max((s for s in a[count - 1 :] if s <= room), default=None)
    yy = y + 70
    for s in a[count - 1 :]:
        ok = s <= room
        out.append(
            _rect(
                x,
                yy,
                s * scale,
                24,
                "#fff",
                ACCENT if s == best else (INK if ok else FAINT),
                2 if s == best else 1.5,
            )
        )
        out.append(_text(x - 10, yy + 17, str(s), 14, INK if ok else MUTED, "end", 600))
        note = "наибольший подходящий" if s == best else ("помещается" if ok else "не помещается")
        # notes start past the capacity line so the line never crosses them
        nx = max(x + s * scale, x0 + cap * scale) + 10
        out.append(_text(nx, yy + 17, note, 13, ACCENT if s == best else MUTED))
        yy += 34
    out.append(_line(x0 + cap * scale, y - 8, x0 + cap * scale, yy, INK, 1.5, "3 3"))
    out.append("</svg>")
    return "".join(out)


def greedy_compare(sizes: list[int], chosen: list[int]) -> str:
    """The k smallest against another k sizes, both sorted, position by position."""
    a = sorted(sizes)
    b = sorted(chosen)
    k = len(b)
    step = 540 / len(a)
    x0 = 100
    sa, sb = sum(a[:k]), sum(b)
    out = [_svg(272, f"{k} самых маленьких и другой набор из {k}")]
    out.append(_text(x0, 16, f"все размеры; первые {k} — сумма {sa}", 14, INK, "start", 600))
    out.append(_text(x0 - 14, 47, "все", 14, MUTED, "end"))
    pos: dict[int, list[float]] = {}
    taken: dict[int, int] = {}
    for i, s in enumerate(a):
        cx = x0 + i * step + step / 2
        out.append(_rect(cx - 22, 26, 44, 30, WASH if i < k else "#fff", INK if i < k else FAINT))
        out.append(_text(cx, 47, str(s), 15, INK, "middle", 600))
        pos.setdefault(s, []).append(cx)
    out.append(_text(x0 - 14, 199, "набор", 14, MUTED, "end"))
    for j, s in enumerate(b):
        idx = taken.get(s, 0)
        taken[s] = idx + 1
        cx = pos[s][idx]
        out.append(_rect(cx - 22, 178, 44, 30, "#fff", ACCENT))
        out.append(_text(cx, 199, str(s), 15, INK, "middle", 600))
        ax = x0 + j * step + step / 2
        out.append(_line(ax, 58, cx, 176, MUTED, 1.25))
        # the comparison sits under its own box, clear of every line
        out.append(_text(cx, 230, f"{s} ≥ {a[j]}", 13, MUTED, "middle"))
    out.append(_text(640, 262, f"сумма набора {sb} ≥ {sa}", 14, ACCENT, "end", 600))
    out.append("</svg>")
    return "".join(out)


# --- chains of nested boxes ------------------------------------------------------------


def _axis_x(v, lo, hi):
    return 40 + (v - lo) * 580 / (hi - lo)


def greedy_chain_frames(sizes: list[int], gap: int) -> list[tuple[str, str]]:
    a = sorted(sizes, reverse=True)
    lo, hi = min(a) - gap, max(a) + 2
    chain: list[int] = []
    frames = []

    def frame(note_zone=None):
        out = [_svg(170, "Цепочка коробок снаружи внутрь")]
        y = 92
        out.append(_line(40, y, 620, y, FAINT, 1.5))
        if note_zone is not None:
            x1, x2 = _axis_x(lo, lo, hi), _axis_x(note_zone, lo, hi)
            out.append(_rect(x1, y - 22, x2 - x1, 44, WASH, FAINT, 1, rx=6))
            out.append(
                _text((x1 + x2) / 2, y + 44, f"подходят размеры ≤ {note_zone}", 13, MUTED, "middle")
            )
        for s in sorted(set(a)):
            x = _axis_x(s, lo, hi)
            on = s in chain
            out.append(
                f'<circle cx="{x:.1f}" cy="{y}" r="{8 if on else 6}" fill="{INK if on else "#fff"}" '
                f'stroke="{INK if on else MUTED}" stroke-width="1.5"/>'
            )
            out.append(
                _text(x, y - 16, str(s), 14, INK if on else MUTED, "middle", 600 if on else 400)
            )
        for i, (p, q) in enumerate(zip(chain, chain[1:], strict=False)):
            # a box shared by two links: the links meet it at two separate points
            xp, xq = _axis_x(p, lo, hi) - 5, _axis_x(q, lo, hi) + 5
            out.append(
                f'<path d="M {xp:.1f} {y + 12} Q {(xp + xq) / 2:.1f} {y + 34} {xq:.1f} {y + 12}" fill="none" stroke="{ACCENT}" stroke-width="1.5"/>'
            )
            _ = i
        out.append(
            _text(
                40,
                28,
                "цепочка: " + (" → ".join(map(str, chain)) or "пока пусто"),
                15,
                INK,
                "start",
                600,
            )
        )
        out.append("</svg>")
        return "".join(out)

    frames.append(
        (
            frame(),
            f"Размеры по убыванию: {', '.join(map(str, a))}. Начинаем снаружи — с самой большой коробки.",
        )
    )
    skipped: list[int] = []
    for s in a:
        if not chain:
            chain.append(s)
            frames.append((frame(), f"Внешняя коробка — самая большая, {s}."))
            continue
        limit = chain[-1] - gap
        if s > limit:
            skipped.append(s)
            continue
        chain.append(s)
        why = (
            " "
            + ", ".join(map(str, skipped))
            + f" не подход{'ят' if len(skipped) > 1 else 'ит'}: разница с {chain[-2]} меньше {gap}."
            if skipped
            else ""
        )
        skipped.clear()
        frames.append(
            (
                frame(limit),
                f"В {chain[-2]} помещается размер не больше {chain[-2]} − {gap} = {limit}.{why}"
                f" Берём наибольший подходящий — {s}.",
            )
        )
    frames.append(
        (frame(), f"Больше вложить нечего: {len(chain)} коробок, самая маленькая — {chain[-1]}.")
    )
    return frames


def greedy_chain(sizes: list[int], gap: int) -> str:
    return _stepper(greedy_chain_frames(sizes, gap))


# --- two pointers: trips of at most two ----------------------------------------------


def greedy_trips_frames(weights: list[int], cap: int) -> list[tuple[str, str]]:
    a = sorted(weights)
    n = len(a)
    left, right = 0, n - 1
    trips: list[tuple[int, ...]] = []
    frames = []
    step = 560 / n
    x0 = 50

    def frame():
        used = {i for t in trips for i in t}
        out = [_svg(190, "Поездки по двое: два указателя")]
        for i, w in enumerate(a):
            cx = x0 + i * step + step / 2
            gone = i in used
            out.append(_rect(cx - 24, 50, 48, 34, WASH if gone else "#fff", FAINT if gone else INK))
            out.append(_text(cx, 73, str(w), 15, MUTED if gone else INK, "middle", 600))
        if left == right:
            cx = x0 + left * step + step / 2
            out.append(_line(cx, 88, cx, 100, ACCENT, 1.5))
            out.append(_text(cx, 116, "left = right", 14, ACCENT, "middle", 600))
        elif left < right:
            for idx, name in ((left, "left"), (right, "right")):
                cx = x0 + idx * step + step / 2
                out.append(_line(cx, 88, cx, 100, ACCENT, 1.5))
                out.append(_text(cx, 116, name, 14, ACCENT, "middle", 600))
        out.append(
            _text(40, 30, f"вместимость {cap}; поездок: {len(trips)}", 15, INK, "start", 600)
        )
        rides = [
            " + ".join(str(a[i]) for i in t) if len(t) > 1 else f"{a[t[0]]} один" for t in trips
        ]
        if rides:
            out.append(_text(40, 176, "поездки: " + "; ".join(rides), 13, MUTED))
        out.append("</svg>")
        return "".join(out)

    frames.append(
        (
            frame(),
            "Массы по возрастанию. left — самый лёгкий из оставшихся, right — самый тяжёлый.",
        )
    )
    while left <= right:
        if left < right and a[left] + a[right] <= cap:
            trips.append((left, right))
            note = f"{a[left]} + {a[right]} = {a[left] + a[right]} ≤ {cap}: самый тяжёлый едет с самым лёгким, оба указателя сдвигаются."
            left += 1
        elif left < right:
            trips.append((right,))
            note = f"{a[left]} + {a[right]} = {a[left] + a[right]} > {cap}: с самым лёгким не помещается — значит, ни с кем. {a[right]} едет один."
        else:
            trips.append((right,))
            note = f"Остался один человек, {a[right]}: он едет один."
        right -= 1
        frames.append((frame(), note))
    frames.append((frame(), f"Всё: {ru_count(len(trips), 'поездка', 'поездки', 'поездок')}."))
    return frames


def greedy_trips(weights: list[int], cap: int) -> str:
    return _stepper(greedy_trips_frames(weights, cap))


# --- one row of places -------------------------------------------------------------------


def greedy_row(
    marked: list[int], length: int, need: int | None = None, series: bool = False
) -> str:
    """Places 1 … length; marked places filled; gaps or series labelled."""
    s = sorted(set(marked))
    cell = min(30, 580 / length)
    x0 = (W - cell * length) / 2
    out = [_svg(150, f"Ряд из {length} мест")]
    for p in range(1, length + 1):
        x = x0 + (p - 1) * cell
        on = p in s
        out.append(
            _rect(
                x + 1,
                40,
                cell - 2,
                cell - 2,
                INK if on else "#fff",
                INK if on else FAINT,
                1.25,
                rx=3,
            )
        )
        if p == 1 or p == length or on:
            out.append(_text(x + cell / 2, 32, str(p), 13, INK if on else MUTED, "middle"))
    yb = 40 + cell + 8
    if series:
        groups, cur = [], [s[0]]
        for p in s[1:]:
            if p == cur[-1] + 1:
                cur.append(p)
            else:
                groups.append(cur)
                cur = [p]
        groups.append(cur)
        for g in groups:
            x1 = x0 + (g[0] - 1) * cell + 2
            x2 = x0 + g[-1] * cell - 2
            out.append(
                f'<path d="M {x1:.1f} {yb} v 6 H {x2:.1f} v -6" fill="none" stroke="{MUTED}" stroke-width="1.25"/>'
            )
            out.append(_text((x1 + x2) / 2, yb + 24, str(len(g)), 14, INK, "middle", 600))
        out.append(
            _text(x0, 136, "длины серий: " + " ".join(str(len(g)) for g in groups), 14, MUTED)
        )
    else:
        for a, b in zip(s, s[1:], strict=False):
            free = b - a - 1
            if free <= 0:
                continue
            hot = need is not None and free == need
            x1 = x0 + a * cell + 2
            x2 = x0 + (b - 1) * cell - 2
            color = ACCENT if hot else MUTED
            out.append(
                f'<path d="M {x1:.1f} {yb} v 6 H {x2:.1f} v -6" fill="none" stroke="{color}" stroke-width="1.5"/>'
            )
            out.append(
                _text(
                    (x1 + x2) / 2,
                    yb + 24,
                    f"{b} − {a} − 1 = {free}",
                    13,
                    color,
                    "middle",
                    600 if hot else 400,
                )
            )
    out.append("</svg>")
    return "".join(out)


# --- intervals on a time axis ------------------------------------------------------------


def _merge(intervals):
    out: list[list[int]] = []
    for s, f in sorted(intervals):
        if not out or s > out[-1][1]:
            out.append([s, f])
        else:
            out[-1][1] = max(out[-1][1], f)
    return out


def greedy_timeline(
    intervals: list[list[int]],
    picked: list[int] | None = None,
    merged: bool = False,
    load: bool = False,
    end: int | None = None,
) -> str:
    """Bars of intervals in the given order; picked indexes stand out."""
    picked = picked or []
    lo = 0
    hi = end if end is not None else max(f for _, f in intervals)
    x = lambda t: 40 + (t - lo) * 580 / (hi - lo)  # noqa: E731
    rows = len(intervals)
    extra = (50 if merged else 0) + (110 if load else 0)
    h = 50 + rows * 30 + extra + 30
    out = [_svg(h, "Интервалы на оси времени")]
    for i, (s, f) in enumerate(intervals):
        y = 20 + i * 30
        on = i in picked
        out.append(
            _rect(
                x(s),
                y,
                x(f) - x(s),
                20,
                WASH if on else "#fff",
                ACCENT if on else INK,
                2 if on else 1.25,
            )
        )
        label = f"({s}, {f})"
        color, weight = (ACCENT, 600) if on else (MUTED, 400)
        if x(f) + 70 <= W - 6:
            out.append(_text(x(f) + 6, y + 15, label, 13, color, "start", weight))
        elif x(s) >= 110:
            out.append(_text(x(s) - 6, y + 15, label, 13, color, "end", weight))
        else:
            out.append(_text((x(s) + x(f)) / 2, y + 15, label, 13, color, "middle", weight))
    y = 20 + rows * 30 + 8
    if merged:
        for s, f in _merge(intervals):
            out.append(_rect(x(s), y, x(f) - x(s), 20, INK, INK, 1, rx=3))
            out.append(_text((x(s) + x(f)) / 2, y + 38, f"{s}–{f}", 13, INK, "middle", 600))
        y += 50
    if load:
        changes: dict[int, int] = {lo: 0, hi: 0}
        for s, f in intervals:
            changes[s] = changes.get(s, 0) + 1
            changes[f] = changes.get(f, 0) - 1
        times = sorted(changes)
        cur, top = 0, 0
        steps = []
        for t, t2 in zip(times, times[1:], strict=False):
            cur += changes[t]
            steps.append((t, t2, cur))
            top = max(top, cur)
        base = y + 80
        unit = 60 / max(top, 1)
        for t, t2, c in steps:
            hot = c == top
            if c:
                out.append(
                    _rect(
                        x(t),
                        base - c * unit,
                        x(t2) - x(t),
                        c * unit,
                        WASH if hot else "#fff",
                        ACCENT if hot else INK,
                        1.5,
                        rx=0,
                    )
                )
            if x(t2) - x(t) > 18:
                out.append(
                    _text(
                        (x(t) + x(t2)) / 2,
                        base - c * unit - 6,
                        str(c),
                        13,
                        ACCENT if hot else MUTED,
                        "middle",
                        600,
                    )
                )
        out.append(_line(40, base, 620, base, INK, 1.25))
        y = base + 6
    out.append(_line(40, y + 6, 620, y + 6, FAINT, 1))
    marks = sorted({lo, hi, *(t for iv in intervals for t in iv)})
    last = -100.0
    for t in marks:
        if x(t) - last >= 22:
            out.append(_text(x(t), y + 24, str(t), 13, MUTED, "middle"))
            last = x(t)
    out.append("</svg>")
    return "".join(out)


# --- storage cells over time --------------------------------------------------------------


def greedy_cells(k: int, requests: list[list[int]], strict: bool = False) -> str:
    free = [0] * k
    placed, rejected = [], []
    for s, f in sorted(tuple(r) for r in requests):
        for i in range(k):
            if (free[i] < s) if strict else (free[i] <= s):
                free[i] = f
                placed.append((i, s, f))
                break
        else:
            rejected.append((s, f))
    hi = max(f for _, f in requests) + 1
    x = lambda t: 110 + t * 500 / hi  # noqa: E731
    h = 60 + k * 44 + 40
    out = [_svg(h, f"{k} ячейки во времени")]
    for i in range(k):
        y = 20 + i * 44
        out.append(_text(100, y + 21, f"ячейка {i + 1}", 14, INK, "end", 600))
        out.append(_line(x(0), y + 30, x(hi), y + 30, FAINT, 1))
    for n, (i, s, f) in enumerate(placed):
        y = 20 + i * 44
        last = n == len(placed) - 1
        out.append(
            _rect(
                x(s),
                y + 4,
                x(f) - x(s),
                24,
                WASH if last else "#fff",
                ACCENT if last else INK,
                2 if last else 1.25,
            )
        )
        out.append(_text((x(s) + x(f)) / 2, y + 21, f"{s}–{f}", 13, INK, "middle", 600))
    y = 20 + k * 44
    out.append(_line(x(0), y, x(hi), y, INK, 1))
    for t in range(0, hi, 1 if hi <= 12 else 2):
        out.append(_text(x(t), y + 18, str(t), 13, MUTED, "middle"))
    note = "отказ: " + ", ".join(f"({s}, {f})" for s, f in rejected) if rejected else "отказов нет"
    out.append(_text(110, y + 44, note, 14, ACCENT if rejected else MUTED, "start", 600))
    out.append("</svg>")
    return "".join(out)


# --- sliding window ---------------------------------------------------------------------------


def greedy_window_frames(values: list[int], d: int) -> list[tuple[str, str]]:
    a = sorted(values)
    n = len(a)
    step = 560 / n
    x0 = 50
    frames = []
    left = best = 0

    def frame(right, best_pair):
        out = [_svg(160, f"Окно с разностью не больше {d}")]
        for i, v in enumerate(a):
            cx = x0 + i * step + step / 2
            inside = left <= i <= right
            out.append(
                _rect(cx - 24, 50, 48, 34, WASH if inside else "#fff", INK if inside else FAINT)
            )
            out.append(_text(cx, 73, str(v), 15, INK if inside else MUTED, "middle", 600))
        xl = x0 + left * step + step / 2 - 30
        xr = x0 + right * step + step / 2 + 30
        out.append(_rect(xl, 42, xr - xl, 50, "none", ACCENT, 2, rx=8))
        if left == right:
            out.append(_text((xl + xr) / 2, 116, "left = right", 14, ACCENT, "middle", 600))
        else:
            out.append(_text(xl, 116, "left", 14, ACCENT, "start", 600))
            out.append(_text(xr, 116, "right", 14, ACCENT, "end", 600))
        out.append(_text(40, 28, f"D = {d}; лучшая длина: {best_pair}", 15, INK, "start", 600))
        out.append("</svg>")
        return "".join(out)

    for right in range(n):
        moved = []
        while a[right] - a[left] > d:
            moved.append(a[left])
            left += 1
        length = right - left + 1
        best = max(best, length)
        if moved:
            note = (
                f"right на {a[right]}: {a[right]} − {moved[0]} = {a[right] - moved[0]} > {d}, "
                f"поэтому left сдвигается вправо до {a[left]}. Длина окна {length}."
            )
        else:
            note = f"right на {a[right]}: {a[right]} − {a[left]} = {a[right] - a[left]} ≤ {d}. Длина окна {length}."
        frames.append((frame(right, best), note))
    frames.append(
        (
            frame(n - 1, best),
            f"left сдвигался {ru_count(left, 'раз', 'раза', 'раз')} и ни разу не вернулся. Ответ: {best}.",
        )
    )
    return frames


def greedy_window(values: list[int], d: int) -> str:
    return _stepper(greedy_window_frames(values, d))


# --- blocks of nested boxes ----------------------------------------------------------------


def greedy_blocks(sizes: list[int], gap: int) -> str:
    """Greedy blocks: each size goes on top of a block whose top is ≤ size − gap."""
    a = sorted(sizes)
    blocks: list[list[int]] = []
    for s in a:
        for b in blocks:
            if s - b[-1] >= gap:
                b.append(s)
                break
        else:
            blocks.append([s])
    left = best = 0
    span = (0, 0)
    for right in range(len(a)):
        while a[right] - a[left] >= gap:
            left += 1
        if right - left + 1 > best:
            best, span = right - left + 1, (left, right)
    lo, hi = a[0] - 2, a[-1] + 2
    x = lambda v: 60 + (v - lo) * 540 / (hi - lo)  # noqa: E731
    h = 70 + len(blocks) * 40 + 30
    out = [_svg(h, f"{len(blocks)} блока для {len(a)} коробок")]
    x1, x2 = x(a[span[0]]) - 14, x(a[span[1]]) + 14
    out.append(_rect(x1, 30, x2 - x1, len(blocks) * 40 + 10, WASH, ACCENT, 1.5, "5 4", 8))
    out.append(
        _text(
            (x1 + x2) / 2,
            22,
            f"{a[span[0]]}…{a[span[1]]}: разница меньше {gap}",
            13,
            ACCENT,
            "middle",
            600,
        )
    )
    for j, b in enumerate(blocks):
        y = 50 + j * 40
        out.append(_text(50, y + 5, f"блок {j + 1}", 13, MUTED, "end"))
        for p, q in zip(b, b[1:], strict=False):
            out.append(_line(x(p), y, x(q), y, INK, 1.5))
        for s in b:
            out.append(
                f'<circle cx="{x(s):.1f}" cy="{y}" r="7" fill="#fff" stroke="{INK}" stroke-width="1.5"/>'
            )
            out.append(_text(x(s), y + 24, str(s), 13, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


# --- a column of seats: free seats in front of a seat ------------------------------------


def greedy_column(occupied: list[int], m: int) -> str:
    """Rows 1 … m of one seat number, the stage on the left. Each free run ends with
    the seat that has the most free seats in front of it; the best one stands out."""
    occ = sorted(set(occupied))
    cell = min(44, 560 / m)
    x0 = (W - cell * m) / 2 + 20
    runs = []
    prev = 0
    for o in occ + [m + 1]:
        if o - prev >= 2:
            runs.append((prev + 1, o - 1, o - prev - 2))
        prev = o
    best = max(runs, key=lambda r: (r[2], -r[1]))
    out = [_svg(160, f"Кресла одного номера в рядах 1–{m}")]
    out.append(_text(x0 - 12, 66, "сцена", 13, MUTED, "end"))
    for r in range(1, m + 1):
        x = x0 + (r - 1) * cell
        on = r in occ
        hot = r == best[1]
        stroke = INK if on else (ACCENT if hot else FAINT)
        out.append(
            _rect(
                x + 2,
                44,
                cell - 4,
                cell - 4,
                INK if on else "#fff",
                stroke,
                2 if hot else 1.25,
                rx=4,
            )
        )
        out.append(_text(x + cell / 2, 34, str(r), 13, INK if on or hot else MUTED, "middle"))
    yb = 44 + cell + 6
    for first, last, free in runs:
        hot = (first, last, free) == best
        color = ACCENT if hot else MUTED
        x1 = x0 + (first - 1) * cell + 3
        x2 = x0 + last * cell - 3
        out.append(
            f'<path d="M {x1:.1f} {yb} v 6 H {x2:.1f} v -6" fill="none" stroke="{color}" stroke-width="1.5"/>'
        )
        out.append(
            _text(
                (x1 + x2) / 2,
                yb + 24,
                f"ряд {last}: перед ним {free}",
                13,
                color,
                "middle",
                600 if hot else 400,
            )
        )
    out.append(
        _text(
            x0,
            150,
            f"занятые ряды {', '.join(map(str, occ))}; условные занятые 0 и {m + 1}",
            13,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- one window with a queue ----------------------------------------------------------------


def greedy_queue(clients: list[list[int]]) -> str:
    """One window: for each client the arrival, the wait (dashed) and the service;
    on the right — how many earlier clients are still not finished at the arrival."""
    finish_times: list[int] = []
    rows = []
    free = 0
    for a, d in clients:
        people = sum(f > a for f in finish_times)
        start = max(a, free)
        free = start + d
        finish_times.append(free)
        rows.append((a, start, free, people))
    hi = max(f for _, _, f, _ in rows) + 1
    x = lambda t: 92 + t * 400 / hi  # noqa: E731
    h = 40 + 40 * len(rows) + 30
    out = [_svg(h, "Очередь к одному окну")]
    out.append(_text(x(0), 18, "ожидание пунктиром, обслуживание — прямоугольником", 13, MUTED))
    for i, (a, start, fin, people) in enumerate(rows):
        y = 34 + i * 40
        out.append(_text(82, y + 17, f"клиент {i + 1}", 13, INK, "end", 600))
        out.append(f'<circle cx="{x(a):.1f}" cy="{y + 12}" r="4" fill="{INK}"/>')
        if start > a:
            out.append(_line(x(a), y + 12, x(start), y + 12, ACCENT, 1.75, "4 4"))
        out.append(_rect(x(start), y, x(fin) - x(start), 24, WASH, INK, 1.25))
        note = f"ждал {start - a}, в очереди {people}"
        out.append(_text(x(hi) + 10, y + 17, note, 13, ACCENT if start > a else MUTED))
    y = 34 + len(rows) * 40
    out.append(_line(x(0), y, x(hi), y, INK, 1))
    for t in range(0, hi + 1, 2 if hi > 12 else 1):
        out.append(_text(x(t), y + 18, str(t), 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


GREEDY_FIGURES: dict = {
    "greedy_fill": greedy_fill,
    "greedy_room": greedy_room,
    "greedy_compare": greedy_compare,
    "greedy_chain": greedy_chain,
    "greedy_trips": greedy_trips,
    "greedy_row": greedy_row,
    "greedy_timeline": greedy_timeline,
    "greedy_cells": greedy_cells,
    "greedy_window": greedy_window,
    "greedy_blocks": greedy_blocks,
    "greedy_column": greedy_column,
    "greedy_queue": greedy_queue,
}
GREEDY_STEPPERS: dict = {
    "greedy_chain": greedy_chain_frames,
    "greedy_trips": greedy_trips_frames,
    "greedy_window": greedy_window_frames,
}
GREEDY_WIDGETS: dict = {}
GREEDY_SCRIPTS: dict = {}
