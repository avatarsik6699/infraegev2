import { createServerFn } from "@tanstack/react-start";
import { findCourseLessonOutline } from "~/entities/course";
import { loadLessonPractice } from "~/entities/practice-task";

type RouteInput = {
  courseRouteSlug: string;
  lessonRouteSlug: string;
};

export const getCourseLessonRouteData = createServerFn({ method: "GET" })
  .validator((input: RouteInput) => input)
  .handler(async ({ data }: { data: RouteInput }) => {
    const lesson = findCourseLessonOutline(
      data.courseRouteSlug,
      data.lessonRouteSlug,
    );
    if (!lesson) return null;
    return loadLessonPractice("course", lesson.id);
  });
