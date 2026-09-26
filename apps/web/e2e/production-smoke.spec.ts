import { test } from "./fixtures";

test("production rendering smoke", async ({ minimalPage }) => {
  await minimalPage.expectProductionRenderingSmoke();
});
