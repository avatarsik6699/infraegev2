// Builds the mascot scenes drawn as PNG by the architect: traces the masks
// from trace_prep.py, redraws the mascot face with the pen, lets the small
// free pieces twinkle and adds small abstract marks around the drawing.
//
// Usage: node trace.mjs <work-dir> <out-dir>
//   <work-dir>/<scene>/ is the output of trace_prep.py for each scene below.
// Requires potrace and svgo (see package.json next to this file).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import potrace from "potrace";
import { at, el, inkFilter, P, rng, writeScene } from "./doodles.mjs";
import { facePaths, INK, ORANGE } from "./pen.mjs";

const [work, out] = process.argv.slice(2);

const trace = (file) =>
  new Promise((resolve, reject) =>
    potrace.trace(
      file,
      { threshold: 128, turdSize: 12, optTolerance: 0.4, alphaMax: 1.0 },
      (error, svg) => (error ? reject(error) : resolve(svg)),
    ),
  );
const pathData = (svg) => svg.match(/ d="([^"]+)"/)?.[1] ?? "";

// Extra colour layers (Change 192) take a little ink, like a coloured ink
// line rather than a marker.
const inked = (hex, k = 0.14) =>
  "#" +
  [1, 3, 5]
    .map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16);
      const ink = parseInt(INK.slice(i, i + 2), 16);
      return Math.round(c * (1 - k) + ink * k)
        .toString(16)
        .padStart(2, "0");
    })
    .join("");

// Traced drawing: static ink and colour layers, then each free piece in its
// own twinkling group, then the face.
async function traced(name, { rough = false } = {}) {
  const dir = join(work, name);
  const scene = JSON.parse(readFileSync(join(dir, "scene.json"), "utf8"));
  const s = scene.scale;
  const svg = el("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: `0 0 ${scene.w} ${scene.h}`,
  });
  const defs = el("defs", {}, svg);
  // `rough`: an uneven ink edge over the traced curves, as in the poses.
  if (rough) {
    defs.children.push(
      `<filter id="mascot-${name}-rough" x="-2%" y="-2%" width="104%" height="104%">` +
        `<feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="5" result="n"/>` +
        `<feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" xChannelSelector="R" yChannelSelector="G"/>` +
        `</filter>`,
    );
  }
  const drawing = el(
    "g",
    {
      transform: `scale(${1 / s})`,
      "fill-rule": "evenodd",
      ...(rough && { filter: `url(#mascot-${name}-rough)` }),
    },
    svg,
  );
  const layers = [
    ["ink.png", INK, "mascot-ink"],
    ["accent.png", ORANGE, "mascot-accent"],
    ...(scene.tints ?? []).map((tint) => [
      tint.file,
      inked(tint.fill),
      "mascot-tint",
    ]),
  ];
  for (const [file, fill, cls] of layers) {
    el(
      "path",
      { class: cls, fill, d: pathData(await trace(join(dir, file))) },
      drawing,
    );
  }
  for (const [index, item] of scene.items.entries()) {
    const group = el("g", twinkle(index), drawing);
    el(
      "path",
      {
        fill: INK,
        transform: `translate(${item.x * s} ${item.y * s})`,
        d: pathData(await trace(join(dir, `item-${index}.png`))),
      },
      group,
    );
  }
  if (scene.face) {
    // The face is redrawn with the pen, like the approved poses (build.mjs).
    const id = `mascot-face-${name}`;
    const seed = 3 * 31 + name.length * 7;
    defs.children.push(
      `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">` +
        `<feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="${seed}" result="n"/>` +
        `<feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>` +
        `</filter>`,
    );
    const face = el(
      "g",
      { class: "mascot-face", fill: INK, filter: `url(#${id})` },
      svg,
    );
    // Generated faces draw the mouth heavier than the outline; the sheet's
    // mouth is a lighter line, so strokes are capped below the outline width.
    const lines = {
      ...scene.face,
      strokes: scene.face.strokes.map((st) => ({
        ...st,
        pts: st.closed ? st.pts : extendEnds(st.pts, st.w * 0.7),
        w: Math.min(st.w, scene.face.width * 0.72),
      })),
    };
    for (const d of facePaths(lines, seed)) el("path", { d }, face);
  }
  return { svg, defs };
}

// Thinning eats about half a stroke width at each open end (the upturned
// corners of a smile); grow both ends back along their direction.
function extendEnds(pts, by) {
  const grow = ([ax, ay], [bx, by_]) => {
    const l = Math.hypot(ax - bx, ay - by_) || 1;
    return [ax + ((ax - bx) / l) * by, ay + ((ay - by_) / l) * by];
  };
  const n = pts.length;
  if (n < 3) return pts;
  return [grow(pts[0], pts[2]), ...pts, grow(pts[n - 1], pts[n - 3])];
}

const twinkle = (i) => ({
  class: "mascot-twinkle",
  style: `--d:${(2.6 + (i % 4) * 0.4).toFixed(1)}s;--delay:${(-i * 0.5).toFixed(1)}s`,
});

// Units here are about a third of a screen pixel, so motion is scaled up.
const bob = (i) => ({
  class: "mascot-bob",
  style:
    `--d:${(6.2 + (i % 3) * 0.6).toFixed(1)}s;--delay:${(-i * 1.1).toFixed(1)}s;` +
    `--x:${i % 2 ? -6 : 6}px;--y:-12px;--r:${i % 2 ? 5 : -5}deg`,
});

// Small abstract marks spread around the drawing: [kind, x, y, scale].
// Sparkles twinkle, rings sway; in a `calm` scene (Change 192) rings only
// pulse too, nothing moves.
function floaters(svg, defs, name, seed, items, calm = false) {
  const id = `mascot-${name}-ink`;
  inkFilter(defs, id);
  const layer = el("g", { filter: `url(#${id})` }, svg);
  const r = rng(seed);
  for (const [i, [kind, x, y, scale]] of items.entries()) {
    const group = el(
      "g",
      kind === "sparkle" || calm ? twinkle(i) : bob(i),
      layer,
    );
    P[kind](at(group, x, y, scale), r);
  }
}

// Each scene: the seed of its marks and the marks themselves.
const SCENES = {
  // Sign-in: the mascot unlocks the door, light rays shimmer through the gap.
  "sign-in": {
    seed: 131,
    marks: [
      ["sparkle", 70, 90, 3],
      ["ring", 390, 50, 3],
      ["sparkle", 150, 330, 2.6],
      ["ring", 360, 300, 2.6],
      ["sparkle", 1020, 110, 3],
      ["ring", 1040, 430, 2.6],
      ["sparkle", 1030, 770, 2.8],
      ["ring", 60, 600, 2.6],
    ],
  },
  // Registration: the mascot fills in its own sign-up form on a clipboard;
  // the marks at the pencil tip shimmer.
  register: {
    seed: 137,
    marks: [
      ["ring", 60, 80, 3],
      ["sparkle", 250, 50, 3],
      ["ring", 410, 50, 2.6],
      ["sparkle", 110, 290, 2.6],
      ["ring", 330, 330, 2.6],
      ["sparkle", 40, 500, 2.8],
      ["sparkle", 370, 860, 2.6],
    ],
  },
  // 404: the mascot peeks through an open door into nowhere, a signpost aside.
  "not-found": {
    seed: 139,
    marks: [
      ["sparkle", 150, 90, 3.5],
      ["ring", 300, 170, 3],
      ["ring", 920, 90, 3],
      ["sparkle", 1100, 70, 3.5],
      ["ring", 1160, 250, 3],
    ],
  },
  // Error: the mascot holds the unplugged cord of a sparking server.
  error: {
    seed: 149,
    marks: [
      ["sparkle", 100, 80, 3.5],
      ["ring", 560, 70, 3],
      ["sparkle", 640, 160, 3],
      ["ring", 1000, 130, 3],
      ["sparkle", 1120, 210, 3.5],
      ["ring", 90, 300, 3],
    ],
  },
  // Nothing found: the mascot looks into an empty box with a magnifier.
  "empty-search": {
    seed: 151,
    marks: [
      ["ring", 100, 70, 3],
      ["sparkle", 340, 40, 3.5],
      ["sparkle", 920, 70, 3.5],
      ["ring", 1170, 120, 3],
      ["sparkle", 1220, 260, 3],
      ["ring", 40, 260, 3],
    ],
  },
  // Change 192, paywall: the mascot with a key and a sword before a locked
  // gate, the task monsters on top of it.
  paywall: {
    seed: 157,
    rough: true,
    calm: true,
    marks: [
      ["sparkle", 70, 90, 3.4],
      ["ring", 330, 120, 3],
      ["sparkle", 560, 60, 3],
      ["ring", 1180, 120, 3],
      ["sparkle", 1150, 1000, 3],
      ["ring", 620, 1000, 2.8],
    ],
  },
  // Guest paywall: the mascot brings a ready account card.
  "paywall-guest": {
    seed: 163,
    rough: true,
    calm: true,
    marks: [
      ["sparkle", 60, 60, 3.4],
      ["ring", 600, 60, 3],
      ["sparkle", 1000, 120, 3],
      ["ring", 1020, 420, 2.8],
      ["sparkle", 480, 610, 2.6],
    ],
  },
  // /pricing: the mascot carries a bag of lessons and pays by card.
  pricing: {
    seed: 167,
    rough: true,
    calm: true,
    marks: [
      ["sparkle", 50, 60, 3.4],
      ["ring", 760, 70, 3],
      ["sparkle", 860, 150, 3],
      ["ring", 1270, 130, 3],
      ["sparkle", 1280, 640, 3],
      ["ring", 30, 420, 2.8],
      ["sparkle", 720, 690, 2.6],
    ],
  },
};

// `node trace.mjs <work> <out> [scene...]` rebuilds only the named scenes.
const only = process.argv.slice(4);
for (const [name, { seed, marks, rough, calm }] of Object.entries(SCENES)) {
  if (only.length && !only.includes(name)) continue;
  const { svg, defs } = await traced(name, { rough });
  floaters(svg, defs, name, seed, marks, calm);
  writeScene(out, name, svg);
}
