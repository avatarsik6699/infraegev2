import { describe, expect, it, vi } from "vitest";
import {
  parallelComputingLesson,
  findLessonByRouteSlug,
  lessonPublications,
  lessonSubtopics,
} from "~/entities/lesson";
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
const lesson = await wholeLesson(parallelComputingLesson);
const lessonMedia = topicMedia("parallel-computing");
const authoredContent = [
  ...lesson.theory.map(({ explanation }) => explanation),
  lesson.examFocus,
  lesson.result,
];

describe("task 22 multiprocessor systems lesson (Change 190)", () => {
  it("has five core subtopics, one advanced and their self-checks", () => {
    expect(lesson).toMatchObject({
      id: "parallel-computing",
      routeSlug: "22-mnogoprocessornye-sistemy",
      title: "Многопроцессорные системы",
      taskNumbers: [22],
      status: "published",
      masteryThreshold: 0.8,
    });
    const subtopics = lessonSubtopics(lesson);
    expect(subtopics.map(({ slug, level }) => [slug, level])).toEqual([
      ["processy-i-raspisanie", "core"],
      ["raspisanie-v-excel", "core"],
      ["skolko-processov", "core"],
      ["parallelnost", "core"],
      ["sdvigi", "core"],
      ["zaderzhki-i-resursy", "advanced"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      5, 5, 5, 5, 5, 4,
    ]);
    expect(lesson.examFocus).toBeDefined();
    expect(lesson.result).toBeDefined();
  });

  it("is the lesson of the catalog topic of task 22", () => {
    expect(findLessonByRouteSlug("22-mnogoprocessornye-sistemy")).toBe(
      parallelComputingLesson,
    );
    expect(
      lessonPublications.filter(({ taskNumbers }) => taskNumbers.includes(22)),
    ).toEqual([expect.objectContaining({ id: "parallel-computing" })]);
    expect(
      topicCatalog.entries.find((entry) => entry.taskNumbers.includes(22)),
    ).toMatchObject({
      id: "parallel-computing",
      routeSlug: "22-mnogoprocessornye-sistemy",
      status: "published",
    });
    expect(publicPaths).toContain(
      "/ege/22-mnogoprocessornye-sistemy/processy-i-raspisanie",
    );
    expect(publicPaths).toContain("/ege/22-mnogoprocessornye-sistemy/praktika");
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

  it("uses every generated figure once", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const media = Object.values(lessonMedia);
    const diagrams = media.filter((item) => item.kind === "diagram");
    expect(diagrams).toHaveLength(12);
    expect(
      container.querySelectorAll("figure[data-lesson-diagram]"),
    ).toHaveLength(diagrams.length);
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("[data-topic-cheat-sheet]")).toHaveLength(
      1,
    );
    // No stand links to the books: on the site they are task attachments.
    expect(container.innerHTML).not.toContain("topic-22/files");
    expect(container.querySelectorAll("aside, [role='note']")).toHaveLength(0);
  });
});
