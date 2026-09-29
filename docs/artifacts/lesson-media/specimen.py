"""Лист образцов: все примитивы движка на одном кадре.

Эталон манеры для STYLE.md и быстрая проверка после правок движка. Собирается как статичная
иллюстрация в `reference/specimen.png`, в уроки не попадает.
"""

from handdrawn import (
    ACCENT,
    SS,
    Ink,
    Scene,
    Text,
    arrow,
    axes,
    box,
    check_mark,
    circle,
    cross_out,
    curve,
    dashed_ellipse,
    line,
    polyline,
    underline,
)

NAME = "specimen"
LESSON = None  # не урок: собирается в reference/
KIND = "still"
W, H = 1600, 1000


def build():
    scene = Scene(W, H, fade_start=1, duration=1.5, seed=1)

    def ink(strokes, key, color=None, width=None):
        kwargs = {}
        if color:
            kwargs["color"] = color
        if width:
            kwargs["width"] = width
        scene.add(Ink(strokes, 0, 0, scene.rng(key), **kwargs))

    def text(label, xy, size, key, color=None, anchor="c"):
        kwargs = {"anchor": anchor}
        if color:
            kwargs["color"] = color
        scene.add(Text(label, xy, size, 0, 0, scene.rng(key), **kwargs))

    # 1. окружности и подписи
    text("КРУГИ И ПОДПИСИ", (60, 60), 56, "h1", anchor="l")
    ink(underline(60, 460, 96, scene.rng("u1")), "u1", width=4 * SS)
    ink(circle((150, 210), 64, scene.rng("c1")), "c1")
    text("F(3)", (150, 214), 74, "t1")
    ink(circle((330, 210), 64, scene.rng("c2")), "c2", color=ACCENT)
    text("F(3)", (330, 214), 74, "t2", color=ACCENT)
    text("АКЦЕНТ — ГЛАВНАЯ МЫСЛЬ", (60, 320), 52, "t3", color=ACCENT, anchor="l")

    # 2. стрелки
    text("СТРЕЛКИ", (700, 60), 56, "h2", anchor="l")
    ink(underline(700, 900, 96, scene.rng("u2")), "u2", width=4 * SS)
    ink(arrow((700, 190), (1000, 190), scene.rng("a1")), "a1")
    ink(curve((700, 290), (850, 190), (1000, 290), scene.rng("a2")), "a2")
    text("ПРЯМАЯ И ДУГА", (850, 350), 48, "t4")

    # 3. штриховая рамка вокруг группы
    text("ГРУППА", (1200, 60), 56, "h3", anchor="l")
    ink(underline(1200, 1370, 96, scene.rng("u3")), "u3", width=4 * SS)
    for i, x in enumerate((1260, 1400)):
        ink(circle((x, 210), 44, scene.rng(f"g{i}")), f"g{i}")
    ink(dashed_ellipse((1330, 210), 150, 90, scene.rng("d1")), "d1", width=5 * SS)

    # 4. рамка-таблица
    text("ТАБЛИЦА", (60, 470), 56, "h4", anchor="l")
    ink(underline(60, 300, 506, scene.rng("u4")), "u4", width=4 * SS)
    ink(box(60, 540, 560, 740, scene.rng("b1")), "b1")
    ink(line((60, 640), (560, 640), scene.rng("b2")), "b2", width=4 * SS)
    ink(line((260, 540), (260, 740), scene.rng("b3")), "b3", width=4 * SS)
    text("n", (160, 590), 56, "b4")
    text("F(n)", (410, 590), 56, "b5")
    text("3", (160, 690), 56, "b6")
    text("7", (410, 690), 56, "b7")

    # 5. отметки
    text("ОТМЕТКИ", (700, 470), 56, "h5", anchor="l")
    ink(underline(700, 900, 506, scene.rng("u5")), "u5", width=4 * SS)
    text("F(0)", (780, 620), 66, "m1")
    ink(cross_out(720, 570, 850, 670, scene.rng("x1")), "x1", color=ACCENT)
    text("F(1)", (1040, 620), 66, "m2")
    ink(check_mark((1150, 620), 70, scene.rng("k1")), "k1", color=ACCENT)
    text("ВЕРНО / НЕВЕРНО", (940, 720), 48, "m3")

    # 6. график
    text("ГРАФИК", (1200, 470), 56, "h6", anchor="l")
    ink(underline(1200, 1400, 506, scene.rng("u6")), "u6", width=4 * SS)
    ink(axes((1210, 740), 330, 190, scene.rng("ax")), "ax")
    ink(polyline([(1230, 720), (1330, 650), (1430, 610), (1520, 590)], scene.rng("pl")), "pl", color=ACCENT)
    text("ВРЕМЯ", (1380, 790), 48, "p1")

    # 7. размеры текста
    text("МИНИМУМ ДЛЯ ТЕЛЕФОНА: 48 НА ХОЛСТЕ 1600", (60, 900), 48, "s1", anchor="l")
    text("ЛУЧШЕ КРУПНЕЕ: 56–74", (60, 960), 56, "s2", anchor="l")
    return scene, {"alt": "Лист образцов примитивов движка рисования"}
