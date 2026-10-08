import { test } from "./fixtures";

test("standalone practice task uses the detail reading and solving layout", async ({
  minimalPage,
}) => {
  await minimalPage.expectPracticeTaskDetail();
});
