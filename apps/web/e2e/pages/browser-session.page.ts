import { expect, type Page, type TestInfo } from "@playwright/test";

export class BrowserSession {
  readonly #consoleErrors: string[] = [];
  readonly #consoleWarnings: string[] = [];

  constructor(
    private readonly page: Page,
    private readonly testInfo: TestInfo,
  ) {
    page.on("console", (message) => {
      if (message.type() === "error") this.#consoleErrors.push(message.text());
      if (message.type() === "warning")
        this.#consoleWarnings.push(message.text());
    });
  }

  async useDesktopViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1440, height: 1000 });
  }

  async useNarrowViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 390, height: 844 });
  }

  async captureFullPage(filename: string): Promise<void> {
    await this.page.screenshot({
      path: this.testInfo.outputPath(filename),
      fullPage: true,
    });
  }

  expectCleanConsole(): void {
    expect(this.#consoleErrors).toEqual([]);
    expect(this.#consoleWarnings).toEqual([]);
  }
}
