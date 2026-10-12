"""Figures of topic 7 «Объём информации» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.
All keys start with ``vol_`` so they never clash with other topics.

``vol_ladder(n, top)`` — powers of two 2¹ … 2ᵗᵒᵖ in a row and N between two of
them: the smallest i with 2ⁱ ≥ N, even when N is closer to the lower power.
``vol_raster(cols, rows, depth)`` — a tiny raster: every pixel holds an i-bit
code, the codes of a row are written one after another.
``vol_budget(w, h, limit_kb, depths)`` — the memory limit in bits against the
volume of the image for neighbouring depths: one fits, the next one does not.
``vol_stream(f, c, keep, speed_kb, depths)`` — bits a compressed stream creates in a
second for neighbouring depths against the channel speed.
``vol_dpi(width_in, height_in, r1, r2, cell)`` — the same sheet scanned with two
densities: both sides of the grid grow, the pixels grow by (r₂ / r₁)².
``vol_header(data_kb, keep, head_kb)`` — q · D + H against q · (D + H).
``vol_chain`` — a stepper: the set of compressed images with headers built
forward and then undone backward, down to the colour depth.
``vol_samples(per_sec, seconds, channels, depth)`` — sampling: f · t
measurements in every channel, each rounded to one of 2ⁱ levels.
``vol_timeline(f, c, i, rec_s, speed)`` — recording time and transfer time of
the same file on one axis of seconds.
``vol_fit(capacity, item, unit, what)`` — whole items in a fixed capacity:
the next item would not fit.
``vol_round(values)`` — up, down (integer part) and nearest on a number line.
``vol_pack(codes, bits)`` — codes written one after another in whole bytes
against a whole byte for every code.
``vol_cards(capacity, item, count)`` — files on media that cannot split a file.
``vol_same_header(k, big, small)`` — two files with the same unknown header.
``vol_share(text, scan, k)`` — the unchanged text in the new whole record.
"""

from __future__ import annotations

from fractions import Fraction
from math import ceil

from figures import ACCENT, FAINT, INK, MUTED, WASH, _arrow, _stepper, _text

W = 660
SUP = str.maketrans("0123456789-", "⁰¹²³⁴⁵⁶⁷⁸⁹⁻")


def sup(n: int) -> str:
    return str(n).translate(SUP)


def num(x) -> str:
    """12 345,5 — Russian style: spaces between thousands, a comma in fractions."""
    if isinstance(x, Fraction) and x.denominator == 1:
        x = x.numerator
    if isinstance(x, int):
        return f"{x:,}".replace(",", " ")
    s = f"{float(x):,.4f}".rstrip("0").rstrip(".")
    whole, _, frac = s.partition(".")
    whole = whole.replace(",", " ")
    return f"{whole},{frac}" if frac else whole


def bits(n: int) -> int:
    i = 0
    while 2**i < n:
        i += 1
    return i


def _rect(x, y, w, h, fill="#fff", stroke=INK, width=1.5, dashed=False, rx=4) -> str:
    dash = ' stroke-dasharray="5 4"' if dashed else ""
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="{width}"{dash}/>'
    )


def _line(x1, y1, x2, y2, color=INK, width=1.5, dashed=False) -> str:
    dash = ' stroke-dasharray="4 4"' if dashed else ""
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
        f'stroke="{color}" stroke-width="{width}"{dash}/>'
    )


def _svg(height: int, label: str) -> list[str]:
    return [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="{label}">']


# --- powers of two and the smallest code length --------------------------------------


def vol_ladder(n: int = 300, top: int = 10) -> str:
    """2¹ … 2ᵗᵒᵖ at equal steps; N sits between 2ⁱ⁻¹ and 2ⁱ and needs i bits."""
    i = bits(n)
    left, right, y = 50, 620, 90
    step = (right - left) / (top - 1)
    out = _svg(184, f"Степени двойки и {n} объектов")
    out.append(
        _text(16, 22, "i бит дают 2ⁱ разных кодов; степени стоят на равных расстояниях", 13, MUTED)
    )
    out.append(_line(left, y, right, y, FAINT, 2))
    out.append(_text(16, y + 30, "2ⁱ", 13, MUTED))
    out.append(_text(16, y + 54, "i", 13, MUTED))
    for k in range(1, top + 1):
        x = left + (k - 1) * step
        hot = k == i
        out.append(
            f'<circle cx="{x:.1f}" cy="{y}" r="5" fill="{"#fff" if hot else INK}" '
            f'stroke="{ACCENT if hot else INK}" stroke-width="{2.5 if hot else 1}"/>'
        )
        out.append(_text(x, y + 30, num(2**k), 13, INK, "middle", 600 if hot else 400))
        out.append(
            _text(x, y + 54, str(k), 13, ACCENT if hot else MUTED, "middle", 600 if hot else 400)
        )
    lo = left + (i - 2) * step
    frac = (n - 2 ** (i - 1)) / (2**i - 2 ** (i - 1))
    xn = lo + frac * step
    out.append(_arrow(xn, 54, xn, y - 8, ACCENT))
    out.append(_text(xn, 46, f"N = {n}", 14, INK, "middle", 600))
    out.append(
        _text(
            W / 2,
            176,
            f"{num(2 ** (i - 1))} < {n} ≤ {num(2**i)}: {i - 1} бит мало, нужно {i}",
            14,
            INK,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- a raster and its codes -------------------------------------------------------------

SHADES = ["#ffffff", WASH, FAINT, MUTED]


def vol_raster(cols: int = 8, rows: int = 4, depth: int = 2) -> str:
    """cols × rows pixels, 2ᵈᵉᵖᵗʰ grey shades; every pixel shows its code."""
    levels = 2**depth
    shades = SHADES if levels == 4 else [SHADES[k * 3 // max(levels - 1, 1)] for k in range(levels)]
    size = 44
    x0, y0 = 40, 40
    out = _svg(330, f"Растровое изображение {cols} × {rows}, {depth} бита на пиксель")
    out.append(_text(x0, 24, f"{cols} пикселей в строке, {rows} строки", 13, MUTED))
    codes = []
    for r in range(rows):
        for c in range(cols):
            v = (c + r) * levels // (cols + rows - 1)
            v = min(v, levels - 1)
            code = format(v, f"0{depth}b")
            codes.append(code)
            x, y = x0 + c * size, y0 + r * size
            out.append(
                f'<rect x="{x}" y="{y}" width="{size}" height="{size}" fill="{shades[v]}" '
                f'stroke="{INK}" stroke-width="1"/>'
            )
            color = "#fff" if v == levels - 1 else INK
            out.append(_text(x + size / 2, y + size * 0.62, code, 13, color, "middle"))
    # palette on the right
    px = x0 + cols * size + 34
    out.append(_text(px, 54, f"палитра: {levels} цвета", 13, MUTED))
    for v in range(levels):
        y = 66 + v * 30
        out.append(_rect(px, y, 22, 22, shades[v], INK, 1, rx=2))
        out.append(_text(px + 32, y + 16, f"код {format(v, f'0{depth}b')}", 13, INK))
    # the first row written one after another
    row = "".join(codes[:cols])
    yb = y0 + rows * size + 34
    out.append(_text(x0, yb, "первая строка в памяти — коды подряд:", 13, MUTED))
    bw = (W - 2 * x0) / len(row)
    for k, ch in enumerate(row):
        x = x0 + k * bw
        out.append(
            f'<rect x="{x:.1f}" y="{yb + 10}" width="{bw:.1f}" height="28" fill="#fff" '
            f'stroke="{FAINT}" stroke-width="1"/>'
        )
        out.append(_text(x + bw / 2, yb + 30, ch, 13, INK, "middle"))
        if k % depth == 0:
            out.append(_rect(x + 1, yb + 8, bw * depth - 2, 32, "none", INK, 1.5, rx=3))
    total = cols * rows * depth
    out.append(
        _text(
            W / 2,
            yb + 66,
            f"{cols} · {rows} пикселей · {depth} бита = {total} бита на всё изображение",
            15,
            INK,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- the inverse problem: depth from a memory limit ---------------------------------------


def _limit_bars(label, head, limit_label, limit, rows, labels, note) -> str:
    """A limit bar and one bar per candidate: what fits and what sticks out."""
    scale = 420 / max([v for _, v, _ in rows] + [limit])
    x0 = 110
    out = _svg(224, label)
    out.append(_text(16, 24, head, 13, MUTED))
    xl = x0 + limit * scale
    out.append(_text(16, 64, labels[0], 14, INK))
    out.append(_rect(x0, 46, limit * scale, 28, WASH, INK, 1.5))
    out.append(_text(x0 + 8, 66, limit_label, 13, INK))
    for k, (name, v, formula) in enumerate(rows):
        y = 96 + k * 46
        fits = v <= limit
        out.append(_text(16, y + 20, name, 14, INK, weight=600))
        out.append(_rect(x0, y, min(v, limit) * scale, 28, "#fff", INK, 1.5))
        if not fits:
            out.append(_rect(xl, y, (v - limit) * scale, 28, "#fff", ACCENT, 2))
        out.append(_text(x0 + 8, y + 20, formula, 13, INK))
        out.append(
            _text(
                W - 12,
                y + 20,
                labels[1] if fits else labels[2],
                13,
                MUTED if fits else ACCENT,
                "end",
            )
        )
    out.append(_line(xl, 40, xl, 190, ACCENT, 1.5, dashed=True))
    out.append(_text(W / 2, 212, note, 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def vol_budget(w: int = 512, h: int = 256, limit_kb: int = 100, depths=(6, 7)) -> str:
    """The limit in bits and the image volume for two neighbouring depths."""
    pixels = w * h
    limit = limit_kb * 1024 * 8
    share = Fraction(limit, pixels)
    rows = [
        (f"i = {d} бит", pixels * d, f"{num(pixels)} · {d} = {num(pixels * d)} бит") for d in depths
    ]
    return _limit_bars(
        f"Ограничение {limit_kb} Кбайт и изображение {w} × {h}",
        f"{w} · {h} = {num(pixels)} пикселей",
        f"{limit_kb} Кбайт = {num(limit)} бит",
        limit,
        rows,
        ("доступно", "помещается", "не помещается"),
        f"на пиксель приходится {num(share)} бита — целая глубина не больше {share.numerator // share.denominator}",
    )


def vol_stream(
    f: int = 32000, c: int = 2, keep: tuple[int, int] = (1, 4), speed_kb: int = 20, depths=(10, 11)
) -> str:
    """Bits a compressed stream creates per second against what the channel passes."""
    q = Fraction(*keep)
    speed = speed_kb * 1024 * 8
    per_bit = q * f * c  # bits per second for every bit of depth
    rows = [
        (f"i = {d} бит", per_bit * d, f"{num(q)} · {num(f)} · {c} · {d} = {num(per_bit * d)}")
        for d in depths
    ]
    best = Fraction(speed) / per_bit
    return _limit_bars(
        "Поток за одну секунду и скорость канала",
        "бит за одну секунду: создаёт запись после сжатия и пропускает канал",
        f"канал: {speed_kb} Кбайт/с = {num(speed)} бит/с",
        speed,
        rows,
        ("канал", "успевает", "отстаёт"),
        f"i ≤ {num(speed)} / {num(per_bit)} = {num(best)} — наибольшая целая глубина {best.numerator // best.denominator}",
    )


# --- scanning with two densities ---------------------------------------------------------


def _sheet(x0, y0, wi, hi, r, cell, inch) -> list[str]:
    k = r // cell  # grid cells per inch on the figure
    step = inch / k
    out = []
    for a in range(wi * k):
        for b in range(hi * k):
            out.append(
                f'<rect x="{x0 + a * step:.1f}" y="{y0 + b * step:.1f}" width="{step:.1f}" '
                f'height="{step:.1f}" fill="#fff" stroke="{FAINT}" stroke-width="1"/>'
            )
    out.append(_rect(x0, y0, wi * inch, hi * inch, "none", INK, 1.5, rx=0))
    return out


def vol_dpi(
    width_in: int = 2, height_in: int = 3, r1: int = 100, r2: int = 200, cell: int = 50
) -> str:
    """The same sheet at r1 and r2 dpi; one figure cell is cell × cell pixels."""
    inch = 60
    out = _svg(290, f"Лист {width_in} × {height_in} дюйма при {r1} и {r2} dpi")
    for k, r in enumerate((r1, r2)):
        x0 = 60 + k * 300
        out += _sheet(x0, 40, width_in, height_in, r, cell, inch)
        pw, ph = width_in * r, height_in * r
        out.append(_text(x0, 26, f"{r} dpi", 15, INK, weight=600))
        out.append(_text(x0 + width_in * inch + 14, 70, f"{pw} × {ph}", 14, INK))
        out.append(_text(x0 + width_in * inch + 14, 92, f"= {num(pw * ph)}", 14, INK))
        out.append(_text(x0 + width_in * inch + 14, 112, "пикселей", 13, MUTED))
    ratio = Fraction(r2, r1)
    out.append(
        _text(
            W / 2,
            256,
            f"обе стороны в {num(ratio)} раза больше — пикселей в {num(ratio**2)} раза больше",
            14,
            INK,
            "middle",
            600,
        )
    )
    out.append(_text(W / 2, 278, f"клетка схемы — {cell} × {cell} пикселей", 12, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


# --- compression and a header ------------------------------------------------------------


def vol_header(data_kb: int = 256, keep: tuple[int, int] = (3, 4), head_kb: int = 64) -> str:
    """Data compressed then a header added, against the whole file compressed."""
    q = Fraction(*keep)
    a = q * data_kb + head_kb
    b = q * (data_kb + head_kb)
    scale = 400 / (data_kb + head_kb)
    x0 = 150
    out = _svg(236, "Сжатие данных и заголовок")
    out.append(
        _text(
            16,
            22,
            f"данные {data_kb} Кбайт, заголовок {head_kb} Кбайт, остаётся {num(q)}",
            13,
            MUTED,
        )
    )
    rows = [
        ("до сжатия", [(data_kb, "данные", WASH), (head_kb, "H", "#fff")], data_kb + head_kb, ""),
        (
            "q · D + H",
            [(q * data_kb, "сжатые данные", WASH), (head_kb, "H", "#fff")],
            a,
            "заголовок не сжат",
        ),
        ("q · (D + H)", [(b, "сжато всё вместе", WASH)], b, "сжат и заголовок"),
    ]
    for k, (name, parts, total, note) in enumerate(rows):
        y = 40 + k * 62
        out.append(_text(16, y + 22, name, 14, INK, weight=600))
        x = x0
        for size, label, fill in parts:
            w = size * scale
            out.append(_rect(x, y, w, 32, fill, INK, 1.5, rx=2))
            out.append(_text(x + w / 2, y + 21, label, 12, INK, "middle"))
            x += w
        out.append(
            _text(x + 10, y + 21, f"{num(total)} Кбайт", 14, ACCENT if k else INK, weight=600)
        )
        if note:
            out.append(_text(x0, y + 50, note, 12, MUTED))
    out.append("</svg>")
    return "".join(out)


def _chain_frame(boxes, hot, back, note, known) -> str:
    out = _svg(250, "Составная задача: прямой и обратный ход")
    n = len(boxes)
    bw, gap = 112, 10
    x0 = (W - n * bw - (n - 1) * gap) / 2
    out.append(_text(16, 22, "прямой ход: как получился объём", 13, MUTED))
    for k, (top, value) in enumerate(boxes):
        x = x0 + k * (bw + gap)
        on = k in hot
        out.append(
            _rect(x, 34, bw, 62, WASH if on else "#fff", ACCENT if on else INK, 2 if on else 1.25)
        )
        out.append(_text(x + bw / 2, 56, top, 12, MUTED, "middle"))
        shown = value if k in known else "?"
        out.append(_text(x + bw / 2, 82, shown, 15, INK if k in known else MUTED, "middle", 600))
        if k:
            out.append(_arrow(x - gap - 1, 65, x - 1, 65, FAINT))
    out.append(_text(16, 128, "обратный ход: отменяем действия с конца", 13, MUTED))
    for k, (frm, to, op) in enumerate(back):
        xa = x0 + frm * (bw + gap) + bw / 2
        xb = x0 + to * (bw + gap) + bw / 2
        out.append(_arrow(xa, 140, xb + 6, 140, ACCENT if k == len(back) - 1 else INK))
        out.append(_text((xa + xb) / 2, 162, op, 13, INK, "middle"))
    out.append(_text(W / 2, 214, note[0], 15, INK, "middle", 600))
    out.append(_text(W / 2, 236, note[1], 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def vol_chain_frames(
    n: int = 32,
    w: int = 512,
    h: int = 256,
    keep: tuple[int, int] = (3, 4),
    head_kb: int = 64,
    total_mb: int = 8,
) -> list[tuple[str, str]]:
    """Forward: depth → data → compressed → + header → n files. Backward to the depth."""
    q = Fraction(*keep)
    one = Fraction(total_mb * 1024, n)
    packed = one - head_kb
    data = packed / q
    depth = data * 8192 / (w * h)
    boxes = [
        ("глубина", f"{num(depth)} бит"),
        ("данные", f"{num(data)} Кбайт"),
        ("после сжатия", f"{num(packed)} Кбайт"),
        ("файл с H", f"{num(one)} Кбайт"),
        (f"{n} файла", f"{total_mb} Мбайт"),
    ]
    steps = [
        (
            4,
            3,
            f"÷ {n}",
            f"{total_mb} · 1024 / {n} = {num(one)} Кбайт",
            "сначала делим общий объём между файлами",
        ),
        (
            3,
            2,
            f"− {head_kb}",
            f"{num(one)} − {head_kb} = {num(packed)} Кбайт",
            "убираем заголовок: он добавлен последним",
        ),
        (
            2,
            1,
            f"÷ {num(q)}",
            f"{num(packed)} / {num(q)} = {num(data)} Кбайт",
            "восстанавливаем объём до сжатия",
        ),
        (
            1,
            0,
            f"÷ {num(w * h)} пикс.",
            f"{num(data)} · 8192 / ({w} · {h}) = {num(depth)} бит",
            "делим биты данных на число пикселей",
        ),
    ]
    frames = [
        (
            _chain_frame(
                boxes,
                {4},
                [],
                (f"известен только общий объём: {total_mb} Мбайт", "идём назад по цепочке"),
                {4},
            ),
            f"Набор строился слева направо: глубина → данные → сжатие → заголовок → {n} файла. Известен только конец цепочки.",
        )
    ]
    back = []
    for frm, to, op, formula, why in steps:
        back.append((frm, to, op))
        frames.append(
            (
                _chain_frame(boxes, {to}, list(back), (formula, why), set(range(to, 5))),
                f"{formula}: {why}.",
            )
        )
    colours = 2 ** int(depth)
    frames[-1] = (
        frames[-1][0],
        frames[-1][1] + f" Глубина {num(depth)} бит, цветов 2{sup(int(depth))} = {num(colours)}.",
    )
    return frames


def vol_chain(**kw) -> str:
    """Stepper of vol_chain_frames."""
    return _stepper(vol_chain_frames(**kw))


# --- sampling of sound -------------------------------------------------------------------


def _wave(t: float, phase: float) -> float:
    """A smooth made-up signal between −1 and 1 (two sines)."""
    from math import sin, tau

    return 0.65 * sin(tau * 0.55 * t + phase) + 0.3 * sin(tau * 1.7 * t + 2 * phase)


def vol_samples(per_sec: int = 4, seconds: int = 3, channels: int = 2, depth: int = 3) -> str:
    """f · t samples per channel, every sample rounded to one of 2ⁱ levels."""
    levels = 2**depth
    left, right = 70, 630
    lane = 120
    span = right - left
    out = _svg(
        90 + channels * lane, f"Дискретизация: {per_sec} отсчёта в секунду, {channels} канала"
    )
    out.append(
        _text(
            left, 22, f"{per_sec} измерения в секунду, {levels} уровней ({depth} бита)", 13, MUTED
        )
    )
    count = per_sec * seconds
    for ch in range(channels):
        top = 40 + ch * lane
        mid, amp = top + lane / 2 - 10, lane / 2 - 18
        out.append(
            _text(
                16,
                mid + 4,
                "левый" if ch == 0 else "правый" if channels == 2 else f"канал {ch + 1}",
                12,
                MUTED,
            )
        )
        for lv in range(levels):
            y = mid + amp - lv * 2 * amp / (levels - 1)
            out.append(_line(left, y, right, y, FAINT, 1))
        pts = []
        for k in range(201):
            t = seconds * k / 200
            pts.append(f"{left + span * k / 200:.1f},{mid - amp * _wave(t, ch * 1.3):.1f}")
        out.append(
            f'<polyline points="{" ".join(pts)}" fill="none" stroke="{MUTED}" stroke-width="1.25"/>'
        )
        for k in range(count):
            t = k / per_sec
            x = left + span * t / seconds
            v = _wave(t, ch * 1.3)
            lv = round((v + 1) / 2 * (levels - 1))
            y = mid + amp - lv * 2 * amp / (levels - 1)
            out.append(_line(x, mid + amp + 6, x, y, FAINT, 1, dashed=True))
            out.append(
                f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4.5" fill="#fff" stroke="{ACCENT}" stroke-width="2"/>'
            )
    base = 40 + channels * lane
    for s in range(seconds + 1):
        x = left + span * s / seconds
        out.append(_line(x, base - 6, x, base + 2, INK, 1.5))
        out.append(_text(x, base + 18, f"{s} с", 12, MUTED, "middle"))
    total = count * channels * depth
    out.append(
        _text(
            W / 2,
            base + 44,
            f"{per_sec} · {seconds} = {count} отсчётов в канале · {channels} канала · {depth} бита = {total} бита",
            14,
            INK,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- recording time and transfer time ----------------------------------------------------


def vol_timeline(
    f: int = 16000, c: int = 2, i: int = 16, rec_s: int = 90, speed: int = 128000
) -> str:
    """Seconds of recording and seconds of transfer of the same file."""
    v = f * c * i * rec_s
    send = Fraction(v, speed)
    left, right = 120, 630
    scale = (right - left) / max(rec_s, send)
    out = _svg(200, "Время записи и время передачи")
    out.append(_text(16, 22, f"файл: {num(f)} · {c} · {i} · {rec_s} = {num(v)} бит", 13, MUTED))
    out.append(_text(16, 62, "запись", 14, INK, weight=600))
    out.append(_rect(left, 44, rec_s * scale, 28, WASH, INK, 1.5, rx=2))
    out.append(_text(left + rec_s * scale + 8, 63, f"{rec_s} с", 14, INK))
    out.append(_text(16, 112, "передача", 14, INK, weight=600))
    out.append(_rect(left, 94, float(send) * scale, 28, "#fff", ACCENT, 2, rx=2))
    out.append(_text(left + 8, 113, f"{num(v)} / {num(speed)} = {num(send)} с", 13, INK))
    step = 60
    top = max(rec_s, ceil(send))
    for s in range(0, top + 1, step):
        x = left + s * scale
        out.append(_line(x, 134, x, 142, INK, 1.25))
        out.append(_text(x, 158, str(s), 12, MUTED, "middle"))
    out.append(_line(left, 138, left + top * scale, 138, INK, 1.25))
    out.append(_text(right, 182, "секунды", 12, MUTED, "end"))
    out.append("</svg>")
    return "".join(out)


# --- whole items in a capacity -----------------------------------------------------------


def vol_fit(capacity: int = 1792, item: int = 80, unit: str = "Кбайт", what: str = "снимок") -> str:
    """Items of size item one after another in capacity; the next one sticks out."""
    whole = capacity // item
    left, right = 30, 600
    scale = (right - left) / (capacity + item)
    out = _svg(176, f"Сколько целых объектов по {item} {unit} помещается в {capacity} {unit}")
    out.append(
        _text(
            left, 22, f"вместимость {num(capacity)} {unit}, один {what} — {item} {unit}", 13, MUTED
        )
    )
    out.append(_rect(left, 40, capacity * scale, 44, WASH, INK, 1.5, rx=2))
    for k in range(whole):
        x = left + k * item * scale
        out.append(_rect(x + 1.5, 46, item * scale - 3, 32, "#fff", INK, 1, rx=2))
    x = left + whole * item * scale
    out.append(_rect(x + 1.5, 46, item * scale - 3, 32, "#fff", ACCENT, 2, dashed=True, rx=2))
    xe = left + capacity * scale
    out.append(_line(xe, 32, xe, 94, ACCENT, 1.5))
    out.append(
        _text(
            left,
            112,
            f"{num(capacity)} / {item} = {num(Fraction(capacity, item))}",
            14,
            INK,
            weight=600,
        )
    )
    out.append(
        _text(left, 136, f"целиком помещается {whole}; следующий выходит за границу", 13, MUTED)
    )
    out.append(
        _text(
            left,
            160,
            f"{whole} · {item} = {num(whole * item)} ≤ {num(capacity)} < {num((whole + 1) * item)} = {whole + 1} · {item}",
            13,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- rounding by the question --------------------------------------------------------------


def vol_round(values=(12.1, 12.8)) -> str:
    """For every value: down (integer part), nearest and up on the segment [n; n + 1]."""
    row = 110
    out = _svg(50 + row * len(values), "Округление вниз, к ближайшему и вверх")
    left, right = 130, 530
    for k, v in enumerate(values):
        lo = int(v)
        hi = lo + 1
        y = 60 + k * row
        out.append(_line(left, y, right, y, INK, 1.5))
        for end, label, anchor, dx in ((left, lo, "end", -14), (right, hi, "start", 14)):
            out.append(_line(end, y - 6, end, y + 6, INK, 1.5))
            out.append(_text(end + dx, y + 6, str(label), 17, INK, anchor, 600))
        mid = (left + right) / 2
        out.append(_line(mid, y - 4, mid, y + 4, FAINT, 1.5))
        x = left + (v - lo) * (right - left)
        out.append(f'<circle cx="{x:.1f}" cy="{y}" r="6" fill="{ACCENT}"/>')
        out.append(_text(x, y - 30, num(v), 15, INK, "middle", 600))
        out.append(_arrow(x - 10, y - 14, left + 4, y - 14, MUTED))
        out.append(_arrow(x + 10, y - 14, right - 4, y - 14, MUTED))
        out.append(_text(left - 14, y + 30, f"вниз и целая часть: {lo}", 13, MUTED, "start"))
        out.append(_text(right + 14, y + 30, f"вверх: {hi}", 13, MUTED, "end"))
        near = round(v)
        xn = left if near == lo else right
        out.append(_arrow(x, y + 16, xn + (6 if near == lo else -6), y + 16, ACCENT))
        out.append(_text((x + xn) / 2, y + 48, f"ближайшее: {near}", 13, ACCENT, "middle"))
    out.append(
        _text(
            W / 2,
            30 + row * len(values),
            "ответ выбирают по вопросу, а не по привычке «после пяти вверх»",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- the level where memory is allotted -----------------------------------------------------


def vol_pack(codes: int = 5, width: int = 6) -> str:
    """codes × width bits: one after another in whole bytes, or a byte for every code."""
    total = codes * width
    packed = ceil(total / 8)
    per_code = ceil(width / 8)
    cell = 15
    left = 140
    out = _svg(236, f"{codes} кодов по {width} бит в байтах")
    out.append(
        _text(16, 22, f"{codes} кодов по {width} бит = {total} бит; квадрат — один бит", 13, MUTED)
    )

    def byte_row(y, slots):
        g = []
        for b, filled in enumerate(slots):
            x = left + b * (8 * cell + 8)
            g.append(_rect(x - 2, y - 2, 8 * cell + 4, cell + 4, "none", MUTED, 1, rx=3))
            for k in range(8):
                code = filled[k]
                fill = "#fff" if code is None else (WASH if code % 2 == 0 else FAINT)
                g.append(
                    f'<rect x="{x + k * cell:.1f}" y="{y}" width="{cell}" height="{cell}" '
                    f'fill="{fill}" stroke="{INK if code is not None else FAINT}" stroke-width="0.8"/>'
                )
        return g

    seq = [k // width for k in range(total)] + [None] * (packed * 8 - total)
    out.append(_text(16, 60, "подряд", 14, INK, weight=600))
    out += byte_row(48, [seq[b * 8 : b * 8 + 8] for b in range(packed)])
    out.append(_text(16, 82, f"⌈{total} / 8⌉ = {packed} байта", 13, ACCENT))
    slots = []
    for c in range(codes):
        slots.append([c] * width + [None] * (8 * per_code - width))
    out.append(_text(16, 140, "по байту", 14, INK, weight=600))
    out.append(_text(16, 156, "на код", 14, INK, weight=600))
    rows = [slots[:4], slots[4:]]
    for r, part in enumerate(rows):
        if part:
            out += byte_row(128 + r * 34, part)
    out.append(_text(16, 176, f"{codes} · {per_code} = {codes * per_code} байт", 13, ACCENT))
    out.append(
        _text(
            W / 2, 226, "пустые клетки — биты, которые выделены, но не заняты", 12, MUTED, "middle"
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- files on media ---------------------------------------------------------------------------


def vol_cards(capacity: int = 1000, item: int = 240, count: int = 10, unit: str = "Мбайт") -> str:
    """Files that cannot be split: capacity // item per medium, ⌈count / per⌉ media."""
    per = capacity // item
    media = ceil(count / per)
    left, right = 120, 620
    scale = (right - left) / capacity
    out = _svg(
        60 + media * 48, f"{count} файлов по {item} {unit} на носителях по {capacity} {unit}"
    )
    out.append(
        _text(
            16,
            22,
            f"носитель {num(capacity)} {unit}, файл {item} {unit}, файлов {count}",
            13,
            MUTED,
        )
    )
    left_files = count
    for m in range(media):
        y = 38 + m * 48
        out.append(_text(16, y + 22, f"носитель {m + 1}", 13, INK, weight=600))
        out.append(_rect(left, y, capacity * scale, 32, WASH, INK, 1.5, rx=2))
        here = min(per, left_files)
        left_files -= here
        for k in range(here):
            x = left + k * item * scale
            out.append(_rect(x + 1.5, y + 4, item * scale - 3, 24, "#fff", INK, 1, rx=2))
            out.append(
                _text(x + item * scale / 2, y + 21, str(m * per + k + 1), 12, MUTED, "middle")
            )
        gap = capacity - here * item
        out.append(_text(right + 4, y + 21, f"{gap}", 12, ACCENT))
    out.append(
        _text(
            16,
            50 + media * 48,
            f"на носитель ⌊{capacity} / {item}⌋ = {per} файла; носителей ⌈{count} / {per}⌉ = {media}; справа — свободное место",
            13,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- composite records (advanced subtopic) --------------------------------------------------


def vol_same_header(k: int = 8, big: int = 50, small: int = 8) -> str:
    """k·x + H = big and x + H = small: the common H disappears in the difference."""
    x = Fraction(big - small, k - 1)
    h = small - x
    left = 150
    scale = 460 / big
    out = _svg(200, "Два файла с одинаковым заголовком")
    out.append(_text(16, 22, f"данные первого в {k} раз больше, заголовок H одинаковый", 13, MUTED))
    for r, (name, parts, total) in enumerate(
        (
            ("первый", [h] + [x] * k, big),
            ("второй", [h, x], small),
        )
    ):
        y = 40 + r * 56
        out.append(_text(16, y + 22, f"{name}: {total} Мбайт", 14, INK, weight=600))
        pos = left
        for j, size in enumerate(parts):
            w = float(size) * scale
            out.append(
                _rect(
                    pos,
                    y,
                    w,
                    32,
                    "#fff" if j == 0 else WASH,
                    ACCENT if j == 0 else INK,
                    2 if j == 0 else 1,
                    rx=2,
                )
            )
            out.append(_text(pos + w / 2, y + 21, "H" if j == 0 else "x", 12, INK, "middle"))
            pos += w
    out.append(
        _line(left + float(h) * scale, 34, left + float(h) * scale, 136, ACCENT, 1.25, dashed=True)
    )
    out.append(
        _text(
            16,
            160,
            f"разность: {k}x − x = {big} − {small}, {k - 1}x = {big - small}, x = {num(x)}",
            14,
            INK,
            weight=600,
        )
    )
    out.append(
        _text(
            16,
            184,
            f"H = {small} − {num(x)} = {num(h)} Мбайт: заголовок при вычитании исчез",
            13,
            MUTED,
        )
    )
    out.append("</svg>")
    return "".join(out)


def vol_share(text: int = 1, scan: int = 4, k: tuple[int, int] = (6, 1)) -> str:
    """Text and scan in units before and after the scan grows k times."""
    kk = Fraction(*k)
    new_scan = scan * kk
    total_old, total_new = text + scan, text + new_scan
    left = 110
    scale = 470 / float(total_new)
    out = _svg(212, "Доля текста до и после замены скана")
    out.append(_text(16, 22, f"условные единицы; скан стал в {num(kk)} раза больше", 13, MUTED))
    for r, (name, parts, total) in enumerate(
        (
            ("было", [(text, "текст"), (scan, "скан")], total_old),
            ("стало", [(text, "текст"), (new_scan, "скан")], total_new),
        )
    ):
        y = 40 + r * 62
        out.append(_text(16, y + 22, name, 14, INK, weight=600))
        pos = left
        for j, (size, label) in enumerate(parts):
            w = float(size) * scale
            out.append(_rect(pos, y, w, 32, WASH if j == 0 else "#fff", INK, 1.5, rx=2))
            out.append(_text(pos + w / 2, y + 21, f"{label} {num(size)}", 12, INK, "middle"))
            pos += w
        share = Fraction(text, 1) / total
        out.append(
            _text(
                left,
                y + 50,
                f"текст: {text} / {num(total)} = {num(share * 100)} %",
                13,
                ACCENT if r else MUTED,
            )
        )
    out.append(
        _text(16, 196, "текст не изменился, изменилось целое — поэтому изменилась доля", 13, MUTED)
    )
    out.append("</svg>")
    return "".join(out)


VOLUME_FIGURES: dict = {
    "vol_ladder": vol_ladder,
    "vol_raster": vol_raster,
    "vol_budget": vol_budget,
    "vol_dpi": vol_dpi,
    "vol_stream": vol_stream,
    "vol_header": vol_header,
    "vol_chain": vol_chain,
    "vol_samples": vol_samples,
    "vol_timeline": vol_timeline,
    "vol_fit": vol_fit,
    "vol_round": vol_round,
    "vol_pack": vol_pack,
    "vol_cards": vol_cards,
    "vol_same_header": vol_same_header,
    "vol_share": vol_share,
}
VOLUME_STEPPERS: dict = {"vol_chain": vol_chain_frames}
VOLUME_WIDGETS: dict = {}
VOLUME_SCRIPTS: dict = {}
