// SVG figures of the stand → PNG for bank task statements (Change 190).
//
// Usage: node scripts/lesson_design/svg_png.mjs < jobs.json
// jobs.json: [{"svg": "<svg viewBox=…>…</svg>", "out": "/abs/path.png"}, …]
//
// The bank serves PNG and GIF images only, so a figure of a task statement is
// rendered by headless Chromium from Playwright (the e2e browser) at twice its
// CSS size, on white, with the site font Onest. topic_bank.py keeps the result
// next to the topic and redraws it only when the SVG changes.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(`${root}apps/web/package.json`);
const { chromium } = require("@playwright/test");
const fonts = `${root}apps/web/public/fonts/onest/`;
const face = (file, range) =>
  `@font-face{font-family:Onest;font-weight:100 900;` +
  `src:url("${pathToFileURL(fonts + file).href}") format("woff2");` +
  `unicode-range:${range}}`;
const style =
  face("onest-cyrillic-wght-normal.woff2", "U+0301,U+0400-045F,U+2116") +
  face("onest-latin-wght-normal.woff2", "U+0000-00FF,U+2000-206F,U+2190-22FF") +
  "html,body{margin:0;background:#fff}svg{display:block}";

const jobs = JSON.parse(readFileSync(0, "utf8"));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  for (const { svg, out } of jobs) {
    const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) ?? [];
    if (!w) throw new Error(`no viewBox: ${svg.slice(0, 80)}`);
    const sized = svg.replace(
      "<svg ",
      `<svg width="${Math.round(w)}" height="${Math.round(h)}" `,
    );
    await page.setViewportSize({ width: Math.round(w), height: Math.round(h) });
    await page.setContent(`<style>${style}</style>${sized}`, {
      waitUntil: "load",
    });
    await page.evaluate("document.fonts.ready");
    await page.locator("svg").first().screenshot({ path: out });
  }
} finally {
  await browser.close();
}
