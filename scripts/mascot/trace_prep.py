"""Prepares a generated scene PNG for tracing (trace.mjs).

Usage: python3 trace_prep.py <scene.png> <work-dir> [crop=x0,y0,x1,y1] [face=x0,y0,x1,y1]
                             [move=none|x0,y0,x1,y1/x0,y0,x1,y1...]

Crops the scene (to `crop`, or to its drawing plus a margin), splits it
into ink and orange masks at TRACE_SCALE, and lifts small free-standing
ink pieces (sparkles, light rays, pencil marks) into their own masks so the scene
can animate them. Pieces enclosed by a larger outline (eyes, keyhole) stay put;
`move` limits the moving pieces to the given boxes (source pixels) or turns
them off, so trail dashes stay still.
Coloured lines other than the orange accent (yellow, green, blue, light grey;
Change 192) go to their own masks, traced in their mean colour.
Face lines inside the `face` box (source pixels) leave the trace and are kept
as centrelines, so trace.mjs redraws them with the pen like the approved poses.
Writes <work-dir>/scene.json and the masks next to it.
"""

import colorsys
import json
import sys
from pathlib import Path

from PIL import Image, ImageFilter
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
TINT_MIN = 40  # px in the trace: smaller colour specks are anti-aliasing
# Hue bands (degrees) of the extra colour layers; orange stays the accent.
HUES = {"yellow": (38, 70), "green": (75, 170), "blue": (185, 260)}


def is_yellow(r, g, b):
    """A dark yellow edge passes the accent test; its hue tells it apart."""
    return colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)[0] * 360 > 34


def is_neutral(r, g, b):
    """A mid-grey pixel: a grey line, or the soft edge of a black one."""
    _, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    return s < 0.12 and 0.3 < v < 0.8


def tint_of(r, g, b):
    """Colour layer of a pixel that is neither ink nor accent; grey is found by region."""
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    if s > 0.35 and v > 0.3:
        for name, (lo, hi) in HUES.items():
            if lo <= h * 360 <= hi:
                return name
    return None


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
    big = crop.resize((crop.width * TRACE_SCALE, crop.height * TRACE_SCALE), Image.LANCZOS)
    px = big.load()
    ink, accent, core, neutral = set(), set(), set(), set()
    tints = {name: set() for name in (*HUES, "grey")}
    for y in range(big.height):
        for x in range(big.width):
            colour = px[x, y]
            if max(colour) < 80:
                core.add((x, y))
            elif is_neutral(*colour):
                neutral.add((x, y))
            if is_accent(*colour) and not is_yellow(*colour):
                accent.add((x, y))
            elif is_ink(*colour) and tint_of(*colour) is None:
                ink.add((x, y))
            elif (name := tint_of(*colour)) is not None:
                tints[name].add((x, y))
    # The soft edge of every black line is grey too, and the darker middle of
    # a grey line passes the ink test: a grey line is grey away from any black
    # core, whatever its shade, and leaves the ink.
    if neutral:
        core_mask = Image.new("L", big.size, 0)
        cm = core_mask.load()
        for x, y in core:
            cm[x, y] = 255
        near = core_mask.filter(ImageFilter.MaxFilter(11)).load()
        tints["grey"] = {(x, y) for x, y in neutral if not near[x, y]}
        ink -= tints["grey"]
    for pixels in tints.values():
        for comp in components(set(pixels)):
            if len(comp) < TINT_MIN:
                pixels.difference_update(comp)

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
            zx0 <= x0 and x1 <= zx1 and zy0 <= y0 and y1 <= zy1 for zx0, zy0, zx1, zy1 in zones
        ):
            continue
        still.difference_update(comp)
        items.append((x0, y0, x1, y1, comp))

    work.mkdir(parents=True, exist_ok=True)
    save_mask(big.size, still, work / "ink.png")
    save_mask(big.size, accent, work / "accent.png")
    tint_layers = []
    for name, pixels in tints.items():
        if not pixels:
            continue
        mean = [round(sum(px[x, y][c] for x, y in pixels) / len(pixels)) for c in range(3)]
        save_mask(big.size, pixels, work / f"tint-{name}.png")
        tint_layers.append(
            {"file": f"tint-{name}.png", "fill": "#" + "".join(f"{c:02x}" for c in mean)}
        )
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
        "tints": tint_layers,
    }
    (work / "scene.json").write_text(json.dumps(scene, indent=1))
    features = f", face {len(face['strokes'])} strokes {len(face['dots'])} dots" if face else ""
    colours = f", colours {' '.join(t['fill'] for t in tint_layers)}" if tint_layers else ""
    print(
        f"{source.name}: {crop.width}×{crop.height}, {len(meta)} moving pieces{features}{colours}"
    )


if __name__ == "__main__":
    main()
