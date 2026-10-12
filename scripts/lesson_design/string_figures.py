"""Figures of topic 24 «Обработка символьных строк» (registered in figures.FIGURES).

Every number on a figure is computed here from the same data as the picture.
All keys start with ``string_`` so they never clash with other topics.

``string_bounds(text, left, right)`` — a fragment with included ends: its
length right − left + 1, the characters strictly between and the difference
of the positions, three numbers from the same two ends.
``string_run_stepper(text, mode, target)`` — the current length of a chain
character by character: ``only`` (every character must be target), ``same``
(equal neighbours) or ``diff`` (different neighbours); the best chain so far
under the string.
``string_expected(pattern, n)`` — the expected next character of a repeated
pattern: current, current % len(pattern), pattern[current % len(pattern)].
``string_offsets(text, first, second)`` — whole pairs «first + second» from
offset 0 and from offset 1: the fitting pairs and the longest chain of each.
``string_window_stepper(text, word, k)`` — the sliding window: the right end
moves by one, the left end catches up while there are more than k whole
occurrences of word inside.
``string_positions(text, letter, k)`` — positions of letter with the
sentinels −1 and n: for every k consecutive occurrences the widest fragment.
``string_matches(text, pattern)`` — the matches of re.finditer as brackets
under the string; the longest one is accented.
``string_prefix(text, letter, left, right)`` — prefix counts on the
boundaries between characters: the count inside [left, right] is
prefix[right + 1] − prefix[left].
"""

from __future__ import annotations

import re

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stepper, _text, ru_count

WIDTH = 660


def _cells(x0, y, text, cell, fill=(), hot=None, faint=(), size=None):
    """One row of character cells: washed cells, an accented one, faint ones."""
    out = []
    size = size or (20 if cell >= 40 else 16)
    for i, c in enumerate(text):
        x = x0 + i * cell
        stroke = ACCENT if i == hot else INK
        out.append(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{cell}" height="{cell}" '
            f'fill="{WASH if i in fill else "#fff"}" stroke="{stroke}" '
            f'stroke-width="{2.5 if i == hot else 1.25}"/>'
        )
        color = MUTED if i in faint else INK
        out.append(_text(x + cell / 2, y + cell * 0.68, c, size, color, "middle", 600))
    if hot is not None:
        x = x0 + hot * cell
        out.append(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{cell}" height="{cell}" fill="none" '
            f'stroke="{ACCENT}" stroke-width="2.5"/>'
        )
    return out


def _indexes(x0, y, n, cell, start=0, size=13):
    return [
        _text(x0 + i * cell + cell / 2, y, str(start + i), size, MUTED, "middle") for i in range(n)
    ]


def _bracket(x1, x2, y, color=INK, width=1.5, up=False):
    d = -7 if up else 7
    return (
        f'<path d="M {x1:.1f} {y - d:.1f} v {d} H {x2:.1f} v {-d}" fill="none" '
        f'stroke="{color}" stroke-width="{width}" stroke-linejoin="round"/>'
    )


def _left(n: int, cell: float) -> float:
    return (WIDTH - n * cell) / 2


# --- included ends ----------------------------------------------------------------


def string_bounds(text: str = "XXAXXXXBXX", left: int = 3, right: int = 6) -> str:
    n, cell = len(text), 46
    x0 = _left(n, cell)
    length, between, diff = right - left + 1, right - left - 1, right - left
    out = [f'<svg viewBox="0 0 {WIDTH} 236" role="img" aria-label="Длина, между и разность">']
    out += _indexes(x0, 22, n, cell)
    out += _cells(x0, 32, text, cell, fill=set(range(left, right + 1)))
    for i, name in ((left, "left"), (right, "right")):
        out.append(_text(x0 + i * cell + cell / 2, 96, f"{name} = {i}", 13, ACCENT, "middle", 600))
    xl, xr = x0 + left * cell, x0 + (right + 1) * cell
    out.append(_bracket(xl + 3, xr - 3, 116, ACCENT, 2))
    out.append(
        _text((xl + xr) / 2, 140, f"длина: right − left + 1 = {length}", 14, ACCENT, "middle", 600)
    )
    if between > 0:
        out.append(_bracket(xl + cell + 3, xr - cell - 3, 160, INK))
        out.append(
            _text(
                (xl + xr) / 2, 184, f"строго между: right − left − 1 = {between}", 14, INK, "middle"
            )
        )
    ca, cb = xl + cell / 2, xr - cell / 2
    out.append(
        f'<line x1="{ca:.1f}" y1="206" x2="{cb:.1f}" y2="206" stroke="{MUTED}" stroke-width="1.5"/>'
        f'<path d="M {cb:.1f} 206 l -8 -4 v 8 z" fill="{MUTED}"/>'
        f'<circle cx="{ca:.1f}" cy="206" r="3" fill="{MUTED}"/>'
    )
    out.append(
        _text((ca + cb) / 2, 228, f"разность номеров: right − left = {diff}", 14, MUTED, "middle")
    )
    out.append("</svg>")
    return "".join(out)


# --- current length of a chain ----------------------------------------------------------


def _run_states(text: str, mode: str, target: str):
    """(current, best, best_end, verdict) after every character."""
    current = best = 0
    best_end = -1
    states = []
    for i, c in enumerate(text):
        if mode == "only":
            ok = c == target
            current = current + 1 if ok else 0
            if not ok:
                why = f"'{c}' не подходит и не входит ни в одну цепочку: сброс до 0"
            elif current == 1:
                why = f"'{c}' подходит: началась новая цепочка"
            else:
                why = f"'{c}' подходит: цепочка продолжилась"
        else:
            prev_ok = i > 0 and ((text[i] == text[i - 1]) == (mode == "same"))
            if prev_ok:
                current += 1
                rel = "равен" if mode == "same" else "отличается от"
                why = f"'{c}' {rel} предыдущего '{text[i - 1]}': цепочка продолжилась"
            elif i == 0:
                current = 1
                why = "первый символ сам образует цепочку длины 1"
            else:
                current = 1
                rel = "не равен" if mode == "same" else "равен"
                why = f"'{c}' {rel} предыдущему '{text[i - 1]}', но сам начинает новую цепочку: сброс до 1"
        if current > best:
            best, best_end = current, i
        states.append((current, best, best_end, why))
    return states


def _run_frame(text, i, current, best, best_end, cell=44):
    n = len(text)
    x0 = _left(n, cell)
    chain = set(range(i - current + 1, i + 1)) if i >= 0 else set()
    out = [f'<svg viewBox="0 0 {WIDTH} 196" role="img" aria-label="Текущая цепочка и лучшая">']
    out += _indexes(x0, 20, n, cell)
    out += _cells(
        x0, 30, text, cell, fill=chain, hot=i if i >= 0 else None, faint=set(range(i + 1, n))
    )
    if best > 0:
        xl = x0 + (best_end - best + 1) * cell + 3
        xr = x0 + (best_end + 1) * cell - 3
        out.append(_bracket(xl, xr, 92, MUTED))
        out.append(_text((xl + xr) / 2, 116, f"лучшая: {best}", 13, MUTED, "middle"))
    out.append(_text(WIDTH / 2 - 90, 160, f"current = {current}", 18, ACCENT, "middle", 600))
    out.append(_text(WIDTH / 2 + 90, 160, f"best = {best}", 18, INK, "middle", 600))
    out.append(
        _text(
            WIDTH / 2,
            186,
            "заливка — текущая цепочка, рамка — прочитанный символ",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


def string_run_frames(text: str = "XXAXXXXBXX", mode: str = "only", target: str = "X"):
    frames = [(_run_frame(text, -1, 0, 0, -1), "До цикла: current = 0, best = 0.")]
    for i, (current, best, best_end, why) in enumerate(_run_states(text, mode, target)):
        frames.append(
            (
                _run_frame(text, i, current, best, best_end),
                f"s[{i}] = '{text[i]}': {why}. current = {current}, best = {best}"
                + (" — новый лучший результат." if best_end == i else "."),
            )
        )
    return frames


def string_run_stepper(text: str = "XXAXXXXBXX", mode: str = "only", target: str = "X") -> str:
    return _stepper(string_run_frames(text, mode, target))


# --- expected character of a repeated pattern ------------------------------------------------


def string_expected(pattern: str = "ABC", n: int = 7) -> str:
    cell, m = 52, len(pattern)
    x0 = _left(n, cell) + 40
    out = [f'<svg viewBox="0 0 {WIDTH} 196" role="img" aria-label="Ожидаемый символ образца">']
    rows = [
        ("current", [str(c) for c in range(n)], INK),
        (f"current % {m}", [str(c % m) for c in range(n)], MUTED),
        ("ожидаем", [pattern[c % m] for c in range(n)], ACCENT),
    ]
    for r, (label, values, color) in enumerate(rows):
        y = 18 + r * 50
        out.append(_text(x0 - 12, y + 30, label, 13, MUTED, "end"))
        for c, v in enumerate(values):
            x = x0 + c * cell
            out.append(
                f'<rect x="{x:.1f}" y="{y}" width="{cell}" height="44" fill="{WASH if r == 2 else "#fff"}" '
                f'stroke="{FAINT if r < 2 else INK}" stroke-width="1.25"/>'
            )
            out.append(_text(x + cell / 2, y + 29, v, 17, color, "middle", 600))
    out.append(
        _text(
            WIDTH / 2,
            188,
            f"после {m} символов ожидание повторяется: pattern[current % {m}]",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- whole pairs from two offsets ----------------------------------------------------------------


def string_offsets(text: str = "ABACEFAED", first: str = "BCDF", second: str = "AE") -> str:
    n, cell = len(text), 46
    x0 = _left(n, cell)
    out = [f'<svg viewBox="0 0 {WIDTH} 232" role="img" aria-label="Пары с двух смещений">']
    out += _indexes(x0, 20, n, cell)
    out += _cells(x0, 30, text, cell)
    for offset in range(2):
        y = 104 + offset * 64
        current = best = 0
        for i in range(offset, n - 1, 2):
            good = text[i] in first and text[i + 1] in second
            current = current + 1 if good else 0
            best = max(best, current)
            xl, xr = x0 + i * cell + 4, x0 + (i + 2) * cell - 4
            out.append(_bracket(xl, xr, y, ACCENT if good else FAINT, 2 if good else 1.5))
            out.append(
                _text(
                    (xl + xr) / 2,
                    y + 22,
                    "да" if good else "нет",
                    13,
                    ACCENT if good else MUTED,
                    "middle",
                )
            )
        out.append(_text(x0 - 10, y + 6, f"с {offset}", 13, MUTED, "end"))
        out.append(_text(x0 + n * cell + 10, y + 6, f"подряд: {best}", 13, INK, "start", 600))
    out.append(
        _text(
            WIDTH / 2,
            224,
            "пары одной строки не пересекаются; цепочка начинается с любого смещения",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- sliding window -------------------------------------------------------------------------------


def _inside(text: str, word: str, left: int, right: int) -> int:
    m = len(word)
    return sum(text[i : i + m] == word for i in range(left, right - m + 2))


def _window_frame(text, word, k, left, right, best, cell=44, removing=None):
    n = len(text)
    x0 = _left(n, cell)
    count = _inside(text, word, left, right) if right >= 0 else 0
    out = [f'<svg viewBox="0 0 {WIDTH} 196" role="img" aria-label="Скользящее окно">']
    out += _indexes(x0, 20, n, cell)
    window = set(range(left, right + 1))
    out += _cells(x0, 30, text, cell, fill=window, faint=set(range(right + 1, n)))
    if right >= left:
        dash = ' stroke-dasharray="7 5"' if count > k else ""
        out.append(
            f'<rect x="{x0 + left * cell - 3:.1f}" y="27" width="{(right - left + 1) * cell + 6:.1f}" '
            f'height="{cell + 6}" rx="6" fill="none" stroke="{ACCENT}" stroke-width="2.5"{dash}/>'
        )
    if removing is not None:
        x = x0 + removing * cell + cell / 2
        out.append(_text(x, 98, "↑ убираем", 13, ACCENT, "middle", 600))
    out.append(_text(WIDTH / 2 - 170, 140, f"left = {left}", 16, INK, "middle", 600))
    out.append(_text(WIDTH / 2 - 55, 140, f"right = {right}", 16, INK, "middle", 600))
    label = f"{word}" if len(word) > 1 else f"{word}"
    out.append(_text(WIDTH / 2 + 70, 140, f"{label} в окне: {count}", 16, ACCENT, "middle", 600))
    out.append(_text(WIDTH / 2 + 195, 140, f"best = {best}", 16, INK, "middle", 600))
    out.append(
        _text(
            WIDTH / 2,
            182,
            f"окно — символы от left до right; нужно не больше {k} вхождений {word}",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


def string_window_frames(text: str = "BABAACB", word: str = "A", k: int = 2):
    frames = [
        (_window_frame(text, word, k, 0, -1, 0), "До цикла: окно пустое, left = 0, best = 0.")
    ]
    left = best = 0
    for right in range(len(text)):
        count = _inside(text, word, left, right)
        if count > k:
            frames.append(
                (
                    _window_frame(text, word, k, left, right, best),
                    f"right = {right}: добавили '{text[right]}', вхождений {word} стало {count} > {k} — "
                    "окно плохое, двигаем левую границу.",
                )
            )
        while _inside(text, word, left, right) > k:
            frames.append(
                (
                    _window_frame(text, word, k, left, right, best, removing=left),
                    f"Убираем s[{left}] = '{text[left]}': теперь left = {left + 1}, "
                    f"вхождений {word} в окне: {_inside(text, word, left + 1, right)}.",
                )
            )
            left += 1
        length = right - left + 1
        best = max(best, length)
        count = _inside(text, word, left, right)
        frames.append(
            (
                _window_frame(text, word, k, left, right, best),
                f"right = {right}: окно s[{left}:{right + 1}] = '{text[left : right + 1]}', "
                f"вхождений {word}: {count}, длина {length}, best = {best}.",
            )
        )
    return frames


def string_window_stepper(text: str = "BABAACB", word: str = "A", k: int = 2) -> str:
    return _stepper(string_window_frames(text, word, k))


# --- positions with sentinels -----------------------------------------------------------------------


def string_positions(text: str = "BABAACB", letter: str = "A", k: int = 2) -> str:
    n, cell = len(text), 46
    x0 = _left(n + 2, cell) + cell
    positions = [-1] + [i for i, c in enumerate(text) if c == letter] + [n]
    groups = list(range(1, len(positions) - k))
    lengths = [positions[j + k] - positions[j - 1] - 1 for j in groups]
    best = max(lengths) if lengths else 0
    height = 120 + 48 * len(groups) + 30
    out = [
        f'<svg viewBox="0 0 {WIDTH} {height}" role="img" aria-label="Позиции и искусственные границы">'
    ]
    out += _indexes(x0 - cell, 20, n + 2, cell, start=-1)
    for x in (x0 - cell, x0 + n * cell):
        out.append(
            f'<rect x="{x:.1f}" y="30" width="{cell}" height="{cell}" fill="#fff" stroke="{MUTED}" '
            f'stroke-width="1.25" stroke-dasharray="4 4"/>'
        )
        out.append(_text(x + cell / 2, 30 + cell * 0.68, "|", 18, MUTED, "middle"))
    out += _cells(x0, 30, text, cell, fill={p for p in positions[1:-1]})
    shown = ", ".join(str(p) if p >= 0 else "−1" for p in positions)
    out.append(_text(WIDTH / 2, 100, f"positions = [{shown}]", 14, INK, "middle", 600))
    for r, (j, length) in enumerate(zip(groups, lengths, strict=True)):
        y = 132 + r * 48
        left, right = positions[j - 1] + 1, positions[j + k] - 1
        hot = length == best
        xl, xr = x0 + left * cell + 3, x0 + (right + 1) * cell - 3
        out.append(_bracket(xl, xr, y, ACCENT if hot else INK, 2 if hot else 1.5))
        chosen = ", ".join(str(p) for p in positions[j : j + k])
        out.append(
            _text(
                (xl + xr) / 2,
                y + 22,
                f"{letter} на {chosen}: от {left} до {right}, длина {length}",
                13,
                ACCENT if hot else INK,
                "middle",
                600 if hot else 400,
            )
        )
    out.append(
        _text(
            WIDTH / 2,
            height - 8,
            f"длина = positions[j + {k}] − positions[j − 1] − 1",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- matches of a regular expression -----------------------------------------------------------------


def string_matches(
    text: str = "03+5**7+0*12", pattern: str = r"(?:0|[1-9][0-9]*)(?:[+*](?:0|[1-9][0-9]*))*"
) -> str:
    n = len(text)
    cell = min(46, (WIDTH - 40) / n)
    x0 = _left(n, cell)
    matches = [(m.start(), m.end()) for m in re.finditer(pattern, text)]
    best = max(e - s for s, e in matches)
    out = [f'<svg viewBox="0 0 {WIDTH} 176" role="img" aria-label="Совпадения finditer">']
    out += _indexes(x0, 20, n, cell)
    hot_cells = {i for s, e in matches if e - s == best for i in range(s, e)}
    out += _cells(x0, 30, text, cell, fill=hot_cells)
    for k, (s, e) in enumerate(matches):
        hot = e - s == best
        y = 96 + (k % 2) * 30
        xl, xr = x0 + s * cell + 3, x0 + e * cell - 3
        out.append(_bracket(xl, xr, y, ACCENT if hot else INK, 2 if hot else 1.5))
        out.append(
            _text(
                (xl + xr) / 2,
                y + 20,
                f"{text[s:e]} ({e - s})",
                13,
                ACCENT if hot else INK,
                "middle",
                600 if hot else 400,
            )
        )
    out.append(
        _text(
            WIDTH / 2,
            168,
            f"finditer: {ru_count(len(matches), 'совпадение', 'совпадения', 'совпадений')} слева направо, самое длинное — {best}",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


# --- prefix counts ----------------------------------------------------------------------------------------


def string_prefix(text: str = "BABA", letter: str = "A", left: int = 1, right: int = 3) -> str:
    n, cell = len(text), 56
    x0 = _left(n, cell)
    prefix = [0]
    for c in text:
        prefix.append(prefix[-1] + (c == letter))
    out = [f'<svg viewBox="0 0 {WIDTH} 236" role="img" aria-label="Префиксные суммы на границах">']
    out += _indexes(x0, 20, n, cell)
    out += _cells(x0, 30, text, cell, fill=set(range(left, right + 1)))
    out.append(_text(x0 - 26, 136, "t", 13, MUTED, "end"))
    out.append(_text(x0 - 26, 160, "prefix[t]", 13, MUTED, "end"))
    for t in range(n + 1):
        x = x0 + t * cell
        hot = t in (left, right + 1)
        color = ACCENT if hot else MUTED
        out.append(
            f'<line x1="{x:.1f}" y1="98" x2="{x:.1f}" y2="116" stroke="{color}" '
            f'stroke-width="{2 if hot else 1.25}"/>'
        )
        out.append(_text(x, 136, str(t), 13, color, "middle", 600 if hot else 400))
        out.append(_text(x, 160, str(prefix[t]), 17, ACCENT if hot else INK, "middle", 600))
    inside = prefix[right + 1] - prefix[left]
    out.append(
        _text(
            WIDTH / 2,
            198,
            f"{letter} в s[{left}:{right + 1}]: prefix[{right + 1}] − prefix[{left}] = {prefix[right + 1]} − {prefix[left]} = {inside}",
            15,
            ACCENT,
            "middle",
            600,
        )
    )
    out.append(
        _text(
            WIDTH / 2,
            226,
            f"prefix[t] — сколько {letter} среди первых t символов (левее черты t)",
            13,
            MUTED,
            "middle",
        )
    )
    out.append("</svg>")
    return "".join(out)


STRING_FIGURES: dict = {
    "string_bounds": string_bounds,
    "string_run_stepper": string_run_stepper,
    "string_expected": string_expected,
    "string_offsets": string_offsets,
    "string_window_stepper": string_window_stepper,
    "string_positions": string_positions,
    "string_matches": string_matches,
    "string_prefix": string_prefix,
}
STRING_STEPPERS: dict = {
    "string_run_stepper": string_run_frames,
    "string_window_stepper": string_window_frames,
}
STRING_WIDGETS: dict = {}
STRING_SCRIPTS: dict = {}
