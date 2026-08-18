import { expect, type Page } from "@playwright/test";

export class TopicLessonPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/ege/16-rekursiya");
    await expect(this.page).toHaveURL(/\/ege\/16-rekursiya$/);
  }

  async expectReviewLesson(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        level: 1,
        name: "Рекурсивные алгоритмы",
      }),
    ).toBeVisible();
    await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,nofollow",
    );
    await expect(
      this.page
        .getByRole("navigation", { name: "Содержание урока" })
        .getByRole("link", { name: "Вычисляем F(5) по правилу" }),
    ).toHaveAttribute("href", "#concrete-computation");
    await expect(this.page.locator("[data-practice-task]")).toHaveCount(3);
  }

  async expectNoHorizontalOverflow(): Promise<void> {
    expect(
      await this.page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
    ).toBe(false);
  }

  async expectReadableWithoutJavaScript(): Promise<void> {
    await this.open();
    await this.expectReviewLesson();
    await expect(this.page.locator("[data-practice-form] form")).toHaveCount(3);
    await this.expectNoHorizontalOverflow();
  }

  async expectUnknownLessonNotFound(): Promise<void> {
    const response = await this.page.goto("/ege/unknown-lesson");
    expect(response?.status()).toBe(404);
  }
}
