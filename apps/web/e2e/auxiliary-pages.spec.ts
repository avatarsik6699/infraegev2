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

test("delayed loader retains the course and recovers after explicit retry", async ({
  auxiliaryPagesPage,
}) => {
  await auxiliaryPagesPage.expectLoaderRecovery();
});

test("error preview respects motion preferences and compact layouts", async ({
  auxiliaryPagesPage,
}) => {
  await auxiliaryPagesPage.expectErrorPreviewMotion();
});

test("delayed successful navigation retains the course until the lesson is ready", async ({
  auxiliaryPagesPage,
}) => {
  await auxiliaryPagesPage.expectLoaderRecovery(false);
});
