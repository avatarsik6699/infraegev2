import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  findLessonByRouteSlug,
  findSubtopic,
  lessonPublications,
} from "~/entities/lesson";
import {
  getTopicLessonRouteData,
  TopicSubtopicPage,
} from "~/pages/topic-lesson";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/ege_/$slug/$subtopic")({
  loader: async ({
    params,
  }: {
    params: { slug: string; subtopic: string };
  }) => {
    const publication = lessonPublications.find(
      (item) => item.routeSlug === params.slug,
    );
    const lesson = findLessonByRouteSlug(params.slug);
    if (!publication || !lesson || !findSubtopic(lesson, params.subtopic))
      throw notFound();
    const routeData = await getTopicLessonRouteData({ data: params.slug });
    if (!routeData) throw notFound();
    return routeData;
  },
  head: ({ params }: { params: { slug: string; subtopic: string } }) => {
    const publication = lessonPublications.find(
      (item) => item.routeSlug === params.slug,
    );
    const lesson = findLessonByRouteSlug(params.slug);
    const subtopic = lesson ? findSubtopic(lesson, params.subtopic) : undefined;
    if (!publication || !subtopic) return {};
    return pageHead.create({
      title:
        subtopic.index === 0
          ? `${publication.title} — infraege`
          : `${subtopic.title} — ${publication.title} — infraege`,
      description: publication.summary,
      path: `/ege/${publication.routeSlug}/${subtopic.slug}`,
      type: "article",
      noIndex: publication.status !== "published",
    });
  },
  component: TopicSubtopicRoute,
});

function TopicSubtopicRoute() {
  const params: { slug: string; subtopic: string } = Route.useParams();
  const data = Route.useLoaderData();
  const lesson = findLessonByRouteSlug(params.slug);
  const subtopic = lesson ? findSubtopic(lesson, params.subtopic) : undefined;
  if (!lesson || !subtopic) return null;
  return (
    <TopicSubtopicPage
      key={subtopic.slug}
      lesson={lesson}
      subtopic={subtopic}
      tasks={data.tasks}
      practiceUnavailable={data.practiceUnavailable}
    />
  );
}
