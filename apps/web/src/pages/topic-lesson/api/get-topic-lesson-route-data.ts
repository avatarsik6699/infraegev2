import { createServerFn } from "@tanstack/react-start";
import { findLessonByRouteSlug } from "~/entities/lesson";
import { loadLessonPractice } from "~/entities/practice-task";

export const getTopicLessonRouteData = createServerFn({ method: "GET" })
  .validator((routeSlug: string) => routeSlug)
  .handler(async ({ data: routeSlug }: { data: string }) => {
    const lesson = findLessonByRouteSlug(routeSlug);
    if (!lesson) return null;
    return loadLessonPractice("topic", lesson.id);
  });
