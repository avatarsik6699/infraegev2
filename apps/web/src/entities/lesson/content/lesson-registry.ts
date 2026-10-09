import type { LessonContent } from "../lib/define-lesson.types";
import { numberSequencesLesson } from "./number-sequences.lesson";
import { stringProcessingLesson } from "./string-processing.lesson";
import { graphAnalysisLesson } from "./graph-analysis.lesson";
import { preobrazovanieZapiseyChiselLesson } from "./preobrazovanie-zapisey-chisel.lesson";
import { rekursiyaLesson } from "./rekursiya.lesson";
import { divisorsAndMasksLesson } from "./divisors-and-masks.lesson";
import { arrayProcessingLesson } from "./array-processing.lesson";
import { dataAnalysisLesson } from "./data-analysis.lesson";

export const topicLessons: readonly LessonContent.Definition[] = [
  rekursiyaLesson,
  preobrazovanieZapiseyChiselLesson,
  numberSequencesLesson,
  graphAnalysisLesson,
  stringProcessingLesson,
  divisorsAndMasksLesson,
  arrayProcessingLesson,
  dataAnalysisLesson,
];

export function findLessonByRouteSlug(
  routeSlug: string,
): LessonContent.Definition | undefined {
  return topicLessons.find((lesson) => lesson.routeSlug === routeSlug);
}
