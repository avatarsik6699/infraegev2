"""Lesson media rebuild from the site's own manifests (Change 197)."""

import importlib.util
import io
import shutil
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
MODULE = REPO / "scripts/lesson_design/site_media.py"
spec = importlib.util.spec_from_file_location("site_media", MODULE)
assert spec and spec.loader
site_media = importlib.util.module_from_spec(spec)
spec.loader.exec_module(site_media)

COURSE = REPO / "apps/web/src/entities/course/content"
FIGURE = COURSE / "python-tuples.media.ts"
RUN = COURSE / "python-arguments.media.ts"
# a key so long that Prettier puts it alone on its line
WRAPPED = REPO / "apps/web/src/entities/lesson/content/information-models.media.ts"


class SiteMediaTest(unittest.TestCase):
    def setUp(self) -> None:
        (REPO / ".output").mkdir(exist_ok=True)
        self.folder = Path(tempfile.mkdtemp(dir=REPO / ".output"))
        self.addCleanup(shutil.rmtree, self.folder)
        self.sources: dict[Path, Path] = {}

    def copy(self, source: Path, text: str | None = None) -> Path:
        path = self.folder / source.name
        path.write_text(source.read_text() if text is None else text)
        self.sources[path] = source
        return path

    def rebuilt(self, path: Path) -> str:
        media = site_media.load([path])[str(path)]
        # formatted as its source: Prettier leaves the ignored .output folder alone
        return site_media.prettier(site_media.rebuild(path, media), self.sources[path])

    def test_a_manifest_rebuilds_to_itself(self) -> None:
        for source in (FIGURE, RUN, WRAPPED):
            with redirect_stdout(io.StringIO()) as printed:
                out = self.rebuilt(self.copy(source))
            self.assertEqual(out, source.read_text(), source.name)
            self.assertEqual(printed.getvalue(), "", "an existing figure is not new")

    def test_a_call_line_without_an_entry_becomes_a_figure(self) -> None:
        call = '  // %%refs([["a", 0]], ["10"])%%\n'
        text = FIGURE.read_text().replace("} as const", call + "} as const")
        out = self.rebuilt(self.copy(FIGURE, text))
        self.assertIn(call + "  refs_", out)
        self.assertEqual(out.count('kind: "diagram"'), 2)

    def test_a_diagram_without_its_call_is_refused(self) -> None:
        text = FIGURE.read_text().replace("  // %%refs(", "  // was %%refs(")
        with self.assertRaisesRegex(SystemExit, "has no // %%builder"):
            self.rebuilt(self.copy(FIGURE, text))

    def test_a_run_whose_output_differs_is_refused(self) -> None:
        text = RUN.read_text().replace('output: "[1]\\n[1, 2]"', 'output: "[1]\\n[1, 3]"')
        self.assertNotEqual(text, RUN.read_text())
        with self.assertRaisesRegex(SystemExit, "output differs"):
            self.rebuilt(self.copy(RUN, text))


if __name__ == "__main__":
    unittest.main()
