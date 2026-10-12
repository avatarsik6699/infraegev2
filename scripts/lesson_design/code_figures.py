"""Figures of topic 4 «Кодирование и условие Фано» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture:
the code words, the free branches of the tree, the lengths and their sums.

``code_tree(codes, new, reserve, free, path, limit)`` — the code tree of a table:
letters in the leaves, paths to them, maximal free branches (dashed), new
letters in accent, a reserve branch, a highlighted path, a length limit.
``code_parses(codes, bits)`` — every way to cut one string into code words.
``code_pairs(pairs)`` — two code words aligned from the left: is one the
beginning of the other, a common start, or only the end.
``code_decode(codes, bits)`` — reading a message by the tree, bit by bit.
``code_split(codes, letters, room)`` — places for new letters: the shortest
free vertex is split while it lowers the sum of lengths.
``code_shapes(codes, freq, variants)`` — two forms of the tree side by side
with each letter's contribution to the length of the message.
``code_space(codes)`` — the space of all sequences as a segment of length 1:
a code of length l takes 1/2ˡ of it (Kraft).
``code_huffman(freq)`` — Huffman merges of the two rarest groups, step by step.
"""

from __future__ import annotations

from fractions import Fraction

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stepper, _text, ru_count

W = 660
DY = 52  # vertical step between tree levels
R = 15  # radius of a letter node


# --- the tree -----------------------------------------------------------------------


def conflict(a: str, b: str) -> bool:
    """One code word is the beginning of the other (or they are equal)."""
    return a.startswith(b) or b.startswith(a)


def free_nodes(codes, prefix: str = "") -> list[str]:
    """Maximal vertices with no code word on them, above or below them."""
    if prefix in codes:
        return []
    if not any(c.startswith(prefix) for c in codes):
        return [prefix]
    return free_nodes(codes, prefix + "0") + free_nodes(codes, prefix + "1")


def _as_dict(codes) -> dict[str, str]:
    """{letter: code}; a plain list of codes gets empty letters."""
    if isinstance(codes, dict):
        return dict(codes)
    return {f"#{i}": c for i, c in enumerate(codes)}


def _layout(leaves: list[str], x0: float, width: float, top: float) -> dict[str, tuple]:
    """Positions of the leaves (in-order slots) and of every prefix above them."""
    order = sorted(leaves)  # lexicographic order of prefix-free words = left to right
    gap = width / max(len(order), 1)
    pos: dict[str, tuple] = {}
    for i, leaf in enumerate(order):
        pos[leaf] = (x0 + gap * (i + 0.5), top + DY * len(leaf))
    inner = {leaf[:k] for leaf in leaves for k in range(len(leaf))}
    for node in sorted(inner, key=lambda s: (-len(s), s)):  # stable: same SVG every build
        kids = [pos[k] for k in (node + "0", node + "1") if k in pos]
        x = sum(p[0] for p in kids) / len(kids)
        pos[node] = (x, top + DY * len(node))
    return pos


def _tree(
    codes,
    new=None,
    reserve=(),
    free: bool = True,
    path: str | None = None,
    x0: float = 56,
    width: float = W - 72,
    top: float = 34,
    limit: int | None = None,
    small: bool = False,
    under: dict | None = None,
) -> tuple[list[str], int]:
    """SVG elements of a code tree and the y of its lowest level."""
    fixed, added = _as_dict(codes), _as_dict(new or {})
    words = set(fixed.values()) | set(added.values()) | set(reserve)
    gaps = free_nodes(words) if free and words else []
    leaves = sorted(words | set(gaps))
    pos = _layout(leaves, x0, width, top)
    on_path = {path[:k] for k in range(len(path) + 1)} if path is not None else set()
    out: list[str] = []
    r = 12 if small else R
    for node, (x, y) in pos.items():
        if not node:
            continue
        px, py = pos[node[:-1]]
        hot = node in on_path
        out.append(
            f'<line x1="{px:.1f}" y1="{py:.1f}" x2="{x:.1f}" y2="{y:.1f}" '
            f'stroke="{ACCENT if hot else INK}" stroke-width="{2.2 if hot else 1.3}"/>'
        )
        mx, my = (px + x) / 2, (py + y) / 2
        dx = -9 if node[-1] == "0" else 9
        out.append(_text(mx + dx, my + 2, node[-1], 11 if small else 12, MUTED, "middle", 600))
    if limit is not None:
        y = top + DY * limit
        out.append(
            f'<line x1="{x0 - 8:.1f}" y1="{y + r + 4:.1f}" x2="{x0 + width:.1f}" '
            f'y2="{y + r + 4:.1f}" stroke="{MUTED}" stroke-width="1" stroke-dasharray="4 4"/>'
        )
    letter_of = {c: k for k, c in fixed.items()}
    new_of = {c: k for k, c in added.items()}
    size = 10.5 if small else 12
    for node, (x, y) in pos.items():
        if node == "":
            hot = path is not None
            out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="{ACCENT if hot else INK}"/>')
            out.append(_text(x + 10, y - 6, "корень", 11, MUTED))
        elif node in letter_of or node in new_of:
            is_new = node in new_of
            name = new_of[node] if is_new else letter_of[node]
            hot = is_new or node == path
            stroke = ACCENT if hot else INK
            out.append(
                f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="#fff" stroke="{stroke}" '
                f'stroke-width="{2 if hot else 1.5}"/>'
            )
            if not name.startswith("#"):
                out.append(_text(x, y + 5, name, 13 if small else 15, stroke, "middle", 600))
            shown = (under or {}).get(node, node)
            out.append(_text(x, y + r + 14, shown, size, MUTED, "middle"))
        elif node in reserve or node in gaps:
            label = node + "…"
            w = max(32.0, len(label) * size * 0.64 + 16)
            out.append(
                f'<rect x="{x - w / 2:.1f}" y="{y - 11:.1f}" width="{w:.1f}" height="22" '
                f'rx="11" fill="{WASH}" stroke="{MUTED}" stroke-width="1.2" '
                'stroke-dasharray="4 3"/>'
            )
            out.append(_text(x, y + 4, label, size, MUTED, "middle"))
            if node in reserve:
                out.append(_text(x, y + 26, "резерв", 11, MUTED, "middle"))
            elif limit is not None and len(node) <= limit:
                places = 2 ** (limit - len(node))
                out.append(_text(x, y + 26, f"до {places} мест", 11, MUTED, "middle"))
        else:
            hot = node in on_path
            out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="{ACCENT if hot else INK}"/>')
    bottom = top + DY * max((len(n) for n in pos), default=0)
    return out, int(bottom)


def _depths(top: float, levels: int, x: float = 8) -> list[str]:
    out = [_text(x, top - 18, "длина", 11, MUTED)]
    for d in range(1, levels + 1):
        out.append(_text(x + 14, top + DY * d + 5, str(d), 12, MUTED, "middle"))
    return out


def code_tree(
    codes,
    new=None,
    reserve=(),
    free: bool = True,
    path: str | None = None,
    limit: int | None = None,
) -> str:
    """The code tree of a table (see the module docstring)."""
    top = 34
    body, bottom = _tree(codes, new, tuple(reserve), free, path, top=top, limit=limit)
    levels = (bottom - top) // DY
    if limit is not None:
        levels = max(levels, limit)
    height = top + DY * levels + (64 if limit is not None else 44)
    label = "Кодовое дерево: " + ", ".join(
        f"{k} — {c}" for k, c in _as_dict(codes).items() if not k.startswith("#")
    )
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="{label}">']
    out += _depths(top, levels)
    if limit is not None:
        out.append(
            _text(W - 16, top + DY * limit + R + 20, f"предел длины {limit}", 11, MUTED, "end")
        )
    out += body
    out.append("</svg>")
    return "".join(out)


# --- one string, several cuts -------------------------------------------------------


def parses(codes: dict[str, str], bits: str) -> list[list[tuple[str, str]]]:
    """Every cut of bits into code words: lists of (letter, code)."""
    if not bits:
        return [[]]
    out = []
    for letter, code in codes.items():
        if bits.startswith(code):
            out += [[(letter, code)] + rest for rest in parses(codes, bits[len(code) :])]
    return out


def _cells(x0, y, s, cell=34, hot=()) -> list[str]:
    out = []
    for i, ch in enumerate(s):
        x = x0 + i * cell
        h = i in hot
        out.append(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{cell}" height="{cell}" rx="5" '
            f'fill="{WASH if h else "#fff"}" stroke="{ACCENT if h else INK}" '
            f'stroke-width="{2 if h else 1.3}"/>'
        )
        out.append(_text(x + cell / 2, y + cell * 0.68, ch, 17, INK, "middle", 600))
    return out


def code_parses(codes: dict, bits: str) -> str:
    """All cuts of one received string into code words of the table."""
    cuts = parses(codes, bits)
    cell = 40
    x0 = (W - cell * len(bits)) / 2
    height = 70 + 56 * len(cuts) + 10
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Разбиения {bits}">']
    out.append(_text(16, 22, "получено", 12, MUTED))
    out += _cells(x0, 30, bits, cell)
    for k, cut in enumerate(cuts):
        y = 92 + 56 * k
        out.append(_text(16, y + 10, f"способ {k + 1}", 12, MUTED))
        i = 0
        for letter, code in cut:
            xa, xb = x0 + i * cell + 4, x0 + (i + len(code)) * cell - 4
            out.append(
                f'<path d="M {xa:.1f} {y} v 8 H {xb:.1f} v -8" fill="none" '
                f'stroke="{ACCENT}" stroke-width="1.6" stroke-linecap="round"/>'
            )
            out.append(_text((xa + xb) / 2, y + 30, letter, 16, INK, "middle", 600))
            i += len(code)
        word = "".join(letter for letter, _ in cut)
        out.append(_text(W - 16, y + 30, f"= {word}", 15, INK, "end", 600))
    out.append("</svg>")
    return "".join(out)


# --- a pair of code words ------------------------------------------------------------


def verdict(a: str, b: str) -> tuple[bool, str]:
    """(allowed, why) for two code words of a Fano table."""
    short, long_ = sorted((a, b), key=len)
    if a == b:
        return False, "одинаковые коды"
    if long_.startswith(short):
        return False, f"{short} — начало {long_}"
    common = 0
    while common < len(short) and a[common] == b[common]:
        common += 1
    if long_.endswith(short):
        return True, f"{short} — конец, а не начало"
    if common:
        return True, f"общее начало {a[:common]}, дальше разные"
    return True, "начала разные"


def code_pairs(pairs) -> str:
    """Two code words aligned from the left, the matching start in accent."""
    cell = 30
    height = 24 + 96 * len(pairs)
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Пары кодовых слов">']
    for k, (a, b) in enumerate(pairs):
        y = 16 + 96 * k
        ok, why = verdict(a, b)
        common = 0
        while common < min(len(a), len(b)) and a[common] == b[common]:
            common += 1
        hot = range(common) if not ok else ()
        out += _cells(24, y, a, cell, hot)
        out += _cells(24, y + cell + 8, b, cell, hot)
        short, long_ = sorted((a, b), key=len)
        if ok and long_.endswith(short) and long_ == b:
            xa = 24 + (len(b) - len(short)) * cell + 3
            xb = 24 + len(b) * cell - 3
            yb = y + 2 * cell + 14
            out.append(
                f'<path d="M {xa:.1f} {yb} v 6 H {xb:.1f} v -6" fill="none" '
                f'stroke="{MUTED}" stroke-width="1.4" stroke-linecap="round"/>'
            )
        x = 24 + cell * 7 + 24
        out.append(
            _text(
                x,
                y + 30,
                "нельзя" if not ok else "можно",
                16,
                ACCENT if not ok else INK,
                weight=600,
            )
        )
        out.append(_text(x, y + 54, why, 14, MUTED))
    out.append("</svg>")
    return "".join(out)


# --- reading by the tree ---------------------------------------------------------------


def _decode_frame(codes, bits, pos, buf, letters, note) -> str:
    body, bottom = _tree(codes, free=False, path=buf, top=34)
    cell = 34
    y = bottom + 44
    x0 = (W - cell * len(bits)) / 2
    out = [f'<svg viewBox="0 0 {W} {y + 110}" role="img" aria-hidden="true">']
    out += body
    out.append(_text(16, y - 8, "сообщение", 12, MUTED))
    done = len(bits) if pos is None else pos
    out += _cells(x0, y, bits, cell, hot=range(done - len(buf), done))
    if pos is not None and pos < len(bits):
        out.append(
            f'<path d="M {x0 + pos * cell + cell / 2:.1f} {y + cell + 6} l -6 9 h 12 z" '
            f'fill="{MUTED}"/>'
        )
    out.append(_text(16, y + cell + 40, "прочитано", 12, MUTED))
    out.append(_text(110, y + cell + 41, " ".join(letters) or "—", 17, INK, weight=600))
    out.append(_text(W - 16, y + cell + 41, note, 13, MUTED, "end"))
    out.append("</svg>")
    return "".join(out)


def decode_frames(codes: dict, bits: str) -> list[tuple[str, str]]:
    """Accumulate bits from the root; a letter is known as soon as a leaf is hit."""
    letter_of = {c: k for k, c in codes.items()}
    frames = [
        (
            _decode_frame(codes, bits, 0, "", [], "начинаем с корня"),
            f"Читаем {bits} слева направо. Начинаем в корне дерева.",
        )
    ]
    buf, letters = "", []
    for i, b in enumerate(bits):
        buf += b
        if buf in letter_of:
            letters.append(letter_of[buf])
            frames.append(
                (
                    _decode_frame(codes, bits, i + 1, buf, letters, f"{buf} — {letter_of[buf]}"),
                    f"Знак {b}: пришли в лист {buf} — это {letter_of[buf]}. "
                    "Следующую букву читаем снова от корня.",
                )
            )
            buf = ""
        else:
            frames.append(
                (
                    _decode_frame(codes, bits, i + 1, buf, letters, f"{buf} — ещё не буква"),
                    f"Знак {b}: вершина {buf} лежит на пути к буквам, читаем дальше.",
                )
            )
    word = "".join(letters)
    frames.append(
        (
            _decode_frame(codes, bits, None, "", letters, f"{bits} = {word}"),
            f"Сообщение кончилось ровно на листе: {bits} — это {word}.",
        )
    )
    return frames


def code_decode(codes: dict, bits: str) -> str:
    """Reading a message by the code tree, bit by bit."""
    return _stepper(decode_frames(codes, bits))


# --- places for new letters --------------------------------------------------------------


def split_plan(codes, k: int, room: bool = False) -> list[tuple[list[str], str]]:
    """Places for k new letters (and a reserve branch if room) with the least sum
    of lengths: split the shortest free vertex while places are too few, or
    while the longest place in use is at least 3 longer than it."""
    places = sorted(free_nodes(set(_as_dict(codes).values())), key=lambda s: (len(s), s))
    need = k + (1 if room else 0)
    steps: list[tuple[list[str], str]] = [(list(places), "start")]
    while True:
        places.sort(key=lambda s: (len(s), s))
        if len(places) < need:
            why = "few"
        elif len(places[k - 1]) >= len(places[0]) + 3:
            why = "deep"
        else:
            break
        shortest = [p for p in places if len(p) == len(places[0])]
        v = shortest[-1]  # the right one: the codes on the left stay small
        places.remove(v)
        places += [v + "0", v + "1"]
        places.sort(key=lambda s: (len(s), s))
        steps.append((list(places), why + ":" + v))
    return steps


def _assign(places: list[str], letters: str, room: bool):
    used = places[: len(letters)]
    new = dict(zip(letters, used, strict=True))
    reserve = places[len(letters) : len(letters) + 1] if room else []
    return new, reserve


def _split_frame(codes, places, letters, room, note, final=False) -> str:
    fixed = _as_dict(codes)
    if final:
        new, reserve = _assign(places, letters, room)
        body, bottom = _tree(fixed, new, tuple(reserve), True)
    else:
        body, bottom = _tree_with_places(fixed, places)
    out = [f'<svg viewBox="0 0 {W} {bottom + 70}" role="img" aria-hidden="true">']
    out += _depths(34, (bottom - 34) // DY)
    out += body
    out.append(_text(W - 16, bottom + 52, note, 14, INK, "end", 600))
    out.append("</svg>")
    return "".join(out)


def _tree_with_places(fixed: dict, places: list[str]) -> tuple[list[str], int]:
    """The tree of the fixed codes where the given places are drawn as free."""
    body, bottom = _tree(fixed, None, tuple(places), False)
    # «резерв» is the label of a reserve; places here are plain free vertices
    body = [b for b in body if "резерв" not in b]
    return body, bottom


def split_frames(codes, letters: str, room: bool = False) -> list[tuple[str, str]]:
    k = len(letters)
    steps = split_plan(codes, k, room)
    frames = []
    for places, why in steps:
        lengths = sorted(len(p) for p in places)[:k]
        total = sum(lengths)
        count = f"мест: {len(places)}"
        if why == "start":
            caption = (
                f"Свободные вершины: {', '.join(places)}. Каждая — одно место; "
                f"нужно {ru_count(k, 'место', 'места', 'мест')}"
                + (" и ещё резерв для остальных букв." if room else ".")
            )
        else:
            kind, v = why.split(":")
            if kind == "few":
                caption = (
                    f"Мест не хватает: делим самую короткую вершину {v} на {v}0 и {v}1. "
                    f"Место длины {len(v)} заменили двумя длины {len(v) + 1}."
                )
            else:
                caption = (
                    f"Места хватает, но самое длинное нужное место длиннее {v} на 3 и больше: "
                    f"выгоднее разделить {v}, а длинное место не брать."
                )
        note = f"{count}, длины для букв: {' + '.join(map(str, lengths))} = {total}"
        frames.append((_split_frame(codes, places, letters, room, note), caption))
    places = steps[-1][0]
    new, reserve = _assign(places, letters, room)
    total = sum(len(c) for c in new.values())
    lengths = " + ".join(str(len(c)) for c in new.values())
    frames.append(
        (
            _split_frame(codes, places, letters, room, f"{lengths} = {total}", final=True),
            "Буквам — самые короткие места"
            + (", резерв — оставшаяся ветвь" if reserve else "")
            + f". Сумма длин новых кодов {total}.",
        )
    )
    return frames


def code_split(codes, letters: str, room: bool = False) -> str:
    """Splitting free vertices into places for new letters, step by step."""
    return _stepper(split_frames(codes, letters, room))


# --- two forms of the tree -----------------------------------------------------------------


def code_shapes(codes: dict, freq: dict, variants) -> str:
    """Two placements of the same letters: trees and contributions."""
    panel = W / len(variants)
    bodies, bottom = [], 0
    for i, new in enumerate(variants):
        body, b = _tree(codes, new, (), False, x0=panel * i + 18, width=panel - 36, small=True)
        bodies.append(body)
        bottom = max(bottom, b)
    height = bottom + 92
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Две формы дерева">']
    for i, (new, body) in enumerate(zip(variants, bodies, strict=True)):
        out += body
        terms = [f"{freq[k]}·{len(c)}" for k, c in new.items()]
        total = sum(freq[k] * len(c) for k, c in new.items())
        cx = panel * i + panel / 2
        out.append(_text(cx, bottom + 48, " + ".join(terms), 13, MUTED, "middle"))
        out.append(_text(cx, bottom + 74, f"= {total}", 17, INK, "middle", 600))
        if i:
            out.append(
                f'<line x1="{panel * i:.1f}" y1="10" x2="{panel * i:.1f}" y2="{height - 10}" '
                f'stroke="{FAINT}" stroke-width="1"/>'
            )
    out.append("</svg>")
    return "".join(out)


# --- the space of sequences (Kraft) -----------------------------------------------------------


def code_space(codes: dict) -> str:
    """A segment of length 1: a code word of length l covers 1/2ˡ of it."""
    fixed = _as_dict(codes)
    gaps = free_nodes(set(fixed.values()))
    parts = sorted([(c, k, False) for k, c in fixed.items()] + [(g, "", True) for g in gaps])
    x0, width, y = 24, W - 48, 40
    out = [f'<svg viewBox="0 0 {W} 150" role="img" aria-label="Доли кодов">']
    start = Fraction(0)
    for code, letter, is_free in parts:
        share = Fraction(1, 2 ** len(code))
        xa = x0 + float(start) * width
        w = float(share) * width
        out.append(
            f'<rect x="{xa + 1:.1f}" y="{y}" width="{w - 2:.1f}" height="44" rx="4" '
            f'fill="{WASH if is_free else "#fff"}" stroke="{MUTED if is_free else INK}" '
            f'stroke-width="1.3"{' stroke-dasharray="4 3"' if is_free else ""}/>'
        )
        name = f"{code}…" if is_free else (letter if letter.startswith("#") else f"{letter} {code}")
        if letter.startswith("#"):
            name = code
        out.append(_text(xa + w / 2, y + 27, name, 13, MUTED if is_free else INK, "middle", 600))
        out.append(_text(xa + w / 2, y + 66, f"1/{2 ** len(code)}", 13, MUTED, "middle"))
        start += share
    used = sum((Fraction(1, 2 ** len(c)) for c in fixed.values()), Fraction(0))
    out.append(_text(x0, 24, "0", 12, MUTED, "middle"))
    out.append(_text(x0 + width, 24, "1", 12, MUTED, "middle"))
    out.append(
        _text(
            W / 2,
            136,
            f"занято {used}" + (" — всё" if used == 1 else f", свободно {1 - used}"),
            15,
            INK,
            "middle",
            600,
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- Huffman -------------------------------------------------------------------------------------


def _leaves(t) -> list[str]:
    return [t[1]] if isinstance(t[1], str) else _leaves(t[1][0]) + _leaves(t[1][1])


def huffman_steps(freq: dict):
    """Forests of Huffman's method: merge the two rarest groups each time."""
    forest = sorted(((f, k) for k, f in freq.items()), key=lambda t: (-t[0], t[1]))
    steps = [(list(forest), "")]
    while len(forest) > 1:
        forest.sort(key=lambda t: (-t[0], "".join(_leaves(t))))
        b, a = forest.pop(), forest.pop()
        merged = (a[0] + b[0], (a, b))
        forest.append(merged)
        forest.sort(key=lambda t: (-t[0], "".join(_leaves(t))))
        steps.append(
            (
                list(forest),
                f"{''.join(_leaves(b))} ({b[0]}) + {''.join(_leaves(a))} ({a[0]}) = {merged[0]}",
            )
        )
    return steps


def _weights(t) -> dict[str, int]:
    if isinstance(t[1], str):
        return {t[1]: t[0]}
    return {**_weights(t[1][0]), **_weights(t[1][1])}


def _codes_of(t, prefix: str = "") -> dict[str, str]:
    if isinstance(t[1], str):
        return {t[1]: prefix or "0"}
    return {**_codes_of(t[1][0], prefix + "0"), **_codes_of(t[1][1], prefix + "1")}


def _huff_frame(forest, note, show_codes: bool = False) -> str:
    sizes = [len(_leaves(t)) for t in forest]
    total = sum(sizes)
    x, out = 40.0, []
    depth = 0
    for t, n in zip(forest, sizes, strict=True):
        width = (W - 80) * n / total
        if isinstance(t[1], str):
            out.append(
                f'<circle cx="{x + width / 2:.1f}" cy="52" r="{R}" fill="#fff" stroke="{INK}" '
                'stroke-width="1.5"/>'
            )
            out.append(_text(x + width / 2, 57, t[1], 15, INK, "middle", 600))
            out.append(_text(x + width / 2, 86, str(t[0]), 13, MUTED, "middle"))
        else:
            codes = _codes_of(t)
            weight = _weights(t)
            depth = max(depth, max(len(c) for c in codes.values()))
            under = None if show_codes else {c: str(weight[k]) for k, c in codes.items()}
            body, _ = _tree(
                codes, None, (), False, x0=x, width=width, top=52, small=True, under=under
            )
            body = [b for b in body if "корень" not in b]
            out += body
            root_x = _layout(sorted(codes.values()), x, width, 52)[""][0]
            out.append(_text(root_x, 38, str(t[0]), 14, ACCENT, "middle", 600))
        x += width
    height = 52 + DY * max(depth, 1) + 72
    head = f'<svg viewBox="0 0 {W} {height}" role="img" aria-hidden="true">'
    out.append(_text(W - 16, height - 14, note, 14, INK, "end", 600))
    return head + "".join(out) + "</svg>"


def huffman_frames(freq: dict) -> list[tuple[str, str]]:
    frames = []
    for forest, merge in huffman_steps(freq):
        if not merge:
            caption = "Каждая буква — отдельная группа со своей частотой."
            note = "группы: " + ", ".join(f"{t[1]} {t[0]}" for t in forest)
        else:
            caption = f"Объединяем две самые редкие группы: {merge}."
            note = merge
        frames.append((_huff_frame(forest, note), caption))
    final = huffman_steps(freq)[-1][0][0]
    codes = _codes_of(final)
    total = sum(freq[k] * len(c) for k, c in codes.items())
    frames.append(
        (
            _huff_frame([final], f"длина сообщения {total}", show_codes=True),
            "Раскрываем группы: левой ветви — 0, правой — 1. Коды: "
            + ", ".join(f"{k} — {codes[k]}" for k in freq)
            + f"; длина сообщения {total}.",
        )
    )
    return frames


def code_huffman(freq: dict) -> str:
    """Huffman's method step by step."""
    return _stepper(huffman_frames(freq))


CODE_FIGURES: dict = {
    "code_tree": code_tree,
    "code_parses": code_parses,
    "code_pairs": code_pairs,
    "code_decode": code_decode,
    "code_split": code_split,
    "code_shapes": code_shapes,
    "code_space": code_space,
    "code_huffman": code_huffman,
}
CODE_STEPPERS: dict = {
    "code_decode": decode_frames,
    "code_split": split_frames,
    "code_huffman": huffman_frames,
}
CODE_WIDGETS: dict = {}
CODE_SCRIPTS: dict = {}
