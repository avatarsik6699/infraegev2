import { createServerFn } from "@tanstack/react-start";
import { findLessonByRouteSlug } from "../content/lesson-registry";
import { loadLessonPracticeTasks } from "./load-lesson-practice-tasks.server";

export const getLessonRouteData = createServerFn({ method: "GET" })
  .validator((routeSlug: string) => routeSlug)
  .handler(async ({ data: routeSlug }: { data: string }) => {
    const lesson = findLessonByRouteSlug(routeSlug);
    if (!lesson) return null;
    return {
      tasks: await loadLessonPracticeTasks(lesson.practiceTaskIds),
    };
  });
