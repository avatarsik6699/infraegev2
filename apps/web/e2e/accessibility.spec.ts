import { test } from "./fixtures";

for (const path of [
  "/",
  "/theory/zadanie-1-graphs-and-tables",
  "/privacy",
  "/terms",
]) {
  test(`no serious accessibility violations on ${path}`, async ({
    accessibilityPage,
  }) => {
    await accessibilityPage.expectNoBlockingViolations(path);
  });
}
