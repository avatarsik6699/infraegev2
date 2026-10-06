import { expect, type Page } from "@playwright/test";

export class BrowserSession {
  readonly #consoleErrors: string[] = [];
  readonly #consoleWarnings: string[] = [];

  constructor(private readonly page: Page) {
    page.on("console", (message) => {
      if (message.type() === "error") this.#consoleErrors.push(message.text());
      if (message.type() === "warning")
        this.#consoleWarnings.push(message.text());
    });
  }

  async useDesktopViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1440, height: 1024 });
  }

  expectCleanConsole(): void {
    expect(this.#consoleErrors).toEqual([]);
    expect(this.#consoleWarnings).toEqual([]);
  }
}
