"""Ролик «Заполняем таблицу F и G»: две связанные функции, перекрёстные зависимости.

Правило из раздела «Две связанные функции F и G»: F(n) = G(n) = 1 и 2 при n ≤ 2, а при n > 2
F(n) = F(n - 1) + G(n - 2), G(n) = G(n - 1) + F(n - 1). Таблицу считает код и сверяет с примером
раздела (F(8) = 44, F(10) = 135).
"""

import random

from handdrawn import ACCENT, SS, Scene, Text
from handdrawn import Ink, arrow_head, box, curve, dashed_ellipse, line, underline

NAME = "rekursiya-two-functions"
LESSON = "rekursiya"
KIND = "video"
TOP_N = 8
W, H = 1500, 940
TABLE_X = (680, 800, 1040, 1280)  # границы столбцов n, F, G
HEADER_Y, ROW_H = 130, 84
STEP_SLOW, STEP_FAST = 2.3, 1.6


def tables(top):
    """F и G по правилу раздела: словари n -> значение."""
    f, g = {1: 1, 2: 1}, {1: 2, 2: 2}
    for n in range(3, top + 1):
        f[n] = f[n - 1] + g[n - 2]
        g[n] = g[n - 1] + f[n - 1]
    return f, g


def cell(col, n):
    """Центр ячейки: столбец 'n', 'F' или 'G' и номер строки."""
    x = {"n": 740, "F": 920, "G": 1160}[col]
    return x, HEADER_Y + ROW_H + ROW_H * (n - 1) + ROW_H / 2


def build():
    f, g = tables(TOP_N)
    assert (f[8], g[8]) == (44, 58), "должно совпасть с таблицей примера раздела"
    f10 = tables(10)[0][10]
    assert f10 == 135, "print(F(10)) в примере раздела даёт 135"
    rng = random.Random(53)
    scene = Scene(W, H, fade_start=0, duration=1)
    bottom = HEADER_Y + ROW_H * (TOP_N + 1)

    # таблица: рамка, столбцы, строки, заголовки
    scene.add(Ink(box(TABLE_X[0], HEADER_Y, TABLE_X[3], bottom, rng), 0.0, 0.9, rng))
    for i, x in enumerate(TABLE_X[1:3]):
        scene.add(Ink(line((x, HEADER_Y), (x, bottom), rng), 0.3 + 0.1 * i, 0.5, rng, width=4 * SS))
    for k in range(TOP_N):
        y = HEADER_Y + ROW_H * (k + 1)
        scene.add(Ink(line((TABLE_X[0], y), (TABLE_X[3], y), rng), 0.4 + 0.05 * k, 0.4, rng, width=4 * SS))
    for name, x in (("n", 740), ("F(n)", 920), ("G(n)", 1160)):
        scene.add(Text(name, (x, HEADER_Y + ROW_H / 2 + 2), 60, 0.8, 0.3, rng))
    for n in range(1, TOP_N + 1):
        scene.add(Text(str(n), (*cell("n", n),), 58, 1.0 + 0.05 * n, 0.2, rng))

    # правила слева
    scene.add(Text("F(n) = F(n-1) + G(n-2)", (40, 130), 50, 0.5, 1.0, rng, anchor="l"))
    scene.add(Text("G(n) = G(n-1) + F(n-1)", (40, 200), 50, 1.2, 1.0, rng, anchor="l"))
    scene.add(Text("ПРИ n ≤ 2: F = 1, G = 2", (40, 285), 50, 2.4, 1.0, rng, anchor="l", color=ACCENT))

    # базовые строки: даны
    t = 3.6
    for n in (1, 2):
        for col, table in (("F", f), ("G", g)):
            scene.add(Text(str(table[n]), cell(col, n), 62, t, 0.3, rng, color=ACCENT))
            t += 0.25
    t += 0.8

    # строки 3…8: для каждой ячейки источники, стрелки, вычисление, значение
    for n in range(3, TOP_N + 1):
        step = STEP_SLOW if n <= 4 else STEP_FAST
        for col in ("F", "G"):
            if col == "F":
                sources = [("F", n - 1), ("G", n - 2)]
                left, right = f[n - 1], g[n - 2]
                line1 = f"F({n}) = F({n - 1}) + G({n - 2})"
                cross = ("G", n - 2)
            else:
                sources = [("G", n - 1), ("F", n - 1)]
                left, right = g[n - 1], f[n - 1]
                line1 = f"G({n}) = G({n - 1}) + F({n - 1})"
                cross = ("F", n - 1)
            value = f[n] if col == "F" else g[n]
            assert left + right == value
            gone = t + step - 0.2  # подсветка и вычисление исчезают в конце шага
            hint = []
            for c, m in sources:
                cx, cy = cell(c, m)
                ring = Ink(dashed_ellipse((cx, cy), 84, 28, rng), t, 0.3, rng, color=ACCENT, width=5 * SS)
                hint.append(scene.add(ring))
            # перекрёстная стрелка от «чужого» столбца к новой ячейке
            (sx, sy), (tx, ty) = cell(*cross), cell(col, n)
            if col == "F":
                p0, p1, p2 = (sx - 70, sy + 30), (sx - 60, (sy + ty) / 2 + 40), (tx + 96, ty - 14)
            else:
                p0, p1, p2 = (sx + 60, sy + 30), (sx + 90, (sy + ty) / 2 + 30), (tx - 100, ty - 14)
            hint.append(scene.add(Ink(curve(p0, p1, p2, rng), t + 0.3, 0.6, rng, color=ACCENT)))
            hint.append(scene.add(Text(line1, (40, 470), 58, t + 0.4, 0.6, rng, anchor="l")))
            hint.append(scene.add(Text(f"= {left} + {right} = {value}", (40, 545), 62, t + 1.0, 0.5, rng, anchor="l", color=ACCENT)))
            for element in hint:
                element.vanish_at = gone
            scene.add(Text(str(value), cell(col, n), 62, t + 1.1, 0.3, rng))
            t += step
    # итог: F(8)
    tx, ty = cell("F", TOP_N)
    scene.add(Ink(dashed_ellipse((tx, ty), 90, 32, rng), t, 0.5, rng, color=ACCENT, width=6 * SS))
    scene.add(Text(f"F({TOP_N}) = {f[TOP_N]}", (40, 470), 72, t + 0.2, 0.6, rng, anchor="l", color=ACCENT))
    scene.fade_start = t + 3.0
    scene.duration = scene.fade_start + 0.5
    return scene, {
        "alt": "Таблица значений F и G для n от 1 до 8: каждая ячейка считается по двум уже найденным, перекрёстно, в итоге F(8) = 44",
        "F": f,
        "G": g,
    }
