import { courseCatalog } from "../../src/entities/course/content/course-catalog";
import { expect, type Page } from "@playwright/test";

const anchors =
  "h1, main, [data-course-list], [data-course-program] > section, [data-topic-card], footer";

export class LayoutStabilityPage {
  constructor(private readonly page: Page) {}

  private async prepare(width: number) {
    await this.page.setViewportSize({ width, height: 900 });
    await this.page.addInitScript(() => {
      const state = window as typeof window & { layoutShifts: number[] };
      state.layoutShifts = [];
      new PerformanceObserver((list) => {
        for (const raw of list.getEntries()) {
          const entry = raw as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!entry.hadRecentInput) state.layoutShifts.push(entry.value);
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
  }

  private async settlePaint() {
    await this.page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
  }

  private async geometry() {
    return this.page.locator(anchors).evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y + scrollY,
          width: rect.width,
          height: rect.height,
        };
      }),
    );
  }

  private async expectGeometry(
    before: Awaited<ReturnType<LayoutStabilityPage["geometry"]>>,
  ) {
    await this.settlePaint();
    const after = await this.geometry();
    expect(after).toHaveLength(before.length);
    after.forEach((rect, index) => {
      for (const key of ["x", "y", "width", "height"] as const) {
        expect(
          Math.abs(rect[key] - before[index][key]),
          `anchor ${String(index)} ${key}`,
        ).toBeLessThanOrEqual(1);
      }
    });
  }

  async expectStableFonts(path: string, width: number) {
    await this.prepare(width);
    let release = () => {};
    const blocked = new Promise<void>((resolve) => {
      release = resolve;
    });
    await this.page.route("**/*.woff2", async (route) => {
      await blocked;
      await route.continue();
    });
    try {
      await this.page.goto(path, { waitUntil: "commit" });
      await expect(this.page.locator("h1")).toBeVisible();
      // Let optional font's short block period expire while its response is held.
      await expect
        .poll(() => this.page.evaluate(() => performance.now()))
        .toBeGreaterThan(1000);
      const before = await this.geometry();
      release();
      await this.page.evaluate(() => document.fonts.ready);
      await this.expectGeometry(before);
      const shifts = await this.page.evaluate(
        () =>
          (window as typeof window & { layoutShifts: number[] }).layoutShifts,
      );
      expect(shifts.reduce((sum, value) => sum + value, 0)).toBeLessThan(
        0.00001,
      );
    } finally {
      release();
    }
  }

  async expectStableStreamedPage(path: string, width: number) {
    await this.prepare(width);
    await this.page.emulateMedia({ reducedMotion: "no-preference" });
    const network = await this.page.context().newCDPSession(this.page);
    try {
      await network.send("Network.enable");
      await network.send("Network.setCacheDisabled", { cacheDisabled: true });
      await network.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: 100000,
        uploadThroughput: 50000,
      });
      await network.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await this.page.goto(path, { waitUntil: "load" });
      await expect(this.page.locator("footer")).toBeVisible();
      await this.page.evaluate(() => document.fonts.ready);
      await this.settlePaint();
      const shifts = await this.page.evaluate(
        () =>
          (window as typeof window & { layoutShifts: number[] }).layoutShifts,
      );
      expect(shifts.reduce((sum, value) => sum + value, 0)).toBeLessThan(
        0.00001,
      );
    } finally {
      await network.detach();
    }
  }

  async expectStableProgress(width: number, completed = false) {
    if (completed) {
      const entry = courseCatalog.entries.find(
        (entry) => entry.status === "published",
      );
      if (!entry || entry.status !== "published")
        throw new Error("Published course missing");
      const lessons = Object.fromEntries(
        entry.progressLessons.map((lesson) => [
          lesson.id,
          { solvedTaskIds: lesson.practiceTaskIds },
        ]),
      );
      await this.page.addInitScript((lessons) => {
        localStorage.setItem(
          "infraege:lesson-progress",
          JSON.stringify({ version: 1, data: { lessons } }),
        );
      }, lessons);
    }
    await this.prepare(width);
    let release = () => {};
    const blocked = new Promise<void>((resolve) => {
      release = resolve;
    });
    await this.page.route("**/*.js", async (route) => {
      await blocked;
      await route.continue();
    });
    try {
      await this.page.goto("/courses/python", { waitUntil: "commit" });
      await expect(
        this.page.getByText("Прогресс на этом устройстве", { exact: true }),
      ).toBeVisible();
      await this.page.evaluate(() => document.fonts.ready);
      await this.settlePaint();
      const before = await this.geometry();
      release();
      await expect(
        this.page.getByText(
          completed
            ? "Освоены все доступные уроки: 28 из 28. Курс продолжает развиваться."
            : "Освоено 0 из 28 доступных уроков.",
          { exact: true },
        ),
      ).toBeVisible();
      await this.expectGeometry(before);
    } finally {
      release();
    }
  }

  async expectStableArtwork(path: string) {
    await this.prepare(1440);
    await this.page.emulateMedia({ reducedMotion: "no-preference" });
    let release = () => {};
    const blocked = new Promise<void>((resolve) => {
      release = resolve;
    });
    await this.page.route("**/*.webp", async (route) => {
      await blocked;
      await route.continue();
    });
    try {
      await this.page.goto(path, { waitUntil: "commit" });
      await expect(
        this.page.getByRole("button", { name: "Не сейчас", exact: true }),
      ).toBeVisible();
      await this.page.evaluate(() => document.fonts.ready);
      const before = await this.geometry();
      const sceneSelector = {
        "/courses": '[data-course-card="python"]',
        "/ege": '[data-has-illustration="true"]',
        "/courses/python": "[data-course-artwork]",
      }[path];
      if (!sceneSelector) throw new Error("Unknown artwork route");
      const scene = this.page.locator(sceneSelector).first();
      await expect(scene.locator('[data-status="loading"]')).toBeAttached();
      await expect(scene.locator('[data-glint-active="true"]')).toHaveCount(0);
      release();
      await expect(scene.locator('[data-status="loaded"]')).toBeAttached();
      await expect(
        scene.locator('[data-glint-active="true"]').first(),
      ).toBeAttached();
      await this.expectGeometry(before);
      const image = scene.locator("img");
      await expect(image).toHaveCSS("opacity", "1");
    } finally {
      release();
    }
  }

  async expectReadableWithoutJavaScript(path: string) {
    await this.page.goto(path);
    await expect(this.page.locator("h1")).toBeVisible();
    expect(
      await this.page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (path === "/courses/python") {
      await expect(
        this.page.getByText("Прогресс на этом устройстве", { exact: true }),
      ).toBeVisible();
      await expect(this.page.getByRole("progressbar")).toHaveCount(0);
    }
  }

  async expectTransparentMissingArtwork(failed: boolean) {
    await this.prepare(1440);
    let release = () => {};
    const blocked = new Promise<void>((resolve) => {
      release = resolve;
    });
    await this.page.route("**/*.webp", async (route) => {
      if (!failed) await blocked;
      await route.abort();
    });
    try {
      await this.page.goto("/courses", { waitUntil: "domcontentloaded" });
      await this.page.evaluate(() => document.fonts.ready);
      const scene = this.page.locator("[data-course-staircase]");
      await expect(scene).toBeVisible();
      const shot = { animations: "disabled" as const };
      const filtered = await scene.screenshot(shot);
      // With no source pixels, filters must paint exactly like no filter.
      // This catches paint artifacts even when every layout rectangle is stable.
      const plain = await scene.screenshot({
        ...shot,
        style: "[data-course-staircase] > div { filter: none !important; }",
      });
      expect(
        filtered.equals(plain),
        "empty artwork must remain transparent",
      ).toBe(true);
    } finally {
      release();
    }
  }
}
