import { expect, type Page } from "@playwright/test";

export class DesignSystemLabPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/lab/design-system");
    await expect(this.page).toHaveURL(/\/lab\/design-system$/);
  }

  async expectCatalogStructure(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        level: 1,
        name: "Инженерная тетрадь",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("navigation", { name: "Разделы дизайн-системы" }),
    ).toBeVisible();
    await expect(
      this.page.locator(
        "#foundations, #primitives, #feedback-disclosure, #lesson-patterns, #composite-flows",
      ),
    ).toHaveCount(5);
    await expect(
      this.page.getByRole("heading", { level: 2, name: /Composite Flows/ }),
    ).toBeVisible();
  }

  async expectUnlistedMetadata(): Promise<void> {
    await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,nofollow",
    );
  }

  async expectNoHorizontalOverflow(): Promise<void> {
    const overflow = await this.page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  }

  async expectLinearContentWithoutJavaScript(): Promise<void> {
    await this.open();
    await this.expectCatalogStructure();
    await expect(this.page.getByRole("tablist")).toHaveCount(0);
    await expect(this.page.locator("[data-unenhanced-tab-panel]")).toHaveCount(
      4,
    );
    await expect(
      this.page.locator("[data-unenhanced-accordion]"),
    ).not.toHaveCount(0);
    await expect(this.page.locator("[data-practice-task]")).toHaveCount(2);
    await expect(
      this.page
        .locator("[data-practice-form]")
        .getByRole("textbox", { name: "Ответ" }),
    ).toHaveCount(2);

    const inaccessiblePanels = await this.page
      .locator("[data-unenhanced-tab-panel]")
      .evaluateAll(
        (panels) =>
          panels.filter(
            (panel) =>
              panel.hasAttribute("hidden") || panel.hasAttribute("inert"),
          ).length,
      );
    expect(inaccessiblePanels).toBe(0);
  }
}
