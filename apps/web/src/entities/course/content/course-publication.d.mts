import type { LessonContent } from "~/entities/lesson";
import type { CourseTypes } from "../course.types";

export type CoursePublication = Omit<CourseTypes.Definition, "modules"> & {
  modules: readonly CourseTypes.Module[];
};

export type CourseLessonPublication = {
  id: string;
  routeSlug: string;
  title: string;
  summary: string;
  status: LessonContent.Status;
  practiceTaskIds: readonly string[];
};

export const pythonFirstProgramLessonPublication: Readonly<CourseLessonPublication>;
export const pythonNumbersLessonPublication: Readonly<CourseLessonPublication>;
export const pythonErrorsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonConditionsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonCompoundConditionsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonForRangeLessonPublication: Readonly<CourseLessonPublication>;
export const pythonWhileLessonPublication: Readonly<CourseLessonPublication>;
export const pythonLoopStateLessonPublication: Readonly<CourseLessonPublication>;
export const pythonNumberDigitsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonStringsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonListsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonSetsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonDictionariesLessonPublication: Readonly<CourseLessonPublication>;
export const pythonSortingSearchLessonPublication: Readonly<CourseLessonPublication>;
export const pythonComprehensionsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonFunctionsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonProgramPartsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonIteratorsGeneratorsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonRecursionLessonPublication: Readonly<CourseLessonPublication>;
export const pythonExceptionsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonFilesLessonPublication: Readonly<CourseLessonPublication>;
export const pythonTablesLessonPublication: Readonly<CourseLessonPublication>;
export const pythonBruteforceLessonPublication: Readonly<CourseLessonPublication>;
export const pythonSelectResultLessonPublication: Readonly<CourseLessonPublication>;
export const pythonTodoStartLessonPublication: Readonly<CourseLessonPublication>;
export const pythonTodoActionsLessonPublication: Readonly<CourseLessonPublication>;
export const pythonTodoStorageLessonPublication: Readonly<CourseLessonPublication>;
export const pythonIndependentProgramLessonPublication: Readonly<CourseLessonPublication>;
export const pythonCoursePublication: Readonly<CoursePublication>;
export const coursePublications: readonly CoursePublication[];
export const courseLessonPublications: readonly CourseLessonPublication[];
export function findCoursePublicationByRouteSlug(
  routeSlug: string,
): CoursePublication | undefined;
export function findCourseLessonPublicationByRouteSlugs(
  courseRouteSlug: string,
  lessonRouteSlug: string,
): CourseLessonPublication | undefined;
