"""Рисование «от руки» для роликов и иллюстраций уроков.

Только Pillow. Все случайности задаются seed, поэтому один и тот же сценарий даёт одни и те же
кадры. Манера описана в STYLE.md: неровные линии переменной толщины с разрывами у концов,
окружности с перехлёстом, штриховые рамки, рукописные заглавные буквы с дрожью и наклоном.
"""

import math
import os
import random

from PIL import Image, ImageDraw, ImageFont

import brand as brand_mark

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_PATH = os.path.join(HERE, "fonts", "Neucha.ttf")
LETTER_STROKE = 0.7  # добавочная толщина букв, px на холсте 1600
# Знаки, которых нет в Neucha, но которые рисуются из имеющихся: основной знак и черта под ним.
COMPOSED = {"\u2265": ">", "\u2264": "<"}
WOBBLE = 0.65  # общая неровность линий, рамок и окружностей (1 — как в первых роликах)
MIN_TEXT_SIZE = 48  # мельче на телефоне не читается (холст 1600 px сжимается примерно до 350 px)

SS = 2  # рисуем в двойном разрешении, затем уменьшаем
INK = (26, 26, 26)
ACCENT = (255, 106, 0)  # --theme-brand-orange
PAPER = (255, 255, 255)
LINE = 6 * SS  # базовая толщина линии


def lerp_color(a, b, t):
    return tuple(round(x + (y - x) * t) for x, y in zip(a, b))


def ease(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


VANISH = 0.5  # секунд на исчезновение элемента


def _vanish(col, vanish_at, t):
    """Цвет с учётом исчезновения элемента к моменту vanish_at; None — уже невидим."""
    if vanish_at is None or t < vanish_at:
        return col
    k = (t - vanish_at) / VANISH
    return None if k >= 1 else lerp_color(col, PAPER, ease(k))


def _length(pts):
    return sum(math.dist(a, b) for a, b in zip(pts, pts[1:]))


def wobble(pts, rng, amp=2.2, step=10):
    """Разбивает ломаную на мелкие отрезки и сдвигает точки по нормали плавным шумом."""
    samples = []
    for a, b in zip(pts, pts[1:]):
        n = max(2, int(math.dist(a, b) / step))
        for i in range(n):
            samples.append(
                (
                    a[0] + (b[0] - a[0]) * i / n,
                    a[1] + (b[1] - a[1]) * i / n,
                    b[0] - a[0],
                    b[1] - a[1],
                )
            )
    samples.append((*pts[-1], pts[-1][0] - pts[-2][0], pts[-1][1] - pts[-2][1]))
    amp *= WOBBLE
    f1, f2 = rng.uniform(0.02, 0.05), rng.uniform(0.025, 0.05)
    p1, p2 = rng.uniform(0, 6.28), rng.uniform(0, 6.28)
    a1, a2 = amp * rng.uniform(0.7, 1.1), amp * rng.uniform(0.1, 0.25)
    out = []
    for i, (x, y, dx, dy) in enumerate(samples):
        length = math.hypot(dx, dy) or 1
        nx, ny = -dy / length, dx / length
        off = a1 * math.sin(i * f1 * step + p1) + a2 * math.sin(i * f2 * step + p2)
        out.append((x + nx * off * SS, y + ny * off * SS))
    return out


def _trim(pts, t0, t1):
    """Оставляет часть ломаной по длине от t0 до t1 (разрывы у концов, как в книге)."""
    acc = [0.0]
    for a, b in zip(pts, pts[1:]):
        acc.append(acc[-1] + math.dist(a, b))
    lo, hi = t0 * acc[-1], t1 * acc[-1]
    kept = [p for p, d in zip(pts, acc) if lo <= d <= hi]
    return kept if len(kept) > 1 else pts


def _pressure(n, rng):
    """Коэффициенты толщины вдоль штриха: нажим меняется плавно."""
    p1, p2 = rng.uniform(0, 6.28), rng.uniform(0, 6.28)
    return [
        1 + 0.16 * math.sin(i * 0.23 + p1) + 0.08 * math.sin(i * 0.61 + p2)
        for i in range(n)
    ]


def line(a, b, rng):
    a, b = (a[0] * SS, a[1] * SS), (b[0] * SS, b[1] * SS)
    pts = wobble([a, b], rng)
    return [_trim(pts, rng.uniform(0, 0.03), 1 - rng.uniform(0, 0.03))]


def circle(center, r, rng, overshoot=True):
    """Окружность, нарисованная одним движением: концы расходятся, радиус «плывёт»."""
    cx, cy, r = center[0] * SS, center[1] * SS, r * SS
    a0 = rng.uniform(0, 6.28)
    sweep = 6.28 + (rng.uniform(0.12, 0.38) if overshoot else 0)
    ph, ph2 = rng.uniform(0, 6.28), rng.uniform(0, 6.28)
    pts = []
    n = 64
    for i in range(n + 1):
        t = i / n
        a = a0 + sweep * t
        rr = (
            r * (1 + WOBBLE * (0.022 * math.sin(a * 2 + ph) + 0.012 * math.sin(a * 3 + ph2)))
            + 0.9 * SS * t
        )
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return [pts]


def dashed_ellipse(center, rx, ry, rng):
    """Штриховая рамка вокруг группы: штрихи и промежутки разной длины."""
    cx, cy = center[0] * SS, center[1] * SS
    n = 220
    ph = rng.uniform(0, 6.28)
    pts = []
    for i in range(n + 1):
        a = 6.28 * i / n
        k = 1 + WOBBLE * 0.03 * math.sin(a * 2 + ph)
        pts.append((cx + rx * SS * k * math.cos(a), cy + ry * SS * k * math.sin(a)))
    strokes, i = [], 0
    while i < n - 6:
        dash = rng.randint(7, 11)
        strokes.append(pts[i : i + dash + 1])
        i += dash + rng.randint(4, 6)
    return strokes


def arrow_head(tip, angle, rng, size=20):
    """Два коротких штриха «ёлочкой», направленных по angle."""
    tx, ty = tip[0] * SS, tip[1] * SS
    out = []
    for s in (0.5, -0.5):
        k = size * SS * rng.uniform(0.9, 1.1)
        out.append(
            [(tx, ty), (tx - k * math.cos(angle + s), ty - k * math.sin(angle + s))]
        )
    return out


def arrow(a, b, rng, head=True):
    """Прямая стрелка от a к b с неровной линией и наконечником."""
    strokes = line(a, b, rng)
    if head:
        angle = math.atan2(b[1] - a[1], b[0] - a[0])
        strokes += arrow_head(b, angle, rng)
    return strokes


def curve(p0, p1, p2, rng, head=True):
    """Изогнутая стрелка (квадратичная кривая) с наконечником в p2."""
    pts = []
    for i in range(41):
        t = i / 40
        pts.append(
            (
                ((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0]) * SS,
                ((1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]) * SS,
            )
        )
    chord = math.dist(pts[0], pts[-1]) / SS
    strokes = [wobble(pts, rng, amp=min(1.5, chord / 120))]
    if head:
        bx, by = pts[-4]
        strokes += arrow_head(p2, math.atan2(p2[1] * SS - by, p2[0] * SS - bx), rng)
    return strokes


def underline(x0, x1, y, rng):
    """Подчёркивание надписи: слегка наклонная неровная линия."""
    tilt = rng.uniform(-4, 4) * WOBBLE
    return line((x0, y), (x1, y + tilt), rng)


def polyline(points, rng, amp=2.0):
    """Неровная ломаная по заданным точкам одним штрихом (график, ломаная стрелка)."""
    pts = [(x * SS, y * SS) for x, y in points]
    return [wobble(pts, rng, amp=amp)]


def box(x0, y0, x1, y1, rng, radius=16):
    """Рамка со скруглёнными углами одним движением: концы расходятся (таблица, карточка)."""
    r = radius
    corners = [
        (x0 + r, y0), (x1 - r, y0), (x1, y0 + r), (x1, y1 - r),
        (x1 - r, y1), (x0 + r, y1), (x0, y1 - r), (x0, y0 + r),
    ]
    start = rng.randint(0, 3) * 2
    order = corners[start:] + corners[:start]
    order = order + order[:2]  # перехлёст в начале: рука не попадает точно в начало
    pts = []
    for i in range(0, len(order) - 1, 2):
        a, b = order[i], order[i + 1]
        pts += [a, b]
    return [wobble([(x * SS, y * SS) for x, y in pts], rng, amp=1.6)]


def cross_out(x0, y0, x1, y1, rng):
    """Зачёркивание крест-накрест двумя быстрыми штрихами."""
    return line((x0, y0), (x1, y1), rng) + line((x1, y0 + rng.uniform(-4, 4)), (x0, y1), rng)


def check_mark(center, size, rng):
    """Галочка одним штрихом из двух неровных отрезков."""
    cx, cy = center
    pts = [(cx - size * 0.5, cy), (cx - size * 0.15, cy + size * 0.4), (cx + size * 0.55, cy - size * 0.45)]
    return polyline(pts, rng, amp=1.2)


def axes(origin, width, height, rng):
    """Оси графика со стрелками: вправо на width и вверх на height от origin."""
    ox, oy = origin
    return arrow((ox, oy), (ox + width, oy), rng) + arrow((ox, oy), (ox, oy - height), rng)


def number_line(x0, x1, y, ticks, rng, tick_len=22, head=True):
    """Числовая ось слева направо со стрелкой и засечками в точках ticks (координаты x)."""
    strokes = arrow((x0, y), (x1, y), rng, head=head)
    for x in ticks:
        strokes += line((x, y - tick_len / 2), (x, y + tick_len / 2), rng)
    return strokes


def text_width(text, size, font_path=None):
    """Ширина строки в px итогового кадра (для расстановки соседних надписей и зачёркиваний)."""
    font = ImageFont.truetype(font_path or FONT_PATH, size * SS)
    return sum(font.getlength(ch) for ch in text) / SS


def glyph_support(text, font_path=None):
    """Символы текста, которых не получится нарисовать (нет глифа и нет составной замены)."""
    font = ImageFont.truetype(font_path or FONT_PATH, 40)
    return sorted(
        {
            ch
            for ch in text
            if ch not in " \n" and ch not in COMPOSED and font.getmask(ch).getbbox() is None
        }
    )


class Ink:
    """Штрихи, которые прорисовываются от t0 за dur секунд; цвет может смениться на акцент."""

    def __init__(self, strokes, t0, dur, rng, color=INK, accent_at=None, width=LINE):
        self.vanish_at = None
        self.strokes, self.t0, self.dur = strokes, t0, dur
        self.color, self.accent_at, self.width = color, accent_at, width
        self.pressure = [_pressure(len(s), rng) for s in strokes]
        self.lengths = [_length(s) for s in strokes]

    @property
    def end(self):
        return self.t0 + self.dur

    def bbox(self):
        """Границы штрихов на холсте (px итогового кадра, с учётом толщины линии)."""
        xs = [x for s in self.strokes for x, _ in s]
        ys = [y for s in self.strokes for _, y in s]
        half = self.width / 2
        return ((min(xs) - half) / SS, (min(ys) - half) / SS, (max(xs) + half) / SS, (max(ys) + half) / SS)

    def color_at(self, t):
        col = self.color
        if self.accent_at is not None and t >= self.accent_at:
            col = lerp_color(col, ACCENT, ease((t - self.accent_at) / 0.25))
        return _vanish(col, self.vanish_at, t)

    def draw(self, im, d, t):
        p = ease((t - self.t0) / self.dur) if self.dur else float(t >= self.t0)
        if p <= 0:
            return
        want = p * sum(self.lengths)
        col = self.color_at(t)
        if col is None:
            return
        for pts, press, length in zip(self.strokes, self.pressure, self.lengths):
            if want <= 0:
                break
            take = min(want, length)
            want -= take
            acc = 0.0
            for i, (a, b) in enumerate(zip(pts, pts[1:])):
                seg = math.dist(a, b)
                if acc + seg > take:
                    k = (take - acc) / seg if seg else 0
                    b = (a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k)
                w = self.width * press[i]
                d.line([a, b], fill=col, width=round(w))
                r = w / 2
                d.ellipse((b[0] - r, b[1] - r, b[0] + r, b[1] + r), fill=col)
                if acc + seg >= take:
                    break
                acc += seg


class Text:
    """Рукописные заглавные: буквы дрожат по высоте и слегка наклонены, печатаются по одной."""

    def __init__(
        self,
        text,
        center,
        size,
        t0,
        dur,
        rng,
        color=INK,
        accent_at=None,
        anchor="c",
        line_gap=1.0,
        font_path=None,
    ):
        font = ImageFont.truetype(font_path or FONT_PATH, size * SS)
        self.size = size
        self.vanish_at = None
        self.t0, self.dur, self.color, self.accent_at = t0, dur, color, accent_at
        self.glyphs = []
        self.chars = [ch for ch in text if ch not in " \n"]
        lines = text.split("\n")
        height = size * SS * 0.95 * line_gap
        y0 = center[1] * SS - height * (len(lines) - 1) / 2
        for li, row in enumerate(lines):
            width = sum(font.getlength(ch) for ch in row)
            x = center[0] * SS - (width / 2 if anchor == "c" else 0)
            for ch in row:
                adv = font.getlength(ch)
                if ch != " ":
                    if ch not in COMPOSED and font.getmask(ch).getbbox() is None:
                        raise ValueError(
                            f"В шрифте нет глифа {ch!r} (U+{ord(ch):04X}) для надписи {text!r}"
                        )
                    self.glyphs.append(
                        self._glyph(font, ch, x + adv / 2, y0 + li * height, size, rng)
                    )
                x += adv

    @staticmethod
    def _glyph(font, ch, cx, cy, size, rng):
        pad = size * SS
        mask = Image.new("L", (pad * 2, pad * 2), 0)
        drawer = ImageDraw.Draw(mask)
        drawer.text(
            (pad, pad),
            COMPOSED.get(ch, ch),
            font=font,
            fill=255,
            anchor="mm",
            stroke_width=round(LETTER_STROKE * SS),
            stroke_fill=255,
        )
        if ch in COMPOSED:
            half = font.getlength(COMPOSED[ch]) * 0.55
            y = pad + size * SS * 0.42
            drawer.line((pad - half, y, pad + half, y), fill=255, width=round(0.09 * size * SS))
        mask = mask.rotate(rng.uniform(-4, 4), resample=Image.Resampling.BICUBIC)
        return mask, (round(cx - pad), round(cy - pad + rng.uniform(-1.6, 1.6) * SS))

    @property
    def end(self):
        return self.t0 + self.dur

    def bbox(self):
        """Границы видимой части букв на холсте (px итогового кадра)."""
        boxes = []
        for mask, (px, py) in self.glyphs:
            b = mask.getbbox()
            if b:
                boxes.append((px + b[0], py + b[1], px + b[2], py + b[3]))
        return (
            min(b[0] for b in boxes) / SS,
            min(b[1] for b in boxes) / SS,
            max(b[2] for b in boxes) / SS,
            max(b[3] for b in boxes) / SS,
        )

    def draw(self, im, d, t):
        p = (t - self.t0) / self.dur if self.dur else float(t >= self.t0)
        if p <= 0:
            return
        col = self.color
        if self.accent_at is not None and t >= self.accent_at:
            col = lerp_color(col, ACCENT, ease((t - self.accent_at) / 0.25))
        col = _vanish(col, self.vanish_at, t)
        if col is None:
            return
        for mask, pos in self.glyphs[: math.ceil(min(1, p) * len(self.glyphs))]:
            im.paste(col, pos, mask)


class Scene:
    """Набор элементов на белом холсте; render(t) даёт кадр, poster_time — время постера.

    seed и rng(key) дают независимые потоки случайности: правка одного элемента не меняет
    «почерк» остальных. Старые сцены берут один общий random.Random и остаются прежними.
    """

    def __init__(self, width, height, fade_start, duration, seed=0, brand=True):
        self.brand = brand
        self.width, self.height = width, height
        self.fade_start, self.duration = fade_start, duration
        self.seed = seed
        self.elements = []

    def rng(self, key):
        """Независимый генератор для элемента с именем key (стабилен между запусками)."""
        return random.Random(f"{self.seed}:{key}")

    def add(self, element):
        self.elements.append(element)
        return element

    def shape(self, func, *args, key, t0=0, dur=0, color=None, width=None, accent_at=None, **geo):
        """Фигура одной строкой: `scene.shape(box, x0, y0, x1, y1, key="b1", color=ACCENT)`.

        func — примитив, последний позиционный параметр которого rng; сиды берутся из key,
        поэтому правка одной фигуры не меняет остальные.
        """
        strokes = func(*args, self.rng(f"{key}:shape"), **geo)
        kwargs = {}
        if color:
            kwargs["color"] = color
        if width:
            kwargs["width"] = width
        return self.add(Ink(strokes, t0, dur, self.rng(f"{key}:ink"), accent_at=accent_at, **kwargs))

    def label(self, text, center, size, *, key, t0=0, dur=0, **kwargs):
        """Подпись одной строкой: `scene.label("F(4)", (x, y), 72, key="t1")`."""
        kwargs = {k: v for k, v in kwargs.items() if v is not None}
        return self.add(Text(text, center, size, t0, dur, self.rng(f"{key}:text"), **kwargs))

    @property
    def settled_at(self):
        return max((e.end for e in self.elements), default=0.0)

    @property
    def poster_time(self):
        return min(self.settled_at + 0.6, self.fade_start)

    def out_of_bounds(self, margin=0):
        """Элементы, вышедшие за холст (обрезанная подпись, стрелка за краем): [(имя, границы)]."""
        bad = []
        for e in self.elements:
            x0, y0, x1, y1 = e.bbox()
            if x0 < margin or y0 < margin or x1 > self.width - margin or y1 > self.height - margin:
                what = getattr(e, "glyphs", None) is not None and "Text" or "Ink"
                bad.append((what, tuple(round(v) for v in (x0, y0, x1, y1))))
        return bad

    def small_text(self, minimum=MIN_TEXT_SIZE):
        """Надписи мельче порога читаемости на телефоне: [(размер, начало текста)]."""
        return [
            (e.size, "".join(e.chars)[:24])
            for e in self.elements
            if getattr(e, "size", minimum) < minimum
        ]

    def warnings(self):
        """Всё, на что стоит посмотреть перед публикацией сцены."""
        out = [f"{what} выходит за холст: {box}" for what, box in self.out_of_bounds()]
        out += [f"мелкая надпись {size}: {text!r}" for size, text in self.small_text()]
        out += [f"знак бренда задевает {what} {box}" for what, box in self.brand_collisions()]
        return out

    def brand_collisions(self, pad=14):
        """Элементы, подходящие к знаку бренда ближе pad px: [(имя, границы)]."""
        if not self.brand:
            return []
        bx0, by0, bx1, by1 = brand_mark.brand_box(self.width, self.height)
        hits = []
        for e in self.elements:
            x0, y0, x1, y1 = e.bbox()
            if x1 > bx0 - pad and x0 < bx1 + pad and y1 > by0 - pad and y0 < by1 + pad:
                what = getattr(e, "glyphs", None) is not None and "Text" or "Ink"
                hits.append((what, tuple(round(v) for v in (x0, y0, x1, y1))))
        return hits

    def render(self, t):
        im = Image.new("RGB", (self.width * SS, self.height * SS), PAPER)
        d = ImageDraw.Draw(im)
        for e in self.elements:
            e.draw(im, d, t)
        im = im.resize((self.width, self.height), Image.Resampling.LANCZOS)
        if self.brand:
            brand_mark.paint_brand(im)
        if t > self.fade_start and self.duration > self.fade_start:
            fade = 1 - ease((t - self.fade_start) / (self.duration - self.fade_start))
            im = Image.blend(Image.new("RGB", im.size, PAPER), im, fade)
        return im

    def render_still(self):
        """Итоговый кадр: для статичной иллюстрации и постера."""
        return self.render(self.poster_time)
