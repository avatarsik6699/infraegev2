import { describe, expect, it, vi } from "vitest";
import { lessonPublications, lessonSubtopics } from "~/entities/lesson";
import { spreadsheetOptimizationLesson } from "~/entities/lesson/content/spreadsheet-optimization.lesson";
import { findLessonByRouteSlug } from "./lesson-content-test-utils";
import { topicCatalog } from "~/entities/topic-catalog";
import { publicPaths } from "~/pages/site-discovery/public-paths";
import {
  renderAuthoredLessonContent,
  topicMedia,
  wholeLesson,
} from "./lesson-content-test-utils";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

// Change 192: the paid subtopics live in their own modules.
const lesson = await wholeLesson(spreadsheetOptimizationLesson);
const lessonMedia = topicMedia("spreadsheet-optimization");
const authoredContent = [
  ...lesson.theory.map(({ explanation }) => explanation),
  ...(lesson.finalSections ?? []).map(({ explanation }) => explanation),
  lesson.result,
];

describe("task 18 robot lesson (Change 184)", () => {
  it("has five core subtopics, one advanced and their self-checks", () => {
    expect(lesson).toMatchObject({
      id: "spreadsheet-optimization",
      routeSlug: "18-robot-sborshchik-monet",
      title: "Электронные таблицы: целочисленные данные",
      taskNumbers: [18],
      status: "published",
      masteryThreshold: 0.8,
    });
    const subtopics = lessonSubtopics(lesson);
    expect(subtopics.map(({ slug, level }) => [slug, level])).toEqual([
      ["luchshaya-summa-do-kletki", "core"],
      ["tablica-v-excel", "core"],
      ["steny", "core"],
      ["nedostizhimye-i-finishi", "core"],
      ["napravleniya-i-zapuski", "core"],
      ["ladya-i-chislo-marshrutov", "advanced"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      5, 5, 5, 5, 5, 4,
    ]);
    expect(lesson.finalLead).toBeTruthy();
    expect(lesson.result).toBeDefined();
  });

  it("is the lesson of the catalog topic of task 18", async () => {
    expect(await findLessonByRouteSlug("18-robot-sborshchik-monet")).toBe(
      spreadsheetOptimizationLesson,
    );
    expect(
      lessonPublications.filter(({ taskNumbers }) => taskNumbers.includes(18)),
    ).toEqual([expect.objectContaining({ id: "spreadsheet-optimization" })]);
    expect(
      topicCatalog.entries.find((entry) => entry.taskNumbers.includes(18)),
    ).toMatchObject({
      id: "spreadsheet-optimization",
      routeSlug: "18-robot-sborshchik-monet",
      status: "published",
    });
    expect(publicPaths).toContain(
      "/ege/18-robot-sborshchik-monet/luchshaya-summa-do-kletki",
    );
    expect(publicPaths).toContain("/ege/18-robot-sborshchik-monet/praktika");
  });

  it("shows every sheet of its media, the formulas and no Python", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const sheets = Object.values(lessonMedia).filter(
      (item) => item.kind === "sheet",
    );
    expect(sheets.length).toBeGreaterThan(0);
    expect(container.querySelectorAll("[data-sheet-block]")).toHaveLength(
      sheets.length,
    );
    expect(
      container.querySelectorAll("[data-formula-block]").length,
    ).toBeGreaterThan(0);
    expect(container.querySelectorAll("[data-language='python']")).toHaveLength(
      0,
    );
  });

  it("keeps spaces around inline code, links and emphasis", () => {
    const html = renderAuthoredLessonContent(authoredContent).innerHTML.replace(
      /<pre\b[^>]*>[\s\S]*?<\/pre>/gu,
      "",
    );
    expect([...html.matchAll(/<\/(?:code|var|a|strong)>[А-Яа-яЁё]/gu)]).toEqual(
      [],
    );
    expect([...html.matchAll(/[А-Яа-яЁё]<(?:code|var|a|strong)\b/gu)]).toEqual(
      [],
    );
  });

  it("uses every generated figure once, with the stepper", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const media = Object.values(lessonMedia);
    const diagrams = media.filter((item) => item.kind === "diagram");
    expect(diagrams).toHaveLength(9);
    expect(
      container.querySelectorAll("figure[data-lesson-diagram]"),
    ).toHaveLength(diagrams.length);
    expect(media.filter((item) => item.kind === "stepper")).toHaveLength(2);
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("[data-topic-cheat-sheet]")).toHaveLength(
      1,
    );
    // No stand links to the books: on the site they are task attachments.
    expect(container.innerHTML).not.toContain("topic-18/files");
    expect(container.querySelectorAll("aside, [role='note']")).toHaveLength(0);
  });
});
