"""Рисунок «Дерево вызовов до и после кеша»: 9 вызовов против 5.

Дерево строится рекурсией (блок `blocks_tree`), повторы и число настоящих вызовов считает код.
Слева оранжевым выделены вызовы, повторяющие уже найденное; справа они заменены ответом из кеша.
"""

import math

from blocks_tree import expand, flatten, layout
from handdrawn import ACCENT, SS, Scene, arrow_head, circle, dashed_ellipse, line, underline

NAME = "rekursiya-cache-before-after"
LESSON = "rekursiya"
KIND = "still"
W, H = 1600, 800
TOP = 5
R = 46
X_LEFT, X_RIGHT = (110, 690), (910, 1490)


def repeats(calls):
    """Вызовы, которые повторяют уже вычисленное значение (порядок вызовов — обход в глубину)."""
    seen, out = set(), set()
    for v in calls:
        if v["n"] in seen:
            out.add(id(v))
        seen.add(v["n"])
    return out


def edge(scene, parent, child, key, dashed=False, color=None):
    ang = math.atan2(child["y"] - parent["y"], child["x"] - parent["x"])
    a = (parent["x"] + R * math.cos(ang), parent["y"] + R * math.sin(ang))
    b = (child["x"] - (R + 8) * math.cos(ang), child["y"] - (R + 8) * math.sin(ang))
    scene.shape(line, a, b, key=f"{key}:l", color=color, width=(4 * SS if dashed else None))
    scene.shape(_head, b, ang, key=f"{key}:h", color=color)


def _head(tip, angle, rng):
    return arrow_head(tip, angle, rng)


def node(scene, v, key, cached=False, wasted=False):
    color = ACCENT if (cached or wasted) else None
    if cached:
        scene.shape(dashed_ellipse, (v["x"], v["y"]), R, R, key=f"{key}:c", color=color, width=5 * SS)
    else:
        scene.shape(circle, (v["x"], v["y"]), R, key=f"{key}:c", color=color)
    scene.label(f"F({v['n']})", (v["x"], v["y"] + 3), 54, key=f"{key}:t", color=color)


def build():
    scene = Scene(W, H, fade_start=1, duration=1.5, seed=57)

    left = expand(TOP)
    calls_left = flatten(left)
    layout(left, *X_LEFT, top=190, step=145)
    wasted = repeats(calls_left)
    total, distinct = len(calls_left), len(calls_left) - len(wasted)
    assert (total, distinct) == (9, 5), "должно совпасть с деревом вызовов в уроке"

    right = expand(TOP)
    calls_right = flatten(right)
    layout(right, *X_RIGHT, top=190, step=145)
    repeat_right = repeats(calls_right)

    # заголовки и разделитель
    scene.label(f"БЕЗ КЕША: {total} ВЫЗОВОВ", (60, 60), 62, key="h-l", anchor="l")
    scene.shape(underline, 60, 640, 98, key="u-l", width=4 * SS)
    scene.label(f"С КЕШЕМ: {distinct} ВЫЗОВОВ", (860, 60), 62, key="h-r", anchor="l")
    scene.shape(underline, 860, 1400, 98, key="u-r", width=4 * SS)
    scene.shape(line, (800, 130), (800, 720), key="split", width=4 * SS)

    # слева: все вызовы, повторы оранжевые
    for i, v in enumerate(calls_left):
        if "parent" in v:
            edge(scene, v["parent"], v, f"le{i}", color=ACCENT if id(v) in wasted else None)
        node(scene, v, f"ln{i}", wasted=id(v) in wasted)

    # справа: настоящие вызовы; повтор с настоящим родителем заменён ответом из кеша
    for i, v in enumerate(calls_right):
        if id(v) in repeat_right:
            parent = v["parent"]
            if id(parent) in repeat_right:
                continue  # внутри кешированного поддерева вызовов нет
            edge(scene, parent, v, f"re{i}", dashed=True, color=ACCENT)
            node(scene, v, f"rn{i}", cached=True)
            scene.label("ИЗ КЕША", (v["x"], v["y"] + R + 42), 48, key=f"rc{i}", color=ACCENT)
            continue
        if "parent" in v:
            edge(scene, v["parent"], v, f"re{i}")
        node(scene, v, f"rn{i}")

    scene.label(f"ОРАНЖЕВЫЕ — ПОВТОРЫ: {len(wasted)}", (60, 745), 52, key="cap-l", anchor="l", color=ACCENT)
    scene.label("ПУНКТИР — ИЗ КЕША", (860, 745), 52, key="cap-r", anchor="l", color=ACCENT)
    return scene, {
        "alt": "Два дерева вызовов F(5): без кеша 9 вызовов, из них 4 повторяют найденное; с кешем 5 вызовов, повторы заменены ответом из кеша",
        "calls": {"without_cache": total, "with_cache": distinct, "repeats": len(wasted)},
    }
