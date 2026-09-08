import { createFileRoute } from "@tanstack/react-router";
import { CourseCatalogPage } from "~/pages/course-catalog";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/courses/")({
  head: () =>
    pageHead.create({
      title: "Мини-курсы — infraege",
      description:
        "Самостоятельные мини-курсы по информатике: полный курс Python и будущие программы по Excel, алгоритмам и задачам повышенной сложности.",
      path: "/courses",
    }),
  component: CourseCatalogPage,
});
