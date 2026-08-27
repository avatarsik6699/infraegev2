import { expect, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./layout.assertions";
import { expectPublicReleaseIdentity } from "./public-header.assertions";

export class FoundationPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/");
    await expect(this.page).toHaveURL(/\/$/);
  }

  async expectPublishedMaterial(): Promise<void> {
    await expectPublicReleaseIdentity(this.page);
    await expect(
      this.page.getByRole("heading", {
        name: "Подготовка к ЕГЭ по информатике",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Понятная теория и практика — бесплатно."),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Мини-курсы" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Темы ЕГЭ" }),
    ).toBeVisible();
    await expect(this.page.locator("#courses")).toBeVisible();
    await expect(this.page.locator("#topics")).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: /Python с нуля для ЕГЭ/ }),
    ).toHaveAttribute("href", "/courses/python");
    await expect(
      this.page.getByRole("link", { name: /Рекурсивные алгоритмы/ }),
    ).toHaveAttribute("href", "/ege/16-rekursiya");
    await expect(
      this.page.getByRole("link", { name: /Преобразование записей чисел/ }),
    ).toHaveAttribute("href", "/ege/5-preobrazovanie-zapisey-chisel");
    await expect(
      this.page.getByRole("link", { name: "Обработка данных" }),
    ).toHaveAttribute("href", "/privacy");
    await expect(this.page.getByRole("link", { name: /lab/i })).toHaveCount(0);
    await expect(this.page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://infraege.ru/",
    );
  }

  async expectBrandMetadata(): Promise<void> {
    await expect(this.page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#ffffff",
    );
    await expect(
      this.page.locator('link[rel="icon"][type="image/svg+xml"]'),
    ).toHaveAttribute("href", "/favicon.svg");
    await expect(
      this.page.locator('link[rel="apple-touch-icon"]'),
    ).toHaveAttribute("href", "/apple-touch-icon.png");
    await expect(this.page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      "/site.webmanifest",
    );
    await expect(
      this.page.locator('meta[property="og:image"]'),
    ).toHaveAttribute(
      "content",
      "https://infraege.ru/brand/infraege-social.png",
    );
    await expect(
      this.page.locator('meta[name="twitter:card"]'),
    ).toHaveAttribute("content", "summary_large_image");

    const structuredData = await this.page
      .locator('script[type="application/ld+json"]')
      .textContent();
    expect(structuredData).not.toBeNull();
    expect(JSON.parse(structuredData ?? "{}")).toEqual(
      expect.objectContaining({
        "@type": "WebSite",
        name: "infraege",
        url: "https://infraege.ru/",
      }),
    );
  }

  async expectDesktopComposition(): Promise<void> {
    const lessonLink = this.page
      .getByRole("link", { name: /Рекурсивные алгоритмы/ })
      .first();
    await lessonLink.focus();
    const composition = await this.page
      .locator("[data-foundation-layout]")
      .evaluate((layout) => {
        const topicList =
          layout.querySelector<HTMLElement>("[data-topic-list]");
        const intro = layout.firstElementChild;
        const lesson = topicList?.querySelector<HTMLElement>("li a");
        if (!(intro instanceof HTMLElement) || !topicList || !lesson) {
          throw new Error("Missing home composition");
        }

        return {
          columns: getComputedStyle(layout).gridTemplateColumns,
          topicListLeft: topicList.getBoundingClientRect().left,
          introRight: intro.getBoundingClientRect().right,
          lessonBorderTop: getComputedStyle(lesson).borderTopWidth,
          lessonBackground: getComputedStyle(lesson).backgroundColor,
          lessonOutline: getComputedStyle(lesson).outlineStyle,
        };
      });

    expect(composition.columns.split(" ")).toHaveLength(2);
    expect(composition.topicListLeft).toBeGreaterThan(composition.introRight);
    expect(composition.lessonBorderTop).toBe("0px");
    expect(composition.lessonBackground).toBe("rgba(0, 0, 0, 0)");
    expect(composition.lessonOutline).toBe("solid");
  }

  async expectMobileComposition(): Promise<void> {
    const columns = await this.page
      .locator("[data-foundation-layout]")
      .evaluate((layout) => getComputedStyle(layout).gridTemplateColumns);
    expect(columns.split(" ")).toHaveLength(1);
  }

  async expectNoHorizontalOverflow(): Promise<void> {
    await expectNoHorizontalOverflow(this.page);
  }

  async expectStableReload(): Promise<void> {
    await this.page.reload();
    await this.expectPublishedMaterial();
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
