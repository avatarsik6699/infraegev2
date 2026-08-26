import { createFileRoute, notFound } from "@tanstack/react-router";
import { findCourseByRouteSlug, getCourseLessons } from "~/entities/course";
import { CourseOverviewPage } from "~/pages/course-overview";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/courses/$courseSlug")({
  beforeLoad: ({ params }) => {
    const course = findCourseByRouteSlug(params.courseSlug);
    if (!course) throw notFound();
  },
  head: ({ params }) => {
    const course = findCourseByRouteSlug(params.courseSlug);
    return course
      ? pageHead.create({
          title: `${course.title} — infraege`,
          description: course.summary,
          path: `/courses/${course.routeSlug}`,
          noIndex: course.status !== "published",
        })
      : {};
  },
  component: CourseOverviewRoute,
});

function CourseOverviewRoute() {
  const params = Route.useParams();
  const course = findCourseByRouteSlug(params.courseSlug);
  if (!course) return null;
  return (
    <CourseOverviewPage course={course} lessons={getCourseLessons(course)} />
  );
}
