import { test } from "./fixtures";

test("missing page restores normal metadata on recovery", async ({
  auxiliaryPagesPage,
}) => {
  await auxiliaryPagesPage.expectMissingPageRecovery();
});

test("missing page works on mobile without JavaScript", async ({
  noJavaScriptAuxiliaryPagesPage,
}) => {
  await noJavaScriptAuxiliaryPagesPage.expectMissingPageRecovery();
});

test("delayed loader exposes pending and recovers after explicit retry", async ({
  auxiliaryPagesPage,
}) => {
  await auxiliaryPagesPage.expectLoaderRecovery();
});

test("loading preview respects motion preferences and compact layouts", async ({
  auxiliaryPagesPage,
}) => {
  await auxiliaryPagesPage.expectLoadingPreviewMotion();
});
