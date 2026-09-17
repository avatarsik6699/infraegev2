import { describe, expect, it } from "vitest";
import {
  courseCatalog,
  courseLessonPublications,
  coursePublications,
} from "~/entities/course";
import { lessonPublications } from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
import { siteConfig } from "~/shared/config/site";
import { pageHead } from "~/shared/lib/seo";

describe("public release metadata", () => {
  it("exposes one release identity for public headers", () => {
    expect(siteConfig).toEqual(
      expect.objectContaining({
        name: "infraege",
        themeColor: "#ffffff",
        socialImagePath: "/brand/infraege-social.png",
        socialImageAlt: "Три камня и название infraege",
      }),
    );
    expect(siteConfig).not.toHaveProperty("releaseLabel");
    expect(siteConfig).not.toHaveProperty("version");
  });

  it("publishes complete lesson discovery metadata from one registry", () => {
    expect(lessonPublications).toEqual([
      expect.objectContaining({
        id: "rekursiya",
        routeSlug: "16-rekursiya",
        taskNumbers: [16],
        title: "Рекурсивные алгоритмы",
        status: "published",
      }),
      expect.objectContaining({
        id: "preobrazovanie-zapisey-chisel",
        routeSlug: "5-preobrazovanie-zapisey-chisel",
        taskNumbers: [5],
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

  it("covers every EGE task number exactly once in the topic catalog", () => {
    expect(topicCatalog.entries).toHaveLength(25);
    expect(topicCatalog.entries.flatMap((entry) => entry.taskNumbers)).toEqual(
      Array.from({ length: 27 }, (_, index) => index + 1),
    );
    expect(
      topicCatalog.entries.find((entry) => entry.id === "winning-strategy"),
    ).toMatchObject({
      taskNumbers: [19, 20, 21],
      title: "Выигрышная стратегия",
      status: "planned",
    });
    expect(
      topicCatalog.entries
        .filter((entry) => entry.status === "published")
        .map((entry) => [entry.id, entry.routeSlug]),
    ).toEqual([
      ["preobrazovanie-zapisey-chisel", "5-preobrazovanie-zapisey-chisel"],
      ["rekursiya", "16-rekursiya"],
    ]);
    expect(topicCatalog.formatTaskNumbers([5])).toBe("Задание 5");
    expect(topicCatalog.formatTaskNumbers([19, 20, 21])).toBe("Задания 19–21");
  });

  it("publishes the Python course and lesson discovery metadata together", () => {
    expect(coursePublications).toEqual([
      expect.objectContaining({
        id: "python",
        routeSlug: "python",
        status: "published",
      }),
    ]);
    expect(courseLessonPublications).toHaveLength(28);
    expect(
      courseLessonPublications.filter((lesson) => lesson.status === "review"),
    ).toHaveLength(0);
    expect(
      courseLessonPublications
        .filter((lesson) => lesson.status === "published")
        .map((lesson) => lesson.routeSlug),
    ).toHaveLength(28);
  });

  it("projects truthful course availability into the catalog", () => {
    expect(courseCatalog.entries.map((entry) => entry.id).sort()).toEqual(
      [
        "python",
        "excel",
        "algorithms-data-structures",
        "advanced-problems",
      ].sort(),
    );
    expect(courseCatalog).toMatchObject({
      availableCount: 1,
      plannedCount: 3,
    });
    expect(courseCatalog.entries[0]).toMatchObject({
      id: "python",
      status: "published",
      routeSlug: "python",
      lessonCount: 28,
    });
    expect(
      courseCatalog.entries.filter((entry) => entry.status === "planned"),
    ).toEqual([
      expect.not.objectContaining({ routeSlug: expect.anything() }),
      expect.not.objectContaining({ routeSlug: expect.anything() }),
      expect.not.objectContaining({ routeSlug: expect.anything() }),
    ]);
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
    expect(head.meta).toContainEqual({
      property: "og:image",
      content: `${siteConfig.origin}${siteConfig.socialImagePath}`,
    });
    expect(head.meta).toContainEqual({
      name: "twitter:card",
      content: "summary_large_image",
    });
  });

  it("describes the site without inventing an organization", () => {
    expect(pageHead.createWebsiteStructuredData()).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "infraege",
      alternateName: "infraege.ru",
      url: "https://infraege.ru/",
      description: siteConfig.description,
      inLanguage: "ru",
    });
  });
});
