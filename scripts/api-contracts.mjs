import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
  fileURLToPath(new URL("..", import.meta.url)),
);
const apiRoot = path.join(repositoryRoot, "apps", "api");
const trackedSchema = path.join(repositoryRoot, "contracts", "openapi.json");
const trackedTypes = path.join(
  repositoryRoot,
  "apps",
  "web",
  "src",
  "shared",
  "api",
  "schema.ts",
);
const check = process.argv.includes("--check");
const temporaryRoot = check
  ? mkdtempSync(path.join(tmpdir(), "infraege-openapi-"))
  : null;
const schemaOutput = temporaryRoot
  ? path.join(temporaryRoot, "openapi.json")
  : trackedSchema;
const typesOutput = temporaryRoot
  ? path.join(temporaryRoot, "schema.ts")
  : trackedTypes;

function run(command, args, cwd = repositoryRoot) {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

function assertSame(actualPath, expectedPath, label) {
  const actual = readFileSync(actualPath);
  const expected = readFileSync(expectedPath);
  if (!actual.equals(expected)) {
    throw new Error(
      `${label} drift detected. Run \`pnpm api:generate\` and review the generated diff.`,
    );
  }
}

try {
  run(
    "uv",
    ["run", "python", "scripts/export_openapi.py", schemaOutput],
    apiRoot,
  );
  run("pnpm", [
    "--filter",
    "web",
    "exec",
    "openapi-typescript",
    schemaOutput,
    "--output",
    typesOutput,
  ]);

  if (check) {
    assertSame(schemaOutput, trackedSchema, "OpenAPI schema");
    assertSame(typesOutput, trackedTypes, "Generated TypeScript contract");
    console.log("API contract drift check: PASS");
  }
} finally {
  if (temporaryRoot) rmSync(temporaryRoot, { recursive: true, force: true });
}
