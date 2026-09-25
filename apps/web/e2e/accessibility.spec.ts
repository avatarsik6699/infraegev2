import { test } from "./fixtures";

for (const path of [
  "/",
  "/courses/python",
  "/courses/python/pervaya-programma",
  "/practice",
  "/ege",
  "/ege/16-rekursiya",
  "/privacy",
  "/sign-in",
  "/register",
  "/account",
  "/removed-route",
]) {
  test(`no serious accessibility violations on ${path}`, async ({
    accessibilityPage,
  }) => {
    await accessibilityPage.expectNoBlockingViolations(path);
  });
}
