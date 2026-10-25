import { createServerFn } from "@tanstack/react-start";
import { findTopicOutline } from "~/entities/lesson";
import { loadLessonPractice } from "~/entities/practice-task";

export const getTopicLessonRouteData = createServerFn({ method: "GET" })
  .validator((routeSlug: string) => routeSlug)
  .handler(async ({ data: routeSlug }: { data: string }) => {
    const outline = findTopicOutline(routeSlug);
    if (!outline) return null;
    return loadLessonPractice("topic", outline.id);
  });
