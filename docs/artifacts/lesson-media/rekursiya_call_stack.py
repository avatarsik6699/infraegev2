"""Рисунок «Стопка ожидающих вызовов»: F(4), вызовы уходят вверх, ответы возвращаются вниз.

Значения считает код по правилу F(1) = 1, F(n) = 2·F(n − 1) + 1 из раздела «Рекурсивная функция и
стек вызовов»; порядок вызовов и ответы совпадают с выводом программы в уроке.
"""

from handdrawn import ACCENT, SS, Scene, arrow, box, curve, underline

NAME = "rekursiya-call-stack"
LESSON = "rekursiya"
KIND = "still"
W, H = 1320, 800
TOP_N = 4
BOX_X0, BOX_X1, BOX_H, STEP = 340, 860, 128, 164


def values(top):
    f = {1: 1}
    for n in range(2, top + 1):
        f[n] = 2 * f[n - 1] + 1
    return f


def build():
    f = values(TOP_N)
    assert (f[2], f[3], f[4]) == (3, 7, 15), "должно совпасть с выводом программы в уроке"
    scene = Scene(W, H, fade_start=1, duration=1.5, seed=41)
    order = list(range(1, TOP_N + 1))  # F(1) сверху, F(4) внизу

    # Подписи колонок
    scene.label("ВЫЗЫВАЕМ", (60, 60), 66, key="head-l", anchor="l")
    scene.shape(underline, 60, 350, 96, key="uh-l", width=4 * SS)
    scene.label("ВОЗВРАЩАЕМ", (900, 60), 66, key="head-r", anchor="l")
    scene.shape(underline, 900, 1250, 96, key="uh-r", width=4 * SS)

    # Стрелка вызовов вдоль стопки (снизу вверх) и номера вызовов
    y_top = 120 + 0
    y_bottom = 120 + STEP * (TOP_N - 1) + BOX_H
    scene.shape(arrow, (185, y_bottom - 20), (185, y_top + 10), key="up")
    for n in order:
        y = 120 + STEP * (n - 1)
        call_no = TOP_N - n + 1  # F(4) вызван первым
        scene.label(f"{call_no}-Й", (285, y + BOX_H / 2), 56, key=f"no{n}")

        base = n == 1
        color = ACCENT if base else None
        scene.shape(box, BOX_X0, y, BOX_X1, y + BOX_H, key=f"box{n}", color=color)
        scene.label(f"F({n})", (BOX_X0 + 105, y + BOX_H / 2 + 4), 74, key=f"lab{n}", color=color)
        status = "БАЗА = 1" if base else f"ЖДЁТ F({n - 1})"
        scene.label(status, (BOX_X0 + 350, y + BOX_H / 2 + 4), 54, key=f"st{n}", color=color)

    # Ответы: от F(1) вниз к F(2), F(3), F(4), затем наружу
    for n in range(1, TOP_N):
        y_from = 120 + STEP * (n - 1) + BOX_H / 2
        y_to = 120 + STEP * n + BOX_H / 2
        mid = (y_from + y_to) / 2
        scene.shape(curve, (BOX_X1 + 8, y_from), (BOX_X1 + 170, mid), (BOX_X1 + 8, y_to), key=f"ret{n}", color=None)
        scene.label(str(f[n]), (BOX_X1 + 165, mid - 26), 66, key=f"val{n}", color=ACCENT if n == 1 else None)
        if n > 1:
            scene.label(f"2·{f[n - 1]}+1", (BOX_X1 + 172, mid + 36), 48, key=f"fm{n}")
    y_last = 120 + STEP * (TOP_N - 1) + BOX_H / 2
    scene.shape(arrow, (BOX_X1 + 8, y_last), (BOX_X1 + 250, y_last), key="out")
    scene.label(str(f[TOP_N]), (BOX_X1 + 335, y_last - 2), 74, key="ans")
    scene.label(f"2·{f[TOP_N - 1]}+1", (BOX_X1 + 140, y_last + 60), 48, key="fm-out")
    return scene, {
        "alt": "Стопка ожидающих вызовов F(4), F(3), F(2), F(1): вызовы идут вверх до базы, ответы 1, 3, 7, 15 возвращаются вниз",
        "values": {f"F({n})": v for n, v in f.items()},
    }
