import type { LessonContent } from "../lib/define-lesson.types";
import { winningStrategyLesson } from "./winning-strategy.lesson";
import { spreadsheetOptimizationLesson } from "./spreadsheet-optimization.lesson";
import { numberSequencesLesson } from "./number-sequences.lesson";
import { stringProcessingLesson } from "./string-processing.lesson";
import { graphAnalysisLesson } from "./graph-analysis.lesson";
import { numeralSystemsLesson } from "./numeral-systems.lesson";
import { informationAmountLesson } from "./information-amount.lesson";
import { networksLesson } from "./networks.lesson";
import { wordEnumerationLesson } from "./word-enumeration.lesson";
import { mediaCodingLesson } from "./media-coding.lesson";
import { preobrazovanieZapiseyChiselLesson } from "./preobrazovanie-zapisey-chisel.lesson";
import { codingAndFanoLesson } from "./coding-and-fano.lesson";
import { relationalDatabasesLesson } from "./relational-databases.lesson";
import { rekursiyaLesson } from "./rekursiya.lesson";
import { divisorsAndMasksLesson } from "./divisors-and-masks.lesson";
import { arrayProcessingLesson } from "./array-processing.lesson";
import { dataAnalysisLesson } from "./data-analysis.lesson";
import { spreadsheetsLesson } from "./spreadsheets.lesson";

export const topicLessons: readonly LessonContent.Definition[] = [
  rekursiyaLesson,
  relationalDatabasesLesson,
  codingAndFanoLesson,
  preobrazovanieZapiseyChiselLesson,
  mediaCodingLesson,
  wordEnumerationLesson,
  networksLesson,
  informationAmountLesson,
  numeralSystemsLesson,
  spreadsheetsLesson,
  numberSequencesLesson,
  spreadsheetOptimizationLesson,
  winningStrategyLesson,
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
