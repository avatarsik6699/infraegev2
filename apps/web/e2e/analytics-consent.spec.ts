import { test } from "./fixtures";

test("optional analytics is absent before opt-in and stops after withdrawal", async ({
  privacyPage,
}) => {
  await privacyPage.open();
  await privacyPage.expectOptionalAnalyticsRequiresOptIn();
});
