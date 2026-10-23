// Object illustrations for the EGE topics (no mascot): one idea per topic,
// drawn with the shared pen on a 3:2 canvas, one small orange accent each.
// Static: they sit in catalog rows and must not pull the eye.
//
// Usage: node topics.mjs <out-dir>
import { pathToFileURL } from "node:url";
import {
  blob,
  el,
  fillShape,
  ink,
  line,
  oval,
  rectPts,
  rng,
  SOFT,
  txt,
  writeScene,
  inkFilter,
} from "./doodles.mjs";
import { INK, ORANGE } from "./pen.mjs";

const W = 180;
const H = 120;

const ring = (g, cx, cy, rx, ry, r, w = 2.4, color) =>
  ink(g, oval({ cx, cy, rx, ry, flat: false }, r), w, r, color);
const arrowHead = (g, [x, y], dx, dy, r, color) => {
  const l = Math.hypot(dx, dy);
  const [ux, uy] = [dx / l, dy / l];
  line(
    g,
    [
      [x - ux * 7 - uy * 5, y - uy * 7 + ux * 5],
      [x, y],
      [x - ux * 7 + uy * 5, y - uy * 7 - ux * 5],
    ],
    r,
    2.4,
    0.1,
    color,
  );
};

// A line ending in an arrowhead along its last segment.
const arrow = (g, pts, r, color, w = 2.4) => {
  line(g, pts, r, w, 0.2, color);
  const [a, b] = pts.slice(-2);
  arrowHead(g, b, b[0] - a[0], b[1] - a[1], r, color);
};
// From a towards b, both ends pulled in by `by` (edges between round nodes).
const between = ([ax, ay], [bx, by_], by) => {
  const l = Math.hypot(bx - ax, by_ - ay);
  const [ux, uy] = [(bx - ax) / l, (by_ - ay) / l];
  return [
    [ax + ux * by, ay + uy * by],
    [bx - ux * by, by_ - uy * by],
  ];
};
// Table: outer frame and inner rules.
const grid = (g, x, y, cols, rows, r, w = 2.2) => {
  const right = x + cols.reduce((a, b) => a + b, 0);
  const bottom = y + rows.reduce((a, b) => a + b, 0);
  line(g, rectPts(x, y, right - x, bottom - y), r, w + 0.4, 0.5);
  let cx = x;
  for (const c of cols.slice(0, -1)) {
    cx += c;
    line(
      g,
      [
        [cx, y],
        [cx, bottom],
      ],
      r,
      w - 0.6,
      0.3,
    );
  }
  let cy = y;
  for (const c of rows.slice(0, -1)) {
    cy += c;
    line(
      g,
      [
        [x, cy],
        [right, cy],
      ],
      r,
      w - 0.6,
      0.3,
    );
  }
};
const node = (g, x, y, label, r, rad = 10) => {
  const s = { cx: x, cy: y, rx: rad, ry: rad, flat: false };
  fillShape(g, oval(s, r), SOFT);
  ink(g, oval(s, r), 2.2, r);
  if (label) txt(g, x, y + 5, label, 15);
};

export const TOPICS = {
  // 1. Information models: a graph and the table that describes it.
  1(g, r) {
    const pts = { А: [30, 34], Б: [76, 34], В: [53, 88] };
    for (const [a, b] of [
      ["А", "Б"],
      ["А", "В"],
      ["Б", "В"],
    ])
      line(g, between(pts[a], pts[b], 11), r, 2, 0.3);
    for (const [k, [x, y]] of Object.entries(pts)) node(g, x, y, k, r, 11);
    grid(g, 104, 26, [22, 22, 22], [22, 22, 22], r);
    txt(g, 137, 42, "5", 16);
    txt(g, 115, 64, "5", 16);
    txt(g, 159, 64, "3", 16);
    txt(g, 137, 86, "3", 16);
    ring(g, 137, 37, 9, 9, r, 2.2, ORANGE);
  },

  // 2. Truth tables: x, y and the value of F.
  2(g, r) {
    grid(g, 40, 10, [33, 33, 34], [20, 20, 20, 20, 20], r);
    for (const [i, h] of ["x", "y", "F"].entries())
      txt(g, 56.5 + i * 33, 26, h, 17);
    const rows = [
      ["0", "0", "1"],
      ["0", "1", "0"],
      ["1", "0", "1"],
      ["1", "1", "1"],
    ];
    for (const [j, row] of rows.entries())
      for (const [i, v] of row.entries())
        txt(g, 56.5 + i * 33, 46 + j * 20, v, 17);
    ring(g, 123, 81, 9, 8.5, r, 2.2, ORANGE);
  },

  // 3. Databases: two tables joined by a key.
  3(g, r) {
    grid(g, 14, 22, [22, 38], [16, 20, 20, 20], r);
    grid(g, 106, 30, [22, 38], [16, 20, 20], r);
    txt(g, 25, 34, "id", 12);
    txt(g, 117, 42, "id", 12);
    line(
      g,
      [
        [36, 68],
        [62, 66],
        [90, 58],
        [117, 56],
      ],
      r,
      2.4,
      0.3,
      ORANGE,
    );
    blob(g, 36, 68, 2.4, 2.4, r);
    blob(g, 117, 56, 2.4, 2.4, r);
  },

  // 4. Coding and Fano: a code tree, 0 to the left, 1 to the right.
  4(g, r) {
    blob(g, 90, 16, 3, 3, r);
    blob(g, 128, 54, 3, 3, r);
    line(
      g,
      [
        [87, 19],
        [58, 50],
      ],
      r,
      2.2,
      0.2,
    );
    line(
      g,
      [
        [93, 19],
        [126, 51],
      ],
      r,
      2.2,
      0.2,
    );
    line(
      g,
      [
        [125, 57],
        [108, 84],
      ],
      r,
      2.2,
      0.2,
    );
    line(
      g,
      [
        [131, 57],
        [148, 84],
      ],
      r,
      2.2,
      0.2,
    );
    txt(g, 66, 34, "0", 14);
    txt(g, 116, 34, "1", 14);
    txt(g, 108, 72, "0", 14);
    txt(g, 148, 72, "1", 14);
    txt(g, 54, 70, "А", 22);
    txt(g, 106, 104, "Б", 22);
    txt(g, 150, 104, "В", 22);
    ring(g, 54, 63, 12, 12, r, 2.2, ORANGE);
  },

  // 5. Number notations: 1011 in base 2 becomes 11 in base 10.
  5(g, r) {
    line(g, rectPts(8, 32, 80, 54), r, 2.6, 0.6);
    txt(g, 44, 70, "1011", 34);
    txt(g, 80, 80, "2", 14);
    line(g, rectPts(112, 32, 60, 54), r, 2.6, 0.6);
    txt(g, 136, 70, "11", 34);
    txt(g, 160, 80, "10", 14);
    line(
      g,
      [
        [90, 54],
        [100, 47],
        [110, 54],
      ],
      r,
      2.6,
      0.2,
      ORANGE,
    );
    arrowHead(g, [110, 54], 1, 0.7, r, ORANGE);
  },

  // 6. Simple algorithms: the turtle's path and the points inside it.
  6(g, r) {
    line(
      g,
      [
        [30, 98],
        [30, 22],
        [150, 22],
        [150, 70],
        [98, 70],
        [98, 98],
        [30, 98],
      ],
      r,
      2.6,
      0.5,
    );
    for (let y = 36; y <= 86; y += 14)
      for (let x = 44; x <= 136; x += 16) {
        if (x > 90 && y > 64) continue;
        blob(g, x, y, 1.6, 1.6, r);
      }
    arrow(
      g,
      [
        [54, 22],
        [92, 22],
      ],
      r,
      ORANGE,
      3,
    );
  },

  // 7. Images and sound: a pixel grid and a sound wave.
  7(g, r) {
    // A tiny pixel face: eyes and a smile.
    const on = ["00000", "01010", "10001", "01110", "00000"];
    for (const [j, row] of on.entries())
      for (const [k, c] of [...row].entries())
        if (c === "1")
          fillShape(g, rectPts(16 + k * 12, 30 + j * 12, 12, 12), INK);
    grid(g, 16, 30, [12, 12, 12, 12, 12], [12, 12, 12, 12, 12], r, 2);
    line(
      g,
      [
        [94, 60],
        [172, 60],
      ],
      r,
      1.6,
      0.3,
    );
    const wave = [];
    for (let i = 0; i <= 32; i++) {
      const t = i / 32;
      wave.push([
        96 + t * 74,
        60 - Math.sin(t * Math.PI * 4) * 22 * (1 - t * 0.35),
      ]);
    }
    line(g, wave, r, 2.6, 0.2, ORANGE);
  },

  // 8. Word enumeration: letters change places.
  8(g, r) {
    for (const [i, c] of ["А", "Б", "В"].entries()) {
      const x = 32 + i * 44;
      line(g, rectPts(x, 54, 34, 40), r, 2.4, 0.5);
      txt(g, x + 17, 84, c, 28);
    }
    line(
      g,
      [
        [50, 48],
        [62, 28],
        [118, 28],
        [130, 48],
      ],
      r,
      2.4,
      0.2,
      ORANGE,
    );
    arrowHead(g, [130, 48], 0.5, 1, r, ORANGE);
    arrowHead(g, [50, 48], -0.5, 1, r, ORANGE);
  },

  // 9. Spreadsheets: the formula bar over a selected cell.
  9(g, r) {
    line(g, rectPts(20, 8, 144, 16), r, 2, 0.4);
    txt(g, 52, 21, "=A1+B2", 14);
    grid(g, 20, 30, [16, 32, 32, 32, 32], [16, 20, 20, 20], r);
    for (const [i, h] of ["A", "B", "C", "D"].entries())
      txt(g, 52 + i * 32, 43, h, 13);
    for (const [j, h] of ["1", "2", "3"].entries())
      txt(g, 28, 61 + j * 20, h, 13);
    line(g, rectPts(68, 66, 32, 20), r, 3, 0.3, ORANGE);
  },

  // 10. Networks: a router and the computers of one subnet.
  10(g, r) {
    const pcs = [
      [34, 30],
      [146, 30],
      [90, 98],
    ];
    for (const [x, y] of pcs) {
      line(g, between([90, 62], [x, y], 18), r, 2, 0.3);
      line(g, rectPts(x - 16, y - 11, 32, 20), r, 2.4, 0.4);
      line(
        g,
        [
          [x - 6, y + 13],
          [x + 6, y + 13],
        ],
        r,
        2.2,
        0.1,
      );
    }
    line(g, rectPts(74, 52, 32, 20), r, 2.6, 0.4, ORANGE);
    for (const x of [82, 90, 98]) blob(g, x, 62, 1.6, 1.6, r);
  },

  // 11. Amount of information: a message and its size.
  11(g, r) {
    line(
      g,
      [
        [36, 16],
        [82, 16],
        [96, 30],
        [96, 104],
        [36, 104],
        [36, 16],
      ],
      r,
      2.4,
      0.5,
    );
    line(
      g,
      [
        [82, 16],
        [82, 30],
        [96, 30],
      ],
      r,
      1.8,
      0.2,
    );
    for (const [y, w] of [
      [42, 46],
      [54, 40],
      [66, 46],
      [78, 30],
      [90, 40],
    ])
      line(
        g,
        [
          [44, y],
          [44 + w, y],
        ],
        r,
        1.8,
        0.4,
      );
    line(
      g,
      [
        [110, 46],
        [160, 46],
        [170, 60],
        [160, 74],
        [110, 74],
        [110, 46],
      ],
      r,
      2.4,
      0.4,
      ORANGE,
    );
    txt(g, 136, 66, "Кбайт", 17);
  },

  // 12. Executors: a machine on a tape — the head under one cell, its state.
  12(g, r) {
    grid(g, 18, 40, [24, 24, 24, 24, 24, 24], [28], r);
    for (const [i, c] of ["", "1", "0", "1", "1", ""].entries())
      if (c) txt(g, 30 + i * 24, 61, c, 20);
    line(
      g,
      [
        [102, 74],
        [110, 88],
        [94, 88],
        [102, 74],
      ],
      r,
      2.4,
      0.2,
      ORANGE,
    );
    txt(g, 102, 108, "q1", 16);
    arrow(
      g,
      [
        [92, 26],
        [120, 26],
      ],
      r,
      INK,
      2,
    );
  },

  // 13. Counting programs: numbers joined by the commands +1 and ×2.
  13(g, r) {
    const x = { 2: 24, 3: 66, 4: 108, 8: 154 };
    const y = 74;
    const curve = (from, to, lift) =>
      Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        return [
          from + (to - from) * t,
          y + (lift < 0 ? -13 : 13) + 4 * lift * t * (1 - t),
        ];
      });
    for (const [a, b] of [
      [2, 3],
      [3, 4],
    ]) {
      const pts = curve(x[a] + 6, x[b] - 6, 10);
      line(g, pts, r, 2, 0.2);
      arrowHead(g, pts.at(-1), 1, -1, r);
    }
    const twice = curve(x[2] + 4, x[4] - 4, -38);
    line(g, twice, r, 2, 0.2);
    arrowHead(g, twice.at(-1), 0.6, 1, r);
    const accent = curve(x[4] + 4, x[8] - 4, -30);
    line(g, accent, r, 2.4, 0.2, ORANGE);
    arrowHead(g, accent.at(-1), 0.6, 1, r, ORANGE);
    for (const [n, cx] of Object.entries(x)) node(g, cx, y, n, r, 11);
    txt(g, 66, 14, "×2", 15);
    txt(g, 46, 112, "+1", 15);
  },

  // 14. Numeral systems: digits and their place weights.
  14(g, r) {
    for (const [i, d] of ["1", "A", "7"].entries()) {
      const x = 40 + i * 34;
      line(g, rectPts(x, 50, 34, 42), r, 2.4, 0.5);
      txt(g, x + 17, 82, d, 30);
      txt(g, x + 15, 40, "16", 13);
      txt(g, x + 25, 33, String(2 - i), 10);
    }
    txt(g, 156, 98, "16", 18, ORANGE);
  },

  // 15. Logic: two sets and the part where both conditions hold.
  15(g, r) {
    const a = [72, 60];
    const b = [108, 60];
    const R = 34;
    ring(g, a[0], a[1], R, R, r, 2.4);
    ring(g, b[0], b[1], R, R, r, 2.4);
    txt(g, 52, 66, "A", 20);
    txt(g, 128, 66, "B", 20);
    // The lens: the arc of each circle that lies inside the other.
    const arc = ([cx, cy], [ox, oy]) => {
      const pts = [];
      for (let i = 0; i <= 60; i++) {
        const t = (i / 60) * Math.PI * 2;
        const p = [cx + Math.cos(t) * R, cy + Math.sin(t) * R];
        if (Math.hypot(p[0] - ox, p[1] - oy) <= R) pts.push(p);
      }
      return pts;
    };
    const right = arc(a, b).sort((p, q) => p[1] - q[1]);
    const left = arc(b, a).sort((p, q) => q[1] - p[1]);
    ink(g, [...right, ...left, right[0]], 2.6, r, ORANGE);
  },

  // 16. Recursion: each frame holds a smaller copy, down to the base case.
  16(g, r) {
    const frames = [
      [30, 14, 120, 92],
      [44, 30, 88, 66],
      [58, 46, 56, 42],
      [72, 60, 28, 20],
    ];
    for (const [x, y, w, h] of frames)
      line(g, rectPts(x, y, w, h), r, 2.6, 0.7);
    blob(g, 86, 70, 5, 5, r);
    ring(g, 86, 70, 7.5, 7.5, r, 2.4, ORANGE);
  },

  // 17. Sequences: a window over a pair of neighbouring numbers.
  17(g, r) {
    const digits = ["3", "8", "2", "9", "4", "7"];
    for (const [i, d] of digits.entries()) {
      const x = 9 + i * 27;
      line(g, rectPts(x, 40, 27, 40), r, 2.4, 0.4);
      txt(g, x + 13.5, 70, d, 30);
    }
    line(g, rectPts(59, 31, 60, 58), r, 2.8, 0.5, ORANGE);
  },

  // 18. Spreadsheet optimisation: the robot's best path through the table.
  18(g, r) {
    grid(g, 30, 12, [24, 24, 24, 24, 24], [24, 24, 24, 24], r, 2);
    const c = (i, j) => [42 + i * 24, 24 + j * 24];
    for (const [i, j, v] of [
      [3, 0, "7"],
      [0, 2, "4"],
      [1, 3, "9"],
      [3, 3, "1"],
      [2, 0, "2"],
    ])
      txt(g, c(i, j)[0], c(i, j)[1] + 5, v, 13);
    arrow(
      g,
      [c(0, 0), c(1, 0), c(1, 1), c(2, 1), c(2, 2), c(3, 2), c(4, 2), c(4, 3)],
      r,
      ORANGE,
      2.6,
    );
  },

  // 19–21. Winning strategy: a pile of stones and the two possible moves.
  19(g, r) {
    const stones = [
      [48, 92, 26, 9],
      [50, 76, 20, 8],
      [46, 62, 15, 7],
      [50, 50, 10, 5],
    ];
    for (const [cx, cy, rx, ry] of stones) {
      fillShape(g, oval({ cx, cy, rx, ry }, r), SOFT);
      ink(g, oval({ cx, cy, rx, ry }, r), 2.4, r);
    }
    arrow(
      g,
      [
        [84, 66],
        [118, 40],
      ],
      r,
      INK,
    );
    arrow(
      g,
      [
        [84, 80],
        [118, 96],
      ],
      r,
      ORANGE,
      2.6,
    );
    txt(g, 140, 44, "+1", 24);
    txt(g, 140, 104, "×2", 24);
  },

  // 22. Parallel computing: processes on a time line and the finish.
  22(g, r) {
    for (const [y, x0, x1] of [
      [24, 22, 74],
      [48, 74, 124],
      [72, 46, 104],
      [96, 104, 150],
    ]) {
      fillShape(g, rectPts(x0, y - 7, x1 - x0, 14), SOFT);
      line(g, rectPts(x0, y - 7, x1 - x0, 14), r, 2.2, 0.4);
    }
    line(
      g,
      [
        [16, 112],
        [168, 112],
      ],
      r,
      2,
      0.4,
    );
    for (let y = 8; y < 108; y += 10)
      line(
        g,
        [
          [150, y],
          [150, y + 5],
        ],
        r,
        2.4,
        0.1,
        ORANGE,
      );
  },

  // 23. Graphs: a directed graph and one path through it.
  23(g, r) {
    const p = {
      А: [22, 60],
      Б: [68, 26],
      В: [68, 94],
      Г: [114, 60],
      Д: [158, 60],
    };
    const edges = [
      ["А", "В"],
      ["Б", "В"],
      ["В", "Г"],
    ];
    for (const [a, b] of edges) arrow(g, between(p[a], p[b], 12), r);
    for (const [a, b] of [
      ["А", "Б"],
      ["Б", "Г"],
      ["Г", "Д"],
    ])
      arrow(g, between(p[a], p[b], 12), r, ORANGE, 2.6);
    for (const [k, [x, y]] of Object.entries(p)) node(g, x, y, k, r, 10);
  },

  // 24. Strings: a substring found inside a line of characters.
  24(g, r) {
    const letters = ["A", "B", "B", "A", "C", "B"];
    for (const [i, c] of letters.entries()) txt(g, 33 + i * 22.8, 66, c, 32);
    txt(g, 17, 58, "\u201C", 28);
    txt(g, 163, 58, "\u201D", 28);
    line(
      g,
      [
        [45, 78],
        [47, 88],
        [111, 88],
        [113, 78],
      ],
      r,
      2.6,
      0.3,
      ORANGE,
    );
  },

  // 25. Integers: 12 falls apart into its prime factors.
  25(g, r) {
    txt(g, 90, 36, "12", 30);
    ring(g, 90, 26, 19, 15, r, 2.4, ORANGE);
    line(
      g,
      [
        [78, 44],
        [60, 58],
      ],
      r,
      2.2,
      0.2,
    );
    line(
      g,
      [
        [102, 44],
        [120, 58],
      ],
      r,
      2.2,
      0.2,
    );
    txt(g, 54, 80, "3", 26);
    txt(g, 124, 80, "4", 26);
    line(
      g,
      [
        [118, 86],
        [106, 96],
      ],
      r,
      2.2,
      0.2,
    );
    line(
      g,
      [
        [130, 86],
        [142, 96],
      ],
      r,
      2.2,
      0.2,
    );
    txt(g, 101, 114, "2", 22);
    txt(g, 147, 114, "2", 22);
  },

  // 26. Sorting and selection: bars in order, the top ones picked out.
  26(g, r) {
    const heights = [22, 34, 46, 58, 70, 82];
    for (const [i, h] of heights.entries()) {
      const x = 26 + i * 22;
      fillShape(g, rectPts(x, 100 - h, 14, h), SOFT);
      line(g, rectPts(x, 100 - h, 14, h), r, 2.2, 0.4);
    }
    line(
      g,
      [
        [16, 100],
        [164, 100],
      ],
      r,
      2.6,
      0.6,
    );
    line(
      g,
      [
        [112, 26],
        [112, 18],
        [158, 6],
        [158, 14],
      ],
      r,
      2.6,
      0.3,
      ORANGE,
    );
  },

  // 27. Clustering: clouds of points, each with its centre.
  27(g, r) {
    const clusters = [
      [48, 46, 24, 18],
      [128, 38, 22, 16],
      [102, 88, 26, 15],
    ];
    for (const [cx, cy, rx, ry] of clusters) {
      ink(g, oval({ cx, cy, rx: rx + 6, ry: ry + 6, flat: false }, r), 1.8, r);
      for (let i = 0; i < 7; i++) {
        const a = r() * Math.PI * 2;
        const d = 0.35 + r() * 0.55;
        blob(
          g,
          cx + Math.cos(a) * rx * d,
          cy + Math.sin(a) * ry * d,
          2.4,
          2.4,
          r,
        );
      }
      line(
        g,
        [
          [cx - 4, cy - 4],
          [cx + 4, cy + 4],
        ],
        r,
        2.4,
        0.1,
        ORANGE,
      );
      line(
        g,
        [
          [cx + 4, cy - 4],
          [cx - 4, cy + 4],
        ],
        r,
        2.4,
        0.1,
        ORANGE,
      );
    }
  },
};

// Shared with topic_heads.mjs, which redraws the pictures in the topic heads.
export { arrow, arrowHead, between, grid, node, ring };

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [out] = process.argv.slice(2);
  for (const [n, draw] of Object.entries(TOPICS)) {
    const svg = el("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: `0 0 ${W} ${H}`,
    });
    const defs = el("defs", {}, svg);
    const id = `topic-${n}-ink`;
    inkFilter(defs, id);
    draw(el("g", { filter: `url(#${id})` }, svg), rng(200 + Number(n)));
    writeScene(out, `topic-${n}`, svg, { motion: false });
  }
}
