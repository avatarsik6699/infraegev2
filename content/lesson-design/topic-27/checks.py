"""Independent recomputation of every task answer in topic 27.

Usage: python3 -I content/lesson-design/topic-27/checks.py

Each answer is recomputed here by a different method than the lessons use:
files are split into clusters by chains of neighbours (union of close pairs),
never by the bounds of the lessons; sector and energy clusters by sorting and
cutting at the largest gaps; centers by the paired sums of all distances,
compared with fsum; pairs over all ordered couples. Every expected answer must
appear verbatim in the answers of its subtopic file. Exit code 1 if any check
fails.
"""

import math
import sys
from math import fsum, hypot
from pathlib import Path

D = Path(__file__).resolve().parent
FILES = D / "files"


def answers(f):
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


checks = []


def expect(f, needle):
    checks.append((f, needle, needle in answers(f)))


def same(label, a, b):
    checks.append(("—", f"{label}: {a} = {b}", a == b))


def ru(v, digits):
    return f"{v:.{digits}f}".replace(".", ",").replace("-", "−")


def d(a, b):
    return hypot(a[0] - b[0], a[1] - b[1])


def rows(name):
    out = []
    for line in (FILES / name).read_text(encoding="utf-8").splitlines():
        parts = line.replace(",", ".").split()
        if parts and parts[0][0] in "-0123456789":
            out.append(parts)
    return out


def pts(name):
    return [(float(r[0]), float(r[1])) for r in rows(name)]


def chains(items, eps, key=lambda p: p):
    """Union of all pairs closer than eps (union-find), groups by size."""
    parent = list(range(len(items)))

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if d(key(items[i]), key(items[j])) <= eps:
                parent[find(i)] = find(j)
    groups = {}
    for i, it in enumerate(items):
        groups.setdefault(find(i), []).append(it)
    return sorted(groups.values(), key=len, reverse=True)


def center(cluster, dd=d, key=lambda p: p):
    """Paired sums: every distance once, added to both ends."""
    n = len(cluster)
    totals = [[] for _ in range(n)]
    for i in range(n):
        for j in range(i + 1, n):
            v = dd(key(cluster[i]), key(cluster[j]))
            totals[i].append(v)
            totals[j].append(v)
    sums = [fsum(t) for t in totals]
    return cluster[sums.index(min(sums))]


def i4(v):
    return str(int(v * 10000))


# --- 1. Точки и расстояния ---
f = "01-tochki-i-rasstoyaniya.md"
expect(f, f"1. {d((2, 1), (5, 5)):g}:")
expect(f, f"3. {d((-1, -2), (5, 6)):g}:")
cl = [[(0, 0), (1, 1)], [(5, 5), (6, 5), (7, 6)], [(10, 0)]]
expect(f, f"4. {len(cl)}, {len(cl[1])} и {cl[1][2][0]}:")
sq = (4 - 1) ** 2 + (7 - 3) ** 2
expect(f, f"3² + 4² = {sq} ≤ 25")
near = min([(3, 4), (-4, 2), (1, -5)], key=lambda p: d(p, (0, 0)))
expect(f, f"6. `({near[0]}, {near[1]})`")
v = d((-1.5, 2.25), (3.1, -0.4))
expect(f, f"8. {i4(v)}:")
expect(f, f"≈ {ru(v, 5)}")

# --- 2. Файл с точками ---
f = "02-fajl-s-tochkami.md"
stars = rows("27-3.txt")
expect(f, f"5. {len(stars)} звезда, из них {sum(r[2] == 'VII' for r in stars)}")
red = sum(r[2][0] == "M" and r[2][2:] == "III" for r in stars if r[2] != "VII")
expect(f, f"6. {red} красных")
expect(f, f"7. {2 * (1 + 9) // 2}:")
parts = rows("27-4.txt")
emax = max(float(r[4]) * (float(r[2]) ** 2 + float(r[3]) ** 2) / 2 for r in parts)
expect(f, f"8. {i4(emax)}:")

# --- 3. Разделение ---
f = "03-razdelenie-na-klastery.md"
expect(f, f"5. {math.degrees(math.atan2(3, -3)) % 360:g}°")
expect(f, f"6. 3√2 ≈ {ru(3 * 2**0.5, 3)}")
g1 = chains(pts("27-1.txt"), 1.0)
expect(
    f,
    f"слева {len(min(g1, key=lambda g: sum(p[0] for p in g) / len(g)))} точек, справа "
    f"{len(max(g1, key=lambda g: sum(p[0] for p in g) / len(g)))}",
)
g3 = chains([(float(r[0]), float(r[1]), r[2]) for r in stars], 0.8)
expect(f, "8. " + ", ".join(str(len(g)) for g in sorted(g3, key=len)))
for k, a in [(355, "да"), (5, "да"), (15, "нет"), (335, "нет")]:
    same(f"сектор 340+30 {k}", "да" if (k - 340) % 360 <= 30 else "нет", a)

# --- 4. Центр ---
f = "04-centr-klastera.md"
line = [(0, 0), (4, 0), (5, 0), (6, 0), (20, 0)]
c = center(line)
expect(f, f"1. `({c[0]}, {c[1]})`: сумма {fsum(d(c, p) for p in line):g}")
sq5 = [(0, 0), (4, 0), (4, 3), (0, 3), (1, 1)]
c = center(sq5)
expect(f, f"2. `({c[0]}, {c[1]})`: сумма ≈ {ru(fsum(d(c, p) for p in sq5), 3)}")
l4 = [(0, 0), (1, 0), (2, 0), (6, 0), (20, 0)]
c1 = center(l4)
c2 = center(l4, lambda a, b: d(a, b) ** 2)
expect(f, f"4. По сумме расстояний — `({c1[0]}, {c1[1]})`")
expect(f, f"по сумме квадратов — `({c2[0]}, {c2[1]})`")
m6 = [(2, 6), (3, 6), (3, 1), (4, 2)]
ce = center(m6)
cm = center(m6, lambda a, b: abs(a[0] - b[0]) + abs(a[1] - b[1]))
expect(f, f"Евклидово — `({ce[0]}, {ce[1]})`")
expect(f, f"манхэттенское — `({cm[0]}, {cm[1]})`")
expect(f, f"6000² = {6000**2:,}".replace(",", " "))
expect(f, f"3 · 2000² = {3 * 2000**2:,}".replace(",", " "))
left = min(g1, key=lambda g: sum(p[0] for p in g))
c = center(left)
expect(f, f"8. {i4(c[0])} {i4(c[1])}")


def energy(r):
    return float(r[4]) * (float(r[2]) ** 2 + float(r[3]) ** 2) / 2


def energy_groups(parts):
    """Sort by energy and cut at the three largest gaps."""
    srt = sorted(parts, key=energy)
    gaps = sorted(range(len(srt) - 1), key=lambda i: energy(srt[i + 1]) - energy(srt[i]))[-3:]
    groups, start = [], 0
    for i in sorted(gaps):
        groups.append(srt[start : i + 1])
        start = i + 1
    groups.append(srt[start:])
    return groups


eg = energy_groups(parts)
same("ширина групп энергии ≤ 2", all(energy(g[-1]) - energy(g[0]) <= 2 for g in eg), True)
ec = [center(g, lambda a, b: abs(energy(a) - energy(b)), key=lambda r: r) for g in eg]
expect(f, f"9. {i4(energy(ec[0]))}:")

# --- 5. Ответ по центрам ---
f = "05-otvet-po-centram.md"
expect(f, f"1. `({(-2 + 6) // 2}, {(4 + 10) // 2})`")
expect(f, f"2. {abs(min(-5, 2, 4))} и {abs(min(3, -7, 1))}")
expect(f, f"среднее равно {(2 + 3 + 7) // 3}")
expect(f, f"4. {int(-2.718281 * 10000)} ".replace("-", "−"))
expect(f, f", {math.floor(-2.718281 * 10000)} ".replace("-", "−"))
expect(f, "6. 14, 13 и 11")
yd = [sum(1 for s in g if s[2] != "VII" and s[2][0] == "G" and s[2][2:] == "V") for g in g3]
same("жёлтые карлики по кластерам (по размеру)", yd, [14, 13, 11])
expect(f, f"больше всего — в нижнем кластере из {len(g3[0])} звезды")
c1s = [center(g) for g in g1]
expect(f, f"7. {i4(fsum(c[0] for c in c1s) / 2)} {i4(fsum(c[1] for c in c1s) / 2)}")
g2 = chains(pts("27-2.txt"), 1.0)
big3 = [g for g in g2 if len(g) > 10]
same("27-2: аномалии", sum(len(g) for g in g2 if len(g) <= 10), 3)
c2s = [center(g) for g in big3]
expect(f, f"а) {i4(abs(min(c[0] for c in c2s)))} {i4(abs(min(c[1] for c in c2s)))}")
rest = sorted(big3, key=len)[1:]
rc = [center(g) for g in rest]
expect(f, f"б) {i4(fsum(c[0] for c in rc) / 2)} {i4(fsum(c[1] for c in rc) / 2)}")

# --- 6. Расстояния и пары ---
f = "06-rasstoyaniya-i-pary.md"
a, b = [(0, 0), (1, 0)], [(4, 0), (6, 0)]
ds = [d(p, q) for p in a for q in b]
expect(f, f"1. Минимальное — {min(ds):g}, максимальное — {max(ds):g}")
t3 = [(0, 0), (4, 0), (4, 3)]
c = center(t3)
diam = max(d(p, q) for p in t3 for q in t3)
expect(f, f"3. Центр `({c[0]}, {c[1]})`")
expect(f, f"радиус {max(d(c, p) for p in t3):g}, диаметр {diam:g}")
pl = [(0, 0), (1, 0), (3, 0), (4, 0), (10, 0)]
cc = (1, 0)
expect(f, f"4. {sum(d(cc, p) <= 3 for p in pl)} (сам центр")
expect(f, f"; {sum(d(cc, p) < 3 for p in pl)} (`(4, 0)`")
small3 = g3[-1]
dm = max(d(p, q) for p in small3 for q in small3)
expect(f, f"6. ≈ {ru(dm, 3)}")
cs3 = {id(g): center(g) for g in g3}
rg = [s for s in small3 if s[2] != "VII" and s[2][0] == "M" and s[2][2:] == "III"]
nr = min(rg, key=lambda s: d(s, cs3[id(small3)]))
expect(f, f"7. {i4(nr[0])} {i4(nr[1])}")


def count_kind(g, cls, lum):
    return sum(1 for s in g if s[2] != "VII" and s[2][0] == cls and s[2][2:] == lum)


lo = min(g3, key=lambda g: count_kind(g, "M", "III"))
hi = max(g3, key=lambda g: count_kind(g, "M", "III"))
b1 = d(cs3[id(lo)], cs3[id(hi)])
ydp = max(
    d(p, q)
    for g in g3
    for p in g
    for q in g
    if p is not q and count_kind([p], "G", "V") and count_kind([q], "G", "V")
)
expect(f, f"8. {i4(b1)} {i4(ydp)}")
by = sorted(big3, key=len)
q1 = d(center(by[0]), center(by[-1]))
q2 = max(d(center(g), p) for g in big3 for p in g)
expect(f, f"9. {i4(q1)} {i4(q2)}")

# --- 7. Цепочки соседей ---
f = "07-cepochki-sosedej.md"
abc = [(0, 0), (0.8, 0), (1.6, 0)]
same("ε = 0.9: одна группа", len(chains(abc, 0.9)), 1)
same("ε = 0.7: три группы", len(chains(abc, 0.7)), 3)
five = [(0, 0), (1, 0), (2, 0), (5, 0), (6, 0)]
same("пять точек: 1, 2.9, 3", [len(chains(five, e)) for e in (1, 2.9, 3)], [2, 2, 1])
p5 = pts("27-5.txt")
ok = [e for e in range(1, 8) if sorted(len(g) for g in chains(p5, e)) == [69, 76, 83]]
expect(f, f"7. {max(ok)}:")
g6 = chains(pts("27-6.txt"), 0.5)
c6 = [center(g) for g in g6]
expect(f, f"8. {i4(fsum(c[0] for c in c6) / 2)} {i4(fsum(c[1] for c in c6) / 2)}")


def minimax(cl):
    return min(cl, key=lambda c: max(d(c, p) for p in cl))


# --- 8. Другие центры ---
f = "08-drugie-centry-i-uskoreniya.md"
l1 = [(0, 0), (2, 0), (3, 0), (7, 0), (12, 0)]
mm = minimax(l1)
expect(
    f,
    f"1. По минимаксу — `({mm[0]}, {mm[1]})`: самая далёкая точка на расстоянии "
    f"{max(d(mm, p) for p in l1):g}",
)
cs = center(l1)
expect(f, f"По сумме — `({cs[0]}, {cs[1]})`: сумма {fsum(d(cs, p) for p in l1):g}")
l2 = [(0, 0), (1, 0), (4, 0), (5, 0), (30, 0)]
c = center(l2, lambda a, b: d(a, b) ** 2)
expect(f, f"2. `({c[0]}, {c[1]})`")
an = [(0, 0), (1, 0), (2, 0), (10, 0)]
ac = max(an, key=lambda c: sum(d(c, p) for p in an))
expect(f, f"3. `({ac[0]}, {ac[1]})`")
expect(f, f"4. 5 · 4 / 2 = {5 * 4 // 2}; 1000 · 999 / 2 = {1000 * 999 // 2:,}".replace(",", " "))
expect(f, f"6. {d((0, 0), (6, 8)):g}, если")
rs = [max(d(minimax(g), p) for p in g) for g in g1]
expect(f, f"7. {i4(fsum(rs) / 2)}.")
sm = sorted(big3, key=len)[0]
ant = max(sm, key=lambda c: fsum(d(c, p) for p in sm))
expect(f, f"8. {i4(abs(ant[0] + ant[1]))}:")

# --- 9. Практика и итог ---
f = "09-praktika-i-itog.md"
expect(f, f"1. {i4(d(c1s[0], c1s[1]))}.")
far = max(d(center(by[0]), p) for p in by[-1])
expect(f, f"2. {i4(far)}.")
expect(f, f"3. {sum(s[2] == 'VII' for s in g3[0])}.")
q1p = max(
    hypot(float(r[0]) - float(s[0]), float(r[1]) - float(s[1]))
    for g in eg
    for r in g
    for s in g
    if r is not s and r[5] == "II" and s[5] == "II"
)
expect(f, f"4. {i4(q1p)} {i4(max(energy(c) for c in ec))}.")
sec = chains(p5, 3)
c5 = [center(g) for g in sec]
expect(f, f"5. {i4(abs(fsum(c[0] for c in c5) / 3))} {i4(abs(fsum(c[1] for c in c5) / 3))}.")

bad = [c for c in checks if not c[2]]
for f, needle, ok in checks:
    if not ok:
        print(f"FAIL {f}: {needle}")
print(f"{len(checks)} checks, {len(bad)} failed")
sys.exit(1 if bad else 0)
