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
        self.assertGreaterEqual(len(names), 4)
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
        scene = handdrawn.Scene(300, 200, 5, 6)
        rng = scene.rng("l")
        ink = scene.add(handdrawn.Ink(handdrawn.line((20, 100), (280, 100), rng), 1, 1, rng))
        ink.vanish_at = 3
        self.assertTrue(is_blank(scene.render(0.5)), "до появления кадр пуст")
        self.assertFalse(is_blank(scene.render(2.2)), "после появления штрих виден")
        self.assertTrue(is_blank(scene.render(3.6)), "после исчезновения кадр пуст")

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


class SceneContentTest(unittest.TestCase):
    def meta(self, name):
        module = next(m for m in SCENES if m.NAME == name)
        return module.build()[1]

    def test_numbers_match_the_lesson(self):
        self.assertEqual(self.meta("rekursiya-base-step")["values"]["F(5)"], 31)
        self.assertEqual(self.meta("rekursiya-call-tree")["repeats"]["F(3)"], 2)
        self.assertEqual(self.meta("rekursiya-call-tree")["repeats"]["F(2)"], 3)


class PublishedAssetsTest(unittest.TestCase):
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
                self.assertEqual(probe, f"{scene.width},{scene.height}", module.NAME)


if __name__ == "__main__":
    unittest.main()
