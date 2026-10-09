// Builds the code-drawn mascot scenes: an approved pose plus doodles drawn
// with the same ink pen (doodles.mjs), baked into static SVG.
//
// Usage: node scenes.mjs <poses-dir> <out-dir>
// Requires opentype.js, @fontsource/caveat and svgo (see package.json next to this file).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  bobbing,
  el,
  inkFilter,
  rng,
  sparkles,
  writeScene,
} from "./doodles.mjs";

const [posesDir, out] = process.argv.slice(2);

// ---------- poses ----------

// Approved pose as a layer: its viewBox, its face filter and its drawing.
function pose(name) {
  const svg = readFileSync(join(posesDir, `${name}.svg`), "utf8");
  const [, , w, h] = svg
    .match(/viewBox="([^"]+)"/)[1]
    .split(" ")
    .map(Number);
  const defs = svg.match(/<defs>(.*?)<\/defs>/s)?.[1] ?? "";
  const body = svg.replace(/^.*?<\/defs>/s, "").replace(/<\/svg>\s*$/, "");
  return { w, h, defs, body };
}

function placePose(svg, defs, name, { width, y, cx }) {
  const p = pose(name);
  defs.children.push(p.defs);
  const s = width / p.w;
  const place = el(
    "g",
    { transform: `translate(${cx - (p.w * s) / 2} ${y}) scale(${s})` },
    svg,
  );
  el("g", { class: "mascot-float" }, place).children.push(p.body);
}

// ---------- scenes ----------

const SCENES = {
  // Home hero: the mascot meditates, learning objects float around it.
  "home-hero"() {
    const svg = el("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 360 300",
    });
    const defs = el("defs", {}, svg);
    inkFilter(defs, "mascot-home-hero-ink");
    placePose(svg, defs, "lotus", { width: 192, y: 58, cx: 180 });
    const r = rng(29);
    const layer = el("g", { filter: "url(#mascot-home-hero-ink)" }, svg);
    bobbing(
      layer,
      r,
      [
        ["snake", 64, 66, 6.2, 0, 4, -4],
        ["bubble", 116, 36, 7, -1.5, -3, 5],
        ["cells", 248, 36, 6.6, -3, 3, -5],
        ["grid", 300, 76, 7.4, -0.8, -3, 4],
        ["binary", 44, 172, 6.8, -2.2, 4, 3],
        ["braces", 318, 172, 5.8, -4, -4, -4],
        ["flow", 74, 256, 7.2, -1, 3, 5],
        ["tree", 292, 254, 6.4, -2.6, -3, -4],
      ],
      1.32,
    );
    sparkles(layer, r, [
      [152, 26, 3.2, 0],
      [222, 84, 2.6, -1],
      [30, 114, 3.6, -2],
      [336, 122, 3, -0.5],
      [256, 214, 2.8, -1.6],
    ]);
    return svg;
  },
};

// ---------- build ----------

for (const [name, build] of Object.entries(SCENES))
  writeScene(out, name, build());
