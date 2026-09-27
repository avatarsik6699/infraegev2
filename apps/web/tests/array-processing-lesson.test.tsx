import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { courseLessonPublications } from "~/entities/course";
import {
  arrayProcessingLesson,
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
  "sorted-order",
  "file-records",
  "capacity-selection",
  "secondary-optimum",
  "event-stream",
  "independent-check",
];

const authoredContent = [
  ...arrayProcessingLesson.theory.map((section) => section.explanation),
  arrayProcessingLesson.examFocus,
  arrayProcessingLesson.result,
];

describe("task 26 sorting and selection lesson", () => {
  it("publishes six ordered concepts through the existing route and catalog", () => {
    expect(arrayProcessingLesson.theory.map((section) => section.id)).toEqual(
      sections,
    );
    expect(arrayProcessingLesson).toMatchObject({
      id: "array-processing",
      routeSlug: "26-sortirovka-i-otbor",
      taskNumbers: [26],
      status: "published",
      masteryThreshold: 0.8,
    });
    expect(arrayProcessingLesson.checkpoint).toHaveLength(4);
    expect(findLessonByRouteSlug("26-sortirovka-i-otbor")).toBe(
      arrayProcessingLesson,
    );
    expect(
      lessonPublications.find((lesson) => lesson.id === "array-processing"),
    ).toMatchObject({ status: "published" });
    expect(
      topicCatalog.entries.find((entry) => entry.id === "array-processing"),
    ).toMatchObject({
      status: "published",
      routeSlug: "26-sortirovka-i-otbor",
      title: "Обработка данных: сортировка и отбор",
      summary:
        "Как читать файлы, сортировать записи, отбирать данные при ограничении и обрабатывать события по порядку.",
      illustration: {
        src: "/images/topics/array-processing.svg",
        width: 144,
        height: 88,
      },
    });
    expect(publicPaths).toContain("/ege/26-sortirovka-i-otbor");
  });

  it("keeps course links real and spaces around inline elements", () => {
    const html = renderAuthoredLessonContent(authoredContent).innerHTML.replace(
      /<pre\b[^>]*>[\s\S]*?<\/pre>/gu,
      "",
    );
    const hrefs = [...html.matchAll(/data-link-href="([^"]+)"/gu)].map(
      (match) => match[1],
    );
    for (const slug of ["spiski", "sortirovka-i-poisk", "fayly", "slovari"]) {
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

  it("runs complete Python examples and matches their stated output", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const examples = [
      [
        "Сравнить два направления сортировки",
        "[3, 3, 5, 6, 8]\n[8, 6, 5, 3, 3]\n[8, 3, 6, 3, 5]",
      ],
      [
        "Сортировать целые записи по очкам",
        "[[2, 92], [3, 92], [6, 92], [4, 84], [1, 75], [5, 75]]\n6",
      ],
      ["Вместить наибольшее количество файлов", "[2, 3, 4]\n3"],
      ["Сохранить количество и улучшить второй ответ", "3 8"],
      [
        "Проследить заполнение памяти и суммы клиентов",
        "{1: 7, 2: 13, 3: 6}\n[9, 3]",
      ],
    ] as const;
    for (const [label, expected] of examples) {
      const result = spawnSync(
        "python3",
        ["-c", codeFromBlock(container, label)],
        { encoding: "utf8" },
      );
      expect(result.status, label + ": " + result.stderr).toBe(0);
      expect(result.stdout.trim(), label).toBe(expected);
    }
  });

  it("runs the file-reading example against its stated input", () => {
    const directory = mkdtempSync(join(tmpdir(), "topic-26-file-"));
    try {
      writeFileSync(join(directory, "sizes.txt"), "3\n7\n2\n5\n");
      const container = renderAuthoredLessonContent(authoredContent);
      const result = spawnSync(
        "python3",
        [
          "-c",
          codeFromBlock(
            container,
            "Прочитать sizes.txt со строками 3, 7, 2, 5",
          ),
        ],
        { cwd: directory, encoding: "utf8" },
      );
      expect(result.status, result.stderr).toBe(0);
      expect(result.stdout.trim()).toBe("3\n[2, 5, 7]");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
