"""Едва заметный фирменный знак в углу сцены: знак бренда и адрес сайта.

Знак берётся из `apps/web/public/brand/infraege-mark.svg` (три «камня»): простой разбор путей
(M, C, S, L, H, V, Z и их относительные формы) и заливка в Pillow. Знак маленький, светлый и не
должен смещать внимание с рисунка; движок предупреждает, если он задевает содержимое.
"""

import os
import re
from functools import lru_cache

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
MARK_SVG = os.path.join(HERE, "..", "..", "..", "apps", "web", "public", "brand", "infraege-mark.svg")
FONT_PATH = os.path.join(HERE, "fonts", "Neucha.ttf")

URL = "infraege.ru"
MARGIN = 26  # от правого и нижнего края, px итогового кадра
MARK_HEIGHT = 40
TEXT_SIZE = 32
GAP = 12
OPACITY = 0.5  # общая прозрачность знака
TEXT_COLOR = (140, 140, 140)
SUPER = 4  # рисуем в увеличенном виде и уменьшаем

_NUMBER = re.compile(r"-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?")
_TOKEN = re.compile(r"[MmCcSsLlHhVvZz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?")


def _cubic(p0, p1, p2, p3, steps=16):
    pts = []
    for i in range(1, steps + 1):
        t = i / steps
        u = 1 - t
        pts.append(
            (
                u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0],
                u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1],
            )
        )
    return pts


def parse_path(d):
    """Путь SVG → список подпутей-многоугольников (кривые распрямлены)."""
    tokens = _TOKEN.findall(d)
    polys, poly = [], []
    cur, start, last_c2 = (0.0, 0.0), (0.0, 0.0), None
    i, cmd = 0, None

    def num():
        nonlocal i
        value = float(tokens[i])
        i += 1
        return value

    while i < len(tokens):
        if tokens[i].isalpha():
            cmd = tokens[i]
            i += 1
            if cmd in "Zz":
                if poly:
                    polys.append(poly)
                poly, cur = [], start
                continue
        rel = cmd.islower()
        ox, oy = cur if rel else (0.0, 0.0)
        op = cmd.upper()
        if op == "M":
            cur = (ox + num(), oy + num())
            start, poly = cur, [cur]
            cmd = "l" if rel else "L"
            last_c2 = None
        elif op == "L":
            cur = (ox + num(), oy + num())
            poly.append(cur)
            last_c2 = None
        elif op == "H":
            cur = (ox + num(), cur[1])
            poly.append(cur)
            last_c2 = None
        elif op == "V":
            cur = (cur[0], oy + num() if rel else num())
            poly.append(cur)
            last_c2 = None
        elif op in "CS":
            if op == "C":
                c1 = (ox + num(), oy + num())
            else:
                c1 = (2 * cur[0] - last_c2[0], 2 * cur[1] - last_c2[1]) if last_c2 else cur
            c2 = (ox + num(), oy + num())
            end = (ox + num(), oy + num())
            poly += _cubic(cur, c1, c2, end)
            cur, last_c2 = end, c2
    if poly:
        polys.append(poly)
    return polys


@lru_cache(maxsize=1)
def load_mark():
    """[(цвет, многоугольник)] и размер viewBox знака бренда."""
    with open(MARK_SVG, encoding="utf8") as handle:
        svg = handle.read()
    view = [float(v) for v in re.search(r'viewBox="([^"]+)"', svg).group(1).split()]
    shapes = []
    for fill, d in re.findall(r'fill="(#[0-9A-Fa-f]{6})"\s+d="([^"]+)"', svg):
        rgb = tuple(int(fill[k : k + 2], 16) for k in (1, 3, 5))
        for poly in parse_path(d):
            shapes.append((rgb, poly))
    return shapes, (view[2], view[3])


@lru_cache(maxsize=1)
def brand_tile():
    """Готовая плитка знака: RGBA с прозрачностью, размеры в px итогового кадра."""
    shapes, (vw, vh) = load_mark()
    font = ImageFont.truetype(FONT_PATH, TEXT_SIZE * SUPER)
    text_w = font.getlength(URL) / SUPER
    mark_w = MARK_HEIGHT * vw / vh
    width = int(round(mark_w + GAP + text_w)) + 2
    tile = Image.new("RGBA", (width * SUPER, MARK_HEIGHT * SUPER), (255, 255, 255, 0))
    layer = Image.new("RGBA", tile.size, (255, 255, 255, 0))
    drawer = ImageDraw.Draw(layer)
    k = MARK_HEIGHT * SUPER / vh
    for rgb, poly in shapes:
        drawer.polygon([(x * k, y * k) for x, y in poly], fill=rgb + (255,))
    tile.alpha_composite(layer)
    drawer = ImageDraw.Draw(tile)
    drawer.text(
        ((mark_w + GAP) * SUPER, MARK_HEIGHT * SUPER / 2 + 2 * SUPER),
        URL,
        font=font,
        fill=TEXT_COLOR + (255,),
        anchor="lm",
    )
    alpha = tile.getchannel("A").point(lambda a: int(a * OPACITY))
    tile.putalpha(alpha)
    return tile.resize((width, MARK_HEIGHT), Image.Resampling.LANCZOS)


def brand_box(canvas_w, canvas_h):
    """Границы знака на холсте: (x0, y0, x1, y1)."""
    tile = brand_tile()
    x0 = canvas_w - MARGIN - tile.width
    y0 = canvas_h - MARGIN - tile.height
    return (x0, y0, x0 + tile.width, y0 + tile.height)


def paint_brand(image):
    """Накладывает знак в правый нижний угол готового кадра (RGB) и возвращает его же."""
    tile = brand_tile()
    x0, y0, _, _ = brand_box(*image.size)
    image.paste(tile, (x0, y0), tile)
    return image
