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
    await this.page.setViewportSize({ width: 1440, height: 1024 });
  }

  async useWideViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async useNarrowViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 390, height: 844 });
  }

  async useIntermediateViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1024, height: 768 });
  }

  async useZoomedDesktopViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 960, height: 683 });
  }

  async useReducedMotion(): Promise<void> {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
  }

  async captureViewport(filename: string): Promise<void> {
    await this.page.screenshot({
      path: this.testInfo.outputPath(filename),
      fullPage: false,
    });
  }

  expectCleanConsole(): void {
    expect(this.#consoleErrors).toEqual([]);
    expect(this.#consoleWarnings).toEqual([]);
  }
}
