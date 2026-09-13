import {
  courseLessonPublications,
  coursePublications,
} from "~/entities/course";
import { lessonPublications } from "~/entities/lesson";

const publicPaths = [
  "/",
  "/ege",
  "/courses",
  "/privacy",
  "/practice",
  ...lessonPublications
    .filter((lesson) => lesson.status === "published")
    .map((lesson) => `/ege/${lesson.routeSlug}`),
  ...coursePublications
    .filter((course) => course.status === "published")
    .flatMap((course) => [
      `/courses/${course.routeSlug}`,
      ...courseLessonPublications
        .filter((lesson) => lesson.status === "published")
        .map((lesson) => `/courses/${course.routeSlug}/${lesson.routeSlug}`),
    ]),
];

export { publicPaths };
