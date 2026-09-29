"""Рисунок «Как выбрать способ»: карта «если условие — то инструмент» для задания 16.

Повторяет шаги «Сначала попробуйте упростить» и «Выберите инструмент» алгоритма раздела «Общий алгоритм
решения»; внизу общее правило про проверку.
"""

from handdrawn import ACCENT, SS, Scene, arrow, box, dashed_ellipse, underline

NAME = "rekursiya-choose-method"
LESSON = "rekursiya"
KIND = "still"
W = 1600
ROW_H, PITCH, TOP = 132, 156, 150
LEFT = (60, 830)
RIGHT = (960, 1540)

# (условие, инструмент, акцент); \n — перенос строки
ROWS = [
    ("АРГУМЕНТ ОГРОМНЫЙ, НУЖНО\nОТНОШЕНИЕ ИЛИ РАЗНОСТЬ", "СНАЧАЛА\nСОКРАТИТЬ", True),
    ("ВЕТВИ, ДВА ВЫЗОВА, ШАГ НЕ НА 1,\nДВЕ ФУНКЦИИ", "РЕКУРСИЯ\nС КЕШЕМ", False),
    ("ЛИНЕЙНАЯ ЦЕПОЧКА:\nОДНО ПРЕДЫДУЩЕЕ ЗНАЧЕНИЕ", "ЦИКЛ", False),
    ("ЦЕПОЧКА ЧУТЬ ДЛИННЕЕ 1000", "ПОДНЯТЬ ЛИМИТ\nРЕКУРСИИ", False),
    ("ОЧЕНЬ ДЛИННАЯ ЦЕПОЧКА\nИЛИ РЕКУРСИЯ ВВЕРХ", "ПРОГРЕТЬ КЕШ", False),
]


def build():
    height = TOP + PITCH * len(ROWS) + 230
    scene = Scene(W, height, fade_start=1, duration=1.5, seed=91)

    scene.label("ЕСЛИ", (LEFT[0], 60), 66, key="h-if", anchor="l")
    scene.shape(underline, LEFT[0], LEFT[0] + 150, 98, key="u-if", width=4 * SS)
    scene.label("ТО", (RIGHT[0], 60), 66, key="h-then", anchor="l")
    scene.shape(underline, RIGHT[0], RIGHT[0] + 110, 98, key="u-then", width=4 * SS)

    for i, (condition, tool, accent) in enumerate(ROWS):
        y = TOP + PITCH * i
        mid = y + ROW_H / 2
        color = ACCENT if accent else None
        scene.shape(box, LEFT[0], y, LEFT[1], y + ROW_H, key=f"l{i}")
        scene.label(condition, (LEFT[0] + (LEFT[1] - LEFT[0]) / 2, mid + 2), 50, key=f"lt{i}")
        scene.shape(arrow, (LEFT[1] + 20, mid), (RIGHT[0] - 20, mid), key=f"ar{i}", color=color)
        scene.shape(box, RIGHT[0], y, RIGHT[1], y + ROW_H, key=f"r{i}", color=color)
        scene.label(tool, (RIGHT[0] + (RIGHT[1] - RIGHT[0]) / 2, mid + 2), 54, key=f"rt{i}", color=color)

    y_note = TOP + PITCH * len(ROWS) + 20
    scene.shape(dashed_ellipse, (W / 2, y_note + 45), 640, 66, key="note-ring", color=ACCENT, width=5 * SS)
    scene.label("ВСЕГДА: ПРОВЕРЬ НА МАЛОМ n И ВТОРЫМ СПОСОБОМ", (W / 2, y_note + 50), 54, key="note", color=ACCENT)
    return scene, {
        "alt": "Карта выбора способа: огромный аргумент и отношение — сократить; ветви, два вызова, шаг не на 1, две функции — рекурсия с кешем; линейная цепочка — цикл; чуть длиннее 1000 — поднять лимит; очень длинная или вверх — прогреть кеш; всегда проверять двумя способами",
        "rows": len(ROWS),
    }
