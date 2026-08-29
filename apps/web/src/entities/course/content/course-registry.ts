import type { CourseTypes } from "../course.types";
import { pythonCourse } from "./python-course";
import { pythonConditionsLesson } from "./python-conditions.lesson";
import { pythonErrorsLesson } from "./python-errors.lesson";
import { pythonFirstProgramLesson } from "./python-first-program.lesson";

const courses: readonly CourseTypes.Definition[] = [pythonCourse];
const courseLessons: readonly CourseTypes.LessonDefinition[] = [
  pythonFirstProgramLesson,
  pythonErrorsLesson,
  pythonConditionsLesson,
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
