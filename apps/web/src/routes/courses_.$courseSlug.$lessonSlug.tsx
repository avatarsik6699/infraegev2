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
} from "~/pages/course-lesson";
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
      } & NonNullable<CourseLessonLoaderData>)
    | undefined,
) {
  if (!loaderData) return {};
  const { course, lesson } = loaderData;
  return pageHead.create({
    title: `${lesson.title} — ${course.title}`,
    description: lesson.summary,
    path: `/courses/${course.routeSlug}/${lesson.routeSlug}`,
    type: "article",
    noIndex: [course.status, lesson.status].some(
      (status) => status !== "published",
    ),
  });
}

export const Route = createFileRoute("/courses_/$courseSlug/$lessonSlug")({
  loader: async ({ params }) => {
    const course = findCoursePublicationByRouteSlug(params.courseSlug);
    const lesson = findCourseLessonPublicationByRouteSlugs(
      params.courseSlug,
      params.lessonSlug,
    );
    if (!course || !lesson) throw notFound();
    const routeData = await getCourseLessonRouteData({
      data: {
        courseRouteSlug: params.courseSlug,
        lessonRouteSlug: params.lessonSlug,
      },
    });
    if (!routeData) throw notFound();
    return { course, lesson, tasks: routeData.tasks };
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
    <CourseLessonPage course={course} lesson={lesson} tasks={data.tasks} />
  );
}
