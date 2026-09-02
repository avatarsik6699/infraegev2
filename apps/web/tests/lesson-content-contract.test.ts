import { describe, expect, it } from "vitest";
import {
  defineLesson,
  preobrazovanieZapiseyChiselLesson,
  rekursiyaLesson,
  type LessonContent,
} from "~/entities/lesson";

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

  it("preserves the task-5 lesson's authored concept and practice order", () => {
    expect(
      preobrazovanieZapiseyChiselLesson.theory.map(({ id }) => id),
    ).toEqual([
      "four-stage-model",
      "number-and-representation",
      "five-step-execution",
      "string-operations",
      "appending-and-place-value",
      "repeated-parity",
      "minimum-search",
      "branched-base-three",
      "safe-search-bounds",
      "simultaneous-replacement",
      "digit-sum-and-general-template",
      "final-solution-algorithm",
    ]);
    expect(preobrazovanieZapiseyChiselLesson.practiceTaskIds).toEqual([
      "preobrazovanie-zapisey-appending",
      "preobrazovanie-zapisey-parity",
      "preobrazovanie-zapisey-base-three",
      "preobrazovanie-zapisey-digit-replacement",
      "preobrazovanie-zapisey-non-monotonic-maximum",
    ]);
    expect(preobrazovanieZapiseyChiselLesson.masteryThreshold).toBe(0.8);
    expect(preobrazovanieZapiseyChiselLesson.status).toBe("published");
  });

  it("preserves the recursion editorial pilot structure and tasks", () => {
    expect(rekursiyaLesson.theory.map((concept) => concept.id)).toEqual([
      "concrete-computation",
      "base-case-and-step",
      "why-it-works",
      "code-and-call-stack",
      "loop-instead-of-recursion",
      "several-previous-values",
      "repeated-work-motivates-storage",
      "large-arguments-algebraic-shortcut",
      "general-method",
    ]);
    expect(rekursiyaLesson.practiceTaskIds).toEqual([
      "rekursiya-base-sequence",
      "rekursiya-call-stack-trace",
      "rekursiya-two-values",
      "rekursiya-repeated-calls",
      "rekursiya-large-ratio",
    ]);
    expect(rekursiyaLesson).toMatchObject({
      accessTier: "free",
      masteryThreshold: 0.8,
      status: "published",
    });
  });
});
