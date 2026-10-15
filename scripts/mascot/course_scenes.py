"""Course scenes for the home course card, /courses cards and course heads
(Change 185).

The architect's generated pictures are coloured and shaded, so they are not
traced like the ink scenes: they ship as WebP in two widths. The Excel scene
runs on a diagonal; turned 6 degrees clockwise it lies flat and fits a card
whole. Usage:

    python3 course_scenes.py ../../docs/artifacts/references/for_new_design \
        ../../apps/web/public/images/courses
"""

import sys
from pathlib import Path

from PIL import Image

SCENES = {
    "python": ("python_course.png", 0),
    "excel": ("excel_course.png", -6),
    "algorithms-data-structures": ("algos_and_stucts_course.png", 0),
    "advanced-problems": ("strong_exercisies_course.png", 0),
}
WIDTHS = (960, 1600)
MARGIN = 12


def prepare(path: Path, angle: int) -> Image.Image:
    image = Image.open(path).convert("RGB")
    if angle:
        image = image.rotate(angle, Image.BICUBIC, expand=True, fillcolor="white")
    # Crop to the drawing with a small white margin: nothing of it is cut.
    ink = image.convert("L").point(lambda value: 255 if value < 235 else 0)
    left, top, right, bottom = ink.getbbox()
    return image.crop(
        (
            max(0, left - MARGIN),
            max(0, top - MARGIN),
            min(image.width, right + MARGIN),
            min(image.height, bottom + MARGIN),
        )
    )


def main() -> None:
    source, target = (Path(arg) for arg in sys.argv[1:3])
    target.mkdir(parents=True, exist_ok=True)
    for name, (file, angle) in SCENES.items():
        image = prepare(source / file, angle)
        for width in WIDTHS:
            height = round(image.height * width / image.width)
            out = target / f"course-{name}-{width}.webp"
            image.resize((width, height), Image.LANCZOS).save(out, "WEBP", quality=80, method=6)
            print(f"{out.name} {width}x{height} {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
