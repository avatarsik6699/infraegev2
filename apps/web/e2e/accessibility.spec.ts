import { test } from "./fixtures";

for (const path of ["/", "/removed-route"]) {
  test(`no serious accessibility violations on ${path}`, async ({
    accessibilityPage,
  }) => {
    await accessibilityPage.expectNoBlockingViolations(path);
  });
}
