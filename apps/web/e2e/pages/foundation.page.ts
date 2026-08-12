import { expect, type Page } from "@playwright/test";

export class FoundationPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/");
    await expect(this.page).toHaveURL(/\/$/);
  }

  async expectTableOfContentsStand(): Promise<void> {
    await expect(
      this.page.getByRole("navigation", { name: "Оглавление" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Теория" }),
    ).toHaveAttribute("href", "#theory");
    await expect(
      this.page.getByRole("heading", { name: "Результат" }),
    ).toBeVisible();
  }

  async expectAnchorNavigation(): Promise<void> {
    await this.page.getByRole("link", { name: "Что важно для ЕГЭ" }).click();
    await expect(this.page).toHaveURL(/#exam-focus$/);
    await expect(
      this.page.getByRole("heading", { name: "Что важно для ЕГЭ" }),
    ).toBeInViewport();
  }

  async expectNoHorizontalOverflow(): Promise<void> {
    const overflow = await this.page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  }

  async expectReadableWithoutJavaScript(): Promise<void> {
    await this.open();
    await expect(
      this.page.getByRole("link", { name: "Теория" }),
    ).toHaveAttribute("href", "#theory");
    await expect(
      this.page.getByRole("heading", { name: "Результат" }),
    ).toBeVisible();
  }

  async expectRemovedRouteNotFound(): Promise<void> {
    await this.page.goto("/removed-route");
    await expect(
      this.page.getByRole("heading", { name: "Страница не найдена" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "На стартовую страницу" }),
    ).toHaveAttribute("href", "/");
  }
}
