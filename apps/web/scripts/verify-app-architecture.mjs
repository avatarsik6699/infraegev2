import assert from "node:assert/strict";
import path from "node:path";
import { ESLint } from "eslint";

const workspaceRoot = path.join(import.meta.dirname, "..");
const sourcePath = path.join(
  workspaceRoot,
  "src",
  "features",
  "track-progress",
  "model",
  "progress-store.ts",
);
const apiPath = path.join(
  workspaceRoot,
  "src",
  "features",
  "check-answer",
  "api",
  "check-answer.ts",
);
const storagePath = path.join(
  workspaceRoot,
  "src",
  "shared",
  "lib",
  "safe-ls.ts",
);
const eslint = new ESLint({ cwd: workspaceRoot });

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
    name: "floating Promise",
    ruleId: "@typescript-eslint/no-floating-promises",
    source: "Promise.resolve();",
  },
  {
    name: "native fetch inside a feature API",
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
