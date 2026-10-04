// Builds the mascot scenes for the site: an approved pose plus learning objects
// drawn with the same ink pen, baked into static SVG with CSS motion hooks.
//
// Usage: node scenes.mjs <poses-dir> <out-dir>
// Requires opentype.js, @fontsource/caveat and svgo (see package.json next to this file).
//
// Each scene carries its own CSS motion, so it also animates as an <img>:
//   .mascot-float   — the mascot layer, slow vertical float;
//   .mascot-bob     — one object, sway with per-item --d, --delay, --x, --r;
//   .mascot-twinkle — a sparkle, opacity pulse with --d, --delay.
// Motion is off under prefers-reduced-motion.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import opentype from "opentype.js";
import { optimize } from "svgo";
import { dense, inkDot, inkStroke, INK, ORANGE, polygon, rng } from "./pen.mjs";

const [posesDir, out] = process.argv.slice(2);
const SOFT = "#f8f8f6";
const require = createRequire(import.meta.url);
const fontFile = readFileSync(
  require.resolve("@fontsource/caveat/files/caveat-latin-600-normal.woff"),
);
const caveat = opentype.parse(
  fontFile.buffer.slice(
    fontFile.byteOffset,
    fontFile.byteOffset + fontFile.byteLength,
  ),
);

// ---------- minimal SVG tree ----------

class Node {
  constructor(name, attrs = {}) {
    this.name = name;
    this.attrs = attrs;
    this.children = [];
  }
  toString() {
    const attrs = Object.entries(this.attrs)
      .map(([k, v]) => ` ${k}="${String(v).replace(/"/g, "&quot;")}"`)
      .join("");
    return `<${this.name}${attrs}>${this.children.join("")}</${this.name}>`;
  }
}
function el(name, attrs, parent) {
  const node = new Node(name, attrs);
  parent?.children.push(node);
  return node;
}

// ---------- geometry ----------

function jit(points, r, jitter = 1) {
  const pts = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(2, Math.round(len / 10));
    const nx = -(y2 - y1) / (len || 1);
    const ny = (x2 - x1) / (len || 1);
    for (let j = 0; j < steps; j++) {
      const t = j / steps;
      const w = (r() - 0.5) * jitter;
      pts.push([x1 + (x2 - x1) * t + nx * w, y1 + (y2 - y1) * t + ny * w]);
    }
  }
  pts.push(points[points.length - 1]);
  return dense(pts, 6);
}

function oval(s, r, turns = 1.06 + r() * 0.08) {
  const n = 18;
  const a0 = r() * Math.PI * 2;
  const p1 = r() * 6.28;
  const p2 = r() * 6.28;
  const tilt = ((s.tilt || 0) * Math.PI) / 180;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = a0 + t * turns * Math.PI * 2;
    const k =
      (1 + 0.05 * Math.sin(2 * a + p1) + 0.035 * Math.sin(3 * a + p2)) *
      (1 + (t - 0.5) * 0.05);
    const flat = s.flat === false ? 1 : Math.sin(a) > 0 ? (s.flatK ?? 0.86) : 1;
    const x = Math.cos(a) * s.rx * k;
    const y = Math.sin(a) * s.ry * k * flat;
    pts.push([
      s.cx + x * Math.cos(tilt) - y * Math.sin(tilt),
      s.cy + x * Math.sin(tilt) + y * Math.cos(tilt),
    ]);
  }
  return dense(pts, 7);
}

const rectPts = (x, y, w, h) => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
  [x, y + 0.5],
];

const ink = (g, pts, w, r, color = INK, opt) =>
  el("path", { d: inkStroke(pts, w, r, opt), fill: color }, g);
const line = (g, pts, r, w = 2.4, j = 0.6, color = INK) =>
  ink(g, jit(pts, r, j), w, r, color);
const fillShape = (g, pts, fill) => el("path", { d: polygon(pts), fill }, g);
const blob = (g, cx, cy, rx, ry, r) =>
  el("path", { d: inkDot(cx, cy, rx, ry, r), fill: INK }, g);

// Handwritten label as outlines: the site does not load Caveat.
function txt(g, x, y, s, size = 22) {
  const width = caveat.getAdvanceWidth(s, size);
  // Own serialisation: toPathData(2) drops the separator before a zero
  // ("-17.780"), and svgo cuts the path at that point.
  const n = (v) => v.toFixed(2);
  const d = caveat
    .getPath(s, x - width / 2, y, size)
    .commands.map((c) =>
      c.type === "Z"
        ? "Z"
        : c.type === "Q"
          ? `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`
          : c.type === "C"
            ? `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`
            : `${c.type}${n(c.x)} ${n(c.y)}`,
    )
    .join("");
  return el("path", { d, fill: INK }, g);
}

// ---------- objects (drawn around a local origin) ----------

const at = (g, x, y, s = 1, rot = 0) =>
  el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, g);

const P = {
  sparkle(g, r, size = 5) {
    line(
      g,
      [
        [-size, 0],
        [size, 0],
      ],
      r,
      2,
      0.3,
    );
    line(
      g,
      [
        [0, -size],
        [0, size],
      ],
      r,
      2,
      0.3,
    );
  },
  pencil(g, r) {
    const L = 30;
    const w = 5.5;
    line(
      g,
      [
        [0, -w / 2],
        [L, -w / 2],
        [L + 8, 0],
        [L, w / 2],
        [0, w / 2],
        [0, -w / 2],
      ],
      r,
      2,
      0.4,
    );
    line(
      g,
      [
        [L, -w / 2],
        [L, w / 2],
      ],
      r,
      1.6,
      0.2,
    );
  },
  question(g, r) {
    line(
      g,
      [
        [-6, -4],
        [-4, -10],
        [2, -11],
        [6, -6],
        [3, -1],
        [0, 3],
        [0, 6],
      ],
      r,
      2.8,
      0.4,
    );
    blob(g, 0, 12, 1.9, 1.9, r);
  },
  snake(g, r) {
    line(
      g,
      [
        [-22, 8],
        [-12, -4],
        [-2, 6],
        [8, -4],
        [16, 2],
      ],
      r,
      3.2,
      0.5,
    );
    ink(g, oval({ cx: 21, cy: 0, rx: 6, ry: 4.5, flat: false }, r), 2.4, r);
    blob(g, 22, -1, 1.1, 1.1, r);
    line(
      g,
      [
        [27, 1],
        [31, 2],
        [33, 0],
      ],
      r,
      1.2,
      0.1,
    );
  },
  grid(g, r) {
    line(g, rectPts(-18, -14, 36, 28), r, 2.2, 0.5);
    line(
      g,
      [
        [-6, -14],
        [-6, 14],
      ],
      r,
      1.6,
      0.3,
    );
    line(
      g,
      [
        [6, -14],
        [6, 14],
      ],
      r,
      1.6,
      0.3,
    );
    line(
      g,
      [
        [-18, -5],
        [18, -5],
      ],
      r,
      1.6,
      0.3,
    );
    line(
      g,
      [
        [-18, 5],
        [18, 5],
      ],
      r,
      1.6,
      0.3,
    );
    line(
      g,
      [
        [8, 9],
        [10.5, 12],
        [16, 6],
      ],
      r,
      1.8,
      0.1,
    );
  },
  binary(g) {
    txt(g, 0, 8, "1 0 1", 24);
  },
  braces(g) {
    txt(g, 0, 9, "{ }", 30);
  },
  bubble(g, r) {
    line(
      g,
      [
        [-16, -12],
        [16, -12],
        [18, -10],
        [18, 8],
        [16, 10],
        [-2, 10],
        [-8, 17],
        [-7, 10],
        [-16, 10],
        [-18, 8],
        [-18, -10],
        [-16, -12],
      ],
      r,
      2.2,
      0.5,
    );
    line(
      g,
      [
        [-7, -1],
        [-2, 4],
        [8, -6],
      ],
      r,
      2.4,
      0.2,
    );
  },
  cells(g, r) {
    line(g, rectPts(-15, -11, 14, 20), r, 2, 0.4);
    line(g, rectPts(1, -11, 14, 20), r, 2, 0.4);
    txt(g, -8, 6, "2", 20);
    txt(g, 8, 6, "7", 20);
  },
  flow(g, r) {
    line(g, rectPts(-24, -7, 14, 12), r, 2, 0.3);
    line(
      g,
      [
        [-9, -1],
        [3, -1],
      ],
      r,
      1.8,
      0.2,
    );
    line(
      g,
      [
        [0, -4],
        [4, -1],
        [0, 2],
      ],
      r,
      1.6,
      0.1,
    );
    line(
      g,
      [
        [13, -9],
        [22, -1],
        [13, 7],
        [4, -1],
        [13, -9],
      ],
      r,
      2,
      0.3,
    );
  },
  tree(g, r) {
    line(
      g,
      [
        [0, -8],
        [-11, 6],
      ],
      r,
      1.8,
      0.2,
    );
    line(
      g,
      [
        [0, -8],
        [11, 6],
      ],
      r,
      1.8,
      0.2,
    );
    for (const [x, y] of [
      [0, -10],
      [-12, 8],
      [12, 8],
    ]) {
      const s = { cx: x, cy: y, rx: 4.5, ry: 4.5, flat: false };
      fillShape(g, oval(s, r), SOFT);
      ink(g, oval(s, r), 2, r);
    }
  },
  key(g, r) {
    ink(g, oval({ cx: 0, cy: 0, rx: 6, ry: 6, flat: false }, r), 2.4, r);
    line(
      g,
      [
        [6, 0],
        [26, 0],
      ],
      r,
      2.4,
      0.2,
    );
    line(
      g,
      [
        [20, 0],
        [20, 6],
      ],
      r,
      2,
      0.1,
    );
    line(
      g,
      [
        [25, 0],
        [25, 5],
      ],
      r,
      2,
      0.1,
    );
  },
  padlock(g, r) {
    line(g, rectPts(-11, -2, 22, 18), r, 2.4, 0.4);
    line(
      g,
      [
        [-7, -2],
        [-7, -10],
        [-3, -15],
        [4, -15],
        [8, -11],
        [9, -7],
      ],
      r,
      2.4,
      0.3,
    );
    blob(g, 0, 6, 1.8, 2.2, r);
  },
  map(g, r) {
    line(
      g,
      [
        [-22, -12],
        [-8, -15],
        [8, -11],
        [22, -14],
        [22, 12],
        [8, 15],
        [-8, 11],
        [-22, 14],
        [-22, -12],
      ],
      r,
      2.2,
      0.4,
    );
    line(
      g,
      [
        [-8, -15],
        [-8, 11],
      ],
      r,
      1.4,
      0.2,
    );
    line(
      g,
      [
        [8, -11],
        [8, 15],
      ],
      r,
      1.4,
      0.2,
    );
    line(
      g,
      [
        [-16, 6],
        [-10, 0],
        [-2, 3],
        [4, -4],
      ],
      r,
      1.2,
      0.3,
    );
  },
  signpost(g, r) {
    line(
      g,
      [
        [0, 60],
        [0, -40],
      ],
      r,
      3,
      0.4,
    );
    line(
      g,
      [
        [-2, -34],
        [34, -34],
        [44, -26],
        [34, -18],
        [-2, -18],
        [-2, -34],
      ],
      r,
      2.4,
      0.4,
    );
    line(
      g,
      [
        [2, -10],
        [-34, -10],
        [-44, -2],
        [-34, 6],
        [2, 6],
        [2, -10],
      ],
      r,
      2.4,
      0.4,
    );
    line(
      g,
      [
        [-14, 60],
        [14, 60],
      ],
      r,
      2.4,
      0.3,
    );
  },
  plug(g, r) {
    line(
      g,
      [
        [-50, 10],
        [-30, 14],
        [-14, 6],
        [0, 4],
      ],
      r,
      2.4,
      0.8,
    );
    line(g, rectPts(0, -2, 10, 11), r, 2.2, 0.3);
    line(
      g,
      [
        [10, 0],
        [16, 0],
      ],
      r,
      1.8,
      0.1,
    );
    line(
      g,
      [
        [10, 7],
        [16, 7],
      ],
      r,
      1.8,
      0.1,
    );
    P.sparkle(at(g, 26, -6, 0.8), r, 4);
  },
  box(g, r) {
    line(g, rectPts(-26, -16, 52, 34), r, 2.4, 0.6);
    line(
      g,
      [
        [-26, -16],
        [-36, -28],
      ],
      r,
      2.2,
      0.4,
    );
    line(
      g,
      [
        [26, -16],
        [36, -28],
      ],
      r,
      2.2,
      0.4,
    );
    line(
      g,
      [
        [-26, -16],
        [-16, -24],
      ],
      r,
      1.8,
      0.3,
    );
  },
  magnifier(g, r) {
    const s = { cx: 0, cy: 0, rx: 9, ry: 9, flat: false };
    fillShape(g, oval(s, r), SOFT);
    ink(g, oval(s, r), 2.6, r);
    line(
      g,
      [
        [6.5, 6.5],
        [17, 17],
      ],
      r,
      3.4,
      0.2,
    );
  },
  flag(g, r) {
    line(
      g,
      [
        [0, 0],
        [0, -34],
      ],
      r,
      2.4,
      0.3,
    );
    line(
      g,
      [
        [0, -34],
        [20, -28],
        [0, -21],
      ],
      r,
      2.2,
      0.3,
    );
  },
  notebook(g, r, h = 40) {
    line(g, rectPts(-8, -h, 16, h), r, 2.2, 0.4);
    line(
      g,
      [
        [-4, -h + 8],
        [4, -h + 8],
      ],
      r,
      1.4,
      0.2,
    );
  },
  plant(g, r) {
    line(
      g,
      [
        [-8, 0],
        [8, 0],
        [6, 14],
        [-6, 14],
        [-8, 0],
      ],
      r,
      2.2,
      0.3,
    );
    line(
      g,
      [
        [0, 0],
        [0, -14],
      ],
      r,
      1.8,
      0.3,
    );
    ink(
      g,
      oval({ cx: -5, cy: -12, rx: 5, ry: 2.6, tilt: -30, flat: false }, r),
      1.8,
      r,
    );
    ink(
      g,
      oval({ cx: 5, cy: -16, rx: 5, ry: 2.6, tilt: 30, flat: false }, r),
      1.8,
      r,
    );
  },
  card(g, r, kind) {
    line(g, rectPts(-18, -12, 36, 24), r, 2.2, 0.4);
    if (kind === "check")
      line(
        g,
        [
          [-6, 0],
          [-1, 5],
          [9, -5],
        ],
        r,
        2.4,
        0.2,
      );
    if (kind === "lines") {
      line(
        g,
        [
          [-11, -4],
          [11, -4],
        ],
        r,
        1.4,
        0.3,
      );
      line(
        g,
        [
          [-11, 3],
          [4, 3],
        ],
        r,
        1.4,
        0.3,
      );
    }
  },
  stopwatch(g, r) {
    ink(g, oval({ cx: 0, cy: 0, rx: 12, ry: 12, flat: false }, r), 2.4, r);
    line(
      g,
      [
        [0, -12],
        [0, -17],
      ],
      r,
      2.2,
      0.1,
    );
    line(
      g,
      [
        [-4, -18],
        [4, -18],
      ],
      r,
      2.2,
      0.1,
    );
    line(
      g,
      [
        [0, 0],
        [5, -6],
      ],
      r,
      2,
      0.1,
    );
  },
};

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

// Ink displacement shared by the objects of a scene.
function inkFilter(defs, id) {
  const f = el(
    "filter",
    { id, x: "-5%", y: "-5%", width: "110%", height: "110%" },
    defs,
  );
  el(
    "feTurbulence",
    {
      type: "fractalNoise",
      baseFrequency: "0.8",
      numOctaves: "2",
      seed: "7",
      result: "n",
    },
    f,
  );
  el(
    "feDisplacementMap",
    {
      in: "SourceGraphic",
      in2: "n",
      scale: "1.1",
      xChannelSelector: "R",
      yChannelSelector: "G",
    },
    f,
  );
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

function bobbing(layer, r, items, scale) {
  for (const [name, x, y, d, delay, dx, rot] of items) {
    const g = el(
      "g",
      {
        class: "mascot-bob",
        style: `--d:${d}s;--delay:${delay}s;--x:${dx}px;--r:${rot}deg`,
      },
      layer,
    );
    P[name](at(g, x, y, scale), r);
  }
}

function sparkles(layer, r, items) {
  for (const [x, y, d, delay] of items) {
    const g = el(
      "g",
      { class: "mascot-twinkle", style: `--d:${d}s;--delay:${delay}s` },
      layer,
    );
    P.sparkle(at(g, x, y, 0.8), r, 5);
  }
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

// Added after svgo, which would otherwise inline or drop the rules.
const MOTION =
  "<style>@media (prefers-reduced-motion:no-preference){" +
  ".mascot-float{animation:float 5.2s ease-in-out infinite}" +
  ".mascot-bob{transform-box:fill-box;transform-origin:center;animation:bob var(--d,6s) ease-in-out var(--delay,0s) infinite}" +
  ".mascot-twinkle{animation:twinkle var(--d,3s) ease-in-out var(--delay,0s) infinite}}" +
  "@keyframes float{50%{transform:translateY(-7px)}}" +
  "@keyframes bob{33%{transform:translate(var(--x,3px),-5px) rotate(var(--r,4deg))}" +
  "66%{transform:translate(calc(var(--x,3px)*-.6),3px) rotate(calc(var(--r,4deg)*-.5))}}" +
  "@keyframes twinkle{50%{opacity:.25}}</style>";

// ---------- build ----------

mkdirSync(out, { recursive: true });
for (const [name, build] of Object.entries(SCENES)) {
  // Groups carry the motion classes and must not be collapsed into their
  // transformed children: a CSS transform would replace the placement.
  const svg = optimize(String(build()), {
    multipass: true,
    floatPrecision: 1,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            cleanupIds: false,
            collapseGroups: false,
            removeUnknownsAndDefaults: false,
          },
        },
      },
    ],
  }).data.replace(/^(<svg[^>]*>)/, `$1${MOTION}`);
  writeFileSync(join(out, `${name}.svg`), svg + "\n");
  console.log(`${name}.svg ${(svg.length / 1024).toFixed(1)} KB`);
}
