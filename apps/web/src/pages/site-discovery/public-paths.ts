import {
  courseLessonPublications,
  coursePublications,
} from "~/entities/course";
import {
  findLessonByRouteSlug,
  lessonPracticeSlug,
  lessonPublications,
  lessonSubtopics,
} from "~/entities/lesson";

const publicPaths = [
  "/",
  "/ege",
  "/courses",
  "/privacy",
  "/practice",
  ...lessonPublications
    .filter((lesson) => lesson.status === "published")
    .flatMap((publication) => {
      const lesson = findLessonByRouteSlug(publication.routeSlug);
      const base = `/ege/${publication.routeSlug}`;
      return lesson
        ? [
            ...lessonSubtopics(lesson).map(
              (subtopic) => `${base}/${subtopic.slug}`,
            ),
            `${base}/${lessonPracticeSlug}`,
          ]
        : [];
    }),
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
