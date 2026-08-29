import type { CourseTypes } from "../course.types";
import { pythonCourse } from "./python-course";
import { pythonConditionsLesson } from "./python-conditions.lesson";
import { pythonErrorsLesson } from "./python-errors.lesson";
import { pythonFirstProgramLesson } from "./python-first-program.lesson";
import { pythonNumbersLesson } from "./python-numbers.lesson";
import { pythonCompoundConditionsLesson } from "./python-compound-conditions.lesson";
import { pythonForRangeLesson } from "./python-for-range.lesson";
import { pythonWhileLesson } from "./python-while.lesson";
import { pythonLoopStateLesson } from "./python-loop-state.lesson";
import { pythonNumberDigitsLesson } from "./python-number-digits.lesson";
import { pythonStringsLesson } from "./python-strings.lesson";
import { pythonListsLesson } from "./python-lists.lesson";
import { pythonSetsLesson } from "./python-sets.lesson";
import { pythonDictionariesLesson } from "./python-dictionaries.lesson";
import { pythonSortingSearchLesson } from "./python-sorting-search.lesson";
import { pythonComprehensionsLesson } from "./python-comprehensions.lesson";
import { pythonFunctionsLesson } from "./python-functions.lesson";
import { pythonProgramPartsLesson } from "./python-program-parts.lesson";
import { pythonIteratorsGeneratorsLesson } from "./python-iterators-generators.lesson";
import { pythonRecursionLesson } from "./python-recursion.lesson";
import { pythonExceptionsLesson } from "./python-exceptions.lesson";
import { pythonFilesLesson } from "./python-files.lesson";
import { pythonTablesLesson } from "./python-tables.lesson";
import { pythonBruteforceLesson } from "./python-bruteforce.lesson";
import { pythonSelectResultLesson } from "./python-select-result.lesson";
import { pythonTodoStartLesson } from "./python-todo-start.lesson";
import { pythonTodoActionsLesson } from "./python-todo-actions.lesson";
import { pythonTodoStorageLesson } from "./python-todo-storage.lesson";
import { pythonIndependentProgramLesson } from "./python-independent-program.lesson";

const courses: readonly CourseTypes.Definition[] = [pythonCourse];
const courseLessons: readonly CourseTypes.LessonDefinition[] = [
  pythonFirstProgramLesson,
  pythonNumbersLesson,
  pythonErrorsLesson,
  pythonConditionsLesson,
  pythonCompoundConditionsLesson,
  pythonForRangeLesson,
  pythonWhileLesson,
  pythonLoopStateLesson,
  pythonNumberDigitsLesson,
  pythonStringsLesson,
  pythonListsLesson,
  pythonSetsLesson,
  pythonDictionariesLesson,
  pythonSortingSearchLesson,
  pythonComprehensionsLesson,
  pythonFunctionsLesson,
  pythonProgramPartsLesson,
  pythonIteratorsGeneratorsLesson,
  pythonRecursionLesson,
  pythonExceptionsLesson,
  pythonFilesLesson,
  pythonTablesLesson,
  pythonBruteforceLesson,
  pythonSelectResultLesson,
  pythonTodoStartLesson,
  pythonTodoActionsLesson,
  pythonTodoStorageLesson,
  pythonIndependentProgramLesson,
];

export function findCourseByRouteSlug(
  routeSlug: string,
): CourseTypes.Definition | undefined {
  return courses.find((course) => course.routeSlug === routeSlug);
}

export function findCourseLessonByRouteSlugs(
  courseRouteSlug: string,
  lessonRouteSlug: string,
): CourseTypes.LessonDefinition | undefined {
  const course = findCourseByRouteSlug(courseRouteSlug);
  if (!course) return undefined;
  const memberIds = new Set(
    course.modules.flatMap((courseModule) =>
      courseModule.lessonPlan.map((lesson) => lesson.id),
    ),
  );
  return courseLessons.find(
    (lesson) =>
      memberIds.has(lesson.id) && lesson.routeSlug === lessonRouteSlug,
  );
}

export function getCourseLessons(
  course: CourseTypes.Definition,
): readonly CourseTypes.LessonDefinition[] {
  const lessonsById = new Map(
    courseLessons.map((lesson) => [lesson.id, lesson] as const),
  );
  return course.modules.flatMap((courseModule) =>
    courseModule.lessonPlan.flatMap((planItem) => {
      const lesson = lessonsById.get(planItem.id);
      return lesson ? [lesson] : [];
    }),
  );
}
