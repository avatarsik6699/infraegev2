import { expect, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./layout.assertions";

export class TopicCatalogPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/ege");
    await expect(this.page).toHaveURL(/\/ege\/?$/);
  }

  async expectCatalog(): Promise<void> {
    await expect(this.page).toHaveTitle("Темы ЕГЭ по информатике — infraege");
    await expect(
      this.page.getByRole("heading", {
        level: 1,
        name: "Темы ЕГЭ по информатике",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByText("25 тем для всех 27 заданий", { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: /Структура экзамена — ФИПИ/ }),
    ).toHaveAttribute("data-hierarchy", "drawn");
    await expect(
      this.page.getByText(/Не обязательно идти с первого номера/),
    ).toHaveCount(0);
    await expect(
      this.page.locator('a[data-current="true"][href^="/ege"]').first(),
    ).toHaveAttribute("data-current", "true");
    await expect(this.page.locator("[data-topic-card]")).toHaveCount(25);
    await expect(
      this.page.locator('[data-topic-status="published"]'),
    ).toHaveCount(2);
    await expect(
      this.page.locator('[data-topic-status="planned"]'),
    ).toHaveCount(23);
    await expect(
      this.page.getByRole("link", { name: "Открыть тему" }),
    ).toHaveCount(2);
    await expect(
      this.page.getByText("Можно изучать", { exact: true }),
    ).toHaveCount(0);
    await expect(
      this.page.getByText("Задания 19–21", { exact: true }),
    ).toBeVisible();
    await expect(this.page.getByText("Скоро", { exact: true })).toHaveCount(23);
    await expect(
      this.page.locator("[data-topic-card] [data-badge]"),
    ).toHaveCount(23);
    await expect(this.page.locator("[data-topic-media]")).toHaveCount(2);
    await expect(this.page.locator("[data-topic-footer]")).toHaveCount(2);
    await expect(this.page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://infraege.ru/ege",
    );
    await expectNoHorizontalOverflow(this.page);
  }

  async expectCatalogLeads(): Promise<void> {
    const firstTopic = this.page.locator("[data-topic-card]").first();
    await expect(firstTopic).toBeVisible();
    await expect
      .poll(() =>
        firstTopic.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return bounds.top < innerHeight && bounds.bottom > 0;
        }),
      )
      .toBe(true);

    for (const action of await this.page
      .getByRole("link", { name: "Открыть тему" })
      .all()) {
      await expect
        .poll(() =>
          action.evaluate((element) => element.getBoundingClientRect().height),
        )
        .toBeGreaterThanOrEqual(44);
    }
  }

  async expectIllustrationsReady(): Promise<void> {
    const illustrations = this.page.locator('img[src^="/topics/"]');
    await expect(illustrations).toHaveCount(2);
    await expect
      .poll(() =>
        illustrations.evaluateAll((images) =>
          images.every(
            (image) => image instanceof HTMLImageElement && image.complete,
          ),
        ),
      )
      .toBe(true);
  }

  async expectPublishedCardGeometry(): Promise<void> {
    const geometry = await this.page
      .locator('[data-topic-status="published"]')
      .evaluateAll((cards) =>
        cards.map((card) => {
          const frame = card.querySelector<HTMLElement>("[data-topic-frame]");
          const illustration = card.querySelector<HTMLElement>(
            "[data-topic-illustration]",
          );
          const index = card.querySelector<HTMLElement>("[data-topic-index]");

          if (!frame || !illustration || !index) return null;

          const frameBounds = frame.getBoundingClientRect();
          const illustrationBounds = illustration.getBoundingClientRect();
          const indexBounds = index.getBoundingClientRect();
          const frameStyles = window.getComputedStyle(frame);
          const radii = [
            frameStyles.borderTopLeftRadius,
            frameStyles.borderTopRightRadius,
            frameStyles.borderBottomRightRadius,
            frameStyles.borderBottomLeftRadius,
          ];

          return {
            escape: Math.max(
              frameBounds.top - illustrationBounds.top,
              illustrationBounds.right - frameBounds.right,
              0,
            ),
            frameClips: frameStyles.overflow === "hidden",
            indexContained:
              indexBounds.left >= frameBounds.left - 0.5 &&
              indexBounds.right <= frameBounds.right + 0.5 &&
              indexBounds.top >= frameBounds.top - 0.5 &&
              indexBounds.bottom <= frameBounds.bottom + 0.5,
            radius: Number.parseFloat(radii[0] ?? "0"),
            radiiMatch: new Set(radii).size === 1,
          };
        }),
      );

    expect(geometry).toHaveLength(2);
    expect(geometry.every((entry) => entry !== null)).toBe(true);
    expect(
      geometry.every(
        (entry) =>
          entry !== null &&
          entry.escape > 0 &&
          entry.escape <= 10 &&
          entry.frameClips &&
          entry.indexContained &&
          entry.radius > 0 &&
          entry.radiiMatch,
      ),
      JSON.stringify(geometry),
    ).toBe(true);
  }

  async expectPlannedCardsOpaque(): Promise<void> {
    const plannedCards = this.page.locator('[data-topic-status="planned"]');

    await expect(plannedCards).toHaveCount(23);
    await expect
      .poll(() =>
        plannedCards.evaluateAll((cards) =>
          cards.every((card) => window.getComputedStyle(card).opacity === "1"),
        ),
      )
      .toBe(true);
    await expect(plannedCards.locator("a")).toHaveCount(0);
  }

  async dismissAnalyticsConsent(): Promise<void> {
    const dismiss = this.page.getByRole("button", { name: "Не сейчас" });
    await dismiss.click();
    await expect(dismiss).toBeHidden();
  }

  async expectColumnCount(count: number): Promise<void> {
    await expect
      .poll(() =>
        this.page.locator("[data-topic-list]").evaluate((list) => {
          const columns = window
            .getComputedStyle(list)
            .gridTemplateColumns.split(" ")
            .filter(Boolean);
          return columns.length;
        }),
      )
      .toBe(count);
  }

  async showPublishedTopics(): Promise<void> {
    const topic = this.page.locator('[data-topic-status="published"]').first();
    await topic.evaluate((element) =>
      element.scrollIntoView({ block: "center" }),
    );
    await expect(topic).toBeInViewport();
  }

  async showRecursiveTopic(): Promise<void> {
    const topic = this.page.locator('[data-topic-status="published"]').last();
    await topic.evaluate((element) =>
      element.scrollIntoView({ block: "center" }),
    );
    await expect(topic).toBeInViewport();
  }

  async showCatalogStart(): Promise<void> {
    await this.page.keyboard.press("Home");
    await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBe(0);
  }

  async showCatalogEnd(): Promise<void> {
    const footer = this.page.getByRole("contentinfo").last();
    await footer.evaluate((element) =>
      element.scrollIntoView({ block: "end" }),
    );
    await expect(footer).toBeInViewport();
  }

  async expectNumberRecordTopicOpens(): Promise<void> {
    await this.page
      .locator('[data-topic-status="published"]')
      .filter({ hasText: "Задание 5" })
      .getByRole("link", { name: "Открыть тему" })
      .click();
    await expect(this.page).toHaveURL(
      /\/ege\/5-preobrazovanie-zapisey-chisel$/,
    );
  }
}
