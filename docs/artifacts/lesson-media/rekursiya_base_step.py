"""Ролик «С базой»: вопросы идут вниз до известного значения, ответы поднимаются вверх.

Правило из первого примера урока: F(1) = 1, F(n) = 2·F(n − 1) + 1. Значения считает код.
"""

import random

from handdrawn import Scene
from rekursiya_chain import ACCENT, H, W, add_node, answer_arc, phase_label, question_arc, stop_note, x_of, Y, VALUE_Y

NAME = "rekursiya-base-step"
LESSON = "rekursiya"
KIND = "video"
QUESTION_STEP = 1.25
ANSWER_STEP = 1.4


def values(count):
    f = {1: 1}
    for n in range(2, count + 1):
        f[n] = 2 * f[n - 1] + 1
    return f


def build():
    from handdrawn import Text

    rng = random.Random(11)
    f = values(5)
    assert f[5] == 31, "должно совпасть с первым примером урока"
    scene = Scene(W, H, fade_start=0, duration=1)

    unknown, nodes = {}, {}
    for i, n in enumerate(range(1, 6)):
        ring, label, unk = add_node(scene, rng, n, 0.15 * i)
        unknown[n], nodes[n] = unk, (ring, label)

    # 1. вопросы идут вниз до известного значения
    t = 1.6
    phase_label(scene, rng, "СПРАШИВАЕМ", 70, t)
    t += 0.8
    for n in range(5, 1, -1):
        question_arc(scene, rng, n, n - 1, t)
        t += QUESTION_STEP
    t_base = t + 0.1
    # F(1) известно: круг становится оранжевым, «= ?» заменяется значением
    unknown[1].vanish_at = t_base
    for part in nodes[1]:
        part.accent_at = t_base
    scene.add(Text("= 1", (x_of(1), VALUE_Y), 66, t_base, 0.35, rng, color=ACCENT))
    stop_note(scene, rng, t_base + 0.2)

    # 2. ответы поднимаются вверх
    t = t_base + 1.8
    phase_label(scene, rng, "ОТВЕЧАЕМ", 660, t)
    t += 0.8
    for n in range(2, 6):
        answer_arc(scene, rng, n - 1, n, t, "·2+1")
        unknown[n].vanish_at = t + 0.9
        scene.add(Text(f"= {f[n]}", (x_of(n), VALUE_Y), 66, t + 0.9, 0.4, rng))
        t += ANSWER_STEP
    scene.fade_start = t + 1.6
    scene.duration = scene.fade_start + 0.5

    meta = {
        "alt": "цепочка F(5) … F(1): вопросы идут вниз до известного F(1) = 1, ответы поднимаются вверх",
        "values": {f"F({n})": v for n, v in f.items()},
    }
    return scene, meta

