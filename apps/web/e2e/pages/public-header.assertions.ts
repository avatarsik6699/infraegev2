import { expect, type Page } from "@playwright/test";

export const expectPublicReleaseIdentity = async (
  page: Page,
): Promise<void> => {
  const header = page.getByRole("banner");
  await expect(header.locator("[data-infraege-mark]")).toBeVisible();
  await expect(header.getByText("infraege", { exact: true })).toBeVisible();
  await expect(
    header.getByText("подготовка к ЕГЭ по информатике", { exact: true }),
  ).toHaveCount(1);
  await expect(header.getByText("beta", { exact: true })).toHaveCount(0);
  await expect(header.getByText("v1.0.0", { exact: true })).toHaveCount(0);
  await expect(header).toHaveCSS("border-bottom-width", "0px");
  await expect(page.getByRole("contentinfo")).toHaveCSS(
    "border-top-width",
    "0px",
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
    const lessonArticle = document.querySelector<HTMLElement>(
      "[data-article-frame]",
    );
    const lessonFrame = document.querySelector<HTMLElement>(
      "[data-lesson-frame]",
    );
    const hasStudyColumns =
      lessonFrame && getComputedStyle(lessonFrame).display === "grid";
    const expectedFooterLeft =
      hasStudyColumns && lessonArticle
        ? lessonArticle.getBoundingClientRect().left
        : 0;
    return {
      viewportWidth: document.documentElement.clientWidth,
      expectedFooterLeft,
      headerLeft: headerRect.left,
      headerRight: headerRect.right,
      footerLeft: footerRect.left,
      footerRight: footerRect.right,
    };
  });
  expect(chromeGeometry.headerLeft).toBeCloseTo(0, 0);
  expect(chromeGeometry.footerLeft).toBeCloseTo(
    chromeGeometry.expectedFooterLeft,
    0,
  );
  expect(chromeGeometry.headerRight).toBeCloseTo(
    chromeGeometry.viewportWidth,
    0,
  );
  expect(chromeGeometry.footerRight).toBeCloseTo(
    chromeGeometry.viewportWidth,
    0,
  );
};
