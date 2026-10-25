import {
  coursePublications,
  findCourseByRouteSlug,
  getCourseLessons,
} from "~/entities/course";
import { publishedTopicOutlines } from "~/entities/lesson";

/** «1–11, 14 и 16»: task numbers as consecutive ranges, the last joined by «и». */
export function taskRanges(numbers: readonly number[]): string {
  const sorted = [...new Set(numbers)].sort((a, b) => a - b);
  const ranges: string[] = [];
  for (let i = 0; i < sorted.length;) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    ranges.push(
      j > i ? `${String(sorted[i])}–${String(sorted[j])}` : String(sorted[i]),
    );
    i = j + 1;
  }
  return ranges.length > 1
    ? `${ranges.slice(0, -1).join(", ")} и ${ranges.at(-1) ?? ""}`
    : (ranges[0] ?? "");
}

/**
 * What stays free, read from the published content itself (SPEC §2.2 matrix),
 * so /pricing never promises more or less than the lessons deliver.
 */
export function freeScope() {
  const freeTopics = publishedTopicOutlines().filter(
    (topic) => topic.accessTier === "free",
  );
  const courses = coursePublications.flatMap((publication) => {
    const course = findCourseByRouteSlug(publication.routeSlug);
    if (!course) return [];
    const lessons = getCourseLessons(course);
    return [
      {
        title: course.shortTitle,
        lessons: lessons.length,
        freeLessons: lessons.filter((lesson) => !lesson.paid).length,
      },
    ];
  });
  return {
    freeTopicCount: freeTopics.length,
    freeTopicNumbers: taskRanges(
      freeTopics.flatMap((topic) => topic.taskNumbers),
    ),
    /** Courses that are free in full and those free up to a lesson. */
    freeCourses: courses.filter(
      (course) => course.freeLessons === course.lessons,
    ),
    partlyFreeCourses: courses.filter(
      (course) => course.freeLessons < course.lessons,
    ),
  };
}
