import { describe, expect, it, vi } from "vitest";
import {
  relationalDatabasesLesson,
  findLessonByRouteSlug,
  lessonPublications,
  lessonSubtopics,
} from "~/entities/lesson";
import { lessonMedia } from "~/entities/lesson/content/relational-databases.media";
import { topicCatalog } from "~/entities/topic-catalog";
import { publicPaths } from "~/pages/site-discovery/public-paths";
import { renderAuthoredLessonContent } from "./lesson-content-test-utils";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const lesson = relationalDatabasesLesson;
const authoredContent = [
  ...lesson.theory.map(({ explanation }) => explanation),
  lesson.examFocus,
  lesson.result,
];

describe("task 3 linked tables lesson (Change 184)", () => {
  it("has six core subtopics, one advanced and their self-checks", () => {
    expect(lesson).toMatchObject({
      id: "relational-databases",
      routeSlug: "3-svyazannye-tablicy",
      title: "Реляционные базы данных",
      taskNumbers: [3],
      status: "published",
      masteryThreshold: 0.8,
    });
    const subtopics = lessonSubtopics(lesson);
    expect(subtopics.map(({ slug, level }) => [slug, level])).toEqual([
      ["tablicy-i-klyuchi", "core"],
      ["svyaz-listov-vpr", "core"],
      ["otbor-zapisey", "core"],
      ["vklad-zapisi", "core"],
      ["izmenenie-zapasa", "core"],
      ["itogi-po-obektam", "core"],
      ["drugie-bazy", "advanced"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      6, 7, 7, 2, 3, 2, 3,
    ]);
    expect(lesson.examFocus).toBeDefined();
    expect(lesson.result).toBeDefined();
  });

  it("is the lesson of the catalog topic of task 3", () => {
    expect(findLessonByRouteSlug("3-svyazannye-tablicy")).toBe(lesson);
    expect(
      lessonPublications.filter(({ taskNumbers }) => taskNumbers.includes(3)),
    ).toEqual([expect.objectContaining({ id: "relational-databases" })]);
    expect(
      topicCatalog.entries.find((entry) => entry.taskNumbers.includes(3)),
    ).toMatchObject({
      id: "relational-databases",
      routeSlug: "3-svyazannye-tablicy",
      status: "published",
    });
    expect(publicPaths).toContain(
      "/ege/3-svyazannye-tablicy/tablicy-i-klyuchi",
    );
    expect(publicPaths).toContain("/ege/3-svyazannye-tablicy/praktika");
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
    // two database schemas, the three illustrative tables of subtopic 1 (T20),
    // the И/ИЛИ requirements of subtopic 3 (T24), the stock change of
    // subtopic 5 and the sales by shop of subtopic 6 (T26)
    expect(diagrams).toHaveLength(8);
    expect(
      container.querySelectorAll("figure[data-lesson-diagram]"),
    ).toHaveLength(diagrams.length);
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("[data-topic-cheat-sheet]")).toHaveLength(
      1,
    );
    // No stand links to the books: on the site they are task attachments.
    expect(container.innerHTML).not.toContain("topic-3/files");
    expect(container.querySelectorAll("aside, [role='note']")).toHaveLength(0);
  });
});
