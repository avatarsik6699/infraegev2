import { createFileRoute, notFound } from "@tanstack/react-router";
import { findLessonByRouteSlug } from "~/entities/lesson";
import { getTopicLessonRouteData, TopicLessonPage } from "~/pages/topic-lesson";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/ege/$slug")({
  loader: async ({ params }: { params: { slug: string } }) => {
    const lesson = findLessonByRouteSlug(params.slug);
    if (!lesson) throw notFound();
    const routeData = await getTopicLessonRouteData({ data: params.slug });
    if (!routeData) throw notFound();
    return routeData;
  },
  head: ({ params }: { params: { slug: string } }) => {
    const lesson = findLessonByRouteSlug(params.slug);
    return lesson
      ? pageHead.create({
          title: `${lesson.title} — infraege`,
          description: lesson.summary,
          path: `/ege/${lesson.routeSlug}`,
          type: "article",
          noIndex: lesson.status !== "published",
        })
      : {};
  },
  component: TopicLessonRoute,
});

function TopicLessonRoute() {
  const params = Route.useParams();
  const data = Route.useLoaderData();
  const lesson = findLessonByRouteSlug(params.slug);
  if (!lesson) return null;
  return <TopicLessonPage lesson={lesson} tasks={data.tasks} />;
}
