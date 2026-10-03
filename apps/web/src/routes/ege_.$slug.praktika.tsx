import { createFileRoute, notFound } from "@tanstack/react-router";
import { findLessonByRouteSlug, lessonPublications } from "~/entities/lesson";
import {
  getTopicLessonRouteData,
  TopicPracticePage,
} from "~/pages/topic-lesson";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/ege_/$slug/praktika")({
  loader: async ({ params }: { params: { slug: string } }) => {
    const publication = lessonPublications.find(
      (item) => item.routeSlug === params.slug,
    );
    if (!publication || !findLessonByRouteSlug(params.slug)) throw notFound();
    const routeData = await getTopicLessonRouteData({ data: params.slug });
    if (!routeData) throw notFound();
    return routeData;
  },
  head: ({ params }: { params: { slug: string } }) => {
    const publication = lessonPublications.find(
      (item) => item.routeSlug === params.slug,
    );
    return publication
      ? pageHead.create({
          title: `Практика и итог — ${publication.title} — infraege`,
          description: publication.summary,
          path: `/ege/${publication.routeSlug}/praktika`,
          type: "article",
          noIndex: publication.status !== "published",
        })
      : {};
  },
  component: TopicPracticeRoute,
});

function TopicPracticeRoute() {
  const params: { slug: string } = Route.useParams();
  const data = Route.useLoaderData();
  const lesson = findLessonByRouteSlug(params.slug);
  if (!lesson) return null;
  return (
    <TopicPracticePage
      lesson={lesson}
      tasks={data.tasks}
      practiceUnavailable={data.practiceUnavailable}
    />
  );
}
