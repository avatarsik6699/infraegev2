import type { CourseTypes } from "../course.types";
import { pythonCourse } from "./python-course";
import { pythonFirstProgramLesson } from "./python-first-program.lesson";

const courses: readonly CourseTypes.Definition[] = [pythonCourse];
const courseLessons: readonly CourseTypes.LessonDefinition[] = [
  pythonFirstProgramLesson,
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
    course.modules.flatMap((courseModule) => courseModule.lessonIds),
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
    courseModule.lessonIds.flatMap((lessonId) => {
      const lesson = lessonsById.get(lessonId);
      return lesson ? [lesson] : [];
    }),
  );
}
