import type { LessonContent } from "../lib/define-lesson.types";
import { numberSequencesLesson } from "./number-sequences.lesson";
import { stringProcessingLesson } from "./string-processing.lesson";
import { preobrazovanieZapiseyChiselLesson } from "./preobrazovanie-zapisey-chisel.lesson";
import { rekursiyaLesson } from "./rekursiya.lesson";
import { integerProcessingLesson } from "./integer-processing.lesson";
import { arrayProcessingLesson } from "./array-processing.lesson";
import { dataAnalysisLesson } from "./data-analysis.lesson";

const lessons: readonly LessonContent.Definition[] = [
  rekursiyaLesson,
  preobrazovanieZapiseyChiselLesson,
  numberSequencesLesson,
  stringProcessingLesson,
  integerProcessingLesson,
  arrayProcessingLesson,
  dataAnalysisLesson,
];

export function findLessonByRouteSlug(
  routeSlug: string,
): LessonContent.Definition | undefined {
  return lessons.find((lesson) => lesson.routeSlug === routeSlug);
}
