"""Рисунок «Против стрелок зависимости»: рекурсия вверх и порядок прогрева кеша.

Правило из раздела «Рекурсия вверх и прогрев кеша»: F(n) = F(n + 4) + 2 при n < 4200 и F(n) = 7 при
n ≥ 4200. Стрелки зависимости идут вправо, а прогревать кеш нужно справа налево, от базы.
Длину цепочки от F(100) считает код.
"""

import math

from handdrawn import ACCENT, SS, Scene, arrow, box, curve, number_line, underline

NAME = "rekursiya-warmup-direction"
LESSON = "rekursiya"
KIND = "still"
W, H = 1300, 760
STEP, BASE, START, LIMIT = 4, 4200, 100, 1000
AXIS_Y, BOX_W, BOX_H = 400, 150, 92


def chain_length(start=START, step=STEP, base=BASE):
    """Сколько раз нужно шагнуть от start вверх, чтобы дойти до базы."""
    return math.ceil((base - start) / step)


def build():
    steps = chain_length()
    assert steps == 1025 and steps > LIMIT, "цепочка длиннее лимита рекурсии 1000, как в уроке"
    scene = Scene(W, H, fade_start=1, duration=1.5, seed=63)

    # правило вверху
    scene.label("F(n) = F(n + 4) + 2 ПРИ n < 4200", (60, 60), 64, key="rule", anchor="l")
    scene.shape(underline, 60, 1070, 98, key="u-rule", width=4 * SS)

    # ось n и точки 100, 104, 108 … 4192, 4196, 4200
    points = [(100, 150), (104, 330), (108, 510), (4192, 800), (4196, 980), (4200, 1160)]
    ticks = [x for _, x in points]
    scene.shape(number_line, 50, 1260, AXIS_Y, ticks, key="axis")
    scene.label("n", (1265, AXIS_Y + 52), 60, key="axis-n")
    scene.label("…", (655, AXIS_Y - 40), 90, key="dots")
    top = AXIS_Y - BOX_H - 12
    for i, (n, x) in enumerate(points):
        base = n >= BASE
        color = ACCENT if base else None
        scene.shape(box, x - BOX_W / 2, top, x + BOX_W / 2, top + BOX_H, key=f"bx{i}", color=color)
        scene.label(str(n), (x, top + BOX_H / 2 + 4), 58, key=f"bn{i}", color=color)

    # стрелки зависимости вправо: от n к n + 4
    arcs = [(0, 1), (1, 2), (3, 4), (4, 5)]
    for i, (a, b) in enumerate(arcs):
        x0, x1 = points[a][1], points[b][1]
        mid = (x0 + x1) / 2
        scene.shape(curve, (x0 + 30, top - 6), (mid, top - 120), (x1 - 30, top - 8), key=f"dep{i}")
    scene.label("НУЖНО F(n + 4)", (270, top - 110), 54, key="dep-label")
    scene.label("БАЗА: n ≥ 4200", (1060, top - 110), 54, key="dep-label2", color=ACCENT)

    # порядок прогрева: справа налево, против стрелок
    scene.shape(arrow, (points[-1][1], AXIS_Y + 120), (points[0][1], AXIS_Y + 120), key="warm", color=ACCENT, width=8 * SS)
    scene.label("ПРОГРЕВАЕМ КЕШ: 4200, 4196, …, 104, 100", (650, AXIS_Y + 178), 56, key="warm-label", color=ACCENT)
    scene.label(f"ОТ F(100) ДО БАЗЫ {steps} ШАГОВ,\nА ЛИМИТ РЕКУРСИИ {LIMIT}", (650, AXIS_Y + 285), 54, key="steps")
    return scene, {
        "alt": "Числовая ось n со стрелками зависимости вправо от n к n + 4 и порядком прогрева кеша справа налево от базы n ≥ 4200 до F(100)",
        "chain": {"steps": steps, "limit": LIMIT},
    }
