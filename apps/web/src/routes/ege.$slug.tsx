import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import {
  findLessonByRouteSlug,
  findSubtopicBySection,
  lessonSubtopics,
} from "~/entities/lesson";

// The topic URL opens its first subtopic page (Change 167). The browser keeps an old
// `#section` across the server redirect; client navigations resolve it here directly.
export const Route = createFileRoute("/ege/$slug")({
  beforeLoad: ({ params, location }) => {
    const lesson = findLessonByRouteSlug(params.slug);
    const first = lesson ? lessonSubtopics(lesson)[0] : undefined;
    if (!lesson || lesson.status !== "published" || !first) throw notFound();
    const hash = location.hash || undefined;
    const owner = hash ? findSubtopicBySection(lesson, hash) : undefined;
    throw redirect({
      to: "/ege/$slug/$subtopic",
      params: { slug: params.slug, subtopic: (owner ?? first).slug },
      hash,
      statusCode: 301,
    });
  },
});
