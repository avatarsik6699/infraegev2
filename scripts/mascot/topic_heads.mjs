// Backdrops of the EGE topic heads (Change 197): the topic's own picture from
// the catalog on the right, and around it a faint scatter of the topic's signs
// drawn with the same pen — letters and roads for task 1, 0 and 1 for task 2,
// a tape and a head for task 12 — with the catalog's pen marks between them.
// The squared paper stays under it in CSS.
//
// Usage: node topic_heads.mjs <out-dir>
import {
  at,
  blob,
  el,
  fillShape,
  inkFilter,
  line,
  P,
  rectPts,
  rng,
  txt,
  writeScene,
} from "./doodles.mjs";
import { INK } from "./pen.mjs";
import { arrow, between, grid, node, TOPICS } from "./topics.mjs";

const [out] = process.argv.slice(2);
// Two layouts: the wide head (the title on the left, the picture in the
// top-right corner, which the title keeps clear of — lesson-intro.module.css)
// and a phone's band over «Задание N». The picture is the catalog one at 0.8.
const LAYOUTS = {
  "": { w: 720, h: 220, picture: { x: 570, y: 14 }, count: 24 },
  "-narrow": { w: 360, h: 110, picture: { x: 210, y: 8 }, count: 10 },
};
const SCALE = 0.8;
const [PW, PH] = [180 * SCALE, 120 * SCALE];

// ---------- signs: small drawings around their own origin ----------

const write =
  (s, size = 18) =>
  (g) =>
    txt(g, 0, size * 0.35, s, size);
const sign =
  (pts, w = 2) =>
  (g, r) =>
    line(g, pts, r, w, 0.3);

const and = sign([
  [-7, 7],
  [0, -7],
  [7, 7],
]);
const or = sign([
  [-7, -7],
  [0, 7],
  [7, -7],
]);
const implies = (g, r) =>
  arrow(
    g,
    [
      [-11, 0],
      [11, 0],
    ],
    r,
    INK,
    2,
  );
const root = sign([
  [-12, 1],
  [-8, -1],
  [-4, 8],
  [1, -8],
  [13, -8],
]);
const atLeast = (g, r) => {
  line(
    g,
    [
      [-6, -8],
      [6, -3],
      [-6, 2],
    ],
    r,
    2,
    0.2,
  );
  line(
    g,
    [
      [-6, 7],
      [6, 7],
    ],
    r,
    2,
    0.2,
  );
};

const point = (label) => (g, r) => node(g, 0, 0, label, r, 10);
const road = (g, r) => {
  line(g, between([-15, 7], [15, -7], 8), r, 1.8, 0.3);
  node(g, -15, 7, "", r, 6);
  node(g, 15, -7, "", r, 6);
};
const cells =
  (values, w = 15) =>
  (g, r) => {
    const left = (-values.length * w) / 2;
    grid(g, left, -w / 2, Array(values.length).fill(w), [w], r, 1.8);
    for (const [i, v] of values.entries())
      if (v) txt(g, left + w / 2 + i * w, 4.5, v, 13);
  };
const sheet = (g, r) => grid(g, -18, -12, [12, 12, 12], [8, 8, 8], r, 1.8);
const fork = (g, r) => {
  blob(g, 0, -9, 2.4, 2.4, r);
  line(
    g,
    [
      [-2, -7],
      [-11, 7],
    ],
    r,
    1.8,
    0.2,
  );
  line(
    g,
    [
      [2, -7],
      [11, 7],
    ],
    r,
    1.8,
    0.2,
  );
  txt(g, -11, -2, "0", 11);
  txt(g, 11, -2, "1", 11);
};
const lattice = (g, r) => {
  for (const x of [-12, 0, 12])
    for (const y of [-6, 6]) blob(g, x, y, 1.6, 1.6, r);
};
const turtle = (g) =>
  fillShape(
    g,
    [
      [0, -9],
      [7, 7],
      [-7, 7],
      [0, -9],
    ],
    INK,
  );
const corner = sign(
  [
    [-12, 10],
    [-12, -10],
    [12, -10],
  ],
  2.2,
);
const pixels = (g, r) => {
  for (const [x, y] of [
    [0, 0],
    [2, 0],
    [1, 1],
    [0, 2],
    [2, 2],
  ])
    fillShape(g, rectPts(-12 + x * 8, -12 + y * 8, 8, 8), INK);
  grid(g, -12, -12, [8, 8, 8], [8, 8, 8], r, 1.6);
};
const wave = (g, r) =>
  line(
    g,
    Array.from({ length: 17 }, (_, i) => [
      -16 + i * 2,
      -Math.sin((i / 16) * Math.PI * 3) * 8,
    ]),
    r,
    2,
    0.2,
  );
const check = sign([
  [-7, 0],
  [-2, 6],
  [8, -7],
]);
const cross = (g, r) => {
  sign([
    [-6, -6],
    [6, 6],
  ])(g, r);
  sign([
    [6, -6],
    [-6, 6],
  ])(g, r);
};
const box = sign(rectPts(-15, -10, 30, 20), 2);
const tape = (g, r) => {
  cells(["1", "0", "1"])(g, r);
  fillShape(
    g,
    [
      [0, 10],
      [5, 18],
      [-5, 18],
      [0, 10],
    ],
    INK,
  );
};
const jump = (label) => (g, r) => {
  line(
    g,
    [
      [-14, 6],
      [-8, -4],
      [8, -4],
      [14, 6],
    ],
    r,
    1.8,
    0.2,
  );
  blob(g, -14, 8, 2, 2, r);
  blob(g, 14, 8, 2, 2, r);
  txt(g, 0, -8, label, 12);
};
const segment = (g, r) => {
  line(
    g,
    [
      [-16, 0],
      [16, 0],
    ],
    r,
    1.8,
    0.2,
  );
  sign(
    [
      [-12, -6],
      [-16, -6],
      [-16, 6],
      [-12, 6],
    ],
    2,
  )(g, r);
  sign(
    [
      [12, -6],
      [16, -6],
      [16, 6],
      [12, 6],
    ],
    2,
  )(g, r);
};
const frames = (g, r) => {
  line(g, rectPts(-16, -12, 32, 24), r, 1.8, 0.3);
  line(g, rectPts(-10, -7, 20, 14), r, 1.8, 0.3);
  line(g, rectPts(-4, -3, 8, 6), r, 1.6, 0.2);
};
const pair = (g, r) => {
  cells(["", ""], 13)(g, r);
  line(
    g,
    [
      [-6, -9],
      [0, -15],
      [6, -9],
    ],
    r,
    1.8,
    0.2,
  );
};
const stairs = (g, r) =>
  arrow(
    g,
    [
      [-14, -12],
      [-4, -12],
      [-4, 0],
      [6, 0],
      [6, 12],
      [14, 12],
    ],
    r,
    INK,
    2,
  );
const wall = sign(
  [
    [-12, 8],
    [12, 8],
    [12, -10],
  ],
  3.4,
);
const stones = (g, r) => {
  for (const [x, y] of [
    [-8, 5],
    [4, 5],
    [-2, -4],
  ])
    blob(g, x, y, 5.5, 4, r);
};
const gantt = (g, r) => {
  line(g, rectPts(-18, -9, 22, 7), r, 1.8, 0.3);
  line(g, rectPts(-2, 3, 22, 7), r, 1.8, 0.3);
};
const directed = (g, r) => {
  arrow(g, between([-15, 6], [15, -6], 8), r, INK, 1.8);
  node(g, -15, 6, "", r, 6);
  node(g, 15, -6, "", r, 6);
};
const window = (g, r) => {
  cells(["X", "Y", "Z"], 13)(g, r);
  line(
    g,
    [
      [-21, -12],
      [-21, -14],
      [21, -14],
      [21, -12],
    ],
    r,
    1.8,
    0.2,
  );
};
const bars = (g, r) => {
  for (const [i, h] of [8, 14, 20].entries())
    line(g, rectPts(-14 + i * 10, 10 - h, 7, h), r, 1.8, 0.2);
};
const cloud = (g, r) => {
  for (const [x, y] of [
    [-9, -4],
    [-3, 6],
    [6, -7],
    [9, 4],
    [0, -1],
    [-10, 7],
  ])
    blob(g, x, y, 1.9, 1.9, r);
};
const centre = (g, r) => {
  sign([
    [-5, -5],
    [5, 5],
  ])(g, r);
  sign([
    [5, -5],
    [-5, 5],
  ])(g, r);
  cloud(g, r);
};

// Each topic's signs, scattered round its picture in turn.
const SIGNS = {
  1: [
    point("А"),
    point("Б"),
    road,
    write("12"),
    point("Г"),
    write("7"),
    road,
    point("Д"),
  ],
  2: [
    write("0"),
    write("1"),
    and,
    or,
    write("¬x"),
    implies,
    write("F"),
    write("1"),
  ],
  3: [write("id"), sheet, write("кг"), sheet, write("id"), write("шт")],
  4: [write("01"), fork, write("110"), write("0"), fork, write("1")],
  5: [
    write("1011"),
    write("N"),
    write("110"),
    write("R"),
    write("+1"),
    write("01"),
  ],
  6: [lattice, turtle, write("90"), corner, lattice, write("8")],
  7: [pixels, wave, write("бит"), pixels, wave, write("Гц")],
  8: [
    cells(["А", "Б"]),
    write("ВАБ"),
    write("Г"),
    cells(["Б", "В"]),
    write("×4"),
    write("АБВ"),
  ],
  9: [cells(["A1"], 26), check, write("="), cross, cells(["B2"], 26), check],
  10: [
    write("255"),
    write("192.168"),
    write("/24"),
    box,
    write("1110"),
    write("0"),
  ],
  11: [
    write("бит"),
    write("байт"),
    cells(["K", "7", "Q"]),
    write("i"),
    write("2"),
    write("N"),
  ],
  12: [tape, write("q1"), write("0"), tape, write("1"), write("q0")],
  13: [jump("+1"), write("3"), jump("×2"), write("8"), jump("+1"), write("12")],
  14: [
    write("16"),
    write("A"),
    write("F"),
    write("2"),
    write("1A3"),
    write("8"),
  ],
  15: [segment, write("P"), write("Q"), segment, write("x"), write("A")],
  16: [
    write("F(n)"),
    frames,
    write("F(n-1)"),
    frames,
    write("@cache"),
    write("F(1)"),
  ],
  17: [write("-5"), pair, write("12"), write("33"), pair, write("max")],
  18: [stairs, wall, write("7"), cells(["4", "9"]), stairs, write("3")],
  19: [write("+1"), stones, write("×2"), write("П1"), stones, write("В1")],
  22: [gantt, write("мс"), write("t"), gantt, write("5"), write("12")],
  23: [directed, write("A"), write("Z"), directed, write("3"), write("7")],
  24: [window, write("XYZ"), write("ZZY"), window, write("X"), write("Y")],
  25: [
    cells(["1", "?", "4"]),
    write("*"),
    root,
    write("12?4"),
    write("1·36"),
    write("?"),
  ],
  26: [bars, atLeast, write("S"), bars, write("max"), write("5")],
  27: [centre, cloud, write("x"), centre, write("y"), cloud],
};

// ---------- placement ----------

// Darts on the canvas, more of them to the right where the title ends, none
// on the picture and none closer than `gap` to another sign or mark.
function scatter(r, { w, h, picture, count }, gap) {
  const placed = [];
  for (let tries = 0; tries < 4000 && placed.length < count; tries++) {
    const x = 18 + r() * (w - 36);
    const y = 14 + r() * (h - 28);
    if (
      x > picture.x - 16 &&
      x < picture.x + PW + 16 &&
      y > picture.y - 16 &&
      y < picture.y + PH + 16
    )
      continue;
    if (r() > 0.04 + 0.96 * (x / w) ** 2.2) continue;
    if (placed.some(([px, py]) => Math.hypot(px - x, py - y) < gap)) continue;
    placed.push([x, y]);
  }
  return placed;
}

for (const [n, signs] of Object.entries(SIGNS))
  for (const [suffix, layout] of Object.entries(LAYOUTS)) {
    const r = rng(700 + Number(n));
    const svg = el("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: `0 0 ${layout.w} ${layout.h}`,
    });
    const defs = el("defs", {}, svg);
    const id = `head-${n}-ink`;
    inkFilter(defs, id);
    const pattern = el("g", { filter: `url(#${id})`, opacity: "0.2" }, svg);
    const marks = el("g", { filter: `url(#${id})`, opacity: "0.28" }, svg);
    for (const [i, [x, y]] of scatter(r, layout, 56).entries()) {
      const rot = (r() - 0.5) * 26;
      // Every fourth spot is a pen mark of the catalog rows: a cross or a ring.
      if (i % 4 === 3)
        P[i % 8 === 3 ? "sparkle" : "ring"](at(marks, x, y, 0.9), r, 4);
      else signs[i % signs.length](at(pattern, x, y, 0.95 + r() * 0.2, rot), r);
    }
    const { x, y } = layout.picture;
    const picture = el(
      "g",
      {
        filter: `url(#${id})`,
        opacity: "0.55",
        transform: `translate(${x} ${y}) scale(${SCALE})`,
      },
      svg,
    );
    TOPICS[n](picture, rng(200 + Number(n)));
    writeScene(out, `head-${n}${suffix}`, svg, { motion: false });
  }
