// Builds the approved mascot poses: traced body and accent from prepare.py masks,
// face lines (eyes, mouth, brows) redrawn with the ink pen, optimised with svgo.
//
// Usage: node build.mjs <work-dir> <out-dir>
// Requires potrace and svgo (see package.json next to this file).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import potrace from "potrace";
import { optimize } from "svgo";
import { facePaths, INK, ORANGE } from "./pen.mjs";

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
