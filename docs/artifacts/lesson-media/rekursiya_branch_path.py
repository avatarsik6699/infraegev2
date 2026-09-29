"""Ролик «Путь по развилке для F(21)»: вопросы спускаются с выбором ветви, ответы поднимаются.

Правило из раздела «Разные правила для чётных и нечётных»: F(1) = 1; F(n) = F(n/2) + 3 при чётном n и
F(n) = F(n - 1) + 1 при нечётном n. Путь и значения считает код и сверяет с примером раздела (F(21) = 15).
"""

import random

from blocks_chain import Chain
from handdrawn import ACCENT, Scene, Text
from handdrawn import SS, Ink, underline

NAME = "rekursiya-branch-path"
LESSON = "rekursiya"
KIND = "video"
TARGET = 21
W, H = 1780, 880
Y, R = 470, 72
QUESTION_STEP, ANSWER_STEP = 1.25, 1.4


def step_down(n):
    """Куда ведёт правило: чётное делится пополам, нечётное уменьшается на 1."""
    return n // 2 if n % 2 == 0 else n - 1


def path_from(n):
    nodes = [n]
    while nodes[-1] != 1:
        nodes.append(step_down(nodes[-1]))
    return nodes  # от большого к базе


def increments(nodes):
    """Добавка на подъёме: +3 для чётного n, +1 для нечётного."""
    return {n: (3 if n % 2 == 0 else 1) for n in nodes if n != 1}


def build():
    down = path_from(TARGET)  # 21, 20, 10, 5, 4, 2, 1
    add = increments(down)
    values = {1: 1}
    for n in reversed(down[:-1]):
        values[n] = values[step_down(n)] + add[n]
    assert down == [21, 20, 10, 5, 4, 2, 1], "путь должен совпасть с примером раздела"
    assert values[TARGET] == 15 and [values[n] for n in sorted(values)] == [1, 4, 7, 8, 11, 14, 15]

    up = sorted(down)  # слева база, справа F(21)
    xs = {n: 400 + 205 * i for i, n in enumerate(up)}
    chain = Chain(xs.get, y=Y, r=R, value_dy=120, label_x=40, label_size=58, value_size=62)
    rng = random.Random(29)
    scene = Scene(W, H, fade_start=0, duration=1)

    # легенда с двумя ветвями
    scene.add(Text("ЧЁТ: F(n) = F(n/2) + 3", (60, 55), 56, 0.1, 0.8, rng, anchor="l"))
    scene.add(Text("НЕЧЁТ: F(n) = F(n-1) + 1", (60, 120), 56, 0.5, 0.8, rng, anchor="l"))

    unknown = {}
    nodes = {}
    for i, n in enumerate(up):
        ring, label, unk = chain.add_node(scene, rng, n, 0.15 * i)
        unknown[n], nodes[n] = unk, (ring, label)

    # 1. вопросы идут вниз, ветвь выбирается по чётности
    t = 1.8
    chain.phase_label(scene, rng, "СПРАШИВАЕМ", 250, t)
    t += 0.8
    for a, b in zip(down, down[1:]):
        name = "ЧЁТ" if a % 2 == 0 else "НЕЧЁТ"
        rule = "n/2" if a % 2 == 0 else "n-1"
        chain.question_arc(scene, rng, a, b, t, label=f"{name}\n{rule}")
        t += QUESTION_STEP
    t_base = t + 0.1
    unknown[1].vanish_at = t_base
    for part in nodes[1]:
        part.accent_at = t_base
    scene.add(Text("= 1", (xs[1], chain.value_y), 62, t_base, 0.35, rng, color=ACCENT))
    chain.stop_note(scene, rng, t_base + 0.2, 1, text="ЭТО\nДАНО!", left=150, size=60, arrow_from=225)

    # 2. ответы поднимаются вверх с добавками +3 и +1
    t = t_base + 1.8
    chain.phase_label(scene, rng, "ОТВЕЧАЕМ", 780, t)
    t += 0.8
    for b, a in zip(reversed(down[1:]), reversed(down[:-1])):
        chain.answer_arc(scene, rng, b, a, t, f"+{add[a]}")
        unknown[a].vanish_at = t + 0.9
        scene.add(Text(f"= {values[a]}", (xs[a], chain.value_y), 62, t + 0.9, 0.4, rng))
        t += ANSWER_STEP
    scene.fade_start = t + 1.8
    scene.duration = scene.fade_start + 0.5
    return scene, {
        "alt": "Путь по развилке для F(21): вопросы идут 21, 20, 10, 5, 4, 2, 1 с выбором ветви по чётности, ответы поднимаются 1, 4, 7, 8, 11, 14, 15",
        "path": down,
        "values": {f"F({n})": v for n, v in sorted(values.items())},
    }
