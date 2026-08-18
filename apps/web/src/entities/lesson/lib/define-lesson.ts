import type { LessonContent } from "./define-lesson.types";

// One call per lesson file — the TypeScript compiler enforces the lesson's required shape, so no
// runtime parsing or role-order validation is needed.
export function defineLesson(
  definition: LessonContent.Definition,
): LessonContent.Definition {
  return {
    ...definition,
    masteryThreshold: definition.masteryThreshold ?? 0.8,
  };
}
