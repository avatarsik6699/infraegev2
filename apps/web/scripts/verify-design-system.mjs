import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const sourceRoot = path.resolve(import.meta.dirname, "../src");
const collect = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? collect(file) : [file];
  });

const themeViolations = (source, file) => {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const foundation = ["app/styles/theme.css", "app/styles/tokens.css"].includes(
    file,
  );
  return [
    /--(?:[a-z]+-)*alchimia-/i.test(css) && "retired token",
    !foundation && /var\(\s*--theme-/.test(css) && "direct theme consumption",
    !foundation &&
      /--(?:theme|color|font|control|input)-[\w-]+\s*:/.test(css) &&
      "private theme override",
  ].filter(Boolean);
};

for (const [source, file, expected] of [
  [
    ".button { color: var(--color-text); }",
    "shared/components/button/button.module.css",
    [],
  ],
  [":root { --color-text: var(--theme-ink); }", "app/styles/tokens.css", []],
  [":root { --theme-ink: #1a1a1a; }", "app/styles/theme.css", []],
  [".page { --illustration-width: 20rem; }", "pages/example.module.css", []],
  [
    ".page { color: var(--color-alchimia-ink); }",
    "pages/example.module.css",
    ["retired token"],
  ],
  [
    ".page { color: var( --theme-ink); }",
    "pages/example.module.css",
    ["direct theme consumption"],
  ],
  [
    ".page { --font-ui: serif; }",
    "pages/example.module.css",
    ["private theme override"],
  ],
  [
    ".page { --control-primary-bg: red; }",
    "pages/example.module.css",
    ["private theme override"],
  ],
]) {
  assert.deepEqual(themeViolations(source, file), expected);
}

const files = collect(sourceRoot);
const failures = files
  .filter((file) => /\.(css|tsx|ts)$/.test(file))
  .flatMap((file) => {
    const relative = path.relative(sourceRoot, file);
    return themeViolations(fs.readFileSync(file, "utf8"), relative).map(
      (error) => `${relative}: ${error}`,
    );
  });
assert.deepEqual(
  failures,
  [],
  `Design-system boundary violations:\n${failures.join("\n")}`,
);

// Public UI barrels use explicit names so coverage cannot silently skip wildcard APIs.
const publicUiExports = (source) => {
  const parsed = ts.createSourceFile(
    "index.ts",
    source,
    ts.ScriptTarget.Latest,
  );
  const names = [];
  for (const statement of parsed.statements) {
    assert.ok(
      !ts.isExportAssignment(statement),
      "UI barrels must use explicit named re-exports",
    );
    if (!ts.isExportDeclaration(statement)) {
      assert.ok(
        !statement.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
        ) ||
          ts.isTypeAliasDeclaration(statement) ||
          ts.isInterfaceDeclaration(statement),
        "UI barrels must use explicit named re-exports for runtime values",
      );
      continue;
    }
    if (statement.isTypeOnly) continue;
    assert.ok(
      statement.exportClause && ts.isNamedExports(statement.exportClause),
      "UI barrels must use explicit named re-exports, not wildcard or namespace exports",
    );
    for (const entry of statement.exportClause.elements) {
      if (!entry.isTypeOnly && /^[A-Z]\w*$/.test(entry.name.text))
        names.push(entry.name.text);
    }
  }
  return names;
};
assert.deepEqual(
  publicUiExports(`
  // export { Phantom } from "./phantom";
  export { Button, Input as TextInput, type Props, helper } from "./controls";
  export type { Model } from "./types";
`),
  ["Button", "TextInput"],
);
for (const source of [
  'export * from "./button";',
  'export * as Controls from "./button";',
  "export const Button = () => null;",
  "export default function Button() {}",
  "export default () => null;",
])
  assert.throws(() => publicUiExports(source), /explicit named re-exports/);

const publicNames = new Set();
for (const file of files.filter((file) =>
  /\/(?:shared\/components|entities|features|widgets)\/[^/]+\/index\.ts$/.test(
    file,
  ),
)) {
  for (const name of publicUiExports(fs.readFileSync(file, "utf8")))
    publicNames.add(name);
}
const catalog = fs.readFileSync(
  path.join(sourceRoot, "pages/design-system-lab/catalog-contracts.ts"),
  "utf8",
);
const names = [...catalog.matchAll(/(?:live|context)\(\s*"([^"]+)"/g)].map(
  (match) => match[1],
);
const coverageProblems = (expected, actual) => ({
  missing: [...expected].filter((name) => !actual.includes(name)),
  stale: actual.filter((name) => !expected.has(name)),
  duplicate: actual.filter((name, index) => actual.indexOf(name) !== index),
});
assert.deepEqual(coverageProblems(new Set(["Button"]), ["Button"]), {
  missing: [],
  stale: [],
  duplicate: [],
});
assert.deepEqual(
  coverageProblems(new Set(["Button", "Input"]), [
    "Button",
    "Button",
    "Removed",
  ]),
  {
    missing: ["Input"],
    stale: ["Removed"],
    duplicate: ["Button"],
  },
);
assert.deepEqual(
  coverageProblems(publicNames, names),
  { missing: [], stale: [], duplicate: [] },
  "Every public UI export needs one named live or contextual catalog entry",
);
console.log(
  `Design-system policy: PASS (theme boundaries and ${names.length} public UI contracts)`,
);
