"""Figures of topic 12 «Исполнение алгоритма для исполнителя» (registered in figures.FIGURES).

A Turing machine of the lesson is executed here: the same table as on the page
(rows — states, columns — symbols, a cell «write, move, next state»), the same
start cell and state. Every tape, head position, state and number of steps in
the figures comes from this execution, not from hand-written labels.

A table is written as a string, one row per state, cells in the order of the
alphabet, «-» for a cell without a command:
``"q0: λLq1 - -; q1: λSq1 1Lq1 0Sq1"`` with ``alphabet="λ01"``.

``tm_tape(word, head, state, first, marks, note)`` — a tape fragment with
coordinates under the cells and the head with its state above one of them.
``tm_trace(word, table, head, alphabet)`` — step by step: before every step
the cell of the table chosen by (state, symbol), after it the tape.
``tm_rows(rows, legend)`` — several labelled tapes one under another, cells
coloured by role (kept part, processed tail, new digit).
``tm_bits(word, left, right)`` — binary word with the weights of its digits
and the digit written to the left or to the right.
``tm_map(src, mapping)`` — one pass that replaces every symbol by its pair:
the tape before, the tape after and the counts that pass from one to the other.
"""

from __future__ import annotations

from figures import ACCENT, FAINT, INK, MUTED, WASH, _stepper, _text

W = 660
CELL = 40
LAMBDA = "λ"
MOVES = {"L": -1, "R": 1, "S": 0}


# --- the machine ---------------------------------------------------------------------


def parse(table: str, alphabet: str = "λ01") -> dict[tuple[str, str], tuple[str, str, str]]:
    """«q0: λLq1 - -; q1: …» → {(state, symbol): (write, move, next)}."""
    rules = {}
    for row in table.split(";"):
        state, cells = row.split(":")
        cells = cells.split()
        assert len(cells) == len(alphabet), row
        for sym, cell in zip(alphabet, cells, strict=True):
            if cell != "-":
                rules[(state.strip(), sym)] = (cell[0], cell[1], cell[2:])
    return rules


def run(word: str, table: str, head: int | None = None, state: str = "q0", alphabet: str = "λ01"):
    """Configurations before every step and after the last one:
    (tape, head, state, rule or None). ``head`` defaults to the empty cell
    right of the word; the word occupies cells 0 … len − 1."""
    rules = parse(table, alphabet)
    tape = {i: s for i, s in enumerate(word)}
    pos = len(word) if head is None else head
    out = []
    for _ in range(10_000):
        sym = tape.get(pos, LAMBDA)
        rule = rules.get((state, sym))
        if rule is None:
            raise ValueError(f"no command for {(state, sym)}")
        out.append((dict(tape), pos, state, (state, sym) + rule))
        write, move, nxt = rule
        tape[pos] = write
        state = nxt
        if move == "S":
            out.append((dict(tape), pos, state, None))
            return out
        pos += MOVES[move]
    raise ValueError("no stop in 10000 steps")


def result(
    word: str, table: str, head: int | None = None, state: str = "q0", alphabet: str = "λ01"
):
    """(word on the tape without the empty cells at its ends, steps, head)."""
    confs = run(word, table, head, state, alphabet)
    tape, pos, _, _ = confs[-1]
    cells = [i for i, s in tape.items() if s != LAMBDA]
    text = "".join(tape.get(i, LAMBDA) for i in range(min(cells), max(cells) + 1)) if cells else ""
    return text, len(confs) - 1, pos


# --- drawing -------------------------------------------------------------------------


def _cells(tape: dict, lo: int, hi: int, x0: float, y: float, fill=None, coords=True) -> list[str]:
    out = []
    for i in range(lo, hi + 1):
        x = x0 + (i - lo) * CELL
        f = (fill or {}).get(i, "#fff")
        out.append(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{CELL}" height="{CELL}" fill="{f}" stroke="{INK}" stroke-width="1.4"/>'
        )
        s = tape.get(i, LAMBDA)
        out.append(_text(x + CELL / 2, y + 27, s, 19, MUTED if s == LAMBDA else INK, "middle", 600))
        if coords:
            out.append(_text(x + CELL / 2, y + CELL + 18, str(i), 13, MUTED, "middle"))
    return out


def _head(x: float, y: float, state: str) -> list[str]:
    """A head above the cell whose left edge is x; y — the top of the tape."""
    cx = x + CELL / 2
    return [
        f'<path d="M {cx - 9:.1f} {y - 16:.1f} L {cx + 9:.1f} {y - 16:.1f} L {cx:.1f} {y - 4:.1f} Z" fill="{ACCENT}"/>',
        _text(cx, y - 22, state, 15, ACCENT, "middle", 700),
    ]


def _span(tapes: list[dict], heads: list[int], pad: int = 1) -> tuple[int, int]:
    idx = [i for t in tapes for i, s in t.items() if s != LAMBDA] + heads
    return min(idx) - pad, max(idx) + pad


def tm_tape(
    word: str,
    head: int | None = None,
    state: str = "q0",
    first: int = 0,
    marks: tuple = (),
    note: str = "",
) -> str:
    """One tape fragment; ``marks`` — coordinates of cells drawn with a wash."""
    tape = {first + i: s for i, s in enumerate(word) if s != " "}
    pos = first + len(word) if head is None else head
    lo, hi = _span([tape], [pos])
    x0 = (W - (hi - lo + 1) * CELL) / 2
    height = 150 if note else 124
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Лента и головка">']
    out += _cells(tape, lo, hi, x0, 44, {m: WASH for m in marks})
    out += _head(x0 + (pos - lo) * CELL, 44, state)
    if note:
        out.append(_text(W / 2, height - 10, note, 14, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def _table(
    rules_src: str, alphabet: str, hot: tuple[str, str] | None, x: float, y: float
) -> list[str]:
    rows = [r.split(":") for r in rules_src.split(";")]
    cw, rh, sw = 62, 28, 40
    out = []
    for j, sym in enumerate(alphabet):
        out.append(_text(x + sw + j * cw + cw / 2, y + 18, sym, 14, MUTED, "middle", 600))
    for i, (state, cells) in enumerate(rows):
        ry = y + rh * (i + 1)
        out.append(_text(x + sw - 8, ry + 19, state.strip(), 14, MUTED, "end", 600))
        for j, cell in enumerate(cells.split()):
            cx = x + sw + j * cw
            is_hot = hot == (state.strip(), alphabet[j])
            out.append(
                f'<rect x="{cx:.1f}" y="{ry:.1f}" width="{cw}" height="{rh}" fill="{WASH if is_hot else "#fff"}" '
                f'stroke="{ACCENT if is_hot else FAINT}" stroke-width="{2 if is_hot else 1}"/>'
            )
            label = "—" if cell == "-" else f"{cell[0]}, {cell[1]}, {cell[2:]}"
            out.append(
                _text(
                    cx + cw / 2,
                    ry + 19,
                    label,
                    13,
                    INK if is_hot else MUTED,
                    "middle",
                    600 if is_hot else 400,
                )
            )
    return out


MOVE_WORDS = {"L": "влево", "R": "вправо", "S": "стоп"}


def trace_frames(
    word: str, table: str, head: int | None = None, state: str = "q0", alphabet: str = "λ01"
) -> list[tuple[str, str]]:
    confs = run(word, table, head, state, alphabet)
    lo, hi = _span([c[0] for c in confs], [c[1] for c in confs])
    n_rows = len(table.split(";"))
    t_h = 28 * (n_rows + 1)
    tape_w = (hi - lo + 1) * CELL
    x0 = (W - tape_w) / 2
    height = 124 + t_h + 26
    frames = []
    for k, (tape, pos, st, rule) in enumerate(confs):
        out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-hidden="true">']
        out += _cells(tape, lo, hi, x0, 44)
        if rule is not None:
            out += _head(x0 + (pos - lo) * CELL, 44, st)
        else:
            out += _head(x0 + (pos - lo) * CELL, 44, "стоп")
        tw = 40 + 62 * len(alphabet)
        out += _table(table, alphabet, rule[:2] if rule else None, (W - tw) / 2, 124)
        out.append(_text(W - 12, height - 8, f"такт {k} из {len(confs) - 1}", 13, MUTED, "end"))
        out.append("</svg>")
        if rule is None:
            text, steps, _ = result(word, table, head, state, alphabet)
            cap = f"Остановка: на ленте {text}, тактов {steps}, головка на {pos}."
        else:
            s, sym, w, m, nxt = rule
            cap = (
                f"Перед тактом {k + 1}: {s} читает {sym} в клетке {pos} → записать {w}, "
                f"{MOVE_WORDS[m]}, {nxt}."
            )
            if k == 0:
                cap = f"Начало: {s}, головка в клетке {pos}. " + cap
        frames.append(("".join(out), cap))
    return frames


def tm_trace(
    word: str, table: str, head: int | None = None, state: str = "q0", alphabet: str = "λ01"
) -> str:
    """Before every step: the tape, the head and the chosen cell of the table."""
    return _stepper(trace_frames(word, table, head, state, alphabet))


ROLE = {"P": "#fff", "T": WASH, "N": WASH, ".": "#fff"}


def tm_rows(rows: list, legend: str = "") -> str:
    """rows: (label, word, roles[, first]) — roles per cell: «.» plain, «T»
    washed, «N» new or changed (accent frame); ``first`` — coordinate of the
    first cell, so that a digit written left of the word stands left of it."""
    tapes, roles_at = [], []
    for row in rows:
        word, roles = row[1], row[2]
        first = row[3] if len(row) > 3 else 0
        tapes.append({first + i: s for i, s in enumerate(word) if s != " "})
        roles_at.append({first + i: r for i, r in enumerate(roles)})
    lo = min(min(t) for t in tapes)
    hi = max(max(t) for t in tapes)
    lw = 80
    x0 = (W - lw - (hi - lo + 1) * CELL) / 2 + lw
    rh = 60
    height = 20 + rh * len(rows) + (30 if legend else 0)
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Ленты до и после">']
    for r, (row, tape) in enumerate(zip(rows, tapes, strict=True)):
        y = 16 + r * rh
        out.append(_text(x0 - 14, y + 27, row[0], 14, MUTED, "end", 600))
        for i in range(lo, hi + 1):
            if i not in tape:
                continue
            role = roles_at[r].get(i, ".")
            x = x0 + (i - lo) * CELL
            out.append(
                f'<rect x="{x:.1f}" y="{y:.1f}" width="{CELL}" height="{CELL}" fill="{ROLE.get(role, "#fff")}" '
                f'stroke="{ACCENT if role == "N" else INK}" stroke-width="{2.4 if role == "N" else 1.4}"/>'
            )
            s = tape[i]
            out.append(
                _text(x + CELL / 2, y + 27, s, 19, MUTED if s == LAMBDA else INK, "middle", 600)
            )
    if legend:
        out.append(_text(W / 2, height - 10, legend, 14, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def tm_bits(word: str, left: str = "", right: str = "") -> str:
    """Weights of the digits; a digit written left or right gets the accent frame."""
    full = left + word + right
    n = len(full)
    x0 = (W - n * CELL) / 2
    out = [f'<svg viewBox="0 0 {W} 150" role="img" aria-label="Разряды двоичного слова">']
    for i, s in enumerate(full):
        x = x0 + i * CELL
        new = (left and i < len(left)) or (right and i >= len(left) + len(word))
        out.append(
            f'<rect x="{x:.1f}" y="20" width="{CELL}" height="{CELL}" fill="#fff" '
            f'stroke="{ACCENT if new else INK}" stroke-width="{2.4 if new else 1.4}"/>'
        )
        out.append(_text(x + CELL / 2, 47, s, 19, INK, "middle", 600))
        out.append(
            _text(x + CELL / 2, 80, str(2 ** (n - 1 - i)), 13, ACCENT if new else MUTED, "middle")
        )
    old, new_v = int(word, 2), int(full, 2)
    if left:
        how = f"слева: {old} + {int(left, 2) * 2 ** len(word)} = {new_v}"
    elif right:
        how = f"справа: {old} · {2 ** len(right)} + {int(right, 2)} = {new_v}"
    else:
        how = f"{word}₂ = {old}"
    out.append(_text(W / 2, 118, f"вес разряда под клеткой · {how}", 14, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


def tm_map(src: str, mapping: str) -> str:
    """mapping «0>2 1>0 2>1»: the tape before and after one pass and the counts."""
    pairs = dict(p.split(">") for p in mapping.split())
    dst = "".join(pairs[c] for c in src)
    n = len(src)
    x0 = (W - n * CELL) / 2
    height = 200
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Проход с заменой символов">']
    for row, (word, y) in enumerate(((src, 18), (dst, 108))):
        for i, s in enumerate(word):
            x = x0 + i * CELL
            out.append(
                f'<rect x="{x:.1f}" y="{y}" width="{CELL}" height="{CELL}" fill="#fff" stroke="{INK}" stroke-width="1.4"/>'
            )
            out.append(_text(x + CELL / 2, y + 27, s, 19, INK, "middle", 600))
        out.append(_text(x0 - 12, y + 27, "до" if row == 0 else "после", 14, MUTED, "end", 600))
    for i in range(n):
        x = x0 + i * CELL + CELL / 2
        out.append(
            f'<line x1="{x:.1f}" y1="62" x2="{x:.1f}" y2="100" stroke="{MUTED}" stroke-width="1.2"/>'
        )
        out.append(f'<path d="M {x - 4:.1f} 94 L {x + 4:.1f} 94 L {x:.1f} 102 Z" fill="{MUTED}"/>')
    counts = " · ".join(f"{a} → {b}: {src.count(a)}" for a, b in pairs.items() if src.count(a))
    out.append(_text(W / 2, height - 12, counts, 14, INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


TURING_FIGURES: dict = {
    "tm_tape": tm_tape,
    "tm_trace": tm_trace,
    "tm_rows": tm_rows,
    "tm_bits": tm_bits,
    "tm_map": tm_map,
}
TURING_STEPPERS: dict = {"tm_trace": trace_frames}
TURING_WIDGETS: dict = {}
TURING_SCRIPTS: dict = {}
