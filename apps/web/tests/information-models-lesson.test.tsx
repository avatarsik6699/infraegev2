import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  findLessonByRouteSlug,
  informationModelsLesson,
  lessonPublications,
  lessonSubtopics,
} from "~/entities/lesson";
import { lessonMedia } from "~/entities/lesson/content/information-models.media";
import { topicCatalog } from "~/entities/topic-catalog";
import { publicPaths } from "~/pages/site-discovery/public-paths";
import { renderAuthoredLessonContent } from "./lesson-content-test-utils";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const lesson = informationModelsLesson;
const ROUTE = "1-analiz-informacionnyh-modelej";
const LESSON_FILE = resolve(
  process.cwd(),
  "src/entities/lesson/content/information-models.lesson.tsx",
);
const subtopics = lessonSubtopics(lesson);
const checkpoints = subtopics.flatMap(
  ({ checkpoint }) => checkpoint?.map(({ prompt }) => prompt) ?? [],
);
const authoredContent = [
  ...lesson.theory.map(({ explanation }) => explanation),
  lesson.examFocus,
  lesson.result,
];

describe("task 1 information models lesson (Change 190)", () => {
  it("has five core subtopics, one advanced and their self-checks", () => {
    expect(lesson).toMatchObject({
      id: "information-models",
      routeSlug: ROUTE,
      title: "Анализ информационных моделей",
      taskNumbers: [1],
      status: "published",
      masteryThreshold: 0.8,
    });
    expect(subtopics.map(({ slug, level }) => [slug, level])).toEqual([
      ["model-i-stepeni", "core"],
      ["sosedi-i-opory", "core"],
      ["kandidaty-i-proverka", "core"],
      ["simmetriya-i-otvet", "core"],
      ["dliny-i-format", "core"],
      ["dopolnitelnye-usloviya-i-marshruty", "advanced"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      5, 5, 5, 4, 4, 5,
    ]);
  });

  it("is the lesson of the catalog topic of task 1", () => {
    expect(findLessonByRouteSlug(ROUTE)).toMatchObject({ id: lesson.id });
    expect(
      lessonPublications.filter(({ taskNumbers }) => taskNumbers.includes(1)),
    ).toEqual([expect.objectContaining({ id: "information-models" })]);
    expect(
      topicCatalog.entries.find((entry) => entry.taskNumbers.includes(1)),
    ).toMatchObject({
      id: "information-models",
      routeSlug: ROUTE,
      status: "published",
      subtopicCount: 6,
    });
    expect(publicPaths).toContain(`/ege/${ROUTE}/model-i-stepeni`);
    expect(publicPaths).toContain(`/ege/${ROUTE}/praktika`);
  });

  it("is a lesson by hand: no code, the tables and schemes carry it", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    expect(container.querySelectorAll("pre")).toHaveLength(0);
    expect(container.querySelectorAll("table").length).toBeGreaterThan(5);
    expect(container.querySelectorAll("[data-topic-cheat-sheet]")).toHaveLength(
      1,
    );
    expect(container.querySelectorAll("img, video")).toHaveLength(0);
    expect(container.querySelectorAll("aside, [role='note']")).toHaveLength(0);
  });

  it("shows the scheme and the table of a self-check question", () => {
    const container = renderAuthoredLessonContent(checkpoints);
    expect(container.querySelectorAll("table").length).toBeGreaterThan(2);
    expect(
      container.querySelectorAll("figure[data-lesson-diagram]").length,
    ).toBeGreaterThan(0);
    expect(container.textContent).not.toContain("%%");
  });

  it("uses every generated figure, with the matching and assumption steppers", () => {
    const source = readFileSync(LESSON_FILE, "utf8");
    for (const key of Object.keys(lessonMedia))
      expect(source, key).toContain(`lessonMedia.${key}}`);
    const media = Object.values(lessonMedia);
    expect(media.filter((item) => item.kind === "stepper")).toHaveLength(2);
  });

  it("keeps spaces around inline code, links and emphasis", () => {
    const html = renderAuthoredLessonContent(authoredContent).innerHTML;
    expect([...html.matchAll(/<\/(?:code|var|a|strong)>[А-Яа-яЁё]/gu)]).toEqual(
      [],
    );
    expect([...html.matchAll(/[А-Яа-яЁё]<(?:code|var|a|strong)\b/gu)]).toEqual(
      [],
    );
  });
});
