import { createFileRoute } from "@tanstack/react-router";
import {
  CourseCatalogPage,
  getCatalogPracticeSummaries,
} from "~/pages/course-catalog";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/courses/")({
  loader: () => getCatalogPracticeSummaries(),
  head: () =>
    pageHead.create({
      title: "Мини-курсы — Кодумка",
      description:
        "Самостоятельные мини-курсы по информатике: курсы Python и Excel и будущие программы по алгоритмам и задачам повышенной сложности.",
      path: "/courses",
    }),
  component: CourseCatalogRoute,
});

function CourseCatalogRoute() {
  const summaries = Route.useLoaderData();
  return <CourseCatalogPage summaries={summaries} />;
}
