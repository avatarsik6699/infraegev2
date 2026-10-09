// Doodles shared by the scenes: a minimal SVG tree, the ink geometry, the
// object drawings and the motion hooks, plus writing a scene to disk.
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
import { dense, inkDot, inkStroke, INK, polygon, rng } from "./pen.mjs";
const SOFT = "#f8f8f6";
const require = createRequire(import.meta.url);
const font = (subset) => {
  const file = readFileSync(
    require.resolve(
      `@fontsource/caveat/files/caveat-${subset}-600-normal.woff`,
    ),
  );
  return opentype.parse(
    file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength),
  );
};
const caveat = font("latin");
const caveatCyrillic = font("cyrillic");

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
// Cyrillic labels come from the Cyrillic subset of the same font.
function txt(g, x, y, s, size = 22, fill = INK) {
  const face = /[\u0400-\u04ff]/.test(s) ? caveatCyrillic : caveat;
  const width = face.getAdvanceWidth(s, size);
  // Own serialisation: toPathData(2) drops the separator before a zero
  // ("-17.780"), and svgo cuts the path at that point.
  const n = (v) => v.toFixed(2);
  const d = face
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
  return el("path", { d, fill }, g);
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
  // Small ring for background marks.
  ring(g, r) {
    ink(g, oval({ cx: 0, cy: 0, rx: 4, ry: 4, flat: false }, r), 2, r);
  },
};

// ---------- motion ----------

// Ink displacement shared by the objects of a scene.
export function inkFilter(defs, id) {
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
export function bobbing(layer, r, items, scale) {
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

export function sparkles(layer, r, items) {
  for (const [x, y, d, delay] of items) {
    const g = el(
      "g",
      { class: "mascot-twinkle", style: `--d:${d}s;--delay:${delay}s` },
      layer,
    );
    P.sparkle(at(g, x, y, 0.8), r, 5);
  }
}
// Added after svgo, which would otherwise inline or drop the rules.
const MOTION =
  "<style>@media (prefers-reduced-motion:no-preference){" +
  ".mascot-float{animation:float 5.2s ease-in-out infinite}" +
  ".mascot-bob{transform-box:fill-box;transform-origin:center;animation:bob var(--d,6s) ease-in-out var(--delay,0s) infinite}" +
  ".mascot-twinkle{animation:twinkle var(--d,3s) ease-in-out var(--delay,0s) infinite}}" +
  "@keyframes float{50%{transform:translateY(-7px)}}" +
  "@keyframes bob{33%{transform:translate(var(--x,3px),var(--y,-5px)) rotate(var(--r,4deg))}" +
  "66%{transform:translate(calc(var(--x,3px)*-.6),calc(var(--y,-5px)*-.6)) rotate(calc(var(--r,4deg)*-.5))}}" +
  "@keyframes twinkle{50%{opacity:.25}}</style>";
// ---------- output ----------

// A static picture (`motion: false`) carries no motion style.
export function writeScene(out, name, root, { motion = true } = {}) {
  mkdirSync(out, { recursive: true });
  // Groups carry the motion classes and must not be collapsed into their
  // transformed children: a CSS transform would replace the placement.
  const svg = optimize(String(root), {
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
  }).data.replace(/^(<svg[^>]*>)/, `$1${motion ? MOTION : ""}`);
  writeFileSync(join(out, `${name}.svg`), svg + "\n");
  console.log(`${name}.svg ${(svg.length / 1024).toFixed(1)} KB`);
}

export { at, blob, el, fillShape, ink, line, oval, P, rectPts, rng, SOFT, txt };
