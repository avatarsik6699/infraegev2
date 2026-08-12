import assert from "node:assert/strict";
import path from "node:path";
import { ESLint } from "eslint";

const workspaceRoot = path.join(import.meta.dirname, "..");
const specPath = path.join(workspaceRoot, "e2e", "architecture-policy.spec.ts");
const eslint = new ESLint({ cwd: workspaceRoot });

const validSpec = `
  import { test } from "./fixtures";

  test("uses a domain fixture", async ({ topicPage }) => {
    await topicPage.expectPublishedLesson();
  });
`;

const invalidSpecs = [
  {
    name: "raw Playwright import",
    ruleId: "no-restricted-imports",
    source: `
      import { test } from "@playwright/test";
      test("uses raw test", async () => {});
    `,
  },
  {
    name: "raw Playwright package import",
    ruleId: "no-restricted-imports",
    source: `
      import { chromium } from "playwright";
      import { test } from "./fixtures";
      test("launches a browser", async ({ topicPage }) => {
        await chromium.launch();
        await topicPage.expectPublishedLesson();
      });
    `,
  },
  {
    name: "built-in fixture",
    ruleId: "no-restricted-syntax",
    source: `
      import { test } from "./fixtures";
      test("uses page", async ({ page }) => {
        await page.goto("/");
      });
    `,
  },
  {
    name: "Page Object construction",
    ruleId: "no-restricted-syntax",
    source: `
      import { test } from "./fixtures";
      test("constructs an object", async ({ topicPage }) => {
        const pageObject = new HomePage(topicPage);
        await pageObject.expectReady();
      });
    `,
  },
  {
    name: "low-level API",
    ruleId: "no-restricted-syntax",
    source: `
      import { test } from "./fixtures";
      test("uses a raw locator", async ({ topicPage }) => {
        await topicPage.locator("main");
      });
    `,
  },
  {
    name: "runner plumbing",
    ruleId: "no-restricted-syntax",
    source: `
      import { test } from "./fixtures";
      test("uses test info", async ({ topicPage }, testInfo) => {
        testInfo.snapshotSuffix = "raw";
        await topicPage.expectPublishedLesson();
      });
    `,
  },
];

const [validResult] = await eslint.lintText(validSpec, { filePath: specPath });
assert.deepEqual(
  validResult.messages,
  [],
  `Valid declarative spec failed policy lint:\n${JSON.stringify(validResult.messages, null, 2)}`,
);

for (const invalidSpec of invalidSpecs) {
  const [result] = await eslint.lintText(invalidSpec.source, {
    filePath: specPath,
  });
  assert.ok(
    result.messages.some(({ ruleId }) => ruleId === invalidSpec.ruleId),
    `${invalidSpec.name} was not rejected by ${invalidSpec.ruleId}`,
  );
}

console.log(
  `E2E architecture policy: PASS (${invalidSpecs.length} forbidden patterns rejected)`,
);
