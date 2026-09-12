import { test } from "./fixtures";

for (const failed of [false, true]) {
  test(`missing artwork stays transparent: failed=${String(failed)}`, async ({
    layoutStabilityPage,
  }) => {
    await layoutStabilityPage.expectTransparentMissingArtwork(failed);
  });

  test(`missing artwork stays transparent without JS: failed=${String(failed)}`, async ({
    noJavaScriptLayoutStabilityPage,
  }) => {
    await noJavaScriptLayoutStabilityPage.expectTransparentMissingArtwork(
      failed,
    );
  });
}

for (const width of [390, 1440]) {
  for (const path of ["/", "/ege", "/courses", "/courses/python"]) {
    test(`streamed page preserves geometry: ${path} at ${String(width)}`, async ({
      layoutStabilityPage,
    }) => {
      await layoutStabilityPage.expectStableStreamedPage(path, width);
    });

    test(`late fonts preserve geometry: ${path} at ${String(width)}`, async ({
      layoutStabilityPage,
    }) => {
      await layoutStabilityPage.expectStableFonts(path, width);
    });
  }

  test(`stored course progress preserves SSR geometry at ${String(width)}`, async ({
    layoutStabilityPage,
  }) => {
    await layoutStabilityPage.expectStableProgress(width, true);
  });

  test(`course progress preserves SSR geometry at ${String(width)}`, async ({
    layoutStabilityPage,
  }) => {
    await layoutStabilityPage.expectStableProgress(width);
  });
}

for (const path of ["/ege", "/courses", "/courses/python"]) {
  test(`artwork effects wait for images: ${path}`, async ({
    layoutStabilityPage,
  }) => {
    await layoutStabilityPage.expectStableArtwork(path);
  });
}

for (const path of ["/", "/ege", "/courses", "/courses/python"]) {
  test(`readable without JavaScript: ${path}`, async ({
    noJavaScriptLayoutStabilityPage,
  }) => {
    await noJavaScriptLayoutStabilityPage.expectReadableWithoutJavaScript(path);
  });
}
