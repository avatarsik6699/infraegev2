import { expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export class LessonReadingPreviewPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/lab/lesson");
    await expect(this.page.locator("[data-study-lesson]")).toBeVisible();
    const consent = this.page.getByRole("button", {
      name: "Не сейчас",
      exact: true,
    });
    if (await consent.isVisible()) await consent.click();
    await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,nofollow",
    );
  }

  async expectDesktop(): Promise<void> {
    await this.page.setViewportSize({ width: 1440, height: 1000 });
    await expect(
      this.page.getByRole("button", { name: "Содержание урока", exact: true }),
    ).toHaveCount(0);
    await expect(this.page.locator("[data-outline-rail]")).toHaveCSS(
      "border-right-width",
      "1px",
    );
    await expect(this.page.locator("[data-lesson-subheader]")).toHaveCSS(
      "border-bottom-width",
      "1px",
    );
    await this.expectNoOverflow();
  }

  async expectMobileNavigation(): Promise<void> {
    await this.page.setViewportSize({ width: 390, height: 844 });
    const trigger = this.page.getByRole("button", {
      name: "Содержание урока",
      exact: true,
    });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    const title = await this.page
      .getByRole("heading", { level: 1 })
      .boundingBox();
    const contents = await trigger.boundingBox();
    expect(title).not.toBeNull();
    expect(contents).not.toBeNull();
    expect(title!.y + title!.height).toBeLessThan(contents!.y);
    await trigger.focus();
    await trigger.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const links = this.page
      .getByRole("navigation", { name: "Содержание урока" })
      .getByRole("link");
    const bounds = await links.evaluateAll((nodes) =>
      nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return { top: box.top, bottom: box.bottom, height: box.height };
      }),
    );
    for (let index = 0; index < bounds.length; index++) {
      expect(bounds[index].height).toBeGreaterThanOrEqual(32);
      if (index > 0)
        expect(bounds[index].top).toBeGreaterThanOrEqual(
          bounds[index - 1].bottom,
        );
    }
    const destination = this.page.getByRole("link", {
      name: "Почему это быстро",
      exact: true,
    });
    await destination.focus();
    await destination.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(this.page.locator("#speed")).toBeFocused();
    await expect(this.page).toHaveURL(/#speed$/);
    await this.expectNoOverflow();
    // Crossing the structural breakpoint must reopen the desktop list.
    await this.page.setViewportSize({ width: 961, height: 844 });
    await expect(trigger).toHaveCount(0);
    await expect(destination).toBeVisible();
    await this.page.setViewportSize({ width: 960, height: 844 });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await this.expectNoOverflow();
  }

  async expectPracticeAndRecovery(): Promise<void> {
    await this.page.setViewportSize({ width: 390, height: 844 });
    const first = this.page.locator('[data-practice-task="keep-half"]');
    const answer = first.getByRole("textbox", { name: "Ответ", exact: true });
    await this.page.getByRole("button", { name: "Смоделировать сбой" }).click();
    await answer.fill("левая");
    await first.getByRole("button", { name: "Проверить", exact: true }).click();
    await expect(first.getByRole("alert")).toContainText(
      "Не удалось проверить ответ",
    );
    await expect(answer).toHaveValue("левая");
    await this.page
      .getByRole("button", { name: "Восстановить проверку" })
      .click();
    await answer.fill("правая");
    await first.getByRole("button", { name: "Проверить", exact: true }).click();
    await expect(answer).toBeEnabled();
    await expect(first.getByRole("status")).toBeVisible();
    await answer.fill("левая");
    await first.getByRole("button", { name: "Проверить", exact: true }).click();
    await expect(answer).toBeDisabled();
    await expect(answer).toHaveValue("левая");
    await expect(
      this.page.locator("[data-study-progress]").getByRole("progressbar"),
    ).toHaveAttribute("aria-valuenow", "1");
    const tabs = this.page.getByRole("tablist", { name: "Задачи урока" });
    await tabs.getByRole("tab").first().focus();
    await tabs.getByRole("tab").first().press("End");
    const last = tabs.getByRole("tab").last();
    await expect(last).toBeFocused();
    await expect(this.page.locator("[data-task-position]")).toHaveText(
      "Задание 5 из 5",
    );
    const tabBox = await last.boundingBox();
    expect(tabBox!.x).toBeGreaterThanOrEqual(0);
    expect(tabBox!.x + tabBox!.width).toBeLessThanOrEqual(390);
    await this.page.reload();
    await expect(answer).toBeDisabled();
    await expect(answer).toHaveValue("левая");
    await this.expectNoOverflow();
  }

  async expectWithoutJavaScript(): Promise<void> {
    await expect(
      this.page.getByRole("button", { name: "Содержание урока", exact: true }),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("link", { name: "Почему это быстро", exact: true }),
    ).toBeVisible();
    await expect(this.page.locator("[data-practice-task]")).toHaveCount(5);
    await expect(
      this.page.getByText("Когда поиск можно закончить?", { exact: true }),
    ).toBeVisible();
    await expect(this.page.locator("[data-study-progress]")).toContainText(
      "Прогресс хранится только в этом браузере",
    );
    await this.expectNoOverflow();
  }

  async expectTextScalingAndAccessibility(): Promise<void> {
    await this.page.setViewportSize({ width: 1440, height: 1000 });
    await expect(this.page.locator("[data-practice-form]")).toHaveAttribute(
      "data-enhanced",
      "true",
    );
    // Actual text scaling, explicitly distinct from browser zoom or a narrower viewport.
    await this.page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await expect(this.page.locator("html")).toHaveCSS("font-size", "32px");
    await this.expectNoOverflow();
    await this.page.evaluate(() => {
      document.documentElement.style.removeProperty("font-size");
    });
    const results = await new AxeBuilder({ page: this.page }).analyze();
    expect(results.violations).toEqual([]);
  }

  private async expectNoOverflow(): Promise<void> {
    const geometry = await this.page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.width + 1);
  }
}
