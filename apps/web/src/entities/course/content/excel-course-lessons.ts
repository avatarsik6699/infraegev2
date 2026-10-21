import type { CourseTypes } from "../course.types";
import { excelSheetLesson } from "./excel-sheet.lesson";
import { excelInputFilesLesson } from "./excel-input-files.lesson";
import { excelCellValuesLesson } from "./excel-cell-values.lesson";
import { excelFirstFormulasLesson } from "./excel-first-formulas.lesson";
import { excelReferencesLesson } from "./excel-references.lesson";
import { excelRangeFunctionsLesson } from "./excel-range-functions.lesson";
import { excelConditionsLesson } from "./excel-conditions.lesson";
import { excelNumbersLesson } from "./excel-numbers.lesson";
import { excelConditionalCountLesson } from "./excel-conditional-count.lesson";
import { excelTextDatesLesson } from "./excel-text-dates.lesson";
import { excelSortFilterLesson } from "./excel-sort-filter.lesson";
import { excelLookupLesson } from "./excel-lookup.lesson";
import { excelNeighbourCellsLesson } from "./excel-neighbour-cells.lesson";
import { excelFromTaskToTableLesson } from "./excel-from-task-to-table.lesson";
import { excelSummaryLesson } from "./excel-summary.lesson";
import { excelTablesPivotsLesson } from "./excel-tables-pivots.lesson";

export const excelCourseLessons: readonly CourseTypes.LessonDefinition[] = [
  excelSheetLesson,
  excelInputFilesLesson,
  excelCellValuesLesson,
  excelFirstFormulasLesson,
  excelReferencesLesson,
  excelRangeFunctionsLesson,
  excelConditionsLesson,
  excelNumbersLesson,
  excelConditionalCountLesson,
  excelTextDatesLesson,
  excelSortFilterLesson,
  excelLookupLesson,
  excelNeighbourCellsLesson,
  excelFromTaskToTableLesson,
  excelSummaryLesson,
  excelTablesPivotsLesson,
];
