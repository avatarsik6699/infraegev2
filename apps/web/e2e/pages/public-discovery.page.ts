import { expect, type Page } from "@playwright/test";

export class PublicDiscoveryPage {
  constructor(private readonly page: Page) {}

  async expectRobotsAndSitemap(): Promise<void> {
    const robotsResponse = await this.page.goto("/robots.txt");
    expect(robotsResponse?.status()).toBe(200);
    expect(robotsResponse?.headers()["content-type"]).toContain("text/plain");
    await expect(this.page.locator("body")).toContainText(
      "Sitemap: https://infraege.ru/sitemap.xml",
    );
    await expect(this.page.locator("body")).toContainText("Disallow: /lab/");

    const sitemapResponse = await this.page.goto("/sitemap.xml");
    expect(sitemapResponse?.status()).toBe(200);
    expect(sitemapResponse?.headers()["content-type"]).toContain(
      "application/xml",
    );
    const sitemap = await this.page.locator("body").textContent();
    expect(sitemap).toContain("https://infraege.ru/");
    expect(sitemap).toContain("https://infraege.ru/privacy");
    expect(sitemap).toContain("https://infraege.ru/ege/16-rekursiya");
    expect(sitemap).toContain(
      "https://infraege.ru/ege/5-preobrazovanie-zapisey-chisel",
    );
    expect(sitemap).not.toContain("/lab/");
    expect(sitemap).not.toContain("/courses/python");
  }
}
