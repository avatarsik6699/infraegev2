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
      this.page.locator("[data-topic-media] [data-badge]"),
    ).toHaveCount(23);
    await expect(this.page.locator("[data-topic-media]")).toHaveCount(25);
    await expect(this.page.locator("[data-topic-footer]")).toHaveCount(25);
    await expect(this.page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://infraege.ru/ege",
    );
    await expect(this.page.locator("[data-topic-placeholder]")).toHaveCount(23);
    const dimensions = await this.page
      .locator("[data-topic-card]")
      .evaluateAll((cards) =>
        cards.map((card) => {
          const bounds = card.getBoundingClientRect();
          const media = card
            .querySelector("[data-topic-media]")
            ?.getBoundingClientRect();
          const footer = card
            .querySelector("[data-topic-footer]")
            ?.getBoundingClientRect();
          return {
            width: bounds.width,
            height: bounds.height,
            mediaHeight: media?.height ?? 0,
            titleTop:
              card.querySelector("h3")!.getBoundingClientRect().top -
              bounds.top,
            summaryTop:
              card.querySelector("p")!.getBoundingClientRect().top - bounds.top,
            titleComplete:
              card.querySelector("h3")!.scrollHeight <=
              card.querySelector("h3")!.clientHeight + 1,

            contentTop: footer ? footer.top - bounds.top : 0,
          };
        }),
      );
    for (const key of [
      "width",
      "height",
      "mediaHeight",
      "contentTop",
      "titleTop",
      "summaryTop",
    ] as const) {
      const values = dimensions.map((entry) => entry[key]);
      expect(Math.max(...values) - Math.min(...values), key).toBeLessThan(1);
    }
    expect(dimensions.every((entry) => entry.titleComplete)).toBe(true);
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
        .toBeGreaterThanOrEqual(40);
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
          const cardStyles = getComputedStyle(card);
          const mediaBounds = frame
            .querySelector("[data-topic-media]")
            ?.getBoundingClientRect();
          const material = frame.querySelector("[data-surface-material]");
          const image = illustration.querySelector("img");
          const summary = frame.querySelector("p");
          const imageBounds = image?.getBoundingClientRect();
          const summaryBounds = summary?.getBoundingClientRect();
          const radii = [
            frameStyles.borderTopLeftRadius,
            frameStyles.borderTopRightRadius,
            frameStyles.borderBottomRightRadius,
            frameStyles.borderBottomLeftRadius,
          ];

          return {
            singleCell:
              cardStyles.gridRowEnd === "auto" &&
              cardStyles.gridColumnEnd === "auto",
            mediaShare: mediaBounds
              ? mediaBounds.height / frameBounds.height
              : 0,
            materialLayers: material?.children.length,
            escape: Math.max(
              frameBounds.top - illustrationBounds.top,
              illustrationBounds.right - frameBounds.right,
              0,
            ),
            frameClips:
              material !== null &&
              getComputedStyle(material).overflow === "hidden",
            imageContained:
              !imageBounds ||
              (imageBounds.left >= illustrationBounds.left - 1 &&
                imageBounds.right <= illustrationBounds.right + 1 &&
                imageBounds.bottom <= illustrationBounds.bottom + 1),
            descriptionConstrained:
              summary !== null &&
              getComputedStyle(summary).webkitLineClamp === "2" &&
              summary.clientHeight <=
                2 * Number.parseFloat(getComputedStyle(summary).lineHeight) + 1,
            mediaSeparated:
              !summaryBounds ||
              illustrationBounds.bottom <= summaryBounds.top + 1 ||
              illustrationBounds.left >= summaryBounds.right - 1,
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
          entry.singleCell &&
          entry.mediaShare >= 0.57 &&
          entry.mediaShare <= 0.59 &&
          entry.materialLayers === 2 &&
          entry.escape <= 13 &&
          entry.imageContained &&
          entry.descriptionConstrained &&
          entry.mediaSeparated &&
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
