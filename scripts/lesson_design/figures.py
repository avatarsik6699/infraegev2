"""Figure builders for lesson pages: inline SVG drawn to scale from code."""

INK = "#17191e"
MUTED = "#4d535e"
FAINT = "#d9d9d4"
SKY = "#e3edf7"
MONO = "JetBrains Mono, monospace"


def rectangles_svg(n: int = 36, cell: int = 11) -> str:
    """Every divisor pair of n as a rectangle of n unit cells."""
    pairs = [(d, n // d) for d in range(1, int(n**0.5) + 1) if n % d == 0]
    left, top, gap = 12, 14, 26
    height = top + sum(h * cell for h, _ in pairs) + gap * len(pairs)
    width = 660
    out = [
        f'<svg viewBox="0 0 {width} {height}" role="img" aria-label="Прямоугольники из {n} клеток">'
    ]
    y = top
    for rows, cols in pairs:
        square = rows == cols
        w, h = cols * cell, rows * cell
        fill = SKY if square else "#ffffff"
        out.append(
            f'<rect x="{left}" y="{y}" width="{w}" height="{h}" fill="{fill}" '
            f'stroke="{INK}" stroke-width="1.5"/>'
        )
        for c in range(1, cols):
            x = left + c * cell
            out.append(
                f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y + h}" stroke="{FAINT}" stroke-width="1"/>'
            )
        for r in range(1, rows):
            yy = y + r * cell
            out.append(
                f'<line x1="{left}" y1="{yy}" x2="{left + w}" y2="{yy}" '
                f'stroke="{FAINT}" stroke-width="1"/>'
            )
        out.append(
            f'<rect x="{left}" y="{y}" width="{w}" height="{h}" fill="none" '
            f'stroke="{INK}" stroke-width="1.5"/>'
        )
        label = f"{rows} × {cols}" + ("  — квадрат" if square else "")
        out.append(
            f'<text x="{left + w + 14}" y="{y + h / 2 + 5}" font-family="{MONO}" '
            f'font-size="15" fill="{INK}">{label}</text>'
        )
        y += h + gap
    out.append("</svg>")
    return "".join(out)


def _line_frame(n: int, upto: int, found: list[tuple[int, int]]) -> str:
    """Number line 1..n with arcs for pairs found so far and a candidate."""
    w, left, right, base = 660, 24, 24, 168
    x = lambda v: left + (v - 1) / (n - 1) * (w - left - right)  # noqa: E731
    root = n**0.5
    g = [f'<svg viewBox="0 0 {w} 214" role="img" aria-hidden="true">']
    g.append(
        f'<line x1="{left}" y1="{base}" x2="{w - right}" y2="{base}" '
        f'stroke="{INK}" stroke-width="1.5"/>'
    )
    for v in range(1, n + 1):
        g.append(
            f'<line x1="{x(v):.1f}" y1="{base - 3}" x2="{x(v):.1f}" '
            f'y2="{base + 3}" stroke="{FAINT}"/>'
        )
    g.append(
        f'<line x1="{x(root):.1f}" y1="34" x2="{x(root):.1f}" y2="{base + 6}" '
        f'stroke="{MUTED}" stroke-dasharray="4 4"/>'
        f'<text x="{x(root) + 6:.1f}" y="48" font-family="Caveat, cursive" '
        f'font-size="22" fill="{MUTED}">√{n} = {int(root)}</text>'
    )
    # candidate marker
    cx = x(upto) if upto <= n else x(n)
    g.append(
        f'<rect x="{cx - 13:.1f}" y="{base - 13}" width="26" height="26" rx="6" '
        f'fill="{SKY}" stroke="{INK}" stroke-width="1"/>'
        f'<text x="{cx:.1f}" y="18" text-anchor="middle" font-family="{MONO}" '
        f'font-size="14" fill="{INK}">d = {upto}</text>'
        f'<line x1="{cx:.1f}" y1="24" x2="{cx:.1f}" y2="{base - 14}" '
        f'stroke="{INK}" stroke-width="1"/>'
    )
    for a, b in found:
        if a == b:
            g.append(
                f'<circle cx="{x(a):.1f}" cy="{base}" r="8" fill="#ffffff" '
                f'stroke="{INK}" stroke-width="1.5"/>'
            )
            continue
        rx = (x(b) - x(a)) / 2
        ry = min(104, 18 + rx * 0.42)
        g.append(
            f'<path d="M {x(a):.1f} {base} A {rx:.1f} {ry:.1f} 0 0 1 '
            f'{x(b):.1f} {base}" fill="none" stroke="{INK}" stroke-width="1.5"/>'
        )
    for v in sorted({v for p in found for v in p}):
        g.append(
            f'<circle cx="{x(v):.1f}" cy="{base}" r="3.5" fill="{INK}"/>'
            f'<text x="{x(v):.1f}" y="{base + 26}" text-anchor="middle" '
            f'font-family="{MONO}" font-size="13" fill="{INK}">{v}</text>'
        )
    g.append("</svg>")
    return "".join(g)


def search_stepper(n: int = 36) -> str:
    """Frame-by-frame search of divisor pairs up to the square root."""
    frames, found, d = [], [], 1
    while True:
        if d * d > n:
            caption = (
                f"Проверяем {d}: {d} · {d} = {d * d} больше {n} — стоп. "
                f"Все пары уже найдены, делители: "
                f"{', '.join(map(str, sorted({v for p in found for v in p})))}."
            )
            frames.append((_line_frame(n, d, found), caption))
            break
        if n % d == 0:
            q = n // d
            found.append((d, q))
            if d == q:
                caption = (
                    f"Проверяем {d}: {n} = {d} · {d}. Пара из одного числа — "
                    f"делитель {d} записываем один раз."
                )
            else:
                caption = (
                    f"Проверяем {d}: {n} % {d} = 0. Нашли сразу два делителя — "
                    f"{d} и {n} // {d} = {q}."
                )
        else:
            caption = f"Проверяем {d}: {n} % {d} = {n % d}. Не делитель, пары нет."
        frames.append((_line_frame(n, d, list(found)), caption))
        d += 1
    return _stepper(frames)


STEPPER_JS = """<script>
document.querySelectorAll("[data-stepper]").forEach(function (fig) {
  var frames = Array.prototype.slice.call(fig.querySelectorAll(".frame"));
  var cap = fig.querySelector(".st-caption");
  var count = fig.querySelector(".st-count");
  var play = fig.querySelector(".st-play");
  var i = 0, timer = null;
  function show(k) {
    i = Math.max(0, Math.min(frames.length - 1, k));
    frames.forEach(function (f, j) { f.hidden = j !== i; });
    cap.textContent = frames[i].dataset.caption;
    count.textContent = "шаг " + (i + 1) + " из " + frames.length;
  }
  function stop() { clearInterval(timer); timer = null; play.textContent = "Воспроизвести"; }
  fig.querySelector(".st-prev").addEventListener("click", function () { stop(); show(i - 1); });
  fig.querySelector(".st-next").addEventListener("click", function () { stop(); show(i + 1); });
  play.addEventListener("click", function () {
    if (timer) { stop(); return; }
    if (i === frames.length - 1) show(0);
    play.textContent = "Пауза";
    timer = setInterval(function () {
      if (i === frames.length - 1) { stop(); return; }
      show(i + 1);
    }, 1600);
  });
  show(0);
});
</script>"""


def cover_svg(side: int = 6, rows: int = 7, cols: int = 8, cell: int = 22) -> str:
    """A rows×cols rectangle drawn over the side×side square it must cover."""
    left, top = 16, 16
    w, h = cols * cell, rows * cell
    out = [
        f'<svg viewBox="0 0 660 {top * 2 + h}" role="img" '
        f'aria-label="Прямоугольник {rows} на {cols} накрывает квадрат '
        f'{side} на {side}">'
    ]
    for r in range(rows):
        for c in range(cols):
            inside = r >= rows - side and c < side
            fill = SKY if inside else "#ffffff"
            out.append(
                f'<rect x="{left + c * cell}" y="{top + r * cell}" width="{cell}" '
                f'height="{cell}" fill="{fill}" stroke="{FAINT}"/>'
            )
    out.append(
        f'<rect x="{left}" y="{top + (rows - side) * cell}" width="{side * cell}" '
        f'height="{side * cell}" fill="none" stroke="{INK}" stroke-width="2"/>'
        f'<rect x="{left}" y="{top}" width="{w}" height="{h}" fill="none" '
        f'stroke="{INK}" stroke-width="1.5" stroke-dasharray="6 4"/>'
    )
    tx = left + w + 28
    lines = [
        (f"{side} × {side} = {side * side} клеток", INK),
        ("— уже все 36 клеток", MUTED),
        (f"{rows} × {cols} = {rows * cols} клеток", INK),
        ("— лишние клетки вокруг", MUTED),
    ]
    y = top + 34
    for i, (text, color) in enumerate(lines):
        out.append(
            f'<text x="{tx}" y="{y}" font-family="{MONO}" font-size="15" '
            f'fill="{color}">{text}</text>'
        )
        y += 26 if i % 2 == 0 else 44
    out.append("</svg>")
    return "".join(out)


# ---------------------------------------------------------------- review set
WASH = "#f3f3f1"
LILAC = "#ece8f6"


def remainder_svg(n: int = 17, d: int = 5, cell: int = 30) -> str:
    """n cells laid out in rows of d: full rows are the quotient, rest is r."""
    q, r = divmod(n, d)
    left, top = 16, 16
    rows = q + (1 if r else 0)
    h = top * 2 + rows * (cell + 8)
    out = [f'<svg viewBox="0 0 660 {h}" role="img" aria-label="{n} клеток рядами по {d}">']
    for row in range(rows):
        k = d if row < q else r
        y = top + row * (cell + 8)
        for c in range(k):
            fill = "#ffffff" if row < q else SKY
            out.append(
                f'<rect x="{left + c * cell}" y="{y}" width="{cell}" '
                f'height="{cell}" fill="{fill}" stroke="{INK}"/>'
            )
        label = (
            f"ряд {row + 1}: {d} клеток" if row < q else f"остаток: {r} — на полный ряд не хватает"
        )
        out.append(
            f'<text x="{left + d * cell + 18}" y="{y + cell / 2 + 5}" '
            f'font-family="{MONO}" font-size="14" fill="{INK if row < q else MUTED}">'
            f"{label}</text>"
        )
    out.append("</svg>")
    return "".join(out)


def overlap_svg(s: str = "7777", sub: str = "77", cell: int = 34) -> str:
    """All start positions of sub in s versus what str.count finds."""
    left, top = 16, 22
    starts = [i for i in range(len(s) - len(sub) + 1) if s.startswith(sub, i)]
    counted, i = [], 0
    while True:
        j = s.find(sub, i)
        if j < 0:
            break
        counted.append(j)
        i = j + len(sub)
    rows = len(starts)
    h = top + cell + 14 + rows * 26 + 20
    out = [f'<svg viewBox="0 0 660 {h}" role="img" aria-label="Вхождения {sub} в {s}">']
    for k, ch in enumerate(s):
        out.append(
            f'<rect x="{left + k * cell}" y="{top}" width="{cell}" height="{cell}" '
            f'fill="#ffffff" stroke="{INK}"/>'
            f'<text x="{left + k * cell + cell / 2}" y="{top + cell / 2 + 6}" '
            f'text-anchor="middle" font-family="{MONO}" font-size="17" '
            f'fill="{INK}">{ch}</text>'
            f'<text x="{left + k * cell + cell / 2}" y="{top - 6}" text-anchor="middle" '
            f'font-family="{MONO}" font-size="11" fill="{MUTED}">{k}</text>'
        )
    y = top + cell + 14
    for st in starts:
        mine = st in counted
        x1, x2 = left + st * cell + 4, left + (st + len(sub)) * cell - 4
        out.append(
            f'<line x1="{x1}" y1="{y + 8}" x2="{x2}" y2="{y + 8}" '
            f'stroke="{INK if mine else MUTED}" stroke-width="{4 if mine else 2}"'
            f"{'' if mine else ' stroke-dasharray="5 4"'}/>"
        )
        note = "count находит" if mine else "count пропускает: перекрывается с найденным"
        out.append(
            f'<text x="{left + len(s) * cell + 18}" y="{y + 13}" font-family="{MONO}" '
            f'font-size="13" fill="{INK if mine else MUTED}">с позиции {st}: {note}</text>'
        )
        y += 26
    out.append("</svg>")
    return "".join(out)


def arcs_svg(
    n: int,
    *,
    mark_even: bool = False,
    emphasize=None,
    mute=None,
    caption_root: bool = True,
    width: int = 660,
    ordinal: bool = False,
) -> str:
    """Divisor pairs of n as arcs. Optionally mark even divisors (filled) vs
    odd (hollow), emphasize one pair and fade another."""
    left, right, base = 24, 24, 150
    root = n**0.5
    pairs = [(d, n // d) for d in range(1, int(root) + 1) if n % d == 0]
    if ordinal:
        ds = sorted({v for p in pairs for v in p})
        step = (width - left - right) / (len(ds) - 1)

        def x(v):
            if v in ds:
                return left + ds.index(v) * step
            lo = max(i for i, dv in enumerate(ds) if dv < v)
            frac = (v - ds[lo]) / (ds[lo + 1] - ds[lo])
            return left + (lo + frac) * step
    else:

        def x(v):
            return left + (v - 1) / (n - 1) * (width - left - right)

    g = [
        f'<svg viewBox="0 0 {width} 196" role="img" aria-label="Пары делителей {n}">',
        f'<line x1="{left}" y1="{base}" x2="{width - right}" y2="{base}" '
        f'stroke="{INK}" stroke-width="1.5"/>',
    ]
    if caption_root:
        exact = root == int(root)
        lab = f"√{n} = {int(root)}" if exact else f"√{n} ≈ {root:.2f}".replace(".", ",")
        g.append(
            f'<line x1="{x(root):.1f}" y1="14" x2="{x(root):.1f}" y2="{base + 6}" '
            f'stroke="{MUTED}" stroke-dasharray="4 4"/>'
            f'<text x="{x(root) + 6:.1f}" y="28" font-family="Caveat, cursive" '
            f'font-size="21" fill="{MUTED}">{lab}</text>'
        )
    for a, b in pairs:
        strong = emphasize == (a, b)
        faded = mute == (a, b)
        stroke = FAINT if faded else INK
        sw = 3 if strong else 1.5
        dash = ' stroke-dasharray="5 4"' if faded else ""
        if a == b:
            g.append(
                f'<circle cx="{x(a):.1f}" cy="{base}" r="9" fill="{SKY}" '
                f'stroke="{INK}" stroke-width="1.5"/>'
            )
            continue
        rx = (x(b) - x(a)) / 2
        ry = min(104, 18 + rx * 0.42)
        g.append(
            f'<path d="M {x(a):.1f} {base} A {rx:.1f} {ry:.1f} 0 0 1 {x(b):.1f} {base}" '
            f'fill="none" stroke="{stroke}" stroke-width="{sw}"{dash}/>'
        )
    for v in sorted({v for p in pairs for v in p}):
        hollow = mark_even and v % 2
        g.append(
            f'<circle cx="{x(v):.1f}" cy="{base}" r="{5 if mark_even else 3.5}" '
            f'fill="{"#ffffff" if hollow else INK}" stroke="{INK}" stroke-width="1.5"/>'
            f'<text x="{x(v):.1f}" y="{base + 26}" text-anchor="middle" '
            f'font-family="{MONO}" font-size="13" fill="{INK}">{v}</text>'
        )
    g.append("</svg>")
    return "".join(g)


def two_arcs_figure(a: int, b: int) -> str:
    return (
        '<div class="pair-figs">'
        + arcs_svg(a, width=330, ordinal=True)
        + arcs_svg(b, width=330, ordinal=True)
        + "</div>"
    )


def ladder_svg(n: int = 360) -> str:
    """School-style division ladder: number on the left, prime on the right."""
    rows, m, d = [], n, 2
    while d * d <= m:
        while m % d == 0:
            rows.append((m, d))
            m //= d
        d += 1
    if m > 1:
        rows.append((m, m))
        m = 1
    rows.append((1, None))
    step, top, xl, xr = 30, 26, 150, 180
    h = top + len(rows) * step + 10
    out = [
        f'<svg viewBox="0 0 660 {h}" role="img" aria-label="Разложение {n} лесенкой">',
        f'<line x1="{xl + 14}" y1="{top - 18}" x2="{xl + 14}" '
        f'y2="{top + (len(rows) - 1) * step + 8}" stroke="{INK}" stroke-width="1.5"/>',
    ]
    for i, (val, p) in enumerate(rows):
        y = top + i * step
        out.append(
            f'<text x="{xl}" y="{y}" text-anchor="end" font-family="{MONO}" '
            f'font-size="17" fill="{INK}">{val}</text>'
        )
        if p:
            out.append(
                f'<text x="{xr + 12}" y="{y}" font-family="{MONO}" font-size="17" '
                f'fill="{INK}">{p}</text>'
                f'<text x="{xr + 60}" y="{y}" font-family="Caveat, cursive" '
                f'font-size="19" fill="{MUTED}">{val} : {p} = {val // p}</text>'
            )
    primes = [p for _, p in rows if p]
    out.append(
        f'<text x="{xr + 190}" y="{top + step * 2}" font-family="{MONO}" '
        f'font-size="15" fill="{INK}">{n} = {" · ".join(map(str, primes))}</text>'
    )
    out.append("</svg>")
    return "".join(out)


def _factor_frame(m0, m, d, factors, note_cond) -> str:
    out = ['<svg viewBox="0 0 660 170" role="img" aria-hidden="true">']
    box = lambda x, label, val, fill: (  # noqa: E731
        f'<rect x="{x}" y="14" width="190" height="64" rx="10" fill="{fill}" '
        f'stroke="{INK}"/>'
        f'<text x="{x + 14}" y="38" font-family="{MONO}" font-size="13" '
        f'fill="{MUTED}">{label}</text>'
        f'<text x="{x + 14}" y="66" font-family="{MONO}" font-size="24" '
        f'fill="{INK}">{val}</text>'
    )
    out.append(box(16, "m — что осталось", m, "#ffffff"))
    out.append(box(226, "d — кандидат", d if d else "—", SKY))
    out.append(
        f'<text x="436" y="40" font-family="{MONO}" font-size="14" '
        f'fill="{INK}">{note_cond[0]}</text>'
        f'<text x="436" y="64" font-family="{MONO}" font-size="14" '
        f'fill="{MUTED}">{note_cond[1]}</text>'
    )
    chips = " · ".join(map(str, factors)) if factors else "пока пусто"
    out.append(
        f'<text x="16" y="116" font-family="{MONO}" font-size="13" '
        f'fill="{MUTED}">множители</text>'
        f'<text x="16" y="146" font-family="{MONO}" font-size="20" '
        f'fill="{INK}">{m0} = {chips}{"" if m == 1 or not factors else " · …"}</text>'
    )
    out.append("</svg>")
    return "".join(out)


def factor_stepper(n: int = 1050) -> str:
    """prime_factors(n) frame by frame: why while, why composite d never
    divides, why the remainder after the loop is prime."""
    names = {2: "двойки", 3: "тройки", 5: "пятёрки", 7: "семёрки"}
    frames, factors, m, d = [], [], n, 2
    frame = lambda cond, cap: frames.append(  # noqa: E731
        (_factor_frame(n, m, d, list(factors), cond), cap)
    )
    frame((f"d · d = {d * d} ≤ {m}", "продолжаем"), f"Начинаем: m = {n}, первый кандидат d = 2.")
    while d * d <= m:
        if m % d == 0:
            m //= d
            factors.append(d)
            again = factors.count(d) > 1
            frame(
                (f"{m * d} % {d} = 0", f"делим: m = {m}"),
                f"{m * d} делится на {d}: записываем {d}, теперь m = {m}. "
                + (
                    "Снова тот же множитель — поэтому внутри стоит while, а не if."
                    if again
                    else "Не меняем d: вдруг делится ещё раз."
                ),
            )
            continue
        small = [k for k in range(2, d) if d % k == 0]
        why = ""
        if small:
            gone = sorted({k for k in factors if d % k == 0})
            if gone:
                why = (
                    " Составное "
                    + str(d)
                    + " делить не может: все "
                    + ", ".join(names.get(k, str(k)) for k in gone)
                    + " уже удалены из m."
                )
        frame(
            (f"{m} % {d} = {m % d}", "не делится — d + 1"),
            f"{m} на {d} не делится — переходим к d = {d + 1}.{why}",
        )
        d += 1
    frame(
        (f"d · d = {d * d} > {m}", "цикл закончен"),
        f"{d} · {d} = {d * d} больше m = {m} — цикл закончен. Если бы у {m} был "
        f"делитель больше 1, хотя бы один нашёлся бы не больше √{m}, а такие "
        f"кандидаты уже проверены.",
    )
    if m > 1:
        factors.append(m)
        last = m
        m = 1
        frame(
            ("m > 1", f"{last} — последний множитель"),
            f"После цикла осталось {last}. Делителей у него нет, значит, {last} "
            f"простое — дописываем его. Итог: {n} = {' · '.join(map(str, factors))}.",
        )
    return _stepper(frames)


def _stepper(frames) -> str:
    parts = ['<figure class="stepper plate-figure" data-stepper>']
    last = len(frames) - 1
    for i, (svg, caption) in enumerate(frames):
        parts.append(
            f'<div class="frame" data-caption="{caption}"'
            f"{'' if i == last else ' hidden'}>{svg}</div>"
        )
    parts.append(
        '<div class="stepper-ctrl">'
        '<button type="button" class="st-prev" aria-label="Предыдущий шаг">←</button>'
        '<button type="button" class="st-play">Воспроизвести</button>'
        '<button type="button" class="st-next" aria-label="Следующий шаг">→</button>'
        f'<span class="st-count">шаг {len(frames)} из {len(frames)}</span></div>'
        f'<figcaption class="st-caption" aria-live="polite">{frames[-1][1]}</figcaption>'
        "</figure>"
    )
    return "".join(parts)


def _mask_parts(mask: str):
    parts, buf = [], ""
    for ch in mask:
        if ch in "?*":
            if buf:
                parts.append(buf)
                buf = ""
            parts.append(ch)
        else:
            buf += ch
    if buf:
        parts.append(buf)
    return parts


def _segment(mask: str, s: str):
    """Split s by mask parts (first valid split, star as short as possible)."""
    parts = _mask_parts(mask)

    def go(i, k):
        if i == len(parts):
            return [] if k == len(s) else None
        p = parts[i]
        if p == "?":
            if k < len(s) and s[k].isdigit():
                rest = go(i + 1, k + 1)
                return None if rest is None else [(p, s[k])] + rest
            return None
        if p == "*":
            for L in range(0, len(s) - k + 1):
                rest = go(i + 1, k + L)
                if rest is not None:
                    return [(p, s[k : k + L])] + rest
            return None
        if s.startswith(p, k):
            rest = go(i + 1, k + len(p))
            return None if rest is None else [(p, p)] + rest
        return None

    return go(0, 0)


def mask_align_svg(mask: str, samples: list[str]) -> str:
    cell, left, top, gap = 26, 16, 34, 16
    fills = {"?": LILAC, "*": SKY}
    h = top + len(samples) * (cell + gap) + 8
    out = [
        f'<svg viewBox="0 0 660 {h}" role="img" aria-label="Разбор чисел по маске {mask}">',
        f'<text x="{left}" y="20" font-family="{MONO}" font-size="14" fill="{MUTED}">'
        f"маска {mask}: белое — обязательные цифры, сиреневое — ?, голубое — *</text>",
    ]
    for r, s in enumerate(samples):
        y = top + r * (cell + gap)
        seg = _segment(mask, s)
        x = left
        if seg is None:
            for ch in s:
                out.append(
                    f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" fill="{WASH}" '
                    f'stroke="{FAINT}"/><text x="{x + cell / 2}" y="{y + 18}" '
                    f'text-anchor="middle" font-family="{MONO}" font-size="15" '
                    f'fill="{MUTED}">{ch}</text>'
                )
                x += cell
        else:
            for p, text in seg:
                if p == "*" and text == "":
                    out.append(
                        f'<rect x="{x - 2}" y="{y - 3}" width="4" height="{cell + 6}" '
                        f'fill="{SKY}" stroke="{INK}" stroke-width="1"/>'
                    )
                    continue
                for ch in text:
                    out.append(
                        f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" '
                        f'fill="{fills.get(p, "#ffffff")}" stroke="{INK}"/>'
                        f'<text x="{x + cell / 2}" y="{y + 18}" text-anchor="middle" '
                        f'font-family="{MONO}" font-size="15" fill="{INK}">{ch}</text>'
                    )
                    x += cell
        star = next((t for p, t in seg if p == "*"), None) if seg else None
        verdict = (
            f"подходит: * = «{star}»"
            if seg and star is not None and star
            else "подходит: * — пустая"
            if seg
            else "не подходит"
        )
        out.append(
            f'<text x="{left + 8 * cell + 24}" y="{y + 18}" font-family="{MONO}" '
            f'font-size="14" fill="{INK if seg else MUTED}">{s} — {verdict}</text>'
        )
    out.append("</svg>")
    return "".join(out)


MASK_TRY_HTML = """<div class="mask-try" data-mask-try>
<div class="mt-row"><label>Маска <input class="mt-mask" value="12*3?" spellcheck="false" autocomplete="off"></label>
<label>Число <input class="mt-num" value="120034" inputmode="numeric" spellcheck="false" autocomplete="off"></label></div>
<div class="mt-out" aria-live="polite"></div>
<p class="mt-note">Белые клетки — обязательные цифры маски, сиреневые — <code>?</code>, голубые — <code>*</code>. Тонкая голубая черта — пустая <code>*</code>.</p>
</div>"""

MASK_TRY_JS = """<script>
document.querySelectorAll("[data-mask-try]").forEach(function (box) {
  var mi = box.querySelector(".mt-mask"), ni = box.querySelector(".mt-num"), out = box.querySelector(".mt-out");
  function parts(mask) {
    var res = [], buf = "";
    for (var i = 0; i < mask.length; i++) {
      var c = mask[i];
      if (c === "?" || c === "*") { if (buf) { res.push(buf); buf = ""; } res.push(c); } else buf += c;
    }
    if (buf) res.push(buf);
    return res;
  }
  function seg(ps, s, i, k) {
    if (i === ps.length) return k === s.length ? [] : null;
    var p = ps[i];
    if (p === "?") {
      if (k < s.length && /[0-9]/.test(s[k])) { var r = seg(ps, s, i + 1, k + 1); return r && [[p, s[k]]].concat(r); }
      return null;
    }
    if (p === "*") {
      for (var L = 0; L <= s.length - k; L++) { var r2 = seg(ps, s, i + 1, k + L); if (r2) return [[p, s.slice(k, k + L)]].concat(r2); }
      return null;
    }
    if (s.slice(k, k + p.length) === p) { var r3 = seg(ps, s, i + 1, k + p.length); return r3 && [[p, p]].concat(r3); }
    return null;
  }
  function esc(t) { return t.replace(/[&<>]/g, function (c) { return {"&": "&amp;", "<": "&lt;", ">": "&gt;"}[c]; }); }
  function run() {
    var mask = mi.value.trim(), s = ni.value.trim();
    if (!mask || !s) { out.innerHTML = "<p class='mt-msg'>Введи маску и число.</p>"; return; }
    if (!/^[0-9]+$/.test(s)) { out.innerHTML = "<p class='mt-msg'>Число должно состоять только из цифр.</p>"; return; }
    if (!/^[0-9?*]+$/.test(mask)) { out.innerHTML = "<p class='mt-msg'>В маске допустимы только цифры, ? и *.</p>"; return; }
    var r = seg(parts(mask), s, 0, 0), html = "<div class='mt-cells'>";
    if (!r) {
      for (var i = 0; i < s.length; i++) html += "<span class='c bad'>" + esc(s[i]) + "</span>";
      out.innerHTML = html + "</div><p class='mt-msg'>Не подходит: число нельзя разбить по частям маски.</p>";
      return;
    }
    var star = null;
    r.forEach(function (pt) {
      var cls = pt[0] === "?" ? "q" : pt[0] === "*" ? "s" : "f";
      if (pt[0] === "*") star = pt[1];
      if (pt[0] === "*" && pt[1] === "") { html += "<span class='c empty' title='пустая *'></span>"; return; }
      for (var j = 0; j < pt[1].length; j++) html += "<span class='c " + cls + "'>" + esc(pt[1][j]) + "</span>";
    });
    var note = star === null ? "" : star === "" ? " Звёздочка здесь пустая." : " Звёздочка заменяет «" + esc(star) + "».";
    out.innerHTML = html + "</div><p class='mt-msg ok'>Подходит." + note + "</p>";
  }
  mi.addEventListener("input", run); ni.addEventListener("input", run); run();
});
</script>"""


def divisor_grid_svg(p: int = 2, a: int = 3, q: int = 3, b: int = 2) -> str:
    """Divisors of p^a·q^b as a grid: rows are powers of p, columns powers of q."""
    cw, ch, left, top = 84, 40, 130, 40
    w = left + (b + 1) * cw
    h = top + (a + 1) * ch + 16
    sup = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")
    out = [f'<svg viewBox="0 0 660 {h}" role="img" aria-label="Делители {p**a * q**b} в таблице">']
    for j in range(b + 1):
        out.append(
            f'<text x="{left + j * cw + cw / 2}" y="{top - 12}" text-anchor="middle" '
            f'font-family="{MONO}" font-size="15" fill="{MUTED}">{q}{str(j).translate(sup)}</text>'
        )
    for i in range(a + 1):
        y = top + i * ch
        out.append(
            f'<text x="{left - 14}" y="{y + ch / 2 + 6}" text-anchor="end" '
            f'font-family="{MONO}" font-size="15" fill="{MUTED}">{p}{str(i).translate(sup)}</text>'
        )
        for j in range(b + 1):
            even = i >= 1
            out.append(
                f'<rect x="{left + j * cw}" y="{y}" width="{cw}" height="{ch}" '
                f'fill="{SKY if even else "#ffffff"}" stroke="{INK}"/>'
                f'<text x="{left + j * cw + cw / 2}" y="{y + ch / 2 + 6}" text-anchor="middle" '
                f'font-family="{MONO}" font-size="16" fill="{INK}">{p**i * q**j}</text>'
            )
    tx = w + 30
    out.append(
        f'<text x="{tx}" y="{top + 18}" font-family="{MONO}" font-size="14" fill="{INK}">'
        f"{a + 1} строки × {b + 1} столбца = {(a + 1) * (b + 1)}</text>"
        f'<text x="{tx}" y="{top + 48}" font-family="{MONO}" font-size="14" fill="{MUTED}">'
        f"верхняя строка — нечётные: {b + 1}</text>"
        f'<text x="{tx}" y="{top + 72}" font-family="{MONO}" font-size="14" fill="{MUTED}">'
        f"голубые — чётные: {a * (b + 1)}</text>"
    )
    out.append("</svg>")
    return "".join(out)


# ------------------------------------------------------------------ registry
# Lesson Markdown calls a figure as %%name(args)%%, for example
# %%rectangles(36)%% or %%arcs(84, emphasize=(2, 42), ordinal=True)%%.
# Arguments must be Python literals. Add a new builder here, never inline SVG
# by hand: every number on a figure has to come from code.

FIGURES = {
    "rectangles": rectangles_svg,
    "cover": cover_svg,
    "search_stepper": search_stepper,
    "remainder": remainder_svg,
    "overlap": overlap_svg,
    "arcs": arcs_svg,
    "two_arcs": two_arcs_figure,
    "ladder": ladder_svg,
    "factor_stepper": factor_stepper,
    "mask_align": mask_align_svg,
    "mask_try": lambda: MASK_TRY_HTML,
    "divisor_grid": divisor_grid_svg,
}

# Script appended once to a page whose HTML contains the marker.
PAGE_SCRIPTS = {
    "data-stepper": STEPPER_JS,
    "data-mask-try": MASK_TRY_JS,
}
