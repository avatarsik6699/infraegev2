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
  await expect(header.getByText("beta", { exact: true })).toBeVisible();
  await expect(header.getByLabel("Версия 1.0.0")).toHaveText("v1.0.0");
  await expect(
    header.getByRole("navigation", { name: "Разделы сайта" }),
  ).toHaveCount(0);
  await expect(header).toHaveCSS("border-bottom-width", "0px");
  await expect(page.getByRole("contentinfo")).toHaveCSS(
    "border-top-width",
    "1px",
  );
};
