import { createFileRoute, notFound } from "@tanstack/react-router";
import { findLessonByRouteSlug, lessonPublications } from "~/entities/lesson";
import {
  getTopicLessonRouteData,
  TopicPracticePage,
} from "~/pages/topic-lesson";
import { accessState, getAccessState } from "~/entities/access";
import { getOffer } from "~/entities/billing";
import { paidContent } from "~/shared/lib/paid-content";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/ege_/$slug/praktika")({
  loader: async ({ params }: { params: { slug: string } }) => {
    const publication = lessonPublications.find(
      (item) => item.routeSlug === params.slug,
    );
    const lesson = findLessonByRouteSlug(params.slug);
    if (!publication || !lesson) throw notFound();
    const [routeData, access] = await Promise.all([
      getTopicLessonRouteData({ data: params.slug }),
      getAccessState(),
    ]);
    if (accessState.opens(access))
      await paidContent.preload(lesson.paidPractice?.load);
    if (!routeData) throw notFound();
    const offer =
      lesson.paidPractice && accessState.locks(access)
        ? await getOffer()
        : undefined;
    return { ...routeData, access, offer };
  },
  head: ({
    params,
    loaderData,
  }: {
    params: { slug: string };
    loaderData?: { access?: { status: string; paywall?: boolean } };
  }) => {
    const publication = lessonPublications.find(
      (item) => item.routeSlug === params.slug,
    );
    if (!publication) return {};
    const meta = {
      title: `Практика и итог — ${publication.title} — infraege`,
      description: publication.summary,
      path: `/ege/${publication.routeSlug}/praktika`,
    };
    const head = pageHead.create({
      ...meta,
      type: "article",
      noIndex: publication.status !== "published",
    });
    // Change 192: a paid final page says so while the paywall is on
    return findLessonByRouteSlug(params.slug)?.paidPractice &&
      loaderData?.access?.paywall
      ? pageHead.withPaidArticle(head, meta)
      : head;
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
      lockedTasks={data.lockedTasks}
      access={data.access}
      offer={data.offer}
    />
  );
}
