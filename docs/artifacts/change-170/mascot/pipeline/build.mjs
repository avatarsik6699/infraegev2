// Builds the approved mascot poses: traced body and accent from prepare.py masks,
// face lines (eyes, mouth, brows) redrawn with the ink pen, optimised with svgo.
//
// Usage: node build.mjs <work-dir> <out-dir>
// Requires potrace and svgo (see package.json next to this file).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import potrace from "potrace";
import { optimize } from "svgo";
import { dense, inkDot, inkStroke, INK, ORANGE, rng } from "./pen.mjs";

const [work, out] = process.argv.slice(2);
const TRACE_SCALE = 4;
// Seed per pose that produced the approved faces on the demo page.
const PEN_SEED = 3;

const trace = (file) =>
  new Promise((resolve, reject) =>
    potrace.trace(
      file,
      { threshold: 128, turdSize: 20, optTolerance: 0.4, alphaMax: 1.0 },
      (error, svg) => (error ? reject(error) : resolve(svg)),
    ),
  );
const pathData = (svg) => svg.match(/ d="([^"]+)"/)?.[1] ?? "";

// ---------- face ----------

function facePaths(face, seed) {
  const r = rng(seed);
  const paths = [];
  const W = face.width * 1.3;
  for (const stroke of face.strokes) {
    let pts = stroke.pts.map((p) => p.slice());
    if (pts.length < 2) continue;
    if (stroke.closed) {
      // One pen loop: start somewhere and run past the start.
      pts = pts.slice(0, -1);
      const k = Math.floor(r() * pts.length);
      pts = pts.slice(k).concat(pts.slice(0, k));
      const extra = Math.max(2, Math.round(pts.length * 0.12));
      pts = pts.concat(
        pts
          .slice(0, extra)
          .map(([x, y]) => [
            x + (r() - 0.5) * W * 0.5,
            y + (r() - 0.5) * W * 0.5,
          ]),
      );
    }
    const line = dense(pts, 6);
    const short = line.length < 40;
    const width = short
      ? Math.min(stroke.w || face.width, face.width) * 0.95
      : (stroke.w || face.width) * 1.3;
    paths.push(
      inkStroke(line, width, r, {
        taperIn: short ? 0.2 : 0.1,
        taperOut: short ? 0.24 : 0.16,
      }),
    );
    if (stroke.closed && r() < 0.7) {
      // Short second pass beside the loop.
      const from = Math.floor(r() * line.length * 0.6);
      const span = Math.floor(line.length * (0.15 + r() * 0.15));
      const offset = W * (0.35 + r() * 0.25);
      const part = line.slice(from, from + span);
      if (part.length > 6) {
        const shifted = part.map(([x, y], i, arr) => {
          const a = arr[Math.max(0, i - 1)];
          const b = arr[Math.min(arr.length - 1, i + 1)];
          const nx = -(b[1] - a[1]);
          const ny = b[0] - a[0];
          const l = Math.hypot(nx, ny) || 1;
          return [x + (nx / l) * offset, y + (ny / l) * offset];
        });
        paths.push(inkStroke(shifted, W * 0.4, r));
      }
    }
  }
  for (const [x, y, rx, ry] of face.dots) {
    paths.push(inkDot(x, y, rx * 1.12, ry * 1.12, r));
  }
  return paths;
}

// ---------- build ----------

const faces = JSON.parse(readFileSync(join(work, "faces.json"), "utf8"));
mkdirSync(out, { recursive: true });
for (const [name, face] of Object.entries(faces)) {
  const body = await trace(join(work, "masks", `${name}-body.png`));
  const accent = await trace(join(work, "masks", `${name}-accent.png`));
  const seed = PEN_SEED * 31 + name.length * 7;
  const filterId = `mascot-face-${name}`;
  const face_ = facePaths(face, seed)
    .map((d) => `<path d="${d}"/>`)
    .join("");
  // The face keeps the fine displacement it had on the demo page.
  const raw =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${face.w} ${face.h}">` +
    `<defs><filter id="${filterId}" x="-5%" y="-5%" width="110%" height="110%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="${seed % 997}" result="n"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>` +
    `</filter></defs>` +
    `<g transform="scale(${1 / TRACE_SCALE})" fill-rule="evenodd">` +
    `<path class="mascot-ink" fill="${INK}" d="${pathData(body)}"/>` +
    `<path class="mascot-accent" fill="${ORANGE}" d="${pathData(accent)}"/>` +
    `</g>` +
    `<g class="mascot-face" fill="${INK}" filter="url(#${filterId})">${face_}</g>` +
    `</svg>`;
  const svg = optimize(raw, {
    multipass: true,
    floatPrecision: 1,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            cleanupIds: false,
            removeUnknownsAndDefaults: false,
          },
        },
      },
    ],
  }).data;
  writeFileSync(join(out, `${name}.svg`), svg + "\n");
  console.log(`${name}.svg ${(svg.length / 1024).toFixed(1)} KB`);
}
