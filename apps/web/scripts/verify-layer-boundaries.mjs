import fs from "node:fs";
import path from "node:path";

const appRoot = path.resolve(import.meta.dirname, "..");
const sourceRoot = path.join(appRoot, "src");
const isolatedLayers = new Set(["entities", "features", "widgets", "pages"]);
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const importPattern =
  /(?:\bfrom\s*|\bimport\s*(?:\(\s*)?|\brequire\s*\(\s*)["']([^"']+)["']/g;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function sliceFor(filePath) {
  const relative = path.relative(sourceRoot, filePath);
  const [layer, slice] = relative.split(path.sep);
  return isolatedLayers.has(layer) && slice ? { layer, slice } : null;
}

function resolveImport(importer, specifier) {
  if (specifier.startsWith("~/"))
    return path.join(sourceRoot, specifier.slice(2));
  if (specifier.startsWith("."))
    return path.resolve(path.dirname(importer), specifier);
  return null;
}

function boundaryViolation(importer, specifier) {
  const owner = Object.assign({ layer: "", slice: "" }, sliceFor(importer));
  const targetPath = resolveImport(importer, specifier);
  const target = Object.assign(
    { layer: "", slice: "" },
    sliceFor(String(targetPath)),
  );
  const crossesSiblingSlice = [
    isolatedLayers.has(owner.layer),
    owner.layer === target.layer,
    owner.slice !== target.slice,
  ].every(Boolean);
  return crossesSiblingSlice
    ? `${owner.layer}/${owner.slice} must not import ${target.layer}/${target.slice}`
    : null;
}

const cases = [
  ["features/a/file.ts", "~/features/b", true],
  ["features/a/model/file.ts", "../../b", true],
  ["features/a/file.ts", "../a/model", false],
  ["pages/a/file.ts", "~/features/b", false],
];
for (const [importer, specifier, expected] of cases) {
  const actual = Boolean(
    boundaryViolation(path.join(sourceRoot, importer), specifier),
  );
  if (actual !== expected)
    throw new Error(
      `Layer-boundary policy self-test failed: ${importer} -> ${specifier}`,
    );
}

const violations = [];
for (const file of walk(sourceRoot)) {
  if (!sourceExtensions.has(path.extname(file))) continue;
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(importPattern)) {
    const reason = boundaryViolation(file, match[1]);
    if (reason)
      violations.push(
        `${path.relative(appRoot, file)}: ${match[1]} (${reason})`,
      );
  }
}

if (violations.length > 0) {
  console.error(
    "Same-layer slice boundary violations:\n" + violations.join("\n"),
  );
  process.exitCode = 1;
} else {
  console.log("Layer boundary policy: PASS");
}
