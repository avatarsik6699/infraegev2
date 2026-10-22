"""Figures of topic 22 «Многопроцессорные системы» (registered in figures.FIGURES).

A system of the lesson is given as rows ``(id, duration, suppliers)``; the early
schedule (start = max of the suppliers' finishes, finish = start + duration) is
computed here, so every cell, every start and finish and every count of working
processes in a figure comes from the same calculation as the lesson's table.
A shifted schedule passes its own ``starts``.

Time is drawn as numbered milliseconds, the way a sheet colours its cells: the
n-th millisecond runs from moment n − 1 to moment n, and a process with start s
and finish f occupies the milliseconds s + 1 … f.

``pr_dag(procs, chain)`` — the dependency graph by calculation steps.
``pr_cells(procs, starts, ms, chain, counts, ghost)`` — the schedule as a grid of
milliseconds: one row per process, a framed column for the n-th millisecond,
a row with the number of working processes, early places of shifted processes.
``pr_cells_stepper(procs)`` — the same grid filled process by process in the
order of calculation, each frame with its start and finish.
"""

from __future__ import annotations

from figures import ACCENT, FAINT, INK, MUTED, WASH, _arrow, _stepper, _text

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


def pr_dag(procs, chain=(), height: int = 300) -> str:
    """Boxes «ID · d мс» by calculation steps, arrows from supplier to receiver."""
    lv = levels(procs)
    d = {p[0]: p[1] for p in procs}
    deps = {p[0]: tuple(p[2]) for p in procs}
    bw, bh = 84, 34
    pos = {}
    for c, step in enumerate(lv):
        x = 30 + c * (W - 60 - bw) / max(1, len(lv) - 1)
        for r, i in enumerate(step):
            y = 24 + (r + 0.5) * (height - 64) / len(step) - bh / 2
            pos[i] = (x, y)
    on = set(zip(chain, chain[1:], strict=False))
    takers = {i: [k for k in deps if i in deps[k]] for i in deps}

    def spread(n: int, k: int) -> float:
        """The k-th of n points along an edge, top to bottom."""
        return bh / 2 if n == 1 else 9 + k * (bh - 18) / (n - 1)

    out = [f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Граф зависимостей процессов">']
    for i, ds in deps.items():
        into = sorted(ds, key=lambda j: pos[j][1])
        for j in ds:
            (x1, y1), (x2, y2) = pos[j], pos[i]
            outs = sorted(takers[j], key=lambda k: pos[k][1])
            hot = (j, i) in on
            out.append(
                _arrow(
                    x1 + bw,
                    y1 + spread(len(outs), outs.index(i)),
                    x2 - 2,
                    y2 + spread(len(into), into.index(j)),
                    ACCENT if hot else MUTED,
                    width=2 if hot else 1.25,
                )
            )
    for i, (x, y) in pos.items():
        hot = i in chain
        out.append(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw}" height="{bh}" rx="8" fill="#fff" '
            f'stroke="{ACCENT if hot else INK}" stroke-width="{2.2 if hot else 1.3}"/>'
        )
        out.append(_text(x + bw / 2, y + 22, f"{i} · {d[i]} мс", 14, INK, "middle", 600))
    for c in range(len(lv)):
        x = 30 + c * (W - 60 - bw) / max(1, len(lv) - 1)
        out.append(_text(x + bw / 2, height - 12, f"шаг {c + 1}", 13, MUTED, "middle"))
    out.append("</svg>")
    return "".join(out)


def _grid(
    procs,
    sched,
    shown,
    horizon,
    ms=None,
    chain=(),
    counts=False,
    early=None,
    current=None,
    peak=False,
    ready=None,
):
    """The grid of milliseconds: rows of ``shown`` processes, the others empty."""
    ids = [p[0] for p in procs]
    x0, right = 48, 70
    cw = (W - x0 - right) / horizon
    rh = 26
    top = 34
    rows = len(ids) + (1 if counts else 0)
    out = [_text(x0 - 10, top - 10, "мс", 12, MUTED, "end")]
    step = 1 if horizon <= 20 else 5
    for n in range(1, horizon + 1):
        if n % step == 0 or n == 1:
            out.append(_text(x0 + (n - 0.5) * cw, top - 10, str(n), 12, MUTED, "middle"))
    for r, i in enumerate(ids):
        y = top + r * rh
        on = i in shown
        hot = i in chain
        out.append(_text(x0 - 10, y + 17, str(i), 14, ACCENT if i == current else INK, "end", 600))
        s, f = sched[i]
        for n in range(1, horizon + 1):
            x = x0 + (n - 1) * cw
            busy = on and s < n <= f
            if busy:
                stroke, width = (ACCENT, 1.6) if hot else (INK, 1)
                fill = WASH
                out.append(
                    f'<rect x="{x + 1:.1f}" y="{y + 2}" width="{cw - 2:.1f}" height="{rh - 4}" '
                    f'rx="3" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>'
                )
            else:
                was = early and on and early[i][0] < n <= early[i][1]
                out.append(
                    f'<rect x="{x + 1:.1f}" y="{y + 2}" width="{cw - 2:.1f}" height="{rh - 4}" '
                    f'rx="3" fill="#fff" stroke="{MUTED if was else FAINT}" '
                    f'stroke-width="1"{' stroke-dasharray="3 3"' if was else ""}/>'
                )
        if on:
            out.append(_text(W - right + 10, y + 17, f"{s} → {f}", 13, MUTED))
    if counts:
        y = top + len(ids) * rh
        totals = [
            sum(1 for i in shown if sched[i][0] < n <= sched[i][1]) for n in range(1, horizon + 1)
        ]
        top_count = max(totals) if peak else None
        out.append(_text(x0 - 10, y + 17, "всего", 12, MUTED, "end"))
        for n, c in enumerate(totals, 1):
            out.append(
                _text(
                    x0 + (n - 0.5) * cw,
                    y + 17,
                    str(c),
                    13,
                    ACCENT if c == top_count else INK,
                    "middle",
                    700 if c == top_count else 400,
                )
            )
    if ready is not None:
        # the moment the last supplier is done: the current process starts here
        x = x0 + ready * cw
        y2 = top + (ids.index(current) + 1) * rh
        out.append(
            f'<line x1="{x:.1f}" y1="{top - 4}" x2="{x:.1f}" y2="{y2:.1f}" stroke="{ACCENT}" '
            f'stroke-width="1.5" stroke-dasharray="4 3"/>'
        )
    if ms:
        x = x0 + (ms - 1) * cw
        out.append(
            f'<rect x="{x - 1:.1f}" y="{top - 26}" width="{cw + 2:.1f}" height="{len(ids) * rh + 28}" '
            f'rx="4" fill="none" stroke="{ACCENT}" stroke-width="2"/>'
        )
        k = sum(1 for i in shown if sched[i][0] < ms <= sched[i][1])
        out.append(
            _text(x + cw / 2, top + rows * rh + 20, f"{ms}-я мс: {k}", 13, ACCENT, "middle", 600)
        )
    height = top + rows * rh + (34 if ms else 10)
    return (
        f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="Расписание процессов по миллисекундам">'
        + "".join(out)
        + "</svg>"
    )


def pr_cells(
    procs, starts=None, ms=None, chain=(), counts=False, ghost=False, horizon=None, peak=False
) -> str:
    """The schedule as a grid of numbered milliseconds; ``peak`` marks the largest count."""
    sched = schedule(procs, starts)
    horizon = horizon or max(f for _, f in sched.values())
    early = schedule(procs) if ghost else None
    return _grid(procs, sched, set(sched), horizon, ms, chain, counts, early, peak=peak)


def pr_cells_frames(procs) -> list[tuple[str, str]]:
    sched = schedule(procs)
    horizon = max(f for _, f in sched.values())
    deps = {p[0]: tuple(p[2]) for p in procs}
    d = {p[0]: p[1] for p in procs}
    order = [i for step in levels(procs) for i in step]
    frames = [
        (
            _grid(procs, sched, set(), horizon),
            "Начинаем с пустой сетки: строка — процесс, столбец — миллисекунда.",
        )
    ]
    shown: set[int] = set()
    for i in order:
        shown.add(i)
        s, f = sched[i]
        if f == s + 1:
            cells = f"{f}-ю мс"
        elif f == s + 2:
            cells = f"{s + 1}-ю и {f}-ю мс"
        else:
            cells = f"мс с {s + 1}-й по {f}-ю"
        if not deps[i]:
            text = f"Процесс {i} ни от кого не зависит: начинает сразу, в 0, и заканчивает в {f}."
        elif len(deps[i]) == 1:
            j = deps[i][0]
            text = f"Процесс {i} ждёт процесс {j}, а тот готов к {s}. Окончание {s} + {d[i]} = {f}."
        else:
            *head, last = deps[i]
            names = ", ".join(map(str, head)) + f" и {last}"
            ready = ", ".join(
                f"{j} готов к {sched[j][1]}" if n == 0 else f"{j} — к {sched[j][1]}"
                for n, j in enumerate(deps[i])
            )
            text = (
                f"Процесс {i} ждёт процессы {names}: {ready}. Начинает по последнему — "
                f"в {s}. Окончание {s} + {d[i]} = {f}."
            )
        text += f" Занимает {cells}."
        line = s if deps[i] else None
        frames.append(
            (_grid(procs, sched, set(shown), horizon, chain=(i,), current=i, ready=line), text)
        )
    frames[-1] = (
        frames[-1][0],
        frames[-1][1] + f" Все процессы закончились к {horizon} мс.",
    )
    return frames


def pr_cells_stepper(procs) -> str:
    return _stepper(pr_cells_frames(procs))


PROCESS_FIGURES: dict = {
    "pr_dag": pr_dag,
    "pr_cells": pr_cells,
    "pr_cells_stepper": pr_cells_stepper,
}
PROCESS_STEPPERS: dict = {"pr_cells_stepper": pr_cells_frames}
PROCESS_WIDGETS: dict = {}
PROCESS_SCRIPTS: dict = {}
