"""Общие детали роликов про цепочку значений F(1) … F(5): ряд кругов, дуги вопросов и ответов.

Тонкая оболочка над блоком `blocks_chain` с раскладкой этих роликов: F(1) слева, F(5) справа, шаг 250,
слева остаётся место под F(0) и «…».
"""

from blocks_chain import Chain
from handdrawn import ACCENT, INK

W, H = 1600, 740
R = 64
Y = 380  # центры кругов
VALUE_Y = Y + 116  # подпись «= значение» под кругом
LABEL_X = 60


def x_of(n):
    """F(1) слева, F(5) справа; шаг 250."""
    return 480 + 250 * (n - 1)


_CHAIN = Chain(x_of, y=Y, r=R, value_dy=116, label_x=LABEL_X)


def add_node(scene, rng, n, t0, dashed=False, value="?"):
    return _CHAIN.add_node(scene, rng, n, t0, dashed=dashed, value=value)


def question_arc(scene, rng, n_from, n_to, t0, label=None):
    return _CHAIN.question_arc(scene, rng, n_from, n_to, t0, label=label)


def answer_arc(scene, rng, n_from, n_to, t0, label):
    return _CHAIN.answer_arc(scene, rng, n_from, n_to, t0, label)


def phase_label(scene, rng, text, y, t0):
    return _CHAIN.phase_label(scene, rng, text, y, t0)


def stop_note(scene, rng, t0):
    """Оранжевая пометка «это дано!» со стрелкой к F(1)."""
    return _CHAIN.stop_note(scene, rng, t0, 1)


__all__ = ["W", "H", "add_node", "question_arc", "answer_arc", "phase_label", "stop_note", "x_of", "INK", "ACCENT", "Y", "VALUE_Y", "R"]
