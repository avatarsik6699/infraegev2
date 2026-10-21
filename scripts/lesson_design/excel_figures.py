"""Figures and sandboxes of the Excel course stand (registered in figures.FIGURES).

``fill_try(formula, origin, target)`` — the copy sandbox: a formula standing in
``origin`` is copied to ``target``; the new formula is computed with
``sheet_eval.shift`` (the rule of the lesson about ``$``) and every part of an
address that moved is marked. The reader retypes the formula and the target.
Without JavaScript the initial example stays computed.
"""

from __future__ import annotations

import datetime
import functools
import html

from sheet_eval import (
    CELL,
    Book,
    Sheet,
    col_letters,
    criterion,
    display,
    parse_address,
    parse_ref,
    shift,
    tokenize,
    typed,
)


def _parts(ref_text: str) -> list[tuple[str, str, str, str]]:
    """``$A2:B$5`` → [("$", "A", "", "2"), ("", "B", "$", "5")]."""
    body = ref_text.rsplit("!", 1)[-1]
    out = []
    for end in body.split(":"):
        m = CELL.fullmatch(end)
        assert m
        out.append((m.group(1), m.group(2), m.group(3), m.group(4)))
    return out


def marked(before: str, after: str) -> str:
    """``after`` as HTML with the moved column/row parts of every address marked."""
    try:
        old = [t for t in tokenize(before) if t.kind == "ref"]
        new = [t for t in tokenize(after) if t.kind == "ref"]
    except ValueError:
        return html.escape(after)
    if len(old) != len(new):
        return html.escape(after)
    out, pos = [], 0
    for o, n in zip(old, new, strict=True):
        out.append(html.escape(after[pos : n.start]))
        sheet = n.text.rsplit("!", 1)[0] + "!" if "!" in n.text else ""
        ends = []
        for (_, oc, _, orow), (dc, nc, dr, nrow) in zip(
            _parts(o.text), _parts(n.text), strict=True
        ):
            col = f'<mark class="ft-m">{nc}</mark>' if nc != oc else nc
            row = f'<mark class="ft-m">{nrow}</mark>' if nrow != orow else nrow
            ends.append(f"{dc}{col}{dr}{row}")
        out.append(html.escape(sheet) + ":".join(ends))
        pos = n.start + len(n.text)
    out.append(html.escape(after[pos:]))
    return "".join(out)


def explain(origin: str, target: str) -> str:
    r1, c1 = parse_address(origin)
    r2, c2 = parse_address(target)
    dr, dc = r2 - r1, c2 - c1

    def words(n: int, one: str, few: str, many: str) -> str:
        k = abs(n)
        form = (
            one
            if k % 10 == 1 and k % 100 != 11
            else few
            if 2 <= k % 10 <= 4 and not 12 <= k % 100 <= 14
            else many
        )
        return f"{k} {form}"

    parts = []
    if dr:
        parts.append(f"на {words(dr, 'строку', 'строки', 'строк')} {'вниз' if dr > 0 else 'вверх'}")
    if dc:
        parts.append(
            f"на {words(dc, 'столбец', 'столбца', 'столбцов')} {'вправо' if dc > 0 else 'влево'}"
        )
    return "Копия сдвинута " + " и ".join(parts) + "." if parts else "Копия на том же месте."


def fill_try(formula: str = "=$A2*B$1", origin: str = "B2", target: str = "D4") -> str:
    after = shift(formula, *_delta(origin, target))
    return (
        '<div class="mask-try fill-try" data-fill-try>'
        '<div class="ft-row">'
        f'<label>Формула в <b class="ft-o">{origin}</b> <input class="ft-f" value="{html.escape(formula)}" '
        'spellcheck="false" autocomplete="off"></label>'
        f'<label>Копируем в <input class="ft-t" value="{target}" maxlength="6" '
        'spellcheck="false" autocomplete="off"></label></div>'
        f'<p class="ft-out"><span class="ft-l">В {target} окажется</span> '
        f'<code class="ft-r">{marked(formula, after)}</code></p>'
        f'<p class="mt-msg" aria-live="polite">{explain(origin, target)}</p>'
        '<p class="mt-note">Изменившиеся части адресов выделены. Поставь или убери $ '
        "и посмотри, какие части перестают сдвигаться.</p></div>"
    )


def _delta(origin: str, target: str) -> tuple[int, int]:
    r1, c1 = parse_address(origin)
    r2, c2 = parse_address(target)
    return r2 - r1, c2 - c1


FILL_TRY_JS = r"""<script>
(function () {
  // the shift rule of sheet_eval.shift: parts without $ move, parts with $ stay
  var REF = /((?:'(?:[^']|'')+'|[A-Za-zА-Яа-яЁё_][\wА-Яа-яЁё.]*)!)?(\$?)([A-Z]{1,3})(\$?)(\d+)(?::(\$?)([A-Z]{1,3})(\$?)(\d+))?(?![\wА-Яа-яЁё(])/g;
  function colNumber(s) { var n = 0; for (var i = 0; i < s.length; i++) n = n * 26 + s.charCodeAt(i) - 64; return n; }
  function colLetters(n) { var s = ""; while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); } return s; }
  function addr(t) { var m = /^([A-Z]{1,3})([1-9]\d*)$/.exec(t.trim().toUpperCase()); return m ? [Number(m[2]), colNumber(m[1])] : null; }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function words(n, one, few, many) { var k = Math.abs(n), a = k % 10, b = k % 100; return k + " " + (a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && !(b >= 12 && b <= 14) ? few : many); }
  function shiftMarked(f, dr, dc) {
    var out = "", bad = false, m;
    // skip text in quotes: split the formula into quoted and plain pieces
    var pieces = f.split(/("(?:[^"]|"")*")/);
    pieces.forEach(function (piece, k) {
      if (k % 2) { out += esc(piece); return; }
      var last = 0; REF.lastIndex = 0;
      while ((m = REF.exec(piece))) {
        if (m.index > 0 && /[A-Za-zА-Яа-яЁё0-9_$]/.test(piece[m.index - 1]) && !m[1]) continue;
        out += esc(piece.slice(last, m.index));
        var ends = [[m[2], m[3], m[4], m[5]]];
        if (m[7]) ends.push([m[6], m[7], m[8], m[9]]);
        var txt = ends.map(function (e) {
          var col = colNumber(e[1]) + (e[0] ? 0 : dc), row = Number(e[3]) + (e[2] ? 0 : dr);
          if (col < 1 || row < 1) bad = true;
          var C = colLetters(Math.max(col, 1)), R = String(row);
          return e[0] + (C !== e[1] ? '<mark class="ft-m">' + C + "</mark>" : C) + e[2] + (R !== e[3] ? '<mark class="ft-m">' + R + "</mark>" : R);
        }).join(":");
        out += (m[1] ? esc(m[1]) : "") + (bad ? "#ССЫЛКА!" : txt);
        last = m.index + m[0].length; bad = false;
      }
      out += esc(piece.slice(last));
    });
    return out;
  }
  document.querySelectorAll("[data-fill-try]").forEach(function (box) {
    var f = box.querySelector(".ft-f"), t = box.querySelector(".ft-t"), r = box.querySelector(".ft-r");
    var l = box.querySelector(".ft-l"), msg = box.querySelector(".mt-msg");
    var origin = addr(box.querySelector(".ft-o").textContent);
    function run() {
      var to = addr(t.value);
      if (!to) { msg.textContent = "Адрес ячейки: буквы столбца и номер строки, например D4."; return; }
      var text = f.value.trim();
      if (text.charAt(0) !== "=") { msg.textContent = "Формула начинается со знака =."; return; }
      var dr = to[0] - origin[0], dc = to[1] - origin[1];
      l.textContent = "В " + t.value.trim().toUpperCase() + " окажется";
      r.innerHTML = shiftMarked(text, dr, dc);
      var parts = [];
      if (dr) parts.push("на " + words(dr, "строку", "строки", "строк") + (dr > 0 ? " вниз" : " вверх"));
      if (dc) parts.push("на " + words(dc, "столбец", "столбца", "столбцов") + (dc > 0 ? " вправо" : " влево"));
      msg.textContent = (parts.length ? "Копия сдвинута " + parts.join(" и ") + "." : "Копия на том же месте.") +
        (r.textContent.indexOf("#ССЫЛКА!") >= 0 ? " Адрес ушёл за край листа — Excel пишет #ССЫЛКА!." : "");
    }
    f.addEventListener("input", run); t.addEventListener("input", run);
    run();
  });
})();
</script>"""

# --- static figures -------------------------------------------------------------

INK, MUTED, FAINT, WASH, ACCENT = "#17191e", "#4d535e", "#d9d9d4", "#f3f3f1", "#ff6a00"
SANS = "Onest, system-ui, sans-serif"
MONO = "JetBrains Mono, ui-monospace, monospace"


def _t(x, y, s, size=14.0, color=INK, anchor="start", weight=400, mono=False) -> str:
    family = MONO if mono else SANS
    extra = (
        ' style="font-variant-ligatures:none"'
        if mono
        else ' style="font-variant-numeric:tabular-nums"'
    )
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" font-size="{size}" '
        f'font-weight="{weight}" fill="{color}" text-anchor="{anchor}"{extra}>{html.escape(s)}</text>'
    )


def _svg(h: float, label: str, w: float = 660) -> str:
    return f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{html.escape(label)}">'


def range_grid(ref: str = "A2:D6", cols: int = 6, rows: int = 8) -> str:
    """A sheet grid with one range framed: its rows, columns and cell count."""
    r = parse_ref(ref)
    cw, ch, L, T = 64, 30, 46, 30
    n_rows, n_cols = r.r2 - r.r1 + 1, r.c2 - r.c1 + 1
    h = T + rows * ch + 34
    out = [_svg(h, f"Диапазон {ref}: {n_rows} строк, {n_cols} столбца, {n_rows * n_cols} ячеек")]
    for c in range(1, cols + 1):
        x = L + (c - 1) * cw
        out.append(
            f'<rect x="{x}" y="{T - 24}" width="{cw}" height="24" fill="{WASH}" stroke="{FAINT}"/>'
        )
        out.append(_t(x + cw / 2, T - 7, col_letters(c), 13, MUTED, "middle", 500))
    for row in range(1, rows + 1):
        y = T + (row - 1) * ch
        out.append(
            f'<rect x="{L - 34}" y="{y}" width="34" height="{ch}" fill="{WASH}" stroke="{FAINT}"/>'
        )
        out.append(_t(L - 17, y + 20, str(row), 13, MUTED, "middle", 500))
        for c in range(1, cols + 1):
            x = L + (c - 1) * cw
            inside = r.r1 <= row <= r.r2 and r.c1 <= c <= r.c2
            fill = WASH if inside else "#fff"
            out.append(
                f'<rect x="{x}" y="{y}" width="{cw}" height="{ch}" fill="{fill}" stroke="{FAINT}"/>'
            )
    x1, y1 = L + (r.c1 - 1) * cw, T + (r.r1 - 1) * ch
    x2, y2 = L + r.c2 * cw, T + r.r2 * ch
    out.append(
        f'<rect x="{x1}" y="{y1}" width="{x2 - x1}" height="{y2 - y1}" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>'
    )
    first = f"{col_letters(r.c1)}{r.r1}"
    last = f"{col_letters(r.c2)}{r.r2}"
    out.append(_t(x1 + 8, y1 + 20, first, 14, INK, "start", 600, mono=True))
    out.append(_t(x2 - 8, y2 - 10, last, 14, INK, "end", 600, mono=True))
    gx = L + cols * cw + 18
    out.append(_t(gx, y1 + 22, f"строки {r.r1}…{r.r2}:", 14, INK))
    out.append(_t(gx, y1 + 44, f"{r.r2} − {r.r1} + 1 = {n_rows}", 14, INK))
    out.append(
        _t(gx, y1 + 76, f"столбцы {col_letters(r.c1)}…{col_letters(r.c2)}: {n_cols}", 14, INK)
    )
    out.append(
        _t(gx, y1 + 108, f"ячеек: {n_rows} × {n_cols} = {n_rows * n_cols}", 14, INK, weight=600)
    )
    out.append("</svg>")
    return "".join(out)


def ref_moves(ref: str = "A2", down: int = 3, right: int = 2) -> str:
    """The four kinds of a reference copied ``down`` rows and ``right`` columns:
    the part without $ moves, the part with $ stays."""
    kinds = [
        ("A2", "ничего не закреплено"),
        ("$A$2", "закреплены столбец и строка"),
        ("$A2", "закреплён столбец"),
        ("A$2", "закреплена строка"),
    ]
    row_h, T = 58, 40
    out = [
        _svg(
            T + row_h * 4 + 10,
            f"Как меняются четыре вида ссылки при копировании на {down} строки вниз и {right} столбца вправо",
        )
    ]
    out.append(_t(24, 24, "в исходной формуле", 13, MUTED))
    out.append(_t(310, 24, f"в копии: на {down} строки вниз и {right} столбца вправо", 13, MUTED))
    for i, (text, note) in enumerate(kinds):
        y = T + i * row_h
        after = shift("=" + text, down, right)[1:]
        out.append(
            f'<rect x="24" y="{y}" width="110" height="38" rx="8" fill="#fff" stroke="{INK}" stroke-width="1.25"/>'
        )
        out.append(_t(79, y + 25, text, 17, INK, "middle", 600, mono=True))
        out.append(
            f'<path d="M 146 {y + 19} H 296" stroke="{MUTED}" stroke-width="1.5" fill="none"/>'
        )
        out.append(f'<path d="M 296 {y + 19} l -8 -5 v 10 z" fill="{MUTED}"/>')
        moved = after != text
        stroke = ACCENT if moved else INK
        out.append(
            f'<rect x="310" y="{y}" width="110" height="38" rx="8" fill="#fff" stroke="{stroke}" stroke-width="{2 if moved else 1.25}"/>'
        )
        out.append(_t(365, y + 25, after, 17, INK, "middle", 600, mono=True))
        out.append(_t(438, y + 18, note, 13.5, INK))
        what = (
            "не меняется"
            if not moved
            else (
                "меняется всё"
                if "$" not in text
                else ("меняется строка" if text.startswith("$") else "меняется столбец")
            )
        )
        out.append(_t(438, y + 36, what, 13, MUTED))
    out.append("</svg>")
    return "".join(out)


def period_line(
    start: str = "01.10.2026", end: str = "16.10.2026", point: str = "15.10.2026 12:30"
) -> str:
    """A period «not before start and strictly before end»: the day boundary and
    a moment inside the last day that a «<= 15.10» check would lose."""
    d0 = datetime.datetime.strptime(start, "%d.%m.%Y")
    d1 = datetime.datetime.strptime(end, "%d.%m.%Y")
    pt = datetime.datetime.strptime(point, "%d.%m.%Y %H:%M")
    last = d1 - datetime.timedelta(days=1)
    lo, hi = d0 - datetime.timedelta(days=1), d1 + datetime.timedelta(days=1)
    L, R, base = 40, 560, 78

    def px(t: datetime.datetime) -> float:
        return L + (t - lo).total_seconds() / (hi - lo).total_seconds() * (R - L)

    out = [_svg(140, f"Период с {start} включительно до {end} не включая")]
    out.append(
        f'<line x1="{L}" y1="{base}" x2="{R}" y2="{base}" stroke="{INK}" stroke-width="1.5"/>'
    )
    day = lo
    while day <= hi:
        x = px(day)
        out.append(
            f'<line x1="{x:.1f}" y1="{base - 4}" x2="{x:.1f}" y2="{base + 4}" stroke="{MUTED}"/>'
        )
        day += datetime.timedelta(days=1)
    out.append(
        f'<line x1="{px(d0):.1f}" y1="{base}" x2="{px(d1):.1f}" y2="{base}" stroke="{ACCENT}" stroke-width="5"/>'
    )
    out.append(f'<circle cx="{px(d0):.1f}" cy="{base}" r="7" fill="{ACCENT}"/>')
    out.append(
        f'<circle cx="{px(d1):.1f}" cy="{base}" r="7" fill="#fff" stroke="{ACCENT}" stroke-width="2.5"/>'
    )
    out.append(_t(px(d0), base + 28, start, 13.5, INK, "middle", 500))
    out.append(_t(px(d0), base + 46, "входит", 13, MUTED, "middle"))
    out.append(_t(px(d1), base + 28, end, 13.5, INK, "middle", 500))
    out.append(_t(px(d1), base + 46, "не входит", 13, MUTED, "middle"))
    out.append(
        f'<line x1="{px(last):.1f}" y1="{base - 50}" x2="{px(last):.1f}" y2="{base + 4}" stroke="{MUTED}" stroke-dasharray="4 3"/>'
    )
    out.append(_t(px(last) - 6, base - 40, f"{last:%d.%m} 00:00", 13, MUTED, "end"))
    out.append(f'<path d="M {px(pt):.1f} {base - 12} l -6 -10 h 12 z" fill="{INK}"/>')
    out.append(_t(px(pt) + 10, base - 26, f"{pt:%d.%m %H:%M}", 13.5, INK, "start", 600))
    out.append("</svg>")
    return "".join(out)


# --- step-by-step figures (T19) -------------------------------------------------


def _box(
    x,
    y,
    w,
    h,
    text="",
    *,
    fill="#fff",
    stroke=FAINT,
    sw=1.0,
    color=INK,
    weight=400,
    size=14.0,
    mono=False,
    rx=0,
) -> str:
    out = (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
    )
    if text != "":
        out += _t(
            x + w / 2,
            y + h / 2 + size * 0.36,
            text,
            size,
            color,
            "middle",
            weight,
            mono,
        )
    return out


def _arrow_head(x, y, dx, dy, color=MUTED) -> str:
    """A small filled head at (x, y) pointing along (dx, dy)."""
    n = (dx * dx + dy * dy) ** 0.5 or 1.0
    ux, uy = dx / n, dy / n
    px, py = -uy, ux
    a = (x - 8 * ux + 4.5 * px, y - 8 * uy + 4.5 * py)
    b = (x - 8 * ux - 4.5 * px, y - 8 * uy - 4.5 * py)
    return f'<path d="M {x:.1f} {y:.1f} L {a[0]:.1f} {a[1]:.1f} L {b[0]:.1f} {b[1]:.1f} z" fill="{color}"/>'


def _context(cells: str) -> tuple[Book, Sheet]:
    """``"A2=12; B2=5; Товары!A2:A5=101|102|103|104"`` → a book and its sheet «Лист».
    A range takes its values row by row, separated by ``|``."""
    book = Book()
    for item in filter(None, (part.strip() for part in cells.split(";"))):
        target, value = item.split("=", 1)
        sheet = "Лист"
        if "!" in target:
            sheet, target = target.split("!", 1)
        ref = parse_ref(target.strip())
        spots = [(r, c) for r in range(ref.r1, ref.r2 + 1) for c in range(ref.c1, ref.c2 + 1)]
        values = value.split("|")
        if len(values) != len(spots):
            raise SystemExit(f"formula_steps: {item!r} needs {len(spots)} values")
        for spot, text in zip(spots, values, strict=True):
            book.sheet(sheet).inputs[spot] = text.strip()
    return book, book.sheet("Лист")


def check_steps(cells: str, steps: list[str]) -> list[str]:
    """Every step of a worked formula must show the same value as the first one:
    a step only substitutes a value for a part, it never changes the answer."""
    book, sheet = _context(cells)
    shown = [
        display(book.formula(step, sheet)) if step.startswith("=") else display(typed(step))
        for step in steps
    ]
    return [
        f"step {i + 1} {step!r} shows {got!r}, the formula shows {shown[0]!r}"
        for i, (step, got) in enumerate(zip(steps, shown, strict=True))
        if got != shown[0]
    ]


def _changed(before: str, after: str) -> tuple[int, int]:
    """The span of ``after`` that differs from ``before``, widened to whole words."""
    if not after.startswith("="):
        return 0, len(after)
    p, limit = 0, min(len(before), len(after))
    while p < limit and before[p] == after[p]:
        p += 1
    s = 0
    while s < limit - p and before[-1 - s] == after[-1 - s]:
        s += 1
    e = len(after) - s
    word = str.isalnum
    while 0 < p < len(after) and word(after[p - 1]) and word(after[p]):
        p -= 1
    while 0 < e < len(after) and word(after[e - 1]) and word(after[e]):
        e += 1
    return p, max(e, p)


def _mono_marked(x, y, text, span, size, color, mark) -> str:
    a, b = span
    parts = [(text[:a], color, 400), (text[a:b], mark, 700), (text[b:], color, 400)]
    spans = "".join(
        f'<tspan fill="{c}" font-weight="{w}">{html.escape(t)}</tspan>' for t, c, w in parts if t
    )
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{MONO}" font-size="{size}" '
        f'style="font-variant-ligatures:none;white-space:pre">{spans}</text>'
    )


def formula_frames(cells: str, steps: list[str], notes: list[str]) -> list[tuple[str, str]]:
    """How Excel computes a formula, one substitution per frame (like «Вычислить
    формулу» in Excel): references become values, then the innermost operation
    becomes its result. Each step is checked by ``sheet_eval``: it shows the same
    value as the formula itself."""
    if len(steps) != len(notes):
        raise SystemExit("formula_steps: one note per step")
    problems = check_steps(cells, steps)
    if problems:
        raise SystemExit("formula_steps: " + "; ".join(problems))
    lh, top = 40, 12
    h = top + len(steps) * lh + 4
    frames = []
    for k in range(len(steps)):
        out = [_svg(h, f"Вычисление формулы {steps[0]}, шаг {k + 1}")]
        for j, step in enumerate(steps[: k + 1]):
            y = top + j * lh
            if j == k:
                out.append(
                    f'<rect x="12" y="{y}" width="636" height="{lh - 8}" rx="8" fill="{WASH}"/>'
                )
                out.append(
                    f'<rect x="12" y="{y}" width="4" height="{lh - 8}" rx="2" fill="{ACCENT}"/>'
                )
            span = _changed(steps[j - 1], step) if j else (0, 0)
            color = INK if j == k else MUTED
            out.append(_mono_marked(30, y + 22, step, span, 17, color, ACCENT if j == k else color))
        out.append("</svg>")
        frames.append(("".join(out), notes[k]))
    return frames


def formula_steps(cells: str, steps: list[str], notes: list[str]) -> str:
    from figures import _stepper

    return _stepper(formula_frames(cells, steps, notes))


def ctrl_jump_frames() -> list[tuple[str, str]]:
    """Ctrl+↓ in a column with a gap: it stops at the edge of every block of data."""
    values = {
        1: "Сумма",
        2: "120",
        3: "80",
        4: "150",
        5: "40",
        8: "210",
        9: "90",
        10: "60",
        11: "130",
    }
    rows, cw, rh, L, T = 12, 120, 24, 64, 30
    h = T + rows * rh + 12
    stops = [
        (1, None, "Выделена A1 — заголовок столбца. Нажмём Ctrl+↓."),
        (
            5,
            None,
            "Ctrl+↓ остановился на A5 — последней заполненной ячейке перед пустотой, а не на конце данных.",
        ),
        (
            8,
            None,
            "Ещё раз Ctrl+↓: под A5 пусто, и переход идёт к следующей заполненной ячейке — A8.",
        ),
        (
            11,
            None,
            "Третий Ctrl+↓ — A11, настоящая последняя запись. Пустые A6 и A7 дважды остановили переход.",
        ),
        (
            1,
            5,
            "Ctrl+Shift+↓ из A1 выделяет тем же прыжком: только A1:A5. Поэтому большой диапазон надёжнее набрать адресом в поле имени.",
        ),
    ]
    frames, prev = [], None
    for at, upto, note in stops:
        out = [_svg(h, "Переход Ctrl+стрелка вниз по столбцу с пустыми ячейками", 520)]
        out.append(_box(L, T - 24, cw, 24, "A", fill=WASH, color=MUTED, size=13, weight=500))
        for r in range(1, rows + 1):
            y = T + (r - 1) * rh
            out.append(
                _box(
                    L - 34,
                    y,
                    34,
                    rh,
                    str(r),
                    fill=WASH,
                    color=MUTED,
                    size=13,
                    weight=500,
                )
            )
            inside = upto is not None and r <= upto
            out.append(_box(L, y, cw, rh, fill=WASH if inside else "#fff"))
            if r in values:
                right = values[r].isdigit()
                out.append(
                    _t(
                        L + cw - 10 if right else L + 10,
                        y + 17,
                        values[r],
                        14,
                        INK,
                        "end" if right else "start",
                        600 if r == 1 else 400,
                    )
                )
        if upto is not None:
            out.append(
                f'<rect x="{L}" y="{T}" width="{cw}" height="{upto * rh}" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>'
            )
        y = T + (at - 1) * rh
        out.append(
            f'<rect x="{L}" y="{y}" width="{cw}" height="{rh}" fill="none" stroke="{INK}" stroke-width="2.5"/>'
        )
        if prev is not None and upto is None:
            y0, y1 = T + (prev - 0.5) * rh, T + (at - 0.5) * rh
            x = L + cw + 14
            out.append(
                f'<path d="M {x - 8} {y0:.1f} C {x + 28} {y0:.1f}, {x + 28} {y1:.1f}, {x - 2} {y1:.1f}" '
                f'fill="none" stroke="{ACCENT}" stroke-width="2"/>'
            )
            out.append(_arrow_head(x - 4, y1, -1, 0, ACCENT))
            out.append(_t(x + 30, (y0 + y1) / 2 + 5, "Ctrl+↓", 15, INK, "start", 600))
        if upto is not None:
            out.append(
                _t(
                    L + cw + 22,
                    T + upto * rh / 2 + 5,
                    "Ctrl+Shift+↓: A1:A5",
                    15,
                    INK,
                    "start",
                    600,
                )
            )
        out.append("</svg>")
        frames.append(("".join(out), note))
        prev = at
    return frames


def ctrl_jump() -> str:
    from figures import _stepper

    return _stepper(ctrl_jump_frames())


def csv_split(line: str = "Тетрадь;40;12,5") -> str:
    """One line of a CSV file split by «;» and by «,»: the field separator decides
    the columns, and a decimal comma is lost when it is taken for a separator."""
    out = [_svg(196, f"Строка {line}, разделённая точкой с запятой и запятой")]
    for i, sep in enumerate((";", ",")):
        y = 18 + i * 90
        name = "точка с запятой" if sep == ";" else "запятая"
        out.append(_t(24, y + 4, f"разделитель — {name}", 13, MUTED))
        marked = [(ch, ACCENT if ch == sep else INK, 700 if ch == sep else 400) for ch in line]
        spans = "".join(
            f'<tspan fill="{c}" font-weight="{w}">{html.escape(ch)}</tspan>' for ch, c, w in marked
        )
        out.append(
            f'<text x="24" y="{y + 40}" font-family="{MONO}" font-size="18" '
            f'style="font-variant-ligatures:none;white-space:pre">{spans}</text>'
        )
        out.append(f'<path d="M 218 {y + 34} H 256" stroke="{MUTED}" stroke-width="1.5"/>')
        out.append(_arrow_head(262, y + 34, 1, 0))
        x = 278
        for k, field_text in enumerate(line.split(sep)):
            w = max(64, len(field_text) * 10 + 24)
            out.append(
                _box(
                    x,
                    y - 8,
                    w,
                    20,
                    col_letters(k + 1),
                    fill=WASH,
                    color=MUTED,
                    size=12,
                    weight=500,
                )
            )
            out.append(_box(x, y + 12, w, 36, field_text, size=15, mono=True))
            x += w
        count = len(line.split(sep))
        out.append(_t(x + 14, y + 36, f"{count} поля", 14, INK, weight=600))
    out.append("</svg>")
    return "".join(out)


def rank_line(values: list[float] | tuple = (3, 8, 8, 2), k: int = 2) -> str:
    """НАИБОЛЬШИЙ and НАИМЕНЬШИЙ as places in a sorted row: repeats keep their places."""
    vals = [float(v) for v in values]
    show = [display(v) for v in vals]
    cell, gap, L = 46, 6, 168
    out = [_svg(206, f"Числа {', '.join(show)} по убыванию и по возрастанию, место {k}")]
    out.append(_t(24, 34, "в строке", 14, MUTED))
    for i, s in enumerate(show):
        out.append(_box(L + i * (cell + gap), 12, cell, 34, s, size=16, rx=6, stroke=MUTED))
    rows = [
        ("по убыванию", sorted(vals, reverse=True), "НАИБОЛЬШИЙ"),
        ("по возрастанию", sorted(vals), "НАИМЕНЬШИЙ"),
    ]
    for j, (title, order, name) in enumerate(rows):
        y = 76 + j * 66
        out.append(_t(24, y + 22, title, 14, MUTED))
        for i, v in enumerate(order):
            hit = i == k - 1
            out.append(
                _box(
                    L + i * (cell + gap),
                    y,
                    cell,
                    34,
                    display(v),
                    size=16,
                    rx=6,
                    stroke=ACCENT if hit else MUTED,
                    sw=2.5 if hit else 1.0,
                    weight=700 if hit else 400,
                )
            )
            out.append(
                _t(
                    L + i * (cell + gap) + cell / 2,
                    y + 50,
                    str(i + 1),
                    12.5,
                    MUTED,
                    "middle",
                )
            )
        x = L + len(vals) * (cell + gap) + 18
        out.append(
            _t(
                x,
                y + 23,
                f"{name}(…;{k}) = {display(order[k - 1])}",
                15,
                INK,
                weight=600,
                mono=True,
            )
        )
    out.append(_t(L - 12, 76 + 50, "место", 12.5, MUTED, "end"))
    out.append(_t(L - 12, 142 + 50, "место", 12.5, MUTED, "end"))
    out.append("</svg>")
    return "".join(out)


# --- module 2 of the course: a formula on a small sheet (Change 197) -------------

# the colours of the first two references, as on the live sheet of a lesson
REF_COLORS = ("#1f4fd0", "#7a3fb8")
GOODS_SHEET = {
    "A1": "Товар",
    "B1": "Цена",
    "C1": "Количество",
    "D1": "Стоимость",
    "A2": "Тетрадь",
    "B2": "40",
    "C2": "5",
    "A3": "Ручка",
    "B3": "20",
    "C3": "3",
    "A4": "Папка",
    "B4": "120",
    "C4": "2",
    "A5": "Карандаш",
    "B5": "15",
    "C5": "4",
}
GOODS_WIDTHS = {"A": 104, "B": 64, "C": 108, "D": 104}


def _grid(L, T, rows, values, *, widths=GOODS_WIDTHS, rh=30, frames=(), wash=()) -> str:
    """A small sheet: column letters, row numbers and the cells ``values``
    (``{"D2": ("=B2*C2", "mono")}`` draws a formula being typed). ``frames`` are
    ``(addr, colour)`` borders drawn on top, ``wash`` — cells with a light fill."""
    out = []
    xs, x = {}, L
    for col, w in widths.items():
        xs[col] = (x, w)
        out.append(_box(x, T - 24, w, 24, col, fill=WASH, color=MUTED, size=13, weight=500))
        x += w
    for r in range(1, rows + 1):
        y = T + (r - 1) * rh
        out.append(_box(L - 34, y, 34, rh, str(r), fill=WASH, color=MUTED, size=13, weight=500))
        for col, (cx, w) in xs.items():
            addr = f"{col}{r}"
            out.append(_box(cx, y, w, rh, fill=WASH if addr in wash else "#fff"))
            v = values.get(addr, "")
            if isinstance(v, tuple):
                out.append(_ref_text(cx + 8, y + rh / 2 + 5, v[0], 14.5))
            elif v != "":
                right = typed(v) is not None and not isinstance(typed(v), str)
                out.append(
                    _t(
                        cx + w - 9 if right else cx + 9,
                        y + rh / 2 + 5,
                        v,
                        14.5,
                        INK,
                        "end" if right else "start",
                    )
                )
    for addr, colour in frames:
        col, r = addr[0], int(addr[1:])
        cx, w = xs[col]
        y = T + (r - 1) * rh
        out.append(
            f'<rect x="{cx + 1}" y="{y + 1}" width="{w - 2}" height="{rh - 2}" fill="none" stroke="{colour}" stroke-width="2.5"/>'
        )
    return "".join(out)


def _ref_text(x, y, text, size) -> str:
    """A formula in mono with its first references in the reference colours."""
    spans, last, k = [], 0, 0
    import re  # noqa: PLC0415

    for m in re.finditer(r"\$?[A-Z]{1,3}\$?\d+", text):
        spans.append((text[last : m.start()], INK, 400))
        spans.append((m.group(0), REF_COLORS[min(k, 1)], 700))
        last, k = m.end(), k + 1
    spans.append((text[last:], INK, 400))
    body = "".join(
        f'<tspan fill="{c}" font-weight="{w}">{html.escape(t)}</tspan>' for t, c, w in spans if t
    )
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{MONO}" font-size="{size}" '
        f'style="font-variant-ligatures:none;white-space:pre">{body}</text>'
    )


def _formula_bar(y, name, text) -> str:
    out = [_box(24, y, 64, 30, name, size=14, mono=True, color=INK)]
    out.append(_t(102, y + 20, "fx", 14, MUTED))
    out.append(_box(124, y, 512, 30))
    if text:
        out.append(_ref_text(134, y + 20, text, 15))
    return "".join(out)


def point_entry_frames() -> list[tuple[str, str]]:
    """A formula typed with clicks: =, a click on B2, *, a click on C2, Enter."""
    L, T, rows = 58, 92, 3
    h = T + rows * 30 + 14
    base = {k: v for k, v in GOODS_SHEET.items() if int(k[1:]) <= rows}
    steps = [
        ("D2", "", "", [], "Выбери D2 — здесь будет стоимость тетрадей."),
        ("D2", "=", "=", [], "Набери знак =. Теперь щелчок по ячейке впишет в формулу её адрес."),
        (
            "D2",
            "=B2",
            "=B2",
            [("B2", REF_COLORS[0])],
            "Щёлкни по B2: в формуле появился её адрес, а сама ячейка обведена тем же цветом.",
        ),
        ("D2", "=B2*", "=B2*", [("B2", REF_COLORS[0])], "Набери * — знак умножения."),
        (
            "D2",
            "=B2*C2",
            "=B2*C2",
            [("B2", REF_COLORS[0]), ("C2", REF_COLORS[1])],
            "Щёлкни по C2 — второй адрес, второй цвет. Формула готова.",
        ),
        (
            "D3",
            "",
            None,
            [],
            "Enter: в D2 результат 200, выделение перешло на D3. Вернись на D2 — строка формул покажет =B2*C2.",
        ),
    ]
    frames = []
    for at, bar, typing, refs, note in steps:
        out = [_svg(h, "Формула =B2*C2, набранная щелчками по ячейкам")]
        out.append(_formula_bar(14, at, bar))
        values: dict[str, str | tuple[str, str]] = dict(base)
        if typing is None:
            values["D2"] = "200"
        elif typing:
            values["D2"] = (typing, "mono")
        out.append(_grid(L, T, rows, values, frames=[*refs, (at, ACCENT)]))
        out.append("</svg>")
        frames.append(("".join(out), note))
    return frames


def point_entry() -> str:
    from figures import _stepper

    return _stepper(point_entry_frames())


def fill_down_frames() -> list[tuple[str, str]]:
    """=B2*C2 filled down D2:D5 with the fill handle: every copy takes its own row."""
    L, T, rows, rh = 58, 40, 5, 30
    h = T + rows * rh + 16
    dx = L + sum(GOODS_WIDTHS.values())
    d_left = dx - GOODS_WIDTHS["D"]
    px = dx + 40
    costs = {2: "200", 3: "60", 4: "240", 5: "60"}

    def cell_y(r):
        return T + (r - 1) * rh

    def panel(upto):
        out = [_t(px, T - 8, "формула в ячейке", 13, MUTED)]
        for r in range(2, upto + 1):
            y = cell_y(r) + rh / 2 + 5
            out.append(_t(px, y, f"D{r}", 14, MUTED, mono=True))
            # the row numbers that moved with the copy are marked
            colour, weight = (ACCENT, 700) if r > 2 else (INK, 400)
            parts = [
                ("=B", INK, 400),
                (str(r), colour, weight),
                ("*C", INK, 400),
                (str(r), colour, weight),
            ]
            spans = "".join(f'<tspan fill="{c}" font-weight="{w}">{t}</tspan>' for t, c, w in parts)
            out.append(
                f'<text x="{px + 40:.1f}" y="{y:.1f}" font-family="{MONO}" font-size="15" '
                f'style="font-variant-ligatures:none;white-space:pre">{spans}</text>'
            )
        return "".join(out)

    def handle(r):
        x, y = dx, cell_y(r) + rh
        return f'<rect x="{x - 5}" y="{y - 5}" width="9" height="9" fill="{ACCENT}" stroke="#fff" stroke-width="1.5"/>'

    frames = []
    base = {k: v for k, v in GOODS_SHEET.items() if int(k[1:]) <= rows}

    # 1: the formula in D2 and its fill handle
    out = [_svg(h, "Маркер заполнения копирует =B2*C2 из D2 в D3:D5")]
    out.append(_grid(L, T, rows, {**base, "D2": "200"}, frames=[("D2", ACCENT)]))
    out.append(handle(2))
    y = cell_y(3) + 4
    out.append(
        f'<path d="M {dx + 6} {cell_y(3) - 2} L {dx + 26} {y + 12}" stroke="{MUTED}" stroke-width="1.25" fill="none"/>'
    )
    out.append(_t(dx + 30, y + 17, "маркер заполнения", 14, INK, weight=600))
    out.append(_t(px, T - 8, "формула в ячейке", 13, MUTED))
    out.append(_t(px, cell_y(2) + rh / 2 + 5, "D2", 14, MUTED, mono=True))
    out.append(_ref_text(px + 40, cell_y(2) + rh / 2 + 5, "=B2*C2", 15))
    out.append("</svg>")
    frames.append(
        (
            "".join(out),
            "В D2 формула =B2*C2, результат 200. Квадратик в правом нижнем углу рамки — маркер заполнения.",
        )
    )

    # 2: dragging the handle down to D5
    out = [_svg(h, "Маркер заполнения тянут вниз до D5")]
    out.append(_grid(L, T, rows, {**base, "D2": "200"}, frames=[("D2", ACCENT)]))
    out.append(
        f'<rect x="{d_left + 1}" y="{cell_y(2) + 1}" width="{GOODS_WIDTHS["D"] - 2}" height="{4 * rh - 2}" '
        f'fill="none" stroke="{ACCENT}" stroke-width="1.75" stroke-dasharray="5 4"/>'
    )
    out.append(handle(5))
    x = dx + 18
    out.append(
        f'<path d="M {x} {cell_y(2) + rh - 4} V {cell_y(5) + rh - 10}" stroke="{ACCENT}" stroke-width="2" fill="none"/>'
    )
    out.append(_arrow_head(x, cell_y(5) + rh - 4, 0, 1, ACCENT))
    out.append(_t(x + 14, cell_y(4) + 4, "тянем до D5", 14, INK, weight=600))
    out.append("</svg>")
    frames.append(
        (
            "".join(out),
            "Тяни маркер вниз до D5. Пунктир показывает, куда лягут копии.",
        )
    )

    # 3: the copies
    filled = {**base, **{f"D{r}": v for r, v in costs.items()}}
    out = [_svg(h, "Копии формулы в D3:D5")]
    out.append(_grid(L, T, rows, filled, wash={"D3", "D4", "D5"}))
    out.append(
        f'<rect x="{d_left + 1}" y="{cell_y(2) + 1}" width="{GOODS_WIDTHS["D"] - 2}" height="{4 * rh - 2}" '
        f'fill="none" stroke="{ACCENT}" stroke-width="2.5"/>'
    )
    out.append(panel(5))
    out.append("</svg>")
    frames.append(
        (
            "".join(out),
            "Отпусти: в D3:D5 копии. У каждой номер строки сдвинулся вместе с ней: =B3*C3, =B4*C4, =B5*C5.",
        )
    )

    # 4: one copy takes its own row
    out = [_svg(h, "D4 берёт цену и количество строки 4")]
    out.append(
        _grid(
            L,
            T,
            rows,
            filled,
            frames=[("B4", REF_COLORS[0]), ("C4", REF_COLORS[1]), ("D4", ACCENT)],
        )
    )
    out.append(_t(px, T - 8, "формула в ячейке", 13, MUTED))
    out.append(_t(px, cell_y(4) + rh / 2 + 5, "D4", 14, MUTED, weight=700, mono=True))
    out.append(_ref_text(px + 40, cell_y(4) + rh / 2 + 5, "=B4*C4", 15))
    out.append("</svg>")
    frames.append(
        (
            "".join(out),
            "Выбери D4: =B4*C4 берёт цену и количество своей строки — 120 × 2 = 240.",
        )
    )
    return frames


def fill_down() -> str:
    from figures import _stepper

    return _stepper(fill_down_frames())


COUNTERS = {
    "СУММ": ("складывает числа", lambda v: isinstance(v, float), lambda v: f"+{display(v)}"),
    "СЧЁТ": ("считает числа", lambda v: isinstance(v, float), lambda v: "+1"),
    "СЧЁТЗ": ("считает непустые", lambda v: v != "", lambda v: "+1"),
    "СЧИТАТЬПУСТОТЫ": ("считает пустые", lambda v: v == "", lambda v: "+1"),
}


def count_cells(fn: str = "СУММ", values: list[str] | tuple = ("10", "20", "нет", "")) -> str:
    """Which cells of A2:A5 a counting function takes, and its result."""
    what, takes, adds = COUNTERS[fn]
    cells = []
    for s in values:
        v = typed(s) if s != "" else ""
        cells.append(float(v) if isinstance(v, (int, float)) and not isinstance(v, bool) else v)
    last = 1 + len(values)
    formula = f"={fn}(A2:A{last})"
    L, T, cw, rh = 58, 70, 104, 32
    h = T + len(values) * rh + 52
    out = [_svg(h, f"{formula} {what}", 400)]
    out.append(_t(24, 26, formula, 17, INK, weight=600, mono=True))
    out.append(_t(24 + len(formula) * 10.3 + 14, 26, what, 14, MUTED))
    out.append(_box(L, T - 24, cw, 24, "A", fill=WASH, color=MUTED, size=13, weight=500))
    total = 0.0
    for i, v in enumerate(cells):
        y = T + i * rh
        hit = takes(v)
        out.append(_box(L - 34, y, 34, rh, str(i + 2), fill=WASH, color=MUTED, size=13, weight=500))
        out.append(_box(L, y, cw, rh, fill=WASH if hit else "#fff"))
        if v != "":
            num = isinstance(v, float)
            out.append(
                _t(
                    L + cw - 9 if num else L + 9,
                    y + rh / 2 + 5,
                    values[i],
                    15,
                    INK if hit else MUTED,
                    "end" if num else "start",
                )
            )
        if hit:
            out.append(
                f'<rect x="{L + 1}" y="{y + 1}" width="{cw - 2}" height="{rh - 2}" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>'
            )
            total += float(v) if fn == "СУММ" else 1
        kind = "число" if isinstance(v, float) else ("пусто" if v == "" else "текст")
        verdict = f"{kind}: {adds(v)}" if hit else f"{kind}: пропуск"
        out.append(
            _t(
                L + cw + 22,
                y + rh / 2 + 5,
                verdict,
                14.5,
                INK if hit else MUTED,
                weight=600 if hit else 400,
            )
        )
    y = T + len(cells) * rh + 32
    out.append(_t(24, y, f"{formula} = {display(total)}", 17, INK, weight=700, mono=True))
    out.append("</svg>")
    return "".join(out)


# --- module 3 of the course (Change 197) -------------------------------------------


def interval_logic(kind: str = "И", lo: float = 10, hi: float = 20, points=(5, 15, 25)) -> str:
    """Two comparisons on the number line and what И or ИЛИ makes of them:
    И keeps their common part [lo; hi], ИЛИ joins the two outer rays."""
    if kind not in ("И", "ИЛИ"):
        raise SystemExit("interval_logic: kind is И or ИЛИ")
    a, b = 0, 30
    L, R = 210, 630
    rows = (44, 98, 166)

    def px(v: float) -> float:
        return L + (v - a) / (b - a) * (R - L)

    if kind == "И":
        first = (f"A2>={display(lo)}", lo, b, True, lo)
        second = (f"A2<={display(hi)}", a, hi, True, hi)
        result = f"И(A2>={display(lo)};A2<={display(hi)})"
        parts = [(lo, hi, True, True)]
        test = lambda v: lo <= v <= hi  # noqa: E731
    else:
        first = (f"A2<{display(lo)}", a, lo, False, lo)
        second = (f"A2>{display(hi)}", hi, b, False, hi)
        result = f"ИЛИ(A2<{display(lo)};A2>{display(hi)})"
        parts = [(a, lo, None, False), (hi, b, False, None)]
        test = lambda v: v < lo or v > hi  # noqa: E731
    out = [_svg(250, f"{result} на числовой прямой")]

    def axis(y, ticks):
        s = f'<line x1="{L}" y1="{y}" x2="{R}" y2="{y}" stroke="{FAINT}" stroke-width="1.5"/>'
        for v in range(a, b + 1, 5):
            s += f'<line x1="{px(v):.1f}" y1="{y - 4}" x2="{px(v):.1f}" y2="{y + 4}" stroke="{MUTED}"/>'
            if ticks:
                s += _t(px(v), y + 22, str(v), 12.5, MUTED, "middle")
        return s

    def dot(v, y, closed, colour):
        if closed is None:
            return ""
        fill = colour if closed else "#fff"
        return f'<circle cx="{px(v):.1f}" cy="{y}" r="6" fill="{fill}" stroke="{colour}" stroke-width="2.5"/>'

    for (label, x0, x1, closed, edge), y in ((first, rows[0]), (second, rows[1])):
        out.append(_t(24, y + 5, label, 15, INK, weight=600, mono=True))
        out.append(axis(y, False))
        out.append(
            f'<line x1="{px(x0):.1f}" y1="{y}" x2="{px(x1):.1f}" y2="{y}" stroke="{INK}" stroke-width="3"/>'
        )
        out.append(dot(edge, y, closed, INK))
    y = rows[2]
    out.append(_t(24, y + 5, kind, 15, INK, weight=700, mono=True))
    out.append(_t(24, y + 24, "обе" if kind == "И" else "хотя бы одна", 13, MUTED))
    out.append(axis(y, True))
    for x0, x1, c0, c1 in parts:
        out.append(
            f'<line x1="{px(x0):.1f}" y1="{y}" x2="{px(x1):.1f}" y2="{y}" stroke="{ACCENT}" stroke-width="5"/>'
        )
        out.append(dot(x0, y, c0, ACCENT))
        out.append(dot(x1, y, c1, ACCENT))
    verdicts = []
    for v in points:
        out.append(f'<path d="M {px(v):.1f} {y - 10} l -6 -10 h 12 z" fill="{INK}"/>')
        out.append(_t(px(v), y - 26, display(v), 13, INK, "middle", 600))
        verdicts.append(f"{display(v)} → {'ИСТИНА' if test(v) else 'ЛОЖЬ'}")
    out.append(_t(24, 236, "  ·  ".join(verdicts), 14, INK, weight=600, mono=True))
    out.append("</svg>")
    return "".join(out)


def groups(n: int = 19, k: int = 8, mode: str = "boxes") -> str:
    """n items packed by k: full groups and a tail. ``boxes`` counts the groups
    with the tail (ОКРУГЛВВЕРХ), ``rest`` shows the tail as the remainder (ОСТАТ)."""
    if mode not in ("boxes", "rest"):
        raise SystemExit("groups: mode is boxes or rest")
    full, tail = divmod(n, k)
    count = full + (1 if tail else 0)
    slot, gap, pad, between = 18, 5, 8, 16
    gw = k * (slot + gap) - gap + 2 * pad
    L, T = 24, 62
    if mode == "boxes":
        title = f"=ОКРУГЛВВЕРХ({n}/{k};0) = {count}"
        note = f"{n} / {k} = {display(n / k)}, вверх до целого — {count}"
    else:
        title = f"=ОСТАТ({n};{k}) = {tail}"
        note = f"{n} = {full} × {k} + {tail}"
    out = [_svg(T + 2 * pad + slot + 60, f"{n} предметов по {k}: {note}")]
    out.append(_t(24, 26, title, 17, INK, weight=600, mono=True))
    out.append(_t(24, 48, note, 14, MUTED))
    left = n
    for g in range(count):
        x = L + g * (gw + between)
        in_group = min(k, left)
        left -= in_group
        is_tail = in_group < k
        if mode == "rest" and is_tail:
            stroke, dash, sw = MUTED, ' stroke-dasharray="4 3"', 1.5
        else:
            stroke, dash, sw = (ACCENT if not is_tail else INK), "", 2
        out.append(
            f'<rect x="{x}" y="{T}" width="{gw}" height="{slot + 2 * pad}" rx="6" fill="#fff" '
            f'stroke="{stroke}" stroke-width="{sw}"{dash}/>'
        )
        for i in range(k):
            cx = x + pad + i * (slot + gap) + slot / 2
            cy = T + pad + slot / 2
            if i < in_group:
                out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{slot / 2 - 1}" fill="{INK}"/>')
            elif mode == "boxes":
                out.append(
                    f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{slot / 2 - 2}" fill="none" stroke="{FAINT}" stroke-width="1.5"/>'
                )
        if mode == "boxes":
            label = f"коробка {g + 1}" + (f": {in_group} из {k}" if is_tail else "")
        else:
            label = "остаток" if is_tail else f"{k}"
        out.append(
            _t(
                x + gw / 2,
                T + slot + 2 * pad + 22,
                label,
                13.5,
                INK if is_tail else MUTED,
                "middle",
                600 if is_tail else 400,
            )
        )
    out.append("</svg>")
    return "".join(out)


def freq_frames(row: list[int] | tuple = (4, 4, 1, 2, 3, 5)) -> list[tuple[str, str]]:
    """=СЧЁТЕСЛИ($A2:$F2;A2) copied right over G2:L2: each copy counts the number
    above its own column in the whole fixed row."""
    vals = [int(v) for v in row]
    n = len(vals)
    cw, rh, L, T = 44, 32, 58, 92
    letters = [col_letters(i + 1) for i in range(2 * n)]
    freq = [vals.count(v) for v in vals]
    h = T + rh + 70

    def frame(upto, at, note):
        out = [_svg(h, "Частоты значений строки: СЧЁТЕСЛИ со смешанной ссылкой")]
        if at is None:
            formula = f"={'СЧЁТЕСЛИ'}($A2:${letters[n - 1]}2;A2)"
            out.append(_t(24, 26, f"{letters[n]}2: {formula}", 16, INK, weight=600, mono=True))
        else:
            cell = f"{letters[n + at]}2"
            out.append(_t(24, 26, f"{cell}:", 16, MUTED, weight=600, mono=True))
            text = f"=СЧЁТЕСЛИ($A2:${letters[n - 1]}2;{letters[at]}2)"
            out.append(_ref_text(24 + len(cell) * 10 + 16, 26, text, 16))
        for i, col in enumerate(letters):
            x = L + i * cw + (10 if i >= n else 0)
            out.append(_box(x, T - 24, cw, 24, col, fill=WASH, color=MUTED, size=13, weight=500))
        out.append(_box(L - 34, T, 34, rh, "2", fill=WASH, color=MUTED, size=13, weight=500))
        same = set()
        if at is not None:
            same = {i for i, v in enumerate(vals) if v == vals[at]}
        for i, v in enumerate(vals):
            x = L + i * cw
            out.append(
                _box(
                    x,
                    T,
                    cw,
                    rh,
                    str(v),
                    fill=WASH if i in same else "#fff",
                    size=15,
                    weight=700 if i in same else 400,
                )
            )
        for i in range(n):
            x = L + (n + i) * cw + 10
            shown = str(freq[i]) if i <= upto else ""
            out.append(_box(x, T, cw, rh, shown, size=15, weight=700 if i == at else 400))
        if at is not None:
            out.append(
                f'<rect x="{L + 1}" y="{T + 1}" width="{n * cw - 2}" height="{rh - 2}" fill="none" stroke="{REF_COLORS[0]}" stroke-width="2.5"/>'
            )
            x = L + at * cw
            out.append(
                f'<rect x="{x + 4}" y="{T + 4}" width="{cw - 8}" height="{rh - 8}" fill="none" stroke="{REF_COLORS[1]}" stroke-width="2.5"/>'
            )
            x = L + (n + at) * cw + 10
            out.append(
                f'<rect x="{x + 1}" y="{T + 1}" width="{cw - 2}" height="{rh - 2}" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>'
            )
        if upto == n - 1 and at is None:
            singles = [str(v) for v, f in zip(vals, freq, strict=True) if f == 1]
            repeats = sorted({str(v) for v, f in zip(vals, freq, strict=True) if f > 1})
            out.append(
                _t(
                    24,
                    T + rh + 34,
                    f"частота 1 — одиночные: {', '.join(singles)}",
                    14,
                    INK,
                    weight=600,
                )
            )
            out.append(
                _t(
                    24,
                    T + rh + 56,
                    f"частота больше 1 — повторяются: {', '.join(repeats)}",
                    14,
                    INK,
                    weight=600,
                )
            )
        out.append("</svg>")
        return ("".join(out), note)

    frames = [
        frame(
            -1,
            None,
            f"Строка {', '.join(map(str, vals))} в A2:{letters[n - 1]}2. В {letters[n]}2 формула; её копируют вправо до {letters[2 * n - 1]}2.",
        )
    ]
    for i, v in enumerate(vals):
        times = {1: "один раз", 2: "два раза", 3: "три раза"}.get(freq[i], f"{freq[i]} раз")
        frames.append(
            frame(
                i,
                i,
                f"{letters[n + i]}2: критерий {letters[i]}2 = {v}, диапазон $A2:${letters[n - 1]}2 тот же. Число {v} встречается в строке {times} — {freq[i]}.",
            )
        )
    frames.append(
        frame(
            n - 1,
            None,
            "Частоты готовы. Частота 1 — число без пары, больше 1 — повторяющееся: каждое его вхождение получает свою частоту.",
        )
    )
    return frames


def freq_steps(row: list[int] | tuple = (4, 4, 1, 2, 3, 5)) -> str:
    from figures import _stepper

    return _stepper(freq_frames(row))


# --- module 4 of the course (Change 197) -------------------------------------------


def pairs_arcs(values: list[int] | tuple = (4, 5, 9, 7, 8, 12), k: int = 3) -> str:
    """Neighbour pairs of a column laid out in a row: n numbers make n − 1 pairs,
    the formula of pair i stands in the row of its first number; pairs with a
    multiple of k are marked."""
    vals = [int(v) for v in values]
    n = len(vals)
    cw, gap, L, base = 64, 18, 24, 118
    out = [_svg(232, f"{n} чисел дают {n - 1} соседних пар")]

    def cx(i):
        return L + i * (cw + gap) + cw / 2

    for i in range(n - 1):
        hit = vals[i] % k == 0 or vals[i + 1] % k == 0
        colour = ACCENT if hit else MUTED
        x0, x1 = cx(i), cx(i + 1)
        top = base - 46
        out.append(
            f'<path d="M {x0:.1f} {base - 4} C {x0:.1f} {top}, {x1:.1f} {top}, {x1:.1f} {base - 4}" '
            f'fill="none" stroke="{colour}" stroke-width="{2.5 if hit else 1.5}"/>'
        )
        out.append(_t((x0 + x1) / 2, top + 4, f"B{i + 2}", 13.5, INK if hit else MUTED, "middle", 600 if hit else 400, mono=True))
    for i, v in enumerate(vals):
        x = L + i * (cw + gap)
        out.append(_box(x, base, cw, 34, str(v), size=16, rx=6, stroke=MUTED, weight=700 if v % k == 0 else 400))
        out.append(_t(x + cw / 2, base + 54, f"A{i + 2}", 13, MUTED, "middle", mono=True))
    out.append(_t(24, 26, f"{n} чисел → {n - 1} пар: формулы в B2:B{n}", 15, INK, weight=600))
    hits = sum(vals[i] % k == 0 or vals[i + 1] % k == 0 for i in range(n - 1))
    out.append(
        _t(24, 214, f"пар с числом, кратным {k}: {hits}; у A{n + 1} пары нет — формула в B{n + 1} лишняя", 14, MUTED)
    )
    out.append("</svg>")
    return "".join(out)


def grid_paths_frames(rows: int = 4, cols: int = 4) -> list[tuple[str, str]]:
    """Paths «only right and down» counted cell by cell: an edge cell has one
    way in, an inner cell sums its left and upper neighbours."""
    ways = [[1] * cols for _ in range(rows)]
    for r in range(1, rows):
        for c in range(1, cols):
            ways[r][c] = ways[r][c - 1] + ways[r - 1][c]
    cw, rh, L, T = 70, 44, 58, 52
    h = T + rows * rh + 16
    letters = [col_letters(c + 1) for c in range(cols)]
    px = L + cols * cw + 34

    def frame(done, at, note):
        out = [_svg(h, "Число путей вправо и вниз, клетка за клеткой")]
        for c in range(cols):
            out.append(_box(L + c * cw, T - 24, cw, 24, letters[c], fill=WASH, color=MUTED, size=13, weight=500))
        for r in range(rows):
            out.append(_box(L - 34, T + r * rh, 34, rh, str(r + 1), fill=WASH, color=MUTED, size=13, weight=500))
            for c in range(cols):
                shown = str(ways[r][c]) if (r, c) in done else ""
                edge = r == 0 or c == 0
                out.append(
                    _box(L + c * cw, T + r * rh, cw, rh, shown, fill=WASH if edge and shown else "#fff", size=17, weight=700 if (r, c) == at else 400)
                )
        if at is not None:
            r, c = at
            x, y = L + c * cw, T + r * rh
            if r and c:
                for (rr, cc), colour in (((r, c - 1), REF_COLORS[0]), ((r - 1, c), REF_COLORS[1])):
                    out.append(
                        f'<rect x="{L + cc * cw + 2}" y="{T + rr * rh + 2}" width="{cw - 4}" height="{rh - 4}" fill="none" stroke="{colour}" stroke-width="2.5"/>'
                    )
                out.append(_arrow_head(x + 10, y + rh / 2, 1, 0, REF_COLORS[0]))
                out.append(_arrow_head(x + cw / 2, y + 10, 0, 1, REF_COLORS[1]))
                out.append(_t(px, T + 20, f"{letters[c]}{r + 1} = {letters[c - 1]}{r + 1} + {letters[c]}{r}", 16, INK, weight=600, mono=True))
                out.append(
                    _t(px, T + 46, f"{ways[r][c - 1]} + {ways[r - 1][c]} = {ways[r][c]}", 16, INK, weight=600, mono=True)
                )
                out.append(_t(px, T + 74, "слева", 13.5, REF_COLORS[0], weight=600))
                out.append(_t(px + 52, T + 74, "сверху", 13.5, REF_COLORS[1], weight=600))
            out.append(
                f'<rect x="{x + 1}" y="{y + 1}" width="{cw - 2}" height="{rh - 2}" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>'
            )
        out.append("</svg>")
        return ("".join(out), note)

    frames = []
    done = {(0, 0)}
    frames.append(frame(set(done), (0, 0), "A1 — старт: в неё ведёт один путь — стоять на месте."))
    for c in range(1, cols):
        done.add((0, c))
    for r in range(1, rows):
        done.add((r, 0))
    frames.append(
        frame(
            set(done),
            None,
            "Первая строка и первый столбец: туда можно прийти только по прямой — по одному пути.",
        )
    )
    for r in range(1, rows):
        for c in range(1, cols):
            done.add((r, c))
            cell = f"{letters[c]}{r + 1}"
            note = (
                f"{cell}: прийти можно слева или сверху, поэтому путей "
                f"{ways[r][c - 1]} + {ways[r - 1][c]} = {ways[r][c]}."
            )
            frames.append(frame(set(done), (r, c), note))
    last = f"{letters[cols - 1]}{rows}"
    frames.append(
        frame(
            set(done),
            None,
            f"Сетка заполнена: в {last} ведут {ways[rows - 1][cols - 1]} путей. Каждая клетка посчитана из уже готовых соседей.",
        )
    )
    return frames


def grid_paths(rows: int = 4, cols: int = 4) -> str:
    from figures import _stepper

    return _stepper(grid_paths_frames(rows, cols))


ROUNDERS = [
    ("ОКРУГЛ", "к ближайшему целому", "=ОКРУГЛ({};0)"),
    ("ОКРУГЛВВЕРХ", "от нуля", "=ОКРУГЛВВЕРХ({};0)"),
    ("ОКРУГЛВНИЗ", "к нулю", "=ОКРУГЛВНИЗ({};0)"),
    ("ЦЕЛОЕ", "влево по прямой", "=ЦЕЛОЕ({})"),
    ("ОТБР", "отбросить дробную часть", "=ОТБР({})"),
]


def round_line(values: list[float] | tuple = (-2.3, 2.3)) -> str:
    """Where each rounding function moves a negative and a positive number on the
    number line: «from zero» and «to zero» are directions relative to 0."""
    book = Book()
    sheet = book.sheet("Лист")
    lo, hi, L, R = -3.5, 3.5, 250, 640
    unit = (R - L) / (hi - lo)

    def px(v):
        return L + (v - lo) * unit

    rh, top = 70, 14
    h = top + rh * len(ROUNDERS) + 6
    out = [_svg(h, "Пять способов округления на числовой прямой")]
    for i, (name, note, pattern) in enumerate(ROUNDERS):
        y = top + i * rh
        base = y + 34
        out.append(_t(24, y + 30, name, 15, INK, weight=600, mono=True))
        out.append(_t(24, y + 49, note, 13, MUTED))
        out.append(f'<line x1="{L}" y1="{base}" x2="{R}" y2="{base}" stroke="{MUTED}"/>')
        for n in range(-3, 4):
            tall = 7 if n == 0 else 4
            out.append(
                f'<line x1="{px(n):.1f}" y1="{base - tall}" x2="{px(n):.1f}" y2="{base + tall}" stroke="{INK if n == 0 else MUTED}"/>'
            )
            out.append(_t(px(n), base + 20, str(n).replace("-", "−"), 12, MUTED, "middle"))
        for v in values:
            arg = display(float(v))
            got = book.formula(pattern.format(arg), sheet)
            assert isinstance(got, float), (name, v, got)
            x0, x1 = px(v), px(got)
            out.append(f'<circle cx="{x0:.1f}" cy="{base}" r="4" fill="{INK}"/>')
            lift = 16
            out.append(
                f'<path d="M {x0:.1f} {base - 5} C {x0:.1f} {base - lift - 4}, {x1:.1f} {base - lift - 4}, {x1:.1f} {base - 8}" '
                f'fill="none" stroke="{ACCENT}" stroke-width="2"/>'
            )
            out.append(_arrow_head(x1, base - 4, 0, 1, ACCENT))
            out.append(
                _t(
                    (x0 + x1) / 2,
                    base - lift - 8,
                    f"{arg.replace('-', '−')} → {display(got).replace('-', '−')}",
                    12.5,
                    INK,
                    "middle",
                    600,
                )
            )
    out.append("</svg>")
    return "".join(out)


def text_slots(text: str = "ABCDE") -> str:
    """Positions of characters from 1 and what ЛЕВСИМВ, ПСТР and ПРАВСИМВ take."""
    book, sheet = _context(f"A2={text}")
    calls = ["=ЛЕВСИМВ(A2;3)", "=ПСТР(A2;2;3)", "=ПРАВСИМВ(A2;2)"]
    cell, L, top, rh = 40, 210, 34, 52
    out = [
        _svg(
            top + rh * len(calls) + 8,
            f"Позиции символов текста {text} и части, которые берут функции",
        )
    ]
    out.append(_t(24, 22, "позиция", 13, MUTED))
    for i in range(len(text)):
        out.append(_t(L + i * cell + cell / 2, 22, str(i + 1), 13, MUTED, "middle", 500))
    for j, call in enumerate(calls):
        y = top + j * rh
        got = display(book.formula(call, sheet))
        start = text.find(got)
        out.append(_t(24, y + 25, call[1:], 14.5, INK, weight=600, mono=True))
        for i, ch in enumerate(text):
            hit = start <= i < start + len(got)
            out.append(
                _box(
                    L + i * cell,
                    y,
                    cell,
                    36,
                    ch,
                    fill=WASH if hit else "#fff",
                    stroke=FAINT,
                    size=17,
                    mono=True,
                    weight=700 if hit else 400,
                    color=INK if hit else MUTED,
                )
            )
        out.append(
            f'<rect x="{L + start * cell}" y="{y}" width="{len(got) * cell}" height="36" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>'
        )
        out.append(
            _t(
                L + len(text) * cell + 18,
                y + 24,
                f"= {got}",
                16,
                INK,
                weight=600,
                mono=True,
            )
        )
    out.append("</svg>")
    return "".join(out)


def sumif_frames(
    check: list[str] | tuple = ("Книги", "Книги", "Еда", "Книги", "Игрушки"),
    add: list[float] | tuple = (100, 200, 50, 100, 300),
    crit: str = "Книги",
    check_col: str = "A",
    add_col: str = "D",
    first: int = 2,
) -> list[tuple[str, str]]:
    """СУММЕСЛИ row by row: test the cell of the check range, and when it passes
    add the number of the same row from the sum range."""
    test = criterion(crit)
    last = first + len(check) - 1
    formula = (
        f'=СУММЕСЛИ({check_col}{first}:{check_col}{last};"{crit}";{add_col}{first}:{add_col}{last})'
    )
    cw, rh, L, T = 120, 30, 64, 64
    h = T + (len(check) + 1) * rh + 18
    frames = []
    total, taken = 0.0, []

    def frame(at, note):
        out = [_svg(h, f"Как {formula} проходит строки")]
        out.append(_t(24, 24, formula, 16, INK, weight=600, mono=True))
        out.append(
            _box(
                L,
                T - 24,
                cw,
                24,
                check_col,
                fill=WASH,
                color=MUTED,
                size=13,
                weight=500,
            )
        )
        out.append(
            _box(
                L + cw + 8,
                T - 24,
                cw,
                24,
                add_col,
                fill=WASH,
                color=MUTED,
                size=13,
                weight=500,
            )
        )
        for i, (c, a) in enumerate(zip(check, add, strict=True)):
            r = first + i
            y = T + i * rh
            out.append(
                _box(
                    L - 34,
                    y,
                    34,
                    rh,
                    str(r),
                    fill=WASH,
                    color=MUTED,
                    size=13,
                    weight=500,
                )
            )
            out.append(_box(L, y, cw, rh, c, size=14))
            used = r in taken
            out.append(
                _box(
                    L + cw + 8,
                    y,
                    cw,
                    rh,
                    display(float(a)),
                    fill=WASH if used else "#fff",
                    size=14,
                    weight=600 if used else 400,
                )
            )
            if at == r:
                ok = test(c)
                out.append(
                    f'<rect x="{L}" y="{y}" width="{cw}" height="{rh}" fill="none" stroke="{INK}" stroke-width="2.5"/>'
                )
                if ok:
                    out.append(
                        f'<rect x="{L + cw + 8}" y="{y}" width="{cw}" height="{rh}" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>'
                    )
                verdict = f"«{c}» подходит → +{display(float(a))}" if ok else f"«{c}» не подходит"
                out.append(_t(L + 2 * cw + 30, y + 20, verdict, 14.5, INK, weight=600))
        y = T + len(check) * rh + 14
        out.append(_t(L + 2 * cw + 30, y, f"сумма: {display(total)}", 16, INK, weight=700))
        out.append("</svg>")
        frames.append(("".join(out), note))

    frame(
        None,
        f"СУММЕСЛИ идёт по строкам {first}–{last}. В каждой она смотрит в столбец {check_col} и, если там «{crit}», берёт число из столбца {add_col} той же строки.",
    )
    for i, (c, a) in enumerate(zip(check, add, strict=True)):
        r = first + i
        if test(c):
            total += float(a)
            taken.append(r)
            note = f"Строка {r}: в {check_col}{r} «{c}» — подходит, к сумме прибавляется {add_col}{r} = {display(float(a))}. Сумма {display(total)}."
        else:
            note = f"Строка {r}: в {check_col}{r} «{c}» — не подходит, {add_col}{r} пропускается."
        frame(r, note)
    frame(
        None,
        f"Итог {display(total)}. Диапазоны {check_col}{first}:{check_col}{last} и {add_col}{first}:{add_col}{last} одной высоты: k-я ячейка проверки и k-я ячейка суммы — из одной строки.",
    )
    return frames


def sumif_steps(
    check: list[str] | tuple = ("Книги", "Книги", "Еда", "Книги", "Игрушки"),
    add: list[float] | tuple = (100, 200, 50, 100, 300),
    crit: str = "Книги",
    check_col: str = "A",
    add_col: str = "D",
    first: int = 2,
) -> str:
    from figures import _stepper

    return _stepper(sumif_frames(check, add, crit, check_col, add_col, first))


GOODS = [
    ("101", "Чай", "Напитки", "100"),
    ("102", "Кофе", "Напитки", "250"),
    ("103", "Печенье", "Выпечка", "200"),
    ("104", "Какао", "Напитки", "150"),
]


def vlookup_frames(key: str = "103", col: int = 3) -> list[tuple[str, str]]:
    """ВПР(key; Товары!$A$2:$D$5; col; 0): down the first column of the range to
    the key, then across the found row to the column with number ``col``."""
    formula = f"=ВПР({key};Товары!$A$2:$D$5;{col};0)"
    cw, rh, L, T = 96, 30, 64, 92
    h = T + len(GOODS) * rh + 20
    found = next(i for i, g in enumerate(GOODS) if g[0] == key)

    def frame(scan, take, note):
        out = [_svg(h, f"Как {formula} находит значение")]
        out.append(_t(24, 24, formula, 16, INK, weight=600, mono=True))
        for c in range(4):
            x = L + c * cw
            out.append(
                _t(
                    x + cw / 2,
                    52,
                    f"{c + 1}-й",
                    13,
                    ACCENT if c == col - 1 and take else MUTED,
                    "middle",
                    600,
                )
            )
            out.append(
                _box(
                    x,
                    T - 24,
                    cw,
                    24,
                    col_letters(c + 1),
                    fill=WASH,
                    color=MUTED,
                    size=13,
                    weight=500,
                )
            )
        for i, g in enumerate(GOODS):
            y = T + i * rh
            out.append(
                _box(
                    L - 34,
                    y,
                    34,
                    rh,
                    str(i + 2),
                    fill=WASH,
                    color=MUTED,
                    size=13,
                    weight=500,
                )
            )
            for c, v in enumerate(g):
                lit = take and i == found
                out.append(_box(L + c * cw, y, cw, rh, v, fill=WASH if lit else "#fff", size=14))
        out.append(
            f'<rect x="{L}" y="{T}" width="{4 * cw}" height="{len(GOODS) * rh}" fill="none" stroke="{MUTED}" stroke-width="1.5" stroke-dasharray="5 3"/>'
        )
        right = L + 4 * cw + 20
        if scan is not None:
            y = T + scan * rh
            out.append(
                f'<rect x="{L}" y="{y}" width="{cw}" height="{rh}" fill="none" stroke="{INK}" stroke-width="2.5"/>'
            )
            same = GOODS[scan][0] == key
            out.append(
                _t(
                    right,
                    y + 20,
                    f"{GOODS[scan][0]} {'=' if same else '≠'} {key}",
                    15,
                    INK,
                    weight=600,
                )
            )
        if take:
            y = T + found * rh
            x = L + (col - 1) * cw
            out.append(
                f'<rect x="{L}" y="{y}" width="{cw}" height="{rh}" fill="none" stroke="{INK}" stroke-width="2.5"/>'
            )
            out.append(
                f'<rect x="{x}" y="{y}" width="{cw}" height="{rh}" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>'
            )
            out.append(_t(right, y + 20, f"= {GOODS[found][col - 1]}", 15, INK, weight=700))
        out.append("</svg>")
        return ("".join(out), note)

    frames = [
        frame(
            None,
            False,
            f"Справочник — диапазон Товары!$A$2:$D$5. Внутри него столбцы считаются с единицы: A — 1-й, B — 2-й, C — 3-й, D — 4-й. Ключ {key} ищется только в 1-м.",
        ),
    ]
    for i in range(found + 1):
        r = i + 2
        if i < found:
            note = f"A{r}: {GOODS[i][0]} — не {key}, ВПР спускается ниже."
        else:
            note = f"A{r}: {key} — совпадение. Строка {r} листа — {found + 1}-я строка справочника."
        frames.append(frame(i, False, note))
    frames.append(
        frame(
            None,
            True,
            f"В найденной строке ВПР берёт {col}-й столбец диапазона — {col_letters(col)}{found + 2}: {GOODS[found][col - 1]}. Четвёртый аргумент 0 требует точного совпадения ключа.",
        )
    )
    return frames


def vlookup_steps(key: str = "103", col: int = 3) -> str:
    from figures import _stepper

    return _stepper(vlookup_frames(key, col))


# --- module 5 of the course: the course map (Change 197) ----------------------

COURSE_COLS = {"A": 92, "B": 54, "C": 100, "D": 92, "E": 112, "F": 116, "G": 70}
COURSE_HEAD = {
    "A1": "Товар",
    "B1": "Цена",
    "C1": "Количество",
    "D1": "Стоимость",
    "E1": "После скидки",
    "F1": "> 100",
    "G1": "Скидка",
}
# the purchase table across the course: lesson, title, cells added or changed,
# the cell in the formula bar, its content, hidden rows, the caption
COURSE_TABLE = [
    (
        "1.1",
        "Книга, лист, ячейка, диапазон",
        {**{k: v for k, v in GOODS_SHEET.items() if k[0] in "ABC"}},
        ("B2", "40"),
        (),
        "одна покупка — одна строка, свойство — столбец",
    ),
    (
        "2.1",
        "Первые формулы",
        {"D1": "Стоимость", "D2": "200", "D3": "60", "D4": "240", "D5": "60"},
        ("D2", "=B2*C2"),
        (),
        "стоимость формулой, скопированной вниз",
    ),
    (
        "2.2",
        "Копирование формул и знак $",
        {
            "E1": "После скидки",
            "E2": "180",
            "E3": "54",
            "E4": "216",
            "E5": "54",
            "G1": "Скидка",
            "G2": "10%",
        },
        ("E2", "=D2*(1-$G$2)"),
        (),
        "скидка в одной ячейке, адрес закреплён знаком $",
    ),
    (
        "2.3",
        "Функции по диапазону",
        {"A7": "Итого", "E7": "504"},
        ("E7", "=СУММ(E2:E5)"),
        (),
        "итог всего столбца одной функцией",
    ),
    (
        "3.1",
        "Проверки и ЕСЛИ",
        {"F1": "> 100", "F2": "1", "F3": "0", "F4": "1", "F5": "0", "F7": "2"},
        ("F2", "=ЕСЛИ(E2>100;1;0)"),
        (),
        "признак 1/0 для каждой покупки; сумма признаков — сколько покупок дороже 100",
    ),
    (
        "3.3",
        "Подсчёт и сумма по условию",
        {"A7": "Ответ", "E7": "396"},
        ("E7", "=СУММЕСЛИ(F2:F5;1;E2:E5)"),
        (),
        "в E7 теперь сумма только тех покупок, у которых признак 1",
    ),
    (
        "4.1",
        "Сортировка, фильтр, видимые строки",
        {},
        ("F1", "> 100"),
        (3, 5),
        "фильтр по признаку оставил две строки — столько же, сколько в F7",
    ),
    (
        "5.1",
        "От условия к таблице вычислений",
        {"A8": "Проверка", "E8": "396", "F8": "2"},
        ("F8", '=СЧЁТЕСЛИ(E2:E5;">100")'),
        (),
        "второй способ без признаков даёт те же 2 и 396",
    ),
]


def course_table_frames() -> list[tuple[str, str]]:
    """The purchase table of the course growing lesson by lesson: a strip of
    lessons on top, the formula bar with the new formula, the sheet with the new
    cells washed in the accent; a filter hides rows and colours their numbers."""
    L, T, rh, rows, W = 40, 120, 30, 8, 680
    h = T + rows * rh + 14
    xs, x = {}, L
    for col, w in COURSE_COLS.items():
        xs[col] = (x, w)
        x += w
    frames, values = [], {}
    n = len(COURSE_TABLE)
    for k, (lesson, title, cells, (at, bar), hidden, note) in enumerate(COURSE_TABLE):
        values.update(cells)
        out = [_svg(h, f"Таблица покупок после урока {lesson}", W)]
        # the course as a strip of lessons; this one filled
        step = (W - 60) / (n - 1)
        for i, (stop, *_rest) in enumerate(COURSE_TABLE):
            cx = 30 + i * step
            on, done = i == k, i <= k
            if i:
                out.append(
                    f'<path d="M {cx - step + 7:.1f} 14 H {cx - 7:.1f}" '
                    f'stroke="{ACCENT if done else FAINT}" stroke-width="1.5"/>'
                )
            out.append(
                f'<circle cx="{cx:.1f}" cy="14" r="{6 if on else 4}" fill="{ACCENT if on else "#fff"}" '
                f'stroke="{ACCENT if done else FAINT}" stroke-width="1.5"/>'
            )
            out.append(_t(cx, 38, stop, 12, INK if on else MUTED, "middle", 600 if on else 500, True))
        # the formula bar across the width of the sheet
        out.append(_box(6, 56, 64, 30, at, size=14, mono=True, color=INK))
        out.append(_t(84, 76, "fx", 14, MUTED))
        out.append(_box(104, 56, L + sum(COURSE_COLS.values()) - 104, 30))
        out.append(_ref_text(114, 76, bar, 15))
        # the sheet: hidden rows are skipped, the numbers after a gap turn blue
        for col, (cx, w) in xs.items():
            out.append(_box(cx, T - 24, w, 24, col, fill=WASH, color=MUTED, size=13, weight=500))
        y = T
        for r in range(1, rows + 1):
            if r in hidden:
                continue
            filtered = bool(hidden) and 1 < r <= 5
            out.append(
                _box(
                    L - 34,
                    y,
                    34,
                    rh,
                    str(r),
                    fill=WASH,
                    color=REF_COLORS[0] if filtered else MUTED,
                    size=13,
                    weight=600 if filtered else 500,
                )
            )
            for col, (cx, w) in xs.items():
                addr = f"{col}{r}"
                out.append(_box(cx, y, w, rh))
                if addr in cells:
                    out.append(
                        f'<rect x="{cx}" y="{y}" width="{w}" height="{rh}" fill="{ACCENT}" fill-opacity="0.13"/>'
                    )
                v = values.get(addr, "")
                if v:
                    right = typed(v) is not None and not isinstance(typed(v), str)
                    out.append(
                        _t(cx + w - 9 if right else cx + 9, y + rh / 2 + 5, v, 14.5, INK, "end" if right else "start")
                    )
                if addr == at:
                    out.append(
                        f'<rect x="{cx + 1}" y="{y + 1}" width="{w - 2}" height="{rh - 2}" fill="none" '
                        f'stroke="{ACCENT}" stroke-width="2.5"/>'
                    )
                if hidden and addr == "F1":
                    # the filter button of the column the filter is set on
                    out.append(_box(cx + w - 21, y + 7, 16, 16, fill="#fff", stroke=REF_COLORS[0]))
                    out.append(_arrow_head(cx + w - 13, y + 19, 0, 1, REF_COLORS[0]))
            y += rh
        out.append("</svg>")
        caption = f"Урок {lesson}, «{title}»: {note}."
        if k == 0:
            caption += " Новые ячейки каждого шага подкрашены."
        frames.append(("".join(out), caption))
    return frames


def course_table() -> str:
    from figures import _stepper

    return _stepper(course_table_frames())


def exam_order() -> str:
    """Five steps from the question to a checked answer, with the lessons each
    comes from; a failed check goes back to the columns on a small set."""
    steps = [
        ("Вопрос", ["что найти,", "единица ответа"], "5.1"),
        ("Файл", ["листы, типы,", "рабочая копия"], "1.2, 1.3"),
        ("Столбцы", ["проверки", "словами"], "3.1, 5.1"),
        ("Формулы", ["одна строка,", "затем столбец"], "2.1, 2.2"),
        ("Проверить", ["другим путём,", "по масштабу"], "4.1, 5.1"),
    ]
    w, gap, x0, y, h = 120, 12, 6, 16, 104
    out = [_svg(206, "Работа над задачей: вопрос, файл, столбцы, формулы, проверка")]
    for k, (title, lines, lessons) in enumerate(steps):
        x = x0 + k * (w + gap)
        key = k == 2
        out.append(_box(x, y, w, h, stroke=ACCENT if key else INK, sw=2 if key else 1.5, rx=8))
        out.append(_t(x + w / 2, y + 28, title, 13.5, ACCENT if key else INK, "middle", 600))
        for i, line in enumerate(lines):
            out.append(_t(x + w / 2, y + 52 + i * 18, line, 12.5, MUTED, "middle"))
        out.append(_t(x + w / 2, y + h - 10, lessons, 11, MUTED, "middle", mono=True))
        if k:
            out.append(
                f'<path d="M {x - gap + 2} {y + h / 2} H {x - 8}" stroke="{MUTED}" stroke-width="1.5"/>'
            )
            out.append(_arrow_head(x - 2, y + h / 2, 1, 0))
    right = x0 + 4 * (w + gap) + w / 2
    left = x0 + 2 * (w + gap) + w / 2
    bottom = y + h + 30
    out.append(
        f'<path d="M {right:.1f} {y + h + 2:.1f} V {bottom} H {left:.1f} V {y + h + 10:.1f}" '
        f'fill="none" stroke="{MUTED}" stroke-width="1.5"/>'
    )
    out.append(_arrow_head(left, y + h + 2, 0, -1))
    out.append(_t(330, bottom + 24, "не сошлось — назад к столбцам на маленьком наборе", 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def _toned(builder):
    """A course lesson passes ``tone="excel"`` (Change 197): the builder then draws
    its one accent in the course colour instead of the orange of the topics."""

    @functools.wraps(builder)
    def call(*args, tone: str | None = None, **kwargs):
        global ACCENT
        from figures import accent_of  # noqa: PLC0415 — figures imports this module

        saved, ACCENT = ACCENT, accent_of(tone)
        try:
            return builder(*args, **kwargs)
        finally:
            ACCENT = saved

    return call


EXCEL_FIGURES = {
    name: _toned(builder)
    for name, builder in {
        "fill_try": fill_try,
        "range_grid": range_grid,
        "ref_moves": ref_moves,
        "period_line": period_line,
        "formula_steps": formula_steps,
        "ctrl_jump": ctrl_jump,
        "csv_split": csv_split,
        "rank_line": rank_line,
        "round_line": round_line,
        "text_slots": text_slots,
        "sumif_steps": sumif_steps,
        "vlookup_steps": vlookup_steps,
        "point_entry": point_entry,
        "fill_down": fill_down,
        "count_cells": count_cells,
        "interval_logic": interval_logic,
        "groups": groups,
        "freq_steps": freq_steps,
        "pairs_arcs": pairs_arcs,
        "grid_paths": grid_paths,
        "course_table": course_table,
        "exam_order": exam_order,
    }.items()
}
EXCEL_WIDGETS = {"fill_try": "FillSandbox"}
# step-through figures: the site shows their frames (site_media → figures.STEPPERS)
EXCEL_STEPPERS = {
    name: _toned(builder)
    for name, builder in {
        "formula_steps": formula_frames,
        "ctrl_jump": ctrl_jump_frames,
        "sumif_steps": sumif_frames,
        "vlookup_steps": vlookup_frames,
        "point_entry": point_entry_frames,
        "fill_down": fill_down_frames,
        "freq_steps": freq_frames,
        "grid_paths": grid_paths_frames,
        "course_table": course_table_frames,
    }.items()
}
EXCEL_SCRIPTS = {"data-fill-try": FILL_TRY_JS}
