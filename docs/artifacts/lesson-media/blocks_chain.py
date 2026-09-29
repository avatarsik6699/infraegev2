"""Строительный блок «цепочка значений»: ряд кругов, дуги вопросов сверху и ответов снизу.

Вопросы идут дугами над рядом («чтобы найти F(5), нужно F(4)»), ответы — дугами под рядом. Узел —
любое значение аргумента; позиции задаёт функция `x_of`. Используется роликами «С базой», «Без базы»
и «Путь по развилке».
"""

import math

from handdrawn import ACCENT, SS, Ink, Text, arrow_head, circle, curve, dashed_ellipse, line, underline


class Chain:
    def __init__(self, x_of, y=380, r=64, value_dy=116, label_x=60, label_size=74, value_size=66):
        self.x_of, self.y, self.r, self.label_x = x_of, y, r, label_x
        self.label_size, self.value_size = label_size, value_size
        self.value_y = y + value_dy

    def add_node(self, scene, rng, node, t0, dashed=False, value="?"):
        """Круг с подписью F(node) и неизвестным значением под ним. Возвращает элементы."""
        x = self.x_of(node)
        if dashed:
            ring = Ink(dashed_ellipse((x, self.y), self.r, self.r, rng), t0, 0.4, rng, width=5 * SS)
        else:
            ring = Ink(circle((x, self.y), self.r, rng), t0, 0.3, rng)
        label = Text(f"F({node})", (x, self.y + 4), self.label_size, t0 + 0.2, 0.2, rng)
        unknown = Text(f"= {value}", (x, self.value_y), self.value_size, t0 + 0.4, 0.25, rng)
        for e in (ring, label, unknown):
            scene.add(e)
        return ring, label, unknown

    def question_arc(self, scene, rng, node_from, node_to, t0, label=None):
        """Дуга над рядом от узла node_from к node_to с подписью (по умолчанию «нужно F(node_to)»)."""
        x0, x1 = self.x_of(node_from), self.x_of(node_to)
        top = self.y - self.r - 8
        mid = (x0 + x1) / 2
        arc = Ink(curve((x0, top), (mid, top - 130), (x1, top - 6), rng), t0, 0.8, rng)
        text = Text(label or f"НУЖНО\nF({node_to})", (mid, top - 118), 56, t0 + 0.5, 0.5, rng)
        scene.add(arc)
        scene.add(text)
        return arc, text

    def answer_arc(self, scene, rng, node_from, node_to, t0, label):
        """Дуга под рядом от значения узла node_from к значению узла node_to."""
        x0, x1 = self.x_of(node_from), self.x_of(node_to)
        bottom = self.value_y + 44
        mid = (x0 + x1) / 2
        arc = Ink(curve((x0, bottom), (mid, bottom + 130), (x1, bottom + 6), rng), t0, 0.7, rng)
        text = Text(label, (mid, bottom + 100), 60, t0 + 0.35, 0.4, rng)
        scene.add(arc)
        scene.add(text)
        return arc, text

    def phase_label(self, scene, rng, text, y, t0):
        scene.add(Text(text, (self.label_x, y), 66, t0, 0.6, rng, anchor="l"))
        scene.add(Ink(underline(self.label_x, self.label_x + len(text) * 36, y + 34, rng), t0 + 0.4, 0.3, rng, width=4 * SS))

    def stop_note(self, scene, rng, t0, node, text="ЭТО ДАНО!", left=235, size=64, arrow_from=None):
        """Оранжевая пометка «это дано!» со стрелкой к узлу node (text может быть в две строки)."""
        scene.add(Text(text, (left, self.y), size, t0, 0.6, rng, color=ACCENT))
        start = arrow_from if arrow_from is not None else left + 115
        end = self.x_of(node) - self.r - 10
        scene.add(Ink(_short_arrow((start, self.y), (end, self.y), rng), t0 + 0.5, 0.3, rng, color=ACCENT))


def _short_arrow(a, b, rng):
    strokes = line(a, b, rng)
    strokes += arrow_head(b, math.atan2(b[1] - a[1], b[0] - a[0]), rng)
    return strokes
