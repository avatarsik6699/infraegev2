"""Figures and sandboxes of the Excel course stand (registered in figures.FIGURES).

``fill_try(formula, origin, target)`` — the copy sandbox: a formula standing in
``origin`` is copied to ``target``; the new formula is computed with
``sheet_eval.shift`` (the rule of the lesson about ``$``) and every part of an
address that moved is marked. The reader retypes the formula and the target.
Without JavaScript the initial example stays computed.
"""

from __future__ import annotations

import datetime
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


def formula_steps(cells: str, steps: list[str], notes: list[str]) -> str:
    """How Excel computes a formula, one substitution per frame (like «Вычислить
    формулу» in Excel): references become values, then the innermost operation
    becomes its result. Each step is checked by ``sheet_eval``: it shows the same
    value as the formula itself."""
    from figures import _stepper

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
    return _stepper(frames)


def ctrl_jump() -> str:
    """Ctrl+↓ in a column with a gap: it stops at the edge of every block of data."""
    from figures import _stepper

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
    return _stepper(frames)


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


def sumif_steps(
    check: list[str] | tuple = ("Книги", "Книги", "Еда", "Книги", "Игрушки"),
    add: list[float] | tuple = (100, 200, 50, 100, 300),
    crit: str = "Книги",
    check_col: str = "A",
    add_col: str = "D",
    first: int = 2,
) -> str:
    """СУММЕСЛИ row by row: test the cell of the check range, and when it passes
    add the number of the same row from the sum range."""
    from figures import _stepper

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
    return _stepper(frames)


GOODS = [
    ("101", "Чай", "Напитки", "100"),
    ("102", "Кофе", "Напитки", "250"),
    ("103", "Печенье", "Выпечка", "200"),
    ("104", "Какао", "Напитки", "150"),
]


def vlookup_steps(key: str = "103", col: int = 3) -> str:
    """ВПР(key; Товары!$A$2:$D$5; col; 0): down the first column of the range to
    the key, then across the found row to the column with number ``col``."""
    from figures import _stepper

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
    return _stepper(frames)


EXCEL_FIGURES = {
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
}
EXCEL_WIDGETS = {"fill_try": "FillSandbox"}
EXCEL_SCRIPTS = {"data-fill-try": FILL_TRY_JS}
