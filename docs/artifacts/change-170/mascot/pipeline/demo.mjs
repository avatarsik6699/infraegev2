// Assembles the review page from demo.template.html: approved poses for the
// character sheet and the baked scenes exactly as the site embeds them.
//
// Usage: node demo.mjs <poses-dir> <scenes-dir> <out-file>
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [posesDir, scenesDir, out] = process.argv.slice(2);
const here = dirname(fileURLToPath(import.meta.url));
const read = (dir, file) => readFileSync(join(dir, file), "utf8").trim();

const poses = Object.fromEntries(
  readdirSync(posesDir)
    .filter((file) => file.endsWith(".svg"))
    .sort()
    .map((file) => [basename(file, ".svg"), read(posesDir, file)]),
);
const page = read(here, "demo.template.html")
  .replace("{{poses}}", () => JSON.stringify(poses))
  .replace(/\{\{scene:([\w-]+)\}\}/g, (_, name) =>
    read(scenesDir, `${name}.svg`),
  );
writeFileSync(out, page + "\n");
console.log(`${out} ${(page.length / 1024).toFixed(1)} KB`);
