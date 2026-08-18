import type { LessonContent } from "../lib/define-lesson.types";
import { rekursiyaLesson } from "./rekursiya.lesson";

const lessons: readonly LessonContent.Definition[] = [rekursiyaLesson];

export function findLessonByRouteSlug(
  routeSlug: string,
): LessonContent.Definition | undefined {
  return lessons.find((lesson) => lesson.routeSlug === routeSlug);
}
