import { createFileRoute, notFound } from "@tanstack/react-router";
import { findLessonByRouteSlug, getLessonRouteData } from "~/entities/lesson";
import { TopicLessonPage } from "~/pages/topic-lesson";

export const Route = createFileRoute("/ege/$slug")({
  loader: async ({ params }: { params: { slug: string } }) => {
    const lesson = findLessonByRouteSlug(params.slug);
    if (!lesson) throw notFound();
    const routeData = await getLessonRouteData({ data: params.slug });
    if (!routeData) throw notFound();
    return routeData;
  },
  head: ({ params }: { params: { slug: string } }) => {
    const lesson = findLessonByRouteSlug(params.slug);
    return lesson
      ? {
          meta: [
            { title: `${lesson.title} — infraege` },
            { name: "description", content: lesson.summary },
            ...(lesson.status === "published"
              ? []
              : [{ name: "robots", content: "noindex,nofollow" }]),
          ],
        }
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
