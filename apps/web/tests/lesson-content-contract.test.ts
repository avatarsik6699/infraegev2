import { describe, expect, it } from "vitest";
import { defineLesson, type LessonContent } from "~/entities/lesson";

const definition: LessonContent.Definition = {
  id: "sample-lesson",
  routeSlug: "1-sample-lesson",
  taskNumber: 1,
  title: "Пробный урок",
  summary: "Минимальное определение для проверки авторского контракта.",
  learningOutcomes: ["Проверить форму урока"],
  practiceTaskIds: ["sample-task"],
  theory: [
    {
      id: "sample-concept",
      navLabel: "Пробное понятие",
      explanation: "Объяснение понятия",
    },
  ],
  result: "Итог урока",
  status: "review",
  accessTier: "free",
};

describe("defineLesson", () => {
  it("adds the default mastery threshold without changing authored blocks", () => {
    const lesson = defineLesson(definition);

    expect(lesson.masteryThreshold).toBe(0.8);
    expect(lesson.theory).toBe(definition.theory);
    expect(lesson).toMatchObject(definition);
  });

  it("preserves an explicitly authored mastery threshold", () => {
    const lesson = defineLesson({
      ...definition,
      masteryThreshold: 0.75,
    });

    expect(lesson.masteryThreshold).toBe(0.75);
  });
});
