import { expect, type Page } from "@playwright/test";

export class ErrorTelemetryPage {
  constructor(private readonly page: Page) {}

  async expectSanitizedGlobalErrorDelivery(): Promise<void> {
    const reports: unknown[] = [];
    await this.page.route("**/api/client-errors", async (route) => {
      reports.push(route.request().postDataJSON());
      await route.fulfill({ status: 204 });
    });
    await this.page.goto("/");
    await expect
      .poll(async () => {
        await this.page.evaluate(() => {
          window.dispatchEvent(
            new ErrorEvent("error", {
              error: new Error(
                "secret user answer https://example.test/private?q=1",
              ),
            }),
          );
        });
        return reports.length;
      })
      .toBe(1);
    const serialized = JSON.stringify(reports[0]);
    expect(serialized).not.toContain("secret user answer");
    expect(serialized).not.toContain("example.test");
    expect(reports[0]).toMatchObject({
      kind: "unhandled_error",
      route_id: "/",
    });
    expect(serialized).toMatch(/"fingerprint":"[a-f0-9]{64}"/);
  }
}
