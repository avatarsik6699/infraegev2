import { expect, type Page } from "@playwright/test";

export const expectPublicReleaseIdentity = async (
  page: Page,
): Promise<void> => {
  const header = page.getByRole("banner");
  await expect(header.locator("[data-alchimia-mark]")).toBeVisible();
  await expect(header.getByText("ALCHIMIA", { exact: true })).toBeVisible();
  await expect(
    header.getByText("ЕГЭ информатика", { exact: true }),
  ).toBeVisible();
  await expect(header.getByText("beta", { exact: true })).toHaveCount(0);
  await expect(header.getByText("v1.0.0", { exact: true })).toHaveCount(0);
  await expect(
    header.getByRole("navigation", { name: "Разделы сайта" }),
  ).toHaveCount(0);
  await expect(header).toHaveCSS("border-bottom-width", "0px");
  await expect(page.getByRole("contentinfo")).toHaveCSS(
    "border-top-width",
    "1px",
  );
  const chromeGeometry = await page.evaluate(() => {
    const headerInner = document.querySelector<HTMLElement>(
      "[data-public-header] > div",
    );
    const footerInner = document.querySelector<HTMLElement>("footer > div");
    if (!headerInner || !footerInner) {
      throw new Error("Missing public chrome geometry");
    }
    const headerRect = headerInner.getBoundingClientRect();
    const footerRect = footerInner.getBoundingClientRect();
    return {
      viewportWidth: document.documentElement.clientWidth,
      headerLeft: headerRect.left,
      headerRight: headerRect.right,
      footerLeft: footerRect.left,
      footerRight: footerRect.right,
    };
  });
  expect(chromeGeometry.headerLeft).toBeCloseTo(0, 0);
  expect(chromeGeometry.footerLeft).toBeCloseTo(0, 0);
  expect(chromeGeometry.headerRight).toBeCloseTo(
    chromeGeometry.viewportWidth,
    0,
  );
  expect(chromeGeometry.footerRight).toBeCloseTo(
    chromeGeometry.viewportWidth,
    0,
  );
};
