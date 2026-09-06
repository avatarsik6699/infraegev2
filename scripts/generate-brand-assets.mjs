import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const sourcePath = resolve(
  rootDir,
  "docs/artifacts/references/infraege-mark.svg",
);
const publicDir = resolve(rootDir, "apps/web/public");
const brandDir = resolve(publicDir, "brand");
const headerAssetPath = resolve(
  rootDir,
  "apps/web/src/widgets/public-header/assets/infraege-mark.svg",
);
const source = readFileSync(sourcePath, "utf8");

const pathCount = source.match(/<path\b/g)?.length ?? 0;
if (
  !source.includes('viewBox="0 0 120 156"') ||
  pathCount !== 3 ||
  (source.match(/class="stone-ink"/g)?.length ?? 0) !== 2 ||
  (source.match(/class="stone-accent"/g)?.length ?? 0) !== 1 ||
  /<image\b|<text\b|<script\b|<filter\b|(?:href|src)=["']https?:\/\//i.test(
    source,
  )
) {
  throw new Error(
    "infraege-mark.svg does not satisfy the approved source contract",
  );
}

const productionMark = source.replace(
  /<svg\b[^>]*>/,
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 156" fill="none" preserveAspectRatio="xMidYMid meet">',
);
const faviconTheme =
  "<style>@media (prefers-color-scheme: dark) { .stone-ink { fill: #fff; } }</style>";
const smallMark = productionMark
  .replace('viewBox="0 0 120 156"', 'viewBox="-18 0 156 156"')
  .replace(/(<svg\b[^>]*>)/, `$1${faviconTheme}`);
const productionMarkPath = resolve(brandDir, "infraege-mark.svg");

writeFileSync(productionMarkPath, productionMark);
writeFileSync(headerAssetPath, productionMark);
writeFileSync(resolve(publicDir, "favicon.svg"), smallMark);

const runFfmpeg = (args) => {
  const result = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", ...args],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || "ffmpeg failed to generate a brand asset");
  }
};

const renderIcon = (
  size,
  outputPath,
  markPath = productionMarkPath,
  pixelFormat = "rgb24",
) => {
  const markSize = Math.max(1, Math.round(size * 0.78));
  runFfmpeg([
    "-f",
    "lavfi",
    "-i",
    `color=c=0xF5F3EF:s=${size}x${size}:d=1`,
    "-i",
    markPath,
    "-filter_complex",
    `[1:v]scale=${markSize}:${markSize}:flags=lanczos:force_original_aspect_ratio=decrease[mark];[0:v][mark]overlay=(W-w)/2:(H-h)/2:format=auto,format=${pixelFormat}[out]`,
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

renderIcon(16, favicon16Path, resolve(publicDir, "favicon.svg"), "rgba");
renderIcon(32, favicon32Path, resolve(publicDir, "favicon.svg"), "rgba");
renderIcon(180, resolve(publicDir, "apple-touch-icon.png"));
renderIcon(192, resolve(brandDir, "infraege-icon-192.png"));
renderIcon(512, resolve(brandDir, "infraege-icon-512.png"));

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

const alegreyaPath = resolve(
  publicDir,
  "fonts/alegreya/alegreya-latin-wght-normal.woff2",
);
const golosPath = resolve(
  publicDir,
  "fonts/golos-text/golos-text-cyrillic-wght-normal.woff2",
);
const socialFilter = [
  "[1:v]scale=190:-1:flags=lanczos[mark]",
  "[0:v][mark]overlay=250:(H-h)/2:format=auto[lockup]",
  `[lockup]drawtext=fontfile='${alegreyaPath}':text='infraege':fontcolor=0x1A1A1A:fontsize=112:x=465:y=188`,
  `drawtext=fontfile='${golosPath}':text='подготовка к ЕГЭ по информатике':fontcolor=0x777777:fontsize=31:x=470:y=326`,
  "format=rgb24[out]",
].join(",");

runFfmpeg([
  "-f",
  "lavfi",
  "-i",
  "color=c=0xF5F3EF:s=1200x630:d=1",
  "-i",
  productionMarkPath,
  "-filter_complex",
  socialFilter,
  "-map",
  "[out]",
  "-frames:v",
  "1",
  "-y",
  resolve(brandDir, "infraege-social.png"),
]);

for (const stalePath of [
  resolve(brandDir, "alchimia-mark.svg"),
  resolve(brandDir, "alchimia-icon-192.png"),
  resolve(brandDir, "alchimia-icon-512.png"),
  resolve(brandDir, "alchimia-social.png"),
  resolve(
    rootDir,
    "apps/web/src/widgets/public-header/assets/alchimia-mark.svg",
  ),
]) {
  rmSync(stalePath, { force: true });
}
