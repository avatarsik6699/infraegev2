"""Generate the data files of topic 27 and print the answers of their tasks.

Usage: python3 -I content/lesson-design/topic-27/datasets.py [--write]

The exam-format tasks of the topic work on our own files, never on the files of
the collection. Files are generated from fixed seeds, so they never change.
Without --write the script only prints the answers it computes from the files
as they are on disk (the lessons quote these numbers; checks.py recomputes them
by another method).

  example27.txt  the 8 points of the worked example of the source (header X Y)
  27-1.txt       file «A»: two clusters in squares 3 × 3 (rotated), ~200 lines
  27-2.txt       file «Б»: three clusters in squares 4 × 4 and 3 anomalies
  27-3.txt       stars «x y class»: spectral class, subclass, luminosity class
  27-4.txt       particles «x y vx vy m tag», tabs: clusters by kinetic energy
  27-5.txt       three sectors of 20° around the point C (2; −1)
  27-6.txt       two interleaved arcs: no straight bound separates them

A file is accepted only when its answers are robust: every center is unique
(the second best sum is clearly worse), cluster sizes and the counts asked by
the tasks differ, anomalies lie far from the clusters, and every value that a
task multiplies by 10 000 has a fractional part of the product in [0.02; 0.98].
"""

import math
import random
import sys
from math import dist
from pathlib import Path

HERE = Path(__file__).resolve().parent
FILES = HERE / "files"

EXAMPLE = "X Y\n0 0\n0 2\n1 1\n2 0\n2 2\n10 0\n12 0\n11 1\n"

SPECTRAL = "OBAFGKM"
LUMINOSITY = ["I", "II", "III", "IV", "V", "VI", "VII"]


def num(s: str) -> float:
    return float(s.replace(",", "."))


def fmt(v: float, digits: int = 6) -> str:
    return f"{v:.{digits}f}".replace(".", ",")


def frac_ok(v: float) -> bool:
    f = abs(v) * 10000 % 1
    return 0.02 <= f <= 0.98


def in_square(rnd, cx, cy, side, angle_deg):
    u, v = rnd.uniform(-side / 2, side / 2), rnd.uniform(-side / 2, side / 2)
    a = math.radians(angle_deg)
    return cx + u * math.cos(a) - v * math.sin(a), cy + u * math.sin(a) + v * math.cos(a)


# --- reading the files back, as the lessons do --------------------------------------


def points_of(name: str) -> list[tuple[float, ...]]:
    rows = []
    with open(FILES / name, encoding="utf-8") as f:
        for line in f:
            parts = line.replace(",", ".").split()
            if not parts or parts[0][0] not in "-0123456789":
                continue
            rows.append(tuple(float(p) for p in parts[:2]))
    return rows


def stars_of(name: str = "27-3.txt"):
    out = []
    with open(FILES / name, encoding="utf-8") as f:
        for line in f:
            parts = line.replace(",", ".").split()
            out.append((float(parts[0]), float(parts[1]), parts[2]))
    return out


def particles_of(name: str = "27-4.txt"):
    out = []
    with open(FILES / name, encoding="utf-8") as f:
        for line in f:
            p = line.replace(",", ".").split()
            out.append((float(p[0]), float(p[1]), float(p[2]), float(p[3]), float(p[4]), p[5]))
    return out


def energy(p) -> float:
    return p[4] * (p[2] ** 2 + p[3] ** 2) / 2


def parse_kind(code: str) -> tuple[str, int, str]:
    """'K3III' -> ('K', 3, 'III'); a white dwarf 'VII' -> ('', -1, 'VII')."""
    if code[0] in SPECTRAL:
        return code[0], int(code[1]), code[2:]
    return "", -1, code


# --- bounds of the lessons: how each file is split ----------------------------------


def split_1(points):
    a, b = [], []
    for p in points:
        (a if p[0] < 6 else b).append(p)
    return [a, b]


def split_2(points):
    """Explicit areas; everything else is an anomaly."""
    clusters, noise = [[], [], []], []
    for p in points:
        x, y = p[0], p[1]
        if -8 < x < 0 and 2 < y < 10:
            clusters[0].append(p)
        elif 1 < x < 10 and 2 < y < 10:
            clusters[1].append(p)
        elif -2 < x < 5 and -7 < y < 1:
            clusters[2].append(p)
        else:
            noise.append(p)
    return clusters, noise


def split_3(stars):
    clusters = [[], [], []]
    for s in stars:
        if s[1] < 5:
            clusters[0].append(s)
        elif s[0] < 10:
            clusters[1].append(s)
        else:
            clusters[2].append(s)
    return clusters


ENERGY_BOUNDS = [3.5, 7, 10.5]


def split_4(parts):
    clusters = [[], [], [], []]
    for p in parts:
        e = energy(p)
        k = sum(e > b for b in ENERGY_BOUNDS)
        clusters[k].append(p)
    return clusters


SECTOR_C = (2, -1)
SECTORS = [(350, 20), (110, 20), (230, 20)]


def angle_of(p, c=SECTOR_C) -> float:
    return math.degrees(math.atan2(p[1] - c[1], p[0] - c[0])) % 360


def split_5(points):
    clusters = [[] for _ in SECTORS]
    for p in points:
        a = angle_of(p)
        for k, (start, width) in enumerate(SECTORS):
            if (a - start) % 360 <= width:
                clusters[k].append(p)
    return clusters


# --- centers and the like -----------------------------------------------------------


def center_sum(cluster, d=dist):
    best, best_sum = cluster[0], float("inf")
    for c in cluster:
        s = sum(d(c, p) for p in cluster)
        if s < best_sum:
            best, best_sum = c, s
    return best


def sums_sorted(cluster, d=dist):
    return sorted(sum(d(c, p) for p in cluster) for c in cluster)


def unique_center(cluster, d=dist) -> bool:
    s = sums_sorted(cluster, d)
    return len(s) == 1 or s[1] - s[0] > 1e-3


def xy(p):
    return p[0], p[1]


def d2(a, b):
    return dist(xy(a), xy(b))


# --- generators -----------------------------------------------------------------------


def make_1(seed):
    rnd = random.Random(seed)
    pts = [in_square(rnd, 3.2, 4.4, 3, 25) for _ in range(118)]
    pts += [in_square(rnd, 9.4, 2.1, 3, -15) for _ in range(87)]
    rnd.shuffle(pts)
    return "".join(f"{fmt(x)} {fmt(y)}\n" for x, y in pts)


def make_2(seed):
    rnd = random.Random(seed)
    pts = [in_square(rnd, -4.1, 6.2, 4, 35) for _ in range(251)]
    pts += [in_square(rnd, 5.3, 5.8, 4, -20) for _ in range(193)]
    pts += [in_square(rnd, 1.4, -3.1, 4, 10) for _ in range(156)]
    pts += [(-9.4, -8.1), (12.3, -6.6), (-10.2, 13.1)]
    pts = [(x + rnd.uniform(-0.0004, 0.0004), y) for x, y in pts]
    rnd.shuffle(pts)
    return "".join(f"{fmt(x)} {fmt(y)}\n" for x, y in pts)


KIND_WEIGHTS = {"M": 5, "K": 5, "G": 4, "F": 3, "A": 2, "B": 1, "O": 1}


def make_3(seed):
    rnd = random.Random(seed)
    rows = []
    for cx, cy, ang, n in [(4.0, 1.5, 20, 231), (3.5, 9.0, -30, 198), (14.5, 8.0, 45, 172)]:
        for _ in range(n):
            x, y = in_square(rnd, cx, cy, 4.5, ang)
            lum = rnd.choices(LUMINOSITY, weights=[1, 1, 4, 2, 6, 1, 2])[0]
            if lum == "VII":
                code = "VII"
            else:
                cls = rnd.choices(list(KIND_WEIGHTS), weights=list(KIND_WEIGHTS.values()))[0]
                code = f"{cls}{rnd.randint(0, 9)}{lum}"
            rows.append((x, y, code))
    rnd.shuffle(rows)
    return "".join(f"{fmt(x)} {fmt(y)} {c}\n" for x, y, c in rows)


ENERGY_RANGES = [(1.1, 2.9), (4.4, 6.2), (8.1, 9.9), (11.6, 13.4)]


def make_4(seed):
    rnd = random.Random(seed)
    rows = []
    for (lo, hi), n in zip(ENERGY_RANGES, [125, 103, 93, 81], strict=True):
        while n:
            e = rnd.uniform(lo + 0.02, hi - 0.02)
            m = round(rnd.uniform(0.3, 2.5), 3)
            v = math.sqrt(2 * e / m)
            a = rnd.uniform(0, 2 * math.pi)
            vx, vy = round(v * math.cos(a), 3), round(v * math.sin(a), 3)
            if not lo <= m * (vx * vx + vy * vy) / 2 <= hi:
                continue
            x, y = round(rnd.uniform(-30, 30), 3), round(rnd.uniform(-30, 30), 3)
            tag = rnd.choice(LUMINOSITY)
            rows.append((x, y, vx, vy, m, tag))
            n -= 1
    rnd.shuffle(rows)
    return "".join(
        "\t".join([fmt(x, 3), fmt(y, 3), fmt(vx, 3), fmt(vy, 3), fmt(m, 3), t]) + "\n"
        for x, y, vx, vy, m, t in rows
    )


def make_5(seed):
    rnd = random.Random(seed)
    pts = []
    for (start, width), n in zip(SECTORS, [83, 76, 69], strict=True):
        for _ in range(n):
            a = math.radians(start + rnd.uniform(0.3, width - 0.3))
            r = 15 * math.sqrt(rnd.uniform(0.02, 1))
            pts.append((SECTOR_C[0] + r * math.cos(a), SECTOR_C[1] + r * math.sin(a)))
    rnd.shuffle(pts)
    return "".join(f"{fmt(x)} {fmt(y)}\n" for x, y in pts)


def make_6(seed):
    """Two interleaved half-rings («moons») with a gap of about 1."""
    rnd = random.Random(seed)
    pts = []
    for k in range(140):
        t = math.pi * (k + rnd.uniform(0.2, 0.8)) / 140
        r = 4 + rnd.uniform(-0.25, 0.25)
        pts.append((r * math.cos(t), r * math.sin(t)))
    for k in range(120):
        t = math.pi * (k + rnd.uniform(0.2, 0.8)) / 120
        r = 4 + rnd.uniform(-0.25, 0.25)
        pts.append((4 - r * math.cos(t), 1.5 - r * math.sin(t)))
    rnd.shuffle(pts)
    return "".join(f"{fmt(x, 4)} {fmt(y, 4)}\n" for x, y in pts)


# --- acceptance of a generated file ---------------------------------------------------


def accept(name: str) -> bool:
    if name == "27-1.txt":
        cl = split_1(points_of(name))
        ok = all(unique_center(c) for c in cl) and len({len(c) for c in cl}) == 2
        return ok and all(frac_ok(v) for v in answers_1().values())
    if name == "27-2.txt":
        cl, noise = split_2(points_of(name))
        ok = len(noise) == 3 and all(unique_center(c) for c in cl)
        return (
            ok and len({len(c) for c in cl}) == 3 and all(frac_ok(v) for v in answers_2().values())
        )
    if name == "27-3.txt":
        a = answers_3()
        cl = split_3(stars_of())
        return all(unique_center([xy(s) for s in c]) for c in cl) and a["ok"]
    if name == "27-4.txt":
        cl = split_4(particles_of())
        ok = all(
            unique_center([(energy(p),) for p in c], lambda u, v: abs(u[0] - v[0])) for c in cl
        )
        return ok and all(frac_ok(v) for k, v in answers_4().items() if k != "sizes")
    if name == "27-5.txt":
        cl = split_5(points_of(name))
        return all(unique_center(c) for c in cl) and all(frac_ok(v) for v in answers_5().values())
    return True


# --- answers -------------------------------------------------------------------------


def answers_1():
    cl = split_1(points_of("27-1.txt"))
    c = [center_sum(k) for k in cl]
    small, big = sorted(cl, key=len)
    cs, cb = center_sum(small), center_sum(big)
    return {
        "px": (c[0][0] + c[1][0]) / 2,
        "py": (c[0][1] + c[1][1]) / 2,
        "c_dist": dist(c[0], c[1]),
        "r_big": max(dist(cb, p) for p in big),
        "r_small": max(dist(cs, p) for p in small),
    }


def answers_2():
    cl, _ = split_2(points_of("27-2.txt"))
    centers = [center_sum(k) for k in cl]
    order = sorted(range(3), key=lambda i: len(cl[i]))
    small, big = order[0], order[-1]
    rest = [centers[i] for i in order[1:]]
    return {
        "min_x": min(c[0] for c in centers),
        "min_y": min(c[1] for c in centers),
        "q1": dist(centers[small], centers[big]),
        "q2": max(dist(centers[i], p) for i in range(3) for p in cl[i]),
        "mean_wo_small_x": sum(c[0] for c in rest) / 2,
        "mean_wo_small_y": sum(c[1] for c in rest) / 2,
        "far_other": max(dist(centers[small], p) for p in cl[big]),
    }


def kind_of(code, cls, lum):
    c, _, lumi = parse_kind(code)
    return c == cls and lumi == lum


def answers_3():
    cl = split_3(stars_of())
    centers = [center_sum([xy(s) for s in c]) for c in cl]
    red_giants = [sum(kind_of(s[2], "M", "III") for s in c) for c in cl]
    yellow_dwarfs = [sum(kind_of(s[2], "G", "V") for s in c) for c in cl]
    dwarfs = [sum(s[2] == "VII" for s in c) for c in cl]
    small = min(range(3), key=lambda i: len(cl[i]))
    rg = [s for s in cl[small] if kind_of(s[2], "M", "III")]
    near = min(rg, key=lambda s: dist(centers[small], xy(s)))
    lo, hi = red_giants.index(min(red_giants)), red_giants.index(max(red_giants))
    pair = max(
        dist(xy(a), xy(b))
        for c in cl
        for i, a in enumerate(c)
        for b in c[i + 1 :]
        if kind_of(a[2], "G", "V") and kind_of(b[2], "G", "V")
    )
    vals = {
        "near_x": near[0],
        "near_y": near[1],
        "b1": dist(centers[lo], centers[hi]),
        "b2": pair,
    }
    ok = (
        len(set(red_giants)) == 3
        and len(set(yellow_dwarfs)) == 3
        and len({len(c) for c in cl}) == 3
        and all(frac_ok(v) for v in vals.values())
    )
    return {
        **vals,
        "sizes": [len(c) for c in cl],
        "red_giants": red_giants,
        "yellow_dwarfs": yellow_dwarfs,
        "white_dwarfs": dwarfs,
        "ok": ok,
    }


def answers_4():
    cl = split_4(particles_of())

    def d_e(a, b):
        return abs(energy(a) - energy(b))

    centers = [center_sum(c, d_e) for c in cl]
    q1 = max(
        d2(a, b)
        for c in cl
        for i, a in enumerate(c)
        for b in c[i + 1 :]
        if a[5] == "II" and b[5] == "II"
    )
    return {
        "sizes": [len(c) for c in cl],
        "q1": q1,
        "q2": max(energy(c) for c in centers),
        "e_min_center": min(energy(c) for c in centers),
    }


def answers_5():
    cl = split_5(points_of("27-5.txt"))
    centers = [center_sum(c) for c in cl]
    return {
        "px": sum(c[0] for c in centers) / 3,
        "py": sum(c[1] for c in centers) / 3,
    }


MAKERS = {
    "27-1.txt": (make_1, 27100),
    "27-2.txt": (make_2, 27200),
    "27-3.txt": (make_3, 27300),
    "27-4.txt": (make_4, 27400),
    "27-5.txt": (make_5, 27500),
    "27-6.txt": (make_6, 27600),
}


def write():
    FILES.mkdir(exist_ok=True)
    (FILES / "example27.txt").write_text(EXAMPLE, encoding="utf-8")
    for name, (maker, seed) in MAKERS.items():
        while True:
            (FILES / name).write_text(maker(seed), encoding="utf-8")
            if accept(name):
                print(f"{name}: seed {seed}")
                break
            seed += 1


def show():
    for name, f in [
        ("27-1.txt", answers_1),
        ("27-2.txt", answers_2),
        ("27-3.txt", answers_3),
        ("27-4.txt", answers_4),
        ("27-5.txt", answers_5),
    ]:
        print(name)
        for k, v in f().items():
            shown = int(v * 10000) if isinstance(v, float) else v
            print(f"  {k}: {v} -> {shown}")


if __name__ == "__main__":
    if "--write" in sys.argv:
        write()
    show()
