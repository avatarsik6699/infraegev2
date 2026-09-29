"""Строительный блок «дерево вызовов»: рекурсивное дерево, раскладка и рамка вокруг поддерева.

Дерево строится настоящей рекурсией, поэтому числа вызовов и повторов считаются, а не рисуются
по памяти. Используется роликом «Дерево вызовов» и рисунком «до и после кеша».
"""

import math


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


def flatten_in_order(node):
    yield node
    for kid in node["kids"]:
        yield from flatten_in_order(kid)


def layout(root, x0=220, x1=1380, top=120, step=190):
    """Листья равномерно слева направо (от x0 до x1), внутренние вершины над серединой детей."""
    leaves = [v for v in flatten_in_order(root) if not v["kids"]]
    for i, leaf in enumerate(leaves):
        leaf["x"] = x0 + (x1 - x0) * i / (len(leaves) - 1)

    def place(node):
        for kid in node["kids"]:
            place(kid)
        if node["kids"]:
            node["x"] = sum(k["x"] for k in node["kids"]) / len(node["kids"])
        node["y"] = top + step * node["depth"]

    place(root)


def ring_around(nodes, node_r, margin=24):
    """Наименьший эллипс с центром в середине группы, вмещающий все круги с запасом."""
    cx = (min(v["x"] for v in nodes) + max(v["x"] for v in nodes)) / 2
    cy = (min(v["y"] for v in nodes) + max(v["y"] for v in nodes)) / 2
    base_x = max(abs(v["x"] - cx) for v in nodes) + node_r + margin
    base_y = max(abs(v["y"] - cy) for v in nodes) + node_r + margin
    k = 1.0
    while True:
        rx, ry = base_x * k, base_y * k
        if all(
            ((v["x"] - cx + (node_r + margin) * math.cos(a)) / rx) ** 2
            + ((v["y"] - cy + (node_r + margin) * math.sin(a)) / ry) ** 2
            <= 1
            for v in nodes
            for a in [i * math.pi / 6 for i in range(12)]
        ):
            return cx, cy, rx, ry
        k += 0.02
