import { test } from "./fixtures";

test("guest sign-in remains readable on mobile without analytics", async ({
  accountPage,
}) => {
  await accountPage.expectGuestSignIn();
});

test("auth forms have desktop spacing and mail cooldown survives refresh", async ({
  accountPage,
}) => {
  await accountPage.expectAuthSpacingAndRefreshCooldown();
});

test("email verification consumes its one-time link without analytics", async ({
  accountPage,
}) => {
  await accountPage.expectVerificationLink();
});

test("tokenless verification returns to the registration journey", async ({
  accountPage,
}) => {
  await accountPage.expectTokenlessVerificationReturnsToRegistration();
});

test("email journeys remain recoverable when delivery or links fail", async ({
  accountPage,
}) => {
  await accountPage.expectRecoverableEmailJourneys();
});

test("verification and recovery resend after cooldown and report delivery failures", async ({
  accountPage,
}) => {
  await accountPage.expectResendCooldownAndFailures();
});

test("member profile logout clears personalized session", async ({
  accountPage,
}) => {
  await accountPage.expectProfileLogoutClearsSession();
});

test("email account deletion requires the current password", async ({
  accountPage,
}) => {
  await accountPage.expectPasswordProtectedDeletion();
});

test("provider-only deletion keeps its recent sign-in flow", async ({
  accountPage,
}) => {
  await accountPage.expectProviderDeletionWithoutPassword();
});

test("provider member adds email without creating another account", async ({
  accountPage,
}) => {
  await accountPage.expectProviderEmailMethod();
});

test("unlinking a provider requires confirmation and remains recoverable", async ({
  accountPage,
}) => {
  await accountPage.expectProviderUnlinkConfirmation();
});

test("email member receives a contextual repeat-sign-in link after unlink refusal", async ({
  accountPage,
}) => {
  await accountPage.expectEmailReauthenticationAfterUnlinkRefusal();
});

test("server-owned lesson progress is cleared from the UI on logout", async ({
  accountPage,
}) => {
  await accountPage.expectProgressClearsOnLogout();
});

test("sign-in remains readable without JavaScript @no-js", async ({
  noJavaScriptAccountPage,
}) => {
  await noJavaScriptAccountPage.expectNoJavaScriptSignIn();
});

test("credential forms never fall back to a GET request @no-js", async ({
  accountPage,
  noJavaScriptAccountPage,
}) => {
  await noJavaScriptAccountPage.expectNoJavaScriptCredentialFormsUsePost();
  await accountPage.expectEmailMethodFormUsesPost();
});

test("verification link offers recovery without JavaScript @no-js", async ({
  noJavaScriptAccountPage,
}) => {
  await noJavaScriptAccountPage.expectNoJavaScriptVerification();
});

test("session outage never masquerades as a guest account", async ({
  accountPage,
}) => {
  await accountPage.expectSessionFailureIsNotGuest();
});
