import { test } from "./fixtures";

test("topic search, filters and revision-aware lesson progress", async ({
  topicCatalogPage,
}) => {
  await topicCatalogPage.expectSearchAndProgress();
});

for (const width of [1305, 820, 390, 360]) {
  for (const failAssets of [false, true]) {
    test(`topic geometry is stable at ${String(width)}px with ${failAssets ? "failed" : "delayed"} assets and hydration`, async ({
      topicCatalogPage,
    }) => {
      await topicCatalogPage.expectStableDelivery(width, failAssets);
    });
  }
}

test("topic summary recovers without moving rows", async ({
  topicCatalogPage,
}) => {
  await topicCatalogPage.expectErrorRecovery();
});

test("topic catalog remains readable without JavaScript", async ({
  noJavaScriptTopicCatalogPage,
}) => {
  await noJavaScriptTopicCatalogPage.expectReadableWithoutScripts();
});

test("topic catalog supports enlarged text without overflow", async ({
  topicCatalogPage,
}) => {
  await topicCatalogPage.expectTextZoom();
});

test("planned rows are muted and published rows align progress with stable hover feedback", async ({
  topicCatalogPage,
}) => {
  await topicCatalogPage.expectRefinedRows();
});
