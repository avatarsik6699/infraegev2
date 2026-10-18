// Builds the code-drawn mascot scenes: an approved pose plus doodles drawn
// with the same ink pen (doodles.mjs), baked into static SVG.
//
// Usage: node scenes.mjs <poses-dir> <out-dir>
// Requires opentype.js, @fontsource/caveat and svgo (see package.json next to this file).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  at,
  blob,
  bobbing,
  el,
  inkFilter,
  line,
  rectPts,
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

// `still`: the mascot stays put (Change 192 scenes: only the marks twinkle).
function placePose(svg, defs, name, { width, y, cx, still = false }) {
  const p = pose(name);
  defs.children.push(p.defs);
  const s = width / p.w;
  const place = el(
    "g",
    { transform: `translate(${cx - (p.w * s) / 2} ${y}) scale(${s})` },
    svg,
  );
  el("g", still ? {} : { class: "mascot-float" }, place).children.push(p.body);
}

// ---------- objects ----------

const arc = (cx, cy, rx, ry, a0, a1, n = 10) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });

// A padlock around its body's top centre; `open` lifts the shackle off one side.
function padlock(g, r, { open = false } = {}) {
  line(g, rectPts(-15, 0, 30, 24), r, 2.4, 0.5);
  const shackle = open
    ? [[9, 0], [9, -9], ...arc(0, -13, 9, 10, 0, -180).slice(1), [-9, -19]]
    : [[9, 0], ...arc(0, -4, 9, 10, 0, -180).slice(1), [-9, 0]];
  line(g, shackle, r, 2.4, 0.4);
  blob(g, 0, 9, 2.4, 2.4, r);
  line(
    g,
    [
      [0, 10],
      [0, 16],
    ],
    r,
    2.2,
    0.2,
  );
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

// Change 192, after payment: the mascot jumps, the opened padlock lies aside.
SCENES["access-open"] = () => {
  const svg = el("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 10 300 254",
  });
  const defs = el("defs", {}, svg);
  inkFilter(defs, "mascot-access-open-ink");
  const r = rng(418);
  const layer = () => el("g", { filter: "url(#mascot-access-open-ink)" }, svg);
  const g = layer();
  padlock(at(g, 236, 238, 0.95, 16), r, { open: true });
  line(
    g,
    [
      [104, 252],
      [138, 252],
    ],
    r,
    1.8,
    0.6,
  ); // shadow under the jump
  line(
    g,
    [
      [150, 254],
      [178, 254],
    ],
    r,
    1.8,
    0.6,
  );
  placePose(svg, defs, "jump", { width: 196, y: 20, cx: 144, still: true });
  sparkles(layer(), r, [
    [40, 70, 3.2, 0],
    [262, 60, 2.8, -1],
    [270, 170, 3.6, -2],
    [28, 190, 3, -0.6],
  ]);
  return svg;
};

// ---------- build ----------

// `node scenes.mjs <poses> <out> [scene...]` rebuilds only the named scenes.
const only = process.argv.slice(4);
for (const [name, build] of Object.entries(SCENES))
  if (!only.length || only.includes(name)) writeScene(out, name, build());
