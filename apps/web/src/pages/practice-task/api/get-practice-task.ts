import { createServerFn } from "@tanstack/react-start";
import {
  setResponseHeader,
  setResponseStatus,
} from "@tanstack/react-start/server";
import { loadStandaloneTask } from "~/entities/practice-task";
import { lessonPublications } from "~/entities/lesson";
import {
  courseLessonPublications,
  coursePublications,
} from "~/entities/course";

export const getPracticeTask = createServerFn({ method: "GET" })
  .validator((id: string) => {
    if (typeof id !== "string" || !/^[a-z0-9][a-z0-9_-]{0,119}$/.test(id))
      return "";
    return id;
  })
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "no-store");
    if (!data) {
      setResponseStatus(404);
      return { status: "missing" as const, detail: null, links: [] };
    }
    const result = await loadStandaloneTask(data);
    if (result.status !== "ready") {
      setResponseStatus(result.status === "missing" ? 404 : 503);
      return { ...result, links: [] };
    }
    const links = (result.detail.theoryLinks ?? []).flatMap((link) => {
      const hash = link.section ? `#${link.section}` : "";
      const topic = lessonPublications.find(
        (item) => item.id === link.material_id && item.status === "published",
      );
      if (topic)
        return [
          {
            href: `/ege/${topic.routeSlug}${hash}`,
            label: link.label,
          },
        ];
      const lesson = courseLessonPublications.find(
        (item) => item.id === link.material_id && item.status === "published",
      );
      const course = coursePublications.find(
        (item) =>
          item.status === "published" &&
          item.modules.some((module) =>
            module.lessonPlan.some((entry) => entry.id === link.material_id),
          ),
      );
      return lesson && course
        ? [
            {
              href: `/courses/${course.routeSlug}/${lesson.routeSlug}${hash}`,
              label: link.label,
            },
          ]
        : [];
    });
    return { ...result, links };
  });
