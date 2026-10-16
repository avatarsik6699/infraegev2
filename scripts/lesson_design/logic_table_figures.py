"""Figures of topic 2 «Таблицы истинности» (registered in figures.FIGURES).

A formula is written as in the lesson: ``¬``, ``∧``, ``∨``, ``→``, ``≡``, ``⊕``,
one-letter variables and parentheses. Priority, as the lesson states: negation,
AND, OR, implication, equivalence; a chain of arrows needs parentheses. Every
value on a figure is computed here by evaluating the same formula.

``lt_ops(ops)`` — the four pairs of A, B and the value of each operation; the
only false pair of an implication in accent.
``lt_tree(formula, values)`` — the tree of a formula with the value of every
part for one set of inputs, the outer operation at the top.
``lt_cases(formula, var, value)`` — the sets where the formula has the given
value, split by the value of one variable.
``lt_rows(formula, order, rows)`` — rows of a fragment (``*`` is a gap) and the
full sets each row may become under one order of columns; a conflict of two
rows with one and the same only set in accent.
``lt_chain(names, rows)`` — the five sets allowed by a chain of implications
and the order of columns forced by the 0 and 1 of the fragment rows.
"""

from __future__ import annotations

from itertools import product

from figures import ACCENT, FAINT, INK, MUTED, WASH, _text

W = 660
OPS = {"¬": 5, "∧": 4, "∨": 3, "→": 2, "≡": 1, "⊕": 1}


# --- formulas ------------------------------------------------------------------------


def tokens(s: str) -> list[str]:
    return [c for c in s if not c.isspace()]


def parse(s: str):
    """A formula as a tree: a letter, ("¬", t) or (op, left, right)."""
    toks = tokens(s)
    pos = 0

    def peek():
        return toks[pos] if pos < len(toks) else None

    def take():
        nonlocal pos
        pos += 1
        return toks[pos - 1]

    def unary():
        t = peek()
        if t == "¬":
            take()
            return ("¬", unary())
        if t == "(":
            take()
            e = binary(1)
            assert take() == ")"
            return e
        assert t is not None and t.isalpha(), s
        return take()

    def binary(level):
        left = unary()
        while (t := peek()) in OPS and OPS[t] >= level and t != "¬":
            take()
            # implication groups to the right, the rest to the left
            right = binary(OPS[t] if t == "→" else OPS[t] + 1)
            left = (t, left, right)
        return left

    tree = binary(1)
    assert pos == len(toks), s
    return tree


def value(tree, env: dict[str, int]) -> int:
    if isinstance(tree, str):
        return env[tree]
    if tree[0] == "¬":
        return 1 - value(tree[1], env)
    a, b = value(tree[1], env), value(tree[2], env)
    return {
        "∧": a & b,
        "∨": a | b,
        "→": int(not a or b),
        "≡": int(a == b),
        "⊕": a ^ b,
    }[tree[0]]


def variables(tree) -> list[str]:
    if isinstance(tree, str):
        return [tree]
    out: list[str] = []
    for part in tree[1:]:
        out += [v for v in variables(part) if v not in out]
    return sorted(set(out))


def text_of(tree, outer: int = 0) -> str:
    """The formula back as text, with the brackets it needs."""
    if isinstance(tree, str):
        return tree
    if tree[0] == "¬":
        inner = text_of(tree[1], 5)
        return "¬" + inner
    op = tree[0]
    s = f"{text_of(tree[1], OPS[op])} {op} {text_of(tree[2], OPS[op] + 1)}"
    return f"({s})" if OPS[op] < outer or (op == "→" and outer == OPS[op]) else s


def sets(formula: str, wanted: int, names: str | None = None) -> list[str]:
    tree = parse(formula)
    names = names or "".join(variables(tree))
    return [
        "".join(map(str, bits))
        for bits in product((0, 1), repeat=len(names))
        if value(tree, dict(zip(names, bits, strict=True))) == wanted
    ]


# --- the four pairs ------------------------------------------------------------------------


def lt_ops(ops) -> str:
    """Columns A, B and one column per operation, false pairs of → in accent."""
    pairs = [(0, 0), (0, 1), (1, 0), (1, 1)]
    cols = ["A", "B", *ops]
    cw = min(96, (W - 40) / len(cols))
    x0 = (W - cw * len(cols)) / 2
    height = 44 + 40 * 4 + 16
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Значения операций">']
    for j, c in enumerate(cols):
        out.append(_text(x0 + cw * (j + 0.5), 28, c, 15, INK if j > 1 else MUTED, "middle", 600))
    out.append(
        f'<line x1="{x0 + cw * 2:.1f}" y1="10" x2="{x0 + cw * 2:.1f}" y2="{height - 8}" '
        f'stroke="{FAINT}" stroke-width="1"/>'
    )
    for i, (a, b) in enumerate(pairs):
        y = 44 + 40 * i
        out.append(
            f'<rect x="{x0:.1f}" y="{y:.1f}" width="{cw * len(cols):.1f}" height="36" rx="4" '
            f'fill="{WASH if i % 2 else "#fff"}"/>'
        )
        out.append(_text(x0 + cw * 0.5, y + 24, str(a), 15, MUTED, "middle"))
        out.append(_text(x0 + cw * 1.5, y + 24, str(b), 15, MUTED, "middle"))
        for j, op in enumerate(ops):
            v = value(parse(op), {"A": a, "B": b})
            hot = "→" in op and v == 0
            out.append(
                _text(
                    x0 + cw * (j + 2.5),
                    y + 24,
                    str(v),
                    16,
                    ACCENT if hot else INK,
                    "middle",
                    700 if hot else 500,
                )
            )
    out.append("</svg>")
    return "".join(out)


# --- the tree of a formula -------------------------------------------------------------------


def _layout(tree, depth, leaves, pos, key=()):
    if isinstance(tree, str) or tree[0] == "¬" and isinstance(tree[1], str):
        x = len(leaves)
        leaves.append(key)
        pos[key] = (x, depth)
        return x
    kids = [tree[1]] if tree[0] == "¬" else [tree[1], tree[2]]
    xs = [_layout(k, depth + 1, leaves, pos, (*key, i)) for i, k in enumerate(kids)]
    x = sum(xs) / len(xs)
    pos[key] = (x, depth)
    return x


def _node(tree, key):
    for i in key:
        tree = tree[1] if tree[0] == "¬" else tree[1 + i]
    return tree


def lt_tree(formula: str, values: dict) -> str:
    """The parts of a formula from the inputs up to the outer operation."""
    tree = parse(formula)
    pos: dict = {}
    leaves: list = []
    _layout(tree, 0, leaves, pos)
    depth = max(d for _, d in pos.values())
    gap = (W - 80) / max(len(leaves), 1)
    dy = 66
    height = 40 + dy * depth + 70

    def xy(k):
        x, d = pos[k]
        return 40 + gap * (x + 0.5), height - 50 - dy * (depth - d)

    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Дерево формулы {formula}">']
    for k in pos:
        if k:
            (x1, y1), (x2, y2) = xy(k), xy(k[:-1])
            out.append(
                f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
                f'stroke="{FAINT}" stroke-width="1.6"/>'
            )
    for k in pos:
        node = _node(tree, k)
        x, y = xy(k)
        v = value(node, values)
        label = (
            text_of(node)
            if isinstance(node, str) or node[0] == "¬" and isinstance(node[1], str)
            else node[0]
        )
        top = not k
        w = max(34, len(label) * 11 + 18)
        out.append(
            f'<rect x="{x - w / 2:.1f}" y="{y - 17:.1f}" width="{w:.1f}" height="34" rx="8" '
            f'fill="#fff" stroke="{ACCENT if top else INK}" stroke-width="{2 if top else 1.3}"/>'
        )
        out.append(_text(x, y + 5, label, 15, INK, "middle", 600))
        out.append(_text(x + w / 2 + 6, y + 5, f"= {v}", 14, ACCENT if top else MUTED, weight=600))
    given = ", ".join(f"{k} = {v}" for k, v in values.items())
    out.append(_text(W / 2, height - 12, given, 14, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


# --- cases by one variable --------------------------------------------------------------------


def lt_cases(formula: str, var: str, wanted: int = 1) -> str:
    """Sets with F = wanted, split by the value of var."""
    tree = parse(formula)
    names = "".join(variables(tree))
    found = sets(formula, wanted, names)
    height = 200
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Разбор по {var}">']
    out.append(_text(W / 2, 24, f"F = {text_of(tree)} = {wanted}", 15, INK, "middle", 600))
    for i, v in enumerate((0, 1)):
        x0 = 30 + i * W / 2
        part = [s for s in found if s[names.index(var)] == str(v)]
        out.append(
            f'<rect x="{x0:.1f}" y="44" width="{W / 2 - 60:.1f}" height="{height - 64}" rx="10" '
            f'fill="{WASH}" stroke="{FAINT}"/>'
        )
        out.append(_text(x0 + 16, 72, f"{var} = {v}", 15, INK, weight=600))
        free = [
            n
            for n in names
            if n != var and len({s[names.index(n)] for s in part}) == 2 and len(part) > 1
        ]
        fixed = [
            f"{n} = {next(iter({s[names.index(n)] for s in part}))}"
            for n in names
            if n != var and part and len({s[names.index(n)] for s in part}) == 1
        ]
        note = ", ".join(fixed + [f"{n} любое" for n in free]) or "наборов нет"
        out.append(_text(x0 + 16, 100, note, 14, MUTED))
        out.append(_text(x0 + 16, 140, "наборы " + names + ":", 14, MUTED))
        out.append(_text(x0 + 16, 166, ", ".join(part) or "—", 17, ACCENT, weight=600))
    out.append("</svg>")
    return "".join(out)


# --- rows of a fragment and full sets ------------------------------------------------------------


def candidates(formula: str, order: str, row: str, wanted: int) -> list[str]:
    """Full sets (in the column order) that keep the known digits of row."""
    tree = parse(formula)
    out = []
    for bits in product("01", repeat=len(order)):
        if all(c in "*" or c == b for c, b in zip(row, bits, strict=True)):
            if value(tree, {n: int(b) for n, b in zip(order, bits, strict=True)}) == wanted:
                out.append("".join(bits))
    return out


def lt_rows(formula: str, order: str, rows, wanted: int = 1, note: str = "") -> str:
    """Each row of the fragment linked to the full sets it may become."""
    rows = [(r, wanted) if isinstance(r, str) else (r[0], int(r[1])) for r in rows]
    cands = [candidates(formula, order, r, w) for r, w in rows]
    allsets = sorted({s for c in cands for s in c})
    only = [c[0] if len(c) == 1 else None for c in cands]
    clash = {s for s in only if s is not None and only.count(s) > 1}
    rh = 46
    height = 70 + rh * max(len(rows), len(allsets)) + 40
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Порядок {order}">']
    out.append(_text(110, 26, f"строки, столбцы {' '.join(order)}", 14, MUTED, "middle"))
    out.append(_text(W - 130, 26, "подходящие наборы", 14, MUTED, "middle"))
    ry = {i: 60 + rh * i for i in range(len(rows))}
    sy = {s: 60 + rh * j for j, s in enumerate(allsets)}
    for i in range(len(rows)):
        for s in cands[i]:
            hot = s in clash and only[i] == s
            out.append(
                f'<line x1="190" y1="{ry[i] + 17:.1f}" x2="{W - 200}" y2="{sy[s] + 17:.1f}" '
                f'stroke="{ACCENT if hot else MUTED}" stroke-width="{2.2 if hot else 1.2}"/>'
            )
    for i, (r, w) in enumerate(rows):
        y = ry[i]
        out.append(
            f'<rect x="40" y="{y}" width="150" height="34" rx="6" fill="#fff" '
            f'stroke="{INK}" stroke-width="1.3"/>'
        )
        out.append(_text(115, y + 23, " ".join(r) + f"  F={w}", 15, INK, "middle", 600))
        if not cands[i]:
            out.append(_text(200, y + 23, "нет набора", 13, ACCENT))
    for s, y in sy.items():
        hot = s in clash
        out.append(
            f'<rect x="{W - 200}" y="{y}" width="140" height="34" rx="6" fill="{WASH}" '
            f'stroke="{ACCENT if hot else FAINT}" stroke-width="{2 if hot else 1}"/>'
        )
        out.append(_text(W - 130, y + 23, " ".join(s), 15, ACCENT if hot else INK, "middle", 600))
    verdict = (
        "двум строкам достаётся один и тот же набор — порядок не подходит"
        if clash
        else (note or "каждой строке можно выбрать свой набор")
    )
    out.append(_text(W / 2, height - 16, verdict, 14, ACCENT if clash else INK, "middle", 600))
    out.append("</svg>")
    return "".join(out)


# --- a chain of implications ----------------------------------------------------------------------


def chain_sets(names: str) -> list[str]:
    n = len(names)
    return ["0" * (n - k) + "1" * k for k in range(n + 1)]


def chain_order(rows) -> list[int]:
    """Columns ordered by the rule «a 0 stands before a 1 in every row»."""
    n = len(rows[0])
    before = {
        (a, b) for r in rows for a in range(n) for b in range(n) if r[a] == "0" and r[b] == "1"
    }
    order: list[int] = []
    left = set(range(n))
    while left:
        first = [c for c in left if not any((d, c) in before for d in left)]
        assert len(first) == 1, (rows, order)
        order.append(first[0])
        left.remove(first[0])
    return order


def lt_chain(names: str, rows) -> str:
    """Allowed sets of a chain of arrows and the forced order of columns."""
    allowed = chain_sets(names)
    n = len(names)
    cell = 30
    height = 60 + cell * len(allowed) + 20
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Цепочка импликаций">']
    x0 = 40
    for j, name in enumerate(names):
        out.append(_text(x0 + cell * (j + 0.5), 34, name, 15, MUTED, "middle", 600))
    for i, s in enumerate(allowed):
        y = 46 + cell * i
        for j, ch in enumerate(s):
            one = ch == "1"
            out.append(
                f'<rect x="{x0 + cell * j}" y="{y}" width="{cell}" height="{cell}" '
                f'fill="{WASH if one else "#fff"}" stroke="{FAINT}"/>'
            )
            out.append(
                _text(
                    x0 + cell * (j + 0.5), y + 20, ch, 15, ACCENT if one else MUTED, "middle", 600
                )
            )
    out.append(_text(x0, height - 8, "после первой 1 — только 1", 13, MUTED))
    order = chain_order(rows)
    bx = x0 + cell * n + 70
    out.append(_text(bx, 34, "порядок столбцов вдоль цепочки", 14, MUTED))
    step = (W - bx - 30) / n
    for k, c in enumerate(order):
        x = bx + step * k
        out.append(
            f'<rect x="{x:.1f}" y="62" width="{step - 18:.1f}" height="36" rx="8" fill="#fff" '
            f'stroke="{INK}" stroke-width="1.4"/>'
        )
        out.append(_text(x + (step - 18) / 2, 86, f"C{c + 1}", 15, INK, "middle", 600))
        out.append(_text(x + (step - 18) / 2, 122, f"= {names[k]}", 15, ACCENT, "middle", 600))
        if k:
            out.append(_text(x - 9, 86, "→", 15, MUTED, "middle"))
    for i, r in enumerate(rows):
        pairs = sorted({(a, b) for a in range(n) for b in range(n) if r[a] == "0" and r[b] == "1"})
        txt = ", ".join(f"C{a + 1} раньше C{b + 1}" for a, b in pairs)
        out.append(_text(bx, 154 + 22 * i, f"строка {i + 1}: {txt}", 13, MUTED))
    out.append("</svg>")
    return "".join(out)


LOGIC_TABLE_FIGURES: dict = {
    "lt_ops": lt_ops,
    "lt_tree": lt_tree,
    "lt_cases": lt_cases,
    "lt_rows": lt_rows,
    "lt_chain": lt_chain,
}
LOGIC_TABLE_STEPPERS: dict = {}
LOGIC_TABLE_WIDGETS: dict = {}
LOGIC_TABLE_SCRIPTS: dict = {}
