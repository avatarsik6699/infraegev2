"""Контракт движка рисования иллюстраций для уроков (docs/artifacts/lesson-media).

Запуск (нужен Pillow, ffmpeg не нужен):

    uv run --no-project --with pillow python -m unittest discover -s scripts/tests -p lesson_media_engine_test.py
"""

import os
import shutil
import subprocess
import sys
import unittest

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ENGINE = os.path.join(REPO, "docs", "artifacts", "lesson-media")
PUBLIC = os.path.join(REPO, "apps", "web", "public", "lesson-media")
sys.path.insert(0, ENGINE)

import blocks_chain  # noqa: E402
import blocks_tree  # noqa: E402
import brand  # noqa: E402
import build  # noqa: E402
import handdrawn  # noqa: E402
from PIL import Image  # noqa: E402

SCENES = build.discover()
VIDEO_SCENES = [m for m in SCENES if getattr(m, "KIND", "video") == "video"]
LESSON_SCENES = [m for m in SCENES if getattr(m, "LESSON", None)]


def is_blank(image):
    return image.convert("L").getextrema()[0] == 255


class SceneDeclarationTest(unittest.TestCase):
    def test_scenes_are_found_and_declared(self):
        names = [m.NAME for m in SCENES]
        self.assertGreaterEqual(len(names), 9)
        self.assertEqual(len(names), len(set(names)), "имена сцен должны быть уникальны")
        for module in SCENES:
            self.assertIn(getattr(module, "KIND", "video"), ("video", "still"))
            lesson = getattr(module, "LESSON", None)
            self.assertTrue(lesson is None or isinstance(lesson, str))

    def test_shipped_scenes_have_no_warnings(self):
        for module in SCENES:
            scene, meta = module.build()
            self.assertEqual(scene.warnings(), [], module.NAME)
            self.assertTrue(meta.get("alt"), f"{module.NAME}: нужен alt")

    def test_frames_are_reproducible(self):
        for module in VIDEO_SCENES:
            first, _ = module.build()
            second, _ = module.build()
            for t in (0.4, first.settled_at * 0.5, first.poster_time):
                self.assertEqual(
                    first.render(t).tobytes(), second.render(t).tobytes(), f"{module.NAME} @ {t}"
                )

    def test_poster_shows_the_settled_picture(self):
        for module in SCENES:
            scene, _ = module.build()
            self.assertGreaterEqual(scene.poster_time, min(scene.settled_at, scene.fade_start))
            self.assertLessEqual(scene.poster_time, scene.fade_start)
            self.assertFalse(is_blank(scene.render_still()), module.NAME)


class EngineTest(unittest.TestCase):
    def test_scene_rng_streams_are_independent_and_stable(self):
        a = handdrawn.Scene(100, 100, 1, 2, seed=5)
        b = handdrawn.Scene(100, 100, 1, 2, seed=5)
        b.rng("other").random()  # обращение к другому ключу не сдвигает поток "key"
        self.assertEqual(a.rng("key").random(), b.rng("key").random())
        self.assertNotEqual(a.rng("key").random(), a.rng("other").random())

    def test_missing_glyph_is_an_error(self):
        scene = handdrawn.Scene(400, 200, 1, 2)
        with self.assertRaisesRegex(ValueError, "нет глифа"):
            scene.add(handdrawn.Text("F(−1)", (200, 100), 60, 0, 0, scene.rng("t")))

    def test_out_of_bounds_and_small_text_are_reported(self):
        scene = handdrawn.Scene(300, 200, 1, 2)
        scene.add(handdrawn.Text("ДЛИННАЯ ПОДПИСЬ", (10, 100), 80, 0, 0, scene.rng("a")))
        scene.add(handdrawn.Text("МЕЛКО", (150, 50), 30, 0, 0, scene.rng("b")))
        joined = " ".join(scene.warnings())
        self.assertIn("выходит за холст", joined)
        self.assertIn("мелкая надпись 30", joined)

    def test_elements_draw_on_time_and_vanish(self):
        scene = handdrawn.Scene(300, 200, 5, 6, brand=False)
        rng = scene.rng("l")
        ink = scene.add(handdrawn.Ink(handdrawn.line((20, 100), (280, 100), rng), 1, 1, rng))
        ink.vanish_at = 3
        self.assertTrue(is_blank(scene.render(0.5)), "до появления кадр пуст")
        self.assertFalse(is_blank(scene.render(2.2)), "после появления штрих виден")
        self.assertTrue(is_blank(scene.render(3.6)), "после исчезновения кадр пуст")

    def test_composed_and_missing_symbols(self):
        self.assertEqual(handdrawn.glyph_support("n \u2265 4200 \u2264 5"), [])
        self.assertEqual(handdrawn.glyph_support("a \u2192 b \u00d7 c"), ["\u00d7", "\u2192"])
        scene = handdrawn.Scene(600, 200, 1, 2)
        scene.add(handdrawn.Text("n \u2265 4", (300, 100), 60, 0, 0, scene.rng("g")))
        self.assertFalse(is_blank(scene.render_still()))

    def test_text_width_grows_with_text_and_size(self):
        self.assertGreater(handdrawn.text_width("F(100)", 60), handdrawn.text_width("F(1)", 60))
        self.assertGreater(handdrawn.text_width("F(1)", 80), handdrawn.text_width("F(1)", 40))

    def test_number_line_has_axis_and_ticks(self):
        rng = handdrawn.Scene(10, 10, 1, 2).rng("n")
        strokes = handdrawn.number_line(50, 600, 200, [100, 300, 500], rng)
        self.assertEqual(len(strokes), 3 + 3)  # линия и два штриха наконечника + три засечки

    def test_primitives_return_drawable_strokes(self):
        rng = handdrawn.Scene(10, 10, 1, 2).rng("p")
        shapes = [
            handdrawn.box(10, 10, 200, 100, rng),
            handdrawn.polyline([(0, 0), (50, 20), (90, 10)], rng),
            handdrawn.cross_out(0, 0, 50, 50, rng),
            handdrawn.check_mark((30, 30), 40, rng),
            handdrawn.axes((20, 200), 300, 150, rng),
        ]
        for strokes in shapes:
            self.assertTrue(strokes and all(len(s) >= 2 for s in strokes))


class BrandAndStyleTest(unittest.TestCase):
    def test_brand_mark_is_painted_in_the_corner_and_can_be_turned_off(self):
        on = handdrawn.Scene(600, 300, 1, 2)
        off = handdrawn.Scene(600, 300, 1, 2, brand=False)
        box = brand.brand_box(600, 300)
        self.assertFalse(is_blank(on.render(0.5).crop(box)))
        self.assertTrue(is_blank(off.render(0.5).crop(box)))

    def test_brand_source_is_the_site_mark(self):
        shapes, view = brand.load_mark()
        self.assertEqual(len(shapes), 3)
        self.assertEqual(shapes[0][0], (255, 106, 0))
        self.assertEqual(view, (120.0, 156.0))
        self.assertTrue(all(len(poly) > 20 for _, poly in shapes))

    def test_content_touching_the_brand_is_reported(self):
        scene = handdrawn.Scene(600, 300, 1, 2)
        scene.add(handdrawn.Text("ПОДПИСЬ", (520, 268), 60, 0, 0, scene.rng("t")))
        self.assertTrue(any("знак бренда" in w for w in scene.warnings()))
        clear = handdrawn.Scene(600, 300, 1, 2)
        clear.add(handdrawn.Text("ПОДПИСЬ", (200, 100), 60, 0, 0, clear.rng("t")))
        self.assertEqual(clear.warnings(), [])

    def test_wobble_factor_calms_the_lines(self):
        def deviation():
            rng = handdrawn.Scene(10, 10, 1, 2, seed=3).rng("w")
            pts = handdrawn.wobble([(0, 100), (600, 100)], rng, amp=2.2)
            return max(abs(y - 100 * handdrawn.SS) for _, y in pts)

        calm = deviation()
        original = handdrawn.WOBBLE
        try:
            handdrawn.WOBBLE = 1.0
            wild = deviation()
        finally:
            handdrawn.WOBBLE = original
        self.assertLess(calm, wild)


class BlocksTest(unittest.TestCase):
    def test_call_tree_layout_is_stable(self):
        root = blocks_tree.expand(5)
        calls = blocks_tree.flatten(root)
        blocks_tree.layout(root)
        self.assertEqual(len(calls), 9)
        self.assertEqual((root["x"], root["y"]), (908.75, 120))
        leaves = [v["x"] for v in calls if not v["kids"]]
        self.assertEqual(leaves, [220, 510, 800, 1090, 1380])

    def test_layout_can_be_placed_in_any_region(self):
        root = blocks_tree.expand(5)
        blocks_tree.flatten(root)
        blocks_tree.layout(root, 910, 1490, top=190, step=145)
        xs = [v["x"] for v in blocks_tree.subtree(root)]
        self.assertEqual((min(xs), max(xs)), (910, 1490))


class ChainBlockTest(unittest.TestCase):
    def test_chain_places_nodes_and_arcs_by_the_given_positions(self):
        scene = handdrawn.Scene(1200, 600, 1, 2)
        chain = blocks_chain.Chain({1: 200, 4: 500}.get, y=300, r=60)
        rng = scene.rng("c")
        ring, label, unknown = chain.add_node(scene, rng, 4, 0)
        arc, text = chain.question_arc(scene, rng, 4, 1, 0.5)
        chain.answer_arc(scene, rng, 1, 4, 1.0, "+3")
        self.assertEqual(len(scene.elements), 3 + 2 + 2)
        x0, _, x1, _ = ring.bbox()
        self.assertAlmostEqual((x0 + x1) / 2, 500, delta=8)
        self.assertEqual(scene.warnings(), [])


class SceneContentTest(unittest.TestCase):
    def meta(self, name):
        module = next(m for m in SCENES if m.NAME == name)
        return module.build()[1]

    def test_numbers_match_the_lesson(self):
        self.assertEqual(self.meta("rekursiya-base-step")["values"]["F(5)"], 31)
        self.assertEqual(self.meta("rekursiya-call-tree")["repeats"]["F(3)"], 2)
        self.assertEqual(self.meta("rekursiya-call-tree")["repeats"]["F(2)"], 3)

    def test_figure_numbers_match_the_lesson(self):
        self.assertEqual(self.meta("rekursiya-call-stack")["values"]["F(4)"], 15)
        calls = self.meta("rekursiya-cache-before-after")["calls"]
        self.assertEqual((calls["without_cache"], calls["with_cache"], calls["repeats"]), (9, 5, 4))
        self.assertEqual(
            self.meta("rekursiya-warmup-direction")["chain"], {"steps": 1025, "limit": 1000}
        )
        self.assertEqual(self.meta("rekursiya-cancel")["product"], 9900)

    def test_video_numbers_match_the_worked_examples(self):
        two = self.meta("rekursiya-two-functions")
        self.assertEqual((two["F"][8], two["G"][8]), (44, 58))
        branch = self.meta("rekursiya-branch-path")
        self.assertEqual(branch["path"], [21, 20, 10, 5, 4, 2, 1])
        self.assertEqual(branch["values"]["F(21)"], 15)


class PublishedAssetsTest(unittest.TestCase):
    STILL_LIMIT_KB = 200  # жёсткий предел; ориентир 80 КБ мягкий

    def test_still_figures_stay_light(self):
        for module in LESSON_SCENES:
            if getattr(module, "KIND", "video") != "still":
                continue
            path = os.path.join(PUBLIC, module.LESSON, f"{module.NAME}.webp")
            self.assertLessEqual(os.path.getsize(path) // 1024, self.STILL_LIMIT_KB, module.NAME)

    def test_assets_exist_and_match_scene_size(self):
        for module in LESSON_SCENES:
            scene, _ = module.build()
            folder = os.path.join(PUBLIC, module.LESSON)
            if getattr(module, "KIND", "video") == "still":
                files = [f"{module.NAME}.webp"]
            else:
                files = [f"{module.NAME}.webm", f"{module.NAME}.mp4", f"{module.NAME}-poster.webp"]
            for name in files:
                self.assertTrue(os.path.exists(os.path.join(folder, name)), f"нет {name}")
            image = next(f for f in files if f.endswith(".webp"))
            with Image.open(os.path.join(folder, image)) as opened:
                self.assertEqual(opened.size, (scene.width, scene.height), image)
            if getattr(module, "KIND", "video") == "video" and shutil.which("ffprobe"):
                probe = subprocess.run(
                    [
                        "ffprobe",
                        "-v",
                        "error",
                        "-show_entries",
                        "stream=width,height",
                        "-of",
                        "csv=p=0",
                        os.path.join(folder, f"{module.NAME}.mp4"),
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                ).stdout.strip()
                width = min(build.MAX_WIDTH, scene.width)
                height = 2 * round(scene.height * width / scene.width / 2)
                self.assertEqual(probe, f"{width},{height}", module.NAME)


if __name__ == "__main__":
    unittest.main()
