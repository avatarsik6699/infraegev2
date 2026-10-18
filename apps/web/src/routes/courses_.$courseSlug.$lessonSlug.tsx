import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  findCourseByRouteSlug,
  findCourseLessonByRouteSlugs,
  findCourseLessonPublicationByRouteSlugs,
  findCoursePublicationByRouteSlug,
} from "~/entities/course";
import {
  CourseLessonPage,
  getCourseLessonRouteData,
  getCourseLessonSummary,
} from "~/pages/course-lesson";
import {
  accessState,
  getAccessState,
  type AccessTypes,
} from "~/entities/access";
import { getOffer } from "~/entities/billing";
import { paidContent } from "~/shared/lib/paid-content";
import { pageHead } from "~/shared/lib/seo";

type CourseLessonLoaderData =
  Awaited<ReturnType<typeof getCourseLessonRouteData>> extends infer TRouteData
    ? TRouteData
    : never;

function courseLessonHead(
  loaderData:
    | ({
        course: NonNullable<
          ReturnType<typeof findCoursePublicationByRouteSlug>
        >;
        lesson: NonNullable<
          ReturnType<typeof findCourseLessonPublicationByRouteSlugs>
        >;
      } & NonNullable<CourseLessonLoaderData> & {
          access?: AccessTypes.State;
        })
    | undefined,
) {
  if (!loaderData) return {};
  const { course, lesson } = loaderData;
  const meta = {
    title: `${lesson.title} — ${course.title}`,
    description: lesson.summary,
    path: `/courses/${course.routeSlug}/${lesson.routeSlug}`,
  };
  const head = pageHead.create({
    ...meta,
    type: "article",
    noIndex: [course.status, lesson.status].some(
      (status) => status !== "published",
    ),
  });
  // Change 192: a paid lesson says so while the paywall is on
  const access = loaderData.access;
  return findCourseLessonByRouteSlugs(course.routeSlug, lesson.routeSlug)
    ?.paid &&
    access?.status === "ready" &&
    access.paywall
    ? pageHead.withPaidArticle(head, meta)
    : head;
}

/** The rail's mastered checks are optional: a failed summary marks nothing. */
const getCourseLessonRouteSummary = (courseId: string) =>
  getCourseLessonSummary({ data: courseId }).catch(() => null);

export const Route = createFileRoute("/courses_/$courseSlug/$lessonSlug")({
  loader: async ({ params }) => {
    const course = findCoursePublicationByRouteSlug(params.courseSlug);
    const lesson = findCourseLessonPublicationByRouteSlugs(
      params.courseSlug,
      params.lessonSlug,
    );
    if (!course || !lesson) throw notFound();
    const definition = findCourseLessonByRouteSlugs(
      params.courseSlug,
      params.lessonSlug,
    );
    const [routeData, practiceSummary, access] = await Promise.all([
      getCourseLessonRouteData({
        data: {
          courseRouteSlug: params.courseSlug,
          lessonRouteSlug: params.lessonSlug,
        },
      }),
      getCourseLessonRouteSummary(course.id),
      // Change 192: every lesson knows the visitor's access, so the rail locks
      // paid lessons alike.
      getAccessState(),
    ]);
    if (!routeData) throw notFound();
    if (accessState.opens(access))
      await paidContent.preload(definition?.paid?.load);
    const offer =
      definition?.paid && accessState.locks(access)
        ? await getOffer()
        : undefined;
    return {
      course,
      lesson,
      tasks: routeData.tasks,
      lockedTasks: routeData.lockedTasks,
      practiceUnavailable: routeData.practiceUnavailable,
      practiceSummary,
      access,
      offer,
    };
  },
  head: ({ loaderData }) => courseLessonHead(loaderData),
  component: CourseLessonRoute,
});

function CourseLessonRoute() {
  const params = Route.useParams();
  const data = Route.useLoaderData();
  const course = findCourseByRouteSlug(params.courseSlug);
  const lesson = findCourseLessonByRouteSlugs(
    params.courseSlug,
    params.lessonSlug,
  );
  if (!course || !lesson) return null;
  return (
    <CourseLessonPage
      course={course}
      lesson={lesson}
      tasks={data.tasks}
      practiceUnavailable={data.practiceUnavailable}
      practiceSummary={data.practiceSummary}
      lockedTasks={data.lockedTasks}
      access={data.access}
      offer={data.offer}
    />
  );
}
