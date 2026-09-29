"""Общие детали роликов про цепочку значений F(1) … F(5): ряд кругов, дуги вопросов и ответов.

Вопросы идут дугами над рядом справа налево («чтобы найти F(5), нужно F(4)»), ответы —
дугами под рядом слева направо. Сцены «с базой» и «без базы» собираются из этих деталей.
"""

import math

from handdrawn import ACCENT, INK, SS, Ink, Text, arrow_head, circle, curve, dashed_ellipse, underline, line

W, H = 1600, 740
R = 64
Y = 380  # центры кругов
VALUE_Y = Y + 116  # подпись «= значение» под кругом
LABEL_X = 60


def x_of(n):
    """F(1) слева, F(5) справа; шаг 250, слева остаётся место под F(0) и «…»."""
    return 480 + 250 * (n - 1)


def add_node(scene, rng, n, t0, dashed=False, value="?"):
    """Круг с подписью F(n) и неизвестным значением под ним. Возвращает элементы."""
    x = x_of(n)
    if dashed:
        ring = Ink(dashed_ellipse((x, Y), R, R, rng), t0, 0.4, rng, width=5 * SS)
    else:
        ring = Ink(circle((x, Y), R, rng), t0, 0.3, rng)
    label = Text(f"F({n})", (x, Y + 4), 74, t0 + 0.2, 0.2, rng)
    unknown = Text(f"= {value}", (x, VALUE_Y), 66, t0 + 0.4, 0.25, rng)
    for e in (ring, label, unknown):
        scene.add(e)
    return ring, label, unknown


def question_arc(scene, rng, n_from, n_to, t0, label=None):
    """Дуга над рядом от F(n_from) к F(n_to) с подписью «нужно F(n_to)»."""
    x0, x1 = x_of(n_from), x_of(n_to)
    top = Y - R - 8
    mid = (x0 + x1) / 2
    arc = Ink(curve((x0, top), (mid, top - 130), (x1, top - 6), rng), t0, 0.8, rng)
    text = Text(label or f"НУЖНО\nF({n_to})", (mid, top - 118), 56, t0 + 0.5, 0.5, rng)
    scene.add(arc)
    scene.add(text)
    return arc, text


def answer_arc(scene, rng, n_from, n_to, t0, label):
    """Дуга под рядом от значения F(n_from) к значению F(n_to)."""
    x0, x1 = x_of(n_from), x_of(n_to)
    bottom = VALUE_Y + 44
    mid = (x0 + x1) / 2
    arc = Ink(curve((x0, bottom), (mid, bottom + 130), (x1, bottom + 6), rng), t0, 0.7, rng)
    text = Text(label, (mid, bottom + 100), 60, t0 + 0.35, 0.4, rng)
    scene.add(arc)
    scene.add(text)
    return arc, text


def phase_label(scene, rng, text, y, t0):
    scene.add(Text(text, (LABEL_X, y), 66, t0, 0.6, rng, anchor="l"))
    scene.add(Ink(underline(LABEL_X, LABEL_X + len(text) * 36, y + 34, rng), t0 + 0.4, 0.3, rng, width=4 * SS))


def stop_note(scene, rng, t0):
    """Оранжевая пометка «это дано!» со стрелкой к F(1)."""
    scene.add(Text("ЭТО ДАНО!", (235, Y), 64, t0, 0.6, rng, color=ACCENT))
    scene.add(Ink(_short_arrow((350, Y), (x_of(1) - R - 10, Y), rng), t0 + 0.5, 0.3, rng, color=ACCENT))


def _short_arrow(a, b, rng):
    strokes = line(a, b, rng)
    strokes += arrow_head(b, math.atan2(b[1] - a[1], b[0] - a[0]), rng)
    return strokes


__all__ = ["W", "H", "add_node", "question_arc", "answer_arc", "phase_label", "stop_note", "x_of", "INK", "ACCENT", "Y", "VALUE_Y", "R"]
