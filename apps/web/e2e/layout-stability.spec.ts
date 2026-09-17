import { test } from "./fixtures";

test("minimal page remains readable while fonts are pending and unavailable", async ({
  minimalPage,
}) => {
  await minimalPage.expectStableDelivery();
});
