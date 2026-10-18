import { test } from "./fixtures";

test("a learner meets the paywall, pays for a month on the fake provider and reads the paid subtopic", async ({
  accountIntegrationPage,
  billingIntegrationPage,
  accountMailbox,
  accountIdentity,
}) => {
  const { email, password } = accountIdentity;

  await billingIntegrationPage.expectGuestPaywall();
  await accountIntegrationPage.register(email, password);
  await accountIntegrationPage.verify(accountMailbox.readVerificationLink());
  await accountIntegrationPage.login(email, password);
  await billingIntegrationPage.expectMemberPaywallAndOpenPlans();
  await billingIntegrationPage.payForMonthOnFakeProvider();
  await billingIntegrationPage.expectLessonOpen();
});
