import { describe, expect, it } from "vitest";
import {
  findSubtopic,
  findSubtopicBySection,
  groupTasksBySubtopic,
  lessonSubtopics,
  subtopicErrors,
  topicLessons,
  type LessonContent,
} from "~/entities/lesson";

const lesson: LessonContent.Definition = {
  id: "sample-lesson",
  routeSlug: "1-sample-lesson",
  taskNumbers: [1],
  title: "Пробный урок",
  summary: "Урок для проверки подтем.",
  learningOutcomes: ["Проверить подтемы"],
  theory: ["a", "b", "c"].map((id) => ({
    id,
    navLabel: id,
    explanation: id,
  })),
  subtopics: [
    { slug: "first", title: "Первая", conceptIds: ["a", "b"] },
    { slug: "second", title: "Вторая", conceptIds: ["c"] },
  ],
  result: "Итог",
  status: "published",
  accessTier: "free",
};

describe("lesson subtopics", () => {
  it("resolves subtopics with their concepts and positions", () => {
    const [first, second] = lessonSubtopics(lesson);
    expect(first.concepts.map(({ id }) => id)).toEqual(["a", "b"]);
    expect(second.index).toBe(1);
    expect(findSubtopic(lesson, "second")?.title).toBe("Вторая");
    expect(findSubtopicBySection(lesson, "b")?.slug).toBe("first");
    expect(findSubtopicBySection(lesson, "missing")).toBeUndefined();
  });

  it("places each task in the earliest linked subtopic", () => {
    const groups = groupTasksBySubtopic(lesson, [
      { id: "t1", theoryLinks: [{ hash: "c" }, { hash: "a" }] },
      { id: "t2", theoryLinks: [{ hash: "c" }] },
      { id: "t3", theoryLinks: [] },
    ]);
    expect(groups.get("first")?.map(({ id }) => id)).toEqual(["t1"]);
    expect(groups.get("second")?.map(({ id }) => id)).toEqual(["t2"]);
  });

  it("accepts a split that keeps every block once and in order", () => {
    expect(subtopicErrors(lesson)).toEqual([]);
  });

  it.each([
    [
      "reorders blocks",
      [
        ["x", ["b", "a"]],
        ["y", ["c"]],
      ],
    ],
    [
      "skips a block",
      [
        ["x", ["a"]],
        ["y", ["c"]],
      ],
    ],
    [
      "repeats a block",
      [
        ["x", ["a", "b"]],
        ["y", ["b", "c"]],
      ],
    ],
    [
      "duplicates a slug",
      [
        ["x", ["a"]],
        ["x", ["b", "c"]],
      ],
    ],
    ["uses the reserved slug", [["praktika", ["a", "b", "c"]]]],
    ["uses a non-ASCII slug", [["Подтема", ["a", "b", "c"]]]],
  ] as const)("rejects a split that %s", (_, split) => {
    const subtopics = split.map(([slug, conceptIds]) => ({
      slug,
      title: slug,
      conceptIds: conceptIds as unknown as readonly [string, ...string[]],
    }));
    expect(subtopicErrors({ ...lesson, subtopics })).not.toEqual([]);
  });

  it("requires subtopics on a published topic", () => {
    expect(subtopicErrors({ ...lesson, subtopics: undefined })).toHaveLength(1);
    expect(
      subtopicErrors({ ...lesson, subtopics: undefined, status: "draft" }),
    ).toEqual([]);
  });

  it("keeps every authored topic split valid", () => {
    expect(topicLessons.flatMap(subtopicErrors)).toEqual([]);
  });

  it("gives every authored subtopic a lead under its title", () => {
    // Change 170 F42: a subtopic title is never followed straight by a heading.
    const missing = topicLessons.flatMap((item) =>
      (item.subtopics ?? [])
        .filter((subtopic) => !subtopic.lead?.trim())
        .map((subtopic) => `${item.id}/${subtopic.slug}`),
    );
    expect(missing).toEqual([]);
  });
});
