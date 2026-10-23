import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  findLessonByRouteSlug,
  informationModelsLesson,
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

const lesson = await wholeLesson(informationModelsLesson);
const lessonMedia = topicMedia("information-models");
const ROUTE = "1-analiz-informacionnyh-modelej";
const CONTENT = resolve(process.cwd(), "src/entities/lesson/content");
const sources = readdirSync(CONTENT)
  .filter((name) => /^information-models\..*tsx$/u.test(name))
  .map((name) => readFileSync(resolve(CONTENT, name), "utf8"))
  .join("\n");
const subtopics = lessonSubtopics(lesson);
const checkpoints = subtopics.flatMap(
  ({ checkpoint }) => checkpoint?.map(({ prompt }) => prompt) ?? [],
);
const authoredContent = [
  ...lesson.theory.map(({ explanation }) => explanation),
  ...(lesson.finalSections ?? []).map(({ explanation }) => explanation),
  lesson.result,
];

describe("task 1 information models lesson (Change 197)", () => {
  it("has four core subtopics, one advanced and their self-checks", () => {
    expect(lesson).toMatchObject({
      id: "information-models",
      routeSlug: ROUTE,
      title: "Анализ информационных моделей",
      taskNumbers: [1],
      status: "published",
      masteryThreshold: 0.8,
      accessTier: "free",
    });
    expect(subtopics.map(({ slug, level }) => [slug, level])).toEqual([
      ["graf-i-tablica", "core"],
      ["edinstvennye-stepeni", "core"],
      ["odinakovye-stepeni", "core"],
      ["simmetriya-i-otvet", "core"],
      ["dopolnitelnye-usloviya", "advanced"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      5, 5, 5, 5, 4,
    ]);
    // tasks 1–11 are free as a whole (SPEC §2.2)
    expect(
      informationModelsLesson.subtopics?.map(({ access }) => access ?? "free"),
    ).toEqual(["free", "free", "free", "free", "free"]);
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
      subtopicCount: 5,
    });
    expect(publicPaths).toContain(`/ege/${ROUTE}/graf-i-tablica`);
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

  it("states the theme task of the 2027 demo and solves it in subtopic 4", () => {
    const text = renderAuthoredLessonContent(authoredContent).textContent;
    expect(text).toContain("проекта демоверсии ЕГЭ 2027 года");
    expect(text).toContain("Ответ задачи темы: 26");
  });

  it("asks the self-check questions from the lesson itself", () => {
    const container = renderAuthoredLessonContent(checkpoints);
    expect(container.querySelectorAll("table").length).toBeGreaterThan(0);
    expect(container.textContent).not.toContain("%%");
  });

  it("uses every generated figure, with the matching and assumption steppers", () => {
    for (const key of Object.keys(lessonMedia))
      expect(sources, key).toContain(`lessonMedia.${key}}`);
    const media = Object.values(lessonMedia);
    expect(media.filter((item) => item.kind === "stepper")).toHaveLength(4);
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
