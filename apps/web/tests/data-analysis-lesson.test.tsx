import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { courseLessonPublications } from "~/entities/course";
import {
  dataAnalysisLesson,
  findLessonByRouteSlug,
  lessonPublications,
} from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
import { publicPaths } from "~/pages/site-discovery/public-paths";
import {
  codeFromBlock,
  renderAuthoredLessonContent,
} from "./lesson-content-test-utils";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
  }: {
    children: React.ReactNode;
    to: string;
    params: Record<string, string>;
  }) => (
    <span
      data-link-href={to
        .replace("$courseSlug", params.courseSlug)
        .replace("$lessonSlug", params.lessonSlug)}
    >
      {children}
    </span>
  ),
}));

const sections = [
  "points-and-records",
  "spatial-clusters",
  "energy-clusters",
  "cluster-centre",
  "distance-and-filter",
  "combined-result",
  "independent-check",
];

const authoredContent = [
  ...dataAnalysisLesson.theory.map((section) => section.explanation),
  dataAnalysisLesson.examFocus,
  dataAnalysisLesson.result,
];

describe("task 27 data analysis lesson", () => {
  it("publishes seven ordered concepts, catalog metadata and route", () => {
    expect(dataAnalysisLesson.theory.map((section) => section.id)).toEqual(
      sections,
    );
    expect(dataAnalysisLesson).toMatchObject({
      id: "data-analysis",
      routeSlug: "27-analiz-dannyh-i-klasterizatsiya",
      taskNumbers: [27],
      status: "published",
      masteryThreshold: 0.8,
    });
    expect(dataAnalysisLesson.checkpoint).toHaveLength(4);
    expect(findLessonByRouteSlug("27-analiz-dannyh-i-klasterizatsiya")).toBe(
      dataAnalysisLesson,
    );
    expect(
      lessonPublications.find((lesson) => lesson.id === "data-analysis"),
    ).toMatchObject({ status: "published" });
    expect(
      topicCatalog.entries.find((entry) => entry.id === "data-analysis"),
    ).toMatchObject({
      status: "published",
      routeSlug: "27-analiz-dannyh-i-klasterizatsiya",
      title: "Анализ данных: кластеризация",
      illustration: {
        src: "/images/topics/data-analysis.svg",
        width: 144,
        height: 88,
      },
    });
    expect(publicPaths).toContain("/ege/27-analiz-dannyh-i-klasterizatsiya");
  });

  it("links only to published Python explanations and keeps inline spaces", () => {
    const html = renderAuthoredLessonContent(authoredContent).innerHTML.replace(
      /<pre\b[^>]*>[\s\S]*?<\/pre>/gu,
      "",
    );
    const hrefs = [...html.matchAll(/data-link-href="([^"]+)"/gu)].map(
      (match) => match[1],
    );
    for (const slug of ["fayly", "spiski", "sortirovka-i-poisk", "slovari"]) {
      expect(hrefs).toContain("/courses/python/" + slug);
      expect(
        courseLessonPublications.find((lesson) => lesson.routeSlug === slug),
      ).toMatchObject({ status: "published" });
    }
    expect([
      ...html.matchAll(/<\/(?:code|var|span|a|strong|em)>[А-Яа-яЁё]/gu),
    ]).toEqual([]);
    expect([
      ...html.matchAll(/[А-Яа-яЁё:]<(?:code|var|span|a|strong|em)\b/gu),
    ]).toEqual([]);
  });

  it("runs every complete non-file Python example with its claimed output", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const examples = [
      [
        "Разделить точки по заданной границе",
        "[(0, 0), (2, 0)]\n[(5, 0), (8, 1)]",
      ],
      [
        "Сравнить возможные центры из исходных точек",
        "(0, 0) 7.0\n(2, 0) 5.0\n(5, 0) 8.0",
      ],
      ["Получить энергию из полей частицы", "[1.0, 1.5, 5.0]"],
      [
        "Разделить отсортированные энергии по размаху",
        "[[1.0, 1.5, 2.0], [5.0, 5.5, 6.0], [10.0, 10.5, 11.0], [15.0, 15.5, 16.0]]",
      ],
      ["Выбрать среднюю частицу в каждой группе", "1.5 1.0\n5.5 1.0"],
      ["Сравнить разрешённые пары внутри групп", "17\n41231"],
      ["Проверить два ответа на двенадцати частицах", "41231 155000"],
    ] as const;
    for (const [label, expected] of examples) {
      const result = spawnSync(
        "python3",
        ["-c", codeFromBlock(container, label)],
        {
          encoding: "utf8",
        },
      );
      expect(result.status, label + ": " + result.stderr).toBe(0);
      expect(result.stdout.trim(), label).toBe(expected);
    }
  });

  it("runs the complete file-reading example against the stated input", () => {
    const directory = mkdtempSync(join(tmpdir(), "topic-27-file-"));
    try {
      writeFileSync(
        join(directory, "points.txt"),
        "0,0 0,0\n2,0 0,0\n8,0 1,0\n",
      );
      const container = renderAuthoredLessonContent(authoredContent);
      const result = spawnSync(
        "python3",
        ["-c", codeFromBlock(container, "Прочитать три точки из points.txt")],
        { cwd: directory, encoding: "utf8" },
      );
      expect(result.status, result.stderr).toBe(0);
      expect(result.stdout.trim()).toBe("[(0.0, 0.0), (2.0, 0.0), (8.0, 1.0)]");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
