import { test } from "./fixtures";

test("minimal page remains readable while fonts are pending and unavailable", async ({
  minimalPage,
}) => {
  await minimalPage.expectStableDelivery();
});

test("mobile lesson outline keeps its first-paint height through hydration", async ({
  minimalPage,
}) => {
  await minimalPage.expectStableLessonOutline();
});
