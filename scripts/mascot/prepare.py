"""Prepare mascot poses from the generated character sheet.

Cuts the sheet into poses, separates black ink from the orange accent, removes the face
(eyes, mouth, brows) from the body mask and extracts face centrelines for the pen.

Usage: python3 prepare.py <sheet.png> <work-dir>
Writes <work-dir>/masks/<pose>-body.png, <pose>-accent.png and <work-dir>/faces.json.
Requires Pillow.
"""

import json
import math
import sys
from collections import deque
from pathlib import Path

from PIL import Image

# Sheet layout, row by row, left to right.
POSE_NAMES = [
    ["front", "side", "back"],
    ["stand", "wave", "point", "jump", "lotus"],
    ["happy", "think", "sad", "surprised", "calm"],
]
TRACE_SCALE = 4  # masks for potrace
LINE_SCALE = 2  # masks for centrelines
N8 = [(-1, -1), (0, -1), (1, -1), (1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0)]


def is_accent(r, g, b):
    return r > 170 and g < 170 and b < 140 and r - g > 60


def is_ink(r, g, b):
    return max(r, g, b) < 135


# ---------- cutting ----------


def bands(flags, gap):
    out, start, last = [], None, None
    for i, on in enumerate(flags):
        if not on:
            continue
        if start is None:
            start = i
        elif i - last > gap:
            out.append((start, last))
            start = i
        last = i
    if start is not None:
        out.append((start, last))
    return out


def cut_sheet(sheet):
    width, height = sheet.size
    px = sheet.load()

    def dark(x, y):
        return min(px[x, y]) < 170

    rows = bands([any(dark(x, y) for x in range(0, width, 2)) for y in range(height)], 18)
    crops = {}
    for row_index, (y0, y1) in enumerate(rows):
        cols = bands([any(dark(x, y) for y in range(y0, y1 + 1, 2)) for x in range(width)], 30)
        for col_index, (x0, x1) in enumerate(cols):
            name = POSE_NAMES[row_index][col_index]
            crops[name] = sheet.crop((x0 - 12, y0 - 12, x1 + 13, y1 + 13))
    return crops


def split_colours(crop, scale):
    image = crop.resize((crop.width * scale, crop.height * scale), Image.LANCZOS)
    px = image.load()
    ink, accent = set(), set()
    for y in range(image.height):
        for x in range(image.width):
            if is_accent(*px[x, y]):
                accent.add((x, y))
            elif is_ink(*px[x, y]):
                ink.add((x, y))
    return image.size, ink, accent


def save_mask(size, pixels, path):
    mask = Image.new("L", size, 255)
    mp = mask.load()
    for x, y in pixels:
        mp[x, y] = 0
    mask.save(path)


# ---------- face separation ----------


def components(pixels):
    seen, out = set(), []
    for start in pixels:
        if start in seen:
            continue
        stack, comp = [start], []
        seen.add(start)
        while stack:
            u = stack.pop()
            comp.append(u)
            for dx, dy in N8:
                v = (u[0] + dx, u[1] + dy)
                if v in pixels and v not in seen:
                    seen.add(v)
                    stack.append(v)
        out.append(comp)
    return out


def face_components(size, ink):
    """Ink components enclosed by the body outline: they never touch the outside background."""
    width, height = size
    outside, queue = set(), deque()
    for x in range(width):
        for y in (0, height - 1):
            if (x, y) not in ink:
                outside.add((x, y))
                queue.append((x, y))
    for y in range(height):
        for x in (0, width - 1):
            if (x, y) not in ink and (x, y) not in outside:
                outside.add((x, y))
                queue.append((x, y))
    while queue:
        x, y = queue.popleft()
        for v in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= v[0] < width and 0 <= v[1] < height and v not in ink and v not in outside:
                outside.add(v)
                queue.append(v)
    faces = []
    for comp in components(ink):
        touches = any(
            (x + dx, y + dy) in outside or not (0 <= x + dx < width and 0 <= y + dy < height)
            for x, y in comp
            for dx, dy in N8
        )
        if not touches and len(comp) < width * height * 0.01:
            faces.append(comp)
    return faces


# ---------- centrelines ----------


def thin(pixels):
    """Zhang-Suen thinning."""
    px = set(pixels)
    order = [(0, -1), (1, -1), (1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0), (-1, -1)]
    changed = True
    while changed:
        changed = False
        for step in (0, 1):
            remove = []
            for x, y in px:
                n = [(x + dx, y + dy) in px for dx, dy in order]
                count = sum(n)
                if count < 2 or count > 6:
                    continue
                if sum((not n[i]) and n[(i + 1) % 8] for i in range(8)) != 1:
                    continue
                p2, _, p4, _, p6, _, p8, _ = n
                if step == 0 and (p2 and p4 and p6 or p4 and p6 and p8):
                    continue
                if step == 1 and (p2 and p4 and p8 or p2 and p6 and p8):
                    continue
                remove.append((x, y))
            if remove:
                changed = True
                px.difference_update(remove)
    return px


def neighbours(px, u):
    # A diagonal step is dropped when a 4-connected detour exists (staircase corners).
    out = []
    for dx, dy in N8:
        v = (u[0] + dx, u[1] + dy)
        if v not in px:
            continue
        if dx and dy and ((u[0] + dx, u[1]) in px or (u[0], u[1] + dy) in px):
            continue
        out.append(v)
    return out


def skeleton_paths(sk):
    degree = {u: len(neighbours(sk, u)) for u in sk}
    nodes = {u for u in sk if degree[u] != 2}
    used, out = set(), []

    def key(a, b):
        return (a, b) if a < b else (b, a)

    for node in nodes:
        for v in neighbours(sk, node):
            if key(node, v) in used:
                continue
            path, prev, cur = [node, v], node, v
            used.add(key(node, v))
            while cur not in nodes:
                nxt = [w for w in neighbours(sk, cur) if w != prev and key(cur, w) not in used]
                if not nxt:
                    break
                used.add(key(cur, nxt[0]))
                path.append(nxt[0])
                prev, cur = cur, nxt[0]
            out.append(path)
    rest = {
        u for u in sk if u not in nodes and not any(key(u, w) in used for w in neighbours(sk, u))
    }
    while rest:
        start = next(iter(rest))
        rest.discard(start)
        path, cur = [start], start
        while True:
            nxt = [w for w in neighbours(sk, cur) if w in rest]
            if not nxt:
                break
            cur = nxt[0]
            rest.discard(cur)
            path.append(cur)
        path.append(path[0])
        out.append(path)
    return out


def simplify(pts, eps):
    """Ramer-Douglas-Peucker."""
    if len(pts) < 3:
        return pts
    a, b = pts[0], pts[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    length = math.hypot(dx, dy)
    index, dist = 0, 0
    for k in range(1, len(pts) - 1):
        if length > 1e-6:
            d = abs(dy * pts[k][0] - dx * pts[k][1] + b[0] * a[1] - b[1] * a[0]) / length
        else:
            d = math.hypot(pts[k][0] - a[0], pts[k][1] - a[1])
        if d > dist:
            index, dist = k, d
    if dist > eps:
        return simplify(pts[: index + 1], eps)[:-1] + simplify(pts[index:], eps)
    return [a, b]


def centrelines(pixels, scale, dot_max=36):
    """Strokes (centrelines with measured width) and dots for the given ink pixels."""
    dots, skeleton, widths = [], set(), {}
    for comp in components(pixels):
        if len(comp) < 25:
            continue
        xs, ys = [u[0] for u in comp], [u[1] for u in comp]
        bw, bh = max(xs) - min(xs) + 1, max(ys) - min(ys) + 1
        if (
            max(bw, bh) < dot_max
            and len(comp) / (bw * bh) > 0.5
            and max(bw, bh) / min(bw, bh) < 2.2
        ):
            dots.append(
                [
                    sum(xs) / len(comp) / scale,
                    sum(ys) / len(comp) / scale,
                    bw / 2 / scale,
                    bh / 2 / scale,
                ]
            )
            continue
        sk = thin(comp)
        skeleton |= sk
        width = len(comp) / max(1, len(sk))
        for u in comp:
            widths[u] = width
    strokes = []
    for path in skeleton_paths(skeleton):
        closed = (
            math.hypot(path[0][0] - path[-1][0], path[0][1] - path[-1][1]) < 3 and len(path) > 20
        )
        pts = simplify([(x / scale, y / scale) for x, y in path], 0.7)
        sample = [widths.get(u, 0) for u in path[:: max(1, len(path) // 8)]]
        strokes.append(
            {
                "pts": [[round(x, 1), round(y, 1)] for x, y in pts],
                "closed": closed,
                "w": round(sum(sample) / len(sample) / scale, 2),
            }
        )
    return strokes, [[round(v, 1) for v in d] for d in dots]


def line_width(pixels, scale):
    """Average stroke width of a whole layer: area divided by skeleton length."""
    total_area, total_length = 0, 0
    for comp in components(pixels):
        if len(comp) >= 25:
            total_area += len(comp)
            total_length += len(thin(comp))
    return round(total_area / max(1, total_length) / scale, 2)


def main():
    sheet_path, work = Path(sys.argv[1]), Path(sys.argv[2])
    (work / "masks").mkdir(parents=True, exist_ok=True)
    crops = cut_sheet(Image.open(sheet_path).convert("RGB"))
    faces = {}
    for name, crop in crops.items():
        size, ink, accent = split_colours(crop, TRACE_SCALE)
        face_px = set(p for comp in face_components(size, ink) for p in comp)
        save_mask(size, ink - face_px, work / "masks" / f"{name}-body.png")
        save_mask(size, accent, work / "masks" / f"{name}-accent.png")

        # Face lines at the centreline scale: the same features, located through the trace mask.
        _, ink2, _ = split_colours(crop, LINE_SCALE)
        ratio = TRACE_SCALE // LINE_SCALE
        face2 = {
            (x, y)
            for x, y in ink2
            if (x * ratio, y * ratio) in face_px or (x * ratio + 1, y * ratio + 1) in face_px
        }
        strokes, dots = centrelines(face2, LINE_SCALE)
        faces[name] = {
            "w": crop.width,
            "h": crop.height,
            "width": line_width(ink2 - face2, LINE_SCALE),
            "strokes": strokes,
            "dots": dots,
        }
        print(f"{name}: {len(strokes)} face strokes, {len(dots)} dots", flush=True)
    (work / "faces.json").write_text(json.dumps(faces))


if __name__ == "__main__":
    main()
