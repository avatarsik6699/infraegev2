import { expect, type APIRequestContext } from "@playwright/test";

export class SitemapPage {
  constructor(private readonly request: APIRequestContext) {}

  async expectPublishedTopic(path: string): Promise<void> {
    const response = await this.request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain(path);
  }
}
