import { createServerFn } from "@tanstack/react-start";
import { findCourseLessonByRouteSlugs } from "~/entities/course";
import { getPracticeTasksRouteData } from "~/entities/practice-task";

type RouteInput = {
  courseRouteSlug: string;
  lessonRouteSlug: string;
};

export const getCourseLessonRouteData = createServerFn({ method: "GET" })
  .validator((input: RouteInput) => input)
  .handler(async ({ data }: { data: RouteInput }) => {
    const lesson = findCourseLessonByRouteSlugs(
      data.courseRouteSlug,
      data.lessonRouteSlug,
    );
    if (!lesson) return null;
    return getPracticeTasksRouteData({ data: lesson.practiceTaskIds });
  });
