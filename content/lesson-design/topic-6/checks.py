"""Independent recomputation of every task answer in topic 6.

Usage: python3 -I content/lesson-design/topic-6/checks.py

The lessons solve by hand: state tables, rectangle formulas, columns of a
sloped figure. Here every answer is recomputed by a separate executor: the
commands are run step by step, the drawn segments are kept, and every integer
node of a box around the drawing is classified — on a drawn segment, inside
(even-odd rule over the closed contours) or outside. Areas use the shoelace
formula, regions of several figures are checked node by node. The executor
shares no code with turtle_figures.py. Every expected answer must appear
verbatim in the answers of its page.
Exit code 1 if any check fails.
"""

import math
import re
import sys
from collections import Counter
from pathlib import Path

D = Path(__file__).resolve().parent
EPS = 1e-7

checks: list[tuple[str, str, bool]] = []


def answers(f: str) -> str:
    text = (D / f).read_text(encoding="utf-8")
    tail = text.split("**Ответы для проверки:**", 1)[1]
    return re.split(r"\n\n(?:\*\*Что дальше|<details)", tail)[0]


def expect(f: str, needle: str) -> None:
    checks.append((f, needle, needle in answers(f)))


def same(label: str, a: object, b: object) -> None:
    checks.append(("—", f"{label}: {a} = {b}", a == b))


# --- executor ------------------------------------------------------------------

WORDS = {"Вперёд": "F", "Назад": "B", "Направо": "R", "Налево": "L"}


def expand(cmds: str) -> list[tuple[str, float]]:
    """«Повтори k [ … ]» unrolled into elementary commands."""
    s = cmds.replace("[", " [ ").replace("]", " ] ")
    s = s.replace("Поднять хвост", "UP").replace("Опустить хвост", "DOWN")
    tok = s.split()

    def block(i: int) -> tuple[list[tuple[str, float]], int]:
        out: list[tuple[str, float]] = []
        while i < len(tok) and tok[i] != "]":
            w = tok[i]
            if w == "Повтори":
                k = int(tok[i + 1])
                assert tok[i + 2] == "["
                body, i = block(i + 3)
                out += body * k
                i += 1
            elif w in ("UP", "DOWN"):
                out.append((w, 0))
                i += 1
            else:
                out.append((WORDS[w], float(tok[i + 1])))
                i += 2
        return out, i

    return block(0)[0]


def trace(cmds: str, heading: float = 90):
    """Drawn segments, closed contours and the final state."""
    x = y = 0.0
    h, pen = heading, True
    segs, contours, path = [], [], [(0.0, 0.0)]
    for c, v in expand(cmds):
        if c in ("F", "B"):
            d = v if c == "F" else -v
            nx = x + d * math.cos(math.radians(h))
            ny = y + d * math.sin(math.radians(h))
            nx, ny = round(nx, 9), round(ny, 9)
            if pen:
                segs.append(((x, y), (nx, ny)))
                path.append((nx, ny))
            x, y = nx, ny
        elif c in ("R", "L"):
            h = (h - v if c == "R" else h + v) % 360
        elif c == "UP":
            pen = False
            contours.append(path)
        else:
            pen, path = True, [(x, y)]
    contours.append(path)
    closed = []
    for p in contours:
        # the first loop of a path: a repeated lap would cancel the even-odd rule
        for i in range(1, len(p)):
            j = next((j for j in range(i) if math.dist(p[j], p[i]) < EPS), None)
            if j is not None:
                if i - j > 2:
                    closed.append(p[j : i + 1])
                break
    return segs, closed, (x, y, h)


def on_seg(p, a, b) -> bool:
    (px, py), (ax, ay), (bx, by) = p, a, b
    cross = (bx - ax) * (py - ay) - (by - ay) * (px - ax)
    if abs(cross) > EPS * max(1.0, math.dist(a, b)):
        return False
    return (
        min(ax, bx) - EPS <= px <= max(ax, bx) + EPS
        and min(ay, by) - EPS <= py <= max(ay, by) + EPS
    )


def inside(p, poly) -> bool:
    px, py = p
    res = False
    for i in range(len(poly) - 1):
        (x1, y1), (x2, y2) = poly[i], poly[i + 1]
        if (y1 > py) != (y2 > py):
            xc = x1 + (py - y1) * (x2 - x1) / (y2 - y1)
            if xc > px:
                res = not res
    return res


def nodes(cmds: str, heading: float = 90) -> tuple[int, int]:
    """(strictly inside, on the drawn lines)."""
    segs, closed, _ = trace(cmds, heading)
    xs = [c for s in segs for q in s for c in (q[0],)]
    ys = [c for s in segs for q in s for c in (q[1],)]
    n_in = n_edge = 0
    for gx in range(math.floor(min(xs)) - 1, math.ceil(max(xs)) + 2):
        for gy in range(math.floor(min(ys)) - 1, math.ceil(max(ys)) + 2):
            p = (gx, gy)
            if any(on_seg(p, a, b) for a, b in segs):
                n_edge += 1
            elif any(inside(p, c) for c in closed):
                n_in += 1
    return n_in, n_edge


def area(cmds: str, heading: float = 90) -> float:
    _, closed, _ = trace(cmds, heading)
    p = closed[0]
    return abs(sum(p[i][0] * p[i + 1][1] - p[i + 1][0] * p[i][1] for i in range(len(p) - 1))) / 2


def state(cmds: str, heading: float = 90) -> tuple:
    x, y, h = trace(cmds, heading)[2]
    return (round(x, 6) + 0.0, round(y, 6) + 0.0, round(h, 6) % 360)


def rect(r, strict=False):
    x0, x1, y0, y1 = r
    if strict:
        return lambda p: x0 < p[0] < x1 and y0 < p[1] < y1
    return lambda p: x0 <= p[0] <= x1 and y0 <= p[1] <= y1


def region(test, box=range(-20, 30)) -> int:
    return sum(1 for x in box for y in box if test((x, y)))


def box_of(cmds: str) -> tuple:
    """Bounds of each closed axis-parallel contour."""
    out = []
    for c in trace(cmds)[1]:
        xs, ys = [p[0] for p in c], [p[1] for p in c]
        out.append((round(min(xs)), round(max(xs)), round(min(ys)), round(max(ys))))
    return tuple(out)


def visits(reps: int, side: int, start: bool) -> tuple[int, int]:
    x, y, h = 0, 0, 90
    seen = Counter([(0, 0)] if start else [])
    for _ in range(reps):
        for _ in range(side):
            x += round(math.cos(math.radians(h)))
            y += round(math.sin(math.radians(h)))
            seen[(x, y)] += 1
        h -= 90
    return len(seen), sum(1 for v in seen.values() if v >= 2)


def rep(body: str, k: int) -> str:
    return f"Повтори {k} [ {body} ]"


RECT = rep("Вперёд 6 Направо 90 Вперёд 8 Направо 90", 2)

# --- subtopic 1: state -----------------------------------------------------------
P1 = "01-sostoyanie-i-komandy.md"
same("1.1", state("Вперёд 5 Направо 90 Вперёд 3 Назад 1 Налево 90 Вперёд 2"), (2.0, 7.0, 90.0))
expect(P1, "1. (2; 7), голова вверх.")
same("1.2", state("Вперёд 4 Налево 90 Вперёд 3 Назад 5 Направо 90"), (2.0, 4.0, 90.0))
expect(P1, "2. (2; 4), голова вверх")
segs, closed, _ = trace(rep("Вперёд 2 Направо 90", 3))
same(
    "1.3", (state(rep("Вперёд 2 Направо 90", 3)), len(segs), len(closed)), ((2.0, 0.0, 180.0), 3, 0)
)
expect(P1, "3. (2; 0), голова влево")
same("1.4", len(trace(rep("Вперёд 4 Направо 120", 3))[1]), 1)
same("1.5", (360 / 6, 360 / 8), (60.0, 45.0))
expect(P1, "5. 60° и 45°")
same("1.6", state("Вперёд 5 Вперёд 5 Вперёд 5 Вперёд 5 Направо 90"), (0.0, 20.0, 0.0))
same("1.7", state(rep("Вперёд 3 Направо 90 Вперёд 2 Направо 90", 5)), (2.0, 3.0, 270.0))
expect(P1, "7. (2; 3), голова вниз")
same("1.8", state(rep("Вперёд 5 Направо 90 Вперёд 5 Направо 270", 4))[:2], (20.0, 20.0))
expect(P1, "8. (20; 20)")

# --- subtopic 2: drawing and grid --------------------------------------------------
P2 = "02-postroenie-i-reshetka.md"
same("2.2", 6 * 25, 150)
expect(P2, "2. 150 = 6 · 25.")
expect(P2, "4. `range(-4, 6)` для x и `range(-3, 7)` для y.")
same(
    "2.4",
    (
        list(range(-4, 6))[1:-1] == list(range(-3, 5)),
        list(range(-3, 7))[1:-1] == list(range(-2, 6)),
    ),
    (True, True),
)
same("2.5", len(range(-3, 8)) * len(range(-2, 6)), 88)
expect(P2, "5. 88")
same("2.7", state(rep("Вперёд 10 Направо 120", 4)), (0.0, 10.0, 330.0))
expect(P2, "7. Координаты 0 и 10, направление 330")
grid = [(x, y) for x in range(-2, 13) for y in range(-2, 11)]
same("2.8", (len(grid), nodes(RECT)[0]), (195, 35))
expect(P2, "8. 195 точек: 15 · 13; строго внутри — 35")

# --- subtopic 3: points and measures ------------------------------------------------
P3 = "03-granica-i-velichiny.md"
same("3 main", (nodes(RECT)[0], sum(nodes(RECT)), area(RECT)), (35, 63, 48.0))
r = rep("Вперёд 4 Направо 90 Вперёд 7 Направо 90", 3)
same("3.1", (nodes(r)[0], sum(nodes(r)), state(r)), (18, 40, (7.0, 4.0, 270.0)))
expect(
    P3, "1. Прямоугольник 7 × 4; строго внутри 18, с границей 40; Черепаха в (7; 4), голова вниз."
)
r = rep("Вперёд 3 Налево 90", 4)
same("3.2", (nodes(r, 0)[0], sum(nodes(r, 0))), (4, 16))
expect(P3, "2. Квадрат 3 × 3: строго внутри 4, вместе с границей 16.")
r = rep("Вперёд 4 Направо 90 Вперёд 9 Направо 90", 2)
same("3.3", (nodes(r)[0], sum(nodes(r)), nodes(r)[1]), (24, 50, 26))
expect(P3, "3. 24, 50 и 26")
same("3.4", sum(1 for x in range(7) for y in range(5) if on_seg((x, y), (0, 0), (6, 4))), 3)
expect(P3, "4. 3 точки")
same("3.5", nodes("Вперёд 2 Направо 90 Вперёд 5 Направо 90 Вперёд 2"), (0, 10))
expect(P3, "5. 10 точек")
tri = [(0, 0), (6, 0), (0, 5), (0, 0)]
inner = sum(
    1
    for x in range(7)
    for y in range(6)
    if inside((x, y), tri) and not any(on_seg((x, y), tri[i], tri[i + 1]) for i in range(3))
)
same("3.6", inner, 10)
expect(P3, "6. Площадь 15 = 6 · 5 / 2; строго внутри 10 точек")
same("3.7", nodes(rep("Вперёд 11 Направо 90 Вперёд 6 Направо 90", 6))[0], 50)
expect(P3, "7. 50")
same("3.8", sum(nodes(rep("Вперёд 5 Налево 90", 4), 180)), 36)
expect(P3, "8. 36")
same("3 open", nodes("Вперёд 3 Направо 90 Вперёд 4 Направо 90 Вперёд 3"), (0, 11))
same("3 dist", math.dist((0, 0), state("Вперёд 6 Направо 90 Вперёд 8")[:2]), 10.0)

# --- subtopic 4: several figures --------------------------------------------------
P4 = "04-neskolko-figur.md"
TWO = (
    RECT
    + " Поднять хвост Вперёд 2 Направо 90 Вперёд 3 Налево 90 Опустить хвост "
    + rep("Вперёд 5 Направо 90 Вперёд 7 Направо 90", 2)
)
A, B = (rect(b) for b in box_of(TWO))
same(
    "4 main",
    [
        region(lambda p: A(p) and B(p)),
        region(lambda p: A(p) or B(p)),
        region(lambda p: A(p) != B(p)),
    ],
    [30, 81, 51],
)
a, b = rect((-2, 5, -1, 4)), rect((1, 7, 2, 6))
sa, sb = rect((-2, 5, -1, 4), True), rect((1, 7, 2, 6), True)
same("4.1", (region(lambda p: a(p) and b(p)), region(lambda p: sa(p) and sb(p))), (15, 3))
expect(P4, "1. 15 точек вместе с границей и 3 строго внутри")
a, b = rect((0, 4, 0, 3)), rect((2, 6, 1, 4))
same("4.2", region(lambda p: a(p) or b(p)), 31)
expect(P4, "2. 31")
a, b = rect((0, 3, 0, 2)), rect((3, 5, 0, 2))
same("4.3", region(lambda p: a(p) and b(p)), 3)
expect(P4, "3. Площадь 0, общих точек с границами 3")
sa, sb = rect((0, 8, 0, 6), True), rect((3, 10, 2, 7), True)
same("4.4", (region(lambda p: A(p) and not B(p)), region(lambda p: sa(p) or sb(p))), (33, 47))
expect(P4, "4. 33 = 63 − 30; строго внутри хотя бы одного — 47")
a, b = rect((0, 10, 0, 6)), rect((4, 12, 2, 9))
same("4.5", region(lambda p: a(p) and not b(p)), 42)
expect(P4, "5. 42")
SIX = (
    rep("Вперёд 9 Направо 90 Вперёд 7 Направо 90", 2)
    + " Поднять хвост Вперёд 3 Направо 90 Вперёд 4 Налево 90 Опустить хвост "
    + rep("Вперёд 8 Направо 90 Вперёд 6 Направо 90", 2)
)
a, b = (rect(x) for x in box_of(SIX))
same("4.6-7", (region(lambda p: a(p) and b(p)), region(lambda p: a(p) or b(p))), (28, 115))
expect(P4, "6. 28")
expect(P4, "7. 115")
a, b, c = rect((0, 4, 0, 4)), rect((2, 6, 0, 4)), rect((1, 5, 2, 6))
same("4 three", region(lambda p: a(p) or b(p) or c(p)), 45)

# --- subtopic 5: sloped sides ------------------------------------------------------
P5 = "05-naklonnaya-geometriya.md"
same("5 tri", nodes(rep("Вперёд 8 Направо 120", 7)), (24, 9))
same("5 rhombus", nodes(rep("Вперёд 6 Направо 60 Вперёд 6 Направо 120", 4))[0], 30)
same(
    "5 L",
    nodes(
        "Вперёд 6 Направо 90 Вперёд 3 Направо 90 Вперёд 3 Налево 90 Вперёд 3 Направо 90 Вперёд 3 Направо 90 Вперёд 6"
    )[0],
    16,
)
same("5.1", nodes(rep("Вперёд 6 Направо 120", 5))[0], 13)
expect(P5, "1. 13 точек")
same("5.2", nodes(rep("Вперёд 6 Направо 150 Вперёд 6 Направо 30", 4), 0)[0], 12)
expect(P5, "2. 12 точек")
same("5.3", nodes(rep("Вперёд 10 Направо 120", 3))[0], 38)
expect(P5, "3. 38 точек.")
same("5.4-5", nodes(rep("Вперёд 9 Направо 60 Вперёд 6 Направо 120", 2)), (45, 10))
expect(P5, "4. 45 точек")
expect(P5, "5. 10 точек")
same("5.6", sum(nodes(rep("Направо 45 Вперёд 6 Направо 45", 4))), 41)
expect(P5, "6. 41")
same(
    "5.7",
    nodes(
        "Вперёд 4 Направо 90 Вперёд 2 Направо 90 Вперёд 2 Налево 90 Вперёд 3 Направо 90 Вперёд 2 Направо 90 Вперёд 5"
    )[0],
    6,
)
expect(P5, "7. 6 точек")

# --- subtopic 6: inverse questions and visits ---------------------------------------
P6 = "06-obratnyj-vopros-i-poseshcheniya.md"


def least(make, ok) -> int:
    return next(a for a in range(1, 60) if ok(*nodes(make(a))))


w6 = lambda a: rep(f"Вперёд {a} Направо 90 Вперёд 6 Направо 90", 2)  # noqa: E731
same("6 main", (least(w6, lambda i, _: i >= 40), least(w6, lambda i, _: i > 40)), (9, 10))
w4 = lambda a: rep(f"Вперёд {a} Направо 90 Вперёд 4 Направо 90", 2)  # noqa: E731
sq = lambda a: rep(f"Вперёд {a} Направо 90 Вперёд {a} Направо 90", 2)  # noqa: E731
same("6.1", least(w4, lambda i, _: i >= 30), 11)
expect(P6, "1. 11")
same("6.2", least(w4, lambda i, e: i + e > 60), 12)
expect(P6, "2. 12")
same("6.3", least(sq, lambda i, _: i > 100), 12)
expect(P6, "3. 12")


def best(big, side: int) -> int:
    g = rect(big)
    out = 0
    for u in range(-side, 12):
        for v in range(-side, 8):
            sq = rect((u, u + side, v, v + side))
            out = max(out, region(lambda p, sq=sq: g(p) and sq(p), range(-2, 14)))
    return out


same("6 place", (best((0, 8, 0, 6), 4), best((0, 8, 0, 6), 7)), (25, 56))
same("6.4", best((0, 10, 0, 4), 6), 35)
expect(P6, "4. 35")
same("6.5", sum(1 for u in range(-5, 15) for v in range(-5, 15) if 0 <= u <= 7 and 0 <= v <= 1), 16)
expect(P6, "5. 16")
same("6 visits", (visits(6, 2, True), visits(6, 2, False)), ((8, 5), (8, 4)))
same("6.6-7", (visits(5, 3, True)[1], visits(5, 3, False)), (4, (12, 3)))
expect(P6, "6. 4")
expect(P6, "7. 3 точки")

# --- subtopic 7: counting by program and arcs ---------------------------------------
P7 = "07-tochnyj-podschet-i-dugi.md"
same("7.1", region(rect((0, 9, 0, 4), True)), 24)
expect(P7, "1. 24")
same("7.2", region(lambda p: A(p) != B(p)), 51)
expect(P7, "2. 51")
same("7.3", nodes(rep("Вперёд 6 Направо 120", 3))[0], 13)
expect(P7, "3. 13")
same(
    "7.4",
    (
        len([x for x in range(-10, 10) if 2.3 <= x <= 6.8]),
        len([x for x in range(-10, 10) if 1.5 < x < 4]),
    ),
    (4, 2),
)
expect(P7, "4. 4 числа (3, 4, 5, 6)")
same("7.5", region(lambda p: p[1] >= 0 and (p[0] - 5) ** 2 + p[1] ** 2 <= 25), 46)
expect(P7, "5. 46.")
same("7.6", region(lambda p: p[1] > 0 and (p[0] - 5) ** 2 + p[1] ** 2 < 25), 30)
expect(P7, "6. 30.")
same(
    "7 arc",
    (
        region(lambda p: p[1] > 0 and (p[0] - 4) ** 2 + p[1] ** 2 < 16),
        region(lambda p: p[1] >= 0 and (p[0] - 4) ** 2 + p[1] ** 2 <= 16),
    ),
    (19, 29),
)
same("7 rotated", nodes(rep("Вперёд 2 Направо 90", 4), 45)[0], 2)

# --- final page --------------------------------------------------------------------
P8 = "08-praktika-i-itog.md"
same("8.1", nodes(rep("Вперёд 12 Направо 90 Вперёд 5 Направо 90", 7))[0], 44)
expect(P8, "1. 44")
same("8.2", sum(nodes(rep("Вперёд 4 Налево 90 Вперёд 9 Налево 90", 3), 0)), 50)
expect(P8, "2. 50")
T3 = (
    rep("Вперёд 10 Направо 90 Вперёд 8 Направо 90", 2)
    + " Поднять хвост Вперёд 3 Направо 90 Вперёд 1 Налево 90 Опустить хвост "
    + rep("Вперёд 9 Направо 90 Вперёд 7 Направо 90", 2)
)
a, b = (rect(x) for x in box_of(T3))
same("8.3", region(lambda p: a(p) and b(p)), 64)
expect(P8, "3. 64")
same("8.4", nodes(rep("Вперёд 12 Направо 120", 6))[0], 56)
expect(P8, "4. 56")
same(
    "8.5",
    area(
        "Вперёд 8 Направо 90 Вперёд 4 Направо 90 Вперёд 5 Налево 90 Вперёд 6 Направо 90 Вперёд 3 Направо 90 Вперёд 10"
    ),
    50.0,
)
expect(P8, "5. 50")

# every page with tasks has an answers block
for f in sorted(D.glob("0*.md")):
    if "**Ответы для проверки:**" not in f.read_text(encoding="utf-8"):
        checks.append((f.name, "answers block", False))
    nums = (
        re.findall(r"^(\d+)\. ", answers(f.name), re.M)
        if "**Ответы для проверки:**" in f.read_text(encoding="utf-8")
        else []
    )
    if nums != [str(i) for i in range(1, len(nums) + 1)]:
        checks.append((f.name, f"answers numbered 1…n: {nums}", False))

bad = [c for c in checks if not c[2]]
for f, needle, ok in checks:
    print("PASS" if ok else "FAIL", f, needle)
print(f"{len(checks) - len(bad)} of {len(checks)} checks pass")
sys.exit(1 if bad else 0)
