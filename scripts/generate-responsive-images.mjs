import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../apps/web/public",
);
const groups = [
  {
    directory: "images/course-catalog",
    names: ["python", "advanced", "algorithms", "excel", "staircase"],
    widths: [480, 960, 1536],
  },
  {
    directory: "images/course-overview",
    names: ["sequence", "branch", "stack"],
    widths: [480, 960, 1536],
  },
  {
    directory: "topics",
    names: ["number-representation", "recursive-algorithms"],
    widths: [480],
  },
];

for (const group of groups) {
  const outputDir = resolve(publicDir, group.directory, "responsive");
  mkdirSync(outputDir, { recursive: true });
  for (const name of group.names) {
    for (const width of group.widths) {
      const output = resolve(outputDir, `${name}-${String(width)}.webp`);
      execFileSync(
        "ffmpeg",
        [
          "-hide_banner",
          "-loglevel",
          "error",
          "-i",
          resolve(publicDir, group.directory, `${name}.webp`),
          "-vf",
          `scale=${String(width)}:-2:flags=lanczos`,
          "-frames:v",
          "1",
          "-c:v",
          "libwebp",
          "-quality",
          "85",
          "-compression_level",
          "6",
          "-y",
          output,
        ],
        { stdio: "inherit" },
      );
      console.log(
        `${group.directory}/responsive/${name}-${String(width)}.webp: ${String(statSync(output).size)} bytes`,
      );
    }
  }
}
