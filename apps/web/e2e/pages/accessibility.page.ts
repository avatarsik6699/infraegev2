import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export class AccessibilityPage {
  constructor(private readonly page: Page) {}

  async expectNoBlockingViolations(path: string): Promise<void> {
    await this.page.goto(path);
    await expect(this.page.getByRole("main")).toBeVisible();

    const results = await new AxeBuilder({ page: this.page }).analyze();
    const blocking = results.violations.filter((item) =>
      ["serious", "critical"].includes(item.impact ?? ""),
    );
    expect(
      blocking,
      blocking.map((item) => `${item.id}: ${item.help}`).join("\n"),
    ).toEqual([]);
  }
}
