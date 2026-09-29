"""Ролик «Дерево вызовов F(5)»: F(3) вычисляется дважды.

Дерево строится настоящей рекурсией, повторы считаются, а не рисуются по памяти. Те же числа
стоят в тексте урока «Рекурсия» (подраздел repeated-work-motivates-storage).
"""

import math
import random
from collections import Counter

from handdrawn import (
    ACCENT,
    INK,
    Ink,
    Scene,
    Text,
    circle,
    curve,
    dashed_ellipse,
    line,
    arrow_head,
    SS,
)

NAME = "rekursiya-call-tree"
LESSON = "rekursiya"
KIND = "video"
TOP = 5
NODE_R = 56
STEP = 0.3  # секунд на один вызов


def expand(n):
    """Вызовы F(n) при F(1) = F(2) = 1 и F(n) = F(n-1) + F(n-2)."""
    return {"n": n, "kids": [] if n <= 2 else [expand(n - 1), expand(n - 2)]}


def flatten(node, depth=0, out=None):
    """Вершины в порядке вызова (обход в глубину), у каждой — глубина и родитель."""
    out = [] if out is None else out
    node["depth"] = depth
    out.append(node)
    for kid in node["kids"]:
        kid["parent"] = node
        flatten(kid, depth + 1, out)
    return out


def subtree(node):
    yield node
    for kid in node["kids"]:
        yield from subtree(kid)


def layout(root):
    """Листья равномерно слева направо, внутренние вершины над серединой детей."""
    leaves = [v for v in flatten_in_order(root) if not v["kids"]]
    x0, x1 = 220, 1380
    for i, leaf in enumerate(leaves):
        leaf["x"] = x0 + (x1 - x0) * i / (len(leaves) - 1)

    def place(node):
        for kid in node["kids"]:
            place(kid)
        if node["kids"]:
            node["x"] = sum(k["x"] for k in node["kids"]) / len(node["kids"])
        node["y"] = 120 + 190 * node["depth"]

    place(root)


def flatten_in_order(node):
    yield node
    for kid in node["kids"]:
        yield from flatten_in_order(kid)


def ring_around(nodes, margin=24):
    """Наименьший эллипс с центром в середине группы, вмещающий все круги с запасом."""
    cx = (min(v["x"] for v in nodes) + max(v["x"] for v in nodes)) / 2
    cy = (min(v["y"] for v in nodes) + max(v["y"] for v in nodes)) / 2
    base_x = max(abs(v["x"] - cx) for v in nodes) + NODE_R + margin
    base_y = max(abs(v["y"] - cy) for v in nodes) + NODE_R + margin
    k = 1.0
    while True:
        rx, ry = base_x * k, base_y * k
        if all(
            ((v["x"] - cx + (NODE_R + margin) * math.cos(a)) / rx) ** 2
            + ((v["y"] - cy + (NODE_R + margin) * math.sin(a)) / ry) ** 2
            <= 1
            for v in nodes
            for a in [i * math.pi / 6 for i in range(12)]
        ):
            return cx, cy, rx, ry
        k += 0.02


def build():
    rng = random.Random(7)
    root = expand(TOP)
    calls = flatten(root)
    layout(root)

    counts = Counter(v["n"] for v in calls)
    repeated = max(
        n for n, c in counts.items() if c > 1 and n > 2
    )  # самый крупный повтор
    times = counts[repeated]
    assert (counts[3], counts[2], len(calls)) == (2, 3, 9), (
        "числа ролика должны совпасть с текстом урока"
    )

    accent_at = len(calls) * STEP + 0.3
    scene = Scene(1600, 900, fade_start=accent_at + 3.0, duration=accent_at + 3.5)

    for i, v in enumerate(calls):
        t0 = i * STEP
        mark = accent_at if v["n"] == repeated else None
        if "parent" in v:
            p = v["parent"]
            ang = math.atan2(v["y"] - p["y"], v["x"] - p["x"])
            a = (p["x"] + NODE_R * math.cos(ang), p["y"] + NODE_R * math.sin(ang))
            b = (
                v["x"] - (NODE_R + 8) * math.cos(ang),
                v["y"] - (NODE_R + 8) * math.sin(ang),
            )
            scene.add(Ink(line(a, b, rng), t0, 0.16, rng))
            scene.add(Ink(arrow_head(b, ang, rng), t0 + 0.12, 0.08, rng))
        scene.add(
            Ink(
                circle((v["x"], v["y"]), NODE_R, rng),
                t0 + 0.08,
                0.22,
                rng,
                accent_at=mark,
            )
        )
        scene.add(
            Text(
                f"F({v['n']})",
                (v["x"], v["y"] + 4),
                66,
                t0 + 0.2,
                0.15,
                rng,
                accent_at=mark,
            )
        )

    rings = []
    for v in calls:
        if v["n"] == repeated:
            group = list(subtree(v))
            cx, cy, rx, ry = ring_around(group)
            rings.append((cx, cy, rx, ry))
            scene.add(
                Ink(
                    dashed_ellipse((cx, cy), rx, ry, rng),
                    accent_at + 0.1 * len(rings),
                    0.8,
                    rng,
                    width=5 * SS,
                )
            )

    # подпись и стрелка к правому кольцу
    cx, cy, rx, ry = max(rings, key=lambda r: r[0])
    angle = math.radians(65)
    end = (cx + rx * 1.05 * math.cos(angle), cy + ry * 1.05 * math.sin(angle))
    cap = (end[0] - 60, 745)
    scene.add(
        Text(
            "СЧИТАЕМ ДВА РАЗА\nОДНО И ТО ЖЕ!",
            cap,
            54,
            accent_at + 0.9,
            0.9,
            rng,
            color=ACCENT,
        )
    )
    scene.add(
        Ink(
            curve((cap[0] + 20, cap[1] - 80), (cap[0] + 20, end[1] + 60), end, rng),
            accent_at + 1.4,
            0.4,
            rng,
            color=ACCENT,
        )
    )
    scene.add(
        Text(
            f"F({TOP}) ВЫЗЫВАЕТ F({repeated}) ДВАЖДЫ" if times == 2 else "",
            (800, 860),
            48,
            accent_at + 1.5,
            0.8,
            rng,
            color=INK,
        )
    )

    meta = {
        "alt": "Дерево вызовов F(5): значение F(3) вычисляется дважды, эти поддеревья обведены",
        "calls": len(calls),
        "repeats": {
            f"F({n})": c for n, c in sorted(counts.items(), reverse=True) if c > 1
        },
    }
    return scene, meta
