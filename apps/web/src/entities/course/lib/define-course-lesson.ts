import type { CourseTypes } from "../course.types";

export function defineCourseLesson(
  definition: CourseTypes.LessonDefinition,
): CourseTypes.LessonDefinition {
  return {
    ...definition,
    masteryThreshold: definition.masteryThreshold ?? 0.8,
  };
}
