import {
  courseLessonPublications,
  coursePublications,
} from "~/entities/course";
import {
  findTopicOutline,
  lessonPracticeSlug,
  lessonPublications,
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
      const outline = findTopicOutline(publication.routeSlug);
      const base = `/ege/${publication.routeSlug}`;
      return outline
        ? [
            ...outline.subtopics.map((subtopic) => `${base}/${subtopic.slug}`),
            `${base}/${lessonPracticeSlug}`,
          ]
        : [];
    }),
  ...coursePublications
    .filter((course) => course.status === "published")
    .flatMap((course) => {
      // Change 194: a course lists only its own lessons; another course's lesson is a 404.
      const memberIds = new Set(
        course.modules.flatMap((courseModule) =>
          courseModule.lessonPlan.map((lesson) => lesson.id),
        ),
      );
      return [
        `/courses/${course.routeSlug}`,
        ...courseLessonPublications
          .filter(
            (lesson) =>
              lesson.status === "published" && memberIds.has(lesson.id),
          )
          .map((lesson) => `/courses/${course.routeSlug}/${lesson.routeSlug}`),
      ];
    }),
];

export { publicPaths };
