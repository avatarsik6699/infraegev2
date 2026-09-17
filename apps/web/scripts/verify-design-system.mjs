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

// Narrow structural regressions confirmed by the full consumer audit.
const adoptionViolations = (source, file) => {
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const consumerCss = file.startsWith("pages/") && file.endsWith(".css");
  return [
    consumerCss &&
      /\[data-badge\]/.test(clean) &&
      "consumer overrides Badge internals",
    consumerCss &&
      /[\s>]img\b[^{}]*\{/.test(clean) &&
      "consumer overrides Image internals",
    consumerCss &&
      /\.cardTitle\[data-order\]/.test(clean) &&
      "catalog title bypasses Typography role",
    /\.tsx?$/.test(file) &&
      /(?<![\w-])presentation=["']study["']/.test(clean) &&
      "retired learning presentation API",
    file.startsWith("pages/topic-lesson/") &&
      /\.tsx$/.test(file) &&
      /<(?:code|var)(?:\s|>)/.test(clean) &&
      "lesson notation bypasses Notation",
  ].filter(Boolean);
};
for (const [source, file, expected] of [
  [
    ".group [data-badge] { padding: 0; }",
    "pages/catalog/page.module.css",
    ["consumer overrides Badge internals"],
  ],
  [
    ".art img { height: 100%; }",
    "pages/catalog/page.module.css",
    ["consumer overrides Image internals"],
  ],
  [
    ".cardTitle[data-order] { font-size: 2rem; }",
    "pages/catalog/page.module.css",
    ["catalog title bypasses Typography role"],
  ],
  [
    '<LessonPractice presentation="study" />',
    "pages/lesson/page.tsx",
    ["retired learning presentation API"],
  ],
  [
    "<var>n</var>",
    "pages/topic-lesson/proof.tsx",
    ["lesson notation bypasses Notation"],
  ],
  [".image { height: 100%; }", "shared/components/image/image.module.css", []],
  [".art { grid-column: 2; }", "pages/catalog/page.module.css", []],
  [
    '<div data-presentation="study" />',
    "shared/components/lesson/lesson.tsx",
    [],
  ],
  ['<ExternalLink presentation="inline" />', "pages/privacy/page.tsx", []],
  ["<Notation kind='formula'>n</Notation>", "pages/topic-lesson/proof.tsx", []],
])
  assert.deepEqual(adoptionViolations(source, file), expected);

const files = collect(sourceRoot);
const failures = files
  .filter((file) => /\.(css|tsx|ts)$/.test(file))
  .flatMap((file) => {
    const relative = path.relative(sourceRoot, file);
    const source = fs.readFileSync(file, "utf8");
    return [
      ...themeViolations(source, relative),
      ...adoptionViolations(source, relative),
    ].map((error) => `${relative}: ${error}`);
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
console.log(
  `Design-system policy: PASS (theme boundaries and ${publicNames.size} explicit public UI exports)`,
);
