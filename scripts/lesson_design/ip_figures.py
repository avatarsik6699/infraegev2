"""Figures of topic 10 «IP-адреса и маски» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.
All keys start with ``ip_`` so they never clash with other topics.

``ip_bits(address, prefix, mask=True, free=False)`` — the 32 bits of an address
in four octets with their decimal values, the mask under it and the boundary
of the prefix: the dots split octets, the mask splits network and host.
``ip_and(address, prefix)`` — address, mask and their bitwise AND (the network
address) bit by bit; the host part becomes zeros.
``ip_blocks(mask_octet, value)`` — the values of one octet in blocks of
256 − m: the block of the value starts at the nearest multiple below it.
``ip_grid(address, prefix, number)`` — a network whose host part spans two
octets as rows of 256 addresses: the network address, the broadcast address,
the address and its number (row · 256 + column).
``ip_pair(first, second, kind)`` — two addresses bit by bit. ``kind="mask"``:
an address and its network address, the mask boundary between L (the last one
of the network) and C (the first difference). ``kind="two"``: two hosts and
their common leading bits C.
``ip_pairs(free)`` — all values of the free bits split into pairs that differ
in the last bit: one of each pair has an even number of ones.
"""

from __future__ import annotations

from ipaddress import ip_address, ip_network

from figures import ACCENT, FAINT, INK, MUTED, WASH, _text

W = 660
MONO = "JetBrains Mono, ui-monospace, monospace"


def _svg(height: float, label: str) -> list[str]:
    return [f'<svg viewBox="0 0 {W} {height:.0f}" role="img" aria-label="{label}">']


def _mono(x, y, s, size: float = 13, color=INK, anchor="middle", weight=500) -> str:
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{MONO}" font-size="{size}" '
        f'font-weight="{weight}" fill="{color}" text-anchor="{anchor}">{s}</text>'
    )


def _rect(x, y, w, h, fill="#fff", stroke=FAINT, width=1.0) -> str:
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>'
    )


def _line(x1, y1, x2, y2, color=INK, width=1.5, dashed=False) -> str:
    dash = ' stroke-dasharray="4 4"' if dashed else ""
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
        f'stroke="{color}" stroke-width="{width}"{dash}/>'
    )


def bits32(value) -> str:
    return format(int(ip_address(value)), "032b")


def octets(bits: str) -> list[int]:
    return [int(bits[i : i + 8], 2) for i in range(0, 32, 8)]


def mask_bits(prefix: int) -> str:
    return "1" * prefix + "0" * (32 - prefix)


def common(a: str, b: str) -> int:
    """C: how many leading bits of two 32-bit strings coincide."""
    c = 0
    while c < 32 and a[c] == b[c]:
        c += 1
    return c


# --- one row of 32 bits ---------------------------------------------------------------

LEFT, RIGHT, GAP = 92, 12, 10
CELL = (W - LEFT - RIGHT - 3 * GAP) / 32


def bx(i: int) -> float:
    """Left edge of bit i (0-based) of 32."""
    return LEFT + i * CELL + (i // 8) * GAP


def edge(p: int) -> float:
    """x of the boundary after p bits: in the gap when it falls on a dot."""
    if p <= 0:
        return LEFT - 3
    if p >= 32:
        return bx(31) + CELL + 3
    if p % 8 == 0:
        return bx(p) - GAP / 2
    return bx(p)


def _row(y, label, bits, prefix=None, shade_host=True, hidden=(), bold=False) -> list[str]:
    """Decimal octets above, then 32 bit cells; host cells washed."""
    out = [_text(LEFT - 10, y + 22, label, 13, MUTED, "end")]
    for k, value in enumerate(octets(bits)):
        mid = bx(8 * k) + 4 * CELL
        out.append(_text(mid, y + 2, str(value), 13, INK, "middle", 600 if bold else 400))
    for i, b in enumerate(bits):
        host = prefix is not None and i >= prefix
        fill = WASH if host and shade_host else "#fff"
        out.append(_rect(bx(i), y + 8, CELL, 22, fill))
        shown = "?" if i in hidden else b
        out.append(
            _mono(
                bx(i) + CELL / 2,
                y + 24,
                shown,
                12,
                MUTED if i in hidden else INK,
                weight=600 if bold else 500,
            )
        )
    return out


def _boundary(prefix: int, top: float, bottom: float) -> list[str]:
    x = edge(prefix)
    out = [_line(x, top, x, bottom, ACCENT, 2.5)]
    out.append(_text(LEFT, bottom + 20, f"сеть: {prefix} бит", 13, INK, "start", 600))
    out.append(_text(W - RIGHT, bottom + 20, f"узел: {32 - prefix} бит", 13, INK, "end", 600))
    out.append(_line(LEFT, bottom + 6, x - 4, bottom + 6, MUTED, 1.2))
    out.append(_line(x + 4, bottom + 6, W - RIGHT, bottom + 6, MUTED, 1.2))
    return out


def ip_bits(
    address: str = "192.168.10.173", prefix: int = 26, mask: bool = True, free: bool = False
) -> str:
    """The address and its mask as 32 bits with the boundary of the prefix."""
    bits = bits32(address)
    rows = [("адрес", bits)]
    if mask:
        rows.append(("маска", mask_bits(prefix)))
    height = 18 + 46 * len(rows) + 32 + (28 if free else 0)
    out = _svg(height, f"Адрес {address} и маска /{prefix}: 32 бита, граница после {prefix} бит")
    y = 18
    for label, b in rows:
        hidden = range(prefix, 32) if free and label == "адрес" else ()
        out += _row(y, label, b, prefix, hidden=hidden)
        y += 46
    out += _boundary(prefix, 22, y + 2)
    if free:
        c = bits[:prefix].count("1")
        out.append(
            _text(
                W / 2,
                y + 50,
                f"единиц в сетевой части: {c} у каждого адреса; свободных битов: {32 - prefix}",
                13,
                MUTED,
                "middle",
            )
        )
    out.append("</svg>")
    return "".join(out)


def ip_and(address: str = "192.168.10.173", prefix: int = 26) -> str:
    """Address AND mask = network address, bit by bit."""
    a = bits32(address)
    m = mask_bits(prefix)
    n = "".join("1" if x == y == "1" else "0" for x, y in zip(a, m, strict=True))
    net = ip_network(f"{address}/{prefix}", strict=False)
    assert octets(n) == [int(o) for o in str(net.network_address).split(".")]
    out = _svg(18 + 46 * 3 + 32, f"{address} И маска /{prefix} = {net.network_address}")
    y = 18
    for label, b, bold in (("адрес", a, False), ("маска", m, False), ("«И»", n, True)):
        out += _row(y, label, b, prefix, bold=bold)
        y += 46
    out.append(_line(LEFT, y - 59, W - RIGHT, y - 59, MUTED, 1))
    out += _boundary(prefix, 22, y + 2)
    out.append("</svg>")
    return "".join(out)


# --- blocks of 256 − m ---------------------------------------------------------------


def ip_blocks(mask_octet: int = 192, value: int = 173) -> str:
    """Values of an octet grouped by d = 256 − m; the block of the value."""
    d = 256 - mask_octet
    start = value // d * d
    if d >= 16:
        lo, hi = 0, 256
    else:
        lo = max(0, start - 2 * d)
        hi = min(256, lo + 6 * d)
    left, right, y = 40, 620, 96
    scale = (right - left) / (hi - lo)

    def x(v: float) -> float:
        return left + (v - lo) * scale

    out = _svg(178, f"Значения октета блоками по {d}: {value} в блоке {start}–{start + d - 1}")
    out.append(
        _text(16, 22, f"октет маски {mask_octet}: блоки по 256 − {mask_octet} = {d}", 13, MUTED)
    )
    out.append(_rect(x(start), y - 16, d * scale, 32, WASH, INK, 1.5))
    out.append(_line(x(lo), y, x(hi), y, INK, 1.5))
    for b in range(lo, hi + 1, d):
        out.append(
            _line(x(b), y - 16, x(b), y + 16, INK if b in (start, start + d) else MUTED, 1.2)
        )
        out.append(
            _text(
                x(b),
                y + 34,
                str(b) if b < 256 else "256",
                13,
                INK,
                "middle",
                600 if b == start else 400,
            )
        )
    if lo > 0:
        out.append(_text(left - 8, y + 5, "…", 15, MUTED, "end"))
    if hi < 256:
        out.append(_text(right + 8, y + 5, "…", 15, MUTED, "start"))
    xv = x(value + 0.5) if d < 16 else x(value)
    out.append(_line(xv, 40, xv, y - 18, ACCENT, 2))
    out.append(_text(xv, 34, str(value), 14, ACCENT, "middle", 600))
    out.append(
        _text(
            W / 2,
            166,
            f"{value} = {value // d} · {d} + {value % d}: начало блока {start}, конец {start + d - 1}",
            14,
            INK,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- a network as rows of 256 ----------------------------------------------------------


def ip_grid(address: str = "172.20.77.140", prefix: int = 22, number: int | None = None) -> str:
    """Rows: values of the third octet; columns: the fourth octet 0…255."""
    net = ip_network(f"{address}/{prefix}", strict=False)
    a = ip_address(address)
    base = int(net.network_address)
    rows = net.num_addresses // 256
    assert 1 < rows <= 8, "the grid shows a host part of 9…11 bits"
    first = octets(bits32(net.network_address))
    left, right, top, lane = 110, 620, 52, 34
    unit = (right - left) / 256
    height = top + rows * lane + 40
    out = _svg(height, f"Сеть {net}: {rows} строк по 256 адресов")
    out.append(_text(16, 22, f"сеть {net}: {rows} · 256 = {net.num_addresses} адресов", 13, MUTED))
    for v in (0, 128, 255):
        out.append(_text(left + (v + 0.5) * unit, top - 8, str(v), 12, MUTED, "middle"))
    for r in range(rows):
        y = top + r * lane
        out.append(
            _text(left - 10, y + 20, f"{first[0]}.{first[1]}.{first[2] + r}.", 12, MUTED, "end")
        )
        out.append(_rect(left, y + 6, right - left, 20, "#fff", FAINT))
    marks = [(int(a) - base, f"{a}: номер {int(a) - base}", True)]
    if number is not None:
        marks.append((number, f"{net.network_address + number}: номер {number}", False))
    for pos, label in [
        (0, "адрес сети"),
        (net.num_addresses - 1, "широковещательный"),
    ]:
        r, c = divmod(pos, 256)
        x, y = left + c * unit, top + r * lane + 6
        out.append(_rect(x - 1, y, max(unit, 3), 20, INK, INK))
        anchor = "start" if c < 128 else "end"
        out.append(_text(x + (8 if c < 128 else -6), y + 15, label, 12, MUTED, anchor))
    for pos, label, hot in marks:
        r, c = divmod(pos, 256)
        x, y = left + (c + 0.5) * unit, top + r * lane + 6
        color = ACCENT if hot else INK
        out.append(_line(x, y - 2, x, y + 22, color, 3))
        out.append(_text(x + 8, y + 15, label, 12, color, "start", 600))
    pos = int(a) - base
    r, c = divmod(pos, 256)
    out.append(
        _text(
            W / 2,
            height - 14,
            f"номер = {r} · 256 + {c} = {pos}: строки выше дают по 256 адресов",
            14,
            INK,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- two addresses bit by bit --------------------------------------------------------


def ip_pair(first: str = "172.20.174.93", second: str = "172.20.160.0", kind: str = "mask") -> str:
    """kind="mask": address and network address, L ≤ p ≤ C; kind="two": two hosts, C."""
    a, b = bits32(first), bits32(second)
    c = common(a, b)
    labels = ("адрес", "сеть") if kind == "mask" else ("узел 1", "узел 2")
    out = _svg(18 + 46 * 2 + 64, f"{first} и {second} по битам")
    y = 18
    for label, bits in zip(labels, (a, b), strict=True):
        out += _row(y, label, bits, None)
        y += 46
    bottom = y + 2
    xc = edge(c)
    if kind == "mask":
        last = b.rfind("1") + 1  # L: position (1-based) of the last one of the network
        xl = edge(last)
        for top in (y - 92, y - 46):
            out.append(_rect(xl, top + 6, xc - xl, 26, "none", ACCENT, 2.5))
        out.append(_text(xl, bottom + 6, f"L = {last}", 13, INK, "middle", 600))
        out.append(_text(xc, bottom + 24, f"C = {c}", 13, INK, "middle", 600))
        masks = ", ".join(f"/{p}" for p in range(last, c + 1))
        out.append(
            _text(
                W / 2,
                bottom + 52,
                f"биты в рамке бывают и сетевыми, и узловыми: {last} ≤ p ≤ {c}, маски {masks}",
                14,
                INK,
                "middle",
                600,
            )
        )
    else:
        for top in (y - 92, y - 46):
            out.append(_line(xc, top + 4, xc, top + 34, ACCENT, 2.5))
        out.append(_text(xc, bottom + 6, f"C = {c}", 13, INK, "middle", 600))
        out.append(
            _text(
                W / 2,
                bottom + 38,
                f"первые {c} бит совпадают: одна сеть при p ≤ {c}, разные при p > {c}",
                14,
                INK,
                "middle",
                600,
            )
        )
    out.append("</svg>")
    return "".join(out)


# --- parity of ones in pairs ---------------------------------------------------------


def ip_pairs(free: int = 4, fixed_ones: int = 7) -> str:
    """Variants of the free bits in pairs differing in the last bit."""
    total = 2**free
    pairs = [(format(v, f"0{free}b"), format(v + 1, f"0{free}b")) for v in range(0, total, 2)]
    cols = 2
    per = (len(pairs) + cols - 1) // cols
    lane = 30
    out = _svg(56 + per * lane + 40, f"{total} вариантов {free} свободных битов парами")
    out.append(
        _text(16, 22, "пара отличается только последним битом: единиц в ней k и k + 1", 13, MUTED)
    )
    even = 0
    for i, (x0, x1) in enumerate(pairs):
        col, row = divmod(i, per)
        x = 24 + col * 316
        y = 52 + row * lane
        out.append(_rect(x, y - 18, 306, 26, WASH, WASH))
        for j, v in enumerate((x0, x1)):
            ones = fixed_ones + v.count("1")
            ok = ones % 2 == 0
            even += ok
            xx = x + j * 150
            out.append(_mono(xx + 30, y, v, 14, INK))
            out.append(
                _text(
                    xx + 66,
                    y,
                    f"{ones} — {'чётно' if ok else 'нечётно'}",
                    12,
                    INK if ok else MUTED,
                    "start",
                    600 if ok else 400,
                )
            )
    out.append(
        _text(
            W / 2,
            56 + per * lane + 22,
            f"в каждой паре ровно один адрес с чётным числом единиц: {even} из {total}",
            14,
            INK,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


IP_FIGURES: dict = {
    "ip_bits": ip_bits,
    "ip_and": ip_and,
    "ip_blocks": ip_blocks,
    "ip_grid": ip_grid,
    "ip_pair": ip_pair,
    "ip_pairs": ip_pairs,
}
IP_STEPPERS: dict = {}
IP_WIDGETS: dict = {}
IP_SCRIPTS: dict = {}
