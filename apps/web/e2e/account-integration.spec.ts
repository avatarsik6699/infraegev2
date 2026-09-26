import { test } from "./fixtures";

test("real account browser flow keeps guest checks transient and context progress isolated", async ({
  accountIntegrationPage,
  accountMailbox,
  accountIdentity,
}) => {
  const { email, password } = accountIdentity;

  await accountIntegrationPage.expectGuestCheckStaysTransient();
  await accountIntegrationPage.register(email, password);
  await accountIntegrationPage.verify(accountMailbox.readVerificationLink());
  await accountIntegrationPage.login(email, password);
  await accountIntegrationPage.expectTopicProgressSavedAndCourseContextSeparate();
  await accountIntegrationPage.logout();
});
