import type { CourseTypes } from "../course.types";
import { courseLessonOutlines } from "./course-lesson-outlines.gen";
import { excelCourse } from "./excel-course";
import { pythonCourse } from "./python-course";

const courses: readonly CourseTypes.Definition[] = [pythonCourse, excelCourse];

export function findCourseByRouteSlug(
  routeSlug: string,
): CourseTypes.Definition | undefined {
  return courses.find((course) => course.routeSlug === routeSlug);
}

function memberIds(course: CourseTypes.Definition): Set<string> {
  return new Set(
    course.modules.flatMap((courseModule) =>
      courseModule.lessonPlan.map((lesson) => lesson.id),
    ),
  );
}

/** A course's own lesson by both slugs, without loading its content (Change 222). */
export function findCourseLessonOutline(
  courseRouteSlug: string,
  lessonRouteSlug: string,
): CourseTypes.LessonOutline | undefined {
  const course = findCourseByRouteSlug(courseRouteSlug);
  if (!course) return undefined;
  const members = memberIds(course);
  return courseLessonOutlines.find(
    (lesson) => members.has(lesson.id) && lesson.routeSlug === lessonRouteSlug,
  );
}

/** The course's lessons in plan order, without their content (Change 222). */
export function getCourseLessons(
  course: CourseTypes.Definition,
): readonly CourseTypes.LessonOutline[] {
  const lessonsById = new Map(
    courseLessonOutlines.map((lesson) => [lesson.id, lesson] as const),
  );
  return course.modules.flatMap((courseModule) =>
    courseModule.lessonPlan.flatMap((planItem) => {
      const lesson = lessonsById.get(planItem.id);
      return lesson ? [lesson] : [];
    }),
  );
}
