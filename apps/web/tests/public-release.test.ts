import { describe, expect, it } from "vitest";
import { lessonPublications } from "~/entities/lesson";
import { siteConfig } from "~/shared/config/site";
import { pageHead } from "~/shared/lib/seo";

describe("public release metadata", () => {
  it("exposes one release identity for public headers", () => {
    expect(siteConfig).toEqual(
      expect.objectContaining({
        name: "infraege",
        releaseLabel: "beta",
        version: "1.0.0",
      }),
    );
  });

  it("publishes complete lesson discovery metadata from one registry", () => {
    expect(lessonPublications).toEqual([
      expect.objectContaining({
        id: "rekursiya",
        routeSlug: "16-rekursiya",
        taskNumber: 16,
        title: "Рекурсивные алгоритмы",
        status: "published",
      }),
      expect.objectContaining({
        id: "preobrazovanie-zapisey-chisel",
        routeSlug: "5-preobrazovanie-zapisey-chisel",
        taskNumber: 5,
        title: "Преобразование записей чисел",
        status: "published",
      }),
    ]);
    expect(
      lessonPublications
        .filter((lesson) => lesson.status === "published")
        .map((lesson) => lesson.routeSlug),
    ).toEqual(["16-rekursiya", "5-preobrazovanie-zapisey-chisel"]);
    expect(new Set(lessonPublications.map((lesson) => lesson.id)).size).toBe(
      lessonPublications.length,
    );
    expect(
      new Set(lessonPublications.map((lesson) => lesson.routeSlug)).size,
    ).toBe(lessonPublications.length);
    expect(new Set(lessonPublications.map((lesson) => lesson.title)).size).toBe(
      lessonPublications.length,
    );
    expect(
      new Set(lessonPublications.map((lesson) => lesson.summary)).size,
    ).toBe(lessonPublications.length);
  });

  it("creates absolute canonical and social metadata", () => {
    const head = pageHead.create({
      title: "Проверочная страница — infraege",
      description: "Описание проверочной страницы.",
      path: "/check",
    });

    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${siteConfig.origin}/check`,
    });
    expect(head.meta).toContainEqual({
      property: "og:url",
      content: `${siteConfig.origin}/check`,
    });
    expect(head.meta).toContainEqual({
      name: "robots",
      content: "index,follow",
    });
  });
});
