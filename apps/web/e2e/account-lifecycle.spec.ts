import { test } from "./fixtures";

// Change 227: the brief's lifecycle scenarios on the stand-in providers and the fake payment.

test("an email-first buyer keeps paid access through VK ID and Яндекс ID, then deletes", async ({
  accountIntegrationPage,
  accountLifecyclePage,
  billingIntegrationPage,
  accountMailbox,
  accountIdentity,
}) => {
  const { email, password } = accountIdentity;
  await accountIntegrationPage.register(email, password);
  await accountIntegrationPage.verify(accountMailbox.readVerificationLink());
  await accountIntegrationPage.login(email, password);
  await billingIntegrationPage.expectMemberPaywallAndOpenPlans();
  await billingIntegrationPage.payForMonthOnFakeProvider();
  await accountLifecyclePage.rememberAccess();

  await accountLifecyclePage.link("VK ID", "lifecycle-vk-buyer");
  await accountLifecyclePage.link("Яндекс ID", "lifecycle-ya-buyer");
  await accountLifecyclePage.expectConnected([
    "Почта и пароль",
    "VK ID",
    "Яндекс ID",
  ]);
  await accountLifecyclePage.unlink("Яндекс ID");
  await accountLifecyclePage.expectSameAccess();

  // another way in opens the same account with the same access
  await accountIntegrationPage.logout();
  await accountLifecyclePage.signInWithProvider("VK ID", "lifecycle-vk-buyer");
  await accountLifecyclePage.expectSameAccess();

  await accountLifecyclePage.deleteWithPassword(password);
  await accountLifecyclePage.expectSignedOut();
});

test("a VK-first learner moves to Яндекс ID, meets a taken identity and deletes", async ({
  accountIntegrationPage,
  accountLifecyclePage,
}) => {
  await accountLifecyclePage.signInWithProvider("VK ID", "lifecycle-vk-first");
  await accountLifecyclePage.link("Яндекс ID", "lifecycle-ya-first");
  await accountLifecyclePage.unlink("VK ID");
  await accountLifecyclePage.expectConnected(["Яндекс ID"]);

  // a second account cannot take that Яндекс ID over
  await accountIntegrationPage.logout();
  await accountLifecyclePage.signInWithProvider("VK ID", "lifecycle-vk-other");
  await accountLifecyclePage.link("Яндекс ID", "lifecycle-ya-first");
  await accountLifecyclePage.expectError(/относится к другому аккаунту/u);
  await accountLifecyclePage.deleteProviderAccount();

  await accountLifecyclePage.signInWithProvider(
    "Яндекс ID",
    "lifecycle-ya-first",
  );
  await accountLifecyclePage.expectConnected(["Яндекс ID"]);
  await accountLifecyclePage.deleteProviderAccount();
  await accountLifecyclePage.expectSignedOut();
});

test("a VK-only learner buys a month and gives the receipt address at the provider", async ({
  accountLifecyclePage,
}) => {
  await accountLifecyclePage.signInWithProvider("VK ID", "lifecycle-vk-payer");
  await accountLifecyclePage.payForMonthTypingReceiptEmail(
    "lifecycle-payer@example.com",
  );
  await accountLifecyclePage.rememberAccess();
  await accountLifecyclePage.deleteProviderAccount();
  await accountLifecyclePage.expectSignedOut();
});
