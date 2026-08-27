import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const sourcePath = resolve(rootDir, "docs/artifacts/final_logo.svg");
const publicDir = resolve(rootDir, "apps/web/public");
const brandDir = resolve(publicDir, "brand");
const source = readFileSync(sourcePath, "utf8");

if (
  (source.match(/<ellipse\b/g) ?? []).length !== 3 ||
  (source.match(/<path\b/g) ?? []).length !== 3 ||
  !source.includes('fill="#FF6B00"') ||
  !source.includes('fill="#393939"') ||
  /<script\b|(?:href|src)=["']https?:\/\//i.test(source)
) {
  throw new Error(
    "final_logo.svg does not satisfy the approved source contract",
  );
}

const productionMark = source.replace(
  /<svg\b[^>]*>/,
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 227 319" fill="none" preserveAspectRatio="xMidYMid meet">',
);

const smallMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-46 0 319 319" fill="none" preserveAspectRatio="xMidYMid meet">
  <ellipse cx="115.799" cy="261.5" rx="107" ry="47.5" fill="#393939"/>
  <ellipse cx="112.577" cy="159.596" rx="85.7986" ry="36.8721" transform="rotate(-18.03 112.577 159.596)" fill="#393939"/>
  <ellipse cx="115.964" cy="61.3012" rx="63.135" ry="40.0627" transform="rotate(22.67 115.964 61.3012)" fill="#FF6B00"/>
</svg>
`;

writeFileSync(resolve(brandDir, "infraege-mark.svg"), productionMark);
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

const renderHeaderMark = (outputPath) => {
  runFfmpeg([
    "-i",
    resolve(brandDir, "infraege-mark.svg"),
    "-vf",
    "scale=96:135:flags=lanczos,format=rgba",
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
    resolve(publicDir, "favicon.svg"),
    "-filter_complex",
    `[1:v]scale=${markSize}:${markSize}:flags=lanczos[mark];[0:v][mark]overlay=(W-w)/2:(H-h)/2:format=auto,format=rgb24[out]`,
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
renderHeaderMark(resolve(brandDir, "infraege-mark-header.png"));
renderWhiteIcon(180, resolve(publicDir, "apple-touch-icon.png"));
renderWhiteIcon(192, resolve(brandDir, "infraege-icon-192.png"));
renderWhiteIcon(512, resolve(brandDir, "infraege-icon-512.png"));

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
  "[1:v]scale=-1:420:flags=lanczos[mark]",
  "[0:v][mark]overlay=(W-w)/2:(H-h)/2:format=auto",
  "format=rgb24[out]",
].join(",");

runFfmpeg([
  "-f",
  "lavfi",
  "-i",
  "color=c=white:s=1200x630:d=1",
  "-i",
  resolve(brandDir, "infraege-mark.svg"),
  "-filter_complex",
  socialFilter,
  "-map",
  "[out]",
  "-frames:v",
  "1",
  "-y",
  resolve(brandDir, "infraege-social.png"),
]);
