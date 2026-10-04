"""Prepares a generated scene PNG for tracing (trace.mjs).

Usage: python3 trace_prep.py <scene.png> <work-dir> [crop=x0,y0,x1,y1] [face=x0,y0,x1,y1]
                             [move=none|x0,y0,x1,y1/x0,y0,x1,y1...]

Crops the scene (to `crop`, or to its drawing plus a margin), splits it
into ink and orange masks at TRACE_SCALE, and lifts small free-standing
ink pieces (sparkles, light rays, pencil marks) into their own masks so the scene
can animate them. Pieces enclosed by a larger outline (eyes, keyhole) stay put;
`move` limits the moving pieces to the given boxes (source pixels) or turns
them off, so trail dashes stay still.
Face lines inside the `face` box (source pixels) leave the trace and are kept
as centrelines, so trace.mjs redraws them with the pen like the approved poses.
Writes <work-dir>/scene.json and the masks next to it.
"""

import json
import sys
from pathlib import Path

from PIL import Image

from prepare import (
    centrelines,
    components,
    face_components,
    is_accent,
    is_ink,
    line_width,
    save_mask,
)

TRACE_SCALE = 2
MARGIN = 24
SMALL = 120  # px in the source: larger pieces are part of the drawing


def move_zones(option, box):
    """Boxes (trace pixels) where pieces may move: None means anywhere."""
    if option is None:
        return None
    if option == "none":
        return []
    zones = []
    for zone in option.split("/"):
        x0, y0, x1, y1 = (int(v) for v in zone.split(","))
        dx, dy, s = box[0], box[1], TRACE_SCALE
        zones.append(((x0 - dx) * s, (y0 - dy) * s, (x1 - dx) * s, (y1 - dy) * s))
    return zones


def main():
    source, work = Path(sys.argv[1]), Path(sys.argv[2])
    options = dict(arg.split("=", 1) for arg in sys.argv[3:])
    image = Image.open(source).convert("RGB")
    if "crop" in options:
        box = tuple(int(v) for v in options["crop"].split(","))
    else:
        px = image.load()
        drawn = [
            (x, y)
            for y in range(0, image.height, 2)
            for x in range(0, image.width, 2)
            if min(px[x, y]) < 200
        ]
        xs, ys = [p[0] for p in drawn], [p[1] for p in drawn]
        box = (
            max(0, min(xs) - MARGIN),
            max(0, min(ys) - MARGIN),
            min(image.width, max(xs) + MARGIN),
            min(image.height, max(ys) + MARGIN),
        )
    crop = image.crop(box)
    big = crop.resize(
        (crop.width * TRACE_SCALE, crop.height * TRACE_SCALE), Image.LANCZOS
    )
    px = big.load()
    ink, accent = set(), set()
    for y in range(big.height):
        for x in range(big.width):
            colour = px[x, y]
            if is_accent(*colour):
                accent.add((x, y))
            elif is_ink(*colour):
                ink.add((x, y))

    enclosed_comps = face_components(big.size, ink)
    enclosed = {p for comp in enclosed_comps for p in comp}
    face = None
    if "face" in options:
        fx0, fy0, fx1, fy1 = (int(v) for v in options["face"].split(","))
        s = TRACE_SCALE
        fx0, fx1 = (fx0 - box[0]) * s, (fx1 - box[0]) * s
        fy0, fy1 = (fy0 - box[1]) * s, (fy1 - box[1]) * s
        face_px = {
            p
            for comp in enclosed_comps
            if all(fx0 <= x <= fx1 and fy0 <= y <= fy1 for x, y in comp)
            for p in comp
        }
        strokes, dots = centrelines(face_px, s, dot_max=60)
        face = {
            "width": line_width(ink - face_px, s),
            "strokes": strokes,
            "dots": dots,
        }
        ink -= face_px
    # A piece with something inside it (a checkbox with its tick) stays put.
    inner = [
        (sum(x for x, _ in comp) / len(comp), sum(y for _, y in comp) / len(comp))
        for comp in enclosed_comps
    ]
    items, still = [], set(ink)
    limit = SMALL * TRACE_SCALE
    zones = move_zones(options.get("move"), box)
    for comp in components(ink):
        xs, ys = [p[0] for p in comp], [p[1] for p in comp]
        x0, y0, x1, y1 = min(xs), min(ys), max(xs), max(ys)
        if max(x1 - x0, y1 - y0) >= limit or comp[0] in enclosed:
            continue
        if any(x0 <= cx <= x1 and y0 <= cy <= y1 for cx, cy in inner):
            continue
        if zones is not None and not any(
            zx0 <= x0 and x1 <= zx1 and zy0 <= y0 and y1 <= zy1
            for zx0, zy0, zx1, zy1 in zones
        ):
            continue
        still.difference_update(comp)
        items.append((x0, y0, x1, y1, comp))

    work.mkdir(parents=True, exist_ok=True)
    save_mask(big.size, still, work / "ink.png")
    save_mask(big.size, accent, work / "accent.png")
    meta = []
    for i, (x0, y0, x1, y1, comp) in enumerate(sorted(items)):
        pad = 6
        size = (x1 - x0 + 1 + 2 * pad, y1 - y0 + 1 + 2 * pad)
        save_mask(
            size,
            [(x - x0 + pad, y - y0 + pad) for x, y in comp],
            work / f"item-{i}.png",
        )
        s = TRACE_SCALE
        meta.append(
            {
                "x": (x0 - pad) / s,
                "y": (y0 - pad) / s,
                "cx": (x0 + x1) / 2 / s,
                "cy": (y0 + y1) / 2 / s,
                "w": (x1 - x0) / s,
                "h": (y1 - y0) / s,
            }
        )
    scene = {
        "box": box,
        "w": crop.width,
        "h": crop.height,
        "scale": TRACE_SCALE,
        "face": face,
        "items": meta,
    }
    (work / "scene.json").write_text(json.dumps(scene, indent=1))
    features = f", face {len(face['strokes'])} strokes {len(face['dots'])} dots" if face else ""
    print(f"{source.name}: {crop.width}×{crop.height}, {len(meta)} moving pieces{features}")


if __name__ == "__main__":
    main()
