import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ESLint } from "eslint";

const workspaceRoot = path.join(import.meta.dirname, "..");
const sourcePath = path.join(
  workspaceRoot,
  "src",
  "shared",
  "lib",
  "safe-json.ts",
);
const apiPath = path.join(workspaceRoot, "src", "shared", "api", "errors.ts");
const storagePath = path.join(
  workspaceRoot,
  "src",
  "shared",
  "lib",
  "safe-ls.ts",
);
const eslint = new ESLint({ cwd: workspaceRoot });

const applicationSourceRoot = path.join(workspaceRoot, "src");

function collectSourceFiles(directoryPath) {
  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) return collectSourceFiles(entryPath);
      return /\.(?:css|ts|tsx)$/.test(entry.name) ? [entryPath] : [];
    });
}

const applicationSourceFiles = collectSourceFiles(applicationSourceRoot);
const removedVendorReferences = applicationSourceFiles.filter((filePath) =>
  /(?:@mantine\/|mantine-)/i.test(fs.readFileSync(filePath, "utf8")),
);
assert.deepEqual(
  removedVendorReferences,
  [],
  `Mantine references must not remain in application source:\n${removedVendorReferences.join("\n")}`,
);
const baseUiConsumers = applicationSourceFiles.filter((filePath) =>
  fs.readFileSync(filePath, "utf8").includes("@base-ui/react"),
);
assert.ok(
  baseUiConsumers.every((filePath) =>
    filePath.includes(`${path.sep}shared${path.sep}components${path.sep}`),
  ),
  `Base UI imports must stay inside shared/components:\n${baseUiConsumers.join("\n")}`,
);

const themeFilePath = path.join(
  applicationSourceRoot,
  "app",
  "styles",
  "theme.css",
);
const typographyTokenFilePath = path.join(
  applicationSourceRoot,
  "app",
  "styles",
  "tokens.css",
);
const fontFaceFilePath = path.join(
  applicationSourceRoot,
  "app",
  "styles",
  "fonts.css",
);
const lockedLessonLabStylePath = path.join(
  applicationSourceRoot,
  "pages",
  "lesson-design-lab",
  "lesson-design-lab.module.css",
);
const cssColorLiterals = applicationSourceFiles
  .filter((filePath) => filePath.endsWith(".css") && filePath !== themeFilePath)
  .flatMap((filePath) => {
    const matches =
      fs.readFileSync(filePath, "utf8").match(/#[0-9a-f]{3,8}\b/gi) ?? [];
    return matches.map(
      (value) => `${path.relative(workspaceRoot, filePath)}: ${value}`,
    );
  });
assert.deepEqual(
  cssColorLiterals,
  [],
  `Literal CSS colors belong in app/styles/theme.css:\n${cssColorLiterals.join("\n")}`,
);

const typographyConsumerFiles = applicationSourceFiles.filter(
  (filePath) =>
    filePath.endsWith(".css") &&
    filePath !== themeFilePath &&
    filePath !== typographyTokenFilePath &&
    filePath !== fontFaceFilePath &&
    filePath !== lockedLessonLabStylePath,
);
const literalFontSizes = typographyConsumerFiles.flatMap((filePath) =>
  fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .filter(
      (line) =>
        /font-size:/.test(line) &&
        !/font-size:\s*var\(--text-[^)]+\);/.test(line),
    )
    .map((line) => `${path.relative(workspaceRoot, filePath)}: ${line.trim()}`),
);
assert.deepEqual(
  literalFontSizes,
  [],
  `Component CSS font sizes must use semantic --text-* tokens:\n${literalFontSizes.join("\n")}`,
);
const unsupportedFontWeights = typographyConsumerFiles.flatMap((filePath) =>
  fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .filter(
      (line) =>
        /font-weight:/.test(line) && !/font-weight:\s*(?:500|600);/.test(line),
    )
    .map((line) => `${path.relative(workspaceRoot, filePath)}: ${line.trim()}`),
);
assert.deepEqual(
  unsupportedFontWeights,
  [],
  `Component CSS font weights must stay on the 500/600 baseline:\n${unsupportedFontWeights.join("\n")}`,
);

const validSource = `
  import { safeLs } from "~/shared/lib/safe-ls";
  export const readValue = () => safeLs.get({
    key: "example",
    version: 1,
    guard: (value): value is string => typeof value === "string",
  });
`;

const forbiddenGlobals = [
  ["window", "export const width = window.innerWidth;"],
  ["document", "export const title = document.title;"],
  ["navigator", "export const online = navigator.onLine;"],
  ["localStorage", 'export const value = localStorage.getItem("key");'],
  ["sessionStorage", 'export const value = sessionStorage.getItem("key");'],
  ["fetch", 'export const load = () => fetch("/api/value");'],
  ["process", "export const secret = process.env.SECRET;"],
];

const forbiddenPatterns = [
  ...forbiddenGlobals.map(([name, source]) => ({
    name,
    ruleId: "no-restricted-globals",
    source,
  })),
  {
    name: "removed Mantine vendor import",
    ruleId: "no-restricted-imports",
    source: 'import { Button } from "@mantine/core"; export { Button };',
  },
  {
    name: "floating Promise",
    ruleId: "@typescript-eslint/no-floating-promises",
    source: "Promise.resolve();",
  },
  {
    name: "native fetch outside the transport adapter",
    ruleId: "no-restricted-globals",
    source: 'export const load = () => fetch("/api/value");',
    filePath: apiPath,
  },
  {
    name: "server environment access in a network adapter",
    ruleId: "no-restricted-globals",
    source: "export const secret = process.env.SECRET;",
    filePath: apiPath,
  },
  {
    name: "network access in a storage adapter",
    ruleId: "no-restricted-globals",
    source: 'export const load = () => fetch("/api/value");',
    filePath: storagePath,
  },
  {
    name: "ad-hoc Vite environment access",
    ruleId: "no-restricted-syntax",
    source: "export const value = import.meta.env.VITE_VALUE;",
  },
  {
    name: "Node built-in import in universal code",
    ruleId: "no-restricted-syntax",
    source: 'import { readFile } from "node:fs"; export { readFile };',
  },
];

const [validResult] = await eslint.lintText(validSource, {
  filePath: sourcePath,
});
assert.deepEqual(
  validResult.messages,
  [],
  `Valid application boundary failed policy lint:\n${JSON.stringify(validResult.messages, null, 2)}`,
);

for (const pattern of forbiddenPatterns) {
  const [result] = await eslint.lintText(pattern.source, {
    filePath: pattern.filePath ?? sourcePath,
  });
  assert.ok(
    result.messages.some(({ ruleId }) => ruleId === pattern.ruleId),
    `${pattern.name} was not rejected by ${pattern.ruleId}`,
  );
}

console.log(
  `Application architecture policy: PASS (${forbiddenPatterns.length} unsafe patterns rejected)`,
);
