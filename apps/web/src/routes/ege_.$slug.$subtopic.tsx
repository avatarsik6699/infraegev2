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
import { accessState, getAccessState } from "~/entities/access";
import { getOffer } from "~/entities/billing";
import { paidContent } from "~/shared/lib/paid-content";
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
    const subtopic = lesson ? findSubtopic(lesson, params.subtopic) : undefined;
    if (!publication || !subtopic) throw notFound();
    // Change 192: every topic page knows the visitor's access, so the tree locks
    // paid subtopics of every topic alike; paid text renders from a loaded module,
    // never a suspended boundary, so SSR HTML stays complete without JavaScript.
    const [routeData, access] = await Promise.all([
      getTopicLessonRouteData({ data: params.slug }),
      getAccessState(),
    ]);
    if (!routeData) throw notFound();
    if (accessState.opens(access))
      await paidContent.preload(subtopic.paid?.load);
    // prices only for a visitor who meets the paywall here
    const offer =
      subtopic.paid && accessState.locks(access) ? await getOffer() : undefined;
    return { ...routeData, access, offer };
  },
  head: ({
    params,
    loaderData,
  }: {
    params: { slug: string; subtopic: string };
    loaderData?: { access?: { status: string; paywall?: boolean } };
  }) => {
    const publication = lessonPublications.find(
      (item) => item.routeSlug === params.slug,
    );
    const lesson = findLessonByRouteSlug(params.slug);
    const subtopic = lesson ? findSubtopic(lesson, params.subtopic) : undefined;
    if (!publication || !subtopic) return {};
    const meta = {
      title:
        subtopic.index === 0
          ? `${publication.title} — Кодумка`
          : `${subtopic.title} — ${publication.title} — Кодумка`,
      description: publication.summary,
      path: `/ege/${publication.routeSlug}/${subtopic.slug}`,
    };
    const head = pageHead.create({
      ...meta,
      type: "article",
      noIndex: publication.status !== "published",
    });
    // Change 192: a paid subtopic says so while the paywall is on
    return subtopic.paid && loaderData?.access?.paywall
      ? pageHead.withPaidArticle(head, meta)
      : head;
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
      lockedTasks={data.lockedTasks}
      access={data.access}
      offer={data.offer}
    />
  );
}
