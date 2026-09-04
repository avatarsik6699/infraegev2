import { test } from "./fixtures";

for (const path of [
  "/",
  "/courses/python",
  "/courses/python/pervaya-programma",
  "/lab/design-system",
  "/ege/16-rekursiya",
  "/privacy",
  "/removed-route",
]) {
  test(`no serious accessibility violations on ${path}`, async ({
    accessibilityPage,
  }) => {
    await accessibilityPage.expectNoBlockingViolations(path);
  });
}
