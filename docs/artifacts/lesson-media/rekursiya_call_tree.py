"""Ролик «Дерево вызовов F(5)»: F(3) вычисляется дважды.

Дерево строится настоящей рекурсией, повторы считаются, а не рисуются по памяти. Те же числа
стоят в тексте урока «Рекурсия» (подраздел repeated-work-motivates-storage).
"""

import math
import random
from collections import Counter

from blocks_tree import expand, flatten, layout, ring_around, subtree

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
            cx, cy, rx, ry = ring_around(group, NODE_R)
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
