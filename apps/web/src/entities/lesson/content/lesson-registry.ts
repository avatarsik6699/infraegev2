import type { LessonContent } from "../lib/define-lesson.types";
import { preobrazovanieZapiseyChiselLesson } from "./preobrazovanie-zapisey-chisel.lesson";
import { rekursiyaLesson } from "./rekursiya.lesson";

const lessons: readonly LessonContent.Definition[] = [
  rekursiyaLesson,
  preobrazovanieZapiseyChiselLesson,
];

export function findLessonByRouteSlug(
  routeSlug: string,
): LessonContent.Definition | undefined {
  return lessons.find((lesson) => lesson.routeSlug === routeSlug);
}
