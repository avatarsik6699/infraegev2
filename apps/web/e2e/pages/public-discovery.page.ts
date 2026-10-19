import { expect, type Page } from "@playwright/test";

export class PublicDiscoveryPage {
  constructor(private readonly page: Page) {}

  async expectRobotsAndSitemap(): Promise<void> {
    const robotsResponse = await this.page.goto("/robots.txt");
    expect(robotsResponse?.status()).toBe(200);
    expect(robotsResponse?.headers()["content-type"]).toContain("text/plain");
    await expect(this.page.locator("body")).toContainText(
      "Sitemap: https://kodumka.ru/sitemap.xml",
    );
    await expect(this.page.locator("body")).toContainText("Disallow: /api/");
    await expect(this.page.locator("body")).toContainText(
      "Clean-param: returnTo&from&plan",
    );
    await expect(this.page.locator("body")).not.toContainText("/lab/");

    const sitemapResponse = await this.page.goto("/sitemap-static.xml");
    expect(sitemapResponse?.status()).toBe(200);
    expect(sitemapResponse?.headers()["content-type"]).toContain(
      "application/xml",
    );
    const sitemap = await this.page.locator("body").textContent();
    expect(sitemap).toContain("https://kodumka.ru/");
    expect(sitemap).toContain("https://kodumka.ru/privacy");
    expect(sitemap).toContain(
      "https://kodumka.ru/ege/16-rekursiya/funktsiya-cherez-sebya",
    );
    expect(sitemap).toContain("https://kodumka.ru/ege</loc>");
    expect(sitemap).toContain(
      "https://kodumka.ru/ege/5-preobrazovanie-zapisey-chisel/chislo-i-zapis",
    );
    expect(sitemap).not.toContain("https://kodumka.ru/ege/16-rekursiya</loc>");
    expect(sitemap).not.toContain(
      "https://kodumka.ru/ege/5-preobrazovanie-zapisey-chisel</loc>",
    );
    expect(sitemap).not.toContain("/lab/");
    expect(sitemap).toContain("https://kodumka.ru/courses</loc>");
    expect(sitemap).toContain("https://kodumka.ru/courses/python");
    expect(sitemap).toContain(
      "https://kodumka.ru/courses/python/pervaya-programma",
    );
  }
}
