import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const sourcePath = resolve(
  rootDir,
  "docs/artifacts/references/logo_with_transperant_bg.svg",
);
const publicDir = resolve(rootDir, "apps/web/public");
const brandDir = resolve(publicDir, "brand");
const source = readFileSync(sourcePath, "utf8");

if (
  !source.includes('viewBox="0 0 2048 1365"') ||
  (source.match(/<path\b/g) ?? []).length === 0 ||
  /<image\b|<text\b|<script\b|<filter\b|(?:href|src)=["']https?:\/\//i.test(
    source,
  )
) {
  throw new Error(
    "logo_with_transperant_bg.svg does not satisfy the approved source contract",
  );
}

const productionMark = source.replace(
  /<svg\b[^>]*>/,
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 1365" fill="none" preserveAspectRatio="xMidYMid meet">',
);

const smallMark = productionMark.replace(
  'viewBox="0 0 2048 1365"',
  'viewBox="0 -341.5 2048 2048"',
);
const productionMarkPath = resolve(brandDir, "alchimia-mark.svg");

writeFileSync(productionMarkPath, productionMark);
writeFileSync(resolve(publicDir, "favicon.svg"), smallMark);

const runFfmpeg = (args) => {
  const result = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", ...args],
    {
      encoding: "utf8",
    },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || "ffmpeg failed to generate a brand asset");
  }
};

const renderTransparentIcon = (size, outputPath) => {
  runFfmpeg([
    "-i",
    resolve(publicDir, "favicon.svg"),
    "-vf",
    `scale=${size}:${size}:flags=lanczos,format=rgba`,
    "-frames:v",
    "1",
    "-y",
    outputPath,
  ]);
};

const renderWhiteIcon = (size, outputPath) => {
  const markSize = Math.round(size * 0.75);
  runFfmpeg([
    "-f",
    "lavfi",
    "-i",
    `color=c=white:s=${size}x${size}:d=1`,
    "-i",
    productionMarkPath,
    "-filter_complex",
    `[1:v]scale=${markSize}:${markSize}:flags=lanczos:force_original_aspect_ratio=decrease[mark];[0:v][mark]overlay=(W-w)/2:(H-h)/2:format=auto,format=rgb24[out]`,
    "-map",
    "[out]",
    "-frames:v",
    "1",
    "-y",
    outputPath,
  ]);
};

const favicon16Path = resolve(publicDir, "favicon-16x16.png");
const favicon32Path = resolve(publicDir, "favicon-32x32.png");

renderTransparentIcon(16, favicon16Path);
renderTransparentIcon(32, favicon32Path);
renderWhiteIcon(180, resolve(publicDir, "apple-touch-icon.png"));
renderWhiteIcon(192, resolve(brandDir, "alchimia-icon-192.png"));
renderWhiteIcon(512, resolve(brandDir, "alchimia-icon-512.png"));

runFfmpeg([
  "-i",
  favicon16Path,
  "-i",
  favicon32Path,
  "-map",
  "0:v",
  "-map",
  "1:v",
  "-c:v",
  "png",
  "-f",
  "ico",
  "-y",
  resolve(publicDir, "favicon.ico"),
]);

const socialFilter = [
  "[1:v]scale=780:-1:flags=lanczos[mark]",
  "[0:v][mark]overlay=(W-w)/2:(H-h)/2:format=auto",
  "format=rgb24[out]",
].join(",");

runFfmpeg([
  "-f",
  "lavfi",
  "-i",
  "color=c=white:s=1200x630:d=1",
  "-i",
  productionMarkPath,
  "-filter_complex",
  socialFilter,
  "-map",
  "[out]",
  "-frames:v",
  "1",
  "-y",
  resolve(brandDir, "alchimia-social.png"),
]);
