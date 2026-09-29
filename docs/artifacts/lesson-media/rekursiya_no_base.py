"""Ролик «Без базы»: вопросы идут вниз и не находят известного значения.

То же правило и тот же ряд, что в ролике «С базой», но значения F(1) в определении нет.
"""

import random

from handdrawn import Scene, Text
from rekursiya_chain import ACCENT, H, W, add_node, phase_label, question_arc, x_of, R, Y

NAME = "rekursiya-no-base"
LESSON = "rekursiya"
KIND = "video"
QUESTION_STEP = 1.25


def build():
    rng = random.Random(23)
    scene = Scene(W, H, fade_start=0, duration=1)

    for i, n in enumerate(range(1, 6)):
        add_node(scene, rng, n, 0.15 * i)

    t = 1.6
    phase_label(scene, rng, "СПРАШИВАЕМ", 70, t)
    t += 0.8
    for n in range(5, 1, -1):
        question_arc(scene, rng, n, n - 1, t)
        t += QUESTION_STEP

    # F(1) не задано: вопрос идёт дальше, к F(0) и F(-1), и так без остановки
    x_zero = x_of(1) - 250
    question_arc(scene, rng, 1, 0, t)
    add_node(scene, rng, 0, t + 0.5, dashed=True)
    t += QUESTION_STEP
    from handdrawn import Ink, curve

    top = Y - R - 8
    scene.add(Ink(curve((x_zero, top), (x_zero - 100, top - 130), (28, top - 20), rng), t, 0.8, rng))
    scene.add(Text("НУЖНО\nF(-1)", (x_zero - 105, top - 118), 56, t + 0.5, 0.5, rng))
    t += QUESTION_STEP
    scene.add(Text("…", (60, Y + 20), 100, t - 0.4, 0.3, rng, color=ACCENT))
    scene.add(Text("БАЗЫ НЕТ — ВОПРОСЫ НИКОГДА НЕ КОНЧАТСЯ", (800, 660), 62, t, 1.2, rng, color=ACCENT))
    scene.fade_start = t + 3.2
    scene.duration = scene.fade_start + 0.5

    meta = {"alt": "цепочка вопросов F(5), F(4), F(3), F(2), F(1), F(0), F(-1) без базы не останавливается"}
    return scene, meta
