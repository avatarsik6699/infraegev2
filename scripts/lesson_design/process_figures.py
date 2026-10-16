"""Figures of topic 22 «Многопроцессорные системы» (registered in figures.FIGURES).

A system of the lesson is given as rows ``(id, duration, suppliers)``; the early
schedule (start = max of the suppliers' finishes, finish = start + duration) is
computed here, so every bar, every start and finish and every count of active
processes in a figure comes from the same calculation as the lesson's table.
A shifted schedule passes its own ``starts``.

``pr_dag(procs)`` — the dependency graph by calculation steps (replaces the
author's Mermaid scheme).
``pr_gantt(procs, starts, chain, t, window)`` — bars on the common time axis;
the critical chain in accent, a moment t or the n-th millisecond marked.
``pr_load(procs, starts, horizon)`` — the number of processes working in every
millisecond [k; k + 1) under the axis, the peak marked.
``pr_book(name)`` — a collapsed read-only mini-sheet with the table of
``files/<name>.xlsx``: the stand does not serve workbooks.
"""

from __future__ import annotations

import html
import importlib.util
import sys
from pathlib import Path
from types import ModuleType

from figures import ACCENT, FAINT, INK, MUTED, WASH, _text

TOPIC = Path(__file__).resolve().parents[2] / "content/lesson-design/topic-22"

W = 660


def schedule(procs, starts=None) -> dict[int, tuple[int, int]]:
    """{id: (start, finish)} of the early schedule (or of the given starts)."""
    d = {p[0]: p[1] for p in procs}
    deps = {p[0]: tuple(p[2]) for p in procs}
    if starts:
        return {i: (starts[i], starts[i] + d[i]) for i in d}
    out: dict[int, tuple[int, int]] = {}
    while len(out) < len(d):
        ready = [i for i in d if i not in out and all(j in out for j in deps[i])]
        assert ready, "a cycle of dependencies"
        for i in ready:
            s = max((out[j][1] for j in deps[i]), default=0)
            out[i] = (s, s + d[i])
    return out


def levels(procs) -> list[list[int]]:
    """Calculation steps: a process appears once all its suppliers are known."""
    deps = {p[0]: tuple(p[2]) for p in procs}
    done: set[int] = set()
    out = []
    while len(done) < len(deps):
        step = sorted(i for i in deps if i not in done and all(j in done for j in deps[i]))
        out.append(step)
        done |= set(step)
    return out


def active(sched, k: int) -> list[int]:
    """Processes working in the millisecond [k; k + 1)."""
    return [i for i, (s, f) in sched.items() if s <= k < f]


def pr_dag(procs, chain=(), height: int = 300) -> str:
    """Boxes «ID · d» by calculation steps, arrows from supplier to receiver."""
    lv = levels(procs)
    d = {p[0]: p[1] for p in procs}
    deps = {p[0]: tuple(p[2]) for p in procs}
    bw, bh = 74, 34
    pos = {}
    for c, step in enumerate(lv):
        x = 40 + c * (W - 80 - bw) / max(1, len(lv) - 1)
        for r, i in enumerate(step):
            y = 30 + (r + 0.5) * (height - 70) / len(step) - bh / 2
            pos[i] = (x, y)
    on = set(zip(chain, chain[1:], strict=False))
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Граф зависимостей процессов">']
    for i, ds in deps.items():
        for j in ds:
            (x1, y1), (x2, y2) = pos[j], pos[i]
            hot = (j, i) in on
            color = ACCENT if hot else MUTED
            ax, ay = x1 + bw, y1 + bh / 2
            bx, by = x2, y2 + bh / 2
            out.append(
                f'<line x1="{ax:.1f}" y1="{ay:.1f}" x2="{bx - 7:.1f}" y2="{by:.1f}" stroke="{color}" stroke-width="{2.4 if hot else 1.3}"/>'
            )
            out.append(f'<circle cx="{bx - 5:.1f}" cy="{by:.1f}" r="3" fill="{color}"/>')
    for i, (x, y) in pos.items():
        hot = i in chain
        out.append(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw}" height="{bh}" rx="8" fill="#fff" '
            f'stroke="{ACCENT if hot else INK}" stroke-width="{2.4 if hot else 1.4}"/>'
        )
        out.append(_text(x + bw / 2, y + 22, f"{i} · {d[i]} мс", 14, INK, "middle", 600))
    for c in range(len(lv)):
        x = 40 + c * (W - 80 - bw) / max(1, len(lv) - 1)
        out.append(_text(x + bw / 2, height - 12, f"шаг {c + 1}", 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def _axis(out, x0, sx, y, horizon):
    out.append(f'<line x1="{x0}" y1="{y}" x2="{x0 + horizon * sx:.1f}" y2="{y}" stroke="{MUTED}"/>')
    step = 1 if horizon <= 16 else 2
    for k in range(0, horizon + 1, step):
        out.append(
            f'<line x1="{x0 + k * sx:.1f}" y1="{y}" x2="{x0 + k * sx:.1f}" y2="{y + 4}" stroke="{MUTED}"/>'
        )
        out.append(_text(x0 + k * sx, y + 18, str(k), 13, MUTED, "middle"))


def pr_gantt(procs, starts=None, chain=(), t=None, window=None, horizon=None, height=None) -> str:
    """Bars of every process on the common time axis.
    t — a moment (a vertical line); window — the n-th millisecond [n − 1; n)."""
    sched = schedule(procs, starts)
    horizon = horizon or max(f for _, f in sched.values())
    ids = [p[0] for p in procs]
    rh = 26
    height = height or 30 + rh * len(ids) + 40
    x0 = 60
    sx = (W - x0 - 30) / horizon
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Расписание процессов">']
    top = 14
    if window:
        n = window
        out.append(
            f'<rect x="{x0 + (n - 1) * sx:.1f}" y="{top}" width="{sx:.1f}" height="{rh * len(ids)}" fill="{WASH}"/>'
        )
    for r, i in enumerate(ids):
        s, f = sched[i]
        y = top + r * rh
        hot = i in chain
        out.append(_text(x0 - 10, y + 18, str(i), 14, INK, "end", 600))
        out.append(
            f'<rect x="{x0 + s * sx:.1f}" y="{y + 4}" width="{(f - s) * sx:.1f}" height="{rh - 8}" rx="4" '
            f'fill="{WASH if not hot else "#fff"}" stroke="{ACCENT if hot else INK}" stroke-width="{2.2 if hot else 1.2}"/>'
        )
        if (f - s) * sx > 46:
            out.append(_text(x0 + (s + f) / 2 * sx, y + 18, f"{s}–{f}", 13, INK, "middle"))
    if t is not None:
        x = x0 + t * sx
        out.append(
            f'<line x1="{x:.1f}" y1="{top - 6}" x2="{x:.1f}" y2="{top + rh * len(ids) + 4}" stroke="{ACCENT}" stroke-width="1.8" stroke-dasharray="5 4"/>'
        )
    _axis(out, x0, sx, top + rh * len(ids) + 6, horizon)
    out.append("</svg>")
    return "".join(out)


def pr_load(procs, starts=None, horizon=None, height: int = 150) -> str:
    """Number of processes working in every millisecond; the peak framed."""
    sched = schedule(procs, starts)
    horizon = horizon or max(f for _, f in sched.values())
    x0 = 60
    sx = (W - x0 - 30) / horizon
    counts = [len(active(sched, k)) for k in range(horizon)]
    peak = max(counts)
    unit = (height - 60) / max(1, peak)
    base = height - 40
    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Число работающих процессов">']
    for k, c in enumerate(counts):
        hot = c == peak
        h = c * unit
        out.append(
            f'<rect x="{x0 + k * sx + 1:.1f}" y="{base - h:.1f}" width="{sx - 2:.1f}" height="{h:.1f}" '
            f'fill="{WASH}" stroke="{ACCENT if hot else FAINT}" stroke-width="{2 if hot else 1}"/>'
        )
        out.append(
            _text(
                x0 + (k + 0.5) * sx, base - h - 6, str(c), 13, ACCENT if hot else INK, "middle", 600
            )
        )
    _axis(out, x0, sx, base, horizon)
    out.append(_text(x0 - 10, base - 6, "шт.", 13, MUTED, "end"))
    out.append("</svg>")
    return "".join(out)


def datasets() -> ModuleType:
    """topic-22/datasets.py, the generator of the workbooks."""
    if "topic22_datasets" in sys.modules:
        return sys.modules["topic22_datasets"]
    spec = importlib.util.spec_from_file_location("topic22_datasets", TOPIC / "datasets.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules["topic22_datasets"] = module  # dataclasses look the module up by name
    spec.loader.exec_module(module)
    return module


_previews = {"n": 0}


def pr_book(name: str) -> str:
    """A collapsed read-only mini-sheet with the table of ``files/<name>.xlsx``."""
    from sheetblock import block_html, parse_block

    ds = datasets()
    rows = ds.system(name).rows
    lines = ["|   | A | B | C", "| 1 | " + " | ".join(ds.HEAD)]
    for r, (i, d, deps) in enumerate(rows, start=2):
        lines.append(f"| {r} | {i} | {d} | {ds.deps_text(deps)}")
    block = parse_block("Процессы edit=none", "\n".join(lines))
    _previews["n"] += 1
    grid = block_html(block, f"book-{name}-{_previews['n']}")
    return (
        '<details class="proof book">'
        f"<summary>Книга из файла {html.escape(name)}.xlsx: {len(rows)} процессов</summary>{grid}</details>"
    )


PROCESS_FIGURES: dict = {
    "pr_dag": pr_dag,
    "pr_gantt": pr_gantt,
    "pr_load": pr_load,
    "pr_book": pr_book,
}
PROCESS_STEPPERS: dict = {}
PROCESS_WIDGETS: dict = {}
PROCESS_SCRIPTS: dict = {}
