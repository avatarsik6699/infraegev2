import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  parallelComputingLesson,
  findLessonByRouteSlug,
  lessonPublications,
  lessonSubtopics,
} from "~/entities/lesson";
import { lessonMedia } from "~/entities/lesson/content/parallel-computing.media";
import { topicCatalog } from "~/entities/topic-catalog";
import { publicPaths } from "~/pages/site-discovery/public-paths";
import { renderAuthoredLessonContent } from "./lesson-content-test-utils";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const lesson = parallelComputingLesson;
const SOURCE = resolve(
  process.cwd(),
  "../..",
  "content/lesson-design/topic-22",
);
const authoredContent = [
  ...lesson.theory.map(({ explanation }) => explanation),
  lesson.examFocus,
  lesson.result,
];

/** Fences of one kind on the approved stand, without the task blocks. */
function sourceFences(kind: "excel" | "sheet" | "python"): number {
  return readdirSync(SOURCE)
    .filter((name) => /^0[1-9]-.*\.md$/u.test(name))
    .flatMap((name) =>
      readFileSync(resolve(SOURCE, name), "utf8").split(/\n---\n/u),
    )
    .filter(
      (step) =>
        !/^\s*\*\*(Чтобы проверить понимание|Задачи основных подтем)/u.test(
          step,
        ),
    )
    .reduce(
      (total, step) =>
        total + [...step.matchAll(new RegExp(`^\`\`\`${kind}`, "gmu"))].length,
      0,
    );
}

describe("task 22 multiprocessor systems lesson (Change 190)", () => {
  it("has six core subtopics, two advanced and their self-checks", () => {
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
      ["process-i-zavisimost", "core"],
      ["rannee-raspisanie", "core"],
      ["excel-po-id", "core"],
      ["kogo-schitat", "core"],
      ["parallelnost", "core"],
      ["sdvigi-i-zapas", "core"],
      ["zaderzhki-i-obratnye-voprosy", "advanced"],
      ["ogranichennye-resursy", "advanced"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      2, 1, 5, 1, 0, 1, 1, 2,
    ]);
    expect(lesson.examFocus).toBeDefined();
    expect(lesson.result).toBeDefined();
  });

  it("is the lesson of the catalog topic of task 22", () => {
    expect(findLessonByRouteSlug("22-mnogoprocessornye-sistemy")).toBe(lesson);
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
      "/ege/22-mnogoprocessornye-sistemy/process-i-zavisimost",
    );
    expect(publicPaths).toContain("/ege/22-mnogoprocessornye-sistemy/praktika");
  });

  it("shows every sheet and formula of the stand, and no Python", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const media = Object.values(lessonMedia);
    expect(sourceFences("python")).toBe(0);
    expect(media.filter((item) => item.kind === "sheet")).toHaveLength(
      sourceFences("sheet"),
    );
    expect(container.querySelectorAll("[data-sheet-block]")).toHaveLength(
      sourceFences("sheet"),
    );
    expect(container.querySelectorAll("[data-formula-block]")).toHaveLength(
      sourceFences("excel"),
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
    expect(diagrams).toHaveLength(11);
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
