"""Рисунок «Сократить, а не считать»: F(100) / F(98) при F(n) = n·F(n − 1).

Между F(98) и F(100) два шага, значит, два множителя: F(100) = 100·99·F(98). Общее F(98) сокращается,
остаётся 100·99. Числа считает код и сверяет с примером раздела.
"""

from handdrawn import ACCENT, SS, Scene, arrow, box, cross_out, line, text_width, underline

NAME = "rekursiya-cancel"
LESSON = "rekursiya"
KIND = "still"
W, H = 1600, 760
LOW, HIGH = 98, 100


def build():
    steps = list(range(LOW + 1, HIGH + 1))  # 99, 100
    product = 1
    for m in steps:
        product *= m
    assert product == 9900, "должно совпасть с примером раздела: F(100) / F(98) = 9900"
    scene = Scene(W, H, fade_start=1, duration=1.5, seed=77)

    # Правило и цепочка F(98) → F(99) → F(100) с множителями на стрелках
    scene.label("F(n) = n·F(n-1)", (60, 60), 62, key="rule", anchor="l")
    scene.shape(underline, 60, 430, 98, key="u-rule", width=4 * SS)
    xs = {98: 330, 99: 800, 100: 1270}
    y = 250
    for n, x in xs.items():
        scene.shape(box, x - 105, y - 52, x + 105, y + 52, key=f"c{n}")
        scene.label(f"F({n})", (x, y + 4), 64, key=f"t{n}")
    for a, b in ((98, 99), (99, 100)):
        scene.shape(arrow, (xs[a] + 122, y), (xs[b] - 124, y), key=f"a{b}")
        scene.label(f"·{b}", ((xs[a] + xs[b]) / 2, y - 55), 60, key=f"m{b}")
    scene.label("ДВА ШАГА — ДВА МНОЖИТЕЛЯ", (800, 380), 56, key="two", color=ACCENT)

    # Дробь: F(100) / F(98) = 100·99·F(98) / F(98) = 100·99 = 9900
    bar_y = 585
    num_y, den_y = bar_y - 55, bar_y + 60
    size = 62

    def fraction(cx, top, bottom, key):
        w = max(text_width(top, size), text_width(bottom, size)) + 30
        scene.shape(line, (cx - w / 2, bar_y), (cx + w / 2, bar_y), key=f"{key}:bar", width=5 * SS)
        scene.label(top, (cx, num_y), size, key=f"{key}:top")
        scene.label(bottom, (cx, den_y), size, key=f"{key}:bottom")
        return w

    scene_x = 190
    fraction(scene_x, f"F({HIGH})", f"F({LOW})", "f1")
    scene.label("=", (355, bar_y + 4), 70, key="eq1")
    numerator = f"{HIGH}·{HIGH - 1}·F({LOW})"
    cx2 = 700
    fraction(cx2, numerator, f"F({LOW})", "f2")
    # зачёркиваем F(98) сверху и снизу
    tail = f"F({LOW})"
    tail_w = text_width(tail, size)
    left = cx2 - text_width(numerator, size) / 2 + text_width(f"{HIGH}·{HIGH - 1}·", size)
    scene.shape(cross_out, left - 8, num_y - 40, left + tail_w + 8, num_y + 40, key="x-num", color=ACCENT)
    left_d = cx2 - text_width(tail, size) / 2
    scene.shape(cross_out, left_d - 8, den_y - 40, left_d + tail_w + 8, den_y + 40, key="x-den", color=ACCENT)
    scene.label("=", (1030, bar_y + 4), 70, key="eq2")
    scene.label(f"{HIGH}·{HIGH - 1}", (1190, bar_y + 4), size, key="prod")
    scene.label(f"= {product}", (1440, bar_y + 4), 74, key="ans", color=ACCENT)
    return scene, {
        "alt": "Цепочка F(98), F(99), F(100) с множителями 99 и 100; в дроби F(100) на F(98) общее F(98) зачёркнуто, остаётся 100 на 99, то есть 9900",
        "product": product,
    }
