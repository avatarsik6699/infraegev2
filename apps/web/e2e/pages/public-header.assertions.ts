import { expect, type Page } from "@playwright/test";

export const expectPublicReleaseIdentity = async (
  page: Page,
): Promise<void> => {
  const header = page.getByRole("banner");
  await expect(header.getByText("beta", { exact: true })).toBeVisible();
  await expect(header.getByLabel("Версия 1.0.0")).toHaveText("v1.0.0");
};
