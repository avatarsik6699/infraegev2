import { createServerFn } from "@tanstack/react-start";
import {
  setResponseHeader,
  setResponseStatus,
} from "@tanstack/react-start/server";
import { loadStandaloneTask } from "~/entities/practice-task";
import {
  findSubtopicBySection,
  findTopicOutline,
  lessonPublications,
  lessonSections,
  lessonSubtopics,
} from "~/entities/lesson";
import {
  courseLessonPublications,
  coursePublications,
  findCourseLessonOutline,
} from "~/entities/course";
import { theoryLinkLabel } from "~/shared/lib/theory-link-label";

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
    // Change 222: a link loads only the module of the topic or lesson it names.
    const linkGroups = await Promise.all(
      (result.detail.theoryLinks ?? []).map(async (link) => {
        const hash = link.section ? `#${link.section}` : "";
        const topic = lessonPublications.find(
          (item) => item.id === link.material_id && item.status === "published",
        );
        if (topic) {
          const outline = findTopicOutline(topic.routeSlug);
          const lesson = outline ? await outline.load() : undefined;
          const subtopic = lesson
            ? (link.section && findSubtopicBySection(lesson, link.section)) ||
              lessonSubtopics(lesson)[0]
            : undefined;
          return [
            {
              href: subtopic
                ? `/ege/${topic.routeSlug}/${subtopic.slug}${hash}`
                : `/ege/${topic.routeSlug}${hash}`,
              label: theoryLinkLabel(
                lesson ? lessonSections(lesson) : undefined,
                link.section,
              ),
            },
          ];
        }
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
        if (!lesson || !course) return [];
        const definition = await findCourseLessonOutline(
          course.routeSlug,
          lesson.routeSlug,
        )?.load();
        return [
          {
            href: `/courses/${course.routeSlug}/${lesson.routeSlug}${hash}`,
            label: theoryLinkLabel(
              definition?.paid?.outline ?? definition?.theory,
              link.section,
            ),
          },
        ];
      }),
    );
    const links = linkGroups.flat();
    return { ...result, links };
  });
