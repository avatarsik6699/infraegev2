import { createServerFn } from "@tanstack/react-start";
import { findLessonByRouteSlug } from "~/entities/lesson";
import { loadPracticeTasks } from "~/entities/practice-task";

export const getTopicLessonRouteData = createServerFn({ method: "GET" })
  .validator((routeSlug: string) => routeSlug)
  .handler(async ({ data: routeSlug }: { data: string }) => {
    const lesson = findLessonByRouteSlug(routeSlug);
    if (!lesson) return null;
    return { tasks: await loadPracticeTasks(lesson.practiceTaskIds) };
  });
