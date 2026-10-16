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
        title: "Рекуррентные выражения",
        status: "published",
      }),
      expect.objectContaining({
        id: "relational-databases",
        routeSlug: "3-svyazannye-tablicy",
        taskNumbers: [3],
        title: "Реляционные базы данных",
        status: "published",
      }),
      expect.objectContaining({
        id: "coding-and-fano",
        routeSlug: "4-kodirovanie-i-uslovie-fano",
        taskNumbers: [4],
        title: "Кодирование и декодирование информации",
        status: "published",
      }),
      expect.objectContaining({
        id: "preobrazovanie-zapisey-chisel",
        routeSlug: "5-preobrazovanie-zapisey-chisel",
        taskNumbers: [5],
        title: "Формальное исполнение алгоритма",
        status: "published",
      }),
      expect.objectContaining({
        id: "media-coding",
        routeSlug: "7-izobrazheniya-zvuk-tekst",
        taskNumbers: [7],
        title: "Объём графической и звуковой информации",
        status: "published",
      }),
      expect.objectContaining({
        id: "word-enumeration",
        routeSlug: "8-perebor-slov",
        taskNumbers: [8],
        title: "Измерение количества информации",
        status: "published",
      }),
      expect.objectContaining({
        id: "networks",
        routeSlug: "10-ip-adresa-i-maski",
        taskNumbers: [10],
        title: "Маска подсети",
        status: "published",
      }),
      expect.objectContaining({
        id: "information-amount",
        routeSlug: "11-paroli-i-zapisi",
        taskNumbers: [11],
        title: "Информационный объём сообщения",
        status: "published",
      }),
      expect.objectContaining({
        id: "numeral-systems",
        routeSlug: "14-sistemy-schisleniya",
        taskNumbers: [14],
        title: "Позиционные системы счисления",
        status: "published",
      }),
      expect.objectContaining({
        id: "spreadsheets",
        routeSlug: "9-obrabotka-tablicy-chisel",
        taskNumbers: [9],
        title: "Электронные таблицы",
        status: "published",
      }),
      expect.objectContaining({
        id: "number-sequences",
        routeSlug: "17-chislovye-posledovatelnosti",
        taskNumbers: [17],
        title: "Обработка числовой последовательности",
        status: "published",
      }),
      expect.objectContaining({
        id: "spreadsheet-optimization",
        routeSlug: "18-robot-sborshchik-monet",
        taskNumbers: [18],
        title: "Электронные таблицы: целочисленные данные",
        status: "published",
      }),
      expect.objectContaining({
        id: "winning-strategy",
        routeSlug: "19-21-vyigryshnaya-strategiya",
        taskNumbers: [19, 20, 21],
        title: "Выигрышная стратегия",
        status: "published",
      }),
      expect.objectContaining({
        id: "graph-analysis",
        routeSlug: "23-analiz-grafov",
        taskNumbers: [23],
        title: "Анализ графов",
        status: "published",
      }),
      expect.objectContaining({
        id: "string-processing",
        routeSlug: "24-obrabotka-simvolnyh-strok",
        taskNumbers: [24],
        title: "Обработка символьной информации",
        status: "published",
      }),
      expect.objectContaining({
        id: "divisors-and-masks",
        routeSlug: "25-deliteli-i-maski",
        taskNumbers: [25],
        title: "Обработка целочисленной информации",
        status: "published",
      }),
      expect.objectContaining({
        id: "array-processing",
        routeSlug: "26-sortirovka-i-otbor",
        taskNumbers: [26],
        title: "Обработка данных с сортировкой",
        status: "published",
      }),
      expect.objectContaining({
        id: "data-analysis",
        routeSlug: "27-analiz-dannyh-i-klasterizatsiya",
        taskNumbers: [27],
        title: "Анализ данных",
        status: "published",
      }),
      expect.objectContaining({
        id: "information-models",
        routeSlug: "1-analiz-informacionnyh-modelej",
        taskNumbers: [1],
        title: "Анализ информационных моделей",
        status: "published",
      }),
      expect.objectContaining({
        id: "truth-tables",
        routeSlug: "2-tablicy-istinnosti",
        taskNumbers: [2],
        title: "Таблицы истинности",
        status: "published",
      }),
      expect.objectContaining({
        id: "simple-algorithms",
        routeSlug: "6-prostejshie-algoritmy-dlya-ispolnitelej",
        taskNumbers: [6],
        title: "Простейшие алгоритмы для исполнителей",
        status: "published",
      }),
      expect.objectContaining({
        id: "executors",
        routeSlug: "12-ispolnenie-algoritma-dlya-ispolnitelya",
        taskNumbers: [12],
        title: "Исполнение алгоритма для исполнителя",
        status: "published",
      }),
      expect.objectContaining({
        id: "branching-and-enumeration",
        routeSlug: "13-analiz-hoda-ispolneniya-algoritma",
        taskNumbers: [13],
        title: "Анализ хода исполнения алгоритма",
        status: "published",
      }),
      expect.objectContaining({
        id: "logic-transformations",
        routeSlug: "15-zakony-matematicheskoj-logiki",
        taskNumbers: [15],
        title: "Законы математической логики",
        status: "published",
      }),
      expect.objectContaining({
        id: "parallel-computing",
        routeSlug: "22-mnogoprocessornye-sistemy",
        taskNumbers: [22],
        title: "Многопроцессорные системы",
        status: "published",
      }),
    ]);
    expect(
      lessonPublications
        .filter((lesson) => lesson.status === "published")
        .map((lesson) => lesson.routeSlug),
    ).toEqual([
      "16-rekursiya",
      "3-svyazannye-tablicy",
      "4-kodirovanie-i-uslovie-fano",
      "5-preobrazovanie-zapisey-chisel",
      "7-izobrazheniya-zvuk-tekst",
      "8-perebor-slov",
      "10-ip-adresa-i-maski",
      "11-paroli-i-zapisi",
      "14-sistemy-schisleniya",
      "9-obrabotka-tablicy-chisel",
      "17-chislovye-posledovatelnosti",
      "18-robot-sborshchik-monet",
      "19-21-vyigryshnaya-strategiya",
      "23-analiz-grafov",
      "24-obrabotka-simvolnyh-strok",
      "25-deliteli-i-maski",
      "26-sortirovka-i-otbor",
      "27-analiz-dannyh-i-klasterizatsiya",
      "1-analiz-informacionnyh-modelej",
      "2-tablicy-istinnosti",
      "6-prostejshie-algoritmy-dlya-ispolnitelej",
      "12-ispolnenie-algoritma-dlya-ispolnitelya",
      "13-analiz-hoda-ispolneniya-algoritma",
      "15-zakony-matematicheskoj-logiki",
      "22-mnogoprocessornye-sistemy",
    ]);
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
      status: "published",
    });
    expect(
      topicCatalog.entries
        .filter((entry) => entry.status === "published")
        .map((entry) => [entry.id, entry.routeSlug]),
    ).toEqual([
      ["information-models", "1-analiz-informacionnyh-modelej"],
      ["truth-tables", "2-tablicy-istinnosti"],
      ["relational-databases", "3-svyazannye-tablicy"],
      ["coding-and-fano", "4-kodirovanie-i-uslovie-fano"],
      ["preobrazovanie-zapisey-chisel", "5-preobrazovanie-zapisey-chisel"],
      ["simple-algorithms", "6-prostejshie-algoritmy-dlya-ispolnitelej"],
      ["media-coding", "7-izobrazheniya-zvuk-tekst"],
      ["word-enumeration", "8-perebor-slov"],
      ["spreadsheets", "9-obrabotka-tablicy-chisel"],
      ["networks", "10-ip-adresa-i-maski"],
      ["information-amount", "11-paroli-i-zapisi"],
      ["executors", "12-ispolnenie-algoritma-dlya-ispolnitelya"],
      ["branching-and-enumeration", "13-analiz-hoda-ispolneniya-algoritma"],
      ["numeral-systems", "14-sistemy-schisleniya"],
      ["logic-transformations", "15-zakony-matematicheskoj-logiki"],
      ["rekursiya", "16-rekursiya"],
      ["number-sequences", "17-chislovye-posledovatelnosti"],
      ["spreadsheet-optimization", "18-robot-sborshchik-monet"],
      ["winning-strategy", "19-21-vyigryshnaya-strategiya"],
      ["parallel-computing", "22-mnogoprocessornye-sistemy"],
      ["graph-analysis", "23-analiz-grafov"],
      ["string-processing", "24-obrabotka-simvolnyh-strok"],
      ["divisors-and-masks", "25-deliteli-i-maski"],
      ["array-processing", "26-sortirovka-i-otbor"],
      ["data-analysis", "27-analiz-dannyh-i-klasterizatsiya"],
    ]);
    expect(topicCatalog.formatTaskNumbers([5])).toBe("Задание 5");
    expect(topicCatalog.formatTaskNumbers([19, 20, 21])).toBe("Задания 19–21");
  });

  it("publishes the courses and lesson discovery metadata together", () => {
    expect(coursePublications).toEqual([
      expect.objectContaining({
        id: "python",
        routeSlug: "python",
        status: "published",
      }),
      expect.objectContaining({
        id: "excel",
        routeSlug: "excel",
        status: "published",
      }),
    ]);
    expect(courseLessonPublications).toHaveLength(45);
    expect(
      courseLessonPublications.every((lesson) =>
        ["draft", "published"].includes(lesson.status),
      ),
    ).toBe(true);
    expect(
      courseLessonPublications
        .filter((lesson) => lesson.status === "published")
        .map((lesson) => lesson.routeSlug),
    ).toHaveLength(45);
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
      availableCount: 2,
      plannedCount: 2,
    });
    expect(courseCatalog.entries[0]).toMatchObject({
      id: "python",
      status: "published",
      routeSlug: "python",
      lessonCount: 30,
      moduleCount: 8,
      advancedLessonIds: [
        "python-classes",
        "python-advanced-features",
        "python-testing",
      ],
    });
    expect(courseCatalog.entries.find((e) => e.id === "excel")).toMatchObject({
      status: "published",
      routeSlug: "excel",
      lessonCount: 15,
      advancedLessonIds: ["excel-tables-pivots"],
    });
    expect(
      courseCatalog.entries.filter((entry) => entry.status === "planned"),
    ).toEqual([
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
