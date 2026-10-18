#!/usr/bin/env node
// Change 192 (SPEC §6.1): paid lesson text must reach the browser only through the
// gated chunks under assets/paid/. After `pnpm --filter web build`, this check takes
// sentinel lines from every `*.paid.*.tsx` module and fails if one appears in any
// public file of the build outside assets/paid/ (including prerendered HTML), or if a
// paid module left no trace in assets/paid/ (an empty sentinel set proves nothing).

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(REPO, "apps/web/.output/public");
const CONTENT = ["lesson", "course"].map((kind) =>
  join(REPO, "apps/web/src/entities", kind, "content"),
);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

/** JSX text lines of a module: long runs of prose the minifier keeps verbatim. */
function sentinels(source) {
  return source
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        !/[<>{}`"]/u.test(line) &&
        (line.match(/[А-Яа-яЁё]/gu) ?? []).length >= 30,
    );
}

let built;
try {
  built = walk(PUBLIC).filter((path) => /\.(js|html|css|json)$/u.test(path));
} catch {
  console.error(
    `No web build at ${relative(REPO, PUBLIC)}; run pnpm --filter web build`,
  );
  process.exit(1);
}
const paidDir = join(PUBLIC, "assets/paid");
const gated = built.filter((path) => path.startsWith(paidDir + "/"));
const open = built.filter((path) => !path.startsWith(paidDir + "/"));
const gatedText = gated.map((path) => readFileSync(path, "utf8")).join("\n");
const openFiles = open.map((path) => [path, readFileSync(path, "utf8")]);

// The opening paragraph of a paid page is public on purpose (its preview), and so
// are term hints: text a public content module also carries is not a leak. Prettier
// wraps the same paragraph at other points there, so whitespace is collapsed.
const publicSource = CONTENT.flatMap((dir) =>
  readdirSync(dir)
    .filter((file) => /\.tsx?$/u.test(file) && !/\.paid\./u.test(file))
    .map((file) => readFileSync(join(dir, file), "utf8")),
)
  .join("\n")
  .replace(/\s+/gu, " ");

const errors = [];
let modules = 0;
let checked = 0;
for (const dir of CONTENT) {
  for (const name of readdirSync(dir).filter((file) =>
    /\.paid\.[^/]*\.tsx$/u.test(file),
  )) {
    modules += 1;
    const lines = sentinels(readFileSync(join(dir, name), "utf8")).filter(
      (line) => !publicSource.includes(line),
    );
    if (!lines.length) {
      errors.push(`${name}: no sentinel prose found`);
      continue;
    }
    if (!lines.some((line) => gatedText.includes(line))) {
      errors.push(`${name}: its text is not in assets/paid/`);
    }
    for (const line of lines) {
      checked += 1;
      for (const [path, text] of openFiles) {
        if (text.includes(line)) {
          errors.push(
            `${name}: paid text in public ${relative(PUBLIC, path)}: «${line.slice(0, 60)}…»`,
          );
        }
      }
    }
  }
}

if (errors.length) {
  console.error(
    "Paid content leak check failed:\n" +
      [...new Set(errors)].map((error) => `  - ${error}`).join("\n"),
  );
  process.exit(1);
}
console.log(
  `Paid content leak check passed (${modules} paid modules, ${checked} sentinel lines, ${gated.length} gated chunks).`,
);
